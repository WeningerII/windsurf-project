/**
 * Privacy-respecting, OPT-IN, no-PII client telemetry (Phase-5 scaffold).
 *
 * Public surface for the app. The pipeline is: opt-in gate -> guard (strips
 * PII/free-form values by construction) -> bounded in-memory buffer ->
 * pluggable sink (default no-op; NO network sink yet — infra-blocked, see the
 * documented seam in ./sinks). Nothing is collected until the user opts in.
 *
 * Typical wiring lives in src/main.tsx:
 *   if (isTelemetryEnabled()) { init(); track('app.init', { devMode: import.meta.env.DEV }); }
 */

// Catalog + types
export { ALLOWED_ENUM_VALUES, WEB_VITAL_METRICS, WEB_VITAL_RATINGS } from './events';
export type {
  SanitizedProps,
  TelemetryEnumValue,
  TelemetryEvent,
  TelemetryEventName,
  TelemetryEventPayloads,
  TelemetrySink,
  TelemetryValue,
  WebVitalMetric,
  WebVitalRating,
} from './events';

// Guard
export { isPiiKey, MAX_PROP_KEYS, sanitizeProps, sanitizeValue } from './schema';

// Opt-in gate
export {
  clearTelemetryOptIn,
  isTelemetryEnabled,
  OPT_IN_STORAGE_KEY,
  setTelemetryOptIn,
} from './gate';

// Bounded buffer (exported for reuse/tests)
export { RingBuffer } from './buffer';

// Sinks
export { createConsoleSink, noopSink } from './sinks';

// Core runtime
export {
  BUFFER_CAPACITY,
  getActiveSink,
  getBufferedEvents,
  init,
  resetTelemetry,
  track,
} from './telemetry';
