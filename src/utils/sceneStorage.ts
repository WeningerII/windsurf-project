import type { SceneDocument, SceneEvent } from '../types/core/scene';

const STORAGE_KEY = 'rpg-scenes-v1';
const STORAGE_VERSION = '1.0';

interface SceneStorageData {
  version: typeof STORAGE_VERSION;
  scenes: SceneDocument[];
  lastModified: string;
}

export function loadScenes(): SceneDocument[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SceneStorageData;
    if (!Array.isArray(parsed.scenes)) {
      return [];
    }
    return parsed.scenes.map(hydrateScene);
  } catch {
    return [];
  }
}

export function saveScenes(scenes: SceneDocument[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  const payload: SceneStorageData = {
    version: STORAGE_VERSION,
    scenes,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadScene(id: string): SceneDocument | undefined {
  return loadScenes().find((scene) => scene.id === id);
}

export function upsertScene(scene: SceneDocument): SceneDocument[] {
  const scenes = loadScenes();
  const nextScene = hydrateScene(scene);
  const existingIndex = scenes.findIndex((entry) => entry.id === scene.id);
  const nextScenes =
    existingIndex >= 0
      ? scenes.map((entry, index) => (index === existingIndex ? nextScene : entry))
      : [...scenes, nextScene];

  saveScenes(nextScenes);
  return nextScenes;
}

export function deleteScene(id: string): SceneDocument[] {
  const nextScenes = loadScenes().filter((scene) => scene.id !== id);
  saveScenes(nextScenes);
  return nextScenes;
}

export function clearSceneStorage(): void {
  if (!canUseLocalStorage()) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

export function exportScenes(scenes: SceneDocument[]): string {
  const payload: SceneStorageData = {
    version: STORAGE_VERSION,
    scenes,
    lastModified: new Date().toISOString(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importScenes(jsonString: string): SceneDocument[] {
  try {
    const parsed = JSON.parse(jsonString) as SceneStorageData;
    if (!Array.isArray(parsed.scenes)) {
      throw new Error('Invalid scene export.');
    }
    return parsed.scenes.map(hydrateScene);
  } catch {
    throw new Error('Failed to import scenes. Invalid JSON format.');
  }
}

function hydrateScene(scene: SceneDocument): SceneDocument {
  return {
    ...scene,
    createdAt: new Date(scene.createdAt),
    updatedAt: new Date(scene.updatedAt),
    initialState: {
      ...scene.initialState,
      grid: { ...scene.initialState.grid },
      tokens: { ...scene.initialState.tokens },
      markers: { ...scene.initialState.markers },
      initiative: scene.initialState.initiative.map((entry) => ({ ...entry })),
    },
    events: scene.events.map(hydrateSceneEvent),
    version: 1,
  };
}

function hydrateSceneEvent(event: SceneEvent): SceneEvent {
  return {
    ...event,
    createdAt: new Date(event.createdAt),
  } as SceneEvent;
}

function canUseLocalStorage(): boolean {
  return typeof localStorage !== 'undefined';
}
