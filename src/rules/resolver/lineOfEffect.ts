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

/**
 * The top elevation of a wall at a cell, in cells: 0 = no wall, a finite value =
 * the wall's height (its top), Infinity = a full-height/opaque wall. This is the
 * elevation-aware blocking model — a sight line clears a finite wall when it
 * passes above its top.
 */
export type WallTopAt = (cell: SceneCoordinate) => number;

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

/**
 * True when the 3D segment p→q is blocked by a wall. Walking the 2D cells the
 * segment crosses, the sight line's interpolated elevation is evaluated over each
 * cell; the wall there blocks if the line dips to or below its top anywhere in
 * the cell (the lower of the entry/exit heights, since the line is linear in z).
 * Endpoints' own cells (in `ignore`) never block. Full-height walls (Infinity)
 * block at every elevation, reducing this to the flat 2D footprint test.
 */
function segmentBlockedElevated(
  p: SceneCoordinate,
  q: SceneCoordinate,
  wallTopAt: WallTopAt,
  ignore: ReadonlySet<string>
): boolean {
  const pz = p.z ?? 0;
  const dz = (q.z ?? 0) - pz;
  const zAt = (t: number): number => pz + t * dz;

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

  let tEnter = 0;
  let guard = 0;
  for (;;) {
    const tExit = Math.min(tMaxX, tMaxY, 1);
    const cell = { x, y };
    if (!ignore.has(key(cell))) {
      const top = wallTopAt(cell);
      // The wall blocks when the line's lowest height over this cell is at or
      // below the wall's top — i.e. the line grazes or passes through it.
      if (top > 0 && Math.min(zAt(tEnter), zAt(tExit)) <= top) return true;
    }
    if (x === endX && y === endY) break;
    tEnter = tExit;
    if (tMaxX < tMaxY) {
      tMaxX += tDeltaX;
      x += stepX;
    } else {
      tMaxY += tDeltaY;
      y += stepY;
    }
    if ((guard += 1) > 10000) break;
  }
  return false;
}

/**
 * Cover a target cell has from an origin cell, accounting for wall heights and
 * the elevations of both ends. Rays are cast from the origin's center to the four
 * inset corners of the target; each is blocked when the sight line clips a wall
 * along the way. 0 blocked → none, 1–2 → half, 3 → three-quarters, 4 → total (no
 * line of effect). A flyer above a low wall clears it; a creature on the ground
 * behind it does not. The origin's and target's own cells never block.
 */
export function coverBetweenElevated(
  origin: SceneCoordinate,
  target: SceneCoordinate,
  wallTopAt: WallTopAt
): CoverLevel {
  if (origin.x === target.x && origin.y === target.y) return 'none';
  const from = { x: origin.x + 0.5, y: origin.y + 0.5, z: origin.z ?? 0 };
  const tz = target.z ?? 0;
  const corners: SceneCoordinate[] = [
    { x: target.x + 0.05, y: target.y + 0.05, z: tz },
    { x: target.x + 0.95, y: target.y + 0.05, z: tz },
    { x: target.x + 0.05, y: target.y + 0.95, z: tz },
    { x: target.x + 0.95, y: target.y + 0.95, z: tz },
  ];
  const ignore = new Set([key(origin), key(target)]);
  let blocked = 0;
  for (const corner of corners) {
    if (segmentBlockedElevated(from, corner, wallTopAt, ignore)) blocked += 1;
  }
  if (blocked === 0) return 'none';
  if (blocked >= 4) return 'total';
  if (blocked === 3) return 'three-quarters';
  return 'half';
}

/**
 * Cover a target cell has from an origin cell over a flat 2D wall footprint —
 * the elevation-agnostic form. Delegates to {@link coverBetweenElevated} treating
 * every blocking cell as a full-height wall, so the result is identical to the
 * pure 2D model for ground play and conservative (full-height) for everything else.
 */
export function coverBetween(
  origin: SceneCoordinate,
  target: SceneCoordinate,
  isBlocked: BlockPredicate
): CoverLevel {
  return coverBetweenElevated(origin, target, (cell) => (isBlocked(cell) ? Infinity : 0));
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
 * AC bonus a target gets from cover against an attack roll, per system: 5e half
 * +2 / three-quarters +5; 3.5e/PF1e +4; PF2e standard +2 / greater +4. Total
 * cover returns 0 here — callers must treat it as no line of sight (the attack
 * cannot be made) rather than a mere bonus.
 */
export function coverAcBonus(level: CoverLevel, systemId: string): number {
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
