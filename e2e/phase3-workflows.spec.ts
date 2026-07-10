import { Buffer } from 'node:buffer';
import { expect, test, type Page } from '@playwright/test';
import { createDefaultDnd5e2024Data } from '../src/systems/dnd5e-2024/data-model';

// Character-creation/persistence flows, not the PWA layer. Blocking the service
// worker keeps its cold-context install from racing the lazy sheet-chunk fetch
// (the source of intermittent >15s mount stalls on cold firefox CI runners). SW
// behavior is covered by e2e/pwa-offline.spec.ts and e2e/pwa-install.spec.ts.
test.use({ serviceWorkers: 'block' });

/**
 * Open the New Character dialog and pick a system (which creates immediately).
 * The current UI flow: click "New Character" → dialog → click a system card.
 * This opens the character sheet directly (no wizard).
 */
async function createCharacterForSystem(page: Page, systemPattern: RegExp = /D&D 5e \(2024\)/i) {
  await page.getByRole('button', { name: /New Character/i }).click();
  await page.getByRole('button', { name: systemPattern }).click();
  // Sheet opens — the header shows "New Character" and the Back button.
  // Lazy sheet chunks can exceed the default 5s on a cold CI runner.
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible({ timeout: 15_000 });
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
    type CapturedDownload = { href: string; download: string };
    const downloadWindow = window as Window & {
      __capturedDownloads?: Array<CapturedDownload>;
      __blobText?: Record<string, string>;
      __downloadCaptureInstalled?: boolean;
    };

    if (downloadWindow.__downloadCaptureInstalled) {
      downloadWindow.__capturedDownloads = [];
      return;
    }
    downloadWindow.__capturedDownloads = [];
    downloadWindow.__blobText = {};

    // Exports now use Blob object URLs; capture the payload by reading the Blob
    // before the app revokes its URL (the Blob reference outlives revocation).
    const originalCreateObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = ((object: Blob | MediaSource) => {
      const url = originalCreateObjectURL(object as Blob);
      if (object instanceof Blob) {
        void object
          .text()
          .then((text) => {
            (downloadWindow.__blobText ??= {})[url] = text;
          })
          .catch(() => {
            (downloadWindow.__blobText ??= {})[url] = '';
          });
      }
      return url;
    }) as typeof URL.createObjectURL;

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

    downloadWindow.__downloadCaptureInstalled = true;
  });
}

async function waitForCapturedDownload(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const downloadWindow = window as Window & {
            __capturedDownloads?: Array<{ href: string; download: string }>;
            __blobText?: Record<string, string>;
          };
          const captured = downloadWindow.__capturedDownloads?.[0];
          if (!captured) return false;
          // For blob: downloads, wait until the Blob payload has been read.
          if (captured.href.startsWith('blob:')) {
            return downloadWindow.__blobText?.[captured.href] != null;
          }
          return true;
        }),
      {
        message: 'expected export action to create a downloadable payload',
      }
    )
    .toBe(true);

  return page.evaluate(() => {
    const downloadWindow = window as Window & {
      __capturedDownloads?: Array<{ href: string; download: string }>;
      __blobText?: Record<string, string>;
    };
    const captured = downloadWindow.__capturedDownloads?.[0];
    if (!captured) return null;
    let content = '';
    if (captured.href.startsWith('blob:')) {
      content = downloadWindow.__blobText?.[captured.href] ?? '';
    } else if (captured.href.startsWith('data:')) {
      content = decodeURIComponent(captured.href.split(',', 2)[1] ?? '');
    }
    return { href: captured.href, download: captured.download, content };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
});

test('offers system choices in the New Character dialog', async ({ page }) => {
  // Creation is dialog-first: the landing shows the empty roster, and the
  // system choices live inside the New Character dialog.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
  await page.getByRole('button', { name: /New Character/i }).click();
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

  // The header's Import button (always available in list mode) triggers a
  // hidden file input via JS; intercept the file chooser to supply our file.
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

test('creates and persists a Daggerheart SRD-backed character', async ({ page }) => {
  await createCharacterForSystem(page, /Daggerheart/i);
  await expect(page.getByText('Attributes')).toBeVisible();
  await renameCharacter(page, 'Hopebound E2E Hero');

  await page.locator('select[title="Class"]').selectOption('Bard');
  await page.locator('select[title="Subclass"]').selectOption('Troubadour');
  await page.locator('select[title="Ancestry"]').selectOption('Human');
  await page.locator('select[title="Community"]').selectOption('Wanderborne');

  await expect(page.getByText('Domains: Grace / Codex')).toBeVisible();
  await expect(page.getByText('SRD start: Evasion 10, HP 5')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Troubadour' })).toBeVisible();
  await expect(page.getByText(/High Stamina\./i)).toBeVisible();
  await expect(page.getByText(/Nomadic Pack\./i)).toBeVisible();
  await expect(page.locator('input[title="Current HP"]')).toHaveValue('5');
  await expect(page.locator('input[value="A romance novel"]')).toBeVisible();
  await expect(page.locator('input[value="Nomadic Pack"]')).toBeVisible();

  await page.getByRole('tab', { name: 'Primary Library' }).click();
  const broadswordCard = page.locator('article').filter({ has: page.getByText('Broadsword') });
  await broadswordCard.getByRole('button', { name: 'Equip Primary' }).click();

  await page.getByRole('tab', { name: 'Secondary Library' }).click();
  const roundShieldCard = page.locator('article').filter({ has: page.getByText('Round Shield') });
  await roundShieldCard.getByRole('button', { name: 'Equip Secondary' }).click();

  await page.getByRole('tab', { name: 'Armor Library' }).click();
  const chainmailCard = page.locator('article').filter({ has: page.getByText('Chainmail Armor') });
  await chainmailCard.getByRole('button', { name: 'Equip Armor' }).click();
  await expect(page.getByText('Burden 2/2')).toBeVisible();
  await expect(page.getByText('Chainmail Armor').first()).toBeVisible();

  await page.getByRole('tab', { name: 'Card Library' }).click();
  const inspirationalWordsCard = page.locator('article').filter({
    has: page.getByText('Inspirational Words'),
  });
  await inspirationalWordsCard.getByRole('button', { name: 'Add to Loadout' }).click();
  await page.getByRole('tab', { name: 'Loadout' }).click();
  await expect(page.getByText('Inspirational Words')).toBeVisible();
  await expect(page.getByText('Loadout 1/5')).toBeVisible();

  await page.getByRole('tab', { name: 'Loot Library' }).click();
  const relicCard = page.locator('article').filter({ has: page.getByText('Stride Relic') });
  await relicCard.getByRole('button', { name: 'Add to Inventory' }).click();

  await page.getByRole('tab', { name: 'Consumables' }).click();
  const potionCard = page.locator('article').filter({ has: page.getByText('Minor Health Potion') });
  await potionCard.getByRole('button', { name: 'Add to Inventory' }).click();
  await potionCard.getByRole('button', { name: 'Add Another' }).click();

  await page.getByRole('tab', { name: 'Inventory' }).click();
  await expect(page.getByText('Stride Relic')).toBeVisible();
  await expect(page.getByText('Minor Health Potion')).toBeVisible();
  await page.getByRole('button', { name: 'Use One' }).click();
  await expect(page.locator('input[title="Handfuls"]')).toHaveValue('0');
  await page.locator('input[title="Handfuls"]').fill('10');
  await expect(page.getByText('Gold 0H / 1B / 0C')).toBeVisible();

  await expect(page.locator('input[placeholder="Character Name"]')).toHaveValue(
    'Hopebound E2E Hero'
  );

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Hopebound E2E Hero')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
  await expect(page.getByText('Hopebound E2E Hero')).toBeVisible();
  await page
    .locator('button')
    .filter({ has: page.getByRole('heading', { name: 'Hopebound E2E Hero' }) })
    .first()
    .click();
  await expect(page.locator('select[title="Class"]')).toHaveValue('Bard');
  await expect(page.locator('select[title="Subclass"]')).toHaveValue('Troubadour');
  await expect(page.locator('select[title="Ancestry"]')).toHaveValue('Human');
  await expect(page.locator('select[title="Community"]')).toHaveValue('Wanderborne');
  await expect(page.locator('input[title="Current HP"]')).toHaveValue('5');
  await expect(page.locator('input[value="A romance novel"]')).toBeVisible();
  await expect(page.locator('input[value="Nomadic Pack"]')).toBeVisible();
  await expect(page.getByText('Stride Relic')).toBeVisible();
  await expect(page.getByText('Minor Health Potion')).toBeVisible();
  await expect(page.getByText('Gold 0H / 1B / 0C')).toBeVisible();
  await expect(page.getByText('Broadsword').first()).toBeVisible();
  await expect(page.getByText('Round Shield').first()).toBeVisible();
  await expect(page.getByText('Chainmail Armor').first()).toBeVisible();
  await expect(page.getByText('Inspirational Words')).toBeVisible();
  await expect(page.getByText('Loadout 1/5')).toBeVisible();
});

test('browses Daggerheart SRD libraries and applies entries from the tabs', async ({ page }) => {
  await createCharacterForSystem(page, /Daggerheart/i);

  await page.getByRole('tab', { name: 'Class Library' }).click();
  await expect(page.getByText('Reference Library')).toBeVisible();
  await page.getByRole('button', { name: 'Apply Bard' }).click();

  await page.getByRole('tab', { name: 'Ancestry Library' }).click();
  await page.getByRole('button', { name: 'Apply Human' }).click();

  await page.getByRole('tab', { name: 'Community Library' }).click();
  await page.getByRole('button', { name: 'Apply Wanderborne' }).click();

  await expect(page.locator('select[title="Class"]')).toHaveValue('Bard');
  await expect(page.locator('select[title="Ancestry"]')).toHaveValue('Human');
  await expect(page.locator('select[title="Community"]')).toHaveValue('Wanderborne');
  await expect(page.locator('input[title="Current HP"]')).toHaveValue('5');
  await expect(page.locator('input[value="A romance novel"]')).toBeVisible();
  await expect(page.locator('input[value="Nomadic Pack"]')).toBeVisible();
  await expect(page.getByText(/Nomadic Pack\./i).first()).toBeVisible();

  await page.getByRole('tab', { name: 'Loot Library' }).click();
  await expect(page.getByText('Infinite Bag')).toBeVisible();
  await page.getByRole('tab', { name: 'Consumables' }).click();
  await expect(
    page.locator('article').filter({
      has: page.getByRole('heading', { name: 'Health Potion', exact: true }),
    })
  ).toBeVisible();

  await page.getByRole('tab', { name: 'Primary Library' }).click();
  const broadswordCard = page.locator('article').filter({ has: page.getByText('Broadsword') });
  await broadswordCard.getByRole('button', { name: 'Equip Primary' }).click();

  await page.getByRole('tab', { name: 'Secondary Library' }).click();
  const handCrossbowCard = page.locator('article').filter({ has: page.getByText('Hand Crossbow') });
  await handCrossbowCard.getByRole('button', { name: 'Stow Weapon' }).click();
  await expect(page.getByText('Stowed 1/2')).toBeVisible();
  await expect(page.getByText('Hand Crossbow').first()).toBeVisible();

  await page.getByRole('tab', { name: 'Armor Library' }).click();
  const chainmailCard = page.locator('article').filter({ has: page.getByText('Chainmail Armor') });
  await chainmailCard.getByRole('button', { name: 'Equip Armor' }).click();
  await expect(page.getByText('Chainmail Armor').first()).toBeVisible();

  await page.getByRole('tab', { name: 'Card Library' }).click();
  const bookOfAvaCard = page.locator('article').filter({ has: page.getByText('Book of Ava') });
  await bookOfAvaCard.getByRole('button', { name: 'Add to Vault' }).click();
  await page.getByRole('tab', { name: 'Vault' }).click();
  await expect(page.getByText('Book of Ava')).toBeVisible();
  await expect(page.getByText('Vault 1')).toBeVisible();
});

test('roundtrips a Daggerheart character with loadout, vault, and inventory state', async ({
  page,
}) => {
  await installDownloadCapture(page);
  await createCharacterForSystem(page, /Daggerheart/i);
  await renameCharacter(page, 'Roundtrip Hopebound');

  await page.locator('select[title="Class"]').selectOption('Bard');
  await page.locator('select[title="Subclass"]').selectOption('Troubadour');
  await page.locator('select[title="Ancestry"]').selectOption('Human');
  await page.locator('select[title="Community"]').selectOption('Wanderborne');

  await page.getByRole('tab', { name: 'Card Library' }).click();
  await page
    .locator('article')
    .filter({ has: page.getByText('Inspirational Words') })
    .getByRole('button', { name: 'Add to Loadout' })
    .click();
  await page
    .locator('article')
    .filter({ has: page.getByText('Book of Ava') })
    .getByRole('button', { name: 'Add to Vault' })
    .click();

  await page.getByRole('tab', { name: 'Loot Library' }).click();
  await page
    .locator('article')
    .filter({ has: page.getByText('Stride Relic') })
    .getByRole('button', { name: 'Add to Inventory' })
    .click();

  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByText('Roundtrip Hopebound')).toBeVisible();

  await page.getByRole('button', { name: /Export All Characters/i }).click();
  const capturedDownload = await waitForCapturedDownload(page);
  const exportedPayload = capturedDownload?.content ?? '';

  await page.getByRole('button', { name: /Clear All Characters/i }).click();
  await page.getByRole('button', { name: /^Delete$/i }).click();
  await expect(page.getByText('Roundtrip Hopebound')).toHaveCount(0);

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Import Character/i }).click(),
  ]);

  await fileChooser.setFiles({
    name: 'daggerheart-roundtrip.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportedPayload, 'utf-8'),
  });

  await expect(page.getByPlaceholder('Character Name')).toHaveValue('Roundtrip Hopebound');
  await expect(page.locator('select[title="Class"]')).toHaveValue('Bard');
  await expect(page.locator('select[title="Subclass"]')).toHaveValue('Troubadour');

  await page.getByRole('tab', { name: 'Loadout' }).click();
  await expect(page.getByText('Inspirational Words')).toBeVisible();

  await page.getByRole('tab', { name: 'Vault' }).click();
  await expect(page.getByText('Book of Ava')).toBeVisible();

  await page.getByRole('tab', { name: 'Inventory' }).click();
  await expect(page.getByText('Stride Relic')).toBeVisible();
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
  expect(capturedDownload?.href).toMatch(/^(blob:|data:application\/json)/);

  const exportedPayload = capturedDownload?.content ?? '';
  expect(exportedPayload).toContain('Roundtrip E2E Hero');

  await page.getByRole('button', { name: /Clear All Characters/i }).click();
  await expect(page.getByRole('heading', { name: /Delete All Characters/i })).toBeVisible();
  await page.getByRole('button', { name: /^Delete$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toHaveCount(0);

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
  const oversizedSystem = {
    ...createDefaultDnd5e2024Data(),
    __largePayload: 'x'.repeat(4_300_000),
  };

  await page.evaluate((system) => {
    localStorage.setItem(
      'rpg-documents-v2',
      JSON.stringify({
        version: '2.0',
        documents: [
          {
            id: 'large-storage-doc',
            name: 'Large Storage Hero',
            systemId: 'dnd-5e-2024',
            system,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        lastModified: new Date().toISOString(),
      })
    );
  }, oversizedSystem);

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText(/Storage usage is at/i)).toBeVisible();
  await expect(page.getByText('Large Storage Hero')).toBeVisible();
});
