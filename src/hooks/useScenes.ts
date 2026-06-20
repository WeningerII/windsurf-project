import { useCallback, useEffect, useState } from 'react';
import { appendSceneEvent as appendRuntimeSceneEvent } from '../scene/runtime';
import type { SceneDocument, SceneEvent } from '../types/core/scene';
import {
  clearSceneStorage,
  loadScenes,
  saveScenes,
  parseScenesSnapshot,
  SCENES_STORAGE_KEY,
} from '../utils/sceneStorage';
import { sameSceneSignatures } from '../utils/documentSignature';
import { useDebouncedPersistence } from './useDebouncedPersistence';

export const useScenes = () => {
  const [scenes, setScenes] = useState<SceneDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setScenes(loadScenes());
    setIsLoading(false);
  }, []);

  const persist = useCallback((nextScenes: SceneDocument[]) => {
    try {
      saveScenes(nextScenes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scenes');
    }
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
    clearSceneStorage();
    setError(null);
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
    flushPendingSaves: persistence.flush,
  };
};
