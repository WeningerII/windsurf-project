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
 * Compile active PF2e status conditions into effect instances for provenance.
 * Each is a `pf2e-status` penalty (negative value) on the appropriate check
 * target. The resolver's PF2e-bucket fold takes the single worst penalty.
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
