import type {
  CharacterClass,
  D20SpellcastingAdvancement,
  D20SpellcastingAdvancementTrack,
} from '../types/character-options/classes';
import type { GameSystemId } from '../types/game-systems';
import { pf1eClassSpellSlotTables } from '../data/pathfinder/1e/classSpellSlotTables';
import { getSpellSlotsAtClassLevel } from './classSpellcasting';

type D20LegacySpellSlotTable = Record<number, number[]>;

export type D20LegacyClassLevel = {
  classId: string;
  level: number;
  spellcastingSelections?: string[];
};

export interface D20LegacySpellcastingOption {
  classId: string;
  className: string;
}

const D20_SPELLCASTING_KIND_OVERRIDES: Partial<
  Record<GameSystemId, Record<string, 'arcane' | 'divine'>>
> = {
  'dnd-3.5e': {
    ranger: 'divine',
    paladin: 'divine',
    'assassin-35e': 'arcane',
    'blackguard-35e': 'divine',
  },
  pf1e: {
    ranger: 'divine',
    paladin: 'divine',
  },
};

function inferKindFromSpellListId(spellListId?: string): 'arcane' | 'divine' | undefined {
  if (!spellListId) return undefined;

  if (
    spellListId.includes('wizard') ||
    spellListId.includes('sorcerer') ||
    spellListId.includes('bard') ||
    spellListId.includes('assassin') ||
    spellListId.includes('arcane')
  ) {
    return 'arcane';
  }

  if (
    spellListId.includes('cleric') ||
    spellListId.includes('druid') ||
    spellListId.includes('paladin') ||
    spellListId.includes('ranger') ||
    spellListId.includes('blackguard') ||
    spellListId.includes('divine')
  ) {
    return 'divine';
  }

  return undefined;
}

export function getD20LegacySpellcastingAdvancement(
  classData?: CharacterClass
): D20SpellcastingAdvancement | undefined {
  return classData?.d20SpellcastingAdvancement;
}

export function getD20LegacySpellSlotTable(
  systemId: GameSystemId,
  classData?: CharacterClass
): D20LegacySpellSlotTable | undefined {
  if (!classData) {
    return undefined;
  }

  if (classData.spellcasting?.spellSlots) {
    return classData.spellcasting.spellSlots as unknown as D20LegacySpellSlotTable;
  }

  if (systemId === 'pf1e' || systemId === 'dnd-3.5e') {
    return pf1eClassSpellSlotTables[classData.id] as unknown as D20LegacySpellSlotTable | undefined;
  }

  return undefined;
}

export function isD20LegacySpellcastingClass(
  systemId: GameSystemId,
  classData?: CharacterClass
): boolean {
  return Boolean(getD20LegacySpellSlotTable(systemId, classData));
}

export function getD20LegacySpellcastingKind(
  systemId: GameSystemId,
  classData?: CharacterClass
): 'arcane' | 'divine' | undefined {
  if (!classData) {
    return undefined;
  }

  const override = D20_SPELLCASTING_KIND_OVERRIDES[systemId]?.[classData.id];
  if (override) {
    return override;
  }

  const tags = classData.displayMetadata?.tags ?? [];
  if (tags.includes('arcane')) {
    return 'arcane';
  }
  if (tags.includes('divine') || tags.includes('primal')) {
    return 'divine';
  }

  return inferKindFromSpellListId(classData.spellcasting?.spellListId);
}

function countAdvancementLevels(level: number, track: D20SpellcastingAdvancementTrack): number {
  return track.advancementLevels.filter((entry) => entry <= level).length;
}

export function getEligibleD20LegacySpellcastingTargets(params: {
  systemId: GameSystemId;
  classLevels: D20LegacyClassLevel[];
  classCatalog: Map<string, CharacterClass>;
  rowIndex: number;
  track: D20SpellcastingAdvancementTrack;
  excludedClassIds?: string[];
}): D20LegacySpellcastingOption[] {
  const { systemId, classLevels, classCatalog, rowIndex, track, excludedClassIds = [] } = params;
  const excluded = new Set(excludedClassIds.filter(Boolean));

  return classLevels
    .slice(0, rowIndex)
    .map((classLevel) => {
      const classData = classCatalog.get(classLevel.classId);
      if (!isD20LegacySpellcastingClass(systemId, classData)) {
        return null;
      }

      const kind = getD20LegacySpellcastingKind(systemId, classData);
      if (track.kind !== 'any' && kind !== track.kind) {
        return null;
      }

      if (track.eligibleClassIds && !track.eligibleClassIds.includes(classLevel.classId)) {
        return null;
      }

      if (excluded.has(classLevel.classId)) {
        return null;
      }

      return {
        classId: classLevel.classId,
        className: classData?.name ?? classLevel.classId,
      };
    })
    .filter((option): option is D20LegacySpellcastingOption => option !== null);
}

export function syncD20LegacySpellcastingSelections(
  systemId: GameSystemId,
  classLevels: D20LegacyClassLevel[],
  classCatalog: Map<string, CharacterClass>
): D20LegacyClassLevel[] {
  return classLevels.map((classLevel, rowIndex) => {
    const classData = classCatalog.get(classLevel.classId);
    const advancement = getD20LegacySpellcastingAdvancement(classData);

    if (!advancement) {
      if (!('spellcastingSelections' in classLevel)) {
        return classLevel;
      }

      const nextClassLevel = { ...classLevel };
      delete nextClassLevel.spellcastingSelections;
      return nextClassLevel;
    }

    const existingSelections = classLevel.spellcastingSelections ?? [];
    const nextSelections: string[] = [];

    advancement.tracks.forEach((track, trackIndex) => {
      const eligibleTargets = getEligibleD20LegacySpellcastingTargets({
        systemId,
        classLevels,
        classCatalog,
        rowIndex,
        track,
        excludedClassIds: nextSelections,
      });
      const existing = existingSelections[trackIndex];
      nextSelections.push(
        eligibleTargets.some((option) => option.classId === existing)
          ? existing
          : (eligibleTargets[0]?.classId ?? '')
      );
    });

    return { ...classLevel, spellcastingSelections: nextSelections };
  });
}

export function buildD20LegacySpellSlotTotals(
  systemId: GameSystemId,
  classLevels: D20LegacyClassLevel[],
  classCatalog: Map<string, CharacterClass>
): Record<number, number> {
  const slotTotals: Record<number, number> = {};
  const baseSpellcastingLevels = new Map<string, number>();
  const spellSlotTables = new Map<string, D20LegacySpellSlotTable>();

  classLevels.forEach((classLevel) => {
    const classData = classCatalog.get(classLevel.classId);
    const spellSlotTable = getD20LegacySpellSlotTable(systemId, classData);
    if (!spellSlotTable) {
      return;
    }

    baseSpellcastingLevels.set(
      classLevel.classId,
      (baseSpellcastingLevels.get(classLevel.classId) ?? 0) + classLevel.level
    );
    spellSlotTables.set(classLevel.classId, spellSlotTable);
  });

  const advancedLevels = new Map<string, number>();
  classLevels.forEach((classLevel) => {
    const classData = classCatalog.get(classLevel.classId);
    const advancement = getD20LegacySpellcastingAdvancement(classData);
    if (!advancement) {
      return;
    }

    advancement.tracks.forEach((track, trackIndex) => {
      const targetClassId = classLevel.spellcastingSelections?.[trackIndex];
      if (!targetClassId || !spellSlotTables.has(targetClassId)) {
        return;
      }

      advancedLevels.set(
        targetClassId,
        (advancedLevels.get(targetClassId) ?? 0) + countAdvancementLevels(classLevel.level, track)
      );
    });
  });

  baseSpellcastingLevels.forEach((baseLevel, classId) => {
    const spellSlotTable = spellSlotTables.get(classId);
    if (!spellSlotTable) {
      return;
    }

    const effectiveLevel = baseLevel + (advancedLevels.get(classId) ?? 0);
    const classSlots = getSpellSlotsAtClassLevel(spellSlotTable, effectiveLevel);
    Object.entries(classSlots).forEach(([spellLevel, total]) => {
      const numericLevel = Number(spellLevel);
      slotTotals[numericLevel] = (slotTotals[numericLevel] ?? 0) + total;
    });
  });

  return slotTotals;
}
