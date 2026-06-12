/**
 * Deterministic encounter drafting (road-to-launch phase 6).
 *
 * The grounded substrate the master plan requires before any AI drafting loop:
 * a difficulty-banded, seeded, validating encounter drafter. Given the party,
 * a difficulty, and the scene's monster catalog, it proposes
 * `EncounterMonsterSelection`s whose summed XP spends the party's budget
 * without going over — exactly the SRD procedure. The output feeds the SAME
 * `summarizeEncounterPlan`/`buildEncounterSceneEvents` path manual selection
 * uses, so validation stays the single authority. A future AI provider can
 * replace the PICKER; the budget math and the validator do not move.
 *
 * Budget source (cited, never invented): SRD 5.2.1 (CC-BY-4.0), Gameplay
 * Toolbox — "XP Budget per Character" (Low/Moderate/High by level). The 2024
 * rules spend the budget as a plain sum; there is no encounter multiplier.
 */

import type { Monster } from '../types/creatures/monsters';
import { createSeededRng } from './seededRng';
import type { EncounterMonsterSelection } from './encounterBuilder';
import { MAX_MONSTERS_PER_SELECTION } from './encounterBuilder';

export type EncounterDifficulty = 'low' | 'moderate' | 'high';

/** SRD 5.2.1: XP Budget per Character, levels 1-20 — [low, moderate, high]. */
const XP_BUDGET_PER_CHARACTER: ReadonlyArray<readonly [number, number, number]> = [
  [50, 75, 100],
  [100, 150, 200],
  [150, 225, 400],
  [250, 375, 500],
  [500, 750, 1100],
  [600, 1000, 1400],
  [750, 1300, 1700],
  [1000, 1700, 2100],
  [1300, 2000, 2600],
  [1600, 2300, 3100],
  [1900, 2900, 4100],
  [2200, 3700, 4700],
  [2600, 4200, 5400],
  [2900, 4900, 6200],
  [3300, 5400, 7800],
  [3800, 6100, 9800],
  [4500, 7200, 11700],
  [5000, 8700, 14200],
  [5500, 10700, 17200],
  [6400, 13200, 22000],
];

const DIFFICULTY_COLUMN: Record<EncounterDifficulty, 0 | 1 | 2> = {
  low: 0,
  moderate: 1,
  high: 2,
};

/** Budget contribution of one character at `level` (level clamped to 1-20). */
export function xpBudgetPerCharacter(level: number, difficulty: EncounterDifficulty): number {
  const clamped = Math.min(20, Math.max(1, Math.trunc(level)));
  return XP_BUDGET_PER_CHARACTER[clamped - 1][DIFFICULTY_COLUMN[difficulty]];
}

/** The party's pooled XP budget: the per-character budgets summed. */
export function partyXpBudget(
  partyLevels: readonly number[],
  difficulty: EncounterDifficulty
): number {
  return partyLevels.reduce((total, level) => total + xpBudgetPerCharacter(level, difficulty), 0);
}

export interface DraftEncounterParams {
  /** The scene's monster catalog (already loaded; system-filtered by caller or via systemId). */
  monsters: Monster[];
  /** Character levels of the party members the encounter must challenge. */
  partyLevels: readonly number[];
  difficulty: EncounterDifficulty;
  /** Drives every random choice; same inputs + seed → same draft. */
  seed: string;
  /** Restrict candidates to this system's monsters (mirrors the builder's gate). */
  systemId?: string;
  /** Most distinct monster types in one draft (default 3). */
  maxDistinct?: number;
}

export interface DraftEncounterResult {
  selections: EncounterMonsterSelection[];
  /** The party's pooled budget the draft spent against. */
  budget: number;
  /** Total XP of the drafted monsters (always <= budget when non-empty). */
  totalXp: number;
  /** Honest emptiness: why nothing could be drafted, when applicable. */
  reason?: string;
}

/**
 * Draft selections that spend as much of the party's XP budget as possible
 * without going over (SRD: "spend as much of your XP budget as you can
 * without going over"). Deterministic: candidates are chosen by seeded rng
 * over a stably-sorted pool, then greedily stacked while they fit.
 */
export function draftEncounter(params: DraftEncounterParams): DraftEncounterResult {
  const { monsters, partyLevels, difficulty, seed } = params;
  const maxDistinct = Math.max(1, params.maxDistinct ?? 3);
  const budget = partyXpBudget(partyLevels, difficulty);
  if (budget <= 0) {
    return { selections: [], budget, totalXp: 0, reason: 'Party has no XP budget.' };
  }

  // Stable candidate pool: affordable, XP-bearing, system-matched monsters,
  // sorted by id so the draft never depends on catalog load order.
  const pool = monsters
    .filter(
      (monster) =>
        monster.experiencePoints > 0 &&
        monster.experiencePoints <= budget &&
        (!params.systemId || monster.system === params.systemId)
    )
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  if (!pool.length) {
    return {
      selections: [],
      budget,
      totalXp: 0,
      reason: 'No monster in the catalog fits the XP budget.',
    };
  }

  const rng = createSeededRng(`${seed}:encounter-draft`);
  const selections: EncounterMonsterSelection[] = [];
  let remaining = budget;
  const used = new Set<string>();

  for (let slot = 0; slot < maxDistinct && remaining > 0; slot += 1) {
    const affordable = pool.filter(
      (monster) => !used.has(monster.id) && monster.experiencePoints <= remaining
    );
    if (!affordable.length) break;
    const pick = affordable[rng.rollDie(affordable.length) - 1];
    used.add(pick.id);
    const maxCount = Math.min(
      MAX_MONSTERS_PER_SELECTION,
      Math.floor(remaining / pick.experiencePoints)
    );
    // Group size: 1..maxCount, seeded — variety without busting the budget.
    const count = maxCount <= 1 ? 1 : rng.rollDie(maxCount);
    selections.push({ monsterId: pick.id, count });
    remaining -= pick.experiencePoints * count;
  }

  return { selections, budget, totalXp: budget - remaining };
}
