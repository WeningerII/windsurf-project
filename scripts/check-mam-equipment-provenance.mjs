#!/usr/bin/env tsx
/**
 * check:mam-equipment — the offline provenance ratchet for M&M 3e equipment.
 *
 * THE BLIND SPOT THIS CLOSES. `npm run srd:coverage` measures mam3e equipment by
 * diffing NAMES against the live Hero SRD list — but it is networked, so it
 * cannot live inside `npm run verify`, and it diffs names only, so an entry
 * could carry the right name with a fabricated cost and score as covered.
 * Neither limit caught the actual defect: 150 hand-written entries, every one
 * tagged `source: "Hero's Handbook"`, only 45 of which the Hero SRD contains,
 * and even those printing costs the SRD does not (Club 1 vs 2, Bow 3 vs 6,
 * Rocket Launcher 19 vs 27). This gate is offline against a committed manifest,
 * exactly like scripts/check-srd-fidelity.mjs, so it runs in `verify`.
 *
 * WHAT IT ASSERTS. Against scripts/data/mam3e-equipment-manifest.json (written
 * by scripts/encode-mam-equipment.mjs from the upstream the coverage report
 * cites):
 *
 *   A. NO FALSE SRD CITATION. Every shipped mam3e equipment entry whose source
 *      is a Hero SRD label must exist in the manifest by name, with matching
 *      cost and matching MaMEquipmentType. A hand-written entry that claims the
 *      SRD and is not in it — the original defect — fails here.
 *   B. FULL COVERAGE, RATCHETED. Every one of the manifest's entries must ship.
 *      Deleting or renaming a generated SRD entry fails.
 *   C. NOTHING BUT THE SRD. Every shipped entry must cite a Hero SRD source.
 *      There is no second tier any more: ./original-not-srd.ts held 79
 *      hand-written entries under `Original Content (not SRD)` and was deleted
 *      2026-07-30 (owner decision — this app transcribes open documents, it does
 *      not author game content). A re-added self-written entry fails here no
 *      matter how it is labelled, which is the point of asserting it rather than
 *      trusting the directory to stay empty.
 *   D. NO DUPLICATES. No repeated id and no repeated name across the whole
 *      equipment tree. `Plate Armor` and `Chain Mail` each shipped TWICE under
 *      different ids, which id-based dedupe could not see.
 *
 * Run: npm run check:mam-equipment
 * Refresh the manifest: node scripts/encode-mam-equipment.mjs
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { strictOpenContentPolicy } from '../src/utils/openContentPolicy.ts';
import * as equipment from '../src/data/mutants-and-masterminds/3e/equipment/index.ts';

const root = process.cwd();
const MANIFEST = 'scripts/data/mam3e-equipment-manifest.json';
const failures = [];
const fail = (message) => failures.push(message);

const manifest = JSON.parse(readFileSync(path.join(root, MANIFEST), 'utf8'));
if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
  console.error(`${MANIFEST} has no entries — regenerate with the encoder.`);
  process.exit(1);
}

const policy = strictOpenContentPolicy.mam3e;
const normalizeSource = (s) => String(s).trim().replace(/\s+/g, ' ').toLowerCase();
/** Same case/punctuation-insensitive key the coverage report diffs on. */
const normalizeName = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[‐-―]/g, '-')
    .replace(/[^a-z0-9]+/g, '');

const srdSources = new Set(policy.allowedSources.map(normalizeSource));

// Every exported array must be a generated SRD module. Anything else is a
// hand-written tier growing back.
const SRD_EXPORTS = new Set([
  'mam3eSrdWeapons',
  'mam3eSrdArmor',
  'mam3eSrdVehicles',
  'mam3eSrdGear',
  'mam3eSrdHeadquarters',
]);

const shipped = [];
for (const [exportName, value] of Object.entries(equipment)) {
  if (!Array.isArray(value)) continue;
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    shipped.push({ ...item, exportName, tier: SRD_EXPORTS.has(exportName) ? 'srd' : 'original' });
  }
}
if (shipped.length === 0) {
  console.error('No mam3e equipment entries were loaded — the index export shape changed.');
  process.exit(1);
}

const manifestByName = new Map(manifest.entries.map((e) => [normalizeName(e.name), e]));

// A + C. Every entry ships from a generated SRD module and cites the Hero SRD.
const seenSrdNames = new Set();
for (const item of shipped) {
  const source = typeof item.source === 'string' ? item.source : '';

  if (item.tier !== 'srd') {
    fail(
      `PROVENANCE ${item.id}: ships from "${item.exportName}", which is not one of the ` +
        `encoder-generated Hero SRD modules — the hand-written tier was deleted 2026-07-30`
    );
    continue;
  }

  if (!srdSources.has(normalizeSource(source))) {
    fail(`PROVENANCE ${item.id}: cites "${source}", which is not a Hero SRD source`);
    continue;
  }

  const key = normalizeName(item.name);
  const srd = manifestByName.get(key);
  if (!srd) {
    fail(
      `FIDELITY ${item.id}: cites "${source}" but "${item.name}" is not in the Hero SRD manifest`
    );
    continue;
  }
  seenSrdNames.add(key);
  if (item.cost !== srd.cost) {
    fail(`FIDELITY ${item.id}: cost encoded=${item.cost} but cited source has ${srd.cost}`);
  }
  if (item.type !== srd.type) {
    fail(`FIDELITY ${item.id}: type encoded=${item.type} but cited source has ${srd.type}`);
  }
}

// B. Full coverage, ratcheted.
for (const entry of manifest.entries) {
  if (!seenSrdNames.has(normalizeName(entry.name))) {
    fail(`COVERAGE Hero SRD entry "${entry.name}" (${entry.section}) does not ship`);
  }
}

// D. No duplicate ids and no duplicate names anywhere in the tree.
const byId = new Map();
const byName = new Map();
for (const item of shipped) {
  if (byId.has(item.id)) fail(`DUPLICATE id "${item.id}" (${byId.get(item.id)} / ${item.name})`);
  else byId.set(item.id, item.name);
  const key = normalizeName(item.name);
  if (byName.has(key)) fail(`DUPLICATE name "${item.name}" (ids ${byName.get(key)} / ${item.id})`);
  else byName.set(key, item.id);
}

console.log(`manifest:  ${manifest.entries.length} Hero SRD equipment entries`);
console.log(`shipped:   ${shipped.length}`);
console.log(`coverage:  ${seenSrdNames.size}/${manifest.entries.length}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} M&M equipment provenance failure(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    '\nRegenerate with `node scripts/encode-mam-equipment.mjs`. Entries with no Hero SRD ' +
      'counterpart do not belong in this catalog: this app transcribes open documents, it ' +
      'does not author game content (owner decision, 2026-07-30).'
  );
  process.exit(1);
}

console.log('\nM&M equipment provenance OK.');
