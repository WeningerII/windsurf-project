/**
 * Single Phase-4 feature predicate. Mirrors `isAiEnabled()` (gatewayClient):
 * ON only when `VITE_SCENE_DRAG_ENABLED === 'true'`, default OFF. This ONE
 * predicate gates BOTH the drag mount AND the paired PlacementMode-button
 * hiding, so the drag affordance and the legacy Place buttons are never both
 * visible for a covered kind (the mutual-exclusion invariant, Finding 21).
 */
import { isFeatureEnabled } from '../../config/featureFlags';

export function isSceneDragEnabled(): boolean {
  return isFeatureEnabled('sceneDrag');
}
