/**
 * Engine-math verification for the d20-legacy systems (D&D 3.5e + Pathfinder 1e).
 *
 * These systems shared ZERO engine-math tests before this file. Covers the
 * shared foundation (BAB tracks, good/poor save progressions, touch/flat-footed
 * AC with size) plus each engine's defining quantities (3.5e grapple; PF1e
 * CMB/CMD and favored-class HP). Pins the compute registers
 * docs/compute-register/dnd-3.5e.ts and docs/compute-register/pf1e.ts.
 */
import {
  baseSave,
  classBAB,
  d20HeavyLoad,
  d20CarryingCapacity,
  d20LoadCategory,
  d20EncumbrancePenalties,
  d20LiftDragLimits,
} from '../systems/shared/d20-helpers';
import {
  dnd35eXpForLevel,
  dnd35eTriggersMassiveDamage,
  dnd35eHpState,
} from '../systems/dnd35e/derivedMath';
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
import { buildD20LegacySpellSlotTotals } from '../utils/d20LegacySpellcasting';
import type { CharacterClass } from '../types/character-options/classes';

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

// ── L8: d20-legacy damage application ───────────────────────────────────────
describe('L8 d20-legacy damage application', () => {
  it('3.5e: temp HP absorbs first, current floors at 0', () => {
    const out = dnd35Engine.applyDamage(
      doc35({ hitPoints: { current: 8, max: 8, temp: 3 } }),
      5,
      'slashing'
    );
    expect(out.system.hitPoints.temp).toBe(0);
    expect(out.system.hitPoints.current).toBe(6);
  });
  it('PF1e: temp HP absorbs first, current floors at 0', () => {
    const out = pf1Engine.applyDamage(
      docPF({ hitPoints: { current: 8, max: 8, temp: 3 } }),
      5,
      'slashing'
    );
    expect(out.system.hitPoints.temp).toBe(0);
    expect(out.system.hitPoints.current).toBe(6);
  });
  it('PF1e: overkill floors current HP at 0', () => {
    const out = pf1Engine.applyDamage(
      docPF({ hitPoints: { current: 5, max: 8, temp: 0 } }),
      10,
      'fire'
    );
    expect(out.system.hitPoints.current).toBe(0);
  });
});

// ── L5: Vancian spell-slot totals (class table → per-level totals) ──────────
describe('L5 d20 Vancian spell-slot totals', () => {
  const caster = (id: string, spellSlots: Record<number, number[]>): CharacterClass =>
    ({ id, name: id, spellcasting: { spellSlots } }) as unknown as CharacterClass;

  it('reads the class slot table at the character level', () => {
    const map = new Map([['wiz', caster('wiz', { 1: [2, 3], 2: [0, 1] })]]);
    expect(buildD20LegacySpellSlotTotals('dnd-3.5e', [{ classId: 'wiz', level: 1 }], map)).toEqual({
      1: 2,
      2: 0,
    });
    expect(buildD20LegacySpellSlotTotals('dnd-3.5e', [{ classId: 'wiz', level: 2 }], map)).toEqual({
      1: 3,
      2: 1,
    });
  });

  it('sums slot totals across multiclass casters', () => {
    const map = new Map([
      ['a', caster('a', { 1: [2] })],
      ['b', caster('b', { 1: [2] })],
    ]);
    expect(
      buildD20LegacySpellSlotTotals(
        'pf1e',
        [
          { classId: 'a', level: 1 },
          { classId: 'b', level: 1 },
        ],
        map
      )
    ).toEqual({ 1: 4 });
  });

  it('returns no slots for a non-casting class', () => {
    const map = new Map([
      ['noncaster-xyz', { id: 'noncaster-xyz', name: 'Noncaster' } as unknown as CharacterClass],
    ]);
    expect(
      buildD20LegacySpellSlotTotals('dnd-3.5e', [{ classId: 'noncaster-xyz', level: 5 }], map)
    ).toEqual({});
  });
});

// ── L6: carrying capacity & encumbrance (shared SRD 3.5 / PF1e CRB) ──────────
describe('L6 d20-legacy carrying capacity', () => {
  it('matches the published heavy-load table for Strength 1-19', () => {
    const table = [
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 115, 130, 150, 175, 200, 230, 260, 300, 350,
    ];
    table.forEach((expected, str) => expect(d20HeavyLoad(str)).toBe(expected));
  });
  it('quadruples per +10 Strength above the table (Str 20 = Str 10 x4)', () => {
    expect(d20HeavyLoad(20)).toBe(400); // 100 x4
    expect(d20HeavyLoad(25)).toBe(800); // 200 x4
    expect(d20HeavyLoad(29)).toBe(1400); // 350 x4
    expect(d20HeavyLoad(30)).toBe(1600); // 400 x4
  });
  it('Strength 0 (helpless) carries nothing', () => {
    expect(d20HeavyLoad(0)).toBe(0);
  });
  it('splits light/medium/heavy at 1/3 and 2/3 of the maximum', () => {
    // Str 15 → heavy 200: light ≤66, medium ≤133, heavy ≤200
    expect(d20CarryingCapacity(15)).toEqual({ light: 66, medium: 133, heavy: 200 });
    // Str 10 → heavy 100: light ≤33, medium ≤66
    expect(d20CarryingCapacity(10)).toEqual({ light: 33, medium: 66, heavy: 100 });
  });
  it('categorizes a carried weight by the thresholds', () => {
    expect(d20LoadCategory(15, 60)).toBe('light'); // ≤66
    expect(d20LoadCategory(15, 100)).toBe('medium'); // 67-133
    expect(d20LoadCategory(15, 180)).toBe('heavy'); // 134-200
    expect(d20LoadCategory(15, 250)).toBe('heavy'); // beyond max still 'heavy'
  });
  it('applies the load-based max Dex / check penalty / run multiplier', () => {
    expect(d20EncumbrancePenalties('light')).toEqual({
      maxDex: null,
      checkPenalty: 0,
      runMultiplier: 4,
    });
    expect(d20EncumbrancePenalties('medium')).toEqual({
      maxDex: 3,
      checkPenalty: -3,
      runMultiplier: 4,
    });
    expect(d20EncumbrancePenalties('heavy')).toEqual({
      maxDex: 1,
      checkPenalty: -6,
      runMultiplier: 3,
    });
  });
  it('derives lift/drag limits as x1 / x2 / x5 of the maximum load', () => {
    // Str 15 → max 200
    expect(d20LiftDragLimits(15)).toEqual({ overHead: 200, offGround: 400, pushDrag: 1000 });
  });
});

// ── L1/L8: D&D 3.5e XP table, massive damage, and the HP-state track ─────────
describe('L1 D&D 3.5e XP-to-level table', () => {
  it('matches the published Character Advancement thresholds', () => {
    expect(dnd35eXpForLevel(1)).toBe(0);
    expect(dnd35eXpForLevel(2)).toBe(1000);
    expect(dnd35eXpForLevel(3)).toBe(3000);
    expect(dnd35eXpForLevel(5)).toBe(10000);
    expect(dnd35eXpForLevel(8)).toBe(28000);
    expect(dnd35eXpForLevel(20)).toBe(190000);
  });
});

describe('L8 D&D 3.5e massive damage and HP state', () => {
  it('a single hit of 50+ triggers the massive-damage save', () => {
    expect(dnd35eTriggersMassiveDamage(49)).toBe(false);
    expect(dnd35eTriggersMassiveDamage(50)).toBe(true);
  });
  it('classifies the disabled / dying / dead HP track', () => {
    expect(dnd35eHpState(5)).toBe('healthy');
    expect(dnd35eHpState(0)).toBe('disabled');
    expect(dnd35eHpState(-1)).toBe('dying');
    expect(dnd35eHpState(-9)).toBe('dying');
    expect(dnd35eHpState(-10)).toBe('dead');
    expect(dnd35eHpState(-15)).toBe('dead');
  });
});
