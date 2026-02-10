# Code Quality & Architecture Audit

**Date:** January 26, 2026  
**Scope:** Data layer architecture, type consistency, code patterns

---

## Executive Summary

**Overall Assessment:** 🟡 **MIXED QUALITY**

**Strengths:**
- ✅ Centralized type system in `/src/types/`
- ✅ Good SRD compliance discipline (recent additions)
- ✅ Consistent M&M 3e implementation (best in codebase)
- ✅ Comprehensive spell type definition

**Critical Issues:**
- ❌ **Inconsistent type usage** (inline vs centralized)
- ❌ **Mixed export patterns** (named vs array)
- ❌ **Duplicate interface definitions** across systems
- ❌ **No shared equipment types** across D&D editions

---

## Architecture Analysis

### Type System: 🟡 PARTIALLY CENTRALIZED

**Current Structure:**
```
src/types/
├── magic/spells.ts          ✅ Well-designed, comprehensive
├── mam/powers.ts            ✅ Clean, focused
├── character-options/       ✅ Good organization
│   ├── species.ts
│   ├── classes.ts
│   └── feats.ts
├── equipment/items.ts       ⚠️ Underutilized
└── core/common.ts           ✅ Good primitives
```

**Problem:** Many data files ignore centralized types and define their own.

---

## Critical Issues by Category

### 1. Type Inconsistency: ❌ HIGH PRIORITY

#### Issue: Inline Interface Definitions
Multiple files define interfaces locally instead of using centralized types:

**Bad Examples:**

```typescript
// src/data/dnd/3.5e/equipment/gear.ts
export interface Gear {  // ❌ Defined inline
  id: string;
  name: string;
  category: 'adventuring' | 'tools' | ...;
  cost: string;
  weight: number;
  description: string;
  source: string;
}
```

```typescript
// src/data/dnd/3.5e/equipment/weapons.ts
export interface Weapon {  // ❌ Defined inline
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  // ...
}
```

```typescript
// src/data/dnd/3.5e/equipment/armor.ts
export interface Armor {  // ❌ Defined inline
  id: string;
  name: string;
  type: 'light' | 'medium' | 'heavy';
  // ...
}
```

**Good Examples:**

```typescript
// src/data/mutants-and-masterminds/3e/powers/core/attack.ts
import { Power } from '../../../../../types/mam/powers';  // ✅ Uses centralized type

export const attackPowers: Power[] = [
  // ...
];
```

```typescript
// src/data/dnd/5e-2014/spells/cantrips.ts
import { Spell } from '../../../../types/magic/spells';  // ✅ Uses centralized type

export const fireBolt: Spell = {
  // ...
};
```

**Impact:**
- Type changes require editing multiple files
- No single source of truth for equipment types
- Harder to maintain consistency

**Recommendation:**
- ✅ Create `/src/types/equipment/gear.ts`
- ✅ Create `/src/types/equipment/weapons.ts`
- ✅ Create `/src/types/equipment/armor.ts`
- ✅ Migrate all equipment to use centralized types

---

### 2. Export Pattern Inconsistency: ❌ HIGH PRIORITY

#### Mixed Export Styles Across Systems

**Pattern A: Named Exports (D&D 5e-2014)**
```typescript
// Individual named exports
export const fireBolt: Spell = { /* ... */ };
export const eldritchBlast: Spell = { /* ... */ };
export const light: Spell = { /* ... */ };
```

**Pattern B: Array Exports (PF1e, M&M 3e)**
```typescript
// Array of items
export const pf1eCoreSpells: Spell[] = [
  { /* ... */ },
  { /* ... */ },
];
```

**Pattern C: Categorized Arrays (D&D 3.5e Gear)**
```typescript
// Multiple arrays by category
export const adventuringGear: Gear[] = [ /* ... */ ];
export const toolsAndKits: Gear[] = [ /* ... */ ];
export const allGear: Gear[] = [
  ...adventuringGear,
  ...toolsAndKits,
];
```

**Analysis:**

| Pattern | Pros | Cons | Best For |
|---------|------|------|----------|
| **Named Exports** | Tree-shakeable, explicit imports | Verbose, repetitive | Small datasets (< 20 items) |
| **Array Exports** | Compact, easy iteration | Less tree-shakeable | Medium datasets (20-100 items) |
| **Categorized Arrays** | Best organization, flexible | Most complex | Large datasets (100+ items) |

**Current Usage:**
- D&D 5e-2014 spells: Named exports (~200 spells) ❌ **WRONG PATTERN**
- PF1e spells: Array exports (40 spells) ✅ **OK**
- M&M 3e powers: Array exports (148 powers) ✅ **OK**
- D&D 3.5e gear: Categorized arrays (120 items) ✅ **BEST**

**Problem:** D&D 5e-2014 uses named exports for 200+ spells, making files extremely long.

**Recommendation:**
- ✅ Use **categorized arrays** for datasets > 50 items
- ✅ Use **array exports** for datasets 20-50 items
- ✅ Use **named exports** for datasets < 20 items
- ❌ **Refactor D&D 5e-2014 spells** to use arrays

---

### 3. Duplicate Interface Definitions: ⚠️ MEDIUM PRIORITY

#### Found 7+ Duplicate `MagicItem` Interfaces

**Locations:**
1. `src/data/dnd/3.5e/magic-items/core-magic-items.ts`
2. `src/data/pathfinder/1e/magic-items/core-magic-items.ts`
3. `src/data/pathfinder/2e/equipment/magic-items.ts`
4. Possibly more...

**Current State:**
```typescript
// Each system defines its own MagicItem interface
export interface MagicItem {
  id: string;
  name: string;
  level: number;  // Different semantics per system
  // ...
}
```

**Problem:**
- Cannot share magic item code across systems
- Inconsistent field names/types
- Maintenance burden

**Recommendation:**
- ✅ Create polymorphic `MagicItem` base interface in `/src/types/equipment/magic-items.ts`
- ✅ Create system-specific extensions: `DnDMagicItem`, `PFMagicItem`
- ✅ Use discriminated unions for system-specific fields

---

### 4. License Header Inconsistency: ⚠️ MEDIUM PRIORITY

#### Inconsistent SRD/OGL Attribution

**Well-Done (D&D 5e-2014):**
```typescript
/**
 * D&D 5e (2014) - Battle Master Maneuvers
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 5.1
 * License: OGL v1.0a
 */
```

**Minimal (M&M 3e - recent additions):**
```typescript
// Attack Powers (M&M 3e)
// Powers used primarily for attack capabilities
// (No license header)
```

**Inline Comments (PF1e):**
```typescript
// Pathfinder 1e Core Spells - SRD-Compliant
// Source: Pathfinder 1e SRD (https://www.d20pfsrd.com/)
// This file contains core spells from the Core Rulebook
```

**Recommendation:**
- ✅ Standardize on JSDoc-style headers for all data files
- ✅ Include: System, Source, License, Brief description
- ✅ Create template in documentation

---

## System-Specific Quality Assessment

### M&M 3e: ✅ **BEST QUALITY** (Score: 8.5/10)

**Strengths:**
- ✅ Consistent use of centralized `Power` type
- ✅ Clean array exports
- ✅ Logical organization (core/ vs thematic/)
- ✅ Good documentation in `README.md`
- ✅ Proper aggregation pattern (`thematicPowers`)

**Minor Issues:**
- ⚠️ No license headers (recently added files)
- ⚠️ `effects` field is `string[]` instead of structured data

**Example Quality:**
```typescript
import { Power } from '../../../../../types/mam/powers';

export const attackPowers: Power[] = [
  {
    id: 'damage',
    name: 'Damage',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    descriptors: ['physical', 'energy'],
    description: 'You can inflict damage on a target.',
    effects: ['Inflict damage equal to your effect rank.', 'Target makes a Toughness check against DC 15 + rank.'],
  },
  // ...
];
```

**Taste:** Clean, consistent, maintainable. This is the gold standard.

---

### D&D 3.5e Equipment: ✅ **GOOD QUALITY** (Score: 7.5/10)

**Strengths:**
- ✅ Excellent license headers
- ✅ Categorized array pattern for large dataset
- ✅ Good comments and organization
- ✅ Clear source attribution

**Issues:**
- ❌ Defines `Gear` interface inline instead of using centralized types
- ⚠️ No shared types with D&D 5e equipment

**Example Quality:**
```typescript
/**
 * D&D 3.5e - Adventuring Gear, Tools, and Equipment
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 3.5 - Equipment Section
 * License: OGL v1.0a
 */

export interface Gear {  // ❌ Should be centralized
  id: string;
  name: string;
  category: 'adventuring' | 'tools' | 'substances' | 'animals' | 'services' | 'food-lodging';
  cost: string;
  weight: number;
  description: string;
  source: string;
}

export const adventuringGear: Gear[] = [
  { id: 'backpack', name: 'Backpack', category: 'adventuring', cost: '2 gp', weight: 2, description: 'A leather pack holding about 2 cubic feet.', source: 'SRD 3.5' },
  // ...
];
```

**Taste:** Good structure, but missed opportunity for type reuse.

---

### Pathfinder 1e Spells: 🟡 **ACCEPTABLE** (Score: 6.5/10)

**Strengths:**
- ✅ Uses centralized `Spell` type
- ✅ Array export pattern appropriate for size
- ✅ Basic source attribution

**Issues:**
- ⚠️ Minimal license headers
- ⚠️ No JSDoc comments
- ⚠️ Some fields missing (casting time details)

**Example Quality:**
```typescript
// Pathfinder 1e Core Spells - SRD-Compliant
// Source: Pathfinder 1e SRD (https://www.d20pfsrd.com/)
// This file contains core spells from the Core Rulebook

import { Spell } from '../../../../types/magic/spells';

export const pf1eCoreSpells: Spell[] = [
  {
    id: 'pf1e-spell-arcane-mark',
    name: 'Arcane Mark',
    system: 'pathfinder-1e',
    source: 'Core Rulebook',
    level: 0,
    school: 'abjuration',
    castingTime: { type: 'action' },  // ⚠️ Vague
    range: { type: 'touch' },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'permanent' },
    concentration: false,
    ritual: false,
    description: 'Inscribe your personal rune or mark on an object or creature.',
    classes: ['sorcerer', 'wizard'],
  },
  // ...
];
```

**Taste:** Functional but minimal. Gets the job done.

---

### D&D 5e-2014 Spells: ❌ **NEEDS REFACTORING** (Score: 5/10)

**Strengths:**
- ✅ Uses centralized `Spell` type
- ✅ Excellent license headers
- ✅ Very detailed spell data

**Critical Issues:**
- ❌ **Named exports for 200+ spells** (wrong pattern)
- ❌ Files are 500+ lines long
- ❌ Cannot easily iterate over all spells
- ❌ Poor tree-shaking benefits (all spells referenced individually)

**Example Quality:**
```typescript
import { Spell } from '../../../../types/magic/spells';

export const fireBolt: Spell = {  // ❌ Named export for one of 200 spells
  id: 'fire-bolt',
  name: 'Fire Bolt',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  level: 0,
  school: 'evocation',
  castingTime: { type: 'action', amount: 1 },
  range: { type: 'ranged', feet: 120 },
  components: { verbal: true, somatic: true, material: false },
  duration: { type: 'instant' },
  attackRoll: true,
  damage: {
    base: { count: 1, die: 'd10', notation: '1d10' },
    type: 'fire',
    scaling: {
      type: 'character-level',
      increment: { count: 1, die: 'd10', notation: '1d10' },
    },
  },
  concentration: false,
  ritual: false,
  description: 'You hurl a mote of fire at a creature or object within range...',
  atHigherLevels: 'This spell\'s damage increases by 1d10 when you reach 5th level...',
  classes: ['sorcerer', 'wizard'],
};

export const eldritchBlast: Spell = {  // ❌ Another named export
  // ...
};

// ... 198 more named exports
```

**Taste:** High-quality data, wrong organization pattern for scale.

---

### Pathfinder 2e Ancestries: 🟡 **ACCEPTABLE** (Score: 7/10)

**Strengths:**
- ✅ Uses centralized `Species` type
- ✅ Good structure with heritages
- ✅ Recent SRD compliance warnings added

**Issues:**
- ⚠️ Warning comments cluttering traits array (technical debt from rollback)
- ⚠️ Heritage structure could be more normalized

**Example Quality:**
```typescript
import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'pf2e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'fixed', attributes: { con: 2, wis: 2, cha: -2 } },
    { type: 'choice', choice: { count: 1, options: ['str', 'dex', 'int'], label: 'Free ability boost' }, values: [2] },
  ],
  
  size: 'medium',
  speed: 20,
  
  languages: {
    automatic: ['Common', 'Dwarven'],
    choice: { count: 0, options: ['Gnomish', 'Goblin', 'Jotun', 'Orcish', 'Terran', 'Undercommon'], label: 'Additional languages equal to Intelligence modifier' },
  },
  
  traits: [
    { id: 'darkvision', name: 'Darkvision', source: 'Dwarf', description: 'You can see in darkness and dim light just as well as you can see in bright light.' },
    { id: 'clan-dagger', name: 'Clan Dagger', source: 'Dwarf', description: 'You get one clan dagger for free, as it was given to you at birth.' },
  ],
  
  subraces: [  // ✅ Good: heritages as subraces
    { id: 'forge-blessed', name: 'Forge-Blessed Heritage', parentSpeciesId: 'dwarf', abilityScoreIncrease: [{ type: 'fixed', attributes: { str: 2 } }], traits: [], description: 'You gain a +1 status bonus to Crafting checks...' },
    // ...
  ],
  
  description: 'Dwarves have a well-earned reputation as a stoic and stern people...',
  ageInfo: 'Dwarves are considered young until age 25 and can live to around 350 years old.',
  alignmentTendency: 'Dwarves tend toward lawful alignments.',
  sizeDescription: 'Dwarves are about a foot shorter than most humans.',
};
```

**Taste:** Good data structure, clean implementation.

---

## Recommendations by Priority

### 🔴 HIGH PRIORITY (Fix ASAP)

#### 1. Centralize Equipment Types
**Effort:** 2-4 hours  
**Impact:** High (enables type reuse across systems)

**Action Items:**
- [ ] Create `/src/types/equipment/gear.ts`
- [ ] Create `/src/types/equipment/weapons.ts`
- [ ] Create `/src/types/equipment/armor.ts`
- [ ] Create `/src/types/equipment/magic-items.ts`
- [ ] Migrate D&D 3.5e gear to use centralized types
- [ ] Migrate D&D 3.5e weapons/armor to use centralized types

**Example:**
```typescript
// src/types/equipment/gear.ts
export interface GearItem {
  id: string;
  name: string;
  system: string;
  source: string;
  category: string;  // Flexible per system
  cost: string | number;
  weight: number;
  description: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eGear extends GearItem {
  category: 'adventuring' | 'tools' | 'substances' | 'animals' | 'services' | 'food-lodging';
}
```

#### 2. Refactor D&D 5e-2014 Spell Exports
**Effort:** 3-4 hours  
**Impact:** High (improves maintainability, reduces file size)

**Action Items:**
- [ ] Change `cantrips.ts` from named exports to array
- [ ] Change level-1 through level-9 spell files to arrays
- [ ] Update index.ts to export arrays
- [ ] Create aggregated `allSpells` array

**Before:**
```typescript
// 500 lines
export const fireBolt: Spell = { /* ... */ };
export const eldritchBlast: Spell = { /* ... */ };
// ... 198 more
```

**After:**
```typescript
// ~300 lines, more maintainable
export const cantrips: Spell[] = [
  { id: 'fire-bolt', name: 'Fire Bolt', /* ... */ },
  { id: 'eldritch-blast', name: 'Eldritch Blast', /* ... */ },
  // ...
];
```

#### 3. Standardize License Headers
**Effort:** 1-2 hours  
**Impact:** Medium (legal compliance, consistency)

**Action Items:**
- [ ] Create `/docs/LICENSE_HEADER_TEMPLATE.md`
- [ ] Add JSDoc headers to all M&M 3e files
- [ ] Add JSDoc headers to PF1e files
- [ ] Verify all headers include: System, Source, License

**Template:**
```typescript
/**
 * [System] - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: [Specific SRD source]
 * License: OGL v1.0a
 */
```

---

### 🟡 MEDIUM PRIORITY (Address Soon)

#### 4. Normalize MagicItem Interfaces
**Effort:** 2-3 hours  
**Impact:** Medium (enables cross-system code)

**Action Items:**
- [ ] Create polymorphic `MagicItem` base type
- [ ] Audit all magic item implementations
- [ ] Migrate to use base type with extensions

#### 5. Add Type Safety to M&M Powers `effects` Field
**Effort:** 2-3 hours  
**Impact:** Medium (better type safety)

**Current:**
```typescript
effects: string[];  // ⚠️ Unstructured
```

**Proposed:**
```typescript
export interface PowerEffect {
  type: 'damage' | 'condition' | 'modifier' | 'special';
  description: string;
  mechanic?: string;  // e.g., "DC 15 + rank"
}

effects: PowerEffect[];
```

---

### 🟢 LOW PRIORITY (Nice to Have)

#### 6. Create Data Validation Tests
**Effort:** 4-6 hours  
**Impact:** Low (catches errors early)

**Action Items:**
- [ ] Write tests to validate all spells conform to `Spell` interface
- [ ] Write tests to validate all powers conform to `Power` interface
- [ ] Add CI checks for data quality

#### 7. Document Export Pattern Guidelines
**Effort:** 1 hour  
**Impact:** Low (guides future development)

**Action Items:**
- [ ] Create `/docs/DATA_PATTERNS.md`
- [ ] Document when to use each export pattern
- [ ] Provide examples

---

## Code Smell Summary

| Issue | Severity | Files Affected | Effort to Fix |
|-------|----------|----------------|---------------|
| Inline interface definitions | High | ~30 files | 2-4 hours |
| Inconsistent export patterns | High | ~50 files | 3-4 hours |
| Missing license headers | Medium | ~20 files | 1-2 hours |
| Duplicate MagicItem interfaces | Medium | ~7 files | 2-3 hours |
| D&D 5e named exports | High | ~10 files | 3-4 hours |
| Unstructured effects fields | Low | M&M 3e | 2-3 hours |

**Total Estimated Effort:** 13-20 hours of refactoring

---

## Positive Patterns to Replicate

### ✅ M&M 3e Powers Architecture

**Use this as the template:**
```
powers/
├── core/                    # Functional organization
│   ├── attack.ts
│   ├── defense.ts
│   ├── movement.ts
│   └── index.ts
├── thematic/               # Thematic organization
│   ├── energy.ts
│   ├── mental.ts
│   └── index.ts
├── index.ts                # Master aggregator
└── README.md               # Documentation
```

**Why it's good:**
- Clear separation of concerns
- Easy to find specific powers
- Flexible querying (by type OR theme)
- Excellent README documentation
- Consistent use of centralized types

### ✅ D&D 3.5e Gear Categorization

**Use this pattern for large datasets (100+ items):**
```typescript
export const categoryA: Type[] = [ /* ... */ ];
export const categoryB: Type[] = [ /* ... */ ];
export const allItems: Type[] = [
  ...categoryA,
  ...categoryB,
];
```

**Why it's good:**
- Scales well
- Easy to find items by category
- Can import just what you need
- Clear aggregation pattern

---

## Conclusion

**Current State:** Mixed quality with pockets of excellence (M&M 3e) and areas needing refactoring (D&D 5e-2014).

**Key Insight:** The codebase has been built incrementally without consistent architectural guidelines, leading to divergent patterns.

**Path Forward:**
1. **Immediate:** Centralize equipment types (2-4 hours)
2. **Short-term:** Refactor D&D 5e exports (3-4 hours)
3. **Medium-term:** Standardize licenses and normalize MagicItem (3-5 hours)
4. **Long-term:** Add validation tests and documentation (5-7 hours)

**Estimated Total Refactoring Time:** 13-20 hours

**ROI:** High - These changes will significantly improve maintainability and make future content additions faster and more consistent.

---

**Recommendation:** Start with equipment type centralization as it blocks other improvements and has the highest impact-to-effort ratio.
