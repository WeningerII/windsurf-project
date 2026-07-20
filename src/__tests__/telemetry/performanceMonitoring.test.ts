import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initPerformanceMonitoring, recordWebVital } from '../../utils/performanceMonitoring';
import { init, resetTelemetry } from '../../telemetry';
import { OPT_IN_STORAGE_KEY } from '../../telemetry/gate';
import type { TelemetryEvent, TelemetrySink } from '../../telemetry';

function optIn(): void {
  localStorage.setItem(OPT_IN_STORAGE_KEY, 'true');
}

function spySink(): TelemetrySink & { events: TelemetryEvent[] } {
  const events: TelemetryEvent[] = [];
  return { events, record: (e) => events.push(e) };
}

// Minimal PerformanceObserver stand-in that captures each observer's type and
// lets a test emit synthetic entries into its callback.
class FakePerformanceObserver {
  static instances: FakePerformanceObserver[] = [];
  type?: string;
  constructor(private cb: (list: { getEntries: () => unknown[] }) => void) {
    FakePerformanceObserver.instances.push(this);
  }
  observe(options: { type?: string }): void {
    this.type = options.type;
  }
  disconnect(): void {
    /* no-op */
  }
  emit(entries: unknown[]): void {
    this.cb({ getEntries: () => entries });
  }
  static forType(type: string): FakePerformanceObserver | undefined {
    return FakePerformanceObserver.instances.find((o) => o.type === type);
  }
}

beforeEach(() => {
  localStorage.clear();
  resetTelemetry();
  FakePerformanceObserver.instances = [];
});

afterEach(() => {
  localStorage.clear();
  resetTelemetry();
  vi.unstubAllGlobals();
});

describe('recordWebVital', () => {
  it('routes a web-vital through telemetry, rounding the value', () => {
    optIn();
    const sink = spySink();
    init(sink);
    recordWebVital('LCP', 1234.6, 'good');
    expect(sink.events).toHaveLength(1);
    expect(sink.events[0].name).toBe('perf.web_vital');
    expect(sink.events[0].props).toEqual({ metric: 'LCP', value: 1235, rating: 'good' });
  });

  it('omits rating when not supplied and keeps CLS fractional precision', () => {
    optIn();
    const sink = spySink();
    init(sink);
    recordWebVital('CLS', 0.1);
    // CLS is a small unitless score: it must not be rounded to a whole number.
    expect(sink.events[0].props).toEqual({ metric: 'CLS', value: 0.1 });
  });

  it('is a no-op when telemetry is not opted in', () => {
    const sink = spySink();
    init(sink);
    recordWebVital('FID', 20);
    expect(sink.events).toHaveLength(0);
  });
});

describe('initPerformanceMonitoring', () => {
  it('is a safe no-op when PerformanceObserver is unavailable', () => {
    vi.stubGlobal('PerformanceObserver', undefined);
    expect(() => initPerformanceMonitoring()).not.toThrow();
  });

  it('observes LCP entries and forwards them as telemetry', () => {
    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver);
    optIn();
    const sink = spySink();
    init(sink);
    initPerformanceMonitoring();

    const lcp = FakePerformanceObserver.forType('largest-contentful-paint');
    expect(lcp).toBeDefined();
    lcp!.emit([{ startTime: 1000 }, { startTime: 2500 }]); // latest wins

    expect(sink.events).toHaveLength(1);
    expect(sink.events[0].props).toEqual({ metric: 'LCP', value: 2500 });
  });

  it('maps first-input entries to FID', () => {
    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver);
    optIn();
    const sink = spySink();
    init(sink);
    initPerformanceMonitoring();

    FakePerformanceObserver.forType('first-input')!.emit([
      { startTime: 100, processingStart: 130 },
    ]);
    expect(sink.events[0].props).toEqual({ metric: 'FID', value: 30 });
  });

  it('accumulates non-input layout shifts into a running CLS and ignores input-driven ones', () => {
    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver);
    optIn();
    const sink = spySink();
    init(sink);
    initPerformanceMonitoring();

    FakePerformanceObserver.forType('layout-shift')!.emit([
      { value: 0.05, hadRecentInput: false },
      { value: 0.9, hadRecentInput: true }, // ignored
      { value: 0.1, hadRecentInput: false },
    ]);
    // Two non-input shifts accumulate (0.05 then 0.05 + 0.1); the input-driven
    // one is skipped. The score keeps fractional precision rather than rounding to 0.
    expect(sink.events).toHaveLength(2);
    expect(sink.events[0].props).toEqual({ metric: 'CLS', value: 0.05 });
    expect(sink.events[1].props).toEqual({ metric: 'CLS', value: 0.15 });
  });

  it('maps long tasks to perf.long_task', () => {
    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver);
    optIn();
    const sink = spySink();
    init(sink);
    initPerformanceMonitoring();

    FakePerformanceObserver.forType('longtask')!.emit([{ duration: 123.7 }]);
    expect(sink.events[0].name).toBe('perf.long_task');
    expect(sink.events[0].props).toEqual({ durationMs: 124 });
  });
});
