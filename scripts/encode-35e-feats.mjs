/**
 * Encode the missing SRD 3.5 core FEATS from olimot/srd-v3.5-md (OGL — the clean
 * core-only source the srd:coverage 3.5e denominator already reads; see
 * docs/srd-sources.md). Sibling of scripts/encode-35e-spells.mjs and
 * scripts/encode-35e-monsters.mjs.
 *
 * Source layout — one block per feat under `## Feat Descriptions`:
 *   ### Name <small>[General|Item Creation|Metamagic|Special]</small>
 *   optional lead prose paragraph(s)
 *   **Prerequisite:** / **Prerequisites:** comma-separated list
 *   **Benefit:** one or more paragraphs
 *   **Normal:** what a character WITHOUT the feat does (optional)
 *   **Special:** extra rules, e.g. fighter-bonus-feat eligibility (optional)
 * The `<small>[...]</small>` type tag is what distinguishes a real feat from the
 * untagged category sub-headers, and the literal "Feat Name" documentation
 * template row is dropped — the same discrimination `fetchSrd35FeatNames`
 * (src/scripts/srd-coverage.ts) applies to build the coverage denominator, so
 * the encoder and the measurement read the same 110 entries.
 *
 * Repo conventions: '-35e' slug ids, `source: 'SRD 3.5'` (the only open-content
 * provenance `strictOpenContentPolicy` allows for dnd-3.5e), and the HAND-WRITTEN
 * baseline always wins: any feat whose normalized name or slug id already ships
 * in ./general.ts, ./metamagic.ts, ./item-creation.ts or ./magic.ts is skipped,
 * so this encoder only ever ADDS the entries the SRD has and the repo lacks.
 *
 * Honest-mapping rules (nothing is guessed or invented):
 *  - `description` is the block's own lead prose when the SRD provides one, else
 *    the first **Benefit:** paragraph. Never synthesized flavor text.
 *  - `benefits[]` are the remaining **Benefit:** paragraphs verbatim, followed by
 *    the **Normal:** text carried with its SRD label (`Normal: …`) — the
 *    FeatDefinition shape has no `normal` field and dropping it would lose RAW.
 *  - `special` is the **Special:** text verbatim.
 *  - `prerequisites[]`: a `<Str|Dex|Con|Int|Wis|Cha> <n>` token becomes a typed
 *    `attribute` prerequisite (ability + minValue); EVERY other token stays an
 *    `other` prerequisite carrying the SRD wording verbatim, because guessing a
 *    machine-readable shape for "Base attack bonus +4" or "Ability to acquire a
 *    new familiar" would assert more than the source says.
 *  - The optional MECHANICAL fields (`proficienciesGranted`, `modifiers`,
 *    `abilityScoreIncrease`) are left UNASSERTED. The SRD states feat effects as
 *    prose, and deciding that "Tower Shield Proficiency" grants the shield
 *    proficiency string the engine happens to key on is an interpretation, not a
 *    transcription — the hand-written entries that carry those fields were
 *    curated by a human and keep winning.
 *  - HTML `<table>` blocks (Improved Familiar's familiar lists) cannot be
 *    represented in FeatDefinition; they are dropped and REPORTED by name rather
 *    than silently flattened.
 *  - SRD type → repo bucket: General/Special → general, Metamagic → metamagic,
 *    Item Creation → itemCreation. The SRD's single `[Special]` feat (Spell
 *    Mastery) has no dedicated bucket in `dnd35eFeats`, so it lands in general
 *    and is reported.
 *
 * Usage: npx tsx scripts/encode-35e-feats.mjs
 */

import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const SRD35_RULES =
  'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/basic-rules-and-legal';

/** SRD feat type tag → key of the `dnd35eFeats` record in ./index.ts. */
const BUCKET_BY_TYPE = {
  General: 'general',
  Special: 'general',
  Metamagic: 'metamagic',
  'Item Creation': 'itemCreation',
};

/** Generated array export name per bucket. */
const EXPORT_BY_BUCKET = {
  general: 'srd35eGeneralFeats',
  metamagic: 'srd35eMetamagicFeats',
  itemCreation: 'srd35eItemCreationFeats',
};

const ABILITY_BY_TOKEN = {
  str: 'str',
  dex: 'dex',
  con: 'con',
  int: 'int',
  wis: 'wis',
  cha: 'cha',
};

const normalizeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Split a comma list without breaking on commas inside parentheses. */
function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** Trim the SRD's sentence-final period from a prerequisite token. */
const trimTerminal = (text) => text.replace(/\.\s*$/, '').trim();

/** Drop markdown emphasis markers, keeping the prose verbatim (as the 3.5e
 * spell encoder does for its `_Material Component:_` trailers). */
const unmark = (text) => text.replace(/_([^_]+)_/g, '$1');

function toPrerequisite(token) {
  const attribute = /^(Str|Dex|Con|Int|Wis|Cha)\s+(\d+)$/i.exec(token);
  if (attribute) {
    return {
      type: 'attribute',
      ability: ABILITY_BY_TOKEN[attribute[1].toLowerCase()],
      minValue: Number(attribute[2]),
      description: token,
    };
  }
  return { type: 'other', description: token };
}

/**
 * Split one feat block into its lead prose and its labelled sections. Paragraphs
 * are blank-line separated; a `**Label:**` paragraph opens a new section that
 * runs until the next labelled paragraph.
 */
function parseSections(body) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const lead = [];
  const sections = new Map();
  let current = null;
  const tables = [];
  for (const paragraph of paragraphs) {
    if (paragraph.startsWith('<table')) {
      tables.push(paragraph);
      continue;
    }
    const labelled = /^\*\*([A-Za-z][A-Za-z ]*?):?\*\*\s*/.exec(paragraph);
    if (labelled) {
      current = labelled[1].trim();
      const rest = paragraph.slice(labelled[0].length).trim();
      sections.set(current, rest ? [rest] : []);
      continue;
    }
    if (current) sections.get(current).push(paragraph);
    else lead.push(paragraph);
  }
  return { lead, sections, tables };
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  const existing = await import('../src/data/dnd/3.5e/feats/index.ts');
  const handWritten = [
    ...existing.dnd35eFeats.general,
    ...existing.dnd35eFeats.metamagic,
    ...existing.dnd35eFeats.itemCreation,
    ...existing.dnd35eFeats.combat,
    ...existing.dnd35eFeats.skill,
    ...existing.dnd35eFeats.ability,
    ...existing.dnd35eFeats.magic,
  ];
  // Previously-generated entries are re-derived from the source on every run, so
  // only the HAND-WRITTEN baseline (the curated files) counts as "already ships".
  let generatedNames = new Set();
  let generatedIds = new Set();
  try {
    const previous = await import('../src/data/dnd/3.5e/feats/srd-feats.ts');
    for (const key of Object.values(EXPORT_BY_BUCKET)) {
      for (const feat of previous[key] ?? []) {
        generatedNames.add(normalizeName(feat.name));
        generatedIds.add(feat.id);
      }
    }
  } catch {
    /* first run */
  }
  const existingNames = new Set(
    handWritten.map((feat) => normalizeName(feat.name)).filter((n) => !generatedNames.has(n))
  );
  const existingIds = new Set(
    handWritten.map((feat) => feat.id).filter((id) => !generatedIds.has(id))
  );

  const markdown = await (await fetch(`${SRD35_RULES}/feats.md`)).text();
  const descriptionsIndex = markdown.search(/^## Feat Descriptions\s*$/m);
  if (descriptionsIndex < 0) throw new Error('feats.md: no "## Feat Descriptions" section');
  const descriptions = markdown.slice(descriptionsIndex);

  const report = {
    srdEntries: 0,
    encoded: 0,
    skippedExisting: 0,
    tablesDropped: [],
    specialTyped: [],
    noBenefit: [],
  };
  const byBucket = { general: [], metamagic: [], itemCreation: [] };

  for (const block of descriptions.split(/^### /m).slice(1)) {
    const header = /^(.+?)\s*<small>\[([^\]]*)\]<\/small>\s*$/m.exec(block.split('\n')[0]);
    if (!header) continue;
    const name = header[1].trim();
    const type = header[2].trim();
    if (name.toLowerCase() === 'feat name') continue;
    report.srdEntries += 1;

    const bucket = BUCKET_BY_TYPE[type];
    if (!bucket) throw new Error(`${name}: unmapped SRD feat type '${type}'`);
    if (type === 'Special') report.specialTyped.push(name);

    if (existingNames.has(normalizeName(name)) || existingIds.has(`${slug(name)}-35e`)) {
      report.skippedExisting += 1;
      continue;
    }

    const { lead, sections, tables } = parseSections(block.split('\n').slice(1).join('\n'));
    if (tables.length) report.tablesDropped.push(name);

    const benefitParagraphs = sections.get('Benefit') ?? sections.get('Benefits') ?? [];
    if (!benefitParagraphs.length) {
      report.noBenefit.push(name);
      continue;
    }

    const description = unmark(lead.length ? lead.join('\n\n') : benefitParagraphs[0]);
    const benefits = (lead.length ? [...benefitParagraphs] : benefitParagraphs.slice(1)).map(
      unmark
    );
    const normal = unmark((sections.get('Normal') ?? []).join('\n\n'));
    if (normal) benefits.push(`Normal: ${normal}`);
    const special = unmark((sections.get('Special') ?? []).join('\n\n'));

    const prerequisiteText = [
      ...(sections.get('Prerequisite') ?? []),
      ...(sections.get('Prerequisites') ?? []),
    ].join(', ');
    const prerequisites = splitTopLevel(trimTerminal(prerequisiteText)).map(toPrerequisite);

    byBucket[bucket].push({
      id: `${slug(name)}-35e`,
      name,
      system: 'dnd-3.5e',
      source: 'SRD 3.5',
      ...(prerequisites.length ? { prerequisites } : {}),
      description,
      benefits,
      ...(special ? { special } : {}),
    });
    report.encoded += 1;
  }

  for (const feats of Object.values(byBucket)) feats.sort((a, b) => a.id.localeCompare(b.id));

  const outPath = 'src/data/dnd/3.5e/feats/srd-feats.ts';
  writeFileSync(
    resolve(outPath),
    `// GENERATED by scripts/encode-35e-feats.mjs from olimot/srd-v3.5-md
// (SRD 3.5 core feats chapter, OGL — see docs/srd-sources.md). The hand-written
// feats in ./general.ts, ./metamagic.ts, ./item-creation.ts and ./magic.ts
// always win on name and id match and are NOT reproduced here; ./index.ts
// concatenates both sets. Regenerate with:
// npx tsx scripts/encode-35e-feats.mjs

import { FeatDefinition } from '../../../../types/character-options/feats';

${Object.entries(EXPORT_BY_BUCKET)
  .map(
    ([bucket, exportName]) =>
      `export const ${exportName}: FeatDefinition[] = [\n${byBucket[bucket]
        .map((feat) => ts(feat))
        .join(',\n')}${byBucket[bucket].length ? ',\n' : ''}];`
  )
  .join('\n\n')}
`
  );

  // Normalize to the repo's Prettier style (format:check gates all of src/**).
  // Resolved through the module graph rather than a literal ./node_modules path
  // so the script also runs from a git worktree, which has no node_modules of
  // its own and inherits the checkout's by upward resolution.
  const prettierBin = createRequire(import.meta.url).resolve('prettier/bin/prettier.cjs');
  execFileSync(process.execPath, [prettierBin, '--write', resolve(outPath)], {
    stdio: 'inherit',
  });

  console.log(`SRD feat entries read:      ${report.srdEntries}`);
  console.log(`kept existing (hand-written): ${report.skippedExisting}`);
  console.log(`encoded:                    ${report.encoded}`);
  for (const [bucket, feats] of Object.entries(byBucket)) {
    console.log(`  ${bucket}: ${feats.length}`);
  }
  console.log(`SRD [Special]-typed → general bucket: ${report.specialTyped.join(', ') || 'none'}`);
  console.log(`HTML tables dropped (unrepresentable): ${report.tablesDropped.join(', ') || 'none'}`);
  console.log(`skipped, no Benefit section: ${report.noBenefit.join(', ') || 'none'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
