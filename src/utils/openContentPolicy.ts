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
    // Only the open-licensed System Reference Document qualifies. Closed-book
    // citations ('PHB', "Player's Handbook 3.5") are NOT open-content
    // provenance and are rejected.
    allowedSources: ['SRD 3.5'],
    allowMissingSourceFor: [],
  },
  pf1e: {
    // 'Bestiary' is PSRD-Data's source string for Bestiary 1 entries (PRD
    // open content) — see docs/srd-sources.md.
    allowedSources: ['Core Rulebook', 'CRB', 'Bestiary'],
    allowMissingSourceFor: [],
  },
  pf2e: {
    allowedSources: ['Core Rulebook', 'CRB'],
    allowMissingSourceFor: [],
  },
  mam3e: {
    // TODO(open-content): "Hero's Handbook" is the commercial book title, not
    // an open-content designation. Per the SRD/OGL-only policy intent these
    // citations should be re-pointed at the M&M 3e OGC SRD designation and the
    // data re-verified against it. Left in place for now — re-sourcing the
    // whole M&M corpus is out of scope for the current compliance pass.
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

function isSourceAllowed(systemId: GameSystemId, source: string): boolean {
  return normalizedAllowedSourcesBySystem[systemId].has(normalizeSource(source));
}

/**
 * Species can nest subraces that come from a different (possibly closed) book
 * than the parent species. When a nested subrace declares its own source, that
 * attribution must pass the same whitelist as the parent; otherwise the whole
 * species is treated as non-compliant rather than silently shipping nested
 * closed content under the parent's citation.
 */
function nestedSubracesCompliant(systemId: GameSystemId, item: unknown): boolean {
  if (!item || typeof item !== 'object') {
    return true;
  }

  const subraces = (item as { subraces?: unknown }).subraces;
  if (!Array.isArray(subraces)) {
    return true;
  }

  return subraces.every((subrace) => {
    const subraceSource = extractSourceAttribution(subrace);
    return subraceSource === null || isSourceAllowed(systemId, subraceSource);
  });
}

export function isOpenContentCompliant(
  systemId: GameSystemId,
  category: OpenContentCategory,
  item: unknown
): boolean {
  const source = extractSourceAttribution(item);
  if (!source) {
    if (!allowMissingSourceBySystemAndCategory[systemId].has(category)) {
      return false;
    }
  } else if (!isSourceAllowed(systemId, source)) {
    return false;
  }

  if (category === 'species' && !nestedSubracesCompliant(systemId, item)) {
    return false;
  }

  return true;
}

export function filterOpenContentBySource<T>(
  systemId: GameSystemId,
  category: OpenContentCategory,
  items: T[]
): T[] {
  return items.filter((item) => isOpenContentCompliant(systemId, category, item));
}
