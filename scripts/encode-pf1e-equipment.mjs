/**
 * Encode Pathfinder 1e Core Rulebook EQUIPMENT + MAGIC ITEMS from
 * devonjones/PSRD-Data (the community PSRD parser output of Paizo's PRD — Open
 * Game Content; see docs/srd-sources.md) into the repo's pf1e equipment data
 * files. Sibling of scripts/encode-pf1e-monsters.mjs.
 *
 * Source layout: one JSON per item under `core_rulebook/item/` (mundane gear at
 * the top level; magic items nested by slot). The repo carries large SQLite
 * artifacts, so this encoder reads a LOCAL sparse clone:
 *
 *   git clone --depth 1 --filter=blob:none --sparse \
 *     https://github.com/devonjones/PSRD-Data.git /tmp/psrd
 *   git -C /tmp/psrd sparse-checkout set core_rulebook/item
 *   node scripts/encode-pf1e-equipment.mjs /tmp/psrd
 *
 * Each entry is bucketed by its `url` path segment after `Rules`:
 *   - Equipment / Weapons          → srd-weapons.ts   (Weapon)
 *   - Equipment / Armor            → srd-armor.ts      (Armor | Shield)
 *   - Equipment / Special Materials
 *   - Equipment / Goods And Services → srd-gear.ts     (Item)
 *   - Magic Items / *              → srd-magic-items.ts (MagicItem[])
 * `scope` (equipment | magic) is derived from the first segment and written into
 * scripts/data/pf1e-equipment-manifest.json — the pinned srd:coverage denominator
 * (243 equipment / 347 magic), reproducible because GitHub's tree HTML truncates
 * and its API rate-limits.
 *
 * Hand-written baseline wins on id match: this encoder emits ALL SRD entries;
 * ./index.ts merges them with the hand-authored buckets, spreading the curated
 * entries LAST so they override the SRD entry with the same id.
 *
 * Honest-mapping rules (mirroring the bestiary "never guessed"):
 *  - Price: parse the leading `N <cp|sp|gp|pp>` into { amount, currency }; keep
 *    add-on (`+50 gp`) / rate (`1 gp/20`, `3 cp per mile`) qualifiers as prose.
 *    Non-numeric prices (`—`/`None`/`special`/`varies`/`Caster level …` formula)
 *    are left UNASSERTED — the neutral { 0, gp } the loader also defaults to —
 *    never a fabricated number; the count is reported.
 *  - Weight: parse `6 lbs.`, `1/2 lb.`, `1-1/2 lbs.`, strip trailing footnote
 *    digits (`1/2 lb.1`), keep `+N lbs.` add-ons; negligible weights
 *    (`—`/`None`/`special`) encode as 0, reported, never guessed.
 *  - HTML entities (&times; &ndash; &mdash; &amp; …) are decoded.
 *  - Weapon misc.Weapon → weaponType (Simple/Martial; Exotic COLLAPSES to
 *    martial — the shared Weapon type has no exotic band — and is reported),
 *    category (ranged vs melee from Weapon Class), damage (first Dmg (M) die),
 *    damageType (first S/P/B letter; combos like "P or S" stay prose). The five
 *    damageless ammunition/net entries and the three armor "Extras" (spikes /
 *    locked gauntlet) cannot satisfy the Weapon/Armor types without inventing a
 *    die or an armor class, so they are emitted as plain gear Items (prose kept);
 *    the equipment denominator (243) and per-name coverage are unaffected.
 *  - Armor misc.Armor → armorType, armorClass (Armor Bonus), dexBonusMax,
 *    armorCheckPenalty (Shields → Shield.armorClassBonus). Footnote digits on the
 *    small AC-bonus fields are stripped (tower shield "+43" → +4). ASF/speed stay
 *    prose.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { weaponDamageTypeByName } from './lib/weaponDamageType.mjs';

const psrdRoot = process.argv[2];
if (!psrdRoot) {
  console.error('Usage: node scripts/encode-pf1e-equipment.mjs <path-to-PSRD-Data-clone>');
  process.exit(1);
}
const itemDir = join(psrdRoot, 'core_rulebook', 'item');

const VALID_DICE = new Set(['d2', 'd3', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']);
const TYPE_LETTER = { S: 'slashing', P: 'piercing', B: 'bludgeoning' };
const NON_VALUE = new Set(['—', '–', 'none', 'special', 'varies', 'see below', 'n/a', '']);

const ENTITIES = {
  '&times;': '×',
  '&ndash;': '–',
  '&mdash;': '—',
  '&amp;': '&',
  '&nbsp;': ' ',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&quot;': '"',
  '&hellip;': '…',
  '&deg;': '°',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&plusmn;': '±',
  '&reg;': '®',
  '&sup2;': '²',
  '&sup3;': '³',
};

const slug = (name) =>
  String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function decodeEntities(value) {
  return String(value ?? '')
    .replace(/&[a-z0-9]+;/gi, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

/** HTML → single-line prose (decoded entities, tags dropped, whitespace collapsed). */
function toProse(html) {
  if (!html) return '';
  let s = String(html)
    .replace(/<\/(p|div|tr|li|h[1-6]|table)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '');
  s = decodeEntities(s).replace(/\s+/g, ' ').trim();
  return s;
}

/** Leading dash-like glyphs (en/em dash, minus sign) normalize to ASCII '-'. */
const dashNorm = (s) => s.replace(/[‒-―−]/g, '-');

/**
 * Parse a price string. Returns { cost, note }: `cost` is
 * { amount, currency } from the leading `N <cp|sp|gp|pp>`, or undefined when the
 * price is non-numeric (never invented). `note` preserves an add-on / rate
 * qualifier (or the whole non-numeric string) as prose.
 */
function parsePrice(raw) {
  if (raw == null) return { cost: undefined, note: undefined };
  const s = decodeEntities(raw).trim();
  if (NON_VALUE.has(s.toLowerCase()) || /caster level/i.test(s)) {
    return { cost: undefined, note: undefined };
  }
  const m = /^(\+?)\s*([\d,]+)\s*(cp|sp|gp|pp)\b(.*)$/i.exec(s);
  if (!m) return { cost: undefined, note: undefined };
  const amount = Number(m[2].replace(/,/g, ''));
  if (!Number.isFinite(amount)) return { cost: undefined, note: undefined };
  const cost = { amount, currency: m[3].toLowerCase() };
  const qualified = m[1] === '+' || m[4].trim().length > 0;
  return { cost, note: qualified ? `Listed price: ${s}.` : undefined };
}

/**
 * Parse a weight string → { weight, asserted, addon }. Handles `6 lbs.`,
 * fractions `1/2 lb.`, mixed `1-1/2 lbs.`, `+N lbs.` add-ons, and strips a
 * trailing footnote digit (`1/2 lb.1`). Negligible weights (`—`/`None`/`special`)
 * are 0 with asserted=false.
 */
function parseWeight(raw) {
  if (raw == null) return { weight: 0, asserted: false, addon: false };
  let s = decodeEntities(raw).trim();
  if (NON_VALUE.has(s.toLowerCase())) return { weight: 0, asserted: false, addon: false };
  s = s.replace(/(lbs?\.)\s*\d+\s*$/i, '$1');
  const addon = /^\+/.test(s);
  let m = /^\+?\s*(\d+)-(\d+)\/(\d+)\s*lb/i.exec(s);
  if (m) {
    return { weight: Number(m[1]) + Number(m[2]) / Number(m[3]), asserted: true, addon };
  }
  m = /^\+?\s*(\d+)\/(\d+)\s*lb/i.exec(s);
  if (m) return { weight: Number(m[1]) / Number(m[2]), asserted: true, addon };
  m = /^\+?\s*([\d,]+(?:\.\d+)?)\s*lb/i.exec(s);
  if (m) {
    return { weight: Number(m[1].replace(/,/g, '')), asserted: true, addon };
  }
  return { weight: 0, asserted: false, addon: false };
}

const round3 = (n) => Math.round(n * 1000) / 1000;

/** First `NdM` die of a damage string → DiceRoll, or null when unparseable. */
function parseDamage(raw) {
  const s = decodeEntities(raw ?? '').trim();
  const m = /(\d+)d(\d+)/.exec(s);
  if (!m) return null;
  const die = `d${m[2]}`;
  if (!VALID_DICE.has(die)) return null;
  const count = Number(m[1]);
  return { count, die, notation: `${count}${die}` };
}

/** First S/P/B letter → damage type; falls back to the weapon's name, else null. */
function parseDamageType(typeRaw, name) {
  const s = decodeEntities(typeRaw ?? '')
    .trim()
    .toUpperCase();
  const first = /[SPB]/.exec(s);
  if (first) return TYPE_LETTER[first[0]];
  return weaponDamageTypeByName(name);
}

/** Small AC bonus (armor/shield). Strips a trailing footnote digit: real Core
 * values are single-digit, so "+43" (tower shield, footnote 3) → +4. */
function parseAcBonus(raw) {
  const s = dashNorm(decodeEntities(raw ?? '').trim());
  const m = /^([+-]?)(\d+)/.exec(s);
  if (!m) return undefined;
  const digits = m[2].length > 1 ? m[2][0] : m[2];
  return (m[1] === '-' ? -1 : 1) * Number(digits);
}

/** Full signed integer (ACP up to -10, max-dex). Non-numeric (`—`/special) → undefined. */
function parseSignedInt(raw) {
  const s = dashNorm(decodeEntities(raw ?? '').trim());
  const m = /^([+-]?)\s*(\d+)/.exec(s);
  if (!m) return undefined;
  return (m[1] === '-' ? -1 : 1) * Number(m[2]);
}

/** Recursively collect every *.json under the item directory. */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.json')) out.push(full);
  }
  return out;
}

function bucketOf(url) {
  const parts = String(url ?? '').split('/');
  const i = parts.indexOf('Rules');
  if (i < 0) return { s1: '', s2: '', s3: '' };
  return { s1: parts[i + 1] ?? '', s2: parts[i + 2] ?? '', s3: parts[i + 3] ?? '' };
}

// Serialize like the monster encoder: JSON with identifier keys unquoted.
const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

const HEADER = (importNames) =>
  `// GENERATED by scripts/encode-pf1e-equipment.mjs from devonjones/PSRD-Data
// (Pathfinder 1e Core Rulebook via the PRD — Open Game Content; see
// docs/srd-sources.md). Hand-written equipment always wins on id match (merged
// in ./index.ts); regenerate per the encoder header.

import { ${importNames} } from '../../../../types/equipment/items';
`;

function writeRecord(file, importNames, recordType, constName, entries, report) {
  const byId = {};
  for (const item of entries) {
    if (byId[item.id]) report.idCollisions.push(`${file}: ${item.id}`);
    byId[item.id] = item;
  }
  const body = Object.keys(byId)
    .sort()
    .map((id) => `  ${JSON.stringify(id)}: ${ts(byId[id]).replace(/\n/g, '\n  ')},`)
    .join('\n');
  const out = `${HEADER(importNames)}
export const ${constName}: Record<string, ${recordType}> = {
${body}
};
`;
  writeFileSync(resolve(`src/data/pathfinder/1e/equipment/${file}`), out);
  return Object.keys(byId).length;
}

function main() {
  const files = walk(itemDir).sort();
  const report = {
    weapons: [],
    armor: [],
    gear: [],
    magic: [],
    rerouted: [],
    exoticCollapsed: [],
    priceUnasserted: 0,
    weightNegligible: 0,
    idCollisions: [],
    dupMagicIds: [],
  };
  const manifest = [];

  for (const full of files) {
    const raw = JSON.parse(readFileSync(full, 'utf8'));
    const relFile = relative(itemDir, full);
    const name = decodeEntities(raw.name ?? '');
    const id = slug(raw.name ?? relFile);
    const { s1, s2, s3 } = bucketOf(raw.url);
    const scope = s1 === 'Magic Items' ? 'magic' : 'equipment';
    manifest.push({ file: relFile, name: raw.name ?? id, scope });

    const price = parsePrice(raw.price);
    const weight = parseWeight(raw.weight);
    if (!price.cost && scope === 'equipment') report.priceUnasserted += 1;
    if (!weight.asserted && scope === 'equipment') report.weightNegligible += 1;
    const cost = price.cost ?? { amount: 0, currency: 'gp' };
    const proseParts = [toProse(raw.body)];
    if (weight.addon) proseParts.push(`Adds ${round3(weight.weight)} lbs.`);
    if (price.note) proseParts.push(price.note);

    const baseItem = (type) => {
      const description = proseParts.filter(Boolean).join(' ') || `${name}.`;
      return {
        id,
        name,
        system: 'pf1e',
        source: 'Core Rulebook',
        type,
        rarity: 'common',
        weight: round3(weight.addon ? 0 : weight.weight),
        cost,
        description,
        requiresAttunement: false,
      };
    };

    // ---------- MAGIC ITEMS ----------
    if (scope === 'magic') {
      const bodies = raw.body
        ? [toProse(raw.body)]
        : Array.isArray(raw.sections)
          ? raw.sections.map((sec) => toProse(sec.body))
          : [];
      const description = bodies.filter(Boolean).join(' ') || `${name}.`;
      const item = {
        id,
        name,
        system: 'pf1e',
        source: 'Core Rulebook',
        type: 'magic-item',
        rarity: s2 === 'Artifacts' ? 'artifact' : 'uncommon',
        weight: round3(weight.weight),
        cost,
        description,
        requiresAttunement: false,
        modifiers: [],
        effects: [],
      };
      report.magic.push(item);
      continue;
    }

    // ---------- WEAPONS ----------
    if (s2 === 'Weapons') {
      const w = (raw.misc && raw.misc.Weapon) || {};
      const dmgRaw = w['Dmg (M)'];
      const damage = parseDamage(dmgRaw);
      const damageType = parseDamageType(w.Type, name);
      if (!damage || !damageType) {
        // Damageless ammunition / net — no die to assert. Emit as gear (prose kept).
        report.rerouted.push(`${id} (weapon → gear: no damage die)`);
        report.gear.push(baseItem('gear'));
        continue;
      }
      const prof = String(w.Proficiency ?? '');
      let weaponType = /simple/i.test(prof) ? 'simple' : 'martial';
      if (/exotic/i.test(prof)) report.exoticCollapsed.push(id);
      const cls = String(w['Weapon Class'] ?? '');
      const category = /ranged/i.test(cls) ? 'ranged' : 'melee';
      const properties = /two-handed/i.test(cls)
        ? ['two-handed']
        : /light melee/i.test(cls)
          ? ['light']
          : [];

      const riders = [];
      if (String(dmgRaw).includes('/'))
        riders.push(`Double weapon (damage ${decodeEntities(dmgRaw)}).`);
      const typeDecoded = decodeEntities(w.Type ?? '').trim();
      if (typeDecoded && !/^[SPB]$/i.test(typeDecoded)) riders.push(`Damage type: ${typeDecoded}.`);
      if (w.Critical) riders.push(`Critical ${decodeEntities(w.Critical)}.`);
      const description =
        [toProse(raw.body), ...riders, price.note].filter(Boolean).join(' ') || `${name}.`;

      const weapon = {
        id,
        name,
        system: 'pf1e',
        source: 'Core Rulebook',
        type: 'weapon',
        weaponType,
        category,
        rarity: 'common',
        damage,
        damageType,
        properties,
        weight: round3(weight.weight),
        cost,
        description,
        requiresAttunement: false,
      };
      const range = parseSignedInt(w.Range);
      if (range && range > 0) weapon.range = { normal: range, max: range };
      report.weapons.push(weapon);
      continue;
    }

    // ---------- ARMOR / SHIELDS ----------
    if (s2 === 'Armor') {
      const a = (raw.misc && raw.misc.Armor) || {};
      const armorType = String(a['Armor Type'] ?? '');
      const asf = a['Arcane Spell Failure Chance'];
      const extras = [];
      if (asf && !NON_VALUE.has(decodeEntities(asf).trim().toLowerCase())) {
        extras.push(`Arcane spell failure ${decodeEntities(asf)}.`);
      }
      if (a['Speed (20 ft.)']) {
        extras.push(
          `Speed ${decodeEntities(a['Speed (20 ft.)'])} (20 ft. base), ${decodeEntities(a['Speed (30 ft.)'] ?? '')} (30 ft. base).`.replace(
            /,\s*\.$/,
            '.'
          )
        );
      }
      const description =
        [toProse(raw.body), ...extras, price.note].filter(Boolean).join(' ') || `${name}.`;

      if (/shield/i.test(armorType)) {
        const bonus = parseAcBonus(a['Shield Bonus'] ?? a['Armor Bonus']);
        const acp = parseSignedInt(a['Armor Check Penalty']);
        const shield = {
          id,
          name,
          system: 'pf1e',
          source: 'Core Rulebook',
          type: 'shield',
          rarity: 'common',
          armorClassBonus: bonus ?? 0,
          shieldBonus: bonus ?? 0,
          ...(acp !== undefined ? { armorCheckPenalty: acp } : {}),
          weight: round3(weight.addon ? 0 : weight.weight),
          cost,
          description,
          requiresAttunement: false,
        };
        report.armor.push(shield);
        continue;
      }
      const band = /light/i.test(armorType)
        ? 'light'
        : /medium/i.test(armorType)
          ? 'medium'
          : /heavy/i.test(armorType)
            ? 'heavy'
            : null;
      if (!band) {
        // "Extras" (armor/shield spikes, locked gauntlet) — no armor class to assert.
        report.rerouted.push(`${id} (armor "${armorType}" → gear)`);
        const g = baseItem('gear');
        g.description = description;
        report.gear.push(g);
        continue;
      }
      const armor = {
        id,
        name,
        system: 'pf1e',
        source: 'Core Rulebook',
        type: 'armor',
        armorType: band,
        rarity: 'common',
        armorClass: parseAcBonus(a['Armor Bonus']) ?? 0,
        ...(parseSignedInt(a['Maximum Dex Bonus']) !== undefined
          ? { dexBonusMax: parseSignedInt(a['Maximum Dex Bonus']) }
          : {}),
        stealthDisadvantage: false,
        ...(parseSignedInt(a['Armor Check Penalty']) !== undefined
          ? { armorCheckPenalty: parseSignedInt(a['Armor Check Penalty']) }
          : {}),
        weight: round3(weight.weight),
        cost,
        description,
        requiresAttunement: false,
      };
      report.armor.push(armor);
      continue;
    }

    // ---------- GEAR (Special Materials + Goods And Services) ----------
    const gearType = /tools/i.test(s3) ? 'tool' : 'gear';
    report.gear.push(baseItem(gearType));
  }

  // Dedupe magic items by id (report collisions).
  const magicSeen = new Set();
  const magic = [];
  for (const item of report.magic) {
    if (magicSeen.has(item.id)) {
      report.dupMagicIds.push(item.id);
      continue;
    }
    magicSeen.add(item.id);
    magic.push(item);
  }
  magic.sort((a, b) => a.id.localeCompare(b.id));

  mkdirSync(resolve('src/data/pathfinder/1e/equipment'), { recursive: true });
  const nWeapons = writeRecord(
    'srd-weapons.ts',
    'Weapon',
    'Weapon',
    'pf1eSrdWeapons',
    report.weapons,
    report
  );
  const nArmor = writeRecord(
    'srd-armor.ts',
    'Armor, Shield',
    'Armor | Shield',
    'pf1eSrdArmor',
    report.armor,
    report
  );
  const nGear = writeRecord('srd-gear.ts', 'Item', 'Item', 'pf1eSrdGear', report.gear, report);

  const magicBody = magic.map((item) => ts(item)).join(',\n');
  writeFileSync(
    resolve('src/data/pathfinder/1e/equipment/srd-magic-items.ts'),
    `${HEADER('MagicItem')}
export const pf1eSrdMagicItems: MagicItem[] = [
${magicBody},
];
`
  );

  mkdirSync(resolve('scripts/data'), { recursive: true });
  writeFileSync(
    resolve('scripts/data/pf1e-equipment-manifest.json'),
    `${JSON.stringify(
      {
        source: 'devonjones/PSRD-Data core_rulebook/item (Core Rulebook, PRD OGC)',
        generatedBy: 'scripts/encode-pf1e-equipment.mjs',
        entries: manifest,
      },
      null,
      2
    )}\n`
  );

  // Normalize the generated TS to the repo's Prettier style. The JSON-derived
  // serializer above emits double-quoted values / es5 spacing; Prettier is the
  // format:check gate for all of src/**, and it is deterministic, so a re-run
  // always yields byte-identical, prettier-clean files.
  const generated = [
    'src/data/pathfinder/1e/equipment/srd-weapons.ts',
    'src/data/pathfinder/1e/equipment/srd-armor.ts',
    'src/data/pathfinder/1e/equipment/srd-gear.ts',
    'src/data/pathfinder/1e/equipment/srd-magic-items.ts',
  ].map((p) => resolve(p));
  const prettierBin = resolve('node_modules/.bin/prettier');
  execFileSync(prettierBin, ['--write', ...generated], { stdio: 'inherit' });

  const equip = manifest.filter((e) => e.scope === 'equipment').length;
  const mag = manifest.filter((e) => e.scope === 'magic').length;
  console.log(`srd-weapons.ts:     ${nWeapons} weapons`);
  console.log(`srd-armor.ts:       ${nArmor} armor + shields`);
  console.log(`srd-gear.ts:        ${nGear} gear`);
  console.log(`srd-magic-items.ts: ${magic.length} magic items`);
  console.log(`manifest:           ${manifest.length} entries (${equip} equipment / ${mag} magic)`);
  console.log(`equipment total encoded: ${nWeapons + nArmor + nGear}`);
  console.log(`\nexotic weapons collapsed to 'martial': ${report.exoticCollapsed.length}`);
  console.log(`rerouted to gear (no die / no armor class): ${report.rerouted.length}`);
  for (const line of report.rerouted) console.log(`  - ${line}`);
  console.log(`equipment price UNASSERTED (kept 0 gp): ${report.priceUnasserted}`);
  console.log(`equipment weight negligible (kept 0): ${report.weightNegligible}`);
  console.log(`id collisions: ${report.idCollisions.length} ${report.idCollisions.join(', ')}`);
  console.log(
    `duplicate magic ids dropped: ${report.dupMagicIds.length} ${report.dupMagicIds.join(', ')}`
  );
}

main();
