/**
 * Encode the missing SRD 5.2 spells from the downfallx/dnd-5e-srd-markdown
 * spells.md (CC-BY-4.0) — the same document the srd:coverage 2024 spell
 * denominator parses (5e-database ships no 2024 spells file).
 *
 * The markdown is uniformly structured:
 *   #### Name
 *   _Level N School (Classes)_   or   _School Cantrip (Classes)_
 *   **Casting Time:** ... / **Range:** ... / **Components:** ... /
 *   **Duration:** ...
 *   prose paragraphs, with _Using a Higher-Level Spell Slot._ /
 *   _Cantrip Upgrade._ italic-led paragraphs.
 *
 * Honest-mapping (same discipline as the sibling encoders): hand-written
 * spells win by name; unmappable ranges/durations become explicit special
 * variants; ritual is detected from the level line's 'or Ritual' marker.
 *
 * Usage: node scripts/encode-2024-spells.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/downfallx/dnd-5e-srd-markdown/master/spells.md';

const SCHOOLS = new Set([
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
]);

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

function mapCastingTime(raw, report, name) {
  const value = raw.trim();
  let match;
  if (/^action\b/i.test(value)) return { type: 'action', amount: 1 };
  if (/^bonus action\b/i.test(value)) return { type: 'bonus-action', amount: 1 };
  if ((match = /^reaction(?:,\s*(.+))?$/i.exec(value))) {
    return { type: 'reaction', amount: 1, ...(match[1] ? { condition: match[1] } : {}) };
  }
  if ((match = /^(\d+) minutes?/i.exec(value))) {
    return { type: 'minutes', minutes: Number(match[1]) };
  }
  if ((match = /^(\d+) hours?/i.exec(value))) return { type: 'hour', hours: Number(match[1]) };
  report.odd.push(`${name}: casting '${raw}'`);
  return { type: 'action', amount: 1 };
}

function mapRange(raw) {
  const value = raw.trim();
  let match;
  if (/^self\b/i.test(value) && value.length <= 5) return { type: 'self' };
  if (/^touch$/i.test(value)) return { type: 'touch' };
  if (/^sight$/i.test(value)) return { type: 'sight' };
  if (/^unlimited$/i.test(value)) return { type: 'unlimited' };
  if ((match = /^(\d+) feet$/i.exec(value))) return { type: 'ranged', feet: Number(match[1]) };
  return { type: 'special', description: value };
}

function mapDuration(raw) {
  const value = raw.trim();
  const concentration = /^concentration/i.test(value);
  if (concentration) return { type: 'concentration', maxDuration: value.toLowerCase() };
  let match;
  if (/^instantaneous$/i.test(value)) return { type: 'instant' };
  if ((match = /^(\d+) rounds?$/i.exec(value))) return { type: 'rounds', rounds: Number(match[1]) };
  if ((match = /^(\d+) minutes?$/i.exec(value))) {
    return { type: 'minutes', minutes: Number(match[1]) };
  }
  if ((match = /^(\d+) hours?$/i.exec(value))) return { type: 'hours', hours: Number(match[1]) };
  return { type: 'special', description: value };
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  const existing = await import('../src/data/dnd/5e-2024/spells/index.ts');
  const existingSpells = existing.allSpells;
  const generatedNames = new Set();
  const stems = ['srd-cantrips', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => `srd-level-${l}`)];
  for (const stem of stems) {
    try {
      const mod = await import(`../src/data/dnd/5e-2024/spells/${stem}.ts`);
      for (const spell of Object.values(mod)[0] ?? [])
        generatedNames.add(normalizeName(spell.name));
    } catch {
      /* first run */
    }
  }
  const existingNames = new Set(
    existingSpells
      .map((spell) => normalizeName(spell.name))
      .filter((name) => !generatedNames.has(name))
  );

  const markdown = await (await fetch(SOURCE_URL)).text();
  const blocks = markdown.split(/^#### /m).slice(1);
  const report = { encoded: 0, skippedExisting: 0, skipped: [], odd: [] };
  const byLevel = new Map();

  for (const block of blocks) {
    const lines = block.split('\n');
    const name = lines[0].trim();
    if (!name) continue;
    if (existingNames.has(normalizeName(name))) {
      report.skippedExisting += 1;
      continue;
    }

    const headerLine = lines.find((line) => /^_.*\(.*\)_\s*$/.test(line.trim())) ?? '';
    const header = headerLine.trim().replace(/^_|_$/g, '');
    let level;
    let school;
    let ritual = false;
    let match;
    if ((match = /^Level (\d+) (\w+)(?: \(([^)]*)\))?/.exec(header))) {
      level = Number(match[1]);
      school = match[2].toLowerCase();
    } else if ((match = /^(\w+) Cantrip/.exec(header))) {
      level = 0;
      school = match[1].toLowerCase();
    } else {
      report.skipped.push(`${name}: header '${header}'`);
      continue;
    }
    ritual = /\(.*ritual.*\)|or ritual/i.test(header);
    const classMatch = /\(([^)]*)\)\s*$/.exec(header);
    const classes = (classMatch?.[1] ?? '')
      .split(',')
      .map((token) =>
        token
          .trim()
          .toLowerCase()
          .replace(/ or ritual$/, '')
      )
      .filter((token) => token && token !== 'ritual');

    if (!SCHOOLS.has(school)) {
      report.skipped.push(`${name}: school '${school}'`);
      continue;
    }

    const stat = (key) => {
      const line = lines.find((entry) => entry.trim().startsWith(`**${key}:**`));
      return line ? line.trim().replace(`**${key}:**`, '').trim() : '';
    };
    const castingRaw = stat('Casting Time');
    const rangeRaw = stat('Range');
    const componentsRaw = stat('Components');
    const durationRaw = stat('Duration');

    const materialMatch = /M \(([^)]*)\)/.exec(componentsRaw);
    const bodyStart = lines.findIndex((line) => line.trim().startsWith('**Duration:**')) + 1;
    const body = lines
      .slice(bodyStart)
      .join('\n')
      .trim()
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    const higherIndex = body.findIndex((paragraph) =>
      /^_(Using a Higher-Level Spell Slot|Cantrip Upgrade)\._/.test(paragraph)
    );
    const description = (higherIndex === -1 ? body : body.slice(0, higherIndex)).join('\n\n');
    const atHigherLevels =
      higherIndex === -1
        ? undefined
        : body
            .slice(higherIndex)
            .join('\n\n')
            .replace(/^_(Using a Higher-Level Spell Slot|Cantrip Upgrade)\._\s*/, '');

    const concentration = /^concentration/i.test(durationRaw);
    const spell = {
      id: slug(name),
      name,
      system: 'dnd-5e-2024',
      source: 'SRD 5.2',
      level,
      school,
      castingTime: mapCastingTime(castingRaw, report, name),
      range: mapRange(rangeRaw),
      components: {
        verbal: /\bV\b/.test(componentsRaw),
        somatic: /\bS\b/.test(componentsRaw),
        material: /\bM\b/.test(componentsRaw),
        ...(materialMatch ? { materialDescription: materialMatch[1] } : {}),
      },
      duration: mapDuration(durationRaw),
      concentration,
      ritual,
      description,
      ...(atHigherLevels ? { atHigherLevels } : {}),
      classes,
    };

    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level).push(spell);
    report.encoded += 1;
  }

  for (const [level, spells] of byLevel) {
    spells.sort((a, b) => a.id.localeCompare(b.id));
    const stem = level === 0 ? 'srd-cantrips' : `srd-level-${level}`;
    const exportName = level === 0 ? 'srd2024Cantrips' : `srd2024Level${level}Spells`;
    writeFileSync(
      resolve(`src/data/dnd/5e-2024/spells/${stem}.ts`),
      `// GENERATED by scripts/encode-2024-spells.mjs from
// downfallx/dnd-5e-srd-markdown spells.md (SRD 5.2.1, CC-BY-4.0 — the same
// document the srd:coverage 2024 denominator parses). Hand-written spells
// always win on name match; regenerate with:
// node scripts/encode-2024-spells.mjs

import { Spell } from '../../../../types/magic/spells';

export const ${exportName}: Spell[] = [
${spells.map((spell) => ts(spell)).join(',\n')},
];
`
    );
    console.log(`${stem}.ts: ${spells.length} spells`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`skipped: ${report.skipped.length}`);
  for (const line of report.skipped) console.log(`  - ${line}`);
  console.log(`odd stats (defaulted): ${report.odd.length}`);
  for (const line of report.odd) console.log(`  - ${line}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
