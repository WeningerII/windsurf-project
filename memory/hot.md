# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-31. Branch `claude/master-plan-unfinished-s1lsya`
pushed through the homebrew deletion + **six parallel lanes**. `npm run verify`
is 21/22 — only step 22 (e2e) fails, on the container's Playwright revision
mismatch; run via the bridge it is 45 passed / 2 skipped, exit 0. Unit tests
3138 → **3261**. Compute register 247 → **264**, no demotions.

## The six lanes (2026-07-31)

| commit | lane |
|---|---|
| `6d4ebdb` | `check:ci-parity` + warn-only `check:graph-staleness` |
| `d282086` | shared formatters — per-system fallbacks (§6.6) |
| `3159e35` | register layers (§3.1) **+ a 3.5e encounter engine fix** |
| `4948e04` | multi-channel damage split (§3.2 / B1) |
| `5b3ed83` | dark-mode contrast regression + dark a11y scan |

**Real defects the lanes found, beyond their briefs:**
- **7 low-CR 3.5e monsters could not be placed in an encounter at all.**
  `DND35E_EL_VALUE` keys CR 1/6 and 1/3 as exact fractions; the catalog encodes
  `0.166`/`0.33`. Lookup missed → cost 0 → validator rejected them. Fixed by
  snapping sub-1 CRs within 0.005 (adjacent entries are 0.083 apart). Titan
  (CR 21) is still 0 and correctly so.
- **The whole M&M catalog rendered `Unknown`** for range/duration — those
  formatters switch on an object discriminant and M&M ships bare strings.
- **Dark `--destructive` was 2.00:1** (a third of AA) across 56 files, plus
  `CurrencyEditor` PP at **1.23:1**. The dark pair now flips; DELIBERATE visible
  consequence: solid destructive buttons in dark are light-red with a dark label.

## Facts established (do not re-derive)

- **`splitDamageAcrossChannels` post-condition:** an empty channel list with a
  non-zero total now THROWS. It used to return `[]` (destroying damage) because
  the early return preceded the post-condition. The test named "no channels
  yields no parts" was pinning the bug.
- **Typed damage is wired for SINGLE ATTACKS ONLY.** `attackToDamageIntent` has
  3 real callers; `areaEffectToDamageIntent` and `multiTargetAttackToDamageIntent`
  have ZERO outside tests/barrel. A fireball on a fire elemental still does not
  mitigate — `resolveSceneAreaEffect` builds an untyped intent inline at
  `src/rules/combat/sceneCombat.ts:503`.
- **The dark a11y gate reaches only 4 of ~17 touched files.** Proven by control:
  reverting the `supportBadges` dark override (1.79:1) was NOT caught, because
  the badge renders on no scanned surface. The gate defends shared design TOKENS
  well and component-local colour classes barely at all.
- **`graphify update` does NOT restamp `built_at_commit`.** `check:graph-staleness`
  therefore prefers the last commit touching `graphify-out/graph.json`.
- **CI's `verify` job delegates wholesale** (`run: npm run verify`), so
  step-level drift is structurally zero TODAY. `check:ci-parity` is prospective —
  it earns its place the moment the five-job split lands.
- **Monster resistance data ships and was read by nothing.**
  `damageResistances`/`Immunities`/`Vulnerabilities` are populated **394** times
  in `src/data/`.
- **§3.2 design constraints, both load-bearing:** mitigation resolves when the
  event is BUILT (beside RNG), never in the fold, so RFC 006 byte-identical
  replay holds; and damage profiles are SNAPSHOTTED onto tokens, never looked up.
- **`@ai-sdk/anthropic` vanishes from `node_modules` after a container recycle.**
  Run `npm ci`; the lockfile is fine. Symptom is `typecheck:netlify` TS2307.
- **Harness landmine:** a backgrounded `cmd > log; echo "EXIT=$?"` reports the
  *echo's* exit code — AND the task-completion notification reports the wrapper,
  not the command. It claimed "exit code 0" for runs that exited 2, 1 and 134.
  **Always write the exit to its own file and read that.**

## Next up — queued, all unblocked

- **Q2** scene-canvas e2e spec + CI job (§6.2/B6) — mirror the `scene-drag`
  pattern that caught a real defect.
- **Q3** five-job CI split — `check:ci-parity` has landed, so this is now safe.
- **Q4** the L8 compute-register rows the damage lane owes.
- **Q5** `normalizeLegacyEquipment` launders 8 non-coin 3.5e prices into a false
  `0 gp`; unfixable in the formatter (indistinguishable from a free pf2e item).
- **Q7** wire the area path to typed damage (see Facts above).
- **Q8** widen the dark a11y coverage, or add a static contrast lint.
- **§6.5** toolchain (React 18→19, Tailwind 3→4, Vite 7→8) — gated on the bundle
  budgets, which is an owner call.

## Awaiting the owner — decisions, not work

1. 62 remote branch deletions (`docs/history/2026-07-26-retired-branches.md`).
2. ~~Pile A — records with no open-content counterpart.~~ **DECIDED 2026-07-30:
   delete. Executed** — see below.
3. Pile C — 68 wrong-edition records; honest re-tagging drops most via
   `filterOpenContentBySource`. Not a cheap re-tag. **This is a different
   question from pile A** — the content is genuinely OGL, just miscited, so
   deleting would be the wrong remedy.
4. GAPS §19.4 M&M adversaries — option (d), fetch `d20herosrd.com` once from an
   unblocked connection. The blocker is the proxy, not licensing. Option (b),
   authoring them as labelled original content, is foreclosed.
5. Ratification of the four kept sheet wrappers (WORK_PLAN §4.3).
6. **The M&M L5 reinterpretation.** `docs/compute-register/types.ts` defines L5
   as "spellcasting economy"; M&M has none, so the register lane sited the EFFECT
   economy there. Defensible and documented, but it moves the published
   completeness number — a scope decision, not a verification result. The
   provenance allowlist records those citations as chapter-section; it does NOT
   ratify the layer choice.
7. **The dark `--destructive` flip has shipped** and is worth an eyes-on: solid
   destructive buttons/badges in dark are now light-red with a dark label. The
   old value was 2.00:1 (a third of AA) across 56 files, so the change is
   necessary; only the look is a preference.
8. **`wip/lane-snapshot`** is a stale recovery ref on the remote. Safe to delete
   now that everything real is on the branch, but remote deletion needs consent.

## The homebrew deletion (2026-07-30)

Owner: *"delete all of the homebrew stuff."* Executed — **108 entries** and the
policy channel that admitted them:

- 106 tagged `Original Content (not SRD)`: 79 in the M&M `original-not-srd.ts`
  module (deleted whole) + 27 individually tagged across 10 d20 catalog files.
- 2 more — `Cloak of the Archmagi`, `Pegasus Boots` — the same invented content
  still claiming `SRD 5.2` in the 2024 catalog. Their honestly-tagged 2014 twins
  were in the 106.
- `originalContentSources` and `isOriginalContentSource` are **deleted, not
  emptied**, so a re-added self-written entry fails the gate rather than finding
  a door. `ManifestEntryStatus` drops `'original'`; roadmap-metrics drops the
  `Original (non-SRD)` column; `check:mam-equipment` now requires every entry to
  come from an encoder-generated module.
- **`genuine-non-open-content` 89 → 0.** Ledger total 1034 → 925. Catalog counts
  fell honestly: 3.5e spells 609→607, pf2e spells 551→546, 5e-2024 equipment
  497→494 (then 492), M&M equipment 192→113. The M&M `devices` category is gone
  entirely — all 11 were self-authored and the Hero SRD prints no device row.
- Record: `GAPS` §17.3.

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
