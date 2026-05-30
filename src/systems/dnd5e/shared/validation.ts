import type { SystemValidator, ValidationContext, ValidationIssue } from '../../../registry/types';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { Dnd5eFeatureOptionDefinition } from '../../../types/character-options/feature-options';
import type { ClassLevel, Feat, SpellcastingInfo, SpellSlots } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadFeatureOptionsForSystem,
  loadFeatsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../../utils/dataLoader';
import type { Dnd5e2024DataModel } from '../../dnd5e-2024/data-model';
import type { Dnd5eDataModel } from '../data-model';

export type Dnd5eValidationSystemId = 'dnd-5e-2014' | 'dnd-5e-2024';

type Dnd5eValidationDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

const ABILITY_SCORE_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
const SPELL_SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const MIN_CHARACTER_LEVEL = 1;
const MAX_CHARACTER_LEVEL = 20;

type Dnd5eValidationData = {
  classes: CharacterClass[];
  classIds: Set<string>;
  speciesIds: Set<string>;
  backgroundIds: Set<string>;
  featIds: Set<string>;
  spellIds: Set<string>;
  featureOptionKeys: Set<string>;
  featureOptionsByKey: Map<string, Dnd5eFeatureOptionDefinition>;
};

export function createDnd5eValidator<T extends Dnd5eValidationDataModel>(
  systemId: Dnd5eValidationSystemId
): SystemValidator<T> {
  return {
    validateDocument: (document, context) => validateDnd5eDocument(document, systemId, context),
  };
}

async function validateDnd5eDocument<T extends Dnd5eValidationDataModel>(
  document: CharacterDocument<T>,
  expectedSystemId: Dnd5eValidationSystemId,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const validationData = await loadValidationData(expectedSystemId);
  const system = document.system;

  if (document.systemId !== expectedSystemId) {
    addIssue(issues, context, {
      code: 'dnd5e-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected ${expectedSystemId} but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  validateCharacterLevel(issues, context, system.level);
  validateClassLevels(issues, context, system.classLevels, system.level, validationData.classes);
  validateCharacterOptions(issues, context, system, validationData);
  validateAbilityScores(issues, context, system.baseAttributes);
  validateSpellcasting(issues, context, system.spellcasting, system.classLevels, validationData);

  return { issues };
}

async function loadValidationData(systemId: Dnd5eValidationSystemId): Promise<Dnd5eValidationData> {
  const [classes, species, backgrounds, feats, spells, featureOptions] = await Promise.all([
    loadClassesForSystem(systemId),
    loadSpeciesForSystem(systemId),
    loadBackgroundsForSystem(systemId),
    loadFeatsForSystem(systemId),
    loadSpellsForSystem(systemId),
    loadFeatureOptionsForSystem(systemId),
  ]);

  const featureOptionsByKey = new Map(
    featureOptions.map((option) => [featureOptionKey(option.group, option.id), option])
  );

  return {
    classes,
    classIds: toIdSet(classes),
    speciesIds: toIdSet(species),
    backgroundIds: toIdSet(backgrounds),
    featIds: toIdSet(feats),
    spellIds: toIdSet(spells),
    featureOptionKeys: new Set(featureOptionsByKey.keys()),
    featureOptionsByKey,
  };
}

function validateCharacterLevel(
  issues: ValidationIssue[],
  context: ValidationContext,
  level: number
) {
  if (!isIntegerInRange(level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
    addIssue(issues, context, {
      code: 'dnd5e-invalid-level',
      severity: 'error',
      path: 'system.level',
      message: 'Character level must be an integer from 1 through 20.',
      recoverable: true,
      details: { value: level },
    });
  }
}

function validateClassLevels(
  issues: ValidationIssue[],
  context: ValidationContext,
  classLevels: ClassLevel[],
  characterLevel: number,
  classes: CharacterClass[]
) {
  const classesById = new Map(
    classes.map((classDefinition) => [classDefinition.id, classDefinition])
  );
  const classIds = new Set(classesById.keys());

  if (!Array.isArray(classLevels) || classLevels.length === 0) {
    addIssue(issues, context, {
      code: 'dnd5e-no-class-levels',
      severity: 'warning',
      path: 'system.classLevels',
      message: 'No class levels are selected yet.',
      recoverable: true,
    });
    return;
  }

  let totalClassLevel = 0;
  const seenClassIds = new Set<string>();

  classLevels.forEach((classLevel, index) => {
    const path = `system.classLevels.${index}`;

    if (!classIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'dnd5e-unknown-class',
        severity: 'error',
        path: `${path}.classId`,
        message: `Class '${classLevel.classId}' is not in the loader-backed class catalog.`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }

    if (seenClassIds.has(classLevel.classId)) {
      addIssue(issues, context, {
        code: 'dnd5e-duplicate-class',
        severity: 'warning',
        path: `${path}.classId`,
        message: `Class '${classLevel.classId}' appears more than once.`,
        recoverable: true,
        details: { classId: classLevel.classId },
      });
    }
    seenClassIds.add(classLevel.classId);

    if (!isIntegerInRange(classLevel.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
      addIssue(issues, context, {
        code: 'dnd5e-invalid-class-level',
        severity: 'error',
        path: `${path}.level`,
        message: 'Class level must be an integer from 1 through 20.',
        recoverable: true,
        details: { value: classLevel.level },
      });
    } else {
      totalClassLevel += classLevel.level;
    }

    validateHitDieRolls(issues, context, classLevel, path);
    validateSubclass(issues, context, classLevel, classesById.get(classLevel.classId), path);
  });

  if (
    isIntegerInRange(characterLevel, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL) &&
    totalClassLevel !== characterLevel
  ) {
    addIssue(issues, context, {
      code: 'dnd5e-class-total-mismatch',
      severity: 'warning',
      path: 'system.classLevels',
      message: `Class levels total ${totalClassLevel}, but character level is ${characterLevel}.`,
      recoverable: true,
      details: { totalClassLevel, characterLevel },
    });
  }
}

function validateHitDieRolls(
  issues: ValidationIssue[],
  context: ValidationContext,
  classLevel: ClassLevel,
  path: string
) {
  if (!Array.isArray(classLevel.hitDieRolls)) {
    addIssue(issues, context, {
      code: 'dnd5e-invalid-hit-die-rolls',
      severity: 'error',
      path: `${path}.hitDieRolls`,
      message: 'Hit die rolls must be stored as an array.',
      recoverable: true,
    });
    return;
  }

  if (
    isIntegerInRange(classLevel.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL) &&
    classLevel.hitDieRolls.length > classLevel.level
  ) {
    addIssue(issues, context, {
      code: 'dnd5e-hit-die-roll-count-mismatch',
      severity: 'warning',
      path: `${path}.hitDieRolls`,
      message: 'Hit die rolls should not outnumber the stored class level.',
      recoverable: true,
      details: { rollCount: classLevel.hitDieRolls.length, classLevel: classLevel.level },
    });
  }

  classLevel.hitDieRolls.forEach((roll, rollIndex) => {
    if (!Number.isFinite(roll) || roll < 1) {
      addIssue(issues, context, {
        code: 'dnd5e-invalid-hit-die-roll',
        severity: 'warning',
        path: `${path}.hitDieRolls.${rollIndex}`,
        message: 'Hit die rolls should be positive numbers.',
        recoverable: true,
        details: { value: roll },
      });
    }
  });
}

function validateSubclass(
  issues: ValidationIssue[],
  context: ValidationContext,
  classLevel: ClassLevel,
  classDefinition: CharacterClass | undefined,
  path: string
) {
  if (!classLevel.subclassId || !classDefinition) {
    return;
  }

  const subclass = classDefinition.subclasses.find(
    (candidate) => candidate.id === classLevel.subclassId
  );

  if (!subclass) {
    addIssue(issues, context, {
      code: 'dnd5e-unknown-subclass',
      severity: 'error',
      path: `${path}.subclassId`,
      message: `Subclass '${classLevel.subclassId}' is not available for ${classDefinition.name}.`,
      recoverable: true,
      details: { classId: classLevel.classId, subclassId: classLevel.subclassId },
    });
    return;
  }

  if (classLevel.level < classDefinition.subclassLevel) {
    addIssue(issues, context, {
      code: 'dnd5e-subclass-before-level',
      severity: 'warning',
      path: `${path}.subclassId`,
      message: `${subclass.name} is selected before ${classDefinition.name} reaches subclass level ${classDefinition.subclassLevel}.`,
      recoverable: true,
      details: {
        classId: classLevel.classId,
        subclassId: classLevel.subclassId,
        classLevel: classLevel.level,
        subclassLevel: classDefinition.subclassLevel,
      },
    });
  }
}

function validateCharacterOptions(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Dnd5eValidationDataModel,
  validationData: Dnd5eValidationData
) {
  if (system.speciesId && !validationData.speciesIds.has(system.speciesId)) {
    addIssue(issues, context, {
      code: 'dnd5e-unknown-species',
      severity: 'error',
      path: 'system.speciesId',
      message: `Species '${system.speciesId}' is not in the loader-backed species catalog.`,
      recoverable: true,
      details: { speciesId: system.speciesId },
    });
  }

  if (system.backgroundId && !validationData.backgroundIds.has(system.backgroundId)) {
    addIssue(issues, context, {
      code: 'dnd5e-unknown-background',
      severity: 'error',
      path: 'system.backgroundId',
      message: `Background '${system.backgroundId}' is not in the loader-backed backgrounds catalog.`,
      recoverable: true,
      details: { backgroundId: system.backgroundId },
    });
  }

  validateFeats(issues, context, system.feats, validationData.featIds);
  validateFeatureOptions(issues, context, system, validationData);
}

function validateFeats(
  issues: ValidationIssue[],
  context: ValidationContext,
  feats: Feat[],
  featIds: Set<string>
) {
  feats.forEach((feat, index) => {
    if (!featIds.has(feat.id)) {
      addIssue(issues, context, {
        code: 'dnd5e-unknown-feat',
        severity: 'error',
        path: `system.feats.${index}.id`,
        message: `Feat '${feat.id}' is not in the loader-backed feat catalog.`,
        recoverable: true,
        details: { featId: feat.id },
      });
    }
  });
}

function validateFeatureOptions(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: Dnd5eValidationDataModel,
  validationData: Dnd5eValidationData
) {
  const selections = system.featureOptionSelections ?? [];

  if (selections.length > 0 && validationData.featureOptionKeys.size === 0) {
    addIssue(issues, context, {
      code: 'dnd5e-feature-options-unsupported',
      severity: 'warning',
      path: 'system.featureOptionSelections',
      message: 'Feature-option selections are not loader-backed for this edition.',
      recoverable: true,
      details: { selectionCount: selections.length },
    });
    return;
  }

  const classLevelById = new Map(
    system.classLevels.map((classLevel) => [classLevel.classId, classLevel])
  );

  selections.forEach((selection, index) => {
    const key = featureOptionKey(selection.group, selection.id);
    const option = validationData.featureOptionsByKey.get(key);
    const path = `system.featureOptionSelections.${index}`;

    if (!option) {
      addIssue(issues, context, {
        code: 'dnd5e-unknown-feature-option',
        severity: 'error',
        path: `${path}.id`,
        message: `Feature option '${key}' is not in the loader-backed option catalog.`,
        recoverable: true,
        details: { group: selection.group, id: selection.id },
      });
      return;
    }

    const selectedClassLevel = option.classIds
      .map((classId) => classLevelById.get(classId))
      .find((classLevel): classLevel is ClassLevel => Boolean(classLevel));

    if (!selectedClassLevel) {
      addIssue(issues, context, {
        code: 'dnd5e-feature-option-class-mismatch',
        severity: 'warning',
        path: `${path}.id`,
        message: `${option.name} is selected, but none of its classes are present on the character.`,
        recoverable: true,
        details: { optionClassIds: option.classIds },
      });
      return;
    }

    if (option.minLevel && selectedClassLevel.level < option.minLevel) {
      addIssue(issues, context, {
        code: 'dnd5e-feature-option-before-level',
        severity: 'warning',
        path: `${path}.id`,
        message: `${option.name} requires level ${option.minLevel} in an eligible class.`,
        recoverable: true,
        details: {
          classId: selectedClassLevel.classId,
          classLevel: selectedClassLevel.level,
          minLevel: option.minLevel,
        },
      });
    }
  });
}

function validateAbilityScores(
  issues: ValidationIssue[],
  context: ValidationContext,
  baseAttributes: Record<string, number>
) {
  ABILITY_SCORE_IDS.forEach((abilityId) => {
    const value = baseAttributes[abilityId];

    if (!isIntegerInRange(value, 1, 30)) {
      addIssue(issues, context, {
        code: 'dnd5e-invalid-ability-score',
        severity: 'error',
        path: `system.baseAttributes.${abilityId}`,
        message: `${abilityId.toUpperCase()} must be an integer from 1 through 30.`,
        recoverable: true,
        details: { abilityId, value },
      });
    }
  });
}

function validateSpellcasting(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellcasting: SpellcastingInfo | undefined,
  classLevels: ClassLevel[],
  validationData: Dnd5eValidationData
) {
  if (!spellcasting) {
    return;
  }

  const selectedClassIds = new Set(classLevels.map((classLevel) => classLevel.classId));
  const spellcastingClassIds = new Set(
    validationData.classes
      .filter((classDefinition) => Boolean(classDefinition.spellcasting))
      .map((classDefinition) => classDefinition.id)
  );

  spellcasting.classes.forEach((spellcastingClass, index) => {
    if (!selectedClassIds.has(spellcastingClass.classId)) {
      addIssue(issues, context, {
        code: 'dnd5e-spellcasting-class-not-selected',
        severity: 'warning',
        path: `system.spellcasting.classes.${index}.classId`,
        message: `Spellcasting class '${spellcastingClass.classId}' is not selected in class levels.`,
        recoverable: true,
        details: { classId: spellcastingClass.classId },
      });
    }

    if (!spellcastingClassIds.has(spellcastingClass.classId)) {
      addIssue(issues, context, {
        code: 'dnd5e-non-spellcasting-class',
        severity: 'warning',
        path: `system.spellcasting.classes.${index}.classId`,
        message: `Class '${spellcastingClass.classId}' is not marked as a spellcasting class in loaded data.`,
        recoverable: true,
        details: { classId: spellcastingClass.classId },
      });
    }

    if (
      spellcastingClass.spellcastingLevel < 0 ||
      !Number.isFinite(spellcastingClass.spellcastingLevel)
    ) {
      addIssue(issues, context, {
        code: 'dnd5e-invalid-spellcasting-level',
        severity: 'error',
        path: `system.spellcasting.classes.${index}.spellcastingLevel`,
        message: 'Spellcasting level must be a non-negative number.',
        recoverable: true,
        details: { value: spellcastingClass.spellcastingLevel },
      });
    }
  });

  validateSpellIds(
    issues,
    context,
    spellcasting.spellsKnown,
    validationData.spellIds,
    'system.spellcasting.spellsKnown'
  );
  validateSpellIds(
    issues,
    context,
    spellcasting.spellsPrepared,
    validationData.spellIds,
    'system.spellcasting.spellsPrepared'
  );
  validateSpellIds(
    issues,
    context,
    spellcasting.alwaysPreparedSpellIds ?? [],
    validationData.spellIds,
    'system.spellcasting.alwaysPreparedSpellIds'
  );

  validatePreparedSpellTracking(issues, context, spellcasting);
  validateSpellSlots(issues, context, spellcasting.spellSlots);
}

function validatePreparedSpellTracking(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellcasting: SpellcastingInfo
) {
  const trackedSpellIds = new Set([
    ...spellcasting.spellsKnown,
    ...(spellcasting.alwaysPreparedSpellIds ?? []),
  ]);

  spellcasting.spellsPrepared.forEach((spellId, index) => {
    if (!trackedSpellIds.has(spellId)) {
      addIssue(issues, context, {
        code: 'dnd5e-prepared-spell-not-tracked',
        severity: 'warning',
        path: `system.spellcasting.spellsPrepared.${index}`,
        message: `Prepared spell '${spellId}' is not tracked as known or always-prepared.`,
        recoverable: true,
        details: { spellId },
      });
    }
  });
}

function validateSpellIds(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellIds: string[],
  knownSpellIds: Set<string>,
  path: string
) {
  spellIds.forEach((spellId, index) => {
    if (!knownSpellIds.has(spellId)) {
      addIssue(issues, context, {
        code: 'dnd5e-unknown-spell',
        severity: 'error',
        path: `${path}.${index}`,
        message: `Spell '${spellId}' is not in the loader-backed spell catalog.`,
        recoverable: true,
        details: { spellId },
      });
    }
  });
}

function validateSpellSlots(
  issues: ValidationIssue[],
  context: ValidationContext,
  spellSlots: SpellSlots
) {
  SPELL_SLOT_LEVELS.forEach((slotLevel) => {
    const slot = spellSlots[slotLevel];
    const path = `system.spellcasting.spellSlots.${slotLevel}`;

    if (!slot || !Number.isFinite(slot.max) || !Number.isFinite(slot.used)) {
      addIssue(issues, context, {
        code: 'dnd5e-invalid-spell-slot',
        severity: 'error',
        path,
        message: `Spell slot level ${slotLevel} must have numeric max and used values.`,
        recoverable: true,
      });
      return;
    }

    if (slot.max < 0 || slot.used < 0 || slot.used > slot.max) {
      addIssue(issues, context, {
        code: 'dnd5e-invalid-spell-slot',
        severity: 'error',
        path,
        message: `Spell slot level ${slotLevel} must be non-negative and used cannot exceed max.`,
        recoverable: true,
        details: { slotLevel, ...slot },
      });
    }
  });
}

function toIdSet(items: Array<{ id: string }>): Set<string> {
  return new Set(items.map((item) => item.id));
}

function featureOptionKey(group: string, id: string): string {
  return `${group}:${id}`;
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
