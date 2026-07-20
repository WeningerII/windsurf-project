import { describe, it, expect } from 'vitest';

import {
  draftEncounter,
  partyXpBudget,
  xpBudgetPerCharacter,
  dnd35eEncounterBudget,
  dnd35eCreatureValue,
  monsterEncounterCost,
} from '../../scene/encounterDraft';
import { summarizeEncounterPlan } from '../../scene/encounterBuilder';
import type { Monster } from '../../types/creatures/monsters';

function monster(id: string, xp: number, system = 'dnd-5e-2014'): Monster {
  return {
    id,
    name: id,
    system,
    source: 'test',
    size: 'medium',
    type: 'beast',
    alignment: 'unaligned',
    armorClass: 12,
    hitPoints: { average: 10, formula: '3d8' },
    speed: { walk: 30 },
    abilities: { str: 10, dex: 10, con: 10, int: 2, wis: 10, cha: 6 },
    challengeRating: 1,
    experiencePoints: xp,
    actions: [],
  } as unknown as Monster;
}

describe('SRD 5.2.1 XP budget table', () => {
  it('matches the cited Gameplay Toolbox rows at the corners and a midpoint', () => {
    expect(xpBudgetPerCharacter(1, 'low')).toBe(50);
    expect(xpBudgetPerCharacter(1, 'high')).toBe(100);
    expect(xpBudgetPerCharacter(5, 'moderate')).toBe(750);
    expect(xpBudgetPerCharacter(20, 'low')).toBe(6400);
    expect(xpBudgetPerCharacter(20, 'high')).toBe(22000);
  });

  it('clamps out-of-range levels and pools the party as a plain sum', () => {
    expect(xpBudgetPerCharacter(0, 'low')).toBe(50);
    expect(xpBudgetPerCharacter(25, 'high')).toBe(22000);
    // 2024 rules: no encounter multiplier — four level-3 PCs at moderate = 4 x 225.
    expect(partyXpBudget([3, 3, 3, 3], 'moderate')).toBe(900);
  });
});

describe('draftEncounter', () => {
  const catalog = [
    monster('goblin', 50),
    monster('orc', 100),
    monster('ogre', 450),
    monster('dragon', 5000),
    monster('off-system', 100, 'pf2e'),
  ];

  it('is deterministic for the same seed and never overspends the budget', () => {
    const params = {
      monsters: catalog,
      partyLevels: [3, 3, 3, 3],
      difficulty: 'moderate' as const,
      seed: 'table-1',
      systemId: 'dnd-5e-2014',
    };
    const first = draftEncounter(params);
    const second = draftEncounter(params);
    expect(second.selections).toEqual(first.selections);
    expect(first.budget).toBe(900);
    expect(first.totalXp).toBeGreaterThan(0);
    expect(first.totalXp).toBeLessThanOrEqual(first.budget);
    // The dragon (5000 XP) can never appear in a 900 XP draft.
    expect(first.selections.some((s) => s.monsterId === 'dragon')).toBe(false);
    expect(first.selections.some((s) => s.monsterId === 'off-system')).toBe(false);
  });

  it('drafted selections validate cleanly through the encounter builder', () => {
    const draft = draftEncounter({
      monsters: catalog,
      partyLevels: [5, 5, 5, 5],
      difficulty: 'high',
      seed: 'table-2',
      systemId: 'dnd-5e-2014',
    });
    const summary = summarizeEncounterPlan({
      monsters: catalog,
      selections: draft.selections,
      systemId: 'dnd-5e-2014',
    });
    expect(summary.issues).toHaveLength(0);
    expect(summary.totalXp).toBe(draft.totalXp);
  });

  it('reports honest emptiness when nothing fits', () => {
    const broke = draftEncounter({
      monsters: [monster('dragon', 5000)],
      partyLevels: [1],
      difficulty: 'low',
      seed: 'table-3',
    });
    expect(broke.selections).toHaveLength(0);
    expect(broke.reason).toMatch(/fits the XP budget/);
    const noParty = draftEncounter({
      monsters: catalog,
      partyLevels: [],
      difficulty: 'low',
      seed: 'table-4',
    });
    expect(noParty.reason).toMatch(/no XP budget/);
  });
});

describe('PF1e CRB encounter budgets', () => {
  it('target CR = APL + difficulty offset, XP from the awards table', async () => {
    const { pf1eEncounterXpBudget } = await import('../../scene/encounterDraft');
    const party4 = [4, 4, 4, 4];
    // APL 4: easy -> CR 3 (800), average -> CR 4 (1,200), challenging -> CR 5 (1,600).
    expect(pf1eEncounterXpBudget(party4, 'low')).toBe(800);
    expect(pf1eEncounterXpBudget(party4, 'moderate')).toBe(1200);
    expect(pf1eEncounterXpBudget(party4, 'high')).toBe(1600);
    // Six players: APL +1.
    expect(pf1eEncounterXpBudget([4, 4, 4, 4, 4, 4], 'moderate')).toBe(1600);
    // Three players: APL -1.
    expect(pf1eEncounterXpBudget([4, 4, 4], 'moderate')).toBe(800);
    // CRB floor: an easy encounter for APL 1 is CR 1/2.
    expect(pf1eEncounterXpBudget([1, 1, 1, 1], 'low')).toBe(200);
    // APL rounds to NEAREST (avg 4.5 -> 5).
    expect(pf1eEncounterXpBudget([4, 4, 5, 5], 'moderate')).toBe(1600);
  });

  it('drafts encoded Bestiary 1 monsters within the CRB budget', async () => {
    const { draftEncounter, pf1eEncounterXpBudget } = await import('../../scene/encounterDraft');
    const { summarizeEncounterPlan } = await import('../../scene/encounterBuilder');
    const { pf1eMonsters } = await import('../../data/pathfinder/1e/monsters');
    const partyLevels = [5, 5, 5, 5];
    const budget = pf1eEncounterXpBudget(partyLevels, 'moderate');
    const draft = draftEncounter({
      monsters: pf1eMonsters,
      partyLevels,
      difficulty: 'moderate',
      seed: 'pf1e-draft-1',
      systemId: 'pf1e',
      budget,
    });
    expect(draft.budget).toBe(1600);
    expect(draft.selections.length).toBeGreaterThan(0);
    expect(draft.totalXp).toBeLessThanOrEqual(budget);
    const summary = summarizeEncounterPlan({
      monsters: pf1eMonsters,
      selections: draft.selections,
      systemId: 'pf1e',
    });
    expect(summary.issues).toHaveLength(0);
    expect(summary.totalXp).toBe(draft.totalXp);
  });
});

describe('D&D 3.5e Encounter-Level budgets (derived EL-value scale)', () => {
  it('preserves the SRD +2-EL-doubling invariant: value(CR+2) === 2 * value(CR)', () => {
    // The core correctness contract. Two CR-X creatures cost 2*value(X), which
    // must equal value(X+2) — i.e. exactly an EL X+2 encounter.
    for (let cr = 1; cr <= 18; cr += 1) {
      expect(dnd35eCreatureValue(cr + 2)).toBe(2 * dnd35eCreatureValue(cr));
    }
    // Spot-check both parity chains numerically.
    expect(dnd35eCreatureValue(3)).toBe(2 * dnd35eCreatureValue(1)); // 140 === 2*70
    expect(dnd35eCreatureValue(4)).toBe(2 * dnd35eCreatureValue(2)); // 200 === 2*100
    expect(dnd35eCreatureValue(20)).toBe(2 * dnd35eCreatureValue(18)); // 51200 === 2*25600
  });

  it('two CR-X monsters cost the same as one EL-(X+2) budget', () => {
    // Standard encounter at EL 5 for an APL-5 party = value(5). Two CR-3
    // monsters (2 * value(3)) compose to that same EL 5 value.
    const twoCr3 = 2 * dnd35eCreatureValue(3);
    expect(twoCr3).toBe(dnd35eCreatureValue(5));
    // And an APL-5 moderate budget is exactly value(5).
    expect(dnd35eEncounterBudget([5, 5, 5, 5], 'moderate')).toBe(dnd35eCreatureValue(5));
  });

  it('maps low/moderate/high to EL = APL-1/APL/APL+1 for a party of four', () => {
    const party4 = [4, 4, 4, 4]; // APL 4
    expect(dnd35eEncounterBudget(party4, 'low')).toBe(dnd35eCreatureValue(3)); // EL 3 = 140
    expect(dnd35eEncounterBudget(party4, 'moderate')).toBe(dnd35eCreatureValue(4)); // EL 4 = 200
    expect(dnd35eEncounterBudget(party4, 'high')).toBe(dnd35eCreatureValue(5)); // EL 5 = 280
    // A lone on-APL monster spends the standard (moderate) budget exactly.
    expect(dnd35eEncounterBudget(party4, 'moderate')).toBe(200);
  });

  it('rounds APL to the nearest whole level and clamps the target EL to 1..20', () => {
    // avg 4.5 rounds to 5 (Math.round: half up).
    expect(dnd35eEncounterBudget([4, 4, 5, 5], 'moderate')).toBe(dnd35eCreatureValue(5));
    // APL 1, low difficulty would be EL 0 -> clamped to EL 1.
    expect(dnd35eEncounterBudget([1, 1, 1, 1], 'low')).toBe(dnd35eCreatureValue(1));
    // APL 20, high difficulty would be EL 21 -> clamped to EL 20.
    expect(dnd35eEncounterBudget([20, 20, 20, 20], 'high')).toBe(dnd35eCreatureValue(20));
    // No party -> no budget.
    expect(dnd35eEncounterBudget([], 'moderate')).toBe(0);
  });

  it('drafts 3.5e monsters within the EL budget, deterministically', () => {
    const base = monster('x', 0, 'dnd-3.5e');
    const catalog35 = [
      { ...base, id: 'kobold', challengeRating: 1 },
      { ...base, id: 'orc', challengeRating: 2 },
      { ...base, id: 'ogre', challengeRating: 3 },
      { ...base, id: 'giant', challengeRating: 8 },
    ] as unknown as Monster[];
    const partyLevels = [6, 6, 6, 6]; // APL 6, high -> EL 7 -> value 560
    const budget = dnd35eEncounterBudget(partyLevels, 'high');
    const params = {
      monsters: catalog35,
      partyLevels,
      difficulty: 'high' as const,
      seed: 'dnd35e-draft-1',
      systemId: 'dnd-3.5e',
      budget,
      costFor: (m: Monster) => monsterEncounterCost('dnd-3.5e', m, partyLevels),
    };
    const draft = draftEncounter(params);
    expect(draft.budget).toBe(560);
    expect(draft.selections.length).toBeGreaterThan(0);
    expect(draft.totalXp).toBeLessThanOrEqual(budget);
    // The CR-8 giant (value 800 > 560) can never be drafted into this budget.
    expect(draft.selections.some((s) => s.monsterId === 'giant')).toBe(false);
    expect(draftEncounter(params).selections).toEqual(draft.selections);
  });
});

describe('PF2e CRB encounter budgets (party-relative XP)', () => {
  it('budgets follow Table 10-1 with per-character adjustments', async () => {
    const { pf2eEncounterBudget } = await import('../../scene/encounterDraft');
    const four = [3, 3, 3, 3];
    expect(pf2eEncounterBudget(four, 'low')).toBe(60);
    expect(pf2eEncounterBudget(four, 'moderate')).toBe(80);
    expect(pf2eEncounterBudget(four, 'high')).toBe(120); // Severe threat
    expect(pf2eEncounterBudget([3, 3, 3, 3, 3], 'moderate')).toBe(100);
    expect(pf2eEncounterBudget([3, 3, 3], 'moderate')).toBe(60);
  });

  it('creature cost follows Table 10-2 and excludes out-of-band levels', async () => {
    const { pf2eCreatureXp } = await import('../../scene/encounterDraft');
    expect(pf2eCreatureXp(3, 3)).toBe(40);
    expect(pf2eCreatureXp(2, 3)).toBe(30);
    expect(pf2eCreatureXp(-1, 3)).toBe(10);
    expect(pf2eCreatureXp(7, 3)).toBe(160);
    expect(pf2eCreatureXp(8, 3)).toBe(0); // party level +5: not appropriate
    expect(pf2eCreatureXp(-2, 3)).toBe(0); // party level -5
  });

  it('drafts encoded Bestiary 1 creatures within the relative budget', async () => {
    const { draftEncounter, pf2eEncounterBudget, pf2eCreatureXp } =
      await import('../../scene/encounterDraft');
    const { pf2eMonsters } = await import('../../data/pathfinder/2e/monsters');
    const partyLevels = [3, 3, 3, 3];
    const partyLevel = 3;
    const costFor = (monster: { challengeRating: number }) =>
      pf2eCreatureXp(monster.challengeRating, partyLevel);
    const params = {
      monsters: pf2eMonsters,
      partyLevels,
      difficulty: 'moderate' as const,
      seed: 'pf2e-draft-1',
      systemId: 'pf2e',
      budget: pf2eEncounterBudget(partyLevels, 'moderate'),
      costFor,
    };
    const draft = draftEncounter(params);
    expect(draft.budget).toBe(80);
    expect(draft.selections.length).toBeGreaterThan(0);
    expect(draft.totalXp).toBeLessThanOrEqual(80);
    // Every drafted creature is within the -4..+4 appropriateness band.
    const byId = new Map(pf2eMonsters.map((monster) => [monster.id, monster]));
    for (const selection of draft.selections) {
      expect(costFor(byId.get(selection.monsterId)!)).toBeGreaterThan(0);
    }
    expect(draftEncounter(params).selections).toEqual(draft.selections);
  });
});
