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
 * a hardcoded default-allegiance fake. Records the post-drop reconcile time and
 * asserts it under an explicit budget. The 16ms/33ms feel budget is a real-paint
 * concern owned by Playwright; jsdom has no layout, so this CI proxy asserts the
 * reconcile does a bounded amount of synchronous work over 900 cells and that
 * each sub-gate emits the RIGHT existing intent with the RIGHT chip behavior.
 */

// Explicit CI reconcile budget (ms of synchronous work in jsdom over 900 cells).
const RECONCILE_BUDGET_MS = 50;

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
}: {
  emit: SceneEmit;
  documents: CharacterDocument<SystemDataModel>[];
  resolveStatblock: (id: string) => Monster | undefined;
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
        {/* Transformed surface: scale 1.5 + translate, ~900 cells. */}
        <SpikeGrid scale={1.5} tx={20} ty={10} gridRef={gridRef} />
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
 *  measured post-drop reconcile time (ms). */
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
    const start = performance.now();
    act(() => {
      fireEvent.pointerUp(window, {
        clientX: 300,
        clientY: 300,
        pointerId: 1,
        pointerType: 'mouse',
      });
    });
    return performance.now() - start;
  } finally {
    spy.mockRestore();
  }
}

afterEach(() => cleanup());

describe('Phase-4 two-part prototype GATE on the transformed ~900-cell spike', () => {
  it('3b-i (party 1-choice): drops place-token with NO chip, within the reconcile budget', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    const { container } = render(
      <DragProvider>
        <Harness emit={emit} documents={[doc()]} resolveStatblock={() => undefined} />
      </DragProvider>
    );
    const reconcileMs = performDrag(screen.getByTestId('party-src'), container, 5, 4);

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
    console.info(`[gate] 3b-i party reconcile: ${reconcileMs.toFixed(2)}ms`);
    expect(reconcileMs).toBeLessThan(RECONCILE_BUDGET_MS);
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

    const start = performance.now();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Hostile' }));
    });
    const reconcileMs = performance.now() - start;

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit.mock.calls[0][0]).toMatchObject({
      type: 'place-token',
      token: { kind: 'npc', allegiance: 'hostile', position: { x: 12, y: 9 }, refId: 'goblin' },
    });
    console.info(`[gate] 3b-ii monster reconcile: ${reconcileMs.toFixed(2)}ms`);
    expect(reconcileMs).toBeLessThan(RECONCILE_BUDGET_MS);
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
