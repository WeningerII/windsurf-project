/**
 * Bridge: deterministic resolution → scene actions.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution" + the resolution/narration split.
 *
 * The resolver produces an outcome artifact; this turns that artifact into the
 * scene runtime's typed `apply-damage` intent so combat lands on the grid
 * through the normal event-sourced path (validated, replayable). It is a pure
 * translation — no RNG, no mutation — keeping the mechanics → event boundary
 * clean and the LLM out of the resolution hot path.
 */

import type { SceneActionIntent, SceneTokenDamage } from '../../types/core/scene';
import type { AttackResolution } from './attackResolution';
import type { AreaEffectResult, MultiTargetAttackResult } from './participantResolution';

/** Build an apply-damage intent from a single resolved attack against a target. */
export function attackToDamageIntent(
  actorId: string,
  targetId: string,
  resolution: AttackResolution,
  cause?: string
): SceneActionIntent | undefined {
  if (!resolution.isHit || resolution.damage <= 0) {
    return undefined; // a miss (or zero damage) produces no damage event
  }
  return {
    type: 'apply-damage',
    actorId,
    cause,
    damages: [{ tokenId: targetId, amount: resolution.damage }],
  };
}

/**
 * Build a single apply-damage intent covering every target a multi-target attack
 * hit. Targets that were missed contribute nothing. Returns undefined when no
 * target took damage (so the caller emits no event).
 */
export function multiTargetAttackToDamageIntent(
  result: MultiTargetAttackResult,
  cause?: string
): SceneActionIntent | undefined {
  const damages: SceneTokenDamage[] = result.perTarget
    .filter((entry) => entry.resolution.isHit && entry.resolution.damage > 0)
    .map((entry) => ({ tokenId: entry.targetId, amount: entry.resolution.damage }));

  if (damages.length === 0) {
    return undefined;
  }
  return { type: 'apply-damage', actorId: result.actorId, cause, damages };
}

/**
 * Build a single apply-damage intent from an area effect: one delta per
 * participant who took damage (full or half), all in one event so the AoE is a
 * single auditable step.
 */
export function areaEffectToDamageIntent(
  result: AreaEffectResult,
  cause?: string
): SceneActionIntent | undefined {
  const damages: SceneTokenDamage[] = result.perTarget
    .filter((outcome) => outcome.damageTaken > 0)
    .map((outcome) => ({ tokenId: outcome.targetId, amount: outcome.damageTaken }));

  if (damages.length === 0) {
    return undefined;
  }
  return { type: 'apply-damage', actorId: result.sourceId, cause, damages };
}
