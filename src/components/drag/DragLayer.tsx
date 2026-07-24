/**
 * The portaled drag ghost (Phase 4). Positioned entirely by a DIRECT ref
 * transform written in the DragProvider's pointermove handler — NO per-frame
 * React state, so a drag across ~900 grid cells never re-renders the tree.
 * `pointer-events:none` so it never intercepts the elementFromPoint hit-test.
 *
 * DOM/rAF-only visual — exercised by Playwright, not vitest (added to
 * coverage.exclude).
 */
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

interface DragLayerProps {
  label: string;
}

export const DragLayer = forwardRef<HTMLDivElement, DragLayerProps>(function DragLayer(
  { label },
  ref
) {
  return createPortal(
    <div
      ref={ref}
      aria-hidden="true"
      data-testid="scene-drag-ghost"
      className="pointer-events-none fixed left-0 top-0 z-[60] select-none rounded-full border border-primary/40 bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg"
      style={{ willChange: 'transform' }}
    >
      {label}
    </div>,
    document.body
  );
});
