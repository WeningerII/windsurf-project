import { daggerheartArmor } from './armor';
import { daggerheartConsumables } from './consumables';
import { daggerheartLoot } from './loot';
import { daggerheartWeapons } from './weapons';

export * from './armor';
export * from './consumables';
export * from './loot';
export * from './weapons';

export const daggerheartEquipment = {
  weapons: daggerheartWeapons,
  armor: daggerheartArmor,
  loot: daggerheartLoot,
  consumables: daggerheartConsumables,
};
