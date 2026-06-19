import { describe, expect, it, vi } from 'vitest';
import { illustrateSceneWithAi, type IllustrateGatewayCall } from '../../ai/illustrateSceneFlow';
import type { AiResponse, GeneratedImageData } from '../../ai/contracts';

const image: GeneratedImageData = {
  dataUrl: 'data:image/png;base64,AAAA',
  mediaType: 'image/png',
};

function gateway(response: AiResponse<GeneratedImageData>): {
  call: IllustrateGatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  const call = vi.fn(async (_task: 'illustrate-scene', payload: unknown) => {
    payloads.push(payload);
    return response;
  }) as unknown as IllustrateGatewayCall;
  return { call, payloads };
}

describe('illustrateSceneWithAi', () => {
  it('returns the generated image and forwards the trimmed prompt + style', async () => {
    const { call, payloads } = gateway({
      ok: true,
      task: 'illustrate-scene',
      data: image,
      usage: { source: 'fixture' },
    });

    const result = await illustrateSceneWithAi({ prompt: '  a crypt  ', style: 'ink' }, { call });

    expect(result).toEqual({ ok: true, image });
    expect(payloads[0]).toEqual({ prompt: 'a crypt', style: 'ink' });
  });

  it('short-circuits with no network when the prompt is blank', async () => {
    const call = vi.fn() as unknown as IllustrateGatewayCall;
    const result = await illustrateSceneWithAi({ prompt: '   ' }, { call });
    expect(result).toEqual({ ok: false, error: 'Describe what to illustrate first.' });
    expect(call).not.toHaveBeenCalled();
  });

  it('passes a gateway failure through as an error', async () => {
    const { call } = gateway({
      ok: false,
      task: 'illustrate-scene',
      code: 'provider-not-configured',
      message: 'AI is off.',
    });
    const result = await illustrateSceneWithAi({ prompt: 'a dragon' }, { call });
    expect(result).toEqual({ ok: false, error: 'AI is off.' });
  });
});
