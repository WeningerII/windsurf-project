# Multi-System RPG Character Sheet

Multi-system RPG character sheet using **only open-license SRD content** across 7 registered game systems. The repo ships a mix of full and partial product slices; use [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md) for the canonical roadmap, [docs/STATUS.md](docs/STATUS.md) for the current-state summary, and [docs/generated/roadmap-metrics.md](docs/generated/roadmap-metrics.md) for authoritative loader-backed counts.

## 🧭 Where This Is Heading

Today this is a deterministic, multi-system character-sheet and scene toolkit — everything under **Project Status** below actually ships. The longer arc is to make tabletop creation and play feel frictionless by layering AI-assisted drafting and orchestration **on top of** that deterministic core: describe a character, encounter, or scene in plain language and get a validated, rules-legal draft you apply through the same paths a manual user would.

**None of the AI layer ships yet.** The deterministic engine is the authority; AI is planned strictly as a draft/orchestration surface that never decides rules legality, and the product must always work with no provider keys configured. The thesis behind this direction is in [docs/VISION.md](docs/VISION.md); the phased roadmap is in [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md).

## 🎯 Project Status

- ✅ **Verification**: `npm run verify` passed on May 30, 2026 under Node `20.19.0`
- ✅ **D&D 5e 2014 + 2024**: full SRD-backed character management with shared 5e sheet flows and structured always-prepared support
- ✅ **Pathfinder 2e**: native sheet with loader-backed archetypes, backgrounds, feats, spells, and equipment
- ✅ **D&D 3.5e + Pathfinder 1e**: shared legacy sheet with base/prestige-class product reachability and Vancian tracked/prepared spell workflows
- ✅ **Spell catalog parity baseline**: shared spell indexes and alias-safe lookups across all five spell systems, including PF2e rank-10 browser support
- ✅ **Mutants & Masterminds 3e**: native point-buy sheet with browseable SRD reference surfaces
- ✅ **Daggerheart**: partial SRD-backed support with selectors, templates, equipment, domains, domain-card loadouts, and bounded deterministic passive automation
- ✅ **Manual scenes**: local scene/grid manager with event-backed tokens, queued loader-backed D&D 5e encounter seeding, party-level XP preview, terrain or hazard markers, initiative controls, and scene import/export
- ✅ **Open-content policy**: strict source-filtered SRD/core-only shipping

## 🚀 Quick Start

### Requirements
- **Node.js**: 20.19+ (or 22.12+ / 24+)
- **Runtime Pin**: `.nvmrc` and `.node-version` both pin `20.19.0`
- **Manager Path**: Use your preferred version manager to match the repo pin, then run normal `npm install` / `npm run verify` flows
- **Bootstrap Path**: On host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>` if no version manager is available
- **Manual Fallback**: If the host shell is below Node 18 or has no usable Node install, install Node `20.19.0` manually or fix your version manager before using the repo
- **Package Manager**: npm (comes with Node.js)
- **Browser**: Modern browser with ES2020+ support

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd windsurf-project

# Manager path: match the repo pin, then install normally
# Example if you use nvm:
# nvm use
npm install

# Bootstrap path: host Node 18+ with no working version manager
# npm run bootstrap:node
```

### Development Commands

**Core Development:**
```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run verify     # Full repo verification pass (Node 20.19+ / 22.12+ / 24+)
npm run runtime:doctor  # Show host/runtime policy state and recovery commands
```

**Code Quality:**
```bash
npm run lint       # Run ESLint
npm run validate   # Validate all game data
npm run check:doc-drift  # Validate live docs, historical banners, and audited support-copy claims
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
1. Manager path: use your preferred version manager to match `.nvmrc` / `.node-version`, then run `npm install`
2. Bootstrap path: if the shell is on host Node 18+ with no version manager, run `npm run bootstrap:node`
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

If `npm install` fails immediately on an unsupported host runtime, run `npm run runtime:doctor` to see the current host/runtime state. On host Node 18+ you can recover with `npm run bootstrap:node`, then use `npm run pinned -- run <task>` for repo commands until your normal version-manager path is fixed.

**TypeScript Errors:**
```bash
# Rebuild TypeScript
npx tsc --build --clean
npx tsc --noEmit
```

**Storage Issues (Browser):**
- Clear documents: use the Data Management screen's clear action (clears both IndexedDB primary and localStorage fallback)
- Manual clear (both stores): DevTools → Application → Storage → clear the IndexedDB database *and* Local Storage for this origin
- Check storage quota: Data Management screen shows current usage

### Key Features
- **Template-Driven Character Setup**: Select class/species/background from dropdowns to auto-populate proficiencies, features, HP, and spell slots
- **5e Class Builder**: Manage multiclass rows and pick the shipped SRD subclass directly from the shared 2014/2024 sheet
- **5e 2014 Feature-Option Browser**: Browse and persist SRD invocations, fighting styles, metamagic, maneuvers, ki abilities, channel divinity options, wild shapes, and smites from the shared Features tab
- **5e Feat Automation**: 2024 feat selection now applies supported ASIs and proficiency grants; deeper feat riders remain manual
- **5e Ability Score Planner**: Use a built-in 27-point-buy planner or assign the standard array from the shared 5e ability tab
- **Cross-System Spell Browser**: Normalized spell catalogs now drive shared browser filters, alias-safe lookup, PF2e rank-10 level filtering, and richer target/effect/area/scaling display
- **M&M Reference Surfaces**: Pin loader-backed archetypes, insert SRD complications, and browse the shared power-modifier catalog from the native M&M sheet
- **PF2e + M&M Native Sheet Decomposition**: Both systems now split headers, tab bodies, and browser-heavy surfaces into dedicated components, with state/template orchestration moved into system-local controller hooks and browse surfaces prewarming loaders and lazy chunks on focus/hover
- **Character Management**: Create, edit, and manage characters across 7 game systems
- **Export/Import**: Backup and share characters via JSON files
- **Auto-Save**: Changes automatically saved to browser localStorage
- **Tabbed Character Sheet**: System-specific tabs for sheets, inventory, spells, feats, equipment, and other supported browse surfaces
- **System Dashboard**: Live status view of all game systems
- **Data Management**: Export/import/clear all characters from the home screen
- **Skill Management**: Interactive proficiency toggling (none/proficient/expertise)

### Deployment
```bash
# Netlify CI deploys this repo in GitHub Actions.
# Manual deploy:
npm run build
netlify deploy --dir=dist --prod
```

Required GitHub Actions secrets for Netlify deploys:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

## 📁 Project Structure

```
src/
├── systems/              # Per-system definitions, engines, sheets, controllers
├── hooks/                # App and system-local state orchestration
├── registry/             # System registry and engine contracts
├── utils/                # Loaders, templates, storage, reporting, helpers
├── data/
│   ├── dnd/
│   │   ├── 5e-2014/      # D&D 5e SRD 5.1 (2014)
│   │   ├── 5e-2024/      # D&D 5e SRD 5.2 (2024)
│   │   └── 3.5e/         # D&D 3.5e SRD
│   ├── pathfinder/
│   ├── mutants-and-masterminds/
│   └── daggerheart/
├── types/                # TypeScript definitions
├── components/           # React UI components
└── validation/           # Data validation
```

## 🎲 Implemented Systems (Open-License SRD Content Only)

Counts below summarize the current generated metrics in [docs/generated/roadmap-metrics.md](docs/generated/roadmap-metrics.md).

### D&D 5th Edition (2024) - SRD 5.2 ✅

**SRD Subset Implemented**:
- Species: 7 core species (Half-Elf and Half-Orc are SRD 5.1-only and not in SRD 5.2)
- Classes: 12/12 with full 1-20 progressions
- Subclasses: 12/12 (one per class)
- Spells: 294 (23 cantrips + 271 leveled spells), verified against the SRD 5.2.1 spell list
- Monsters: 99 creatures across 14 types
- Backgrounds: 4 core backgrounds (Acolyte, Criminal, Sage, Soldier)
- Equipment: 204 items (39 weapons, 13 armor, 50 gear, 102 magic items)
- Feats: 19 feats (6 origin, 2 general, 4 fighting styles, 7 epic boons)

**Note**: The full SRD 5.2 spell list (parsed from the official CC-BY SRD 5.2.1) is the independent denominator; non-SRD-5.2 Player's Handbook and homebrew entries have been removed (see `docs/generated/srd-coverage.md`).

### D&D 5th Edition (2014) - SRD 5.1 ✅

**SRD Subset Implemented**:
- Species: 9/9 core species
- Classes: 12/12 with subclasses
- Spells: 222 (22 cantrips + 200 leveled spells), SRD 5.1 only
- Feats: 1 (Grappler — the only feat in SRD 5.1)
- Backgrounds: 1 (Acolyte — the only background in SRD 5.1)
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

**Status**: Base classes plus vetted CRB prestige classes are shipped, and prestige spellcasting advancement is now automated for the shipped prestige casters. Assassin is no longer misclassified as a spell-progressing prestige class.

### Pathfinder 2e - Core Product Support ✅
**Implemented**:
- Spells: 143 spells
- Classes: 12 core classes
- Feats: 93 feats (Core Rulebook only)
- Ancestries: 6 core ancestries
- Backgrounds: loader-backed in the native sheet
- Archetypes: 5 loader-backed archetypes in the native sheet
- Equipment: 188 items

**Status**: Core product support is shipped, including loader-backed backgrounds and archetypes in the PF2e sheet, shared browser support through rank 10, and alias-safe canonical handling for the remaining cross-rank duplicate spell ids.

### D&D 3.5e - Base Product Support ✅ (SRD-Only)
**Implemented**: 
- Spells: 428 canonical loader-backed spells (after alias-safe duplicate collapse)
- Classes: 26 loader-backed classes (11 core + 15 core SRD prestige classes)
- Feats: 515 (after open-content filtering)
- Equipment: 207 loader-backed items (37 weapons, 11 armor, 6 shields, 153 gear); 37 magic items are repo-resident but excluded from the product loader
- Races: 7

**Status**: Reachable counts now include the full core SRD prestige catalog: Arcane Archer, Arcane Trickster, Archmage, Assassin, Blackguard, Dragon Disciple, Duelist, Dwarven Defender, Eldritch Knight, Hierophant, Horizon Walker, Loremaster, Mystic Theurge, Shadowdancer, and Thaumaturgist. Prestige-caster rows now surface in-sheet spellcasting-advancement selectors for the normalized dual-progression classes, and the canonical spell catalog now resolves collapsed class-split duplicates through aliases.

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

### Daggerheart - Partial Product Support ✅
**Implemented**:
- Classes: 9 SRD-backed classes with subclass reference data
- Ancestries: 19 SRD-backed ancestry options
- Communities: 9 SRD-backed community options
- Domains: 9 SRD-backed domains with class mappings
- Domain Cards: 189 SRD-backed cards with loadout/vault browsing and persistence
- Equipment: 204 SRD-backed weapons, 34 SRD-backed armor entries, 61 loot entries, and 54 consumables with active/stowed loadout and inventory support
- Sheet support: selector-backed class, ancestry, community, and subclass choices with in-sheet SRD reference panels
- Starter templates: class, ancestry, and community selections seed supported starting stats and inventory
- Browse tabs: in-sheet class, ancestry, community, weapon, and armor libraries with direct apply actions
- Card library: in-sheet domain-card browser with real add-to-loadout / add-to-vault flows
- Loadout automation: active armor derives Armor Score and damage thresholds; equipped weapons enforce burden and slot rules; supported passive domain-card bonuses apply only from loadout

**Status**: Daggerheart now ships official SRD-backed identity data, domains, domain cards, weapons, armor, loot, consumables, starter templates for supported starting stats and inventory, browseable in-sheet reference libraries, and deterministic passive automation bounded by the existing metadata model. Triggered, timing-based, rest-based, choice-based, and narrative effects remain manual/reference.

## 📊 Quality Metrics

| Metric | Status |
|--------|--------|
| **Build** | Passing ✅ |
| **Verification** | `npm run verify` green on May 30, 2026 ✅ |
| **Coverage Gate** | Passing under Node 20.19+ ✅ |
| **Lint** | 0 Errors ✅ |
| **Type Safety** | 100% Strict ✅ |
| **Open-Content Compliance** | **STRICT - source-filtered open-license SRD only** ✅ |
| **System Support** | 7 full/partial ✅ |
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

- **docs/VISION.md** - Project thesis and long-horizon direction (the *why*)
- **docs/MASTER_PLAN.md** - Canonical roadmap and planning authority
- **docs/STATUS.md** - Current-state summary and verified test baseline
- **docs/rfc/** - Design RFCs: 001 backend sync (accepted), 002 AI control plane (withdrawn), 003 rules IR & effects (draft)
- **docs/generated/roadmap-metrics.md** - Generated product-reachable counts plus raw-export audit
- **docs/EVIDENCE_LINKED_PARITY_AUDIT.md** - Historical March 2026 audit snapshot
- **docs/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md** - Historical remediation sequencing record
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

## 🎯 Planning

- `docs/MASTER_PLAN.md` is the sole roadmap and planning authority.
- `docs/STATUS.md` is a concise current-state summary, not a second backlog.
- `docs/generated/roadmap-metrics.md` carries the authoritative generated count tables.

## 📜 Legal & Licensing

This project uses only open-license reference content, filtered at load time by source attribution.

- ✅ D&D and Pathfinder content is limited to the allowed SRD/core source strings enforced in `src/utils/openContentPolicy.ts`
- ✅ Daggerheart content is limited to **Daggerheart SRD 1.0** / **System Reference Document 1.0** source strings
- ✅ No product-identity text is intentionally shipped outside the allowed open-content sources
- ✅ Loader-backed content is source-filtered before reaching the product UI

See `src/utils/openContentPolicy.ts` and `docs/generated/roadmap-metrics.md`.

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

**Last Updated**: April 30, 2026
