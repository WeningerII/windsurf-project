import { systemRegistry } from '../../../registry';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { GameSystemId } from '../../../types/game-systems';
import { Dnd5e2024DataModel } from '../../dnd5e-2024/data-model';
import { applyDnd5eLongRest, applyDnd5eShortRest } from '../../../utils/dnd5eRest';
import { getEligibleDnd5eFeatureOptions } from '../../../utils/dnd5eFeatureOptions';
import {
  getDnd5eAlwaysPreparedSpellIds,
  getDnd5ePreparedCasterSummaries,
} from './spellPreparation';
import { Dnd5eLikeDataModel, featureOptionSelectionKey } from './dnd5eSheetShared';
import { getDnd5eTemplateChoiceState } from './getDnd5eTemplateChoiceState';
import { useDnd5eDocumentMutators } from './useDnd5eDocumentMutators';
import { useDnd5eSheetResources } from './useDnd5eSheetResources';
import { useDnd5eSheetActionHandlers } from './useDnd5eSheetActionHandlers';
import { useDnd5eTemplateHandlers } from './useDnd5eTemplateHandlers';

const EMPTY_WEAPON_MASTERIES: string[] = [];

interface UseDnd5eSheetControllerProps<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  enableWeaponMasteries?: boolean;
}

export function useDnd5eSheetController<T extends Dnd5eLikeDataModel>({
  document,
  onUpdate,
  enableWeaponMasteries = false,
}: UseDnd5eSheetControllerProps<T>) {
  const d = document.system;
  const systemId = document.systemId as GameSystemId;
  const profBonus = Math.ceil(d.level / 4) + 1;
  const canUpdate = Boolean(onUpdate);
  const showFeatBrowser = true;
  const showFeatureOptionBrowser = systemId === 'dnd-5e-2014';

  const {
    backgrounds,
    classes,
    equipmentItems,
    equipmentLoaded,
    featDefs,
    featsLoaded,
    featureOptions,
    featureOptionsLoaded,
    monsters,
    monstersLoaded,
    species,
    spells,
    spellsLoaded,
    warmEquipmentTab,
    warmFeatBrowser,
    warmFeaturesTab,
    warmMonsterBrowser,
    warmSpellsTab,
  } = useDnd5eSheetResources({
    systemId,
    featCount: d.feats.length,
    showFeatBrowser,
    showFeatureOptionBrowser,
  });

  const selectedSpecies = species.find((entry) => entry.id === d.speciesId);
  const selectedBackground = backgrounds.find((entry) => entry.id === d.backgroundId);
  const {
    speciesAbilitySlots,
    speciesLanguageSlots,
    speciesSkillSlots,
    speciesToolSlots,
    backgroundFixedTools,
    backgroundToolSlots,
    backgroundLanguageSlots,
  } = getDnd5eTemplateChoiceState({
    system: d,
    selectedSpecies,
    selectedBackground,
  });

  const equippedNames = new Map(equipmentItems.map((item) => [item.id, item.name]));
  const spellNames = new Map(spells.map((spell) => [spell.id, spell.name]));
  const derivedAlwaysPreparedSpellIds = getDnd5eAlwaysPreparedSpellIds(d.classLevels, classes);
  const alwaysPreparedSpellIds = new Set([
    ...(d.spellcasting?.alwaysPreparedSpellIds ?? []),
    ...derivedAlwaysPreparedSpellIds,
  ]);
  const preparedSpellIds = new Set(
    (d.spellcasting?.spellsPrepared || []).filter((spellId) => !alwaysPreparedSpellIds.has(spellId))
  );
  const preparedCasterSummaries = getDnd5ePreparedCasterSummaries(
    d.classLevels,
    classes,
    d.baseAttributes
  );
  const singlePreparedCaster =
    preparedCasterSummaries.length === 1 ? preparedCasterSummaries[0] : undefined;
  const singlePreparedCasterLimit = singlePreparedCaster?.preparedLimit;
  const featDefinitionsById = new Map(featDefs.map((feat) => [feat.id, feat]));
  const featureOptionSelections = d.featureOptionSelections || [];
  const featureOptionsBySelectionKey = new Map(
    featureOptions.map((option) => [featureOptionSelectionKey(option), option])
  );
  const selectedFeatureOptions = featureOptionSelections.flatMap((selection) => {
    const option = featureOptionsBySelectionKey.get(featureOptionSelectionKey(selection));
    return option ? [option] : [];
  });
  const eligibleFeatureOptions = getEligibleDnd5eFeatureOptions(featureOptions, d.classLevels);
  const systemDef = systemRegistry.get(document.systemId);
  const weaponMasteries = (d as Dnd5e2024DataModel).weaponMasteries ?? EMPTY_WEAPON_MASTERIES;
  const { replaceDocument, replaceSystem, update, onNameChange } = useDnd5eDocumentMutators({
    document,
    onUpdate,
  });
  const templateHandlers = useDnd5eTemplateHandlers({
    document,
    system: d,
    classes,
    species,
    backgrounds,
    selectedSpecies,
    selectedBackground,
    replaceDocument,
    update,
  });
  const actionHandlers = useDnd5eSheetActionHandlers({
    document,
    system: d,
    onUpdate,
    enableWeaponMasteries,
    weaponMasteries,
    alwaysPreparedSpellIds,
    preparedCasterCount: preparedCasterSummaries.length,
    singlePreparedCasterLimit,
    systemDef,
    replaceDocument,
    replaceSystem,
    update,
  });

  return {
    d,
    canUpdate,
    profBonus,
    showFeatBrowser,
    showFeatureOptionBrowser,
    pendingClassId: templateHandlers.pendingClassId,
    setPendingClassId: templateHandlers.setPendingClassId,
    pendingClassLevel: templateHandlers.pendingClassLevel,
    setPendingClassLevel: templateHandlers.setPendingClassLevel,
    classTemplateError: templateHandlers.classTemplateError,
    featTemplateError: actionHandlers.featTemplateError,
    featureOptionError: actionHandlers.featureOptionError,
    classes,
    species,
    backgrounds,
    selectedSpecies,
    selectedBackground,
    speciesAbilitySlots,
    speciesLanguageSlots,
    speciesSkillSlots,
    speciesToolSlots,
    backgroundFixedTools,
    backgroundToolSlots,
    backgroundLanguageSlots,
    equipmentItems,
    equipmentLoaded,
    equippedNames,
    featDefs,
    featsLoaded,
    featureOptionsLoaded,
    monsters,
    monstersLoaded,
    spells,
    spellsLoaded,
    spellNames,
    alwaysPreparedSpellIds,
    preparedSpellIds,
    preparedCasterSummaries,
    featDefinitionsById,
    featureOptionSelections,
    selectedFeatureOptions,
    eligibleFeatureOptions,
    systemDef,
    weaponMasteries,
    update,
    replaceSystem,
    onNameChange,
    warmEquipmentTab,
    warmFeatBrowser,
    warmFeaturesTab,
    warmMonsterBrowser,
    warmSpellsTab,
    handleClassRowChange: templateHandlers.handleClassRowChange,
    handleClassLevelChange: templateHandlers.handleClassLevelChange,
    handleSubclassChange: templateHandlers.handleSubclassChange,
    handleClassSkillSelectionChange: templateHandlers.handleClassSkillSelectionChange,
    handleClassToolSelectionChange: templateHandlers.handleClassToolSelectionChange,
    handleAddClass: templateHandlers.handleAddClass,
    handleRemoveClass: templateHandlers.handleRemoveClass,
    handleSpeciesChange: templateHandlers.handleSpeciesChange,
    handleSpeciesAbilityChange: templateHandlers.handleSpeciesAbilityChange,
    handleSpeciesLanguageChange: templateHandlers.handleSpeciesLanguageChange,
    handleSpeciesSkillChange: templateHandlers.handleSpeciesSkillChange,
    handleSpeciesToolChange: templateHandlers.handleSpeciesToolChange,
    handleBackgroundChange: templateHandlers.handleBackgroundChange,
    handleBackgroundLanguageChange: templateHandlers.handleBackgroundLanguageChange,
    handleBackgroundToolChange: templateHandlers.handleBackgroundToolChange,
    toggleSkillProficiency: actionHandlers.toggleSkillProficiency,
    toggleSaveProficiency: actionHandlers.toggleSaveProficiency,
    handleFeatureUse: actionHandlers.handleFeatureUse,
    handleHitDiceChange: actionHandlers.handleHitDiceChange,
    handleSpellSlotChange: actionHandlers.handleSpellSlotChange,
    handleDamageHeal: actionHandlers.handleDamageHeal,
    handleEquipmentSelect: actionHandlers.handleEquipmentSelect,
    handleSpellSelect: actionHandlers.handleSpellSelect,
    handleTogglePreparedSpell: actionHandlers.handleTogglePreparedSpell,
    handleFeatSelect: actionHandlers.handleFeatSelect,
    handleFeatRemove: actionHandlers.handleFeatRemove,
    handleFeatSelectionChange: actionHandlers.handleFeatSelectionChange,
    handleFeatureOptionSelect: actionHandlers.handleFeatureOptionSelect,
    handleFeatureOptionRemove: actionHandlers.handleFeatureOptionRemove,
    toggleWeaponMastery: actionHandlers.toggleWeaponMastery,
    recoverAllSpellSlots: actionHandlers.recoverAllSpellSlots,
    applyDnd5eLongRest,
    applyDnd5eShortRest,
    resolveFeatSelections: actionHandlers.resolveFeatSelections,
    optionDisabledForRequirement: actionHandlers.optionDisabledForRequirement,
  };
}
