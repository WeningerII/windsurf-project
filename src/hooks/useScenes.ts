import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { appendSceneEvent as appendRuntimeSceneEvent } from '../scene/runtime';
import type { SceneDocument, SceneEvent } from '../types/core/scene';
import { clearSceneStorage, loadScenes, saveScenes } from '../utils/sceneStorage';
import { debounce } from '../utils/performance';

export const useScenes = () => {
  const [scenes, setScenes] = useState<SceneDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const persistVersionRef = useRef(0);

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

  const debouncedPersist = useMemo(
    () =>
      debounce((nextScenes: SceneDocument[], version: number) => {
        if (version !== persistVersionRef.current) return;
        persist(nextScenes);
      }, 300),
    [persist]
  );

  useEffect(() => () => debouncedPersist.flush(), [debouncedPersist]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const flushPersist = () => {
      debouncedPersist.flush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPersist();
      }
    };

    window.addEventListener('pagehide', flushPersist);
    window.addEventListener('beforeunload', flushPersist);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', flushPersist);
      window.removeEventListener('beforeunload', flushPersist);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [debouncedPersist]);

  const applySceneUpdate = useCallback(
    (updater: (current: SceneDocument[]) => SceneDocument[]) => {
      const persistVersion = ++persistVersionRef.current;
      setScenes((current) => {
        const next = updater(current);
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist]
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
        return Array.from(byId.values());
      });
    },
    [applySceneUpdate]
  );

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
      applySceneUpdate((current) =>
        current.map((scene) =>
          scene.id === sceneId ? appendRuntimeSceneEvent(scene, event) : scene
        )
      );
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
    persistVersionRef.current += 1;
    debouncedPersist.cancel();
    setScenes([]);
    clearSceneStorage();
    setError(null);
  }, [debouncedPersist]);

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
    flushPendingSaves: debouncedPersist.flush,
  };
};
