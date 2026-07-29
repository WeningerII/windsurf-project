# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-29. `main` at `e9437f8` — **PRs #112 and #113 both
merged**. Nothing unmerged; `claude/master-plan-unfinished-s1lsya` was reset onto
the new main.

## What landed (#112, #113)

- **The Phase-4 drag acceptance had never executed.** `e2e/scene-drag.spec.ts`
  skips on `VITE_SCENE_DRAG_ENABLED` and no workflow set it, so it reported green
  while proving nothing. Its first run failed on a shipped defect: `Dock` keyed
  `activeSystemId` off the open *sheet*, so dragging a monster into a scene of a
  different system silently placed nothing. New `scene-drag` CI job builds
  flag-on and **asserts from the JSON report that nothing was skipped** — verified
  passing on #112 in 1m13s, parallel to Verify, off the critical path.
- **`CLAUDE.md` is now inside the doc-drift gate** (it was outside
  `ROOT_DOC_FILES` entirely and had drifted). Its numbers are gated — change the
  code and let the gate tell you; do not hand-edit them.
- **`ledger_ref_rule`** — plan prose citing a `done` ledger item now fails CI.
- **L8 typed damage (§3.2)** — see below.

## Facts established (do not re-derive)

- **`knip.jsonc`'s `.claude/` ignore does NOT prevent the worktree OOM.** Measured
  with the entry present: 41 worktrees → `FATAL ERROR: Reached heap limit`;
  worktrees removed → exit 0 in 7.8s. **The remedy is `git worktree remove`**,
  which does not delete branches (113 before, 113 after).
- **Monster resistance data ships and was read by nothing.**
  `damageResistances`/`damageImmunities`/`damageVulnerabilities` are populated
  **395 times** in `src/data/`; before §3.2 the only references outside data and
  tests were their own declarations.
- **§3.2 design constraints, both load-bearing:** mitigation resolves when the
  event is BUILT (beside RNG), never in the fold, so RFC 006 byte-identical
  replay holds and untyped historical events are unaffected; and damage profiles
  are SNAPSHOTTED onto tokens, never looked up, so replay does not depend on the
  SRD data as it exists at replay time.
- **`ChoiceStepView` could hang a choice step on its skeleton forever** — effect
  guarded on a null document but keyed only on `[step]`. Fixed with a BOOLEAN
  `hasDocument` dep (depending on `document` would reload the list on every
  selection). I misdiagnosed this twice as slowness/double-mount; an
  already-resolved promise cannot take 10s, so the load had never started.
- **`@ai-sdk/anthropic` vanishes from `node_modules` after a container recycle.**
  Run `npm ci`; the lockfile is fine.
- **Harness landmine:** a backgrounded `cmd > log; echo "EXIT=$?"` reports the
  *echo's* exit code. Write the exit to its own file.

## Next up

§3.2's **input surface is still open** — no UI lets a user say "10 fire", so
mitigation only fires for callers passing a type; the L8 compute-register rows
are also unwritten. Other READY lanes: §3.1 register layers, §6.5 toolchain
(React 18→19, Tailwind 3→4, Vite 7→8), §2.5 `p1.monster-denominator-fix` (moves
published numbers), the five-job CI split (needs `check:ci-parity` first).

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
- **Playwright:** `/opt/pw-browsers` has rev **1194**, the toolchain wants **1208**,
  and there is no Firefox at all — so `npm run verify` always dies at step 22
  locally and **firefox e2e cannot be run in this container**. Build a bridge dir
  in the scratchpad symlinking 1208 → 1194, point `PLAYWRIGHT_BROWSERS_PATH` at
  it, and run `--project=chromium` (41 passed / 2 skipped is the clean baseline).
  Rebuild `dist` first — preview serves `dist`. NEVER `playwright install`.
- **compute-register --mutate REFUSES a dirty tree.** Commit first, then mutate.
- **doc-drift pins verbatim phrases** — preserve exact strings when editing paired
  docs. Quoting a stale path inside backticks trips `path_ref_rule`; describe it
  in prose instead.
- **Merge policy:** merge-to-main, force-push, and remote branch deletion need
  explicit, specific user consent.
