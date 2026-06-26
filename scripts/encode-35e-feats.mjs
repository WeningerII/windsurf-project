/**
 * Encode D&D 3.5e SRD feats from olimot/srd-v3.5-md into the repo's dnd-3.5e
 * FeatDefinition data, closing the srd:coverage gap (72/110 -> 110/110).
 *
 * Source: https://github.com/olimot/srd-v3.5-md basic-rules-and-legal/feats.md
 * (clean core-only Markdown of the SRD 3.5 Feats chapter, OGL 1.0a — the same
 * repo already wired as the 3.5e spell + monster denominator; see
 * docs/srd-sources.md). Each feat is a `### Name <small>[Type]</small>` heading
 * under `## Feat Descriptions`, followed by optional intro prose and bold
 * `**Prerequisites:** / **Benefit:** / **Normal:** / **Special:**` sections.
 *
 * These are GENUINE sourced SRD 3.5 feats — NOT placeholders. (The 3.5e feat
 * index records that an earlier fabricated filler set was purged; nothing here
 * is invented.) Hand-written feats in general/metamagic/item-creation/magic.ts
 * ALWAYS win on normalized-name match; only feats they don't cover are emitted.
 *
 * Regeneration is idempotent: existing names are read only from the hand-written
 * files (NOT generated.ts), so re-running re-derives the full generated set.
 *
 * Usage: node scripts/encode-35e-feats.mjs
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/basic-rules-and-legal/feats.md';

// Aggressive normalization (matches the srd:coverage denominator's norm — the
// source of truth for "same feat").
const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const ts = (value) =>
  JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

/** Reduce an SRD HTML <table> to readable "a — b — c" lines (footnote/colspan rows kept as prose). */
function flattenTables(html) {
  return html.replace(/<table[^>]*>(.*?)<\/table>/gs, (_, body) => {
    const rows = [...body.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) => {
      const cells = [...m[1].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs)].map((c) =>
        stripInline(c[1])
      );
      return cells.filter((c) => c.length > 0).join(' — ');
    });
    return rows.filter((r) => r.length > 0).join('; ');
  });
}

/** Strip inline HTML/markdown emphasis, collapse entities + whitespace. */
function stripInline(text) {
  return String(text)
    .replace(/<sup>.*?<\/sup>/gs, '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[lr]squo;|&#8217;|’/g, "'")
    .replace(/&[lr]dquo;/g, '"')
    .replace(/\*\*/g, '')
    .replace(/(?<![_\w])_(?!_)([^_\n]+?)_(?!_)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split a feat block's body into the SRD's labeled sections. Returns
 * { intro, prerequisites, benefit, normal, special } where each value is the
 * cleaned prose (tables flattened). Lines before the first bold label are intro.
 */
function parseSections(body) {
  const flattened = flattenTables(body);
  const lines = flattened.split('\n');
  const sections = { intro: [], prerequisites: [], benefit: [], normal: [], special: [] };
  let current = 'intro';
  const labelMap = {
    prerequisite: 'prerequisites',
    prerequisites: 'prerequisites',
    benefit: 'benefit',
    benefits: 'benefit',
    normal: 'normal',
    special: 'special',
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^\*\*([A-Za-z]+):\*\*\s*(.*)$/);
    if (m && labelMap[m[1].toLowerCase()]) {
      current = labelMap[m[1].toLowerCase()];
      const rest = stripInline(m[2]);
      if (rest) sections[current].push(rest);
    } else {
      const cleaned = stripInline(line);
      if (cleaned) sections[current].push(cleaned);
    }
  }
  return sections;
}

async function main() {
  // Existing names come ONLY from the hand-written category files so
  // regeneration is idempotent and hand-authored feats always win.
  const handFiles = ['general', 'metamagic', 'item-creation', 'magic'];
  const existingNames = new Set();
  const existingIds = new Set();
  for (const file of handFiles) {
    const mod = await import(`../src/data/dnd/3.5e/feats/${file}.ts`);
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        for (const feat of value) {
          if (feat?.name) existingNames.add(normalizeName(feat.name));
          if (feat?.id) existingIds.add(feat.id);
        }
      }
    }
  }

  const md = await (await fetch(SOURCE_URL)).text();
  const lines = md.split('\n');

  // Locate the "## Feat Descriptions" section; collect each "### Name [Type]"
  // block until the next ### or ## heading.
  const descStart = lines.findIndex((l) => /^## Feat Descriptions/.test(l));
  if (descStart < 0) throw new Error('Feat Descriptions section not found');

  const blocks = [];
  for (let i = descStart + 1; i < lines.length; i++) {
    const h = lines[i].match(/^### (.+?)(?:\s*<small>\[([^\]]+)\]<\/small>)?\s*$/);
    if (!h) continue;
    const name = h[1].replace(/\s*<small>.*$/, '').trim();
    const type = (h[2] || 'General').trim();
    if (normalizeName(name) === normalizeName('Feat Name')) continue; // template row
    let j = i + 1;
    const bodyLines = [];
    for (; j < lines.length; j++) {
      if (/^#{2,3}\s/.test(lines[j])) break;
      bodyLines.push(lines[j]);
    }
    blocks.push({ name, type, body: bodyLines.join('\n') });
  }

  const generated = [];
  const seenIds = new Set(existingIds);
  let skippedExisting = 0;

  for (const block of blocks) {
    if (existingNames.has(normalizeName(block.name))) {
      skippedExisting += 1;
      continue;
    }
    const s = parseSections(block.body);

    // SRD quirk: Improved Feint's '**Special:**'-style fighter-bonus-feat note (feats.md
    // line 499) is unlabeled, so parseSections leaves it glued to the preceding Normal
    // section. Move any such bonus-feat sentence from normal -> special. (Empirically the
    // only normal-section line in the corpus that matches, so no other entry is affected.)
    const bonusFeatRe = /\bmay select .* as (?:one of his|a) .*bonus feat/i;
    s.normal = s.normal.filter((line) => {
      if (bonusFeatRe.test(line)) {
        s.special.push(line);
        return false;
      }
      return true;
    });

    // description: the SRD's intro prose if present, else the first benefit
    // sentence, else the feat name (the catalog requires a non-empty string).
    const firstBenefitSentence = s.benefit[0]
      ? (() => {
          const head = s.benefit[0].split('. ')[0];
          return /[.!?]$/.test(head) ? head : `${head}.`;
        })()
      : '';
    const description = s.intro.join(' ') || firstBenefitSentence || block.name;

    // benefits[]: the Benefit paragraphs, then Normal:/Special: as labeled lines.
    const benefits = [...s.benefit];
    if (s.normal.length) benefits.push(`Normal: ${s.normal.join(' ')}`);
    if (!benefits.length && s.intro.length > 1) benefits.push(s.intro.slice(1).join(' '));

    const prerequisites = [];
    if (s.prerequisites.length) {
      prerequisites.push({ type: 'other', description: s.prerequisites.join(' ') });
    }

    const special = s.special.length ? s.special.join(' ') : undefined;

    let id = `${slug(block.name)}-35e`;
    while (seenIds.has(id)) id = `${id}-feat`;
    seenIds.add(id);

    generated.push({
      id,
      name: block.name,
      system: 'dnd-3.5e',
      source: 'SRD 3.5',
      ...(prerequisites.length ? { prerequisites } : {}),
      description,
      benefits,
      ...(special ? { special } : {}),
    });
  }

  generated.sort((a, b) => a.id.localeCompare(b.id));

  writeFileSync(
    resolve('src/data/dnd/3.5e/feats/generated.ts'),
    `// GENERATED by scripts/encode-35e-feats.mjs from olimot/srd-v3.5-md
// (SRD 3.5 Feats chapter, OGL 1.0a — the core-only Markdown already used as the
// 3.5e spell/monster denominator; see docs/srd-sources.md). Genuine sourced SRD
// feats, NOT placeholders. Hand-written feats in general/metamagic/
// item-creation/magic.ts win on name match. Regenerate with:
// node scripts/encode-35e-feats.mjs

import { FeatDefinition } from '../../../../types/character-options/feats';

export const dnd35eGeneratedFeats: FeatDefinition[] = [
${generated.map((feat) => ts(feat)).join(',\n')},
];
`
  );

  console.log(
    `generated.ts: ${generated.length} feats encoded, ${skippedExisting} kept hand-written`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
