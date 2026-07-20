import type { Pf2eDataModel, Pf2eProficiencyTier, Pf2eSpellcasting } from './data-model';
import {
  poolFromRemaining,
  remainingShape,
  reset,
  restore,
  setMax,
  type ResourcePool,
} from '../../utils/resourcePool';

/**
 * View one PF2e spell-slot rank as a generic resource pool: the cap lives in
 * `max` and the expended count in `used`, mapping directly onto a pool's
 * `max`/`spent`. Restoring all slots on a daily preparation is a `reset`.
 */
const slotPool = (slot: { max: number; used: number }): ResourcePool => ({
  max: slot.max,
  spent: slot.used,
});

const PF2E_TIER_ORDER: Pf2eProficiencyTier[] = [
  'untrained',
  'trained',
  'expert',
  'master',
  'legendary',
];

export function nextPf2eTier(current: Pf2eProficiencyTier): Pf2eProficiencyTier {
  const index = PF2E_TIER_ORDER.indexOf(current);
  return PF2E_TIER_ORDER[(index + 1) % PF2E_TIER_ORDER.length];
}

export function countTrainedPf2eSkills(
  skillProficiencies: Pf2eDataModel['skillProficiencies']
): number {
  return Object.values(skillProficiencies).filter((proficiency) => proficiency.tier !== 'untrained')
    .length;
}

export interface Pf2eBulkState {
  /** Encumbered threshold: Bulk above this is encumbered. */
  encumbered: number;
  /** Maximum Bulk: Bulk above this is overloaded. */
  maxBulk: number;
  isEncumbered: boolean;
  isOverloaded: boolean;
}

/**
 * PF2e CRB p.272 (Bulk Limits): "You are encumbered when you carry more Bulk
 * than 5 + your Strength modifier" and "you can't hold or carry more Bulk than
 * 10 + your Strength modifier" — both strictly greater-than, so carrying
 * exactly 5 + Str is NOT encumbered.
 */
export function getPf2eBulkState(totalBulk: number, strengthModifier: number): Pf2eBulkState {
  const encumbered = 5 + strengthModifier;
  const maxBulk = 10 + strengthModifier;
  return {
    encumbered,
    maxBulk,
    isEncumbered: totalBulk > encumbered,
    isOverloaded: totalBulk > maxBulk,
  };
}

/**
 * Re-cap the focus pool to `nextMax` when the character's capacity changes on a
 * level-up (or any recompute), routing the change through the shared `setMax`
 * leveling primitive so the count of *expended* focus points is preserved and
 * the remaining `current` is re-clamped into the new capacity — never silently
 * refunded on a cap drop, never overflowed on a cap raise. The `nextMax` is the
 * value produced by the existing capacity derivation (the formula stays in the
 * data-model/engine); this only applies it against the pool. A `nextMax` equal
 * to the current cap is a pure, behavior-preserving re-validation.
 */
export function setPf2eFocusMax(
  spellcasting: Pf2eSpellcasting | undefined,
  nextMax: number
): Pf2eSpellcasting | undefined {
  if (!spellcasting) {
    return spellcasting;
  }

  const next = remainingShape(
    setMax(
      poolFromRemaining(spellcasting.focusPoints.current, spellcasting.focusPoints.max),
      nextMax
    )
  );

  return {
    ...spellcasting,
    focusPoints: { ...spellcasting.focusPoints, current: next.current, max: next.max },
  };
}

export function shortRestPf2eSpellcasting(
  spellcasting?: Pf2eSpellcasting
): Pf2eSpellcasting | undefined {
  if (!spellcasting) {
    return spellcasting;
  }

  // A short rest returns to the pool a single expended focus point (CRB: Refocus
  // recovers 1). On the {current,max} focus pool that is a `restore` of 1.
  return {
    ...spellcasting,
    focusPoints: {
      ...spellcasting.focusPoints,
      current: remainingShape(
        restore(poolFromRemaining(spellcasting.focusPoints.current, spellcasting.focusPoints.max))
      ).current,
    },
  };
}

export function longRestPf2eSpellcasting(
  spellcasting?: Pf2eSpellcasting
): Pf2eSpellcasting | undefined {
  if (!spellcasting) {
    return spellcasting;
  }

  // Daily preparations refill every slot rank and all focus points: each slot's
  // expended count is `reset` to 0, and the focus pool is `reset` to full.
  const slots: Record<number, { max: number; used: number }> = {};
  for (const [level, slot] of Object.entries(spellcasting.spellSlots)) {
    slots[Number(level)] = { ...slot, used: reset(slotPool(slot)).spent };
  }

  return {
    ...spellcasting,
    spellSlots: slots,
    focusPoints: {
      ...spellcasting.focusPoints,
      current: remainingShape(
        reset(poolFromRemaining(spellcasting.focusPoints.current, spellcasting.focusPoints.max))
      ).current,
    },
  };
}
