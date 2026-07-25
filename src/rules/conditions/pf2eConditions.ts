/**
 * Pathfinder 2e conditions, expressed in the system-agnostic rules IR.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 2/3.
 *
 * PF2e's value-bearing conditions impose STATUS penalties. Because they are all
 * status penalties, only the single worst one applies to any given roll (they do
 * not stack with each other). This module turns the previously hard-coded
 * `getPf2eStatusPenalty` logic in the engine into a small data catalog plus a
 * shared selector, so condition rules live in one place and feed both the engine
 * (as a number) and the ledger (as provenance).
 *
 * Reproduces the engine's tested behavior exactly:
 *   - frightened / sickened apply to every check;
 *   - clumsy → Dex-based, enfeebled → Str-based, drained → Con-based,
 *     stupefied → mental (Int/Wis/Cha);
 *   - the penalty applied is the highest matching value (worst penalty).
 */

import { resolveCharacterEffects } from '../compile/characterEffects';
import { makeEffectId, type EffectInstance } from '../ir/types';

const SYSTEM_ID = 'pf2e';

type ConditionScope = { kind: 'all' } | { kind: 'abilities'; abilities: readonly string[] };

/** Value-bearing PF2e status conditions and which checks they penalize. */
const PF2E_STATUS_CONDITIONS: Record<string, ConditionScope> = {
  frightened: { kind: 'all' },
  sickened: { kind: 'all' },
  clumsy: { kind: 'abilities', abilities: ['dex'] },
  enfeebled: { kind: 'abilities', abilities: ['str'] },
  drained: { kind: 'abilities', abilities: ['con'] },
  stupefied: { kind: 'abilities', abilities: ['int', 'wis', 'cha'] },
};

/** Minimal structural view of a PF2e condition entry. */
export interface Pf2eConditionLike {
  name: string;
  value?: number;
}

function magnitude(condition: Pf2eConditionLike): number {
  return condition.value != null ? condition.value : 1;
}

/** Highest value of the named condition currently active (0 if absent). */
function highestValue(conditions: readonly Pf2eConditionLike[], name: string): number {
  let highest = 0;
  for (const condition of conditions) {
    if (condition.name.toLowerCase() === name && magnitude(condition) > highest) {
      highest = magnitude(condition);
    }
  }
  return highest;
}

function scopeAppliesToAbility(scope: ConditionScope, ability?: string): boolean {
  if (scope.kind === 'all') return true;
  return ability !== undefined && scope.abilities.includes(ability);
}

/**
 * The status penalty (a positive magnitude to subtract) that applies to a check
 * keyed by `ability`. All matching conditions are status penalties, so the worst
 * (highest) one wins. Returns 0 when none apply.
 *
 * The engines now route this same math through the resolver fold as
 * `-resolveCharacterEffects(..., { conditions: collectPf2eCheckConditionEffects(
 * conditions, ability) }).bonus('check')`, which equals this value for every
 * catalog condition at every magnitude. Retained as the closed-form spec the
 * fold is pinned against — exactly as `d20LegacyCheckPenalty` is for 3.5e/PF1e.
 */
export function getPf2eConditionStatusPenalty(
  conditions: readonly Pf2eConditionLike[],
  ability?: string
): number {
  let worst = 0;
  for (const [name, scope] of Object.entries(PF2E_STATUS_CONDITIONS)) {
    if (!scopeAppliesToAbility(scope, ability)) continue;
    worst = Math.max(worst, highestValue(conditions, name));
  }
  return worst;
}

/**
 * Compile the status conditions that apply to a check keyed by `ability` onto a
 * SINGLE `check` target, so the resolver's `pf2e-status` bucket selects the one
 * worst penalty — the same "worst wins" rule `getPf2eConditionStatusPenalty`
 * computes with `Math.max`, now expressed as a fold that also carries
 * per-condition provenance into the ledger.
 *
 * The single target is load-bearing. PF2e status penalties do NOT stack with one
 * another, and the resolver selects the worst WITHIN a target group but SUMS
 * across groups — so splitting frightened and clumsy across `check` and
 * `check.dex` (the shape the whole-character `collectPf2eConditionEffects` view
 * below uses, where each target is read independently) would ADD them instead of
 * selecting. Scoping to one target is exactly what makes the fold reproduce the
 * engine's scalar.
 */
export function collectPf2eCheckConditionEffects(
  conditions: readonly Pf2eConditionLike[],
  ability?: string
): EffectInstance[] {
  const effects: EffectInstance[] = [];
  for (const [name, scope] of Object.entries(PF2E_STATUS_CONDITIONS)) {
    if (!scopeAppliesToAbility(scope, ability)) continue;
    const value = highestValue(conditions, name);
    if (value <= 0) continue;
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'condition', name, 'check', value),
      systemId: SYSTEM_ID,
      target: 'check',
      operation: 'subtract',
      value,
      stackPolicy: 'pf2e-status',
      source: { kind: 'condition', id: name, label: name },
      label: `${name} ${value}: -${value} status penalty`,
      category: 'other',
      condition: { kind: 'has-condition', conditionId: name },
    });
  }
  return effects;
}

/**
 * The status penalty (a positive magnitude to subtract) for a check keyed by
 * `ability`, RESOLVED THROUGH THE SHARED FOLD.
 *
 * This is the one entry point the PF2e engine and its declarative derived
 * quantities both call, so the roll path and the AC path cannot drift. It is the
 * same shape the 3.5e/PF1e engines use — compile conditions to IR, hand them to
 * `resolveCharacterEffects`, read the folded target — which makes all seven
 * systems resolve conditions identically, and puts every applied condition in
 * the ledger instead of an opaque subtraction.
 *
 * Returns `0` (never `-0`) when nothing applies, so it is Object.is-identical to
 * the closed-form selector it replaces.
 */
export function resolvePf2eCheckPenalty(
  conditions: readonly Pf2eConditionLike[],
  ability?: string
): number {
  const folded = resolveCharacterEffects(SYSTEM_ID, {
    conditions: collectPf2eCheckConditionEffects(conditions, ability),
  }).bonus('check');
  return folded === 0 ? 0 : -folded;
}

/**
 * Compile active PF2e status conditions into effect instances for provenance.
 * Each is a `pf2e-status` penalty (negative value) on the appropriate check
 * target. The resolver's PF2e-bucket fold takes the single worst penalty.
 *
 * This is the WHOLE-CHARACTER ledger view: one row per active condition, each on
 * the target naming its scope, so a reader sees every condition it might meet.
 * For resolving ONE check use `resolvePf2eCheckPenalty`, which scopes to a
 * single target so the bucket fold selects rather than sums.
 */
export function collectPf2eConditionEffects(
  conditions: readonly Pf2eConditionLike[]
): EffectInstance[] {
  const effects: EffectInstance[] = [];
  for (const [name, scope] of Object.entries(PF2E_STATUS_CONDITIONS)) {
    const value = highestValue(conditions, name);
    if (value <= 0) continue;
    const target = scope.kind === 'all' ? 'check' : `check.${scope.abilities.join('-')}`;
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'condition', name, target, value),
      systemId: SYSTEM_ID,
      target,
      operation: 'subtract',
      value,
      stackPolicy: 'pf2e-status',
      source: { kind: 'condition', id: name, label: name },
      label: `${name} ${value}: -${value} status penalty`,
      category: 'other',
      condition: { kind: 'has-condition', conditionId: name },
    });
  }
  return effects;
}
