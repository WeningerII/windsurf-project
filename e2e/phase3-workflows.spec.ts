import { Buffer } from 'node:buffer';
import { expect, test, type Page } from '@playwright/test';

async function selectSystemAndStartCreation(page: Page) {
  await page.getByRole('button', { name: /D&D 5e \(2024\)/i }).click();
  await page.getByRole('button', { name: /Create New Character/i }).click();
  await expect(page.getByText('Basic Information')).toBeVisible();
}

async function createCharacter(
  page: Page,
  {
    name,
    level = '1',
    selectClass = true,
    selectSpecies = true,
  }: {
    name: string;
    level?: string;
    selectClass?: boolean;
    selectSpecies?: boolean;
  }
) {
  await page.getByPlaceholder('Enter character name').fill(name);
  await page.getByRole('spinbutton').fill(level);

  await page.getByRole('button', { name: /^Next$/i }).click();
  if (selectClass) {
    const fighter = page.getByRole('button', { name: /fighter/i });
    await expect(fighter).toBeVisible({ timeout: 10000 });
    await fighter.click();
  }

  await page.getByRole('button', { name: /^Next$/i }).click();
  if (selectSpecies) {
    const human = page.getByRole('button', { name: /human/i });
    await expect(human).toBeVisible({ timeout: 10000 });
    await human.click();
  }

  for (let i = 0; i < 4; i += 1) {
    await page.getByRole('button', { name: /^Next$/i }).click();
  }
  await page.getByRole('button', { name: /Create Character/i }).click();
  await expect(page.getByText('Character Information')).toBeVisible();
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

test('creates a D&D 5e-2024 fighter and displays character sheet', async ({ page }) => {
  await selectSystemAndStartCreation(page);
  await createCharacter(page, { name: 'E2E Fighter', level: '3' });

  await expect(page.getByLabel('Character Name')).toHaveValue('E2E Fighter');
  await expect(page.getByLabel(/^Class$/)).toHaveValue('fighter');
  await expect(page.getByLabel('Species/Race')).toHaveValue('human');
});

test('persists created character after reload', async ({ page }) => {
  await selectSystemAndStartCreation(page);
  await createCharacter(page, { name: 'Persistent E2E Hero', selectClass: false, selectSpecies: false });

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Persistent E2E Hero')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Persistent E2E Hero')).toBeVisible();
});

test('clears all characters from Data Management', async ({ page }) => {
  await selectSystemAndStartCreation(page);
  await createCharacter(page, { name: 'Clearable E2E Hero', selectClass: false, selectSpecies: false });

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /Clear All Data/i }).click();

  await expect(page.getByText('All characters deleted successfully.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toHaveCount(0);
});

test('imports a character snapshot through the file input', async ({ page }) => {
  await selectSystemAndStartCreation(page);
  await createCharacter(page, { name: 'Importable E2E Hero', selectClass: false, selectSpecies: false });

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  const exportSnapshot = await page.evaluate(() => localStorage.getItem('rpg-characters'));
  expect(exportSnapshot).toBeTruthy();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /Clear All Data/i }).click();
  await expect(page.getByText('All characters deleted successfully.')).toBeVisible();

  await page.locator('input[aria-label="Import character file"]').setInputFiles({
    name: 'characters.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportSnapshot ?? '', 'utf-8'),
  });

  await expect(page.getByText('Character Information')).toBeVisible();
  await expect(page.getByLabel('Character Name')).toHaveValue('Importable E2E Hero');
});
