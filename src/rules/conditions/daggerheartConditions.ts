/**
 * Daggerheart conditions, expressed in the system-agnostic rules IR.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 2.
 *
 * Daggerheart's core conditions (Vulnerable/Restrained/Hidden) all change
 * INCOMING rolls against the bearer or restrict movement — none of them modify
 * the bearer's OWN duality roll (Daggerheart SRD: Conditions). They are therefore
 * honest `note` effects with a `manualBoundary`: surfaced for provenance, never
 * silently folded into the roller's 2d12.
 *
 * This module lifts the previously inline scene-condition definitions into a
 * dedicated per-system catalog, matching the dnd5e/pf2e/d20-legacy modules.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';

const SYSTEM_ID = 'daggerheart';

/** Daggerheart conditions all modify incoming rolls or movement — notes only. */
const DAGGERHEART_CONDITION_NOTES: Record<string, string> = {
  vulnerable: 'Vulnerable: rolls against you have advantage',
  restrained: 'Restrained: you cannot move (attacks unaffected)',
  hidden: 'Hidden: rolls against you have disadvantage until you are seen',
};

/** Catalog-backed Daggerheart condition ids, for pickers that store ids. */
export const DAGGERHEART_CONDITION_IDS = Object.keys(DAGGERHEART_CONDITION_NOTES);

/** True when the catalog encodes a note for this normalized condition id. */
export function hasDaggerheartConditionEffects(conditionId: string): boolean {
  return conditionId in DAGGERHEART_CONDITION_NOTES;
}

/**
 * Compile a set of active Daggerheart condition ids into note-only effect
 * instances. Each records how the condition changes the fight — always on the
 * OTHER side of a roll — with a manual boundary, so nothing is auto-applied to
 * the bearer's own duality roll. Unknown ids contribute nothing.
 */
export function collectDaggerheartConditionEffects(
  conditionIds: readonly string[]
): EffectInstance[] {
  const effects: EffectInstance[] = [];
  for (const conditionId of conditionIds) {
    const note = DAGGERHEART_CONDITION_NOTES[conditionId];
    if (!note) continue;
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'condition', conditionId, 'attack'),
      systemId: SYSTEM_ID,
      target: 'attack',
      operation: 'note',
      value: null,
      stackPolicy: 'sum',
      source: { kind: 'condition', id: conditionId, label: conditionId },
      label: note,
      category: 'other',
      condition: { kind: 'has-condition', conditionId },
      manualBoundary: {
        kind: 'manual',
        note: 'Affects incoming rolls/movement; resolved on the other side of the attack.',
      },
    });
  }
  return effects;
}
