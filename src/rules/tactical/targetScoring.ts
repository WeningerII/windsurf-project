/**
 * Tactical target scoring — the N-participant decision layer.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution" + the tactical-executor phase.
 *
 * A combatant's turn is a decision over EVERY candidate in the loop, not just
 * the nearest one. This module scores each eligible target with a pure,
 * deterministic utility heuristic so the choice (and its reasoning) is
 * transparent and replayable, and so an action's downstream value — e.g.
 * removing a combatant from the initiative loop entirely — is weighed, not just
 * the immediate hit. No RNG here; scoring is pure arithmetic. Resolution (the
 * dice) happens after selection, seeded.
 *
 * Movement/pathfinding is intentionally out of scope for this slice: we score
 * reach from current positions and flag whether a target is in reach. A later
 * phase adds movement toward the best out-of-reach target.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance } from '../resolver/areaTargeting';
import type { SceneAreaAction } from '../resolver/areaParticipants';
import type { EffectInstance } from '../ir/types';

/** A combatant taking a turn. Assembled by the caller from character/monster data. */
export interface TacticalActor {
  tokenId: string;
  faction: string;
  position: SceneCoordinate;
  /** Attack-roll effects (proficiency/ability/item). */
  attackEffects: readonly EffectInstance[];
  /** Damage effects (weapon dice + flat bonuses). */
  damageEffects: readonly EffectInstance[];
  /** Reach in grid cells (melee = 1). Undefined means unlimited (ranged). */
  reach?: number;
  critOn?: number;
  /** Weapon critical multiplier (3.5e/PF1e ×2/×3/×4); defaults to ×2 when absent. */
  critMultiplier?: number;
  /** Movement budget in grid cells per turn (for closing distance). */
  speed?: number;
  /** M&M effect rank of this combatant's attack (Toughness DC = 15 + rank). */
  effectRank?: number;
  /** Save-based area actions (breath / spells) this combatant may unleash. */
  areaActions?: readonly SceneAreaAction[];
}

/** A potential target on the grid. */
export interface TacticalTarget {
  tokenId: string;
  faction: string;
  position: SceneCoordinate;
  armorClass: number;
  hp?: { current: number; max: number };
  /** Saving-throw bonus accessor (for being caught in someone's area effect). */
  saveBonus?: (ability: string) => number;
  /** Daggerheart damage thresholds — present makes attacks mark HP slots. */
  thresholds?: { major: number; severe: number };
  /** M&M Toughness save bonus — present makes attacks force a Toughness save. */
  toughness?: number;
}

/** A scored candidate — every eligible target is acknowledged with a score. */
export interface ScoredTarget {
  tokenId: string;
  score: number;
  distance: number;
  inReach: boolean;
  /** True when the actor's MAX possible damage could drop the target this hit. */
  canFinish: boolean;
  /** Human-readable reasons that composed the score (provenance for the choice). */
  reasons: string[];
}

// Scoring weights. Documented and centralized so the heuristic is legible and
// tunable. Higher score = more desirable target.
const SCORE_BASE = 100;
const DISTANCE_WEIGHT = 2; // each cell of distance reduces desirability
const WOUND_WEIGHT = 20; // prefer wounded targets (focus fire)
const IN_REACH_BONUS = 10; // attackable now without moving
const FINISHER_BONUS = 25; // can remove this combatant from the loop now

/** Max possible damage from a set of damage effects (die faces + flat adds). */
export function maxPossibleDamage(damageEffects: readonly EffectInstance[]): number {
  let total = 0;
  for (const effect of damageEffects) {
    const value = typeof effect.value === 'number' ? effect.value : 0;
    if (effect.operation === 'add-die') {
      total += value; // best case: the die rolls its maximum (= sides)
    } else if (effect.operation === 'add') {
      total += value;
    } else if (effect.operation === 'subtract') {
      total -= value;
    }
  }
  return Math.max(0, total);
}

/** True when two combatants are on opposing sides. */
export function isHostile(actorFaction: string, targetFaction: string): boolean {
  return actorFaction !== targetFaction;
}

/**
 * Score a single target for the actor. Pure; deterministic. Returns the score
 * and the reasons that composed it.
 */
export function scoreTarget(actor: TacticalActor, target: TacticalTarget): ScoredTarget {
  const distance = gridDistance(actor.position, target.position);
  const inReach = actor.reach === undefined || distance <= actor.reach;
  const reasons: string[] = [];

  let score = SCORE_BASE;

  const distancePenalty = distance * DISTANCE_WEIGHT;
  score -= distancePenalty;
  if (distancePenalty > 0) reasons.push(`-${distancePenalty} distance (${distance})`);

  const hpFraction =
    target.hp && target.hp.max > 0 ? Math.max(0, target.hp.current) / target.hp.max : 1;
  const woundBonus = Math.round((1 - hpFraction) * WOUND_WEIGHT);
  if (woundBonus > 0) {
    score += woundBonus;
    reasons.push(`+${woundBonus} wounded (${Math.round(hpFraction * 100)}% hp)`);
  }

  if (inReach) {
    score += IN_REACH_BONUS;
    reasons.push(`+${IN_REACH_BONUS} in reach`);
  }

  const canFinish = Boolean(
    target.hp &&
    maxPossibleDamage(actor.damageEffects) >= target.hp.current &&
    target.hp.current > 0
  );
  if (canFinish && inReach) {
    score += FINISHER_BONUS;
    reasons.push(`+${FINISHER_BONUS} can eliminate`);
  }

  return { tokenId: target.tokenId, score, distance, inReach, canFinish, reasons };
}

/**
 * Score every eligible (hostile, living) target. Returns ALL of them, sorted by
 * score descending with a deterministic id tie-break — so the full decision is
 * transparent and the top entry is the recommended target.
 */
export function scoreTargets(
  actor: TacticalActor,
  targets: readonly TacticalTarget[]
): ScoredTarget[] {
  return targets
    .filter((target) => isHostile(actor.faction, target.faction))
    .filter((target) => !target.hp || target.hp.current > 0)
    .map((target) => scoreTarget(actor, target))
    .sort((a, b) => b.score - a.score || a.tokenId.localeCompare(b.tokenId));
}
