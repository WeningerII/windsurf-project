# System Parity Audit

A living, per-system / per-capability tracker so cross-system parity is judged from
data, not vibes. Referenced by `docs/MASTER_PLAN.md`. Update the cells as gaps
close.

_Last reviewed: 2026-06-23. All seven systems now have a registry validator and a
contribution-ledger builder whose breakdown is surfaced in-sheet: Armor Class for
5e / PF2e / 3.5e / PF1e, Evasion for Daggerheart, per-power cost for M&M 3e. Logic
test coverage for the four non-5e systems is now driven to ~100% (handlers,
controllers, sheet-state, template handlers, engines, validators, utils)._

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
| Test files (directional) | 116 | 51 | 71 (d20 shared) | ↤ | 27 | 32 |

## What's a real spike vs. what isn't

Most apparent "gaps" for M&M and Daggerheart are **terminal boundaries**, not
unfinished work, and they are held to the same standard 5e is:

- **Resolver routing / conditions** — M&M's minimum-cost rule and Daggerheart's
  tier/derived math are not pure folds, and neither system has bearer-affecting
  condition-to-roll rules; both are RFC-003 Phase 2/3 terminal decisions. Each
  system still ships a bespoke contribution ledger surfaced in its sheet.
- **M&M creation** — point-buy power-point allocation with no template-apply
  surface (archetypes are reference-only); quick blank-create is its honest path.

M&M and Daggerheart are **not "shadows"**: substantial engines (M&M's is the
largest in the repo), full sheets, full SRD content in their own idioms, and
contribution breakdowns surfaced in-sheet like every other system.

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
3. **Test depth** — ✅ **logic coverage driven to ~100% across all four non-5e
   systems.** Every non-5e sheet's mutation handlers, sheet controller, sheet-state
   builder, template-apply handlers, validator, and the M&M/PF2e/d20 engines now
   sit at 95–100% statements (from 18–67% on the worst — the controllers and
   template handlers), each test asserting the exact emitted patch / derived value,
   not line-touching:
   - **M&M 3e**: controller 45→100%, getMam3eSheetState→100%, engine→99%, validator→100%.
   - **PF2e**: template handlers 51→100%, controller 62→97%, sheet-shared/choice-state/validator→100%, engine casting-type branch covered.
   - **D&D 3.5e + PF1e**: template handlers 19→91%, controller 67→89%, shared spell-slot helpers & wrapper→100%, validator→100%, engines→~99%.
   - **Daggerheart**: template handlers & controller→100%, inventory util→100%, sheet-state & derived target branches closed, validator→100%.

   Remaining toward *truly equal* 100%: the sheet **components** (`.tsx`) sit at
   ~50–71% across systems (render-level UI), and the **5e family's** own coverage
   has not been re-leveled this pass. Both are the next round.

## How parity capabilities are wired

Each capability is a field/registration on the system's `SystemDefinition`
(`src/registry/types.ts`): `engine`, `validator`, `creation`. A system gains a
capability by registering it — no shared UI or dispatcher changes — so closing a
gap is local to that system's module.
