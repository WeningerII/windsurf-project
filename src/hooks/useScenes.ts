import { useCallback, useEffect, useState } from 'react';
import { appendSceneEvent as appendRuntimeSceneEvent } from '../scene/runtime';
import type { SceneDocument, SceneEvent } from '../types/core/scene';
import { clearSceneStorage, loadScenes, saveScenes } from '../utils/sceneStorage';
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
