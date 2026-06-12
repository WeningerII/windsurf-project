/**
 * Encode PF2e Core Rulebook spells from Pf2eToolsOrg/Pf2eTools into the
 * repo's Spell data files (closing the 129/537 coverage gap).
 *
 * Source: https://github.com/Pf2eToolsOrg/Pf2eTools data/spells/spells-crb.json
 * (OGL; `source:"CRB"` — the same dataset the srd:coverage denominator uses;
 * see docs/srd-sources.md). Entries are emitted with source 'Core Rulebook'.
 *
 * Repo conventions honored (matching the hand-written PF2e files):
 *  - ids are slug(name) + '-pf2e'; cantrips (trait) are level 0;
 *  - classes derive from traditions: arcane→wizard, divine→cleric,
 *    occult→bard, primal→druid, plus sorcerer (bloodline) always;
 *  - the school is the school trait; saves map R/F/W → dex/con/wis with
 *    basic saves as success 'half'.
 *
 * Honest-mapping rules: hand-written spells win by name; unmappable
 * casts/ranges/durations become explicit special/varies values (reported),
 * never guesses; {@tag ...} markup is reduced to its display text.
 *
 * Usage: node scripts/encode-pf2e-spells.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/spells/spells-crb.json';

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

const TRADITION_CLASSES = { arcane: 'wizard', divine: 'cleric', occult: 'bard', primal: 'druid' };
// Focus spells belong to one class (carried as a trait) and take their
// tradition from it — sorcerer bloodline focus spells per the CRB bloodline
// table, monk ki spells are divine (CRB p.156).
const CLASS_TRADITIONS = {
  bard: 'occult',
  champion: 'divine',
  cleric: 'divine',
  druid: 'primal',
  monk: 'divine',
  wizard: 'arcane',
  ranger: 'primal',
};
const BLOODLINE_TRADITIONS = {
  Aberrant: 'occult',
  Angelic: 'divine',
  Demonic: 'divine',
  Diabolic: 'divine',
  Draconic: 'arcane',
  Elemental: 'primal',
  Fey: 'primal',
  Hag: 'occult',
  Imperial: 'arcane',
  Undead: 'divine',
};
const CLASS_TRAITS = new Set([
  'bard',
  'champion',
  'cleric',
  'druid',
  'monk',
  'ranger',
  'sorcerer',
  'wizard',
]);
const SAVE_ATTRIBUTES = { R: 'dex', F: 'con', W: 'wis' };
const SAVE_NAMES = { R: 'Reflex', F: 'Fortitude', W: 'Will' };

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

/** Reduce Pf2eTools {@tag value|link|display} markup to its display text. */
function detag(text) {
  return String(text).replace(/\{@\w+ ([^}]*)\}/g, (_, inner) => {
    const parts = inner.split('|');
    return parts[parts.length - 1].trim() || parts[0].trim();
  });
}

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
  return out;
}

function mapCast(cast, report, id) {
  const number = cast?.number ?? 2;
  switch (cast?.unit) {
    case 'action':
      return { type: 'action', amount: number };
    case 'reaction':
      return { type: 'reaction', amount: 1 };
    case 'free':
      return { type: 'free' };
    case 'minute':
      return { type: 'minutes', minutes: number };
    case 'hour':
      return { type: 'hour', hours: number };
    case 'day':
      return { type: 'hour', hours: number * 24 };
    default:
      report.odd.push(`${id}: cast ${JSON.stringify(cast)}`);
      return { type: 'action', amount: 2 };
  }
}

function mapRange(range) {
  if (!range || !range.unit) return { type: 'self' };
  switch (range.unit) {
    case 'feet':
      return { type: 'ranged', feet: range.number ?? 0 };
    case 'miles':
      return { type: 'special', description: `${range.number} mile${range.number > 1 ? 's' : ''}` };
    case 'touch':
      return { type: 'touch' };
    case 'planetary':
    case 'unlimited':
      return { type: 'unlimited' };
    default:
      return { type: 'special', description: detag(range.entry ?? range.unit) };
  }
}

function mapDuration(duration) {
  if (!duration || (!duration.unit && !duration.sustained)) return { type: 'instant' };
  const number = duration.number ?? 1;
  const text = duration.entry
    ? detag(duration.entry)
    : `${number} ${duration.unit}${number > 1 ? 's' : ''}`;
  if (duration.sustained) return { type: 'concentration', maxDuration: text };
  switch (duration.unit) {
    case 'round':
    case 'turn':
      return { type: 'rounds', rounds: number };
    case 'minute':
      return { type: 'minutes', minutes: number };
    case 'hour':
      return { type: 'hours', hours: number };
    case 'unlimited':
      return { type: 'unlimited' };
    default:
      return { type: 'special', description: text };
  }
}

function mapHeightening(heightened) {
  if (!heightened) return undefined;
  if (heightened.plusX) {
    const [interval, lines] = Object.entries(heightened.plusX)[0];
    return {
      mode: 'interval',
      interval: Number(interval),
      summary: detag(lines.map((line) => (typeof line === 'string' ? line : '')).join(' ')).trim(),
    };
  }
  if (heightened.X) {
    const ranks = {};
    for (const [rank, lines] of Object.entries(heightened.X)) {
      ranks[Number(rank)] = detag(
        (Array.isArray(lines) ? lines : [lines])
          .map((line) => (typeof line === 'string' ? line : ''))
          .join(' ')
      ).trim();
    }
    return {
      mode: 'fixed',
      ranks,
      summary: Object.entries(ranks)
        .map(([rank, text]) => `(${rank}) ${text}`)
        .join(' '),
    };
  }
  return undefined;
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  const existing = await import('../src/data/pathfinder/2e/spells/index.ts');
  const generatedNames = new Set();
  for (let level = 0; level <= 10; level += 1) {
    try {
      const mod = await import(`../src/data/pathfinder/2e/spells/srd-level-${level}.ts`);
      for (const spell of Object.values(mod)[0] ?? [])
        generatedNames.add(normalizeName(spell.name));
    } catch {
      /* first run */
    }
  }
  const existingNames = new Set(
    existing.allSpells
      .map((spell) => normalizeName(spell.name))
      .filter((name) => !generatedNames.has(name))
  );

  const raw = (await (await fetch(SOURCE_URL)).json()).spell ?? [];
  const report = { encoded: 0, skippedExisting: 0, skippedNoSchool: [], odd: [] };
  const byLevel = new Map();

  for (const s of raw) {
    if (existingNames.has(normalizeName(s.name))) {
      report.skippedExisting += 1;
      continue;
    }
    const traits = s.traits ?? [];
    const school = traits.find((trait) => SCHOOLS.has(trait));
    if (!school) {
      report.skippedNoSchool.push(s.name);
      continue;
    }
    const isCantrip = traits.includes('cantrip');
    const level = isCantrip ? 0 : s.level;
    let traditions = (s.traditions ?? []).map((t) => t.toLowerCase());
    let classes;
    if (s.focus) {
      const classTrait = traits.find((trait) => CLASS_TRAITS.has(trait));
      classes = classTrait ? [classTrait] : ['sorcerer'];
      if (!traditions.length) {
        if (classTrait === 'sorcerer') {
          const bloodlines = Object.values(s.subclass ?? {}).flat();
          traditions = [...new Set(bloodlines.map((b) => BLOODLINE_TRADITIONS[b]).filter(Boolean))];
          if (!traditions.length) traditions = ['arcane'];
        } else if (classTrait && CLASS_TRADITIONS[classTrait]) {
          traditions = [CLASS_TRADITIONS[classTrait]];
        } else {
          traditions = ['divine'];
        }
      }
    } else {
      classes = [
        ...new Set([...traditions.map((t) => TRADITION_CLASSES[t]).filter(Boolean), 'sorcerer']),
      ].sort();
    }

    const componentRow = Array.isArray(s.components?.[0]) ? s.components[0] : [];
    const saveType = s.savingThrow?.type?.[0];
    const descriptionLines = flattenEntries(s.entries);

    const spell = {
      id: `${slug(s.name)}-pf2e`,
      name: s.name,
      system: 'pf2e',
      source: 'Core Rulebook',
      level,
      school,
      // Traits follow repo policy: the curated vocabulary is derived by
      // withPf2eSpellTraits (school/cantrip/attack/concentrate/manipulate);
      // only the focus marker needs seeding from the source.
      ...(s.focus ? { traits: ['focus'] } : {}),
      ...(traditions.length ? { traditions } : {}),
      castingTime: mapCast(s.cast, report, s.name),
      range: mapRange(s.range),
      components: {
        verbal: componentRow.includes('V'),
        somatic: componentRow.includes('S'),
        material: componentRow.includes('M'),
        ...(componentRow.includes('F') ? { focus: true } : {}),
      },
      duration: mapDuration(s.duration),
      ...(s.area?.entry ? { area: detag(s.area.entry) } : {}),
      ...(saveType && SAVE_ATTRIBUTES[saveType]
        ? {
            savingThrow: {
              attribute: SAVE_ATTRIBUTES[saveType],
              success: s.savingThrow.basic ? 'half' : 'special',
            },
            savingThrowText: `${s.savingThrow.basic ? 'basic ' : ''}${SAVE_NAMES[saveType]} save`,
          }
        : {}),
      concentration: Boolean(s.duration?.sustained),
      ritual: false,
      description: descriptionLines.join('\n\n'),
      ...(isCantrip
        ? {
            // Repo convention: every cantrip carries the auto-heighten marker
            // (loader invariant in dataLoader.test.ts).
            heightening: {
              mode: 'cantrip',
              summary:
                'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
            },
          }
        : mapHeightening(s.heightened)
          ? { heightening: mapHeightening(s.heightened) }
          : {}),
      classes,
    };

    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level).push(spell);
    report.encoded += 1;
  }

  for (const [level, spells] of byLevel) {
    spells.sort((a, b) => a.id.localeCompare(b.id));
    writeFileSync(
      resolve(`src/data/pathfinder/2e/spells/srd-level-${level}.ts`),
      `// GENERATED by scripts/encode-pf2e-spells.mjs from Pf2eToolsOrg/Pf2eTools
// (Core Rulebook spells, OGL — see docs/srd-sources.md). Hand-written spells
// always win on name match; regenerate with:
// node scripts/encode-pf2e-spells.mjs

import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const srdPf2eLevel${level}Spells: Spell[] = withPf2eSpellTraits([
${spells.map((spell) => ts(spell)).join(',\n')},
]);
`
    );
    console.log(`srd-level-${level}.ts: ${spells.length} spells`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`skipped (no school trait): ${report.skippedNoSchool.length}`);
  for (const name of report.skippedNoSchool) console.log(`  - ${name}`);
  console.log(`odd casts (defaulted): ${report.odd.length}`);
  for (const line of report.odd) console.log(`  - ${line}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
