import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  BUFFER_CAPACITY,
  getActiveSink,
  getBufferedEvents,
  init,
  noopSink,
  resetTelemetry,
  track,
} from '../../telemetry';
import { OPT_IN_STORAGE_KEY } from '../../telemetry/gate';
import type { TelemetryEvent, TelemetrySink } from '../../telemetry';

function optIn(): void {
  localStorage.setItem(OPT_IN_STORAGE_KEY, 'true');
}

function spySink(): TelemetrySink & { events: TelemetryEvent[] } {
  const events: TelemetryEvent[] = [];
  return { events, record: (e) => events.push(e) };
}

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllEnvs();
  resetTelemetry();
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllEnvs();
  resetTelemetry();
});

describe('default state', () => {
  it('installs the no-op sink by default', () => {
    expect(getActiveSink()).toBe(noopSink);
  });

  it('buffers nothing before anything is tracked', () => {
    expect(getBufferedEvents()).toHaveLength(0);
  });
});

describe('track — opt-in gate', () => {
  it('is a NO-OP when telemetry is not opted in: sink never called, buffer stays empty', () => {
    const sink = spySink();
    init(sink);
    // not opted in (default)
    track('app.init', { devMode: true });
    track('perf.web_vital', { metric: 'LCP', value: 1200 });
    expect(sink.events).toHaveLength(0);
    expect(getBufferedEvents()).toHaveLength(0);
  });

  it('collects once opted in: buffers and forwards to the sink', () => {
    optIn();
    const sink = spySink();
    init(sink);
    track('app.init', { devMode: false });
    expect(sink.events).toHaveLength(1);
    expect(getBufferedEvents()).toHaveLength(1);
    const event = sink.events[0];
    expect(event.name).toBe('app.init');
    expect(event.props).toEqual({ devMode: false });
    expect(typeof event.ts).toBe('number');
  });
});

describe('track — sanitization is applied end-to-end', () => {
  it('strips PII/free-form fields before buffering or forwarding', () => {
    optIn();
    const sink = spySink();
    init(sink);
    // A caller that (incorrectly) smuggles PII / free-form values in. Cast via
    // `any` so the compiler lets the disallowed fields through and we can prove
    // the RUNTIME guard strips them.
    track('perf.web_vital', {
      metric: 'LCP',
      value: 1200,
      userId: 99,
      note: 'private',
    } as any);
    expect(sink.events[0].props).toEqual({ metric: 'LCP', value: 1200 });
    expect(getBufferedEvents()[0].props).toEqual({ metric: 'LCP', value: 1200 });
  });
});

describe('track — the no-op default sink observably records nothing', () => {
  it('routes through noopSink without error and leaves only the in-memory buffer', () => {
    optIn();
    init(); // default no-op sink
    expect(getActiveSink()).toBe(noopSink);
    expect(() => track('telemetry.opt_in_changed', { enabled: true })).not.toThrow();
    // Buffered in memory, but the sink itself emits nothing outward.
    expect(getBufferedEvents()).toHaveLength(1);
  });
});

describe('track — bounded buffer via the public API', () => {
  it('never grows past BUFFER_CAPACITY, dropping oldest', () => {
    optIn();
    init(noopSink);
    for (let i = 0; i < BUFFER_CAPACITY + 50; i += 1) {
      track('perf.long_task', { durationMs: i });
    }
    const buffered = getBufferedEvents();
    expect(buffered).toHaveLength(BUFFER_CAPACITY);
    // Oldest (durationMs 0..49) were dropped; newest survives.
    expect(buffered[buffered.length - 1].props).toEqual({ durationMs: BUFFER_CAPACITY + 49 });
  });
});

describe('track — resilience', () => {
  it('swallows a throwing sink and still buffers the event', () => {
    optIn();
    init({
      record() {
        throw new Error('sink boom');
      },
    });
    expect(() => track('app.init', { devMode: true })).not.toThrow();
    expect(getBufferedEvents()).toHaveLength(1);
  });
});
