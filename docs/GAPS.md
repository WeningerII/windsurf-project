# Completion Gaps — outstanding work, and the evidence that closed the rest

This is the tracking document for outstanding gaps and the GLOBAL DONE criteria.
`docs/README.md` holds the authority order: this file ranks below
`docs/MASTER_PLAN.md` (the planning authority) and above `docs/STATUS.md` (a
current-state summary). Findings and their evidence live here; the plan
summarises them.

A reader lands here asking two questions — *what is still open*, and *what is the
evidence*. The Status line on each section answers the first; the section body,
which cites `path:line` rather than asserting, answers the second.

## How to read this file

| Status | Meaning |
| --- | --- |
| **OPEN** | Live work. Something in the repo is still wrong, missing, or undecided. |
| **PARTLY CLOSED** | Part of the finding is closed with evidence; the residual is named inside the same section. |
| **CLOSED** / **DECIDED** / **STANDING** | No action remains. Kept deliberately — the evidence trail is the point of this document, and a closed finding is what stops the same investigation being run a third time. |

Four rules this file learned the hard way, and now obeys:

1. **Sections are never renumbered and never deleted.** The numbers are
   cross-referenced from `docs/MASTER_PLAN.md`, `docs/STATUS.md`,
   `docs/master-gap-ledger.source.ts`, `docs/srd-sources.md`,
   `docs/rfc/004-monster-product-surface.md`, `scripts/check-rules-provenance.mjs`
   (whose `gapsAnchor` field points at the `OC-` headings inside §11), and code
   comments. A new finding takes the next free number; a closed one keeps its old
   one. Re-check your number after any rebase — parallel branches have collided
   here repeatedly.
2. **This file does not own live counts.** Percentages and per-system tallies
   belong in `docs/generated/` and are *cited*, never restated. Prose that
   restates a live count is prose that is wrong within a week; two such numbers
   in this file had already contradicted each other by the time it was audited.
   Audit findings pinned to a committed artifact — `scripts/data/srd-fidelity-baseline.json`,
   `scripts/data/mam3e-equipment-manifest.json` — are evidence, not live metrics,
   and do belong here.
3. **Tallies are against 7 systems** (both 5e editions count separately) so
   edition ambiguity cannot hide debt. No system name is ever the subject of a
   deliverable; asymmetric progress is recorded as explicit per-system debt.
4. **Do not claim a guard you have not proven can fail.** Before writing that
   something is gated, break it on purpose and watch the gate catch it — then
   record the break. §15.1 is the worked example. Several "enforced" claims that
   once stood in this tree described mechanisms structurally incapable of going
   red.

Live numbers: `docs/generated/roadmap-metrics.md` (both denominators) and
`docs/generated/srd-coverage.md` (independent content coverage).

## Contents

**Open — live work:**

| § | Finding |
| --- | --- |
| [11](#11-provenance-over-inclusion-outside-srcdata-added-2026-07-25) | OC-1 awaits an owner decision; the gate's honest residual is unclosed |
| [19](#19-mm-3e-adversaries--the-source-search-and-why-nothing-was-encoded-added-2026-07-28) | The open-content M&M adversary source exists but this sandbox cannot reach it; options recorded, owner decides |
| [25](#25-six-parallel-lanes--what-running-them-concurrently-actually-proved-added-2026-07-31) | Lane code CLOSED; three coverage limits OPEN — typed damage covers single attacks only, the dark a11y gate reaches 4 of ~17 files, and 3.5e prices are laundered into a false `0 gp` |
| [20](#20-the-first-full-chain-green-run--what-twelve-never-executed-gates-actually-proved-added-2026-07-28) | Run itself CLOSED; the orphaned feat-automation copy is OPEN (the shared-formatter contract is now pinned — WORK_PLAN §6.6) |
| [21](#21-wall-clock-assertions-cannot-be-gates-under-parallel-workers-added-2026-07-28) | CLOSED — `gateBudget` re-instrumented from wall-clock to counted DOM mutations plus scale-invariance |

**Partly closed — evidence for what shipped, residual named inside:**

| § | Finding | Residual |
| --- | --- | --- |
| [1](#1-content-denominator-a--independent-srd-coverage) | Independent SRD coverage | unwired categories; 3.5e monster misses |
| [2](#2-compute-denominator-b--register-completeness--engine-wiring) | Register completeness + engine wiring | L8 typed damage; legality layer unreached by any UI |
| [3](#3-bestiaries--rfc-004) | Bestiaries / RFC 004 | M&M 3e adversary data — source search done, see §19 |
| [4](#4-global-done-criteria-still-outstanding) | GLOBAL DONE criteria | `Full` measures automation depth, not content completeness |
| [7](#7-rules-ir-parity-debt--per-system-accounting-added-2026-07-21) | Rules-IR parity debt | nothing outside tests consumes the legal-actions seam |
| [10](#10-ai-gateway-provider-agnosticism--what-is-proven-and-what-is-not-added-2026-07-25) | AI gateway provider-agnosticism | no live-API proof; no failover; no pricing |
| [14](#14-p5infra-gaps--inventory-what-was-closed-and-what-is-deliberately-not-built-added-2026-07-25) | `p5.infra-gaps` | 14.4 — Sentry release/env, server 5xx, durable rate-limit store |
| [15](#15-field-level-srd-fidelity--audit-result--the-gate-that-now-guards-it-added-2026-07-25) | Field-level SRD fidelity | **(b)** fixed 2026-07-28 for every gated scalar; **(c)** still an open-content exposure |
| [16](#16-lazy-per-system-engines--what-was-reclaimed-and-exactly-what-blocks-the-rest-added-2026-07-25) | Lazy per-system engines | CLOSED 2026-07-28 — reclaimed via the preload design, so the authorization question never had to be answered (16.5) |
| [18](#18-provenance-over-inclusion--the-audit-result-and-the-gate-that-now-bounds-it-added-2026-07-25) | Provenance over-inclusion — 925 classified + gated | Licensing class CLOSED (§17.3, 89 → 0); 68 wrong-edition records and 3 measurement defects remain |

**Closed, decided, or standing reference — kept for the evidence trail:**

| § | Finding | What closed it |
| --- | --- | --- |
| [5](#5-review-item--a-shipped-behavior-change-ratified-2026-07-20) | 5e-2024 exhaustion −2/level | human ratification 2026-07-20 |
| [6](#6-reconsider-artifact--decided-2026-07-21-executed-2026-07-27) | `docs/srd-manifest/` demotion | executed 2026-07-27; Denominator A is `docs/generated/srd-coverage.md` |
| [8](#8-w6-executable-activity-contract--close-by-rule-under-constraint-5-added-2026-07-24) | W6 executable-activity contract | close-by-rule: one consumer, not graduated |
| [9](#9-make-me-a-game-flow--what-it-composes-and-what-it-deliberately-does-not-added-2026-07-24) | Make-me-a-game flow scope | scope record; nothing stubbed |
| [12](#12-unresolved-a11y-contrast-finding-on-the-creation-surface-added-2026-07-25) | a11y contrast on the creation surface | un-quarantined 2026-07-28; it was a real AA failure (amber-600 at 3.18:1), fixed to amber-700 |
| [13](#13-srd-521-will-o-wisp--upstream-str-score-defect-added-2026-07-25) | Will-o'-Wisp STR-score defect | re-transcription; superseded by §15 |
| [17](#17-mm-3e-equipment--150-hand-written-entries-one-false-citation-added-2026-07-25) | M&M 3e equipment provenance | encoder + `check:mam-equipment` gate, merged |

**Verification pass, 2026-07-26.** Every section's status below was established
from code, not carried forward from the section's own prose or from any other
document. Corrections made in that pass are marked inline as
*Corrected 2026-07-26* with the `path:line` that disproved the old claim.

---

## 1. Content (Denominator A) — independent SRD coverage

**Status: PARTLY CLOSED.** All 7 systems are measured and the named provenance
defects are remediated. Open: the unwired categories and the 3.5e monster
misses below, plus the Denominator-A decision in §6.

**Update:** the blocker is resolved. The container's Node runtime fetches the
open-content SRD datasets from GitHub raw in full (the `WebFetch` *tool* truncates;
Node `fetch()` does not). Verified independent sources for all 7 systems are in
`docs/srd-sources.md`. `npm run srd:coverage` builds the genuine coverage report at
`docs/generated/srd-coverage.md` (independent SRD lists diffed against the loaders
by normalized name, each scoped to the policy's `allowedSources`) — real coverage,
unlike the loader-derived `docs/srd-manifest/`. **Since 2026-07-27 that file is
Denominator A outright** (§6), and the metrics report republishes its per-system
rollup.

**Measured — `docs/generated/srd-coverage.md` is authoritative for live counts (do not restate them here; they drift):**
- The earlier deep gaps (PF2e spells "24%", PF1e "21%", 5e-2014 "67%") were a stale
  snapshot. Every wired spell catalog now reads complete or one entry short, and
  the 5e monster and equipment rows are at or near complete. **Corrected
  2026-07-26:** the per-catalog percentages that stood here restated live
  measurements and had already drifted apart from each other (this section and the
  "Still to do" block below disagreed about the same 3.5e spell row). Read
  `docs/generated/srd-coverage.md`.
- **M&M 3e** (powers, advantages) and **Daggerheart** (domain cards, domains) read
  genuinely complete on their wired categories.
- CLOSED 2026-07-25: the three named single-entry gaps are all encoded and
  measured as covered — 5e-2014 **Net** (`0bf4a75`), PF1e **Skeletal Champion**
  (`4eb9beb`), 5e-2024 **Will-o'-Wisp** (`168e9b5`, re-transcribed from the
  5.2.1 source; see §13 for the upstream STR-score defect and the
  wrong-edition provenance defect that re-transcription fixed). PF1e Greater
  Teleport and 3.5e Greater Shadow Evocation were encoded earlier.
- The genuine residual is now the 3.5e monster missing list, itemized in
  `srd-coverage.md`. The container-like rows the first collapse pass missed
  ("Chromatic Dragons", "Celestial Creature", then Ooze/Planetouched/Snake/
  Sprite/Swarm and the stat-block-less Half-Celestial/Half-Fiend templates)
  are now dropped; the confirmed individuals **Lich, Ghost, Salamander,
  Hydra** remain counted as genuine misses, as do Vampire/Skeleton/Zombie/
  Half-Dragon/Fungus/Horse (their sections do carry a stat block).
- **Monster denominator shape-mismatch [CLOSED 2026-07-25]:**
  the 3.5e and PF1e monster denominators previously counted taxonomic CONTAINER
  entries — the SRD 3.5 category headers (Angel/Dragon/Elemental/…) and the PF1e
  bestiary dragon/elemental PARENT records — as if they were individual stat
  blocks, understating coverage. Pure, unit-tested helpers in
  `src/scripts/srdCoverageShape.ts` (`collapse35eMonsterHeadings`,
  `collapsePf1eContainerRecords`) now drop those containers (and fold 3.5e age/
  size variant rows to their archetype) so both denominators count individual
  stat blocks; the 14 PF1e parents collapse while Skeletal Champion stays a
  genuine miss. The counting LOGIC is fixed and tested. CLOSED 2026-07-25: the
  residual container rows are now dropped too (Ooze, Planetouched, Snake,
  Sprite, Swarm as taxonomic containers whose `## ` section is prose-only with
  every stat block under a separately-named `### ` child; Half-Celestial and
  Half-Fiend as template headers carrying no stat table at all). Live
  percentages are in `docs/generated/srd-coverage.md` — do not restate them
  here.
- **M&M equipment coverage target [CLOSED — see §17]:** the `mam3e`/`equipment`
  `CoverageTarget` (frnprt EQUIPMENT vs the loader) was wired and run on
  2026-07-21, and the shortfall it exposed was then remediated by the Hero SRD
  equipment encoder. **§17 supersedes what stood here** — it carries the better
  evidence (the encoder, the offline `check:mam-equipment` gate, the
  item-by-item provenance record, and the finding that name-only coverage had
  scored unfaithful entries as covered). The interim ratio recorded here is
  removed rather than restated; it drifted the moment §17 landed.
- **Provenance — feats/backgrounds [REMEDIATED]:** the loaders shipped PHB feats
  and backgrounds mislabeled with an SRD source tag (SRD 5.1 has only Acolyte +
  Grappler; SRD 5.2 has 4 backgrounds + 17 feats). The non-SRD entries were
  deleted (see the over-inclusion table in `docs/generated/srd-coverage.md`, now
  0 genuine suspects for these categories). The cosmetic residue (noted
  2026-07-21) is now FIXED: the 7 qualifier-named 2024 feat variants ("Magic
  Initiate (Cleric)", "Fighting Style: …") no longer print as nominal
  over-inclusion rows — the reverse diff now normalizes the loader side with the
  SAME `loaderNormVariants` the forward pass uses (`overInclusionSuspects` in
  `src/scripts/srdCoverageShape.ts`, unit-tested), clearing prefix/parenthetical
  variants against the SRD base while still flagging genuinely non-SRD entries.
  The reverse-diff audit (loader entries absent from the independent SRD) remains
  the standing guard against re-introduction.
- **Provenance — 5e-2024 species [REMEDIATED]:** Half-Elf and Half-Orc (SRD 5.1
  species dropped from SRD 5.2) were removed from the SRD-5.2-only 2024 loader;
  srd-coverage now reports 0 over-inclusion for 2024 species.
- **Provenance — 5e-2014 spells [REMEDIATED]:** of the 30 reverse-diff hits, 8
  were Product-Identity names renamed to their SRD names ("Tasha's Hideous
  Laughter" → "Hideous Laughter", …, "Mordenkainen's Sword" → "Arcane Sword") and
  22 genuine non-SRD entries were deleted (PHB spells like Hex/Witch Bolt and
  homebrew like Glass Staff/Airwalk). 2014 spells now read complete with zero
  over-inclusion (`docs/generated/srd-coverage.md`).
- **Provenance — 5e-2024 spells [REMEDIATED]:** the denominator was sourced — SRD
  5.2 genuinely differs from 5.1 (**339 vs 319** spells; 5.2 adds Chromatic Orb,
  Divine Smite, Hex, Ray of Sickness, Power Word Heal, etc.), parsed from
  `downfallx/dnd-5e-srd-markdown` (CC-BY) and wired as the 2024 spell denominator.
  Against it: 7 Product-Identity names renamed to their SRD names and 26 genuine
  non-SRD-5.2 entries deleted (PHB spells like Witch Bolt/Crown of Madness/
  Feeblemind + homebrew like Glass Staff). The Ranger's non-SRD always-prepared
  grants (Conjure Barrage/Volley) were removed accordingly. Every remaining 2024
  spell is in-SRD, with zero over-inclusion; the shipped-vs-denominator ratio is
  in `docs/generated/srd-coverage.md`.
- RESOLVED (2026-07-21): the partial (~3-entry) 5e-database 2024 monsters JSON
  was validated and rejected by the coverage script itself. The 2024 monster
  denominator is the SRD 5.2.1 markdown (`docs/srd-sources.md`), against which
  the sole miss was the Will-o'-Wisp — since closed (§13).

**Still to do (sources in `docs/srd-sources.md`):**
- **D&D 3.5e sources are wired [DONE]:** the psionics/epic-mixed `Rughalt/D35E`
  packs were rejected in favor of the clean core-only `olimot/srd-v3.5-md`
  Markdown chapters, giving a near-complete spell row and a wired monster row
  (`docs/generated/srd-coverage.md`). The monster denominator's category-heading
  shape-mismatch is fixed in code (`collapse35eMonsterHeadings`). **Still open:**
  the remaining 3.5e categories (classes/feats/equipment) are unwired pending
  core-only sources.
- Wire the remaining categories (3.5e classes/feats/equipment; PF2e non-spell/
  non-monster; PF1e non-spell besides monsters/equipment/magic items; M&M
  skills/conditions; Daggerheart classes/ancestries/communities/weapons/armor;
  M&M/Daggerheart adversaries). Corrected 2026-07-21: monsters for all five
  d20-family systems and M&M equipment are already wired and measured — the
  earlier "all monsters" phrasing here was stale.
- Remediate under-covered categories (encode missing SRD entries — e.g. PF2e/PF1e/5e
  spells) and the provenance over-inclusion (re-source or re-scope mislabeled entries).
- ~~Fold genuine coverage into the headline metric in place of the loader-mirror
  `docs/srd-manifest/` numbers.~~ **DONE 2026-07-27** — decided 2026-07-21,
  executed and recorded in §6. `docs/generated/roadmap-metrics.md` now publishes
  the reverse diff's per-system rollup as Denominator A.

## 2. Compute (Denominator B) — register completeness + engine wiring

**Status: PARTLY CLOSED.** The registers are gated and mutation-proven, and
several wiring items below closed. Open: L8 typed damage through the scene
schema, the remaining L6/L9/L10 per-system rows, and the build-legality layer's
missing user-facing surface.

The registers are Tier-A-verified by `check:compute-register` (test-linked + passing) but per `roadmap-metrics.md` are not uniformly 100% complete, and two structural gaps sit behind the headline:

**Rebalancing pass (done):** the registers were levelled so no system is
neglected — each now holds two-to-three dozen verified quantities across L1–L10
(previously 13–28, with Daggerheart the outlier at 13; exact per-system counts in
`docs/generated/roadmap-metrics.md`). All additions were genuine, SRD-cited RAW
math, not padding (see `docs/STATUS.md` for the list). This closed several items
below; the remainder is the honest residual.

- **Registers are a curated subset of the goal's full L1–L10 spec, not the
  exhaustive enumeration.** A complete register would be much larger and partly
  `missing`. Notably absent / uncounted today:
  - L3: **Done (engine-wired + mutation-proven).** Full damage assembly with
    riders — Sneak Attack / Rage / Divine Smite / GWM / Sharpshooter / Extra
    Attack, 5e Versatile weapon dice and two-weapon off-hand attacks, 3.5e/PF1e
    iteratives + crit confirmation, Daggerheart critical/Spellcast damage, and
    M&M attack/Affliction/Damage DCs — all assemble through the seeded dice
    substrate + resolver/combatant. Follow-on (Denominator-A content) **DONE
    for 5e (2026-07-14):** the 5e `toEquippedItem` now converts the catalog
    `Weapon.damage` DiceRoll into the numeric `{count, die}` shape the combatant
    reads, so equipping a weapon gives a real saved character its weapon dice in
    scene combat (previously only engine-built inputs carried it). The versatile
    two-handed die is now populated too (**done 2026-07-21**): `toEquippedItem`
    reads the catalog `Weapon.versatileDamage` into `EquippedItem.weaponVersatileDie`
    and carries the catalog `properties` into `weaponProperties`, so an equipped
    versatile weapon rolls its larger die in two hands in scene combat (the
    combatant already consumed both fields). The equivalent populate for the
    d20-legacy and PF2e equip flows **also shipped 2026-07-21**: each now has an
    `equipWeapon` handler (`useD20LegacyMutationHandlers` / `usePf2eMutationHandlers`)
    that maps a catalog weapon onto a `mainHand` entry carrying `weaponDamage`,
    parsed from that system's OWN shape via the shared `parseWeaponDamageDice`
    (3.5e's notation-string `damage`, PF1e/PF2e's DiceRoll) — not forced through
    the 5e DiceRoll catalog.
    - **Edition-conflation fix, and the honest residual it leaves (2026-07-24).**
      `src/rules/conditions/dnd5eRiders.ts` is shared by both 5e editions but
      hardcoded `systemId = 'dnd-5e-2014'`, so a **D&D 5e 2024 character was
      silently given the SRD 5.1 Great Weapon Master / Sharpshooter -5 attack /
      +10 damage trade** — another edition's math, in scene combat and on the
      sheet's toggle chips. The compiler now takes the edition as an input
      (mirroring `d20LegacyRiders`, which already keeps 3.5e and PF1e apart),
      `D20_PROFILES` passes each 5e edition its own profile, and effect ids and
      `systemId` provenance now carry the character's real edition.
      **What 2024 does NOT get, and why:** SRD 5.2's feat chapter is 17 feats —
      Ability Score Improvement, Grappler, the origin feats, four Fighting Style
      feats and seven epic boons (the encoded corpus under
      `src/data/dnd/5e-2024/feats/`, whose provenance comments state that the
      remainder is non-open Player's Handbook content). **Neither Great Weapon
      Master nor Sharpshooter is open content in SRD 5.2**, so there is no cited
      RAW for this repo to compile, and no 2024 rider was invented to replace
      the removed one: a 2024 character simply is not offered the toggle and
      compiles no effect for it. Removing another edition's math is the
      correctness win; encoding the 2024 redesign would require content this
      repo cannot legally carry. Both sides are pinned by
      `src/__tests__/rules/characterCombatant.test.ts :: 5e rider edition
      routing: 2014 keeps -5/+10, 2024 refuses it`, and the 2014 register rows
      `dnd5e2014.L3.gwm-tradeoff` / `.sharpshooter-tradeoff` now cite it and
      carry the edition scope in their notes. **No `dnd5e2024.L3.*-tradeoff`
      register row exists or should be added** — the quantity is not in SRD 5.2's
      scope at all, so it is not a 2024 denominator item.
  - L5: **Partial.** Prepared-spell limits are wired — the 5e spells tab shows
    each prepared caster's RAW limit (`getDnd5ePreparedCasterSummaries` through
    the sheet controller). **Known-spell-count enforcement DONE (2026-07-24):**
    the 5e validator (`validateKnownSpellCount` in
    `src/systems/dnd5e/shared/validation.ts`) warns-not-blocks when a known
    caster's stored known list exceeds the class table's `spellsKnown[level]`
    (+ cantrips) via the cited `dnd5eKnownSpellLimit`/`Overage` helpers
    (`dnd5eKnownSpells.ts`); register rows `dnd5e{2014,2024}.L5.known-spell-limit`
    verified + mutation-proven. Still absent: mechanical upcasting (only
    descriptive at-higher-levels text renders — **skipped this wave:** the 5e
    spell catalog stores `atHigherLevels` as prose, not a structured
    dice-per-slot scaling field, so a mechanical upcast helper would have no
    RAW-cited data to read; needs a Denominator-A content encode first), and
    full PF2e heightening (the auto-heighten rank helper exists but per-spell
    mechanical heightening is **skipped this wave:** PF2e spell data carries
    heightening as `heightened` prose entries, not a structured per-rank
    damage/effect delta the engine can apply — same content-encode blocker).
    (3.5e/PF1e bonus-spells-by-ability done.)
  - L6: **speed with armor/Str penalty DONE for 5e (2026-07-24):**
    `dnd5eSpeedWithArmor` (SRD heavy-armor Str requirement → −10 ft) is
    engine-computed via the `dnd5e.L5/L6.speed-armored` derived quantity
    (`EquippedItem.strengthRequirement` added); register rows
    `dnd5e{2014,2024}.L6.speed-armored` verified + mutation-proven. 3.5e/PF1e
    armor speed reduction (30→20 for medium/heavy) and PF2e bulk/armor speed
    remain open (follow-on: those tables live in armor content, not yet on the
    equip flow). **Done earlier:** 3.5e/PF1e carrying capacity, load categories,
    encumbrance penalties, lift/drag limits; PF2e Bulk limits.
  - L7: **ASI/feat cadence validator DONE for 5e (2026-07-24):**
    `dnd5eAsiSlotsGranted` + a `validateDnd5eBuild` check flag feats exceeding
    the ASI slots the class levels grant (SRD class tables 4/8/12/16/19 +
    Fighter 6/14 + Rogue 10); register rows `dnd5e{2014,2024}.L7.asi-feat-cadence`
    verified + mutation-proven. **Done earlier:** 3.5e XP-to-level table; M&M
    starting power points + hero points; Daggerheart short-rest recovery,
    Experience bonus, starting Hope; PF2e/3.5e HP/death state.
  - L8: resist/vuln/immune transforms outside Daggerheart still open
    (**skipped this wave — honest reason:** applying damage-type
    resistance/vulnerability/immunity in 5e/d20/PF2e requires plumbing target
    defense data onto scene tokens AND carrying the per-type damage breakdown
    through the `apply-damage` scene event (today it collapses to a single
    untyped amount at `token.damaged` in `src/scene/runtime.ts`). That is a
    multi-file scene-schema + validation + persistence change, not a clean
    single-commit engine wiring; a pure transform helper with no genuine
    consumer would be helper-only, so it was deferred rather than faked).
    **Done:** PF2e dying/wounded/recovery track; 3.5e disabled/dying/dead track
    + massive damage; Daggerheart resistance/immunity, Armor-Slot reduction,
    massive-damage option, and death moves.
  - L9: **multiclass ability-prerequisite validator DONE for 5e (2026-07-24):**
    `validateDnd5eBuild` flags a 2+-class build missing any class's 13-minimum
    ability prerequisite (SRD Multiclassing — Prerequisites); register rows
    `dnd5e{2014,2024}.L9.multiclass-prereq` verified + mutation-proven. Still
    open: point-buy ability arrays (not in the 5e/3.5e SRDs — DMG/PHB variant),
    3.5e/PF1e feat-prereq gating, and multiclass slot/save/BAB/prof stacking as
    validators (M&M PL caps + point-buy costs exist; M&M degrees of success
    covered).
  - L10: **wealth-by-level DONE for PF1e (2026-07-24):** the CRB (OGC)
    "Character Wealth by Level" table ships as `pf1eWealthByLevel` and the
    `pf1e.L10.wealth-by-level` derived quantity (surfaced as a d20-legacy
    "Wealth by Level" card); register row verified + mutation-proven. 3.5e is
    **not covered — SRD-blocked:** its wealth-by-level table is DMG content,
    absent from the 3.5e SRD, so encoding it would violate "cited, never
    invented". **Done (corrected 2026-07-21):** D&D 3.5e
    Encounter-Level budgeting shipped on a derived-EL model
    (`dnd35eEncounterBudget` in `src/scene/encounterDraft.ts`; the old
    "honestly reports `unsupported-system`" note went stale — though 3.5e
    monster `experiencePoints` remain uniformly 0, so any future XP-award
    feature still lacks data); plus 5e (SRD 5.2.1), PF1e (CRB target-CR), and
    PF2e (party-relative) encounter budgets, all behind one shared budget/cost
    dispatch and gated by `validateEncounterSpec` (`src/scene/encounterSpec.ts`);
    PF2e creature XP by level difference; M&M equipment points and measurements
    doubling.
- **Helper-vs-engine wiring is mixed** (the earlier blanket "tested helpers,
  not engine-wired" claim went half stale as wiring landed). Verified states:
  - **Now wired:** 5e spell save DC + spell attack bonus — computed per casting
    class in `Dnd5eEngineBase.prepareData` and, as of 2026-07-14, **displayed**
    on the 5e spells tab: the sheet controller derives them for every casting
    class (prepared and known) via `getDnd5eSpellcastingClassSummaries`, using
    the same cited `dnd5eSpellSaveDC`/`dnd5eSpellAttackBonus` helpers the engine
    uses, so display and engine share one formula source. Monk/Barbarian
    Unarmored Defense, applied in the same engine's `computeBaseArmorClass`.
    3.5e/PF1e iterative attacks, displayed by the d20-legacy sheet and applied
    per attack via the tactical executor's iterative penalty steps. The
    d20-legacy sheet controller now consumes the register-linked
    `iterativeAttackBonuses` in `src/utils/derivedCombatMath.ts` directly (the
    sheet's own `getIterativeAttackBonuses` duplicate was deleted 2026-07-21),
    so the canonical helper is no longer test-only; the tactical executor's
    profile still carries its own penalty-step encoding — two encodings of one
    formula remain, a smaller dedupe hygiene item. PF2e Bulk limits: `Pf2eInventoryTab` computes total Bulk via
    `getPf2eBulkState`, while the register-linked `pf2eBulkLimits` now ALSO
    ships through derived-quantity cards (no longer test-only) — so the
    duplication persists and both formula sources currently render to users. Also wired earlier: 3.5e skill synergy, max-rank
    enforcement, and the full check penalty — synergy applies in both the
    skills tab and `rollCheck`; the skills tab shows each skill's RAW rank cap
    and flags over-cap values; the check penalty applies to physical skills
    from both carried weight (encumbrance) and the equipped armor/shield
    armor-check penalty, sourced from the catalog-backed equip flow
    (conditional and Knowledge-subtype synergies stay manual). Cleric domain,
    wizard specialist, and Dragon Disciple bonus spell slots auto-resolve into
    the spells-per-day totals.
  - **Still helper-only** (RAW formula proven by test, but nothing in
    `prepareData` or a sheet computes or displays it): M&M measurements
    (parameterized by a per-measure rank-0 anchor + rank, so it is
    register/test-pinned only — deliberately not a standing sheet card).
    **Corrected 2026-07-26 — the two PF2e entries that stood here were both
    stale, and each named a blocker that no longer exists:**
    - *PF2e multiple-attack penalty* is engine-wired. The PF2e combat profile
      does declare a MAP step —
      `iterativePenaltyStep: Math.abs(pf2eMultipleAttackPenalty(2, false))` at
      `src/rules/combatants/systemProfiles.ts:166` — which the tactical executor
      applies as step × attackIndex across the three-action economy. The
      *agile* reduced MAP is deliberately not automated (no equipped weapon
      carries an `agile` trait yet), and that boundary is annotated at the site.
    - *PF2e striking rune dice* is engine-wired. `EquippedItem.strikingRune`
      exists (`src/types/core/character.ts:278`) and
      `src/rules/combatants/characterCombatant.ts:249` consumes it through
      `pf2eStrikingDice`, gated by the profile's `supportsStrikingRunes`.
      Follow-on hygiene, in code not in this file: the field's own doc comment
      at `src/types/core/character.ts:275` still reads "no engine consumes it
      yet", which the call site 29 lines away disproves.

    **Wired since the last update (removed from this list):** concentration DC in all
    three flavors (5e/3.5e/PF1e — each now surfaces as a derived-quantity card
    through its system's `*_DERIVED_QUANTITIES`, using the same cited helper the
    register anchors; 5e's card renders on both the 2014 and 2024 sheets);
    passive Perception (5e computes AND displays it through the derivation
    layer; no other system declares one yet) and PF2e auto-heighten rank
    (computed and displayed as a derived card; per-spell mechanical
    heightening still absent). **Computed-but-inert (new category):** 5e
    cantrip scaling and PF2e Class DC are engine-computed and
    register-anchored but deliberately display-less, and nothing in scene
    combat consumes them — cantrip damage in play still doesn't scale.
- **Stricter spec criteria — re-audited 2026-07-26 against code. Three of the
  four claims that stood here had gone stale; only the last is still open.**
  - *Typed-bonus stacking* — tests EXIST, and the dodge case is representable
    after all. `BonusType` does carry a `dodge` member
    (`src/types/core/common.ts:78`), the resolver implements the
    dodge-stacks-while-others-don't exception explicitly
    (`src/rules/resolver/resolve.ts:163-171`), and the canonical case is pinned
    by `src/__tests__/rules/resolver.test.ts:156`. The "type-vocabulary gap" is
    closed; the earlier note recorded a vocabulary the type no longer lacks.
  - *Cross-product fixtures* — the Monk+shield AC fixture EXISTS
    (`dnd5e-engine.test.ts`), and so does PF2e striking+enfeebled, which the
    earlier text called blocked: `src/__tests__/derivedCombatMath.test.ts:102`
    asserts a greater-striking Strike under enfeebled 2 rolls three dice at −2
    Str. Its stated blocker — a missing rune field — no longer exists (above).
  - *Build-legality validators* EXIST for D&D 5e (both editions), D&D 3.5e,
    PF1e and PF2e under `src/rules/legality/`, with accept-legal AND
    reject-illegal tests, register-linked L9 rows, and mutation anchors gated by
    `check:compute-register`.
  - **The genuine, still-open gap, restated precisely.** The old wording — "no
    engine, sheet, or registry imports `validate*Build`" — is factually wrong:
    three systems' validators do import and surface them
    (`src/systems/pf2e/validation.ts:8`, `src/systems/pf1e/validation.ts:3`,
    `src/systems/dnd35e/validation.ts:42`), and those validators are reachable
    through the registry's lazy seam and `systemRegistry.validateDocument`.
    What is true is narrower and still worth tracking: **(a)** `validateDnd5eBuild`
    (`src/rules/legality/dnd5e.ts:78`) has no non-test importer, so 5e's build
    legality is the one that really is helper-only; and **(b)** the only caller
    of `systemRegistry.validateDocument` outside tests is the AI draft path
    (`src/ai/makeMeAGameFlow.ts:175`), which has no UI (§9), so **no
    user-facing import or creation surface invokes build legality on any
    system.** Wiring those surfaces is the open work.

## 3. Bestiaries / RFC 004

**Status: PARTLY CLOSED.** The RFC executed and has since been formally
accepted. One residual: M&M 3e adversary data.

No longer proposal-only: the plan in `docs/rfc/004-monster-product-surface.md`
was executed for the d20 systems. D&D 3.5e (core SRD monsters), PF1e
(Bestiary 1), and PF2e monster data shipped 2026-06-12, loader-backed behind the
existing `loadMonstersForSystem` contract (`src/utils/dataLoader.ts`) and
product-reachable through the scene encounter flow
(`src/components/scene/useSceneEncounter.ts`). Per-system monster coverage lives
in `docs/generated/roadmap-metrics.md` and `docs/generated/srd-coverage.md`, not
here. **The residual, still open:** M&M 3e adversary (reference) data — confirmed
2026-07-26, `src/data/mutants-and-masterminds/3e/` has no adversary or monster
directory, and `src/utils/dataLoader.ts` exposes no M&M creature loader. **§19
(added 2026-07-28) is the search for a source to close this from, and its
result** — no open-content M&M 3e adversary catalog exists that this repo's
provenance rules can accept, so the residual is now blocked on an owner decision
rather than on effort.
Daggerheart, by contrast, ships loader-backed SRD adversaries
(`loadDaggerheartAdversariesForSystem`, `src/utils/dataLoader.ts:807`), fieldable
as monster-kind scene tokens since 2026-06-12 — the earlier claim here that
Daggerheart adversary data was missing was WRONG, corrected 2026-07-21.
3.5e Encounter-Level budgeting no longer blocks on XP data — it shipped on a
derived-EL model (§2 L10) — though 3.5e monster `experiencePoints` remain
uniformly 0 for any future XP-award feature.

**Acceptance, updated 2026-07-26.** This section used to close on "RFC 004 was
executed without formal acceptance". It was retroactively accepted on
2026-07-21; `docs/rfc/004-monster-product-surface.md:3-11` now reads
*Status: Accepted (formalized 2026-07-21)* and preserves the executed-first
history in its own status block. Nothing further is owed on acceptance.

## 4. GLOBAL DONE criteria still outstanding

**Status: PARTLY CLOSED.** The support-level and documentation criteria are met;
the *claim they were taken to license* is not, and that is the open part.

- `supportLevel` is `'full'` for **all seven systems** — verified 2026-07-26,
  one `supportLevel: 'full'` per `src/systems/*/definition.ts`. D&D 3.5e and PF1e
  auto-resolve their cleric domain, wizard specialist, and Dragon Disciple bonus
  spell slots into the spells-per-day totals (counts are deterministic from the
  build). Daggerheart auto-resolves its deterministic passive automation
  (evasion, armor, thresholds, spellcast, traits).
- **OPEN — `Full` measures automation depth, not content completeness
  (corrected 2026-07-26).** This section used to assert that each system's
  residual manual surface *is* an enumerated accepted boundary in
  `docs/srd-manifest/_exclusions.ts` — d20 Vancian prepared-slot assignment +
  spontaneous conversion, Daggerheart triggered/narrative card resolution, M&M
  freeform descriptors — and therefore "never unfinished automation". Those
  boundaries are real, but the registry does not enumerate every residual gap:
  measured content shortfalls exist that are neither automated nor recorded
  there. So the rule ("a system reads `Full` when its only residual gaps live in
  that registry") is right while the conclusion has outrun it. Restoring the
  invariant means closing those gaps or enumerating them, with reasons, in
  `_exclusions.ts`. Live shortfalls: `docs/generated/srd-coverage.md`; tracked as
  per-system debt in §1, and — for content that is *named* correctly but
  *transcribed* from the wrong source — in §15.
- **PARTLY CLOSED 2026-07-27 — the PF2e half of the paragraph above.** PF2e used
  to carry **no** exclusion entry at all while declaring `Full` and naming a
  manual focus-spell surface in its own support row, so the rule did not hold for
  it on automation depth either. Its boundaries are now enumerated in
  `docs/srd-manifest/_exclusions.ts` with code citations: focus-spell list and
  effects (`src/systems/pf2e/validation.ts` deliberately does not check
  `spellcasting.focusSpells` against the catalog and raises
  `pf2e-focus-spells-manual`; the sheet badges the section Manual), prepared-slot
  assignment and cantrip selection (slot *counts* are register-verified as
  `pf2e.L5.spell-slots`; the daily choice is not), and rank-10 slots granted by
  10th-rank class features rather than the class progression table (hence
  `CLASS_PROGRESSION_RANKS` stopping at 9). Every system that ships a content
  denominator now has at least one entry, gated by
  `src/__tests__/manualExclusionRegistry.test.ts`. **Deliberately left out of the
  registry**, because they are unfinished automation rather than boundaries: the
  PF2e agile multiple-attack penalty (−4/−8, blocked on weapon-trait data) and
  PF2e weapon specialization (+2/+3/+4, formula-only pending wiring), both noted
  on `docs/compute-register/pf2e.ts`. Still open for PF2e: the content-fidelity
  debt in §15/§18.5.1, which no exclusion entry may absorb.
- MASTER_PLAN.md now mirrors the two-denominator completion goal and adopts
  this file as the completion-tracking doc (2026-07-14). README.md cites both
  denominators under Quality Metrics ("Completion methodology", 2026-07-17),
  and no doc claims RAW-coverage-complete.
- The full `npm run verify` gate runs in CI on every main merge — including
  `build`, `check:bundle-size`, coverage thresholds, and Playwright `test:e2e`
  on both chromium and firefox. No "latest green" commit is named here — a SHA
  pinned in prose rots at every merge, and the one that stood here until
  2026-07-26 had 64 merges pass it; the workflow's run history on `main` is the
  record. Not every historical main-merge run was green (e.g. the PR #30
  merge run was cancelled and needed follow-up e2e fixes). The earlier caveat
  that this container cannot run e2e is stale as a gate concern; CI is the
  authority for the full gate.

## 5. Review item — a shipped behavior change [RATIFIED 2026-07-20]

**Status: CLOSED.** Ratified by the repo owner; re-verified in code 2026-07-26 —
`getExhaustionD20Penalty` returns `-2 * exhaustion`
(`src/systems/dnd5e-2024/engine.ts:48-51`). No action remains.

5e-2024 exhaustion was changed from −1/level to **−2/level** (RAW per SRD 5.2 and
the goal text) in `src/systems/dnd5e-2024/engine.ts`. It is the only shipped
game-rule behavior change (vs. test-only additions), so it required explicit human
sign-off. That sign-off landed: **ratified 2026-07-20** (commit `14727e7`,
gap-ledger entry `review.dnd5e-2024-exhaustion`, status `done`), confirmed against
SRD 5.2 RAW — "each level of Exhaustion reduces D20 Tests by 2 times your
Exhaustion level"; the −1/level figure matched only the One D&D playtest draft.
`Dnd5e2024Engine.getExhaustionD20Penalty` is settled and test-pinned. No open
action remains.

## 6. Reconsider artifact — DECIDED 2026-07-21, EXECUTED 2026-07-27

**Status: CLOSED.** The decision below was taken on 2026-07-21 and sat unexecuted
through two verification passes. It is now executed. The three checks that
established non-execution on 2026-07-26 all now go the other way:

- The per-system manifests are **no longer committed.** `git ls-files
  docs/srd-manifest/` returns the hand-authored `types.ts`, `_exclusions.ts` and
  a `README.md` warning label. The seven generated modules are gitignored and
  `index.ts` — which existed only to aggregate them for the metric — is deleted.
- They no longer do **denominator duty.** `src/scripts/generate-roadmap-metrics.ts`
  imports neither `SRD_MANIFESTS` nor `ManifestCategory`; it keeps
  `MANUAL_EXCLUSIONS` only, which is hand-authored and was never part of the
  circularity. `categoryProgress` — the helper that returned
  `{denominator, numerator}` per category — is deleted from `types.ts`.
- On-demand generation **has a vehicle**: `npm run srd:manifests`.

**What replaced it.** `docs/generated/srd-coverage.md` is Denominator A. The
metrics report publishes a per-system rollup of it under **Content Coverage
(Denominator A — independent SRD reverse diff)**, read offline from a new
`docs/generated/srd-coverage.json` sidecar written by the same networked
`npm run srd:coverage` run — so `roadmap-metrics.md` can be regenerated inside
`check:generated-docs` without the network, and the two reports cannot disagree.
When the sidecar is absent the section says so and publishes nothing, rather than
falling back to a substitute denominator.

**Published numbers moved, which is the point.** The retired table read 100% on
all 44 of its rows. The replacement, measured against external indexes on the
same tree, reads: D&D 5e (2014) 100%, D&D 5e (2024) 100%, D&D 3.5e 92.8%,
Pathfinder 1e 100%, Pathfinder 2e 48.6%, M&M 3e 100%, Daggerheart 99.5%. No
content changed — only the denominator did. Per-category figures and the named
missing entries are in `docs/generated/srd-coverage.md` and are not restated
here; they drift.

**Why the old form could not work** (kept, because the failure mode is reusable):
the manifests are generated *from* the loaders, so manifest ids served as both
numerator and denominator. Any drift shrank both sides together and the ratio
still read 100% — which is how one system's manifest came to list a monster and
equipment count roughly a tenth of what its loader ships while printing green.
Unregenerated since ~2026-06-17. (An entry total previously cited here as "4,053"
matched nothing committed and was corrected 2026-07-21.) **The lesson is not
"regenerate more often."** A denominator the product can move is not a
denominator; the fix had to come from outside the repo.

**Decision (user, 2026-07-21), as executed:** `docs/srd-manifest/` moves to
**on-demand generation** (no longer committed) and is **demoted from denominator
duty** — `docs/generated/srd-coverage.md` becomes the **sole content denominator**
(Denominator A). **Do not "fix" the drift by gating the manifests** — that would
entrench a retired mechanism. That instruction outlives the demotion: it now
lives in `docs/srd-manifest/README.md`, where the next person to notice the
staleness will find it.

The `ManifestEntryStatus` of `original` added by §17 needed no re-homing: it is a
provenance distinction, and provenance is exactly what the manifests were kept
for. The open-content/original split that §17 relies on is published
independently in the metrics report's Content Integrity table, which was not
manifest-derived.

## 7. Rules-IR parity debt — per-system accounting (added 2026-07-21)

**Status: PARTLY CLOSED.** Four of the five rows are complete; one is an
accepted boundary. **The table below was re-verified against code on 2026-07-26
and two rows were corrected — they had gone stale in the direction that
overstates debt.** The single genuine residual: nothing outside tests consumes
the legal-actions seam.

The RFC 003 work, counted against all seven systems (both 5e editions count
separately) so edition ambiguity cannot hide debt.

| Parity debt | Done | Owed | State |
| --- | --- | --- | --- |
| Ledger re-backed on resolver | 7 | 0 | **COMPLETE (corrected 2026-07-26).** Five builders cover the seven systems, each projecting resolver output through `toContributionLedger`: `src/systems/dnd5e/shared/contributionLedger.ts` (both 5e editions), `src/systems/d20-legacy/contributionLedger.ts` (3.5e + PF1e), `src/systems/pf2e/contributionLedger.ts:28`, `src/systems/mam3e/contributionLedger.ts:47`, `src/systems/daggerheart/contributionLedger.ts:82`. The old row read `4 | 3` and named PF2e as having *no builder*; it has one. Two value shapes stay explicit rather than faked through the IR, annotated at their sites — list-valued proficiency rows and an object-valued unarmored-defense override, neither of which the published `EffectValue` can carry **Consumption added 2026-07-27:** this row, like the plan's W4, counted BUILDERS. Nothing rendered any ledger until 2026-07-27 — the only callers were test assertions — so COMPLETE described math that existed rather than provenance a user could see. The 5e Armor Class card is now the first consumer (`src/components/sheet/ContributionBreakdown.tsx`, degrading to the plain number when no ledger explains the value); the other six builders remain unrendered. Read this row as **7 of 7 built, 1 of 7 rendered**. |
| Condition effects through the resolver fold | 7 | 0 | **COMPLETE (corrected 2026-07-26).** The old row read `0 | 7` — "shipped and engine-consumed as helper reads; fold-through open everywhere". Every engine now feeds its own catalog collector into the shared fold: `src/systems/dnd5e/shared/engine.ts:346` (both editions), `src/systems/dnd35e/engine.ts:238`, `src/systems/pf1e/engine.ts:248`, `src/systems/pf2e/engine.ts:18-32`, `src/systems/mam3e/engine.ts:320`, `src/systems/daggerheart/engine.ts:133`. Scene combat folds the same way via `collectSceneConditionEffects` (`src/rules/combat/sceneCombat.ts:141,353`), so conditions share the resolver's stacking and reach the ledgers as provenance |
| AI-seam validators | 7 | 0 | **COMPLETE.** All seven registered *and* lazily loaded — every `src/systems/*/definition.ts` supplies `loadValidator`, none the eager `validator:` field (verified 2026-07-26; the last two migrated in §16.2). Each derives checks from its own RAW/loaders and consumes its `src/rules/legality/` build validator as warnings where present |
| Legal-actions enumeration seam | 7 | 0 registered / **0 consumers** | **Registered by all seven** (`loadLegalActions` in every `src/systems/*/definition.ts`, cached by the registry, with a per-system test). Five provider modules serve them: `src/systems/{dnd5e/shared,d20-legacy,pf2e,mam3e,daggerheart}/legalActions.ts`. **Renamed 2026-07-26 from "Resolver legal-actions seam", which misdescribed it:** the seam is deliberately enumeration-only — descriptors name and cost an action but never resolve it (§8) — so it is *not* a resolver seam and must not be scheduled as one. **The open part:** nothing outside tests calls it |
| Additive equip routing | 5 | 2 — accepted boundary | Daggerheart, M&M 3e (non-additive derivation; revisit only if the IR gains override/derived operations for other reasons) |

Deliverable phrasing for this debt lives in the W-numbered workstream table in
`docs/MASTER_PLAN.md` (W2, W4, W5, W8), governed by the `All-seven-equal
phrasing` constraint there: system names may appear in status lines, never as
the subject of deliverable lines.

**Note for the plan owner (this file must not edit `MASTER_PLAN.md`).** The
plan's copy of this table already carries the corrected `7 | 0` for the first two
rows, but its **AI-seam validators** row still reads "lazy loading covers 5 of 7,
owed by D&D 5e 2014 and D&D 5e 2024". That is stale: both now supply
`loadValidator` (`src/systems/dnd5e/definition.ts:69`,
`src/systems/dnd5e-2024/definition.ts:68`), which §16.2 records as the change
that landed. The plan's surrounding RFC-003 phase prose repeats the same claim.

## 8. W6 executable-activity contract — CLOSE-BY-RULE under constraint 5 (added 2026-07-24)

**Status: CLOSED BY RULE.** Re-verified 2026-07-26: the consumer count is still
1. The only importers of `Dnd5eActivityDefinition` / `executeDnd5eActivity`
outside `src/systems/dnd5e/shared/activities.ts` are that module's own unit test
(`src/__tests__/dnd5eActivities.test.ts:3-4`); no shared extraction exists. The
disposition below stands unchanged, with its revisit condition.

**Disposition: NOT graduated. The W6 executable-activity contract stays a
system-local 5e pilot — one real consumer — because a genuine second and third
consumer of the *executable* shape do not exist without inventing automation the
codebase deliberately refuses to fake.** This is a valid close under the
anti-premature-abstraction rule (MASTER_PLAN: "at least three named consumers
before extraction"; the extracted contract "must be proven against a non-d20
system before it is called shared"). Verified against code, not carried forward
from the W6 status prose.

**What the contract is.** The executable-activity shape lives entirely in
`src/systems/dnd5e/shared/activities.ts` — `Dnd5eActivityDefinition`
(id/label/kind/source/eligibility/**costs**/**outputs**/inputs/manualBoundary)
plus `executeDnd5eActivity`, which *spends* a cost and *mutates* the document
(marks a spell slot used for Divine Smite). Its distinctive value over mere
enumeration is the **execution half**: document-mutating `outputs`.

**Real consumer count of the executable contract = 1 (5e), and it is not even
UI-wired.** Every type is `Dnd5e`-prefixed and 5e-local; there is no shared
extraction (a repo search for `Dnd5eActivityDefinition` / `executeDnd5eActivity`
/ `ExecutableActivity` returns only `activities.ts`). `buildDnd5eActivityDefinitions`
early-returns `[]` unless `systemId === 'dnd-5e-2014'`. The only importer is its
own unit test, `src/__tests__/dnd5eActivities.test.ts` — it is not consumed by
the 5e sheet controller/UI, nor by any other system.

**Correction to the record (consumer 2).** The W6 status named "Daggerheart
triggered/manual cards" as the next consumer. Those cards are real, but they do
**not** consume the executable contract. They live in the *separate* legal-actions
enumeration seam (`LegalActionDescriptor` in `src/registry/types.ts`, produced by
`src/systems/daggerheart/legalActions.ts`), where domain-card and Hope-feature
activations are deliberately `manualBoundary: true` with `costs: []` and no
execution ("Activation cost and effect are on the card, adjudicated at the
table"). That is the *opposite* of an executable-activity consumer: it is the
honest non-d20 finding that card/spell activation resists deterministic
execution and stays GM-adjudicated.

**No genuine third consumer without inventing scope.** PF2e, M&M 3e, and the
d20-legacy systems each have a real *activity surface*, but it is the enumeration
seam (`legalActions` providers), not the executable contract — PF2e spell casts
and M&M powers are honestly `manualBoundary: true`. Wiring any of them to
"execute" would fabricate automation the manualBoundary discipline exists to
forbid, which is precisely the premature abstraction constraint 5 blocks.

**Where the genuinely-shared "activity" abstraction actually lives (not W6).**
The cross-system "actionable card/activity/ability" representation that *has*
graduated is the **enumeration** seam `LegalActionDescriptor` (RFC-003 substrate,
`src/registry/types.ts`) — system-agnostic, costs in each system's own resource
vocabulary, `manualBoundary` honesty — with **five real provider implementations
across the seven systems**: 5e (`dnd5e/shared/legalActions.ts`, used by both
editions), Daggerheart, PF2e, M&M 3e, and d20-legacy (used by 3.5e and PF1e).
That seam is descriptor-only by design — "descriptors are data, not behavior:
the seam names and costs an action but never resolves it." The W6 *execution*
half (document-mutating outputs) is the part that lacks three consumers.

**Kept-as.** The W6 executable-activity pilot remains a 5e-local, single-consumer
module — legitimate as a pilot, not promoted to a shared abstraction. Revisit
graduation only if a second system grows a real, deterministic activity-execution
surface of its own (its own already-landed behavior, no faked automation, no
`src/systems/**` value-import into shared). Until then the shared shape the
codebase needs is already served by the enumeration seam above.

## 9. Make-me-a-game flow — what it composes and what it deliberately does NOT (added 2026-07-24)

**Status: STANDING REFERENCE (scope record).** Not a defect list — it exists so
nobody mistakes the composition seam for a larger surface. Re-verified
2026-07-26: no `dm-*` gateway task exists in `src/ai/**` or
`netlify/functions/**`, and `makeMeAGame` still has no non-test caller, so the
"no strategist" and "no UI" statements below both still hold. The two per-system
participation rows remain the open work, and are creation-plan and catalog work
in those systems, not AI work.

`makeMeAGame` (`src/ai/makeMeAGameFlow.ts`) joins the shipped drafting, creation,
and scene pieces into one seeded path: drafted party → drafted encounter →
scene with tokens placed and initiative rolled. It composes only capabilities
that genuinely exist today; the list below is what it does **not** include, so no
reader mistakes the join for a larger surface than it is. **Nothing here is
stubbed** — an absent capability is absent, not faked.

**Deliberately NOT included (no stub shipped for any of these):**

- **No LLM strategist / blackboard.** RFC 002 lists "AI strategy hints that feed
  local tactical executors"; RFC 007 specifies `dm-turn-intent`. Neither is
  built: there is no `dm-*` gateway task, no strategist contract, and no shared
  planning state. The flow therefore stops at a *ready* table — it does not play
  a turn. Per-turn decisions remain the deterministic tactical executor's
  (`src/rules/tactical/`), which is the RFC 002 out-of-scope rule ("no LLMs in
  per-move mechanical hot paths"), not a temporary shortfall.
- **No narration or narration critic in the flow.** The `scene-narration` task
  ships and works, but a fresh scene has no events to recap yet, so wiring it
  here would generate prose from nothing. There is no critic/grader surface at
  all; none was invented to fill the slot.
- **No AI map, terrain, or spawn-zone proposal.** `gridGeometryProposal.ts` is
  deterministic; the flow places the party at the grid origin row and lets the
  existing encounter builder place monsters. No `illustrate-scene` call is made.
- **No persistence and no UI.** The flow returns documents and a `SceneDocument`
  for a caller to review and save through the normal paths; it writes nothing to
  storage or sync, and no screen calls it yet. It is a composition seam with
  tests, not a shipped user-facing button.
- **No campaign scaffolding** (quests, factions, NPC rosters, session zero).

**Per-system participation — real reasons, never a silent 5e fallback:**

| Step | Participates | Does not, and why |
| --- | --- | --- |
| Party draft + deterministic validation | all 7 | — |
| Draft ids applied through the system's own creation plan | 5 (`dnd-5e-2014`, `dnd-5e-2024`, `dnd-3.5e`, `pf1e`, `pf2e`) | **Daggerheart**: offers real class/ancestry/community pools but its `CreationPlan` declares no loader-driven choice steps yet, so legal ids come back in `unroutedIds` and the document is default-seeded. **M&M 3e**: its build is point-buy, exposed as a *component* step the headless applier cannot drive; its only pool is power effects, also unroutable. |
| Encounter draft + budget gate | 5 (the `ENCOUNTER_BUDGET_SYSTEMS` set) | **M&M 3e** and **Daggerheart** have no cited encounter-budget model in `src/scene/encounterDraft.ts` *and* no loader-backed creature catalog, so an encounter cannot be sized or validated for them. The flow records the reason per system and still builds the party and the scene. |
| Scene build (tokens, initiative) | all 7 | — |

Closing the Daggerheart/M&M 3e rows is creation-plan and catalog work in those
systems, not AI work; it is tracked as such rather than papered over here.

## 10. AI gateway provider-agnosticism — what is proven and what is not (added 2026-07-25)

**Status: PARTLY CLOSED.** The provider seam shipped — re-verified 2026-07-26,
`netlify/functions/` holds `providerRegistry.mts`, `geminiAdapter.mts` and
`anthropicAdapter.mts` over one shared `aiSdkAdapter.mts`. The five residuals
under *What is genuinely NOT covered* are all still open; none is scheduled.

The gateway's provider is now configuration, not a hardcoded dependency:
`AI_PROVIDER` selects a registration, each registration declares its own key and
model env vars, and each provider is a thin adapter file over one shared
`createAiSdkAdapter` body. Two real providers ship (`gemini`, `anthropic`) plus
the deterministic `mock`. Adding a third touches no call site in `src/ai/**`.

**New dependency — flagged.** `@ai-sdk/anthropic` is pinned at the exact version
`3.0.86`, not a caret range. That is deliberate: the AI SDK provider packages pin
`@ai-sdk/provider` / `@ai-sdk/provider-utils` to *exact* versions internally, and
`3.0.86` is the last release whose pins (`3.0.10` / `4.0.30`) match what the
installed `ai@6` and `@ai-sdk/google@3` already resolve. A floating range would
silently install a **duplicate** copy of the provider core. `npm install` reports
exactly one added package; it is server-side only and never enters the client
bundle. Bumping it means re-checking that dedupe, not just the changelog.

**What is genuinely NOT covered:**

- **Neither adapter is verified against a live API.** CI has no provider key, by
  design. The Anthropic adapter is proven at the *protocol* level — the real
  `generateObject` path with the SDK's `MockLanguageModelV3` in place of the
  network model (`netlify/functions/aiSdkAdapter.test.mts`) — and its selection,
  key handling, and env wiring are proven in
  `netlify/functions/gatewayHardening.registry.test.mts`. What is untested is the
  round trip against Anthropic's servers, exactly as for Gemini. First real use
  of either provider is still a live smoke test somebody has to run.
- **`illustrate-scene` does not work on Anthropic.** Anthropic has no
  image-generation endpoint, so that task fails there with a typed
  `provider-error` and the client falls back to manual tools. This is a real
  capability gap, deliberately not papered over with a stub image.
- **No cross-provider failover.** Selection is static per deploy; a failing
  provider is not retried on another. The typed failure + manual fallback is the
  whole recovery story.
- **Token usage is observed, not enforced.** Adapters may report input/output
  token counts through the seam, and they surface in `usage.tokens` and the trace
  record — but every budget still charges the deterministic `AI_TASK_UNIT_COST`.
  That is intentional (caps must trip identically whichever provider serves), so
  true token-metered spend accounting remains unbuilt.
- **No provider is priced.** Nothing in the repo knows what a call costs in
  money; the "units" are relative weights, not currency.

## 11. Provenance over-inclusion outside `src/data/` (added 2026-07-25)

**Status: OPEN.** The gate shipped, but **OC-1 still awaits an owner decision** —
re-verified 2026-07-26: all four OC-1 citations remain quarantined in
`scripts/check-rules-provenance.mjs:170-206` with `verdict: 'unsubstantiated'`,
which is exactly what the self-expiring allowlist looks like while unresolved.
OC-2 needs no action. The four-item *honest residual* at the end of this section
is unclosed by design and needs manual review.

**Do not renumber the `OC-` headings below.** `check-rules-provenance.mjs`
carries a `gapsAnchor` field on every allowlist entry that points at them by
name; the gate prints those anchors, and the entries are meant to be deleted
alongside the matching heading when a citation is fixed.

**The blind spot.** `npm run srd:coverage` is a reverse-diff audit: it fetches
published open-content lists and diffs them against what the LOADERS expose. It
therefore only ever sees `src/data/`. Content encoded directly in the **rules
layer** (`src/rules/**`), in the **compute register** (`docs/compute-register/`)
or in the **declarative derived-quantity specs** (`src/systems/**/derivedQuantities.ts`)
never passes through a loader and was structurally invisible to it — so an SRD
citation naming an entry the SRD does not contain could ship unchallenged. That
is the same defect class the reverse diff already caught and removed inside
`src/data/`, hiding in the directories it cannot reach.

**Now gated.** `npm run check:rules-provenance` (in `verify`) audits those three
populations offline. Assertions and their fail modes are documented in
`scripts/check-rules-provenance.mjs`; the pure parsing half is
`src/scripts/rulesProvenanceShape.ts` with unit coverage in
`src/__tests__/scripts/rulesProvenanceShape.test.ts`.

### OC-1 — Great Weapon Master / Sharpshooter cite SRD 5.1, which does not contain them [OWNER DECISION]

**Evidence (all in-repo, all authoritative):**

- `docs/srd-sources.md` (Counts, verified): **SRD 5.1 feats = 1 (Grappler)**.
- `src/data/dnd/5e-2014/feats/index.ts` header: *"The SRD v5.1 includes exactly
  one feat: Grappler. All other 5e feats are Player's Handbook content (not open)
  and are intentionally excluded."* The module exports exactly `[grappler]`, and
  `loadFeatsForSystem('dnd-5e-2014')` returns 1 entry.
- `docs/compute-register/dnd5e-2014.ts` nevertheless cites
  `SRD 5.1: Feats — Great Weapon Master` and `SRD 5.1: Feats — Sharpshooter`.
- `src/rules/conditions/dnd5eRiders.ts` compiles the −5/+10 trade for both feats,
  its header asserts *"SRD 5.1 carries it"*, and its `manualBoundary` notes are
  prefixed `SRD:`.

Both citations name a source that does not contain the entry. The 2014 versions
of these feats are Player's Handbook content. (The 2024 side is already correct:
`docs/compute-register/dnd5e-2024.ts` records both as `excluded` — *absent from
SRD 5.2* — and the rider compiler refuses them for `dnd-5e-2024` characters.)

**Deliberately NOT remediated here.** Removing or relabelling shipped content is
a licensing and product decision reserved to the repo owner. The four citations
are quarantined in the gate's `ALLOWLIST` with `verdict: 'unsubstantiated'`. The
quarantine is self-expiring: if the citations are fixed or removed, the stale
allowlist entries FAIL the gate and must be deleted along with this section.

**Options for the owner:** (a) remove the two riders and their register rows;
(b) keep the mechanic but re-source it — no open 5e edition carries it, so this
means dropping the SRD citation and marking the rows `flagged`; (c) accept the
risk explicitly and record the acceptance here.

### OC-2 — `Powers — Power Cost` is a chapter section, not a power [NO ACTION]

`docs/compute-register/mam3e.ts` cites
`M&M 3e Hero's Handbook (DHH OGC): Powers — Power Cost; Modifiers (minimum cost)`.
"Power Cost" is the cost SECTION of the Powers chapter, not a power effect; the
shipped mam3e power corpus is a list of power *effects*, so the name cannot
resolve. The citation is sound. Recorded with `verdict: 'chapter-section'`
because the parser cannot distinguish a chapter section from an entry without a
denominator of SRD section titles, which does not exist in-repo.

### What the gate still cannot check (honest residual)

1. **Chapter-level citations** — 279 of the 288 scanned citation segments name a
   book SECTION (`SRD 5.1: Carrying Capacity`), not an entry. There is no in-repo
   denominator of SRD section titles, so they are counted and reported but not
   resolved. Building one would mean transcribing seven books' tables of
   contents; a fabricated one would be worse than the gap. **Manual review.**
2. **`kind: 'feature'` and `kind: 'condition'` effect sources** — class/racial
   features and conditions live in the rules IR itself, so there is no
   INDEPENDENT open-content corpus to resolve them against (checking the rules
   layer against the rules layer is circular). 7 such literals are reported as
   unresolvable each run: Rage / Sneak Attack / Divine Smite (5e), Rage / Sneak
   Attack (PF2e), `bruised` (M&M), `status-penalty` (scene-synthetic). All are
   plausibly open (SRD class features), but the gate does not claim to have
   proved it. **Manual review**; closing this needs a features/conditions
   catalog under `src/data/` with its own `srd:coverage` target — which is the
   same work `srd-coverage.ts` already flags for M&M conditions (`ABSENT`).
3. **Prose citations in comments** — `// SRD: heavy melee weapons only.` is a
   provenance claim the gate does not parse, because free text has no reliable
   entry/chapter boundary. The structured `source:` fields on the same effects
   are checked, which is what catches OC-1. **Manual review.**
4. **Per-system reach is uneven, and that is a property of the corpus, not the
   gate** — the gate treats all seven systems identically, but what each system
   currently exposes to resolve differs. **Daggerheart** alone has neither
   named-entry citations nor literal content effect sources outside `src/data/`,
   so it has nothing to resolve; it stays covered by assertion A (edition
   validity) and the D/scope ratchet, which fire the moment such content
   appears. **3.5e and PF1e do have literal content effect sources** — the gate
   CLEARS `feat "Power Attack"` for both at
   `src/rules/conditions/d20LegacyRiders.ts:74,84`. (An earlier revision of this
   note listed 3.5e and PF1e alongside Daggerheart as having none; the gate's own
   CLEARED output disproves it.)
5. **`src/systems/**` is not scanned for literal effect sources** — only
   `src/rules/**` and `src/scene/**` are (`RULES_SCAN_DIRS`), plus the
   declarative `derivedQuantities*.ts` specs for their structured citations. So
   an effect-source literal living in a system module is outside the population
   the gate reports on. This is not hypothetical:
   `src/systems/dnd5e/shared/activities.ts` carries three today (a
   `feature-option` "Defense Fighting Style" and two "Divine Smite" sources), and
   "Defense Fighting Style" does **not** resolve against
   `loadFeatureOptionsForSystem('dnd-5e-2014')` — the corpus name is "Defense",
   so this looks like a label mismatch rather than an open-content defect, but
   the gate does not currently say either way. Widening the scan means first
   deciding how to treat label-vs-corpus-name mismatches so legitimate SRD
   content is not mis-flagged as a licensing finding. **Manual review.**

## 12. Unresolved a11y contrast finding on the creation surface (added 2026-07-25)

**Status: CLOSED 2026-07-28 — and it was a live WCAG AA failure, not a
measurement artifact.** The quarantine is lifted, the scan runs, and all four
a11y tests pass. `KNOWN_A11Y_DEBT` is still empty, so nothing was allowlisted.

**What it actually was.** Run against a real browser — the one thing the note
below said was needed — the failing node is
`<span>No class levels are selected yet.</span>`, the creation-validation
warning, inheriting `text-amber-600` (`#d97706`) on the card's `#ffffff` at
12px: **3.18:1** against AA's 4.5:1. Tailwind's amber-600 does not pass as body
text on white on any surface. The app now uses amber-700 (`#b45309`, 5.02:1)
across the 13 call sites that shared it. Dark mode was already compliant
(`amber-400` at 11.98:1), so only the light value moved.

**The diagnosis recorded below did not survive the live DOM, and is kept for the
trail rather than rewritten.** It describes `#6b788c` on ability-score labels at
4.47:1 and infers "something applies opacity that the declaration does not". On
this surface every element from the failing span up to the dialog reports
`opacity: 1` and `filter: none`, and the rendered colour is exactly what the
class declares. Whether the earlier finding was a different element since fixed
or a misread, it was not this one — so the reasoning that followed from it,
including the compositing theory, never had anything to explain.

**What this cost, which is the part worth carrying.** The quarantine was placed
correctly — at the test level, rather than by adding `color-contrast` to
`KNOWN_A11Y_DEBT`, which would have blinded the gate on every surface. It was
still hiding a shipped AA failure on the screen where every character in this
app is created, for all seven systems, from 2026-07-25 to 2026-07-28. Nothing
else caught it because the only test that looked was skipped. **A quarantined
test is a gate that cannot fail**, and it should carry an expiry or an owner,
not just a good reason.

---

*Original 2026-07-25 record, superseded above:*

`e2e/a11y.spec.ts` scans the New Character dialog + guided-creation wizard for
critical/serious axe violations. That scan is currently **`test.fixme`** — a
quarantined finding, not a dodge, and not an allowlisted rule.

**What axe reports.** `color-contrast` (serious): `#6b788c` on `#ffffff` =
**4.47:1**, needing 4.5:1, on the ability-score labels
(`<span class="text-xs font-semibold text-muted-foreground uppercase">`,
`src/components/sheet/AbilityScoreGrid.tsx:285`). Both browsers, reproducibly.

**Why this is NOT simply "darken the token".** The colour axe measured is not
what the token declares:

- Built CSS ships `--muted-foreground: 215.4 16.3% 43%` = `#5c6a80` = a genuine
  **5.49:1** on white — comfortably passing.
- It is emitted as `text-muted-foreground{color:hsl(var(--muted-foreground))}`,
  with **no alpha**, and `tailwind.config.js` maps it as plain
  `hsl(var(--muted-foreground))`.
- `src/index.css` records that this token was **already darkened once**
  (46.9% -> 43% L) for exactly this WCAG AA criterion.

`#6b788c` is precisely `#5c6a80` composited over white at **~90.6% opacity**,
consistent to a rounding step across all three channels. So some ancestor or
state applies opacity that the declaration does not.

**Ruled out.** The entrance fade on both dialogs (`animate-in fade-in
zoom-in-95` — `GuidedCreatorDialog.tsx:78`, `NewCharacterDialog.tsx:89`) was the
leading hypothesis: axe computes contrast from *composited* pixels, so a scan
landing mid-fade would produce exactly this. A zero-duration stylesheet
(`freezeAnimations`, kept in the spec because it makes every other scan
deterministic) did **not** change the result. Not the cause.

**What it needs.** Computed styles on the ancestor chain in a live browser —
the opacity source is not determinable from source alone, and Playwright is
CI-only in the dev container. Then either fix that source, or darken the token
a second time if the composite is legitimate and unavoidable.

**Why quarantined at the test level.** The alternative — adding `color-contrast`
to `KNOWN_A11Y_DEBT` — would blind the gate to every genuine contrast regression
on every surface. One skipped scan is a far smaller loss than a blinded rule.
Every other surface in the spec stays scanned, `color-contrast` included.

## 13. SRD 5.2.1 Will-o'-Wisp — upstream STR-score defect (added 2026-07-25)

**Status: CLOSED — the entry is fixed; the class of defect it exposed moved to
§15.** Two distinct things were recorded here, and they closed differently.
Re-verified 2026-07-26:

- *This repo's defect* (a stat block tagged `SRD 5.2` carrying SRD 5.1 content)
  is **fixed**. The re-transcription and the derivation of the one recoverable
  field are recorded in code at
  `src/data/dnd/5e-2024/monsters/undead/cr-0-5.ts:175-187`, which cites this
  section by number — so §13 must keep its number.
- *The upstream source defect* is **still present and not this repo's to fix**;
  it is why the fidelity gate cannot check this particular entry (§15.3(d)).
- *The standing risk* this entry illustrated — that name-diff coverage is not
  fidelity coverage — is **superseded by §15**, which built the gate and found
  the Will-o'-Wisp was not an isolated case. Read §15 for the general finding;
  read on here only for this entry's specifics.

**The defect is real and still present upstream.** In the authoritative SRD
5.2.1 markdown (`downfallx/dnd-5e-srd-markdown` `monsters-A-Z.md`, CC-BY-4.0 —
the same file `npm run srd:coverage` uses as the 2024 monster denominator), the
Will-o'-Wisp ability table prints the STR **modifier** in the cell where the
**score** belongs:

```
<td><strong>STR</strong></td><td>-5</td><td>-5</td>   <!-- score cell holds "-5" -->
<td><strong>DEX</strong></td><td>28</td><td>+9</td>   <!-- every other ability: score, then mod -->
```

So the STR *score* is simply absent upstream. Re-verified 2026-07-25.

**What was found and corrected.** The entry was NOT left un-encoded: commit
`168e9b5` shipped a `willOWisp` stat block tagged `source: 'SRD 5.2'` that was
in fact the **SRD 5.1 (2014)** stat block. Measured against the cited 5.2.1
source it was wrong in eight places — HP 22 (9d4) vs **27 (11d4)**; Speed
walk 0 vs **5 ft.**; a Thunder resistance the 5.2 entry does not grant; a
missing **Petrified** condition immunity; Languages "the languages it knew in
life" vs **"Common plus one other language"**; 5.1's Consume Life / Variable
Illumination traits instead of 5.2's **Ephemeral / Illumination / Incorporeal
Movement** traits plus **Consume Life / Vanish** Bonus Actions; and Shock at
9 (2d8) instead of **11 (2d8 + 2)**. That is content attributed to a source
that does not contain it — a provenance defect, not a formatting nit. The entry
has been re-transcribed verbatim from the 5.2.1 source.

**The one derived field.** `str: 1` is derived, not guessed: the source supplies
the modifier (-5), and in 5e exactly one legal ability score (1) yields a -5
modifier, so the score is recoverable from the datum the source does provide.
This is recorded here rather than silently normalized. Everything else in the
entry is verbatim.

**Standing risk this illustrates.** `npm run srd:coverage` diffs entry **names**,
so a stat block encoded from the *wrong edition* still scores as covered. Name
coverage is not fidelity coverage; the reverse-diff catches non-SRD *entries*,
not mis-transcribed *fields*. No gate checks field-level fidelity today.
**Superseded 2026-07-25 by §15:** a gate now exists (`npm run check:srd-fidelity`),
and the audit it was built for found the Will-o'-Wisp was **not** an isolated case.

---

## 14. `p5.infra-gaps` — inventory, what was closed, and what is deliberately NOT built (added 2026-07-25)

**Status: PARTLY CLOSED.** Four of the six sub-items were already built when this
was opened, two closed here (14.2), one is a decision not a gap (14.3), and 14.4
is the honest open remainder. Re-verified 2026-07-26: all three runbooks exist
under `docs/runbooks/`, and `src/telemetry/sinks.ts` still exports `noopSink`
with `createBeaconSink` documented as a seam rather than shipped — i.e. 14.3's
decision has not been quietly reversed.

Ledger item `p5.infra-gaps` bundles six unrelated concerns
("rate-limiting, analytics, a11y, observability, secrets-audit, backup/DR") behind
one `pending` status. That status was wrong: **four of the six were already
built** and the genuine remainder was two things. Recorded here so the next reader
does not re-scope work that exists, and so the parts that will NOT be built are a
decision rather than an omission.

### 14.1 Inventory (what actually exists)

| Sub-item | State | Where |
|---|---|---|
| **Rate-limiting** | **Built** | `netlify/functions/rateLimitStore.mts` — pluggable store behind a `RateLimitStoreDriver`, in-memory by default, durable-ready via `RATE_LIMIT_STORE_URL`. Drives request limiting (`AI_RATE_LIMIT`), a per-session cost cap (`AI_SESSION_BUDGET_UNITS`) sharing one module-scope counter across warm invocations, and per-task-class latency budgets. Client-side limiter in `src/utils/rateLimit.ts`. Inert by default; documented in `netlify/functions/README.md`. |
| **Analytics** | **Built as far as it should be** — see 14.3 | `src/telemetry/**`: event catalog, PII-stripping guard (`schema.ts`), default-OFF opt-in gate (`gate.ts`), bounded ring buffer, pluggable sink. Ships with `noopSink`. **No network sink, by design.** |
| **a11y** | **Built** | Keyboard/semantics pass + `e2e/a11y.spec.ts` axe gate with `KNOWN_A11Y_DEBT`. One quarantined scan remains — §12 above, tracked there, not here. |
| **Observability** | **Was partial → closed here** | `src/ai/gatewayLog.ts` (structured per-request server trace + console sink wired into `netlify/functions/ai-gateway.mts`), `src/utils/errorLogger.ts` (single Sentry funnel, HIGH/CRITICAL only), `docs/runbooks/sentry-alerts.md` (committed alert-rule spec). |
| **Secrets-audit** | **Built** | `scripts/check-secret-exposure.mjs`, run inside `npm run verify`; fails on any `VITE_`-prefixed server secret or committed credential. |
| **Backup/DR** | **Was half → closed here** | `docs/runbooks/supabase-backup-restore.md` covered the **optional cloud** copy. The **browser-local** store — the data of record on a default install — had no documented procedure and no proof its export format was lossless. |

### 14.2 What was closed

1. **Observability — the two dormant alert rules are now live.**
   `sentry-alerts.md` defined rules (b) "AI-gateway failure" and (c) "Supabase
   sync failures" and marked both DORMANT, because the code swallowed exactly
   those failures: `useEntitySync` did `catch { setSyncState('error') }` and the
   browser gateway client degraded every failure silently. Both now report
   through the existing `errorLogger` funnel (`{ surface: 'sync' | 'ai' }`), so
   the committed alert rules describe reality. Reporting is **additive** — the
   local-first degrade behaviour at every call site is unchanged — and the
   payloads are **content-free by construction** (no entities, names, or notes;
   the AI event carries only task, failure code, and the gateway's own
   `traceId`, which joins to the server-side record in `gatewayLog.ts`).
   By-design outcomes (the 429 cost controls, auth, an unconfigured provider,
   a rejected request) are excluded **at the source**, so the alert cannot drown
   in intended behaviour. Pinned both ways — positive and negative — by
   `src/__tests__/observability/failureReporting.test.tsx`.

2. **Backup/DR for the browser-local store.**
   `docs/runbooks/local-data-recovery.md` documents where the data lives (the
   IndexedDB + localStorage pair and their per-document merge), the failure
   modes and what each actually means, the recovery procedures, and an explicit
   list of what the app does **not** promise (no automatic off-device backup, no
   local point-in-time recovery, no sync without sign-in). The runbook tells an
   operator to trust the JSON export;
   `src/__tests__/backupRestoreRoundTrip.test.ts` is what makes that honest —
   export→import round-trips losslessly for **each of the seven systems**, seeded
   from each system's own registered default data model, asserting deep equality
   of the whole envelope including the system payload, `Date` revival at the
   original instants, restore-of-a-restore stability, and a non-zero dropped
   count on a damaged backup. The one field a restore can lose (`img`, when the
   URL is not `https:` or `data:image/*`) is pinned as a deliberate security
   behaviour rather than left to be rediscovered as a bug.

### 14.3 DECIDED: no analytics network sink, no third-party tracker

**Decision: the telemetry scaffold stays sink-less. This is the finished state,
not a stub awaiting a vendor.**

The ledger phrases the sub-item as "privacy-respecting telemetry", and
`src/telemetry/sinks.ts` documents a `createBeaconSink` seam as "infra-blocked".
Re-reading that as a to-do would be a mistake:

- This is an **offline-capable, local-first** app whose entire value proposition
  is that a user's characters never have to leave their browser. Any default-on
  beacon contradicts the product, and an opt-in beacon nobody opts into is
  infrastructure with a maintenance cost and no signal.
- A third-party analytics SDK is **excluded outright** — it would add a
  network dependency, a `connect-src` CSP hole, a bundle cost against an eager
  chunk with ~200 bytes of headroom, and a data-processor relationship, in
  exchange for usage counts on a tool that already works offline.
- What the scaffold provides today is the part with real engineering value: a
  typed event catalog and a guard that makes it **structurally impossible** to
  record free-form user content. If a maintainer ever wants numbers, that guard
  is the hard part and it is already built and tested.

**What would change this:** an explicit product decision by the owner to run
*self-hosted* metrics, plus a stated retention policy and a user-visible opt-in
control. Until all three exist, `noopSink` is correct. Anyone tempted to wire a
sink should treat this section as the review that must be re-opened first.

### 14.4 NOT done, and why (open, with reasons)

- **Sentry `release` + separate preview/production environments.** Both are
  one-line additions to `Sentry.init` in `src/main.tsx`, and both would genuinely
  improve regression grouping (`sentry-alerts.md` §5). Not taken at the time
  because `main.tsx` is in the eager first-paint chunk, which was then at 84.8 /
  85.0 KiB gzip. **That constraint is gone**: the lazy-engine reclaim landed
  (§16.5) and the app chunk now sits well under its budget, so these two are
  free to take.
- **AI-gateway server-side 5xx in Sentry.** The function already emits one
  structured JSON line per request to the Netlify function log, and its
  `traceId` joins to the client-side events wired in 14.2 — so a client alert is
  debuggable. Full server-side alerting needs a Netlify log drain or
  `@sentry/node` inside the function, i.e. provisioning the maintainer must do,
  not code. Deliberately left as ops config.
- **A durable rate-limit store driver.** `resolveRateLimitStore` takes a driver
  and `RATE_LIMIT_STORE_URL`, but no driver is wired, so counters are per-warm-
  instance. This is correct until there is a real backend to point at and real
  traffic to justify it; the seam exists so it is a driver, not a rewrite.
- **§12's quarantined a11y contrast finding**, which needs a live browser and is
  tracked in §12.

## 15. Field-level SRD fidelity — audit result + the gate that now guards it (added 2026-07-25)

**Status: PARTLY CLOSED.** The gate shipped and the audit is done
(`scripts/check-srd-fidelity.mjs` plus its pinned manifest and ratchet baseline,
all present and inside `verify`; re-verified 2026-07-26). **Finding (b) is now
FIXED for every field the gate measures** (2026-07-28): the baseline's
`divergences` block is empty and `check:srd-fidelity` passes with nothing
baselined but the two `upstreamDefects`. **Finding (c) is still open** — the
scalar proficiency sets were corrected alongside (b), but the 5e-2024 backgrounds
still carry the 2014 structural model (`suggestedCharacteristics`, a background
`feature`, language grants) under an SRD 5.2 tag, and three of those four bodies
of text are *Player's Handbook* content, not open content. That is the same
defect class as §11's OC-1 and is a licensing exposure, not a tidiness one; it is
what remains of this section. 15.4 is the itemized residual risk.

§13 recorded that nothing checks whether an entry's CONTENT matches the source it
cites. This section records what a systematic audit found, and the check now wired
into `npm run verify`.

### 15.1 The gate

`npm run check:srd-fidelity` (`scripts/check-srd-fidelity.mjs`) compares the
product loaders' SCALAR fields against verbatim values pinned from the same
open-content sources `srd:coverage` uses (`docs/srd-sources.md`). It is **offline**
— `scripts/data/srd-fidelity-manifest.json` holds the pinned upstream values — so
it can live inside `verify`, which the networked `srd:coverage` deliberately cannot.

- Coverage today: **666 entries / 11,247 field comparisons** — 5e-2014 monsters
  (334, vs 5e-bits/5e-database 2014 JSON), 5e-2024 monsters (327, vs the downfallx
  SRD 5.2.1 markdown), and 5e-2014 + 5e-2024 backgrounds (5, vs 5e-database).
  Fields: `armorClass`, `hitPoints.{count,die,modifier}`, `challengeRating`,
  `size`, all six ability scores, all five speeds; backgrounds compare the skill
  and tool proficiency sets.
- Refresh the pinned manifest with `npm run srd:fidelity:write` (networked; commit
  the result). The 5.2.1 parser inside the check is deliberately **independent of**
  `scripts/encode-2024-monsters.mjs`: a check sharing the encoder's parser cannot
  catch the encoder's own mistakes.
- Known divergences live in `scripts/data/srd-fidelity-baseline.json` pinned to
  their **exact** current encoded value. The baseline is a **ratchet, not a
  blanket**: a baselined field that changes at all — fixed or drifted further —
  fails the check and demands the record be removed or re-recorded. Anything
  diverging that is not baselined fails immediately.
- Proven to fail (2026-07-25 scratch-break, reverted): giving the 5e-2014 Black
  Dragon Wyrmling a 9d4 hit-dice line → 3 FIDELITY failures, exit 1. Giving the
  **generated** 5e-2024 Ogre its SRD 5.1 line (7d10+21 instead of 8d10+24) — the
  exact Will-o'-Wisp signature → 2 FIDELITY failures, exit 1. Fixing a baselined
  field → STALE BASELINE failure. Drifting one → BASELINE DRIFT failure.

**What the gate does NOT cover (residual risk, stated so it is known):** prose
(descriptions, traits, actions), damage/condition immunity and language lists,
alignment and creature type (both are modelled, not transcribed), and every
category outside the four above — all 5e spells/equipment/species/classes/feats,
and **every** PF1e, PF2e, 3.5e, M&M and Daggerheart category. Those were covered by
the 15.2 sweep but have no standing gate.

### 15.2 What was audited, and how

1. **Encoder-regeneration sweep, all 7 systems.** Every encoder in `scripts/`
   (5e-2014/2024 monsters + spells + equipment, 3.5e monsters + spells, PF1e
   monsters + spells + equipment, PF2e monsters + spells, Daggerheart adversaries)
   was re-run against live upstream and its output diffed against what is
   committed. **All reproduce byte-identically after `prettier`.** No hand-edit has
   drifted into any encoder-generated data file in any system. This is the clean
   part of the result and it is a real one.
2. **Hand-written entries** — the entries encoders skip on name match, and the
   residual risk surface — were compared field-by-field against their cited source.
3. **Cross-edition byte-identity** between the 5e-2014 and 5e-2024 catalogs (the
   "identical names, different content" blind spot) was measured for every shared
   category: spells 30/317 shared names byte-identical, equipment 124/448,
   backgrounds 1/1, monsters 0/287, species 0/7, classes 0/12, feats 0/1.
   Byte-identity is a **signal, not a verdict** — spot-checks confirmed genuinely
   unchanged entries (e.g. Misty Step is verbatim identical in 5.1 and 5.2), so
   this was used to target inspection, not as a pass/fail rule.

### 15.3 Findings

**(a) 5e-2014 hand-written monsters — 17 entries wrong, FIXED in this lane.**
Of the 334 shipped SRD 5.1 monsters, 296 are encoder-written and **zero** diverged.
All divergence was in the 38 hand-written entries (tagged with the nonstandard
`source: 'SRD'`). Every corrected value is corroborated twice: by the upstream JSON
*and* by 5e's own HP arithmetic (`modifier == floor((CON-10)/2) * count`).

| Entry | Field | Was | Now (source) |
| --- | --- | --- | --- |
| Aboleth | HP | 18d10+72 | 18d10+36 |
| Ancient Blue Dragon | HP | 28d20+252 | 26d20+208 |
| Ankheg | HP | 6d10+12 | 6d10+6 |
| Black Dragon Wyrmling | CON / CON save / HP | 15 / +4 / 6d8+12 | 13 / +3 / 6d8+6 |
| Chimera | HP | 12d10+36 | 12d10+48 |
| Gladiator | CON / CON save / HP | 18 / +7 / 15d8+60 | 16 / +6 / 15d8+45 |
| Mage | HP | 9d8+9 | 9d8 |
| Young White Dragon | HP | 16d10+64 | 14d10+56 |
| Rat, Spider | HP | 1d4 | 1d4−1 |
| Balor | HP | 21d12+147 | 21d12+126 |
| Bandit, Basilisk, Kobold, Kraken, Medusa, Wolf, Wyvern | `hitPoints.modifier` | absent (read as 0) while `notation` carried the right value | populated |

The last row is a structural bug, not a transcription one: consumers reading the
typed `modifier` field got HP totals that disagreed with the entry's own notation
string.

**(b) 5e-2024 hand-written monsters diverged from SRD 5.2.1 — FIXED for every
gate-measured field (2026-07-28).**
The Will-o'-Wisp (§13) was not an isolated case; it was one instance of a
systemic pattern. The 5e-2024 loader ships ~96 hand-written monsters that override
the encoder on name match, tagged `source: 'SRD 5.2'`. The baseline recorded the
divergence field-by-field, and every one of those fields has now been
re-transcribed from the pinned SRD 5.2.1 markdown the entries already cite —
mostly replacing carried-over SRD 5.1 (2014) values (Wolf AC 13 → 12; Skeleton
AC 13 → 14; Vampire 16d8+64 → 23d8+92; Lich AC 17/18d8+72 → 20/42d8+126; Deva
CR 5 → 10; Manticore CR 7 → 3).

Two things the remediation confirmed that the original audit did not separate:

- **Most of the divergence was not stale-edition carry-over at all.** Comparing
  every divergent field against the repo's own pinned SRD 5.1 manifest values,
  the majority held a number found in **neither** edition — invented or
  placeholder lines, of which Air Elemental `5d10+10` (neither 5.1's 12d10+24 nor
  5.2's) was one of many, spread across roughly as many entries as the genuine
  5.1 carry-overs. "Copied from the wrong edition" understates it.
- **The stat-block count quoted above ("77 of 85") never matched the baseline it
  cited.** The baseline itemized 71 monsters, not 77. The baseline is the
  authority; the prose figure was wrong and is not restated here.

Two derived fields the gate does not pin were corrected with the same source:
`hitPoints.notation` (rebuilt from the corrected dice) and `experiencePoints`
(re-read from the same stat block for the seven entries whose `challengeRating`
was wrong).

**Residual, unmeasured:** the gate pins scalars only. Prose, traits, actions,
`savingThrows`, `skills`, attack bonuses and damage strings on these entries were
NOT re-transcribed and are not compared by anything — an entry whose ability
scores are now 5.2 may still carry a 5.1-derived save or attack line. The
hand-written entries also still sit in CR-bucket files chosen under their old
(wrong) CR, which nothing enforces. Deleting the hand-written overrides so the
encoder's verbatim 5.2.1 output wins remains the durable fix.

**(c) 5e-2024 backgrounds — all 4 carry 2014 content, and 3 are NOT open content.
Proficiencies corrected 2026-07-28; the licensing exposure is STILL OPEN.**
Acolyte, Criminal, Sage and Soldier all ship tagged `source: 'SRD 5.2'` carrying
the 2014 model: `suggestedCharacteristics` tables, a background `feature`
("Shelter of the Faithful", "Criminal Contact", "Researcher", "Military Rank") and
language grants — none of which exist in SRD 5.2, which instead grants ability
scores, an origin feat and a tool proficiency. Acolyte was byte-identical to the
repo's own 5e-2014 Acolyte.
The **proficiency sets** — the only part of a background this section's gate
measures — have since been re-transcribed from SRD 5.2: Acolyte and Sage gained
the Calligrapher's Supplies tool proficiency, Criminal's skills moved from the
2014 Deception/Stealth to 5.2's Sleight of Hand/Stealth and it lost the gaming
set 5.2 does not grant, and Soldier lost Land Vehicles (a 5.1-only tool). **This
does not close (c).** The structural 2014 model and the non-open PHB prose are
untouched, and the fix still requires a `Background` type that can express the
2024 model (ability scores + origin feat), so it stays recorded rather than
papered over.
**Open-content risk:** SRD 5.1 contains exactly ONE background (Acolyte). The 2014
Criminal / Sage / Soldier text is *Player's Handbook* content, which is not open.
So three shipped entries carry non-open content under an SRD tag. The name-based
reverse diff cannot see this, because the NAMES are legitimate SRD 5.2 names. This
is the same class as OC-1 (§11) and needs priority remediation — but the fix
requires a `Background` type that can express the 2024 model (ability scores +
origin feat), so it is recorded rather than papered over. **Do not fix by editing
the source tag.**

**(d) Upstream source defects — recorded, never normalized.**
- **Basilisk AC.** `5e-bits/5e-database` 2014 records `armor_class: [{type:
  'natural', value: 12}]`. SRD 5.1 prints **AC 15**, corroborated by the SRD 5.2.1
  markdown (`**AC** 15`, block otherwise identical). The shipped 15 is correct and
  the denominator is wrong; recorded under `upstreamDefects` in the baseline.
- **Soldier gaming-set proficiency (added 2026-07-28).** SRD 5.2 grants the
  Soldier one Gaming Set of the player's choice. `5e-bits/5e-database` 2024 does
  carry it — but under `proficiency_choices`, not the flat `proficiencies` array
  that `srdBackground()` in `scripts/check-srd-fidelity.mjs` reads, so the pinned
  manifest records an empty tool set. The shipped `['one-gaming-set']` is correct
  and the denominator is incomplete; recorded under `upstreamDefects` in the
  baseline. Soldier is the only SRD 5.2 background whose tool proficiency is a
  choice, which is why no other entry trips it. Clearing it properly means
  teaching `srdBackground()` to read `proficiency_choices`, which re-pins the
  manifest for every system.
- **Malformed SRD 5.2.1 ability tables.** Three blocks merge the MOD and SAVE
  cells (`<td>13 +1</td>`): **Ancient Red Dragon**, **Remorhaz**, and the
  **Will-o'-Wisp** (§13's known STR-score defect). The fidelity check's parser
  rejects them rather than guessing, so they are listed in the manifest's
  `skippedUnparseable` and are **not** field-checked. Note the consequence: the
  §13 entry itself cannot be guarded by this gate until upstream is fixed.

**(e) Nothing else found.** No divergence was found in any encoder-generated data
in any of the 7 systems, and no divergence in 5e-2014 outside the 38 hand-written
monsters.

### 15.4 Not covered — residual risk, itemized

- **5e-2024 monster names absent from SRD 5.2.1** (Goblin, Acolyte, Kobold,
  Hobgoblin, Bugbear, Thug, Veteran, Captain, Necromancer, Pixie) are already
  reported as over-inclusion in `docs/generated/srd-coverage.md`. Confirmed here:
  Thug / Necromancer / Pixie have **no** 5.2.1 stat block under any name; the rest
  exist only qualified (Goblin Warrior, Priest Acolyte, Kobold Warrior, Warrior
  Veteran, …). Their content is 5.1 content. Unresolved.
- **Field-level fidelity of hand-written entries outside 5e monsters/backgrounds**
  is unaudited: 5e-2014 spells (222 hand-written), 5e equipment (241), PF1e spells
  (132), and the hand-written residue in 3.5e / PF2e / M&M / Daggerheart. The
  encoder-regeneration sweep proves the *generated* portions are faithful; it says
  nothing about the hand-written ones.
- **Prose fidelity is unaudited everywhere.** Every finding above is scalar.
  This bites hardest on the 5e-2024 hand-written monsters repaired under (b):
  their scalars are now SRD 5.2, but their traits, actions, `savingThrows`,
  `skills` and attack/damage strings were not re-transcribed and nothing compares
  them, so an entry can be internally inconsistent (5.2 ability score, 5.1-derived
  save). Deleting the overrides in favour of the encoder's verbatim output is the
  durable fix.
- **Alignment on the repaired 5e-2024 monsters — measured, not fixed.** The gate
  does not pin `alignment` (it is modelled, not transcribed), so it was left
  alone. Checking it against the same pinned SRD 5.2.1 markdown afterwards:
  **17 of the 71 repaired entries disagree** — Aboleth, Air Elemental, Archmage,
  Assassin, Awakened Shrub, Berserker, Earth Elemental, Fire Elemental, Giant Elk,
  Lich, Manticore, Noble, Succubus, Vampire, Vampire Spawn, Water Elemental,
  Wraith. Mostly the 2024 edition's move away from "Unaligned"/chaotic labels
  (Lich is Neutral Evil in 5.2, shipped Chaotic Evil; the four elementals are
  Neutral, shipped Unaligned). Listed so the follow-on lane does not have to
  re-derive it. Left unfixed here because nothing gates it and this lane's
  mandate was the itemized baseline.
- **M&M 3e and Daggerheart** have no scalar gate at all; only the
  encoder-regeneration sweep covered them.

---

## 16. Lazy per-system engines — what was reclaimed, and exactly what blocks the rest (added 2026-07-25)

**Status: CLOSED (2026-07-28).** 16.2 landed first (all seven
`src/systems/*/definition.ts` on the lazy `loadValidator`), and the engine
reclaim itself has now landed too — via the preload design 16.4 named as the
alternative, so the decision 16.4 asked for was never needed. 16.5 records what
shipped and what it measured. 16.1–16.4 are kept verbatim as the investigation
record; read them as history, not as the current state of the tree.

The eager app chunk budget note in `scripts/check-bundle-size.mjs` names ONE
structural reclaim as the thing that must pay for the next climb: **lazy-loading
the per-system engines behind the registry**. §14.4 defers work on that basis.
This section records what that reclaim is actually worth, what part of it
landed, and the precise, reproducible reason the rest cannot land as a pure
code-splitting change.

### 16.1 The measured ceiling

Stubbing `engine:` out of all seven `src/systems/<id>/definition.ts` files and
rebuilding (a throwaway measurement, not a shippable state) moves the eager
`index-*.js` chunk from **84.7 KiB to 61.1 KiB gzip — a 23.6 KiB ceiling**. The
52 modules that leave the eager static-import closure are the seven engines,
their per-system derived-quantity/derived-math modules, and the shared rules-IR
surface those pull: `src/rules/derivation`, `src/rules/resolver`,
`src/rules/compile/*`, all five `src/rules/conditions/*` compilers,
`src/rules/dice.ts`, plus `src/utils/{math,spellSlots,classSpellcasting,
derivedCasterMath,derivedCombatMath,resourcePool,scaling,templateShared}` and
`src/constants/hit-dice.ts`. That is the size of the prize.

### 16.2 What landed

Only the part that needed no new mechanism: `dnd-5e-2014` and `dnd-5e-2024` were
the last two systems still supplying an EAGER `validator:`; the other five
already used the registry's lazy `loadValidator` dynamic-import-and-cache seam.
Migrating them onto the same seam drops `src/systems/dnd5e/shared/validation.ts`
and `src/systems/dnd5e/shared/dnd5eKnownSpells.ts` out of the eager closure:
**86,833 B -> 84,382 B gzip (-2,451 B)**, eager shell 190.1 -> 187.7 KiB, with
`appChunkGzipBytes` unchanged at 85 KiB. Budget headroom goes from 207 B to
2,658 B. All seven systems now use the identical validator seam.

### 16.3 What blocks the engine reclaim (reproducible)

`SystemDefinition.engine` is a REQUIRED, SYNCHRONOUS property. Making it lazy
means `engine?: SystemEngine<T>` + `loadEngine?: () => Promise<SystemEngine<T>>`
(the exact shape of the existing `validator`/`loadValidator` pair). Applying
that change and running `npm run typecheck:test` yields 13 errors, which sort
into three groups:

1. **Nine call sites inside `src/systems/**` that are already async.** Every one
   is `.engine.rollCheck(...)`, whose result is already awaited
   (`D20CombatSection.tsx:140,147,154`, `D20SavesTab.tsx:55`,
   `DaggerheartCharacterBasicsSection.tsx:79`, `Dnd5eSheetBase.tsx:170,184`,
   `useMam3eMutationHandlers.ts:276`, `usePf2eMutationHandlers.ts:280`), plus
   `useDnd5eSheetActionHandlers.ts:255` (`applyDamage`, sync but inside an
   already-lazy sheet chunk). **These are NOT the blocker** — they all live
   behind a lazy sheet boundary and would migrate cleanly to an awaited registry
   accessor.

2. **`src/hooks/useDocuments.ts:22` — the real blocker.** This is the ONLY eager
   consumer of an engine: `prepareDocumentWithEngine` calls
   `sysDef.engine.prepareData(doc)` synchronously, and it is called from inside
   `setDocuments` updaters on the load path AND on every add / update / import /
   cross-tab-merge / sync-merge path. There is no synchronous way to obtain a
   dynamically-imported module, so lazy engines force this path async. That is
   observable: documents would be published to React unprepared for at least one
   microtask on cold start, and mutation ordering inside the state updaters
   changes. It is therefore NOT a pure code-splitting change, which is the
   standing safety bar for touching engine math.

3. **Two test files break at COMPILE time, not at assertion time.**
   `src/__tests__/mam3eValidation.test.ts:33` (`Mam3eSystemDef.engine
   .prepareData(...)`) and `src/__tests__/scenarios/capabilityScenarios.test.tsx
   :323` (`def.engine.prepareData(doc)`) both read `.engine` synchronously off a
   real definition, in synchronous `it(...)` bodies. No arrangement of the lazy
   seam keeps them working: in Vitest, `import()` is still a promise, so a
   throw-if-unresolved facade throws and an optional property fails
   `typecheck:test`. Their expectations are correct and must not change; their
   CALL SHAPE must, and that requires explicit authorization.

### 16.4 What unblocking it needs (not authorized here)

- A decision that publishing documents one microtask later on cold start is
  acceptable, or a design that guarantees the engine is resolved before
  `useDocuments` publishes (preload gated on the systems present in the loaded
  collection, plus at the create/import/merge entry points).
- Authorization to adapt the CALL SHAPE (not the expectations) of the two test
  files in 16.3(3).

Explicitly rejected while investigating, and recorded so they are not
re-proposed: splitting `rollCheck` behind an engine-internal dynamic import
(measured at only 2.5 KiB, and it is a SECOND loading mechanism for engines
alongside the registry seam); awaiting the engine chunk in `main.tsx` before
`createRoot().render()` (shrinks `index-*.js` without shrinking first paint —
it makes the fetch serial, so it games the gate rather than paying it); and any
environment-divergent arrangement that keeps engines eager under test and lazy
in the browser.

### 16.5 What shipped (2026-07-28)

The preload design, not the behaviour change. `SystemDefinition.engine` became
optional and paired with `loadEngine`, exactly as `validator`/`loadValidator`
already were. `SystemRegistry` gained three methods: `loadEngine` (resolve +
cache the dynamic import; it never rejects, because engine resolution now sits
on the document load and mutation paths where a rejected promise would take out
the collection rather than one optional feature), `preloadEngines` (resolve a
set at once), and `peekEngine` — a SYNCHRONOUS read of an already-resolved
engine. `peekEngine` is what keeps the reclaim a pure code-splitting change: a
caller pre-resolves, then runs exactly the synchronous code it ran before.

Against the two things 16.3(2) said were observable:

- **Documents are never published unprepared.** `useDocuments` resolves the
  engines for the systems present in the loaded collection BEFORE publishing,
  holding `isLoading` true meanwhile. When nothing is outstanding — an empty
  store, or engines already resolved — the load block still runs synchronously
  inside the effect, as it always did. The IndexedDB reconcile still starts in
  parallel with the localStorage read and is only APPLIED after the localStorage
  branch publishes, so the old ordering holds; its local-edit guard is
  re-checked after the await.
- **Mutation ordering inside the updaters is unchanged.** `updateDocument`
  pre-resolves the engine OUTSIDE the updater; the version derivation still
  reads `prev` from inside it, untouched. Add / import / cross-tab / sync-merge
  pre-resolve then dispatch, and stay synchronous whenever the systems involved
  are already resolved — which is every document already in the collection. The
  one path that can reach a system with no document yet is creation, so opening
  the New Character dialog warms the engines (engines only, not sheet chunks or
  SRD metadata).

One behaviour that is genuinely new, and deliberate: a failed engine chunk no
longer yields silently stale derived values. The affected system ids surface
through the hook's `error`, and the unprepared collection is not persisted, so
stale math cannot be written back as authoritative.

16.3(3)'s two test files were adapted as authorized — call shape only, no
expectation touched. `applyMergedCollections.test.tsx` needed the same treatment
for a different reason: its first add of a system is now the call that resolves
that engine chunk, which a synchronous `act()` cannot settle.

Measured on a clean build of the base commit versus the change: eager
`index-*.js` **84,280 B -> 61,037 B gzip (-23,243 B)**, eager shell 187.8 ->
165.1 KiB, `appChunkGzipBytes` unchanged at 85 KiB. Budget headroom against that
ceiling goes from 2,760 B to 26,003 B. That is 23.2 KiB of the 23.6 KiB ceiling
16.1 measured — the residue is the engine classes' own construction sites, which
the throwaway stub also elided.

---

## 17. M&M 3e equipment — 150 hand-written entries, one false citation (added 2026-07-25)

**Status: CLOSED — the repair merged.** Written while the work was in flight; it
has since landed and is verifiable in the tree (2026-07-26):
`scripts/encode-mam-equipment.mjs`, the offline
`scripts/check-mam-equipment-provenance.mjs` gate with its ratchet manifest, the
generated `equipment/srd-{weapons,armor,vehicles,gear,headquarters}.ts` tier, and
the item-by-item record in `docs/mam3e-equipment-provenance.md`. **17.2 lists the
residuals**, of which the last is a live defect of the same class in the *other*
M&M data sets.

**SUPERSEDED IN PART 2026-07-30.** This repair *kept* the 79 non-SRD entries,
segregated into `equipment/original-not-srd.ts` under an
`originalContentSources` policy channel, on the ground that deleting shipped
content was the owner's call. The owner made it: the 79 entries, the module and
the channel are all deleted, along with the 27 entries the same channel admitted
across the five d20 catalogs (106 in total). What follows describes the repair as
it landed; where it says the entries are kept, they are not. See §17.3.

This section also supersedes the interim M&M equipment coverage bullet in §1,
which cross-references here.

`src/data/mutants-and-masterminds/3e/equipment/*.ts` shipped **150 hand-written
entries, every single one tagged `source: "Hero's Handbook"`.** Diffed against the
Hero SRD `EQUIPMENT_LIST` (frnprt/mm3e-character-creator `js/data.js` — the same
upstream `src/scripts/srd-coverage.ts` already cites for the mam3e denominators),
**only 45 of those names exist in the Hero SRD.** The other 104 are not Hero SRD
content and were claiming a book they were never transcribed from.

This is the same defect class the SRD fidelity audit named: every divergence in
the product lives in hand-written entries that override the encoder. Here there
was no encoder at all — the whole data set was the override surface.

The 45 that matched by name were not faithful either. The SRD prints Club 2
(shipped 1), Bow 6 (3), Crossbow 7 (3), Rocket Launcher 27 (19), Battleaxe 3 (4)
and nine more. A name-only coverage measure scored all 45 as covered. Two entries
also shipped **twice under different ids** — `Plate Armor`
(`medieval-plate-armor`, `plate-armor`) and `Chain Mail` (`medieval-chain-mail`,
`chain-mail`) — which id-based dedupe could not see.

### 17.1 What was done

<!-- Renumbered 2026-07-26: these two headings were written as 15.1 / 15.2 and
     collided with the real §15 subsections. No inbound reference used either
     number, so the fix is local to this file. -->

- **An encoder, not hand-editing.** `scripts/encode-mam-equipment.mjs` generates
  all **113/113** Hero SRD entries into
  `equipment/srd-{weapons,armor,vehicles,gear,headquarters}.ts`, cited
  `M&M 3e Hero SRD`, carrying the SRD's own name / cost / type / details.
  Re-running it on unchanged input produces a byte-identical tree (verified from
  both a local copy and a live fetch). The six hand-written modules are deleted —
  the override surface for the SRD half of this data set is gone.
- **Nothing was deleted from the product.** The 104 non-SRD entries split into
  25 that are demonstrably the SRD's own item renamed (reconciled to the SRD
  entry, SRD stats winning) and **79 genuinely original entries, which are kept**
  in `equipment/original-not-srd.ts` under `source: 'Original Content (not SRD)'`.
  The item-by-item classification, with the rule used and the reason for each
  borderline call, is `docs/mam3e-equipment-provenance.md`.
- **A new provenance channel rather than a dishonest label.**
  `SystemOpenContentPolicy` gained `originalContentSources`
  (`src/utils/openContentPolicy.ts`). Putting the original-content label on
  `allowedSources` would have made that whitelist mean two things at once, which
  is how the defect hid in the first place. `NOTICE` /
  `src/legal/attributions.ts` now disclose the split, so the M&M attribution no
  longer implies every shipped M&M row is Open Game Content.
  `check:legal-notices` stays 28/28.
- **An offline gate in `verify`.** `scripts/check-mam-equipment-provenance.mjs`
  (`npm run check:mam-equipment`) ratchets, against the committed
  `scripts/data/mam3e-equipment-manifest.json`: no entry may cite the Hero SRD
  unless it is in the manifest with matching cost and type; every manifest entry
  must ship; hand-written entries may not cite the SRD; no duplicate id **or
  name**; and the label the data exports must be one the policy declares.
  It is offline for the same reason `check:srd-fidelity` is — the networked
  `srd:coverage` cannot run inside `verify`.
- Published coverage regenerated by a real networked `npm run srd:coverage` run:
  **M&M equipment 45/113 (39.8%) → 113/113 (100%)**, and the reverse-diff extras
  drop 103 → 79, which independently equals the group (b) count.
- **The published compliance metrics no longer absorb the 79.** Caught in review:
  `isOpenContentCompliant` is the SHIPPING gate (open content OR declared
  original content), which is the wrong predicate for anything *measuring*
  open-content compliance. Two published surfaces were using it that way and
  would have reported "469 / 469 / 100% open-content integrity" for M&M — a
  figure that silently includes 79 self-authored entries, in the very change
  that found the mislabeling. Both are fixed:
  - `docs/generated/roadmap-metrics.md` Content Integrity gains an explicit
    `Original (non-SRD)` column and an `Open-Content Pop.` denominator; the 79
    are excluded from **both** sides of the ratio, so M&M now reads
    `469 | 79 | 390 | 390 | 100%`. The per-category Loader Compliance Audit and
    the Referenced Module Audit carry the same column, so the 79 are
    attributable to exactly one category.
  - `docs/srd-manifest/` gains a `ManifestEntryStatus` of `original`. Those
    entries stay enumerated (the catalog remains a complete inventory of what
    ships) but drop out of `isInScope`, so the open-content denominator for M&M
    equipment is 113, not 192, and Content Catalog Parity reads `113 | 113 | 100%`.
  - `isOriginalContentSource` is now exported from `src/utils/openContentPolicy.ts`
    so both generators classify from the policy rather than duplicating the label.
    Build-time only: the eager chunk is unchanged at 86,906 gzip bytes.
  - Surfaces checked and found clean: `NOTICE` and the in-app Legal view both
    already disclose the split (they render `src/legal/attributions.ts`);
    `docs/generated/master-gap-ledger.*` states the split in prose;
    `docs/generated/srd-coverage.md` reports the 79 as reverse-diff extras, which
    is the honest presentation; and the in-app system-catalog counts
    (`countProductItems`) make no open-content claim in the UI — they are
    unlabelled item totals. `docs/STATUS.md` did assert "every one …
    open-content-policy-clean" and a stale "M&M equipment remainder (measured
    45/113)"; both corrected.

### 17.2 Residual — stated, not implied

- **The gate compares name, cost and type only.** The SRD `details` string is
  transcribed verbatim into `description`, but its content is not field-compared.
  **Prose fidelity for M&M equipment is unaudited**, as it is everywhere else in
  the repo.
- **The generated tier carries no structured stat fields.** `protection`,
  `damage`, `toughness`, `size`, `speed` and friends live inside the SRD details
  prose; parsing them back out would be derivation, not transcription, so the
  generated entries carry only the `MaMEquipment` surface. Nothing reads those
  fields today (`loadMam3eEquipment` flattens to `Item[]`; only `metadata.ts`
  counts lengths) — no functional regression, but a real data-model narrowing.
- **17 entries changed type `device` → `gear`** (Binoculars, Commlink, Grapple
  Gun, First Aid Kit, …). The SRD prints them under "General Equipment";
  `device` in M&M means a power-bearing Device, which they are not.
- ~~**`original-not-srd.ts` stays hand-written and unaudited.**~~ **RESOLVED
  2026-07-30 (§17.3).** There was no upstream to encode it from and nothing to
  check its stat blocks against; the gate proved only that it did not *claim* the
  SRD. Whether the 79 entries should ship at all was flagged here as the
  repository owner's call. The owner made it: delete. The gate now fails any
  entry that does not come from a generated Hero SRD module.
- **The eager shell grew 67 bytes** (86,839 → 86,906 gzip; headroom 201 → 134 of
  the 85 KiB budget). The equipment data itself stayed lazy — the `mam3e-data`
  chunk went 31.3 → 32.4 KiB. The 67 bytes are the `originalContentSources`
  channel in `openContentPolicy.ts`, which is eager by design on main because it
  filters every system's citations. `appChunkGzipBytes` was **not** raised.
- The other hand-written M&M data sets (powers, advantages, archetypes,
  complications, modifiers, skills) got **no** treatment here. `srd:coverage`
  still reports non-SRD powers and a non-SRD advantage shipping under
  `Hero's Handbook`; that is the same defect class, unaddressed. This is the one
  genuinely open item in an otherwise closed section.

### 17.3 The original-content channel, and its deletion (2026-07-30)

**Owner decision, executed.** §17.1 built a second admission channel —
`originalContentSources` on `SystemOpenContentPolicy` — so that content this
project wrote could ship under a truthful label instead of a borrowed one. That
was the right fix for the *labelling* defect and the wrong answer to the
underlying question. A second channel made shipping self-written content a
one-line addition, and by 2026-07-30 **106 entries had gone through it**:

| Where | Count |
|---|---:|
| `mutants-and-masterminds/3e/equipment/original-not-srd.ts` | 79 |
| `dnd/5e-2014/equipment/magic-items.ts` | 7 |
| `pathfinder/2e/spells/level-1.ts` | 4 |
| `dnd/5e-2024/equipment/magic-items.ts` | 3 |
| `pathfinder/2e/equipment/adventuring-gear.ts` | 3 |
| `dnd/3.5e/spells/level-7.ts` | 2 |
| `dnd/5e-2024/monsters/humanoids/cr-6-10.ts` | 2 |
| `pathfinder/1e/equipment/magic-items.ts` | 2 |
| `dnd/5e-2024/monsters/fey/cr-0-5.ts` | 1 |
| `pathfinder/2e/equipment/armor.ts` | 1 |
| `pathfinder/2e/spells/level-8.ts` | 1 |
| **Total** | **106** |

All 106 are deleted, and so is the channel. `SystemOpenContentPolicy` is now
`allowedSources` + `allowMissingSourceFor` and nothing else;
`isOriginalContentSource` is gone; `isOpenContentCompliant` admits open-content
provenance only. A new self-written entry therefore has nowhere to be admitted
from and fails the gate — which is the point of removing the channel rather than
merely emptying it.

Consequences, stated rather than implied:

- **Catalog counts fall.** dnd-3.5e spells 609 → 607, pf2e spells 551 → 546,
  dnd-5e-2024 equipment 497 → 494, mam3e equipment 192 → 113. These are honest
  reductions: the removed rows were never open content.
- **The `devices` M&M equipment category disappears entirely** — all 11 were
  self-authored, and the Hero SRD prints no `device` row. `mm3eMetadata.stats
  .equipment` no longer carries the key.
- **Three published surfaces simplify.** The `Original (non-SRD)` column and
  `Open-Content Pop.` denominator are removed from
  `docs/generated/roadmap-metrics.md` (the population they corrected for is
  empty); `ManifestEntryStatus` drops `'original'`; and
  `src/legal/attributions.ts` no longer discloses an M&M split, because there
  is none.
- **The `check:mam-equipment` gate got stricter, not looser.** Assertion C used
  to say "a hand-written entry may not claim the SRD"; it now says every shipped
  entry must come from an encoder-generated Hero SRD module and cite a Hero SRD
  source. An emptied directory would have been a convention; this is a check.

---

## 18. Provenance over-inclusion — the audit result, and the gate that now bounds it (added 2026-07-25)

§15 audited whether a shipped entry's CONTENT matches the source it cites. This
section audits the other face of the same defect: entries the product ships that
are **not in the cited open-content source at all**. `npm run srd:coverage` has
reported that population as a bare count and a truncated name list since it was
built; nobody had classified it, so a genuinely non-open item and a harmless
word-order variant were indistinguishable in the report.

**Headline.** Of **1,045** reported suspects across the 41 wired
(system × category) denominators:

- **753 are not provenance problems at all** — the entry is in the cited source
  and the *measurement* is wrong (incomplete source slice, granularity mismatch,
  a name the normalizer does not fold, or a defect in the source itself).
- **117 are catalog-hygiene findings** — 69 duplicated rows and 48 pre-built
  instances of a generic source row.
- **173 are genuine provenance findings** (158 distinct entries) — 95 records with
  no counterpart in any cited open-content source, and 78 records of real open
  content cited to the wrong edition or the wrong game.
- **2 remain `undetermined`**, each stating why (18.6).

The reported number was never a measure of the problem, and 173 is a **lower
bound, not a measure** — §15(c) already proved a name diff cannot see the worst
case (18.5.3).

**Of the 95 `genuine-non-open-content` records, 64 are M&M 3e equipment that was
already honestly labelled** `Original Content (not SRD)` and segregated by §17 —
no false citation remained on them. They stayed in the licensing class because
the *finding* (no open-content counterpart) is what the class records, and
because whether names like `Power Ring`, `Web Shooters` and `Mystic Amulet` should
ship at all was a trade-dress judgment reserved to the owner (§17.2). **31 records
carried a false citation**; that was the number describing live exposure, not 95.

**RESOLVED 2026-07-30 (§17.3): the exposure is zero on both counts.** The 31
false citations were retagged to their true sources by the provenance work, and
every entry that could then only be described as this project's own writing —
106 of them, the 79 M&M items and 27 across the d20 catalogs — was deleted. There
is no longer a population of shipped entries with no open-content counterpart.

### 18.1 The gate

`npm run check:provenance-over-inclusion`
(`scripts/check-provenance-over-inclusion.mjs`, wired into `verify`) re-runs the
reverse diff **offline** and requires every suspect to carry a classification
with evidence.

- `scripts/data/srd-overinclusion-manifest.json` pins the entry-name list of
  every wired denominator, fetched from exactly the sources
  `src/scripts/srd-coverage.ts` cites — its `TARGETS` array is now exported and
  **imported by the gate**, so the two cannot drift apart. Refresh with
  `npm run srd:overinclusion:write` (networked; commit the result).
- The diff uses the same `src/scripts/srdCoverageShape.ts` helpers as the
  networked report, so the offline gate and `srd:coverage` cannot disagree about
  what a suspect is. Both report the same count (1,045 when this was written;
  **925** after the 2026-07-30 deletions, §17.3), and
  `docs/generated/srd-coverage.md` regenerates **byte-identical** after this
  lane's refactor.
- `scripts/data/srd-overinclusion-classification.json` is the audit ledger: one
  record per suspect, carrying `class`, `evidence`, and the entry's **current**
  `source` tag. Regenerate the skeleton with
  `npm run srd:overinclusion:record` (preserves existing classifications). The
  classification itself is not machine-derivable — it *is* the audit.

**Proven to fail** (2026-07-25 scratch-breaks, each reverted):

| Deliberate break | Failure | Exit |
| --- | --- | --- |
| Retag the non-open `Cloak of the Archmagi` from `SRD 5.1` to `SRD` — both are allowlisted, so `openContentPolicy` stays green | `SOURCE-TAG DRIFT dnd-5e-2014/equipment\|cloakofthearchmagi: recorded taggedSource="SRD 5.1", now "SRD".` | 1 |
| Ship an invented `Amulet of the Nine Hells` tagged `SRD 5.1` | `UNCLASSIFIED dnd-5e-2014/equipment: "Amulet of the Nine Hells" (tagged "SRD 5.1") is shipped but absent from the pinned open-content source, and has no classification.` | 1 |
| Downgrade a licensing finding's evidence to `"no evidence"`; add a classification for an entry that is not a suspect | `NO EVIDENCE dnd-5e-2014/equipment\|alchemyjug` + `STALE CLASSIFICATION dnd-5e-2014/equipment\|ghostitemthatdoesnotship` | 1 |

The first break is the one that matters: it is the exact move §15 warns against —
making a provenance finding disappear by editing the tag rather than the content.

### 18.2 The classification

| Class | n | Meaning |
| --- | ---: | --- |
| `denominator-scope-defect` | 707 | The entry IS in the cited source; the coverage script fetches an incomplete slice of it. |
| **`genuine-non-open-content`** | **95** | **No counterpart in any cited open-content source, under any name.** 64 of these are the honestly-labelled M&M originals. |
| **`wrong-edition-attribution`** | **78** | **Real open content, but from a different edition/game than the tag claims.** |
| `duplicate-alias` | 69 | The loader ALSO ships the entry under its correct source name. A duplicated catalog row. |
| `generic-entry-instantiation` | 48 | The source ships a generic rule/table row; the product ships pre-built instances. |
| `naming-variant` | 26 | Same entry, different name; the source-named entry does NOT also ship. |
| `denominator-shape-artifact` | 14 | Source and product disagree about entry granularity, so the diff double-counts. |
| `upstream-defect` | 3 | The entry is in the source; the *source* is wrong. |
| `category-rollup` | 3 | The shipped entry is a source table/category header, not an entry (cf. §11 OC-2). |
| `undetermined` | 2 | Could not be established; each record states why. |

Per population:

| Population | Suspects | Breakdown |
| --- | ---: | --- |
| PF1e equipment | 372 | scope-defect 347; then the 25-entry residual: generic-instantiation 11, duplicate-alias 10, wrong-edition 3, non-open 1 |
| PF1e magic-items | 269 | scope-defect 244; the same 25-entry residual |
| PF2e equipment | 156 | scope-defect 77, **wrong-edition 47**, naming-variant 26, non-open 4, duplicate-alias 2 |
| 5e-2014 equipment | 46 | duplicate-alias 24, generic-instantiation 9, non-open 8, category-rollup 3, wrong-edition 2 |
| 5e-2024 equipment | 44 | generic-instantiation 11, duplicate-alias 11, wrong-edition 9, non-open 8, scope-defect 3, shape-artifact 2 |
| M&M 3e powers | 21 | scope-defect 21 |
| PF2e spells | 14 | wrong-edition 5, non-open 5, duplicate-alias 3, scope-defect 1 |
| Daggerheart weapons | 14 | scope-defect 12, upstream-defect 2 |
| 3.5e monsters | 11 | shape-artifact 11 |
| 5e-2024 monsters | 10 | wrong-edition 8, non-open 2 |
| 3.5e spells | 5 | duplicate-alias 2, non-open 2, wrong-edition 1 |
| 5e-2014 monsters | 1 | shape-artifact 1 |
| Daggerheart ancestries | 1 | scope-defect 1 |
| Daggerheart armor | 1 | upstream-defect 1 |
| M&M 3e advantages | 1 | scope-defect 1 |
| M&M 3e equipment | 79 | **non-open 64, duplicate-alias 7, generic-instantiation 6, undetermined 2** (hand-off completed 2026-07-26, see 18.6) |

### 18.3 The measurement is the single biggest defect (753 of 1,045)

**Most of what the report calls over-inclusion is the report being wrong.** Four
distinct causes:

1. **PF1e equipment / magic-items double-count each other — 591 records.** Both
   targets diff the **same** merged 616-entry loader
   (`loadEquipmentForSystem('pf1e')`) against **one scoped half** of the pinned
   PSRD manifest (243 Equipment vs 347 Magic Items). Each row therefore reports
   the other row's entire content as "not in SRD". Only **25** entries are absent
   from the union of both scopes. Fix: union the denominator, or split the loader
   by scope. Until then the PF1e over-inclusion figures in
   `docs/generated/srd-coverage.md` mean nothing.
2. **Incomplete source slices — 116 more records.**
   - **PF2e equipment (77).** 69 resolve exactly against Pf2eTools
     `items/baseitems.json` (`source === "CRB"`), a file the coverage script
     never fetches; 7 more are graded runes nested at
     `item[].variants[]`, which the script's top-level `item[].name` read cannot
     see; `Unarmed Strike` has no items-derived counterpart in any Pf2eTools file.
   - **M&M 3e powers (21) and advantages (1).** The `frnprt` `POWER_EFFECTS`
     array is an *effects-only* list of 40 and cannot measure the 21 **Sample
     Powers** the Deluxe Hero's Handbook also publishes; the repo's own powers
     README states the split ("61 Total — 40 Core Effects + 21 Sample Powers"),
     and all 21 resolve as headings in an independent transcription of the DHH
     Powers chapter. `Improvised Weapon` is a real DHH combat advantage (p.85)
     that the 73-entry `ADVANTAGES` array simply omits.
   - **Daggerheart (13).** The 12 Combat Wheelchair weapons live in the SRD's
     `contents/Combat Wheelchair.md`, which the script does not fetch (it reads
     only the Primary and Secondary Weapon Tables); every shipped field matches
     the SRD table rows. `Mixed Ancestry` is a full mechanical section of
     `Ancestries.md` that the link-list denominator cannot see.
   - **5e-2024 equipment (3).** The 5e-bits/5e-database 2024 JSON has **no entry
     matching `/focus|symbol/` at all**, while SRD 5.2.1 `equipment.md` carries
     `#### Arcane Focus (Varies)`, `#### Druidic Focus (Varies)` and
     `#### Holy Symbol (Varies)` as named entries.
   - **PF2e spells (1).** `Aid` is real CRB open content — but it is the Aid
     *basic action*, shipped as a level-2 spell. The licensing answer is clean;
     the actual defect is loader miscategorisation.
3. **Names the normalizer does not fold — 26 records (PF2e equipment).** The CRB
   *does* carry `Rope (50 feet)`, `Chalk (10)`, `Sack (5)`, `Candle (10)`,
   `Chain (10 feet)`, `Ladder (10-foot)`, `Ten-Foot Pole`, `Spellbook (Blank)`,
   `Leather`, `Hide`, and 16 bare rune names (`Striking`, `Flaming`,
   `Resilient`, …) — the product ships the same entries under parenthetical or
   `… Rune`-suffixed forms. This is the one class where **extending
   `srdCoverageShape.ts` normalization is the right remedy**, on two axes
   (parenthetical-quantity suffixes, and the `Rune` suffix).
4. **Granularity and upstream defects — 20 records.** SRD 3.5 prints ONE
   `## Salamander` and ONE `## Hydra` section, each a single combined table with
   a column per variety; `srdCoverageShape.ts` deliberately excludes both from
   the container collapse, so the source counts 1 and the product counts 3 and 8
   — the same entry is reported as *missing* and as an *over-inclusion*
   simultaneously. SRD 5.1 likewise prints one `Werewolf` entry that 5e-database
   splits into three form rows, and SRD 5.2 folds the healing-potion tiers into
   one entry's table. Three are defects in the SOURCE, recorded and never
   normalized (§15(d) precedent): the pinned `Batres3/daggerheart-srd` repo
   misspells `Widogast Pendant` as "Widgast", misspells `Bellamoi Fine Armor` as
   "Bellamie", and normalizes `Sword of Light & Flame` to "and" — verified
   against the official Darrington Press SRD text and two independent datasets.
   **In all three the shipped name is correct and the denominator is wrong.**

**None of these is fixed here.** They are measurement bugs with real blast radius
— changing a denominator moves published coverage percentages — and this lane's
remit was the classification. Each is recorded per entry with the upstream file
that resolves it, so the fix is mechanical rather than investigative.

### 18.4 Duplicated catalog rows — 69 records, and NOT a normalization problem

The largest genuine *data* finding. **The product ships both a correctly
SRD-named row and a colloquially-named duplicate of the same item**, and only the
duplicate surfaces as over-inclusion. In 5e-2014 equipment, 18 of the 24 pairs are
**byte-identical** on every compared field (cost, weight, category, rarity,
damage, armour class, properties, source): `Light Crossbow` alongside
`Crossbow, light`; `Padded` alongside `Padded Armor`; `Telescope` alongside
`Spyglass` (both 1,000 gp / 1 lb); `Sledgehammer` alongside `Hammer, sledge`. The
other 6 differ only in a stray field — and those differences are themselves
unaudited fidelity divergences: `Helmet of Telepathy` weighs 1 lb where
`Helm of Telepathy` weighs 3; `Robes of the Archmagi` 1 lb vs `Robe of the
Archmagi` 4. PF1e has the same shape for a different reason: a faithful
PSRD-derived `srd-*.ts` family shipped alongside an older hand-written
`weapons.ts` / `armor.ts` / `adventuring-gear.ts` catalog using colloquial names
(and `Belt of Strength` priced 30,000 gp against the source's 4,000). 3.5e ships
`Clairvoyance` beside `Clairaudience/Clairvoyance` and a `Globe of
Invulnerability, Greater` beside the plain 6th-level SRD `Globe of
Invulnerability`. PF2e ships `Whistle` beside `Signal Whistle`, and a `Chain`
typed as a fabricated 1d6-slashing reach weapon beside the real gear row.

**The obvious remedy — extending name normalization — is the wrong one for this
class, and was deliberately not taken.** Folding `Light Crossbow` onto
`Crossbow, light` would clear the report while leaving the user looking at two
identical crossbows in the equipment browser. The finding is a duplicated
catalog; hiding it in the measurement is exactly the failure mode this lane
exists to stop. De-duplication is a product decision (which name wins, which ids
break) reserved to the owner.

### 18.5 LICENSING FINDINGS — escalated, not remediated

173 records (158 distinct entries) are genuine provenance findings; **31 of them
carry a false citation today** — the 64 honestly-labelled M&M originals do not. Following the §11 /
OC-1 precedent, **nothing here was deleted or relabelled.** Re-tagging is not
cosmetic: `filterOpenContentBySource` (`src/utils/openContentPolicy.ts`) drops
any entry whose source leaves the allowlist, so "correcting" the tag silently
removes the item from the product. That is the owner's decision. Every entry is
quarantined in the classification ledger, and the ledger is self-expiring —
change the entry and the gate fails until the record is redone.

#### 18.5.1 The PF2e equipment catalog is mostly not PF2e content [LARGEST FINDING]

Of 188 shipped PF2e equipment entries, **45 are not Pathfinder 2e Core Rulebook
content at all**, every one tagged `source: "Core Rulebook"`. They fall into two
coherent layers, which is what makes this a systematic import rather than
scattered error:

- **A PF1e weapon table at a systematic ÷10 price downshift.** `Cestus`
  (PF1e 5 gp → shipped 5 sp), `Siangham` (3 gp → 3 sp), `Throwing Axe` (8 gp →
  8 sp, range 10 preserved), `Boar Spear` (5 gp → 5 sp), `Boomerang` (3 gp →
  3 sp, range 30), `Orc Double Axe` (60 gp → 6 gp), `Wakizashi` (35 gp → 3 gp),
  `Chakram` (1 gp, PF1e weight and 30 ft range exact), plus `Banded Mail`.
- **A D&D 5e SRD gear and armour layer with exact table matches.** `Handaxe`
  (1d6 S, Light + Thrown 20/60 — and note PF2e's actual `Hatchet` is **absent**
  from the loader, so this is a substitution, not a naming variant), `Pike`,
  `War Pick`, `Ring Mail`, `Net`, `Tinderbox` (5 sp), `Ball Bearings` (1 gp),
  `Hunting Trap` (5 gp), `Herbalism Kit` (5 gp), `Ink Pen` (2 cp), `Bucket`
  (5 cp), `Shovel` (2 gp), `Dice Set`, `Playing Cards`, `Map/Scroll Case`, and
  the d20-SRD sundries `Vial`, `Flask`, `Jug`, `Blanket`, `Bell`, `Basket`,
  `Bottle (glass)`, `Sealing Wax`, `Parchment (sheet)`, `Ink (1 oz vial)`,
  `Marbles`, `Block and Tackle`, `Pickaxe`, `Saw`, `Pouch`, `Net (fishing)`,
  `Rope, Silk (50 ft.)` (verbatim 3.5 SRD row, 10 gp exact).
- Four more are **right game, wrong book**: `Atlatl` (Treasure Vault, 2 sp
  exact), `Earth Breaker` ("Earthbreaker", Treasure Vault, 4 gp exact), `Bola`
  (Player Core 1 / Treasure Vault, 5 sp exact), `Armored Coat` (Lost Omens:
  Knights of Lastwall).

All of it is open content under the OGL — the exposure is the false citation, not
the licence. Six further PF2e equipment rows have **no** open-content counterpart
anywhere: `Field Plate` (an AD&D 2e armour name, absent from items-crb, the
410-row baseitems, every Pf2eTools file, the 3,715-item PF1e PSRD corpus and the
5e SRD), `Horn`, `Sledgehammer`, `Chisel`, `File`, `Tongs`.

Five PF2e **spells** are similarly PF1e/3.5 imports tagged CRB (`Feather Step`,
`Geyser`, `Delayed Blast Fireball`, `Firestorm`, `Forcecage` — the last three
carrying d20 tells such as "N 10-foot cubes"), and five have no counterpart in
any of the 2,059 Pf2eTools spells across 59 book files or the 1,543-spell PF1e
PSRD corpus: `Entreat`, `Floating Shroud`, `Harmless Healing`, `Jumping Jack`,
`Misdirection, Mass`. Four of those five sit in the same files as, and paraphrase,
a genuine CRB spell the loader already ships correctly (`Command`, `Heal`,
`Jump`).

#### 18.5.2 `genuine-non-open-content` — 95 records, 86 distinct entries [OWNER DECISION]

**5e magic items (10 entries, each shipped TWICE — once tagged `SRD 5.1` in the
2014 catalog and once tagged `SRD 5.2` in the 2024 catalog, so 20 records).** Each
is absent from BOTH open-content 5e sources checked: the 362-entry
5e-bits/5e-database SRD 5.1 magic-item list AND the 264-entry SRD 5.2.1
`magic-items.md` (downfallx/dnd-5e-srd-markdown).

| Entry | What it actually is |
| --- | --- |
| Alchemy Jug | Dungeon Master's Guide wondrous item |
| Cloak of Etherealness | Dungeon Master's Guide wondrous item |
| Sword of Vengeance (Cursed) | Dungeon Master's Guide cursed item |
| Scroll of Protection | Dungeon Master's Guide item — and NOT a Spell Scroll instance |
| Cloak of Billowing | Xanathar's Guide to Everything common item |
| Potion of Dragon's Breath | Xanathar's Guide to Everything potion |
| Cloak of the Archmagi | No known WotC counterpart — apparently invented (the SRD item is the Robe of the Archmagi, which also ships) |
| Cap of Water Breathing | No known WotC counterpart — apparently invented |
| Pegasus Boots | No known WotC counterpart — apparently invented (the SRD analogue Winged Boots also ships) |
| Ring of Clumsiness (Cursed) | No known WotC counterpart — apparently invented |

**5e-2024 monsters (3).** `Captain`, `Necromancer`, `Pixie` — absent from SRD 5.1
and SRD 5.2.1 alike. Both SRDs carry only `Sprite`, never `Pixie`; the 5e
`Necromancer` NPC is Volo's Guide content; no bare `Captain` exists in either
SRD, and the shipped CR 2 / AC 16 does not match `Bandit Captain` (CR 2 / AC 15).
§15.4 independently reached the same conclusion for these three.

**3.5e spells (2).** `Mass Misdirection` (level 7) and `Reversal of Fortune`
(level 7), both tagged `SRD 3.5`, neither a heading in any of the nine
`olimot/srd-v3.5-md` spell chapters. The qualifier word-order normalization
already folds `Mass X` / `X, Mass`, so `Mass Misdirection` is not a naming
artifact — the SRD has only the level-2 `Misdirection`, which also ships.

**PF1e (1 entry, 2 records).** `Cloak of Flying`, tagged `Core Rulebook`: absent
from the 590-entry PSRD PF1e Core manifest, from the D&D 3.5 SRD (whose only
flight items are Broom / Carpet / Wings of Flying) and from SRD 5.2. Shipped at
55,000 gp granting fly-at-will; nearest analogue is 3.5's *Wings of Flying* at
54,000 gp. Apparently invented.

**PF2e (11).** The five spells and six equipment rows itemised in 18.5.1.

#### 18.5.3 `wrong-edition-attribution` — 78 records, 73 distinct entries

> **RESOLVED 2026-08-01 — this class is now EMPTY (§26).** The count below is
> the population as first audited; it fell to 68 as the allowlists were widened
> to admit books by their true names and the deleted homebrew stopped shadowing
> rows, then to 0 when those 68 were replaced or removed. The itemisation is
> kept as the record of what was found, not as current state.

Open content, **false citation**. No licence exposure, but the product asserts a
provenance it does not have — the same defect class as §15(c).

- **PF2e equipment (47) and spells (5)** — 18.5.1.
- **5e-2024 monsters (7)** — `Goblin`, `Acolyte`, `Kobold`, `Hobgoblin`,
  `Bugbear`, `Thug`, `Veteran` ship tagged `SRD 5.2`. All seven are verbatim SRD
  5.1 names, all seven also ship from the 2014 loader, and none has a stat block
  in the SRD 5.2.1 bestiary — which names only qualified forms (`Goblin Warrior`,
  `Priest Acolyte`, `Kobold Warrior`, `Warrior Veteran`, …). §15.4 independently
  confirms the content is 5.1 content.
- **5e-2024 equipment (7)** — `Rope, Hempen (50 feet)` (1 gp / **10** lb; SRD
  5.2.1 names it `Rope` at 1 gp / **5** lb, which the loader also ships),
  `Tent, Two-Person`, `Mirror, Steel`, `Hammer`, `Piton`, `Soap`, `Mess Kit`.
  Every one is a verbatim SRD 5.1 adventuring-gear or tool name absent from SRD
  5.2.1 `equipment.md`; the 2024 revision dropped or renamed them.
- **3.5e (1)** — `Bleed`, tagged `SRD 3.5`. No such spell exists in the SRD 3.5
  chapters (the 0-level necromancy spells are Disrupt Undead and Touch of
  Fatigue). The shipped text — *"a living creature that has 0 hit points but is
  still alive … resumes dying"* — is the **Pathfinder 1e** cantrip verbatim.
- **PF1e (3 entries, 6 records)** — `Amulet of Health` and `Cloak of Charisma`
  are **D&D 3.5 SRD** wondrous items that PF1e replaced with `Belt of Mighty
  Constitution` and `Headband of Alluring Charisma` (both of which the loader
  already ships at the source price of 4,000 gp; the 3.5-named entries are priced
  30,000 gp, matching no source). `Cloak of Invisibility` is in neither PF1e Core
  nor the 3.5 SRD but **is** in D&D SRD 5.1/5.2; shipped at an unsourced
  62,000 gp. All three tagged `Core Rulebook`.

#### 18.5.4 The class a name diff structurally CANNOT see

**A name match does not prove provenance, so 173 is a lower bound.** §15(c) is
the proof: 5e-2024's Criminal, Sage and Soldier backgrounds carry *Player's
Handbook* text under legitimate SRD 5.2 names, and the reverse diff scores them
100% covered with zero over-inclusion, because the NAMES are real. Nothing in
this lane changes that. The `wrong-edition-attribution` findings above are only
the cases where the other edition's name *also* differs; every entry whose names
coincide across editions is invisible to a name diff and reachable only by the
field-level comparison of §15 — which today covers 5e monsters and backgrounds
and nothing else.

### 18.6 What this lane did NOT cover

- ~~**M&M 3e equipment (103 suspects) deferred to a concurrent lane.**~~
  **HAND-OFF COMPLETED 2026-07-26.** The prediction above was exact: when the M&M
  equipment lane landed (§17), all 103 records failed — 79 as `SOURCE-TAG DRIFT`
  (that lane moved the tag from `Hero's Handbook` to `Original Content (not SRD)`)
  and 24 as `STALE CLASSIFICATION` (entries it removed). Both were the ratchet
  working as designed. The 24 stale records were removed after confirming the
  entries are absent from the shipped catalog; the 79 were re-recorded against the
  113-name pinned denominator, which is byte-equal in name-set to the SRD-encoded
  tier that lane produced. Result: 64 `genuine-non-open-content`, 7
  `duplicate-alias`, 6 `generic-entry-instantiation`, 2 `undetermined`.
  **Because the SRD tier and the denominator are the same 113 names, every
  correctly-named source entry ships** — so a semantic match can only ever be
  `duplicate-alias` or `generic-entry-instantiation` here, never `naming-variant`.
- **Prose, mechanics and stat fidelity of every classified entry.** This lane
  compared NAMES and, where a classification turned on it, a handful of scalar
  fields (price, weight, rarity, damage, level, range). An entry classified
  `duplicate-alias` or `naming-variant` is *provenance*-clean; it is not thereby
  *content*-clean. Divergences surfaced incidentally and NOT systematically
  audited: the six mismatched 5e duplicate pairs; PF1e `Belt of Strength`
  (30,000 gp vs 4,000), `Wand of Fireball` (7,200 gp where the Core generic rule
  gives 11,250) and the three elemental longswords (8,815 gp vs 8,315); PF2e
  `Keen Rune` (1,400 gp vs CRB 3,000), `Greater Fortification Rune` (14,000 vs
  24,000), `Slick Rune` (450 vs 45), `Hide` armour (AC 3 vs CRB +2), and
  `Ten-Foot Pole` / `Ladder` / `Chain` carrying the wrong edition's price under
  the correct name.
- **Populations with no wired denominator have no over-inclusion measure at all,
  and their absence is not evidence of cleanliness.** `srd:coverage` measures 41
  (system × category) pairs. Everything else is unmeasured: **3.5e equipment**
  and **PF1e classes/feats** (closed-by-no-source), **PF2e archetypes** (no CRB
  entries), **M&M conditions** (no shipped catalog), and every category no system
  wires at all. 3.5e and PF1e are thinnest — four and five wired categories
  against 5e's seven and Daggerheart's nine — so a non-open 3.5e magic item or
  PF1e feat is structurally invisible today. The fix is
  `p1.wire-remaining-denominators`, not this lane.
- **The measurement defects in 18.3 are diagnosed, not repaired.** Nothing in
  `docs/generated/srd-coverage.md` changed: the report regenerates
  byte-identical after this lane's refactor, which is the evidence that the
  refactor is behaviour-preserving — and equally the evidence that the published
  PF1e and PF2e over-inclusion numbers are still not meaningful.
- **Two PF2e classifications rest on weaker evidence than the rest** and say so
  in their ledger records: `Pouch` (name and description match 3.5/PF1e "Belt
  Pouch" and 5e "Pouch", but the shipped 5 cp matches neither price) and
  `Net (fishing)` (d20-SRD name and function; 1 gp matches neither PF1e's 4 gp
  nor CRB `Fishing Tackle`'s 8 sp). `Horn` is the one `genuine-non-open-content`
  record whose actual source could not be identified at all.

### 18.7 Adversarial re-verification (2026-07-26) — what it corrected, and what it says about method

This section's classifications were re-checked by an independent adversarial pass
instructed to **refute** rather than confirm: 6 verifiers over the 79 re-recorded
M&M entries, 4 refutation agents over a stratified sample of the surviving 966,
and one agent tasked with breaking the gate.

**The gate is a proven ratchet.** All five failure modes — `UNCLASSIFIED`,
`BAD CLASS`, `NO EVIDENCE`, `SOURCE-TAG DRIFT`, `STALE CLASSIFICATION` — were
made to fire, each identified by the specific diagnostic naming the tampered key
against a control run, not by bare exit code (which is worthless here, since the
gate was already exiting 1 on the known backlog). Every tamper was reverted and
the file verified byte-identical afterwards.

**A systematic classification defect was found and corrected.**
`genuine-non-open-content` requires absence from **any** cited open-content
source, but several records were established by checking only the entry's *own*
system's sources. Seven records were corrected to `wrong-edition-attribution`
after the counterpart was found **in this audit's own pinned manifest**:

| Record | Prior evidence | Counterpart, in our own pinned denominator |
| --- | --- | --- |
| `Ring of Clumsiness` (2014 + 2024) | "apparently invented" | `pf1e/magic-items`; also a 3.5 SRD cursed item |
| `Cloak of Etherealness` (2014 + 2024) | "DMG wondrous item" | `pf1e/magic-items`; also 3.5 SRD |
| `Horn` (PF2e) | "the 5e SRD has no horn either" | both `dnd-5e-2014/equipment` and `dnd-5e-2024/equipment` |
| `Sledgehammer` (PF2e) | "no sledgehammer in the 5e SRD" | `Hammer, sledge` — the normalizer folds it to `hammersledge`, not `sledgehammer` |
| `Pixie` (5e-2024) | "Monster Manual content" | `pf1e/monsters` and `pf2e/monsters`; the shipped array is the SRD **Sprite**, not the MM Pixie |

This **reduces** claimed exposure: those seven are open content under a false
citation, not unlicensed content. It is also the more useful correction, because
`wrong-edition-attribution` is remediable by re-tagging while
`genuine-non-open-content` may not be remediable at all.

**The verifiers themselves were wrong 25% of the time, and that is recorded on
purpose.** Of 20 claimed Hero SRD counterparts for the M&M entries, **5 were
fabricated** — `Semi`, `Space Shuttle`, `Orbiting Satellite`, `Submarine` and
`Tank` appear in neither the 113-name pinned denominator nor the SRD-encoded tier
(the two are identical name-sets, which is what makes the check decisive). Every
surviving refutation in the table above was therefore re-verified locally against
the pinned manifest before being applied, and refutations resting on external or
live-fetched sources were **not** applied. The lesson generalises: an adversarial
panel is a lead generator, not an oracle, and its output needs the same evidence
standard as the thing it audits.

**Not applied, recorded for follow-up.** `Cap of Water Breathing` (claimed to have
a PF1e counterpart — not present in the pinned `pf1e/magic-items` denominator, so
unconfirmed) and `Captain` (5e-2024; the existing disproof rests on a one-point AC
difference, which cannot establish absence under any name, but no counterpart was
established either). Both keep their current class pending evidence.

## 19. M&M 3e adversaries — the source search, and why nothing was encoded (added 2026-07-28)

**Status: OPEN — a recorded finding, not a repair.** No adversary data was
written. §3's residual asked for M&M 3e adversary data so that RFC 004's
"reference adversaries for the others" stops being half-delivered (Daggerheart
ships them; M&M does not). This section is the search for something to encode
that data *from*, and its result: **no open-content M&M 3e adversary catalog is
reachable from this environment.** Writing one anyway is how §17 and §18
happened.

**Correction 2026-07-28, prompted by the owner.** An earlier revision of this
section, and the summary given for it, said "no open-content source exists".
That was wrong and materially so:

- **`d20herosrd.com` IS the M&M 3e SRD.** `docs/srd-sources.md` names it as the
  Hypertext M&M 3e SRD under OGL 1.0a, and it is the cited source in the header
  of every file in `src/data/mutants-and-masterminds/3e/archetypes/`. Its
  GM-section generic NPCs are open content this product may use.
- **The blocker is environmental, not licensing.** Re-verified twice on
  2026-07-28: every request from this sandbox fails at the agent proxy with
  `CONNECT tunnel failed, response 403`, on the root and the NPC page alike. A
  developer on an ordinary connection can reach it today. This distinction
  changes the owner's options — see 19.4(d), which the original section lacked.
- **M&M is not empty.** 16 archetypes ship and are fully wired (`dataLoader`,
  `getMam3eSheetState`, `MamArchetypeBrowser`, `MamArchetypesTab`, `validation`).
  They are **build templates, not adversaries**: their fields are `description`,
  `features`, `suggestedSkills` and `sourceBook` — no ability scores, defenses or
  power ranks. They cannot be promoted to adversaries without inventing the stat
  data, which is precisely the prohibited move. The gap is real; "no catalog at
  all" overstated it.

### 19.1 What was searched, and what each candidate actually contains

**The upstream this repo already cites.** `frnprt/mm3e-character-creator`
`js/data.js` (`src/scripts/srd-coverage.ts:733`), fetched 2026-07-28. Its
complete set of top-level exports is `ABILITIES`, `ABILITY_COST`, `ADVANTAGES`,
`ADVANTAGE_CATEGORIES`, `AFFLICTION_CONDITIONS`, `COMPLICATION_TYPES`,
`COMPREHEND_TYPES`, `CONDITIONS`, `DEFENSES`, `DEFENSE_COST`, `EQUIPMENT_LIST`,
`IMMUNITY_EXAMPLES`, `IMMUNITY_OPTIONS`, `INSUBSTANTIAL_TYPES`,
`MEASUREMENT_TABLE`, `MOVEMENT_TYPES`, `POWER_DESCRIPTORS`, `POWER_EFFECTS`,
`POWER_EFFECT_TYPES`, `POWER_EXTRAS`, `POWER_FLAWS`, `SENSES_TYPES`, `SKILLS`,
`SKILL_COST`. **There is no NPC, adversary, villain, minion or archetype array
in it.** It is a character-building component list; no stat block can be derived
from it without inventing one.

**d20HeroSRD.** The human-readable Hero SRD already cited at
`docs/srd-sources.md:50` does publish an NPCs section (`/9-gamemastering/npcs/`,
generic entries such as Criminal Minion, Mob Boss, Bruiser). Two things
disqualify it as an encoder input, before the licensing question in 19.2 is even
reached. It is HTML-only with no machine-readable mirror. And **it is not
reachable** — every request to `d20herosrd.com` from this environment fails at
the network proxy with `CONNECT tunnel failed, response 403`, so `curl` and the
fetch tooling both fail before touching the site. Every encoder under `scripts/`
reads a source verified fetchable at encode time. Encoding an unreachable HTML
site means transcribing from recall, which is the precise failure mode §15 and
§18 exist to stop.

**Foundry VTT M&M 3e systems**, cloned and inspected 2026-07-28.
`Deyzeria/foundrymnm3e` declares `"packs": []` in `system.json` and ships only
advantage and power data under `json/`. `jonnyguio/foundryvtt-mutants-and-masterminds`
has no packs directory at all. `Ikaguia/mnm3e` ships `packs/advantages.db` and
`packs/power-effects.db` and nothing else. **None ships an NPC or adversary
compendium**, and the MIT licence in each explicitly excludes pack content from
its grant — so even where pack data exists it carries no usable licence.

**`SkySpiral7/Humans-and-Heroes`** is the one machine-readable superhero-RPG NPC
catalog the search found (37 character JSON files under
`examples/characters/*/js/`, grouped animals / civilians / constructs /
public-servants / super-heroes / trained-combatants / underworld-archetypes). It
is **not M&M 3e**. It is a CC BY-SA 3.0 *fork* with divergent rules — its stat
blocks carry a `transcendence` field M&M has no concept of — so shipping it as
`mam3e` data under a Hero's Handbook citation would be committing §17's
false-citation defect deliberately, and shipping it as faithful M&M content would
be §15's. It is also not clean on its own terms: `other-works/js/Mewtwo.js` is a
third-party IP character sitting inside the same catalog. Adopting it would
further import a **ShareAlike** obligation that no other source in this repo
carries.

### 19.2 What the M&M licence actually permits — a correction owed

`src/utils/openContentPolicy.ts:70-80` and `src/legal/attributions.ts:196` both
state that the **sole** Product Identity in M&M 3e is the branded resource terms
"Hero Points" and "Power Points". That is incomplete, and the omitted clause is
the one that governs this section. Green Ronin's designation, as printed in the
M&M books and reproduced consistently across editions, also declares Product
Identity: *all characters and their associated images, descriptions, backgrounds,
and related information.*

An adversary catalog is a set of characters with descriptions and backgrounds.
The *mechanics* a published NPC is built from — effect ranks, modifier maths,
the cost tables — stay Open Game Content and are already shipped. The NPC **as a
character** is on the other side of the line. d20HeroSRD's maintainer publishes
the generic NPCs anyway; that is a fan site's reading, not the publisher's grant,
and it is not a reading to adopt silently while §11 OC-1 and §18's 31 records are
still waiting on an owner decision about a narrower question.

A corroborating signal is already in the tree: `docs/srd-sources.md:50` records
that d20HeroSRD renames "Hero Points" to "Victory Points" and "Power Points" to
"Character Points". The site does scrub Product Identity where scrubbing is
possible. It does not scrub the character write-ups, because scrubbing a
character is deleting it.

**Owed, not done here:** those two comments should be corrected to state the
character clause, whether or not any adversary work ever proceeds. This lane
wrote no code, and editing a published legal attribution is an owner-visible
change rather than an audit's to make.

### 19.3 The data set someone will reach for next — and why it does not close this

`src/data/mutants-and-masterminds/3e/archetypes/` ships 15 archetype modules,
loader-wired at `src/utils/dataLoader.ts:752`, counted at
`src/scripts/generate-roadmap-metrics.ts:741`, each citing a real per-archetype
d20HeroSRD URL (`.../archetypes/battlesuit.ts:23`). The Hero's Handbook's own
archetypes chapter says the archetypes double as ready-made villains, so this
looks like the shortest path to closing §3's residual. It is not, for two
independent reasons.

- **They are not stat blocks, and the type forbids them from becoming one.**
  `Mam3eArchetype` (`src/types/mam/archetypes.ts:14`) carries `id`, `name`,
  `source`, `description`, `suggestedSkills` and `features` — no abilities, no
  defenses, no power level, no attack. That narrowness is deliberate and
  recorded (`docs/srd-manifest/_exclusions.ts:47`,
  `mam3e.archetypes.reference-only`). Nothing typed this way can be fielded as a
  scene combatant the way `DaggerheartAdversary` (`src/types/daggerheart.ts:257`)
  is.
- **Their content does not come from the URL they cite.** Every one of the 15
  files is roughly 46 lines. `battlesuit.ts` claims `sourceBook.page: 1` and
  carries a one-line description plus two features ("Powered Armor", "Weapons
  Array") that read as authored, not transcribed; the published archetype is a
  full PL10 build. This is §18's defect class — a genuine citation attached to
  content that did not come from it — in a data set the provenance audit did not
  cover (§17.2 names archetypes among the untreated M&M sets). **It is a live
  defect regardless of what is decided about adversaries.**

### 19.4 The honest options

Ranked by how much each asks of the owner. None was taken here; taking one is an
owner decision.

- **(d) Fetch the SRD from an environment that can reach it — RECOMMENDED, and
  newly available since this section was written.** The content is open, the
  source is already cited by this repo, and the only obstacle is that CI and this
  sandbox are proxy-blocked from `d20herosrd.com`. Someone on an ordinary
  connection can pull the GM-section NPCs once; the encoder then runs offline
  against a pinned local copy, exactly as `scripts/encode-mam-equipment.mjs`
  already does against a pinned upstream. This makes (b) unnecessary and is
  strictly better than (a): it closes §3's residual with genuinely open content
  rather than by recording an absence. The pinned-copy pattern also means the
  proxy block never has to be solved in CI.
- **(a) Ship nothing, by recorded decision.** Close §3's residual the way 3.5e
  equipment was closed for a structurally identical reason
  (`src/scripts/srd-coverage.ts:722` — no clean source, and honest absence beats
  a poisoned denominator, so no target was wired). Cost: M&M 3e stays the one
  system with no fieldable opposition, and §3 never reaches CLOSED on content.
  Reversible the day a source appears.
- ~~**(b) Ship clearly-labelled original content, the way §17 did for
  equipment.**~~ **FORECLOSED 2026-07-30 (§17.3).** This option rested on the
  `originalContentSources` channel, the `Original Content (not SRD)` label and
  the `original` manifest status. All three are deleted, along with the 106
  entries that used them, by owner decision: this app transcribes open documents
  and does not author game content. The concern §17.2 raised about that
  footing — hand-written, unaudited, no upstream to check against — is exactly
  why. Authoring adversaries is not on the table; (d) or (a) is the choice.
- **(c) Repair 19.3 first, independently.** The 15 archetypes should stop citing
  per-page d20HeroSRD URLs for content that is not on those pages — either
  re-sourced (blocked by 19.1's reachability finding) or relabelled through
  (b)'s original-content channel. This is owed whichever of (a) or (b) is chosen,
  and it is the smallest piece of real work named in this section.

What is **not** an option: encoding from `Humans-and-Heroes`, from a Hero's
Handbook PDF, or from recall. Each of those produces exactly the artifact §15 and
§18 were opened to remove, and this time it would be produced knowingly.

### 19.5 The search was run to exhaustion 2026-08-01 — option (d) is dead

The owner attempted (d) directly and could not locate NPC stat blocks on the
site. A systematic search of every GitHub-reachable source followed, since
`raw.githubusercontent.com` is the only fetch route this sandbox has
(`d20herosrd.com`, `d20pfsrd.com`, `aonprd.com`, `web.archive.org` and every
proxy tried all return 000).

**Every Foundry VTT M&M 3e system on GitHub ships EMPTY compendium packs.**
Verified by fetching each `system.json`: `jonnyguio/foundryvtt-mutants-and-masterminds`,
`matthewswar/foundryvtt-mutants-and-masterminds` (`"packs": []`),
`Deyzeria/foundrymnm3e` (`"packs": []`), `Zakarik/foundry-mm3` (no `packs` field).
Nobody has published an M&M 3e bestiary for the one platform whose whole format
is shipping creature compendia. The character builders are the same story —
`mcherm/hero-sheet` LINKS OUT to `d20herosrd.com` rather than embedding content.

**One repo does carry real stat blocks, and it is disqualified — this is the
finding worth keeping.** `thomasjeffreyandersontwin/mm3e-online-holistic`
(`context/HeroesHandbook-statblocks.md`, 221 KB) holds Battlesuit, Paragon,
Powerhouse, Speedster and ~44 more with full numeric traits. It is unusable:

- **No `LICENSE`, `NOTICE` or `OGL.txt`** — all 404. README is a blank stub. The
  strings "Open Game Content", "OGL" and "d20herosrd" appear nowhere in the repo.
- `context/rules/` chunks the **entire Deluxe Hero's Handbook** into ~260 RAG
  fragments. That is a digitization of the whole copyrighted book, not a curated
  OGC excerpt.
- The stat-block file itself interleaves named **Product Identity** — `Dr. Simian`,
  `Marmo-Set` and setting narrative — which is proof no OGC/PI distinction was
  ever drawn. It is an OCR dump of a purchased book.
- `GuiMayer/mm3e-builder` carries an independent copy of the same chapter under
  the same absent licence.

Using either would be exactly the artifact this section already refuses, and a
worse one than §17's: that content at least had a truthful label. **106 entries
were deleted on 2026-07-30 for weaker cause than this.**

**The sharper form of the gap, now established.** The stat blocks that exist are
for the SAME 16 archetypes this product already ships as build templates. So the
gap is not "M&M has no adversaries" — it is **"our archetypes have no stats, and
the only reachable copy of those stats is an unlicensed scrape."** Worse, nothing
reachable can establish whether that chapter is Open Game Content at all: no repo
mirrors or enumerates d20herosrd's OGC boundary, so even the scrape gives no
evidence either way about the licence.

**Consequence: option (d) is exhausted and option (a) is taken** — see §19.4.
Recorded as a source limitation rather than a search failure, because the data
was FOUND and REFUSED on licensing grounds. If someone later establishes that the
archetype chapter is OGC and pins a licensed copy, this reopens immediately; the
16 archetypes are already wired and would only need their scores.

---

## 20. The first full-chain green run — what twelve never-executed gates actually proved (added 2026-07-28)

**Status: CLOSED for the run itself; two residuals named at the end are OPEN.**

Recorded because a gate that has never executed is not evidence, and until
2026-07-28 twelve of this repo's gates had never executed on the branch that
changed them.

### 20.1 The chain had been failing before it reached them

Three CI runs died early enough that the later steps never ran at all:

| Head | Where it stopped | Why that hid things |
| --- | --- | --- |
| `2fd3380` | `check:bundle-size` | Aborted the chain; nothing after it ran. |
| `3daff1f` | cancelled at 29.5 min, mid `test:e2e` | The 30-min job timeout (`.github/workflows/ci.yml`) reports the run as *cancelled* and swallows the failure summary. `playwright.config.ts`'s own comment predicts this exact masking, and it happened. |
| `60c3745` | last e2e test | Still short of the twelve. |

Run `30341196839` on `ebc9e7a` is the first to complete the whole of
`npm run verify`. The gates that had never run and now pass: `test:e2e`,
`check:repo-hygiene`, `check:generated-docs`, `check:doc-drift`,
`check:dead-code`, `check:legal-notices`, `check:compute-register`,
`check:rules-provenance`, `check:srd-fidelity`, `check:mam-equipment`,
`check:provenance-over-inclusion`, `check:secret-exposure`.

Two of those matter more than the rest:

- **`check:dead-code`** shipped *unverified*. knip OOMs in this container, so the
  `knip.json` → `knip.jsonc` change (dropping test files as entry points) was
  reasoned rather than run, and two specific failure modes were predicted in
  writing: knip 5's auto-enabled vitest plugin re-admitting test files through its
  additive `entry` patterns, and the `.jsonc` rename silently falling back to
  default config. **Neither occurred.** The reasoning was right — but it was still
  the gate, not the argument, that settled it.
- **`check:provenance-over-inclusion`** now runs as a real CI gate, so the rescued
  1,045-entry audit (§18) is enforced rather than merely committed.

### 20.2 Three fixes, and one of them is a defect class

**(a) A shared formatter crashed the app, and it is the second instance of the
same shape.** `formatCastingTime` declared `ct: CastingTime` non-optional and read
`ct.amount` unguarded. `loadSpellsForSystem('mam3e')` returns `loadMam3ePowers()`
(`src/utils/dataLoader.ts:631`) — an M&M power has no casting time at all — so the
Dock took the whole page into its error boundary the moment it re-keyed to M&M.

`formatItemCost` had been written for the identical problem *one commit earlier*
(M&M prices gear in Equipment Points; Daggerheart may carry nothing), and the Phase-5
eviction that made the Dock the single browse route hardened `cost` and missed
`castingTime`. The lesson generalises: **collapsing seven per-system wrappers into
one shared browser moves every runtime shape divergence onto the shared formatters
at once**, and the declared types cannot see it because the shape only diverges per
system at runtime. Absence is a legitimate value here, not a content defect — so
the remedy is a fallback, not a null check that would silence a real data problem.
Tracked forward as `WORK_PLAN` §6.6.

**(b) Bundle budgets moved in both directions.** `totalJsGzipBytes` 1664 → 1680 KiB
(measured 1,710,182 B, 6,246 B over the old ceiling), and `eagerShellGzipBytes`
**ratcheted down** 192 → 176 KiB (measured 172,441 B, 24,167 B under). Raising the
first without lowering the second would have left the lazy-engine reclaim (§16)
unguarded — a budget that only ever loosens stops being a budget.

**(c) Two e2e specs were stale against changes made in this repo.** The 5e-2024
smoke test still clicked an in-sheet Feats tab that commit `3cdfbbb` had deleted
(that lane updated the M&M and 3.5e/PF1e specs and missed this one), and the
scene-import test reset only `localStorage` after scenes gained a durable
IndexedDB tier. Both are the same failure: a change updated some of its dependents.

**(d) Not in CI, but found while debugging it:** `vitest.config.ts` was collecting
tests out of `.claude/worktrees/**`, so agent worktrees inflated a local run to
26 files / 388 tests / 102 s where the real figure was 4 / 32 / 7.8 s. Excluded.

### 20.3 What is still open from this section

- **The orphaned copy.** `"Feat automation applies ability score increases and
  proficiencies"` in `src/utils/documentationCopy.ts` had exactly one renderer,
  `Dnd5eFeatBrowserTab`, deleted by the Phase-5 eviction. Nothing renders it now,
  so the eviction silently dropped user-facing explanation. It is recorded in
  `e2e/system-smoke.spec.ts`. Wire it into the Dock's Feats tab or delete it —
  **owner decision**, because it is a product-copy question, not a cleanup.
- **No test pins the shared-formatter contract.** The crash was caught by an e2e
  smoke test, and only because it took down the entire page. A per-system fixture
  test over one shared browser row would have caught it at unit level. See
  `WORK_PLAN` §6.6.

---

## 21. Wall-clock assertions cannot be gates under parallel workers (added 2026-07-28)

**Status: CLOSED for the one instance that existed.** Recorded because this is
the *second* gate in this repo to hit the same wall, the first one reached the
right answer and the lesson was never generalised, and the next person adding a
performance gate will reach for `performance.now()` again.

### 21.1 What happened

Restoring vitest parallelism (§20.2, `maxWorkers: 4`) made
`src/__tests__/drag/gateBudget.test.tsx` fail about **1 run in 3** under CPU
contention. It asserted `performance.now()` deltas against
`RECONCILE_BUDGET_MS = 50`. The reconcile had not regressed; four workers were
sharing four cores.

**A millisecond assertion cannot distinguish "the code got slower" from "the
machine was busy."** That is not a flaky test to retry — it is an instrument
that does not measure the thing the gate is about, and under any real
parallelism it produces both false failures and (on an idle runner) false
passes.

### 21.2 The repo had already solved this once

`check:keepalive-budget` counts **DOC writes, not wall-clock**, and
`docs/MASTER_PLAN.md` records exactly why: the timing spread observed there
(12.6–48.5 ms for four attribute writes) was "an order of magnitude above the
signal". That gate was made deterministic on purpose. `gateBudget` never got the
same treatment, and nothing pointed from one to the other — so the conclusion sat
in the plan while a second gate shipped with the defect the plan describes.

### 21.3 What replaced it, and why it is stronger

The test's own header always said the intent was that "the reconcile does a
bounded amount of synchronous work over 900 cells". Wall-clock was only ever a
proxy for *bounded work*. The instrument is now the work itself:

- **DOM mutations are counted** during the drop reconcile via a
  `MutationObserver` drained with `takeRecords()`, which is synchronous and so
  has no dependence on how loaded the machine is. **Measured: 1 mutation**, for
  both sub-gates.
- **Scale invariance is asserted** — the same drop runs on a 100-cell grid and a
  900-cell grid and the counts must be **equal** (1 and 1). This is the real
  invariant the millisecond budget was gesturing at: a regression that made the
  drop touch every cell would pass a 50 ms budget on an idle machine and fail
  this one on every machine.
- **The absolute ceiling came down 50 ms → 8 mutations**, set from the measured
  1 rather than guessed. The old budget would have accepted a 40× regression.
- **The counter self-checks**: a test asserts it returns 0, 1 and 25 for 0, 1
  and 25 real DOM insertions. A silently-zero counter would have made the whole
  file pass regardless of the reconcile — the "gate that cannot fail" shape this
  file exists to catch.

`SpikeGrid` gained optional `width`/`height` (defaulting to the 30×30 spike) so
the two sizes can be rendered. It is test-only and not in any shipped chunk.

### 21.4 The rule worth carrying

**A gate may not assert on wall-clock in the unit suite.** Time is a legitimate
thing to *record* — both sub-gates still `console.info` their counts — but the
assertion has to be on something deterministic: counted operations, counted
mutations, or an invariant like scale-independence. Real-paint timing is a
Playwright concern where the budget is about a frame, not a proxy.

The generalisable half: when a gate is flaky under parallelism, the question is
not "what timeout makes it pass" but "is this instrument measuring the property
I am gating on". Here it was not, and the replacement is both deterministic and
sharper than the thing it replaced.

---

## 22. A keystone acceptance that had never executed, and the defect it was hiding (added 2026-07-28)

**Status: CLOSED.** Recorded because this is the *third* instance of the same
shape in four days — §12/§6.4's quarantined a11y scan, §21.3's silently-zero
counter, and now this — and because it is the first one where the never-run gate
turned out to be hiding a live product defect rather than a stale note.

### 22.1 The gate could not fail, and said so in its own header

`e2e/scene-drag.spec.ts` is the Phase-4 pointer-drag keystone acceptance. It
opens with:

```ts
const FLAG_ON = process.env.VITE_SCENE_DRAG_ENABLED === 'true';
test.skip(!FLAG_ON, 'scene-drag flag is off in this build');
```

**No workflow set that variable.** Its own header says the spec "is skipped
unless a dedicated CI job builds with the flag on", `MASTER_PLAN`, `WORK_PLAN`
and both design docs each said the job did not exist — and none of that
registered as a defect, because the pipeline was green.

The mechanism that made it green is worth stating flatly: **Playwright exits 0
on a file where every test skipped.** The run reports "2 skipped", the job
passes, and the summary line scrolls past. Nothing distinguishes "this
acceptance held" from "this acceptance was not attempted".

### 22.2 Its first-ever execution failed, on shipped behaviour

Test 1 passed. Test 2 — drag a bestiary monster onto the grid — failed with no
allegiance chip. The failure screenshot showed the Dock on **D&D 5e (2024)**
while the scene was **D&D 5e (2014)**.

`Dock` re-keys its catalogs to `activeSystemId`, and `src/App.tsx` passed
`currentDoc?.systemId` — the open **sheet's** system. A scene never set it, so
with a scene open the Dock held whatever it had, defaulting to the first
registered system. A new scene defaults to 5e-2014. The two disagree in the
default state.

**The user-visible behaviour: dragging a monster from the Dock into a scene of a
different system does nothing at all — no token, no chip, no error, no console
message.** The drop is rejected on a system mismatch the user cannot see and was
never told about.

Causation was established by a one-variable experiment rather than by reading:
aligning the Dock's system selector to the scene's, changing nothing else, makes
the identical drag land its token. Fixed by preferring the open scene's
`systemId` over the open sheet's (`src/App.tsx`).

### 22.3 The gate now runs, and asserts it ran

`.github/workflows/ci.yml` gained a `scene-drag` job: build with
`VITE_SCENE_DRAG_ENABLED=true`, run the spec against that dist with
`PLAYWRIGHT_PREBUILT=1`, then parse Playwright's JSON report and **fail if any
result is `skipped`**.

That last step is the part that matters. The exit code is precisely the signal
that failed to notice this for months, so the job does not rely on it. Both
directions were validated locally before landing:

| condition | playwright exit | assertion exit |
| --- | --- | --- |
| flag on — 2 specs executed, both passed | 0 | 0 |
| flag absent — 2 specs skipped | **0** | **1** |

A separate job rather than a step in `verify`, because the flag is a *build*
input (the drag provider is tree-shaken out of a flag-off bundle) and `verify`'s
dist is what the deploy jobs consume. It runs in parallel, off the critical path.

### 22.4 Siblings, swept rather than assumed

Per the rule in `docs/MASTER_PLAN.md` — *when you fix a class of defect, grep for
its siblings before you close it* — every `test.skip` / `test.fixme` in `e2e/`
and `src/__tests__/` was checked:

- `e2e/pwa-offline.spec.ts` skips on `browserName !== 'chromium'`. The chromium
  project always runs, so the test executes. **Legitimate**, not vacuous.
- `e2e/a11y.spec.ts`'s `test.fixme` was the §12 quarantine, un-quarantined
  earlier the same day (it was hiding a real WCAG AA failure).
- No other skips exist.

**Phase 6's `VITE_SCENE_CANVAS_ENABLED` still has no job, and that is
deliberately not filed as the same defect:** `e2e/scene-canvas.spec.ts` was never
written, so nothing claims to gate it. An absent gate is visible in the docs; a
skipped one is invisible behind a green check. Only the second shape is what this
section is about.

### 22.5 The rule worth carrying

**A gate whose skip condition depends on configuration must assert that it
actually ran.** Three variants of this have now shipped here — a quarantined
test, a counter that could return zero, and a spec nobody set the flag for — and
each was found by hand rather than by any check. The common failure is that the
absence of a signal reads identically to a passing signal.

Where a gate can be trivially self-checking (the mutation counter in §21.3), make
it self-check. Where it cannot, assert on the run report rather than the exit
code, as §22.3 does.

---

## 23. Technical-debt sweep — what was actually found (added 2026-07-28)

**Status: CLOSED.** Recorded because two of the four findings are corrections to
claims this repo had already written down and believed.

### 23.1 The classic debt metrics are clean, and that is the useful result

Measured rather than assumed, across `src/` excluding `src/data/` and tests:

| metric | count | assessment |
| --- | --- | --- |
| `as any` | **0** | — |
| genuine `: any` | **1** | `withErrorLogging<T extends (...args: any[]) => Promise<any>>` — the idiomatic signature for a function wrapper. |
| `@ts-expect-error` / `@ts-ignore` | 4 | All in `shellReducer.test.ts`, all *deliberate negative type tests* asserting bad input fails typecheck. Not suppressions. |
| `eslint-disable` | 10 | 8 carry a `--` reason. The 2 `react-hooks/exhaustive-deps` were read in full (below). |
| `TODO` / `FIXME` / `HACK` | **0** | — |
| skipped tests | 1 legitimate | See §22.4. |

The two `exhaustive-deps` suppressions were checked against reality rather than
taken at their word. `CreationWizard.tsx`'s says *"loadOptions only depends on
the system id"* — and every shipped `loadOptions` (in `dnd5e`, `pf2e` and
`d20-legacy` creation plans) is declared `async (): Promise<CreationOption[]>`
with **zero parameters**, so it is true, and in fact stronger than stated. Left
alone. **It is worth knowing this is convention, not enforcement:** the type
permits `loadOptions(document)`, the effect passes the document, and a future
implementation that reads it would go stale with nothing to catch it.

**This repo's debt is not in its type surface.** It is in claims that nothing
checks — which is what the rest of this section, and §21 and §22, are about.

### 23.2 CLAUDE.md made checkable claims and was outside the gate

`docs/doc-drift.manifest.ts` gates README.md and CONTRIBUTING.md. `CLAUDE.md`
was not in `ROOT_DOC_FILES` at all, so **none** of its claims were checked —
while it is the one root document injected verbatim as project instructions at
the start of every agent session. Errors in it are acted on, not just read.

It had drifted, in both directions the gate exists to catch:

| claim | actual | kind |
| --- | --- | --- |
| `src/data/` holds **505 files** | **512** | count |
| an RFC range ending at 006 | 001 through **007** exists | path/range |
| "~400k LOC" | ~459k | count (removed rather than re-pinned; see below) |

Its own text predicted this: *"`package.json` is the authority — this list is a
summary and has drifted before."*

**Now gated** with `count_rule`, `command_rule` and `path_ref_rule`. Three new
count rules pin the system count, the data-file count, and the length of the
verify chain, with two new derived truths (`dataFileCount`, `verifyGateCount`) —
both computed, never transcribed. All five rules were **mutation-tested**: each
was individually broken and confirmed to fail the gate, then restored.

The LOC figure was deleted rather than corrected. It cannot be gated at
reasonable cost (it moves on nearly every commit), and an ungated number in this
file is precisely what created the problem. The sentence now makes the same
point — most of the repo is generated data — using the gated file count.

A fourth claim was ambiguous rather than wrong: the architecture map listed nine
directories under `src/systems/` as "per-system engines and sheets" while the
header said seven systems. `GameSystemId` has seven members; `d20-legacy` and
`shared` are shared engine code. The map now says so explicitly.

### 23.3 `knip.jsonc` documented a safeguard that does not work

The config carried a long, confident comment stating that its `.claude/**`
ignore entry PREVENTS knip from OOMing on agent worktrees, and that the entry
was therefore load-bearing and must never be removed.

**Measured on this tree, with that entry present throughout:**

| state | result |
| --- | --- |
| 41 agent worktrees present (5.9 GB) | `FATAL ERROR: Reached heap limit`, exit 134 |
| same tree, worktrees removed | exit 0 in **7.8s** |

So the ignore entry does not stop the traversal it is documented to stop. The
real remedy is removing the worktrees. The comment is corrected in place; the
entries are kept, because they still suppress reporting noise and cost nothing —
but they are no longer described as a safeguard.

**This was not academic.** `check:dead-code` is step 16 of 22, and an OOM there
aborts the chain, so steps 17–22 (coverage, keepalive-budget, compute-register,
build, bundle-size, e2e) **could not be run locally at all** while the worktrees
were present. A full local `npm run verify` was impossible and the failure looked
like a knip problem rather than a disk-hygiene one.

Cleanup was done conservatively: every worktree was checked for uncommitted and
unpushed work first. One had 11 modified files (the over-inclusion audit), which
was diffed against `main` and found **strictly superseded** — its 24
worktree-only entries were all classified `undetermined`, `main` had 84 entries
*re-classified* beyond it, and zero entries existed only in the worktree. It was
archived anyway before removal. Local branch count was 113 before and 113 after:
**removing a worktree does not delete its branch.**

### 23.4 A missing dependency was hidden by a harness mistake, not by the repo

`typecheck:netlify` failed with `TS2307: Cannot find module '@ai-sdk/anthropic'`.
The package is declared in `package.json`, present in `package-lock.json`, and
imported by `netlify/functions/anthropicAdapter.mts`; it was simply absent from
this container's `node_modules` after a container recycle. `npm ci` restored it
and the gate went green. **No repo defect** — recorded only so the next person
who sees it reaches for `npm ci` instead of editing the adapter.

The mistake worth recording is mine: the failure was initially reported as a
**pass**, because the run was backgrounded as `npm run verify > log; echo
"EXIT=$?" >> log` and the harness reported the exit code of the trailing `echo`.
A command that always exits 0 will always look green. Same shape as §22 — the
absence of a signal reading identically to a passing one — arrived at from the
tooling side rather than the test side.

### 23.5 The status gates had a hole, in the direction that costs a lane

`ledger_status_rule` (§added 2026-07-28, `WORK_PLAN` §6.7's sibling) catches a
ledger entry whose own detail contradicts its status. `blocked_ref_rule` catches
a `BLOCKED on §X` that outlives §X. Neither could see the drift that actually
happened next:

> `docs/WORK_PLAN.md` §2.5 queued `p1.single-entry-gaps` as *"small, itemised,
> good filler. **CHEAP**"* while `docs/master-gap-ledger.source.ts` already
> recorded it `status: 'done'`, CLOSED, with four entries verified against the
> loaders and `srd-coverage.md` reporting 0 missing in all four owning
> categories.

The plan is where you look to find out what is left, so a finished item sitting
there reading CHEAP costs the next lane a scoping pass on completed work — and
reads as authoritative while doing it.

**`ledger_ref_rule`** closes it: every ledger id cited in the plan is resolved
against the ledger, and a `done` item on a line that is neither struck through
nor carrying a resolution marker fails the gate. Only `done` is checked — listing
open items is exactly what a plan is for.

Confirmed on the live repo in both directions: the rule went red on the real
`p1.single-entry-gaps` bullet before it was fixed, green after, and red again
when the bullet was experimentally re-opened. A scan of the whole plan against
the whole ledger found **exactly one** instance, so this was a hole rather than a
pattern — but it was a hole with nothing watching it.

Three unit tests pin it, including the false-positive guard that killed the first
draft of `ledger_status_rule`: struck-through and `**DONE**`-marked citations
must stay silent, and open items must stay silent regardless of wording.

### 23.6 …and a third hole, between a heading and the body under it

Both rules above compare a status against something **elsewhere** — a ledger
entry against itself, plan prose against the ledger. Neither compares a HEADING
against the body directly beneath it, and two headings had drifted that way:

| heading | body underneath |
| --- | --- |
| `§6.6 … — **READY, CHEAP**` | opens `~~**The work:**~~ **DONE 2026-07-28.**` |
| `§7 Dead code and hygiene — **READY, CHEAP**` | §7.0, §7.1 and §7.2 all closed |

Both advertised dispatchable work that did not exist. A scan of every heading in
`WORK_PLAN`, `MASTER_PLAN`, `STATUS`, `VISION` and both design docs found only
these two, plus one in the **opposite and more dangerous** direction: `§4.3 Sheet
eviction — **DONE, four wrappers kept with reasons**` sat above a body whose
first item is an open owner decision. All four headings are corrected.

**`heading_status_rule` gates one of the three, and the limit is the point.** It
keys on this repo's explicit `~~**The work:**~~ **DONE**` idiom. An earlier draft
matched any `**DONE` anywhere in a body and immediately false-positived on §2.5 —
one of three bullets closed, section legitimately open — which is the gate crying
wolf, and the same mistake `ledger_status_rule`'s first draft made. Narrowing it
means "every subsection beneath this heading is resolved" (§7) and "this DONE
heading hides an open decision" (§4.3) stay **ungated and documented as
ungated**, rather than gated badly.

`docs/GAPS.md` is deliberately outside this rule. Its convention is a
self-qualifying `**Status:**` line (`PARTLY CLOSED`, `CLOSED for the run itself;
two residuals named at the end are OPEN`), and all 22 were checked by hand while
writing this — none contradicted its section. A heading-shaped rule pointed at it
would produce noise and nothing else.

---

## 24. Denominator B could only ever read 100% (added 2026-07-29)

**Status: CLOSED for the metric; the Tier-B anchoring tail is OPEN.**

Recorded because this is the **same defect this repo already found, diagnosed and
fixed once** — in the other denominator — and nobody transferred the lesson.

### 24.1 The number was structurally incapable of failing

Every system published **100% compute completion**: 47/47, 41/41, 33/33, 26/26,
29/29, 26/26, 33/33. It read 100% because the register only ever contained rows
that were already `verified` — the same ids on both sides of the ratio.

§6 of this file records the identical shape in Denominator A. Committing the
per-system SRD manifests "created a circular denominator — the same ids on both
sides of the ratio, which could only ever read 100%", and the fix was to demote
the manifests and measure against an independent networked reverse diff. That
write-up is nine sections above this one. The same pathology sat in Denominator B
untouched, and `docs/WORK_PLAN.md` §3.1 described it as merely "a curated subset
… an uneven target" — true, and a serious understatement of a metric that could
not report anything but success.

**This is the strongest instance yet of the rule in `docs/MASTER_PLAN.md`: when
you fix a class of defect, grep for its siblings.** The sibling here was not a
config line or a test helper. It was the other half of the project's two headline
numbers.

### 24.2 What the enumeration found

The eight missing (system, layer) pairs were worked by a 10-agent workflow —
5 proposers, then 5 **adversarial verifiers** briefed to refute rather than
agree, each independently opening the cited source, the cited test and the
claimed engine line. 61 of 64 proposed entries survived.

The three rejections are why that stage existed:

| rejected | why |
| --- | --- |
| `dnd5e2014.L10.class-starting-wealth` | **Fabricated repo-state claim** — asserted what code reads a field; the verifier opened the files and it was false. Flagged as "the worst failure in this proposal." |
| `dnd5e2014.L10.encounter-multiplier` | **Non-open-content citation** — sourced to the 2014 DMG encounter tables, which are not SRD. |
| `daggerheart.L5.spellcast-passive-bonus` | Duplicate of the existing `daggerheart.L2.passive-bonuses` row. |

§18.7 records an earlier panel in this repo inventing 5 of 20 M&M counterparts —
a 25% fabrication rate. One fabrication in 64 got caught here **before** it
reached a file. The verify stage is not optional on content work in this repo.

**And it was still not enough — this is the part worth carrying.** All 61
survivors were written to the registers, and then `check:rules-provenance`, a
gate the agents never ran and were never told about, **rejected 8 more**:

| rejected by the provenance gate | why |
| --- | --- |
| `dnd35e.L10.el-value-scale`, `.wealth-by-level`, `.monster-xp-award` | cite 3.5e **DMG** tables (EL scale, Table 5-1, Table 2-6) never released as Open Game Content. The proposer *knew* — it wrote "NOT CITABLE" into the `source` field and marked them `flagged` — but a row whose `source` is a paragraph explaining that no source exists is not a citation. |
| `dnd5e2014.L10.encounter-xp-budget`, `.encounter-spend` | cite **SRD 5.2.1**, which is the *2024* SRD, inside the **2014** register. Right rule, wrong edition, wrong system. |
| `dnd5e2014.L10.monster-encounter-cost`, `mam3e.L6.speed-rank-from-effect` | name entries absent from their system's open-content corpus. |

All 8 were **removed**, not quarantined. The gate has an allowlist for recording
unsubstantiated citations with evidence, and using it here would have been
weakening a gate to admit my own work — the precise move this file exists to
catch. 53 of 61 landed.

**The transferable point: an adversarial agent panel is not a substitute for the
repo's own gates.** Five hostile verifiers, briefed to refute and given the
fabrication history, passed 8 citations that a deterministic checker caught in
one run. Agent review and mechanical gates fail on different axes — run both, and
run the mechanical one last.

`mam3e` L5 came back `applicable: false` and the verifier upheld it: M&M 3e has
no spellcasting economy of any kind. **A layer that does not exist for a system is
an honest structural absence, not a gap** — and the workflow briefed that answer
as a win precisely so agents under pressure to produce would not invent one.

### 24.3 The first honest numbers

| system | before | after |
| --- | --- | --- |
| daggerheart | 26/26 = 100% | **35/52 = 67.3%** |
| mam3e | 26/26 = 100% | **26/34 = 76.5%** |
| dnd-3.5e | 32/32 = 100% | **32/37 = 86.5%** |
| dnd-5e-2024 | 41/41 = 100% | **44/50 = 88%** |
| dnd-5e-2014 | 47/47 = 100% | **48/51 = 94.1%** |
| pf1e | 33/33 = 100% | 33/33 = 100% |
| pf2e | 29/29 = 100% | 29/29 = 100% |

**The verified COUNT went up, 234 → 247.** The percentages fell because the
denominator finally admits the quantities the rules define that the engine does
not yet compute. pf1e and pf2e hold at 100% because they were the two systems that
genuinely already enumerated all ten layers — theirs was the only ratio that ever
meant anything.

`check:compute-register` Tier A **demoted zero** new `verified` entries: each
resolves to a real, exactly-named, passing test. The Tier-A gate is the check that
matters more than the proposal.

**All seven systems now span L1–L10, with one honest exception**: `mam3e` has no
L5, because M&M 3e has no spellcasting economy — no slots, no points, no per-rest
casting resource. A layer that does not exist for a system is a structural
absence, not a gap, and the workflow was briefed to treat that answer as a win so
that an agent under pressure to produce would not invent one.

### 24.4 The Tier-B tail — closed the same day

This section originally ended by recording the new entries as `unanchored`:
Tier-A clean, never proven mutation-sensitive. That tail is now closed, and it was
larger than the entries added here — **28 verified entries were unanchored, 19 of
them predating this lane**. All 28 now carry an anchor, and `mutation: 'proven'`
is **247 of 247**.

Nine anchors were free: where the two 5e editions engine-wire the same shared
helper, one perturbation flips both editions' linked tests, as the existing
passive-perception pair already did. Daggerheart's L9 rows needed a different
shape — they are legality *predicates*, not scalars, so each anchor moves the
BOUNDARY (widen a cap, invert a comparison) so that a build the test asserts is
illegal becomes legal. That still fails the linked assertion, which is all Tier B
requires.

**One anchor was demoted, and that is the part worth keeping.** Raising
Daggerheart's consumable cap from 5 to 6 looked like a correct perturbation and
was not: the linked test's over-max fixture carries quantity **9**, so nudging the
cap left it just as illegal and nothing flipped. `check:compute-register --mutate`
demoted the entry rather than accepting it. 5 → 99 clears the fixture.

The rule that generalises: **a boundary anchor has to clear the fixture's value,
not merely move.** An arithmetic anchor can perturb by one because any change
propagates; a predicate anchor only flips if the perturbation crosses the actual
test data. The gate is what distinguishes the two, which is precisely why the
register does not accept a hand-stamped `verified` on its own.

Two further honest exclusions landed with the batch and are visible in the
registers: 3 `flagged` (formula not verifiable from an open source) and 1
`excluded`. Both leave the denominator by design, per
`docs/compute-register/types.ts`.

---

## Where the largest open work is

Not a section — a reading aid, kept last so it stays out of the numbering. It is
re-derived each time this file is audited, and it says what the numbered sections
above already say.

1. **§15(b) and §15(c) — content integrity.** Hand-written 5e-2024 monsters and
   backgrounds carrying content the source they cite does not contain.
   §15(c) is a licensing exposure of the same class as §11's OC-1, and neither
   the name-based reverse diff nor the scalar fidelity gate can see it. Largest
   single body of genuine work in the repo.
2. **§11 OC-1 — the owner decision.** Cheap to make, and it is blocking a
   self-expiring quarantine that otherwise sits indefinitely.
3. **§2 — compute.** Expand the registers toward the full L1–L10 set, and give
   the build-legality layer a user-facing surface.
4. **§19 — M&M adversaries.** The only system with no creature catalog, and the
   one thing keeping the 7×N parity matrix from closing honestly. The source
   exists and is open; the obstacle is that this sandbox cannot reach it.

**Corrected 2026-07-28.** Item 3 used to read *"§6 — execute the Denominator-A
demotion"*. It was executed on 2026-07-27 and merged in `62ac50a`; PF2e content%
fell from a circular 100% to a measured 48.6%. The list is re-derived on each
audit and this entry had outlived its finding.

**Corrected 2026-07-26.** The note that stood here named "the §1 data input" as
the highest-leverage unblock — "with authoritative SRD/CRB indices in-repo,
content coverage becomes measurable". That was true when written and has been
false since the sources were wired: §1's own opening records the blocker as
resolved and all 7 systems as measured. The note was also physically stranded
between §15 and §16, so it read as a closing summary of a file it stopped
halfway through.

---

## 25. Six parallel lanes — what running them concurrently actually proved (added 2026-07-31)

**Status: the code work is CLOSED; three coverage limits it exposed are OPEN and named below.** Recorded because the lanes' findings were mostly *not* the work they were dispatched to do, and because the failure pattern repeated often enough to be a rule.

### 25.1 The rule, stated first because it is the reusable part

**A "checked and fine" claim is only as good as the question the check asked.** Three separate sections of `docs/WORK_PLAN.md` carried a DONE verdict that a later, differently-shaped check falsified. In every case the code passed the measure applied and failed the measure that mattered:

| claim | the question it asked | the question that mattered |
| --- | --- | --- |
| §6.6 *"formatRange and formatDuration were checked and are fine"* | is the field PRESENT? | is it the SHAPE the function switches on? |
| §6.4 *"Dark mode was already compliant, so only the light value moved"* | does the fixed element pass? | do the OTHER 12 call sites carry a `dark:` override? |
| §6.4's new dark scan *"closes the coverage hole"* | does the gate fail when I break a token? | does it reach the COMPONENTS the fix touched? |

The third is the sharpest, because it was caught by its own verifier: the first revert control (dropping a `supportBadges` dark override at 1.79:1, catastrophic) produced **8 passed, exit 0**. The badge renders on none of the scanned surfaces.

### 25.2 Defects found outside the lanes' briefs

- **7 low-CR 3.5e monsters could not be placed in an encounter at all.** `DND35E_EL_VALUE` keys CR 1/6 and 1/3 as exact fractions; `src/data/dnd/3.5e/monsters/` encodes them as `0.166`/`0.33`. The lookup missed, returned 0, and cost 0 makes `validateEncounterSpec` reject with `no-xp-cost`. 8 of 188 monsters had no cost; 7 were this. Now 1 — Titan at CR 21, genuinely above the table. Found while ENUMERATING a register layer, not while looking for bugs.
- **The entire M&M catalog rendered `Unknown`** for range and duration. Silent, so nothing caught it: `'Unknown'` is a well-formed string, and the existing shape test asserted only that no formatter throws or leaks `undefined`.
- **Dark `--destructive` was 2.00:1** — a third of AA — across the 56 files using `text-destructive`. Its light counterpart had been AA-tuned; the dark one never was. `CurrencyEditor` platinum measured **1.23:1**.
- **`splitDamageAcrossChannels(5, [])` returned `[]`** — sum 0 against a total of 5, silently destroying damage — while its docstring promised the parts always sum to the whole. The early return preceded the post-condition, so the self-check could not see it. **The test named "no channels yields no parts" was pinning the bug.**

### 25.3 The three open coverage limits

1. **Typed damage covers single attacks only.** `areaEffectToDamageIntent` and `multiTargetAttackToDamageIntent` have no callers outside tests and the barrel; the shipped fireball path builds an untyped intent inline at `src/rules/combat/sceneCombat.ts:503`. **A fireball on a fire elemental does not mitigate.**
2. **The dark a11y gate reaches 4 of ~17 touched files** (25.1). Closing it means scanning surfaces that render those components, or a static contrast lint over Tailwind classes lacking a `dark:` variant.
3. **`normalizeLegacyEquipment` launders 8 non-coin 3.5e prices** into a well-formed `0 gp`. Unfixable in the formatter — indistinguishable there from a legitimately free pf2e item.

### 25.4 Method notes worth keeping

- **Per-lane green does not substitute for the combined gate.** Lanes were barred from `tsc`/`lint`/`verify` because siblings' half-written files were in the tree. Vitest transpiles without typechecking, so **577 tests passed over code that did not compile** — a `SceneActionIntent` union read without narrowing, caught only by `typecheck:test` at integration.
- **The full gate took seven passes**, stopping at steps 3 → 7 → 11 → 12 → 13 → 16 → 22. Only one failure was in lane work; the rest were integration-surface: a missing dependency, regenerated numbers, a doc count invalidated by adding a chain step, and a knip OOM from 42 restored worktrees.
- **A lane contradicted a decision the plan had already recorded.** §3.1 states `mam3e` L5 is legitimately absent; the register lane filed M&M's effect economy there anyway. Reclassified to L8/L9 with **no number movement**, which is the tell that the rows were real work and only the filing was wrong.
- **Concurrent Playwright runs share one `vite preview` server.** Whichever finishes first tears it down; three runs returned 3, 7 and 40 failures, every one a connection refusal with zero assertion failures.

## 26. The wrong-edition tail — replacing 68 records exposed that most of them had nothing to replace them with (added 2026-08-01)

**Status: CLOSED.** `check:provenance-over-inclusion` now reports
`licensing-class total: none`. `wrong-edition-attribution` 68 → 0; with
`genuine-non-open-content` already 0 since §17.3, the audit's entire licensing
tail is empty.

### 26.1 The rule, first

**A remedy that presumes an equivalent exists must go find out, one record at a
time, before it is called a plan.** The owner's ruling (`docs/OPEN_DECISIONS.md`
A2/A3) was the expensive and correct one — *replace* each false-cited record with
a genuine entry from its own edition, rather than re-tag and let
`filterOpenContentBySource` drop it. The ruling was made on the reasonable
assumption that a PF2e Basket exists. It does not. **PF2e has no Basket, Bell,
Blanket, Bucket, Jug, Flask, Vial, Sealing Wax, Shovel, Saw, Ring Mail, Banded
Mail, Siangham, Cestus or Boar Spear under any name in any book.** The 2e
revision consolidated adventuring gear; those rows were never PF2e content that
got mislabelled.

So the population split three ways, and only the first was the job as briefed:

| | rows | what happened |
| --- | ---: | --- |
| The edition HAS the item | 15 | replaced with its real stats and its true book |
| The edition's own version ALREADY SHIPPED alongside it | 13 | the duplicate deleted |
| No edition has the item | 40 | deleted |

### 26.2 Absence is a claim, so it was made to two independent sources

Every "PF2e does not have this" assertion here required BOTH to come back empty:
the 1,027 distinct item names across `Pf2eToolsOrg/Pf2eTools` (`items-crb`,
`baseitems`, `items-apg`, `items-som`, `items-gmg`), and a per-slug probe of
`foundryvtt/pf2e`'s equipment pack. Two community datasets built from the same
books by different people, disagreeing about naming but not about existence.

Foundry's data turned out to carry something Pf2eTools does not:
`system.publication.license`, per item, reading `OGL` or `ORC`. That is what let
Treasure Vault be admitted on evidence rather than on belief — Atlatl, Boomerang
and Earthbreaker each read `{"license":"OGL","remaster":false}` — and it is what
keeps the Remaster line out, since Player Core reads `ORC`. Pf2eTools keeps both
printings of every reprinted item, so an OGL citation is always available for
anything the Remaster reissued; Hatchet and Pick are cited to Core Rulebook
p.280/281, not to Player Core.

### 26.3 The finding that settles whether these were a labelling problem

They were not. **`Banded Mail` shipped in the PF2e catalog as `armorClass: 4,
dexBonusMax: 1`, and `Ring Mail` as `5 / 0`** — numbers matching no row in a
system whose heavy armour is Splint Mail, Half Plate and Full Plate. The `Bell`
cost 1 gp, which is PF1e's price. These are d20 rows wearing a `system: 'pf2e'`
field, and a PF2e sheet offering the player Banded Mail at Dex cap +1 is a
defect, not content. Re-tagging them truthfully would have left the defect in
place with an accurate label on it.

The same shape appeared in the 2024 catalog from the other direction: the six
flagged monsters (`Acolyte`, `Bugbear`, `Goblin`, `Hobgoblin`, `Kobold`,
`Veteran`) had a same-edition equivalent all along — SRD 5.2.1's `Priest
Acolyte`, `Bugbear Warrior`, `Goblin Warrior`, `Hobgoblin Warrior`, `Kobold
Warrior`, `Warrior Veteran` — **and this catalog was already shipping every one
of them**, generated from 5.2. The remedy was not to transcribe anything. It was
to notice the duplicate. `Thug` is the one exception: zero hits in the 5.2.1
bestiary under any name, and Bandit (CR 1/8) and Bandit Captain (CR 2) are
different creatures, so it was deleted.

### 26.4 The allowlists narrow back, and that is the point

`src/utils/openContentPolicy.ts` widened the `pf2e` list on 2026-07-29 to admit
the PF1e line and the d20 SRDs. That was never meant to be a resting state. The
field had been doing two jobs — *is this open?* and *is this in scope?* — and the
conflation produced the worst available outcome, because the only tag that passed
the gate was the wrong one: 15 PF1e gear rows normalised to a bare
`'Core Rulebook'` were compliant **and** falsely attributed. Widening made each
row name its actual source so the wrong edition would stay visible as a wrong
edition instead of being laundered into a right-looking one. Diagnosis, not cure.

With the rows resolved, zero `pf2e` records carry any of those six strings, and
zero `pf1e` records carry `'SRD 3.5'`. All seven are removed. **A dead string on
an allowlist is a door nobody is watching** — it admits nothing today and admits
the next wrong-edition row silently. The scope question and the licence question
are finally separate in that file: everything remaining is both open-licensed and
actually the right game.

Two rows go the other way. `Chakram` and `Marbles` are genuine PF2e content from
*Lost Omens: The Grand Bazaar*, which Foundry marks OGL — but the standing policy
refuses the whole Lost Omens line as Paizo's setting line, and two rows already
sit filtered under that rule. They keep the true tag and are dropped from the
loaded corpus rather than having the line quietly admitted for their sake. True
citation, conservative admission, no policy change smuggled in as a data fix.

### 26.5 Side effects worth knowing

- The 05-H2 versatile-damage regression fixture pinned the deleted 2024
  Hobgoblin. It now pins the shipped SRD 5.2 **Dryad**, which is a stricter test:
  its modifier is *negative* (`2 (1d6 - 1), or 3 (1d8 - 1)`), so a parser that
  summed both clauses would also have to get the sign right to look plausible.
- Four 2024 gear rows — `Hammer`, `Mess Kit`, `Piton`, `Soap` — were reclassified
  rather than touched. Their `SRD 5.1` tag is true and admitted for that system,
  and SRD 5.2.1 genuinely dropped them (pitons folded into the Climber's Kit).
  They are `denominator-scope-defect`: the wired denominator is the 5.2 list
  alone, so a truthfully-5.1-tagged row can never appear in it.
- Product-reachable counts moved: pf2e equipment 182 → 148, pf2e spells 546 →
  543, 2024 monsters 337 → 330, 2024 equipment 492 → 489, pf1e equipment
  615 → 613. Every removal is a row the catalog was wrong to be offering.

## 27. Closing the queue — six lanes, the Dock, and the blocker a name diff could not see (added 2026-08-02)

**Status: CLOSED.** The last release blocker is gone (`WORK_PLAN` §8), both owner
rulings that were still outstanding are executed (§4.3, §0.6), and the five work
items the 2026-07-31 run surfaced are done. 314 test files, 3,301 tests, exit 0.

### 27.1 The rule, first

**A gate you have not watched fail is not a gate — and this run finally applied
that rule to itself.** §25.1 stated it after three "checked and fine" verdicts
were falsified. Here every new gate was made to fail on purpose before it was
believed, and two of them earned it:

| gate | the control that proved it |
| --- | --- |
| the fireball-mitigation test | revert `sceneCombat.ts` only → `expected 10 to be 5` |
| Apply-on-accept in MapPanel | make `canApply` trust the flow → the correction-verdict test fails |
| the client-stamped image size | stamp a fabricated 8000px image → `box-out-of-image` stops firing |
| the static contrast lint | 40 baseline entries, each pinned to its measured ratio |

### 27.2 The blocker a name diff structurally could not see

The four 5e-2024 backgrounds were the last thing holding release, and they are
the cleanest example in this repo of the §18.5.4 limit: they shipped **legitimate
SRD 5.2 names over 2014-model text**, so the reverse diff scored them 100%
covered with zero over-inclusion. No amount of tuning a name comparison finds
that.

The remedy on offer was a re-tag that drops them. What landed instead is the real
content, re-encoded from `5e-bits/5e-database`'s 2024 set — which was **already
this category's wired denominator**, so no new source had to be trusted. They now
carry three ability scores, the Origin feat resolved against the shipped catalog,
the skill/tool proficiencies and both lettered equipment packages. `feature`,
`suggestedCharacteristics` and `description` became optional on the type, because
SRD 5.2 genuinely has none of the three and a required field would have forced
invention.

**This was closed by hand, not by a gate.** The structural limit is unchanged:
field-level comparison covers 5e monsters and backgrounds and nothing else, and
prose fidelity is unaudited in all seven systems. Recorded so the close is not
mistaken for the class being solved.

### 27.3 Two dead channels declined

§26.4 removed seven dead strings from the open-content allowlists on the grounds
that *a dead string on an allowlist is a door nobody is watching*. The same
reasoning applied twice more here, before either door was built:

- **No `addPowerModifier` on the sheet-dispatch registry.** It was written, then
  removed: no sheet in any system has a handler that adds a power modifier to a
  character, and the wrapper being replaced was browse-only for modifiers too.
  The Dock's Modifiers tab is `addVerb: false`, which is the honest description
  of the capability that actually exists.
- **No Remaster line on the pf2e allowlist** (§26.4), for the same shape of
  reason from the licence side.

The generalisation worth keeping: **build the narrowest channel the capability
justifies, and check what would walk through it before widening.**

### 27.4 Findings the lanes produced beyond their briefs

- **A fireball on a fire elemental did not mitigate.** `resolveSceneAreaEffect`
  built its own untyped intent inline and *discarded a channel breakdown
  `resolveAreaEffect` had already computed*. The typed path existed and had no
  caller. It does now, and the split runs on the POST-SAVE figure, so a saved
  target is not re-inflated to full damage.
- **The 8 laundered prices were exactly the 8 predicted** — `Varies`,
  `3 cp/mile`, `1 sp/day` and friends, all 3.5e mount-gear and services. Fixed
  at normalization time, where the original string is still in hand; the
  formatter genuinely cannot tell a laundered `0 gp` from a free pf2e item.
- **`SheetDispatchParity` caught a real capability change.** It pins *a doc id is
  published iff some handler is*, and went red the moment M&M began publishing
  `addAdvantage`. Its matrix was extended, not loosened — the difference between
  a test noticing something and a test being in the way.
- **Two spell tabs still told the user to "use the browser below"** after the
  browser was deleted. Found by the agent repairing the tests, not by any gate:
  no check reads user-facing copy for claims about UI that no longer exists.

### 27.5 The CI split, and why it was safe now and not before

CI's single `verify` job became five parallel jobs. That was blocked until
`scripts/check-ci-parity.mjs` existed, and the reason is worth stating: the check
compares CI's `npm run` steps against the verify chain **as a multiset**, so a
split cannot silently drop a step. It reports `23 verify chain steps, all covered
across 8 job(s)`. Building the check first is what made the change routine —
§25.4 recorded that step-level drift was structurally zero *today* and the gate
was prospective; this is the day it paid.
