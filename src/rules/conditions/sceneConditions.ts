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
import {
  collectDaggerheartConditionEffects,
  DAGGERHEART_CONDITION_IDS,
} from './daggerheartConditions';
import { mam3eBruisePenalty } from './mam3eConditions';

// Daggerheart's note-only condition catalog and M&M's bruise selector now live in
// their own per-system modules; re-export them so the historical import surface
// (`./sceneConditions`) — used by the barrel and sceneCombat — stays stable.
export { DAGGERHEART_CONDITION_IDS, mam3eBruisePenalty };

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
