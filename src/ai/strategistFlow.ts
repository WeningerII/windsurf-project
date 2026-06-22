/**
 * Client orchestration for the AI tactical strategist (RFC 002, MASTER_PLAN
 * Phase 12). The model proposes target-priority hints; the deterministic executor
 * decides everything else. This flow runs BETWEEN rounds (never in the per-move
 * loop): it asks the gateway for hints, keeps only those that name a real
 * combatant on the advised side targeting a real combatant, and returns a
 * {@link StrategyBlackboard} stamped with the round. A gateway failure (AI off,
 * unkeyed, timeout) yields an error the caller turns into "no board", so play
 * falls back to the pure Phase 11 heuristic.
 */
import { callAiGateway } from './gatewayClient';
import type { StrategyCombatantView, StrategyHintsData, TaskGatewayCall } from './contracts';
import type { StrategyBlackboard, TacticalHint } from '../rules';

export interface RequestStrategyParams {
  round: number;
  /** The side being advised (only its combatants may receive hints). */
  side: string;
  combatants: StrategyCombatantView[];
  /** Optional GM directive passed through to the model. */
  prompt?: string;
}

export type RequestStrategyResult =
  | { ok: true; blackboard: StrategyBlackboard; warnings?: string[] }
  | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type GatewayCall = TaskGatewayCall<'strategy-hints'>;

export async function requestStrategyHints(
  params: RequestStrategyParams,
  options: { call?: GatewayCall } = {}
): Promise<RequestStrategyResult> {
  const call = options.call ?? (callAiGateway as GatewayCall);
  const response = await call<StrategyHintsData>('strategy-hints', {
    round: params.round,
    side: params.side,
    combatants: params.combatants,
    ...(params.prompt ? { prompt: params.prompt } : {}),
  });
  if (!response.ok) return { ok: false, error: response.message };

  const known = new Set(params.combatants.map((combatant) => combatant.tokenId));
  const sideActors = new Set(
    params.combatants
      .filter((combatant) => combatant.faction === params.side)
      .map((combatant) => combatant.tokenId)
  );

  const byActor: Record<string, TacticalHint[]> = {};
  let dropped = 0;
  for (const hint of response.data.hints) {
    // Accept only a real actor on the advised side targeting a real, distinct
    // combatant. Unknown/off-side/self hints are dropped; the executor's hostile
    // filter still makes any surviving ally/neutral target inert, so a hint can
    // never make an illegal target actable.
    if (
      !sideActors.has(hint.actorId) ||
      !known.has(hint.targetId) ||
      hint.actorId === hint.targetId
    ) {
      dropped += 1;
      continue;
    }
    (byActor[hint.actorId] ??= []).push({
      targetId: hint.targetId,
      bias: hint.bias,
      ...(hint.reason ? { reason: hint.reason } : {}),
    });
  }

  return {
    ok: true,
    blackboard: { round: params.round, byActor },
    ...(dropped > 0
      ? { warnings: [`Ignored ${dropped} hint(s) referencing unknown or off-side combatants.`] }
      : {}),
  };
}
