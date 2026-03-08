# Project Status

**Last verified:** March 7, 2026 (against actual codebase, not doc claims)

---

## Architecture

**Pattern:** Document & Data Model (Foundry VTT-inspired)

| Layer | Key Files |
|-------|-----------|
| Document model | `src/types/core/document.ts` → `CharacterDocument<T>` |
| System registry | `src/registry/index.ts` → `SystemRegistry` singleton |
| Engine interface | `src/registry/types.ts` → `SystemEngine<T>` (prepareData, rollCheck, applyDamage) |
| Per-system definitions | `src/systems/*/definition.ts` |
| Per-system engines | `src/systems/*/engine.ts` |
| Per-system sheets | `src/systems/*/components/*.tsx` or `src/systems/*/sheet.tsx` |
| Persistence | `src/utils/documentStorage.ts` → localStorage + IndexedDB dual-write |
| Hooks | `src/hooks/useDocuments.ts` → primary CRUD hook with undo/redo (50-entry history) |

---

## Registered Systems (7)

All registered in `src/systems/index.ts`.

| System | ID | Engine | Sheet | SRD Data | Template Automation |
|--------|----|--------|-------|----------|-------------------|
| D&D 5e 2014 | `dnd-5e-2014` | ✅ Full | ✅ Native | ✅ 238 spells, 12 classes, 9 species, 41 monsters, 230 equipment, 106 feature options | ✅ Class/species/background templates + feature-option browse/persistence |
| D&D 5e 2024 | `dnd-5e-2024` | ✅ Full | ✅ Native | ✅ 315 spells, 12 classes, 9 species, 99 monsters, 204 equipment, 87 feats | ✅ Class/species/background templates + feat ASI/proficiency automation |
| D&D 3.5e | `dnd-3.5e` | ✅ Full | ✅ D20LegacySheet (shared) | ✅ 555 spells, 11 classes, 7 species, 207 equipment, 515 feats | ✅ Class/race templates |
| Pathfinder 1e | `pf1e` | ✅ Full | ✅ D20LegacySheet (shared) | ✅ 134 spells, 18 classes, 7 species, 12 traits, 70 equipment, 86 feats | ✅ Class/race templates + vetted prestige-class support |
| Pathfinder 2e | `pf2e` | ✅ Full | ✅ Native | ✅ 146 spells, 12 classes, 6 species, 16 backgrounds, 188 equipment, 93 feats, 5 archetypes | ✅ Class/ancestry/background templates |
| M&M 3e | `mam3e` | ✅ Full | ✅ Native | ✅ 61 powers, 74 advantages, 150 equipment, 15 archetypes, 28 complications, 101 power modifiers | N/A (point-buy; reference/pinning surfaces only) |
| Daggerheart | `daggerheart` | ✅ Scaffold (2d12 Hope/Fear) | ✅ Manual-entry sheet | ❌ No data files exist | ❌ None |

### Daggerheart Reality Check

Daggerheart is registered and selectable but is **scaffold-only**:
- `src/data/daggerheart/` does not exist
- `dataLoader.ts` has no daggerheart case — returns `[]` for all content types
- Sheet is 18KB of manual-entry fields with no browse tabs
- Engine handles basic 2d12 Hope/Fear rolls and derived stats

---

## Engine Capabilities (per system)

### All d20 Systems (5e-2014, 5e-2024, 3.5e, PF1e, PF2e)
- Ability score modifiers
- AC from equipped armor/shield (`src/utils/armorClass.ts`)
- HP calculation
- Skill checks with proficiency
- Saving throws
- Damage/healing with temp HP absorption

### D&D 5e (2014 + 2024)
- Proficiency bonus from total class levels
- Multiclass spell slot computation (`src/utils/spellSlots.ts`)
- Death saves tracking
- Exhaustion/condition effects
- Short/long rest recovery (`src/utils/dnd5eRest.ts`)
- Hit dice tracking
- 2024-specific: Alert feat initiative (higher of DEX/INT)

### D&D 3.5e + PF1e
- BAB with iterative attacks
- Fort/Ref/Will saves with good/poor progressions
- Grapple (3.5e) / CMB+CMD (PF1e)
- Size modifiers
- Vancian spell slots from class progression tables
- PF1e: Class skill +3 bonus, favored class bonus

### Pathfinder 2e
- 4-tier proficiency (U/T/E/M/L)
- HP from ancestry + class die + CON per level
- Degree of success (crit success/failure with nat 20/1 step)
- Condition penalties (frightened, sickened, clumsy, enfeebled, stupefied)

### M&M 3e
- Point-buy validation (abilities, powers, advantages, skills)
- PL cap enforcement (attack+effect, defense+toughness, fort+will)
- Power cost with modifiers (extras/flaws)
- Toughness save → condition track (Bruised/Dazed/Staggered/Incapacitated)
- Skill check routing through rollCheck

---

## Template & Option Automation

| Template | File | Systems |
|----------|------|---------|
| D&D 5e class | `src/utils/classTemplate.ts` | dnd-5e-2014, dnd-5e-2024 |
| D&D 5e species | `src/utils/speciesTemplate.ts` | dnd-5e-2014, dnd-5e-2024 |
| D&D 5e background | `src/utils/backgroundTemplate.ts` | dnd-5e-2014, dnd-5e-2024 |
| D&D 5e feat | `src/utils/featTemplate.ts` | dnd-5e-2014, dnd-5e-2024 (user-facing selection/config currently exposed in 2024 sheet) |
| D&D 5e feature options | `src/utils/dnd5eFeatureOptions.ts` | dnd-5e-2014 (loader-backed browse/persist/provenance surface; downstream rules remain manual) |
| D20 legacy class | `src/utils/d20LegacyTemplate.ts` | dnd-3.5e, pf1e |
| D20 legacy race | `src/utils/d20LegacyTemplate.ts` | dnd-3.5e, pf1e |
| PF2e class | `src/utils/pf2eTemplate.ts` | pf2e |
| PF2e ancestry | `src/utils/pf2eTemplate.ts` | pf2e |
| PF2e background | `src/utils/pf2eTemplate.ts` | pf2e |

Templates and sheet automation populate proficiencies, features, HP, spell slots, ability adjustments, supported feat-derived ASIs/proficiencies, and 5e-2014 feature-option provenance when the user selects supported options.

---

## Shared UI Components

| Component | Used By |
|-----------|---------|
| SpellBrowser | 5e-2014, 5e-2024, 3.5e, PF1e, PF2e |
| EquipmentBrowser | 5e-2014, 5e-2024, 3.5e, PF1e, PF2e, M&M |
| FeatBrowser | 5e-2024, 3.5e, PF1e, PF2e |
| FeatureOptionBrowser | 5e-2014 |
| MamArchetypeBrowser | M&M |
| MamComplicationBrowser | M&M |
| MamPowerModifierBrowser | M&M |
| MonsterBrowser | 5e-2014, 5e-2024 |
| InventoryManager | 5e-2014, 5e-2024, 3.5e, PF1e, PF2e |
| DamageHealControl | 5e-2014, 5e-2024, 3.5e, PF1e, PF2e |
| DiceRollButton | All 6 d20+M&M systems |
| SpellSlotTracker | 5e-2014, 5e-2024, 3.5e, PF1e |
| CurrencyEditor | 5e-2014, 5e-2024, 3.5e, PF1e |
| HitDiceTracker | 5e-2014, 5e-2024 |
| ConditionPicker | PF2e (35 conditions with valued support) |
| RestControls | 5e-2014, 5e-2024, 3.5e, PF1e, PF2e |
| DeathSavesTracker | 5e-2014, 5e-2024 |
| CampaignManager | App-level (campaign CRUD + party tracking) |
| ConfirmDialog | App-level (replaces window.confirm) |

---

## Infrastructure

### Build & CI
- **Vite** with per-system manual chunk splitting + gzip/brotli compression
- **CI gates:** lint, Prettier check, unit tests, coverage (80% threshold), build, Playwright E2E, bundle size budget
- **Bundle:** ~545 KiB gzipped total JS, ~111 KiB critical path

### Storage
- **Primary:** IndexedDB (`rpg-character-sheet` db, `documents` store)
- **Fallback:** localStorage (`rpg-documents-v2` key)
- **Dual-write:** saves to both; loads IndexedDB first, falls back to localStorage
- **Auto-migration:** localStorage → IndexedDB on first load

### Testing
- **76 Vitest files** across `src/__tests__/` (run `find src/__tests__ -name '*.test.*' | wc -l` to verify)
- 7 engine test suites (all 7 registered systems now have baseline engine coverage)
- 24 component test suites
- 15 focused utility/template suites under `src/__tests__/utils/`
- 2 hook tests (useDocuments, useCampaigns)
- Integration tests for character creation + management flows
- Template pipeline integration tests (5e, PF2e, d20-legacy)
- Recent additions: direct regression coverage for `classTemplate`, `systemCatalog`, `backgroundTemplate`, `speciesTemplate`, `classSpellcasting`, `featTemplate`, `dnd5eRest`, and `dnd5eFeatureOptions`, plus baseline Daggerheart engine/sheet coverage, App warning cleanup, a Daggerheart Playwright create/persist workflow, shipped 5e subclass selection wired through the shared class template, shared 5e feat ASI/proficiency automation, a shared 5e 27-point-buy / standard-array ability planner, a loader-backed 5e-2014 feature-option browser with persistence/provenance coverage, a shared `TabsTrigger` click-composition fix so loader-backed tabs activate correctly, and M&M archetype/complication/modifier browser coverage tied to the new loader-backed sheet surfaces
- Full coverage gate passed on March 7, 2026 under Node `v22.18.0`: **3214 tests**, **80.65% branch coverage**
- **E2E:** 2 Playwright specs (`phase3-workflows.spec.ts`, `system-smoke.spec.ts`) — 6 tests covering D&D 5e-2024 plus a Daggerheart scaffold create/persist flow

### PWA
- Service worker (`public/service-worker.js`) + web manifest
- Caches app shell only (not per-system data chunks)

---

## Known Gaps & Honest Debt

### Functional Gaps
1. **Daggerheart has zero SRD data** — scaffold only, no browse tabs, no templates
2. **No guided character creation wizard** — user creates blank sheet, fills manually (or uses template dropdowns)
3. **Feat automation is intentionally partial** — 5e feat selection now applies ASIs and proficiencies, but most non-proficiency feat riders still require manual tracking
4. **5e-2014 feature-option effects are intentionally provenance-only** — invocations, maneuvers, wild shapes, and related catalogs are now browseable/persistent, but the sheet does not try to auto-apply every downstream rule rider
5. **M&M archetypes are intentionally reference-only** — archetypes can now be pinned and reviewed in-sheet, but they do not auto-build powers, skills, or point totals
6. **No spell preparation workflow**
7. **Service worker doesn't cache data chunks** — offline loads app shell but fails to load game data
8. **No PWA install prompt in UI**
9. **`apiClient.ts` is a stub** — `configureApiClient()` is never called, no backend exists

### Code Quality Debt
1. **5e 2014 + 2024 engines are 90%+ duplicated** — should share a base
2. **D20LegacySheet is a 46KB monolith** serving two systems
3. **PF2e sheet (42KB) and M&M sheet (51KB) are also monoliths**
4. **No shared form/section abstractions** despite `src/components/sheet/` primitives existing
5. **Performance utilities (`measurePerformance`, etc.) exist but are never called**
6. **`reportWebVitals()` results go nowhere** (no analytics endpoint)

### Testing Gaps
1. **E2E is still minimal** — single spec, 6 tests, currently covering D&D 5e-2024 plus one Daggerheart scaffold flow
2. **No E2E for:** PF1e, PF2e, D&D 3.5e, M&M, campaigns, dark mode, undo/redo, dice rolling
3. **Daggerheart browser coverage is smoke-test only** — create/persist is covered, but import/export and any data-backed flow remain unavailable because the system is still scaffold-only
4. **Coverage config only measures `src/components/` and `src/utils/`** — excludes `src/systems/`, `src/hooks/`, `src/registry/`, `src/data/`
5. **Coverage remains runtime-sensitive** — Node 18 shells still fail before execution because V8 coverage needs `node:inspector/promises`; use `.nvmrc` / Node 20.19+ or newer

### Recently Corrected Doc Drift
1. **README no longer implies all 7 systems are equally production-ready** — Daggerheart is called out as scaffold-only
2. **README and status counts now distinguish product-reachable support from repo-only catalogs** — 5e-2014 feature options, PF2e archetypes, PF1e prestige classes, and M&M archetypes/complications/modifiers are documented as product-reachable, while 3.5e prestige classes remain explicitly repo-backed only
3. **Coverage instructions now reflect the real runtime requirement** — `.nvmrc` / Node 20.19+ is mandatory for `@vitest/coverage-v8`

---

## Remaining Work (prioritized)

### P0: Correctness
- [x] Fix branch coverage to hit 80% gate (80.65% branch coverage, 78 files / 3214 tests, full run on March 7, 2026 under Node `v22.18.0`)
- [x] Add `classTemplate` unit tests for multiclass edge cases
- [x] Add regression tests for `backgroundTemplate`, `speciesTemplate`, `classSpellcasting`, and `dnd5eRest`
- [x] Add baseline Daggerheart engine + sheet coverage

### P1: Remaining Product Parity
- [x] Subclass selection UI + template wiring (shared 5e sheet rows now persist `subclassId` and reapply subclass features on March 7, 2026)
- [x] Multiclass UI (add second class from sheet; this was already shipped in the shared 5e sheet and the stale status claim was corrected on March 7, 2026)
- [x] Point buy / standard array calculator (shared 5e ability scores tab now ships a 27-point-buy planner and a standard-array assignment tool on March 7, 2026)
- [x] Feat application automation (shared 5e feat flows now apply ASIs and proficiencies on March 7, 2026; advanced feat riders remain manual)
- [x] 5e-2014 feature-option browse/persistence surface (shared 2014 Features tab now exposes 106 loader-backed SRD option entries with provenance on March 7, 2026)
- [x] M&M archetype/complication/modifier productization (native M&M sheet now pins 15 loader-backed archetypes, inserts 28 SRD complications, and reports 101 power modifiers on March 7, 2026)
- [ ] D&D 3.5e prestige-class normalization/productization

### P2: Daggerheart
- [ ] Import data from daggersearch/daggerheart-data or seansbox/daggerheart-srd
- [ ] Add dataLoader support for daggerheart
- [ ] Wire class/ancestry/community templates
- [ ] Add browse tabs to Daggerheart sheet

### P3: Infrastructure
- [ ] Cache per-system data chunks in service worker for real offline support
- [ ] Add PWA install prompt
- [ ] Wire performance monitoring utilities to something useful (or delete them)
- [ ] Expand E2E coverage beyond 5e-2024 + Daggerheart smoke flows

### P4: Code Health
- [ ] Extract shared 5e engine base to reduce duplication
- [ ] Break monolith sheet components into composable sections
- [ ] Expand coverage config to include `src/systems/`, `src/hooks/`, `src/registry/`

### Future (not blocking)
- [ ] Backend API (server sync, accounts) — no checked-in spec doc currently exists
- [ ] Additional game systems via registry pattern
- [ ] Spell preparation workflow
- [ ] Character creation wizard

---

## Canonical Content Counts

Run `npm run roadmap:metrics` to regenerate.

### Core Loader Totals

| System | Spells/Powers | Classes | Species | Backgrounds | Traits | Feature Options | Monsters | Equipment | Feats | Advantages |
|--------|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| D&D 5e (2014) | 238 | 12 | 9 | 6 | 0 | 106 | 41 | 230 | 0 | 0 |
| D&D 5e (2024) | 315 | 12 | 9 | 6 | 0 | 0 | 99 | 204 | 87 | 0 |
| D&D 3.5e | 555 | 11 | 7 | 0 | 0 | 0 | 0 | 207 | 515 | 0 |
| Pathfinder 1e | 134 | 18 | 7 | 0 | 12 | 0 | 0 | 70 | 86 | 0 |
| Pathfinder 2e | 146 | 12 | 6 | 16 | 0 | 0 | 0 | 188 | 93 | 0 |
| M&M 3e | 61 | 0 | 0 | 0 | 0 | 0 | 0 | 150 | 0 | 74 |
| Daggerheart | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Extended Loader Totals

| System | Archetypes | Complications | Power Modifiers |
|--------|---:|---:|---:|
| D&D 5e (2014) | 0 | 0 | 0 |
| D&D 5e (2024) | 0 | 0 | 0 |
| D&D 3.5e | 0 | 0 | 0 |
| Pathfinder 1e | 0 | 0 | 0 |
| Pathfinder 2e | 5 | 0 | 0 |
| M&M 3e | 15 | 28 | 101 |
| Daggerheart | 0 | 0 | 0 |
