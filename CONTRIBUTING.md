# Contributing Guidelines

**Last Updated**: April 21, 2026

This document outlines engineering principles and practices for maintaining code quality. Follow these guidelines to keep the codebase clean, maintainable, and comprehensible.

## Table of Contents

- [Core Principles](#core-principles)
- [Engineering Philosophy](#engineering-philosophy)
- [Environment Requirements](#environment-requirements)
- [File Organization Rules](#file-organization-rules)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Architecture & Design](#architecture--design)
- [Performance & Optimization](#performance--optimization)
- [UX Design Principles](#ux-design-principles)
- [Code Standards](#code-standards)
- [SRD Compliance](#srd-compliance)
- [Testing](#testing)
- [Code Review Philosophy](#code-review-philosophy)

---

## Environment Requirements

- Node.js 20.19+ (or 22.12+ / 24+). The test stack depends on this runtime.
- `.nvmrc` and `.node-version` both pin `20.19.0`.
- Manager path: use your preferred version manager to match the repo pin, then run normal `npm install` / `npm run verify` flows.
- Bootstrap path: on host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>` if no version manager is available.
- Manual fallback: if the host shell is below Node 18 or has no usable Node install, install Node `20.19.0` directly or fix the version manager before working in the repo.
- `npm run test:coverage` is stricter than plain `npm test`: `@vitest/coverage-v8` requires `node:inspector/promises`, so Node 18 shells fail before any tests execute.
- Current baseline: run `npm run verify` under Node `20.19+` and capture exact counts from the command output.
- Latest recorded full pass: May 1, 2026 under Node `v20.19.0`. Treat the exact Vitest and Playwright totals as command output, not a hardcoded invariant in this file.
- Update `docs/generated/verification-baseline.json` via `npm run record:verify-baseline -- --date "Month DD, YYYY" --node-version 20.19.0 [...]`; `npm run check:doc-drift` enforces the mirrored live-doc verification claims.
- `npm run runtime:doctor` is the first stop when local Node policy, cached bootstrap runtime, or CI/runtime drift looks suspicious.
- `docs/MASTER_PLAN.md` is the sole planning authority. If a roadmap statement in another doc drifts, update that doc to point back to the master plan instead of creating a competing backlog.
- When you make a previously repo-only content family product-reachable, wire it through a loader first and rerun `npm run roadmap:metrics` so `docs/generated/roadmap-metrics.*` stays aligned with runtime reality.
- Spell datasets now use normalized `spells/index.ts` catalog surfaces plus `spellIdAliases`. When canonicalizing spell ids or collapsing duplicates, preserve alias compatibility, rerun the spell parity suites, and regenerate roadmap metrics if the canonical counts change.
- Legacy d20 spell metadata is source-strict. If a D&D 3.5e source URL cannot be resolved or a PF1e source page lacks a Saving Throw row, document the exact exception in `spellCatalogParity.test.ts`; do not infer metadata to satisfy a coverage floor.
- `npm run verify` now includes `check:doc-drift` after `check:generated-docs`; keep live docs, historical banners, workflow/runtime claims, and audited support-honesty copy aligned with the registered truth sources.

## Core Principles


### Single Source of Truth
**Every piece of data should exist in exactly one place.**

❌ **DON'T:**
- Create `foo.ts` and `foo-expanded.ts`
- Create `comprehensive-spells.ts` and `comprehensive-level4-expanded.ts`
- Have multiple files with overlapping content

✅ **DO:**
- Merge related content into one canonical file
- Name files descriptively: `level-4-spells.ts`, not `comprehensive-level4-expanded.ts`
- If you need to split files, split by clear responsibility, not by "base" vs "expanded"

### Clarity Over Cleverness

**Code should be obvious. If you need comments to explain the structure, restructure.**

- File names should describe their complete contents
- Directory structure should mirror logical relationships
- Avoid abstractions until you have 3+ concrete examples

### Delete Before Adding

**Before creating a new file, check if existing files can be consolidated or renamed.**

- Search for similar files first: `find . -name "*similar-name*"`
- Consider whether you're creating technical debt
- Prefer editing existing files over creating "extended" versions

### Measure Twice, Cut Once
**Think deeply before implementing. The best code is code you don't write.**

- Understand the problem completely before writing solutions
- Consider edge cases before writing the happy path
- Design for deletion: make code easy to remove when requirements change
- Every line of code is a liability; every feature is an opportunity cost

---

## Engineering Philosophy

### Constraints Breed Creativity
This project has strict constraints (SRD-only, type-safe, local-first; optional Supabase sync; no server-side content/rules hosting). These aren't limitations—they're guardrails that force better design.

**Examples:**
- Local-first → Design data structures that are efficient to load and search client-side; cloud sync is additive, never required
- Type-safe → Catch errors at compile time, not runtime
- SRD-only → Build a solid foundation before considering extensions
- No server-side content/rules hosting → All SRD data and rule logic ships in the client bundle

### Optimize for Reading, Not Writing

Code is read 10x more than it's written. Optimize for the reader.

```typescript
// Bad: Clever, compact, hard to understand
const s = spells.filter(s => s.l === 4 && s.c.includes('w'));

// Good: Verbose, obvious, easy to scan
const level4WizardSpells = spells.filter(spell => 
  spell.level === 4 && 
  spell.classes.includes('wizard')
);
```

### Data Structures > Algorithms

Choose the right data structure and the algorithms become trivial.

```typescript
// Bad: O(n) lookup on every render
const spell = spells.find(s => s.id === spellId);

// Good: O(1) lookup
const spellsById = new Map(spells.map(s => [s.id, s]));
const spell = spellsById.get(spellId);
```

### State is the Root of All Evil

Minimize mutable state. Derive what you can, cache what you must.

```typescript
// Bad: Syncing state
const [level, setLevel] = useState(1);
const [xp, setXp] = useState(0);
const [proficiencyBonus, setProficiencyBonus] = useState(2);

// Good: Derive from source of truth
const [xp, setXp] = useState(0);
const level = calculateLevelFromXP(xp);
const proficiencyBonus = Math.floor((level - 1) / 4) + 2;
```

### Performance is a Feature

Slow software is broken software. Users notice every 100ms.

**Key metrics:**
- Initial load: <2s on 3G
- Time to interactive: <3s
- Spell search: <50ms for 500 spells
- Character sheet render: <16ms (60fps)

---

## File Organization Rules


### Directory Structure
```
src/data/[system]/[category]/
  ├── level-1-spells.ts       # NOT comprehensive-spells.ts + comprehensive-expanded.ts
  ├── level-2-spells.ts       # NOT spells.ts + spells-extended.ts
  └── magic-weapons.ts        # NOT weapons.ts + weapons-expanded.ts
```

### Naming Conventions

**Files:**
- Be specific: `fire-spells.ts` > `spells-1.ts`
- Be complete: `level-3-spells.ts` > `comprehensive-spells.ts`
- Avoid suffixes: `magic-armor.ts` > `magic-armor-expanded.ts`

**Exports:**
- Use clear names: `export const level3Spells: Spell[]`
- Group logically: All level 3 spells in one file, one export
- No duplicate exports: Don't export same data from multiple files

### When to Split Files

**Good reasons:**
- File exceeds 1000 lines
- Clear logical separation (e.g., `necromancy-spells.ts` vs `evocation-spells.ts`)
- Different import patterns (e.g., rarely used vs frequently used)

**Bad reasons:**
- "Adding more content to existing file" ← This is what files are for
- "Don't want to modify existing file" ← Version control exists for this
- "Keeping it organized" ← One file is more organized than two

---

## Anti-Patterns to Avoid

### ❌ File Duplication Pattern

```
level-4/
  ├── comprehensive-spells.ts       # 20 spells
  └── comprehensive-expanded.ts     # 40 more spells ← DELETE THIS PATTERN
```

**Why it's bad:**
- Which file is canonical?
- Where do new spells go?
- Creates merge conflicts
- Confusing for new contributors

**Fix:** Merge into `level-4-spells.ts` with all 60 spells.

### ❌ Generic Naming

```typescript
// Bad
export const data = [...];  // What data?
export const items = [...]; // What items?

// Good
export const level4Spells: Spell[] = [...];
export const magicWeapons: Item[] = [...];
```

### ❌ Premature Abstraction

```typescript
// Don't do this until you have 3+ similar patterns
class SpellFactory {
  createSpell(config: SpellConfig): Spell {
    // Complex abstraction for simple data
  }
}

// Just use objects
export const fireball: Spell = { ... };
```

### ❌ Incomplete Consolidation

```
equipment/
  ├── weapons.ts
  ├── weapons-expanded.ts     # Partial consolidation
  ├── magic-weapons.ts        # Created new file instead of
  └── magic-weapons-expanded.ts  # consolidating existing ones
```

### ❌ Configuration Over Composition

```typescript
// Bad: Configuration hell
<CharacterSheet 
  theme="dark" 
  layout="compact" 
  showSpells={true}
  showEquipment={true}
  showFeatures={true}
  spellSortOrder="level"
  equipmentGroupBy="type"
  />

// Good: Composable pieces
<CharacterSheet>
  <SpellList sortBy="level" />
  <EquipmentList groupBy="type" />
  <FeaturesList />
</CharacterSheet>
```

### ❌ Prop Drilling

```typescript
// Bad: Passing props through 5 levels
<App spellFilter={filter}>
  <Layout spellFilter={filter}>
    <Sidebar spellFilter={filter}>
      <SpellList filter={filter} />

// Good: Context or state management
const filter = useSpellFilter();
```

---

## Architecture & Design

### Separation of Concerns

**Data → Logic → Presentation**

```
src/
├── data/              # Pure data, no logic
│   └── dnd/5e/spells/
├── hooks/             # Business logic, no UI
│   └── useSpells.ts
├── components/        # Presentation, minimal logic
│   └── SpellCard.tsx
└── types/             # Contracts between layers
    └── magic/spells.ts
```

### Component Design

**Small, focused, composable.**

```typescript
// Bad: God component
function CharacterSheet({ character }) {
  // 500 lines of rendering, logic, state management
}

// Good: Composed from focused components
function CharacterSheet({ character }) {
  return (
    <>
      <CharacterHeader character={character} />
      <AbilityScores scores={character.abilityScores} />
      <SkillsList skills={character.skills} />
      <SpellsList spells={character.spells} />
    </>
  );
}
```

### UI Flow Integration

Keep the main user flow consistent with the current app composition:

- **App.tsx** creates V2 `CharacterDocument` objects directly and opens the system-specific sheet.
- **SystemSheetRenderer** dispatches to native sheet components per system via the `SystemRegistry`.
- **Home screen** provides export/import/clear controls directly in App.

When generating new IDs in UI flows, use `generateUUID` from `src/utils/browserCompat.ts`.

### Type Design

**Types should make illegal states unrepresentable.**

```typescript
// Bad: Can represent invalid state
interface Spell {
  name: string;
  level: number;  // Could be -1 or 100
  components: {
    verbal?: boolean;
    somatic?: boolean;
    material?: boolean;
    materialDescription?: string;  // What if material is false but this exists?
  };
}

// Good: Invalid states impossible
interface Spell {
  name: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  components: 
    | { verbal: true; somatic: boolean; material: false }
    | { verbal: true; somatic: boolean; material: true; materialDescription: string }
    | { verbal: boolean; somatic: true; material: false }
    // ... all valid combinations
}
```

### Architecture Decisions

**Document the "why" behind non-obvious choices.**

```typescript
// Bad: No context
const SPELL_CACHE_SIZE = 100;

// Good: Explains trade-off
/**
 * Cache the 100 most recently accessed spells.
 * 
 * Why 100?
 * - Average session uses ~30 unique spells (measured)
 * - 100 spells ≈ 50KB memory (acceptable on mobile)
 * - 3.3x headroom for power users
 * - LRU eviction handles edge cases
 * 
 * Tested: 100 gives 95% hit rate, 200 gives 96% (diminishing returns)
 */
const SPELL_CACHE_SIZE = 100;
```

---

## Performance & Optimization

### Measurement First

**Profile before optimizing. Intuition is often wrong.**

```typescript
// Always measure
console.time('spell-filter');
const filtered = filterSpells(spells, criteria);
console.timeEnd('spell-filter');

// Use React DevTools Profiler
// Use Chrome Performance tab
// Use Lighthouse
```

### React Performance Patterns

**1. Memoization (but not everywhere)**

```typescript
// Good: Expensive computation
const sortedSpells = useMemo(() => 
  spells.sort((a, b) => a.name.localeCompare(b.name)),
  [spells]
);

// Bad: Premature optimization
const title = useMemo(() => `${spell.name} (Level ${spell.level})`, [spell]);
```

**2. Code splitting**

```typescript
// Load heavy components on demand
const CharacterBuilder = lazy(() => import('./CharacterBuilder'));
const SpellbookEditor = lazy(() => import('./SpellbookEditor'));
```

**3. Virtualization for long lists**

```typescript
// Don't render 500 spells at once
import { VirtualList } from 'react-virtual';

<VirtualList items={spells} height={600} itemHeight={80}>
  {(spell) => <SpellCard spell={spell} />}
</VirtualList>
```

### Bundle Size

**Every KB counts on mobile.**

```bash
# Analyze bundle
npm run build -- --analyze

# Enforced CI budgets (see scripts/check-bundle-size.mjs for the source of truth):
# - App chunk: <80KB gzipped
# - Vendor chunk: <200KB gzipped
# - Largest system-data chunk: <140KB gzipped
# - Total JS: <800KB gzipped
#
# Stretch target:
# - Per-system data: <100KB gzipped
```

**Lazy load game system data:**

```typescript
// Don't load all systems at once
const dnd5eSpells = await import('./data/dnd/5e-2014/spells');
const pf2eSpells = await import('./data/pathfinder/2e/spells');
```

### Data Loading Strategy

**1. Critical: Load immediately**
- Character data
- Core UI components
- Basic game rules

**2. Important: Load on interaction**
- Spell lists (when opening spellbook)
- Equipment (when opening inventory)
- Class features (when leveling up)

**3. Optional: Load on demand**
- Monster stats (if DM tools added)
- Obscure game system variants

---

## UX Design Principles

### Design for the Table

**This is a tool used during gameplay. Speed and clarity trump everything.**

**User Context:**
- Playing at a table with friends
- Need information in <5 seconds
- Often on mobile in poor lighting
- Switching between apps frequently
- Interrupted constantly by gameplay

### Information Hierarchy

**Most important info should be instantly visible.**

```
Character Sheet Priority:
1. HP / Temp HP (life or death)
2. AC / Saves (every turn)
3. Attack rolls / Spell DC (every turn)
4. Current resources (spell slots, abilities)
5. Skills (frequent checks)
6. Equipment (situational)
7. Background/story (rare reference)
```

### Interaction Patterns

**One-hand usable:**
- Large touch targets (44×44px minimum)
- Bottom navigation on mobile
- Swipe gestures for common actions

**Keyboard shortcuts for power users:**

```
R - Roll dice
S - Search spells
I - Inventory
C - Cast spell
L - Long rest
```

**Error prevention:**

```typescript
// Bad: Easy to accidentally delete character
<button onClick={deleteCharacter}>Delete</button>

// Good: Confirmation + undo
<button onClick={() => setShowConfirm(true)}>Delete</button>
{showConfirm && (
  <ConfirmDialog 
    onConfirm={deleteCharacter}
    message="Delete character? This can be undone for 30 seconds."
  />
)}
```

### Visual Design

**Typography:**
- 16px minimum on mobile (no exceptions)
- 1.5 line height for readability
- System fonts (fast, familiar)

**Color:**
- AA contrast minimum (4.5:1)
- Color never the only indicator (use icons + text)
- Dark mode support (table lighting varies)

**Layout:**
- Responsive, not adaptive (fluid across devices)
- 8px grid system (consistent spacing)
- Max 60-80 characters per line (readability)

### Accessibility

**Not an afterthought. Built in from the start.**

```typescript
// Every interactive element
<button 
  onClick={castSpell}
  aria-label="Cast Fireball"
  aria-describedby="spell-description"
>
  <FireIcon aria-hidden="true" />
  <span>Fireball</span>
</button>

// Keyboard navigation
<div role="tablist">
  <button role="tab" aria-selected={isActive} tabIndex={isActive ? 0 : -1}>
```

**Target screen-reader test matrix** (manual; no dated evidence artifact or automated gate yet — see `docs/PRODUCTION_PLAN.md` §6.3):
- VoiceOver (macOS/iOS)
- NVDA (Windows)
- TalkBack (Android)

### Performance Perception

**Make it feel fast even when it's not.**

```typescript
// Optimistic updates
function addSpell(spell: Spell) {
  // Update UI immediately
  setSpells(prev => [...prev, spell]);
  
  // Persist in background
  saveToStorage(spell).catch(() => {
    // Rollback on failure
    setSpells(prev => prev.filter(s => s.id !== spell.id));
    showError('Failed to add spell');
  });
}

// Skeleton screens
function SpellList() {
  if (loading) return <SpellListSkeleton />;
  return <div>{spells.map(...)}</div>;
}
```

---

## Code Standards


### TypeScript

- Enable `strict` mode - no exceptions
- Avoid `any` - use `unknown` if you must be generic
- No `@ts-ignore` without a comment explaining why
- Types should document intent, not just satisfy compiler

### JSDoc Standards

**Document public APIs with JSDoc comments:**

```typescript
/**
 * Load all spells for a given game system
 * 
 * Dynamically imports and aggregates spell data for the specified system.
 * Returns empty array for systems without spell data.
 * 
 * @param systemId - The game system identifier (e.g., 'dnd-5e-2024')
 * @returns Promise resolving to array of spells for the system
 * 
 * @example
 * ```typescript
 * const spells = await loadSpellsForSystem('dnd-5e-2024');
 * console.log(`Loaded ${spells.length} spells`);
 * ```
 */
export async function loadSpellsForSystem(systemId: GameSystemId): Promise<Spell[]> {
  // ...
}
```

**What to document:**
- All exported functions, classes, and interfaces
- Module-level documentation with `@module` tag
- Complex types and their usage
- Key utility functions

**What NOT to document:**
- Internal/private functions (use `@private` tag instead)
- Self-explanatory getters/setters
- Trivial helper functions

**Generating API docs:**
```bash
npm run docs  # Generates docs/api/ with TypeDoc
```

### Data Files

```typescript
// Good: Clear, typed, single source
export const level4Spells: Spell[] = [
  { id: 'fireball', name: 'Fireball', ... },
  { id: 'ice-storm', name: 'Ice Storm', ... },
];

// Bad: Split, unclear, multiple sources
export const baseSpells = [...];
// in another file:
export const expandedSpells = [...];
```

### React Components

**Functional components with hooks:**

```typescript
// Use hooks for state and effects
function SpellCard({ spell }: { spell: Spell }) {
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Track spell views for analytics
    trackSpellView(spell.id);
  }, [spell.id]);
  
  return (...);
}
```

**Component organization:**

```typescript
// 1. Imports
import { useState } from 'react';
import type { Spell } from '@/types/magic/spells';

// 2. Types
interface SpellCardProps {
  spell: Spell;
  onCast?: (spell: Spell) => void;
}

// 3. Component
export function SpellCard({ spell, onCast }: SpellCardProps) {
  // 3a. Hooks
  const [expanded, setExpanded] = useState(false);
  
  // 3b. Derived state
  const isCantrip = spell.level === 0;
  
  // 3c. Event handlers
  const handleCast = () => onCast?.(spell);
  
  // 3d. Render
  return (...);
}
```

**Co-locate related code:**

```
SpellCard/
├── SpellCard.tsx       # Component
├── SpellCard.test.tsx  # Tests
├── SpellCard.css       # Styles (if needed)
└── index.ts            # Export
```

---

## Testing

### Test What Matters

- Test behavior, not implementation
- Test edge cases before happy paths
- Test error conditions

```typescript
// Good: Tests actual behavior
it('should handle invalid spell level', () => {
  expect(() => getSpells(99)).toThrow('Invalid level');
});

// Bad: Tests implementation detail
it('should call useState hook', () => {
  // Don't test framework internals
});
```

### Data Validation Tests

- Every data file should have a validation test
- Test SRD compliance
- Test no duplicate IDs
- Test required fields exist

```typescript
describe('level-4-spells', () => {
  it('should have unique IDs', () => {
    const ids = level4Spells.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  
  it('should all be level 4', () => {
    expect(level4Spells.every(s => s.level === 4)).toBe(true);
  });
});
```

### Property-Based Testing

**Generate test cases instead of writing them manually.**

```typescript
import fc from 'fast-check';

// Test with random valid inputs
test('spell level always between 0-9', () => {
  fc.assert(
    fc.property(
      fc.record({
        name: fc.string(),
        level: fc.integer({ min: 0, max: 9 }),
        school: fc.constantFrom('abjuration', 'conjuration', ...),
      }),
      (spell) => {
        const validated = validateSpell(spell);
        expect(validated.level).toBeGreaterThanOrEqual(0);
        expect(validated.level).toBeLessThanOrEqual(9);
      }
    )
  );
});
```

---

## Adding Game Content

### Before Adding Anything

1. **Search for existing files:** `find src/data -name "*spell*" -type f`
2. **Check for duplicates:** Look for `*-expanded.ts` or similar patterns
3. **Read existing files:** Understand the current structure
4. **Add to existing files first:** Only create new files when necessary

### Adding Spells
```bash
# Check what exists
ls src/data/dnd/3.5e/spells/level-4/

# If level-4-spells.ts exists:
# → Add your spells there

# If comprehensive-spells.ts and comprehensive-expanded.ts exist:
# → Consolidate them first, then add your spells

# If nothing exists:
# → Create level-4-spells.ts (not comprehensive-spells.ts)
```

### Adding Equipment
- Add to existing `magic-weapons.ts`, not `magic-weapons-expanded.ts`
- If file gets too large (>1000 lines), split by category: `swords.ts`, `bows.ts`
- Never create `*-expanded.ts` files

---

## SRD Compliance

**This project contains ONLY SRD content. No exceptions.**

Before adding any content:
1. Verify it exists in the official SRD for that system
2. Add source comment: `// Source: SRD 3.5, PHB p.XXX`
3. Run tests: `npm test`

See `src/utils/openContentPolicy.ts` for the enforced source filter and
`docs/generated/roadmap-metrics.md` for the current compliance audit.

---

## Pull Requests

### Before Submitting
```bash
npm test        # All tests pass
npm run build   # Builds successfully
npm run lint    # No linting errors
```

### PR Checklist
- [ ] No duplicate files or `*-expanded.ts` patterns
- [ ] All content is SRD-compliant
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] File names are descriptive and complete

### What Makes a Good PR
- **Small and focused:** One logical change
- **Well-tested:** Includes tests for new code
- **Clean history:** Meaningful commit messages
- **No cruft:** Removed temporary files, commented code

### What Gets Rejected
- Creating `*-expanded.ts` when `*.ts` already exists
- Non-SRD content
- Untested code
- Breaking existing functionality without migration path

---

## Code Review Philosophy

### What We're Looking For

**1. Correctness**
- Does it work?
- Edge cases handled?
- Type-safe?

**2. Clarity**
- Can a new contributor understand this in 6 months?
- Are names descriptive?
- Is the logic obvious?

**3. Consistency**
- Matches existing patterns?
- Follows file organization rules?
- Uses established conventions?

**4. Performance**
- Measured bottlenecks?
- Appropriate data structures?
- No unnecessary re-renders?

**5. Deletability**
- Easy to remove if requirements change?
- Loosely coupled?
- No hidden dependencies?

### Review Comments

**Be specific:**
```
❌ "This could be better"
✅ "Extract this into a helper function. It's used 3 times and will be harder to maintain inline."
```

**Explain why:**
```
❌ "Don't use `any` here"
✅ "Don't use `any` - use `Spell | Item | Feature` union type so we catch errors at compile time"
```

**Suggest alternatives:**
```
❌ "This is slow"
✅ "This filters the array 3 times (O(3n)). Consider:

const result = spells.filter(spell => 
  spell.level === level && 
  spell.classes.includes(class) &&
  spell.school === school
);
```

### Nitpicks vs Blockers

**Blockers (must fix):**
- Breaks existing functionality
- Security vulnerability
- Non-SRD content
- No tests for new behavior
- Duplicates existing files

**Nitpicks (nice to have):**
- Minor style inconsistencies
- Could be more performant (but no measured impact)
- Alternative approach exists (but current works)

Mark nitpicks: `nit: consider using Map instead of object for O(1) lookup`

### Approval Criteria

**Approve when:**
- All blockers resolved
- Tests pass
- Code is understandable
- Fits architecture

**Don't approve when:**
- "I trust them, didn't review"
- "Looks fine" without reading
- Blockers remain

### Time Budgets

- Small PR (<100 lines): 5-10 minutes
- Medium PR (100-300 lines): 15-30 minutes
- Large PR (>300 lines): 30-60 minutes
- If it takes longer: PR is too big, ask for split

---

## Engineering Principles Summary

1. **Single source of truth** - No duplicate files or data
2. **Clarity over cleverness** - Obvious code beats clever code
3. **Measure first** - Profile before optimizing
4. **Types prevent bugs** - Make illegal states unrepresentable
5. **Fast by default** - Performance is a feature
6. **Design for deletion** - Make code easy to remove
7. **Test behavior** - Not implementation details
8. **User context matters** - Design for gameplay, not browsing
9. **Compose, don't configure** - Build from small pieces
10. **Document decisions** - Explain the "why" behind trade-offs

---

## Questions?

Read the code first. Profile the problem. Then ask specific questions with:
- What you tried
- What you measured
- What you're optimizing for

Vague questions get vague answers. Specific questions get actionable solutions.
