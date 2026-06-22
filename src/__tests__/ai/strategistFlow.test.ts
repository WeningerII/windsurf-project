import { describe, expect, it, vi } from 'vitest';

import {
  buildStrategySnapshot,
  requestStrategyHints,
  type GatewayCall,
  type RequestStrategyParams,
} from '../../ai/strategistFlow';
import type { AiResponse, StrategyHintsData } from '../../ai/contracts';
import type { SceneState, SceneToken } from '../../types/core/scene';

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

describe('buildStrategySnapshot', () => {
  function token(over: Partial<SceneToken> & Pick<SceneToken, 'id'>): SceneToken {
    return {
      name: over.id,
      kind: 'monster',
      position: { x: 0, y: 0 },
      size: 1,
      ...over,
    };
  }

  const state: SceneState = {
    sceneId: 's',
    name: 'S',
    systemId: 'dnd-5e-2014',
    grid: { type: 'square', width: 10, height: 10, cellSize: 5 },
    tokens: {
      orc: token({ id: 'orc', kind: 'monster', hp: { current: 8, max: 16 } }),
      hero: token({ id: 'hero', kind: 'character', hp: { current: 10, max: 10 } }),
      ally: token({ id: 'ally', kind: 'npc', allegiance: 'party', hp: { current: 5, max: 5 } }),
      wall: token({ id: 'wall', kind: 'object' }), // no hp → omitted
      corpse: token({ id: 'corpse', kind: 'monster', hp: { current: 0, max: 12 } }), // dead → omitted
    },
    markers: {},
    initiative: [],
    round: 1,
    seed: 's',
    checkLog: [],
    oracleLog: [],
  };

  it('includes only living combatants, with side and hp fraction', () => {
    const snapshot = buildStrategySnapshot(state);
    const byId = Object.fromEntries(snapshot.map((c) => [c.tokenId, c]));
    expect(Object.keys(byId).sort()).toEqual(['ally', 'hero', 'orc']);
    expect(byId.orc).toEqual({ tokenId: 'orc', name: 'orc', faction: 'hostile', hpFraction: 0.5 });
    expect(byId.hero.faction).toBe('party'); // character → party
    expect(byId.ally.faction).toBe('party'); // npc with explicit party allegiance
  });
});
