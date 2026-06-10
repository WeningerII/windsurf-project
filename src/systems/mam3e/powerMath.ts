import type { Power } from '../../types/mam/powers';
import { powerModifiers } from '../../data/mutants-and-masterminds/3e/modifiers';
import type { PowerModifier } from '../../data/mutants-and-masterminds/3e/modifiers/extras';

function normalizeRank(rank: number | undefined): number {
  if (!Number.isFinite(rank) || (rank ?? 0) < 1) return 1;
  return Math.floor(rank as number);
}

export const MAM3E_EXTRA_MODIFIERS = powerModifiers.extras;
export const MAM3E_FLAW_MODIFIERS = powerModifiers.flaws;
export const MAM3E_MODIFIER_BY_ID = new Map<string, PowerModifier>(
  [...MAM3E_EXTRA_MODIFIERS, ...MAM3E_FLAW_MODIFIERS].map((modifier) => [modifier.id, modifier])
);

export function getPowerRank(power: Power): number {
  if (!power.perRank) return 1;
  return normalizeRank(power.rank);
}

export function getPowerModifierRank(power: Power, modifierId: string): number {
  return normalizeRank(power.modifierRanks?.[modifierId]);
}

type Mam3eSpent = {
  abilities: number;
  powers: number;
  advantages: number;
  skills: number;
  defenses: number;
};

/** Total power points spent across all categories. */
export function sumMam3ePointsSpent(spent: Mam3eSpent): number {
  return spent.abilities + spent.powers + spent.advantages + spent.skills + spent.defenses;
}

/** Power points remaining = total budget − total spent (0 = fully-spent, balanced build). */
export function mam3ePointsRemaining(total: number, spent: Mam3eSpent): number {
  return total - sumMam3ePointsSpent(spent);
}

/**
 * M&M 3e measurements scale on a doubling track: each rank doubles the measure
 * (Hero's Handbook "Measurements" — distance/mass/time/volume). `rank0Value` is
 * the per-measure anchor (data, supplied by the caller); the doubling per rank
 * is the computation verified here.
 */
export function mam3eMeasurementByRank(rank0Value: number, rank: number): number {
  return rank0Value * 2 ** rank;
}

/**
 * Final power-point cost from effective cost per rank, rank, and flat
 * modifiers, applying the M&M 3e minimum-cost rule (Hero's Handbook, Powers —
 * Modifiers): when modifiers reduce an effect's cost below 1 point per rank,
 * it instead costs 1 point per 2 ranks (then 1 per 3 ranks, and so on),
 * rounded up — `ceil(rank / (2 - costPerRank))` — and no power with rank > 0
 * ever costs less than 1 point, even after flat flaws.
 */
export function calculateMam3eFinalPowerCost(
  rank: number,
  costPerRank: number,
  flatCost: number
): number {
  const perRankCost =
    costPerRank < 1
      ? Math.ceil(rank / (2 - costPerRank))
      : Math.round(costPerRank * rank * 100) / 100;
  const total = perRankCost + flatCost;
  return rank > 0 ? Math.max(1, total) : Math.max(0, total);
}

export function calculatePowerPointCost(power: Power): number {
  const rank = getPowerRank(power);
  let costPerRank = Number.isFinite(power.baseCost) ? power.baseCost : 0;
  let flatCost = 0;

  const modifierIds = [...(power.extras ?? []), ...(power.flaws ?? [])];
  for (const modifierId of modifierIds) {
    const modifier = MAM3E_MODIFIER_BY_ID.get(modifierId);
    if (!modifier) continue;
    const modifierRank = getPowerModifierRank(power, modifierId);
    costPerRank += modifier.costPerRank * modifierRank;
    flatCost += (modifier.flatCost ?? 0) * modifierRank;
  }

  return calculateMam3eFinalPowerCost(rank, costPerRank, flatCost);
}
