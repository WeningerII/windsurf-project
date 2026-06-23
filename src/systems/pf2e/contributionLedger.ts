/**
 * PF2e contribution ledger — explains the Armor Class the sheet shows.
 *
 * The base terms (10 + armor + capped Dex + proficiency + raised shield) come
 * from the SAME `computePf2eACBreakdown` the engine's scalar `computePf2eAC`
 * delegates to, so the breakdown can't drift from the displayed value. Magic
 * items, feats, and features are projected from the shared RFC-003 resolver's
 * applied-effect ledger (the exact effects the engine sums into AC), and any
 * condition status penalty the engine subtracts is surfaced as a `subtract`
 * row. Folding the 'armorClass' entries reproduces `data.armorClass`.
 *
 * This is a non-persisted explanation; it never writes back to the document.
 */
import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import { resolveCharacterEffects, toContributionLedger } from '../../rules';
import { getPf2eConditionStatusPenalty } from '../../rules/conditions/pf2eConditions';
import { computePf2eACBreakdown, type AcContributionTerm } from '../../utils/armorClass';
import type { Pf2eDataModel } from './data-model';

const AC_TARGET = 'armorClass';

type Pf2eEquipmentItem = Pf2eDataModel['equipment'][number];

export function buildPf2eContributionLedger(
  document: CharacterDocument<Pf2eDataModel>
): ContributionLedgerResult {
  const data = document.system;

  const entries = [
    ...buildPf2eArmorClassEntries(data),
    // Magic items, feats, and features resolve through the shared RFC-003 IR;
    // project the SAME applied-effect ledger the engine sums for AC so each
    // source gets first-class provenance. The resolver speaks target 'ac';
    // normalize to the data model's 'armorClass' so the breakdown groups as one.
    ...toContributionLedger(
      resolveCharacterEffects('pf2e', {
        equipment: data.equipment.filter((item) => item.equipped),
        feats: data.feats,
        features: data.features,
      }).result.ledger
    ).entries.map((entry) => (entry.target === 'ac' ? { ...entry, target: AC_TARGET } : entry)),
  ];

  return { entries };
}

function buildPf2eArmorClassEntries(data: Pf2eDataModel): ContributionLedgerEntry[] {
  const equippedArmor = data.equipment.find(
    (item) => item.equipped && item.armorClass != null && !item.shieldBonus
  );
  const equippedShield = data.equipment.find((item) => item.equipped && item.shieldBonus != null);
  const armorCategory = equippedArmor?.armorType ?? 'unarmored';
  // Mirror the engine: proficiency is the equipped armor category's total,
  // falling back to unarmored (already level+tier on a prepared document).
  const armorProf =
    data.armorProficiencies[armorCategory]?.total ?? data.armorProficiencies.unarmored?.total ?? 0;

  const { terms } = computePf2eACBreakdown(
    data.baseAttributes.dex ?? 10,
    armorProf,
    data.equipment
  );

  const entries = terms
    .filter((term) => term.operation === 'set' || term.value !== 0)
    .map((term) => acTermToEntry(term, armorCategory, equippedArmor, equippedShield));

  // Status penalties (frightened/sickened/clumsy) are layered on by the engine
  // AFTER the armor's Dex cap; surface them as a subtract so the fold matches.
  const statusPenalty = getPf2eConditionStatusPenalty(data.conditions, 'dex');
  if (statusPenalty !== 0) {
    entries.push(
      createEntry({
        target: AC_TARGET,
        sourceKind: 'condition',
        sourceLabel: 'Status penalty',
        label: 'Condition status penalty to AC',
        operation: 'subtract',
        value: statusPenalty,
        sourcePath: 'system.conditions',
      })
    );
  }

  return entries;
}

function acTermToEntry(
  term: AcContributionTerm,
  armorCategory: string,
  armor: Pf2eEquipmentItem | undefined,
  shield: Pf2eEquipmentItem | undefined
): ContributionLedgerEntry {
  switch (term.key) {
    case 'armor':
      return createEntry({
        target: AC_TARGET,
        sourceKind: 'item',
        sourceId: armor?.itemId,
        sourceLabel: armor?.name ?? armor?.itemId ?? 'Armor',
        label: 'Equipped armor AC bonus',
        operation: term.operation,
        value: term.value,
        sourcePath: 'system.equipment',
        details: term.details,
      });
    case 'shield':
      return createEntry({
        target: AC_TARGET,
        sourceKind: 'item',
        sourceId: shield?.itemId,
        sourceLabel: shield?.name ?? shield?.itemId ?? 'Shield',
        label: 'Raised shield AC bonus',
        operation: term.operation,
        value: term.value,
        sourcePath: 'system.equipment',
        details: term.details,
      });
    case 'proficiency':
      return createEntry({
        target: AC_TARGET,
        sourceKind: 'class',
        sourceLabel: `${capitalize(armorCategory)} proficiency`,
        label: 'Armor proficiency bonus',
        operation: term.operation,
        value: term.value,
        sourcePath: `system.armorProficiencies.${armorCategory}`,
        details: term.details,
      });
    case 'base':
      return createEntry({
        target: AC_TARGET,
        sourceKind: 'system',
        sourceLabel: armor ? 'Base' : 'Unarmored base',
        label: 'Base AC',
        operation: term.operation,
        value: term.value,
        details: term.details,
      });
    default:
      // 'dex' (and any future numeric term) — system-sourced.
      return createEntry({
        target: AC_TARGET,
        sourceKind: 'system',
        sourceLabel: term.label,
        label: term.label,
        operation: term.operation,
        value: term.value,
        details: term.details,
      });
  }
}

function createEntry(params: {
  target: string;
  sourceKind: ContributionSourceKind;
  sourceLabel: string;
  label: string;
  operation: ContributionOperation;
  value: number;
  sourceId?: string;
  sourcePath?: string;
  details?: Record<string, unknown>;
}): ContributionLedgerEntry {
  return {
    id: ledgerId(
      'pf2e',
      'defense',
      params.target,
      params.sourceLabel,
      params.label,
      String(params.value)
    ),
    systemId: 'pf2e',
    target: params.target,
    source: {
      kind: params.sourceKind,
      label: params.sourceLabel,
      id: params.sourceId,
      path: params.sourcePath,
    },
    label: params.label,
    operation: params.operation,
    value: params.value,
    category: 'defense',
    details: params.details,
  };
}

function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}

function ledgerId(...parts: string[]): string {
  return parts
    .join(':')
    .toLowerCase()
    .replace(/[^a-z0-9:.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
