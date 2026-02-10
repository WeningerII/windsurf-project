/**
 * Class Data Validation Test Suite
 * 
 * Ensures all class data meets quality standards
 */

import { dnd5eClasses } from '../data/dnd/5e-2014/classes';
import { validateClass, ValidationResult } from '../validation/class-validator';
import type { CharacterClass } from '../types/character-options/classes';

describe('D&D 5e Class Data Validation', () => {
  // Run validation on all classes once
  const validationResults = new Map<string, ValidationResult>();
  
  beforeAll(() => {
    dnd5eClasses.forEach(cls => {
      validationResults.set(cls.id, validateClass(cls));
    });
  });

  // Test each class individually
  dnd5eClasses.forEach(cls => {
    describe(cls.name, () => {
      let result: ValidationResult;
      
      beforeAll(() => {
        result = validationResults.get(cls.id)!;
      });

      it('should have valid structure', () => {
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
      
      it('should have required fields', () => {
        expect(cls.id).toBeTruthy();
        expect(cls.name).toBeTruthy();
        expect(cls.system).toBe('dnd-5e-2014');
        expect(cls.source).toBeTruthy();
      });

      it('should have valid ID format (kebab-case)', () => {
        expect(cls.id).toMatch(/^[a-z][a-z0-9-]*$/);
      });

      it('should have exactly 2 saving throw proficiencies', () => {
        expect(cls.savingThrowProficiencies).toHaveLength(2);
      });

      it('should have at least 1 primary ability', () => {
        expect(cls.primaryAbility.length).toBeGreaterThanOrEqual(1);
      });

      it('should have valid subclass level (1-20)', () => {
        expect(cls.subclassLevel).toBeGreaterThanOrEqual(1);
        expect(cls.subclassLevel).toBeLessThanOrEqual(20);
      });

      it('should have feature progression up to level 20', () => {
        const levels = cls.features.map(f => f.level);
        const maxLevel = Math.max(...levels);
        expect(maxLevel).toBe(20);
      });

      it('should have features starting at level 1', () => {
        const levels = cls.features.map(f => f.level);
        const minLevel = Math.min(...levels);
        expect(minLevel).toBe(1);
      });

      it('should have no duplicate feature levels', () => {
        const levels = cls.features.map(f => f.level);
        const uniqueLevels = new Set(levels);
        expect(levels.length).toBe(uniqueLevels.size);
      });

      it('should have all features with required fields', () => {
        cls.features.forEach(progression => {
          progression.features.forEach(feature => {
            expect(feature.id).toBeTruthy();
            expect(feature.name).toBeTruthy();
            expect(feature.description).toBeTruthy();
            expect(feature.source).toBeTruthy();
          });
        });
      });

      it('should have at least one subclass', () => {
        expect(cls.subclasses.length).toBeGreaterThanOrEqual(1);
      });

      it('should have subclasses with correct parent ID', () => {
        cls.subclasses.forEach(subclass => {
          expect(subclass.parentClassId).toBe(cls.id);
        });
      });

      if (cls.spellcasting) {
        describe('Spellcasting', () => {
          it('should have spell slots arrays with exactly 20 elements', () => {
            Object.values(cls.spellcasting!.spellSlots).forEach(slots => {
              expect(slots).toHaveLength(20);
            });
          });

          it('should have cantrips known with 20 elements if present', () => {
            if (cls.spellcasting!.cantripsKnown) {
              expect(cls.spellcasting!.cantripsKnown).toHaveLength(20);
            }
          });

          it('should have spells known with 20 elements if present', () => {
            if (cls.spellcasting!.spellsKnown) {
              expect(cls.spellcasting!.spellsKnown).toHaveLength(20);
            }
          });

          it('should have multiclass caster level defined', () => {
            expect(cls.spellcasting!.multiclassCasterLevel).toBeTruthy();
          });

          if (cls.spellcasting.isPactMagic) {
            it('should have short rest recovery for Pact Magic', () => {
              expect(cls.spellcasting!.slotRecovery).toBe('short-rest');
            });

            it('should not contribute to multiclass spell slots', () => {
              expect(cls.spellcasting!.multiclassCasterLevel).toBe('none');
            });
          }
        });
      }

      if (cls.displayMetadata) {
        describe('Display Metadata', () => {
          it('should have required display fields', () => {
            expect(cls.displayMetadata!.shortDescription).toBeTruthy();
            expect(cls.displayMetadata!.playStyle).toBeTruthy();
            expect(cls.displayMetadata!.complexity).toBeTruthy();
            expect(cls.displayMetadata!.role).toBeTruthy();
          });

          it('should have valid complexity level', () => {
            expect(['simple', 'moderate', 'complex']).toContain(
              cls.displayMetadata!.complexity
            );
          });

          it('should have valid role', () => {
            expect(['striker', 'defender', 'controller', 'support', 'hybrid']).toContain(
              cls.displayMetadata!.role
            );
          });
        });
      }
    });
  });

  describe('Overall Data Quality', () => {
    it('should have 12 classes total', () => {
      expect(dnd5eClasses).toHaveLength(12);
    });

    it('should have no validation errors across all classes', () => {
      const totalErrors = Array.from(validationResults.values())
        .reduce((sum, result) => sum + result.errors.length, 0);
      expect(totalErrors).toBe(0);
    });

    it('should have all classes pass validation', () => {
      const allValid = Array.from(validationResults.values())
        .every(result => result.valid);
      expect(allValid).toBe(true);
    });

    it('should have unique class IDs', () => {
      const ids = dnd5eClasses.map(cls => cls.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have unique class names', () => {
      const names = dnd5eClasses.map(cls => cls.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should all be from dnd5e system', () => {
      dnd5eClasses.forEach(cls => {
        expect(cls.system).toBe('dnd-5e-2014');
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent hit die values (d6-d12)', () => {
      const validHitDice = ['d6', 'd8', 'd10', 'd12'];
      dnd5eClasses.forEach(cls => {
        expect(validHitDice).toContain(cls.hitDie);
      });
    });

    it('should have consistent ability score references', () => {
      const validAbilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
      dnd5eClasses.forEach(cls => {
        cls.primaryAbility.forEach(ability => {
          expect(validAbilities).toContain(ability);
        });
        cls.savingThrowProficiencies.forEach(ability => {
          expect(validAbilities).toContain(ability);
        });
      });
    });

    it('should have subclass levels in typical range (1-3)', () => {
      dnd5eClasses.forEach(cls => {
        // Most D&D 5e classes get subclass at 1, 2, or 3
        expect(cls.subclassLevel).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('Feature Quality', () => {
    it('should have meaningful feature names (not just IDs)', () => {
      dnd5eClasses.forEach(cls => {
        cls.features.forEach(progression => {
          progression.features.forEach(feature => {
            // Name should be different from ID and have proper capitalization
            expect(feature.name).not.toBe(feature.id);
            expect(feature.name[0]).toBe(feature.name[0].toUpperCase());
          });
        });
      });
    });

    it('should have descriptions over 10 characters', () => {
      dnd5eClasses.forEach(cls => {
        cls.features.forEach(progression => {
          progression.features.forEach(feature => {
            expect(feature.description.length).toBeGreaterThan(10);
          });
        });
      });
    });

    it('should have proper source attribution format', () => {
      dnd5eClasses.forEach(cls => {
        cls.features.forEach(progression => {
          progression.features.forEach(feature => {
            // Source should mention the class name
            expect(feature.source).toMatch(new RegExp(cls.name, 'i'));
          });
        });
      });
    });
  });
});
