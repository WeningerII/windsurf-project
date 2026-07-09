import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test, type Page } from '@playwright/test';

/**
 * User-outcome baseline harness (ORCH-14 / PROD-10, Launch-Blocker item 3).
 *
 * Per the D-equal decision, all 7 systems are measured EQUALLY: for each, a fresh
 * user builds a NON-TRIVIAL, LEGAL character entirely through real UI controls,
 * and we record X (interaction steps + wall-time) and Y (did it reach a coherent,
 * error-free sheet whose core derived roll computes a valid formula).
 *
 * There is no guided-creation wizard and no per-character "is legal" validation
 * surface in this app, so legality is read operationally: a non-default build
 * (class/level/power-level raised through the UI) PLUS the proven coherence
 * signals from e2e/system-smoke.spec.ts — no "Something went wrong", and a core
 * derived roll yields a valid dice formula.
 *
 * The exact per-run timings land in the gitignored e2e/outcome/last-run.json; the
 * committed e2e/outcome/baseline.json is the per-system floor this run measured.
 */

const OUTCOME_DIR = path.join(process.cwd(), 'e2e/outcome');

interface SystemOutcome {
  systemId: string;
  nonTrivial: string;
  steps: number;
  ms: number;
  legal: boolean;
  error: string | null;
}

type RunFn = (page: Page, tick: () => void) => Promise<void>;

async function resetToLanding(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Your Characters')).toBeVisible();
}

async function createCharacter(
  page: Page,
  systemPattern: RegExp,
  name: string,
  tick: () => void
): Promise<void> {
  await page.getByRole('button', { name: /New Character/i }).click();
  tick();
  await page.getByRole('button', { name: systemPattern }).click();
  tick();
  await expect(page.getByRole('button', { name: /^Back$/i })).toBeVisible();
  const titledInput = page.locator('input[title="Character name"]');
  const nameInput =
    (await titledInput.count()) > 0 ? titledInput.first() : page.getByPlaceholder('Character Name');
  await nameInput.fill(name);
  tick();
}

/** The shared d20 "Add class at level N" flow (5e-2014/2024, 3.5e, PF1e). */
async function addD20Class(
  page: Page,
  classId: string,
  level: string,
  tick: () => void
): Promise<void> {
  await page.locator('select[title="Add class"]').selectOption(classId);
  tick();
  await page.locator('input[title="New class level"]').fill(level);
  tick();
  await page.getByRole('button', { name: /^Add Class$/i }).click();
  tick();
}

async function clickTab(page: Page, name: RegExp): Promise<void> {
  await page.getByRole('tab', { name }).click();
}

async function exerciseRoll(page: Page, title: string, formula: RegExp): Promise<void> {
  const rollButton = page.getByTitle(title);
  await expect(rollButton).toBeVisible();
  await rollButton.click();
  await expect(rollButton.locator('xpath=..').getByText(formula)).toBeVisible();
}

async function assertNoErrorState(page: Page): Promise<void> {
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
}

const SYSTEMS: Array<{ id: string; nonTrivial: string; run: RunFn }> = [
  {
    id: 'dnd-5e-2014',
    nonTrivial: 'Fighter (Champion) at total level 5; Strength save roll',
    run: async (page, tick) => {
      await createCharacter(page, /D&D 5e \(2014\)/i, 'Outcome 2014 Fighter', tick);
      await addD20Class(page, 'fighter', '5', tick);
      await expect(page.locator('select[title="Class 1"]')).toHaveValue('fighter');
      await expect(page.locator('input[title="fighter level"]')).toHaveValue('5');
      const subclass = page.locator('select[title="fighter subclass"]');
      if ((await subclass.count()) > 0) {
        await subclass.selectOption('champion');
        tick();
      }
      await clickTab(page, /^Saves$/i);
      await exerciseRoll(page, 'Roll Strength Save', /\(1d20/);
      tick();
      await assertNoErrorState(page);
    },
  },
  {
    id: 'dnd-5e-2024',
    nonTrivial: 'Fighter at total level 5; Acrobatics check roll',
    run: async (page, tick) => {
      await createCharacter(page, /D&D 5e \(2024\)/i, 'Outcome 2024 Fighter', tick);
      await addD20Class(page, 'fighter', '5', tick);
      await expect(page.locator('select[title="Class 1"]')).toHaveValue('fighter');
      await expect(page.locator('input[title="fighter level"]')).toHaveValue('5');
      await clickTab(page, /^Skills$/i);
      await exerciseRoll(page, 'Roll Acrobatics Check', /\(1d20/);
      tick();
      await assertNoErrorState(page);
    },
  },
  {
    id: 'dnd-3.5e',
    nonTrivial: 'Fighter 5 (full BAB +5); Attack roll',
    run: async (page, tick) => {
      await createCharacter(page, /D&D 3.5e/i, 'Outcome 3.5e Fighter', tick);
      await addD20Class(page, 'fighter', '5', tick);
      await expect(page.locator('select[title="Class 1"]')).toHaveValue('fighter');
      await expect(page.locator('input[title="fighter level"]')).toHaveValue('5');
      await exerciseRoll(page, 'Roll Attack Roll', /\(1d20/);
      tick();
      await assertNoErrorState(page);
    },
  },
  {
    id: 'pf1e',
    nonTrivial: 'Fighter 5 (full BAB +5); Attack roll',
    run: async (page, tick) => {
      await createCharacter(page, /Pathfinder 1e/i, 'Outcome PF1e Fighter', tick);
      await addD20Class(page, 'fighter', '5', tick);
      await expect(page.locator('select[title="Class 1"]')).toHaveValue('fighter');
      await expect(page.locator('input[title="fighter level"]')).toHaveValue('5');
      await exerciseRoll(page, 'Roll Attack Roll', /\(1d20/);
      tick();
      await assertNoErrorState(page);
    },
  },
  {
    id: 'pf2e',
    nonTrivial: 'Level-5 Fighter (key ability + Class DC wired); Perception roll',
    run: async (page, tick) => {
      await createCharacter(page, /Pathfinder 2e/i, 'Outcome PF2e Fighter', tick);
      await page.locator('input[title="Character level"]').fill('5');
      tick();
      await expect(page.locator('input[title="Character level"]')).toHaveValue('5');
      await page.locator('select[title="Class"]').selectOption('fighter');
      tick();
      await exerciseRoll(page, 'Roll Perception', /\(1d20/);
      tick();
      await assertNoErrorState(page);
    },
  },
  {
    id: 'mam3e',
    nonTrivial: 'Power Level 12 superhero; Perception check roll',
    run: async (page, tick) => {
      await createCharacter(page, /Mutants & Masters?minds 3e|M&M 3e/i, 'Outcome M&M Hero', tick);
      await page.locator('input[title="Power level"]').fill('12');
      tick();
      await expect(page.locator('input[title="Power level"]')).toHaveValue('12');
      await clickTab(page, /^Skills$/i);
      await exerciseRoll(page, 'Roll Perception Check', /\(1d20/);
      tick();
      await assertNoErrorState(page);
    },
  },
  {
    id: 'daggerheart',
    nonTrivial: 'Level-3 (tier 2) character; Duality (2d12) Agility roll',
    run: async (page, tick) => {
      await createCharacter(page, /Daggerheart/i, 'Outcome Daggerheart', tick);
      await page.locator('input[title="Character level"]').fill('3');
      tick();
      await expect(page.locator('input[title="Character level"]')).toHaveValue('3');
      await exerciseRoll(page, 'Roll Agility', /\(2d12/);
      tick();
      await expect(page.getByText(/with Hope|with Fear|Critical!/i)).toBeVisible();
      await assertNoErrorState(page);
    },
  },
];

test('user-outcome baseline: a fresh user reaches a legal non-trivial character in every system', async ({
  page,
}) => {
  test.setTimeout(240_000);
  const results: SystemOutcome[] = [];

  for (const system of SYSTEMS) {
    let steps = 0;
    let legal = false;
    let error: string | null = null;
    const start = Date.now();
    const tick = () => {
      steps += 1;
    };
    try {
      await resetToLanding(page);
      await system.run(page, tick);
      legal = true;
    } catch (caught) {
      error = (caught as Error).message.split('\n')[0].slice(0, 240);
    }
    results.push({
      systemId: system.id,
      nonTrivial: system.nonTrivial,
      steps,
      ms: Date.now() - start,
      legal,
      error,
    });
  }

  mkdirSync(OUTCOME_DIR, { recursive: true });
  writeFileSync(
    path.join(OUTCOME_DIR, 'last-run.json'),
    `${JSON.stringify({ results }, null, 2)}\n`,
    'utf8'
  );

  // Hold each system to its committed per-system floor (the reviewed ratchet):
  // a floor must exist, and a legal run must stay within its time budget.
  const baseline = JSON.parse(readFileSync(path.join(OUTCOME_DIR, 'baseline.json'), 'utf8')) as {
    systems: Record<string, { steps: number; timeBudgetMs: number }>;
  };
  for (const result of results) {
    const floor = baseline.systems[result.systemId];
    expect(floor, `no committed baseline floor for ${result.systemId}`).toBeTruthy();
    if (floor && result.legal) {
      expect(
        result.ms,
        `${result.systemId} took ${result.ms}ms, over its ${floor.timeBudgetMs}ms budget`
      ).toBeLessThanOrEqual(floor.timeBudgetMs);
    }
  }

  // The user-outcome floor (D-equal): EVERY system must yield a legal,
  // non-trivial, coherent character. A failure here is a launch blocker.
  const failed = results.filter((result) => !result.legal);
  expect(
    failed,
    `systems failing the legal-character floor:\n${JSON.stringify(failed, null, 2)}`
  ).toHaveLength(0);
});
