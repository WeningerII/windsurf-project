import type { FeatDefinition } from '../../../types/character-options/feats';
import type { Dnd5eFeatureOptionSelection } from '../../../types/character-options/feature-options';
import type { EquippedItem, Feat } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import type { Armor, Item, Shield as ShieldItem } from '../../../types/equipment/items';
import type { Dnd5eFeatChoiceRequirement, Dnd5eFeatSelections } from '../../../utils/featTemplate';
import {
  createDefaultDnd5eFeatSelections,
  getCurrentDnd5eFeatSelections,
  getDnd5eFeatAutomationRequirements,
} from '../../../utils/featTemplate';
import { Dnd5e2024DataModel } from '../../dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../data-model';

export type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

export interface Dnd5eSheetMutators<T extends Dnd5eLikeDataModel> {
  replaceDocument: (nextDocument: CharacterDocument<T>) => void;
  replaceSystem: (nextSystem: T) => void;
  update: (patch: Partial<T>) => void;
}

function resolveEquipmentSlot(item: Item): EquippedItem['slot'] | null {
  switch (item.type) {
    case 'armor':
      return 'chest';
    case 'shield':
      return 'offHand';
    case 'weapon':
      return 'mainHand';
    default:
      return null;
  }
}

export function toEquippedItem(item: Item): EquippedItem | null {
  const slot = resolveEquipmentSlot(item);
  if (!slot) {
    return null;
  }

  const equippedItem: EquippedItem = {
    itemId: item.id,
    slot,
    attuned: item.requiresAttunement,
    customName: item.name,
  };

  if (item.type === 'armor') {
    const armor = item as Armor;
    equippedItem.armorClass = armor.armorClass;
    equippedItem.armorType = armor.armorType;
    equippedItem.dexBonusMax = armor.dexBonusMax;
  }

  if (item.type === 'shield') {
    equippedItem.shieldBonus = (item as ShieldItem).armorClassBonus;
  }

  return equippedItem;
}

function countSelections(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

export function resolveFeatSelections(
  featDefinition: FeatDefinition,
  feat: Feat,
  baseAttributes: Record<string, number>
): Dnd5eFeatSelections {
  const currentSelections = getCurrentDnd5eFeatSelections(featDefinition, feat);
  const defaultSelections = createDefaultDnd5eFeatSelections(featDefinition, baseAttributes);
  const requirements = getDnd5eFeatAutomationRequirements(featDefinition);

  return Object.fromEntries(
    requirements.map((requirement) => {
      const currentValues = currentSelections[requirement.id] || [];
      return [
        requirement.id,
        currentValues.length === requirement.count
          ? currentValues
          : defaultSelections[requirement.id] || [],
      ];
    })
  ) as Dnd5eFeatSelections;
}

export function optionDisabledForRequirement(
  requirement: Dnd5eFeatChoiceRequirement,
  selections: string[],
  selectionIndex: number,
  optionId: string
): boolean {
  const currentValue = selections[selectionIndex];
  if (currentValue === optionId) {
    return false;
  }

  return (countSelections(selections)[optionId] || 0) >= requirement.maxPerOption;
}

export function featureOptionSelectionKey(
  selection: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>
): string {
  return `${selection.group}:${selection.id}`;
}
