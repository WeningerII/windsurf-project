import { Weapon, Armor, Shield, Item } from '../../../../types/equipment/items';
import { indexById } from '../../../../utils/indexById';
import { dnd5eWeapons } from './weapons';
import { dnd5eArmor, dnd5eShields } from './armor';
import { dnd5eAdventuringGear } from './adventuring-gear';
import { dnd5eMagicItems } from './magic-items';

// All equipment combined
export const dnd5eEquipment: (Weapon | Armor | Shield | Item)[] = [
  ...dnd5eWeapons,
  ...dnd5eArmor,
  ...dnd5eShields,
  ...dnd5eAdventuringGear,
  ...dnd5eMagicItems,
];

// By category
export const dnd5eEquipmentByType = {
  weapons: dnd5eWeapons,
  armor: dnd5eArmor,
  shields: dnd5eShields,
  adventuringGear: dnd5eAdventuringGear,
  magicItems: dnd5eMagicItems,
};

// Index by ID (dev-warns on duplicate ids)
export const dnd5eEquipmentById: Record<string, Weapon | Armor | Shield | Item> = indexById(
  dnd5eEquipment,
  'dnd5eEquipmentById'
);

// Weapons by category
export const dnd5eWeaponsByType = {
  simpleMelee: dnd5eWeapons.filter((w) => w.weaponType === 'simple' && w.category === 'melee'),
  simpleRanged: dnd5eWeapons.filter((w) => w.weaponType === 'simple' && w.category === 'ranged'),
  martialMelee: dnd5eWeapons.filter((w) => w.weaponType === 'martial' && w.category === 'melee'),
  martialRanged: dnd5eWeapons.filter((w) => w.weaponType === 'martial' && w.category === 'ranged'),
};

// Armor by type
export const dnd5eArmorByType = {
  light: dnd5eArmor.filter((a) => a.armorType === 'light'),
  medium: dnd5eArmor.filter((a) => a.armorType === 'medium'),
  heavy: dnd5eArmor.filter((a) => a.armorType === 'heavy'),
};

// Statistics
export const equipmentStats = {
  total: dnd5eEquipment.length,
  weapons: {
    total: dnd5eWeapons.length,
    simpleMelee: dnd5eWeaponsByType.simpleMelee.length,
    simpleRanged: dnd5eWeaponsByType.simpleRanged.length,
    martialMelee: dnd5eWeaponsByType.martialMelee.length,
    martialRanged: dnd5eWeaponsByType.martialRanged.length,
  },
  armor: {
    total: dnd5eArmor.length,
    light: dnd5eArmorByType.light.length,
    medium: dnd5eArmorByType.medium.length,
    heavy: dnd5eArmorByType.heavy.length,
  },
  shields: dnd5eShields.length,
  adventuringGear: dnd5eAdventuringGear.length,
};

// Export individual categories
export { dnd5eWeapons, dnd5eArmor, dnd5eShields, dnd5eAdventuringGear, dnd5eMagicItems };

// Category-specific magic item exports
export * from './magic-weapons';
export * from './magic-armor';
export * from './potions';
export * from './wondrous-items';

// Helper functions
export function getEquipmentById(id: string): (Weapon | Armor | Shield | Item) | undefined {
  return dnd5eEquipmentById[id];
}

export function getWeaponsByProperty(property: string): Weapon[] {
  return dnd5eWeapons.filter((w) => w.properties.some((p) => p === property));
}

export function getArmorByMaxAC(): Armor[] {
  return [...dnd5eArmor].sort((a, b) => b.armorClass - a.armorClass);
}

export function getEquipmentByPriceRange(
  min: number,
  max: number,
  currency: 'cp' | 'sp' | 'gp' | 'pp' = 'gp'
): (Weapon | Armor | Shield | Item)[] {
  return dnd5eEquipment.filter((item) => {
    if (item.cost.currency !== currency) return false;
    return item.cost.amount >= min && item.cost.amount <= max;
  });
}
