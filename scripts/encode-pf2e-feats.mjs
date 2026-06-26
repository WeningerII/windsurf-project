/**
 * Encode PF2e Core Rulebook feats from Pf2eToolsOrg/Pf2eTools into the repo's
 * pf2e FeatDefinition data, closing the 93/814 srd:coverage gap.
 *
 * Source: https://github.com/Pf2eToolsOrg/Pf2eTools data/feats/feats-crb.json
 * (OGL; `source:"CRB"` — the same dataset the srd:coverage denominator uses;
 * see docs/srd-sources.md). Entries are emitted with source 'Core Rulebook'.
 *
 * These are GENUINE sourced CRB feats (the index.ts note records that an earlier
 * fabricated placeholder file was removed — so nothing here is invented). The
 * hand-written feats in general/skill/ancestry/class.ts ALWAYS win on name
 * match; only feats they don't already cover are generated. {@tag ...} markup is
 * reduced to display text; class/ancestry traits become class/race prerequisites,
 * the source prerequisite string is carried verbatim.
 *
 * Regeneration is idempotent: existing names are read only from the four
 * hand-written files (NOT generated.ts), so re-running re-derives the full set.
 *
 * Usage: node scripts/encode-pf2e-feats.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/feats/feats-crb.json';

// PF2e Core Rulebook ancestries + the two human heritage feat traits.
const ANCESTRIES = new Set([
  'dwarf',
  'elf',
  'gnome',
  'goblin',
  'halfling',
  'human',
  'half-elf',
  'half-orc',
]);
const CLASSES = new Set([
  'alchemist',
  'barbarian',
  'bard',
  'champion',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'ranger',
  'rogue',
  'sorcerer',
  'wizard',
]);

// Aggressive normalization (no spaces) so "Multi-Lingual"/"Multilingual" collide
// — matches the srd:coverage denominator's norm, the source of truth for "same feat".
const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const cap = (word) =>
  word
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

// Pf2eTools tags render different pipe-segments as their display text. Most
// tags are {@tag name|source|displayOverride} → the LAST non-empty segment.
// But several put display FIRST and carry link/filter metadata afterward, and
// {@class}/{@classFeature}/{@subclassFeature} carry the display in a fixed
// later slot. Taking the last segment for these leaks filter queries
// ("Rarity=Common"), source codes ("crb"), and page indices ("17") into prose.
const FIRST_SEGMENT_TAGS = new Set(['filter', 'quickref', 'footnote', 'link']);

function resolveTag(tag, inner) {
  const parts = inner.split('|').map((s) => s.trim());
  const t = tag.toLowerCase();
  // {@filter display|datasource|key=value...}, {@quickref display|book|page|anchor},
  // {@footnote displayText|note}, {@link displayText|url} → display is FIRST.
  if (FIRST_SEGMENT_TAGS.has(t)) return parts[0] || parts[parts.length - 1];
  // {@class name|source|displayText|locator|source} → 3rd segment (e.g. "abjurer").
  if (t === 'class') return parts[2] || parts[0];
  // {@classFeature name|class|classSource|level|displayText} → name, unless an
  // explicit display override is present.
  if (t === 'classfeature') return parts[4] || parts[0];
  // {@subclassFeature name|class|classSource|subclass|subclassSource|level|display}.
  if (t === 'subclassfeature') return parts[6] || parts[0];
  // {@runeItem base|baseSource|rune1|rune1Source|...} → "<runes> <base>".
  if (t === 'runeitem') {
    const runes = parts.filter((_, i) => i >= 2 && i % 2 === 0 && parts[i]);
    return [...runes, parts[0]].filter(Boolean).join(' ');
  }
  // Default {@tag name|source|displayOverride}: last non-empty, else the name.
  return parts[parts.length - 1] || parts[0];
}

/**
 * Reduce Pf2eTools {@tag value|link|display} markup to its display text. Tags
 * can nest (e.g. {@footnote ...{@link Label|URL}}), so match only innermost
 * tags ([^{}]) and loop until stable, resolving from the inside out.
 */
function detag(text) {
  let out = String(text);
  let previous;
  do {
    previous = out;
    out = out.replace(/\{@(\w+) ([^{}]*)\}/g, (_, tag, inner) => resolveTag(tag, inner));
  } while (out !== previous);
  // Pf2eTools sometimes prints dice in angle brackets inside a tag's display
  // (e.g. the deadly trait as "deadly <d10>"); render them as plain dice.
  return out.replace(/<(\d*d\d+)>/gi, '$1');
}

/** Flatten Pf2eTools nested `entries` into readable prose lines. */
function flattenEntries(entries) {
  const out = [];
  for (const entry of entries ?? []) {
    if (typeof entry === 'string') {
      out.push(detag(entry));
    } else if (entry && typeof entry === 'object') {
      if (entry.type === 'successDegree' && entry.entries) {
        for (const [degree, text] of Object.entries(entry.entries)) {
          out.push(`${degree}: ${detag(Array.isArray(text) ? text.join(' ') : text)}`);
        }
      } else if (Array.isArray(entry.entries)) {
        if (entry.name) out.push(`${entry.name}:`);
        out.push(...flattenEntries(entry.entries));
      } else if (Array.isArray(entry.items)) {
        out.push(...flattenEntries(entry.items));
      }
    }
  }
  return out.filter((line) => line.trim().length > 0);
}

const ts = (value) =>
  JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  // Existing names come ONLY from the hand-written files so regeneration is
  // idempotent and hand-authored feats always win.
  const handFiles = ['general', 'skill', 'ancestry', 'class'];
  const existingNames = new Set();
  const existingIds = new Set();
  for (const file of handFiles) {
    const mod = await import(`../src/data/pathfinder/2e/feats/${file}.ts`);
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        for (const feat of value) {
          if (feat?.name) existingNames.add(normalizeName(feat.name));
          if (feat?.id) existingIds.add(feat.id);
        }
      }
    }
  }

  const raw = (await (await fetch(SOURCE_URL)).json()).feat ?? [];

  // A feat can appear multiple times in feats-crb.json — once per class that
  // grants it (e.g. Animal Companion for Druid + Ranger, Cantrip Expansion for
  // four classes). Group by normalized name so the catalog has ONE entry per
  // feat, merging the granting classes into a single prerequisite.
  const groups = new Map();
  let skippedExisting = 0;
  for (const f of raw) {
    const key = normalizeName(f.name);
    if (existingNames.has(key)) {
      skippedExisting += 1;
      continue;
    }
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f);
  }

  const generated = [];
  const seenIds = new Set(existingIds);

  for (const group of groups.values()) {
    const f = group[0];
    const allTraits = new Set(group.flatMap((g) => (g.traits ?? []).map((t) => t.toLowerCase())));
    const classes = [...allTraits].filter((t) => CLASSES.has(t)).sort();
    const ancestry = [...allTraits].find((t) => ANCESTRIES.has(t));

    const prerequisites = [];
    if (classes.length) {
      prerequisites.push({ type: 'class', description: classes.map(cap).join(', ') });
    } else if (ancestry) {
      prerequisites.push({ type: 'race', description: cap(ancestry) });
    }
    if (f.prerequisites) {
      prerequisites.push({ type: 'other', description: detag(f.prerequisites) });
    }

    const lines = flattenEntries(f.entries);
    let id = slug(f.name);
    while (seenIds.has(id)) id = `${id}-feat`;
    seenIds.add(id);

    // NB: FeatDefinition (the catalog shape) does not model feat level — the
    // hand-written pf2e feats omit it too. The source level is available if the
    // catalog ever grows a level field; for now we match the existing shape.
    generated.push({
      id,
      name: f.name,
      system: 'pf2e',
      source: 'Core Rulebook',
      ...(prerequisites.length ? { prerequisites } : {}),
      description: lines[0] ?? f.name,
      benefits: lines.length > 1 ? lines.slice(1) : [],
      ...(f.special
        ? { special: detag(Array.isArray(f.special) ? f.special.join(' ') : f.special) }
        : {}),
    });
  }
  const report = { encoded: generated.length, skippedExisting };

  generated.sort((a, b) => a.id.localeCompare(b.id));

  writeFileSync(
    resolve('src/data/pathfinder/2e/feats/generated.ts'),
    `// GENERATED by scripts/encode-pf2e-feats.mjs from Pf2eToolsOrg/Pf2eTools
// (Core Rulebook feats, OGL — source:"CRB"; see docs/srd-sources.md). Genuine
// sourced feats, NOT placeholders. Hand-written feats in general/skill/ancestry/
// class.ts win on name match. Regenerate with: node scripts/encode-pf2e-feats.mjs

import { FeatDefinition } from '../../../../types/character-options/feats';

export const srdPf2eGeneratedFeats: FeatDefinition[] = [
${generated.map((feat) => ts(feat)).join(',\n')},
];
`
  );

  console.log(
    `generated.ts: ${report.encoded} feats encoded, ${report.skippedExisting} kept hand-written`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
