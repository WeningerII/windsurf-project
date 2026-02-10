import { Weapon } from '../../../../types/equipment/items';

// Simple Melee Weapons
export const club: Weapon = {
  id: 'club', name: 'Club', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: ['thrown'], range: { normal: 10, max: 10 }, weight: 1, cost: { amount: 0, currency: 'gp' },
  description: 'A simple wooden club.', requiresAttunement: false,
};

export const dagger: Weapon = {
  id: 'dagger', name: 'Dagger', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['finesse', 'thrown', 'light'], range: { normal: 10, max: 10 }, weight: 0, cost: { amount: 2, currency: 'sp' },
  description: 'A small blade for melee or ranged attacks.', requiresAttunement: false,
};

export const mace: Weapon = {
  id: 'mace', name: 'Mace', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: [], weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A metal-headed club.', requiresAttunement: false,
};

export const quarterstaff: Weapon = {
  id: 'quarterstaff', name: 'Staff', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['two-handed'], weight: 1, cost: { amount: 0, currency: 'gp' },
  description: 'A wooden staff, two-handed for 1d8.', requiresAttunement: false,
};

export const spear: Weapon = {
  id: 'spear', name: 'Spear', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['thrown'], range: { normal: 20, max: 20 }, weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'A simple piercing polearm.', requiresAttunement: false,
};

// Simple Ranged Weapons
export const crossbow: Weapon = {
  id: 'crossbow', name: 'Crossbow', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['loading', 'two-handed'], range: { normal: 120, max: 120 }, weight: 3, cost: { amount: 3, currency: 'gp' },
  description: 'A mechanical bow that fires bolts.', requiresAttunement: false,
};

export const javelin: Weapon = {
  id: 'javelin', name: 'Javelin', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['thrown'], range: { normal: 30, max: 30 }, weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'A throwing spear.', requiresAttunement: false,
};

export const sling: Weapon = {
  id: 'sling', name: 'Sling', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: [], range: { normal: 50, max: 50 }, weight: 0, cost: { amount: 0, currency: 'gp' },
  description: 'A simple ranged weapon.', requiresAttunement: false,
};

// Martial Melee Weapons
export const battleaxe: Weapon = {
  id: 'battleaxe', name: 'Battle Axe', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: [], weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A heavy axe for battle.', requiresAttunement: false,
};

export const greatsword: Weapon = {
  id: 'greatsword', name: 'Greatsword', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd12', notation: '1d12' }, damageType: 'slashing',
  properties: ['two-handed'], weight: 4, cost: { amount: 2, currency: 'gp' },
  description: 'A massive two-handed sword.', requiresAttunement: false,
};

export const longsword: Weapon = {
  id: 'longsword', name: 'Longsword', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: ['versatile'], weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A versatile one-handed sword.', requiresAttunement: false,
};

export const rapier: Weapon = {
  id: 'rapier', name: 'Rapier', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['finesse'], weight: 1, cost: { amount: 2, currency: 'gp' },
  description: 'A thrusting sword for precise attacks.', requiresAttunement: false,
};

export const shortsword: Weapon = {
  id: 'shortsword', name: 'Shortsword', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['finesse', 'light'], weight: 1, cost: { amount: 9, currency: 'sp' },
  description: 'A short blade for quick attacks.', requiresAttunement: false,
};

export const warhammer: Weapon = {
  id: 'warhammer', name: 'Warhammer', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'bludgeoning',
  properties: [], weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A hammer for combat.', requiresAttunement: false,
};

// Martial Ranged Weapons
export const longbow: Weapon = {
  id: 'longbow', name: 'Longbow', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['two-handed'], range: { normal: 100, max: 100 }, weight: 2, cost: { amount: 6, currency: 'gp' },
  description: 'A tall bow for long-range shots.', requiresAttunement: false,
};

export const shortbow: Weapon = {
  id: 'shortbow', name: 'Shortbow', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['two-handed'], range: { normal: 60, max: 60 }, weight: 1, cost: { amount: 3, currency: 'gp' },
  description: 'A shorter bow for quicker shots.', requiresAttunement: false,
};

export const sickle: Weapon = {
  id: 'sickle', name: 'Sickle', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'slashing',
  properties: ['light', 'finesse'], weight: 1, cost: { amount: 2, currency: 'sp' },
  description: 'A farming tool adapted for combat.', requiresAttunement: false,
};

export const handaxe: Weapon = {
  id: 'handaxe', name: 'Handaxe', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['light', 'thrown'], range: { normal: 20, max: 20 }, weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'A light throwing axe.', requiresAttunement: false,
};

export const lightHammer: Weapon = {
  id: 'light-hammer', name: 'Light Hammer', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['light', 'thrown'], range: { normal: 20, max: 20 }, weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'A small hammer for throwing.', requiresAttunement: false,
};

export const morningstar: Weapon = {
  id: 'morningstar', name: 'Morningstar', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'bludgeoning',
  properties: [], weight: 3, cost: { amount: 8, currency: 'sp' },
  description: 'A spiked club.', requiresAttunement: false,
};

export const dart: Weapon = {
  id: 'dart', name: 'Dart', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['thrown', 'finesse'], range: { normal: 20, max: 20 }, weight: 0, cost: { amount: 5, currency: 'cp' },
  description: 'A small throwing projectile.', requiresAttunement: false,
};

export const flail: Weapon = {
  id: 'flail', name: 'Flail', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'bludgeoning',
  properties: [], weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A spiked ball on a chain.', requiresAttunement: false,
};

export const glaive: Weapon = {
  id: 'glaive', name: 'Glaive', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'slashing',
  properties: ['reach', 'two-handed'], weight: 3, cost: { amount: 8, currency: 'sp' },
  description: 'A pole with a blade.', requiresAttunement: false,
};

export const greataxe: Weapon = {
  id: 'greataxe', name: 'Greataxe', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd12', notation: '1d12' }, damageType: 'slashing',
  properties: ['two-handed'], weight: 4, cost: { amount: 2, currency: 'gp' },
  description: 'A massive two-handed axe.', requiresAttunement: false,
};

export const greatclub: Weapon = {
  id: 'greatclub', name: 'Greatclub', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'bludgeoning',
  properties: ['two-handed'], weight: 5, cost: { amount: 2, currency: 'sp' },
  description: 'A large heavy club.', requiresAttunement: false,
};

export const halberd: Weapon = {
  id: 'halberd', name: 'Halberd', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'slashing',
  properties: ['reach', 'two-handed'], weight: 3, cost: { amount: 1, currency: 'gp' },
  description: 'An axe blade on a pole.', requiresAttunement: false,
};

export const lance: Weapon = {
  id: 'lance', name: 'Lance', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['reach'], weight: 3, cost: { amount: 1, currency: 'gp' },
  description: 'A cavalry weapon.', requiresAttunement: false,
};

export const maul: Weapon = {
  id: 'maul', name: 'Maul', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd12', notation: '1d12' }, damageType: 'bludgeoning',
  properties: ['two-handed'], weight: 5, cost: { amount: 1, currency: 'gp' },
  description: 'A massive hammer.', requiresAttunement: false,
};

export const pick: Weapon = {
  id: 'pick', name: 'Pick', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: [], weight: 3, cost: { amount: 8, currency: 'sp' },
  description: 'A mining tool weaponized.', requiresAttunement: false,
};

export const pike: Weapon = {
  id: 'pike', name: 'Pike', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'piercing',
  properties: ['reach', 'two-handed'], weight: 4, cost: { amount: 1, currency: 'gp' },
  description: 'A long infantry spear.', requiresAttunement: false,
};

export const scimitar: Weapon = {
  id: 'scimitar', name: 'Scimitar', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['finesse', 'light'], weight: 2, cost: { amount: 2, currency: 'gp' },
  description: 'A curved blade.', requiresAttunement: false,
};

export const trident: Weapon = {
  id: 'trident', name: 'Trident', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['thrown'], range: { normal: 20, max: 20 }, weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A three-pronged spear.', requiresAttunement: false,
};

export const warPick: Weapon = {
  id: 'war-pick', name: 'War Pick', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: [], weight: 3, cost: { amount: 5, currency: 'sp' },
  description: 'A heavy piercing weapon.', requiresAttunement: false,
};

export const whip: Weapon = {
  id: 'whip', name: 'Whip', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'slashing',
  properties: ['finesse', 'reach'], weight: 1, cost: { amount: 2, currency: 'sp' },
  description: 'A flexible striking weapon.', requiresAttunement: false,
};

export const blowgun: Weapon = {
  id: 'blowgun', name: 'Blowgun', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['loading'], range: { normal: 25, max: 25 }, weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'A tube for firing darts.', requiresAttunement: false,
};

export const handCrossbow: Weapon = {
  id: 'hand-crossbow', name: 'Hand Crossbow', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['loading', 'light'], range: { normal: 30, max: 30 }, weight: 1, cost: { amount: 7, currency: 'gp' },
  description: 'A small crossbow.', requiresAttunement: false,
};

export const heavyCrossbow: Weapon = {
  id: 'heavy-crossbow', name: 'Heavy Crossbow', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'piercing',
  properties: ['loading', 'two-handed'], range: { normal: 120, max: 120 }, weight: 4, cost: { amount: 5, currency: 'gp' },
  description: 'A powerful crossbow.', requiresAttunement: false,
};

export const net: Weapon = {
  id: 'net', name: 'Net', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['thrown'], range: { normal: 10, max: 10 }, weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'A net for entangling (restrains on hit).', requiresAttunement: false,
};

export const compositeShortbow: Weapon = {
  id: 'composite-shortbow', name: 'Composite Shortbow', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['two-handed'], range: { normal: 70, max: 70 }, weight: 1, cost: { amount: 7, currency: 'gp' },
  description: 'A composite bow for added power.', requiresAttunement: false,
};

export const compositeLongbow: Weapon = {
  id: 'composite-longbow', name: 'Composite Longbow', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['two-handed'], range: { normal: 110, max: 110 }, weight: 2, cost: { amount: 10, currency: 'gp' },
  description: 'A composite longbow.', requiresAttunement: false,
};

export const falchion: Weapon = {
  id: 'falchion', name: 'Falchion', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: [], weight: 3, cost: { amount: 7, currency: 'sp' },
  description: 'A curved single-edged sword.', requiresAttunement: false,
};

export const ranseur: Weapon = {
  id: 'ranseur', name: 'Ranseur', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'piercing',
  properties: ['reach', 'two-handed'], weight: 5, cost: { amount: 1, currency: 'gp' },
  description: 'A polearm with a spearhead.', requiresAttunement: false,
};

export const scythe: Weapon = {
  id: 'scythe', name: 'Scythe', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'slashing',
  properties: ['two-handed'], weight: 5, cost: { amount: 2, currency: 'gp' },
  description: 'A curved blade on a long handle.', requiresAttunement: false,
};

export const spikedChain: Weapon = {
  id: 'spiked-chain', name: 'Spiked Chain', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: ['reach', 'two-handed'], weight: 5, cost: { amount: 2, currency: 'gp' },
  description: 'A length of chain with spikes.', requiresAttunement: false,
};

export const starknife: Weapon = {
  id: 'starknife', name: 'Starknife', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['thrown', 'finesse'], range: { normal: 20, max: 20 }, weight: 1, cost: { amount: 2, currency: 'gp' },
  description: 'A four-pointed throwing blade.', requiresAttunement: false,
};

export const bastardSword: Weapon = {
  id: 'bastard-sword', name: 'Bastard Sword', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'slashing',
  properties: [], weight: 3, cost: { amount: 3, currency: 'gp' },
  description: 'A hand-and-a-half sword.', requiresAttunement: false,
};

export const dwarvenWaraxe: Weapon = {
  id: 'dwarven-waraxe', name: 'Dwarven Waraxe', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'slashing',
  properties: [], weight: 4, cost: { amount: 3, currency: 'gp' },
  description: 'A heavy dwarven axe.', requiresAttunement: false,
};

export const gnomeHookedHammer: Weapon = {
  id: 'gnome-hooked-hammer', name: 'Gnome Hooked Hammer', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: ['two-handed'], weight: 3, cost: { amount: 2, currency: 'gp' },
  description: 'A hammer with a hook.', requiresAttunement: false,
};

export const orcDoubleAxe: Weapon = {
  id: 'orc-double-axe', name: 'Orc Double Axe', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: ['two-handed'], weight: 7, cost: { amount: 6, currency: 'gp' },
  description: 'A double-headed orcish axe.', requiresAttunement: false,
};

export const kama: Weapon = {
  id: 'kama', name: 'Kama', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['light'], weight: 1, cost: { amount: 2, currency: 'sp' },
  description: 'A sickle-like weapon.', requiresAttunement: false,
};

export const nunchaku: Weapon = {
  id: 'nunchaku', name: 'Nunchaku', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: ['light'], weight: 1, cost: { amount: 2, currency: 'sp' },
  description: 'Two sticks connected by chain.', requiresAttunement: false,
};

export const sai: Weapon = {
  id: 'sai', name: 'Sai', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['light'], weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'A pronged truncheon.', requiresAttunement: false,
};

export const siangham: Weapon = {
  id: 'siangham', name: 'Siangham', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: ['light'], weight: 1, cost: { amount: 3, currency: 'sp' },
  description: 'A pointed weapon for monks.', requiresAttunement: false,
};

export const dogslicer: Weapon = {
  id: 'dogslicer', name: 'Dogslicer', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['light'], weight: 1, cost: { amount: 1, currency: 'sp' },
  description: 'A crude goblin blade.', requiresAttunement: false,
};

export const horsechopper: Weapon = {
  id: 'horsechopper', name: 'Horsechopper', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: ['reach'], weight: 4, cost: { amount: 9, currency: 'sp' },
  description: 'A goblin polearm.', requiresAttunement: false,
};

export const kukri: Weapon = {
  id: 'kukri', name: 'Kukri', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'slashing',
  properties: ['light'], weight: 1, cost: { amount: 8, currency: 'sp' },
  description: 'A curved dagger.', requiresAttunement: false,
};

export const cestus: Weapon = {
  id: 'cestus', name: 'Cestus', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['light'], weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'A studded glove.', requiresAttunement: false,
};

export const gauntlet: Weapon = {
  id: 'gauntlet', name: 'Gauntlet', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['light'], weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'An armored glove.', requiresAttunement: false,
};

export const spikedGauntlet: Weapon = {
  id: 'spiked-gauntlet', name: 'Spiked Gauntlet', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['light'], weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'A gauntlet with spikes.', requiresAttunement: false,
};

export const unarmedStrike: Weapon = {
  id: 'unarmed-strike', name: 'Unarmed Strike', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: [], weight: 0, cost: { amount: 0, currency: 'gp' },
  description: 'A punch or kick.', requiresAttunement: false,
};

export const elvenCurveBlade: Weapon = {
  id: 'elven-curve-blade', name: 'Elven Curve Blade', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd10', notation: '1d10' }, damageType: 'slashing',
  properties: ['two-handed'], weight: 3, cost: { amount: 8, currency: 'gp' },
  description: 'A curved elven blade.', requiresAttunement: false,
};

export const earthBreaker: Weapon = {
  id: 'earth-breaker', name: 'Earth Breaker', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd12', notation: '1d12' }, damageType: 'bludgeoning',
  properties: ['two-handed'], weight: 7, cost: { amount: 4, currency: 'gp' },
  description: 'A massive two-handed hammer.', requiresAttunement: false,
};

export const katana: Weapon = {
  id: 'katana', name: 'Katana', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'slashing',
  properties: [], weight: 3, cost: { amount: 5, currency: 'gp' },
  description: 'A curved single-edged blade.', requiresAttunement: false,
};

export const wakizashi: Weapon = {
  id: 'wakizashi', name: 'Wakizashi', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'uncommon', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['light'], weight: 2, cost: { amount: 3, currency: 'gp' },
  description: 'A short companion sword.', requiresAttunement: false,
};

export const chain: Weapon = {
  id: 'chain', name: 'Chain', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['reach'], weight: 2, cost: { amount: 3, currency: 'sp' },
  description: 'A length of chain.', requiresAttunement: false,
};

export const bola: Weapon = {
  id: 'bola', name: 'Bola', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'bludgeoning',
  properties: ['thrown'], range: { normal: 10, max: 10 }, weight: 1, cost: { amount: 5, currency: 'sp' },
  description: 'Weighted cords for entangling.', requiresAttunement: false,
};

export const chakram: Weapon = {
  id: 'chakram', name: 'Chakram', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'uncommon', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['thrown'], range: { normal: 30, max: 30 }, weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'A circular throwing blade.', requiresAttunement: false,
};

export const shuriken: Weapon = {
  id: 'shuriken', name: 'Shuriken', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd4', notation: '1d4' }, damageType: 'piercing',
  properties: ['thrown'], range: { normal: 10, max: 10 }, weight: 0, cost: { amount: 1, currency: 'cp' },
  description: 'Small throwing stars.', requiresAttunement: false,
};

export const throwingAxe: Weapon = {
  id: 'throwing-axe', name: 'Throwing Axe', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'slashing',
  properties: ['thrown'], range: { normal: 10, max: 10 }, weight: 1, cost: { amount: 8, currency: 'sp' },
  description: 'An axe balanced for throwing.', requiresAttunement: false,
};

export const boomerang: Weapon = {
  id: 'boomerang', name: 'Boomerang', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'bludgeoning',
  properties: ['thrown'], range: { normal: 30, max: 30 }, weight: 1, cost: { amount: 3, currency: 'sp' },
  description: 'A curved throwing stick.', requiresAttunement: false,
};

export const atlatl: Weapon = {
  id: 'atlatl', name: 'Atlatl', system: 'pf2e', type: 'weapon', weaponType: 'simple', category: 'ranged',
  rarity: 'common', damage: { count: 1, die: 'd6', notation: '1d6' }, damageType: 'piercing',
  properties: [], range: { normal: 50, max: 50 }, weight: 1, cost: { amount: 2, currency: 'sp' },
  description: 'A spear-throwing device.', requiresAttunement: false,
};

export const boar: Weapon = {
  id: 'boar-spear', name: 'Boar Spear', system: 'pf2e', type: 'weapon', weaponType: 'martial', category: 'melee',
  rarity: 'common', damage: { count: 1, die: 'd8', notation: '1d8' }, damageType: 'piercing',
  properties: ['reach'], weight: 4, cost: { amount: 5, currency: 'sp' },
  description: 'A spear for hunting boar.', requiresAttunement: false,
};

export const pf2eWeapons = {
  club, dagger, mace, quarterstaff, spear, crossbow, javelin, sling,
  sickle, handaxe, lightHammer, morningstar, dart, cestus, gauntlet, spikedGauntlet, unarmedStrike, atlatl,
  battleaxe, greatsword, longsword, rapier, shortsword, warhammer, longbow, shortbow,
  flail, glaive, greataxe, greatclub, halberd, lance, maul, pick, pike, scimitar, trident, warPick, whip,
  blowgun, handCrossbow, heavyCrossbow, net, compositeShortbow, compositeLongbow,
  falchion, ranseur, scythe, spikedChain, starknife, bastardSword, dwarvenWaraxe, gnomeHookedHammer, orcDoubleAxe,
  kama, nunchaku, sai, siangham, dogslicer, horsechopper, kukri,
  elvenCurveBlade, earthBreaker, katana, wakizashi, chain,
  bola, chakram, shuriken, throwingAxe, boomerang, boar,
};
