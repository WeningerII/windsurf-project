/**
 * SRD Manifest — PROVENANCE ONLY (shipped-content inventory).
 *
 * DEMOTED 2026-07-27 (decided 2026-07-21; docs/GAPS.md §6). This was Denominator
 * A: a per-system list of in-scope open-content entries, with completeness read
 * as `encoded / inScopeManifestEntries`. That could not work. The manifests are
 * GENERATED FROM the loaders by `npm run srd:manifests`, so the ids were both
 * numerator and denominator — the ratio could only ever read 100%, and did,
 * even for a category whose manifest had drifted to roughly a tenth of what its
 * loader ships. A denominator the product can move is not a denominator.
 *
 * **Denominator A is now `docs/generated/srd-coverage.md`** — the independent
 * networked reverse diff, whose entry lists come from open-content SRD indexes
 * outside this repo. Nothing may compute a content-completeness percentage from
 * the types below; doing so would restore the circularity this demotion exists
 * to remove.
 *
 * What a `SystemManifest` is now: a cited inventory of what the product ships,
 * for provenance questions — which entries claim which source, and which are
 * self-authored rather than transcribed (`original`). The per-system manifests
 * are generated on demand and gitignored; this schema and the hand-authored
 * `_exclusions.ts` registry stay committed.
 *
 * Authoring rules (mirror docs/MASTER_PLAN.md open-content policy + the goal):
 *   - OPEN CONTENT ONLY. Every entry must be sourced from SRD / open-licensed
 *     material consistent with src/utils/openContentPolicy.ts.
 *   - CITED, NEVER INVENTED. Every entry carries a `source` citation. If an
 *     entry cannot be verified against an open source, mark it `flagged` (it is
 *     excluded from the open-content population) rather than fabricating it.
 *   - `id` SHOULD match the loader-backed data id once the entry is `encoded`,
 *     so a provenance question can be traced manifest -> data without guesswork.
 */

/**
 * Game system identifiers. MUST stay in sync with `GameSystemId` in
 * src/types/game-systems.ts and the `systems` table in
 * src/scripts/generate-roadmap-metrics.ts. Kept as a local union (no cross-tree
 * import) so the manifests stay dependency-free and resilient to refactors.
 */
export type ManifestSystemId =
  | 'dnd-5e-2014'
  | 'dnd-5e-2024'
  | 'dnd-3.5e'
  | 'pf1e'
  | 'pf2e'
  | 'mam3e'
  | 'daggerheart';

/**
 * Content categories. The first block mirrors the canonical `LoaderCategory`
 * set in src/scripts/generate-roadmap-metrics.ts so the metric can compare a
 * manifest category directly against its loader total. The second block covers
 * system-specific catalogs that the goal's Denominator A enumerates.
 */
export type ManifestCategory =
  // canonical loader categories (align with generate-roadmap-metrics.ts)
  | 'spells'
  | 'classes'
  | 'species'
  | 'backgrounds'
  | 'traits'
  | 'featureOptions'
  | 'archetypes'
  | 'complications'
  | 'monsters'
  | 'equipment'
  | 'feats'
  | 'advantages'
  | 'powerModifiers'
  // system-specific catalogs enumerated by the completion goal
  | 'subclasses'
  | 'prestigeClasses'
  | 'heritages'
  | 'powers'
  | 'measurements'
  | 'domains'
  | 'domainCards'
  | 'communities'
  | 'environments'
  | 'adversaries'
  | 'conditions'
  | 'hazards'
  | 'deities';

/**
 * Per-entry status.
 *   - `encoded`  : loader-backed data exists for this id; counts toward numerator.
 *   - `missing`  : in scope and expected, but not yet encoded (the work to do).
 *   - `flagged`  : could not be verified from an open source; excluded from the
 *                  denominator and surfaced for human review. NEVER invent.
 *   - `excluded` : intentionally out of scope (see docs/srd-manifest/_exclusions.ts);
 *                  excluded from the denominator. Must cite a reason.
 *   - `original` : SHIPS, and its citation is honest, but the entry was AUTHORED
 *                  by this project rather than transcribed from an open document
 *                  (a source declared in `originalContentSources`,
 *                  src/utils/openContentPolicy.ts). Enumerated here so the
 *                  catalog stays a complete inventory of what ships, but
 *                  excluded from the OPEN-CONTENT denominator — this manifest's
 *                  denominator answers "how much open content should we have",
 *                  and self-authored entries are not an answer to that. Folding
 *                  them in would restate a non-open-content population as
 *                  open-content parity. See docs/mam3e-equipment-provenance.md.
 */
export type ManifestEntryStatus = 'encoded' | 'missing' | 'flagged' | 'excluded' | 'original';

export interface SrdManifestEntry {
  /** Stable id; matches the loader data id once `encoded`. */
  id: string;
  category: ManifestCategory;
  name: string;
  /** Citation, e.g. "D&D 5e SRD 5.1 §Spells" or "PF2e SRD: Bestiary". */
  source: string;
  status: ManifestEntryStatus;
  /** Required when status is `flagged` or `excluded`: why. */
  note?: string;
}

export interface SystemManifest {
  systemId: ManifestSystemId;
  /** Open-content edition this denominator is cited against, e.g. "SRD 5.1". */
  srdVersion: string;
  entries: SrdManifestEntry[];
}

/**
 * An entry belongs to the OPEN-CONTENT population unless flagged, excluded, or
 * `original` (self-authored — cited and shipping, but not open content).
 *
 * This is a provenance predicate, NOT a denominator. The `categoryProgress`
 * helper that used to sit beside it — returning `{denominator, numerator}` per
 * category — was deleted with the demotion (docs/GAPS.md §6): its denominator
 * was derived from the same loaders as its numerator, so it could only ever
 * report 100%. Content coverage comes from docs/generated/srd-coverage.md.
 */
export function isInScope(entry: SrdManifestEntry): boolean {
  return entry.status === 'encoded' || entry.status === 'missing';
}
