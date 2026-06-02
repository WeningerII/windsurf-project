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
import {
  critModelForSystem,
  resolveAttack,
  type AttackResolution,
} from '../resolver/attackResolution';
import {
  participantRng,
  resolveAreaEffect,
  type SaveModel,
} from '../resolver/participantResolution';
import { areaEffectToDamageIntent, attackToDamageIntent } from '../resolver/sceneCombat';
import { resolveDaggerheartAttack } from '../resolver/daggerheartResolution';
import { resolveMam3eAttack } from '../resolver/mam3eResolution';
import { computeAreaParticipants, type SceneAreaAction } from '../resolver/areaParticipants';
import { moveToward } from './pathfinding';
import { flankToHitBonus, isFlanking } from './flanking';
import { coverAcBonus, coverBetween, type BlockPredicate } from '../resolver/lineOfEffect';
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
  /** Per-cell movement entering cost (≥1; difficult terrain). Default 1. */
  enterCost?: (cell: SceneCoordinate) => number;
}

export type TacticalDecisionKind = 'attack' | 'area-effect' | 'move-to-engage' | 'no-target';

export interface TacticalTurnResult {
  actorId: string;
  decision: TacticalDecisionKind;
  /** Every hostile target, scored — the full transparent decision. */
  scored: ScoredTarget[];
  /** The chosen target id, when a single target was selected. */
  chosenTargetId?: string;
  /** The resolved attack (the first swing, when several were made). */
  resolution?: AttackResolution;
  /** Number of swings this attack action made (Multiattack / Extra Attack). */
  attacks?: number;
  /** How many of those swings hit. */
  hits?: number;
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
 * 1-3 HP slots by threshold; M&M forces a Toughness save → condition track (no
 * HP, lands as an apply-conditions intent); everyone else is d20 attack-vs-AC →
 * damage. Each lands as a single scene intent, so the round driver folds it
 * uniformly (damage decrements working HP; an incapacitating M&M hit drops the
 * target to the down proxy).
 */
function resolveStrike(
  input: TacticalTurnInput,
  target: TacticalTarget,
  rng: ReturnType<typeof participantRng>
): StrikeOutcome {
  const { actor } = input;

  // Cover between attacker and target: total cover is no line of sight; otherwise
  // a per-system bonus folded into the target's defense. Flanking (3.5e/PF1e/PF2e)
  // pulls the other way, lowering the effective defense by its to-hit value.
  const cover = input.isBlocked
    ? coverBetween(actor.position, target.position, input.isBlocked)
    : 'none';
  if (cover === 'total') {
    return { hit: false, narration: 'no line of sight' };
  }
  const flank = flankToHitBonus(input.systemId);
  const flanked =
    flank > 0 &&
    isFlanking({
      attacker: actor.position,
      target: target.position,
      reach: actor.reach ?? 1,
      allies: input.targets
        .filter((other) => other.faction === actor.faction)
        .map((other) => other.position),
      rule: input.diagonalRule,
    });
  const defenseBonus = coverAcBonus(cover, input.systemId ?? '') - (flanked ? flank : 0);

  if (input.systemId === 'daggerheart' && target.thresholds) {
    const dh = resolveDaggerheartAttack({
      attackEffects: actor.attackEffects,
      damageEffects: actor.damageEffects,
      evasion: target.armorClass + defenseBonus,
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

  if (input.systemId === 'mam3e' && target.toughness != null) {
    const mm = resolveMam3eAttack({
      attackEffects: actor.attackEffects,
      targetDefense: target.armorClass + defenseBonus,
      effectRank: actor.effectRank ?? 0,
      toughness: target.toughness,
      rng,
    });
    const landed =
      mm.condition.bruised > 0 ||
      mm.condition.dazed ||
      mm.condition.staggered ||
      mm.condition.incapacitated;
    const intent: SceneActionIntent | undefined =
      mm.isHit && landed
        ? {
            type: 'apply-conditions',
            actorId: actor.tokenId,
            tokenId: target.tokenId,
            delta: mm.condition,
          }
        : undefined;
    const effect = mm.condition.incapacitated
      ? 'incapacitated'
      : mm.condition.staggered
        ? 'staggered'
        : mm.condition.dazed
          ? 'dazed'
          : mm.condition.bruised > 0
            ? 'bruised'
            : 'shrugged it off';
    return {
      intent,
      hit: mm.isHit,
      narration: mm.isHit ? effect : 'missed',
    };
  }

  const resolution = resolveAttack({
    attackEffects: actor.attackEffects,
    damageEffects: actor.damageEffects,
    targetValue: target.armorClass + defenseBonus,
    critOn: actor.critOn,
    critModel: critModelForSystem(input.systemId),
    critMultiplier: actor.critMultiplier,
    targetDefenses: target.damageDefenses,
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

/** The damage an apply-damage intent deals to a specific token (0 otherwise). */
function damageToTarget(intent: SceneActionIntent | undefined, tokenId: string): number {
  if (!intent || intent.type !== 'apply-damage') return 0;
  return intent.damages.find((d) => d.tokenId === tokenId)?.amount ?? 0;
}

interface MultiStrikeOutcome {
  intent?: SceneActionIntent;
  /** The first swing's resolution (for crit/hit logging). */
  resolution?: AttackResolution;
  attacks: number;
  hits: number;
  totalDamage: number;
  narration: string;
}

/**
 * Resolve a full attack action — all the actor's swings (Multiattack / Extra
 * Attack) against one target. The first swing uses the same seeded stream as a
 * lone attack, so single-attack outcomes are unchanged; extra swings draw their
 * own sub-streams. Damage across swings folds into ONE apply-damage intent so
 * the round driver applies the turn once. (M&M's condition track and other
 * non-damage intents only ever occur at one swing, so they pass through.)
 */
function resolveStrikes(input: TacticalTurnInput, target: TacticalTarget): MultiStrikeOutcome {
  const { actor } = input;
  const attacks = Math.max(1, Math.floor(actor.attacksPerTurn ?? 1));

  const strikes = Array.from({ length: attacks }, (_, i) => {
    const rng =
      i === 0
        ? participantRng(input.seed, actor.tokenId, target.tokenId)
        : participantRng(input.seed, actor.tokenId, target.tokenId, `attack${i}`);
    return resolveStrike(input, target, rng);
  });

  if (attacks === 1) {
    const only = strikes[0];
    return {
      intent: only.intent,
      resolution: only.resolution,
      attacks: 1,
      hits: only.hit ? 1 : 0,
      totalDamage: damageToTarget(only.intent, target.tokenId),
      narration: only.narration,
    };
  }

  let hits = 0;
  let totalDamage = 0;
  for (const strike of strikes) {
    if (strike.hit) hits += 1;
    totalDamage += damageToTarget(strike.intent, target.tokenId);
  }
  const intent: SceneActionIntent | undefined =
    totalDamage > 0
      ? {
          type: 'apply-damage',
          actorId: actor.tokenId,
          cause: input.cause,
          damages: [{ tokenId: target.tokenId, amount: totalDamage }],
        }
      : undefined;
  return {
    intent,
    resolution: strikes[0].resolution,
    attacks,
    hits,
    totalDamage,
    narration: `${hits}/${attacks} attacks hit for ${totalDamage}`,
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

  // Prefer a target we actually have a line of sight to: a totally-covered foe
  // can't be hit, so attacking it would waste the turn. With no walls every
  // target is visible, so this is a no-op until cover is in play.
  const hasLineOfSight = (tokenId: string): boolean => {
    if (!input.isBlocked) return true;
    const candidate = input.targets.find((t) => t.tokenId === tokenId);
    return (
      !candidate ||
      coverBetween(input.actor.position, candidate.position, input.isBlocked) !== 'total'
    );
  };

  const reachable = scored.find((target) => target.inReach && hasLineOfSight(target.tokenId));
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
      enterCost: input.enterCost,
      rule: input.diagonalRule,
    });

    // If the move closes to reach, attack FROM the new cell: cover and flanking
    // are position-dependent, so the strike must see the destination, not the
    // pre-move position. (The roll is seeded by token ids, so it is unchanged.)
    if (move.inReach) {
      const movedInput = {
        ...input,
        actor: { ...input.actor, position: move.destination },
      };
      const strike = resolveStrikes(movedInput, nearestTarget);
      return {
        actorId: input.actor.tokenId,
        decision: 'attack',
        scored,
        chosenTargetId: nearest.tokenId,
        moveTo: move.destination,
        resolution: strike.resolution,
        attacks: strike.attacks,
        hits: strike.hits,
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
  const strike = resolveStrikes(input, target);
  return {
    actorId: input.actor.tokenId,
    decision: 'attack',
    scored,
    chosenTargetId: reachable.tokenId,
    resolution: strike.resolution,
    attacks: strike.attacks,
    hits: strike.hits,
    intent: strike.intent,
    rationale: `Attacked ${reachable.tokenId} (score ${reachable.score}): ${strike.narration}.`,
  };
}
