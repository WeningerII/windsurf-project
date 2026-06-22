/**
 * Strategist blackboard — the async LLM's advice to the deterministic executor.
 *
 * See `docs/rfc/002-ai-control-plane.md` and `docs/rfc/003-rules-ir-and-effects.md`
 * (Accepted), Phase 12: "Async LLM strategist that writes intent/weight hints
 * every N turns or on triggers; local executor remains authoritative for moves."
 *
 * The blackboard is plain data: a per-actor set of {@link TacticalHint}s plus the
 * round they were computed for. The strategist (an AI control-plane task) writes
 * it BETWEEN rounds; the tactical executor reads it as a synchronous input when
 * scoring targets. Nothing here calls a model and nothing here is async — the LLM
 * is never in the per-move hot path. When the board is missing, empty, or stale
 * the executor simply scores with the pure Phase 11 heuristic, so AI-off /
 * unkeyed / unreachable play is byte-identical to the deterministic baseline.
 */

import type { TacticalHint } from './targetScoring';

export interface StrategyBlackboard {
  /** The round these hints were computed for (freshness reference). */
  round: number;
  /** Hints keyed by the acting token id. A token absent here gets no bias. */
  byActor: Record<string, readonly TacticalHint[]>;
}

/** A board that advises nothing — the default when no strategist has run. */
export const EMPTY_BLACKBOARD: StrategyBlackboard = { round: 0, byActor: {} };

/**
 * Hints for `actorId`, but only when the board is fresh enough for
 * `currentRound` (computed this round or within `maxAgeRounds` before it, never
 * for a future round); otherwise `[]`. This is the acceptance guarantee that
 * "stale/missing strategist output falls back to defaults" — a stale or absent
 * board yields no bias, so the executor scores exactly as the pure heuristic.
 */
export function hintsForActor(
  board: StrategyBlackboard | undefined,
  actorId: string,
  currentRound: number,
  maxAgeRounds = 1
): readonly TacticalHint[] {
  if (!board) return [];
  const age = currentRound - board.round;
  if (age < 0 || age > maxAgeRounds) return [];
  return board.byActor[actorId] ?? [];
}

/**
 * Resolve the per-actor hint map for one round from a blackboard, keyed for the
 * round driver. Only fresh hints survive; the result is safe to pass straight
 * into `runCombatRound`. Pure.
 */
export function resolveRoundHints(
  board: StrategyBlackboard | undefined,
  actorIds: readonly string[],
  currentRound: number,
  maxAgeRounds = 1
): Record<string, readonly TacticalHint[]> {
  const byActor: Record<string, readonly TacticalHint[]> = {};
  for (const actorId of actorIds) {
    const hints = hintsForActor(board, actorId, currentRound, maxAgeRounds);
    if (hints.length > 0) byActor[actorId] = hints;
  }
  return byActor;
}
