import { describe, it, expect } from 'vitest';
import { Dnd5e2024Engine } from '../../systems/dnd5e-2024/engine';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5e2024DataModel } from '../../systems/dnd5e-2024/data-model';

function makeDoc(overrides: Partial<Dnd5e2024DataModel> = {}): CharacterDocument<Dnd5e2024DataModel> {
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

    it('preserves weapon masteries field', () => {
      const doc = makeDoc({
        weaponMasteries: ['longsword', 'shortbow'],
      });
      const result = engine.prepareData(doc);
      expect(result.system.weaponMasteries).toEqual(['longsword', 'shortbow']);
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
  });

  describe('applyDamage', () => {
    it('works identically to 2014 engine', () => {
      const doc = makeDoc({ hitPoints: { current: 15, max: 20, temp: 3 } });
      const result = engine.applyDamage(doc, 5, 'fire');
      expect(result.system.hitPoints.temp).toBe(0);
      expect(result.system.hitPoints.current).toBe(13);
    });
  });
});
