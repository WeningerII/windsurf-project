# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-08-02. **PR #120 is MERGED** (`c2b2f2a`), all 9 CI checks
green, and `claude/master-plan-unfinished-s1lsya` == `origin/main`. Start the
next piece of work from a fresh branch off main.

`npm run verify` is **23 of 24** LOCALLY — the only failure is step 24 (e2e)
demanding a **Firefox** binary this container does not have at all. Chromium e2e
passes via the bridge: 45 passed / 6 skipped, exit 0. CI runs both browsers and
is the authority. Unit tests **3328**. Compute register **276**, Tier A **and**
Tier B — the 12 damage rows carry real mutation anchors, 0 demotions.

## The release hold is FULLY LIFTED (2026-08-02, GAPS §27)

All three populations that held it are closed: self-authored content deleted
(§17.3), the 68 wrong-edition records replaced or removed (§26,
`licensing-class total: none`), and the four 5e-2024 backgrounds re-encoded from
the real SRD 5.2 source (§27.2).

**The backgrounds were closed BY HAND, not by a gate.** A name diff still cannot
see content divergence under a legitimate name; field-level comparison covers 5e
monsters and backgrounds and nothing else; prose fidelity is unaudited in all
seven systems. Do not read the close as the class being solved.

## Also landed 2026-08-02

- **§4.3 Dock capability** — Advantages + Modifiers tabs, `AdvantageBrowser` and
  `PowerModifierBrowser` in the shared layer, and the **catalog-filter seam**
  (`SheetCatalogFilter`, third arg of `useSheetDispatchRegister`). All four kept
  wrappers deleted. The seam publishes a **predicate, not a descriptor** — a
  runtime value, so no static import crosses the layer boundary.
- **§0.6 Phase 10** — `analyze-map` vision task + MapPanel proposal review.
  `gridGeometryProposal.ts` finally has a consumer.
- **Q2/Q3** five-job CI split; **Q4** 12 L8 register rows; **Q5** 8 laundered
  3.5e prices; **Q7** typed damage on the area path; **Q8** the contrast lint.

## Facts established (do not re-derive)

- **A gate's SCOPE is as falsifiable as its logic.** The contrast lint walked
  `src/components` + `src/dock` only, so `src/systems/**` was invisible —
  Daggerheart's own coin colours sat at **1.16:1**, worse than the 1.23:1 the
  original sweep named as its worst find.
- **`pgrep -f "vite preview"` MATCHES YOUR OWN COMMAND LINE** and kills the
  shell running it. Exit 144 with no log file and no exit file is that, not a
  test failure. Kill by port, or do not kill at all.
- **Task notifications lie about exit codes** — 8+ disagreements this session.
  Always `echo "EXIT=$?" > file` and read the file.
- **Never run `verify` while a control experiment is in flight.** One run
  sampled a deliberately-reverted file and reported a failure that was mine.
- **`git add -A` sweeps agent scratch dirs into the repo** (`.lanecheck/` went
  into a commit that way). Stage explicit paths after a parallel run.
- **`git add -A <path> <missing-path>` aborts the WHOLE add** — a commit went in
  with a message describing docs it did not contain.

## Concurrent lanes: what it actually costs (2026-08-02)

Running 4-6 lanes at once is fast and it is NOT free. Both of these happened:

- **A lane silently reverted another lane's file to HEAD mid-session.**
  `src/__tests__/ai/prompts.test.ts` lost BOTH lanes' fingerprint pins. It was
  caught only because `Record<AiTask, unknown>` totality typing made the loss a
  type error. A file two lanes both touch WILL be clobbered; brief lanes onto
  disjoint files or expect this.
- **`git add -A` after a parallel run sweeps agent scratch dirs into the repo**
  (`.lanecheck/`), and squashing several lanes into one commit makes
  `git status` look clean for the wrong reason.

Mitigation that worked: declare each lane's files in its brief, give every lane
an adversarial checker, and stage EXPLICIT paths at integration.

## Landmines

- **Never delete or relabel shipped content on your own** —
  `filterOpenContentBySource` silently drops any entry whose source leaves the
  allowlist, so a re-tag is a product change. Owner's call (GAPS §11 / OC-1).
- **Check that an "equivalent" EXISTS before calling a replacement plan a plan.**
  The wrong-edition ruling was sound and its premise still failed for 40 of 68.
- **Build the narrowest channel the capability justifies** (GAPS §27.3). A dead
  channel is a door nobody watches — `addPowerModifier` was written then removed.
- **Agents fabricate content data.** A verifier panel invented 5 of 20 M&M
  counterparts (25%). Verify every figure locally (GAPS §18.7).
- **A container rollback restores 42 agent worktrees** (`.claude` → 5.9G) and
  that is what OOMs knip. `git worktree remove --force` each, then `prune`;
  branch count must be unchanged (183 before/after). It also drops
  `@ai-sdk/anthropic` from node_modules, which `typecheck:netlify` needs.
- **Playwright bridge, built IN PLACE under `/opt/pw-browsers`** (no
  `PLAYWRIGHT_BROWSERS_PATH` override needed): rev 1194 is installed, the
  toolchain wants 1208.
    chromium-1208/chrome-linux64            -> chromium-1194/chrome-linux
    chromium_headless_shell-1208/chrome-headless-shell-linux64/  REAL dir,
      per-file symlinks into chromium_headless_shell-1194/chrome-linux, PLUS
      chrome-headless-shell -> that dir's `headless_shell` (renamed between revs)
  Rebuild `dist` first — preview serves `dist`. NEVER run `playwright install`.
  **There is no Firefox at all**, so that project cannot run here; CI covers it.
- **compute-register --mutate REFUSES a dirty tree.** Commit first — writing the
  anchors dirties the tree, so the order is always: commit anchors, then mutate.
- **A Tier B anchor must perturb the formula the ROW NAMES.** An anchor aimed at
  a neighbouring function proves nothing and the gate demotes the row for it
  (`damage-channels` was aimed at `splitDamageAcrossChannels`; the row is
  `collectDamageChannels`). No other step in the chain can see that mistake.
- **Commit signing is configured but NON-FUNCTIONAL here.** `commit.gpgsign=true`
  with `gpg.format=ssh` points at `/home/claude/.ssh/commit_signing_key.pub`,
  a 0-byte file owned by `claude` while the session runs as `root`. Every commit
  is unsigned; `--reset-author` does not fix it (the author email is already
  correct). Needs a real key in the environment.
- **doc-drift pins verbatim phrases** — preserve exact strings when editing
  paired docs. Quoting a stale path in backticks trips `path_ref_rule`.
- **Merge policy:** merge-to-main, force-push, and remote branch deletion need
  explicit, specific user consent.
- **`wip/lane-snapshot`** still needs deleting from the GitHub UI. RE-VERIFIED
  2026-08-02: the proxy returns **HTTP 403** on `--delete`, on
  `:refs/heads/...` and on `+:...`, and no MCP tool deletes a branch. Do not
  keep retrying. Its content IS safe to delete — the four files its commit
  touched (`index.css`, `supportBadges.ts`, `CurrencyEditor.tsx`,
  `e2e/a11y.spec.ts`) are byte-identical to main — but note it is NOT an
  ancestor of main, so `--is-ancestor` says "unique commits" and an earlier
  session's "holds nothing unique" was imprecise. Compare CONTENT, not lineage.
- **Commit signing is configured but NON-FUNCTIONAL and cannot be fixed here.**
  Every commit shows as Unverified on GitHub. See the note above.
- **The Playwright bridge is wiped by EVERY container rollback** (five this
  session). `4 failed in ~3ms each` with `browserType.launch: Executable
  doesn't exist` is the bridge, not the code — the millisecond timing is the
  tell. Rebuild before believing any e2e red.
