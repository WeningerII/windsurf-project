# Technical Refactoring Plan: High-Priority Code Quality Fixes

**Version:** 1.0  
**Date:** January 26, 2026  
**Estimated Total Effort:** 6-10 hours  
**Risk Level:** Medium (breaking changes, requires thorough testing)

---

## Overview

This document outlines the technical implementation plan for addressing the three high-priority code quality issues identified in `CODE_QUALITY_AUDIT.md`:

1. **Centralize Equipment Types** (2-4 hours)
2. **Refactor D&D 5e-2014 Spell Exports** (3-4 hours)
3. **Standardize License Headers** (1-2 hours)

---

## Priority 1: Centralize Equipment Types

### Objective

Create a unified type system for equipment across all game systems, eliminating inline interface definitions and enabling code reuse.

### Current State

**Problem:** Equipment interfaces defined inline in data files:
```typescript
// src/data/dnd/3.5e/equipment/gear.ts
export interface Gear { /* ... */ }  // ❌ Inline definition

// src/data/dnd/3.5e/equipment/weapons.ts
export interface Weapon { /* ... */ }  // ❌ Inline definition

// src/data/dnd/3.5e/equipment/armor.ts
export interface Armor { /* ... */ }  // ❌ Inline definition
export interface Shield { /* ... */ }  // ❌ Inline definition
```

**Impact:** 30+ files affected, no type reuse possible.

### Target State

**Solution:** Centralized equipment types in `/src/types/equipment/`:
```typescript
// src/types/equipment/gear.ts
export interface GearItem {
  id: string;
  name: string;
  system: string;
  source: string;
  category: string;
  cost: string | number;
  weight: number;
  description: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eGear extends GearItem {
  category: 'adventuring' | 'tools' | 'substances' | 'animals' | 'services' | 'food-lodging';
  cost: string;  // e.g., "2 gp"
}

export interface DnD5eGear extends GearItem {
  category: string;
  cost: number;  // copper pieces
}
```

---

### Implementation Steps

#### Phase 1A: Create Base Type Files (30 min)

**Files to create:**
1. `/src/types/equipment/gear.ts`
2. `/src/types/equipment/weapons.ts`
3. `/src/types/equipment/armor.ts`
4. `/src/types/equipment/magic-items.ts`

**Step-by-step:**

```typescript
// 1. Create /src/types/equipment/gear.ts
export interface GearItem {
  id: string;
  name: string;
  system: string;
  source: string;
  category: string;
  cost: string | number;
  weight: number;
  description: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eGear extends GearItem {
  category: 'adventuring' | 'tools' | 'substances' | 'animals' | 'services' | 'food-lodging';
  cost: string;
}

export interface DnD5eGear extends GearItem {
  category: string;
  cost: number;
}

export interface PathfinderGear extends GearItem {
  category: string;
  bulk?: number;  // PF2e uses bulk instead of weight
}
```

```typescript
// 2. Create /src/types/equipment/weapons.ts
export interface WeaponItem {
  id: string;
  name: string;
  system: string;
  source: string;
  type: 'melee' | 'ranged' | 'thrown';
  category?: string;  // e.g., 'simple', 'martial'
  damage?: string | { dice: string; type: string };
  properties?: string[];
  weight: number;
  cost: string | number;
  description?: string;
}

// System-specific extensions
export interface DnD35eWeapon extends WeaponItem {
  critical?: string;  // e.g., "19-20/×2"
  range?: number;
  damageType?: 'slashing' | 'piercing' | 'bludgeoning';
}

export interface DnD5eWeapon extends WeaponItem {
  damage: { dice: string; type: string };
  range?: { normal: number; long?: number };
}
```

```typescript
// 3. Create /src/types/equipment/armor.ts
export interface ArmorItem {
  id: string;
  name: string;
  system: string;
  source: string;
  type: 'light' | 'medium' | 'heavy' | 'shield';
  armorClass: number | string;
  weight: number;
  cost: string | number;
  description?: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eArmor extends ArmorItem {
  maxDexBonus?: number;
  armorCheckPenalty?: number;
  arcaneSpellFailure?: number;
  speedReduction?: number;
}

export interface DnD5eArmor extends ArmorItem {
  stealthDisadvantage?: boolean;
  strengthRequirement?: number;
}
```

```typescript
// 4. Create /src/types/equipment/magic-items.ts
export interface MagicItem {
  id: string;
  name: string;
  system: string;
  source: string;
  type: string;  // e.g., 'weapon', 'armor', 'wondrous'
  rarity: string;
  requiresAttunement?: boolean;
  description: string;
  properties?: string[];
}

// System-specific extensions
export interface DnD35eMagicItem extends MagicItem {
  casterLevel: number;
  aura?: string;
  price: string;
}

export interface DnD5eMagicItem extends MagicItem {
  rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary' | 'artifact';
}

export interface PathfinderMagicItem extends MagicItem {
  level: number;
  bulk?: number;
  usage?: string;
}
```

**Checkpoint:** Run `npm run build` - should compile with no errors.

---

#### Phase 1B: Create Index File (5 min)

```typescript
// /src/types/equipment/index.ts
export * from './gear';
export * from './weapons';
export * from './armor';
export * from './magic-items';
```

---

#### Phase 1C: Migrate D&D 3.5e Gear (45 min)

**File:** `/src/data/dnd/3.5e/equipment/gear.ts`

**Changes:**
1. Remove inline `Gear` interface
2. Import centralized type
3. Update all gear arrays to use new type

**Before:**
```typescript
export interface Gear {
  id: string;
  name: string;
  category: 'adventuring' | 'tools' | 'substances' | 'animals' | 'services' | 'food-lodging';
  cost: string;
  weight: number;
  description: string;
  source: string;
}

export const adventuringGear: Gear[] = [
  // ...
];
```

**After:**
```typescript
import { DnD35eGear } from '../../../../types/equipment';

export const adventuringGear: DnD35eGear[] = [
  {
    id: 'backpack',
    name: 'Backpack',
    system: 'dnd-35e',  // Add system field
    source: 'SRD 3.5',
    category: 'adventuring',
    cost: '2 gp',
    weight: 2,
    description: 'A leather pack holding about 2 cubic feet.',
  },
  // ... rest of items
];
```

**Implementation:**
```bash
# 1. Add import at top of file
# 2. Remove interface definition (lines 11-19)
# 3. Change type: Gear[] -> DnD35eGear[]
# 4. Add 'system: "dnd-35e"' to each item (can use multi-cursor)
# 5. Update all 6 arrays: adventuringGear, toolsAndKits, alchemicalSubstances, animalsAndMounts, foodAndLodging, services
```

**Test:**
```bash
npm run build
# Should compile with no errors
```

---

#### Phase 1D: Migrate D&D 3.5e Weapons (30 min)

**File:** `/src/data/dnd/3.5e/equipment/weapons.ts`

**Changes:**
1. Remove inline `Weapon` interface
2. Import `DnD35eWeapon` from centralized types
3. Update all weapon exports

**Before:**
```typescript
export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  // ...
}

export const longsword: Weapon = {
  // ...
};
```

**After:**
```typescript
import { DnD35eWeapon } from '../../../../types/equipment';

export const longsword: DnD35eWeapon = {
  id: 'longsword',
  name: 'Longsword',
  system: 'dnd-35e',
  source: 'SRD 3.5',
  type: 'melee',
  // ... rest of fields
};
```

---

#### Phase 1E: Migrate D&D 3.5e Armor (30 min)

**File:** `/src/data/dnd/3.5e/equipment/armor.ts`

**Changes:**
1. Remove inline `Armor` and `Shield` interfaces
2. Import `DnD35eArmor` from centralized types
3. Update all armor/shield exports

**Note:** Shields may need special handling as they're currently a separate interface. Consider making them `type: 'shield'` within `ArmorItem`.

---

#### Phase 1F: Update Equipment Index (10 min)

**File:** `/src/data/dnd/3.5e/equipment/index.ts`

**Changes:**
1. Update type annotations for `getEquipment` function
2. Remove any local interface re-exports

**Before:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mixed equipment types require flexible type
return allEquipment.find((e: any) => e.id === id);
```

**After:**
```typescript
import { DnD35eGear, DnD35eWeapon, DnD35eArmor } from '../../../../types/equipment';

type AnyEquipment = DnD35eGear | DnD35eWeapon | DnD35eArmor;

export const getEquipment = (id: string): AnyEquipment | undefined => {
  const allEquipment: AnyEquipment[] = [
    ...dnd35eEquipment.weapons,
    ...dnd35eEquipment.armor,
    ...dnd35eEquipment.shields,
    ...dnd35eEquipment.adventuringGear,
  ];
  return allEquipment.find((e) => e.id === id);
};
```

---

### Testing & Validation

**Automated Tests:**
```bash
npm run build      # TypeScript compilation
npm test           # Run test suite
npm run lint       # ESLint check
```

**Manual Verification:**
- [ ] All D&D 3.5e gear items render correctly in UI
- [ ] Weapon data displays properly
- [ ] Armor data displays properly
- [ ] No TypeScript errors
- [ ] No ESLint warnings added

**Regression Checklist:**
- [ ] Character sheet equipment section works
- [ ] Item lookup by ID functions
- [ ] Filtering by category works
- [ ] Cost/weight display correct

---

### Rollback Plan

If issues arise:

1. **Git revert:** `git revert HEAD`
2. **Restore backup:** Copy from `.backup/` directory (create before starting)
3. **Manual restore:** Keep original interface definitions commented out

---

### Success Criteria

- ✅ All equipment types centralized in `/src/types/equipment/`
- ✅ Zero inline interface definitions in data files
- ✅ All builds pass without errors
- ✅ No new ESLint warnings
- ✅ All manual tests pass
- ✅ Documentation updated

---

## Priority 2: Refactor D&D 5e-2014 Spell Exports

### Objective

Change D&D 5e-2014 spells from individual named exports to array exports, reducing file size and improving maintainability.

### Current State

**Problem:** 200+ spells as named exports across 10 files:
```typescript
// src/data/dnd/5e-2014/spells/cantrips.ts (500+ lines)
export const fireBolt: Spell = { /* ... */ };
export const eldritchBlast: Spell = { /* ... */ };
export const light: Spell = { /* ... */ };
// ... 20+ more in this file alone
```

**Issues:**
- Files are 500+ lines long
- Cannot easily iterate over spells
- Difficult to maintain
- No clear aggregation

### Target State

**Solution:** Array exports with clear organization:
```typescript
// src/data/dnd/5e-2014/spells/cantrips.ts (300 lines)
export const cantrips: Spell[] = [
  {
    id: 'fire-bolt',
    name: 'Fire Bolt',
    // ...
  },
  {
    id: 'eldritch-blast',
    name: 'Eldritch Blast',
    // ...
  },
  // ...
];
```

---

### Implementation Steps

#### Phase 2A: Refactor Cantrips (30 min)

**File:** `/src/data/dnd/5e-2014/spells/cantrips.ts`

**Step-by-step:**

1. **Backup original file:**
```bash
cp src/data/dnd/5e-2014/spells/cantrips.ts src/data/dnd/5e-2014/spells/cantrips.ts.backup
```

2. **Transform exports:**
   - Remove `export const spellName: Spell =` for each spell
   - Wrap all spell objects in array
   - Export as `cantrips: Spell[]`

**Script to automate (optional):**
```javascript
// scripts/refactor-spell-exports.js
const fs = require('fs');

function refactorToArray(filePath, arrayName) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove 'export const X: Spell = ' pattern
  content = content.replace(/^export const \w+: Spell = /gm, '');
  
  // Wrap in array
  const imports = content.match(/^import.*$/m)[0];
  const spells = content.replace(/^import.*$/m, '').trim();
  
  const newContent = `${imports}

export const ${arrayName}: Spell[] = [
${spells}
];
`;
  
  fs.writeFileSync(filePath, newContent);
}
```

3. **Manual approach (safer):**
   - Select all spell objects
   - Cut to clipboard
   - Replace with array structure
   - Paste spells into array
   - Remove individual `export const` lines

**Before:**
```typescript
import { Spell } from '../../../../types/magic/spells';

export const fireBolt: Spell = {
  id: 'fire-bolt',
  // ...
};

export const light: Spell = {
  id: 'light',
  // ...
};
```

**After:**
```typescript
import { Spell } from '../../../../types/magic/spells';

export const cantrips: Spell[] = [
  {
    id: 'fire-bolt',
    name: 'Fire Bolt',
    // ...
  },
  {
    id: 'light',
    name: 'Light',
    // ...
  },
];

// Helper function for lookups (optional)
export const getCantripById = (id: string) => 
  cantrips.find(spell => spell.id === id);
```

4. **Test:**
```bash
npm run build
# Check for TypeScript errors
```

---

#### Phase 2B: Refactor Level 1-9 Spells (2.5 hours)

**Files to update:**
- `level-1.ts`
- `level-2.ts`
- `level-3.ts`
- `level-4.ts`
- `level-5.ts`
- `level-6.ts`
- `level-7.ts`
- `level-8.ts`
- `level-9.ts`

**Process for each file (15-20 min each):**

1. Backup file
2. Transform to array export
3. Test compilation
4. Commit

**Pattern:**
```typescript
// Before
export const fireball: Spell = { /* ... */ };
export const lightningBolt: Spell = { /* ... */ };

// After
export const level3Spells: Spell[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    level: 3,
    // ...
  },
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    level: 3,
    // ...
  },
];
```

---

#### Phase 2C: Update Index File (20 min)

**File:** `/src/data/dnd/5e-2014/spells/index.ts`

**Before:**
```typescript
export * from './cantrips';
export * from './level-1';
// ... individual spell exports
```

**After:**
```typescript
export { cantrips } from './cantrips';
export { level1Spells } from './level-1';
export { level2Spells } from './level-2';
export { level3Spells } from './level-3';
export { level4Spells } from './level-4';
export { level5Spells } from './level-5';
export { level6Spells } from './level-6';
export { level7Spells } from './level-7';
export { level8Spells } from './level-8';
export { level9Spells } from './level-9';

import { cantrips } from './cantrips';
import { level1Spells } from './level-1';
import { level2Spells } from './level-2';
import { level3Spells } from './level-3';
import { level4Spells } from './level-4';
import { level5Spells } from './level-5';
import { level6Spells } from './level-6';
import { level7Spells } from './level-7';
import { level8Spells } from './level-8';
import { level9Spells } from './level-9';

// Aggregated export
export const allDnD5e2014Spells: Spell[] = [
  ...cantrips,
  ...level1Spells,
  ...level2Spells,
  ...level3Spells,
  ...level4Spells,
  ...level5Spells,
  ...level6Spells,
  ...level7Spells,
  ...level8Spells,
  ...level9Spells,
];

// Helper functions
export const getSpellById = (id: string) =>
  allDnD5e2014Spells.find(spell => spell.id === id);

export const getSpellsByLevel = (level: number) =>
  allDnD5e2014Spells.filter(spell => spell.level === level);

export const getSpellsByClass = (className: string) =>
  allDnD5e2014Spells.filter(spell => 
    spell.classes.includes(className.toLowerCase())
  );
```

---

#### Phase 2D: Update Imports in Application Code (30 min)

**Search for:**
```bash
grep -r "import.*from.*5e-2014/spells" src/
```

**Update patterns:**

**Before:**
```typescript
import { fireBolt, eldritchBlast } from './data/dnd/5e-2014/spells/cantrips';
```

**After:**
```typescript
import { cantrips, getSpellById } from './data/dnd/5e-2014/spells';

const fireBolt = getSpellById('fire-bolt');
// OR
const fireBolt = cantrips.find(s => s.id === 'fire-bolt');
```

**Likely files to update:**
- Components that display spell lists
- Character sheet components
- Spell selection UI
- Search/filter functionality

---

### Testing & Validation

**Build Tests:**
```bash
npm run build      # Must pass
npm test           # All tests pass
npm run lint       # No new warnings
```

**Functional Tests:**
- [ ] Spell list displays correctly
- [ ] Spell search works
- [ ] Spell filtering by level works
- [ ] Spell filtering by class works
- [ ] Individual spell details render
- [ ] Character sheet spell section works

**Performance Check:**
- [ ] Bundle size comparison (should be similar or smaller)
- [ ] Load time comparison (should be similar)

---

### Rollback Plan

1. **Git revert:** Each file committed separately
2. **Restore backups:** `.backup` files created
3. **Feature flag:** Can add flag to use old imports temporarily

---

### Success Criteria

- ✅ All spell files use array exports
- ✅ File sizes reduced by ~40%
- ✅ Clear aggregation in index
- ✅ Helper functions for common operations
- ✅ All application code updated
- ✅ All tests pass
- ✅ No performance regression

---

## Priority 3: Standardize License Headers

### Objective

Add consistent JSDoc-style license headers to all data files, ensuring SRD compliance documentation.

### Current State

**Problem:** Inconsistent license headers across files:
- D&D 5e-2014: ✅ Excellent JSDoc headers
- M&M 3e: ❌ No headers (recent additions)
- PF1e: ⚠️ Minimal inline comments
- D&D 3.5e: ✅ Good headers

### Target State

**Solution:** Standardized JSDoc format for all data files.

---

### Template

```typescript
/**
 * [System Name] - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: [Specific SRD Source]
 * License: OGL v1.0a
 * 
 * [Optional: Additional notes about content scope or limitations]
 */
```

**Examples:**

```typescript
/**
 * Mutants & Masterminds 3e - Attack Powers
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Hero's Handbook (d20herosrd.com)
 * License: OGL v1.0a
 * 
 * Powers are organized by functional category (attack, defense, etc.)
 * and represent the base effects from the Hero's Handbook.
 */
```

```typescript
/**
 * Pathfinder 1e - Core Spells
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 * 
 * Spells are from the Core Rulebook only. Advanced Player's Guide
 * spells are in a separate file.
 */
```

---

### Implementation Steps

#### Phase 3A: Create Header Template Document (10 min)

**File:** `/docs/LICENSE_HEADER_TEMPLATE.md`

```markdown
# License Header Templates

All data files must include a JSDoc-style license header at the top of the file.

## Standard Template

\`\`\`typescript
/**
 * [System Name] - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: [Specific SRD Source]
 * License: OGL v1.0a
 */
\`\`\`

## System-Specific Templates

### D&D 5e (2014)
\`\`\`typescript
/**
 * D&D 5e (2014) - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 5.1
 * License: OGL v1.0a
 */
\`\`\`

### Mutants & Masterminds 3e
\`\`\`typescript
/**
 * Mutants & Masterminds 3e - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Hero's Handbook (d20herosrd.com)
 * License: OGL v1.0a
 */
\`\`\`

### Pathfinder 1e
\`\`\`typescript
/**
 * Pathfinder 1e - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */
\`\`\`

## When to Add Headers

- All new data files
- Files with >10 data items
- Any file containing SRD/OGL content

## What NOT to Include

- Comments about implementation details (put those below imports)
- TODOs or FIXMEs in license header
- Author names (this is collaborative)
```

---

#### Phase 3B: Add Headers to M&M 3e Files (30 min)

**Files to update (20 files):**
- All files in `/src/data/mutants-and-masterminds/3e/powers/core/`
- All files in `/src/data/mutants-and-masterminds/3e/powers/thematic/`
- `/src/data/mutants-and-masterminds/3e/powers/thematic/variants.ts`

**Process:**
1. Open file
2. Add header at line 1 (before existing comments)
3. Verify build
4. Commit

**Example:**

**Before:**
```typescript
// Attack Powers (M&M 3e)
// Powers used primarily for attack capabilities

import { Power } from '../../../../../types/mam/powers';
```

**After:**
```typescript
/**
 * Mutants & Masterminds 3e - Attack Powers
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Hero's Handbook (d20herosrd.com)
 * License: OGL v1.0a
 */

import { Power } from '../../../../../types/mam/powers';
```

---

#### Phase 3C: Standardize PF1e Headers (20 min)

**Files to update (5 files):**
- All files in `/src/data/pathfinder/1e/spells/`

**Current state:**
```typescript
// Pathfinder 1e Core Spells - SRD-Compliant
// Source: Pathfinder 1e SRD (https://www.d20pfsrd.com/)
// This file contains core spells from the Core Rulebook
```

**Convert to:**
```typescript
/**
 * Pathfinder 1e - Core Spells
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 * 
 * Spells from the Core Rulebook only.
 */
```

---

#### Phase 3D: Audit All Data Files (20 min)

**Script to find files missing headers:**
```bash
#!/bin/bash
# scripts/audit-license-headers.sh

echo "Files missing JSDoc license headers:"
echo "====================================="

find src/data -name "*.ts" -type f | while read file; do
  if ! head -n 5 "$file" | grep -q "This content is derived from the System Reference Document"; then
    echo "$file"
  fi
done
```

**Run and update any remaining files.**

---

### Testing & Validation

**Automated:**
```bash
npm run build      # Headers shouldn't affect build
npm run lint       # Check for comment style warnings
```

**Manual Review:**
- [ ] Spot-check 5 files per system
- [ ] Verify correct SRD source cited
- [ ] Ensure OGL v1.0a mentioned
- [ ] Check formatting consistency

**Legal Compliance:**
- [ ] All OGL content properly attributed
- [ ] Sources clearly documented
- [ ] License version specified

---

### Success Criteria

- ✅ All data files have JSDoc headers
- ✅ Template documented in `/docs/`
- ✅ Consistent format across systems
- ✅ All builds pass
- ✅ Legal compliance verified

---

## Risk Assessment

### High-Risk Items

| Item | Risk | Mitigation |
|------|------|------------|
| Equipment type migration | Breaking changes to data structure | Thorough testing, backups, git commits |
| Spell export refactoring | Import errors in application code | Grep all imports, update systematically |
| Performance impact | Possible load time increase | Performance testing before/after |

### Medium-Risk Items

| Item | Risk | Mitigation |
|------|------|------------|
| License header errors | Incorrect attribution | Template document, peer review |
| Type mismatches | Runtime errors | TypeScript compilation catches most |
| Merge conflicts | Concurrent development | Feature branch, communicate with team |

### Low-Risk Items

- License header additions (no logic changes)
- Documentation updates
- ESLint fixes

---

## Testing Strategy

### Unit Tests

```typescript
// tests/equipment/types.test.ts
import { DnD35eGear, DnD5eGear } from '../src/types/equipment';

describe('Equipment Types', () => {
  it('should accept valid D&D 3.5e gear', () => {
    const item: DnD35eGear = {
      id: 'test',
      name: 'Test Item',
      system: 'dnd-35e',
      source: 'Test',
      category: 'adventuring',
      cost: '1 gp',
      weight: 1,
      description: 'Test',
    };
    expect(item).toBeDefined();
  });

  it('should enforce system field', () => {
    // @ts-expect-error - system is required
    const item: DnD35eGear = {
      id: 'test',
      name: 'Test',
    };
  });
});
```

### Integration Tests

```typescript
// tests/spells/array-exports.test.ts
import { cantrips, allDnD5e2014Spells, getSpellById } from '../src/data/dnd/5e-2014/spells';

describe('Spell Array Exports', () => {
  it('should export cantrips as array', () => {
    expect(Array.isArray(cantrips)).toBe(true);
    expect(cantrips.length).toBeGreaterThan(0);
  });

  it('should have all spells in aggregate', () => {
    expect(allDnD5e2014Spells.length).toBeGreaterThan(200);
  });

  it('should find spells by ID', () => {
    const spell = getSpellById('fire-bolt');
    expect(spell).toBeDefined();
    expect(spell?.name).toBe('Fire Bolt');
  });
});
```

### Manual Test Cases

**Equipment Migration:**
1. Load character sheet
2. Add equipment to character
3. Verify display correct
4. Check cost/weight calculations
5. Test equipment filtering
6. Test equipment search

**Spell Refactoring:**
1. Open spell list
2. Filter by level
3. Filter by class
4. Search for specific spell
5. View spell details
6. Add spell to character
7. Verify spell display on sheet

---

## Execution Plan

### Week 1: Equipment Types (Day 1-2)

**Day 1 (4 hours):**
- [ ] Create base type files (Phase 1A-B)
- [ ] Migrate D&D 3.5e gear (Phase 1C)
- [ ] Test and commit

**Day 2 (3 hours):**
- [ ] Migrate D&D 3.5e weapons (Phase 1D)
- [ ] Migrate D&D 3.5e armor (Phase 1E)
- [ ] Update index (Phase 1F)
- [ ] Full testing
- [ ] Commit

### Week 1: Spell Exports (Day 3-4)

**Day 3 (3 hours):**
- [ ] Refactor cantrips (Phase 2A)
- [ ] Refactor levels 1-3 (Phase 2B partial)
- [ ] Test and commit

**Day 4 (3 hours):**
- [ ] Refactor levels 4-9 (Phase 2B complete)
- [ ] Update index (Phase 2C)
- [ ] Update imports (Phase 2D)
- [ ] Full testing
- [ ] Commit

### Week 1: License Headers (Day 5)

**Day 5 (1.5 hours):**
- [ ] Create template doc (Phase 3A)
- [ ] Add M&M headers (Phase 3B)
- [ ] Standardize PF1e (Phase 3C)
- [ ] Audit all files (Phase 3D)
- [ ] Final commit

---

## Success Metrics

### Quantitative

- ✅ 0 TypeScript compilation errors
- ✅ 0 new ESLint warnings
- ✅ 100% test pass rate
- ✅ < 5% bundle size increase
- ✅ < 10ms load time increase

### Qualitative

- ✅ Code is more maintainable
- ✅ Types are reusable across systems
- ✅ Spell files are more readable
- ✅ Legal compliance is clear
- ✅ Future additions are easier

---

## Conclusion

This refactoring plan addresses critical code quality issues while maintaining system stability. The phased approach allows for incremental progress with testing at each step.

**Estimated Total Time:** 6-10 hours  
**Recommended Schedule:** 5 days, 1-2 hours per day  
**Breaking Changes:** Yes, but TypeScript catches them  
**Rollback Complexity:** Low (git revert + backups)

**Ready to proceed?** 
- Start with Priority 1 (Equipment Types) for highest impact
- Or begin with Priority 3 (License Headers) for lowest risk
- Save Priority 2 (Spell Exports) for when more time available
