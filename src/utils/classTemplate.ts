import { dnd5eClasses } from '../data/dnd/5e-2014/classes';
import { dnd5e2024Classes } from '../data/dnd/5e-2024/classes';
import {
  CharacterClass,
  ClassFeatureProgression,
  Subclass,
} from '../types/character-options/classes';
import { Feature, SpellSlots } from '../types/core/character';
import { Prerequisite } from '../types/core/common';
import { CharacterDocument } from '../types/core/document';
import { Dnd5e2024DataModel } from '../systems/dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../systems/dnd5e/data-model';
import { getDnd5eAlwaysPreparedSpellIds } from '../systems/dnd5e/shared/spellPreparation';
import { Choice } from '../types/core/common';
import { expandDnd5eToolChoiceValue, formatDnd5eToolLabel } from './dnd5eToolChoices';

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

type DerivedClassProficiencies = {
  armor: string[];
  weapons: string[];
  tools: string[];
  savingThrows: string[];
};

export type Dnd5eClassChoiceSlot = {
  label: string;
  options: string[];
};

type DerivedFeatAutomation = {
  abilityScores: Record<string, number>;
  armor: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
  savingThrows: string[];
};

export type Dnd5eClassTemplateMode = 'upsert' | 'add' | 'replace';

export interface Dnd5eClassTemplateOptions {
  mode?: Dnd5eClassTemplateMode;
  targetClassId?: string;
  enforceMulticlassRequirements?: boolean;
  skillSelections?: string[];
  toolSelections?: string[];
}

const ATTRIBUTE_NAME_TO_ID: Record<string, string> = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
};

function cloneDocument<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  return structuredClone(document);
}

function emptyDerivedFeatAutomation(): DerivedFeatAutomation {
  return {
    abilityScores: {},
    armor: [],
    weapons: [],
    tools: [],
    languages: [],
    savingThrows: [],
  };
}

function createEmptySpellSlots(): SpellSlots {
  return {
    1: { max: 0, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  };
}

function hitDieFaces(hitDie: string): number {
  return Number.parseInt(hitDie.replace('d', ''), 10);
}

function averageHitDieRoll(hitDie: string): number {
  return Math.floor(hitDieFaces(hitDie) / 2) + 1;
}

function seedHitDieRolls(existingRolls: number[], hitDie: string, level: number): number[] {
  const maxAtLevelOne = hitDieFaces(hitDie);
  const averagePerLevel = averageHitDieRoll(hitDie);
  const rolls: number[] = [];

  for (let index = 0; index < level; index += 1) {
    const existing = existingRolls[index];
    if (typeof existing === 'number' && Number.isFinite(existing) && existing > 0) {
      rolls.push(existing);
      continue;
    }

    rolls.push(index === 0 ? maxAtLevelOne : averagePerLevel);
  }

  return rolls;
}

function featureSignature(feature: Pick<Feature, 'id' | 'source'>): string {
  return `${feature.id}::${feature.source}`;
}

function featureSourceCandidates(feature: Feature, sourceName: string, level: number): string[] {
  if (feature.source) {
    return [feature.source];
  }

  return [`${sourceName} ${level}`, `${sourceName} Level ${level}`];
}

function collectFeatureSignatures(
  progression: ClassFeatureProgression[],
  sourceName: string,
  predicate: (level: number) => boolean
): Set<string> {
  const signatures = new Set<string>();

  progression.forEach((levelFeatures) => {
    if (!predicate(levelFeatures.level)) {
      return;
    }

    levelFeatures.features.forEach((feature) => {
      featureSourceCandidates(feature, sourceName, levelFeatures.level).forEach((source) => {
        signatures.add(`${feature.id}::${source}`);
      });
    });
  });

  return signatures;
}

function get5eClassCatalog(systemId: string): Map<string, CharacterClass> {
  const catalog = systemId === 'dnd-5e-2024' ? dnd5e2024Classes : dnd5eClasses;
  return new Map(catalog.map((classData) => [classData.id, classData]));
}

function emptyDerivedProficiencies(): DerivedClassProficiencies {
  return {
    armor: [],
    weapons: [],
    tools: [],
    savingThrows: [],
  };
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function removeValues(current: string[] | undefined, removed: string[]): string[] {
  return (current || []).filter((value) => !removed.includes(value));
}

function mergeDerivedList(
  current: string[],
  previousDerived: string[],
  nextDerived: string[]
): string[] {
  return dedupe([...current.filter((value) => !previousDerived.includes(value)), ...nextDerived]);
}

function buildChoiceSlots(
  choice: Choice<string>,
  optionResolver?: (value: string) => string[] | null
): Dnd5eClassChoiceSlot[] {
  const options = dedupe(choice.options.flatMap((option) => optionResolver?.(option) || [option]));

  if (options.length <= choice.count) {
    return [];
  }

  return Array.from({ length: choice.count }, (_, index) => ({
    label: choice.count > 1 ? `${choice.label} ${index + 1}` : choice.label,
    options,
  }));
}

function fixedChoiceValues(
  choice: Choice<string>,
  optionResolver?: (value: string) => string[] | null
): string[] {
  const options = dedupe(choice.options.flatMap((option) => optionResolver?.(option) || [option]));

  return options.length <= choice.count ? options : [];
}

export function getDnd5eClassSkillChoiceSlots(classData: CharacterClass): Dnd5eClassChoiceSlot[] {
  return buildChoiceSlots(classData.skillProficiencies);
}

export function getDnd5eClassToolChoiceSlots(classData: CharacterClass): Dnd5eClassChoiceSlot[] {
  return classData.toolProficiencies.flatMap((choice) =>
    buildChoiceSlots(choice, expandDnd5eToolChoiceValue)
  );
}

export function formatDnd5eClassToolChoiceLabel(toolId: string): string {
  return formatDnd5eToolLabel(toolId);
}

function fixedSkillProficiencies(classData: CharacterClass): string[] {
  return fixedChoiceValues(classData.skillProficiencies);
}

function fixedToolProficiencies(classData: CharacterClass): string[] {
  return classData.toolProficiencies.flatMap((choice) =>
    fixedChoiceValues(choice, expandDnd5eToolChoiceValue)
  );
}

function sanitizeSelectionsForSlots(
  slots: Dnd5eClassChoiceSlot[],
  rawSelections: string[] | undefined,
  unavailable: string[]
): string[] {
  if (slots.length === 0) {
    return [];
  }

  const blocked = new Set(unavailable);
  const selections: string[] = [];

  slots.forEach((slot, index) => {
    const candidate = rawSelections?.[index] ?? '';
    if (candidate && slot.options.includes(candidate) && !blocked.has(candidate)) {
      selections[index] = candidate;
      blocked.add(candidate);
      return;
    }

    const fallback = slot.options.find((option) => !blocked.has(option));
    selections[index] = fallback || '';
    if (fallback) {
      blocked.add(fallback);
    }
  });

  return selections;
}

function mergeSkillSource(sys: Dnd5eLikeDataModel, skillId: string, source: string): void {
  const existing = sys.skillProficiencies[skillId];

  if (!existing) {
    sys.skillProficiencies[skillId] = {
      level: 'proficient',
      source: [source],
    };
    return;
  }

  sys.skillProficiencies[skillId] = {
    ...existing,
    level:
      existing.level === 'expertise' || existing.level === 'double' ? existing.level : 'proficient',
    source: [...new Set([...(existing.source || []), source])],
  };
}

function removeSkillSource(sys: Dnd5eLikeDataModel, skillId: string, source: string): void {
  const existing = sys.skillProficiencies[skillId];
  if (!existing) {
    return;
  }

  const remainingSources = (existing.source || []).filter((entry) => entry !== source);
  if (remainingSources.length === 0) {
    delete sys.skillProficiencies[skillId];
    return;
  }

  sys.skillProficiencies[skillId] = {
    ...existing,
    source: remainingSources,
  };
}

function buildDerivedProficiencies(
  classLevels: Dnd5eLikeDataModel['classLevels'],
  classCatalog: Map<string, CharacterClass>
): DerivedClassProficiencies {
  const derived = emptyDerivedProficiencies();

  classLevels.forEach((classLevel, index) => {
    const classData = classCatalog.get(classLevel.classId);
    if (!classData) {
      return;
    }

    if (index === 0) {
      derived.savingThrows.push(...classData.savingThrowProficiencies);
      derived.armor.push(...classData.armorProficiencies);
      derived.weapons.push(...classData.weaponProficiencies);
      derived.tools.push(...fixedToolProficiencies(classData));
      return;
    }

    if (!classData.multiclassProficiencies) {
      return;
    }

    derived.armor.push(...classData.multiclassProficiencies.armor);
    derived.weapons.push(...classData.multiclassProficiencies.weapons);
    derived.tools.push(...classData.multiclassProficiencies.tools);
  });

  return {
    armor: dedupe(derived.armor),
    weapons: dedupe(derived.weapons),
    tools: dedupe(derived.tools),
    savingThrows: dedupe(derived.savingThrows),
  };
}

function collectClassAndSubclassFeatureSignatures(
  classData: CharacterClass,
  predicate: (level: number) => boolean
): Set<string> {
  const signatures = collectFeatureSignatures(classData.features, classData.name, predicate);

  classData.subclasses.forEach((subclass) => {
    collectFeatureSignatures(subclass.features, subclass.name, predicate).forEach((signature) => {
      signatures.add(signature);
    });
  });

  return signatures;
}

function removeClassFeatures(
  features: Feature[],
  classIds: Set<string>,
  classCatalog: Map<string, CharacterClass>
): Feature[] {
  const removableSignatures = new Set<string>();

  classIds.forEach((classId) => {
    const classData = classCatalog.get(classId);
    if (!classData) {
      return;
    }

    collectClassAndSubclassFeatureSignatures(classData, () => true).forEach((signature) => {
      removableSignatures.add(signature);
    });
  });

  return features.filter((feature) => !removableSignatures.has(featureSignature(feature)));
}

function featureListAtLevel(
  progression: ClassFeatureProgression[],
  sourceName: string,
  level: number
): Feature[] {
  const features: Feature[] = [];

  progression.forEach((levelFeatures) => {
    if (levelFeatures.level > level) {
      return;
    }

    levelFeatures.features.forEach((feature) => {
      features.push({
        id: feature.id,
        name: feature.name,
        source: feature.source || `${sourceName} ${levelFeatures.level}`,
        description: feature.description,
        uses: feature.uses ? { ...feature.uses } : undefined,
      });
    });
  });

  return features;
}

function classFeaturesAtLevel(classData: CharacterClass, level: number): Feature[] {
  return featureListAtLevel(classData.features, classData.name, level);
}

function subclassFeaturesAtLevel(subclassData: Subclass, level: number): Feature[] {
  return featureListAtLevel(subclassData.features, subclassData.name, level);
}

function canSelectSubclass(classData: CharacterClass, level: number): boolean {
  return level >= classData.subclassLevel || classData.subclassSelection?.timing === 'creation';
}

function buildSpellcastingState(
  existing: Dnd5eLikeDataModel['spellcasting'],
  classLevels: Dnd5eLikeDataModel['classLevels'],
  classCatalog: Map<string, CharacterClass>
): Dnd5eLikeDataModel['spellcasting'] {
  const classList = [...classCatalog.values()];
  const classes = classLevels.flatMap((classLevel) => {
    const classData = classCatalog.get(classLevel.classId);
    if (!classData?.spellcasting) {
      return [];
    }

    return [
      {
        classId: classLevel.classId,
        ability: classData.spellcasting.ability,
        spellcastingLevel: classLevel.level,
      },
    ];
  });

  if (classes.length === 0) {
    return undefined;
  }

  return {
    classes,
    spellsKnown: existing?.spellsKnown || [],
    spellsPrepared: existing?.spellsPrepared || [],
    alwaysPreparedSpellIds: getDnd5eAlwaysPreparedSpellIds(classLevels, classList),
    spellSlots: existing?.spellSlots || createEmptySpellSlots(),
  };
}

function parseAttributeRequirementGroups(prerequisite: Prerequisite): string[][] {
  if (prerequisite.type !== 'attribute') {
    return [];
  }

  if (typeof prerequisite.ability === 'string' && prerequisite.ability.length > 0) {
    return [[prerequisite.ability]];
  }

  if (
    typeof prerequisite.description !== 'string' ||
    prerequisite.description.trim().length === 0
  ) {
    return [];
  }

  return prerequisite.description
    .toLowerCase()
    .split(/\s+or\s+/)
    .map((group) =>
      Object.entries(ATTRIBUTE_NAME_TO_ID)
        .filter(([name]) => group.includes(name))
        .map(([, abilityId]) => abilityId)
    )
    .filter((group) => group.length > 0);
}

function meetsPrerequisite(
  baseAttributes: Record<string, number>,
  prerequisite: Prerequisite
): boolean {
  if (prerequisite.type !== 'attribute') {
    return true;
  }

  const minimum =
    typeof prerequisite.minValue === 'number'
      ? prerequisite.minValue
      : typeof prerequisite.value === 'number'
        ? prerequisite.value
        : null;

  if (minimum == null) {
    return true;
  }

  const groups = parseAttributeRequirementGroups(prerequisite);
  if (groups.length === 0) {
    return true;
  }

  return groups.some((group) =>
    group.every((abilityId) => (baseAttributes[abilityId] ?? 0) >= minimum)
  );
}

function assertMulticlassRequirements(
  baseAttributes: Record<string, number>,
  classLevels: Dnd5eLikeDataModel['classLevels'],
  classCatalog: Map<string, CharacterClass>
): void {
  const classIds = [...new Set(classLevels.map((classLevel) => classLevel.classId))];
  if (classIds.length <= 1) {
    return;
  }

  const failedClassNames = classIds.flatMap((classId) => {
    const classData = classCatalog.get(classId);
    if (!classData?.multiclassRequirements?.length) {
      return [];
    }

    const meetsAllRequirements = classData.multiclassRequirements.every((prerequisite) =>
      meetsPrerequisite(baseAttributes, prerequisite)
    );
    return meetsAllRequirements ? [] : [classData.name];
  });

  if (failedClassNames.length > 0) {
    throw new Error(`Multiclass prerequisites not met for: ${failedClassNames.join(', ')}`);
  }
}

function createClassLevel(
  classData: CharacterClass,
  level: number,
  existing?: Dnd5eLikeDataModel['classLevels'][number],
  selections?: Pick<Dnd5eClassTemplateOptions, 'skillSelections' | 'toolSelections'>
): Dnd5eLikeDataModel['classLevels'][number] {
  return {
    classId: classData.id,
    subclassId: existing?.subclassId,
    level,
    hitDieRolls: seedHitDieRolls(existing?.hitDieRolls || [], classData.hitDie, level),
    skillSelections: [...(selections?.skillSelections ?? existing?.skillSelections ?? [])],
    toolSelections: [...(selections?.toolSelections ?? existing?.toolSelections ?? [])],
  };
}

function syncClassState<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  previousClassLevels: Dnd5eLikeDataModel['classLevels']
): CharacterDocument<T> {
  const sys = document.system;
  const classCatalog = get5eClassCatalog(document.systemId);
  const previousDerived =
    sys.templateState?.classDerivedProficiencies || emptyDerivedProficiencies();
  const nextDerived = buildDerivedProficiencies(sys.classLevels, classCatalog);
  const previousStartingClassLevel = previousClassLevels[0];
  const previousStartingClassData = previousStartingClassLevel
    ? classCatalog.get(previousStartingClassLevel.classId)
    : undefined;
  const previousClassSkillSource = previousStartingClassData?.name;

  if (previousClassSkillSource) {
    const previousStartingSkills = dedupe([
      ...fixedSkillProficiencies(previousStartingClassData),
      ...(previousStartingClassLevel.skillSelections || []),
    ]);
    previousStartingSkills.forEach((skillId) => {
      removeSkillSource(sys, skillId, previousClassSkillSource);
    });
  }

  if (previousStartingClassLevel?.toolSelections?.length) {
    sys.toolProficiencies = removeValues(
      sys.toolProficiencies || [],
      previousStartingClassLevel.toolSelections
    );
  }

  sys.savingThrowProficiencies = mergeDerivedList(
    sys.savingThrowProficiencies || [],
    previousDerived.savingThrows,
    nextDerived.savingThrows
  );
  sys.armorProficiencies = mergeDerivedList(
    sys.armorProficiencies || [],
    previousDerived.armor,
    nextDerived.armor
  );
  sys.weaponProficiencies = mergeDerivedList(
    sys.weaponProficiencies || [],
    previousDerived.weapons,
    nextDerived.weapons
  );
  sys.toolProficiencies = mergeDerivedList(
    sys.toolProficiencies || [],
    previousDerived.tools,
    nextDerived.tools
  );

  const startingClassLevel = sys.classLevels[0];
  const startingClassData = startingClassLevel
    ? classCatalog.get(startingClassLevel.classId)
    : undefined;

  if (startingClassLevel && startingClassData) {
    const skillSlots = getDnd5eClassSkillChoiceSlots(startingClassData);
    const skillSelections = sanitizeSelectionsForSlots(
      skillSlots,
      startingClassLevel.skillSelections,
      Object.keys(sys.skillProficiencies || {})
    );
    const fixedSkills = fixedSkillProficiencies(startingClassData);
    startingClassLevel.skillSelections = skillSelections;
    dedupe([...fixedSkills, ...skillSelections.filter(Boolean)]).forEach((skillId) => {
      mergeSkillSource(sys, skillId, startingClassData.name);
    });

    const toolSlots = getDnd5eClassToolChoiceSlots(startingClassData);
    const toolSelections = sanitizeSelectionsForSlots(
      toolSlots,
      startingClassLevel.toolSelections,
      sys.toolProficiencies || []
    );
    startingClassLevel.toolSelections = toolSelections;
    sys.toolProficiencies = dedupe([
      ...(sys.toolProficiencies || []),
      ...toolSelections.filter(Boolean),
    ]);
  }

  const relevantClassIds = new Set([
    ...previousClassLevels.map((classLevel) => classLevel.classId),
    ...sys.classLevels.map((classLevel) => classLevel.classId),
  ]);
  sys.features = removeClassFeatures(sys.features || [], relevantClassIds, classCatalog);

  const existingFeatureSignatures = new Set((sys.features || []).map(featureSignature));
  sys.classLevels.forEach((classLevel) => {
    const classData = classCatalog.get(classLevel.classId);
    if (!classData) {
      return;
    }

    classFeaturesAtLevel(classData, classLevel.level).forEach((feature) => {
      const signature = featureSignature(feature);
      if (existingFeatureSignatures.has(signature)) {
        return;
      }

      existingFeatureSignatures.add(signature);
      sys.features.push(feature);
    });

    if (!classLevel.subclassId || !canSelectSubclass(classData, classLevel.level)) {
      return;
    }

    const subclassData = classData.subclasses.find((entry) => entry.id === classLevel.subclassId);
    if (!subclassData) {
      return;
    }

    subclassFeaturesAtLevel(subclassData, classLevel.level).forEach((feature) => {
      const signature = featureSignature(feature);
      if (existingFeatureSignatures.has(signature)) {
        return;
      }

      existingFeatureSignatures.add(signature);
      sys.features.push(feature);
    });
  });

  sys.spellcasting = buildSpellcastingState(sys.spellcasting, sys.classLevels, classCatalog);
  sys.level =
    sys.classLevels.length > 0
      ? sys.classLevels.reduce((total, classLevel) => total + classLevel.level, 0)
      : 1;
  const backgroundDerived = sys.templateState?.backgroundDerived || {
    tools: [],
    languages: [],
  };
  const featDerivedAutomation =
    sys.templateState?.featDerivedAutomation || emptyDerivedFeatAutomation();
  sys.templateState = {
    classDerivedProficiencies: nextDerived,
    backgroundDerived: {
      tools: [...backgroundDerived.tools],
      languages: [...backgroundDerived.languages],
    },
    featDerivedAutomation: {
      abilityScores: { ...featDerivedAutomation.abilityScores },
      armor: [...featDerivedAutomation.armor],
      weapons: [...featDerivedAutomation.weapons],
      tools: [...featDerivedAutomation.tools],
      languages: [...featDerivedAutomation.languages],
      savingThrows: [...featDerivedAutomation.savingThrows],
    },
  };

  if (previousClassLevels.length === 0 && sys.classLevels.length === 1 && sys.level === 1) {
    const firstClassData = classCatalog.get(sys.classLevels[0].classId);
    if (firstClassData) {
      const maxHp = hitDieFaces(firstClassData.hitDie);
      sys.hitPoints.max = maxHp;
      sys.hitPoints.current = maxHp;
    }
  }

  return document;
}

/**
 * Applies a class template to a D&D 5e character document.
 * Supports primary-class replacement, multiclass addition, and targeted row replacement.
 */
export function applyDnd5eClassTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  classData: CharacterClass,
  level: number = 1,
  options: Dnd5eClassTemplateOptions = {}
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const previousClassLevels = structuredClone(sys.classLevels || []);
  const nextClassLevels = structuredClone(sys.classLevels || []);
  const mode = options.mode || 'upsert';

  if (!Number.isInteger(level) || level < 1 || level > 20) {
    throw new Error(`Class level must be between 1 and 20, received ${level}`);
  }

  const existingClassIndex = nextClassLevels.findIndex(
    (classLevel) => classLevel.classId === classData.id
  );
  const targetClassId = options.targetClassId || classData.id;
  const targetClassIndex = nextClassLevels.findIndex(
    (classLevel) => classLevel.classId === targetClassId
  );

  if (mode === 'add') {
    if (existingClassIndex >= 0) {
      throw new Error(`${classData.name} is already present in this multiclass build`);
    }
    nextClassLevels.push(createClassLevel(classData, level, undefined, options));
  } else if (mode === 'replace') {
    if (targetClassIndex < 0) {
      throw new Error(`Cannot replace missing class entry "${targetClassId}"`);
    }
    if (classData.id !== targetClassId && existingClassIndex >= 0) {
      throw new Error(`${classData.name} is already present in this multiclass build`);
    }

    const existingRow =
      classData.id === targetClassId ? nextClassLevels[targetClassIndex] : undefined;
    nextClassLevels[targetClassIndex] = createClassLevel(classData, level, existingRow, options);
  } else if (existingClassIndex >= 0) {
    nextClassLevels[existingClassIndex] = createClassLevel(
      classData,
      level,
      nextClassLevels[existingClassIndex],
      options
    );
  } else if (nextClassLevels.length === 1) {
    nextClassLevels[0] = createClassLevel(classData, level, undefined, options);
  } else {
    nextClassLevels.push(createClassLevel(classData, level, undefined, options));
  }

  const totalLevel = nextClassLevels.reduce((total, classLevel) => total + classLevel.level, 0);
  if (totalLevel > 20) {
    throw new Error(`Total character level cannot exceed 20 (received ${totalLevel})`);
  }

  const uniqueClassIds = new Set(nextClassLevels.map((classLevel) => classLevel.classId));
  if (uniqueClassIds.size !== nextClassLevels.length) {
    throw new Error('Duplicate classes are not allowed in the multiclass template');
  }

  const classCatalog = get5eClassCatalog(document.systemId);
  const classIdentityChanged =
    mode === 'add' ||
    (mode === 'replace' && classData.id !== targetClassId) ||
    (mode === 'upsert' && existingClassIndex < 0 && nextClassLevels.length > 1);

  if (options.enforceMulticlassRequirements !== false && classIdentityChanged) {
    assertMulticlassRequirements(sys.baseAttributes, nextClassLevels, classCatalog);
  }

  sys.classLevels = nextClassLevels;
  return syncClassState(nextDocument, previousClassLevels);
}

export function applyDnd5eSubclassTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  classId: string,
  subclassId?: string
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const previousClassLevels = structuredClone(sys.classLevels || []);
  const classCatalog = get5eClassCatalog(document.systemId);
  const classData = classCatalog.get(classId);

  if (!classData) {
    throw new Error(`Unknown class entry "${classId}" for system ${document.systemId}`);
  }

  const classIndex = sys.classLevels.findIndex((classLevel) => classLevel.classId === classId);
  if (classIndex < 0) {
    throw new Error(`Cannot set subclass for missing class entry "${classId}"`);
  }

  if (!subclassId) {
    sys.classLevels[classIndex] = {
      ...sys.classLevels[classIndex],
      subclassId: undefined,
    };
    return syncClassState(nextDocument, previousClassLevels);
  }

  const subclassData = classData.subclasses.find((entry) => entry.id === subclassId);
  if (!subclassData) {
    throw new Error(`Unknown subclass "${subclassId}" for ${classData.name}`);
  }

  if (!canSelectSubclass(classData, sys.classLevels[classIndex].level)) {
    throw new Error(`${classData.name} subclasses unlock at level ${classData.subclassLevel}`);
  }

  sys.classLevels[classIndex] = {
    ...sys.classLevels[classIndex],
    subclassId: subclassData.id,
  };

  return syncClassState(nextDocument, previousClassLevels);
}

export function removeDnd5eClassTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  classId: string
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const previousClassLevels = structuredClone(sys.classLevels || []);

  if (!sys.classLevels.some((classLevel) => classLevel.classId === classId)) {
    return nextDocument;
  }

  sys.classLevels = sys.classLevels.filter((classLevel) => classLevel.classId !== classId);
  return syncClassState(nextDocument, previousClassLevels);
}
