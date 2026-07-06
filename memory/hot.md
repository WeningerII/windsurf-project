# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-06 (VTT UI/UX research — see docs/design/vtt-ui-ux-research.md)

## Current focus

Memory infra (PR #28) and launch-blocker instruments (PR #27) are MERGED to
main. The restarted `claude/claude-obsidian-graphify-research-d8ufwc` branch
carried the **system-agnosticism sweep** — MERGED (PR #29). Newest: VTT UX research doc for the coming shell redesign (docs/design/vtt-ui-ux-research.md); branch restarted from main:

- profBonus cycle fix + duplicate vitest.d.ts removal (morning audit)
- 21 system-specific files relocated out of shared layers (templates,
  daggerheart helpers, Mam browsers, FeatureOptionBrowser, pf2eDegree...)
- characterCombatant refactored: per-system D20 profiles in
  `rules/combatants/systemProfiles.ts` replace all inline systemId branches
- **Layer boundary is now lint-enforced** (.eslintrc.json
  no-restricted-imports: shared code cannot value-import src/systems/**;
  exemptions: main.tsx bootstrap, dataLoader, docDrift). Negative-tested.
- Graph clean: 4,192 nodes / 172 communities / zero import cycles.
- Dead-code candidate flagged: `systems/dnd5e/shared/dnd5eMovement.ts`
  (test-only, no product consumers).

## State of the repo

- `main` now includes PR #27: legal notices (LICENSE/NOTICE/attributions +
  gates), compute-register three-tier verification gate, outcome-baseline e2e
  harness, master gap ledger, dice/engine-math wiring.
- Code graph is fresh over merged main: 4,180 nodes / 12,009 edges / 170
  LLM-named communities from 680 code files (`src/data/` excluded via
  `.graphifyignore`). Freshness hash in `graphify-out/GRAPH_REPORT.md`.
- Docs corpus is *not* in the graph (needs LLM backend; deferred experiment).
- Per-symbol Obsidian vault is gitignored; regenerate with `npm run graph:vault`.

## Graph-audit facts worth keeping (2026-07-05)

- `CharacterDocument` is a 229-edge god node touching ~50 of 174 communities —
  run `graphify affected "CharacterDocument"` before changing it.
- knip's exports/types/duplicates rules are OFF in `knip.json`: CI catches
  unused files/deps but NOT unused exports.
- Looks-vestigial-but-isn't: `notion-site/` is deployed by `pages.yml`;
  `src/systems/d20-legacy/` is the live shared host for 3.5e + PF1e.
- Graph blind spots: `src/data/` is excluded, so types consumed mainly by data
  files look near-orphaned; INFERRED edges (113 @ 0.73 confidence) include
  name-collision false positives — hints, not facts.

## Known landmines (learned 2026-07-05)

- `docs/generated/compute-register-gate.json` is transient+gitignored by
  design — never reference it as a repo path in docs or `path_ref_rule` fails
  CI (that's what originally blocked PR #27).
- e2e locators drift silently: UI copy renames don't fail any drift gate
  (f6aa80a renamed the campaign-notes placeholder and broke system-smoke
  latently for 17 days). Grep e2e/ for old strings when renaming user-facing
  copy.

## Next steps

1. Merge this branch (memory + graph infra) after review.
2. Use the graph on a real cross-system task and record outcomes with
   `graphify save-result --outcome useful|dead_end`; `graphify reflect` after
   a few sessions.
3. Consider ingesting `docs/` into the graph via the `claude-cli` backend.

## Open questions

- Does the PreToolUse nudge help or annoy? (Observed in-session: it fires
  correctly and stays out of the way for md reads. Fails open; removable in
  `.claude/settings.json`.)
- Should `graphify update .` be wired into `npm run verify` or a git hook
  (`graphify hook install`) instead of relying on /save discipline?
