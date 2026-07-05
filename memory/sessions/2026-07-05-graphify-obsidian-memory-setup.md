# 2026-07-05 — Graphify + Obsidian memory setup

**Branch:** `claude/claude-obsidian-graphify-research-d8ufwc`

## What was done

Researched the Claude Code + Obsidian + Graphify workflow (deep-research pass over
~19 sources, adversarially verified), then implemented it:

1. **Knowledge graph** — installed graphify 0.9.6 (`pip3 install --user graphifyy`),
   added `.graphifyignore` (excludes `src/data/` generated SRD tables, markdown/media,
   lockfiles), ran `graphify extract .` → 4,052 nodes / 11,742 edges from 665 code
   files, pure local AST, no API key. Clustered into 178 communities and named them
   with the `claude-cli` LLM backend (e.g. "Daggerheart Engine", "System Registry &
   Renderer", "AI Encounter Drafting").
2. **Obsidian** — exported the per-symbol vault (4,229 wikilinked notes + canvas,
   gitignored, regenerate via `npm run graph:vault`) and the wiki (187 community
   articles, committed at `graphify-out/wiki/`, entry point `index.md`). Repo root
   opens as a vault; `.obsidian/` workspace config is gitignored.
3. **Claude Code wiring** — `graphify claude install` wrote the CLAUDE.md graphify
   section and PreToolUse hooks in `.claude/settings.json`. Hardened both hooks:
   they now also require graphify to be installed (not just graph.json present),
   and the Read/Glob nudge no longer fires on markdown/doc reads (docs and memory/
   are meant to be read directly; they're not in the graph). Added a SessionStart
   hook that background-installs `graphifyy` in fresh containers.
4. **Memory system** — root `CLAUDE.md` (architecture map, commands, memory
   protocol), `memory/hot.md` (rolling hot cache), `memory/sessions/` (this log),
   `/save` and `/resume` commands in `.claude/commands/`.
5. **Repo integration** — un-ignored `.claude/settings.json` + `.claude/commands/`
   in `.gitignore` (previously the whole `.claude/` dir was ignored); added
   `graph:update` / `graph:vault` / `graph:wiki` npm scripts.

## Decisions and why

- **Committed:** `graph.json` (5.5MB), community labels, `GRAPH_REPORT.md`, wiki —
  so fresh remote containers and the local clone have working memory without a
  rebuild. **Gitignored:** the 18MB/4,229-file per-symbol vault, `graph.html`,
  cache — regenerable in seconds; committing them would swamp every future PR diff.
- **Graph is code-only** (no docs ingestion) so `graphify update .` stays keyless
  and deterministic. Docs ingestion via `--backend claude-cli` is a possible
  follow-up experiment.
- **`src/data/` excluded from the graph**: 505 generated files with no
  architectural signal would have dominated the node count.

## Verification

- `graphify query "how does spell data flow into the character sheet across game
  systems"` returns a scoped, community-labeled subgraph with file:line refs.
- Hook simulation: grep command → nudge; `.tsx` read → nudge; `.md` read → silent.
- Repo checks run before commit (see commit message).

## Follow-ups

See [[hot]] → Next steps.
