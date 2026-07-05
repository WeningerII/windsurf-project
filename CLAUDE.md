# CLAUDE.md

Multi-system tabletop RPG character sheet + scene toolkit. TypeScript + React 18 +
Vite + Tailwind; Supabase sync; Netlify deploy; Vitest + Playwright. Deterministic
rules core shared by 7 game systems. ~400k LOC, but most of it is generated SRD
data — orient with the knowledge graph (see "graphify" section below), not grep.

## Memory protocol — read this first

1. Read `memory/hot.md` — rolling context from recent sessions (what's in flight,
   next steps). The `/resume` command does this plus freshness checks.
2. Orient in code via the knowledge graph: `graphify query "<question>"`, or browse
   `graphify-out/wiki/index.md`.
3. Before ending a substantial session, run `/save` to update memory so the next
   session (yours or the human's) starts warm.

If `graphify` is not on PATH: `pip3 install --user graphifyy`, then use
`~/.local/bin/graphify` or `python3 -m graphify`.

## Commands

- `npm run dev` — Vite dev server; `npm run build` — typecheck + build
- `npm test` — Vitest; `npm run test:e2e` — Playwright
- `npm run verify` — the full CI gate (lint, typecheck, format, coverage, build,
  bundle-size, e2e, repo-hygiene, generated-docs, doc-drift, dead-code). Run the
  individual `check:*` / `lint` / `typecheck:test` scripts while iterating.
- `npm run graph:update` — refresh the knowledge graph after code changes
  (AST-only, local, no API key)

## Architecture map

- `src/systems/<id>/` — per-system engines and sheets: `dnd5e`, `dnd5e-2024`,
  `dnd35e`, `pf1e`, `pf2e`, `mam3e`, `daggerheart`, `d20-legacy`, `shared`
- `src/data/` — GENERATED SRD data tables (505 files, the bulk of the LOC).
  Never hand-edit; regenerate via the `src/scripts/` encoders. Deliberately
  excluded from the knowledge graph (`.graphifyignore`).
- `src/rules/` — deterministic rules IR and combat resolution
- `src/scene/` — scene/encounter runtime (RFC 006)
- `src/ai/` — AI control plane (RFC 002): the model proposes, deterministic
  validators decide. Ships default-off behind `VITE_AI_ENABLED`; provider key
  lives server-side in `netlify/functions/ai-gateway.mts`.

## Where decisions and state live

- `docs/rfc/001–006` — architecture decision records
- `docs/MASTER_PLAN.md`, `docs/STATUS.md`, `docs/GAPS.md` — plan and current state
- `docs/generated/` — machine-generated metrics; never hand-edit (enforced by
  `npm run check:generated-docs` and `npm run check:doc-drift`)
- `memory/` — session-to-session working memory (see `memory/README.md`)

## Gotchas

- Doc drift is machine-checked: `docs/doc-drift.manifest.ts` pairs code with docs;
  touching documented behavior means updating the paired doc or CI fails.
- Repo hygiene, generated docs, and dead code (knip) are also CI-enforced —
  new files and scripts must pass `npm run verify`.
- Obsidian: open the repo root as a vault. `graphify-out/wiki/`,
  `graphify-out/GRAPH_REPORT.md`, and `memory/` are all linked markdown.
  `npm run graph:vault` materializes the full per-symbol vault (one note per
  function/class) at `graphify-out/obsidian/` — gitignored, regenerable.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
