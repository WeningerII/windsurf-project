import { describe, it, expect } from 'vitest';

import {
  coverBetween,
  coverSaveBonus,
  hasLineOfEffect,
  segmentCells,
  spreadCells,
  type BlockPredicate,
} from '../../rules';
import type { SceneCoordinate } from '../../types/core/common';

/**
 * Line of effect + cover: a wall stops a blast, a creature behind a corner gets a
 * save bonus, and a spread bends around walls a sphere cannot pass through.
 */

/** Build a block predicate from an explicit set of wall cells. */
function walls(...cells: SceneCoordinate[]): BlockPredicate {
  const set = new Set(cells.map((c) => `${c.x},${c.y}`));
  return (cell) => set.has(`${cell.x},${cell.y}`);
}

const NO_WALLS: BlockPredicate = () => false;

describe('segmentCells (Amanatides–Woo traversal)', () => {
  it('walks an axis-aligned segment cell by cell', () => {
    expect(segmentCells({ x: 0, y: 0 }, { x: 3, y: 0 })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ]);
  });
});

describe('coverBetween / hasLineOfEffect', () => {
  it('clear line → no cover', () => {
    expect(coverBetween({ x: 0, y: 0 }, { x: 4, y: 0 }, NO_WALLS)).toBe('none');
    expect(hasLineOfEffect({ x: 0, y: 0 }, { x: 4, y: 0 }, NO_WALLS)).toBe(true);
  });

  it('a wall directly between collinear origin and target → total cover (no line of effect)', () => {
    const wall = walls({ x: 2, y: 0 });
    expect(coverBetween({ x: 0, y: 0 }, { x: 4, y: 0 }, wall)).toBe('total');
    expect(hasLineOfEffect({ x: 0, y: 0 }, { x: 4, y: 0 }, wall)).toBe(false);
  });

  it('a wall casts a cover gradient: total directly behind, partial at the edge, none in the clear', () => {
    // Vertical wall x=2 for y=0..2; sweep targets at x=4 down a column.
    const wall = walls({ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 });
    const origin = { x: 0, y: 0 };
    const levels = new Set(
      Array.from({ length: 9 }, (_, i) => coverBetween(origin, { x: 4, y: i - 3 }, wall))
    );
    expect(levels.has('total')).toBe(true); // directly behind the wall
    expect(levels.has('none')).toBe(true); // well clear of it
    expect([...levels].some((l) => l === 'half' || l === 'three-quarters')).toBe(true);
  });

  it('a wall a creature stands on does not shield it (own cell ignored)', () => {
    const wall = walls({ x: 4, y: 0 });
    expect(coverBetween({ x: 0, y: 0 }, { x: 4, y: 0 }, wall)).toBe('none');
  });
});

describe('coverSaveBonus by system', () => {
  it('5e: +2 half, +5 three-quarters', () => {
    expect(coverSaveBonus('half', 'dnd-5e-2024')).toBe(2);
    expect(coverSaveBonus('three-quarters', 'dnd-5e-2014')).toBe(5);
  });
  it('Pathfinder 2e: +2 standard, +4 greater', () => {
    expect(coverSaveBonus('half', 'pf2e')).toBe(2);
    expect(coverSaveBonus('three-quarters', 'pf2e')).toBe(4);
  });
  it('d20-legacy: +4 Reflex', () => {
    expect(coverSaveBonus('half', 'dnd-3.5e')).toBe(4);
    expect(coverSaveBonus('half', 'pf1e')).toBe(4);
  });
  it('none/total contribute nothing', () => {
    expect(coverSaveBonus('none', 'dnd-5e-2024')).toBe(0);
    expect(coverSaveBonus('total', 'dnd-5e-2024')).toBe(0);
  });
});

describe('spreadCells (fireball bends around corners; a sphere does not)', () => {
  // A wall column at x=2 spanning y=-1..1 blocks the straight path east at y=0.
  const wall = walls({ x: 2, y: -1 }, { x: 2, y: 0 }, { x: 2, y: 1 });

  it('a sphere has no line of effect to a cell directly behind the wall', () => {
    expect(hasLineOfEffect({ x: 0, y: 0 }, { x: 4, y: 0 }, wall)).toBe(false);
  });

  it('a spread of sufficient radius reaches that cell by going around the wall', () => {
    // Path must detour around the wall's end (down to y=2, across, back up).
    const reached = spreadCells({ x: 0, y: 0 }, 10, wall);
    expect(reached.has('4,0')).toBe(true);
    expect(reached.has('2,0')).toBe(false); // never enters the wall itself
  });

  it('a spread of small radius cannot reach around the wall', () => {
    // The shortest detour around the 3-cell wall costs 4 (diagonal steps); a
    // radius-3 spread falls short.
    const reached = spreadCells({ x: 0, y: 0 }, 3, wall);
    expect(reached.has('4,0')).toBe(false);
  });
});
