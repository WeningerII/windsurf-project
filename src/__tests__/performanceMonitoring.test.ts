import { beforeEach, describe, expect, it, vi } from 'vitest';

const metricCallbacks: Partial<
  Record<'cls' | 'inp' | 'fcp' | 'lcp' | 'ttfb', (metric: { value: number }) => void>
> = {};

vi.mock('web-vitals', () => ({
  onCLS: vi.fn((cb: (metric: { value: number }) => void) => {
    metricCallbacks.cls = cb;
  }),
  onINP: vi.fn((cb: (metric: { value: number }) => void) => {
    metricCallbacks.inp = cb;
  }),
  onFCP: vi.fn((cb: (metric: { value: number }) => void) => {
    metricCallbacks.fcp = cb;
  }),
  onLCP: vi.fn((cb: (metric: { value: number }) => void) => {
    metricCallbacks.lcp = cb;
  }),
  onTTFB: vi.fn((cb: (metric: { value: number }) => void) => {
    metricCallbacks.ttfb = cb;
  }),
}));

describe('performanceMonitoring', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('tracks incoming web-vitals metrics and notifies subscribers', async () => {
    const { performanceMonitor } = await import('../utils/performanceMonitoring');
    const listener = vi.fn();

    const unsubscribe = performanceMonitor.subscribe(listener);

    metricCallbacks.cls?.({ value: 0.08 });
    metricCallbacks.inp?.({ value: 180 });

    expect(performanceMonitor.getMetrics()).toMatchObject({ cls: 0.08, inp: 180 });
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    const callCountAfterUnsubscribe = listener.mock.calls.length;
    metricCallbacks.fcp?.({ value: 1000 });
    expect(listener.mock.calls.length).toBe(callCountAfterUnsubscribe);
  });

  it('returns human-readable score ratings', async () => {
    const { performanceMonitor } = await import('../utils/performanceMonitoring');

    metricCallbacks.cls?.({ value: 0.3 });
    metricCallbacks.inp?.({ value: 350 });
    metricCallbacks.fcp?.({ value: 3500 });
    metricCallbacks.lcp?.({ value: 2200 });
    metricCallbacks.ttfb?.({ value: 700 });

    const scores = performanceMonitor.getScores();
    const ratings = Object.fromEntries(scores.map((entry) => [entry.metric, entry.rating]));

    expect(ratings).toMatchObject({
      CLS: 'poor',
      INP: 'needs-improvement',
      FCP: 'poor',
      LCP: 'good',
      TTFB: 'good',
    });
  });

  it('logs metrics after the report timer elapses', async () => {
    vi.useFakeTimers();
    const { performanceMonitor, reportWebVitals } = await import('../utils/performanceMonitoring');
    const logSpy = vi.spyOn(performanceMonitor, 'logMetrics').mockImplementation(() => {});

    reportWebVitals();

    vi.advanceTimersByTime(2999);
    expect(logSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('formats pending values in logMetrics output', async () => {
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
    const { performanceMonitor } = await import('../utils/performanceMonitoring');

    performanceMonitor.logMetrics();

    expect(tableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        'Cumulative Layout Shift (CLS)': expect.any(String),
        'Interaction to Next Paint (INP)': expect.any(String),
      })
    );
  });
});
