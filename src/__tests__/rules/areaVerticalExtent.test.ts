import { describe, it, expect } from 'vitest';

import { areaOfEffectToShape, cellInArea } from '../../rules';
import type { SceneCoordinate } from '../../types/core/scene';

/**
 * Tier 2: area effects have vertical extent. A sphere is a 3D ball (a flyer above
 * its radius is not caught), a cube is a 3D box rising from its plane, and a
 * cylinder is a column bounded by its height. Cones and lines remain horizontal
 * footprints (a documented approximation).
 */

const emitter: SceneCoordinate = { x: 0, y: 0 };
const at = (x: number, y: number, z?: number): SceneCoordinate => ({ x, y, z });

describe('a sphere is a 3D ball', () => {
  const shape = areaOfEffectToShape({ type: 'sphere', radius: 20 }, emitter, at(5, 5)); // r = 4 cells

  it('catches creatures within the radius, on the ground or aloft', () => {
    expect(cellInArea(at(7, 5, 0), shape)).toBe(true); // 10 ft away on the ground
    expect(cellInArea(at(5, 5, 3), shape)).toBe(true); // 15 ft straight up
  });

  it('does not catch a flyer above its radius (the fireball-overhead fix)', () => {
    expect(cellInArea(at(5, 5, 8), shape)).toBe(false); // 40 ft up, well over a 20 ft burst
  });
});

describe('a cube is a 3D box', () => {
  const shape = areaOfEffectToShape({ type: 'cube', feet: 20 }, emitter, at(6, 6)); // 4-cell box, z 0..4

  it('catches creatures inside the box footprint and height', () => {
    expect(cellInArea(at(5, 5, 0), shape)).toBe(true);
    expect(cellInArea(at(5, 5, 3), shape)).toBe(true);
  });

  it('does not catch a flyer above the top face', () => {
    expect(cellInArea(at(5, 5, 6), shape)).toBe(false); // above the 20 ft top
  });
});

describe('a cylinder is a vertical column', () => {
  const shape = areaOfEffectToShape(
    { type: 'cylinder', radius: 20, height: 40 },
    emitter,
    at(5, 5)
  ); // r 4, z 0..8

  it('catches anything in the footprint up to its height', () => {
    expect(cellInArea(at(8, 5, 0), shape)).toBe(true); // within radius, ground
    expect(cellInArea(at(8, 5, 6), shape)).toBe(true); // within radius and height
  });

  it('excludes creatures over the top or outside the radius', () => {
    expect(cellInArea(at(8, 5, 10), shape)).toBe(false); // above the 40 ft cap
    expect(cellInArea(at(11, 5, 0), shape)).toBe(false); // outside the radius
  });
});
