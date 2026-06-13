/**
 * Encode SRD 3.5 core monsters: olimot/srd-v3.5-md monster chapters provide
 * the clean CORE name list (and the coverage denominator); Rughalt/D35E
 * packs/bestiary.db (OGL, Foundry schema) provides structured data. The
 * intersection excludes D35E's psionics/epic extras.
 *
 * Mapping notes (kept honest, reported per run):
 *  - Creature type and racial HD come from the monster's class item
 *    ('Giant*', hd 8, levels 4); hitPoints modifier = hp.max − round(levels ×
 *    (hd+1)/2), the SRD's own average convention.
 *  - Attack bonuses derive per RAW: BAB + Str (melee) / Dex (ranged) + size
 *    modifier. Damage dice resolve sizeRoll(c, d, @size) through the SRD 3.5
 *    size-step damage table; unresolvable formulas stay prose-only.
 *  - Alignment qualifiers ('Usually chaotic evil') strip to the base
 *    alignment; 'Any'/'Varies' map to 'any'.
 *
 * Usage: node scripts/encode-35e-monsters.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OLIMOT = 'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/monsters';
const OLIMOT_FILES = [
  'monsters-intro-a.md',
  'monsters-b-c.md',
  'monsters-d-de.md',
  'monsters-di-do.md',
  'monsters-dr-dw.md',
  'monsters-e-f.md',
  'monsters-g.md',
  'monsters-h-i.md',
  'monsters-k-l.md',
  'monsters-m-n.md',
  'monsters-o-r.md',
  'monsters-s.md',
  'monsters-t-z.md',
  'monsters-animals.md',
  'monsters-vermin.md',
];
const D35E_BESTIARY = 'https://raw.githubusercontent.com/Rughalt/D35E/master/packs/bestiary.db';

const SIZE_BY_CODE = {
  fine: 'fine',
  dim: 'diminutive',
  tiny: 'tiny',
  sm: 'small',
  med: 'medium',
  lg: 'large',
  huge: 'huge',
  grg: 'gargantuan',
  col: 'colossal',
};
// Monster type union sizes (5e-shaped); 3.5 fine/diminutive/colossal collapse
// to their nearest representable band, reported per run.
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
const SIZE_STEPS = [
  'fine',
  'diminutive',
  'tiny',
  'small',
  'medium',
  'large',
  'huge',
  'gargantuan',
  'colossal',
];
const SIZE_ATTACK_MOD = {
  fine: 8,
  diminutive: 4,
  tiny: 2,
  small: 1,
  medium: 0,
  large: -1,
  huge: -2,
  gargantuan: -4,
  colossal: -8,
};

// SRD 3.5 damage-by-size progression rows (medium column index 4).
const DICE_PROGRESSIONS = [
  ['1', '1d2', '1d3', '1d4', '1d6', '1d8', '2d6', '3d6', '4d6'],
  ['1d2', '1d3', '1d4', '1d6', '1d8', '2d6', '3d6', '4d6', '6d6'],
  ['1d3', '1d4', '1d6', '1d8', '1d10', '2d8', '3d8', '4d8', '6d8'],
  ['1d4', '1d6', '1d8', '1d10', '2d6', '3d6', '4d6', '6d6', '8d6'],
  ['1d6', '1d8', '1d10', '2d6', '3d6', '4d6', '6d6', '8d6', '12d6'],
  ['1d8', '1d10', '2d6', '2d8', '3d8', '4d8', '6d8', '8d8', '12d8'],
];

const TYPE_MAP = {
  aberration: 'aberration',
  animal: 'animal',
  construct: 'construct',
  dragon: 'dragon',
  elemental: 'elemental',
  fey: 'fey',
  giant: 'giant',
  humanoid: 'humanoid',
  'magical beast': 'magical-beast',
  'monstrous humanoid': 'monstrous-humanoid',
  ooze: 'ooze',
  outsider: 'outsider',
  plant: 'plant',
  undead: 'undead',
  vermin: 'vermin',
};

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

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const mod = (score) => Math.floor((Number(score ?? 10) - 10) / 2);

function mapAlignment(raw) {
  let value = String(raw ?? '')
    .toLowerCase()
    .replace(/^(usually|often|always)\s+/, '')
    .trim();
  if (value === 'neutral') value = 'true neutral';
  if (!value || value.startsWith('any') || value.startsWith('varies')) return 'any';
  if (value === 'none' || value.startsWith('unaligned')) return 'unaligned';
  return ALIGNMENTS.has(value) ? value : 'any';
}

/** Resolve a sizeRoll(count, die, @size) formula via the SRD size table. */
function resolveSizeRoll(count, die, sizeName, report, label) {
  const medium = `${count}d${die}`;
  const row = DICE_PROGRESSIONS.find((entry) => entry[4] === medium);
  const steps = SIZE_STEPS.indexOf(sizeName);
  if (!row || steps === -1) {
    report.unresolvedDice.push(`${label}: sizeRoll(${count}, ${die}) @${sizeName}`);
    return null;
  }
  const cell = row[steps];
  const parsed = /^(\d+)d(\d+)$/.exec(cell);
  if (!parsed) {
    report.unresolvedDice.push(`${label}: table cell '${cell}'`);
    return null;
  }
  return { count: Number(parsed[1]), die: `d${parsed[2]}`, notation: cell };
}

function stripHtml(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  // Core name list = the olimot chapter headers.
  const coreNames = new Set();
  for (const file of OLIMOT_FILES) {
    const text = await (await fetch(`${OLIMOT}/${file}`)).text();
    for (const match of text.matchAll(/^## (.+)$/gm)) coreNames.add(normalizeName(match[1]));
  }
  console.log(`core SRD names: ${coreNames.size}`);

  const rows = (await (await fetch(D35E_BESTIARY)).text())
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));

  // Idempotency baseline: prior generated output.
  const generatedIds = new Set();
  for (const stem of ['srd-cr-0-1', 'srd-cr-2-5', 'srd-cr-6-10', 'srd-cr-11-plus']) {
    try {
      const mod35 = await import(`../src/data/dnd/3.5e/monsters/${stem}.ts`);
      for (const monster of Object.values(mod35)[0] ?? []) generatedIds.add(monster.id);
    } catch {
      /* first run */
    }
  }

  const report = {
    encoded: 0,
    skippedNonCore: 0,
    skipped: [],
    unresolvedDice: [],
    sizeCollapsed: 0,
  };
  const buckets = new Map();
  const seenIds = new Set();

  for (const row of rows) {
    const name = row.name?.trim();
    if (!name || !coreNames.has(normalizeName(name))) {
      report.skippedNonCore += 1;
      continue;
    }
    const id = `${slug(name)}-35e-monster`;
    if (seenIds.has(id)) continue; // first entry wins among D35E variants
    const d = row.data ?? {};
    const classItem = (row.items ?? []).find((item) => item.type === 'class');
    const typeName = (classItem?.name ?? '').replace(/\*+$/, '').trim().toLowerCase();
    const type = TYPE_MAP[typeName];
    const sizeName = SIZE_BY_CODE[d.traits?.size] ?? 'medium';
    const hd = Number(classItem?.data?.hd ?? 8);
    const levels = Number(classItem?.data?.levels ?? d.attributes?.hd?.total ?? 1);
    const hpMax = Number(d.attributes?.hp?.max ?? 0);
    const cr = Number(d.details?.cr ?? 0);
    if (!type || !hpMax || !levels) {
      report.skipped.push(`${name}: type='${typeName}' hp=${hpMax} levels=${levels}`);
      continue;
    }
    if (MONSTER_SIZE[sizeName] !== sizeName) report.sizeCollapsed += 1;

    const abilities = Object.fromEntries(
      ['str', 'dex', 'con', 'int', 'wis', 'cha'].map((key) => [
        key,
        Number(d.abilities?.[key]?.total ?? 10),
      ])
    );
    const bab = Number(d.attributes?.bab?.total ?? 0);
    const sizeMod = SIZE_ATTACK_MOD[sizeName] ?? 0;
    const avgHp = Math.round(levels * ((hd + 1) / 2));

    const actions = [];
    for (const item of (row.items ?? []).filter((entry) => entry.type === 'attack')) {
      const isRanged = /ranged|thrown|bow|javelin|sling|crossbow/i.test(
        `${item.name} ${item.data?.actionType ?? ''}`
      );
      const attackBonus = bab + (isRanged ? mod(abilities.dex) : mod(abilities.str)) + sizeMod;
      const damage = [];
      for (const part of item.data?.damage?.parts ?? []) {
        const formula = String(part[0] ?? '');
        const sizeRoll = /sizeRoll\((\d+),\s*(\d+)/.exec(formula);
        const plain = /^(\d+)d(\d+)/.exec(formula);
        let dice = null;
        if (sizeRoll) {
          dice = resolveSizeRoll(
            Number(sizeRoll[1]),
            Number(sizeRoll[2]),
            sizeName,
            report,
            `${name}/${item.name}`
          );
        } else if (plain) {
          dice = {
            count: Number(plain[1]),
            die: `d${plain[2]}`,
            notation: `${plain[1]}d${plain[2]}`,
          };
        }
        if (dice) {
          const typeToken = String(part[1] ?? '').toUpperCase();
          const damageType =
            { B: 'bludgeoning', P: 'piercing', S: 'slashing' }[typeToken] ?? 'bludgeoning';
          damage.push({
            dice: {
              ...dice,
              ...(mod(abilities.str) ? { modifier: mod(abilities.str) } : {}),
              notation: `${dice.notation}${mod(abilities.str) > 0 ? `+${mod(abilities.str)}` : mod(abilities.str) < 0 ? `${mod(abilities.str)}` : ''}`,
            },
            type: damageType,
          });
        }
      }
      actions.push({
        name: item.name,
        description:
          stripHtml(item.data?.description?.value).slice(0, 300) ||
          `${item.name} attack (${isRanged ? 'ranged' : 'melee'}).`,
        attackBonus,
        ...(damage.length ? { damage } : {}),
      });
    }

    const monster = {
      id,
      name,
      system: 'dnd-3.5e',
      source: 'SRD 3.5',
      size: MONSTER_SIZE[sizeName],
      type,
      alignment: mapAlignment(d.details?.alignment),
      challengeRating: Number.isFinite(cr) ? cr : 0,
      // 3.5e awards XP relative to PARTY level (DMG: encounter XP tables), so a
      // monster carries no intrinsic XP value — encoded as 0, matching the PF2e
      // convention. (The D35E source's details.xp.value is a flat 10 placeholder
      // on every entry, so trusting it stamped every creature with 10 XP.)
      experiencePoints: 0,
      armorClass: Number(d.attributes?.ac?.normal?.total ?? 10),
      hitPoints: {
        count: levels,
        die: `d${hd}`,
        ...(hpMax - avgHp !== 0 ? { modifier: hpMax - avgHp } : {}),
        notation: `${levels}d${hd}${hpMax - avgHp > 0 ? `+${hpMax - avgHp}` : hpMax - avgHp < 0 ? `${hpMax - avgHp}` : ''}`,
      },
      speed: {
        ...(d.attributes?.speed?.land?.base ? { walk: Number(d.attributes.speed.land.base) } : {}),
        ...(d.attributes?.speed?.fly?.base ? { fly: Number(d.attributes.speed.fly.base) } : {}),
        ...(d.attributes?.speed?.swim?.base ? { swim: Number(d.attributes.speed.swim.base) } : {}),
        ...(d.attributes?.speed?.climb?.base
          ? { climb: Number(d.attributes.speed.climb.base) }
          : {}),
        ...(d.attributes?.speed?.burrow?.base
          ? { burrow: Number(d.attributes.speed.burrow.base) }
          : {}),
      },
      abilities,
      d20Saves: {
        fort: Number(d.attributes?.savingThrows?.fort?.total ?? 0),
        ref: Number(d.attributes?.savingThrows?.ref?.total ?? 0),
        will: Number(d.attributes?.savingThrows?.will?.total ?? 0),
      },
      baseAttackBonus: bab,
      senses: stripHtml(d.attributes?.senses?.special)
        ? [stripHtml(d.attributes.senses.special)]
        : [],
      languages: [],
      actions,
    };

    seenIds.add(id);
    const bucket =
      cr <= 1 ? 'srd-cr-0-1' : cr <= 5 ? 'srd-cr-2-5' : cr <= 10 ? 'srd-cr-6-10' : 'srd-cr-11-plus';
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(monster);
    report.encoded += 1;
  }

  for (const [bucket, monsters] of buckets) {
    monsters.sort((a, b) => a.challengeRating - b.challengeRating || a.id.localeCompare(b.id));
    const exportName = bucket.replace(/-(\w)/g, (_, c) => c.toUpperCase()) + 'Monsters35e';
    writeFileSync(
      resolve(`src/data/dnd/3.5e/monsters/${bucket}.ts`),
      `// GENERATED by scripts/encode-35e-monsters.mjs: olimot/srd-v3.5-md core
// name list intersected with Rughalt/D35E bestiary.db structured data (both
// OGL — see docs/srd-sources.md). Regenerate with:
// node scripts/encode-35e-monsters.mjs

import { Monster } from '../../../../types/creatures/monsters';

export const ${exportName}: Monster[] = [
${monsters.map((monster) => ts(monster)).join(',\n')},
];
`
    );
    console.log(`${bucket}.ts: ${monsters.length} monsters`);
  }

  console.log(`\nencoded: ${report.encoded} (non-core skipped: ${report.skippedNonCore})`);
  console.log(`skipped (unmappable): ${report.skipped.length}`);
  for (const line of report.skipped.slice(0, 12)) console.log(`  - ${line}`);
  console.log(`unresolved damage formulas (prose-only): ${report.unresolvedDice.length}`);
  console.log(`size bands collapsed (fine/dim/col): ${report.sizeCollapsed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
