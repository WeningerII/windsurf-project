# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-05 (session: memory setup + PR #27 steward)

## Current focus

Agent-memory infrastructure lives on branch
`claude/claude-obsidian-graphify-research-d8ufwc` (knowledge graph, Obsidian
wiki, CLAUDE.md, hooks, this memory system) — now merged up with post-#27
`main` and ready to merge itself. **PR #27 (launch-blocker instruments) is
MERGED** after two CI fixes made from this session (details in the 2026-07-05
session log).

## State of the repo

- `main` now includes PR #27: legal notices (LICENSE/NOTICE/attributions +
  gates), compute-register three-tier verification gate, outcome-baseline e2e
  harness, master gap ledger, dice/engine-math wiring.
- Code graph is fresh over merged main: 4,180 nodes / 12,009 edges / 170
  LLM-named communities from 680 code files (`src/data/` excluded via
  `.graphifyignore`). Freshness hash in `graphify-out/GRAPH_REPORT.md`.
- Docs corpus is *not* in the graph (needs LLM backend; deferred experiment).
- Per-symbol Obsidian vault is gitignored; regenerate with `npm run graph:vault`.

## Known landmines (learned 2026-07-05)

- `docs/generated/compute-register-gate.json` is transient+gitignored by
  design — never reference it as a repo path in docs or `path_ref_rule` fails
  CI (that's what originally blocked PR #27).
- e2e locators drift silently: UI copy renames don't fail any drift gate
  (f6aa80a renamed the campaign-notes placeholder and broke system-smoke
  latently for 17 days). Grep e2e/ for old strings when renaming user-facing
  copy.

## Next steps

1. Merge this branch (memory + graph infra) after review.
2. Use the graph on a real cross-system task and record outcomes with
   `graphify save-result --outcome useful|dead_end`; `graphify reflect` after
   a few sessions.
3. Consider ingesting `docs/` into the graph via the `claude-cli` backend.

## Open questions

- Does the PreToolUse nudge help or annoy? (Observed in-session: it fires
  correctly and stays out of the way for md reads. Fails open; removable in
  `.claude/settings.json`.)
- Should `graphify update .` be wired into `npm run verify` or a git hook
  (`graphify hook install`) instead of relying on /save discipline?
