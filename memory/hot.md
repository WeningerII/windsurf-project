# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-14 (doc realignment `6f03cad` + shell increment
`5e499a4` MERGED to main via PR #32, `3f5df56`; CI green incl. firefox's
first pass; branch fast-forwarded onto main)

## Current focus

Two landings this session, both pushed:

1. **Planning-doc realignment** (`6f03cad`): MASTER_PLAN/GAPS/RFC-004/build-specs
   now match shipped reality (details in the 2026-07-14 session log).
2. **Shell increment — build-specs tasks 3+5+12 + keepalive swap** (`5e499a4`):
   - SceneManager selection is a controlled seam (`selectedSceneId`/
     `onSelectScene`); all five internal writers gone; LEFT 18rem rail,
     create, and import moved out; canvas full-width + empty state.
   - New `LibraryScenesView` = select-only scenes home (cards with
     aria-pressed, campaign filter, create/import through the seam).
     `useAppNav.selectScene` + `surface:'scene'` are now CONSUMED —
     create/import/pick land on the live canvas.
   - Keepalive re-anchored to the Scene surface using visibility:hidden +
     off-screen transform (the forbidden `<div hidden>` is gone).
   - SceneManager suite rewritten (harness plays the shell); new
     LibraryScenesView suite; new `e2e/phase1-scene-selection.spec.ts`
     covering acceptance gates (c)/(e)/(h).
   - Verified: full vitest + coverage, all static gates, build/bundle,
     Playwright chromium 27/27 locally (firefox → CI).

## Next steps

1. [DONE 2026-07-14] PR #32 opened, CI green (run #143, firefox included),
   merged as `3f5df56`. Owner-agreed order of operations: shell Phase-1
   closeout → IR Phase-1 + quick wins → IR 2-3 → shell Phase 2 → fork
   (shell 3-6 vs terrain+validators); toolchain (ESLint 9 etc.) between
   programs.
2. Remaining Phase-1 deferrals, now unblocked: tasks 7-8 (Export/Delete
   re-home + per-card roster controls), task 9's Alt+1/2/3 (third surface now
   exists), task 11 (performance.mark/measure baseline + sceneManagerChunk
   guard), task 14's remaining gates (a/b/d/f/g). Then Phase 2 (ShellContext +
   SurfaceStage) — its three prerequisite blockers are closed.
3. IR Phase-1 closeout: route daggerheart + mam3e engine prepareData through
   resolveCharacterEffects (all-seven parity currently tests-only).
4. Owner items: GAPS §5 review (5e-2024 exhaustion −2/level); README
   two-denominator citation; REMEDIATION Phase 6 doc-archive decision.

## Landmines (2026-07-14)

- Playwright bridge for this container: browsers rev 1194 at
  /opt/pw-browsers, toolchain wants 1208/firefox-1509. NEVER `playwright
  install`. Symlink-bridge chromium-1208/chrome-linux AND
  chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell
  AND ffmpeg-1011 (missing ffmpeg crashes retries with a misleading
  "just installed" banner) under a scratchpad PLAYWRIGHT_BROWSERS_PATH; run
  `--project=chromium` only.
- `importScenesWithReport` requires the `{scenes:[...]}` envelope; a bare
  array throws (parse-error path), it does not report zero scenes.

## Open questions

- Auto-reset edge: a cross-tab scene deletion while SceneManager is
  keepalive-hidden now flips the user to the Scene surface (seam couples
  selection to surface). Rare; revisit in Phase 2's SurfaceStage.
- GAPS §1: fold genuine srd-coverage numbers into the headline metric?
