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
  | { kind: 'line'; origin: SceneCoordinate; to: SceneCoordinate }
  | {
      kind: 'cone';
      /** Apex of the cone (the emitter's cell). */
      origin: SceneCoordinate;
      /** A cell the cone is aimed at; only its direction from the origin matters. */
      aim: SceneCoordinate;
      /** Maximum reach of the cone, in cells. */
      length: number;
      /** Half of the cone's angular spread; defaults to the RAW 5e cone. */
      halfAngleDeg?: number;
    };

/**
 * RAW 5e cone half-angle: "a cone's width at a given point equals that point's
 * distance from the origin", so the boundary rises at slope ½ from the axis →
 * a half-angle of atan(0.5) ≈ 26.57° (≈ 53° total spread).
 */
export const DEFAULT_CONE_HALF_ANGLE_DEG = (Math.atan(0.5) * 180) / Math.PI;

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
    case 'cone':
      return cellInCone(cell, shape);
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

/**
 * Square-grid cone test. A cell is in the cone when it is within range
 * (Chebyshev ≤ length, matching the module's grid metric) and the angle between
 * the (cell − origin) vector and the aim direction is within the cone's
 * half-angle. The apex cell (origin) is excluded, as is a degenerate cone whose
 * aim coincides with its origin (no direction). A small epsilon keeps cells that
 * sit exactly on the RAW boundary (e.g. atan(0.5)) reliably inside.
 */
function cellInCone(cell: SceneCoordinate, shape: Extract<AreaShape, { kind: 'cone' }>): boolean {
  const dx = cell.x - shape.origin.x;
  const dy = cell.y - shape.origin.y;
  if (dx === 0 && dy === 0) return false; // apex is not in the blast
  if (gridDistance(cell, shape.origin) > shape.length) return false;

  const aimX = shape.aim.x - shape.origin.x;
  const aimY = shape.aim.y - shape.origin.y;
  if (aimX === 0 && aimY === 0) return false; // no aim direction → empty cone

  const dot = dx * aimX + dy * aimY;
  const cos = dot / (Math.hypot(dx, dy) * Math.hypot(aimX, aimY));
  const angle = Math.acos(Math.min(1, Math.max(-1, cos)));
  const halfAngle = ((shape.halfAngleDeg ?? DEFAULT_CONE_HALF_ANGLE_DEG) * Math.PI) / 180;
  return angle <= halfAngle + 1e-9;
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
