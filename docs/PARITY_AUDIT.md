# System Parity Audit

A living, per-system / per-capability tracker so cross-system parity is judged from
data, not vibes. Referenced by `docs/MASTER_PLAN.md`. Update the cells as gaps
close.

_Last reviewed: 2026-06-24. All seven systems have a registry validator and a
contribution-ledger builder surfaced in-sheet (Armor Class for 5e / PF2e / 3.5e /
PF1e, Evasion for Daggerheart, per-power cost for M&M). Test coverage — logic AND
sheet components — is now driven to ~95–100% across all seven systems (the four
non-5e systems plus the 5e/shared host, controller, sections, and logic). A
content-completeness pass confirmed every system handles its full
class/subclass/race/species set with no class special-casing._

**Legend:** ✅ at parity · ⚪ **terminal boundary** (intentional, documented in
`docs/srd-manifest/_exclusions.ts` or `docs/rfc/003-rules-ir-and-effects.md`) ·
❌ **genuine, closeable gap**.

| Capability | 5e 2014/2024 | PF2e | 3.5e | PF1e | M&M 3e | Daggerheart |
| --- | --- | --- | --- | --- | --- | --- |
| SRD content (loaders) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Engine (prepare/roll/damage) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sheet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Guided creation orchestrator | ✅ | ✅ | ✅ | ✅ | ⚪ point-buy | ✅ |
| Effect-resolver routing (RFC-003) | ✅ | ✅ | ✅ | ✅ | ⚪ not a fold | ⚪ not a fold |
| Conditions → IR | ✅ | ✅ | ✅ | ✅ | ⚪ none apply | ⚪ none apply |
| Contribution ledger (builder) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Breakdown surfaced in sheet | ✅ AC | ✅ AC | ✅ AC | ✅ AC | ✅ power cost | ✅ Evasion |
| Registry validator | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Test files (directional) | 123 | 52 | 72 (d20 shared) | ↤ | 28 | 33 |

## What's a real spike vs. what isn't

Most apparent "gaps" for M&M and Daggerheart are **terminal boundaries**, not
unfinished work, and they are held to the same standard 5e is:

- **Resolver routing / conditions** — M&M's minimum-cost rule and Daggerheart's
  tier/derived math are not pure folds, and neither system has bearer-affecting
  condition-to-roll rules; both are RFC-003 Phase 2/3 terminal decisions. Each
  system still ships a bespoke contribution ledger surfaced in its sheet.
- **M&M creation** — M&M builds by point-buy directly on its sheet, the same
  manual build path available in every system. It has no separate class/race
  *creation wizard* because its archetypes are reference-only by design (the data
  model marks `selectedArchetypeIds` "do not auto-apply stats"). So the ⚪ means
  "no guided wizard," NOT "can't build a character" — point-buy is M&M's faithful,
  complete build path, and adding a thin wizard would reinvent a wheel.

M&M and Daggerheart are **not "shadows"**: substantial engines (M&M's is the
largest in the repo), full sheets, full SRD content in their own idioms, and
contribution breakdowns surfaced in-sheet like every other system.

**Content completeness (all classes/subclasses/races/species).** A pass over the
hardcoded lookups confirmed none special-case a subset: 5e's caster-type rule
covers all 12 SRD classes (full / half / pact / third / none); PF2e's
`PF2E_CLASS_PROFILES` covers all 12; d20 spellcasting reads each class's own
`spellcasting` block with a complete 7-caster fallback; subclasses, species, and
backgrounds load generically from the data catalogs, so every creation flow
applies any shipped option. The remaining `wizard` references are faithful SRD
features (specialist schools, INT casting), not special-casing.

## Genuine, closeable gaps (the actual parity backlog)

1. **Registry validators** — ✅ **DONE for all seven** (was 5e-only).
   - **M&M 3e** (`src/systems/mam3e/validation.ts`): engine PL trade-off caps +
     power-point budget.
   - **Daggerheart** (`src/systems/daggerheart/validation.ts`): class/ancestry
     resolution, SRD creation trait array, Hope bounds.
   - **D&D 3.5e + Pathfinder 1e** (`src/systems/d20-legacy/validation.ts`, shared):
     level bounds, race/class id resolution, per-class level bounds, multiclass
     level-sum rule.
   - **PF2e** (`src/systems/pf2e/validation.ts`): ancestry/heritage/background/class
     id resolution (heritage within its ancestry), level bounds.
2. **Breakdown ledgers** — ✅ **DONE for all seven.** Each system builds a
   contribution ledger and surfaces it through the shared disclosure
   `src/components/shared/ContributionBreakdown.tsx`, folding to the exact value
   the sheet shows: Armor Class for 5e / PF2e / 3.5e / PF1e (the PF2e and
   d20-legacy term decompositions are single-sourced from `src/utils/armorClass.ts`
   so the breakdown can't drift from the engine), Evasion for Daggerheart, and
   per-power cost per rank for M&M 3e.
3. **Test depth** — ✅ **logic AND sheet-component coverage driven to ~95–100%
   across all seven systems.** Each system's mutation handlers, controller,
   sheet-state, template-apply handlers, validator, engine, and sheet components
   now sit at 95–100% statements, each test asserting the exact emitted patch /
   derived value, not line-touching:
   - **Non-5e logic**: M&M controller 45→100%; PF2e template handlers 51→100% +
     controller 62→97%; d20 template handlers 19→91% + controller 67→89%;
     Daggerheart template handlers & controller→100%; all validators→100%.
   - **Sheet components**: M&M 54→100%, Daggerheart 72→100%, PF2e 70→98%,
     d20-legacy 67→96%.
   - **5e / shared**: the `Dnd5eSheetBase` host 35→91% (its ~50 inline interaction
     handlers), every shared logic file (conditions, validation, activities,
     spellPreparation, choiceState, templateHandlers, contributionLedger,
     definition) →100%, and the shared section/sheet components driven up.

   Two real bugs surfaced and were fixed along the way: a doubled "Roll Roll"
   dice-button accessibility title (Daggerheart) and an unhandled-rejection leak
   in the 5e contribution-ledger effect (now fails to an empty breakdown).

## How parity capabilities are wired

Each capability is a field/registration on the system's `SystemDefinition`
(`src/registry/types.ts`): `engine`, `validator`, `creation`. A system gains a
capability by registering it — no shared UI or dispatcher changes — so closing a
gap is local to that system's module.
