import type { SceneDocument, SceneEvent } from '../types/core/scene';
import { parseSceneDocument } from './boundaryValidation';

const STORAGE_KEY = 'rpg-scenes-v1';
const STORAGE_VERSION = '1.0';

interface SceneStorageData {
  version: typeof STORAGE_VERSION;
  scenes: SceneDocument[];
  lastModified: string;
}

function readScenesField(raw: string): unknown[] | null {
  const parsed: unknown = JSON.parse(raw);
  const scenesField =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as { scenes?: unknown }).scenes
      : undefined;
  return Array.isArray(scenesField) ? scenesField : null;
}

// Parse, don't cast: validate each candidate scene and drop structurally
// invalid ones, so a single malformed record can neither crash hydration nor
// masquerade as a scene.
function collectValidScenes(candidates: unknown[]): SceneDocument[] {
  const now = new Date();
  const scenes: SceneDocument[] = [];
  for (const candidate of candidates) {
    const result = parseSceneDocument(candidate, now);
    if (result.ok) {
      scenes.push(hydrateScene(result.value));
    }
  }
  return scenes;
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
    const scenesField = readScenesField(raw);
    if (scenesField === null) {
      return [];
    }
    return collectValidScenes(scenesField);
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
  let scenesField: unknown[] | null;
  try {
    scenesField = readScenesField(jsonString);
  } catch {
    throw new Error('Failed to import scenes. Invalid JSON format.');
  }
  if (scenesField === null) {
    throw new Error('Failed to import scenes. Invalid JSON format.');
  }
  return collectValidScenes(scenesField);
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
