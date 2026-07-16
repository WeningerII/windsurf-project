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

import type { SceneActionIntent, SceneCoordinate } from '../../types/core/scene';
import { resolveAttack, type AttackResolution } from '../resolver/attackResolution';
import { resolveEffects } from '../resolver/resolve';
import { makeEffectId, type EffectInstance } from '../ir/types';
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
  /** Critical-damage model for every attack this turn (default 'double-dice'). */
  critModel?: 'double-dice' | 'confirm-multiply';
  /**
   * Functional terrain (RFC 003 Phase 4): the effects at a grid cell, looked up
   * by CURRENT position so a combatant that moved this turn is judged from where
   * it ends up. Attacker-cell effects join the attack (high ground → +to-hit);
   * the target-cell cover bonus raises the AC the attack must beat — the same
   * fold `resolveSceneAttack` applies on the manual path. Omitted → no terrain
   * (a byte-identical round). Kept as a callback so this layer stays free of
   * scene plumbing; it only affects resolution here, not target scoring.
   */
  terrainAt?: (pos: SceneCoordinate) => readonly EffectInstance[];
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

  // Difficult terrain (RFC 003 Phase 4): the movement cost to ENTER a cell —
  // base 1, raised by any `target:'movement'` terrain effect there. Reuses the
  // same terrainAt lookup as attack terrain; absent callback → a flat 1, so
  // scenes without difficult terrain move exactly as before.
  const movementCostAt = (pos: SceneCoordinate): number =>
    input.terrainAt
      ? Math.max(1, 1 + (resolveEffects(input.terrainAt(pos), {}).byTarget.movement?.total ?? 0))
      : 1;

  let firstReachable = scored.find((target) => target.inReach);
  let move;
  let actor = input.actor;
  if (!firstReachable) {
    // Execute movement (RAW: move + attack in one turn): step up to speed
    // cells toward the best target along the Chebyshev line, stopping at
    // reach. Deterministic — no RNG is consumed by movement.
    const nearest = scored[0];
    const nearestTarget = input.targets.find((t) => t.tokenId === nearest.tokenId)!;
    const speed = Math.max(1, Math.floor(actor.speedCells ?? 6));
    const reach = actor.reach ?? 1;
    const from = actor.position;
    const goal = nearestTarget.position;
    let { x, y } = from;
    let stepsLeft = speed;
    while (stepsLeft > 0 && Math.max(Math.abs(goal.x - x), Math.abs(goal.y - y)) > reach) {
      const nx = x + Math.sign(goal.x - x);
      const ny = y + Math.sign(goal.y - y);
      // Entering the next cell costs its movement cost; RAW you cannot step into
      // difficult terrain without the full movement to do so, so stop if unpaid.
      const cost = movementCostAt({ x: nx, y: ny });
      if (cost > stepsLeft) break;
      x = nx;
      y = ny;
      stepsLeft -= cost;
    }
    const cellsMoved = Math.max(Math.abs(x - from.x), Math.abs(y - from.y));
    if (x !== from.x || y !== from.y) {
      move = {
        to: { x, y },
        intent: { type: 'move-token' as const, tokenId: actor.tokenId, position: { x, y } },
      };
      actor = { ...actor, position: { x, y } };
      // Re-score from the new position; attack if anything is now in reach.
      const rescored = scoreTargets(actor, input.targets);
      firstReachable = rescored.find((target) => target.inReach);
      if (!firstReachable) {
        return {
          actorId: actor.tokenId,
          decision: 'move-to-engage',
          scored: rescored,
          chosenTargetId: nearest.tokenId,
          move,
          attacks: [],
          rationale: `Moved ${cellsMoved} cells toward ${nearest.tokenId} (still ${Math.max(
            Math.abs(goal.x - x),
            Math.abs(goal.y - y)
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
        rationale: `Best target ${nearest.tokenId} is ${nearest.distance} cells away, beyond reach; close to engage.`,
      };
    }
  }

  const targetsById = new Map(input.targets.map((candidate) => [candidate.tokenId, candidate]));

  // Terrain at the actor's FINAL cell (after any move this turn) folds into
  // every attack; each target's cover is read from ITS cell at resolve time.
  // The resolver buckets by target, so attacker-cell cover adds no bogus to-hit
  // and a target on high ground gains no bogus cover. Empty/absent → no change.
  const attackerTerrain = input.terrainAt ? input.terrainAt(actor.position) : [];
  const coverBonusAt = (candidate: TacticalTarget): number =>
    input.terrainAt
      ? (resolveEffects(input.terrainAt(candidate.position), {}).byTarget.ac?.total ?? 0)
      : 0;
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
    const iterativeEffect: EffectInstance | null = iterativePenalty
      ? {
          id: makeEffectId('tactical', 'iterative', actor.tokenId, attackIndex),
          systemId: actor.attackEffects[0]?.systemId ?? 'pf1e',
          target: 'attack',
          operation: 'subtract',
          value: iterativePenalty,
          stackPolicy: 'sum',
          source: { kind: 'system', label: 'iterative attack' },
          label: `Iterative attack ${attackIndex + 1} (-${iterativePenalty})`,
        }
      : null;
    const attackEffects: readonly EffectInstance[] = [
      ...actor.attackEffects,
      ...attackerTerrain,
      ...(iterativeEffect ? [iterativeEffect] : []),
    ];
    const resolution = resolveAttack({
      attackEffects,
      damageEffects: actor.damageEffects,
      targetValue: target.armorClass + coverBonusAt(target),
      critOn: actor.critOn,
      degreeModel: input.degreeModel,
      critModel: input.critModel,
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

  // 5e Two-Weapon Fighting: one bonus-action off-hand attack after the
  // Attack-action attacks, using the off-hand weapon's own damage profile
  // (no ability modifier unless the TWF style). Re-targets if the current
  // target dropped; draws from the same per-target seeded stream.
  if (actor.offHandAttack && !move) {
    if (currentTargetId == null || isDown(currentTargetId)) {
      currentTargetId = scored.find(
        (candidate) => candidate.inReach && !isDown(candidate.tokenId)
      )?.tokenId;
    }
    if (currentTargetId != null) {
      const target = targetsById.get(currentTargetId)!;
      const resolution = resolveAttack({
        attackEffects: [...actor.offHandAttack.attackEffects, ...attackerTerrain],
        damageEffects: actor.offHandAttack.damageEffects,
        targetValue: target.armorClass + coverBonusAt(target),
        critOn: actor.critOn,
        degreeModel: input.degreeModel,
        critModel: input.critModel,
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
