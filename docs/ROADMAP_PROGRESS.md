# Technical Roadmap - Progress Report

## Computed Metrics Snapshot

<!-- BEGIN:COMPUTED_ROADMAP_METRICS -->
_Generated: 2026-02-21T18:45:30.163Z_
_Policy: strict core/SRD-only (`src/utils/openContentPolicy.ts`)_

### Loader Totals (Authoritative)
| System | Spells/Powers | Classes | Species | Monsters | Equipment | Feats |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| D&D 5e (2014) | 238 | 12 | 9 | 41 | 230 | 0 |
| D&D 5e (2024) | 315 | 12 | 9 | 99 | 204 | 87 |
| D&D 3.5e | 555 | 11 | 7 | 0 | 207 | 515 |
| Pathfinder 1e | 134 | 11 | 7 | 0 | 70 | 86 |
| Pathfinder 2e | 146 | 12 | 6 | 0 | 188 | 93 |
| Mutants & Masterminds 3e | 61 | 0 | 0 | 0 | 150 | 0 |

### Loader Compliance Audit
| System | Category | Unique Items | Duplicates Removed | Missing Source | Non-Compliant |
| --- | --- | ---: | ---: | ---: | ---: |
| D&D 5e (2014) | Spells/Powers | 238 | 0 | 0 | 0 |
| D&D 5e (2014) | Classes | 12 | 0 | 0 | 0 |
| D&D 5e (2014) | Species/Races | 9 | 0 | 0 | 0 |
| D&D 5e (2014) | Monsters | 41 | 0 | 0 | 0 |
| D&D 5e (2014) | Equipment | 230 | 0 | 0 | 0 |
| D&D 5e (2024) | Spells/Powers | 315 | 0 | 0 | 0 |
| D&D 5e (2024) | Classes | 12 | 0 | 0 | 0 |
| D&D 5e (2024) | Species/Races | 9 | 0 | 0 | 0 |
| D&D 5e (2024) | Monsters | 99 | 0 | 0 | 0 |
| D&D 5e (2024) | Equipment | 204 | 0 | 0 | 0 |
| D&D 5e (2024) | Feats | 87 | 0 | 0 | 0 |
| D&D 3.5e | Spells/Powers | 555 | 0 | 0 | 0 |
| D&D 3.5e | Classes | 11 | 0 | 0 | 0 |
| D&D 3.5e | Species/Races | 7 | 0 | 0 | 0 |
| D&D 3.5e | Equipment | 207 | 0 | 0 | 0 |
| D&D 3.5e | Feats | 515 | 0 | 0 | 0 |
| Pathfinder 1e | Spells/Powers | 134 | 0 | 0 | 0 |
| Pathfinder 1e | Classes | 11 | 0 | 0 | 0 |
| Pathfinder 1e | Species/Races | 7 | 0 | 0 | 0 |
| Pathfinder 1e | Equipment | 70 | 0 | 0 | 0 |
| Pathfinder 1e | Feats | 86 | 0 | 0 | 0 |
| Pathfinder 2e | Spells/Powers | 146 | 0 | 0 | 0 |
| Pathfinder 2e | Classes | 12 | 0 | 0 | 0 |
| Pathfinder 2e | Species/Races | 6 | 0 | 0 | 0 |
| Pathfinder 2e | Equipment | 188 | 0 | 0 | 0 |
| Pathfinder 2e | Feats | 93 | 0 | 0 | 0 |
| Mutants & Masterminds 3e | Spells/Powers | 61 | 0 | 0 | 0 |
| Mutants & Masterminds 3e | Equipment | 150 | 0 | 0 | 0 |

### Referenced Module Audit (Raw Exports)
| Dataset | Unique Items | Duplicates | Missing Source | Non-Compliant |
| --- | ---: | ---: | ---: | ---: |
| M&M 3e powers | 61 | 0 | 0 | 0 |
| M&M 3e advantages | 74 | 0 | 0 | 0 |
| M&M 3e archetypes | 15 | 0 | 0 | 0 |
| PF2e archetypes | 5 | 0 | 0 | 0 |

### Policy Notes
- Loader totals above are the canonical roadmap counts.
- Non-loader rows identify compliance debt in implementation files that are not currently loader-backed.
- All loader-backed datasets currently include explicit source attribution (missing source: 0).
- Referenced non-loader exports currently show 0 non-compliant records.

### Derived Next Steps
- Keep roadmap counts synced by running `npm run roadmap:metrics` after content changes.
<!-- END:COMPUTED_ROADMAP_METRICS -->

**Date:** January 28, 2026
**Last Updated:** February 18, 2026 (Architecture V2 Complete)
**Historical Session Time:** ~390 minutes
**Status:** Phases 1-7 COMPLETE

> Canonical content/compliance counts are auto-generated in the **Computed Metrics Snapshot** section above. Treat other numeric values in this document as historical notes.

---

## Overview

Systematic execution of the Technical Roadmap has successfully completed **Phase 7 (Architecture V2)**, delivering a robust **Document & Data Model** architecture inspired by Foundry VTT. This major refactor decouples game system logic from the UI, enables native character sheets for all 6 systems, and introduces strict type safety and persistence.

**Latest Session (Feb 17):** Architecture V2 Completion:
- **Core:** Implemented `SystemRegistry`, `SystemEngine`, and `CharacterDocument` pattern.
- **Engines:** 6 real system engines implemented with unit tests (47/47 passing).
- **Sheets:** Native sheets for PF2e (proficiency badges), M&M 3e (editing), and D&D 3.5e/PF1e (BAB/Saves).
- **Persistence:** New `useDocuments` hook with auto-migration from legacy format.

The application is now fully architected for multi-system support with no legacy debt blocking future features.

---

## Phase 7: Architecture V2 Initiative ✅ COMPLETE

**Duration:** ~120 minutes
**Status:** All priorities completed

### Priority 1: Document & Data Model ✅
- Defined `CharacterDocument<T>` generic container.
- Implemented `SystemRegistry` singleton.
- Created `SystemDataModel` and `SystemEngine` interfaces.
- Decoupled system logic (engines) from UI (sheets).

### Priority 2: System Engines & Tests ✅
- **D&D 5e (2014/2024):** Real engines for HP, AC, skills, saves.
- **PF2e:** 4-tier proficiency logic, hero points, conditions.
- **M&M 3e:** Point buy logic, power point calculation, defense validation.
- **D&D 3.5e / PF1e:** BAB, 3-save breakdown, grapple/CMB, size mods.
- **Testing:** 47/47 unit tests passing across all 6 engines.

### Priority 3: Native Sheets ✅
- **D20SheetAdapter:** Shared adapter for D&D 5e systems (bridges to legacy tabs).
- **D20LegacySheet:** Native sheet for 3.5e/PF1e (BAB, touch AC, flat-footed, CMB/CMD).
- **Pf2eCharacterSheet:** Native sheet with proficiency toggles (U/T/E/M/L).
- **Mam3eCharacterSheet:** Native sheet with full editing support.

### Priority 4: Persistence & Migration ✅
- `useDocuments` hook replaces `useCharacters`.
- Auto-migration utility converts legacy data to V2 documents on load.
- Validated end-to-end data preservation.

---

## Historical Milestone: Phase 5 Content Expansion - PF2e Archetypes ✅

**Duration:** ~90 minutes  
**Date:** January 28, 2026  
**Status:** Archetype expansion complete

### Work Completed

**Pathfinder 2e Archetype Expansion:**
- Audited existing archetypes (found 8, metadata claimed 80)
- Added 37 new archetypes across three organized files
- Corrected metadata from 80 → 45 (accurate count)
- Removed placeholder file (final-archetypes.ts)

**Archetypes Added:**
- **Multiclass Dedications:** 27 total (12 core + 15 expanded)
  - Core: Alchemist, Barbarian, Bard, Champion, Cleric, Druid, Fighter, Monk, Ranger, Rogue, Sorcerer, Wizard
  - Expanded: Investigator, Oracle, Swashbuckler, Witch, Gunslinger, Inventor, Magus, Summoner, Psychic, Thaumaturge, Kineticist, Animist, Exemplar, Commander, Guardian

- **General Archetypes:** 18 total
  - Combat: Archer, Beastmaster, Dual-Weapon Warrior, Duelist, Eldritch Archer
  - Skill: Acrobat, Assassin, Medic
  - Spellcasting: Familiar Master, Ritualist
  - Social: Marshal, Celebrity
  - Exploration: Scout, Cavalier
  - Defensive: Bastion, Sentinel
  - Supernatural: Blessed One, Poisoner

**Files Created (Historical, Jan 2026):**
- `multiclass-dedications.ts` (12 archetypes, 167 lines) — later removed in Feb 2026 consolidation
- `multiclass-expanded.ts` (15 archetypes, 217 lines) — later removed in Feb 2026 consolidation
- `popular-archetypes.ts` (18 archetypes, 293 lines) — later removed in Feb 2026 consolidation

**Build Status:**
- ✅ TypeScript: 0 errors
- ✅ Build: Success (10.20s, 1649 modules)
- ✅ Bundle: Stable (278.84 KB pathfinder data)
- ✅ SRD Compliance: 100%

**Impact:**
- PF2e archetype count: 8 → 45 (+462%)
- Total PF2e completion: ~95% → ~97%
- Phase 5 progress at that time: Started (historical snapshot)

---

## Phase Status Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Critical Fixes | ✅ Complete | Build-blocking TS issue resolved |
| Phase 2: Code Quality | ✅ Complete | Refactors and lint cleanup completed |
| Phase 3: Testing Infrastructure | ✅ Complete | 80%+ coverage, E2E, CI/CD gates enforced |
| Phase 4: Performance | ✅ Complete | Bundle analysis and monitoring integrated |
| Phase 5: Content Expansion | ✅ Complete (Core Scope) | Core SRD content reconciled to canonical counts |
| Phase 6: Documentation | 🔄 In Progress | Final cleanup/sync work remains |
| Phase 7: Architecture V2 | ✅ Complete | Document Model, Native Sheets, Real Engines |
| Legacy Deprecation Phase 4 | ✅ Complete | Native sheets deployed; adapter UI retired |

---

### Current Workstream

### Open Items
- [ ] Confirm first GitHub Actions green run with enforced `80/80/80/80` coverage + Playwright gates.
- [ ] Run final cross-system QA wording pass for PF1e feats, PF2e feats, and M&M complications/conditions.
- [ ] Keep docs synchronized after each data change via `npm run roadmap:metrics`.
- [ ] Execute Phase 5 of `docs/refactoring/LEGACY_DEPRECATION_PLAN.md` (remove V1 storage bridge after support window).

### Completed in This Reconciliation Cycle
- [x] **Architecture V2:** Full refactor to Document & Data Model.
- [x] **Native Sheets:** Implemented for all systems including D&D 5e (2014 & 2024).
- [x] **System Engines:** 6/6 real engines with 47/47 passing tests.
- [x] **Persistence:** Auto-migration and robust storage.
- [x] **Legacy Phase 4:** Legacy D20 UI adapter path (`D20SheetAdapter`, `CharacterSheet`, etc.) successfully retired.

---

## Historical Milestones

Detailed phase/session writeups are preserved in `docs/archive/` and should be treated as historical snapshots:
- `docs/archive/phases/PHASE_1_COMPLETION.md`
- `docs/archive/phases/PHASE_2_COMPLETION.md`
- `docs/archive/phases/PHASE_3_FOUNDATION.md`
- `docs/archive/phases/PHASE_4_COMPLETION.md`
- `docs/archive/phases/PHASE_5_COMPLETION.md`
- `docs/archive/SESSION_SUMMARY.md`
- `docs/archive/SESSION_SUMMARY_JAN28_2026.md`
- `docs/archive/SESSION_JAN28_2026_EVENING.md`

---

## Reconciled Success Criteria

### Completed
- [x] **Architecture V2 refactor complete (Phase 7).**
- [x] Canonical metrics are generated and embedded from `docs/generated/roadmap-metrics.md`.
- [x] Loader audit shows `0` duplicates and `0` non-compliant items for loader-backed datasets.
- [x] Module audit rows for M&M powers/advantages/archetypes and PF2e archetypes show `0` duplicates.
- [x] PF1e feat scope is core-only at `86` CRB feats.
- [x] PF2e feat scope is reconciled to `93` CRB feats.
- [x] M&M 3e core SRD data is reconciled to `61` powers and `150` equipment.

### Remaining
- [ ] CI confirmation for enforced coverage/e2e gates (Phase 3 final check).
- [ ] Optional documentation polish tasks in Phase 6 (Storybook/tutorials if pursued).

---

## Next Actions

1. **Verify CI/CD:** Confirm the new test suite (47 engine tests) runs cleanly in CI.
2. **Content QA:** Execute final QA wording pass for reconciled PF1e/PF2e/M&M datasets.
3. **Documentation:** Keep `TECHNICAL_ROADMAP.md` synchronized.

---

## Team Handoff

### Engineering
- Architecture is now V2 (Document & Data Model). See `docs/refactoring/MULTI_SYSTEM_ARCHITECTURE_PLAN.md`.
- All systems use `SystemRegistry` and `CharacterDocument`.
- Legacy `Character` type is deprecated; use `CharacterDocument<T>`.

### DevOps
- CI/CD has lint, tests, coverage gating, build, and Playwright workflows; confirm green enforcement run.

### Content
- Treat computed metrics as authoritative for counts and compliance tracking.
- Use SRD-only source constraints for all future additions.

---

**Report Reconciled:** February 18, 2026
**Status:** Architecture V2 Complete. Active roadmap/progress documentation reconciled.
