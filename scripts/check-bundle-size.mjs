#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const assetsDir = path.resolve(process.cwd(), 'dist/assets');

const budgets = {
  // Total JS counts EVERY chunk, including per-system SRD data that only
  // loads lazily behind its system's browser — first-paint cost is guarded
  // by the separate app/vendor budgets below. Raised from 800 KiB for the
  // coverage-completion program (now spanning 5e-2014/2024, PF2e, and PF1e
  // corpora at or near 100%, plus the d20-legacy bestiary): genuine content,
  // not bloat. Lazy granularity is enforced by the per-data-chunk budget.
  totalJsGzipBytes: parseInt(process.env.BUNDLE_BUDGET_TOTAL_GZIP_BYTES || '', 10) || 1536 * 1024,
  // Restored to 80 KiB now that the 1296-LOC SceneManager view is lazy-loaded
  // out of the eager shell (it no longer rides the index chunk), reclaiming the
  // first-paint discipline the temporary 81 KiB bump had spent on the
  // observability guard.
  appChunkGzipBytes: parseInt(process.env.BUNDLE_BUDGET_APP_GZIP_BYTES || '', 10) || 80 * 1024,
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
