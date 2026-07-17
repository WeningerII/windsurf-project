import {
  clampCount,
  createPool,
  poolFromRemaining,
  remainingShape,
  reset,
} from '../../utils/resourcePool';
import { DAGGERHEART_MAX_HOPE } from '../../rules/daggerheartDerived';
import type { DaggerheartDataModel } from './data-model';

/**
 * Daggerheart long-rest downtime moves as pure, deterministic patch builders.
 *
 * Daggerheart rest is MOVE-BASED: on a long rest each character makes two
 * downtime moves (SRD "Downtime"). The moves modeled here are the fully
 * deterministic long-rest versions — "...All..." clears and Prepare — each
 * built on RFC 005's resource-pool `reset` verb (that RFC's future work names
 * "rest as a first-class `reset`"). Deliberately NOT modeled, to avoid faking a
 * roll or a choice: the short-rest variants (Tend to Wounds / Clear Stress /
 * Repair Armor clear `1d4 + tier`, a seeded roll) and the narrative "Work on a
 * Project" move — those stay GM-adjudicated follow-ups. Nothing here applies a
 * whole rest at once; the caller offers the moves and the player picks the two
 * they make.
 *
 * Pool shapes: Hit Points are a REMAINING pool (`current` = HP left), so a full
 * heal is `reset` of the remaining view; Stress and Armor Slots are MARKED
 * pools (`current` = marked), so clearing is `reset` to zero marked; Hope is a
 * plain counter capped at {@link DAGGERHEART_MAX_HOPE}.
 */

/** Tend to All Wounds: clear every marked Hit Point (heal to full). */
export function tendToAllWounds(data: DaggerheartDataModel): Partial<DaggerheartDataModel> {
  const healed = reset(poolFromRemaining(data.hitPoints.current, data.hitPoints.max));
  return { hitPoints: { ...data.hitPoints, ...remainingShape(healed) } };
}

/** Clear All Stress: reset the Stress track to unmarked. */
export function clearAllStress(data: DaggerheartDataModel): Partial<DaggerheartDataModel> {
  const cleared = reset(createPool(data.stress.max, data.stress.current));
  return { stress: { ...data.stress, current: cleared.spent } };
}

/** Repair All Armor: reset every marked Armor Slot. */
export function repairAllArmor(data: DaggerheartDataModel): Partial<DaggerheartDataModel> {
  const repaired = reset(createPool(data.armor.max, data.armor.current));
  return { armor: { ...data.armor, current: repaired.spent } };
}

/** Prepare: gain 1 Hope (clamped to the Hope maximum). */
export function prepareGainHope(data: DaggerheartDataModel): Partial<DaggerheartDataModel> {
  return { hope: clampCount(data.hope + 1, DAGGERHEART_MAX_HOPE) };
}
