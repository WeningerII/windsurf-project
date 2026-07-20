/**
 * Telemetry event catalog — the CLOSED set of things this app is allowed to
 * measure, and the ONLY shapes their payloads may take.
 *
 * Privacy-by-construction intent
 * ------------------------------
 * A telemetry payload may carry ONLY non-PII primitives: a `number`, a
 * `boolean`, or a `string` drawn from an ALLOWLISTED categorical enum (see
 * {@link ALLOWED_ENUM_VALUES}). Free-form strings are the primary PII-leak
 * vector — a character name, a private note, a URL carrying a session token —
 * so they are inexpressible in {@link TelemetryValue} and are stripped at
 * runtime by `sanitizeProps` in ./schema. There is no `string` escape hatch,
 * no `any`, and no nested object. Event *names* themselves are a fixed union,
 * so a caller cannot invent a new, unaudited signal either.
 *
 * This file is pure types + frozen constants: no I/O, no app imports, so it can
 * never accidentally pull user data into the schema layer.
 */

/** Web-vital-style metric identifiers this app is allowed to record. */
export const WEB_VITAL_METRICS = ['LCP', 'FID', 'CLS', 'INP', 'TTFB', 'FCP'] as const;
export type WebVitalMetric = (typeof WEB_VITAL_METRICS)[number];

/** The three standard web-vital rating buckets. */
export const WEB_VITAL_RATINGS = ['good', 'needs-improvement', 'poor'] as const;
export type WebVitalRating = (typeof WEB_VITAL_RATINGS)[number];

/**
 * Every string literal any event payload is permitted to contain. Built by
 * spreading the categorical enums above so that adding a new enum to the
 * catalog automatically extends the runtime allowlist the guard checks. Any
 * string value NOT in this set is treated as free-form (potential PII) and
 * stripped by `sanitizeProps`.
 */
export const ALLOWED_ENUM_VALUES: ReadonlySet<string> = new Set<string>([
  ...WEB_VITAL_METRICS,
  ...WEB_VITAL_RATINGS,
]);

/** Type-level mirror of {@link ALLOWED_ENUM_VALUES}. */
export type TelemetryEnumValue = WebVitalMetric | WebVitalRating;

/**
 * The only value types a telemetry payload field may hold: a number, a boolean,
 * or an allowlisted enum string. Deliberately excludes free-form `string`,
 * objects, arrays, `null`, and `undefined`.
 */
export type TelemetryValue = number | boolean | TelemetryEnumValue;

/** A payload after it has passed through the guard. Always non-PII by type. */
export type SanitizedProps = Readonly<Record<string, TelemetryValue>>;

/**
 * The closed catalog: event name -> its allowed (pre-sanitization) payload
 * shape. Payload fields are constrained to {@link TelemetryValue}s so an event
 * cannot even be authored with a free-form string.
 */
export interface TelemetryEventPayloads {
  /** App boot reached the telemetry init point. */
  'app.init': { devMode: boolean };
  /** A web-vital-style measurement. `value` is ms for LCP/FID/INP/TTFB/FCP and
   *  the unitless layout-shift score for CLS. */
  'perf.web_vital': { metric: WebVitalMetric; value: number; rating?: WebVitalRating };
  /** A main-thread long task (Long Tasks API). */
  'perf.long_task': { durationMs: number };
  /** The user changed their telemetry opt-in preference. */
  'telemetry.opt_in_changed': { enabled: boolean };
}

/** The union of valid event names — a caller cannot record anything else. */
export type TelemetryEventName = keyof TelemetryEventPayloads;

/** A recorded telemetry event: a catalog name, a sanitized payload, a timestamp. */
export interface TelemetryEvent<K extends TelemetryEventName = TelemetryEventName> {
  readonly name: K;
  /** Sanitized, non-PII payload. May be a subset of what the caller passed if
   *  the guard stripped disallowed fields. */
  readonly props: SanitizedProps;
  /** Epoch milliseconds; stamped by the recorder, never by the caller. */
  readonly ts: number;
}

/**
 * A telemetry destination. The whole delivery surface is this one method, so a
 * network transport, a dev console printer, or the shipped no-op are all
 * interchangeable. Implementations receive ALREADY-SANITIZED events — the guard
 * runs before the sink — and must never throw back into the caller.
 */
export interface TelemetrySink {
  record(event: TelemetryEvent): void;
}
