import { describe, it, expect, vi, afterEach } from 'vitest';
import { useRef } from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { DragProvider } from '../../components/drag/DragProvider';
import { useDragSource } from '../../components/drag/dragContext';
import { SceneDropController } from '../../components/drag/SceneDropController';
import { SceneDispatchContext, type SceneEmit } from '../../contexts/scene-dispatch-context';
import { SpikeGrid } from './spikeHarness';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Monster } from '../../types/creatures/monsters';
import type { SceneActionIntent } from '../../types/core/scene';

/**
 * THE GATE (Finding 3): both sub-gates evaluated against the transformed
 * ~900-cell spike (scale+translate), NOT the trivial untransformed grid and NOT
 * a hardcoded default-allegiance fake. Asserts the post-drop reconcile does a
 * bounded amount of work over 900 cells, and that each sub-gate emits the RIGHT
 * existing intent with the RIGHT chip behavior. The 16ms/33ms feel budget is a
 * real-paint concern owned by Playwright; jsdom has no layout.
 *
 * INSTRUMENT CHANGED 2026-07-28 — was `performance.now()` against a 50ms budget.
 *
 * The intent above was always "bounded WORK"; wall-clock was only ever a proxy
 * for it, and it is a proxy that measures the scheduler as much as the code.
 * Once the unit suite started running four workers in parallel, this test
 * failed roughly 1 run in 3 under contention — not because the reconcile
 * regressed, but because four workers were sharing four cores. A millisecond
 * assertion cannot distinguish "the code got slower" from "the machine was
 * busy", so it cannot be a gate.
 *
 * This repo already reached that conclusion once. `check:keepalive-budget`
 * counts DOM writes rather than wall-clock precisely because the observed
 * timing spread was "an order of magnitude above the signal"
 * (docs/MASTER_PLAN.md). This gate never got the same treatment; now it has.
 *
 * What replaces it is strictly stronger than the old budget, not weaker:
 *   - DOM mutations during the reconcile are COUNTED, deterministically.
 *   - The same drop is run on a 900-cell grid and a 100-cell grid, and the
 *     counts must be EQUAL. That is the actual invariant the ms budget was
 *     gesturing at — the reconcile must not scale with cell count. A regression
 *     that made the drop touch every cell would pass a 50ms budget on a fast
 *     machine and fail this on any machine.
 */

/**
 * Absolute ceiling on DOM mutations for one drop reconcile.
 *
 * MEASURED: 1, for both sub-gates and at both grid sizes. The ceiling is 8 —
 * headroom for incidental markup churn, but nowhere near enough to hide a
 * reconcile that started touching cells (900 cells would be ~900). Set from the
 * numbers the tests print, not guessed. The old 50ms budget, by comparison,
 * would have accepted a 40x regression on an idle machine while failing a
 * correct one on a busy machine.
 */
const RECONCILE_MUTATION_CEILING = 8;

/**
 * Count DOM mutations produced by `fn`, deterministically.
 *
 * `takeRecords()` drains synchronously, so this does not depend on microtask
 * timing the way an observer callback would — and therefore does not care how
 * loaded the machine is.
 */
function countMutations(root: Node, fn: () => void): number {
  const observer = new MutationObserver(() => {});
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  try {
    fn();
    return observer.takeRecords().length;
  } finally {
    observer.disconnect();
  }
}

const now = new Date('2026-06-20T00:00:00.000Z');
function doc(): CharacterDocument<SystemDataModel> {
  return {
    id: 'doc-1',
    name: 'Astra',
    systemId: 'dnd-5e-2024',
    system: {} as SystemDataModel,
    createdAt: now,
    updatedAt: now,
  };
}
function goblin(): Monster {
  return {
    id: 'goblin',
    name: 'Goblin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'small',
    type: 'humanoid',
    alignment: 'neutral evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 15,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: [],
    languages: [],
    actions: [],
  } as Monster;
}

function Harness({
  emit,
  documents,
  resolveStatblock,
  width,
  height,
}: {
  emit: SceneEmit;
  documents: CharacterDocument<SystemDataModel>[];
  resolveStatblock: (id: string) => Monster | undefined;
  width?: number;
  height?: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const makeDrag = useDragSource();
  return (
    <>
      <div
        data-testid="party-src"
        {...makeDrag({ kind: 'character', documentId: 'doc-1', label: 'Astra' })}
      >
        Astra
      </div>
      <div
        data-testid="monster-src"
        {...makeDrag({ kind: 'monster', monsterId: 'goblin', label: 'Goblin' })}
      >
        Goblin
      </div>
      <SceneDispatchContext.Provider value={emit}>
        {/* Transformed surface: scale 1.5 + translate, ~900 cells by default. */}
        <SpikeGrid scale={1.5} tx={20} ty={10} gridRef={gridRef} width={width} height={height} />
        <SceneDropController
          gridRef={gridRef}
          documents={documents}
          resolveStatblock={resolveStatblock}
        />
      </SceneDispatchContext.Provider>
    </>
  );
}

/** Drive a full pointer drag from `source` to the given spike cell; returns the
 *  number of DOM mutations produced by the post-drop reconcile. */
function performDrag(source: HTMLElement, container: HTMLElement, cx: number, cy: number): number {
  const cell = container.querySelector<HTMLElement>(`[data-x="${cx}"][data-y="${cy}"]`)!;
  const spy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(cell);
  try {
    act(() => {
      fireEvent.pointerDown(source, {
        clientX: 5,
        clientY: 5,
        button: 0,
        pointerId: 1,
        pointerType: 'mouse',
      });
    });
    act(() => {
      // Above-tolerance move → activates the drag.
      fireEvent.pointerMove(window, {
        clientX: 60,
        clientY: 60,
        pointerId: 1,
        pointerType: 'mouse',
      });
    });
    // Observe document.body: the drop chip is portaled, so it is NOT inside the
    // grid container and a container-scoped observer would miss it entirely.
    return countMutations(document.body, () => {
      act(() => {
        fireEvent.pointerUp(window, {
          clientX: 300,
          clientY: 300,
          pointerId: 1,
          pointerType: 'mouse',
        });
      });
    });
  } finally {
    spy.mockRestore();
  }
}

afterEach(() => cleanup());

describe('Phase-4 two-part prototype GATE on the transformed ~900-cell spike', () => {
  /**
   * Self-check on the measuring device.
   *
   * Every assertion below is only worth what `countMutations` is worth, and a
   * counter that silently returned 0 would make this whole file pass no matter
   * what the reconcile did — the "gate that cannot fail" shape this repo keeps
   * finding. So: prove it counts, and prove it counts PER unit of work, which
   * is the property the scale-invariance test depends on.
   */
  it('the mutation counter responds proportionally to actual DOM work', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    try {
      expect(countMutations(host, () => {})).toBe(0);
      expect(countMutations(host, () => host.appendChild(document.createElement('span')))).toBe(1);
      expect(
        countMutations(host, () => {
          for (let i = 0; i < 25; i++) host.appendChild(document.createElement('span'));
        })
      ).toBe(25);
    } finally {
      host.remove();
    }
  });

  it('3b-i (party 1-choice): drops place-token with NO chip, within the reconcile budget', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    const { container } = render(
      <DragProvider>
        <Harness emit={emit} documents={[doc()]} resolveStatblock={() => undefined} />
      </DragProvider>
    );
    const mutations = performDrag(screen.getByTestId('party-src'), container, 5, 4);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit.mock.calls[0][0]).toMatchObject({
      type: 'place-token',
      token: {
        kind: 'character',
        playerControlled: true,
        position: { x: 5, y: 4 },
        refId: 'doc-1',
      },
    });
    expect(screen.queryByRole('dialog')).toBeNull(); // auto-apply, no menu
    // Recorded gate metric.
    console.info(`[gate] 3b-i party reconcile: ${mutations} DOM mutations`);
    expect(mutations).toBeLessThan(RECONCILE_MUTATION_CEILING);
  });

  it('3b-ii (monster 2+): drops render the chip; choosing lands place-token with allegiance, within budget', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    const { container } = render(
      <DragProvider>
        <Harness emit={emit} documents={[]} resolveStatblock={() => goblin()} />
      </DragProvider>
    );
    performDrag(screen.getByTestId('monster-src'), container, 12, 9);

    // The chip is up and nothing emitted yet (2+ outcomes).
    expect(emit).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: /Place Goblin/i })).toBeInTheDocument();

    const mutations = countMutations(document.body, () => {
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Hostile' }));
      });
    });

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit.mock.calls[0][0]).toMatchObject({
      type: 'place-token',
      token: { kind: 'npc', allegiance: 'hostile', position: { x: 12, y: 9 }, refId: 'goblin' },
    });
    console.info(`[gate] 3b-ii monster reconcile: ${mutations} DOM mutations`);
    expect(mutations).toBeLessThan(RECONCILE_MUTATION_CEILING);
  });

  /**
   * The sharp assertion, and the one the millisecond budget could never make.
   *
   * A drop must cost the same whether the surface has 100 cells or 900. If a
   * regression made the reconcile touch every cell, a 50ms wall-clock budget
   * would still pass on an idle machine and fail intermittently on a busy one —
   * the exact behaviour that made the old instrument unusable. Comparing two
   * sizes in the same process, on the same machine, in the same run answers
   * "does this scale?" with no timing in the loop at all.
   */
  it('costs the same on a 900-cell grid as on a 100-cell grid (reconcile does not scale with cell count)', () => {
    function dropOn(width: number, height: number): number {
      const emit = vi.fn((_intent: SceneActionIntent) => true);
      const { container, unmount } = render(
        <DragProvider>
          <Harness
            emit={emit}
            documents={[doc()]}
            resolveStatblock={() => undefined}
            width={width}
            height={height}
          />
        </DragProvider>
      );
      const mutations = performDrag(screen.getByTestId('party-src'), container, 5, 4);
      expect(emit).toHaveBeenCalledTimes(1); // the drop really landed
      unmount();
      return mutations;
    }

    const small = dropOn(10, 10); // 100 cells
    const large = dropOn(30, 30); // 900 cells, the shipped spike

    console.info(`[gate] reconcile scaling: 100 cells → ${small}, 900 cells → ${large}`);
    expect(large).toBe(small);
  });

  it('an off-grid release (elementFromPoint over no cell) emits nothing (snap-back)', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    render(
      <DragProvider>
        <Harness emit={emit} documents={[doc()]} resolveStatblock={() => undefined} />
      </DragProvider>
    );
    const spy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(document.body);
    act(() => {
      fireEvent.pointerDown(screen.getByTestId('party-src'), {
        clientX: 5,
        clientY: 5,
        button: 0,
        pointerId: 1,
        pointerType: 'mouse',
      });
    });
    act(() => {
      fireEvent.pointerMove(window, {
        clientX: 60,
        clientY: 60,
        pointerId: 1,
        pointerType: 'mouse',
      });
    });
    act(() => {
      fireEvent.pointerUp(window, {
        clientX: 9999,
        clientY: 9999,
        pointerId: 1,
        pointerType: 'mouse',
      });
    });
    spy.mockRestore();
    expect(emit).not.toHaveBeenCalled();
  });
});
