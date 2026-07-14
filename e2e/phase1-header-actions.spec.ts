import { expect, test, type Page } from '@playwright/test';

/**
 * Phase-1 acceptance gates (build-specs task 14) for the header actions:
 *   (b) with no sheet open, both 'New Character' and 'Import' are reachable
 *       in the header
 *   (f) Export + Delete are reachable AND functional from an open sheet via
 *       the '…' overflow menu — Delete (through its confirm dialog) lands
 *       back on the roster (the closeSheet state)
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

/**
 * Capture anchor-click downloads (the export path) without saving files —
 * a trimmed variant of the phase3-workflows capture that records only the
 * download attribute, since these gates assert the action fired, not payload.
 */
async function installDownloadCapture(page: Page) {
  await page.evaluate(() => {
    const downloadWindow = window as Window & {
      __capturedDownloads?: Array<{ href: string; download: string }>;
    };
    downloadWindow.__capturedDownloads = [];
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = ((tagName: string, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        const anchor = element as HTMLAnchorElement;
        const originalClick = anchor.click.bind(anchor);
        anchor.click = () => {
          downloadWindow.__capturedDownloads?.push({
            href: anchor.getAttribute('href') ?? '',
            download: anchor.getAttribute('download') ?? '',
          });
          originalClick();
        };
      }
      return element;
    }) as typeof document.createElement;
  });
}

test('New Character and Import are reachable with no sheet open', async ({ page }) => {
  // Gate (b): no sheet is open (no Back control), yet both primary actions
  // are live in the header.
  await expect(page.getByRole('button', { name: /^Back$/i })).toHaveCount(0);

  // Import is reachable: clicking it opens the hidden file input's chooser.
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Import Character/i }).click(),
  ]);
  expect(fileChooser).toBeTruthy();

  // New Character is reachable: it opens the system-picker dialog.
  await page.getByRole('button', { name: /New Character/i }).click();
  await expect(page.getByRole('button', { name: /D&D 5e \(2024\)/i })).toBeVisible();
});

test('Export and Delete are functional from the sheet header overflow', async ({ page }) => {
  await createCharacterForSystem(page);
  await renameCharacter(page, 'Overflow Hero');
  await installDownloadCapture(page);

  // Gate (f), Export: the '…' overflow emits the character's JSON download.
  await page.getByRole('button', { name: 'Character actions' }).click();
  await page.getByRole('menuitem', { name: 'Export character' }).click();
  await expect(page.getByText('Exported "Overflow Hero"')).toBeVisible();
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            (window as Window & { __capturedDownloads?: Array<{ download: string }> })
              .__capturedDownloads?.[0]?.download ?? null
        ),
      { message: 'expected the overflow Export action to create a download' }
    )
    .toBe('overflow_hero_character.json');

  // Gate (f), Delete: routes through the confirm dialog, then lands back on
  // the roster (the closeSheet state — the empty state again, since this was
  // the only character).
  await page.getByRole('button', { name: 'Character actions' }).click();
  await page.getByRole('menuitem', { name: 'Delete character' }).click();
  await expect(page.getByRole('heading', { name: 'Delete Character' })).toBeVisible();
  await page.getByRole('button', { name: /^Delete$/ }).click();
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Back$/i })).toHaveCount(0);
});
