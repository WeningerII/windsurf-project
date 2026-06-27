import { expect, test, type Page } from '@playwright/test';

async function openLanding(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Choose a Game System')).toBeVisible();
}

// Launch-blocker LEGAL-1: file presence is explicitly insufficient — the legal
// notices must be reachable from the running app and the rendered DOM must
// actually contain the required open-content disclosures.
test.describe('legal & open-content notices', () => {
  test('are reachable from the footer and render every required disclosure', async ({ page }) => {
    await openLanding(page);

    // Reachable from a control present on every screen (the footer).
    await page.getByRole('button', { name: /Legal & Open-Content Notices/i }).click();
    await expect(
      page.getByRole('heading', { name: /Legal & Open-Content Notices/i })
    ).toBeVisible();

    // The verbatim OGL 1.0a body is actually in the DOM, not just on disk.
    await expect(page.getByText(/OPEN GAME LICENSE\s+Version 1\.0a/i).first()).toBeVisible();

    // OGL §15 chain of title (a Paizo line proves the chain is surfaced).
    await expect(
      page.getByText(/Pathfinder Roleplaying Game Core Rulebook/i).first()
    ).toBeVisible();

    // CC-BY attributions for BOTH D&D SRDs.
    await expect(page.getByText(/System Reference Document 5\.1/i).first()).toBeVisible();
    await expect(page.getByText(/System Reference Document 5\.2/i).first()).toBeVisible();

    // DPCGL notice (Daggerheart).
    await expect(page.getByText(/Darrington Press Community Gaming/i).first()).toBeVisible();

    // Honest M&M provenance flag must be visible, not buried.
    await expect(page.getByText(/Provenance under review/i).first()).toBeVisible();

    // Required disclaimers.
    await expect(page.getByText(/not affiliated with/i).first()).toBeVisible();
    await expect(page.getByText(/AI-generated content/i).first()).toBeVisible();

    // The view is dismissible back to the app.
    await page.getByRole('button', { name: /^Back$/i }).click();
    await expect(page.getByText('Choose a Game System')).toBeVisible();
  });
});
