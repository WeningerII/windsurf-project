import { describe, expect, it } from 'vitest';

import {
  validateMapAnalysis,
  type MapAnalysis,
  type MapAnalysisContext,
} from '../../scene/mapAnalysis';

/**
 * PHASE 10 (RFC 006): the deterministic geometry gate. AI vision may PROPOSE a
 * grid + region boxes; this decides. The grid must fit the image and every
 * region must fall within the grid, so an accepted proposal always maps to legal
 * scene events.
 */

// A 700x700 image with a 10x10 grid at 70px/cell fits exactly.
const context: MapAnalysisContext = {
  imageWidth: 700,
  imageHeight: 700,
  gridWidth: 10,
  gridHeight: 10,
};

function analysis(over: Partial<MapAnalysis> = {}): MapAnalysis {
  return {
    pixelsPerCell: 70,
    offsetX: 0,
    offsetY: 0,
    regions: [{ kind: 'hazard', label: 'Lava', x: 1, y: 1, width: 2, height: 2 }],
    ...over,
  };
}

describe('validateMapAnalysis', () => {
  it('accepts a grid that fits the image with in-bounds regions', () => {
    expect(validateMapAnalysis(analysis(), context)).toEqual({ valid: true, issues: [] });
  });

  it('rejects a non-positive scale', () => {
    const result = validateMapAnalysis(analysis({ pixelsPerCell: 0 }), context);
    expect(result.valid).toBe(false);
    expect(result.issues.map((i) => i.code)).toContain('invalid-scale');
  });

  it('rejects negative or non-integer offsets', () => {
    expect(validateMapAnalysis(analysis({ offsetX: -1 }), context).valid).toBe(false);
    expect(
      validateMapAnalysis(analysis({ offsetY: 3.5 }), context).issues.map((i) => i.code)
    ).toContain('invalid-offset');
  });

  it('rejects a grid that runs off the image', () => {
    // 10 cells x 80px = 800 > 700.
    const result = validateMapAnalysis(analysis({ pixelsPerCell: 80 }), context);
    expect(result.valid).toBe(false);
    expect(result.issues.map((i) => i.code)).toContain('grid-out-of-bounds');
  });

  it('also catches a grid pushed off by its offset', () => {
    const result = validateMapAnalysis(analysis({ offsetX: 100 }), context); // 100 + 700 > 700
    expect(result.issues.map((i) => i.code)).toContain('grid-out-of-bounds');
  });

  it('rejects a region box outside the grid', () => {
    const result = validateMapAnalysis(
      analysis({ regions: [{ kind: 'terrain', label: 'Wall', x: 9, y: 0, width: 3, height: 1 }] }),
      context
    );
    expect(result.valid).toBe(false);
    const issue = result.issues.find((i) => i.code === 'region-out-of-bounds');
    expect(issue?.regionIndex).toBe(0);
  });

  it('rejects an unknown region kind', () => {
    const result = validateMapAnalysis(
      analysis({
        regions: [{ kind: 'portal' as never, label: 'X', x: 0, y: 0, width: 1, height: 1 }],
      }),
      context
    );
    expect(result.issues.map((i) => i.code)).toContain('invalid-region-kind');
  });

  it('accepts every supported region kind in bounds', () => {
    const result = validateMapAnalysis(
      analysis({
        regions: [
          { kind: 'terrain', label: 'Brush', x: 0, y: 0, width: 1, height: 1 },
          { kind: 'hazard', label: 'Pit', x: 2, y: 2, width: 1, height: 1 },
          { kind: 'cover', label: 'Crates', x: 4, y: 4, width: 2, height: 1 },
          { kind: 'spawn', label: 'Party', x: 0, y: 9, width: 3, height: 1 },
        ],
      }),
      context
    );
    expect(result).toEqual({ valid: true, issues: [] });
  });
});
