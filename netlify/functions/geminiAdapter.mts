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
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import type { AiTask } from '../../src/ai/contracts';
import type { AiProviderAdapter } from '../../src/ai/gatewayCore';
import { buildPromptForTask } from '../../src/ai/prompts';

const TASK_SCHEMAS: Record<AiTask, z.ZodTypeAny> = {
  'encounter-draft': z.object({
    selections: z
      .array(z.object({ monsterId: z.string(), count: z.number().int().positive() }))
      .min(1),
    rationale: z.string().optional(),
  }),
};

const DEFAULT_MODEL = 'gemini-2.0-flash';

/** Build a Gemini-backed adapter from an explicit key (no ambient env read). */
export function createGeminiAdapter(
  apiKey: string,
  modelId: string = DEFAULT_MODEL
): AiProviderAdapter {
  const google = createGoogleGenerativeAI({ apiKey });
  return {
    id: 'google',
    model: modelId,
    async generate(task: AiTask, payload: unknown): Promise<unknown> {
      const schema = TASK_SCHEMAS[task];
      if (!schema) throw new Error(`No provider schema for task '${task}'.`);
      const { object } = await generateObject({
        model: google(modelId),
        schema,
        prompt: buildPromptForTask(task, payload),
      });
      return object;
    },
  };
}
