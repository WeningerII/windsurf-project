import { useMemo } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { parseNum } from '../../utils/math';
import type { Pf2eDataModel } from './data-model';
import { getPf2eSheetChoiceState } from './getPf2eSheetChoiceState';
import { countTrainedPf2eSkills } from './pf2eSheetShared';
import { usePf2eMutationHandlers, type Pf2eInventoryBrowserItem } from './usePf2eMutationHandlers';
import { usePf2eSheetResources } from './usePf2eSheetResources';
import { usePf2eTemplateHandlers } from './usePf2eTemplateHandlers';

interface UsePf2eSheetControllerProps {
  document: CharacterDocument<Pf2eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export function usePf2eSheetController({ document, onUpdate }: UsePf2eSheetControllerProps) {
  const data = document.system;
  const mutationHandlers = usePf2eMutationHandlers({
    document,
    onUpdate,
  });

  const trainedSkillCount = countTrainedPf2eSkills(data.skillProficiencies);

  const {
    featDefs,
    featsLoaded,
    spells,
    spellsLoaded,
    equipmentItems,
    equipmentLoaded,
    classes,
    ancestries,
    loadOptions,
    backgrounds,
    backgroundsLoaded,
    loadBackgrounds,
    archetypes,
    archetypesLoaded,
    monsters,
    monstersLoaded,
    warmFeatBrowser,
    warmArchetypes,
    warmSpellsTab,
    warmEquipmentBrowser,
    warmMonsterBrowser,
  } = usePf2eSheetResources({
    systemId: document.systemId as GameSystemId,
  });

  const selectedArchetypeIds = useMemo(
    () => data.selectedArchetypeIds ?? [],
    [data.selectedArchetypeIds]
  );
  const selectedClass = classes.find((entry) => entry.id === data.classId);
  const selectedAncestry = ancestries.find((entry) => entry.id === data.ancestryId);
  const selectedHeritage = selectedAncestry?.subraces?.find(
    (heritage) => heritage.id === data.heritageId
  );
  const selectedBackground = backgrounds.find((entry) => entry.id === data.backgroundId);

  const {
    ancestryChoiceSlots,
    backgroundFreeBoost,
    backgroundFreeBoostOptions,
    backgroundLoreChoice,
    backgroundRestrictedBoost,
    backgroundSkillChoice,
    classDcScore,
    heritageOptions,
    loreIds,
    orderedArchetypes,
    selectedArchetypes,
  } = useMemo(
    () =>
      getPf2eSheetChoiceState({
        data,
        archetypes,
        selectedArchetypeIds,
        selectedAncestry,
        selectedBackground,
      }),
    [archetypes, data, selectedAncestry, selectedArchetypeIds, selectedBackground]
  );

  const {
    applySelectedBackgroundTemplate,
    handleAncestryBoostChange,
    handleAncestryChange,
    handleArchetypeToggle,
    handleBackgroundAbilityBoostChange,
    handleBackgroundChange,
    handleClassChange,
    handleHeritageChange,
    handleLevelChange,
  } = usePf2eTemplateHandlers({
    document,
    data,
    classes,
    ancestries,
    backgrounds,
    selectedClass,
    selectedAncestry,
    selectedHeritage,
    selectedBackground,
    selectedArchetypeIds,
    replaceDocument: mutationHandlers.replaceDocument,
    update: mutationHandlers.update,
  });

  return {
    data,
    trainedSkillCount,
    warmFeatBrowser,
    warmArchetypes,
    warmSpellsTab,
    warmEquipmentBrowser,
    warmMonsterBrowser,
    headerProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      classes,
      ancestries,
      heritages: heritageOptions,
      backgrounds,
      backgroundsLoaded,
      onNameChange: mutationHandlers.onNameChange,
      onLevelChange: handleLevelChange,
      onClassChange: handleClassChange,
      onAncestryChange: handleAncestryChange,
      onHeritageChange: handleHeritageChange,
      onBackgroundChange: handleBackgroundChange,
      onExperiencePointsChange: (value: string) =>
        mutationHandlers.update({ experiencePoints: parseNum(value, 0) }),
      onHeroPointsChange: (heroPoints: number) => mutationHandlers.update({ heroPoints }),
      onLoadOptions: loadOptions,
      onLoadBackgrounds: loadBackgrounds,
    },
    overviewProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      classDcScore,
      onHitPointsChange: (current: number, max: number) =>
        mutationHandlers.updateHitPoints(parseNum(String(current), 0), parseNum(String(max), 1)),
      onPerceptionTierCycle: mutationHandlers.cyclePerceptionTier,
      onPerceptionRoll: () => mutationHandlers.rollCheck('perception'),
      onShortRest: mutationHandlers.onShortRest,
      onLongRest: mutationHandlers.onLongRest,
    },
    abilitiesTabProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      selectedAncestryName: selectedAncestry?.name,
      selectedBackground,
      ancestryChoiceSlots,
      backgroundRestrictedBoost,
      backgroundFreeBoost,
      backgroundFreeBoostOptions,
      onBaseAttributeChange: (ability: string, value: number) =>
        mutationHandlers.update({
          baseAttributes: {
            ...data.baseAttributes,
            [ability]: parseNum(String(value), 10),
          },
        }),
      onAncestryBoostChange: handleAncestryBoostChange,
      onBackgroundAbilityBoostChange: handleBackgroundAbilityBoostChange,
    },
    savesTabProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      onCycleSaveTier: mutationHandlers.cycleSaveTier,
      onRollCheck: mutationHandlers.rollCheck,
    },
    skillsTabProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      loreIds,
      backgroundSkillChoice,
      backgroundLoreChoice,
      onCycleSkillTier: mutationHandlers.cycleSkillTier,
      onCycleLoreTier: mutationHandlers.cycleLoreTier,
      onBackgroundSkillTrainingChange: (value: string) =>
        applySelectedBackgroundTemplate({ skillTrainingSelection: value }),
      onBackgroundLoreTrainingChange: (value: string) =>
        applySelectedBackgroundTemplate({ loreTrainingSelection: value }),
      onRollCheck: mutationHandlers.rollCheck,
    },
    featsConditionsTabProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      onConditionsChange: mutationHandlers.canUpdate
        ? (conditions: Pf2eDataModel['conditions']) => mutationHandlers.update({ conditions })
        : undefined,
      onRemoveFeat: mutationHandlers.canUpdate ? mutationHandlers.removeFeat : undefined,
    },
    featBrowserProps: {
      systemId: document.systemId as GameSystemId,
      featsLoaded,
      featDefs,
    },
    archetypesTabProps: {
      archetypesLoaded,
      classId: data.classId,
      selectedArchetypeIds,
      selectedArchetypes,
      orderedArchetypes,
      onToggleArchetype: onUpdate ? handleArchetypeToggle : undefined,
    },
    spellsTabProps: {
      classId: data.classId,
      spellcasting: data.spellcasting,
      spellsLoaded,
      spells,
      onSpellcastingChange: onUpdate
        ? (spellcasting: Pf2eDataModel['spellcasting']) => mutationHandlers.update({ spellcasting })
        : undefined,
    },
    equipmentBrowserTabProps: {
      equipmentLoaded,
      equipmentItems,
    },
    monsterBrowserTabProps: {
      monstersLoaded,
      monsters,
    },
    inventoryTabProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      onCurrencyChange: mutationHandlers.canUpdate
        ? (currency: Pf2eDataModel['currency']) => mutationHandlers.update({ currency })
        : undefined,
      onAddItem: mutationHandlers.canUpdate
        ? (item: Pf2eInventoryBrowserItem) => mutationHandlers.addInventoryItem(item)
        : undefined,
      onRemoveItem: mutationHandlers.canUpdate ? mutationHandlers.removeInventoryItem : undefined,
    },
    notesTabProps: {
      document,
      canUpdate: mutationHandlers.canUpdate,
      onDescriptionChange: (value: string) =>
        mutationHandlers.update({ personality: { ...data.personality, description: value } }),
      onBackstoryChange: (value: string) =>
        mutationHandlers.update({ personality: { ...data.personality, backstory: value } }),
      onNotesChange: (value: string) => mutationHandlers.update({ notes: value }),
    },
  };
}
