import { describe, expect, it, vi } from 'vitest';
import {
  draftEncounterWithAi,
  type DraftEncounterParams,
  type GatewayCall,
} from '../../ai/encounterDraftFlow';
import type { AiResponse, EncounterDraftData } from '../../ai/contracts';

const params: DraftEncounterParams = {
  systemId: 'dnd-5e-2024',
  partyLevels: [3, 3, 3, 3],
  difficulty: 'moderate',
  prompt: 'a goblin ambush',
  candidates: [
    { id: 'goblin', name: 'Goblin', challengeRating: 0.25 },
    { id: 'hobgoblin', name: 'Hobgoblin', challengeRating: 0.5 },
  ],
};

/** A gateway stub that replays a fixed sequence of responses and records calls. */
function scriptedGateway(responses: AiResponse<EncounterDraftData>[]): {
  call: GatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  let index = 0;
  const call = vi.fn(async (_task: 'encounter-draft', payload: unknown) => {
    payloads.push(payload);
    const response = responses[Math.min(index, responses.length - 1)];
    index += 1;
    return response;
  }) as unknown as GatewayCall;
  return { call, payloads };
}

function success(data: EncounterDraftData): AiResponse<EncounterDraftData> {
  return { ok: true, task: 'encounter-draft', data, usage: { source: 'fixture' } };
}

describe('draftEncounterWithAi', () => {
  it('returns selections when the first draft is valid', async () => {
    const { call, payloads } = scriptedGateway([
      success({ selections: [{ monsterId: 'goblin', count: 4 }], rationale: 'A swarm.' }),
    ]);

    const result = await draftEncounterWithAi(params, () => [], { call });

    expect(result).toEqual({
      ok: true,
      selections: [{ monsterId: 'goblin', count: 4 }],
      rationale: 'A swarm.',
    });
    expect(payloads).toHaveLength(1);
  });

  it('rejects ids outside the candidate pool and repairs once', async () => {
    const { call, payloads } = scriptedGateway([
      success({ selections: [{ monsterId: 'dragon', count: 1 }] }),
      success({ selections: [{ monsterId: 'goblin', count: 4 }] }),
    ]);
    const validate = vi.fn(() => [] as string[]);

    const result = await draftEncounterWithAi(params, validate, { call });

    expect(result).toEqual({ ok: true, selections: [{ monsterId: 'goblin', count: 4 }] });
    // The invented id never reaches the deterministic validator.
    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith([{ monsterId: 'goblin', count: 4 }]);
    // The second call carries the rejection reason as a repair hint.
    expect(payloads[1]).toMatchObject({
      repairIssues: ["'dragon' is not one of the offered creatures; choose from the list."],
    });
  });

  it('feeds deterministic validator issues back as a bounded repair', async () => {
    const { call, payloads } = scriptedGateway([
      success({ selections: [{ monsterId: 'goblin', count: 99 }] }),
      success({ selections: [{ monsterId: 'goblin', count: 4 }] }),
    ]);
    const validate = vi
      .fn<(s: { monsterId: string; count: number }[]) => string[]>()
      .mockReturnValueOnce(['Too far over budget.'])
      .mockReturnValueOnce([]);

    const result = await draftEncounterWithAi(params, validate, { call });

    expect(result).toEqual({ ok: true, selections: [{ monsterId: 'goblin', count: 4 }] });
    expect(payloads[1]).toMatchObject({ repairIssues: ['Too far over budget.'] });
  });

  it('gives up after exhausting the repair budget', async () => {
    const { call } = scriptedGateway([
      success({ selections: [{ monsterId: 'goblin', count: 99 }] }),
    ]);

    const result = await draftEncounterWithAi(params, () => ['Still over budget.'], {
      call,
      maxRepairs: 1,
    });

    expect(result).toEqual({
      ok: false,
      error: 'The AI could not produce a valid encounter. Adjust the request or build it manually.',
    });
  });

  it('passes a gateway failure straight through without retrying', async () => {
    const { call, payloads } = scriptedGateway([
      {
        ok: false,
        task: 'encounter-draft',
        code: 'provider-not-configured',
        message: 'AI is off.',
      },
    ]);

    const result = await draftEncounterWithAi(params, () => [], { call });

    expect(result).toEqual({ ok: false, error: 'AI is off.' });
    expect(payloads).toHaveLength(1);
  });

  it('makes exactly one attempt when no repairs are allowed', async () => {
    const { call, payloads } = scriptedGateway([
      success({ selections: [{ monsterId: 'dragon', count: 1 }] }),
    ]);

    const result = await draftEncounterWithAi(params, () => [], { call, maxRepairs: 0 });

    expect(result).toEqual({ ok: false, error: expect.stringContaining('could not produce') });
    expect(payloads).toHaveLength(1);
  });
});
