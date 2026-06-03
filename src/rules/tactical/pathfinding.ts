/**
 * Grid movement — close distance toward a target, around walls and bodies.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), tactical-executor phase.
 *
 * `move-to-engage` was a stub: a combatant out of reach was flagged but never
 * actually moved. This is the movement it needs — a budget-limited Dijkstra over
 * the grid neighborhood (honoring the system's diagonal rule) that avoids walls
 * and occupied cells and returns the reachable cell that gets within reach of the
 * target, or failing that the reachable cell that gets closest. A grounded mover
 * searches the 8-neighborhood on its plane; a flyer (`canFly`) searches the 3D
 * 26-neighborhood, spending fly speed to gain or lose altitude. Pure and
 * deterministic.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance, type DiagonalRule } from '../resolver/areaTargeting';
import type { BlockPredicate } from '../resolver/lineOfEffect';

const key = (c: SceneCoordinate): string => `${c.x},${c.y},${c.z ?? 0}`;
const NO_BLOCK: BlockPredicate = () => false;
const sameCell = (a: SceneCoordinate, b: SceneCoordinate): boolean =>
  a.x === b.x && a.y === b.y && (a.z ?? 0) === (b.z ?? 0);

export interface MoveResult {
  /** Where the mover ends up (its own cell when it can't or needn't move). */
  destination: SceneCoordinate;
  /** Movement spent reaching the destination (in cells, under the diagonal rule). */
  cost: number;
  /** True when the destination is within `reach` of the target. */
  inReach: boolean;
}

/**
 * Move a creature toward a target. Already within reach → it stays put. Otherwise
 * it spends up to `speed` movement to reach the cell that minimizes its distance
 * to the target (preferring to actually get within `reach`), never ending on a
 * wall or another creature's cell.
 */
export function moveToward(params: {
  from: SceneCoordinate;
  target: SceneCoordinate;
  /** Movement budget, in cells. */
  speed: number;
  /** In reach when the mover's cell is within this many cells of the target. */
  reach: number;
  /** Walls / impassable cells. */
  isBlocked?: BlockPredicate;
  /** Cells occupied by other creatures (cannot be ended on). */
  isOccupied?: BlockPredicate;
  /** Cost multiplier to ENTER a cell (≥1; e.g. 2 for difficult terrain). Default 1. */
  enterCost?: (cell: SceneCoordinate) => number;
  rule?: DiagonalRule;
  /**
   * When true the mover can change elevation (fly): the search explores the 3D
   * 26-neighborhood and may end airborne. When false (default) it stays on its
   * starting plane — the exact prior 2D behavior.
   */
  canFly?: boolean;
}): MoveResult {
  const { from, target, speed, reach } = params;
  const rule = params.rule ?? 'chebyshev';
  const isBlocked = params.isBlocked ?? NO_BLOCK;
  const baseOccupied = params.isOccupied ?? NO_BLOCK;
  const enterCost = params.enterCost ?? (() => 1);
  const canFly = params.canFly ?? false;
  // The target's own cell is impassable — a mover ends adjacent, never on it. In
  // flight this is the exact 3D cell (ending directly above/below is allowed); on
  // the ground it is the whole column (z is 0 for both), identical to before.
  const isOccupied: BlockPredicate = (c) =>
    baseOccupied(c) || (canFly ? sameCell(c, target) : c.x === target.x && c.y === target.y);

  if (gridDistance(from, target, rule) <= reach) {
    return { destination: { ...from }, cost: 0, inReach: true };
  }

  // Dijkstra outward from `from`, bounded by `speed`. Track the best end cell by
  // (distance-to-target, then movement cost) for a deterministic choice. Flyers
  // also step in z; grounded movers keep dz = 0, the exact prior search.
  const dzs = canFly ? [-1, 0, 1] : [0];
  const best = new Map<string, number>([[key(from), 0]]);
  const queue: Array<{ cell: SceneCoordinate; cost: number }> = [{ cell: { ...from }, cost: 0 }];
  let chosen = { destination: { ...from } as SceneCoordinate, cost: 0, inReach: false };
  let chosenDist = gridDistance(from, target, rule);

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { cell, cost } = queue.shift()!;
    if (cost > (best.get(key(cell)) ?? Infinity)) continue;

    // Consider this cell as a destination (except the origin, already the default).
    if (!sameCell(cell, from)) {
      const dist = gridDistance(cell, target, rule);
      const better = dist < chosenDist || (dist === chosenDist && cost < chosen.cost);
      if (better) {
        chosen = { destination: { ...cell }, cost, inReach: dist <= reach };
        chosenDist = dist;
      }
    }

    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        for (const dz of dzs) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          const nz = (cell.z ?? 0) + dz;
          if (nz < 0) continue; // cannot descend below the ground plane
          const next = { x: cell.x + dx, y: cell.y + dy, z: nz };
          if (isBlocked(next) || isOccupied(next)) continue;
          // Difficult terrain is a ground concept; flying over it (ending airborne)
          // ignores the multiplier.
          const enter = nz > 0 ? 1 : enterCost(next);
          const nextCost = cost + gridDistance(cell, next, rule) * enter;
          if (nextCost > speed) continue;
          if (nextCost < (best.get(key(next)) ?? Infinity)) {
            best.set(key(next), nextCost);
            queue.push({ cell: next, cost: nextCost });
          }
        }
      }
    }
  }

  // Normalize: drop a zero elevation so grounded results stay exactly `{x, y}`.
  const clean = (c: SceneCoordinate): SceneCoordinate =>
    (c.z ?? 0) === 0 ? { x: c.x, y: c.y } : { x: c.x, y: c.y, z: c.z };
  return { destination: clean(chosen.destination), cost: chosen.cost, inReach: chosen.inReach };
}
