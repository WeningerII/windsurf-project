/**
 * Provider REGISTRY for the AI gateway — a small, provider-agnostic lookup that
 * resolves an {@link AiProviderAdapter} from an env var (`AI_PROVIDER`, default
 * `gemini`) at request time. It sits in the Netlify function layer (not the
 * browser bundle) and is a thin extension of the SDK-free provider factory
 * (`selectAiProvider`, commit 7a3fc31): the registry decides WHICH entry handles
 * a provider id; each entry's `build` still delegates the actual, tested
 * key-absence degradation to `selectAiProvider`.
 *
 * The provider-SDK boundary is unchanged: this file imports no provider SDK. The
 * only SDK-bound builder (`createGeminiAdapter`, which imports `@ai-sdk/google`)
 * is injected via {@link ProviderRegistryDeps} by the Netlify entry point, so the
 * registry stays pure and unit-testable with a fake builder — no network, no key.
 *
 * Default posture is preserved EXACTLY: with `AI_PROVIDER` unset the registry
 * selects the Gemini entry, which yields the Google adapter when a server key is
 * present and otherwise `undefined` (the core then returns
 * `provider-not-configured` and the client falls back to the manual tools).
 */
import type { AiProviderAdapter } from '../../src/ai/gatewayCore';
import { selectAiProvider } from '../../src/ai/providerFactory';

/** The provider selected when `AI_PROVIDER` is unset or blank. */
export const DEFAULT_AI_PROVIDER = 'gemini';

/** Env inputs a provider entry may read. All optional; sourced from `process.env`. */
export interface ProviderRegistryEnv {
  /** The `AI_PROVIDER` knob (e.g. 'gemini' | 'google' | 'mock' | unset). */
  provider?: string;
  /** The resolved server-side provider key, or undefined when absent. */
  apiKey?: string;
}

/**
 * Injected builders for SDK-bound adapters. Keeps every provider SDK confined to
 * the Netlify entry point; the registry itself never imports one.
 */
export interface ProviderRegistryDeps {
  /**
   * Builds the real Google/Gemini adapter (the only code importing
   * `@ai-sdk/google`). Only invoked when the Gemini entry is selected AND a key
   * is present, so its closure may safely assume the key exists.
   */
  createGoogleAdapter: () => AiProviderAdapter;
}

/**
 * Resolves an adapter for one provider id, or `undefined` when that provider is
 * selected but not usable in the current environment (e.g. no key). Never throws.
 */
export type ProviderBuild = (
  env: ProviderRegistryEnv,
  deps: ProviderRegistryDeps
) => AiProviderAdapter | undefined;

/** One registry entry: a canonical id, optional aliases, and its builder. */
export interface ProviderRegistration {
  /** Canonical, lowercase provider id (e.g. 'gemini'). */
  id: string;
  /** Alternate ids that resolve to this entry (e.g. 'google' -> 'gemini'). */
  aliases?: readonly string[];
  build: ProviderBuild;
}

/**
 * Built-in entries. Both delegate to `selectAiProvider` so the tested
 * key-absence degradation is reused verbatim rather than re-implemented:
 *
 * - `gemini` (alias `google`): the Google adapter when a key is present, else
 *   `undefined` — today's default behavior.
 * - `mock`: the SDK-free deterministic adapter, key-less, for CI/local.
 */
const GEMINI_REGISTRATION: ProviderRegistration = {
  id: 'gemini',
  aliases: ['google'],
  build: (env, deps) =>
    selectAiProvider(
      { provider: 'google', apiKey: env.apiKey },
      { createGoogleAdapter: deps.createGoogleAdapter }
    ),
};

const MOCK_REGISTRATION: ProviderRegistration = {
  id: 'mock',
  build: (_env, deps) =>
    selectAiProvider({ provider: 'mock' }, { createGoogleAdapter: deps.createGoogleAdapter }),
};

/** The default built-in registrations, in registration order. */
export const BUILT_IN_PROVIDERS: readonly ProviderRegistration[] = [
  GEMINI_REGISTRATION,
  MOCK_REGISTRATION,
];

/**
 * Build a case-insensitive lookup keyed by each entry's id and aliases. Later
 * registrations win on key collisions, so callers can override a built-in by
 * appending a registration with the same id.
 */
export function createProviderRegistry(
  registrations: readonly ProviderRegistration[] = BUILT_IN_PROVIDERS
): Map<string, ProviderRegistration> {
  const registry = new Map<string, ProviderRegistration>();
  for (const reg of registrations) {
    registry.set(reg.id.toLowerCase(), reg);
    for (const alias of reg.aliases ?? []) registry.set(alias.toLowerCase(), reg);
  }
  return registry;
}

/** The default registry (Gemini + mock). */
export const DEFAULT_PROVIDER_REGISTRY = createProviderRegistry();

/**
 * Resolve a provider adapter from env via the registry. An unset/blank
 * `AI_PROVIDER` selects {@link DEFAULT_AI_PROVIDER}; an unrecognized value falls
 * back to it too, so a typo degrades gracefully (matching `selectAiProvider`).
 * Returns `undefined` when the selected provider is not usable (e.g. no key),
 * which the core maps to `provider-not-configured`.
 */
export function resolveProviderAdapter(
  env: ProviderRegistryEnv,
  deps: ProviderRegistryDeps,
  registry: Map<string, ProviderRegistration> = DEFAULT_PROVIDER_REGISTRY
): AiProviderAdapter | undefined {
  const requested = (env.provider ?? '').trim().toLowerCase();
  const key = requested || DEFAULT_AI_PROVIDER;
  const entry = registry.get(key) ?? registry.get(DEFAULT_AI_PROVIDER);
  // The default entry is always present in any registry built from the built-ins;
  // guard anyway so a hand-built registry missing it degrades to no-adapter.
  return entry?.build(env, deps);
}
