import { describe, expect, it } from 'vitest';
import {
  resetD20LegacySpellSlots,
  setD20LegacySpellSlotTotal,
} from '../../../systems/d20-legacy/d20LegacySheetShared';

describe('D20 legacy sheet helpers', () => {
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
});
