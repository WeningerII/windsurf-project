import { describe, expect, it } from 'vitest';
import { buildGatewayLogRecord, newTraceId } from '../../ai/gatewayLog';
import { aiFailure, type AiResponse } from '../../ai/contracts';

describe('buildGatewayLogRecord', () => {
  it('flattens a successful provider response with usage fields', () => {
    const response: AiResponse = {
      ok: true,
      task: 'encounter-draft',
      data: { selections: [] },
      usage: { source: 'provider', provider: 'google', model: 'gemini-test' },
    };
    const record = buildGatewayLogRecord({
      response,
      traceId: 't1',
      latencyMs: 12,
      repairCount: 2,
      adapterId: 'google',
    });
    expect(record).toMatchObject({
      event: 'ai-gateway',
      traceId: 't1',
      task: 'encounter-draft',
      outcome: 'success',
      source: 'provider',
      provider: 'google',
      model: 'gemini-test',
      latencyMs: 12,
      repairCount: 2,
    });
    expect(record).not.toHaveProperty('failureCode');
  });

  it('records failure code and the attempted adapter id on failures', () => {
    const record = buildGatewayLogRecord({
      response: aiFailure('over-budget', 'rate limited', 'scene-narration'),
      traceId: 't2',
      latencyMs: 3,
      adapterId: 'mock',
    });
    expect(record).toMatchObject({
      outcome: 'failure',
      failureCode: 'over-budget',
      provider: 'mock',
      task: 'scene-narration',
      repairCount: 0,
    });
  });

  it('omits task when the response has none', () => {
    const record = buildGatewayLogRecord({
      response: aiFailure('invalid-request', 'bad'),
      traceId: 't3',
      latencyMs: 1,
    });
    expect(record).not.toHaveProperty('task');
  });

  it('stamps promptVersion and the latency budget, flagging exceedance both ways', () => {
    const response = aiFailure('timeout', 'slow', 'scene-narration');
    const within = buildGatewayLogRecord({
      response,
      traceId: 't4',
      latencyMs: 10,
      promptVersion: 'scene-narration.v1',
      latencyBudgetMs: 10,
    });
    expect(within).toMatchObject({
      promptVersion: 'scene-narration.v1',
      latencyBudgetMs: 10,
      latencyBudgetExceeded: false, // at the budget is within it
    });
    const over = buildGatewayLogRecord({
      response,
      traceId: 't5',
      latencyMs: 11,
      latencyBudgetMs: 10,
    });
    expect(over).toMatchObject({ latencyBudgetMs: 10, latencyBudgetExceeded: true });
  });

  it('omits promptVersion and latency-budget fields when they are not supplied', () => {
    const record = buildGatewayLogRecord({
      response: aiFailure('invalid-request', 'bad'),
      traceId: 't6',
      latencyMs: 1,
    });
    expect(record).not.toHaveProperty('promptVersion');
    expect(record).not.toHaveProperty('latencyBudgetMs');
    expect(record).not.toHaveProperty('latencyBudgetExceeded');
  });
});

describe('newTraceId', () => {
  it('is deterministic under an injected rng and unique across seeds', () => {
    const a = newTraceId(() => 0.42);
    const b = newTraceId(() => 0.42);
    const c = newTraceId(() => 0.99);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a.startsWith('ai-')).toBe(true);
  });
});
