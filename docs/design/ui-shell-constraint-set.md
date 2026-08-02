# UI shell — constraint set and seam catalogue (of record)

**Phase 7, tasks 8 and 9.** Written 2026-08-02. This is the *of-record*
statement of every CI gate the four red-team passes surfaced, plus the
enumeration of the app-facing seams.

> **Every figure below that restates machine-checked truth is GATED, not
> transcribed.** `docs/doc-drift.rules.ts` carries a `count_rule` for each, and
> `src/utils/docDrift.ts` reads the value out of the source of record. Editing a
> number here without editing the code fails `npm run check:doc-drift`.
>
> That is not ceremony, and the history says so. The build spec for this
> document (`ui-redesign-phase-build-specs.md`, task 8) corrected an earlier
> plan's stale count of **13** runtime-copy rules to **15**, and told the author
> of this file in capitals not to hardcode the 13. By the time this file was
> written the real count was **14** — so the correction had itself gone stale
> inside the very instruction warning about staleness. A number a human retypes
> is a number that will be wrong; the only durable fix is to read it.

---

## 1. The constraint set

### 1.1 Coverage thresholds

`vitest.config.ts`, enforced by `npm run test:coverage` in the verify chain.

| metric | threshold |
| --- | ---: |
| lines | 70 |
| functions | 65 |
| branches | 60 |
| statements | 70 |

**Branches at 60 is the tightest of the four** and is the one that actually
bites: a new conditional with an untested arm moves branch coverage roughly
twice as fast as it moves line coverage.

`App.tsx` and `main.tsx` are excluded. The rationale is that both are
composition roots — they wire providers and mount the tree, so their "uncovered"
lines are almost entirely JSX wiring whose behaviour is asserted through the
components they mount. Including them would let a genuine coverage regression
somewhere else be masked by adding markup to a root.

### 1.2 Host size budget

**400 LOC per file, across 5 named hosts** (`src/__tests__/hostSizeBudget.test.ts`).

The five are the per-system sheet hosts: `Dnd5eSheetBase.tsx`, and `sheet.tsx`
for `mam3e`, `pf2e`, `daggerheart` and `d20-legacy`.

This is a *shape* gate, not a size gate. The hosts are deliberately thin "tabs
container + section wiring"; per-tab content lives in sections. The budget is
the mechanism that keeps a host from growing into a god-object, and its value is
that it fails at the moment someone starts inlining a tab rather than after the
host is unreviewable.

### 1.3 Runtime-copy token guard

**14 file-path-keyed entries** in `RUNTIME_COPY_RULES` (`docs/doc-drift.rules.ts`).

Each entry pins tokens that must survive in a runtime source file — user-facing
copy and per-system labels that documentation restates. The guard is keyed by
FILE PATH, which is the property that makes it fragile in a useful way: **delete
or rename a guarded file and the rule must be updated in the same change**, or
the gate fails.

Per-phase checklist item, and it is the one most often skipped:

> Measure coverage-delta, measure host LOC for the 5 hosts, and confirm every
> deleted **or edited** file whose path appears in `RUNTIME_COPY_RULES` has its
> tokens preserved, or its `rules.ts` + `manifest.ts` pairing updated.

"or edited" is load-bearing. A file can keep its path, keep compiling, and lose
the exact sentence the guard pins — which is precisely what happened on
2026-08-02 to two spell tabs whose copy still said "use the browser below" after
the browser was deleted.

### 1.4 The remaining structural gates

- **`check:dead-code`** (knip) — test files are NOT entry points, so a
  test-only import no longer counts as a live consumer (§0.5). Documented seams
  carry explicit `ignore` entries naming their doc.
- **`check:bundle-size`** — a 192 KiB first-paint budget on the shell's own
  eager code, a may-only-shrink ratchet on the eager per-system SRD data chunks,
  and an all-seven assertion that no system's sheet and neither shell surface
  rides first paint. Its own note stands: the next climb must be paid by
  *structural reclaim*, not another bump.
- **`check:keepalive-budget`** — deterministic counted DOM writes across all
  seven systems and all six surface transitions, chosen over a wall-clock gate
  because the observed timing spread was an order of magnitude above the signal.

---

## 2. The seam catalogue

Five app-facing seams, with their as-built anchors.

### 2.1 Scene selection — a compound FIVE-writer seam

`selectedSceneId` + `onSelectScene`. Writers live across `SceneManager` and, since
Phase 1, `LibraryScenesView`. Compound because no single component owns it: the
picker, the create form, the import path and the delete path all write it.

### 2.2 Scene intent emission

A zero-argument `emit(intent: SceneActionIntent) => boolean` bound to the
selected scene. Consumer: the Phase-4 `DragLayer`. The boolean is the rejection
channel — an illegal intent returns `false` rather than throwing.

### 2.3 Campaign recap logging

`onLogToCampaign(campaignId, title, body)`, owned by `App`. **Not one of the
typed scene intents**, deliberately: a campaign log entry is not scene state and
must not enter the replayable event log.

### 2.4 Sheet opening — a compound SIX-writer seam

`openSheet(docId)`, plus the re-homed Export/Delete and `closeSheet` sites. Same
compound shape as 2.1 and the same reason.

### 2.5 Party drag source

The party dock tab resolves its drag source against `documents` (Phase 4).

### The invariant that governs all five

**`SceneDispatchContext` and `SheetDispatchContext` INVERT control**, so no
shared or shell-layer module value-imports `src/systems/**` — the boundary is
lint-enforced. The active per-system sheet publishes its handlers *up*; the
shared Dock reads them *down*. §4.3's catalog-filter seam extends the same
pattern by publishing a **predicate rather than a descriptor**, so the Dock can
honour a class/tradition filter without ever learning what a tradition is.

**Explicitly out of scope**, recorded so it is not mistaken for an oversight:
the role toggle is disclosure-only, and read-only / view-mode is not
implemented — there is no `onUpdate = canEdit` enforcement path.

---

## 3. What Phase 7 still owes

Of the eleven build-spec tasks, this document is 8, 9 and 10.

- **Tasks 1–3, hash-sync restore-on-reload** — open.
- **Task 4, interaction-latency gate** — open.
- **Task 5, chrome-dominance gate** — **blocked, not merely undone.** Its budget
  (~10% non-content chrome) is only satisfiable after Phase 6's slice 5b demotes
  the 20rem right rail; against the current docked rail (~320px) it would fail by
  construction. Writing it now would add a red gate that no change in Phase 7
  could turn green.
- **Task 11, owner usability sign-off** — owner.
