/**
 * Area-of-effect target selection on a scene grid.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md`, "Participant-aware resolution".
 *
 * Selecting *who* an area effect touches is the participant-set half of AoE
 * resolution (the damage/save math lives in participantResolution.ts). These are
 * pure geometry helpers over the scene grid: given a shape and origin, return
 * the token ids inside it. Deterministic and side-effect-free.
 */

import type { SceneCoordinate, SceneState, SceneToken } from '../../types/core/scene';

/** Supported area shapes (square-grid approximations of the common RAW areas). */
export type AreaShape =
  | { kind: 'burst'; origin: SceneCoordinate; radius: number }
  | { kind: 'rect'; origin: SceneCoordinate; width: number; height: number }
  | { kind: 'line'; origin: SceneCoordinate; to: SceneCoordinate };

/** Chebyshev (king-move) distance — the standard 5e/PF square-grid metric. */
export function gridDistance(a: SceneCoordinate, b: SceneCoordinate): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/** True when a cell lies within the given area shape. */
export function cellInArea(cell: SceneCoordinate, shape: AreaShape): boolean {
  switch (shape.kind) {
    case 'burst':
      return gridDistance(cell, shape.origin) <= shape.radius;
    case 'rect':
      return (
        cell.x >= shape.origin.x &&
        cell.x < shape.origin.x + shape.width &&
        cell.y >= shape.origin.y &&
        cell.y < shape.origin.y + shape.height
      );
    case 'line':
      return cellOnLine(cell, shape.origin, shape.to);
    default: {
      const exhaustive: never = shape;
      return exhaustive;
    }
  }
}

/**
 * Tokens whose position falls within the area, in deterministic order (scene
 * token insertion order). This is the participant set for an area effect.
 */
export function tokensInArea(state: SceneState, shape: AreaShape): SceneToken[] {
  return Object.values(state.tokens).filter((token) => cellInArea(token.position, shape));
}

/** Bresenham-style line cell test for a 'line' area. */
function cellOnLine(cell: SceneCoordinate, from: SceneCoordinate, to: SceneCoordinate): boolean {
  // A cell is on the line if it is one of the cells the Bresenham walk visits.
  let x0 = from.x;
  let y0 = from.y;
  const x1 = to.x;
  const y1 = to.y;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  // Guard against pathological infinite loops on bad input.
  let guard = 0;
  const maxSteps = dx - dy + 2;
  for (;;) {
    if (x0 === cell.x && y0 === cell.y) return true;
    if (x0 === x1 && y0 === y1) return false;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
    guard += 1;
    if (guard > maxSteps) return false;
  }
}
