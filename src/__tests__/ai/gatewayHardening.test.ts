import { describe, expect, it, vi } from 'vitest';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../ai/contracts';
import { handleAiRequest, type SessionBudget } from '../../ai/gatewayCore';
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

/** A recording SessionBudget: allows (or denies) every charge and logs each one. */
function recordingBudget(ok = true): {
  budget: SessionBudget;
  calls: Array<{ key: string; units: number }>;
} {
  const calls: Array<{ key: string; units: number }> = [];
  return {
    calls,
    budget: {
      charge(key, units) {
        calls.push({ key, units });
        return { ok, remainingUnits: ok ? 1 : 0, resetAt: 0 };
      },
    },
  };
}

const identifyRequest = {
  schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
  task: 'identify-creature',
  payload: {
    systemId: 'dnd-5e-2024',
    candidates: [{ id: 'goblin', name: 'Goblin' }],
    image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
  },
};

const illustrateRequest = {
  schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
  task: 'illustrate-scene',
  payload: { prompt: 'a torchlit crypt' },
};

describe('handleAiRequest — session cost cap (Phase 14)', () => {
  it('charges the deterministic per-task unit cost before the adapter call', async () => {
    const { budget, calls } = recordingBudget();
    const ctx = { adapter: createMockAdapter(), sessionBudget: budget, sessionKey: 'user-1' };

    expect((await handleAiRequest(request, ctx)).ok).toBe(true); // text: 1 unit
    expect((await handleAiRequest(identifyRequest, ctx)).ok).toBe(true); // vision: 2 units
    expect((await handleAiRequest(illustrateRequest, ctx)).ok).toBe(true); // image: 5 units

    expect(calls).toEqual([
      { key: 'user-1', units: 1 },
      { key: 'user-1', units: 2 },
      { key: 'user-1', units: 5 },
    ]);
  });

  it("defaults the session key to 'global' when none is set", async () => {
    const { budget, calls } = recordingBudget();
    await handleAiRequest(request, { adapter: createMockAdapter(), sessionBudget: budget });
    expect(calls).toEqual([{ key: 'global', units: 1 }]);
  });

  it('degrades to the typed budget-exceeded failure (not a throw) when the cap denies', async () => {
    const { budget } = recordingBudget(false);
    const generate = vi.fn();
    const res = await handleAiRequest(request, {
      adapter: { id: 'mock', model: 'mock', generate },
      sessionBudget: budget,
    });
    expect(res).toMatchObject({ ok: false, code: 'budget-exceeded', task: 'encounter-draft' });
    expect(generate).not.toHaveBeenCalled(); // no provider spend past the cap
  });

  it('never charges the budget on the fixture path', async () => {
    const { budget, calls } = recordingBudget();
    const fixtures = { 'encounter-draft': { selections: [{ monsterId: 'goblin', count: 2 }] } };
    expect((await handleAiRequest(request, { sessionBudget: budget, fixtures })).ok).toBe(true);
    expect(calls).toEqual([]);
  });
});

describe('handleAiRequest — per-task-class latency budgets (Phase 14)', () => {
  const hanging = { id: 'mock', model: 'mock', generate: () => new Promise<never>(() => {}) };

  it('caps the provider call at the task-class budget', async () => {
    const res = await handleAiRequest(request, { adapter: hanging, latencyBudgets: { text: 5 } });
    expect(res).toMatchObject({ ok: false, code: 'timeout' });
  });

  it('lets the single-knob timeoutMs override the class budget', async () => {
    const res = await handleAiRequest(request, {
      adapter: hanging,
      timeoutMs: 5,
      latencyBudgets: { text: 60_000 },
    });
    expect(res).toMatchObject({ ok: false, code: 'timeout' });
  });
});
