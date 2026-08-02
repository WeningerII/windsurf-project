# Open decisions — the exhaustive list

**Generated 2026-07-29** by sweeping every tracked markdown file (`git ls-files '*.md'`,
248 files) for blocks, deferrals, open questions and unmade decisions, then triaging
by hand. 509 raw hits, 361 after removing anything the repo's own convention already
marks resolved (struck-through or `**DONE**`/`**CLOSED**`/etc.), then de-duplicated
into the items below.

This file exists because the same decisions were being restated across
`WORK_PLAN`, `GAPS`, `MASTER_PLAN`, `memory/hot.md` and four design docs, so nobody
could see the whole set at once. **It is an index, not a new authority.** Each entry
cites where the real record lives; if this file and the cited section disagree, the
cited section wins.

---

## A. Genuinely the owner's — authority, not expertise

These are not blocked on technical judgement. They are blocked on someone with the
right to decide what this product ships, what legal risk it carries, and what gets
deleted. An engineer — human or otherwise — cannot make them correctly no matter how
good they are, because the inputs are preference and risk appetite, not evidence.

| # | Decision | Where | Why it is yours |
| --- | --- | --- | --- |
| ~~**A1**~~ | ~~**31 records ship content with no open-content counterpart anywhere.**~~ **DECIDED AND EXECUTED 2026-07-30: delete.** The class stood at 89 records; all of them were content this project wrote rather than transcribed. All 106 entries admitted through the `originalContentSources` channel are deleted, plus `Cloak of the Archmagi` and `Pegasus Boots` (same invented content, still claiming `SRD 5.2`). The channel is deleted too, so this cannot recur silently. `genuine-non-open-content` = **0**. | `GAPS` §17.3 | — |
| **A2** | **OC-1 — Great Weapon Master / Sharpshooter cite SRD 5.1, which does not contain them.** SRD 5.1 opens exactly one feat (Grappler); both are 2014 PHB content. The gate records the evidence and stops. | `GAPS` §11, §OC-1 (L837) | Same class as A1, and `GAPS` L2866 calls it "cheap to make, and it is blocking a" downstream item. |
| **A3** | **Pile C — 68 wrong-edition records** (was 78; 73 after the allowlists were widened to admit the books by their true names, 68 once the deleted homebrew stopped shadowing rows). Honest re-tagging drops most of them from shipped catalogs, because `filterOpenContentBySource` silently removes anything whose source leaves the allowlist. | `WORK_PLAN` §2.1 | Re-tagging is a *product* change disguised as a data cleanup. |
| **A4** | **Ratify (or reject) the four kept sheet wrappers.** Phase 5 assumed the Dock covered every catalog; it does not. Keeping them was decided by a lane, not by you, and leaves two browse routes indefinitely. | `WORK_PLAN` §4.3 (L299) | Accept the split as the shipped design, or fund the Dock capability work that closes it. |
| **A5** | **M&M 3e adversaries — nothing was encoded.** Recommended option (d): fetch `d20herosrd.com` once from an unblocked connection. **The blocker is the sandbox proxy, not licensing.** Option (b) — author them as labelled original content — was **foreclosed 2026-07-30** with the rest of the homebrew; the choice is (d) or (a). | `GAPS` §19, §19.4 | Needs someone with network access willing to vouch for the source. |
| **A6** | **62 remote branch deletions.** 63 branches recorded as retired; 65 remote refs exist. | `docs/history/2026-07-26-retired-branches.md` | Destructive and irreversible-ish. Never done without explicit consent. |
| **A7** | **Raise the two bundle budgets, or don't ship React 19.** react-dom 18→19 is ~+13.9 KB gzip; eager shell lands ~187.7 KB against a 180,224 B ceiling and total JS ~1684.9 vs 1680 KiB. | `WORK_PLAN` §6.5 | `scripts/check-bundle-size.mjs` states the next climb must be paid by *structural reclaim*, not another bump. Overriding that is governance. |
| **A8** | **Pick the target Node version for the runtime pin.** Everything else about the bump is scoped and gated. | `WORK_PLAN` §6.5 | Changes CI's runtime and every contributor's environment. |
| **A9** | **`scene_events` RLS scoping for shared campaigns.** You already decided multiplayer is in scope (2026-07-26), which ruled out the cheap durability-only path. Re-scoping an append-only table is expensive to get wrong. | `WORK_PLAN` §5.7 | Data-model commitment with migration consequences. |

---

## B. Mine, and I over-deferred — I will just decide these

I asked for input on these and should not have. They are engineering calls with a
defensible right answer, and the cost of being wrong is a revert, not a lawsuit.
**Listed so you can veto, not so you must choose.**

| # | Item | Where | My call |
| --- | --- | --- | --- |
| ~~**B1**~~ **EXECUTED 2026-07-31** | Multi-channel damage split — how to divide one scalar total across `slashing + fire` so the parts sum to the whole. | `WORK_PLAN` §3.2 | Largest-remainder distribution over channel proportions, biggest channel absorbs the remainder. Deterministic and total-preserving. |
| **B2** — *unblocked; `check:ci-parity` landed 2026-07-31 (`WORK_PLAN` §6.10)* | The five-job CI split (~2m30s–3m30s saving). | `memory/hot.md`, §6.5 | Do it, but land `check:ci-parity` first — asserting the workflow's `npm run` multiset equals the verify chain — because otherwise a step added to `package.json` silently never runs in CI. That is this repo's documented failure mode. |
| **B3** | Tailwind 4 / lucide 1.x / Vite 8 sequencing. | `WORK_PLAN` §6.5 | Vite 8 first (loudest failures, caught by steps 1–21), then lucide, then Tailwind last. All three gated on CI e2e, none landed from this container. |
| **B4** | `p1.monster-denominator-fix` — 3.5e denominator inflated by container-like rows. | `WORK_PLAN` §2.5 | Fix it; it moves a published number *downward toward honesty*, which is the same direction as today's compute-register work. |
| ~~**B5**~~ **EXECUTED 2026-07-31** (`scripts/check-graph-staleness.mjs`, warn-only, exits 0) | graphify index staleness. | `WORK_PLAN` §7.2 | Add a warn-only staleness check, not a gate — the artifacts are committed, so a hard gate would either fail every `src/` PR or rewrite tracked files mid-chain. |
| **B6** | Phase-6 `VITE_SCENE_CANVAS_ENABLED` has no CI job and `e2e/scene-canvas.spec.ts` was never written. | `WORK_PLAN` §6.2 | Write the spec and the job, mirroring the `scene-drag` pattern that caught a real defect. |
| **B7** | The "every subsection resolved" heading shape stays ungated. | `WORK_PLAN` §7 | Leave it. Narrowing was deliberate — the broad version false-positived, and a gate that cries wolf gets weakened. |

---

## A-DECIDED. Owner rulings, 2026-08-01 — recorded verbatim

Four decisions taken. **On three of four the owner chose the more expensive
option than the one recommended**, which is recorded here because the cheap
option was argued for and rejected, not overlooked.

| # | Decision | Ruling |
| --- | --- | --- |
| **A2/A3, §8** | The 68 `wrong-edition-attribution` records | **REPLACE with same-edition equivalents.** Not the recommended re-tag-and-drop. Every record gets a genuine entry transcribed from its own edition's open source, so the catalogs keep their rows AND every citation becomes true. — **EXECUTED 2026-08-01, with a documented limit.** 15 records had a genuine same-edition entry and were replaced with it; 13 turned out to duplicate an edition-correct row the catalog already shipped, so the equivalent was already present; **40 had no equivalent to transcribe** — PF2e has no Basket, Bell, Bucket, Ring Mail or Siangham under any name in any book, checked against two independent datasets — and were removed. The ruling's goal held: every surviving citation is true, and `check:provenance-over-inclusion` reports `licensing-class total: none`. What could not hold is "the catalogs keep their rows", for rows whose edition never had them. See `GAPS` §26. |
| **A4, §4.3** | The four kept sheet wrappers | **FUND THE DOCK CAPABILITY WORK.** Not ratification. Build the Advantage tab, the Power-Modifier tab, and a sheet→Dock catalog-filter seam, then delete the four wrappers, restoring the single browse route Phase 5 intended. — **EXECUTED 2026-08-02.** All three built, all four wrappers deleted. The seam publishes a predicate rather than a descriptor, so no static import crosses the layer boundary. Two calls taken while building: no `addPowerModifier` channel (nothing would walk through it), and empty tabs hide rather than reading zero. See `WORK_PLAN` §4.3. |
| **A5, §2.3** | M&M 3e adversaries | **OWNER FETCHES `d20herosrd.com` once**; the encoder then runs offline against a pinned copy, as `scripts/encode-mam-equipment.mjs` already does. Unblocks §4.1. |
| **§0.6** | Phase 10 grid-geometry validator | **BUILD `analyze-map` + a MapPanel affordance (~1 day).** Not the recommended close-as-seam. — **BUILT 2026-08-02.** `gridGeometryProposal.ts` has a consumer for the first time since it landed. The affordance is a proposal review: Apply is offered only on an `accept` verdict, and the image dimensions the validator needs are measured client-side rather than taken from the model. Both properties have controls that were watched failing. See `WORK_PLAN` §0.6. |

### Feasibility, measured rather than assumed (2026-08-01)

The replacement ruling is the one that could have been undeliverable here, so
reachability was tested before starting:

| source | status |
| --- | --- |
| `raw.githubusercontent.com` (Pf2eTools, 5e-database, PSRD-Data) | **200 — reachable** |
| `d20srd.org` | 000 — proxy-blocked |
| `2e.aonprd.com` | 000 — proxy-blocked |
| `d20herosrd.com` | 000 — proxy-blocked (this is why A5 needs the owner) |

All three systems carrying wrong-edition records — pf2e (50), dnd-5e-2024 (14),
pf1e (4) — have GitHub-mirrored open sources, so the work is executable in this
environment. The blocked hosts affect only M&M adversaries.

---

## C. Blocked on work, not on anyone

No decision required. These are queued and unstarted.

- **`p1.provenance-over-inclusion-audit`** — classification done, remedies are A1/A3.
- **`p4.parity-matrix`** — the 7×N capability matrix; blocked on A1-class decisions, not on work.
- **`p5.ai-provider-agnostic`**, **`p6.expansions`**, **`p7.release`** — ledger `pending`.
- **`p2.rfc003-consolidation`** — in progress.
- **Phase 6 remaining slices** — `SceneManager` decomposition (~1,220 LOC), right-rail summon tray, pan/zoom viewport, distance ruler, `PlacementMode` deletion.
- **Phase 7 remaining** — hash-sync restore-on-reload, seam catalogue, chrome-dominance gate (genuinely blocked on Phase 6's tray).
- **Build-spec open questions** — `useSheetClickToAdd` registration shape across pf2e/d20/mam3e (L340); Generate-NPC re-home once `PlacementMode` is deleted (L403); marker drag source location (L406); seam-context of-record location (L430).
- **Prose fidelity is unaudited in all seven systems.** Every fidelity finding so far is scalar; descriptions, traits and actions are unchecked. Scoping it is itself a lane.
- **Tier-B anchors** — *closed 2026-07-29*, 247/247 mutation-proven; **264/264 after the 2026-07-31 tranche**. Listed only because it appears as open in older prose.

### Surfaced 2026-07-31 by the six-lane run — **all executed 2026-08-02**

The five work items below were dispatched as one parallel run and are done. Kept
here with their original framing because each one's finding outlived the fix.

- ~~**Wire the area-effect path to typed damage.**~~ **DONE.** `areaEffectToDamageIntent` and `multiTargetAttackToDamageIntent` have no callers outside tests and the barrel; the shipped fireball path builds an untyped intent inline at `src/rules/combat/sceneCombat.ts:503`. Until that is wired, **a fireball on a fire elemental does not mitigate.** `WORK_PLAN` §3.2.
- ~~**The dark a11y gate reaches 4 of ~17 touched files**~~ **DONE** — closed by the second option, a static Tailwind contrast lint (`scripts/check-a11y-contrast.mjs`) that resolves class names against the shipped palette and the `:root`/`.dark` tokens, judges every text-colour string twice, and pins 40 pre-existing failures with their exact ratios. It landed unwired — an npm script in neither `verify` nor `.github/workflows/ci.yml`, which is §6.4's own transferable point ("a skipped test is a gate that cannot fail") applied to its own remedy — and is now **wired: `check:a11y-contrast` is verify chain step 8 and the "Dark-mode contrast" step of the `static-analysis` job**, so `check:ci-parity` holds the two in sync at 24 steps. Original: — proven by a control that was NOT caught. Either scan surfaces that render the affected components, or add a static contrast lint over Tailwind classes lacking a `dark:` variant. `WORK_PLAN` §6.4.
- ~~**`normalizeLegacyEquipment` launders 8 non-coin 3.5e prices**~~ **DONE** — fixed at normalization time via a new `Item.costText`; `cost` stays non-nullable because every arithmetic consumer reads `cost.amount` unguarded. The population was exactly the 8 predicted. Original: (`'Varies'`, `'3 cp/mile'`) into a well-formed `0 gp`. Unfixable in the formatter — indistinguishable there from a legitimately free pf2e item. `src/utils/dataLoader.ts`.
- ~~**The L8 compute-register rows** the damage-split work now owes.~~ **DONE** — 12 rows (6 per 5e edition), 276 verified entries, zero demotions. Tier B is NOT claimed: that needs a mutation run, which refuses a dirty tree.
- **Rename compute layer L5.** Nine of the ten layers are named by FUNCTION; L5 alone by a MECHANIC ("spellcasting economy"), which is why it is the only layer a non-magic system cannot fill honestly. M&M's rows were mis-filed there and reclassified to L8/L9 on 2026-07-31 with no number movement; renaming the layer would stop it recurring, but it changes the meaning for all seven systems.
- **`wip/lane-snapshot`** — a superseded recovery branch on the remote. Verified to hold nothing unique. **This sandbox's git proxy refuses branch deletion** (`the remote end hung up unexpectedly`, both syntaxes) and no delete-branch tool is available, so it needs deleting from the GitHub UI.

---

## D. Already decided — do not re-litigate

Recorded so these stop resurfacing as if open.

- **Foundry-style content packs** and **homebrew/fusion** — permanently out of scope (owner).
- **Phase 12 LLM strategist** — cut from the roadmap; the prototype branch was deliberately not salvaged.
- **`srd-manifest` demotion** — executed. Do **not** re-gate the manifests; that is what created the circular denominator.
- **Multiplayer is in scope** (2026-07-26) — this is what makes A9 necessary.
- **5e-2024 exhaustion −2/level** — ratified 2026-07-20.
- **`p5.infra-gaps` residuals** — four recorded decisions, no dispatchable work: no analytics network sink, Sentry release wiring deferred behind the bundle budget, 5xx alerting is ops provisioning, and the a11y contrast quarantine (since closed — it was a real WCAG AA failure).
- **Never delete or relabel shipped content unilaterally** — standing constraint (`GAPS` §11 / OC-1).

---

## The honest summary

**Nine items were actually yours (A).** Four of those — A1, A2, A3, A5 — were the
same underlying question in different clothes: *what does this project do about
content it ships but cannot cite to an open source?*

**You answered it on 2026-07-30: delete it.** That closed **A1** outright
(`genuine-non-open-content` 89 → 0), foreclosed option (b) of **A5**, and left
**A2** and **A3** as the residue — which are a different question, not the same
one. A1 was *we wrote this and shipped it*; A2/A3 are *this is real open content
wearing the wrong citation*. Deleting was right for the first and would be wrong
for the second: the content is legitimately OGL/CC-BY, so the honest remedy is a
re-tag, and the decision left is whether to accept the ~68 entries a truthful tag
drops out of the catalogs or to replace them with same-edition equivalents.

**Seven were mine and I should have just decided them (B).** I will, unless you say
otherwise.

**Four are now executed** (2026-07-31): **B1** the largest-remainder damage split,
**B5** the warn-only graph-staleness check, plus **B4** and the `check:ci-parity`
precondition that unblocks **B2**. **B6** (the Phase-6 canvas acceptance) and
**B3** (toolchain sequencing) remain — B3 gated on the bundle budgets, which is
**A7**, which is yours.

One correction worth keeping, because it recurred three times in one session:
**a "checked and fine" claim is only as good as the question the check asked.**
§6.6 probed whether a field was PRESENT when the defect was its SHAPE; §6.4
checked contrast in light mode only and shipped a dark-mode regression; and the
dark gate built to catch that reaches a quarter of the files it was meant to
cover. Each time the code passed the measure applied and failed the measure that
mattered. Where a claim of "verified" appears in these documents, the useful
question is *verified against what*.
