/**
 * The shared Vercel-AI-SDK adapter body (server-only — never bundled into the
 * browser). It implements the gateway's provider seam ({@link AiProviderAdapter})
 * ONCE, in terms of an injected model factory, so every AI-SDK-backed provider
 * is a few lines of configuration rather than a copy of this logic.
 *
 * It is deliberately provider-AGNOSTIC: this file imports `ai` (the vendor-
 * neutral SDK) and nothing else. The provider packages stay in their own thin
 * adapter files — `@ai-sdk/google` in `geminiAdapter.mts`, `@ai-sdk/anthropic`
 * in `anthropicAdapter.mts` — each of which just hands this factory a model
 * resolver. Adding a third provider means one more such file plus a registry
 * entry; no call site in `src/ai/**` and no browser code changes.
 *
 * It is also SYSTEM-agnostic: the per-task schemas below describe the gateway's
 * task contracts (`AiTask`), not any one game system, and the prompt is built by
 * the shared, registry/loader-derived `buildPromptForTask`. Nothing here knows
 * that D&D 5e exists.
 *
 * RFC 002 holds unchanged: whatever comes back is a DRAFT. The gateway core
 * re-validates it with `parseTaskData`, so the schema below is an extraction
 * aid, never the authority.
 */
import {
  experimental_generateImage as generateImage,
  generateObject,
  type ImageModel,
  type LanguageModel,
} from 'ai';
import { z } from 'zod';
import type { AiTask } from '../../src/ai/contracts';
import type { AiProviderAdapter, AiTokenUsageReporter } from '../../src/ai/gatewayCore';
import { buildPromptForTask } from '../../src/ai/prompts';

/** Structured-text tasks: the model output is constrained to a per-task schema. */
const TASK_SCHEMAS: Partial<Record<AiTask, z.ZodTypeAny>> = {
  'encounter-draft': z.object({
    selections: z
      .array(z.object({ monsterId: z.string(), count: z.number().int().positive() }))
      .min(1),
    rationale: z.string().optional(),
  }),
  'scene-narration': z.object({
    narrative: z.string().min(1),
  }),
  'identify-creature': z.object({
    monsterId: z.string(),
    confidence: z.number(),
    reason: z.string().optional(),
  }),
  'character-draft': z.object({
    name: z.string().min(1),
    classId: z.string().optional(),
    ancestryId: z.string().optional(),
    backgroundId: z.string().optional(),
    featIds: z.array(z.string()).optional(),
    spellIds: z.array(z.string()).optional(),
    rationale: z.string().optional(),
  }),
};

/** Image-output tasks route to the image model instead of `generateObject`. */
const IMAGE_TASKS: ReadonlySet<AiTask> = new Set<AiTask>(['illustrate-scene']);

/**
 * Everything one AI-SDK-backed provider must supply. `languageModel` (and, for
 * providers that can generate images, `imageModel`) are the ONLY
 * provider-specific pieces; they are functions so the SDK-bound provider object
 * stays in the caller's file and this module imports no provider package.
 */
export interface AiSdkAdapterConfig {
  /** Provenance tag echoed in `AiResponse.usage.provider` (e.g. 'google'). */
  id: string;
  /** Default text/vision model id, echoed in `AiResponse.usage.model`. */
  model: string;
  /** Resolves the provider's language model for a model id. */
  languageModel: (modelId: string) => LanguageModel;
  /**
   * Image-generation model id. Omit for a provider that cannot generate images
   * — image tasks then fail honestly rather than pretending to be served.
   */
  imageModel?: string;
  /** Resolves the provider's image model. Required iff `imageModel` is set. */
  imageModelFor?: (modelId: string) => ImageModel;
}

/**
 * Pull a base64 image data URL out of a task payload, if it carries one. Vision
 * tasks put it at `payload.image.dataUrl`; structural so the adapter stays
 * task-agnostic.
 */
function imageDataUrlFromPayload(payload: unknown): string | undefined {
  if (payload && typeof payload === 'object' && 'image' in payload) {
    const image = (payload as { image?: unknown }).image;
    if (image && typeof image === 'object' && 'dataUrl' in image) {
      const dataUrl = (image as { dataUrl?: unknown }).dataUrl;
      if (typeof dataUrl === 'string') return dataUrl;
    }
  }
  return undefined;
}

/** Report the SDK's token counts through the seam, when it reported any. */
function reportTokens(
  report: AiTokenUsageReporter | undefined,
  usage: { inputTokens?: number; outputTokens?: number; totalTokens?: number } | undefined
): void {
  if (!report || !usage) return;
  report({
    ...(usage.inputTokens !== undefined ? { inputTokens: usage.inputTokens } : {}),
    ...(usage.outputTokens !== undefined ? { outputTokens: usage.outputTokens } : {}),
    ...(usage.totalTokens !== undefined ? { totalTokens: usage.totalTokens } : {}),
  });
}

/**
 * Build an {@link AiProviderAdapter} backed by the Vercel AI SDK.
 *
 * Capability differences between providers are surfaced honestly: a config with
 * no image model throws a clear error for image tasks, which the core normalizes
 * to the typed `provider-error` failure and the client degrades from — rather
 * than returning a fabricated image.
 */
export function createAiSdkAdapter(config: AiSdkAdapterConfig): AiProviderAdapter {
  const canGenerateImages = Boolean(config.imageModel && config.imageModelFor);

  return {
    id: config.id,
    model: config.model,
    // Metadata normalization: image tasks run on the image model when the
    // provider has one, so traces and usage name the model that actually served.
    modelFor: (task: AiTask) =>
      IMAGE_TASKS.has(task) && config.imageModel ? config.imageModel : config.model,

    async generate(
      task: AiTask,
      payload: unknown,
      reportUsage?: AiTokenUsageReporter
    ): Promise<unknown> {
      const prompt = buildPromptForTask(task, payload);

      if (IMAGE_TASKS.has(task)) {
        if (!canGenerateImages) {
          throw new Error(
            `Provider '${config.id}' cannot serve image task '${task}': no image model is configured.`
          );
        }
        const { image } = await generateImage({
          // Guarded by `canGenerateImages`.
          model: config.imageModelFor!(config.imageModel!),
          prompt,
        });
        return {
          dataUrl: `data:${image.mediaType};base64,${image.base64}`,
          mediaType: image.mediaType,
        };
      }

      const schema = TASK_SCHEMAS[task];
      if (!schema) throw new Error(`No provider schema for task '${task}'.`);

      const imageDataUrl = imageDataUrlFromPayload(payload);
      // Vision tasks send the prompt plus the image as a multimodal user
      // message; text-only tasks send the prompt string directly.
      const result = imageDataUrl
        ? await generateObject({
            model: config.languageModel(config.model),
            schema,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  { type: 'image', image: imageDataUrl },
                ],
              },
            ],
          })
        : await generateObject({ model: config.languageModel(config.model), schema, prompt });

      reportTokens(reportUsage, result.usage);
      return result.object;
    },
  };
}
