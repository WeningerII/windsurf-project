import { expect, test } from '@playwright/test';

/**
 * Phase-1 acceptance gate (g) (build-specs task 14) — bundle/TTI: the lazy
 * SceneManager chunk must not be fetched on the Characters landing (or even
 * on the eager Scenes picker); it loads only on the first Scene-surface
 * visit. The positive half (creating a scene DOES fetch it) proves the
 * boot-time zero-request assertion is not vacuous.
 */

const SCENE_MANAGER_CHUNK = /\/assets\/SceneManager-[^/]+\.js/;

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
});

test('SceneManager chunk is fetched on first Scene visit, not at boot', async ({ page }) => {
  const sceneChunkUrls: string[] = [];
  page.on('request', (request) => {
    if (SCENE_MANAGER_CHUNK.test(request.url())) sceneChunkUrls.push(request.url());
  });

  // Re-boot with the listener attached (the beforeEach boot pre-dates it).
  await page.goto('/', { waitUntil: 'load' });
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();

  // Exercise the Characters landing — still no scene chunk.
  await page.getByRole('button', { name: /New Character/i }).click();
  await expect(page.getByRole('button', { name: /D&D 5e \(2024\)/i })).toBeVisible();
  await page.keyboard.press('Escape');
  expect(sceneChunkUrls).toEqual([]);

  // Even the Scenes picker (eager, part of the index chunk) renders without
  // pulling the canvas chunk — the picker → canvas split is real.
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await expect(page.getByText('0 scenes saved')).toBeVisible();
  expect(sceneChunkUrls).toEqual([]);

  // Creating a scene flips to the Scene surface: NOW the chunk is fetched.
  await page.getByRole('button', { name: 'New Scene' }).click();
  await page.getByPlaceholder('Scene name').fill('Chunk Probe');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('grid', { name: 'Chunk Probe grid' })).toBeVisible({
    timeout: 30_000,
  });
  expect(sceneChunkUrls.length).toBeGreaterThan(0);
});
