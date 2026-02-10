# Mutants & Masterminds 3e Conditions

**Last Updated**: January 26, 2026 (audit refresh)

## Overview

This directory contains all conditions from the M&M 3e SRD. Conditions represent temporary states that affect a character's capabilities during gameplay.

## Structure

```typescript
conditions/
└── index.ts               # All 26 conditions (16 basic + 10 combined)
```

## Condition Types

### Basic Conditions (16)

Basic conditions are single game modifiers that represent a specific state:

- **Compelled** - Directed by outside force while struggling
- **Controlled** - No free will, actions dictated by controller
- **Dazed** - Limited to free actions and one standard action
- **Debilitated** - Ability lowered below –5
- **Defenseless** - Active defense bonuses reduced to 0
- **Disabled** - –5 circumstance penalty on checks
- **Fatigued** - Hindered (moves at half speed)
- **Hindered** - Movement speed reduced by –1 rank
- **Immobile** - No movement speed, cannot move
- **Impaired** - –2 circumstance penalty on checks
- **Normal** - Unharmed and unaffected
- **Stunned** - Cannot take any actions
- **Transformed** - Traits altered by outside agency
- **Unaware** - Completely unaware of surroundings
- **Vulnerable** - Susceptible to additional damage
- **Weakened** - One or more traits reduced in rank

### Combined Conditions (10)

Combined conditions are composed of multiple basic conditions:

- **Asleep** - Defenseless + Stunned + Unaware
- **Bound** - Defenseless + Immobile + Impaired
- **Dying** - Incapacitated + near death
- **Entranced** - Stunned, paying attention only to entrancing effect
- **Exhausted** - Impaired + Hindered
- **Incapacitated** - Defenseless + Stunned + Unaware
- **Paralyzed** - Defenseless + Immobile + physically stunned
- **Prone** - Lying on ground with penalties
- **Restrained** - Hindered + Vulnerable
- **Staggered** - Dazed + Hindered

## Usage

### Import All Conditions

```typescript
import { allConditions } from './conditions';

console.log(allConditions.length); // 26 conditions
```

### Import Specific Conditions

```typescript
import { stunned, dazed, incapacitated } from './conditions';

// Check condition effects
console.log(stunned.effects); // ["Cannot take any actions", ...]
```

### Import by Category

```typescript
import { basicConditions, combinedConditions } from './conditions';

console.log(basicConditions.length); // 16
console.log(combinedConditions.length); // 10
```

### Use Condition Lookups

```typescript
import { conditionsById, conditionsByCategory } from './conditions';

// Lookup by ID
const stunnedCondition = conditionsById['stunned'];

// Get all basic conditions
const basics = conditionsByCategory['basic'];

// Get all combined conditions
const combined = conditionsByCategory['combined'];
```

## Condition Interface

```typescript
interface Condition {
  id: string;              // Unique identifier (kebab-case)
  name: string;            // Display name
  system: 'mam3e';         // System identifier
  source: string;          // "Hero's Handbook"
  category: 'basic' | 'combined';
  description: string;     // What the condition represents
  effects: string[];       // Mechanical effects (penalties, restrictions, etc.)
  supersededBy?: string[]; // IDs of conditions that supersede this one
}
```

## Superseding Conditions

Some conditions supersede (replace) others:

- **Stunned** supersedes Dazed
- **Controlled** supersedes Compelled
- **Immobile** supersedes Hindered
- **Disabled** supersedes Impaired
- **Debilitated** supersedes Disabled (and Impaired)
- **Exhausted** supersedes Fatigued

When a character gains a superseding condition, the superseded condition is ignored.

## Data Quality

All conditions in this file:

- ✅ Match official M&M 3e SRD at d20herosrd.com
- ✅ Include complete mechanical effects
- ✅ Reference "Hero's Handbook" as source
- ✅ Have unique IDs
- ✅ Include superseding relationships where applicable

## Game Usage

Conditions are applied during gameplay when:

- Characters take damage (Dazed, Staggered, Incapacitated)
- Powers affect them (Affliction, Weaken, etc.)
- Environmental effects occur (Fatigued, Exhausted)
- Status effects are imposed (Stunned, Paralyzed, Bound)

### Recovery

Recovery varies by condition:

- **Damage Conditions**: Recover with rest or healing
- **Fatigued**: One hour of rest
- **Exhausted**: One hour rest → Fatigued, another hour → Normal
- **Effect-Based**: Duration based on power/effect imposing condition

## Adding New Conditions

To add homebrew or supplement conditions:

1. Add to appropriate category in `conditions/index.ts`
2. Follow the `Condition` interface structure
3. Include `supersededBy` if applicable
4. Update aggregation arrays
5. Document source as supplement name
6. Run validation: `npm run validate`

## Examples

### Checking if Character is Defenseless

```typescript
import { conditionsById } from './conditions';

const activeConditions = ['prone', 'dazed'];

// Check if any condition makes character defenseless
const isDefenseless = activeConditions.some(condId => {
  const cond = conditionsById[condId];
  return cond.effects.some(effect => 
    effect.toLowerCase().includes('defenseless')
  );
});
```

### Applying Condition Superseding

```typescript
function applyCondition(currentConditions: string[], newCondition: string) {
  const cond = conditionsById[newCondition];
  
  // Remove any conditions this one supersedes
  if (cond.supersededBy) {
    // If a superseding condition exists, don't apply this one
    const hasSuperseding = currentConditions.some(c => 
      cond.supersededBy?.includes(c)
    );
    if (hasSuperseding) return currentConditions;
  }
  
  return [...currentConditions, newCondition];
}
```

## References

- [M&M 3e SRD - Conditions](https://www.d20herosrd.com/9-gamemastering/conditions/)
- Hero's Handbook, Chapter 9: Gamemastering
- [M&M 3e Community Forums](https://greenronin.com/mutants-masterminds/)

---

**Total Conditions**: 26 (16 basic + 10 combined)  
**Source**: Hero's Handbook  
**SRD Compliance**: 100%
