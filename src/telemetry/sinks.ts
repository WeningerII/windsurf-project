/**
 * Telemetry sinks — the pluggable delivery seam. A sink is just
 * `{ record(event): void }` (see {@link TelemetrySink}), so the shipped no-op,
 * a dev console printer, and a future network transport are interchangeable and
 * chosen at `init()` time.
 */
import type { TelemetryEvent, TelemetrySink } from './events';

/**
 * The DEFAULT sink: records nothing. Telemetry ships inert — until a real sink
 * is installed via `init()`, tracked events are sanitized and buffered
 * in-memory but leave no other trace. This is what keeps the default build a
 * pure no-op.
 */
export const noopSink: TelemetrySink = {
  record(): void {
    /* intentionally empty — the no-op default */
  },
};

/**
 * A DEV-ONLY sink that prints events to the console. Handy for eyeballing the
 * pipeline locally; never wire it in as the production default.
 */
export function createConsoleSink(): TelemetrySink {
  return {
    record(event: TelemetryEvent): void {
      // eslint-disable-next-line no-console -- dev-only telemetry trace; opt-in gated and never the shipped default sink.
      console.log(`[telemetry] ${event.name}`, event.props);
    },
  };
}

/*
 * NETWORK SINK SEAM — intentionally NOT implemented (infra-blocked, out of
 * scope for this wave).
 *
 * Delivering events to a hosted analytics sink needs an endpoint + credentials
 * that do not exist yet. When they do, add here:
 *
 *   export function createBeaconSink(endpoint: string): TelemetrySink
 *
 * It should batch events and ship them with `navigator.sendBeacon` (or a
 * `keepalive` fetch), sending ONLY already-sanitized events (the guard runs
 * before the sink), and it must fail closed on transport errors — degrade, do
 * not throw, mirroring the contract in src/ai/gatewayClient.ts. No `fetch` is
 * added in this scaffold, so the default build makes ZERO telemetry network
 * calls.
 */
