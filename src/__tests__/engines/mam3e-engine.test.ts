import { describe, it, expect } from 'vitest';
import { Mam3eEngine } from '../../systems/mam3e/engine';
import { createDefaultMam3eData } from '../../systems/mam3e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Mam3eDataModel } from '../../systems/mam3e/data-model';

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'test-mam',
    name: 'Test Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Mam3eEngine', () => {
  const engine = new Mam3eEngine();

  describe('prepareData', () => {
    it('calculates defense totals from abilities + ranks', () => {
      const doc = makeDoc({
        abilities: { str: 2, sta: 4, agi: 6, dex: 3, fgt: 5, int: 1, awe: 3, pre: 2 },
        defenses: {
          dodge: { rank: 2, total: 0 },
          parry: { rank: 3, total: 0 },
          fortitude: { rank: 1, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 2, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Dodge = AGI + rank = 6 + 2 = 8
      expect(result.system.defenses.dodge.total).toBe(8);
      // Parry = FGT + rank = 5 + 3 = 8
      expect(result.system.defenses.parry.total).toBe(8);
      // Fortitude = STA + rank = 4 + 1 = 5
      expect(result.system.defenses.fortitude.total).toBe(5);
      // Toughness = STA + rank = 4 + 0 = 4
      expect(result.system.defenses.toughness.total).toBe(4);
      // Will = AWE + rank = 3 + 2 = 5
      expect(result.system.defenses.will.total).toBe(5);
    });

    it('calculates PP spent on abilities (each rank costs 2 PP)', () => {
      const doc = makeDoc({
        abilities: { str: 3, sta: 2, agi: 1, dex: 0, fgt: 4, int: 0, awe: 0, pre: 0 },
      });
      const result = engine.prepareData(doc);
      // Total ability ranks = 3+2+1+0+4+0+0+0 = 10, cost = 10 * 2 = 20
      expect(result.system.powerPoints.spent.abilities).toBe(20);
    });

    it('calculates PP spent on defenses', () => {
      const doc = makeDoc({
        defenses: {
          dodge: { rank: 5, total: 0 },
          parry: { rank: 3, total: 0 },
          fortitude: { rank: 2, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 4, total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Defense ranks = 5+3+2+0+4 = 14, cost = 14 * 1 = 14
      expect(result.system.powerPoints.spent.defenses).toBe(14);
    });
  });

  describe('rollCheck', () => {
    it('rolls an ability check', async () => {
      const doc = makeDoc({
        abilities: { str: 8, sta: 0, agi: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
      });
      const result = await engine.rollCheck(doc, 'str');
      // d20 + 8
      expect(result.total).toBeGreaterThanOrEqual(9);
      expect(result.total).toBeLessThanOrEqual(28);
      expect(result.formula).toBe('1d20 + 8');
    });

    it('rolls an ability check for a different ability', async () => {
      const doc = makeDoc({
        abilities: { str: 0, sta: 0, agi: 4, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
      });
      const result = await engine.rollCheck(doc, 'agi');
      // d20 + AGI rank (4)
      expect(result.formula).toBe('1d20 + 4');
    });
  });

  describe('applyDamage', () => {
    it('is a no-op (M&M uses condition track, not HP)', () => {
      const doc = makeDoc();
      const result = engine.applyDamage(doc, 10, 'damage');
      // M&M doesn't have HP — applyDamage should return document unchanged
      expect(result).toBe(doc);
    });
  });
});
