import { describe, expect, it } from 'vitest';
import {
  getIterativeAttackBonuses,
  recoverD20LegacySpellSlot,
  resetD20LegacySpellSlots,
  setD20LegacyPreparedSpell,
  setD20LegacySpellSlotTotal,
  spendD20LegacySpellSlot,
} from '../../../systems/d20-legacy/d20LegacySheetShared';

describe('D20 legacy sheet helpers', () => {
  it('derives iterative attacks in 5-point steps and stops below +1', () => {
    expect(getIterativeAttackBonuses(16)).toEqual([16, 11, 6, 1]);
    expect(getIterativeAttackBonuses(8)).toEqual([8, 3]);
    expect(getIterativeAttackBonuses(0)).toEqual([0]);
  });

  it('resets spent slots without changing totals or manual bonuses', () => {
    expect(
      resetD20LegacySpellSlots({
        0: { total: 3, used: 2 },
        1: { total: 2, used: 1, manualBonus: 1 },
      })
    ).toEqual({
      0: { total: 3, used: 0 },
      1: { total: 2, used: 0, manualBonus: 1 },
    });
    expect(resetD20LegacySpellSlots(undefined)).toBeUndefined();
  });

  it('records manual total edits as a delta from the automated baseline', () => {
    // Baseline 2 (no prior manualBonus): raising to 5 records +3.
    expect(setD20LegacySpellSlotTotal({ 1: { total: 2, used: 1 } }, 1, 5)).toEqual({
      1: { total: 5, used: 1, manualBonus: 3 },
    });

    // Existing +3 delta over baseline 2 (total 5): lowering to 1 records −1.
    expect(setD20LegacySpellSlotTotal({ 1: { total: 5, used: 4, manualBonus: 3 } }, 1, 1)).toEqual({
      1: { total: 1, used: 1, manualBonus: -1 },
    });

    // Setting the total back to the automated baseline clears the delta.
    expect(setD20LegacySpellSlotTotal({ 1: { total: 5, used: 0, manualBonus: 3 } }, 1, 2)).toEqual({
      1: { total: 2, used: 0 },
    });
  });

  it('clamps a lowered total down and floors a negative total at zero', () => {
    // Lowering the total below `used` clamps used down to the new total.
    expect(setD20LegacySpellSlotTotal({ 1: { total: 5, used: 4 } }, 1, 2)).toEqual({
      1: { total: 2, used: 2, manualBonus: -3 },
    });

    // A negative requested total floors at 0 (baseline 3 → -3 delta).
    expect(setD20LegacySpellSlotTotal({ 0: { total: 3, used: 1 } }, 0, -10)).toEqual({
      0: { total: 0, used: 0, manualBonus: -3 },
    });
  });

  it('leaves the slot map untouched when the level is absent or the map is undefined', () => {
    const slots = { 1: { total: 2, used: 0 } };
    // Editing a level that has no slot is a no-op (returns the same reference).
    expect(setD20LegacySpellSlotTotal(slots, 7, 4)).toBe(slots);
    expect(setD20LegacySpellSlotTotal(undefined, 1, 4)).toBeUndefined();
  });

  it('writes a prepared spell into a slot and grows the level array to that index', () => {
    expect(setD20LegacyPreparedSpell(undefined, 2, 0, 'fireball')).toEqual({ 2: ['fireball'] });

    // Writing into a higher index leaves a hole filled by undefined entries.
    const grown = setD20LegacyPreparedSpell({ 1: ['shield'] }, 1, 2, 'magic-missile');
    expect(grown).toEqual({ 1: ['shield', undefined, 'magic-missile'] });
  });

  it('trims trailing empty selections and drops the level entirely once it is empty', () => {
    // Clearing the only entry at a level prunes that level key (line 53 branch).
    expect(setD20LegacyPreparedSpell({ 1: ['shield'] }, 1, 0, '')).toEqual({});

    // Clearing the last of several entries trims the trailing hole but keeps
    // the earlier selection (line 46-48 trailing-trim loop).
    expect(setD20LegacyPreparedSpell({ 1: ['shield', 'mage-armor'] }, 1, 1, '')).toEqual({
      1: ['shield'],
    });

    // Other levels are preserved when one level is pruned.
    expect(setD20LegacyPreparedSpell({ 1: ['shield'], 2: ['scorching-ray'] }, 1, 0, '')).toEqual({
      2: ['scorching-ray'],
    });
  });

  it('spends a slot up to its cap and recovers it back down to zero spent', () => {
    expect(spendD20LegacySpellSlot({ 1: { total: 2, used: 0 } }, 1)).toEqual({
      1: { total: 2, used: 1 },
    });
    // Spending past the cap clamps at total (never over-spends).
    expect(spendD20LegacySpellSlot({ 1: { total: 2, used: 2 } }, 1)).toEqual({
      1: { total: 2, used: 2 },
    });

    expect(recoverD20LegacySpellSlot({ 1: { total: 2, used: 1, manualBonus: 1 } }, 1)).toEqual({
      1: { total: 2, used: 0, manualBonus: 1 },
    });
    // Recovering an unused slot stays at zero (never goes negative).
    expect(recoverD20LegacySpellSlot({ 1: { total: 2, used: 0 } }, 1)).toEqual({
      1: { total: 2, used: 0 },
    });
  });

  it('spend/recover are no-ops for a missing level or an undefined slot map', () => {
    const slots = { 1: { total: 2, used: 0 } };
    // Missing level returns the same map reference (guard branches, lines 65/79).
    expect(spendD20LegacySpellSlot(slots, 9)).toBe(slots);
    expect(recoverD20LegacySpellSlot(slots, 9)).toBe(slots);
    expect(spendD20LegacySpellSlot(undefined, 1)).toBeUndefined();
    expect(recoverD20LegacySpellSlot(undefined, 1)).toBeUndefined();
  });
});
