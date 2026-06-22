import { describe, it, expect } from 'vitest';

import {
  EMPTY_BLACKBOARD,
  STRATEGY_BIAS_CAP,
  hintsForActor,
  makeEffectId,
  resolveRoundHints,
  runSceneRound,
  scoreTargets,
  type EffectInstance,
  type ResolveCombatStats,
  type StrategyBlackboard,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type { SceneActionIntent, SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * PHASE 12 (RFC 002/003): the LLM strategist biases the deterministic executor.
 * Hints are a clamped, advisory nudge on a target's utility score — they reorder
 * which already-legal target is chosen and can never make an illegal one actable.
 * The executor and round driver stay pure; the LLM is never in the per-move loop.
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

function actor(over: Partial<TacticalActor> = {}): TacticalActor {
  return {
    tokenId: 'hero',
    faction: 'party',
    position: { x: 0, y: 0 },
    attackEffects: [atk(5)],
    damageEffects: [],
    reach: 10,
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

describe('scoreTargets — strategist hints bias preference', () => {
  it('leaves the ranking untouched when no hints are given (back-compat)', () => {
    const targets = [
      target('near', { position: { x: 1, y: 0 } }),
      target('far', { position: { x: 5, y: 0 } }),
    ];
    const baseline = scoreTargets(actor(), targets).map((s) => s.tokenId);
    expect(baseline).toEqual(['near', 'far']);
    // Explicit empty hints === no hints.
    expect(scoreTargets(actor(), targets, []).map((s) => s.tokenId)).toEqual(baseline);
  });

  it('a focus-fire hint flips which legal target is chosen', () => {
    const targets = [
      target('grunt', { position: { x: 1, y: 0 } }), // closest → default top
      target('caster', { position: { x: 4, y: 0 } }),
    ];
    expect(scoreTargets(actor(), targets)[0].tokenId).toBe('grunt');
    const hinted = scoreTargets(actor(), targets, [
      { targetId: 'caster', bias: 50, reason: 'kill the healer' },
    ]);
    expect(hinted[0].tokenId).toBe('caster');
    const caster = hinted.find((s) => s.tokenId === 'caster')!;
    expect(caster.strategistBias).toBe(50);
    expect(caster.reasons.some((r) => r.includes('kill the healer'))).toBe(true);
  });

  it('clamps an out-of-range bias to ±STRATEGY_BIAS_CAP', () => {
    const scored = scoreTargets(actor(), [target('foe')], [{ targetId: 'foe', bias: 9999 }]);
    expect(scored[0].strategistBias).toBe(STRATEGY_BIAS_CAP);

    const negative = scoreTargets(actor(), [target('foe')], [{ targetId: 'foe', bias: -9999 }]);
    expect(negative[0].strategistBias).toBe(-STRATEGY_BIAS_CAP);
  });

  it('ignores a non-finite bias', () => {
    const scored = scoreTargets(
      actor(),
      [target('foe')],
      [{ targetId: 'foe', bias: Number.POSITIVE_INFINITY }]
    );
    expect(scored[0].strategistBias).toBe(0);
  });

  it('a hint on an ally or a corpse is inert (legality decided before scoring)', () => {
    const targets = [
      target('ally', { faction: 'party' }),
      target('corpse', { hp: { current: 0, max: 10 } }),
      target('foe'),
    ];
    const scored = scoreTargets(actor(), targets, [
      { targetId: 'ally', bias: 100 },
      { targetId: 'corpse', bias: 100 },
    ]);
    // Only the real foe is scored; the boosted ally/corpse never appear.
    expect(scored.map((s) => s.tokenId)).toEqual(['foe']);
  });

  it('is deterministic under hints (no RNG, stable id tie-break)', () => {
    const targets = [target('b'), target('a')];
    const hints = [{ targetId: 'a', bias: 10 }];
    const first = scoreTargets(actor(), targets, hints).map((s) => s.tokenId);
    const second = scoreTargets(actor(), [...targets].reverse(), hints).map((s) => s.tokenId);
    expect(first).toEqual(second);
  });
});

describe('blackboard freshness — stale/missing output falls back to defaults', () => {
  const board: StrategyBlackboard = {
    round: 3,
    byActor: { orc: [{ targetId: 'wizard', bias: 40 }] },
  };

  it('returns hints when the board is fresh for the round', () => {
    expect(hintsForActor(board, 'orc', 3)).toEqual([{ targetId: 'wizard', bias: 40 }]);
    // Within maxAge (default 1): a board from round 3 is still usable on round 4.
    expect(hintsForActor(board, 'orc', 4)).toHaveLength(1);
  });

  it('returns [] when the board is stale, from the future, or missing', () => {
    expect(hintsForActor(board, 'orc', 5)).toEqual([]); // age 2 > maxAge 1
    expect(hintsForActor(board, 'orc', 2)).toEqual([]); // board is ahead of the round
    expect(hintsForActor(undefined, 'orc', 3)).toEqual([]);
    expect(hintsForActor(EMPTY_BLACKBOARD, 'orc', 0)).toEqual([]);
  });

  it('returns [] for an actor with no hints', () => {
    expect(hintsForActor(board, 'goblin', 3)).toEqual([]);
  });

  it('resolveRoundHints keeps only fresh, non-empty actor entries', () => {
    expect(resolveRoundHints(board, ['orc', 'goblin'], 3)).toEqual({
      orc: [{ targetId: 'wizard', bias: 40 }],
    });
    expect(resolveRoundHints(board, ['orc'], 99)).toEqual({});
  });
});

describe('runSceneRound — a fresh hint redirects which legal target is attacked', () => {
  const SID2 = 'dnd-5e-2014' as const;
  const stats: ResolveCombatStats = (token) => {
    if (token.kind === 'monster') {
      return {
        attackEffects: [atk(50)], // always hits
        damageEffects: [
          {
            id: 'flat',
            systemId: SID2,
            target: 'damage',
            operation: 'add',
            value: 6,
            stackPolicy: 'sum',
            source: { kind: 'system', label: 'str' },
            label: 'flat',
          },
        ],
        armorClass: 10,
        reach: 1,
        speedCells: 6,
      };
    }
    return { attackEffects: [atk(0)], damageEffects: [], armorClass: 10, reach: 1, speedCells: 6 };
  };

  function scene(): SceneDocument {
    let doc = createSceneDocument({
      id: 'st',
      name: 'Strat',
      systemId: SID2,
      seed: 'seed',
      grid: { width: 12, height: 12, cellSize: 5 },
    });
    const tokens: SceneToken[] = [
      {
        id: 'orc',
        name: 'Orc',
        kind: 'monster',
        position: { x: 5, y: 5 },
        size: 1,
        hp: { current: 20, max: 20, temp: 0 },
      },
      {
        id: 'aaa',
        name: 'A',
        kind: 'character',
        position: { x: 4, y: 5 },
        size: 1,
        hp: { current: 20, max: 20, temp: 0 },
        playerControlled: true,
      },
      {
        id: 'zzz',
        name: 'Z',
        kind: 'character',
        position: { x: 6, y: 5 },
        size: 1,
        hp: { current: 20, max: 20, temp: 0 },
        playerControlled: true,
      },
    ];
    for (const token of tokens) {
      const placed = resolveSceneAction(
        doc,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      doc = appendSceneEvent(doc, placed.event!);
    }
    return doc;
  }

  const damagedIds = (intents: SceneActionIntent[]): string[] =>
    intents
      .filter(
        (i): i is Extract<SceneActionIntent, { type: 'apply-damage' }> => i.type === 'apply-damage'
      )
      .flatMap((i) => i.damages.map((d) => d.tokenId));

  it('defaults to the id tie-break target, then obeys a focus-fire hint', () => {
    const doc = scene();
    const state = foldSceneEvents(doc).state;

    // Both heroes are equidistant and equal-HP, so the deterministic tie-break
    // picks the lower id, 'aaa'.
    const baseline = runSceneRound({ state, resolveStats: stats, seed: 's', round: 1 });
    expect(damagedIds(baseline.intents)).toContain('aaa');
    expect(damagedIds(baseline.intents)).not.toContain('zzz');

    // A fresh hint to focus 'zzz' flips the choice — through legal targets only.
    const hinted = runSceneRound({
      state,
      resolveStats: stats,
      seed: 's',
      round: 1,
      blackboard: { round: 1, byActor: { orc: [{ targetId: 'zzz', bias: 60, reason: 'focus' }] } },
    });
    expect(damagedIds(hinted.intents)).toContain('zzz');
    expect(damagedIds(hinted.intents)).not.toContain('aaa');
  });

  it('a stale blackboard leaves the round identical to the no-hint baseline', () => {
    const doc = scene();
    const state = foldSceneEvents(doc).state;
    const baseline = runSceneRound({ state, resolveStats: stats, seed: 's', round: 4 });
    const stale = runSceneRound({
      state,
      resolveStats: stats,
      seed: 's',
      round: 4,
      // Computed for round 1 — too old for round 4 (age 3 > maxAge 1).
      blackboard: { round: 1, byActor: { orc: [{ targetId: 'zzz', bias: 60 }] } },
    });
    expect(JSON.stringify(stale.intents)).toEqual(JSON.stringify(baseline.intents));
    expect(damagedIds(stale.intents)).toContain('aaa');
  });
});
