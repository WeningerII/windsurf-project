/**
 * Spell Data Validation Test Suite
 * 
 * Ensures all spell data meets quality standards and has no duplicates
 */

import { dnd5eSpells } from '../data/dnd/5e-2014/spells';
import type { Spell } from '../types/magic/spells';

describe('D&D 5e Spell Data Validation', () => {
  describe('Data Integrity', () => {
    it('should have no duplicate spell IDs', () => {
      const ids = dnd5eSpells.map(spell => spell.id);
      const uniqueIds = new Set(ids);
      
      if (ids.length !== uniqueIds.size) {
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        const uniqueDuplicates = [...new Set(duplicates)];
        throw new Error(`Found duplicate spell IDs: ${uniqueDuplicates.join(', ')}`);
      }
      
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have no duplicate spell names', () => {
      const names = dnd5eSpells.map(spell => spell.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should all be from dnd-5e-2014 system', () => {
      dnd5eSpells.forEach(spell => {
        expect(spell.system).toBe('dnd-5e-2014');
      });
    });

    it('should all have SRD 5.1 source attribution', () => {
      dnd5eSpells.forEach(spell => {
        expect(spell.source).toBe('SRD 5.1');
      });
    });
  });

  describe('Required Fields', () => {
    dnd5eSpells.forEach(spell => {
      describe(spell.name, () => {
        it('should have required fields', () => {
          expect(spell.id).toBeTruthy();
          expect(spell.name).toBeTruthy();
          expect(spell.system).toBeTruthy();
          expect(spell.source).toBeTruthy();
        });

        it('should have valid ID format (kebab-case)', () => {
          expect(spell.id).toMatch(/^[a-z][a-z0-9-]*$/);
        });

        it('should have valid level (0-9)', () => {
          expect(spell.level).toBeGreaterThanOrEqual(0);
          expect(spell.level).toBeLessThanOrEqual(9);
        });

        it('should have valid school', () => {
          const validSchools = ['abjuration', 'conjuration', 'divination', 'enchantment', 'evocation', 'illusion', 'necromancy', 'transmutation'];
          expect(validSchools).toContain(spell.school);
        });

        it('should have casting time', () => {
          expect(spell.castingTime).toBeTruthy();
          expect(spell.castingTime.type).toBeTruthy();
        });

        it('should have range', () => {
          expect(spell.range).toBeTruthy();
          expect(spell.range.type).toBeTruthy();
        });

        it('should have components', () => {
          expect(spell.components).toBeTruthy();
          expect(typeof spell.components.verbal).toBe('boolean');
          expect(typeof spell.components.somatic).toBe('boolean');
          expect(typeof spell.components.material).toBe('boolean');
        });

        it('should have duration', () => {
          expect(spell.duration).toBeTruthy();
          expect(spell.duration.type).toBeTruthy();
        });

        it('should have description over 10 characters', () => {
          expect(spell.description.length).toBeGreaterThan(10);
        });

        it('should have at least one class', () => {
          expect(spell.classes).toBeTruthy();
          expect(spell.classes.length).toBeGreaterThan(0);
        });

        it('should have valid class names', () => {
          const validClasses = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
          spell.classes.forEach(className => {
            expect(validClasses).toContain(className);
          });
        });
      });
    });
  });

  describe('Spell Statistics', () => {
    it('should have expected total count', () => {
      expect(dnd5eSpells.length).toBe(238);
    });

    it('should have cantrips (level 0)', () => {
      const cantrips = dnd5eSpells.filter(s => s.level === 0);
      expect(cantrips.length).toBeGreaterThan(15);
    });

    it('should have spells at all levels 1-9', () => {
      for (let level = 1; level <= 9; level++) {
        const spellsAtLevel = dnd5eSpells.filter(s => s.level === level);
        expect(spellsAtLevel.length).toBeGreaterThan(0);
      }
    });

    it('should have spells for all classes', () => {
      const classes = ['wizard', 'cleric', 'druid', 'bard', 'sorcerer', 'warlock', 'paladin', 'ranger'];
      classes.forEach(className => {
        const classSpells = dnd5eSpells.filter(s => s.classes.includes(className));
        expect(classSpells.length).toBeGreaterThan(0);
      });
    });

    it('should have spells in all schools', () => {
      const schools = ['abjuration', 'conjuration', 'divination', 'enchantment', 'evocation', 'illusion', 'necromancy', 'transmutation'];
      schools.forEach(school => {
        const schoolSpells = dnd5eSpells.filter(s => s.school === school);
        expect(schoolSpells.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Quality', () => {
    it('should have meaningful spell names (not just IDs)', () => {
      dnd5eSpells.forEach(spell => {
        expect(spell.name).not.toBe(spell.id);
        expect(spell.name[0]).toBe(spell.name[0].toUpperCase());
      });
    });

    it('should have concentration flag as boolean', () => {
      dnd5eSpells.forEach(spell => {
        expect(typeof spell.concentration).toBe('boolean');
      });
    });

    it('should have ritual flag as boolean', () => {
      dnd5eSpells.forEach(spell => {
        expect(typeof spell.ritual).toBe('boolean');
      });
    });

    it('should have valid damage types if damage exists', () => {
      const validDamageTypes = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'];
      
      dnd5eSpells.forEach(spell => {
        if (spell.damage) {
          expect(validDamageTypes).toContain(spell.damage.type);
        }
      });
    });
  });
});
