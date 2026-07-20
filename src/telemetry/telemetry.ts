/**
 * Telemetry core — the small public runtime that ties the catalog, guard,
 * opt-in gate, bounded buffer, and pluggable sink together.
 *
 * Contract, in order, for every {@link track} call:
 *   1. OPT-IN GATE — if `isTelemetryEnabled()` is false, return immediately.
 *      Nothing is sanitized, buffered, or forwarded. Default: disabled.
 *   2. SANITIZE — run the payload through the guard so only non-PII primitives
 *      survive (see ./schema).
 *   3. BUFFER — push the event into a fixed-capacity ring (drops oldest).
 *   4. FORWARD — hand the event to the installed sink; a throwing sink is
 *      swallowed so telemetry can never affect UX.
 *
 * Telemetry is best-effort and side-channel: it must never throw into, slow, or
 * otherwise change the behavior of the code that calls it.
 */
import { RingBuffer } from './buffer';
import type {
  TelemetryEvent,
  TelemetryEventName,
  TelemetryEventPayloads,
  TelemetrySink,
} from './events';
import { isTelemetryEnabled } from './gate';
import { sanitizeProps } from './schema';
import { noopSink } from './sinks';

/** In-memory retention cap. Matches the errorLogger `maxLogs` convention. */
export const BUFFER_CAPACITY = 100;

let sink: TelemetrySink = noopSink;
const buffer = new RingBuffer<TelemetryEvent>(BUFFER_CAPACITY);

/**
 * Install the delivery sink. Call once at startup (see src/main.tsx). Omitting
 * the argument (re)installs the no-op default, which is the shipped behavior.
 */
export function init(nextSink: TelemetrySink = noopSink): void {
  sink = nextSink;
}

/**
 * Record a catalog event. A no-op unless the user has opted in. The payload is
 * sanitized to non-PII primitives before it is buffered or forwarded.
 */
export function track<K extends TelemetryEventName>(
  name: K,
  props: TelemetryEventPayloads[K]
): void {
  if (!isTelemetryEnabled()) return; // opt-in gate — no collection when disabled
  const event: TelemetryEvent<K> = {
    name,
    props: sanitizeProps(props),
    ts: Date.now(),
  };
  buffer.push(event);
  try {
    sink.record(event);
  } catch {
    // A faulty sink must never break the caller. Telemetry is best-effort.
  }
}

/** Snapshot of the currently buffered events, oldest first. */
export function getBufferedEvents(): readonly TelemetryEvent[] {
  return buffer.toArray();
}

/** The sink currently installed (defaults to the no-op sink). */
export function getActiveSink(): TelemetrySink {
  return sink;
}

/**
 * Reset the module to its shipped default: no-op sink, empty buffer. Intended
 * for tests and HMR — not part of the normal runtime flow.
 */
export function resetTelemetry(): void {
  sink = noopSink;
  buffer.clear();
}
