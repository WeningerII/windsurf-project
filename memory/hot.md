# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-28. `main` at `e517a1c` (PR #111 merged). Unmerged work
sits on `claude/master-plan-unfinished-s1lsya`.

## In flight on the branch

Two commits, both about gates that could not fail:

1. **The Phase-4 drag acceptance had never run.** `e2e/scene-drag.spec.ts` skips
   on `VITE_SCENE_DRAG_ENABLED` and no workflow set it, so from the day it was
   written it reported green while proving nothing (Playwright exits 0 on a fully
   skipped file). Its first execution failed on a **shipped defect**: `Dock` keyed
   `activeSystemId` off the open *sheet*, so with a scene of a different system
   open, dragging a monster in silently placed nothing. Fixed in `src/App.tsx`.
   New `scene-drag` CI job builds flag-on and **asserts from the JSON report that
   nothing was skipped** — the exit code is the signal that missed this.
2. **Technical-debt sweep** (`docs/GAPS.md` §23, `WORK_PLAN` §6.9). Type surface
   came back clean: 0 `as any`, 0 TODO/FIXME, 1 genuine `any`. The real findings
   were claims nothing checked — below.

## Facts established this session (do not re-derive)

- **`CLAUDE.md` is now inside the doc-drift gate.** It was outside `ROOT_DOC_FILES`
  entirely and had drifted (`505 files` vs 512; an RFC range stopping at 006 when
  007 exists). New derived truths `dataFileCount` / `verifyGateCount`; all five new
  rules were mutation-tested. **Its numbers are gated — do not hand-edit them,
  change the code and let the gate tell you.**
- **`knip.jsonc`'s `.claude/` ignore does NOT prevent the worktree OOM.** Its old
  comment said it did. Measured with the entry present: 41 worktrees → `FATAL
  ERROR: Reached heap limit`; worktrees removed → exit 0 in 7.8s. **The remedy is
  `git worktree remove`.** Removal does not delete branches (113 before, 113 after).
- Worktrees cleared, 5.9 GB → 24 KB. The one dirty tree was the over-inclusion
  audit, proven strictly superseded by `main` before removal; diff archived in the
  session scratchpad.
- **`@ai-sdk/anthropic` goes missing from `node_modules` after a container recycle.**
  The lockfile is fine. Run `npm ci`; do not touch `anthropicAdapter.mts`.
- **Harness landmine:** a backgrounded `cmd > log; echo "EXIT=$?" >> log` reports the
  *echo's* exit code. It made a failing verify look green. Write the exit to its
  own file and read that file.

## Awaiting the owner — decisions, not work

1. 62 remote branch deletions (`docs/history/2026-07-26-retired-branches.md`).
2. WORK_PLAN §0.1 pile A — 31 records with no open-content counterpart. The only
   genuine licensing exposure.
3. Pile C — 78 wrong-edition records; honest re-tagging drops **75** via
   `filterOpenContentBySource`. Not a cheap re-tag.
4. GAPS §19.4 M&M adversaries — option (d), fetch `d20herosrd.com` once from an
   unblocked connection. The blocker is the proxy, not licensing.
5. Ratification of the four kept sheet wrappers (WORK_PLAN §4.3).

Read `docs/WORK_PLAN.md` first — it is the forward queue. `MASTER_PLAN` holds
decisions; `GAPS` §20–§23 holds this week's evidence.

## Landmines

- **Never delete or relabel shipped content on your own** — `filterOpenContentBySource`
  silently drops any entry whose source leaves the allowlist, so a re-tag is a
  product change. Owner's call (GAPS §11 / OC-1).
- **Agents fabricate content data.** A verifier panel invented 5 of 20 M&M
  counterparts (25%). Verify every figure locally (GAPS §18.7).
- **Container recycles mid-session** kill background work and wipe the scratchpad.
  Commit and push per slice.
- **Playwright:** `/opt/pw-browsers` has rev **1194**, the toolchain wants **1208**.
  Build a bridge dir in the scratchpad symlinking 1208 → 1194 and point
  `PLAYWRIGHT_BROWSERS_PATH` at it. Rebuild `dist` before testing a `src` change —
  preview serves `dist`. NEVER `playwright install`.
- **compute-register --mutate REFUSES a dirty tree.** Commit first, then mutate.
- **doc-drift pins verbatim phrases** — preserve exact strings when editing paired
  docs. Quoting a stale path inside backticks trips `path_ref_rule`; describe it in
  prose instead. The verification baseline is generated, not hand-edited.
- **Merge policy:** merge-to-main, force-push, and remote branch deletion need
  explicit, specific user consent.
