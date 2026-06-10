import type {
  ContributionCategory,
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../types/core/contributionLedger';
import type {
  DaggerheartPassiveBonuses,
  DaggerheartPassiveDerivedBonus,
} from '../../types/daggerheart';
import type { CharacterDocument } from '../../types/core/document';
import { getDaggerheartInventoryDefinition } from '../../utils/daggerheartInventory';
import {
  getDaggerheartActivePassiveDomainCards,
  getDaggerheartEffectiveAttribute,
  getDaggerheartProficiency,
  getDaggerheartTier,
  getEquippedDaggerheartArmor,
  getEquippedDaggerheartWeapon,
} from '../../utils/daggerheartDerived';
import type { DaggerheartDataModel } from './data-model';

type PassiveSource = {
  kind: ContributionSourceKind;
  id: string;
  label: string;
  path: string;
  note?: string;
  bonuses?: DaggerheartPassiveBonuses;
  derivedBonuses?: DaggerheartPassiveDerivedBonus[];
  multiplier?: number;
};

export function buildDaggerheartContributionLedger(
  document: CharacterDocument<DaggerheartDataModel>
): ContributionLedgerResult {
  const sources = getDaggerheartPassiveSources(document.system);
  const entries = sources.flatMap((source) => [
    ...buildPassiveBonusEntries(source),
    ...buildPassiveDerivedBonusEntries(document.system, source),
  ]);

  return { entries };
}

function getDaggerheartPassiveSources(system: DaggerheartDataModel): PassiveSource[] {
  const sources: PassiveSource[] = [];
  const primaryWeapon = getEquippedDaggerheartWeapon(system, 'primary');
  const secondaryWeapon = getEquippedDaggerheartWeapon(system, 'secondary');
  const armor = getEquippedDaggerheartArmor(system);

  if (primaryWeapon?.passiveBonuses) {
    sources.push({
      kind: 'item',
      id: primaryWeapon.id,
      label: primaryWeapon.name,
      path: 'system.weapons.primaryId',
      bonuses: primaryWeapon.passiveBonuses,
    });
  }

  if (secondaryWeapon?.passiveBonuses) {
    sources.push({
      kind: 'item',
      id: secondaryWeapon.id,
      label: secondaryWeapon.name,
      path: 'system.weapons.secondaryId',
      bonuses: secondaryWeapon.passiveBonuses,
    });
  }

  if (armor?.passiveBonuses) {
    sources.push({
      kind: 'item',
      id: armor.id,
      label: armor.name,
      path: 'system.armorId',
      bonuses: armor.passiveBonuses,
    });
  }

  // Active passive cards come from the same helper the derived stats use
  // (utils/daggerheartDerived), so the ledger can never diverge from them.
  getDaggerheartActivePassiveDomainCards(system).forEach((card) => {
    sources.push({
      kind: 'domain-card',
      id: card.id,
      label: card.name,
      path: 'system.domainCards',
      note: card.automationNote,
      bonuses: card.passiveBonuses,
      derivedBonuses: card.passiveDerivedBonuses,
    });
  });

  system.inventory.forEach((entry, index) => {
    const definition = getDaggerheartInventoryDefinition(entry.itemId);
    if (!definition?.passiveBonuses) {
      return;
    }

    sources.push({
      kind: 'item',
      id: definition.id,
      label: definition.name,
      path: `system.inventory.${index}`,
      bonuses: definition.passiveBonuses,
      multiplier: Math.max(1, entry.quantity || 1),
    });
  });

  return sources;
}

function buildPassiveBonusEntries(source: PassiveSource): ContributionLedgerEntry[] {
  const bonuses = source.bonuses;
  const multiplier = source.multiplier ?? 1;

  if (!bonuses) {
    return [];
  }

  return [
    ...createNumericBonusEntry(source, 'evasion', bonuses.evasion, 'defense', multiplier),
    ...createNumericBonusEntry(source, 'armorScore', bonuses.armorScore, 'defense', multiplier),
    ...createNumericBonusEntry(
      source,
      'majorThreshold',
      bonuses.majorThreshold,
      'defense',
      multiplier
    ),
    ...createNumericBonusEntry(
      source,
      'severeThreshold',
      bonuses.severeThreshold,
      'defense',
      multiplier
    ),
    ...createNumericBonusEntry(source, 'spellcast', bonuses.spellcast, 'ability', multiplier),
    ...Object.entries(bonuses.attributes ?? {}).flatMap(([trait, amount]) =>
      createNumericBonusEntry(source, `attributes.${trait}`, amount, 'ability', multiplier, trait)
    ),
  ];
}

function buildPassiveDerivedBonusEntries(
  system: DaggerheartDataModel,
  source: PassiveSource
): ContributionLedgerEntry[] {
  return (source.derivedBonuses ?? []).flatMap((bonus) => {
    if (bonus.kind === 'evasion-half-trait') {
      const value = Math.max(
        0,
        Math.floor(getDaggerheartEffectiveAttribute(system, bonus.trait) / 2)
      );

      return [
        createEntry({
          source,
          target: 'evasion',
          label: 'Derived Evasion passive bonus',
          operation: 'add',
          value,
          category: 'defense',
          details: { derivedKind: bonus.kind, trait: bonus.trait },
        }),
      ];
    }

    if (bonus.kind === 'severe-threshold-proficiency') {
      const value = getDaggerheartProficiency(system.level);

      return [
        createEntry({
          source,
          target: 'severeThreshold',
          label: 'Derived Severe threshold passive bonus',
          operation: 'add',
          value,
          category: 'defense',
          details: { derivedKind: bonus.kind },
        }),
      ];
    }

    if (system.armorId) {
      return [];
    }

    const thresholds = bonus.thresholdsByTier[getDaggerheartTier(system.level)];
    if (!thresholds) {
      return [];
    }

    return [
      createEntry({
        source,
        target: 'unarmoredDefense',
        label: 'Derived unarmored defense passive bonus',
        operation: 'set',
        value: {
          armorScore: bonus.armorScoreBase + getDaggerheartEffectiveAttribute(system, bonus.trait),
          majorThreshold: thresholds.major,
          severeThreshold: thresholds.severe,
        },
        category: 'defense',
        details: { derivedKind: bonus.kind, trait: bonus.trait },
      }),
    ];
  });
}

function createNumericBonusEntry(
  source: PassiveSource,
  target: string,
  value: number | undefined,
  category: ContributionCategory,
  multiplier: number,
  trait?: string
): ContributionLedgerEntry[] {
  if (!value) {
    return [];
  }

  return [
    createEntry({
      source,
      target,
      label: 'Passive bonus',
      operation: 'add',
      value: value * multiplier,
      category,
      details: trait ? { trait, multiplier } : { multiplier },
    }),
  ];
}

function createEntry(params: {
  source: PassiveSource;
  target: string;
  label: string;
  operation: ContributionOperation;
  value: ContributionLedgerEntry['value'];
  category: ContributionCategory;
  details?: Record<string, unknown>;
}): ContributionLedgerEntry {
  return {
    id: ledgerId(
      'daggerheart',
      params.category,
      params.target,
      params.source.id,
      params.label,
      String(params.value)
    ),
    systemId: 'daggerheart',
    target: params.target,
    source: {
      kind: params.source.kind,
      id: params.source.id,
      label: params.source.label,
      path: params.source.path,
    },
    label: params.label,
    operation: params.operation,
    value: params.value,
    category: params.category,
    manualBoundary: params.source.note
      ? {
          kind: 'partial',
          note: params.source.note,
        }
      : undefined,
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
