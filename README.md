# Multi-System RPG Character Sheet

![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/<owner>/<repo>/graph/badge.svg)](https://codecov.io/gh/<owner>/<repo>)

Multi-system RPG character sheet using **ONLY SRD/OGL content** across 7 registered game systems. Six systems currently ship with full or partial product support; Daggerheart remains scaffold-only.

## 🎯 Project Status

- ✅ **D&D 5e-2024**: SRD Subset - 315 spells, 87 feats, 99 monsters, 204 equipment items
- ✅ **D&D 5e-2014**: SRD Subset - 238 spells, 41 monsters, 230 equipment items, 106 loader-backed feature options, all core classes
- ✅ **Pathfinder 2e**: Core product support - 146 spells, 93 feats, 188 equipment, 12 classes
- ✅ **D&D 3.5e**: Partial product support - 555 spells (SRD), 515 feats, 11 loader-backed base classes
- ✅ **Pathfinder 1e**: Partial product support - 134 spells, 86 feats, 70 equipment, 18 loader-backed classes
- ✅ **Mutants & Masterminds 3e**: Core product support - 61 powers, 74 advantages, 150 equipment, 15 archetypes, 28 complications, 101 power modifiers
- ⚠️ **Daggerheart**: Scaffold only - manual-entry sheet, no local loader-backed content yet
- ✅ **Build**: Passing (0 errors)
- ✅ **Type Safety**: Strict TypeScript
- ✅ **Coverage**: 80.65% branch coverage on March 7, 2026 (`npm run test:coverage` under Node 22.18.0)
- ✅ **SRD Compliance**: Strict - no proprietary content

## 🚀 Quick Start

### Requirements
- **Node.js**: 20.19+ (or 22.12+ / 24+)
- **Runtime Pin**: `.nvmrc` is set to `20.19.0`; run `nvm use` if you use nvm
- **Package Manager**: npm (comes with Node.js)
- **Browser**: Modern browser with ES2020+ support

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd windsurf-project

# Match the pinned runtime if you use nvm
nvm use

# Install dependencies
npm install
```

### Development Commands

**Core Development:**
```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

**Code Quality:**
```bash
npm run lint       # Run ESLint
npm run validate   # Validate all game data
npm test           # Run the Vitest suite
npm run test:ui    # Interactive test UI (Vitest)
npm run test:coverage  # Generate coverage report (Node 20.19+ required)
```

**Type Checking:**
```bash
npx tsc --noEmit   # TypeScript type checking
```

### Environment Setup

**First Time Setup:**
1. Run `nvm use` (or otherwise install Node.js 20.19+): `node --version`
2. Run `npm install` to install dependencies
3. Run `npm test` to verify installation
4. Run `npm run dev` to start development server
5. Open http://localhost:5173 in your browser

**IDE Setup (Recommended):**
- VSCode with extensions: ESLint, Prettier, TypeScript
- Enable "Format on Save" for consistent code style

### Troubleshooting

**Build Errors:**
```bash
# Clear build cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

**Port Already in Use:**
```bash
# Vite will automatically try next available port
# Or specify custom port:
npm run dev -- --port 3000
```

**Test Failures:**
```bash
# Run single test file
npm test -- path/to/test.ts

# Run tests in watch mode
npm test -- --watch

# Clear test cache
npm test -- --clearCache
```

If `npm run test:coverage` fails before running any tests, confirm the shell is on Node 20.19+ or newer. The V8 coverage provider depends on `node:inspector/promises`, which is not available in Node 18.

**TypeScript Errors:**
```bash
# Rebuild TypeScript
npx tsc --build --clean
npx tsc --noEmit
```

**Storage Issues (Browser):**
- Clear localStorage: Open DevTools → Application → Local Storage → Clear
- Check storage quota: Data Management screen shows current usage

### Key Features
- **Template-Driven Character Setup**: Select class/species/background from dropdowns to auto-populate proficiencies, features, HP, and spell slots
- **5e Class Builder**: Manage multiclass rows and pick the shipped SRD subclass directly from the shared 2014/2024 sheet
- **5e 2014 Feature-Option Browser**: Browse and persist SRD invocations, fighting styles, metamagic, maneuvers, ki abilities, channel divinity options, wild shapes, and smites from the shared Features tab
- **5e Feat Automation**: 2024 feat selection now applies supported ASIs and proficiency grants; deeper feat riders remain manual
- **5e Ability Score Planner**: Use a built-in 27-point-buy planner or assign the standard array from the shared 5e ability tab
- **M&M Reference Surfaces**: Pin loader-backed archetypes, insert SRD complications, and browse the shared power-modifier catalog from the native M&M sheet
- **Character Management**: Create, edit, and manage characters across 7 game systems
- **Export/Import**: Backup and share characters via JSON files
- **Auto-Save**: Changes automatically saved to browser localStorage
- **Tabbed Character Sheet**: System-specific tabs for sheets, inventory, spells, feats, equipment, and other supported browse surfaces
- **System Dashboard**: Live status view of all game systems
- **Data Management**: Export/import/clear all characters from the home screen
- **Skill Management**: Interactive proficiency toggling (none/proficient/expertise)

### Deployment
```bash
# Vercel
vercel --prod

# Manual
npm run build && deploy dist/
```

## 📁 Project Structure

```
src/
├── data/
│   ├── dnd/
│   │   ├── 5e-2014/      # D&D 5e SRD 5.1 (2014)
│   │   └── 3.5e/         # D&D 3.5e (ready for content)
│   ├── pathfinder/
│   └── mutants-and-masterminds/
├── types/                # TypeScript definitions
├── validation/           # Data validation
├── components/           # React UI components
└── constants/            # Type-safe constants
```

## 🎲 Implemented Systems (SRD/OGL Content Only)

### D&D 5th Edition (2024) - SRD 5.2 ✅

**SRD Subset Implemented**:
- Species: 9/9 core species
- Classes: 12/12 with full 1-20 progressions
- Subclasses: 12/12 (one per class)
- Spells: 315 (26 cantrips + 289 leveled spells)
- Monsters: 99 creatures across 14 types
- Backgrounds: 6 core backgrounds
- Equipment: 204 items (39 weapons, 13 armor, 50 gear, 102 magic items)
- Feats: 87 feats (15 origin, 45 general, 15 fighting styles, 12 epic boons)

**Note**: SRD 5.2 full contents not officially documented; implementation represents core verified content

### D&D 5th Edition (2014) - SRD 5.1 ✅

**SRD Subset Implemented**:
- Species: 9/9 core species
- Classes: 12/12 with subclasses
- Spells: 238 (SRD only)
- Monsters: 41
- Equipment: 230 items
- Feature Options: 106 loader-backed entries surfaced through the shared Features tab
  - Fighting Styles: 7
  - Metamagic: 8
  - Divine Smites: 7
  - Eldritch Invocations: 25
  - Ki Abilities: 6
  - Maneuvers: 21
  - Channel Divinity: 12
  - Wild Shapes: 20

**Note**: Represents SRD 5.1 content. Feature-option selection in the 2014 sheet is persistence/provenance support, not full downstream rules automation.

### Pathfinder 1e - Base Product Support ✅
**Implemented**:
- Classes: 18 loader-backed classes (11 base + 7 vetted prestige classes)
- Spells: 134 spells
- Feats: 86 feats (Core Rulebook only)
- Equipment: 70 items

**Status**: Base classes plus vetted CRB prestige classes are shipped; some prestige-caster spell progression still requires manual tracking in the sheet

### Pathfinder 2e - Core Product Support ✅
**Implemented**:
- Spells: 146 spells
- Classes: 12 core classes
- Feats: 93 feats (Core Rulebook only)
- Ancestries: 6 core ancestries
- Backgrounds: loader-backed in the native sheet
- Archetypes: 5 loader-backed archetypes in the native sheet
- Equipment: 188 items

**Status**: Core product support is shipped, including loader-backed backgrounds and archetypes in the PF2e sheet

### D&D 3.5e - Base Product Support ✅ (SRD-Only)
**Implemented**: 
- Spells: 555 (SRD spell list)
- Base Classes: 11 core classes
- Feats: 515 (after open-content filtering)
- Equipment: 38 weapons, 19 armor, 153 gear, 19 magic items
- Races: 7

**Status**: Reachable counts are now truth-aligned to the 11 loader-backed base classes; prestige classes remain repo-backed and need normalization before productization

### Mutants & Masterminds 3e - Core Product Support ✅
**Implemented**:
- Powers: 61 SRD-verified (attack:12, control:11, defense:7, general:16, movement:8, sensory:7)
- Advantages: 74 (combat:33, fortune:6, general:16, skill:19)
- Equipment: 150 items
- Archetypes: 15 loader-backed reference archetypes with in-sheet pinning
- Complications: 28 loader-backed SRD complications with insertion into the character document
- Power Modifiers: 101 loader-backed extras/flaws surfaced in reporting and the M&M reference browser
- Single-source architecture with descriptor-based filtering

**Status**: Core power/advantage/equipment support is shipped alongside loader-backed archetype pinning, complication insertion, and modifier catalog reporting. Archetypes remain reference-only and do not auto-build characters.

## 📊 Quality Metrics

| Metric | Status |
|--------|--------|
| **Build** | Passing ✅ |
| **Tests** | Passing ✅ |
| **Coverage** | 80.65% branch (March 7, 2026) ✅ |
| **Lint** | 0 Errors ✅ |
| **Type Safety** | 100% Strict ✅ |
| **SRD Compliance** | **STRICT - SRD/OGL Only** ✅ |
| **System Support** | 6 full/partial + 1 scaffold ✅ |
| **Architecture** | V2 Document & Data Model ✅ |

## 🔍 Validation System

Run comprehensive data validation:

```bash
npm run validate
```

Validates:
- Required fields and structure
- Proficiency consistency
- Spell slot array lengths
- Feature progression completeness
- Multiclass rules
- Type safety compliance

## 📚 Documentation

- **docs/STATUS.md** - Current project status, remaining work, known gaps, and verified test baseline
- **docs/generated/roadmap-metrics.md** - Generated loader-backed content counts and compliance audit
- **docs/EVIDENCE_LINKED_PARITY_AUDIT.md** - March 6, 2026 parity audit snapshot
- **docs/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md** - Evidence-linked remediation sequencing
- **CONTRIBUTING.md** - Developer guide, environment requirements, and engineering standards

## 🛠️ Development Guide

### Adding a New Class
1. Create directory: `src/data/dnd/5e-2014/classes/[class-name]/`
2. Implement: `index.ts` (base class) and `[subclass].ts`
3. Use existing classes as templates
4. Run validation: `npm run validate`

### Adding a Spell
1. Add spell to the appropriate level file: `src/data/dnd/5e-2014/spells/level-[N].ts`
2. Follow `Spell` interface from `types/`
3. Run validation

### Type Safety
All proficiencies use standardized constants from `src/constants/proficiencies.ts`:

```typescript
import { WeaponProficiency, ArmorProficiency, Skill } from './constants/proficiencies';

weaponProficiencies: [WeaponProficiency.SIMPLE, WeaponProficiency.MARTIAL]
```

## 🎯 Roadmap

### Completed
- ✅ UI/UX polish — Responsive layouts, dark mode, ConfirmDialog modals, toast notifications
- ✅ Dice roller — Integrated dice rolling with system-aware modifiers
- ✅ Performance — Code splitting, partial lazy loading (sheet-internal components), gzip/brotli compression, bundle budget CI gate
- ✅ PWA/offline — Service worker + web manifest for offline access
- ✅ IndexedDB — Dual-write storage with auto-migration from localStorage
- ✅ Undo/redo — State history for accidental edit recovery
- ✅ Campaign management — Campaign CRUD with party tracking

### Future
- **Backend API** — Optional server sync for cross-device support; no checked-in API spec doc today
- **Additional game systems** — Daggerheart scaffold registered; more systems can follow the registry pattern

## 📜 Legal & Licensing

This project uses content from the **System Reference Document 5.1** under the **Open Gaming License (OGL) 1.0a**.

- ✅ All content is SRD 5.1 compliant
- ✅ No Product Identity used
- ✅ No copyrighted material beyond SRD
- ✅ One subclass per class (SRD limit)

See documentation on Open Content Policy.

## 🤝 Contributing

Contributions welcome! Please:
1. Follow existing code patterns
2. Ensure all data passes validation
3. Add tests for new features
4. Update documentation

## 📦 Dependencies

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui-inspired** - UI components

## 🎉 Credits

Built with a focus on:
- Type safety and validation
- SRD compliance
- Scalable architecture
- Developer experience

---

**Last Updated**: March 7, 2026
