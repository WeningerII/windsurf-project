/**
 * d20-legacy (D&D 3.5e + Pathfinder 1e) contribution ledger — explains the total
 * Armor Class the sheet shows.
 *
 * The base terms (10 + armor + shield + capped Dex + size) come from the SAME
 * `computeD20LegacyACBreakdown` the engine's scalar `computeD20LegacyAC`
 * delegates to, so the breakdown can't drift from the displayed total. Magic
 * items, feats, and features are projected from the shared RFC-003 resolver's
 * applied-effect ledger — the exact `acBonus` the engine adds to the total.
 * Folding the 'armorClass.total' entries reproduces `data.armorClass.total`.
 * (Touch and flat-footed are not magic-adjusted today, so only Total is
 * surfaced.) This is a non-persisted explanation; it never writes to the
 * document.
 */
import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import { resolveCharacterEffects, toContributionLedger } from '../../rules';
import { computeD20LegacyACBreakdown, type AcContributionTerm } from '../../utils/armorClass';
import type { D20LegacyData } from './d20LegacySheetShared';

export type D20LegacyContributionSystemId = 'dnd-3.5e' | 'pf1e';

const AC_TOTAL_TARGET = 'armorClass.total';

type D20LegacyEquipmentItem = D20LegacyData['equipment'][number];

export function buildD20LegacyContributionLedger(
  document: CharacterDocument<D20LegacyData>,
  systemId: D20LegacyContributionSystemId
): ContributionLedgerResult {
  const data = document.system;
  const { terms } = computeD20LegacyACBreakdown(
    data.baseAttributes.dex ?? 10,
    data.sizeCategory,
    data.equipment
  );
  const equippedArmor = data.equipment.find(
    (item) => item.equipped && item.armorClass != null && !item.shieldBonus
  );
  const equippedShield = data.equipment.find((item) => item.equipped && item.shieldBonus != null);

  const entries = [
    ...terms
      .filter((term) => term.operation === 'set' || term.value !== 0)
      .map((term) => acTermToEntry(systemId, term, equippedArmor, equippedShield)),
    // Magic items, feats, and features resolve through the shared RFC-003 IR;
    // project the SAME applied-effect ledger the engine sums into total AC. The
    // resolver speaks target 'ac'; normalize to the data model's 'armorClass.total'.
    ...toContributionLedger(
      resolveCharacterEffects(systemId, {
        equipment: data.equipment.filter((item) => item.equipped),
        feats: data.feats,
        features: data.features,
      }).result.ledger
    ).entries.map((entry) =>
      entry.target === 'ac' ? { ...entry, target: AC_TOTAL_TARGET } : entry
    ),
  ];

  return { entries };
}

function acTermToEntry(
  systemId: D20LegacyContributionSystemId,
  term: AcContributionTerm,
  armor: D20LegacyEquipmentItem | undefined,
  shield: D20LegacyEquipmentItem | undefined
): ContributionLedgerEntry {
  switch (term.key) {
    case 'armor':
      return createEntry(systemId, {
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
      return createEntry(systemId, {
        sourceKind: 'item',
        sourceId: shield?.itemId,
        sourceLabel: shield?.name ?? shield?.itemId ?? 'Shield',
        label: 'Shield AC bonus',
        operation: term.operation,
        value: term.value,
        sourcePath: 'system.equipment',
        details: term.details,
      });
    case 'base':
      return createEntry(systemId, {
        sourceKind: 'system',
        sourceLabel: 'Base',
        label: 'Base AC',
        operation: term.operation,
        value: term.value,
        details: term.details,
      });
    default:
      // 'dex' / 'size' — system-sourced numeric terms.
      return createEntry(systemId, {
        sourceKind: 'system',
        sourceLabel: term.label,
        label: term.label,
        operation: term.operation,
        value: term.value,
        details: term.details,
      });
  }
}

function createEntry(
  systemId: D20LegacyContributionSystemId,
  params: {
    sourceKind: ContributionSourceKind;
    sourceLabel: string;
    label: string;
    operation: ContributionOperation;
    value: number;
    sourceId?: string;
    sourcePath?: string;
    details?: Record<string, unknown>;
  }
): ContributionLedgerEntry {
  return {
    id: ledgerId(
      systemId,
      'defense',
      AC_TOTAL_TARGET,
      params.sourceLabel,
      params.label,
      String(params.value)
    ),
    systemId,
    target: AC_TOTAL_TARGET,
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

function ledgerId(...parts: string[]): string {
  return parts
    .join(':')
    .toLowerCase()
    .replace(/[^a-z0-9:.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
