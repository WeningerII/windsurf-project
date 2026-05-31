# Open-Content SRD Sources (verified 2026-05-31)

Authoritative, open-content sources for each registered system's SRD, with
machine-readable forms usable to build **independent** content denominators
(see `docs/GAPS.md` §1 and the `npm run srd:coverage` tool). Verified via the
deep-research workflow: GitHub `raw.githubusercontent.com` files were fetched and
confirmed (this environment's Node runtime fetches them fully, without the
truncation the `WebFetch` tool imposes); official publisher sites (WotC, Paizo,
Green Ronin, Darrington, Archives of Nethys, d20*srd) are live but 403 automated
fetchers behind WAFs, so they are confirmed via search indexing.

## D&D 5e — SRD 5.1 (2014) & SRD 5.2 (2024)

- **Official (CC-BY-4.0):** SRD 5.1 PDF `https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf`; SRD 5.2 PDF `https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.pdf`; hub `https://dnd.wizards.com/resources/systems-reference-document`.
- **Machine-readable (primary):** `5e-bits/5e-database` (code MIT, data OGL 1.0a), default branch `main`, **nested by year + locale**:
  - 2014: `https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en/5e-SRD-Spells.json` (+ `-Classes`, `-Subclasses`, `-Races`, `-Subraces`, `-Feats`, `-Equipment`, `-Magic-Items`, `-Monsters`, `-Backgrounds`, `-Features`, `-Traits`).
  - 2024: `https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2024/en/5e-SRD-Classes.json` (+ `-Species`, `-Subspecies`, `-Feats`, `-Equipment`, `-Magic-Items`, `-Monsters`, `-Backgrounds`, `-Weapon-Mastery-Properties`). **No 2024 Spells file in 5e-database**, and SRD 5.2 spells genuinely differ from SRD 5.1 (**339 vs 319** — 5.2 adds Chromatic Orb, Divine Smite, Hex, Ray of Sickness, Power Word Heal, etc., and renames e.g. Feeblemind→Befuddlement). The authoritative SRD 5.2.1 spell list is parsed from `downfallx/dnd-5e-srd-markdown` `spells.md` (CC-BY-4.0): `https://raw.githubusercontent.com/downfallx/dnd-5e-srd-markdown/master/spells.md` — wired as the 2024 spell denominator in `npm run srd:coverage`.
- **CC-BY-4.0 JSON alt:** `Tabyltop/CC-SRD`. **REST/GraphQL API:** `https://www.dnd5eapi.co/` (data = 5e-database).
- **Counts (verified):** SRD 5.1 spells = **319**; SRD 5.1 backgrounds = **1** (Acolyte); SRD 5.1 feats = **1** (Grappler); SRD 5.1 monsters ≈ **334** (per 5e-database). SRD 5.2 spells = **339** (downfallx markdown), ≈ 361pp, ~325 monster stat blocks, 4 backgrounds, 17 feats. (The 5e-database 2024 monsters file appears partial — validate before use.)

## D&D 3.5e — SRD 3.5 (OGL 1.0a)

- **Official upstream:** Internet Archive `https://archive.org/details/dnd35srd` (original WotC RTF/PDF). OGL text `https://www.d20srd.org/ogl.htm`.
- **Human-readable:** `https://www.d20srd.org/` (Hypertext d20 SRD), `http://dndsrd.net/`, `https://srd.dndtools.org/`. **NOTE:** Archives of Nethys does **not** host a 3.5 SRD.
- **Machine-readable (verified):** `Rughalt/D35E` (Foundry, OGL), NeDB JSON-lines under `packs/` — `https://raw.githubusercontent.com/Rughalt/D35E/master/packs/spells.db` (**673**, incl. psionics+epic), `feats.db` (388), `bestiary.db` (645), `classes.db` (33), + magic-items/weapons/armor. Also `olimot/srd-v3.5-md` (clean Markdown, OGL). **Scope caveat:** D35E is SRD 3.5 **plus** Psionics + Epic — filter to core SRD for a clean denominator.

## Pathfinder 1e — Core Rulebook / PRD (OGL 1.0a)

- **Human-readable (OGC):** `https://pathfinder.d20srd.org/` (clean per-book URLs — use `coreRulebook/` prefix to isolate Core), `https://legacy.aonprd.com/`, `https://www.d20pfsrd.com/`, `https://www.aonprd.com/`.
- **Machine-readable (verified):** `wolfgangcodes/pathfinder-spellbook` — `https://raw.githubusercontent.com/wolfgangcodes/pathfinder-spellbook/master/data/spells.csv` (**1,689** spells, has a `source` column → filter `PFRPG Core` for Core ≈ 352). Foundry `pf1` system (GitLab `foundryvtt_pathfinder1e/foundryvtt-pathfinder1`, per-entry YAML, OGL) for classes/races/feats/items/monsters. Monsters: `c0d3rman/PathfinderMonsterDatabase` (scraper, no prebuilt data).
- **Counts (corrected):** Core spells ≈ **352** (not 600+; 600 was the page count); full PRD ≈ 1,689. Bestiary 1 = 309 monsters. **Repo policy scopes PF1e to Core Rulebook**, so use Core-filtered denominators.

## Pathfinder 2e — Core Rulebook (OGL/ORC)

- **Human-readable (official SRD):** `https://2e.aonprd.com/`; ORC license `https://paizo.com/orclicense`.
- **Machine-readable (verified):** `Pf2eToolsOrg/Pf2eTools` — book-segmented JSON, Core via `https://raw.githubusercontent.com/Pf2eToolsOrg/Pf2eTools/master/data/spells/spells-crb.json` (`source:"CRB"`) + matching `bestiary/`, `class/`, `ancestries/`, `feats/`, `items/` CRB files (index `data/spells/index.json`). Also `foundryvtt/pf2e` `packs/` (per-item JSON, embedded `publication.license`/`remaster` tags — full corpus) and successor `Pf2ools/pf2ools-data`.
- **Counts:** Paizo gives no exact spell integer; derive by counting `spells-crb.json`. Bestiary 1 > 400 monsters. **Repo policy scopes PF2e to Core Rulebook.**

## Mutants & Masterminds 3e — Hero's Handbook SRD (OGL 1.0a)

- **Human-readable:** `https://www.d20herosrd.com/` (Hypertext M&M 3e SRD; OGL — note "Hero Points"→"Victory Points", "Power Points"→"Character Points" renames). Green Ronin free downloads `https://greenronin.com/freeronin/...`.
- **Machine-readable (verified by clone):** `frnprt/mm3e-character-creator` (GPL-3.0 code; data in `js/data.js` derived from d20herosrd) — powers/effects **46**, advantages **77**, skills **16**, abilities 8, conditions **28**, equipment ~100. Matches the Hero's Handbook.

## Daggerheart — SRD 1.0 (Darrington Press Community Gaming License)

- **Official:** SRD page `https://www.daggerheart.com/srd/`; SRD 1.0 PDF `https://www.daggerheart.com/wp-content/uploads/2025/05/DH-SRD-May202025.pdf`; license `https://darringtonpress.com/license/`.
- **Machine-readable (verified by clone):** `Batres3/daggerheart-srd` (DPCGL; MD + CSV + JSON) — domains **9**, domain cards **189**, classes **9**, subclasses **18**, ancestries **18**, communities **9**, adversaries **129** (T1 52 / T2 36 / T3 23 / T4 18), environments **19**, weapons 192, armor 34, consumables 60, items 60.

---

**Usage:** `npm run srd:coverage` fetches the independent lists above (where wired)
and diffs them against the product loaders by normalized name, writing
`docs/generated/srd-coverage.md` — the genuine coverage/gap report. 5e (2014/2024)
is wired today; the other systems' sources are documented here and pending wiring
(scope each to the policy's `allowedSources`: 5e → full SRD; PF1e/PF2e → Core
Rulebook; 3.5e → core SRD excluding psionics/epic; M&M → Hero's Handbook;
Daggerheart → SRD 1.0).
