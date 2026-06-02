import { describe, it, expect } from 'vitest';

import {
  rollDeathSave,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type { SceneDocument, SceneActionIntent } from '../../types/core/scene';
import type { SeededRng } from '../../scene/seededRng';

/**
 * 5e death saves: a downed character rolls each turn — 10+ succeeds, under 10
 * fails, a natural 1 is two failures, a natural 20 revives at 1 HP. Three
 * successes stabilize, three failures kill.
 */

function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return { next: () => 0, nextInt: () => 0, rollDie: () => faces[Math.min(i++, faces.length - 1)] };
}

describe('rollDeathSave', () => {
  it('10+ is a success, under 10 a failure', () => {
    expect(rollDeathSave({ rng: scriptedRng([15]), successes: 0, failures: 0 })).toEqual({
      roll: 15,
      successes: 1,
      failures: 0,
      status: 'dying',
    });
    expect(rollDeathSave({ rng: scriptedRng([5]), successes: 0, failures: 0 })).toMatchObject({
      successes: 0,
      failures: 1,
      status: 'dying',
    });
  });

  it('a natural 1 is two failures and a natural 20 revives', () => {
    expect(rollDeathSave({ rng: scriptedRng([1]), successes: 0, failures: 0 })).toMatchObject({
      failures: 2,
      status: 'dying',
    });
    expect(rollDeathSave({ rng: scriptedRng([20]), successes: 1, failures: 2 })).toEqual({
      roll: 20,
      successes: 0,
      failures: 0,
      status: 'revived',
    });
  });

  it('three successes stabilize, three failures kill', () => {
    expect(rollDeathSave({ rng: scriptedRng([12]), successes: 2, failures: 0 }).status).toBe(
      'stable'
    );
    expect(rollDeathSave({ rng: scriptedRng([4]), successes: 0, failures: 2 }).status).toBe('dead');
    expect(rollDeathSave({ rng: scriptedRng([1]), successes: 0, failures: 1 }).status).toBe('dead');
  });
});

describe('set-death-saves scene event', () => {
  const NOW = new Date('2026-06-01T00:00:00.000Z');
  let seq = 0;
  function apply(scene: SceneDocument, intent: SceneActionIntent): SceneDocument {
    const result = resolveSceneAction(scene, intent, { eventId: `e${seq++}`, createdAt: NOW });
    expect(result.issues).toEqual([]);
    return appendSceneEvent(scene, result.event!);
  }

  it('records and clears the tally', () => {
    let scene = createSceneDocument({
      id: 's',
      name: 'S',
      systemId: 'dnd-5e-2014',
      grid: { width: 6, height: 6 },
      seed: 'd',
      now: NOW,
    });
    scene = apply(scene, {
      type: 'place-token',
      token: {
        id: 'pc',
        name: 'PC',
        kind: 'character',
        position: { x: 1, y: 1 },
        size: 1,
        hp: { current: 0, max: 20 },
      },
    });
    scene = apply(scene, {
      type: 'set-death-saves',
      tokenId: 'pc',
      deathSaves: { successes: 1, failures: 2 },
    });
    expect(foldSceneEvents(scene).state.tokens.pc.deathSaves).toEqual({
      successes: 1,
      failures: 2,
    });
    scene = apply(scene, { type: 'set-death-saves', tokenId: 'pc' });
    expect(foldSceneEvents(scene).state.tokens.pc.deathSaves).toBeUndefined();
  });
});

describe('the auto-round rolls death saves for downed 5e characters', () => {
  const atk = (v: number): EffectInstance => ({
    id: `a${v}`,
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: v,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'a',
    category: 'other',
  });
  const downed = (kind: 'character' | 'monster', makesDeathSaves: boolean): RoundCombatant => ({
    tokenId: 'downed',
    faction: 'party',
    position: { x: 0, y: 0 },
    armorClass: 10,
    hp: { current: 0, max: 20 }, // already at 0
    attackEffects: [atk(5)],
    damageEffects: [],
    reach: 1,
    makesDeathSaves,
  });
  const foe: RoundCombatant = {
    tokenId: 'foe',
    faction: 'monsters',
    position: { x: 5, y: 0 },
    armorClass: 10,
    hp: { current: 20, max: 20 },
    attackEffects: [atk(0)],
    damageEffects: [],
    reach: 1,
  };

  it('a downed 5e character makes a death save (set-death-saves intent)', () => {
    const result = runCombatRound({
      order: [downed('character', true), foe],
      seed: 'ds',
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    const ds = result.intents.find((i) => i.type === 'set-death-saves');
    expect(ds).toBeDefined();
    if (ds && ds.type === 'set-death-saves') expect(ds.tokenId).toBe('downed');
    expect(result.turns.find((t) => t.tokenId === 'downed')!.skipped).toBe(true);
  });

  it('a downed monster does not make death saves', () => {
    const monster: RoundCombatant = { ...downed('monster', false), faction: 'monsters' };
    const result = runCombatRound({
      order: [monster, { ...foe, faction: 'party' }],
      seed: 'ds',
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    expect(result.intents.some((i) => i.type === 'set-death-saves')).toBe(false);
  });
});
