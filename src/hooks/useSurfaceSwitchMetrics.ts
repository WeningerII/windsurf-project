import { useEffect, useRef } from 'react';
import type { Surface } from './useAppNav';

/**
 * User-timing instrumentation for shell surface switches (Phase 1, build-specs
 * task 11). Records a `performance.mark` on every `nav.surface` change and a
 * `performance.measure` named `shell:surface-switch:<from>-><to>` between
 * consecutive surface marks, so DevTools timelines and Playwright traces carry
 * a real interaction-latency baseline for the Phase-7 budget gate. No latency
 * threshold is asserted here on purpose — the budget number must come from
 * recorded baselines, not be invented up front.
 *
 * Side-effect only: runs after commit (never in the render path) and is a
 * no-op wherever the User Timing API is missing or throws.
 */

function surfaceMarkName(surface: Surface): string {
  return `shell:surface:${surface}`;
}

export function useSurfaceSwitchMetrics(surface: Surface): void {
  const previousSurfaceRef = useRef<Surface | null>(null);

  useEffect(() => {
    const previous = previousSurfaceRef.current;
    // Re-runs without an actual switch (e.g. StrictMode's double effect
    // invocation) must not emit duplicate marks.
    if (previous === surface) return;
    previousSurfaceRef.current = surface;
    if (
      typeof performance === 'undefined' ||
      typeof performance.mark !== 'function' ||
      typeof performance.measure !== 'function'
    ) {
      return;
    }
    try {
      performance.mark(surfaceMarkName(surface));
      if (previous !== null) {
        // measure(name, startMark, endMark) resolves each mark name to its
        // most recent occurrence, which is exactly the previous switch.
        performance.measure(
          `shell:surface-switch:${previous}->${surface}`,
          surfaceMarkName(previous),
          surfaceMarkName(surface)
        );
      }
    } catch {
      // Diagnostics must never break navigation (e.g. a partial Performance
      // polyfill that rejects user-timing calls).
    }
  }, [surface]);
}
