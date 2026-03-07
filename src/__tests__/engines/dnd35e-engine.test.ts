import { describe, it, expect } from 'vitest';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Dnd35eDataModel } from '../../systems/dnd35e/data-model';

function makeDoc(overrides: Partial<Dnd35eDataModel> = {}): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'test-35e',
    name: 'Test Fighter',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Dnd35eEngine', () => {
  const engine = new Dnd35eEngine();

  describe('prepareData', () => {
    it('calculates BAB from full progression class', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'fighter',
            level: 5,
            hitDieRolls: [10, 8, 7, 6, 9],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
            skillPointsPerLevel: 2,
          },
        ],
      });
      const result = engine.prepareData(doc);
      expect(result.system.baseAttackBonus).toBe(5);
    });

    it('calculates BAB from half progression class', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'wizard',
            level: 6,
            hitDieRolls: [4, 3, 4, 2, 3, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
          },
        ],
      });
      const result = engine.prepareData(doc);
      // floor(6/2) = 3
      expect(result.system.baseAttackBonus).toBe(3);
    });

    it('calculates good and poor saves correctly', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 12, cha: 10 },
        classLevels: [
          {
            classId: 'fighter',
            level: 4,
            hitDieRolls: [10, 8, 7, 6],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
            skillPointsPerLevel: 2,
          },
        ],
        saves: {
          fortitude: { base: 0, ability: 0, misc: 0, total: 0 },
          reflex: { base: 0, ability: 0, misc: 0, total: 0 },
          will: { base: 0, ability: 0, misc: 1, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Good save at level 4: 2 + floor(4/2) = 4
      // CON mod = +2
      expect(result.system.saves.fortitude.base).toBe(4);
      expect(result.system.saves.fortitude.total).toBe(6); // 4 + 2 + 0
      // Poor save at level 4: floor(4/3) = 1
      // DEX mod = 0
      expect(result.system.saves.reflex.base).toBe(1);
      expect(result.system.saves.reflex.total).toBe(1);
      // Poor will save, WIS mod = +1, misc = 1
      expect(result.system.saves.will.total).toBe(3); // 1 + 1 + 1
    });

    it('calculates HP from hit die rolls + CON mod', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 16, int: 10, wis: 10, cha: 10 },
        classLevels: [
          {
            classId: 'fighter',
            level: 3,
            hitDieRolls: [10, 7, 5],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
            skillPointsPerLevel: 2,
          },
        ],
        hitPoints: { current: 50, max: 50, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // CON mod = +3, rolls: 10+3=13, 7+3=10, 5+3=8 => 31
      expect(result.system.hitPoints.max).toBe(31);
    });

    it('calculates AC with size modifier', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        sizeCategory: 'small',
      });
      const result = engine.prepareData(doc);
      // 10 + DEX(2) + size(1) = 13
      expect(result.system.armorClass.total).toBe(13);
      expect(result.system.armorClass.touch).toBe(13);
      expect(result.system.armorClass.flatFooted).toBe(11); // 10 + size(1)
    });

    it('calculates grapple with size modifier', () => {
      const doc = makeDoc({
        baseAttributes: { str: 18, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        sizeCategory: 'large',
        classLevels: [
          {
            classId: 'fighter',
            level: 4,
            hitDieRolls: [10, 8, 7, 6],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
            skillPointsPerLevel: 2,
          },
        ],
      });
      const result = engine.prepareData(doc);
      // BAB(4) + STR(4) + size(4 for large) = 12
      expect(result.system.grapple).toBe(12);
    });

    it('auto-populates Vancian spell slots from class spell tables', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'wizard',
            level: 3,
            hitDieRolls: [4, 3, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
          },
        ],
        spellsPerDay: {
          1: { total: 99, used: 7 },
          2: { total: 99, used: 5 },
        },
      });
      const result = engine.prepareData(doc);
      // Wizard level 3: 1st=2, 2nd=1; used values clamp to totals.
      expect(result.system.spellsPerDay?.[1]).toEqual({ total: 2, used: 2 });
      expect(result.system.spellsPerDay?.[2]).toEqual({ total: 1, used: 1 });
    });
  });

  describe('rollCheck', () => {
    it('rolls a skill check with ranks', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        skillRanks: { 'move-silently': 5 },
      });
      const result = await engine.rollCheck(doc, 'move-silently');
      // DEX mod +3 + 5 ranks = 8
      expect(result.formula).toBe('1d20 + 8');
    });

    it('rolls a saving throw', async () => {
      const doc = makeDoc({
        saves: {
          fortitude: { base: 4, ability: 2, misc: 0, total: 6 },
          reflex: { base: 1, ability: 0, misc: 0, total: 1 },
          will: { base: 1, ability: 1, misc: 0, total: 2 },
        },
      });
      const result = await engine.rollCheck(doc, 'save-fort');
      expect(result.formula).toBe('1d20 + 6');
      expect(result.flavor).toBe('Fortitude Save');
    });
  });

  describe('applyDamage', () => {
    it('absorbs damage with temp HP first', () => {
      const doc = makeDoc({ hitPoints: { current: 20, max: 20, temp: 8 } });
      const result = engine.applyDamage(doc, 12, 'slashing');
      expect(result.system.hitPoints.temp).toBe(0);
      expect(result.system.hitPoints.current).toBe(16);
    });
  });
});
