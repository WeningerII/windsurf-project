# Work Plan — what remains, in order

**Built:** 2026-07-26 · **Basis:** four independent verification passes against code, not against prose

This is the **forward-looking** document. It answers one question: *what should be done next, and what does it unblock?*

It is deliberately not a status record. `docs/MASTER_PLAN.md` holds decisions, constraints and per-phase status; `docs/GAPS.md` holds findings and their evidence. Neither tells you what to pick up. This does.

Every item below was verified against code on 2026-07-26. Where a claim could not be established, it says so rather than guessing — a confidently wrong status here costs a rebuilt lane, which has already happened once this month.

---

## How to use this

Items are grouped by **what unblocks what**, not by phase number. Within each group they are ordered so that finishing one makes the next cheaper.

| Tag | Meaning |
| --- | --- |
| **DECIDE** | Blocked on a judgment only the repository owner can make. Nothing downstream moves until it is answered. |
| **READY** | Fully scoped, no blocker, can be dispatched as-is. |
| **BLOCKED** | Waiting on another item in this file, named inline. |
| **CHEAP** | Under roughly half a day; good filler between larger lanes. |

Effort is given in lanes (one focused agent-or-session unit), not hours.

---

## 0. Decisions that gate everything else — **DECIDE**

These are first because each one holds up work that is otherwise ready. They cost minutes to answer and days to leave open.

### 0.1 Open-content licensing: two populations shipping under source tags they do not have

Two findings, same defect class, both remedy-is-owner's-call. The tooling has produced the evidence; the product decision is yours.

- **5e-2024 backgrounds.** All four ship tagged `SRD 5.2` while carrying the *2014* model. SRD 5.1 contains exactly one background (Acolyte), so the Criminal / Sage / Soldier text is *Player's Handbook* content — not open. The name-based reverse diff cannot see this, because the names are legitimate SRD 5.2 names.
- **M&M 3e equipment.** 79 entries have no Hero SRD counterpart. They are now honestly labelled `Original Content (not SRD)` and machine-separated from open content, so nothing is currently mislabelled — but roughly 40 are outright invented, and a handful (`Power Ring`, `Web Shooters`, `Mystic Amulet`) evoke recognisable trademarked characters. Whether they ship at all is a trade-dress judgment, not an engineering one.

**Unblocks:** the Phase-1 content close-out, and `p7.release` — neither should ship with an unresolved licensing question.
**Options:** keep as-is (already honestly labelled) · replace the three backgrounds with genuine SRD 5.2 origins · remove the invented M&M items · some combination.

### 0.2 Is `claude/sharp-davinci-pu40fc` live or abandoned?

An unmerged branch carries commits claiming **Phase 12 (LLM strategist)**, **Phase 13 (narration critic)**, **Phase 10 (vision automation)** and **Phase 14 (observability)**. Verified: none of its commits is an ancestor of `main`, and the symbols are absent from the tree — so the "open" markers on those phases are correct today.

**Unblocks:** all of §5 (AI/scene runtime). Scheduling that work without a verdict risks rebuilding what is sitting on a shelf.
**Cost of deciding:** one look at the branch.

### 0.3 May documents publish one microtask late on cold start?

`src/hooks/useDocuments.ts:22` calls `engine.prepareData(doc)` **synchronously from inside `setDocuments` updaters**, on load and on every add / update / import / cross-tab-merge / sync-merge path. It is the single eager consumer blocking lazy per-system engines. Going lazy makes it async: documents would publish unprepared for ≥1 microtask on cold start, and mutation ordering inside the updaters would change. That is a behaviour change, not code-splitting, and it fails the standing safety bar for touching engine math.

Two further tests (`mam3eValidation.test.ts:33`, `capabilityScenarios.test.tsx:323`) read `.engine` synchronously inside sync `it()` bodies; unblocking also needs authorization to change their **call shape** — not their expectations.

**Unblocks:** 21.2 KiB of eager-bundle headroom (§6.1). The measured ceiling is 23.6 KiB; 2.4 KiB has been claimed.
**Alternative if the answer is no:** a preload design that guarantees resolution before `useDocuments` publishes. More work, no behaviour change.

---

## 1. Rescue before it is lost — ~~READY, CHEAP~~ **DONE 2026-07-26**

### 1.1 ~~Recover the over-inclusion audit's 1,069 classifications~~ — **RECOVERED AND LANDED**

A lane classified all 1,069 over-inclusion suspects across the seven systems and **died on a session limit before committing**. The work survived only as uncommitted changes in a container-local worktree on a branch never pushed to origin.

Recovered in `544967c`, completed and enforced in `d34e776`. The gate now runs inside `npm run verify` and passes on all **1,045** current suspects (the population shrank because the M&M lane removed 24 entries). Full account in `GAPS.md` §18.

Two things worth carrying forward:

- **The audit predicted its own failure and was right.** It deferred `mam3e/equipment` and wrote that those records *"will fail this gate as `STALE CLASSIFICATION` … that is the ratchet working, and a deliberate hand-off, not an oversight."* All 103 failed exactly that way. Completing the hand-off was the landing work.
- **Adversarial verification corrected the audit and was itself wrong 25% of the time.** Seven records moved from `genuine-non-open-content` to `wrong-edition-attribution` — their counterparts were sitting in the audit's *own* pinned manifest, because entries had been checked only against their own system's sources. But 5 of 20 claimed counterparts were fabricated, so every applied correction was re-verified locally first. Treat a verifier panel as a lead generator, not an oracle (§18.7).

---

## 2. Content — Denominator A

The content denominator is mid-migration. Read §2.2 before starting anything else here, because it changes what "coverage" means.

### 2.1 `p1.provenance-over-inclusion-audit` — ~~BLOCKED on 1.1~~ **classification DONE, remedies are owner decisions**

All 1,045 suspects are classified with evidence and held by a gate that is a proven ratchet (all five failure modes made to fire against a control run). What remains is **not** classification work:

- **31 records carry a false citation today — the live exposure number.** Not 95: of the 95 `genuine-non-open-content` records, 64 are M&M originals that §17 already relabelled honestly to `Original Content (not SRD)`. They stay in the licensing class because absence of an open-content counterpart is the *finding*, and because whether `Power Ring` / `Web Shooters` / `Mystic Amulet` ship at all is a trade-dress judgment — see §0.1, this is the same owner decision.
- **Nothing was deleted or relabelled, deliberately.** `filterOpenContentBySource` drops any entry whose source leaves the allowlist, so re-tagging silently removes shipped content from the product. That is the owner's call, not a cleanup.
- **Three measurement defects are diagnosed, not repaired** — repairing one moves published coverage percentages, so it is a deliberate, separately-scoped change.
- **Two records are `undetermined` and say why** (§18.7): `Cap of Water Breathing` and `Captain`.

**Known remainder:** 21 non-SRD M&M powers and 1 advantage still ship under `Hero's Handbook` — same defect class as the equipment finding, untreated. These now sit in the gate as `denominator-scope-defect` and are the obvious next tranche.

### 2.2 Execute the `srd-manifest` demotion — **READY**

Decided 2026-07-21 (`GAPS.md` §6), **never executed** — verified: 10 files still tracked, `generate-roadmap-metrics.ts` still imports `SRD_MANIFESTS`, and no wired command regenerates them.

The manifests are generated *from* the loaders, so joining them against loaded ids is circular: manifest ids are both numerator and denominator, and drift can only ever read as 100%. One category currently prints a green 100% against a denominator holding roughly a tenth of what its loader ships.

**Do not "fix" this by gating the manifests** — that entrenches a mechanism already scheduled for retirement. The task is to move Denominator A onto `docs/generated/srd-coverage.md` (the independent networked reverse diff) and demote the manifests to provenance-only.

**Unblocks:** every content% number in the repo becoming meaningful.

### 2.3 M&M 3e adversaries — the system has none — **READY**

`loadMonstersForSystem` returns `[]` for `mam3e`; there is no adversary data directory. RFC 004's "reference adversaries for the others" is half delivered (Daggerheart ships them). This is a **seven-systems-equal hole**: 5 of 7 have loader-backed creature catalogs and cited encounter budgets; M&M and Daggerheart do not participate in encounter budgets, and M&M has no catalog at all.

**Serves:** the all-seven-equal thesis directly. **Also blocks:** `p4.parity-matrix` from being honestly closable.

### 2.4 5e-2024 hand-written monsters — 77 of 85 diverge — **READY**

The largest single open content-integrity item. Mostly carrying SRD 5.1 values; some carry values in *neither* edition (Air Elemental `5d10+10` is invented). All 254 scalar divergences are itemised in the fidelity baseline, so this is transcription work against a pinned source, not research.

### 2.5 Remaining denominator work — **READY**

- `p1.wire-remaining-denominators` — 3.5e classes/feats/equipment remain unwired pending core-only sources.
- `p1.monster-denominator-fix` — 3.5e's denominator still inflated by container-like rows.
- `p1.single-entry-gaps` — small, itemised, good filler. **CHEAP**

---

## 3. Compute — Denominator B

### 3.1 Level the register layers — **READY**

L1–L10 is complete for **2 of 7** systems. L10 is owed by 3, L5–L6 by one, L4/L5/L9 by one. The registers are a curated subset of the full spec, not its exhaustive enumeration — which is honest, but it means `compute%` is measured against an uneven target.

Every new verified entry must land with its Tier-B mutation anchor.

### 3.2 L8 — damage types and resistance — **READY**

`src/scene/runtime.ts` types damage as `{tokenId, amount}` with no damage type, and no resistance transform exists in `src/rules/resolver/`. This is the substantive rules gap behind the L8 layer debt.

---

## 4. Parity — the all-seven-equal spine

### 4.1 `p4.parity-matrix` — close the 7×N matrix — **BLOCKED on 2.3**

Cannot be honestly closed while one system has no creature catalog.

### 4.2 ~~PF2e carries zero exclusion entries~~ — **DONE 2026-07-27 (enumerated, label kept)**

`_exclusions.ts` held **no entry for PF2e**, yet PF2e read `Full` and named a manual focus-spell surface in its own support row. By the plan's own rule — a system reads `Full` when its only residual gaps live in that registry — PF2e did not qualify. **Resolved by enumerating, not by relabelling:** the gaps were real, findable, and genuinely of boundary shape (play choices and ungenerated class-feature grants, not skipped math), so three entries now stand in `docs/srd-manifest/_exclusions.ts` — focus-spell list and effects, prepared-slot assignment and cantrip selection, and rank-10 slots from 10th-rank class features — each citing the code that already treats the surface as manual. PF2e's agile MAP and weapon specialization were deliberately **kept out**: those are pending wiring, and the registry is not a place to park unfinished automation. `src/__tests__/manualExclusionRegistry.test.ts` fails if any manifest-carrying system falls back to zero entries. See `docs/GAPS.md` §4.

### 4.3 Sheet eviction — the dual-home is not transient — **READY**

Phase 5's *dispatch* half is complete at 7 of 7. The *eviction* half never happened: all ten in-sheet browser wrappers are still imported and rendered across the PF2e, 5e, d20-legacy and M&M sheets. The shell plan capped this dual-home at "one chapter"; it has outlived that. Every affected system browses the same catalog from two places today.

**Deliverable:** delete the in-sheet browser wrappers, collapse the tab grids, all seven.

---

## 5. AI and scene runtime — **all BLOCKED on 0.2**

Ordered by dependency. Do not schedule any of these before the shelf-branch verdict.

### 5.1 Give the shipped AI flows a surface — **READY once 0.2 answers**

`character-draft` and the `make-me-a-game` composition flow are **complete, validator-gated, fixture-covered modules with no UI entry point** — their only importers are each other and their tests. This is the cheapest real user-facing AI win available: the hard part is built.

### 5.2 Phase 14's one remaining join

Everything else in the observability layer shipped. What remains is a single join: **a trace id does not yet reach a scene event**.

### 5.3 Phase 12 — LLM strategist blackboard

Async strategist writing intent/weight hints; the local executor stays authoritative. No turn may block on a model call.

### 5.4 Phase 13 — narration critic · 5.5 Phase 10 — the vision adapter

The critic is unbuilt. For Phase 10, the *deterministic geometry validator* already ships (`src/scene/gridGeometryProposal.ts`) with **no consumer** — what is missing is the vision adapter that would feed it.

### 5.6 RFC 007 — AI-DM runtime

Accepted 2026-07-21, nothing landed. Verified: the RFC's proposed AI-DM module directory under `src/scene/` does not exist, and there is no `dm-*` task in the gateway allowlist.

### 5.7 Scene backend sync — **READY**

`syncEngine.ts` has no scenes path; scenes remain browser-local. The genuinely open deterministic-runtime gap.

---

## 6. Infrastructure and hardening

### 6.1 Finish the eager-bundle reclaim — **BLOCKED on 0.3**

2.4 KiB claimed of a measured 23.6 KiB ceiling; headroom is now ~2,658 bytes against the 85 KiB budget. Rejected alternatives are recorded so they are not re-proposed: an engine-internal `rollCheck` split (only 2.5 KiB, and it introduces a *second* engine-loading mechanism), and awaiting engines in `main.tsx` before `render()` (shrinks the measured chunk without shrinking first paint — that games the gate rather than paying it).

### 6.2 UI shell Phases 6 and 7 — **partly BLOCKED**

- **Phase 6** is ~1 of 5 slices. Open: decompose `SceneManager` (~1,220 LOC) into a thin scene surface; the right-rail summon tray; the pan/zoom viewport and its gate; the distance ruler and deletion of the `PlacementMode` machine.
- **Phase 7** is 1 of 5 deliverables. Open: hash-sync restore-on-reload, the chrome-dominance gate (**blocked on Phase 6's right-rail tray**, not merely undone), the seam catalogue, and owner usability sign-off.

**Two constraints nobody had written down until now:** the two flag-gated phases are *mutually exclusive in practice* — enabling the Phase-6 canvas flag disables Phase-4 drag (`sceneDragEnabled && !sceneCanvasEnabled`), so they cannot both be on to preview the destination. And the canvas render drops the map-image layer the DOM grid carries, which is a second reason its flag stays off.

### 6.3 `p5.infra-gaps` residuals — **READY**

Four recorded decisions rather than omissions: no analytics network sink (`createBeaconSink` is seam-only), Sentry release wiring deferred behind the bundle budget, server-side 5xx alerting is ops provisioning, and the §12 a11y contrast quarantine.

### 6.4 The quarantined a11y contrast finding — **READY**

`e2e/a11y.spec.ts` has one `test.fixme` on the dialog/wizard scan. Needs a live browser to reproduce — it is not determinable from source. Deliberately quarantined at the *test* level rather than by allowlisting `color-contrast`, which would blind the gate to every genuine contrast regression on every surface.

### 6.5 Toolchain modernization — **READY**

Risk-ordered, verified against `package.json`: React 18.2→19, Tailwind 3.3→4, Vite 7.3→8, `lucide-react` 0.294→1.17, `@types/node` 20→22, and runtime-pin reconciliation (`.nvmrc` pins 20.19.0 while `engines` already admits 22 and 24).

---

## 7. Code hygiene surfaced during verification — **READY, CHEAP**

Small, real, and each found while checking something else.

- **Duplicate `SceneGridRegistration`** — defined in both `src/types/core/scene.ts` and `src/scene/gridGeometryProposal.ts`. The latter's comment says it is local "until the Phase 9 map-asset record lands"; Phase 9 landed the same day and the unification never happened.
- **The Phase-2 surfaces directory was never created.** `SurfaceStage` takes `ReactNode` slots instead, so later specs referring to "the Phase-2 `SceneSurface` stub to flesh out" point at nothing that exists.
- **`path_ref_rule` has a blind spot** — it only matches `docs/`, `src/`, `scripts/`, `.github/`, `package.json`, `.nvmrc`, `.node-version` and the two root docs. Every `netlify/`, `supabase/` and `.env` path in the RFCs and runbooks is **ungated**, and two stale ones were found by hand this week.
- **`src/types/core/character.ts:275`** documents `strikingRune` as "no engine consumes it yet"; the call site 29 lines below disproves it.
- **The graphify index is stale.** `ShellContext`, `SurfaceStage` and `SceneCanvas` return no node, so every agent this session fell back to direct file reads. `npm run graph:update` is overdue.

---

## 8. Release — `p7.release` — **BLOCKED on 0.1**

Release engineering and launch. Should not begin while an open-content licensing question is unresolved.

---

## What this plan does not cover

- **Foundry-style content packs** and **homebrew/fusion** are permanently out of scope by owner decision. Do not reintroduce them.
- **Equipment routing for the two non-additive systems** is an accepted architectural boundary, not a gap: their derived defenses are override- and attribute-derived shapes the additive resolver cannot express. Revisit only if the IR gains override operations for other reasons.
- **Prose fidelity** is unaudited everywhere. Every fidelity finding so far is scalar; descriptions, traits and actions are unchecked in all seven systems. Scoping that is itself a lane, not an item.
