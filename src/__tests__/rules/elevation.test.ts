import { describe, it, expect } from 'vitest';

import { diagonalRuleForSystem, gridDistance, isFlanking } from '../../rules';
import type { SceneCoordinate } from '../../types/core/scene';

/**
 * Tier-1 verticality: elevation (`z`, in cells) is a third axis on the grid.
 * `gridDistance` is the single chokepoint — making it 3D makes reach, flanking,
 * opportunity attacks, and ranged distance flight-aware at once, while every
 * existing flat-grid call (no z) keeps its exact 2D result.
 */

const at = (x: number, y: number, z?: number): SceneCoordinate => ({ x, y, z });

describe('3D grid distance', () => {
  it('is identical to the flat-grid result when no elevation is set', () => {
    // Regression guard: omitting z, or setting it to 0, must not move the number.
    for (const rule of ['chebyshev', 'alternating', 'euclidean'] as const) {
      for (const [a, b] of [
        [at(0, 0), at(3, 2)],
        [at(1, 5), at(4, 1)],
        [at(2, 2), at(2, 2)],
      ] as const) {
        const flat = gridDistance(a, b, rule);
        expect(gridDistance({ ...a, z: 0 }, { ...b, z: 0 }, rule)).toBe(flat);
      }
    }
    // The known 2D values still hold.
    expect(gridDistance(at(0, 0), at(3, 2), 'chebyshev')).toBe(3);
    expect(gridDistance(at(0, 0), at(3, 2), 'alternating')).toBe(4);
  });

  it('5e counts a vertical step like any other (Chebyshev in 3D)', () => {
    const rule = diagonalRuleForSystem('dnd-5e-2014');
    expect(rule).toBe('chebyshev');
    // 15 ft straight up = 3 cells.
    expect(gridDistance(at(0, 0, 0), at(0, 0, 3), rule)).toBe(3);
    // Moving out and up together costs the longest single axis.
    expect(gridDistance(at(0, 0, 0), at(3, 0, 2), rule)).toBe(3);
  });

  it('the d20/Pathfinder line alternates vertical diagonals (1-2-1 in 3D)', () => {
    const rule = diagonalRuleForSystem('pf2e');
    expect(rule).toBe('alternating');
    // One out + one up is a single diagonal: 5 ft.
    expect(gridDistance(at(0, 0, 0), at(1, 0, 1), rule)).toBe(1);
    // Two stacked diagonals: 5 + 10 = 15 ft = 3 cells.
    expect(gridDistance(at(0, 0, 0), at(2, 0, 2), rule)).toBe(3);
    // A full three-axis diagonal still alternates like any diagonal.
    expect(gridDistance(at(0, 0, 0), at(1, 1, 1), rule)).toBe(1);
    expect(gridDistance(at(0, 0, 0), at(2, 2, 2), rule)).toBe(3);
  });

  it('a pure climb costs one cell per cell of height under every rule', () => {
    expect(gridDistance(at(0, 0, 0), at(0, 0, 4), 'chebyshev')).toBe(4);
    expect(gridDistance(at(0, 0, 0), at(0, 0, 4), 'alternating')).toBe(4);
    expect(gridDistance(at(0, 0, 0), at(0, 0, 4), 'euclidean')).toBe(4);
  });
});

describe('reach in three dimensions', () => {
  // Reach is `gridDistance(attacker, target) <= reach` — the same predicate the
  // round driver, pathfinding, and opportunity attacks all share.
  const rule = diagonalRuleForSystem('dnd-5e-2014');
  const reach = 1; // 5 ft melee

  it('a grounded melee attacker cannot reach a flyer overhead', () => {
    const attacker = at(5, 5, 0);
    expect(gridDistance(attacker, at(5, 5, 3), rule) <= reach).toBe(false); // 15 ft up
    expect(gridDistance(attacker, at(6, 5, 0), rule) <= reach).toBe(true); // adjacent ground
  });

  it('can reach a foe hovering within its reach', () => {
    expect(gridDistance(at(5, 5, 0), at(5, 5, 1), rule) <= reach).toBe(true); // 5 ft up
  });

  it('a ranged attack pays for the vertical distance', () => {
    // Straight-line ground distance is 4; lifting the target 3 up makes it 5.
    expect(gridDistance(at(0, 0, 0), at(4, 0, 0), rule)).toBe(4);
    expect(gridDistance(at(0, 0, 0), at(4, 0, 3), rule)).toBe(4); // chebyshev: max(4,0,3)
    expect(gridDistance(at(0, 0, 0), at(4, 0, 5), rule)).toBe(5);
  });
});

describe('flanking respects elevation', () => {
  const rule = diagonalRuleForSystem('pf2e');

  it('still flanks across the target on the ground', () => {
    expect(
      isFlanking({
        attacker: at(4, 5, 0),
        target: at(5, 5, 0),
        reach: 1,
        allies: [at(6, 5, 0)],
        rule,
      })
    ).toBe(true);
  });

  it('a flyer hovering above the target does not flank, even within reach', () => {
    expect(
      isFlanking({
        attacker: at(5, 5, 1), // directly above, distance 1 ≤ reach
        target: at(5, 5, 0),
        reach: 5,
        allies: [at(5, 5, -1)],
        rule,
      })
    ).toBe(false);
  });

  it('an opposite ally at a different altitude does not complete the flank', () => {
    const base = { attacker: at(4, 5, 0), target: at(5, 5, 0), reach: 5, rule } as const;
    expect(isFlanking({ ...base, allies: [at(6, 5, 2)] })).toBe(false); // ally aloft
    expect(isFlanking({ ...base, allies: [at(6, 5, 0)] })).toBe(true); // ally co-planar
  });
});
