/**
 * Provider selection for the AI gateway — pure, unit-testable, and SDK-FREE.
 *
 * This module chooses WHICH adapter to use; it never constructs a provider-bound
 * one itself. The real Gemini builder (the only code that imports `@ai-sdk/google`)
 * is passed in by the Netlify entry point via {@link ProviderFactoryDeps}, so no
 * provider SDK ever enters `src/ai/**` or the browser bundle. The mock adapter is
 * SDK-free, so importing it here is safe.
 *
 * Default behavior is preserved exactly: with no `AI_PROVIDER` set, the gateway
 * uses Google when a server key is present and otherwise returns no adapter (the
 * core then degrades to `provider-not-configured`). `AI_PROVIDER=mock` selects a
 * key-less deterministic adapter for CI/local; `AI_PROVIDER=google` is the
 * explicit form of the default.
 */
import type { AiProviderAdapter } from './gatewayCore';
import { createMockAdapter } from './mockAdapter';

export type AiProviderId = 'google' | 'mock';

export interface ProviderFactoryEnv {
  /** The `AI_PROVIDER` knob: 'google' | 'mock' | unset. */
  provider?: string;
  /** The resolved server-side provider key (undefined when absent). */
  apiKey?: string;
}

export interface ProviderFactoryDeps {
  /**
   * Builds the real Google adapter. Injected so the SDK stays confined to the
   * Netlify function; only called when Google is selected AND a key is present.
   */
  createGoogleAdapter: () => AiProviderAdapter;
}

/**
 * Select a provider adapter from env, or `undefined` when none is configured.
 * Never throws: an unrecognized `AI_PROVIDER` falls back to the default
 * (Google-if-keyed) so a typo degrades gracefully rather than breaking.
 */
export function selectAiProvider(
  env: ProviderFactoryEnv,
  deps: ProviderFactoryDeps
): AiProviderAdapter | undefined {
  const provider = (env.provider ?? '').trim().toLowerCase();

  if (provider === 'mock') {
    return createMockAdapter();
  }

  // 'google', unset, or unrecognized: preserve today's behavior — Google when a
  // key is present, otherwise no adapter (core returns provider-not-configured).
  return env.apiKey ? deps.createGoogleAdapter() : undefined;
}
