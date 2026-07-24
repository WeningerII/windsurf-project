/**
 * The zero-arg bound scene-emit seam (Phase 4).
 *
 * The mounted scene host (SceneManager) publishes a single
 * `emit(intent: SceneActionIntent) => boolean` bound to the shell-resolved
 * selected scene, so a shared-layer drop handler can dispatch an EXISTING
 * intent without knowing about scene resolution or `emitSceneAction`'s
 * scene argument. Control is inverted exactly like SheetDispatchContext: the
 * drop consumer reads the seam DOWN and never value-imports `src/systems/**`.
 *
 * `runtime.ts` and the 12 `SceneActionIntent` variants are untouched — the seam
 * only forwards an existing intent. With no scene resolved the published emit
 * is a no-op returning false, so a drop can never target a stale scene.
 *
 * No JSX here (mirrors the sheet-dispatch-context split) so the
 * react-refresh only-export-components lint stays green.
 */
import { createContext, useContext } from 'react';
import type { SceneActionIntent } from '../types/core/scene';

export type SceneEmit = (intent: SceneActionIntent) => boolean;

/** Null outside a provider so a drop handler mounted standalone no-ops. */
export const SceneDispatchContext = createContext<SceneEmit | null>(null);

const NO_EMIT: SceneEmit = () => false;

/** Read the bound emit seam DOWN; a no-op returning false with no provider. */
export function useSceneDispatch(): SceneEmit {
  return useContext(SceneDispatchContext) ?? NO_EMIT;
}
