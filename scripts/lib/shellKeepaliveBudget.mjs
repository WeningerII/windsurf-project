/**
 * UI-shell Phase 7 — the keepalive budget, promoted from soft-log to hard gate.
 *
 * WHAT IT GUARDS
 * Phase 2 made the three shell surfaces (Library, Sheet, Scene) keepalive peers:
 * each mounts on first visit and then stays MOUNTED, hidden via
 * `visibility:hidden` + an off-screen transform + `aria-hidden` — never
 * `display:none`, never unmounted. The payoff is that a surface switch costs
 * nothing but two attribute writes, so in-flight state and layout survive and
 * the switch cannot drop a frame no matter how large the hidden subtree is.
 * Phases 1-6 only SOFT-LOGGED that promise. This module is the budget it is now
 * held to.
 *
 * WHY THE GATE IS DETERMINISTIC AND NOT WALL-CLOCK
 * The obvious promotion — take the Phase-1 `performance.measure` instrument and
 * assert a millisecond threshold — was investigated and REJECTED, for two
 * independent reasons:
 *
 *  1. The instrument does not measure what the name suggests.
 *     `useSurfaceSwitchMetrics` marks each surface as it becomes active and then
 *     measures from the PREVIOUS surface's mark to the current one. That span is
 *     the time the user (or the Playwright script) spent ON the previous surface
 *     plus the switch — i.e. dwell time. In `e2e/phase1-scene-keepalive.spec.ts`
 *     the `library->scene` measure includes scene creation and a 30s-timeout
 *     wait for the lazily-fetched canvas chunk. A hard threshold over that number
 *     would gate on how long a test lingered, and would happily stay green while
 *     the keepalive mechanism itself regressed. It is a proxy that fails the
 *     "measure the real thing" test.
 *
 *  2. Even a correctly-scoped wall-clock span cannot be non-flaky here.
 *     A keepalive switch is FOUR attribute writes (measured below) — work far
 *     under a millisecond. The soft-logged wall-clock column of the very
 *     artifact this module gates ranged 12.6ms-48.5ms across the 42 measured
 *     switches on an idle local container: a ~3.9x spread on identical work,
 *     before any CI co-tenancy, GC pause or cold-JIT contribution. A threshold
 *     that survives that spread has to sit an order of magnitude above the
 *     signal, at which point it no longer detects the regression it exists for.
 *     A gate that fails intermittently is worse than no gate, and a gate widened
 *     until it cannot fail is a lie.
 *
 *     This is not hypothetical. `src/__tests__/drag/gateBudget.test.tsx` is the
 *     repo's one existing wall-clock budget (50ms reconcile ceiling). During
 *     this Phase-7 work it measured 14.99ms run alone and 73.41ms — over budget,
 *     red build — in the same commit under full-suite load. A 4.9x swing on
 *     identical work, on one machine, with no code change between the two runs.
 *     That is the failure mode this gate refuses to reproduce.
 *
 * So the budget is expressed in DETERMINISTIC COUNTS of the work a switch does,
 * measured from the real `SurfaceStage` driven through the real `ShellContext`
 * reducer, with a `MutationObserver` reading the actual DOM writes. Counts do
 * not vary with machine load, which is precisely why they can be asserted hard.
 * Wall-clock is still recorded in the artifact, but only as a soft-logged
 * diagnostic — `evaluateKeepaliveBudget` never reads it.
 */

/** Where the measuring suite writes its report (gitignored, per-run). */
export const KEEPALIVE_ARTIFACT_PATH = 'test-results/perf/keepalive-budget.json';

/** The component whose behavior the artifact describes; hashed for staleness. */
export const SURFACE_STAGE_SOURCE = 'src/components/SurfaceStage.tsx';

/**
 * The exact hide mechanism a keepalive surface must carry while hidden.
 * `invisible` is Tailwind's `visibility:hidden` (keeps layout, drops the node
 * from the a11y tree and tab order); `absolute` + the off-screen translate take
 * it out of flow. Deliberately NOT `hidden`/`display:none` and NOT
 * `content-visibility:auto` — both throw the layout away, which is the cost
 * keepalive exists to avoid (final plan, Findings 7+14).
 */
export const HIDDEN_SURFACE_CLASSES =
  'invisible absolute inset-x-0 top-0 -translate-x-[200vw] pointer-events-none';

/** Class utilities that would defeat keepalive if they ever appeared. */
export const FORBIDDEN_HIDE_UTILITIES = ['hidden', 'content-visibility-auto'];

/** The six ordered surface transitions the measurement must cover. */
export const REQUIRED_TRANSITIONS = [
  'library->sheet',
  'sheet->scene',
  'scene->library',
  'library->scene',
  'scene->sheet',
  'sheet->library',
];

export const KEEPALIVE_BUDGETS = {
  /**
   * DOM ATTRIBUTE writes inside the stage per surface switch.
   *
   * MEASURED 2026-07-24 (happy-dom + React 18, real SurfaceStage + ShellContext,
   * every transition, every system, and under `<StrictMode>` exactly as
   * `main.tsx` mounts the app): 4 — `aria-hidden` and `class` on the outgoing
   * wrapper, `aria-hidden` and `class` on the incoming wrapper. Identical for
   * all six transitions and all seven systems.
   *
   * BUDGET 6 = measured 4 + one additional attribute on BOTH wrappers. The
   * margin is sized to exactly one plausible future a11y addition (e.g. pairing
   * `inert` with `aria-hidden`) so that change does not need a budget bump,
   * and no wider: it cannot hide the regression this gate exists for, because a
   * remount or re-layout shows up as childList mutations, which are budgeted at
   * a hard zero below and have no margin at all.
   */
  maxAttributeMutationsPerSwitch: 6,

  /**
   * DOM STRUCTURE writes inside the stage per surface switch — nodes inserted or
   * removed. MEASURED: 0 childList records, 0 nodes added, 0 nodes removed.
   *
   * BUDGET 0, with NO margin, on purpose. Keepalive means nothing enters or
   * leaves the stage on a switch. A single insert or remove IS the regression:
   * either a surface was unmounted and rebuilt, or its subtree was thrown away
   * and re-laid-out. Any nonzero margin here would defeat the gate.
   */
  maxChildListMutationsPerSwitch: 0,
  maxNodesAddedPerSwitch: 0,
  maxNodesRemovedPerSwitch: 0,

  /**
   * Component mounts of a surface subtree AFTER its first visit. MEASURED: 0
   * extra mounts across a full six-transition tour.
   *
   * Expressed as a delta from the post-first-visit baseline rather than an
   * absolute count, so the number is invariant under `<StrictMode>` (which
   * double-invokes effects on the FIRST mount only: absolute counts read 1
   * without StrictMode and 2 with it, while the delta is 0 either way).
   * BUDGET 0, no margin — one extra mount is a remount, which is the definition
   * of keepalive being broken.
   */
  maxExtraMountsAfterFirstVisit: 0,

  /**
   * The O(1) proof. The same tour is measured twice with keepalive subtrees of
   * very different size (1 node vs 200 nodes per surface). MEASURED: 4 attribute
   * mutations and 0 structural mutations in BOTH runs — switch cost does not
   * grow with the size of the hidden subtree. That invariance is the real
   * content of "the switch cannot drop a frame": it is what would break first if
   * a surface started being torn down and rebuilt, and unlike a millisecond
   * number it is exact. BUDGET: the large-subtree count must be EQUAL to the
   * small-subtree count.
   */
  subtreeScalingMustBeConstant: true,
  smallSubtreeNodes: 1,
  largeSubtreeNodes: 200,
};

function pushIf(violations, condition, message) {
  if (condition) violations.push(message);
}

/**
 * Pure evaluator shared by the measuring suite (which asserts inline, so a
 * regression also fails `npm test`) and `scripts/check-keepalive-budget.mjs`
 * (which re-asserts in the verify chain, so a suite that never ran cannot pass
 * the gate by silence). Returns the list of violations; empty means green.
 *
 * @param {unknown} report parsed artifact, or null when it is missing
 * @param {{ sourceHash?: string, systemIds?: string[] }} expected
 */
export function evaluateKeepaliveBudget(report, expected = {}) {
  const violations = [];

  if (report === null || typeof report !== 'object') {
    return [
      `no keepalive measurement at ${KEEPALIVE_ARTIFACT_PATH} — run \`npm test\` (the gate must never pass because the measurement is missing)`,
    ];
  }

  // Staleness: the artifact describes a specific SurfaceStage. If the component
  // changed without the suite re-running, the numbers describe the old
  // component and must not be trusted.
  if (expected.sourceHash && report.surfaceStageSourceSha256 !== expected.sourceHash) {
    violations.push(
      `keepalive measurement is stale: it was taken against ${SURFACE_STAGE_SOURCE}@${String(
        report.surfaceStageSourceSha256
      ).slice(
        0,
        12
      )} but the working tree has @${expected.sourceHash.slice(0, 12)} — re-run \`npm test\``
    );
  }

  const switches = Array.isArray(report.switches) ? report.switches : [];
  if (switches.length === 0) {
    violations.push('keepalive measurement recorded no surface switches');
  }

  for (const entry of switches) {
    const label = `${entry.systemId}: ${entry.from}->${entry.to}`;
    pushIf(
      violations,
      entry.attributeMutations > KEEPALIVE_BUDGETS.maxAttributeMutationsPerSwitch,
      `${label} wrote ${entry.attributeMutations} attributes (budget ${KEEPALIVE_BUDGETS.maxAttributeMutationsPerSwitch})`
    );
    pushIf(
      violations,
      entry.childListMutations > KEEPALIVE_BUDGETS.maxChildListMutationsPerSwitch,
      `${label} produced ${entry.childListMutations} structural DOM mutations (budget ${KEEPALIVE_BUDGETS.maxChildListMutationsPerSwitch}) — a surface was rebuilt instead of kept alive`
    );
    pushIf(
      violations,
      entry.nodesAdded > KEEPALIVE_BUDGETS.maxNodesAddedPerSwitch,
      `${label} inserted ${entry.nodesAdded} nodes (budget ${KEEPALIVE_BUDGETS.maxNodesAddedPerSwitch})`
    );
    pushIf(
      violations,
      entry.nodesRemoved > KEEPALIVE_BUDGETS.maxNodesRemovedPerSwitch,
      `${label} removed ${entry.nodesRemoved} nodes (budget ${KEEPALIVE_BUDGETS.maxNodesRemovedPerSwitch}) — surfaces must be hidden, not unmounted`
    );
    pushIf(
      violations,
      entry.extraMountsAfterFirstVisit > KEEPALIVE_BUDGETS.maxExtraMountsAfterFirstVisit,
      `${label} remounted a surface ${entry.extraMountsAfterFirstVisit} extra time(s) (budget ${KEEPALIVE_BUDGETS.maxExtraMountsAfterFirstVisit})`
    );

    for (const hidden of entry.hiddenSurfaces ?? []) {
      pushIf(
        violations,
        !hidden.connected,
        `${label}: hidden surface "${hidden.surface}" left the document — keepalive surfaces stay mounted`
      );
      pushIf(
        violations,
        hidden.ariaHidden !== 'true',
        `${label}: hidden surface "${hidden.surface}" has aria-hidden=${JSON.stringify(hidden.ariaHidden)} (expected "true")`
      );
      pushIf(
        violations,
        hidden.className !== HIDDEN_SURFACE_CLASSES,
        `${label}: hidden surface "${hidden.surface}" carries ${JSON.stringify(hidden.className)} instead of the keepalive hide mechanism ${JSON.stringify(HIDDEN_SURFACE_CLASSES)}`
      );
      pushIf(
        violations,
        hidden.hasHiddenAttribute === true,
        `${label}: hidden surface "${hidden.surface}" uses the \`hidden\` attribute (display:none) — that discards layout, which keepalive exists to preserve`
      );
      for (const utility of FORBIDDEN_HIDE_UTILITIES) {
        pushIf(
          violations,
          String(hidden.className ?? '')
            .split(/\s+/)
            .includes(utility),
          `${label}: hidden surface "${hidden.surface}" uses the forbidden hide utility "${utility}"`
        );
      }
    }
  }

  // All-seven: the shell is shared, so every registered system must be measured
  // through it. The expected ids come from the live registry, never a literal
  // list, so adding an eighth system cannot silently skip the gate.
  const measuredSystems = new Set(switches.map((entry) => entry.systemId));
  for (const systemId of expected.systemIds ?? []) {
    pushIf(
      violations,
      !measuredSystems.has(systemId),
      `system "${systemId}" is registered but was never measured through the keepalive stage — the budget must cover all systems equally`
    );
  }

  const measuredTransitions = new Set(switches.map((entry) => `${entry.from}->${entry.to}`));
  for (const transition of REQUIRED_TRANSITIONS) {
    pushIf(
      violations,
      !measuredTransitions.has(transition),
      `transition ${transition} was never measured — the budget must cover every ordered surface pair`
    );
  }

  const scaling = report.subtreeScaling;
  if (!scaling || typeof scaling !== 'object') {
    violations.push('keepalive measurement is missing the subtree-scaling (O(1)) probe');
  } else if (
    KEEPALIVE_BUDGETS.subtreeScalingMustBeConstant &&
    scaling.largeAttributeMutations !== scaling.smallAttributeMutations
  ) {
    violations.push(
      `switch cost grew with hidden-subtree size: ${scaling.smallSubtreeNodes}-node subtree wrote ${scaling.smallAttributeMutations} attributes but ${scaling.largeSubtreeNodes}-node subtree wrote ${scaling.largeAttributeMutations} — keepalive must be O(1) in subtree size`
    );
  }

  return violations;
}
