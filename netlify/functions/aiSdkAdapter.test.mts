/**
 * Protocol tests for the shared Vercel-AI-SDK adapter body — the code every
 * AI-SDK-backed provider (Gemini today, Anthropic today, a third tomorrow)
 * runs. They exercise the REAL `generateObject` / `generateImage` call path
 * with the SDK's own `MockLanguageModelV3` / `MockImageModelV3` in place of a
 * network model, so CI proves the adapter's behavior with **no API key and no
 * live provider call** (the RFC 002 acceptance bar).
 *
 * What is proven here: the prompt handed to the model is the shared,
 * registry/loader-derived one; vision tasks send a multimodal message; token
 * usage flows back through the seam's reporter; and a text-only provider fails
 * image tasks honestly instead of fabricating an image.
 *
 * Imported APIs are referenced explicitly (not via test globals) so the file
 * also typechecks under `tsconfig.netlify.json` (node-only ambient types).
 */
import { describe, it, expect } from 'vitest';
import { MockImageModelV3, MockLanguageModelV3 } from 'ai/test';
import type { AiTokenUsage } from '../../src/ai/contracts';
import { createAiSdkAdapter } from './aiSdkAdapter.mts';

/**
 * The shape of a recorded model prompt, structurally. Declared locally rather
 * than imported so the test binds to the wire shape it actually asserts on,
 * independent of which `@ai-sdk/provider` copy a given tsconfig resolves.
 */
type RecordedMessage = { role: string; content: unknown };
type RecordedPrompt = readonly RecordedMessage[];

/**
 * A language model that answers with `object` and records what it was asked.
 * Captures the real V3 prompt so tests assert on the actual wire shape.
 */
function recordingModel(object: unknown, tokens = { input: 11, output: 22 }) {
  const seen: RecordedPrompt[] = [];
  const model = new MockLanguageModelV3({
    doGenerate: async (options) => {
      seen.push(options.prompt as RecordedPrompt);
      return {
        // `as const` keeps the literals narrow: the mock's constructor option is
        // a union, so TS does not contextually type this object for us.
        finishReason: { unified: 'stop' as const, raw: undefined },
        usage: {
          inputTokens: {
            total: tokens.input,
            noCache: undefined,
            cacheRead: undefined,
            cacheWrite: undefined,
          },
          outputTokens: { total: tokens.output, text: undefined, reasoning: undefined },
        },
        content: [{ type: 'text' as const, text: JSON.stringify(object) }],
        warnings: [],
      };
    },
  });
  return { model, seen };
}

/** Flatten every text part of a recorded prompt into one searchable string. */
function promptText(prompt: RecordedPrompt): string {
  return prompt
    .flatMap((message) =>
      Array.isArray(message.content)
        ? (message.content as Array<{ type: string; text?: string }>).map((part) =>
            part.type === 'text' ? (part.text ?? '') : ''
          )
        : [String(message.content)]
    )
    .join('\n');
}

const ENCOUNTER_PAYLOAD = {
  systemId: 'pf2e',
  partyLevels: [3, 3],
  difficulty: 'moderate',
  prompt: 'ambush in the reeds',
  candidates: [{ id: 'pf2e-goblin-warrior', name: 'Goblin Warrior', challengeRating: 1 }],
};

describe('shared AI-SDK adapter — structured text tasks', () => {
  it('sends the shared loader-derived prompt and returns the model object', async () => {
    const { model, seen } = recordingModel({
      selections: [{ monsterId: 'pf2e-goblin-warrior', count: 3 }],
    });
    const adapter = createAiSdkAdapter({
      id: 'test-provider',
      model: 'test-text-model',
      languageModel: () => model,
    });

    const output = await adapter.generate('encounter-draft', ENCOUNTER_PAYLOAD);

    expect(output).toEqual({ selections: [{ monsterId: 'pf2e-goblin-warrior', count: 3 }] });
    expect(seen).toHaveLength(1);
    // The candidate id the loader supplied is in the prompt, and nothing
    // system-specific was injected by the adapter itself.
    expect(promptText(seen[0]!)).toContain('pf2e-goblin-warrior');
    expect(promptText(seen[0]!)).toContain('ambush in the reeds');
  });

  it('reports provider token usage through the seam reporter', async () => {
    const { model } = recordingModel(
      { selections: [{ monsterId: 'pf2e-goblin-warrior', count: 1 }] },
      { input: 101, output: 7 }
    );
    const adapter = createAiSdkAdapter({
      id: 'test-provider',
      model: 'test-text-model',
      languageModel: () => model,
    });

    const reported: AiTokenUsage[] = [];
    await adapter.generate('encounter-draft', ENCOUNTER_PAYLOAD, (u) => reported.push(u));

    expect(reported).toEqual([{ inputTokens: 101, outputTokens: 7, totalTokens: 108 }]);
  });

  it('works without a reporter (the reporter argument is optional)', async () => {
    const { model } = recordingModel({ narrative: 'The reeds parted.' });
    const adapter = createAiSdkAdapter({
      id: 'test-provider',
      model: 'test-text-model',
      languageModel: () => model,
    });
    await expect(adapter.generate('scene-narration', { facts: 'a scouting run' })).resolves.toEqual(
      { narrative: 'The reeds parted.' }
    );
  });

  it('sends vision tasks as a multimodal message carrying the image', async () => {
    const dataUrl = 'data:image/png;base64,AQID';
    const { model, seen } = recordingModel({ monsterId: 'pf2e-goblin-warrior', confidence: 0.4 });
    const adapter = createAiSdkAdapter({
      id: 'test-provider',
      model: 'test-text-model',
      languageModel: () => model,
    });

    await adapter.generate('identify-creature', {
      candidates: [{ id: 'pf2e-goblin-warrior', name: 'Goblin Warrior' }],
      image: { dataUrl },
    });

    const parts = seen[0]![0]!.content;
    expect(Array.isArray(parts)).toBe(true);
    const kinds = (parts as Array<{ type: string }>).map((part) => part.type);
    expect(kinds).toContain('text');
    expect(kinds).toContain('file'); // the SDK normalizes an image part to a file part
  });

  it('throws for a task with no provider schema, letting the core normalize it', async () => {
    const { model } = recordingModel({});
    const adapter = createAiSdkAdapter({
      id: 'test-provider',
      model: 'test-text-model',
      languageModel: () => model,
    });
    await expect(
      // Cast: deliberately probing the adapter's own guard, not the task allowlist.
      adapter.generate('not-a-task' as never, {})
    ).rejects.toThrow();
  });
});

describe('shared AI-SDK adapter — image capability differs honestly by provider', () => {
  it('serves image tasks on the image model when the provider has one', async () => {
    const { model } = recordingModel({});
    const adapter = createAiSdkAdapter({
      id: 'image-capable',
      model: 'test-text-model',
      languageModel: () => model,
      imageModel: 'test-image-model',
      imageModelFor: () =>
        new MockImageModelV3({
          doGenerate: async () => ({
            images: [new Uint8Array([137, 80, 78, 71])],
            warnings: [],
            response: { timestamp: new Date(0), modelId: 'test-image-model', headers: {} },
          }),
        }),
    });

    const output = (await adapter.generate('illustrate-scene', { prompt: 'a reed marsh' })) as {
      dataUrl: string;
      mediaType: string;
    };

    expect(output.mediaType).toBe('image/png');
    expect(output.dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    // Metadata normalization: the image task reports the image model.
    expect(adapter.modelFor?.('illustrate-scene')).toBe('test-image-model');
    expect(adapter.modelFor?.('encounter-draft')).toBe('test-text-model');
  });

  it('fails image tasks with a clear error on a text-only provider (no fabricated image)', async () => {
    const { model } = recordingModel({});
    const adapter = createAiSdkAdapter({
      id: 'text-only',
      model: 'test-text-model',
      languageModel: () => model,
    });

    await expect(adapter.generate('illustrate-scene', { prompt: 'a reed marsh' })).rejects.toThrow(
      /cannot serve image task 'illustrate-scene'/
    );
    // A text-only provider still reports its text model for every task.
    expect(adapter.modelFor?.('illustrate-scene')).toBe('test-text-model');
  });
});
