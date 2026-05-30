import { useCallback, useState } from 'react';
import type { FeatDefinition } from '../../../types/character-options/feats';
import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionSelection,
} from '../../../types/character-options/feature-options';
import type {
  Currency,
  DeathSaves,
  PersonalityInfo,
  SpellSlots,
} from '../../../types/core/character';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Item } from '../../../types/equipment/items';
import type { Spell } from '../../../types/magic/spells';
import type { SystemDefinition } from '../../../registry/types';
import {
  applyDnd5eFeatTemplate,
  getDnd5eFeatAutomationRequirements,
  removeDnd5eFeatTemplate,
} from '../../../utils/featTemplate';
import {
  applyDnd5eFeatureOptionSelection,
  removeDnd5eFeatureOptionSelection,
} from '../../../utils/dnd5eFeatureOptions';
import {
  optionDisabledForRequirement,
  resolveFeatSelections,
  toEquippedItem,
} from './dnd5eSheetShared';
import type { Dnd5eSheetMutators, Dnd5eLikeDataModel } from './dnd5eSheetShared';

interface UseDnd5eSheetActionHandlersProps<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  system: T;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  enableWeaponMasteries: boolean;
  weaponMasteries: string[];
  alwaysPreparedSpellIds: Set<string>;
  preparedCasterCount: number;
  singlePreparedCasterLimit?: number;
  systemDef?: SystemDefinition<SystemDataModel>;
  replaceDocument: Dnd5eSheetMutators<T>['replaceDocument'];
  replaceSystem: Dnd5eSheetMutators<T>['replaceSystem'];
  update: Dnd5eSheetMutators<T>['update'];
}

type HitPointsPatch = {
  current?: number;
  max?: number;
};

type InventoryBrowserItem = {
  id: string;
  name: string;
  quantity: number;
  description?: string;
};

type PersonalityField = 'traits' | 'ideals' | 'bonds' | 'flaws';

export function useDnd5eSheetActionHandlers<T extends Dnd5eLikeDataModel>({
  document,
  system,
  onUpdate,
  enableWeaponMasteries,
  weaponMasteries,
  alwaysPreparedSpellIds,
  preparedCasterCount,
  singlePreparedCasterLimit,
  systemDef,
  replaceDocument,
  replaceSystem,
  update,
}: UseDnd5eSheetActionHandlersProps<T>) {
  const [featTemplateError, setFeatTemplateError] = useState<string | null>(null);
  const [featureOptionError, setFeatureOptionError] = useState<string | null>(null);

  const runFeatTemplateUpdate = useCallback(
    (updater: () => CharacterDocument<T>) => {
      try {
        setFeatTemplateError(null);
        replaceDocument(updater());
      } catch (error) {
        setFeatTemplateError(
          error instanceof Error ? error.message : 'Unable to update feat automation.'
        );
      }
    },
    [replaceDocument]
  );

  const toggleSkillProficiency = useCallback(
    (skillId: string) => {
      const current = system.skillProficiencies[skillId]?.level || 'none';
      let next: 'none' | 'proficient' | 'expertise' = 'none';
      if (current === 'none') next = 'proficient';
      else if (current === 'proficient') next = 'expertise';

      const nextProficiencies = { ...system.skillProficiencies };
      if (next === 'none') {
        delete nextProficiencies[skillId];
      } else {
        nextProficiencies[skillId] = { level: next, source: ['manual'] };
      }

      update({ skillProficiencies: nextProficiencies } as Partial<T>);
    },
    [system.skillProficiencies, update]
  );

  const toggleSaveProficiency = useCallback(
    (abilityId: string) => {
      const hasProficiency = system.savingThrowProficiencies.includes(abilityId);
      update({
        savingThrowProficiencies: hasProficiency
          ? system.savingThrowProficiencies.filter((entry) => entry !== abilityId)
          : [...system.savingThrowProficiencies, abilityId],
      } as Partial<T>);
    },
    [system.savingThrowProficiencies, update]
  );

  const handleFeatureUse = useCallback(
    (featureId: string, delta: number) => {
      update({
        features: system.features.map((feature) => {
          if (!feature.uses || feature.id !== featureId) {
            return feature;
          }

          return {
            ...feature,
            uses: {
              ...feature.uses,
              current: Math.max(0, Math.min(feature.uses.max, feature.uses.current + delta)),
            },
          };
        }),
      } as Partial<T>);
    },
    [system.features, update]
  );

  const handleHitDiceChange = useCallback(
    (index: number, delta: number) => {
      update({
        hitDice: system.hitDice.map((pool, poolIndex) =>
          poolIndex === index
            ? {
                ...pool,
                remaining: Math.max(0, Math.min(pool.total, pool.remaining + delta)),
              }
            : pool
        ),
      } as Partial<T>);
    },
    [system.hitDice, update]
  );

  const handleHitPointsChange = useCallback(
    (patch: HitPointsPatch) => {
      update({
        hitPoints: {
          ...system.hitPoints,
          ...(patch.current != null ? { current: patch.current } : {}),
          ...(patch.max != null ? { max: patch.max } : {}),
        },
      } as Partial<T>);
    },
    [system.hitPoints, update]
  );

  const handleExhaustionChange = useCallback(
    (exhaustionLevel: number) => {
      update({ exhaustionLevel } as Partial<T>);
    },
    [update]
  );

  const handleDeathSavesChange = useCallback(
    (deathSaves: DeathSaves) => {
      update({ deathSaves } as Partial<T>);
    },
    [update]
  );

  const handleSpellSlotChange = useCallback(
    (level: number, delta: number) => {
      if (!system.spellcasting) {
        return;
      }

      const slot = system.spellcasting.spellSlots[level as keyof SpellSlots];
      const nextUsed = Math.max(0, Math.min(slot.max, slot.used + delta));

      update({
        spellcasting: {
          ...system.spellcasting,
          spellSlots: {
            ...system.spellcasting.spellSlots,
            [level]: { ...slot, used: nextUsed },
          },
        },
      } as Partial<T>);
    },
    [system.spellcasting, update]
  );

  const handleDamageHeal = useCallback(
    (amount: number, type: 'damage' | 'heal') => {
      if (!systemDef || !onUpdate) {
        return;
      }

      const nextDocument = systemDef.engine.applyDamage(
        document as CharacterDocument<SystemDataModel>,
        type === 'damage' ? amount : -amount,
        type === 'damage' ? 'damage' : 'healing'
      );
      onUpdate({ ...nextDocument, updatedAt: new Date() });
    },
    [document, onUpdate, systemDef]
  );

  const handleEquipmentSelect = useCallback(
    (item: Item) => {
      const existingInventoryIndex = system.inventory.findIndex(
        (entry) => entry.itemId === item.id
      );
      const nextInventory =
        existingInventoryIndex >= 0
          ? system.inventory.map((entry, index) =>
              index === existingInventoryIndex ? { ...entry, quantity: entry.quantity + 1 } : entry
            )
          : [...system.inventory, { itemId: item.id, quantity: 1, customName: item.name }];

      const equippedItem = toEquippedItem(item);
      const nextEquipment = equippedItem
        ? [...system.equipment.filter((entry) => entry.slot !== equippedItem.slot), equippedItem]
        : system.equipment;

      update({
        inventory: nextInventory,
        equipment: nextEquipment,
      } as Partial<T>);
    },
    [system.equipment, system.inventory, update]
  );

  const handleCurrencyChange = useCallback(
    (currency: Record<string, number>) => {
      update({ currency: currency as unknown as Currency } as Partial<T>);
    },
    [update]
  );

  const handleUnequip = useCallback(
    (itemId: string) => {
      update({
        equipment: system.equipment.filter((entry) => entry.itemId !== itemId),
      } as Partial<T>);
    },
    [system.equipment, update]
  );

  const handleToggleAttune = useCallback(
    (itemId: string) => {
      update({
        equipment: system.equipment.map((entry) =>
          entry.itemId === itemId ? { ...entry, attuned: !entry.attuned } : entry
        ),
      } as Partial<T>);
    },
    [system.equipment, update]
  );

  const handleAddInventoryItem = useCallback(
    (item: InventoryBrowserItem) => {
      update({
        inventory: [
          ...system.inventory,
          {
            itemId: item.id,
            quantity: item.quantity,
            customName: item.name,
            notes: item.description,
          },
        ],
      } as Partial<T>);
    },
    [system.inventory, update]
  );

  const handleRemoveInventoryItem = useCallback(
    (itemId: string) => {
      update({
        inventory: system.inventory.filter((entry) => entry.itemId !== itemId),
      } as Partial<T>);
    },
    [system.inventory, update]
  );

  const handleSpellSelect = useCallback(
    (spell: Spell) => {
      if (
        !system.spellcasting ||
        system.spellcasting.spellsKnown.includes(spell.id) ||
        alwaysPreparedSpellIds.has(spell.id)
      ) {
        return;
      }

      update({
        spellcasting: {
          ...system.spellcasting,
          spellsKnown: [...system.spellcasting.spellsKnown, spell.id],
        },
      } as Partial<T>);
    },
    [alwaysPreparedSpellIds, system.spellcasting, update]
  );

  const handleTogglePreparedSpell = useCallback(
    (spellId: string) => {
      if (!onUpdate || !system.spellcasting) {
        return;
      }

      if (preparedCasterCount === 0 || alwaysPreparedSpellIds.has(spellId)) {
        return;
      }

      const currentPreparedSpells = system.spellcasting.spellsPrepared.filter(
        (entry) => !alwaysPreparedSpellIds.has(entry)
      );
      const isPrepared = currentPreparedSpells.includes(spellId);
      if (
        !isPrepared &&
        singlePreparedCasterLimit != null &&
        currentPreparedSpells.length >= singlePreparedCasterLimit
      ) {
        return;
      }

      const nextPrepared = isPrepared
        ? currentPreparedSpells.filter((entry) => entry !== spellId)
        : [...currentPreparedSpells, spellId];
      update({
        spellcasting: {
          ...system.spellcasting,
          spellsPrepared: nextPrepared,
        },
      } as Partial<T>);
    },
    [
      alwaysPreparedSpellIds,
      onUpdate,
      preparedCasterCount,
      singlePreparedCasterLimit,
      system.spellcasting,
      update,
    ]
  );

  const handleFeatSelect = useCallback(
    (feat: FeatDefinition) => {
      runFeatTemplateUpdate(() => applyDnd5eFeatTemplate(document, feat));
    },
    [document, runFeatTemplateUpdate]
  );

  const handleFeatRemove = useCallback(
    (featId: string) => {
      runFeatTemplateUpdate(() => removeDnd5eFeatTemplate(document, featId));
    },
    [document, runFeatTemplateUpdate]
  );

  const handleFeatSelectionChange = useCallback(
    (
      featDefinition: FeatDefinition,
      featId: string,
      requirementId: string,
      selectionIndex: number,
      value: string
    ) => {
      const feat = system.feats.find((entry) => entry.id === featId);
      if (!feat) {
        return;
      }

      runFeatTemplateUpdate(() => {
        const baseDocument = removeDnd5eFeatTemplate(document, featId);
        const requirements = getDnd5eFeatAutomationRequirements(featDefinition);
        const requirement = requirements.find((entry) => entry.id === requirementId);
        if (!requirement) {
          return document;
        }

        const resolvedSelections = resolveFeatSelections(
          featDefinition,
          feat,
          baseDocument.system.baseAttributes
        );
        const nextRequirementSelections = [...(resolvedSelections[requirementId] || [])];

        while (nextRequirementSelections.length < requirement.count) {
          nextRequirementSelections.push('');
        }

        nextRequirementSelections[selectionIndex] = value;

        return applyDnd5eFeatTemplate(baseDocument, featDefinition, {
          ...resolvedSelections,
          [requirementId]: nextRequirementSelections.filter(Boolean),
        });
      });
    },
    [document, runFeatTemplateUpdate, system.feats]
  );

  const handleFeatureOptionSelect = useCallback(
    (option: Dnd5eFeatureOptionDefinition) => {
      setFeatureOptionError(null);
      replaceSystem(applyDnd5eFeatureOptionSelection(system, option) as T);
    },
    [replaceSystem, system]
  );

  const handleFeatureOptionRemove = useCallback(
    (selection: Dnd5eFeatureOptionSelection) => {
      setFeatureOptionError(null);
      replaceSystem(removeDnd5eFeatureOptionSelection(system, selection) as T);
    },
    [replaceSystem, system]
  );

  const toggleWeaponMastery = useCallback(
    (mastery: string) => {
      if (!enableWeaponMasteries) {
        return;
      }

      const normalized = mastery.toLowerCase();
      const nextMasteries = weaponMasteries.includes(normalized)
        ? weaponMasteries.filter((entry) => entry !== normalized)
        : [...weaponMasteries, normalized];

      update({ weaponMasteries: nextMasteries } as Partial<T>);
    },
    [enableWeaponMasteries, update, weaponMasteries]
  );

  const recoverAllSpellSlots = useCallback(() => {
    if (!system.spellcasting) {
      return;
    }

    const refreshedSlots = Object.fromEntries(
      Object.entries(system.spellcasting.spellSlots).map(([level, slot]) => [
        level,
        { ...slot, used: 0 },
      ])
    ) as SpellSlots;

    update({
      spellcasting: { ...system.spellcasting, spellSlots: refreshedSlots },
    } as Partial<T>);
  }, [system.spellcasting, update]);

  const handlePersonalityPatch = useCallback(
    (patch: PersonalityInfo) => {
      update({
        personality: {
          ...(system.personality ?? {}),
          ...patch,
        },
      } as Partial<T>);
    },
    [system.personality, update]
  );

  const handleAppearanceChange = useCallback(
    (appearance: string) => {
      handlePersonalityPatch({ appearance });
    },
    [handlePersonalityPatch]
  );

  const handleBackstoryChange = useCallback(
    (backstory: string) => {
      handlePersonalityPatch({ backstory });
    },
    [handlePersonalityPatch]
  );

  const handlePersonalityFieldChange = useCallback(
    (field: PersonalityField, value: string) => {
      handlePersonalityPatch({ [field]: value });
    },
    [handlePersonalityPatch]
  );

  const handleNotesChange = useCallback(
    (notes: string) => {
      update({ notes } as Partial<T>);
    },
    [update]
  );

  return {
    featTemplateError,
    featureOptionError,
    toggleSkillProficiency,
    toggleSaveProficiency,
    handleFeatureUse,
    handleHitDiceChange,
    handleHitPointsChange,
    handleExhaustionChange,
    handleDeathSavesChange,
    handleSpellSlotChange,
    handleDamageHeal,
    handleEquipmentSelect,
    handleCurrencyChange,
    handleUnequip,
    handleToggleAttune,
    handleAddInventoryItem,
    handleRemoveInventoryItem,
    handleSpellSelect,
    handleTogglePreparedSpell,
    handleFeatSelect,
    handleFeatRemove,
    handleFeatSelectionChange,
    handleFeatureOptionSelect,
    handleFeatureOptionRemove,
    toggleWeaponMastery,
    recoverAllSpellSlots,
    handleAppearanceChange,
    handleBackstoryChange,
    handlePersonalityFieldChange,
    handleNotesChange,
    resolveFeatSelections,
    optionDisabledForRequirement,
  };
}
