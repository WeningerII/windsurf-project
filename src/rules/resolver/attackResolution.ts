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
import { pf2eDegreeOfSuccess, type DegreeOfSuccess } from './degreeOfSuccess';
import { adjustTypedDamage, type DamageDefenses } from './damageDefenses';
import type { EffectInstance } from '../ir/types';

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
   * Used only by the `'d20-threshold'` crit model.
   */
  critOn?: number;
  /**
   * Critical-hit model:
   * - `'d20-threshold'` (default, 5e): a natural roll in the threat range
   *   (`critOn`, 20) auto-confirms; a crit doubles the damage DICE only (flat
   *   bonuses are not doubled).
   * - `'d20-confirm'` (3.5e/PF1e): a natural roll in the threat range is only a
   *   *threat* — it must be CONFIRMED by a second attack roll (d20 + bonus) vs
   *   the same AC. A confirmed crit multiplies the whole base damage (dice AND
   *   modifiers) by `critMultiplier` (×2/×3/×4); an unconfirmed threat is a
   *   normal hit.
   * - `'pf2e'`: the four-degree model — the attack total beating AC by 10 (or a
   *   natural 20 stepping the degree up) is a critical hit, a natural 1 (or
   *   missing AC by 10) is a critical miss, and a crit doubles the whole damage
   *   TOTAL (dice AND modifiers). `targetValue` must be the target's AC.
   */
  critModel?: 'd20-threshold' | 'd20-confirm' | 'pf2e';
  /** Weapon critical multiplier for `'d20-confirm'` (×2 default, e.g. ×3/×4). */
  critMultiplier?: number;
  /**
   * The target's damage resistances/immunities/vulnerabilities, applied per
   * damage type AFTER the crit rule. Omitted means no adjustment.
   */
  targetDefenses?: DamageDefenses;
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
  /** PF2e degree of success, when resolved with the `'pf2e'` crit model. */
  degree?: DegreeOfSuccess;
  /** The confirmation d20 rolled for a threat, under the `'d20-confirm'` model. */
  confirmationRoll?: number;
  /** Whether a `'d20-confirm'` threat confirmed into a critical hit. */
  confirmed?: boolean;
  /** Total damage (only rolled on a hit; 0 on a miss), after crit and defenses. */
  damage: number;
  /** Individual damage dice rolled (empty on a miss or with no dice). */
  damageDiceTerms: number[];
  damageBonus: number;
  /** Final damage per type key (`damage` / `damage.fire`), after crit + defenses. */
  damageByType?: Record<string, number>;
  /** The applied effects that explain attack + damage (provenance). */
  ledger: EffectInstance[];
}

/** The attack crit model a system uses: PF2e degrees, 3.5e/PF1e confirm, else 5e threshold. */
export function critModelForSystem(
  systemId: string | undefined
): 'd20-threshold' | 'd20-confirm' | 'pf2e' {
  if (systemId === 'pf2e') return 'pf2e';
  if (systemId === 'dnd-3.5e' || systemId === 'pf1e') return 'd20-confirm';
  return 'd20-threshold';
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

  const critModel = input.critModel ?? 'd20-threshold';
  let isCriticalHit: boolean;
  let isCriticalMiss: boolean;
  let isHit: boolean;
  let degree: DegreeOfSuccess | undefined;
  let confirmationRoll: number | undefined;
  let confirmed: boolean | undefined;
  if (critModel === 'pf2e') {
    // PF2e: the same d20 roll, read through the four-degree engine vs AC.
    degree = pf2eDegreeOfSuccess(chosen, attackTotal, input.targetValue);
    isCriticalHit = degree === 'critical-success';
    isHit = degree === 'critical-success' || degree === 'success';
    isCriticalMiss = degree === 'critical-failure';
  } else {
    // d20 family: a natural 1 auto-misses, a natural 20 auto-hits, and a roll in
    // the threat range (>= critOn) threatens a crit.
    isCriticalMiss = chosen === 1;
    isHit = chosen === 20 || (!isCriticalMiss && attackTotal >= input.targetValue);
    const threatens = chosen >= critOn && isHit;
    if (critModel === 'd20-confirm' && threatens) {
      // 3.5e/PF1e: confirm the threat with a second attack roll vs the same AC.
      confirmationRoll = input.rng.rollDie(20);
      confirmed = confirmationRoll + attackBonus >= input.targetValue;
      isCriticalHit = confirmed;
    } else {
      // d20-threshold (5e): a threat that hits is automatically a critical hit.
      isCriticalHit = threatens;
    }
  }

  const ledger: EffectInstance[] = [...attackResolved.ledger];
  let damage = 0;
  let damageDiceTerms: number[] = [];
  let damageBonus = 0;
  let damageByType: Record<string, number> | undefined;

  if (isHit && input.damageEffects && input.damageEffects.length > 0) {
    const damageResolved = resolveEffects(input.damageEffects, ctx);
    const critMultiplier = Math.max(2, input.critMultiplier ?? 2);
    damageByType = {};
    let baseTotal = 0;

    // Each damage target ('damage' / 'damage.fire' …) is adjusted on its own so
    // the crit rule and per-type resistances apply correctly to mixed-type hits.
    for (const [key, resolved] of Object.entries(damageResolved.byTarget)) {
      const type = key === 'damage' ? '' : key.replace(/^damage\./, '');
      const dice = resolved.diceTerms ?? [];
      damageDiceTerms = [...damageDiceTerms, ...dice];
      baseTotal += resolved.total;

      // Critical-hit damage differs by system:
      // - d20-threshold (5e): double the damage DICE only (modifiers once).
      // - d20-confirm (3.5e/PF1e): multiply the whole type total by the ×N.
      // - pf2e: double the whole type total (dice AND modifiers) (CRB p.451).
      let typed = resolved.total;
      if (isCriticalHit) {
        if (critModel === 'pf2e') typed *= 2;
        else if (critModel === 'd20-confirm') typed *= critMultiplier;
        else typed += dice.reduce((sum, term) => sum + term, 0);
      }

      // Resistance/immunity/vulnerability is applied last, per type.
      if (input.targetDefenses) typed = adjustTypedDamage(type, typed, input.targetDefenses);

      damage += typed;
      damageByType[key] = typed;
    }

    // Flat damage bonus = pre-crit base total minus the rolled dice.
    damageBonus = baseTotal - damageDiceTerms.reduce((sum, term) => sum + term, 0);
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
    degree,
    confirmationRoll,
    confirmed,
    damage,
    damageDiceTerms,
    damageBonus,
    damageByType,
    ledger,
  };
}
