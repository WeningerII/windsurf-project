import { describe, expect, it } from 'vitest';
import {
  HIDDEN_SURFACE_CLASSES,
  KEEPALIVE_BUDGETS,
  REQUIRED_TRANSITIONS,
  evaluateKeepaliveBudget,
} from '../../../scripts/lib/shellKeepaliveBudget.mjs';

/**
 * Self-check for the keepalive gate's evaluator (UI-shell Phase 7).
 *
 * A budget gate is only worth its CI minutes if it actually fails. These cases
 * prove each hard assertion rejects the corresponding regression — including the
 * two silent-pass holes that matter most: a MISSING measurement, and a
 * measurement taken against a different SurfaceStage than the one in the tree.
 */

const SYSTEM_IDS = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

function hidden(surface: string) {
  return {
    surface,
    connected: true,
    ariaHidden: 'true',
    className: HIDDEN_SURFACE_CLASSES,
    hasHiddenAttribute: false,
  };
}

function greenSwitch(systemId: string, transition: string) {
  const [from, to] = transition.split('->');
  return {
    systemId,
    from,
    to,
    attributeMutations: 4,
    childListMutations: 0,
    nodesAdded: 0,
    nodesRemoved: 0,
    extraMountsAfterFirstVisit: 0,
    hiddenSurfaces: ['library', 'sheet', 'scene']
      .filter((surface) => surface !== to)
      .map((surface) => hidden(surface)),
    softLoggedSwitchMillis: 1234,
  };
}

function greenReport() {
  return {
    surfaceStageSourceSha256: 'abc123',
    systemIds: [...SYSTEM_IDS],
    switches: SYSTEM_IDS.flatMap((systemId) =>
      REQUIRED_TRANSITIONS.map((transition: string) => greenSwitch(systemId, transition))
    ),
    subtreeScaling: {
      smallSubtreeNodes: KEEPALIVE_BUDGETS.smallSubtreeNodes,
      largeSubtreeNodes: KEEPALIVE_BUDGETS.largeSubtreeNodes,
      smallAttributeMutations: 4,
      largeAttributeMutations: 4,
    },
  };
}

const expected = { sourceHash: 'abc123', systemIds: SYSTEM_IDS };

describe('keepalive budget evaluator', () => {
  it('passes the measured baseline', () => {
    expect(evaluateKeepaliveBudget(greenReport(), expected)).toEqual([]);
  });

  it('fails when the measurement is missing entirely', () => {
    const violations = evaluateKeepaliveBudget(null, expected);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('no keepalive measurement');
  });

  it('fails when the measurement was taken against a different SurfaceStage', () => {
    const report = greenReport();
    report.surfaceStageSourceSha256 = 'deadbeef';
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain('stale');
  });

  it('fails on a single structural DOM mutation — the remount signature', () => {
    const report = greenReport();
    report.switches[3].childListMutations = 1;
    report.switches[3].nodesRemoved = 1;
    const message = evaluateKeepaliveBudget(report, expected).join('\n');
    expect(message).toContain('structural DOM mutations');
    expect(message).toContain('hidden, not unmounted');
  });

  it('fails when a surface remounts across a switch', () => {
    const report = greenReport();
    report.switches[0].extraMountsAfterFirstVisit = 1;
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain('remounted');
  });

  it('tolerates one extra attribute pair but rejects an attribute storm', () => {
    const withinMargin = greenReport();
    withinMargin.switches[1].attributeMutations = KEEPALIVE_BUDGETS.maxAttributeMutationsPerSwitch;
    expect(evaluateKeepaliveBudget(withinMargin, expected)).toEqual([]);

    const overBudget = greenReport();
    overBudget.switches[1].attributeMutations =
      KEEPALIVE_BUDGETS.maxAttributeMutationsPerSwitch + 1;
    expect(evaluateKeepaliveBudget(overBudget, expected).join('\n')).toContain(
      'wrote 7 attributes'
    );
  });

  it('fails when a hidden surface leaves the document or loses aria-hidden', () => {
    const detached = greenReport();
    detached.switches[0].hiddenSurfaces[0].connected = false;
    expect(evaluateKeepaliveBudget(detached, expected).join('\n')).toContain('left the document');

    const exposed = greenReport();
    exposed.switches[0].hiddenSurfaces[0].ariaHidden = 'false';
    expect(evaluateKeepaliveBudget(exposed, expected).join('\n')).toContain('aria-hidden');
  });

  it('fails when a hidden surface switches to display:none', () => {
    const viaAttribute = greenReport();
    viaAttribute.switches[0].hiddenSurfaces[0].hasHiddenAttribute = true;
    expect(evaluateKeepaliveBudget(viaAttribute, expected).join('\n')).toContain('display:none');

    const viaUtility = greenReport();
    viaUtility.switches[0].hiddenSurfaces[0].className = 'hidden absolute';
    const message = evaluateKeepaliveBudget(viaUtility, expected).join('\n');
    expect(message).toContain('forbidden hide utility "hidden"');
  });

  it('fails when a registered system was never measured', () => {
    const report = greenReport();
    report.switches = report.switches.filter((entry) => entry.systemId !== 'daggerheart');
    report.systemIds = report.systemIds.filter((id) => id !== 'daggerheart');
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain(
      'system "daggerheart" is registered but was never measured'
    );
  });

  it('fails when a surface transition was never measured', () => {
    const report = greenReport();
    report.switches = report.switches.filter(
      (entry) => `${entry.from}->${entry.to}` !== 'scene->sheet'
    );
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain(
      'transition scene->sheet was never measured'
    );
  });

  it('fails when switch cost grows with hidden-subtree size', () => {
    const report = greenReport();
    report.subtreeScaling.largeAttributeMutations = 5;
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain(
      'grew with hidden-subtree size'
    );
  });

  it('fails when the subtree-scaling probe is absent', () => {
    const report = greenReport() as Record<string, unknown>;
    delete report.subtreeScaling;
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain('subtree-scaling');
  });

  it('fails when the measurement recorded no switches at all', () => {
    const report = greenReport();
    report.switches = [];
    expect(evaluateKeepaliveBudget(report, expected).join('\n')).toContain('no surface switches');
  });
});
