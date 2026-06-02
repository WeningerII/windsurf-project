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

import type { SceneActionIntent, SceneCoordinate } from '../../types/core/scene';
import { resolveAttack, type AttackResolution } from '../resolver/attackResolution';
import {
  participantRng,
  resolveAreaEffect,
  type SaveModel,
} from '../resolver/participantResolution';
import { areaEffectToDamageIntent, attackToDamageIntent } from '../resolver/sceneCombat';
import { resolveDaggerheartAttack } from '../resolver/daggerheartResolution';
import { computeAreaParticipants, type SceneAreaAction } from '../resolver/areaParticipants';
import { moveToward } from './pathfinding';
import type { BlockPredicate } from '../resolver/lineOfEffect';
import type { DiagonalRule } from '../resolver/areaTargeting';
import {
  isHostile,
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
  /** Walls (for area line of effect/cover); default: no walls. */
  isBlocked?: BlockPredicate;
  /** Diagonal counting rule for area range; default chebyshev. */
  diagonalRule?: DiagonalRule;
  /** Save model for area effects; default binary (5e/3.5e/PF1e). */
  saveModel?: SaveModel;
  /** System id (drives cover→save bonus); default unset. */
  systemId?: string;
}

export type TacticalDecisionKind = 'attack' | 'area-effect' | 'move-to-engage' | 'no-target';

export interface TacticalTurnResult {
  actorId: string;
  decision: TacticalDecisionKind;
  /** Every hostile target, scored — the full transparent decision. */
  scored: ScoredTarget[];
  /** The chosen target id, when a single target was selected. */
  chosenTargetId?: string;
  /** The resolved attack, when a single attack was made. */
  resolution?: AttackResolution;
  /** The area action unleashed, when the decision was `area-effect`. */
  chosenAreaActionName?: string;
  /** Where the area action was aimed. */
  areaAim?: SceneCoordinate;
  /** Token ids the area action caught. */
  areaCaughtIds?: string[];
  /** The cell the actor moved to this turn (when it closed distance). */
  moveTo?: SceneCoordinate;
  /** The scene action to apply, when damage was dealt. */
  intent?: SceneActionIntent;
  /** Why this decision was reached. */
  rationale: string;
}

/**
 * Minimum (enemies − allies) an area action must catch to be preferred over a
 * single attack: an AoE is worth it when it hits at least two more foes than
 * friends. A lone enemy is better served by a focused attack.
 */
const AOE_MIN_NET = 2;

interface AreaPlan {
  action: SceneAreaAction;
  aim: SceneCoordinate;
  caughtIds: string[];
  participants: ReturnType<typeof computeAreaParticipants>['participants'];
  enemies: number;
  allies: number;
  net: number;
}

/**
 * Pick the best placement of the actor's best area action: for each action and
 * each candidate aim (every living target's cell, plus the actor's own for
 * self-centered emanations), count the enemies vs allies the template would
 * catch (line of effect applied) and keep the highest net-enemy placement. AoE
 * is RAW indiscriminate, so allies in the blast count against the placement —
 * the AI aims to spare them. Returns undefined when no placement clears the bar.
 */
function bestAreaPlan(input: TacticalTurnInput): AreaPlan | undefined {
  const { actor, targets } = input;
  if (!actor.areaActions || actor.areaActions.length === 0) return undefined;

  const living = targets.filter((target) => !target.hp || target.hp.current > 0);
  const factionOf = new Map(targets.map((target) => [target.tokenId, target.faction]));
  let best: AreaPlan | undefined;

  for (const action of actor.areaActions) {
    const aims: SceneCoordinate[] = [actor.position, ...living.map((target) => target.position)];
    for (const aim of aims) {
      const candidates = living.map((target) => ({
        id: target.tokenId,
        position: target.position,
        saveBonus: target.saveBonus?.(action.saveAbility) ?? 0,
      }));
      const selection = computeAreaParticipants({
        area: action.area,
        emitter: actor.position,
        aim,
        candidates,
        systemId: input.systemId ?? '',
        rule: input.diagonalRule,
        isBlocked: input.isBlocked,
      });
      let enemies = 0;
      let allies = 0;
      for (const id of selection.caughtIds) {
        if (isHostile(actor.faction, factionOf.get(id) ?? actor.faction)) enemies += 1;
        else allies += 1;
      }
      const net = enemies - allies;
      if (enemies >= 2 && net >= AOE_MIN_NET) {
        if (!best || net > best.net || (net === best.net && enemies > best.enemies)) {
          best = {
            action,
            aim,
            caughtIds: selection.caughtIds,
            participants: selection.participants,
            enemies,
            allies,
            net,
          };
        }
      }
    }
  }
  return best;
}

interface StrikeOutcome {
  intent?: SceneActionIntent;
  resolution?: AttackResolution;
  hit: boolean;
  narration: string;
}

/**
 * Resolve one attacker→target strike, dispatching per system: Daggerheart marks
 * 1-3 HP slots by threshold; everyone else is d20 attack-vs-AC → damage. Both
 * land as a single apply-damage intent, so the round driver folds either the same
 * way. (M&M's condition track isn't auto-resolved here — its tokens have no HP and
 * so aren't in the round; it remains a manual-attack path for now.)
 */
function resolveStrike(input: TacticalTurnInput, target: TacticalTarget): StrikeOutcome {
  const { actor } = input;
  const rng = participantRng(input.seed, actor.tokenId, target.tokenId);

  if (input.systemId === 'daggerheart' && target.thresholds) {
    const dh = resolveDaggerheartAttack({
      attackEffects: actor.attackEffects,
      damageEffects: actor.damageEffects,
      evasion: target.armorClass,
      thresholds: target.thresholds,
      rng,
    });
    const intent: SceneActionIntent | undefined =
      dh.isHit && dh.hpMarked > 0
        ? {
            type: 'apply-damage',
            actorId: actor.tokenId,
            cause: input.cause,
            damages: [{ tokenId: target.tokenId, amount: dh.hpMarked }],
          }
        : undefined;
    return { intent, hit: dh.isHit, narration: dh.isHit ? `marked ${dh.hpMarked} HP` : 'missed' };
  }

  const resolution = resolveAttack({
    attackEffects: actor.attackEffects,
    damageEffects: actor.damageEffects,
    targetValue: target.armorClass,
    critOn: actor.critOn,
    rng,
  });
  return {
    intent: attackToDamageIntent(actor.tokenId, target.tokenId, resolution, input.cause),
    resolution,
    hit: resolution.isHit,
    narration: resolution.isHit
      ? `${resolution.isCriticalHit ? 'crit for' : 'hit for'} ${resolution.damage}`
      : 'missed',
  };
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

  // Prefer an area action when it catches enough foes (and not too many friends).
  const areaPlan = bestAreaPlan(input);
  if (areaPlan) {
    const result = resolveAreaEffect({
      sourceId: input.actor.tokenId,
      seed: input.seed,
      damageEffects: areaPlan.action.damageEffects,
      saveDC: areaPlan.action.saveDC,
      halfOnSave: areaPlan.action.halfOnSave,
      saveModel: input.saveModel ?? 'binary',
      participants: areaPlan.participants,
    });
    const allies = areaPlan.allies > 0 ? ` (${areaPlan.allies} ally/allies caught)` : '';
    return {
      actorId: input.actor.tokenId,
      decision: 'area-effect',
      scored,
      chosenAreaActionName: areaPlan.action.name,
      areaAim: areaPlan.aim,
      areaCaughtIds: areaPlan.caughtIds,
      intent: areaEffectToDamageIntent(result, input.cause),
      rationale: `Unleashed ${areaPlan.action.name}: ${areaPlan.enemies} enemies${allies} caught for ${result.totalDamageDealt} total damage.`,
    };
  }

  const reachable = scored.find((target) => target.inReach);
  if (!reachable) {
    // Out of reach: actually move toward the best target, around walls and bodies.
    const nearest = scored[0];
    const nearestTarget = input.targets.find((t) => t.tokenId === nearest.tokenId)!;
    const reach = input.actor.reach ?? 1;
    const occupied: BlockPredicate = (cell) =>
      input.targets.some(
        (t) => t.tokenId !== nearest.tokenId && t.position.x === cell.x && t.position.y === cell.y
      );
    const move = moveToward({
      from: input.actor.position,
      target: nearestTarget.position,
      speed: input.actor.speed ?? 6,
      reach,
      isBlocked: input.isBlocked,
      isOccupied: occupied,
      rule: input.diagonalRule,
    });

    // If the move closes to reach, attack from the new position (move + strike).
    if (move.inReach) {
      const strike = resolveStrike(input, nearestTarget);
      return {
        actorId: input.actor.tokenId,
        decision: 'attack',
        scored,
        chosenTargetId: nearest.tokenId,
        moveTo: move.destination,
        resolution: strike.resolution,
        intent: strike.intent,
        rationale: `Moved ${move.cost} to engage ${nearest.tokenId}, then ${strike.narration}.`,
      };
    }

    return {
      actorId: input.actor.tokenId,
      decision: 'move-to-engage',
      scored,
      chosenTargetId: nearest.tokenId,
      moveTo: move.destination,
      rationale:
        move.cost > 0
          ? `Closed ${move.cost} cells toward ${nearest.tokenId} (still out of reach).`
          : `Cannot path toward ${nearest.tokenId}.`,
    };
  }

  const target = input.targets.find((candidate) => candidate.tokenId === reachable.tokenId)!;
  const strike = resolveStrike(input, target);
  return {
    actorId: input.actor.tokenId,
    decision: 'attack',
    scored,
    chosenTargetId: reachable.tokenId,
    resolution: strike.resolution,
    intent: strike.intent,
    rationale: `Attacked ${reachable.tokenId} (score ${reachable.score}): ${strike.narration}.`,
  };
}
