import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { completeGuidedCreationFromDefaults } from './helpers/guidedCreate';

// Accessibility gate: key surfaces must be free of CRITICAL and SERIOUS axe-core
// violations. Minor/moderate findings are not failed here so the gate stays
// actionable rather than a wall of low-impact noise. The helpers below mirror
// the landing / create-character / tab patterns used by system-smoke.spec.ts so
// this spec drives the real app the same way, and it stays project-agnostic (no
// chromium-only API) to run under either configured browser project.

const BLOCKING_IMPACTS = new Set(['critical', 'serious']);

// Documented, allowlisted a11y debt: rule ids that are known-failing on the
// tested surfaces and are being tracked to be burned down separately, so the
// gate stays green on what we've already remediated while STILL failing on any
// other critical/serious violation.
//
// Only add a rule here for genuinely tracked design debt — never to dodge a
// real regression. Every other critical/serious violation, INCLUDING any new
// rule id, must continue to fail this gate.
const KNOWN_A11Y_DEBT = new Set<string>();

/**
 * Freeze entrance animations for the whole spec.
 *
 * axe computes `color-contrast` from COMPOSITED colours, so scanning a surface
 * mid-animation measures a blend, not the design. Concretely: the guided-creation
 * dialog carries `animate-in fade-in zoom-in-95`
 * (`src/components/GuidedCreatorDialog.tsx`), and a scan that landed partway
 * through that fade reported `#6b788c` on white — 4.47:1 — and failed the gate.
 * That colour is `--muted-foreground` (`#5c6a80`, a genuine 5.49:1) composited
 * over white at ~90.6% opacity; the token itself passes comfortably and had
 * already been darkened once for AA.
 *
 * So the violation was an artifact of scan timing, not a real contrast defect —
 * and the two tempting "fixes" were both wrong: darkening the token again would
 * change the design system to satisfy a measurement error, and allowlisting
 * `color-contrast` would blind the gate to every genuine contrast regression.
 *
 * Disabling animations makes every scan in this file measure settled pixels.
 * It is deliberately NOT `prefers-reduced-motion` (which the app may honour with
 * different styling) — this forces zero duration on whatever is actually there.
 */
async function freezeAnimations(page: Page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }`,
  });
}

async function openLandingPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await freezeAnimations(page);
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
}

async function getCharacterNameInput(page: Page) {
  const titledInput = page.locator('input[title="Character name"]');
  return (await titledInput.count()) > 0
    ? titledInput.first()
    : page.getByPlaceholder('Character Name');
}

async function createCharacterForSystem(page: Page, systemPattern: RegExp, name: string) {
  await page.getByRole('button', { name: /New Character/i }).click();
  await page.getByRole('button', { name: systemPattern }).click();
  await completeGuidedCreationFromDefaults(page);
  const backButton = page.getByRole('button', { name: /^Back$/i });
  const createButton = page.getByRole('button', { name: /^Create character$/i });
  await expect(backButton.or(createButton).first()).toBeVisible({ timeout: 30_000 });
  if (await createButton.isVisible()) {
    await page.locator('input[title="Character name"]').fill(name);
    await createButton.click();
  }
  // The system sheet is a lazily-loaded chunk; allow generous headroom for a cold
  // fetch+parse on a contended CI runner.
  await expect(backButton).toBeVisible({ timeout: 30_000 });
  const nameInput = await getCharacterNameInput(page);
  await nameInput.fill(name);
  await expect(nameInput).toHaveValue(name);
}

/**
 * Run axe against the current DOM and assert there are no critical/serious
 * violations. On failure, surface a compact, readable summary (rule id, impact,
 * help URL, node count) instead of axe's very large raw result objects.
 */
async function expectNoBlockingViolations(page: Page, surface: string) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (v) => BLOCKING_IMPACTS.has(String(v.impact)) && !KNOWN_A11Y_DEBT.has(v.id)
  );
  const summary = blocking.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.helpUrl,
    nodes: v.nodes.length,
  }));
  expect(
    blocking,
    `${surface}: expected no critical/serious a11y violations, found ${blocking.length}:\n` +
      JSON.stringify(summary, null, 2)
  ).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await openLandingPage(page);
});

test('landing / empty-roster page has no critical or serious a11y violations', async ({ page }) => {
  await expectNoBlockingViolations(page, 'Landing (empty roster)');
});

test('the New Character dialog and the guided-creation wizard have no critical or serious a11y violations', async ({
  page,
}) => {
  // Two surfaces the gate never reached before: the portaled system-picker
  // modal, and the wizard behind it — which is where every character in this
  // app is born, for all seven systems. The wizard's option list in particular
  // was an invalid listbox/option structure until the p5 a11y lane.
  await page.getByRole('button', { name: /New Character/i }).click();
  await expect(page.getByRole('dialog', { name: /New character/i })).toBeVisible();
  await expectNoBlockingViolations(page, 'New Character dialog');

  await page.getByRole('button', { name: /D&D 5e \(2024\)/i }).click();
  await page.getByTestId('creation-wizard').waitFor({ timeout: 30_000 });
  // Land on a step that actually renders the option listbox, not just the name
  // field, so the structural roles are in the scanned DOM.
  const choiceStep = page.getByRole('button', { name: /^2\./ });
  if (await choiceStep.count()) {
    await choiceStep.first().click();
    await expect(page.getByTestId('creation-choice-loading')).toHaveCount(0, { timeout: 30_000 });
  }
  await expectNoBlockingViolations(page, 'Guided creation wizard');
});

test('the Scene surface and the shared Dock have no critical or serious a11y violations', async ({
  page,
}) => {
  // The Scene DOM grid is the keyboard-accessible scene surface (the canvas is
  // flag-gated off by default), and the Dock is reachable identically from
  // every surface — neither was ever scanned before.
  await page.getByRole('button', { name: 'Scenes', exact: true }).click();
  await expectNoBlockingViolations(page, 'Library — Scenes segment');

  await page.getByRole('button', { name: 'Toggle toolkit dock' }).click();
  await expect(page.getByRole('complementary', { name: 'Toolkit dock' })).toBeVisible();
  await expectNoBlockingViolations(page, 'Toolkit dock');
});

test('a created character sheet and the Library bestiary browser have no critical or serious a11y violations', async ({
  page,
}) => {
  await createCharacterForSystem(page, /D&D 5e \(2024\)/i, 'A11y Sheet Hero');

  // The default sheet view.
  await expectNoBlockingViolations(page, 'Character sheet (D&D 5e 2024)');

  // Phase 3: the bestiary was evicted from the sheet — it is single-homed in
  // the Library route now (RFC-004 LibraryBestiaryView), reachable from all
  // surfaces, so the sheet tab strip must NOT expose a Monsters tab.
  await expect(page.getByRole('tab', { name: /^Monsters$/i })).toHaveCount(0);

  // Return to the Library and open the Bestiary segment; the Monsters/Bestiary
  // reference browser is a distinct heavy surface hosted there now.
  await page.getByRole('button', { name: /^Back$/i }).click();
  await page.getByRole('button', { name: 'Bestiary', exact: true }).click();
  await page.getByLabel('Select game system').selectOption('dnd-5e-2024');
  await expect(page.getByLabel('Search monsters')).toBeVisible({ timeout: 30_000 });
  await expectNoBlockingViolations(page, 'Bestiary (Library route)');
});
