#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const distDir = path.resolve(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');
// Emitted by vite.config.ts's `shell-chunk-graph` plugin (outside dist/, so
// nothing extra is deployed). Rollup's own view of the bundle: which source
// modules landed in which chunk, and which chunk imports are STATIC (eager,
// on the first-paint critical path) versus DYNAMIC (lazy).
const chunkGraphPath = path.resolve(process.cwd(), '.tmp/build/chunk-graph.json');

// The JS chunks index.html asks the browser to preload: the entry
// `<script type="module">` plus one `<link rel="modulepreload">` per chunk Vite
// chose to hint. This is a FALLBACK eager set only — it under-reports, because
// `build.modulePreload.resolveDependencies` in vite.config.ts filters the
// per-system `*-data-*` chunks out of the hint list even though the entry still
// STATICALLY imports them. The authoritative closure comes from Rollup's chunk
// graph below (Phase 7); this remains for a dist without that artifact, and is
// still better than guessing from the `index-*` filename.
function readEagerChunkNames() {
  const indexHtml = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    return null;
  }
  const html = fs.readFileSync(indexHtml, 'utf8');
  const names = new Set();
  const refPattern = /(?:src|href)="[^"]*\/assets\/([^"]+\.js)"/g;
  let match;
  while ((match = refPattern.exec(html)) !== null) {
    names.add(match[1]);
  }
  return names;
}

// Finding 17 (ui-shell Phase 1): SceneManager must stay in its own lazy chunk,
// never folded into the eager `index-*` app chunk. The marker is the
// "No scene selected" empty-state copy — a string literal unique to
// SceneManager.tsx that survives minification (the same words appear in
// App.tsx only inside a comment, which the minifier strips).
const SCENE_MANAGER_MARKER = 'No scene selected';

// ── UI-shell Phase 7: the finished shell's bundle discipline ────────────────
//
// Phases 1-6 built the shell on one promise: the APP SHELL boots, and every
// surface (Scene canvas) and every per-system sheet arrives on demand. Phase 7
// makes that promise a hard gate instead of an intention. The three assertions
// below are structural (source paths from Rollup's chunk graph), so they cannot
// be defeated by rewording UI copy the way a minified-string marker can, and
// they say nothing about any one game system — the shell is shared by all seven.

/**
 * Every system's sheet must land OUTSIDE the eager closure. Keyed by system id
 * so the all-seven-equal rule is machine-checked, not assumed: seven ids, six
 * distinct modules, because `dnd-3.5e` and `pf1e` deliberately share the
 * d20-legacy sheet host (`makeD20LegacySheet`) and dnd5e/dnd5e-2024 each have
 * their own entry over a shared `Dnd5eSheetBase` chunk. If a system is added,
 * add it here — an unlisted system would silently escape the gate.
 */
const SYSTEM_SHEET_MODULES = {
  'dnd-5e-2014': 'src/systems/dnd5e/components/Dnd5eSheet.tsx',
  'dnd-5e-2024': 'src/systems/dnd5e-2024/components/Dnd5e2024Sheet.tsx',
  'dnd-3.5e': 'src/systems/d20-legacy/sheet.tsx',
  pf1e: 'src/systems/d20-legacy/sheet.tsx',
  pf2e: 'src/systems/pf2e/sheet.tsx',
  mam3e: 'src/systems/mam3e/sheet.tsx',
  daggerheart: 'src/systems/daggerheart/sheet.tsx',
};

/**
 * Shell surfaces that must stay behind a lazy boundary. `SceneManager` is the
 * Phase-1 rule (Finding 17) restated against source paths instead of the
 * "No scene selected" copy marker; `SceneCanvas` is the Phase-6 renderer, which
 * is flag-gated at RUNTIME (VITE_SCENE_CANVAS_ENABLED) but must not be pulled
 * into first paint at BUILD time regardless of the flag.
 */
const LAZY_SURFACE_MODULES = ['src/components/SceneManager.tsx', 'src/components/SceneCanvas.tsx'];

/**
 * Per-system SRD data chunks that are ALREADY on the first-paint critical path,
 * because the registry's eager bootstrap statically imports them.
 *
 * This list is RECORDED DEBT, not policy. `build.modulePreload.resolveDependencies`
 * drops these from index.html's `<link rel="modulepreload">` set, which is why the
 * index.html-derived eager set below reports only four chunks — but dropping the
 * preload HINT does not make a static import lazy; the browser still fetches and
 * evaluates all of them before the entry module runs. Measured 2026-07-24: 755.0
 * KiB gzip across these eleven chunks, versus 189.4 KiB for the shell's own code.
 *
 * The all-seven picture is deliberately recorded because it is UNEQUAL today:
 * daggerheart, mam3e, dnd-3.5e, pf1e and pf2e pay full eager freight, dnd-5e-2024
 * pays partially (spells only), and dnd-5e-2014 pays nothing. Fixing that is the
 * STRUCTURAL reclaim already named in the app-chunk budget note (lazy-loading the
 * per-system engines behind the registry) — a larger async-boundary change tracked
 * separately, NOT something Phase 7 hardening should smuggle in.
 *
 * What IS hard-gated here: the list may only ever SHRINK. Any per-system data
 * chunk that newly joins the eager closure fails the build, so the debt cannot
 * grow quietly. Byte growth inside these chunks is genuine SRD content and is
 * already covered by `totalJsGzipBytes`, so it is intentionally not re-budgeted.
 */
const EAGER_SYSTEM_DATA_CHUNKS = new Set([
  'daggerheart-data',
  'dnd-35e-data',
  'dnd-35e-spells-data',
  'dnd-5e-2024-spells-data',
  'mam3e-data',
  'pf1e-data',
  'pf1e-equipment-data',
  'pf1e-spells-data',
  'pf1e-spells-low-data',
  'pf2e-data',
  'pf2e-spells-data',
]);

/** Strip Vite's 8-character base64url content hash: `index-BMMuzuD9.js` -> `index`. */
function chunkFamily(fileName) {
  return path.basename(fileName).replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
}

const budgets = {
  // Total JS counts EVERY chunk, including per-system SRD data that only
  // loads lazily behind its system's browser — first-paint cost is guarded
  // by the separate app/vendor budgets below. Raised from 800 KiB for the
  // coverage-completion program (now spanning 5e-2014/2024, PF2e, and PF1e
  // corpora at or near 100%, plus the d20-legacy bestiary): genuine content,
  // not bloat. Lazy granularity is enforced by the per-data-chunk budget.
  // Bumped 1536 -> 1664 KiB for the PF1e Core Rulebook equipment + magic-items
  // corpus (243 + 347 SRD items, code-split into its own pf1e-equipment-data
  // chunk that stays well under the per-data-chunk budget).
  totalJsGzipBytes: parseInt(process.env.BUNDLE_BUDGET_TOTAL_GZIP_BYTES || '', 10) || 1664 * 1024,
  // 80 -> 84 KiB (2026-07-24) for the RFC-003 rules-IR spine now carried in the
  // eager shell: the shared resolver + per-system effect/condition compilers +
  // contribution-ledger seam + legal-actions registry surface are exercised by
  // all seven engines at registry bootstrap, so they cannot be code-split the
  // way per-system sheets/validators/legal-actions PROVIDERS/data already are
  // (those remain lazy — verified: validation-*/legalActions-* ride their own
  // chunks). This is genuine cross-system capability, not bloat.
  // 84 -> 85 KiB (2026-07-24) for the Wave-3 all-seven UI shell landing together:
  // the guided-creation wizard front-door (loadCreationPlan registry seam +
  // New-Character routing, App-shell eager) and the Dock<->sheet dispatch seam
  // (split registry/state contexts wired across all seven sheets) push the
  // post-merge eager shell to ~84.0; each PR measured green against a different
  // base, so the combined footprint only resolves at merge. Still universal,
  // all-system capability, not per-system bloat. The eager shell has now reached
  // the point the previous note flagged: the NEXT climb must be paid by the
  // STRUCTURAL reclaim — lazy-loading the per-system engines behind the registry
  // (a larger async-boundary change, tracked separately) — not another bump.
  // The budget still catches a large jump — it is +1 KiB, with ~0.9 KiB headroom.
  appChunkGzipBytes: parseInt(process.env.BUNDLE_BUDGET_APP_GZIP_BYTES || '', 10) || 85 * 1024,
  // UI-shell Phase 7 (2026-07-24): the FIRST-PAINT budget for the shell's own
  // code — every eager chunk except the grandfathered per-system SRD data above
  // (index + react-vendor + vendor + icons). Until now nothing budgeted this
  // total: `icons` had no budget at all and `vendor`'s 200 KiB ceiling is ~2x its
  // real 56.4 KiB, so ~145 KiB of eager growth could land without any gate
  // firing. This one number is what a user actually downloads before the shell
  // paints, so it is the number Phase 7 must hold.
  //
  // DERIVATION — measured 2026-07-24 on this build: index 86,087 + react-vendor
  // 44,150 + vendor 57,747 + icons 5,973 = 193,957 B (189.4 KiB). Budget 192 KiB
  // (196,608 B) leaves 2,651 B of headroom, chosen so it never fires BEFORE the
  // tighter per-chunk gates it sits over: the app-chunk budget still has 953 B of
  // its own slack (85 KiB - 86,087 B), and the remaining ~1.7 KiB absorbs
  // vendor/icon churn (a tree-shaken lucide icon is ~150-250 B gzip; a React
  // patch bump is a few hundred B). A genuinely new eager dependency costs KiB,
  // not hundreds of bytes, so it trips this gate. Like the app-chunk budget, the
  // next real climb must be paid by the structural reclaim, not a bump.
  eagerShellGzipBytes:
    parseInt(process.env.BUNDLE_BUDGET_EAGER_SHELL_GZIP_BYTES || '', 10) || 192 * 1024,
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
    hasSceneManagerMarker: source.includes(SCENE_MANAGER_MARKER),
  };
});

// ── Rollup's chunk graph: the authoritative eager closure ──────────────────
//
// index.html is NOT the authoritative eager set, contrary to what this script
// assumed through Phase 6. `build.modulePreload.resolveDependencies` in
// vite.config.ts filters `*-data-*` chunks out of the emitted
// `<link rel="modulepreload">` list, so index.html names four chunks while the
// entry module STATICALLY imports fifteen. Removing a preload hint does not
// create a lazy boundary. Rollup's own graph does not have that blind spot, so
// Phase 7 derives the eager closure from it: the entry chunk plus the transitive
// closure of STATIC imports. Dynamic imports are exactly the lazy boundaries the
// shell's budgets protect and are excluded by construction.
if (!fs.existsSync(chunkGraphPath)) {
  fail(
    `chunk graph not found at ${path.relative(process.cwd(), chunkGraphPath)}. Run \`npm run build\` (the vite \`shell-chunk-graph\` plugin writes it) before checking bundle sizes.`
  );
}
const chunkGraph = JSON.parse(fs.readFileSync(chunkGraphPath, 'utf8'));
const graphByFile = new Map(chunkGraph.map((chunk) => [chunk.fileName, chunk]));
const eagerGraphFiles = new Set();
const eagerQueue = chunkGraph.filter((chunk) => chunk.isEntry).map((chunk) => chunk.fileName);
while (eagerQueue.length > 0) {
  const fileName = eagerQueue.shift();
  if (eagerGraphFiles.has(fileName)) continue;
  const chunk = graphByFile.get(fileName);
  if (!chunk) continue;
  eagerGraphFiles.add(fileName);
  eagerQueue.push(...chunk.imports);
}
// `chunks` above is keyed by bare file name; the graph is keyed by the emitted
// path (`assets/index-*.js`). Normalize to bare names once.
const eagerGraphNames = new Set([...eagerGraphFiles].map((file) => path.basename(file)));

const totalJsGzipBytes = chunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
const appChunks = chunks.filter((chunk) => /^index-.*\.js$/.test(chunk.file));
// Classify chunks against the graph closure; index.html and the `index-*`
// filename heuristic remain as ordered fallbacks for a partial dist.
const eagerChunkNames = readEagerChunkNames();
const isEagerChunk = (file) => {
  if (eagerGraphNames.size > 0) return eagerGraphNames.has(file);
  if (eagerChunkNames) return eagerChunkNames.has(file);
  return /^index-.*\.js$/.test(file);
};
const eagerChunks = chunks.filter((chunk) => isEagerChunk(chunk.file));
const eagerShellChunks = eagerChunks.filter((chunk) => !chunkFamily(chunk.file).endsWith('-data'));
const eagerShellGzipBytes = eagerShellChunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
const eagerDataChunks = eagerChunks.filter((chunk) => chunkFamily(chunk.file).endsWith('-data'));
const eagerDataGzipBytes = eagerDataChunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
// Which chunk holds a given source module, per Rollup.
const chunkForModule = new Map();
for (const chunk of chunkGraph) {
  for (const moduleId of chunk.moduleIds) {
    if (!chunkForModule.has(moduleId)) chunkForModule.set(moduleId, chunk.fileName);
  }
}
const sceneManagerChunks = chunks.filter((chunk) => chunk.hasSceneManagerMarker);
const lazySceneManagerChunk = sceneManagerChunks.find((chunk) => !isEagerChunk(chunk.file));
const eagerSceneManagerChunk = sceneManagerChunks.find((chunk) => isEagerChunk(chunk.file));
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
if (lazySceneManagerChunk) {
  console.log(`- SceneManager lazy chunk: ${lazySceneManagerChunk.file}`);
}
console.log(
  `- eager shell (first paint, shell code): ${formatBytes(eagerShellGzipBytes)} across ${eagerShellChunks.length} chunks`
);
console.log(
  `- eager per-system SRD data (recorded debt): ${formatBytes(eagerDataGzipBytes)} across ${eagerDataChunks.length} chunks`
);

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

if (!lazySceneManagerChunk) {
  violations.push(
    `could not find a lazy SceneManager chunk — no non-index chunk contains the marker ${JSON.stringify(SCENE_MANAGER_MARKER)}`
  );
}

if (eagerSceneManagerChunk) {
  violations.push(
    `eager chunk ${eagerSceneManagerChunk.file} (on the first-paint static-import closure) contains SceneManager code (marker ${JSON.stringify(SCENE_MANAGER_MARKER)}) — the scene view must stay lazy-loaded`
  );
}

// ── Phase 7 gate 1: first-paint shell budget ───────────────────────────────
if (eagerShellChunks.length === 0) {
  violations.push('chunk graph produced an empty eager closure — the entry chunk was not found');
} else if (eagerShellGzipBytes > budgets.eagerShellGzipBytes) {
  violations.push(
    `eager shell JS is ${formatBytes(eagerShellGzipBytes)} across ${eagerShellChunks
      .map((chunk) => chunk.file)
      .join(
        ', '
      )} (budget ${formatBytes(budgets.eagerShellGzipBytes)}) — the first-paint shell must not grow without the structural reclaim`
  );
}

// ── Phase 7 gate 2: the eager per-system data debt may only shrink ─────────
for (const chunk of eagerDataChunks) {
  const family = chunkFamily(chunk.file);
  if (!EAGER_SYSTEM_DATA_CHUNKS.has(family)) {
    violations.push(
      `per-system data chunk ${chunk.file} (${formatBytes(chunk.gzipBytes)}) is statically imported by the entry closure, joining first paint. Only the eleven grandfathered chunks in EAGER_SYSTEM_DATA_CHUNKS may be eager, and that list may only shrink — load this system's data through the async dataLoader instead`
    );
  }
}

// ── Phase 7 gate 3: all-seven lazy-sheet + lazy-surface purity ─────────────
// System-agnostic by construction: every registered system is checked against
// the same rule, and no system's sheet may ride first paint.
for (const [systemId, moduleId] of Object.entries(SYSTEM_SHEET_MODULES)) {
  const owningChunk = chunkForModule.get(moduleId);
  if (!owningChunk) {
    violations.push(
      `system ${systemId}: sheet module ${moduleId} is not in any emitted chunk — SYSTEM_SHEET_MODULES is stale, update it so the all-seven lazy-sheet gate keeps measuring the real sheet`
    );
  } else if (eagerGraphFiles.has(owningChunk)) {
    violations.push(
      `system ${systemId}: sheet module ${moduleId} landed in eager chunk ${owningChunk} — every system's sheet must stay behind a dynamic import`
    );
  }
}

for (const moduleId of LAZY_SURFACE_MODULES) {
  const owningChunk = chunkForModule.get(moduleId);
  if (!owningChunk) {
    violations.push(
      `shell surface module ${moduleId} is not in any emitted chunk — LAZY_SURFACE_MODULES is stale`
    );
  } else if (eagerGraphFiles.has(owningChunk)) {
    violations.push(
      `shell surface module ${moduleId} landed in eager chunk ${owningChunk} — shell surfaces must stay behind a dynamic import`
    );
  }
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
