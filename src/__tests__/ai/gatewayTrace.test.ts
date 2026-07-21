/**
 * Golden trace-shape tests (Phase 14 observability). Each test freezes the FULL
 * structured log record and the FULL response envelope — deep equality, not
 * partial matching — for one terminal branch of the gateway, replayed over
 * fixtures or canned adapters (never a live provider). Determinism comes from
 * the injectable seams: `traceIdFactory` pins the trace id and `now` ticks a
 * fixed 7 ms per reading, so `latencyMs` is exact and the latency-budget
 * exceedance flag is decidable. If a field is added, renamed, or dropped from
 * the trace shape, these goldens fail — bump them deliberately.
 */
import { describe, expect, it, vi } from 'vitest';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../ai/contracts';
import { handleAiRequest, type SessionBudget } from '../../ai/gatewayCore';
import type { GatewayLogRecord } from '../../ai/gatewayLog';

const TRACE_ID = 'trace-0001';

/** A clock that advances exactly 7 ms per reading, starting at 1000. */
function tickingClock(): () => number {
  let t = 1_000;
  return () => (t += 7);
}

function traceHarness() {
  const records: GatewayLogRecord[] = [];
  return {
    records,
    ctx: {
      log: (r: GatewayLogRecord) => records.push(r),
      now: tickingClock(),
      traceIdFactory: () => TRACE_ID,
    },
  };
}

const encounterRequest = {
  schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
  task: 'encounter-draft',
  payload: {
    systemId: 'dnd-5e-2024',
    partyLevels: [3, 3],
    difficulty: 'moderate',
    prompt: 'goblins',
    candidates: [{ id: 'goblin', name: 'Goblin' }],
  },
};

describe('golden trace shapes — fixture replay', () => {
  it('encounter-draft fixture success: full record and response', async () => {
    const { records, ctx } = traceHarness();
    const res = await handleAiRequest(encounterRequest, {
      ...ctx,
      fixtures: { 'encounter-draft': { selections: [{ monsterId: 'goblin', count: 3 }] } },
    });

    expect(res).toEqual({
      ok: true,
      task: 'encounter-draft',
      data: { selections: [{ monsterId: 'goblin', count: 3 }] },
      usage: { source: 'fixture', promptVersion: 'encounter-draft.v1' },
      traceId: TRACE_ID,
    });
    expect(records).toEqual([
      {
        event: 'ai-gateway',
        traceId: TRACE_ID,
        task: 'encounter-draft',
        outcome: 'success',
        source: 'fixture',
        promptVersion: 'encounter-draft.v1',
        latencyMs: 7,
        latencyBudgetMs: 10_000,
        latencyBudgetExceeded: false,
        repairCount: 0,
      },
    ]);
    // The stamped response correlates with the emitted record by trace id.
    expect(res.traceId).toBe(records[0].traceId);
  });

  it('illustrate-scene fixture success: image-class budget, and no budget charge', async () => {
    const { records, ctx } = traceHarness();
    const charge = vi.fn();
    const image = { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' };
    const res = await handleAiRequest(
      {
        schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
        task: 'illustrate-scene',
        payload: { prompt: 'a torchlit crypt' },
      },
      { ...ctx, fixtures: { 'illustrate-scene': image }, sessionBudget: { charge } }
    );

    expect(res).toEqual({
      ok: true,
      task: 'illustrate-scene',
      data: image,
      usage: { source: 'fixture', promptVersion: 'illustrate-scene.v1' },
      traceId: TRACE_ID,
    });
    expect(records).toEqual([
      {
        event: 'ai-gateway',
        traceId: TRACE_ID,
        task: 'illustrate-scene',
        outcome: 'success',
        source: 'fixture',
        promptVersion: 'illustrate-scene.v1',
        latencyMs: 7,
        latencyBudgetMs: 25_000,
        latencyBudgetExceeded: false,
        repairCount: 0,
      },
    ]);
    // Fixture replay costs no provider spend, so the cap is never charged.
    expect(charge).not.toHaveBeenCalled();
  });
});

describe('golden trace shapes — typed failures', () => {
  it('provider-not-configured: full record and response', async () => {
    const { records, ctx } = traceHarness();
    const res = await handleAiRequest(encounterRequest, ctx);

    expect(res).toEqual({
      ok: false,
      code: 'provider-not-configured',
      message: 'No AI provider is configured. Use the manual tools instead.',
      task: 'encounter-draft',
      traceId: TRACE_ID,
    });
    expect(records).toEqual([
      {
        event: 'ai-gateway',
        traceId: TRACE_ID,
        task: 'encounter-draft',
        outcome: 'failure',
        failureCode: 'provider-not-configured',
        promptVersion: 'encounter-draft.v1',
        latencyMs: 7,
        latencyBudgetMs: 10_000,
        latencyBudgetExceeded: false,
        repairCount: 0,
      },
    ]);
  });

  it('budget-exceeded: full record and response, adapter untouched', async () => {
    const { records, ctx } = traceHarness();
    const generate = vi.fn();
    const denying: SessionBudget = {
      charge: () => ({ ok: false, remainingUnits: 0, resetAt: 9_999 }),
    };
    const res = await handleAiRequest(encounterRequest, {
      ...ctx,
      adapter: { id: 'mock', model: 'mock-model', generate },
      sessionBudget: denying,
    });

    expect(res).toEqual({
      ok: false,
      code: 'budget-exceeded',
      message: 'The AI budget for this session is used up. Use the manual tools instead.',
      task: 'encounter-draft',
      traceId: TRACE_ID,
    });
    expect(records).toEqual([
      {
        event: 'ai-gateway',
        traceId: TRACE_ID,
        task: 'encounter-draft',
        outcome: 'failure',
        failureCode: 'budget-exceeded',
        provider: 'mock',
        promptVersion: 'encounter-draft.v1',
        latencyMs: 7,
        latencyBudgetMs: 10_000,
        latencyBudgetExceeded: false,
        repairCount: 0,
      },
    ]);
    expect(generate).not.toHaveBeenCalled();
  });

  it('unsupported-task: minimal record without task-derived fields', async () => {
    const { records, ctx } = traceHarness();
    const res = await handleAiRequest(
      { schemaVersion: AI_GATEWAY_SCHEMA_VERSION, task: 'bogus', payload: {} },
      ctx
    );

    expect(res).toEqual({
      ok: false,
      code: 'unsupported-task',
      message: "Unsupported task 'bogus'.",
      traceId: TRACE_ID,
    });
    // No task means no promptVersion and no latency budget in the record.
    expect(records).toEqual([
      {
        event: 'ai-gateway',
        traceId: TRACE_ID,
        outcome: 'failure',
        failureCode: 'unsupported-task',
        latencyMs: 7,
        repairCount: 0,
      },
    ]);
  });

  it('timeout under a tight class budget: exceedance flag set', async () => {
    const { records, ctx } = traceHarness();
    const res = await handleAiRequest(encounterRequest, {
      ...ctx,
      adapter: { id: 'mock', model: 'mock-model', generate: () => new Promise(() => {}) },
      latencyBudgets: { text: 5 },
    });

    expect(res).toEqual({
      ok: false,
      code: 'timeout',
      message: 'The AI provider did not respond in time.',
      task: 'encounter-draft',
      traceId: TRACE_ID,
    });
    expect(records).toEqual([
      {
        event: 'ai-gateway',
        traceId: TRACE_ID,
        task: 'encounter-draft',
        outcome: 'failure',
        failureCode: 'timeout',
        provider: 'mock',
        promptVersion: 'encounter-draft.v1',
        latencyMs: 7,
        latencyBudgetMs: 5,
        latencyBudgetExceeded: true, // 7 ms measured > 5 ms budget
        repairCount: 0,
      },
    ]);
  });
});
