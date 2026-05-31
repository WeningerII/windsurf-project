/**
 * Local tactical executor — runs one combatant's turn deterministically.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), tactical-executor phase.
 *
 * Combines the N-participant decision layer (scoreTargets) with seeded
 * resolution (resolveAttack) and the scene bridge (attackToDamageIntent): given
 * an actor and the full set of combatants in the loop, it scores every target,
 * picks the best reachable one, resolves the attack from a seeded sub-stream,
 * and yields a scene `apply-damage` intent plus a transparent decision record.
 *
 * No LLM in this hot path (master-plan constraint). The choice is pure utility
 * scoring; the only randomness is the seeded attack roll. The returned decision
 * exposes the full scored candidate list, so a later LLM "strategist" can bias
 * the choice without ever being in the per-turn loop.
 */

import type { SceneActionIntent } from '../../types/core/scene';
import { resolveAttack, type AttackResolution } from '../resolver/attackResolution';
import { participantRng } from '../resolver/participantResolution';
import { attackToDamageIntent } from '../resolver/sceneCombat';
import {
  scoreTargets,
  type ScoredTarget,
  type TacticalActor,
  type TacticalTarget,
} from './targetScoring';

export interface TacticalTurnInput {
  actor: TacticalActor;
  targets: readonly TacticalTarget[];
  /** Base seed (scene seed + round/turn nonce) for the resolved attack. */
  seed: string;
  cause?: string;
}

export type TacticalDecisionKind = 'attack' | 'move-to-engage' | 'no-target';

export interface TacticalTurnResult {
  actorId: string;
  decision: TacticalDecisionKind;
  /** Every hostile target, scored — the full transparent decision. */
  scored: ScoredTarget[];
  /** The chosen target id, when a target was selected. */
  chosenTargetId?: string;
  /** The resolved attack, when an attack was made. */
  resolution?: AttackResolution;
  /** The scene action to apply, when the attack dealt damage. */
  intent?: SceneActionIntent;
  /** Why this decision was reached. */
  rationale: string;
}

/**
 * Decide and resolve one combatant's turn.
 *
 * - No hostile, living targets → `no-target`.
 * - Best target is out of reach → `move-to-engage` (movement is a later phase;
 *   we surface the intent to close rather than fake an attack).
 * - Best reachable target → `attack`, resolved from a seeded sub-stream; a hit
 *   produces an apply-damage intent (a miss produces none, but still `attack`).
 */
export function executeTacticalTurn(input: TacticalTurnInput): TacticalTurnResult {
  const scored = scoreTargets(input.actor, input.targets);

  if (scored.length === 0) {
    return {
      actorId: input.actor.tokenId,
      decision: 'no-target',
      scored,
      rationale: 'No hostile, living targets remain.',
    };
  }

  const reachable = scored.find((target) => target.inReach);
  if (!reachable) {
    const nearest = scored[0];
    return {
      actorId: input.actor.tokenId,
      decision: 'move-to-engage',
      scored,
      chosenTargetId: nearest.tokenId,
      rationale: `Best target ${nearest.tokenId} is ${nearest.distance} cells away, beyond reach; close to engage.`,
    };
  }

  const target = input.targets.find((candidate) => candidate.tokenId === reachable.tokenId)!;
  const rng = participantRng(input.seed, input.actor.tokenId, reachable.tokenId);
  const resolution = resolveAttack({
    attackEffects: input.actor.attackEffects,
    damageEffects: input.actor.damageEffects,
    targetValue: target.armorClass,
    critOn: input.actor.critOn,
    rng,
  });

  const intent = attackToDamageIntent(
    input.actor.tokenId,
    reachable.tokenId,
    resolution,
    input.cause
  );

  return {
    actorId: input.actor.tokenId,
    decision: 'attack',
    scored,
    chosenTargetId: reachable.tokenId,
    resolution,
    intent,
    rationale: resolution.isHit
      ? `Attacked ${reachable.tokenId} (score ${reachable.score}): hit for ${resolution.damage}.`
      : `Attacked ${reachable.tokenId} (score ${reachable.score}): missed.`,
  };
}
