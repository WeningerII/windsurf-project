# Work Plan — what remains, in order

**Built:** 2026-07-26 · **Refreshed:** 2026-07-28 against `main` at `62ac50a` · **Basis:** four independent verification passes against code, not against prose

> **2026-07-28 — PR #105 is merged.** Everything this file marked DONE between
> 2026-07-26 and 2026-07-28 is now on `main`, and CI run `30341196839` is the first
> on that branch to execute the *entire* `npm run verify` chain green — twelve gates
> that had never run on it, including `check:dead-code` and
> `check:provenance-over-inclusion`, all passed. Items below are stated relative to
> `main`, not to a branch.

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

**Status as of 2026-07-28 — four of six are resolved:**

| | Decision | State |
| --- | --- | --- |
| 0.1 | Open-content licensing | **OPEN — owner** · the only genuine licensing exposure left |
| 0.2 | Shelf branches | Decided: delete deliberately · Phase 12 cut · *remote deletions still pending* |
| 0.3 | Cold-start microtask | Dissolved — the hazard was one call site, not six, so a third path needs no authorization |
| 0.4 | Contribution ledger | Decided and shipped: it has a consumer |
| 0.5 | knip test entry points | Decided, shipped, **and now CI-verified** (2026-07-28) |
| 0.6 | Phase 10 / character-draft | `character-draft` shipped · **Phase 10 still OPEN — owner** |

So two questions actually remain: **§0.1** (licensing) and the Phase-10 half of **§0.6**.

Three smaller owner calls have accumulated since. They are not in the table because
nothing downstream stalls on them, but they are unanswered and should not be
silently dropped: the **62 remote branch deletions** (§0.2), the **orphaned
feat-automation copy** (§4.3), and **ratification of the four kept sheet
wrappers** (§4.3).

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

~~**Unverified locally, needs CI.**~~ **VERIFIED IN CI 2026-07-28.** knip OOMs in this container, so the change shipped reasoned rather than run — which was the honest but uncomfortable state. Run `30341196839` executed `check:dead-code` for the first time on this branch and it passed. Both predicted failure modes were wrong: knip 5's auto-enabled vitest plugin did **not** re-admit test files through its additive `entry` patterns (so `"vitest": { "entry": [] }` was not needed), and the `.json` → `.jsonc` rename did **not** silently fall back to defaults. Recorded because the reasoning was sound and still could have been wrong — the gate, not the argument, is what settled it.

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

### 2.2 ~~Execute the `srd-manifest` demotion~~ — **DONE 2026-07-27, on `main` since `62ac50a`**

Decided 2026-07-21 (`GAPS.md` §6) and executed. The manifests are no longer committed, `generate-roadmap-metrics.ts` no longer imports `SRD_MANIFESTS`, and Denominator A is `docs/generated/srd-coverage.md` — the independent networked reverse diff — for every system.

The demotion was worth doing precisely because it *moved numbers downward*: **PF2e content% fell from a green 100% to 48.6%.** The old figure was circular — the manifests are generated *from* the loaders, so manifest ids sat on both sides of the join and drift could only ever read 100%, in that case against a denominator holding roughly a tenth of what the loader ships. The 48.6% is the first honest reading, not a regression.

**Do not re-gate the manifests.** Adding them to `check:generated-docs` would entrench the retired mechanism; this is a standing constraint, not a preference. See `docs/srd-manifest/README.md`.

**Unblocked:** every content% number in the repo is now measured against something external to it.

### 2.3 M&M 3e adversaries — **BLOCKED ON A DECISION, and the blocker is network access, not licensing** (corrected 2026-07-28)

`loadMonstersForSystem` returns `[]` for `mam3e`. 5 of 7 systems have loader-backed creature catalogs; M&M has none.

**Corrected after an owner challenge.** An earlier revision of this entry said no open-content source exists. Wrong, and the distinction matters:

- **`d20herosrd.com` IS the M&M 3e SRD** (OGL 1.0a), already named in `docs/srd-sources.md` and already cited in the header of every shipped archetype file. Its GM-section NPCs are open content this product may use.
- **This sandbox and CI are proxy-blocked from it** — verified twice, `CONNECT tunnel failed, response 403`. A developer on an ordinary connection can reach it today.
- **M&M is not empty.** 16 archetypes ship and are fully wired. But they are **build templates, not adversaries** — `description`, `features`, `suggestedSkills`, no ability scores or defenses. Promoting them to adversaries would mean inventing stat data, which is the prohibited move that created §17 and §18.

**Recommended path (`GAPS.md` §19.4(d)):** pull the GM-section NPCs once from an unblocked connection, pin the copy, and let an encoder run offline against it — exactly the pattern `scripts/encode-mam-equipment.mjs` already uses. That closes the gap with genuinely open content and never requires solving the proxy block in CI.

**Separate live defect, found by the same challenge:** every shipped archetype's `source:` field holds the archetype's *own name* (`source: 'Battlesuit'`) instead of a source book, while a `sourceBook` field also exists. That is mislabelled provenance in shipped data — cheap to fix and owed regardless of which §19.4 option is chosen.

### 2.4 5e-2024 hand-written monsters diverge from SRD 5.2 — **DONE for every gated field (2026-07-28)**

Every scalar divergence the fidelity baseline itemised has been re-transcribed from the pinned SRD 5.2.1 source: 71 hand-written monsters and the 4 backgrounds. `scripts/data/srd-fidelity-baseline.json` now records an empty `divergences` block, and `npm run check:srd-fidelity` passes with nothing baselined but two `upstreamDefects` (Basilisk AC, Soldier gaming set — both cases where the shipped value is right and the pinned denominator is not). See GAPS §15.3(b).

**What did NOT get fixed, and is the follow-on:**

- **Prose and derived numbers on those same entries.** The gate pins scalars only, so traits, actions, `savingThrows`, `skills` and attack/damage strings on the repaired stat blocks are still whatever they were. An entry can now hold a 5.2 ability score next to a 5.1-derived save. GAPS §15.4.
- **The 5e-2024 backgrounds' open-content exposure (GAPS §15(c)) is untouched.** Their proficiency sets are now SRD 5.2, but the 2014 structural model — `suggestedCharacteristics`, background `feature`, language grants — is still shipped under an `SRD 5.2` tag, and three of the four bodies of text are PHB content. This needs a `Background` type that can express the 2024 model, and it is a licensing item, not a tidiness one.
- **Bucket placement.** Seven entries had a wrong `challengeRating`; they were corrected in place and now sit in CR-bucket files named for their old CR. Nothing enforces the correspondence.

### 2.5 Remaining denominator work — **READY — 1 of 3 open**

- `p1.wire-remaining-denominators` — 3.5e classes and feats are wired against the core-only olimot chapters and the feat list is now **closed**: `scripts/encode-35e-feats.mjs` transcribes the feats chapter (hand-written entries keep winning), so the gap the coverage report used to itemise is gone. 3.5e **equipment** stays closed-by-no-source — the olimot equipment tables interleave services/lodging/mounts outside the loader's scope, and a scrape would poison the denominator. Current numbers live in `docs/generated/srd-coverage.md`.
- `p1.monster-denominator-fix` — 3.5e's denominator still inflated by container-like rows.
- ~~`p1.single-entry-gaps`~~ — **DONE 2026-07-28.** All four entries verified shipping against the loaders, and `docs/generated/srd-coverage.md` reports 0 missing in all four owning categories — an independent denominator, not just a re-read of the data. The two `[naming]` items were never missing content: the ledger listed them index-sort style (`Teleport (Greater)`) while the SRD and the loaders name them `Greater Teleport`. The 30 remaining 3.5e/monsters misses are container-like rows and belong to `p1.monster-denominator-fix` above, not here.

  This bullet is why `ledger_ref_rule` now exists. It sat here reading **CHEAP** and dispatchable while the ledger already recorded the item CLOSED, and nothing could see the disagreement: `ledger_status_rule` only checks the ledger against itself, and `blocked_ref_rule` only resolves section refs inside this file. The gate now reads the ledger.

---

## 3. Compute — Denominator B

### 3.1 Level the register layers — ~~READY~~ **DONE 2026-07-29 — and it turned a metric that could only read 100% into a real one**

**The layer gaps are closed.** All seven systems now span L1–L10, except `mam3e` L5, which is absent because M&M 3e has no spellcasting economy at all — no slots, no points, no per-rest casting resource. That is an honest structural absence, not a hole, and it was verified rather than assumed.

**The bigger finding is what closing them exposed.** Before this, every system published **100% compute completion** — 47/47, 41/41, 33/33, and so on across all seven. It read 100% because the register only ever contained rows that were already verified: the same ids on both sides of the ratio. **That is the identical circular-denominator defect this repo already diagnosed and fixed once for CONTENT** — the `srd-manifest` demotion (`docs/GAPS.md` §6), whose write-up says a committed manifest "created a circular denominator … which could only ever read 100%." The same shape had been sitting in Denominator B the whole time, and the previous wording of this section ("a curated subset … an uneven target") understated it: the metric was not merely uneven, it was structurally incapable of reporting anything but success.

**The first honest numbers, after +53 entries:**

| system | before | after |
| --- | --- | --- |
| daggerheart | 26/26 = 100% | **35/52 = 67.3%** |
| mam3e | 26/26 = 100% | **26/34 = 76.5%** |
| dnd-3.5e | 32/32 = 100% | **32/37 = 86.5%** |
| dnd-5e-2024 | 41/41 = 100% | **44/50 = 88%** |
| dnd-5e-2014 | 47/47 = 100% | **48/51 = 94.1%** |
| pf1e | 33/33 = 100% | 33/33 = 100% |
| pf2e | 29/29 = 100% | 29/29 = 100% |

pf1e and pf2e stay at 100% because they were the two that genuinely already enumerated all ten layers — the ratio was only ever meaningful for them.

**The `verified` count went UP, not down**: 234 → 247, and `check:compute-register` Tier A **demoted zero** — every new verified entry resolves to a real, exactly-named, passing test. The percentages fell because the denominator finally includes the quantities the rules define that the engine does not yet compute.

**61 entries survived the agent verifiers; 53 landed.** `check:rules-provenance` — a gate the agents never saw — then rejected 8 more on citations, which is the finding in `docs/GAPS.md` §24.2 worth carrying: an adversarial agent panel is not a substitute for the repo's own provenance gate.

Still true, and now the actual queue: **every new verified entry should land with a Tier-B mutation anchor.** The 17 added here pass Tier A and are reported `mutation: 'unanchored'`, which the gate deliberately surfaces so the numerator is honest about which verifications are name+pass only versus mutation-proven. Anchoring them is the follow-on lane.

Evidence and the adversarial method: `docs/GAPS.md` §24.

### 3.2 L8 — damage types and resistance — **SHIPPED 2026-07-29 (engine + scene path); sheet surface still open**

**The gap was never missing data, which changes what this item was.** `Monster` has declared `damageResistances`, `damageImmunities` and `damageVulnerabilities` since the type was written, and the shipped catalogs populate them **395 times**. Before this landed, the only references to those three fields anywhere outside `src/data/` and the tests were their own declarations in `src/types/creatures/monsters.ts` — **nothing read them.** A fire elemental took full fire damage on the grid; a skeleton took full bludgeoning. This was a wire-up, not a feature.

**What shipped:**

- `src/rules/resolver/damageMitigation.ts` — the pure transform. Immunity zeroes, resistance halves (rounding down), vulnerability doubles. Only two SRD sentences are encoded; the both-resistant-and-vulnerable case is **derived** from the stated ordering rule ("resistance and then vulnerability are applied after all other modifiers" → halve, then double → unchanged) rather than invented, and is reported honestly as `none`.
- `SceneTokenDamage` gains optional `type`, `mitigation` and `raw`; `SceneToken` gains an optional `damageProfile`. All additive.
- **Mitigation is resolved when the event is BUILT, never in the fold** — beside RNG, exactly as `SceneTokenDamage`'s existing contract already required ("the event stores the already-resolved amount... so the fold stays pure and replay-deterministic"). The fold is untouched, so RFC 006's byte-identical replay holds and **every event recorded before damage types existed replays to the identical number** (untyped damage is never mitigated). Pinned by a test.
- Profiles are **snapshotted onto the token at placement**, not looked up at resolve time. Looking them up would make a months-old scene's outcome depend on the SRD data as it exists at replay time — regenerating a catalog would silently rewrite history. Same reasoning as `hp`. Wired at both monster-token sites (`tokenPlacement.ts`, `encounterBuilder.ts`).
- 14 tests in `src/__tests__/rules/damageMitigation.test.ts`, including that healing is never mitigated under any branch (a fire-immune creature is not immune to being healed — the signed `amount` makes this the likeliest place for a sign bug).

**Still open, and deliberately not claimed:** no UI surfaces the damage type — nothing in the app yet lets a user *say* "10 fire", so in practice mitigation only fires for callers that pass a type. The sheet/scene damage-entry affordance and the L8 compute-register rows are the remaining work. The engine and the scene path are done and gated; the input surface is not.

---

## 4. Parity — the all-seven-equal spine

### 4.1 `p4.parity-matrix` — close the 7×N matrix — **BLOCKED on 0.1-class decision, not on work**

Cannot be honestly closed while one system has no creature catalog. §2.3 (corrected 2026-07-28) establishes that the source **does** exist and is open — the obstacle is that CI cannot reach it, not that it is unavailable. So this is closable work, gated on the owner picking `GAPS.md` §19.4(d) (fetch once from an unblocked connection, pin, encode offline) or one of the fallbacks.

### 4.2 ~~PF2e carries zero exclusion entries~~ — **DONE 2026-07-27**

PF2e read `Full` with zero entries while naming a manual focus-spell surface in its own support row. **Enumerated rather than relabelled**, because the gaps turned out real and findable and of genuine boundary shape: focus spells (no catalog automation — the list is a manual surface whose ids are deliberately not validated), prepared-slot assignment and cantrip selection, and rank-10 slots (class progression tables stop at rank 9; a rank-10 slot comes from a 10th-rank class feature).

**Deliberately kept out:** agile MAP and PF2e weapon specialization. Those are *unfinished automation*, and the registry header forbids parking unfinished work there — enumerating them would have converted a to-do into a permanent boundary.

The label was not downgraded to `Partial`, and the reason matters: PF2e's remaining non-boundary debt is content fidelity, which four of seven systems share and which `docs/generated/srd-coverage.md` already measures. Singling PF2e out would have swapped one mislabel for another. Now gated by `src/__tests__/manualExclusionRegistry.test.ts`.

### 4.3 Sheet eviction — ~~the dual-home is not transient~~ **EXECUTED; ratification of the four kept wrappers is an OPEN owner decision**

Six of the ten in-sheet browser wrappers are deleted and every affected tab grid is collapsed: `Dnd5eFeatBrowserTab`, `Pf2eFeatBrowserTab`, `Pf2eEquipmentBrowserTab`, `D20FeatBrowserTab`, `D20EquipmentBrowserTab`, `MamEquipmentBrowserTab`. Each re-hosted the same shared browser over the same loader the Dock already calls for that system, so the sheet copy was a true duplicate. The equipped-armour controls that shared the PF2e and d20-legacy equipment-browser tab moved onto Inventory instead of dying with it.

**Four are kept, and this is the finding the lane owes.** They are not duplication; they are capability the Dock does not have:

- `Pf2eSpellBrowserPanel` / `D20SpellBrowserPanel` browse a **class/tradition-filtered** spell list. The Dock's spell tab is the whole system catalog and cannot filter — it is shared-layer and cannot see the open character's class list.
- `MamAdvantageBrowserTab` is the only advantage browse-and-add surface in the product. `loadFeatsForSystem('mam3e')` returns `[]`, so the Dock's Feats tab is empty for M&M and there is no Advantage tab for its add verb to route through.
- `MamPowerBrowserTab` also hosts the power-modifier catalog, which has no Dock tab at all.

**What this unblocks / what it left open:**

- Making the Dock the only catalog route exposed **four** defects a sheet-side copy had been masking — the Dock pinned its catalog to the system open at *first* render (a PF2e sheet browsed the 5e catalog and click-add would have written 5e ids into it), printed M&M Equipment-Point costs as `undefined undefined`, captioned PF2e Bulk as pounds, and **crashed the whole app into its error boundary the moment the Dock re-keyed to M&M** (§6.6). All four are fixed; the per-system cost/weight normalisations the wrappers each carried locally are now one shared `formatItemCost` plus a per-system weight-unit map.
- Finishing the remaining four is **Dock capability work, not deletion work**: Advantage and Power-Modifier tabs, and a seam letting a sheet publish a catalog filter the Dock applies. That is the natural successor item.
- Phase 5's toast + count-badge micro-feedback on the click-add path is still unbuilt; adds land silently.

**What the eviction left, one still open:**

1. **DECIDE — the four kept wrappers need ratification.** The Phase-5 spec assumed the Dock covered every catalog and it does not (the three capability gaps above). Keeping the wrappers was the right call *given* that, but it was made by the lane, not by you, and it leaves the product with two browse routes indefinitely. Either ratify the split as the shipped design or fund the Dock capability work that would close it.
2. ~~**DECIDE — one string of user-facing copy is now orphaned.**~~ **RESOLVED 2026-07-28: deleted, not re-homed.** `DND5E_FEAT_COPY.browserSupport` is gone from `src/utils/documentationCopy.ts`.

   Re-homing it in the Dock's Feats tab was the obvious move and is wrong on inspection. That tab is shared-layer and browses **all seven** systems' feat catalogs, so a blanket caption about ability score increases and proficiencies — a 5e concept — would be false on the 3.5e, PF1e, PF2e and M&M catalogs shown by the same surface. And the information is already delivered better: the Dock stamps a per-feat **"Manual"** badge through `shouldShowDnd5eManualFeatBadge` (`src/dock/Dock.tsx`), marking the individual feats whose riders the engine cannot apply rather than asserting it across a whole catalog.

   `DND5E_FEAT_COPY.selectedSupport` stays — it is live in `Dnd5eSelectedFeatsSection`, on the 5e sheet, where a 5e-specific statement is correct. The eviction did drop user-facing explanation, but the replacement surface had already re-provided it in a more precise form; what was left behind was a string, not a capability.

---

## 5. AI and scene runtime — ~~all BLOCKED on 0.2~~ **UNBLOCKED since 2026-07-26**

Ordered by dependency. The gate was the shelf-branch verdict (§0.2), and that came on 2026-07-26 — delete deliberately, Phase 12 cut. This header still said "do not schedule any of these before the shelf-branch verdict" two days after the verdict; corrected 2026-07-28. Nothing here is waiting on §0.2 any more.

### 5.1 Give the shipped AI flows a surface — **HALF DONE 2026-07-27**

`character-draft` now has its affordance (§0.6). **`make-me-a-game` still has none** — it remains a complete, validator-gated, fixture-covered composition flow (party → encounter → ready scene, one seeded path parameterized over the registry with no per-system branch) with no UI and no persistence.

It is now reachable *through* the character-draft seam rather than being the only caller of it, which removes the "dead-rooted" problem but not the missing surface. Worth knowing before scoping it: `makeMeAGameFlow` is the **only** non-test caller of `systemRegistry.validateDocument`, which is why no user surface invokes build legality anywhere.

### 5.2 Phase 14's one remaining join — **NOT CHEAP; it is a schema change (re-scoped 2026-07-28)**

Everything else in the observability layer shipped. What remains is described accurately as a single join — **a trace id does not yet reach a scene event** — but the description undersells the work, and it was pulled into a cheap batch on that basis and put back.

**Why it is not small.** `SceneEvent` (`src/types/core/scene.ts`) carries no trace, provenance or origin field, so this is an addition to the **append-only event type** whose fold RFC 006 guarantees replays byte-identically. That reaches:

- persistence in both tiers (`sceneStorage.ts` — IndexedDB and the localStorage snapshot),
- scene import/export, which must accept events written before the field existed,
- the fold in `src/scene/runtime.ts`, which must be proven to produce identical output with and without it,
- and the cross-tab/merge path, where an unknown field must not change the signature comparison.

The gateway side is genuinely ready — `traceId` already exists on `AiGatewayLogRecord` (`src/ai/gatewayLog.ts:17`) and on both the request and response contracts in `src/ai/contracts.ts`. It is the scene side that has no seat for it.

**What the lane needs, whoever takes it:** a decision on whether the trace rides *on the event* (replay-visible, needs the byte-identical proof) or *beside it* in a side table keyed by event id (replay-invisible, no schema change, but does not survive export). That choice is the actual work; the plumbing after it is small either way. Do not start this without picking one.

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

1. ~~**`saveScenes` has no `try/catch`**~~ — **DONE 2026-07-27.** Scenes now persist to IndexedDB with a localStorage snapshot kept only so the first paint has something to render (`src/hooks/useScenes.ts`, `src/utils/sceneStorage.ts`). Durability moves from the ~5 MB localStorage ceiling to the browser's storage quota, `saveScenes` resolves with which tiers are current instead of throwing inside a debounce timer with nobody to catch it, and a campaign too large for localStorage lives in IndexedDB alone — so the async second stage is not an optimization, it is the only path that returns the full collection. The live data-loss risk is closed; the sync question below is not.
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

**Asymmetry in how the two flags are gated, as of 2026-07-28:** Phase 4's flag-on acceptance now runs in CI (§6.8) even though the flag still defaults OFF. Phase 6's does not, and the reason is different — its spec was never written, so there is no gate to run rather than a gate that skips.

### 6.3 `p5.infra-gaps` residuals — ~~READY~~ **NOT WORK — mislabelled**

This has no work item in it. All four entries are *recorded decisions*: no analytics network sink (`createBeaconSink` is seam-only, deliberately), Sentry release wiring deferred behind the bundle budget, server-side 5xx alerting is ops provisioning rather than code, and the a11y contrast quarantine — which §6.4 has now closed.

It read **READY** because the section exists, not because anything in it is dispatchable. Corrected 2026-07-28 rather than left to consume a lane's scoping time. The three genuine decisions still stand as decisions; if any is ever reversed it becomes a new item, not this one.

### 6.4 ~~The quarantined a11y contrast finding~~ — **DONE 2026-07-28: it was a real WCAG AA failure**

The `test.fixme` on the dialog/wizard scan is gone and the test runs. Its note said resolving it needed the live DOM (computed styles up the ancestor chain), which was true and took about a minute once a browser was actually available.

**The finding was real and was shipping.** The creation-validation warning — `<span>No class levels are selected yet.</span>` — inherits `text-amber-600` (`#d97706`) on the card's white at 12px, which is **3.18:1** against AA's 4.5:1. Tailwind's amber-600 does not pass as body text on white anywhere; the app now uses amber-700 (`#b45309`, 5.02:1). Dark mode was already compliant (`amber-400` at 11.98:1) so only the light value moved, across the 13 call sites that shared the colour.

**The old note's diagnosis did not survive the live DOM**, and that is recorded in the spec rather than deleted: it described `#6b788c` on ability-score labels at 4.47:1 and inferred an unexplained opacity, but every element from the failing span up to the dialog reports `opacity: 1` and `filter: none`, and the colour is exactly what the class declares.

**The transferable point:** the quarantine was correctly placed at the test level rather than by allowlisting `color-contrast` — but it still hid a live AA failure on the surface where every character in this app is created, for all seven systems, for as long as it stood. A skipped test is a gate that cannot fail.

### 6.5 Toolchain modernization — **READY**

Risk-ordered, verified against `package.json`: React 18.2→19, Tailwind 3.3→4, Vite 7.3→8, `lucide-react` 0.294→1.17, `@types/node` 20→22, and runtime-pin reconciliation (`.nvmrc` pins 20.19.0 while `engines` already admits 22 and 24).

### 6.7 ~~Wall-clock assertions flake under parallel workers~~ — **DONE 2026-07-28**

Surfaced by the CI work, not planned: restoring vitest parallelism made
`src/__tests__/drag/gateBudget.test.tsx` fail ~1 run in 3 under contention. It
asserted `performance.now()` deltas against a 50 ms budget, which cannot tell
"the code got slower" from "the machine was busy" — so it was never a gate under
parallelism, in either direction.

Re-instrumented to counted DOM mutations plus a scale-invariance assertion (the
same drop on 100 cells and 900 cells must cost identically; both measure 1). The
absolute ceiling came down from 50 ms to 8 mutations, set from measurement. The
counter self-checks so it cannot silently return zero. Full write-up and the
generalisable rule — **a gate may not assert on wall-clock in the unit suite** —
in `docs/GAPS.md` §21.

Worth noting for anyone adding a performance gate here: this repo had already
reached that conclusion once, for `check:keepalive-budget`, and the reasoning
was recorded in `MASTER_PLAN` while a second gate shipped with the same defect.
Nothing pointed from one to the other.

### 6.6 Shared formatters lie about shape across systems — ~~READY, CHEAP~~ **DONE 2026-07-28**

A defect *class*, not a defect. Two instances have now shipped and been fixed one commit apart, which is what makes it worth a plan item rather than a bug report.

`formatCastingTime(ct: CastingTime)` declares its parameter non-optional and read `ct.amount` unguarded. But `loadSpellsForSystem('mam3e')` returns `loadMam3ePowers()` (`src/utils/dataLoader.ts:631`), and an M&M power has no casting time at all — so the Dock crashed the entire app into its error boundary the moment it re-keyed to M&M. `formatItemCost` had been written for the identical problem one commit earlier (M&M prices gear in Equipment Points, Daggerheart may carry nothing), and the eviction that made the Dock the single browse route hardened `cost` and missed `castingTime`.

**The shape only diverges at runtime, per system, so TypeScript cannot catch it.** The per-system wrappers used to absorb it locally; collapsing them into one shared browser moved every such divergence onto the shared formatters at once. Expect more of these as Dock coverage grows.

~~**The work:**~~ **DONE 2026-07-28.** The audit ran against what the loaders actually return, by loading all seven catalogs and counting absent fields rather than reading the types:

| catalog | measured absences |
| --- | --- |
| `mam3e` spells (61 powers) | `castingTime` 61/61, `areaOfEffect` 61/61, **`level` 61/61, `school` 61/61** |
| `mam3e` equipment (192) | `weight` 192/192 |
| every d20 system's spells | `areaOfEffect` absent on most rows (e.g. PF1e 616/625) |
| `daggerheart` | both catalogs empty (0 rows) |

**One live defect found, one layer above the formatters.** `castingTime`, `cost` and `weight` were already handled. But `SpellBrowserSpell` declared `level: number` and `school: string` **required**, and M&M has neither — so the row caption rendered its prefix followed by two blanks (`"Rank  "`), and the Level and School filters offered a dropdown whose only entry was an empty option. The interface comment even asserted "rank rides `level`, power type rides `school`" — that describes an intended mapping the loader never populated. Both fields are now optional, absent values are dropped from the filter vocabularies, each filter hides itself when its vocabulary is empty, and the caption is built from the parts that exist.

**`formatRange` and `formatDuration` were checked and are fine** — the probe found `range` and `duration` present on every row of every system, and both functions `switch` on `.type` and fall through to `'Unknown'`, so an unfamiliar shape degrades rather than throws.

**The gate the plan asked for now exists:** `src/__tests__/dock/sharedFormatterShapes.test.ts` runs every formatter over every row of all seven shipped catalogs (15 tests), failing if one throws or leaks `undefined`/`null`/`NaN` into a caption. Proven able to fail: deleting the `formatCastingTime` guard reproduces `TypeError: Cannot read properties of undefined (reading 'amount')` against the mam3e catalog — the original crash — and turns the suite red.

**Still true, and the reason this was a class rather than a bug:** absence is legitimate. A power has no casting time, and that must not be "fixed" in the data. Expect more of these as Dock coverage grows — the test is the thing that will catch the next one at unit level instead of via an e2e smoke test that only noticed because the page died.

### 6.8 The Phase-4 keystone acceptance had never executed — **DONE 2026-07-28**

Third instance of §6.4's transferable point (*"a skipped test is a gate that cannot
fail"*), found by deliberately grepping for siblings after that one closed.

`e2e/scene-drag.spec.ts` opens with `test.skip(!FLAG_ON)` on
`VITE_SCENE_DRAG_ENABLED`, and **no workflow had ever set that variable.** So from
the day it was written the spec skipped on every run — and Playwright exits 0 on a
fully skipped file, so the phase's keystone acceptance reported green while proving
nothing. The docs said this out loud in three places and nobody read it as a defect,
because the pipeline was green.

**Its first-ever execution failed, on a defect that was shipping.** `Dock` re-keys
its catalogs to `activeSystemId`, which `src/App.tsx` passed as `currentDoc?.systemId`
— the open *sheet's* system. A scene never set it, so with a scene open the Dock
stayed on the default (first registered system, 5e-2024) while a new scene is
5e-2014. **Dragging a monster from the Dock into a scene of a different system
silently did nothing: no token, no chip, no error.** Default state hit it
immediately. Causation confirmed by a one-variable experiment — aligning the Dock's
system to the scene's makes the identical drag land. Fixed by preferring the open
scene's `systemId`.

**The gate now runs, and cannot go quiet again.** The `scene-drag` job in
`.github/workflows/ci.yml` builds with the flag on, runs the spec against that dist,
and then asserts from Playwright's JSON report that the tests were not *skipped* —
because the exit code alone is exactly what failed to notice this for months. Both
halves were validated locally before landing: with the flag the assertion passes on
2 executed specs; without it, Playwright still exits 0 and the assertion exits 1.

**Remaining sibling, checked and clean:** the only other `test.skip` in `e2e/` is
`pwa-offline.spec.ts`, conditioned on `browserName !== 'chromium'`. The chromium
project always runs, so that test does execute — a legitimate per-project skip, not a
vacuous gate. Phase 6's flag (`VITE_SCENE_CANVAS_ENABLED`) still has no job, but that
is not the same defect: its spec was never written, so nothing is claiming to gate it.

### 6.9 Technical-debt sweep — **DONE 2026-07-28**

Ran deliberately rather than opportunistically. Full evidence in `docs/GAPS.md` §23.

**The classic metrics came back clean, and that is the finding.** Zero `as any`,
zero `TODO`/`FIXME`/`HACK`, one genuine `any` (an idiomatic function-wrapper
signature), four `@ts-expect-error` that are all deliberate negative type tests,
and ten `eslint-disable` of which eight carry a written reason. The two
`react-hooks/exhaustive-deps` suppressions were verified against the actual
implementations rather than taken at their word, and both claims hold. **This
repo's debt is not in its type surface** — it is in claims nothing checks, which
is where the three real findings were:

1. **`CLAUDE.md` was outside the doc-drift gate entirely** and had drifted twice
   (`505 files` against 512; an RFC range ending at 006 when 007 exists). It is the one
   root doc loaded as project instructions at the start of every agent session,
   so its errors are *acted on*. Now gated with `count_rule` / `command_rule` /
   `path_ref_rule`, on two new derived truths (`dataFileCount`,
   `verifyGateCount`) that are computed and never transcribed. All five rules
   mutation-tested individually, then restored.
2. **`knip.jsonc` documented a safeguard that does not work.** Its `.claude/**`
   ignore entry is described as preventing the worktree OOM; measured with the
   entry present, 41 worktrees still produced `FATAL ERROR: Reached heap limit`,
   and removing the worktrees produced exit 0 in 7.8s. Comment corrected, entries
   kept for the reporting-noise suppression they actually provide. This mattered:
   `check:dead-code` is step 16 of 22, so **no full local `npm run verify` was
   possible** while the worktrees existed.
3. **41 stale agent worktrees (5.9 GB)** removed after checking every one for
   uncommitted and unpushed work. The single dirty one was the over-inclusion
   audit, proven strictly superseded by `main` (24 worktree-only entries, all
   `undetermined`; 84 entries re-classified on `main`; zero unique to the
   worktree) and archived before removal. **113 local branches before, 113
   after** — worktree removal does not delete branches.

4. **The status gates had a hole in the expensive direction.** `ledger_status_rule`
   checks the ledger against itself and `blocked_ref_rule` resolves section refs
   inside this file; neither could see this plan queuing an item the ledger already
   recorded `done` — which is what §2.5 was doing. New **`ledger_ref_rule`** resolves
   every ledger id cited here against the ledger. Confirmed red on the real drift,
   green after the fix, red again when experimentally re-opened; three unit tests
   pin it including the false-positive guards. A full plan-against-ledger scan found
   exactly one instance, so this was a hole, not a pattern.

**Not repo defects, recorded so they are not re-diagnosed:** `@ai-sdk/anthropic`
was missing from this container's `node_modules` after a recycle (`npm ci`
restores it; the lockfile is correct), and one earlier "verify passed" report of
mine was wrong because the backgrounded command ended in an `echo` whose exit
code the harness reported instead of npm's.

---

## 7. Dead code and hygiene — ~~READY, CHEAP~~ **DONE; §7.2 keeps two standing notes**

> **Corrected 2026-07-29, and only by hand.** This heading read `READY, CHEAP`
> while §7.0, §7.1 and §7.2 were all closed — it advertised dispatchable work
> that did not exist. `heading_status_rule` catches the sibling case (§6.6) but
> **not this one**: it keys on the repo's explicit `~~**The work:**~~ **DONE**`
> idiom, and "every subsection beneath this heading is resolved" is not
> reliably mechanizable without matching ordinary prose. Narrowing was
> deliberate — an earlier draft that matched any `**DONE` in a body fired on
> §2.5, where one of three bullets is closed and the section is genuinely open.
> A gate that cries wolf gets weakened. So: one of the two real cases is gated,
> the other is documented as not gated.

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
- ~~**`src/systems/pf2e/derivedMath.ts`**~~ — **ALREADY DONE; this bullet was stale and contradicted §7.2 below.** It claimed the module "has no non-test importer" and that "neither happened". Both are false as of 2026-07-28: `Pf2eHeader.tsx` imports `PF2E_HERO_POINTS_MAX`, `Pf2eSpellsTab.tsx` imports `pf2eAttackModifier`, `usePf2eMutationHandlers.ts` imports `PF2E_HERO_POINTS_AT_SESSION_START`, and `derivedQuantities.ts` imports the death-track helpers. §7.2's last bullet already recorded the wire-up in detail, including which helpers stay test-only and *why* — so this file asserted a thing and its own refutation, two sections apart.

  Corrected rather than deleted, because the failure mode is the point: a plan that contradicts itself sends the next lane to do work that is finished, and this one survived several passes because nobody read the two sections together.

### 7.2 Small items surfaced during verification

Small, real, and each found while checking something else.

- **Duplicate `SceneGridRegistration`** — **INVESTIGATED, NOT A CLEANUP.** The name is shared by `src/types/core/scene.ts` and `src/scene/gridGeometryProposal.ts`, but the shapes are not one type wearing two hats. The `types/core` one is manual map-asset registration — pure presentation geometry held deliberately outside `SceneState` so replay stays byte-identical with or without a map. The `gridGeometryProposal` one is the vision-proposal acceptance output: it renames the offsets, adds the source image dimensions the validator bounds-checks boxes against, and carries a derived `grid` that **is** scene state. Only `cellSizePx` is genuinely common. Collapsing them would either push scene state into the presentation type or drop the validator's image bounds, so both now carry comments stating the split. Re-open only if something needs one shape for both jobs.
- **The Phase-2 surfaces directory was never created.** `SurfaceStage` takes `ReactNode` slots instead, so later specs referring to "the Phase-2 `SceneSurface` stub to flesh out" point at nothing that exists.
- **`path_ref_rule` blind spot** — **CLOSED for the deploy surfaces.** The matcher now accepts `netlify/` and `supabase/` paths, so gateway, adapter and migration references are checked on every `check:doc-drift` run instead of by hand. It brought 12 references under the gate and found **0 stale** — the two spotted by hand this week were already fixed, so the value is prospective: the next one fails CI rather than surviving to a reader. `.env` stays ungated deliberately, since only `.env.example` is tracked and gating bare `.env` mentions would fail on a correctly-absent file.
- **`strikingRune` comment was stale** — **FIXED.** `src/types/core/character.ts` claimed no engine consumed it; `src/rules/combatants/characterCombatant.ts` does, gated on the system profile's `supportsStrikingRunes`. The comment now names the consumer and the gate.
- ~~**The graphify index is stale.**~~ — **DONE 2026-07-28.** All three named symbols resolve again after `graphify update`: `ShellContext` (`src/contexts/shell-context.ts:165`), `SurfaceStage` (`src/components/SurfaceStage.tsx:53`), `SceneCanvas` (`src/components/SceneCanvas.tsx:56`). Graph now at 5,938 nodes / 17,180 edges.

  **The recurrence is the real item, and it is not fixed.** Nothing runs `graph:update`; it is not in `npm run verify` and no workflow calls it, so the index goes stale again on the next merge and the next agent silently falls back to file reads — a slow failure with no signal, which is why this bullet had to be written by hand in the first place. Deliberately not added to `verify`: the graph artifacts are committed, so a gate would either fail every PR that touches `src/` or quietly rewrite tracked files mid-chain. A staleness *check* (compare the graph's recorded input hashes against the tree, warn rather than fail) is the shape that would work. Left open rather than half-built.
- **`src/systems/pf2e/derivedMath.ts` had no non-test importer** while its PF1e twin was live. **Done:** the death-track helpers are declared in `PF2E_DERIVED_QUANTITIES` (dying-on-knockout, recovery DC, wounded-track) so the engine computes them into `system.derived` and the sheet surfaces the first two while on the death track; `pf2eAttackModifier` now backs the sheet's spell-attack readout and the hero-point constants back the header pip track and the long-rest handler. All substitutions are value-identical — no computed output moved. **Still test-only, for structural reasons recorded on their compute-register rows:** `pf2eDyingAfterRecovery` / `pf2eIsDead` (transitions and a predicate, not standing numeric scalars), `pf2eShieldBlockDamage` (needs a shield Hardness the equipment model does not carry), and `pf2eCreatureXP` / `pf2eEncounterBudget` (party-scoped GM math owned by `src/scene/`, which the lint-enforced layer boundary forbids from value-importing `src/systems/**`).

---

## 8. Release — `p7.release` — **BLOCKED on 0.1**

Release engineering and launch. Should not begin while an open-content licensing question is unresolved.

---

## What this plan does not cover

- **Foundry-style content packs** and **homebrew/fusion** are permanently out of scope by owner decision. Do not reintroduce them.
- **Equipment routing for the two non-additive systems** is an accepted architectural boundary, not a gap: their derived defenses are override- and attribute-derived shapes the additive resolver cannot express. Revisit only if the IR gains override operations for other reasons.
- **Prose fidelity** is unaudited everywhere. Every fidelity finding so far is scalar; descriptions, traits and actions are unchecked in all seven systems. Scoping that is itself a lane, not an item.
