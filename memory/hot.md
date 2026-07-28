# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-28 — **PR #105 and #106 both merged** (`main` at
`3941a7e`). #105 carried the "master plan unfinished" tranche; #106 was the CI
performance work.

## CI performance — measured, not projected (PR #106)

**Verify: 721s -> 510s on the PR run.** On `main`, like for like against the
previous push, the verify STEP went 741s -> 501s. Four causes, all work that
produced nothing:
- **Coverage was forced fully serial** (`fileParallelism:false` + `maxWorkers:1`
  in vitest.config.ts, plus a redundant `--maxWorkers=1` in `verify`), with no
  recorded reason. 253.8 -> 159.6s. **1.59x on CI, NOT the 2.65x measured
  locally** — the runner is 4 vCPU so worker contention eats most of it. Do not
  quote the local number.
- **The app was built twice**: Playwright's webServer rebuilt it after
  check:bundle-size had gated the first dist. `PLAYWRIGHT_PREBUILT=1` now skips
  it. e2e dead time before the first test: 44.2s -> 4.7s.
- **check:compute-register re-ran the suite** one cold `npx vitest` per file.
  39.3 -> 11.4s, batched into one spawn.
- **The a11y test scanned 8,235 DOM nodes** with axe. 45.6 -> 11.2s across both
  browser projects.

**`--with-deps` is the sleeper.** It apt-installs 9 packages, all fonts. Cost is
wildly variable: 18.4s on one runner, **566s (9m26s)** on the `62ac50a` main
run — the single largest cost in that entire job. Removing it is worth far more
than the 18s figure suggests.

**The browser cache was broken and I wrote it.** It cached `~/.ms-playwright`;
Playwright installs to `$XDG_CACHE_HOME/ms-playwright` on Linux. Silent both
ways — restore could not hit, save had nothing to write (0s post step) — so two
runs re-downloaded 380 MiB while looking cached. Fixed on branch
`claude/master-plan-unfinished-s1lsya` (`1c39df3`, NOT yet merged, no PR): the
job pins `PLAYWRIGHT_BROWSERS_PATH` and caches that same variable, plus an
assertion that fails if the path is empty after install. **The 510s result did
NOT depend on the cache** — it never worked, so the fix is upside on top.

**Restoring parallelism exposed one latent test race** (`682b228`):
creationWizard.a11y.test.tsx mounted the wizard twice without settling between
renders. Expect more of this class if the job is ever split further.

**Biggest CI win still on the table:** split the single 22-step job into five
parallel ones — the critical path becomes the slowest job instead of the sum,
~2m30s-3m30s. NOT done deliberately: CI would stop literally invoking
`npm run verify`, so a step added to package.json could silently never run in
CI, which is this repo's documented failure mode. Needs a `check:ci-parity`
gate asserting the ci.yml `npm run` multiset equals the verify chain. Owner call.

**Read `docs/WORK_PLAN.md` first** — it is the forward-looking queue and was
refreshed against `main` on 2026-07-28. `docs/MASTER_PLAN.md` holds decisions and
status; `docs/GAPS.md` §20 holds the #105 evidence.

**What landed in #105:**
- The rescued **1,069-entry over-inclusion audit** (now 1,045 suspects) plus its
  ratchet gate `check:provenance-over-inclusion`, which is a real CI gate now.
- The **`srd-manifest` demotion** executed (GAPS §6) — PF2e content% fell 100% →
  48.6% because the circular denominator is gone. Do NOT re-gate the manifests.
- **Dead code deleted** (~556 LOC: `utils/systemCatalog`, `utils/validation`,
  `components/MonsterStatBlock`) and `knip.json` → `knip.jsonc` with test entry
  points dropped. `check:dead-code` passed in CI — neither predicted failure mode
  (vitest plugin re-admitting tests; config-discovery fallback) occurred.
- **Scene persistence** moved off the ~5 MB localStorage ceiling onto IndexedDB
  with a localStorage snapshot for first paint (`src/hooks/useScenes.ts`).
- The contribution-ledger consumer (5e AC tooltip), the `character-draft` AI
  affordance, and `src/rules/legality/dnd5e.ts` bridged (it was dead at runtime).

**Three CI fixes worth remembering (all cross-system shape defects):**
- `formatCastingTime` crashed the app into its error boundary because
  `loadSpellsForSystem('mam3e')` returns *powers*, which have no casting time
  (`dataLoader.ts:631`). Same class as `formatItemCost`. When a shared formatter
  browses all seven catalogs, a declared non-optional field is a lie.
- Bundle budgets: totalJs 1664 → 1680 KiB, and eagerShell **ratcheted down**
  192 → 176 KiB so the lazy-engine reclaim is captured, not left unguarded.
- `vitest.config.ts` was collecting tests out of `.claude/worktrees/**`.

**AWAITING THE OWNER — decisions, not work.** Do not chase these:
1. 62 remote branch deletions (SHAs in `docs/history/2026-07-26-retired-branches.md`).
2. WORK_PLAN §0.1 pile A — 31 records with no open-content counterpart. The only
   genuine licensing exposure.
3. Pile C — 78 wrong-edition records; honest re-tagging would drop **75** via
   `filterOpenContentBySource`. Not a cheap re-tag.
4. GAPS §19.4 M&M adversaries — recommended option (d), fetch `d20herosrd.com`
   once from an unblocked connection. The blocker is the sandbox proxy, not
   licensing.
5. The orphaned feat-automation copy in `src/utils/documentationCopy.ts`.
6. Ratification of the four kept sheet wrappers (WORK_PLAN §4.3).

## Landmines

- **Never delete or relabel shipped content on your own** — `filterOpenContentBySource`
  silently drops any entry whose source leaves the allowlist, so a re-tag is a
  product change. Owner's call (GAPS §11 / OC-1).
- **Agents fabricate content data.** An adversarial verifier panel invented 5 of
  20 M&M counterparts (25%). Verify every figure locally before writing it into a
  doc (GAPS §18.7).
- **Container recycles mid-session** silently kill background workflows and wipe
  the scratchpad. Commit and push per slice.
- **Playwright browser bridge:** `/opt/pw-browsers` has rev **1194**, the
  toolchain wants **1208**. Point `launchOptions.executablePath` at
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` in a temp config, run with
  `NO_PROXY='*' PLAYWRIGHT_REUSE_SERVER=1` against `npx vite preview --port 4173`,
  and delete the temp config before committing. Rebuild before testing a `src`
  change — preview serves `dist`. NEVER `playwright install`.
- **compute-register --mutate REFUSES a dirty tree.** Commit first, then mutate.
- **doc-drift pins verbatim phrases** — preserve exact strings when editing paired
  docs, and the verification baseline is generated
  (`scripts/record-verification-baseline.mjs`), not hand-edited.
- **Merge policy:** the auto-mode classifier blocks merge-to-main, force-push, and
  remote branch deletion without explicit, specific user consent.
