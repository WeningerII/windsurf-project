# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-05 (session: graphify + Obsidian memory setup)

## Current focus

Agent-memory infrastructure just landed on branch
`claude/claude-obsidian-graphify-research-d8ufwc`: knowledge graph
(graphify 0.9.6), Obsidian-browsable wiki, CLAUDE.md, hooks, and this memory
system. Not yet merged to `main`.

## State of the repo

- Code graph: 4,052 nodes / 11,742 edges / 177 LLM-named communities, built from
  665 code files (SRD data in `src/data/` deliberately excluded — see
  `.graphifyignore`). Committed at `graphify-out/graph.json`; freshness commit
  hash is recorded in `graphify-out/GRAPH_REPORT.md`.
- Docs corpus (42 files, MASTER_PLAN/STATUS/RFCs) is *not* in the graph —
  ingesting it needs an LLM backend (`graphify extract . --backend claude-cli`
  would work); deferred as an experiment.
- Per-symbol Obsidian vault is gitignored; regenerate with `npm run graph:vault`.

## Next steps

1. Merge this branch after review.
2. Use the graph on a real cross-system task (e.g. a parity-audit item from
   `docs/EVIDENCE_LINKED_PARITY_AUDIT.md`) and compare effort vs. before;
   record the outcome with `graphify save-result --outcome useful|dead_end`.
3. After a few sessions, run `graphify reflect` to generate
   `graphify-out/reflections/LESSONS.md` and commit it.
4. Consider ingesting `docs/` into the graph via the `claude-cli` backend.

## Open questions

- Does the PreToolUse nudge help or annoy in practice? (It fails open and can be
  removed from `.claude/settings.json` if it gets noisy.)
- Graph staleness discipline: is `graphify update .` after each code-changing
  session enough, or should it be wired into `npm run verify`?
