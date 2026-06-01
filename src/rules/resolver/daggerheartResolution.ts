/**
 * Daggerheart combat resolution — threshold-based damage.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). Daggerheart does NOT
 * subtract raw hit points; instead an attack that beats a target's Evasion deals
 * a damage total that is compared to the target's damage thresholds to mark HIT
 * POINT SLOTS (SRD):
 *   - below the Major threshold → mark 1 HP
 *   - at/above Major, below Severe → mark 2 HP
 *   - at/above Severe → mark 3 HP
 * Equipped armor can reduce incoming severity by spending an Armor slot (lowering
 * the marked HP by 1, minimum 1) — modeled here as an optional, caller-controlled
 * choice so it stays a deterministic input, not a hidden rule.
 *
 * Deterministic and seeded like the d20 attack resolver: the attack roll and any
 * damage dice come only from the injected RNG. This is the Daggerheart analogue
 * of resolveAttack — its own model, reusing the shared effect/RNG primitives.
 */

import type { SeededRng } from '../../scene/seededRng';
import { resolveEffects } from './resolve';
import type { EffectInstance } from '../ir/types';

export interface DaggerheartThresholds {
  major: number;
  severe: number;
}

export interface DaggerheartAttackInput {
  /** Attack-roll effects (trait + proficiency, etc.). */
  attackEffects: readonly EffectInstance[];
  /** Damage effects (weapon dice + bonuses). */
  damageEffects: readonly EffectInstance[];
  /** Target's Evasion — the value the attack total must meet or beat to hit. */
  evasion: number;
  thresholds: DaggerheartThresholds;
  rng: SeededRng;
  /** When true, the defender spends 1 Armor slot to reduce marked HP by 1 (min 1). */
  spendArmor?: boolean;
}

export interface DaggerheartAttackResult {
  attackTotal: number;
  attackBonus: number;
  isHit: boolean;
  /** Raw damage total before threshold comparison (0 on a miss). */
  damage: number;
  damageDiceTerms: number[];
  /** HP slots marked on the target (0 on a miss; 1-3 on a hit). */
  hpMarked: number;
  /** True when an Armor slot was spent to reduce the marked HP. */
  armorSpent: boolean;
  ledger: EffectInstance[];
}

/** Map a damage total to HP slots marked, per Daggerheart thresholds (SRD). */
export function daggerheartHpMarked(damage: number, thresholds: DaggerheartThresholds): number {
  if (damage <= 0) return 0;
  if (damage >= thresholds.severe) return 3;
  if (damage >= thresholds.major) return 2;
  return 1;
}

/**
 * Resolve a Daggerheart attack: roll attack vs Evasion; on a hit, roll damage,
 * compare to thresholds to mark 1-3 HP, optionally reduced by 1 if an Armor slot
 * is spent. Pure except for the seeded RNG.
 */
export function resolveDaggerheartAttack(input: DaggerheartAttackInput): DaggerheartAttackResult {
  const attackResolved = resolveEffects(input.attackEffects, { rng: input.rng });
  const attackBonus = attackResolved.byTarget.attack?.total ?? 0;
  const roll = input.rng.rollDie(20);
  const attackTotal = roll + attackBonus;
  const isHit = attackTotal >= input.evasion;

  const ledger: EffectInstance[] = [...attackResolved.ledger];
  if (!isHit) {
    return {
      attackTotal,
      attackBonus,
      isHit: false,
      damage: 0,
      damageDiceTerms: [],
      hpMarked: 0,
      armorSpent: false,
      ledger,
    };
  }

  const damageResolved = resolveEffects(input.damageEffects, { rng: input.rng });
  let damage = 0;
  let damageDiceTerms: number[] = [];
  for (const resolved of Object.values(damageResolved.byTarget)) {
    damage += resolved.total;
    if (resolved.diceTerms) {
      damageDiceTerms = [...damageDiceTerms, ...resolved.diceTerms];
    }
  }
  ledger.push(...damageResolved.ledger);

  let hpMarked = daggerheartHpMarked(damage, input.thresholds);
  const armorSpent = Boolean(input.spendArmor) && hpMarked > 0;
  if (armorSpent) {
    hpMarked = Math.max(1, hpMarked - 1);
  }

  return {
    attackTotal,
    attackBonus,
    isHit: true,
    damage,
    damageDiceTerms,
    hpMarked,
    armorSpent,
    ledger,
  };
}
