/**
 * Encode Pathfinder 2e Bestiary 1 creatures from Pf2eToolsOrg/Pf2eTools
 * (book-segmented JSON of the OGL-era PF2e content — the same source family
 * the pf2e spell denominator uses; see docs/srd-sources.md) into the repo's
 * Monster data files for pf2e.
 *
 * Source: data/bestiary/creatures-b1.json (`source: "B1"`, 413 creatures).
 *
 * PF2e-specific mapping notes:
 *  - `level` (PF2e's CR analog, can be -1) maps onto challengeRating.
 *  - experiencePoints is 0 BY DESIGN: PF2e awards XP relative to the party's
 *    level (Building Encounters), so a creature has no fixed XP. The PF2e
 *    encounter budget machinery computes it at draft time.
 *  - abilityMods are MODIFIERS; scores encode as 10 + 2*mod.
 *  - Stat blocks print flat HP (no dice): hitPoints encodes as a flat
 *    modifier (count 0) so monsterAverageHitPoints returns the printed value.
 *  - Attacks carry structured attack bonuses; damage dice parse from the
 *    `{@damage XdY+Z}` tag and the PRIMARY damage type from the word after that
 *    tag (types[] is alphabetized, so its [0] is often a rider, not the
 *    physical type). When no known type can be determined the damage stays
 *    prose-only — a type is never guessed.
 *
 * Usage: npx tsx scripts/encode-pf2e-monsters.mjs   (writes
 * src/data/pathfinder/2e/monsters/srd-level-*.ts and prints a report).
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/bestiary/creatures-b1.json';

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
// PF2e electricity/sonic map onto the shared lightning/thunder vocabulary;
// its unique types (chaotic/evil/...) have no slot and stay prose.
const TYPE_MAP = { electricity: 'lightning', sonic: 'thunder' };

const CREATURE_TYPES = new Set([
  'aberration',
  'animal',
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
  'vermin',
  // PF2e-specific types (added to the shared CreatureType union).
  'monitor',
  'fungus',
  'astral',
]);

const SIZES = new Set(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']);

const ALIGNMENT_ABBREV = {
  lg: 'lawful good',
  ng: 'neutral good',
  cg: 'chaotic good',
  ln: 'lawful neutral',
  n: 'true neutral',
  cn: 'chaotic neutral',
  le: 'lawful evil',
  ne: 'neutral evil',
  ce: 'chaotic evil',
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
    .replace(/^-+|-+$/g, '');

/** Strip Pf2eTools {@tag ...} markup down to its display text. */
const untag = (text) =>
  String(text ?? '').replace(/\{@\w+ ([^}|]*)(?:\|[^}]*)?\}/g, '$1');

function parseDamage(raw, report, id, attackName) {
  const text = untag(raw);
  const m = /(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/.exec(text);
  if (!m) {
    if (text.trim()) report.unparsedDamage.push(`${id}/${attackName}: ${text}`);
    return null;
  }
  const modifier = m[4] ? (m[3] === '-' ? -Number(m[4]) : Number(m[4])) : undefined;
  return {
    count: Number(m[1]),
    die: `d${m[2]}`,
    ...(modifier !== undefined ? { modifier } : {}),
    notation: `${m[1]}d${m[2]}${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`,
  };
}

/**
 * The PRIMARY (weapon) damage type. PF2e prints it as the word after the first
 * {@damage}/{@dice} clause ('{@damage 1d6+1} piercing plus {@damage 1d4} lawful'),
 * so the string is authoritative. `types[]` is alphabetized — its [0] is often a
 * rider type (lawful/evil/bleed), NOT the physical type — so it is only a
 * fallback, scanned for the first KNOWN damage type. Returns null when no known
 * type can be determined; the caller then leaves the damage prose-only rather
 * than guessing (the encoder's "never guessed" contract).
 */
function primaryDamageType(rawDamage, typesArr) {
  const firstClause = String(rawDamage ?? '').split(/\bplus\b/i)[0];
  const fromStringMatch = /\{@(?:damage|dice)[^}]*\}\s*([a-zA-Z]+)/.exec(firstClause);
  const fromString = fromStringMatch
    ? (TYPE_MAP[fromStringMatch[1].toLowerCase()] ?? fromStringMatch[1].toLowerCase())
    : '';
  if (DAMAGE_TYPES.has(fromString)) return fromString;
  for (const raw of typesArr ?? []) {
    const mapped = TYPE_MAP[String(raw).toLowerCase()] ?? String(raw).toLowerCase();
    if (DAMAGE_TYPES.has(mapped)) return mapped;
  }
  return null;
}

function mapAttack(attack, report, id) {
  const name = String(attack.name ?? 'Strike').replace(/\b\w/g, (c) => c.toUpperCase());
  const action = {
    name,
    description: `${attack.range ?? 'Melee'} Strike ${attack.attack >= 0 ? '+' : ''}${attack.attack ?? 0} (${untag(attack.damage ?? '')})`,
    ...(typeof attack.attack === 'number' ? { attackBonus: attack.attack } : {}),
  };
  const dice = parseDamage(attack.damage, report, id, name);
  if (dice) {
    const type = primaryDamageType(attack.damage, attack.types);
    if (type) {
      action.damage = [{ dice, type }];
    } else {
      // No known damage type — keep the dice in the description prose, emit no
      // structured (and therefore no fabricated) type.
      report.untypedDamage.push(`${id}/${name}: ${untag(attack.damage ?? '')}`);
    }
  }
  return action;
}

function bucketFor(level) {
  if (level <= 1) return 'srd-level-0-1';
  if (level <= 5) return 'srd-level-2-5';
  if (level <= 10) return 'srd-level-6-10';
  return 'srd-level-11-plus';
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  // Baseline = the union MINUS this encoder's own previous output.
  const generatedNames = new Set();
  for (const stem of ['srd-level-0-1', 'srd-level-2-5', 'srd-level-6-10', 'srd-level-11-plus']) {
    try {
      const mod = await import(`../src/data/pathfinder/2e/monsters/${stem}.ts`);
      for (const monster of Object.values(mod)[0] ?? []) {
        generatedNames.add(normalizeName(monster.name));
      }
    } catch {
      // first run: no generated file yet
    }
  }
  let existingNames = new Set();
  try {
    const existing = await import('../src/data/pathfinder/2e/monsters/index.ts');
    existingNames = new Set(
      (existing.pf2eMonsters ?? [])
        .map((monster) => normalizeName(monster.name))
        .filter((name) => !generatedNames.has(name))
    );
  } catch {
    // first run: no index yet
  }

  const raw = await (await fetch(SOURCE_URL)).json();
  const creatures = raw.creature ?? [];

  const report = {
    encoded: 0,
    skippedExisting: 0,
    skippedUnmappable: [],
    noAttacks: [],
    unparsedDamage: [],
    untypedDamage: [],
  };
  const buckets = new Map();

  for (const c of creatures) {
    if (existingNames.has(normalizeName(c.name))) {
      report.skippedExisting += 1;
      continue;
    }
    const id = slug(c.name);
    const traits = (c.traits ?? []).map((t) => String(t).toLowerCase());
    const size = traits.find((t) => SIZES.has(t));
    // A handful of blocks (soulbound doll) carry no alignment trait: the
    // creature's alignment varies, which is exactly what 'any' encodes.
    const alignment = ALIGNMENT_ABBREV[traits.find((t) => t in ALIGNMENT_ABBREV)] ?? 'any';
    const type = traits.find((t) => CREATURE_TYPES.has(t));
    const mods = c.abilityMods;
    const defenses = c.defenses ?? {};
    const hpTotal = (defenses.hp ?? []).reduce(
      (sum, part) => sum + (typeof part.hp === 'number' ? part.hp : 0),
      0
    );
    if (!size || !alignment || !type || !mods || !defenses.ac?.std || hpTotal <= 0) {
      report.skippedUnmappable.push(
        `${id}: size=${size} align=${alignment} type=${type} hp=${hpTotal}`
      );
      continue;
    }

    const skills = {};
    for (const [skill, value] of Object.entries(c.skills ?? {})) {
      if (typeof value?.std === 'number') skills[slug(skill)] = value.std;
    }
    if (typeof c.perception?.std === 'number') skills.perception = c.perception.std;

    const speed = {};
    for (const [mode, feet] of Object.entries(c.speed ?? {})) {
      if (['walk', 'fly', 'swim', 'burrow', 'climb'].includes(mode) && typeof feet === 'number') {
        speed[mode] = feet;
      }
    }

    const actions = (c.attacks ?? []).map((attack) => mapAttack(attack, report, id));
    if (!actions.length) report.noAttacks.push(id);

    const monster = {
      id,
      name: c.name,
      system: 'pf2e',
      // Pf2eTools' tag for Bestiary 1 (OGL-era PF2e content).
      source: 'B1',
      size,
      type,
      alignment,
      // PF2e creature LEVEL (can be -1). XP is relative to the party in PF2e
      // (Building Encounters), so no fixed experiencePoints exists.
      challengeRating: c.level ?? 0,
      experiencePoints: 0,
      armorClass: defenses.ac.std,
      // Flat printed HP (PF2e blocks carry no dice): count 0 + modifier keeps
      // monsterAverageHitPoints returning the printed value.
      hitPoints: { count: 0, die: 'd6', modifier: hpTotal, notation: `${hpTotal}` },
      speed,
      abilities: {
        str: 10 + 2 * (mods.str ?? 0),
        dex: 10 + 2 * (mods.dex ?? 0),
        con: 10 + 2 * (mods.con ?? 0),
        int: 10 + 2 * (mods.int ?? 0),
        wis: 10 + 2 * (mods.wis ?? 0),
        cha: 10 + 2 * (mods.cha ?? 0),
      },
      d20Saves: {
        fort: defenses.savingThrows?.fort?.std ?? 0,
        ref: defenses.savingThrows?.ref?.std ?? 0,
        will: defenses.savingThrows?.will?.std ?? 0,
      },
      ...(Object.keys(skills).length ? { skills } : {}),
      senses: (c.senses ?? []).map((sense) =>
        typeof sense === 'string' ? sense : untag(sense?.name ?? '')
      ),
      languages: (c.languages?.languages ?? []).map((language) => untag(language)),
      actions,
    };

    const bucket = bucketFor(monster.challengeRating);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(monster);
    report.encoded += 1;
  }

  mkdirSync(resolve('src/data/pathfinder/2e/monsters'), { recursive: true });
  for (const [bucket, monsters] of buckets) {
    monsters.sort((a, b) => a.challengeRating - b.challengeRating || a.id.localeCompare(b.id));
    const body = monsters.map((monster) => ts(monster)).join(',\n');
    const constName = `pf2e${bucket
      .replace(/^srd-/, 'Srd-')
      .replace(/-(\w)/g, (_, ch) => ch.toUpperCase())}Monsters`;
    const file = `// GENERATED by scripts/encode-pf2e-monsters.mjs from Pf2eToolsOrg/Pf2eTools
// (PF2e Bestiary 1, OGL-era content — see docs/srd-sources.md). Hand-written
// monsters always win on name match; regenerate with:
// npx tsx scripts/encode-pf2e-monsters.mjs

import { Monster } from '../../../../types/creatures/monsters';

export const ${constName}: Monster[] = [
${body},
];
`;
    writeFileSync(resolve(`src/data/pathfinder/2e/monsters/${bucket}.ts`), file);
    console.log(`${bucket}.ts: ${monsters.length} monsters`);
  }

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`unmappable (skipped): ${report.skippedUnmappable.length}`);
  for (const line of report.skippedUnmappable) console.log(`  - ${line}`);
  console.log(`creatures without attack entries: ${report.noAttacks.length}`);
  console.log(`unparsed damage (prose-only): ${report.unparsedDamage.length}`);
  console.log(`untyped damage (prose-only, no type guessed): ${report.untypedDamage.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
