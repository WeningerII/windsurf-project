/**
 * Drop-target registration + hit-testing for the Phase-4 drag keystone.
 *
 * `resolveCellFromPoint` is the pure hit-test: given a viewport point it walks
 * `document.elementFromPoint` up to the nearest `[data-scene-cell]` inside the
 * registered grid container and reads its integer `data-x` / `data-y`. This is
 * the DRIFT-corrected interim drop math (the grid computes per-cell `position`
 * but exposes no rect/cellPx) — the same coordinate contract `onCellActivate`
 * consumes, resolved without adding a new intent.
 */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { SceneCoordinate } from '../../types/core/scene';
import { useDragContext } from './dragContext';
import type { DropHandler, DropResolver } from './dragTypes';

type ElementFromPoint = (x: number, y: number) => Element | null;

const defaultElementFromPoint: ElementFromPoint = (x, y) =>
  typeof document === 'undefined' ? null : document.elementFromPoint(x, y);

/**
 * The scene cell under a point, or null when the point is off any cell inside
 * `container` (an illegal / off-grid drop). `elementFromPoint` is injectable so
 * the hit-test is unit-testable without a real layout.
 */
export function resolveCellFromPoint(
  clientX: number,
  clientY: number,
  container: HTMLElement | null,
  elementFromPoint: ElementFromPoint = defaultElementFromPoint
): SceneCoordinate | null {
  if (!container) return null;
  const hit = elementFromPoint(clientX, clientY);
  if (!hit) return null;
  const cell = hit.closest('[data-scene-cell]');
  if (!(cell instanceof HTMLElement) || !container.contains(cell)) return null;
  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return null;
  return { x, y };
}

/**
 * Register `ref`'s element as a drop zone. A no-op with no provider (flag off)
 * or before the ref mounts. The resolver uses the live container element, so a
 * keepalive-hidden then re-shown grid keeps resolving correctly.
 */
export function useDropTarget(
  id: string,
  ref: RefObject<HTMLElement | null>,
  onDrop: DropHandler,
  enabled = true
): void {
  const ctx = useDragContext();
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !ctx || !element) return;
    const resolver: DropResolver = (x, y) => resolveCellFromPoint(x, y, element);
    return ctx.registerDropTarget(id, { element, resolver, onDrop });
  }, [ctx, id, ref, onDrop, enabled]);
}
