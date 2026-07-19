# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-19 — **Two slices landed on
`claude/next-priorities-98pzof` (3 commits, pushed; PR pending).** Built via
parallel workflow (2 build slices, each implement→adversarial-verify), then
integrated + full-gated + real-browser e2e by hand.

1. **Daggerheart short-rest downtime moves** (`4327b75` + comment fix `2f79b5f`)
   — the RFC 005 follow-up the long-rest slice deferred. Pure builders
   `tendToWounds/clearStress/repairArmor(data, recovery)` in `daggerheartRest.ts`
   apply an already-rolled `1d4 + tier` through the pool `restore` verb (HP =
   remaining pool, Stress/Armor = marked). Handlers roll a live d4 via
   `createLiveRng().rollDie(4)` + `getDaggerheartShortRestRecovery` +
   `getDaggerheartTier` — no inline Math.random. UI + header threaded. +7 tests
   (14 rest tests total).
2. **M&M 3e guided point-buy creator** (`0494b76`) — closes the Phase-4 "one
   system without a creator" gap. New registry seam `CreatorComponent?`
   (registry/types.ts) so App stays system-agnostic; mam3e/definition.ts wires
   it lazily (own chunk). `src/systems/mam3e/creator/` = draft hook + single
   screen: PL→budget (`mam3eStartingPowerPoints` 15×PL), 8 ability ranks feeding
   the **real `Mam3eEngine.prepareData`** (spend + PL-cap warnings read straight
   back — no parallel cost math). New `GuidedCreatorDialog` (content-agnostic
   modal, imports no systems → layer boundary holds). App create-flow: picking a
   system with a creator opens the modal; `onCreate` builds+persists;
   `useDocuments.addDocument` runs prepareData at add time so spend populates.

**Gates all green** (this branch): tsc app+test, 2171 unit tests, lint, knip,
prettier, doc-drift, generated-docs, repo-hygiene, build, bundle-size (creator =
own lazy chunk), **e2e system-smoke M&M + outcome-baseline all-7** (real browser
via the pw-bridge; mam3e re-measured 7 steps / ~0.6s / legal).

**NEXT (master plan, `docs/generated/master-gap-ledger.md`):** still-open,
code-doable-now items — 3.5e/PF1e monster denominator shape-mismatch (collapse
SRD category headings); provenance over-inclusion audit; M&M creator increments
2+ (powers/skills/advantages, archetypes); L1/L2/L5-L10 engine-math wiring; 7×N
parity matrix. Needs-infra/human: AI gateway provider-agnosticism, rate-limit/
a11y/observability (Phase 5), release eng (Phase 7), 5e-2024 exhaustion sign-off.

## Landmines

- **Container recycles mid-session** silently kill background workflows AND wipe
  scratchpad + saved workflow scripts. Workflow subagent Edits DO persist to the
  tree, so commit+push per slice; don't trust a long idle wait. (This session: a
  prior WF survived and a duplicate WF I launched both wrote the same mam creator
  files — the survivor's agent handled it via backward-compat; watch for dupes.)
- **Playwright browser bridge:** /opt/pw-browsers has rev **1194**, toolchain
  wants **1208**. Working bridge at `scratchpad/pw-bridge` symlinks
  chromium-1208/chrome-linux/chrome + chromium_headless_shell-1208/
  chrome-headless-shell-linux64/chrome-headless-shell → 1194 binaries (ffmpeg-1011
  matches). Run e2e with `PLAYWRIGHT_BROWSERS_PATH=<bridge> --project=chromium`.
  NEVER `playwright install`.
- **Merge policy:** auto-mode classifier blocks merge-to-main (and force-push)
  unless the USER gave explicit, specific consent. Generic "proceed" ≠ consent.
- **Never amend GitHub PR-merge commits** (committer noreply@github.com, on main).
  My git identity (Claude / noreply@anthropic.com) is correct.
- **doc-drift** pins verbatim phrases (e.g. Daggerheart STATUS.md capability
  phrase) — preserve exact strings when editing paired docs.
- `outcome/baseline.json` gates TIME only (20s ceiling, ~30× headroom), not
  steps; `steps` is descriptive. last-run.json is gitignored.
