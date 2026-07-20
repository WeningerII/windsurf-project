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

/**
 * PF1e CRB (PRD OGC), Gamemastering — "Table: Experience Point Awards", Total
 * XP column, CR 1/2 through 25 (verified against devonjones/PSRD-Data
 * core_rulebook/rules/gamemastering/designing_encounters).
 */
const PF1E_XP_BY_CR: Record<number, number> = {
  0.5: 200,
  1: 400,
  2: 600,
  3: 800,
  4: 1200,
  5: 1600,
  6: 2400,
  7: 3200,
  8: 4800,
  9: 6400,
  10: 9600,
  11: 12800,
  12: 19200,
  13: 25600,
  14: 38400,
  15: 51200,
  16: 76800,
  17: 102400,
  18: 153600,
  19: 204800,
  20: 307200,
  21: 409600,
  22: 614400,
  23: 819200,
  24: 1228800,
  25: 1638400,
};

/**
 * PF1e CRB, "Table: Encounter Design": the target CR is APL-1 (easy), APL
 * (average), or APL+1 (challenging) — mapped onto this module's low/moderate/
 * high difficulty vocabulary. APL is the party's average level rounded to the
 * NEAREST whole number (an explicit exception to round-down), +1 for parties
 * of six or more, -1 for three or fewer. An easy encounter for APL 1 is CR
 * 1/2 (the CRB's stated floor). The encounter's XP budget is the Total XP
 * award for the target CR.
 */
export function pf1eEncounterXpBudget(
  partyLevels: readonly number[],
  difficulty: EncounterDifficulty
): number {
  if (!partyLevels.length) return 0;
  const average = partyLevels.reduce((total, level) => total + level, 0) / partyLevels.length;
  let apl = Math.round(average);
  if (partyLevels.length >= 6) apl += 1;
  if (partyLevels.length <= 3) apl -= 1;
  apl = Math.max(1, apl);
  const offset = { low: -1, moderate: 0, high: 1 }[difficulty];
  const targetCr = Math.min(25, apl + offset);
  return PF1E_XP_BY_CR[targetCr <= 0 ? 0.5 : targetCr] ?? 0;
}

/**
 * PF2e CRB, "Table 10-1: Encounter Budget" (verified against Pf2eTools
 * tables.json): XP budget for a four-character party by threat, plus the
 * per-character adjustment for each character beyond (or short of) four.
 * This module's low/moderate/high map onto Low/Moderate/Severe threat.
 */
const PF2E_ENCOUNTER_BUDGET: Record<EncounterDifficulty, { base: number; perCharacter: number }> = {
  low: { base: 60, perCharacter: 15 },
  moderate: { base: 80, perCharacter: 20 },
  high: { base: 120, perCharacter: 30 },
};

export function pf2eEncounterBudget(
  partyLevels: readonly number[],
  difficulty: EncounterDifficulty
): number {
  if (!partyLevels.length) return 0;
  const { base, perCharacter } = PF2E_ENCOUNTER_BUDGET[difficulty];
  return Math.max(0, base + (partyLevels.length - 4) * perCharacter);
}

/**
 * PF2e CRB, "Table 10-2: Creature XP and Role": a creature costs XP by its
 * level relative to the party's. Creatures outside the -4..+4 band are not
 * appropriate encounter members (cost 0 → excluded from the draft pool).
 */
const PF2E_CREATURE_XP: Record<number, number> = {
  [-4]: 10,
  [-3]: 15,
  [-2]: 20,
  [-1]: 30,
  0: 40,
  1: 60,
  2: 80,
  3: 120,
  4: 160,
};

export function pf2eCreatureXp(creatureLevel: number, partyLevel: number): number {
  return PF2E_CREATURE_XP[creatureLevel - partyLevel] ?? 0;
}

/**
 * D&D 3.5e Encounter-Level budgets.
 *
 * 3.5e sizes fights by Encounter Level (EL), not a published summed-XP budget
 * table. Two SRD facts drive everything (d20srd.org, "Dungeon Mastering", OGL
 * 1.0a — CITED-OFFICIAL): a lone creature of Challenge Rating X is an EL X
 * encounter, and DOUBLING the number of identical creatures raises the EL by 2
 * (two CR X creatures = EL X+2). A four-member party of a given level meets a
 * standard/"even" challenge at EL equal to that level.
 *
 * This repo's budget machinery is summed-cost (budget is a number; each monster
 * has a cost; the draft keeps the running sum <= budget). To host EL inside it
 * we DERIVE a CR->encounter-value scale (the numbers below are a MODELING CHOICE,
 * not an SRD table — 3.5e never prints one). The scale is pinned to the SRD's
 * +2-EL-doubling rule by construction: value(CR + 2) === 2 * value(CR). Because
 * value doubles every +2 CR, two CR-X creatures cost 2 * value(X) === value(X+2),
 * i.e. exactly an EL X+2 encounter — the invariant is preserved arithmetically.
 * A single CR-X creature costs value(X) === the EL-X budget, so one on-level
 * monster spends a standard encounter exactly.
 *
 * DERIVED numbers: two exact geometric chains (one per CR parity) so the
 * doubling holds without rounding drift; cross-parity steps land near the sqrt(2)
 * ratio the +2-doubling implies. Fractional CRs (< 1) are derived flavor below
 * value(1) and are not bound by the +2 rule (CR + 2 leaves the fractional band).
 */
const DND35E_EL_VALUE: Record<number, number> = {
  // Fractional CRs — DERIVED, monotonic, below the EL-1 value. Not +2-bound.
  0.125: 15,
  [1 / 6]: 20,
  0.25: 25,
  [1 / 3]: 35,
  0.5: 50,
  // Odd-CR chain — DERIVED, anchored at EL 1, doubling every +2 CR.
  1: 70,
  3: 140,
  5: 280,
  7: 560,
  9: 1120,
  11: 2240,
  13: 4480,
  15: 8960,
  17: 17920,
  19: 35840,
  // Even-CR chain — DERIVED, doubling every +2 CR.
  2: 100,
  4: 200,
  6: 400,
  8: 800,
  10: 1600,
  12: 3200,
  14: 6400,
  16: 12800,
  18: 25600,
  20: 51200,
};

/**
 * One 3.5e creature's encounter value: its EL-value from the derived CR scale.
 * A CR outside the modeled range has no value (cost 0 → excluded from a draft
 * and flagged no-xp-cost by the validator), mirroring the PF tables' bounds.
 */
export function dnd35eCreatureValue(challengeRating: number): number {
  return DND35E_EL_VALUE[challengeRating] ?? 0;
}

/**
 * A 3.5e party's encounter budget for a difficulty. The SRD's encounter tables
 * assume a party of four and treat EL = party level as a standard fight
 * (CITED-OFFICIAL). APL is the average character level rounded to the NEAREST
 * whole number (DERIVED rounding — the SRD states the party-of-four baseline but
 * prints no APL formula; unlike PF1e there is no party-size +/-1 adjustment
 * here). low/moderate/high map to EL = APL-1 / APL / APL+1 (DERIVED difficulty
 * band, mirroring the sibling systems' offset vocabulary). The budget is the
 * derived EL-value at the target EL, so a lone on-target-CR monster spends it
 * exactly.
 */
export function dnd35eEncounterBudget(
  partyLevels: readonly number[],
  difficulty: EncounterDifficulty
): number {
  if (!partyLevels.length) return 0;
  const average = partyLevels.reduce((total, level) => total + level, 0) / partyLevels.length;
  const apl = Math.max(1, Math.round(average));
  const offset = { low: -1, moderate: 0, high: 1 }[difficulty];
  const targetEl = Math.min(20, Math.max(1, apl + offset));
  return dnd35eCreatureValue(targetEl);
}

/**
 * The systems with a cited encounter-budget model in this repo. D&D 3.5e joins
 * the summed-XP systems via its Encounter-Level model, linearized into a derived
 * CR->value scale that preserves the SRD's +2-EL-doubling rule (see
 * {@link dnd35eEncounterBudget}); its budget and per-creature cost flow through
 * the same dispatch as the other systems.
 */
export const ENCOUNTER_BUDGET_SYSTEMS = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
] as const;

export type EncounterBudgetSystem = (typeof ENCOUNTER_BUDGET_SYSTEMS)[number];

export function supportsEncounterBudget(systemId: string): systemId is EncounterBudgetSystem {
  return (ENCOUNTER_BUDGET_SYSTEMS as readonly string[]).includes(systemId);
}

/**
 * PF2e sizes encounters around the party's level (CRB Table 10-2 is indexed by
 * creature level relative to party level). The party level is the average level
 * rounded to the nearest whole number.
 */
export function pf2ePartyLevel(partyLevels: readonly number[]): number {
  if (!partyLevels.length) return 0;
  return Math.round(partyLevels.reduce((total, level) => total + level, 0) / partyLevels.length);
}

/**
 * The party's pooled encounter budget for a system, dispatched to that system's
 * cited table. The single source of truth shared by the drafter and the
 * encounter-spec validator so the two can never disagree. Returns 0 for systems
 * without a budget model (see {@link ENCOUNTER_BUDGET_SYSTEMS}).
 */
export function encounterPartyBudget(
  systemId: string,
  partyLevels: readonly number[],
  difficulty: EncounterDifficulty
): number {
  switch (systemId) {
    case 'pf1e':
      return pf1eEncounterXpBudget(partyLevels, difficulty);
    case 'pf2e':
      return pf2eEncounterBudget(partyLevels, difficulty);
    case 'dnd-3.5e':
      return dnd35eEncounterBudget(partyLevels, difficulty);
    case 'dnd-5e-2014':
    case 'dnd-5e-2024':
      return partyXpBudget(partyLevels, difficulty);
    default:
      return 0;
  }
}

/**
 * One monster's encounter cost under a system's budget model: PF2e uses the
 * party-relative creature-XP table; the others use the monster's own XP award.
 * Shared by the drafter and the validator so the spend math is identical.
 */
export function monsterEncounterCost(
  systemId: string,
  monster: Monster,
  partyLevels: readonly number[]
): number {
  if (systemId === 'pf2e') {
    return pf2eCreatureXp(monster.challengeRating, pf2ePartyLevel(partyLevels));
  }
  if (systemId === 'dnd-3.5e') {
    // 3.5e prices creatures off the derived EL-value scale, not raw XP, so the
    // +2-EL-doubling composition holds (two CR-X monsters === one EL X+2).
    return dnd35eCreatureValue(monster.challengeRating);
  }
  return monster.experiencePoints;
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
  /**
   * Explicit XP budget (e.g. pf1eEncounterXpBudget). When set, it replaces
   * the SRD 5.2 per-character table — the spend/validate machinery is shared.
   */
  budget?: number;
  /**
   * Per-monster cost (e.g. PF2e's party-relative creature XP). Defaults to
   * the monster's fixed experiencePoints.
   */
  costFor?: (monster: Monster) => number;
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
  const budget = params.budget ?? partyXpBudget(partyLevels, difficulty);
  if (budget <= 0) {
    return { selections: [], budget, totalXp: 0, reason: 'Party has no XP budget.' };
  }

  const costFor = params.costFor ?? ((monster: Monster) => monster.experiencePoints);
  // Stable candidate pool: affordable, XP-bearing, system-matched monsters,
  // sorted by id so the draft never depends on catalog load order.
  const pool = monsters
    .filter(
      (monster) =>
        costFor(monster) > 0 &&
        costFor(monster) <= budget &&
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
      (monster) => !used.has(monster.id) && costFor(monster) <= remaining
    );
    if (!affordable.length) break;
    const pick = affordable[rng.rollDie(affordable.length) - 1];
    used.add(pick.id);
    const maxCount = Math.min(MAX_MONSTERS_PER_SELECTION, Math.floor(remaining / costFor(pick)));
    // Group size: 1..maxCount, seeded — variety without busting the budget.
    const count = maxCount <= 1 ? 1 : rng.rollDie(maxCount);
    selections.push({ monsterId: pick.id, count });
    remaining -= costFor(pick) * count;
  }

  return { selections, budget, totalXp: budget - remaining };
}
