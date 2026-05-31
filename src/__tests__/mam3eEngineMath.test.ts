/**
 * Engine-math verification for Mutants & Masterminds 3e.
 *
 * Centers on the SYSTEM-DEFINING math that was previously untested: the
 * Power-Level cap trade-offs (Dodge+Toughness, Parry+Toughness, Fortitude+Will,
 * Attack+Effect ≤ 2×PL) and point-buy budget conservation. Pins
 * docs/compute-register/mam3e.ts.
 */
import { Mam3eEngine } from '../systems/mam3e/engine';
import { calculatePowerPointCost, getPowerRank } from '../systems/mam3e/powerMath';
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
        powers: [power({ id: 'strike', type: 'attack', range: 'close', perRank: true, rank: 12, baseCost: 1 })],
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
        powers: [power({ id: 'blast', type: 'attack', range: 'ranged', perRank: true, rank: 12, baseCost: 2 })],
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
          power({ id: 'mind-blast', type: 'attack', range: 'perception', perRank: true, rank: 12, baseCost: 2 }),
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
