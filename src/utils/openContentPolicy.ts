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
  /**
   * Sources that are NOT open-content provenance: content authored for this
   * application rather than transcribed from a published open document.
   *
   * This channel exists because the alternative is worse. Content this project
   * wrote itself is shippable — but tagging it with an SRD/book label to get it
   * past `allowedSources` is a false attribution, which is exactly the defect
   * the M&M equipment audit found (150 hand-written entries, all citing
   * "Hero's Handbook", only 45 of which the Hero SRD contains). Keeping the two
   * lists separate means "we transcribed this from an open document" and "we
   * wrote this" stay distinguishable by machine, not just by intent.
   *
   * Entries admitted here are still subject to every other gate; they simply do
   * not claim an open-content pedigree they do not have.
   */
  originalContentSources?: readonly string[];
};

export const strictOpenContentPolicy: Record<GameSystemId, SystemOpenContentPolicy> = {
  'dnd-5e-2014': {
    allowedSources: ['SRD 5.1', 'SRD', 'System Reference Document 5.1'],
    allowMissingSourceFor: [],
    // The over-inclusion audit (docs/GAPS.md §18) resolved seven 5e-2014 magic
    // items as content this project wrote rather than SRD 5.1 transcription
    // (Cloak of Billowing, Scroll of Protection, Cloak of the Archmagi,
    // Potion of Dragon's Breath, Cap of Water Breathing, Pegasus Boots, Ring of
    // Clumsiness). They used to claim 'SRD 5.1'; they now say what they are.
    originalContentSources: ['Original Content (not SRD)'],
  },
  'dnd-5e-2024': {
    // 'SRD 5.1' admitted 2026-07-29: 12 entries in the 2024 catalog (5 items of
    // adventuring gear, 7 stat blocks) are transcribed from SRD 5.1, which the
    // 2024 SRD did not re-print. SRD 5.1 is CC-BY-4.0 — as open as 5.2 — so
    // rejecting a truthful 'SRD 5.1' tag here was a SCOPE rule wearing a
    // licence rule's clothes, and its only effect was to push those records
    // toward a false 5.2 claim. The tag now names the edition it came from.
    allowedSources: ['SRD 5.2', 'System Reference Document 5.2', 'SRD 5.1'],
    allowMissingSourceFor: [],
    // Same channel as 5e-2014: six 2024-catalog entries (three magic items,
    // three stat blocks — Captain, Necromancer, Pixie) have no SRD 5.2
    // counterpart and are this project's own writing.
    originalContentSources: ['Original Content (not SRD)'],
  },
  'dnd-3.5e': {
    // Only the open-licensed System Reference Document qualifies. Closed-book
    // citations ('PHB', "Player's Handbook 3.5") are NOT open-content
    // provenance and are rejected.
    allowedSources: ['SRD 3.5'],
    allowMissingSourceFor: [],
    // Mass Misdirection and Reversal of Fortune are not in the SRD 3.5 spell
    // chapters under any name; they are this project's own content and no
    // longer claim otherwise.
    originalContentSources: ['Original Content (not SRD)'],
  },
  pf1e: {
    // 'Bestiary' is PSRD-Data's source string for Bestiary 1 entries (PRD
    // open content) — see docs/srd-sources.md.
    //
    // The Advanced Player's Guide is Open Game Content under OGL v1.0a exactly
    // as the Core Rulebook is; the earlier Core-only scoping of this list
    // simply had not enumerated it, which forced APG-derived entries to carry a
    // false 'Core Rulebook' tag. Naming the book is the truthful fix.
    // 'SRD 3.5' admitted 2026-07-29: PF1e is a derivative of the 3.5 SRD under
    // OGL v1.0a, and 4 records here (Amulet of Health, Cloak of Charisma) are
    // straight 3.5 SRD inheritances. Both documents are OGC; naming the real
    // one is truthful and costs nothing.
    allowedSources: [
      'Core Rulebook',
      'CRB',
      'Bestiary',
      "Pathfinder 1e Advanced Player's Guide",
      'SRD 3.5',
    ],
    allowMissingSourceFor: [],
    // Cloak of Flying and Cloak of Invisibility have no PRD counterpart; they
    // are this project's own writing rather than Core Rulebook transcription.
    originalContentSources: ['Original Content (not SRD)'],
  },
  pf2e: {
    // 'B1' is Pf2eTools' tag for Bestiary 1 (OGL-era PF2e content) — see
    // docs/srd-sources.md.
    //
    // WIDENED 2026-07-29, and the reason matters more than the list.
    //
    // This field was doing two different jobs at once: "is this content legally
    // open?" and "is this book inside the product's declared scope?" Those are
    // not the same question, and conflating them produced a WORSE outcome than
    // either — because the only tag that passed was the wrong one.
    //
    // Concretely: 15 gear rows in this catalog are transcribed from the
    // PATHFINDER 1e Core Rulebook. Normalizing them to the bare 'Core Rulebook'
    // (which this list accepted) made them compliant while naming the wrong
    // book — a false attribution that PASSED the gate. That is precisely the
    // defect docs/GAPS.md §11 exists to catch, reintroduced by a scope rule
    // masquerading as a licence rule.
    //
    // Every string added below is Open Game Content under OGL v1.0a, verified
    // per book — the PF1e line (Core Rulebook, APG, Ultimate Combat, Ultimate
    // Equipment), the OGL-era PF2e books (APG, Secrets of Magic), and the d20
    // SRDs. Admitting them lets each record name its ACTUAL source, so a
    // wrong-edition attribution stays visible as a wrong edition instead of
    // being laundered into a right-looking one.
    //
    // The Lost Omens line is deliberately NOT admitted: it is Paizo's setting
    // line and carries substantial Product Identity, so its open status is not
    // something this file should assert. Those two records keep their true tag
    // and are filtered — the conservative treatment for content whose licence I
    // could not establish.
    allowedSources: [
      'Core Rulebook',
      'CRB',
      'B1',
      'Pathfinder 1e Core Rulebook',
      "Pathfinder 1e Advanced Player's Guide",
      'Pathfinder 1e Ultimate Combat',
      'Pathfinder 1e Ultimate Equipment',
      "Pathfinder 2e Advanced Player's Guide",
      'Secrets of Magic',
      'SRD 3.5',
      'SRD 5.1',
    ],
    allowMissingSourceFor: [],
    // Nine pf2e entries (Chisel, Field Plate, File, Tongs and five spells) have
    // no counterpart in the cited open source and are this project's own.
    originalContentSources: ['Original Content (not SRD)'],
  },
  mam3e: {
    // M&M 3e is Open Game Content. Green Ronin designates essentially the entire
    // M&M game — the Hero's Handbook — as Open Game Content under OGL v1.0a; the
    // sole Product Identity is the branded resource terms "Hero Points" and
    // "Power Points" (used here for identification/compatibility only, never
    // claimed as OGC). The shipped data was authored from and verified against
    // the M&M 3e Hero SRD (d20herosrd.com) — see the powers/conditions data
    // READMEs and docs/srd-sources.md — then labelled with the book title
    // "Hero's Handbook". Both that book label and the explicit Hero SRD
    // designation are therefore valid open-content provenance. Full attribution
    // and §15 chain of title: src/legal/attributions.ts (LEGAL-2 resolved).
    allowedSources: [
      "Hero's Handbook",
      'HH',
      "Mutants & Masterminds Hero's Handbook",
      'Hero SRD',
      'M&M 3e Hero SRD',
      'd20herosrd',
    ],
    allowMissingSourceFor: [],
    // The mam3e equipment set ships 79 entries with no Hero SRD counterpart
    // (Power Ring, Web Shooters, Space Station, …) in
    // src/data/mutants-and-masterminds/3e/equipment/original-not-srd.ts. They
    // used to claim "Hero's Handbook"; they now say what they are.
    originalContentSources: ['Original Content (not SRD)'],
  },
  daggerheart: {
    allowedSources: [
      'Daggerheart Core Rulebook',
      'Daggerheart',
      'Daggerheart SRD 1.0',
      'SRD 1.0',
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
 * True when the citation names this project's own original content rather than
 * an open document. Such entries are shippable but are NOT open-content
 * provenance — see `SystemOpenContentPolicy.originalContentSources`.
 *
 * EXPORTED because `isOpenContentCompliant` is the SHIPPING gate (open content
 * OR declared original content), which is the wrong predicate for anything
 * *measuring* open-content compliance. `generate-roadmap-metrics.ts` uses this
 * to keep the two populations separate in the published Content Integrity
 * table instead of reporting self-authored entries as compliant open content.
 *
 * Scanned rather than pre-indexed: every declaring system lists exactly one
 * label, and the eager shell is ~130 bytes from its gzip budget, so a seventh
 * module-level Set map is not worth the first-paint cost.
 */
export function isOriginalContentSource(systemId: GameSystemId, source: string): boolean {
  const declared = strictOpenContentPolicy[systemId].originalContentSources;
  if (!declared) return false;
  const normalized = normalizeSource(source);
  return declared.some((candidate) => normalizeSource(candidate) === normalized);
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

/**
 * The shipping gate for a data entry's citation. An entry passes when its source
 * is either open-content provenance for that system (`allowedSources`) or a
 * declared original-content label (`originalContentSources`). Anything else —
 * including a closed-book citation or an unrecognised label — is filtered out of
 * the loaded corpus.
 */
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
  } else if (!isSourceAllowed(systemId, source) && !isOriginalContentSource(systemId, source)) {
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
