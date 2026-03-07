import { describe, expect, it } from 'vitest';
import { compute5eAC, computeD20LegacyAC, computePf2eAC } from '../../utils/armorClass';

describe('compute5eAC', () => {
  it('handles unarmored and light/medium/heavy armor with shields', () => {
    expect(compute5eAC(14, [])).toBe(12);
    expect(
      compute5eAC(14, [
        { slot: 'chest', armorClass: 11, armorType: 'light' },
        { slot: 'offHand', shieldBonus: 2 },
      ])
    ).toBe(15);
    expect(
      compute5eAC(18, [{ slot: 'chest', armorClass: 14, armorType: 'medium', dexBonusMax: 2 }])
    ).toBe(16);
    expect(compute5eAC(18, [{ slot: 'chest', armorClass: 16, armorType: 'heavy' }])).toBe(16);
  });
});

describe('computeD20LegacyAC', () => {
  it('applies armor, shield, dex cap, and size modifiers', () => {
    expect(
      computeD20LegacyAC(18, 'small', [
        { equipped: true, armorClass: 6, dexBonusMax: 1 },
        { equipped: true, shieldBonus: 2 },
      ])
    ).toEqual({
      total: 20,
      touch: 15,
      flatFooted: 19,
    });
  });

  it('defaults unknown sizes to 0 and supports unarmored characters', () => {
    expect(computeD20LegacyAC(12, 'mystery', [])).toEqual({
      total: 11,
      touch: 11,
      flatFooted: 10,
    });
  });
});

describe('computePf2eAC', () => {
  it('computes unarmored and armored PF2e AC including shields', () => {
    expect(computePf2eAC(16, 4, [])).toBe(17);
    expect(
      computePf2eAC(18, 4, [
        { equipped: true, armorClass: 5, dexBonusMax: 1 },
        { equipped: true, shieldBonus: 2 },
      ])
    ).toBe(22);
  });
});
