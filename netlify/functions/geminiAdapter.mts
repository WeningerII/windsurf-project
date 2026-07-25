/**
 * Google/Gemini provider adapter (server-only — never bundled into the browser).
 *
 * One of two things live here and nowhere else: the `@ai-sdk/google` import, and
 * Gemini's default model ids. Everything else — task schemas, prompt building,
 * vision handling, token-usage reporting, error semantics — comes from the
 * shared, provider-agnostic `createAiSdkAdapter`, so this file cannot drift from
 * the sibling Anthropic adapter.
 *
 * This is still the gateway's DEFAULT provider: with `AI_PROVIDER` unset and a
 * Google key present, this is the adapter that serves.
 */
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAiSdkAdapter } from './aiSdkAdapter.mts';
import type { ProviderModelConfig } from './providerRegistry.mts';
import type { AiProviderAdapter } from '../../src/ai/gatewayCore';

const DEFAULT_MODEL = 'gemini-2.0-flash';
const DEFAULT_IMAGE_MODEL = 'imagen-4.0-fast-generate-001';

/**
 * Build a Gemini-backed adapter from an explicit key (no ambient env read — the
 * entry point owns `process.env`, per the adapter contract).
 */
export function createGeminiAdapter(config: ProviderModelConfig): AiProviderAdapter {
  const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
  return createAiSdkAdapter({
    id: 'google',
    model: config.model || DEFAULT_MODEL,
    languageModel: (modelId) => google(modelId),
    imageModel: config.imageModel || DEFAULT_IMAGE_MODEL,
    imageModelFor: (modelId) => google.image(modelId),
  });
}
