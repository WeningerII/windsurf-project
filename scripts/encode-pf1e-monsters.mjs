/**
 * Encode Pathfinder 1e Bestiary 1 monsters from devonjones/PSRD-Data
 * (the community PSRD parser output of Paizo's PRD — Open Game Content; see
 * docs/srd-sources.md) into the repo's Monster data files for pf1e.
 *
 * Source layout: one JSON per creature in `bestiary/creature/`. The repo
 * carries large SQLite artifacts, so this encoder reads a LOCAL sparse clone:
 *
 *   git clone --depth 1 --filter=blob:none --sparse \
 *     https://github.com/devonjones/PSRD-Data.git /tmp/psrd
 *   git -C /tmp/psrd sparse-checkout set bestiary/creature
 *   npx tsx scripts/encode-pf1e-monsters.mjs /tmp/psrd
 *
 * It also writes scripts/data/pf1e-bestiary-manifest.json — the verbatim
 * upstream creature list — which `npm run srd:coverage` uses as the Bestiary 1
 * denominator (GitHub's HTML tree truncates and its API is rate-limited, so
 * the pinned manifest keeps the denominator exact and reproducible).
 *
 * Honest-mapping rules (mirroring the other bestiary encoders):
 *  - Entries without a full stat block (no hp/creature_type/base_attack —
 *    PSRD includes a few non-creature records) are skipped and reported.
 *  - Fine/Diminutive/Colossal collapse to the nearest representable size
 *    band, reported per run. Nonability scores ('-') encode as 0.
 *  - The FIRST melee/ranged attack clause parses into structured
 *    attackBonus/damage; rider damage ("plus 1d6 acid") and everything
 *    unparseable stays prose — never guessed.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const psrdRoot = process.argv[2];
if (!psrdRoot) {
  console.error('Usage: npx tsx scripts/encode-pf1e-monsters.mjs <path-to-PSRD-Data-clone>');
  process.exit(1);
}
const creatureDir = join(psrdRoot, 'bestiary', 'creature');

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
  'animal',
  'construct',
  'dragon',
  'fey',
  'humanoid',
  'magical-beast',
  'monstrous-humanoid',
  'ooze',
  'outsider',
  'plant',
  'undead',
  'vermin',
]);

// Fine/Diminutive/Colossal collapse to the nearest representable band.
const MONSTER_SIZE = {
  fine: 'tiny',
  diminutive: 'tiny',
  tiny: 'tiny',
  small: 'small',
  medium: 'medium',
  large: 'large',
  huge: 'huge',
  gargantuan: 'gargantuan',
  colossal: 'gargantuan',
};

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

const CR_FRACTIONS = { '1/8': 0.125, '1/6': 1 / 6, '1/4': 0.25, '1/3': 1 / 3, '1/2': 0.5 };

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const num = (raw) => {
  const n = Number(String(raw ?? '').replace(/[+,]/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

/** Ability score: '-' is a nonability (RAW), encoded as 0. */
const ability = (raw) => {
  const n = num(raw);
  return n === undefined ? 0 : n;
};

function mapAlignment(raw) {
  const value = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!value || value.startsWith('any') || value.includes('alignment')) return 'any';
  return ALIGNMENT_ABBREV[value] ?? 'any';
}

function parseHp(raw, report, id) {
  const m = /^(\d+)\s*\((\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/.exec(String(raw ?? ''));
  if (!m) {
    report.skippedUnmappable.push(`${id}: hp=${raw}`);
    return null;
  }
  const modifier = m[5] ? (m[4] === '-' ? -Number(m[5]) : Number(m[5])) : undefined;
  return {
    count: Number(m[2]),
    die: `d${m[3]}`,
    ...(modifier !== undefined ? { modifier } : {}),
    notation: `${m[2]}d${m[3]}${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`,
  };
}

function parseSpeed(raw) {
  const text = String(raw ?? '');
  const out = {};
  const walk = /^(\d+)\s*ft/.exec(text.trim());
  if (walk) out.walk = Number(walk[1]);
  for (const [, mode, feet] of text.matchAll(/(burrow|climb|fly|swim)\s+(\d+)\s*ft/gi)) {
    out[mode.toLowerCase()] = Number(feet);
  }
  return out;
}

function parseSkills(raw) {
  const skills = {};
  for (const [, name, bonus] of String(raw ?? '').matchAll(/([A-Za-z' ()]+?)\s*([+-]\d+)/g)) {
    const key = name
      .trim()
      .toLowerCase()
      .replace(/\s*\(.*\)\s*/g, '')
      .replace(/\s+/g, '-');
    if (key && !(key in skills)) skills[key] = Number(bonus.replace('+', ''));
  }
  return skills;
}

/**
 * Parse the FIRST attack clause of a melee/ranged line, e.g.
 * "4 tentacles +10 (1d6+5 plus slime)" or "mwk longsword +5/+0 (1d8+2/19-20)".
 * Iterative suffixes (/+5) are dropped: the tactical executor derives
 * iteratives from BAB. Damage keeps the first dice term; riders stay prose.
 */
function parseAttackClause(raw, report, id, label) {
  const text = String(raw ?? '').trim();
  if (!text || text === '-') return null;
  const m = /^(?:(\d+)\s+)?(.+?)\s+([+-]\d+)(?:\/[+-]\d+)*\s*\((.+?)\)/.exec(text);
  if (!m) {
    if (text) report.unparsedAttacks.push(`${id} [${label}]: ${text}`);
    return null;
  }
  const name = m[2].replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  const dmg = /(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/.exec(m[4]);
  const damage = [];
  if (dmg) {
    const modifier = dmg[4] ? (dmg[3] === '-' ? -Number(dmg[4]) : Number(dmg[4])) : undefined;
    const typeWord = /\b(acid|bludgeoning|cold|electricity|fire|piercing|slashing|sonic)\b/i.exec(
      m[4]
    )?.[1];
    // PF1e electricity/sonic map onto the shared lightning/thunder vocabulary.
    const TYPE_MAP = { electricity: 'lightning', sonic: 'thunder' };
    const mapped = typeWord ? (TYPE_MAP[typeWord.toLowerCase()] ?? typeWord.toLowerCase()) : null;
    damage.push({
      dice: {
        count: Number(dmg[1]),
        die: `d${dmg[2]}`,
        ...(modifier !== undefined ? { modifier } : {}),
        notation: `${dmg[1]}d${dmg[2]}${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`,
      },
      type: mapped && DAMAGE_TYPES.has(mapped) ? mapped : 'bludgeoning',
    });
  }
  return {
    name,
    description: `${label === 'ranged' ? 'Ranged' : 'Melee'}: ${text}`,
    attackBonus: Number(m[3]),
    ...(damage.length ? { damage } : {}),
  };
}

function bucketFor(cr) {
  if (cr <= 1) return 'srd-cr-0-1';
  if (cr <= 5) return 'srd-cr-2-5';
  if (cr <= 10) return 'srd-cr-6-10';
  return 'srd-cr-11-plus';
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  const normalizeName = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  // Baseline = the union MINUS this encoder's own previous output.
  const generatedNames = new Set();
  for (const stem of ['srd-cr-0-1', 'srd-cr-2-5', 'srd-cr-6-10', 'srd-cr-11-plus']) {
    try {
      const mod = await import(`../src/data/pathfinder/1e/monsters/${stem}.ts`);
      for (const monster of Object.values(mod)[0] ?? []) {
        generatedNames.add(normalizeName(monster.name));
      }
    } catch {
      // first run: no generated file yet
    }
  }
  let existingNames = new Set();
  try {
    const existing = await import('../src/data/pathfinder/1e/monsters/index.ts');
    existingNames = new Set(
      (existing.pf1eMonsters ?? [])
        .map((monster) => normalizeName(monster.name))
        .filter((name) => !generatedNames.has(name))
    );
  } catch {
    // first run: no index yet
  }

  const files = readdirSync(creatureDir)
    .filter((file) => file.endsWith('.json'))
    .sort();
  const report = {
    encoded: 0,
    skippedExisting: 0,
    skippedUnmappable: [],
    collapsedSizes: [],
    unparsedAttacks: [],
  };
  const buckets = new Map();
  const manifest = [];

  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(creatureDir, file), 'utf8'));
    const id = slug(raw.name ?? file.replace(/\.json$/, ''));
    manifest.push({ file, name: raw.name ?? id });

    if (!raw.hp || !raw.creature_type || raw.base_attack === undefined) {
      report.skippedUnmappable.push(`${id}: not a full stat block`);
      continue;
    }
    if (existingNames.has(normalizeName(raw.name))) {
      report.skippedExisting += 1;
      continue;
    }

    const type = String(raw.creature_type).toLowerCase().replace(/\s+/g, '-');
    const sizeRaw = String(raw.size ?? '').toLowerCase();
    const size = MONSTER_SIZE[sizeRaw];
    const cr = CR_FRACTIONS[String(raw.cr)] ?? num(raw.cr);
    const hitPoints = parseHp(raw.hp, report, id);
    if (!CREATURE_TYPES.has(type) || !size || cr === undefined || !hitPoints) {
      if (CREATURE_TYPES.has(type) && hitPoints) {
        report.skippedUnmappable.push(`${id}: size=${raw.size} cr=${raw.cr}`);
      } else if (hitPoints) {
        report.skippedUnmappable.push(`${id}: type=${raw.creature_type}`);
      }
      continue;
    }
    if (sizeRaw !== size) report.collapsedSizes.push(`${id}: ${sizeRaw} -> ${size}`);

    const ac = num(String(raw.ac ?? '').split(',')[0]) ?? 10;
    const actions = [];
    const melee = parseAttackClause(raw.melee, report, id, 'melee');
    if (melee) actions.push(melee);
    const ranged = parseAttackClause(raw.ranged, report, id, 'ranged');
    if (ranged) actions.push(ranged);
    const skills = parseSkills(raw.skills);

    const monster = {
      id,
      name: raw.name,
      system: 'pf1e',
      // PSRD's source string for Bestiary 1 entries (open content; PRD).
      source: 'Bestiary',
      size,
      type,
      alignment: mapAlignment(raw.alignment),
      challengeRating: cr,
      experiencePoints: num(raw.xp) ?? 0,
      armorClass: ac,
      hitPoints,
      speed: parseSpeed(raw.speed),
      abilities: {
        str: ability(raw.strength),
        dex: ability(raw.dexterity),
        con: ability(raw.constitution),
        int: ability(raw.intelligence),
        wis: ability(raw.wisdom),
        cha: ability(raw.charisma),
      },
      d20Saves: {
        fort: num(raw.fortitude) ?? 0,
        ref: num(raw.reflex) ?? 0,
        will: num(raw.will) ?? 0,
      },
      baseAttackBonus: num(raw.base_attack) ?? 0,
      ...(Object.keys(skills).length ? { skills } : {}),
      senses: String(raw.senses ?? '')
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      languages: String(raw.languages ?? '')
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      actions,
      ...(raw.description ? { description: String(raw.description) } : {}),
      ...(raw.environment ? { environment: [String(raw.environment)] } : {}),
    };

    const bucket = bucketFor(cr);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(monster);
    report.encoded += 1;
  }

  mkdirSync(resolve('src/data/pathfinder/1e/monsters'), { recursive: true });
  for (const [bucket, monsters] of buckets) {
    monsters.sort((a, b) => a.challengeRating - b.challengeRating || a.id.localeCompare(b.id));
    const body = monsters.map((monster) => ts(monster)).join(',\n');
    const constName = `pf1e${bucket
      .replace(/^srd-/, 'Srd-')
      .replace(/-(\w)/g, (_, c) => c.toUpperCase())}Monsters`;
    const file = `// GENERATED by scripts/encode-pf1e-monsters.mjs from devonjones/PSRD-Data
// (Pathfinder 1e Bestiary 1 via the PRD — Open Game Content; see
// docs/srd-sources.md). Hand-written monsters always win on name match;
// regenerate per the encoder header.

import { Monster } from '../../../../types/creatures/monsters';

export const ${constName}: Monster[] = [
${body},
];
`;
    writeFileSync(resolve(`src/data/pathfinder/1e/monsters/${bucket}.ts`), file);
    console.log(`${bucket}.ts: ${monsters.length} monsters`);
  }

  mkdirSync(resolve('scripts/data'), { recursive: true });
  writeFileSync(
    resolve('scripts/data/pf1e-bestiary-manifest.json'),
    JSON.stringify(
      {
        source: 'devonjones/PSRD-Data bestiary/creature (Bestiary 1, PRD OGC)',
        generatedBy: 'scripts/encode-pf1e-monsters.mjs',
        entries: manifest,
      },
      null,
      2
    )
  );
  console.log(`manifest: ${manifest.length} upstream entries`);

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`not full stat blocks / unmappable: ${report.skippedUnmappable.length}`);
  for (const line of report.skippedUnmappable.slice(0, 20)) console.log(`  - ${line}`);
  console.log(`sizes collapsed to nearest band: ${report.collapsedSizes.length}`);
  console.log(`unparsed attack lines (prose-only): ${report.unparsedAttacks.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
