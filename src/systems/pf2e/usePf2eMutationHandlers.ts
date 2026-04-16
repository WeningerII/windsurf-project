import { useCallback } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { systemRegistry } from '../../registry';
import type { Pf2eDataModel, Pf2eProficiencyTier } from './data-model';
import {
  longRestPf2eSpellcasting,
  nextPf2eTier,
  shortRestPf2eSpellcasting,
} from './pf2eSheetShared';

export type Pf2eInventoryBrowserItem = {
  id: string;
  name: string;
  quantity: number;
  weight: number;
};

interface UsePf2eMutationHandlersProps {
  document: CharacterDocument<Pf2eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export function usePf2eMutationHandlers({ document, onUpdate }: UsePf2eMutationHandlersProps) {
  const data = document.system;
  const canUpdate = Boolean(onUpdate);

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<Pf2eDataModel>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...nextDocument, updatedAt: new Date() });
    },
    [onUpdate]
  );

  const update = useCallback(
    (patch: Partial<Pf2eDataModel>) => {
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

  const cycleSkillTier = useCallback(
    (skillId: string) => {
      const current = data.skillProficiencies[skillId] ?? {
        tier: 'untrained' as Pf2eProficiencyTier,
        total: 0,
      };

      update({
        skillProficiencies: {
          ...data.skillProficiencies,
          [skillId]: { ...current, tier: nextPf2eTier(current.tier) },
        },
      });
    },
    [data.skillProficiencies, update]
  );

  const cycleLoreTier = useCallback(
    (loreId: string) => {
      const current = data.loreProficiencies[loreId] ?? {
        tier: 'untrained' as Pf2eProficiencyTier,
        total: 0,
      };

      update({
        loreProficiencies: {
          ...data.loreProficiencies,
          [loreId]: { ...current, tier: nextPf2eTier(current.tier) },
        },
      });
    },
    [data.loreProficiencies, update]
  );

  const cycleSaveTier = useCallback(
    (saveId: keyof Pf2eDataModel['saveProficiencies']) => {
      const current = data.saveProficiencies[saveId];

      update({
        saveProficiencies: {
          ...data.saveProficiencies,
          [saveId]: { ...current, tier: nextPf2eTier(current.tier) },
        },
      });
    },
    [data.saveProficiencies, update]
  );

  const cyclePerceptionTier = useCallback(() => {
    update({
      perceptionProficiency: {
        ...data.perceptionProficiency,
        tier: nextPf2eTier(data.perceptionProficiency.tier),
      },
    });
  }, [data.perceptionProficiency, update]);

  const updateHitPoints = useCallback(
    (current: number, max: number) => {
      update({
        hitPoints: {
          ...data.hitPoints,
          current,
          max,
        },
      });
    },
    [data.hitPoints, update]
  );

  const onShortRest = canUpdate
    ? () => {
        const recovered = Math.max(1, Math.floor(data.level / 2));
        update({
          hitPoints: {
            ...data.hitPoints,
            current: Math.min(data.hitPoints.max, data.hitPoints.current + recovered),
          },
          spellcasting: shortRestPf2eSpellcasting(data.spellcasting),
        });
      }
    : undefined;

  const onLongRest = canUpdate
    ? () => {
        update({
          hitPoints: {
            ...data.hitPoints,
            current: data.hitPoints.max,
            temp: 0,
          },
          heroPoints: Math.max(1, data.heroPoints),
          spellcasting: longRestPf2eSpellcasting(data.spellcasting),
        });
      }
    : undefined;

  const removeFeat = useCallback(
    (featId: string) => {
      update({ feats: data.feats.filter((feat) => feat.id !== featId) });
    },
    [data.feats, update]
  );

  const addInventoryItem = useCallback(
    (item: Pf2eInventoryBrowserItem) => {
      update({
        inventory: [
          ...data.inventory,
          {
            itemId: item.id,
            name: item.name,
            quantity: item.quantity,
            bulk: item.weight,
          },
        ],
      });
    },
    [data.inventory, update]
  );

  const removeInventoryItem = useCallback(
    (itemId: string) => {
      update({
        inventory: data.inventory.filter((item) => item.itemId !== itemId),
      });
    },
    [data.inventory, update]
  );

  const rollCheck = useCallback(
    (checkId: string) => systemRegistry.get(document.systemId)!.engine.rollCheck(document, checkId),
    [document]
  );

  return {
    canUpdate,
    replaceDocument,
    update,
    onNameChange,
    cycleSkillTier,
    cycleLoreTier,
    cycleSaveTier,
    cyclePerceptionTier,
    updateHitPoints,
    onShortRest,
    onLongRest,
    removeFeat,
    addInventoryItem,
    removeInventoryItem,
    rollCheck,
  };
}
