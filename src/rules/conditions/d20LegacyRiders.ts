/**
 * Legacy-d20 damage-assembly riders (the 3.5e/PF1e counterpart of
 * dnd5eRiders/pf2eRiders).
 *
 * PF1e Power Attack (CRB, OGC): the trade is FORMULA-FIXED — "-1 penalty on
 * all melee attack rolls ... +2 bonus on all melee damage rolls. When your
 * base attack bonus reaches +4, and every 4 points thereafter, the penalty
 * increases by -1 and the bonus to damage increases by +2." That determinism
 * is what makes it compilable.
 *
 * D&D 3.5e Power Attack is deliberately NOT compiled: its trade is a per-roll
 * PLAYER CHOICE ("subtract a number ... not exceeding your base attack
 * bonus"), so any fixed number would be invented. Available toggles therefore
 * gate on systemId as well as the feat.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';
import type { D20LegacySystemId } from './d20LegacyConditions';

export interface D20LegacyRiderInputs {
  systemId: D20LegacySystemId;
  /** Active toggle ids persisted on the character (e.g. ['power-attack']). */
  activeToggles: readonly string[];
  /** Owned feat ids. */
  featIds: ReadonlySet<string>;
  /** Base attack bonus (PF1e Power Attack scales at BAB 4/8/12/16/20). */
  baseAttackBonus: number;
}

/** PF1e CRB: Power Attack penalty = 1 + floor(BAB / 4); damage = 2x penalty. */
export function pf1ePowerAttackTrade(baseAttackBonus: number): {
  penalty: number;
  bonus: number;
} {
  const penalty = 1 + Math.floor(Math.max(0, baseAttackBonus) / 4);
  return { penalty, bonus: penalty * 2 };
}

export const D20_LEGACY_TOGGLE_LABELS: Record<string, string> = {
  'power-attack': 'Power Attack',
};

/** Which toggles this character can use at all (feat- and system-gated). */
export function availableD20LegacyToggles(
  inputs: Pick<D20LegacyRiderInputs, 'systemId' | 'featIds'>
): string[] {
  const available: string[] = [];
  // PF1e only: the 3.5e trade is a per-roll player choice (see header).
  if (inputs.systemId === 'pf1e' && inputs.featIds.has('power-attack')) {
    available.push('power-attack');
  }
  return available;
}

/** Compile the active, feat-gated riders into resolver effects. */
export function collectD20LegacyRiderEffects(inputs: D20LegacyRiderInputs): EffectInstance[] {
  const active = new Set(inputs.activeToggles);
  const effects: EffectInstance[] = [];

  if (
    inputs.systemId === 'pf1e' &&
    active.has('power-attack') &&
    inputs.featIds.has('power-attack')
  ) {
    const { penalty, bonus } = pf1ePowerAttackTrade(inputs.baseAttackBonus);
    effects.push(
      {
        id: makeEffectId('pf1e', 'rider', 'power-attack', 'attack'),
        systemId: 'pf1e',
        target: 'attack',
        operation: 'subtract',
        value: penalty,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'power-attack', label: 'Power Attack' },
        label: `Power Attack (-${penalty} attack)`,
      },
      {
        id: makeEffectId('pf1e', 'rider', 'power-attack', 'damage'),
        systemId: 'pf1e',
        target: 'damage',
        operation: 'add',
        value: bonus,
        stackPolicy: 'sum',
        source: { kind: 'feat', id: 'power-attack', label: 'Power Attack' },
        label: `Power Attack (+${bonus} damage)`,
        manualBoundary: {
          kind: 'partial',
          note: 'CRB: melee only; two-handed x1.5 and off-hand x0.5 scaling are manual.',
        },
      }
    );
  }

  return effects;
}
