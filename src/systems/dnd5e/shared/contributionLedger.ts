import type {
  ContributionCategory,
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../../types/core/contributionLedger';
import type { ClassLevel, EquippedItem } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import { loadClassesForSystem } from '../../../utils/dataLoader';
import { abilityMod } from '../../../utils/math';
import type { Dnd5e2024DataModel } from '../../dnd5e-2024/data-model';
import type { Dnd5eDataModel, Dnd5eTemplateState } from '../data-model';
import { getDnd5eDefenseStyleArmorClassBonus } from './activityState';
import { getDnd5eAlwaysPreparedSpellSources } from './spellPreparation';
import type { Dnd5eValidationSystemId } from './validation';

type Dnd5eContributionDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

type AddEntryInput = {
  systemId: Dnd5eValidationSystemId;
  target: string;
  sourceKind: ContributionSourceKind;
  sourceLabel: string;
  label: string;
  operation: ContributionOperation;
  value: ContributionLedgerEntry['value'];
  category: ContributionCategory;
  sourceId?: string;
  sourcePath?: string;
  details?: Record<string, unknown>;
};

export async function buildDnd5eContributionLedger<T extends Dnd5eContributionDataModel>(
  document: CharacterDocument<T>,
  systemId: Dnd5eValidationSystemId
): Promise<ContributionLedgerResult> {
  const classes = await loadClassesForSystem(systemId);
  const entries = [
    ...buildArmorClassEntries(systemId, document.system),
    ...buildTemplateProficiencyEntries(systemId, document.system.templateState),
    ...buildAlwaysPreparedSpellEntries(systemId, document.system.classLevels, classes),
  ];

  return { entries };
}

function buildArmorClassEntries(
  systemId: Dnd5eValidationSystemId,
  system: Dnd5eContributionDataModel
): ContributionLedgerEntry[] {
  const armor = system.equipment.find((item) => item.slot === 'chest' && item.armorClass != null);
  const shield = system.equipment.find(
    (item) => item.slot === 'offHand' && item.shieldBonus != null
  );
  const dexMod = abilityMod(system.baseAttributes.dex ?? 10);
  const entries: ContributionLedgerEntry[] = [];

  if (armor) {
    entries.push(
      createEntry({
        systemId,
        target: 'armorClass',
        sourceKind: 'item',
        sourceId: armor.itemId,
        sourceLabel: armor.customName ?? armor.itemId,
        label: 'Equipped armor base AC',
        operation: 'set',
        value: armor.armorClass ?? 10,
        category: 'defense',
        sourcePath: 'system.equipment',
        details: { armorType: armor.armorType },
      })
    );
  } else {
    entries.push(
      createEntry({
        systemId,
        target: 'armorClass',
        sourceKind: 'system',
        sourceId: 'unarmored-base-ac',
        sourceLabel: 'Unarmored defense',
        label: 'Unarmored base AC',
        operation: 'set',
        value: 10,
        category: 'defense',
      })
    );
  }

  const dexContribution = getArmorClassDexContribution(armor, dexMod);
  if (dexContribution !== 0) {
    entries.push(
      createEntry({
        systemId,
        target: 'armorClass',
        sourceKind: 'system',
        sourceId: 'dexterity-modifier',
        sourceLabel: 'Dexterity modifier',
        label: 'Dexterity AC contribution',
        operation: 'add',
        value: dexContribution,
        category: 'defense',
        details: {
          dexterityScore: system.baseAttributes.dex ?? 10,
          rawDexterityModifier: dexMod,
          armorType: armor?.armorType ?? 'unarmored',
        },
      })
    );
  }

  if (shield?.shieldBonus) {
    entries.push(
      createEntry({
        systemId,
        target: 'armorClass',
        sourceKind: 'item',
        sourceId: shield.itemId,
        sourceLabel: shield.customName ?? shield.itemId,
        label: 'Shield AC bonus',
        operation: 'add',
        value: shield.shieldBonus,
        category: 'defense',
        sourcePath: 'system.equipment',
      })
    );
  }

  const defenseStyleBonus = getDnd5eDefenseStyleArmorClassBonus(system);
  if (defenseStyleBonus !== 0) {
    entries.push(
      createEntry({
        systemId,
        target: 'armorClass',
        sourceKind: 'feature-option',
        sourceId: 'fighting-styles:defense',
        sourceLabel: 'Defense Fighting Style',
        label: 'Defense Fighting Style AC bonus',
        operation: 'add',
        value: defenseStyleBonus,
        category: 'defense',
        sourcePath: 'system.featureOptionSelections',
      })
    );
  }

  return entries;
}

function getArmorClassDexContribution(armor: EquippedItem | undefined, dexMod: number): number {
  if (!armor) {
    return dexMod;
  }

  if (armor.armorType === 'light') {
    return dexMod;
  }

  if (armor.armorType === 'medium') {
    return Math.min(dexMod, armor.dexBonusMax ?? 2);
  }

  return 0;
}

function buildTemplateProficiencyEntries(
  systemId: Dnd5eValidationSystemId,
  templateState: Dnd5eTemplateState | undefined
): ContributionLedgerEntry[] {
  if (!templateState) {
    return [];
  }

  return [
    ...buildListEntry({
      systemId,
      target: 'proficiencies.armor',
      sourceKind: 'class',
      sourceLabel: 'Class template proficiencies',
      label: 'Class armor proficiencies',
      values: templateState.classDerivedProficiencies.armor,
      sourcePath: 'system.templateState.classDerivedProficiencies.armor',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.weapons',
      sourceKind: 'class',
      sourceLabel: 'Class template proficiencies',
      label: 'Class weapon proficiencies',
      values: templateState.classDerivedProficiencies.weapons,
      sourcePath: 'system.templateState.classDerivedProficiencies.weapons',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.tools',
      sourceKind: 'class',
      sourceLabel: 'Class template proficiencies',
      label: 'Class tool proficiencies',
      values: templateState.classDerivedProficiencies.tools,
      sourcePath: 'system.templateState.classDerivedProficiencies.tools',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.savingThrows',
      sourceKind: 'class',
      sourceLabel: 'Class template proficiencies',
      label: 'Class saving throw proficiencies',
      values: templateState.classDerivedProficiencies.savingThrows,
      sourcePath: 'system.templateState.classDerivedProficiencies.savingThrows',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.tools',
      sourceKind: 'background',
      sourceLabel: 'Background template proficiencies',
      label: 'Background tool proficiencies',
      values: templateState.backgroundDerived.tools,
      sourcePath: 'system.templateState.backgroundDerived.tools',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.languages',
      sourceKind: 'background',
      sourceLabel: 'Background template proficiencies',
      label: 'Background language proficiencies',
      values: templateState.backgroundDerived.languages,
      sourcePath: 'system.templateState.backgroundDerived.languages',
    }),
    ...buildFeatAutomationEntries(systemId, templateState),
  ];
}

function buildFeatAutomationEntries(
  systemId: Dnd5eValidationSystemId,
  templateState: Dnd5eTemplateState
): ContributionLedgerEntry[] {
  const entries = Object.entries(templateState.featDerivedAutomation.abilityScores).map(
    ([abilityId, bonus]) =>
      createEntry({
        systemId,
        target: `baseAttributes.${abilityId}`,
        sourceKind: 'feat',
        sourceLabel: 'Feat automation',
        label: 'Feat ability score automation',
        operation: 'add',
        value: bonus,
        category: 'ability',
        sourcePath: `system.templateState.featDerivedAutomation.abilityScores.${abilityId}`,
      })
  );

  return [
    ...entries,
    ...buildListEntry({
      systemId,
      target: 'proficiencies.armor',
      sourceKind: 'feat',
      sourceLabel: 'Feat automation',
      label: 'Feat armor proficiencies',
      values: templateState.featDerivedAutomation.armor,
      sourcePath: 'system.templateState.featDerivedAutomation.armor',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.weapons',
      sourceKind: 'feat',
      sourceLabel: 'Feat automation',
      label: 'Feat weapon proficiencies',
      values: templateState.featDerivedAutomation.weapons,
      sourcePath: 'system.templateState.featDerivedAutomation.weapons',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.tools',
      sourceKind: 'feat',
      sourceLabel: 'Feat automation',
      label: 'Feat tool proficiencies',
      values: templateState.featDerivedAutomation.tools,
      sourcePath: 'system.templateState.featDerivedAutomation.tools',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.languages',
      sourceKind: 'feat',
      sourceLabel: 'Feat automation',
      label: 'Feat language proficiencies',
      values: templateState.featDerivedAutomation.languages,
      sourcePath: 'system.templateState.featDerivedAutomation.languages',
    }),
    ...buildListEntry({
      systemId,
      target: 'proficiencies.savingThrows',
      sourceKind: 'feat',
      sourceLabel: 'Feat automation',
      label: 'Feat saving throw proficiencies',
      values: templateState.featDerivedAutomation.savingThrows,
      sourcePath: 'system.templateState.featDerivedAutomation.savingThrows',
    }),
  ];
}

function buildAlwaysPreparedSpellEntries(
  systemId: Dnd5eValidationSystemId,
  classLevels: ClassLevel[],
  classes: Awaited<ReturnType<typeof loadClassesForSystem>>
): ContributionLedgerEntry[] {
  return getDnd5eAlwaysPreparedSpellSources(classLevels, classes).map((source) =>
    createEntry({
      systemId,
      target: 'spellcasting.alwaysPreparedSpellIds',
      sourceKind: 'class',
      sourceId: source.source,
      sourceLabel: source.source,
      label: 'Always-prepared spell grant',
      operation: 'add',
      value: source.spellId,
      category: 'spell',
      details: {
        spellId: source.spellId,
        minLevel: source.minLevel,
        countsAgainstPreparedLimit: source.countsAgainstPreparedLimit,
      },
    })
  );
}

function buildListEntry(params: {
  systemId: Dnd5eValidationSystemId;
  target: string;
  sourceKind: ContributionSourceKind;
  sourceLabel: string;
  label: string;
  values: string[];
  sourcePath: string;
}): ContributionLedgerEntry[] {
  if (params.values.length === 0) {
    return [];
  }

  return [
    createEntry({
      systemId: params.systemId,
      target: params.target,
      sourceKind: params.sourceKind,
      sourceLabel: params.sourceLabel,
      label: params.label,
      operation: 'add',
      value: [...params.values],
      category: 'proficiency',
      sourcePath: params.sourcePath,
    }),
  ];
}

function createEntry(params: AddEntryInput): ContributionLedgerEntry {
  return {
    id: ledgerId(
      params.systemId,
      params.category,
      params.target,
      params.sourceLabel,
      params.label,
      String(params.value)
    ),
    systemId: params.systemId,
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
    category: params.category,
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
