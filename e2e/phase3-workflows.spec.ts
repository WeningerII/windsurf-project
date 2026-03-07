import { Buffer } from 'node:buffer';
import { expect, test, type Page } from '@playwright/test';

/**
 * Select a system card and click "Create New Character".
 * The current UI flow: click system card → action bar appears → click create.
 * This opens the character sheet directly (no wizard).
 */
async function createCharacterForSystem(page: Page, systemPattern: RegExp = /D&D 5e \(2024\)/i) {
  await page.getByRole('button', { name: systemPattern }).click();
  await page.getByRole('button', { name: /Create New Character/i }).click();
  // Sheet opens — the header shows "New Character" and the Back button
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
}

/**
 * Rename the character via the sheet's name input.
 * Most systems use title="Character name"; Daggerheart currently uses a placeholder.
 */
async function renameCharacter(page: Page, name: string) {
  const titledInput = page.locator('input[title="Character name"]');
  const nameInput =
    (await titledInput.count()) > 0 ? titledInput.first() : page.getByPlaceholder('Character Name');
  await nameInput.fill(name);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Choose a Game System')).toBeVisible();
});

test('renders landing page with system choices', async ({ page }) => {
  await expect(page.getByText('Choose a Game System')).toBeVisible();
  await expect(page.getByRole('button', { name: /D&D 5e \(2024\)/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /D&D 5e \(2014\)/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Pathfinder 2e/i })).toBeVisible();
});

test('creates a D&D 5e-2024 character and displays character sheet', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'E2E Fighter');

  // Verify the name input has the new value
  const nameInput = page.locator('input[title="Character name"]');
  await expect(nameInput).toHaveValue('E2E Fighter');

  // Verify the header shows the character name
  await expect(page.getByRole('heading', { name: 'E2E Fighter' })).toBeVisible();
});

test('persists created character after reload', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Persistent E2E Hero');

  // Go back to character list
  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Persistent E2E Hero')).toBeVisible();

  // Reload and verify persistence
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Persistent E2E Hero')).toBeVisible();
});

test('clears all characters', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Clearable E2E Hero');

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  // Confirm the in-app modal and clear everything
  await page.getByRole('button', { name: /Clear All Characters/i }).click();
  await expect(page.getByRole('heading', { name: /Delete All Characters/i })).toBeVisible();
  await page.getByRole('button', { name: /^Delete$/i }).click();

  // Characters section should disappear
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toHaveCount(0);
});

test('imports a character snapshot through the file input', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Importable E2E Hero');

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  // Grab the V2 storage snapshot
  const exportSnapshot = await page.evaluate(() => localStorage.getItem('rpg-documents-v2'));
  expect(exportSnapshot).toBeTruthy();

  // Clear all characters
  await page.getByRole('button', { name: /Clear All Characters/i }).click();
  await expect(page.getByRole('heading', { name: /Delete All Characters/i })).toBeVisible();
  await page.getByRole('button', { name: /^Delete$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toHaveCount(0);

  // Select a system so the Import button appears in the action bar
  await page.getByRole('button', { name: /D&D 5e \(2024\)/i }).click();

  // The Import button triggers a hidden file input via JS.
  // We intercept the file chooser event to supply our file.
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Import Character/i }).click(),
  ]);

  await fileChooser.setFiles({
    name: 'characters.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportSnapshot ?? '', 'utf-8'),
  });

  // After import, the sheet should open with the imported character
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
  const nameInput = page.locator('input[title="Character name"]');
  await expect(nameInput).toHaveValue('Importable E2E Hero');
});

test('creates and persists a Daggerheart scaffold character', async ({ page }) => {
  await createCharacterForSystem(page, /Daggerheart/i);
  await expect(page.getByText('Attributes')).toBeVisible();
  await renameCharacter(page, 'Hopebound E2E Hero');

  await page.getByRole('button', { name: /Add Experience/i }).click();
  await expect(page.locator('input[placeholder="Character Name"]')).toHaveValue(
    'Hopebound E2E Hero'
  );

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Hopebound E2E Hero')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Hopebound E2E Hero')).toBeVisible();
});
