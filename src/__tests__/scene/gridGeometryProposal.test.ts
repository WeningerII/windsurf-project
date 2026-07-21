import { describe, it, expect } from 'vitest';

import {
  GRID_GEOMETRY_PROPOSAL_VERSION,
  MIN_CELL_SIZE_PX,
  acceptGridGeometryProposal,
  deriveGridFromRegistration,
  snapRectToCells,
  validateGridGeometryProposal,
  type GridBoxProposal,
  type GridGeometryProposal,
} from '../../scene/gridGeometryProposal';
import { applySceneIntents, createSceneDocument } from '../../scene/runtime';

/** A clean 1000x800 image with a 100px grid at origin (10x8 derivable cells). */
function baseProposal(boxes: GridBoxProposal[] = []): GridGeometryProposal {
  return {
    version: GRID_GEOMETRY_PROPOSAL_VERSION,
    image: { widthPx: 1000, heightPx: 800 },
    registration: { offsetX: 0, offsetY: 0, cellSizePx: 100 },
    boxes,
  };
}

function box(overrides: Partial<GridBoxProposal> & Pick<GridBoxProposal, 'kind'>): GridBoxProposal {
  return { rect: { x: 100, y: 100, width: 200, height: 100 }, ...overrides };
}

function sequentialIds(prefix: string): () => string {
  let next = 0;
  return () => `${prefix}-${(next += 1)}`;
}

const codesOf = (validation: { issues: { code: string }[] }) =>
  validation.issues.map((issue) => issue.code);

describe('deriveGridFromRegistration', () => {
  it('counts only full cells inside the image', () => {
    expect(
      deriveGridFromRegistration(
        { widthPx: 1000, heightPx: 800 },
        { offsetX: 0, offsetY: 0, cellSizePx: 100 }
      )
    ).toEqual({ type: 'square', width: 10, height: 8, cellSize: 100 });
    // A 50px offset eats the last partial column/row.
    expect(
      deriveGridFromRegistration(
        { widthPx: 1000, heightPx: 800 },
        { offsetX: 50, offsetY: 50, cellSizePx: 100 }
      )
    ).toEqual({ type: 'square', width: 9, height: 7, cellSize: 100 });
  });
});

describe('snapRectToCells', () => {
  const registration = { offsetX: 0, offsetY: 0, cellSizePx: 100 };

  it('includes a cell when the box covers at least half of it', () => {
    // x 140..360 covers 60% of cell 1, all of 2, 60% of 3.
    expect(snapRectToCells({ x: 140, y: 100, width: 220, height: 100 }, registration)).toEqual({
      x: 1,
      y: 1,
      width: 3,
      height: 1,
    });
    // x 140..260 covers 60% of cell 1, 60% of cell 2 — but only 40% of neither edge beyond.
    expect(snapRectToCells({ x: 140, y: 0, width: 120, height: 100 }, registration)).toEqual({
      x: 1,
      y: 0,
      width: 2,
      height: 1,
    });
  });

  it('is total: a box too small to claim any cell collapses to its center cell', () => {
    expect(snapRectToCells({ x: 210, y: 330, width: 20, height: 10 }, registration)).toEqual({
      x: 2,
      y: 3,
      width: 1,
      height: 1,
    });
  });

  it('honors the registration offset', () => {
    // With a 50px offset, image x 150..350 is grid x 1..3 exactly.
    expect(
      snapRectToCells(
        { x: 150, y: 150, width: 200, height: 100 },
        { offsetX: 50, offsetY: 50, cellSizePx: 100 }
      )
    ).toEqual({ x: 1, y: 1, width: 2, height: 1 });
  });
});

describe('validateGridGeometryProposal', () => {
  it('accepts a well-formed proposal covering all four box kinds', () => {
    const proposal = baseProposal([
      box({ kind: 'spawn', rect: { x: 0, y: 0, width: 300, height: 200 } }),
      box({
        kind: 'terrain',
        suggestedPreset: 'difficult',
        rect: { x: 400, y: 400, width: 200, height: 200 },
      }),
      box({
        kind: 'cover',
        suggestedPreset: 'cover-2',
        rect: { x: 700, y: 100, width: 100, height: 100 },
      }),
      box({ kind: 'hazard', rect: { x: 200, y: 600, width: 200, height: 100 } }),
    ]);
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('accept');
    expect(validation.issues).toEqual([]);
    expect(validation.grid).toEqual({ type: 'square', width: 10, height: 8, cellSize: 100 });
    expect(validation.snapped).toEqual([
      { x: 0, y: 0, width: 3, height: 2 },
      { x: 4, y: 4, width: 2, height: 2 },
      { x: 7, y: 1, width: 1, height: 1 },
      { x: 2, y: 6, width: 2, height: 1 },
    ]);
  });

  it('snaps deterministically: the same proposal yields identical cells every time', () => {
    const proposal = baseProposal([
      box({
        kind: 'terrain',
        suggestedPreset: 'none',
        rect: { x: 137.5, y: 42.25, width: 233.4, height: 181.9 },
      }),
      box({ kind: 'hazard', rect: { x: 611, y: 233, width: 57, height: 41 } }),
    ]);
    const first = validateGridGeometryProposal(proposal);
    const second = validateGridGeometryProposal(proposal);
    expect(second.snapped).toEqual(first.snapped);
    expect(second.issues).toEqual(first.issues);
    expect(second.verdict).toBe(first.verdict);
  });

  it('rejects an unsupported envelope version outright', () => {
    const proposal = { ...baseProposal(), version: 2 } as unknown as GridGeometryProposal;
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('reject');
    expect(codesOf(validation)).toEqual(['unsupported-version']);
  });

  it('rejects non-positive or non-finite image dimensions', () => {
    const proposal = { ...baseProposal(), image: { widthPx: 0, heightPx: 800 } };
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('reject');
    expect(codesOf(validation)).toEqual(['invalid-image']);
  });

  it('rejects a structurally broken registration', () => {
    const proposal = { ...baseProposal(), registration: { offsetX: 0, offsetY: 0, cellSizePx: 0 } };
    expect(validateGridGeometryProposal(proposal).verdict).toBe('reject');
    const nan = {
      ...baseProposal(),
      registration: { offsetX: Number.NaN, offsetY: 0, cellSizePx: 100 },
    };
    expect(codesOf(validateGridGeometryProposal(nan))).toEqual(['invalid-registration']);
  });

  it('rejects boxes outside the image bounds, pointing at the box', () => {
    const validation = validateGridGeometryProposal(
      baseProposal([
        box({
          kind: 'terrain',
          suggestedPreset: 'none',
          rect: { x: 0, y: 0, width: 100, height: 100 },
        }),
        box({ kind: 'hazard', rect: { x: 950, y: 0, width: 100, height: 100 } }),
        box({ kind: 'hazard', rect: { x: -10, y: 0, width: 50, height: 50 } }),
      ])
    );
    expect(validation.verdict).toBe('reject');
    const outOfImage = validation.issues.filter((issue) => issue.code === 'box-out-of-image');
    expect(outOfImage.map((issue) => issue.boxIndex)).toEqual([1, 2]);
    expect(validation.snapped[1]).toBeNull();
    expect(validation.snapped[2]).toBeNull();
    expect(validation.snapped[0]).toEqual({ x: 0, y: 0, width: 1, height: 1 });
  });

  it('rejects degenerate box rects', () => {
    const validation = validateGridGeometryProposal(
      baseProposal([box({ kind: 'spawn', rect: { x: 100, y: 100, width: 0, height: 100 } })])
    );
    expect(validation.verdict).toBe('reject');
    expect(codesOf(validation)).toEqual(['invalid-box-rect']);
  });

  it('rejects unknown box kinds', () => {
    const proposal = baseProposal([box({ kind: 'treasure' as GridBoxProposal['kind'] })]);
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('reject');
    expect(codesOf(validation)).toEqual(['unknown-box-kind']);
    expect(validation.snapped).toEqual([null]);
  });

  it('rejects presets outside the marker vocabulary', () => {
    const validation = validateGridGeometryProposal(
      baseProposal([box({ kind: 'terrain', suggestedPreset: 'lava' })])
    );
    expect(validation.verdict).toBe('reject');
    expect(codesOf(validation)).toEqual(['unknown-preset']);
  });

  it('rejects preset/kind mismatches (cover preset on terrain, any preset on spawn)', () => {
    const onTerrain = validateGridGeometryProposal(
      baseProposal([box({ kind: 'terrain', suggestedPreset: 'cover-5' })])
    );
    expect(onTerrain.verdict).toBe('reject');
    expect(codesOf(onTerrain)).toEqual(['preset-kind-mismatch']);

    const onSpawn = validateGridGeometryProposal(
      baseProposal([box({ kind: 'spawn', suggestedPreset: 'difficult' })])
    );
    expect(onSpawn.verdict).toBe('reject');
    expect(codesOf(onSpawn)).toEqual(['preset-kind-mismatch']);

    const wrongCover = validateGridGeometryProposal(
      baseProposal([box({ kind: 'cover', suggestedPreset: 'difficult' })])
    );
    expect(wrongCover.verdict).toBe('reject');
    expect(codesOf(wrongCover)).toEqual(['preset-kind-mismatch']);
  });

  it('asks for manual correction when a cover box has no cover level', () => {
    const validation = validateGridGeometryProposal(baseProposal([box({ kind: 'cover' })]));
    expect(validation.verdict).toBe('manual-correction');
    expect(codesOf(validation)).toEqual(['missing-cover-preset']);
    // Still snapped — the human corrects the preset, not the geometry.
    expect(validation.snapped[0]).not.toBeNull();
  });

  it('asks for manual correction for an implausibly small cell size', () => {
    const proposal = {
      ...baseProposal(),
      registration: { offsetX: 0, offsetY: 0, cellSizePx: MIN_CELL_SIZE_PX - 1 },
    };
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('manual-correction');
    expect(codesOf(validation)).toContain('cell-too-small');
  });

  it('asks for manual correction when offsets fall outside [0, cell size)', () => {
    const proposal = {
      ...baseProposal(),
      registration: { offsetX: 120, offsetY: -5, cellSizePx: 100 },
    };
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('manual-correction');
    expect(codesOf(validation)).toContain('offset-out-of-cell');
  });

  it('asks for manual correction when no full cell fits the image', () => {
    const proposal = {
      ...baseProposal(),
      registration: { offsetX: 0, offsetY: 0, cellSizePx: 2000 },
    };
    const validation = validateGridGeometryProposal(proposal);
    expect(validation.verdict).toBe('manual-correction');
    expect(codesOf(validation)).toContain('grid-empty');
  });

  it('asks for manual correction when a box snaps beyond the derivable grid', () => {
    // 1060px-wide image, 100px cells: 10 full columns plus a 60px margin. A box
    // reaching into that margin claims a column the grid does not have.
    const clipped = validateGridGeometryProposal({
      version: GRID_GEOMETRY_PROPOSAL_VERSION,
      image: { widthPx: 1060, heightPx: 800 },
      registration: { offsetX: 0, offsetY: 0, cellSizePx: 100 },
      boxes: [box({ kind: 'hazard', rect: { x: 850, y: 100, width: 210, height: 100 } })],
    });
    expect(clipped.verdict).toBe('manual-correction');
    expect(codesOf(clipped)).toEqual(['box-clipped-by-grid']);

    const fullyOff = validateGridGeometryProposal({
      version: GRID_GEOMETRY_PROPOSAL_VERSION,
      image: { widthPx: 1060, heightPx: 800 },
      registration: { offsetX: 0, offsetY: 0, cellSizePx: 100 },
      boxes: [box({ kind: 'hazard', rect: { x: 1000, y: 100, width: 60, height: 100 } })],
    });
    expect(fullyOff.verdict).toBe('manual-correction');
    expect(codesOf(fullyOff)).toEqual(['box-off-grid']);
  });

  it('accepts an empty proposal (grid-only registration) with a non-blocking warning', () => {
    const validation = validateGridGeometryProposal(baseProposal([]));
    expect(validation.verdict).toBe('accept');
    expect(validation.issues).toEqual([
      expect.objectContaining({ code: 'no-boxes', severity: 'warning' }),
    ]);
    expect(validation.snapped).toEqual([]);
  });
});

describe('acceptGridGeometryProposal', () => {
  const acceptable = () =>
    baseProposal([
      box({ kind: 'spawn', rect: { x: 0, y: 0, width: 300, height: 200 } }),
      box({
        kind: 'terrain',
        suggestedPreset: 'difficult',
        rect: { x: 400, y: 400, width: 200, height: 200 },
      }),
      box({
        kind: 'cover',
        suggestedPreset: 'cover-2',
        label: '  Low wall  ',
        rect: { x: 700, y: 100, width: 100, height: 100 },
      }),
      box({ kind: 'hazard', rect: { x: 200, y: 600, width: 200, height: 100 } }),
    ]);

  it('emits only existing intent shapes: add-marker intents, spawn zones, and a registration', () => {
    const result = acceptGridGeometryProposal(acceptable(), {
      markerIdFactory: sequentialIds('m'),
    });
    expect(result.accepted).toBe(true);
    expect(result.registration).toEqual({
      imageWidthPx: 1000,
      imageHeightPx: 800,
      offsetXPx: 0,
      offsetYPx: 0,
      cellSizePx: 100,
      grid: { type: 'square', width: 10, height: 8, cellSize: 100 },
    });
    expect(result.spawnZones).toEqual([{ position: { x: 0, y: 0 }, width: 3, height: 2 }]);
    expect(result.intents.every((intent) => intent.type === 'add-marker')).toBe(true);
    expect(result.intents).toEqual([
      {
        type: 'add-marker',
        marker: {
          id: 'm-1',
          kind: 'terrain',
          label: 'Difficult terrain (×2 move)',
          position: { x: 4, y: 4 },
          width: 2,
          height: 2,
          effects: [{ target: 'movement', operation: 'add', value: 1, label: 'difficult terrain' }],
        },
      },
      {
        type: 'add-marker',
        marker: {
          id: 'm-2',
          kind: 'terrain',
          label: 'Low wall',
          position: { x: 7, y: 1 },
          width: 1,
          height: 1,
          effects: [{ target: 'ac', operation: 'add', value: 2, label: '+2 cover' }],
        },
      },
      {
        type: 'add-marker',
        marker: {
          id: 'm-3',
          kind: 'hazard',
          label: 'Hazard',
          position: { x: 2, y: 6 },
          width: 2,
          height: 1,
          // No effects field at all — the strict-additive contract.
        },
      },
    ]);
  });

  it('is deterministic: the same proposal and factory produce identical output', () => {
    const first = acceptGridGeometryProposal(acceptable(), { markerIdFactory: sequentialIds('m') });
    const second = acceptGridGeometryProposal(acceptable(), {
      markerIdFactory: sequentialIds('m'),
    });
    expect(second).toEqual(first);
  });

  it('applies cleanly through the runtime intent path against the derived grid', () => {
    const result = acceptGridGeometryProposal(acceptable(), {
      markerIdFactory: sequentialIds('m'),
    });
    expect(result.registration).toBeDefined();
    const scene = createSceneDocument({
      id: 'scene-vision',
      name: 'Vision test',
      systemId: 'dnd5e',
      grid: result.registration?.grid,
      now: new Date('2026-01-01T00:00:00Z'),
    });
    const applied = applySceneIntents(scene, result.intents, {
      eventIdFactory: sequentialIds('evt'),
      now: () => new Date('2026-01-01T00:00:00Z'),
    });
    expect(applied.rejected).toEqual([]);
    expect(applied.events.map((event) => event.type)).toEqual([
      'marker.added',
      'marker.added',
      'marker.added',
    ]);
  });

  it('emits nothing for a rejected proposal', () => {
    const proposal = baseProposal([box({ kind: 'treasure' as GridBoxProposal['kind'] })]);
    const result = acceptGridGeometryProposal(proposal, { markerIdFactory: sequentialIds('m') });
    expect(result.accepted).toBe(false);
    expect(result.validation.verdict).toBe('reject');
    expect(result.registration).toBeUndefined();
    expect(result.intents).toEqual([]);
    expect(result.spawnZones).toEqual([]);
  });

  it('emits nothing for a manual-correction proposal', () => {
    const result = acceptGridGeometryProposal(baseProposal([box({ kind: 'cover' })]), {
      markerIdFactory: sequentialIds('m'),
    });
    expect(result.accepted).toBe(false);
    expect(result.validation.verdict).toBe('manual-correction');
    expect(result.intents).toEqual([]);
  });

  it('accepts an empty proposal as registration-only (no intents, no zones)', () => {
    const result = acceptGridGeometryProposal(baseProposal([]), {
      markerIdFactory: sequentialIds('m'),
    });
    expect(result.accepted).toBe(true);
    expect(result.registration?.grid).toEqual({
      type: 'square',
      width: 10,
      height: 8,
      cellSize: 100,
    });
    expect(result.intents).toEqual([]);
    expect(result.spawnZones).toEqual([]);
  });
});
