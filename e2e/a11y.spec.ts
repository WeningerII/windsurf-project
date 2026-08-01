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

/**
 * Every surface below is scanned once per theme.
 *
 * This spec used to scan the default (light) theme only, and that hole shipped a
 * real WCAG AA regression: commit 1038b56 swept `text-amber-600` -> `text-amber-700`
 * to fix light mode, which is correct on white (5.02:1) but darker on the dark
 * surface — `#b45309` on `#020817` is 3.98:1, down from amber-600's passing
 * 6.28:1. Two dozen call sites across sixteen files were affected. The gate
 * stayed green the whole time and was not lying: it simply never rendered a
 * single pixel in dark mode, so a dark-only contrast regression was invisible to
 * it by construction. Scanning both themes is what closes that.
 */
const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

// `src/hooks/useTheme.ts` is the single owner of this key; `ThemeToggle` (in
// AppHeader) is its only consumer and it puts the resolved theme's class on
// <html>. Seeding localStorage before load is exactly what the real user's
// previous visit leaves behind, so these scans exercise the shipped code path
// rather than a test-only override.
const THEME_STORAGE_KEY = 'rpg-theme';

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

/**
 * Assert the theme under test is ACTUALLY on the document before anything is
 * scanned.
 *
 * This assertion is the point of the dark pass, not decoration around it. A dark
 * test that quietly booted in light mode would scan light pixels, pass, and
 * report coverage it does not have — the same reported-green-while-proving-
 * nothing shape that let the amber regression through in the first place, and
 * that this repo has already been bitten by. If the storage key is ever renamed,
 * or `applyTheme` stops writing the class, this fails loudly instead of
 * degrading into a second light-mode scan.
 *
 * Checked against the class list rather than a computed colour because
 * `applyTheme` (`src/hooks/useTheme.ts`) toggles precisely `light`/`dark` on
 * <html>, and that class is what every `dark:` variant in the app keys off.
 */
async function expectThemeApplied(page: Page, theme: Theme) {
  const other = theme === 'dark' ? 'light' : 'dark';
  await expect(
    page.locator('html'),
    `expected <html> to carry the "${theme}" class before scanning — ` +
      `a ${theme}-theme scan that ran in ${other} would report coverage it does not have`
  ).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`));
}

async function openLandingPage(page: Page, theme: Theme) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ([key, value]) => {
      localStorage.clear();
      // Seeded AFTER the clear, and re-read on the reload below, so the app
      // resolves the theme itself on boot.
      localStorage.setItem(key, value);
    },
    [THEME_STORAGE_KEY, theme] as const
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await freezeAnimations(page);
  // Fresh boot has no characters, so the roster's empty state is the landing anchor.
  await expect(page.getByRole('heading', { name: 'No characters yet' })).toBeVisible();
  // Light is seeded explicitly too. The default is `system`, which resolves via
  // `prefers-color-scheme` — so on a runner whose OS is dark the "light" scan
  // would have silently been a dark scan. Pinning both removes that ambiguity
  // in the same stroke.
  await expectThemeApplied(page, theme);
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
  // Read the theme off the live document rather than taking it as an argument:
  // it is the theme axe actually measured, so a failure message can never claim
  // a theme the DOM was not in.
  const activeTheme = await page
    .locator('html')
    .evaluate((el) => (el.classList.contains('dark') ? 'dark' : 'light'));
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
    `${surface} [${activeTheme} theme]: expected no critical/serious a11y violations, ` +
      `found ${blocking.length}:\n` +
      JSON.stringify(summary, null, 2)
  ).toEqual([]);
}

// The four surfaces are parameterised over the theme rather than duplicated, so
// a surface added below is automatically covered in both themes and cannot drift
// into being light-only again.
for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await openLandingPage(page, theme);
    });

    test('landing / empty-roster page has no critical or serious a11y violations', async ({
      page,
    }) => {
      await expectNoBlockingViolations(page, 'Landing (empty roster)');
    });

    /**
     * UN-QUARANTINED 2026-07-28. This was a `test.fixme` whose note said resolving
     * it needed the live DOM — computed styles on the ancestor chain — which was
     * not available when it was written. Run against a real browser, it took about
     * a minute, and the finding was real.
     *
     * What it actually was: `<span>No class levels are selected yet.</span>`, the
     * creation-validation warning, inheriting `text-amber-600` (`#d97706`) on the
     * card's `#ffffff` at 12px = **3.18:1** against AA's 4.5. Tailwind's amber-600
     * simply does not pass as body text on white; amber-700 (`#b45309`) is 5.02:1
     * and is what the app now uses. Dark mode was already fine — `amber-400` on the
     * dark card is 11.98:1 — so only the light-mode value moved.
     *
     * The old note's diagnosis did NOT survive contact with the live DOM, and that
     * is worth recording rather than quietly deleting. It described `#6b788c` on
     * ability-score labels at 4.47:1 and theorised "something applies opacity that
     * the declaration does not". On this surface every element in the chain from
     * the failing span up to the dialog reports `opacity: 1` and `filter: none`,
     * and the colour is exactly what the class declares. Whether that earlier
     * finding was a different element since fixed, or a misread, it was not this.
     *
     * `freezeAnimations` above is kept regardless: scanning mid-fade measures a
     * composite, and that reasoning stands on its own for every scan in this file.
     *
     * The quarantine was the right call at the time — the alternative, adding
     * `color-contrast` to `KNOWN_A11Y_DEBT`, would have blinded the gate to every
     * genuine contrast regression on every surface. But a quarantine hides a real
     * defect for as long as it lasts: this one was shipping a WCAG AA failure on
     * the surface where every character in the app is created, for all seven
     * systems, and nothing caught it because the only test that looked was skipped.
     */
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
        await expect(page.getByTestId('creation-choice-loading')).toHaveCount(0, {
          timeout: 30_000,
        });
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

      // A scene MUST be created before the grid scan: `openLandingPage` clears
      // localStorage and nothing seeds a scene, so `SceneGridView` (the role="grid"
      // this test exists to cover) never mounts on the empty Scenes segment. The
      // scan above therefore says nothing about the grid — this one does.
      await page.getByRole('button', { name: 'New Scene' }).click();
      await page.getByPlaceholder('Scene name').fill('A11y Chamber');
      await page.getByRole('button', { name: 'Create', exact: true }).click();
      // The scene canvas is a lazily-loaded chunk; a cold CI fetch+parse can be slow.
      await expect(page.getByRole('grid', { name: 'A11y Chamber grid' })).toBeVisible({
        timeout: 30_000,
      });
      await expectNoBlockingViolations(page, 'Scene DOM grid');

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

      // Filter before scanning. The unfiltered list renders ~8,235 DOM nodes and
      // axe cost is superlinear in node count, not in the number of DISTINCT
      // widgets: measured 8,235 nodes -> 22.8s, 1,753 -> 3.2s, 1,221 -> 2.65s,
      // 195 -> 0.59s, and every one of those scans reported the identical single
      // (non-blocking) finding. Across both browser projects the unfiltered scan
      // was 45.6s — 21.7% of all e2e execution time — to re-check the same row
      // markup eight thousand times.
      //
      // Every axe rule still runs, over every distinct control on this surface.
      // What is given up is duplicate-id-at-scale detection, and that is not a
      // live exposure here: the full list carries exactly 3 `id` attributes and
      // all 3 are unique. Restore the unfiltered scan if the row markup ever
      // starts minting ids per row. The durable fix is virtualizing this list,
      // which the real user on a low-end device needs more than CI does.
      await page.getByLabel('Search monsters').fill('dragon');
      await expect(page.getByRole('button', { name: /Adult .* Dragon/i }).first()).toBeVisible();
      await expectNoBlockingViolations(page, 'Bestiary (Library route, filtered)');
    });
  });
}
