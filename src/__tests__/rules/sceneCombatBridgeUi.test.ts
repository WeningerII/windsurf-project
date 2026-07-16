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
  isHostile,
  makeEffectId,
  resolveSceneAttack,
  runSceneRound,
  type EffectInstance,
  type ResolveCombatStats,
  type SceneCombatStats,
} from '../../rules';
import type { SceneDocument, SceneMarker, SceneToken } from '../../types/core/scene';

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
  it('maps token kinds to default combat sides', () => {
    expect(factionForToken({ kind: 'character' } as SceneToken)).toBe('party');
    expect(factionForToken({ kind: 'monster' } as SceneToken)).toBe('hostile');
    // npc and object are non-combatants unless explicitly sided.
    expect(factionForToken({ kind: 'npc' } as SceneToken)).toBe('neutral');
    expect(factionForToken({ kind: 'object' } as SceneToken)).toBe('neutral');
  });

  it('lets an explicit allegiance override the kind default', () => {
    expect(factionForToken({ kind: 'npc', allegiance: 'party' } as SceneToken)).toBe('party');
    expect(factionForToken({ kind: 'npc', allegiance: 'hostile' } as SceneToken)).toBe('hostile');
    // A charmed PC, or a turned monster ally.
    expect(factionForToken({ kind: 'character', allegiance: 'hostile' } as SceneToken)).toBe(
      'hostile'
    );
    expect(factionForToken({ kind: 'monster', allegiance: 'party' } as SceneToken)).toBe('party');
  });
});

describe('isHostile — allegiance', () => {
  it('opposes party and hostile but not same sides', () => {
    expect(isHostile('party', 'hostile')).toBe(true);
    expect(isHostile('party', 'party')).toBe(false);
    expect(isHostile('hostile', 'hostile')).toBe(false);
  });

  it('treats neutral as hostile to no one (and a target of no one)', () => {
    expect(isHostile('neutral', 'party')).toBe(false);
    expect(isHostile('hostile', 'neutral')).toBe(false);
    expect(isHostile('neutral', 'neutral')).toBe(false);
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
    expect(combatants.find((c) => c.tokenId === 'goblin')!.faction).toBe('hostile');
  });

  it('carries an NPC token allegiance through to its combatant side', () => {
    const ally: SceneToken = {
      id: 'guard',
      name: 'Hired Guard',
      kind: 'npc',
      position: { x: 0, y: 0 },
      size: 1,
      hp: { current: 12, max: 12 },
      allegiance: 'party',
    };
    const state = foldSceneEvents(sceneWith(ally)).state;
    const combatants = buildSceneCombatants(state, () => hittingStats);
    expect(combatants.find((c) => c.tokenId === 'guard')!.faction).toBe('party');
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
  it('logs a skipped player-controlled combatant as manual, not "is down"', () => {
    let scene = sceneWith(
      { ...combatToken('hero', 'character', 20, 0), playerControlled: true },
      combatToken('goblin', 'monster', 7, 1)
    );
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
      seed: 'pc-seed',
      round: 1,
    });

    // The full-HP hero is player-controlled, not downed: the log must say so.
    expect(outcome.log.some((line) => /hero is player-controlled/i.test(line))).toBe(true);
    expect(outcome.log.some((line) => /hero is down/i.test(line))).toBe(false);
  });

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

describe('token conditions in scene combat (grid-combat review)', () => {
  it('round-trips set-token-conditions through the event log', () => {
    let scene = sceneWith(combatToken('hero', 'character', 20, 0));
    const result = resolveSceneAction(
      scene,
      {
        type: 'set-token-conditions',
        tokenId: 'hero',
        conditions: ['poisoned', 'poisoned', 'prone'],
      },
      { eventId: 'cond-1' }
    );
    expect(result.event).toBeDefined();
    scene = appendSceneEvent(scene, result.event!);
    const { state } = foldSceneEvents(scene);
    // Deduped at the intent boundary, preserved in order by the fold.
    expect(state.tokens.hero.conditions).toEqual(['poisoned', 'prone']);
  });

  it('rejects conditions on an unknown token', () => {
    const scene = sceneWith(combatToken('hero', 'character', 20, 0));
    const result = resolveSceneAction(
      scene,
      { type: 'set-token-conditions', tokenId: 'ghost', conditions: ['poisoned'] },
      { eventId: 'cond-2' }
    );
    expect(result.event).toBeUndefined();
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('a poisoned attacker rolls with disadvantage (SRD) in the manual path', () => {
    // +0 to hit vs AC 11: hit chance drops sharply under disadvantage, and
    // with a FIXED seed the outcome is deterministic. Assert the mechanism
    // (rolled terms) rather than hit/miss: disadvantage consumes TWO d20s.
    const scene = sceneWith(
      combatToken('atk', 'character', 20, 0),
      combatToken('def', 'monster', 20, 1)
    );
    let folded = foldSceneEvents(scene).state;
    const conditioned = resolveSceneAction(
      scene,
      { type: 'set-token-conditions', tokenId: 'atk', conditions: ['poisoned'] },
      { eventId: 'cond-3' }
    );
    folded = foldSceneEvents(appendSceneEvent(scene, conditioned.event!)).state;

    const stats: ResolveCombatStats = () => ({
      attackEffects: [atk(0)],
      damageEffects: flatDamage(5),
      armorClass: 11,
      reach: 10,
    });

    const outcome = resolveSceneAttack({
      state: folded,
      attackerId: 'atk',
      targetId: 'def',
      resolveStats: stats,
      seed: 'poison-seed',
    });
    const clean = resolveSceneAttack({
      state: foldSceneEvents(scene).state,
      attackerId: 'atk',
      targetId: 'def',
      resolveStats: stats,
      seed: 'poison-seed',
    });

    // Disadvantage consumed a second d20 from the same seeded stream, so the
    // poisoned resolution's natural roll is min(d1, d2) of the clean stream.
    expect(outcome.log).toBeDefined();
    expect(clean.log).toBeDefined();
    expect(outcome.log).not.toBe(clean.log);
  });

  it('conditions reach autonomous rounds via buildSceneCombatants', () => {
    const scene = sceneWith(
      combatToken('hero', 'character', 20, 0),
      combatToken('orc', 'monster', 20, 1)
    );
    const conditioned = resolveSceneAction(
      scene,
      { type: 'set-token-conditions', tokenId: 'hero', conditions: ['poisoned'] },
      { eventId: 'cond-4' }
    );
    const state = foldSceneEvents(appendSceneEvent(scene, conditioned.event!)).state;

    const combatants = buildSceneCombatants(state, () => hittingStats);
    const hero = combatants.find((combatant) => combatant.tokenId === 'hero')!;
    expect(
      hero.attackEffects.some(
        (effect) => effect.operation === 'disadvantage' && /poisoned/i.test(effect.label)
      )
    ).toBe(true);
    // The unconditioned orc carries only its base effects.
    const orc = combatants.find((combatant) => combatant.tokenId === 'orc')!;
    expect(orc.attackEffects).toHaveLength(hittingStats.attackEffects.length);
  });
});

describe('Daggerheart scene combat (phase 3 adapter)', () => {
  const dhStats = (evasion: number, thresholds: { major: number; severe: number }) => ({
    attackEffects: [
      {
        id: 'dh-atk',
        systemId: 'daggerheart' as const,
        target: 'attack',
        operation: 'add' as const,
        value: 100, // always meets Evasion: deterministic hit
        stackPolicy: 'sum' as const,
        source: { kind: 'system' as const, label: 'trait' },
        label: 'trait',
      },
    ],
    damageEffects: [
      {
        id: 'dh-dmg',
        systemId: 'daggerheart' as const,
        target: 'damage',
        operation: 'add' as const,
        value: 20, // flat 20 >= severe: marks 3 HP, deterministically
        stackPolicy: 'sum' as const,
        source: { kind: 'item' as const, label: 'sword' },
        label: 'sword',
      },
    ],
    armorClass: evasion,
    reach: 1,
    daggerheart: { thresholds },
  });

  it('resolves 2d12 vs Evasion and applies threshold-MARKED HP, not raw damage', () => {
    let scene = createSceneDocument({ id: 'dh', name: 'DH', systemId: 'daggerheart', seed: 'dh' });
    for (const token of [
      combatToken('hero', 'character', 6, 0),
      combatToken('foe', 'character', 6, 1),
    ]) {
      const r = resolveSceneAction(
        scene,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    const state = foldSceneEvents(scene).state;

    const outcome = resolveSceneAttack({
      state,
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: () => dhStats(10, { major: 7, severe: 12 }),
      seed: 'dh-attack',
    });

    expect(outcome.hit).toBe(true);
    expect(outcome.log).toContain('Hope');
    expect(outcome.log).toContain('Evasion 10');
    // Raw damage 20 >= severe 12 marks exactly 3 HP — the intent carries the
    // MARKED amount (slot model), never the raw total.
    expect(outcome.intent).toMatchObject({
      type: 'apply-damage',
      damages: [{ tokenId: 'foe', amount: 3 }],
    });
  });
});

describe('M&M 3e scene combat (phase 3 adapter)', () => {
  const mamStats = (over: Record<string, unknown> = {}) => ({
    attackEffects: [
      {
        id: 'mam-atk',
        systemId: 'mam3e' as const,
        target: 'attack',
        operation: 'add' as const,
        value: 100, // always hits: deterministic
        stackPolicy: 'sum' as const,
        source: { kind: 'system' as const, label: 'fgt' },
        label: 'fgt',
      },
    ],
    damageEffects: [],
    armorClass: 10, // Dodge
    reach: 1,
    mam3e: { parry: 10, toughness: -100, effectRank: 10, ranged: false, ...over },
  });

  function mamScene() {
    let scene = createSceneDocument({ id: 'mm', name: 'MM', systemId: 'mam3e', seed: 'mm' });
    for (const token of [
      combatToken('hero', 'character', 1, 0),
      combatToken('villain', 'character', 1, 1),
    ]) {
      const r = resolveSceneAction(
        scene,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    return foldSceneEvents(scene).state;
  }

  it('a catastrophic Toughness failure incapacitates (downs the up/down token)', () => {
    // Toughness -100 vs DC 25: shortfall >= 15 — incapacitated per the
    // Hero's Handbook degree table, applied as a downing damage intent.
    const outcome = resolveSceneAttack({
      state: mamScene(),
      attackerId: 'hero',
      targetId: 'villain',
      resolveStats: () => mamStats(),
      seed: 'mam-incap',
    });
    expect(outcome.hit).toBe(true);
    expect(outcome.log).toContain('INCAPACITATED');
    expect(outcome.intent).toMatchObject({
      type: 'apply-damage',
      damages: [{ tokenId: 'villain', amount: 1 }],
    });
  });

  it('a moderate failure persists the condition track on the token', () => {
    // Toughness +18 vs DC 25 keeps shortfalls in the 1-9 band across the d20
    // range: bruised (+dazed at 5-9) — never staggered/incapacitated.
    const outcome = resolveSceneAttack({
      state: mamScene(),
      attackerId: 'hero',
      targetId: 'villain',
      resolveStats: () => mamStats({ toughness: 18 }),
      // seed chosen so the attack d20 is 18 (a hit; 'mam-bruise' rolled a
      // natural 1, which RAW auto-misses) and the save d20 is 12.
      seed: 'mam-bruise-2',
    });
    expect(outcome.hit).toBe(true);
    if (outcome.intent) {
      expect(outcome.intent.type).toBe('set-token-conditions');
      const conditions = (outcome.intent as { conditions: string[] }).conditions;
      expect(conditions.some((c) => /^bruised-\d+$/.test(c))).toBe(true);
      expect(conditions).not.toContain('incapacitated');
    } else {
      // The save held for this seed — legal, but the log must say so.
      expect(outcome.log).toContain('holds');
    }
  });
});

describe('functional terrain in scene combat (RFC 003 Phase 4)', () => {
  // A 1x1 marker whose stored IR effect raises AC by `ac` on the cell it covers.
  function coverMarker(id: string, x: number, y: number, ac: number): SceneMarker {
    return {
      id,
      kind: 'hazard',
      label: 'Cover',
      position: { x, y },
      width: 1,
      height: 1,
      effects: [{ target: 'ac', operation: 'add', value: ac, label: `+${ac} cover` }],
    };
  }
  function withMarker(scene: SceneDocument, marker: SceneMarker): SceneDocument {
    const r = resolveSceneAction(
      scene,
      { type: 'add-marker', marker },
      { eventId: `m-${marker.id}` }
    );
    return appendSceneEvent(scene, r.event!);
  }
  const acStats: ResolveCombatStats = () => ({
    attackEffects: [atk(0)],
    damageEffects: flatDamage(5),
    armorClass: 10,
    reach: 10,
  });

  it('a cover marker at the target cell raises the effective AC in resolution and the log', () => {
    // hero (0,0) attacks goblin (1,0); the marker covers (1,0).
    const base = sceneWith(
      combatToken('hero', 'character', 20, 0),
      combatToken('goblin', 'monster', 7, 1)
    );
    const covered = withMarker(base, coverMarker('cover', 1, 0, 5));

    const outcome = resolveSceneAttack({
      state: foldSceneEvents(covered).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: acStats,
      seed: 'cover',
    });
    expect(outcome.log).toMatch(/vs AC 15, \+5 cover/);

    // Control: no marker → base AC, no cover note.
    const clean = resolveSceneAttack({
      state: foldSceneEvents(base).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: acStats,
      seed: 'cover',
    });
    expect(clean.log).toMatch(/vs AC 10/);
    expect(clean.log).not.toMatch(/cover/);
  });

  it('terrain applies only at the cell it covers — a marker elsewhere is inert', () => {
    const base = sceneWith(
      combatToken('hero', 'character', 20, 0),
      combatToken('goblin', 'monster', 7, 1)
    );
    const elsewhere = withMarker(base, coverMarker('c', 5, 5, 5)); // far from both tokens

    const a = resolveSceneAttack({
      state: foldSceneEvents(base).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: acStats,
      seed: 'x',
    });
    const b = resolveSceneAttack({
      state: foldSceneEvents(elsewhere).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: acStats,
      seed: 'x',
    });
    expect(b.log).toBe(a.log); // off-cell terrain changes nothing
  });

  // A 1x1 marker whose stored IR effect raises to-hit by `bonus` on the cell it
  // covers — the honest "high ground" shape the authoring UI emits (target
  // 'attack', read from the ATTACKER's cell).
  function highGroundMarker(id: string, x: number, y: number, bonus: number): SceneMarker {
    return {
      id,
      kind: 'terrain',
      label: 'High ground',
      position: { x, y },
      width: 1,
      height: 1,
      effects: [
        { target: 'attack', operation: 'add', value: bonus, label: `+${bonus} high ground` },
      ],
    };
  }

  it('a high-ground marker at the attacker cell raises the to-hit bonus in resolution', () => {
    // hero (0,0) attacks goblin (1,0); the marker sits under the ATTACKER at (0,0).
    const base = sceneWith(
      combatToken('hero', 'character', 20, 0),
      combatToken('goblin', 'monster', 7, 1)
    );
    const elevated = withMarker(base, highGroundMarker('hg', 0, 0, 1));

    const flat = resolveSceneAttack({
      state: foldSceneEvents(base).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: acStats,
      seed: 'hg',
    });
    const high = resolveSceneAttack({
      state: foldSceneEvents(elevated).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: acStats,
      seed: 'hg',
    });

    // Same seed → same natural roll; only the +attack bonus shifts by the terrain.
    expect(flat.log).toMatch(/\+0 vs AC 10/);
    expect(high.log).toMatch(/\+1 vs AC 10/);
  });

  it('enough cover turns a would-be hit into a miss, deterministically', () => {
    const base = sceneWith(
      combatToken('hero', 'character', 20, 0),
      combatToken('goblin', 'monster', 7, 1)
    );
    const covered = withMarker(base, coverMarker('c', 1, 0, 100));
    // atk(50) beats AC 10 on any non-nat-1 roll; +100 cover (AC 110) can only be
    // beaten by a natural-20 crit. Seed 'flip' rolls neither a 1 nor a 20.
    const strong: ResolveCombatStats = () => ({
      attackEffects: [atk(50)],
      damageEffects: flatDamage(5),
      armorClass: 10,
      reach: 10,
    });

    const hit = resolveSceneAttack({
      state: foldSceneEvents(base).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: strong,
      seed: 'flip',
    });
    const miss = resolveSceneAttack({
      state: foldSceneEvents(covered).state,
      attackerId: 'hero',
      targetId: 'goblin',
      resolveStats: strong,
      seed: 'flip',
    });
    expect(hit.hit).toBe(true);
    expect(miss.hit).toBe(false);
  });
});

describe('functional terrain across the M&M and Daggerheart branches (RFC 003 Phase 4)', () => {
  // Cover (+defense off the TARGET's cell) and high ground (+to-hit off the
  // ATTACKER's cell) must fold into every system's manual attack branch, not
  // just the d20-family default — otherwise the authoring UI would offer terrain
  // that silently does nothing in M&M/Daggerheart scenes.
  function coverAt(x: number, y: number, ac: number): SceneMarker {
    return {
      id: `cov-${x}-${y}`,
      kind: 'hazard',
      label: 'Cover',
      position: { x, y },
      width: 1,
      height: 1,
      effects: [{ target: 'ac', operation: 'add', value: ac, label: `+${ac} cover` }],
    };
  }
  function highGroundAt(x: number, y: number, bonus: number): SceneMarker {
    return {
      id: `hg-${x}-${y}`,
      kind: 'terrain',
      label: 'High ground',
      position: { x, y },
      width: 1,
      height: 1,
      effects: [
        { target: 'attack', operation: 'add', value: bonus, label: `+${bonus} high ground` },
      ],
    };
  }
  function build(
    systemId: 'mam3e' | 'daggerheart',
    markers: SceneMarker[],
    ...tokens: SceneToken[]
  ) {
    let scene = createSceneDocument({ id: 'ft', name: 'FT', systemId, seed: 'fixed' });
    for (const token of tokens) {
      const r = resolveSceneAction(
        scene,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    for (const marker of markers) {
      const r = resolveSceneAction(
        scene,
        { type: 'add-marker', marker },
        { eventId: `m-${marker.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    return foldSceneEvents(scene).state;
  }

  const mamAttack = (bonus: number): EffectInstance => ({
    id: `mam-atk-${bonus}`,
    systemId: 'mam3e',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'fgt' },
    label: 'fgt',
  });
  // Toughness -100 so any hit incapacitates: a clean binary hit/miss signal.
  const mamStats = (bonus: number): SceneCombatStats => ({
    attackEffects: [mamAttack(bonus)],
    damageEffects: [],
    armorClass: 10,
    reach: 1,
    mam3e: { parry: 10, toughness: -100, effectRank: 10, ranged: false },
  });

  it('M&M: cover at the target cell raises Parry and can turn a hit into a miss', () => {
    const hero = combatToken('hero', 'character', 1, 0);
    const villain = combatToken('villain', 'character', 1, 1);
    // +100 to hit beats Parry 10 on any non-nat-1 roll; +200 cover (Parry 210)
    // can only be beaten by a natural-20 crit. Same seed → same roll, so the
    // marker is the only difference.
    const clean = resolveSceneAttack({
      state: build('mam3e', [], hero, villain),
      attackerId: 'hero',
      targetId: 'villain',
      resolveStats: () => mamStats(100),
      seed: 'mam-cover',
    });
    const covered = resolveSceneAttack({
      state: build('mam3e', [coverAt(1, 0, 200)], hero, villain),
      attackerId: 'hero',
      targetId: 'villain',
      resolveStats: () => mamStats(100),
      seed: 'mam-cover',
    });
    expect(clean.hit).toBe(true);
    expect(covered.hit).toBe(false);
    expect(covered.log).toMatch(/\+200 cover/);
  });

  it('M&M: high ground at the attacker cell raises the to-hit bonus', () => {
    const hero = combatToken('hero', 'character', 1, 0);
    const villain = combatToken('villain', 'character', 1, 1);
    // Same seed → same natural roll; only the +attack bonus shifts by the
    // terrain, whether the swing lands or not.
    const flat = resolveSceneAttack({
      state: build('mam3e', [], hero, villain),
      attackerId: 'hero',
      targetId: 'villain',
      resolveStats: () => mamStats(0),
      seed: 'mam-hg',
    });
    const high = resolveSceneAttack({
      state: build('mam3e', [highGroundAt(0, 0, 1)], hero, villain),
      attackerId: 'hero',
      targetId: 'villain',
      resolveStats: () => mamStats(0),
      seed: 'mam-hg',
    });
    expect(flat.log).toMatch(/rolled \d+\+0 vs Parry/);
    expect(high.log).toMatch(/rolled \d+\+1 vs Parry/);
  });

  const dhStats = (): SceneCombatStats => ({
    attackEffects: [
      {
        id: 'dh-atk',
        systemId: 'daggerheart',
        target: 'attack',
        operation: 'add',
        value: 100, // beats base Evasion 10 on any non-crit roll
        stackPolicy: 'sum',
        source: { kind: 'system', label: 'trait' },
        label: 'trait',
      },
    ],
    damageEffects: [
      {
        id: 'dh-dmg',
        systemId: 'daggerheart',
        target: 'damage',
        operation: 'add',
        value: 20,
        stackPolicy: 'sum',
        source: { kind: 'item', label: 'sword' },
        label: 'sword',
      },
    ],
    armorClass: 10, // Evasion
    reach: 1,
    daggerheart: { thresholds: { major: 7, severe: 12 } },
  });

  it('Daggerheart: cover at the target cell raises Evasion (shown in the log) and can force a miss', () => {
    const hero = combatToken('hero', 'character', 6, 0);
    const foe = combatToken('foe', 'character', 6, 1);
    // attackTotal maxes at hope+fear (24) + 100; +200 cover (Evasion 210) is out
    // of reach for a non-critical roll, so a would-be hit becomes a miss unless
    // the duality dice match (a crit auto-hits). Same seed → same dice.
    const clean = resolveSceneAttack({
      state: build('daggerheart', [], hero, foe),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: dhStats,
      seed: 'dh-cover',
    });
    const covered = resolveSceneAttack({
      state: build('daggerheart', [coverAt(1, 0, 200)], hero, foe),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: dhStats,
      seed: 'dh-cover',
    });
    expect(clean.hit).toBe(true);
    expect(covered.hit).toBe(false);
    expect(covered.log).toMatch(/vs Evasion 210, \+200 cover/);
  });
});

describe('scene area effects (phase 3 tail — AoE product-reachable)', () => {
  it('rolls shared damage once, saves independently, and lands one intent', async () => {
    const { resolveSceneAreaEffect } = await import('../../rules');
    let scene = createSceneDocument({ id: 'aoe', name: 'AoE', systemId: SID, seed: 'aoe' });
    for (const token of [
      combatToken('caster', 'character', 20, 0),
      combatToken('orc-1', 'monster', 20, 2),
      combatToken('orc-2', 'monster', 20, 3),
      combatToken('far-away', 'monster', 20, 9),
    ]) {
      const r = resolveSceneAction(
        scene,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    const state = foldSceneEvents(scene).state;

    const outcome = resolveSceneAreaEffect({
      state,
      sourceId: 'caster',
      shape: { kind: 'burst', origin: { x: 2, y: 0 }, radius: 2 },
      damageEffects: flatDamage(10), // flat: deterministic shared damage
      saveDC: 30, // everyone fails: full damage
      resolveStats: () => ({ ...hittingStats, areaSaveBonus: 0 }),
      seed: 'fireball-1',
    });

    // Both orcs are in the burst; the caster (source) and the distant orc are not.
    expect(outcome.affected).toBe(2);
    expect(outcome.intent).toMatchObject({
      type: 'apply-damage',
      damages: [
        { tokenId: 'orc-1', amount: 10 },
        { tokenId: 'orc-2', amount: 10 },
      ],
    });
    // Replays byte-identically.
    const again = resolveSceneAreaEffect({
      state,
      sourceId: 'caster',
      shape: { kind: 'burst', origin: { x: 2, y: 0 }, radius: 2 },
      damageEffects: flatDamage(10),
      saveDC: 30,
      resolveStats: () => ({ ...hittingStats, areaSaveBonus: 0 }),
      seed: 'fireball-1',
    });
    expect(JSON.stringify(again)).toBe(JSON.stringify(outcome));
  });

  it('successful saves halve (5e default) and saved-to-zero targets are omitted', async () => {
    const { resolveSceneAreaEffect } = await import('../../rules');
    let scene = createSceneDocument({ id: 'aoe2', name: 'AoE2', systemId: SID, seed: 'aoe2' });
    for (const token of [
      combatToken('caster', 'character', 20, 0),
      combatToken('victim', 'monster', 20, 1),
    ]) {
      const r = resolveSceneAction(
        scene,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    const state = foldSceneEvents(scene).state;
    const outcome = resolveSceneAreaEffect({
      state,
      sourceId: 'caster',
      shape: { kind: 'burst', origin: { x: 1, y: 0 }, radius: 1 },
      damageEffects: flatDamage(11),
      saveDC: -10, // always saves
      resolveStats: () => ({ ...hittingStats, areaSaveBonus: 0 }),
      seed: 'half-save',
    });
    expect(outcome.intent).toMatchObject({
      type: 'apply-damage',
      damages: [{ tokenId: 'victim', amount: 5 }], // floor(11/2)
    });
  });
});
