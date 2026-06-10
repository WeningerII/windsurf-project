import { Feature, HitDice, SpellcastingInfo } from '../types/core/character';

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
    pactMagic: { ...spellcasting.pactMagic, used: 0 },
  };
}

function recoverAllSpellSlots(spellcasting?: SpellcastingInfo): SpellcastingInfo | undefined {
  if (!spellcasting) return spellcasting;

  const slots = { ...spellcasting.spellSlots };
  for (let level = 1; level <= 9; level += 1) {
    const key = level as keyof typeof slots;
    slots[key] = { ...slots[key], used: 0 };
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
  return {
    ...state,
    hitPoints: {
      ...state.hitPoints,
      current: state.hitPoints.max,
      temp: 0,
    },
    hitDice: recoverLongRestHitDice(state.hitDice),
    spellcasting: recoverAllSpellSlots(state.spellcasting),
    features: recoverFeatures(state.features, 'long'),
    deathSaves: { successes: 0, failures: 0 },
    exhaustionLevel: Math.max(0, state.exhaustionLevel - 1),
  };
}
