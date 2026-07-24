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

/** The transformed ~900-cell surface. Ref is attached to the transform wrapper. */
export const SpikeGrid = memo(function SpikeGrid({
  scale = 1,
  tx = 0,
  ty = 0,
  gridRef,
}: {
  scale?: number;
  tx?: number;
  ty?: number;
  gridRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={gridRef}
      role="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SPIKE_GRID_WIDTH}, 24px)`,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: '0 0',
      }}
    >
      {Array.from({ length: SPIKE_GRID_HEIGHT }).flatMap((_, y) =>
        Array.from({ length: SPIKE_GRID_WIDTH }).map((__, x) => (
          <SpikeCell key={`${x},${y}`} x={x} y={y} />
        ))
      )}
    </div>
  );
});
