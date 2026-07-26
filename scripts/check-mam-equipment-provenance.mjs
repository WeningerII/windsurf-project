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
 *   C. HONEST NON-SRD LABEL. Entries outside the SRD set must carry a declared
 *      `originalContentSources` label for mam3e, never an open-content one, and
 *      must live in the non-SRD module. A label nobody declared fails.
 *   D. NO DUPLICATES. No repeated id and no repeated name across the whole
 *      equipment tree. `Plate Armor` and `Chain Mail` each shipped TWICE under
 *      different ids, which id-based dedupe could not see.
 *   E. THE POLICY AND THE DATA AGREE. The label the data module exports
 *      (`MAM3E_ORIGINAL_SOURCE`) must be one the policy declares, so the two
 *      cannot drift apart.
 *
 * Run: npm run check:mam-equipment
 * Refresh the manifest: node scripts/encode-mam-equipment.mjs
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { strictOpenContentPolicy } from '../src/utils/openContentPolicy.ts';
import * as equipment from '../src/data/mutants-and-masterminds/3e/equipment/index.ts';
import { MAM3E_ORIGINAL_SOURCE } from '../src/data/mutants-and-masterminds/3e/equipment/original-not-srd.ts';

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
const originalSources = new Set((policy.originalContentSources ?? []).map(normalizeSource));

// E. The label the data exports must be one the policy declares as original
// content — and must NOT also be an open-content label.
if (!originalSources.has(normalizeSource(MAM3E_ORIGINAL_SOURCE))) {
  fail(
    `MAM3E_ORIGINAL_SOURCE "${MAM3E_ORIGINAL_SOURCE}" is not declared in ` +
      `strictOpenContentPolicy.mam3e.originalContentSources`
  );
}
if (srdSources.has(normalizeSource(MAM3E_ORIGINAL_SOURCE))) {
  fail(
    `MAM3E_ORIGINAL_SOURCE "${MAM3E_ORIGINAL_SOURCE}" is also listed as ` +
      `open-content provenance — the two tiers must stay distinguishable`
  );
}

// Which exported arrays are the generated SRD tier vs the hand-written tier.
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

// A. No false SRD citation, and the SRD tier must actually be cited as SRD.
const seenSrdNames = new Set();
for (const item of shipped) {
  const source = typeof item.source === 'string' ? item.source : '';
  const isSrdCite = srdSources.has(normalizeSource(source));
  const isOriginalCite = originalSources.has(normalizeSource(source));

  if (!isSrdCite && !isOriginalCite) {
    fail(`PROVENANCE ${item.id}: source "${source}" is on neither mam3e source list`);
    continue;
  }

  if (item.tier === 'srd' && !isSrdCite) {
    fail(`PROVENANCE ${item.id}: generated SRD entry cites "${source}", not a Hero SRD source`);
  }
  // C. A hand-written entry may never claim the SRD.
  if (item.tier === 'original' && isSrdCite) {
    fail(
      `PROVENANCE ${item.id}: hand-written entry in ${item.exportName} claims Hero SRD ` +
        `source "${source}" — hand-written entries must not cite the SRD`
    );
  }

  if (!isSrdCite) continue;

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

const srdShipped = shipped.filter((i) => i.tier === 'srd').length;
const originalShipped = shipped.length - srdShipped;
console.log(`manifest:            ${manifest.entries.length} Hero SRD equipment entries`);
console.log(`shipped (SRD tier):  ${srdShipped}`);
console.log(`shipped (original):  ${originalShipped}`);
console.log(`coverage:            ${seenSrdNames.size}/${manifest.entries.length}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} M&M equipment provenance failure(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    '\nRegenerate the SRD tier with `node scripts/encode-mam-equipment.mjs`, or move ' +
      'non-SRD entries into src/data/mutants-and-masterminds/3e/equipment/original-not-srd.ts ' +
      'with the declared original-content source label.'
  );
  process.exit(1);
}

console.log('\nM&M equipment provenance OK.');
