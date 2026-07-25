/**
 * Unit coverage for the PURE rules-provenance shape helpers
 * (`src/scripts/rulesProvenanceShape.ts`) — the parsing/classification half of
 * `npm run check:rules-provenance`, the open-content audit for content encoded
 * OUTSIDE `src/data/` (where `srd:coverage` is structurally blind).
 *
 * These pin the decisions that make the gate able to FAIL honestly:
 *   - a closed-book edition prefix is rejected for every system;
 *   - `Feats — X` is parsed as a NAMED ENTRY (so `SRD 5.1: Feats — Great Weapon
 *     Master` is resolvable against the SRD 5.1 feat corpus, which holds only
 *     Grappler), while chapter-ambiguous heads like `Classes — Base Attack
 *     Bonus` are NOT — mis-parsing those would manufacture false failures;
 *   - the `ContributionSourceKind` union is partitioned exhaustively, so a new
 *     kind cannot slip through unclassified.
 *
 * All seven systems are exercised: an edition table that silently lost a system
 * would let that system's citations go unchecked.
 */
import { describe, it, expect } from 'vitest';
import {
  parseOpenContentCitation,
  isRegisteredOpenContentEdition,
  openContentEditionsFor,
  normalizeEntryName,
  entryResolvesInCorpus,
  extractEffectSourceLiterals,
  sourceKindNamesContent,
  CONTENT_SOURCE_KIND_CATEGORY,
  UNRESOLVABLE_SOURCE_KINDS,
  NON_CONTENT_SOURCE_KINDS,
} from '../../scripts/rulesProvenanceShape';
import type { GameSystemId } from '../../types/game-systems';

const ALL_SYSTEMS: GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

describe('parseOpenContentCitation', () => {
  it('splits the edition prefix from the body', () => {
    const parsed = parseOpenContentCitation('SRD 5.1: Carrying Capacity');
    expect(parsed.edition).toBe('SRD 5.1');
    expect(parsed.segments).toHaveLength(1);
    expect(parsed.segments[0].kind).toBe('chapter');
  });

  it('classifies "<Category> — <Entry>" as a named entry', () => {
    const parsed = parseOpenContentCitation('SRD 5.1: Feats — Great Weapon Master');
    expect(parsed.edition).toBe('SRD 5.1');
    expect(parsed.segments[0]).toMatchObject({
      kind: 'named-entry',
      category: 'feats',
      entry: 'Great Weapon Master',
    });
  });

  it('does NOT treat chapter-ambiguous heads as categories', () => {
    // `Classes`, `Armor`, `Equipment` and `Conditions` head real SRD CHAPTERS;
    // reading their tail as an entry name would manufacture false failures.
    for (const citation of [
      'SRD 3.5: Classes — Base Attack Bonus',
      'SRD 5.1: Armor — Heavy Armor (Strength requirement)',
      'SRD 5.2: Equipment — Weapon Properties (Versatile)',
      'PF2e Core Rulebook (OGC): Conditions — Clumsy',
    ]) {
      const parsed = parseOpenContentCitation(citation);
      expect(parsed.segments.every((s) => s.kind === 'chapter')).toBe(true);
    }
  });

  it('splits "; "-joined segments and classifies each independently', () => {
    const parsed = parseOpenContentCitation(
      "M&M 3e Hero's Handbook (DHH OGC): Advantages — Equipment; Power Level"
    );
    expect(parsed.segments).toHaveLength(2);
    expect(parsed.segments[0]).toMatchObject({ kind: 'named-entry', category: 'advantages' });
    expect(parsed.segments[1].kind).toBe('chapter');
  });

  it('marks explicit absence assertions as negative, not as provenance', () => {
    const parsed = parseOpenContentCitation(
      'SRD 5.2: Feats (Great Weapon Master is absent from SRD 5.2)'
    );
    expect(parsed.segments[0].kind).toBe('negative');
  });

  it('handles a citation with no edition prefix', () => {
    const parsed = parseOpenContentCitation('Carrying Capacity');
    expect(parsed.edition).toBeNull();
  });
});

describe('isRegisteredOpenContentEdition', () => {
  it('accepts each system’s own edition prefix', () => {
    const expected: Record<GameSystemId, string> = {
      'dnd-5e-2014': 'SRD 5.1',
      'dnd-5e-2024': 'SRD 5.2',
      'dnd-3.5e': 'SRD 3.5',
      pf1e: 'PF1e Core Rulebook (OGC)',
      pf2e: 'PF2e Core Rulebook (OGC)',
      mam3e: "M&M 3e Hero's Handbook (DHH OGC)",
      daggerheart: 'Daggerheart SRD 1.0',
    };
    for (const systemId of ALL_SYSTEMS) {
      expect(isRegisteredOpenContentEdition(systemId, expected[systemId])).toBe(true);
    }
  });

  it('rejects closed books and non-existent editions for every system', () => {
    for (const systemId of ALL_SYSTEMS) {
      for (const closed of [
        "Player's Handbook",
        "Xanathar's Guide to Everything",
        'Advanced Player’s Guide',
        'SRD 9.9',
        null,
      ]) {
        expect(isRegisteredOpenContentEdition(systemId, closed)).toBe(false);
      }
    }
  });

  it('is case- and whitespace-insensitive', () => {
    expect(isRegisteredOpenContentEdition('dnd-5e-2014', '  srd   5.1 ')).toBe(true);
  });

  it('inherits the data-layer whitelist so the two policies cannot diverge', () => {
    // `strictOpenContentPolicy` allows the bare book label for pf1e/pf2e; the
    // citation registry must accept it too.
    expect(openContentEditionsFor('pf1e')).toContain('Core Rulebook');
    expect(isRegisteredOpenContentEdition('pf2e', 'CRB')).toBe(true);
  });
});

describe('entry resolution', () => {
  it('normalizes case, punctuation and parentheticals', () => {
    expect(normalizeEntryName('Great Weapon Master')).toBe('great weapon master');
    expect(normalizeEntryName('great-weapon-master')).toBe('great weapon master');
    expect(normalizeEntryName('Magic Initiate (Cleric)')).toBe('magic initiate');
  });

  it('resolves an exact and a parenthetical-variant corpus name', () => {
    const corpus = ['Grappler', 'Magic Initiate (Cleric)', 'Fighting Style: Archery'];
    expect(entryResolvesInCorpus('Grappler', corpus)).toBe(true);
    expect(entryResolvesInCorpus('Magic Initiate', corpus)).toBe(true);
    expect(entryResolvesInCorpus('Fighting Style: Archery', corpus)).toBe(true);
  });

  it('refuses an entry the corpus does not contain — the GWM case', () => {
    // The real SRD 5.1 feat corpus is exactly this.
    expect(entryResolvesInCorpus('Great Weapon Master', ['Grappler'])).toBe(false);
    expect(entryResolvesInCorpus('Sharpshooter', ['Grappler'])).toBe(false);
  });

  it('never resolves an empty citation', () => {
    expect(entryResolvesInCorpus('', ['Grappler'])).toBe(false);
  });
});

describe('extractEffectSourceLiterals', () => {
  it('extracts a single-line literal effect source', () => {
    const found = extractEffectSourceLiterals(
      `source: { kind: 'feat', id: 'great-weapon-master', label: 'Great Weapon Master' },`
    );
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({
      kind: 'feat',
      id: 'great-weapon-master',
      label: 'Great Weapon Master',
      dynamic: false,
    });
  });

  it('marks data-driven sources dynamic (already covered by the loader audit)', () => {
    const found = extractEffectSourceLiterals(
      `source: { kind: 'condition', id: conditionId, label: conditionId },`
    );
    expect(found[0]).toMatchObject({ kind: 'condition', dynamic: true });
  });

  it('extracts multi-line sources and reports 1-indexed lines', () => {
    const found = extractEffectSourceLiterals(
      ['const x = 1;', 'source: {', "  kind: 'feat',", "  id: 'power-attack',", '};'].join('\n')
    );
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ kind: 'feat', id: 'power-attack', line: 2 });
  });
});

describe('effect-source kind partition', () => {
  // Mirrors ContributionSourceKind (src/types/core/contributionLedger.ts). If a
  // member is added there without being classified here, the gate reports
  // `C/kind` rather than silently passing the new content through.
  const ALL_KINDS = [
    'system',
    'class',
    'subclass',
    'species',
    'background',
    'feat',
    'feature-option',
    'spell',
    'item',
    'domain-card',
    'power',
    'power-modifier',
    'condition',
    'terrain',
    'feature',
    'custom',
  ];

  it('partitions every ContributionSourceKind exactly once', () => {
    for (const kind of ALL_KINDS) {
      const buckets = [
        kind in CONTENT_SOURCE_KIND_CATEGORY,
        UNRESOLVABLE_SOURCE_KINDS.includes(kind),
        NON_CONTENT_SOURCE_KINDS.includes(kind),
      ].filter(Boolean);
      expect(buckets, `kind "${kind}" must be classified exactly once`).toHaveLength(1);
    }
  });

  it('treats engine-synthetic provenance as non-content', () => {
    expect(sourceKindNamesContent('system')).toBe(false);
    expect(sourceKindNamesContent('custom')).toBe(false);
    expect(sourceKindNamesContent('feat')).toBe(true);
    expect(sourceKindNamesContent('feature')).toBe(true);
  });
});
