# Developer Onboarding Guide

**Last Updated**: February 7, 2026

Welcome to the Multi-System RPG Character Sheet project. This guide will get you productive as quickly as possible.

---

## Day 1: Setup & Orientation

### 1. Prerequisites

- **Node.js** 20.19+ (or 22.12+ / 24+) — check with `node --version`
- **npm** (bundled with Node.js)
- **Git**
- A modern browser (Chrome, Firefox, Edge)

### 2. Clone & Install

```bash
git clone <repository-url>
cd windsurf-project
npm install
```

### 3. Verify Everything Works

```bash
npm run build       # TypeScript compile + Vite build (should succeed)
npm test -- --run   # Run all tests (3200+ should pass)
npm run lint        # 0 errors expected
npm run validate    # Validate all game data
```

### 4. Start Developing

```bash
npm run dev         # Starts Vite dev server at http://localhost:5173
```

Open the URL in your browser. You should see the game system selector and be able to create a character.

### 5. IDE Setup

**Recommended: VS Code** with these extensions:
- ESLint
- Prettier
- TypeScript (built-in)
- Tailwind CSS IntelliSense

Enable **Format on Save** for consistent code style.

---

## Day 2-3: Codebase Tour

### Project Structure

```
src/
├── components/          # React UI components
├── constants/           # Shared constants (proficiencies, game rules)
├── data/                # All game content (spells, classes, equipment, etc.)
│   ├── dnd/             # D&D editions (5e-2014, 5e-2024, 3.5e)
│   ├── pathfinder/      # Pathfinder (1e, 2e)
│   └── mutants-and-masterminds/  # M&M 3e
├── hooks/               # React hooks (useCharacters, etc.)
├── services/            # Data loaders
├── types/               # TypeScript type definitions
│   ├── core/            # Character, common types
│   ├── equipment/       # Equipment types
│   ├── magic/           # Spell types
│   └── mam/             # M&M-specific types
├── utils/               # Utility functions (storage, validation, etc.)
└── validation/          # Data validation system
```

### Key Files to Read First

| File | What It Does |
|------|-------------|
| `src/types/core/character.ts` | The `Character` interface — central data model |
| `src/types/game-systems.ts` | `GameSystemId` union type + re-exports |
| `src/utils/storage.ts` | localStorage persistence layer |
| `src/hooks/useCharacters.ts` | React hook for character CRUD |
| `src/App.tsx` | Main application component |
| `src/components/CharacterCreation.tsx` | Multi-step character wizard |
| `src/components/CharacterSheetTabs.tsx` | Tabbed character sheet view |
| `src/services/loaders/dataLoader.ts` | Dynamic data loading by system |

### Architecture Layers

```
Data (src/data/)  →  Loaders (src/services/)  →  Hooks (src/hooks/)  →  Components (src/components/)
     ↑                                                                        ↑
  Types (src/types/)                                                   UI (TailwindCSS + shadcn/ui)
```

- **Data layer**: Pure static data arrays. No logic.
- **Loaders**: Dynamic imports by game system. Handle aggregation.
- **Hooks**: Business logic and state management. `useCharacters` is the primary hook.
- **Components**: Presentation. Minimal logic.

### Game Systems

| System ID | Edition | Data Location |
|-----------|---------|---------------|
| `dnd-5e-2014` | D&D 5e SRD 5.1 | `src/data/dnd/5e-2014/` |
| `dnd-5e-2024` | D&D 5e SRD 5.2 | `src/data/dnd/5e-2024/` |
| `dnd-3.5e` | D&D 3.5e SRD | `src/data/dnd/3.5e/` |
| `pf1e` | Pathfinder 1e | `src/data/pathfinder/1e/` |
| `pf2e` | Pathfinder 2e | `src/data/pathfinder/2e/` |
| `mam3e` | M&M 3e | `src/data/mutants-and-masterminds/3e/` |

---

## Week 1: Understanding the Patterns

### How Data Files Are Structured

Each game system follows a similar directory layout:

```
src/data/dnd/5e-2014/
├── classes/           # One folder per class
│   ├── fighter/
│   │   ├── index.ts   # Base class definition
│   │   └── champion.ts  # Subclass
│   └── wizard/
├── spells/            # Organized by level
│   ├── cantrips.ts
│   ├── level-1.ts
│   └── ...
├── equipment/         # Weapons, armor, gear, magic items
├── species/           # Races/ancestries
└── metadata.ts        # System metadata and content counts
```

### How to Add Content

**Adding a spell** (most common task):

1. Find the appropriate level file: `src/data/<system>/spells/level-<N>.ts`
2. Add your spell object to the existing array, following the `Spell` interface
3. Run `npm run validate` to check it passes validation
4. Run `npm test -- --run` to confirm nothing breaks

**Adding equipment:**

1. Find `src/data/<system>/equipment/` and the appropriate file (weapons, armor, gear, magic-items)
2. Add the item following the existing type pattern
3. Validate

**Key rule**: Always add to existing files. Never create `*-expanded.ts` files. See `CONTRIBUTING.md` for the full rationale.

### SRD Compliance

All content must come from official System Reference Documents (SRDs). Every data entry includes a `source` field referencing the SRD. See `SRD_COMPLIANCE.md` for the full policy.

```typescript
// Every data item must have source attribution
{
  id: 'fireball',
  name: 'Fireball',
  source: 'SRD 5.1',
  // ...
}
```

---

## Month 1: First Contribution

### Pick a Good First Task

- **Content addition**: Add missing spells/equipment for a game system
- **Test coverage**: Write component or integration tests
- **Documentation**: Improve inline docs or user guide
- **Bug fix**: Check the issue tracker for `good-first-issue` labels

### Development Workflow

```bash
# 1. Create a branch
git checkout -b feat/add-pf2e-spells

# 2. Make your changes

# 3. Verify everything
npm run build        # Must succeed
npm test -- --run    # All tests must pass
npm run lint         # 0 errors
npm run validate     # Data validation passes

# 4. Commit with conventional format
git commit -m "feat(pf2e): add 10 level-3 spells from Core Rulebook"

# 5. Push and open PR
git push origin feat/add-pf2e-spells
```

### Commit Message Format

```
<type>(<scope>): <description>

Types: feat, fix, docs, test, refactor, perf, chore
Scopes: dnd-5e, pf2e, pf1e, mam3e, ui, types, etc.
```

### PR Checklist

Before requesting review, verify:

- [ ] `npm run build` succeeds
- [ ] `npm test -- --run` passes all tests
- [ ] `npm run lint` shows 0 errors
- [ ] `npm run validate` passes
- [ ] No `*-expanded.ts` files created
- [ ] All content is SRD-compliant with `source` fields
- [ ] Tests added for new functionality

---

## Available npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm test` | Run tests (watch mode) |
| `npm test -- --run` | Run tests once |
| `npm run test:ui` | Interactive Vitest UI |
| `npm run test:coverage` | Coverage report |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run validate` | Validate all game data |
| `npm run docs` | Generate TypeDoc API docs |
| `npm run roadmap:metrics` | Regenerate roadmap content counts |
| `npm run progress` | Show current implementation progress |

---

## Key Documentation

| Document | Contents |
|----------|----------|
| `README.md` | Project overview, quick start, system status |
| `ARCHITECTURE.md` | Technical architecture, folder structure, design decisions |
| `CONTRIBUTING.md` | Code standards, anti-patterns, review process |
| `SRD_COMPLIANCE.md` | Legal compliance policy |
| `USER_GUIDE.md` | End-user documentation |
| `TECHNICAL_ROADMAP.md` | Full development roadmap with phases |
| `ROADMAP_PROGRESS.md` | Current progress against roadmap |
| `docs/character-schema.md` | Character data model reference |
| `docs/data-export-format.md` | localStorage + export/import format |
| `docs/future-backend-api.md` | API contract for future backend |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** (strict mode) | Type safety |
| **Vite 5** | Build tool + dev server |
| **TailwindCSS 3** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Lucide React** | Icons |
| **Vitest** | Unit + integration testing |
| **Playwright** | E2E testing |
| **web-vitals** | Performance monitoring |

---

## Getting Help

1. **Read the code** — the codebase is well-typed and self-documenting
2. **Check existing patterns** — most tasks follow established patterns
3. **Run `npm run progress`** — see what's implemented and what's missing
4. **Read `CONTRIBUTING.md`** — engineering principles and anti-patterns
5. **Ask specific questions** with what you tried and what you measured
