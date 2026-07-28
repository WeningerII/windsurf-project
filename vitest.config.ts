import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const isCoverageRun = process.argv.some(
  (arg) => arg === '--coverage' || arg === '--coverage.enabled' || arg.startsWith('--coverage.')
);

export default defineConfig({
  plugins: [react()] as any,
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/__tests__/setup.ts',
    // `.claude/worktrees/**` holds agent worktrees — full checkouts of this repo
    // nested inside it. Without this exclude, vitest collects every worktree's
    // copy of the suite, so a run tests stale code alongside the real tree and
    // multiplies its own runtime by the worktree count.
    exclude: [...configDefaults.exclude, 'e2e/**', '.tmp/**', '.claude/worktrees/**'],
    testTimeout: isCoverageRun ? 15000 : 10000,
    // Coverage runs used to be forced fully serial (`fileParallelism: false`
    // plus `maxWorkers: 1`), with no comment, doc or commit message giving a
    // reason — and `npm run verify` passed `--maxWorkers=1` on top of it. That
    // made the CI coverage step 253.8s, ~39% of the entire pipeline.
    //
    // Measured back-to-back on an idle machine, same command otherwise:
    //   serial          286.4s   307 files / 3092 tests, cov 86.49/76.69/84.67/87.5
    //   4 workers       108.1s   307 files / 3092 tests, cov 86.49/76.69/84.67/87.5
    // Identical pass count, identical coverage, 2.65x faster.
    //
    // NOTE for anyone bisecting this: dropping only the `--maxWorkers=1` CLI
    // flag changes nothing, because `fileParallelism: false` here is what
    // actually serialized the run. Both had to go.
    //
    // The cap is explicit rather than left to the default because each worker
    // holds its own v8 coverage map, and 4 is both the measured configuration
    // and the vCPU count of the ubuntu-latest runner. If a smaller runner ever
    // exhausts memory, lower this to 2 — do not go back to 1.
    maxWorkers: isCoverageRun ? 4 : undefined,
    coverage: {
      provider: 'v8',
      // No 'html': the lcov reporter is a composite that ALREADY emits an HTML
      // tree (istanbul-reports' LcovReport wraps HtmlReport into
      // coverage/lcov-report/). The two were byte-identical at 11,550,823 bytes
      // each, 444 files apiece, differing only in a generation timestamp.
      // A full HTML report still exists at coverage/lcov-report/index.html.
      reporter: ['text', 'json', 'lcov'],
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/systems/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/registry/**/*.{ts,tsx}',
        'src/rules/**/*.{ts,tsx}',
        'src/scene/**/*.{ts,tsx}',
        'src/contexts/**/*.{ts,tsx}',
        'src/constants/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        'src/components/ui/**',
        // Phase-4 drag: DOM/rAF-only pieces exercised by Playwright, not vitest.
        // The portaled ghost is positioned by an imperative ref transform and
        // DragRoot is a lazy-import boundary — neither is unit-meaningful. The
        // pure engine (pointerEngine), the hit-test (useDropTarget), the seam
        // and the drop controller ARE unit-tested.
        'src/components/drag/DragLayer.tsx',
        'src/components/drag/DragRoot.tsx',
        'src/data/**',
        'src/scripts/**',
        'src/types/**',
        'src/validation/**',
        // App.tsx and main.tsx stay uninstrumented on purpose: they are
        // top-level wiring (root render, provider/layout composition) that
        // is exercised end-to-end by Playwright, not by unit tests, and
        // including them would only add noise to the thresholds below.
        'src/App.tsx',
        'src/main.tsx',
      ],
      thresholds: {
        lines: 70,
        functions: 65,
        branches: 60,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
