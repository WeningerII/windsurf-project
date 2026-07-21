# Proposal: Sourcing PF1e Core Rulebook EQUIPMENT

**Status:** recommendation, awaiting encode follow-on
**Author:** research pass, 2026-07-20
**Scope of this doc:** decide whether a clean, machine-readable, OGC/OGL Pathfinder 1e
**equipment** list scoped to the **Core Rulebook** is reachable and pinnable — or whether
to formalize an honest exclusion. This is the last "source-blocked" content gap.
**Out of scope (explicit follow-on, not this doc):** encoding data, editing `src/data/**`,
running any encoder, running `npm run srd:coverage`, editing `docs/srd-sources.md` /
`docs/generated/**` / the gap ledger.

---

## TL;DR

A clean source **is reachable**, and it is the **same repository already pinned for the
PF1e Bestiary** — `devonjones/PSRD-Data` — using its book-scoped `core_rulebook/item/`
directory. Every entry is tagged `source: "Core Rulebook"`, carries a `pfsrd://` `url`
that locates it precisely in the CRB chapter tree (so equipment vs. magic items splits
cleanly), and ships structured `misc` weapon/armor/gear data plus `price`/`weight`. This
mirrors the bestiary discipline exactly (book-scoped directory + pinned manifest + honest
mapping). **Recommend Option A.**

---

## What the product ships today (the gap)

`loadEquipmentForSystem('pf1e')` → `loadPf1eEquipment()` aggregates
`src/data/pathfinder/1e/equipment/` (index re-exports `weapons`, `armor`,
`adventuring-gear`, `magic-items`). Current entry counts:

| File | Entries shipped |
| --- | ---: |
| `weapons.ts` | 21 |
| `armor.ts` | 12 |
| `adventuring-gear.ts` | 10 |
| `magic-items.ts` | 24 |
| **total** | **~67** |

Against a Core Rulebook that contains **243 mundane equipment** items and **347 magic
items** (see counts below), the shipped PF1e equipment set is a small hand-authored
sample, not a measured denominator. There is no independent equipment denominator wired
into `npm run srd:coverage` for PF1e (only spells and Bestiary-1 monsters are wired). That
is the gap.

---

## Candidates evaluated

### Candidate 1 — devonjones/PSRD-Data `core_rulebook/item/` (WINNER)

Same repo already used for the PF1e Bestiary (`bestiary/creature/`, pinned as
`scripts/data/pf1e-bestiary-manifest.json`, encoded by `scripts/encode-pf1e-monsters.mjs`).

- **Reachability (verified):** `github.com` HTML 403s the WAF (as documented), but the git
  protocol works. `git ls-remote --symref https://github.com/devonjones/PSRD-Data.git HEAD`
  → default branch is **`release`** (not `master`). A blobless sparse clone of
  `core_rulebook/item` succeeded in this environment.
- **License (settled):** PSRD-Data is the PSRD-parser output of Paizo's **PRD** (Pathfinder
  Reference Document) — **Open Game Content under OGL 1.0a**. `docs/srd-sources.md` already
  vets this exact repo as "PSRD-parser output of Paizo's PRD (OGC)" and pins it for the
  bestiary. The repo ships `book-ogl.db` (the OGL / Section 15 legal file). This is the
  **identical license basis already accepted** for shipped PF1e monster data — no new
  license question is opened.
- **Core scoping (clean, two ways over):** (1) the directory itself — `core_rulebook/` — is
  already CRB-scoped, and (2) every item carries `source: "Core Rulebook"` **and** a
  `pfsrd://` `url` whose path segments locate the exact chapter. Verified: **all 590 files
  tagged `source: "Core Rulebook"`, 0 files with a `url` missing the `Rules` segment.** The
  `url` splits equipment from magic items with zero ambiguity:
  - `.../Rules/Equipment/Weapons/Weapon Descriptions/…`
  - `.../Rules/Equipment/Armor/Armor Descriptions/…`
  - `.../Rules/Equipment/Goods And Services/<sub>/…`
  - `.../Rules/Equipment/Special Materials/…`
  - `.../Rules/Magic Items/<Rings|Rods|Staves|Weapons|Armor|Wondrous Items|…>/…`
- **Machine-readable (verified):** one JSON per item; structured fields `name`, `source`,
  `type: "item"`, `weight`, `price`, `url`, and a typed `misc` block:
  - Weapons: `misc.Weapon` = `{ "Weapon Class", "Dmg (M)", "Dmg (S/L/T)", "Critical",
    "Type" (S/P/B), "Proficiency" }`
  - Armor: `misc.Armor` = `{ "Armor Bonus", "Maximum Dex Bonus", "Armor Check Penalty",
    "Arcane Spell Failure Chance", "Armor Type", "Speed (20/30 ft.)" }`
  - Gear: `misc.null."Gear Type"` (e.g. "Adventuring Gear")
  - Magic items: `slot`, `cl`, `aura`, `sections[]`, `misc.Construction`
- **Counts (verified in `core_rulebook/item/**`, 590 JSON files):**

  | Bucket (by `url` segment) | Count |
  | --- | ---: |
  | **Equipment (mundane) — total** | **243** |
  | &nbsp;&nbsp;Weapons / Weapon Descriptions | 81 |
  | &nbsp;&nbsp;Armor (incl. shields) | 21 |
  | &nbsp;&nbsp;Special Materials | 6 |
  | &nbsp;&nbsp;Goods & Services — total | 135 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Adventuring Gear | 64 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Tools and Skill Kits | 16 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Mounts and Related Gear | 13 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Clothing | 12 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Transport | 11 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Special Substances and Items | 10 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Spellcasting and Services | 7 |
  | &nbsp;&nbsp;&nbsp;&nbsp;Food | 2 |
  | **Magic Items — total** | **347** |
  | &nbsp;&nbsp;Wondrous Items | 177 |
  | &nbsp;&nbsp;Rings | 34 |
  | &nbsp;&nbsp;Weapons (specific magic) | 30 |
  | &nbsp;&nbsp;Specific Cursed Items | 29 |
  | &nbsp;&nbsp;Rods | 24 |
  | &nbsp;&nbsp;Staves | 21 |
  | &nbsp;&nbsp;Armor (specific magic) | 20 |
  | &nbsp;&nbsp;Artifacts | 12 |
  | **Grand total** | **590** |

### Candidate 2 — Foundry `pf1` system (GitLab `foundryvtt_pathfinder1e/foundryvtt-pathfinder1`)

- **Reachability:** GitLab project page returns **200** (reachable). Per-entry YAML, OGL,
  includes items/equipment (as `docs/srd-sources.md` notes).
- **Why not chosen:** (a) **Core scoping is harder** — Foundry's item compendia mix content
  across many Paizo books, and per-entry source metadata is not a clean single
  `"Core Rulebook"` tag the way PSRD's book-directory + `url` chapter path is; isolating CRB
  would require a source-tag/allow-list pass with more judgment calls. (b) It is a **new
  source family on a different host** (GitLab) — adopting it duplicates provenance surface
  when the bestiary already pins PSRD-Data on GitHub. (c) No advantage in machine-readability
  over PSRD's per-item JSON. It remains a viable fallback if PSRD-Data ever regresses.

### Rejected earlier (context)

`c0d3rman/PathfinderMonsterDatabase` — scraper, no prebuilt data (already rejected for the
bestiary; not an equipment source anyway).

---

## Option A — SOURCE IT (recommended)

**Winning source:** `devonjones/PSRD-Data`, branch `release`, path `core_rulebook/item/**`.
**License:** OGL 1.0a / Open Game Content (Paizo PRD) — already accepted for PF1e monsters.
**Repo URL:** `https://github.com/devonjones/PSRD-Data` (fetch via git; `book-ogl.db` carries
the OGL). Bestiary already sources the same repo.

### Core-scoping approach

Read only `core_rulebook/item/**` (already CRB-scoped by directory), and bucket each entry
by its `url` path segment after `Rules`:
- `Equipment` → the **EQUIPMENT** denominator (mundane weapons, armor, special materials,
  goods & services). Further sub-bucket by the next segment (Weapons / Armor / Special
  Materials / Goods And Services).
- `Magic Items` → a **separate MAGIC-ITEMS** denominator (same encoder pass, cleanly split).

This gives a defensible, self-documenting split with no name heuristics — the equivalent of
how the bestiary relied on the `bestiary/creature/` directory for Bestiary-1 scoping.

### Encoder + manifest plan (mirrors the bestiary pipeline exactly)

1. **New encoder** `scripts/encode-pf1e-equipment.mjs` (sibling of
   `scripts/encode-pf1e-monsters.mjs`), reading a **local sparse clone** — the repo carries
   large SQLite `.db` artifacts, so blobless + sparse, identical to the monster encoder:
   ```
   git clone --depth 1 --filter=blob:none --sparse \
     https://github.com/devonjones/PSRD-Data.git /tmp/psrd
   git -C /tmp/psrd sparse-checkout set core_rulebook/item
   npx tsx scripts/encode-pf1e-equipment.mjs /tmp/psrd
   ```
2. **Emits GENERATED, bucketed typed data** into `src/data/pathfinder/1e/equipment/`
   (e.g. `srd-weapons.ts`, `srd-armor.ts`, `srd-gear.ts`, `srd-magic-items.ts`), each with
   the "GENERATED by … hand-written wins on name match" header the monster buckets use. The
   `index.ts` re-exports them so `loadPf1eEquipment()` picks them up with no loader change.
   Existing hand-authored entries win on name match (same rule as monsters).
3. **Writes the pinned manifest** `scripts/data/pf1e-equipment-manifest.json` — the verbatim
   upstream file list `[{ file, name, scope }]` where `scope ∈ {equipment, magic}` is derived
   from the `url`. Same rationale as the bestiary manifest: GitHub's tree HTML truncates and
   its API rate-limits, so the pinned file keeps the `srd:coverage` denominator exact and
   reproducible.
4. **Follow-on wiring (also a follow-on, not this doc):** add PF1e `equipment` (and,
   optionally, `magic items`) `CoverageTarget`s to `src/scripts/srd-coverage.ts`, SRD side =
   manifest names filtered by `scope`, loader side = `loadEquipmentForSystem('pf1e')` — the
   same shape as the wired 5e and M&M equipment targets.

### Manifest denominator

- **Primary "EQUIPMENT" denominator = 243** (the `Equipment`-scoped entries).
- **Companion "magic items" denominator = 347** (the `Magic Items`-scoped entries), same
  file, filtered by `scope`. (5e's coverage target unions Equipment + Magic-Items = 590; PF1e
  can mirror that union or keep the two split — recommend **split**, since PF1e ships them in
  separate loader files and the `url` gives a free, honest boundary.)

### Honest-mapping rules the encoder must carry (mirroring the bestiary's "never guessed")

- **Price** appears as `"10 gp"`, `"200 gp"`, and many qualified/rate forms: `"10 gp/flask"`,
  `"50 gp/vial"`, `"1 gp/20"`, `"+50 gp"` (add-on), `"3 cp per mile"`, `"5 cp/per day"`.
  Parse the leading `N <cp|sp|gp|pp>` into structured `{ amount, currency }`; keep the
  qualifier (`/flask`, `per mile`) as prose. **20 equipment items** have no numeric price
  (`"&mdash;"`, `"None"`, `"special"`, or the formula `"Caster level × spell level × 10 gp"`)
  — leave those **UNASSERTED**, never invented.
- **Weight** appears as `"6 lbs."`, `"2 lbs.1"` (trailing footnote digit to strip), `"+10 lbs."`
  (add-on), `"&mdash;"`/`None`/`"special"`. **51 equipment items** have no concrete weight
  (negligible) — encode as omitted/0, not guessed.
- **HTML entities** in source strings (`&times;`, `&ndash;`, `&mdash;`) must be decoded.
- **Weapon `misc.Weapon`** → `weaponType` (from Proficiency: Simple/Martial/Exotic),
  `category` (melee/ranged from Weapon Class), `damage`/`damageType` (from `Dmg (M)` +
  `Type` S/P/B). **Armor `misc.Armor`** → armor bonus / max-dex / ACP / ASF / armor type.
  Anything unparseable stays prose; the FIRST/structured field parses, riders stay text —
  same discipline as the monster attack-clause parser.

---

## Option B — EXCLUDE IT (not recommended; provided for completeness only)

Option B does **not** apply: the source is genuinely OGC, cleanly Core-scopeable (by
directory **and** per-entry `url`/`source` tag), machine-readable, and stably pinnable in the
same repo already trusted for the bestiary. No honest exclusion is warranted for PF1e
equipment. (Were an exclusion ever needed, the wording pattern would follow the accepted
boundaries in `src/data/pathfinder/1e/…` / `docs/srd-manifest/_exclusions.ts`, stating the
category, the reason, and that it is an accepted boundary rather than unfinished work — but
that is not the situation here.)

---

## VERDICT

**RECOMMEND: source via `devonjones/PSRD-Data` `core_rulebook/item/`** (OGL 1.0a / PRD OGC,
`release` branch) — 243 Core equipment + 347 Core magic items, pinned manifest +
`scripts/encode-pf1e-equipment.mjs`, mirroring the Bestiary-1 pipeline.
