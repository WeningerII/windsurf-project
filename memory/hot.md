# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-10 (e2e gate FIXED on `claude/next-priorities-16xgyl`; 26/26 chromium green locally; branch pushed, no PR yet)

## Current focus

Main's release gate was RED and masked: after PR #30 (Phase 1 shell) merged,
ALL 52 Playwright tests failed on both browsers, but 52 fails × 2 retries ×
1 worker outran the 30-min Verify cap, so CI recorded "cancelled" (no failure
summary) — and pages.yml deployed the unverified build anyway. Fixed in 5
commits on `claude/next-priorities-16xgyl` (pushed, needs PR + merge):

- Root cause: every spec's fresh-boot helper asserted "Your Characters", but
  CharacterListView returns null when empty — the anchor never renders on a
  cleared profile. Added a real first-run empty state ("No characters yet" +
  create CTA) to App.tsx; re-anchored all boot helpers on it; adapted 3
  phase3-workflows tests still assuming the deleted inline system buttons /
  gated Import.
- outcome-baseline harness rewritten: fresh browser CONTEXT per system.
- CI hygiene: playwright maxFailures:10 in CI; pages.yml now triggers on
  CI/CD Pipeline completion and deploys only on success (exact verified SHA).

## Landmines learned (2026-07-10)

- In-page `localStorage.clear()` CANNOT produce a fresh user in e2e: the app
  flushes debounced saves on pagehide (Chrome may run it concurrently with
  the next document's load — even addInitScript loses) AND mirrors documents
  to IndexedDB, which a fresh boot restores from. Use a fresh browser context.
- Container Playwright browsers are rev 1194; repo's @playwright/test wants
  1208. NEVER `playwright install` here — symlink-bridge the revisions under
  a scratchpad PLAYWRIGHT_BROWSERS_PATH (layout differs: headless shell is
  chrome-headless-shell-linux64/ now, chrome-linux/headless_shell in 1194).
- e2e/pwa-offline is locally flaky (~1/4 blank offline shell). Watch it in CI.

## Phase 1 truth (survey verified vs plan-of-record)

Landed: useAppNav union, NewCharacterDialog, header segment nav, 6+3 writers,
lazy-mount Scenes, suite rewrites. NOT landed (deferred "to Phase 2" but the
build-specs doc calls them Phase-2 prerequisites): LibraryScenesView, 5-writer
scene-selection lift (SceneManager L109 still internal), 18rem left-rail
relocation, full Export/Delete re-home + per-card controls, phase1-*.spec
gates, sceneManagerChunk guard, Alt+1/2/3. Keepalive uses `<div hidden>` —
plan forbids display:none (Findings 7+14, unmeasured).

## Next steps

1. Open PR for `claude/next-priorities-16xgyl`; watch first CI run (verify
   now fails fast if anything is still red; firefox untested locally).
2. Owner decisions: shell Phase-1 remainder vs MASTER_PLAN programs (IR
   Phase 1, GAPS §1/§2); mirror the shell program into MASTER_PLAN (its
   governance rule is currently violated); 5e-2024 exhaustion -2/level still
   awaits the human review GAPS §5 flags.
3. Stale docs: MASTER_PLAN lists the tactical executor + encounter-spec
   validation as open; both shipped (RFC 006, STATUS.md).

## Open questions

- Is pwa-offline's blank-shell flake env-only (rev-1194 bridge) or real?
- Should PR #30's Phase-1 deferrals be recorded as a spec amendment in
  ui-redesign-phase-build-specs.md?
