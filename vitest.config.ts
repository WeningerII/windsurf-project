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
    fileParallelism: !isCoverageRun,
    maxWorkers: isCoverageRun ? 1 : undefined,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
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
