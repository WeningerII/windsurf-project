import { describe, expect, it, vi } from 'vitest';

import {
  requestStrategyHints,
  type GatewayCall,
  type RequestStrategyParams,
} from '../../ai/strategistFlow';
import type { AiResponse, StrategyHintsData } from '../../ai/contracts';

/**
 * PHASE 12 (RFC 002): the strategist flow turns validated model hints into a
 * StrategyBlackboard for the deterministic executor. The model proposes; the
 * flow keeps only hints naming a real combatant on the advised side targeting a
 * real, distinct combatant; a gateway failure surfaces as an error (→ no board).
 */

const params: RequestStrategyParams = {
  round: 2,
  side: 'hostile',
  combatants: [
    { tokenId: 'orc', name: 'Orc', faction: 'hostile', hpFraction: 1 },
    { tokenId: 'goblin', name: 'Goblin', faction: 'hostile', hpFraction: 0.5 },
    { tokenId: 'wizard', name: 'Wizard', faction: 'party', hpFraction: 0.3 },
    { tokenId: 'fighter', name: 'Fighter', faction: 'party', hpFraction: 1 },
  ],
};

function gatewayReturning(data: AiResponse<StrategyHintsData>): {
  call: GatewayCall;
  payloads: unknown[];
} {
  const payloads: unknown[] = [];
  const call = vi.fn(async (_task: 'strategy-hints', payload: unknown) => {
    payloads.push(payload);
    return data;
  }) as unknown as GatewayCall;
  return { call, payloads };
}

function success(data: StrategyHintsData): AiResponse<StrategyHintsData> {
  return { ok: true, task: 'strategy-hints', data, usage: { source: 'fixture' } };
}

describe('requestStrategyHints', () => {
  it('builds a round-stamped blackboard grouped by actor', async () => {
    const { call, payloads } = gatewayReturning(
      success({
        hints: [
          { actorId: 'orc', targetId: 'wizard', bias: 60, reason: 'focus the caster' },
          { actorId: 'goblin', targetId: 'wizard', bias: 40 },
        ],
      })
    );

    const result = await requestStrategyHints(params, { call });

    expect(result).toEqual({
      ok: true,
      blackboard: {
        round: 2,
        byActor: {
          orc: [{ targetId: 'wizard', bias: 60, reason: 'focus the caster' }],
          goblin: [{ targetId: 'wizard', bias: 40 }],
        },
      },
    });
    expect(payloads[0]).toMatchObject({ round: 2, side: 'hostile' });
  });

  it('drops hints for unknown, off-side, or self targets and warns', async () => {
    const { call } = gatewayReturning(
      success({
        hints: [
          { actorId: 'orc', targetId: 'wizard', bias: 50 }, // kept
          { actorId: 'wizard', targetId: 'orc', bias: 50 }, // off-side actor (party) → dropped
          { actorId: 'orc', targetId: 'dragon', bias: 50 }, // unknown target → dropped
          { actorId: 'goblin', targetId: 'goblin', bias: 50 }, // self → dropped
        ],
      })
    );

    const result = await requestStrategyHints(params, { call });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.blackboard.byActor).toEqual({ orc: [{ targetId: 'wizard', bias: 50 }] });
    expect(result.warnings?.[0]).toContain('3 hint(s)');
  });

  it('returns an empty board when the model offers no advice', async () => {
    const { call } = gatewayReturning(success({ hints: [] }));
    const result = await requestStrategyHints(params, { call });
    expect(result).toEqual({ ok: true, blackboard: { round: 2, byActor: {} } });
  });

  it('surfaces a gateway failure as an error (caller falls back to no board)', async () => {
    const { call } = gatewayReturning({
      ok: false,
      task: 'strategy-hints',
      code: 'provider-not-configured',
      message: 'AI is off.',
    });
    const result = await requestStrategyHints(params, { call });
    expect(result).toEqual({ ok: false, error: 'AI is off.' });
  });
});
