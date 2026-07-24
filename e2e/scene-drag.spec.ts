import { expect, test, type Page } from '@playwright/test';

/**
 * Phase-4 pointer-drag keystone acceptance (build-specs task 4, blast radius
 * `e2e/scene-drag.spec.ts`).
 *
 * CI-VERIFIED-ONLY: the drag machinery ships behind `VITE_SCENE_DRAG_ENABLED`
 * (default OFF), and the default e2e webServer builds WITHOUT it — so this spec
 * is skipped unless a dedicated CI job builds with the flag on and exports the
 * same env to the test process. That keeps the flag-off run (and the Phase-1
 * keepalive spec, which drives the legacy "Place Token" button) byte-unchanged,
 * while still pinning the flag-on acceptance. The drag ENGINE itself is fully
 * unit-tested (pointerEngine / useDropTarget / gateBudget) since Playwright is
 * unavailable in the authoring environment.
 */

const FLAG_ON = process.env.VITE_SCENE_DRAG_ENABLED === 'true';

test.skip(!FLAG_ON, 'scene-drag flag is off in this build (VITE_SCENE_DRAG_ENABLED!=="true")');

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

async function createScene(page: Page, name: string) {
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await page.getByRole('button', { name: 'New Scene' }).click();
  await page.getByPlaceholder('Scene name').fill(name);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('grid', { name: `${name} grid` })).toBeVisible({ timeout: 30_000 });
}

/** A greenfield pointer drag from an element's center to a target cell: press,
 *  move past the activation tolerance in steps, release. */
async function dragTo(
  page: Page,
  source: ReturnType<Page['locator']>,
  target: ReturnType<Page['locator']>
) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error('missing bounding box for drag');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  // Two intermediate moves so the gesture crosses its movement tolerance.
  await page.mouse.move(from.x + from.width / 2 + 12, from.y + from.height / 2 + 12, { steps: 4 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 8 });
  await page.mouse.up();
}

test('the mutual-exclusion invariant hides the legacy Place buttons under the flag', async ({
  page,
}) => {
  await createScene(page, 'Drag Room');
  // Exactly one character-placement affordance exists (the drag), so the legacy
  // click-to-place button is gone; the marker toggle is untouched.
  await expect(page.getByRole('button', { name: 'Place Token' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /place marker/i })).toBeVisible();
});

test('3b-ii: dragging a bestiary monster onto the grid resolves allegiance then lands a token', async ({
  page,
}) => {
  await createScene(page, 'Ambush');

  // Summon the Dock and open the Bestiary tab (browse-only, drag source).
  await page.getByRole('button', { name: 'Toggle toolkit dock' }).click();
  await page.getByRole('tab', { name: 'Bestiary' }).click();

  const firstMonster = page.getByLabel('Toolkit dock').locator('button.cursor-grab').first();
  await expect(firstMonster).toBeVisible({ timeout: 30_000 });

  const targetCell = page.getByRole('gridcell').first();
  await dragTo(page, firstMonster, targetCell);

  // 2+ outcomes → the friendly/hostile classifier chip appears before any emit.
  const chip = page.getByRole('dialog', { name: /Place / });
  await expect(chip).toBeVisible();
  await chip.getByRole('button', { name: 'Hostile' }).click();

  // The token landed on the grid (a token chip button now exists inside it).
  await expect(page.getByRole('grid', { name: 'Ambush grid' }).locator('button')).not.toHaveCount(
    0
  );
});
