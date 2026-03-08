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

async function installDownloadCapture(page: Page) {
  await page.evaluate(() => {
    if ((window as Window & { __downloadCaptureInstalled?: boolean }).__downloadCaptureInstalled) {
      (window as Window & { __capturedDownloads?: Array<{ href: string; download: string }> })
        .__capturedDownloads = [];
      return;
    }

    const downloadWindow = window as Window & {
      __capturedDownloads?: Array<{ href: string; download: string }>;
      __downloadCaptureInstalled?: boolean;
    };
    downloadWindow.__capturedDownloads = [];

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = ((tagName: string, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        const originalClick = element.click.bind(element);
        element.click = () => {
          downloadWindow.__capturedDownloads?.push({
            href: element.getAttribute('href') ?? '',
            download: element.getAttribute('download') ?? '',
          });
          originalClick();
        };
      }
      return element;
    }) as typeof document.createElement;

    downloadWindow.__downloadCaptureInstalled = true;
  });
}

async function waitForCapturedDownload(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const captured = (
            window as Window & {
              __capturedDownloads?: Array<{ href: string; download: string }>;
            }
          ).__capturedDownloads;
          return captured && captured.length > 0 ? captured[0] : null;
        }),
      {
        message: 'expected export action to create a downloadable payload',
      }
    )
    .not.toBeNull();

  return page.evaluate(() => {
    const captured = (
      window as Window & {
        __capturedDownloads?: Array<{ href: string; download: string }>;
      }
    ).__capturedDownloads;
    return captured?.[0] ?? null;
  });
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

test('persists dark mode across reloads', async ({ page }) => {
  const themeToggle = page.getByRole('button', { name: /Current theme:/i });

  await expect(themeToggle).toHaveAttribute('title', 'Theme: system');
  await themeToggle.click();
  await themeToggle.click();

  await expect(themeToggle).toHaveAttribute('title', 'Theme: dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('rpg-theme'))).toBe('dark');

  await page.reload();

  await expect(page.getByRole('button', { name: /Current theme: dark/i })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('roundtrips exported characters through clear-all and import', async ({ page }) => {
  await installDownloadCapture(page);

  await createCharacterForSystem(page);
  await renameCharacter(page, 'Roundtrip E2E Hero');

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();

  await page.getByRole('button', { name: /Export All Characters/i }).click();
  const capturedDownload = await waitForCapturedDownload(page);
  expect(capturedDownload?.download).toMatch(/^all_characters_\d{4}-\d{2}-\d{2}\.json$/);
  expect(capturedDownload?.href.startsWith('data:application/json;charset=utf-8,')).toBe(true);

  const exportedPayload = decodeURIComponent(capturedDownload?.href.split(',', 2)[1] ?? '');
  expect(exportedPayload).toContain('Roundtrip E2E Hero');

  await page.getByRole('button', { name: /Clear All Characters/i }).click();
  await expect(page.getByRole('heading', { name: /Delete All Characters/i })).toBeVisible();
  await page.getByRole('button', { name: /^Delete$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toHaveCount(0);

  await page.getByRole('button', { name: /D&D 5e \(2024\)/i }).click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Import Character/i }).click(),
  ]);

  await fileChooser.setFiles({
    name: 'exported-characters.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportedPayload, 'utf-8'),
  });

  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
  await expect(page.locator('input[title="Character name"]')).toHaveValue('Roundtrip E2E Hero');

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByText('Roundtrip E2E Hero')).toBeVisible();
});

test('shows a storage warning when saved data nears the browser limit', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem(
      'rpg-documents-v2',
      JSON.stringify({
        version: '2.0',
        documents: [
          {
            id: 'large-storage-doc',
            name: 'Large Storage Hero',
            systemId: 'dnd-5e-2024',
            system: {
              level: 1,
              __largePayload: 'x'.repeat(4_300_000),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        lastModified: new Date().toISOString(),
      })
    );
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText(/Storage usage is at/i)).toBeVisible();
  await expect(page.getByText('Large Storage Hero')).toBeVisible();
});
