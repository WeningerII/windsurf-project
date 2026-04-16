import type { Spell } from '../types/magic/spells';

export interface SpellPreparationEntry {
  id: string;
  name: string;
  level: number;
  unresolved: boolean;
}

export interface SpellPreparationConcepts {
  trackedSpells: SpellPreparationEntry[];
  preparedSpells: SpellPreparationEntry[];
  alwaysPreparedSpells: SpellPreparationEntry[];
  manualNotes: string[];
}

type SpellLookup = Map<string, Pick<Spell, 'id' | 'name' | 'level'>>;

function compareSpellEntries(left: SpellPreparationEntry, right: SpellPreparationEntry): number {
  return left.level - right.level || left.name.localeCompare(right.name);
}

function humanizeSpellId(spellId: string): string {
  return spellId
    .split(/[-_]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function dedupeSpellIds(spellIds: string[] | undefined): string[] {
  return [...new Set(spellIds ?? [])];
}

export function resolveSpellPreparationEntry(
  spellId: string,
  spellById: SpellLookup
): SpellPreparationEntry {
  const spell = spellById.get(spellId);
  if (!spell) {
    return {
      id: spellId,
      name: humanizeSpellId(spellId),
      level: -1,
      unresolved: true,
    };
  }

  return {
    id: spell.id,
    name: spell.name,
    level: spell.level,
    unresolved: false,
  };
}

export function resolveSpellPreparationEntries(
  spellIds: string[],
  spellById: SpellLookup
): SpellPreparationEntry[] {
  return spellIds.map((spellId) => resolveSpellPreparationEntry(spellId, spellById));
}

export function buildSpellPreparationConcepts(params: {
  trackedSpellIds?: string[];
  preparedSpellIds?: string[];
  alwaysPreparedSpellIds?: string[];
  spellById: SpellLookup;
  manualNotes?: string[];
}): SpellPreparationConcepts {
  const {
    trackedSpellIds = [],
    preparedSpellIds = [],
    alwaysPreparedSpellIds = [],
    spellById,
    manualNotes = [],
  } = params;
  const alwaysPrepared = dedupeSpellIds(alwaysPreparedSpellIds);
  const alwaysPreparedSet = new Set(alwaysPrepared);
  const tracked = dedupeSpellIds(trackedSpellIds).filter(
    (spellId) => !alwaysPreparedSet.has(spellId)
  );
  const prepared = dedupeSpellIds(preparedSpellIds).filter(
    (spellId) => !alwaysPreparedSet.has(spellId)
  );

  return {
    trackedSpells: resolveSpellPreparationEntries(tracked, spellById).sort(compareSpellEntries),
    preparedSpells: resolveSpellPreparationEntries(prepared, spellById),
    alwaysPreparedSpells: resolveSpellPreparationEntries(alwaysPrepared, spellById).sort(
      compareSpellEntries
    ),
    manualNotes: [...new Set(manualNotes.filter((note) => note.trim().length > 0))],
  };
}
