import { describe, expect, it, vi } from 'vitest';
import {
  createFlowBudget,
  DEFAULT_MAKE_GAME_FLOW_BUDGET,
  type AnyTaskGatewayCall,
} from '../../ai/flowBudget';
import { createRecordedGateway } from '../../ai/recordedGateway';
import { AI_TASK_UNIT_COST } from '../../ai/contracts';

function okCall(): { call: AnyTaskGatewayCall; calls: number[] } {
  const calls: number[] = [];
  const call = vi.fn(async () => {
    calls.push(1);
    return {
      ok: true as const,
      task: 'scene-narration' as const,
      data: {},
      usage: { source: 'fixture' as const },
    };
  }) as unknown as AnyTaskGatewayCall;
  return { call, calls };
}

describe('createFlowBudget — one cap for a whole composed flow', () => {
  it('charges each task its gateway unit cost and lets calls through under the cap', async () => {
    const budget = createFlowBudget({ maxUnits: 10, maxCalls: 10 });
    const { call } = okCall();
    const metered = budget.meter(call);

    await metered('scene-narration', {});
    await metered('illustrate-scene', {});

    const report = budget.report();
    expect(report.unitsSpent).toBe(
      AI_TASK_UNIT_COST['scene-narration'] + AI_TASK_UNIT_COST['illustrate-scene']
    );
    expect(report.callsDelivered).toBe(2);
    expect(report.exceeded).toBe(false);
  });

  it('denies with the typed budget-exceeded failure once the unit cap is crossed', async () => {
    const budget = createFlowBudget({ maxUnits: 2, maxCalls: 99 });
    const { call } = okCall();
    const metered = budget.meter(call);

    await metered('scene-narration', {}); // 1 unit
    await metered('scene-narration', {}); // 2 units — still inside
    const denied = await metered('scene-narration', {}); // 3 units — over

    expect(denied).toMatchObject({ ok: false, code: 'budget-exceeded' });
    expect(call).toHaveBeenCalledTimes(2);
    expect(budget.report()).toMatchObject({ callsDenied: 1, callsDelivered: 2, exceeded: true });
  });

  it('stays tripped after the crossing call (charge-then-check, like the server cap)', async () => {
    const budget = createFlowBudget({ maxUnits: 1, maxCalls: 99 });
    const { call } = okCall();
    const metered = budget.meter(call);
    await metered('scene-narration', {});
    await metered('scene-narration', {});
    // A cheap call after the cap tripped is still refused.
    const later = await metered('scene-narration', {});
    expect(later).toMatchObject({ ok: false, code: 'budget-exceeded' });
    expect(call).toHaveBeenCalledTimes(1);
  });

  it('caps attempts independently of cost', async () => {
    const budget = createFlowBudget({ maxUnits: 999, maxCalls: 1 });
    const { call } = okCall();
    const metered = budget.meter(call);
    await metered('scene-narration', {});
    const denied = await metered('scene-narration', {});
    expect(denied).toMatchObject({ ok: false, code: 'budget-exceeded' });
    expect(budget.report().callsDenied).toBe(1);
  });

  it('exposes a worst-case default for the make-me-a-game flow', () => {
    // 4 party members x (1 draft + 2 bounded repairs) + 1 encounter x (1 + 1).
    expect(DEFAULT_MAKE_GAME_FLOW_BUDGET).toEqual({ maxUnits: 14, maxCalls: 14 });
  });
});

describe('createRecordedGateway — replay runs the REAL gateway core', () => {
  it('re-validates a recorded output and rejects one that drifted out of contract', async () => {
    const gateway = createRecordedGateway([{ task: 'scene-narration', output: { narrative: 42 } }]);
    const response = await gateway.call('scene-narration', { facts: 'the door opened' });
    expect(response).toMatchObject({ ok: false, code: 'invalid-provider-output' });
    expect(gateway.consumed()).toBe(1);
  });

  it('rejects a malformed REQUEST before any replay happens', async () => {
    const gateway = createRecordedGateway([
      { task: 'scene-narration', output: { narrative: 'ok' } },
    ]);
    const response = await gateway.call('scene-narration', { facts: '' });
    expect(response).toMatchObject({ ok: false, code: 'invalid-request' });
  });

  it('labels a replayed success as a fixture and stamps a deterministic trace id', async () => {
    const gateway = createRecordedGateway([
      { task: 'scene-narration', output: { narrative: 'The door opened.' } },
    ]);
    const first = await gateway.call('scene-narration', { facts: 'the door opened' });
    expect(first).toMatchObject({ ok: true, usage: { source: 'fixture' } });

    const replay = createRecordedGateway([
      { task: 'scene-narration', output: { narrative: 'The door opened.' } },
    ]);
    expect(JSON.stringify(await replay.call('scene-narration', { facts: 'the door opened' }))).toBe(
      JSON.stringify(first)
    );
  });

  it('degrades to provider-not-configured when the transcript runs out (no key, no adapter)', async () => {
    const gateway = createRecordedGateway([]);
    const response = await gateway.call('scene-narration', { facts: 'the door opened' });
    expect(response).toMatchObject({ ok: false, code: 'provider-not-configured' });
    expect(gateway.consumed()).toBe(0);
  });

  it('consumes turns FIFO per task so interleaved tasks replay in order', async () => {
    const gateway = createRecordedGateway([
      { task: 'scene-narration', output: { narrative: 'one' } },
      { task: 'scene-narration', output: { narrative: 'two' } },
    ]);
    const first = await gateway.call<{ narrative: string }>('scene-narration', { facts: 'f' });
    const second = await gateway.call<{ narrative: string }>('scene-narration', { facts: 'f' });
    expect(first.ok && first.data.narrative).toBe('one');
    expect(second.ok && second.data.narrative).toBe('two');
    expect(gateway.remaining()).toBe(0);
  });
});
