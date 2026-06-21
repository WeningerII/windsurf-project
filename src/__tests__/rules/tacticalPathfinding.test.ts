import { describe, it, expect } from 'vitest';

import { cellKey } from '../../scene/grid';
import {
  computeMovementField,
  planApproach,
  OPEN_MOVEMENT,
  type MovementContext,
} from '../../rules/tactical/pathfinding';
import { gridDistance } from '../../rules';

/**
 * PHASE 11 (RFC 003): obstacle-aware tactical pathfinding. Deterministic
 * breadth-first movement on the square (Chebyshev) grid; every destination it
 * returns is a legal scene placement, so the move the executor proposes is
 * always accepted by the scene runtime (no phantom damage, no token stacking).
 */

const blocked = (cells: Array<[number, number]>): MovementContext => ({
  bounds: { width: 12, height: 12 },
  blocked: new Set(cells.map(([x, y]) => cellKey({ x, y }))),
});

describe('computeMovementField — reachable cells', () => {
  it('includes the start at zero steps and the king-move ring at one step', () => {
    const field = computeMovementField({
      from: { x: 5, y: 5 },
      size: 1,
      maxSteps: 1,
      context: OPEN_MOVEMENT,
    });
    expect(field.get(cellKey({ x: 5, y: 5 }))?.steps).toBe(0);
    // All 8 neighbours are one step away (diagonals cost 1 — Chebyshev).
    expect(field.get(cellKey({ x: 6, y: 6 }))?.steps).toBe(1);
    expect(field.get(cellKey({ x: 4, y: 5 }))?.steps).toBe(1);
    expect(field.size).toBe(9);
  });

  it('does not leave the grid bounds', () => {
    const field = computeMovementField({
      from: { x: 0, y: 0 },
      size: 1,
      maxSteps: 3,
      context: { bounds: { width: 2, height: 2 }, blocked: new Set() },
    });
    // A 2x2 grid: only (0,0),(1,0),(0,1),(1,1) exist.
    expect(field.size).toBe(4);
    expect(field.has(cellKey({ x: -1, y: 0 }))).toBe(false);
    expect(field.has(cellKey({ x: 2, y: 0 }))).toBe(false);
  });

  it('routes around a blocker rather than through it (extra step cost)', () => {
    // Wall cell directly east; reaching (2,0) must detour, costing 2 not 1+1.
    const context = blocked([[1, 0]]);
    const field = computeMovementField({ from: { x: 0, y: 0 }, size: 1, maxSteps: 4, context });
    expect(field.has(cellKey({ x: 1, y: 0 }))).toBe(false); // blocked
    // (2,0) is reachable by going (0,0)->(1,1)->(2,0): 2 diagonal steps.
    expect(field.get(cellKey({ x: 2, y: 0 }))?.steps).toBe(2);
  });

  it('treats a fully-walled start as reachable only at itself', () => {
    const context = blocked([
      [4, 4],
      [6, 4],
      [4, 6],
      [6, 6],
      [5, 4],
      [5, 6],
      [4, 5],
      [6, 5],
    ]);
    const field = computeMovementField({ from: { x: 5, y: 5 }, size: 1, maxSteps: 6, context });
    expect(field.size).toBe(1);
    expect(field.get(cellKey({ x: 5, y: 5 }))?.steps).toBe(0);
  });

  it('is footprint-aware: a 2x2 mover cannot squeeze through a one-cell gap', () => {
    // Pillars at (2,0) and (2,2) leave a 1-wide gap at (2,1). A size-1 mover
    // slips through; a size-2 mover (footprint covers two rows) cannot.
    const context = blocked([
      [2, 0],
      [2, 2],
    ]);
    const small = computeMovementField({ from: { x: 0, y: 0 }, size: 1, maxSteps: 6, context });
    expect(small.has(cellKey({ x: 3, y: 0 }))).toBe(true);

    const large = computeMovementField({ from: { x: 0, y: 0 }, size: 2, maxSteps: 6, context });
    // A 2x2 anchored anywhere spanning column 2 hits a pillar; it is boxed to the
    // left columns and never reaches the far side.
    expect(large.has(cellKey({ x: 3, y: 0 }))).toBe(false);
  });

  it('is deterministic for identical inputs', () => {
    const run = () => [
      ...computeMovementField({
        from: { x: 2, y: 2 },
        size: 1,
        maxSteps: 3,
        context: blocked([[3, 2]]),
      }).entries(),
    ];
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });
});

describe('planApproach — engage / close / hold', () => {
  it('open grid reproduces a straight-line approach to an attack position', () => {
    // Melee (reach 1), speed 6, target at (5,0): stop adjacent at (4,0).
    const plan = planApproach({
      from: { x: 0, y: 0 },
      size: 1,
      speed: 6,
      reach: 1,
      goal: { x: 5, y: 0 },
      context: OPEN_MOVEMENT,
    });
    expect(plan.to).toEqual({ x: 4, y: 0 });
    expect(plan.inReachOfGoal).toBe(true);
    expect(plan.moved).toBe(true);
  });

  it('open grid closes the gap when the target stays out of reach', () => {
    const plan = planApproach({
      from: { x: 0, y: 0 },
      size: 1,
      speed: 3,
      reach: 1,
      goal: { x: 10, y: 0 },
      context: OPEN_MOVEMENT,
    });
    expect(plan.to).toEqual({ x: 3, y: 0 });
    expect(plan.inReachOfGoal).toBe(false);
    expect(plan.moved).toBe(true);
  });

  it('detours around a wall to reach an attack position (never lands on the blocker)', () => {
    // Target at (4,0); a wall on the straight line (x=2, y=0 and y=1) forces a
    // detour. The chosen cell must be adjacent to the target and never blocked.
    const context = blocked([
      [2, 0],
      [2, 1],
    ]);
    const plan = planApproach({
      from: { x: 0, y: 0 },
      size: 1,
      speed: 8,
      reach: 1,
      goal: { x: 4, y: 0 },
      context,
    });
    expect(plan.inReachOfGoal).toBe(true);
    expect(gridDistance(plan.to, { x: 4, y: 0 })).toBeLessThanOrEqual(1);
    expect(context.blocked.has(cellKey(plan.to))).toBe(false);
  });

  it('holds position when boxed in with no legal approach', () => {
    const context = blocked([
      [4, 4],
      [6, 4],
      [4, 6],
      [6, 6],
      [5, 4],
      [5, 6],
      [4, 5],
      [6, 5],
    ]);
    const plan = planApproach({
      from: { x: 5, y: 5 },
      size: 1,
      speed: 6,
      reach: 1,
      goal: { x: 9, y: 5 },
      context,
    });
    expect(plan.moved).toBe(false);
    expect(plan.to).toEqual({ x: 5, y: 5 });
  });

  it('never proposes a destination that overlaps another token', () => {
    // Target at (3,0) with allies packed around the near approach; the plan must
    // pick a free adjacent cell, not stack onto an occupied one.
    const context = blocked([
      [3, 0], // the target itself occupies its cell
      [2, 0],
      [2, 1],
      [3, 1],
    ]);
    const plan = planApproach({
      from: { x: 0, y: 0 },
      size: 1,
      speed: 8,
      reach: 1,
      goal: { x: 3, y: 0 },
      context,
    });
    expect(context.blocked.has(cellKey(plan.to))).toBe(false);
    expect(plan.inReachOfGoal).toBe(true);
  });
});
