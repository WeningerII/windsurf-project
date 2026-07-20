/**
 * The opt-in gate. Telemetry is DISABLED BY DEFAULT: nothing is collected until
 * the user has explicitly opted in. {@link isTelemetryEnabled} is the single
 * predicate every collection path consults.
 *
 * Signals, in precedence order:
 *   1. A persisted user preference in `localStorage` (`telemetry:opt-in`). An
 *      explicit choice — true OR false — always wins, so a user who opted out
 *      stays opted out even in a build that defaults telemetry on.
 *   2. A build-time flag, `VITE_TELEMETRY_ENABLED === 'true'`, used to turn
 *      telemetry on for trusted/internal builds (preview, dogfood) when the
 *      user has expressed no preference. Mirrors `isAiEnabled()` in
 *      src/ai/gatewayClient.ts. Default OFF.
 *   3. Otherwise `false`.
 *
 * All storage access is defensive: SSR (no `window`) and privacy modes that
 * throw on `localStorage` degrade to "not enabled", never to a crash.
 */

import { isFeatureEnabled } from '../config/featureFlags';

/** localStorage key holding the user's explicit opt-in choice ('true'/'false'). */
export const OPT_IN_STORAGE_KEY = 'telemetry:opt-in';

function readStoredOptIn(): boolean | undefined {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return undefined;
    const raw = window.localStorage.getItem(OPT_IN_STORAGE_KEY);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return undefined;
  } catch {
    return undefined;
  }
}

function readBuildDefault(): boolean {
  return isFeatureEnabled('telemetry');
}

/**
 * Whether telemetry may collect at all. Default `false`; a stored user
 * preference overrides the build default in both directions.
 */
export function isTelemetryEnabled(): boolean {
  const stored = readStoredOptIn();
  if (stored !== undefined) return stored;
  return readBuildDefault();
}

/** Persist an explicit opt-in choice. No-op if storage is unavailable. */
export function setTelemetryOptIn(enabled: boolean): void {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return;
    window.localStorage.setItem(OPT_IN_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Storage disabled (e.g. private mode) — the preference simply cannot
    // persist; telemetry falls back to the build default.
  }
}

/** Forget any stored preference, reverting to the build default. */
export function clearTelemetryOptIn(): void {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return;
    window.localStorage.removeItem(OPT_IN_STORAGE_KEY);
  } catch {
    // ignore — see setTelemetryOptIn
  }
}
