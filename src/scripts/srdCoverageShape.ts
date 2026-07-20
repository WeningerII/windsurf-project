/**
 * Pure, side-effect-free SHAPE helpers for the SRD coverage measurement
 * (`src/scripts/srd-coverage.ts`). This module performs NO network or `fs` I/O,
 * so it is safe to import from unit tests without triggering `srd-coverage`'s
 * `main()` / fetches. `srd-coverage.ts` fetches the raw independent SRD lists;
 * these helpers reshape both sides so that:
 *
 *   1. the monster denominators count INDIVIDUAL stat blocks, not the taxonomic
 *      CONTAINER headings/records that merely nest separately-named members
 *      (3.5e SRD category headers; PF1e bestiary dragon/elemental parents), and
 *   2. confirmed naming-CONVENTION variants ("Greater Invisibility" vs
 *      "Invisibility, Greater") match across the SRD and loader sides instead of
 *      being double-counted as a "missing" entry and an over-inclusion suspect.
 *
 * Every transform here is additive and word-boundary conservative: it only
 * affects the specific container/variant/qualifier shapes documented below, and
 * leaves genuinely-missing individuals and genuine non-SRD content untouched
 * (honest over-inclusion is preferred to hiding a real gap).
 */

/** Lowercase + strip every non-alphanumeric run to a comparison key. */
export const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

// --- Confirmed naming-convention (qualifier word-order) variants ------------

/**
 * SRD spell chapters alphabetize qualified spells by the base name — "Greater
 * Invisibility" is listed as "Invisibility, Greater"; "Mass Cure Light Wounds"
 * as "Cure Light Wounds, Mass". The loaders ship the natural-language form. That
 * pure word-order difference otherwise shows up as BOTH a "missing" SRD entry
 * and an over-inclusion suspect. These are the ONLY qualifiers folded — a
 * conservative, confirmed set; anything else stays flagged.
 */
const ORDER_QUALIFIERS = ['greater', 'lesser', 'mass'] as const;

/**
 * Normalized keys for the word-order swap of a leading/trailing qualifier.
 * "Greater Invisibility" → also `norm("Invisibility Greater")`;
 * "Invisibility, Greater" → also `norm("Greater Invisibility")`.
 * Returns `[]` for names without such a qualifier, so callers that spread it
 * into a key set are unaffected for every other entry.
 */
export function qualifierOrderVariants(raw: string): string[] {
  const trimmed = raw.trim();
  const out = new Set<string>();
  for (const q of ORDER_QUALIFIERS) {
    const lead = trimmed.match(new RegExp(`^${q}[\\s,]+(.+)$`, 'i'));
    if (lead) out.add(norm(`${lead[1]} ${q}`));
    const trail = trimmed.match(new RegExp(`^(.+?)[\\s,]+${q}$`, 'i'));
    if (trail) out.add(norm(`${q} ${trail[1]}`));
  }
  out.delete('');
  return [...out];
}

/**
 * Normalized match keys for a LOADER entry. A loader entry may encode an SRD
 * entry under a qualified name — the SRD 5.2 feat "Archery" ships as "Fighting
 * Style: Archery", "Magic Initiate" pre-split as "Magic Initiate (Cleric)".
 * Matching the prefix-/parenthetical-stripped form (and the confirmed qualifier
 * word-order swap) keeps coverage honest without id-breaking renames of shipped
 * data.
 */
export function loaderNormVariants(s: string): string[] {
  const variants = new Set([norm(s)]);
  variants.add(norm(s.replace(/^[\w\s]+:\s*/, '')));
  variants.add(norm(s.replace(/\s*\([^)]*\)\s*$/, '')));
  for (const v of qualifierOrderVariants(s)) variants.add(v);
  variants.delete('');
  return [...variants];
}

/**
 * Normalized match keys for an SRD entry, used when computing over-inclusion
 * suspects (loader entries absent from the SRD). Symmetric to
 * `loaderNormVariants` for the confirmed qualifier word-order swap ONLY, so a
 * loader "Greater Invisibility" is cleared against an SRD "Invisibility,
 * Greater" — without masking any genuinely non-SRD loader entry (whose base
 * name has no matching SRD counterpart).
 */
export function srdNormVariants(s: string): string[] {
  const variants = new Set([norm(s)]);
  for (const v of qualifierOrderVariants(s)) variants.add(v);
  variants.delete('');
  return [...variants];
}

// --- PF1e bestiary container-record collapse --------------------------------

/**
 * Collapse PF1e bestiary CONTAINER/parent records so the denominator counts
 * individual stat blocks. The pinned manifest lists dragon and elemental
 * parents ("Dragon, Chromatic, Black", "Elemental, Air") whose age/size stat
 * blocks the loader encoded under distinct names — the parent itself is not a
 * stat block, so it otherwise counts as a spurious "missing" entry.
 *
 * A record is a container iff at least `minChildren` OTHER records are its
 * comma-descendants (`"<record>, …"`). The 10 dragon parents (each →
 * Young/Adult/Ancient) and 4 elemental parents (each → six sizes) qualify; the
 * age/size children themselves stay as individuals. Single-child pairs like
 * "Barghest"/"Barghest, Greater" or "Shadow"/"Shadow, Greater" have only ONE
 * descendant, so both remain individual stat blocks — and genuine misses such
 * as "Skeletal Champion" (no descendants) are preserved untouched.
 *
 * The comma in the `", "` boundary is load-bearing: it stops "Werewolf" from
 * swallowing "Werewolf (Hybrid Form)".
 */
export function collapsePf1eContainerRecords(names: string[], minChildren = 2): string[] {
  const isContainer = (name: string): boolean => {
    const prefix = `${name}, `;
    let children = 0;
    for (const other of names) {
      if (other !== name && other.startsWith(prefix) && ++children >= minChildren) return true;
    }
    return false;
  };
  return names.filter((name) => !isContainer(name));
}

/** The PF1e records that `collapsePf1eContainerRecords` removes, for reporting/tests. */
export function pf1eContainerRecords(names: string[], minChildren = 2): string[] {
  const kept = new Set(collapsePf1eContainerRecords(names, minChildren));
  return names.filter((name) => !kept.has(name));
}

// --- D&D 3.5e monster heading collapse --------------------------------------

/**
 * SRD 3.5 monster GROUP headers — taxonomic containers that nest several
 * separately-named member stat blocks (Angel → Astral Deva / Planetar / Solar;
 * Elemental → Air/Earth/Fire/Water; Genie → Djinni / Efreeti / Janni). Each
 * member is counted on its own entry, so the bare group header is NOT an
 * individual stat block and inflates the denominator.
 *
 * Confirmed INDIVIDUALS are deliberately EXCLUDED — Salamander, Hydra, Lich and
 * Ghost are single stat blocks (with, at most, their own inline variants), so
 * they remain genuine misses while unencoded rather than being hidden.
 */
export const SRD_35E_MONSTER_CATEGORY_HEADINGS: readonly string[] = [
  'Angel',
  'Archon',
  'Demon',
  'Devil',
  'Dragon',
  'Dragon, True',
  'True Dragon',
  'Elemental',
  'Formian',
  'Genie',
  'Giant',
  'Golem',
  'Hag',
  'Inevitable',
  'Lycanthrope',
  'Mephit',
  'Naga',
  'Nightshade',
  'Slaad',
  'Sphinx',
];

/**
 * Dragon AGE and elemental/creature SIZE descriptors the SRD prefixes onto a
 * base creature ("Adult Black Dragon", "Large Air Elemental"). Folding them to
 * the archetype makes the denominator count one stat block per creature rather
 * than one per age/size row. Ordered longest-first so multi-word variants match
 * before their sub-words ("Young Adult" before "Young"/"Adult"). These are the
 * ONLY tokens folded, so genus/species commas ("Bear, Black") and descriptors
 * outside this set ("Dire Bear") are left intact.
 */
const SRD_35E_VARIANT_WORDS = [
  'great wyrm',
  'young adult',
  'mature adult',
  'very young',
  'very old',
  'wyrmling',
  'juvenile',
  'greater',
  'ancient',
  'medium',
  'young',
  'adult',
  'small',
  'large',
  'elder',
  'wyrm',
  'huge',
  'old',
].sort((a, b) => b.length - a.length);

/** Strip a single recognized leading/trailing age/size variant word, if present. */
function foldMonsterVariant(name: string): string {
  const n = name.trim();
  for (const w of SRD_35E_VARIANT_WORDS) {
    const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lead = new RegExp(`^${esc}[\\s,]+(.+)$`, 'i');
    const mLead = n.match(lead);
    if (mLead) return mLead[1].trim();
    const trail = new RegExp(`^(.+?)[\\s,]+${esc}$`, 'i');
    const mTrail = n.match(trail);
    if (mTrail) return mTrail[1].trim();
  }
  return n;
}

/**
 * Reshape the raw `## ` monster headings from the olimot SRD 3.5 chapters into
 * an individual-stat-block list: drop the taxonomic category CONTAINER headers
 * (`SRD_35E_MONSTER_CATEGORY_HEADINGS`) and fold age/size variant rows to their
 * archetype (first occurrence wins; later variants of the same archetype are
 * de-duplicated). Order is preserved. Genuine standalone monsters and genuine
 * misses (Salamander, Hydra, …) pass through unchanged.
 */
export function collapse35eMonsterHeadings(headings: string[]): string[] {
  const categorySet = new Set(SRD_35E_MONSTER_CATEGORY_HEADINGS.map(norm));
  const seenArchetype = new Set<string>();
  const kept: string[] = [];
  for (const heading of headings) {
    const name = heading.trim();
    if (!name || categorySet.has(norm(name))) continue;
    const archetype = foldMonsterVariant(name);
    const key = norm(archetype);
    if (!key || seenArchetype.has(key)) continue;
    seenArchetype.add(key);
    kept.push(archetype);
  }
  return kept;
}
