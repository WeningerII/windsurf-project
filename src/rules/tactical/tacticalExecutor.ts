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
  /** Hit/crit model for every attack this turn (default 'd20'). */
  degreeModel?: 'd20' | 'pf2e';
}

export type TacticalDecisionKind = 'attack' | 'move-to-engage' | 'no-target';

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
  const scored = scoreTargets(input.actor, input.targets);

  if (scored.length === 0) {
    return {
      actorId: input.actor.tokenId,
      decision: 'no-target',
      scored,
      attacks: [],
      rationale: 'No hostile, living targets remain.',
    };
  }

  const firstReachable = scored.find((target) => target.inReach);
  if (!firstReachable) {
    const nearest = scored[0];
    return {
      actorId: input.actor.tokenId,
      decision: 'move-to-engage',
      scored,
      chosenTargetId: nearest.tokenId,
      attacks: [],
      rationale: `Best target ${nearest.tokenId} is ${nearest.distance} cells away, beyond reach; close to engage.`,
    };
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
      rng = participantRng(input.seed, input.actor.tokenId, targetId);
      rngByTarget.set(targetId, rng);
    }
    return rng;
  };

  const attackCount = Math.max(1, Math.floor(input.actor.attacksPerRound ?? 1));
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
    const resolution = resolveAttack({
      attackEffects: input.actor.attackEffects,
      damageEffects: input.actor.damageEffects,
      targetValue: target.armorClass,
      critOn: input.actor.critOn,
      degreeModel: input.degreeModel,
      rng: rngFor(currentTargetId),
    });

    const intent = attackToDamageIntent(
      input.actor.tokenId,
      currentTargetId,
      resolution,
      input.cause
    );
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
    actorId: input.actor.tokenId,
    decision: 'attack',
    scored,
    chosenTargetId: first?.targetId,
    resolution: first?.resolution,
    intent: first?.intent,
    attacks,
    rationale: summary,
  };
}
