/**
 * PF2e damage-assembly riders: Rage and Sneak Attack as toggleable,
 * feature-gated effects (the PF2e counterpart of dnd5eRiders).
 *
 * CRB citations:
 *  - Barbarian — Rage: "you deal 2 additional damage with melee Strikes"
 *    (instinct and weapon-specialization scaling are manual calls; the base
 *    +2 is what compiles).
 *  - Rogue — Sneak Attack: 1d6, increasing to 2d6 at 5th, 3d6 at 11th, and
 *    4d6 at 17th level; applies to flat-footed targets with agile/finesse or
 *    ranged weapons — the toggle asserts that eligibility.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';

const SYSTEM_ID = 'pf2e';

export interface Pf2eRiderInputs {
  /** Active toggle ids persisted on the character (e.g. ['rage']). */
  activeToggles: readonly string[];
  /** Owned feature ids (class features). */
  featureIds: ReadonlySet<string>;
  /** Character level (Sneak Attack dice scale at 5/11/17). */
  level: number;
}

/** CRB: Sneak Attack dice by rogue level (1d6 / 2d6@5 / 3d6@11 / 4d6@17). */
export function pf2eSneakAttackDice(level: number): number {
  if (level >= 17) return 4;
  if (level >= 11) return 3;
  if (level >= 5) return 2;
  return 1;
}

export const PF2E_TOGGLE_IDS = ['rage', 'sneak-attack'] as const;

export const PF2E_TOGGLE_LABELS: Record<string, string> = {
  rage: 'Rage (+2 melee damage)',
  'sneak-attack': 'Sneak Attack',
};

/** Which toggles this character can use at all (feature-gated). */
export function availablePf2eToggles(inputs: Pick<Pf2eRiderInputs, 'featureIds'>): string[] {
  const available: string[] = [];
  if (inputs.featureIds.has('rage')) available.push('rage');
  if (inputs.featureIds.has('sneak-attack')) available.push('sneak-attack');
  return available;
}

/** Compile the active, feature-gated riders into resolver effects. */
export function collectPf2eRiderEffects(inputs: Pf2eRiderInputs): EffectInstance[] {
  const active = new Set(inputs.activeToggles);
  const effects: EffectInstance[] = [];

  if (active.has('rage') && inputs.featureIds.has('rage')) {
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'rider', 'rage', 'damage'),
      systemId: SYSTEM_ID,
      target: 'damage',
      operation: 'add',
      value: 2,
      stackPolicy: 'sum',
      source: { kind: 'feature', id: 'rage', label: 'Rage' },
      label: 'Rage damage (+2)',
      manualBoundary: {
        kind: 'partial',
        note: 'CRB: melee Strikes only; instinct/specialization scaling is manual.',
      },
    });
  }

  if (active.has('sneak-attack') && inputs.featureIds.has('sneak-attack')) {
    const dice = pf2eSneakAttackDice(inputs.level);
    for (let index = 0; index < dice; index += 1) {
      effects.push({
        id: makeEffectId(SYSTEM_ID, 'rider', 'sneak-attack', 'die', index),
        systemId: SYSTEM_ID,
        target: 'damage',
        operation: 'add-die',
        value: 6,
        stackPolicy: 'sum',
        source: { kind: 'feature', id: 'sneak-attack', label: 'Sneak Attack' },
        label: `Sneak Attack d6 (${index + 1}/${dice})`,
        manualBoundary: {
          kind: 'partial',
          note: 'CRB: flat-footed targets, agile/finesse or ranged weapons — the toggle asserts eligibility.',
        },
      });
    }
  }

  return effects;
}
