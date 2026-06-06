import { describe, it, expect, vi } from 'vitest';
import {
  buildSpecRequest,
  draftBuildWithClaude,
  isValidBuildInput,
  requestBuild,
  sanitizeBuildSpec,
  BUILD_SYSTEM_PROMPT,
  type BuildPromptInput,
} from '../../creation/llmBuild';
import type { FetchLike } from '../../rules/ai/llmNarration';

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}
function claudeText(text: string) {
  return jsonResponse(200, { content: [{ type: 'text', text }] });
}

const MANIFEST = { system: 'daggerheart', classes: [{ name: 'Rogue' }] };
const INPUT: BuildPromptInput = { systemId: 'daggerheart', prompt: 'Batman', manifest: MANIFEST };

describe('isValidBuildInput', () => {
  it('accepts a well-formed input and rejects malformed/oversized ones', () => {
    expect(isValidBuildInput(INPUT)).toBe(true);
    expect(isValidBuildInput({ systemId: 'daggerheart', prompt: '  ', manifest: MANIFEST })).toBe(
      false
    );
    expect(isValidBuildInput({ systemId: 'daggerheart', prompt: 'x' })).toBe(false); // no manifest
    expect(
      isValidBuildInput({
        systemId: 'daggerheart',
        prompt: 'x',
        manifest: { blob: 'y'.repeat(30000) },
      })
    ).toBe(false); // manifest too large
  });
});

describe('buildSpecRequest', () => {
  it('builds a model-less Messages body that carries the prompt and manifest', () => {
    const body = buildSpecRequest(INPUT);
    expect(body).not.toHaveProperty('model');
    expect(body.system[0].text).toBe(BUILD_SYSTEM_PROMPT);
    expect(body.system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(body.messages[0].content).toContain('Batman');
    expect(body.messages[0].content).toContain('Rogue');
  });
});

describe('sanitizeBuildSpec', () => {
  it('keeps a well-formed spec and bounds the fields', () => {
    const spec = sanitizeBuildSpec({
      name: '  Batman  ',
      level: 3.9,
      selections: { class: 'Rogue', traits: { finesse: 2 } },
    });
    expect(spec.name).toBe('Batman');
    expect(spec.level).toBe(3);
    expect(spec.selections).toEqual({ class: 'Rogue', traits: { finesse: 2 } });
  });

  it('drops a non-object selections bag and out-of-range level', () => {
    expect(sanitizeBuildSpec({ selections: 'nope', level: 99 })).toEqual({
      selections: {},
      level: 20,
    });
    expect(sanitizeBuildSpec(null)).toEqual({ selections: {} });
  });
});

describe('draftBuildWithClaude (server-side)', () => {
  it('sends the key + model and parses the JSON build', async () => {
    const fetchMock = vi.fn<FetchLike>(async () =>
      claudeText('{"name":"Batman","level":1,"selections":{"class":"Rogue"}}')
    );
    const spec = await draftBuildWithClaude(INPUT, {
      apiKey: 'secret',
      model: 'claude-test',
      fetch: fetchMock,
    });
    expect(spec.name).toBe('Batman');
    expect(spec.selections).toEqual({ class: 'Rogue' });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['x-api-key']).toBe('secret');
    expect(JSON.parse(init.body).model).toBe('claude-test');
  });

  it('throws on a non-2xx response or unparseable body', async () => {
    await expect(
      draftBuildWithClaude(INPUT, {
        apiKey: 'k',
        model: 'm',
        fetch: vi.fn<FetchLike>(async () => jsonResponse(500, {})),
      })
    ).rejects.toThrow();
    await expect(
      draftBuildWithClaude(INPUT, {
        apiKey: 'k',
        model: 'm',
        fetch: vi.fn<FetchLike>(async () => claudeText('not json')),
      })
    ).rejects.toThrow();
  });
});

describe('requestBuild (browser gateway)', () => {
  it('returns the sanitized spec on success', async () => {
    const fetchMock = vi.fn<FetchLike>(async () =>
      jsonResponse(200, { spec: { name: 'Batman', selections: { class: 'Rogue' } } })
    );
    const spec = await requestBuild(INPUT, { fetch: fetchMock, timeoutMs: 0 });
    expect(spec).toEqual({ name: 'Batman', selections: { class: 'Rogue' } });
  });

  it('falls back to undefined when the gateway is unconfigured or errors', async () => {
    expect(
      await requestBuild(INPUT, {
        fetch: vi.fn<FetchLike>(async () => jsonResponse(503, {})),
        timeoutMs: 0,
      })
    ).toBeUndefined();
    expect(
      await requestBuild(INPUT, {
        fetch: vi.fn<FetchLike>(async () => {
          throw new Error('offline');
        }),
        timeoutMs: 0,
      })
    ).toBeUndefined();
  });
});
