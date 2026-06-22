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

/** A gateway that replays a fixed sequence of narratives and records payloads. */
function scriptedGateway(narratives: string[]): {
  call: NarrationGatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  let index = 0;
  const call = vi.fn(async (_task: 'scene-narration', payload: unknown) => {
    payloads.push(payload);
    const narrative = narratives[Math.min(index, narratives.length - 1)];
    index += 1;
    return success(narrative);
  }) as unknown as NarrationGatewayCall;
  return { call, payloads };
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

  it('rewrites once when the first draft invents details, then accepts the clean retelling', async () => {
    const facts = 'Combat: defeated Goblin.';
    const { call, payloads } = scriptedGateway([
      'Borin the Bold slew the goblin for 42 damage.', // ungrounded name + number
      'The goblin was slain after a hard-fought melee.', // grounded
    ]);

    const result = await narrateSceneWithAi({ facts }, { call });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.narrative).toBe('The goblin was slain after a hard-fought melee.');
    expect(result.fallback).toBeUndefined();
    expect(result.corrections?.length).toBeGreaterThan(0);
    // The second call carried the critic's findings as a rewrite request.
    expect(payloads).toHaveLength(2);
    expect(payloads[1]).toMatchObject({ critique: expect.arrayContaining([expect.any(String)]) });
  });

  it('falls back to the deterministic recap when the model keeps inventing details', async () => {
    const facts = 'Combat: defeated Goblin.';
    const { call, payloads } = scriptedGateway([
      'Borin struck for 42.', // always ungrounded
    ]);

    const result = await narrateSceneWithAi({ facts }, { call });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // Honest fallback: the recap itself is the prose, flagged as a fallback.
    expect(result.narrative).toBe(facts);
    expect(result.fallback).toBe(true);
    expect(result.corrections?.length).toBeGreaterThan(0);
    // One bounded rewrite => exactly two attempts.
    expect(payloads).toHaveLength(2);
  });

  it('honours a zero-rewrite budget (one attempt, then fallback)', async () => {
    const { call, payloads } = scriptedGateway(['The party dealt 30 damage to end it.']);
    const result = await narrateSceneWithAi(
      { facts: 'Combat: defeated Goblin.' },
      { call, maxRewrites: 0 }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.fallback).toBe(true);
    expect(payloads).toHaveLength(1);
  });
});
