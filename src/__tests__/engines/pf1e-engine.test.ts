import { describe, it, expect } from 'vitest';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Pf1eDataModel } from '../../systems/pf1e/data-model';

function makeDoc(overrides: Partial<Pf1eDataModel> = {}): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'test-pf1',
    name: 'Test Pathfinder',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Pf1eEngine', () => {
  const engine = new Pf1eEngine();

  describe('prepareData', () => {
    it('returns a new document reference from prepareData without mutating the original system', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'fighter',
            level: 1,
            hitDieRolls: [10],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
          },
        ],
        hitPoints: { current: 20, max: 20, temp: 0 },
      });
      const originalSystem = doc.system;
      const originalHitPoints = { ...doc.system.hitPoints };

      const result = engine.prepareData(doc);

      expect(result).not.toBe(doc);
      expect(result.system).not.toBe(originalSystem);
      expect(result.system.saves).not.toBe(originalSystem.saves);
      expect(result.system.hitPoints).not.toBe(originalSystem.hitPoints);
      expect(doc.system.baseAttackBonus).toBe(0);
      expect(doc.system.hitPoints).toEqual(originalHitPoints);
    });

    it('calculates CMB = BAB + STR + size', () => {
      const doc = makeDoc({
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        sizeCategory: 'medium',
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
            favoredClassBonus: 'hp',
          },
        ],
      });
      const result = engine.prepareData(doc);
      // BAB(4) + STR(3) + size(0) = 7
      expect(result.system.cmb).toBe(7);
    });

    it('calculates CMD = 10 + BAB + STR + DEX + size', () => {
      const doc = makeDoc({
        baseAttributes: { str: 14, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        sizeCategory: 'small',
        classLevels: [
          {
            classId: 'rogue',
            level: 3,
            hitDieRolls: [8, 5, 6],
            bab: 'three-quarter',
            fortSave: 'poor',
            refSave: 'good',
            willSave: 'poor',
            skillPointsPerLevel: 8,
            favoredClassBonus: 'skill',
          },
        ],
      });
      const result = engine.prepareData(doc);
      // BAB = floor(3*3/4) = 2, STR +2, DEX +3, size -1
      // CMD = 10 + 2 + 2 + 3 + (-1) = 16
      expect(result.system.cmd).toBe(16);
    });

    it('adds favored class HP bonus', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 12, int: 10, wis: 10, cha: 10 },
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
            favoredClassBonus: 'hp',
          },
        ],
        hitPoints: { current: 50, max: 50, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // CON mod +1, rolls: 10+1=11, 7+1=8, 5+1=6 = 25, + favored class 3 = 28
      expect(result.system.hitPoints.max).toBe(28);
    });

    it('calculates saves with good/poor progressions', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        classLevels: [
          {
            classId: 'rogue',
            level: 6,
            hitDieRolls: [8, 5, 6, 4, 7, 5],
            bab: 'three-quarter',
            fortSave: 'poor',
            refSave: 'good',
            willSave: 'poor',
            skillPointsPerLevel: 8,
            favoredClassBonus: 'skill',
          },
        ],
        saves: {
          fortitude: { base: 0, ability: 0, misc: 0, total: 0 },
          reflex: { base: 0, ability: 0, misc: 0, total: 0 },
          will: { base: 0, ability: 0, misc: 0, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Good reflex at level 6: 2 + floor(6/2) = 5, DEX mod +2
      expect(result.system.saves.reflex.total).toBe(7);
      // Poor fort at level 6: floor(6/3) = 2, CON mod 0
      expect(result.system.saves.fortitude.total).toBe(2);
    });

    it('tracks favored class skill bonus selections', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'rogue',
            level: 4,
            hitDieRolls: [8, 6, 6, 5],
            bab: 'three-quarter',
            fortSave: 'poor',
            refSave: 'good',
            willSave: 'poor',
            skillPointsPerLevel: 8,
            favoredClassBonus: 'skill',
          },
        ],
      });
      const result = engine.prepareData(doc);
      expect(result.system.favoredClassSkillBonus).toBe(4);
    });

    it('auto-populates PF1e Vancian spell slots from class tables', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'wizard',
            level: 3,
            hitDieRolls: [6, 4, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'skill',
          },
        ],
        spellsPerDay: {
          // Raw totals with no recorded manualBonus snap to the automated
          // baseline (manual edits persist via manualBonus; see
          // d20-legacy-vancian-prep.test.ts).
          1: { total: 99, used: 8 },
          2: { total: 99, used: 4 },
        },
      });
      const result = engine.prepareData(doc);
      expect(result.system.spellsPerDay?.[1]).toEqual({ total: 2, used: 2 });
      expect(result.system.spellsPerDay?.[2]).toEqual({ total: 1, used: 1 });
      // PF1e CRB Table 3-16: wizard 3 prepares 4 orisons (0th-level row).
      expect(result.system.spellsPerDay?.[0]).toEqual({ total: 4, used: 0 });
    });

    it('advances both PF1e mystic theurge spellcasting tracks through selected prior classes', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'wizard',
            level: 3,
            hitDieRolls: [6, 4, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
          },
          {
            classId: 'cleric',
            level: 3,
            hitDieRolls: [8, 5, 5],
            bab: 'three-quarter',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
          },
          {
            classId: 'mystic-theurge',
            level: 2,
            hitDieRolls: [6, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
            spellcastingSelections: ['wizard', 'cleric'],
          },
        ],
      });

      const result = engine.prepareData(doc);

      expect(result.system.spellsPerDay?.[1]).toEqual({ total: 6, used: 0 });
      expect(result.system.spellsPerDay?.[2]).toEqual({ total: 4, used: 0 });
      expect(result.system.spellsPerDay?.[3]).toEqual({ total: 2, used: 0 });
    });

    it('advances PF1e lore-master spell slots through its selected prior spellcasting class', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'wizard',
            level: 5,
            hitDieRolls: [6, 4, 4, 4, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
          },
          {
            classId: 'lore-master',
            level: 2,
            hitDieRolls: [6, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 4,
            favoredClassBonus: 'hp',
            spellcastingSelections: ['wizard'],
          },
        ],
      });

      const result = engine.prepareData(doc);

      expect(result.system.spellsPerDay?.[1]).toEqual({ total: 4, used: 0 });
      expect(result.system.spellsPerDay?.[2]).toEqual({ total: 3, used: 0 });
      expect(result.system.spellsPerDay?.[3]).toEqual({ total: 2, used: 0 });
      expect(result.system.spellsPerDay?.[4]).toEqual({ total: 1, used: 0 });
    });

    it('advances PF1e dragon disciple spell slots only from its selected spontaneous arcane class', () => {
      const doc = makeDoc({
        classLevels: [
          {
            classId: 'sorcerer',
            level: 5,
            hitDieRolls: [6, 4, 4, 4, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
          },
          {
            classId: 'dragon-disciple',
            level: 3,
            hitDieRolls: [12, 7, 7],
            bab: 'three-quarter',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
            spellcastingSelections: ['sorcerer'],
          },
        ],
      });

      const result = engine.prepareData(doc);

      expect(result.system.spellsPerDay?.[1]).toEqual({ total: 6, used: 0 });
      expect(result.system.spellsPerDay?.[2]).toEqual({ total: 6, used: 0 });
      expect(result.system.spellsPerDay?.[3]).toEqual({ total: 4, used: 0 });
      expect(result.system.spellsPerDay?.[4]).toEqual({ total: 0, used: 0 });
    });
  });

  describe('rollCheck', () => {
    it('adds class skill +3 bonus when trained', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 14, cha: 10 },
        skillRanks: { perception: 3 },
        classSkills: ['perception'],
      });
      const result = await engine.rollCheck(doc, 'perception');
      // WIS mod +2, ranks 3, class skill +3 = 8
      expect(result.formula).toBe('1d20 + 8');
    });

    it('does NOT add class skill bonus when untrained (0 ranks)', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 14, cha: 10 },
        skillRanks: {},
        classSkills: ['perception'],
      });
      const result = await engine.rollCheck(doc, 'perception');
      // WIS mod +2, no ranks = no class skill bonus
      expect(result.formula).toBe('1d20 + 2');
    });

    it('rolls CMB check', async () => {
      const doc = makeDoc({ cmb: 9 });
      const result = await engine.rollCheck(doc, 'cmb');
      expect(result.formula).toBe('1d20 + 9');
      expect(result.flavor).toBe('Combat Maneuver');
    });
  });

  describe('applyDamage', () => {
    it('treats negative damage as healing without consuming temp HP', () => {
      const doc = makeDoc({ hitPoints: { current: 6, max: 20, temp: 5 } });
      const result = engine.applyDamage(doc, -4, 'healing');
      expect(result.system.hitPoints.current).toBe(10);
      expect(result.system.hitPoints.temp).toBe(5);
    });
  });
});
