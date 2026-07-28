# Contributing Guidelines

How to work in this repo: a local-first, SRD-only, multi-system RPG character
sheet (React + Vite + TypeScript, optional Supabase sync, Netlify deploy). This
file is the engineering guide for the code itself.

**Where authority lives is decided in `docs/README.md`** — it states which
document wins when two disagree, the reading order for a new session, and the
gate-defined order of operations for changing anything documented. Read it before
you change a doc. This file does not restate it.

Keep this file short and accurate; if an example here ever stops matching the
codebase, fix the example.

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
(`.github/workflows/ci.yml`) runs it on every pull request and every push to
`main`. Run it before opening a PR.

**The `verify` chain is defined in `package.json`, and that is the authority.**
Read it there rather than trusting a prose copy — narrative lists of this chain
have drifted twice. As of writing it is 21 steps, running roughly in this order:

1. **Runtime** — Node-version check.
2. **Static analysis** — ESLint (`--max-warnings 0`), test/config type-check
   (`tsc -p tsconfig.test.json`), Netlify-function type-check, Prettier check.
3. **Tests** — coverage-gated Vitest, then (after the build) Playwright e2e.
4. **Build & budgets** — data validation, production build, bundle-size budget,
   keepalive budget.
5. **Repo and doc integrity** — repo-hygiene, generated-docs, doc-drift,
   dead-code (`knip`).
6. **Content and provenance** — legal-notices, compute-register,
   rules-provenance, SRD fidelity, M&M equipment provenance, secret-exposure.

While iterating, run the individual `check:*` / `lint` / `typecheck:test` scripts
rather than the whole chain.

### Order of operations for a change

1. Change the code and get `npm run verify` green.
2. Update the paired documentation. `docs/doc-drift.manifest.ts` pairs documented
   behaviour with code; touching one without the other fails CI.
3. Regenerate anything under `docs/generated/` with the script that owns it
   (`npm run roadmap:metrics`, `npm run check:generated-docs`) — never by hand.
4. Follow `docs/README.md` § "Order of operations when you change something" for
   which planning documents to touch and in what order.

### The verification baseline

- Current baseline: run `npm run verify` under Node `20.19+` and capture exact counts from the command output.
- Latest recorded full pass: July 28, 2026 under Node `v20.19.0`. Treat the exact Vitest and Playwright totals as command output, not a hardcoded invariant in this file.
- Update `docs/generated/verification-baseline.json` via `npm run record:verify-baseline -- --date "Month DD, YYYY" --node-version 20.19.0 [...]`; `npm run check:doc-drift` enforces the mirrored live-doc verification claims.
- The baseline records a *local* pass. CI run history is the standing authority for what is currently green. **Never pin a commit SHA in prose** — one sat in three documents until 64 merges had passed it.
- `npm run verify` includes `check:doc-drift` after `check:generated-docs`; keep live docs, historical banners, workflow/runtime claims, and audited support-honesty copy aligned with the registered truth sources.

## Documentation & Reporting Truth

- `docs/README.md` states the authority order. `docs/MASTER_PLAN.md` is the sole planning authority. If a roadmap statement in another doc drifts, update that doc to point back to the master plan instead of creating a competing backlog.
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
├── rules/        # System-agnostic rules IR + effect resolution (RFC 003)
├── scene/        # Event-sourced scene/encounter runtime (RFC 006)
├── ai/           # AI control plane, default-off (RFC 002)
├── utils/        # Loaders, templates, storage, sync, reporting helpers
├── hooks/        # App and system-local state orchestration
├── components/   # React UI
└── types/        # Contracts between layers
```

- **Layer boundary (lint-enforced).** Shared layers (`src/rules/`, `src/scene/`,
  `src/utils/`, `src/components/`, ...) must not value-import from
  `src/systems/**` — systems import shared, never the reverse. Type-only imports
  are allowed. The exemptions (registry bootstrap, dataLoader, docDrift) are
  listed in `eslint.config.js`.
- **Document & Data Model.** A `CharacterDocument` is a generic container (id, name, `systemId`, metadata) wrapping a system-specific `system` payload. The core app manages the container; the registered `SystemEngine` owns the rules.
- **Registry dispatch.** `src/registry` maps `systemId` → `SystemDefinition` (`createDefaultData`, `engine`, optional `validator`, `SheetComponent`). `App.tsx` creates documents and `SystemSheetRenderer` dispatches to the per-system sheet.
- When generating new ids in UI flows, use `generateUUID` from `src/utils/browserCompat.ts`.
- Document the "why" behind non-obvious constants and trade-offs, not the "what".

## Performance

- **Local-first.** The app must work fully signed-out and with Supabase env vars unset; cloud sync is additive, never required.
- **Lazy-load system data.** Per-system SRD catalogs load on demand through the async loaders in `src/utils/dataLoader.ts`; do not pull large catalogs (`spells`, `monsters`, `feats`) into the eager import graph.
- **Bundle budgets** are enforced by `scripts/check-bundle-size.mjs` (gzip) over
  five ceilings: total JS, the eager first-paint shell, the app chunk, the vendor
  chunk, and the largest per-system data chunk. The numbers live in that file's
  `budgets` object — read them there, along with the comment explaining why each
  was last moved. Each is overridable per-run via a `BUNDLE_BUDGET_*` env var.
  The eager-shell and app-chunk ceilings are close to their measured values by
  design: the next real climb is meant to be paid by lazy-loading per-system
  engines, not by another bump.

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
npm run verify   # the whole gate; see "Verification Is the Gate" above
```

A good PR is small and focused, SRD-compliant, fully covered by tests, free of
duplicate/`*-expanded.ts` files, and lands its documentation change in the same
commit as the behaviour it describes. CI re-runs `npm run verify` on every PR;
keep it green.
