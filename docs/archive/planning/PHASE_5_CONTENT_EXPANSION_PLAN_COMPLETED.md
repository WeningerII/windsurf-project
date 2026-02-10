# Phase 5: Content Expansion - Exhaustive Technical Plan

**Status:** 📚 **READY FOR IMPLEMENTATION**  
**Estimated Duration:** 6-8 weeks (240-320 hours)  
**Team:** 2-3 content developers + 1 technical lead  
**Priority:** High (complete SRD coverage)

---

## Executive Summary

This plan details the systematic expansion of SRD (System Reference Document) content across all six supported game systems. Based on current metadata analysis, we have identified specific gaps in each edition that require implementation to achieve complete SRD coverage.

**Current Overall Completion:** ~93%  
**Target Completion:** 100% SRD coverage  
**Total Missing Items:** ~1,100+ content pieces

---

## Table of Contents

1. [Current Status Analysis](#current-status-analysis)
2. [D&D 5e-2024 Expansion](#dnd-5e-2024-expansion)
3. [D&D 5e-2014 Expansion](#dnd-5e-2014-expansion)
4. [D&D 3.5e Expansion](#dnd-35e-expansion)
5. [Pathfinder 1e Expansion](#pathfinder-1e-expansion)
6. [Pathfinder 2e Expansion](#pathfinder-2e-expansion)
7. [Mutants & Masterminds 3e Expansion](#mutants--masterminds-3e-expansion)
8. [Implementation Standards](#implementation-standards)
9. [SRD Compliance Verification](#srd-compliance-verification)
10. [Quality Assurance Process](#quality-assurance-process)
11. [Timeline & Resource Allocation](#timeline--resource-allocation)

---

## Current Status Analysis

### Completion by System

| System | Completion | Missing Items | Priority | Estimated Hours |
|--------|------------|---------------|----------|-----------------|
| **D&D 5e-2024** | 100% | 0 | ✅ Complete | 0 |
| **D&D 5e-2014** | ~85% | 96 magic items + special abilities | High | 60-80 |
| **D&D 3.5e** | ~98% | 150 gear items | Low | 20-30 |
| **Pathfinder 1e** | ~96% | 800 archetypes | Medium | 80-120 |
| **Pathfinder 2e** | ~92% | 6 ancestries + 96 heritages | High | 40-60 |
| **M&M 3e** | 100% | 0 | ✅ Complete | 0 |

### Priority Matrix

**High Priority (Must Have):**
- D&D 5e-2014: Special abilities (combat maneuvers, ki, channel divinity, etc.)
- Pathfinder 2e: Core ancestry heritages

**Medium Priority (Should Have):**
- D&D 5e-2014: Remaining magic items
- Pathfinder 1e: Archetypes for customization

**Low Priority (Nice to Have):**
- D&D 3.5e: Adventuring gear
- General polish and edge cases

---

## D&D 5e-2024 Expansion

### Status: ✅ COMPLETE

**Current Progress:** 100% (790/790 items)

#### Completed Content
- ✅ All 315 spells (SRD 5.2)
- ✅ All 12 classes with subclasses
- ✅ All 9 species with traits
- ✅ All 91 feats (Origin + General + Fighting Style + Epic Boons)
- ✅ All 6 backgrounds
- ✅ All 209 equipment items (weapons, armor, gear, magic items)
- ✅ All 143 monsters

#### No Action Required
D&D 5e-2024 is fully implemented per SRD 5.2 specifications.

---

## D&D 5e-2014 Expansion

### Status: 🔶 85% COMPLETE (96+ items remaining)

**Current Progress:** 346/442 items  
**Estimated Effort:** 60-80 hours  
**Priority:** HIGH

### Missing Content Analysis

#### 1. Magic Items (96 items)
**Total SRD 5.1:** 200 items  
**Implemented:** 104 items  
**Missing:** 96 items

**Categories to Add:**
- Wondrous Items: ~40 items
- Scrolls and Potions: ~20 items
- Rods, Staves, Wands: ~15 items
- Weapons +1/+2/+3 variants: ~10 items
- Armor +1/+2/+3 variants: ~8 items
- Rings: ~3 items

**Implementation Spec:**
```typescript
// Location: src/data/dnd/5e-2014/equipment/magic-items-wondrous.ts
export const wondrousItems: MagicItem[] = [
  {
    id: 'amulet-of-health',
    name: 'Amulet of Health',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 210 },
    type: 'wondrous-item',
    rarity: 'rare',
    requiresAttunement: true,
    description: 'Your Constitution score is 19 while you wear this amulet...',
    weight: 0,
    value: { gp: 8000 },
    version: '1.0.0',
  },
  // ... more items
];
```

**Effort:** 30-40 hours (2-3 items per hour with validation)

#### 2. Battle Master Maneuvers (23 items)
**Total SRD 5.1:** 23 maneuvers  
**Implemented:** 0  
**Missing:** 23

**Implementation Spec:**
```typescript
// Location: src/data/dnd/5e-2014/class-features/fighter/maneuvers.ts
export interface BattleMasterManeuver {
  id: string;
  name: string;
  description: string;
  superiority Die: 'd8' | 'd10' | 'd12';
  system: 'dnd-5e-2014';
  source: Source;
  prerequisites?: string[];
  targetType: 'self' | 'creature' | 'area';
  actionType: 'attack' | 'reaction' | 'bonus' | 'special';
}

export const maneuvers: BattleMasterManeuver[] = [
  {
    id: 'commanders-strike',
    name: "Commander's Strike",
    description: 'When you take the Attack action...',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
  },
  // ... 22 more maneuvers
];
```

**Effort:** 6-8 hours (all 23 maneuvers)

#### 3. Monk Ki Abilities (9 additional)
**Total SRD 5.1:** 15 ki abilities  
**Implemented:** 6 base  
**Missing:** 9 Way of the Open Hand specific

**Implementation Spec:**
```typescript
// Location: src/data/dnd/5e-2014/class-features/monk/ki-abilities.ts
export interface KiAbility {
  id: string;
  name: string;
  kiCost: number;
  description: string;
  level: number; // when unlocked
  subclass?: 'open-hand' | 'shadow' | 'four-elements';
  actionType: 'action' | 'bonus' | 'reaction' | 'special';
}

export const kiAbilities: KiAbility[] = [
  {
    id: 'flurry-of-blows',
    name: 'Flurry of Blows',
    kiCost: 1,
    description: 'Immediately after taking Attack action...',
    level: 2,
    actionType: 'bonus',
  },
  // ... more abilities
];
```

**Effort:** 3-4 hours

#### 4. Warlock Invocations (9 additional)
**Total SRD 5.1:** 24 invocations  
**Implemented:** 15  
**Missing:** 9

**Missing Invocations:**
- Armor of Shadows
- Ascendant Step
- Chains of Carceri
- Lifedrinker
- Master of Myriad Forms
- Minions of Chaos
- Sculptor of Flesh
- Visions of Distant Realms
- Whispers of the Grave

**Implementation Spec:**
```typescript
// Location: src/data/dnd/5e-2014/class-features/warlock/invocations.ts
export interface EldritchInvocation {
  id: string;
  name: string;
  prerequisites?: string[];
  description: string;
  level: number; // minimum warlock level
  system: 'dnd-5e-2014';
  source: Source;
}
```

**Effort:** 3-4 hours

#### 5. Cleric Channel Divinity (15 options)
**Total SRD 5.1:** 15 channel divinity options  
**Implemented:** 0  
**Missing:** 15

**Categories:**
- Life Domain: 2 options (Preserve Life, etc.)
- Base Cleric: 2 options (Turn Undead, Destroy Undead)
- Other domains: ~11 options (if SRD includes more)

**Implementation Spec:**
```typescript
// Location: src/data/dnd/5e-2014/class-features/cleric/channel-divinity.ts
export interface ChannelDivinityOption {
  id: string;
  name: string;
  domain?: string;
  description: string;
  level: number;
  system: 'dnd-5e-2014';
  uses: 'per-rest';
  actionType: 'action' | 'bonus' | 'reaction';
}

export const channelDivinityOptions: ChannelDivinityOption[] = [
  {
    id: 'turn-undead',
    name: 'Turn Undead',
    description: 'As an action, present holy symbol...',
    level: 2,
    system: 'dnd-5e-2014',
    uses: 'per-rest',
    actionType: 'action',
  },
  // ... more options
];
```

**Effort:** 5-6 hours

#### 6. Druid Wild Shape Options (20 beasts)
**Total SRD 5.1:** 20 common wild shape forms  
**Implemented:** 0 (beasts exist but not tied to wild shape)  
**Missing:** 20 beast references + restrictions

**Implementation Spec:**
```typescript
// Location: src/data/dnd/5e-2014/class-features/druid/wild-shapes.ts
export interface WildShapeOption {
  beastId: string; // references monster
  name: string;
  minLevel: number;
  swimSpeed?: boolean; // level 4+
  flySpeed?: boolean; // level 8+
  maxCR: string; // '1/4', '1/2', '1', etc.
}

export const wildShapeOptions: WildShapeOption[] = [
  {
    beastId: 'wolf',
    name: 'Wolf',
    minLevel: 2,
    maxCR: '1/4',
  },
  {
    beastId: 'brown-bear',
    name: 'Brown Bear',
    minLevel: 2,
    maxCR: '1',
  },
  // ... more shapes
];
```

**Effort:** 4-5 hours

### Implementation Roadmap

**Week 1 (20 hours): High-Impact Class Features**
- Day 1-2: Battle Master Maneuvers (23 items) - 8 hours
- Day 3: Monk Ki Abilities (9 items) - 4 hours
- Day 4: Warlock Invocations (9 items) - 4 hours
- Day 5: Cleric Channel Divinity (15 items) - 6 hours

**Week 2 (20 hours): Druid Features + Magic Items Start**
- Day 1: Druid Wild Shapes (20 items) - 5 hours
- Day 2-5: Wondrous Items (40 items) - 15 hours

**Week 3-4 (40 hours): Magic Items Completion**
- Scrolls & Potions: 20 items - 8 hours
- Rods, Staves, Wands: 15 items - 6 hours
- Magic Weapons/Armor: 18 items - 6 hours
- Rings: 3 items - 2 hours
- Testing & Validation: 18 hours

**Total Effort:** 60-80 hours

### Data Files to Create

1. `src/data/dnd/5e-2014/class-features/fighter/maneuvers.ts`
2. `src/data/dnd/5e-2014/class-features/monk/ki-abilities.ts`
3. `src/data/dnd/5e-2014/class-features/warlock/invocations.ts`
4. `src/data/dnd/5e-2014/class-features/cleric/channel-divinity.ts`
5. `src/data/dnd/5e-2014/class-features/druid/wild-shapes.ts`
6. `src/data/dnd/5e-2014/equipment/magic-items-wondrous.ts`
7. `src/data/dnd/5e-2014/equipment/magic-items-consumables.ts`
8. `src/data/dnd/5e-2014/equipment/magic-items-rods-staves-wands.ts`
9. `src/data/dnd/5e-2014/equipment/magic-items-rings.ts`

### Success Criteria

- [ ] All 96 missing magic items implemented
- [ ] All 23 Battle Master maneuvers functional
- [ ] All 15 ki abilities implemented
- [ ] All 24 warlock invocations complete
- [ ] All 15 channel divinity options implemented
- [ ] All 20 wild shape options defined
- [ ] Metadata updated to show 100% completion
- [ ] All items validated against SRD 5.1
- [ ] Tests passing for all new content

---

## D&D 3.5e Expansion

### Status: 🔶 98% COMPLETE (150 items remaining)

**Current Progress:** 596/746 items  
**Estimated Effort:** 20-30 hours  
**Priority:** LOW

### Missing Content Analysis

#### 1. Adventuring Gear (150 items)
**Total SRD:** 150 items  
**Implemented:** 0  
**Missing:** 150

**Categories:**
- Basic Gear: ~40 items (rope, torches, bedrolls, etc.)
- Tools: ~30 items (thieve's tools, artisan tools, etc.)
- Containers: ~20 items (backpacks, pouches, chests, etc.)
- Clothing: ~15 items (common, noble, cold weather, etc.)
- Food & Lodging: ~20 items (rations, inn stays, etc.)
- Services: ~15 items (hireling costs, spell casting, etc.)
- Mounts & Vehicles: ~10 items (horses, wagons, boats, etc.)

**Implementation Spec:**
```typescript
// Location: src/data/dnd/3.5e/equipment/gear.ts
export interface AdventuringGear {
  id: string;
  name: string;
  system: 'dnd-3.5e';
  source: Source;
  cost: { gp: number; sp?: number; cp?: number };
  weight: number; // in pounds
  description: string;
  category: 'basic' | 'tools' | 'containers' | 'clothing' | 'food' | 'services' | 'mounts';
}

export const adventuringGear: AdventuringGear[] = [
  {
    id: 'backpack',
    name: 'Backpack',
    system: 'dnd-3.5e',
    source: { book: 'PHB', page: 126 },
    cost: { gp: 2 },
    weight: 2,
    description: 'A leather pack with two straps for wearing on the back...',
    category: 'containers',
  },
  // ... 149 more items
];
```

**Effort:** 20-30 hours (5-8 items per hour with pricing validation)

### Implementation Roadmap

**Week 1 (15 hours): Essential Gear**
- Day 1-2: Basic Gear (40 items) - 6 hours
- Day 3: Tools (30 items) - 4 hours
- Day 4: Containers (20 items) - 3 hours
- Day 5: Testing - 2 hours

**Week 2 (15 hours): Remaining Categories**
- Day 1: Clothing (15 items) - 2 hours
- Day 2: Food & Lodging (20 items) - 3 hours
- Day 3: Services (15 items) - 2 hours
- Day 4: Mounts & Vehicles (10 items) - 2 hours
- Day 5: Testing & Validation - 6 hours

**Total Effort:** 20-30 hours

### Data Files to Create

1. `src/data/dnd/3.5e/equipment/gear.ts`
2. `src/data/dnd/3.5e/equipment/services.ts` (optional split)
3. `src/data/dnd/3.5e/equipment/mounts-vehicles.ts` (optional split)

### Success Criteria

- [ ] All 150 gear items implemented
- [ ] Accurate pricing from SRD 3.5e
- [ ] Weight calculations correct
- [ ] Metadata updated to 100%
- [ ] All items validated against SRD

---

## Pathfinder 1e Expansion

### Status: 🔶 96% COMPLETE (800 archetypes remaining)

**Current Progress:** 1,417/2,217 items  
**Estimated Effort:** 80-120 hours  
**Priority:** MEDIUM

### Missing Content Analysis

#### 1. Class Archetypes (800 items)
**Total:** 800+ archetypes  
**Implemented:** 0  
**Missing:** 800

**Major Categories:**
- Barbarian Archetypes: ~60
- Bard Archetypes: ~70
- Cleric Archetypes: ~50
- Druid Archetypes: ~55
- Fighter Archetypes: ~80
- Monk Archetypes: ~65
- Paladin Archetypes: ~45
- Ranger Archetypes: ~75
- Rogue Archetypes: ~85
- Sorcerer Archetypes: ~60
- Wizard Archetypes: ~55
- Other Classes: ~200

**Implementation Spec:**
```typescript
// Location: src/data/pathfinder/1e/archetypes/[class]/index.ts
export interface Pf1eArchetype {
  id: string;
  name: string;
  class: string; // base class id
  system: 'pf1e';
  source: Source;
  description: string;
  replacedFeatures: string[]; // which class features are replaced
  newFeatures: ArchetypeFeature[];
  requirements?: string[];
}

export interface ArchetypeFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  replaces?: string; // class feature id
}

// Example: Barbarian Archetypes
export const barbarianArchetypes: Pf1eArchetype[] = [
  {
    id: 'armored-hulk',
    name: 'Armored Hulk',
    class: 'barbarian',
    system: 'pf1e',
    source: { book: 'APG', page: 79 },
    description: 'Heavily armored barbarians who wear armor...',
    replacedFeatures: ['fast-movement', 'damage-reduction'],
    newFeatures: [
      {
        id: 'armored-swiftness',
        name: 'Armored Swiftness',
        level: 2,
        description: 'Barbarian can move at normal speed in medium armor...',
        replaces: 'fast-movement',
      },
      // ... more features
    ],
  },
  // ... 59 more barbarian archetypes
];
```

**Effort:** 80-120 hours total

**Breakdown by Priority:**

**High Priority - Core Rulebook Archetypes (200 items, 30-40 hours):**
- Most commonly used archetypes
- One per base class minimum
- Cover 25% of archetype usage

**Medium Priority - APG + Ultimate Magic/Combat (400 items, 40-60 hours):**
- Advanced Player's Guide archetypes
- Ultimate Magic/Ultimate Combat additions
- Cover 50% of archetype usage

**Low Priority - Remaining Sources (200 items, 20-30 hours):**
- Splat books and supplementary content
- Edge cases and specialized builds
- Cover remaining 25% usage

### Implementation Roadmap

**Phase 1: Core Archetypes (Weeks 1-2, 30-40 hours)**
- Week 1: Martial classes (Barbarian, Fighter, Ranger, Rogue) - 80 archetypes - 15 hours
- Week 2: Caster classes (Cleric, Druid, Sorcerer, Wizard, Bard) - 70 archetypes - 15 hours
- Week 2: Hybrid classes (Paladin, Monk) - 50 archetypes - 10 hours

**Phase 2: APG + Ultimate Series (Weeks 3-5, 40-60 hours)**
- Week 3: APG additions (all classes) - 150 archetypes - 20 hours
- Week 4: Ultimate Magic (caster-focused) - 100 archetypes - 15 hours
- Week 5: Ultimate Combat (martial-focused) - 150 archetypes - 20 hours

**Phase 3: Supplementary Content (Weeks 6-7, 20-30 hours)**
- Week 6: Advanced Race Guide racial archetypes - 100 archetypes - 15 hours
- Week 7: Misc sources + testing - 100 archetypes - 15 hours

**Total Effort:** 80-120 hours

### Data Files to Create

Per-class archetype files:
1. `src/data/pathfinder/1e/archetypes/barbarian/index.ts`
2. `src/data/pathfinder/1e/archetypes/bard/index.ts`
3. `src/data/pathfinder/1e/archetypes/cleric/index.ts`
4. `src/data/pathfinder/1e/archetypes/druid/index.ts`
5. `src/data/pathfinder/1e/archetypes/fighter/index.ts`
6. `src/data/pathfinder/1e/archetypes/monk/index.ts`
7. `src/data/pathfinder/1e/archetypes/paladin/index.ts`
8. `src/data/pathfinder/1e/archetypes/ranger/index.ts`
9. `src/data/pathfinder/1e/archetypes/rogue/index.ts`
10. `src/data/pathfinder/1e/archetypes/sorcerer/index.ts`
11. `src/data/pathfinder/1e/archetypes/wizard/index.ts`
12. `src/data/pathfinder/1e/archetypes/index.ts` (aggregator)

### Success Criteria

- [ ] At least 200 core archetypes implemented (Phase 1)
- [ ] All base classes have minimum 5 archetype options
- [ ] Archetype feature replacement correctly mapped
- [ ] Source attribution accurate
- [ ] Metadata updated with archetype counts
- [ ] Validation tests passing
- [ ] Optional: All 800 archetypes for 100% coverage

---

## Pathfinder 2e Expansion

### Status: 🔶 92% COMPLETE (102 items remaining)

**Current Progress:** 564/666 items  
**Estimated Effort:** 40-60 hours  
**Priority:** HIGH

### Missing Content Analysis

#### 1. Uncommon Ancestries (6 items)
**Total:** 20 ancestries  
**Implemented:** 14  
**Missing:** 6 uncommon ancestries

**Missing Ancestries:**
- Catfolk
- Kobold
- Lizardfolk
- Orc
- Ratfolk
- Tengu

**Implementation Spec:**
```typescript
// Location: src/data/pathfinder/2e/ancestries/uncommon/index.ts
export interface Pf2eAncestry {
  id: string;
  name: string;
  system: 'pf2e';
  source: Source;
  rarity: 'common' | 'uncommon' | 'rare';
  hitPoints: number;
  size: 'tiny' | 'small' | 'medium' | 'large';
  speed: number;
  abilityBoosts: string[]; // 'free', 'strength', etc.
  abilityFlaw?: string;
  languages: string[];
  traits: string[];
  specialAbilities: string[];
  heritages: string[]; // heritage ids
}

export const uncommonAncestries: Pf2eAncestry[] = [
  {
    id: 'catfolk',
    name: 'Catfolk',
    system: 'pf2e',
    source: { book: 'LOCG', page: 46 },
    rarity: 'uncommon',
    hitPoints: 8,
    size: 'medium',
    speed: 25,
    abilityBoosts: ['dexterity', 'charisma', 'free'],
    abilityFlaw: 'wisdom',
    languages: ['Common', 'Amurrun'],
    traits: ['catfolk', 'humanoid'],
    specialAbilities: ['Low-Light Vision', 'Land on Your Feet'],
    heritages: ['clawed-catfolk', 'hunting-catfolk', 'nine-lives-catfolk', 'winter-catfolk'],
  },
  // ... 5 more ancestries
];
```

**Effort:** 8-10 hours (6 ancestries × 1.5 hours each)

#### 2. Ancestry Heritages for Uncommon (96 items)
**Total:** 112 heritages  
**Implemented:** 24 (core only) + potential 96 from metadata  
**Actually Missing:** ~96 heritages for uncommon ancestries

**Per Ancestry:**
- Catfolk: 16 heritages
- Kobold: 16 heritages
- Lizardfolk: 16 heritages
- Orc: 16 heritages
- Ratfolk: 16 heritages
- Tengu: 16 heritages

**Implementation Spec:**
```typescript
// Location: src/data/pathfinder/2e/heritages/catfolk.ts
export interface Pf2eHeritage {
  id: string;
  name: string;
  ancestry: string; // ancestry id
  system: 'pf2e';
  source: Source;
  rarity: 'common' | 'uncommon' | 'rare';
  description: string;
  benefits: string[];
}

export const catfolkHeritages: Pf2eHeritage[] = [
  {
    id: 'clawed-catfolk',
    name: 'Clawed Catfolk',
    ancestry: 'catfolk',
    system: 'pf2e',
    source: { book: 'LOCG', page: 47 },
    rarity: 'common',
    description: 'Your family has particularly long, sharp claws...',
    benefits: [
      'Claws are unarmed attacks',
      'Deal 1d6 slashing damage',
      'Agile trait',
      'Finesse trait',
    ],
  },
  // ... 15 more catfolk heritages
];
```

**Effort:** 30-40 hours (96 heritages × 20-25 min each)

#### 3. Spell Tradition Breakdown (174 spells)
**Total:** 174 spells  
**Implemented:** 174 spells (structure exists)  
**Missing:** Tradition categorization (arcane, divine, occult, primal)

**Implementation Spec:**
```typescript
// Update existing spell files to include tradition
export interface Pf2eSpell {
  // ... existing fields
  traditions: ('arcane' | 'divine' | 'occult' | 'primal')[]; // ADD THIS
}

// Example update in src/data/pathfinder/2e/spells/cantrips.ts
{
  id: 'acid-splash',
  name: 'Acid Splash',
  level: 0,
  traditions: ['arcane', 'primal'], // ADD THIS
  // ... rest of spell data
}
```

**Effort:** 8-12 hours (verify all 174 spells × 3-4 min each)

### Implementation Roadmap

**Week 1 (20 hours): Uncommon Ancestries**
- Day 1: Catfolk + 16 heritages - 6 hours
- Day 2: Kobold + 16 heritages - 6 hours
- Day 3: Lizardfolk + 16 heritages - 6 hours
- Day 4-5: Testing - 2 hours

**Week 2 (20 hours): More Ancestries**
- Day 1: Orc + 16 heritages - 6 hours
- Day 2: Ratfolk + 16 heritages - 6 hours
- Day 3: Tengu + 16 heritages - 6 hours
- Day 4-5: Testing - 2 hours

**Week 3 (20 hours): Spell Traditions + Final Testing**
- Day 1-3: Add traditions to all 174 spells - 12 hours
- Day 4-5: Comprehensive testing & validation - 8 hours

**Total Effort:** 40-60 hours

### Data Files to Create/Modify

**New Files:**
1. `src/data/pathfinder/2e/ancestries/catfolk.ts`
2. `src/data/pathfinder/2e/ancestries/kobold.ts`
3. `src/data/pathfinder/2e/ancestries/lizardfolk.ts`
4. `src/data/pathfinder/2e/ancestries/orc.ts`
5. `src/data/pathfinder/2e/ancestries/ratfolk.ts`
6. `src/data/pathfinder/2e/ancestries/tengu.ts`
7. `src/data/pathfinder/2e/heritages/catfolk.ts`
8. `src/data/pathfinder/2e/heritages/kobold.ts`
9. `src/data/pathfinder/2e/heritages/lizardfolk.ts`
10. `src/data/pathfinder/2e/heritages/orc.ts`
11. `src/data/pathfinder/2e/heritages/ratfolk.ts`
12. `src/data/pathfinder/2e/heritages/tengu.ts`

**Modified Files:**
- All spell files in `src/data/pathfinder/2e/spells/*` (add traditions field)

### Success Criteria

- [ ] All 6 uncommon ancestries implemented
- [ ] All 96 uncommon heritages complete
- [ ] Spell traditions categorized for all 174 spells
- [ ] Metadata updated to show ~98-100% completion
- [ ] Heritage benefits accurately described
- [ ] Source attribution correct (LOCG, APG, etc.)
- [ ] Tests passing for new content

---

## Mutants & Masterminds 3e Expansion

### Status: ✅ 100% COMPLETE

**Current Progress:** 329/329 items  
**Estimated Effort:** 0 hours  
**Priority:** N/A

#### No Action Required
All M&M 3e content from the Hero's Handbook and supplementary SRD sources is fully implemented.

**Completed Content:**
- ✅ All 30 base powers with descriptions
- ✅ All 105 power modifiers (60 extras, 45 flaws)
- ✅ All 81 advantages across 4 categories
- ✅ All 17 skills
- ✅ All 31 complications
- ✅ All 128 equipment items (vehicles, devices, HQ, weapons, armor, gear)
- ✅ All 15 official archetypes

---

## Implementation Standards

### TypeScript Type Safety

All content MUST follow strict TypeScript typing:

```typescript
// Base interface example
export interface GameContent {
  id: string; // kebab-case, unique within system
  name: string; // Display name
  system: GameSystemId; // 'dnd-5e-2014', 'pf2e', etc.
  source: Source; // Book reference
  description: string; // Full text description
  version: string; // Semantic version '1.0.0'
}

export interface Source {
  book: string; // 'SRD 5.1', 'PHB', 'CRB', etc.
  page: number;
  url?: string; // Optional SRD link
}
```

### ID Conventions

**Format:** `kebab-case` with system prefix where needed

**Examples:**
- ✅ `commanders-strike` (maneuver)
- ✅ `amulet-of-health` (magic item)
- ✅ `clawed-catfolk` (heritage)
- ❌ `Commander's Strike` (incorrect casing)
- ❌ `amulet_of_health` (incorrect separator)

### Data Organization

**File Structure:**
```
src/data/
├── dnd/
│   ├── 5e-2014/
│   │   ├── class-features/
│   │   │   ├── fighter/
│   │   │   │   ├── maneuvers.ts
│   │   │   │   └── index.ts
│   │   │   ├── monk/
│   │   │   │   ├── ki-abilities.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── equipment/
│   │   │   ├── magic-items-wondrous.ts
│   │   │   ├── magic-items-consumables.ts
│   │   │   └── index.ts
│   │   └── metadata.ts
│   ├── 5e-2024/ ...
│   └── 3.5e/ ...
├── pathfinder/
│   ├── 1e/
│   │   ├── archetypes/
│   │   │   ├── barbarian/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── metadata.ts
│   ├── 2e/
│   │   ├── ancestries/
│   │   │   ├── catfolk.ts
│   │   │   └── index.ts
│   │   ├── heritages/
│   │   │   ├── catfolk.ts
│   │   │   └── index.ts
│   │   └── metadata.ts
└── mutants-and-masterminds/3e/ ...
```

### Validation Requirements

Every content item MUST pass:

1. **Type Validation:** TypeScript compiler with `strict: true`
2. **Schema Validation:** Custom validators in `src/validation/`
3. **SRD Compliance:** Source attribution and accuracy check
4. **ID Uniqueness:** No duplicate IDs within system
5. **Reference Integrity:** All cross-references must resolve

**Example Validator:**
```typescript
// src/validation/magic-item-validator.ts
export function validateMagicItem(item: MagicItem): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!item.id || !item.id.match(/^[a-z0-9-]+$/)) {
    errors.push(`Invalid ID: ${item.id}`);
  }
  
  // Rarity must be valid
  const validRarities = ['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact'];
  if (!validRarities.includes(item.rarity)) {
    errors.push(`Invalid rarity: ${item.rarity}`);
  }
  
  // Source must exist
  if (!item.source || !item.source.book || !item.source.page) {
    errors.push('Missing source attribution');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Testing Requirements

Each new content file MUST include:

```typescript
// Example: src/__tests__/dnd-5e-2014-maneuvers.test.ts
import { describe, it, expect } from 'vitest';
import { maneuvers } from '../data/dnd/5e-2014/class-features/fighter/maneuvers';
import { validateManeuver } from '../validation/maneuver-validator';

describe('D&D 5e-2014 Battle Master Maneuvers', () => {
  it('should have exactly 23 maneuvers', () => {
    expect(maneuvers).toHaveLength(23);
  });
  
  it('should have unique IDs', () => {
    const ids = maneuvers.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  it('should all have valid structure', () => {
    maneuvers.forEach(maneuver => {
      const result = validateManeuver(maneuver);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
  
  it('should all reference SRD 5.1', () => {
    maneuvers.forEach(maneuver => {
      expect(maneuver.source.book).toBe('SRD 5.1');
      expect(maneuver.system).toBe('dnd-5e-2014');
    });
  });
});
```

---

## SRD Compliance Verification

### Source Material References

**D&D 5e-2014:** [SRD 5.1](https://dnd.wizards.com/resources/systems-reference-document)  
**D&D 5e-2024:** [SRD 5.2](https://www.dndbeyond.com/sources/srd-cc)  
**D&D 3.5e:** [SRD 3.5](https://www.d20srd.org/)  
**Pathfinder 1e:** [PFSRD](https://www.d20pfsrd.com/)  
**Pathfinder 2e:** [Archives of Nethys](https://2e.aonprd.com/)  
**M&M 3e:** [Hero's Handbook SRD](https://www.d20herosrd.com/)

### Verification Checklist

For each content item:

- [ ] **Name matches SRD exactly** (including capitalization)
- [ ] **Description uses SRD text** (paraphrased if copyright-sensitive)
- [ ] **Mechanics accurately represent SRD rules**
- [ ] **Source attribution includes book + page number**
- [ ] **No non-SRD content** (e.g., no PHB-exclusive items for D&D 5e)
- [ ] **Rarity/Availability correct** per SRD specifications
- [ ] **Prerequisites accurate** (level, class, ability score, etc.)

### Legal Compliance

**OGL Notice:**
All content MUST include appropriate Open Gaming License attribution:

```typescript
// In each data file header
/**
 * [System] [Edition] - [Content Type]
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: [SRD Name] ([URL])
 * License: OGL v1.0a
 * 
 * See LICENSE.md for full OGL text.
 */
```

**Prohibited Content:**
- ❌ Product identity (specific brand names, logos)
- ❌ Non-SRD content (PHB-exclusive, adventure modules)
- ❌ Artwork, maps, or visual assets
- ❌ Verbatim text for long-form descriptions (paraphrase)

---

## Quality Assurance Process

### Phase 1: Content Creation

**Developer Responsibilities:**
1. Implement content per specification
2. Follow TypeScript type definitions
3. Add source attribution
4. Write unit tests
5. Run local validation

**Deliverables:**
- Content data files (.ts)
- Unit tests (.test.ts)
- Updated metadata.ts
- Git commit with descriptive message

### Phase 2: Code Review

**Reviewer Checklist:**
- [ ] TypeScript types correct
- [ ] IDs follow kebab-case convention
- [ ] Source attribution present and accurate
- [ ] Descriptions clear and SRD-compliant
- [ ] Tests comprehensive and passing
- [ ] No duplicate IDs
- [ ] Metadata updated

**Tools:**
- ESLint for code quality
- TypeScript compiler for type safety
- `npm test` for unit tests
- `npm run lint` for style checks

### Phase 3: Integration Testing

**System-Wide Tests:**
```bash
# Run full test suite
npm test

# Check metadata calculations
npm run test:metadata

# Validate all IDs unique
npm run test:ids

# SRD compliance check
npm run test:srd-compliance
```

**Manual Testing:**
- Load system in UI
- Verify data displays correctly
- Test search/filter functionality
- Check cross-references resolve
- Validate mobile responsiveness

### Phase 4: Deployment

**Pre-Deployment:**
- [ ] All tests passing (3281+ tests)
- [ ] ESLint clean (0 errors)
- [ ] TypeScript compilation success
- [ ] Metadata reflects new content
- [ ] Bundle size acceptable (<2.5 MB)
- [ ] Documentation updated

**Deployment Process:**
```bash
# Build production bundle
npm run build

# Verify bundle
open dist/stats.html

# Deploy to staging
vercel --prod

# Smoke test staging
# - Verify new content appears
# - Test data loading
# - Check performance
```

---

## Timeline & Resource Allocation

### Overall Schedule (6-8 weeks)

```
Week 1-2: D&D 5e-2014 High Priority (40 hours)
├── Battle Master Maneuvers
├── Monk Ki Abilities
├── Warlock Invocations
├── Cleric Channel Divinity
└── Druid Wild Shapes

Week 3-4: D&D 5e-2014 Magic Items (40 hours)
├── Wondrous Items (40)
├── Consumables (20)
├── Rods/Staves/Wands (15)
└── Rings (3)

Week 5-6: Pathfinder 2e (40-60 hours)
├── 6 Uncommon Ancestries
├── 96 Heritages
└── Spell Tradition Categorization

Week 7-8: Pathfinder 1e + D&D 3.5e (40-60 hours)
├── Pathfinder 1e: Core Archetypes (200)
├── D&D 3.5e: Adventuring Gear (150)
└── Final Testing & Polish

Week 9-10 (Optional): Extended Content
├── Pathfinder 1e: Remaining Archetypes (600)
└── Additional polish and optimization
```

### Resource Requirements

**Team Composition:**

**Content Developer Lead (1 person, 40 hours/week):**
- Implements D&D 5e-2014 special abilities
- Implements Pathfinder 2e ancestries/heritages
- Reviews all content submissions
- Ensures SRD compliance

**Content Developer 1 (1 person, 20-30 hours/week):**
- Implements D&D 5e-2014 magic items
- Implements D&D 3.5e gear
- Writes unit tests

**Content Developer 2 (1 person, 20-30 hours/week):**
- Implements Pathfinder 1e archetypes
- Updates spell tradition data
- Writes unit tests

**Technical Lead (1 person, 10-15 hours/week):**
- Code reviews
- Type system enhancements
- Integration testing
- Deployment coordination

**Total Effort:** 240-320 hours over 6-8 weeks

### Milestone Tracking

**Milestone 1 (Week 2): D&D 5e-2014 Class Features** ✓
- Deliverable: All special abilities implemented
- Tests: 100+ new tests passing
- Metrics: 40-50% of D&D 5e-2014 gap closed

**Milestone 2 (Week 4): D&D 5e-2014 Complete** ✓
- Deliverable: All magic items + class features
- Tests: 200+ new tests
- Metrics: D&D 5e-2014 at 100%

**Milestone 3 (Week 6): Pathfinder 2e Complete** ✓
- Deliverable: All uncommon ancestries + heritages
- Tests: 150+ new tests
- Metrics: Pathfinder 2e at 98-100%

**Milestone 4 (Week 8): All Systems 98%+** ✓
- Deliverable: Core content complete for all systems
- Tests: 400+ new tests
- Metrics: Overall completion >98%

**Milestone 5 (Week 10, Optional): 100% Coverage** ✓
- Deliverable: All Pathfinder 1e archetypes
- Tests: 500+ total new tests
- Metrics: All systems at 100%

---

## Budget & Cost Estimation

### Developer Costs

**Hourly Rate Assumptions:**
- Content Developer Lead: $60-80/hour
- Content Developer: $40-60/hour
- Technical Lead: $80-100/hour

**Cost Breakdown:**

| Role | Hours | Rate | Total |
|------|-------|------|-------|
| Content Lead | 240 | $70/hr | $16,800 |
| Developer 1 | 120-180 | $50/hr | $6,000-9,000 |
| Developer 2 | 120-180 | $50/hr | $6,000-9,000 |
| Technical Lead | 60-100 | $90/hr | $5,400-9,000 |
| **Total** | **540-700** | - | **$34,200-43,800** |

**Optional Extended Scope (Weeks 9-10):**
- Additional 120-160 hours for full archetype implementation
- Cost: +$8,000-12,000
- **Extended Total:** $42,200-55,800

### Alternative: In-House Development

**Salaried Team (8 weeks):**
- 2 Junior Developers (20 hours/week × 8 weeks = 160 hours each)
- 1 Senior Developer (40 hours/week × 8 weeks = 320 hours)
- Total: 640 hours

**Estimated Cost (prorated salary):**
- Junior Devs: $40k annual × 2 × (8/52) = $12,308
- Senior Dev: $90k annual × (8/52) = $13,846
- **Total:** ~$26,154

---

## Risk Management

### Identified Risks

**Risk 1: SRD Compliance Issues**
- **Probability:** Medium
- **Impact:** High (legal)
- **Mitigation:** Mandatory source verification, legal review of sample content

**Risk 2: Data Quality/Accuracy**
- **Probability:** Medium
- **Impact:** Medium (user trust)
- **Mitigation:** Peer review, automated validation, community testing

**Risk 3: Scope Creep**
- **Probability:** High
- **Impact:** Medium (timeline)
- **Mitigation:** Strict adherence to SRD-only content, phase gating

**Risk 4: TypeScript Breaking Changes**
- **Probability:** Low
- **Impact:** High (technical debt)
- **Mitigation:** Comprehensive type definitions, migration scripts

**Risk 5: Team Availability**
- **Probability:** Medium
- **Impact:** High (timeline)
- **Mitigation:** Buffer time in schedule, cross-training

### Contingency Plans

**If Timeline Slips (2+ weeks behind):**
- Reduce Pathfinder 1e archetypes to core 200 only
- Defer D&D 3.5e gear to future phase
- Focus on high-priority items only

**If Budget Exceeded (>20% over):**
- Re-prioritize to high-impact content only
- Extend timeline rather than add resources
- Community contribution program

**If SRD Issues Discovered:**
- Immediate content freeze
- Legal consultation
- Remove problematic content
- Implement stricter verification

---

## Success Criteria

### Quantitative Metrics

- [ ] **D&D 5e-2014:** 100% SRD 5.1 coverage (442/442 items)
- [ ] **D&D 3.5e:** 100% essential content (746/746 items)
- [ ] **Pathfinder 1e:** 96%+ coverage (1,417+ items minimum)
- [ ] **Pathfinder 2e:** 98%+ coverage (650+ items)
- [ ] **Overall:** >98% across all systems
- [ ] **Tests:** 3,681+ tests passing (400+ new tests)
- [ ] **ESLint:** 0 errors maintained
- [ ] **TypeScript:** 0 compilation errors
- [ ] **Bundle Size:** <2.5 MB total

### Qualitative Metrics

- [ ] SRD compliance verified for all new content
- [ ] User feedback positive (>4.5/5 rating)
- [ ] No legal compliance issues
- [ ] Documentation comprehensive
- [ ] Code review approval rate >95%
- [ ] Community contributions enabled
- [ ] Performance maintained (<3s load time)

---

## Appendix A: Content Type Definitions

### Full TypeScript Interfaces

<details>
<summary>Click to expand complete type definitions</summary>

```typescript
// Battle Master Maneuvers
export interface BattleMasterManeuver {
  id: string;
  name: string;
  description: string;
  superiorityDie: 'd8' | 'd10' | 'd12';
  system: 'dnd-5e-2014';
  source: Source;
  prerequisites?: string[];
  targetType: 'self' | 'creature' | 'area';
  actionType: 'attack' | 'reaction' | 'bonus' | 'special';
  savingThrow?: {
    ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    dc: 'maneuver-save-dc';
  };
}

// Monk Ki Abilities
export interface KiAbility {
  id: string;
  name: string;
  kiCost: number;
  description: string;
  level: number;
  subclass?: 'open-hand' | 'shadow' | 'four-elements';
  actionType: 'action' | 'bonus' | 'reaction' | 'special';
  duration?: string;
  system: 'dnd-5e-2014';
  source: Source;
}

// Warlock Invocations
export interface EldritchInvocation {
  id: string;
  name: string;
  prerequisites?: string[];
  description: string;
  level: number;
  system: 'dnd-5e-2014';
  source: Source;
}

// Channel Divinity
export interface ChannelDivinityOption {
  id: string;
  name: string;
  domain?: string;
  description: string;
  level: number;
  system: 'dnd-5e-2014';
  uses: 'per-rest';
  actionType: 'action' | 'bonus' | 'reaction';
  source: Source;
}

// Wild Shape
export interface WildShapeOption {
  beastId: string;
  name: string;
  minLevel: number;
  swimSpeed?: boolean;
  flySpeed?: boolean;
  maxCR: string;
  system: 'dnd-5e-2014';
}

// Pathfinder 1e Archetype
export interface Pf1eArchetype {
  id: string;
  name: string;
  class: string;
  system: 'pf1e';
  source: Source;
  description: string;
  replacedFeatures: string[];
  newFeatures: ArchetypeFeature[];
  requirements?: string[];
}

export interface ArchetypeFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  replaces?: string;
}

// Pathfinder 2e Ancestry
export interface Pf2eAncestry {
  id: string;
  name: string;
  system: 'pf2e';
  source: Source;
  rarity: 'common' | 'uncommon' | 'rare';
  hitPoints: number;
  size: 'tiny' | 'small' | 'medium' | 'large';
  speed: number;
  abilityBoosts: string[];
  abilityFlaw?: string;
  languages: string[];
  traits: string[];
  specialAbilities: string[];
  heritages: string[];
}

// Pathfinder 2e Heritage
export interface Pf2eHeritage {
  id: string;
  name: string;
  ancestry: string;
  system: 'pf2e';
  source: Source;
  rarity: 'common' | 'uncommon' | 'rare';
  description: string;
  benefits: string[];
}

// D&D 3.5e Gear
export interface AdventuringGear {
  id: string;
  name: string;
  system: 'dnd-3.5e';
  source: Source;
  cost: { gp: number; sp?: number; cp?: number };
  weight: number;
  description: string;
  category: 'basic' | 'tools' | 'containers' | 'clothing' | 'food' | 'services' | 'mounts';
}
```

</details>

---

## Appendix B: Validation Scripts

### ID Uniqueness Validator

```typescript
// src/validation/id-uniqueness.test.ts
import { describe, it, expect } from 'vitest';
import { allGameContent } from '../data';

describe('ID Uniqueness Validation', () => {
  it('should have unique IDs within each system', () => {
    const systemIds = new Map<string, Set<string>>();
    
    allGameContent.forEach(item => {
      if (!systemIds.has(item.system)) {
        systemIds.set(item.system, new Set());
      }
      
      const ids = systemIds.get(item.system)!;
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    });
  });
});
```

### SRD Compliance Validator

```typescript
// src/validation/srd-compliance.test.ts
import { describe, it, expect } from 'vitest';
import { allGameContent } from '../data';

describe('SRD Compliance', () => {
  it('should have source attribution for all items', () => {
    allGameContent.forEach(item => {
      expect(item.source).toBeDefined();
      expect(item.source.book).toBeDefined();
      expect(item.source.page).toBeGreaterThan(0);
    });
  });
  
  it('should use approved SRD sources only', () => {
    const approvedSources = {
      'dnd-5e-2014': ['SRD 5.1'],
      'dnd-5e-2024': ['SRD 5.2'],
      'dnd-3.5e': ['PHB', 'DMG', 'MM', 'SRD 3.5'],
      'pf1e': ['CRB', 'APG', 'UM', 'UC', 'ARG'],
      'pf2e': ['CRB', 'APG', 'SoM', 'LOPG', 'LOCG'],
      'mam3e': ['HH', 'GG', 'PP', 'DHH'],
    };
    
    allGameContent.forEach(item => {
      const approved = approvedSources[item.system] || [];
      expect(approved).toContain(item.source.book);
    });
  });
});
```

---

## Appendix C: Example Pull Request Template

```markdown
## Phase 5 Content Addition: [Content Type]

### Summary
Implements [X] [content type] for [System] [Edition] per SRD specifications.

### Changes
- Added [X] new [content type] items
- Updated metadata to reflect completion
- Added [Y] unit tests
- Verified SRD compliance

### Testing
- [ ] All unit tests passing
- [ ] TypeScript compilation success
- [ ] ESLint clean
- [ ] Manual testing in UI
- [ ] Source verification complete

### Checklist
- [ ] IDs follow kebab-case convention
- [ ] Source attribution present (book + page)
- [ ] Descriptions accurate to SRD
- [ ] No non-SRD content included
- [ ] Metadata.ts updated
- [ ] Tests comprehensive
- [ ] Code reviewed

### Related Issues
Closes #XXX

### Screenshots (if applicable)
[Screenshot of content in UI]
```

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Ready for Implementation  
**Next Review:** Phase 5 Kickoff Meeting
