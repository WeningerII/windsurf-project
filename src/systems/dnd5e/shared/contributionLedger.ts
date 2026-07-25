import type {
  ContributionCategory,
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../../types/core/contributionLedger';
import type { ClassLevel } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import type { EffectInstance, EffectOperation, EffectValue } from '../../../rules';
import {
  computeDnd5eBaseArmorClass,
  resolveCharacterEffects,
  resolveEffects,
  toContributionLedger,
  dnd5eArmorDexContribution,
} from '../../../rules';
import { loadClassesForSystem } from '../../../utils/dataLoader';
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

type AddEffectInput = Omit<AddEntryInput, 'operation' | 'value'> & {
  operation: EffectOperation;
  value: EffectValue;
};

/**
 * A single contribution: either a resolver effect or an explicit ledger entry
 * the IR provably cannot carry. The two are stitched back into one ordered
 * ledger, exactly as the Daggerheart builder does.
 */
type LedgerPart =
  | { kind: 'effect'; effect: EffectInstance }
  | { kind: 'entry'; entry: ContributionLedgerEntry };

/**
 * W4 re-backing (RFC 003 Phase 3). Every numeric and string-valued row — armor
 * class, feat ability-score automation, always-prepared spell grants, spell save
 * DC / spell attack bonus — is compiled into the shared `EffectInstance`
 * primitive, folded ONCE through `resolveEffects` alongside the equipment /
 * feat / feature effects, and projected with `toContributionLedger`. Resolution
 * and provenance are one computation.
 *
 * The ONE population that stays hand-built is the LIST-valued proficiency rows
 * (`proficiencies.armor`, `.weapons`, `.tools`, `.languages`, `.savingThrows`),
 * whose value is a `string[]`. The IR's `EffectValue` is
 * `number | string | number[] | null` — it provably cannot carry a string list
 * (RFC 003, "The shared primitive"). Routing them through the resolver would
 * mean either faking the value or widening the RFC's published IR shape, so they
 * stay explicit ledger entries, stitched back in at their original positions.
 */
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
  const parts: LedgerPart[] = [
    ...buildArmorClassParts(systemId, document.system),
    // The resolver speaks the RFC 003 target namespace ('ac'); this ledger
    // speaks the 5e data model's ('armorClass'). Normalize so a viewer
    // grouping by target shows ONE armor-class breakdown.
    ...resolved.result.ledger.map(
      (effect): LedgerPart => ({
        kind: 'effect',
        effect: effect.target === 'ac' ? { ...effect, target: 'armorClass' } : effect,
      })
    ),
    ...buildTemplateProficiencyParts(systemId, document.system.templateState),
    ...buildAlwaysPreparedSpellParts(systemId, document.system.classLevels, classes),
    ...buildSpellcastingParts(systemId, document.system),
  ];

  // ONE fold, ONE projection. None of these effects carries a gating condition
  // (and the equipment/feat effects were already resolved under the same empty
  // context), so `resolveEffects` keeps them all, in input order.
  const projected = toContributionLedger(
    resolveEffects(parts.flatMap((part) => (part.kind === 'effect' ? [part.effect] : []))).ledger
  ).entries;

  let cursor = 0;
  const entries = parts.map((part) => (part.kind === 'effect' ? projected[cursor++] : part.entry));

  return { entries };
}

function buildArmorClassParts(
  systemId: Dnd5eValidationSystemId,
  system: Dnd5eContributionDataModel
): LedgerPart[] {
  const armor = system.equipment.find((item) => item.slot === 'chest' && item.armorClass != null);
  const shield = system.equipment.find(
    (item) => item.slot === 'offHand' && item.shieldBonus != null
  );
  const dexMod = abilityMod(system.baseAttributes.dex ?? 10);
  const parts: LedgerPart[] = [];

  if (armor) {
    parts.push(
      effectPart({
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
    parts.push(
      effectPart({
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
    parts.push(
      effectPart({
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
    parts.push(
      effectPart({
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
  // displayed AC for barbarians/monks. The winner and the plain baseline come
  // from the SAME shared fold the engine resolves AC with
  // (`computeDnd5eBaseArmorClass`), so this row can no longer drift from the
  // number it explains; it used to be an independent second implementation.
  if (!armor) {
    const { plainUnarmored, unarmoredDefense } = computeDnd5eBaseArmorClass(system, dexMod);

    if (unarmoredDefense && unarmoredDefense.total > plainUnarmored) {
      parts.push(
        effectPart({
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
    parts.push(
      effectPart({
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

  return parts;
}

function buildTemplateProficiencyParts(
  systemId: Dnd5eValidationSystemId,
  templateState: Dnd5eTemplateState | undefined
): LedgerPart[] {
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
    ...buildFeatAutomationParts(systemId, templateState),
  ];
}

function buildFeatAutomationParts(
  systemId: Dnd5eValidationSystemId,
  templateState: Dnd5eTemplateState
): LedgerPart[] {
  const abilityScoreParts = Object.entries(templateState.featDerivedAutomation.abilityScores).map(
    ([abilityId, bonus]) =>
      effectPart({
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
    ...abilityScoreParts,
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

function buildAlwaysPreparedSpellParts(
  systemId: Dnd5eValidationSystemId,
  classLevels: ClassLevel[],
  classes: Awaited<ReturnType<typeof loadClassesForSystem>>
): LedgerPart[] {
  return getDnd5eAlwaysPreparedSpellSources(classLevels, classes).map((source) =>
    effectPart({
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
 * bonus, compiled into the shared IR and folded with everything else. They
 * re-derive with the SAME cited helpers the engine uses in `prepareData`
 * (`dnd5eSpellSaveDC` / `dnd5eSpellAttackBonus` over `profBonus(totalLevel)` and
 * the spellcasting ability modifier), so the emitted rows sum to the engine's
 * `data.spellcasting.classes[].spellSaveDc` / `spellAttackBonus` exactly.
 */
function buildSpellcastingParts(
  systemId: Dnd5eValidationSystemId,
  system: Dnd5eContributionDataModel
): LedgerPart[] {
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
      effectPart({
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
      effectPart({
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
      effectPart({
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
      effectPart({
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
      effectPart({
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
}): LedgerPart[] {
  if (params.values.length === 0) {
    return [];
  }

  return [
    {
      kind: 'entry',
      entry: createEntry({
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
    },
  ];
}

/**
 * One contribution as the shared IR primitive, wrapped as an ordered ledger
 * part. Projected through `toContributionLedger` it yields exactly the entry
 * this builder used to hand-assemble — same id, target, source, operation,
 * value, category. Stacking is `'sum'`: 5e has no named-bonus stacking system,
 * so every term here accumulates (SRD).
 */
function effectPart(params: AddEffectInput): LedgerPart {
  return {
    kind: 'effect',
    effect: {
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
      operation: params.operation,
      value: params.value,
      stackPolicy: 'sum',
      source: {
        kind: params.sourceKind,
        label: params.sourceLabel,
        id: params.sourceId,
        path: params.sourcePath,
      },
      label: params.label,
      category: params.category,
      details: params.details,
    },
  };
}

/**
 * A LIST-valued contribution, kept as an explicit ledger entry: the IR's
 * `EffectValue` (`number | string | number[] | null`) provably cannot carry a
 * `string[]`, so routing these through the resolver would mean faking the value.
 */
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
