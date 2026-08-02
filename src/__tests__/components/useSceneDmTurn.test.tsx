import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DM_TURN_STALE_MESSAGE, useSceneDmTurn } from '../../components/scene/useSceneDmTurn';
import type { DmTurnResult } from '../../ai/dmTurnFlow';
import { runDmTurn } from '../../ai/dmTurnFlow';
import {
  appendSceneEvent,
  applySceneIntents,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type { SceneDocument, SceneEvent, SceneToken } from '../../types/core/scene';

vi.mock('../../ai/dmTurnFlow', () => ({ runDmTurn: vi.fn() }));

const runDmTurnMock = vi.mocked(runDmTurn);

const AT = new Date('2026-08-02T12:00:00.000Z');

function tokenAt(id: string, name: string, x: number, y: number): SceneToken {
  return { id, name, kind: 'monster', position: { x, y }, size: 1 };
}

/** A scene with one placed token, built through the runtime's own path. */
function sceneWithGrish(): SceneDocument {
  const base = createSceneDocument({
    id: 'scene-1',
    name: 'The Crypt',
    systemId: 'dnd-5e-2024',
    seed: 'seed',
    now: AT,
  });
  const placed = resolveSceneAction(
    base,
    { type: 'place-token', token: tokenAt('t1', 'Grish', 1, 1) },
    { eventId: 'e1', createdAt: AT }
  );
  return appendSceneEvent(base, placed.event!);
}

/** The move the AI-DM would propose, resolved exactly as `runDmTurn` resolves it. */
function proposedMove(scene: SceneDocument, to: { x: number; y: number }): SceneEvent[] {
  return applySceneIntents(
    scene,
    [{ type: 'move-token', actorId: 'ai-dm', tokenId: 't1', position: to }],
    { eventIdFactory: () => 'dm-1', now: () => AT }
  ).events;
}

function okResult(events: SceneEvent[]): DmTurnResult {
  return { ok: true, events, pending: [], rejected: [] };
}

describe('useSceneDmTurn', () => {
  beforeEach(() => {
    runDmTurnMock.mockReset();
  });

  it('runs the turn for the token the runtime says is up, not the grid selection', async () => {
    const scene = sceneWithGrish();
    const { state } = foldSceneEvents(scene);
    runDmTurnMock.mockResolvedValue(okResult([]));

    const { result } = renderHook(() =>
      useSceneDmTurn({
        selectedScene: scene,
        state: { ...state, activeTokenId: 't1' },
        selectedTokenId: 'someone-else',
        onAppendSceneEvent: vi.fn(),
      })
    );

    expect(result.current.dmTurnActor).toEqual({ id: 't1', name: 'Grish' });
    await act(async () => {
      await result.current.handleRunDmTurn({ moveDistance: 3 });
    });
    expect(runDmTurnMock).toHaveBeenCalledWith(scene, { actorTokenId: 't1', moveDistance: 3 });
  });

  it('falls back to the grid selection only when no initiative names an actor', () => {
    const scene = sceneWithGrish();
    const { state } = foldSceneEvents(scene);
    const { result } = renderHook(() =>
      useSceneDmTurn({
        selectedScene: scene,
        state,
        selectedTokenId: 't1',
        onAppendSceneEvent: vi.fn(),
      })
    );
    expect(state.activeTokenId).toBeUndefined();
    expect(result.current.dmTurnActor).toEqual({ id: 't1', name: 'Grish' });
  });

  it('passes an offered check through to the flow as its option pool', async () => {
    const scene = sceneWithGrish();
    const { state } = foldSceneEvents(scene);
    runDmTurnMock.mockResolvedValue(okResult([]));
    const { result } = renderHook(() =>
      useSceneDmTurn({
        selectedScene: scene,
        state,
        selectedTokenId: 't1',
        onAppendSceneEvent: vi.fn(),
      })
    );

    await act(async () => {
      await result.current.handleRunDmTurn({
        moveDistance: 2,
        check: { label: 'Stealth', modifier: 4, dc: 13 },
      });
    });

    expect(runDmTurnMock).toHaveBeenCalledWith(scene, {
      actorTokenId: 't1',
      moveDistance: 2,
      checks: [{ label: 'Stealth', modifier: 4, dc: 13 }],
    });
  });

  it('appends nothing until the turn is applied, then appends exactly the reviewed events', async () => {
    const scene = sceneWithGrish();
    const { state } = foldSceneEvents(scene);
    const events = proposedMove(scene, { x: 3, y: 1 });
    runDmTurnMock.mockResolvedValue(okResult(events));
    const onAppendSceneEvent = vi.fn();

    const { result } = renderHook(() =>
      useSceneDmTurn({
        selectedScene: scene,
        state,
        selectedTokenId: 't1',
        onAppendSceneEvent,
      })
    );

    await act(async () => {
      await result.current.handleRunDmTurn({ moveDistance: 3 });
    });
    // Proposing is not applying: the model has answered and the scene is untouched.
    expect(onAppendSceneEvent).not.toHaveBeenCalled();

    let refusal: string | null = 'unset';
    act(() => {
      refusal = result.current.handleApplyDmTurn(events);
    });
    expect(refusal).toBeNull();
    expect(onAppendSceneEvent).toHaveBeenCalledTimes(1);
    expect(onAppendSceneEvent).toHaveBeenCalledWith('scene-1', events[0]);
  });

  it('refuses to apply a turn proposed against an older version of the scene', async () => {
    const scene = sceneWithGrish();
    const { state } = foldSceneEvents(scene);
    const events = proposedMove(scene, { x: 3, y: 1 });
    runDmTurnMock.mockResolvedValue(okResult(events));
    const onAppendSceneEvent = vi.fn();

    // The host re-renders with a grown scene between propose and apply — a GM
    // moved a token, rolled a check, anything at all.
    let current = scene;
    const { result, rerender } = renderHook(() =>
      useSceneDmTurn({
        selectedScene: current,
        state,
        selectedTokenId: 't1',
        onAppendSceneEvent,
      })
    );

    await act(async () => {
      await result.current.handleRunDmTurn({ moveDistance: 3 });
    });

    const meanwhile = resolveSceneAction(
      scene,
      { type: 'place-token', token: tokenAt('t2', 'Marek', 4, 4) },
      { eventId: 'e2', createdAt: AT }
    );
    current = appendSceneEvent(scene, meanwhile.event!);
    rerender();

    let refusal: string | null = null;
    act(() => {
      refusal = result.current.handleApplyDmTurn(events);
    });

    expect(refusal).toBe(DM_TURN_STALE_MESSAGE);
    expect(onAppendSceneEvent).not.toHaveBeenCalled();
  });

  it('refuses when the GM switched scenes between proposing and applying', async () => {
    const scene = sceneWithGrish();
    const { state } = foldSceneEvents(scene);
    const events = proposedMove(scene, { x: 3, y: 1 });
    runDmTurnMock.mockResolvedValue(okResult(events));
    const onAppendSceneEvent = vi.fn();

    let current = scene;
    const { result, rerender } = renderHook(() =>
      useSceneDmTurn({
        selectedScene: current,
        state,
        selectedTokenId: 't1',
        onAppendSceneEvent,
      })
    );
    await act(async () => {
      await result.current.handleRunDmTurn({ moveDistance: 3 });
    });

    // Same event count, different scene: a count-only pin would let this through.
    current = { ...scene, id: 'scene-2' };
    rerender();

    let refusal: string | null = null;
    act(() => {
      refusal = result.current.handleApplyDmTurn(events);
    });
    expect(refusal).toBe(DM_TURN_STALE_MESSAGE);
    expect(onAppendSceneEvent).not.toHaveBeenCalled();
  });
});

/**
 * The hazard the guard above exists for, asserted against the SHIPPED runtime
 * rather than described in a comment. Nothing here uses the hook — this is the
 * control that says the refusal is protecting something real.
 */
describe('why a proposed AI-DM turn goes stale', () => {
  it('stamps sequence at resolve time, so a late apply collides with the log', () => {
    const scene = sceneWithGrish();
    expect(scene.events).toHaveLength(1);

    // Resolved while the scene held 1 event.
    const proposed = proposedMove(scene, { x: 3, y: 1 });
    expect(proposed[0].sequence).toBe(2);

    // Ordinary play continues before the GM gets to the Apply button.
    const meanwhile = resolveSceneAction(
      scene,
      { type: 'place-token', token: tokenAt('t2', 'Marek', 4, 4) },
      { eventId: 'e2', createdAt: AT }
    );
    expect(meanwhile.event!.sequence).toBe(2);

    // Both now claim sequence 2, and `appendSceneEvent` does not object —
    // `pushSequenceIssue` only requires a positive integer. Appending the stale
    // proposal therefore puts two different events on the same rung of the
    // append-only log, which is exactly what the guard refuses to do.
    const grown = appendSceneEvent(scene, meanwhile.event!);
    const corrupted = appendSceneEvent(grown, proposed[0]);
    const sequences = corrupted.events.map((event) => event.sequence);
    expect(sequences).toEqual([1, 2, 2]);
    expect(foldSceneEvents(corrupted).issues.some((issue) => issue.severity === 'error')).toBe(
      false
    );
  });
});
