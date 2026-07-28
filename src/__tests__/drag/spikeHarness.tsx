/**
 * Phase-4 3a SPIKE grid (test/dev-only — NOT shipped in the index chunk; it
 * lives under src/__tests__ so the bundle-size gate never sees it).
 *
 * Renders ~900 memoized cells inside a CSS `transform: scale()+translate()`
 * wrapper, with the same `data-scene-cell` / `data-x` / `data-y` contract the
 * real grid exposes, so elementFromPoint hit-testing and coordinate inversion
 * can be proven under an active transform. The PURE viewport math it probes
 * lives in `spikeViewport.ts`.
 */
import { memo } from 'react';

export const SPIKE_GRID_WIDTH = 30;
export const SPIKE_GRID_HEIGHT = 30; // 900 cells

const SpikeCell = memo(function SpikeCell({ x, y }: { x: number; y: number }) {
  return (
    <div
      role="gridcell"
      data-scene-cell=""
      data-x={x}
      data-y={y}
      style={{ width: 24, height: 24 }}
    />
  );
});

/**
 * The transformed surface. Ref is attached to the transform wrapper.
 *
 * `width`/`height` default to the 30x30 spike and exist so a test can render
 * the SAME surface at two sizes and compare the drop reconcile between them.
 * That is what makes "the reconcile does a bounded amount of work over 900
 * cells" checkable deterministically: the cost must not move with cell count.
 */
export const SpikeGrid = memo(function SpikeGrid({
  scale = 1,
  tx = 0,
  ty = 0,
  gridRef,
  width = SPIKE_GRID_WIDTH,
  height = SPIKE_GRID_HEIGHT,
}: {
  scale?: number;
  tx?: number;
  ty?: number;
  gridRef?: React.Ref<HTMLDivElement>;
  width?: number;
  height?: number;
}) {
  return (
    <div
      ref={gridRef}
      role="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 24px)`,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: '0 0',
      }}
    >
      {Array.from({ length: height }).flatMap((_, y) =>
        Array.from({ length: width }).map((__, x) => <SpikeCell key={`${x},${y}`} x={x} y={y} />)
      )}
    </div>
  );
});
