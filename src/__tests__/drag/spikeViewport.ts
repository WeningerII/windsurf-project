/**
 * Pure viewport math for the Phase-4 3a spike (test/dev-only). Split out of
 * spikeHarness.tsx so the harness file exports only components (react-refresh)
 * and this JSX-free module holds the inversion / zoom-to-cursor / clamp math
 * that PROBES — does not retire — the Phase-6 5d pan/zoom subsystem (Finding 10).
 */
import type { SceneCoordinate } from '../../types/core/scene';

export interface Viewport {
  /** Uniform zoom factor. */
  scale: number;
  /** Translate X (px) applied before scale in screen space. */
  tx: number;
  /** Translate Y (px). */
  ty: number;
  /** The unscaled cell edge length (px). */
  cellPx: number;
}

export interface Rect {
  left: number;
  top: number;
}

/**
 * Invert a viewport point to an integer cell under a variable scale+translate:
 * floor((clientX - rect.left - tx) / (cellPx * scale)). At scale=1/tx=0 this is
 * the fixed-1:1 case.
 */
export function invertPoint(
  clientX: number,
  clientY: number,
  rect: Rect,
  vp: Viewport
): SceneCoordinate {
  const x = Math.floor((clientX - rect.left - vp.tx) / (vp.cellPx * vp.scale));
  const y = Math.floor((clientY - rect.top - vp.ty) / (vp.cellPx * vp.scale));
  return { x, y };
}

/** Clamp a cell to the grid bounds (drops near an edge still land in-bounds). */
export function clampCoordinate(
  coord: SceneCoordinate,
  width: number,
  height: number
): SceneCoordinate {
  return {
    x: Math.max(0, Math.min(width - 1, coord.x)),
    y: Math.max(0, Math.min(height - 1, coord.y)),
  };
}

/**
 * Wheel-zoom anchored at the cursor: the world point under the cursor stays put
 * as scale changes. Returns the next viewport (new scale + re-solved translate).
 */
export function zoomToCursor(
  vp: Viewport,
  cursorX: number,
  cursorY: number,
  rect: Rect,
  factor: number,
  minScale = 0.25,
  maxScale = 4
): Viewport {
  const worldX = (cursorX - rect.left - vp.tx) / vp.scale;
  const worldY = (cursorY - rect.top - vp.ty) / vp.scale;
  const nextScale = Math.max(minScale, Math.min(maxScale, vp.scale * factor));
  return {
    ...vp,
    scale: nextScale,
    tx: cursorX - rect.left - worldX * nextScale,
    ty: cursorY - rect.top - worldY * nextScale,
  };
}
