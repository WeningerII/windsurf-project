# Completion Gaps — Outstanding Work Toward RAW-Completeness

This file enumerates what remains for the two-denominator completion goal, so gaps
are tracked explicitly rather than implied. Live numbers: `docs/generated/roadmap-metrics.md`.
Current-state summary: `docs/STATUS.md`. Both denominators' tooling lives in
`docs/srd-manifest/` (content) and `docs/compute-register/` (engine math).

**Snapshot:** Engine math (Denominator B) is verified and levelled to even depth —
each of the 7 systems' compute registers now holds 26–28 test-pinned quantities
across L1–L10 (was 13–28). Content (Denominator A) is provenance-clean (every
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

**Measured (live numbers in `docs/generated/srd-coverage.md`):**
- **5e-2014:** spells 319/319 (100%), monsters 334/334 (100%), equipment 597/598 (99.8%),
  classes 12/12, species 9/9. **5e-2024:** spells 339/339 (100%), feats 17/17,
  species 9/9, equipment 443/443 (100%), monsters 329/330 (99.7%).
- **PF2e:** spells 537/537 (100%), feats 814/814 (100%), monsters 413/413 (100%),
  backgrounds 35/35 (100%), equipment 464/467 (99.4%). **PF1e:** spells 622/623 (99.8%),
  feats 176/176 (100%), monsters 331/346 (95.7%).
- **M&M 3e:** powers 40/40, advantages 73/73 — **genuinely complete.**
- **Daggerheart:** domain cards 189/189, domains 9/9 — **genuinely complete.**
- All four spell-heavy systems (PF2e, PF1e, 5e-2014/2024, 3.5e) are now at ~100% spell
  coverage; the real residual gaps are non-spell (3.5e/PF1e monsters, M&M equipment).
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
  giving spells 604/605 (99.8%), feats 110/110 (100%), and equipment 152/152 (100%),
  now all wired against the pinned core-only roster. The 3.5e monster row is wired but
  sits at 292/364 (80.2%) — a genuine remaining gap (some of the shortfall is the
  age/size-variant denominator shape-mismatch tracked in the Master Gap Ledger).
- Remaining content gaps are now narrow and enumerated in
  `docs/generated/master-gap-ledger.json`: D&D 3.5e monsters 80.2%, PF1e monsters
  95.7%, M&M equipment 39.8%, plus a handful of 1–3 item naming/typo gaps. Most
  categories across all 7 systems are at 100% (see `docs/generated/srd-coverage.md`).
- Remediate the remaining under-covered categories (encode the genuinely-missing SRD
  entries) and keep the provenance reverse-diff guard green.
- Decide whether to fold genuine coverage into the headline metric / replace the
  loader-mirror `docs/srd-manifest/` numbers.

## 2. Compute (Denominator B) — register completeness + engine wiring

The registers read 100%, but two real gaps sit behind that:

**Rebalancing pass (done):** the registers were levelled so no system is
neglected — each now holds 26–28 verified quantities across L1–L10 (previously
13–28, with Daggerheart the outlier at 13). All additions were genuine,
SRD-cited RAW math, not padding (see `docs/STATUS.md` for the list). This closed
several items below; the remainder is the honest residual.

- **Registers are a curated subset of the goal's full L1–L10 spec, not the
  exhaustive enumeration.** A complete register would be much larger and partly
  `missing`. Notably absent / uncounted today:
  - L3: full damage assembly with riders wired (Sneak Attack / Rage / Divine
    Smite / GWM / Sharpshooter / two-weapon / versatile); 5e Extra Attack counts;
    3.5e/PF1e crit confirmation. (Daggerheart critical damage + Spellcast dice,
    and M&M attack/Affliction/Damage DCs, are now covered.)
  - L5: prepared/known spell counts; upcasting; full PF2e heightening (only
    auto-heighten rank is covered). (3.5e/PF1e bonus-spells-by-ability done.)
  - L6: speed with armor/Str penalty still open. **Done:** 3.5e/PF1e carrying
    capacity, load categories, encumbrance penalties, and lift/drag limits;
    PF2e Bulk limits.
  - L7: ASI/feat cadence still open. **Done:** 3.5e XP-to-level table; M&M
    starting power points + hero points; Daggerheart short-rest recovery,
    Experience bonus, starting Hope; PF2e/3.5e HP/death state.
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
- **Several "verified" quantities are tested helpers, not engine-wired.** Spell
  save DC, spell attack, passive Perception, concentration DC, cantrip scaling,
  Monk/Barbarian Unarmored Defense, iterative attacks, PF2e MAP/striking/bulk/
  heighten, M&M measurements: the RAW formula is proven by
  test, but `prepareData` / the character sheet does not actually compute or
  display it. Wiring these into the engines is outstanding. **(3.5e skill synergy,
  max-rank enforcement, and the full check penalty are now wired** —
  synergy applies in both the skills tab and `rollCheck`; the skills tab shows
  each skill's RAW rank cap and flags over-cap values; the check penalty applies
  to physical skills from both carried weight (encumbrance) and the equipped
  armor/shield armor-check penalty, sourced from the catalog-backed equip flow.
  Conditional and Knowledge-subtype synergies stay manual. Cleric domain, wizard
  specialist, and Dragon Disciple bonus spell slots are also now auto-resolved
  into the spells-per-day totals.)
- **Stricter spec criteria not met:** comprehensive typed-bonus *stacking* tests
  (e.g., 3.5e dodge-stacks-but-others-don't); the content×compute cross-product
  fixtures (Monk+shield AC, PF2e striking+enfeebled as combined cases);
  build-legality validators that REJECT illegal and ACCEPT legal builds (only M&M
  PL-cap detection exists).

## 3. Bestiaries / RFC 004

`docs/rfc/004-monster-product-surface.md` is a **proposal only**. No monster data
was added for 3.5e/PF1e/PF2e/M&M/Daggerheart, and the MASTER_PLAN "no monster
product surface" boundary was **not** flipped. Bestiaries are unbuilt and gated on
the same external open-content data as §1.

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
- README.md and MASTER_PLAN.md not updated to declare completion / cite both
  denominators (only STATUS.md was, and it explicitly does not claim
  RAW-coverage-complete).
- `npm run verify` not confirmed fully green end-to-end: lint, format, tests,
  validate, repo-hygiene, generated-docs, doc-drift, dead-code pass; full `build`,
  `check:bundle-size`, and coverage-threshold runs were not executed end-to-end,
  and Playwright `test:e2e` cannot run in this container (no browsers).

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
