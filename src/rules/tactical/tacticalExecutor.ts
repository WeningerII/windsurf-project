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
 * Multiattack (SRD): an actor with `attacksPerRound = N` resolves N attacks in
 * sequence. Attacks against the same target draw from ONE per-pair seeded
 * stream (each resolution consumes rolls, so attacks differ but the whole turn
 * replays byte-identically); when a target drops mid-sequence the remaining
 * attacks re-target the next-best reachable living candidate. All N attacks use
 * the actor's primary attack profile — an honest approximation of mixed
 * Multiattack routines ("two with its claws and one with its bite").
 *
 * No LLM in this hot path (master-plan constraint). The choice is pure utility
 * scoring; the only randomness is the seeded attack roll. The returned decision
 * exposes the full scored candidate list, so a later LLM "strategist" can bias
 * the choice without ever being in the per-turn loop.
 */

import type { SceneActionIntent } from '../../types/core/scene';
import { resolveAttack, type AttackResolution } from '../resolver/attackResolution';
import { makeEffectId, type EffectInstance } from '../ir/types';
import { participantRng } from '../resolver/participantResolution';
import { gridDistance } from '../resolver/areaTargeting';
import { attackToDamageIntent } from '../resolver/sceneCombat';
import { OPEN_MOVEMENT, planApproach, type MovementContext } from './pathfinding';
import {
  scoreTargets,
  type ScoredTarget,
  type TacticalActor,
  type TacticalHint,
  type TacticalTarget,
} from './targetScoring';

export interface TacticalTurnInput {
  actor: TacticalActor;
  targets: readonly TacticalTarget[];
  /** Base seed (scene seed + round/turn nonce) for the resolved attack. */
  seed: string;
  cause?: string;
  /** Hit/crit model for every attack this turn (default 'd20'). */
  degreeModel?: 'd20' | 'pf2e';
  /**
   * Grid bounds and occupied cells for obstacle-aware movement. When omitted the
   * actor moves on an open field (no blockers) — reproducing the prior
   * straight-line approach. When supplied (every other token's footprint), the
   * actor routes around creatures and the grid edge, and only ever steps onto a
   * cell the scene runtime will accept, so the move it proposes never fails
   * re-validation (no phantom damage, no token stacking).
   */
  movement?: MovementContext;
  /**
   * Strategist hints for THIS actor (Phase 12): a clamped, advisory bias on
   * specific targets' utility scores. Omitted/empty → pure heuristic scoring.
   * Advisory only — a hint cannot make an illegal target actable.
   */
  hints?: readonly TacticalHint[];
}

export type TacticalDecisionKind = 'attack' | 'move-to-engage' | 'no-target';

/** Movement taken this turn (autonomous rounds execute it as a scene intent). */
export interface TacticalMoveRecord {
  to: { x: number; y: number };
  /** The move-token intent for scene application. */
  intent: SceneActionIntent;
}

/** One resolved attack within a turn (Multiattack yields several). */
export interface TacticalAttackRecord {
  targetId: string;
  resolution: AttackResolution;
  /** The scene action to apply, when this attack dealt damage. */
  intent?: SceneActionIntent;
}

export interface TacticalTurnResult {
  actorId: string;
  decision: TacticalDecisionKind;
  /** Every hostile target, scored — the full transparent decision. */
  scored: ScoredTarget[];
  /** The chosen target id, when a target was selected (first attack's). */
  chosenTargetId?: string;
  /** The first resolved attack, when an attack was made (see `attacks`). */
  resolution?: AttackResolution;
  /** The first attack's scene action, when it dealt damage (see `attacks`). */
  intent?: SceneActionIntent;
  /** Movement executed this turn (move-and-attack or move-to-engage). */
  move?: TacticalMoveRecord;
  /** Every attack this turn, in order (length > 1 under Multiattack). */
  attacks: TacticalAttackRecord[];
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
  const scored = scoreTargets(input.actor, input.targets, input.hints);

  if (scored.length === 0) {
    return {
      actorId: input.actor.tokenId,
      decision: 'no-target',
      scored,
      attacks: [],
      rationale: 'No hostile, living targets remain.',
    };
  }

  let firstReachable = scored.find((target) => target.inReach);
  let move;
  let actor = input.actor;
  if (!firstReachable) {
    // Move + attack in one turn (RAW): plan an obstacle-aware path toward the
    // best target and stop at the nearest legal cell from which it is in reach.
    // With a movement context the route avoids creatures and the grid edge and
    // the destination is always a cell the scene runtime accepts; without one
    // (open field) it reduces to the straight-line approach. Deterministic — no
    // RNG is consumed by movement.
    const nearest = scored[0];
    const nearestTarget = input.targets.find((t) => t.tokenId === nearest.tokenId)!;
    const speed = Math.max(1, Math.floor(actor.speedCells ?? 6));
    const reach = actor.reach ?? 1;
    // Other living hostiles to weigh when choosing among equally-fast attack
    // cells (engagement/influence): stand where the most enemies are threatened.
    const engageableIds = new Set(scored.map((candidate) => candidate.tokenId));
    const engagementTargets = input.targets
      .filter((candidate) => engageableIds.has(candidate.tokenId))
      .map((candidate) => candidate.position);
    const plan = planApproach({
      from: actor.position,
      size: actor.size ?? 1,
      speed,
      reach,
      goal: nearestTarget.position,
      context: input.movement ?? OPEN_MOVEMENT,
      engagementTargets,
    });
    if (plan.moved) {
      move = {
        to: plan.to,
        intent: { type: 'move-token' as const, tokenId: actor.tokenId, position: plan.to },
      };
      actor = { ...actor, position: plan.to };
      // Re-score from the new position; attack if anything is now in reach.
      const rescored = scoreTargets(actor, input.targets, input.hints);
      firstReachable = rescored.find((target) => target.inReach);
      if (!firstReachable) {
        return {
          actorId: actor.tokenId,
          decision: 'move-to-engage',
          scored: rescored,
          chosenTargetId: nearest.tokenId,
          move,
          attacks: [],
          rationale: `Moved ${plan.steps} cells toward ${nearest.tokenId} (still ${gridDistance(
            plan.to,
            nearestTarget.position
          )} cells away).`,
        };
      }
    } else {
      return {
        actorId: actor.tokenId,
        decision: 'move-to-engage',
        scored,
        chosenTargetId: nearest.tokenId,
        attacks: [],
        rationale: `Best target ${nearest.tokenId} is ${nearest.distance} cells away, beyond reach; no legal path to close.`,
      };
    }
  }

  const targetsById = new Map(input.targets.map((candidate) => [candidate.tokenId, candidate]));
  // Working HP for this turn only, so a Multiattack sequence re-targets after
  // a kill. Targets without HP are treated as standing (cannot drop).
  const workingHp = new Map<string, number>();
  for (const candidate of input.targets) {
    if (candidate.hp) workingHp.set(candidate.tokenId, candidate.hp.current);
  }
  const isDown = (tokenId: string) => (workingHp.get(tokenId) ?? 1) <= 0;

  // One seeded stream per actor→target pair; sequential resolutions consume
  // rolls from it, so repeated attacks differ while staying deterministic.
  const rngByTarget = new Map<string, ReturnType<typeof participantRng>>();
  const rngFor = (targetId: string) => {
    let rng = rngByTarget.get(targetId);
    if (!rng) {
      rng = participantRng(input.seed, actor.tokenId, targetId);
      rngByTarget.set(targetId, rng);
    }
    return rng;
  };

  // RAW (3.5/5e family): moving permits a single attack, not a full attack /
  // Multiattack routine.
  const attackCount = move ? 1 : Math.max(1, Math.floor(input.actor.attacksPerRound ?? 1));
  const attacks: TacticalAttackRecord[] = [];
  let currentTargetId: string | undefined = firstReachable.tokenId;

  for (let attackIndex = 0; attackIndex < attackCount; attackIndex += 1) {
    if (currentTargetId == null || isDown(currentTargetId)) {
      currentTargetId = scored.find(
        (candidate) => candidate.inReach && !isDown(candidate.tokenId)
      )?.tokenId;
      if (currentTargetId == null) break; // nothing left in reach
    }

    const target = targetsById.get(currentTargetId)!;
    // Legacy-d20 iteratives: the 2nd/3rd/4th attack of a full attack rolls at
    // a cumulative -step (3.5e/PF1e: -5/-10/-15). Zero/undefined keeps the 5e
    // Multiattack model (full bonus on every attack).
    const iterativePenalty = (actor.iterativePenaltyStep ?? 0) * attackIndex;
    const attackEffects: readonly EffectInstance[] = iterativePenalty
      ? [
          ...actor.attackEffects,
          {
            id: makeEffectId('tactical', 'iterative', actor.tokenId, attackIndex),
            systemId: actor.attackEffects[0]?.systemId ?? 'pf1e',
            target: 'attack',
            operation: 'subtract',
            value: iterativePenalty,
            stackPolicy: 'sum',
            source: { kind: 'system', label: 'iterative attack' },
            label: `Iterative attack ${attackIndex + 1} (-${iterativePenalty})`,
          },
        ]
      : actor.attackEffects;
    const resolution = resolveAttack({
      attackEffects,
      damageEffects: actor.damageEffects,
      targetValue: target.armorClass,
      critOn: actor.critOn,
      degreeModel: input.degreeModel,
      rng: rngFor(currentTargetId),
    });

    const intent = attackToDamageIntent(actor.tokenId, currentTargetId, resolution, input.cause);
    attacks.push({ targetId: currentTargetId, resolution, intent });

    if (resolution.isHit && workingHp.has(currentTargetId)) {
      workingHp.set(
        currentTargetId,
        Math.max(0, workingHp.get(currentTargetId)! - resolution.damage)
      );
    }
  }

  const first = attacks[0];
  const hits = attacks.filter((attack) => attack.resolution.isHit);
  const totalDamage = hits.reduce((sum, attack) => sum + attack.resolution.damage, 0);
  const summary =
    attacks.length === 1
      ? first.resolution.isHit
        ? `Attacked ${first.targetId} (score ${firstReachable.score}): hit for ${first.resolution.damage}.`
        : `Attacked ${first.targetId} (score ${firstReachable.score}): missed.`
      : `Made ${attacks.length} attacks (${hits.length} hit, ${totalDamage} total damage).`;

  return {
    actorId: actor.tokenId,
    decision: 'attack',
    scored,
    chosenTargetId: first?.targetId,
    resolution: first?.resolution,
    intent: first?.intent,
    ...(move ? { move } : {}),
    attacks,
    rationale: move ? `Moved and attacked: ${summary}` : summary,
  };
}
