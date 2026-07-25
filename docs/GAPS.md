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
against the clean core-only `olimot/srd-v3.5-md` chapters (spells now 605/605;
the monster denominator counts individual stat blocks — the shape fix is in code
AND published as of the 2026-07-21 coverage run: PF1e monsters 331/332, 3.5e
177/222).

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
- CLOSED 2026-07-25: the three named single-entry gaps are all encoded and
  measured at 100% — 5e-2014 **Net** (`0bf4a75`), PF1e **Skeletal Champion**
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
- **Monster denominator shape-mismatch [FIXED IN CODE; published % deferred]:**
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
- **M&M equipment coverage target [WIRED; execution deferred]:** the DHH
  equipment data already ships and its runtime loader is wired
  (`loadEquipmentForSystem('mam3e')`); the remaining gap was the coverage
  *measurement*. The `mam3e`/`equipment` `CoverageTarget` (frnprt EQUIPMENT vs
  the loader) has now RUN (2026-07-21 networked pass): 45/113 = 39.8%, with the
  68 missing entries itemized in the report. Cleanup note [DONE]: the two stale
  generator prose strings (`src/scripts/srd-coverage.ts` — a "deferred" comment
  and a hardcoded "M&M … equipment … pending wiring" Pending line) have been
  removed; the Pending line now reflects the measured M&M skills/equipment rows.
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
- RESOLVED (2026-07-21): the partial (~3-entry) 5e-database 2024 monsters JSON
  was validated and rejected by the coverage script itself; the 2024 monster
  denominator is the SRD 5.2.1 markdown (330 stat blocks), the loaders hold
  339, and coverage measures 329/330 (Will-o'-Wisp the sole miss).

**Still to do (sources in `docs/srd-sources.md`):**
- **D&D 3.5e** is now wired [DONE]: the psionics/epic-mixed `Rughalt/D35E` packs were
  rejected in favor of the clean core-only `olimot/srd-v3.5-md` Markdown chapters,
  giving spells 604/605 (99.8%) and a wired monster row. The monster denominator's
  category-heading shape-mismatch is now fixed in code (`collapse35eMonsterHeadings`);
  the refreshed % is produced by the next networked coverage run. Remaining 3.5e
  categories (classes/feats/equipment) are still unwired pending core-only sources.
- Wire the remaining categories (3.5e classes/feats/equipment; PF2e non-spell/
  non-monster; PF1e non-spell besides monsters/equipment/magic items; M&M
  skills/conditions; Daggerheart classes/ancestries/communities/weapons/armor;
  M&M/Daggerheart adversaries). Corrected 2026-07-21: monsters for all five
  d20-family systems and M&M equipment are already wired and measured — the
  earlier "all monsters" phrasing here was stale.
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
  - **Still helper-only** (re-audited 2026-07-21; RAW formula proven by test,
    but nothing in `prepareData` or a sheet computes or displays it): PF2e
    multiple-attack penalty — the pf2e combat profile reuses the 5e
    feature-based attack economy and declares no MAP penalty step
    (`iterativePenaltyStep`), so the tactical executor never applies it; PF2e
    striking rune dice — `EquippedItem` has no rune field to read; M&M
    measurements (parameterized by a per-measure rank-0 anchor + rank, so it is
    register/test-pinned only — deliberately not a standing sheet card). **Wired
    since the last update (removed from this list):** concentration DC in all
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
- **Stricter spec criteria (re-audited 2026-07-21 — the earlier text here was
  wrong in both directions):** typed-bonus stacking tests EXIST — the resolver
  implements per-`bonusType` largest-wins stacking with 3.5e-enhancement and
  PF2e-bucket regressions (`resolver.test.ts`, `equipParity.test.ts`) — but
  `BonusType` has no `dodge` member, so the canonical
  3.5e-dodge-stacks-while-others-don't case is unrepresentable: a
  type-vocabulary gap, not a test gap. The Monk+shield AC cross-product fixture
  EXISTS (`dnd5e-engine.test.ts`); PF2e striking+enfeebled does not (blocked on
  the missing rune field above). Build-legality validators for D&D 5e (both
  editions), D&D 3.5e, PF1e, and PF2e EXIST under `src/rules/legality/` — with
  accept-legal AND reject-illegal tests, register-linked L9 rows, and mutation
  anchors gated by `check:compute-register` — so the old "only M&M PL-cap
  detection exists" claim was stale. The genuine gap: NOTHING at runtime
  invokes them — no engine, sheet, or registry imports `validate*Build`, so
  the legality layer is itself helper-only at the app level. Wiring it into
  import/creation surfaces is the open work.

## 3. Bestiaries / RFC 004

No longer proposal-only: the plan in `docs/rfc/004-monster-product-surface.md`
was executed for the d20 systems. D&D 3.5e (core SRD monsters), PF1e
(Bestiary 1), and PF2e monster data shipped 2026-06-12, loader-backed behind the
existing `loadMonstersForSystem` contract (`src/utils/dataLoader.ts`) and
product-reachable through the scene encounter flow
(`src/components/scene/useSceneEncounter.ts`). Per-system monster coverage lives
in `docs/generated/roadmap-metrics.md` and `docs/generated/srd-coverage.md`, not
here. The residual: M&M 3e adversary (reference) data only — Daggerheart ships 129
loader-backed SRD adversaries (`loadDaggerheartAdversariesForSystem` in
`src/utils/dataLoader.ts`, fieldable as monster-kind scene tokens since
2026-06-12; the earlier claim here that Daggerheart adversary data was missing
was WRONG, corrected 2026-07-21). 3.5e Encounter-Level budgeting no longer
blocks on XP data — it shipped on a derived-EL model (§2 L10) — though 3.5e
monster `experiencePoints` remain uniformly 0 for any future XP-award feature.
RFC 004 was executed without formal acceptance; its status line records that.

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
  (all five wired spell catalogs at 100% as of the 2026-07-21 coverage run;
  the residuals are two non-spell single entries and the monster /
  M&M-equipment gaps itemized in §1).
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

## 5. Review item — a shipped behavior change [RATIFIED 2026-07-20]

5e-2024 exhaustion was changed from −1/level to **−2/level** (RAW per SRD 5.2 and
the goal text) in `src/systems/dnd5e-2024/engine.ts`. It is the only shipped
game-rule behavior change (vs. test-only additions), so it required explicit human
sign-off. That sign-off landed: **ratified 2026-07-20** (commit `14727e7`,
gap-ledger entry `review.dnd5e-2024-exhaustion`, status `done`), confirmed against
SRD 5.2 RAW — "each level of Exhaustion reduces D20 Tests by 2 times your
Exhaustion level"; the −1/level figure matched only the One D&D playtest draft.
`Dnd5e2024Engine.getExhaustionD20Penalty` is settled and test-pinned. No open
action remains.

## 6. Reconsider artifact — DECIDED 2026-07-21, execution scheduled Wave 2

The loader-mirror manifests under `docs/srd-manifest/` hold 3,614 entries as
committed (the "4,053" previously cited here matches nothing committed;
corrected 2026-07-21) and are honest on catalog/provenance but now BADLY
diverged from the loaders they mirror — unregenerated since ~2026-06-17, e.g.
the 5e-2014 manifest lists 39 monsters and 230 equipment against current
loaders' 335 and 656. That open question is now settled:

**Decision (user, 2026-07-21):** `docs/srd-manifest/` moves to **on-demand
generation** (no longer committed) and is **demoted from denominator duty** —
`docs/generated/srd-coverage.md` becomes the **sole content denominator**
(Denominator A). Execution of the demotion is **scheduled for Wave 2**; nothing
is deleted yet — until the demotion executes, the committed manifests and the
docs/metrics that cite them (e.g. the two-denominator completion goal in
`docs/MASTER_PLAN.md`, `docs/generated/roadmap-metrics.md`, `_exclusions.ts`)
remain in place and accurate as-is. This section records the decision only.

## 7. Rules-IR parity debt — per-system accounting (added 2026-07-21)

The open RFC 003 work, counted against all seven systems (both 5e editions
count separately) so edition ambiguity cannot hide debt. Verified against code,
not carried forward from prose — this pass also corrected two stale claims in
`docs/MASTER_PLAN.md` that misreported per-system state in 5e's favor (the
d20-legacy ledger was already re-backed; every engine already consumes the
shared condition catalogs).

| Parity debt | Done | Owed | Owed by |
| --- | --- | --- | --- |
| Ledger re-backed on resolver | 4 | 3 | PF2e (no builder exists), M&M 3e, Daggerheart (hand-built) |
| Condition effects through the resolver fold | 0 | 7 | all seven (catalogs in `src/rules/conditions/` shipped and engine-consumed as helper reads; fold-through open everywhere) |
| AI-seam validators | 7 | 0 | **COMPLETE (2026-07-21)** — all seven registered and lazy-loaded (`SystemDefinition.loadValidator`); each derives checks from its own RAW/loaders and consumes its `src/rules/legality/` build validator as warnings where present |
| Resolver legal-actions seam | 0 | 7 | all seven |
| Additive equip routing | 5 | 2 — accepted boundary | Daggerheart, M&M 3e (non-additive derivation; revisit only if the IR gains override/derived operations for other reasons) |

Deliverable phrasing for this debt lives in the W-numbered workstream table in
`docs/MASTER_PLAN.md` (W2, W4, W5, W8), governed by the `All-seven-equal
phrasing` constraint there: system names may appear in status lines, never as
the subject of deliverable lines.

## 8. W6 executable-activity contract — CLOSE-BY-RULE under constraint 5 (added 2026-07-24)

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

---

**Highest-leverage unblock:** the §1 data input. With authoritative SRD/CRB
indices in-repo, content coverage becomes measurable and the rest of Denominator A
is mechanical. Next-largest body of genuine work: §2 — expand the compute
registers to the full L1–L10 set and wire the proven helpers into the engines.
---

## 14. `p5.infra-gaps` — inventory, what was closed, and what is deliberately NOT built (added 2026-07-25)

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
