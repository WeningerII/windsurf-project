/**
 * Provider REGISTRY for the AI gateway — the provider-agnostic lookup that turns
 * server configuration into an {@link AiProviderAdapter} at request time.
 *
 * It owns two things the rest of the gateway must not know:
 *
 *  1. **Which provider ids exist** (`AI_PROVIDER`, default `gemini`), plus their
 *     aliases, so an operator can swap providers without a code change.
 *  2. **Which environment variables hold each provider's key and model
 *     overrides.** Declaring those names ON the registration is what keeps
 *     `ai-gateway.mts` provider-neutral: the entry point hands over
 *     `process.env` and never mentions `GEMINI_API_KEY` or `ANTHROPIC_API_KEY`.
 *
 * The provider-SDK boundary is unchanged: this file imports no provider SDK.
 * The SDK-bound builders (`createGeminiAdapter` → `@ai-sdk/google`,
 * `createAnthropicAdapter` → `@ai-sdk/anthropic`) are injected via
 * {@link ProviderRegistryDeps} by the Netlify entry point, so the registry stays
 * pure and unit-testable with fake builders — no network, no key. Each entry's
 * `build` still delegates the actual, tested key-absence degradation to
 * `selectAiProvider`, so that rule lives in exactly one place.
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

/** The env var naming the provider. */
export const AI_PROVIDER_ENV_VAR = 'AI_PROVIDER';

/**
 * The server environment slice the registry reads: a plain string map, so the
 * entry point can pass `process.env` and tests can pass a literal.
 */
export type ProviderEnv = Readonly<Record<string, string | undefined>>;

/**
 * What an SDK-bound builder needs: an already-resolved key plus optional model
 * overrides. Never read from ambient env — the registry resolves both from the
 * registration's declared var names and hands them over explicitly.
 */
export interface ProviderModelConfig {
  apiKey: string;
  /** Text/vision model id override, or undefined for the adapter's default. */
  model?: string;
  /** Image model id override, or undefined. Ignored by text-only providers. */
  imageModel?: string;
}

/**
 * Injected builders for SDK-bound adapters. Keeps every provider SDK confined to
 * the Netlify entry point; the registry itself never imports one. Adding a
 * provider adds one field here, one registration below, and one adapter file —
 * and touches nothing in `src/ai/**`.
 */
export interface ProviderRegistryDeps {
  createGoogleAdapter: (config: ProviderModelConfig) => AiProviderAdapter;
  createAnthropicAdapter: (config: ProviderModelConfig) => AiProviderAdapter;
}

/** The env values a registration resolved for its provider, before building. */
export interface ResolvedProviderEnv {
  /** The provider key, or undefined when none of the declared vars is set. */
  apiKey?: string;
  model?: string;
  imageModel?: string;
}

/**
 * Resolves an adapter for one provider id, or `undefined` when that provider is
 * selected but not usable in the current environment (e.g. no key). Never throws.
 */
export type ProviderBuild = (
  env: ResolvedProviderEnv,
  deps: ProviderRegistryDeps
) => AiProviderAdapter | undefined;

/** One registry entry: a canonical id, aliases, its env-var names, and builder. */
export interface ProviderRegistration {
  /** Canonical, lowercase provider id (e.g. 'gemini'). */
  id: string;
  /** Alternate ids that resolve to this entry (e.g. 'google' -> 'gemini'). */
  aliases?: readonly string[];
  /**
   * Env vars that may hold this provider's key, in precedence order. Empty for
   * a key-less provider (the mock).
   */
  keyEnvVars: readonly string[];
  /** Env var holding a text/vision model override, if the provider takes one. */
  modelEnvVar?: string;
  /** Env var holding an image model override, if the provider generates images. */
  imageModelEnvVar?: string;
  build: ProviderBuild;
}

/**
 * Built-in entries. All delegate to `selectAiProvider` so the tested
 * key-absence degradation is reused verbatim rather than re-implemented:
 *
 * - `gemini` (alias `google`): the Google adapter when a key is present, else
 *   `undefined` — today's default behavior, unchanged.
 * - `anthropic` (alias `claude`): the Anthropic adapter when its own key is
 *   present, else `undefined` — the identical rule, which is the point.
 * - `mock`: the SDK-free deterministic adapter, key-less, for CI/local.
 */
const GEMINI_REGISTRATION: ProviderRegistration = {
  id: 'gemini',
  aliases: ['google'],
  keyEnvVars: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GEMINI_API_KEY'],
  modelEnvVar: 'AI_GATEWAY_MODEL',
  imageModelEnvVar: 'AI_IMAGE_MODEL',
  build: (env, deps) =>
    selectAiProvider(
      { provider: 'google', apiKey: env.apiKey },
      {
        // Only invoked when Google is selected AND a key is present, so the
        // non-null assertion is safe (and is the seam's key-absence contract).
        createGoogleAdapter: () =>
          deps.createGoogleAdapter({
            apiKey: env.apiKey as string,
            model: env.model,
            imageModel: env.imageModel,
          }),
        createAnthropicAdapter: () =>
          deps.createAnthropicAdapter({ apiKey: env.apiKey as string, model: env.model }),
      }
    ),
};

const ANTHROPIC_REGISTRATION: ProviderRegistration = {
  id: 'anthropic',
  aliases: ['claude'],
  keyEnvVars: ['ANTHROPIC_API_KEY'],
  modelEnvVar: 'AI_ANTHROPIC_MODEL',
  build: (env, deps) =>
    selectAiProvider(
      { provider: 'anthropic', apiKey: env.apiKey },
      {
        createGoogleAdapter: () =>
          deps.createGoogleAdapter({ apiKey: env.apiKey as string, model: env.model }),
        createAnthropicAdapter: () =>
          deps.createAnthropicAdapter({ apiKey: env.apiKey as string, model: env.model }),
      }
    ),
};

const MOCK_REGISTRATION: ProviderRegistration = {
  id: 'mock',
  keyEnvVars: [],
  build: (env, deps) =>
    selectAiProvider(
      { provider: 'mock' },
      {
        createGoogleAdapter: () => deps.createGoogleAdapter({ apiKey: env.apiKey as string }),
        createAnthropicAdapter: () => deps.createAnthropicAdapter({ apiKey: env.apiKey as string }),
      }
    ),
};

/** The default built-in registrations, in registration order. */
export const BUILT_IN_PROVIDERS: readonly ProviderRegistration[] = [
  GEMINI_REGISTRATION,
  ANTHROPIC_REGISTRATION,
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

/** The default registry (Gemini + Anthropic + mock). */
export const DEFAULT_PROVIDER_REGISTRY = createProviderRegistry();

/** First non-blank value among `names`, read from the server environment. */
function firstEnvValue(env: ProviderEnv, names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = env[name];
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return undefined;
}

/** Resolve one registration's declared env vars into its build inputs. */
function resolveEnvFor(registration: ProviderRegistration, env: ProviderEnv): ResolvedProviderEnv {
  return {
    apiKey: firstEnvValue(env, registration.keyEnvVars),
    model: registration.modelEnvVar ? firstEnvValue(env, [registration.modelEnvVar]) : undefined,
    imageModel: registration.imageModelEnvVar
      ? firstEnvValue(env, [registration.imageModelEnvVar])
      : undefined,
  };
}

/**
 * Resolve a provider adapter from the server environment via the registry. An
 * unset/blank `AI_PROVIDER` selects {@link DEFAULT_AI_PROVIDER}; an unrecognized
 * value falls back to it too, so a typo degrades gracefully rather than breaking
 * a deploy. Returns `undefined` when the selected provider is not usable (e.g.
 * no key for it), which the core maps to `provider-not-configured`.
 *
 * Note the key is resolved from the SELECTED provider's own env vars: setting
 * only `ANTHROPIC_API_KEY` while leaving `AI_PROVIDER` unset still yields no
 * adapter, because the default provider is Gemini and Gemini has no key. That
 * is deliberate — provider choice is explicit configuration, never inferred
 * from which secret happens to be present.
 */
export function resolveProviderAdapter(
  env: ProviderEnv,
  deps: ProviderRegistryDeps,
  registry: Map<string, ProviderRegistration> = DEFAULT_PROVIDER_REGISTRY
): AiProviderAdapter | undefined {
  const requested = (env[AI_PROVIDER_ENV_VAR] ?? '').trim().toLowerCase();
  const key = requested || DEFAULT_AI_PROVIDER;
  const entry = registry.get(key) ?? registry.get(DEFAULT_AI_PROVIDER);
  // The default entry is always present in any registry built from the built-ins;
  // guard anyway so a hand-built registry missing it degrades to no-adapter.
  if (!entry) return undefined;
  return entry.build(resolveEnvFor(entry, env), deps);
}
