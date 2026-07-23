import { describe, expect, it } from 'vitest';
import { MAX_GATEWAY_REQUEST_BYTES, processGatewayHttp } from '../../ai/gatewayHttp';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../ai/contracts';

const body = JSON.stringify({
  schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
  task: 'encounter-draft',
  payload: {
    systemId: 'dnd-5e-2024',
    partyLevels: [3],
    difficulty: 'moderate',
    prompt: 'goblins',
    candidates: [{ id: 'goblin', name: 'Goblin' }],
  },
});

const fixtures = {
  'encounter-draft': { selections: [{ monsterId: 'goblin', count: 3 }] },
} as const;

describe('processGatewayHttp', () => {
  it('rejects non-POST with 405', async () => {
    const res = await processGatewayHttp('GET', '', {});
    expect(res.status).toBe(405);
    expect(res.body).toMatchObject({ ok: false, code: 'invalid-request' });
  });

  it('rejects invalid JSON with 400', async () => {
    const res = await processGatewayHttp('POST', '{not json', {});
    expect(res.status).toBe(400);
  });

  it('rejects an oversized body with 413 before parsing', async () => {
    const huge = 'x'.repeat(MAX_GATEWAY_REQUEST_BYTES + 1);
    const res = await processGatewayHttp('POST', huge, {});
    expect(res.status).toBe(413);
    expect(res.body).toMatchObject({ ok: false, code: 'invalid-request' });
  });

  it('returns 200 + data on a fixture-backed request', async () => {
    const res = await processGatewayHttp('POST', body, { fixtures });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, usage: { source: 'fixture' } });
  });

  it('returns 401 unauthorized when the injected authorizer rejects — before parsing', async () => {
    const res = await processGatewayHttp('POST', '{not even json', { fixtures }, () => ({
      ok: false,
      message: 'Sign in to use AI features.',
    }));
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ ok: false, code: 'unauthorized' });
  });

  it('proceeds normally when the injected authorizer accepts', async () => {
    const res = await processGatewayHttp('POST', body, { fixtures }, () => ({ ok: true }));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, usage: { source: 'fixture' } });
  });

  it('maps a tripped session cap to 429 with the typed budget-exceeded failure', async () => {
    const res = await processGatewayHttp('POST', body, {
      adapter: {
        id: 'mock',
        model: 'mock',
        generate: async () => ({ selections: [{ monsterId: 'goblin', count: 1 }] }),
      },
      sessionBudget: { charge: () => ({ ok: false, remainingUnits: 0, resetAt: 0 }) },
    });
    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({ ok: false, code: 'budget-exceeded' });
  });

  it('rebinds the session-budget key to the verified JWT subject when the authorizer supplies one', async () => {
    const keys: string[] = [];
    const ctx = {
      adapter: {
        id: 'mock',
        model: 'mock',
        generate: async () => ({ selections: [{ monsterId: 'goblin', count: 1 }] }),
      },
      sessionBudget: {
        charge: (key: string) => {
          keys.push(key);
          return { ok: true, remainingUnits: 1, resetAt: 0 };
        },
      },
      sessionKey: 'ip-1',
    };
    // With a verified subject, the per-user id replaces the client-ip default...
    await processGatewayHttp('POST', body, ctx, () => ({ ok: true, subject: 'user-9' }));
    // ...without one (or without auth), the caller-supplied key stands.
    await processGatewayHttp('POST', body, ctx, () => ({ ok: true }));
    await processGatewayHttp('POST', body, ctx);
    expect(keys).toEqual(['user-9', 'ip-1', 'ip-1']);
  });

  it('maps no-provider to 503 and unknown task to 400', async () => {
    expect((await processGatewayHttp('POST', body, {})).status).toBe(503);
    const badTask = JSON.stringify({
      schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
      task: 'x',
      payload: {},
    });
    expect((await processGatewayHttp('POST', badTask, {})).status).toBe(400);
  });
});
