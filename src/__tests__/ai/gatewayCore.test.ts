import { describe, expect, it, vi } from 'vitest';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../ai/contracts';
import { handleAiRequest, type AiProviderAdapter } from '../../ai/gatewayCore';

const request = {
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

function adapter(generate: AiProviderAdapter['generate']): AiProviderAdapter {
  return { id: 'google', model: 'gemini-test', generate };
}

const validOutput = { selections: [{ monsterId: 'goblin', count: 3 }] };

describe('handleAiRequest', () => {
  it('replays a fixture without calling the adapter', async () => {
    const generate = vi.fn();
    const res = await handleAiRequest(request, {
      adapter: adapter(generate),
      fixtures: { 'encounter-draft': validOutput },
    });
    expect(res).toMatchObject({ ok: true, task: 'encounter-draft', usage: { source: 'fixture' } });
    expect(generate).not.toHaveBeenCalled();
  });

  it('reports provider-not-configured when there is no adapter and no fixture', async () => {
    const res = await handleAiRequest(request, {});
    expect(res).toMatchObject({ ok: false, code: 'provider-not-configured' });
  });

  it('calls the adapter and validates its output (source: provider)', async () => {
    const res = await handleAiRequest(request, {
      adapter: adapter(async () => validOutput),
    });
    expect(res).toMatchObject({
      ok: true,
      usage: { source: 'provider', provider: 'google', model: 'gemini-test' },
    });
  });

  it('normalizes usage.model via modelFor when the adapter serves tasks on different models', async () => {
    const res = await handleAiRequest(request, {
      adapter: {
        ...adapter(async () => validOutput),
        modelFor: (task) => (task === 'encounter-draft' ? 'gemini-task-model' : 'other'),
      },
    });
    expect(res).toMatchObject({
      ok: true,
      usage: { source: 'provider', provider: 'google', model: 'gemini-task-model' },
    });
  });

  it('normalizes an adapter throw to provider-error', async () => {
    const res = await handleAiRequest(request, {
      adapter: adapter(async () => {
        throw new Error('429 from upstream');
      }),
    });
    expect(res).toMatchObject({ ok: false, code: 'provider-error', message: '429 from upstream' });
  });

  it('rejects malformed provider output as invalid-provider-output', async () => {
    const res = await handleAiRequest(request, {
      adapter: adapter(async () => ({ selections: [{ monsterId: 'g', count: -1 }] })),
    });
    expect(res).toMatchObject({ ok: false, code: 'invalid-provider-output' });
  });

  it('times out a slow provider call', async () => {
    const res = await handleAiRequest(request, {
      adapter: adapter(() => new Promise(() => {})),
      timeoutMs: 1,
    });
    expect(res).toMatchObject({ ok: false, code: 'timeout' });
  });

  it('rejects an unknown task and a malformed request distinctly', async () => {
    expect(await handleAiRequest({ ...request, task: 'bogus' }, {})).toMatchObject({
      ok: false,
      code: 'unsupported-task',
    });
    expect(await handleAiRequest({ schemaVersion: AI_GATEWAY_SCHEMA_VERSION }, {})).toMatchObject({
      ok: false,
      code: 'unsupported-task',
    });
    expect(
      await handleAiRequest({ ...request, payload: { ...request.payload, candidates: [] } }, {})
    ).toMatchObject({ ok: false, code: 'invalid-request' });
  });
});
