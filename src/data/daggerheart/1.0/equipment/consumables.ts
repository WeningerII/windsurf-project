import type { DaggerheartConsumable } from '../../../../types/daggerheart';
import { stripDiacritics } from '../../../../utils/unicode';

const source = 'Daggerheart SRD 1.0';
const sourceBook = {
  name: 'System Reference Document 1.0',
  url: 'https://www.daggerheart.com/srd/',
};
const lastUpdated = '2026-03-09';

function slugify(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function consumable(name: string, description: string, tags: string[] = []): DaggerheartConsumable {
  return {
    id: `daggerheart-consumable-${slugify(name)}`,
    name,
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    category: 'consumable',
    maxQuantity: 5,
    description,
    tags,
  };
}

export const daggerheartConsumables: DaggerheartConsumable[] = [
  consumable('Stride Potion', 'You gain a +1 bonus to your next Agility Roll.', ['potion']),
  consumable('Bolster Potion', 'You gain a +1 bonus to your next Strength Roll.', ['potion']),
  consumable('Control Potion', 'You gain a +1 bonus to your next Finesse Roll.', ['potion']),
  consumable('Attune Potion', 'You gain a +1 bonus to your next Instinct Roll.', ['potion']),
  consumable('Charm Potion', 'You gain a +1 bonus to your next Presence Roll.', ['potion']),
  consumable('Enlighten Potion', 'You gain a +1 bonus to your next Knowledge Roll.', ['potion']),
  consumable('Minor Health Potion', 'Clear 1d4 HP.', ['potion', 'healing']),
  consumable('Minor Stamina Potion', 'Clear 1d4 Stress.', ['potion', 'recovery']),
  consumable(
    'Grindletooth Venom',
    'Apply this venom to a physical weapon to add extra damage to your next damage roll with it.',
    ['poison', 'weapon']
  ),
  consumable('Varik Leaves', 'Eat these paired leaves to immediately gain Hope.', ['food', 'hope']),
  consumable(
    'Vial of Moondrip',
    'Drink the contents of this vial to see in total darkness until your next rest.',
    ['utility']
  ),
  consumable(
    'Unstable Arcane Shard',
    'Throw this shard at a group of adversaries within Far range to deal 1d20 magic damage on hits.',
    ['magic', 'thrown']
  ),
  consumable('Potion of Stability', 'Drink this potion to choose one additional downtime move.', [
    'potion',
    'downtime',
  ]),
  consumable(
    'Improved Grindletooth Venom',
    'Apply this stronger venom to a physical weapon to add more extra damage to your next damage roll with it.',
    ['poison', 'weapon']
  ),
  consumable(
    'Jumping Root',
    'Eat this root to leap up to Far range once without needing to roll.',
    ['mobility']
  ),
  consumable('Snap Powder', 'Mark a Stress and clear a HP.', ['recovery']),
  consumable('Health Potion', 'Clear 1d4+1 HP.', ['potion', 'healing']),
  consumable('Stamina Potion', 'Clear 1d4+1 Stress.', ['potion', 'recovery']),
  consumable('Armor Stitcher', 'Spend any number of Hope and clear that many Armor Slots.', [
    'recovery',
    'armor',
  ]),
  consumable(
    'Gill Salve',
    'Apply this salve to your neck to breathe underwater for a number of minutes equal to your level.',
    ['utility']
  ),
  consumable(
    'Replication Parchment',
    'Touch this parchment to another to perfectly copy its contents, then the parchment becomes mundane.',
    ['utility']
  ),
  consumable(
    'Improved Arcane Shard',
    'Throw this shard at a group of adversaries within Far range to deal 2d20 magic damage on hits.',
    ['magic', 'thrown']
  ),
  consumable('Major Stride Potion', 'You gain a +1 bonus to your Agility until your next rest.', [
    'potion',
  ]),
  consumable('Major Bolster Potion', 'You gain a +1 bonus to your Strength until your next rest.', [
    'potion',
  ]),
  consumable('Major Control Potion', 'You gain a +1 bonus to your Finesse until your next rest.', [
    'potion',
  ]),
  consumable('Major Attune Potion', 'You gain a +1 bonus to your Instinct until your next rest.', [
    'potion',
  ]),
  consumable('Major Charm Potion', 'You gain a +1 bonus to your Presence until your next rest.', [
    'potion',
  ]),
  consumable(
    'Major Enlighten Potion',
    'You gain a +1 bonus to your Knowledge until your next rest.',
    ['potion']
  ),
  consumable(
    'Blood of the Yorgi',
    'Drink this blood to disappear and immediately reappear at a point you can see within Very Far range.',
    ['mobility', 'teleport']
  ),
  consumable(
    "Homet's Secret Potion",
    'After drinking this potion, the next successful attack you make critically succeeds.',
    ['potion', 'combat']
  ),
  consumable(
    'Redthorn Saliva',
    'Apply this saliva to a physical weapon to add a d12 to your next damage roll with it.',
    ['poison', 'weapon']
  ),
  consumable(
    'Channelstone',
    'Take a spell or grimoire from your vault, use it once, and return it to your vault.',
    ['vault', 'spell']
  ),
  consumable('Major Health Potion', 'Clear 1d4+2 HP.', ['potion', 'healing']),
  consumable('Major Stamina Potion', 'Clear 1d4+2 Stress.', ['potion', 'recovery']),
  consumable(
    'Ogre Musk',
    'Use this musk to prevent anyone from tracking you by mundane or magical means until your next rest.',
    ['stealth']
  ),
  consumable(
    'Wingsprout',
    'Gain magic wings that let you fly for a number of minutes equal to your level.',
    ['mobility']
  ),
  consumable(
    'Jar of Lost Voices',
    'Open this jar to release a deafening echo of voices that batters nearby creatures with magic damage.',
    ['magic', 'control']
  ),
  consumable(
    'Dragonbloom Tea',
    'Drink this tea to unleash a fiery breath attack against adversaries in front of you.',
    ['fire', 'attack']
  ),
  consumable(
    'Bridge Seed',
    'Thick vines grow from your location to a point within Far range, forming a climbable bridge until your next short rest.',
    ['mobility', 'utility']
  ),
  consumable(
    'Sleeping Sap',
    'Drink this potion to fall asleep for a full night’s rest and clear all Stress upon waking.',
    ['rest', 'recovery']
  ),
  consumable('Feast of Xuria', 'Eat this meal to clear all HP and Stress and gain Hope.', [
    'food',
    'recovery',
  ]),
  consumable('Bonding Honey', 'Use this honey to glue two objects together permanently.', [
    'utility',
  ]),
  consumable(
    'Shrinking Potion',
    'Halve your size until you choose to drop the form or until your next rest, gaining Agility but losing Proficiency.',
    ['potion', 'transformation']
  ),
  consumable(
    'Growing Potion',
    'Double your size until you choose to drop the form or until your next rest, gaining Strength and Proficiency.',
    ['potion', 'transformation']
  ),
  consumable(
    'Knowledge Stone',
    'If you die while holding this stone, an ally can take a card from your loadout to place in their loadout or vault before the stone crumbles.',
    ['domain-card', 'legacy']
  ),
  consumable(
    'Mythic Dust',
    'Apply this dust to a weapon that deals magic damage to add a d20 to your next damage roll with that weapon.',
    ['weapon', 'magic']
  ),
  consumable(
    'Vial of Darksmoke',
    'When attacked, roll d6s equal to your Agility and add the highest result to your Evasion against that attack.',
    ['defense']
  ),
  consumable('Acidpaste', 'This paste eats away walls and other surfaces in bright flashes.', [
    'utility',
  ]),
  consumable(
    'Hopehold Flare',
    'When you use this flare, nearby allies roll a d6 when they spend Hope and may gain the effect without spending it.',
    ['hope', 'support']
  ),
  consumable(
    'Major Arcane Shard',
    'Throw this shard at a group of adversaries within Far range to deal 4d20 magic damage on hits.',
    ['magic', 'thrown']
  ),
  consumable(
    'Featherbone',
    'Use this bone to control your falling speed for a number of minutes equal to your level.',
    ['mobility']
  ),
  consumable(
    'Circle of the Void',
    'Mark a Stress to create a Far-range void where magic cannot be cast and creatures are immune to magic damage.',
    ['magic', 'control']
  ),
  consumable(
    'Sun Tree Sap',
    'Consume this sap for an unpredictable mix of healing, stress relief, or a brush with death.',
    ['recovery', 'magic']
  ),
  consumable('Dripfang Poison', 'A creature that consumes this poison takes direct magic damage.', [
    'poison',
  ]),
];

export const daggerheartConsumablesById = Object.fromEntries(
  daggerheartConsumables.map((entry) => [entry.id, entry])
) as Record<string, DaggerheartConsumable>;

export function getDaggerheartConsumable(id: string): DaggerheartConsumable | undefined {
  return daggerheartConsumablesById[id];
}
