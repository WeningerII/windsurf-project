# UI shell redesign — phased, file-grounded plan

**Date:** 2026-07-06 · **Basis:** `docs/design/vtt-ui-ux-research.md` (Owlbear Rodeo
UX principles) · **Method:** multi-agent design workflow (5 code-mappers → 4 surface
designs → synthesis → adversarial critique), grounded in the current source with
file:line anchors. The critique's findings are folded into this plan, not appended —
where it caught a gap, the plan below already reflects the correction, and the four
genuine *product* decisions it surfaced are collected in §2 with recommended
defaults.

This is a plan. No code is changed by this document.

---

## 1. Target shell (end state)

Replace today's scrolling `<main class="container">` boolean render-cascade
(`src/App.tsx` L467–648) with a full-viewport `h-dvh flex-col overflow-hidden` frame:

- **One ~52px persistent rail** (evolved `src/components/AppHeader.tsx`) — the only
  always-visible chrome: brand/back, a **[Library | Sheet | Scene]** segmented
  switcher, context identity (character or scene name), undo/redo, a dock-summon
  control, a GM/player **role toggle**, sync status, theme toggle.
- **A keepalive `SurfaceStage`** (`flex-1 min-h-0 relative`) holding all three peer
  surfaces absolutely-filled; exactly one visible (~90% of pixels), the others
  `hidden` + quiesced but **kept mounted**, so switching is a visibility flip, not a
  teardown/rebuild. Each surface owns its own internal scroll.
- **One shell-mounted Dock** (`src/dock/Dock.tsx`) — a summonable bottom drawer of
  typed tabs (spell / feat / equipment / monster / …) reached identically from every
  surface; its visible tab set is a function of active surface + role.
- **A portaled drag layer** rendering a pointer-tracking ghost and a **drop-time
  classifier**: drop a monster on the Scene grid → token; drop a spell on the Sheet →
  a prepared / known / favorite choice. Every drop resolves to an **existing**
  controller handler or `SceneActionIntent`.

**The load-bearing safety constraint (verified):** every new gesture emits the same
controller handlers / 12 `SceneActionIntent` variants that exist today, so the
deterministic, event-sourced core (`src/scene/runtime.ts`) is **never touched**. This
is a UI reshape over an unchanged engine.

---

## 2. Four decisions only you should make

The current landing scroll (`App.tsx` L511–648) silently hosts three flows that have
**no home** in a bare [Library|Sheet|Scene] switcher. The plan below assumes a
recommended default for each; override any of them and the affected phase adjusts.

1. **Character creation.** `GameSystemSelector` (L549) + Create (L558) + the
   import bar live in the deleted branch. **Recommended:** a prominent "New Character"
   action in the Library rail that opens the system picker as a modal/first-run
   overlay — keeps "new character in under a minute" (the brief's onboarding moat).
2. **Campaign management.** `CampaignManager` carries real depth (quests, sync,
   log-scene-to-campaign). Folding it into one Library scroll *recreates the
   undifferentiated scroll we set out to kill.* **Recommended:** Library is a
   **two-pane surface** (Characters | Campaigns) with a segment control, not a
   scroll — campaign *detail* opens in the right pane.
3. **Scene authoring.** Create / import / export scenes (`SceneManager` L836–864)
   falls off the map when scene *selection* moves to Library. **Recommended:** scene
   create/import lives in the Library's scene picker; export stays a per-scene action
   in the Scene rail.
4. **Drag form factor.** Radial wheel vs inline-chip menu for the drop classifier,
   and pointer-events vs HTML5 drag. **Recommended:** pointer-events (touch/PWA
   parity) + inline-chip menu first, radial as a later polish — decided when the
   Phase 3 spike lands.

`InventoryManager.tsx` and `SystemStatusDashboard` also need rehoming (dock tab and
Library footer/utility respectively) — lower-stakes, noted so they aren't dropped.

---

## 3. Phased plan

Sequencing rationale: the four surface designs overlap on **one** thing — the dock +
drag + drop-time classifier. Sheet's drop target, Scene's drop classifier, and the
Dock's classifier menu are the *same system described three times*, so it is built
**once**, as a keystone, before any per-surface eviction. Order: additive substrate →
frame → dock shell → drag keystone → sheet eviction → scene decomposition → hardening.

### Phase 0 — Instrumentation + token/z-index/motion scales (additive, no behavior change)
- Add `performance.mark/measure` around the current surface switch to capture a
  **baseline** interaction-latency number (Library→Sheet, Sheet→Library, reach-grid)
  — honor the brief's *profile-before-restyle* principle with a real number.
- Add motion + elevation tokens (reuse existing `animate-in/fade-in-0` keyframes in
  `src/index.css` L76–93; add a `token-pop`).
- **Correction (per critique):** do **not** rewrite the shared `z-50`/`z-[60]` scale
  yet — that churns before the dock/drag/classifier that define the layering exist.
  Introduce the z-scale in Phase 2 when the dock gives it meaning.
- Files: `src/index.css`, `tailwind.config.js`, `src/App.tsx` (instrument only).
- Risk: low, purely additive.

### Phase 1 — Shell frame + three-surface navigation (the skeleton)
- `ShellContext` (mirrors the existing `AuthContext` split): reducer holding
  `{ current, sheetDocId, sceneId, overlay, role }` with intents
  openCharacter/openScene/switchSurface/back/setRole/openOverlay. Subsumes
  `currentDocId`, `showLegal`, and — see correction — the scene selection state.
- `Shell.tsx` (the `h-dvh` frame) + `SurfaceStage.tsx` (lazy-mount on first
  activation, then keep mounted, toggle visibility, pass an **`active`** boolean).
- Three surface wrappers: **LibrarySurface** (two-pane per Decision 2, hosting
  `CharacterListView`, `CampaignManager`, the scene picker, **and the character-create
  entry per Decision 1**), **SheetSurface** (hosts the existing
  ErrorBoundary+Suspense+`SystemSheetRenderer` block verbatim), **SceneSurface**.
- Gut `App.tsx` L467–648: delete the render ladder and view booleans; **keep every
  data hook and cross-surface handler** and inject them into `<Shell>`
  (`handleReturnToList` L186 becomes the body of `shell.back()`).
- Evolve `AppHeader.tsx` into the rail (segmented switcher + role toggle).
- Extend `useKeyboardNavigation.ts` with Alt+1/2/3 switches and layered Escape.
- **Correction (per critique — the Phase 1 self-contradiction):** you cannot both
  "lift `selectedSceneId` to the shell" and "leave the `SceneManager` monolith
  untouched" — the monolith renders and mutates its own internal scene list. So
  Phase 1's `SceneSurface` wraps the monolith **and** the shell passes `sceneId` down
  as a *controlled prop*, with the monolith's internal picker suppressed. This is the
  minimal seam that avoids two competing scene pickers before Phase 5.
- Files: `src/contexts/ShellContext.tsx`, `src/shell/Shell.tsx`,
  `src/shell/SurfaceStage.tsx`, `src/shell/surfaces/{Library,Sheet,Scene}Surface.tsx`,
  `src/App.tsx`, `src/main.tsx`, `src/components/AppHeader.tsx`,
  `src/hooks/useKeyboardNavigation.ts`.
- Risk: scroll ownership shifts app-wide (mobile `dvh` + keyboard insets need
  testing). **Quiescence correction:** `hidden` alone doesn't stop timers/subscriptions
  — genuine quiescence requires the `active` boolean wired into effects
  (useSync/useScenes/useCampaignSync), not just a DOM attribute. `inert` is not a typed
  React 18 prop; set it via ref/`setAttribute`.

### Phase 2 — Shared Dock shell (click-select only, no drag yet)
- `DockProvider` + `Dock.tsx`: a summonable bottom drawer built on the existing
  `src/components/ui/Tabs.tsx` (already supports controlled `value`/`onValueChange`
  and unmounts inactive panels — *verified, no primitive change needed*).
- `useDockResources.ts` wrapping `dataLoader` loaders (collapses the four overlapping
  per-system resource hooks into one seam; keeps hover-preload).
- Re-host the four generic browsers (`SpellBrowser`/`FeatBrowser`/`EquipmentBrowser`/
  `MonsterBrowser`) **verbatim** as dock tab bodies (array-in / onSelect-out is
  already the right shape).
- **Correction (per critique — the missing dispatch seam):** the dock is
  shell-mounted but per-system handlers live *inside* the lazy sheet controller. Add a
  **`SheetDispatchContext`** the active `SheetSurface` publishes its controller's
  handlers into, so the shell-level dock can reach them. Without this, Phase 2's dock
  is operable against the **Scene** (via Phase 3) but not the **Sheet** until Phase 4.
  Build the seam here, in Phase 2, so the claim "dock is operable" is true when made.
- **Correction (two-live-copies):** while the dock hosts catalog browsers that are
  *also* still in-sheet (until Phase 4), route both through the same
  `useDockResources` seam so they can't diverge; accept the transient duplication
  knowingly.
- Files: `src/dock/{Dock,DockProvider,useDockResources,dockRegistry}.tsx`,
  `src/components/ui/Tabs.tsx`, `src/components/{Spell,Monster,Equipment,Feat}Browser.tsx`,
  `src/contexts/SheetDispatchContext.tsx` (new, per correction).
- Risk: `Tabs.tsx` is used by every current tabbed sheet — lifting shared filter state
  is an app-wide regression surface; mam3e/daggerheart bespoke browsers need
  `dockRegistry` normalization or stay in-sheet in the interim.

### Phase 3 — Drag engine + drop-time classifier (the greenfield keystone) — **split into 3a/3b/3c per critique**
Grep confirms **zero** existing drag-and-drop and no DnD library installed; this is
the riskiest greenfield work, so it lands as three separately-shippable slices:
- **3a — payload + drop contract + pointer engine.** `dragItem.ts` (what you're
  holding), `useDropTarget.ts` (`accepts`/`classify` → 0 = reject+snap-back,
  1 = auto-apply, 2+ = menu), `DragProvider`/`DragLayer` (portal ghost via direct ref
  transform, **no per-frame React state**, so memoized `SceneGridView` never
  re-renders mid-drag). Must handle touch, scroll-vs-drag, `setPointerCapture`.
- **3b — the Scene classifier (proves the engine).** `classifiers/sceneDrop.ts` +
  `monsterToSceneToken.ts` (folds `useSceneEncounter`'s monster→token logic so the
  Encounter panel and the Monster dock tab share **one** path); register the grid as a
  drop target; illegal drops surface `runtime.ts`'s existing `issues` (snap-back +
  toast). Single unambiguous choice → no menu → buttery.
- **3c — the classifier menu + Sheet classifier.** `DropClassifierMenu.tsx`
  (generalizes `ConfirmDialog`'s portal/focus-trap/Escape plumbing);
  `classifiers/sheetDrop.ts` (spell → Prepare[gated on `singlePreparedCasterLimit`]/
  Known/Favorite; equipment → `handleAddInventoryItem`). Depends on the Phase 2
  `SheetDispatchContext`.
- Files: `src/dock/{dragItem,useDropTarget,DragProvider,DragLayer,DropClassifierMenu,
  DockDraggable,monsterToSceneToken}.*`, `src/dock/classifiers/{scene,sheet}Drop.ts`,
  `src/components/scene/useSceneEncounter.ts`.
- Risk: greenfield pointer engine on a PWA; radial-vs-inline and pointer-events-vs-
  dataTransfer are the Decision-4 form-factor calls, resolved by the 3a spike.

### Phase 4 — Sheet surface: evict catalog browsers, controlled tabs, view/edit seam
- Add the edit/view seam in `SystemSheetRenderer.tsx`: thread
  `onUpdate={canEdit ? onUpdate : undefined}` — because every host already gates on
  `canUpdate = Boolean(onUpdate)` (*verified across all 5 controllers*), this makes the
  tree read-only for GM/observer with near-zero per-system work. **Caveat (critique):**
  this yields *disabled-but-present* editing UI, not a designed observer view; audit
  the bespoke mam3e/daggerheart sections actually honor `canUpdate`.
- In `Dnd5eSheetBase.tsx`: delete the monster/feat browser tabs, promote
  Header/Classes/Overview to a sticky vitals spine, make `<Tabs>` controlled, wire
  surviving owned tabs (Spells/Equipment/Features) as drop targets. Stay under the
  400-LOC `hostSizeBudget`.
- Shrink `Dnd5eTabsNavigation.tsx` from `grid-cols-9/10` to ~`grid-cols-6`; repeat the
  eviction across pf2e (merge duplicated sibling tabs), d20-legacy (419-LOC body),
  mam3e + daggerheart (bespoke browsers).
- Grow per-system controllers with `handlePrepareSpell`/`handleLearnSpell`/
  `handleFavoriteSpell` (uneven across systems — author per controller).
- **Delete** the ~12 orphaned adapter files and update their paired
  knip/hostSizeBudget/doc-drift/`SystemSheets.test.tsx` entries so `npm run verify`
  passes.
- Files: the 5 sheet hosts + their controllers + `SystemSheetRenderer.tsx` +
  `hostSizeBudget.test.ts`.
- Risk: five parallel host edits with uneven embedding; three CI gates
  (knip/hostSizeBudget/doc-drift) actively fight the deletions — each needs its paired
  doc/test updated in the same commit.

### Phase 5 — Scene surface: decompose the monolith → full-bleed canvas + toolbar — **split into 5a/5b/5c per critique**
The 1207-line, ~30-`useState` `SceneManager` is the single biggest lift and *pan/zoom
is net-new capability, not decomposition* — so it splits:
- **5a — decompose (no visual change).** Extract a thin `SceneSurface` owning only
  `selectedSceneId` (from shell) + the dispatch seam; push each tool's transient input
  state down into its own component so the canvas stops re-rendering on every keystroke.
- **5b — reshape the chrome.** Replace the nested grids + 11-panel 20rem rail with a
  full-bleed canvas + a right-side **two-level tool rail** (tools → exclusive-modes
  strip + one-shot-actions strip, never deeper); collapse the roll panels
  (Dice/Check/Oracle/Reaction) into a summonable tray and Initiative+Combat into a
  GM Combat overlay; the Monster/Token *source* folds into the dock, the token *edit*
  half becomes the Token tool.
- **5c — pan/zoom + grid drop target (its own project).** Wrap the grid in a pan/zoom
  transform viewport; add the screen→cell resolver **without** breaking
  `SceneGridView`'s memoization or the keyboard-a11y path; register the grid drop
  target (already prototyped in 3b); token-drag with a live distance ruler.
- **Test fallout (critique — omitted originally):** 5a–5c break
  `SceneManager.test.tsx`, `sceneCombatBridgeUi.test.ts`, and
  `capabilityScenarios.test.tsx` — these are explicit work items, updated as the
  decomposition lands.
- Files: `SceneManager.tsx`, `SceneGridView.tsx`, `src/components/scene/*`,
  `src/shell/surfaces/SceneSurface.tsx`, the three scene test files.
- Risk: highest; careless decomposition reintroduces the re-render coupling it removes.

### Phase 6 — Hardening
- Role source of truth: keep the client-side toggle; **document that it is
  disclosure-only, NOT enforcement** — no multiplayer viewer identity exists, and it
  must never be conflated with the AI-proposal / rules validators.
- History/hash sync of `ShellNavState` (no router) so reload restores
  surface+character+scene (guard restore behind hydration).
- Promote the Phase 0 instrumentation into a `check:*` script in `npm run verify` —
  an **interaction-latency budget** anchored to the Phase 0 baseline (generous
  threshold to avoid CI-runner flakiness).
- Reconcile remaining CI gates; `graphify update .`; `/save`.

---

## 4. Recommended first prototype

**Monster-from-dock → scene token** — a vertical slice through Phases 1–3b that proves
the whole thesis (shared dock + pointer-drag + drop-time classification + untouched
event core) on the smallest possible surface. Minimum `ShellContext`+frame so Scene
can show; a Dock with a **single** Monster tab (existing `MonsterBrowser` +
`useDockResources`); the 3a pointer engine; `SceneGridView` as a drop target; and only
the unambiguous 1-choice `sceneDrop` classifier calling the existing `emitSceneAction`
with a place-token intent.

**Correction (critique — the prototype pierces the monolith):** `emitSceneAction` is a
private `useCallback` inside `SceneManager` closing over local state; a shell-mounted
dock cannot call it. So the prototype **must** first expose `emitSceneAction` + the
active scene upward (via the Phase-1 `SceneSurface` controlled-prop seam) — a small,
named modification, not a free reuse. Budget it explicitly.

---

## 5. Top risks (carried from synthesis + critique)

1. **The primary verb is greenfield** — zero existing DnD; the pointer engine
   (touch/PWA, scroll-vs-drag, `setPointerCapture`) is built from scratch. Mitigated by
   the 3a spike shipping first.
2. **No player/GM identity exists** — single-user local-first; the role gate is a
   disclosure hint, not security. Do not conflate with validators.
3. **The `SceneManager` decomposition** is the biggest lift and gates the shell's full
   quiescence benefit; split 5a/5b/5c to stay landable.
4. **Three CI gates fight the eviction** (knip, hostSizeBudget, doc-drift) plus three
   scene test files — every deletion updates its paired doc/test in the same commit.
5. **Keepalive raises baseline DOM/memory** unless `active` is genuinely wired into
   effects, not just the DOM.
6. **Missing overlay primitives** — no generic Drawer/Popover exists; the Dock drawer
   and classifier are built from `ConfirmDialog`'s plumbing; watch the mobile
   virtual-keyboard collision with the browser search inputs inside a bottom drawer.

---

## 6. Verdict (from the adversarial reviewer)

> "Not buildable exactly as written, but the spine is sound and the load-bearing
> safety constraint holds." The sequencing philosophy (tokens → frame → dock shell →
> drag keystone → sheet eviction → scene decomposition) is correct, and the
> shared-keystone insight (Sheet/Scene/Dock drop-classification are one system) is the
> plan's best call. The four fixes above (rehome creation/campaign/scene-authoring;
> resolve the scene-state seam; build the sheet-dispatch seam before the dock claims
> operability; split Phases 3 and 5) make it buildable along the order it proposes.

This document reflects those fixes. Next concrete step: build the §4 prototype behind
Phases 1, 2 (the seam), and 3a/3b — one branch, verifiable end to end, before any
broad eviction.
