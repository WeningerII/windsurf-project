import { describe, it, expect } from 'vitest';

import { createSeededRng } from '../../scene/seededRng';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import {
  areaEffectToDamageIntent,
  attackToDamageIntent,
  makeEffectId,
  multiTargetAttackToDamageIntent,
  resolveAreaEffect,
  resolveAttack,
  resolveMultiTargetAttack,
  type EffectInstance,
  type SaveParticipant,
} from '../../rules';
import type { SceneActionIntent, SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * PHASE 4 (RFC 003): the full loop slice — resolver outcome -> scene damage
 * intent -> validated event -> HP on the grid. End to end, deterministic.
 */

const SID = 'dnd-5e-2014' as const;

function combatant(id: string, hp: number): SceneToken {
  return {
    id,
    name: id,
    kind: 'monster',
    position: { x: 1, y: 1 },
    size: 1,
    hp: { current: hp, max: hp, temp: 0 },
  };
}

function sceneWith(...tokens: SceneToken[]): SceneDocument {
  let scene = createSceneDocument({ id: 'c', name: 'C', systemId: SID, seed: 'fixed-seed' });
  for (const token of tokens) {
    const r = resolveSceneAction(
      scene,
      { type: 'place-token', token },
      { eventId: `p-${token.id}` }
    );
    scene = appendSceneEvent(scene, r.event!);
  }
  return scene;
}

function applyIntent(
  scene: SceneDocument,
  intent: SceneActionIntent,
  eventId: string
): SceneDocument {
  const r = resolveSceneAction(scene, intent, { eventId });
  expect(r.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
  return appendSceneEvent(scene, r.event!);
}

function hp(scene: SceneDocument, id: string): number {
  return foldSceneEvents(scene).state.tokens[id].hp!.current;
}

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

describe('single attack -> scene damage', () => {
  it('a hit produces a damage intent that lowers target HP; a miss produces none', () => {
    let scene = sceneWith(combatant('orc', 30));
    const hit = resolveAttack({
      attackEffects: [atk(50)],
      damageEffects: dmg(8, 3),
      targetValue: 10,
      rng: createSeededRng('h'),
    });
    const intent = attackToDamageIntent('hero', 'orc', hit, 'longsword');
    expect(intent).toBeDefined();
    scene = applyIntent(scene, intent!, 'a1');
    expect(hp(scene, 'orc')).toBe(30 - hit.damage);

    const miss = resolveAttack({
      attackEffects: [atk(0)],
      targetValue: 999,
      rng: createSeededRng('m'),
    });
    if (!miss.isCriticalHit) {
      expect(attackToDamageIntent('hero', 'orc', miss)).toBeUndefined();
    }
  });
});

describe('multi-target attack -> one scene damage event', () => {
  it('only hit targets take damage, in a single event', () => {
    let scene = sceneWith(combatant('a', 20), combatant('b', 20), combatant('c', 20));
    const result = resolveMultiTargetAttack({
      actorId: 'sweeper',
      seed: 'turn',
      attackEffects: [atk(50)], // hits all
      damageEffects: dmg(6, 2),
      targets: [
        { targetId: 'a', targetValue: 10 },
        { targetId: 'b', targetValue: 10 },
        { targetId: 'c', targetValue: 10 },
      ],
    });
    const intent = multiTargetAttackToDamageIntent(result, 'cleave');
    expect(intent).toBeDefined();
    scene = applyIntent(scene, intent!, 'sweep');
    // All three hit; each took its own rolled damage.
    expect(hp(scene, 'a')).toBeLessThan(20);
    expect(hp(scene, 'b')).toBeLessThan(20);
    expect(hp(scene, 'c')).toBeLessThan(20);
  });

  it('all-miss produces no intent', () => {
    const result = resolveMultiTargetAttack({
      actorId: 's',
      seed: 't',
      attackEffects: [atk(0)],
      damageEffects: dmg(6, 0),
      targets: [{ targetId: 'a', targetValue: 999 }],
    });
    if (result.hitCount === 0) {
      expect(multiTargetAttackToDamageIntent(result)).toBeUndefined();
    }
  });
});

describe('area effect -> one scene damage event (N participants)', () => {
  it('applies per-participant damage (full/half) in a single auditable event', () => {
    let scene = sceneWith(combatant('a', 30), combatant('b', 30));
    const participants: SaveParticipant[] = [
      { targetId: 'a', saveBonus: -100 }, // never saves -> full
      { targetId: 'b', saveBonus: 100 }, // always saves -> half
    ];
    const area = resolveAreaEffect({
      sourceId: 'wizard',
      seed: 'fb',
      damageEffects: [
        {
          id: 'd1',
          systemId: SID,
          target: 'damage.fire',
          operation: 'add-die',
          value: 6,
          stackPolicy: 'sum',
          source: { kind: 'spell', label: 'fb' },
          label: 'd6',
        },
        {
          id: 'd2',
          systemId: SID,
          target: 'damage.fire',
          operation: 'add-die',
          value: 6,
          stackPolicy: 'sum',
          source: { kind: 'spell', label: 'fb' },
          label: 'd6',
        },
      ],
      saveDC: 15,
      participants,
    });
    const intent = areaEffectToDamageIntent(area, 'fireball');
    expect(intent).toBeDefined();
    scene = applyIntent(scene, intent!, 'fb');

    const aTaken = 30 - hp(scene, 'a');
    const bTaken = 30 - hp(scene, 'b');
    expect(aTaken).toBe(area.sharedDamage); // full
    expect(bTaken).toBe(Math.floor(area.sharedDamage / 2)); // half
  });

  /**
   * The join that made §3.2's typed-damage engine reachable from real combat.
   *
   * The engine, the mitigation transform and the 395 resistance declarations in
   * `src/data/` all shipped before this test existed — but `attackToDamageIntent`
   * summed the `damage.<type>` effect channels into one scalar and dropped the
   * type, so a fire-resistant creature took FULL fire damage on the grid. This
   * drives the whole loop: typed effect -> resolver -> intent -> validated event
   * -> halved HP.
   */
  it('halves a resisted attack end to end, and leaves an unresisted one whole', () => {
    const fireResistant = {
      ...combatant('resistant', 40),
      damageProfile: { resistances: ['fire' as const] },
    };
    const plain = combatant('plain', 40);
    let scene = sceneWith(fireResistant, plain);

    // One typed damage channel: a flat 10 fire. `damage.fire`, not `damage`.
    const fireDamage: EffectInstance[] = [
      {
        id: makeEffectId(SID, 'damage.fire', 'src', 'burn', 'flat', 0, 0),
        systemId: SID,
        target: 'damage.fire',
        operation: 'add',
        value: 10,
        stackPolicy: 'sum',
        source: { kind: 'custom', id: 'src', label: 'burn' },
        label: 'burn',
      },
    ];

    const resolveBurn = () =>
      resolveAttack({
        attackEffects: [],
        damageEffects: fireDamage,
        targetValue: 0, // always hits, so the test is about mitigation only
        rng: createSeededRng('burn'),
      });

    const resolution = resolveBurn();
    expect(resolution.isHit).toBe(true);
    expect(resolution.damage).toBe(10);
    // The type survives resolution now — this is the field that was missing.
    expect(resolution.damageType).toBe('fire');

    scene = applyIntent(scene, attackToDamageIntent('src', 'resistant', resolveBurn())!, 'd-1');
    scene = applyIntent(scene, attackToDamageIntent('src', 'plain', resolveBurn())!, 'd-2');

    expect(40 - hp(scene, 'resistant')).toBe(5); // halved by resistance
    expect(40 - hp(scene, 'plain')).toBe(10); // no profile, untouched

    // The event explains its own number rather than just recording the result.
    const damaged = scene.events.filter((e) => e.type === 'token.damaged');
    const resisted = damaged.find((e) =>
      (e.payload as { damages: Array<{ tokenId: string }> }).damages.some(
        (d) => d.tokenId === 'resistant'
      )
    );
    const entry = (
      resisted!.payload as {
        damages: Array<{ mitigation?: string; raw?: number; type?: string }>;
      }
    ).damages[0];
    expect(entry.type).toBe('fire');
    expect(entry.mitigation).toBe('resistant');
    expect(entry.raw).toBe(10);
  });
});
