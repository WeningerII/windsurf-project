import type { Dnd35eDataModel } from '../dnd35e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';

export type D20LegacyData = Dnd35eDataModel | Pf1eDataModel;
export type D20LegacySpellSlots = Record<
  number,
  { total: number; used: number; manualBonus?: number }
>;
export type D20LegacyManualSpellcastingExtras = NonNullable<
  D20LegacyData['manualSpellcastingExtras']
>;

export function resetD20LegacySpellSlots(spellsPerDay?: D20LegacySpellSlots) {
  if (!spellsPerDay) {
    return spellsPerDay;
  }

  const next: D20LegacySpellSlots = {};
  for (const [level, slots] of Object.entries(spellsPerDay)) {
    const numericLevel = Number(level);
    next[numericLevel] = { ...slots, used: 0 };
  }

  return next;
}

export function resetD20LegacyManualSpellcastingExtras(
  extras?: D20LegacyData['manualSpellcastingExtras']
): D20LegacyData['manualSpellcastingExtras'] {
  if (!extras) {
    return extras;
  }

  return {
    ...extras,
    domainSlotConsumedByLevel: Object.fromEntries(
      Object.keys(extras.domainSlotConsumedByLevel ?? {}).map((level) => [Number(level), false])
    ),
    specialistSlotConsumedByLevel: Object.fromEntries(
      Object.keys(extras.specialistSlotConsumedByLevel ?? {}).map((level) => [Number(level), false])
    ),
    dragonDiscipleBonusSlots: extras.dragonDiscipleBonusSlots
      ? { ...extras.dragonDiscipleBonusSlots, used: 0 }
      : undefined,
  };
}

export function setD20LegacyPreparedSpell(
  preparedSpellsByLevel: D20LegacyData['preparedSpellsByLevel'] | undefined,
  level: number,
  slotIndex: number,
  spellId: string
): D20LegacyData['preparedSpellsByLevel'] {
  const nextPreparedSpellsByLevel = { ...(preparedSpellsByLevel ?? {}) };
  const nextLevelSelections = [...(nextPreparedSpellsByLevel[level] ?? [])];

  nextLevelSelections[slotIndex] = spellId;
  while (nextLevelSelections.length > 0 && !nextLevelSelections.at(-1)) {
    nextLevelSelections.pop();
  }

  if (nextLevelSelections.length > 0) {
    nextPreparedSpellsByLevel[level] = nextLevelSelections;
  } else {
    delete nextPreparedSpellsByLevel[level];
  }

  return nextPreparedSpellsByLevel;
}

export function spendD20LegacySpellSlot(
  spellsPerDay: D20LegacySpellSlots | undefined,
  level: number
): D20LegacySpellSlots | undefined {
  const slot = spellsPerDay?.[level];
  if (!spellsPerDay || !slot) {
    return spellsPerDay;
  }

  return {
    ...spellsPerDay,
    [level]: { ...slot, used: Math.min(slot.total, slot.used + 1) },
  };
}

export function recoverD20LegacySpellSlot(
  spellsPerDay: D20LegacySpellSlots | undefined,
  level: number
): D20LegacySpellSlots | undefined {
  const slot = spellsPerDay?.[level];
  if (!spellsPerDay || !slot) {
    return spellsPerDay;
  }

  return {
    ...spellsPerDay,
    [level]: { ...slot, used: Math.max(0, slot.used - 1) },
  };
}

export function setD20LegacySpellSlotTotal(
  spellsPerDay: D20LegacySpellSlots | undefined,
  level: number,
  total: number
): D20LegacySpellSlots | undefined {
  const slot = spellsPerDay?.[level];
  if (!spellsPerDay || !slot) {
    return spellsPerDay;
  }

  // The engine recomputes totals from the class tables on every prepare, so a
  // raw total edit would be reverted. Record the edit as a delta from the
  // automated baseline (current total minus the previously recorded delta);
  // mergeVancianSpellSlots re-applies it after each recompute.
  const automatedBaseline = slot.total - (slot.manualBonus ?? 0);
  const nextTotal = Math.max(0, total);
  const nextManualBonus = nextTotal - automatedBaseline;
  return {
    ...spellsPerDay,
    [level]: {
      total: nextTotal,
      used: Math.min(slot.used, nextTotal),
      ...(nextManualBonus !== 0 ? { manualBonus: nextManualBonus } : {}),
    },
  };
}

export function getIterativeAttackBonuses(baseAttackBonus: number): number[] {
  const attacks = [baseAttackBonus];
  for (let penalty = 5; attacks.length < 4; penalty += 5) {
    const bonus = baseAttackBonus - penalty;
    if (bonus < 1) {
      break;
    }
    attacks.push(bonus);
  }

  return attacks;
}
