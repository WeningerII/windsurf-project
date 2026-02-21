# Project Architecture

**Last Updated**: February 18, 2026

---

## Overview

Multi-system RPG character sheet application with focus on D&D editions, built with TypeScript, React, and strict SRD compliance.

### UI Flow (App Composition)

- **GameSystemSelector**: Home-screen selector used to choose a system before creation.
- **App Create Flow**: "Create New Character" now creates a V2 `CharacterDocument` immediately and opens the sheet.
- **CharacterSheetTabs / SystemSheetRenderer**: Tabbed sheet + system-specific rendering path for editing and browsing.
- **Home + Header Actions**: Import/export/delete/clear controls are provided directly in App, with V2 storage utilities.

---

## Folder Structure

```
src/
├── data/
│   ├── dnd/
│   │   ├── 5e-2014/        # D&D 5e SRD 5.1 (2014)
│   │   │   ├── classes/    # 12 base classes + subclasses
│   │   │   ├── species/    # 9 SRD species
│   │   │   ├── spells/     # 238 spells implemented
│   │   │   ├── equipment/  # Weapons, armor, gear, magic items
│   │   │   ├── monsters/   # SRD creatures
│   │   │   ├── class-features/  # Fighter, monk, cleric, druid, warlock
│   │   │   └── metadata.ts
│   │   ├── 5e-2024/        # D&D 5e SRD 5.2 (2024)
│   │   └── 3.5e/           # D&D 3.5e SRD 3.5
│   │       ├── spells/
│   │       ├── equipment/  # Weapons, armor, gear, magic items
│   │       ├── feats/
│   │       ├── classes/
│   │       └── metadata.ts
│   ├── pathfinder/
│   │   ├── 1e/             # Pathfinder 1e
│   │   │   ├── classes/
│   │   │   ├── prestige-classes/
│   │   │   ├── spells/          # 134 spells
│   │   │   ├── feats/           # combat, general, metamagic, teamwork + more
│   │   │   ├── equipment/       # Weapons, armor, gear, magic items
│   │   │   └── races/
│   │   └── 2e/             # Pathfinder 2e
│   │       ├── classes/
│   │       ├── spells/          # 146 spells
│   │       ├── feats/
│   │       ├── ancestries/
│   │       ├── archetypes/
│   │       └── equipment/
│   ├── mutants-and-masterminds/
│   │   └── 3e/
│   │       ├── powers/
│   │       ├── advantages/
│   │       ├── equipment/
│   │       ├── archetypes/
│   │       └── metadata.ts
│   ├── game-systems.ts     # System definitions
│   └── index.ts            # System registry
├── types/
│   ├── character-options/  # Classes, species, etc.
│   ├── core/               # Abilities, proficiencies
│   ├── equipment/          # Equipment type definitions
│   ├── magic/              # Spell types
│   ├── mam/                # M&M-specific types
│   └── game-systems.ts     # GameSystemId union type
├── validation/
│   └── class-validator.ts  # Data validation system
└── components/             # React UI components
```

---

## System IDs

All game systems use consistent kebab-case IDs:

| System | ID | Version | Status |
|--------|-----|---------|--------|
| D&D 5e (2014) | `dnd-5e-2014` | SRD 5.1 | ✅ Active |
| D&D 5e (2024) | `dnd-5e-2024` | SRD 5.2 | ✅ Active |
| D&D 3.5e | `dnd-3.5e` | SRD 3.5 | ✅ Active |
| Pathfinder 1e | `pf1e` | PF1e SRD | ✅ Active |
| Pathfinder 2e | `pf2e` | PF2e SRD | ✅ Active |
| M&M 3e | `mam3e` | 3e | ✅ Active |

---

## Recent Consolidation (Jan 2026)

### Problem Solved
- Eliminated duplicate `dnd5e/` and `dnd/5e/` folders
- Standardized system IDs across 247+ files
- Removed abandoned `dnd/4e/` folder

### Changes
- `dnd5e` → `dnd-5e-2014` (clear version identification)
- `dnd35` → `dnd-3.5e` (consistent naming)
- All content moved to `dnd/5e-2014/`

---

## D&D Editions Roadmap

### D&D 5e (2014) - ✅ SRD SUBSET
**Location**: `src/data/dnd/5e-2014/`  
**Content**: SRD 5.1 subset implemented
- ✅ 12 classes + 12 subclasses
- ✅ 9 species
- ✅ 238 spells (SRD only)
- ✅ Equipment: 230 items
- ✅ 6 backgrounds
- ✅ Special abilities: Fighting Styles (8), Metamagic (9), Smites (8), Invocations (15), Ki Abilities (6)

**Note**: Full PHB contains additional content not in SRD 5.1

### D&D 5e (2024) - ✅ SRD SUBSET
**Location**: `src/data/dnd/5e-2024/`  
**Status**: SRD 5.2 subset (full SRD contents not officially documented)
**Implemented Content**:
- ✅ 315 spells - 26 cantrips + 289 leveled spells
- ✅ 12 classes with full 1-20 progressions
- ✅ 12 subclasses (one per class)
- ✅ 9 species with updated traits
- ✅ 87 feats (loader-backed canonical count)
- ✅ 6 backgrounds
- ✅ 204 equipment items (loader-backed canonical count)
- ✅ 99 monsters across 14 creature types

**Key Changes from 2014**:
- Updated weapon mastery system
- Revised class features and spell lists
- Origin feats and epic boons
- Species traits replace racial bonuses
- Background feat integration

**Note**: Represents verified SRD content; 2024 PHB contains ~400 spells total

### D&D 3.5e - 🔄 CORE IMPLEMENTATION
**Location**: `src/data/dnd/3.5e/`  
**Implemented Content**:
- ✅ 11 base classes
- ✅ 555 spells (SRD 3.5 consolidated across classes)
- ✅ 2 prestige classes
- ✅ 515 feats
- ✅ Equipment: 207 items (loader-backed canonical count)

**Status**: SRD 3.5 spell list complete; equipment and feats implemented

---

## Feb 2026 Cleanup

### Orphaned Data Consolidation
Identified and resolved "two-pass development" debris where initial implementations
using local types were superseded by shared-type implementations but never removed.

### Resolved

- Deleted orphaned `dnd/3.5e/magic-items/` (superseded by `equipment/magic-items.ts`)
- Deleted orphaned `dnd/3.5e/monsters/` (hollow scaffold, not wired in)
- Migrated `pathfinder/1e/magic-items/` → `equipment/magic-items.ts` using shared `MagicItem` type
- Merged 32 unique PF1e feats from 8 orphaned files into canonical feat files
- Removed `teamwork-feats.ts` from PF1e canonical exports to enforce Core Rulebook-only feat scope
- Moved `dnd/5e-2014/items/` into `equipment/` (magic-weapons, magic-armor, potions, wondrous-items)
- Updated 4 test file imports accordingly
- Fixed metadata counts for 3.5e and PF1e magic items

---

## Type System

### Core Types
- `AbilityScore` - str, dex, con, int, wis, cha
- `CharacterClass` - Class data structure
- `Species` - Species/race data
- `Spell` - Spell definitions

### Validation
- Required fields enforcement
- Spell slot array validation (exactly 20 elements)
- Proficiency consistency checks
- Feature progression validation

---

## Data Standards

### Proficiencies
Use constants from `src/constants/proficiencies.ts`:
```typescript
import { WeaponProficiency, ArmorProficiency, Skill } from './constants/proficiencies';
```

### System References
All data files include system ID:
```typescript
system: 'dnd-5e-2014'
```

### Sources
SRD-compliant source attribution:
```typescript
source: 'D&D 5e SRD 5.1 - Fighter class'
```

---

## Adding New Editions

1. Create folder: `src/data/dnd/[edition]/`
2. Add metadata.ts with progress tracking
3. Add system to `game-systems.ts`
4. Add to registry in `index.ts`
5. Implement content using existing structure

Example for 2024 SRD:
```
src/data/dnd/5e-2024/
├── classes/
├── species/
├── spells/
├── equipment/
└── metadata.ts
```

---

## Build Configuration

- **TypeScript**: Strict mode enabled
- **Excluded**: Test files (`src/__tests__/**/*`)
- **Validation**: `npm run validate`
- **Build**: `npm run build`

---

## Key Design Decisions

1. **Edition Versioning**: Explicit year in system IDs prevents confusion
2. **Kebab-Case**: Consistent naming across all systems
3. **Single Source**: One folder per edition, no duplicates
4. **Metadata Tracking**: Each edition tracks implementation progress
5. **SRD Compliance**: Strict adherence to open content licensing

---

## SRD Compliance Architecture

### Core Principle
**This project uses ONLY publicly available SRD content for all game systems.**

### System-Specific SRD Limits

**D&D 5e (SRD 5.1)**
- Maximum 1 subclass per class
- Only 9 species
- Only SRD spells and equipment

**Pathfinder 2e (Core Rulebook)**
- Only 19 core deities
- Only 6 core ancestries
- Maximum 4 heritages per ancestry
- No APG or supplement content

**Mutants & Masterminds 3e**
- 61 powers SRD-verified (attack:12, control:11, defense:7, general:16, movement:8, sensory:7)
- 74 advantages (combat:33, fortune:6, general:16, skill:19)
- 150 equipment (weapons:32, gear:30, devices:29, vehicles:24, armor:20, HQ:15)
- Single-source architecture with descriptor-based filtering

**D&D 3.5e (SRD 3.5)**
- Only SRD prestige classes
- No Complete series content

**Pathfinder 1e (SRD)**
- Only SRD content
- No campaign-specific content

### Data Validation
All data files include:
- `system` field with version ID (e.g., `'pf2e'`)
- `source` field with SRD reference (e.g., `'Core Rulebook'`, `'SRD 5.1'`)
- Comments documenting SRD compliance

### Enforcement
- Code review verifies SRD compliance
- Non-SRD content is rejected
- Tests validate source attribution
- See `SRD_COMPLIANCE.md` for complete policy
