import { describe, expect, it, vi } from 'vitest';
import {
  identifyCreatureWithAi,
  type IdentifyGatewayCall,
  type IdentifyCreatureParams,
} from '../../ai/identifyCreatureFlow';
import type { AiResponse, IdentifyCreatureData } from '../../ai/contracts';

const params: IdentifyCreatureParams = {
  systemId: 'dnd-5e-2024',
  candidates: [
    { id: 'goblin', name: 'Goblin', challengeRating: 0.25 },
    { id: 'ogre', name: 'Ogre', challengeRating: 2 },
  ],
  image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
};

function gateway(response: AiResponse<IdentifyCreatureData>): {
  call: IdentifyGatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  const call = vi.fn(async (_task: 'identify-creature', payload: unknown) => {
    payloads.push(payload);
    return response;
  }) as unknown as IdentifyGatewayCall;
  return { call, payloads };
}

function success(data: IdentifyCreatureData): AiResponse<IdentifyCreatureData> {
  return { ok: true, task: 'identify-creature', data, usage: { source: 'fixture' } };
}

describe('identifyCreatureWithAi', () => {
  it('resolves a catalog id to its name and forwards the image', async () => {
    const { call, payloads } = gateway(
      success({ monsterId: 'ogre', confidence: 0.9, reason: 'big and brutish' })
    );

    const result = await identifyCreatureWithAi(params, { call });

    expect(result).toEqual({
      ok: true,
      monsterId: 'ogre',
      name: 'Ogre',
      confidence: 0.9,
      reason: 'big and brutish',
    });
    expect(payloads[0]).toMatchObject({
      image: { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' },
    });
  });

  it('rejects an id outside the candidate pool', async () => {
    const { call } = gateway(success({ monsterId: 'dragon', confidence: 1 }));
    const result = await identifyCreatureWithAi(params, { call });
    expect(result).toEqual({
      ok: false,
      error: 'The AI named a creature that is not in the catalog.',
    });
  });

  it('passes a gateway failure through as an error', async () => {
    const { call } = gateway({
      ok: false,
      task: 'identify-creature',
      code: 'provider-error',
      message: 'vision model unavailable',
    });
    const result = await identifyCreatureWithAi(params, { call });
    expect(result).toEqual({ ok: false, error: 'vision model unavailable' });
  });

  it('short-circuits when there are no candidates', async () => {
    const call = vi.fn() as unknown as IdentifyGatewayCall;
    const result = await identifyCreatureWithAi({ ...params, candidates: [] }, { call });
    expect(result).toEqual({ ok: false, error: 'There are no creatures to match against.' });
    expect(call).not.toHaveBeenCalled();
  });
});
