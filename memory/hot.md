# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-15 — everything from the 2026-07-14/15 session is
MERGED to main (`9007a62`). Three PRs landed: #32, #33, #34. Branch
`claude/next-priorities-98pzof` == main.

## What shipped (all on main)

1. **Planning-doc realignment** (#32) — MASTER_PLAN/GAPS/RFC-004/build-specs
   corrected to match shipped reality; RFCs 004/005/006 added to provenance.
2. **Shell Phase 1 — COMPLETE** (#32 + #33). #32: scene-selection lift
   (SceneManager takes controlled `selectedSceneId`/`onSelectScene`;
   `useAppNav.selectScene` consumed), `LibraryScenesView`, left-rail
   relocation, plan-compliant keepalive (`visibility:hidden` + off-screen,
   replacing `<div hidden>`). #33: Export/Delete overflow re-home + per-card
   roster controls + search (`OverflowMenu`), Alt+1/2/3, surface-switch
   `performance.mark/measure` (`useSurfaceSwitchMetrics`), `sceneManagerChunk`
   bundle guard (eager/lazy from `dist/index.html`), all 8 `e2e/phase1-*`
   gates. Escape-scoping bug in OverflowMenu fixed (capture+stopPropagation).
3. **IR Phase 1 — CLOSED** (#34). Quick wins: 5e spell save DC/attack now
   DISPLAYED on the spells tab (`getDnd5eSpellcastingClassSummaries`, shared
   helper w/ engine); `EquippedItem.weaponDamage` POPULATED at 5e equip time
   (`toEquippedItem`), so saved chars get real weapon dice in scene combat.
   Engine routing BOUNDARY: Daggerheart + M&M intentionally NOT routed through
   `resolveCharacterEffects` — it is additive-only, and their derived defenses
   use conditional base-overrides / attribute-derived / max-combining the
   additive resolver can't express. Documented in MASTER_PLAN + GAPS §2.

## Next steps

1. **Step-6 direction (OWNER DECISION, pending):** terrain + validators
   (my lean — thread functional terrain into scene combat, then per-system
   validators + resolver legal-actions seam, which unlocks the AI-DM ladder
   scene-runtime 12–14) vs. shell Phases 2–6 (ShellContext/SurfaceStage → dock
   → drag keystone → canvas). Phase 2 is now unblocked.
2. **Owner items still open:** GAPS §5 (5e-2024 exhaustion −2/level review);
   README two-denominator citation; REMEDIATION Phase 6 (archive superseded
   plan docs) + Phase 7 (toolchain: ESLint 9 → React 19 → Tailwind 4 → Vite 8).

## Landmines

- Container recycles mid-session, silently killing background workflows AND
  wiping the scratchpad + saved workflow scripts. Do heavy work FOREGROUND
  with commit+push per piece. Fable 5 credits ran out → running on Opus.
- Playwright bridge: browsers rev 1194 at /opt/pw-browsers, toolchain wants
  1208/firefox-1509. NEVER `playwright install`. Symlink-bridge
  chromium-1208/chrome-linux + chromium_headless_shell-1208/
  chrome-headless-shell-linux64/chrome-headless-shell + ffmpeg-1011 (missing
  ffmpeg crashes retries w/ a misleading "just installed" banner) under a
  scratchpad PLAYWRIGHT_BROWSERS_PATH; `--project=chromium` only.
- Merge policy: auto-mode classifier blocks merge-to-main unless the USER gave
  explicit, specific consent (generic "proceed" is not enough).
- `importScenesWithReport` needs the `{scenes:[...]}` envelope; a bare array
  throws (parse-error), it does not report zero scenes.

## Open questions

- Auto-reset edge: cross-tab scene deletion while SceneManager is keepalive-
  hidden flips the user to the Scene surface (seam couples selection→surface).
  Rare; revisit in Phase 2's SurfaceStage.
- GAPS §1: fold genuine srd-coverage numbers into the headline metric?
