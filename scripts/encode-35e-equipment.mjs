/**
 * Encode D&D 3.5e SRD equipment (weapons, armor, shields, adventuring gear)
 * from olimot/srd-v3.5-md into the repo's dnd-3.5e equipment data, closing the
 * srd:coverage gap.
 *
 * Source: https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/basic-rules-and-legal/equipment.md
 * (clean core-only Markdown of the SRD 3.5 Equipment chapter, OGL 1.0a — the
 * same repo already wired as the 3.5e spell/monster/feat denominator; see
 * docs/srd-sources.md). The stat blocks are embedded HTML <table>s:
 *   - "Table: Weapons"            -> Cost, Dmg (S), Dmg (M), Critical, Range, Weight, Type
 *   - "Table: Armor and Shields"  -> Cost, Armor/Shield bonus, MaxDex, ACP, ASF, Speed, Weight
 *   - "Table: Goods and Services" -> Item, Cost, Weight (Adventuring Gear section)
 *
 * These are GENUINE sourced SRD 3.5 items — NOT placeholders. Hand-written
 * entries in weapons.ts / armor.ts / gear.ts ALWAYS win on normalized-name
 * match (norm = name.toLowerCase().replace(/[^a-z0-9]+/g,'')); only items they
 * don't already cover are emitted into generated.ts. Existing names are read
 * from the hand-written files only (NOT generated.ts), so re-running re-derives
 * the full generated set idempotently.
 *
 * Usage: node scripts/encode-35e-equipment.mjs
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'src/data/dnd/3.5e/equipment');

const SOURCE_URL =
  'https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/basic-rules-and-legal/equipment.md';

const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const ts = (value) =>
  JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

function stripInline(text) {
  return String(text)
    .replace(/<sup>.*?<\/sup>/gs, '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/–|—/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract a named <table>'s rows (each row = array of trimmed cell strings). */
function extractTableRows(md, caption) {
  const tables = [...md.matchAll(/<table[^>]*>(.*?)<\/table>/gs)];
  for (const t of tables) {
    const body = t[1];
    const cap = /<caption>(.*?)<\/caption>/s.exec(body);
    if (!cap || stripInline(cap[1]) !== caption) continue;
    return [...body.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) => {
      const cells = [...m[1].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs)].map((c) => stripInline(c[1]));
      // Flag rows whose first cell is indented (nested sub-variant, e.g. lock
      // qualities under "Lock", ammo under a bow) so callers can skip them.
      const firstRaw = /<t[dh][^>]*>(.*?)<\/t[dh]>/s.exec(m[1]);
      cells._indented = !!firstRaw && /^(&nbsp;|\s)+/.test(firstRaw[1]);
      return cells;
    });
  }
  throw new Error(`Table not found: ${caption}`);
}

/** Read normalized names already authored in a hand-written data file. */
function existingNorms(file) {
  const text = readFileSync(resolve(DATA_DIR, file), 'utf8');
  return new Set([...text.matchAll(/name: '([^']+)'/g)].map((m) => normalizeName(m[1])));
}

// Reorder "Mace, light" -> "Light Mace" so names read naturally and match
// hand-written entries (e.g. "Light Crossbow", "Heavy Steel Shield").
function naturalName(raw) {
  const parts = raw.split(',').map((s) => s.trim());
  if (parts.length === 2) {
    const tail = parts[1]
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return `${tail} ${parts[0]}`;
  }
  return raw;
}

const md = await fetch(SOURCE_URL).then((r) => {
  if (!r.ok) throw new Error(`fetch ${r.status}`);
  return r.text();
});

// ---------------------------------------------------------------- Weapons ----
const weaponNorms = existingNorms('weapons.ts');
const weaponRows = extractTableRows(md, 'Table: Weapons');
const sectionRe = /^(Simple|Martial|Exotic) Weapons$/;

const TYPE_MAP = {
  bludgeoning: 'bludgeoning',
  piercing: 'piercing',
  slashing: 'slashing',
};
const mapDamageType = (typeCell) => {
  const lower = typeCell.toLowerCase();
  for (const key of Object.keys(TYPE_MAP)) {
    if (lower.includes(key)) return TYPE_MAP[key];
  }
  return undefined;
};

const isRangedSubhead = (label) =>
  /^(Light|One-Handed|Two-Handed) Melee Weapons$|^Ranged Weapons$|^Unarmed Attacks$/.test(label);

const generatedWeapons = [];
let twoHanded = false;
let melee = true;
for (const cells of weaponRows) {
  if (cells.length === 0) continue;
  const first = cells[0];
  // Category header rows ("Simple Weapons" etc.) — also reset the proficiency.
  if (sectionRe.test(first) && cells.filter((c) => c).length <= 2) continue;
  // Hand subheads (italic, single populated cell).
  if (cells.filter((c) => c).length === 1 && isRangedSubhead(first)) {
    twoHanded = /Two-Handed/.test(first);
    melee = !/^Ranged/.test(first);
    continue;
  }
  // Footnotes (single long cell) or ammo-only rows handled by damage check.
  if (cells.length < 8) continue;
  // Repeat header rows ("Simple/Martial/Exotic Weapons" with Cost/Dmg/... cells).
  if (sectionRe.test(first)) continue;
  if (cells[1] === 'Cost' || cells[3] === 'Dmg (M)') continue;
  const name = naturalName(first);
  const cost = cells[1];
  const dmgM = cells[3];
  const critical = cells[4];
  const typeCell = cells[cells.length - 1];
  // Skip ammo, splash, and items with no real cost/damage that belong elsewhere.
  if (!dmgM || dmgM === '—' || dmgM === '-') continue;
  if (!cost || cost === '—' || cost === '-' || /special/i.test(cost)) {
    // club/quarterstaff/sling/unarmed are free; keep only if hand-written misses them.
  }
  const norm = normalizeName(name);
  if (weaponNorms.has(norm)) continue;
  if (generatedWeapons.some((w) => normalizeName(w.name) === norm)) continue;

  const range = cells[cells.length - 3];
  const isThrown = range && range !== '—' && range !== '-' && melee;
  const damageType = mapDamageType(typeCell);
  const entry = {
    id: slug(name),
    name,
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    type: melee ? (isThrown ? 'thrown' : 'melee') : 'ranged',
    damage: dmgM,
    weight: parseWeight(cells[cells.length - 2]),
    cost: cost && cost !== '—' && cost !== '-' ? cost : '0 gp',
  };
  if (damageType) entry.damageType = damageType;
  if (critical && critical !== '—' && critical !== '-' && critical !== 'x2') {
    entry.critical = critical.replace(/x/g, '×');
  }
  if (entry.type !== 'melee' && range && range !== '—' && range !== '-') {
    const ft = parseInt(range, 10);
    if (!Number.isNaN(ft)) entry.range = ft;
  }
  generatedWeapons.push(entry);
}

function parseWeight(cell) {
  if (!cell || cell === '—' || cell === '-' || /special/i.test(cell)) return 0;
  const frac = /(\d+)\/(\d+)/.exec(cell);
  if (frac) return Math.round((Number(frac[1]) / Number(frac[2])) * 100) / 100;
  const n = parseFloat(cell);
  return Number.isNaN(n) ? 0 : n;
}

// ----------------------------------------------------- Armor and Shields -----
const armorNorms = existingNorms('armor.ts');
const armorRows = extractTableRows(md, 'Table: Armor and Shields');
const ARMOR_SECTIONS = {
  'Light armor': 'light',
  'Medium armor': 'medium',
  'Heavy armor': 'heavy',
};
const generatedArmor = [];
const generatedShields = [];
let armorType = null;
let inShields = false;
let inExtras = false;
for (const cells of armorRows) {
  if (cells.length === 0) continue;
  const label = cells[0];
  if (label in ARMOR_SECTIONS) {
    armorType = ARMOR_SECTIONS[label];
    inShields = false;
    inExtras = false;
    continue;
  }
  if (label === 'Shields') {
    inShields = true;
    inExtras = false;
    continue;
  }
  if (label === 'Extras') {
    inExtras = true;
    continue;
  }
  if (inExtras) continue; // armor spikes / locked gauntlet / shield spikes: modifiers, not items
  if (cells.length < 9) continue; // header / footnote rows
  if (!/(gp|sp|cp)/.test(cells[1])) continue; // not a stat row
  const name = naturalName(label);
  const norm = normalizeName(name);
  const cost = cells[1];
  const bonus = parseInt(cells[2].replace(/[^0-9-]/g, ''), 10) || 0;
  const acp = parseInt(cells[4].replace(/[^0-9-]/g, ''), 10) || 0;
  const asf = parseInt(cells[5].replace(/[^0-9-]/g, ''), 10) || 0;
  const weight = parseWeight(cells[cells.length - 1]);

  if (inShields) {
    if (armorNorms.has(norm)) continue;
    if (generatedShields.some((s) => normalizeName(s.name) === norm)) continue;
    generatedShields.push({
      id: slug(name),
      name,
      system: 'dnd-3.5e',
      source: 'SRD 3.5',
      type: 'shield',
      armorClass: 0,
      armorClassBonus: bonus,
      armorCheckPenalty: acp,
      arcaneSpellFailure: asf,
      weight,
      cost,
    });
  } else {
    if (armorNorms.has(norm)) continue;
    if (generatedArmor.some((a) => normalizeName(a.name) === norm)) continue;
    const maxDexCell = cells[3].replace(/[^0-9-]/g, '');
    const entry = {
      id: slug(name),
      name,
      system: 'dnd-3.5e',
      source: 'SRD 3.5',
      type: armorType || 'light',
      armorClass: bonus,
      armorCheckPenalty: acp,
      arcaneSpellFailure: asf,
      weight,
      cost,
    };
    if (maxDexCell !== '') entry.maxDexBonus = parseInt(maxDexCell, 10);
    generatedArmor.push(entry);
  }
}

// ---------------------------------------------------- Adventuring Gear -------
const gearNorms = existingNorms('gear.ts');
const goodsRows = extractTableRows(md, 'Table: Goods and Services');
const generatedGear = [];
let inGear = false;
for (const cells of goodsRows) {
  if (cells.length === 0) continue;
  const label = cells[0];
  if (label === 'Adventuring Gear') {
    inGear = true;
    continue;
  }
  // Any other section header (th in first cell) ends the Adventuring Gear block.
  if (label === 'Special Substances and Items' || label === 'Tools and Skill Kits') {
    inGear = false;
    continue;
  }
  if (!inGear) continue;
  if (label === 'Item') continue; // sub-header row
  if (cells._indented) continue; // nested variant (e.g. lock qualities under "Lock")
  if (cells.length < 3) continue;
  const cost = cells[1];
  const weightCell = cells[2];
  if (!/(gp|sp|cp)/.test(cost)) continue; // sub-grouping row (e.g. "Lock" with no cost)
  const name = label.replace(/\s*\(empty\)/i, '').trim();
  const norm = normalizeName(name);
  if (gearNorms.has(norm)) continue;
  if (generatedGear.some((g) => normalizeName(g.name) === norm)) continue;
  generatedGear.push({
    id: slug(name),
    name,
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    category: 'adventuring',
    cost,
    weight: parseWeight(weightCell),
    description: `${name} (SRD 3.5 Goods and Services).`,
  });
}

// ------------------------------------------------------------- Emit ----------
const header = `// GENERATED by scripts/encode-35e-equipment.mjs — DO NOT EDIT BY HAND.
// Source: olimot/srd-v3.5-md basic-rules-and-legal/equipment.md (SRD 3.5, OGL 1.0a).
// Hand-written entries in weapons.ts / armor.ts / gear.ts win on normalized-name
// match; this file only carries SRD items those files don't already cover.

import { DnD35eWeapon, DnD35eArmor, DnD35eShield, DnD35eGear } from '../../../../types/equipment';
`;

const body = `
export const dnd35eGeneratedWeapons: DnD35eWeapon[] = ${ts(generatedWeapons)};

export const dnd35eGeneratedArmor: DnD35eArmor[] = ${ts(generatedArmor)};

export const dnd35eGeneratedShields: DnD35eShield[] = ${ts(generatedShields)};

export const dnd35eGeneratedGear: DnD35eGear[] = ${ts(generatedGear)};
`;

const outFile = resolve(DATA_DIR, 'generated.ts');
writeFileSync(outFile, header + body);
try {
  execFileSync('npx', ['prettier', '--write', outFile], { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  console.warn('prettier failed (non-fatal):', e.message);
}

console.log(
  `weapons +${generatedWeapons.length}, armor +${generatedArmor.length}, ` +
    `shields +${generatedShields.length}, gear +${generatedGear.length}`
);
