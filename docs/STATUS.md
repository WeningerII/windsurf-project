# Project Status

This file is a current-state summary only. `docs/MASTER_PLAN.md` is the sole planning authority, and `docs/generated/roadmap-metrics.md` remains the authoritative count source.

**Last repo-wide verification:** April 21, 2026 via `npm run verify` under Node `20.19.0`

## Current Product Snapshot

- 7 registered systems are live in the registry.
- Netlify is the canonical deployment target.
- The app is local-first with an optional cloud sync layer. Signed-out and unconfigured paths remain pure browser-local (IndexedDB primary, localStorage fallback, dual-write persistence). Signed-in users on a configured Supabase project get per-user document and campaign sync with offline queueing, realtime change propagation, and exponential-backoff retry. See `docs/rfc/001-backend-sync.md` for the shipped design.
- Loader-backed counts, support levels, and source-filtered categories are generated from the runtime data/reporting path.
- Spell catalogs across 5e, D&D 3.5e, PF1e, and PF2e now share normalized index surfaces with alias-safe lookup, and the shared spell browser now derives its level filter from loaded data instead of a hardcoded `0-9` list.
- Shared controller/section-host convergence is shipped across 5e, PF2e, legacy d20, M&M, and Daggerheart. The remaining shared-host work is localized cleanup and documentation, not another decomposition push.

| System | Support level | Current slice |
| --- | --- | --- |
| D&D 5e (2024) | Full | Shared 5e host, subclass selection, feat ASI/proficiency automation, structured always-prepared support with explicit unresolved/manual boundaries |
| D&D 5e (2014) | Full | Shared 5e host, feature-option browsing/persistence, provenance-first downstream effects, structured always-prepared support with explicit manual riders |
| Pathfinder 2e | Full | Native sheet, loader-backed backgrounds/archetypes, native prepared-slot persistence, structured always-prepared surfacing, dynamic rank-10 spell browsing, cantrip/focus edges still manual |
| D&D 3.5e | Partial | Shared legacy host, full core prestige catalog is selectable, canonical 501-spell loader-backed catalog, Vancian tracked/prepared spell workflow with explicit manual boundaries |
| Pathfinder 1e | Partial | Shared legacy host, vetted prestige support is product-reachable, raw `levelsByClass` now live in spell files, Vancian tracked/prepared spell workflow with explicit manual boundaries |
| M&M 3e | Full | Native point-buy sheet with pinned archetypes, complication insertion, and modifier math/PL-cap enforcement |
| Daggerheart | Partial | Native sheet with selectors, domains, domain cards, equipment, loadouts, and deterministic passive automation with explicit manual/reference boundaries |

## Top Active Tracks

- Selection-heavy regression expansion across shared spell-prep behavior, 5e feature options, PF prestige/archetype state, M&M pinned references, and Daggerheart persistence flows
- Spell-level file parity across 5e 2014/2024, D&D 3.5e, PF1e, and PF2e, with the remaining work now concentrated in raw metadata depth and the last legacy duplicate groups
- Final shared 5e host cleanup/documentation pass plus support-honesty maintenance for unsupported spell and feature edges
- Deterministic-only Daggerheart automation follow-up and regression expansion

## Source Of Truth

- `docs/MASTER_PLAN.md` - canonical roadmap and planning classifications
- `docs/generated/roadmap-metrics.md` - generated product-reachable counts and repo-resident audit
- `README.md` - public product overview
- `CONTRIBUTING.md` - engineering policy and workflow guardrails
