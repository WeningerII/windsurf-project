/**
 * User-outcome harness (Phase 0 instrument).
 *
 * Per the Engineering-Corp plan's "user-outcome floor": for ALL 7 systems
 * (no flagship — every system is equal), a fresh user must be able to create a
 * legal, non-trivial character and reach a usable sheet quickly. This spec
 * measures two outcomes per system:
 *   1. time-to-first-sheet  — ms from a cleared landing page to the rendered sheet
 *   2. legality             — the sheet renders with no error boundary and no
 *                             blocking validation issue
 *
 * The committed per-system floors live in
 * docs/generated/user-outcome-baseline.json (captured by
 * scripts/measure-user-outcome.mjs). A floor of null means "not yet captured" —
 * the test still records the measurement and asserts legality, but does not gate
 * on a timing it has never measured (an unset floor must not be a silent pass on
 * a regression, nor a false failure). Tightening a floor is a reviewed ratchet.
 */
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = path.resolve(__dirname, '../docs/generated/user-outcome-baseline.json');

interface SystemFloor {
  /** Upper-bound floor in ms for time-to-first-sheet; null = not yet captured. */
  timeToFirstSheetMaxMs: number | null;
}
interface Baseline {
  systems: Record<string, SystemFloor>;
}

function loadBaseline(): Baseline {
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;
  } catch {
    return { systems: {} };
  }
}

// Every registered system + the landing-page button pattern that opens it. All 7
// are treated equally — this list is the user-outcome contract.
const SYSTEMS: Array<{ id: string; label: string; pattern: RegExp }> = [
  { id: 'dnd-5e-2014', label: 'D&D 5e (2014)', pattern: /D&D 5e \(2014\)/i },
  { id: 'dnd-5e-2024', label: 'D&D 5e (2024)', pattern: /D&D 5e \(2024\)/i },
  { id: 'dnd-35e', label: 'D&D 3.5e', pattern: /D&D 3\.5e/i },
  { id: 'pf1e', label: 'Pathfinder 1e', pattern: /Pathfinder 1e/i },
  { id: 'pf2e', label: 'Pathfinder 2e', pattern: /Pathfinder 2e/i },
  { id: 'mam3e', label: 'Mutants & Masterminds 3e', pattern: /Mutants & Masters?minds 3e|M&M 3e/i },
  { id: 'daggerheart', label: 'Daggerheart', pattern: /Daggerheart/i },
];

async function openLandingPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Choose a Game System')).toBeVisible();
}

const baseline = loadBaseline();

for (const system of SYSTEMS) {
  test(`user-outcome: ${system.label} — fast, legal first sheet`, async ({ page }, testInfo) => {
    await openLandingPage(page);

    const start = Date.now();
    await page.getByRole('button', { name: system.pattern }).click();
    await page.getByRole('button', { name: /Create New Character/i }).click();
    // The sheet is reached when its Back affordance is visible.
    await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
    const elapsed = Date.now() - start;

    // Legality: no error boundary, no blocking validation banner.
    await expect(page.getByText('Something went wrong')).toHaveCount(0);
    await expect(page.getByText(/Failed to load|Unable to render/i)).toHaveCount(0);

    testInfo.annotations.push({
      type: 'time-to-first-sheet-ms',
      description: `${system.id}=${elapsed}`,
    });

    const floor = baseline.systems[system.id]?.timeToFirstSheetMaxMs ?? null;
    if (floor !== null) {
      expect(
        elapsed,
        `${system.label} time-to-first-sheet ${elapsed}ms exceeded floor ${floor}ms`
      ).toBeLessThanOrEqual(floor);
    } else {
      // Not yet captured — record only. Surfaced in the report, never a silent pass.
      console.log(`[user-outcome] ${system.id}: time-to-first-sheet=${elapsed}ms (no floor set)`);
    }
  });
}
