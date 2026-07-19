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
  deriveMam3eCreatorTotals,
  type Mam3eAbilities,
} from '../../../systems/mam3e/creator/useMam3eCreatorDraft';
import { createDefaultMam3eData } from '../../../systems/mam3e/data-model';

/** Canonical zeroed abilities with optional overrides — no hardcoded parallel copy. */
function abilities(over: Partial<Mam3eAbilities> = {}): Mam3eAbilities {
  return { ...createDefaultMam3eData().abilities, ...over };
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
