import { expect, test } from '@playwright/test';

/**
 * Phase-1 acceptance gate (a) (build-specs task 14) — transient-state
 * survival: SceneManager's in-component state (placement mode, panel text)
 * must survive a Scene → Characters → Scene round-trip, because the mounted
 * canvas is kept alive (visibility:hidden + off-screen) rather than
 * unmounted. The switch duration is soft-logged from the shell's
 * performance.measure entries (useSurfaceSwitchMetrics) as an annotation —
 * no hard frame-budget number is asserted here; the Phase-7 budget must be
 * pinned from recorded baselines, not invented in a spec.
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

test('transient scene state survives a Characters round-trip via Alt+3', async ({ page }) => {
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await createScene(page, 'Keepalive Chamber');

  // Transient SceneManager state: type a token name into the panel (Place
  // Token is disabled for unnamed manual tokens), then enter placement mode
  // (the header badge echoes the mode).
  await page.getByLabel('Token name').fill('Keepalive Goblin');
  await page.getByRole('button', { name: 'Place Token' }).click();
  await expect(page.getByText('token', { exact: true })).toBeVisible();

  // Flip to the Characters segment — the canvas is hidden, not unmounted.
  await page.getByRole('button', { name: 'Characters', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
  await expect(page.getByRole('grid', { name: 'Keepalive Chamber grid' })).toBeHidden();

  // Alt+3 is the Scene surface shortcut (build-specs task 9).
  await page.keyboard.press('Alt+3');
  await expect(page.getByRole('grid', { name: 'Keepalive Chamber grid' })).toBeVisible();

  // The transient state survived the round-trip.
  await expect(page.getByText('token', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Token name')).toHaveValue('Keepalive Goblin');

  // Soft-log the switch latency from the shell's user-timing measures. The
  // library->scene measure existing also proves the instrumentation is live.
  const measures = await page.evaluate(() =>
    performance
      .getEntriesByType('measure')
      .filter((entry) => entry.name.startsWith('shell:surface-switch:'))
      .map((entry) => ({ name: entry.name, duration: entry.duration }))
  );
  expect(measures.some((measure) => measure.name === 'shell:surface-switch:library->scene')).toBe(
    true
  );
  for (const measure of measures) {
    test.info().annotations.push({
      type: 'surface-switch',
      description: `${measure.name}: ${measure.duration.toFixed(1)}ms`,
    });
  }
});
