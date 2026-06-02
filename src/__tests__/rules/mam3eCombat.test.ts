import { describe, it, expect } from 'vitest';

import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import {
  buildMam3eCombatant,
  resolveSceneAttack,
  runCombatRound,
  runSceneRound,
  type EffectInstance,
  type ResolveCombatStats,
  type RoundCombatant,
} from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type {
  SceneActionIntent,
  SceneDocument,
  SceneState,
  SceneToken,
} from '../../types/core/scene';

/**
 * M&M 3e in combat: attack vs Parry/Dodge, then a Toughness save whose shortfall
 * drives a condition track (Bruised → Dazed → Staggered → Incapacitated). No HP.
 */

const NOW = new Date('2026-05-01T12:00:00.000Z');
let seq = 0;
function apply(scene: SceneDocument, intent: SceneActionIntent): SceneDocument {
  const result = resolveSceneAction(scene, intent, { eventId: `evt-${seq++}`, createdAt: NOW });
  expect(result.issues).toEqual([]);
  return appendSceneEvent(scene, result.event!);
}

describe('buildMam3eCombatant', () => {
  it('reads defenses, Toughness, and attack from the sheet (no HP)', () => {
    const doc = {
      id: 'hero',
      name: 'Hero',
      systemId: 'mam3e',
      system: {
        abilities: { fgt: 8, str: 5 },
        skills: { 'close-combat': { rank: 2 } },
        defenses: { parry: { total: 12 }, dodge: { total: 10 }, toughness: { total: 6 } },
      },
    } as unknown as CharacterDocument<SystemDataModel>;
    const c = buildMam3eCombatant(doc, { tokenId: 't', position: { x: 0, y: 0 } });
    expect(c.parry).toBe(12);
    expect(c.dodge).toBe(10);
    expect(c.toughness).toBe(6);
    expect(c.effectRank).toBe(5); // Strength baseline
    expect(c.attackEffects[0].value).toBe(10); // FGT 8 + close-combat 2
    expect(c.token.hp).toBeUndefined(); // condition track, not HP
    expect(c.token.conditions).toEqual({
      bruised: 0,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
  });
});

describe('resolveSceneAttack — M&M condition track', () => {
  const attack = (value: number): EffectInstance => ({
    id: `atk-${value}`,
    systemId: 'mam3e',
    target: 'attack',
    operation: 'add',
    value,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'atk',
    category: 'other',
  });
  function token(id: string): SceneToken {
    return {
      id,
      name: id,
      kind: 'character',
      position: { x: 0, y: 0 },
      size: 1,
      conditions: { bruised: 0, dazed: false, staggered: false, incapacitated: false },
    };
  }
  function scene(): SceneState {
    return {
      sceneId: 's',
      name: 'M&M',
      systemId: 'mam3e',
      grid: { width: 8, height: 8, cellSize: 5 },
      tokens: { hero: token('hero'), foe: token('foe') },
      markers: {},
      initiative: [],
      round: 1,
      seed: 'seed',
    };
  }
  function stats(defense: number, toughness: number, effectRank: number): ResolveCombatStats {
    return () => ({
      attackEffects: [attack(20)],
      damageEffects: [],
      armorClass: defense,
      reach: 1,
      toughness,
      effectRank,
    });
  }

  it('a hard hit vs feeble Toughness incapacitates', () => {
    const out = resolveSceneAttack({
      state: scene(),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: stats(1, -100, 20), // huge shortfall → 15+
      seed: 's',
    });
    expect(out.hit).toBe(true);
    expect(out.intent?.type).toBe('apply-conditions');
    const delta = out.intent && 'delta' in out.intent ? out.intent.delta : undefined;
    expect(delta?.incapacitated).toBe(true);
  });

  it('a hit that the target saves against applies no condition', () => {
    const out = resolveSceneAttack({
      state: scene(),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: stats(1, 100, 0), // Toughness easily beats the DC
      seed: 's',
    });
    expect(out.hit).toBe(true);
    expect(out.intent).toBeUndefined();
  });

  it('a miss vs high defense does nothing', () => {
    const out = resolveSceneAttack({
      state: scene(),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: stats(100, -100, 20),
      seed: 's',
    });
    expect(out.hit).toBe(false);
    expect(out.intent).toBeUndefined();
  });
});

describe('M&M in the auto-round (runCombatRound)', () => {
  const attack = (value: number): EffectInstance => ({
    id: `atk-${value}`,
    systemId: 'mam3e',
    target: 'attack',
    operation: 'add',
    value,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'atk',
    category: 'other',
  });
  function combatant(
    id: string,
    x: number,
    faction: string,
    overrides: Partial<RoundCombatant> = {}
  ): RoundCombatant {
    return {
      tokenId: id,
      faction,
      position: { x, y: 0 },
      armorClass: 1, // feeble defense → reliably hit
      hp: { current: 1, max: 1 }, // synthetic up/down proxy (M&M has no HP)
      attackEffects: [attack(20)],
      damageEffects: [],
      reach: 1,
      toughness: -100, // hopeless save
      effectRank: 20, // DC 35 → shortfall ≥ 15 → incapacitated
      conditions: { bruised: 0, dazed: false, staggered: false, incapacitated: false },
      ...overrides,
    };
  }

  it('a Toughness rout incapacitates a target → down proxy + latched track', () => {
    const result = runCombatRound({
      order: [combatant('hero', 0, 'party'), combatant('foe', 1, 'monsters')],
      seed: 'mm-round',
      round: 1,
      systemId: 'mam3e',
    });
    const heroTurn = result.turns.find((t) => t.tokenId === 'hero')!;
    expect(heroTurn.intent?.type).toBe('apply-conditions');
    const delta = heroTurn.intent && 'delta' in heroTurn.intent ? heroTurn.intent.delta : undefined;
    expect(delta?.incapacitated).toBe(true);
    // The incapacitated foe drops to the down proxy and its track latches.
    expect(result.finalHp.foe).toBe(0);
    expect(result.finalConditions.foe.incapacitated).toBe(true);
    // Down at the start of its turn, the foe is skipped — the loop re-derived it out.
    const foeTurn = result.turns.find((t) => t.tokenId === 'foe')!;
    expect(foeTurn.skipped).toBe(true);
  });

  it('a target that saves keeps standing (no condition, still up)', () => {
    const result = runCombatRound({
      order: [
        combatant('hero', 0, 'party'),
        combatant('foe', 1, 'monsters', { toughness: 100 }), // shrugs everything off
      ],
      seed: 'mm-save',
      round: 1,
      systemId: 'mam3e',
    });
    const heroTurn = result.turns.find((t) => t.tokenId === 'hero')!;
    expect(heroTurn.intent).toBeUndefined(); // hit, but saved → no condition
    expect(result.finalHp.foe).toBe(1); // still up
    expect(result.finalConditions.foe.incapacitated).toBe(false);
  });
});

describe('M&M through runSceneRound (HP-less tokens admitted)', () => {
  const attack = (value: number): EffectInstance => ({
    id: `atk-${value}`,
    systemId: 'mam3e',
    target: 'attack',
    operation: 'add',
    value,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'atk',
    category: 'other',
  });
  function token(id: string, x: number, kind: SceneToken['kind']): SceneToken {
    return {
      id,
      name: id,
      kind,
      position: { x, y: 0 },
      size: 1,
      conditions: { bruised: 0, dazed: false, staggered: false, incapacitated: false },
    };
  }
  function scene(): SceneState {
    return {
      sceneId: 's',
      name: 'M&M',
      systemId: 'mam3e',
      grid: { width: 8, height: 8, cellSize: 5 },
      // Different kinds → opposing factions (party vs monsters), so they fight.
      tokens: { hero: token('hero', 0, 'character'), foe: token('foe', 1, 'monster') },
      markers: {},
      initiative: [
        { tokenId: 'hero', value: 20 },
        { tokenId: 'foe', value: 10 },
      ],
      round: 1,
      seed: 'seed',
    };
  }
  const stats: ResolveCombatStats = () => ({
    attackEffects: [attack(20)],
    damageEffects: [],
    armorClass: 1,
    reach: 1,
    toughness: -100,
    effectRank: 20,
  });

  it('admits HP-less M&M tokens to the round and narrates the condition outcome', () => {
    const out = runSceneRound({ state: scene(), resolveStats: stats, seed: 'mm', round: 1 });
    // Both HP-less tokens were admitted (not silently dropped for lacking HP).
    expect(out.result.turns).toHaveLength(2);
    // The hero (acts first) incapacitates the foe → an apply-conditions intent flows out.
    const cond = out.intents.find((i) => i.type === 'apply-conditions');
    expect(cond).toBeDefined();
    expect(out.log.some((line) => line.includes('incapacitates'))).toBe(true);
  });
});

describe('apply-conditions scene event accumulates the track', () => {
  it('stacks Bruised and latches the flags', () => {
    let scene = createSceneDocument({
      id: 's',
      name: 'S',
      systemId: 'mam3e',
      grid: { width: 8, height: 8 },
      seed: 'seed',
      now: NOW,
    });
    scene = apply(scene, {
      type: 'place-token',
      token: {
        id: 'foe',
        name: 'Foe',
        kind: 'character',
        position: { x: 1, y: 1 },
        size: 1,
        conditions: { bruised: 0, dazed: false, staggered: false, incapacitated: false },
      },
    });
    scene = apply(scene, {
      type: 'apply-conditions',
      tokenId: 'foe',
      delta: { bruised: 1, dazed: true, staggered: false, incapacitated: false },
    });
    scene = apply(scene, {
      type: 'apply-conditions',
      tokenId: 'foe',
      delta: { bruised: 1, dazed: false, staggered: true, incapacitated: false },
    });
    expect(foldSceneEvents(scene).state.tokens.foe.conditions).toEqual({
      bruised: 2,
      dazed: true,
      staggered: true,
      incapacitated: false,
    });
  });
});
