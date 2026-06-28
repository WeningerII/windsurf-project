#!/usr/bin/env node
/**
 * measure-user-outcome.mjs — captures the per-system user-outcome baseline.
 *
 * Drives all 7 systems through quick-create and measures time-to-first-sheet
 * (landing -> rendered sheet), then writes docs/generated/user-outcome-baseline.json
 * with a generous initial floor per system. Floors are a reviewed ratchet — this
 * script SETS them from a measured run; tightening later is a deliberate edit.
 *
 * Requires a running preview server (default http://127.0.0.1:4173). Typical use:
 *     npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort &
 *     node scripts/measure-user-outcome.mjs
 *
 * Browser: uses Playwright's bundled chromium when present; otherwise falls back
 * to a detected chromium under PLAYWRIGHT_BROWSERS_PATH (handles version-pin
 * mismatches in sandboxed containers). Honest failure: if no browser launches,
 * it exits non-zero and leaves the committed baseline untouched.
 */
import { writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'docs/generated/user-outcome-baseline.json');
const BASE_URL = process.env.OUTCOME_BASE_URL ?? 'http://127.0.0.1:4173';

const SYSTEMS = [
  { id: 'dnd-5e-2014', label: 'D&D 5e (2014)', re: /D&D 5e \(2014\)/i },
  { id: 'dnd-5e-2024', label: 'D&D 5e (2024)', re: /D&D 5e \(2024\)/i },
  { id: 'dnd-35e', label: 'D&D 3.5e', re: /D&D 3\.5e/i },
  { id: 'pf1e', label: 'Pathfinder 1e', re: /Pathfinder 1e/i },
  { id: 'pf2e', label: 'Pathfinder 2e', re: /Pathfinder 2e/i },
  { id: 'mam3e', label: 'Mutants & Masterminds 3e', re: /Mutants & Masters?minds 3e|M&M 3e/i },
  { id: 'daggerheart', label: 'Daggerheart', re: /Daggerheart/i },
];

function detectChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
  if (!existsSync(base)) return undefined;
  for (const dir of readdirSync(base)) {
    if (!/^chromium(-|_)/.test(dir) && dir !== 'chromium') continue;
    for (const candidate of [
      join(base, dir, 'chrome-linux', 'chrome'),
      join(base, dir, 'chrome-linux64', 'chrome'),
    ]) {
      if (existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}

async function main() {
  const { chromium } = await import('@playwright/test');
  const launchOpts = { headless: true };
  const detected = detectChromium();
  // Prefer the bundled browser; fall back to a detected one on a pin mismatch.
  let browser;
  try {
    browser = await chromium.launch(launchOpts);
  } catch (err) {
    if (!detected) throw err;
    console.warn(`Bundled chromium failed to launch; using detected ${detected}`);
    browser = await chromium.launch({ ...launchOpts, executablePath: detected });
  }

  const results = {};
  const page = await browser.newPage({ baseURL: BASE_URL });
  for (const sys of SYSTEMS) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByText('Choose a Game System').waitFor({ state: 'visible' });

    const start = Date.now();
    await page.getByRole('button', { name: sys.re }).click();
    await page.getByRole('button', { name: /Create New Character/i }).click();
    await page.getByRole('button', { name: /^Back$/i }).waitFor({ state: 'visible' });
    const elapsed = Date.now() - start;

    // Generous initial floor: 3x the measured value, min 8s headroom for CI jitter.
    const floor = Math.max(Math.ceil((elapsed * 3) / 100) * 100, elapsed + 8000);
    results[sys.id] = { timeToFirstSheetMaxMs: floor, measuredMs: elapsed };
    console.log(`${sys.id}: measured ${elapsed}ms -> floor ${floor}ms`);
  }
  await browser.close();

  const baseline = {
    $generatedBy: 'scripts/measure-user-outcome.mjs',
    description:
      'Per-system user-outcome floors for e2e/user-outcome.spec.ts. All 7 systems are equal. timeToFirstSheetMaxMs is the upper bound (ms) for landing -> first rendered sheet via quick-create. Floors are a reviewed ratchet: tighten only with justification.',
    capturedAt: new Date().toISOString(),
    capturedEnv: `node ${process.version} / ${process.platform}`,
    systems: results,
  };
  writeFileSync(OUT, JSON.stringify(baseline, null, 2) + '\n');
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
