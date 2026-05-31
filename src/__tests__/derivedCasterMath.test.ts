/**
 * Verifies the canonical RAW caster/derived formulas in derivedCasterMath.ts.
 * Referenced by the compute registers for 5e (2014/2024), 3.5e, PF1e, and PF2e.
 */
import {
  dnd5eSpellSaveDC,
  dnd5eSpellAttackBonus,
  dnd5eConcentrationDC,
  dnd5ePassivePerception,
  dnd5eCantripScaleTier,
  d20LegacySpellSaveDC,
  pf2eClassOrSpellDC,
} from '../utils/derivedCasterMath';

describe('5e spell save DC and attack', () => {
  it('save DC = 8 + proficiency + ability mod', () => {
    expect(dnd5eSpellSaveDC(2, 3)).toBe(13); // level 1, +3 ability
    expect(dnd5eSpellSaveDC(6, 5)).toBe(19); // level 20, +5 ability
  });
  it('attack bonus = proficiency + ability mod', () => {
    expect(dnd5eSpellAttackBonus(2, 3)).toBe(5);
    expect(dnd5eSpellAttackBonus(6, 5)).toBe(11);
  });
});

describe('5e concentration DC', () => {
  it('is the greater of 10 and half the damage', () => {
    expect(dnd5eConcentrationDC(9)).toBe(10); // floor(4.5)=4 → 10 floor
    expect(dnd5eConcentrationDC(20)).toBe(10);
    expect(dnd5eConcentrationDC(22)).toBe(11);
    expect(dnd5eConcentrationDC(30)).toBe(15);
  });
});

describe('5e passive Perception', () => {
  it('applies proficiency and expertise correctly', () => {
    expect(dnd5ePassivePerception(3, 2, 'none')).toBe(13);
    expect(dnd5ePassivePerception(3, 2, 'proficient')).toBe(15);
    expect(dnd5ePassivePerception(3, 2, 'expertise')).toBe(17);
  });
});

describe('5e cantrip scaling tier', () => {
  it.each([
    [1, 1],
    [4, 1],
    [5, 2],
    [10, 2],
    [11, 3],
    [16, 3],
    [17, 4],
    [20, 4],
  ])('level %i → tier %i', (level, tier) => {
    expect(dnd5eCantripScaleTier(level)).toBe(tier);
  });
});

describe('d20 legacy spell save DC', () => {
  it('= 10 + spell level + ability mod', () => {
    expect(d20LegacySpellSaveDC(0, 3)).toBe(13); // cantrip/orison
    expect(d20LegacySpellSaveDC(3, 4)).toBe(17);
    expect(d20LegacySpellSaveDC(9, 5)).toBe(24);
  });
});

describe('PF2e class/spell DC', () => {
  it('= 10 + proficiency total + ability mod', () => {
    expect(pf2eClassOrSpellDC(3, 4)).toBe(17); // trained@1 (3) + +4
    expect(pf2eClassOrSpellDC(28, 7)).toBe(45); // legendary@20 (28) + +7
  });
});
