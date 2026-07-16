# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-16 — everything from the 2026-07-14/15 session is
MERGED to main. SIX PRs landed: #32, #33, #34, #35, #36. **PR #38 is OPEN
(not yet merged)** and now carries THREE terrain Phase-4 slices: (a) marker-effects
authoring UI, (b) cross-system fold (M&M + Daggerheart manual branches, not just
d20/5e/PF), (c) autonomous-round attack terrain (Run Round applies cover/high
ground too). Terrain now resolves in EVERY attack path; only movement-cost /
difficult terrain remains. Branch `claude/next-priorities-98pzof` carries #38.

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
4. **Doc-staleness sweep** (#35) — post-merge cleanup so no doc understated
   shipped work (shell Phase 1 marked complete, weaponDamage notes, memory).
5. **IR Phase 4 — functional terrain STARTED** (#36). `resolveSceneAttack`'s
   default d20/5e/PF2e branch now folds a cell's terrain effects: attacker-cell
   terrain → attack effects (high ground); target-cell terrain raising the
   defense value → cover (+AC), effective AC shown in the log. Additive (26
   existing combat tests unchanged); 3 new terrain tests. The bridge
   (`src/rules/terrain/sceneTerrain.ts`) was already complete — this is its
   first consumer.

## Next steps — continue IR Phase 4 (functional terrain), value order

1. ~~**Marker-effects authoring UI**~~ — DONE, in **PR #38**. `markerEffects.ts`
   honest presets (cover +AC / high-ground +attack, the only two live shapes in
   the bridge); MarkerPanel `<Select>` + badge; SceneManager threads the preset
   into `add-marker`. Additive; 3 new tests.
2. ~~**M&M + Daggerheart** attack branches~~ — DONE, in **PR #38** (stacked on
   the authoring commit). `resolveSceneAttack` hoists terrain above all three
   branches; cover folds into `resolveMam3eAttack` (targetDefense) and
   `resolveDaggerheartAttack` (evasion), high ground into their attackEffects.
   Verified both resolvers actually consume `byTarget.attack`/compare the
   defense (not fake). UI scope copy + `markerEffects` doc + MASTER_PLAN Phase-4
   updated to "all systems". +3 tests (M&M cover flip, M&M high ground, DH cover
   flip). 418 rules+scene tests green.
3. ~~**Autonomous-round attack terrain**~~ — DONE, in **PR #38**. Threaded a
   `terrainAt(pos)` callback through `runSceneRound` → `runCombatRound` →
   `executeTacticalTurn`; folds attacker/target-cell terrain into each autonomous
   attack by LIVE position (after any move that turn). Resolution-only by design —
   target *scoring* left untouched (AI-under-cover is a separate concern). Optional
   callback → additive; existing roundDriver tests unchanged. +1 test (covered
   target flips hit→miss on Run Round). Copy/doc/MASTER_PLAN caveats flipped.
4. **Movement-cost / difficult terrain** — the ONLY remaining terrain item:
   terrain does not yet slow how far a token moves. `executeTacticalTurn`'s move
   step (the `while (stepsLeft > 0 ...)` loop) uses a flat per-cell cost of 1 and
   ignores per-cell terrain cost. NEXT.
5. **Owner items still open:** GAPS §5 (5e-2024 exhaustion −2/level review);
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
