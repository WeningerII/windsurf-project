import { describe, it, expect } from 'vitest';

import {
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
  appendSceneEvent,
} from '../../scene/runtime';
import {
  buildSceneCombatants,
  factionForToken,
  makeEffectId,
  resolveSceneAttack,
  runSceneRound,
  type EffectInstance,
  type ResolveCombatStats,
  type SceneCombatStats,
} from '../../rules';
import type { SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * UI bridge (RFC 003): the deterministic combat engine wired to a scene. Stub
 * stats force hit/miss so these stay deterministic without depending on rolls.
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

const flatDamage = (n: number): EffectInstance[] => [
  {
    id: 'flat',
    systemId: SID,
    target: 'damage',
    operation: 'add',
    value: n,
    stackPolicy: 'sum',
    source: { kind: 'item', label: 'weapon' },
    label: `+${n}`,
  },
];

function combatToken(id: string, kind: SceneToken['kind'], hp: number, x: number): SceneToken {
  return {
    id,
    name: id,
    kind,
    position: { x, y: 0 },
    size: 1,
    hp: { current: hp, max: hp, temp: 0 },
  };
}

function sceneWith(...tokens: SceneToken[]): SceneDocument {
  let scene = createSceneDocument({ id: 's', name: 'S', systemId: SID, seed: 'fixed' });
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

// Stats that always hit (huge bonus) and deal flat 5 (no dice -> deterministic).
const hittingStats: SceneCombatStats = {
  attackEffects: [atk(100)],
  damageEffects: flatDamage(5),
  armorClass: 10,
  reach: 10,
};
const missingStats: SceneCombatStats = {
  attackEffects: [atk(-100)],
  damageEffects: flatDamage(5),
  armorClass: 100,
  reach: 10,
};

describe('factionForToken', () => {
  it('maps token kinds to factions', () => {
    expect(factionForToken({ kind: 'character' } as SceneToken)).toBe('party');
    expect(factionForToken({ kind: 'monster' } as SceneToken)).toBe('monsters');
    expect(factionForToken({ kind: 'npc' } as SceneToken)).toBe('npc');
    expect(factionForToken({ kind: 'object' } as SceneToken)).toBe('object');
  });
});

describe('buildSceneCombatants', () => {
  it('includes only tokens with hp AND resolvable stats', () => {
    const state = foldSceneEvents(
      sceneWith(
        combatToken('hero', 'character', 20, 0),
        combatToken('goblin', 'monster', 7, 1),
        { id: 'door', name: 'Door', kind: 'object', position: { x: 2, y: 0 }, size: 1 } // no hp
      )
    ).state;
    const resolve: ResolveCombatStats = (t) => (t.kind === 'object' ? undefined : hittingStats);
    const combatants = buildSceneCombatants(state, resolve);
    expect(combatants.map((c) => c.tokenId).sort()).toEqual(['goblin', 'hero']);
    expect(combatants.find((c) => c.tokenId === 'hero')!.faction).toBe('party');
    expect(combatants.find((c) => c.tokenId === 'goblin')!.faction).toBe('monsters');
  });

  it('orders by initiative when present', () => {
    let scene = sceneWith(combatToken('a', 'monster', 10, 0), combatToken('b', 'monster', 10, 1));
    const init = resolveSceneAction(
      scene,
      {
        type: 'set-initiative',
        entries: [
          { tokenId: 'b', value: 20 },
          { tokenId: 'a', value: 5 },
        ],
        activeTokenId: 'b',
      },
      { eventId: 'i' }
    );
    scene = appendSceneEvent(scene, init.event!);
    const state = foldSceneEvents(scene).state;
    const combatants = buildSceneCombatants(state, () => hittingStats);
    expect(combatants.map((c) => c.tokenId)).toEqual(['b', 'a']);
  });
});

describe('resolveSceneAttack', () => {
  it('a hit produces an apply-damage intent and a hit log', () => {
    const state = foldSceneEvents(
      sceneWith(combatToken('hero', 'character', 20, 0), combatToken('goblin', 'monster', 7, 1))
    ).state;
    const outcome = resolveSceneAttack({
      state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: () => hittingStats,
      seed: 'atk-1',
      cause: 'sword',
    });
    expect(outcome.hit).toBe(true);
    expect(outcome.intent?.type).toBe('apply-damage');
    expect(outcome.log).toMatch(/hero hits goblin for 5/i);
  });

  it('a miss produces no intent and a miss log', () => {
    const state = foldSceneEvents(
      sceneWith(combatToken('hero', 'character', 20, 0), combatToken('goblin', 'monster', 7, 1))
    ).state;
    const outcome = resolveSceneAttack({
      state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: () => missingStats,
      seed: 'atk-1',
    });
    expect(outcome.hit).toBe(false);
    expect(outcome.intent).toBeUndefined();
    expect(outcome.log).toMatch(/misses/i);
  });

  it('unresolvable stats yield an honest log, no intent', () => {
    const state = foldSceneEvents(
      sceneWith(combatToken('hero', 'character', 20, 0), combatToken('x', 'monster', 5, 1))
    ).state;
    const outcome = resolveSceneAttack({
      state,
      attackerId: 'hero',
      targetId: 'x',
      resolveStats: (t) => (t.id === 'x' ? undefined : hittingStats),
      seed: 's',
    });
    expect(outcome.intent).toBeUndefined();
    expect(outcome.log).toMatch(/cannot resolve/i);
  });

  it('REGRESSION (05-M8/02-M4): an out-of-reach target yields an honest outcome, no event', () => {
    // Melee reach 1 vs a target 7 cells away (Chebyshev): the manual path now
    // refuses, exactly like the autonomous round's move-to-engage.
    const state = foldSceneEvents(
      sceneWith(combatToken('shrub', 'monster', 10, 0), combatToken('far', 'character', 20, 7))
    ).state;
    const meleeStats: SceneCombatStats = { ...hittingStats, reach: 1 };
    const outcome = resolveSceneAttack({
      state,
      attackerId: 'shrub',
      targetId: 'far',
      resolveStats: () => meleeStats,
      seed: 'reach',
    });
    expect(outcome.hit).toBe(false);
    expect(outcome.intent).toBeUndefined();
    expect(outcome.log).toMatch(/cannot reach far \(7 cells away, reach 1\)/i);

    // Adjacent (distance 1 = reach) still resolves.
    const adjacent = foldSceneEvents(
      sceneWith(combatToken('shrub', 'monster', 10, 0), combatToken('near', 'character', 20, 1))
    ).state;
    const resolved = resolveSceneAttack({
      state: adjacent,
      attackerId: 'shrub',
      targetId: 'near',
      resolveStats: () => meleeStats,
      seed: 'reach',
    });
    expect(resolved.hit).toBe(true);
  });

  it('REGRESSION (02-M3): a downed attacker or downed/HP-less target is refused honestly', () => {
    let scene = sceneWith(
      combatToken('up', 'character', 20, 0),
      combatToken('down', 'monster', 5, 1)
    );
    // Drop 'down' to 0 HP through the validated event path.
    const kill = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'down', amount: 5 }] },
      { eventId: 'kill' }
    );
    scene = appendSceneEvent(scene, kill.event!);
    const state = foldSceneEvents(scene).state;

    // Downed target: no event, honest log.
    const beatCorpse = resolveSceneAttack({
      state,
      attackerId: 'up',
      targetId: 'down',
      resolveStats: () => hittingStats,
      seed: 's',
    });
    expect(beatCorpse.hit).toBe(false);
    expect(beatCorpse.intent).toBeUndefined();
    expect(beatCorpse.log).toMatch(/down is already down/i);

    // Downed attacker: cannot act.
    const corpseSwings = resolveSceneAttack({
      state,
      attackerId: 'down',
      targetId: 'up',
      resolveStats: () => hittingStats,
      seed: 's',
    });
    expect(corpseSwings.hit).toBe(false);
    expect(corpseSwings.intent).toBeUndefined();
    expect(corpseSwings.log).toMatch(/down is down and cannot attack/i);

    // HP-less target: the fold would silently discard the damage, so the
    // attack is refused instead of logging a phantom hit.
    const hpless = foldSceneEvents(
      sceneWith(combatToken('up', 'character', 20, 0), {
        id: 'ghost',
        name: 'ghost',
        kind: 'npc',
        position: { x: 1, y: 0 },
        size: 1,
      })
    ).state;
    const phantom = resolveSceneAttack({
      state: hpless,
      attackerId: 'up',
      targetId: 'ghost',
      resolveStats: () => hittingStats,
      seed: 's',
    });
    expect(phantom.hit).toBe(false);
    expect(phantom.intent).toBeUndefined();
    expect(phantom.log).toMatch(/ghost has no hit points to damage/i);
  });
});

describe('runSceneRound', () => {
  it('runs a full round and applies damage across factions through scene events', () => {
    let scene = sceneWith(
      combatToken('hero', 'character', 20, 0),
      combatToken('goblin', 'monster', 7, 1)
    );
    // Initiative so hero goes first.
    const init = resolveSceneAction(
      scene,
      {
        type: 'set-initiative',
        entries: [
          { tokenId: 'hero', value: 20 },
          { tokenId: 'goblin', value: 5 },
        ],
        activeTokenId: 'hero',
      },
      { eventId: 'i' }
    );
    scene = appendSceneEvent(scene, init.event!);

    const outcome = runSceneRound({
      state: foldSceneEvents(scene).state,
      resolveStats: () => hittingStats,
      seed: 'round-seed',
      round: 1,
    });

    // Both hit each other (always-hit stats): two damage intents, then —
    // 05-M6, deliberately updated — the advance-turn intents that walk the
    // 2-slot initiative cycle from the active top back to the top, so applying
    // the round advances the scene's round machinery.
    expect(outcome.intents.map((intent) => intent.type)).toEqual([
      'apply-damage',
      'apply-damage',
      'advance-turn',
      'advance-turn',
    ]);
    // Deliberately re-pinned (05-L2): the collision-proof participantRng seed
    // derivation shifted this stream — under 'round-seed' the hero now rolls a
    // natural 20, so the log verb is "crits" (flat damage, so the total is
    // unchanged). Either verb proves the cross-faction hit landed.
    expect(outcome.log.some((line) => /hero (hits|crits) goblin/i.test(line))).toBe(true);

    // Apply the intents as events and confirm HP dropped on the grid.
    for (const [i, intent] of outcome.intents.entries()) {
      const r = resolveSceneAction(scene, intent, { eventId: `dmg-${i}` });
      scene = appendSceneEvent(scene, r.event!);
    }
    const finalState = foldSceneEvents(scene).state;
    expect(finalState.tokens.goblin.hp!.current).toBeLessThan(7);
    expect(finalState.tokens.hero.hp!.current).toBeLessThan(20);
    // REGRESSION (05-M6): the applied round advanced the turn machinery — the
    // round counter incremented and the active token wrapped back to the top.
    expect(finalState.round).toBe(2);
    expect(finalState.activeTokenId).toBe('hero');
  });

  it('05-M6: a scene with no initiative order emits no advance-turn intents', () => {
    const state = foldSceneEvents(
      sceneWith(combatToken('a', 'character', 20, 0), combatToken('b', 'monster', 20, 1))
    ).state;
    const outcome = runSceneRound({
      state,
      resolveStats: () => hittingStats,
      seed: 'x',
      round: 1,
    });
    expect(outcome.intents.every((intent) => intent.type === 'apply-damage')).toBe(true);
  });

  it('05-M6: mid-cycle active token advances only back to the top (no over-rotation)', () => {
    let scene = sceneWith(
      combatToken('first', 'character', 20, 0),
      combatToken('second', 'monster', 20, 1)
    );
    const init = resolveSceneAction(
      scene,
      {
        type: 'set-initiative',
        entries: [
          { tokenId: 'first', value: 20 },
          { tokenId: 'second', value: 5 },
        ],
        // Mid-cycle: the second combatant is active.
        activeTokenId: 'second',
      },
      { eventId: 'i' }
    );
    scene = appendSceneEvent(scene, init.event!);

    const outcome = runSceneRound({
      state: foldSceneEvents(scene).state,
      resolveStats: () => hittingStats,
      seed: 'mid',
      round: 1,
    });
    // active index 1 of 2 -> exactly one advance-turn back to the top.
    expect(outcome.intents.filter((intent) => intent.type === 'advance-turn')).toHaveLength(1);

    for (const [i, intent] of outcome.intents.entries()) {
      const r = resolveSceneAction(scene, intent, { eventId: `apply-${i}` });
      scene = appendSceneEvent(scene, r.event!);
    }
    const finalState = foldSceneEvents(scene).state;
    expect(finalState.round).toBe(2);
    expect(finalState.activeTokenId).toBe('first');
  });

  it('is deterministic for a fixed seed', () => {
    const state = foldSceneEvents(
      sceneWith(combatToken('a', 'character', 20, 0), combatToken('b', 'monster', 20, 1))
    ).state;
    const run = () =>
      runSceneRound({ state, resolveStats: () => hittingStats, seed: 'x', round: 1 });
    expect(JSON.stringify(run().intents)).toBe(JSON.stringify(run().intents));
  });
});
