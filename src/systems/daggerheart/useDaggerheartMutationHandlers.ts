import { useCallback } from 'react';
import type {
  DaggerheartDomainCard,
  DaggerheartInventoryDefinition,
  DaggerheartWeapon,
} from '../../types/daggerheart';
import { getDaggerheartDerivedStats } from '../../rules/daggerheartDerived';
import {
  clampDaggerheartInventoryQuantity,
  createDaggerheartInventoryEntry,
  normalizeDaggerheartCurrency,
} from '../../rules/daggerheartInventory';
import {
  clearAllStress,
  prepareGainHope,
  repairAllArmor,
  tendToAllWounds,
} from './daggerheartRest';
import { INVENTORY_WEAPON_LIMIT, LOADOUT_LIMIT } from './daggerheartSheetConstants';
import type { DaggerheartDataModel } from './data-model';

interface UseDaggerheartMutationHandlersProps {
  data: DaggerheartDataModel;
  update: (patch: Partial<DaggerheartDataModel>) => void;
  weaponLoadout: NonNullable<DaggerheartDataModel['weapons']>;
  weaponOptions: DaggerheartWeapon[];
  activePrimaryWeapon?: DaggerheartWeapon;
  activeSecondaryWeapon?: DaggerheartWeapon;
  ownedDomainCardIds: Set<string>;
}

type DomainCardEntry = NonNullable<DaggerheartDataModel['domainCards']>[number];

export function useDaggerheartMutationHandlers({
  data,
  update,
  weaponLoadout,
  weaponOptions,
  activePrimaryWeapon,
  activeSecondaryWeapon,
  ownedDomainCardIds,
}: UseDaggerheartMutationHandlersProps) {
  const loadoutCount = data.domainCards.filter((card) => card.location !== 'vault').length;

  const updateWeaponLoadout = useCallback(
    (patch: Partial<DaggerheartDataModel['weapons']>) => {
      update({
        weapons: {
          ...weaponLoadout,
          ...patch,
        },
      });
    },
    [update, weaponLoadout]
  );

  const equipPrimaryWeapon = useCallback(
    (weaponId: string) => {
      const weapon = weaponOptions.find((entry) => entry.id === weaponId);
      if (!weapon || weapon.category !== 'primary') {
        return;
      }
      if ((activeSecondaryWeapon?.burden || 0) + weapon.burden > 2) {
        return;
      }

      updateWeaponLoadout({
        primaryId: weaponId,
        inventoryIds: weaponLoadout.inventoryIds.filter((entry) => entry !== weaponId),
      });
    },
    [activeSecondaryWeapon?.burden, updateWeaponLoadout, weaponLoadout.inventoryIds, weaponOptions]
  );

  const equipSecondaryWeapon = useCallback(
    (weaponId: string) => {
      const weapon = weaponOptions.find((entry) => entry.id === weaponId);
      if (!weapon || weapon.category !== 'secondary') {
        return;
      }
      if ((activePrimaryWeapon?.burden || 0) + weapon.burden > 2) {
        return;
      }

      updateWeaponLoadout({
        secondaryId: weaponId,
        inventoryIds: weaponLoadout.inventoryIds.filter((entry) => entry !== weaponId),
      });
    },
    [activePrimaryWeapon?.burden, updateWeaponLoadout, weaponLoadout.inventoryIds, weaponOptions]
  );

  const storeWeapon = useCallback(
    (weaponId: string) => {
      if (
        weaponLoadout.inventoryIds.includes(weaponId) ||
        weaponLoadout.inventoryIds.length >= INVENTORY_WEAPON_LIMIT
      ) {
        return;
      }

      updateWeaponLoadout({
        inventoryIds: [...weaponLoadout.inventoryIds, weaponId],
        primaryId: weaponLoadout.primaryId === weaponId ? '' : weaponLoadout.primaryId,
        secondaryId: weaponLoadout.secondaryId === weaponId ? '' : weaponLoadout.secondaryId,
      });
    },
    [updateWeaponLoadout, weaponLoadout]
  );

  const removeStoredWeapon = useCallback(
    (weaponId: string) => {
      updateWeaponLoadout({
        inventoryIds: weaponLoadout.inventoryIds.filter((entry) => entry !== weaponId),
      });
    },
    [updateWeaponLoadout, weaponLoadout.inventoryIds]
  );

  const clearPrimaryWeapon = useCallback(() => {
    updateWeaponLoadout({ primaryId: '' });
  }, [updateWeaponLoadout]);

  const clearSecondaryWeapon = useCallback(() => {
    updateWeaponLoadout({ secondaryId: '' });
  }, [updateWeaponLoadout]);

  const equipArmor = useCallback(
    (armorId: string) => {
      const preview = getDaggerheartDerivedStats({
        ...data,
        armorId,
        weapons: weaponLoadout,
      });
      const currentWasFull = data.armor.current >= data.armor.max;

      update({
        armorId,
        armor: {
          current:
            currentWasFull || data.armor.max === 0
              ? preview.armorMax
              : Math.min(data.armor.current, preview.armorMax),
          max: preview.armorMax,
        },
      });
    },
    [data, update, weaponLoadout]
  );

  const clearArmor = useCallback(() => {
    update({
      armorId: '',
      armor: {
        current: 0,
        max: 0,
      },
    });
  }, [update]);

  const updateCurrency = useCallback(
    (nextCurrency: DaggerheartDataModel['currency']) => {
      update({ currency: normalizeDaggerheartCurrency(nextCurrency) });
    },
    [update]
  );

  const updateInventory = useCallback(
    (nextInventory: DaggerheartDataModel['inventory']) => {
      update({ inventory: nextInventory });
    },
    [update]
  );

  const updateInventoryEntry = useCallback(
    (itemId: string, patch: Partial<DaggerheartDataModel['inventory'][number]>, index?: number) => {
      updateInventory(
        data.inventory.map((entry, entryIndex) => {
          const matches = index !== undefined ? entryIndex === index : entry.itemId === itemId;
          if (!matches) {
            return entry;
          }

          const nextEntry = { ...entry, ...patch };
          return {
            ...nextEntry,
            quantity: clampDaggerheartInventoryQuantity(nextEntry.itemId, nextEntry.quantity),
          };
        })
      );
    },
    [data.inventory, updateInventory]
  );

  const removeInventoryEntry = useCallback(
    (index: number) => {
      updateInventory(data.inventory.filter((_, entryIndex) => entryIndex !== index));
    },
    [data.inventory, updateInventory]
  );

  const addCustomInventoryItem = useCallback(() => {
    updateInventory([
      ...data.inventory,
      {
        itemId: `custom-item:${Date.now()}`,
        name: '',
        quantity: 1,
        description: '',
      },
    ]);
  }, [data.inventory, updateInventory]);

  const addInventoryDefinition = useCallback(
    (definition: DaggerheartInventoryDefinition) => {
      const existingIndex = data.inventory.findIndex((entry) => entry.itemId === definition.id);
      if (existingIndex >= 0) {
        updateInventory(
          data.inventory.map((entry, index) =>
            index === existingIndex
              ? {
                  ...entry,
                  quantity: clampDaggerheartInventoryQuantity(definition.id, entry.quantity + 1),
                }
              : entry
          )
        );
        return;
      }

      updateInventory([...data.inventory, createDaggerheartInventoryEntry(definition)]);
    },
    [data.inventory, updateInventory]
  );

  const consumeInventoryItem = useCallback(
    (itemId: string) => {
      const index = data.inventory.findIndex((entry) => entry.itemId === itemId);
      if (index < 0) {
        return;
      }

      const current = data.inventory[index];
      if (current.quantity <= 1) {
        removeInventoryEntry(index);
        return;
      }

      updateInventory(
        data.inventory.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, quantity: entry.quantity - 1 } : entry
        )
      );
    },
    [data.inventory, removeInventoryEntry, updateInventory]
  );

  const addDomainCard = useCallback(
    (card: DaggerheartDomainCard, location: 'loadout' | 'vault') => {
      const nextId = card.id;
      if (
        ownedDomainCardIds.has(nextId) ||
        (location === 'loadout' && loadoutCount >= LOADOUT_LIMIT)
      ) {
        return;
      }

      update({
        domainCards: [
          ...data.domainCards,
          {
            id: nextId,
            cardId: card.id,
            name: card.name,
            domain: card.domain,
            level: card.level,
            type: card.type,
            recallCost: card.recallCost,
            location,
            description: card.description,
          },
        ],
      });
    },
    [data.domainCards, loadoutCount, ownedDomainCardIds, update]
  );

  const moveDomainCard = useCallback(
    (entryId: string, location: 'loadout' | 'vault') => {
      const currentCard = data.domainCards.find((card) => card.id === entryId);
      if (!currentCard) {
        return;
      }

      const currentLocation = currentCard.location ?? 'loadout';
      if (currentLocation === location) {
        return;
      }

      if (
        location === 'loadout' &&
        currentLocation !== 'loadout' &&
        loadoutCount >= LOADOUT_LIMIT
      ) {
        return;
      }

      update({
        domainCards: data.domainCards.map((card) =>
          card.id === entryId ? { ...card, location } : card
        ),
      });
    },
    [data.domainCards, loadoutCount, update]
  );

  const updateDomainCardEntry = useCallback(
    (entryId: string, patch: Partial<DomainCardEntry>) => {
      update({
        domainCards: data.domainCards.map((card) =>
          card.id === entryId ? { ...card, ...patch } : card
        ),
      });
    },
    [data.domainCards, update]
  );

  const removeDomainCard = useCallback(
    (entryId: string) => {
      update({ domainCards: data.domainCards.filter((card) => card.id !== entryId) });
    },
    [data.domainCards, update]
  );

  // Long-rest downtime moves (SRD). Each applies exactly one deterministic move
  // — the player picks the two they make on a long rest; the short-rest
  // dice-based variants stay a follow-up (see daggerheartRest.ts).
  const restTendToAllWounds = useCallback(() => update(tendToAllWounds(data)), [data, update]);
  const restClearAllStress = useCallback(() => update(clearAllStress(data)), [data, update]);
  const restRepairAllArmor = useCallback(() => update(repairAllArmor(data)), [data, update]);
  const restPrepare = useCallback(() => update(prepareGainHope(data)), [data, update]);

  return {
    restTendToAllWounds,
    restClearAllStress,
    restRepairAllArmor,
    restPrepare,
    equipPrimaryWeapon,
    equipSecondaryWeapon,
    storeWeapon,
    removeStoredWeapon,
    clearPrimaryWeapon,
    clearSecondaryWeapon,
    equipArmor,
    clearArmor,
    updateCurrency,
    updateInventoryEntry,
    removeInventoryEntry,
    addCustomInventoryItem,
    addInventoryDefinition,
    consumeInventoryItem,
    addDomainCard,
    moveDomainCard,
    updateDomainCardEntry,
    removeDomainCard,
  };
}
