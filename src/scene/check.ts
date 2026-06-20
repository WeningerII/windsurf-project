import type { SceneCheckOutcome, SceneCheckResult } from '../types/core/scene';

/**
 * Resolve a d20 ability/skill check. `total` is `die + modifier`; `outcome`
 * is `success`/`failure` when a DC is supplied, or `unresolved` for a bare
 * roll the player adjudicates. Pure — the caller rolls the die (so the scene
 * fold stays deterministic and the result can be stored on the event).
 */
export function resolveCheck(die: number, modifier: number, dc?: number): SceneCheckResult {
  const total = die + modifier;
  const outcome: SceneCheckOutcome =
    dc === undefined ? 'unresolved' : total >= dc ? 'success' : 'failure';
  return { die, modifier, ...(dc === undefined ? {} : { dc }), total, outcome };
}
