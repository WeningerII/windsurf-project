# Retired branches — recovery record

All branches below were deleted from `origin` on 2026-07-26 after the shelf-work
inventory. **Nothing here is lost**: a branch is only a name pointing at a commit,
and every SHA is recorded. To restore any of them:

```
git fetch origin <sha> && git branch <name> <sha>
```

The three shelf branches were deleted by owner decision (0.2, "delete deliberately")
— the Phase 12 strategist prototype on `sharp-davinci` was **not** salvaged. That was
a deliberate choice to stop carrying it, not an oversight.

| Branch | SHA | Why retired |
| --- | --- | --- |
| `claude/blissful-mendel-7w1him` | `3a229d8` | Fully merged (0 commits ahead of main) |
| `claude/claude-obsidian-graphify-research-d8ufwc` | `51f0da9` | Fully merged (0 commits ahead of main) |
| `claude/doc-truth-correction` | `4c71cdc` | Fully merged (0 commits ahead of main) |
| `claude/docs-clean-design` | `c6ed9f8` | Fully merged (0 commits ahead of main) |
| `claude/docs-clean-gaps` | `3ada95f` | Fully merged (0 commits ahead of main) |
| `claude/docs-clean-rfc` | `dceae55` | Fully merged (0 commits ahead of main) |
| `claude/docs-clean-root` | `242ebeb` | Fully merged (0 commits ahead of main) |
| `claude/hopeful-thompson-cul3X` | `4598ff6` | Shelf branch. Fully superseded: bestiaries behind shipped data, 3.5e feats stale and re-derivable, UI beaten by LibraryBestiaryView |
| `claude/lane-dg1-exhaustion-ratified` | `c3141c6` | Fully merged (0 commits ahead of main) |
| `claude/lane-fix-2024-riders` | `7177a2d` | Fully merged (0 commits ahead of main) |
| `claude/lane-lazy-engine-reclaim` | `6474b56` | Fully merged (0 commits ahead of main) |
| `claude/lane-mam-equipment` | `c559e1d` | Fully merged (0 commits ahead of main) |
| `claude/lane-p1-content-tail` | `6351051` | Fully merged (0 commits ahead of main) |
| `claude/lane-p1-provenance-audit` | `bfb76d0` | Fully merged (0 commits ahead of main) |
| `claude/lane-p2-rfc003-consolidation` | `7624bd3` | Fully merged (0 commits ahead of main) |
| `claude/lane-p5-a11y` | `2621261` | Fully merged (0 commits ahead of main) |
| `claude/lane-p5-ai-provider-agnostic` | `0e5f28f` | Fully merged (0 commits ahead of main) |
| `claude/lane-p5-infra-gaps` | `549c724` | Fully merged (0 commits ahead of main) |
| `claude/lane-srd-fidelity-audit` | `7278114` | Fully merged (0 commits ahead of main) |
| `claude/lane-w0-c0-types` | `c463746` | Fully merged (0 commits ahead of main) |
| `claude/lane-w0-doc-truth` | `8bed9fb` | Fully merged (0 commits ahead of main) |
| `claude/lane-w0-e2e-import` | `baa472b` | Fully merged (0 commits ahead of main) |
| `claude/lane-w0-eslint9` | `e3c13d4` | Fully merged (0 commits ahead of main) |
| `claude/lane-w0-jwt` | `68dc68c` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-content-encodes` | `a952fc5` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-coverage-wireups` | `2dfcaf9` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-cross-quickwires` | `998069a` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-grid-geometry` | `4333e91` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-map-pipeline` | `ac784e8` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-pf2e-quickwires` | `0b6048a` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-phase14` | `e4170b1` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-ui-phase2` | `d59aba3` | Fully merged (0 commits ahead of main) |
| `claude/lane-w1-validator-daggerheart` | `77d8042` | Superseded — validation.ts ships on main for this system |
| `claude/lane-w1-validator-dnd35e` | `e937e74` | Superseded — validation.ts ships on main for this system |
| `claude/lane-w1-validator-mam3e` | `6b2afa8` | Superseded — validation.ts ships on main for this system |
| `claude/lane-w1-validator-pf1e` | `14f5b7c` | Superseded — validation.ts ships on main for this system |
| `claude/lane-w1-validator-pf2e` | `9dc3d64` | Superseded — validation.ts ships on main for this system |
| `claude/lane-w1-validators-lazy` | `75fae81` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-conditions-ledger-seam` | `e9fbde8` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-d20legacy-finish` | `39a4922` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-daggerheart-ledger` | `dde9678` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-dnd5e-finish` | `bf75e6a` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-legal-actions-seam` | `42f771b` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-mam3e-finish` | `c032811` | Fully merged (0 commits ahead of main) |
| `claude/lane-w2-validators-7of7-docs` | `8c40cc2` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-ai-draft-adapter` | `0d766a5` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-compute-tail` | `8b7a3ba` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-guided-wizard` | `a187563` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-register-tranche1` | `4f7c17c` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-register-tranche2` | `6063e93` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-ui-phase3` | `1516140` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-ui-phase4` | `7dc34af` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-ui-phase5` | `c71e0c7` | Fully merged (0 commits ahead of main) |
| `claude/lane-w3-ui-phase6` | `084ab77` | Fully merged (0 commits ahead of main) |
| `claude/lane-w5-make-me-a-game` | `3764f7d` | Fully merged (0 commits ahead of main) |
| `claude/lane-w5-ui-phase7` | `81e6e25` | Fully merged (0 commits ahead of main) |
| `claude/lane-w6-activity-disposition` | `0c426b8` | Fully merged (0 commits ahead of main) |
| `claude/lucid-galileo-gQa6S` | `7b939ad` | Fully merged (0 commits ahead of main) |
| `claude/next-priorities-16xgyl` | `24bec12` | Fully merged (0 commits ahead of main) |
| `claude/next-priorities-98pzof` | `3457a1e` | Doc-only. Its Phase-12 removal is now applied directly to the plan |
| `claude/plan-remove-foundry-homebrew` | `08e43fc` | Fully merged (0 commits ahead of main) |
| `claude/restore-a11y-verifier-fixes` | `8df5791` | Fully merged (0 commits ahead of main) |
| `claude/sharp-davinci-pu40fc` | `977d854` | Shelf branch. Phases 10/12/13/14 — Phase 12 cut by decision; 10/13/14 superseded or half-shipped on main |
