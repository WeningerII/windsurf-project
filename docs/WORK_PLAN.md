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

## 0. Decisions that gate everything else

These are first because each one holds up work that is otherwise ready.

**Status as of 2026-07-27 — four of six are resolved:**

| | Decision | State |
| --- | --- | --- |
| 0.1 | Open-content licensing | **OPEN — owner** · the only genuine licensing exposure left |
| 0.2 | Shelf branches | Decided: delete deliberately · Phase 12 cut · *remote deletions still pending* |
| 0.3 | Cold-start microtask | Dissolved — the hazard was one call site, not six, so a third path needs no authorization |
| 0.4 | Contribution ledger | Decided and shipped: it has a consumer |
| 0.5 | knip test entry points | Decided and shipped · unverified locally, needs CI |
| 0.6 | Phase 10 / character-draft | `character-draft` shipped · **Phase 10 still OPEN — owner** |

So two questions actually remain: **§0.1** (licensing) and the Phase-10 half of **§0.6**.

### 0.1 Open-content licensing: two populations shipping under source tags they do not have

Two findings, same defect class, both remedy-is-owner's-call. The tooling has produced the evidence; the product decision is yours.

- **5e-2024 backgrounds.** All four ship tagged `SRD 5.2` while carrying the *2014* model. SRD 5.1 contains exactly one background (Acolyte), so the Criminal / Sage / Soldier text is *Player's Handbook* content — not open. The name-based reverse diff cannot see this, because the names are legitimate SRD 5.2 names.
- **M&M 3e equipment.** The audit sharpened this: **64** entries (not 79) have no Hero SRD counterpart — of the original 79 suspects, 7 turned out to be duplicate rows of an SRD entry that also ships, 6 pre-built instances of a generic SRD row, and 2 too ambiguous to call. The 64 are honestly labelled `Original Content (not SRD)` and machine-separated, so **nothing is currently mislabelled**. What remains is trade dress: names like `Power Ring`, `Web Shooters`, `Mystic Amulet` and `Magic Wand` evoke recognisable characters regardless of tagging. Whether they ship is a product judgment, not an engineering one.

**Unblocks:** the Phase-1 content close-out, and `p7.release` — neither should ship with an unresolved licensing question.
**Options:** keep as-is (already honestly labelled) · replace the three backgrounds with genuine SRD 5.2 origins · remove the invented M&M items · some combination.

### 0.2 ~~Which of the three unmerged shelf branches are live?~~ — **DECIDED 2026-07-26: delete deliberately**

**Owner decision: the shelved work is retired rather than salvaged.** Phase 12 is cut from the roadmap (§5.3, and the `MASTER_PLAN` phase table). The Phase-12 strategist prototype was *not* salvaged — that was a deliberate choice to stop carrying it, not an oversight.

Every retired branch's SHA is recorded in `docs/history/2026-07-26-retired-branches.md`. A branch is only a name pointing at a commit, so nothing is unrecoverable: `git branch <name> <sha>` restores any of them.

What the inventory established, kept here because it explains *why* deleting was cheap:

- **`hopeful-thompson-cul3X` (156 commits) was fully superseded** — bestiary imports behind shipped data, 3.5e feat data stale and re-derivable from the pinned source, and its one code commit beaten by main's system-agnostic `LibraryBestiaryView`.
- **Phase 14 was never open** — it landed independently; only the §5.2 trace join remains.
- **Phase 10 is half-shipped** — the in-tree validator is *strictly better* than the branch's (15 issue codes vs 5, three-way verdict vs boolean, versioned envelope, preset-vocabulary validation). Only the vision adapter is open (§0.6).
- **62 of 65 branches were retirable**; 58 were already fully merged.

**Remaining action:** the branch deletions themselves still need to be run against `origin` — they were blocked here as a destructive remote operation.

### 0.3 May documents publish one microtask late on cold start? — ~~DECIDE~~ **MOOT 2026-07-28**

**The question never had to be answered.** The recorded alternative — a preload design guaranteeing engine resolution *before* `useDocuments` publishes — was built instead, so documents still never publish unprepared and the version derivation inside `updateDocument` never moved.

Why it was avoidable, kept because it is the transferable part: the hazard was narrower than this section originally claimed. `prepareDocumentWithEngine` has two direct call sites plus a list `.map()`, not six. The load / import / cross-tab / sync-merge paths all compute *before* dispatching, so they can await a lazy engine without reordering anything. Only `updateDocument` sat inside an `applyDocumentsUpdate((prev) => …)` updater, reading `prev` to derive the next version — deliberately, so a stale doc reused across rapid successive edits cannot collide on a version and drop the later edit.

Once that was established, pre-resolving the engine *outside* the updater made the whole authorization question moot. **A decision that looks like it needs owner sign-off is sometimes a decision resting on an unverified premise** — checking the premise cost less than asking.

Only the two named test files' **call shape** changed, plus `applyMergedCollections.test.tsx` for the same reason. No expectation changed.

**Unblocked:** §6.1, now closed.

### 0.4 ~~The contribution ledger — wire a consumer, or delete ~1,600 LOC?~~ — **DECIDED AND DONE 2026-07-27**

Five per-system ledger builders plus `src/rules/ir/ledgerView.ts` compute *"explain where this number came from"* for all seven systems, and until 2026-07-27 **nothing rendered any of them** — the only callers were test assertions.

The accounting had hidden that: `GAPS §7` marked the row COMPLETE and `MASTER_PLAN` marked it 7 of 7, both measuring *builder existence* rather than consumption. The legal-actions row one line below in the same table says "0 consumers" out loud; this row conspicuously did not.

**DECIDED AND DONE 2026-07-27: build the consumer.** The 5e Armor Class card now explains itself — *"17 = 10 Unarmored defense + 4 Chain Shirt + 2 Dexterity modifier + 1 Ring of Protection"* — via a shared `ContributionBreakdown` component that degrades to the plain number whenever no ledger explains the value.

AC was chosen on evidence, not convenience: its ledger population is complete, ordered, and documented to sum to the number the sheet already displays. Ability modifiers and saves were rejected because their ledger rows cover only feat automation and would not sum to the displayed value — a breakdown that does not add up is worse than none.

**Still one surface, not a provenance UI.** Four systems' builders remain unrendered, and the ledger rebuilds on every character edit to power a tooltip — cheap today, but the first thing to revisit if more surfaces subscribe.

**Note for the campaign-history ambition:** this explains *a number*. It is not a chronicle and cannot become one — see §5.7.

### 0.5 Should `knip.json` keep test files as entry points?

Today `src/__tests__/**` is an entry point, so **a test import counts as a live consumer**. That is why three confirmed-dead modules pass `check:dead-code` today. The gate cannot see this class of rot at all.

**DECIDED AND DONE 2026-07-27: dropped.** `knip.json` became `knip.jsonc` (strict JSON cannot carry the per-entry doc citations), the test entry pattern is gone, and the three genuinely documented seams carry explicit `ignore` entries naming their doc. `legalActions.ts` deliberately does **not** — it is registered by all seven `definition.ts` files and called by the registry, so it is UI-unreachable rather than dead.

**Unverified locally, needs CI.** knip OOMs in this container, so the config change is reasoned rather than run. Two specific risks to watch on the first CI run: knip 5 auto-enables its vitest plugin, whose entry patterns are *additive* to the root `entry` array — if that re-admits test files the blind spot is still open, and the fix is `"vitest": { "entry": [] }`. And the `.json` → `.jsonc` rename means that run also proves config discovery; a silent fallback to defaults would produce a flood of false positives.

### 0.6 Phase 10 and the character-draft surface — build or formally close?

Two separate features, same shape: **the expensive half is built and the cheap half is missing.**

- **Phase 10** — `gridGeometryProposal.ts` (579 LOC, well tested) has had no consumer since it landed. Building the `analyze-map` task plus a MapPanel affordance is roughly a day.
- **`character-draft`** — flow, pools, validators and fixtures all exist; only the UI entry point is missing. This is the **smallest gap between "built" and "usable" anywhere in the repo**, and it would also give `makeMeAGameFlow` its first real consumer.

**`character-draft` — DONE 2026-07-27.** Reachable from the new-character dialog's "Draft with AI" mode, rendered only when `isAiEnabled()`, loaded by dynamic import so the AI-off eager chunk is unchanged. The draft applies through the system's *own* creation plan and is gated on its own `registry.validateDocument`, and the proposal is shown before anything is created — model proposes, validators decide. It also gave `makeMeAGameFlow` a shared seam instead of a second inline copy of that logic.

**Phase 10 — still open, and this is the decision that remains.** Build the `analyze-map` task plus a MapPanel affordance (~1 day), or close Phase 10 formally and reclassify the validator as a permanent documented seam. **Do not delete the validator** — it is the careful half, and the retired shelf branch's version was strictly worse. One prerequisite for whoever builds it: `MapPanel` never learns the image's pixel dimensions, and the shipped validator requires `image: { widthPx, heightPx }`.

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

- **31 records ship content with no open-content counterpart anywhere — the licensing-exposure number.** Not 95: of the 95 `genuine-non-open-content` records, 64 are M&M originals that §17 already relabelled honestly to `Original Content (not SRD)`. They stay in the licensing class because absence of a counterpart is the *finding*, and because whether `Power Ring` / `Web Shooters` / `Mystic Amulet` ship at all is a trade-dress judgment — see §0.1, same owner decision.
- **Separately, 78 `wrong-edition-attribution` records carry a false citation over genuinely open content** (§18.5.3). No licence exposure — the content is OGL — but the product asserts a provenance it does not have.

  **Correction, 2026-07-26: these are NOT a cheap re-tag.** Measured against the per-system allowlists in `src/utils/openContentPolicy.ts`, **75 of the 78 would be dropped from the product if re-tagged to their true source.** The reason is structural, not incidental: a wrong-edition record is by definition content from an edition the system's allowlist does not admit, so `filterOpenContentBySource` removes it the moment the tag becomes honest. `Cloak of Etherealness` ships in the 2024 catalog tagged `SRD 5.2`; its true source is SRD 5.1; the 2024 allowlist admits only 5.2 — so the honest tag deletes it. The sharpest case is PF2e equipment, where **47 of 188 rows** are PF1e/5e content tagged `Core Rulebook`.

  So this is an owner decision of the same class as the 31, not cleanup. Options: re-tag honestly and lose ~75 entries · widen the allowlists to admit cross-edition open content (weakens what the policy claims) · leave as-is · replace with genuine same-edition equivalents (most work, best product). GAPS §18.5 warned about exactly this; an earlier revision of this file called it "mechanical, no risk" and was wrong.
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

The largest single open content-integrity item. Mostly carrying SRD 5.1 values; some carry values in *neither* edition (Air Elemental `5d10+10` is invented). `scripts/data/srd-fidelity-baseline.json` holds **254 divergent entries spanning 1,016 field-level divergences, every one of them 5e-2024** — so this is transcription work against a pinned source, not research.

### 2.5 Remaining denominator work — **READY**

- `p1.wire-remaining-denominators` — **mostly already done, verified 2026-07-26.** 3.5e classes and feats *are* wired (`src/scripts/srd-coverage.ts`, `TARGETS.push` for both). 3.5e equipment is **closed by recorded decision, not pending**: the only clean core-only source interleaves services, lodging and mounts with items, so a scrape would poison the denominator — the script says so in place. What actually remains is closing the missing 3.5e feats, itemised in `docs/generated/srd-coverage.md`.
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

### 4.2 ~~PF2e carries zero exclusion entries~~ — **DONE 2026-07-27**

PF2e read `Full` with zero entries while naming a manual focus-spell surface in its own support row. **Enumerated rather than relabelled**, because the gaps turned out real and findable and of genuine boundary shape: focus spells (no catalog automation — the list is a manual surface whose ids are deliberately not validated), prepared-slot assignment and cantrip selection, and rank-10 slots (class progression tables stop at rank 9; a rank-10 slot comes from a 10th-rank class feature).

**Deliberately kept out:** agile MAP and PF2e weapon specialization. Those are *unfinished automation*, and the registry header forbids parking unfinished work there — enumerating them would have converted a to-do into a permanent boundary.

The label was not downgraded to `Partial`, and the reason matters: PF2e's remaining non-boundary debt is content fidelity, which four of seven systems share and which `docs/generated/srd-coverage.md` already measures. Singling PF2e out would have swapped one mislabel for another. Now gated by `src/__tests__/manualExclusionRegistry.test.ts`.

### 4.3 Sheet eviction — ~~the dual-home is not transient~~ **DONE, four wrappers kept with reasons**

Six of the ten in-sheet browser wrappers are deleted and every affected tab grid is collapsed: `Dnd5eFeatBrowserTab`, `Pf2eFeatBrowserTab`, `Pf2eEquipmentBrowserTab`, `D20FeatBrowserTab`, `D20EquipmentBrowserTab`, `MamEquipmentBrowserTab`. Each re-hosted the same shared browser over the same loader the Dock already calls for that system, so the sheet copy was a true duplicate. The equipped-armour controls that shared the PF2e and d20-legacy equipment-browser tab moved onto Inventory instead of dying with it.

**Four are kept, and this is the finding the lane owes.** They are not duplication; they are capability the Dock does not have:

- `Pf2eSpellBrowserPanel` / `D20SpellBrowserPanel` browse a **class/tradition-filtered** spell list. The Dock's spell tab is the whole system catalog and cannot filter — it is shared-layer and cannot see the open character's class list.
- `MamAdvantageBrowserTab` is the only advantage browse-and-add surface in the product. `loadFeatsForSystem('mam3e')` returns `[]`, so the Dock's Feats tab is empty for M&M and there is no Advantage tab for its add verb to route through.
- `MamPowerBrowserTab` also hosts the power-modifier catalog, which has no Dock tab at all.

**What this unblocks / what it left open:**

- Making the Dock the only catalog route exposed three defects a sheet-side copy had been masking — the Dock pinned its catalog to the system open at *first* render (a PF2e sheet browsed the 5e catalog and click-add would have written 5e ids into it), printed M&M Equipment-Point costs as `undefined undefined`, and captioned PF2e Bulk as pounds. All three are fixed; the per-system cost/weight normalisations the wrappers each carried locally are now one shared `formatItemCost` plus a per-system weight-unit map.
- Finishing the remaining four is **Dock capability work, not deletion work**: Advantage and Power-Modifier tabs, and a seam letting a sheet publish a catalog filter the Dock applies. That is the natural successor item.
- Phase 5's toast + count-badge micro-feedback on the click-add path is still unbuilt; adds land silently.

---

## 5. AI and scene runtime — **all BLOCKED on 0.2**

Ordered by dependency. Do not schedule any of these before the shelf-branch verdict.

### 5.1 Give the shipped AI flows a surface — **HALF DONE 2026-07-27**

`character-draft` now has its affordance (§0.6). **`make-me-a-game` still has none** — it remains a complete, validator-gated, fixture-covered composition flow (party → encounter → ready scene, one seeded path parameterized over the registry with no per-system branch) with no UI and no persistence.

It is now reachable *through* the character-draft seam rather than being the only caller of it, which removes the "dead-rooted" problem but not the missing surface. Worth knowing before scoping it: `makeMeAGameFlow` is the **only** non-test caller of `systemRegistry.validateDocument`, which is why no user surface invokes build legality anywhere.

### 5.2 Phase 14's one remaining join

Everything else in the observability layer shipped. What remains is a single join: **a trace id does not yet reach a scene event**.

### 5.3 Phase 12 — LLM strategist blackboard — **CUT 2026-07-26**

**Removed from the roadmap by owner decision.** The prototype on `claude/sharp-davinci-pu40fc` was deliberately not salvaged, and that branch is retired — its SHA is in `docs/history/2026-07-26-retired-branches.md` if the call is ever revisited.

This partially supersedes RFC 007, which specified the strategist plus a narration/adjudication loop. The RFC stays Accepted (it records a decision at a point in time); the phase table now wins. RFC 007's narration half is unaffected.

### 5.4 Phase 13 — narration critic · 5.5 Phase 10 — the vision adapter

The critic is unbuilt. For Phase 10, the *deterministic geometry validator* already ships (`src/scene/gridGeometryProposal.ts`) with **no consumer** — what is missing is the vision adapter that would feed it.

The shelf branch's version of that adapter is **not** salvageable: it targets a superseded validator and instructs the model to return cell-coordinate boxes, the opposite of the shipped pixel-rect + deterministic-snap design. Rebuild against `GridGeometryProposal` instead — a known 6-site checklist. One thing *is* worth taking: the branch reads the image's `naturalWidth`/`naturalHeight`, which main's `MapPanel` never learns, and the shipped validator requires `image: { widthPx, heightPx }`. That read is a hard prerequisite.

### 5.6 RFC 007 — AI-DM runtime

Accepted 2026-07-21, nothing landed. Verified: the RFC's proposed AI-DM module directory under `src/scene/` does not exist, and there is no `dm-*` task in the gateway allowlist.

### 5.7 Scene backend sync — **A PROJECT, not a task** (scoped 2026-07-26)

`syncEngine.ts` has no scenes path at all; scenes are browser-local via `sceneStorage.ts`. Character documents and campaigns sync — scenes do not. **So a campaign's entire event history dies with a browser profile, a cleared cache, or a new laptop.** For campaigns intended to run for years, this is the blocker behind every campaign-history ambition, and the contribution ledger (§0.4) is not a substitute — that explains *a number*, this records *what happened*.

**Owner decision 2026-07-26: multiple people will be playing.** That rules out the cheap path. Durability-only would have made union-merge plus a canonical order sufficient — roughly a week. Concurrent play forces real answers on:

- **`scene_events` scoping — the expensive one to get wrong.** RLS is per-`user_id` everywhere today. Shared campaigns need per-campaign scoping, and re-scoping an append-only table *after* it holds years of rows is a migration nobody wants. Decide before the first row is written.
- **Concurrent `turn.advanced`** — the payload stores `nextTokenId` computed from authoring-time state. Two concurrent advances union into two advances: deterministic, but the fiction is wrong.
- **Realtime fanout** — subscribing to `scene_events` fires per inserted event, not per scene. One autonomous round emits many events and would trigger a re-sync storm.

**Two prerequisites are bugs, not features, and should land first and separately:**

1. **`saveScenes` has no `try/catch`** (`sceneStorage.ts`). It writes every scene with its full log in one `localStorage.setItem`. A long campaign hits the ~5 MB quota and it throws on the save path. This is live data loss today, independent of sync.
2. **Event order is not intrinsic to the data.** `sequence` is assigned as `scene.events.length + 1` — a local counter — and `foldSceneEvents` sorts on it alone. `Array#sort` is stable, so tied sequences resolve to *array insertion order*, a property of how the array was assembled rather than of the data. Two devices appending offline both mint `N+1`. RFC 006 guarantees byte-identical folds; under any merge that guarantee is currently unenforceable. The fix is a comparator — `sequence`, then `createdAt`, then `id` — and it must land alone, with a test proving existing single-device logs fold identically before and after.

Note the failure mode is *order ambiguity*, not re-rolling: every random value is resolved at authoring time and seeded from the event's own id, which is sound.

**Effort:** ~5–7 days for durability-only; materially more with concurrent play. Full design, schema, file plan and risk list produced 2026-07-26.

---

## 6. Infrastructure and hardening

### 6.1 Finish the eager-bundle reclaim — ~~BLOCKED on 0.3~~ **DONE 2026-07-28**

Per-system engines now load through the registry's `loadEngine`/`peekEngine`/`preloadEngines` seam (`src/registry/index.ts`), with `useDocuments` pre-resolving before it publishes or dispatches. Measured against a clean build of the base commit: eager `index-*.js` 84,280 B -> 61,037 B gzip, eager shell 187.8 -> 165.1 KiB, `appChunkGzipBytes` unchanged at 85 KiB — headroom against that budget goes from 2,760 B to 26,003 B. Evidence and the design rationale: `docs/GAPS.md` §16.5. The rejected alternatives recorded there still stand as rejected.

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

## 7. Dead code and hygiene — **READY, CHEAP**

### 7.0 ~~Confirmed dead — delete~~ — **DONE 2026-07-26**

Three modules deleted, ~556 LOC, each re-verified to have zero non-test importers before removal:

| Module | LOC | Superseded by |
| --- | ---: | --- |
| `utils/systemCatalog` | 213 | `systemCatalogMetadata` / `systemCatalogShared` |
| `utils/validation` | 96 | `registry.validateDocument`, returning structured issues |
| `components/MonsterStatBlock` | 247 | `LibraryBestiaryView` → lazy `MonsterBrowser` |

The near-miss worth recording: `utils/validation` is trivially confusable with `src/systems/dnd5e/shared/validation.ts`, which is **live** — imported by that system's contribution ledger and by the per-system `loadValidator` dynamic imports. The deletion was verified against resolved import paths, not basenames.

**`src/constants/game-rules.ts` was checked and deliberately kept.** It is reachable only through `class-validator` → `validate-classes` → the `npm run validate` script, with no app or UI path — but `validate` is a real step in `npm run verify`, so it is a live tool dependency, not rot.

**Do not delete `src/systems/*/legalActions.ts`** — an automated sweep flagged it and the flag was wrong. All seven `definition.ts` files register it via lazy `loadLegalActions`, and the registry caches and calls it. It is *UI-unreachable*, a much weaker claim already recorded honestly in `GAPS §7` as "0 consumers". Deleting it would break a public registry API.

### 7.1 Wire-ups — open defects, not seams

- ~~**`src/rules/legality/dnd5e.ts`**~~ — **DONE 2026-07-27.** The module was **dead at runtime**: PF2e, PF1e and 3.5e each bridged their legality module into validation and 5e did not, so both editions silently skipped four build caps their siblings enforce. One bridge covers both editions — they already share `createDnd5eValidator(systemId)` and `validateDnd5eBuild` branches on that same id, so each keeps its own compute-register rule prefix. Note one user-visible rename: `dnd5e-class-total-mismatch` → `dnd5e-class-total-shortfall`, narrowed to the shortfall direction so it stops double-reporting against the class-level-sum cap — matching what PF1e and 3.5e already did.
- **`src/systems/pf2e/derivedMath.ts`** (129 LOC) — its PF1e twin is live; this one has no non-test importer. An archived full-repo review prescribed "wire these in or mark them missing"; neither happened, and the finding was never carried into live `GAPS.md`. The PF1e pattern is right there to mirror.

### 7.2 Small items surfaced during verification

Small, real, and each found while checking something else.

- **Duplicate `SceneGridRegistration`** — **INVESTIGATED, NOT A CLEANUP.** The name is shared by `src/types/core/scene.ts` and `src/scene/gridGeometryProposal.ts`, but the shapes are not one type wearing two hats. The `types/core` one is manual map-asset registration — pure presentation geometry held deliberately outside `SceneState` so replay stays byte-identical with or without a map. The `gridGeometryProposal` one is the vision-proposal acceptance output: it renames the offsets, adds the source image dimensions the validator bounds-checks boxes against, and carries a derived `grid` that **is** scene state. Only `cellSizePx` is genuinely common. Collapsing them would either push scene state into the presentation type or drop the validator's image bounds, so both now carry comments stating the split. Re-open only if something needs one shape for both jobs.
- **The Phase-2 surfaces directory was never created.** `SurfaceStage` takes `ReactNode` slots instead, so later specs referring to "the Phase-2 `SceneSurface` stub to flesh out" point at nothing that exists.
- **`path_ref_rule` blind spot** — **CLOSED for the deploy surfaces.** The matcher now accepts `netlify/` and `supabase/` paths, so gateway, adapter and migration references are checked on every `check:doc-drift` run instead of by hand. It brought 12 references under the gate and found **0 stale** — the two spotted by hand this week were already fixed, so the value is prospective: the next one fails CI rather than surviving to a reader. `.env` stays ungated deliberately, since only `.env.example` is tracked and gating bare `.env` mentions would fail on a correctly-absent file.
- **`strikingRune` comment was stale** — **FIXED.** `src/types/core/character.ts` claimed no engine consumed it; `src/rules/combatants/characterCombatant.ts` does, gated on the system profile's `supportsStrikingRunes`. The comment now names the consumer and the gate.
- **The graphify index is stale.** `ShellContext`, `SurfaceStage` and `SceneCanvas` return no node, so every agent this session fell back to direct file reads. `npm run graph:update` is overdue.

---

## 8. Release — `p7.release` — **BLOCKED on 0.1**

Release engineering and launch. Should not begin while an open-content licensing question is unresolved.

---

## What this plan does not cover

- **Foundry-style content packs** and **homebrew/fusion** are permanently out of scope by owner decision. Do not reintroduce them.
- **Equipment routing for the two non-additive systems** is an accepted architectural boundary, not a gap: their derived defenses are override- and attribute-derived shapes the additive resolver cannot express. Revisit only if the IR gains override operations for other reasons.
- **Prose fidelity** is unaudited everywhere. Every fidelity finding so far is scalar; descriptions, traits and actions are unchecked in all seven systems. Scoping that is itself a lane, not an item.
