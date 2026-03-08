# Production Readiness Plan

**Created:** March 7, 2026
**Source:** Deep codebase audit of every engine, hook, storage layer, data loader, sheet component, type system, test suite, and config file.
**Scope:** Everything required to ship this app to real users with confidence.

---

## Current State Summary

The app is architecturally sound — the Document & Data Model pattern, system registry, per-system engines, and shared component library are well-designed. Six of seven registered systems have functional engines, sheets, and SRD data. The CI pipeline is comprehensive.

But the runtime has real bugs that produce wrong numbers on screen. The storage layer has race conditions. The test coverage gate is misleading. The bundle ships dead code. And the docs have drifted from reality in several places.

This plan is organized into **five phases**, ordered by blast radius — fix things that break user trust first, then harden persistence, then optimize delivery, then clean up, then polish.

---

## Phase 1: Fix Runtime Bugs (Tier 0 Correctness)

**Goal:** Every number the user sees on screen is correct.
**Estimated effort:** 4-6 hours
**Prerequisite for:** Everything else. Ship nothing until these are fixed.

### 1.1 Engine mutation-in-place bug

**Problem:** All six production engines (`Dnd5eEngine`, `Dnd5e2024Engine`, `Dnd35eEngine`, `Pf1eEngine`, `Pf2eEngine`, `Mam3eEngine`) mutate `document.system` in place and return the same object reference. React may not detect state changes via shallow comparison.

**Files:**
- `src/systems/dnd5e/engine.ts` — line 88: `const d = document.system;` should be `const d = { ...document.system };`
- `src/systems/dnd5e-2024/engine.ts` — line 87: same pattern
- `src/systems/dnd35e/engine.ts` — line 56: same pattern
- `src/systems/pf1e/engine.ts` — line 47: same pattern
- `src/systems/pf2e/engine.ts` — line 131: same pattern
- `src/systems/mam3e/engine.ts` — line 79: same pattern

**Fix:** Each engine's `prepareData` should shallow-copy `document` and `document.system` before mutating, then return the new object. Follow the pattern already used by the Daggerheart engine at `src/systems/daggerheart/engine.ts:16-17`:

```typescript
const d = { ...document, system: { ...document.system } };
```

For nested objects that get mutated (e.g., `hitPoints`, `saves`, `spellcasting`, `conditionTrack`), also shallow-copy those before mutation.

**Regression test:** Add assertions to every engine test file that verify `prepareData` returns a different object reference than its input, and that the original document's `system` is not mutated.

### 1.2 New character 1 HP bug

**Problem:** Default `Dnd5eDataModel` and `Dnd5e2024DataModel` set `hitPoints: { current: 10, max: 10, temp: 0 }` and `classLevels: []`. On first `prepareData`, the empty `classLevels` loop produces `maxHP = 0`, then `Math.max(0, totalLevel)` = 1. The user's brand-new character displays 1/1 HP.

**Files:**
- `src/systems/dnd5e/engine.ts` — lines 102-114
- `src/systems/dnd5e-2024/engine.ts` — lines 99-111

**Fix:** When `classLevels` is empty, skip HP recalculation and preserve the default max HP from `createDefaultData`. Gate the HP computation:

```typescript
if (d.classLevels.length > 0) {
  // existing HP calculation...
} else {
  // preserve existing max, just clamp current
  d.hitPoints.current = Math.min(d.hitPoints.current, d.hitPoints.max);
}
```

**Regression test:** Add test case: `makeDoc()` with no classLevels override → `prepareData` → assert `hitPoints.max` is 10 (the default), not 1.

### 1.3 D&D 3.5e / PF1e healing bug

**Problem:** `applyDamage` in both engines doesn't check for negative amounts (healing). When `amount` is negative and temp HP exists, `Math.min(hp.temp, negativeAmount)` returns the negative number, which increases `hp.temp` instead of healing actual HP.

**Files:**
- `src/systems/dnd35e/engine.ts` — lines 179-195
- `src/systems/pf1e/engine.ts` — lines 186-202

**Fix:** Add an early return for negative amounts (healing), mirroring the 5e engine pattern:

```typescript
if (amount < 0) {
  const healing = Math.abs(amount);
  hp.current = Math.min(hp.max, hp.current + healing);
  return document;
}
```

**Regression test:** Add test cases: apply negative damage → assert current HP increases, assert temp HP is unchanged.

### 1.4 PF2e Clumsy condition AC bug

**Problem:** `Pf2eEngine.prepareData` subtracts the Clumsy condition value as a flat AC penalty after computing AC. But Clumsy should reduce the DEX modifier, not AC directly. For a heavy-armor user with dexCap 0, Clumsy should have zero effect on AC.

**File:** `src/systems/pf2e/engine.ts` — line 178

**Fix:** Apply the Clumsy penalty to the DEX score input to `computePf2eAC`, not to the output:

```typescript
const clumsyPenalty = normalizedConditionValue(d.conditions, 'clumsy');
const effectiveDex = Math.max(1, (d.baseAttributes.dex ?? 10) - clumsyPenalty * 2);
// (Reducing score by penalty*2 maps to reducing mod by penalty)
d.armorClass = computePf2eAC(effectiveDex, armorProf, d.equipment);
```

Remove the separate `d.armorClass = Math.max(0, d.armorClass - getPf2eStatusPenalty(...))` line. Frightened/sickened penalties that affect AC-related checks should be handled at roll time, not in static AC (per PF2e CRB, status penalties apply to checks, not AC for frightened/sickened).

**Regression test:** PF2e engine test: character with heavy armor (dexCap 0) + Clumsy 2 → AC should be unchanged. Character with no armor + Clumsy 2 → AC should decrease by 2.

### 1.5 Verify tsc passes

**Problem:** `noUnusedLocals: true` in tsconfig.json. The Prettier reformatting pass touched ~400 files. Cannot confirm clean compilation without running `tsc --noEmit`.

**Action:** Run `tsc --noEmit` and fix any violations. This is a gate for everything else.

---

## Phase 2: Harden Persistence (Tier 1 Data Safety)

**Goal:** No user loses data under normal usage.
**Estimated effort:** 3-4 hours
**Prerequisite for:** Phase 3+

### 2.1 Debounce persist calls

**Problem:** Every keystroke triggers `saveDocuments()` → synchronous `localStorage.setItem()` + async `idbSaveDocuments()`. Typing "Hello" = 5 localStorage writes + 5 parallel IDB transactions. Causes UI jank and IDB connection thrashing.

**File:** `src/hooks/useDocuments.ts` — lines 63-69

**Fix:** Debounce the `persist` function with a 300ms delay. The `debounce` utility already exists in `src/utils/performance.ts` (currently dead code — this is its first real callsite):

```typescript
import { debounce } from '../utils/performance';

const debouncedPersist = useMemo(
  () => debounce((docs: CharacterDocument<SystemDataModel>[]) => {
    try { saveDocuments(docs); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to save'); }
  }, 300),
  []
);
```

Also debounce the campaign persist in `src/hooks/useCampaigns.ts`.

### 2.2 Fix async IDB load race condition

**Problem:** On mount, `useDocuments` does synchronous localStorage load, then async IDB load. If the user edits between sync and async load completion, the async result overwrites their edits.

**File:** `src/hooks/useDocuments.ts` — lines 40-61

**Fix:** Track whether the user has made any edits since mount. If `historyPast.length > 0` when the async IDB load resolves, skip the overwrite:

```typescript
loadDocumentsAsync()
  .then((asyncDocs) => {
    if (asyncDocs.length > 0 && historyPast.length === 0) {
      setDocuments(asyncDocs);
    }
  })
  .catch(() => {});
```

This requires making `historyPast` accessible via a ref (it's already tracked with `useState`). Use a ref to avoid stale closure:

```typescript
const historyPastRef = useRef(historyPast);
useEffect(() => { historyPastRef.current = historyPast; }, [historyPast]);
```

### 2.3 Throttle history snapshots to reduce memory pressure

**Problem:** Every `applyDocumentsUpdate` call deep-clones all documents into the history stack. With 20 characters and rapid typing, this creates massive GC pressure.

**File:** `src/hooks/useDocuments.ts` — lines 71-73

**Fix:** Throttle history pushes to at most once per 500ms. Use the `throttle` from `src/utils/performance.ts`:

```typescript
const throttledPushHistory = useMemo(
  () => throttle((snapshot: CharacterDocument<SystemDataModel>[]) => {
    setHistoryPast((prev) => [...prev.slice(-(MAX_HISTORY - 1)), cloneDocumentsSnapshot(snapshot)]);
    setHistoryFuture([]);
  }, 500),
  []
);
```

This means undo steps are coarser-grained (one per 500ms of typing instead of one per keystroke), which is actually better UX — users expect undo to revert meaningful chunks, not individual keystrokes.

### 2.4 Add IDB write failure surfacing

**Problem:** IDB write failures are silently swallowed at `src/utils/documentStorage.ts:78-80`.

**Fix:** After 3 consecutive IDB failures, show a toast warning: "Changes are saving to browser storage only. Larger storage (IndexedDB) is unavailable." Track failure count in the adapter module.

---

## Phase 3: Fix Bundle & Code Splitting (Tier 2 Delivery)

**Goal:** Users only download code they need.
**Estimated effort:** 3-4 hours

### 3.1 Lazy-load sheet components at SystemSheetRenderer level

**Problem:** All 7 sheet components are eagerly bundled. A user who only plays D&D 5e downloads PF2e, M&M, Daggerheart, and D20Legacy sheets in the initial bundle.

**File:** `src/components/SystemSheetRenderer.tsx`

**Fix:** Use `React.lazy` with `Suspense`:

```typescript
import React, { Suspense } from 'react';
import { Skeleton } from './ui/Skeleton';

const sheetLoaders: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  'dnd-5e-2014': () => import('../systems/dnd5e/sheet').then(m => ({ default: m.Dnd5eSheet })),
  'dnd-5e-2024': () => import('../systems/dnd5e-2024/sheet').then(m => ({ default: m.Dnd5e2024Sheet })),
  // ... etc for each system
};
```

This requires each system definition to NOT eagerly import its sheet component at registration time. The `SheetComponent` field in `SystemDefinition` would need to become lazy-resolvable, or the renderer bypasses the registry for sheet lookup.

**Alternative (simpler):** Keep `SheetComponent` in the registry but move the actual component imports behind dynamic `import()` in each system's `definition.ts`, using `React.lazy`.

### 3.2 Break the 3.5e engine's eager PF1e import

**Problem:** `src/systems/dnd35e/engine.ts:8` imports `pf1eClasses` directly, defeating code splitting.

**Fix:** Make the spell-slot fallback lookup lazy. Move the PF1e class lookup into the spell-slot computation path and use dynamic import, or extract the shared spell-slot table data into a separate small module that both systems import without pulling in the full class definitions.

### 3.3 Remove dead code

**Files to delete or gut:**
- `src/utils/apiClient.ts` (193 lines) — never imported outside its test. Delete both the module and `src/__tests__/apiClient.test.ts`.
- `src/utils/performance.ts` — after Phase 2.1 and 2.3 use `debounce`/`throttle` from it, the remaining exports (`measurePerformance`, `measurePerformanceAsync`, `getPerformanceMetrics`, `clearPerformanceMetrics`, `memoize`, `useDebounce`, `usePrevious`) are still unused. Delete the unused exports only; keep `debounce`, `throttle`.
- `src/utils/performanceMonitoring.ts` — `reportWebVitals()` logs to `console.table` with no analytics endpoint. Either wire it to a real service or delete the call from `src/main.tsx:26` and the module.

### 3.4 Service worker: cache data chunks

**Problem:** `public/service-worker.js` precaches only `['/', '/index.html', '/manifest.webmanifest']`. Offline users get the app shell but no game data.

**Fix:** After the app loads, populate the cache with the Vite-hashed asset URLs for the per-system data chunks. The service worker's fetch handler already caches responses on first successful fetch (stale-while-revalidate for assets), so the real fix is just ensuring the initial page load fetches the chunks for the user's selected systems.

Alternative: Use Vite's `vite-plugin-pwa` (workbox) to generate a precache manifest automatically.

---

## Phase 4: Testing & Coverage (Tier 2 Confidence)

**Goal:** Coverage numbers mean what they claim. Tests catch real bugs.
**Estimated effort:** 4-6 hours

### 4.1 Expand vitest coverage config

**Problem:** `vitest.config.ts:15` only measures `src/components/**` and `src/utils/**`. The 80% threshold doesn't apply to engines, hooks, registry, or data.

**Fix:** Expand `include` to cover the full source tree:

```typescript
include: [
  'src/components/**/*.{ts,tsx}',
  'src/utils/**/*.{ts,tsx}',
  'src/systems/**/*.{ts,tsx}',
  'src/hooks/**/*.{ts,tsx}',
  'src/registry/**/*.{ts,tsx}',
],
```

Keep excluding `src/components/ui/**`, `src/__tests__/`, `src/data/`, `src/scripts/`, `src/types/`, and `src/validation/`.

**Risk:** Coverage may drop below 80% initially. Assess the actual number before deciding whether to temporarily lower the threshold or add tests first.

### 4.2 Add engine mutation regression tests

For each of the 7 engine test files under `src/__tests__/engines/`:

```typescript
it('returns a new document reference from prepareData', () => {
  const doc = makeDoc();
  const original = doc.system;
  const result = engine.prepareData(doc);
  expect(result).not.toBe(doc);
  expect(result.system).not.toBe(original);
});
```

### 4.3 Add the Tier 0 bug regression tests

As described in Phase 1 — each bug fix should include its test before the fix is merged.

### 4.4 E2E: add Firefox project and test against production build

**File:** `playwright.config.ts`

```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
```

Change `webServer.command` to `npm run build && npm run preview -- --host 127.0.0.1 --port 4173` so E2E tests run against the production build, not dev server.

### 4.5 E2E: expand system smoke coverage

The existing `e2e/system-smoke.spec.ts` already covers all 7 systems. Add cases for:
- Dark mode toggle persists across reload
- Export → clear all → import → verify data roundtrip
- Storage warning appears near 5MB limit (mock with large character data)

---

## Phase 5: Documentation & Polish (Tier 3 Ship Quality)

**Goal:** Docs match reality. No stale claims.
**Estimated effort:** 2-3 hours

### 5.1 Fix README

**Current problems:**
- Line 3-4: CI badge URLs are `<owner>/<repo>` placeholders
- Line 523: "Select from 6 fully implemented RPG systems" — correct count but should match registry (7 registered, 6 production, 1 scaffold)
- Line 147-159: Project structure diagram is incomplete (missing `systems/`, `hooks/`, `registry/`, `utils/`)
- Line 304: Claims "lazy loading" as completed — only partial (sheet-internal, not top-level)
- Line 323: References `SRD_COMPLIANCE.md` without `docs/` prefix — file no longer exists in `docs/`
- Line 339: Claims shadcn/ui dependency — no `@shadcn/ui` package in `package.json` (it's a custom implementation inspired by shadcn patterns)

**Fixes:**
- Replace placeholder badge URLs with actual repo URLs or remove badges
- Update project structure to include `systems/`, `hooks/`, `registry/`
- Change "lazy loading" to "partial lazy loading (sheet-internal components)"
- Fix the SRD_COMPLIANCE.md reference or note its absence
- Change "shadcn/ui" to "shadcn/ui-inspired components" in dependencies

### 5.2 Fix STATUS.md

**Current problems:**
- Line 151: Claims "78 Vitest files" — actual count from filesystem is 42 test files (not 78). The 78 number may include non-test support files or be stale.
- Line 159: Claims "1 Playwright spec" — there are actually 2 (`phase3-workflows.spec.ts` and `system-smoke.spec.ts`)
- Line 80: Claims PF2e has "Bulk tracking with encumbrance thresholds" — not verified in engine code; the PF2e engine doesn't compute bulk

**Fixes:** Verify each claim against the codebase. Replace hand-maintained numbers with instructions to derive from tooling (`find src/__tests__ -name '*.test.*' | wc -l`).

### 5.3 Consolidate or delete stale docs

**Current docs/ structure (3 files + generated/):**
- `STATUS.md` — mostly accurate, some stale numbers
- `EVIDENCE_LINKED_PARITY_AUDIT.md` — March 6 snapshot, most rows resolved per inline notes
- `EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md` — 823 lines, phases 0-3 complete, phase 4 active

**Action:**
- Merge the still-live content from the parity audit/remediation docs into STATUS.md's "Known Gaps" and "Remaining Work" sections
- Archive or delete the 823-line remediation plan — its value was in the execution, which is mostly done
- Keep `generated/roadmap-metrics.md` as-is (auto-generated)

### 5.4 Resolve `process.env.NODE_ENV` vs `import.meta.env` inconsistency

**Files using `process.env.NODE_ENV`:**
- `src/utils/documentStorage.ts` — lines 40, 46, 70
- `src/components/ErrorBoundary.tsx` — line 84

**Fix:** Replace with `import.meta.env.DEV` / `import.meta.env.PROD` for consistency with the rest of the codebase and proper Vite semantics.

### 5.5 Resolve dual deploy config

**Problem:** `vercel.json` exists with full Vercel configuration, but `ci.yml` deploys to Netlify.

**Action:** Pick one. If deploying to Netlify (as CI suggests), delete `vercel.json`. If deploying to Vercel, update CI to use Vercel CLI instead of `nwtgck/actions-netlify`.

### 5.6 Fix CI badge placeholders and stale action versions

- `README.md:3-4`: Replace `<owner>/<repo>` with actual GitHub org/repo
- `.github/workflows/ci.yml:61`: `codecov/codecov-action@v3` → update to `@v4` or `@v5`
- `.github/workflows/ci.yml:13`: `--max-warnings 50` on lint — decide if this is intentional or should be 0

---

## Phase 6: Accessibility & UX (Tier 3 — Post-Launch Track)

**Goal:** The app is usable by people with disabilities and doesn't get you sued.
**Estimated effort:** Multi-day, ongoing

This phase is listed for completeness but is not a launch blocker for a beta.

### 6.1 Focus management

- Add focus trap to `ConfirmDialog` and `Toast`
- Move focus to sheet content when navigating from character list to sheet
- Add skip-to-content link

### 6.2 ARIA coverage

- Add `aria-label` to all icon-only buttons (many currently lack them)
- Add `aria-live="polite"` region for toast notifications
- Add `aria-describedby` for form fields that have help text

### 6.3 Screen reader testing

- Test with NVDA or VoiceOver on at least the character creation → edit → save flow
- Fix any announced-but-invisible or invisible-but-interactive elements

---

## Sequencing Summary

| Phase | What | Effort | Blocks |
|-------|------|--------|--------|
| **1** | Fix 4 engine bugs + verify tsc | 4-6h | Everything |
| **2** | Debounce persist, fix IDB race, throttle history | 3-4h | Phase 3+ |
| **3** | Lazy-load sheets, break eager imports, remove dead code, fix SW | 3-4h | — |
| **4** | Expand coverage config, add regression tests, E2E Firefox + prod build | 4-6h | — |
| **5** | Fix README/STATUS, consolidate docs, resolve deploy config | 2-3h | — |
| **6** | Accessibility (post-launch track) | Multi-day | — |

**Total to beta-shippable (Phases 1-2):** ~8-10 hours
**Total to production-confident (Phases 1-5):** ~18-24 hours

---

## What This Plan Does NOT Cover

These are real gaps but are not blockers for shipping what exists:

1. **Daggerheart content** — remains scaffold-only. No local data files exist. The plan does not invent SRD data.
2. **Backend API / server sync** — `apiClient.ts` is a stub. No backend exists. This is a future feature, not a bug.
3. **Guided character creation wizard** — doesn't exist. Users create blank sheets and fill manually (or use template dropdowns). This is a UX improvement, not a correctness issue.
4. **Full feat/feature automation** — feat selection applies ASIs and proficiencies. Deeper feat riders remain manual. This is by design.
5. **3.5e prestige class normalization** — tracked in STATUS.md P1 remaining work. Requires manual data entry, not code changes.
6. **5e 2014/2024 engine deduplication** — ~250 lines of identical code across the two engines. Real tech debt but not user-facing.
7. **Sheet component decomposition** — the 1960-line `Dnd5eSheetBase` monolith works correctly. Breaking it up is maintenance hygiene, not a bug fix.

---

## Validation Criteria

The app is production-ready when:

- [ ] `tsc --noEmit` passes with zero errors
- [x] All Phase 1 bugs are fixed with regression tests
- [x] `npm run test:coverage -- --run` passes with expanded coverage config
- [x] `npm run build` succeeds
- [x] `npm run check:bundle-size` passes
- [x] `npm run lint` passes with documented exception count
- [ ] E2E tests pass against production build in at least Chromium
- [x] No `<owner>/<repo>` placeholder strings exist in shipped docs
- [ ] Deploy pipeline (Netlify or Vercel — pick one) is configured with real secrets
- [x] README system count, coverage number, and feature claims match reality
- [ ] Service worker caches at least the user's active system data chunk
- [x] Storage persist is debounced (no localStorage write per keystroke)
