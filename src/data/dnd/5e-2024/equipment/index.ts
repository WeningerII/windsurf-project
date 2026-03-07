import { Item } from '../../../../types/equipment/items';
import { dnd5e2024Weapons } from './weapons';
import { dnd5e2024Armor } from './armor';
import { dnd5e2024Gear } from './adventuring-gear';
import { dnd5e2024MagicItems } from './magic-items';

export const dnd5e2024Equipment: Item[] = [
  ...dnd5e2024Weapons,
  ...dnd5e2024Armor,
  ...dnd5e2024Gear,
  ...dnd5e2024MagicItems,
];

export const getEquipment = (id: string): Item | undefined => {
  return dnd5e2024Equipment.find((item) => item.id === id);
};

export { dnd5e2024Weapons, dnd5e2024Armor, dnd5e2024Gear, dnd5e2024MagicItems };
