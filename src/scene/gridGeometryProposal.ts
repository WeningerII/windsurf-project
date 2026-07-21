/**
 * Grid-geometry proposal schema + deterministic validator + acceptance
 * transform — the provider-free half of the master plan's Phase 10
 * (Vision/Grid Automation) on the Scene Runtime track (RFC 006).
 *
 * A future vision adapter looks at a map image and PROPOSES geometry: a grid
 * registration (where the square grid sits in the image, in pixels) plus
 * boxes for spawn zones, terrain, cover, and hazards. This module is the
 * deterministic gate that proposal must pass, mirroring the shipped
 * encounter-spec validator (`src/scene/encounterSpec.ts`): typed spec in,
 * structured coded issues out, pure and total. The verdict is three-way —
 * `accept`, `reject`, or `manual-correction` (the geometry is plausible but a
 * human should adjust it before it becomes scene state).
 *
 * An ACCEPTED proposal emits only artifacts the manual path already uses:
 * `add-marker` scene intents (`SceneActionIntent`, applied via the runtime's
 * `applySceneIntents`), spawn zones in the exact shape the encounter builder's
 * `zone` parameter takes, and a grid registration whose derived grid is a
 * plain `SceneGrid`. No new event types; the vision path cannot invent state
 * the manual path could not.
 *
 * Join points (deliberately named, not yet wired):
 * - VISION ADAPTER (Phase 10, AI side): lives behind the AI gateway task-class
 *   surface (`src/ai/`, RFC 002); it produces a `GridGeometryProposal` and
 *   must call `validateGridGeometryProposal` / `acceptGridGeometryProposal`
 *   before anything touches a scene. Nothing here imports provider code.
 * - PHASE 9 MAP-ASSET GRID REGISTRATION: no map-asset shape exists in the
 *   codebase yet, so `SceneGridRegistration` is defined LOCALLY here. When the
 *   Phase 9 map-asset record lands (image hash + manual grid registration),
 *   its registration field should unify with `SceneGridRegistration` — the
 *   pixel offsets/cell size plus the derived `SceneGrid` are exactly what a
 *   manual registration UI captures.
 */

import type {
  SceneActionIntent,
  SceneCoordinate,
  SceneGrid,
  SceneMarker,
} from '../types/core/scene';
import {
  MARKER_EFFECT_OPTIONS,
  terrainEffectsForPreset,
  type MarkerEffectPreset,
} from '../components/scene/markerEffects';

/** Envelope version, bumped on breaking schema changes (like `SceneDocument.version`). */
export const GRID_GEOMETRY_PROPOSAL_VERSION = 1;

/**
 * Cells smaller than this are below any plausible battle-map resolution; a
 * registration under it is flagged for manual correction rather than trusted.
 */
export const MIN_CELL_SIZE_PX = 8;

export type GridBoxKind = 'spawn' | 'terrain' | 'cover' | 'hazard';

/** An axis-aligned rectangle in IMAGE PIXELS (origin top-left of the image). */
export interface PixelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** An axis-aligned rectangle in GRID CELLS (origin cell 0,0 of the derived grid). */
export interface CellRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Where the square grid sits in the image: cell (0,0)'s top-left corner is at
 * (`offsetX`, `offsetY`) image pixels and cells are `cellSizePx` on a side.
 * Canonical form keeps each offset in `[0, cellSizePx)`.
 */
export interface GridRegistrationProposal {
  offsetX: number;
  offsetY: number;
  cellSizePx: number;
}

/**
 * One proposed box. `suggestedPreset` is validated against the shipped marker
 * preset vocabulary (`MARKER_EFFECT_OPTIONS`) — it is a raw string here because
 * proposals arrive from an untrusted vision model; the validator narrows it.
 */
export interface GridBoxProposal {
  kind: GridBoxKind;
  /** Box extent in image pixels; snapped to whole cells by the validator. */
  rect: PixelRect;
  /** Optional human label; the acceptance transform derives one when absent. */
  label?: string;
  /**
   * Suggested functional-terrain preset. Required for `cover` (`cover-2` /
   * `cover-5`), optional for `terrain` (`difficult` / `high-ground-1` /
   * `none`), and must be absent (or `none`) for `spawn` / `hazard`.
   */
  suggestedPreset?: string;
}

/** The versioned proposal envelope a vision adapter must produce. */
export interface GridGeometryProposal {
  version: typeof GRID_GEOMETRY_PROPOSAL_VERSION;
  /** Dimensions of the analyzed image, in pixels. */
  image: { widthPx: number; heightPx: number };
  registration: GridRegistrationProposal;
  boxes: readonly GridBoxProposal[];
}

export type GridGeometryIssueCode =
  | 'unsupported-version'
  | 'invalid-image'
  | 'invalid-registration'
  | 'cell-too-small'
  | 'offset-out-of-cell'
  | 'grid-empty'
  | 'invalid-box-rect'
  | 'box-out-of-image'
  | 'unknown-box-kind'
  | 'unknown-preset'
  | 'preset-kind-mismatch'
  | 'missing-cover-preset'
  | 'box-off-grid'
  | 'box-clipped-by-grid'
  | 'no-boxes';

/**
 * `reject` means the proposal is structurally wrong and must not be applied;
 * `correction` means the geometry is plausible but a human should adjust it
 * (the "asks for manual correction" outcome); `warning` never blocks.
 */
export type GridGeometryIssueSeverity = 'reject' | 'correction' | 'warning';

export interface GridGeometryIssue {
  code: GridGeometryIssueCode;
  severity: GridGeometryIssueSeverity;
  message: string;
  /** Index into `proposal.boxes`, when the issue is about one box. */
  boxIndex?: number;
}

export type GridGeometryVerdict = 'accept' | 'manual-correction' | 'reject';

export interface GridGeometryValidation {
  /** `accept` only when there are no reject- or correction-severity issues. */
  verdict: GridGeometryVerdict;
  issues: GridGeometryIssue[];
  /**
   * The grid derivable from the registration (full cells inside the image),
   * as a plain `SceneGrid`. Undefined when the registration is unusable.
   */
  grid?: SceneGrid;
  /**
   * Snapped cell rect per box, index-aligned with `proposal.boxes`; `null`
   * for boxes that were rejected before snapping. Deterministic: the same
   * proposal always snaps to identical cells.
   */
  snapped: (CellRect | null)[];
}

const BOX_KINDS: readonly GridBoxKind[] = ['spawn', 'terrain', 'cover', 'hazard'];
const PRESET_VALUES: readonly string[] = MARKER_EFFECT_OPTIONS.map((option) => option.value);
const COVER_PRESETS: readonly MarkerEffectPreset[] = ['cover-2', 'cover-5'];
const TERRAIN_PRESETS: readonly MarkerEffectPreset[] = ['none', 'difficult', 'high-ground-1'];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPositiveInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value > 0;
}

function isKnownBoxKind(value: unknown): value is GridBoxKind {
  return BOX_KINDS.includes(value as GridBoxKind);
}

function isKnownPreset(value: string): value is MarkerEffectPreset {
  return PRESET_VALUES.includes(value);
}

/** Whether every field of a pixel rect is finite with positive extent. */
function isWellFormedRect(rect: PixelRect): boolean {
  return (
    isFiniteNumber(rect.x) &&
    isFiniteNumber(rect.y) &&
    isFiniteNumber(rect.width) &&
    isFiniteNumber(rect.height) &&
    rect.width > 0 &&
    rect.height > 0
  );
}

/**
 * Snap a pixel-space box onto grid cells: a cell is included when the box
 * covers at least half of it along each axis, and when the box is too small to
 * claim any cell that way, it collapses to the single cell under its center —
 * so the snap is TOTAL (every well-formed box yields at least one cell) and a
 * pure function of its inputs (identical proposals snap identically). The
 * result may extend beyond the derivable grid; the validator reports that
 * separately as `box-off-grid` / `box-clipped-by-grid`.
 */
export function snapRectToCells(rect: PixelRect, registration: GridRegistrationProposal): CellRect {
  const snapAxis = (start: number, extent: number, offset: number): [number, number] => {
    const lo = (start - offset) / registration.cellSizePx;
    const hi = (start + extent - offset) / registration.cellSizePx;
    let first = Math.floor(lo + 0.5);
    let lastExclusive = Math.ceil(hi - 0.5);
    if (lastExclusive <= first) {
      const center = Math.floor((lo + hi) / 2);
      first = center;
      lastExclusive = center + 1;
    }
    return [first, lastExclusive];
  };

  const [x0, x1] = snapAxis(rect.x, rect.width, registration.offsetX);
  const [y0, y1] = snapAxis(rect.y, rect.height, registration.offsetY);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/**
 * The square grid derivable from a registration: only FULL cells that fit
 * inside the image count, so every derived cell maps to real map pixels.
 * `cellSize` carries the pixel size through as the scene render cell size.
 */
export function deriveGridFromRegistration(
  image: { widthPx: number; heightPx: number },
  registration: GridRegistrationProposal
): SceneGrid {
  return {
    type: 'square',
    width: Math.max(
      0,
      Math.floor((image.widthPx - registration.offsetX) / registration.cellSizePx)
    ),
    height: Math.max(
      0,
      Math.floor((image.heightPx - registration.offsetY) / registration.cellSizePx)
    ),
    cellSize: registration.cellSizePx,
  };
}

/**
 * Validate a proposed grid geometry. Pure and deterministic: same proposal,
 * same verdict, same issues, same snapped cells. Every failure mode is a coded
 * {@link GridGeometryIssue}; reject-severity issues force verdict `reject`,
 * correction-severity issues force `manual-correction`, warnings never block.
 */
export function validateGridGeometryProposal(
  proposal: GridGeometryProposal
): GridGeometryValidation {
  const issues: GridGeometryIssue[] = [];
  const snapped: (CellRect | null)[] = proposal.boxes.map(() => null);

  if (proposal.version !== GRID_GEOMETRY_PROPOSAL_VERSION) {
    issues.push({
      code: 'unsupported-version',
      severity: 'reject',
      message: `Proposal version ${String(proposal.version)} is not supported (expected ${GRID_GEOMETRY_PROPOSAL_VERSION}).`,
    });
    return { verdict: 'reject', issues, snapped };
  }

  if (!isPositiveInteger(proposal.image.widthPx) || !isPositiveInteger(proposal.image.heightPx)) {
    issues.push({
      code: 'invalid-image',
      severity: 'reject',
      message: 'Image dimensions must be positive integers of pixels.',
    });
    return { verdict: 'reject', issues, snapped };
  }

  const registration = proposal.registration;
  if (
    !isFiniteNumber(registration.offsetX) ||
    !isFiniteNumber(registration.offsetY) ||
    !isFiniteNumber(registration.cellSizePx) ||
    registration.cellSizePx <= 0
  ) {
    issues.push({
      code: 'invalid-registration',
      severity: 'reject',
      message: 'Grid registration needs finite offsets and a positive cell size in pixels.',
    });
    return { verdict: 'reject', issues, snapped };
  }

  if (registration.cellSizePx < MIN_CELL_SIZE_PX) {
    issues.push({
      code: 'cell-too-small',
      severity: 'correction',
      message: `Cell size ${registration.cellSizePx}px is below the plausible minimum of ${MIN_CELL_SIZE_PX}px; adjust the registration manually.`,
    });
  }
  if (
    registration.offsetX < 0 ||
    registration.offsetY < 0 ||
    registration.offsetX >= registration.cellSizePx ||
    registration.offsetY >= registration.cellSizePx
  ) {
    issues.push({
      code: 'offset-out-of-cell',
      severity: 'correction',
      message: `Grid offsets must be within [0, cell size); got (${registration.offsetX}, ${registration.offsetY}) for ${registration.cellSizePx}px cells.`,
    });
  }

  const grid = deriveGridFromRegistration(proposal.image, registration);
  if (grid.width < 1 || grid.height < 1) {
    issues.push({
      code: 'grid-empty',
      severity: 'correction',
      message:
        'No full grid cell fits inside the image with this registration; correct it manually.',
    });
  }

  if (proposal.boxes.length === 0) {
    issues.push({
      code: 'no-boxes',
      severity: 'warning',
      message: 'The proposal registers a grid but suggests no boxes.',
    });
  }

  proposal.boxes.forEach((box, boxIndex) => {
    if (!isKnownBoxKind(box.kind)) {
      issues.push({
        boxIndex,
        code: 'unknown-box-kind',
        severity: 'reject',
        message: `Box kind '${String(box.kind)}' is not one of ${BOX_KINDS.join(', ')}.`,
      });
      return;
    }
    if (!isWellFormedRect(box.rect)) {
      issues.push({
        boxIndex,
        code: 'invalid-box-rect',
        severity: 'reject',
        message: `Box ${boxIndex} (${box.kind}) needs finite coordinates and positive extent.`,
      });
      return;
    }
    if (
      box.rect.x < 0 ||
      box.rect.y < 0 ||
      box.rect.x + box.rect.width > proposal.image.widthPx ||
      box.rect.y + box.rect.height > proposal.image.heightPx
    ) {
      issues.push({
        boxIndex,
        code: 'box-out-of-image',
        severity: 'reject',
        message: `Box ${boxIndex} (${box.kind}) extends outside the ${proposal.image.widthPx}x${proposal.image.heightPx}px image.`,
      });
      return;
    }

    const presetIssue = validateBoxPreset(box, boxIndex);
    if (presetIssue) {
      issues.push(presetIssue);
      if (presetIssue.severity === 'reject') return;
    }

    const cells = snapRectToCells(box.rect, registration);
    snapped[boxIndex] = cells;

    const clipX = Math.max(0, -cells.x) + Math.max(0, cells.x + cells.width - grid.width);
    const clipY = Math.max(0, -cells.y) + Math.max(0, cells.y + cells.height - grid.height);
    const fullyOff =
      cells.x + cells.width <= 0 ||
      cells.y + cells.height <= 0 ||
      cells.x >= grid.width ||
      cells.y >= grid.height;
    if (fullyOff) {
      issues.push({
        boxIndex,
        code: 'box-off-grid',
        severity: 'correction',
        message: `Box ${boxIndex} (${box.kind}) snaps entirely outside the derivable ${grid.width}x${grid.height} grid; correct the box or the registration manually.`,
      });
    } else if (clipX > 0 || clipY > 0) {
      issues.push({
        boxIndex,
        code: 'box-clipped-by-grid',
        severity: 'correction',
        message: `Box ${boxIndex} (${box.kind}) snaps partly outside the derivable ${grid.width}x${grid.height} grid; correct it manually before applying.`,
      });
    }
  });

  const verdict: GridGeometryVerdict = issues.some((issue) => issue.severity === 'reject')
    ? 'reject'
    : issues.some((issue) => issue.severity === 'correction')
      ? 'manual-correction'
      : 'accept';

  return { verdict, issues, grid, snapped };
}

/** Preset rules per box kind (see {@link GridBoxProposal.suggestedPreset}). */
function validateBoxPreset(box: GridBoxProposal, boxIndex: number): GridGeometryIssue | undefined {
  const preset = box.suggestedPreset;
  if (preset !== undefined && !isKnownPreset(preset)) {
    return {
      boxIndex,
      code: 'unknown-preset',
      severity: 'reject',
      message: `Preset '${preset}' on box ${boxIndex} is not in the marker preset vocabulary (${PRESET_VALUES.join(', ')}).`,
    };
  }
  if (box.kind === 'cover') {
    if (preset === undefined) {
      return {
        boxIndex,
        code: 'missing-cover-preset',
        severity: 'correction',
        message: `Cover box ${boxIndex} does not say which cover level applies; pick ${COVER_PRESETS.join(' or ')} manually.`,
      };
    }
    if (!COVER_PRESETS.includes(preset as MarkerEffectPreset)) {
      return {
        boxIndex,
        code: 'preset-kind-mismatch',
        severity: 'reject',
        message: `Cover box ${boxIndex} must use ${COVER_PRESETS.join(' or ')}, not '${preset}'.`,
      };
    }
    return undefined;
  }
  if (box.kind === 'terrain') {
    if (preset !== undefined && !TERRAIN_PRESETS.includes(preset as MarkerEffectPreset)) {
      return {
        boxIndex,
        code: 'preset-kind-mismatch',
        severity: 'reject',
        message: `Terrain box ${boxIndex} cannot carry cover preset '${preset}'; propose a 'cover' box instead.`,
      };
    }
    return undefined;
  }
  // spawn / hazard: no functional-terrain preset applies.
  if (preset !== undefined && preset !== 'none') {
    return {
      boxIndex,
      code: 'preset-kind-mismatch',
      severity: 'reject',
      message: `Box ${boxIndex} (${box.kind}) cannot carry preset '${preset}'; presets apply to terrain and cover boxes only.`,
    };
  }
  return undefined;
}

/**
 * Grid registration as scene-side state. Defined LOCALLY pending the Phase 9
 * map-asset record (none exists in the codebase yet); when that lands, its
 * manual-registration field should unify with this shape — see the module
 * header's "PHASE 9 MAP-ASSET GRID REGISTRATION" join point.
 */
export interface SceneGridRegistration {
  imageWidthPx: number;
  imageHeightPx: number;
  offsetXPx: number;
  offsetYPx: number;
  cellSizePx: number;
  /** The derived grid, directly usable as `SceneState.grid`. */
  grid: SceneGrid;
}

/** A spawn zone in the exact shape `buildEncounterEvents`' `zone` param takes. */
export interface SceneSpawnZone {
  position: SceneCoordinate;
  width: number;
  height: number;
}

export interface GridGeometryAcceptance {
  /** True only when the validator's verdict was `accept`. */
  accepted: boolean;
  validation: GridGeometryValidation;
  /** Present when accepted. */
  registration?: SceneGridRegistration;
  /**
   * `add-marker` intents (existing `SceneActionIntent` shapes only) for the
   * terrain/cover/hazard boxes, in box order — apply with `applySceneIntents`.
   */
  intents: SceneActionIntent[];
  /** Spawn boxes as encounter-builder zones, in box order. */
  spawnZones: SceneSpawnZone[];
}

/**
 * Turn a VALID proposal into the same normal artifacts the manual path uses:
 * marker placements via existing typed scene intents, spawn boxes as encounter
 * builder zones, and a {@link SceneGridRegistration}. A proposal that does not
 * validate as `accept` emits nothing. Pure given the id factory; with a
 * deterministic factory the whole output is a pure function of the proposal.
 */
export function acceptGridGeometryProposal(
  proposal: GridGeometryProposal,
  options: { markerIdFactory: () => string }
): GridGeometryAcceptance {
  const validation = validateGridGeometryProposal(proposal);
  if (validation.verdict !== 'accept' || !validation.grid) {
    return { accepted: false, validation, intents: [], spawnZones: [] };
  }

  const intents: SceneActionIntent[] = [];
  const spawnZones: SceneSpawnZone[] = [];

  proposal.boxes.forEach((box, boxIndex) => {
    const cells = validation.snapped[boxIndex];
    if (!cells) return;
    if (box.kind === 'spawn') {
      spawnZones.push({
        position: { x: cells.x, y: cells.y },
        width: cells.width,
        height: cells.height,
      });
      return;
    }
    intents.push({
      type: 'add-marker',
      marker: markerForBox(box, cells, options.markerIdFactory()),
    });
  });

  return {
    accepted: true,
    validation,
    registration: {
      imageWidthPx: proposal.image.widthPx,
      imageHeightPx: proposal.image.heightPx,
      offsetXPx: proposal.registration.offsetX,
      offsetYPx: proposal.registration.offsetY,
      cellSizePx: proposal.registration.cellSizePx,
      grid: validation.grid,
    },
    intents,
    spawnZones,
  };
}

/**
 * Build the marker exactly as the manual marker panel would: cover is
 * functional terrain (marker kind 'terrain' + cover effects), hazard markers
 * carry no effects, and `none`/absent presets store no `effects` field at all
 * (the strict-additive contract from `terrainEffectsForPreset`).
 */
function markerForBox(box: GridBoxProposal, cells: CellRect, id: string): SceneMarker {
  const preset = (box.suggestedPreset ?? 'none') as MarkerEffectPreset;
  const effects = terrainEffectsForPreset(preset);
  const presetLabel = MARKER_EFFECT_OPTIONS.find((option) => option.value === preset)?.label;
  const trimmed = box.label?.trim();
  const label =
    trimmed && trimmed.length > 0
      ? trimmed
      : preset !== 'none' && presetLabel
        ? presetLabel
        : box.kind === 'hazard'
          ? 'Hazard'
          : 'Terrain';

  return {
    id,
    kind: box.kind === 'hazard' ? 'hazard' : 'terrain',
    label,
    position: { x: cells.x, y: cells.y },
    width: cells.width,
    height: cells.height,
    ...(effects ? { effects } : {}),
  };
}
