import { describe, it, expect } from 'vitest';

import {
  coverBetween,
  coverBetweenElevated,
  makeEffectId,
  resolveSceneAttack,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import type { SceneMarker, SceneState, SceneToken } from '../../types/core/scene';

/**
 * Tier 2 verticality: line of sight and cover account for wall heights and the
 * elevations of both ends. A sight line clears a wall it passes above, so a flyer
 * can shoot over a low wall that still blocks a creature on the ground — while a
 * full-height wall blocks everyone, exactly as the flat 2D model did.
 */

// A wall occupying grid column x = 4, of the given top height in cells.
const wallColumn =
  (height: number) =>
  (cell: { x: number; y: number }): number =>
    cell.x === 4 ? height : 0;

describe('coverBetweenElevated', () => {
  it('matches the flat 2D model for full-height walls', () => {
    const elevated = coverBetweenElevated({ x: 0, y: 0 }, { x: 8, y: 0 }, wallColumn(Infinity));
    const flat = coverBetween({ x: 0, y: 0 }, { x: 8, y: 0 }, (c) => c.x === 4);
    expect(elevated).toBe('total');
    expect(elevated).toBe(flat);
  });

  it('a flyer clears a low wall that stops a grounded shooter', () => {
    const wall = wallColumn(2); // 10 ft
    // On the ground, the flat sight line is stopped by the wall.
    expect(coverBetweenElevated({ x: 0, y: 0, z: 0 }, { x: 8, y: 0, z: 0 }, wall)).toBe('total');
    // 30 ft up, the line to a distant ground target passes over the top.
    expect(coverBetweenElevated({ x: 0, y: 0, z: 6 }, { x: 8, y: 0, z: 0 }, wall)).toBe('none');
  });

  it('a wall as tall as the flyer still blocks it', () => {
    expect(coverBetweenElevated({ x: 0, y: 0, z: 6 }, { x: 8, y: 0, z: 0 }, wallColumn(6))).toBe(
      'total'
    );
  });
});

function atk(bonus: number): EffectInstance {
  return {
    id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack',
  };
}

const STATS: ResolveCombatStats = () => ({
  attackEffects: [atk(0)],
  damageEffects: [],
  armorClass: 10,
  reach: 10,
});

function archer(z?: number): SceneToken {
  return {
    id: 'archer',
    name: 'archer',
    kind: 'character',
    position: z != null ? { x: 0, y: 0, z } : { x: 0, y: 0 },
    size: 1,
    hp: { current: 20, max: 20 },
  };
}

const foe: SceneToken = {
  id: 'foe',
  name: 'foe',
  kind: 'character',
  position: { x: 4, y: 0 },
  size: 1,
  hp: { current: 20, max: 20 },
};

// A 5-ft (1-cell) wall between the archer and the foe.
const lowWall: SceneMarker = {
  id: 'wall',
  kind: 'terrain',
  label: 'Low Wall',
  position: { x: 2, y: 0 },
  width: 1,
  height: 1,
  wallHeight: 1,
  effects: [{ target: 'cover', operation: 'set', value: 'total', label: 'Low Wall' }],
};

function scene(attacker: SceneToken): SceneState {
  return {
    sceneId: 's',
    name: 'Wall',
    systemId: 'dnd-5e-2014',
    grid: { width: 10, height: 10, cellSize: 5 },
    tokens: { archer: attacker, foe },
    markers: { wall: lowWall },
    initiative: [],
    round: 1,
    seed: 'seed',
  };
}

describe('resolveSceneAttack — a low wall and a flyer', () => {
  it('blocks a grounded shooter behind the wall (no line of sight)', () => {
    const out = resolveSceneAttack({
      state: scene(archer()),
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    expect(out.hit).toBe(false);
    expect(out.log).toMatch(/no line of sight/i);
  });

  it('lets the same shooter fire over the wall once it is 30 ft up', () => {
    const out = resolveSceneAttack({
      state: scene(archer(6)), // 30 ft up
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    expect(out.log).not.toMatch(/no line of sight/i);
    expect(out.log).toMatch(/vs AC/); // a real attack roll happened
  });
});
