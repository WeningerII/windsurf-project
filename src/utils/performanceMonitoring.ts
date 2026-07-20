/**
 * Web-vitals / performance instrumentation, routed THROUGH the telemetry module
 * rather than the console. Each measurement becomes a `perf.web_vital` (or
 * `perf.long_task`) telemetry event, so it inherits the whole privacy pipeline:
 * it is a no-op until the user opts in (`track()` gates on `isTelemetryEnabled`)
 * and its payload is guaranteed non-PII by the schema guard.
 *
 * Everything here degrades to a no-op wherever the PerformanceObserver API is
 * missing or throws (SSR, older browsers, partial polyfills), and it never
 * throws back into app startup.
 */
import { track } from '../telemetry';
import type { WebVitalMetric, WebVitalRating } from '../telemetry';

/**
 * Route a single web-vital measurement into telemetry. `value` is milliseconds
 * for time-based metrics (LCP/FID/INP/TTFB/FCP) and a small unitless score for
 * CLS. The value is rounded so payloads carry no needless precision, but the
 * precision differs by metric: millisecond metrics round to a whole number,
 * while CLS (typically 0.0–0.3) keeps four decimals so the signal survives
 * rounding instead of collapsing to zero. A no-op until opt-in.
 */
export function recordWebVital(
  metric: WebVitalMetric,
  value: number,
  rating?: WebVitalRating
): void {
  const rounded = metric === 'CLS' ? Math.round(value * 1e4) / 1e4 : Math.round(value);
  // A missing `rating` is dropped by the schema guard (undefined is not a
  // recordable value), so no conditional spread is needed here.
  track('perf.web_vital', { metric, value: rounded, rating });
}

// Minimal shapes for the entry types we read (avoids depending on lib.dom
// versions that may not yet declare LayoutShift / first-input timing).
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

function observe(type: string, onEntries: (entries: PerformanceEntryList) => void): void {
  try {
    const observer = new PerformanceObserver((list) => {
      try {
        onEntries(list.getEntries());
      } catch {
        // A malformed entry must not break the observer callback.
      }
    });
    // `buffered: true` replays entries emitted before this observer attached.
    observer.observe({ type, buffered: true } as PerformanceObserverInit);
  } catch {
    // Unsupported entryType on this browser — skip just this metric.
  }
}

/**
 * Start observing web-vital-style performance entries and forward them as
 * telemetry events. Safe to call unconditionally: it is a no-op where
 * PerformanceObserver is unavailable, and each event is itself gated on opt-in.
 */
export function initPerformanceMonitoring(): void {
  if (typeof PerformanceObserver === 'undefined') return;

  // Largest Contentful Paint — the latest entry wins.
  observe('largest-contentful-paint', (entries) => {
    const last = entries[entries.length - 1];
    if (last) recordWebVital('LCP', last.startTime);
  });

  // First Input Delay — input processing start minus the input timestamp.
  observe('first-input', (entries) => {
    for (const entry of entries) {
      const fi = entry as FirstInputEntry;
      recordWebVital('FID', fi.processingStart - fi.startTime);
    }
  });

  // Cumulative Layout Shift — accumulate non-input-driven shifts into a running
  // score (CLS is cumulative by definition) and report the running total, so a
  // consumer sees the current CLS rather than one isolated shift. The
  // accumulator is scoped to this init call, so it starts fresh each time.
  let cumulativeLayoutShift = 0;
  observe('layout-shift', (entries) => {
    for (const entry of entries) {
      const ls = entry as LayoutShiftEntry;
      if (ls.hadRecentInput) continue;
      cumulativeLayoutShift += ls.value;
      recordWebVital('CLS', cumulativeLayoutShift);
    }
  });

  // Long Tasks — main-thread blocks over the 50ms threshold.
  observe('longtask', (entries) => {
    for (const entry of entries) {
      track('perf.long_task', { durationMs: Math.round(entry.duration) });
    }
  });
}
