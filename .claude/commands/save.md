---
description: Persist session memory (hot cache, session log, graph refresh)
---

End-of-session memory save. Do all of the following:

1. **Rewrite `memory/hot.md`** (≤500 words): current focus, state of the repo,
   next steps, open questions. Overwrite stale content — durable facts belong in
   `CLAUDE.md` or `docs/`, not the hot cache. Update the "Last updated" line.
2. **Append a session log** at `memory/sessions/YYYY-MM-DD-<slug>.md`: what was
   done, decisions and why, verification performed, follow-ups. Keep it factual;
   it is append-only history, never edited after the fact.
3. **Refresh the graph if code changed this session**: `npm run graph:update`,
   then `npm run graph:wiki` to keep the committed wiki in sync. Skip if only
   docs/memory changed.
4. **Record graph feedback** if any graphify queries were notably useful or
   misleading this session:
   `graphify save-result --question "..." --answer "..." --outcome useful|dead_end|corrected`.
   Every few sessions, run `graphify reflect` and commit the regenerated
   `graphify-out/reflections/LESSONS.md`.
5. **Commit the memory changes** (with the session's work, or standalone as
   `chore(memory): save session YYYY-MM-DD`).
