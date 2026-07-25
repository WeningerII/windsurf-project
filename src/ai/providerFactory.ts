/**
 * Provider SELECTION for the AI gateway — pure, unit-testable, and SDK-FREE.
 *
 * This module answers exactly one question: given a provider id and whether a
 * server key is present, WHICH adapter should the gateway use? It never
 * constructs a provider-bound adapter itself. The SDK-bound builders (the only
 * code importing `@ai-sdk/google` or `@ai-sdk/anthropic`) are passed in by the
 * Netlify entry point via {@link ProviderFactoryDeps}, so no provider SDK ever
 * enters `src/ai/**` or the browser bundle. The mock adapter is SDK-free, so
 * importing it here is safe.
 *
 * Env-var NAMES (which variable holds which provider's key or model override)
 * are deliberately NOT known here — that mapping lives with the registry in
 * `netlify/functions/providerRegistry.mts`, next to the entry point that reads
 * `process.env`. This module only sees an already-resolved key.
 *
 * Default behavior is preserved exactly: with no `AI_PROVIDER` set, the gateway
 * uses Google when a server key is present and otherwise returns no adapter (the
 * core then degrades to `provider-not-configured`). `AI_PROVIDER=mock` selects a
 * key-less deterministic adapter for CI/local; `AI_PROVIDER=google` is the
 * explicit form of the default; `AI_PROVIDER=anthropic` selects the Anthropic
 * adapter, which — like Google — yields nothing without its own key.
 */
import type { AiProviderAdapter } from './gatewayCore';
import { createMockAdapter } from './mockAdapter';

export type AiProviderId = 'google' | 'anthropic' | 'mock';

export interface ProviderFactoryEnv {
  /** The canonical provider id: 'google' | 'anthropic' | 'mock' | unset. */
  provider?: string;
  /** The resolved server-side provider key (undefined when absent). */
  apiKey?: string;
}

/**
 * Zero-arg builders for the SDK-bound adapters. Each is injected (and each
 * closes over its own already-resolved key and model ids) so the SDK stays
 * confined to the Netlify function layer. A builder is only invoked when its
 * provider is selected AND a key is present.
 */
export interface ProviderFactoryDeps {
  createGoogleAdapter: () => AiProviderAdapter;
  createAnthropicAdapter: () => AiProviderAdapter;
}

/**
 * Select a provider adapter from a resolved env slice, or `undefined` when none
 * is configured. Never throws: an unrecognized provider id falls back to the
 * default (Google-if-keyed) so a typo degrades gracefully rather than breaking.
 *
 * The key-absence rule is identical for every real provider — no key, no
 * adapter, and the builder is never invoked — which is what makes key-less
 * degradation a property of the SEAM rather than of any one provider.
 */
export function selectAiProvider(
  env: ProviderFactoryEnv,
  deps: ProviderFactoryDeps
): AiProviderAdapter | undefined {
  const provider = (env.provider ?? '').trim().toLowerCase();

  if (provider === 'mock') {
    return createMockAdapter();
  }

  if (provider === 'anthropic') {
    return env.apiKey ? deps.createAnthropicAdapter() : undefined;
  }

  // 'google', unset, or unrecognized: preserve today's behavior — Google when a
  // key is present, otherwise no adapter (core returns provider-not-configured).
  return env.apiKey ? deps.createGoogleAdapter() : undefined;
}
