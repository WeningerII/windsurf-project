/**
 * Pure shape helpers for `check:rules-provenance` — the open-content audit for
 * content encoded OUTSIDE `src/data/`.
 *
 * WHY THIS EXISTS. `npm run srd:coverage` is a reverse-diff audit: it fetches
 * published open-content lists and diffs them against what the LOADERS expose
 * (`loadFeatsForSystem`, `loadSpellsForSystem`, …). That audit is structurally
 * blind to content encoded directly in the rules/compute layers, because such
 * content never passes through a loader. Concretely: a `-5 attack / +10 damage`
 * feat rider compiled in `src/rules/conditions/**` and cited in
 * `docs/compute-register/**` is invisible to it, so an SRD citation naming a
 * feat that the SRD does not contain can ship unchallenged.
 *
 * This module holds the deterministic, side-effect-free half of the gate:
 * parsing a citation string into (edition, category, named entry), and deciding
 * whether an edition prefix is registered open content for a system. The
 * corpus-loading and filesystem-scanning half lives in
 * `scripts/check-rules-provenance.mjs`.
 *
 * DELIBERATELY CONSERVATIVE. Only unambiguous CONTENT-CATEGORY words head a
 * "named entry" citation (`Feats — X`, `Advantages — X`). Chapter words that
 * also name a category in some editions (`Armor`, `Equipment`, `Classes`,
 * `Conditions`) are NOT treated as categories, because `SRD 3.5: Classes — Base
 * Attack Bonus` cites a chapter, not a class named "Base Attack Bonus".
 * Mis-parsing those would manufacture false failures, which is worse than a
 * narrower true gate. What that leaves unchecked is recorded in `docs/GAPS.md`.
 */

import { strictOpenContentPolicy } from '../utils/openContentPolicy';
import type { GameSystemId } from '../types/game-systems';

/**
 * Longer citation prefixes used by the rules/compute layers, on top of the
 * short book labels `strictOpenContentPolicy` whitelists for the data layer.
 * The two sets are UNIONED (see `openContentEditionsFor`) so widening one
 * policy cannot silently diverge from the other.
 */
const CITATION_EDITION_PREFIXES: Record<GameSystemId, readonly string[]> = {
  'dnd-5e-2014': ['SRD 5.1', 'D&D 5e SRD (5.1/5.2)'],
  'dnd-5e-2024': ['SRD 5.2', 'D&D 5e SRD (5.1/5.2)'],
  'dnd-3.5e': ['SRD 3.5'],
  pf1e: ['PF1e Core Rulebook (OGC)'],
  pf2e: ['PF2e Core Rulebook (OGC)'],
  mam3e: ["M&M 3e Hero's Handbook (DHH OGC)"],
  daggerheart: ['Daggerheart SRD 1.0'],
};

/** Normalize a citation fragment for comparison (case/whitespace/quote-shape). */
export function normalizeCitationText(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Every edition prefix that counts as open-content provenance for a system. */
export function openContentEditionsFor(systemId: GameSystemId): string[] {
  return [
    ...strictOpenContentPolicy[systemId].allowedSources,
    ...CITATION_EDITION_PREFIXES[systemId],
  ];
}

/** Whether `edition` is a registered open-content edition for `systemId`. */
export function isRegisteredOpenContentEdition(
  systemId: GameSystemId,
  edition: string | null
): boolean {
  if (edition === null) return false;
  const wanted = normalizeCitationText(edition);
  return openContentEditionsFor(systemId).some((e) => normalizeCitationText(e) === wanted);
}

/**
 * Content categories a citation may name an ENTRY in. Deliberately excludes
 * chapter-ambiguous words (see the module header).
 */
export const CITED_CATEGORY_ALIASES: Readonly<Record<string, string>> = {
  feat: 'feats',
  feats: 'feats',
  spell: 'spells',
  spells: 'spells',
  power: 'powers',
  powers: 'powers',
  advantage: 'advantages',
  advantages: 'advantages',
  monster: 'monsters',
  monsters: 'monsters',
  background: 'backgrounds',
  backgrounds: 'backgrounds',
  species: 'species',
  race: 'species',
  races: 'species',
  'domain card': 'domainCards',
  'domain cards': 'domainCards',
  complication: 'complications',
  complications: 'complications',
};

/** Phrasing that marks a citation as asserting an ABSENCE, not a provenance. */
const NEGATIVE_ASSERTION = /\b(is absent from|are absent from|is not in|are not in)\b/i;

export type CitationSegmentKind = 'chapter' | 'named-entry' | 'negative';

export interface CitationSegment {
  /** The segment exactly as written. */
  raw: string;
  kind: CitationSegmentKind;
  /** Content category, when the segment names an entry. */
  category: string | null;
  /** The named entry, when the segment names one. */
  entry: string | null;
}

export interface ParsedCitation {
  raw: string;
  /** Edition prefix (text before the first `': '`), or null when absent. */
  edition: string | null;
  segments: CitationSegment[];
}

/**
 * Parse an open-content citation such as
 * `"SRD 5.1: Feats — Great Weapon Master"` into its edition prefix and its
 * `'; '`-separated segments. A segment shaped `<Category> — <Entry>` where
 * `<Category>` is an unambiguous content category yields a `named-entry`
 * segment; everything else is a `chapter` (or `negative`) segment.
 */
export function parseOpenContentCitation(raw: string): ParsedCitation {
  const trimmed = raw.trim();
  const split = trimmed.indexOf(': ');
  const edition = split === -1 ? null : trimmed.slice(0, split).trim();
  const body = split === -1 ? trimmed : trimmed.slice(split + 2).trim();

  const segments: CitationSegment[] = body
    .split('; ')
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0)
    .map((piece) => {
      if (NEGATIVE_ASSERTION.test(piece)) {
        return { raw: piece, kind: 'negative' as const, category: null, entry: null };
      }
      const dash = piece.indexOf(' — ');
      if (dash === -1) {
        return { raw: piece, kind: 'chapter' as const, category: null, entry: null };
      }
      const head = piece.slice(0, dash).trim();
      const tail = piece.slice(dash + 3).trim();
      const category = CITED_CATEGORY_ALIASES[normalizeCitationText(head)] ?? null;
      if (category === null || tail.length === 0) {
        return { raw: piece, kind: 'chapter' as const, category: null, entry: null };
      }
      return { raw: piece, kind: 'named-entry' as const, category, entry: tail };
    });

  return { raw: trimmed, edition, segments };
}

/**
 * Normalize a content entry NAME for corpus lookup. Mirrors the intent of
 * `srdCoverageShape.norm` (the loader/SRD diff normalizer): drop punctuation
 * and case so `"Great Weapon Master"` and `"great-weapon-master"` compare equal.
 */
export function normalizeEntryName(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Does `entry` name something in `corpusNames`? Exact normalized match, or a
 * corpus name that extends the cited one with a parenthetical/colon variant
 * (`Magic Initiate (Cleric)` satisfies a citation of `Magic Initiate`).
 */
export function entryResolvesInCorpus(entry: string, corpusNames: readonly string[]): boolean {
  const wanted = normalizeEntryName(entry);
  if (wanted.length === 0) return false;
  return corpusNames.some((name) => {
    const got = normalizeEntryName(name);
    return got === wanted || got.startsWith(`${wanted} `);
  });
}

/**
 * Effect-source `kind`s that name shippable CONTENT (so a citation must
 * resolve), mapped to the content category whose corpus resolves them.
 *
 * The `ContributionSourceKind` union is partitioned exhaustively across this
 * map, `UNRESOLVABLE_SOURCE_KINDS` and `NON_CONTENT_SOURCE_KINDS`, so a kind
 * added later lands in none of them and fails the gate rather than being
 * silently waved through.
 */
export const CONTENT_SOURCE_KIND_CATEGORY: Readonly<Record<string, string>> = {
  feat: 'feats',
  item: 'equipment',
  spell: 'spells',
  species: 'species',
  background: 'backgrounds',
  class: 'classes',
  'feature-option': 'featureOptions',
  'domain-card': 'domainCards',
  power: 'powers',
  'power-modifier': 'powerModifiers',
};

/**
 * Kinds that name content but for which this repo ships no INDEPENDENT
 * open-content corpus — class/racial features, conditions and terrain live in
 * the rules IR itself, so resolving them against it would be circular and
 * resolving them against anything else would mean inventing a denominator.
 * Reported as unresolvable and tracked in `docs/GAPS.md`, never silently
 * passed.
 */
export const UNRESOLVABLE_SOURCE_KINDS: readonly string[] = [
  'feature',
  'condition',
  'terrain',
  'subclass',
];

/**
 * Kinds that carry no book content at all — engine-synthetic provenance tags
 * (`system: 'base-armor-class'`) and user-authored entries (`custom`). These
 * need no citation and no system scoping.
 */
export const NON_CONTENT_SOURCE_KINDS: readonly string[] = ['system', 'custom'];

/** Whether a literal effect source of this kind names book content. */
export function sourceKindNamesContent(kind: string | null): boolean {
  if (kind === null) return false;
  return !NON_CONTENT_SOURCE_KINDS.includes(kind);
}

export interface ParsedEffectSource {
  kind: string | null;
  id: string | null;
  label: string | null;
  /** True when id/label are expressions (data-driven), not string literals. */
  dynamic: boolean;
  line: number;
}

const SOURCE_LITERAL = /source:\s*\{([^{}]*)\}/g;

function literalField(body: string, field: string): { value: string | null; dynamic: boolean } {
  const quoted = new RegExp(`\\b${field}:\\s*'([^']*)'`).exec(body);
  if (quoted) return { value: quoted[1], dynamic: false };
  const present = new RegExp(`\\b${field}:\\s*([^,}]+)`).exec(body);
  if (present) return { value: null, dynamic: true };
  return { value: null, dynamic: false };
}

/**
 * Extract `source: { kind, id, label }` effect-source object literals from a
 * TypeScript source text. Sources whose id/label are expressions rather than
 * string literals are marked `dynamic` — those are data-driven (the name comes
 * from a loaded corpus entry), so the loader-side audit already covers them.
 */
export function extractEffectSourceLiterals(text: string): ParsedEffectSource[] {
  const out: ParsedEffectSource[] = [];
  SOURCE_LITERAL.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SOURCE_LITERAL.exec(text)) !== null) {
    const body = match[1];
    const kind = literalField(body, 'kind');
    const id = literalField(body, 'id');
    const label = literalField(body, 'label');
    if (kind.value === null && !kind.dynamic) continue;
    out.push({
      kind: kind.value,
      id: id.value,
      label: label.value,
      dynamic: kind.value === null || (id.value === null && label.value === null),
      line: text.slice(0, match.index).split('\n').length,
    });
  }
  return out;
}
