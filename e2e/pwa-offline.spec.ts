import { expect, test } from '@playwright/test';

/**
 * Real service-worker coverage. The Playwright webServer serves the
 * production build (`npm run build` + `vite preview`), so /service-worker.js
 * is the build-stamped worker with an injected precache manifest. The flow:
 *
 *   1. First load online — the worker registers on window load, precaches
 *      the app shell + entry assets during install, and claims the page on
 *      activate.
 *   2. One more online reload so every asset request flows through the now
 *      controlling worker (requests issued before clients.claim() are not
 *      intercepted, so this warms the runtime cache exactly like a real
 *      second visit).
 *   3. Go offline and reload — the app shell must still render entirely
 *      from the service-worker caches.
 *
 * Skipped outside Chromium: Playwright's offline emulation does not reliably
 * apply to service-worker-initiated fetches in other engines, which would
 * let the test pass without exercising the cache at all.
 */
test.describe('service worker offline support', () => {
  test('renders the app shell offline after the first online visit', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName !== 'chromium',
      'Offline emulation only reliably covers service-worker fetches on Chromium'
    );

    await page.goto('/', { waitUntil: 'load' });

    const swSupported = await page.evaluate(() => 'serviceWorker' in navigator);
    test.skip(!swSupported, 'Service workers are unavailable in this browser context');

    // Wait for the worker to finish installing (precache), activate, and
    // take control of this page.
    await page.waitForFunction(
      async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        return Boolean(registration?.active && navigator.serviceWorker.controller);
      },
      undefined,
      { timeout: 30_000 }
    );

    // Warm the runtime cache: with the worker controlling the page, this
    // reload routes the document and every chunk through the fetch handler.
    await page.reload({ waitUntil: 'load' });
    await expect(page.getByText('No characters yet')).toBeVisible({ timeout: 15_000 });

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByText('No characters yet')).toBeVisible({ timeout: 15_000 });
    } finally {
      await context.setOffline(false);
    }
  });
});
