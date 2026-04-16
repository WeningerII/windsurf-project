import { useCallback } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Power } from '../../types/mam/powers';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Complication } from '../../data/mutants-and-masterminds/3e/complications';
import { systemRegistry } from '../../registry';
import { getPowerModifierRank } from './powerMath';
import type { Mam3eConditionTrack, Mam3eDataModel } from './data-model';
import { createEmptyMam3eConditionTrack, createEmptyMam3ePower } from './mam3eSheetShared';

interface UseMam3eMutationHandlersProps {
  document: CharacterDocument<Mam3eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  conditionTrack: Mam3eConditionTrack;
  pinnedArchetypeIds: string[];
  insertedComplicationIds: string[];
}

export function useMam3eMutationHandlers({
  document,
  onUpdate,
  conditionTrack,
  pinnedArchetypeIds,
  insertedComplicationIds,
}: UseMam3eMutationHandlersProps) {
  const data = document.system;
  const { abilities, defenses } = data;

  const update = useCallback(
    (patch: Partial<Mam3eDataModel>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...document, system: { ...data, ...patch }, updatedAt: new Date() });
    },
    [data, document, onUpdate]
  );

  const onNameChange = useCallback(
    (name: string) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...document, name, updatedAt: new Date() });
    },
    [document, onUpdate]
  );

  const updatePowerById = useCallback(
    (powerId: string, updater: (power: Power) => Power) => {
      update({
        powers: data.powers.map((power) => (power.id === powerId ? updater(power) : power)),
      });
    },
    [data.powers, update]
  );

  const addPowerModifier = useCallback(
    (powerId: string, modifierType: 'extra' | 'flaw', modifierId: string) => {
      if (!modifierId) {
        return;
      }

      updatePowerById(powerId, (power) => {
        if (modifierType === 'extra') {
          const extras = power.extras ?? [];
          if (extras.includes(modifierId)) {
            return power;
          }

          return {
            ...power,
            extras: [...extras, modifierId],
            modifierRanks: {
              ...(power.modifierRanks ?? {}),
              [modifierId]: getPowerModifierRank(power, modifierId),
            },
          };
        }

        const flaws = power.flaws ?? [];
        if (flaws.includes(modifierId)) {
          return power;
        }

        return {
          ...power,
          flaws: [...flaws, modifierId],
          modifierRanks: {
            ...(power.modifierRanks ?? {}),
            [modifierId]: getPowerModifierRank(power, modifierId),
          },
        };
      });
    },
    [updatePowerById]
  );

  const removePowerModifier = useCallback(
    (powerId: string, modifierType: 'extra' | 'flaw', modifierId: string) => {
      updatePowerById(powerId, (power) => {
        const nextModifierRanks = { ...(power.modifierRanks ?? {}) };
        delete nextModifierRanks[modifierId];
        const hasRanks = Object.keys(nextModifierRanks).length > 0;

        if (modifierType === 'extra') {
          return {
            ...power,
            extras: (power.extras ?? []).filter((id) => id !== modifierId),
            modifierRanks: hasRanks ? nextModifierRanks : undefined,
          };
        }

        return {
          ...power,
          flaws: (power.flaws ?? []).filter((id) => id !== modifierId),
          modifierRanks: hasRanks ? nextModifierRanks : undefined,
        };
      });
    },
    [updatePowerById]
  );

  const changeModifierRank = useCallback(
    (powerId: string, modifierId: string, delta: number) => {
      updatePowerById(powerId, (power) => {
        const current = getPowerModifierRank(power, modifierId);
        const next = Math.max(1, current + delta);

        return {
          ...power,
          modifierRanks: {
            ...(power.modifierRanks ?? {}),
            [modifierId]: next,
          },
        };
      });
    },
    [updatePowerById]
  );

  const updatePowerRank = useCallback(
    (powerId: string, rank: number) => {
      updatePowerById(powerId, (power) => ({
        ...power,
        rank: Math.max(1, Math.floor(rank)),
      }));
    },
    [updatePowerById]
  );

  const removePower = useCallback(
    (powerId: string) => {
      update({ powers: data.powers.filter((power) => power.id !== powerId) });
    },
    [data.powers, update]
  );

  const addPower = useCallback(() => {
    update({
      powers: [...data.powers, createEmptyMam3ePower(`power-${Date.now()}`)],
    });
  }, [data.powers, update]);

  const updateAbility = useCallback(
    (key: keyof Mam3eDataModel['abilities'], value: number) => {
      update({ abilities: { ...abilities, [key]: value } });
    },
    [abilities, update]
  );

  const updateDefenseRank = useCallback(
    (key: keyof Mam3eDataModel['defenses'], rank: number) => {
      update({ defenses: { ...defenses, [key]: { ...defenses[key], rank } } });
    },
    [defenses, update]
  );

  const updateConditionTrack = useCallback(
    (patch: Partial<Mam3eConditionTrack>) => {
      update({
        conditionTrack: {
          ...conditionTrack,
          ...patch,
        },
      });
    },
    [conditionTrack, update]
  );

  const applyToughnessFailure = useCallback(
    (failureMargin: number) => {
      const next = { ...conditionTrack };

      if (failureMargin >= 15) {
        next.incapacitated = true;
        update({ conditionTrack: next });
        return;
      }

      if (failureMargin >= 10) {
        next.bruised += 1;
        next.staggered = true;
        update({ conditionTrack: next });
        return;
      }

      if (failureMargin >= 5) {
        next.bruised += 1;
        if (next.dazed) {
          next.staggered = true;
        }
        next.dazed = true;
        update({ conditionTrack: next });
        return;
      }

      if (failureMargin > 0) {
        next.bruised += 1;
        update({ conditionTrack: next });
      }
    },
    [conditionTrack, update]
  );

  const togglePinnedArchetype = useCallback(
    (archetype: CharacterClass) => {
      const nextPinnedIds = pinnedArchetypeIds.includes(archetype.id)
        ? pinnedArchetypeIds.filter((id) => id !== archetype.id)
        : [...pinnedArchetypeIds, archetype.id];

      update({ selectedArchetypeIds: nextPinnedIds });
    },
    [pinnedArchetypeIds, update]
  );

  const insertComplication = useCallback(
    (complication: Complication) => {
      if (insertedComplicationIds.includes(complication.id)) {
        return;
      }

      update({
        complications: [
          ...data.complications,
          {
            id: complication.id,
            name: complication.name,
            description: complication.description,
            source: complication.source,
            category: complication.category,
          },
        ],
      });
    },
    [data.complications, insertedComplicationIds, update]
  );

  const resetConditionTrack = useCallback(() => {
    update({ conditionTrack: createEmptyMam3eConditionTrack() });
  }, [update]);

  const rollCheck = useCallback(
    (checkId: string) => systemRegistry.get(document.systemId)!.engine.rollCheck(document, checkId),
    [document]
  );

  return {
    update,
    onNameChange,
    updatePowerById,
    addPowerModifier,
    removePowerModifier,
    changeModifierRank,
    updatePowerRank,
    removePower,
    addPower,
    updateAbility,
    updateDefenseRank,
    updateConditionTrack,
    applyToughnessFailure,
    togglePinnedArchetype,
    insertComplication,
    resetConditionTrack,
    rollCheck,
  };
}
