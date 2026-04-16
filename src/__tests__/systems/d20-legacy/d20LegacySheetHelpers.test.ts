import { describe, expect, it } from 'vitest';
import {
  getIterativeAttackBonuses,
  resetD20LegacySpellSlots,
} from '../../../systems/d20-legacy/d20LegacySheetShared';

describe('D20 legacy sheet helpers', () => {
  it('derives iterative attacks in 5-point steps and stops below +1', () => {
    expect(getIterativeAttackBonuses(16)).toEqual([16, 11, 6, 1]);
    expect(getIterativeAttackBonuses(8)).toEqual([8, 3]);
    expect(getIterativeAttackBonuses(0)).toEqual([0]);
  });

  it('resets spent slots without changing totals', () => {
    expect(
      resetD20LegacySpellSlots({
        0: { total: 3, used: 2 },
        1: { total: 2, used: 1 },
      })
    ).toEqual({
      0: { total: 3, used: 0 },
      1: { total: 2, used: 0 },
    });
    expect(resetD20LegacySpellSlots(undefined)).toBeUndefined();
  });
});
