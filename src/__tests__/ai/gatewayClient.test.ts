import { afterEach, describe, expect, it, vi } from 'vitest';
import { callAiGateway, isAiEnabled } from '../../ai/gatewayClient';
import { AI_GATEWAY_ENDPOINT } from '../../ai/contracts';
import { getSupabaseClient, type SupabaseClient } from '../../utils/supabaseClient';

// Signed-out by default: no Supabase client, so no Authorization header —
// which is also the pre-auth behavior every existing test below assumes.
vi.mock('../../utils/supabaseClient', () => ({
  getSupabaseClient: vi.fn(() => null),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.mocked(getSupabaseClient).mockReturnValue(null);
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

  it('attaches the Supabase access token as a Bearer header when signed in', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    const accessToken = 'stub.access.token';
    vi.mocked(getSupabaseClient).mockReturnValue({
      auth: { getSession: async () => ({ data: { session: { access_token: accessToken } } }) },
    } as unknown as SupabaseClient);
    const fetchSpy = vi.fn(async () => jsonResponse({ ok: false, code: 'x', message: 'x' }));
    vi.stubGlobal('fetch', fetchSpy);

    await callAiGateway('encounter-draft', payload);
    expect(fetchSpy).toHaveBeenCalledWith(
      AI_GATEWAY_ENDPOINT,
      expect.objectContaining({
        headers: expect.objectContaining({ authorization: `Bearer ${accessToken}` }),
      })
    );
  });

  it('sends no Authorization header when signed out (and survives a session error)', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.mocked(getSupabaseClient).mockReturnValue({
      auth: {
        getSession: async () => {
          throw new Error('auth backend down');
        },
      },
    } as unknown as SupabaseClient);
    const fetchSpy = vi.fn(async (_input: unknown, _init?: RequestInit) =>
      jsonResponse({ ok: false, code: 'x', message: 'x' })
    );
    vi.stubGlobal('fetch', fetchSpy);

    await callAiGateway('encounter-draft', payload);
    const headers = (fetchSpy.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(headers.authorization).toBeUndefined();
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
