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

## 1. Content (Denominator A) — independent SRD coverage [BLOCKED on external data]

The manifests are **loader-derived**, so they cannot detect entries the published
SRD contains but the loaders omit. The coverage figures below are unmeasured;
counts are approximate recall (verifying them is the gap).

- **Spells (likely large shortfalls, unquantified):** PF1e 134 vs CRB ~600+;
  PF2e 143 vs CRB ~1,500+; D&D 3.5e 428 vs full SRD ~700+; 5e-2014 244 vs
  SRD 5.1 ~319; 5e-2024 320.
- **Monsters / bestiary — absent for 5 systems:** D&D 3.5e, PF1e, PF2e, M&M, and
  Daggerheart have 0 monsters (5e-2014 41, 5e-2024 99).
- **Categories never independently enumerated:** subclasses / archetypes /
  prestige as their own denominators; heritages; backgrounds (independent
  counts); feats with gate/prereq metadata; equipment subtypes incl. PF2e runes;
  M&M devices/adversaries; Daggerheart domains / all domain cards / adversaries /
  environments.
- **Root blocker (tested, not assumed):** an independent SRD index is reachable
  on public GitHub raw, but `WebFetch` truncates large files (returned 12 of
  ~300 spells, no reliable total), `api.github.com` returns 403, and the GitHub
  MCP tools are scoped to this repo only. A complete, accurate independent
  denominator cannot be extracted with current tooling; an incomplete one would
  be a wrong denominator, so it is not used.
- **Unblock:** drop authoritative SRD/CRB index files (raw JSON of ids/names per
  category per system) into the repo, or provide a non-truncating fetch. Then a
  generator compares them against the loaders to produce a real coverage/gap
  report, and `docs/srd-manifest/` becomes a genuine independent denominator.

## 2. Compute (Denominator B) — register completeness + engine wiring

The registers read 100%, but two real gaps sit behind that:

- **Registers are a curated subset of the goal's full L1–L10 spec, not the
  exhaustive enumeration.** A complete register would be much larger and partly
  `missing`. Notably absent / uncounted today:
  - L3: full damage assembly with riders wired (Sneak Attack / Rage / Divine
    Smite / GWM / Sharpshooter / two-weapon / versatile); 5e Extra Attack counts;
    3.5e/PF1e crit confirmation.
  - L5: prepared/known spell counts; upcasting; full PF2e heightening (only
    auto-heighten rank is covered).
  - L6: speed with armor/Str penalty; 3.5e/PF1e load tables; (PF2e Bulk limits
    are covered as a helper).
  - L7: ASI/feat cadence; XP-to-level tables; attunement slots; inspiration / hero
    points.
  - L8: resist/vuln/immune damage transforms; PF2e dying/wounded/recovery track;
    death saves outside 5e.
  - L9: point-buy ability arrays; feat/prereq gating; multiclass slot/save/BAB/prof
    stacking as *validators* (only M&M PL caps exist).
  - L10: 3.5e/PF1e CR↔XP & Encounter Level; PF2e encounter budget; wealth-by-level
    (only M&M measurements doubling is covered).
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
