import { describe, it, expect } from 'vitest';
import {
  invertPoint,
  clampCoordinate,
  zoomToCursor,
  type Viewport,
  type Rect,
} from './spikeViewport';

/**
 * Finding-10 dynamic-viewport PROBE: proves the coordinate math Phase-6 5d will
 * ship — variable scale+translate inversion, wheel-zoom-to-cursor anchoring, and
 * clamping — so the pan/zoom subsystem is de-risked BEFORE it is funded. Phase 4
 * only PROBES this; 5d owns the shipped acceptance gate.
 */
const rect: Rect = { left: 100, top: 40 };
const CELL = 24;

describe('dynamic-viewport probe: coordinate inversion', () => {
  it('fixed 1:1 (scale=1, tx=ty=0): floor(clientX/cellPx)', () => {
    const vp: Viewport = { scale: 1, tx: 0, ty: 0, cellPx: CELL };
    // A point 3.5 cells across, 2.1 cells down (offset by rect origin).
    const coord = invertPoint(rect.left + 3.5 * CELL, rect.top + 2.1 * CELL, rect, vp);
    expect(coord).toEqual({ x: 3, y: 2 });
  });

  it('variable scale+translate: floor((client-rect-t)/(cellPx*scale))', () => {
    const vp: Viewport = { scale: 2, tx: 30, ty: -10, cellPx: CELL };
    // Choose a point squarely inside cell (5, 4): world cell edge in screen space
    // = rect + t + cell * cellPx * scale.
    const px = rect.left + vp.tx + (5 + 0.5) * CELL * vp.scale;
    const py = rect.top + vp.ty + (4 + 0.5) * CELL * vp.scale;
    expect(invertPoint(px, py, rect, vp)).toEqual({ x: 5, y: 4 });
  });

  it('is stable across a fractional scale', () => {
    const vp: Viewport = { scale: 0.75, tx: 12, ty: 8, cellPx: CELL };
    const px = rect.left + vp.tx + (9 + 0.5) * CELL * vp.scale;
    const py = rect.top + vp.ty + (1 + 0.5) * CELL * vp.scale;
    expect(invertPoint(px, py, rect, vp)).toEqual({ x: 9, y: 1 });
  });
});

describe('dynamic-viewport probe: wheel-zoom-to-cursor', () => {
  it('keeps the cell under the cursor fixed while zooming in', () => {
    const vp: Viewport = { scale: 1, tx: 0, ty: 0, cellPx: CELL };
    const cursorX = rect.left + 7.5 * CELL;
    const cursorY = rect.top + 3.5 * CELL;
    const before = invertPoint(cursorX, cursorY, rect, vp);

    const zoomed = zoomToCursor(vp, cursorX, cursorY, rect, 1.25);
    expect(zoomed.scale).toBeCloseTo(1.25);
    // The same screen point still resolves to the same integer cell after zoom.
    const after = invertPoint(cursorX, cursorY, rect, zoomed);
    expect(after).toEqual(before);
  });

  it('keeps the cursor cell fixed while zooming out and clamps scale to the floor', () => {
    const vp: Viewport = { scale: 0.3, tx: 5, ty: 5, cellPx: CELL };
    const cursorX = rect.left + 2.5 * CELL;
    const cursorY = rect.top + 2.5 * CELL;
    const before = invertPoint(cursorX, cursorY, rect, vp);
    const zoomed = zoomToCursor(vp, cursorX, cursorY, rect, 0.5, 0.25, 4);
    expect(zoomed.scale).toBe(0.25); // clamped to minScale
    expect(invertPoint(cursorX, cursorY, rect, zoomed)).toEqual(before);
  });
});

describe('dynamic-viewport probe: clamping', () => {
  it('clamps an off-grid drop back into bounds', () => {
    expect(clampCoordinate({ x: -3, y: 40 }, 30, 30)).toEqual({ x: 0, y: 29 });
    expect(clampCoordinate({ x: 12, y: 5 }, 30, 30)).toEqual({ x: 12, y: 5 });
  });
});
