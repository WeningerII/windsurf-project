import { GameSystemId } from '../types/game-systems';

export type OpenContentCategory =
  | 'spells'
  | 'classes'
  | 'domains'
  | 'domainCards'
  | 'species'
  | 'backgrounds'
  | 'featureOptions'
  | 'traits'
  | 'monsters'
  | 'equipment'
  | 'feats'
  | 'powers'
  | 'advantages'
  | 'archetypes'
  | 'complications'
  | 'powerModifiers';

type SystemOpenContentPolicy = {
  allowedSources: readonly string[];
  allowMissingSourceFor: readonly OpenContentCategory[];
};

export const strictOpenContentPolicy: Record<GameSystemId, SystemOpenContentPolicy> = {
  'dnd-5e-2014': {
    allowedSources: ['SRD 5.1', 'SRD', 'System Reference Document 5.1'],
    allowMissingSourceFor: [],
  },
  'dnd-5e-2024': {
    allowedSources: ['SRD 5.2', 'System Reference Document 5.2'],
    allowMissingSourceFor: [],
  },
  'dnd-3.5e': {
    allowedSources: ['SRD 3.5', 'PHB 3.5', 'PHB', "Player's Handbook 3.5"],
    allowMissingSourceFor: [],
  },
  pf1e: {
    allowedSources: ['Core Rulebook', 'CRB'],
    allowMissingSourceFor: [],
  },
  pf2e: {
    // 'Core Rulebook' is the legacy OGL content; the rest are Paizo's Remaster
    // books published under the ORC License (explicit open-content permission),
    // imported from the official Foundry VTT pf2e dataset.
    allowedSources: [
      'Core Rulebook',
      'CRB',
      'Pathfinder Player Core',
      'Pathfinder Player Core 2',
      'Pathfinder GM Core',
      'Pathfinder NPC Core',
      'Pathfinder Monster Core',
      'Pathfinder War of Immortals',
      'Pathfinder Howl of the Wild',
      'Pathfinder Lost Omens Divine Mysteries',
      'Pathfinder Lost Omens Rival Academies',
      'Pathfinder #201: Pactbreaker',
      'Pathfinder #203: Shepherd of Decay',
      'Pathfinder #205: Singer, Stalker, Skinsaw Man',
      "Pathfinder #209: Destroyer's Doom",
      'Pathfinder #211: The Secret of Deathstalk Tower',
      'Pathfinder #212: A Voice in the Blight',
      'Pathfinder Adventure: Prey for Death',
    ],
    allowMissingSourceFor: [],
  },
  mam3e: {
    allowedSources: ["Hero's Handbook", 'HH', "Mutants & Masterminds Hero's Handbook"],
    allowMissingSourceFor: [],
  },
  daggerheart: {
    allowedSources: [
      'Daggerheart Core Rulebook',
      'Daggerheart',
      'Daggerheart SRD 1.0',
      'System Reference Document 1.0',
    ],
    allowMissingSourceFor: [],
  },
};

const normalizeSource = (source: string): string =>
  source.trim().replace(/\s+/g, ' ').toLowerCase();

const normalizedAllowedSourcesBySystem: Record<GameSystemId, Set<string>> = {
  'dnd-5e-2014': new Set(
    strictOpenContentPolicy['dnd-5e-2014'].allowedSources.map(normalizeSource)
  ),
  'dnd-5e-2024': new Set(
    strictOpenContentPolicy['dnd-5e-2024'].allowedSources.map(normalizeSource)
  ),
  'dnd-3.5e': new Set(strictOpenContentPolicy['dnd-3.5e'].allowedSources.map(normalizeSource)),
  pf1e: new Set(strictOpenContentPolicy.pf1e.allowedSources.map(normalizeSource)),
  pf2e: new Set(strictOpenContentPolicy.pf2e.allowedSources.map(normalizeSource)),
  mam3e: new Set(strictOpenContentPolicy.mam3e.allowedSources.map(normalizeSource)),
  daggerheart: new Set(strictOpenContentPolicy.daggerheart.allowedSources.map(normalizeSource)),
};

const allowMissingSourceBySystemAndCategory: Record<GameSystemId, Set<OpenContentCategory>> = {
  'dnd-5e-2014': new Set(strictOpenContentPolicy['dnd-5e-2014'].allowMissingSourceFor),
  'dnd-5e-2024': new Set(strictOpenContentPolicy['dnd-5e-2024'].allowMissingSourceFor),
  'dnd-3.5e': new Set(strictOpenContentPolicy['dnd-3.5e'].allowMissingSourceFor),
  pf1e: new Set(strictOpenContentPolicy.pf1e.allowMissingSourceFor),
  pf2e: new Set(strictOpenContentPolicy.pf2e.allowMissingSourceFor),
  mam3e: new Set(strictOpenContentPolicy.mam3e.allowMissingSourceFor),
  daggerheart: new Set(strictOpenContentPolicy.daggerheart.allowMissingSourceFor),
};

export function extractSourceAttribution(item: unknown): string | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const record = item as Record<string, unknown>;

  if (typeof record.source === 'string' && record.source.trim().length > 0) {
    return record.source.trim();
  }

  if (record.source && typeof record.source === 'object') {
    const sourceObject = record.source as Record<string, unknown>;
    if (typeof sourceObject.book === 'string' && sourceObject.book.trim().length > 0) {
      return sourceObject.book.trim();
    }
    if (typeof sourceObject.name === 'string' && sourceObject.name.trim().length > 0) {
      return sourceObject.name.trim();
    }
  }

  if (record.sourceBook && typeof record.sourceBook === 'object') {
    const sourceBook = record.sourceBook as Record<string, unknown>;
    if (typeof sourceBook.name === 'string' && sourceBook.name.trim().length > 0) {
      return sourceBook.name.trim();
    }
  }

  return null;
}

export function isOpenContentCompliant(
  systemId: GameSystemId,
  category: OpenContentCategory,
  item: unknown
): boolean {
  const source = extractSourceAttribution(item);
  if (!source) {
    return allowMissingSourceBySystemAndCategory[systemId].has(category);
  }

  return normalizedAllowedSourcesBySystem[systemId].has(normalizeSource(source));
}

export function filterOpenContentBySource<T>(
  systemId: GameSystemId,
  category: OpenContentCategory,
  items: T[]
): T[] {
  return items.filter((item) => isOpenContentCompliant(systemId, category, item));
}
