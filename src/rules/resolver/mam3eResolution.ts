/**
 * Mutants & Masterminds 3e combat resolution — attack vs defense, then a
 * Toughness save against a condition track.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). M&M has no hit points.
 * An attack roll (d20 + attack bonus) must meet or beat the target's active
 * defense (Dodge for ranged, Parry for close). On a hit, the target makes a
 * Toughness saving throw against DC = 15 + effect rank; the SHORTFALL (how much
 * the save misses the DC) drives the condition track (Hero's Handbook p.191):
 *   - fail by 1-4   → +1 degree (Dazed, then Staggered, then …) and Bruised
 *   - the standard graded outcome is modeled by `applyToughnessDegrees`.
 *
 * This mirrors the existing Mam3eEngine.applyDamage condition-track logic (which
 * already encodes the failure→condition mapping); here we add the attack + save
 * roll in front of it, seeded and deterministic, so M&M combat resolves through
 * the same pipeline shape as the other systems.
 */

import type { SeededRng } from '../../scene/seededRng';
import { resolveEffects } from './resolve';
import type { EffectInstance } from '../ir/types';

export type Mam3eDefenseKind = 'dodge' | 'parry';

export interface Mam3eAttackInput {
  /** Attack-roll effects (fighting/dexterity + bonuses). */
  attackEffects: readonly EffectInstance[];
  /** Target's active defense value (Dodge for ranged, Parry for close). */
  targetDefense: number;
  /** Effect rank of the attack (sets the Toughness DC = 15 + rank). */
  effectRank: number;
  /** Target's Toughness save bonus. */
  toughness: number;
  rng: SeededRng;
}

/** A condition-track delta, matching the M&M engine's track shape. */
export interface Mam3eConditionDelta {
  bruised: number;
  dazed: boolean;
  staggered: boolean;
  incapacitated: boolean;
}

export interface Mam3eAttackResult {
  attackTotal: number;
  attackBonus: number;
  /** The natural d20 attack roll (20 always hits + crits; 1 always misses). */
  naturalRoll: number;
  isHit: boolean;
  /** Natural 20 — a critical hit, raising the effect DC by +5 (Hero's Handbook). */
  isCriticalHit: boolean;
  /** Toughness DC the target rolled against (0 on a miss; +5 on a crit). */
  saveDC: number;
  saveRoll: number;
  saveTotal: number;
  /** How far the save missed the DC (0 if it met/beat it). */
  shortfall: number;
  /** Condition-track changes to apply (all false/0 on a miss or successful save). */
  condition: Mam3eConditionDelta;
  ledger: EffectInstance[];
}

const NO_CONDITION: Mam3eConditionDelta = {
  bruised: 0,
  dazed: false,
  staggered: false,
  incapacitated: false,
};

/**
 * Map a Toughness save shortfall to condition-track changes (Hero's Handbook
 * p.191). Pure; mirrors Mam3eEngine.applyToughnessFailure thresholds:
 *   1-4   → Bruised
 *   5-9   → Bruised + Dazed
 *   10-14 → Bruised + Staggered
 *   15+   → Incapacitated
 */
export function applyToughnessDegrees(shortfall: number): Mam3eConditionDelta {
  if (shortfall <= 0) return { ...NO_CONDITION };
  if (shortfall >= 15) return { bruised: 0, dazed: false, staggered: false, incapacitated: true };
  if (shortfall >= 10) return { bruised: 1, dazed: false, staggered: true, incapacitated: false };
  if (shortfall >= 5) return { bruised: 1, dazed: true, staggered: false, incapacitated: false };
  return { bruised: 1, dazed: false, staggered: false, incapacitated: false };
}

/**
 * Resolve an M&M attack: d20 + attack bonus vs the target's active defense; on a
 * hit, a Toughness save vs DC 15 + effect rank, whose shortfall drives the
 * condition track. M&M 3e RAW (Hero's Handbook): a natural 20 always hits and is
 * a critical hit (+5 to the effect DC); a natural 1 always misses. Deterministic;
 * both rolls come only from the seeded RNG.
 */
export function resolveMam3eAttack(input: Mam3eAttackInput): Mam3eAttackResult {
  const attackResolved = resolveEffects(input.attackEffects, { rng: input.rng });
  const attackBonus = attackResolved.byTarget.attack?.total ?? 0;
  const attackRoll = input.rng.rollDie(20);
  const attackTotal = attackRoll + attackBonus;
  const isCriticalHit = attackRoll === 20;
  const isCriticalMiss = attackRoll === 1;
  const isHit = isCriticalHit || (!isCriticalMiss && attackTotal >= input.targetDefense);
  const ledger = [...attackResolved.ledger];

  if (!isHit) {
    return {
      attackTotal,
      attackBonus,
      naturalRoll: attackRoll,
      isHit: false,
      isCriticalHit: false,
      saveDC: 0,
      saveRoll: 0,
      saveTotal: 0,
      shortfall: 0,
      condition: { ...NO_CONDITION },
      ledger,
    };
  }

  // Critical hit: the effect DC rises by +5 (degree of effect, not extra dice).
  const saveDC = 15 + input.effectRank + (isCriticalHit ? 5 : 0);
  const saveRoll = input.rng.rollDie(20);
  const saveTotal = saveRoll + input.toughness;
  const shortfall = Math.max(0, saveDC - saveTotal);

  return {
    attackTotal,
    attackBonus,
    naturalRoll: attackRoll,
    isHit: true,
    isCriticalHit,
    saveDC,
    saveRoll,
    saveTotal,
    shortfall,
    condition: applyToughnessDegrees(shortfall),
    ledger,
  };
}
