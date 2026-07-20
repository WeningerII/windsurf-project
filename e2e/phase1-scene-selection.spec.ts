import { expect, test } from '@playwright/test';

/**
 * Phase-1 acceptance gates (build-specs task 14) unblocked by the
 * scene-selection lift + LibraryScenesView increment:
 *   (e) scene create-then-open lands on the live canvas
 *   (c) non-tautological selection: pick scene X in the picker → the canvas
 *       renders X's grid, and the picker round-trip keeps X selected
 *   (h) the Scene surface carries no LEFT list rail (picker artifacts absent)
 * The remaining gates (a/b/d/f/g) stay open with their tasks.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
});

/** Create a scene through the picker and wait for its live canvas grid. */
async function createScene(page: import('@playwright/test').Page, name: string) {
  await page.getByRole('button', { name: 'New Scene' }).click();
  await page.getByPlaceholder('Scene name').fill(name);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  // The canvas is a lazily-loaded chunk; a cold CI fetch+parse can be slow.
  await expect(page.getByRole('grid', { name: `${name} grid` })).toBeVisible({ timeout: 30_000 });
}

test('scene create-then-open lands on the canvas; picking round-trips selection', { tag: '@smoke' }, async ({
  page,
}) => {
  // The Scenes tab hosts the select-only picker.
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await expect(page.getByText('0 scenes saved')).toBeVisible();

  // Gate (e): creating flips to the Scene surface rendering the new grid.
  await createScene(page, 'Test Chamber');

  // Gate (h): no LEFT list rail on the canvas — the picker's artifacts
  // (create button, saved-count copy, campaign filter) are not on this surface.
  await expect(page.getByRole('button', { name: 'New Scene' })).toHaveCount(0);
  await expect(page.getByText(/scenes? saved/)).toHaveCount(0);

  // Second scene, so the selection assertion below is non-tautological.
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await createScene(page, 'Side Room');

  // Gate (c): pick the FIRST scene → the canvas renders that grid only.
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await expect(page.getByText('2 scenes saved')).toBeVisible();
  await page.getByRole('button', { name: /Test Chamber/ }).click();
  await expect(page.getByRole('grid', { name: 'Test Chamber grid' })).toBeVisible();
  await expect(page.getByRole('grid', { name: 'Side Room grid' })).toHaveCount(0);

  // Round trip: back on the picker, the selection persisted (selectedSceneId
  // lives in the shell nav, surfaced as the card's pressed state).
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await expect(page.getByRole('button', { name: /Test Chamber/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('button', { name: /Side Room/ })).toHaveAttribute(
    'aria-pressed',
    'false'
  );
});
