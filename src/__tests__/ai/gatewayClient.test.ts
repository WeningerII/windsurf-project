import { afterEach, describe, expect, it, vi } from 'vitest';
import { callAiGateway, isAiEnabled } from '../../ai/gatewayClient';
import { AI_GATEWAY_ENDPOINT } from '../../ai/contracts';
import { getRecentAiTraces, getSessionUsage, resetAiSession } from '../../ai/aiObservability';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  resetAiSession();
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

describe('callAiGateway — cost caps + tracing (Phase 14)', () => {
  const success = {
    ok: true,
    task: 'encounter-draft',
    data: { selections: [{ monsterId: 'goblin', count: 1 }] },
    usage: { source: 'fixture' },
  };

  it('trips the call cap deterministically WITHOUT a network call', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubEnv('VITE_AI_MAX_CALLS', '2');
    const fetchSpy = vi.fn(async () => jsonResponse(success));
    vi.stubGlobal('fetch', fetchSpy);

    // Two calls run; the third is rejected before any fetch.
    expect((await callAiGateway('encounter-draft', payload)).ok).toBe(true);
    expect((await callAiGateway('encounter-draft', payload)).ok).toBe(true);
    const third = await callAiGateway('encounter-draft', payload);

    expect(third).toMatchObject({ ok: false, code: 'over-budget' });
    expect(fetchSpy).toHaveBeenCalledTimes(2); // the rejected call never hit the network
    // The rejected attempt is traced but not charged (tally stays at 2 real calls).
    expect(getSessionUsage().calls).toBe(2);
  });

  it('records a trace per call linking id, task, prompt version, and provenance', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(success))
    );

    await callAiGateway('encounter-draft', payload);

    const traces = getRecentAiTraces();
    expect(traces).toHaveLength(1);
    expect(traces[0]).toMatchObject({ task: 'encounter-draft', ok: true, source: 'fixture' });
    expect(typeof traces[0].traceId).toBe('string');
    expect(traces[0].promptVersion).toBeTruthy();
    expect(traces[0].estimatedUnits).toBeGreaterThan(0);
  });
});
