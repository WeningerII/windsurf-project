import { Buffer } from 'node:buffer';
import { expect, test, type Page } from '@playwright/test';

/**
 * Phase-1 acceptance gate (d) (build-specs task 14) — compound sheet-open:
 * every openSheet writer both sets the document AND switches to the Sheet
 * surface, so a campaign-card click, a clone, and a character import each
 * end on a rendered sheet (not stranded on their originating surface).
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
});

/** Create a character via the dialog-first flow (a system click creates immediately). */
async function createCharacterForSystem(page: Page, systemPattern: RegExp = /D&D 5e \(2024\)/i) {
  await page.getByRole('button', { name: /New Character/i }).click();
  await page.getByRole('button', { name: systemPattern }).click();
  // The sheet is a lazily-loaded chunk; a cold CI fetch+parse can be slow.
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible({ timeout: 30_000 });
}

/** Rename the character via the sheet's name input. */
async function renameCharacter(page: Page, name: string) {
  await page.locator('input[title="Character name"]').fill(name);
}

test('a campaign-card character click renders the sheet', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Party Hero');
  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  // Build a campaign with the character as a member (creation auto-expands).
  await page.getByRole('button', { name: 'Campaigns', exact: true }).click();
  await page.getByRole('button', { name: /New Campaign/i }).click();
  await page.getByPlaceholder('Campaign name...').fill('E2E Party');
  await page.getByRole('button', { name: /^Create$/ }).click();
  await page.getByRole('button', { name: /Add Character/i }).click();
  await page.getByRole('button', { name: /Party Hero/ }).click();
  await page.getByRole('button', { name: /^Done$/ }).click();

  // The member-card click is the compound openSheet writer under test: it
  // must flip from the Campaigns segment to a rendered sheet.
  await page.getByRole('button', { name: /Party Hero D&D/ }).click();
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('heading', { name: 'Party Hero' })).toBeVisible();
  await expect(page.locator('input[title="Character name"]')).toHaveValue('Party Hero');
});

test('cloning a character renders the cloned sheet', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Original Hero');

  // Clone from the sheet header: the clone's sheet (not the original's)
  // must be the one on screen afterwards.
  await page.getByRole('button', { name: 'Clone character' }).click();
  await expect(page.getByRole('heading', { name: 'Original Hero (Copy)' })).toBeVisible();
  await expect(page.locator('input[title="Character name"]')).toHaveValue('Original Hero (Copy)');
});

test('importing a character renders the imported sheet', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Imported Hero');
  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  // Grab the V2 storage snapshot to re-import after clearing.
  const exportSnapshot = await page.evaluate(() => localStorage.getItem('rpg-documents-v2'));
  expect(exportSnapshot).toBeTruthy();

  await page.getByRole('button', { name: /Clear All Characters/i }).click();
  await expect(page.getByRole('heading', { name: /Delete All Characters/i })).toBeVisible();
  await page.getByRole('button', { name: /^Delete$/ }).click();
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Import Character/i }).click(),
  ]);
  await fileChooser.setFiles({
    name: 'characters.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportSnapshot ?? '', 'utf-8'),
  });

  // Import opens the imported character's sheet (imported[0]).
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('input[title="Character name"]')).toHaveValue('Imported Hero');
});
