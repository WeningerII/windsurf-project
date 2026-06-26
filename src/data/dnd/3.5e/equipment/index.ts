import { dnd35eWeapons } from './weapons';
import { dnd35eArmor, dnd35eShields } from './armor';
import { dnd35eMagicItems } from './magic-items';
import { dnd35eGear } from './gear';
import {
  dnd35eGeneratedWeapons,
  dnd35eGeneratedArmor,
  dnd35eGeneratedShields,
  dnd35eGeneratedGear,
} from './generated';

export * from './armor';
export * from './weapons';
export * from './magic-items';
export * from './gear';
export * from './generated';

export const dnd35eEquipment = {
  weapons: [...dnd35eWeapons, ...dnd35eGeneratedWeapons],
  armor: [...dnd35eArmor, ...dnd35eGeneratedArmor],
  shields: [...dnd35eShields, ...dnd35eGeneratedShields],
  adventuringGear: [...dnd35eGear, ...dnd35eGeneratedGear],
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
