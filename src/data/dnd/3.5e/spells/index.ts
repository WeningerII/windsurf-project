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
    ...rest
  } = spell;
  return JSON.stringify(stableFingerprintValue(rest));
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

function mergeExactClassSplitVariants(spellsByLevel: Record<number, Spell[]>): {
  mergedSpellsByLevel: Record<number, Spell[]>;
  spellIdAliases: Record<string, string>;
} {
  const spellIdAliases: Record<string, string> = {};

  const mergedSpellsByLevel = Object.fromEntries(
    Object.entries(spellsByLevel).map(([level, spells]) => {
      const groups = new Map<
        string,
        {
          order: number;
          spells: Spell[];
        }
      >();

      spells.forEach((spell, index) => {
        const fingerprint = getStructuredVariantFingerprint(spell);
        const existing = groups.get(fingerprint);
        if (existing) {
          existing.spells.push(spell);
          return;
        }
        groups.set(fingerprint, { order: index, spells: [spell] });
      });

      const mergedSpells = [...groups.values()]
        .sort((left, right) => left.order - right.order)
        .map(({ spells: group }) => {
          if (group.length === 1) {
            return group[0];
          }

          const sortedGroup = [...group].sort(compareCanonicalPreference);
          const canonical = sortedGroup[0];
          const mergedClasses = [...new Set(sortedGroup.flatMap((spell) => spell.classes))].sort();
          const mergedLevelsByClass = Object.fromEntries(
            Object.entries(
              sortedGroup.reduce(
                (index, spell) => ({
                  ...index,
                  ...(spell.levelsByClass ?? {}),
                }),
                {} as Record<string, number>
              )
            ).sort(([left], [right]) => left.localeCompare(right))
          );

          sortedGroup.slice(1).forEach((spell) => {
            spellIdAliases[spell.id] = canonical.id;
          });

          return {
            ...canonical,
            description: sortedGroup[0].description,
            classes: mergedClasses,
            levelsByClass: mergedLevelsByClass,
          };
        });

      return [Number(level), mergedSpells];
    })
  ) as Record<number, Spell[]>;

  return {
    mergedSpellsByLevel,
    spellIdAliases,
  };
}

const { mergedSpellsByLevel, spellIdAliases: exactVariantAliases } =
  mergeExactClassSplitVariants(rawSpellsByLevel);

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
