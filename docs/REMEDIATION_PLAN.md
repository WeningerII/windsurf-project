# Technical Remediation Plan

**Status:** Active · **Owner:** engineering · **Created:** 2026-05-30

### Progress log (2026-05-30)

| Phase | State | Commit |
|---|---|---|
| 0 · Truthful green build | ✅ Done | `creationDraftStorage` + 5e validators restored |
| 1 · Real safety net | ✅ Done | CI gates all PRs; baseline de-fictionalized |
| 2 · Delete trash | ✅ Done | 11 orphans removed; `knip` gate added |
| 3 · Boundary parsing | ✅ Done | import + Supabase + offline-queue validated (union retype 3.1 deferred) |
| 4 · Defer per-system load | ⏸ Blocked | needs app/E2E validation (sandbox browser CDN blocked); do where the app can run |
| 5 · Security/privacy | ✅ Done | Sentry PII fix; `npm audit` 0 vulns |
| 6 · Slim docs/process | ⏳ Pending | check-in point per owner |
| 7 · Toolchain | ⏳ Pending | ESLint 8 EOL is the priority |

Verified locally each step: `tsc`, vitest (929 green), lint, format, `knip`,
doc-drift, build, bundle-size. Playwright E2E runs in CI only (browser binaries
cannot be fetched in the dev sandbox).

This is an evidence-based, sequenced plan to take the repository from "red and
inaccurately documented" to "green, gated, lean, and type-safe," and then to
resume feature work on a trustworthy foundation. It supersedes ad-hoc cleanup.
It is intentionally decision-complete: each phase states what to do, the
decisions already made, and the acceptance gate.

---

## 0. Honest assessment

This is **not** a low-quality codebase. The evidence shows ~304 production
files of strict-TypeScript React with a clean system registry, a ~1:2.6
test-to-code ratio, ~22 real Playwright E2E tests, correct Supabase RLS, a
strong CSP, zero `TODO/FIXME/HACK` markers, zero dangerous DOM APIs, and
individually-justified lint suppressions. Much of what the docs claim is real
and working (Supabase sync, the seeded-RNG scene runtime, contribution
ledgers, 5e activity execution, spell-catalog parity).

The real problems are three and specific:

1. **An incomplete refactor left the branch red.** It did not typecheck and 8
   of 118 test files failed — all from two localized defects.
2. **The process/docs layer is self-deceiving.** It claims a "green verified
   baseline" that is false, and the drift-detector that should catch this is
   structurally incapable of doing so (it checks that prose matches a
   hand-recorded JSON file and never runs `verify`).
3. **The type core is under-bound.** The central `system` payload is a
   `{ [key: string]: unknown }` black box; strong per-system models exist but
   are disconnected, and untrusted data (localStorage, Supabase, import files)
   is cast, not parsed, at the boundaries.

Correct framing: **stop the bleeding → make the safety net real → clean → bind
the types → harden → slim the ceremony → modernize → resume features.**

---

## 1. Verified current state (ground truth)

| Dimension | Docs claim | Verified reality | Evidence |
|---|---|---|---|
| `npm run verify` | "green, May 1 2026" | could not pass — `tsc` failed | ran `tsc` |
| Typecheck | green | 4 errors, 2 files | `creationDraft.ts`, `validation.ts` |
| Lint | green | green (exit 0) | ran eslint |
| Unit tests | 859 / 761 | 899 tests; 897 pass, 2 fail; 8/118 files fail | ran vitest |
| Bundler | — | `vite build` succeeds | ran it |
| Security | "no client secrets" | true; RLS correct; strong CSP | audit |
| First paint | (chunk-split) | ~2.4 MB eager (6 data chunks) | `dist/index.html` |
| CI on this branch | — | none — CI skips feature branches | `ci.yml:3-7` |

**Two root causes behind 100% of the red (both now fixed in Phase 0):**

- **A — Missing module `src/utils/creationDraftStorage.ts`.** Imported by
  `dnd5e-2024/creationDraft.ts` (re-exported via the `src/ai` barrel), so it
  cascaded into 5 `ai*` tests + 2 creation-draft tests (7 of 8 failing files)
  plus 1 `tsc` error. The file never existed in git history; its contract was
  fully pinned by an existing test + types + consumer.
- **B — Disabled validators in `dnd5e/shared/validation.ts`.** A refactor
  replaced the working `validateFeats(feats)` call with a broken inline loop
  over `system.featIds` (a field that does not exist on the data model) and
  disabled `_validateFeats`/`_validateFeatureOptions`. Result: 3 `tsc` errors
  + 2 assertion failures.

---

## 2. Guiding principles (why the order is the order)

1. **Never refactor on red.** A truthful green build precedes everything.
2. **A safety net you can't trust is worse than none.** CI must gate this
   branch and "green" must be true-by-construction before any deletion.
3. **Delete before you refactor.** Shrinking the surface precedes type-binding.
4. **Verify with the compiler, not grep.** Every dead-code deletion goes
   behind `knip`/`tsc` + a green `verify`.
5. **Honesty over ceremony.** Docs describe reality and are cheap to keep true;
   the rest is cut or auto-generated.

---

## 3. Phases (execution order)

### Phase 0 — Restore a truthful green build · ~½ day · risk: low · **DONE (verifying)**
- **0.1** Implement `src/utils/creationDraftStorage.ts` to satisfy the existing
  test contract (9 functions: create / upsert / load / loadAll / delete /
  clear / updateStep / setValidationIssues / finalize). localStorage-backed;
  pure transition helpers. **Decision: implement, not revert.**
- **0.2** Repair `src/systems/dnd5e/shared/validation.ts`: drop the broken
  `system.featIds` inline block; re-enable + call `validateFeats` and
  `validateFeatureOptions`.
- **0.3** Run the real gate: `npm run verify` end-to-end, including coverage
  thresholds (lines 70 / fns 65 / branches 60 / stmts 70). Record true counts.
- **Acceptance:** `tsc` clean; vitest green; `verify` exits 0 unaided.
  Sub-result already confirmed: `tsc` exit 0; the 8 formerly-red files pass
  (23/23).

### Phase 1 — Make the safety net real · ~½ day · risk: low
- **1.1** CI on feature branches: add `pull_request:` with no branch filter
  (and/or `push:` for `claude/**`) in `.github/workflows/ci.yml`.
- **1.2** Kill the self-deceiving baseline: `verification-baseline.json` is
  written only by a passing CI `verify` run, never hand-edited; delete or
  rewire `doc-drift`'s verification rules (today `docDrift.ts` statically
  imports the JSON and only checks prose-matches-JSON).
- **1.3** Correct false claims in `README.md:7`, `STATUS.md:5`,
  `MASTER_PLAN.md:44`; reconcile the test-count (761 vs 859 vs real).
- **Acceptance:** a draft PR runs `verify`+E2E green; baseline is CI-generated.

### Phase 2 — Clean the obvious trash (safely) · ~1–1½ days · risk: low–med
- **2.1** Add `knip` (and/or `ts-prune` + `depcheck`) + a `check:dead-code`
  script for a compiler-verified hit list.
- **2.2** Delete confirmed orphans (Appendix A) and ~20 dead exports.
- **2.3** Resolve duplication: standard-array/point-buy constants; rename the
  `dnd5e-shared/` vs `dnd5e/shared/` collision; disambiguate the two
  `spellPreparation.ts`; fix the `MagicItem` double-definition; audit the
  per-system `*Template.ts` family and the `systemCatalog*` trio.
- **Acceptance:** `check:dead-code` clean; `verify` green after each batch.

### Phase 3 — Bind the type core & parse at boundaries · ~3–5 days · risk: med (highest-leverage)
- **3.1** Discriminated `AnyCharacterDocument` union keyed on `systemId`,
  wiring the existing per-system `data-model.ts` types into
  `CharacterDocument<T>`; add `systemId`-narrowing type guards.
- **3.2** Parse-don't-cast at the 4 untrusted boundaries:
  `documentStorage.importDocuments`, `syncEngine.fromRemote`, the offline-queue
  parsers, and AI-gateway responses (`gatewayClient.ts` already validates — use
  it as the template). **Open decision:** `zod` vs. hand-written guards
  (MASTER_PLAN flags `zod` as needing an RFC). Recommendation: small vendored
  guard layer first; adopt `zod` only if guard sprawl proves it.
- **3.3** Delete the ~16 `as Record<string, unknown>` casts and `App.tsx`
  `asNumber/asString` shims the union makes unnecessary.
- **Acceptance:** zero `Record<string, unknown>` casts on `system`; corrupt
  persisted/remote/imported data is rejected with a structured issue.

### Phase 4 — Performance: defer per-system load · ~1 day · risk: med
- Register lightweight metadata eagerly; load each system's engine + data via
  dynamic `import()` on selection (root cause: eager engine instantiation in
  each `definition.ts` statically pulls its data, negating the `lazy()` split).
- **Acceptance:** built `index.html` no longer entry-loads the 6 data chunks;
  `check:bundle-size` enforces it.

### Phase 5 — Security & privacy hardening · ~½–1 day · risk: low
- **M1 (privacy):** Sentry `beforeSend` scrubber + `sendDefaultPii:false`; stop
  `errorLogger` forwarding raw `args`/`context` (allowlist safe fields).
- **M2:** require a Supabase JWT + rate-limit on
  `netlify/functions/ai-gateway.mjs` before any real provider is wired.
- **Housekeeping:** `npm audit fix` (3 moderate); tighten CSP wildcards
  (`netlify.toml:78`); add an origin check to the SW `CACHE_URLS` handler.

### Phase 6 — Slim the process apparatus · ~½ day · risk: low
- **Keep** the reality-checking gates: `roadmap-metrics` + `check:generated-docs`,
  `check:repo-hygiene`, `check:bundle-size`, node-version gating.
- **Archive** to `docs/history/`: `PRODUCTION_PLAN.md`, both
  `EVIDENCE_LINKED_PARITY_*`, `DAGGERHEART_DATA_ORGANIZATION_PLAN.md`.
- **Slim** `MASTER_PLAN.md` to North Star + constraints + active phases; slim
  `CONTRIBUTING.md` (992 → ~150 lines repo-specific).

### Phase 7 — Toolchain modernization (deliberate, last) · ~1–2 days · risk: med
- Most pressing: ESLint 8 is EOL → 8→9/10 flat-config migration.
- Risk-ordered: React 18→19, Tailwind 3→4, Vite 7→8, `lucide-react`
  0.294→1.17, `@types/node` 20→22. Reconcile `.nvmrc` (20.19.0) with the
  cloud env (Node 22); `engines` already allows 22.

---

## 4. Appendix A — "Obvious trash" inventory (compiler-confirm before deleting)

**Orphan modules (0 import sites):** `src/constants/dnd5e.ts`,
`src/components/ui/Label.tsx`, `src/components/ui/Tooltip.tsx`,
`src/systems/d20-legacy/components/D20AbilitiesSavesSection.tsx`,
`src/types/progression/multiclassing.ts`, `src/types/mechanics/attributes.ts`,
`src/types/mechanics/skills.ts`, and dead barrels `types/mam/index.ts`,
`types/components/index.ts`, `types/core/index.ts`.

**Dead exports (~20):** in `dnd5eToolChoices.ts`, `d20LegacySpellcasting.ts`,
`daggerheartDerived.ts`, `daggerheartInventory.ts`, `performance.ts`
(`throttle`), `spellPreparation.ts` (`resolveSpellPreparationEntries`),
`systemCatalogShared.ts`, `dnd5e-shared/engine.ts` (`rollD20`,
`normalizeDeathSaves`), et al.

**Not trash (verified used):** `src/scripts/**` (wired via npm scripts),
`src/validation/class-validator.ts` (imported `.js`),
`src/scene/encounterBuilder.ts`. No `.bak`/scratch/backup files exist.

**Caveat:** parts of this list came from name-grep — gate every deletion on
`knip`/`tsc`.

---

## 5. Risks & open decisions
- **Coverage gate (Phase 0.3):** may surface a shortfall now that the build is
  green; small add-on if so.
- **Type-binding blast radius (Phase 3):** do it system-by-system behind green
  `verify`, not big-bang.
- **`zod` vs. hand guards (Phase 3.2):** the one genuine architecture fork;
  recommendation recorded above.

## 6. Effort summary

| Phase | Theme | Est. | Risk |
|---|---|---|---|
| 0 | Green build | ½ day | low |
| 1 | Real CI / honest baseline | ½ day | low |
| 2 | Delete trash | 1–1½ days | low–med |
| 3 | Type core + boundary parsing | 3–5 days | med |
| 4 | Defer data load | 1 day | med |
| 5 | Security/privacy | ½–1 day | low |
| 6 | Slim docs/process | ½ day | low |
| 7 | Toolchain | 1–2 days | med |

**Critical path:** 0 → 1 → 2 → 3. Phases 4–6 can interleave once CI gates the
branch (after Phase 1).
