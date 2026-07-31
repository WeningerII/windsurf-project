/**
 * Deterministic attack resolution.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 4 — the
 * mechanics half of the resolution/narration split.
 *
 * This is the system-agnostic core of combat: given an attacker's attack and
 * damage effects (already compiled to the rules IR), a target value (AC/DC), and
 * a seeded RNG, it produces a fully deterministic, replayable hit/miss + damage
 * outcome plus the contribution ledger that explains it. No `Math.random`; the
 * same effects + same seed yield byte-identical results.
 *
 * It does NOT mutate any state. It returns a result artifact; applying that
 * result to a character/scene is a separate, typed step (keeping mechanics pure
 * and the LLM out of the resolution hot path).
 *
 * The d20 attack model here is the shared d20-family one (5e/3.5e/PF1e/PF2e).
 * Systems with different action math (Daggerheart 2d12, M&M opposed checks) get
 * their own resolvers reusing the same effect/ledger primitives.
 */

import type { SeededRng } from '../../scene/seededRng';
import { resolveEffects, type ResolveContext, type RollMode } from './resolve';
import { pf2eDegreeOfSuccess, type Pf2eDegreeOfSuccess } from './pf2eDegree';
import { d20CriticalConfirmed, d20CriticalDamage } from '../../utils/derivedCombatMath';
import type { EffectInstance } from '../ir/types';
import type { DamageType } from '../../types/core/common';
import {
  collectDamageChannels,
  splitDamageAcrossChannels,
  type DamageChannelAmount,
} from './damageChannelSplit';

export interface AttackResolutionInput {
  /** Compiled attack-roll effects (proficiency, ability, item, feat bonuses…). */
  attackEffects: readonly EffectInstance[];
  /** Compiled damage effects: weapon dice (`add-die`) plus flat bonuses. */
  damageEffects?: readonly EffectInstance[];
  /** The value to beat — Armor Class (d20 hit if total >= targetValue). */
  targetValue: number;
  /** Seeded RNG; the only randomness source. Required for determinism. */
  rng: SeededRng;
  /** Effect-gating context (active conditions, terrain, flags…). */
  context?: Omit<ResolveContext, 'rng'>;
  /**
   * Natural roll that auto-hits/crits (d20 default 20). Natural 1 auto-misses.
   * PF2e's degree-of-success model is layered on top by the caller when a DC is
   * supplied; this core reports the raw hit and the natural roll.
   */
  critOn?: number;
  /**
   * Hit/crit model. 'd20' (default): hit on total >= target, crit on the
   * natural roll vs critOn. 'pf2e': CRB degrees of success — critical hit on
   * beating the AC by 10+ (nat 20 upgrades a step, nat 1 downgrades), and a
   * critical hit doubles the WHOLE damage, not just the dice.
   */
  degreeModel?: 'd20' | 'pf2e';
  /**
   * How a (non-pf2e) critical hit assembles damage:
   *  - 'double-dice' (default): 5e — a natural crit auto-confirms and the damage
   *    dice are rolled twice (flat bonuses not doubled).
   *  - 'confirm-multiply': 3.5e/PF1e — a natural threat must be confirmed by a
   *    second attack roll (same bonus) vs the AC; only then is damage multiplied
   *    by `criticalMultiplier`. An unconfirmed threat deals normal damage.
   */
  critModel?: 'double-dice' | 'confirm-multiply';
  /** Weapon critical multiplier for 'confirm-multiply' (×2 default; ×3/×4). */
  criticalMultiplier?: number;
}

export interface AttackResolution {
  /** The chosen natural d20 (after advantage/disadvantage). */
  naturalRoll: number;
  /** Both dice when rolled with advantage/disadvantage, else just the one. */
  d20Terms: number[];
  rollMode: RollMode;
  /** Total attack value: natural roll + summed attack bonuses. */
  attackTotal: number;
  attackBonus: number;
  targetValue: number;
  isCriticalHit: boolean;
  isCriticalMiss: boolean;
  isHit: boolean;
  /**
   * Under critModel 'confirm-multiply': whether the threat's confirmation roll
   * landed (undefined when no confirmation was rolled, i.e. not a threat or a
   * different crit model).
   */
  criticalConfirmed?: boolean;
  /** The confirmation roll's natural d20 (only set when one was rolled). */
  confirmationRoll?: number;
  /** PF2e degree (only set under degreeModel 'pf2e'). */
  degreeOfSuccess?: Pf2eDegreeOfSuccess;
  /** Total damage (only rolled on a hit; 0 on a miss). */
  damage: number;
  /**
   * The damage type, when this attack resolved to exactly ONE typed channel.
   *
   * Damage effects are namespaced by channel — `damage.fire`, `damage.slashing`,
   * or plain `damage` when the source asserted no type (`monsterDamageEffects`,
   * which never invents one). `damage` above is the sum across every channel, so
   * the breakdown was previously discarded here and the scene's typed-damage
   * mitigation could never fire for a real attack.
   *
   * Set ONLY for a single typed channel, deliberately. An attack that deals
   * "slashing plus fire" has two channels and one scalar total, and no single
   * type describes it honestly — so this field stays absent there and
   * `damageChannels` carries the breakdown instead. Kept as-is rather than
   * widened so every existing caller reading a lone `damageType` keeps seeing
   * exactly what it saw before.
   */
  damageType?: DamageType;
  /**
   * The full per-channel breakdown of `damage`, in declaration order, summing
   * EXACTLY to `damage`.
   *
   * This is what makes typed mitigation reachable for multi-channel attacks. The
   * channel weights are each channel's own resolved total; the split runs against
   * the FINAL `damage` scalar, after crit math, so a doubled crit distributes
   * proportionally across the channels instead of landing on one of them. The
   * remainder rule and its tie-breaks live in `damageChannelSplit.ts`.
   *
   * Absent when the attack rolled no damage channels at all. Present with a
   * single entry for an ordinary single-channel attack, where it is simply the
   * whole total — callers that only understand `damageType` may keep ignoring it.
   */
  damageChannels?: DamageChannelAmount[];
  /** Individual damage dice rolled (empty on a miss or with no dice). */
  damageDiceTerms: number[];
  damageBonus: number;
  /** The applied effects that explain attack + damage (provenance). */
  ledger: EffectInstance[];
}

/** Roll a d20 under the given mode using only the seeded RNG. */
function rollD20(rng: SeededRng, mode: RollMode): { chosen: number; terms: number[] } {
  const first = rng.rollDie(20);
  if (mode === 'normal') {
    return { chosen: first, terms: [first] };
  }
  const second = rng.rollDie(20);
  const chosen = mode === 'advantage' ? Math.max(first, second) : Math.min(first, second);
  return { chosen, terms: [first, second] };
}

/**
 * Resolve a single attack deterministically.
 *
 * Order: fold attack effects (to get the bonus + roll mode), roll the d20 from
 * the seed, decide hit/crit/fumble, then — only on a hit — fold the damage
 * effects (rolling damage dice from the same seeded stream).
 */
export function resolveAttack(input: AttackResolutionInput): AttackResolution {
  const critOn = input.critOn ?? 20;
  const ctx: ResolveContext = { ...input.context, rng: input.rng };

  // Attack side: the bonus is the resolved scalar; roll mode comes from any
  // advantage/disadvantage effects folded on the 'attack' target.
  const attackResolved = resolveEffects(input.attackEffects, ctx);
  const attackTarget = attackResolved.byTarget.attack;
  const attackBonus = attackTarget?.total ?? 0;
  const rollMode = attackTarget?.rollMode ?? 'normal';

  const { chosen, terms } = rollD20(input.rng, rollMode);
  const attackTotal = chosen + attackBonus;

  let isCriticalHit: boolean;
  let isCriticalMiss: boolean;
  let isHit: boolean;
  let degreeOfSuccess: Pf2eDegreeOfSuccess | undefined;
  if (input.degreeModel === 'pf2e') {
    degreeOfSuccess = pf2eDegreeOfSuccess(attackTotal, input.targetValue, chosen);
    isCriticalHit = degreeOfSuccess === 'critical-success';
    isCriticalMiss = degreeOfSuccess === 'critical-failure';
    isHit = degreeOfSuccess === 'success' || degreeOfSuccess === 'critical-success';
  } else {
    isCriticalHit = chosen >= critOn;
    isCriticalMiss = chosen === 1;
    // Natural crit always hits; natural 1 always misses; otherwise compare totals.
    isHit = isCriticalHit || (!isCriticalMiss && attackTotal >= input.targetValue);
  }

  const ledger: EffectInstance[] = [...attackResolved.ledger];
  let damage = 0;
  let damageDiceTerms: number[] = [];
  let damageBonus = 0;
  let damageType: DamageType | undefined;
  let damageChannels: DamageChannelAmount[] | undefined;
  let criticalConfirmed: boolean | undefined;
  let confirmationRoll: number | undefined;

  if (isHit && input.damageEffects && input.damageEffects.length > 0) {
    const damageResolved = resolveEffects(input.damageEffects, ctx);
    // Sum every damage target (e.g. 'damage', 'damage.fire'); each carries its
    // rolled dice and flat bonuses.
    //
    // The channel KEYS are also the only place the damage type survives, so
    // record which ones actually contributed while summing. `damage.fire` ->
    // 'fire'; the bare `damage` channel is untyped and contributes none.
    const contributingTypes = new Set<string>();
    for (const [target, resolved] of Object.entries(damageResolved.byTarget)) {
      damage += resolved.total;
      if (resolved.total !== 0 && target.startsWith('damage.')) {
        contributingTypes.add(target.slice('damage.'.length));
      }
      if (resolved.diceTerms) {
        damageDiceTerms = [...damageDiceTerms, ...resolved.diceTerms];
      }
    }
    // The channel WEIGHTS are the breakdown that summing into one scalar
    // destroys. Collected here, applied at the bottom of this block once crit
    // math has settled the final total.
    const channels = collectDamageChannels(damageResolved.byTarget);
    // Exactly one typed channel and nothing untyped alongside it: the whole
    // total belongs to that type, so it can be reported without any split.
    const untypedTotal = damageResolved.byTarget.damage?.total ?? 0;
    if (contributingTypes.size === 1 && untypedTotal === 0) {
      damageType = [...contributingTypes][0] as DamageType;
    }
    // Flat damage bonus = total minus the rolled dice.
    const diceSum = damageDiceTerms.reduce((sum, term) => sum + term, 0);
    damageBonus = damage - diceSum;

    if (isCriticalHit) {
      if (input.degreeModel === 'pf2e') {
        // PF2e CRB: a critical hit doubles the damage — dice AND static.
        damage *= 2;
      } else if (input.critModel === 'confirm-multiply') {
        // 3.5e/PF1e (SRD): the threat must be confirmed by a second attack roll
        // (same bonus, same seeded stream) vs the AC. Only a confirmed crit
        // multiplies damage by the weapon's multiplier; an unconfirmed threat is
        // an ordinary hit.
        const confirm = rollD20(input.rng, rollMode);
        confirmationRoll = confirm.chosen;
        criticalConfirmed = d20CriticalConfirmed(confirm.chosen + attackBonus, input.targetValue);
        if (criticalConfirmed) {
          damage = d20CriticalDamage(damage, input.criticalMultiplier ?? 2);
        } else {
          isCriticalHit = false;
        }
      } else {
        // d20 model: double the dice rolled (5e crit rule: roll the damage
        // dice twice; flat bonuses are not doubled).
        const critDice = damageDiceTerms.reduce((sum, term) => sum + term, 0);
        damage += critDice;
      }
    }

    // Split LAST, against the final scalar. Every crit model above rewrites
    // `damage` as a whole (pf2e doubles it, confirm-multiply multiplies it,
    // double-dice adds the dice back), so distributing proportionally here is
    // what carries that multiplication onto the individual channels — and the
    // parts still sum exactly to the number the rest of the engine reports.
    if (channels.length > 0) {
      damageChannels = splitDamageAcrossChannels(damage, channels);
    }

    ledger.push(...damageResolved.ledger);
  }

  return {
    naturalRoll: chosen,
    d20Terms: terms,
    rollMode,
    attackTotal,
    attackBonus,
    targetValue: input.targetValue,
    isCriticalHit,
    isCriticalMiss,
    isHit,
    criticalConfirmed,
    confirmationRoll,
    degreeOfSuccess,
    damage,
    damageType,
    damageChannels,
    damageDiceTerms,
    damageBonus,
    ledger,
  };
}
