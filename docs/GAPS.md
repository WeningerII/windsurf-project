# Completion Gaps — Outstanding Work Toward RAW-Completeness

This file enumerates what remains for the two-denominator completion goal, so gaps
are tracked explicitly rather than implied. Live numbers: `docs/generated/roadmap-metrics.md`.
Current-state summary: `docs/STATUS.md`. Both denominators' tooling lives in
`docs/srd-manifest/` (content) and `docs/compute-register/` (engine math).

**Snapshot:** Engine math (Denominator B) is verified across the quantities the
compute registers enumerate. Content (Denominator A) is provenance-complete
(catalog parity — every shipped open-content entry is encoded, loader-backed,
source-tagged, policy-clean) but is **not** independent published-SRD coverage.

---

## 1. Content (Denominator A) — independent SRD coverage [UNBLOCKED; 6 of 7 systems measured; 3.5e pending clean scope]

**Update:** the blocker is resolved. The container's Node runtime fetches the
open-content SRD datasets from GitHub raw in full (the `WebFetch` *tool* truncates;
Node `fetch()` does not). Verified independent sources for all 7 systems are in
`docs/srd-sources.md`. `npm run srd:coverage` builds the genuine coverage report at
`docs/generated/srd-coverage.md` (independent SRD lists diffed against the loaders
by normalized name, each scoped to the policy's `allowedSources`) — real coverage,
unlike the loader-derived `docs/srd-manifest/`.

**Measured (live numbers in `docs/generated/srd-coverage.md`):**
- **5e-2014:** spells 214/319 (67%), monsters 38/334 (11%), equipment 189/598 (32%),
  classes 12/12, species 9/9. **5e-2024:** spells 283/319 (89%), feats 12/17,
  species 7/9, equipment 145/443 (33%).
- **PF2e:** Core spells 129/537 (24%). **PF1e:** Core spells 131/623 (21%).
- **M&M 3e:** powers 40/40, advantages 73/73 — **genuinely complete.**
- **Daggerheart:** domain cards 189/189, domains 9/9 — **genuinely complete.**
- So two non-5e systems (M&M, Daggerheart) are at true 100% independent coverage on
  the wired categories; the Pathfinder/5e *spell* catalogs carry real gaps.
- **Provenance finding:** SRD 5.1 contains exactly **1 background (Acolyte)** and
  **1 feat (Grappler)**, but the loader ships 6 backgrounds and 39 feats tagged to
  pass the SRD-5.1 policy — i.e. it carries non-SRD-5.1 content. Audit against
  `src/utils/openContentPolicy.ts` (open-content-only is a hard product rule).
- The 5e-database 2024 monsters file looks partial (~3 entries) — validate that
  source before trusting the 2024 monster row.

**Still to do (sources in `docs/srd-sources.md`):**
- **D&D 3.5e** is the one unwired system: its `Rughalt/D35E` packs mix SRD-3.5 core
  with Psionics and Epic, and no clean core-only tag is exposed, so it is omitted
  from the report rather than measured against an inflated denominator. Needs either
  a core-only filter or a clean source (e.g. `olimot/srd-v3.5-md`).
- Wire the remaining categories (PF2e/PF1e non-spell, M&M skills/conditions/
  equipment, Daggerheart classes/ancestries/communities/weapons/armor, all monsters).
- Remediate under-covered categories (encode missing SRD entries — e.g. PF2e/PF1e/5e
  spells) and the provenance over-inclusion (re-source or re-scope mislabeled entries).
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
  - L10: 3.5e/PF1e CR↔XP & Encounter Level and wealth-by-level still open.
    **Done:** PF2e creature XP by level difference and encounter budget; M&M
    equipment points and measurements doubling.
- **Several "verified" quantities are tested helpers, not engine-wired.** Spell
  save DC, spell attack, passive Perception, concentration DC, cantrip scaling,
  Monk/Barbarian Unarmored Defense, iterative attacks, PF2e MAP/striking/bulk/
  heighten, 3.5e synergy/max-rank, M&M measurements: the RAW formula is proven by
  test, but `prepareData` / the character sheet does not actually compute or
  display it. Wiring these into the engines is outstanding.
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

- `supportLevel` not flipped to `'full'` for D&D 3.5e, PF1e, Daggerheart (correct —
  coverage isn't proven).
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

The 4,216-entry loader-mirror manifests under `docs/srd-manifest/` are honest
(catalog/provenance) but somewhat redundant with the loaders. Decide whether they
belong in-repo as committed files or should be regenerated on demand once a real
independent denominator exists.

---

**Highest-leverage unblock:** the §1 data input. With authoritative SRD/CRB
indices in-repo, content coverage becomes measurable and the rest of Denominator A
is mechanical. Next-largest body of genuine work: §2 — expand the compute
registers to the full L1–L10 set and wire the proven helpers into the engines.
