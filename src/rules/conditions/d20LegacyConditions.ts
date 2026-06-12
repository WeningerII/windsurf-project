/**
 * Classic d20 (D&D 3.5e / Pathfinder 1e) conditions, expressed in the rules IR.
 *
 * Unlike 5e's advantage/disadvantage vocabulary, the legacy d20 SRDs impose
 * FLAT numeric penalties (shaken: -2 on attack rolls, saves, skill and ability
 * checks; sickened: -2 on attack and damage rolls, saves, skills). Both systems
 * share the same OGL condition text for the entries encoded here, so one
 * catalog serves both, stamped with the caller's system id.
 *
 * Honesty rules mirror the other condition catalogs: only penalties that apply
 * unconditionally to the roll target are folded as numbers; scoped ones (prone
 * is melee-only) carry a partial manualBoundary note; non-numeric outcomes
 * (blinded's miss chance, stunned's lost action) are `note` effects.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';
import type { ContributionManualBoundary } from '../../types/core/contributionLedger';

export type D20LegacySystemId = 'pf1e' | 'dnd-3.5e';

interface LegacyConditionTemplate {
  target: string;
  operation: EffectInstance['operation'];
  value?: number;
  label: string;
  manualBoundary?: ContributionManualBoundary;
}

/** OGL SRD condition effects shared by 3.5e and PF1e. */
const D20_LEGACY_CONDITION_EFFECTS: Record<string, LegacyConditionTemplate[]> = {
  shaken: [
    {
      target: 'attack',
      operation: 'subtract',
      value: 2,
      label: 'Shaken: -2 on attack rolls, saves, skill and ability checks',
    },
  ],
  frightened: [
    {
      target: 'attack',
      operation: 'subtract',
      value: 2,
      label: 'Frightened: -2 on attack rolls, saves, skill and ability checks',
      manualBoundary: { kind: 'partial', note: 'SRD: the creature must also flee if able.' },
    },
  ],
  panicked: [
    {
      target: 'attack',
      operation: 'subtract',
      value: 2,
      label: 'Panicked: -2 on saves, skill and ability checks',
      manualBoundary: {
        kind: 'partial',
        note: 'SRD: a panicked creature flees and cannot normally attack at all.',
      },
    },
  ],
  sickened: [
    {
      target: 'attack',
      operation: 'subtract',
      value: 2,
      label: 'Sickened: -2 on attack rolls, damage rolls, saves, skills',
    },
    {
      target: 'damage',
      operation: 'subtract',
      value: 2,
      label: 'Sickened: -2 on weapon damage rolls',
    },
  ],
  dazzled: [
    { target: 'attack', operation: 'subtract', value: 1, label: 'Dazzled: -1 on attack rolls' },
  ],
  entangled: [
    {
      target: 'attack',
      operation: 'subtract',
      value: 2,
      label: 'Entangled: -2 on attack rolls (and -4 Dexterity)',
      manualBoundary: {
        kind: 'partial',
        note: 'SRD: the -4 Dexterity penalty (and its AC effect) is not auto-applied.',
      },
    },
  ],
  prone: [
    {
      target: 'attack',
      operation: 'subtract',
      value: 4,
      label: 'Prone: -4 on melee attack rolls',
      manualBoundary: {
        kind: 'partial',
        note: 'SRD: melee attacks only; a prone ranged attacker uses different rules.',
      },
    },
  ],
  blinded: [
    {
      target: 'attack',
      operation: 'note',
      label: 'Blinded: all opponents have total concealment (50% miss chance)',
      manualBoundary: { kind: 'manual', note: 'Miss chance is not auto-applied.' },
    },
  ],
  stunned: [
    {
      target: 'attack',
      operation: 'note',
      label: 'Stunned: drops held items, can take no actions, -2 AC',
      manualBoundary: { kind: 'manual', note: 'Action denial is adjudicated at the table.' },
    },
  ],
};

/** True when the catalog encodes any effect for this normalized condition id. */
export function hasD20LegacyConditionEffects(conditionId: string): boolean {
  return conditionId in D20_LEGACY_CONDITION_EFFECTS;
}

/** Compile active legacy-d20 conditions into effect instances. */
export function collectD20LegacyConditionEffects(
  systemId: D20LegacySystemId,
  conditionIds: readonly string[]
): EffectInstance[] {
  const effects: EffectInstance[] = [];
  for (const conditionId of conditionIds) {
    const templates = D20_LEGACY_CONDITION_EFFECTS[conditionId];
    if (!templates) continue;
    for (const [index, template] of templates.entries()) {
      effects.push({
        id: makeEffectId(systemId, 'condition', conditionId, template.target, index),
        systemId,
        target: template.target,
        operation: template.operation,
        value: template.value ?? null,
        stackPolicy: 'sum',
        source: { kind: 'condition', id: conditionId, label: conditionId },
        label: template.label,
        category: 'other',
        condition: { kind: 'has-condition', conditionId },
        manualBoundary: template.manualBoundary,
      });
    }
  }
  return effects;
}
