import { defineConfig, devices } from '@playwright/test';

const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 90 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // A systemic breakage (52 tests x 2 retries on 1 worker) outruns the CI job
  // timeout, which reports the run as "cancelled" and swallows the failure
  // summary. Stop early so real failures surface as failures with output.
  maxFailures: process.env.CI ? 10 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
