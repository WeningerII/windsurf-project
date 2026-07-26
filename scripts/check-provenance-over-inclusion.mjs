#!/usr/bin/env node
/**
 * OVER-INCLUSION provenance gate (docs/GAPS.md §18).
 *
 * `npm run srd:coverage` already computes the reverse diff — shipped entries
 * that do NOT appear in the open-content source they cite — but it is
 * NETWORKED, so it cannot run in `verify`, and it only ever printed a truncated
 * name list. Nobody had classified those entries, so a genuinely non-open entry
 * and a harmless word-order variant looked identical in the report.
 *
 * This check makes the population a ratchet:
 *
 *   1. `scripts/data/srd-overinclusion-manifest.json` pins the entry-name lists
 *      of every wired open-content denominator, fetched from exactly the sources
 *      `src/scripts/srd-coverage.ts` cites (its `TARGETS` are imported here, so
 *      the URLs cannot drift apart). Refresh with
 *      `npm run srd:overinclusion:write` (networked; commit the result).
 *   2. This check re-runs the SAME reverse diff offline, against the SAME shape
 *      helpers the networked report uses (`src/scripts/srdCoverageShape.ts`), so
 *      the two can never disagree about what counts as a suspect.
 *   3. Every suspect must carry a CLASSIFICATION with evidence in
 *      `scripts/data/srd-overinclusion-classification.json`. An unclassified
 *      suspect fails. A classification whose entry stopped being a suspect fails
 *      as stale. A classified entry whose shipped `source` tag changed fails as
 *      drift — which is what stops the one "fix" that must never happen:
 *      silently editing the source tag so the content looks compliant.
 *
 * This gate deliberately does NOT delete or relabel anything. Removing or
 * re-tagging shipped content is the repository owner's decision (same stance as
 * GAPS §11 / OC-1), and re-tagging is not cosmetic here: `filterOpenContentBySource`
 * (`src/utils/openContentPolicy.ts`) drops any entry whose source leaves the
 * allowlist, so a relabel silently removes it from the product. The gate's job is
 * to make the population known, bounded, and unable to grow unnoticed.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TARGETS } from '../src/scripts/srd-coverage.ts';
import { norm, srdNormVariants, overInclusionSuspects } from '../src/scripts/srdCoverageShape.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(HERE, 'data', 'srd-overinclusion-manifest.json');
const CLASSIFICATION_PATH = path.join(HERE, 'data', 'srd-overinclusion-classification.json');

/**
 * The closed classification vocabulary. Every suspect must be exactly one of
 * these. The two marked LICENSING are the ones that must never grow silently:
 * they are the reason this gate exists.
 */
const CLASSES = {
  'naming-variant':
    'Same entry as the source, under a different name; the source-named entry does NOT also ship.',
  'duplicate-alias':
    'The loader ALSO ships this entry under its correct source name — a duplicated catalog row, not a missing name.',
  'generic-entry-instantiation':
    'The source ships a generic rule/table row; the product ships pre-built instances of it.',
  'category-rollup':
    'The shipped entry is a source TABLE or CATEGORY header, not an individual source entry (cf. GAPS §11 OC-2).',
  'denominator-scope-defect':
    'The entry IS in the cited source, but the coverage script fetches an incomplete slice of that source.',
  'denominator-shape-artifact':
    'The source and the product disagree about entry GRANULARITY (combined table vs per-variant rows), so the diff double-counts.',
  'wrong-edition-attribution':
    'LICENSING-ADJACENT. Real open content, but from a different edition/source than the entry’s source tag claims.',
  'genuine-non-open-content':
    'LICENSING. No counterpart in any cited open-content source, under any name.',
  'upstream-defect':
    'The entry is in the source, but the source itself is malformed or mis-shaped.',
  undetermined: 'Could not be established. Must state why in the evidence field.',
};

const LICENSING_CLASSES = new Set(['wrong-edition-attribution', 'genuine-non-open-content']);

const sourceTag = (item) => {
  if (!item || typeof item !== 'object') return null;
  if (typeof item.source === 'string') return item.source;
  if (item.source && typeof item.source === 'object') {
    if (typeof item.source.book === 'string') return item.source.book;
    if (typeof item.source.name === 'string') return item.source.name;
  }
  return null;
};

/** Shipped records, per target, keyed by normalized name. */
async function loadShipped() {
  const byTarget = new Map();
  for (const t of TARGETS) {
    const key = `${t.systemId}/${t.category}`;
    if (byTarget.has(key)) continue; // pf1e equipment/magic-items share one loader
    byTarget.set(key, await t.loaderRecords());
  }
  return byTarget;
}

// --------------------------------------------------------------------------
// Manifest writer (networked)
// --------------------------------------------------------------------------

async function buildManifest() {
  const denominators = {};
  const failed = [];
  for (const t of TARGETS) {
    const key = `${t.systemId}/${t.category}`;
    try {
      const names = await t.srd();
      denominators[key] = {
        srdSource: t.srdSource,
        names: [...new Map(names.map((n) => [norm(n), n])).values()].sort((a, b) =>
          a.localeCompare(b)
        ),
      };
      console.log(`  ${key}: ${denominators[key].names.length} source names`);
    } catch (e) {
      failed.push(`${key} (${e.message})`);
    }
  }
  if (failed.length > 0) {
    // A degraded run must never shrink a pinned denominator — that would silently
    // convert covered entries into "over-inclusion" and vice versa.
    console.error(`\nAborted: ${failed.length} denominator(s) failed: ${failed.join('; ')}`);
    console.error('Manifest left untouched.');
    process.exit(1);
  }
  return {
    note:
      'GENERATED by scripts/check-provenance-over-inclusion.mjs --write. Entry-name lists ' +
      'pinned verbatim from the open-content sources cited by src/scripts/srd-coverage.ts ' +
      '(TARGETS). Do not hand-edit.',
    denominators: Object.fromEntries(
      Object.entries(denominators).sort(([a], [b]) => a.localeCompare(b))
    ),
  };
}

// --------------------------------------------------------------------------
// The check
// --------------------------------------------------------------------------

/** Recompute the reverse diff for one target from the PINNED denominator. */
function suspectsFor(shipped, denominator) {
  const srdKeys = new Set(denominator.names.flatMap(srdNormVariants));
  const unique = [...new Map(shipped.map((i) => [norm(i.name), i])).values()];
  const names = overInclusionSuspects(
    unique.map((i) => i.name),
    srdKeys
  );
  const byName = new Map(unique.map((i) => [i.name, i]));
  return names.map((n) => byName.get(n));
}

async function run({ record = false } = {}) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const classification = JSON.parse(readFileSync(CLASSIFICATION_PATH, 'utf8'));
  const shippedByTarget = await loadShipped();

  const failures = [];
  const recorded = {};
  const seen = new Set();
  const perPopulation = new Map();
  let total = 0;

  for (const t of TARGETS) {
    const key = `${t.systemId}/${t.category}`;
    const denominator = manifest.denominators[key];
    if (!denominator) {
      failures.push(
        `MISSING DENOMINATOR ${key}: srd-coverage.ts declares this target but the pinned ` +
          `manifest has no entry. Re-run \`npm run srd:overinclusion:write\`.`
      );
      continue;
    }
    const shipped = shippedByTarget.get(key) ?? [];
    const suspects = suspectsFor(shipped, denominator);
    perPopulation.set(key, suspects.length);
    total += suspects.length;

    for (const item of suspects) {
      const ledgerKey = `${key}|${norm(item.name)}`;
      seen.add(ledgerKey);
      const tagged = sourceTag(item);
      if (record) {
        const prior = classification.entries?.[ledgerKey];
        recorded[ledgerKey] = {
          name: item.name,
          taggedSource: tagged,
          class: prior?.class ?? 'undetermined',
          evidence: prior?.evidence ?? 'NOT YET CLASSIFIED — record evidence before committing.',
        };
        continue;
      }
      const entry = classification.entries?.[ledgerKey];
      if (!entry) {
        failures.push(
          `UNCLASSIFIED ${key}: "${item.name}" (tagged ${JSON.stringify(tagged)}) is shipped but ` +
            `absent from the pinned open-content source, and has no classification. Classify it in ` +
            `scripts/data/srd-overinclusion-classification.json (see docs/GAPS.md §18 for the vocabulary).`
        );
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(CLASSES, entry.class)) {
        failures.push(
          `BAD CLASS ${ledgerKey}: "${entry.class}" is not one of ${Object.keys(CLASSES).join(', ')}.`
        );
        continue;
      }
      if (typeof entry.evidence !== 'string' || entry.evidence.trim().length < 20) {
        failures.push(
          `NO EVIDENCE ${ledgerKey}: classified "${entry.class}" with no substantive evidence. ` +
            `An unsupported classification is worse than an honest "undetermined".`
        );
        continue;
      }
      if (String(entry.taggedSource ?? '') !== String(tagged ?? '')) {
        failures.push(
          `SOURCE-TAG DRIFT ${ledgerKey}: recorded taggedSource=${JSON.stringify(entry.taggedSource)}, ` +
            `now ${JSON.stringify(tagged)}. Never resolve a provenance finding by editing the source ` +
            `tag — re-record the classification deliberately if the change is intended.`
        );
      }
    }
  }

  if (record) {
    writeFileSync(
      CLASSIFICATION_PATH,
      `${JSON.stringify(
        {
          note: classification.note,
          classes: CLASSES,
          entries: Object.fromEntries(
            Object.entries(recorded).sort(([a], [b]) => a.localeCompare(b))
          ),
        },
        null,
        2
      )}\n`
    );
    console.log(`recorded ${Object.keys(recorded).length} suspects to ${CLASSIFICATION_PATH}`);
    return;
  }

  for (const ledgerKey of Object.keys(classification.entries ?? {})) {
    if (!seen.has(ledgerKey)) {
      failures.push(
        `STALE CLASSIFICATION ${ledgerKey}: no longer an over-inclusion suspect (entry removed, ` +
          `renamed, or the denominator now covers it). Remove it from ` +
          `scripts/data/srd-overinclusion-classification.json.`
      );
    }
  }

  const tally = {};
  for (const entry of Object.values(classification.entries ?? {})) {
    tally[entry.class] = (tally[entry.class] ?? 0) + 1;
  }
  const licensing = Object.entries(tally)
    .filter(([c]) => LICENSING_CLASSES.has(c))
    .map(([c, n]) => `${c}=${n}`)
    .join(', ');

  console.log(
    `Provenance over-inclusion: ${total} shipped entries absent from their cited open-content ` +
      `source, across ${perPopulation.size} wired populations.`
  );
  for (const [c, n] of Object.entries(tally).sort(([, a], [, b]) => b - a)) {
    console.log(`  ${String(n).padStart(4)}  ${c}`);
  }
  console.log(`  licensing-class total: ${licensing || 'none'} (see docs/GAPS.md §18)`);

  if (failures.length > 0) {
    console.error('\nProvenance over-inclusion check FAILED:\n');
    for (const line of failures) console.error(`  - ${line}`);
    console.error(
      '\nEvery shipped entry absent from the source it cites must be classified with evidence. ' +
        'Do NOT resolve a finding by editing the source tag, and do NOT delete shipped content — ' +
        'both are the repository owner’s decision (docs/GAPS.md §11, §18).'
    );
    process.exit(1);
  }
  console.log('Provenance over-inclusion: OK');
}

if (process.argv.includes('--write')) {
  const manifest = await buildManifest();
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `wrote ${MANIFEST_PATH}: ${Object.keys(manifest.denominators).length} pinned denominators`
  );
} else if (process.argv.includes('--record')) {
  await run({ record: true });
} else {
  await run();
}
