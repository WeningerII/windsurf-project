/**
 * Engine-math verification for the d20-legacy systems (D&D 3.5e + Pathfinder 1e).
 *
 * These systems shared ZERO engine-math tests before this file. Covers the
 * shared foundation (BAB tracks, good/poor save progressions, touch/flat-footed
 * AC with size) plus each engine's defining quantities (3.5e grapple; PF1e
 * CMB/CMD and favored-class HP). Pins the compute registers
 * docs/compute-register/dnd-3.5e.ts and docs/compute-register/pf1e.ts.
 */
import { baseSave, classBAB } from '../systems/shared/d20-helpers';
import { computeD20LegacyAC } from '../utils/armorClass';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { Pf1eEngine } from '../systems/pf1e/engine';
import {
  createDefaultDnd35eData,
  type Dnd35eClassLevel,
  type Dnd35eDataModel,
} from '../systems/dnd35e/data-model';
import {
  createDefaultPf1eData,
  type Pf1eClassLevel,
  type Pf1eDataModel,
} from '../systems/pf1e/data-model';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

// ── L1: shared save-progression and BAB-track helpers ───────────────────────
describe('L1 d20 base save progressions', () => {
  it.each([
    [1, 2],
    [2, 3],
    [4, 4],
    [20, 12],
  ])('good save at level %i = %i (2 + floor(level/2))', (level, expected) => {
    expect(baseSave(level, 'good')).toBe(expected);
  });
  it.each([
    [1, 0],
    [3, 1],
    [6, 2],
    [20, 6],
  ])('poor save at level %i = %i (floor(level/3))', (level, expected) => {
    expect(baseSave(level, 'poor')).toBe(expected);
  });
});

describe('L1/L3 BAB progression tracks', () => {
  it('full BAB = level', () => {
    expect(classBAB(1, 'full')).toBe(1);
    expect(classBAB(20, 'full')).toBe(20);
  });
  it('three-quarter BAB = floor(level * 3/4)', () => {
    expect(classBAB(1, 'three-quarter')).toBe(0);
    expect(classBAB(4, 'three-quarter')).toBe(3);
    expect(classBAB(20, 'three-quarter')).toBe(15);
  });
  it('half BAB = floor(level / 2)', () => {
    expect(classBAB(1, 'half')).toBe(0);
    expect(classBAB(4, 'half')).toBe(2);
    expect(classBAB(20, 'half')).toBe(10);
  });
});

// ── L2: 3.5e/PF1e AC — total, touch, flat-footed, size, Dex cap ──────────────
describe('L2 d20-legacy AC (touch / flat-footed / size)', () => {
  it('unarmored medium: total=touch=10+Dex, flat-footed drops Dex', () => {
    expect(computeD20LegacyAC(14, 'medium', [])).toEqual({ total: 12, touch: 12, flatFooted: 10 });
  });
  it('armor adds to total + flat-footed but not touch', () => {
    const ac = computeD20LegacyAC(16, 'medium', [
      { equipped: true, armorClass: 5, dexBonusMax: 3 },
    ]);
    expect(ac).toEqual({ total: 18, touch: 13, flatFooted: 15 });
  });
  it('armor max-Dex cap limits the Dex contribution', () => {
    const ac = computeD20LegacyAC(16, 'medium', [
      { equipped: true, armorClass: 8, dexBonusMax: 1 },
    ]);
    expect(ac).toEqual({ total: 19, touch: 13, flatFooted: 18 });
  });
  it('small size adds +1 to all AC values', () => {
    expect(computeD20LegacyAC(12, 'small', [])).toEqual({ total: 12, touch: 12, flatFooted: 11 });
  });
  it('large size subtracts 1 from all AC values', () => {
    expect(computeD20LegacyAC(10, 'large', [])).toEqual({ total: 9, touch: 9, flatFooted: 9 });
  });
  it('a raised shield adds to total + flat-footed but not touch', () => {
    expect(computeD20LegacyAC(10, 'medium', [{ equipped: true, shieldBonus: 2 }])).toEqual({
      total: 12,
      touch: 10,
      flatFooted: 12,
    });
  });
});

// ── D&D 3.5e engine ─────────────────────────────────────────────────────────
const dnd35Engine = new Dnd35eEngine();

function cl35(over: Partial<Dnd35eClassLevel>): Dnd35eClassLevel {
  return {
    classId: 'fighter',
    level: 1,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
    ...over,
  };
}

function doc35(over: Partial<Dnd35eDataModel>): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'dnd35e-engine-math',
    name: '3.5e Character',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('L3 D&D 3.5e BAB, saves, HP, grapple', () => {
  const scores = { str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 10 };

  it('BAB sums class tracks across multiclass', () => {
    const single = dnd35Engine.prepareData(
      doc35({ baseAttributes: scores, classLevels: [cl35({ level: 5, bab: 'full' })] })
    );
    expect(single.system.baseAttackBonus).toBe(5);
    const multi = dnd35Engine.prepareData(
      doc35({
        baseAttributes: scores,
        classLevels: [
          cl35({ level: 5, bab: 'full' }),
          cl35({ classId: 'wizard', level: 4, bab: 'half' }),
        ],
      })
    );
    expect(multi.system.baseAttackBonus).toBe(7); // 5 + floor(4/2)
  });

  it('saves = base progression + ability mod', () => {
    const out = dnd35Engine.prepareData(
      doc35({
        baseAttributes: scores,
        classLevels: [cl35({ level: 5, fortSave: 'good', refSave: 'poor', willSave: 'poor' })],
      })
    );
    expect(out.system.saves.fortitude.total).toBe(4 + 2); // good@5=4, Con +2
    expect(out.system.saves.reflex.total).toBe(1 + 1); // poor@5=1, Dex +1
    expect(out.system.saves.will.total).toBe(1 + 0); // poor@5=1, Wis +0
  });

  it('max HP = sum(max(1, roll + Con)) ', () => {
    const out = dnd35Engine.prepareData(
      doc35({ baseAttributes: scores, classLevels: [cl35({ level: 1, hitDieRolls: [10] })] })
    );
    expect(out.system.hitPoints.max).toBe(12); // 10 + Con 2
  });

  it('grapple = BAB + Str mod + grapple size modifier', () => {
    const medium = dnd35Engine.prepareData(
      doc35({ baseAttributes: scores, classLevels: [cl35({ level: 5, bab: 'full' })] })
    );
    expect(medium.system.grapple).toBe(5 + 3 + 0); // BAB5, Str+3, medium 0
    const large = dnd35Engine.prepareData(
      doc35({
        baseAttributes: scores,
        sizeCategory: 'large',
        classLevels: [cl35({ level: 5, bab: 'full' })],
      })
    );
    expect(large.system.grapple).toBe(5 + 3 + 4); // large grapple mod +4
  });
});

// ── Pathfinder 1e engine ────────────────────────────────────────────────────
const pf1Engine = new Pf1eEngine();

function clPF(over: Partial<Pf1eClassLevel>): Pf1eClassLevel {
  return {
    classId: 'fighter',
    level: 1,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
    favoredClassBonus: 'other',
    ...over,
  };
}

function docPF(over: Partial<Pf1eDataModel>): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'pf1e-engine-math',
    name: 'PF1e Character',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('L3 Pathfinder 1e CMB / CMD and favored-class HP', () => {
  const scores = { str: 16, dex: 14, con: 14, int: 10, wis: 10, cha: 10 };

  it('CMB = BAB + Str mod + special size modifier', () => {
    const medium = pf1Engine.prepareData(
      docPF({ baseAttributes: scores, classLevels: [clPF({ level: 5, bab: 'full' })] })
    );
    expect(medium.system.cmb).toBe(5 + 3 + 0);
    const large = pf1Engine.prepareData(
      docPF({
        baseAttributes: scores,
        sizeCategory: 'large',
        classLevels: [clPF({ level: 5, bab: 'full' })],
      })
    );
    expect(large.system.cmb).toBe(5 + 3 + 1); // PF1e large CMB mod +1
  });

  it('CMD = 10 + BAB + Str mod + Dex mod + special size modifier', () => {
    const out = pf1Engine.prepareData(
      docPF({ baseAttributes: scores, classLevels: [clPF({ level: 5, bab: 'full' })] })
    );
    expect(out.system.cmd).toBe(10 + 5 + 3 + 2 + 0);
  });

  it('favored-class HP bonus adds +1 HP per level taken in that class', () => {
    const out = pf1Engine.prepareData(
      docPF({
        baseAttributes: scores,
        classLevels: [clPF({ level: 1, hitDieRolls: [10], favoredClassBonus: 'hp' })],
      })
    );
    expect(out.system.hitPoints.max).toBe(12 + 1); // (10 + Con 2) + favored HP 1
  });

  it('favored-class skill choice tracks skill points instead of HP', () => {
    const out = pf1Engine.prepareData(
      docPF({
        baseAttributes: scores,
        classLevels: [clPF({ level: 3, hitDieRolls: [10, 6, 6], favoredClassBonus: 'skill' })],
      })
    );
    expect(out.system.favoredClassSkillBonus).toBe(3);
  });
});

// ── 3.5e check resolution: initiative, attack, skill ────────────────────────
describe('L3/L4 D&D 3.5e check resolution', () => {
  it('initiative = Dex mod', () => {
    const out = dnd35Engine.prepareData(
      doc35({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        classLevels: [cl35({ level: 1 })],
      })
    );
    expect(out.system.initiative).toBe(2);
  });
  it('attack roll modifier = BAB + Str mod', async () => {
    const prepared = dnd35Engine.prepareData(
      doc35({
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        classLevels: [cl35({ level: 5, bab: 'full' })],
      })
    );
    const r = await dnd35Engine.rollCheck(prepared, 'attack');
    expect(r.formula).toBe('1d20 + 8'); // BAB 5 + Str +3
  });
  it('skill check modifier = ability mod + ranks', async () => {
    const prepared = dnd35Engine.prepareData(
      doc35({
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skillRanks: { climb: 5 },
        classLevels: [cl35({ level: 1 })],
      })
    );
    const r = await dnd35Engine.rollCheck(prepared, 'climb'); // climb → Str
    expect(r.formula).toBe('1d20 + 8'); // Str +3 + 5 ranks
  });
});

// ── PF1e check resolution: initiative, saves, class-skill, attack ───────────
describe('L2/L4 Pathfinder 1e check resolution', () => {
  it('initiative = Dex mod', () => {
    const out = pf1Engine.prepareData(
      docPF({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        classLevels: [clPF({ level: 1 })],
      })
    );
    expect(out.system.initiative).toBe(2);
  });
  it('save check surfaces the computed save total', async () => {
    const prepared = pf1Engine.prepareData(
      docPF({
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [clPF({ level: 5, fortSave: 'good' })],
      })
    );
    const r = await pf1Engine.rollCheck(prepared, 'save-fort');
    expect(r.formula).toBe('1d20 + 6'); // good@5 = 4 + Con +2
  });
  it('class skill grants +3 when trained (1+ rank)', async () => {
    const prepared = pf1Engine.prepareData(
      docPF({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skillRanks: { climb: 2 },
        classSkills: ['climb'],
        classLevels: [clPF({ level: 1 })],
      })
    );
    const r = await pf1Engine.rollCheck(prepared, 'climb');
    expect(r.formula).toBe('1d20 + 7'); // Str +2 + 2 ranks + 3 class skill
  });
  it('untrained class skill gets no +3 bonus', async () => {
    const prepared = pf1Engine.prepareData(
      docPF({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skillRanks: { climb: 0 },
        classSkills: ['climb'],
        classLevels: [clPF({ level: 1 })],
      })
    );
    const r = await pf1Engine.rollCheck(prepared, 'climb');
    expect(r.formula).toBe('1d20 + 2'); // Str +2 only (no ranks → no +3)
  });
  it('attack roll modifier = BAB + Str mod', async () => {
    const prepared = pf1Engine.prepareData(
      docPF({
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        classLevels: [clPF({ level: 5, bab: 'full' })],
      })
    );
    const r = await pf1Engine.rollCheck(prepared, 'attack');
    expect(r.formula).toBe('1d20 + 8'); // BAB 5 + Str +3
  });
});
