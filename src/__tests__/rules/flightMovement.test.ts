import { describe, it, expect } from 'vitest';

import { gridDistance, moveToward } from '../../rules';
import type { SceneCoordinate } from '../../types/core/scene';

/**
 * Flyer movement: with `canFly`, the pathfinder closes in three dimensions,
 * spending fly speed to gain or lose altitude. Without it, movement stays on the
 * floor plane — the exact prior 2D search — so a grounded creature simply cannot
 * reach a target hanging in the air.
 */

const at = (x: number, y: number, z?: number): SceneCoordinate => ({ x, y, z });

describe('moveToward with flight', () => {
  it('a flyer climbs to engage a target overhead', () => {
    const move = moveToward({
      from: at(0, 0, 0),
      target: at(0, 0, 5), // 25 ft up
      speed: 6,
      reach: 1,
      canFly: true,
    });
    expect(move.inReach).toBe(true);
    expect(gridDistance(move.destination, at(0, 0, 5)) <= 1).toBe(true);
    expect(move.destination.z).toBeGreaterThan(0); // it actually left the ground
  });

  it('a grounded creature cannot reach the same target overhead', () => {
    const move = moveToward({
      from: at(0, 0, 0),
      target: at(0, 0, 5),
      speed: 6,
      reach: 1,
      // canFly omitted → ground-bound
    });
    expect(move.inReach).toBe(false);
    expect(move.destination.z ?? 0).toBe(0); // never left the floor
  });

  it('a flyer descends to engage a grounded target', () => {
    const move = moveToward({
      from: at(0, 0, 6), // 30 ft up
      target: at(3, 0, 0),
      speed: 10,
      reach: 1,
      canFly: true,
    });
    expect(move.inReach).toBe(true);
    expect(gridDistance(move.destination, at(3, 0, 0)) <= 1).toBe(true);
  });

  it('respects the fly-speed budget — a far, high target stays out of reach', () => {
    const move = moveToward({
      from: at(0, 0, 0),
      target: at(0, 0, 20), // 100 ft straight up
      speed: 6, // only six cells of flight
      reach: 1,
      canFly: true,
    });
    expect(move.inReach).toBe(false);
    expect(move.cost).toBeLessThanOrEqual(6);
    expect(move.destination.z).toBe(6); // climbed as far as the budget allowed
  });

  it('keeps the prior 2D shape when flight is off (no z leaks in)', () => {
    const params = { from: at(0, 0), target: at(5, 0), speed: 3, reach: 1 } as const;
    const grounded = moveToward(params);
    expect(moveToward({ ...params, canFly: false })).toEqual(grounded);
    // Ground-bound: closes to the nearest reachable distance, on the floor plane.
    expect('z' in grounded.destination).toBe(false);
    expect(gridDistance(grounded.destination, at(5, 0))).toBe(2);
    expect(grounded.cost).toBeLessThanOrEqual(3);
    expect(grounded.inReach).toBe(false);
  });
});
