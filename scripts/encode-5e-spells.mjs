/**
 * Encode SRD 5.1 spells from 5e-bits/5e-database into the repo's Spell data
 * files (closing the 222/319 coverage gap measured by srd:coverage).
 *
 * Source: https://github.com/5e-bits/5e-database (data OGL 1.0a — the same
 * dataset the coverage denominator uses; see docs/srd-sources.md). Entries
 * are emitted with source 'SRD 5.1'.
 *
 * Honest-mapping rules (same discipline as encode-5e-monsters.mjs):
 *  - Hand-written spells (normalized-name match) are never overwritten.
 *  - Range/duration strings that don't fit the typed unions become
 *    { type: 'special', description } — never a guessed number.
 *  - Damage is only encoded when the base dice parse cleanly AND the damage
 *    type is in the DamageType union; otherwise the prose carries it.
 *
 * Usage: node scripts/encode-5e-spells.mjs   (writes srd-level-*.ts files;
 * commit the output).
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en/5e-SRD-Spells.json';

const DAMAGE_TYPES = new Set([
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
]);

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

function parseDice(expr) {
  const match = /^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/.exec(String(expr).trim());
  if (!match) return null;
  const count = Number(match[1]);
  const die = `d${match[2]}`;
  const modifier = match[3] ? Number(match[3]) : undefined;
  return { count, die, modifier, notation: `${count}${die}${modifier ? `+${modifier}` : ''}` };
}

function mapCastingTime(raw, report, id) {
  const value = raw.trim();
  let match;
  if ((match = /^1 action$/i.exec(value))) return { type: 'action', amount: 1 };
  if ((match = /^1 bonus action$/i.exec(value))) return { type: 'bonus-action', amount: 1 };
  if ((match = /^1 reaction(?:,\s*(.+))?$/i.exec(value))) {
    return { type: 'reaction', amount: 1, ...(match[1] ? { condition: match[1] } : {}) };
  }
  if ((match = /^(\d+) minutes?$/i.exec(value))) {
    return { type: 'minutes', minutes: Number(match[1]) };
  }
  if ((match = /^(\d+) hours?$/i.exec(value))) {
    return { type: 'hour', hours: Number(match[1]) };
  }
  report.oddCastingTimes.push(`${id}: ${raw}`);
  return { type: 'action', amount: 1 };
}

function mapRange(raw) {
  const value = raw.trim();
  let match;
  if (/^self$/i.test(value)) return { type: 'self' };
  if (/^touch$/i.test(value)) return { type: 'touch' };
  if (/^sight$/i.test(value)) return { type: 'sight' };
  if (/^unlimited$/i.test(value)) return { type: 'unlimited' };
  if ((match = /^(\d+) feet$/i.exec(value))) return { type: 'ranged', feet: Number(match[1]) };
  return { type: 'special', description: value };
}

function mapDuration(raw, concentration) {
  const value = raw.trim();
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
  // Baseline = the union MINUS this encoder's own previous output, so
  // regeneration is idempotent instead of self-excluding into empty files.
  const existing = await import('../src/data/dnd/5e-2014/spells/index.ts');
  const generatedNames = new Set();
  const stems = ['srd-cantrips', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => `srd-level-${l}`)];
  for (const stem of stems) {
    try {
      const mod = await import(`../src/data/dnd/5e-2014/spells/${stem}.ts`);
      for (const spell of Object.values(mod)[0] ?? [])
        generatedNames.add(normalizeName(spell.name));
    } catch {
      // first run: no generated file yet
    }
  }
  const existingNames = new Set(
    existing.dnd5eSpells
      .map((spell) => normalizeName(spell.name))
      .filter((name) => !generatedNames.has(name))
  );

  const raw = await (await fetch(SOURCE_URL)).json();
  const report = { encoded: 0, skippedExisting: 0, oddCastingTimes: [], proseOnlyDamage: 0 };
  const byLevel = new Map();

  for (const s of raw) {
    if (existingNames.has(normalizeName(s.name))) {
      report.skippedExisting += 1;
      continue;
    }
    const school = s.school?.index;
    if (!SCHOOLS.has(school)) continue;

    let damage;
    const baseSlot = s.damage?.damage_at_slot_level?.[String(s.level)];
    const baseChar = s.damage?.damage_at_character_level?.['1'];
    const baseDice = parseDice(baseSlot ?? baseChar ?? '');
    const damageType = s.damage?.damage_type?.index;
    if (baseDice && DAMAGE_TYPES.has(damageType)) {
      damage = { base: baseDice, type: damageType };
    } else if (s.damage) {
      report.proseOnlyDamage += 1;
    }

    let healing;
    const healBase = parseDice(s.heal_at_slot_level?.[String(s.level)] ?? '');
    if (healBase) healing = healBase;

    const spell = {
      id: s.index,
      name: s.name,
      system: 'dnd-5e-2014',
      source: 'SRD 5.1',
      level: s.level,
      school,
      castingTime: mapCastingTime(s.casting_time ?? '1 action', report, s.index),
      range: mapRange(s.range ?? 'Self'),
      components: {
        verbal: (s.components ?? []).includes('V'),
        somatic: (s.components ?? []).includes('S'),
        material: (s.components ?? []).includes('M'),
        ...(s.material ? { materialDescription: s.material.replace(/\.$/, '') } : {}),
      },
      duration: mapDuration(s.duration ?? 'Instantaneous', Boolean(s.concentration)),
      ...(s.area_of_effect
        ? { area: `${s.area_of_effect.size}-foot ${s.area_of_effect.type}` }
        : {}),
      ...(s.dc?.dc_type?.index
        ? {
            savingThrow: {
              attribute: s.dc.dc_type.index,
              success:
                s.dc.dc_success === 'half'
                  ? 'half'
                  : s.dc.dc_success === 'none'
                    ? 'none'
                    : 'special',
            },
          }
        : {}),
      ...(s.attack_type ? { attackRoll: true } : {}),
      ...(damage ? { damage } : {}),
      ...(healing ? { healing } : {}),
      concentration: Boolean(s.concentration),
      ritual: Boolean(s.ritual),
      description: (s.desc ?? []).join('\n\n'),
      ...(s.higher_level?.length ? { atHigherLevels: s.higher_level.join('\n\n') } : {}),
      classes: (s.classes ?? []).map((c) => c.index),
    };

    if (!byLevel.has(s.level)) byLevel.set(s.level, []);
    byLevel.get(s.level).push(spell);
    report.encoded += 1;
  }

  for (const [level, spells] of byLevel) {
    spells.sort((a, b) => a.id.localeCompare(b.id));
    const stem = level === 0 ? 'srd-cantrips' : `srd-level-${level}`;
    const exportName = level === 0 ? 'srdCantrips' : `srdLevel${level}Spells`;
    const file = `// GENERATED by scripts/encode-5e-spells.mjs from 5e-bits/5e-database
// (SRD 5.1 spells, OGL 1.0a — see docs/srd-sources.md). Hand-written spells
// live in the non-srd-prefixed files and always win on name match;
// regenerate with: node scripts/encode-5e-spells.mjs

import { Spell } from '../../../../types/magic/spells';

export const ${exportName}: Spell[] = [
${spells.map((spell) => ts(spell)).join(',\n')},
];
`;
    writeFileSync(resolve(`src/data/dnd/5e-2014/spells/${stem}.ts`), file);
    console.log(`${stem}.ts: ${spells.length} spells`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`odd casting times (defaulted to 1 action): ${report.oddCastingTimes.length}`);
  for (const line of report.oddCastingTimes) console.log(`  - ${line}`);
  console.log(`damage left prose-only: ${report.proseOnlyDamage}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
