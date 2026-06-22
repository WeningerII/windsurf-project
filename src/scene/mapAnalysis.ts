/**
 * Map-analysis geometry validation (MASTER_PLAN Phase 10).
 *
 * Optional AI vision may PROPOSE a grid registration and a set of labelled region
 * boxes (terrain, hazard, cover, spawn) over a battle map; this is the
 * deterministic gate that decides whether a proposal is usable before any of it
 * reaches the event-sourced scene path. Like the encounter-spec validator, every
 * failure is a coded {@link MapAnalysisIssue} a repair loop can act on. Pure and
 * deterministic — the model proposes; this decides.
 *
 * The proposed grid must fit inside the image (so the overlay can't run off the
 * art), and every region box must fall within the grid in cell coordinates (so an
 * accepted box always maps to a legal scene marker). Manual registration
 * (Phase 9) remains the fallback when no proposal validates.
 */

export type MapRegionKind = 'terrain' | 'hazard' | 'cover' | 'spawn';

const REGION_KINDS: ReadonlySet<MapRegionKind> = new Set(['terrain', 'hazard', 'cover', 'spawn']);

/** A labelled rectangle in GRID CELL coordinates (x,y top-left; width/height in cells). */
export interface MapRegion {
  kind: MapRegionKind;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A proposed grid registration (image-pixel scale + origin) plus region boxes. */
export interface MapAnalysis {
  pixelsPerCell: number;
  offsetX: number;
  offsetY: number;
  regions: MapRegion[];
}

/** The image's natural pixel size and the scene grid the proposal must fit. */
export interface MapAnalysisContext {
  imageWidth: number;
  imageHeight: number;
  gridWidth: number;
  gridHeight: number;
}

export type MapAnalysisIssueCode =
  | 'invalid-scale'
  | 'invalid-offset'
  | 'grid-out-of-bounds'
  | 'invalid-region-kind'
  | 'region-out-of-bounds';

export interface MapAnalysisIssue {
  code: MapAnalysisIssueCode;
  message: string;
  /** Index into `analysis.regions`, when the issue is about one region. */
  regionIndex?: number;
}

export interface MapAnalysisValidation {
  valid: boolean;
  issues: MapAnalysisIssue[];
}

function isFiniteInt(value: number): boolean {
  return Number.isInteger(value) && Number.isFinite(value);
}

/**
 * Validate a proposed map analysis against the image and grid. Errors are coded
 * so a bounded AI repair loop (or the UI) can act on them; `valid` is true only
 * when nothing is out of bounds.
 */
export function validateMapAnalysis(
  analysis: MapAnalysis,
  context: MapAnalysisContext
): MapAnalysisValidation {
  const issues: MapAnalysisIssue[] = [];

  if (!Number.isFinite(analysis.pixelsPerCell) || analysis.pixelsPerCell <= 0) {
    issues.push({ code: 'invalid-scale', message: 'Pixels-per-cell must be a positive number.' });
  }
  if (!isFiniteInt(analysis.offsetX) || !isFiniteInt(analysis.offsetY)) {
    issues.push({
      code: 'invalid-offset',
      message: 'Grid offsets must be whole numbers of pixels.',
    });
  } else if (analysis.offsetX < 0 || analysis.offsetY < 0) {
    issues.push({ code: 'invalid-offset', message: 'Grid offsets cannot be negative.' });
  }

  // The whole grid (origin + cells x scale) must lie inside the image, so the
  // overlay never runs off the art.
  if (Number.isFinite(analysis.pixelsPerCell) && analysis.pixelsPerCell > 0) {
    const spanX = analysis.offsetX + context.gridWidth * analysis.pixelsPerCell;
    const spanY = analysis.offsetY + context.gridHeight * analysis.pixelsPerCell;
    if (spanX > context.imageWidth || spanY > context.imageHeight) {
      issues.push({
        code: 'grid-out-of-bounds',
        message: `The proposed grid (${Math.round(spanX)}x${Math.round(spanY)}px) extends past the ${context.imageWidth}x${context.imageHeight} image.`,
      });
    }
  }

  analysis.regions.forEach((region, regionIndex) => {
    if (!REGION_KINDS.has(region.kind)) {
      issues.push({
        code: 'invalid-region-kind',
        message: `Region ${regionIndex} has an unknown kind '${region.kind}'.`,
        regionIndex,
      });
      return;
    }
    const fits =
      isFiniteInt(region.x) &&
      isFiniteInt(region.y) &&
      isFiniteInt(region.width) &&
      isFiniteInt(region.height) &&
      region.x >= 0 &&
      region.y >= 0 &&
      region.width >= 1 &&
      region.height >= 1 &&
      region.x + region.width <= context.gridWidth &&
      region.y + region.height <= context.gridHeight;
    if (!fits) {
      issues.push({
        code: 'region-out-of-bounds',
        message: `Region ${regionIndex} ('${region.label}') falls outside the ${context.gridWidth}x${context.gridHeight} grid.`,
        regionIndex,
      });
    }
  });

  return { valid: issues.length === 0, issues };
}
