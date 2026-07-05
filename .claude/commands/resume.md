---
description: Restore working context from project memory
---

Restore session context from the project memory system. Do all of the following,
then summarize the restored context in a few bullets before continuing work:

1. Read `memory/hot.md` (current focus, next steps, open questions).
2. Read the most recent one or two logs in `memory/sessions/`.
3. Check knowledge-graph freshness: compare `git rev-parse --short HEAD` against
   the "Built from commit" hash in `graphify-out/GRAPH_REPORT.md`. If they
   differ and code has changed, run `npm run graph:update` (AST-only, no API
   key). If `graphify` is missing, `pip3 install --user graphifyy` first.
4. Run `git status` and `git log --oneline -5` to see current branch state.

If `memory/hot.md` lists next steps and the user hasn't directed otherwise,
propose picking up the first one.
