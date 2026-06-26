/**
 * Encode PF2e Core Rulebook backgrounds from Pf2eToolsOrg/Pf2eTools into the
 * repo's Pf2eBackgroundDefinition data, closing the 16/35 srd:coverage gap.
 *
 * Source: https://github.com/Pf2eToolsOrg/Pf2eTools data/backgrounds/backgrounds-crb.json
 * (OGL; `source:"CRB"` — the same dataset family the srd:coverage denominator
 * uses; see docs/srd-sources.md). Entries are emitted with source 'Core Rulebook'.
 *
 * These are GENUINE sourced CRB backgrounds, NOT placeholders. The hand-written
 * backgrounds in index.ts ALWAYS win on name match; only backgrounds they don't
 * already cover are generated. {@tag ...} markup is reduced to display text.
 *
 * Mapping (matches the existing hand-written Pf2eBackgroundDefinition shape):
 *   - boosts[]  -> abilityBoosts { options: [<3-letter>, ...], label }
 *   - skills[]  -> skillTraining (string for one; { options, label } for a choice)
 *   - lore[]    -> loreTraining ('<name>-lore' for one; { options, label } for examples)
 *   - feats[]   -> feat { id, name, type:'skill', description } (all CRB background
 *                  feat grants are skill feats; Martial Disciple's conditional
 *                  Cat Fall/Quick Jump grant is parsed from its entries text).
 *
 * Regeneration is idempotent: existing names are read only from index.ts, so
 * re-running re-derives the full generated set.
 *
 * Usage: node scripts/encode-pf2e-backgrounds.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/backgrounds/backgrounds-crb.json';

const ABILITY_ABBR = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
};
const ABILITY_LABEL = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Title-case a skill name ('nature' -> 'Nature'). */
const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Reduce Pf2eTools {@tag value|link|display} markup to its display text. Tags
 * can nest, so match only innermost tags and loop until stable. (Mirrors the
 * detag() in encode-pf2e-feats.mjs.)
 */
function detag(text) {
  let out = String(text);
  let previous;
  do {
    previous = out;
    out = out.replace(/\{@\w+ ([^{}]*)\}/g, (_, inner) => {
      const parts = inner.split('|');
      return parts[parts.length - 1].trim() || parts[0].trim();
    });
  } while (out !== previous);
  return out;
}

const ts = (value) =>
  JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

/** Build the abilityBoosts label from the two fixed boosts (the third is free). */
function boostLabel(options) {
  const named = options.map((o) => ABILITY_LABEL[o]);
  return `${named.join(' or ')}, plus one free`;
}

/** Map a background's skills[] to skillTraining (string or choice). */
function skillTraining(skills) {
  if (skills.length === 1) return skills[0];
  return {
    options: skills,
    label: skills.map(titleCase).join(' or '),
  };
}

/**
 * Map a background's lore[] to loreTraining. A single lore is a fixed
 * '<name>-lore'. Multiple lore entries in the CRB source are *examples* of a
 * terrain/topic the player picks (e.g. Animal Whisperer "such as Plains Lore or
 * Swamp Lore"), so they become a choice with the example label.
 */
function loreTraining(lore) {
  if (lore.length === 1) return `${slug(lore[0])}-lore`;
  return {
    options: lore.map((l) => `${slug(l)}-lore`),
    label: `A Lore skill such as ${lore.map((l) => `${l} Lore`).join(' or ')}`,
  };
}

/**
 * Map a background to its granted feat. CRB background feat grants are skill
 * feats. Most have a single `feats` entry; Martial Disciple lists none (its
 * grant is conditional on the chosen skill) so we parse the {@feat ...} names
 * from the rules text and record the conditional grant.
 */
function buildFeat(bg) {
  const description = `Granted by the ${bg.name} background.`;
  if (Array.isArray(bg.feats) && bg.feats.length > 0) {
    const name = bg.feats[0];
    return { id: slug(name), name, type: 'skill', description };
  }
  // No explicit feat: pull {@feat Name} references from the entries prose.
  const text = (bg.entries ?? []).join(' ');
  const refs = [...text.matchAll(/\{@feat ([^}|]+)(?:\|[^}]*)?\}/g)].map((m) => m[1].trim());
  if (refs.length > 0) {
    const name = refs.join(' or ');
    return {
      id: slug(refs[0]),
      name,
      type: 'skill',
      description: `Granted by the ${bg.name} background (depending on your chosen skill).`,
    };
  }
  // Should not happen for CRB backgrounds, but keep the shape valid.
  return { id: `${slug(bg.name)}-feat`, name: `${bg.name} Feat`, type: 'skill', description };
}

async function main() {
  // Existing names come ONLY from the hand-written backgrounds (NOT the combined
  // pf2eBackgrounds export, which already folds in generated.ts) so regeneration
  // is idempotent and hand-authored backgrounds always win.
  const mod = await import('../src/data/pathfinder/2e/backgrounds/index.ts');
  const handWritten = mod.handWrittenBackgrounds ?? mod.pf2eBackgrounds ?? [];
  const existingNames = new Set();
  const existingIds = new Set();
  for (const bg of handWritten) {
    if (bg?.name) existingNames.add(normalizeName(bg.name));
    if (bg?.id) existingIds.add(bg.id);
  }

  const raw = JSON.parse(await (await fetch(SOURCE_URL)).text()).background ?? [];

  const generated = [];
  const seenIds = new Set(existingIds);
  let skippedExisting = 0;
  const seenNames = new Set();

  for (const bg of raw) {
    if (bg.source !== 'CRB') continue;
    const key = normalizeName(bg.name);
    if (existingNames.has(key)) {
      skippedExisting += 1;
      continue;
    }
    // Dedupe by normalized name across the source list.
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    const options = (bg.boosts ?? [])
      .filter((b) => b !== 'free')
      .map((b) => ABILITY_ABBR[b])
      .filter(Boolean);

    let id = `pf2e-bg-${slug(bg.name)}`;
    while (seenIds.has(id)) id = `${id}-bg`;
    seenIds.add(id);

    generated.push({
      id,
      name: bg.name,
      source: 'Core Rulebook',
      description: detag((bg.entries ?? [])[0] ?? bg.name),
      abilityBoosts: { options, label: boostLabel(options) },
      skillTraining: skillTraining(bg.skills ?? []),
      loreTraining: loreTraining(bg.lore ?? []),
      feat: buildFeat(bg),
    });
  }

  generated.sort((a, b) => a.id.localeCompare(b.id));

  writeFileSync(
    resolve('src/data/pathfinder/2e/backgrounds/generated.ts'),
    `// GENERATED by scripts/encode-pf2e-backgrounds.mjs from Pf2eToolsOrg/Pf2eTools
// (Core Rulebook backgrounds, OGL — source:"CRB"; see docs/srd-sources.md).
// Genuine sourced backgrounds, NOT placeholders. Hand-written backgrounds in
// index.ts win on name match. Regenerate with:
//   node scripts/encode-pf2e-backgrounds.mjs

import type { Pf2eBackgroundDefinition } from '../../../../types/character-options/pf2eBackgrounds';

export const srdPf2eGeneratedBackgrounds: Pf2eBackgroundDefinition[] = [
${generated.map((bg) => ts(bg)).join(',\n')},
];
`
  );

  console.log(
    `generated.ts: ${generated.length} backgrounds encoded, ${skippedExisting} kept hand-written`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
