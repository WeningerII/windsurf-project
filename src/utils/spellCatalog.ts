import type { Spell } from '../types/magic/spells';
import { indexById } from './indexById';

export interface SpellCatalog {
  allSpells: Spell[];
  spellsByLevel: Record<number, Spell[]>;
  spellsById: Record<string, Spell>;
  spellsByClass: Record<string, Spell[]>;
  spellsBySchool: Record<string, Spell[]>;
  spellStats: {
    total: number;
    byLevel: Record<number, number>;
    byClass: Record<string, number>;
    bySchool: Record<string, number>;
  };
  spellIdAliases: Record<string, string>;
  spellsByClassAndLevel?: Record<string, Record<number, Spell[]>>;
  getSpell: (id: string) => Spell | undefined;
  resolveSpellId: (id: string) => string;
}

export interface BuildSpellCatalogOptions {
  omittedSpellIds?: string[];
  spellIdAliases?: Record<string, string>;
  transformSpell?: (spell: Spell) => Spell;
}

function buildSpellIndex(
  spells: Spell[],
  reducer: (spell: Spell, index: Record<string, Spell[]>) => void
): Record<string, Spell[]> {
  return spells.reduce(
    (index, spell) => {
      reducer(spell, index);
      return index;
    },
    {} as Record<string, Spell[]>
  );
}

function buildClassAndLevelIndex(
  spells: Spell[]
): Record<string, Record<number, Spell[]>> | undefined {
  const hasLevelsByClass = spells.some(
    (spell) => spell.levelsByClass && Object.keys(spell.levelsByClass).length > 0
  );
  if (!hasLevelsByClass) {
    return undefined;
  }

  return spells.reduce(
    (index, spell) => {
      Object.entries(spell.levelsByClass ?? {}).forEach(([className, level]) => {
        if (!index[className]) {
          index[className] = {};
        }
        if (!index[className][level]) {
          index[className][level] = [];
        }
        index[className][level].push(spell);
      });
      return index;
    },
    {} as Record<string, Record<number, Spell[]>>
  );
}

export function resolveSpellIdAlias(id: string, spellIdAliases: Record<string, string>): string {
  let current = id;
  const seen = new Set<string>();

  while (spellIdAliases[current] && !seen.has(current)) {
    seen.add(current);
    current = spellIdAliases[current];
  }

  return current;
}

export function buildSpellCatalog(
  rawSpellsByLevel: Record<number, Spell[]>,
  options: BuildSpellCatalogOptions = {}
): SpellCatalog {
  const omittedSpellIds = new Set(options.omittedSpellIds ?? []);
  const spellIdAliases = { ...(options.spellIdAliases ?? {}) };
  const transformSpell = options.transformSpell ?? ((spell: Spell) => spell);

  const spellsByLevel = Object.fromEntries(
    Object.entries(rawSpellsByLevel).map(([level, spells]) => [
      Number(level),
      spells.filter((spell) => !omittedSpellIds.has(spell.id)).map(transformSpell),
    ])
  ) as Record<number, Spell[]>;

  const allSpells = Object.values(spellsByLevel).flat();
  // Dev-warns on duplicate spell ids; alias keys are layered on afterwards.
  const spellsById = indexById(allSpells, 'buildSpellCatalog.spellsById');

  Object.entries(spellIdAliases).forEach(([alias, canonicalId]) => {
    const resolvedId = resolveSpellIdAlias(canonicalId, spellIdAliases);
    const spell = spellsById[resolvedId];
    if (spell) {
      spellsById[alias] = spell;
    }
  });

  const spellsByClass = buildSpellIndex(allSpells, (spell, index) => {
    spell.classes.forEach((className) => {
      if (!index[className]) {
        index[className] = [];
      }
      index[className].push(spell);
    });
  });

  const spellsBySchool = buildSpellIndex(allSpells, (spell, index) => {
    if (!index[spell.school]) {
      index[spell.school] = [];
    }
    index[spell.school].push(spell);
  });

  const spellStats = {
    total: allSpells.length,
    byLevel: Object.fromEntries(
      Object.entries(spellsByLevel).map(([level, spells]) => [Number(level), spells.length])
    ) as Record<number, number>,
    byClass: Object.fromEntries(
      Object.entries(spellsByClass).map(([className, spells]) => [className, spells.length])
    ),
    bySchool: Object.fromEntries(
      Object.entries(spellsBySchool).map(([school, spells]) => [school, spells.length])
    ),
  };

  const spellsByClassAndLevel = buildClassAndLevelIndex(allSpells);

  return {
    allSpells,
    spellsByLevel,
    spellsById,
    spellsByClass,
    spellsBySchool,
    spellStats,
    spellIdAliases,
    spellsByClassAndLevel,
    getSpell: (id: string) => spellsById[resolveSpellIdAlias(id, spellIdAliases)] ?? spellsById[id],
    resolveSpellId: (id: string) => resolveSpellIdAlias(id, spellIdAliases),
  };
}
