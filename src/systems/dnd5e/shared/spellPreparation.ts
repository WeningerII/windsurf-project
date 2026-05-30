import type {
  AlwaysPreparedSpellGrant,
  CharacterClass,
  Subclass,
} from '../../../types/character-options/classes';
import type { ClassLevel } from '../../../types/core/character';
import { abilityMod } from '../../../utils/math';

const ABILITY_TOKEN_MAP: Record<string, string> = {
  str: 'str',
  strength: 'str',
  dex: 'dex',
  dexterity: 'dex',
  con: 'con',
  constitution: 'con',
  int: 'int',
  intelligence: 'int',
  wis: 'wis',
  wisdom: 'wis',
  cha: 'cha',
  charisma: 'cha',
};

export interface Dnd5ePreparedCasterSummary {
  classId: string;
  className: string;
  level: number;
  ability: string;
  preparedLimit: number;
}

export interface Dnd5eAlwaysPreparedSpellSource {
  spellId: string;
  source: string;
  minLevel: number;
  countsAgainstPreparedLimit: false;
}

function normalizeAbilityToken(token: string): string | undefined {
  return ABILITY_TOKEN_MAP[token.toLowerCase()];
}

function evaluatePreparedCasterFormula(
  formula: string,
  classLevel: ClassLevel,
  baseAttributes: Record<string, number>
): number | null {
  const expression = formula
    .replace(/\b([a-z]+)_(?:modifier|mod)\b/gi, (match, abilityToken: string) => {
      const abilityId = normalizeAbilityToken(abilityToken);
      if (!abilityId) {
        throw new Error(`Unsupported prepared-caster ability token: ${match}`);
      }

      return String(abilityMod(baseAttributes[abilityId] || 10));
    })
    .replace(/\b(?:[a-z0-9-]+_level|class_level)\b/gi, String(classLevel.level));

  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return null;
  }

  const result = Number(Function(`"use strict"; return (${expression});`)());
  if (!Number.isFinite(result)) {
    return null;
  }

  return Math.max(1, Math.floor(result));
}

export function getDnd5ePreparedCasterSummaries(
  classLevels: ClassLevel[],
  classes: CharacterClass[],
  baseAttributes: Record<string, number>
): Dnd5ePreparedCasterSummary[] {
  return classLevels.flatMap((classLevel) => {
    const classData = classes.find((entry) => entry.id === classLevel.classId);
    const preparedCasterFormula = classData?.spellcasting?.preparedCasterFormula;
    if (!classData?.spellcasting || !preparedCasterFormula) {
      return [];
    }

    const preparedLimit = evaluatePreparedCasterFormula(
      preparedCasterFormula,
      classLevel,
      baseAttributes
    );
    if (preparedLimit == null) {
      return [];
    }

    return [
      {
        classId: classData.id,
        className: classData.name,
        level: classLevel.level,
        ability: classData.spellcasting.ability,
        preparedLimit,
      },
    ];
  });
}

function collectAlwaysPreparedGrantSources(
  grant: AlwaysPreparedSpellGrant,
  characterLevel: number
): Dnd5eAlwaysPreparedSpellSource[] {
  if (characterLevel < grant.minLevel) {
    return [];
  }

  return grant.spellIds.map((spellId) => ({
    spellId,
    source: grant.source,
    minLevel: grant.minLevel,
    countsAgainstPreparedLimit: false,
  }));
}

function collectAlwaysPreparedByLevelSources(
  spellIdsByLevel: Record<number, string[]> | undefined,
  sourceLabel: string,
  characterLevel: number
): Dnd5eAlwaysPreparedSpellSource[] {
  if (!spellIdsByLevel) {
    return [];
  }

  return Object.entries(spellIdsByLevel).flatMap(([level, spellIds]) => {
    const minLevel = Number(level);
    if (characterLevel < minLevel) {
      return [];
    }

    return spellIds.map((spellId) => ({
      spellId,
      source: sourceLabel,
      minLevel,
      countsAgainstPreparedLimit: false as const,
    }));
  });
}

function getMatchingSubclass(
  classLevel: ClassLevel,
  classData: CharacterClass | undefined
): Subclass | undefined {
  if (!classLevel.subclassId || !classData) {
    return undefined;
  }

  return classData.subclasses.find((subclass) => subclass.id === classLevel.subclassId);
}

export function getDnd5eAlwaysPreparedSpellSources(
  classLevels: ClassLevel[],
  classes: CharacterClass[]
): Dnd5eAlwaysPreparedSpellSource[] {
  const classCatalog = new Map(classes.map((entry) => [entry.id, entry]));
  const sources = classLevels.flatMap((classLevel) => {
    const classData = classCatalog.get(classLevel.classId);
    const subclass = getMatchingSubclass(classLevel, classData);

    const classSourceLabel = classData?.alwaysPreparedSpellSourceLabel ?? classData?.name;
    const subclassSourceLabel = subclass?.alwaysPreparedSpellSourceLabel ?? subclass?.name;
    return [
      ...(classData?.alwaysPreparedSpells ?? []).flatMap((grant) =>
        collectAlwaysPreparedGrantSources(grant, classLevel.level)
      ),
      ...collectAlwaysPreparedByLevelSources(
        classData?.alwaysPreparedSpellsByLevel,
        classSourceLabel ?? 'Class Spells',
        classLevel.level
      ),
      ...(subclass?.alwaysPreparedSpells ?? []).flatMap((grant) =>
        collectAlwaysPreparedGrantSources(grant, classLevel.level)
      ),
      ...collectAlwaysPreparedByLevelSources(
        subclass?.alwaysPreparedSpellsByLevel,
        subclassSourceLabel ?? 'Subclass Spells',
        classLevel.level
      ),
    ];
  });

  const deduped = new Map<string, Dnd5eAlwaysPreparedSpellSource>();
  sources.forEach((source) => {
    const key = `${source.spellId}::${source.source}`;
    if (!deduped.has(key)) {
      deduped.set(key, source);
    }
  });
  return [...deduped.values()];
}

export function getDnd5eAlwaysPreparedSpellIds(
  classLevels: ClassLevel[],
  classes: CharacterClass[]
): string[] {
  return [
    ...new Set(
      getDnd5eAlwaysPreparedSpellSources(classLevels, classes).map((entry) => entry.spellId)
    ),
  ];
}
