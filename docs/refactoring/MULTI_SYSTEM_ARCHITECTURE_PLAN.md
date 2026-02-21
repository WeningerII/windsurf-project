# Technical Plan: Multi-System Architecture Refactor

## 1. Executive Summary
This document outlines a comprehensive architectural refactor for the Windsurf Project. The current codebase mimics multi-system support by forcing non-D&D systems (like Mutants & Masterminds 3e) into D&D 5e-specific data structures. This "Union Model" approach has reached its limit, causing data loss, type unsafety, and significant technical debt.

We propose migrating to a **Document & Data Model** architecture (inspired by Foundry VTT). This approach decouples the core application logic from system-specific mechanics, allowing systems like Pathfinder 2e, Daggerheart, and Draw Steel to coexist without monolithic type unions.

---

## 2. Current State & Technical Debt

### 2.1 The "Union Model" Problem
Currently, the `Character` interface (`src/types/core/character.ts`) attempts to be the superset of all possible RPG systems.

```typescript
// Current Monolithic Interface
export interface Character {
  // Common fields
  name: string;
  level: number;
  
  // D&D Specifics (Hardcoded)
  classLevels: ClassLevel[]; // Assumes all systems use "Classes"
  spellSlots: SpellSlots;    // Assumes all systems use "Slots"
  
  // The "Leak"
  system: 'dnd-5e-2014' | 'mam3e' | ...; 
}
```

### 2.2 Critical Hotspots
1.  **Type Coercion in Data Loading**:
    *   *File*: `src/utils/dataLoader.ts`
    *   *Issue*: M&M 3e Powers are cast as `Spell` objects (`as unknown as Spell`) to fit into the `Character` type. This causes data loss (e.g., M&M specific fields like `baseCost` are lost or untyped).
2.  **Hardcoded Mechanics**:
    *   *File*: `src/engine/mechanics/combat-calculator.ts`
    *   *Issue*: `getHitDieForClass` hardcodes specific D&D class names (`barbarian` -> `d12`). Systems without these exact class IDs fail or require monkey-patching.
3.  **UI Coupling**:
    *   *File*: `src/components/CharacterSheet.tsx`
    *   *Issue*: Explicit logic checks like `if (character.system !== 'mam3e')` determine whether to render Spell Slots. This is unmaintainable as we add more systems.

---

## 3. Proposed Architecture: Document & Data Model

We will move from a **Monolithic Type** to a **Generic Container** pattern.

### 3.1 The Generic Container (`CharacterDocument`)
The core application only knows about the "Document," which handles metadata common to *all* systems.

```typescript
// src/types/core/document.ts

export interface CharacterDocument<T extends SystemDataModel = SystemDataModel> {
  // Universal Metadata
  id: string;
  name: string;
  img: string;
  prototypeToken: TokenData;
  
  // The System Discriminator
  systemId: string;
  
  // The Black Box (System Specific Data)
  system: T; 
}
```

### 3.2 The System Data Models
Each game system defines its own completely independent data structure. They do *not* need to share fields.

#### D&D 5e Model
```typescript
interface Dnd5eDataModel extends SystemDataModel {
  attributes: {
    str: { value: 16, save: 5 };
    dex: { value: 14, save: 2 };
  };
  details: {
    level: 5;
    xp: { value: 6500, max: 14000 };
  };
  spells: {
    slots: { 1: { value: 4, max: 4 } };
  };
}
```

#### M&M 3e Model
```typescript
interface Mam3eDataModel extends SystemDataModel {
  powerLevel: 10;
  powerPoints: {
    total: 150;
    spent: 148;
  };
  abilities: {
    str: 10; // Direct rank, not "score"
    sta: 12;
  };
  // No "spells" or "slots" here!
}
```

### 3.3 The System Registry
A central registry maps `systemId` to the correct Logic Engine and UI Components. This allows the Core App to render the correct sheet without knowing the details.

```typescript
// src/registry/SystemRegistry.ts

interface SystemDefinition<T extends SystemDataModel> {
  id: string;
  label: string;
  dataModel: new () => T;
  engine: SystemEngine<T>;
  sheet: React.ComponentType<{ document: CharacterDocument<T> }>;
}

export const SYSTEMS: Record<string, SystemDefinition<any>> = {
  'dnd-5e-2024': Dnd5eSystemDef,
  'pf2e': Pf2eSystemDef,
  'mam3e': Mam3eSystemDef,
};
```

---

## 4. The Logic Layer: Rules Engine

Instead of hardcoded `calculateAC` functions, we define a **SystemEngine** interface.

```typescript
interface SystemEngine<T extends SystemDataModel> {
  // Lifecycle Hooks
  prepareData(data: T): void; // Calculate derived stats (AC, Mods)
  
  // Mechanics
  rollCheck(data: T, checkId: string): RollResult;
  applyDamage(data: T, amount: number, type: string): void;
}
```

*   **D&D 5e Engine**: Implements `(Score - 10) / 2` for modifiers.
*   **M&M 3e Engine**: Implements direct Rank comparisons.
*   **Daggerheart Engine**: Implements Duality Dice logic.

---

## 5. Migration Strategy

This is a major refactor. We will execute it in **Phases** to maintain stability.

### Phase 1: The Scaffolding (Safe)
1.  Create the `CharacterDocument` interface and `SystemRegistry`.
2.  Move current `Character` type into `LegacyCharacter`.
3.  Create a "Legacy Adapter" system that wraps the current logic so existing characters still load.

### Phase 2: The Pilot (M&M 3e)
1.  Define `Mam3eDataModel` (with proper `powers` array, no spells).
2.  Implement `Mam3eEngine` (Power Point calculations).
3.  Create `Mam3eCharacterSheet` (using the new architecture).
4.  Migrate M&M data loading to use this new path.
    *   *Result*: M&M 3e is fully decoupled. D&D 5e remains on Legacy.

### Phase 3: The Core Migration (D&D 5e & PF2e)
1.  Define `Dnd5eDataModel`.
2.  Port `combat-calculator.ts` logic into `Dnd5eEngine`.
3.  Switch D&D characters to the new Document structure.

### Phase 4: Cleanup
1.  Delete `LegacyCharacter`.
2.  Remove `as unknown as Spell` casts.
3.  Remove `if (system === ...)` checks from UI.

---

## 6. Risk Assessment

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Data Migration** | High | Existing localStorage data will break. We must write a migration script that converts old `Character` JSON to new `CharacterDocument` JSON on load. |
| **Component Duplication** | Medium | We might end up with two "Character Sheets" for a while. We should extract shared UI widgets (like `AttributeBox`) to a common library. |
| **Complexity** | Medium | The "Registry" pattern is more abstract than simple imports. Documentation is key. |

## 7. Why Not ECS (Entity Component System)?
ECS is powerful but introduces unnecessary complexity for a React-based Character Sheet.
*   **Reason 1**: We don't have 10,000 entities updating per frame (the primary use case for ECS).
*   **Reason 2**: Querying systems in React ("Find all entities with HealthComponent") is cumbersome compared to direct prop access (`props.system.health`).
*   **Reason 3**: The "Document" model maps 1:1 with JSON storage, making it ideal for web persistence.

---

## 8. Conclusion
This architecture allows Windsurf to support **any** RPG system without polluting the core code. It aligns with industry standards (Foundry VTT) and solves the immediate M&M 3e data integrity issues while paving the way for future systems like Daggerheart.
