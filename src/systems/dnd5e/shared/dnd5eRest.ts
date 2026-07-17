import { Feature, HitDice, SpellcastingInfo } from '../../../types/core/character';
import {
  poolFromRemaining,
  remainingShape,
  reset,
  type ResourcePool,
} from '../../../utils/resourcePool';

/**
 * View one 5e spell-slot (or pact-magic) level as a generic resource pool: the
 * cap lives in `max` and the consumed count in `used`, mapping directly onto a
 * pool's `max`/`spent`. Any extra per-level fields (e.g. pact magic's `level`)
 * stay on the slot and are untouched by reset.
 */
const slotPool = (slot: { max: number; used: number }): ResourcePool => ({
  max: slot.max,
  spent: slot.used,
});

function recoverFeatures(features: Feature[], restType: 'short' | 'long'): Feature[] {
  return features.map((feature) => {
    if (!feature.uses) return feature;

    const recoversOnShort = feature.uses.recoveryType === 'short-rest';
    const recoversOnLong = feature.uses.recoveryType === 'long-rest';
    const shouldRecover = recoversOnShort || (restType === 'long' && recoversOnLong);

    if (!shouldRecover) return feature;
    return {
      ...feature,
      uses: {
        ...feature.uses,
        current: feature.uses.max,
      },
    };
  });
}

function recoverLongRestHitDice(hitDice: HitDice[]): HitDice[] {
  if (hitDice.length === 0) return hitDice;

  const totalHitDice = hitDice.reduce((sum, pool) => sum + pool.total, 0);
  let recovery = Math.max(1, Math.floor(totalHitDice / 2));
  const recovered = hitDice.map((pool) => ({ ...pool }));

  while (recovery > 0) {
    const nextIndex = recovered.findIndex((pool) => pool.remaining < pool.total);
    if (nextIndex === -1) break;
    recovered[nextIndex].remaining += 1;
    recovery -= 1;
  }

  return recovered;
}

/** Warlock Pact Magic slots recover on a short rest (SRD 5.1/5.2). */
function recoverPactMagicSlots(spellcasting?: SpellcastingInfo): SpellcastingInfo | undefined {
  if (!spellcasting?.pactMagic) return spellcasting;

  return {
    ...spellcasting,
    pactMagic: { ...spellcasting.pactMagic, used: reset(slotPool(spellcasting.pactMagic)).spent },
  };
}

function recoverAllSpellSlots(spellcasting?: SpellcastingInfo): SpellcastingInfo | undefined {
  if (!spellcasting) return spellcasting;

  const slots = { ...spellcasting.spellSlots };
  for (let level = 1; level <= 9; level += 1) {
    const key = level as keyof typeof slots;
    slots[key] = { ...slots[key], used: reset(slotPool(slots[key])).spent };
  }

  return recoverPactMagicSlots({
    ...spellcasting,
    spellSlots: slots,
  });
}

export function applyDnd5eShortRest<
  T extends { features: Feature[]; spellcasting?: SpellcastingInfo },
>(state: T): T {
  return {
    ...state,
    features: recoverFeatures(state.features, 'short'),
    spellcasting: recoverPactMagicSlots(state.spellcasting),
  };
}

export function applyDnd5eLongRest<
  T extends {
    hitPoints: { current: number; max: number; temp: number };
    hitDice: HitDice[];
    spellcasting?: SpellcastingInfo;
    features: Feature[];
    deathSaves: { successes: number; failures: number };
    exhaustionLevel: number;
  },
>(state: T): T {
  const healedHitPoints = remainingShape(
    reset(poolFromRemaining(state.hitPoints.current, state.hitPoints.max))
  );

  return {
    ...state,
    hitPoints: {
      ...state.hitPoints,
      current: healedHitPoints.current,
      temp: 0,
    },
    hitDice: recoverLongRestHitDice(state.hitDice),
    spellcasting: recoverAllSpellSlots(state.spellcasting),
    features: recoverFeatures(state.features, 'long'),
    deathSaves: { successes: 0, failures: 0 },
    exhaustionLevel: Math.max(0, state.exhaustionLevel - 1),
  };
}
