import { describe, expect, it, vi } from 'vitest';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../ai/contracts';
import { handleAiRequest } from '../../ai/gatewayCore';
import { createMockAdapter } from '../../ai/mockAdapter';
import { createRateLimiter } from '../../utils/rateLimit';
import type { GatewayLogRecord } from '../../ai/gatewayLog';

const request = {
  schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
  task: 'encounter-draft',
  payload: {
    systemId: 'dnd-5e-2024',
    partyLevels: [3, 3],
    difficulty: 'moderate',
    prompt: 'goblins',
    candidates: [{ id: 'goblin', name: 'Goblin' }],
    repairIssues: ['prior issue'],
  },
};

describe('handleAiRequest — hardening', () => {
  it('routes through the mock adapter and re-validates its output (source: provider)', async () => {
    const res = await handleAiRequest(request, { adapter: createMockAdapter() });
    expect(res).toMatchObject({
      ok: true,
      task: 'encounter-draft',
      usage: { source: 'provider', provider: 'mock', model: 'mock' },
      data: { selections: [{ monsterId: 'goblin', count: 1 }] },
    });
  });

  it('degrades to over-budget (not a throw) when the rate limit is exhausted', async () => {
    const clock = () => 0;
    const rateLimiter = createRateLimiter({ limit: 1, windowMs: 1000, now: clock });
    const ctx = { adapter: createMockAdapter(), rateLimiter, rateLimitKey: 'client-1' };

    const first = await handleAiRequest(request, ctx);
    expect(first.ok).toBe(true);

    const second = await handleAiRequest(request, ctx);
    expect(second).toMatchObject({ ok: false, code: 'over-budget', task: 'encounter-draft' });
  });

  it('does not consume rate budget on the fixture path', async () => {
    const rateLimiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    const fixtures = { 'encounter-draft': { selections: [{ monsterId: 'goblin', count: 2 }] } };
    // Two fixture replays despite a limit of 1 — fixtures short-circuit before the limiter.
    expect((await handleAiRequest(request, { rateLimiter, fixtures })).ok).toBe(true);
    expect((await handleAiRequest(request, { rateLimiter, fixtures })).ok).toBe(true);
  });

  it('emits a structured log record at the terminal branch (success)', async () => {
    const records: GatewayLogRecord[] = [];
    const now = (() => {
      let t = 100;
      return () => (t += 5);
    })();
    const res = await handleAiRequest(request, {
      adapter: createMockAdapter(),
      log: (r) => records.push(r),
      now,
    });
    expect(res.ok).toBe(true);
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      event: 'ai-gateway',
      task: 'encounter-draft',
      outcome: 'success',
      source: 'provider',
      provider: 'mock',
      repairCount: 1,
    });
    expect(typeof records[0].traceId).toBe('string');
    expect(records[0].latencyMs).toBeGreaterThan(0);
  });

  it('logs the over-budget failure with the attempted adapter id', async () => {
    const log = vi.fn();
    const rateLimiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    const ctx = { adapter: createMockAdapter(), rateLimiter, log };
    await handleAiRequest(request, ctx); // consumes the single slot
    await handleAiRequest(request, ctx); // blocked
    const failure = log.mock.calls
      .map((c) => c[0] as GatewayLogRecord)
      .find((r) => r.outcome === 'failure');
    expect(failure).toMatchObject({ failureCode: 'over-budget', provider: 'mock' });
  });
});
