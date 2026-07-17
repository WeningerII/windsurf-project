# Contributing Guidelines

**Last Updated**: May 30, 2026

How to work in this repo: a local-first, SRD-only, multi-system RPG character
sheet (React + Vite + TypeScript, optional Supabase sync, Netlify deploy).
`docs/MASTER_PLAN.md` is the sole planning authority — this file is the
engineering guide for the code itself. Keep it short and accurate; if an
example here ever stops matching the codebase, fix the example.

## Environment Requirements

- Node.js 20.19+ (or 22.12+ / 24+). The test stack depends on this runtime.
- `.nvmrc` and `.node-version` both pin `20.19.0`.
- Manager path: use your preferred version manager to match the repo pin, then run normal `npm install` / `npm run verify` flows.
- Bootstrap path: on host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>` if no version manager is available.
- Manual fallback: if the host shell is below Node 18 or has no usable Node install, install Node `20.19.0` directly or fix the version manager before working in the repo.
- `npm run test:coverage` is stricter than plain `npm test`: `@vitest/coverage-v8` requires `node:inspector/promises`, so Node 18 shells fail before any tests execute.
- `npm run runtime:doctor` is the first stop when local Node policy, cached bootstrap runtime, or CI/runtime drift looks suspicious.

## Verification Is the Gate

`npm run verify` is the single source of truth for "is this change OK", and CI
runs it on every pull request. It chains, in order: Node-version check, ESLint
(`--max-warnings 0`), test/config type-check (`tsc -p tsconfig.test.json`),
Prettier check, coverage-gated Vitest, data validation, production build,
bundle-size budget, Playwright e2e, repo-hygiene, generated-docs, doc-drift,
and dead-code (`knip`). Run it before opening a PR.

- Current baseline: run `npm run verify` under Node `20.19+` and capture exact counts from the command output.
- Latest recorded full pass: May 30, 2026 under Node `v20.19.0`. Treat the exact Vitest and Playwright totals as command output, not a hardcoded invariant in this file.
- Update `docs/generated/verification-baseline.json` via `npm run record:verify-baseline -- --date "Month DD, YYYY" --node-version 20.19.0 [...]`; `npm run check:doc-drift` enforces the mirrored live-doc verification claims.
- `npm run verify` includes `check:doc-drift` after `check:generated-docs`; keep live docs, historical banners, workflow/runtime claims, and audited support-honesty copy aligned with the registered truth sources.

## Documentation & Reporting Truth

- `docs/MASTER_PLAN.md` is the sole planning authority. If a roadmap statement in another doc drifts, update that doc to point back to the master plan instead of creating a competing backlog.
- When you make a previously repo-only content family product-reachable, wire it through a loader first and rerun `npm run roadmap:metrics` so `docs/generated/roadmap-metrics.*` stays aligned with runtime reality.
- Precise counts live in `docs/generated/roadmap-metrics.md` (generated); narrative docs summarize and cite them, never compete with them.
- Spell datasets use normalized `spells/index.ts` catalog surfaces plus `spellIdAliases`. When canonicalizing spell ids or collapsing duplicates, preserve alias compatibility, rerun the spell parity suites, and regenerate roadmap metrics if the canonical counts change.
- Legacy d20 spell metadata is source-strict. If a D&D 3.5e source URL cannot be resolved or a PF1e source page lacks a Saving Throw row, document the exact exception in `spellCatalogParity.test.ts`; do not infer metadata to satisfy a coverage floor.

## Core Principles

- **Single source of truth.** Every piece of data lives in exactly one file. Never create `*-expanded.ts` / `*-v2.ts` companions — merge into the canonical file. Name files for their complete contents (`level-4.ts`, not `comprehensive-spells.ts`).
- **Delete before adding.** Search for an existing home before creating a file. `knip` (`npm run check:dead-code`) fails the build on orphan modules and unused dependencies, so dead weight cannot accumulate.
- **Clarity over cleverness.** Code is read far more than written. Prefer obvious to compact.
- **Anti-overengineering.** Do not introduce a shared controller/form/section/validation abstraction until at least 3 concrete consumers share the same shape, with an explicit extraction target. System-local code is preferred until then (mirrors `docs/MASTER_PLAN.md`).
- **Make illegal states unrepresentable.** Reach for discriminated unions and narrow types over loose records with optional flags.
- **Parse, don't cast, at boundaries.** Untrusted input — imported JSON, browser storage, Supabase rows — must go through the guards in `src/utils/boundaryValidation.ts`, not a bare `as` cast. Malformed records are rejected with a structured issue, never silently trusted.

## Architecture

Data → Logic → Presentation:

```
src/
├── data/         # Pure SRD data, no logic (source-filtered at load)
├── registry/     # SystemRegistry + engine/validator contracts
├── systems/      # Per-system definitions, engines, sheets, controller hooks
├── utils/        # Loaders, templates, storage, sync, reporting helpers
├── hooks/        # App and system-local state orchestration
├── components/   # React UI
└── types/        # Contracts between layers
```

- **Document & Data Model.** A `CharacterDocument` is a generic container (id, name, `systemId`, metadata) wrapping a system-specific `system` payload. The core app manages the container; the registered `SystemEngine` owns the rules.
- **Registry dispatch.** `src/registry` maps `systemId` → `SystemDefinition` (`createDefaultData`, `engine`, optional `validator`, `SheetComponent`). `App.tsx` creates documents and `SystemSheetRenderer` dispatches to the per-system sheet.
- When generating new ids in UI flows, use `generateUUID` from `src/utils/browserCompat.ts`.
- Document the "why" behind non-obvious constants and trade-offs, not the "what".

## Performance

- **Local-first.** The app must work fully signed-out and with Supabase env vars unset; cloud sync is additive, never required.
- **Lazy-load system data.** Per-system SRD catalogs load on demand through the async loaders in `src/utils/dataLoader.ts`; do not pull large catalogs (`spells`, `monsters`, `feats`) into the eager import graph.
- **Bundle budgets** are enforced by `scripts/check-bundle-size.mjs` (gzip): app chunk <80KB, vendor <200KB, largest system-data chunk <140KB, total JS <800KB. Stretch: per-system data <100KB.

## Code Standards

- **TypeScript strict**, always. Avoid `any` — use `unknown` and narrow. No `@ts-ignore`/`@ts-expect-error` without an inline comment explaining why.
- **ESLint** runs with `--max-warnings 0` and enforces `no-console` / `no-debugger`; any `eslint-disable` needs an inline justification.
- **Prettier** owns formatting (`npm run format`).
- Document exported functions/types with JSDoc where intent isn't obvious. Generate API docs with `npm run docs`.

## SRD / Open-Content Compliance

This project ships **only** SRD / open-license content. Before adding any:

1. Verify it exists in the official SRD for that system.
2. Add a source comment (e.g. `// Source: SRD 3.5`).
3. The allowed source strings are enforced at load time by `src/utils/openContentPolicy.ts`; content that isn't source-tagged is filtered out before reaching the UI.
4. If a content family is shown as product support, it must be loader-backed and reflected in `docs/generated/roadmap-metrics.md`.

## Testing

- Vitest specs live in `src/__tests__/`; Playwright e2e specs live in `e2e/`. Tests are **not** co-located with source.
- Test behavior, not implementation; cover edge and error cases before the happy path.
- Every data file should have a validation test (unique ids, required fields, level/shape invariants). `npm run validate` currently runs the D&D 5e (2014) class-data validator (`src/scripts/validate-classes.ts`); data checks for the other systems live as Vitest data tests in `src/__tests__/` and run via `npm test` and the coverage gate.
- Coverage thresholds are enforced on `npm run test:coverage` (see `vitest.config.ts`).

## Pull Requests

Before opening a PR:

```bash
npm run verify   # the whole gate (lint, type-checks, tests+coverage, e2e, doc-drift, dead-code, ...)
```

A good PR is small and focused, SRD-compliant, fully covered by tests, and free
of duplicate/`*-expanded.ts` files. CI re-runs `npm run verify` on every PR;
keep it green.
