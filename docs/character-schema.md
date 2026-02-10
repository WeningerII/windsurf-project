# Character Data Schema

**Last Updated**: February 7, 2026

This document describes the canonical `Character` data model used throughout the application. All character data—whether in memory, in localStorage, or in export files—conforms to this schema.

---

## Source of Truth

The authoritative TypeScript definition lives in:

```
src/types/core/character.ts    — Character interface + supporting types
src/types/game-systems.ts      — GameSystemId union + re-exports
```

---

## Character Interface

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID v4 (generated via `generateUUID()` from `src/utils/browserCompat.ts`) |
| `name` | `string` | ✅ | Character display name |
| `system` | `GameSystemId` | ✅ | Game system identifier |
| `level` | `number` | ✅ | Total character level (1-20) |
| `experiencePoints` | `number` | ✅ | Current XP total |
| `speciesId` | `string` | — | Species / race / ancestry ID |
| `classLevels` | `ClassLevel[]` | ✅ | Class progression (supports multiclassing) |
| `backgroundId` | `string` | — | Background ID |
| `alignmentId` | `string` | — | Alignment ID |
| `baseAttributes` | `Record<string, number>` | ✅ | Ability scores keyed by abbreviation (e.g. `"STR"`, `"DEX"`) |
| `skillProficiencies` | `Record<string, SkillProficiency>` | ✅ | Proficiency level + source per skill |
| `skillRanks` | `Record<string, number>` | — | Skill ranks (D&D 3.5e, PF1e only) |
| `hitPoints` | `HitPoints` | ✅ | `{ current, max, temp }` |
| `hitDice` | `HitDice[]` | ✅ | `{ die, total, remaining }` per die type |
| `armorClass` | `number` | ✅ | AC value |
| `initiative` | `number` | ✅ | Initiative bonus |
| `speed` | `number` | ✅ | Movement speed in feet |
| `armorProficiencies` | `string[]` | ✅ | Armor proficiency IDs |
| `weaponProficiencies` | `string[]` | ✅ | Weapon proficiency IDs |
| `toolProficiencies` | `string[]` | ✅ | Tool proficiency IDs |
| `languageProficiencies` | `string[]` | ✅ | Language IDs |
| `savingThrowProficiencies` | `string[]` | ✅ | Proficient saving throw abilities |
| `features` | `Feature[]` | ✅ | Class/race/background features |
| `feats` | `Feat[]` | ✅ | Selected feats |
| `spellcasting` | `SpellcastingInfo` | — | Spellcasting data (if applicable) |
| `equipment` | `EquippedItem[]` | ✅ | Currently equipped items |
| `inventory` | `InventoryItem[]` | ✅ | Carried (unequipped) items |
| `currency` | `Currency` | ✅ | `{ copper, silver, electrum, gold, platinum }` |
| `personality` | `PersonalityInfo` | — | Traits, ideals, bonds, flaws, appearance, backstory |
| `notes` | `string` | — | Free-form notes |
| `createdAt` | `Date` | ✅ | Creation timestamp |
| `updatedAt` | `Date` | ✅ | Last-modified timestamp |

---

## GameSystemId

```typescript
type GameSystemId = 'dnd-5e-2014' | 'dnd-5e-2024' | 'dnd-3.5e' | 'pf1e' | 'pf2e' | 'mam3e';
```

| Value | System |
|-------|--------|
| `dnd-5e-2014` | D&D 5th Edition (SRD 5.1) |
| `dnd-5e-2024` | D&D 5th Edition (SRD 5.2) |
| `dnd-3.5e` | D&D 3.5 Edition (SRD 3.5) |
| `pf1e` | Pathfinder 1st Edition |
| `pf2e` | Pathfinder 2nd Edition |
| `mam3e` | Mutants & Masterminds 3rd Edition |

---

## Supporting Types

### ClassLevel

```typescript
interface ClassLevel {
  classId: string;       // e.g. "fighter", "wizard"
  subclassId?: string;   // e.g. "champion", "school-of-evocation"
  level: number;         // Levels in this class
  hitDieRolls: number[]; // Actual HP rolls per level
}
```

### SkillProficiency

```typescript
type ProficiencyLevel = 'none' | 'half' | 'proficient' | 'expertise' | 'double';

interface SkillProficiency {
  level: ProficiencyLevel;
  source: string[];  // Where proficiency was granted
}
```

### HitPoints / HitDice

```typescript
interface HitPoints { current: number; max: number; temp: number; }
interface HitDice   { die: string; total: number; remaining: number; }
```

### SpellcastingInfo

```typescript
interface SpellcastingInfo {
  classes: SpellcastingClass[];   // { classId, ability, spellcastingLevel }
  spellsKnown: string[];         // Spell IDs
  spellsPrepared: string[];      // Prepared spell IDs
  spellSlots: SpellSlots;        // Levels 1-9, each { max, used }
}
```

### Equipment

```typescript
interface EquippedItem {
  itemId: string;
  slot: EquipmentSlot;   // 'head' | 'neck' | 'chest' | 'back' | 'mainHand' | 'offHand' | 'hands' | 'ring1' | 'ring2' | 'waist' | 'feet'
  attuned: boolean;
  customName?: string;
}

interface InventoryItem {
  itemId: string;
  quantity: number;
  customName?: string;
  notes?: string;
}
```

### Currency

```typescript
interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}
```

### PersonalityInfo

```typescript
interface PersonalityInfo {
  traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  appearance?: string;
  backstory?: string;
}
```

---

## Validation

Characters are validated via `validateCharacter()` in `src/utils/validation.ts` before every save. The validator enforces:

- Non-empty `id` and `name`
- Valid `system` value
- `level` between 1 and 20
- Consistent `classLevels` (sum of levels ≤ total level)
- Required array fields are arrays (even if empty)

Run the full data validation suite:

```bash
npm run validate
```
