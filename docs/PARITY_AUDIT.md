# System Parity Audit

A living, per-system / per-capability tracker so cross-system parity is judged from
data, not vibes. Referenced by `docs/MASTER_PLAN.md`. Update the cells as gaps
close.

_Last reviewed: 2026-06-23. All seven systems now have a registry validator and a
contribution-ledger builder whose breakdown is surfaced in-sheet: Armor Class for
5e / PF2e / 3.5e / PF1e, Evasion for Daggerheart, per-power cost for M&M 3e._

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
| Test files (directional) | 116 | 47 | 67 (d20 shared) | ↤ | 24 | 27 |

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
3. **Test depth** — non-5e systems trail 5e; M&M/Daggerheart are thinnest.

## How parity capabilities are wired

Each capability is a field/registration on the system's `SystemDefinition`
(`src/registry/types.ts`): `engine`, `validator`, `creation`. A system gains a
capability by registering it — no shared UI or dispatcher changes — so closing a
gap is local to that system's module.
