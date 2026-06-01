/**
 * D&D 5e conditions, expressed in the system-agnostic rules IR.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 2.
 *
 * Conditions become DATA: each active condition contributes `EffectInstance[]`
 * that the resolver folds, instead of bespoke branches scattered through
 * `rollCheck`. Roll-affecting effects use `advantage`/`disadvantage` on a roll
 * target (`attack`, `ability-check`, `save`, `save.<ability>`). Situational
 * effects (e.g. "while you can see the source", target-side advantage) are
 * recorded as honest `note` effects with a `manualBoundary` rather than being
 * auto-applied where the rules make them conditional on the fiction.
 *
 * This catalog reproduces the previously hard-coded behavior exactly (poisoned →
 * disadvantage on ability checks; the paralyzed-family auto-fail on STR/DEX
 * saves stays an engine-level outcome override) and extends it to the
 * deterministic, non-situational cases the engine can honestly automate.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';
import type { ContributionManualBoundary } from '../../types/core/contributionLedger';

const SYSTEM_ID = 'dnd-5e-2014';

/** A condition's effect templates, before per-instance id/source stamping. */
interface ConditionEffectTemplate {
  target: string;
  operation: EffectInstance['operation'];
  /** Defaults to null for advantage/disadvantage/note. */
  value?: EffectInstance['value'];
  label: string;
  manualBoundary?: ContributionManualBoundary;
}

/**
 * RAW condition effects (SRD). Keyed by normalized condition id.
 *
 * Only deterministic, non-situational roll modifiers use real
 * advantage/disadvantage operations; situational ones are `note`s so they are
 * surfaced for the player/GM without silently mis-applying.
 */
const DND5E_CONDITION_EFFECTS: Record<string, ConditionEffectTemplate[]> = {
  blinded: [
    { target: 'attack', operation: 'disadvantage', label: 'Blinded: disadvantage on attack rolls' },
    {
      target: 'incoming-attack',
      operation: 'note',
      label: 'Blinded: attack rolls against you have advantage',
      manualBoundary: { kind: 'manual', note: 'Applies to attackers, resolved on the attack.' },
    },
  ],
  frightened: [
    {
      target: 'ability-check',
      operation: 'note',
      label: 'Frightened: disadvantage on ability checks while the source is in sight',
      manualBoundary: {
        kind: 'partial',
        note: 'Disadvantage applies only while the source of fear is within line of sight.',
      },
    },
    {
      target: 'attack',
      operation: 'note',
      label: 'Frightened: disadvantage on attack rolls while the source is in sight',
      manualBoundary: {
        kind: 'partial',
        note: 'Disadvantage applies only while the source of fear is within line of sight.',
      },
    },
  ],
  poisoned: [
    {
      target: 'attack',
      operation: 'disadvantage',
      label: 'Poisoned: disadvantage on attack rolls',
    },
    {
      target: 'ability-check',
      operation: 'disadvantage',
      label: 'Poisoned: disadvantage on ability checks',
    },
  ],
  prone: [
    { target: 'attack', operation: 'disadvantage', label: 'Prone: disadvantage on attack rolls' },
    {
      target: 'incoming-attack',
      operation: 'note',
      label: 'Prone: melee attacks against you have advantage; ranged have disadvantage',
      manualBoundary: {
        kind: 'manual',
        note: 'Depends on attacker range; resolved on the attack.',
      },
    },
  ],
  restrained: [
    {
      target: 'attack',
      operation: 'disadvantage',
      label: 'Restrained: disadvantage on attack rolls',
    },
    {
      target: 'save.dex',
      operation: 'disadvantage',
      label: 'Restrained: disadvantage on Dexterity saving throws',
    },
    {
      target: 'incoming-attack',
      operation: 'note',
      label: 'Restrained: attack rolls against you have advantage',
      manualBoundary: { kind: 'manual', note: 'Applies to attackers, resolved on the attack.' },
    },
  ],
  // The paralyzed family auto-fails STR/DEX saves and is also auto-hit/critted
  // in melee. Auto-fail is an outcome override (not a roll modifier), so it stays
  // an engine-level concern; we record an explanatory note here for provenance.
  paralyzed: [
    {
      target: 'save.str',
      operation: 'note',
      label: 'Paralyzed: automatically fails Strength saving throws',
      manualBoundary: { kind: 'manual', note: 'Auto-fail is applied as an outcome override.' },
    },
    {
      target: 'save.dex',
      operation: 'note',
      label: 'Paralyzed: automatically fails Dexterity saving throws',
      manualBoundary: { kind: 'manual', note: 'Auto-fail is applied as an outcome override.' },
    },
  ],
  stunned: [
    {
      target: 'save.str',
      operation: 'note',
      label: 'Stunned: automatically fails Strength saving throws',
      manualBoundary: { kind: 'manual', note: 'Auto-fail is applied as an outcome override.' },
    },
    {
      target: 'save.dex',
      operation: 'note',
      label: 'Stunned: automatically fails Dexterity saving throws',
      manualBoundary: { kind: 'manual', note: 'Auto-fail is applied as an outcome override.' },
    },
  ],
};

/** True when the catalog encodes any effect for this normalized condition id. */
export function hasDnd5eConditionEffects(conditionId: string): boolean {
  return conditionId in DND5E_CONDITION_EFFECTS;
}

/**
 * Compile the active 5e conditions into effect instances. `conditionIds` must be
 * normalized (lowercase, hyphenated) — the engine already normalizes them.
 */
export function collectDnd5eConditionEffects(conditionIds: readonly string[]): EffectInstance[] {
  const effects: EffectInstance[] = [];
  for (const conditionId of conditionIds) {
    const templates = DND5E_CONDITION_EFFECTS[conditionId];
    if (!templates) continue;
    for (const [index, template] of templates.entries()) {
      effects.push({
        id: makeEffectId(SYSTEM_ID, 'condition', conditionId, template.target, index),
        systemId: SYSTEM_ID,
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

/**
 * Does any active condition impose disadvantage (auto-applied, non-situational)
 * on the given roll target set? Used by the engine to source its roll-mode
 * decision from the condition IR instead of bespoke branches.
 *
 * `note` effects (situational/manual) deliberately do not count.
 */
export function conditionImposesDisadvantage(
  conditionIds: readonly string[],
  targets: readonly string[]
): boolean {
  const targetSet = new Set(targets);
  return collectDnd5eConditionEffects(conditionIds).some(
    (effect) => effect.operation === 'disadvantage' && targetSet.has(effect.target)
  );
}
