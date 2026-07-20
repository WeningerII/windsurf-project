/**
 * Pure-math unit tests for the M&M 3e guided creator's draft hook.
 *
 * These exercise the extracted pure helpers (`buildMam3eCreatorData` and
 * `deriveMam3eCreatorTotals`) directly rather than rendering React: the point is
 * to pin the creator's budget/spend/PL-cap numbers, all of which come from the
 * real Mam3eEngine, not a parallel calculator. Component behaviour is covered by
 * mam3eCreator.test.tsx.
 */
import { describe, expect, it } from 'vitest';
import {
  buildMam3eCreatorData,
  createDefaultMam3eDefenseRanks,
  deriveMam3eCreatorTotals,
  type Mam3eAbilities,
  type Mam3eDefenseRanks,
} from '../../../systems/mam3e/creator/useMam3eCreatorDraft';
import { createDefaultMam3eData } from '../../../systems/mam3e/data-model';

/** Canonical zeroed abilities with optional overrides — no hardcoded parallel copy. */
function abilities(over: Partial<Mam3eAbilities> = {}): Mam3eAbilities {
  return { ...createDefaultMam3eData().abilities, ...over };
}

/** All-zero purchased defense ranks with optional overrides. */
function defenseRanks(over: Partial<Mam3eDefenseRanks> = {}): Mam3eDefenseRanks {
  return { ...createDefaultMam3eDefenseRanks(), ...over };
}

describe('buildMam3eCreatorData (toData shape)', () => {
  it('sets the Power Point budget to 15 × Power Level', () => {
    expect(buildMam3eCreatorData(10, abilities()).powerPoints.total).toBe(150);
    expect(buildMam3eCreatorData(7, abilities()).powerPoints.total).toBe(105);
    expect(buildMam3eCreatorData(8, abilities()).powerPoints.total).toBe(120);
  });

  it('overlays the chosen power level and abilities but leaves everything else default', () => {
    const data = buildMam3eCreatorData(12, abilities({ str: 3, awe: 1 }));
    expect(data.powerLevel).toBe(12);
    expect(data.abilities.str).toBe(3);
    expect(data.abilities.awe).toBe(1);
    // Raw, pre-engine model: spent buckets untouched, catalogs empty.
    expect(data.powerPoints.spent).toEqual({
      abilities: 0,
      powers: 0,
      advantages: 0,
      skills: 0,
      defenses: 0,
    });
    expect(data.powers).toEqual([]);
    expect(data.advantages).toEqual([]);
    expect(data.defenses).toEqual(createDefaultMam3eData().defenses);
  });

  it('allows negative ability ranks (legal in M&M 3e)', () => {
    const data = buildMam3eCreatorData(10, abilities({ str: -2 }));
    expect(data.abilities.str).toBe(-2);
  });
});

describe('deriveMam3eCreatorTotals (engine-backed budget math)', () => {
  it('reports budget = 15 × PL across power levels', () => {
    expect(deriveMam3eCreatorTotals(10, abilities()).budget).toBe(150);
    expect(deriveMam3eCreatorTotals(8, abilities()).budget).toBe(120);
  });

  it('charges 2 PP per ability rank via the engine (str 4 + sta 2 => 12 spent)', () => {
    const totals = deriveMam3eCreatorTotals(10, abilities({ str: 4, sta: 2 }));
    expect(totals.spent.abilities).toBe(12);
    expect(totals.totalSpent).toBe(12);
  });

  it('computes remaining = budget − totalSpent', () => {
    const totals = deriveMam3eCreatorTotals(10, abilities({ str: 4, sta: 2 }));
    expect(totals.remaining).toBe(150 - 12);
    expect(totals.overBudget).toBe(false);
  });

  it('flags overBudget when spend exceeds the budget', () => {
    // PL 1 → budget 15; Strength 10 alone costs 10 × 2 = 20 PP.
    const totals = deriveMam3eCreatorTotals(1, abilities({ str: 10 }));
    expect(totals.totalSpent).toBe(20);
    expect(totals.remaining).toBe(-5);
    expect(totals.overBudget).toBe(true);
  });

  it('surfaces a defense-pair PL-cap violation from the engine (Agi + Sta > 2×PL)', () => {
    // PL 1 → Dodge+Toughness cap is 2, but Agility 5 (Dodge) + Stamina 5
    // (Toughness) drive each total to 5 → sum 10.
    const totals = deriveMam3eCreatorTotals(1, abilities({ agi: 5, sta: 5 }));
    expect(totals.plViolations).toContainEqual({
      label: 'Dodge + Toughness',
      value: 10,
      limit: 2,
    });
  });

  it('reports no violations for a balanced build exactly at the cap', () => {
    // PL 10 → 2×PL = 20; Sta/Agi/Fgt/Awe 10 put every defense pair at exactly 20.
    const totals = deriveMam3eCreatorTotals(
      10,
      abilities({ sta: 10, agi: 10, fgt: 10, awe: 10 })
    );
    expect(totals.plViolations).toEqual([]);
  });

  it('handles negative ability ranks (below-average traits refund points)', () => {
    const totals = deriveMam3eCreatorTotals(10, abilities({ str: -2 }));
    expect(totals.system.abilities.str).toBe(-2);
    expect(totals.spent.abilities).toBe(-4); // −2 ranks × 2 PP
  });
});

describe('deriveMam3eCreatorTotals — skills (engine cost = ceil(totalRanks / 2))', () => {
  it('charges 1 PP per 2 total ranks across all skills', () => {
    // acrobatics 3 + athletics 2 = 5 total ranks → ceil(5 / 2) = 3 PP.
    const totals = deriveMam3eCreatorTotals(10, abilities(), { acrobatics: 3, athletics: 2 });
    expect(totals.spent.skills).toBe(3);
    expect(totals.totalSpent).toBe(3);
  });

  it('rounds a single odd total up (1 rank → 1 PP)', () => {
    expect(deriveMam3eCreatorTotals(10, abilities(), { stealth: 1 }).spent.skills).toBe(1);
  });

  it('charges an even total exactly (4 ranks → 2 PP)', () => {
    expect(deriveMam3eCreatorTotals(10, abilities(), { technology: 4 }).spent.skills).toBe(2);
  });

  it('lets the engine overwrite the seeded skill total with rank + governing ability', () => {
    // Perception is governed by Awareness: total = rank 3 + AWE 2 = 5.
    const totals = deriveMam3eCreatorTotals(10, abilities({ awe: 2 }), { perception: 3 });
    expect(totals.system.skills.perception.total).toBe(5);
  });
});

describe('deriveMam3eCreatorTotals — defenses (engine cost = 1 PP per rank)', () => {
  it('sums the five purchased defense ranks at 1 PP each', () => {
    const totals = deriveMam3eCreatorTotals(
      10,
      abilities(),
      {},
      defenseRanks({ dodge: 2, parry: 1, will: 3 })
    );
    expect(totals.spent.defenses).toBe(6);
    expect(totals.totalSpent).toBe(6);
  });

  it('adds the purchased rank on top of the governing ability in the total', () => {
    // Dodge total = AGI 4 + purchased rank 2 = 6.
    const totals = deriveMam3eCreatorTotals(10, abilities({ agi: 4 }), {}, defenseRanks({ dodge: 2 }));
    expect(totals.system.defenses.dodge.total).toBe(6);
  });

  it('surfaces a defense-pair PL-cap violation driven purely by purchased ranks', () => {
    // PL 5 → 2×PL = 10. Abilities 0, but Dodge rank 8 + Toughness rank 5 drive
    // the totals to 8 and 5 → sum 13, breaking the Dodge+Toughness cap.
    const totals = deriveMam3eCreatorTotals(
      5,
      abilities(),
      {},
      defenseRanks({ dodge: 8, toughness: 5 })
    );
    expect(totals.plViolations).toContainEqual({ label: 'Dodge + Toughness', value: 13, limit: 10 });
  });
});

describe('deriveMam3eCreatorTotals — illegal negative purchased ranks clamp to 0', () => {
  it('clamps a negative skill rank (no point refund)', () => {
    const totals = deriveMam3eCreatorTotals(10, abilities(), { acrobatics: -4 });
    expect(totals.spent.skills).toBe(0);
    expect(totals.system.skills.acrobatics.rank).toBe(0);
  });

  it('clamps a negative defense rank (no point refund, no total drop)', () => {
    const totals = deriveMam3eCreatorTotals(10, abilities(), {}, defenseRanks({ dodge: -3 }));
    expect(totals.spent.defenses).toBe(0);
    expect(totals.system.defenses.dodge.rank).toBe(0);
  });
});

describe('buildMam3eCreatorData — carries skills + defenses (raw, pre-engine)', () => {
  it('seeds each skill rank with total 0 (the engine overwrites total later)', () => {
    const data = buildMam3eCreatorData(10, abilities(), { acrobatics: 3 });
    expect(data.skills.acrobatics).toEqual({ rank: 3, total: 0 });
  });

  it('seeds all five defense ranks with total 0', () => {
    const data = buildMam3eCreatorData(
      10,
      abilities(),
      {},
      defenseRanks({ dodge: 2, will: 1 })
    );
    expect(data.defenses.dodge).toEqual({ rank: 2, total: 0 });
    expect(data.defenses.will).toEqual({ rank: 1, total: 0 });
    // Raw model: spend still zero (the engine computes it at add time).
    expect(data.powerPoints.spent.skills).toBe(0);
    expect(data.powerPoints.spent.defenses).toBe(0);
  });

  it('defaults to empty skills / all-zero defenses for the abilities-only call', () => {
    const data = buildMam3eCreatorData(10, abilities());
    expect(data.skills).toEqual({});
    expect(data.defenses).toEqual(createDefaultMam3eData().defenses);
  });
});
