import { describe, it, expect } from 'vitest';

import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import {
  executeTacticalTurn,
  makeEffectId,
  maxPossibleDamage,
  scoreTargets,
  type EffectInstance,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';
import type { SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * PHASE 11 (RFC 003): the local tactical executor. A combatant's turn is a
 * deterministic decision over EVERY candidate in the loop (N participants), then
 * a seeded resolution. No LLM in the hot path; the full scored list is exposed.
 */

const SID = 'dnd-5e-2014' as const;

const atk = (bonus: number): EffectInstance => ({
  id: makeEffectId(SID, 'attack', bonus),
  systemId: SID,
  target: 'attack',
  operation: 'add',
  value: bonus,
  stackPolicy: 'sum',
  source: { kind: 'system', label: 'atk' },
  label: 'atk',
});

const dmg = (sides: number, flat: number): EffectInstance[] => [
  {
    id: 'die',
    systemId: SID,
    target: 'damage',
    operation: 'add-die',
    value: sides,
    stackPolicy: 'sum',
    source: { kind: 'item', label: 'w' },
    label: 'die',
  },
  {
    id: 'flat',
    systemId: SID,
    target: 'damage',
    operation: 'add',
    value: flat,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'str' },
    label: 'flat',
  },
];

function actor(over: Partial<TacticalActor> = {}): TacticalActor {
  return {
    tokenId: 'hero',
    faction: 'party',
    position: { x: 0, y: 0 },
    attackEffects: [atk(5)],
    damageEffects: dmg(8, 3),
    reach: 1,
    ...over,
  };
}

function target(id: string, over: Partial<TacticalTarget> = {}): TacticalTarget {
  return {
    tokenId: id,
    faction: 'monsters',
    position: { x: 1, y: 0 },
    armorClass: 12,
    hp: { current: 10, max: 10 },
    ...over,
  };
}

describe('scoreTargets — acknowledges every participant', () => {
  it('returns a score for every hostile living target', () => {
    const scored = scoreTargets(actor(), [
      target('a', { position: { x: 1, y: 0 } }),
      target('b', { position: { x: 5, y: 0 } }),
      target('c', { position: { x: 3, y: 0 } }),
    ]);
    expect(scored).toHaveLength(3);
    expect(new Set(scored.map((s) => s.tokenId))).toEqual(new Set(['a', 'b', 'c']));
  });

  it('excludes allies and the dead', () => {
    const scored = scoreTargets(actor(), [
      target('ally', { faction: 'party' }),
      target('corpse', { hp: { current: 0, max: 10 } }),
      target('foe'),
    ]);
    expect(scored.map((s) => s.tokenId)).toEqual(['foe']);
  });

  it('prefers the closer of two equal targets', () => {
    const scored = scoreTargets(actor(), [
      target('far', { position: { x: 6, y: 0 } }),
      target('near', { position: { x: 1, y: 0 } }),
    ]);
    expect(scored[0].tokenId).toBe('near');
  });

  it('prefers a wounded target (focus fire) over a healthy one at equal range', () => {
    const scored = scoreTargets(actor({ reach: 5 }), [
      target('healthy', { position: { x: 2, y: 0 }, hp: { current: 10, max: 10 } }),
      target('wounded', { position: { x: 2, y: 0 }, hp: { current: 2, max: 10 } }),
    ]);
    expect(scored[0].tokenId).toBe('wounded');
  });

  it('flags a finishable target (max damage >= current hp) when in reach', () => {
    const scored = scoreTargets(actor(), [target('weak', { hp: { current: 4, max: 10 } })]);
    // max damage = 8 (die) + 3 (flat) = 11 >= 4
    expect(scored[0].canFinish).toBe(true);
  });

  it('maxPossibleDamage = sum of die faces and flat adds', () => {
    expect(maxPossibleDamage(dmg(8, 3))).toBe(11);
  });

  it('is deterministic and id-tie-broken (no RNG in scoring)', () => {
    const ts = [target('b'), target('a')];
    const first = scoreTargets(actor(), ts).map((s) => s.tokenId);
    const second = scoreTargets(actor(), [...ts].reverse()).map((s) => s.tokenId);
    expect(first).toEqual(second);
  });
});

describe('executeTacticalTurn — decide + resolve', () => {
  it('no targets → no-target decision', () => {
    const result = executeTacticalTurn({ actor: actor(), targets: [], seed: 's' });
    expect(result.decision).toBe('no-target');
    expect(result.intent).toBeUndefined();
  });

  it('best target out of reach → move-to-engage (movement is a later phase)', () => {
    const result = executeTacticalTurn({
      actor: actor({ reach: 1 }),
      targets: [target('far', { position: { x: 9, y: 0 } })],
      seed: 's',
    });
    expect(result.decision).toBe('move-to-engage');
    expect(result.chosenTargetId).toBe('far');
    expect(result.intent).toBeUndefined();
  });

  it('reachable target → attack, with a transparent scored list', () => {
    const result = executeTacticalTurn({
      actor: actor({ attackEffects: [atk(50)] }), // guaranteed hit
      targets: [target('goblin', { armorClass: 12, hp: { current: 30, max: 30 } })],
      seed: 'turn-1',
      cause: 'longsword',
    });
    expect(result.decision).toBe('attack');
    expect(result.chosenTargetId).toBe('goblin');
    expect(result.resolution?.isHit).toBe(true);
    expect(result.intent).toBeDefined();
    expect(result.scored).toHaveLength(1);
  });

  it('picks the highest-scored reachable target among several', () => {
    const result = executeTacticalTurn({
      actor: actor({ reach: 10, attackEffects: [atk(50)] }),
      targets: [
        target('healthy', { position: { x: 2, y: 0 }, hp: { current: 30, max: 30 } }),
        target('almost-dead', { position: { x: 2, y: 0 }, hp: { current: 3, max: 30 } }),
      ],
      seed: 's',
    });
    // almost-dead is both wounded and finishable → highest score.
    expect(result.chosenTargetId).toBe('almost-dead');
  });

  it('end to end: the produced intent applies damage on the grid', () => {
    // Build a scene with the chosen target as a token.
    let scene: SceneDocument = createSceneDocument({ id: 'c', name: 'C', systemId: SID });
    const goblin: SceneToken = {
      id: 'goblin',
      name: 'Goblin',
      kind: 'monster',
      position: { x: 1, y: 0 },
      size: 1,
      hp: { current: 30, max: 30, temp: 0 },
    };
    const place = resolveSceneAction(
      scene,
      { type: 'place-token', token: goblin },
      { eventId: 'p' }
    );
    scene = appendSceneEvent(scene, place.event!);

    const turn = executeTacticalTurn({
      actor: actor({ attackEffects: [atk(50)] }),
      targets: [target('goblin', { armorClass: 12, hp: { current: 30, max: 30 } })],
      seed: 'turn-1',
    });
    expect(turn.intent).toBeDefined();

    const apply = resolveSceneAction(scene, turn.intent!, { eventId: 'dmg' });
    scene = appendSceneEvent(scene, apply.event!);
    const hp = foldSceneEvents(scene).state.tokens.goblin.hp!.current;
    expect(hp).toBe(30 - turn.resolution!.damage);
  });

  it('is deterministic: same seed + same board → same decision and rolls', () => {
    const input = {
      actor: actor(),
      targets: [target('a'), target('b', { position: { x: 1, y: 1 } })],
      seed: 'fixed',
    };
    expect(JSON.stringify(executeTacticalTurn(input))).toBe(
      JSON.stringify(executeTacticalTurn(input))
    );
  });
});
