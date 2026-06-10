import { describe, it, expect, vi } from 'vitest';
import { Dnd5e2024Engine } from '../../systems/dnd5e-2024/engine';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5e2024DataModel } from '../../systems/dnd5e-2024/data-model';

function makeDoc(
  overrides: Partial<Dnd5e2024DataModel> = {}
): CharacterDocument<Dnd5e2024DataModel> {
  return {
    id: 'test-5e24',
    name: 'Test 2024 Hero',
    systemId: 'dnd-5e-2024',
    system: { ...createDefaultDnd5e2024Data(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Dnd5e2024Engine', () => {
  const engine = new Dnd5e2024Engine();

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

    it('calculates HP identically to 2014 rules', () => {
      const doc = makeDoc({
        level: 2,
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [10, 7] }],
        hitPoints: { current: 50, max: 50, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // CON mod +2, rolls: 10+2=12, 7+2=9 => 21
      expect(result.system.hitPoints.max).toBe(21);
    });

    it('preserves default max HP when no class levels are present', () => {
      const result = engine.prepareData(makeDoc());
      expect(result.system.hitPoints.max).toBe(10);
      expect(result.system.hitPoints.current).toBe(10);
    });

    it('preserves weapon masteries field', () => {
      const doc = makeDoc({
        weaponMasteries: ['longsword', 'shortbow'],
      });
      const result = engine.prepareData(doc);
      expect(result.system.weaponMasteries).toEqual(['longsword', 'shortbow']);
    });

    it('preserves spent hit dice between prepareData calls', () => {
      const doc = makeDoc({
        classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [10, 7] }],
        hitDice: [{ die: 'd10', total: 2, remaining: 1 }],
      });
      const result = engine.prepareData(doc);
      expect(result.system.hitDice[0].remaining).toBe(1);
    });

    it('adds proficiency bonus to initiative with the Alert feat', () => {
      // SRD 5.2 Alert: "Initiative Proficiency: Add your Proficiency Bonus to
      // Initiative rolls." It is NOT a Dex/Int swap (the old pinned behavior
      // contradicted the app's own SRD 5.2 feat data). Level 1 -> PB +2.
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 12, con: 10, int: 18, wis: 10, cha: 10 },
        feats: [{ id: 'alert', name: 'Alert', description: '', source: 'test' }],
      });
      const result = engine.prepareData(doc);
      expect(result.system.initiative).toBe(1 + 2); // Dex mod + PB, Int is irrelevant
    });

    it('scales the Alert initiative bonus with total level', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 5, hitDieRolls: [10, 6, 6, 6, 6] }],
        feats: [{ id: 'alert', name: 'Alert', description: '', source: 'test' }],
      });
      const result = engine.prepareData(doc);
      expect(result.system.initiative).toBe(2 + 3); // Dex +2, PB +3 at level 5
    });

    it('keeps initiative = Dex mod without the Alert feat', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 12, con: 10, int: 18, wis: 10, cha: 10 },
      });
      const result = engine.prepareData(doc);
      expect(result.system.initiative).toBe(1);
    });

    it("applies Alert to rollCheck('initiative') but never to a plain DEX ability check", async () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        feats: [{ id: 'alert', name: 'Alert', description: '', source: 'test' }],
      });

      const initiative = await engine.rollCheck(doc, 'initiative');
      // Dex +2 plus PB +2 at level 1; the d20 term is bounded 1..20.
      expect(initiative.total - 4).toBeGreaterThanOrEqual(1);
      expect(initiative.total - 4).toBeLessThanOrEqual(20);
      expect(initiative.flavor).toContain('Initiative');

      const plainDex = await engine.rollCheck(doc, 'dex');
      // The bare DEX check carries only the +2 Dex mod — Alert must not leak.
      expect(plainDex.total - 2).toBeGreaterThanOrEqual(1);
      expect(plainDex.total - 2).toBeLessThanOrEqual(20);
      expect(plainDex.flavor).toContain('DEX');
    });

    it('does not halve max HP at exhaustion level 4 (2024 rules)', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [10, 8] }],
        exhaustionLevel: 4,
        hitPoints: { current: 99, max: 99, temp: 0 },
      });
      const result = engine.prepareData(doc);
      // 10 + 8 = 18 + (2 * 2 CON mod) = 22. In 2024 rules, exhaustion does not halve HP.
      expect(result.system.hitPoints.max).toBe(22);
    });

    it('grants a level 1 Paladin two 1st-level slots (2024 rules)', () => {
      // SRD 5.2: Paladins (and Rangers) cast from level 1, and the 2024
      // multiclass rule rounds half-caster levels UP — see the class data
      // table (paladin spellSlots[1][0] === 2).
      const doc = makeDoc({
        classLevels: [{ classId: 'paladin', level: 1, hitDieRolls: [10] }],
        spellcasting: {
          classes: [{ classId: 'paladin', ability: 'cha', spellcastingLevel: 1 }],
          spellsKnown: [],
          spellsPrepared: [],
          spellSlots: {
            1: { max: 0, used: 0 },
            2: { max: 0, used: 0 },
            3: { max: 0, used: 0 },
            4: { max: 0, used: 0 },
            5: { max: 0, used: 0 },
            6: { max: 0, used: 0 },
            7: { max: 0, used: 0 },
            8: { max: 0, used: 0 },
            9: { max: 0, used: 0 },
          },
        },
      });
      const result = engine.prepareData(doc);
      expect(result.system.spellcasting?.spellSlots[1]).toEqual({ max: 2, used: 0 });
    });

    it('applies Monk Unarmored Defense to AC', () => {
      // SRD 5.2 Monk Unarmored Defense: 10 + Dex mod + Wis mod while wearing
      // no armor and wielding no shield (same wiring as the 2014 engine).
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 14, cha: 10 },
        features: [
          {
            id: 'unarmored-defense-monk',
            name: 'Unarmored Defense',
            source: 'Monk 1',
            description: '',
          },
        ],
      });
      const result = engine.prepareData(doc);
      expect(result.system.armorClass).toBe(15); // 10 + 3 + 2
    });
  });

  describe('rollCheck', () => {
    it('uses same formula as 2014 engine', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      });
      const result = await engine.rollCheck(doc, 'str');
      expect(result.formula).toBe('1d20 + 3');
    });

    it('applies disadvantage on ability checks while poisoned', async () => {
      const doc = makeDoc({
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        conditions: [{ id: 'poisoned', name: 'Poisoned' }],
      });
      const result = await engine.rollCheck(doc, 'str');
      expect(result.formula).toBe('2d20kl1 + 3');
      expect(result.flavor).toBe('STR Check (Disadvantage)');
    });
  });

  describe('applyDamage', () => {
    it('works identically to 2014 engine', () => {
      const doc = makeDoc({ hitPoints: { current: 15, max: 20, temp: 3 } });
      const result = engine.applyDamage(doc, 5, 'fire');
      expect(result.system.hitPoints.temp).toBe(0);
      expect(result.system.hitPoints.current).toBe(13);
    });

    it('supports healing via negative amount and clears death saves when conscious', () => {
      const doc = makeDoc({
        hitPoints: { current: 0, max: 20, temp: 0 },
        deathSaves: { successes: 1, failures: 2 },
      });
      const result = engine.applyDamage(doc, -3, 'healing');
      expect(result.system.hitPoints.current).toBe(3);
      expect(result.system.deathSaves).toEqual({ successes: 0, failures: 0 });
    });
  });

  describe('exhaustion (2024)', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it('imposes a -2 per level penalty on d20 tests', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0); // d20 = 1
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        exhaustionLevel: 2,
      });
      const result = await engine.rollCheck(doc, 'str');
      expect(result.total).toBe(1 - 4); // d20 1 + mod 0 + (-2 × 2)
    });
    it('is lethal at level 6 (current HP 0, three failed death saves)', () => {
      const doc = makeDoc({
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [10] }],
        exhaustionLevel: 6,
      });
      const result = engine.prepareData(doc);
      expect(result.system.hitPoints.current).toBe(0);
      expect(result.system.deathSaves.failures).toBe(3);
    });
  });
});
