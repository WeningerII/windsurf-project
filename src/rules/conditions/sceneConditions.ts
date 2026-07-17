/**
 * System-aware scene condition compiler (road-to-launch phase 5).
 *
 * Scene tokens carry conditions as normalized string ids; which RULES those
 * ids encode depends on the scene's system. This dispatcher routes a token's
 * conditions to the right per-system catalog so every system's tokens fight
 * under their own condition rules:
 *
 *   - 5e family (and unset systems, preserving historical behavior): the
 *     advantage/disadvantage catalog in dnd5eConditions;
 *   - PF2e: value-bearing status penalties ('frightened-2') — the worst
 *     'all checks' penalty folds onto the attack roll;
 *   - 3.5e / PF1e: the shared flat-penalty OGL catalog;
 *   - Daggerheart: note-only provenance (Vulnerable/Restrained/Hidden change
 *     INCOMING rolls and movement, never the bearer's own attack roll);
 *   - M&M 3e: the bruise track penalizes Toughness saves, exposed separately
 *     via mam3eBruisePenalty because Toughness is resolved out-of-band.
 */

import { makeEffectId, type EffectInstance } from '../ir/types';
import { collectDnd5eConditionEffects } from './dnd5eConditions';
import { collectD20LegacyConditionEffects } from './d20LegacyConditions';
import { getPf2eConditionStatusPenalty } from './pf2eConditions';

/** Daggerheart conditions all modify incoming rolls or movement — notes only. */
const DAGGERHEART_CONDITION_NOTES: Record<string, string> = {
  vulnerable: 'Vulnerable: rolls against you have advantage',
  restrained: 'Restrained: you cannot move (attacks unaffected)',
  hidden: 'Hidden: rolls against you have disadvantage until you are seen',
};

/** Catalog-backed Daggerheart condition ids, for pickers that store ids. */
export const DAGGERHEART_CONDITION_IDS = Object.keys(DAGGERHEART_CONDITION_NOTES);

/** Parse a 'name-N' condition id into its value-bearing form ('frightened-2'). */
function parseValuedCondition(conditionId: string): { name: string; value?: number } {
  const match = /^(.*)-(\d+)$/.exec(conditionId);
  return match ? { name: match[1], value: Number(match[2]) } : { name: conditionId };
}

function collectPf2eSceneConditionEffects(conditionIds: readonly string[]): EffectInstance[] {
  const parsed = conditionIds.map(parseValuedCondition);
  // Attack rolls are checks: only the 'all checks' status conditions
  // (frightened/sickened) apply, and PF2e status penalties never stack — the
  // selector returns the single worst one.
  const penalty = getPf2eConditionStatusPenalty(parsed);
  if (penalty <= 0) return [];
  return [
    {
      id: makeEffectId('pf2e', 'condition', 'status-penalty', 'attack', penalty),
      systemId: 'pf2e',
      target: 'attack',
      operation: 'subtract',
      value: penalty,
      stackPolicy: 'pf2e-status',
      source: { kind: 'condition', id: 'status-penalty', label: 'status penalty' },
      label: `Status penalty: -${penalty} on checks (worst of frightened/sickened)`,
      category: 'other',
    },
  ];
}

function collectDaggerheartConditionEffects(conditionIds: readonly string[]): EffectInstance[] {
  const effects: EffectInstance[] = [];
  for (const conditionId of conditionIds) {
    const note = DAGGERHEART_CONDITION_NOTES[conditionId];
    if (!note) continue;
    effects.push({
      id: makeEffectId('daggerheart', 'condition', conditionId, 'attack'),
      systemId: 'daggerheart',
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

/**
 * Cumulative Toughness-save penalty from the bruise track ('bruised-N').
 * M&M 3e: each Bruised result imposes a further -1 on later Toughness saves.
 */
export function mam3eBruisePenalty(conditionIds: readonly string[]): number {
  for (const conditionId of conditionIds) {
    const match = /^bruised-(\d+)$/.exec(conditionId);
    if (match) return Number(match[1]);
  }
  return 0;
}

/**
 * Compile a scene token's conditions into attack-side effects under the
 * SCENE'S system rules. Unknown ids contribute nothing; an unset systemId
 * keeps the historical 5e vocabulary.
 */
export function collectSceneConditionEffects(
  systemId: string | undefined,
  conditionIds: readonly string[]
): EffectInstance[] {
  if (!conditionIds.length) return [];
  switch (systemId) {
    case 'pf2e':
      return collectPf2eSceneConditionEffects(conditionIds);
    case 'pf1e':
    case 'dnd-3.5e':
      return collectD20LegacyConditionEffects(systemId, conditionIds);
    case 'daggerheart':
      return collectDaggerheartConditionEffects(conditionIds);
    case 'mam3e':
      // Bruises target Toughness saves (handled in the M&M resolve branch via
      // mam3eBruisePenalty); the bearer's own attack roll is unaffected.
      return [];
    default:
      return collectDnd5eConditionEffects(conditionIds);
  }
}
