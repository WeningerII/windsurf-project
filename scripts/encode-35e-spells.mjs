/**
 * Encode the missing SRD 3.5 core spells from olimot/srd-v3.5-md (OGL — the
 * clean core-only source the srd:coverage 3.5e denominator reads).
 *
 * Block format per spell:
 *   ## Name
 *   School (Subschool) [Descriptors]
 *   **Level:** Sor/Wiz 6, Water 7 / **Components:** V, S, M/DF /
 *   **Casting Time:** / **Range:** / **Target|Effect|Area:** /
 *   **Duration:** / **Saving Throw:** / **Spell Resistance:**
 *   prose paragraphs (italic _Material Component:_ trailers kept in prose).
 *
 * Repo conventions: '-35e' slug ids, source 'SRD 3.5', levelsByClass from the
 * Level line's class tokens (domain entries like 'Water 7' are not classes
 * and are skipped), typed -per-level durations, standard-action casting.
 * Hand-written entries win by name and id; unmappables become explicit
 * special/varies values, never guesses.
 *
 * Usage: node scripts/encode-35e-spells.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = 'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/spells';
const FILES = [
  'spells-a-b.md',
  'spells-c.md',
  'spells-d-e.md',
  'spells-f-g.md',
  'spells-h-l.md',
  'spells-m-o.md',
  'spells-p-r.md',
  'spells-s.md',
  'spells-t-z.md',
];

const SCHOOLS = new Set([
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
  'universal',
]);

// SRD 3.5 class abbreviations → repo class ids (domains are not classes).
const CLASS_TOKENS = {
  brd: 'bard',
  clr: 'cleric',
  drd: 'druid',
  pal: 'paladin',
  rgr: 'ranger',
  sor: 'sorcerer',
  wiz: 'wizard',
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
  report.odd.push(`${name}: casting '${raw}'`);
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
  if (value.startsWith('see text')) return { type: 'varies', description: raw.trim() };
  return { type: 'special', description: raw.trim() };
}

/**
 * d20srd.org per-spell URL: lowerCamelCase of the name's words
 * ('Animate Dead' -> animateDead.htm, 'Blindness/Deafness' ->
 * blindnessDeafness.htm) — the same convention the hand-written entries cite.
 */
function d20srdUrl(name) {
  const words = name
    .replace(/['']/g, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  const camel = words
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
  return `https://www.d20srd.org/srd/spells/${camel}.htm`;
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  const existing = await import('../src/data/dnd/3.5e/spells/index.ts');
  const generatedNames = new Set();
  const stems = ['srd-cantrips', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => `srd-level-${l}`)];
  for (const stem of stems) {
    try {
      const mod = await import(`../src/data/dnd/3.5e/spells/${stem}.ts`);
      for (const spell of Object.values(mod)[0] ?? [])
        generatedNames.add(normalizeName(spell.name));
    } catch {
      /* first run */
    }
  }
  // The canonical (merged) catalog names + ids are the hand-written baseline.
  const existingNames = new Set(
    existing.allSpells
      .map((spell) => normalizeName(spell.name))
      .filter((name) => !generatedNames.has(name))
  );
  const generatedIds = new Set();
  for (const stem of stems) {
    try {
      const mod = await import(`../src/data/dnd/3.5e/spells/${stem}.ts`);
      for (const spell of Object.values(mod)[0] ?? []) generatedIds.add(spell.id);
    } catch {
      /* first run */
    }
  }
  const existingIds = new Set(
    existing.allSpells.map((spell) => spell.id).filter((id) => !generatedIds.has(id))
  );

  const report = { encoded: 0, skippedExisting: 0, skipped: [], odd: [] };
  const byLevel = new Map();

  for (const file of FILES) {
    const markdown = await (await fetch(`${BASE}/${file}`)).text();
    const blocks = markdown.split(/^## /m).slice(1);
    for (const block of blocks) {
      const lines = block.split('\n');
      const name = lines[0].trim();
      if (!name) continue;
      if (existingNames.has(normalizeName(name)) || existingIds.has(`${slug(name)}-35e`)) {
        report.skippedExisting += 1;
        continue;
      }

      // School line: first non-empty line after the header that isn't a stat.
      const schoolLine = lines
        .slice(1)
        .find((line) => line.trim() && !line.trim().startsWith('**'));
      const schoolMatch = /^(\w+)/.exec((schoolLine ?? '').trim());
      const school = (schoolMatch?.[1] ?? '').toLowerCase();
      if (!SCHOOLS.has(school)) {
        report.skipped.push(`${name}: school line '${(schoolLine ?? '').trim().slice(0, 40)}'`);
        continue;
      }
      const subschoolMatch = /^\w+ \(([^)]+)\)/.exec((schoolLine ?? '').trim());
      const descriptorMatch = /\\\[([^\]]+)\\\]|\[([^\]]+)\]/.exec(schoolLine ?? '');

      const stat = (key) => {
        const line = lines.find((entry) => entry.trim().startsWith(`**${key}`));
        return line
          ? line
              .trim()
              .replace(/\*\*[^*]+\*\*:?\s*/, '')
              .trim()
          : '';
      };

      const levelLine = stat('Level');
      const levelsByClass = {};
      for (const token of levelLine.split(',')) {
        const entryMatch = /^([\w/ ]+?)\s+(\d)$/.exec(token.trim());
        if (!entryMatch) continue;
        const classPart = entryMatch[1].toLowerCase();
        const level = Number(entryMatch[2]);
        for (const sub of classPart.split('/')) {
          const classId = CLASS_TOKENS[sub.trim()];
          if (classId) levelsByClass[classId] = level;
        }
      }
      let classes = Object.keys(levelsByClass).sort();
      if (!classes.length) {
        // Domain-only spells ("Chaos 4", "Good 4"): domains are cleric spell
        // access, so they are honestly cleric spells at that level.
        const domainMatch = /^[A-Z]\w+\s+(\d)$/.exec(levelLine.trim());
        if (domainMatch) {
          levelsByClass.cleric = Number(domainMatch[1]);
          classes = ['cleric'];
        } else {
          report.skipped.push(`${name}: no core class levels ('${levelLine.slice(0, 50)}')`);
          continue;
        }
      }
      const level = Math.min(...Object.values(levelsByClass));

      const componentsRaw = stat('Components');
      const savingThrowText = stat('Saving Throw');
      const spellResistance = stat('Spell Resistance');
      const target = stat('Target');
      const area = stat('Area');
      const effect = stat('Effect');

      const lastStatIndex = lines.reduce(
        (latest, line, index) => (line.trim().startsWith('**') ? index : latest),
        0
      );
      const description = lines
        .slice(lastStatIndex + 1)
        .join('\n')
        .trim()
        .replace(/\n{3,}/g, '\n\n')
        .replace(/_([^_]+)_/g, '$1');

      const spell = {
        id: `${slug(name)}-35e`,
        name,
        system: 'dnd-3.5e',
        source: 'SRD 3.5',
        sourceUrl: d20srdUrl(name),
        level,
        school,
        ...(subschoolMatch ? { subschool: subschoolMatch[1] } : {}),
        ...(descriptorMatch
          ? {
              descriptors: (descriptorMatch[1] ?? descriptorMatch[2])
                .split(',')
                .map((token) => token.trim()),
            }
          : {}),
        castingTime: mapCastingTime(stat('Casting Time'), report, name),
        range: mapRange(stat('Range')),
        components: {
          verbal: /\bV\b/.test(componentsRaw),
          somatic: /\bS\b/.test(componentsRaw),
          material: /\bM\b/.test(componentsRaw),
          ...(/\bF\b/.test(componentsRaw) ? { focus: true } : {}),
          ...(/\bDF\b/.test(componentsRaw) ? { divineFocus: true } : {}),
          ...(/\bXP\b/.test(componentsRaw) ? { xpCost: 1 } : {}),
        },
        duration: mapDuration(stat('Duration')),
        ...(target ? { target } : {}),
        ...(area ? { area } : {}),
        ...(effect ? { effect } : {}),
        ...(savingThrowText ? { savingThrowText } : {}),
        ...(spellResistance ? { spellResistance: /^yes/i.test(spellResistance) } : {}),
        concentration: /^concentration/i.test(stat('Duration')),
        ritual: false,
        description,
        classes,
        levelsByClass,
      };

      if (!byLevel.has(level)) byLevel.set(level, []);
      byLevel.get(level).push(spell);
      report.encoded += 1;
    }
  }

  for (const [level, spells] of byLevel) {
    spells.sort((a, b) => a.id.localeCompare(b.id));
    const stem = level === 0 ? 'srd-cantrips' : `srd-level-${level}`;
    const exportName = level === 0 ? 'srd35eCantrips' : `srd35eLevel${level}Spells`;
    writeFileSync(
      resolve(`src/data/dnd/3.5e/spells/${stem}.ts`),
      `// GENERATED by scripts/encode-35e-spells.mjs from olimot/srd-v3.5-md
// (SRD 3.5 core spells, OGL — see docs/srd-sources.md). Hand-written spells
// always win on name and id match; regenerate with:
// node scripts/encode-35e-spells.mjs

import { Spell } from '../../../../types/magic/spells';

export const ${exportName}: Spell[] = [
${spells.map((spell) => ts(spell)).join(',\n')},
];
`
    );
    console.log(`${stem}.ts: ${spells.length} spells`);
  }

  console.log(`\nencoded: ${report.encoded}, kept existing: ${report.skippedExisting}`);
  console.log(`skipped: ${report.skipped.length}`);
  for (const line of report.skipped.slice(0, 20)) console.log(`  - ${line}`);
  console.log(`odd casting (defaulted): ${report.odd.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
