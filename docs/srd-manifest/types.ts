/**
 * SRD Manifest — DENOMINATOR A (content catalog).
 *
 * The repo's roadmap metric historically counted only the NUMERATOR: how many
 * entries are currently encoded and loader-backed. It had no DENOMINATOR — no
 * authoritative statement of how many open-content SRD entries a system *should*
 * contain. Without a denominator, "completeness" is undefined and a completion
 * goal can never terminate.
 *
 * A `SystemManifest` is that denominator: a cited, per-system list of every
 * open-content SRD entry that is in scope for the product. Completeness for a
 * (system x category) slice is then `encoded / inScopeManifestEntries`.
 *
 * Authoring rules (mirror docs/MASTER_PLAN.md open-content policy + the goal):
 *   - OPEN CONTENT ONLY. Every entry must be sourced from SRD / open-licensed
 *     material consistent with src/utils/openContentPolicy.ts.
 *   - CITED, NEVER INVENTED. Every entry carries a `source` citation. If an
 *     entry cannot be verified against an open source, mark it `flagged` (it is
 *     excluded from the denominator) rather than fabricating it.
 *   - `id` SHOULD match the loader-backed data id once the entry is `encoded`,
 *     so the metric can join manifest -> data without guesswork.
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
 */
export type ManifestEntryStatus = 'encoded' | 'missing' | 'flagged' | 'excluded';

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

/** An entry counts toward the denominator unless flagged or excluded. */
export function isInScope(entry: SrdManifestEntry): boolean {
  return entry.status === 'encoded' || entry.status === 'missing';
}

/** Denominator (in-scope) and numerator (encoded) counts for one category. */
export function categoryProgress(
  manifest: SystemManifest,
  category: ManifestCategory
): { denominator: number; numerator: number } {
  const inCategory = manifest.entries.filter((e) => e.category === category);
  return {
    denominator: inCategory.filter(isInScope).length,
    numerator: inCategory.filter((e) => e.status === 'encoded').length,
  };
}
