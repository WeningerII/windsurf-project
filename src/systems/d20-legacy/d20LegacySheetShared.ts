import type { Dnd35eDataModel } from '../dnd35e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';

export type D20LegacyData = Dnd35eDataModel | Pf1eDataModel;

export function resetD20LegacySpellSlots(
  spellsPerDay?: Record<number, { total: number; used: number }>
) {
  if (!spellsPerDay) {
    return spellsPerDay;
  }

  const next: Record<number, { total: number; used: number }> = {};
  for (const [level, slots] of Object.entries(spellsPerDay)) {
    const numericLevel = Number(level);
    next[numericLevel] = { ...slots, used: 0 };
  }

  return next;
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
