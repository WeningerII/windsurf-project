import { describe, it, expect, vi } from 'vitest';
import {
  applyHintsToIntent,
  buildDraftRequest,
  draftHintsWithClaude,
  isValidPromptInput,
  requestCreationHints,
  sanitizeHints,
  MAX_KEYWORDS,
  DRAFT_SYSTEM_PROMPT,
} from '../../creation/llmIntent';
import type { FetchLike } from '../../rules/ai/llmNarration';

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function claudeText(text: string) {
  return jsonResponse(200, { content: [{ type: 'text', text }] });
}

describe('isValidPromptInput', () => {
  it('accepts a well-formed input and rejects malformed/oversized ones', () => {
    expect(isValidPromptInput({ systemId: 'pf2e', prompt: 'a wizard' })).toBe(true);
    expect(isValidPromptInput({ systemId: 'pf2e', prompt: '   ' })).toBe(false);
    expect(isValidPromptInput({ systemId: '', prompt: 'x' })).toBe(false);
    expect(isValidPromptInput({ systemId: 'pf2e', prompt: 'x'.repeat(1001) })).toBe(false);
    expect(isValidPromptInput(null)).toBe(false);
  });
});

describe('buildDraftRequest', () => {
  it('builds a model-less Messages body with a cached system block', () => {
    const body = buildDraftRequest({ systemId: 'daggerheart', prompt: 'a sneaky rogue' });
    expect(body).not.toHaveProperty('model');
    expect(body.max_tokens).toBeGreaterThan(0);
    expect(body.system[0].text).toBe(DRAFT_SYSTEM_PROMPT);
    expect(body.system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(body.messages[0].content).toContain('daggerheart');
    expect(body.messages[0].content).toContain('a sneaky rogue');
  });
});

describe('sanitizeHints', () => {
  it('coerces and bounds untrusted model output', () => {
    const hints = sanitizeHints({
      keywords: ['Rogue', '  ELF ', 42, '', 'a'.repeat(99)],
      name: '  Vell  ',
      level: 3.9,
    });
    expect(hints.keywords).toEqual(['rogue', 'elf', 'a'.repeat(32)]);
    expect(hints.name).toBe('Vell');
    expect(hints.level).toBe(3); // floored
  });

  it('drops out-of-range level and missing name, and caps keyword count', () => {
    const many = Array.from({ length: 50 }, (_v, i) => `k${i}`);
    const hints = sanitizeHints({ keywords: many, level: 99 });
    expect(hints.keywords).toHaveLength(MAX_KEYWORDS);
    expect(hints.level).toBe(20); // clamped to the max
    expect(hints.name).toBeUndefined();
  });

  it('returns empty keywords for garbage input', () => {
    expect(sanitizeHints(null)).toEqual({ keywords: [] });
    expect(sanitizeHints({ keywords: 'not-an-array' })).toEqual({ keywords: [] });
  });
});

describe('draftHintsWithClaude (server-side)', () => {
  it('sends the key + model and parses the JSON reply', async () => {
    const fetchMock = vi.fn<FetchLike>(async () =>
      claudeText('{"keywords":["wizard","elf"],"name":"Mara","level":2}')
    );
    const hints = await draftHintsWithClaude(
      { systemId: 'pf2e', prompt: 'a clever elf wizard named Mara' },
      { apiKey: 'secret', model: 'claude-test', fetch: fetchMock }
    );
    expect(hints).toEqual({ keywords: ['wizard', 'elf'], name: 'Mara', level: 2 });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['x-api-key']).toBe('secret');
    expect(JSON.parse(init.body).model).toBe('claude-test');
  });

  it('tolerates ```json code fences in the reply', async () => {
    const fetchMock = vi.fn<FetchLike>(async () =>
      claudeText('```json\n{"keywords":["fighter"]}\n```')
    );
    const hints = await draftHintsWithClaude(
      { systemId: 'pf1e', prompt: 'a fighter' },
      { apiKey: 'k', model: 'm', fetch: fetchMock }
    );
    expect(hints.keywords).toEqual(['fighter']);
  });

  it('throws on a non-2xx response', async () => {
    const fetchMock = vi.fn<FetchLike>(async () => jsonResponse(500, {}));
    await expect(
      draftHintsWithClaude(
        { systemId: 'pf2e', prompt: 'x' },
        { apiKey: 'k', model: 'm', fetch: fetchMock }
      )
    ).rejects.toThrow();
  });

  it('throws when the reply is not parseable JSON', async () => {
    const fetchMock = vi.fn<FetchLike>(async () => claudeText('sorry, I cannot do that'));
    await expect(
      draftHintsWithClaude(
        { systemId: 'pf2e', prompt: 'x' },
        { apiKey: 'k', model: 'm', fetch: fetchMock }
      )
    ).rejects.toThrow();
  });
});

describe('requestCreationHints (browser gateway)', () => {
  it('returns sanitized hints on success', async () => {
    const fetchMock = vi.fn<FetchLike>(async () =>
      jsonResponse(200, { hints: { keywords: ['Rogue'], name: 'Vell' } })
    );
    const hints = await requestCreationHints(
      { systemId: 'daggerheart', prompt: 'a rogue named Vell' },
      { fetch: fetchMock, timeoutMs: 0 }
    );
    expect(hints).toEqual({ keywords: ['rogue'], name: 'Vell' });
  });

  it('falls back to undefined when the gateway is unconfigured (503)', async () => {
    const fetchMock = vi.fn<FetchLike>(async () => jsonResponse(503, { error: 'nope' }));
    const hints = await requestCreationHints(
      { systemId: 'pf2e', prompt: 'a wizard' },
      { fetch: fetchMock, timeoutMs: 0 }
    );
    expect(hints).toBeUndefined();
  });

  it('never throws on a network error', async () => {
    const fetchMock = vi.fn<FetchLike>(async () => {
      throw new Error('offline');
    });
    const hints = await requestCreationHints(
      { systemId: 'pf2e', prompt: 'a wizard' },
      { fetch: fetchMock, timeoutMs: 0 }
    );
    expect(hints).toBeUndefined();
  });

  it('rejects invalid input without calling the network', async () => {
    const fetchMock = vi.fn<FetchLike>(async () => jsonResponse(200, { hints: {} }));
    const hints = await requestCreationHints(
      { systemId: 'pf2e', prompt: '  ' },
      { fetch: fetchMock }
    );
    expect(hints).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('applyHintsToIntent', () => {
  it('folds hint keywords into the parsed intent tokens and fills name/level', () => {
    const intent = applyHintsToIntent('someone mysterious', {
      keywords: ['rogue', 'elf'],
      name: 'Vell',
      level: 4,
    });
    expect(intent.tokens).toEqual(
      expect.arrayContaining(['someone', 'mysterious', 'rogue', 'elf'])
    );
    expect(intent.name).toBe('Vell');
    expect(intent.level).toBe(4);
  });

  it('keeps an explicit name from the prompt over the hint name', () => {
    const intent = applyHintsToIntent('a fighter named Brom', {
      keywords: ['fighter'],
      name: 'Other',
    });
    expect(intent.name).toBe('Brom');
  });
});
