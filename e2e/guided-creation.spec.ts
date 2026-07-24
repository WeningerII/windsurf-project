import { expect, test, type Page } from '@playwright/test';

// User-facing e2e coverage for the system-agnostic guided-creation wizard shell.
// CI-verified only (not run in the authoring sandbox). Mirrors the landing-page
// reset idiom used by the other specs so it drives the real app the same way.

async function openLandingPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

async function openWizardForDnd2024(page: Page) {
  await page.getByRole('button', { name: /New Character/i }).click();
  await page.getByRole('button', { name: /D&D 5e \(2024\)/i }).click();
  await expect(page.getByTestId('creation-wizard')).toBeVisible({ timeout: 30_000 });
}

test.describe('Guided creation wizard', () => {
  test.beforeEach(async ({ page }) => {
    await openLandingPage(page);
  });

  test('drives system selection → class choice → review → a created character', async ({
    page,
  }) => {
    await openWizardForDnd2024(page);

    // Name step.
    await page.getByTestId('creation-name-input').fill('Wizard Fighter');

    // Class step: pick a loader-exposed option; it is applied through the
    // existing template applicator when the working document rebuilds.
    await page.getByRole('button', { name: /\bClass\b/i }).click();
    const fighter = page.getByTestId('creation-option-fighter');
    await expect(fighter).toBeVisible({ timeout: 30_000 });
    await fighter.click();

    // Review + create.
    await page.getByRole('button', { name: /\bReview\b/i }).click();
    const create = page.getByTestId('creation-create');
    await expect(create).toBeEnabled({ timeout: 30_000 });
    await create.click();

    // Lands on the sheet, carrying the drafted name.
    await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('input[title="Character name"]')).toHaveValue('Wizard Fighter');
  });

  test('cancel preserves the draft and reopening resumes it', async ({ page }) => {
    await openWizardForDnd2024(page);
    await page.getByTestId('creation-name-input').fill('Paused Hero');
    await page.getByTestId('creation-cancel').click();

    // Reopen the same system: the draft resumes with its banner + saved name.
    await page.getByRole('button', { name: /New Character/i }).click();
    await page.getByRole('button', { name: /D&D 5e \(2024\)/i }).click();
    await expect(page.getByTestId('creation-resumed-banner')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('creation-name-input')).toHaveValue('Paused Hero');
  });
});
