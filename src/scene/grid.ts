import type { SceneCoordinate } from '../types/core/scene';

/**
 * Serialize a grid coordinate to a stable string key (`"x:y"`). Shared by the
 * encounter builder's occupancy set and the grid view's cell/marker index so
 * the two can never disagree on how a cell is keyed.
 */
export function cellKey(position: SceneCoordinate): string {
  return `${position.x}:${position.y}`;
}
