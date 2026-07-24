import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
} from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import type { EffectInstance } from '../../rules';
import { resolveEffects, toContributionLedger } from '../../rules';
import type { Power } from '../../types/mam/powers';
import type { Mam3eDataModel } from './data-model';
import {
  calculateMam3eFinalPowerCost,
  getPowerModifierRank,
  getPowerRank,
  MAM3E_MODIFIER_BY_ID,
} from './powerMath';

/**
 * Non-persisted contribution ledger for Mutants & Masterminds 3e. It explains
 * where each power's point cost comes from: the base cost-per-rank, every
 * extra/flaw's per-rank and flat contribution, and the final total after the
 * minimum-cost rule.
 *
 * W4 re-backing: rather than hand-assembling `ContributionLedgerEntry` objects,
 * the builder now emits the SAME primitive the resolver reads — `EffectInstance`s
 * over M&M's cost targets (`powers.<i>.costPerRank|flatCost|totalCost`, the
 * namespace the IR reserves for "M&M cost math", see `StackPolicy`) — folds them
 * through `resolveEffects`, and projects the applied-effect ledger with
 * `toContributionLedger`. Provenance and resolution are therefore one computation,
 * mirroring how `buildPf2eContributionLedger` / `buildD20LegacyContributionLedger`
 * project resolver output into rows. `resolveCharacterLedger` itself is exactly
 * this seam (`toContributionLedger(resolveCharacterEffects(...).result.ledger)`)
 * specialized to equipment/feat/feature/condition inputs; M&M's cost targets ride
 * the same underlying `resolveEffects` → `toContributionLedger` pair without
 * needing a shared-file input shape for power costs.
 *
 * These rows are EXPLANATION only — never stored on the document, never an
 * alternate state source. Because the cost effects use `'sum'` stacking and are
 * unconditional, the projected ledger is row-for-row equivalent to the previous
 * hand-built output (totals + sources unchanged).
 */
export function buildMam3eContributionLedger(
  document: CharacterDocument<Mam3eDataModel>
): ContributionLedgerResult {
  const effects = document.system.powers.flatMap((power, index) =>
    buildMam3ePowerCostEffects(power, index)
  );
  return toContributionLedger(resolveEffects(effects).ledger);
}

/**
 * Resolver-projected cost-ledger rows for a single power. Builds the power's cost
 * effects and folds them through the resolver, so the returned entries are the
 * exact projection of the applied-effect ledger.
 */
export function buildMam3ePowerCostLedgerEntries(
  power: Power,
  powerIndex = 0
): ContributionLedgerEntry[] {
  return toContributionLedger(resolveEffects(buildMam3ePowerCostEffects(power, powerIndex)).ledger)
    .entries;
}

/**
 * Compile a power's cost math into `EffectInstance`s over its cost targets. The
 * arithmetic is unchanged from the previous hand-built ledger (base cost per rank,
 * each extra/flaw's per-rank and flat contribution, and the final total via
 * `calculateMam3eFinalPowerCost`); only the shape is now the shared IR primitive.
 */
function buildMam3ePowerCostEffects(power: Power, powerIndex = 0): EffectInstance[] {
  const rank = getPowerRank(power);
  const effects: EffectInstance[] = [
    createPowerCostEffect(powerIndex, {
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
      effects.push(
        createPowerCostEffect(powerIndex, {
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
      effects.push(
        createPowerCostEffect(powerIndex, {
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
      effects.push(
        createPowerCostEffect(powerIndex, {
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

  // Mirrors calculatePowerPointCost: when the effective cost per rank drops
  // below 1, the minimum-cost rule charges 1 point per (2 − costPerRank)
  // ranks, rounded up, and the final cost never falls below 1 (Hero's
  // Handbook, Powers — Modifiers).
  const totalCost = calculateMam3eFinalPowerCost(rank, costPerRank, flatCost);
  effects.push(
    createPowerCostEffect(powerIndex, {
      target: 'totalCost',
      sourceId: power.id,
      sourceLabel: power.name,
      sourceKind: 'power',
      label: 'Total power cost',
      operation: 'set',
      value: totalCost,
      details: {
        rank,
        costPerRank,
        flatCost,
        ...(costPerRank < 1 ? { minimumCostRule: { ranksPerPoint: 2 - costPerRank } } : {}),
      },
    })
  );

  return effects;
}

function createPowerCostEffect(
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
    manualBoundary?: EffectInstance['manualBoundary'];
  }
): EffectInstance {
  const target = `powers.${powerIndex}.${params.target}`;

  return {
    id: ledgerId('mam3e', target, params.sourceLabel, params.label, String(params.value)),
    systemId: 'mam3e',
    target,
    // M&M cost math sums additively (Hero's Handbook, Powers — Modifiers); 'sum'
    // is the IR's canonical stacking for it (see the `StackPolicy` doc comment).
    stackPolicy: 'sum',
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
