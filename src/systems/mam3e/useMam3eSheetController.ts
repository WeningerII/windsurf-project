import { useMemo } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { parseNum } from '../../utils/math';
import type { Mam3eDataModel } from './data-model';
import { getMam3eSheetState } from './getMam3eSheetState';
import { useMam3eMutationHandlers } from './useMam3eMutationHandlers';
import { useMam3eSheetResources } from './useMam3eSheetResources';

interface UseMam3eSheetControllerProps {
  document: CharacterDocument<Mam3eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export function useMam3eSheetController({ document, onUpdate }: UseMam3eSheetControllerProps) {
  const data = document.system;
  const canUpdate = Boolean(onUpdate);
  const { powerPoints } = data;
  const {
    equipmentItems,
    equipmentLoaded,
    powers,
    powersLoaded,
    advantages,
    advantagesLoaded,
    archetypes,
    archetypesLoaded,
    complicationCatalog,
    complicationsLoaded,
    modifierCatalog,
    powerModifiersLoaded,
    warmArchetypes,
    warmPowers,
    warmPowerBrowser,
    warmAdvantages,
    warmEquipmentBrowser,
    warmComplications,
  } = useMam3eSheetResources({
    systemId: document.systemId as GameSystemId,
  });
  const derivedState = useMemo(
    () =>
      getMam3eSheetState({
        data,
        archetypes,
        modifierCatalog,
      }),
    [archetypes, data, modifierCatalog]
  );
  const mutationHandlers = useMam3eMutationHandlers({
    document,
    onUpdate,
    conditionTrack: derivedState.conditionTrack,
    pinnedArchetypeIds: derivedState.pinnedArchetypeIds,
    insertedComplicationIds: derivedState.insertedComplicationIds,
  });

  return {
    data,
    canUpdate,
    conditionTrack: derivedState.conditionTrack,
    ppSpent: derivedState.ppSpent,
    ppOver: derivedState.ppOver,
    pinnedArchetypeIds: derivedState.pinnedArchetypeIds,
    warmArchetypes,
    warmPowers,
    warmPowerBrowser,
    warmAdvantages,
    warmEquipmentBrowser,
    warmComplications,
    headerProps: {
      document,
      canUpdate,
      ppSpent: derivedState.ppSpent,
      ppOver: derivedState.ppOver,
      onNameChange: mutationHandlers.onNameChange,
      onPowerLevelChange: (value: string) => {
        // Standard build budget tracks Power Level at 15 PP/PL (Hero's Handbook
        // p.24). Keep the two in sync as PL changes; a GM can still override the
        // total afterward via the total-PP input.
        const powerLevel = parseNum(value, 1);
        mutationHandlers.update({
          powerLevel,
          powerPoints: { ...powerPoints, total: powerLevel * 15 },
        });
      },
      onTotalPowerPointsChange: (value: string) =>
        mutationHandlers.update({
          powerPoints: { ...powerPoints, total: parseNum(value, 0) },
        }),
    },
    abilitiesTabProps: {
      document,
      canUpdate,
      onAbilityChange: (ability: keyof Mam3eDataModel['abilities'], value: number) =>
        mutationHandlers.updateAbility(ability, parseNum(String(value), 0)),
      onDefenseRankChange: (defense: keyof Mam3eDataModel['defenses'], value: number) =>
        mutationHandlers.updateDefenseRank(defense, parseNum(String(value), 0)),
    },
    skillsAdvantagesTabProps: {
      document,
      canUpdate,
      onSkillRankChange: (skillId: string, rank: number, total: number) =>
        mutationHandlers.update({
          skills: {
            ...data.skills,
            [skillId]: { rank: parseNum(String(rank), 0), total },
          },
        }),
      onAdvantagesChange: (advantagesValue: Mam3eDataModel['advantages']) => {
        mutationHandlers.update({ advantages: advantagesValue });
      },
      onRollCheck: mutationHandlers.rollCheck,
    },
    archetypesTabProps: {
      archetypesLoaded,
      archetypes,
      pinnedArchetypeIds: derivedState.pinnedArchetypeIds,
      pinnedArchetypes: derivedState.pinnedArchetypes,
      onToggleArchetype: onUpdate ? mutationHandlers.togglePinnedArchetype : undefined,
    },
    powersTabProps: {
      document,
      canUpdate,
      extraModifiers: derivedState.extraModifiers,
      flawModifiers: derivedState.flawModifiers,
      modifierById: derivedState.modifierById,
      onUpdatePowerRank: (powerId: string, rank: number) =>
        mutationHandlers.updatePowerRank(powerId, parseNum(String(rank), 1)),
      onUpdatePowerBaseCost: (powerId: string, baseCost: number) =>
        mutationHandlers.updatePowerById(powerId, (power) => ({
          ...power,
          baseCost: parseNum(String(baseCost), 0),
        })),
      onChangeModifierRank: mutationHandlers.changeModifierRank,
      onAddPowerModifier: mutationHandlers.addPowerModifier,
      onRemovePowerModifier: mutationHandlers.removePowerModifier,
      onRemovePower: mutationHandlers.removePower,
      onAddPower: mutationHandlers.addPower,
    },
    conditionsTabProps: {
      conditionTrack: derivedState.conditionTrack,
      canUpdate,
      onConditionTrackChange: mutationHandlers.updateConditionTrack,
      onReset: mutationHandlers.resetConditionTrack,
      onApplyToughnessFailure: mutationHandlers.applyToughnessFailure,
    },
    complicationsTabProps: {
      complications: data.complications,
      complicationCatalog,
      complicationsLoaded,
      insertedComplicationIds: derivedState.insertedComplicationIds,
      onComplicationsChange: onUpdate
        ? (complications: Mam3eDataModel['complications']) =>
            mutationHandlers.update({ complications })
        : undefined,
      onInsertComplication: onUpdate ? mutationHandlers.insertComplication : undefined,
    },
    powerBrowserTabProps: {
      powersLoaded,
      powers,
      powerModifiersLoaded,
      modifierCatalog,
    },
    advantageBrowserTabProps: {
      advantagesLoaded,
      advantages,
    },
    equipmentBrowserTabProps: {
      equipmentLoaded,
      equipmentItems,
    },
    notesTabProps: {
      notes: data.notes || '',
      canUpdate,
      onNotesChange: (value: string) => mutationHandlers.update({ notes: value }),
    },
  };
}
