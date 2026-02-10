import { Weapon } from '../../../../types/equipment/items';

// Simple Melee Weapons
export const club: Weapon = {
  id: 'club', name: 'Club', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: [], weight: 3, cost: { amount: 0, currency: 'gp' },
  description: 'A simple wooden club.', requiresAttunement: false,
};

export const dagger: Weapon = {
  id: 'dagger', name: 'Dagger', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['light', 'thrown'], range: { normal: 10, max: 10 }, weight: 1, cost: { amount: 2, currency: 'gp' },
  description: 'A small blade useful for both melee and ranged attacks.', requiresAttunement: false,
};

export const heavyMace: Weapon = {
  id: 'heavy-mace', name: 'Heavy Mace', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'bludgeoning',
  properties: [], weight: 8, cost: { amount: 12, currency: 'gp' },
  description: 'A heavy mace with a flanged head.', requiresAttunement: false,
};

export const lightMace: Weapon = {
  id: 'light-mace', name: 'Light Mace', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: ['light'], weight: 4, cost: { amount: 5, currency: 'gp' },
  description: 'A lighter mace for one-handed use.', requiresAttunement: false,
};

export const morningstar: Weapon = {
  id: 'morningstar', name: 'Morningstar', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'bludgeoning',
  properties: [], weight: 6, cost: { amount: 8, currency: 'gp' },
  description: 'A spiked ball on a handle.', requiresAttunement: false,
};

export const quarterstaff: Weapon = {
  id: 'quarterstaff', name: 'Quarterstaff', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: ['versatile'], weight: 4, cost: { amount: 0, currency: 'gp' },
  description: 'A wooden staff that can strike with both ends.', requiresAttunement: false,
};

export const shortspear: Weapon = {
  id: 'shortspear', name: 'Shortspear', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['thrown'], range: { normal: 20, max: 20 }, weight: 3, cost: { amount: 1, currency: 'gp' },
  description: 'A short spear that can be thrown.', requiresAttunement: false,
};

export const spear: Weapon = {
  id: 'spear', name: 'Spear', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['thrown', 'versatile'], range: { normal: 20, max: 20 }, weight: 6, cost: { amount: 2, currency: 'gp' },
  description: 'A long spear useful for bracing against charges.', requiresAttunement: false,
};

// Simple Ranged Weapons
export const heavyCrossbow: Weapon = {
  id: 'heavy-crossbow', name: 'Heavy Crossbow', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'piercing',
  properties: ['loading'], range: { normal: 120, max: 120 }, weight: 8, cost: { amount: 50, currency: 'gp' },
  description: 'A heavy crossbow that requires significant time to reload.', requiresAttunement: false,
};

export const lightCrossbow: Weapon = {
  id: 'light-crossbow', name: 'Light Crossbow', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['loading'], range: { normal: 80, max: 80 }, weight: 4, cost: { amount: 35, currency: 'gp' },
  description: 'A light crossbow, easier to reload than the heavy variant.', requiresAttunement: false,
};

export const javelin: Weapon = {
  id: 'javelin', name: 'Javelin', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['thrown'], range: { normal: 30, max: 30 }, weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A throwing spear.', requiresAttunement: false,
};

export const sling: Weapon = {
  id: 'sling', name: 'Sling', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: [], range: { normal: 50, max: 50 }, weight: 0, cost: { amount: 0, currency: 'gp' },
  description: 'A simple ranged weapon using bullets.', requiresAttunement: false,
};

// Martial Melee Weapons
export const battleaxe: Weapon = {
  id: 'battleaxe', name: 'Battleaxe', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: [], weight: 6, cost: { amount: 10, currency: 'gp' },
  description: 'A single-headed battle axe.', requiresAttunement: false,
};

export const greatsword: Weapon = {
  id: 'greatsword', name: 'Greatsword', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 2, die: 'd6', notation: '2d6' }, damageType: 'slashing',
  properties: ['two-handed'], weight: 8, cost: { amount: 50, currency: 'gp' },
  description: 'A large two-handed sword.', requiresAttunement: false,
};

export const longsword: Weapon = {
  id: 'longsword', name: 'Longsword', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: [], weight: 4, cost: { amount: 15, currency: 'gp' },
  description: 'A versatile one-handed sword.', requiresAttunement: false,
};

export const rapier: Weapon = {
  id: 'rapier', name: 'Rapier', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['finesse'], weight: 2, cost: { amount: 20, currency: 'gp' },
  description: 'A slender, sharply pointed sword.', requiresAttunement: false,
};

export const scimitar: Weapon = {
  id: 'scimitar', name: 'Scimitar', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: [], weight: 4, cost: { amount: 15, currency: 'gp' },
  description: 'A curved blade favored by desert warriors.', requiresAttunement: false,
};

export const shortsword: Weapon = {
  id: 'shortsword', name: 'Short Sword', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['light'], weight: 2, cost: { amount: 10, currency: 'gp' },
  description: 'A short blade for quick strikes.', requiresAttunement: false,
};

export const warhammer: Weapon = {
  id: 'warhammer', name: 'Warhammer', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'bludgeoning',
  properties: [], weight: 5, cost: { amount: 12, currency: 'gp' },
  description: 'A hammer designed for combat.', requiresAttunement: false,
};

// Martial Ranged Weapons
export const longbow: Weapon = {
  id: 'longbow', name: 'Longbow', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['two-handed'], range: { normal: 100, max: 100 }, weight: 3, cost: { amount: 75, currency: 'gp' },
  description: 'A tall bow designed for long-range shooting.', requiresAttunement: false,
};

export const shortbow: Weapon = {
  id: 'shortbow', name: 'Shortbow', system: 'pf1e', source: 'Core Rulebook', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['two-handed'], range: { normal: 60, max: 60 }, weight: 2, cost: { amount: 30, currency: 'gp' },
  description: 'A shorter bow for faster shooting.', requiresAttunement: false,
};

// Export all weapons
export const pf1eWeapons = {
  club, dagger, heavyMace, lightMace, morningstar, quarterstaff, shortspear, spear,
  heavyCrossbow, lightCrossbow, javelin, sling,
  battleaxe, greatsword, longsword, rapier, scimitar, shortsword, warhammer,
  longbow, shortbow,
};
