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
