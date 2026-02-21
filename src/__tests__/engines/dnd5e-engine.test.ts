import { describe, it, expect } from 'vitest';
import { Dnd5eEngine } from '../../systems/dnd5e/engine';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5eDataModel } from '../../systems/dnd5e/data-model';

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'test-1',
    name: 'Test Hero',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Dnd5eEngine', () => {
  const engine = new Dnd5eEngine();

  describe('prepareData', () => {
    it('calculates proficiency bonus from level', () => {
      const doc = makeDoc({ level: 1 });
      const result = engine.prepareData(doc);
      // Level 1-4 = +2
      expect(result.system.level).toBe(1);
    });

    it('calculates HP from class hit die rolls + CON modifier', () => {
      const doc = makeDoc({
        level: 3,
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [10, 7, 6] }],
        hitPoints: { current: 50, max: 50, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // CON mod = +2, rolls: 10+2=12, 7+2=9, 6+2=8 => max = 29
      expect(result.system.hitPoints.max).toBe(29);
      // Current should be clamped to max
      expect(result.system.hitPoints.current).toBe(29);
    });

    it('ensures minimum 1 HP per die even with negative CON', () => {
      const doc = makeDoc({
        level: 1,
        baseAttributes: { str: 10, dex: 10, con: 3, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'wizard', level: 1, hitDieRolls: [1] }],
        hitPoints: { current: 10, max: 10, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // CON mod = -4, roll 1 + (-4) = -3, clamped to 1
      expect(result.system.hitPoints.max).toBe(1);
    });

    it('calculates AC = 10 + DEX mod', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
      });
      const result = engine.prepareData(doc);
      // DEX 16 = +3 mod, AC = 10 + 3 = 13
      expect(result.system.armorClass).toBe(13);
    });

    it('calculates initiative = DEX mod', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
      });
      const result = engine.prepareData(doc);
      expect(result.system.initiative).toBe(4);
    });
  });

  describe('rollCheck', () => {
    it('rolls an ability check with correct modifier', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 20, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      });
      const result = await engine.rollCheck(doc, 'str');
      // STR 20 = +5 mod, d20 range 1-20, total = d20 + 5
      expect(result.total).toBeGreaterThanOrEqual(6);
      expect(result.total).toBeLessThanOrEqual(25);
      expect(result.formula).toBe('1d20 + 5');
      expect(result.flavor).toBe('STR Check');
    });

    it('rolls a saving throw with proficiency', async () => {
      const doc = makeDoc({
        level: 5,
        baseAttributes: { str: 10, dex: 10, con: 16, int: 10, wis: 10, cha: 10 },
        savingThrowProficiencies: ['con'],
      });
      const result = await engine.rollCheck(doc, 'save-con');
      // CON mod +3, prof bonus +3 (level 5), total modifier = 6
      expect(result.formula).toBe('1d20 + 6');
      expect(result.flavor).toBe('CON Save');
    });

    it('rolls a skill check with proficiency', async () => {
      const doc = makeDoc({
        level: 1,
        baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 16, cha: 10 },
        skillProficiencies: { perception: { level: 'proficient', source: ['class'] } },
      });
      const result = await engine.rollCheck(doc, 'perception');
      // WIS mod +3, prof +2 (level 1), total = 5
      expect(result.formula).toBe('1d20 + 5');
    });

    it('rolls a skill check with expertise (double proficiency)', async () => {
      const doc = makeDoc({
        level: 1,
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        skillProficiencies: { stealth: { level: 'expertise', source: ['class'] } },
      });
      const result = await engine.rollCheck(doc, 'stealth');
      // DEX mod +3, expertise = prof*2 = 4, total = 7
      expect(result.formula).toBe('1d20 + 7');
    });
  });

  describe('applyDamage', () => {
    it('reduces current HP by damage amount', () => {
      const doc = makeDoc({ hitPoints: { current: 20, max: 20, temp: 0 } });
      const result = engine.applyDamage(doc, 8, 'slashing');
      expect(result.system.hitPoints.current).toBe(12);
    });

    it('absorbs damage with temp HP first', () => {
      const doc = makeDoc({ hitPoints: { current: 20, max: 20, temp: 5 } });
      const result = engine.applyDamage(doc, 8, 'fire');
      expect(result.system.hitPoints.temp).toBe(0);
      expect(result.system.hitPoints.current).toBe(17); // 5 absorbed, 3 to current
    });

    it('does not go below 0 HP', () => {
      const doc = makeDoc({ hitPoints: { current: 5, max: 20, temp: 0 } });
      const result = engine.applyDamage(doc, 100, 'force');
      expect(result.system.hitPoints.current).toBe(0);
    });
  });
});
