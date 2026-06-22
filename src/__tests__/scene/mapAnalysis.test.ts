import { describe, expect, it } from 'vitest';

import {
  mapAnalysisToIntents,
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

  it('accepts every supported region kind in bounds, and the result applies cleanly', async () => {
    const full = analysis({
      regions: [
        { kind: 'terrain', label: 'Brush', x: 0, y: 0, width: 1, height: 1 },
        { kind: 'hazard', label: 'Pit', x: 2, y: 2, width: 1, height: 1 },
        { kind: 'cover', label: 'Crates', x: 4, y: 4, width: 2, height: 1 },
        { kind: 'spawn', label: 'Party', x: 0, y: 9, width: 3, height: 1 },
      ],
    });
    expect(validateMapAnalysis(full, context)).toEqual({ valid: true, issues: [] });

    // The validated analysis becomes a set-map + one add-marker per region, and
    // every intent survives the event-sourced runtime's own re-validation.
    let counter = 0;
    const intents = mapAnalysisToIntents(full, 'asset-1', {
      markerIdFactory: () => `m-${(counter += 1)}`,
    });
    expect(intents[0]).toMatchObject({ type: 'set-map', registration: { assetHash: 'asset-1' } });
    expect(intents.filter((i) => i.type === 'add-marker')).toHaveLength(4);

    const { createSceneDocument, applySceneIntents } = await import('../../scene/runtime');
    const scene = createSceneDocument({
      id: 's',
      name: 'S',
      systemId: 'dnd-5e-2014',
      grid: { width: 10, height: 10, cellSize: 70 },
    });
    const withAsset = {
      ...scene,
      assets: {
        'asset-1': {
          hash: 'asset-1',
          mediaType: 'image/png',
          dataUrl: 'data:image/png;base64,AAAA',
        },
      },
    };
    let eventId = 0;
    const { events, rejected } = applySceneIntents(withAsset, intents, {
      eventIdFactory: () => `e-${(eventId += 1)}`,
    });
    expect(rejected).toEqual([]);
    expect(events).toHaveLength(intents.length);
  });

  it('maps hazard → hazard markers and other kinds → labelled terrain markers', () => {
    const intents = mapAnalysisToIntents(
      analysis({
        regions: [
          { kind: 'hazard', label: 'Lava', x: 0, y: 0, width: 1, height: 1 },
          { kind: 'cover', label: 'Wall', x: 1, y: 1, width: 1, height: 1 },
        ],
      }),
      'a',
      { markerIdFactory: () => 'm' }
    );
    const markers = intents.filter((i) => i.type === 'add-marker');
    expect(markers[0]).toMatchObject({ marker: { kind: 'hazard', label: 'Lava' } });
    expect(markers[1]).toMatchObject({ marker: { kind: 'terrain', label: 'Cover: Wall' } });
  });
});
