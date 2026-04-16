import { expect, test, type Page } from '@playwright/test';

async function openLandingPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Choose a Game System')).toBeVisible();
}

async function dispatchInstallPrompt(page: Page, outcome: 'accepted' | 'dismissed' = 'accepted') {
  await page.evaluate((selectedOutcome) => {
    const installEvent = new Event('beforeinstallprompt', { cancelable: true });

    Object.defineProperty(installEvent, 'prompt', {
      configurable: true,
      value: () => Promise.resolve(),
    });
    Object.defineProperty(installEvent, 'userChoice', {
      configurable: true,
      value: Promise.resolve({ outcome: selectedOutcome, platform: 'web' }),
    });

    window.dispatchEvent(installEvent);
  }, outcome);
}

test.beforeEach(async ({ page }) => {
  await openLandingPage(page);
});

test('surfaces and completes the install prompt flow', async ({ page }) => {
  await dispatchInstallPrompt(page, 'accepted');

  await expect(page.getByRole('heading', { name: 'Install the app' })).toBeVisible();
  await expect(
    page.getByText(/Add it to your home screen for faster launches and offline-friendly access/i)
  ).toBeVisible();

  await page.getByRole('button', { name: /Install App/i }).click();
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));

  await expect(page.getByText('App installed for offline-friendly access.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Install the app' })).toHaveCount(0);
});

test('persists install prompt dismissal', async ({ page }) => {
  await dispatchInstallPrompt(page, 'accepted');
  await expect(page.getByRole('heading', { name: 'Install the app' })).toBeVisible();

  await page.getByRole('button', { name: /Not now/i }).click();
  await expect(page.getByRole('heading', { name: 'Install the app' })).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('rpg-pwa-install-dismissed-v1')))
    .toBe('true');

  await page.reload();
  await expect(page.getByText('Choose a Game System')).toBeVisible();

  await dispatchInstallPrompt(page, 'accepted');
  await expect(page.getByRole('heading', { name: 'Install the app' })).toHaveCount(0);
});
