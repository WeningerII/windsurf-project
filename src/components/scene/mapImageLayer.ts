import type { CSSProperties } from 'react';
import type { SceneGridRegistration } from '../../types/core/scene';

/**
 * Percentage-based placement of the map image inside the grid container, from
 * the image's natural pixel size and its manual registration. Pure and
 * unit-tested: with square cells the container is `grid.width` cells wide and
 * `grid.height` cells tall, so an image spanning `natural / cellSizePx` cells
 * maps to percentages independent of the responsive rendered cell size.
 */
export function mapImageLayerStyle(
  natural: { width: number; height: number },
  registration: SceneGridRegistration,
  grid: { width: number; height: number }
): CSSProperties {
  const cell = registration.cellSizePx > 0 ? registration.cellSizePx : 1;
  return {
    left: `${(-registration.offsetX / cell / grid.width) * 100}%`,
    top: `${(-registration.offsetY / cell / grid.height) * 100}%`,
    width: `${(natural.width / cell / grid.width) * 100}%`,
    height: `${(natural.height / cell / grid.height) * 100}%`,
    maxWidth: 'none',
  };
}
