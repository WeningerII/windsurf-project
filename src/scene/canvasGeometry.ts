/**
 * Pure pixel<->cell geometry for the Phase-6 scene canvas view.
 *
 * The canvas (`SceneCanvas`) is a presentational alternative to the DOM
 * `SceneGridView`: it paints the SAME `SceneState` to a `<canvas>` and hit-tests
 * pointer input back into grid coordinates. All of the arithmetic that turns a
 * grid into pixels — and a click back into a cell or the token under it — lives
 * here, framework-free, so it is unit-testable without a canvas 2D context
 * (happy-dom / jsdom never implement one) and can never disagree with the
 * component about where a cell sits.
 *
 * It deliberately imports only the core scene TYPES and the shared `footprintCells`
 * helper — never `runtime.ts`, never `src/systems/**` — so the canvas stays a
 * pure view over existing state (Phase-6 layer-boundary invariant).
 */
import type { SceneCoordinate, SceneState, SceneToken } from '../types/core/scene';
import { footprintCells } from './grid';

/** The smallest cell edge, in CSS pixels, the canvas will ever draw. */
const MIN_CELL_PX = 8;

export interface SceneCanvasGeometry {
  /** Edge length of one grid cell, in CSS pixels (integer, >= MIN_CELL_PX). */
  cell: number;
  /** Total canvas width in CSS pixels (`cell * cols`). */
  width: number;
  /** Total canvas height in CSS pixels (`cell * rows`). */
  height: number;
  cols: number;
  rows: number;
}

/**
 * Resolve the canvas pixel geometry for a grid at a requested cell size. The
 * cell edge is clamped to a sane minimum and floored to a whole pixel so cell
 * boundaries land on exact pixels (crisp 1px gridlines, integer hit-testing).
 */
export function sceneCanvasGeometry(
  grid: { width: number; height: number },
  requestedCellPx: number
): SceneCanvasGeometry {
  const cell = Math.max(MIN_CELL_PX, Math.floor(requestedCellPx) || MIN_CELL_PX);
  const cols = Math.max(0, Math.trunc(grid.width));
  const rows = Math.max(0, Math.trunc(grid.height));
  return { cell, cols, rows, width: cell * cols, height: cell * rows };
}

/** Top-left CSS-pixel corner of a grid cell. */
export function cellOrigin(position: SceneCoordinate, cell: number): { x: number; y: number } {
  return { x: position.x * cell, y: position.y * cell };
}

/**
 * Map a point in canvas CSS-pixel space to the grid cell that contains it, or
 * `null` when the point falls outside the grid. `rectWidth`/`rectHeight` are the
 * canvas element's on-screen size; when they differ from the geometry's pixel
 * size (CSS scaling / high-DPI layout) the point is rescaled first, so a click
 * lands on the same cell the user sees regardless of how the element is stretched.
 */
export function pointToCell(
  point: { x: number; y: number },
  geometry: SceneCanvasGeometry,
  rectWidth = geometry.width,
  rectHeight = geometry.height
): SceneCoordinate | null {
  if (geometry.cols <= 0 || geometry.rows <= 0) return null;
  const scaleX = rectWidth > 0 ? geometry.width / rectWidth : 1;
  const scaleY = rectHeight > 0 ? geometry.height / rectHeight : 1;
  const x = Math.floor((point.x * scaleX) / geometry.cell);
  const y = Math.floor((point.y * scaleY) / geometry.cell);
  if (x < 0 || y < 0 || x >= geometry.cols || y >= geometry.rows) return null;
  return { x, y };
}

/**
 * The visible token occupying a grid cell, preferring the one placed latest
 * (iteration order) so an overlapping token reads as "on top" exactly as the
 * DOM grid stacks them. Multi-cell creatures are matched across their whole
 * footprint. Hidden tokens are skipped. Returns `undefined` for an empty cell.
 */
export function tokenAtCell(
  state: Pick<SceneState, 'tokens'>,
  position: SceneCoordinate
): SceneToken | undefined {
  let found: SceneToken | undefined;
  for (const token of Object.values(state.tokens)) {
    if (token.hidden) continue;
    const covers = footprintCells(token.position, token.size).some(
      (cell) => cell.x === position.x && cell.y === position.y
    );
    if (covers) found = token;
  }
  return found;
}
