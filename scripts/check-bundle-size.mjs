#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const assetsDir = path.resolve(process.cwd(), 'dist/assets');

const budgets = {
  // Total JS (code + per-system data chunks) gzip ceiling. Raised 800→816→824 KiB
  // across the area-of-effect combat feature and the tabletop-loop pass (conditions,
  // concentration, opportunity attacks), then 824→828 KiB for the cross-system
  // creation legality gate (per-system validators for all 7 systems), then
  // 828→834 KiB for prompt-driven creation (the orchestrator, per-system creators,
  // and the prompt-box UI — lazy-loaded, so it stays out of the eager app chunk),
  // then 834→840 KiB for the LLM-authored build path (the build gateway, the
  // per-system options manifests, and the creators' selection-resolution layer,
  // all in the same lazy chunk), then 840→852 KiB for completing the 2014 SRD
  // spell catalog (Fireball, Lightning Bolt, Cone of Cold and 66 other missing
  // SRD spells the authoring path surfaced as unresolvable), then 852 KiB up for
  // filling the 3.5e SRD Sorcerer/Wizard spell list (the level-1..5 arcane catalog
  // was largely absent), then 864→920 KiB for expanding the Pathfinder 1e/2e
  // spell catalogs toward their full published lists (the per-system data chunks
  // are lazy-loaded, off the eager path). Overridable via env.
  totalJsGzipBytes: parseInt(process.env.BUNDLE_BUDGET_TOTAL_GZIP_BYTES || '', 10) || 1040 * 1024,
  // App (eager) chunk gzip ceiling. SceneManager — which pulls the whole combat /
  // tactical-AI / verticality engine via the rules module — is now React.lazy'd,
  // so that chain lives in an on-demand chunk, NOT the eager app chunk. That drops
  // this chunk from ~84 KiB back to ~54 KiB and reverses the 80→87 creep. Keep it
  // tight so the engine can't silently leak back into the eager path.
  appChunkGzipBytes: parseInt(process.env.BUNDLE_BUDGET_APP_GZIP_BYTES || '', 10) || 60 * 1024,
  vendorChunkGzipBytes:
    parseInt(process.env.BUNDLE_BUDGET_VENDOR_GZIP_BYTES || '', 10) || 200 * 1024,
  largestDataChunkGzipBytes:
    parseInt(process.env.BUNDLE_BUDGET_DATA_GZIP_BYTES || '', 10) || 140 * 1024,
};

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function fail(message) {
  console.error(`\nBundle size check failed: ${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(assetsDir)) {
  fail('`dist/assets` not found. Run `npm run build` before checking bundle sizes.');
}

const jsFiles = fs
  .readdirSync(assetsDir)
  .filter((name) => name.endsWith('.js'))
  .sort();

if (jsFiles.length === 0) {
  fail('No JS bundles found in `dist/assets`.');
}

const chunks = jsFiles.map((file) => {
  const fullPath = path.join(assetsDir, file);
  const source = fs.readFileSync(fullPath);
  return {
    file,
    rawBytes: source.byteLength,
    gzipBytes: gzipSync(source).byteLength,
  };
});

const totalJsGzipBytes = chunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
const appChunks = chunks.filter((chunk) => /^index-.*\.js$/.test(chunk.file));
const appChunk = appChunks.reduce(
  (largest, chunk) => (!largest || chunk.gzipBytes > largest.gzipBytes ? chunk : largest),
  null
);
const vendorChunk =
  chunks.find((chunk) => /^react-vendor-.*\.js$/.test(chunk.file)) ||
  chunks.find((chunk) => /^vendor-.*\.js$/.test(chunk.file));
const dataChunks = chunks.filter((chunk) => chunk.file.includes('-data-'));
const largestDataChunk = dataChunks.reduce(
  (largest, chunk) => (!largest || chunk.gzipBytes > largest.gzipBytes ? chunk : largest),
  null
);

console.log('\nBundle size report (gzip):');
for (const chunk of chunks) {
  console.log(`- ${chunk.file}: ${formatBytes(chunk.gzipBytes)}`);
}
console.log(`- total JS: ${formatBytes(totalJsGzipBytes)}`);

const violations = [];

if (totalJsGzipBytes > budgets.totalJsGzipBytes) {
  violations.push(
    `total JS gzip ${formatBytes(totalJsGzipBytes)} exceeds budget ${formatBytes(budgets.totalJsGzipBytes)}`
  );
}

if (!appChunk) {
  violations.push('could not find `index-*.js` application chunk');
} else if (appChunk.gzipBytes > budgets.appChunkGzipBytes) {
  violations.push(
    `app chunk ${appChunk.file} is ${formatBytes(appChunk.gzipBytes)} (budget ${formatBytes(budgets.appChunkGzipBytes)})`
  );
}

if (!vendorChunk) {
  violations.push('could not find vendor chunk (`react-vendor-*.js` or `vendor-*.js`)');
} else if (vendorChunk.gzipBytes > budgets.vendorChunkGzipBytes) {
  violations.push(
    `vendor chunk ${vendorChunk.file} is ${formatBytes(vendorChunk.gzipBytes)} (budget ${formatBytes(budgets.vendorChunkGzipBytes)})`
  );
}

if (dataChunks.length === 0) {
  violations.push('could not find any `*-data-*.js` system data chunk');
} else if (largestDataChunk && largestDataChunk.gzipBytes > budgets.largestDataChunkGzipBytes) {
  violations.push(
    `largest data chunk ${largestDataChunk.file} is ${formatBytes(largestDataChunk.gzipBytes)} (budget ${formatBytes(budgets.largestDataChunkGzipBytes)})`
  );
}

if (violations.length > 0) {
  console.error('\nBudget violations:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('\nBundle size budgets passed.\n');
