# Multi-System RPG Character Sheet

A local-first character sheet and scene toolkit for seven tabletop RPG systems,
built on a deterministic rules core and shipping **only open-license SRD content**
across 7 registered game systems.

Everything under [Project Status](#-project-status) actually ships. Where support is
partial, this file says so; where a number matters, it cites the generated metrics
rather than restating them.

- **Roadmap and planning authority** — [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)
- **Current-state summary** — [docs/STATUS.md](docs/STATUS.md)
- **Authoritative counts** — [docs/generated/roadmap-metrics.md](docs/generated/roadmap-metrics.md)
- **Which document wins when two disagree** — [docs/README.md](docs/README.md)

## 🧭 Where This Is Heading

Today this is a deterministic, multi-system character-sheet and scene toolkit. The
longer arc is to make tabletop creation and play feel frictionless by layering
AI-assisted drafting and orchestration **on top of** that deterministic core:
describe a character, encounter, or scene in plain language and get a validated,
rules-legal draft you apply through the same paths a manual user would.

**The AI layer has begun shipping, default-off.** A provider-agnostic AI control
plane (RFC 002) is live. Its task allowlist is defined in `src/ai/contracts.ts` —
today: encounter drafting, session-recap narration, image-based creature
identification, scene illustration, and character drafting. It is build-time gated
behind `VITE_AI_ENABLED` (off by default), the provider key lives only in a
server-side Netlify function (never the browser bundle), and the deterministic
engine remains the authority: the model proposes and deterministic validators
decide, with the app fully usable when no key is configured. The thesis is in
[docs/VISION.md](docs/VISION.md); the phased roadmap is in
[docs/MASTER_PLAN.md](docs/MASTER_PLAN.md).

## 🎯 Project Status

- ✅ **Verification**: `npm run verify` passed on July 28, 2026 under Node `20.19.0`
  — see [Quality Gates](#-quality-gates) for how this baseline is maintained
- ✅ **D&D 5e 2014 + 2024**: full SRD-backed character management with shared 5e sheet flows and structured always-prepared support
- ✅ **Pathfinder 2e**: native sheet with loader-backed archetypes, backgrounds, feats, spells, and equipment
- ✅ **D&D 3.5e + Pathfinder 1e**: shared legacy sheet with deterministic RAW auto-resolution — base/prestige classes, spells-per-day (casting-ability, cleric domain, wizard specialist, and Dragon Disciple bonus slots), synergy/encumbrance/gear skills, and equipped-armor AC, with Vancian tracked/prepared spell workflows (prepared-slot assignment stays manual)
- ✅ **Spell catalog parity baseline**: shared spell indexes and alias-safe lookups across all five spell systems, including PF2e rank-10 browser support
- ✅ **Mutants & Masterminds 3e**: native point-buy sheet with browseable SRD reference surfaces
- ✅ **Daggerheart**: SRD-backed support with selectors, templates, equipment, domains, domain-card loadouts, and deterministic passive automation; triggered/narrative card resolution is GM-adjudicated by design
- ✅ **Manual scenes**: local scene/grid manager with event-backed tokens, queued loader-backed encounter seeding across the d20 systems (5e 2014/2024, D&D 3.5e, PF1e, PF2e — 3.5e Encounter-Level budgeting honestly reported as unsupported) with party-level XP preview, terrain or hazard markers including functional terrain (cover, high ground, difficult terrain) that resolves in scene combat across all seven systems, initiative controls, and scene import/export
- ✅ **AI control plane (default-off, RFC 002)**: provider-agnostic gateway whose task allowlist lives in `src/ai/contracts.ts`, gated behind `VITE_AI_ENABLED`, with the provider key held server-side only and deterministic validators deciding what applies
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
npm run typecheck:test  # Type-check unit tests, e2e specs, and tool configs
npm run validate   # Validate D&D 5e (2014) class data (cross-system data invariants run in the Vitest suites)
npm run check:doc-drift  # Validate live docs, historical banners, and audited support-copy claims
npm test           # Run the Vitest suite once
npm run test:watch # Run the Vitest suite in watch mode
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

Every environment variable the app reads is documented in `.env.example`. All of
them are optional — the app runs fully local with none of them set.

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
npm run test:watch

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
- Lost characters, or a restore that looks wrong: `docs/runbooks/local-data-recovery.md`

### Key Features
- **Character Management**: Create, edit, and manage characters across all seven registered systems
- **Template-Driven Character Setup**: dropdown selections seed system-appropriate starting state — 5e class/species/background auto-populates proficiencies, features, HP, and spell slots; Daggerheart class/ancestry/community templates seed supported starting stats and inventory; PF2e ancestry/background selections are loader-backed
- **Cross-System Spell Browser**: Normalized spell catalogs drive shared browser filters, alias-safe lookup, PF2e rank-10 level filtering, and richer target/effect/area/scaling display
- **Tabbed Character Sheet**: system-appropriate tabs for sheets, inventory, and browse surfaces (spells and feats, powers and advantages, domain cards, equipment)
- **Export/Import**: Backup and share characters via JSON files; the round trip is lossless for all seven systems and gated by `src/__tests__/backupRestoreRoundTrip.test.ts`
- **Auto-Save**: Changes saved automatically to browser storage (IndexedDB primary, localStorage mirror)
- **System Dashboard**: Live status view of all game systems
- **Data Management**: Export/import/clear all characters from the home screen
- **5e Class Builder**: Manage multiclass rows and pick the shipped SRD subclass directly from the shared 2014/2024 sheet
- **5e 2014 Feature-Option Browser**: Browse and persist SRD invocations, fighting styles, metamagic, maneuvers, ki abilities, channel divinity options, wild shapes, and smites from the shared Features tab
- **5e Feat Automation**: 2024 feat selection applies supported ASIs and proficiency grants; deeper feat riders remain manual
- **5e Ability Score Planner**: Use a built-in 27-point-buy planner or assign the standard array from the shared 5e ability tab
- **5e Skill Management**: Interactive proficiency toggling (none/proficient/expertise)
- **Legacy d20 Auto-Resolution (3.5e/PF1e)**: deterministic RAW auto-resolution for base and prestige classes — spells-per-day (casting-ability, cleric domain, wizard specialist, and Dragon Disciple bonus slots), synergy/encumbrance/gear skills, and equipped-armor AC
- **Daggerheart Loadout Automation**: active armor derives Armor Score and damage thresholds, equipped weapons enforce burden and slot rules, and supported passive domain-card bonuses apply only from loadout
- **M&M Reference Surfaces**: Pin loader-backed archetypes, insert SRD complications, and browse the shared power-modifier catalog from the native M&M sheet
- **PF2e + M&M Native Sheet Decomposition**: Both systems split headers, tab bodies, and browser-heavy surfaces into dedicated components, with state/template orchestration moved into system-local controller hooks and browse surfaces prewarming loaders and lazy chunks on focus/hover

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
├── rules/                # Deterministic rules IR and combat resolution (RFC 003)
├── scene/                # Scene/encounter runtime (RFC 006)
├── ai/                   # AI control plane, default-off (RFC 002)
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

**This section deliberately states no counts.** Every per-system catalog total —
spells, classes, monsters, equipment, feats — is generated from the live loaders
into [docs/generated/roadmap-metrics.md](docs/generated/roadmap-metrics.md), and
independent SRD coverage (what the upstream SRD contains versus what ships) into
[docs/generated/srd-coverage.md](docs/generated/srd-coverage.md). Counts written
into prose here have gone stale before; those two files are the authority.

What each system's support actually *means*:

### D&D 5th Edition (2024) — SRD 5.2 ✅
Full 1–20 class progressions with one SRD subclass per class, species,
backgrounds, spells, monsters, equipment, and feats. Feat selection applies
supported ASIs and proficiency grants; deeper feat riders remain manual.

**Note**: The full SRD 5.2 spell list (parsed from the official CC-BY SRD 5.2.1)
is the independent denominator; non-SRD-5.2 Player's Handbook and homebrew entries
have been removed. See `docs/generated/srd-coverage.md`.

### D&D 5th Edition (2014) — SRD 5.1 ✅
Full class/subclass progressions, species, spells, monsters, and equipment, plus a
loader-backed feature-option catalog (fighting styles, metamagic, divine smites,
eldritch invocations, ki abilities, maneuvers, channel divinity, wild shapes)
surfaced through the shared Features tab. SRD 5.1 ships exactly one feat
(Grappler) and one background (Acolyte) — that is the SRD's content, not a gap.

**Note**: Feature-option selection in the 2014 sheet is persistence/provenance
support, not full downstream rules automation.

### Pathfinder 1e — Base Product Support ✅
Loader-backed base classes plus vetted Core Rulebook prestige classes, spells,
feats, and equipment. Prestige spellcasting advancement is automated for the
shipped prestige casters. Assassin is correctly classified as non-spell-progressing.
Repo policy scopes PF1e to Core Rulebook + Bestiary 1.

### Pathfinder 2e — Core Product Support ✅
Native sheet with loader-backed classes, ancestries, backgrounds, archetypes,
feats, spells, and equipment; shared browser support through rank 10; alias-safe
canonical handling for cross-rank duplicate spell ids. Repo policy scopes PF2e to
Core Rulebook + Bestiary 1.

### D&D 3.5e — Base Product Support ✅ (SRD-Only)
Loader-backed core and core-SRD prestige classes — Arcane Archer, Arcane Trickster,
Archmage, Assassin, Blackguard, Dragon Disciple, Duelist, Dwarven Defender,
Eldritch Knight, Hierophant, Horizon Walker, Loremaster, Mystic Theurge,
Shadowdancer, Thaumaturgist — plus races, spells, feats, and equipment. Prestige-caster
rows surface in-sheet spellcasting-advancement selectors for the normalized
dual-progression classes, and the canonical spell catalog resolves collapsed
class-split duplicates through aliases. A set of magic items is repo-resident but
deliberately excluded from the product loader. Scoped to the core SRD, excluding
psionics and epic content.

### Mutants & Masterminds 3e — Core Product Support ✅
Native point-buy sheet with SRD-verified powers and advantages, loader-backed
reference archetypes with in-sheet pinning, SRD complications with insertion into
the character document, and a power-modifier catalog surfaced in reporting and the
reference browser. All 113 equipment entries are encoded from the Hero SRD and
cited to it; the 79 entries that had been written for this app rather than
transcribed were deleted 2026-07-30 — see `docs/mam3e-equipment-provenance.md`.

**Status**: Archetypes remain reference-only and do not auto-build characters.

### Daggerheart — Full Product Support ✅
SRD-backed classes with subclass reference data, ancestries, communities, domains,
and domain cards with loadout/vault browsing and persistence; weapons, armor, loot,
and consumables with active/stowed loadout and inventory support; selector-backed
identity choices with in-sheet SRD reference panels; starter templates that seed
supported starting stats and inventory; in-sheet browse libraries with direct apply
actions; and deterministic passive automation (active armor derives Armor Score and
damage thresholds, equipped weapons enforce burden and slot rules, supported passive
domain-card bonuses apply only from loadout).

**Status**: Triggered, timing-based, rest-based, choice-based, and narrative effects
remain manual/reference, bounded by the existing metadata model.

## 📊 Quality Gates

`npm run verify` is the whole gate, and CI runs it on every pull request and every
push to `main` — the workflow is `.github/workflows/ci.yml`, and its run history is
the standing authority for what is currently green. No commit SHA is pinned here on
purpose: one that was rotted through 64 merges before anyone noticed.

The verification line under **Project Status** is the recorded baseline for a full
local pass. It is written by `npm run record:verify-baseline` into
`docs/generated/verification-baseline.json` and mirrored into this file by
`npm run check:doc-drift` — so it cannot silently drift, but it is a *recorded* pass,
not a live status badge.

| Property | Where it is enforced |
|---|---|
| Build, lint (0 warnings), strict TypeScript | `npm run verify` |
| Unit + e2e tests with coverage thresholds | `npm run verify` |
| Bundle-size budgets (gzip) | `scripts/check-bundle-size.mjs` |
| Open-content compliance | `src/utils/openContentPolicy.ts` |
| Documentation accuracy | `npm run check:doc-drift` |
| Generated metrics freshness | `npm run check:generated-docs` |

`package.json` is the authority on exactly which steps `npm run verify` chains and
in what order. `CONTRIBUTING.md` describes how to work the gate; this file does not
duplicate the list, because prose copies of it have drifted twice.

**Completion methodology**: every system is measured on two denominators —
**content%** (Denominator A: `docs/generated/srd-coverage.md`, a reverse diff of the
loaders against open-content SRD entry indexes fetched from **outside** this repo,
so shipping more content cannot move the denominator) and **compute%**
(Denominator B: `docs/compute-register/` registers of every derived quantity, counted
verified only when test-linked, passing, and mutation-proven via
`npm run check:compute-register`). Both are reported per system in
`docs/generated/roadmap-metrics.md`; manual/reference-only boundaries are enumerated
in `docs/srd-manifest/_exclusions.ts` so the metric is never gamed by fake automation.

Content% used to be measured against the loader-derived catalogs in
`docs/srd-manifest/`, which was circular — those catalogs are *generated from* the
loaders, so every category could only read 100%. They were demoted to
provenance-only on 2026-07-27; see `docs/srd-manifest/README.md` and `docs/GAPS.md`
§6. See also `docs/STATUS.md`.

## 🔍 5e Class-Data Validation

```bash
npm run validate
```

`npm run validate` runs the D&D 5e (2014) class-data validator (progressions, proficiency consistency, spell-slot arrays, multiclass rules). Cross-system data invariants are enforced by per-system validation tests in `src/__tests__/` (run via `npm test`) and by the full `npm run verify` gate.

## 📚 Documentation

Start with [docs/README.md](docs/README.md) — it states the authority order, the
reading order for a new session, and the gate-defined order of operations for
changing anything documented. The map below is a shortcut, not a second index.

- **docs/VISION.md** — project thesis and long-horizon direction (the *why*)
- **docs/MASTER_PLAN.md** — canonical roadmap and planning authority
- **docs/STATUS.md** — current-state summary
- **docs/GAPS.md** — outstanding gaps and the GLOBAL DONE criteria
- **docs/rfc/** — accepted decision records, 001–007 (backend sync, AI control plane, rules IR & effects, monster product surface, resource pools, scene runtime, AI-DM runtime)
- **docs/generated/** — machine-written metrics and coverage; never hand-edited
- **docs/runbooks/** — operational procedures: `docs/runbooks/local-data-recovery.md`, `docs/runbooks/supabase-backup-restore.md`, `docs/runbooks/sentry-alerts.md`
- **docs/history/** — archived superseded planning documents, banner-marked and never updated
- **CONTRIBUTING.md** — developer guide, environment requirements, and engineering standards

## 🛠️ Development Guide

### Adding Content (any system)
Each system's SRD data lives under `src/data/` (see Project Structure) — e.g. `src/data/dnd/5e-2014/`, `src/data/pathfinder/2e/`, `src/data/daggerheart/1.0/`, `src/data/mutants-and-masterminds/3e/`.

1. **Encoder-emitted families** (spells, monsters/adversaries, equipment) are regenerated via the matching `scripts/encode-*.mjs` encoder — do not hand-edit those files.
2. **Hand-maintained families** (e.g. classes) follow the existing entries in the target system's tree — for 5e-2014 classes that means a directory under `src/data/dnd/5e-2014/classes/` with an `index.ts` base class, using existing classes as templates.
3. Every entry must carry an allowed open-content source string, enforced per system by `src/utils/openContentPolicy.ts`. Original content that has no SRD counterpart must be labelled as such through the policy's separate original-content channel, never through the SRD allowlist.
4. Then run `npm run validate` (5e-2014 class data), `npm test`, and `npm run roadmap:metrics` to refresh the generated counts.

### Type Safety
All D&D 5e proficiencies use standardized constants from `src/constants/proficiencies.ts`:

```typescript
import { WeaponProficiency, ArmorProficiency, Skill } from './constants/proficiencies';

weaponProficiencies: [WeaponProficiency.SIMPLE, WeaponProficiency.MARTIAL]
```

## 📜 Legal & Licensing

This project uses only open-license reference content, filtered at load time by source attribution.

- ✅ D&D and Pathfinder content is limited to the allowed SRD/core source strings enforced in `src/utils/openContentPolicy.ts`
- ✅ Daggerheart content is limited to **Daggerheart SRD 1.0** / **System Reference Document 1.0** source strings
- ✅ No product-identity text is intentionally shipped outside the allowed open-content sources
- ✅ Loader-backed content is source-filtered before reaching the product UI
- ✅ Original (non-SRD) content ships only under an explicit non-SRD label, through a channel separate from the SRD allowlist, and is disclosed in `src/legal/attributions.ts`

Upstream source URLs and licenses for every system are catalogued in
`docs/srd-sources.md`. See also `src/utils/openContentPolicy.ts` and
`docs/generated/roadmap-metrics.md`.

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) first — it covers the environment, the gate,
and the engineering standards. In short:

1. Follow existing code patterns
2. Ensure all data passes validation and carries a correct source label
3. Add tests for new features
4. Update the paired documentation (`npm run check:doc-drift` enforces the pairing)
5. Run `npm run verify` before opening a PR

## 📦 Dependencies

- **React** — UI framework
- **TypeScript** — type safety
- **Vite** — build tool
- **TailwindCSS** — styling
- **shadcn/ui-inspired** — UI components

Exact versions live in `package.json`.
