# Completion Gaps — Outstanding Work Toward RAW-Completeness

This file enumerates what remains for the two-denominator completion goal, so gaps
are tracked explicitly rather than implied. Live numbers: `docs/generated/roadmap-metrics.md`.
Current-state summary: `docs/STATUS.md`. Both denominators' tooling lives in
`docs/srd-manifest/` (content) and `docs/compute-register/` (engine math).

**Snapshot:** Engine math (Denominator B) is gated by `check:compute-register` —
every `verified` quantity across the 7 systems' registers is Tier A (test-linked
+ actually passing) across L1–L10, and mutation-proof now covers the **entire
register**: every verified entry carries a real formula anchor (Tier B; see
`docs/STATUS.md`). Per-system counts and % live in `roadmap-metrics.md` (not
uniformly 100%; do not restate the numbers here — they drift). Content (Denominator A) is provenance-clean (every
shipped entry is encoded, loader-backed, source-tagged, policy-clean, and — for
the categories with an authoritative SRD list — verified by reverse-diff to
contain **no** non-SRD entries). Independent published-SRD *coverage* is now
measured for all 7 systems (`docs/generated/srd-coverage.md`): D&D 3.5e is wired
against the clean core-only `olimot/srd-v3.5-md` chapters (spells 604/605 = 99.8%;
the monster % understates real coverage because the denominator counts the SRD's
category headings, e.g. "Angel", "Dragon").

---

## 1. Content (Denominator A) — independent SRD coverage [UNBLOCKED; all 7 systems measured]

**Update:** the blocker is resolved. The container's Node runtime fetches the
open-content SRD datasets from GitHub raw in full (the `WebFetch` *tool* truncates;
Node `fetch()` does not). Verified independent sources for all 7 systems are in
`docs/srd-sources.md`. `npm run srd:coverage` builds the genuine coverage report at
`docs/generated/srd-coverage.md` (independent SRD lists diffed against the loaders
by normalized name, each scoped to the policy's `allowedSources`) — real coverage,
unlike the loader-derived `docs/srd-manifest/`.

**Measured — `docs/generated/srd-coverage.md` is authoritative for live counts (do not restate them here; they drift):**
- The earlier deep gaps (PF2e spells "24%", PF1e "21%", 5e-2014 "67%") were a stale
  snapshot. Every wired spell catalog now reads complete or one entry short: PF2e
  and both 5e editions at 100%, PF1e and 3.5e at 99.8%. 5e-2014/2024 monsters and
  equipment are also at/near 100%.
- **M&M 3e** (powers, advantages) and **Daggerheart** (domain cards, domains) are at
  genuine 100% on their wired categories.
- The genuine residual is small and itemized in `srd-coverage.md`: single-entry
  gaps (5e-2014 Net, 5e-2024 Will-o'-Wisp, PF1e Teleport Greater, 3.5e Shadow
  Evocation Greater), the M&M equipment encode, and the 3.5e/PF1e *monster* rows
  whose percentage is understated by a denominator counting SRD category headings /
  age-size variants rather than individual stat blocks.
- **Provenance — feats/backgrounds [REMEDIATED]:** the loaders shipped PHB feats
  and backgrounds mislabeled with an SRD source tag (SRD 5.1 has only Acolyte +
  Grappler; SRD 5.2 has 4 backgrounds + 17 feats). The non-SRD entries were
  deleted (see the over-inclusion table in `docs/generated/srd-coverage.md`, now
  0 genuine suspects for these categories). The reverse-diff audit (loader entries
  absent from the independent SRD) is the standing guard against re-introduction.
- **Provenance — 5e-2024 species [REMEDIATED]:** Half-Elf and Half-Orc (SRD 5.1
  species dropped from SRD 5.2) were removed from the SRD-5.2-only 2024 loader;
  srd-coverage now reports 0 over-inclusion for 2024 species.
- **Provenance — 5e-2014 spells [REMEDIATED]:** of the 30 reverse-diff hits, 8
  were Product-Identity names renamed to their SRD names ("Tasha's Hideous
  Laughter" → "Hideous Laughter", …, "Mordenkainen's Sword" → "Arcane Sword") and
  22 genuine non-SRD entries were deleted (PHB spells like Hex/Witch Bolt and
  homebrew like Glass Staff/Airwalk). 2014 spells: 222/222, 0 over-inclusion.
- **Provenance — 5e-2024 spells [REMEDIATED]:** the denominator was sourced — SRD
  5.2 genuinely differs from 5.1 (**339 vs 319** spells; 5.2 adds Chromatic Orb,
  Divine Smite, Hex, Ray of Sickness, Power Word Heal, etc.), parsed from
  `downfallx/dnd-5e-srd-markdown` (CC-BY) and wired as the 2024 spell denominator.
  Against it: 7 Product-Identity names renamed to their SRD names and 26 genuine
  non-SRD-5.2 entries deleted (PHB spells like Witch Bolt/Crown of Madness/
  Feeblemind + homebrew like Glass Staff). The Ranger's non-SRD always-prepared
  grants (Conjure Barrage/Volley) were removed accordingly. 2024 spells: 294/294
  in-SRD (86.7% of the 339), 0 over-inclusion.
- The 5e-database 2024 monsters file looks partial (~3 entries) — validate that
  source before trusting the 2024 monster row.

**Still to do (sources in `docs/srd-sources.md`):**
- **D&D 3.5e** is now wired [DONE]: the psionics/epic-mixed `Rughalt/D35E` packs were
  rejected in favor of the clean core-only `olimot/srd-v3.5-md` Markdown chapters,
  giving spells 604/605 (99.8%) and a wired monster row (its % understates real
  coverage — the denominator counts the SRD's category headings). Remaining 3.5e
  categories (classes/feats/equipment) are still unwired pending core-only sources.
- Wire the remaining categories (PF2e/PF1e non-spell, M&M skills/conditions/
  equipment, Daggerheart classes/ancestries/communities/weapons/armor, all monsters).
- Remediate under-covered categories (encode missing SRD entries — e.g. PF2e/PF1e/5e
  spells) and the provenance over-inclusion (re-source or re-scope mislabeled entries).
- Decide whether to fold genuine coverage into the headline metric / replace the
  loader-mirror `docs/srd-manifest/` numbers.

## 2. Compute (Denominator B) — register completeness + engine wiring

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
    scene combat (previously only engine-built inputs carried it). Base
    one-handed damage; versatile two-handed mode isn't representable in the
    single `weaponDamage` field and stays a follow-up, as does the equivalent
    populate for the d20-legacy/PF2e equip flows (their weapon data shapes
    differ from the 5e DiceRoll catalog).
  - L5: **Partial.** Prepared-spell limits are wired — the 5e spells tab shows
    each prepared caster's RAW limit (`getDnd5ePreparedCasterSummaries` through
    the sheet controller). Still absent: known-spell-count enforcement (the
    sheet's known list is unbounded; the class tables' `spellsKnown` progression
    is only shape-validated), mechanical upcasting (only descriptive
    at-higher-levels text renders), and full PF2e heightening (the auto-heighten
    rank helper exists but is unwired — see below). (3.5e/PF1e
    bonus-spells-by-ability done.)
  - L6: speed with armor/Str penalty still open. **Done:** 3.5e/PF1e carrying
    capacity, load categories, encumbrance penalties, and lift/drag limits;
    PF2e Bulk limits.
  - L7: ASI/feat cadence — ASI features land at the RAW levels from class data
    (and the 2024 ASI feat applies its score bumps), but no register-linked
    cadence helper or build validator counting spent ASIs/feats exists.
    **Done:** 3.5e XP-to-level table; M&M starting power points + hero points;
    Daggerheart short-rest recovery, Experience bonus, starting Hope;
    PF2e/3.5e HP/death state.
  - L8: resist/vuln/immune transforms outside Daggerheart still open. **Done:**
    PF2e dying/wounded/recovery track; 3.5e disabled/dying/dead track + massive
    damage; Daggerheart resistance/immunity, Armor-Slot reduction, massive-damage
    option, and death moves.
  - L9: point-buy ability arrays; feat/prereq gating; multiclass slot/save/BAB/prof
    stacking as *validators* (M&M PL caps + point-buy costs exist; M&M degrees of
    success now covered).
  - L10: D&D 3.5e Encounter-Level budgeting and wealth-by-level still open (3.5e
    monsters carry no XP, so the encounter-spec validator honestly reports it
    `unsupported-system`). **Done:** 5e (SRD 5.2.1), PF1e (CRB target-CR), and
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
    per attack via the tactical executor's iterative penalty steps — though
    through duplicate implementations: the register-linked
    `iterativeAttackBonuses` in `src/utils/derivedCombatMath.ts` is itself
    test-only, a dedupe hygiene item. PF2e Bulk limits: `Pf2eInventoryTab`
    computes total Bulk and flags encumbered/overloaded via `getPf2eBulkState`,
    with the same duplicate-implementation caveat for the register-linked
    `pf2eBulkLimits`. Also wired earlier: 3.5e skill synergy, max-rank
    enforcement, and the full check penalty — synergy applies in both the
    skills tab and `rollCheck`; the skills tab shows each skill's RAW rank cap
    and flags over-cap values; the check penalty applies to physical skills
    from both carried weight (encumbrance) and the equipped armor/shield
    armor-check penalty, sourced from the catalog-backed equip flow
    (conditional and Knowledge-subtype synergies stay manual). Cleric domain,
    wizard specialist, and Dragon Disciple bonus spell slots auto-resolve into
    the spells-per-day totals.
  - **Still helper-only** (RAW formula proven by test, but nothing in
    `prepareData` or a sheet computes or displays it): passive Perception;
    concentration DC in all three flavors (5e, 3.5e, PF1e); cantrip scaling;
    PF2e multiple-attack penalty — the pf2e combat profile reuses the 5e
    feature-based attack economy and declares no MAP penalty step
    (`iterativePenaltyStep`), so the tactical executor never applies the
    multiple-attack penalty; PF2e striking rune
    dice — `EquippedItem` has no rune field to read; PF2e auto-heighten rank;
    M&M measurements. Wiring these into the engines/sheets is outstanding.
- **Stricter spec criteria not met:** comprehensive typed-bonus *stacking* tests
  (e.g., 3.5e dodge-stacks-but-others-don't); the content×compute cross-product
  fixtures (Monk+shield AC, PF2e striking+enfeebled as combined cases);
  build-legality validators that REJECT illegal and ACCEPT legal builds (only M&M
  PL-cap detection exists).

## 3. Bestiaries / RFC 004

No longer proposal-only: the plan in `docs/rfc/004-monster-product-surface.md`
was executed for the d20 systems. D&D 3.5e (core SRD monsters), PF1e
(Bestiary 1), and PF2e monster data shipped 2026-06-12, loader-backed behind the
existing `loadMonstersForSystem` contract (`src/utils/dataLoader.ts`) and
product-reachable through the scene encounter flow
(`src/components/scene/useSceneEncounter.ts`). Per-system monster coverage lives
in `docs/generated/roadmap-metrics.md` and `docs/generated/srd-coverage.md`, not
here. The residual: M&M 3e / Daggerheart adversary (reference) data, and the
3.5e XP/CR data needed before Encounter-Level budgeting (§2 L10) can land. RFC
004 was executed without formal acceptance; its status line records that.

## 4. GLOBAL DONE criteria still outstanding

- `supportLevel` is now `'full'` for **all seven systems**. D&D 3.5e and PF1e
  auto-resolve their cleric domain, wizard specialist, and Dragon Disciple bonus
  spell slots into the spells-per-day totals (counts are deterministic from the
  build). Daggerheart auto-resolves its deterministic passive automation
  (evasion, armor, thresholds, spellcast, traits). Each system's residual manual
  surface is an enumerated accepted boundary in `docs/srd-manifest/_exclusions.ts`
  — d20 Vancian prepared-slot assignment + spontaneous conversion, Daggerheart
  triggered/narrative card resolution, M&M freeform descriptors — never
  unfinished automation. Independent content coverage is proven across the board
  (3.5e spells 99.8%, PF1e 99.8%, PF2e/5e ~100%).
- MASTER_PLAN.md now mirrors the two-denominator completion goal and adopts
  this file as the completion-tracking doc (2026-07-14). README.md cites both
  denominators under Quality Metrics ("Completion methodology", 2026-07-17),
  and no doc claims RAW-coverage-complete.
- The full `npm run verify` gate runs in CI on every main merge — including
  `build`, `check:bundle-size`, coverage thresholds, and Playwright `test:e2e`
  on both chromium and firefox; the latest such merge is `245876a` (PR #37,
  2026-07-16). Not every historical main-merge run was green (e.g. the PR #30
  merge run was cancelled and needed follow-up e2e fixes). The earlier caveat
  that this container cannot run e2e is stale as a gate concern; CI is the
  authority for the full gate.

## 5. Review item — a shipped behavior change

5e-2024 exhaustion was changed from −1/level to **−2/level** (RAW per SRD 5.2 and
the goal text) in `src/systems/dnd5e-2024/engine.ts`. It is the only shipped
game-rule behavior change (vs. test-only additions) and warrants a human review.

## 6. Reconsider artifact

The 4,053-entry loader-mirror manifests under `docs/srd-manifest/` are honest
(catalog/provenance) but somewhat redundant with the loaders. Decide whether they
belong in-repo as committed files or should be regenerated on demand now that a real
independent denominator (`docs/generated/srd-coverage.md`) exists for most systems.

---

**Highest-leverage unblock:** the §1 data input. With authoritative SRD/CRB
indices in-repo, content coverage becomes measurable and the rest of Denominator A
is mechanical. Next-largest body of genuine work: §2 — expand the compute
registers to the full L1–L10 set and wire the proven helpers into the engines.
