import { describe, it, expect } from 'vitest';

import { createSceneDocument, foldSceneEvents } from '../../scene/runtime';
import {
  cellInArea,
  gridDistance,
  makeEffectId,
  resolveAreaEffect,
  resolveMultiTargetAttack,
  tokensInArea,
  type AreaShape,
  type EffectInstance,
  type SaveParticipant,
} from '../../rules';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * PHASE 4 (RFC 003): participant-aware resolution — N targets per interaction.
 * Multi-target attacks (independent roll per target) and area-of-effect (shared
 * damage roll, independent save per participant). The defining invariant: target
 * ORDER never changes any participant's outcome (replay-stable, fair targeting).
 */

const SID = 'dnd-5e-2014' as const;

function attackEffect(bonus: number): EffectInstance {
  return {
    id: makeEffectId(SID, 'attack', 'base', bonus),
    systemId: SID,
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack bonus',
  };
}

function fireballDamage(): EffectInstance[] {
  return [
    {
      id: makeEffectId(SID, 'damage.fire', 'd6', 1),
      systemId: SID,
      target: 'damage.fire',
      operation: 'add-die',
      value: 6,
      stackPolicy: 'sum',
      source: { kind: 'spell', label: 'Fireball' },
      label: '1d6 fire',
    },
    {
      id: makeEffectId(SID, 'damage.fire', 'd6', 2),
      systemId: SID,
      target: 'damage.fire',
      operation: 'add-die',
      value: 6,
      stackPolicy: 'sum',
      source: { kind: 'spell', label: 'Fireball' },
      label: '1d6 fire',
    },
  ];
}

describe('resolveMultiTargetAttack — N targets, independent rolls', () => {
  it('produces one resolution per target', () => {
    const result = resolveMultiTargetAttack({
      actorId: 'fighter',
      seed: 'turn-1',
      attackEffects: [attackEffect(5)],
      damageEffects: [
        {
          id: 'd',
          systemId: SID,
          target: 'damage',
          operation: 'add-die',
          value: 8,
          stackPolicy: 'sum',
          source: { kind: 'item', label: 'sword' },
          label: '1d8',
        },
      ],
      targets: [
        { targetId: 'goblin-a', targetValue: 12 },
        { targetId: 'goblin-b', targetValue: 15 },
        { targetId: 'goblin-c', targetValue: 18 },
      ],
    });
    expect(result.perTarget).toHaveLength(3);
    expect(result.perTarget.map((t) => t.targetId)).toEqual(['goblin-a', 'goblin-b', 'goblin-c']);
    expect(result.hitCount).toBe(result.perTarget.filter((t) => t.resolution.isHit).length);
  });

  it('INVARIANT: target order does not change any per-target outcome', () => {
    const base = {
      actorId: 'fighter',
      seed: 'turn-7',
      attackEffects: [attackEffect(6)],
      damageEffects: [
        {
          id: 'd',
          systemId: SID,
          target: 'damage',
          operation: 'add-die' as const,
          value: 8,
          stackPolicy: 'sum' as const,
          source: { kind: 'item' as const, label: 'sword' },
          label: '1d8',
        },
      ],
      targets: [
        { targetId: 'a', targetValue: 14 },
        { targetId: 'b', targetValue: 14 },
        { targetId: 'c', targetValue: 14 },
      ],
    };
    const forward = resolveMultiTargetAttack(base);
    const reversed = resolveMultiTargetAttack({ ...base, targets: [...base.targets].reverse() });

    // Build target -> outcome maps; they must match regardless of order.
    const byId = (r: typeof forward) =>
      Object.fromEntries(r.perTarget.map((t) => [t.targetId, JSON.stringify(t.resolution)]));
    expect(byId(reversed)).toEqual(byId(forward));
  });

  it('determinism: same seed yields identical results', () => {
    const input = {
      actorId: 'a',
      seed: 's',
      attackEffects: [attackEffect(4)],
      targets: [{ targetId: 'x', targetValue: 12 }],
    };
    expect(JSON.stringify(resolveMultiTargetAttack(input))).toBe(
      JSON.stringify(resolveMultiTargetAttack(input))
    );
  });

  it('REGRESSION (05-L2): listing the same target twice rolls two distinct streams', () => {
    // Two strikes at one foe must not be byte-identical rolls. The occurrence
    // index feeds the nonce, so the pair stays order-independent for distinct
    // targets while repeats separate.
    const result = resolveMultiTargetAttack({
      actorId: 'fighter',
      seed: 'flurry',
      attackEffects: [attackEffect(5)],
      damageEffects: [
        {
          id: 'd',
          systemId: SID,
          target: 'damage',
          operation: 'add-die',
          value: 8,
          stackPolicy: 'sum',
          source: { kind: 'item', label: 'sword' },
          label: '1d8',
        },
      ],
      targets: [
        { targetId: 'ogre', targetValue: 12 },
        { targetId: 'ogre', targetValue: 12 },
      ],
    });
    expect(result.perTarget).toHaveLength(2);
    const [first, second] = result.perTarget.map((entry) => JSON.stringify(entry.resolution));
    expect(first).not.toBe(second);

    // The first occurrence shares the plain (seed, actor, target) stream, so a
    // single-strike resolution of the same pairing is unchanged.
    const single = resolveMultiTargetAttack({
      actorId: 'fighter',
      seed: 'flurry',
      attackEffects: [attackEffect(5)],
      damageEffects: [
        {
          id: 'd',
          systemId: SID,
          target: 'damage',
          operation: 'add-die',
          value: 8,
          stackPolicy: 'sum',
          source: { kind: 'item', label: 'sword' },
          label: '1d8',
        },
      ],
      targets: [{ targetId: 'ogre', targetValue: 12 }],
    });
    expect(JSON.stringify(single.perTarget[0].resolution)).toBe(first);
  });

  it('REGRESSION (05-L2): participant seeds cannot collide via separator injection', () => {
    // Before length-prefixing, actor "a->b" vs "a" with targets "c" vs "b->c"
    // (and ::-shaped ids) could join to the same seed string and share rolls.
    const rolls = (actorId: string, targetId: string) => {
      const result = resolveMultiTargetAttack({
        actorId,
        seed: 'base',
        attackEffects: [attackEffect(0)],
        targets: [{ targetId, targetValue: 10 }],
      });
      return JSON.stringify(result.perTarget[0].resolution.d20Terms);
    };
    expect(rolls('a->b', 'c')).not.toBe(rolls('a', 'b->c'));
    expect(rolls('a::x', 'y')).not.toBe(rolls('a', 'x::y'));
  });

  it('per-target context applies (a vulnerable target can have extra attack effects)', () => {
    const result = resolveMultiTargetAttack({
      actorId: 'a',
      seed: 's',
      attackEffects: [attackEffect(0)],
      targets: [
        {
          targetId: 'prone',
          targetValue: 10,
          extraAttackEffects: [
            {
              id: 'adv',
              systemId: SID,
              target: 'attack',
              operation: 'advantage',
              value: null,
              stackPolicy: 'sum',
              source: { kind: 'condition', label: 'prone target (melee)' },
              label: 'advantage vs prone',
            },
          ],
        },
      ],
    });
    expect(result.perTarget[0].resolution.rollMode).toBe('advantage');
    expect(result.perTarget[0].resolution.d20Terms).toHaveLength(2);
  });
});

describe('resolveAreaEffect — shared damage roll, independent saves', () => {
  it('rolls damage once and shares it; each target saves independently', () => {
    const participants: SaveParticipant[] = [
      { targetId: 'a', saveBonus: 0 },
      { targetId: 'b', saveBonus: 100 }, // always saves
      { targetId: 'c', saveBonus: -100 }, // never saves
    ];
    const result = resolveAreaEffect({
      sourceId: 'wizard',
      seed: 'fb-1',
      damageEffects: fireballDamage(),
      saveDC: 15,
      halfOnSave: true,
      participants,
    });

    expect(result.perTarget).toHaveLength(3);
    // b always saves -> half; c never saves -> full.
    const b = result.perTarget.find((t) => t.targetId === 'b')!;
    const c = result.perTarget.find((t) => t.targetId === 'c')!;
    expect(b.saved).toBe(true);
    expect(b.damageTaken).toBe(Math.floor(result.sharedDamage / 2));
    expect(c.saved).toBe(false);
    expect(c.damageTaken).toBe(result.sharedDamage);
  });

  it('halfOnSave=false negates damage on a successful save', () => {
    const result = resolveAreaEffect({
      sourceId: 'trap',
      seed: 'x',
      damageEffects: fireballDamage(),
      saveDC: 10,
      halfOnSave: false,
      participants: [{ targetId: 'saver', saveBonus: 100 }],
    });
    expect(result.perTarget[0].saved).toBe(true);
    expect(result.perTarget[0].damageTaken).toBe(0);
  });

  it('INVARIANT: participant order does not change shared damage or any outcome', () => {
    const participants: SaveParticipant[] = [
      { targetId: 'a', saveBonus: 2 },
      { targetId: 'b', saveBonus: 5 },
      { targetId: 'c', saveBonus: -1 },
    ];
    const input = {
      sourceId: 'wizard',
      seed: 'fb-2',
      damageEffects: fireballDamage(),
      saveDC: 14,
      participants,
    };
    const forward = resolveAreaEffect(input);
    const reversed = resolveAreaEffect({ ...input, participants: [...participants].reverse() });

    expect(reversed.sharedDamage).toBe(forward.sharedDamage);
    const byId = (r: typeof forward) =>
      Object.fromEntries(r.perTarget.map((t) => [t.targetId, JSON.stringify(t)]));
    expect(byId(reversed)).toEqual(byId(forward));
  });

  it('shared damage is rolled exactly once (all targets reference the same number)', () => {
    const result = resolveAreaEffect({
      sourceId: 'w',
      seed: 'once',
      damageEffects: fireballDamage(),
      saveDC: 100, // nobody saves
      participants: [
        { targetId: 'a', saveBonus: 0 },
        { targetId: 'b', saveBonus: 0 },
      ],
    });
    // Nobody saves => everyone takes the identical shared damage.
    expect(result.perTarget[0].damageTaken).toBe(result.sharedDamage);
    expect(result.perTarget[1].damageTaken).toBe(result.sharedDamage);
  });
});

describe('area targeting geometry', () => {
  function sceneWithTokens(...tokens: SceneToken[]): SceneState {
    const scene = createSceneDocument({ id: 's', name: 'S', systemId: SID });
    const state = foldSceneEvents(scene).state;
    for (const t of tokens) state.tokens[t.id] = t;
    return state;
  }
  const tok = (id: string, x: number, y: number): SceneToken => ({
    id,
    name: id,
    kind: 'monster',
    position: { x, y },
    size: 1,
  });

  it('chebyshev distance is king-move', () => {
    expect(gridDistance({ x: 0, y: 0 }, { x: 3, y: 1 })).toBe(3);
  });

  it('burst selects tokens within radius (the participant set)', () => {
    const state = sceneWithTokens(tok('near', 5, 5), tok('edge', 7, 5), tok('far', 9, 9));
    const burst: AreaShape = { kind: 'burst', origin: { x: 5, y: 5 }, radius: 2 };
    const ids = tokensInArea(state, burst).map((t) => t.id);
    expect(ids).toContain('near');
    expect(ids).toContain('edge');
    expect(ids).not.toContain('far');
  });

  it('rect area selects by footprint', () => {
    expect(
      cellInArea({ x: 2, y: 2 }, { kind: 'rect', origin: { x: 0, y: 0 }, width: 3, height: 3 })
    ).toBe(true);
    expect(
      cellInArea({ x: 3, y: 2 }, { kind: 'rect', origin: { x: 0, y: 0 }, width: 3, height: 3 })
    ).toBe(false);
  });

  it('line area includes endpoints along the walk', () => {
    const line: AreaShape = { kind: 'line', origin: { x: 0, y: 0 }, to: { x: 3, y: 0 } };
    expect(cellInArea({ x: 0, y: 0 }, line)).toBe(true);
    expect(cellInArea({ x: 2, y: 0 }, line)).toBe(true);
    expect(cellInArea({ x: 2, y: 2 }, line)).toBe(false);
  });
});
