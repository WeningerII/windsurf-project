/**
 * Gemini provider adapter (server-only — never bundled into the browser).
 * Implements the gateway's provider seam with the Vercel AI SDK's structured
 * `generateObject`, so the model is constrained to a per-task schema. The
 * gateway core re-validates the result with the deterministic contract
 * validator, so this schema is an extraction aid, not the authority.
 *
 * Provider-agnostic by construction: only this file imports `@ai-sdk/google`.
 * Swapping providers later means adding a sibling adapter, not touching the
 * gateway, contracts, or client.
 */
import { experimental_generateImage as generateImage, generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import type { AiTask } from '../../src/ai/contracts';
import type { AiProviderAdapter } from '../../src/ai/gatewayCore';
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
const IMAGE_TASKS = new Set<AiTask>(['illustrate-scene']);

const DEFAULT_MODEL = 'gemini-2.0-flash';
const DEFAULT_IMAGE_MODEL = 'imagen-4.0-fast-generate-001';

/**
 * Pull a base64 image data URL out of a task payload, if it carries one. Vision
 * tasks ({@link AiImageInput}) put it at `payload.image.dataUrl`; structural so
 * the adapter stays task-agnostic.
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

/** Build a Gemini-backed adapter from an explicit key (no ambient env read). */
export function createGeminiAdapter(
  apiKey: string,
  modelId: string = DEFAULT_MODEL,
  imageModelId: string = DEFAULT_IMAGE_MODEL
): AiProviderAdapter {
  const google = createGoogleGenerativeAI({ apiKey });
  return {
    id: 'google',
    model: modelId,
    // Metadata normalization (Phase 14): image tasks run on the image model, so
    // report it — traces and usage must name the model that actually served.
    modelFor: (task: AiTask) => (IMAGE_TASKS.has(task) ? imageModelId : modelId),
    async generate(task: AiTask, payload: unknown): Promise<unknown> {
      const prompt = buildPromptForTask(task, payload);

      // Image-output tasks go to the image model and return a data URL.
      if (IMAGE_TASKS.has(task)) {
        const { image } = await generateImage({ model: google.image(imageModelId), prompt });
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
      const { object } = imageDataUrl
        ? await generateObject({
            model: google(modelId),
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
        : await generateObject({ model: google(modelId), schema, prompt });
      return object;
    },
  };
}
