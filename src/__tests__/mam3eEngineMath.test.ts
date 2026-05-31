/**
 * Engine-math verification for Mutants & Masterminds 3e.
 *
 * Centers on the SYSTEM-DEFINING math that was previously untested: the
 * Power-Level cap trade-offs (Dodge+Toughness, Parry+Toughness, Fortitude+Will,
 * Attack+Effect ≤ 2×PL) and point-buy budget conservation. Pins
 * docs/compute-register/mam3e.ts.
 */
import { Mam3eEngine } from '../systems/mam3e/engine';
import {
  calculatePowerPointCost,
  getPowerRank,
  sumMam3ePointsSpent,
  mam3ePointsRemaining,
  mam3eMeasurementByRank,
} from '../systems/mam3e/powerMath';
import {
  mam3eDegreesOfSuccess,
  mam3eDegreesOfFailure,
  mam3eAttackDC,
  mam3eAttackHits,
  mam3eDamageResistanceDC,
  mam3eInitiative,
  mam3eStartingPowerPoints,
  mam3eAfflictionDC,
  mam3eEquipmentPoints,
  mam3eHeroPoints,
  mam3eCriticalDC,
} from '../systems/mam3e/derivedMath';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { Power } from '../types/mam/powers';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');
const engine = new Mam3eEngine();
const power = (p: Partial<Power>): Power => p as Power;

function doc(over: Partial<Mam3eDataModel>): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-engine-math',
    name: 'M&M Character',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

// ── L9: power-point budget conservation ─────────────────────────────────────
describe('L9 point-buy costs', () => {
  it('abilities cost 2 PP per rank', () => {
    const out = engine.prepareData(
      doc({ abilities: { str: 4, sta: 2, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 } })
    );
    expect(out.system.powerPoints.spent.abilities).toBe((4 + 2) * 2);
  });
  it('each purchased defense rank costs 1 PP', () => {
    const out = engine.prepareData(
      doc({
        defenses: {
          dodge: { rank: 2, total: 0 },
          parry: { rank: 1, total: 0 },
          fortitude: { rank: 0, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 3, total: 0 },
        },
      })
    );
    expect(out.system.powerPoints.spent.defenses).toBe(6);
  });
  it('skills cost 1 PP per 2 ranks (rounded up)', () => {
    const out = engine.prepareData(
      doc({ skills: { acrobatics: { rank: 3, total: 0 }, athletics: { rank: 2, total: 0 } } })
    );
    expect(out.system.powerPoints.spent.skills).toBe(3); // ceil(5/2)
  });
  it('advantages cost their rank (min 1)', () => {
    const out = engine.prepareData(
      doc({
        advantages: [
          { id: 'ranged-attack', name: 'Ranged Attack', rank: 3 },
          { id: 'luck', name: 'Luck' },
        ],
      })
    );
    expect(out.system.powerPoints.spent.advantages).toBe(4); // 3 + 1
  });
  it('powers cost is the sum of per-power costs', () => {
    const out = engine.prepareData(
      doc({ powers: [power({ id: 'blast', perRank: true, rank: 5, baseCost: 2 })] })
    );
    expect(out.system.powerPoints.spent.powers).toBe(10);
  });
});

// ── L9: power cost formula ──────────────────────────────────────────────────
describe('L9 calculatePowerPointCost', () => {
  it('per-rank power = baseCost × rank', () => {
    expect(calculatePowerPointCost(power({ perRank: true, rank: 5, baseCost: 2 }))).toBe(10);
  });
  it('non-per-rank power is charged at rank 1', () => {
    expect(getPowerRank(power({ perRank: false, rank: 5 }))).toBe(1);
    expect(calculatePowerPointCost(power({ perRank: false, baseCost: 3 }))).toBe(3);
  });
  it('rank floors at 1 for per-rank powers', () => {
    expect(getPowerRank(power({ perRank: true, rank: 0 }))).toBe(1);
  });
});

// ── L9: PP budget accounting (PP = PL × 15) ─────────────────────────────────
describe('L9 PP budget accounting', () => {
  it('sums spent across categories and computes remaining', () => {
    const spent = { abilities: 30, powers: 20, advantages: 4, skills: 3, defenses: 6 };
    expect(sumMam3ePointsSpent(spent)).toBe(63);
    expect(mam3ePointsRemaining(150, spent)).toBe(87);
  });
  it('a fully-spent PL10 build (150 PP) has 0 remaining', () => {
    const spent = { abilities: 100, powers: 30, advantages: 5, skills: 5, defenses: 10 };
    expect(mam3ePointsRemaining(150, spent)).toBe(0);
  });
});

// ── L10: measurements doubling track ────────────────────────────────────────
describe('L10 M&M measurements doubling track', () => {
  it('each rank doubles the measure from its anchor', () => {
    expect(mam3eMeasurementByRank(30, 0)).toBe(30);
    expect(mam3eMeasurementByRank(30, 1)).toBe(60);
    expect(mam3eMeasurementByRank(30, 4)).toBe(480);
  });
  it('satisfies the doubling property f(r+1) = 2 * f(r)', () => {
    for (let r = 0; r < 6; r++) {
      expect(mam3eMeasurementByRank(100, r + 1)).toBe(mam3eMeasurementByRank(100, r) * 2);
    }
  });
});

// ── L2: defense totals = ability + rank (+ power bonuses) ────────────────────
describe('L2 defense totals', () => {
  it('dodge = Agility + purchased rank', () => {
    const out = engine.prepareData(
      doc({
        abilities: { str: 0, sta: 0, agi: 4, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        defenses: {
          dodge: { rank: 2, total: 0 },
          parry: { rank: 0, total: 0 },
          fortitude: { rank: 0, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 0, total: 0 },
        },
      })
    );
    expect(out.system.defenses.dodge.total).toBe(6);
  });
  it('Protection power adds its rank to Toughness', () => {
    const out = engine.prepareData(
      doc({
        abilities: { str: 0, sta: 3, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        powers: [power({ id: 'protection', perRank: true, rank: 5, baseCost: 1 })],
      })
    );
    expect(out.system.defenses.toughness.total).toBe(3 + 5); // Sta 3 + Protection 5
  });
});

// ── L4: skill totals = ability + rank ───────────────────────────────────────
describe('L4 skill totals', () => {
  it('skill total = governing ability + purchased rank', () => {
    const out = engine.prepareData(
      doc({
        abilities: { str: 0, sta: 0, agi: 4, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        skills: { acrobatics: { rank: 3, total: 0 } }, // acrobatics → Agility
      })
    );
    expect(out.system.skills.acrobatics.total).toBe(7);
  });
});

// ── L9: Power-Level cap trade-offs (the defining M&M math) ───────────────────
describe('L9 Power-Level caps (PL10 → limit 20)', () => {
  const balanced = (): Partial<Mam3eDataModel> => ({
    powerLevel: 10,
    abilities: { str: 0, sta: 10, agi: 10, dex: 0, fgt: 10, int: 0, awe: 10, pre: 0 },
  });

  it('a build exactly at 2×PL has no violations', () => {
    const out = engine.prepareData(doc(balanced()));
    // dodge+tough=20, parry+tough=20, fort+will=20 — all ≤ 20
    expect(out.system.plViolations).toEqual([]);
  });

  it('Dodge + Toughness over 2×PL is flagged', () => {
    const out = engine.prepareData(
      doc({
        ...balanced(),
        defenses: {
          dodge: { rank: 1, total: 0 },
          parry: { rank: 0, total: 0 },
          fortitude: { rank: 0, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 0, total: 0 },
        },
      })
    );
    expect(out.system.plViolations).toContainEqual({
      label: 'Dodge + Toughness',
      value: 21,
      limit: 20,
    });
  });

  it('Fortitude + Will over 2×PL is flagged', () => {
    const out = engine.prepareData(
      doc({
        ...balanced(),
        defenses: {
          dodge: { rank: 0, total: 0 },
          parry: { rank: 0, total: 0 },
          fortitude: { rank: 1, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 0, total: 0 },
        },
      })
    );
    expect(out.system.plViolations).toContainEqual({
      label: 'Fortitude + Will',
      value: 21,
      limit: 20,
    });
  });

  it('Attack bonus + effect rank over 2×PL is flagged', () => {
    const out = engine.prepareData(
      doc({
        powerLevel: 10,
        abilities: { str: 0, sta: 0, agi: 0, dex: 0, fgt: 10, int: 0, awe: 0, pre: 0 },
        powers: [
          power({
            id: 'strike',
            type: 'attack',
            range: 'close',
            perRank: true,
            rank: 12,
            baseCost: 1,
          }),
        ],
      })
    );
    // close attack bonus (Fgt 10) + effect 12 = 22 > 20
    expect(out.system.plViolations).toContainEqual({
      label: 'Close Attack + Effect',
      value: 22,
      limit: 20,
    });
  });
});

// ── L8: Toughness failure condition track ───────────────────────────────────
describe('L8 toughness failure track', () => {
  it('margin 1-4 → bruised', () => {
    const out = engine.applyDamage(doc({}), 3, 'damage');
    expect(out.system.conditionTrack.bruised).toBe(1);
    expect(out.system.conditionTrack.dazed).toBe(false);
  });
  it('margin 5-9 → bruised + dazed', () => {
    const out = engine.applyDamage(doc({}), 7, 'damage');
    expect(out.system.conditionTrack.bruised).toBe(1);
    expect(out.system.conditionTrack.dazed).toBe(true);
  });
  it('margin 10-14 → bruised + staggered', () => {
    const out = engine.applyDamage(doc({}), 12, 'damage');
    expect(out.system.conditionTrack.staggered).toBe(true);
  });
  it('margin 15+ → incapacitated', () => {
    const out = engine.applyDamage(doc({}), 15, 'damage');
    expect(out.system.conditionTrack.incapacitated).toBe(true);
  });
});

// ── The Basics: universal degrees of success / failure ──────────────────────
describe('M&M degrees of success and failure', () => {
  it('success gains a degree for every full 5 over the DC', () => {
    expect(mam3eDegreesOfSuccess(15, 15)).toBe(1); // exact
    expect(mam3eDegreesOfSuccess(19, 15)).toBe(1); // +4
    expect(mam3eDegreesOfSuccess(20, 15)).toBe(2); // +5
    expect(mam3eDegreesOfSuccess(25, 15)).toBe(3); // +10
  });
  it('failure loses a degree for every full 5 under the DC', () => {
    expect(mam3eDegreesOfSuccess(14, 15)).toBe(-1); // short 1
    expect(mam3eDegreesOfSuccess(11, 15)).toBe(-1); // short 4
    expect(mam3eDegreesOfSuccess(10, 15)).toBe(-2); // short 5
    expect(mam3eDegreesOfSuccess(0, 15)).toBe(-4); // short 15
  });
  it('failure margin maps to the same 1-4 degree bands the Toughness track uses', () => {
    expect(mam3eDegreesOfFailure(0)).toBe(0); // success
    expect(mam3eDegreesOfFailure(4)).toBe(1); // bruised
    expect(mam3eDegreesOfFailure(5)).toBe(2); // +dazed
    expect(mam3eDegreesOfFailure(10)).toBe(3); // +staggered
    expect(mam3eDegreesOfFailure(15)).toBe(4); // incapacitated
  });
});

// ── L3: attack checks and Damage resistance DCs ─────────────────────────────
describe('L3 attack and resistance DCs', () => {
  it('attack DC is 10 + the active defense', () => {
    expect(mam3eAttackDC(8)).toBe(18);
    expect(mam3eAttackHits(18, 8)).toBe(true); // meets DC
    expect(mam3eAttackHits(17, 8)).toBe(false); // misses by 1
  });
  it('Damage resistance DC is 15 + the damage rank', () => {
    expect(mam3eDamageResistanceDC(0)).toBe(15);
    expect(mam3eDamageResistanceDC(10)).toBe(25);
  });
  it('Affliction (and the general effect) DC is 10 + the rank', () => {
    expect(mam3eAfflictionDC(0)).toBe(10);
    expect(mam3eAfflictionDC(8)).toBe(18);
  });
  it('a critical hit raises the resistance DC by 5', () => {
    expect(mam3eCriticalDC(mam3eDamageResistanceDC(10))).toBe(30); // (15+10) + 5
    expect(mam3eCriticalDC(mam3eAfflictionDC(8))).toBe(23); // (10+8) + 5
  });
  it('resistance shortfall feeds the degrees-of-failure band', () => {
    // Damage rank 10 → DC 25; a Toughness total of 12 fails by 13 → 3 degrees.
    const dc = mam3eDamageResistanceDC(10);
    expect(mam3eDegreesOfFailure(dc - 12)).toBe(3);
  });
});

// ── L1: initiative / L7: starting power-point budget ────────────────────────
describe('L1 initiative and L7 starting power points', () => {
  it('initiative is Agility plus +4 per Improved Initiative rank', () => {
    expect(mam3eInitiative(3)).toBe(3);
    expect(mam3eInitiative(3, 1)).toBe(7);
    expect(mam3eInitiative(3, 2)).toBe(11);
  });
  it('starting power points are 15 × the power level', () => {
    expect(mam3eStartingPowerPoints(10)).toBe(150);
    expect(mam3eStartingPowerPoints(8)).toBe(120);
  });
});

// ── L10/L7: equipment points and hero points ────────────────────────────────
describe('L10 M&M equipment and hero points', () => {
  it('the Equipment advantage grants 5 EP per rank', () => {
    expect(mam3eEquipmentPoints(1)).toBe(5);
    expect(mam3eEquipmentPoints(4)).toBe(20);
  });
  it('hero points start at 1 per session, +1 per activated complication', () => {
    expect(mam3eHeroPoints()).toBe(1);
    expect(mam3eHeroPoints(2)).toBe(3);
  });
});

// ── L9: remaining Power-Level caps ──────────────────────────────────────────
describe('L9 Power-Level caps (parry/ranged/perception)', () => {
  it('Parry + Toughness over 2×PL is flagged', () => {
    const out = engine.prepareData(
      doc({
        powerLevel: 10,
        abilities: { str: 0, sta: 10, agi: 0, dex: 0, fgt: 10, int: 0, awe: 0, pre: 0 },
        defenses: {
          dodge: { rank: 0, total: 0 },
          parry: { rank: 1, total: 0 },
          fortitude: { rank: 0, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 0, total: 0 },
        },
      })
    );
    expect(out.system.plViolations).toContainEqual({
      label: 'Parry + Toughness',
      value: 21,
      limit: 20,
    });
  });

  it('Ranged attack bonus + effect rank over 2×PL is flagged', () => {
    const out = engine.prepareData(
      doc({
        powerLevel: 10,
        abilities: { str: 0, sta: 0, agi: 0, dex: 10, fgt: 0, int: 0, awe: 0, pre: 0 },
        powers: [
          power({
            id: 'blast',
            type: 'attack',
            range: 'ranged',
            perRank: true,
            rank: 12,
            baseCost: 2,
          }),
        ],
      })
    );
    expect(out.system.plViolations).toContainEqual({
      label: 'Ranged Attack + Effect',
      value: 22,
      limit: 20,
    });
  });

  it('Perception-ranged effect rank over PL is flagged', () => {
    const out = engine.prepareData(
      doc({
        powerLevel: 10,
        abilities: { str: 0, sta: 0, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        powers: [
          power({
            id: 'mind-blast',
            type: 'attack',
            range: 'perception',
            perRank: true,
            rank: 12,
            baseCost: 2,
          }),
        ],
      })
    );
    expect(out.system.plViolations).toContainEqual({
      label: 'Perception Effect Rank',
      value: 12,
      limit: 10,
    });
  });
});
