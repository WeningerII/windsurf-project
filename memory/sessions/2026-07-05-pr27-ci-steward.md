# 2026-07-05 — PR #27 CI steward (merged ✅)

**PR:** #27 "feat: launch-blocker instruments (legal, compute-register gate,
outcome baseline)" — branch `claude/blissful-mendel-7w1him` → `main`.
**Outcome:** merged after two CI fixes from this session.

## Fix 1 — doc-drift path reference (commit `0e903ff`)

- Verify job failed on `docDriftRules.test.ts` → "Broken repo path reference in
  docs/STATUS.md: `docs/generated/compute-register-gate.json`".
- Root cause: the PR *deliberately* gitignores that file as a transient per-run
  diagnostic, but STATUS.md referenced it as a backticked repo path;
  `path_ref_rule` (src/utils/docDrift.ts `extractRepoCodePaths`) flags any
  backticked `docs/...`-shaped span that doesn't exist on disk.
- Fix: reworded the sentence to name the emitting command
  (`npm run check:compute-register`) and the committed metric
  (`docs/generated/roadmap-metrics.md`). A bare filename without a `docs/`
  prefix is not matched by the rule.

## Fix 2 — stale e2e locator, latent on main (commit `3a229d8`)

- With vitest unblocked, CI reached e2e and failed deterministically in BOTH
  browsers: `system-smoke.spec.ts:224` timed out waiting for placeholder
  "Session notes, house rules, quest tracker...".
- Root cause: commit `f6aa80a` (June 18, on main) renamed the campaign-notes
  placeholder in `CampaignManager.tsx` to "House rules, NPC names, loot..."
  without updating the e2e locator. Latent on main for 17 days; only surfaced
  here because the previous CI failure had masked the e2e stage.
- Fix: updated both locator references in the test. Verified locally on
  chromium (52s pass; had to symlink the preinstalled Playwright browser
  revision 1194 into the 1208 layout the repo's pinned Playwright expects).
- Two other tests (pwa-offline chromium, legal-notices firefox) were flaky but
  passed on retry — left alone; watch for recurrence.

## Post-merge housekeeping (this branch)

- Merged `origin/main` (now `f3d67af`) into
  `claude/claude-obsidian-graphify-research-d8ufwc` — clean merge; package.json
  carries both the graph:* and compute-register script sets.
- `graphify update .` → 4,180 nodes / 12,009 edges / 170 communities;
  `label --missing-only` via claude-cli; wiki re-exported.

## Lessons (candidates for LESSONS.md)

- The doc-drift `path_ref_rule` treats every backticked repo-shaped path as a
  live reference — transient/generated files must be described by command, not
  path.
- e2e locators are not covered by any drift gate; UI copy renames need a
  `grep e2e/` sweep.
- The PreToolUse graph nudge fired correctly during this work and the md-read
  exemption held (memory/docs reads stayed silent).
