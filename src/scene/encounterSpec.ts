/**
 * Structured encounter-spec validation — the deterministic gate the master
 * plan's Scene Runtime track (RFC 006) requires before any AI drafting loop
 * feeds a proposed encounter into the event-backed scene path.
 *
 * Given a fully-specified encounter (system, difficulty, party levels, and the
 * monster selections), it answers one question with machine-readable detail:
 * is this a legal, on-budget, open-content encounter for this party? It reuses
 * the SAME budget/cost dispatch the drafter uses (`encounterPartyBudget` /
 * `monsterEncounterCost`), so a spec the drafter produces always validates and
 * the two can never disagree. Pure and deterministic.
 */

import type { Monster } from '../types/creatures/monsters';
import { isOpenContentCompliant } from '../utils/openContentPolicy';
import {
  encounterPartyBudget,
  monsterEncounterCost,
  supportsEncounterBudget,
  type EncounterDifficulty,
} from './encounterDraft';
import { MAX_MONSTERS_PER_SELECTION, type EncounterMonsterSelection } from './encounterBuilder';

export type EncounterSpecIssueCode =
  | 'unsupported-system'
  | 'no-party'
  | 'empty-spec'
  | 'unknown-monster'
  | 'system-mismatch'
  | 'policy-excluded'
  | 'invalid-count'
  | 'no-xp-cost'
  | 'duplicate-monster'
  | 'over-budget';

export interface EncounterSpecIssue {
  code: EncounterSpecIssueCode;
  /** `error` blocks the spec; `warning` is a quality signal a repair loop may act on. */
  severity: 'error' | 'warning';
  message: string;
  /** Index into `spec.selections`, when the issue is about one selection. */
  selectionIndex?: number;
  monsterId?: string;
}

export interface EncounterSpec {
  systemId: string;
  difficulty: EncounterDifficulty;
  partyLevels: readonly number[];
  selections: readonly EncounterMonsterSelection[];
}

export interface EncounterSpecValidation {
  /** True when there are no `error`-severity issues. */
  valid: boolean;
  issues: EncounterSpecIssue[];
  /** The party's budget for the difficulty (0 when the system/party can't be budgeted). */
  budget: number;
  /** Summed cost of the resolvable, costed selections. */
  totalXp: number;
  /** `budget - totalXp` (negative when over budget). */
  remaining: number;
}

/**
 * Validate a proposed encounter spec against the loaded monster catalog. Every
 * failure mode is reported as a coded {@link EncounterSpecIssue} so a caller
 * (today the scene UI; later an AI repair loop) can act on it programmatically.
 */
export function validateEncounterSpec(
  spec: EncounterSpec,
  context: { monsters: Monster[] }
): EncounterSpecValidation {
  const issues: EncounterSpecIssue[] = [];

  if (!supportsEncounterBudget(spec.systemId)) {
    issues.push({
      code: 'unsupported-system',
      severity: 'error',
      message: `Encounter budgeting is not modeled for ${spec.systemId}.`,
    });
    return { valid: false, issues, budget: 0, totalXp: 0, remaining: 0 };
  }
  // Captured after the guard so the narrowed type survives into the closure
  // below (a property-access narrowing would widen back inside `forEach`).
  const systemId = spec.systemId;

  const budget = encounterPartyBudget(systemId, spec.partyLevels, spec.difficulty);
  if (spec.partyLevels.length === 0 || budget <= 0) {
    issues.push({
      code: 'no-party',
      severity: 'error',
      message: 'An encounter needs a party with levels to size its budget.',
    });
  }
  if (spec.selections.length === 0) {
    issues.push({
      code: 'empty-spec',
      severity: 'error',
      message: 'The encounter has no monsters.',
    });
  }

  const monsterById = new Map(context.monsters.map((monster) => [monster.id, monster]));
  const seen = new Set<string>();
  let totalXp = 0;

  spec.selections.forEach((selection, selectionIndex) => {
    const at = { selectionIndex, monsterId: selection.monsterId };
    const monster = monsterById.get(selection.monsterId);
    if (!monster) {
      issues.push({
        ...at,
        code: 'unknown-monster',
        severity: 'error',
        message: `Monster '${selection.monsterId}' is not in the ${systemId} catalog.`,
      });
      return;
    }
    if (monster.system !== systemId) {
      issues.push({
        ...at,
        code: 'system-mismatch',
        severity: 'error',
        message: `${monster.name} belongs to ${monster.system}, not ${systemId}.`,
      });
      return;
    }
    if (!isOpenContentCompliant(systemId, 'monsters', monster)) {
      issues.push({
        ...at,
        code: 'policy-excluded',
        severity: 'error',
        message: `${monster.name} (source '${monster.source}') is outside the open-content policy for ${systemId}.`,
      });
      return;
    }

    const count = Number(selection.count);
    if (!Number.isInteger(count) || count <= 0 || count > MAX_MONSTERS_PER_SELECTION) {
      issues.push({
        ...at,
        code: 'invalid-count',
        severity: 'error',
        message: `Count for ${monster.name} must be an integer between 1 and ${MAX_MONSTERS_PER_SELECTION}.`,
      });
      return;
    }

    if (seen.has(monster.id)) {
      issues.push({
        ...at,
        code: 'duplicate-monster',
        severity: 'warning',
        message: `${monster.name} is listed more than once; its counts could be merged.`,
      });
    }
    seen.add(monster.id);

    const cost = monsterEncounterCost(systemId, monster, spec.partyLevels);
    if (cost <= 0) {
      issues.push({
        ...at,
        code: 'no-xp-cost',
        severity: 'error',
        message: `${monster.name} has no encounter cost for this party (outside the appropriate level band).`,
      });
      return;
    }

    totalXp += cost * count;
  });

  if (budget > 0 && totalXp > budget) {
    issues.push({
      code: 'over-budget',
      severity: 'error',
      message: `Encounter spends ${totalXp} XP but the ${spec.difficulty} budget is ${budget}.`,
    });
  }

  return {
    valid: !issues.some((issue) => issue.severity === 'error'),
    issues,
    budget,
    totalXp,
    remaining: budget - totalXp,
  };
}
