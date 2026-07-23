/**
 * Verifies the canonical RAW combat/skill/physical formulas in
 * derivedCombatMath.ts, plus the shared ability modifier. Referenced by the
 * compute registers for 3.5e, PF1e, 5e, PF2e, and Daggerheart.
 */
import {
  iterativeAttackBonuses,
  dnd35eSynergyBonus,
  dnd35eSkillSynergyTotal,
  dnd35eMaxSkillRanks,
  pf1eMaxSkillRanks,
  pf1eManeuverSucceeds,
  dnd5eUnarmoredDefenseBarbarian,
  dnd5eUnarmoredDefenseMonk,
  pf2eMultipleAttackPenalty,
  pf2eStrikingDice,
  pf2eBulkLimits,
  pf2eAutoHeightenRank,
  daggerheartDamageDiceCount,
} from '../utils/derivedCombatMath';
import { getPf2eConditionStatusPenalty } from '../rules/conditions/pf2eConditions';
import { abilityMod } from '../utils/math';

describe('shared ability modifier', () => {
  it('= floor((score - 10) / 2)', () => {
    expect(abilityMod(10)).toBe(0);
    expect(abilityMod(18)).toBe(4);
    expect(abilityMod(7)).toBe(-2);
  });
});

describe('d20 iterative attacks', () => {
  it('adds extra attacks at BAB +6/+11/+16, each −5', () => {
    expect(iterativeAttackBonuses(5)).toEqual([5]);
    expect(iterativeAttackBonuses(6)).toEqual([6, 1]);
    expect(iterativeAttackBonuses(8)).toEqual([8, 3]);
    expect(iterativeAttackBonuses(11)).toEqual([11, 6, 1]);
    expect(iterativeAttackBonuses(16)).toEqual([16, 11, 6, 1]);
    expect(iterativeAttackBonuses(20)).toEqual([20, 15, 10, 5]);
  });
});

describe('3.5e skill synergy and max ranks', () => {
  it('synergy gives +2 at 5+ ranks', () => {
    expect(dnd35eSynergyBonus(4)).toBe(0);
    expect(dnd35eSynergyBonus(5)).toBe(2);
  });
  it('maps unconditional synergy sources to their targets (stacking)', () => {
    // 5 ranks in Tumble grant +2 to both Balance and Jump.
    expect(dnd35eSkillSynergyTotal('balance', { tumble: 5 })).toBe(2);
    expect(dnd35eSkillSynergyTotal('jump', { tumble: 5 })).toBe(2);
    // Below the 5-rank threshold grants nothing.
    expect(dnd35eSkillSynergyTotal('balance', { tumble: 4 })).toBe(0);
    // Diplomacy draws from both Bluff and Sense Motive, which stack.
    expect(dnd35eSkillSynergyTotal('diplomacy', { bluff: 5, 'sense-motive': 5 })).toBe(4);
    expect(dnd35eSkillSynergyTotal('diplomacy', { bluff: 5 })).toBe(2);
    // A skill with no unconditional synergy source (the Spellcraft→UMD synergy is
    // conditional and intentionally excluded) gets nothing.
    expect(dnd35eSkillSynergyTotal('spellcraft', { 'use-magic': 5 })).toBe(0);
  });
  it('max ranks: class = level+3, cross-class = floor((level+3)/2)', () => {
    expect(dnd35eMaxSkillRanks(1, true)).toBe(4);
    expect(dnd35eMaxSkillRanks(1, false)).toBe(2);
    expect(dnd35eMaxSkillRanks(7, true)).toBe(10);
    expect(dnd35eMaxSkillRanks(7, false)).toBe(5);
  });
});

describe('PF1e max ranks and maneuvers', () => {
  it('max ranks = level', () => {
    expect(pf1eMaxSkillRanks(5)).toBe(5);
  });
  it('maneuver succeeds when CMB result meets/beats CMD', () => {
    expect(pf1eManeuverSucceeds(20, 20)).toBe(true);
    expect(pf1eManeuverSucceeds(19, 20)).toBe(false);
  });
});

describe('5e Unarmored Defense', () => {
  it('Barbarian = 10 + Dex + Con', () => {
    expect(dnd5eUnarmoredDefenseBarbarian(2, 3)).toBe(15);
  });
  it('Monk = 10 + Dex + Wis', () => {
    expect(dnd5eUnarmoredDefenseMonk(3, 2)).toBe(15);
  });
});

describe('PF2e MAP, striking, bulk, heightening', () => {
  it('MAP: 0 / −5 / −10 (agile −4 / −8)', () => {
    expect(pf2eMultipleAttackPenalty(1, false)).toBe(0);
    expect(pf2eMultipleAttackPenalty(2, false)).toBe(-5);
    expect(pf2eMultipleAttackPenalty(3, false)).toBe(-10);
    expect(pf2eMultipleAttackPenalty(2, true)).toBe(-4);
    expect(pf2eMultipleAttackPenalty(3, true)).toBe(-8);
  });
  it('striking dice: 1/2/3/4', () => {
    expect(pf2eStrikingDice('none')).toBe(1);
    expect(pf2eStrikingDice('striking')).toBe(2);
    expect(pf2eStrikingDice('greater')).toBe(3);
    expect(pf2eStrikingDice('major')).toBe(4);
  });
  it('cross-product: a greater-striking Strike under enfeebled 2 rolls 3 dice at −2 Str', () => {
    // Two independent register-linked formulas compose on ONE Strike:
    // pf2e.L3.striking-runes (greater striking → 3 weapon dice) and
    // pf2e.L8.valued-conditions (enfeebled 2 → −2 status penalty to Str-based
    // damage). A STR 18 (+4) fighter under enfeebled 2 nets +2 flat per hit.
    const dice = pf2eStrikingDice('greater');
    const strStatusPenalty = getPf2eConditionStatusPenalty(
      [{ name: 'enfeebled', value: 2 }],
      'str'
    );
    const strMod = abilityMod(18);
    expect(dice).toBe(3);
    expect(strStatusPenalty).toBe(2);
    // Enfeebled is a Str-scoped status penalty: it hits the Str damage mod, not
    // the weapon dice count — the two effects stack without interfering.
    expect(strMod - strStatusPenalty).toBe(2);
    expect(getPf2eConditionStatusPenalty([{ name: 'enfeebled', value: 2 }], 'dex')).toBe(0);
  });
  it('bulk limits: encumbered at Str+5, max at Str+10', () => {
    expect(pf2eBulkLimits(3)).toEqual({ encumbered: 8, max: 13 });
  });
  it('auto-heighten rank = ceil(level / 2)', () => {
    expect(pf2eAutoHeightenRank(1)).toBe(1);
    expect(pf2eAutoHeightenRank(5)).toBe(3);
    expect(pf2eAutoHeightenRank(20)).toBe(10);
  });
});

describe('Daggerheart weapon damage dice', () => {
  it('rolls a number of dice equal to proficiency', () => {
    expect(daggerheartDamageDiceCount(1)).toBe(1);
    expect(daggerheartDamageDiceCount(4)).toBe(4);
  });
});
