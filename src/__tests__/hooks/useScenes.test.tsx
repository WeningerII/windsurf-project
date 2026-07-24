import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createSceneDocument, resolveSceneAction } from '../../scene/runtime';
import { useScenes } from '../../hooks/useScenes';
import type { SceneDocument } from '../../types/core/scene';
import { DEFAULT_PERSISTENCE_DEBOUNCE_MS } from '../../hooks/useDebouncedPersistence';

const NOW = new Date('2026-05-01T12:00:00.000Z');

function makeScene(overrides: Partial<SceneDocument> = {}): SceneDocument {
  return {
    ...createSceneDocument({
      id: 'scene-1',
      name: 'Test Scene',
      systemId: 'dnd-5e-2024',
      now: NOW,
    }),
    ...overrides,
  };
}

describe('useScenes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty scenes', () => {
    const { result } = renderHook(() => useScenes());

    expect(result.current.scenes).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('adds and persists a scene', async () => {
    const { result } = renderHook(() => useScenes());

    act(() => {
      result.current.addScene(makeScene());
    });

    expect(result.current.scenes).toHaveLength(1);
    await waitFor(() => {
      const stored = localStorage.getItem('rpg-scenes-v1');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).scenes).toHaveLength(1);
    });
  });

  it('appends validated scene events', () => {
    const { result } = renderHook(() => useScenes());
    act(() => {
      result.current.addScene(makeScene());
    });

    const placeToken = resolveSceneAction(
      result.current.scenes[0],
      {
        type: 'place-token',
        token: {
          id: 'hero',
          name: 'Hero',
          kind: 'character',
          position: { x: 1, y: 1 },
          size: 1,
        },
      },
      { eventId: 'event-1', createdAt: NOW }
    );

    act(() => {
      result.current.appendSceneEvent('scene-1', placeToken.event!);
    });

    expect(result.current.scenes[0].events).toHaveLength(1);
    expect(result.current.scenes[0].updatedAt).toEqual(NOW);
  });

  it('HARDENING: appending to a corrupt scene is a safe no-op, not a thrown render error', () => {
    const { result } = renderHook(() => useScenes());
    // A scene whose existing event log is corrupt (the runtime appendSceneEvent
    // throws on it). Appending must not propagate through the state updater into
    // the ErrorBoundary.
    const corrupt = makeScene({
      id: 'corrupt-scene',
      events: [
        {
          id: 'bad',
          sequence: 1,
          createdAt: NOW,
          type: 'token.added',
          payload: {} as never,
        },
      ],
    });
    act(() => {
      result.current.addScene(corrupt);
    });

    const validEvent = {
      id: 'evt',
      sequence: 2,
      createdAt: NOW,
      type: 'turn.advanced' as const,
      payload: {},
    };
    expect(() =>
      act(() => {
        result.current.appendSceneEvent('corrupt-scene', validEvent);
      })
    ).not.toThrow();
    // The corrupt scene is left unchanged (no event appended).
    expect(result.current.scenes[0].events).toHaveLength(1);
  });

  it('clears scenes without re-saving pending debounced state', async () => {
    const { result } = renderHook(() => useScenes());

    act(() => {
      result.current.addScene(makeScene());
      result.current.clearAllScenes();
    });

    expect(result.current.scenes).toEqual([]);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, DEFAULT_PERSISTENCE_DEBOUNCE_MS + 50));
    });
    expect(localStorage.getItem('rpg-scenes-v1')).toBeNull();
  });

  // M3: cross-tab reconciliation via storage events.
  it("merges another tab's scenes from a storage event", () => {
    const { result } = renderHook(() => useScenes());
    act(() => {
      result.current.addScene(makeScene());
    });

    const otherTabScene = createSceneDocument({
      id: 'scene-2',
      name: 'Other Tab Scene',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'rpg-scenes-v1',
          newValue: JSON.stringify({
            version: '1.0',
            scenes: [otherTabScene],
            lastModified: NOW.toISOString(),
          }),
        })
      );
    });

    expect(result.current.scenes.map((scene) => scene.id).sort()).toEqual(['scene-1', 'scene-2']);
  });

  it('ignores an identical cross-tab scene snapshot without state churn (loop safety)', () => {
    const { result } = renderHook(() => useScenes());
    act(() => {
      result.current.addScene(makeScene());
    });
    act(() => {
      result.current.flushPendingSaves();
    });

    const echoPayload = localStorage.getItem('rpg-scenes-v1');
    expect(echoPayload).toBeTruthy();
    const before = result.current.scenes;

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'rpg-scenes-v1',
          newValue: echoPayload!,
        })
      );
    });

    expect(result.current.scenes).toBe(before);
  });

  it('reloadScenes re-reads the persisted snapshot (Phase 2 Scene-surface reactivate)', () => {
    const { result } = renderHook(() => useScenes());

    // Simulate another tab having written a scene to storage while this hook's
    // Scene surface was hidden and it never received the storage event.
    const externalScene = makeScene({ id: 'scene-from-other-tab', name: 'Other Tab Scene' });
    localStorage.setItem('rpg-scenes-v1', JSON.stringify({ version: 1, scenes: [externalScene] }));
    expect(result.current.scenes).toEqual([]);

    // On Scene reactivate App calls reloadScenes(): the missed edit is picked up.
    act(() => {
      result.current.reloadScenes();
    });

    expect(result.current.scenes.map((scene) => scene.id)).toEqual(['scene-from-other-tab']);
    expect(result.current.isLoading).toBe(false);
  });
});
