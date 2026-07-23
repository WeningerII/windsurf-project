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
- The genuine residual is small and itemized in `srd-coverage.md`: two
  single-entry gaps (5e-2014 Net equipment, 5e-2024 Will-o'-Wisp monster —
  PF1e Greater Teleport and 3.5e Greater Shadow Evocation were since encoded
  and are no longer missing; corrected 2026-07-21), and the genuine missing
  monster individuals isolated by the denominator-shape fix (PF1e Skeletal
  Champion; 3.5e's 45-row missing list, e.g. Lich/Ghost/Salamander/Hydra —
  that list still contains container-like rows the collapse missed, such as
  "Chromatic Dragons" and "Celestial Creature", so it overstates genuine
  misses; tightening the collapse is a follow-on alongside the encodes).
- **Monster denominator shape-mismatch [FIXED IN CODE; published % deferred]:**
  the 3.5e and PF1e monster denominators previously counted taxonomic CONTAINER
  entries — the SRD 3.5 category headers (Angel/Dragon/Elemental/…) and the PF1e
  bestiary dragon/elemental PARENT records — as if they were individual stat
  blocks, understating coverage. Pure, unit-tested helpers in
  `src/scripts/srdCoverageShape.ts` (`collapse35eMonsterHeadings`,
  `collapsePf1eContainerRecords`) now drop those containers (and fold 3.5e age/
  size variant rows to their archetype) so both denominators count individual
  stat blocks; the 14 PF1e parents collapse while Skeletal Champion stays a
  genuine miss. The counting LOGIC is fixed and tested, and the refreshed
  percentages are PUBLISHED (2026-07-21 networked run): PF1e monsters
  331/332 = 99.7%, 3.5e monsters 177/222 = 79.7%. Residual: the 3.5e missing
  list still carries container-like rows outside the collapse list (see the
  residual bullet above).
- **M&M equipment coverage target [WIRED; execution deferred]:** the DHH
  equipment data already ships and its runtime loader is wired
  (`loadEquipmentForSystem('mam3e')`); the remaining gap was the coverage
  *measurement*. The `mam3e`/`equipment` `CoverageTarget` (frnprt EQUIPMENT vs
  the loader) has now RUN (2026-07-21 networked pass): 45/113 = 39.8%, with the
  68 missing entries itemized in the report. Cleanup note: two stale prose
  strings inside the generator (`src/scripts/srd-coverage.ts` — a "deferred"
  comment and a hardcoded "M&M … equipment … pending wiring" Pending line)
  contradict the measured table and will reprint on every run until removed.
- **Provenance — feats/backgrounds [REMEDIATED]:** the loaders shipped PHB feats
  and backgrounds mislabeled with an SRD source tag (SRD 5.1 has only Acolyte +
  Grappler; SRD 5.2 has 4 backgrounds + 17 feats). The non-SRD entries were
  deleted (see the over-inclusion table in `docs/generated/srd-coverage.md`, now
  0 genuine suspects for these categories). One cosmetic residue (noted
  2026-07-21): 7 qualifier-named 2024 feat variants ("Magic Initiate (Cleric)",
  "Fighting Style: …") still print as nominal over-inclusion rows because the
  reverse-diff normalizes loader names less aggressively than the coverage
  side; genuine over-inclusion is zero. The reverse-diff audit (loader entries
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
  - L10: wealth-by-level still open. **Done (corrected 2026-07-21):** D&D 3.5e
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
    per attack via the tactical executor's iterative penalty steps — though
    through duplicate implementations: the register-linked
    `iterativeAttackBonuses` in `src/utils/derivedCombatMath.ts` remains
    test-only while the d20-legacy sheet and the tactical executor's profile
    each carry their own encoding — three encodings of one formula, a dedupe
    hygiene item. PF2e Bulk limits: `Pf2eInventoryTab` computes total Bulk via
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

---

**Highest-leverage unblock:** the §1 data input. With authoritative SRD/CRB
indices in-repo, content coverage becomes measurable and the rest of Denominator A
is mechanical. Next-largest body of genuine work: §2 — expand the compute
registers to the full L1–L10 set and wire the proven helpers into the engines.
