import { describe, it, expect } from 'vitest';
import { Pf2eEngine } from '../../systems/pf2e/engine';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import { CharacterDocument } from '../../types/core/document';
import { Pf2eDataModel } from '../../systems/pf2e/data-model';

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'test-pf2',
    name: 'Test Pathfinder 2e',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('Pf2eEngine', () => {
  const engine = new Pf2eEngine();

  describe('prepareData', () => {
    it('computes proficiency totals: trained = level + 2', () => {
      const doc = makeDoc({
        level: 5,
        skillProficiencies: {
          athletics: { tier: 'trained', total: 0 },
          stealth: { tier: 'expert', total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Trained: 5 + 2 = 7
      expect(result.system.skillProficiencies.athletics.total).toBe(7);
      // Expert: 5 + 4 = 9
      expect(result.system.skillProficiencies.stealth.total).toBe(9);
    });

    it('untrained proficiency = 0 (no level added)', () => {
      const doc = makeDoc({
        level: 10,
        skillProficiencies: {
          arcana: { tier: 'untrained', total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      expect(result.system.skillProficiencies.arcana.total).toBe(0);
    });

    it('computes save proficiency totals', () => {
      const doc = makeDoc({
        level: 3,
        saveProficiencies: {
          fortitude: { tier: 'expert', total: 0 },
          reflex: { tier: 'trained', total: 0 },
          will: { tier: 'master', total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // Expert: 3 + 4 = 7
      expect(result.system.saveProficiencies.fortitude.total).toBe(7);
      // Trained: 3 + 2 = 5
      expect(result.system.saveProficiencies.reflex.total).toBe(5);
      // Master: 3 + 6 = 9
      expect(result.system.saveProficiencies.will.total).toBe(9);
    });

    it('computes AC = 10 + DEX + armor proficiency', () => {
      const doc = makeDoc({
        level: 4,
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'trained', total: 0 },
          light: { tier: 'untrained', total: 0 },
          medium: { tier: 'untrained', total: 0 },
          heavy: { tier: 'untrained', total: 0 },
        },
      });
      const result = engine.prepareData(doc);
      // DEX mod +3, unarmored trained = 4+2 = 6, AC = 10 + 3 + 6 = 19
      expect(result.system.armorClass).toBe(19);
    });

    it('applies status penalties from conditions to AC', () => {
      const doc = makeDoc({
        level: 4,
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'trained', total: 0 },
          light: { tier: 'untrained', total: 0 },
          medium: { tier: 'untrained', total: 0 },
          heavy: { tier: 'untrained', total: 0 },
        },
        conditions: [
          { id: 'cond-clumsy', name: 'Clumsy', value: 2 },
          { id: 'cond-frightened', name: 'Frightened', value: 1 },
        ],
      });

      const result = engine.prepareData(doc);
      // Base AC 19, highest status penalty is 2 => 17
      expect(result.system.armorClass).toBe(17);
    });

    it('computes perception proficiency', () => {
      const doc = makeDoc({
        level: 7,
        perceptionProficiency: { tier: 'master', total: 0 },
      });
      const result = engine.prepareData(doc);
      // Master: 7 + 6 = 13
      expect(result.system.perceptionProficiency.total).toBe(13);
    });

    it('auto-populates spell slot maxima and focus points from class progression', () => {
      const doc = makeDoc({
        level: 4,
        classId: 'wizard',
        spellcasting: {
          tradition: 'arcane',
          type: 'prepared',
          proficiency: { tier: 'trained', total: 0 },
          spellSlots: {
            1: { max: 99, used: 8 },
            2: { max: 99, used: 6 },
          },
          spellsKnown: [],
          focusPoints: { current: 3, max: 3 },
        },
      });

      const result = engine.prepareData(doc);
      expect(result.system.spellcasting?.spellSlots[1]).toEqual({ max: 3, used: 3 });
      expect(result.system.spellcasting?.spellSlots[2]).toEqual({ max: 2, used: 2 });
      expect(result.system.spellcasting?.focusPoints).toEqual({ current: 1, max: 1 });
    });
  });

  describe('rollCheck', () => {
    it('rolls perception = WIS mod + proficiency', async () => {
      const doc = makeDoc({
        level: 5,
        baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 16, cha: 10 },
        perceptionProficiency: { tier: 'trained', total: 7 },
      });
      const result = await engine.rollCheck(doc, 'perception');
      // WIS mod +3, proficiency total 7 = 10
      expect(result.formula).toBe('1d20 + 10');
      expect(result.flavor).toBe('Perception');
    });

    it('rolls a skill check with proficiency', async () => {
      const doc = makeDoc({
        level: 3,
        baseAttributes: { str: 18, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skillProficiencies: {
          athletics: { tier: 'expert', total: 7 },
        },
      });
      const result = await engine.rollCheck(doc, 'athletics');
      // STR mod +4, proficiency 7 = 11
      expect(result.formula).toBe('1d20 + 11');
    });

    it('rolls a save', async () => {
      const doc = makeDoc({
        level: 5,
        baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
        saveProficiencies: {
          fortitude: { tier: 'expert', total: 9 },
          reflex: { tier: 'trained', total: 7 },
          will: { tier: 'trained', total: 7 },
        },
      });
      const result = await engine.rollCheck(doc, 'fortitude');
      // CON mod +2, proficiency 9 = 11
      expect(result.formula).toBe('1d20 + 11');
      expect(result.flavor).toBe('Fortitude Save');
    });

    it('applies condition penalties to roll modifiers', async () => {
      const doc = makeDoc({
        level: 3,
        baseAttributes: { str: 18, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skillProficiencies: {
          athletics: { tier: 'expert', total: 7 },
        },
        conditions: [
          { id: 'cond-enfeebled', name: 'Enfeebled', value: 2 },
          { id: 'cond-frightened', name: 'Frightened', value: 1 },
        ],
      });

      const result = await engine.rollCheck(doc, 'athletics');
      // Base: STR +4, proficiency 7 = 11; highest relevant status penalty is 2
      expect(result.formula).toBe('1d20 + 11 - 2');
    });
  });

  describe('applyDamage', () => {
    it('reduces HP, temp HP absorbs first', () => {
      const doc = makeDoc({
        hitPoints: { current: 30, max: 30, temp: 10 },
      });
      const result = engine.applyDamage(doc, 15, 'slashing');
      expect(result.system.hitPoints.temp).toBe(0);
      expect(result.system.hitPoints.current).toBe(25);
    });
  });
});
