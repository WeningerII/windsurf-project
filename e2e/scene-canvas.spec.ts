import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * Phase-6 scene-canvas keystone acceptance (decision B6).
 *
 * CI-VERIFIED-ONLY, same shape as `e2e/scene-drag.spec.ts`: the canvas surface
 * ships behind `VITE_SCENE_CANVAS_ENABLED` (default OFF) and Vite folds the flag
 * at BUILD time, so a flag-off bundle tree-shakes `SceneCanvas` away entirely.
 * This spec therefore skips unless a job builds with the flag on and exports the
 * same env to the test process, which keeps the flag-off run — every other spec
 * in e2e/, all of which drive the DOM `SceneGridView` via `role="grid"` —
 * byte-unchanged.
 *
 * That job is `scene-canvas` in .github/workflows/ci.yml, and it asserts from
 * Playwright's JSON report that these tests were not SKIPPED. That assertion is
 * not ceremony: §6.8 of docs/WORK_PLAN.md records the Phase-4 sibling of this
 * spec sitting in the tree reporting green for months because no workflow set
 * its flag, and Playwright exits 0 on a fully skipped file.
 *
 * The two scene flags are mutually exclusive by construction — SceneManager
 * mounts the Phase-4 drop controller only when `sceneDragEnabled &&
 * !sceneCanvasEnabled` — so this job builds with the canvas flag alone and the
 * canvas's own click-to-place path is the placement route under test.
 *
 * KNOWN Phase-6 GAP, deliberately not asserted here: the canvas paints no
 * map-image layer, which the DOM grid does carry. That is one of the two reasons
 * the flag still defaults off (docs/WORK_PLAN.md §6.2), not a regression for this
 * spec to catch.
 */

const FLAG_ON = process.env.VITE_SCENE_CANVAS_ENABLED === 'true';

test.skip(!FLAG_ON, 'scene-canvas flag is off in this build (VITE_SCENE_CANVAS_ENABLED!=="true")');

/**
 * The grid this spec CREATES, typed into the New Scene form rather than
 * inherited from any default.
 *
 * An earlier revision pinned `DEFAULT_GRID` from src/scene/runtime.ts (24x18)
 * and commented that "a new scene is always this size". It is not:
 * `SceneCreateForm` prefills its own 12x10 and passes that, so every cell click
 * was aimed at a grid twice the real width and all four tests failed on the
 * aria-label. Setting the size explicitly makes the spec independent of BOTH
 * defaults — whichever one moves, this still addresses the grid it built.
 */
const GRID_COLS = 24;
const GRID_ROWS = 18;

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

async function createScene(page: Page, name: string) {
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await page.getByRole('button', { name: 'New Scene' }).click();
  await page.getByPlaceholder('Scene name').fill(name);
  await page.getByLabel('Scene width').fill(String(GRID_COLS));
  await page.getByLabel('Scene height').fill(String(GRID_ROWS));
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  // The scene surface is a lazily-loaded chunk; a cold CI fetch+parse can be slow.
  await expect(page.getByTestId('scene-canvas')).toBeVisible({ timeout: 30_000 });
}

/**
 * Click grid cell (x, y) on the canvas. Addressed as a FRACTION of the rendered
 * box rather than in backing-store pixels on purpose: `max-w-full` shrinks the
 * canvas to its column, and `pointToCell` rescales the click by the
 * element's on-screen size — so the fraction is exact at any layout width and a
 * hardcoded pixel offset would not be.
 */
async function clickCell(canvas: Locator, x: number, y: number) {
  const box = await canvas.boundingBox();
  if (!box) throw new Error('scene canvas has no bounding box');
  await canvas.click({
    position: {
      x: (box.width * (x + 0.5)) / GRID_COLS,
      y: (box.height * (y + 0.5)) / GRID_ROWS,
    },
  });
}

/** Author a manual token in the panel, arm placement mode, drop it on (x, y). */
async function placeToken(page: Page, name: string, x: number, y: number) {
  await page.getByLabel('Token name').fill(name);
  await page.getByRole('button', { name: 'Place Token' }).click();
  await clickCell(page.getByTestId('scene-canvas'), x, y);
}

test('the canvas replaces the DOM grid and describes the scene for assistive tech', async ({
  page,
}) => {
  await createScene(page, 'Canvas Room');

  // Mutual exclusion, canvas side: exactly one scene surface is mounted, and it
  // is not the DOM grid. (The Phase-4 spec asserts the same invariant from the
  // drag side.)
  await expect(page.getByRole('grid', { name: 'Canvas Room grid' })).toHaveCount(0);
  await expect(page.getByTestId('scene-canvas')).toHaveCount(1);

  // A canvas has no accessible sub-tree, so the whole scene is exposed through
  // one label — that label IS the accessibility story for this surface.
  const canvas = page.getByTestId('scene-canvas');
  await expect(canvas).toHaveAttribute('role', 'img');
  await expect(canvas).toHaveAttribute(
    'aria-label',
    `Canvas Room grid, ${GRID_COLS} by ${GRID_ROWS}, no tokens placed`
  );
  // Interactive (both callbacks are wired), so it is focusable.
  await expect(canvas).toHaveAttribute('tabindex', '0');

  // With no drop controller under this flag, click-to-place is the only
  // placement affordance — so the legacy button must still be presented.
  await expect(page.getByRole('button', { name: 'Place Token' })).toBeVisible();
});

test('placement mode turns a canvas cell click into a token in that cell', async ({ page }) => {
  await createScene(page, 'Placement Hall');

  await placeToken(page, 'Canvas Goblin', 3, 2);

  const canvas = page.getByTestId('scene-canvas');
  const oneToken = `Placement Hall grid, ${GRID_COLS} by ${GRID_ROWS}. Tokens: Canvas Goblin at 4, 3`;
  // Cell coordinates are 0-based in state and 1-based in the label.
  await expect(canvas).toHaveAttribute('aria-label', oneToken);

  // A successful placement CONSUMES the mode and clears the authored name, so a
  // second cell click is inert rather than dropping a second copy. Asserted by
  // clicking again instead of by reading the mode badge, because the badge is
  // just the mode's name and this is the behaviour that matters.
  await expect(page.getByLabel('Token name')).toHaveValue('');
  await clickCell(canvas, 5, 5);
  await expect(canvas).toHaveAttribute('aria-label', oneToken);
});

test('clicking a placed token selects it, and the next cell click moves that token', async ({
  page,
}) => {
  await createScene(page, 'Move Room');
  await placeToken(page, 'Canvas Goblin', 3, 2);

  const canvas = page.getByTestId('scene-canvas');

  // The canvas hit-test separates token from cell: a click on the occupied cell
  // selects rather than activating the cell, which is what enables deletion.
  await expect(page.getByRole('button', { name: 'Remove token' })).toBeDisabled();
  await clickCell(canvas, 3, 2);
  await expect(page.getByRole('button', { name: 'Remove token' })).toBeEnabled();

  // With a selection and no placement mode, an empty cell is a move — not a
  // second token. Asserting the WHOLE label pins both halves at once.
  await clickCell(canvas, 10, 7);
  await expect(canvas).toHaveAttribute(
    'aria-label',
    `Move Room grid, ${GRID_COLS} by ${GRID_ROWS}. Tokens: Canvas Goblin at 11, 8`
  );
});

test('the hit test covers the whole grid, including the far corner cell', async ({ page }) => {
  await createScene(page, 'Corner Vault');

  // The last cell is where an off-by-one in the pixel->cell arithmetic shows up:
  // it either lands one cell short or falls outside the grid and places nothing.
  await placeToken(page, 'Corner Sentry', GRID_COLS - 1, GRID_ROWS - 1);

  await expect(page.getByTestId('scene-canvas')).toHaveAttribute(
    'aria-label',
    `Corner Vault grid, ${GRID_COLS} by ${GRID_ROWS}. Tokens: Corner Sentry at ${GRID_COLS}, ${GRID_ROWS}`
  );
});
