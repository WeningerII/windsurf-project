import { describe, it, expect } from 'vitest';

import { moveToward, gridDistance } from '../../rules';
import type { SceneCoordinate } from '../../types/core/common';

/** Build a block predicate from explicit cells. */
function cells(...list: SceneCoordinate[]): (c: SceneCoordinate) => boolean {
  const set = new Set(list.map((c) => `${c.x},${c.y}`));
  return (c) => set.has(`${c.x},${c.y}`);
}

describe('moveToward', () => {
  it('stays put when already within reach', () => {
    const out = moveToward({ from: { x: 0, y: 0 }, target: { x: 1, y: 0 }, speed: 6, reach: 1 });
    expect(out.destination).toEqual({ x: 0, y: 0 });
    expect(out.cost).toBe(0);
    expect(out.inReach).toBe(true);
  });

  it('closes to within reach on open ground when speed allows', () => {
    const out = moveToward({ from: { x: 0, y: 0 }, target: { x: 5, y: 0 }, speed: 10, reach: 1 });
    expect(out.inReach).toBe(true);
    expect(gridDistance(out.destination, { x: 5, y: 0 })).toBeLessThanOrEqual(1);
    expect(out.destination).not.toEqual({ x: 5, y: 0 }); // never ends on the target
  });

  it('moves as far as the budget allows when it cannot reach', () => {
    const out = moveToward({ from: { x: 0, y: 0 }, target: { x: 9, y: 0 }, speed: 3, reach: 1 });
    expect(out.inReach).toBe(false);
    expect(out.cost).toBeLessThanOrEqual(3);
    // It got strictly closer than it started (started 9 away).
    expect(gridDistance(out.destination, { x: 9, y: 0 })).toBeLessThan(9);
  });

  it('routes around a wall', () => {
    // Vertical wall x=2 for y=-2..2 between mover and target.
    const wall = cells(
      { x: 2, y: -2 },
      { x: 2, y: -1 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 }
    );
    const out = moveToward({
      from: { x: 0, y: 0 },
      target: { x: 5, y: 0 },
      speed: 20,
      reach: 1,
      isBlocked: wall,
    });
    expect(out.inReach).toBe(true);
    expect(gridDistance(out.destination, { x: 5, y: 0 })).toBeLessThanOrEqual(1);
    expect(wall(out.destination)).toBe(false); // never ends in a wall
  });

  it('does not end on a cell occupied by another creature', () => {
    const occupied = cells({ x: 4, y: 0 }, { x: 5, y: 0 }); // target + its melee cell
    const out = moveToward({
      from: { x: 0, y: 0 },
      target: { x: 5, y: 0 },
      speed: 10,
      reach: 1,
      isOccupied: occupied,
    });
    expect(occupied(out.destination)).toBe(false);
    expect(out.inReach).toBe(true); // some other cell within reach of (5,0)
  });
});
