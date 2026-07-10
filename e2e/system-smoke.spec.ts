import { expect, test, type Page } from '@playwright/test';

async function openLandingPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
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
  await page.getByRole('button', { name: /New Character/i }).click();
  await page.getByRole('button', { name: systemPattern }).click();
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
  await renameCharacter(page, name);
}

async function backToCharacterList(page: Page) {
  await page.getByRole('button', { name: /^Back$/i }).click();
  await expect(page.getByRole('heading', { name: 'Your Characters' })).toBeVisible();
}

async function gotoLibraryTab(page: Page, name: 'Characters' | 'Campaigns' | 'Scenes' | 'Library') {
  // Library segments (Characters / Campaigns / Scenes / Library) are now header
  // tabs; navigate to one before interacting with its content.
  await page.getByRole('button', { name, exact: true }).click();
}

async function clickTab(page: Page, name: string | RegExp) {
  // A real locator click (not element.click() inside evaluate) so Playwright
  // actionability checks apply — a tab hidden behind an overlay must fail
  // here instead of silently "working".
  await page.getByRole('tab', { name }).click();
}

async function expectRollResult(page: Page, buttonTitle: string | RegExp, formulaPattern: RegExp) {
  const rollButton = page.getByTitle(buttonTitle);
  await expect(rollButton).toBeVisible();
  await rollButton.click();
  await expect(rollButton.locator('xpath=..').getByText(formulaPattern)).toBeVisible();
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
    await expect(page.getByLabel('Search spells')).toBeVisible({ timeout: 10000 });

    await clickTab(page, /^Equipment$/i);
    await expect(page.getByPlaceholder('Search equipment...')).toBeVisible();

    await expect(page.getByText('Something went wrong')).toHaveCount(0);
  });
}

test('surfaces the full D&D 3.5e SRD prestige catalog in the shared add-class flow', async ({
  page,
}) => {
  await createCharacterForSystem(page, /D&D 3.5e/i, 'Prestige Smoke Hero');

  const addClassSelect = page.locator('select[title="Add class"]');
  await addClassSelect.focus();

  await expect(addClassSelect.locator('option').filter({ hasText: 'Arcane Archer' })).toHaveCount(
    1
  );
  await expect(addClassSelect.locator('option').filter({ hasText: 'Assassin' })).toHaveCount(1);
  await expect(addClassSelect.locator('option').filter({ hasText: 'Duelist' })).toHaveCount(1);
  await expect(addClassSelect.locator('option').filter({ hasText: 'Dragon Disciple' })).toHaveCount(
    1
  );
  await expect(addClassSelect.locator('option').filter({ hasText: 'Shadowdancer' })).toHaveCount(1);
  await expect(addClassSelect.locator('option').filter({ hasText: 'Horizon Walker' })).toHaveCount(
    1
  );
  await expect(
    addClassSelect.locator('option').filter({ hasText: 'Dwarven Defender' })
  ).toHaveCount(1);
  await expect(addClassSelect.locator('option').filter({ hasText: 'Archmage' })).toHaveCount(1);

  await addClassSelect.selectOption('dwarven-defender-35e');
  await page.locator('input[title="New class level"]').fill('3');
  await page.getByRole('button', { name: /^Add Class$/i }).click();

  await expect(page.locator('select[title="Class 1"]')).toHaveValue('dwarven-defender-35e');
  await expect(page.locator('input[title="dwarven-defender-35e level"]')).toHaveValue('3');
});

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
  await expect(page.getByLabel('Search archetypes')).toBeVisible({ timeout: 10000 });

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

test('supports in-sheet dice interactions across all registered system families', async ({
  page,
}) => {
  await createCharacterForSystem(page, /D&D 5e \(2014\)/i, '5e 2014 Roller');
  await clickTab(page, /^Saves$/i);
  await expectRollResult(page, 'Roll Strength Save', /\(1d20/);
  await backToCharacterList(page);

  await createCharacterForSystem(page, /D&D 5e \(2024\)/i, '5e 2024 Roller');
  await clickTab(page, /^Skills$/i);
  await expectRollResult(page, 'Roll Acrobatics Check', /\(1d20/);
  await backToCharacterList(page);

  await createCharacterForSystem(page, /D&D 3.5e/i, '3.5e Roller');
  await expectRollResult(page, 'Roll Attack Roll', /\(1d20/);
  await backToCharacterList(page);

  await createCharacterForSystem(page, /Pathfinder 1e/i, 'PF1e Roller');
  await expectRollResult(page, 'Roll Attack Roll', /\(1d20/);
  await backToCharacterList(page);

  await createCharacterForSystem(page, /Pathfinder 2e/i, 'PF2e Roller');
  await expectRollResult(page, 'Roll Perception', /\(1d20/);
  await backToCharacterList(page);

  await createCharacterForSystem(page, /Mutants & Masters?minds 3e|M&M 3e/i, 'M&M Roller');
  await clickTab(page, /^Skills$/i);
  await expectRollResult(page, 'Roll Perception Check', /\(1d20/);
  await backToCharacterList(page);

  await createCharacterForSystem(page, /Daggerheart/i, 'Daggerheart Roller');
  await expectRollResult(page, 'Roll Agility', /\(2d12/);
  await expect(page.getByText(/with Hope|with Fear|Critical!/i)).toBeVisible();
});

test('manages campaign membership and opens members from the campaign panel', async ({ page }) => {
  await createCharacterForSystem(page, /D&D 5e \(2024\)/i, 'Campaign Vanguard');
  await backToCharacterList(page);

  await createCharacterForSystem(page, /Pathfinder 2e/i, 'Campaign Scholar');
  await backToCharacterList(page);

  await gotoLibraryTab(page, 'Campaigns');
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
  await gotoLibraryTab(page, 'Campaigns');
  await campaignSection.getByRole('button', { name: /System Smoke Campaign/i }).click();
  await page.getByPlaceholder('House rules, NPC names, loot...').fill('Campaign smoke note');
  await page.reload();

  await gotoLibraryTab(page, 'Campaigns');
  await expect(page.getByText('System Smoke Campaign')).toBeVisible();
  await campaignSection.getByRole('button', { name: /System Smoke Campaign/i }).click();
  await expect(page.getByPlaceholder('House rules, NPC names, loot...')).toHaveValue(
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
