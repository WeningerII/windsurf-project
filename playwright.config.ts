import { defineConfig, devices } from '@playwright/test';

const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1';

// `npm run verify` builds (step 9, `check:bundle-size` then gates that build) and
// only afterwards runs `test:e2e`. Without this flag the webServer command below
// runs a SECOND full `tsc && vite build` — ~39s in CI — and, worse, e2e then
// exercises bytes that `check:bundle-size` never inspected. Verify sets
// PLAYWRIGHT_PREBUILT=1 so the same dist/ is gated, tested, and deployed.
//
// Gated on the env var and NOT on "does dist/ exist": a stale dist from an older
// commit would otherwise be silently tested as if it were current.
const usePrebuiltDist = process.env.PLAYWRIGHT_PREBUILT === '1';
const previewCommand = 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort';

export default defineConfig({
  testDir: './e2e',
  timeout: 90 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // A systemic breakage (52 tests x 2 retries on 1 worker) outruns the CI job
  // timeout, which reports the run as "cancelled" and swallows the failure
  // summary. Stop early so real failures surface as failures with output.
  //
  // 10 was still not low enough to keep that promise: 10 failures x 3 attempts
  // x the 90s per-test timeout is 45 minutes, well past the 30-minute job
  // timeout the setting exists to stay under. 4 x 3 x 90s = 18 minutes, which
  // fits with the rest of the chain in front of it.
  maxFailures: process.env.CI ? 4 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: usePrebuiltDist ? previewCommand : `npm run build && ${previewCommand}`,
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
