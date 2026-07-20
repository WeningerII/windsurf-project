import { describe, it, expect } from 'vitest';

import type { Monster } from '../../types/creatures/monsters';
import {
  draftEncounter,
  encounterPartyBudget,
  monsterEncounterCost,
  supportsEncounterBudget,
  partyXpBudget,
  pf1eEncounterXpBudget,
  pf2eEncounterBudget,
  pf2eCreatureXp,
  dnd35eEncounterBudget,
  dnd35eCreatureValue,
} from '../../scene/encounterDraft';
import { validateEncounterSpec, type EncounterSpec } from '../../scene/encounterSpec';

function monster(overrides: Partial<Monster> & { id: string }): Monster {
  return {
    name: overrides.id,
    system: 'dnd-5e-2014',
    // An open-content source by default so fixtures pass the policy check; the
    // policy-excluded test overrides it.
    source: 'SRD 5.1',
    size: 'medium',
    type: 'beast',
    alignment: 'unaligned',
    armorClass: 12,
    hitPoints: { average: 10, formula: '3d8' },
    speed: { walk: 30 },
    abilities: { str: 10, dex: 10, con: 10, int: 2, wis: 10, cha: 6 },
    challengeRating: 1,
    experiencePoints: 50,
    actions: [],
    ...overrides,
  } as unknown as Monster;
}

const catalog = [
  monster({ id: 'goblin', experiencePoints: 50 }),
  monster({ id: 'orc', experiencePoints: 100 }),
  monster({ id: 'ogre', experiencePoints: 450 }),
];

function spec(overrides: Partial<EncounterSpec> = {}): EncounterSpec {
  return {
    systemId: 'dnd-5e-2014',
    difficulty: 'moderate',
    partyLevels: [3, 3, 3, 3], // moderate budget = 4 x 225 = 900
    selections: [{ monsterId: 'goblin', count: 2 }],
    ...overrides,
  };
}

describe('validateEncounterSpec — happy path', () => {
  it('accepts an on-budget, open-content, system-matched encounter', () => {
    const result = validateEncounterSpec(spec({ selections: [{ monsterId: 'ogre', count: 1 }] }), {
      monsters: catalog,
    });
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.budget).toBe(900);
    expect(result.totalXp).toBe(450);
    expect(result.remaining).toBe(450);
  });
});

describe('validateEncounterSpec — error codes', () => {
  it('unsupported-system: a system with no budget model at all', () => {
    const result = validateEncounterSpec(spec({ systemId: 'daggerheart' }), { monsters: catalog });
    expect(result.valid).toBe(false);
    expect(result.issues.map((i) => i.code)).toEqual(['unsupported-system']);
    expect(result.budget).toBe(0);
  });

  it('no-party: an empty party can not be budgeted', () => {
    const result = validateEncounterSpec(spec({ partyLevels: [] }), { monsters: catalog });
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === 'no-party')).toBe(true);
  });

  it('empty-spec: no monsters selected', () => {
    const result = validateEncounterSpec(spec({ selections: [] }), { monsters: catalog });
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === 'empty-spec')).toBe(true);
  });

  it('unknown-monster: an id not in the catalog', () => {
    const result = validateEncounterSpec(
      spec({ selections: [{ monsterId: 'tarrasque', count: 1 }] }),
      {
        monsters: catalog,
      }
    );
    const issue = result.issues.find((i) => i.code === 'unknown-monster');
    expect(issue).toMatchObject({ severity: 'error', selectionIndex: 0, monsterId: 'tarrasque' });
    expect(result.valid).toBe(false);
  });

  it('system-mismatch: a monster from another system', () => {
    const offSystem = [monster({ id: 'aboleth', system: 'pf2e', source: 'Core Rulebook' })];
    const result = validateEncounterSpec(
      spec({ selections: [{ monsterId: 'aboleth', count: 1 }] }),
      {
        monsters: offSystem,
      }
    );
    expect(result.issues.some((i) => i.code === 'system-mismatch')).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('policy-excluded: a non-open-content source', () => {
    const homebrew = [monster({ id: 'glass-golem', source: "Homebrewer's Almanac" })];
    const result = validateEncounterSpec(
      spec({ selections: [{ monsterId: 'glass-golem', count: 1 }] }),
      {
        monsters: homebrew,
      }
    );
    const issue = result.issues.find((i) => i.code === 'policy-excluded');
    expect(issue).toMatchObject({ severity: 'error', monsterId: 'glass-golem' });
    expect(result.valid).toBe(false);
  });

  it('invalid-count: non-integer, zero, or over the per-selection cap', () => {
    for (const count of [0, -1, 1.5, 21]) {
      const result = validateEncounterSpec(spec({ selections: [{ monsterId: 'goblin', count }] }), {
        monsters: catalog,
      });
      expect(result.issues.some((i) => i.code === 'invalid-count')).toBe(true);
      expect(result.valid).toBe(false);
    }
  });

  it('no-xp-cost: a monster the budget model can not price', () => {
    const free = [monster({ id: 'commoner', experiencePoints: 0 })];
    const result = validateEncounterSpec(
      spec({ selections: [{ monsterId: 'commoner', count: 1 }] }),
      {
        monsters: free,
      }
    );
    expect(result.issues.some((i) => i.code === 'no-xp-cost')).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('over-budget: spends more than the difficulty budget', () => {
    // 4 x 450 (ogre) = 1800 > 900 moderate budget.
    const result = validateEncounterSpec(spec({ selections: [{ monsterId: 'ogre', count: 4 }] }), {
      monsters: catalog,
    });
    const issue = result.issues.find((i) => i.code === 'over-budget');
    expect(issue?.severity).toBe('error');
    expect(result.totalXp).toBe(1800);
    expect(result.remaining).toBe(-900);
    expect(result.valid).toBe(false);
  });
});

describe('validateEncounterSpec — warnings', () => {
  it('duplicate-monster is a warning, not a blocker', () => {
    const result = validateEncounterSpec(
      spec({
        selections: [
          { monsterId: 'goblin', count: 1 },
          { monsterId: 'goblin', count: 1 },
        ],
      }),
      { monsters: catalog }
    );
    const dup = result.issues.find((i) => i.code === 'duplicate-monster');
    expect(dup?.severity).toBe('warning');
    // 2 x 50 = 100, within the 900 budget → still valid despite the warning.
    expect(result.valid).toBe(true);
    expect(result.totalXp).toBe(100);
  });
});

describe('shared budget/cost dispatch', () => {
  it('supportsEncounterBudget gates exactly the five budgeted systems', () => {
    expect(supportsEncounterBudget('dnd-5e-2014')).toBe(true);
    expect(supportsEncounterBudget('dnd-5e-2024')).toBe(true);
    expect(supportsEncounterBudget('dnd-3.5e')).toBe(true);
    expect(supportsEncounterBudget('pf1e')).toBe(true);
    expect(supportsEncounterBudget('pf2e')).toBe(true);
    expect(supportsEncounterBudget('mam3e')).toBe(false);
    expect(supportsEncounterBudget('daggerheart')).toBe(false);
  });

  it('encounterPartyBudget dispatches to each system table', () => {
    const party = [4, 4, 4, 4];
    expect(encounterPartyBudget('dnd-5e-2014', party, 'moderate')).toBe(
      partyXpBudget(party, 'moderate')
    );
    expect(encounterPartyBudget('dnd-5e-2024', party, 'low')).toBe(partyXpBudget(party, 'low'));
    expect(encounterPartyBudget('pf1e', party, 'high')).toBe(pf1eEncounterXpBudget(party, 'high'));
    expect(encounterPartyBudget('pf2e', party, 'moderate')).toBe(
      pf2eEncounterBudget(party, 'moderate')
    );
    expect(encounterPartyBudget('dnd-3.5e', party, 'high')).toBe(
      dnd35eEncounterBudget(party, 'high')
    );
    // APL 4, moderate -> EL 4 -> derived value 200.
    expect(encounterPartyBudget('dnd-3.5e', party, 'moderate')).toBe(200);
  });

  it('monsterEncounterCost uses XP for 5e/PF1e, party-relative for PF2e, EL-value for 3.5e', () => {
    const m = monster({ id: 'x', experiencePoints: 700, challengeRating: 3, system: 'pf2e' });
    expect(monsterEncounterCost('dnd-5e-2014', m, [3, 3, 3, 3])).toBe(700);
    expect(monsterEncounterCost('pf1e', m, [3, 3, 3, 3])).toBe(700);
    // PF2e: party level = round(avg(3,3,3,3)) = 3; creature level 3 vs party 3 = 40.
    expect(monsterEncounterCost('pf2e', m, [3, 3, 3, 3])).toBe(pf2eCreatureXp(3, 3));
    expect(monsterEncounterCost('pf2e', m, [3, 3, 3, 3])).toBe(40);
    // 3.5e ignores raw XP and prices off the derived EL-value scale (CR 3 = 140).
    const m35 = monster({ id: 'y', experiencePoints: 700, challengeRating: 3, system: 'dnd-3.5e' });
    expect(monsterEncounterCost('dnd-3.5e', m35, [4, 4, 4, 4])).toBe(dnd35eCreatureValue(3));
    expect(monsterEncounterCost('dnd-3.5e', m35, [4, 4, 4, 4])).toBe(140);
  });
});

describe('drafter <-> validator consistency', () => {
  it('a 5e draft always validates against the same catalog (no error issues)', () => {
    const partyLevels = [5, 5, 5, 5];
    const draft = draftEncounter({
      monsters: catalog,
      partyLevels,
      difficulty: 'high',
      seed: 'consistency-5e',
      systemId: 'dnd-5e-2014',
      budget: encounterPartyBudget('dnd-5e-2014', partyLevels, 'high'),
      costFor: (m) => monsterEncounterCost('dnd-5e-2014', m, partyLevels),
    });
    expect(draft.selections.length).toBeGreaterThan(0);

    const result = validateEncounterSpec(
      { systemId: 'dnd-5e-2014', difficulty: 'high', partyLevels, selections: draft.selections },
      { monsters: catalog }
    );
    expect(result.valid).toBe(true);
    expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    expect(result.totalXp).toBe(draft.totalXp);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('a PF2e draft (party-relative cost) validates with the shared dispatch', () => {
    const pf2eCatalog = [
      monster({ id: 'pf2e-a', system: 'pf2e', source: 'Core Rulebook', challengeRating: 1 }),
      monster({ id: 'pf2e-b', system: 'pf2e', source: 'Core Rulebook', challengeRating: 2 }),
      monster({ id: 'pf2e-c', system: 'pf2e', source: 'B1', challengeRating: 3 }),
    ];
    const partyLevels = [3, 3, 3, 3];
    const draft = draftEncounter({
      monsters: pf2eCatalog,
      partyLevels,
      difficulty: 'moderate',
      seed: 'consistency-pf2e',
      systemId: 'pf2e',
      budget: encounterPartyBudget('pf2e', partyLevels, 'moderate'),
      costFor: (m) => monsterEncounterCost('pf2e', m, partyLevels),
    });
    expect(draft.selections.length).toBeGreaterThan(0);

    const result = validateEncounterSpec(
      { systemId: 'pf2e', difficulty: 'moderate', partyLevels, selections: draft.selections },
      { monsters: pf2eCatalog }
    );
    expect(result.valid).toBe(true);
    expect(result.totalXp).toBe(draft.totalXp);
  });

  it('a 3.5e draft (derived EL-value cost) validates with the shared dispatch', () => {
    const dnd35eCatalog = [
      monster({ id: 'dnd35e-a', system: 'dnd-3.5e', source: 'SRD 3.5', challengeRating: 1 }),
      monster({ id: 'dnd35e-b', system: 'dnd-3.5e', source: 'SRD 3.5', challengeRating: 2 }),
      monster({ id: 'dnd35e-c', system: 'dnd-3.5e', source: 'SRD 3.5', challengeRating: 4 }),
    ];
    const partyLevels = [4, 4, 4, 4];
    const draft = draftEncounter({
      monsters: dnd35eCatalog,
      partyLevels,
      difficulty: 'high',
      seed: 'consistency-dnd35e',
      systemId: 'dnd-3.5e',
      budget: encounterPartyBudget('dnd-3.5e', partyLevels, 'high'),
      costFor: (m) => monsterEncounterCost('dnd-3.5e', m, partyLevels),
    });
    expect(draft.selections.length).toBeGreaterThan(0);

    const result = validateEncounterSpec(
      { systemId: 'dnd-3.5e', difficulty: 'high', partyLevels, selections: draft.selections },
      { monsters: dnd35eCatalog }
    );
    expect(result.valid).toBe(true);
    expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    expect(result.totalXp).toBe(draft.totalXp);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });
});
