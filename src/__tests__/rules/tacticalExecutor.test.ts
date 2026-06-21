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

describe('Multiattack (SRD): attacksPerRound', () => {
  it('resolves N attacks in one turn, each with distinct seeded rolls', () => {
    const turn = executeTacticalTurn({
      actor: actor({ attacksPerRound: 3, attackEffects: [atk(20)] }), // always hits AC 12
      targets: [target('tank', { hp: { current: 999, max: 999 } })],
      seed: 'multi-seed',
    });

    expect(turn.decision).toBe('attack');
    expect(turn.attacks).toHaveLength(3);
    expect(turn.attacks.every((attack) => attack.targetId === 'tank')).toBe(true);
    // Sequential resolutions consume one shared per-pair stream — the d20s
    // must not be byte-identical repeats of a reused stream head.
    const d20s = turn.attacks.map((attack) => attack.resolution.naturalRoll);
    expect(new Set(d20s).size).toBeGreaterThan(1);
    // Back-compat: the legacy single-attack fields mirror the first attack.
    expect(turn.resolution).toBe(turn.attacks[0].resolution);
    expect(turn.intent).toBe(turn.attacks[0].intent);
  });

  it('re-targets remaining attacks after the current target drops', () => {
    const turn = executeTacticalTurn({
      // +20 to hit, flat 10 damage per swing (no die): two swings kill 'first'.
      actor: actor({
        attacksPerRound: 4,
        attackEffects: [atk(20)],
        damageEffects: [
          {
            id: 'flat',
            systemId: SID,
            target: 'damage',
            operation: 'add',
            value: 10,
            stackPolicy: 'sum',
            source: { kind: 'system', label: 'str' },
            label: 'flat',
          },
        ],
      }),
      targets: [
        target('first', { hp: { current: 20, max: 20 }, position: { x: 1, y: 0 } }),
        target('second', { hp: { current: 20, max: 20 }, position: { x: 0, y: 1 } }),
      ],
      seed: 'cleave-seed',
    });

    expect(turn.attacks).toHaveLength(4);
    // Deterministic property, robust to nat-1 auto-misses in the seeded
    // stream: attacks stay on 'first' until exactly two hits land (20 HP /
    // 10 damage), then every remaining attack re-targets 'second'.
    let hitsOnFirst = 0;
    for (const attack of turn.attacks) {
      if (hitsOnFirst < 2) {
        expect(attack.targetId).toBe('first');
      } else {
        expect(attack.targetId).toBe('second');
      }
      if (attack.targetId === 'first' && attack.resolution.isHit) {
        hitsOnFirst += 1;
      }
    }
    expect(hitsOnFirst).toBe(2);
  });

  it('replays byte-identically for the same seed', () => {
    const run = () =>
      executeTacticalTurn({
        actor: actor({ attacksPerRound: 3 }),
        targets: [target('foe')],
        seed: 'replay-seed',
      });
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });
});

describe('movement execution (grid-combat phase 3)', () => {
  it('moves toward an out-of-reach target and attacks after closing (RAW move + single attack)', () => {
    const turn = executeTacticalTurn({
      actor: actor({
        position: { x: 0, y: 0 },
        reach: 1,
        speedCells: 6,
        attacksPerRound: 3, // full attack NOT allowed after moving
        attackEffects: [atk(20)],
      }),
      targets: [target('far', { position: { x: 5, y: 0 }, hp: { current: 50, max: 50 } })],
      seed: 'move-attack-seed',
    });

    expect(turn.decision).toBe('attack');
    expect(turn.move?.to).toEqual({ x: 4, y: 0 }); // stops at reach 1
    expect(turn.move?.intent).toEqual({
      type: 'move-token',
      tokenId: 'hero',
      position: { x: 4, y: 0 },
    });
    // Moving permits one attack, not the Multiattack routine.
    expect(turn.attacks).toHaveLength(1);
  });

  it('detours around a blocker and never lands on an occupied cell (movement context)', async () => {
    const { cellKey } = await import('../../scene/grid');
    // Straight line (0,0)->(4,0) is walled at x=2 and x=3 (y=0); the target
    // occupies (4,0). The open-field approach would stop on (3,0) — which is
    // blocked here — so only an obstacle-aware route can find a legal in-reach
    // cell. The destination must therefore avoid every blocked cell.
    const blocked = new Set(
      [
        [2, 0],
        [3, 0],
        [4, 0],
      ].map(([x, y]) => cellKey({ x, y }))
    );
    const turn = executeTacticalTurn({
      actor: actor({ position: { x: 0, y: 0 }, reach: 1, speedCells: 8, attackEffects: [atk(50)] }),
      targets: [target('far', { position: { x: 4, y: 0 }, hp: { current: 50, max: 50 } })],
      seed: 'detour-seed',
      movement: { bounds: { width: 12, height: 12 }, blocked },
    });
    expect(turn.decision).toBe('attack');
    expect(turn.move).toBeDefined();
    // The destination is a real, free cell within reach of the target.
    expect(blocked.has(`${turn.move!.to.x}:${turn.move!.to.y}`)).toBe(false);
    expect(
      Math.max(Math.abs(turn.move!.to.x - 4), Math.abs(turn.move!.to.y - 0))
    ).toBeLessThanOrEqual(1);
  });

  it('moves its full speed and reports move-to-engage when the target stays out of reach', () => {
    const turn = executeTacticalTurn({
      actor: actor({ position: { x: 0, y: 0 }, reach: 1, speedCells: 3 }),
      targets: [target('distant', { position: { x: 10, y: 0 } })],
      seed: 'closing-seed',
    });

    expect(turn.decision).toBe('move-to-engage');
    expect(turn.move?.to).toEqual({ x: 3, y: 0 });
    expect(turn.attacks).toHaveLength(0);
  });

  it('rounds converge: distant melee combatants close and fight over successive rounds', async () => {
    const { runCombatRound } = await import('../../rules');
    const combatant = (tokenId: string, faction: string, x: number) => ({
      tokenId,
      faction,
      position: { x, y: 0 },
      armorClass: 10,
      hp: { current: 20, max: 20 },
      attackEffects: [atk(20)],
      damageEffects: dmg(6, 2),
      reach: 1,
      speedCells: 6,
    });

    const order = [combatant('a', 'party', 0), combatant('b', 'monsters', 12)];
    const round1 = runCombatRound({ order, seed: 'converge', round: 1 });
    // Both moved toward each other; at least one move intent emitted.
    expect(round1.intents.some((intent) => intent.type === 'move-token')).toBe(true);
    // After closing 6 cells each from 12 apart, they are adjacent: damage flows
    // in round 1 or, at worst, round 2.
    const totalDamageIntents = round1.intents.filter(
      (intent) => intent.type === 'apply-damage'
    ).length;
    expect(totalDamageIntents).toBeGreaterThan(0);
  });
});

describe('iterative attack penalties in the turn executor', () => {
  it('the second attack of a full attack rolls at -5', async () => {
    const { executeTacticalTurn } = await import('../../rules/tactical/tacticalExecutor');
    const { makeEffectId } = await import('../../rules');
    const atk = (value: number) => ({
      id: makeEffectId('pf1e', 'attack', 'test', value),
      systemId: 'pf1e' as const,
      target: 'attack',
      operation: 'add' as const,
      value,
      stackPolicy: 'sum' as const,
      source: { kind: 'system' as const, label: 'test' },
      label: 'test',
    });
    const run = (iterativePenaltyStep?: number) =>
      executeTacticalTurn({
        actor: {
          tokenId: 'a',
          faction: 'red',
          position: { x: 0, y: 0 },
          attackEffects: [atk(10)],
          damageEffects: [],
          reach: 1,
          attacksPerRound: 2,
          ...(iterativePenaltyStep ? { iterativePenaltyStep } : {}),
        },
        targets: [
          {
            tokenId: 'b',
            faction: 'blue',
            position: { x: 1, y: 0 },
            armorClass: 10,
            hp: { current: 100, max: 100 },
          },
        ],
        seed: 'iterative-seed',
      });
    const withStep = run(5);
    const withoutStep = run();
    expect(withStep.attacks).toHaveLength(2);
    // Same seed/stream: identical natural rolls; the second attack's total
    // bonus differs by exactly the -5 iterative penalty.
    expect(withStep.attacks[0].resolution.attackBonus).toBe(
      withoutStep.attacks[0].resolution.attackBonus
    );
    expect(withStep.attacks[1].resolution.attackBonus).toBe(
      withoutStep.attacks[1].resolution.attackBonus - 5
    );
  });
});
