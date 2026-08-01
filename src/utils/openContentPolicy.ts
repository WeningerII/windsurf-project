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

/**
 * `allowedSources` is the WHOLE admission list. There is deliberately no second
 * channel.
 *
 * There used to be one — `originalContentSources`, which admitted content this
 * project authored itself under the label "Original Content (not SRD)". It was
 * introduced for an honest reason (tagging self-written entries with an SRD
 * label to sneak them past `allowedSources` is a false attribution, the exact
 * defect the M&M equipment audit found) and it did keep "transcribed" and
 * "written here" machine-distinguishable. But it also made shipping homebrew a
 * one-line addition, and 106 entries took that door — 79 M&M equipment items,
 * 27 spells/items/stat blocks across the five d20 catalogs.
 *
 * All 106 were deleted 2026-07-30 and the channel with them (owner decision).
 * This application transcribes open documents; it does not author game content.
 * With only `allowedSources` left, a new self-written entry has nowhere to be
 * admitted from, so it fails the gate instead of quietly widening the corpus.
 */
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
    // 'SRD 5.1' admitted 2026-07-29: 12 entries in the 2024 catalog (5 items of
    // adventuring gear, 7 stat blocks) are transcribed from SRD 5.1, which the
    // 2024 SRD did not re-print. SRD 5.1 is CC-BY-4.0 — as open as 5.2 — so
    // rejecting a truthful 'SRD 5.1' tag here was a SCOPE rule wearing a
    // licence rule's clothes, and its only effect was to push those records
    // toward a false 5.2 claim. The tag now names the edition it came from.
    allowedSources: ['SRD 5.2', 'System Reference Document 5.2', 'SRD 5.1'],
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
    // something this file should assert. Those records keep their true tag
    // and are filtered — the conservative treatment for content whose licence I
    // could not establish.
    //
    // 'Pathfinder 2e Treasure Vault' admitted 2026-08-01 for the three weapons
    // (Atlatl, Boomerang, Earthbreaker) that PF2e prints only in that book. It is
    // held to the same evidence standard as every other string here: Foundry's
    // pf2e system data carries per-item licence metadata, and each of the three
    // reads `{"license":"OGL","remaster":false}` — Treasure Vault shipped before
    // Paizo's move to the ORC licence. The PF1e tags those rows used to carry
    // named the wrong game entirely.
    //
    // The Remaster line (Player Core 1 and successors) is NOT admitted and should
    // not be: it is ORC-licensed, not OGL, and every PF2e entry here that the
    // Remaster reprinted is cited to its original OGL printing (CRB or APG)
    // instead. Pf2eTools keeps both printings, so the OGL one is always available.
    allowedSources: [
      'Core Rulebook',
      'CRB',
      'B1',
      'Pathfinder 1e Core Rulebook',
      "Pathfinder 1e Advanced Player's Guide",
      'Pathfinder 1e Ultimate Combat',
      'Pathfinder 1e Ultimate Equipment',
      "Pathfinder 2e Advanced Player's Guide",
      'Pathfinder 2e Treasure Vault',
      'Secrets of Magic',
      'SRD 3.5',
      'SRD 5.1',
    ],
    allowMissingSourceFor: [],
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
 * The shipping gate for a data entry's citation. An entry passes only when its
 * source is open-content provenance for that system (`allowedSources`).
 * Anything else — a closed-book citation, an unrecognised label, or content this
 * project wrote itself — is filtered out of the loaded corpus.
 *
 * This is also the MEASUREMENT predicate now. It used to be neither: it admitted
 * declared original content too, so measuring compliance with it would have
 * reported self-authored entries as compliant open content, and callers had to
 * subtract that population back out. With the original-content channel gone the
 * two questions have the same answer again.
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
