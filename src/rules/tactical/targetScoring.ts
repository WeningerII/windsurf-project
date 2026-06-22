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
 * Scoring is position-static: it reads reach from current positions and flags
 * whether a target is in reach. Movement and obstacle-aware pathfinding toward an
 * out-of-reach target live in `pathfinding.ts` and the executor, not here.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance } from '../resolver/areaTargeting';
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
  /**
   * Attacks per turn (SRD Multiattack). Default 1. Each attack re-targets if
   * the current target drops mid-sequence.
   */
  attacksPerRound?: number;
  /**
   * Legacy-d20 iterative attacks: each attack after the first takes a
   * cumulative penalty of this size (3.5e/PF1e full attack: -5 per iterative).
   * Undefined/0 means all attacks roll at full bonus (5e Multiattack).
   */
  iterativePenaltyStep?: number;
  /** Movement per turn in grid cells (speed feet / 5). Default 6. */
  speedCells?: number;
  /**
   * The actor's footprint in cells (1 = Medium/Small). Used only by movement
   * pathfinding to keep a large creature's whole footprint on legal cells;
   * scoring is anchor-based and ignores it. Default 1.
   */
  size?: number;
}

/** A potential target on the grid. */
export interface TacticalTarget {
  tokenId: string;
  faction: string;
  position: SceneCoordinate;
  armorClass: number;
  hp?: { current: number; max: number };
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
  /** Clamped strategist bias folded into the score (0 when none). Surfaced so a
   * decision record shows exactly how much an LLM hint moved this target. */
  strategistBias: number;
}

/**
 * A strategist hint: a bounded, advisory bias on ONE target's utility score
 * (Phase 12). The async LLM strategist proposes these between rounds; the
 * deterministic executor applies them as a clamped preference nudge. A hint can
 * only reorder which already-legal target is chosen — it never makes a dead,
 * allied, or out-of-reach target actable (legality is decided before scoring).
 */
export interface TacticalHint {
  targetId: string;
  /** Additive score bias; positive = prefer, negative = avoid. Clamped on apply. */
  bias: number;
  /** Optional one-line rationale, surfaced in the scored target's reasons. */
  reason?: string;
}

// Scoring weights. Documented and centralized so the heuristic is legible and
// tunable. Higher score = more desirable target.
const SCORE_BASE = 100;
const DISTANCE_WEIGHT = 2; // each cell of distance reduces desirability
const WOUND_WEIGHT = 20; // prefer wounded targets (focus fire)
const IN_REACH_BONUS = 10; // attackable now without moving
const FINISHER_BONUS = 25; // can remove this combatant from the loop now

/** Largest absolute strategist bias the executor will honour (Phase 12). Equal to
 * the base score: an LLM hint can decisively reorder preference, yet never dwarf
 * the deterministic heuristic by orders of magnitude — bounded and auditable. */
export const STRATEGY_BIAS_CAP = SCORE_BASE;

/** Clamp a raw hint bias into the honoured, finite range. */
function clampBias(bias: number): number {
  if (!Number.isFinite(bias)) return 0;
  return Math.max(-STRATEGY_BIAS_CAP, Math.min(STRATEGY_BIAS_CAP, bias));
}

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

/**
 * The reserved faction for non-combatants (objects, unaligned NPCs). A neutral
 * combatant is hostile to no one and is not counted as a combat side.
 */
export const NEUTRAL_FACTION = 'neutral';

/**
 * True when two combatants are on opposing sides. Distinct factions are hostile
 * (the engine treats faction strings as opposing teams), except `neutral`,
 * which is hostile to no one.
 */
export function isHostile(actorFaction: string, targetFaction: string): boolean {
  if (actorFaction === NEUTRAL_FACTION || targetFaction === NEUTRAL_FACTION) {
    return false;
  }
  return actorFaction !== targetFaction;
}

/**
 * Score a single target for the actor. Pure; deterministic. Returns the score
 * and the reasons that composed it. An optional strategist `hint` folds a
 * clamped advisory bias into the score (Phase 12) — preference only; legality is
 * decided by the caller before a target is ever scored.
 */
export function scoreTarget(
  actor: TacticalActor,
  target: TacticalTarget,
  hint?: TacticalHint
): ScoredTarget {
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

  const strategistBias = hint ? clampBias(hint.bias) : 0;
  if (strategistBias !== 0) {
    score += strategistBias;
    reasons.push(
      `${strategistBias >= 0 ? '+' : ''}${strategistBias} strategist${
        hint?.reason ? ` (${hint.reason})` : ''
      }`
    );
  }

  return { tokenId: target.tokenId, score, distance, inReach, canFinish, reasons, strategistBias };
}

/**
 * Score every eligible (hostile, living) target. Returns ALL of them, sorted by
 * score descending with a deterministic id tie-break — so the full decision is
 * transparent and the top entry is the recommended target.
 *
 * Optional strategist `hints` (Phase 12) bias matching targets' scores. Hints are
 * applied AFTER the hostile/living filter, so a hint on an ally, a corpse, or a
 * neutral is silently inert — it can reorder real candidates, never conjure one.
 */
export function scoreTargets(
  actor: TacticalActor,
  targets: readonly TacticalTarget[],
  hints?: readonly TacticalHint[]
): ScoredTarget[] {
  const biasByTarget = new Map<string, TacticalHint>();
  for (const hint of hints ?? []) {
    // Last hint wins for a duplicated target id, deterministically.
    biasByTarget.set(hint.targetId, hint);
  }
  return targets
    .filter((target) => isHostile(actor.faction, target.faction))
    .filter((target) => !target.hp || target.hp.current > 0)
    .map((target) => scoreTarget(actor, target, biasByTarget.get(target.tokenId)))
    .sort((a, b) => b.score - a.score || compareTokenIds(a.tokenId, b.tokenId));
}

/**
 * Codepoint comparison for the id tie-break. `localeCompare` orders differently
 * across user locales, which would make tie-broken target choices diverge
 * between devices replaying the same event log.
 */
function compareTokenIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
