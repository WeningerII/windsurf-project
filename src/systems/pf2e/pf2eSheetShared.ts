import type { Pf2eDataModel, Pf2eProficiencyTier, Pf2eSpellcasting } from './data-model';

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

export function shortRestPf2eSpellcasting(
  spellcasting?: Pf2eSpellcasting
): Pf2eSpellcasting | undefined {
  if (!spellcasting) {
    return spellcasting;
  }

  return {
    ...spellcasting,
    focusPoints: {
      ...spellcasting.focusPoints,
      current: Math.min(spellcasting.focusPoints.max, spellcasting.focusPoints.current + 1),
    },
  };
}

export function longRestPf2eSpellcasting(
  spellcasting?: Pf2eSpellcasting
): Pf2eSpellcasting | undefined {
  if (!spellcasting) {
    return spellcasting;
  }

  const slots: Record<number, { max: number; used: number }> = {};
  for (const [level, slot] of Object.entries(spellcasting.spellSlots)) {
    slots[Number(level)] = { ...slot, used: 0 };
  }

  return {
    ...spellcasting,
    spellSlots: slots,
    focusPoints: {
      ...spellcasting.focusPoints,
      current: spellcasting.focusPoints.max,
    },
  };
}
