# docs/rfc/ — accepted decision records

Seven RFCs, all Accepted. Each one records **a decision**: the context that forced
it, the options weighed, the choice made, and the constraints that choice imposes
on everything built afterwards.

**An RFC does not own rollout status.** `docs/MASTER_PLAN.md` does. When an RFC
here states what has shipped, the statement is dated and was checked against code
on that date — it is an observation with a shelf life, not a tracker. Where an RFC
and the plan disagree about status, the plan wins; where they disagree about a
decision, that is a bug in one of them and worth reporting. See `docs/README.md`
for the full authority ladder.

Every RFC carries the same header block: **Status**, **Date**, **Author**,
**Supersedes**, and **Implementation status lives in**. Add new RFCs with that
block, and register the file in `docs/doc-drift.manifest.ts` or the drift check
fails.

## The seven

| # | Decision | Accepted |
|---|---|---|
| [001](001-backend-sync.md) | Cloud sync is **additive**: browser-local stays the default and the offline fallback, with an optional Supabase backend behind RLS. | 2026-04-21 (retrospective) |
| [002](002-ai-control-plane.md) | AI enters only through task-specific surfaces behind a server-side gateway. **The model proposes, deterministic validators decide** — no model writes state, no browser-bundled provider secret, keyless deploys degrade to manual tools. | 2026-05-01 |
| [003](003-rules-ir-and-effects.md) | One system-independent effect IR and one deterministic resolver, cross-system from the first commit rather than piloted in 5e. The contribution-ledger row and a resolver effect are the same primitive, so computing a value and explaining it stop being two code paths. | 2026-05-31 |
| [004](004-monster-product-surface.md) | Override the "no monster product surface" boundary for D&D 3.5e and Pathfinder 1e, conditioned on loader-backed, source-tagged, policy-compliant data landing in the same change-set as the claim. | 2026-07-21 |
| [005](005-resource-pools.md) | One system-agnostic bounded-pool primitive with clamped verbs (`spend` / `restore` / `reset` / `consume`) — the stateful counterpart to 003's static derivation. Equip and non-numeric capacity rules deliberately stay per-system. | 2026-06-17 |
| [006](006-scene-runtime.md) | Scenes are event-sourced: current state is the pure fold of an initial state plus an append-only log, all randomness seeded, and the only way state changes is intent → validate → append. Event types are append-only and additive. | 2026-06-17 (retrospective) |
| [007](007-ai-dm-runtime.md) | The AI-DM is the **loop** form of 002's contract, not a second rules engine: it emits proposals through the same intent boundary a player click uses, and the validator veto is total. Target design; nothing implemented. | 2026-07-21 |

001, 004, and 006 were accepted after the work they describe had already shipped.
That is recorded in each, and is itself a finding rather than a footnote — the
order of operations in `docs/README.md` exists to stop it recurring.

## Reading order

003 and 005 are the pair that makes the rest coherent: 003 is how character state
*derives* to a value, 005 is how a verb *changes* that state. 006 is the runtime
those two feed. 002 is the seam AI attaches to, and 007 is the only RFC describing
something that does not exist yet. 001 and 004 are self-contained.
