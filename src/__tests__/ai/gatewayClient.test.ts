import { afterEach, describe, expect, it, vi } from 'vitest';
import { callAiGateway, isAiEnabled } from '../../ai/gatewayClient';
import { AI_GATEWAY_ENDPOINT } from '../../ai/contracts';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const payload = {
  systemId: 'dnd-5e-2024',
  partyLevels: [3],
  difficulty: 'moderate',
  prompt: 'goblins',
  candidates: [{ id: 'goblin', name: 'Goblin' }],
};

function jsonResponse(body: unknown): Response {
  return { json: async () => body } as Response;
}

describe('isAiEnabled', () => {
  it('is off unless VITE_AI_ENABLED is exactly "true"', () => {
    vi.stubEnv('VITE_AI_ENABLED', '');
    expect(isAiEnabled()).toBe(false);
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    expect(isAiEnabled()).toBe(true);
  });
});

describe('callAiGateway', () => {
  it('short-circuits to provider-not-configured when AI is disabled (no fetch)', async () => {
    vi.stubEnv('VITE_AI_ENABLED', '');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const res = await callAiGateway('encounter-draft', payload);
    expect(res).toMatchObject({ ok: false, code: 'provider-not-configured' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts to the gateway endpoint and returns a valid response', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    const success = {
      ok: true,
      task: 'encounter-draft',
      data: { selections: [{ monsterId: 'goblin', count: 3 }] },
      usage: { source: 'fixture' },
    };
    const fetchSpy = vi.fn(async () => jsonResponse(success));
    vi.stubGlobal('fetch', fetchSpy);

    const res = await callAiGateway('encounter-draft', payload);
    expect(res).toEqual(success);
    expect(fetchSpy).toHaveBeenCalledWith(
      AI_GATEWAY_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('normalizes a network error to provider-error', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      })
    );
    expect(await callAiGateway('encounter-draft', payload)).toMatchObject({
      ok: false,
      code: 'provider-error',
    });
  });

  it('normalizes a non-AiResponse body to provider-error', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ surprise: true }))
    );
    expect(await callAiGateway('encounter-draft', payload)).toMatchObject({
      ok: false,
      code: 'provider-error',
    });
  });
});
