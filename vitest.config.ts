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
    exclude: [...configDefaults.exclude, 'e2e/**'],
    testTimeout: isCoverageRun ? 15000 : 10000,
    fileParallelism: !isCoverageRun,
    minWorkers: isCoverageRun ? 1 : undefined,
    maxWorkers: isCoverageRun ? 1 : undefined,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        'src/components/ui/**',
        'src/data/**',
        'src/scripts/**',
        'src/types/**',
        'src/validation/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
