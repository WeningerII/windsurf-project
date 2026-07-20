import type {
  ContributionCategory,
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../../types/core/contributionLedger';
import type { ClassLevel } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import {
  resolveCharacterEffects,
  toContributionLedger,
  dnd5eArmorDexContribution,
} from '../../../rules';
import { loadClassesForSystem } from '../../../utils/dataLoader';
import {
  dnd5eUnarmoredDefenseBarbarian,
  dnd5eUnarmoredDefenseMonk,
} from '../../../utils/derivedCombatMath';
import { dnd5eSpellAttackBonus, dnd5eSpellSaveDC } from '../../../utils/derivedCasterMath';
import { abilityMod, profBonus } from '../../../utils/math';
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
  // The resolver is fed the SAME inputs the engine uses for derived values
  // (RFC 003), and its applied-effect ledger is projected straight into
  // contribution entries — magic-item AC, attack, and damage terms get
  // first-class provenance instead of being re-derived (and drifting) here.
  const resolved = resolveCharacterEffects(systemId, {
    equipment: document.system.equipment,
    feats: document.system.feats,
    features: document.system.features,
  });
  const entries = [
    ...buildArmorClassEntries(systemId, document.system),
    // The resolver speaks the RFC 003 target namespace ('ac'); this ledger
    // speaks the 5e data model's ('armorClass'). Normalize so a viewer
    // grouping by target shows ONE armor-class breakdown.
    ...toContributionLedger(resolved.result.ledger).entries.map((entry) =>
      entry.target === 'ac' ? { ...entry, target: 'armorClass' } : entry
    ),
    ...buildTemplateProficiencyEntries(systemId, document.system.templateState),
    ...buildAlwaysPreparedSpellEntries(systemId, document.system.classLevels, classes),
    ...buildSpellcastingEntries(systemId, document.system),
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

  const dexContribution = dnd5eArmorDexContribution(armor, dexMod);
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

  // Unarmored Defense (SRD): the engine takes the BEST of plain 10 + Dex and
  // the feature formula. When the feature formula wins, the delta is the
  // feature's contribution — emitted here so the entries still sum to the
  // displayed AC for barbarians/monks.
  if (!armor) {
    const plainUnarmored = 10 + dexMod + (shield?.shieldBonus ?? 0);
    const hasFeature = (featureId: string) =>
      system.features.some((feature) => feature.id === featureId);
    let unarmoredDefense: { featureId: string; label: string; total: number } | null = null;

    if (hasFeature('unarmored-defense-barbarian')) {
      const conMod = abilityMod(system.baseAttributes.con ?? 10);
      unarmoredDefense = {
        featureId: 'unarmored-defense-barbarian',
        label: 'Unarmored Defense (Barbarian)',
        total: dnd5eUnarmoredDefenseBarbarian(dexMod, conMod) + (shield?.shieldBonus ?? 0),
      };
    }
    if (!shield && hasFeature('unarmored-defense-monk')) {
      const wisMod = abilityMod(system.baseAttributes.wis ?? 10);
      const monkTotal = dnd5eUnarmoredDefenseMonk(dexMod, wisMod);
      if (monkTotal > (unarmoredDefense?.total ?? 0)) {
        unarmoredDefense = {
          featureId: 'unarmored-defense-monk',
          label: 'Unarmored Defense (Monk)',
          total: monkTotal,
        };
      }
    }

    if (unarmoredDefense && unarmoredDefense.total > plainUnarmored) {
      entries.push(
        createEntry({
          systemId,
          target: 'armorClass',
          sourceKind: 'feature',
          sourceId: unarmoredDefense.featureId,
          sourceLabel: unarmoredDefense.label,
          label: 'Unarmored Defense AC contribution',
          operation: 'add',
          value: unarmoredDefense.total - plainUnarmored,
          category: 'defense',
          sourcePath: 'system.features',
        })
      );
    }
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

/**
 * Provenance rows for each spellcasting class's spell save DC and spell attack
 * bonus. RFC 003 defers re-backing these through the resolver, so — like
 * `buildArmorClassEntries` — the terms are hand-built here. They re-derive with
 * the SAME cited helpers the engine uses in `prepareData` (`dnd5eSpellSaveDC` /
 * `dnd5eSpellAttackBonus` over `profBonus(totalLevel)` and the spellcasting
 * ability modifier), so the emitted rows sum to the engine's
 * `data.spellcasting.classes[].spellSaveDc` / `spellAttackBonus` exactly.
 */
function buildSpellcastingEntries(
  systemId: Dnd5eValidationSystemId,
  system: Dnd5eContributionDataModel
): ContributionLedgerEntry[] {
  const spellcasting = system.spellcasting;
  if (!spellcasting || spellcasting.classes.length === 0) {
    return [];
  }

  // Mirror the engine's total-level derivation so the proficiency bonus term
  // matches `profBonus(totalLevel)` used by prepareData.
  const totalLevel =
    system.classLevels.length > 0
      ? system.classLevels.reduce((sum, cl) => sum + cl.level, 0)
      : system.level;
  const proficiencyBonus = profBonus(totalLevel);

  return spellcasting.classes.flatMap((casterClass) => {
    // Index baseAttributes with `casterClass.ability` exactly as the engine
    // does, so the ability modifier term is identical regardless of key casing.
    const abilityScore = system.baseAttributes[casterClass.ability] ?? 10;
    const spellMod = abilityMod(abilityScore);
    const saveDcTarget = `spellcasting.classes.${casterClass.classId}.spellSaveDc`;
    const attackTarget = `spellcasting.classes.${casterClass.classId}.spellAttackBonus`;
    const details = {
      classId: casterClass.classId,
      ability: casterClass.ability,
      abilityScore,
      proficiencyBonus,
      spellcastingAbilityModifier: spellMod,
      // The composed totals these rows explain (and must sum to).
      spellSaveDc: dnd5eSpellSaveDC(proficiencyBonus, spellMod),
      spellAttackBonus: dnd5eSpellAttackBonus(proficiencyBonus, spellMod),
    };

    return [
      // Spell save DC = 8 + proficiency bonus + spellcasting ability modifier.
      createEntry({
        systemId,
        target: saveDcTarget,
        sourceKind: 'system',
        sourceId: 'spell-save-dc-base',
        sourceLabel: 'Spell save DC base',
        label: 'Spell save DC base',
        operation: 'set',
        value: 8,
        category: 'spell',
        sourcePath: 'system.spellcasting.classes',
        details,
      }),
      createEntry({
        systemId,
        target: saveDcTarget,
        sourceKind: 'class',
        sourceId: casterClass.classId,
        sourceLabel: casterClass.classId,
        label: 'Spell save DC proficiency bonus',
        operation: 'add',
        value: proficiencyBonus,
        category: 'spell',
        sourcePath: 'system.spellcasting.classes',
        details,
      }),
      createEntry({
        systemId,
        target: saveDcTarget,
        sourceKind: 'system',
        sourceId: `${casterClass.ability}-modifier`,
        sourceLabel: `${casterClass.ability} modifier`,
        label: 'Spell save DC ability modifier',
        operation: 'add',
        value: spellMod,
        category: 'spell',
        sourcePath: 'system.spellcasting.classes',
        details,
      }),
      // Spell attack bonus = proficiency bonus + spellcasting ability modifier.
      createEntry({
        systemId,
        target: attackTarget,
        sourceKind: 'class',
        sourceId: casterClass.classId,
        sourceLabel: casterClass.classId,
        label: 'Spell attack proficiency bonus',
        operation: 'add',
        value: proficiencyBonus,
        category: 'spell',
        sourcePath: 'system.spellcasting.classes',
        details,
      }),
      createEntry({
        systemId,
        target: attackTarget,
        sourceKind: 'system',
        sourceId: `${casterClass.ability}-modifier`,
        sourceLabel: `${casterClass.ability} modifier`,
        label: 'Spell attack ability modifier',
        operation: 'add',
        value: spellMod,
        category: 'spell',
        sourcePath: 'system.spellcasting.classes',
        details,
      }),
    ];
  });
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
