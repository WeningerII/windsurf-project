import { Spell } from '../../../../types/magic/spells';
import { buildSpellCatalog } from '../../../../utils/spellCatalog';
import { cantrips } from './cantrips';
import { level1Spells } from './level-1';
import { level2Spells } from './level-2';
import { level3Spells } from './level-3';
import { level4Spells } from './level-4';
import { level5Spells } from './level-5';
import { level6Spells } from './level-6';
import { level7Spells } from './level-7';
import { level8Spells } from './level-8';
import { level9Spells } from './level-9';

const rawSpellsByLevel: Record<number, Spell[]> = {
  0: cantrips,
  1: level1Spells,
  2: level2Spells,
  3: level3Spells,
  4: level4Spells,
  5: level5Spells,
  6: level6Spells,
  7: level7Spells,
  8: level8Spells,
  9: level9Spells,
};

const CLASS_SPECIFIC_ID_PATTERN = /-(bard|cleric|druid|paladin|ranger|sorcerer|wizard)-35e$/;

type SpellEntry = {
  spell: Spell;
  level: number;
  sourceOrder: number;
};

const MANUAL_CLASS_STUB_CANONICAL_IDS: Record<string, string> = {
  'fire trap': 'fire-trap-35e',
  'animate dead': 'animate-dead-35e',
  'bestow curse': 'bestow-curse-35e',
  contagion: 'contagion-35e',
  'stone shape': 'stone-shape-35e',
  tongues: 'tongues-35e',
  dismissal: 'dismissal-35e',
  stoneskin: 'stoneskin-35e',
  'wall of fire': 'wall-of-fire-35e',
  'antimagic field': 'antimagic-field-35e',
  repulsion: 'repulsion-35e',
  flare: 'flare-35e',
  'protection from energy': 'protection-from-energy-35e',
  'chain lightning': 'chain-lightning-6-35e',
  'suggestion, mass': 'suggestion-mass-35e',
  'summon monster vii': 'summon-monster-7-35e',
  gate: 'gate-35e',
  shapechange: 'shapechange-35e',
  'true seeing': 'true-seeing-6-35e',
};

function stableFingerprintValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableFingerprintValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, stableFingerprintValue(entryValue)])
    );
  }

  return value;
}

function getStructuredVariantFingerprint(spell: Spell): string {
  const {
    id: _id,
    classes: _classes,
    levelsByClass: _levelsByClass,
    description: _description,
    level: _level,
    components: rawComponents,
    ...rest
  } = spell;
  const { materialDescription: _materialDescription, ...components } = rawComponents;

  return JSON.stringify(stableFingerprintValue({ ...rest, components }));
}

function getNameAndStructureKey(spell: Spell): string {
  return `${spell.name}::${getStructuredVariantFingerprint(spell)}`;
}

function compareCanonicalPreference(left: Spell, right: Spell): number {
  if (left.description.length !== right.description.length) {
    return right.description.length - left.description.length;
  }

  const leftIsGeneric = !CLASS_SPECIFIC_ID_PATTERN.test(left.id);
  const rightIsGeneric = !CLASS_SPECIFIC_ID_PATTERN.test(right.id);
  if (leftIsGeneric !== rightIsGeneric) {
    return leftIsGeneric ? -1 : 1;
  }

  if (left.classes.length !== right.classes.length) {
    return right.classes.length - left.classes.length;
  }

  if (left.id.length !== right.id.length) {
    return left.id.length - right.id.length;
  }

  return left.id.localeCompare(right.id);
}

function getNormalizedSpellName(spell: Spell): string {
  return spell.name.toLowerCase();
}

function getEntriesByCanonicalLevel(entries: SpellEntry[]): Record<number, Spell[]> {
  const byLevel: Record<number, Array<{ spell: Spell; sourceOrder: number }>> = {};

  entries.forEach(({ spell, level, sourceOrder }) => {
    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push({ spell, sourceOrder });
  });

  return Object.fromEntries(
    Object.entries(byLevel).map(([level, levelEntries]) => [
      Number(level),
      [...levelEntries]
        .sort((left, right) => left.sourceOrder - right.sourceOrder)
        .map(({ spell }) => spell),
    ])
  ) as Record<number, Spell[]>;
}

function getClassLevelSpecificity(spell: Spell, className: string, classLevel: number): number {
  if (spell.id.endsWith(`-${className}-35e`)) return 2;
  if (classLevel !== spell.level) return 2;
  if (spell.classes.length === 1 && spell.classes[0] === className) return 1;
  return 0;
}

function getLevelIndex(entries: SpellEntry[]): Record<string, number> {
  return Object.fromEntries(
    Object.entries(
      entries.reduce(
        (index, { spell, level }) => {
          const explicitLevels =
            spell.levelsByClass && Object.keys(spell.levelsByClass).length > 0
              ? spell.levelsByClass
              : Object.fromEntries(spell.classes.map((className) => [className, level]));

          Object.entries(explicitLevels).forEach(([className, classLevel]) => {
            const specificity = getClassLevelSpecificity(spell, className, classLevel);
            const existing = index[className];
            if (
              !existing ||
              specificity > existing.specificity ||
              (specificity === existing.specificity && classLevel < existing.level)
            ) {
              index[className] = { level: classLevel, specificity };
            }
          });

          return index;
        },
        {} as Record<string, { level: number; specificity: number }>
      )
    )
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([className, { level }]) => [className, level])
  );
}

function mergeSpellEntries(
  entries: SpellEntry[],
  spellIdAliases: Record<string, string>,
  canonicalId?: string
): SpellEntry {
  const canonicalEntry =
    (canonicalId ? entries.find(({ spell }) => spell.id === canonicalId) : undefined) ??
    [...entries].sort((left, right) => {
      if (left.level !== right.level) return left.level - right.level;
      return compareCanonicalPreference(left.spell, right.spell);
    })[0];
  const canonicalLevel = Math.min(...entries.map(({ level }) => level));
  const longestDescription = [...entries].sort(
    (left, right) => right.spell.description.length - left.spell.description.length
  )[0].spell.description;

  entries
    .filter(({ spell }) => spell.id !== canonicalEntry.spell.id)
    .forEach(({ spell }) => {
      spellIdAliases[spell.id] = canonicalEntry.spell.id;
    });

  return {
    spell: {
      ...canonicalEntry.spell,
      level: canonicalLevel,
      description: longestDescription,
      classes: [...new Set(entries.flatMap(({ spell }) => spell.classes))].sort(),
      levelsByClass: getLevelIndex(entries),
    },
    level: canonicalLevel,
    sourceOrder: Math.min(...entries.map(({ sourceOrder }) => sourceOrder)),
  };
}

function mergeGroupedEntries(
  entries: SpellEntry[],
  spellIdAliases: Record<string, string>,
  getKey: (entry: SpellEntry) => string,
  shouldMerge: (entries: SpellEntry[]) => boolean,
  getCanonicalId: (entries: SpellEntry[]) => string | undefined = () => undefined
): SpellEntry[] {
  const groups = new Map<string, SpellEntry[]>();

  entries.forEach((entry) => {
    const key = getKey(entry);
    const existing = groups.get(key);
    if (existing) {
      existing.push(entry);
      return;
    }
    groups.set(key, [entry]);
  });

  return [...groups.values()]
    .map((group) =>
      group.length > 1 && shouldMerge(group)
        ? mergeSpellEntries(group, spellIdAliases, getCanonicalId(group))
        : group
    )
    .flat()
    .sort((left, right) => left.sourceOrder - right.sourceOrder);
}

function isExactClassSplitGroup(entries: SpellEntry[]): boolean {
  return entries.length > 1;
}

function isDescriptionStubGroup(entries: SpellEntry[]): boolean {
  if (entries.length < 2) return false;

  const schools = new Set(entries.map(({ spell }) => spell.school));
  if (schools.size !== 1) return false;

  const levels = new Set(entries.map(({ level }) => level));
  if (levels.size !== 1) return false;

  const descriptionLengths = entries.map(({ spell }) => spell.description.length);
  const shortest = Math.min(...descriptionLengths);
  const longest = Math.max(...descriptionLengths);

  return longest >= shortest * 2 + 50;
}

function isManualClassStubGroup(entries: SpellEntry[]): boolean {
  const canonicalId = MANUAL_CLASS_STUB_CANONICAL_IDS[getNormalizedSpellName(entries[0].spell)];
  if (!canonicalId) return false;

  const schools = new Set(entries.map(({ spell }) => spell.school));
  return schools.size === 1 && entries.some(({ spell }) => spell.id === canonicalId);
}

function mergeExactClassSplitVariants(spellsByLevel: Record<number, Spell[]>): {
  mergedSpellsByLevel: Record<number, Spell[]>;
  spellIdAliases: Record<string, string>;
} {
  const spellIdAliases: Record<string, string> = {};

  // Collect all spells across all levels, preserving original ordering.
  const allRawSpells: SpellEntry[] = [];
  Object.entries(spellsByLevel).forEach(([level, spells]) => {
    spells.forEach((spell) => {
      allRawSpells.push({ spell, level: Number(level), sourceOrder: allRawSpells.length });
    });
  });

  // Group by name + structural fingerprint (level is excluded from the fingerprint
  // so that purely-level-divergent class splits, e.g. Cure Moderate Wounds at
  // cleric L2 vs druid L3, collapse into one canonical entry whose `level` is
  // the lowest in the group and whose `levelsByClass` captures per-class levels.
  const descriptionStubMergedEntries = mergeGroupedEntries(
    allRawSpells,
    spellIdAliases,
    (entry) => getNormalizedSpellName(entry.spell),
    isDescriptionStubGroup
  );

  const manualMergedEntries = mergeGroupedEntries(
    descriptionStubMergedEntries,
    spellIdAliases,
    (entry) => getNormalizedSpellName(entry.spell),
    isManualClassStubGroup,
    (entries) => MANUAL_CLASS_STUB_CANONICAL_IDS[getNormalizedSpellName(entries[0].spell)]
  );

  const exactMergedEntries = mergeGroupedEntries(
    manualMergedEntries,
    spellIdAliases,
    (entry) => getNameAndStructureKey(entry.spell),
    isExactClassSplitGroup
  );

  const mergedEntries = mergeGroupedEntries(
    exactMergedEntries,
    spellIdAliases,
    (entry) => getNormalizedSpellName(entry.spell),
    isDescriptionStubGroup
  );

  return {
    mergedSpellsByLevel: getEntriesByCanonicalLevel(mergedEntries),
    spellIdAliases,
  };
}

const { mergedSpellsByLevel, spellIdAliases: exactVariantAliases } =
  mergeExactClassSplitVariants(rawSpellsByLevel);

Object.assign(exactVariantAliases, {
  'dispel-magic-druid-35e': 'dispel-magic-35e',
  'death-ward-druid-35e': 'death-ward-35e',
  'scrying-cleric-35e': 'scrying-35e',
});

const catalog = buildSpellCatalog(mergedSpellsByLevel, {
  spellIdAliases: exactVariantAliases,
});

export const allSpells = catalog.allSpells;
export const spellsByLevel = catalog.spellsByLevel;
export const spellsById = catalog.spellsById;
export const spellsByClass = catalog.spellsByClass;
export const spellsBySchool = catalog.spellsBySchool;
export const spellIdAliases = catalog.spellIdAliases;
export const spellStats = catalog.spellStats;
export const spellsByClassAndLevel = catalog.spellsByClassAndLevel ?? {};
export const getSpell = catalog.getSpell;

export const dnd35eSpells = allSpells;
export const dnd35eSpellsByLevel = spellsByLevel;
export const dnd35eSpellsById = spellsById;
export const dnd35eSpellsByClass = spellsByClass;
export const dnd35eSpellsByClassAndLevel = spellsByClassAndLevel;
export const dnd35eSpellsBySchool = spellsBySchool;

export {
  cantrips,
  level1Spells,
  level2Spells,
  level3Spells,
  level4Spells,
  level5Spells,
  level6Spells,
  level7Spells,
  level8Spells,
  level9Spells,
};
