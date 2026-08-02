/**
 * Pure, side-effect-free SHAPE helpers for the SRD coverage measurement
 * (`src/scripts/srd-coverage.ts`). This module performs NO network or `fs` I/O,
 * so it is safe to import from unit tests without triggering `srd-coverage`'s
 * `main()` / fetches. `srd-coverage.ts` fetches the raw independent SRD lists;
 * these helpers reshape both sides so that:
 *
 *   1. the monster denominators count INDIVIDUAL stat blocks — every heading
 *      that owns a stat table, at whatever markdown depth it sits — and not the
 *      taxonomic CONTAINER headings/records that merely nest separately-named
 *      members (3.5e SRD group headers; PF1e bestiary dragon/elemental
 *      parents), and
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

/**
 * Over-inclusion (provenance suspect) filter, kept SYMMETRIC with the forward
 * coverage pass. A loader entry is a suspect only when NONE of its
 * `loaderNormVariants` — plain norm, `"Prefix: "` strip, trailing `"(…)"`
 * strip, and the confirmed qualifier word-order swap — matches an SRD key.
 *
 * Applying the SAME loader-side normalization the coverage pass already uses
 * stops a qualifier-named loader variant ("Magic Initiate (Cleric)", "Fighting
 * Style: Archery") from printing as a nominal over-inclusion row when the SRD
 * ships the plain base ("Magic Initiate", "Archery") — the asymmetry noted in
 * docs/GAPS.md. It still flags a genuinely non-SRD entry, whose stripped base
 * has no SRD counterpart (loader "Greater Fireball" vs an SRD with only
 * "Fireball" stays a suspect), so a real gap is never hidden.
 */
export function overInclusionSuspects(
  loaderNames: string[],
  srdKeys: ReadonlySet<string>
): string[] {
  return loaderNames.filter((name) => !loaderNormVariants(name).some((k) => srdKeys.has(k)));
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

// --- D&D 3.5e monster chapter parse + heading collapse ----------------------

/**
 * One heading from the olimot SRD 3.5 monster chapters, carrying the single
 * fact the denominator turns on: whether the heading's OWN body prints a stat
 * table.
 *
 * The chapters are THREE levels deep and the level does NOT predict what a
 * heading is. A `## ` may be an individual creature (`## Aboleth`), a combined
 * multi-column stat block (`## Salamander`, `## Formian`), a prose taxonomic
 * container whose members are `### ` children (`## Angel`, `## Demon`), or
 * chapter prose that is not a creature at all (`## Reading the Entries`). A
 * `### ` may be an individual stat block (`### Balor`, `### Djinni`,
 * `### Air Elemental`, `### Black Dragon`) or ordinary prose (`### Combat`,
 * `### Greater Barghest`). Only the presence of a stat table separates them.
 */
export interface Srd35eMonsterHeading {
  /** Markdown depth. Only 2 and 3 are collected; no `#### ` owns a stat table. */
  level: 2 | 3;
  /** Heading text, verbatim. */
  name: string;
  /** Enclosing `## ` heading for a `### `; `null` for a `## ` itself. */
  parent: string | null;
  /**
   * The heading's OWN body — everything up to the next heading of ANY depth —
   * contains a stat table. Deliberately NOT the whole subtree: a prose container
   * must not inherit its children's stat blocks.
   */
  hasStatBlock: boolean;
}

/**
 * The stat-block discriminator: a stat-table CELL whose entire content is the
 * Hit Dice label.
 *
 * Every olimot stat block is an HTML table whose first data row labels Hit Dice;
 * nothing else in the chapters produces that cell. Three details are
 * load-bearing and each was verified against the upstream chapters:
 *
 *   - `<t[hd]>` rather than `<th>`: `### Kolyarut` and `### Lemure` are real
 *     stat blocks whose label cells are `<td>`, not `<th>`. A `<th>`-only test
 *     silently drops both.
 *   - `Hit Dice (hp)` as well as `Hit Dice:`: the ten true dragons
 *     (`### Black Dragon` … `### Silver Dragon`) print a by-age table whose
 *     column header is `Hit Dice (hp)`. A `Hit Dice:`-only test finds no dragon
 *     in the entire SRD.
 *   - the surrounding cell tags: the bare string "Hit Dice" appears in ordinary
 *     prose ("A barghest that reaches 9 Hit Dice through feeding…", the
 *     "Racial Hit Dice" paragraph in every "X as Characters" section), so a
 *     substring test counts ~25 prose sections as creatures.
 */
const SRD_35E_STAT_TABLE_CELL = /<t[hd]>\s*Hit Dice(?::|\s*\(hp\))\s*<\/t[hd]>/i;

/**
 * Parse one olimot SRD 3.5 monster chapter into its `## ` / `### ` headings.
 * Pure: takes the chapter text, does no I/O. Call once per chapter and
 * concatenate — `parent` is only meaningful within a chapter.
 */
export function parseSrd35eMonsterHeadings(markdown: string): Srd35eMonsterHeading[] {
  const lines = markdown.split('\n');
  const headings: Array<{ level: number; name: string; line: number }> = [];
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6}) (.+)$/);
    if (match) headings.push({ level: match[1].length, name: match[2].trim(), line: index });
  });

  const out: Srd35eMonsterHeading[] = [];
  let parent: string | null = null;
  headings.forEach((heading, index) => {
    if (heading.level === 2) parent = heading.name;
    if (heading.level !== 2 && heading.level !== 3) return;
    // Own body only: up to the NEXT heading of any depth.
    const end = index + 1 < headings.length ? headings[index + 1].line : lines.length;
    const body = lines.slice(heading.line + 1, end).join('\n');
    out.push({
      level: heading.level,
      name: heading.name,
      parent: heading.level === 2 ? null : parent,
      hasStatBlock: SRD_35E_STAT_TABLE_CELL.test(body),
    });
  });
  return out;
}

/**
 * NON-stat-block `## ` headings the chapters carry that are NOT creatures:
 * chapter/section prose ("Reading the Entries", "Combat", "Dragon, True" — the
 * true-dragon chapter preamble covering age categories, overland movement and
 * dragonhide) and TEMPLATE headers applied to an existing base creature rather
 * than shipped as their own monster ("Celestial Creature", "Fiendish Creature",
 * "Half-Celestial", "Half-Fiend").
 *
 * This list is EXPLICIT and deliberately narrow. It could be derived — these
 * are exactly the `## ` headings with neither a stat table nor a counted
 * `### ` child — but that derivation would also swallow "Ghost", "Lich",
 * "Vampire" and "Half-Dragon", four template sections the repo has already
 * ruled are countable individuals and therefore genuine misses. Dropping them
 * would improve the published percentage by hiding four real gaps, so they stay
 * off this list and stay counted.
 */
export const SRD_35E_MONSTER_NONBLOCK_HEADINGS: readonly string[] = [
  'Reading the Entries',
  'Combat',
  'Dragon, True',
  'Celestial Creature',
  'Fiendish Creature',
  'Half-Celestial',
  'Half-Fiend',
];

/**
 * The ONLY `### ` sections that print a stat table without being a creature.
 * Each is excluded BY NAME under its parent, with the reason it is not a
 * creature — there are exactly three in the whole corpus, and a structural rule
 * that caught them would also catch real monsters.
 *
 * Every other stat-table `### ` is a creature and is counted.
 */
export const SRD_35E_NON_CREATURE_STAT_SECTIONS: ReadonlyArray<{
  parent: string;
  name: string;
  reason: string;
}> = [
  {
    parent: 'Skeleton',
    name: 'Creating a Skeleton',
    // The section is the skeleton TEMPLATE's worked example: one nine-column
    // table of sample skeletons made from other monsters (Human Warrior, Wolf,
    // Owlbear, Troll, Chimera, Ettin, Advanced Megaraptor, Cloud Giant, Young
    // Adult Red Dragon Skeleton). None is an SRD monster in its own right; the
    // countable entry is the parent `## Skeleton`, which keeps its place in the
    // denominator because this is its only stat-table child.
    reason: 'template worked example — sample skeletons built from other monsters',
  },
  {
    parent: 'Zombie',
    name: 'Creating a Zombie',
    // Same shape as Creating a Skeleton: the zombie template's eight-column
    // sample table (Kobold, Human Commoner, Troglodyte, Bugbear, Ogre, Minotaur,
    // Wyvern, Gray Render Zombie). `## Zombie` stays the countable entry.
    reason: 'template worked example — sample zombies built from other monsters',
  },
  {
    parent: 'Horse',
    name: 'Combat',
    // "Combat" is the chapter's prose sub-heading, used ~200 times across the
    // corpus; under `## Horse` alone it happens to also carry the horse stat
    // tables. The creature name is the parent `## Horse`, so counting the child
    // would put the literal string "Combat" in the denominator. Excluded by
    // PARENT + name, so the ~200 other prose `### Combat` sections are untouched
    // and `## Horse` — left with no counted child — stays counted itself.
    reason: 'prose sub-heading that happens to hold the horse stat tables',
  },
];

/**
 * Reshape the parsed monster-chapter headings into an individual-stat-block
 * list.
 *
 * The rule is structural, in this order:
 *
 *   1. A `### ` is counted iff it owns a stat table and is not one of the three
 *      `SRD_35E_NON_CREATURE_STAT_SECTIONS`.
 *   2. A `## ` that owns a stat table is counted (this includes the combined
 *      multi-column blocks — Salamander, Hydra, Formian, Fungus, Arrowhawk,
 *      Animated Object — which are ONE stat block covering several named
 *      variants).
 *   3. A `## ` that owns no stat table is a CONTAINER, and dropped, iff at
 *      least one `### ` child was counted at step 1. Its members carry the
 *      count. Because step 1 runs first, `## Skeleton`, `## Zombie` and
 *      `## Horse` — whose only stat-table children are excluded — are left with
 *      no counted child and stay counted themselves.
 *   4. Everything else with no stat table is counted unless it is on
 *      `SRD_35E_MONSTER_NONBLOCK_HEADINGS`, which preserves Ghost / Lich /
 *      Vampire / Half-Dragon as genuine misses.
 *
 * Deriving the container set at step 3 replaces the hand-maintained category
 * list this function used to carry. That list had drifted from the source in
 * both directions: three of its entries ('Dragon', 'True Dragon', 'Slaad')
 * matched no heading in the chapters at all — "Slaad" does not occur anywhere —
 * and 'Formian' was wrong, dropping a `## ` that owns its own combined
 * Worker/Warrior/Taskmaster/Myrmarch/Queen table and whose `### ` children own
 * none, so the formians left the denominator entirely.
 *
 * Order is preserved and names are de-duplicated by `norm`.
 */
export function collapse35eMonsterHeadings(headings: Srd35eMonsterHeading[]): string[] {
  const excluded = new Set(
    SRD_35E_NON_CREATURE_STAT_SECTIONS.map((s) => `${norm(s.parent)}|${norm(s.name)}`)
  );
  const nonBlock = new Set(SRD_35E_MONSTER_NONBLOCK_HEADINGS.map(norm));

  const isCountedChild = (h: Srd35eMonsterHeading): boolean =>
    h.level === 3 &&
    h.hasStatBlock &&
    !excluded.has(`${norm(h.parent ?? '')}|${norm(h.name)}`) &&
    !nonBlock.has(norm(h.name));

  const containers = new Set(headings.filter(isCountedChild).map((h) => norm(h.parent ?? '')));

  const seen = new Set<string>();
  const kept: string[] = [];
  for (const heading of headings) {
    const name = heading.name.trim();
    if (!name) continue;
    const counted =
      heading.level === 3
        ? isCountedChild(heading)
        : !nonBlock.has(norm(name)) && (heading.hasStatBlock || !containers.has(norm(name)));
    if (!counted) continue;
    const key = norm(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    kept.push(name);
  }
  return kept;
}
