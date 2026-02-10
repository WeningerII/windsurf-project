# Phase 5: Content Expansion - Current Status

**Date:** January 26, 2026  
**Session:** Post-Phase 7 (D&D 3.5e Gear Complete)

---

## Completed This Session

### ✅ Phase 7: D&D 3.5e Gear (NEW)
- **Added:** 120 gear items
- **Categories:** Adventuring gear, tools, substances, animals, services, food/lodging
- **Status:** D&D 3.5e now 100% complete
- **SRD Compliance:** ✅ All from SRD 3.5

### ✅ Phase 2: Code Quality
- **Console logs:** Protected with DEV checks
- **ESLint warnings:** Reduced from 15 → 5 (target: <10)
- **Status:** Complete

### ✅ SRD Compliance Rollback (Earlier)
- **Removed:** 82 non-SRD PF2e heritages
- **Added:** Compliance warnings to 23 ancestry files
- **Status:** All content now SRD-compliant

---

## Content Status by System

### D&D 5e (2024) - SRD 5.2
**Status:** ✅ 100% COMPLETE  
**No gaps identified**

### D&D 5e (2014) - SRD 5.1
**Status:** ✅ ~95% COMPLETE  
**Added this session:** 123 items (magic weapons, potions, class features)  
**Remaining:** Minor gaps (very low priority)

### D&D 3.5e - SRD 3.5
**Status:** ✅ 100% COMPLETE  
**Completed this session:** 120 gear items  
**Spells:** 555/555 ✅  
**Classes:** 11/11 ✅  
**Equipment:** 250/250 ✅

### Mutants & Masterminds 3e - Hero's Handbook SRD
**Status:** ⚠️ NEEDS VERIFICATION  
**Metadata claims:** 30 powers, 81 advantages, 31 complications  
**Actual files:** Need to count individual implementations  
**Priority:** MEDIUM (verify then expand if needed)

### Pathfinder 1e - PRD/OGL
**Status:** ⚠️ 10% SPELLS  
**Current:** ~40 spells  
**Target:** 200+ spells (50% of ~400 total)  
**Priority:** HIGH (massive spell gap)  
**SRD Source:** d20pfsrd.com (OGL)

### Pathfinder 2e - Core Rulebook OGL
**Status:** ⚠️ 44% SPELLS, SRD-LIMITED  
**Current:** 174 spells  
**Target:** 300+ spells (75% of ~400 total)  
**SRD Limitation:** Core Rulebook only, no supplement content  
**Priority:** MEDIUM-HIGH (expand within SRD bounds)

---

## Phase 5 Roadmap (Remaining Work)

### Option 1: Pathfinder 1e Spell Expansion ⭐ RECOMMENDED
**Why:** Biggest gap (10% → 50%), clear SRD source, high user value

**Scope:**
- Add 160 more spells from Core Rulebook + APG (OGL verified)
- Focus on essential spells: Cleric, Druid, Wizard, Bard
- All levels 0-9

**Approach:**
1. Verify OGL compliance via d20pfsrd.com
2. Prioritize frequently-used spells
3. Add in batches of 20-30 spells
4. Update metadata after each batch

**Estimated Time:** 2-3 days (160 spells × 5 min each = ~13 hours)

---

### Option 2: Pathfinder 2e Spell Expansion
**Why:** Moderate gap (44% → 75%), SRD-compliant, modern system

**Scope:**
- Add 126 more spells from Core Rulebook
- Focus on common spells across all traditions
- Verify Archives of Nethys (official SRD filter)

**Approach:**
1. Verify Core Rulebook OGL status for each spell
2. Add by tradition (Arcane, Divine, Occult, Primal)
3. Batch by spell level

**Estimated Time:** 2-3 days

---

### Option 3: Mutants & Masterminds 3e Verification & Expansion
**Why:** Claims 100% but need verification, unique system

**Scope:**
- Verify actual power/advantage counts vs metadata
- If < 100%, expand to match Hero's Handbook SRD
- Add missing complications if needed

**Approach:**
1. Count actual implementations
2. Compare vs metadata claims
3. Expand if significant gaps found

**Estimated Time:** 1-2 days (depending on gaps)

---

## Recommendation

**Start with Pathfinder 1e Spell Expansion**

**Rationale:**
- ✅ Biggest content gap (10% vs 44% for PF2e)
- ✅ Clear OGL/SRD source (d20pfsrd.com)
- ✅ High user demand (PF1e is popular)
- ✅ Well-defined scope (160 spells)
- ✅ Systematic approach available

**Next Steps:**
1. Verify top 20 essential PF1e spells for each class
2. Check OGL compliance on d20pfsrd.com
3. Implement in batches of 20-30
4. Update metadata progressively
5. Run tests after each batch

---

## SRD Compliance Notes

**All expansion must use:**
- ✅ D&D 5e: SRD 5.1/5.2 only
- ✅ D&D 3.5e: SRD 3.5 only (COMPLETE)
- ✅ Pathfinder 1e: PRD/d20pfsrd.com (OGL verified)
- ✅ Pathfinder 2e: Core Rulebook only (no supplements)
- ✅ M&M 3e: Hero's Handbook SRD only

**Forbidden sources:**
- ❌ D&D supplements (Xanathar's, Tasha's, etc.)
- ❌ Paizo supplements (APG heritages, Lost Omens, etc.)
- ❌ Any proprietary content without explicit OGL

---

**Status:** Ready to proceed with systematic expansion  
**Awaiting:** User confirmation on which system to expand
