/**
 * Single Phase-6 feature predicate. Same strict-`'true'` / default-OFF contract
 * as the other scene flags: ON only when `VITE_SCENE_CANVAS_ENABLED === 'true'`.
 *
 * Unlike `isSceneDragEnabled` (which delegates to the central `featureFlags`
 * registry), this reads `import.meta.env` directly — the isAiEnabled-style
 * predicate that predated the registry. That is deliberate: the registry module
 * is pulled into the EAGER index chunk (via `isAiEnabled`), so adding this flag
 * there would grow the eager bundle. This module is imported only by the LAZY
 * SceneManager chunk, so keeping the predicate self-contained keeps the eager
 * index chunk byte-for-byte unchanged (its ~0.9 KiB headroom is tight). The
 * static member access is also build-time-folded by Vite, so when the flag is
 * unset the canvas branch tree-shakes away entirely.
 */
export function isSceneCanvasEnabled(): boolean {
  return import.meta.env.VITE_SCENE_CANVAS_ENABLED === 'true';
}
