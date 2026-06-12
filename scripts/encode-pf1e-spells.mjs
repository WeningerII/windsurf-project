/**
 * Encode PF1e Core Rulebook spells from wolfgangcodes/pathfinder-spellbook
 * into the repo's Spell data files (closing the 131/623 coverage gap).
 *
 * Source: spells.csv (OGL), rows with source="PFRPG Core" — the same rows the
 * srd:coverage denominator counts (see docs/srd-sources.md).
 *
 * Repo conventions honored (matching the hand-written PF1e files):
 *  - ids are 'pf1e-' + slug(name); source 'Core Rulebook';
 *  - standard-action casting; close/medium/long ranges keep their base feet;
 *  - levelsByClass from the per-class level columns (core classes only);
 *  - per-level durations use the typed -per-level variants;
 *  - savingThrowText / spellResistance carry the SRD line text.
 *
 * Honest-mapping: hand-written spells win by name; unparseable ranges and
 * durations become explicit special/varies values, never guesses.
 *
 * Usage: node scripts/encode-pf1e-spells.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/wolfgangcodes/pathfinder-spellbook/master/data/spells.csv';

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

// CSV column → repo class id (core registry classes only; APG-era columns
// like witch/oracle/summoner are out of the repo's Core Rulebook scope,
// except alchemist which the repo registers).
const CLASS_COLUMNS = {
  sor: 'sorcerer',
  wiz: 'wizard',
  cleric: 'cleric',
  druid: 'druid',
  ranger: 'ranger',
  bard: 'bard',
  paladin: 'paladin',
  alchemist: 'alchemist',
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

/** Minimal RFC-4180 CSV parser (quoted fields may contain commas/newlines). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function mapCastingTime(raw, report, name) {
  const value = (raw ?? '').trim().toLowerCase();
  let match;
  if (/^1 standard action/.test(value)) return { type: 'standard', amount: 1 };
  if (/^1 swift action/.test(value)) return { type: 'swift' };
  if (/^1 immediate action/.test(value)) return { type: 'immediate' };
  if (/^1 free action/.test(value)) return { type: 'free' };
  if (/^1 full[- ]round action/.test(value)) return { type: 'full-round' };
  if ((match = /^(\d+) rounds?/.exec(value))) return { type: 'rounds', rounds: Number(match[1]) };
  if ((match = /^(\d+) minutes?/.exec(value))) {
    return { type: 'minutes', minutes: Number(match[1]) };
  }
  if ((match = /^(\d+) hours?/.exec(value))) return { type: 'hour', hours: Number(match[1]) };
  report.oddCasting.push(`${name}: ${raw}`);
  return { type: 'standard', amount: 1 };
}

function mapRange(raw) {
  const value = (raw ?? '').trim().toLowerCase();
  if (!value) return { type: 'personal' };
  if (value.startsWith('personal')) return { type: 'personal' };
  if (value.startsWith('touch')) return { type: 'touch' };
  if (value.startsWith('close')) return { type: 'close', feet: 25 };
  if (value.startsWith('medium')) return { type: 'medium', feet: 100 };
  if (value.startsWith('long')) return { type: 'long', feet: 400 };
  if (value.startsWith('unlimited')) return { type: 'unlimited' };
  const feet = /^(\d+) (?:ft|feet)/.exec(value);
  if (feet) return { type: 'ranged', feet: Number(feet[1]) };
  const miles = /^(\d+) miles?/.exec(value);
  if (miles) return { type: 'special', description: raw.trim() };
  if (value.startsWith('see text') || value.startsWith('0 ft')) {
    return { type: 'special', description: raw.trim() };
  }
  return { type: 'special', description: raw.trim() };
}

function mapDuration(raw) {
  const value = (raw ?? '').trim().toLowerCase();
  if (!value) return { type: 'instant' };
  let match;
  if (value.startsWith('instantaneous')) return { type: 'instant' };
  if (value.startsWith('permanent')) return { type: 'permanent' };
  if (value.startsWith('concentration')) {
    return { type: 'concentration', maxDuration: raw.trim() };
  }
  if ((match = /^(\d+) round(?:s)?\/level/.exec(value))) {
    return { type: 'rounds-per-level', rounds: Number(match[1]) };
  }
  if ((match = /^(\d+) min(?:ute)?s?\.?\/level/.exec(value))) {
    return { type: 'minutes-per-level', minutes: Number(match[1]) };
  }
  if ((match = /^(\d+) hours?\/level/.exec(value))) {
    return { type: 'hours-per-level', hours: Number(match[1]) };
  }
  if ((match = /^(\d+) days?\/level/.exec(value))) {
    return { type: 'days-per-level', days: Number(match[1]) };
  }
  if ((match = /^(\d+) rounds?\b/.exec(value))) {
    return { type: 'rounds', rounds: Number(match[1]) };
  }
  if ((match = /^(\d+) min(?:ute)?s?\b/.exec(value))) {
    return { type: 'minutes', minutes: Number(match[1]) };
  }
  if ((match = /^(\d+) hours?\b/.exec(value))) {
    return { type: 'hours', hours: Number(match[1]) };
  }
  if (value.startsWith('until')) return { type: 'special', description: raw.trim() };
  if (value.startsWith('see text')) return { type: 'varies', description: raw.trim() };
  return { type: 'special', description: raw.trim() };
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  const existing = await import('../src/data/pathfinder/1e/spells/index.ts');
  const generatedNames = new Set();
  for (let level = 0; level <= 9; level += 1) {
    try {
      const mod = await import(`../src/data/pathfinder/1e/spells/srd-level-${level}.ts`);
      for (const spell of Object.values(mod)[0] ?? []) generatedNames.add(normalizeName(spell.name));
    } catch {
      /* first run */
    }
  }
  const existingNames = new Set(
    (existing.allSpells ?? existing.pf1eSpells)
      .map((spell) => normalizeName(spell.name))
      .filter((name) => !generatedNames.has(name))
  );

  const text = await (await fetch(SOURCE_URL)).text();
  const [header, ...rows] = parseCsv(text);
  const col = Object.fromEntries(header.map((name, index) => [name, index]));

  const report = { encoded: 0, skippedExisting: 0, skipped: [], oddCasting: [] };
  const byLevel = new Map();

  for (const row of rows) {
    if (!row[col.name] || row[col.source] !== 'PFRPG Core') continue;
    const name = row[col.name].trim();
    if (existingNames.has(normalizeName(name))) {
      report.skippedExisting += 1;
      continue;
    }
    const school = (row[col.school] ?? '').trim().toLowerCase();
    if (!SCHOOLS.has(school)) {
      report.skipped.push(`${name}: school '${row[col.school]}'`);
      continue;
    }

    const levelsByClass = {};
    for (const [column, classId] of Object.entries(CLASS_COLUMNS)) {
      const value = row[col[column]];
      if (value !== '' && value != null && value !== 'NULL') {
        const level = Number(value);
        if (Number.isInteger(level) && level >= 0 && level <= 9) {
          levelsByClass[classId] = level;
        }
      }
    }
    const classes = Object.keys(levelsByClass).sort();
    if (!classes.length) {
      report.skipped.push(`${name}: no core class levels`);
      continue;
    }
    const level = Math.min(...Object.values(levelsByClass));

    const spellResistance = (row[col.spell_resistence] ?? '').trim();
    const savingThrowText = (row[col.saving_throw] ?? '').trim();

    const spell = {
      id: `pf1e-${slug(name)}`,
      name,
      system: 'pf1e',
      source: 'Core Rulebook',
      level,
      school,
      ...(row[col.subschool]?.trim() ? { subschool: row[col.subschool].trim() } : {}),
      ...(row[col.descriptor]?.trim()
        ? { descriptors: row[col.descriptor].split(',').map((d) => d.trim()) }
        : {}),
      castingTime: mapCastingTime(row[col.casting_time], report, name),
      range: mapRange(row[col.range]),
      components: {
        verbal: row[col.verbal] === '1',
        somatic: row[col.somatic] === '1',
        material: row[col.material] === '1',
        ...(row[col.focus] === '1' ? { focus: true } : {}),
        ...(row[col.divine_focus] === '1' ? { divineFocus: true } : {}),
      },
      duration: mapDuration(row[col.duration]),
      ...(row[col.area]?.trim() ? { area: row[col.area].trim() } : {}),
      ...(row[col.targets]?.trim() ? { target: row[col.targets].trim() } : {}),
      ...(row[col.effect]?.trim() ? { effect: row[col.effect].trim() } : {}),
      ...(savingThrowText ? { savingThrowText } : {}),
      ...(spellResistance
        ? { spellResistance: /^yes/i.test(spellResistance) }
        : {}),
      concentration: /^concentration/i.test((row[col.duration] ?? '').trim()),
      ritual: false,
      description: (row[col.description] ?? '').trim() || (row[col.short_description] ?? '').trim(),
      classes,
      levelsByClass,
    };

    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level).push(spell);
    report.encoded += 1;
  }

  for (const [level, spells] of byLevel) {
    spells.sort((a, b) => a.id.localeCompare(b.id));
    writeFileSync(
      resolve(`src/data/pathfinder/1e/spells/srd-level-${level}.ts`),
      `// GENERATED by scripts/encode-pf1e-spells.mjs from
// wolfgangcodes/pathfinder-spellbook spells.csv (PFRPG Core rows, OGL — see
// docs/srd-sources.md). Hand-written spells always win on name match;
// regenerate with: node scripts/encode-pf1e-spells.mjs

import { Spell } from '../../../../types/magic/spells';

export const srdPf1eLevel${level}Spells: Spell[] = [
${spells.map((spell) => ts(spell)).join(',\n')},
];
`
    );
    console.log(`srd-level-${level}.ts: ${spells.length} spells`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`skipped: ${report.skipped.length}`);
  for (const line of report.skipped) console.log(`  - ${line}`);
  console.log(`odd casting times (defaulted to standard): ${report.oddCasting.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
