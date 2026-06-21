/**
 * Tactical grid pathfinding — deterministic, obstacle-aware movement planning.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), tactical-executor phase
 * (Phase 11: "utility scoring, influence maps, pathfinding, action validators").
 *
 * `targetScoring` decides WHO a combatant attacks and `roundDriver` sequences the
 * turns; this module decides WHERE a combatant moves to engage — routing around
 * other creatures and the grid edge instead of walking through them. It is the
 * "pathfinding / action validators" half of the phase: every destination it
 * returns is a legal scene placement (footprint on-grid, no cell shared with
 * another token), so the move the executor proposes is always accepted by the
 * scene runtime. That closes the soundness gap where a straight-line move the
 * scene would reject still let its attack land (phantom damage), and it stops
 * creatures from stacking on one cell.
 *
 * Metric: 8-connected king moves, each step costing one cell — the same
 * Chebyshev metric `gridDistance` uses for reach and `speedCells` counts for
 * movement, so planning and resolution never disagree. Pure and deterministic:
 * breadth-first search in a fixed neighbour order with deterministic tie-breaks;
 * no RNG.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { cellKey, footprintCells } from '../../scene/grid';
import { gridDistance } from '../resolver/areaTargeting';

/** Grid extent in cells. Omit on a {@link MovementContext} for an open field. */
export interface GridBounds {
  width: number;
  height: number;
}

/** Movement constraints: the grid edge and the cells other tokens occupy. */
export interface MovementContext {
  /** Grid bounds; omit to treat the grid as unbounded (open field). */
  bounds?: GridBounds;
  /**
   * Impassable cells — every other token's footprint, keyed by {@link cellKey}.
   * The mover's OWN footprint must be excluded by the caller (a combatant never
   * blocks itself), and its current cell is always reachable at zero steps.
   */
  blocked: ReadonlySet<string>;
}

/** A cell the mover can stand on, with the fewest steps to get there. */
export interface ReachableCell {
  cell: SceneCoordinate;
  steps: number;
}

/** A planned move toward a goal. `to` equals the start when no move is possible. */
export interface ApproachPlan {
  to: SceneCoordinate;
  /** King-move steps from the start (0 when staying put). */
  steps: number;
  /** True when `to` is within reach of the goal (a legal attack position). */
  inReachOfGoal: boolean;
  /** True when the mover actually relocates (`to` differs from the start). */
  moved: boolean;
  /** Living hostiles within reach of `to` — the engagement value of the cell. */
  threatens: number;
}

/** How many of `points` lie within `reach` king-moves of `cell`. A local,
 * uniform-weight influence reading used to value an engagement position. */
export function countWithinReach(
  cell: SceneCoordinate,
  points: readonly SceneCoordinate[],
  reach: number
): number {
  let count = 0;
  for (const point of points) {
    if (gridDistance(cell, point) <= reach) count += 1;
  }
  return count;
}

const EMPTY_BLOCKED: ReadonlySet<string> = new Set<string>();

/** Open-field context (no bounds, no blockers) — reproduces unobstructed movement. */
export const OPEN_MOVEMENT: MovementContext = { blocked: EMPTY_BLOCKED };

// Fixed neighbour order so BFS expansion (and thus any step-tie outcome) is
// deterministic regardless of host Map/Set iteration order.
const NEIGHBOURS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

/**
 * Whether a `size`-cell token anchored at `anchor` can legally stand here: every
 * footprint cell must be a non-negative grid cell (inside `bounds` when given)
 * and free of any blocker. This is exactly the placement rule the scene runtime
 * enforces, made stricter (no stacking at all), so a cell this accepts is always
 * a cell the scene accepts.
 */
function footprintFree(anchor: SceneCoordinate, size: number, context: MovementContext): boolean {
  for (const cell of footprintCells(anchor, size)) {
    if (cell.x < 0 || cell.y < 0) return false;
    if (context.bounds && (cell.x >= context.bounds.width || cell.y >= context.bounds.height)) {
      return false;
    }
    if (context.blocked.has(cellKey(cell))) return false;
  }
  return true;
}

/**
 * Breadth-first reachability: every free cell a `size`-token at `from` can reach
 * within `maxSteps` king moves, each mapped to its minimum step count. The start
 * is always included at zero steps (the mover stands there now). Pure.
 */
export function computeMovementField(params: {
  from: SceneCoordinate;
  size: number;
  maxSteps: number;
  context: MovementContext;
}): Map<string, ReachableCell> {
  const { from, context } = params;
  const size = Math.max(1, Math.floor(params.size));
  const maxSteps = Math.max(0, Math.floor(params.maxSteps));
  const cells = new Map<string, ReachableCell>();
  cells.set(cellKey(from), { cell: { ...from }, steps: 0 });

  let frontier: SceneCoordinate[] = [from];
  for (let depth = 1; depth <= maxSteps && frontier.length > 0; depth += 1) {
    const next: SceneCoordinate[] = [];
    for (const current of frontier) {
      for (const [dx, dy] of NEIGHBOURS) {
        const candidate = { x: current.x + dx, y: current.y + dy };
        const key = cellKey(candidate);
        if (cells.has(key)) continue;
        if (!footprintFree(candidate, size, context)) continue;
        cells.set(key, { cell: candidate, steps: depth });
        next.push(candidate);
      }
    }
    frontier = next;
  }
  return cells;
}

/**
 * Plan a move toward `goal` for a `size`-token with `speed` cells of movement and
 * `reach` cells of attack range.
 *
 * - If any reachable cell puts the goal in reach, move to the one needing the
 *   FEWEST steps, then — the influence reading — the one threatening the MOST
 *   living hostiles (`engagementTargets`), then geometrically closest to the
 *   goal, then a stable id tie-break. So among equally-fast attack cells the
 *   actor stands where it menaces the most enemies.
 * - Otherwise close the distance: move to the reachable cell nearest the goal in
 *   king-moves (then closest, then fewest steps, then id) — make real progress.
 * - If nothing better than the start is reachable (boxed in), stay put.
 *
 * Reach is measured anchor-to-anchor with {@link gridDistance}, matching
 * `scoreTarget`/`resolveSceneAttack`, so a planned attack position is one those
 * paths also count as in reach. Deterministic.
 */
export function planApproach(params: {
  from: SceneCoordinate;
  size: number;
  speed: number;
  reach: number;
  goal: SceneCoordinate;
  context: MovementContext;
  /**
   * Positions of the other living hostiles the actor would like to threaten. When
   * given, equally-fast attack cells are broken toward the one in reach of more
   * of them (engagement value). Omit to position purely toward the goal.
   */
  engagementTargets?: readonly SceneCoordinate[];
}): ApproachPlan {
  const { from, size, speed, reach, goal, context } = params;
  const engagementTargets = params.engagementTargets ?? [];
  const reachable = [...computeMovementField({ from, size, maxSteps: speed, context }).values()];

  const euclidSq = (cell: SceneCoordinate): number => {
    const dx = cell.x - goal.x;
    const dy = cell.y - goal.y;
    return dx * dx + dy * dy;
  };
  const compareKeys = (a: SceneCoordinate, b: SceneCoordinate): number => {
    const ka = cellKey(a);
    const kb = cellKey(b);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  };
  const inReachOf = (cell: SceneCoordinate): boolean => gridDistance(cell, goal) <= reach;
  const engagement = (cell: SceneCoordinate): number =>
    countWithinReach(cell, engagementTargets, reach);

  const attackPositions = reachable.filter((rc) => inReachOf(rc.cell));
  let chosen: ReachableCell;
  if (attackPositions.length > 0) {
    // Engage fast, then threaten the most enemies, then closest, then stable id.
    chosen = attackPositions.sort(
      (a, b) =>
        a.steps - b.steps ||
        engagement(b.cell) - engagement(a.cell) ||
        euclidSq(a.cell) - euclidSq(b.cell) ||
        compareKeys(a.cell, b.cell)
    )[0];
  } else {
    // Close the gap: nearest in king-moves, then closest, then fewest steps, then id.
    chosen = reachable.sort(
      (a, b) =>
        gridDistance(a.cell, goal) - gridDistance(b.cell, goal) ||
        euclidSq(a.cell) - euclidSq(b.cell) ||
        a.steps - b.steps ||
        compareKeys(a.cell, b.cell)
    )[0];
  }

  return {
    to: { ...chosen.cell },
    steps: chosen.steps,
    inReachOfGoal: inReachOf(chosen.cell),
    moved: chosen.cell.x !== from.x || chosen.cell.y !== from.y,
    threatens: engagement(chosen.cell),
  };
}
