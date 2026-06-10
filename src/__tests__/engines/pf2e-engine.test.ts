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
    it('returns a new document reference from prepareData without mutating the original system', () => {
      const doc = makeDoc({
        level: 5,
        skillProficiencies: {
          athletics: { tier: 'trained', total: 0 },
        },
      });
      const originalSystem = doc.system;
      const originalSkillProficiencies = doc.system.skillProficiencies;

      const result = engine.prepareData(doc);

      expect(result).not.toBe(doc);
      expect(result.system).not.toBe(originalSystem);
      expect(result.system.skillProficiencies).not.toBe(originalSkillProficiencies);
      expect(doc.system.skillProficiencies.athletics.total).toBe(0);
      expect(doc.system.armorClass).toBe(10);
    });

    it('derives max HP from the class hit die (barbarian d12 vs wizard d6)', () => {
      const attributes = { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 };
      const barbarian = engine.prepareData(
        makeDoc({ level: 1, classId: 'barbarian', ancestryHP: 8, baseAttributes: attributes })
      );
      // Ancestry 8 + level 1 × (d12 → 12 + CON +2) = 22
      expect(barbarian.system.hitPoints.max).toBe(22);

      const wizard = engine.prepareData(
        makeDoc({ level: 1, classId: 'wizard', ancestryHP: 8, baseAttributes: attributes })
      );
      // Ancestry 8 + level 1 × (d6 → 6 + CON +2) = 16
      expect(wizard.system.hitPoints.max).toBe(16);
    });

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

    // CRB Conditions Appendix: "Clumsy — you take a status penalty equal to
    // the condition value to Dexterity-based checks and DCs, including AC".
    // It is a flat status penalty to the AC DC, NOT a Dexterity-score
    // reduction, so it applies in full even inside armor with a 0 Dex cap.
    it('applies clumsy as a status penalty to AC even when the armor dex cap is 0', () => {
      const doc = makeDoc({
        level: 4,
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'untrained', total: 0 },
          light: { tier: 'untrained', total: 0 },
          medium: { tier: 'untrained', total: 0 },
          heavy: { tier: 'trained', total: 0 },
        },
        equipment: [
          {
            itemId: 'full-plate',
            name: 'Full Plate',
            bulk: 4,
            equipped: true,
            armorClass: 6,
            armorType: 'heavy',
            dexBonusMax: 0,
          },
        ],
        conditions: [{ id: 'cond-clumsy', name: 'Clumsy', value: 2 }],
      });

      const result = engine.prepareData(doc);
      // 10 + armor 6 + capped Dex 0 + heavy trained (4+2) = 22, − clumsy 2 = 20
      expect(result.system.armorClass).toBe(20);
    });

    // CRB: status penalties of the same type do not stack — only the single
    // worst of clumsy/frightened/sickened applies to AC.
    it('applies only the worst status penalty to AC (clumsy 2 vs frightened 1)', () => {
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
      // 10 + Dex 3 + unarmored trained (4+2) = 19, − worst status (clumsy 2) = 17
      expect(result.system.armorClass).toBe(17);
    });

    // CRB Conditions Appendix: "Frightened — you take a status penalty equal
    // to this value to all your checks and DCs" (sickened likewise). AC is a
    // DC, so the worst of the two applies to static AC as well as to checks.
    it('applies frightened/sickened status penalties to AC and to roll checks', async () => {
      const doc = makeDoc({
        level: 4,
        baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 16, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'trained', total: 0 },
          light: { tier: 'untrained', total: 0 },
          medium: { tier: 'untrained', total: 0 },
          heavy: { tier: 'untrained', total: 0 },
        },
        perceptionProficiency: { tier: 'trained', total: 0 },
        conditions: [
          { id: 'cond-frightened', name: 'Frightened', value: 2 },
          { id: 'cond-sickened', name: 'Sickened', value: 1 },
        ],
      });

      const result = engine.prepareData(doc);
      const roll = await engine.rollCheck(result, 'perception');

      // 10 + Dex 3 + unarmored trained (4+2) = 19, − frightened 2 = 17
      expect(result.system.armorClass).toBe(17);
      expect(roll.formula).toBe('1d20 + 9 - 2');
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

    it('computes class DC proficiency and seeds trained for legacy documents', () => {
      const doc = makeDoc({
        level: 6,
        classDcProficiency: { tier: 'expert', total: 0 },
      });
      const result = engine.prepareData(doc);
      // Expert: 6 + 4 = 10
      expect(result.system.classDcProficiency).toMatchObject({ tier: 'expert', total: 10 });

      const legacyDoc = makeDoc({ level: 3, classDcProficiency: undefined });
      const legacyResult = engine.prepareData(legacyDoc);
      // Older documents lack the entry; every class starts trained: 3 + 2 = 5
      expect(legacyResult.system.classDcProficiency).toMatchObject({ tier: 'trained', total: 5 });
    });

    it('preserves a manual max-HP bonus across prepares (regression: Max HP input reverted)', () => {
      const attributes = { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 };
      const doc = makeDoc({
        level: 1,
        classId: 'wizard',
        ancestryHP: 8,
        baseAttributes: attributes,
        // Toughness-style manual adjustment recorded by the sheet's Max HP editor
        hitPoints: { current: 19, max: 19, temp: 0, maxBonus: 3 },
      });

      const once = engine.prepareData(doc);
      // Ancestry 8 + 1 × (d6 6 + CON 2) = 16, + manual 3 = 19
      expect(once.system.hitPoints.max).toBe(19);

      const twice = engine.prepareData(once);
      expect(twice.system.hitPoints.max).toBe(19);
      expect(twice.system.hitPoints.maxBonus).toBe(3);
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

    it('treats negative damage as healing without consuming temp HP (parity with pf1e)', () => {
      // Mirrors pf1e-engine.test.ts: healing restores current HP capped at max
      // and never inflates temp HP (the old code grew temp via Math.min with a
      // negative remaining).
      const doc = makeDoc({ hitPoints: { current: 6, max: 20, temp: 5 } });
      const result = engine.applyDamage(doc, -4, 'healing');
      expect(result.system.hitPoints.current).toBe(10);
      expect(result.system.hitPoints.temp).toBe(5);
    });

    it('caps healing at max HP', () => {
      const doc = makeDoc({ hitPoints: { current: 18, max: 20, temp: 0 } });
      const result = engine.applyDamage(doc, -10, 'healing');
      expect(result.system.hitPoints.current).toBe(20);
    });
  });
});
