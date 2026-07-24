# UI-shell Phase 7 — budgets of record: what is hard-gated, what stays soft-logged

**Status:** live. Landed 2026-07-24 with the Phase-7 hardening PR.
**Scope:** the perf/bundle half of Phase 7 — the budgets themselves and the
promotion of the keepalive frame budget from a soft log to a hard CI gate. The
rest of the phase's brief (hash-sync restore-on-reload, the chrome-dominance
gate, the seam catalogue, the owner usability sign-off) is NOT in this PR and is
still open; see "Deliberately not done" at the bottom.

All numbers below were MEASURED on the build of 2026-07-24 and each carries its
derivation in the source comment next to it. None was chosen to make a check
pass.

---

## 1. The keepalive budget — now a hard gate

**Gate:** `npm run check:keepalive-budget` (`scripts/check-keepalive-budget.mjs`),
wired into `npm run verify` immediately after the test step, alongside the other
`check:*` gates. CI runs `npm run verify`, so this is live in CI.

**What it measures:** the real `SurfaceStage` driven through the real
`ShellContext` reducer, under `<StrictMode>` exactly as `main.tsx` mounts the
app, with a `MutationObserver` counting the DOM writes a surface switch actually
performs. Measured for **all seven systems** and **all six ordered surface
transitions** — 42 switches per run.

**It is deterministic (counted), not wall-clock (timed).** That is a deliberate
choice, and the reasoning is load-bearing:

1. **The existing instrument does not measure switch latency.**
   `useSurfaceSwitchMetrics` marks each surface as it becomes active and then
   measures from the PREVIOUS surface's mark to the current one. That span is
   dwell time on the previous surface plus the switch. In
   `e2e/phase1-scene-keepalive.spec.ts` the `library->scene` measure therefore
   includes scene creation and a 30-second-timeout wait for a lazily fetched
   chunk. A threshold over that number would gate on how long a test lingered,
   and would stay green while the keepalive mechanism itself regressed.
2. **Even a correctly scoped wall-clock span cannot be non-flaky here.** A
   keepalive switch is four attribute writes. The soft-logged wall-clock column
   of the artifact ranged **12.6 ms – 48.5 ms** across the 42 measured switches
   on an idle local container — a ~3.9x spread on identical work, before any CI
   co-tenancy, GC pause or cold-JIT contribution. A threshold that survives that
   spread sits an order of magnitude above the signal and no longer detects the
   regression it exists for.

   Not hypothetical: `src/__tests__/drag/gateBudget.test.tsx` is the repo's one
   existing wall-clock budget (50 ms reconcile ceiling). During this Phase-7 work
   it measured **14.99 ms run alone and 73.41 ms under full-suite load** — over
   budget, red build — in the same commit, on one machine, with no code change
   between the two runs. That is the failure mode this gate refuses to reproduce.

An honest deterministic gate beats a wall-clock gate that flakes, so the budget
is expressed in exact counts. Counts do not vary with machine load, which is
precisely why they can be asserted hard.

### Hard-asserted, with derivations

| Assertion | Measured | Budget | Margin rationale |
| --- | --- | --- | --- |
| DOM attribute writes per switch | 4 | **6** | 4 = `aria-hidden` + `class` on the outgoing and incoming wrappers. Margin = exactly one more attribute on both wrappers (e.g. pairing `inert` with `aria-hidden`), so a plausible a11y addition needs no budget bump. It cannot hide a remount, which lands in the zero-margin row below. |
| Structural DOM mutations per switch (childList / nodes added / nodes removed) | 0 / 0 / 0 | **0**, no margin | Keepalive means nothing enters or leaves the stage on a switch. One insert or remove IS the regression. |
| Extra component mounts after first visit | 0 | **0**, no margin | Expressed as a delta from the post-first-visit baseline so it is invariant under `<StrictMode>` (absolute counts read 1 without it, 2 with it; the delta is 0 either way). |
| Hidden-surface invariants | — | exact | Still connected to the document; `aria-hidden="true"`; class list exactly the Phase-1 hide mechanism (`invisible absolute inset-x-0 top-0 -translate-x-[200vw] pointer-events-none`); no `hidden` attribute; no `display:none` or `content-visibility` utility. |
| Switch cost vs hidden-subtree size | 4 attrs at 1 node, 4 attrs at 200 nodes | **must be equal** | The O(1) proof — the exact form of "the switch cannot drop a frame". This is what would break first if a surface were torn down and rebuilt. |
| Coverage | 7 systems × 6 transitions | all required | System ids come from the live registry, never a literal list, so an eighth system cannot silently skip the gate. Transitions are the six ordered surface pairs. |
| Measurement freshness | — | exact | The artifact records a SHA-256 of `src/components/SurfaceStage.tsx`; the gate recomputes it. A measurement taken against a different component is rejected as stale. |
| Measurement presence | — | exact | A missing artifact FAILS. The silent-pass hole in a gate like this is the test never running. |

### Verified to fail on real regressions

Each of these was reproduced against the real component before landing:

- Unmounting hidden surfaces instead of hiding them → `2 structural DOM
  mutations (budget 0)`, `removed 1 nodes`, `remounted a surface N extra times`.
- Swapping `invisible` (visibility:hidden) for `hidden` (display:none) → hide
  mechanism mismatch plus `forbidden hide utility "hidden"`.
- Deleting the artifact → `no keepalive measurement`.
- Touching `SurfaceStage.tsx` without re-running the suite → `stale`.

`src/__tests__/scripts/keepaliveBudgetEvaluator.test.ts` pins all of the above as
unit cases, so the gate's ability to fail is itself under test.

### Files

- `scripts/lib/shellKeepaliveBudget.mjs` — budgets, derivations, pure evaluator.
- `src/__tests__/components/SurfaceStageKeepaliveBudget.test.tsx` — measures,
  asserts inline (so a regression fails `npm test` too), emits
  `test-results/perf/keepalive-budget.json`.
- `scripts/check-keepalive-budget.mjs` — re-asserts the artifact in `verify`.
- `src/__tests__/scripts/keepaliveBudgetEvaluator.test.ts` — the gate's self-check.

---

## 2. Bundle budgets — the shell's first-paint discipline

**Gate:** `npm run check:bundle-size` (already in `verify`), extended.

Phases 1-6 inferred the eager/lazy split from `dist/index.html` plus one
minified copy marker. Phase 7 replaces that with Rollup's own chunk graph,
emitted by the `shell-chunk-graph` plugin in `vite.config.ts` to the gitignored
`.tmp/build/chunk-graph.json` (outside `dist/`, so the deployed bundle is
byte-unchanged). Assertions are now keyed by SOURCE PATH and cannot be defeated
by rewording UI copy.

### Finding that came out of doing this

**`dist/index.html` is not the eager set.** `build.modulePreload.resolveDependencies`
filters `*-data-*` chunks out of the emitted `<link rel="modulepreload">` list,
so index.html names four chunks — but the entry module STATICALLY imports
fifteen. Removing a preload hint does not create a lazy boundary; the browser
still fetches and evaluates all of them before the entry runs. Real first-paint
JS is **944.4 KiB gzip**, not the 189.4 KiB the old check could see.

That total splits as **189.4 KiB of shell code** and **755.0 KiB of per-system
SRD data**, and the data half is unequal across the seven systems: daggerheart,
mam3e, dnd-3.5e, pf1e and pf2e pay full eager freight, dnd-5e-2024 pays
partially (spells only), dnd-5e-2014 pays nothing. Phase 7 does not fix this —
that is the structural reclaim (lazy-loading the per-system engines behind the
registry), a larger async-boundary change tracked separately. Phase 7 makes it
**visible and un-growable**.

### Hard-asserted, with derivations

| Assertion | Measured | Budget | Derivation |
| --- | --- | --- | --- |
| Eager SHELL JS (gzip) — entry + static closure, excluding the grandfathered per-system data | index 86,087 + react-vendor 44,150 + vendor 57,747 + icons 5,973 = **193,957 B (189.4 KiB)** | **192 KiB** (196,608 B) | Headroom 2,651 B, sized so it never fires before the tighter gates it sits over: the app-chunk budget still has 953 B of its own slack, and ~1.7 KiB absorbs vendor/icon churn (a tree-shaken lucide icon ≈ 150-250 B gzip; a React patch bump a few hundred B). A genuinely new eager dependency costs KiB, so it trips. `icons` had no budget at all before this, and `vendor`'s 200 KiB ceiling is ~2x its real 56.4 KiB — ~145 KiB of eager growth could previously land ungated. |
| Eager per-system SRD data chunks | 11 chunks, 755.0 KiB | **the enumerated 11 only — the list may only shrink** | Recorded debt, not policy. A twelfth data chunk joining first paint fails the build. Byte growth inside these chunks is genuine SRD content and is already covered by `totalJsGzipBytes`, so it is deliberately not re-budgeted (content PRs should not go red for adding a spell). |
| All-seven lazy sheets | all 7 systems' sheet modules in dynamic-entry chunks | **no system's sheet may be in the eager closure** | Keyed by system id: seven ids, six distinct modules (dnd-3.5e and pf1e share the d20-legacy sheet host; dnd5e and dnd5e-2024 have their own entries over a shared `Dnd5eSheetBase`). A system missing from the map fails the gate rather than being skipped. |
| Lazy shell surfaces | `SceneManager.tsx` and `SceneCanvas.tsx` in dynamic chunks | **neither may be in the eager closure** | Restates Phase-1 Finding 17 against source paths instead of the `"No scene selected"` copy marker, and extends it to Phase-6's `SceneCanvas` — flag-gated at runtime, but it must not ride first paint at build time regardless of the flag. |

The pre-existing budgets (total JS 1664 KiB, app chunk 85 KiB, vendor 200 KiB,
largest data chunk 140 KiB, the SceneManager copy marker) are unchanged. **The
85 KiB app-chunk budget was not raised** — this PR adds no eager code; the eager
index chunk measured 86,087 B before and after.

### Verified to fail on real regressions

Reproduced by mutating the chunk-graph artifact and re-running the checker:
a system sheet hoisted into the entry chunk, `SceneCanvas` hoisted into the entry
chunk, a new data chunk joining the eager closure, a stale sheet-module mapping,
and a missing artifact — all exit 1 with a specific message; the unmutated
control exits 0.

---

## 3. What remains SOFT-LOGGED, and why

- **Wall-clock surface-switch latency.** `useSurfaceSwitchMetrics` still emits
  `performance.mark`/`performance.measure`, and
  `e2e/phase1-scene-keepalive.spec.ts` still annotates the durations. It stays
  soft for the two reasons in §1: the span is dwell time rather than switch
  latency, and the noise floor is an order of magnitude above the signal. The
  new artifact also records a `softLoggedSwitchMillis` per switch, which the
  evaluator never reads — data for a future ratchet, not a gate.
  **To make this hard, the instrument must first be re-scoped** to mark
  immediately before the nav dispatch and measure to the post-commit mark; only
  then is there a number worth thresholding. That is a change to the writer side
  (App → ShellContext) and is deliberately not bundled into this hardening PR.
- **Byte growth inside the eleven eager per-system data chunks.** Covered only by
  the coarse `totalJsGzipBytes` budget, on purpose: a per-chunk eager byte budget
  would turn every SRD content addition into a red build without telling anyone
  anything new. The composition ratchet is the gate that matters here.
- **Real per-system sheet render cost.** The keepalive budget is measured at the
  shell seam with probe subtrees, because `SurfaceStage` takes `ReactNode` slots
  and never sees system code — the all-seven sweep proves the numbers are
  identical for every system, and the O(1) probe proves they are independent of
  subtree size, which together is the honest generalization. Full per-system
  sheet rendering is exercised by `e2e/system-smoke.spec.ts` and the
  `e2e/outcome` baseline, not by this gate.

## 4. Deliberately not done in this PR

Phase 7's full brief also includes hash-sync restore-on-reload (a `shellNavHash`
codec plus a restore-on-reload e2e spec), the chrome-dominance CI gate (a
proposed `check:chrome-dominance` script), the constraint-set-of-record and
five-seam catalogue docs, and the owner usability sign-off. None of those are in
this PR; they remain open Phase-7 work. This PR is the perf/bundle-budget half
plus the keepalive gate, which had to land together: the frame budget could only
become hard once the hard budgets it lives beside existed.
