import { describe, it, expect } from 'vitest';

import { draftEncounter, partyXpBudget, xpBudgetPerCharacter } from '../../scene/encounterDraft';
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
