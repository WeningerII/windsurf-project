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
          // Record a 'manual' source so template removal (class/background
          // change) can tell hand-trained proficiencies from granted ones and
          // leave them alone.
          [skillId]: {
            ...current,
            tier: nextPf2eTier(current.tier),
            source: [...new Set([...(current.source ?? []), 'manual'])],
          },
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
          [loreId]: {
            ...current,
            tier: nextPf2eTier(current.tier),
            source: [...new Set([...(current.source ?? []), 'manual'])],
          },
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

  const cycleClassDcTier = useCallback(() => {
    const current = data.classDcProficiency ?? {
      tier: 'trained' as Pf2eProficiencyTier,
      total: 0,
    };

    update({
      classDcProficiency: { ...current, tier: nextPf2eTier(current.tier) },
    });
  }, [data.classDcProficiency, update]);

  const updateHitPoints = useCallback(
    (current: number, max: number) => {
      // The engine derives `max` on every prepare, so a raw max edit would be
      // reverted. Persist the edit as `maxBonus` (delta from the computed
      // baseline) instead; the engine adds it back on top.
      const computedBaseline = data.hitPoints.max - (data.hitPoints.maxBonus ?? 0);
      update({
        hitPoints: {
          ...data.hitPoints,
          current,
          max,
          maxBonus: max - computedBaseline,
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

  const cycleSpellProficiencyTier = useCallback(() => {
    if (!data.spellcasting) {
      return;
    }

    // Persist only the tier — the engine recomputes `total` from level + tier
    // on every prepare (same contract as the class DC badge).
    update({
      spellcasting: {
        ...data.spellcasting,
        proficiency: {
          ...data.spellcasting.proficiency,
          tier: nextPf2eTier(data.spellcasting.proficiency.tier),
        },
      },
    });
  }, [data.spellcasting, update]);

  const toggleShieldRaised = useCallback(() => {
    // CRB: the Raise a Shield action — flip the equipped shield's raised flag;
    // the engine re-derives AC (and clears the flag if the shield unequips).
    const hasEquippedShield = data.equipment.some(
      (item) => item.equipped && item.shieldBonus != null
    );
    if (!hasEquippedShield) {
      return;
    }

    update({
      equipment: data.equipment.map((item) =>
        item.equipped && item.shieldBonus != null ? { ...item, raised: !item.raised } : item
      ),
    });
  }, [data.equipment, update]);

  const isEquippedPf2eArmor = (item: {
    equipped: boolean;
    armorClass?: number;
    shieldBonus?: number;
  }) => item.equipped && item.armorClass != null && item.shieldBonus == null;
  const isEquippedPf2eShield = (item: { equipped: boolean; shieldBonus?: number }) =>
    item.equipped && item.shieldBonus != null;

  // Equip at most one armor and one shield; each replaces its kind and copies
  // the catalog stats (AC bonus, dex cap) that computePf2eAC reads. Shields
  // equip un-raised (the Raise a Shield action is the separate toggle above).
  const equipArmor = useCallback(
    (item: {
      id: string;
      name: string;
      bulk?: number;
      armorClass?: number;
      armorType?: 'light' | 'medium' | 'heavy';
      dexBonusMax?: number;
    }) => {
      update({
        equipment: [
          ...data.equipment.filter((entry) => !isEquippedPf2eArmor(entry)),
          {
            itemId: item.id,
            name: item.name,
            bulk: item.bulk ?? 0,
            equipped: true,
            armorClass: item.armorClass,
            armorType: item.armorType,
            dexBonusMax: item.dexBonusMax,
          },
        ],
      });
    },
    [data.equipment, update]
  );

  const equipShield = useCallback(
    (item: { id: string; name: string; bulk?: number; shieldBonus?: number }) => {
      update({
        equipment: [
          ...data.equipment.filter((entry) => !isEquippedPf2eShield(entry)),
          {
            itemId: item.id,
            name: item.name,
            bulk: item.bulk ?? 0,
            equipped: true,
            shieldBonus: item.shieldBonus,
            raised: false,
          },
        ],
      });
    },
    [data.equipment, update]
  );

  const unequipArmor = useCallback(() => {
    update({ equipment: data.equipment.filter((entry) => !isEquippedPf2eArmor(entry)) });
  }, [data.equipment, update]);

  const unequipShield = useCallback(() => {
    update({ equipment: data.equipment.filter((entry) => !isEquippedPf2eShield(entry)) });
  }, [data.equipment, update]);

  return {
    canUpdate,
    replaceDocument,
    update,
    onNameChange,
    cycleSkillTier,
    cycleLoreTier,
    cycleSaveTier,
    cyclePerceptionTier,
    cycleClassDcTier,
    updateHitPoints,
    onShortRest,
    onLongRest,
    removeFeat,
    addInventoryItem,
    removeInventoryItem,
    equipArmor,
    equipShield,
    unequipArmor,
    unequipShield,
    rollCheck,
    toggleShieldRaised,
    cycleSpellProficiencyTier,
  };
}
