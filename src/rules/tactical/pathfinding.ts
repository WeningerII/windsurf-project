/**
 * Grid movement — close distance toward a target, around walls and bodies.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), tactical-executor phase.
 *
 * `move-to-engage` was a stub: a combatant out of reach was flagged but never
 * actually moved. This is the movement it needs — a budget-limited Dijkstra over
 * the 8-neighborhood (honoring the system's diagonal rule) that avoids walls and
 * occupied cells and returns the reachable cell that gets within reach of the
 * target, or failing that the reachable cell that gets closest. Pure and
 * deterministic.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance, type DiagonalRule } from '../resolver/areaTargeting';
import type { BlockPredicate } from '../resolver/lineOfEffect';

const key = (c: SceneCoordinate): string => `${c.x},${c.y}`;
const NO_BLOCK: BlockPredicate = () => false;

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
  rule?: DiagonalRule;
}): MoveResult {
  const { from, target, speed, reach } = params;
  const rule = params.rule ?? 'chebyshev';
  const isBlocked = params.isBlocked ?? NO_BLOCK;
  const baseOccupied = params.isOccupied ?? NO_BLOCK;
  // The target's own cell is impassable — a melee mover ends adjacent, never on it.
  const isOccupied: BlockPredicate = (c) =>
    baseOccupied(c) || (c.x === target.x && c.y === target.y);

  if (gridDistance(from, target, rule) <= reach) {
    return { destination: from, cost: 0, inReach: true };
  }

  // Dijkstra outward from `from`, bounded by `speed`. Track the best end cell by
  // (distance-to-target, then movement cost) for a deterministic choice.
  const best = new Map<string, number>([[key(from), 0]]);
  const queue: Array<{ cell: SceneCoordinate; cost: number }> = [{ cell: from, cost: 0 }];
  let chosen: MoveResult = { destination: from, cost: 0, inReach: false };
  let chosenDist = gridDistance(from, target, rule);

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { cell, cost } = queue.shift()!;
    if (cost > (best.get(key(cell)) ?? Infinity)) continue;

    // Consider this cell as a destination (except the origin, already the default).
    if (!(cell.x === from.x && cell.y === from.y)) {
      const dist = gridDistance(cell, target, rule);
      const better = dist < chosenDist || (dist === chosenDist && cost < chosen.cost);
      if (better) {
        chosen = { destination: cell, cost, inReach: dist <= reach };
        chosenDist = dist;
      }
    }

    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue;
        const next = { x: cell.x + dx, y: cell.y + dy };
        if (isBlocked(next) || isOccupied(next)) continue;
        const nextCost = cost + gridDistance(cell, next, rule);
        if (nextCost > speed) continue;
        if (nextCost < (best.get(key(next)) ?? Infinity)) {
          best.set(key(next), nextCost);
          queue.push({ cell: next, cost: nextCost });
        }
      }
    }
  }

  return chosen;
}
