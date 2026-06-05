import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import { loadClassesForSystem, loadSpeciesForSystem } from '../../utils/dataLoader';
import type { Pf1eDataModel } from '../pf1e/data-model';
import type { Dnd35eDataModel } from '../dnd35e/data-model';

/**
 * Shared legality gate for the d20 "legacy" systems (D&D 3.5e and Pathfinder
 * 1e). The two data models are structurally near-identical and share a sheet,
 * so one parameterized validator serves both — the same way `createDnd5eValidator`
 * serves both 5e editions.
 *
 * It loads the loader-backed class/species catalogs, confirms the build's
 * choices exist and add up, and checks the structural invariants the d20 engine
 * relies on (skill-rank caps, save/AC/HP sanity, spell-per-day tracking). It
 * reports issues and never mutates the document.
 */

export type D20LegacySystemId = 'dnd-3.5e' | 'pf1e';
type D20LegacyDataModel = Pf1eDataModel | Dnd35eDataModel;

const ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
const MIN_LEVEL = 1;
const MAX_LEVEL = 20;
const MIN_ABILITY = 1;
const MAX_ABILITY = 50;

export function createD20LegacyValidator<T extends D20LegacyDataModel>(
  systemId: D20LegacySystemId
): SystemValidator<T> {
  return {
    validateDocument: (document, context) => validateD20LegacyDocument(document, systemId, context),
  };
}

async function validateD20LegacyDocument<T extends D20LegacyDataModel>(
  document: CharacterDocument<T>,
  expectedSystemId: D20LegacySystemId,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const system = document.system;

  if (document.systemId !== expectedSystemId) {
    addIssue(issues, context, {
      code: 'd20-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${expectedSystemId} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  const [classes, species] = await Promise.all([
    loadClassesForSystem(expectedSystemId),
    loadSpeciesForSystem(expectedSystemId),
  ]);

  const characterLevel = validateLevel(issues, context, system.level);
  validateClassLevels(issues, context, system.classLevels, characterLevel, toIdSet(classes));
  validateSpecies(issues, context, system.speciesId, toIdSet(species));
  validateAbilityScores(issues, context, system.baseAttributes);
  validateSkillRanks(issues, context, system.skillRanks, characterLevel, expectedSystemId);
  validateVitals(issues, context, system);
  validateSaves(issues, context, system.saves);
  validateSpellsPerDay(issues, context, system.spellsPerDay);

  return { issues };
}

function validateLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  level: number
): number {
  if (!isIntegerInRange(level, MIN_LEVEL, MAX_LEVEL)) {
    addIssue(issues, context, {
      code: 'd20-invalid-level',
      severity: 'error',
      path: 'system.level',
      message: 'Character level must be an integer from 1 through 20.',
      recoverable: true,
      details: { value: level },
    });
    return Number.isFinite(level) && level >= 1 ? Math.floor(level) : 1;
  }
  return level;
}

function validateClassLevels(
  issues: ValidationIssue[],
  context: ValidationContext,
  classLevels: Array<{ classId: string; level: number; hitDieRolls: number[] }>,
  characterLevel: number,
  classIds: Set<string>
) {
  if (!Array.isArray(classLevels) || classLevels.length === 0) {
    addIssue(issues, context, {
      code: 'd20-no-class-levels',
      severity: 'warning',
      path: 'system.classLevels',
      message: 'No class levels are selected yet.',
      recoverable: true,
    });
    return;
  }

  let totalClassLevel = 0;

  classLevels.forEach((classLevel, index) => {
    const path = `system.classLevels.${index}`;

    if (!classIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'd20-unknown-class',
        severity: 'error',
        path: `${path}.classId`,
        message: `Class '${classLevel.classId}' is not in the loader-backed class catalog.`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }

    if (!isIntegerInRange(classLevel.level, MIN_LEVEL, MAX_LEVEL)) {
      addIssue(issues, context, {
        code: 'd20-invalid-class-level',
        severity: 'error',
        path: `${path}.level`,
        message: 'Class level must be an integer from 1 through 20.',
        recoverable: true,
        details: { value: classLevel.level },
      });
    } else {
      totalClassLevel += classLevel.level;
    }

    if (!Array.isArray(classLevel.hitDieRolls)) {
      addIssue(issues, context, {
        code: 'd20-invalid-hit-die-rolls',
        severity: 'error',
        path: `${path}.hitDieRolls`,
        message: 'Hit die rolls must be stored as an array.',
        recoverable: true,
      });
    }
  });

  if (
    isIntegerInRange(characterLevel, MIN_LEVEL, MAX_LEVEL) &&
    totalClassLevel !== characterLevel
  ) {
    addIssue(issues, context, {
      code: 'd20-class-total-mismatch',
      severity: 'warning',
      path: 'system.classLevels',
      message: `Class levels total ${totalClassLevel}, but character level is ${characterLevel}.`,
      recoverable: true,
      details: { totalClassLevel, characterLevel },
    });
  }
}

function validateSpecies(
  issues: ValidationIssue[],
  context: ValidationContext,
  speciesId: string | undefined,
  speciesIds: Set<string>
) {
  if (!speciesId) {
    addIssue(issues, context, {
      code: 'd20-missing-species',
      severity: 'warning',
      path: 'system.speciesId',
      message: 'No race is selected yet.',
      recoverable: true,
    });
    return;
  }

  if (!speciesIds.has(speciesId)) {
    addIssue(issues, context, {
      code: 'd20-unknown-species',
      severity: 'error',
      path: 'system.speciesId',
      message: `Race '${speciesId}' is not in the loader-backed race catalog.`,
      recoverable: true,
      details: { speciesId },
    });
  }
}

function validateAbilityScores(
  issues: ValidationIssue[],
  context: ValidationContext,
  baseAttributes: Record<string, number>
) {
  ABILITY_IDS.forEach((abilityId) => {
    const value = baseAttributes[abilityId];
    if (!isIntegerInRange(value, MIN_ABILITY, MAX_ABILITY)) {
      addIssue(issues, context, {
        code: 'd20-invalid-ability-score',
        severity: 'error',
        path: `system.baseAttributes.${abilityId}`,
        message: `${abilityId.toUpperCase()} must be an integer from ${MIN_ABILITY} through ${MAX_ABILITY}.`,
        recoverable: true,
        details: { abilityId, value },
      });
    }
  });
}

function validateSkillRanks(
  issues: ValidationIssue[],
  context: ValidationContext,
  skillRanks: Record<string, number>,
  characterLevel: number,
  systemId: D20LegacySystemId
) {
  // PF1e caps skill ranks at character level; 3.5e caps a class skill at
  // level + 3 (used here as the absolute upper bound across skill types).
  const maxRanks = systemId === 'pf1e' ? characterLevel : characterLevel + 3;

  Object.entries(skillRanks ?? {}).forEach(([skillId, ranks]) => {
    if (!Number.isFinite(ranks) || ranks < 0) {
      addIssue(issues, context, {
        code: 'd20-invalid-skill-ranks',
        severity: 'error',
        path: `system.skillRanks.${skillId}`,
        message: `Skill ranks for '${skillId}' must be a non-negative number.`,
        recoverable: true,
        details: { skillId, value: ranks },
      });
      return;
    }

    if (ranks > maxRanks) {
      addIssue(issues, context, {
        code: 'd20-skill-ranks-over-cap',
        severity: 'error',
        path: `system.skillRanks.${skillId}`,
        message: `'${skillId}' has ${ranks} ranks, above the maximum of ${maxRanks} at level ${characterLevel}.`,
        recoverable: true,
        details: { skillId, value: ranks, limit: maxRanks },
      });
    }
  });
}

function validateVitals(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: D20LegacyDataModel
) {
  const hp = system.hitPoints;
  if (!hp || !Number.isFinite(hp.max) || hp.max < 1) {
    addIssue(issues, context, {
      code: 'd20-invalid-hp',
      severity: 'error',
      path: 'system.hitPoints.max',
      message: 'Maximum hit points must be a positive number.',
      recoverable: true,
      details: { value: hp?.max },
    });
  } else if (hp.current > hp.max || hp.temp < 0) {
    addIssue(issues, context, {
      code: 'd20-invalid-hp',
      severity: 'warning',
      path: 'system.hitPoints',
      message: 'Current/temporary hit points are out of the valid range.',
      recoverable: true,
      details: { ...hp },
    });
  }

  if (!system.armorClass || !Number.isFinite(system.armorClass.total)) {
    addIssue(issues, context, {
      code: 'd20-invalid-ac',
      severity: 'error',
      path: 'system.armorClass.total',
      message: 'Armor Class total must be a number.',
      recoverable: true,
      details: { value: system.armorClass?.total },
    });
  }
}

function validateSaves(
  issues: ValidationIssue[],
  context: ValidationContext,
  saves: D20LegacyDataModel['saves']
) {
  (['fortitude', 'reflex', 'will'] as const).forEach((save) => {
    const entry = saves?.[save];
    if (!entry || !Number.isFinite(entry.total)) {
      addIssue(issues, context, {
        code: 'd20-invalid-save',
        severity: 'error',
        path: `system.saves.${save}.total`,
        message: `${save} save total must be a number.`,
        recoverable: true,
      });
    }
  });
}

function validateSpellsPerDay(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellsPerDay: Record<number, { total: number; used: number }> | undefined
) {
  if (!spellsPerDay) {
    return;
  }

  Object.entries(spellsPerDay).forEach(([level, slot]) => {
    if (!slot || slot.total < 0 || slot.used < 0 || slot.used > slot.total) {
      addIssue(issues, context, {
        code: 'd20-invalid-spells-per-day',
        severity: 'error',
        path: `system.spellsPerDay.${level}`,
        message: `Spells per day at level ${level} must be non-negative with used not exceeding total.`,
        recoverable: true,
        details: { level, ...slot },
      });
    }
  });
}

function toIdSet(items: Array<{ id: string }>): Set<string> {
  return new Set(items.map((item) => item.id));
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}
