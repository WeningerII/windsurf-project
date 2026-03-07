import { expect, test, type Page } from '@playwright/test';

async function openLandingPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Choose a Game System')).toBeVisible();
}

async function getCharacterNameInput(page: Page) {
  const titledInput = page.locator('input[title="Character name"]');
  return (await titledInput.count()) > 0
    ? titledInput.first()
    : page.getByPlaceholder('Character Name');
}

async function renameCharacter(page: Page, name: string) {
  const nameInput = await getCharacterNameInput(page);
  await nameInput.fill(name);
  await expect(nameInput).toHaveValue(name);
}

async function createCharacterForSystem(page: Page, systemPattern: RegExp, name: string) {
  await page.getByRole('button', { name: systemPattern }).click();
  await page.getByRole('button', { name: /Create New Character/i }).click();
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
  await renameCharacter(page, name);
}

async function backToCharacterList(page: Page) {
  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
}

async function clickTab(page: Page, name: string | RegExp) {
  const tab = page.getByRole('tab', { name });
  await expect(tab).toBeVisible();
  await tab.scrollIntoViewIfNeeded();
  await tab.evaluate((element: HTMLButtonElement) => element.click());
}

test.beforeEach(async ({ page }) => {
  await openLandingPage(page);
});

test('smokes D&D 5e 2014 content surfaces', async ({ page }) => {
  await createCharacterForSystem(page, /D&D 5e \(2014\)/i, 'Smoke 2014 Hero');

  await clickTab(page, /^Features$/i);
  await expect(page.getByRole('heading', { name: /Selected Feature Options/i })).toBeVisible();
  await expect(
    page.getByText(/Apply a compatible class or subclass template to browse the matching/i)
  ).toBeVisible();

  await clickTab(page, /^Spells$/i);
  await expect(
    page.getByText(/Select a spellcasting class to unlock spell slots and spell browsing/i)
  ).toBeVisible();

  await clickTab(page, /^Equipment$/i);
  await expect(page.getByPlaceholder('Search equipment...')).toBeVisible();

  await clickTab(page, /^Monsters$/i);
  await expect(page.getByLabel('Search monsters')).toBeVisible();

  await expect(page.getByText('Something went wrong')).toHaveCount(0);
});

test('smokes D&D 5e 2024 content surfaces', async ({ page }) => {
  await createCharacterForSystem(page, /D&D 5e \(2024\)/i, 'Smoke 2024 Hero');

  await clickTab(page, /^Feats$/i);
  await expect(
    page.getByText(/Feat automation applies ability score increases and proficiencies/i)
  ).toBeVisible();
  await expect(page.getByPlaceholder('Search feats by name or description...')).toBeVisible();

  await clickTab(page, /^Spells$/i);
  await expect(
    page.getByText(/Select a spellcasting class to unlock spell slots and spell browsing/i)
  ).toBeVisible();

  await clickTab(page, /^Equipment$/i);
  await expect(page.getByPlaceholder('Search equipment...')).toBeVisible();

  await clickTab(page, /^Monsters$/i);
  await expect(page.getByLabel('Search monsters')).toBeVisible();

  await expect(page.getByText('Something went wrong')).toHaveCount(0);
});

for (const systemName of ['D&D 3.5e', 'Pathfinder 1e'] as const) {
  test(`smokes ${systemName} legacy browsers`, async ({ page }) => {
    await createCharacterForSystem(page, new RegExp(systemName, 'i'), `${systemName} Smoke Hero`);

    await clickTab(page, /^Browse$/i);
    await expect(page.getByPlaceholder('Search feats by name or description...')).toBeVisible();

    await clickTab(page, /^Spells$/i);
    await expect(page.getByLabel('Search spells')).toBeVisible();

    await clickTab(page, /^Equipment$/i);
    await expect(page.getByPlaceholder('Search equipment...')).toBeVisible();

    await expect(page.getByText('Something went wrong')).toHaveCount(0);
  });
}

test('smokes Pathfinder 2e browsers', async ({ page }) => {
  await createCharacterForSystem(page, /Pathfinder 2e/i, 'PF2e Smoke Hero');

  await clickTab(page, /^Browse$/i);
  await expect(page.getByPlaceholder('Search feats by name or description...')).toBeVisible();

  await clickTab(page, /^Archetypes$/i);
  await expect(page.getByRole('heading', { name: /Available Archetypes/i })).toBeVisible();

  await clickTab(page, /^Spells$/i);
  await expect(page.getByLabel('Search spells')).toBeVisible();

  await clickTab(page, /^Equipment$/i);
  await expect(page.getByPlaceholder('Search equipment...')).toBeVisible();

  await expect(page.getByText('Something went wrong')).toHaveCount(0);
});

test('smokes Mutants & Masterminds 3e reference browsers', async ({ page }) => {
  await createCharacterForSystem(page, /Mutants & Masters?minds 3e|M&M 3e/i, 'M&M Smoke Hero');

  await clickTab(page, /^Archetypes$/i);
  await expect(page.getByLabel('Search archetypes')).toBeVisible();

  await clickTab(page, /^Powers DB$/i);
  await expect(page.getByLabel('Search spells')).toBeVisible();
  await expect(page.getByLabel('Search modifiers')).toBeVisible();

  await clickTab(page, /^Advantages DB$/i);
  await expect(page.getByRole('heading', { name: /SRD Advantages/i })).toBeVisible();

  await clickTab(page, /^Complications$/i);
  await expect(page.getByLabel('Search complications')).toBeVisible();

  await clickTab(page, /^Equipment$/i);
  await expect(page.getByPlaceholder('Search equipment...')).toBeVisible();

  await expect(page.getByText('Something went wrong')).toHaveCount(0);
});

test('manages campaign membership and opens members from the campaign panel', async ({ page }) => {
  await createCharacterForSystem(page, /D&D 5e \(2024\)/i, 'Campaign Vanguard');
  await backToCharacterList(page);

  await createCharacterForSystem(page, /Pathfinder 2e/i, 'Campaign Scholar');
  await backToCharacterList(page);

  const campaignSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Campaigns' }),
  });

  await campaignSection.getByRole('button', { name: /New Campaign/i }).click();
  await page.getByPlaceholder('Campaign name...').fill('System Smoke Campaign');
  await page.getByRole('button', { name: /^Create$/i }).click();

  await expect(campaignSection.getByText('System Smoke Campaign')).toBeVisible();
  await campaignSection.getByRole('button', { name: /Add Character/i }).click();
  await campaignSection.getByRole('button', { name: /Campaign Vanguard/i }).click();
  await campaignSection.getByRole('button', { name: /Campaign Scholar/i }).click();
  await campaignSection.getByRole('button', { name: /^Done$/i }).click();

  await expect(campaignSection.getByText(/2 members/i)).toBeVisible();

  await campaignSection
    .getByRole('button', { name: /Campaign Vanguard/i })
    .first()
    .click();
  const nameInput = await getCharacterNameInput(page);
  await expect(nameInput).toHaveValue('Campaign Vanguard');

  await backToCharacterList(page);
  await campaignSection.getByRole('button', { name: /System Smoke Campaign/i }).click();
  await page
    .getByPlaceholder('Session notes, house rules, quest tracker...')
    .fill('Campaign smoke note');
  await page.reload();

  await expect(page.getByText('System Smoke Campaign')).toBeVisible();
  await campaignSection.getByRole('button', { name: /System Smoke Campaign/i }).click();
  await expect(page.getByPlaceholder('Session notes, house rules, quest tracker...')).toHaveValue(
    'Campaign smoke note'
  );
});

test('supports undo, redo, and clone from the sheet header', async ({ page }) => {
  await createCharacterForSystem(page, /D&D 5e \(2024\)/i, 'Undo Hero');

  const nameInput = await getCharacterNameInput(page);
  await nameInput.press('End');
  await page.keyboard.type('!');
  await expect(nameInput).toHaveValue('Undo Hero!');

  await page.getByTitle('Undo (Ctrl+Z)').click();
  await expect(nameInput).toHaveValue('Undo Hero');

  await page.getByTitle('Redo (Ctrl+Shift+Z)').click();
  await expect(nameInput).toHaveValue('Undo Hero!');

  await page.getByTitle('Clone character').click();
  const clonedNameInput = await getCharacterNameInput(page);
  await expect(clonedNameInput).toHaveValue('Undo Hero! (Copy)');
  await expect(page.getByRole('heading', { name: 'Undo Hero! (Copy)' })).toBeVisible();

  await backToCharacterList(page);
  await expect(page.getByRole('heading', { name: /^Undo Hero!$/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Undo Hero! \(Copy\)$/ })).toBeVisible();
});
