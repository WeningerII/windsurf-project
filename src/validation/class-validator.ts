/**
 * Class Data Validation System
 * 
 * Validates CharacterClass data integrity to catch errors before runtime
 */

import { CharacterClass } from '../types/character-options/classes';
import {
  isValidWeaponProficiency,
  isValidArmorProficiency,
  isValidToolProficiency,
  isValidSkillProficiency,
} from '../constants/proficiencies';
import { GAME_RULES } from '../constants/game-rules';

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate a CharacterClass object
 */
export function validateClass(cls: CharacterClass): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Required fields
  if (!cls.id) {
    errors.push({
      code: 'MISSING_ID',
      message: 'Class must have an id',
      field: 'id',
      severity: 'error',
    });
  }
  
  if (!cls.name) {
    errors.push({
      code: 'MISSING_NAME',
      message: 'Class must have a name',
      field: 'name',
      severity: 'error',
    });
  }
  
  // ID format validation (should be kebab-case)
  if (cls.id && !/^[a-z][a-z0-9-]*$/.test(cls.id)) {
    warnings.push({
      code: 'INVALID_ID_FORMAT',
      message: `Class ID should be kebab-case, got: ${cls.id}`,
      field: 'id',
      severity: 'warning',
    });
  }
  
  // Primary ability validation
  if (!cls.primaryAbility || cls.primaryAbility.length === 0) {
    errors.push({
      code: 'MISSING_PRIMARY_ABILITY',
      message: 'Class must have at least one primary ability',
      field: 'primaryAbility',
      severity: 'error',
    });
  }
  
  // Saving throw validation
  if (!cls.savingThrowProficiencies || cls.savingThrowProficiencies.length !== 2) {
    errors.push({
      code: 'INVALID_SAVES',
      message: 'Class must have exactly 2 saving throw proficiencies',
      field: 'savingThrowProficiencies',
      severity: 'error',
    });
  }
  
  // Subclass level validation
  if (cls.subclassLevel < GAME_RULES.MIN_CHARACTER_LEVEL || cls.subclassLevel > GAME_RULES.MAX_CHARACTER_LEVEL) {
    errors.push({
      code: 'INVALID_SUBCLASS_LEVEL',
      message: `Subclass level must be ${GAME_RULES.MIN_CHARACTER_LEVEL}-${GAME_RULES.MAX_CHARACTER_LEVEL}, got: ${cls.subclassLevel}`,
      field: 'subclassLevel',
      severity: 'error',
    });
  }
  
  // Most classes get subclass at level 1, 2, or 3
  if (cls.subclassLevel > 3) {
    warnings.push({
      code: 'UNUSUAL_SUBCLASS_LEVEL',
      message: `Subclass level ${cls.subclassLevel} is unusual (typically 1-3)`,
      field: 'subclassLevel',
      severity: 'warning',
    });
  }
  
  // Proficiency validation
  cls.weaponProficiencies?.forEach((prof, idx) => {
    if (!isValidWeaponProficiency(prof)) {
      errors.push({
        code: 'INVALID_WEAPON_PROFICIENCY',
        message: `Invalid weapon proficiency: "${prof}"`,
        field: `weaponProficiencies[${idx}]`,
        severity: 'error',
      });
    }
  });
  
  cls.armorProficiencies?.forEach((prof, idx) => {
    if (!isValidArmorProficiency(prof)) {
      errors.push({
        code: 'INVALID_ARMOR_PROFICIENCY',
        message: `Invalid armor proficiency: "${prof}"`,
        field: `armorProficiencies[${idx}]`,
        severity: 'error',
      });
    }
  });
  
  // Validate tool proficiencies in choices
  cls.toolProficiencies?.forEach((choice, idx) => {
    choice.options.forEach((tool, toolIdx) => {
      if (!isValidToolProficiency(tool)) {
        errors.push({
          code: 'INVALID_TOOL_PROFICIENCY',
          message: `Invalid tool proficiency: "${tool}"`,
          field: `toolProficiencies[${idx}].options[${toolIdx}]`,
          severity: 'error',
        });
      }
    });
  });
  
  // Validate skill proficiencies
  cls.skillProficiencies?.options.forEach((skill, idx) => {
    if (!isValidSkillProficiency(skill)) {
      errors.push({
        code: 'INVALID_SKILL_PROFICIENCY',
        message: `Invalid skill proficiency: "${skill}"`,
        field: `skillProficiencies.options[${idx}]`,
        severity: 'error',
      });
    }
  });
  
  // Feature progression validation
  if (!cls.features || cls.features.length === 0) {
    errors.push({
      code: 'NO_FEATURES',
      message: 'Class must have features',
      field: 'features',
      severity: 'error',
    });
  } else {
    // Check for 20-level progression
    const levels = cls.features.map(f => f.level);
    const maxLevel = Math.max(...levels);
    const minLevel = Math.min(...levels);
    
    if (maxLevel !== GAME_RULES.MAX_CHARACTER_LEVEL) {
      warnings.push({
        code: 'INCOMPLETE_PROGRESSION',
        message: `Feature progression should go to level ${GAME_RULES.MAX_CHARACTER_LEVEL}, only goes to ${maxLevel}`,
        field: 'features',
        severity: 'warning',
      });
    }
    
    if (minLevel !== GAME_RULES.MIN_CHARACTER_LEVEL) {
      errors.push({
        code: 'MISSING_LEVEL_1',
        message: 'Class must have level 1 features',
        field: 'features',
        severity: 'error',
      });
    }
    
    // Check for duplicate levels
    const levelCounts = new Map<number, number>();
    levels.forEach(level => {
      levelCounts.set(level, (levelCounts.get(level) ?? 0) + 1);
    });
    
    levelCounts.forEach((count, level) => {
      if (count > 1) {
        errors.push({
          code: 'DUPLICATE_LEVEL',
          message: `Level ${level} appears ${count} times in features`,
          field: 'features',
          severity: 'error',
        });
      }
    });
    
    // Validate each feature has required fields
    cls.features.forEach((progression, idx) => {
      if (!progression.features || progression.features.length === 0) {
        // Empty feature arrays are okay for levels with only subclass features
        // But warn about it
        warnings.push({
          code: 'EMPTY_FEATURE_LEVEL',
          message: `Level ${progression.level} has no features`,
          field: `features[${idx}]`,
          severity: 'warning',
        });
      }
      
      progression.features.forEach((feature, fIdx) => {
        if (!feature.id) {
          errors.push({
            code: 'MISSING_FEATURE_ID',
            message: `Feature at level ${progression.level} index ${fIdx} missing id`,
            field: `features[${idx}].features[${fIdx}].id`,
            severity: 'error',
          });
        }
        
        if (!feature.name) {
          errors.push({
            code: 'MISSING_FEATURE_NAME',
            message: `Feature at level ${progression.level} missing name`,
            field: `features[${idx}].features[${fIdx}].name`,
            severity: 'error',
          });
        }
        
        if (!feature.description) {
          warnings.push({
            code: 'MISSING_FEATURE_DESCRIPTION',
            message: `Feature "${feature.name}" at level ${progression.level} missing description`,
            field: `features[${idx}].features[${fIdx}].description`,
            severity: 'warning',
          });
        }
      });
    });
  }
  
  // Spellcasting validation
  if (cls.spellcasting) {
    const sc = cls.spellcasting;
    
    // Validate spell slots
    Object.entries(sc.spellSlots).forEach(([level, slots]) => {
      if (slots.length !== GAME_RULES.SPELL_SLOT_ARRAY_LENGTH) {
        errors.push({
          code: 'INVALID_SPELL_SLOT_ARRAY',
          message: `Spell slot level ${level} must have exactly ${GAME_RULES.SPELL_SLOT_ARRAY_LENGTH} elements, got ${slots.length}`,
          field: `spellcasting.spellSlots.${level}`,
          severity: 'error',
        });
      }
    });
    
    // Validate cantrips known
    if (sc.cantripsKnown && sc.cantripsKnown.length !== GAME_RULES.SPELL_SLOT_ARRAY_LENGTH) {
      errors.push({
        code: 'INVALID_CANTRIPS_ARRAY',
        message: `Cantrips known must have exactly ${GAME_RULES.SPELL_SLOT_ARRAY_LENGTH} elements, got ${sc.cantripsKnown.length}`,
        field: 'spellcasting.cantripsKnown',
        severity: 'error',
      });
    }
    
    // Validate spells known
    if (sc.spellsKnown && sc.spellsKnown.length !== GAME_RULES.SPELL_SLOT_ARRAY_LENGTH) {
      errors.push({
        code: 'INVALID_SPELLS_ARRAY',
        message: `Spells known must have exactly ${GAME_RULES.SPELL_SLOT_ARRAY_LENGTH} elements, got ${sc.spellsKnown.length}`,
        field: 'spellcasting.spellsKnown',
        severity: 'error',
      });
    }
    
    // Pact Magic specific validation
    if (sc.isPactMagic) {
      if (sc.slotRecovery !== 'short-rest') {
        warnings.push({
          code: 'PACT_MAGIC_RECOVERY',
          message: 'Pact Magic should recover on short rest',
          field: 'spellcasting.slotRecovery',
          severity: 'warning',
        });
      }
      
      if (sc.multiclassCasterLevel !== 'none') {
        warnings.push({
          code: 'PACT_MAGIC_MULTICLASS',
          message: 'Pact Magic should not contribute to multiclass spell slots',
          field: 'spellcasting.multiclassCasterLevel',
          severity: 'warning',
        });
      }
    }
    
    // Normal spellcasting should have multiclass level
    if (!sc.isPactMagic && !sc.multiclassCasterLevel) {
      warnings.push({
        code: 'MISSING_MULTICLASS_LEVEL',
        message: 'Spellcasting class should specify multiclassCasterLevel',
        field: 'spellcasting.multiclassCasterLevel',
        severity: 'warning',
      });
    }
  }
  
  // Subclass validation
  if (!cls.subclasses || cls.subclasses.length === 0) {
    warnings.push({
      code: 'NO_SUBCLASSES',
      message: 'Class has no subclasses defined',
      field: 'subclasses',
      severity: 'warning',
    });
  } else {
    cls.subclasses.forEach((subclass, idx) => {
      if (!subclass.id) {
        errors.push({
          code: 'MISSING_SUBCLASS_ID',
          message: `Subclass at index ${idx} missing id`,
          field: `subclasses[${idx}].id`,
          severity: 'error',
        });
      }
      
      if (!subclass.name) {
        errors.push({
          code: 'MISSING_SUBCLASS_NAME',
          message: `Subclass at index ${idx} missing name`,
          field: `subclasses[${idx}].name`,
          severity: 'error',
        });
      }
      
      if (subclass.parentClassId !== cls.id) {
        errors.push({
          code: 'MISMATCHED_PARENT_CLASS',
          message: `Subclass "${subclass.name}" parentClassId "${subclass.parentClassId}" doesn't match class id "${cls.id}"`,
          field: `subclasses[${idx}].parentClassId`,
          severity: 'error',
        });
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all classes in an array
 */
export function validateClasses(classes: CharacterClass[]): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();
  
  classes.forEach(cls => {
    results.set(cls.id, validateClass(cls));
  });
  
  return results;
}

/**
 * Print validation results to console
 */
export function printValidationResults(results: Map<string, ValidationResult>): void {
  let totalErrors = 0;
  let totalWarnings = 0;
  
  results.forEach((result, classId) => {
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`\n=== ${classId} ===`);
      
      result.errors.forEach(error => {
        console.error(`  ❌ ERROR [${error.code}]: ${error.message}`);
        if (error.field) console.error(`     Field: ${error.field}`);
        totalErrors++;
      });
      
      result.warnings.forEach(warning => {
        console.warn(`  ⚠️  WARNING [${warning.code}]: ${warning.message}`);
        if (warning.field) console.warn(`     Field: ${warning.field}`);
        totalWarnings++;
      });
    }
  });
  
  console.log(`\n=== Summary ===`);
  console.log(`Total Classes: ${results.size}`);
  console.log(`Valid: ${Array.from(results.values()).filter(r => r.valid).length}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Warnings: ${totalWarnings}`);
}
