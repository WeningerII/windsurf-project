# Mutants & Masterminds 3e Powers

**Last Updated**: February 10, 2026 (SRD-only verification)

## Architecture Overview

This directory implements a **single-source architecture** for organizing M&M 3e powers by type (mechanical function), matching the pattern used for D&D/Pathfinder spell organization.

**Powers are organized by TYPE** (the primary M&M 3e classification), similar to how D&D spells are organized by level.

### Directory Structure

```
powers/
├── core/
│   ├── attack.ts          # Attack powers (Damage, Affliction, Blast, etc.)
│   ├── defense.ts         # Defense powers (Protection, Immunity, etc.)
│   ├── movement.ts        # Movement powers (Flight, Teleport, etc.)
│   ├── sensory.ts         # Sensory powers (Senses, Telepathy, etc.)
│   ├── general.ts         # General powers (Enhanced Ability, Healing, etc.)
│   ├── control.ts         # Control powers (Environment, Move Object, etc.)
│   └── index.ts           # Core exports
├── index.ts               # Master export
├── aggregations.ts        # Utilities and descriptor-based filtering
└── README.md              # This file
```

## Usage

### Import All Powers

```typescript
import { allPowers, powerById } from '@/data/mutants-and-masterminds/3e/powers';

// Access all powers
console.log(allPowers.length); // 61 SRD-verified powers

// Quick lookup by ID
const blast = powerById['blast'];
```

### Import By Type (Mechanical)

```typescript
import { attackPowers, defensePowers, movementPowers } from '@/data/mutants-and-masterminds/3e/powers';

// Use specific type
attackPowers.forEach(power => console.log(power.name));
console.log(attackPowers.length); // 12 attack powers

// Use powersByType for all at once
import { powersByType } from '@/data/mutants-and-masterminds/3e/powers';
const attacks = powersByType['attack'];
const defenses = powersByType['defense'];
```

### Filter By Descriptor (Thematic)

```typescript
import { powersByDescriptor, descriptorGroups } from '@/data/mutants-and-masterminds/3e/powers';

// Get all fire-themed powers (any type)
const firePowers = powersByDescriptor('fire');

// Or use predefined groups
const mentalPowers = descriptorGroups.mental();
const magicPowers = descriptorGroups.magic();
const energyPowers = descriptorGroups.energy();

// Available descriptor groups:
// Elemental: fire, cold, electricity, water, earth, air
// Energy: energy, radiation, light, force
// Mental: mental, psychic, telepathy
// Supernatural: magic, cosmic, divine
// Tech: technology, scientific
// Physical: biological, physical
// Reality: reality, temporal, dimensional
// Combat: weapon, armor
```

## Organization Philosophy

**M&M 3e Powers = D&D Spell Levels** (Primary Organization)

Just as D&D spells are organized by level (0-9), M&M powers are organized by **type** (attack, defense, movement, sensory, general, control). This is the official M&M 3e classification and represents the mechanical function of each power.

**Descriptors = Spell Schools** (Secondary Filtering)

Just as D&D spells have schools (evocation, enchantment, etc.), M&M powers have **descriptors** (fire, mental, magic, cosmic, etc.) that describe thematic flavor. Use the `powersByDescriptor()` function to filter by theme.

### Power Types (61 Total — 40 Core Effects + 21 Sample Powers)

- **Attack** (12): 4 core (Damage, Affliction, Nullify, Weaken) + 8 sample (Blast, Dazzle, Energy Aura, Mental Blast, Sleep, Snare, Strike, Suffocation)
- **Control** (11): 7 core (Create, Environment, Illusion, Luck Control, Move Object, Summon, Transform) + 4 sample (Duplication, Element Control, Energy Control, Mind Control)
- **Defense** (7): 5 core (Protection, Immunity, Regeneration, Immortality, Deflect) + 2 sample (Force Field, Energy Absorption)
- **General** (16): 11 core (Elongation, Enhanced Trait, Extra Limbs, Feature, Growth, Healing, Insubstantial, Morph, Quickness, Shrinking, Variable) + 5 sample (Alternate Form, Magic, Mimic, Power-Lifting, Shapeshift)
- **Movement** (8): 7 core (Flight, Speed, Swimming, Leaping, Teleport, Movement, Burrowing) + 1 sample (Super-Speed)
- **Sensory** (7): 6 core (Senses, Communication, Comprehend, Concealment, Mind Reading, Remote Sensing) + 1 sample (Invisibility)

### Common Descriptors (Thematic Filtering)

Use `powersByDescriptor()` or `descriptorGroups` to find powers by theme:
- **fire**, **cold**, **electricity**, **water**, **earth**, **air** (elemental)
- **energy**, **radiation**, **light**, **force** (energy types)
- **mental**, **psychic**, **telepathy** (mental/psionic)
- **magic**, **cosmic**, **divine** (supernatural)
- **technology**, **scientific** (tech-based)
- **biological**, **physical** (physical/natural)
- **reality**, **temporal**, **dimensional** (reality manipulation)

## Data Quality Standards

All 61 powers follow these standards:

- **Source**: "Hero's Handbook" (official M&M 3e rulebook)
- **SRD Verified**: All stats (action, range, duration, baseCost) verified against d20herosrd.com
- **Mechanics**: Detailed effect descriptions with DC calculations and rank progressions
- **Cost Accuracy**: Verified base costs directly from d20herosrd.com
- **Descriptors**: Comprehensive descriptor arrays for thematic customization
- **Durations**: Accurate action types and duration values
- **Unique IDs**: 100% unique - no duplicates (verified via `powerById`)
- **Single Source**: Each power exists in exactly ONE file

## Adding New Powers

When adding a new power:

1. **Determine type**: Which mechanical category? (attack, defense, movement, sensory, general, control)
2. **Choose file**: Add to appropriate type file in `core/`
   - Example: Fire blast → `attack.ts` (with descriptors: `['fire', 'energy']`)
   - Example: Cosmic awareness → `sensory.ts` (with descriptors: `['cosmic', 'awareness']`)
3. **Follow standards**:
   - Use `source: "Hero's Handbook"`
   - Include detailed `effects` array with mechanics
   - Verify `baseCost` against M&M rules
   - Ensure unique `id` (kebab-case)
   - Add appropriate `descriptors` for thematic filtering
4. **Test**: Run `npm run build` to verify TypeScript compilation
5. **Validate**: Check for duplicate IDs:
   ```bash
   grep -rh '^\s*id:' src/data/mutants-and-masterminds/3e/powers/core/*.ts | sort | uniq -d
   # Should return nothing
   ```

## Architecture History

**January 28, 2026**: Reorganized from hybrid (core + thematic) to single-source architecture
- Removed duplicate power definitions (12 duplicates eliminated)
- Consolidated 20 files → 6 type-based files
- Matches D&D/Pathfinder organizational pattern
- Descriptor-based filtering replaces thematic files

**February 10, 2026**: SRD-only verification
- Verified all entries against d20herosrd.com
- Removed ~139 fabricated/non-SRD entries
- Scaled from 200 to 61 SRD-verified powers (quality over quantity)
- All stats (action, range, duration, baseCost) verified via curl from SRD
- **Result**: 61 SRD-verified powers with 100% accuracy

## Technical Details

### Power Type Definition

```typescript
interface Power {
  id: string;
  name: string;
  system: 'mam3e';
  source: string;
  type: 'attack' | 'defense' | 'movement' | 'sensory' | 'general' | 'control';
  action: 'standard' | 'move' | 'free' | 'reaction' | 'none';
  range: 'personal' | 'close' | 'ranged' | 'perception';
  duration: 'instant' | 'concentration' | 'sustained' | 'continuous' | 'permanent';
  baseCost: number;
  perRank: boolean;
  descriptors: string[];
  description: string;
  effects: string[];
  extras?: string[];
  flaws?: string[];
}
```

### Deduplication Strategy

During migration, duplicate powers between core and thematic were resolved by:

1. **Core takes precedence** - More detailed, accurate data
2. **Remove thematic duplicates** - Eliminated 7 duplicates (growth, shrinking, immortality, insubstantial, morph, quickness, mind-reading)
3. **Unique powers preserved** - Thematic powers not in core were kept and upgraded

## References

- [Mutants & Masterminds 3e SRD](https://www.d20herosrd.com/)
- Hero's Handbook (official rulebook)
- [M&M 3e Community Resources](https://greenronin.com/mutants-masterminds/)
