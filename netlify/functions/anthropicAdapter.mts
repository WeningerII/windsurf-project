/**
 * Anthropic/Claude provider adapter (server-only — never bundled into the
 * browser). The second real provider behind the gateway's seam, and the proof
 * that the seam is a seam: it is the same shape as `geminiAdapter.mts`, reuses
 * the same `createAiSdkAdapter` body, and is selected purely by configuration
 * (`AI_PROVIDER=anthropic` + `ANTHROPIC_API_KEY`).
 *
 * Only this file imports `@ai-sdk/anthropic`.
 *
 * CAPABILITY DIFFERENCE, stated honestly: Anthropic's API has no image-
 * GENERATION endpoint, so no image model is configured here. The
 * `illustrate-scene` task therefore fails on this provider with a clear
 * provider error (normalized to the typed `provider-error` failure, HTTP 502)
 * and the client falls back to its manual tools — exactly as it does for any
 * other provider failure. It is NOT faked, and the other five tasks
 * (`encounter-draft`, `scene-narration`, `character-draft`, and the two vision
 * tasks `identify-creature` and `analyze-map`, both of which Claude's vision
 * covers) are served normally.
 */
import { createAnthropic } from '@ai-sdk/anthropic';
import { createAiSdkAdapter } from './aiSdkAdapter.mts';
import type { ProviderModelConfig } from './providerRegistry.mts';
import type { AiProviderAdapter } from '../../src/ai/gatewayCore';

/**
 * Default model when `AI_ANTHROPIC_MODEL` is unset. Deployments that want a
 * cheaper or faster tier set that env var; nothing in the gateway pins a tier.
 */
const DEFAULT_MODEL = 'claude-opus-5';

/**
 * Build an Anthropic-backed adapter from an explicit key (no ambient env read —
 * the entry point owns `process.env`, per the adapter contract).
 */
export function createAnthropicAdapter(config: ProviderModelConfig): AiProviderAdapter {
  const anthropic = createAnthropic({ apiKey: config.apiKey });
  return createAiSdkAdapter({
    id: 'anthropic',
    model: config.model || DEFAULT_MODEL,
    languageModel: (modelId) => anthropic(modelId),
    // No imageModel: see the capability note above.
  });
}
