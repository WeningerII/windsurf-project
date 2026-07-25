import { StrictMode, useEffect } from 'react';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { SurfaceStage } from '../../components/SurfaceStage';
import { ShellProvider } from '../../contexts/ShellContext';
import { useAppNav } from '../../hooks/useAppNav';
import type { Surface } from '../../contexts/shell-context';
import { systemRegistry } from '../../registry';
import { registerAllSystems } from '../../systems';
import {
  KEEPALIVE_ARTIFACT_PATH,
  KEEPALIVE_BUDGETS,
  SURFACE_STAGE_SOURCE,
  evaluateKeepaliveBudget,
} from '../../../scripts/lib/shellKeepaliveBudget.mjs';

/**
 * UI-shell Phase 7 — the keepalive frame budget as a HARD, DETERMINISTIC gate.
 *
 * `SurfaceStage.test.tsx` already pins the hide MECHANISM (aria-hidden, the
 * exact hide classes, mounted-not-unmounted). This suite pins the COST: how much
 * work a surface switch is allowed to do, measured with a `MutationObserver` on
 * the real stage driven through the real `ShellContext` reducer.
 *
 * The full derivation of every number — and the argument for why this is
 * counted rather than timed — lives in `scripts/lib/shellKeepaliveBudget.mjs`.
 * The short version: a keepalive switch is two attribute writes, which is
 * sub-millisecond work sitting under a tens-of-milliseconds CI noise floor, so a
 * wall-clock threshold is either flaky or too wide to detect anything. Counts
 * are exact on any machine.
 *
 * This suite also EMITS `test-results/perf/keepalive-budget.json`, which
 * `scripts/check-keepalive-budget.mjs` re-asserts inside `npm run verify`. The
 * inline assertions mean a regression fails `npm test`; the artifact means a
 * suite that never ran cannot pass the gate by silence.
 */

const SURFACES: readonly Surface[] = ['library', 'sheet', 'scene'];

/** Ordered tour visiting every surface pair exactly once (a 6-edge circuit). */
const TOUR: ReadonlyArray<{ from: Surface; to: Surface }> = [
  { from: 'library', to: 'sheet' },
  { from: 'sheet', to: 'scene' },
  { from: 'scene', to: 'library' },
  { from: 'library', to: 'scene' },
  { from: 'scene', to: 'sheet' },
  { from: 'sheet', to: 'library' },
];

interface HiddenSurfaceReport {
  surface: Surface;
  connected: boolean;
  ariaHidden: string | null;
  className: string;
  hasHiddenAttribute: boolean;
}

interface SwitchReport {
  systemId: string;
  from: Surface;
  to: Surface;
  attributeMutations: number;
  childListMutations: number;
  nodesAdded: number;
  nodesRemoved: number;
  extraMountsAfterFirstVisit: number;
  hiddenSurfaces: HiddenSurfaceReport[];
  /**
   * SOFT-LOGGED ONLY. Recorded so a future ratchet has real data, and never
   * read by `evaluateKeepaliveBudget` — see that module for why wall-clock
   * cannot be a hard gate here.
   */
  softLoggedSwitchMillis: number;
}

/** Mount tally per surface; a remount is the regression this gate catches. */
const mountCounts: Record<string, number> = {};

function Probe({ surface, nodes }: { surface: Surface; nodes: number }) {
  useEffect(() => {
    mountCounts[surface] = (mountCounts[surface] ?? 0) + 1;
  }, [surface]);
  return (
    <div data-probe={surface}>
      {Array.from({ length: nodes }, (_, index) => (
        <span key={index}>{`${surface}-node-${index}`}</span>
      ))}
    </div>
  );
}

/**
 * Mirrors App's slot wiring: owner-rendered subtrees, sheet slot null until a
 * document is open. The `systemId` only labels the sheet subtree — the stage is
 * shared shell code and never sees system code, which is exactly the property
 * the all-seven sweep below is checking holds numerically.
 */
function Harness({ systemId, nodes }: { systemId: string; nodes: number }) {
  const { nav, setSurface, openSheet } = useAppNav();
  return (
    <>
      {SURFACES.map((surface) => (
        <button key={surface} onClick={() => setSurface(surface)}>{`go-${surface}`}</button>
      ))}
      <button onClick={() => openSheet(`${systemId}-doc`)}>open-sheet</button>
      <SurfaceStage
        library={<Probe surface="library" nodes={nodes} />}
        sheet={nav.sheetDocId !== null ? <Probe surface="sheet" nodes={nodes} /> : null}
        scene={<Probe surface="scene" nodes={nodes} />}
      />
    </>
  );
}

function surfaceWrapper(surface: Surface): HTMLElement | null {
  return document.querySelector(`[data-surface="${surface}"]`);
}

/**
 * Drive one system's full tour and report per-switch DOM work.
 *
 * `MutationObserver` delivers asynchronously, and `await user.click(...)` lets
 * that microtask run, so the callback is buffered AND `takeRecords()` is drained
 * at read time. Both together make the count exact regardless of scheduling.
 */
async function measureTour(systemId: string, nodes: number): Promise<SwitchReport[]> {
  for (const key of Object.keys(mountCounts)) delete mountCounts[key];
  const user = userEvent.setup();
  const view = render(
    // `main.tsx` mounts the app inside StrictMode; measuring under it keeps the
    // numbers honest about the double-invoke the app really runs with.
    <StrictMode>
      <ShellProvider>
        <Harness systemId={systemId} nodes={nodes} />
      </ShellProvider>
    </StrictMode>
  );

  // First visits: every surface joins the keepalive set before measuring, so
  // the tour measures switching, never first-mount cost.
  await user.click(screen.getByRole('button', { name: 'open-sheet' }));
  await user.click(screen.getByRole('button', { name: 'go-scene' }));
  await user.click(screen.getByRole('button', { name: 'go-library' }));
  const baselineMounts = { ...mountCounts };

  const stage = surfaceWrapper('library')?.parentElement;
  expect(stage, 'the keepalive stage root must exist after first visits').toBeTruthy();

  const buffered: MutationRecord[] = [];
  const observer = new MutationObserver((records) => buffered.push(...records));
  observer.observe(stage as Node, { attributes: true, childList: true, subtree: true });

  const reports: SwitchReport[] = [];
  try {
    for (const { from, to } of TOUR) {
      expect(surfaceWrapper(from)).toHaveAttribute('aria-hidden', 'false');
      buffered.push(...observer.takeRecords());
      buffered.length = 0;

      const startedAt = performance.now();
      await user.click(screen.getByRole('button', { name: `go-${to}` }));
      const softLoggedSwitchMillis = performance.now() - startedAt;

      buffered.push(...observer.takeRecords());
      const records = [...buffered];
      buffered.length = 0;

      const extraMounts = SURFACES.reduce(
        (total, surface) => total + ((mountCounts[surface] ?? 0) - (baselineMounts[surface] ?? 0)),
        0
      );

      reports.push({
        systemId,
        from,
        to,
        attributeMutations: records.filter((record) => record.type === 'attributes').length,
        childListMutations: records.filter((record) => record.type === 'childList').length,
        nodesAdded: records.reduce((total, record) => total + record.addedNodes.length, 0),
        nodesRemoved: records.reduce((total, record) => total + record.removedNodes.length, 0),
        extraMountsAfterFirstVisit: extraMounts,
        hiddenSurfaces: SURFACES.filter((surface) => surface !== to).map((surface) => {
          const element = surfaceWrapper(surface);
          return {
            surface,
            connected: element?.isConnected === true,
            ariaHidden: element?.getAttribute('aria-hidden') ?? null,
            className: element?.className ?? '',
            hasHiddenAttribute: element?.hasAttribute('hidden') === true,
          };
        }),
        softLoggedSwitchMillis,
      });
    }
  } finally {
    observer.disconnect();
    view.unmount();
  }

  return reports;
}

let systemIds: string[] = [];

beforeAll(() => {
  registerAllSystems();
  systemIds = systemRegistry.getAll().map((definition) => definition.id);
});

describe('SurfaceStage keepalive budget (hard gate)', () => {
  it('covers every registered system — no system may skip the shared shell budget', () => {
    // Read from the live registry rather than a literal list, so an eighth
    // system cannot be added without this gate noticing.
    expect(systemIds.length).toBeGreaterThanOrEqual(7);
    expect(new Set(systemIds).size).toBe(systemIds.length);
  });

  it('holds the keepalive budget for all systems, all transitions, and emits the CI artifact', async () => {
    const switches: SwitchReport[] = [];
    for (const systemId of systemIds) {
      switches.push(...(await measureTour(systemId, KEEPALIVE_BUDGETS.smallSubtreeNodes)));
    }

    // O(1) probe: the identical tour with a 200-node keepalive subtree per
    // surface. Equal counts prove switch cost does not scale with what is being
    // kept alive — the property a millisecond threshold was only approximating.
    const largeSubtreeTour = await measureTour(systemIds[0], KEEPALIVE_BUDGETS.largeSubtreeNodes);
    const smallAttributeMutations = Math.max(
      ...switches
        .filter((entry) => entry.systemId === systemIds[0])
        .map((entry) => entry.attributeMutations)
    );
    const largeAttributeMutations = Math.max(
      ...largeSubtreeTour.map((entry) => entry.attributeMutations)
    );

    const report = {
      generatedBy: 'src/__tests__/components/SurfaceStageKeepaliveBudget.test.tsx',
      surfaceStageSourceSha256: createHash('sha256')
        .update(readFileSync(path.resolve(process.cwd(), SURFACE_STAGE_SOURCE)))
        .digest('hex'),
      systemIds,
      switches,
      subtreeScaling: {
        smallSubtreeNodes: KEEPALIVE_BUDGETS.smallSubtreeNodes,
        largeSubtreeNodes: KEEPALIVE_BUDGETS.largeSubtreeNodes,
        smallAttributeMutations,
        largeAttributeMutations,
      },
    };

    const artifactPath = path.resolve(process.cwd(), KEEPALIVE_ARTIFACT_PATH);
    mkdirSync(path.dirname(artifactPath), { recursive: true });
    writeFileSync(artifactPath, `${JSON.stringify(report, null, 2)}\n`);

    // Assert inline with the SAME evaluator the verify-chain gate uses, so a
    // regression fails `npm test` too and the two can never disagree.
    const violations = evaluateKeepaliveBudget(report, {
      sourceHash: report.surfaceStageSourceSha256,
      systemIds,
    });
    expect(violations, violations.join('\n')).toEqual([]);
  }, 60_000);
});
