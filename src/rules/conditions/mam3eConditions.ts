/**
 * Mutants & Masterminds 3e conditions, expressed in the system-agnostic rules IR.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 2/3.
 *
 * M&M 3e's damage-track condition is value-bearing on ONE axis: each Bruised
 * result imposes a cumulative -1 on later Toughness resistance checks (Hero's
 * Handbook, Damage). This mirrors the PF2e value-bearing selector pattern —
 * `mam3eToughnessPenalty(track)` returns a number the engine subtracts, and
 * `collectMam3eConditionEffects(track)` stamps `EffectInstance[]` for provenance.
 *
 * The other track states (Dazed/Staggered/Incapacitated) restrict actions
 * rather than modify a resistance roll, so they are honest `note` effects with a
 * `manualBoundary` rather than being folded into any roll math.
 *
 * Reproduces the engine's previously hard-coded behavior exactly: on a Toughness
 * check, `mod -= bruised` (each Bruised = cumulative -1).
 */

import { makeEffectId, type EffectInstance } from '../ir/types';
import type { ContributionManualBoundary } from '../../types/core/contributionLedger';
import type { Mam3eConditionTrack } from '../../systems/mam3e/data-model';

const SYSTEM_ID = 'mam3e';

/** The Toughness target namespace (matches the engine's `checkId === 'toughness'`). */
const TOUGHNESS_TARGET = 'toughness';

/**
 * Cumulative Toughness-save penalty (a positive magnitude to SUBTRACT) from the
 * bruise track. Each Bruised result imposes a further -1 on later Toughness
 * resistance checks (Hero's Handbook, Damage). Non-negative and integral (the
 * track is normalized upstream; this defends the invariant regardless).
 *
 * This is the value-bearing selector the engine sources its Toughness penalty
 * from — mirroring `getPf2eConditionStatusPenalty`.
 */
export function mam3eToughnessPenalty(track: Pick<Mam3eConditionTrack, 'bruised'>): number {
  return Math.max(0, Math.floor(track.bruised ?? 0));
}

/**
 * Cumulative Toughness-save penalty from a scene token's `bruised-N` condition
 * ids. Scene tokens store conditions as normalized string ids, so this is the
 * id-facing counterpart to `mam3eToughnessPenalty` (which reads the sheet's
 * structured track). Absorbed from the former `sceneConditions` stub so the
 * bruise rule lives in one place.
 */
export function mam3eBruisePenalty(conditionIds: readonly string[]): number {
  for (const conditionId of conditionIds) {
    const match = /^bruised-(\d+)$/.exec(conditionId);
    if (match) return Number(match[1]);
  }
  return 0;
}

const ACTION_LIMIT_BOUNDARY: ContributionManualBoundary = {
  kind: 'manual',
  note: 'Restricts available actions; enforced at the table, not as a roll modifier.',
};

/** Non-value track states and the note each carries (Hero's Handbook, Conditions). */
const MAM3E_STATE_NOTES: Record<Exclude<keyof Mam3eConditionTrack, 'bruised'>, string> = {
  dazed: 'Dazed: may take only a single standard OR move action on your turn',
  staggered: 'Staggered: hindered and dazed (single action, half speed)',
  incapacitated: 'Incapacitated: defenseless, stunned, and unable to take actions',
};

/**
 * Compile an active M&M condition track into effect instances.
 *
 * - Bruised → a `subtract` of the cumulative bruise count on the Toughness
 *   target (the numeric penalty; stacks by `sum`).
 * - Dazed/Staggered/Incapacitated → `note` effects with a manual boundary
 *   (action restrictions, not roll math).
 *
 * Inactive states contribute nothing.
 */
export function collectMam3eConditionEffects(track: Mam3eConditionTrack): EffectInstance[] {
  const effects: EffectInstance[] = [];

  const bruised = mam3eToughnessPenalty(track);
  if (bruised > 0) {
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'condition', 'bruised', TOUGHNESS_TARGET, bruised),
      systemId: SYSTEM_ID,
      target: TOUGHNESS_TARGET,
      operation: 'subtract',
      value: bruised,
      stackPolicy: 'sum',
      source: { kind: 'condition', id: 'bruised', label: 'bruised' },
      label: `Bruised ${bruised}: -${bruised} on Toughness resistance checks`,
      category: 'other',
      condition: { kind: 'has-condition', conditionId: 'bruised' },
    });
  }

  for (const [state, note] of Object.entries(MAM3E_STATE_NOTES) as Array<
    [Exclude<keyof Mam3eConditionTrack, 'bruised'>, string]
  >) {
    if (!track[state]) continue;
    effects.push({
      id: makeEffectId(SYSTEM_ID, 'condition', state, 'status'),
      systemId: SYSTEM_ID,
      target: 'status',
      operation: 'note',
      value: null,
      stackPolicy: 'sum',
      source: { kind: 'condition', id: state, label: state },
      label: note,
      category: 'other',
      condition: { kind: 'has-condition', conditionId: state },
      manualBoundary: ACTION_LIMIT_BOUNDARY,
    });
  }

  return effects;
}
