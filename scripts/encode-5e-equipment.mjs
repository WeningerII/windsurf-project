/**
 * Encode SRD 5.1 equipment + magic items from 5e-bits/5e-database into the
 * repo's canonical Item family (closing the 238/598 coverage gap).
 *
 * Source: https://github.com/5e-bits/5e-database (data OGL 1.0a — the same
 * dataset the srd:coverage denominator uses; see docs/srd-sources.md).
 *
 * Honest-mapping rules (same discipline as the monster/spell encoders):
 *  - Hand-written items (normalized-name match) always win.
 *  - Weapons missing parseable damage dice and armor missing AC are skipped
 *    and reported, never guessed.
 *  - Weapon properties outside the typed union are dropped per-property
 *    (reported) — the description still carries them.
 *
 * Usage: node scripts/encode-5e-equipment.mjs  (writes srd-equipment.ts and
 * srd-magic-items.ts; commit the output).
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const YEAR = process.argv.includes('--year')
  ? process.argv[process.argv.indexOf('--year') + 1]
  : '2014';
const CONFIG = {
  2014: {
    base: 'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en',
    dir: 'src/data/dnd/5e-2014/equipment',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
  },
  2024: {
    base: 'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2024/en',
    dir: 'src/data/dnd/5e-2024/equipment',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
  },
}[YEAR];
const BASE = CONFIG.base;

const WEAPON_PROPERTIES = new Set([
  'ammunition',
  'finesse',
  'heavy',
  'light',
  'loading',
  'range',
  'reach',
  'special',
  'thrown',
  'two-handed',
  'versatile',
]);

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

const RARITIES = new Set(['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact']);

const normalizeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function parseDice(expr) {
  const match = /^(\d+)d(\d+)$/.exec(String(expr).trim());
  if (!match) return null;
  return { count: Number(match[1]), die: `d${match[2]}`, notation: expr.trim() };
}

function mapCost(cost) {
  const currency = ['cp', 'sp', 'gp', 'pp'].includes(cost?.unit) ? cost.unit : 'gp';
  return { amount: Number(cost?.quantity ?? 0), currency };
}

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

const common = (raw) => ({
  id: raw.index,
  name: raw.name,
  system: CONFIG.system,
  source: CONFIG.source,
});

async function main() {
  // Baseline = the union MINUS this encoder's own previous output, so
  // regeneration is idempotent instead of self-excluding into empty files.
  const existing = await import(`../${CONFIG.dir}/index.ts`);
  const generatedNames = new Set();
  for (const stem of ['srd-equipment', 'srd-magic-items']) {
    try {
      const mod = await import(`../${CONFIG.dir}/${stem}.ts`);
      for (const item of Object.values(mod)[0] ?? []) generatedNames.add(normalizeName(item.name));
    } catch {
      // first run: no generated file yet
    }
  }
  const existingNames = new Set(
    (
      existing.dnd5eEquipment ??
      existing.dnd5e2024Equipment ??
      Object.values(existing).filter(Array.isArray).flat()
    )
      .map((item) => normalizeName(item.name))
      .filter((name) => !generatedNames.has(name))
  );
  // Hand-written entries also win on ID: name variants like
  // "Caltrops (bag of 20)" vs the SRD's "Caltrops" share a slug. An id counts
  // as hand-written when the union holds more occurrences of it than this
  // encoder's own previous output does.
  const generatedIdCounts = new Map();
  for (const stem of ['srd-equipment', 'srd-magic-items']) {
    try {
      const mod = await import(`../${CONFIG.dir}/${stem}.ts`);
      for (const item of Object.values(mod)[0] ?? []) {
        generatedIdCounts.set(item.id, (generatedIdCounts.get(item.id) ?? 0) + 1);
      }
    } catch {
      /* first run */
    }
  }
  const unionIdCounts = new Map();
  for (const item of existing.dnd5eEquipment ??
    existing.dnd5e2024Equipment ??
    Object.values(existing).filter(Array.isArray).flat()) {
    unionIdCounts.set(item.id, (unionIdCounts.get(item.id) ?? 0) + 1);
  }
  const existingIds = new Set(
    [...unionIdCounts.entries()]
      .filter(([id, count]) => count > (generatedIdCounts.get(id) ?? 0))
      .map(([id]) => id)
  );

  const [equipment, magicItems] = await Promise.all([
    fetch(`${BASE}/5e-SRD-Equipment.json`).then((response) => response.json()),
    fetch(`${BASE}/5e-SRD-Magic-Items.json`).then((response) => response.json()),
  ]);

  const report = {
    encoded: 0,
    skippedExisting: 0,
    skipped: [],
    droppedProperties: [],
  };
  const mundane = [];
  const magical = [];

  for (const raw of equipment) {
    if (existingNames.has(normalizeName(raw.name)) || existingIds.has(raw.index)) {
      report.skippedExisting += 1;
      continue;
    }
    const category = raw.equipment_category?.index;
    const description = (Array.isArray(raw.desc) ? raw.desc : [raw.desc].filter(Boolean)).join(
      '\n\n'
    );

    if (category === 'weapon') {
      const dice = parseDice(raw.damage?.damage_dice ?? '');
      const damageType = raw.damage?.damage_type?.index;
      if (!dice || !DAMAGE_TYPES.has(damageType)) {
        report.skipped.push(`${raw.index}: weapon without parseable damage`);
        continue;
      }
      const properties = [];
      for (const property of raw.properties ?? []) {
        if (WEAPON_PROPERTIES.has(property.index)) properties.push(property.index);
        else report.droppedProperties.push(`${raw.index}: ${property.index}`);
      }
      const versatile = parseDice(raw.two_handed_damage?.damage_dice ?? '');
      mundane.push({
        ...common(raw),
        type: 'weapon',
        rarity: 'common',
        weight: raw.weight ?? 0,
        cost: mapCost(raw.cost),
        description,
        requiresAttunement: false,
        weaponType: String(raw.weapon_category ?? 'simple').toLowerCase(),
        category: String(raw.weapon_range ?? 'melee').toLowerCase(),
        damage: dice,
        damageType,
        properties,
        ...(raw.range?.normal && raw.range?.long
          ? { range: { normal: raw.range.normal, max: raw.range.long } }
          : {}),
        ...(versatile ? { versatileDamage: versatile } : {}),
      });
    } else if (category === 'armor') {
      const armorCategory = String(raw.armor_category ?? '').toLowerCase();
      if (armorCategory === 'shield') {
        mundane.push({
          ...common(raw),
          type: 'shield',
          rarity: 'common',
          weight: raw.weight ?? 0,
          cost: mapCost(raw.cost),
          description,
          requiresAttunement: false,
          armorClassBonus: 2,
        });
      } else if (['light', 'medium', 'heavy'].includes(armorCategory) && raw.armor_class?.base) {
        mundane.push({
          ...common(raw),
          type: 'armor',
          rarity: 'common',
          weight: raw.weight ?? 0,
          cost: mapCost(raw.cost),
          description,
          requiresAttunement: false,
          armorType: armorCategory,
          armorClass: raw.armor_class.base,
          ...(raw.armor_class.dex_bonus && raw.armor_class.max_bonus != null
            ? { dexBonusMax: raw.armor_class.max_bonus }
            : {}),
          ...(raw.str_minimum ? { strengthRequirement: raw.str_minimum } : {}),
          stealthDisadvantage: Boolean(raw.stealth_disadvantage),
        });
      } else {
        report.skipped.push(`${raw.index}: unmappable armor (${raw.armor_category})`);
      }
    } else {
      // Adventuring gear, tools, mounts, vehicles, packs — plain items.
      const type = category === 'tools' ? 'tool' : 'gear';
      mundane.push({
        ...common(raw),
        type,
        rarity: 'common',
        weight: raw.weight ?? 0,
        cost: mapCost(raw.cost),
        description,
        requiresAttunement: false,
      });
    }
  }

  for (const raw of magicItems) {
    if (existingNames.has(normalizeName(raw.name)) || existingIds.has(raw.index)) {
      report.skippedExisting += 1;
      continue;
    }
    const description = (Array.isArray(raw.desc) ? raw.desc : [raw.desc].filter(Boolean)).join(
      '\n\n'
    );
    const rarity = String(raw.rarity?.name ?? 'uncommon')
      .toLowerCase()
      .replace(/\s+/g, '-');
    const category = raw.equipment_category?.index;
    magical.push({
      ...common(raw),
      type: category === 'potion' || category === 'scroll' ? 'consumable' : 'magic-item',
      rarity: RARITIES.has(rarity) ? rarity : 'uncommon',
      weight: 0,
      cost: { amount: 0, currency: 'gp' },
      description,
      // SRD prints attunement in the first description line.
      requiresAttunement: /requires attunement/i.test(description),
    });
  }
  report.encoded = mundane.length + magical.length;

  const emit = (stem, exportName, items) => {
    items.sort((a, b) => a.id.localeCompare(b.id));
    writeFileSync(
      resolve(`${CONFIG.dir}/${stem}.ts`),
      `// GENERATED by scripts/encode-5e-equipment.mjs from 5e-bits/5e-database
// (SRD 5.1 equipment, OGL 1.0a — see docs/srd-sources.md). Hand-written items
// always win on name match; regenerate with:
// node scripts/encode-5e-equipment.mjs

import { Armor, Item, Shield, Weapon } from '../../../../types/equipment/items';

export const ${exportName}: (Item | Weapon | Armor | Shield)[] = [
${items.map((item) => ts(item)).join(',\n')},
];
`
    );
    console.log(`${stem}.ts: ${items.length} items`);
  };
  emit('srd-equipment', 'srdEquipment', mundane);
  emit('srd-magic-items', 'srdMagicItems', magical);

  console.log(`\nencoded: ${report.encoded}, kept hand-written: ${report.skippedExisting}`);
  console.log(`skipped (unmappable): ${report.skipped.length}`);
  for (const line of report.skipped) console.log(`  - ${line}`);
  console.log(`dropped weapon properties: ${report.droppedProperties.length}`);
  for (const line of report.droppedProperties) console.log(`  - ${line}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
