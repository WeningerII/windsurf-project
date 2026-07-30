/**
 * Encode the Mutants & Masterminds 3e Hero SRD EQUIPMENT list from
 * frnprt/mm3e-character-creator `js/data.js` (`EQUIPMENT_LIST`) into the repo's
 * mam3e equipment data files. Sibling of scripts/encode-pf1e-equipment.mjs and
 * scripts/encode-5e-equipment.mjs.
 *
 * Source: https://raw.githubusercontent.com/frnprt/mm3e-character-creator/master/js/data.js
 * — the SAME upstream `src/scripts/srd-coverage.ts` already cites as the
 * denominator for the mam3e powers / advantages / equipment / skills targets
 * (see docs/srd-sources.md). M&M 3e is Open Game Content under OGL 1.0a.
 *
 * WHY THIS ENCODER EXISTS. The mam3e equipment modules were 150 HAND-WRITTEN
 * entries, every one of them tagged `source: "Hero's Handbook"`, of which only
 * 45 appeared in the Hero SRD at all — and even those carried costs the SRD does
 * not print (Club 1 vs 2, Bow 3 vs 6, Rocket Launcher 19 vs 27, …). That is the
 * defect class the SRD fidelity audit named: every divergence in the product
 * lives in hand-written entries claiming a source they were not transcribed
 * from. This encoder deletes the hand-written override surface for the SRD half
 * of that data set. The 79 entries with NO SRD counterpart were first segregated
 * into ./original-not-srd.ts under an honest non-SRD label, then deleted
 * outright on 2026-07-30 — this app transcribes open documents, it does not
 * author game content (see docs/mam3e-equipment-provenance.md for the
 * item-by-item record of what went).
 *
 * The upstream file is third-party JavaScript and is NEVER evaluated: the array
 * literal is sliced out with a string-aware bracket match and read field-wise
 * with single-line regexes, exactly as `srd-coverage.ts` reads the same file.
 *
 * Honest-mapping rules:
 *  - name / cost / type / details are transcribed VERBATIM. Nothing is derived,
 *    normalised or invented. `description` is the SRD `details` string as
 *    printed — terse stat notation rather than flavour prose, because flavour
 *    prose would be authored, not transcribed.
 *  - SRD `type` maps 1:1 onto MaMEquipmentType:
 *      Weapon → weapon, Armor → armor, Vehicle → vehicle,
 *      Headquarters → headquarters, General → gear.
 *    The 17 items the product previously typed `device` (Binoculars, Commlink,
 *    Grapple Gun, …) are printed by the SRD under "General Equipment", so they
 *    encode as `gear`. `device` in M&M means a power-bearing Device, which these
 *    are not; the previous typing was part of the same hand-authored drift.
 *  - The generated entries carry exactly the MaMEquipment surface (id, name,
 *    system, source, type, cost, description). Structured stat fields
 *    (`protection`, `damage`, `toughness`, …) are NOT emitted: the SRD prints
 *    them inside the details prose, and parsing them back out would be
 *    derivation, not transcription. Nothing in the product reads those fields.
 *  - `id` is the slug of the SRD name. Collisions are reported and fail the run.
 *
 * Also writes scripts/data/mam3e-equipment-manifest.json — the pinned name /
 * cost / type manifest that the OFFLINE gate
 * `scripts/check-mam-equipment-provenance.mjs` ratchets against, so the
 * networked `srd:coverage` is not the only thing standing between a false
 * "Hero's Handbook" citation and main.
 *
 * Usage:
 *   node scripts/encode-mam-equipment.mjs                 # fetch upstream
 *   node scripts/encode-mam-equipment.mjs --src data.js   # local copy (offline)
 * Re-running on unchanged input produces a byte-identical tree.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const DATA_JS_URL =
  'https://raw.githubusercontent.com/frnprt/mm3e-character-creator/master/js/data.js';
const ARRAY_NAME = 'EQUIPMENT_LIST';
const SYSTEM = 'mam3e';

/**
 * The source label for generated entries. `'M&M 3e Hero SRD'` is already on the
 * mam3e whitelist in src/utils/openContentPolicy.ts and — unlike the book title
 * "Hero's Handbook" the hand-written entries claimed — names the document these
 * rows were actually transcribed from.
 */
const SRD_SOURCE = 'M&M 3e Hero SRD';

const OUT_DIR = 'src/data/mutants-and-masterminds/3e/equipment';
const MANIFEST_PATH = 'scripts/data/mam3e-equipment-manifest.json';

/** SRD `type` → MaMEquipmentType. Anything unmapped fails the run. */
const TYPE_MAP = {
  Weapon: 'weapon',
  Armor: 'armor',
  Vehicle: 'vehicle',
  Headquarters: 'headquarters',
  General: 'gear',
};

/** One generated module per MaMEquipmentType present in the SRD list. */
const MODULES = [
  { type: 'weapon', file: 'srd-weapons.ts', constName: 'mam3eSrdWeapons' },
  { type: 'armor', file: 'srd-armor.ts', constName: 'mam3eSrdArmor' },
  { type: 'vehicle', file: 'srd-vehicles.ts', constName: 'mam3eSrdVehicles' },
  { type: 'gear', file: 'srd-gear.ts', constName: 'mam3eSrdGear' },
  { type: 'headquarters', file: 'srd-headquarters.ts', constName: 'mam3eSrdHeadquarters' },
];

const slug = (name) =>
  String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Slice a top-level `const NAME = [ ... ]` array literal out as raw TEXT with a
 * string-aware bracket match. The remote file is third-party JavaScript;
 * evaluating it would execute whatever the host serves on a maintainer machine.
 * Mirrors `extractJsArray` in src/scripts/srd-coverage.ts.
 */
function extractJsArray(text, name) {
  const start = text.indexOf(`const ${name}`);
  if (start < 0) throw new Error(`const ${name} not found in upstream data.js`);
  const lb = text.indexOf('[', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let i = lb;
  for (; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) {
      i++;
      break;
    }
  }
  return text.slice(lb, i);
}

/** Read a single-line `key: 'value'` / `key: 123` field out of one entry line. */
function field(line, key) {
  const s = new RegExp(`\\b${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`).exec(line);
  if (s) return s[1].replace(/\\(['\\])/g, '$1');
  const n = new RegExp(`\\b${key}:\\s*(-?\\d+)`).exec(line);
  return n ? Number(n[1]) : undefined;
}

/**
 * Parse the array literal into ordered { name, cost, type, details, section }
 * records. Every EQUIPMENT_LIST entry is a single-line object literal preceded
 * by a `// Section` comment, so a line-wise sweep is both sufficient and inert.
 */
function parseEntries(arrayLiteral) {
  const entries = [];
  let section = null;
  for (const rawLine of arrayLiteral.split('\n')) {
    const line = rawLine.trim();
    const comment = /^\/\/\s*(.+)$/.exec(line);
    if (comment) {
      section = comment[1].trim();
      continue;
    }
    if (!line.startsWith('{')) continue;
    const name = field(line, 'name');
    if (typeof name !== 'string') continue;
    entries.push({
      name,
      cost: field(line, 'cost'),
      type: field(line, 'type'),
      details: field(line, 'details'),
      section,
    });
  }
  return entries;
}

async function readSource() {
  const flag = process.argv.indexOf('--src');
  if (flag > -1) {
    const path = process.argv[flag + 1];
    if (!path) throw new Error('--src requires a path');
    return { text: readFileSync(resolve(path), 'utf8'), origin: path };
  }
  const res = await fetch(DATA_JS_URL);
  if (!res.ok) throw new Error(`fetch ${DATA_JS_URL} failed: ${res.status}`);
  return { text: await res.text(), origin: DATA_JS_URL };
}

/**
 * Locate the prettier binary. Walks up from cwd so the encoder also runs from a
 * git worktree, whose node_modules lives in the parent checkout.
 */
function prettierBin() {
  let dir = resolve('.');
  for (;;) {
    const candidate = join(dir, 'node_modules', '.bin', 'prettier');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) throw new Error('prettier not found — run npm install');
    dir = parent;
  }
}

/** Serialize like the sibling encoders: JSON with identifier keys unquoted. */
const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:');

const HEADER = `// GENERATED by scripts/encode-mam-equipment.mjs from the Mutants & Masterminds
// 3e Hero SRD EQUIPMENT list (frnprt/mm3e-character-creator js/data.js
// EQUIPMENT_LIST — Open Game Content under OGL 1.0a; see docs/srd-sources.md).
//
// DO NOT HAND-EDIT. Re-run the encoder; a hand-edit here is exactly the defect
// this file exists to remove. Entries with no Hero SRD counterpart do not ship
// at all (deleted 2026-07-30) — see docs/mam3e-equipment-provenance.md.

import { MaMEquipment } from '../../../../types/mam/equipment';
`;

function writeModule(file, constName, groups) {
  const body = groups
    .map(({ section, items }) => {
      const rows = items.map((item) => `  ${ts(item).replace(/\n/g, '\n  ')},`).join('\n');
      return `  // ${section}\n${rows}`;
    })
    .join('\n');
  const out = `${HEADER}
export const ${constName}: MaMEquipment[] = [
${body}
];
`;
  writeFileSync(resolve(OUT_DIR, file), out);
}

async function main() {
  const { text, origin } = await readSource();
  const entries = parseEntries(extractJsArray(text, ARRAY_NAME));
  if (entries.length === 0) throw new Error(`${ARRAY_NAME} parsed to zero entries`);

  const problems = [];
  const seenIds = new Map();
  const seenNames = new Map();
  const encoded = [];

  for (const entry of entries) {
    const type = TYPE_MAP[entry.type];
    if (!type) {
      problems.push(`unmapped SRD type "${entry.type}" for "${entry.name}"`);
      continue;
    }
    if (typeof entry.cost !== 'number' || !Number.isFinite(entry.cost)) {
      problems.push(`non-numeric cost for "${entry.name}" — never guessed`);
      continue;
    }
    if (typeof entry.details !== 'string' || entry.details.length === 0) {
      problems.push(`missing details for "${entry.name}" — never invented`);
      continue;
    }
    const id = slug(entry.name);
    if (seenIds.has(id)) problems.push(`id collision: ${id} (${seenIds.get(id)} / ${entry.name})`);
    seenIds.set(id, entry.name);
    const nameKey = entry.name.toLowerCase();
    if (seenNames.has(nameKey)) problems.push(`duplicate SRD name: ${entry.name}`);
    seenNames.set(nameKey, id);

    encoded.push({
      section: entry.section,
      srdType: entry.type,
      item: {
        id,
        name: entry.name,
        system: SYSTEM,
        source: SRD_SOURCE,
        type,
        cost: entry.cost,
        description: entry.details,
      },
    });
  }

  if (problems.length > 0) {
    console.error('Encoder refused to write — unresolved input problems:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  mkdirSync(resolve(OUT_DIR), { recursive: true });
  const counts = [];
  for (const mod of MODULES) {
    const forType = encoded.filter((e) => e.item.type === mod.type);
    // Group by SRD section, preserving upstream order — the sections are the
    // Hero SRD's own table headings and keep the generated file readable.
    const groups = [];
    for (const e of forType) {
      const last = groups[groups.length - 1];
      if (last && last.section === e.section) last.items.push(e.item);
      else groups.push({ section: e.section, items: [e.item] });
    }
    writeModule(mod.file, mod.constName, groups);
    counts.push(`${mod.file}: ${forType.length}`);
  }

  mkdirSync(resolve('scripts/data'), { recursive: true });
  writeFileSync(
    resolve(MANIFEST_PATH),
    `${JSON.stringify(
      {
        source: `frnprt/mm3e-character-creator js/data.js ${ARRAY_NAME} (M&M 3e Hero SRD, OGL 1.0a)`,
        url: DATA_JS_URL,
        generatedBy: 'scripts/encode-mam-equipment.mjs',
        srdSourceLabel: SRD_SOURCE,
        entries: encoded.map((e) => ({
          id: e.item.id,
          name: e.item.name,
          section: e.section,
          srdType: e.srdType,
          type: e.item.type,
          cost: e.item.cost,
        })),
      },
      null,
      2
    )}\n`
  );

  // Normalize to the repo's Prettier style (format:check gates all of src/**).
  // Prettier is deterministic, so a re-run yields byte-identical output.
  const generated = MODULES.map((m) => resolve(OUT_DIR, m.file));
  execFileSync(prettierBin(), ['--write', ...generated], { stdio: 'inherit' });

  console.log(`source: ${origin}`);
  console.log(`${ARRAY_NAME}: ${entries.length} entries parsed, ${encoded.length} encoded`);
  for (const line of counts) console.log(`  ${line}`);
  console.log(`manifest: ${MANIFEST_PATH} (${encoded.length} entries)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
