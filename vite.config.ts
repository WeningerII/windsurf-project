import { defineConfig, type Plugin, type Rollup } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// Upper bound for the injected precache list. The entry's static import
// closure is currently well under this; the cap is a guardrail so a future
// import-graph explosion cannot turn first-install into a megabyte download.
const MAX_PRECACHE_URLS = 40;

/**
 * Build-time service-worker stamping.
 *
 * public/service-worker.js ships with two placeholders:
 *   - `__BUILD_HASH__` in CACHE_NAME — replaced with a hash of the emitted
 *     bundle file names, so every build produces a byte-different SW (the
 *     in-app update banner fires on routine deploys) and a fresh cache name
 *     (activate prunes the previous build's cache).
 *   - `self.__PRECACHE_MANIFEST` — replaced with a literal array of the app
 *     shell URLs plus the entry JS/CSS and their static import graph, so the
 *     new cache is fully pre-warmed during `install`, before the old cache
 *     is deleted. Offline launches keep working across version bumps.
 *
 * Vite copies public/ into dist/ before `writeBundle` runs, so writing the
 * transformed worker here overwrites the raw copy.
 */
function serviceWorkerPrecachePlugin(): Plugin {
  // Captured from the resolved Vite config so precache URLs carry the deploy
  // base (e.g. "/windsurf-project/" on GitHub project pages). Vite normalizes
  // base to start and end with "/", so the concatenation below collapses to
  // today's root-relative URLs when base is "/".
  let base = '/';
  return {
    name: 'service-worker-precache',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    writeBundle(options, bundle) {
      const outDir = options.dir ?? 'dist';

      // Entry JS chunks plus their static import closure. Everything the
      // shell statically imports (vendor/icons and, today, several data
      // chunks the registry pulls in eagerly) is required for an offline
      // boot. Chunks reachable only via dynamic import stay out of the
      // manifest — the SW caches them on demand.
      const chunks = Object.values(bundle).filter(
        (output): output is Rollup.OutputChunk => output.type === 'chunk'
      );
      const chunkByFileName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
      const precacheJs = new Set<string>();
      const queue = chunks.filter((chunk) => chunk.isEntry).map((chunk) => chunk.fileName);
      while (queue.length > 0) {
        const fileName = queue.shift();
        if (!fileName || precacheJs.has(fileName)) continue;
        const chunk = chunkByFileName.get(fileName);
        if (!chunk) continue;
        precacheJs.add(fileName);
        queue.push(...chunk.imports);
      }

      const cssFiles = Object.values(bundle)
        .filter((output) => output.type === 'asset' && output.fileName.endsWith('.css'))
        .map((output) => output.fileName);

      const precacheUrls = [
        base,
        `${base}index.html`,
        `${base}manifest.webmanifest`,
        ...[...precacheJs, ...cssFiles].map((fileName) => `${base}${fileName}`),
      ].slice(0, MAX_PRECACHE_URLS);

      // Hash every emitted file name (all content-hashed), so any asset
      // change — including lazily loaded data chunks — yields a new SW.
      const buildHash = createHash('sha256')
        .update(Object.keys(bundle).sort().join('\n'))
        .digest('hex')
        .slice(0, 12);

      const swSource = fs.readFileSync(path.resolve(__dirname, 'public/service-worker.js'), 'utf8');
      const stamped = swSource
        .replace(/__BUILD_HASH__/g, buildHash)
        .replace(/self\.__PRECACHE_MANIFEST/g, JSON.stringify(precacheUrls));

      if (stamped === swSource) {
        throw new Error(
          'service-worker-precache: no placeholders found in public/service-worker.js'
        );
      }

      fs.writeFileSync(path.join(outDir, 'service-worker.js'), stamped);
    },
  };
}

/**
 * Build-time chunk-graph emitter (UI-shell Phase 7).
 *
 * The eager-vs-lazy split is the shell's central bundle discipline: the app
 * shell boots, and every surface (Scene canvas) and every per-system sheet is
 * pulled in on demand. `scripts/check-bundle-size.mjs` used to infer that split
 * from `dist/index.html` plus a minified copy marker, which only answers "is
 * SceneManager eager?" and breaks the moment the marker copy is reworded.
 *
 * Rollup already knows the exact answer, keyed by SOURCE PATH: which chunk each
 * module landed in, which chunks are entries, and which chunk imports are
 * static (eager) versus dynamic (lazy). This plugin writes that graph out so
 * the budget checker can assert eager-set purity for all seven systems without
 * ever string-matching UI copy.
 *
 * The artifact is written OUTSIDE `dist/` (into the gitignored `.tmp/build/`)
 * so nothing new is deployed and the shipped bundle is byte-unchanged.
 */
const CHUNK_GRAPH_PATH = '.tmp/build/chunk-graph.json';

function chunkGraphPlugin(): Plugin {
  return {
    name: 'shell-chunk-graph',
    apply: 'build',
    writeBundle(_options, bundle) {
      const root = __dirname;
      const chunks = Object.values(bundle).filter(
        (output): output is Rollup.OutputChunk => output.type === 'chunk'
      );
      const graph = chunks.map((chunk) => ({
        fileName: chunk.fileName,
        isEntry: chunk.isEntry,
        isDynamicEntry: chunk.isDynamicEntry,
        // Static imports = the eager closure edges. Dynamic imports are the
        // lazy boundaries the shell's budgets exist to protect.
        imports: chunk.imports,
        dynamicImports: chunk.dynamicImports,
        // Project modules only: `src/data/**` is generated SRD content that
        // would balloon the artifact without informing any shell budget, and
        // node_modules ids say nothing about the shell's own layering.
        moduleIds: chunk.moduleIds
          .map((id) => path.relative(root, id).split(path.sep).join('/'))
          .filter((id) => id.startsWith('src/') && !id.startsWith('src/data/')),
      }));

      const outFile = path.resolve(root, CHUNK_GRAPH_PATH);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, `${JSON.stringify(graph, null, 2)}\n`);
    },
  };
}

export default defineConfig({
  // Deploy base path. Defaults to "/" for local dev, the Netlify root deploy,
  // and the e2e/preview server; the GitHub Pages workflow sets BASE_PATH to
  // "/windsurf-project/" so Vite emits asset URLs under the project-pages
  // sub-path.
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    serviceWorkerPrecachePlugin(),
    chunkGraphPlugin(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
    visualizer({
      // Outside dist/ so the module-structure report is never deployed.
      filename: './stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Most-specific first: lucide-react's path contains "react", so
            // it must be classified before the react/react-dom checks (which
            // match whole path segments to avoid capturing every dependency
            // with "react" somewhere in its name).
            if (id.includes('/node_modules/lucide-react/')) {
              return 'icons';
            }
            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
              return 'react-vendor';
            }
            return 'vendor';
          }

          // Split large SRD datasets into per-system chunks. The biggest
          // categories of the now-coverage-complete 5e-2014 set get their own
          // lazy chunks so no single data chunk outgrows the budget.
          if (id.includes('src/data/dnd/5e-2014/monsters')) {
            return 'dnd-5e-2014-monsters-data';
          }
          if (id.includes('src/data/dnd/5e-2014/spells')) {
            return 'dnd-5e-2014-spells-data';
          }
          if (id.includes('src/data/dnd/5e-2014')) {
            return 'dnd-5e-2014-data';
          }
          if (id.includes('src/data/dnd/5e-2024/equipment')) {
            return 'dnd-5e-2024-equipment-data';
          }
          if (id.includes('src/data/dnd/5e-2024/monsters')) {
            return 'dnd-5e-2024-monsters-data';
          }
          if (id.includes('src/data/dnd/5e-2024/spells')) {
            return 'dnd-5e-2024-spells-data';
          }
          if (id.includes('src/data/dnd/5e-2024')) {
            return 'dnd-5e-2024-data';
          }
          if (id.includes('src/data/dnd/3.5e/spells')) {
            return 'dnd-35e-spells-data';
          }
          if (id.includes('src/data/dnd/3.5e')) {
            return 'dnd-35e-data';
          }
          if (/src\/data\/pathfinder\/1e\/spells\/(?:srd-)?(?:cantrips|level-[0-4]\b)/.test(id)) {
            return 'pf1e-spells-low-data';
          }
          if (id.includes('src/data/pathfinder/1e/monsters')) {
            return 'pf1e-monsters-data';
          }
          if (id.includes('src/data/pathfinder/1e/spells')) {
            return 'pf1e-spells-data';
          }
          if (id.includes('src/data/pathfinder/1e/equipment')) {
            return 'pf1e-equipment-data';
          }
          if (id.includes('src/data/pathfinder/1e')) {
            return 'pf1e-data';
          }
          if (id.includes('src/data/pathfinder/2e/monsters')) {
            return 'pf2e-monsters-data';
          }
          if (id.includes('src/data/pathfinder/2e/spells')) {
            return 'pf2e-spells-data';
          }
          if (id.includes('src/data/pathfinder/2e')) {
            return 'pf2e-data';
          }
          if (id.includes('src/data/mutants-and-masterminds/3e')) {
            return 'mam3e-data';
          }
          if (id.includes('src/data/daggerheart')) {
            return 'daggerheart-data';
          }
        },
      },
    },
    // Do not <link rel="modulepreload"> the large per-system SRD data chunks on
    // first load. They are imported on demand when a user opens a system, so
    // prefetching all seven systems wastes bandwidth in the typical
    // single-system session. They still load lazily via the async dataLoader.
    modulePreload: {
      resolveDependencies: (_filename, deps) => deps.filter((dep) => !dep.includes('-data-')),
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
});
