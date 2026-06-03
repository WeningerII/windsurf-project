import { describe, it, expect } from 'vitest';

import {
  coverBetweenElevated,
  makeEffectId,
  resolveSceneAttack,
  sceneWallTopAt,
  tokenBlocksLineOfEffect,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * Destructible cover: an `object` token blocks line of sight like a wall while it
 * stands, and once it is reduced to 0 HP it stops blocking. Reuses the token
 * system (HP, position, the attack/damage path) and the elevation-aware
 * line-of-effect built for Tier 2 verticality.
 */

const atk = (bonus: number): EffectInstance => ({
  id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
  systemId: 'dnd-5e-2014',
  target: 'attack',
  operation: 'add',
  value: bonus,
  stackPolicy: 'sum',
  source: { kind: 'system', label: 'attack' },
  label: 'attack',
});

const STATS: ResolveCombatStats = () => ({
  attackEffects: [atk(0)],
  damageEffects: [],
  armorClass: 10,
  reach: 10,
});

function token(id: string, x: number, y: number, z?: number): SceneToken {
  return {
    id,
    name: id,
    kind: 'character',
    position: z != null ? { x, y, z } : { x, y },
    size: 1,
    hp: { current: 20, max: 20 },
  };
}

function crate(opts: { hp?: number; wallHeight?: number } = {}): SceneToken {
  return {
    id: 'crate',
    name: 'Crate',
    kind: 'object',
    position: { x: 2, y: 0 },
    size: 1,
    blocksLineOfEffect: true,
    wallHeight: opts.wallHeight,
    hp: { current: opts.hp ?? 20, max: 20 },
  };
}

function scene(tokens: SceneToken[]): SceneState {
  return {
    sceneId: 's',
    name: 'Cover',
    systemId: 'dnd-5e-2014',
    grid: { width: 10, height: 10, cellSize: 5 },
    tokens: Object.fromEntries(tokens.map((t) => [t.id, t])),
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
  };
}

describe('destructible object cover', () => {
  it('a standing object blocks line of sight; a destroyed one does not', () => {
    const standing = scene([token('archer', 0, 0), token('foe', 4, 0), crate()]);
    expect(coverBetweenElevated({ x: 0, y: 0 }, { x: 4, y: 0 }, sceneWallTopAt(standing))).toBe(
      'total'
    );

    const felled = scene([token('archer', 0, 0), token('foe', 4, 0), crate({ hp: 0 })]);
    expect(tokenBlocksLineOfEffect(felled.tokens.crate)).toBe(false);
    expect(coverBetweenElevated({ x: 0, y: 0 }, { x: 4, y: 0 }, sceneWallTopAt(felled))).toBe(
      'none'
    );
  });

  it('a low object can be shot over by a flyer, like a low wall', () => {
    const state = scene([token('archer', 0, 0, 6), token('foe', 4, 0), crate({ wallHeight: 1 })]);
    const wallTop = sceneWallTopAt(state);
    expect(coverBetweenElevated({ x: 0, y: 0, z: 0 }, { x: 4, y: 0 }, wallTop)).toBe('total'); // ground blocked
    expect(coverBetweenElevated({ x: 0, y: 0, z: 6 }, { x: 4, y: 0 }, wallTop)).toBe('none'); // flyer clears
  });

  it('resolveSceneAttack is blocked by intact cover, then lands once it is destroyed', () => {
    const blocked = resolveSceneAttack({
      state: scene([token('archer', 0, 0), token('foe', 4, 0), crate()]),
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    expect(blocked.hit).toBe(false);
    expect(blocked.log).toMatch(/no line of sight/i);

    const clear = resolveSceneAttack({
      state: scene([token('archer', 0, 0), token('foe', 4, 0), crate({ hp: 0 })]),
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    expect(clear.log).not.toMatch(/no line of sight/i);
    expect(clear.log).toMatch(/vs AC/);
  });
});
