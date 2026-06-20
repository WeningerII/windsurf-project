import type { SceneCoordinate } from '../types/core/scene';

/**
 * Serialize a grid coordinate to a stable string key (`"x:y"`). Shared by the
 * encounter builder's occupancy set and the grid view's cell/marker index so
 * the two can never disagree on how a cell is keyed.
 */
export function cellKey(position: SceneCoordinate): string {
  return `${position.x}:${position.y}`;
}

/** Every grid cell a token of `size` (its width/height in cells) occupies when
 * anchored at `position`. A size-1 token occupies just its own cell. */
export function footprintCells(position: SceneCoordinate, size: number): SceneCoordinate[] {
  const span = Math.max(1, Math.trunc(size));
  const cells: SceneCoordinate[] = [];
  for (let dy = 0; dy < span; dy += 1) {
    for (let dx = 0; dx < span; dx += 1) {
      cells.push({ x: position.x + dx, y: position.y + dy });
    }
  }
  return cells;
}

/** Whether a `size`-cell token anchored at `position` fits entirely on the grid
 * (integer cells, footprint inside the bounds). */
export function footprintWithinGrid(
  position: SceneCoordinate,
  size: number,
  gridWidth: number,
  gridHeight: number
): boolean {
  const span = Math.max(1, Math.trunc(size));
  return (
    Number.isInteger(position.x) &&
    Number.isInteger(position.y) &&
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + span <= gridWidth &&
    position.y + span <= gridHeight
  );
}
