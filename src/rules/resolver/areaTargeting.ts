/**
 * Area-of-effect target selection on a scene grid.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md`, "Participant-aware resolution".
 *
 * Selecting *who* an area effect touches is the participant-set half of AoE
 * resolution (the damage/save math lives in participantResolution.ts). These are
 * pure geometry helpers over the scene grid: given a shape and origin, return
 * the token ids inside it. Deterministic and side-effect-free.
 *
 * The shapes here are the GRID PRIMITIVES; `areaOfEffectToShape` maps the
 * canonical `AreaOfEffect` type (cone/cube/cylinder/line/sphere/emanation/spread
 * — shared with spells) onto them, so monster breath weapons and spells aim
 * through one model. Radius/range honor a per-system `DiagonalRule` because RAW
 * disagrees on diagonals: 5e counts every square as 5 ft (Chebyshev) while the
 * d20-legacy/Pathfinder line alternates 5/10 ft ("1-2-1").
 */

import type { SceneCoordinate, SceneState, SceneToken } from '../../types/core/scene';
import type { AreaOfEffect } from '../../types/core/common';

const FEET_PER_CELL = 5;

/** Feet → grid cells, rounded to the nearest cell (minimum one). */
function feetToCells(feet: number): number {
  return Math.max(1, Math.round(feet / FEET_PER_CELL));
}

/** Supported grid primitives (square-grid approximations of the RAW areas). */
export type AreaShape =
  | { kind: 'burst'; origin: SceneCoordinate; radius: number }
  | { kind: 'rect'; origin: SceneCoordinate; width: number; height: number }
  | { kind: 'line'; origin: SceneCoordinate; to: SceneCoordinate; width?: number }
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

/**
 * How a system counts diagonal movement/range on a square grid (RAW):
 *   - chebyshev   : every square = 5 ft (D&D 5e).
 *   - alternating : diagonals cost 5/10/5/10 ft, the "1-2-1" rule (D&D 3.5e,
 *                   Pathfinder 1e & 2e).
 *   - euclidean   : true distance (abstract / fallback).
 */
export type DiagonalRule = 'chebyshev' | 'alternating' | 'euclidean';

/** The RAW diagonal rule for a game system. */
export function diagonalRuleForSystem(systemId: string): DiagonalRule {
  switch (systemId) {
    case 'dnd-3.5e':
    case 'pf1e':
    case 'pf2e':
      return 'alternating';
    // 5e (both), and abstract grids (M&M / Daggerheart) count every square as one.
    default:
      return 'chebyshev';
  }
}

/** Grid distance between two cells under the given diagonal rule. */
export function gridDistance(
  a: SceneCoordinate,
  b: SceneCoordinate,
  rule: DiagonalRule = 'chebyshev'
): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  switch (rule) {
    case 'euclidean':
      return Math.hypot(dx, dy);
    case 'alternating': {
      // Straight steps cost 1; each pair of diagonal steps costs 3 (5+10 ft),
      // i.e. diagonals are 1, 2, 1, 2… cumulative = diag + floor(diag/2).
      const diag = Math.min(dx, dy);
      return Math.abs(dx - dy) + diag + Math.floor(diag / 2);
    }
    case 'chebyshev':
    default:
      return Math.max(dx, dy);
  }
}

/** True when a cell lies within the given area shape, under a diagonal rule. */
export function cellInArea(
  cell: SceneCoordinate,
  shape: AreaShape,
  rule: DiagonalRule = 'chebyshev'
): boolean {
  switch (shape.kind) {
    case 'burst':
      return gridDistance(cell, shape.origin, rule) <= shape.radius;
    case 'rect':
      return (
        cell.x >= shape.origin.x &&
        cell.x < shape.origin.x + shape.width &&
        cell.y >= shape.origin.y &&
        cell.y < shape.origin.y + shape.height
      );
    case 'line':
      return cellOnLine(cell, shape.origin, shape.to, shape.width ?? 1);
    case 'cone':
      return cellInCone(cell, shape, rule);
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
export function tokensInArea(
  state: SceneState,
  shape: AreaShape,
  rule: DiagonalRule = 'chebyshev'
): SceneToken[] {
  return Object.values(state.tokens).filter((token) => cellInArea(token.position, shape, rule));
}

/**
 * Map the canonical `AreaOfEffect` (the type spells and breath weapons share)
 * onto a grid primitive, given where the effect originates (the emitter) and the
 * cell it is aimed at:
 *   - cone / line emanate from the origin toward the aim;
 *   - sphere / spread / cylinder are centered on the aim (a targeted point);
 *   - emanation radiates from the origin itself (self-centered, e.g. an aura or
 *     a Pathfinder emanation), so it is NOT aimed.
 * Heights (cylinder) and corner-spreading (spread) collapse to a radius footprint
 * on the 2D grid — an explicit, documented approximation.
 */
export function areaOfEffectToShape(
  aoe: AreaOfEffect,
  origin: SceneCoordinate,
  aim: SceneCoordinate
): AreaShape {
  switch (aoe.type) {
    case 'cone':
      return { kind: 'cone', origin, aim, length: feetToCells(aoe.feet) };
    case 'cube': {
      const side = feetToCells(aoe.feet);
      const half = Math.floor(side / 2);
      return {
        kind: 'rect',
        origin: { x: aim.x - half, y: aim.y - half },
        width: side,
        height: side,
      };
    }
    case 'line': {
      const dx = aim.x - origin.x;
      const dy = aim.y - origin.y;
      const mag = Math.hypot(dx, dy) || 1;
      const length = feetToCells(aoe.length);
      const to = {
        x: origin.x + Math.round((dx / mag) * length),
        y: origin.y + Math.round((dy / mag) * length),
      };
      return { kind: 'line', origin, to, width: feetToCells(aoe.width) };
    }
    case 'sphere':
    case 'spread':
    case 'cylinder':
      return { kind: 'burst', origin: aim, radius: feetToCells(aoe.radius) };
    case 'emanation':
      // Radiates from the emitter's own square, not an aimed point.
      return { kind: 'burst', origin, radius: feetToCells(aoe.radius) };
    default: {
      const exhaustive: never = aoe;
      return exhaustive;
    }
  }
}

/** The cell an area resolves line of effect FROM (its RAW point of origin). */
export function areaOriginPoint(shape: AreaShape): SceneCoordinate {
  if (shape.kind === 'rect') {
    return {
      x: shape.origin.x + Math.floor(shape.width / 2),
      y: shape.origin.y + Math.floor(shape.height / 2),
    };
  }
  // burst (sphere/emanation), cone (apex), and line (start) originate at .origin.
  return shape.origin;
}

/**
 * Square-grid cone test. A cell is in the cone when it is within range
 * (grid distance ≤ length, under the diagonal rule) and the angle between the
 * (cell − origin) vector and the aim direction is within the cone's half-angle.
 * The apex cell (origin) is excluded, as is a degenerate cone whose aim coincides
 * with its origin (no direction). A small epsilon keeps cells that sit exactly on
 * the RAW boundary (e.g. atan(0.5)) reliably inside.
 */
function cellInCone(
  cell: SceneCoordinate,
  shape: Extract<AreaShape, { kind: 'cone' }>,
  rule: DiagonalRule
): boolean {
  const dx = cell.x - shape.origin.x;
  const dy = cell.y - shape.origin.y;
  if (dx === 0 && dy === 0) return false; // apex is not in the blast
  if (gridDistance(cell, shape.origin, rule) > shape.length) return false;

  const aimX = shape.aim.x - shape.origin.x;
  const aimY = shape.aim.y - shape.origin.y;
  if (aimX === 0 && aimY === 0) return false; // no aim direction → empty cone

  const dot = dx * aimX + dy * aimY;
  const cos = dot / (Math.hypot(dx, dy) * Math.hypot(aimX, aimY));
  const angle = Math.acos(Math.min(1, Math.max(-1, cos)));
  const halfAngle = ((shape.halfAngleDeg ?? DEFAULT_CONE_HALF_ANGLE_DEG) * Math.PI) / 180;
  return angle <= halfAngle + 1e-9;
}

/**
 * Thick-line cell test: a cell is in the line when its projection onto the
 * origin→to segment falls within the segment AND its perpendicular distance to
 * that segment is within half the line's width. A width of one cell (the common
 * 5-ft-wide line) reduces to the cells the segment passes through, origin
 * included. Degenerate (origin === to) matches only the origin cell.
 */
function cellOnLine(
  cell: SceneCoordinate,
  from: SceneCoordinate,
  to: SceneCoordinate,
  width: number
): boolean {
  const vx = to.x - from.x;
  const vy = to.y - from.y;
  const len2 = vx * vx + vy * vy;
  if (len2 === 0) return cell.x === from.x && cell.y === from.y;

  const wx = cell.x - from.x;
  const wy = cell.y - from.y;
  const t = (wx * vx + wy * vy) / len2; // projection parameter along the segment
  if (t < -1e-9 || t > 1 + 1e-9) return false;

  const projX = from.x + t * vx;
  const projY = from.y + t * vy;
  const perp = Math.hypot(cell.x - projX, cell.y - projY);
  return perp <= width / 2 + 1e-9;
}
