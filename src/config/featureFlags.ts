/**
 * Centralized, typed feature-flag layer. The app's ad-hoc boolean toggles
 * (AI affordances, telemetry build default) delegate here instead of each
 * reading `import.meta.env` inline, so the set of cross-cutting flags — their
 * env-var names and default states — lives in exactly one place.
 *
 * Semantics are deliberately identical to the predicates this replaces:
 * a flag is ON only when its env var is exactly the string `'true'`; every
 * other value (undefined, `'false'`, `'TRUE'`, `'1'`, empty) falls back to the
 * registry default, and every default is OFF. Flags are agnostic — they gate
 * app-wide capabilities, not any one game system.
 *
 * Presence-checked config STRINGS (Sentry DSN, Supabase URL/key) are NOT flags
 * and deliberately stay out of this registry.
 */

/** The set of centralized boolean feature flags. Extend as new toggles land. */
export type FeatureFlag = 'ai' | 'telemetry';

/** One registry entry: which env var drives the flag and its build default. */
export interface FeatureFlagDefinition {
  /** The `import.meta.env` key read at build time (e.g. `VITE_AI_ENABLED`). */
  readonly envVar: string;
  /** Value used when the env var is anything other than the string `'true'`. */
  readonly default: boolean;
}

/**
 * The single source of truth for every centralized flag. Each entry preserves
 * the strict-`'true'` / default-OFF contract the original inline predicates used.
 */
export const FEATURE_FLAGS: Readonly<Record<FeatureFlag, FeatureFlagDefinition>> = {
  ai: { envVar: 'VITE_AI_ENABLED', default: false },
  telemetry: { envVar: 'VITE_TELEMETRY_ENABLED', default: false },
};

/**
 * Whether a centralized feature flag is enabled. ON only when its env var is
 * exactly `'true'`; otherwise the registry default (always OFF today).
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const { envVar, default: fallback } = FEATURE_FLAGS[flag];
  const raw = import.meta.env[envVar];
  if (raw === 'true') return true;
  if (raw === undefined) return fallback;
  return false;
}
