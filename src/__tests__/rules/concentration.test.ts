import { describe, it, expect } from 'vitest';

import {
  concentrationBreak,
  resolveConcentrationCheck,
  resolveSceneAttack,
  runCombatRound,
  type EffectInstance,
  type ResolveCombatStats,
  type RoundCombatant,
} from '../../rules';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type {
  SceneDocument,
  SceneState,
  SceneToken,
  SceneActionIntent,
} from '../../types/core/scene';
import type { SeededRng } from '../../scene/seededRng';

/**
 * 5e concentration: a concentrating creature that takes damage makes a CON save
 * (DC = max(10, half the damage)) or loses the spell.
 */

function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return { next: () => 0, nextInt: () => 0, rollDie: () => faces[Math.min(i++, faces.length - 1)] };
}

describe('resolveConcentrationCheck', () => {
  it('DC is the greater of 10 and half the damage', () => {
    expect(
      resolveConcentrationCheck({ damage: 8, conSaveBonus: 0, rng: scriptedRng([10]) }).dc
    ).toBe(10);
    expect(
      resolveConcentrationCheck({ damage: 30, conSaveBonus: 0, rng: scriptedRng([10]) }).dc
    ).toBe(15);
  });

  it('maintains when total meets the DC, breaks otherwise', () => {
    expect(
      resolveConcentrationCheck({ damage: 30, conSaveBonus: 5, rng: scriptedRng([10]) }).maintained
    ).toBe(true); // 10+5=15 >= 15
    expect(
      resolveConcentrationCheck({ damage: 30, conSaveBonus: 0, rng: scriptedRng([10]) }).maintained
    ).toBe(false); // 10 < 15
  });

  it('zero damage never threatens concentration', () => {
    expect(
      resolveConcentrationCheck({ damage: 0, conSaveBonus: -50, rng: scriptedRng([1]) }).maintained
    ).toBe(true);
  });
});

describe('concentrationBreak', () => {
  it('produces a clear intent on a failed save', () => {
    const out = concentrationBreak({
      tokenId: 'mage',
      concentration: 'haste',
      conSaveBonus: -100,
      damage: 20,
      rng: scriptedRng([10]),
    });
    expect(out?.intent).toEqual({ type: 'set-concentration', tokenId: 'mage', spell: undefined });
  });

  it('returns nothing when not concentrating or unharmed', () => {
    expect(
      concentrationBreak({
        tokenId: 'm',
        concentration: undefined,
        conSaveBonus: 0,
        damage: 9,
        rng: scriptedRng([1]),
      })
    ).toBeUndefined();
    expect(
      concentrationBreak({
        tokenId: 'm',
        concentration: 'bless',
        conSaveBonus: 0,
        damage: 0,
        rng: scriptedRng([1]),
      })
    ).toBeUndefined();
  });
});

describe('set-concentration scene event', () => {
  const NOW = new Date('2026-06-01T00:00:00.000Z');
  let seq = 0;
  function apply(scene: SceneDocument, intent: SceneActionIntent): SceneDocument {
    const result = resolveSceneAction(scene, intent, { eventId: `e${seq++}`, createdAt: NOW });
    expect(result.issues).toEqual([]);
    return appendSceneEvent(scene, result.event!);
  }

  it('sets and clears the concentrated spell', () => {
    let scene = createSceneDocument({
      id: 's',
      name: 'S',
      systemId: 'dnd-5e-2014',
      grid: { width: 6, height: 6 },
      seed: 'c',
      now: NOW,
    });
    scene = apply(scene, {
      type: 'place-token',
      token: {
        id: 'mage',
        name: 'Mage',
        kind: 'character',
        position: { x: 1, y: 1 },
        size: 1,
        hp: { current: 20, max: 20 },
      },
    });
    scene = apply(scene, { type: 'set-concentration', tokenId: 'mage', spell: 'Haste' });
    expect(foldSceneEvents(scene).state.tokens.mage.concentration).toBe('Haste');
    scene = apply(scene, { type: 'set-concentration', tokenId: 'mage' });
    expect(foldSceneEvents(scene).state.tokens.mage.concentration).toBeUndefined();
  });
});

const attack = (value: number): EffectInstance => ({
  id: `atk-${value}`,
  systemId: 'dnd-5e-2014',
  target: 'attack',
  operation: 'add',
  value,
  stackPolicy: 'sum',
  source: { kind: 'custom', id: 'x', label: 'x' },
  label: 'atk',
  category: 'other',
});
const dmg: EffectInstance[] = [
  {
    id: 'd',
    systemId: 'dnd-5e-2014',
    target: 'damage',
    operation: 'add',
    value: 12,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'd',
    category: 'other',
  },
];

describe('manual attack breaks a 5e concentrating target', () => {
  function mageToken(): SceneToken {
    return {
      id: 'mage',
      name: 'Mage',
      kind: 'character',
      position: { x: 1, y: 0 },
      size: 1,
      hp: { current: 20, max: 20 },
      concentration: 'Bless',
    };
  }
  const stats: ResolveCombatStats = () => ({
    attackEffects: [attack(20)],
    damageEffects: dmg,
    armorClass: 1,
    reach: 1,
    saveBonus: () => -100, // the CON save can't succeed
  });

  it('emits a set-concentration clear when the save fails', () => {
    const state: SceneState = {
      sceneId: 's',
      name: 'S',
      systemId: 'dnd-5e-2014',
      grid: { width: 8, height: 8, cellSize: 5 },
      tokens: {
        hero: {
          id: 'hero',
          name: 'Hero',
          kind: 'character',
          position: { x: 0, y: 0 },
          size: 1,
          hp: { current: 20, max: 20 },
        },
        mage: mageToken(),
      },
      markers: {},
      initiative: [],
      round: 1,
      seed: 's',
    };
    const out = resolveSceneAttack({
      state,
      attackerId: 'hero',
      targetId: 'mage',
      resolveStats: stats,
      seed: 's',
    });
    expect(out.hit).toBe(true);
    const clear = out.extraIntents?.find((i) => i.type === 'set-concentration');
    expect(clear).toEqual({ type: 'set-concentration', tokenId: 'mage', spell: undefined });
    expect(out.log).toMatch(/loses concentration on Bless/);
  });
});

describe('the auto-round breaks concentration on damage', () => {
  it('a struck concentrating combatant drops its spell', () => {
    const order: RoundCombatant[] = [
      {
        tokenId: 'hero',
        faction: 'party',
        position: { x: 0, y: 0 },
        armorClass: 1,
        hp: { current: 20, max: 20 },
        attackEffects: [attack(20)],
        damageEffects: dmg,
        reach: 1,
      },
      {
        tokenId: 'mage',
        faction: 'monsters',
        position: { x: 1, y: 0 },
        armorClass: 1,
        hp: { current: 30, max: 30 },
        attackEffects: [attack(0)],
        damageEffects: [],
        reach: 1,
        concentration: 'Hold Person',
        saveBonus: () => -100,
      },
    ];
    const result = runCombatRound({ order, seed: 'conc', round: 1, systemId: 'dnd-5e-2014' });
    const clear = result.intents.find((i) => i.type === 'set-concentration');
    expect(clear).toEqual({ type: 'set-concentration', tokenId: 'mage', spell: undefined });
  });
});
