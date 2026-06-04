import { describe, it, expect, vi } from 'vitest';

import {
  ANTHROPIC_VERSION,
  buildNarrationRequest,
  isValidSummary,
  MAX_BEAT_LENGTH,
  MAX_NARRATION_BEATS,
  narrateWithClaude,
  requestNarration,
  type FetchLike,
  type RoundNarrationSummary,
} from '../../rules/ai/llmNarration';

/**
 * The LLM narration gateway. The mechanics are already resolved before any of
 * this runs; these tests pin the request shape, the server-side call, and the
 * browser client's degrade-to-deterministic contract (undefined on any failure).
 */

const summary: RoundNarrationSummary = {
  systemId: 'dnd-5e-2014',
  round: 3,
  beats: ['Aria hits the Goblin for 7 (rolled 18+5 vs AC 14).', 'The Goblin misses Aria.'],
};

describe('isValidSummary (gateway input guard)', () => {
  it('accepts a well-formed, in-bounds summary', () => {
    expect(isValidSummary(summary)).toBe(true);
  });

  it('rejects malformed or empty payloads', () => {
    expect(isValidSummary(null)).toBe(false);
    expect(isValidSummary({ systemId: '', round: 1, beats: ['x'] })).toBe(false);
    expect(isValidSummary({ systemId: 's', round: 1, beats: [] })).toBe(false); // empty
    expect(isValidSummary({ systemId: 's', round: NaN, beats: ['x'] })).toBe(false);
    expect(isValidSummary({ systemId: 's', round: 1, beats: ['x', 42] })).toBe(false); // non-string beat
  });

  it('rejects oversized payloads (the cost-abuse guard)', () => {
    const tooMany = { systemId: 's', round: 1, beats: Array(MAX_NARRATION_BEATS + 1).fill('x') };
    expect(isValidSummary(tooMany)).toBe(false);
    const tooLong = { systemId: 's', round: 1, beats: ['x'.repeat(MAX_BEAT_LENGTH + 1)] };
    expect(isValidSummary(tooLong)).toBe(false);
    // The boundary is allowed.
    expect(isValidSummary({ systemId: 's', round: 1, beats: ['x'.repeat(MAX_BEAT_LENGTH)] })).toBe(
      true
    );
  });
});

/** A fetch double that records its call and returns a scripted response. */
function mockFetch(response: { ok: boolean; status: number; json: () => Promise<unknown> }): {
  fetch: FetchLike;
  calls: Array<{ url: string; init: Parameters<FetchLike>[1] }>;
} {
  const calls: Array<{ url: string; init: Parameters<FetchLike>[1] }> = [];
  const fetch: FetchLike = (url, init) => {
    calls.push({ url, init });
    return Promise.resolve(response);
  };
  return { fetch, calls };
}

describe('buildNarrationRequest', () => {
  it('carries the guardrailed system prompt with an ephemeral cache breakpoint', () => {
    const body = buildNarrationRequest(summary);
    expect(body.system).toHaveLength(1);
    expect(body.system[0].cache_control).toEqual({ type: 'ephemeral' });
    // The guardrail that keeps the model out of the mechanics.
    expect(body.system[0].text).toMatch(/never invent|change any hit|already-resolved/i);
    expect(body.max_tokens).toBeGreaterThan(0);
  });

  it('puts the system id, round, and every beat into the user turn', () => {
    const body = buildNarrationRequest(summary);
    expect(body.messages).toHaveLength(1);
    const content = body.messages[0].content;
    expect(content).toContain('dnd-5e-2014');
    expect(content).toContain('Round 3');
    for (const beat of summary.beats) {
      expect(content).toContain(beat);
    }
  });

  it('honors a custom max_tokens', () => {
    expect(buildNarrationRequest(summary, 64).max_tokens).toBe(64);
  });
});

describe('narrateWithClaude (server-side)', () => {
  it('POSTs to the Messages API with the key, version, and model, and returns the text', async () => {
    const { fetch, calls } = mockFetch({
      ok: true,
      status: 200,
      json: async () => ({
        content: [{ type: 'text', text: '  The goblin crumples as Aria’s blade bites deep.  ' }],
      }),
    });
    const prose = await narrateWithClaude(summary, {
      apiKey: 'sk-test',
      model: 'test-model',
      fetch,
      baseUrl: 'https://api.example.com',
    });

    expect(prose).toBe('The goblin crumples as Aria’s blade bites deep.');
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://api.example.com/v1/messages');
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.headers['x-api-key']).toBe('sk-test');
    expect(calls[0].init.headers['anthropic-version']).toBe(ANTHROPIC_VERSION);
    const sent = JSON.parse(calls[0].init.body) as { model: string };
    expect(sent.model).toBe('test-model');
  });

  it('skips a leading thinking block and returns the first text block', async () => {
    const { fetch } = mockFetch({
      ok: true,
      status: 200,
      json: async () => ({
        content: [
          { type: 'thinking', thinking: '...' },
          { type: 'text', text: 'Steel meets flesh.' },
        ],
      }),
    });
    const prose = await narrateWithClaude(summary, { apiKey: 'k', model: 'm', fetch });
    expect(prose).toBe('Steel meets flesh.');
  });

  it('throws on a non-2xx response', async () => {
    const { fetch } = mockFetch({ ok: false, status: 429, json: async () => ({}) });
    await expect(narrateWithClaude(summary, { apiKey: 'k', model: 'm', fetch })).rejects.toThrow(
      /429/
    );
  });

  it('throws when the response carries no text content', async () => {
    const { fetch } = mockFetch({
      ok: true,
      status: 200,
      json: async () => ({ content: [{ type: 'thinking', thinking: '...' }] }),
    });
    await expect(narrateWithClaude(summary, { apiKey: 'k', model: 'm', fetch })).rejects.toThrow(
      /no text/i
    );
  });
});

describe('requestNarration (browser client)', () => {
  it('returns the prose from a 200 gateway response and posts the summary', async () => {
    const { fetch, calls } = mockFetch({
      ok: true,
      status: 200,
      json: async () => ({ narration: '  A clean strike.  ' }),
    });
    const prose = await requestNarration(summary, { endpoint: '/api/narrate', fetch });
    expect(prose).toBe('A clean strike.');
    expect(calls[0].url).toBe('/api/narrate');
    expect(JSON.parse(calls[0].init.body)).toEqual(summary);
  });

  it('returns undefined on a non-2xx gateway response (→ deterministic fallback)', async () => {
    const { fetch } = mockFetch({ ok: false, status: 503, json: async () => ({}) });
    expect(await requestNarration(summary, { endpoint: '/api/narrate', fetch })).toBeUndefined();
  });

  it('returns undefined when the gateway omits or empties the narration', async () => {
    const empty = mockFetch({ ok: true, status: 200, json: async () => ({ narration: '   ' }) });
    expect(await requestNarration(summary, { endpoint: '/x', fetch: empty.fetch })).toBeUndefined();
    const missing = mockFetch({ ok: true, status: 200, json: async () => ({}) });
    expect(
      await requestNarration(summary, { endpoint: '/x', fetch: missing.fetch })
    ).toBeUndefined();
  });

  it('returns undefined when the network throws (never propagates)', async () => {
    const fetch = vi.fn<FetchLike>(() => Promise.reject(new Error('offline')));
    expect(await requestNarration(summary, { endpoint: '/x', fetch })).toBeUndefined();
  });

  it('aborts and falls back when the gateway exceeds the timeout', async () => {
    // A gateway that never settles on its own — only the timeout's abort ends it.
    const fetch: FetchLike = (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });
    const started = Date.now();
    const prose = await requestNarration(summary, { endpoint: '/x', fetch, timeoutMs: 10 });
    expect(prose).toBeUndefined();
    // It degraded promptly rather than hanging on the unresponsive gateway.
    expect(Date.now() - started).toBeLessThan(2000);
  });
});
