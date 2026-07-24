import { describe, expect, it } from 'vitest';
import {
  cellOrigin,
  pointToCell,
  sceneCanvasGeometry,
  tokenAtCell,
} from '../../scene/canvasGeometry';
import type { SceneState, SceneToken } from '../../types/core/scene';

function token(partial: Partial<SceneToken> & Pick<SceneToken, 'id'>): SceneToken {
  return {
    name: partial.name ?? partial.id,
    kind: 'character',
    position: { x: 0, y: 0 },
    size: 1,
    ...partial,
  };
}

describe('sceneCanvasGeometry', () => {
  it('multiplies the clamped cell size across the grid', () => {
    const geom = sceneCanvasGeometry({ width: 4, height: 3 }, 70);
    expect(geom).toEqual({ cell: 70, cols: 4, rows: 3, width: 280, height: 210 });
  });

  it('clamps a tiny/invalid cell size up to the minimum instead of collapsing', () => {
    expect(sceneCanvasGeometry({ width: 2, height: 2 }, 2).cell).toBe(8);
    expect(sceneCanvasGeometry({ width: 2, height: 2 }, 0).cell).toBe(8);
    expect(sceneCanvasGeometry({ width: 2, height: 2 }, Number.NaN).cell).toBe(8);
  });

  it('floors a fractional cell size so boundaries land on whole pixels', () => {
    expect(sceneCanvasGeometry({ width: 1, height: 1 }, 20.9).cell).toBe(20);
  });
});

describe('cellOrigin', () => {
  it('returns the top-left pixel of a cell', () => {
    expect(cellOrigin({ x: 2, y: 1 }, 70)).toEqual({ x: 140, y: 70 });
  });
});

describe('pointToCell', () => {
  const geom = sceneCanvasGeometry({ width: 4, height: 3 }, 70);

  it('maps a point to the cell that contains it', () => {
    expect(pointToCell({ x: 0, y: 0 }, geom)).toEqual({ x: 0, y: 0 });
    expect(pointToCell({ x: 150, y: 80 }, geom)).toEqual({ x: 2, y: 1 });
    // Just inside the bottom-right cell.
    expect(pointToCell({ x: 279, y: 209 }, geom)).toEqual({ x: 3, y: 2 });
  });

  it('returns null for a point outside the grid', () => {
    expect(pointToCell({ x: -1, y: 5 }, geom)).toBeNull();
    expect(pointToCell({ x: 280, y: 10 }, geom)).toBeNull();
    expect(pointToCell({ x: 10, y: 210 }, geom)).toBeNull();
  });

  it('rescales when the element is displayed at a different size (CSS scaling)', () => {
    // Element shown at half size (140x105); a click at its center is cell (2,1).
    expect(pointToCell({ x: 70, y: 52 }, geom, 140, 105)).toEqual({ x: 2, y: 1 });
  });

  it('returns null for an empty grid', () => {
    const empty = sceneCanvasGeometry({ width: 0, height: 0 }, 70);
    expect(pointToCell({ x: 0, y: 0 }, empty)).toBeNull();
  });
});

describe('tokenAtCell', () => {
  const state: Pick<SceneState, 'tokens'> = {
    tokens: {
      hero: token({ id: 'hero', position: { x: 1, y: 1 }, size: 1 }),
      ogre: token({ id: 'ogre', position: { x: 2, y: 2 }, size: 2, kind: 'monster' }),
      ghost: token({ id: 'ghost', position: { x: 0, y: 0 }, hidden: true }),
    },
  };

  it('finds a single-cell token by its anchor', () => {
    expect(tokenAtCell(state, { x: 1, y: 1 })?.id).toBe('hero');
  });

  it('matches a large creature across its whole footprint', () => {
    expect(tokenAtCell(state, { x: 3, y: 3 })?.id).toBe('ogre');
    expect(tokenAtCell(state, { x: 2, y: 3 })?.id).toBe('ogre');
  });

  it('skips hidden tokens and empty cells', () => {
    expect(tokenAtCell(state, { x: 0, y: 0 })).toBeUndefined();
    expect(tokenAtCell(state, { x: 3, y: 0 })).toBeUndefined();
  });

  it('prefers the last-placed token when two overlap', () => {
    const overlap: Pick<SceneState, 'tokens'> = {
      tokens: {
        under: token({ id: 'under', position: { x: 0, y: 0 } }),
        over: token({ id: 'over', position: { x: 0, y: 0 } }),
      },
    };
    expect(tokenAtCell(overlap, { x: 0, y: 0 })?.id).toBe('over');
  });
});
