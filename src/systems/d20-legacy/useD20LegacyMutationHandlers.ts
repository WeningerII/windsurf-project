import { useCallback, useState } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import type { Pf1eTrait } from '../pf1e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';
import {
  recoverD20LegacySpellSlot,
  resetD20LegacySpellSlots,
  setD20LegacyPreparedSpell,
  setD20LegacySpellSlotTotal,
  spendD20LegacySpellSlot,
  type D20LegacyData,
} from './d20LegacySheetShared';
import { consume, poolFromRemaining, remainingOf } from '../../utils/resourcePool';
import { parseWeaponDamageDice } from '../../utils/derivedCombatMath';

/**
 * Map a d20-legacy catalog weapon onto a `mainHand` equipment entry carrying the
 * numeric weapon dice the scene combatant reads. Accepts the divergent shapes
 * the two legacy systems author — 3.5e's notation-string `damage` (`'1d8'`) and
 * PF1e's canonical `DiceRoll` — via {@link parseWeaponDamageDice}; it does NOT
 * assume the 5e DiceRoll shape. Returns null when the damage is missing or
 * unparseable, so a malformed catalog entry equips nothing.
 */
export function toEquippedD20LegacyWeapon(item: {
  id: string;
  name: string;
  damage?: string | { count?: number; die?: number | string } | null;
}): {
  itemId: string;
  name: string;
  equipped: true;
  slot: 'mainHand';
  weaponDamage: { count: number; die: number };
} | null {
  const weaponDamage = parseWeaponDamageDice(item.damage);
  if (!weaponDamage) return null;
  return { itemId: item.id, name: item.name, equipped: true, slot: 'mainHand', weaponDamage };
}

interface UseD20LegacyMutationHandlersProps {
  typedDocument: CharacterDocument<D20LegacyData>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  pf1Data: Pf1eDataModel | null;
  traitOptions: Pf1eTrait[];
}

export function useD20LegacyMutationHandlers({
  typedDocument,
  onUpdate,
  pf1Data,
  traitOptions,
}: UseD20LegacyMutationHandlersProps) {
  const sys = typedDocument.system;
  const canUpdate = Boolean(onUpdate);
  const [selectedTraitId, setSelectedTraitId] = useState('');

  const update = useCallback(
    (patch: Partial<D20LegacyData>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...typedDocument,
        system: { ...sys, ...patch } as SystemDataModel,
        updatedAt: new Date(),
      });
    },
    [onUpdate, sys, typedDocument]
  );

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<D20LegacyData>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...nextDocument, updatedAt: new Date() } as CharacterDocument<SystemDataModel>);
    },
    [onUpdate]
  );

  const onNameChange = useCallback(
    (name: string) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...typedDocument, name, updatedAt: new Date() });
    },
    [onUpdate, typedDocument]
  );

  const onShortRest = canUpdate
    ? () => {
        const level = (sys.level as number) ?? 1;
        const recovered = Math.max(1, Math.floor(level / 2));
        update({
          hitPoints: {
            ...sys.hitPoints,
            current: Math.min(sys.hitPoints.max, sys.hitPoints.current + recovered),
          },
        } as Partial<D20LegacyData>);
      }
    : undefined;

  const onLongRest = canUpdate
    ? () => {
        update({
          hitPoints: { ...sys.hitPoints, current: sys.hitPoints.max, temp: 0 },
          // Domain, specialist, and Dragon Disciple bonus slots are folded into
          // spellsPerDay, so resetting it clears their daily usage too.
          spellsPerDay: resetD20LegacySpellSlots(sys.spellsPerDay),
        } as Partial<D20LegacyData>);
      }
    : undefined;

  const prunePreparedSpellLevels = useCallback(
    (
      preparedSpellsByLevel: D20LegacyData['preparedSpellsByLevel'],
      retainedSpellIds: Set<string>
    ): D20LegacyData['preparedSpellsByLevel'] => {
      if (!preparedSpellsByLevel) {
        return preparedSpellsByLevel;
      }

      const nextPreparedSpellsByLevel: Record<number, string[]> = {};
      for (const [level, spellIds] of Object.entries(preparedSpellsByLevel)) {
        const filtered = spellIds.filter((spellId) => retainedSpellIds.has(spellId));
        if (filtered.length > 0) {
          nextPreparedSpellsByLevel[Number(level)] = filtered;
        }
      }

      return nextPreparedSpellsByLevel;
    },
    []
  );

  const addTrait = useCallback(() => {
    const trait = traitOptions.find((entry) => entry.id === selectedTraitId);
    if (!trait || !pf1Data) {
      return;
    }

    update({
      traits: [...pf1Data.traits, trait],
    } as Partial<D20LegacyData>);
    setSelectedTraitId('');
  }, [pf1Data, selectedTraitId, traitOptions, update]);

  const removeTrait = useCallback(
    (traitId: string) => {
      if (!pf1Data) {
        return;
      }

      update({
        traits: pf1Data.traits.filter((trait) => trait.id !== traitId),
      } as Partial<D20LegacyData>);
    },
    [pf1Data, update]
  );

  const addSpellLevel = useCallback(() => {
    const spellSlots = sys.spellsPerDay ?? {};
    const spellSlotLevels = Object.keys(spellSlots)
      .map((level) => Number(level))
      .filter((level) => Number.isFinite(level));
    const nextLevel = spellSlotLevels.length > 0 ? Math.max(...spellSlotLevels) + 1 : 0;

    update({
      spellsPerDay: {
        ...spellSlots,
        // Class tables contribute 0 at a level they don't list, so record the
        // whole starting total as a manual bonus — otherwise the engine's next
        // prepare would snap the new row back to 0/0.
        [nextLevel]: { total: 1, used: 0, manualBonus: 1 },
      },
    } as Partial<D20LegacyData>);
  }, [sys.spellsPerDay, update]);

  const addKnownSpell = useCallback(
    (spell: Spell) => {
      const existingSpellIds = sys.spellsKnown ?? [];
      if (existingSpellIds.includes(spell.id)) {
        return;
      }

      update({
        spellsKnown: [...existingSpellIds, spell.id],
      } as Partial<D20LegacyData>);
    },
    [sys.spellsKnown, update]
  );

  const removeKnownSpell = useCallback(
    (spellId: string) => {
      const nextSpellIds = (sys.spellsKnown ?? []).filter((entry) => entry !== spellId);
      const retainedSpellIds = new Set(nextSpellIds);

      update({
        spellsKnown: nextSpellIds,
        preparedSpellsByLevel: prunePreparedSpellLevels(
          sys.preparedSpellsByLevel,
          retainedSpellIds
        ),
      } as Partial<D20LegacyData>);
    },
    [prunePreparedSpellLevels, sys.preparedSpellsByLevel, sys.spellsKnown, update]
  );

  const setPreparedSpell = useCallback(
    (level: number, slotIndex: number, spellId: string) => {
      update({
        preparedSpellsByLevel: setD20LegacyPreparedSpell(
          sys.preparedSpellsByLevel,
          level,
          slotIndex,
          spellId
        ),
      } as Partial<D20LegacyData>);
    },
    [sys.preparedSpellsByLevel, update]
  );

  const useSpellSlot = useCallback(
    (level: number) => {
      const nextSpellsPerDay = spendD20LegacySpellSlot(sys.spellsPerDay, level);
      if (nextSpellsPerDay === sys.spellsPerDay) {
        return;
      }

      update({
        spellsPerDay: nextSpellsPerDay,
      } as Partial<D20LegacyData>);
    },
    [sys.spellsPerDay, update]
  );

  const recoverSpellSlot = useCallback(
    (level: number) => {
      const nextSpellsPerDay = recoverD20LegacySpellSlot(sys.spellsPerDay, level);
      if (nextSpellsPerDay === sys.spellsPerDay) {
        return;
      }

      update({
        spellsPerDay: nextSpellsPerDay,
      } as Partial<D20LegacyData>);
    },
    [sys.spellsPerDay, update]
  );

  const setSpellSlotTotal = useCallback(
    (level: number, total: number) => {
      const nextSpellsPerDay = setD20LegacySpellSlotTotal(sys.spellsPerDay, level, total);
      if (nextSpellsPerDay === sys.spellsPerDay) {
        return;
      }

      update({
        spellsPerDay: nextSpellsPerDay,
      } as Partial<D20LegacyData>);
    },
    [sys.spellsPerDay, update]
  );

  const setSpontaneousConversionReference = useCallback(
    (reference: 'cure' | 'inflict' | 'both') => {
      update({
        manualSpellcastingExtras: {
          ...(sys.manualSpellcastingExtras ?? {}),
          spontaneousConversionReference: reference,
        },
      } as Partial<D20LegacyData>);
    },
    [sys.manualSpellcastingExtras, update]
  );

  const setArcaneSpecialtySchool = useCallback(
    (school: string) => {
      // A real school grants the specialist's +1 slot per castable level (the
      // engine reads this); an empty value means generalist/universalist.
      update({ arcaneSpecialtySchool: school || undefined } as Partial<D20LegacyData>);
    },
    [update]
  );

  const addFeat = useCallback(() => {
    update({
      feats: [
        ...sys.feats,
        {
          id: `feat-${Date.now()}`,
          name: 'New Feat',
          description: '',
          source: 'Custom',
        },
      ],
    } as Partial<D20LegacyData>);
  }, [sys.feats, update]);

  // Equip flow: at most one armor and one shield are equipped at a time. Each
  // handler replaces the previously-equipped piece of its kind and copies the
  // catalog stats (AC bonus, dex cap, check penalty) onto the character entry,
  // which computeD20LegacyAC and the skill check-penalty reader then consume.
  const isEquippedArmor = (entry: {
    equipped: boolean;
    armorClass?: number;
    shieldBonus?: number;
  }) => entry.equipped && entry.armorClass != null && entry.shieldBonus == null;
  const isEquippedShield = (entry: { equipped: boolean; shieldBonus?: number }) =>
    entry.equipped && entry.shieldBonus != null;

  const equipArmor = useCallback(
    (item: {
      id: string;
      name: string;
      armorClass?: number;
      armorType?: 'light' | 'medium' | 'heavy';
      dexBonusMax?: number;
      armorCheckPenalty?: number;
    }) => {
      update({
        equipment: [
          ...sys.equipment.filter((entry) => !isEquippedArmor(entry)),
          {
            itemId: item.id,
            name: item.name,
            equipped: true,
            slot: 'armor',
            armorClass: item.armorClass,
            armorType: item.armorType,
            dexBonusMax: item.dexBonusMax,
            armorCheckPenalty: item.armorCheckPenalty,
          },
        ],
      } as Partial<D20LegacyData>);
    },
    [sys.equipment, update]
  );

  const equipShield = useCallback(
    (item: { id: string; name: string; shieldBonus?: number; armorCheckPenalty?: number }) => {
      update({
        equipment: [
          ...sys.equipment.filter((entry) => !isEquippedShield(entry)),
          {
            itemId: item.id,
            name: item.name,
            equipped: true,
            slot: 'shield',
            shieldBonus: item.shieldBonus,
            armorCheckPenalty: item.armorCheckPenalty,
          },
        ],
      } as Partial<D20LegacyData>);
    },
    [sys.equipment, update]
  );

  // Equip a main-hand weapon: replace any previously-equipped main-hand weapon
  // and copy the catalog's dice (parsed from 3.5e's string notation or PF1e's
  // DiceRoll) onto the entry, which buildCharacterCombatant then rolls in scene
  // combat. Coexists with armor/shield (which carry no `slot: 'mainHand'`).
  const isEquippedWeapon = (entry: { slot?: string }) => entry.slot === 'mainHand';

  const equipWeapon = useCallback(
    (item: {
      id: string;
      name: string;
      damage?: string | { count?: number; die?: number | string } | null;
    }) => {
      const entry = toEquippedD20LegacyWeapon(item);
      if (!entry) {
        return;
      }
      update({
        equipment: [...sys.equipment.filter((entry) => !isEquippedWeapon(entry)), entry],
      } as Partial<D20LegacyData>);
    },
    [sys.equipment, update]
  );

  const unequipWeapon = useCallback(() => {
    update({
      equipment: sys.equipment.filter((entry) => !isEquippedWeapon(entry)),
    } as Partial<D20LegacyData>);
  }, [sys.equipment, update]);

  const unequipArmor = useCallback(() => {
    update({
      equipment: sys.equipment.filter((entry) => !isEquippedArmor(entry)),
    } as Partial<D20LegacyData>);
  }, [sys.equipment, update]);

  const unequipShield = useCallback(() => {
    update({
      equipment: sys.equipment.filter((entry) => !isEquippedShield(entry)),
    } as Partial<D20LegacyData>);
  }, [sys.equipment, update]);

  const addItem = useCallback(
    (item: { id: string; name: string; quantity: number; weight: number }) => {
      update({
        inventory: [
          ...sys.inventory,
          {
            itemId: item.id,
            name: item.name,
            quantity: item.quantity,
            weight: item.weight,
          },
        ],
      } as Partial<D20LegacyData>);
    },
    [sys.inventory, update]
  );

  const consumeItem = useCallback(
    (itemId: string) => {
      const index = sys.inventory.findIndex((entry) => entry.itemId === itemId);
      if (index < 0) {
        return;
      }

      const current = sys.inventory[index];
      // Deplete one stacked unit through the shared `consume` verb; drop the
      // whole entry once `depleted` reports the stack is empty.
      const { pool, depleted } = consume(poolFromRemaining(current.quantity, current.quantity));
      if (depleted) {
        update({
          inventory: sys.inventory.filter((_, entryIndex) => entryIndex !== index),
        } as Partial<D20LegacyData>);
        return;
      }

      const nextQuantity = remainingOf(pool);
      update({
        inventory: sys.inventory.map((entry, entryIndex) =>
          entryIndex === index ? { ...entry, quantity: nextQuantity } : entry
        ),
      } as Partial<D20LegacyData>);
    },
    [sys.inventory, update]
  );

  return {
    canUpdate,
    selectedTraitId,
    setSelectedTraitId,
    update,
    replaceDocument,
    onNameChange,
    onShortRest,
    onLongRest,
    addTrait,
    removeTrait,
    addSpellLevel,
    addKnownSpell,
    removeKnownSpell,
    setPreparedSpell,
    useSpellSlot,
    recoverSpellSlot,
    setSpellSlotTotal,
    setSpontaneousConversionReference,
    setArcaneSpecialtySchool,
    addFeat,
    addItem,
    consumeItem,
    equipArmor,
    equipShield,
    equipWeapon,
    unequipArmor,
    unequipShield,
    unequipWeapon,
  };
}
