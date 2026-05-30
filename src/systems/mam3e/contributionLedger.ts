import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
} from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import type { Power } from '../../types/mam/powers';
import type { Mam3eDataModel } from './data-model';
import {
  calculatePowerPointCost,
  getPowerModifierRank,
  getPowerRank,
  MAM3E_MODIFIER_BY_ID,
} from './powerMath';

export function buildMam3eContributionLedger(
  document: CharacterDocument<Mam3eDataModel>
): ContributionLedgerResult {
  return {
    entries: document.system.powers.flatMap((power, index) =>
      buildMam3ePowerCostLedgerEntries(power, index)
    ),
  };
}

export function buildMam3ePowerCostLedgerEntries(
  power: Power,
  powerIndex = 0
): ContributionLedgerEntry[] {
  const rank = getPowerRank(power);
  const entries: ContributionLedgerEntry[] = [
    createPowerCostEntry(powerIndex, {
      target: 'costPerRank',
      sourceId: power.id,
      sourceLabel: power.name,
      sourceKind: 'power',
      label: 'Base cost per rank',
      value: Number.isFinite(power.baseCost) ? power.baseCost : 0,
      details: { rank, perRank: power.perRank },
    }),
  ];
  let costPerRank = Number.isFinite(power.baseCost) ? power.baseCost : 0;
  let flatCost = 0;

  [...(power.extras ?? []), ...(power.flaws ?? [])].forEach((modifierId) => {
    const modifier = MAM3E_MODIFIER_BY_ID.get(modifierId);

    if (!modifier) {
      entries.push(
        createPowerCostEntry(powerIndex, {
          target: 'totalCost',
          sourceId: modifierId,
          sourceLabel: modifierId,
          sourceKind: 'power-modifier',
          label: 'Unknown power modifier ignored',
          value: 0,
          manualBoundary: {
            kind: 'unsupported',
            note: 'Modifier id is not present in the loader-backed M&M modifier catalog.',
          },
        })
      );
      return;
    }

    const modifierRank = getPowerModifierRank(power, modifierId);
    const perRankContribution = modifier.costPerRank * modifierRank;
    const flatContribution = (modifier.flatCost ?? 0) * modifierRank;
    costPerRank += perRankContribution;
    flatCost += flatContribution;

    if (perRankContribution !== 0) {
      entries.push(
        createPowerCostEntry(powerIndex, {
          target: 'costPerRank',
          sourceId: modifier.id,
          sourceLabel: modifier.name,
          sourceKind: 'power-modifier',
          label: `${modifier.name} per-rank cost`,
          value: perRankContribution,
          details: { modifierRank, costPerRank: modifier.costPerRank, modifierType: modifier.type },
        })
      );
    }

    if (flatContribution !== 0) {
      entries.push(
        createPowerCostEntry(powerIndex, {
          target: 'flatCost',
          sourceId: modifier.id,
          sourceLabel: modifier.name,
          sourceKind: 'power-modifier',
          label: `${modifier.name} flat cost`,
          value: flatContribution,
          details: { modifierRank, flatCost: modifier.flatCost, modifierType: modifier.type },
        })
      );
    }
  });

  entries.push(
    createPowerCostEntry(powerIndex, {
      target: 'totalCost',
      sourceId: power.id,
      sourceLabel: power.name,
      sourceKind: 'power',
      label: 'Total power cost',
      operation: 'set',
      value: calculatePowerPointCost(power),
      details: { rank, costPerRank, flatCost },
    })
  );

  return entries;
}

function createPowerCostEntry(
  powerIndex: number,
  params: {
    target: 'costPerRank' | 'flatCost' | 'totalCost';
    sourceId: string;
    sourceLabel: string;
    sourceKind: 'power' | 'power-modifier';
    label: string;
    value: number;
    operation?: 'add' | 'set';
    details?: Record<string, unknown>;
    manualBoundary?: ContributionLedgerEntry['manualBoundary'];
  }
): ContributionLedgerEntry {
  const target = `powers.${powerIndex}.${params.target}`;

  return {
    id: ledgerId('mam3e', target, params.sourceLabel, params.label, String(params.value)),
    systemId: 'mam3e',
    target,
    source: {
      kind: params.sourceKind,
      id: params.sourceId,
      label: params.sourceLabel,
      path: `system.powers.${powerIndex}`,
    },
    label: params.label,
    operation: params.operation ?? 'add',
    value: params.value,
    category: 'cost',
    details: params.details,
    manualBoundary: params.manualBoundary,
  };
}

function ledgerId(...parts: string[]): string {
  return parts
    .join(':')
    .toLowerCase()
    .replace(/[^a-z0-9:.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
