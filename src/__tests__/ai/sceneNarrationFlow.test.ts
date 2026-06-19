import { describe, expect, it, vi } from 'vitest';
import { narrateSceneWithAi, type NarrationGatewayCall } from '../../ai/sceneNarrationFlow';
import type { AiResponse, SceneNarrationData } from '../../ai/contracts';

function gateway(response: AiResponse<SceneNarrationData>): {
  call: NarrationGatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  const call = vi.fn(async (_task: 'scene-narration', payload: unknown) => {
    payloads.push(payload);
    return response;
  }) as unknown as NarrationGatewayCall;
  return { call, payloads };
}

function success(narrative: string): AiResponse<SceneNarrationData> {
  return { ok: true, task: 'scene-narration', data: { narrative }, usage: { source: 'fixture' } };
}

describe('narrateSceneWithAi', () => {
  it('returns the trimmed narrative and forwards facts + tone', async () => {
    const { call, payloads } = gateway(success('  The ogre fell beneath the party.  '));

    const result = await narrateSceneWithAi(
      { facts: 'Combat: defeated the ogre.', tone: 'gritty' },
      { call }
    );

    expect(result).toEqual({ ok: true, narrative: 'The ogre fell beneath the party.' });
    expect(payloads[0]).toEqual({ facts: 'Combat: defeated the ogre.', tone: 'gritty' });
  });

  it('omits an absent tone from the payload', async () => {
    const { call, payloads } = gateway(success('A quiet scene.'));
    await narrateSceneWithAi({ facts: 'Nothing much happened.' }, { call });
    expect(payloads[0]).toEqual({ facts: 'Nothing much happened.' });
  });

  it('short-circuits with no network when there are no facts', async () => {
    const call = vi.fn() as unknown as NarrationGatewayCall;
    const result = await narrateSceneWithAi({ facts: '   ' }, { call });
    expect(result).toEqual({ ok: false, error: 'There are no scene facts to narrate yet.' });
    expect(call).not.toHaveBeenCalled();
  });

  it('passes a gateway failure through as an error', async () => {
    const { call } = gateway({
      ok: false,
      task: 'scene-narration',
      code: 'timeout',
      message: 'The AI provider did not respond in time.',
    });
    const result = await narrateSceneWithAi({ facts: 'Combat happened.' }, { call });
    expect(result).toEqual({ ok: false, error: 'The AI provider did not respond in time.' });
  });

  it('treats a whitespace-only narrative as an error', async () => {
    const { call } = gateway(success('    '));
    const result = await narrateSceneWithAi({ facts: 'Combat happened.' }, { call });
    expect(result).toEqual({ ok: false, error: 'The AI returned an empty narration.' });
  });
});
