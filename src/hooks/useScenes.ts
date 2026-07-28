import { useCallback, useEffect, useState } from 'react';
import { appendSceneEvent as appendRuntimeSceneEvent } from '../scene/runtime';
import type { SceneDocument, SceneEvent } from '../types/core/scene';
import {
  clearSceneStorage,
  loadScenes,
  loadScenesFromLocalStorage,
  saveScenes,
  parseScenesSnapshot,
  SCENES_STORAGE_KEY,
} from '../utils/sceneStorage';
import { sameSceneSignatures } from '../utils/documentSignature';
import { useDebouncedPersistence } from './useDebouncedPersistence';

/**
 * `updatedAt`-aware merge of a persisted snapshot into the live collection.
 * Shared by the mount reconcile, `reloadScenes`, and (via `addScenes`) the
 * cross-tab listener so all three agree on precedence. Returns the SAME
 * reference when nothing changed, which is what keeps the reconcile loop-safe
 * and stops the keepalive Scene canvas re-rendering for nothing.
 */
function mergeLoadedScenes(current: SceneDocument[], loaded: SceneDocument[]): SceneDocument[] {
  if (loaded.length === 0) return current;
  const byId = new Map(current.map((scene) => [scene.id, scene] as const));
  loaded.forEach((scene) => {
    const existing = byId.get(scene.id);
    if (!existing || scene.updatedAt >= existing.updatedAt) {
      byId.set(scene.id, scene);
    }
  });
  const next = Array.from(byId.values());
  return sameSceneSignatures(current, next) ? current : next;
}

export const useScenes = () => {
  const [scenes, setScenes] = useState<SceneDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Two-stage load. The localStorage snapshot is read synchronously so the
  // first paint has scenes, then the durable IndexedDB tier is merged in when
  // it resolves (that async pass also runs the one-time localStorage ->
  // IndexedDB migration). A campaign too large for the ~5 MB localStorage
  // quota lives ONLY in IndexedDB, so stage two is not an optimization — it is
  // the only path that returns the full collection.
  useEffect(() => {
    let cancelled = false;
    setScenes(loadScenesFromLocalStorage());
    setIsLoading(false);

    void loadScenes()
      .then((loaded) => {
        if (cancelled) return;
        setScenes((current) => mergeLoadedScenes(current, loaded));
      })
      .catch(() => {
        // The synchronous snapshot above is already rendered; a failed
        // IndexedDB read must not blank it.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Reconcile the persisted snapshot into the live collection on demand. The
  // Scene surface calls this on its hidden->visible transition (Phase 2
  // keepalive): the cross-tab storage listener below stays UNGATED, but a tab
  // that never received a storage event while the Scene surface was hidden
  // (e.g. it was backgrounded) picks up other tabs' edits on return.
  //
  // This MERGES rather than raw-replaces. A raw replace drops any scene whose
  // debounced save has not yet flushed — notably a scene JUST created or
  // imported on the Library Scenes segment, whose onSelectScene flips to the
  // Scene surface (triggering this very reactivation) in the same tick, BEFORE
  // the debounce fires. loadScenes() then returns a stale snapshot without that
  // scene, and a replace clobbers it out of memory so its canvas never renders.
  // The updatedAt-aware upsert keeps those unsaved local additions while still
  // surfacing edits other tabs wrote to storage while this surface was hidden.
  // An empty snapshot leaves the live collection untouched.
  //
  // Async because the durable tier is: awaitable so callers (and tests) can
  // sequence on the reconcile actually having landed.
  const reloadScenes = useCallback(async () => {
    setIsLoading(false);
    const loaded = await loadScenes();
    setScenes((current) => mergeLoadedScenes(current, loaded));
  }, []);

  const persist = useCallback((nextScenes: SceneDocument[]) => {
    // saveScenes resolves with which tiers are current instead of throwing, so
    // a full disk becomes a visible error rather than an exception raised
    // inside a debounce timer with nobody to catch it.
    void saveScenes(nextScenes)
      .then((result) => {
        setError(result.ok ? null : (result.error ?? 'Failed to save scenes'));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to save scenes');
      });
  }, []);

  const persistence = useDebouncedPersistence(persist);

  const applySceneUpdate = useCallback(
    (updater: (current: SceneDocument[]) => SceneDocument[]) => {
      const persistVersion = persistence.beginVersion();
      setScenes((current) => {
        const next = updater(current);
        if (next === current) {
          // No-op update (e.g. an idempotent cross-tab merge): roll the
          // unused write generation back — leaving it consumed would
          // invalidate a still-pending debounced save from a real edit
          // moments earlier.
          persistence.abandonVersion(persistVersion);
          return current;
        }
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const addScene = useCallback(
    (scene: SceneDocument) => {
      applySceneUpdate((current) => [...current, scene]);
    },
    [applySceneUpdate]
  );

  const addScenes = useCallback(
    (incoming: SceneDocument[]) => {
      if (incoming.length === 0) return;
      applySceneUpdate((current) => {
        const byId = new Map(current.map((scene) => [scene.id, scene] as const));
        incoming.forEach((scene) => {
          const existing = byId.get(scene.id);
          if (!existing || scene.updatedAt >= existing.updatedAt) {
            byId.set(scene.id, scene);
          }
        });
        const next = Array.from(byId.values());
        // The `>=` rule above replaces entries even when nothing changed, so
        // compare signatures to keep an idempotent merge a true no-op (this
        // is what makes the cross-tab listener below loop-safe).
        return sameSceneSignatures(current, next) ? current : next;
      });
    },
    [applySceneUpdate]
  );

  // Cross-tab reconciliation: merge snapshots written by other tabs through
  // the updatedAt-aware upsert above. Loop-safe via the signature
  // short-circuit (a no-change merge schedules no write, so no event echo).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SCENES_STORAGE_KEY || !event.newValue) return;
      const incoming = parseScenesSnapshot(event.newValue);
      if (incoming === null || incoming.length === 0) return;
      addScenes(incoming);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [addScenes]);

  const updateScene = useCallback(
    (scene: SceneDocument) => {
      applySceneUpdate((current) =>
        current.map((entry) =>
          entry.id === scene.id ? { ...scene, updatedAt: new Date() } : entry
        )
      );
    },
    [applySceneUpdate]
  );

  const appendSceneEvent = useCallback(
    (sceneId: string, event: SceneEvent) => {
      applySceneUpdate((current) => {
        let changed = false;
        const next = current.map((scene) => {
          if (scene.id !== sceneId) return scene;
          try {
            const updated = appendRuntimeSceneEvent(scene, event);
            changed = true;
            return updated;
          } catch {
            // A corrupt existing scene (an event the fold flags as malformed)
            // rejects new events. Leave it unchanged rather than letting the
            // throw propagate through React's render into the ErrorBoundary —
            // the corruption is already surfaced wherever the scene is folded.
            return scene;
          }
        });
        // Same reference when nothing changed → applySceneUpdate treats it as a
        // clean no-op (no spurious persist).
        return changed ? next : current;
      });
    },
    [applySceneUpdate]
  );

  const deleteScene = useCallback(
    (id: string) => {
      applySceneUpdate((current) => current.filter((scene) => scene.id !== id));
    },
    [applySceneUpdate]
  );

  const clearAllScenes = useCallback(() => {
    // Begin-without-persist is deliberate: it invalidates any pending write
    // of the old collection so it cannot land after the clear.
    persistence.beginVersion();
    persistence.cancel();
    setScenes([]);
    setError(null);
    // The localStorage key is dropped synchronously inside clearSceneStorage;
    // only the IndexedDB clear is awaited, and a failure there must surface —
    // otherwise the next load resurrects the "cleared" collection.
    void clearSceneStorage().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to clear scenes');
    });
  }, [persistence]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    scenes,
    isLoading,
    error,
    clearError,
    addScene,
    addScenes,
    updateScene,
    appendSceneEvent,
    deleteScene,
    clearAllScenes,
    reloadScenes,
    flushPendingSaves: persistence.flush,
  };
};
