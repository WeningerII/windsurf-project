#!/usr/bin/env node
/**
 * FIELD-LEVEL SRD fidelity gate (docs/GAPS.md §15).
 *
 * `npm run srd:coverage` diffs entry NAMES: it proves nothing about whether an
 * entry's CONTENT matches the source it cites. A stat block transcribed from
 * the wrong edition scores 100% covered (this is not hypothetical — see
 * GAPS §13 and §15). This check closes that hole for the categories whose
 * upstream open-content source is machine-readable.
 *
 * How it works (OFFLINE by default, so it can live inside `npm run verify`):
 *
 *   1. `scripts/data/srd-fidelity-manifest.json` pins the SCALAR fields of the
 *      upstream SRD entries — verbatim numbers parsed from the same
 *      open-content sources `srd:coverage` uses (docs/srd-sources.md). Refresh
 *      it with `npm run srd:fidelity:write` (networked; commit the result).
 *   2. This check loads the product's own loaders and compares every pinned
 *      field against what ships.
 *   3. Divergences that are KNOWN AND RECORDED live in
 *      `scripts/data/srd-fidelity-baseline.json` with their EXACT current
 *      encoded value. That makes the baseline a ratchet, not a blanket: if a
 *      baselined field changes at all — fixed or drifted further — the check
 *      fails and demands the baseline entry be removed or re-recorded.
 *      Anything diverging that is NOT baselined fails immediately.
 *
 * Never "fix" a divergence by editing the source tag to match the content: the
 * content is what must be re-transcribed from the cited source. Genuine UPSTREAM
 * source defects are recorded under `upstreamDefects` and never silently
 * normalized (precedent: the SRD 5.2.1 Will-o'-Wisp STR cell, GAPS §13).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(HERE, 'data', 'srd-fidelity-manifest.json');
const BASELINE_PATH = path.join(HERE, 'data', 'srd-fidelity-baseline.json');

const normName = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

// --------------------------------------------------------------------------
// Field extraction from the PRODUCT side (the loaders)
// --------------------------------------------------------------------------

const MONSTER_FIELDS = (entry) => {
  const out = {
    armorClass: entry.armorClass,
    'hitPoints.count': entry.hitPoints?.count,
    'hitPoints.die': entry.hitPoints?.die,
    'hitPoints.modifier': entry.hitPoints?.modifier ?? 0,
    challengeRating: entry.challengeRating,
    size: entry.size,
  };
  for (const ability of ['str', 'dex', 'con', 'int', 'wis', 'cha']) {
    out[`abilities.${ability}`] = entry.abilities?.[ability];
  }
  for (const mode of ['walk', 'fly', 'swim', 'burrow', 'climb']) {
    out[`speed.${mode}`] = entry.speed?.[mode] ?? 0;
  }
  return out;
};

/** Background proficiencies are sets; compare them order-insensitively. */
const BACKGROUND_FIELDS = (entry) => ({
  skillProficiencies: [...(entry.skillProficiencies ?? [])].map(normName).sort().join(','),
  toolProficiencies: [...(entry.toolProficiencies ?? [])].map(normName).sort().join(','),
});

const EXTRACTORS = { monsters: MONSTER_FIELDS, backgrounds: BACKGROUND_FIELDS };

/** Which loader feeds each pinned (system, category) pair. */
const LOADERS = {
  'dnd-5e-2014/monsters': ['loadMonstersForSystem', 'dnd-5e-2014'],
  'dnd-5e-2024/monsters': ['loadMonstersForSystem', 'dnd-5e-2024'],
  'dnd-5e-2014/backgrounds': ['loadBackgroundsForSystem', 'dnd-5e-2014'],
  'dnd-5e-2024/backgrounds': ['loadBackgroundsForSystem', 'dnd-5e-2024'],
};

// --------------------------------------------------------------------------
// Field extraction from the UPSTREAM sources (manifest writer only)
// --------------------------------------------------------------------------

const SRD51 = 'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en';
const SRD52_MD = 'https://raw.githubusercontent.com/downfallx/dnd-5e-srd-markdown/master';
const SRD52_JSON = 'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2024/en';

const SIZES = new Set(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']);
const num = (raw) => Number(String(raw).replace(/−/g, '-').replace(/\+/g, ''));

/** 5e-database 2014 monster JSON → the pinned scalar field set. */
function srd51Monster(src) {
  const out = {
    armorClass: Array.isArray(src.armor_class) ? src.armor_class[0]?.value : src.armor_class,
    challengeRating: src.challenge_rating,
    size: String(src.size ?? '').toLowerCase(),
    'abilities.str': src.strength,
    'abilities.dex': src.dexterity,
    'abilities.con': src.constitution,
    'abilities.int': src.intelligence,
    'abilities.wis': src.wisdom,
    'abilities.cha': src.charisma,
  };
  const roll = String(src.hit_points_roll ?? src.hit_dice ?? '');
  const m = /^(\d+)d(\d+)([+-]\d+)?$/.exec(roll);
  if (m) {
    out['hitPoints.count'] = Number(m[1]);
    out['hitPoints.die'] = `d${m[2]}`;
    out['hitPoints.modifier'] = m[3] ? Number(m[3]) : 0;
  }
  for (const mode of ['walk', 'fly', 'swim', 'burrow', 'climb']) {
    out[`speed.${mode}`] = src.speed?.[mode] ? parseInt(src.speed[mode], 10) : 0;
  }
  return out;
}

const CR_FRACTIONS = { '1/8': 0.125, '1/4': 0.25, '1/2': 0.5 };

/**
 * Parse one SRD 5.2.1 markdown stat block into the pinned scalar field set.
 * Deliberately independent of scripts/encode-2024-monsters.mjs: a check that
 * shares the encoder's parser cannot catch the encoder's own mistakes.
 * Returns null when the source block is not machine-readable (recorded, not
 * guessed — e.g. the Will-o'-Wisp's defective STR cell, GAPS §13).
 */
function srd52Monster(block) {
  const out = {};
  const meta = /^_(.+)_$/m.exec(block);
  if (!meta) return null;
  const size = /^(Tiny|Small|Medium|Large|Huge|Gargantuan)/i.exec(meta[1].trim());
  if (!size || !SIZES.has(size[1].toLowerCase())) return null;
  out.size = size[1].toLowerCase();

  const ac = /\*\*AC\*\*\s*(\d+)/.exec(block);
  if (!ac) return null;
  out.armorClass = Number(ac[1]);

  const hp = /\*\*HP\*\*\s*[\d,]+\s*\((\d+)d(\d+)(?:\s*([+−-])\s*(\d+))?\)/.exec(block);
  if (!hp) return null;
  out['hitPoints.count'] = Number(hp[1]);
  out['hitPoints.die'] = `d${hp[2]}`;
  out['hitPoints.modifier'] = hp[4] ? (hp[3] === '+' ? Number(hp[4]) : -Number(hp[4])) : 0;

  const cr = /\*\*CR\*\*\s*([\d/]+)/.exec(block);
  if (!cr) return null;
  out.challengeRating = CR_FRACTIONS[cr[1]] ?? Number(cr[1]);

  const speedLine = /\*\*Speed\*\*\s*(.+)/.exec(block);
  for (const mode of ['walk', 'fly', 'swim', 'burrow', 'climb']) out[`speed.${mode}`] = 0;
  if (speedLine) {
    const text = speedLine[1];
    const walk = /^\s*(\d+)\s*ft/.exec(text);
    if (walk) out['speed.walk'] = Number(walk[1]);
    for (const [, mode, feet] of text.matchAll(/(Burrow|Climb|Fly|Swim)\s+(\d+)\s*ft/gi)) {
      out[`speed.${mode.toLowerCase()}`] = Number(feet);
    }
  }

  for (const ability of ['str', 'dex', 'con', 'int', 'wis', 'cha']) {
    // Score cell, then MOD cell. A block whose score cell holds the MODIFIER
    // (the known Will-o'-Wisp upstream defect) fails this and is skipped.
    const re = new RegExp(
      `<strong>${ability.toUpperCase()}</strong></td>\\s*<td>(\\d+)</td>\\s*<td>([+\\u2212-]?\\d+)</td>`
    );
    const m = re.exec(block);
    if (!m) return null;
    const score = Number(m[1]);
    if (Math.floor((score - 10) / 2) !== num(m[2])) return null;
    out[`abilities.${ability}`] = score;
  }
  return out;
}

function splitStatBlocks(text, prefix) {
  const lines = text.split('\n');
  const blocks = [];
  let name = null;
  let buffer = [];
  for (const line of lines) {
    const heading = new RegExp(`^${prefix}\\s+(.+?)\\s*$`).exec(line);
    if (heading && !line.startsWith(`${prefix}#`)) {
      if (name) blocks.push([name, buffer.join('\n')]);
      name = heading[1];
      buffer = [];
    } else if (name) {
      buffer.push(line);
    }
  }
  if (name) blocks.push([name, buffer.join('\n')]);
  return blocks;
}

/** 5e-database background JSON (2014 or 2024 shape) → pinned proficiency sets. */
function srdBackground(src) {
  const skills = [];
  const tools = [];
  for (const prof of src.proficiencies ?? []) {
    const label = String(prof.name ?? prof.proficiency?.name ?? '');
    const skill = /^Skill:\s*(.+)$/.exec(label);
    if (skill) skills.push(normName(skill[1]));
    const tool = /^Tool:\s*(.+)$/.exec(label);
    if (tool) tools.push(normName(tool[1]));
  }
  for (const choice of src.starting_proficiencies ?? []) {
    const label = String(choice.name ?? '');
    const skill = /^Skill:\s*(.+)$/.exec(label);
    if (skill) skills.push(normName(skill[1]));
  }
  return {
    skillProficiencies: skills.sort().join(','),
    toolProficiencies: tools.sort().join(','),
  };
}

async function buildManifest() {
  const entries = {};
  const skipped = [];
  const fetchJson = async (url) => (await fetch(url)).json();
  const fetchText = async (url) => (await fetch(url)).text();

  for (const m of await fetchJson(`${SRD51}/5e-SRD-Monsters.json`)) {
    entries[`dnd-5e-2014/monsters/${normName(m.name)}`] = srd51Monster(m);
  }
  for (const b of await fetchJson(`${SRD51}/5e-SRD-Backgrounds.json`)) {
    entries[`dnd-5e-2014/backgrounds/${normName(b.name)}`] = srdBackground(b);
  }
  for (const b of await fetchJson(`${SRD52_JSON}/5e-SRD-Backgrounds.json`)) {
    entries[`dnd-5e-2024/backgrounds/${normName(b.name)}`] = srdBackground(b);
  }
  const [monstersMd, animalsMd] = await Promise.all([
    fetchText(`${SRD52_MD}/monsters-A-Z.md`),
    fetchText(`${SRD52_MD}/animals.md`),
  ]);
  const blocks = [...splitStatBlocks(monstersMd, '###'), ...splitStatBlocks(animalsMd, '##')];
  for (const [name, block] of blocks) {
    const parsed = srd52Monster(block);
    if (!parsed) {
      skipped.push(name);
      continue;
    }
    entries[`dnd-5e-2024/monsters/${normName(name)}`] = parsed;
  }

  return {
    note: 'GENERATED by scripts/check-srd-fidelity.mjs --write. Verbatim scalar fields from the open-content SRD sources in docs/srd-sources.md. Do not hand-edit.',
    sources: {
      'dnd-5e-2014/monsters': `${SRD51}/5e-SRD-Monsters.json`,
      'dnd-5e-2014/backgrounds': `${SRD51}/5e-SRD-Backgrounds.json`,
      'dnd-5e-2024/monsters': `${SRD52_MD}/monsters-A-Z.md + animals.md`,
      'dnd-5e-2024/backgrounds': `${SRD52_JSON}/5e-SRD-Backgrounds.json`,
    },
    skippedUnparseable: skipped.sort(),
    entries: Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b))),
  };
}

// --------------------------------------------------------------------------
// The check
// --------------------------------------------------------------------------

const same = (a, b) => String(a ?? '') === String(b ?? '');

async function loadProductEntries() {
  const loader = await import('../src/utils/dataLoader.ts');
  const byKey = new Map();
  for (const [key, [fn, system]] of Object.entries(LOADERS)) {
    const category = key.split('/')[1];
    const extract = EXTRACTORS[category];
    for (const entry of await loader[fn](system)) {
      byKey.set(`${key}/${normName(entry.name)}`, {
        name: entry.name,
        source: entry.source,
        fields: extract(entry),
      });
    }
  }
  return byKey;
}

async function run({ recordBaseline = false } = {}) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
  const product = await loadProductEntries();
  const recorded = {};

  const failures = [];
  const acknowledged = [];
  const seenBaselineKeys = new Set();
  let comparedEntries = 0;
  let comparedFields = 0;

  for (const [key, srcFields] of Object.entries(manifest.entries)) {
    const shipped = product.get(key);
    if (!shipped) continue; // absence is srd:coverage's job, not fidelity's
    comparedEntries += 1;
    for (const [field, want] of Object.entries(srcFields)) {
      if (want === undefined || want === null) continue;
      const got = shipped.fields[field];
      if (got === undefined || got === null) continue;
      comparedFields += 1;
      if (same(got, want)) {
        // A baseline entry that no longer diverges is stale and must go.
        const staleKey = `${key}|${field}`;
        if (baseline.divergences?.[staleKey] || baseline.upstreamDefects?.[staleKey]) {
          seenBaselineKeys.add(staleKey);
          failures.push(
            `STALE BASELINE ${staleKey}: now matches the source (${want}). ` +
              `Remove this entry from scripts/data/srd-fidelity-baseline.json.`
          );
        }
        continue;
      }
      const baseKey = `${key}|${field}`;
      if (recordBaseline) {
        if (baseline.upstreamDefects?.[baseKey]) continue;
        recorded[baseKey] = {
          name: shipped.name,
          taggedSource: shipped.source,
          encoded: got,
          source: want,
        };
        continue;
      }
      const record = baseline.divergences?.[baseKey] ?? baseline.upstreamDefects?.[baseKey];
      if (!record) {
        failures.push(
          `FIDELITY ${key} (${shipped.name}, tagged "${shipped.source}"): ` +
            `${field} encoded=${JSON.stringify(got)} but cited source has ${JSON.stringify(want)}`
        );
        continue;
      }
      seenBaselineKeys.add(baseKey);
      if (!same(record.encoded, got) || !same(record.source, want)) {
        failures.push(
          `BASELINE DRIFT ${baseKey}: recorded encoded=${JSON.stringify(record.encoded)}/source=` +
            `${JSON.stringify(record.source)}, now encoded=${JSON.stringify(got)}/source=` +
            `${JSON.stringify(want)}. Re-record or fix the entry.`
        );
        continue;
      }
      acknowledged.push(baseKey);
    }
  }

  if (recordBaseline) {
    const sorted = Object.fromEntries(
      Object.entries(recorded).sort(([a], [b]) => a.localeCompare(b))
    );
    writeFileSync(
      BASELINE_PATH,
      `${JSON.stringify(
        {
          note: baseline.note,
          upstreamDefects: baseline.upstreamDefects ?? {},
          divergences: sorted,
        },
        null,
        2
      )}\n`
    );
    console.log(`recorded ${Object.keys(sorted).length} divergences to ${BASELINE_PATH}`);
    return;
  }

  for (const bucket of ['divergences', 'upstreamDefects']) {
    for (const baseKey of Object.keys(baseline[bucket] ?? {})) {
      if (!seenBaselineKeys.has(baseKey)) {
        failures.push(
          `STALE BASELINE ${baseKey}: no longer compared (entry or field gone). ` +
            `Remove it from scripts/data/srd-fidelity-baseline.json.`
        );
      }
    }
  }

  console.log(
    `SRD field-level fidelity: ${comparedFields} fields across ${comparedEntries} entries ` +
      `compared against pinned open-content sources.`
  );
  console.log(
    `  acknowledged (recorded in GAPS §15, baselined): ${acknowledged.length}; ` +
      `unacknowledged: ${failures.length}`
  );

  if (failures.length > 0) {
    console.error('\nSRD field-level fidelity check FAILED:\n');
    for (const line of failures) console.error(`  - ${line}`);
    console.error(
      '\nThe CONTENT must be re-transcribed from the source it cites. Never edit the ' +
        'source tag to match the content. If the upstream source itself is defective, ' +
        'record it under "upstreamDefects" with evidence.'
    );
    process.exit(1);
  }
  console.log('SRD field-level fidelity: OK');
}

if (process.argv.includes('--write')) {
  const manifest = await buildManifest();
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `wrote ${MANIFEST_PATH}: ${Object.keys(manifest.entries).length} entries, ` +
      `${manifest.skippedUnparseable.length} source blocks unparseable (recorded, not guessed)`
  );
} else if (process.argv.includes('--record-baseline')) {
  await run({ recordBaseline: true });
} else {
  await run();
}
