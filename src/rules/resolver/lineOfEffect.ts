/**
 * Line of effect and cover for area effects.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md`, "Participant-aware resolution".
 *
 * An area effect only touches a cell it can actually reach: a wall (total cover)
 * stops a fireball, and a creature peeking from behind a corner gets a save bonus
 * from partial cover. These are pure geometry over a `BlockPredicate` (which
 * cells are walls), independent of the scene — the scene layer supplies the
 * predicate. Two distinct rules are modeled:
 *   - straight line of effect (sphere/cone/line/cube): a clear segment from the
 *     area's point of origin to the target, with cover graded by how much of the
 *     target the walls shadow;
 *   - spread (3.5e/PF1 fireball): fills outward AROUND corners via flood fill, so
 *     it bends down corridors but still cannot pass through a wall.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance, type DiagonalRule } from './areaTargeting';

/** Does this cell fully block line of effect (a wall / total cover)? */
export type BlockPredicate = (cell: SceneCoordinate) => boolean;

/** RAW cover levels (5e granularity; other systems map onto these). */
export type CoverLevel = 'none' | 'half' | 'three-quarters' | 'total';

const key = (c: SceneCoordinate): string => `${c.x},${c.y}`;

/**
 * Cells a continuous segment passes through (Amanatides–Woo voxel traversal).
 * Exact: returns every grid cell whose unit square the segment enters, in order.
 */
export function segmentCells(p: SceneCoordinate, q: SceneCoordinate): SceneCoordinate[] {
  const cells: SceneCoordinate[] = [];
  let x = Math.floor(p.x);
  let y = Math.floor(p.y);
  const endX = Math.floor(q.x);
  const endY = Math.floor(q.y);
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const stepX = dx > 0 ? 1 : -1;
  const stepY = dy > 0 ? 1 : -1;
  const tDeltaX = dx !== 0 ? Math.abs(1 / dx) : Infinity;
  const tDeltaY = dy !== 0 ? Math.abs(1 / dy) : Infinity;
  let tMaxX =
    dx !== 0 ? (dx > 0 ? Math.floor(p.x) + 1 - p.x : p.x - Math.floor(p.x)) * tDeltaX : Infinity;
  let tMaxY =
    dy !== 0 ? (dy > 0 ? Math.floor(p.y) + 1 - p.y : p.y - Math.floor(p.y)) * tDeltaY : Infinity;

  cells.push({ x, y });
  let guard = 0;
  while ((x !== endX || y !== endY) && guard < 10000) {
    if (tMaxX < tMaxY) {
      tMaxX += tDeltaX;
      x += stepX;
    } else {
      tMaxY += tDeltaY;
      y += stepY;
    }
    cells.push({ x, y });
    guard += 1;
  }
  return cells;
}

/** True when the segment from p to q crosses no blocking cell (endpoints' own cells ignored). */
function segmentBlocked(
  p: SceneCoordinate,
  q: SceneCoordinate,
  isBlocked: BlockPredicate,
  ignore: ReadonlySet<string>
): boolean {
  for (const cell of segmentCells(p, q)) {
    if (ignore.has(key(cell))) continue;
    if (isBlocked(cell)) return true;
  }
  return false;
}

/**
 * Cover a target cell has from an area's origin cell, by casting rays from the
 * origin's center to the four (inset) corners of the target and counting how many
 * are blocked: 0 → none, 1–2 → half, 3 → three-quarters, 4 → total (no line of
 * effect — the target is unaffected). The origin's and target's own cells never
 * block (a wall a creature stands on doesn't shield it from a blast in its space).
 */
export function coverBetween(
  origin: SceneCoordinate,
  target: SceneCoordinate,
  isBlocked: BlockPredicate
): CoverLevel {
  if (origin.x === target.x && origin.y === target.y) return 'none';
  const from = { x: origin.x + 0.5, y: origin.y + 0.5 };
  const corners: SceneCoordinate[] = [
    { x: target.x + 0.05, y: target.y + 0.05 },
    { x: target.x + 0.95, y: target.y + 0.05 },
    { x: target.x + 0.05, y: target.y + 0.95 },
    { x: target.x + 0.95, y: target.y + 0.95 },
  ];
  const ignore = new Set([key(origin), key(target)]);
  let blocked = 0;
  for (const corner of corners) {
    if (segmentBlocked(from, corner, isBlocked, ignore)) blocked += 1;
  }
  if (blocked === 0) return 'none';
  if (blocked >= 4) return 'total';
  if (blocked === 3) return 'three-quarters';
  return 'half';
}

/** Convenience: is there ANY line of effect (cover less than total)? */
export function hasLineOfEffect(
  origin: SceneCoordinate,
  target: SceneCoordinate,
  isBlocked: BlockPredicate
): boolean {
  return coverBetween(origin, target, isBlocked) !== 'total';
}

/**
 * The save bonus partial cover grants against an area effect, by system (RAW):
 *   - 5e: +2 half, +5 three-quarters (Dexterity saves vs point-origin effects);
 *   - 3.5e / PF1e: +4 Reflex (improved-cover degrees not modeled);
 *   - PF2e: +2 standard, +4 greater (circumstance bonus to the save).
 * 'none'/'total' contribute nothing ('total' means the target is excluded).
 */
export function coverSaveBonus(level: CoverLevel, systemId: string): number {
  if (level === 'none' || level === 'total') return 0;
  switch (systemId) {
    case 'dnd-5e-2014':
    case 'dnd-5e-2024':
      return level === 'three-quarters' ? 5 : 2;
    case 'dnd-3.5e':
    case 'pf1e':
      return 4;
    case 'pf2e':
      return level === 'three-quarters' ? 4 : 2;
    default:
      return 2;
  }
}

/**
 * Cells a SPREAD reaches from its origin: flood fill outward through non-blocking
 * cells, entering a cell only if the path to it (around corners) is within
 * `radius`. Unlike a sphere, a spread bends around a wall; like a sphere, it
 * cannot enter one. Diagonal step cost follows the system's diagonal rule.
 */
export function spreadCells(
  origin: SceneCoordinate,
  radius: number,
  isBlocked: BlockPredicate,
  rule: DiagonalRule = 'chebyshev'
): Set<string> {
  const reached = new Set<string>();
  if (isBlocked(origin)) return reached;
  const best = new Map<string, number>([[key(origin), 0]]);
  // Dijkstra over the 8-neighborhood; edge cost = the rule's single-step distance.
  const queue: Array<{ cell: SceneCoordinate; cost: number }> = [{ cell: origin, cost: 0 }];
  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { cell, cost } = queue.shift()!;
    if (cost > (best.get(key(cell)) ?? Infinity)) continue;
    reached.add(key(cell));
    for (let dxi = -1; dxi <= 1; dxi += 1) {
      for (let dyi = -1; dyi <= 1; dyi += 1) {
        if (dxi === 0 && dyi === 0) continue;
        const next = { x: cell.x + dxi, y: cell.y + dyi };
        if (isBlocked(next)) continue;
        const step = gridDistance(cell, next, rule);
        const nextCost = cost + step;
        if (nextCost > radius) continue;
        if (nextCost < (best.get(key(next)) ?? Infinity)) {
          best.set(key(next), nextCost);
          queue.push({ cell: next, cost: nextCost });
        }
      }
    }
  }
  return reached;
}
