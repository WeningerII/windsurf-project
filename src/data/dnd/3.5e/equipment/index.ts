import { dnd35eWeapons } from './weapons';
import { dnd35eArmor, dnd35eShields } from './armor';
import { dnd35eMagicItems } from './magic-items';
import { dnd35eGear } from './gear';

export * from './armor';
export * from './weapons';
export * from './magic-items';
export * from './gear';

export const dnd35eEquipment = {
  weapons: dnd35eWeapons,
  armor: dnd35eArmor,
  shields: dnd35eShields,
  adventuringGear: dnd35eGear,
  magicItems: dnd35eMagicItems,
};

export const getEquipment = (id: string) => {
  const allEquipment = [
    ...dnd35eEquipment.weapons,
    ...dnd35eEquipment.armor,
    ...dnd35eEquipment.shields,
    ...dnd35eEquipment.adventuringGear,
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mixed equipment types require flexible type
  return allEquipment.find((e: any) => e.id === id);
};
