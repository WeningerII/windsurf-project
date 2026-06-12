/**
 * Encode SRD 5.1 monsters from 5e-bits/5e-database into the repo's Monster
 * data files (goal: close the 38/334 coverage gap measured by srd:coverage).
 *
 * Source: https://github.com/5e-bits/5e-database (data license OGL 1.0a,
 * the same SRD provenance the coverage denominator uses — see
 * docs/srd-sources.md). Entries are emitted with source 'SRD 5.1', which the
 * open-content policy allows for dnd-5e-2014.
 *
 * Honest-mapping rules:
 *  - Hand-written monsters (matched by normalized name) are never overwritten.
 *  - Compound damage-modifier strings ("bludgeoning ... from nonmagical
 *    attacks") don't fit the plain DamageType[] model and are skipped
 *    per-entry (reported), not faked.
 *  - Damage entries with player-choice dice keep prose only (the statblock
 *    parser path), never a guessed die.
 *
 * Usage: node scripts/encode-5e-monsters.mjs   (writes src/data/dnd/5e-2014/
 * monsters/srd-cr-*.ts and prints a report; commit the output).
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en/5e-SRD-Monsters.json';

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

const CREATURE_TYPES = new Set([
  'aberration',
  'beast',
  'celestial',
  'construct',
  'dragon',
  'elemental',
  'fey',
  'fiend',
  'giant',
  'humanoid',
  'monstrosity',
  'ooze',
  'plant',
  'undead',
  'swarm',
]);

const ALIGNMENTS = new Set([
  'lawful good',
  'neutral good',
  'chaotic good',
  'lawful neutral',
  'true neutral',
  'chaotic neutral',
  'lawful evil',
  'neutral evil',
  'chaotic evil',
  'unaligned',
  'any',
]);

const normalizeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function mapAlignment(raw) {
  const value = raw.toLowerCase();
  if (value === 'neutral') return 'true neutral';
  if (value.startsWith('any')) return 'any';
  if (ALIGNMENTS.has(value)) return value;
  return null;
}

function mapType(raw) {
  const value = raw.toLowerCase();
  if (value.startsWith('swarm')) return 'swarm';
  return CREATURE_TYPES.has(value) ? value : null;
}

function parseDice(expr) {
  const match = /^(\d+)d(\d+)(?:\s*\+\s*(\d+))?(?:\s*-\s*(\d+))?$/.exec(expr.trim());
  if (!match) return null;
  const count = Number(match[1]);
  const die = `d${match[2]}`;
  const modifier = match[3] ? Number(match[3]) : match[4] ? -Number(match[4]) : undefined;
  const notation = `${count}${die}${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`;
  return { count, die, modifier, notation };
}

function parseSpeed(speed) {
  const out = {};
  for (const [key, value] of Object.entries(speed ?? {})) {
    if (key === 'hover') continue;
    const feet = Number.parseInt(String(value), 10);
    if (Number.isFinite(feet) && ['walk', 'fly', 'swim', 'burrow', 'climb'].includes(key)) {
      out[key] = feet;
    }
  }
  return out;
}

function mapSenses(senses) {
  const out = [];
  for (const [key, value] of Object.entries(senses ?? {})) {
    if (key === 'passive_perception') {
      out.push(`passive Perception ${value}`);
    } else {
      out.push(`${key.replace(/_/g, ' ')} ${value}`);
    }
  }
  return out;
}

function mapDamageList(list, report, id, label) {
  const mapped = [];
  for (const entry of list ?? []) {
    const value = String(entry).toLowerCase().trim();
    if (DAMAGE_TYPES.has(value)) {
      mapped.push(value);
    } else {
      report.skippedDamageStrings.push(`${id} [${label}]: ${entry}`);
    }
  }
  return mapped;
}

const ABILITY_BY_INDEX = { str: 'str', dex: 'dex', con: 'con', int: 'int', wis: 'wis', cha: 'cha' };

function mapAction(action, report, id) {
  const out = { name: action.name, description: action.desc ?? '' };
  if (typeof action.attack_bonus === 'number') out.attackBonus = action.attack_bonus;

  const reach = /reach (\d+) ?ft/.exec(action.desc ?? '');
  if (reach) out.reach = Number(reach[1]);
  const range = /range (\d+)\/(\d+) ?ft/.exec(action.desc ?? '');
  if (range) out.range = { normal: Number(range[1]), max: Number(range[2]) };

  const damage = [];
  for (const entry of action.damage ?? []) {
    if (!entry.damage_dice || !entry.damage_type) continue; // choice damage: prose only
    const dice = parseDice(entry.damage_dice);
    const type = entry.damage_type.index;
    if (!dice || !DAMAGE_TYPES.has(type)) {
      report.unparsedDamage.push(`${id}/${action.name}: ${entry.damage_dice} ${type}`);
      continue;
    }
    damage.push({ dice, type });
  }
  if (damage.length > 0) out.damage = damage;

  if (action.dc?.dc_type?.index && ABILITY_BY_INDEX[action.dc.dc_type.index]) {
    out.savingThrow = {
      attribute: action.dc.dc_type.index,
      dc: action.dc.dc_value,
      effect: action.dc.success_type ?? 'half',
    };
  }
  if (action.usage?.type === 'recharge on roll' && action.usage.min_value != null) {
    out.recharge = `${action.usage.min_value}-6`;
  }
  return out;
}

function bucketFor(cr) {
  if (cr <= 1) return 'srd-cr-0-1';
  if (cr <= 5) return 'srd-cr-2-5';
  if (cr <= 10) return 'srd-cr-6-10';
  return 'srd-cr-11-plus';
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  // Baseline = the union MINUS this encoder's own previous output, so
  // regeneration is idempotent instead of self-excluding into empty files.
  const existing = await import('../src/data/dnd/5e-2014/monsters/index.ts');
  const generatedNames = new Set();
  for (const stem of ['srd-cr-0-1', 'srd-cr-2-5', 'srd-cr-6-10', 'srd-cr-11-plus']) {
    try {
      const mod = await import(`../src/data/dnd/5e-2014/monsters/${stem}.ts`);
      for (const monster of Object.values(mod)[0] ?? []) {
        generatedNames.add(normalizeName(monster.name));
      }
    } catch {
      // first run: no generated file yet
    }
  }
  const existingNames = new Set(
    existing.dnd5eMonsters
      .map((monster) => normalizeName(monster.name))
      .filter((name) => !generatedNames.has(name))
  );

  const raw = await (await fetch(SOURCE_URL)).json();
  const report = {
    encoded: 0,
    skippedExisting: 0,
    skippedUnmappable: [],
    skippedDamageStrings: [],
    unparsedDamage: [],
  };
  const buckets = new Map();

  for (const m of raw) {
    if (existingNames.has(normalizeName(m.name))) {
      report.skippedExisting += 1;
      continue;
    }
    const type = mapType(m.type);
    const alignment = mapAlignment(m.alignment);
    const hitPoints = parseDice(m.hit_points_roll ?? m.hit_dice ?? '');
    const size = String(m.size ?? '').toLowerCase();
    if (
      !type ||
      !alignment ||
      !hitPoints ||
      !['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].includes(size)
    ) {
      report.skippedUnmappable.push(
        `${m.index}: type=${m.type} align=${m.alignment} hp=${m.hit_points_roll}`
      );
      continue;
    }

    const savingThrows = {};
    const skills = {};
    for (const prof of m.proficiencies ?? []) {
      const save = /^saving-throw-(\w+)$/.exec(prof.proficiency?.index ?? '');
      const skill = /^skill-([\w-]+)$/.exec(prof.proficiency?.index ?? '');
      if (save && ABILITY_BY_INDEX[save[1]]) savingThrows[save[1]] = prof.value;
      if (skill) skills[skill[1]] = prof.value;
    }

    const monster = {
      id: m.index,
      name: m.name,
      system: 'dnd-5e-2014',
      source: 'SRD 5.1',
      size,
      type,
      alignment,
      challengeRating: m.challenge_rating,
      experiencePoints: m.xp,
      armorClass: m.armor_class?.[0]?.value ?? 10,
      hitPoints,
      speed: parseSpeed(m.speed),
      abilities: {
        str: m.strength,
        dex: m.dexterity,
        con: m.constitution,
        int: m.intelligence,
        wis: m.wisdom,
        cha: m.charisma,
      },
      ...(Object.keys(savingThrows).length ? { savingThrows } : {}),
      ...(Object.keys(skills).length ? { skills } : {}),
      ...(() => {
        const res = mapDamageList(m.damage_resistances, report, m.index, 'resist');
        const imm = mapDamageList(m.damage_immunities, report, m.index, 'immune');
        const vul = mapDamageList(m.damage_vulnerabilities, report, m.index, 'vuln');
        return {
          ...(res.length ? { damageResistances: res } : {}),
          ...(imm.length ? { damageImmunities: imm } : {}),
          ...(vul.length ? { damageVulnerabilities: vul } : {}),
        };
      })(),
      ...(m.condition_immunities?.length
        ? { conditionImmunities: m.condition_immunities.map((c) => c.index) }
        : {}),
      senses: mapSenses(m.senses),
      languages: (m.languages ?? '')
        .split(/,\s*/)
        .map((lang) => lang.trim())
        .filter((lang) => lang && lang !== '--'),
      ...(m.special_abilities?.length
        ? {
            specialAbilities: m.special_abilities.map((ability) => ({
              name: ability.name,
              description: ability.desc ?? '',
            })),
          }
        : {}),
      actions: (m.actions ?? []).map((action) => mapAction(action, report, m.index)),
      ...(m.reactions?.length
        ? { reactions: m.reactions.map((action) => mapAction(action, report, m.index)) }
        : {}),
      ...(m.legendary_actions?.length
        ? {
            legendaryActions: m.legendary_actions.map((action) => ({
              name: action.name.replace(/\s*\(Costs \d+ Actions\)\s*$/i, ''),
              cost: Number(/\(Costs (\d+) Actions\)/i.exec(action.name)?.[1] ?? 1),
              description: action.desc ?? '',
            })),
          }
        : {}),
    };

    const bucket = bucketFor(m.challenge_rating);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(monster);
    report.encoded += 1;
  }

  for (const [bucket, monsters] of buckets) {
    monsters.sort((a, b) => a.challengeRating - b.challengeRating || a.id.localeCompare(b.id));
    const body = monsters.map((monster) => ts(monster)).join(',\n');
    const file = `// GENERATED by scripts/encode-5e-monsters.mjs from 5e-bits/5e-database
// (SRD 5.1 monsters, OGL 1.0a — see docs/srd-sources.md). Hand-written
// monsters live in the non-srd-prefixed files and always win on name match;
// regenerate with: node scripts/encode-5e-monsters.mjs

import { Monster } from '../../../../types/creatures/monsters';

export const ${bucket.replace(/-(\w)/g, (_, c) => c.toUpperCase())}Monsters: Monster[] = [
${body},
];
`;
    writeFileSync(resolve(`src/data/dnd/5e-2014/monsters/${bucket}.ts`), file);
    console.log(`${bucket}.ts: ${monsters.length} monsters`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`unmappable (skipped): ${report.skippedUnmappable.length}`);
  for (const line of report.skippedUnmappable) console.log(`  - ${line}`);
  console.log(`compound damage strings skipped: ${report.skippedDamageStrings.length}`);
  console.log(`unparsed damage dice (prose-only): ${report.unparsedDamage.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
