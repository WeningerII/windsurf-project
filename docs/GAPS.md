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
| [12](#12-unresolved-a11y-contrast-finding-on-the-creation-surface-added-2026-07-25) | Quarantined `color-contrast` violation, needs a live browser |

**Partly closed — evidence for what shipped, residual named inside:**

| § | Finding | Residual |
| --- | --- | --- |
| [1](#1-content-denominator-a--independent-srd-coverage) | Independent SRD coverage | unwired categories; 3.5e monster misses |
| [2](#2-compute-denominator-b--register-completeness--engine-wiring) | Register completeness + engine wiring | L8 typed damage; legality layer unreached by any UI |
| [3](#3-bestiaries--rfc-004) | Bestiaries / RFC 004 | M&M 3e adversary data |
| [4](#4-global-done-criteria-still-outstanding) | GLOBAL DONE criteria | `Full` measures automation depth, not content completeness |
| [7](#7-rules-ir-parity-debt--per-system-accounting-added-2026-07-21) | Rules-IR parity debt | nothing outside tests consumes the legal-actions seam |
| [10](#10-ai-gateway-provider-agnosticism--what-is-proven-and-what-is-not-added-2026-07-25) | AI gateway provider-agnosticism | no live-API proof; no failover; no pricing |
| [14](#14-p5infra-gaps--inventory-what-was-closed-and-what-is-deliberately-not-built-added-2026-07-25) | `p5.infra-gaps` | 14.4 — Sentry release/env, server 5xx, durable rate-limit store |
| [15](#15-field-level-srd-fidelity--audit-result--the-gate-that-now-guards-it-added-2026-07-25) | Field-level SRD fidelity | **(b)** and **(c)** unfixed — the largest open content-integrity item |
| [16](#16-lazy-per-system-engines--what-was-reclaimed-and-exactly-what-blocks-the-rest-added-2026-07-25) | Lazy per-system engines | engine reclaim blocked, needs authorization |
| [18](#18-provenance-over-inclusion--the-audit-result-and-the-gate-that-now-bounds-it-added-2026-07-25) | Provenance over-inclusion — 1,045 classified + gated | 31 records carry a false citation (owner decision); 3 measurement defects diagnosed, not repaired |

**Closed, decided, or standing reference — kept for the evidence trail:**

| § | Finding | What closed it |
| --- | --- | --- |
| [5](#5-review-item--a-shipped-behavior-change-ratified-2026-07-20) | 5e-2024 exhaustion −2/level | human ratification 2026-07-20 |
| [6](#6-reconsider-artifact--decided-2026-07-21-executed-2026-07-27) | `docs/srd-manifest/` demotion | executed 2026-07-27; Denominator A is `docs/generated/srd-coverage.md` |
| [8](#8-w6-executable-activity-contract--close-by-rule-under-constraint-5-added-2026-07-24) | W6 executable-activity contract | close-by-rule: one consumer, not graduated |
| [9](#9-make-me-a-game-flow--what-it-composes-and-what-it-deliberately-does-not-added-2026-07-24) | Make-me-a-game flow scope | scope record; nothing stubbed |
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
directory, and `src/utils/dataLoader.ts` exposes no M&M creature loader.
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

**Status: OPEN.** Re-verified 2026-07-26 — the scan is still quarantined
(`test.fixme(...)` at `e2e/a11y.spec.ts:151`) and `KNOWN_A11Y_DEBT` is still
empty (`:22`), so `color-contrast` remains enforced on every other surface. This
one needs a live browser; nothing in it can be advanced from source alone.

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
  improve regression grouping (`sentry-alerts.md` §5). Not taken because
  `main.tsx` is in the eager first-paint chunk, which is at **84.8 / 85.0 KiB
  gzip**. The documented reclaim (lazy-loading per-system engines) is a separate
  piece of work; these two should land immediately after it, not before.
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

**Status: PARTLY CLOSED — and this section holds the largest open item in the
file.** The gate shipped and the audit is done (`scripts/check-srd-fidelity.mjs`
plus its pinned manifest and ratchet baseline, all present and inside `verify`;
re-verified 2026-07-26). **Findings (b) and (c) are NOT fixed**: 5e-2024
hand-written monsters diverging from SRD 5.2.1, and 5e-2024 backgrounds carrying
non-open 2014 content under an SRD tag. (c) is the same defect class as §11's
OC-1 and is a licensing exposure, not a tidiness one. 15.4 is the itemized
residual risk.

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

**(b) 5e-2024 hand-written monsters — 77 of 85 diverge from SRD 5.2.1. NOT FIXED.**
The Will-o'-Wisp (§13) was not an isolated case; it was one instance of a
systemic pattern. The 5e-2024 loader ships ~96 hand-written monsters that override
the encoder on name match, tagged `source: 'SRD 5.2'`. Of the 85 whose SRD 5.2.1
stat block is machine-readable, **77 diverge** — mostly carrying the SRD 5.1 (2014)
values (Wolf AC 13 vs 12; Skeleton AC 13 vs 14; Vampire 16d8+64 vs 23d8+92;
Lich AC 17/18d8+72 vs 20/42d8+126; Deva CR 5 vs 10; Manticore CR 7 vs 3), and some
carrying values found in **neither** edition (Air Elemental 5d10+10 is neither
5.1's 12d10+24 nor 5.2's — an invented or placeholder line). All 254 scalar
divergences are itemized field-by-field in
`scripts/data/srd-fidelity-baseline.json`.
Not fixed here: correct remediation is re-transcription of ~77 full stat blocks
(prose, traits and actions included, which this lane's scalar gate does not even
measure), or deleting the hand-written overrides so the encoder's verbatim 5.2.1
output wins. Both have a blast radius well beyond an audit lane. **This is the
single largest open content-integrity item in the repo.**

**(c) 5e-2024 backgrounds — all 4 carry 2014 content, and 3 are NOT open content.**
Acolyte, Criminal, Sage and Soldier all ship tagged `source: 'SRD 5.2'` carrying
the 2014 model: `suggestedCharacteristics` tables, a background `feature`
("Shelter of the Faithful", "Criminal Contact", "Researcher", "Military Rank") and
language grants — none of which exist in SRD 5.2, which instead grants ability
scores, an origin feat and a tool proficiency. Acolyte is byte-identical to the
repo's own 5e-2014 Acolyte. Criminal's skills are the 2014 Deception/Stealth, not
5.2's Sleight of Hand/Stealth.
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
- **M&M 3e and Daggerheart** have no scalar gate at all; only the
  encoder-regeneration sweep covered them.

---

## 16. Lazy per-system engines — what was reclaimed, and exactly what blocks the rest (added 2026-07-25)

**Status: PARTLY CLOSED.** 16.2 landed and is verifiable: all seven
`src/systems/*/definition.ts` now supply the lazy `loadValidator`, none the eager
`validator:` field (2026-07-26). **The engine reclaim itself is blocked and needs
an explicit authorization**, not more investigation — `SystemDefinition.engine`
is still a required synchronous property (`src/registry/types.ts:250`) and
`prepareDocumentWithEngine` still calls `.engine.prepareData` synchronously
inside `setDocuments` updaters (`src/hooks/useDocuments.ts:18-23`). 16.4 states
what unblocking needs; 16.4's second bullet is the decision to make.

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

---

## 17. M&M 3e equipment — 150 hand-written entries, one false citation (added 2026-07-25)

**Status: CLOSED — the repair merged.** Written while the work was in flight; it
has since landed and is verifiable in the tree (2026-07-26):
`scripts/encode-mam-equipment.mjs`, the offline
`scripts/check-mam-equipment-provenance.mjs` gate with its ratchet manifest, the
generated `equipment/srd-{weapons,armor,vehicles,gear,headquarters}.ts` tier
alongside `original-not-srd.ts` with the six hand-written modules gone, the
`originalContentSources` channel and exported `isOriginalContentSource`
(`src/utils/openContentPolicy.ts:39,94,185`), and the item-by-item record in
`docs/mam3e-equipment-provenance.md`. **17.2 lists the residuals**, of which the
last is a live defect of the same class in the *other* M&M data sets.

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
- **`original-not-srd.ts` stays hand-written and unaudited.** There is no upstream
  to encode it from and nothing to check its stat blocks against. The gate proves
  only that it does not *claim* the SRD. Whether those 79 entries should ship at
  all is the repository owner's call, not an audit's.
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

**Of the 95 `genuine-non-open-content` records, 64 are M&M 3e equipment that is
already honestly labelled** `Original Content (not SRD)` and segregated by §17 —
no false citation remains on them. They stay in the licensing class because the
*finding* (no open-content counterpart) is what the class records, and because
whether names like `Power Ring`, `Web Shooters` and `Mystic Amulet` should ship at
all is a trade-dress judgment reserved to the owner (§17.2). **31 records carry a
false citation today**; that is the number that describes live exposure, not 95.

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
  what a suspect is. Both report the same 1,045 today, and
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
3. **§6 — execute the Denominator-A demotion.** Until it runs, the headline
   content metric is measured against a denominator that structurally cannot go
   below 100%.
4. **§2 — compute.** Expand the registers toward the full L1–L10 set, and give
   the build-legality layer a user-facing surface.

**Corrected 2026-07-26.** The note that stood here named "the §1 data input" as
the highest-leverage unblock — "with authoritative SRD/CRB indices in-repo,
content coverage becomes measurable". That was true when written and has been
false since the sources were wired: §1's own opening records the blocker as
resolved and all 7 systems as measured. The note was also physically stranded
between §15 and §16, so it read as a closing summary of a file it stopped
halfway through.
