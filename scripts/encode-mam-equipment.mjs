/**
 * Encode Mutants & Masterminds 3e equipment to close the srd:coverage gap
 * (45/113 -> 113/113). Idempotent: appends only the SRD items not already
 * present (matched by normalized name), preserving all existing curated entries.
 *
 * Source: frnprt/mm3e-character-creator js/data.js `EQUIPMENT_LIST` (M&M 3e SRD,
 * OGL 1.0a via d20herosrd — the same repo wired for powers/advantages/conditions;
 * see docs/srd-sources.md). Each entry: { name, cost, type, details, attack?, bonuses? }.
 *
 * Modeling decisions (flagged by the Phase-1 adversarial verifier, resolved here):
 *  - Weapons: damage = attack.rank; damageType from `details` keyword; range from
 *    attack.type; critical 19 from a "Crit/Critical 19-20" note. Accessories/Whip
 *    with no attack get damage 0, close, bludgeoning (the MaMWeapon required fields).
 *  - Armor: protection = bonuses.toughness (0 for shields, whose bonus is to
 *    active defenses, noted in the description).
 *  - Vehicles: size/speed/toughness/defense parsed from `details`; `strength`
 *    (required by the Vehicle interface but absent from the source) is derived from
 *    the M&M vehicle Size baseline calibrated to this repo's existing curated
 *    vehicles (large->4, huge->9, gargantuan->13). Documented, not invented.
 *  - Headquarters: the 4 "HQ: Size –" rows become real Headquarters (toughness from
 *    `details`). The 17 "HQ Feature:" rows are equipment-point upgrades, NOT bases,
 *    so they are modeled as the separate `hq-feature` type (headquartersFeatures[])
 *    rather than degrading the Headquarters[] catalog with toughness-0 placeholders.
 *  - General gear -> gear.ts (the generic equipment bucket); devices.ts (power
 *    containers) is left untouched (the source has no power-device entries).
 *
 * source tag is left as the existing files' value; the LEGAL-2 re-point is separate.
 *
 * Usage: node scripts/encode-mam-equipment.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EQ_DIR = resolve(ROOT, 'src/data/mutants-and-masterminds/3e/equipment');
const SOURCE_URL =
  'https://raw.githubusercontent.com/frnprt/mm3e-character-creator/master/js/data.js';
const SOURCE_TAG = "Hero's Handbook"; // unchanged; LEGAL-2 re-point is a separate step

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

function ts(obj) {
  // Deterministic object-literal serializer with unquoted identifier keys.
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    let val;
    if (typeof v === 'number') val = String(v);
    else if (typeof v === 'boolean') val = String(v);
    else if (Array.isArray(v)) val = `[${v.map((x) => `'${esc(x)}'`).join(', ')}]`;
    else val = `'${esc(v)}'`;
    parts.push(`    ${k}: ${val},`);
  }
  return `  {\n${parts.join('\n')}\n  },`;
}

async function fetchEquipmentList() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const text = await res.text();
  const start = text.indexOf('const EQUIPMENT_LIST');
  if (start === -1) throw new Error('EQUIPMENT_LIST not found');
  const open = text.indexOf('[', start);
  // find matching close bracket
  let depth = 0, end = -1;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('EQUIPMENT_LIST not terminated');
  const arrayText = text.slice(open, end + 1);
  // Data-only literal from a trusted source already used for other M&M catalogs.
  const list = new Function(`return ${arrayText};`)();
  if (!Array.isArray(list) || list.length === 0) throw new Error('EQUIPMENT_LIST empty');
  return list;
}

// ── per-category mappers ────────────────────────────────────────────────────
function mapWeapon(e) {
  const d = e.details || '';
  const dt =
    /bludgeon/i.test(d) ? 'bludgeoning'
    : /pierc/i.test(d) ? 'piercing'
    : /slash/i.test(d) ? 'slashing'
    : /ballistic|bullet|gun|pistol|rifle|shotgun/i.test(d) ? 'ballistic'
    : /energy|laser|blaster|plasma|electr|fire|chemical/i.test(d) ? 'energy'
    // Source omits a damage type for ranged/area kinetic weapons (grenades,
    // explosives, firearms without a keyword) -> default by range, not to the
    // melee 'bludgeoning' fallback: ranged/area kinetic -> 'ballistic'.
    : (e.attack?.type === 'ranged' || e.attack?.type === 'area') ? 'ballistic'
    : 'bludgeoning';
  const range = (e.attack?.type === 'ranged' || e.attack?.type === 'area') ? 'ranged' : 'close';
  const crit = /crit(ical)?\s*19-20|19-20/i.test(d) || /19-20/.test(e.attack?.notes || '') ? 19 : undefined;
  return {
    id: slug(e.name),
    name: e.name,
    system: 'mam3e',
    source: SOURCE_TAG,
    type: 'weapon',
    cost: e.cost ?? 0,
    damage: typeof e.attack?.rank === 'number' ? e.attack.rank : 0,
    damageType: dt,
    range,
    critical: crit,
    description: d || e.name,
  };
}

function mapArmor(e) {
  const prot = typeof e.bonuses?.toughness === 'number' ? e.bonuses.toughness : 0;
  return {
    id: slug(e.name),
    name: e.name,
    system: 'mam3e',
    source: SOURCE_TAG,
    type: 'armor',
    cost: e.cost ?? 0,
    protection: prot,
    description: e.details || e.name,
  };
}

const VEHICLE_STRENGTH_BY_SIZE = { large: 4, huge: 9, gargantuan: 13, colossal: 16 };
function mapVehicle(e) {
  const d = e.details || '';
  const size = (d.match(/Size\s+(\w+)/i)?.[1] || 'large').toLowerCase();
  const speed = parseInt(d.match(/Speed\s+(\d+)/i)?.[1] || '0', 10);
  const tough = parseInt(d.match(/Toughness\s+(\d+)/i)?.[1] || '0', 10);
  const defense = parseInt(d.match(/Defense\s+(\d+)/i)?.[1] || '0', 10);
  return {
    id: slug(e.name),
    name: e.name,
    system: 'mam3e',
    source: SOURCE_TAG,
    type: 'vehicle',
    cost: e.cost ?? 0,
    size,
    strength: VEHICLE_STRENGTH_BY_SIZE[size] ?? 4,
    speed,
    defense,
    toughness: tough,
    features: [],
    description: d || e.name,
  };
}

function mapHQ(e) {
  const tough = parseInt((e.details || '').match(/Toughness\s+(\d+)/i)?.[1] || '0', 10);
  const sizeWord = (e.name.match(/Size\s*[–-]\s*(\w+)/i)?.[1] || 'small').toLowerCase();
  return {
    id: slug(e.name),
    name: e.name,
    system: 'mam3e',
    source: SOURCE_TAG,
    type: 'headquarters',
    cost: e.cost ?? 0,
    size: sizeWord,
    toughness: tough,
    features: [],
    description: e.details || e.name,
  };
}

function mapHQFeature(e) {
  return {
    id: slug(e.name),
    name: e.name,
    system: 'mam3e',
    source: SOURCE_TAG,
    type: 'hq-feature',
    cost: e.cost ?? 0,
    description: e.details || e.name,
  };
}

function mapGear(e) {
  return {
    id: slug(e.name),
    name: e.name,
    system: 'mam3e',
    source: SOURCE_TAG,
    type: 'gear',
    cost: e.cost ?? 0,
    description: e.details || e.name,
  };
}

// ── idempotent append-into-array ────────────────────────────────────────────
function existingNames(fileText) {
  const names = new Set();
  for (const m of fileText.matchAll(/name:\s*'((?:[^'\\]|\\.)*)'/g)) names.add(norm(m[1].replace(/\\'/g, "'")));
  for (const m of fileText.matchAll(/name:\s*"((?:[^"\\]|\\.)*)"/g)) names.add(norm(m[1]));
  return names;
}

function appendToArray(fileText, exportName, literals) {
  // Insert before the closing `];` of `export const <exportName>...= [ ... ];`
  const re = new RegExp(`(export const ${exportName}[^=]*=\\s*\\[)([\\s\\S]*?)(\\n\\];)`);
  const m = fileText.match(re);
  if (!m) throw new Error(`array ${exportName} not found`);
  const body = m[2].replace(/\s*$/, '');
  const sep = body.trim().endsWith(',') || body.trim() === '' ? '' : ',';
  return fileText.replace(re, `$1${body}${sep}\n${literals.join('\n')}$3`);
}

async function main() {
  const list = await fetchEquipmentList();
  const byType = (t) => list.filter((e) => e.type === t);

  // Dedup against EVERY equipment file (curated items like Binoculars live in
  // devices.ts, not gear.ts) so we never re-add an item that already exists
  // anywhere in the catalog under the same normalized name.
  const ALL_FILES = ['weapons.ts', 'armor.ts', 'vehicles.ts', 'gear.ts', 'devices.ts', 'headquarters.ts'];
  const globalNames = new Set();
  for (const f of ALL_FILES) {
    for (const n of existingNames(readFileSync(resolve(EQ_DIR, f), 'utf8'))) globalNames.add(n);
  }

  const plan = [
    { file: 'weapons.ts', arr: 'weapons', items: byType('Weapon'), map: mapWeapon },
    { file: 'armor.ts', arr: 'armor', items: byType('Armor'), map: mapArmor },
    { file: 'vehicles.ts', arr: 'vehicles', items: byType('Vehicle'), map: mapVehicle },
    { file: 'gear.ts', arr: 'gear', items: byType('General'), map: mapGear },
    {
      file: 'headquarters.ts',
      arr: 'headquartersOptions',
      items: byType('Headquarters').filter((e) => /Size\s*[–-]/i.test(e.name)),
      map: mapHQ,
    },
  ];

  let added = 0;
  for (const step of plan) {
    const path = resolve(EQ_DIR, step.file);
    let text = readFileSync(path, 'utf8');
    const missing = step.items.filter((e) => !globalNames.has(norm(e.name)));
    if (missing.length === 0) continue;
    const literals = missing.map((e) => ts(step.map(e)));
    text = appendToArray(text, step.arr, literals);
    writeFileSync(path, text);
    added += missing.length;
    console.log(`${step.file}: +${missing.length} (${missing.map((e) => e.name).join(', ')})`);
  }

  // HQ features: separate hq-feature catalog in headquarters.ts (new array if absent).
  const hqFeatures = byType('Headquarters').filter((e) => /Feature/i.test(e.name));
  const hqPath = resolve(EQ_DIR, 'headquarters.ts');
  let hqText = readFileSync(hqPath, 'utf8');
  const missingFeatures = hqFeatures.filter((e) => !globalNames.has(norm(e.name)));
  if (missingFeatures.length > 0) {
    const literals = missingFeatures.map((e) => ts(mapHQFeature(e)));
    if (/export const headquartersFeatures/.test(hqText)) {
      hqText = appendToArray(hqText, 'headquartersFeatures', literals);
    } else {
      if (!/HQFeature/.test(hqText)) {
        hqText = hqText.replace(
          /import\s*\{\s*Headquarters\s*\}\s*from\s*('[^']+');/,
          "import { Headquarters, HQFeature } from $1;"
        );
      }
      hqText +=
        `\nexport const headquartersFeatures: HQFeature[] = [\n${literals.join('\n')}\n];\n`;
    }
    writeFileSync(hqPath, hqText);
    added += missingFeatures.length;
    console.log(`headquarters.ts: +${missingFeatures.length} HQ features`);
  }

  // Prettier + report
  execSync(`npx prettier --write ${JSON.stringify(EQ_DIR + '/*.ts')}`, { cwd: ROOT, stdio: 'inherit' });
  console.log(`\nTotal added: ${added}. Source EQUIPMENT_LIST size: ${list.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
