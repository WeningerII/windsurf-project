import { cloneDocument, dedupe, seedHitDieRolls } from './templateShared';
import { CharacterClass } from '../types/character-options/classes';
import { Feature } from '../types/core/character';
import { CharacterDocument } from '../types/core/document';
import { Species } from '../types/character-options/species';
import { abilityMod } from './math';
import { dnd35eClasses } from '../data/dnd/3.5e/classes';
import { dnd35eProductPrestigeClasses } from '../data/dnd/3.5e/prestige-classes';
import { pf1eClasses } from '../data/pathfinder/1e/classes';
import { pf1ePrestigeClasses } from '../data/pathfinder/1e/prestige-classes';
import {
  createDefaultDnd35eData,
  Dnd35eClassLevel,
  Dnd35eDataModel,
} from '../systems/dnd35e/data-model';
import { Pf1eClassLevel, Pf1eDataModel } from '../systems/pf1e/data-model';
import { syncD20LegacySpellcastingSelections } from './d20LegacySpellcasting';
import { GameSystemId } from '../types/game-systems';

type D20LegacyDataModel = Dnd35eDataModel | Pf1eDataModel;
type D20Progression = 'full' | 'three-quarter' | 'half';
type D20SaveProgression = 'good' | 'poor';

type D20ClassProfile = {
  bab: D20Progression;
  fortSave: D20SaveProgression;
  refSave: D20SaveProgression;
  willSave: D20SaveProgression;
};

export type D20LegacyClassTemplateMode = 'upsert' | 'add' | 'replace';

export interface D20LegacyClassTemplateOptions {
  mode?: D20LegacyClassTemplateMode;
  targetClassId?: string;
}

const DND35E_CLASS_PROFILES: Record<string, D20ClassProfile> = {
  barbarian: { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  bard: { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'good' },
  cleric: { bab: 'three-quarter', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  druid: { bab: 'three-quarter', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  fighter: { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  monk: { bab: 'three-quarter', fortSave: 'good', refSave: 'good', willSave: 'good' },
  paladin: { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  ranger: { bab: 'full', fortSave: 'good', refSave: 'good', willSave: 'poor' },
  rogue: { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  sorcerer: { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  wizard: { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  'arcane-archer-35e': { bab: 'full', fortSave: 'good', refSave: 'good', willSave: 'poor' },
  'arcane-trickster-35e': { bab: 'half', fortSave: 'poor', refSave: 'good', willSave: 'good' },
  'archmage-35e': { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  'assassin-35e': { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  'blackguard-35e': { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  'dragon-disciple-35e': {
    bab: 'three-quarter',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'good',
  },
  'duelist-35e': { bab: 'full', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  'eldritch-knight-35e': { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  'hierophant-35e': { bab: 'half', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  'shadowdancer-35e': { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  'horizon-walker-35e': { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  'dwarven-defender-35e': { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  'loremaster-35e': { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  'mystic-theurge-35e': { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  'thaumaturgist-35e': { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
};

const PF1E_CLASS_PROFILES: Record<string, D20ClassProfile> = {
  barbarian: { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  bard: { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'good' },
  cleric: { bab: 'three-quarter', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  druid: { bab: 'three-quarter', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  fighter: { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'poor' },
  monk: { bab: 'three-quarter', fortSave: 'good', refSave: 'good', willSave: 'good' },
  paladin: { bab: 'full', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  ranger: { bab: 'full', fortSave: 'good', refSave: 'good', willSave: 'poor' },
  rogue: { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  sorcerer: { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  wizard: { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  'arcane-archer': { bab: 'full', fortSave: 'good', refSave: 'good', willSave: 'poor' },
  assassin: { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  'dragon-disciple': { bab: 'three-quarter', fortSave: 'good', refSave: 'poor', willSave: 'good' },
  duelist: { bab: 'full', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
  'lore-master': { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  'mystic-theurge': { bab: 'half', fortSave: 'poor', refSave: 'poor', willSave: 'good' },
  shadowdancer: { bab: 'three-quarter', fortSave: 'poor', refSave: 'good', willSave: 'poor' },
};

function isPf1eDocument(
  document: CharacterDocument<D20LegacyDataModel>
): document is CharacterDocument<Pf1eDataModel> {
  return document.systemId === 'pf1e';
}

function isPf1eClassLevel(
  classLevel: Dnd35eClassLevel | Pf1eClassLevel | undefined
): classLevel is Pf1eClassLevel {
  return (
    typeof classLevel === 'object' &&
    classLevel !== null &&
    'favoredClassBonus' in classLevel &&
    typeof classLevel.favoredClassBonus === 'string'
  );
}

function getClassProfile(
  systemId: CharacterDocument<D20LegacyDataModel>['systemId'],
  classId: string
): D20ClassProfile | undefined {
  if (systemId === 'pf1e') {
    return PF1E_CLASS_PROFILES[classId];
  }

  if (systemId === 'dnd-3.5e') {
    return DND35E_CLASS_PROFILES[classId];
  }

  return undefined;
}

function fixedAbilityAdjustments(species: Species): Record<string, number> {
  return species.abilityScoreIncrease.reduce<Record<string, number>>((acc, increase) => {
    if (increase.type !== 'fixed' || !increase.attributes) {
      return acc;
    }

    Object.entries(increase.attributes).forEach(([ability, value]) => {
      acc[ability] = (acc[ability] || 0) + value;
    });

    return acc;
  }, {});
}

function featureSignature(feature: Pick<Feature, 'id' | 'source'>): string {
  return `${feature.id}::${feature.source}`;
}

function featureSourceCandidates(feature: Feature, className: string, level: number): string[] {
  if (feature.source) {
    return [feature.source];
  }

  return [`${className} ${level}`, `${className} Level ${level}`];
}

function collectClassFeatureSignatures(
  classData: CharacterClass,
  predicate: (level: number) => boolean
): Set<string> {
  const signatures = new Set<string>();

  classData.features.forEach((featureGroup) => {
    if (!predicate(featureGroup.level)) {
      return;
    }

    featureGroup.features.forEach((feature) => {
      featureSourceCandidates(feature, classData.name, featureGroup.level).forEach((source) => {
        signatures.add(`${feature.id}::${source}`);
      });
    });
  });

  return signatures;
}

function classFeaturesUpToLevel(classData: CharacterClass, level: number): Feature[] {
  return classData.features.flatMap((featureGroup) =>
    featureGroup.level <= level
      ? featureGroup.features.map((feature) => ({
          id: feature.id,
          name: feature.name,
          source: feature.source || `${classData.name} ${featureGroup.level}`,
          description: feature.description,
          uses: feature.uses ? { ...feature.uses } : undefined,
        }))
      : []
  );
}

function raceFeatures(speciesData: Species): Feature[] {
  return speciesData.traits.map((trait) => ({
    id: trait.id,
    name: trait.name,
    source: trait.source || speciesData.name,
    description: trait.description,
    uses: trait.uses ? { ...trait.uses } : undefined,
  }));
}

function applyAbilityAdjustments(
  attributes: Record<string, number>,
  adjustments: Record<string, number>,
  multiplier: 1 | -1
): void {
  Object.entries(adjustments).forEach(([ability, value]) => {
    attributes[ability] = (attributes[ability] || 10) + value * multiplier;
  });
}

function syncHitPoints(sys: D20LegacyDataModel, wasAtFullHp: boolean): void {
  if (sys.classLevels.length === 0) {
    return;
  }

  const conModifier = abilityMod(sys.baseAttributes.con ?? 10);
  let maxHitPoints = 0;

  sys.classLevels.forEach((classLevel) => {
    classLevel.hitDieRolls.forEach((roll) => {
      maxHitPoints += Math.max(1, roll + conModifier);
    });

    if ('favoredClassBonus' in classLevel && classLevel.favoredClassBonus === 'hp') {
      maxHitPoints += classLevel.level;
    }
  });

  maxHitPoints = Math.max(maxHitPoints, 1);
  sys.hitPoints.max = maxHitPoints;
  sys.hitPoints.current = wasAtFullHp
    ? maxHitPoints
    : Math.min(sys.hitPoints.current, maxHitPoints);
}

function syncPf1eFavoredClassSkillBonus(sys: D20LegacyDataModel): void {
  if (!('favoredClassSkillBonus' in sys)) {
    return;
  }

  sys.favoredClassSkillBonus = sys.classLevels.reduce((total, classLevel) => {
    if ('favoredClassBonus' in classLevel && classLevel.favoredClassBonus === 'skill') {
      return total + classLevel.level;
    }

    return total;
  }, 0);
}

function classSkillOptions(classData: CharacterClass): string[] {
  return dedupe(classData.skillProficiencies.options);
}

const d20ClassCatalogCache = new Map<string, Map<string, CharacterClass>>();

function getD20ClassCatalog(
  systemId: CharacterDocument<D20LegacyDataModel>['systemId']
): Map<string, CharacterClass> {
  const cached = d20ClassCatalogCache.get(systemId);
  if (cached) {
    return cached;
  }

  const entries =
    systemId === 'pf1e'
      ? [...Object.values(pf1eClasses), ...pf1ePrestigeClasses]
      : [...dnd35eClasses, ...dnd35eProductPrestigeClasses];
  const map = new Map(entries.map((classData) => [classData.id, classData]));
  d20ClassCatalogCache.set(systemId, map);
  return map;
}

function buildClassSkills(
  classLevels: D20LegacyDataModel['classLevels'],
  classCatalog: Map<string, CharacterClass>
): string[] {
  return dedupe(
    classLevels.flatMap((classLevel) => {
      const classData = classCatalog.get(classLevel.classId);
      return classData ? classSkillOptions(classData) : [];
    })
  );
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

    collectClassFeatureSignatures(classData, () => true).forEach((signature) => {
      removableSignatures.add(signature);
    });
  });

  return features.filter((feature) => !removableSignatures.has(featureSignature(feature)));
}

function defaultClassProfile(
  systemId: CharacterDocument<D20LegacyDataModel>['systemId'],
  classId: string
): D20ClassProfile {
  return (
    getClassProfile(systemId, classId) || {
      bab: 'half',
      fortSave: 'poor',
      refSave: 'poor',
      willSave: 'poor',
    }
  );
}

function create35eClassLevel(
  classData: CharacterClass,
  level: number,
  existing?: Dnd35eClassLevel
): Dnd35eClassLevel {
  const profile = defaultClassProfile('dnd-3.5e', classData.id);

  return {
    classId: classData.id,
    level,
    hitDieRolls: seedHitDieRolls(existing?.hitDieRolls || [], classData.hitDie, level),
    spellcastingSelections: existing?.spellcastingSelections,
    bab: profile.bab,
    fortSave: profile.fortSave,
    refSave: profile.refSave,
    willSave: profile.willSave,
    skillPointsPerLevel: classData.skillProficiencies.count,
  };
}

function createPf1eClassLevel(
  classData: CharacterClass,
  level: number,
  existing?: Pf1eClassLevel
): Pf1eClassLevel {
  const profile = defaultClassProfile('pf1e', classData.id);

  return {
    classId: classData.id,
    level,
    hitDieRolls: seedHitDieRolls(existing?.hitDieRolls || [], classData.hitDie, level),
    spellcastingSelections: existing?.spellcastingSelections,
    bab: profile.bab,
    fortSave: profile.fortSave,
    refSave: profile.refSave,
    willSave: profile.willSave,
    skillPointsPerLevel: classData.skillProficiencies.count,
    favoredClassBonus: existing?.favoredClassBonus || 'hp',
  };
}

function createD20ClassLevel(
  document: CharacterDocument<D20LegacyDataModel>,
  classData: CharacterClass,
  level: number,
  existing?: Dnd35eClassLevel | Pf1eClassLevel
): Dnd35eClassLevel | Pf1eClassLevel {
  if (isPf1eDocument(document)) {
    return createPf1eClassLevel(
      classData,
      level,
      isPf1eClassLevel(existing) ? existing : undefined
    );
  }

  return create35eClassLevel(classData, level, existing as Dnd35eClassLevel | undefined);
}

function syncClassState<T extends D20LegacyDataModel>(
  document: CharacterDocument<T>,
  previousClassLevels: D20LegacyDataModel['classLevels'],
  wasAtFullHp: boolean
): CharacterDocument<T> {
  const sys = document.system;
  const classCatalog = getD20ClassCatalog(document.systemId);
  const previousClassIds = new Set(previousClassLevels.map((classLevel) => classLevel.classId));

  sys.classSkills = buildClassSkills(sys.classLevels, classCatalog);
  sys.features = removeClassFeatures(sys.features || [], previousClassIds, classCatalog);

  const existingFeatureSignatures = new Set(
    sys.features.map((feature) => featureSignature(feature))
  );
  sys.classLevels.forEach((classLevel) => {
    const classData = classCatalog.get(classLevel.classId);
    if (!classData) {
      return;
    }

    classFeaturesUpToLevel(classData, classLevel.level).forEach((feature) => {
      const signature = featureSignature(feature);
      if (existingFeatureSignatures.has(signature)) {
        return;
      }

      existingFeatureSignatures.add(signature);
      sys.features.push(feature);
    });
  });

  sys.level =
    sys.classLevels.length > 0
      ? sys.classLevels.reduce((total, classLevel) => total + classLevel.level, 0)
      : 1;

  syncPf1eFavoredClassSkillBonus(sys);
  syncHitPoints(sys, wasAtFullHp);

  return document;
}

export function applyD20LegacyClassTemplate(
  document: CharacterDocument<Dnd35eDataModel>,
  classData: CharacterClass,
  level?: number,
  options?: D20LegacyClassTemplateOptions
): CharacterDocument<Dnd35eDataModel>;
export function applyD20LegacyClassTemplate(
  document: CharacterDocument<Pf1eDataModel>,
  classData: CharacterClass,
  level?: number,
  options?: D20LegacyClassTemplateOptions
): CharacterDocument<Pf1eDataModel>;
export function applyD20LegacyClassTemplate<T extends D20LegacyDataModel>(
  document: CharacterDocument<T>,
  classData: CharacterClass,
  level: number = 1,
  options: D20LegacyClassTemplateOptions = {}
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const classCatalog = getD20ClassCatalog(document.systemId);
  const previousClassLevels = structuredClone(sys.classLevels || []);
  const wasAtFullHp = sys.hitPoints.current >= sys.hitPoints.max;
  const nextClassLevels: Array<Dnd35eClassLevel | Pf1eClassLevel> = structuredClone(
    sys.classLevels || []
  );
  const mode = options.mode || 'upsert';

  if (!Number.isInteger(level) || level < 1) {
    throw new Error(`Class level must be a positive integer, received ${level}`);
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

    nextClassLevels.push(createD20ClassLevel(nextDocument, classData, level));
  } else if (mode === 'replace') {
    if (targetClassIndex < 0) {
      throw new Error(`Cannot replace missing class entry "${targetClassId}"`);
    }

    if (classData.id !== targetClassId && existingClassIndex >= 0) {
      throw new Error(`${classData.name} is already present in this multiclass build`);
    }

    const existingRow =
      classData.id === targetClassId ? nextClassLevels[targetClassIndex] : undefined;
    nextClassLevels[targetClassIndex] = createD20ClassLevel(
      nextDocument,
      classData,
      level,
      existingRow
    );
  } else if (existingClassIndex >= 0) {
    nextClassLevels[existingClassIndex] = createD20ClassLevel(
      nextDocument,
      classData,
      level,
      nextClassLevels[existingClassIndex]
    );
  } else if (nextClassLevels.length === 1) {
    nextClassLevels[0] = createD20ClassLevel(nextDocument, classData, level);
  } else {
    nextClassLevels.push(createD20ClassLevel(nextDocument, classData, level));
  }

  const uniqueClassIds = new Set(nextClassLevels.map((classLevel) => classLevel.classId));
  if (uniqueClassIds.size !== nextClassLevels.length) {
    throw new Error('Duplicate classes are not allowed in the multiclass template');
  }

  sys.classLevels = nextClassLevels as T['classLevels'];
  sys.classLevels = syncD20LegacySpellcastingSelections(
    document.systemId as GameSystemId,
    sys.classLevels,
    classCatalog
  ) as T['classLevels'];
  return syncClassState(nextDocument, previousClassLevels, wasAtFullHp);
}

export function removeD20LegacyClassTemplate(
  document: CharacterDocument<Dnd35eDataModel>,
  classId: string
): CharacterDocument<Dnd35eDataModel>;
export function removeD20LegacyClassTemplate(
  document: CharacterDocument<Pf1eDataModel>,
  classId: string
): CharacterDocument<Pf1eDataModel>;
export function removeD20LegacyClassTemplate<T extends D20LegacyDataModel>(
  document: CharacterDocument<T>,
  classId: string
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const previousClassLevels = structuredClone(sys.classLevels || []);
  const wasAtFullHp = sys.hitPoints.current >= sys.hitPoints.max;

  if (!sys.classLevels.some((classLevel) => classLevel.classId === classId)) {
    return nextDocument;
  }

  sys.classLevels = sys.classLevels.filter(
    (classLevel) => classLevel.classId !== classId
  ) as T['classLevels'];
  sys.classLevels = syncD20LegacySpellcastingSelections(
    document.systemId as GameSystemId,
    sys.classLevels,
    getD20ClassCatalog(document.systemId)
  ) as T['classLevels'];
  return syncClassState(nextDocument, previousClassLevels, wasAtFullHp);
}

export function applyD20LegacyRaceTemplate(
  document: CharacterDocument<Dnd35eDataModel>,
  speciesData: Species,
  previousSpecies?: Species
): CharacterDocument<Dnd35eDataModel>;
export function applyD20LegacyRaceTemplate(
  document: CharacterDocument<Pf1eDataModel>,
  speciesData: Species,
  previousSpecies?: Species
): CharacterDocument<Pf1eDataModel>;
export function applyD20LegacyRaceTemplate<T extends D20LegacyDataModel>(
  document: CharacterDocument<T>,
  speciesData: Species,
  previousSpecies?: Species
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const wasAtFullHp = sys.hitPoints.current >= sys.hitPoints.max;

  if (previousSpecies && sys.speciesId === previousSpecies.id) {
    applyAbilityAdjustments(sys.baseAttributes, fixedAbilityAdjustments(previousSpecies), -1);
    sys.features = sys.features.filter((feature) => feature.source !== previousSpecies.name);
  }

  sys.speciesId = speciesData.id;
  sys.sizeCategory = speciesData.size as D20LegacyDataModel['sizeCategory'];
  sys.speed = speciesData.speed;

  applyAbilityAdjustments(sys.baseAttributes, fixedAbilityAdjustments(speciesData), 1);
  const existingFeatureSignatures = new Set(
    sys.features.map((feature) => featureSignature(feature))
  );
  raceFeatures(speciesData).forEach((feature) => {
    const signature = featureSignature(feature);
    if (!existingFeatureSignatures.has(signature)) {
      sys.features.push(feature);
      existingFeatureSignatures.add(signature);
    }
  });
  syncHitPoints(sys, wasAtFullHp);

  return nextDocument;
}

export const createDefaultD20LegacyData = createDefaultDnd35eData;
