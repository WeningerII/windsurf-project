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
    it('returns a new document reference from prepareData without mutating the original system', () => {
      const doc = makeDoc({
        classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [10] }],
        hitPoints: { current: 20, max: 20, temp: 0 },
        armorClass: 5,
        initiative: -1,
      });
      const originalSystem = doc.system;
      const originalHitPoints = { ...doc.system.hitPoints };

      const result = engine.prepareData(doc);

      expect(result).not.toBe(doc);
      expect(result.system).not.toBe(originalSystem);
      expect(result.system.hitPoints).not.toBe(originalSystem.hitPoints);
      expect(doc.system.hitPoints).toEqual(originalHitPoints);
      expect(doc.system.armorClass).toBe(5);
      expect(doc.system.initiative).toBe(-1);
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

    it('preserves default max HP when no class levels are present', () => {
      const result = engine.prepareData(makeDoc());
      expect(result.system.hitPoints.max).toBe(10);
      expect(result.system.hitPoints.current).toBe(10);
    });

    it('applies exhaustion to max HP even when no class levels are tracked', () => {
      const doc = makeDoc({
        exhaustionLevel: 4,
        hitPoints: { current: 50, max: 50, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // No class levels: the existing max (50) is preserved, then 2014
      // exhaustion level 4 halves it to 25.
      expect(result.system.hitPoints.max).toBe(25);
      expect(result.system.hitPoints.current).toBe(25);
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

    it('preserves spent hit dice between prepareData calls', () => {
      const doc = makeDoc({
        classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [10, 7, 6] }],
        hitDice: [{ die: 'd10', total: 3, remaining: 1 }],
      });
      const result = engine.prepareData(doc);
      expect(result.system.hitDice[0].remaining).toBe(1);
    });

    it('applies exhaustion level 4 by halving max HP', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [10, 8] }],
        exhaustionLevel: 4,
        hitPoints: { current: 50, max: 50, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // Base max HP = (10+2) + (8+2) = 22, exhaustion 4 halves to 11.
      expect(result.system.hitPoints.max).toBe(11);
      expect(result.system.hitPoints.current).toBe(11);
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

    it('applies disadvantage on ability checks while poisoned', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        conditions: [{ id: 'poisoned', name: 'Poisoned' }],
      });
      const result = await engine.rollCheck(doc, 'str');
      expect(result.formula).toBe('2d20kl1 + 2');
      expect(result.flavor).toBe('STR Check (Disadvantage)');
    });

    it('auto-fails STR/DEX saves for paralyzed targets', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 16, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        conditions: [{ id: 'paralyzed', name: 'Paralyzed' }],
      });
      const result = await engine.rollCheck(doc, 'save-dex');
      expect(result.formula).toBe('Auto-fail');
      expect(result.flavor).toContain('Condition auto-fail');
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

    it('heals when damage amount is negative and clears death saves when conscious', () => {
      const doc = makeDoc({
        hitPoints: { current: 0, max: 20, temp: 0 },
        deathSaves: { successes: 2, failures: 1 },
      });
      const result = engine.applyDamage(doc, -5, 'healing');
      expect(result.system.hitPoints.current).toBe(5);
      expect(result.system.deathSaves).toEqual({ successes: 0, failures: 0 });
    });
  });
});
