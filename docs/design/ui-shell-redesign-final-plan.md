# UI shell redesign — FINAL plan (adversarial tournament of record)

**Date:** 2026-07-08 · **Supersedes:** `docs/history/ui-shell-redesign-plan.md`
(kept as the first-pass synthesis) · **Basis:** all compiled research —
`vtt-ui-ux-research.md` (Owlbear Rodeo principles), the first plan, and the
commissioned pragmatic handoff (`scratchpad/.../design_handoff_ui_restructure/`).

**Method:** a 57-agent adversarial tournament — four conflicting camps staked out,
each red-teamed from five hostile lenses and made to defend, four weighted judges
scoring comparatively, synthesis of the survivor with grafts, then **four rounds of
loop-until-dry hardening**. Every concrete claim is grounded in real file:line
anchors via the knowledge graph. Load-bearing invariant throughout: the deterministic
event-sourced core `src/scene/runtime.ts` and its 12 `SceneActionIntent` variants are
**never touched** — every new gesture emits an existing controller handler or intent.

---

## STATUS — most of this plan has been built (verified against code 2026-07-26)

**This document is the direction and the reasoning, not the status record.**
`docs/MASTER_PLAN.md` ("UI Shell Redesign" track) is the authoritative per-phase
record; `ui-redesign-phase-build-specs.md` is the re-grounded task-level spec. Where
this document and either of those disagree, they win; where any document disagrees
with the code, the code wins.

Read the phase sections below as *what was specified and why*. Each carries an
**As built** line stating what actually happened.

| Phase | As built |
| --- | --- |
| 1 — declutter | Shipped, complete |
| 2 — structural substrate | Shipped, all three parts (reducer, keepalive stage, sync pause/resume-with-reconcile) |
| 3 — five-tab dock + bestiary off the sheet | Shipped |
| 4 — pointer-drag keystone | **Shipped behind a default-off flag, not end-to-end gated.** No user sees it |
| 5 — sheet eviction | **Half shipped.** The dispatch half is complete at 7 of 7 systems; the eviction half — deleting the in-sheet browser wrappers and collapsing the tab grids — did not happen. The dual-home the plan capped at "one chapter" is still live |
| 6 — scene canvas | **Roughly 1 of 5 slices.** The transform render landed as an opt-in alternative behind a default-off flag; 5a, 5b, 5d and 5e are open |
| 7 — hardening/budgets | **1 of 5 deliverables** (budgets). Chrome-dominance is blocked on Phase 6's unshipped right-rail tray, not merely undone |

**The two flag-gated phases are not "complete."** Phases 4 and 6 ship behind
`VITE_SCENE_DRAG_ENABLED` and `VITE_SCENE_CANVAS_ENABLED`, both defaulting OFF, and
no CI job builds with either enabled. Their acceptance specs therefore do not run:
`e2e/scene-drag.spec.ts` calls `test.skip` on every current run, and the spec'd
scene-canvas e2e gate was never written at all. The engines are unit-tested; the
user-facing behaviour is not gated end to end, and no user experiences it. Anyone
summarizing this work should say "shipped behind a default-off flag, not end-to-end
gated" and mean it.

**Sequencing consequences that follow from the above, and are easy to miss:**

- Phase 4's drag drop target is wired to the DOM grid only. Enabling the Phase-6
  canvas flag disables drag (`sceneDragEnabled && !sceneCanvasEnabled` in
  `src/components/SceneManager.tsx`), so the two flags are mutually exclusive in
  practice and cannot be turned on together to preview the destination.
- The canvas render also does not carry the map-image layer the DOM grid renders,
  which is a second reason its flag is off.
- Phase 5's eviction half is a *precondition the plan set for itself* — the "transient
  dual-home capped to one chapter" risk below is no longer transient.
- Phase 7's chrome-dominance gate is blocked on Phase 6 slice 5b, exactly as Finding
  20 predicted. That prediction held; the work did not follow.

---

## 0. Read this first: what the tournament settled, and what it did NOT

**The central question** — is the owner's "slop" a *layout* problem (reorganize, reuse,
ship fast) or an *interaction* problem (drag-drop, canvas-first, greenfield)? — was
resolved as **both, in sequence, not in tension.** Ship the pragmatic handoff frame as
the declutter that lands in days (the owner literally named the home scroll), then
layer the Owlbear interaction — one summonable dock, pointer-drag, drop-time classify,
canvas-first Scene — as separately-shippable chapters, with the single riskiest
greenfield work (the pointer engine, then the canvas rewrite) built **last**, on a
frame that already shipped and stabilized.

**Honest caveat — the hardening did NOT converge.** The loop was set to stop after two
consecutive clean red-team rounds; it ran the full four-round cap still finding
material defects each round (8 → 8 → 6 → 7 critical/high). This is not a failure of the
plan so much as a property of the target: adversarially auditing a redesign of a
~400k-LOC app surfaces real edges faster than four rounds can close them. **The
strategy survived all four passes intact** — every defect was *claim-fatal, not
camp-fatal*: a dropped flow to re-home, a compound seam to enumerate, a mislabeled
refactor to re-scope, a CI-gate to widen. So treat this document as: **the direction is
locked and the phase spine is sound; the phase-level detail will keep spawning edge
cases during implementation** — budget for that, and gate each interaction chapter on a
real felt signal rather than assuming the spec is final.

## 1. The tournament result

**Winner: Staged Convergence** (the Integrator camp) — 3 of 4 judges ranked it #1; the
4th (the UX Purist) ranked it #2 and conceded it reaches the same research-faithful
destination on a de-risked onramp.

| Camp | Owner | Staff Eng | PM | UX Purist |
|---|---|---|---|---|
| **Staged Convergence** | **44** | **42** | **43** | 41 |
| The Pragmatist (ship handoff only) | 36 | 37 | 39 | 34 |
| Owlbear-Grade or Bust (interaction-first) | 34 | 31 | 34 | **38** |
| The Surgeon (fix the sheet first) | 31 | 29 | 35 | 36 |

_(Scores are each judge's sum over six axes: fixes-clutter, buttery, feasibility,
ships-early, research-fidelity, constraint-safety, 0–10 each.)_

**Why it won:** it is the only camp that refuses to force a choice between the owner's
two headline demands ("not cluttered" AND "buttery"). Its Chapter 0 *is* the Pragmatist
handoff, so its shippable floor equals the safe camp's entire ceiling; then it commits
to the Owlbear destination on an **inverted risk curve** — value in days, greenfield
keystone last. Every attacker conceded its two core engineering calls: (1) modeling
navigation as **one total discriminated union from day one** makes the frame→shell
evolution a one-module refactor instead of an app-wide rewrite (the "build-twice"
trap); and (2) building the pointer engine and canvas rewrite **last**, on stable
ground, strictly dominates the interaction-first ordering that ships nothing
user-visible until the scariest code lands.

**Grafts kept from the losing camps:** the frozen-core invariant + one shared dock as
the right answer to "bestiary buried in a character" (Owlbear); a real prototype
*gate* that proves-or-kills the riskiest bet cheap (Owlbear); pain-per-session
prioritization that makes sheet eviction a near-term chapter, and *deleting* the
read-only bestiary rather than relocating it (Surgeon); and "merge creation-as-dialog
+ the view switch in ONE atomic PR" plus "collapsible sections must hide, never
unmount" (Pragmatist).

## 2. The six resolved decisions

The bare [Library|Sheet|Scene] switcher silently drops flows that live in the deleted
landing scroll; the tournament resolved each (defaults now decided, not deferred):

1. **Creation / import / export / delete** — "New Character" button → portaled
   `NewCharacterDialog`; **Import re-homed** to a rail control + `CharacterListView`
   overflow; and critically (red-team Finding 18) per-character **Export + Delete**,
   which live in the same dissolving `AppHeader {currentDoc && …}` block, re-homed to
   the Sheet-surface overflow + per-card overflow. `GameSystemSelector` is kept alive
   because it renders doc-drift-guarded tokens.
2. **Campaigns** — Library is a **two-pane** Characters | Campaigns | Scenes surface,
   not another scroll; campaign detail opens in the right pane; the campaign↔scene link
   is bidirectional and `CampaignManager.onOpenCharacter` is a cross-segment sheet-open
   writer.
3. **Scene authoring/selection/recap** — a real select-only `LibraryScenesView` is the
   canonical home; creating/importing a scene there selects it **and** flips to the
   canvas (preserving today's "create it and you're looking at it"); the App-owned
   `onLogToCampaign` recap callback is preserved as a distinct seam.
4. **Drag form factor** — **pointer-events** (touch/PWA parity), **not** HTML5
   dataTransfer; **inline-chip** classifier first (reusing `ConfirmDialog` plumbing),
   radial wheel deferred; serves **only** the Scene canvas.
5. **Verb model (convergence decision A)** — **HYBRID**: spatial pointer-drag **only**
   on the Scene canvas (where position carries meaning); **click-to-add + keep the
   existing one-tap inline controls** on the dense sheet. The sheet has **no drop
   targets at all** — attackers proved drag-on-sheet is objectively slower than the
   existing toggle.
6. **Role / read-only (convergence decision B)** — the role toggle is
   **disclosure-only, never enforcement**; no GM/player auth, and **no read-only/view
   mode** (the `onUpdate={canEdit?…}` gating is dropped — sheets stay always-editable),
   because building it would create an enforcement path a single-user local-first app
   must not have.

## 3. Target shell

Three primary **surfaces** — Library / Sheet / Scene — in a keepalive `SurfaceStage`
(exactly one visible at ~90% of pixels; the others mounted and quiesced). **All**
navigation lives in ONE total discriminated union (`useAppNav`):
`{surface, librarySegment, sheetDocId, sceneId, overlay}`, written first with a
compile-time `assertNever` over both discriminants. Opening a sheet is one **compound**
`openSheet(docId)` action wired into all **six** writers; selecting a scene is one
compound **five-writer** seam (two of which relocate into `LibraryScenesView`). The only
always-visible chrome is a ~52px header rail (segmented switcher, context identity,
New Character + Import, dock-summon, disclosure-only role toggle, sync/theme; the
current character's Clone/Export/Delete in a Sheet-surface overflow). Orthogonal to the
surface axis is ONE summonable **dock** of five typed tabs — **party** (from App
`documents`, drag-to-scene only) + monster/spell/feat/equipment (SRD via
`useDockResources`) — built on the existing `Tabs.tsx`. Interaction is hybrid (drag on
canvas, click-to-add on sheet). No react-router (hash-sync in hardening); no DnD
library until the pointer engine proves out; no multiplayer identity.

---

# The seven phases

Each phase ships user-visible value on its own; ordering is tokens/frame → substrate →
dock → drag keystone → sheet eviction → scene canvas → hardening. Phase detail below is
the hardened output (findings folded in).

**Each phase records Goal, Ships-on-its-own, As built, and Risk — the intent and the
reasoning.** The ordered build tasks, file lists, test blast radius, acceptance gates
and CI-gate pairings live once, in `ui-redesign-phase-build-specs.md`, which re-verified
every anchor against source and corrected the drift this document carries (notably
`src/context/` → `src/contexts/`, and the doc-drift guard being fifteen paths rather
than thirteen). Do not restate them here; that duplication is what made these two
documents disagree.

## Phase 1 — Declutter: handoff frame, total nav seam, compound openSheet + scene-selection, lazy-mount-on-first-visit SceneManager, Export/Delete re-home, left-rail-only Scene declutter

**As built: shipped, complete** (three PRs, 2026-07-09 → 2026-07-14). Nothing deferred.

**Goal:** Replace the resting scroll cascade (App.tsx L511-648) with header-tab views backed by a single TOTAL discriminated-union nav model; model sheet-open as ONE compound openSheet(docId) action wired into all SIX writers AND scene-selection as ONE compound five-writer seam (Finding 16); move creation AND import AND the current character's export/delete into the rail/dialog/overflows (Finding 18), keeping the doc-drift-guarded GameSystemSelector alive; ship a real select-only LibraryScenesView; lift scene selection to a controlled prop; relocate ONLY the LEFT scene-list rail so the grid widens with no lost function (Finding 20); keep the stateful SceneManager on its existing React.lazy() split, lazy-mounting-then-keepaliving it on FIRST Scene visit (Finding 17, NOT mounted from boot); preserve its App-owned onLogToCampaign prop; and rewrite EVERY affected test suite — all in ONE atomic PR.

**Ships on its own:** The home page becomes ONE thing (Characters, default), with Campaigns / Scenes / Library as sibling views behind header tabs; a 'New Character' button -> one-click dialog and an 'Import' control replace the always-present grid + action bar; from an open sheet you can still Clone, Export, and Delete the current character; a real select-only scene picker lets you pick, create, or import a scene and land on the live canvas; the Scene surface loses its cramped LEFT list rail (its content now lives in Library) so the grid widens, while every operating panel stays exactly where it is; opening a character from anywhere (list, clone, import, campaign card, header switcher) reliably shows the sheet; switching to Scene and back preserves in-progress combat/placement/initiative with no layout stutter and NO first-paint/bundle regression (SceneManager stays lazy). The single biggest decluttering win landing in days, with no feel regression on either named slop surface.

**Risk:** The TOTAL useAppNav union is the load-bearing hinge — nav must be NOT flat AND NOT partial (assertNever must compile). Atomicity is mandatory: deleting the GameSystemSelector usage without the dialog severs create; GUTTING GameSystemSelector/SystemStatusDashboard drops doc-drift-guarded tokens unless rules.ts+manifest.ts are edited in-commit (default keeps them alive); deleting the action bar without re-homing Import strands the default view, and without re-homing Export/Delete orphans single-character export/delete (Finding 18); MOUNTING SceneManager from boot de-lazies the heaviest component / force-loads its chunk at first paint with no offsetting deletion (Finding 17) — so it MUST stay React.lazy() and mount only on first Scene visit; using display:none OR content-visibility:auto on the mounted SceneManager stutters every tab-to-Scene (Findings 7+14); dropping onLogToCampaign orphans the recap write; porting ANY sheet-open OR scene-selection writer to a bare id-set strands the user (clone/import/campaign-card for sheets — Finding 11; scene create/import for scenes — Finding 16); COLLAPSING the RIGHT operating rail in Phase 1 hides operating tools with no reopen UX (Finding 20) — only the LEFT list rail relocates; and omitting ANY render(<App/>) or direct-SceneManager-mount suite reddens verify's coverage gate. The controlled five-writer scene-selection edit MUST precede LibraryScenesView in the same PR. The left-rail relocation is a small intentional VISIBLE change decoupled from the behavior-preserving relocation.

## Phase 2 — Structural substrate + pause/resume-with-reconcile on the SHARED sync engine

**As built: shipped, all three parts.** The reducer landed as the two-file split the
build specs corrected to (`src/contexts/shell-context.ts` + `ShellContext.tsx`, plural
directory — this document's `src/context/` singular was wrong). `SurfaceStage.tsx`
keepalives the three surfaces and is now hard-gated by `npm run check:keepalive-budget`.
The `active` pause/resume knob with its mandatory reconcile landed on the shared
`useEntitySync`, with `reloadScenes()` on Scene reactivate rather than listener-gating,
exactly as Finding 2 required. One deviation worth knowing: `SurfaceStage` takes
`ReactNode` slots instead of the three spec'd `surfaces/` wrapper components, so
`src/components/surfaces/` was never created and Phase 6's "flesh out the Phase-2
SceneSurface stub" has no stub to flesh out.

**Goal:** Swap useAppNav's internals for a ShellContext reducer + keepalive SurfaceStage (generalizing the Phase-1 first-visit lazy-mount to all three surfaces); promote the Sheet to a mounted keepalive peer; and add a genuine `active` pause/resume knob to the SHARED useEntitySync hook with a mandatory reconcile on reactivate — NOT a leaf-file DOM `hidden` flag.

**Ships on its own:** Instant, state-preserving surface switching with real quiescence AND correctness: flipping Library -> Scene -> Sheet no longer rebuilds or flashes, each surface keeps its scroll/filter/selection position, hidden surfaces stop their realtime sync, and a reactivated surface immediately catches up on anything that changed while it was quiesced — no stale data.

**Risk:** Quiescence is a net-new pause/resume-with-reconcile capability on the shared engine, NOT a free refactor — pausing a supabase realtime channel without the sync() catch-up on reactivate is a correctness bug, so the reconcile is mandatory and tested. Aiming the knob at useScenes/syncEngine leaf files would silently drop cross-tab edits. Keepalive raises baseline DOM/memory; needs real PWA device testing for mobile dvh + keyboard insets. Bundle-size pressure peaks (shell added, nothing deleted yet) — lazy-mount surfaces off the eager index chunk (the SurfaceStage first-visit mechanism, generalizing Phase 1's SceneManager treatment, is what keeps this in budget).

## Phase 3 — Shared Dock (five tabs, click-select) + party tab from App documents + SheetDispatchContext + delete the bestiary

**As built: shipped.** `src/dock/` carries the five typed tabs (party, monster, spell,
feat, equipment) and `src/contexts/SheetDispatchContext.tsx` inverts control as spec'd.
The read-only monsters tab is gone from the 5e sheet strip. One nuance the plan did not
anticipate: the bestiary is now single-homed *off the sheet* but double-homed *within
the shell* — it is reachable both from the dock's monster tab and from a Library
`bestiary` segment (`src/components/LibraryBestiaryView.tsx`, added later by RFC 004).
That is not the "two-bestiary state" the kill-list warned about, which was specifically
a browser buried inside a character; but it is two shared-layer homes for the same
catalog, and nothing in this plan decided that.

**Goal:** Stand up the one summonable content dock with FIVE tabs (adding a party tab sourced from the App documents prop — Finding 15), invert control so the shell dock dispatches into a per-sheet handler registry, and evict the read-only Monsters tab from the 5e sheet. (The scene emit seam and the party tab's drag wiring are NOT exposed here — they move to Phase 4 with their consumers.)

**Ships on its own:** A single summonable Dock of typed content tabs reachable identically from every surface via click-select; the dock's spell/feat/equipment tabs click-add into the current sheet; a browsable PARTY tab shows your character roster (its drag-to-scene verb arrives Phase 4), replacing the PlacementMode roster's browse function; the bestiary leaves the character sheet entirely. The IA fix the owner named.

**Risk:** The SheetDispatchContext seam is real engineering; a shell-scoped dock reaching a systems/** controller must invert control to respect the eslint boundary. The party tab must NOT go through useDockResources (it is App-state-sourced, not SRD) and must NOT expose a click-to-add-to-sheet verb; it is browse-only until its Phase-4 drag consumer lands, so it is user-visible content (roster), not dead code. hostSizeBudget: Dnd5eSheetBase.tsx gains only a 1-2 line registration — measure it. Transient dual-home for spell/feat/equipment starts here — route both through useDockResources and cap to Phase 5. Before deleting ANY sheet tab, check the doc-drift.rules.ts file-path guard (Findings 12+19). Coverage: new dock/loader/party-tab branches ship tests in-PR.

## Phase 4 — Drag keystone + bound emit seam + party-tab drag source + TWO-part prototype GATE + dynamic-viewport probe + PlacementMode mutual-exclusion

**As built: shipped behind a default-off flag, not end-to-end gated.** The greenfield
engine exists (`src/components/drag/`), the bound emit seam exists, the party tab is a
real drag source, the PlacementMode mutual-exclusion keys off the same single predicate
as the plan demanded, and the two-part gate was genuinely evaluated rather than
asserted. But `sceneDrag` defaults OFF in the flag registry, no CI job builds with
`VITE_SCENE_DRAG_ENABLED=true`, and `e2e/scene-drag.spec.ts` opens with a `test.skip`
that fires on every current run. The engine is unit-gated; the user-facing gesture is
not gated end to end and no user has one. **Do not call this phase complete.** The
reconcile-budget check also has a known flake history under full-suite load — the
wall-clock problem the Phase-7 budgets doc analyses at length.

**Goal:** Build the generic pointer-events drag engine, expose the zero-arg emit(intent) scene-dispatch seam WITH its DragLayer consumer, wire the party dock tab as the character-document drag source, prove the interaction thesis on TWO honestly-scoped flows (a genuine 1-choice auto-apply AND the monster 2+ inline-chip classifier), PROBE the live-viewport unknowns, and gate the legacy PlacementMode entry OFF for every drag-covered kind — all on the risk-carrying transformed surface, before any broad eviction.

**Ships on its own:** Drag a PARTY character-document token onto the scene and it drops where you release with NO menu (true auto-apply); drag a bestiary monster and a minimal friendly/hostile chip resolves its allegiance before it lands; for those two kinds the old click-'Place token'-then-click-cell machine is gone (one affordance per kind). The first genuinely Owlbear-grade gestures, on the stable Phase-1/2 frame — with the fund/kill decision made against a realistic post-drop reconcile budget AND a dynamic-viewport probe that de-risks the Phase-6 pan/zoom subsystem.

**Risk:** The pointer engine is unavoidably novel (zero DnD code, no lib, PWA touch). This IS the pass/fail gate — de-risked ONLY if it measures FEEL on the transformed ~900-cell surface for BOTH the 1-choice PARTY character-document drop AND the 2+ monster chip (Findings 9+15); a green gate on the trivial untransformed grid, a faked '1-choice' monster drop, or a 1-choice gate with no real character-document source licenses nothing. The party tab (Finding 15) is the load-bearing new source — if it slips, the fallback 1-choice example is a manual/marker token. The PlacementMode mutual-exclusion (Finding 21) must key off the SAME flag as the drag path so exactly one affordance exists per kind in every flag state. The dynamic-viewport probe (Finding 10) PROBES pan/zoom, it does not retire it; the viewport subsystem still carries its own Phase-6 gate. runtime.ts is not touched. Coverage: the branch-heavy pointerEngine + the pulled-forward chip + party drag-source MUST ship tests.

## Phase 5 — Sheet eviction (click-to-add ONLY) + tab-grid collapse + felt micro-feedback + full runtime-copy guard discipline

**As built: the dispatch half shipped at 7 of 7; the eviction half did not ship.**
Every system now publishes whatever add-handlers it actually has into the Dock's
dispatch registry, and the resolved capability matrix is asserted system by system —
honestly asymmetric, because two systems carry no shared Spell/Feat/Item concept and
correctly publish nothing. That part is done and gated.

The phase's *name* is not done. The in-sheet browser wrappers this phase exists to
delete are all still present and still rendered: `Dnd5eFeatBrowserTab`,
`Pf2eFeatBrowserTab`, `Pf2eEquipmentBrowserTab`, `Pf2eSpellBrowserPanel`,
`D20FeatBrowserTab`, `D20EquipmentBrowserTab`, `D20SpellBrowserPanel`,
`MamPowerBrowserTab`, `MamAdvantageBrowserTab`, `MamEquipmentBrowserTab`. The tab grids
were not collapsed. Consequently the "transient dual-home for spell/feat/equipment,
capped to one chapter" in the Risk note below is **not transient** — every affected
system browses the same catalog from two places today, which is the exact condition
this phase was scheduled to end. Treat that as the live gap, not as an accepted
boundary; nothing on record says it was consciously deferred.

**Goal:** Make the character sheet only the character: evict the src/systems/** catalog browser wrappers, collapse the tab bars, and add content via click-to-add + kept inline controls — the sheet has NO drop targets (Finding 8) — one system per atomic PR, with host additions kept near-zero via sibling extraction AND every DELETE OR EDIT of a RUNTIME_COPY_RULES-guarded file paired with its doc-drift.rules.ts + manifest.ts edit (Finding 19).

**Ships on its own:** Per system, the sheet drops from a 10-across tab strip to ~6 real character sections; adding a spell/feat/item is one tap (existing inline control) or a dock click, with an immediate felt beat (toast + count-badge animation) on that FAST path; a sticky vitals spine surfaces Header/Classes/Overview. The most-touched surface stops being slop. Sheets stay always-editable.

**Risk:** FOUR CI gates fight the deletions: knip, hostSizeBudget (per-file host LOC — NOT offset by sibling deletion), doc-drift, AND the coverage thresholds. CRITICALLY (Finding 19), doc-drift fires not only on DELETING a *BrowserTab but on EDITING any of the six guarded inline files the tab-grid collapse reworks (Dnd5eSpellsTab, Pf2eSpellsTab, D20SpellsTab, Dnd5eSelectedFeatsSection, Dnd5eFeatureOptionsSection, MamArchetypesTab): dropping/renaming a guarded support-note token during the collapse reddens check:doc-drift inside verify and blocks the atomic PR. Each PR must delete/edit the guarded file AND update its paired rules.ts+manifest.ts+test AND keep host LOC near-zero via sibling extraction AND ship the sibling's tests AND run check:doc-drift — all in one commit. Because the sheet no longer drags, the per-system drag-classifier matrix is DISSOLVED — the only remaining classifier is the scene-generic allegiance chip (Phase 4/6).

## Phase 6 — Scene canvas (canvas-first; honest split) + right-rail summon tray + the recap seam + relocate the scene classifier + final PlacementMode deletion

**As built: roughly one slice of five, and that one is opt-in.** Only 5c-i landed:
`src/components/SceneCanvas.tsx` renders the scene as a pure view over `SceneState` and
dispatches no intents, so the frozen-core invariant holds. But it is an **alternative**
to `SceneGridView`, not the replacement 5c-i specifies — `SceneGridView.tsx` is still
present and still the rendered default, `VITE_SCENE_CANVAS_ENABLED` defaults OFF, no CI
job enables it, and the spec'd scene-canvas e2e gate was never written. Two further
reasons the flag stays off, neither recorded in the spec: the canvas branch does not
receive the map-image layer the DOM grid renders, and drag is wired to the DOM grid
only, so enabling the canvas disables drag.

Open: **5a** (`SceneManager.tsx` is ~1220 lines, undecomposed), **5b** (the 20rem right
operating rail is still docked — which is what blocks Phase 7's chrome-dominance gate),
**5d** (no viewport, no pan/zoom), **5e** (no ruler, no marker drag path). The
PlacementMode machine is fully live, from the type declaration through every toggle and
cell handler. Whether these were consciously deferred or simply not reached is recorded
nowhere, so they are open, not accepted boundaries.

**Goal:** Make the grid canvas the page: decompose the monolith into a thin SceneSurface that owns BOTH the emit(intent) seam AND the App-owned onLogToCampaign recap callback (Finding 4); demote the RIGHT operating rail (still docked since Phase 1 — Finding 20) into its designed summon tray + GM overlay; then, in THREE separately-gated slices (Finding 10), replace the grid with a fixed-1:1 transform-positioned RENDER, add the pan/zoom VIEWPORT subsystem with its OWN gate, and add the distance ruler; RELOCATE/HARDEN the Phase-4 allegiance chip; and DELETE the remaining PlacementMode machine (Finding 21).

**Ships on its own:** The Scene becomes a full-bleed canvas where the grid dominates and tools are summoned — the right operating rail finally demotes into a two-level summon tray + GM overlay (its FIRST demotion, with designed reopen UX, per Finding 20), a transform-positioned render, then user-controlled pan/zoom, then a live distance ruler — AND logging a session recap back to a linked campaign still works after the decomposition. The surface a VTT actually lives on finally feels buttery, and 'canvas dominates' + the chrome-dominance budget become true here for the first time.

**Risk:** 5c-i + 5d + 5e together are the single most expensive item — but SPLITTING them (Finding 10) is the whole point: 5c-i retires the static coordinate case pre-measured in Phase 4, 5d is a 100% greenfield viewport whose costs are only PROBED (not retired) by the Phase-4 dynamic spike and so carries its OWN gate, and 5e is a discrete feature. This is ALSO where the right operating rail demotes for the first time (Finding 20) — its summon tray must ship WITH designed reopen UX, never a bare collapse boolean. Mitigated by landing LAST on a stabilized frame. onLogToCampaign must be explicitly threaded through SceneSurface or the recap write is silently dropped (acceptance test guards it). The allegiance chip is RELOCATED, not rebuilt. The PlacementMode deletion must confirm every kind's drag path is live first (Finding 21). Coverage: the branch-heavy canvas + viewport must ship tests or be excluded.

## Phase 7 — Hardening, chrome + coverage + host-LOC budgets, seam doc, decision gate

**As built: one deliverable of five.** The perf/bundle budgets landed and the keepalive
frame budget was promoted from soft log to hard CI gate; the derivations, the
hard-gated/soft-logged ledger, and the reasoning for choosing a counted rather than a
wall-clock gate live in `ui-shell-phase7-budgets.md`, which is the record of that half.
Open: hash-sync restore-on-reload, the chrome-dominance gate, the seam catalogue and
constraint set of record, and the owner usability sign-off. Chrome-dominance is
**blocked**, not merely undone — Finding 20 predicted it could only be satisfied after
Phase 6's 5b demotes the right rail, 5b has not shipped, and the rail is still docked.

One correction this phase must carry: the "13-path doc-drift-rules guard" cited in the
Goal and Risk below is **wrong**. The guard is fifteen file-path-keyed entries; the
build-specs doc caught this and the constraint set of record must state fifteen (or
derive the count) rather than reproduce the stale number.

**Goal:** Restore-on-reload, make canvas dominance a CI gate (anchored to Phase 6, not Phase 1 — Finding 20), formalize the constraint set (coverage, host-LOC, the 13-path doc-drift-rules guard — Finding 19), document the role/read-only model and ALL app-facing seams (three scene seams incl. the FIVE-writer selection seam + the compound six-writer sheet-open seam), and gate future investment on a real felt signal.

**Ships on its own:** Reload restores your exact surface/sheet/scene position (no router); the app enforces its own 'canvas dominates' promise in CI once the right rail demotes; the owner confirms each shipped chapter actually feels buttery.

**Risk:** The chrome-dominance budget must be measured (viewport pixel ratio), not asserted, and CANNOT be enforced until Phase 6 demotes the right operating rail (Finding 20) — anchoring it to Phase 1 would either fail (the 20rem rail is ~320px of chrome) or force the very premature right-rail collapse Finding 20 forbids. The coverage, host-LOC, and 13-path doc-drift-rules gates are already live in CI — Phase 7 only documents them; the real enforcement happened per-PR in Phases 1-6.

---

# Kill-list — ideas considered and rejected (with why)

The tournament's value is as much in what it refused as what it kept. Selected rejections:

- **✗** 'Ship the Handoff, Nothing More' (Pragmatist, strict): LOST because the brief names 'content browsers (bestiary!) buried as tabs inside a single character' and four mutually-exclusive top-level tabs move the bestiary one hop FARTHER from an active scene than today; it delivers 'differently arranged,' not 'buttery.' Kept as Phase 1, then continued.
- **✗** Owlbear canvas-first as the FIRST move: LOST on risk ordering — it front-loads the single riskiest greenfield work before ANY user-visible payoff. Reordered to engine-last on a stabilized frame.
- **✗** Drag as the dominant verb on the SHEET: LOST because Dnd5eSpellsTab already ships a one-tap onTogglePreparedSpell, and prepared/known/favorite is intrinsically 2+ so the buttery '1 choice = auto-apply' path NEVER fires on the sheet. Replaced by click-to-add + kept inline controls; the sheet has NO drop targets.
- **✗** Registering owned SHEET tabs as drop targets / 'buttery drop on dnd5e first': LOST (Finding 8) — builds exactly the slower affordance forbidden above, contradicting Convergence Decision A. Deleted entirely; the sheet verb is click-to-add via EXISTING per-system controller handlers, UNIFORM across all 7 systems.
- **✗** 'One keystone every surface inherits' (uniform classify()): LOST because the eslint layer boundary bans a shared-layer dock value-importing singlePreparedCasterLimit. Replaced by a split: generic drag mechanics build-once, drop-time classification confined to the scene-generic Scene canvas, and the sheet's per-system add-destination handled by EXISTING controller handlers via inverted-control SheetDispatchContext click-to-add.
- **✗** Sourcing the Phase-4 1-choice character-document drop from one of the four SRD dock tabs, or from no scheduled source at all: LOST (Finding 15) — the dock tabs (monster/spell/feat/equipment) are all SRD catalogs (MonsterBrowser/SpellBrowser/FeatBrowser/EquipmentBrowser) and contain NO character-document source; character documents live only in App state (documents: CharacterDocument[]) and reach the Scene via SceneManager's documents prop + the L529 roster, never the dock. With no source, sub-gate 3b-i cannot run and the fund/kill decision silently collapses to only the 2+ monster-chip case the plan insists is NOT the buttery path being proven. Replaced by a FIFTH 'party' dock tab sourced from the App documents prop (not a SRD loader), scheduled Phase 3 (browse-only) with drag wiring Phase 4, replacing the PlacementMode roster's browse function; the fallback 1-choice example is a manual/marker token.
- **✗** Modeling the Phase-1 controlled scene-selection lift as a thin 2-site edit (L109 init + L143 auto-reset): LOST (Finding 16) — SceneManager has FIVE selection writers (L109, L143, L807 select-first-imported, L872 select-just-created, L926 rail-click), and the two omitted (L807/L872) live inside the create/import block that RELOCATES into LibraryScenesView, so porting them to a bare id-set would add an imported/created scene but never select/open it — the identical strand-the-user bug the plan elevated to a headline for sheets. Replaced by a compound five-writer seam: L807/L872 relocate into LibraryScenesView and call onSelectScene(newScene.id) AND dispatch {surface:'scene',sceneId}, with create/import-then-open acceptance gates.
- **✗** Leaving 'does creating a scene in Library flip to the canvas?' undecided: LOST (Finding 16) — an unresolved surface transition on create/import. Resolved: creating OR importing a scene in LibraryScenesView selects it and dispatches {surface:'scene',sceneId}, landing you on the live canvas, preserving today's 'create it and you're looking at it' (import selects imported[0]).
- **✗** Keeping SceneManager MOUNTED from boot whenever surface!==scene (de-lazying it): LOST (Finding 17) — SceneManager is React.lazy() (App L30-31) mounted only in the scene branch (L624); mounting from boot either force-loads its lazy chunk at first paint for every user or pulls the 1207-line subtree into the eager index chunk, a direct TTI/bundle regression with ZERO offsetting deletion (browser deletes are Phases 3/5) in the PR billed 'the declutter, in days,' and runs foldSceneEvents (L155) at boot for users who never open a scene. Replaced by keeping React.lazy() and lazy-mounting-then-keepaliving SceneManager on FIRST Scene visit (state preservation only matters after the first visit), with a Phase-1 bundle/TTI acceptance check.
- **✗** Orphaning per-character EXPORT and DELETE when the AppHeader {currentDoc && ...} block is restructured: LOST (Finding 18) — Export (AppHeader L128 / App L437) and Delete (L147 / L439) live in the very block being dissolved, and CharacterListView exposes only bulk onExportAll (L89) with NO per-card export/delete, so single-character export/delete would become unreachable. Finding 11 accounted only the six setCurrentDocId WRITERS; Export/Delete are non-writer siblings that fall through it. Replaced by re-homing onExport+onDelete of the current character into the Sheet-surface header '...' overflow AND adding per-card Export/Delete to CharacterListView's overflow, in the same Phase-1 PR as Import (delete routes through the L286 closeSheet path).
- **✗** Treating the doc-drift runtime-copy guard as three file paths and firing the check only 'before DELETING a *BrowserTab': LOST (Finding 19) — RUNTIME_COPY_RULES pins THIRTEEN paths (L295-381), and SIX are per-system inline tab/section files Phase 5 EDITS not deletes when it collapses the tab grid (Dnd5eSpellsTab L340, Pf2eSpellsTab L366, D20SpellsTab L335, Dnd5eSelectedFeatsSection L348, Dnd5eFeatureOptionsSection L358, MamArchetypesTab L374), so dropping a guarded support-note token during the collapse reddens check:doc-drift and the delete-only checklist never fires. Replaced by the full guarded list in the Phase-5 file set (flagged EDITED, must preserve tokens), a checklist trigger rewritten to 'before EDITING OR deleting any RUNTIME_COPY_RULES path,' and check:doc-drift added to every per-system eviction PR's acceptance.
- **✗** Collapsing the 20rem RIGHT operating rail in Phase 1 to claim 'canvas dominates': LOST (Finding 20) — the right rail holds the panels you OPERATE the scene with (Token/Dice/Check/Oracle/Initiative/Combat/Marker), and the canvas is still non-interactive in Phases 1-3 (drag Phase 4, pan/zoom Phase 6) with no summon UX until Phase 6 5b, so a bare-boolean collapse ships a bigger emptier grid with operating tools hidden behind no reopen affordance — a feel regression masquerading as a win. Replaced by relocating ONLY the LEFT scene-list rail in Phase 1 (its content genuinely moves to LibraryScenesView, so the grid widens with no lost function), keeping the right rail docked until Phase 6 5b builds its designed summon tray; the Phase-1 change is re-labeled 'left scene-list rail relocation,' and the chrome-dominance CI budget anchors to Phase 6.
- **✗** Leaving the PlacementMode click-navigate-then-place machine live for drag-covered kinds through the Phase 4-5 window: LOST (Finding 21) — Phase 4 ships drag-to-place but the plan kept PlacementMode (L65/L114, badge L963) until Phase 6 5b, so for two phases the Scene carries TWO competing placement affordances per kind, one of them the exact navigate-then-place anti-pattern the redesign exists to kill. Replaced by gating each kind's PlacementMode entry point OFF under the SAME flag that enables that kind's drag path (character via 3b-i, monster via 3b-ii), so exactly one affordance exists per kind at every moment; the full machine deletion still lands Phase 6 5b (now only the uncovered kind + final removal).
- **✗** Describing the monster-from-dock -> scene-token drop as an unambiguous '1 legal choice = auto-apply, no menu' path: LOST (Finding 9) — buildPlacedToken resolves a statblock-backed NPC to kind='npc' and REQUIRES a tokenAllegiance, so the monster drop is intrinsically the 2+ case. Replaced by TWO explicitly-scheduled sub-gates: 3b-i a GENUINE 1-choice PARTY character-DOCUMENT drop that fires auto-apply with no menu, and 3b-ii a MINIMAL inline-chip classifier PULLED FORWARD for the monster case; Phase 6 relabeled harden/relocate-the-chip.
- **✗** Scheduling pan/zoom + the distance ruler inside Phase-6 5c as part of a 'render rewrite': LOST (Finding 10) — SceneGridView.tsx (fluid CSS grid, ZERO viewport transform) has nothing to decompose, so pan/zoom is 100% GREENFIELD. Replaced by splitting 5c into 5c-i (fixed-1:1 transform RENDER), 5d (pan/zoom VIEWPORT subsystem, own gate), and 5e (distance ruler), and extending the Phase-4 spike to a DYNAMIC-viewport probe.
- **✗** Claiming Phase 4 'already retired the coordinate math AND reconcile budget' for the pan/zoom canvas: LOST (Finding 10) — a live viewport adds variable-scale inversion, continuous ~900-element repaint, and pinch arbitration the static spike does not retire. Replaced by: Phase-4 spike PROBES the dynamic case, 5d carries its OWN gate.
- **✗** Modeling sheet-open as a bare sheetDocId set: LOST (Finding 11) — every setCurrentDocId is ALSO the implicit surface switch, so a bare port strands clone (L328), import (L346), and the cross-segment campaign-card click (L618). Replaced by a single openSheet(docId)=>{surface:'sheet',sheetDocId} action enumerating ALL SIX writers.
- **✗** Treating doc-drift as a single file (docs/doc-drift.manifest.ts): LOST (Finding 12) — the failing check (validateRuntimeCopySource over RUNTIME_COPY_RULES) lives in docs/doc-drift.rules.ts, keyed by FILE PATH. Replaced by adding rules.ts to the Phase-1/3/5 file lists, defaulting to keep guarded files alive, and pairing every guarded-file delete/EDIT with its rules.ts entry.
- **✗** Moving the system picker's support-note/badge rendering into NewCharacterDialog.tsx to satisfy the doc-drift guard: LOST (Finding 12) — the guard is keyed to the FILE PATH src/components/GameSystemSelector.tsx, so relocating the rendering does NOT satisfy it. Replaced by keeping GameSystemSelector.tsx alive as the token host (default) or editing rules.ts+manifest.ts in-commit.
- **✗** content-visibility:auto in the Scene mount-hide combo: LOST (Finding 14) — it SKIPS layout/paint off-screen and performs it at REVEAL time, RELOCATING the exact reflow visibility:hidden avoids. Replaced by visibility:hidden + off-screen only; the Phase-1 performance.measure compares THREE mechanisms and adopts content-visibility only if it wins AND is paired with contain-intrinsic-size + a reveal-time budget.
- **✗** CollapsibleSection that UNMOUNTS collapsed children: LOST because it destroys DicePanel.history and in-flight drafts. Replaced by mounted + CSS-hidden with a Playwright persistence guard.
- **✗** display:none for the mounted-hidden Scene SURFACE: LOST (Finding 7) — removes the ~900-gridcell subtree from the layout tree, forcing a synchronous re-layout on every tab-to-Scene. Replaced by visibility:hidden + off-screen position, gated by the Phase-1 three-way performance.measure.
- **✗** SceneCreateForm as the Library scene PICKER: LOST (Finding 1) — SceneCreateForm.tsx is verified create/import-ONLY (L18-19 'the parent persists and SELECTS it'). Replaced by a minimal standalone LibraryScenesView.tsx (select-only) PLUS SceneCreateForm for create/import.
- **✗** Threading the `active` quiescence flag into useScenes.ts / useCampaignSync.ts / syncEngine.ts leaf files: LOST (Finding 2) — useScenes has NO realtime timer (its cross-tab listener would silently DROP hidden-window edits if gated); syncEngine is stateless; the subscription lives in the SHARED useEntitySync hook. Replaced by an `active` knob on useEntitySync with a MANDATORY sync() reconcile on reactivate, and a loadScenes() re-read for useScenes.
- **✗** Measuring the Phase-4 butteriness GATE on the untransformed SceneGridView: LOST (Finding 3) — that path cannot exhibit the plan's own named jank. Replaced by routing BOTH sub-gate drops through the 3a spike's TRANSFORMED ~900-cell surface with an explicit post-drop reconcile budget.
- **✗** Orphaning the Scene->Campaign onLogToCampaign recap callback during decomposition: LOST (Finding 4) — it is NOT one of the 12 intents. Replaced by naming it the THIRD scene seam, preserved Phase 1, owned by SceneSurface Phase 6, with a recap-log acceptance test.
- **✗** Omitting the full-App flow suites from the Phase-1 test blast radius: LOST (Finding 5) — the flow suites render(<App/>) and drive a createCharacter helper that clicks deleted home copy. Replaced by treating every render(<App/>) suite as Phase-1 blast radius.
- **✗** Scheduling SceneManager.test.tsx / capabilityScenarios.test.tsx scene-selection edits for Phase 6 while the controlled-selectedSceneId prop lands in Phase 1: LOST (Finding 6) — both mount SceneManager directly and break the moment the prop contract changes. Moved into the Phase-1 PR.
- **✗** Horizontal, layer-by-layer phasing (re-host all browsers, delete from sheets many phases later): LOST because it strands the app in a two-bestiary state. Replaced by vertical, per-content-type/per-system atomic PRs.
- **✗** An inert 'shell dock Phase 0 with zero deletions': LOST because it adds browser LOC with no offsetting deletions and dispatches into the void. Replaced by co-located delete-with-add commits.
- **✗** Modeling nav as a 4-value activeView useState beside currentDocId: LOST because it makes the keepalive/reducer swap an app-wide rewrite. Replaced by the single useAppNav discriminated union.
- **✗** A PARTIAL nav union missing a case for scene selection: LOST — the build-twice trap in the exact hinge. Replaced by a TOTAL union written FIRST with assertNever over both discriminants.
- **✗** Exposing the scene-dispatch seam in Phase 3 with no consumer: LOST — it reddens knip. Replaced by a zero-arg emit(intent) landed in PHASE 4 WITH its DragLayer consumer.
- **✗** Phase-1 conditional-switching that UNMOUNTS SceneManager on tab-away: LOST — it destroys the ~30 transient useState. Replaced by mount-on-first-visit + keep-in-layout-tree (visibility, Findings 7+14+17).
- **✗** onUpdate={canEdit?onUpdate:undefined} read-only enforcement on the sheet: LOST — it CREATES the exact enforcement path Decision B relies on not existing. Read-only/view mode is OUT OF SCOPE.
- **✗** Treating hostSizeBudget as a repo/bundle-size figure offset by sibling deletion: LOST — it is a PER-FILE <=400-LOC ceiling on 5 named hosts. Replaced by sibling-module click-to-add extraction with per-PR host-LOC measurement.
- **✗** Omitting the coverage-threshold gate from the constraint set: LOST — verify runs test:coverage with hard thresholds. Added as a first-class gate: each new-file slice ships its own tests in-PR, or the Playwright-only module is added to the coverage exclude in the SAME PR.
- **✗** Import falling off the default (list) view: LOST — Phase 1 deletes the only list-mode Import entry while the header Import is gated behind {currentDoc && ...}. Replaced by re-homing Import beside Create + ungating AppHeader's onImport.
- **✗** react-router: LOST — no deep-linking or roles for a single-user local-first PWA; hash-sync in Phase 7 restores position.
- **✗** GM/player identity / role enforcement: LOST — no multiplayer identity; runtime.ts does zero authorization. The role toggle is disclosure-only.
- **✗** HTML5 dataTransfer drag: LOST — no touch parity on a PWA. Replaced by pointer-events (setPointerCapture, touch disambiguation).
- **✗** Radial classifier wheel as the FIRST form factor: LOST on cost — the inline-chip menu reuses ConfirmDialog's plumbing; the radial wheel is deferred to polish.
- **✗** Touching src/scene/runtime.ts or adding a 13th SceneActionIntent (including folding onLogToCampaign into an intent): LOST absolutely — it forfeits the frozen-core invariant. Every gesture emits one of the existing 12 intents; onLogToCampaign stays an App callback.
- **✗** The FULL h-dvh keepalive frame adopted in Chapter 0: LOST as premature — deferred to Phase 2. Distinct from the Phase-1 mount-on-first-visit fix, which only lazy-mounts the ONE stateful SceneManager on first Scene visit and keeps it laid out to prevent state loss without a reflow or a boot-time bundle cost.

---

# Open risks (carried, eyes-open)

**Re-scoped 2026-07-26 against what shipped.** The constraints this list originally
carried for Phases 1-3 were met and are recorded in those phases' As-built notes; they
are not repeated here. What remains below is what is still live, plus the two places
where reality diverged from what the list assumed.

- ⚠️ **The pointer-engine bet is de-risked but still unexercised.** The Phase-4
  gate ran against the transformed ~900-cell surface for both sub-gates, as required,
  and the party dock tab existed to make the 1-choice sub-gate genuine rather than a
  faked default allegiance. But the gesture ships behind a default-off flag with a
  skipped acceptance spec, so no user and no CI run has ever exercised it end to end.
  A unit-gated engine is not a proven interaction. This is still a bet.
- ⚠️ **The dual-home is no longer transient — this is the list's biggest miss.**
  The original risk was "dock + sheet copies of spell/feat/equipment between Phase 3 and
  Phase 5, capped to one chapter." Phase 5's eviction half did not ship, so the cap did
  not hold: every affected system still browses the same catalog from both the dock and
  its own in-sheet wrapper. Monsters remain exempt (the sheet tab was deleted in Phase
  3) and the party tab remains exempt (App-documents-sourced, never a sheet tab).
- ⚠️ **Placement still has two affordances for the uncovered kinds, and the machine
  is intact.** Finding 21's per-kind mutual exclusion shipped and keys off the same
  single predicate as the drag path, so the invariant holds in every flag state. But
  with the flag off — which is every shipped build — PlacementMode is the sole
  affordance for every kind, and the full machine (type, state, badge, three toggles,
  cell handlers) is still live. Its deletion needs Phase 6 5e's marker drag path first.
- ⚠️ **Pan/zoom is still 100% greenfield.** The Phase-4 dynamic-viewport spike
  PROBED coordinate inversion under variable scale+translate, continuous repaint at
  ~900 cells, and touch pinch arbitration — it did not retire them. 5d carries its own
  gate, distinct from the 5c-i render swap that landed and the 5e ruler that did not. Do
  not describe the math as "already retired in Phase 4."
- ⚠️ **Five app-facing seams must be threaded and must not drift**: the compound
  five-writer scene-selection seam, the zero-arg bound `emit(intent)`, the App-owned
  `onLogToCampaign` recap callback (still an App callback, never a 13th intent), the
  compound six-writer `openSheet(docId)` seam plus the re-homed Export/Delete, and the
  party dock-tab drag source resolved against `documents`. All five exist today.
  `SheetDispatchContext` and `SceneDispatchContext` both INVERT control, which is what
  keeps the eslint layer boundary green; that inversion is load-bearing, not stylistic.
  Phase 7's seam catalogue — the document that would make this list checkable — is not
  written.
- ⚠️ **The CI gates that fight Phase 5/6 deletions are unchanged and still ahead of
  the work**: knip, `hostSizeBudget` (a per-file 400-LOC ceiling on five named sheet
  hosts — deleting a sibling does NOT reduce a host's own LOC), the doc-drift
  RUNTIME_COPY_RULES guard, and the vitest coverage thresholds. The guard is
  FILE-PATH-keyed and fires on EDIT as well as delete; relocating a token into another
  file does not satisfy it. **Correction: it pins fifteen paths, not the thirteen this
  document says elsewhere** — six of them per-system inline files a tab-grid collapse
  would edit rather than delete. Anything that formalizes the constraint set must state
  fifteen or derive the count.
- ⚠️ **Sheet content-add is click-to-add resolved by existing per-system controller
  handlers — with an honest asymmetry the plan did not foresee.** The plan said
  "UNIFORM across all 7 systems." What shipped is uniform in *mechanism* and asymmetric
  in *capability*: two systems whose models carry no shared Spell/Feat/Item concept
  publish nothing and the Dock's verb correctly disables. That asymmetry is the
  contract, not a gap. The per-system drop-classifier matrix stays dissolved; the only
  classifier is the scene-generic allegiance/kind chip.
- ⚠️ **Read-only/view mode is OUT OF SCOPE (Decision B):** no
  `onUpdate={canEdit ? … : undefined}` gating on the sheet, because that builds the
  enforcement path Decision B relies on not existing. Still true; nothing has
  introduced one.
- ⚠️ **The right operating rail is still docked, and "canvas dominates" is still
  unclaimed.** Phase 1 relocated only the left scene-list rail, correctly. The 20rem
  right rail was to demote in Phase 6 5b with designed reopen UX; it has not. So the
  chrome-dominance CI budget remains a Phase-6 outcome, not a Phase-1 or Phase-7 claim
  — Finding 20's prediction held exactly.
- ⚠️ **The buttery destination still depends on the interaction chapters being
  funded, and this is now the sharpest risk on the list.** The Phase-7 usability gate
  was the funding mechanism; it has not been run. The fallback the plan described has
  in fact been reached and is defensible: a decluttered four-view home, a widened Scene
  grid with every operating tool still docked and reachable, a shared five-tab dock,
  and a dispatch matrix that works across all seven systems — regressing neither
  in-flight Scene state, cross-tab sync freshness, the campaign-recap write, any
  sheet-open flow, per-character export/delete, nor scene create/import-then-open. What
  the fallback does not include is a single Owlbear-grade gesture any user can perform,
  because both are behind default-off flags.

---

# The prototype GATE — what it required, and what it produced

The gate was the plan's fund/kill checkpoint: prove or kill the interaction thesis on
the smallest end-to-end slice before any broad eviction. Its design is the part worth
keeping, because it is the part most easily faked.

**Why it had to be two sub-gates, not one.** `buildPlacedToken` resolves a `linkedDoc`
with a non-npc kind to `kind='character'`, `playerControlled:true`, with **no**
allegiance — a genuine 1-choice case that can auto-apply with no menu. A
statblock-backed NPC resolves to `kind='npc'` and **requires** a `tokenAllegiance` — so
the monster drop is intrinsically the 2+ case (Finding 9). A single "monster =
1-choice auto-apply" gate would have been false, and the only way to make it look true
was to hardcode a default allegiance, which would have proven nothing. Hence 3b-i (a
party character document, genuine auto-apply) and 3b-ii (a monster through a minimal
friendly/hostile chip).

**Why the character-document source had to be built first.** The dock's four SRD tabs
contain no character documents; those live only in App state and reached the Scene via
the roster (Finding 15). Without a fifth party tab there was no draggable character
document anywhere, so 3b-i could not run and the decision would have collapsed to the
2+ case the plan insists is not the buttery path being proven. The party tab was
therefore scheduled browse-only in Phase 3 and made draggable in Phase 4 to *be* that
source.

**Why it had to be measured on a transformed surface.** Today's untransformed grid
cannot exhibit the jank the plan names, so a green gate there licenses nothing
(Finding 3). Both sub-gates were routed through a ~900-memoized-cell transformed spike
with an explicit post-drop reconcile budget, and the same spike was extended to a
dynamic-viewport probe — variable scale+translate inversion, wheel-zoom-to-cursor,
continuous-repaint budget, touch pinch — so Phase 6's pan/zoom unknowns were probed
here rather than first discovered as a disguised "render rewrite" (Finding 10). The
probe **probes**; 5d still carries its own gate.

**As built.** The gate was genuinely run to this shape, not asserted: both sub-gates
against the transformed spike with a real reconcile budget, plus the dynamic-viewport
probe. `runtime.ts` was never touched — every drop emits the pre-existing place-token /
set-token-allegiance intents. Two caveats that matter more than the gate's own result:
the reconcile-budget check is wall-clock and has flaked under full-suite load, and the
gate's outcome never converted into a shipped gesture, because the flag it lives behind
defaults off and its acceptance spec skips. **A passed gate is not a funded chapter.**
The Phase-7 usability sign-off, which was the mechanism for converting one into the
other, has not been run.
