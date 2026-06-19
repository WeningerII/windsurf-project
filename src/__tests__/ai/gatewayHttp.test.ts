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
