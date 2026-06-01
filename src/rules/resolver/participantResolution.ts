/**
 * Participant-aware resolution: N targets per interaction.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution".
 *
 * Real interactions are not one-actor-one-target. A single action may resolve
 * against several targets (multiattack, cleave) or against everyone in a region
 * (area-of-effect), and AoE rules typically roll shared damage ONCE while each
 * target saves independently. This layer sits above the per-effect resolver and
 * the single-attack resolver, producing PER-PARTICIPANT outcomes.
 *
 * Determinism with N participants: each participant gets an independent seeded
 * sub-stream keyed by (base seed + actor + target [+ nonce]). Independence means
 * resolution does not depend on target ORDER — re-ordering the target list
 * yields the same per-target outcomes — which is essential for replay stability
 * and for fair AI/tactical target selection.
 */

import { createSeededRng, type SeededRng } from '../../scene/seededRng';
import { resolveAttack, type AttackResolution } from './attackResolution';
import { resolveEffects, type ResolveContext } from './resolve';
import type { EffectInstance } from '../ir/types';

/**
 * Derive an independent seeded RNG for one participant in an interaction. Keyed
 * so each (actor, target) pair has its own stream, order-independent.
 */
export function participantRng(
  baseSeed: string,
  actorId: string,
  targetId: string,
  nonce?: string | number
): SeededRng {
  return createSeededRng(
    `${baseSeed}::${actorId}->${targetId}${nonce != null ? `::${nonce}` : ''}`
  );
}

// ─── Multi-target attacks (independent attack roll per target) ────────────────

export interface AttackTarget {
  targetId: string;
  /** Value to beat for this target (its AC). */
  targetValue: number;
  /** Per-target effect-gating context (e.g. this target's conditions/terrain). */
  context?: Omit<ResolveContext, 'rng'>;
  /** Optional per-target extra effects (e.g. attacker has advantage vs prone). */
  extraAttackEffects?: readonly EffectInstance[];
}

export interface MultiTargetAttackInput {
  actorId: string;
  /** Base seed (e.g. the scene seed + a turn/sequence nonce). */
  seed: string;
  /** Attack-roll effects shared across all targets (proficiency, ability, item). */
  attackEffects: readonly EffectInstance[];
  /** Damage effects; rolled independently per target (each hit deals its own). */
  damageEffects?: readonly EffectInstance[];
  critOn?: number;
  targets: readonly AttackTarget[];
}

export interface MultiTargetAttackResult {
  actorId: string;
  perTarget: Array<{ targetId: string; resolution: AttackResolution }>;
  /** Convenience roll-ups. */
  hitCount: number;
  totalDamage: number;
}

/**
 * Resolve one attack action against multiple targets. Each target gets its own
 * attack roll and (on a hit) its own damage roll, from an independent seeded
 * sub-stream — so the result does not depend on target order.
 */
export function resolveMultiTargetAttack(input: MultiTargetAttackInput): MultiTargetAttackResult {
  const perTarget = input.targets.map((target) => {
    const rng = participantRng(input.seed, input.actorId, target.targetId);
    const attackEffects = target.extraAttackEffects
      ? [...input.attackEffects, ...target.extraAttackEffects]
      : input.attackEffects;
    const resolution = resolveAttack({
      attackEffects,
      damageEffects: input.damageEffects,
      targetValue: target.targetValue,
      critOn: input.critOn,
      rng,
      context: target.context,
    });
    return { targetId: target.targetId, resolution };
  });

  return {
    actorId: input.actorId,
    perTarget,
    hitCount: perTarget.filter((t) => t.resolution.isHit).length,
    totalDamage: perTarget.reduce((sum, t) => sum + t.resolution.damage, 0),
  };
}

// ─── Area-of-effect (shared damage roll, independent save per target) ─────────

export interface SaveParticipant {
  targetId: string;
  /** Total saving-throw modifier for this participant. */
  saveBonus: number;
  /** Per-participant gating context (their conditions, etc.). */
  context?: Omit<ResolveContext, 'rng'>;
}

export interface AreaEffectInput {
  /** The origin of the effect (caster/trap); seeds the shared damage roll. */
  sourceId: string;
  seed: string;
  /** Damage effects, rolled ONCE and shared across all participants. */
  damageEffects: readonly EffectInstance[];
  /** Save DC each participant rolls against. */
  saveDC: number;
  /** When true (5e default), a successful save halves damage; else negates. */
  halfOnSave?: boolean;
  participants: readonly SaveParticipant[];
}

export interface AreaEffectOutcome {
  targetId: string;
  saveRoll: number;
  saveTotal: number;
  saved: boolean;
  damageTaken: number;
}

export interface AreaEffectResult {
  sourceId: string;
  /** The shared, rolled-once damage before saves. */
  sharedDamage: number;
  sharedDamageDiceTerms: number[];
  perTarget: AreaEffectOutcome[];
  totalDamageDealt: number;
}

/**
 * Resolve an area effect: roll damage once from the source's stream, then each
 * participant rolls an independent saving throw (own sub-stream) and takes full,
 * half, or no damage. Re-ordering participants does not change any outcome.
 */
export function resolveAreaEffect(input: AreaEffectInput): AreaEffectResult {
  const halfOnSave = input.halfOnSave ?? true;

  // Shared damage: rolled once from the source stream.
  const sourceRng = createSeededRng(`${input.seed}::area::${input.sourceId}`);
  const damageResolved = resolveEffects(input.damageEffects, { rng: sourceRng });
  let sharedDamage = 0;
  let sharedDamageDiceTerms: number[] = [];
  for (const resolved of Object.values(damageResolved.byTarget)) {
    sharedDamage += resolved.total;
    if (resolved.diceTerms) {
      sharedDamageDiceTerms = [...sharedDamageDiceTerms, ...resolved.diceTerms];
    }
  }

  const perTarget = input.participants.map((participant): AreaEffectOutcome => {
    const rng = participantRng(input.seed, input.sourceId, participant.targetId, 'save');
    const saveRoll = rng.rollDie(20);
    const saveTotal = saveRoll + participant.saveBonus;
    const saved = saveTotal >= input.saveDC;
    const damageTaken = saved ? (halfOnSave ? Math.floor(sharedDamage / 2) : 0) : sharedDamage;
    return { targetId: participant.targetId, saveRoll, saveTotal, saved, damageTaken };
  });

  return {
    sourceId: input.sourceId,
    sharedDamage,
    sharedDamageDiceTerms,
    perTarget,
    totalDamageDealt: perTarget.reduce((sum, t) => sum + t.damageTaken, 0),
  };
}
