/**
 * Encode PF2e Core Rulebook equipment from Pf2eToolsOrg/Pf2eTools into the
 * repo's catalog Item data, closing the 30/467 srd:coverage gap.
 *
 * Source: https://github.com/Pf2eToolsOrg/Pf2eTools data/items/items-crb.json
 * (OGL; `source:"CRB"` — the same dataset family the srd:coverage denominator
 * uses; see docs/srd-sources.md). Entries are emitted with source 'Core Rulebook'.
 *
 * These are GENUINE sourced CRB items, NOT placeholders. The hand-written
 * equipment in weapons/armor/adventuring-gear/magic-weapons/magic-armor.ts
 * ALWAYS wins on name match; only items they don't already cover are generated.
 * {@tag ...} markup is reduced to display text.
 *
 * Mapping into the catalog `Item` shape (src/types/equipment/items.ts — the
 * shape the pf2e loader collects). The catalog Item is intentionally lean
 * (id/name/system/source/type/rarity/weight/cost/description/requiresAttunement);
 * PF2e-specific fields the type doesn't model (level, usage, activation, runes)
 * are NOT invented:
 *   - category -> ItemType (Weapon/Armor/Shield/Tool, the consumable families,
 *     and magic-item for runes/staves/wands/worn magic items; mundane gear -> gear)
 *   - price{coin,amount} (or the first priced variant) -> cost{currency,amount};
 *     no price -> amount 0
 *   - bulk number -> weight; light ("L") and negligible ("—"/"varies") -> 0
 *   - rare/uncommon traits -> rarity; otherwise common
 *   - first entry string -> description (variant grades appended as a note)
 *
 * Dedupe by normalized name: a base item that exists only as graded variants
 * (e.g. "Adamantine", "Bag of Holding") collapses to ONE catalog entry, matching
 * the srd:coverage denominator's notion of "same item".
 *
 * Regeneration is idempotent: existing names are read only from the five
 * hand-written equipment modules, so re-running re-derives the full set.
 *
 * Usage: node scripts/encode-pf2e-equipment.mjs
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/items/items-crb.json';

const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Pf2eTools tags render different pipe-segments as their display text. Most
// tags are {@tag name|source|displayOverride} → the LAST non-empty segment.
// But several put display FIRST and carry link/filter metadata afterward, and
// {@class}/{@classFeature}/{@subclassFeature} carry the display in a fixed
// later slot. Taking the last segment for these leaks filter queries
// ("Level=[0]"), source codes ("CRB"), and page indices ("3") into prose.
const FIRST_SEGMENT_TAGS = new Set(['filter', 'quickref', 'footnote', 'link']);

function resolveTag(tag, inner) {
  const parts = inner.split('|').map((s) => s.trim());
  const t = tag.toLowerCase();
  // {@filter display|datasource|key=value...}, {@quickref display|book|page|anchor},
  // {@footnote displayText|note}, {@link displayText|url} → display is FIRST.
  if (FIRST_SEGMENT_TAGS.has(t)) return parts[0] || parts[parts.length - 1];
  // {@class name|source|displayText|locator|source} → 3rd segment (e.g. "abjurer").
  if (t === 'class') return parts[2] || parts[0];
  // {@classFeature name|class|classSource|level|displayText} → name, unless an
  // explicit display override is present.
  if (t === 'classfeature') return parts[4] || parts[0];
  // {@subclassFeature name|class|classSource|subclass|subclassSource|level|display}.
  if (t === 'subclassfeature') return parts[6] || parts[0];
  // {@runeItem base|baseSource|rune1|rune1Source|...} → "<runes> <base>".
  if (t === 'runeitem') {
    const runes = parts.filter((_, i) => i >= 2 && i % 2 === 0 && parts[i]);
    return [...runes, parts[0]].filter(Boolean).join(' ');
  }
  // Default {@tag name|source|displayOverride}: last non-empty, else the name.
  return parts[parts.length - 1] || parts[0];
}

/**
 * Reduce Pf2eTools {@tag value|link|display} markup to its display text. Tags
 * can nest (e.g. {@footnote ...{@link Label|URL}}), so match only innermost
 * tags ([^{}]) and loop until stable, resolving from the inside out.
 */
function detag(text) {
  let out = String(text);
  let previous;
  do {
    previous = out;
    out = out.replace(/\{@(\w+) ([^{}]*)\}/g, (_, tag, inner) => resolveTag(tag, inner));
  } while (out !== previous);
  // Pf2eTools sometimes prints dice in angle brackets inside a tag's display
  // (e.g. the deadly trait as "deadly <d10>"); render them as plain dice.
  return out.replace(/<(\d*d\d+)>/gi, '$1');
}

/** Flatten the first usable prose string out of an item's `entries`. */
function firstProse(entries) {
  for (const entry of entries ?? []) {
    if (typeof entry === 'string' && entry.trim()) return detag(entry);
    if (entry && typeof entry === 'object' && Array.isArray(entry.entries)) {
      const inner = firstProse(entry.entries);
      if (inner) return inner;
    }
  }
  return '';
}

// CRB item categories that are inherently magic items in the catalog's lean
// ItemType vocabulary. Consumable families (potions, elixirs, oils, bombs,
// snares, poisons, talismans, scrolls, ammunition) map to 'consumable'.
const MAGIC_CATEGORIES = new Set(['Rune', 'Staff', 'Wand', 'Apex']);
// PF2e magic items derive their magic from a spell-tradition or magic-school
// trait, not just the literal 'magical'/'invested'/'artifact' keyword. Any of
// these traits on a Held/Worn/Companion item marks it as a magic item. (NOT
// applied to mundane categories like Adventuring Gear/Material — those never
// reach the fall-through branch where this set is consulted.)
const MAGIC_TRAITS = new Set([
  // explicit magic-item markers
  'invested',
  'magical',
  'artifact',
  // spell traditions — the tradition trait is itself a magical marker in PF2e
  'arcane',
  'divine',
  'occult',
  'primal',
  // magic schools
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
]);
const CONSUMABLE_CATEGORIES = new Set([
  'Potion',
  'Elixir',
  'Oil',
  'Poison',
  'Bomb',
  'Snare',
  'Talisman',
  'Scroll',
  'Ammunition',
  'Consumable',
]);

/** Map a CRB item to the catalog ItemType. */
function itemType(item) {
  const cat = item.category;
  if (cat === 'Weapon') return 'weapon';
  if (cat === 'Armor' || cat === 'Barding') return 'armor';
  if (cat === 'Shield') return 'shield';
  if (cat === 'Tool') return 'tool';
  if (CONSUMABLE_CATEGORIES.has(cat)) return 'consumable';
  if (MAGIC_CATEGORIES.has(cat)) return 'magic-item';
  // Worn / Held / Companion / Structure / Material / Adventuring Gear:
  // magical ones become magic-item; plain mundane gear stays gear. A PF2e
  // magic item is signaled by a magic-school or spell-tradition trait (e.g.
  // 'evocation'/'sonic' on the Horn of Blasting, 'divine'/'necromancy' on Holy
  // Prayer Beads), not only the literal 'magical'/'invested'/'artifact' keyword.
  const traits = (item.traits ?? []).map((t) => t.toLowerCase());
  if (traits.some((t) => MAGIC_TRAITS.has(t))) {
    return 'magic-item';
  }
  return 'gear';
}

/** rare > uncommon > common from item traits. */
function rarity(item) {
  const traits = (item.traits ?? []).map((t) => t.toLowerCase());
  if (traits.includes('rare') || traits.includes('unique')) return 'rare';
  if (traits.includes('uncommon')) return 'uncommon';
  return 'common';
}

const CURRENCIES = new Set(['cp', 'sp', 'gp', 'pp']);

/** cost{currency,amount} from a price object, or null if absent/invalid. */
function priceToCost(price) {
  if (!price || typeof price.amount !== 'number') return null;
  const currency = CURRENCIES.has(price.coin) ? price.coin : 'gp';
  return { amount: price.amount, currency };
}

/** Resolve an item's cost: own price first, else the first priced variant, else 0 gp. */
function resolveCost(item) {
  const own = priceToCost(item.price);
  if (own) return own;
  for (const v of item.variants ?? []) {
    const c = priceToCost(v.price);
    if (c) return c;
  }
  return { amount: 0, currency: 'gp' };
}

/** weight from bulk: numeric bulk -> number; light/negligible/varies -> 0. */
function resolveWeight(bulk) {
  if (typeof bulk === 'number') return bulk;
  return 0;
}

const ts = (value) =>
  JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

async function main() {
  // Existing names/ids come ONLY from the five hand-written equipment modules
  // the loader reads, so regeneration is idempotent and hand-authored items win.
  const equip = await import('../src/data/pathfinder/2e/equipment/index.ts');
  const handItems = [
    ...Object.values(equip.pf2eWeapons || {}),
    ...Object.values(equip.pf2eArmor || {}),
    ...Object.values(equip.pf2eGear || {}),
    ...(equip.pf2eMagicWeapons || []),
    ...(equip.pf2eMagicArmor || []),
    // Also exclude names colliding with the magic-items module, which the
    // catalog can surface elsewhere even though the equipment loader omits it.
    ...(equip.pf2eMagicItems || []),
  ];
  const existingNames = new Set();
  const existingIds = new Set();
  for (const it of handItems) {
    if (it?.name) existingNames.add(normalizeName(it.name));
    if (it?.id) existingIds.add(it.id);
  }

  const raw = JSON.parse(await (await fetch(SOURCE_URL)).text()).item ?? [];

  const generated = [];
  const seenIds = new Set(existingIds);
  const seenNames = new Set();
  let skippedExisting = 0;
  const byType = {};

  for (const item of raw) {
    if (item.source !== 'CRB') continue;
    const key = normalizeName(item.name);
    if (existingNames.has(key)) {
      skippedExisting += 1;
      continue;
    }
    if (seenNames.has(key)) continue; // collapse multi-variant same-named items
    seenNames.add(key);

    const type = itemType(item);
    byType[type] = (byType[type] || 0) + 1;

    let description = firstProse(item.entries) || item.name;
    // When the base item is only priced via graded variants, record the grades
    // so the lean catalog entry still conveys that the cost is the lowest grade.
    if (!item.price && Array.isArray(item.variants) && item.variants.length > 0) {
      const grades = item.variants
        .map((v) => v.variantType)
        .filter(Boolean)
        .join('; ');
      if (grades) description = `${description} Available as: ${grades}.`.trim();
    }

    let id = `pf2e-${slug(item.name)}`;
    while (seenIds.has(id)) id = `${id}-item`;
    seenIds.add(id);

    generated.push({
      id,
      name: item.name,
      system: 'pf2e',
      source: 'Core Rulebook',
      type,
      rarity: rarity(item),
      weight: resolveWeight(item.bulk),
      cost: resolveCost(item),
      description,
      requiresAttunement: false,
    });
  }

  generated.sort((a, b) => a.id.localeCompare(b.id));

  writeFileSync(
    resolve('src/data/pathfinder/2e/equipment/generated.ts'),
    `// GENERATED by scripts/encode-pf2e-equipment.mjs from Pf2eToolsOrg/Pf2eTools
// (Core Rulebook items, OGL — source:"CRB"; see docs/srd-sources.md). Genuine
// sourced items, NOT placeholders. Hand-written equipment in weapons/armor/
// adventuring-gear/magic-weapons/magic-armor.ts wins on name match. Multi-grade
// items (materials, bag of holding, …) collapse to one entry priced at the
// lowest grade. Regenerate with: node scripts/encode-pf2e-equipment.mjs

import { Item } from '../../../../types/equipment/items';

export const srdPf2eGeneratedEquipment: Item[] = [
${generated.map((it) => ts(it)).join(',\n')},
];
`
  );

  console.log(
    `generated.ts: ${generated.length} items encoded (${JSON.stringify(byType)}), ${skippedExisting} kept hand-written`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
