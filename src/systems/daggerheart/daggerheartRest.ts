import {
  clampCount,
  createPool,
  poolFromRemaining,
  remainingShape,
  reset,
  restore,
} from '../../utils/resourcePool';
import { DAGGERHEART_MAX_HOPE } from '../../rules/daggerheartDerived';
import type { DaggerheartDataModel } from './data-model';

/**
 * Daggerheart downtime moves as pure, deterministic patch builders.
 *
 * Daggerheart rest is MOVE-BASED: on a rest each character makes downtime moves
 * (SRD "Downtime") — two on a long rest, one on a short rest. Both kinds are
 * modeled here as individual, honestly-labeled patches; nothing applies a whole
 * rest at once, so the caller offers the moves and the player picks which they
 * make.
 *
 * Long-rest moves ("...All..." clears and Prepare) are fully deterministic —
 * each built on RFC 005's resource-pool `reset` verb (that RFC's future work
 * named "rest as a first-class `reset`"). Short-rest moves (Tend to Wounds /
 * Clear Stress / Repair Armor) clear `1d4 + tier`; each builder takes the
 * ALREADY-ROLLED recovery amount (see {@link getDaggerheartShortRestRecovery})
 * rather than an Rng, so it stays deterministic and unit-testable — the caller
 * rolls the live d4 and passes the total in. The narrative "Work on a Project"
 * move stays GM-adjudicated.
 *
 * Pool shapes: Hit Points are a REMAINING pool (`current` = HP left), so a heal
 * is `restore` of the remaining view (a full heal is `reset`); Stress and Armor
 * Slots are MARKED pools (`current` = marked), so clearing is `restore` toward
 * zero marked (`reset` clears the whole track); Hope is a plain counter capped
 * at {@link DAGGERHEART_MAX_HOPE}.
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

/**
 * Tend to Wounds (short rest): heal `recovery` Hit Points, where `recovery` is
 * the already-rolled `1d4 + tier` (SRD: Downtime; see
 * {@link getDaggerheartShortRestRecovery}). `restore` on the REMAINING view,
 * clamped so healing never carries HP above max.
 */
export function tendToWounds(
  data: DaggerheartDataModel,
  recovery: number
): Partial<DaggerheartDataModel> {
  const healed = restore(poolFromRemaining(data.hitPoints.current, data.hitPoints.max), recovery);
  return { hitPoints: { ...data.hitPoints, ...remainingShape(healed) } };
}

/**
 * Clear Stress (short rest): clear `recovery` marked Stress, where `recovery` is
 * the already-rolled `1d4 + tier` (SRD: Downtime; see
 * {@link getDaggerheartShortRestRecovery}). `restore` on the MARKED pool,
 * clamped at zero marked.
 */
export function clearStress(
  data: DaggerheartDataModel,
  recovery: number
): Partial<DaggerheartDataModel> {
  const cleared = restore(createPool(data.stress.max, data.stress.current), recovery);
  return { stress: { ...data.stress, current: cleared.spent } };
}

/**
 * Repair Armor (short rest): clear `recovery` marked Armor Slots, where
 * `recovery` is the already-rolled `1d4 + tier` (SRD: Downtime; see
 * {@link getDaggerheartShortRestRecovery}). `restore` on the MARKED pool,
 * clamped at zero marked.
 */
export function repairArmor(
  data: DaggerheartDataModel,
  recovery: number
): Partial<DaggerheartDataModel> {
  const repaired = restore(createPool(data.armor.max, data.armor.current), recovery);
  return { armor: { ...data.armor, current: repaired.spent } };
}
