# memory/

Session-to-session working memory shared by the human maintainer and AI agents.
Everything here is plain markdown, wikilink-friendly, and browsable in Obsidian
(open the repo root as a vault).

## Layout

- **[[hot]]** (`hot.md`) — the hot cache: a ≤500-word rolling summary of what is
  in flight *right now*. Every session starts by reading it; substantial sessions
  end by rewriting it (`/save`). Stale content is overwritten, not appended —
  durable facts belong in `CLAUDE.md` or `docs/`.
- **`sessions/`** — append-only dated session logs (`YYYY-MM-DD-<slug>.md`):
  what was done, decisions and why, files touched, follow-ups. These are the
  long-term memory; `hot.md` is the working set.

## Division of labor (who remembers what)

| Layer | Contents | Maintained by |
|---|---|---|
| `CLAUDE.md` | Timeless conventions, architecture map, commands | hand-edited |
| `docs/` (RFCs, MASTER_PLAN, STATUS) | Decisions and roadmap | hand-edited, drift-checked |
| `graphify-out/` | Code structure: graph, report, wiki | generated — `npm run graph:update` |
| `memory/hot.md` | What's in flight this week | rewritten by `/save` |
| `memory/sessions/` | What happened, when, and why | appended by `/save` |

## Related commands

- `/resume` — restore context at session start
- `/save` — persist context at session end
- `npm run graph:update` — refresh the knowledge graph after code changes
- `npm run graph:vault` — regenerate the full per-symbol Obsidian vault
