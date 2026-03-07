// D&D 3.5e Prestige Class: Assassin

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const assassinFeatures: Feature[] = [
  {
    id: 'assassinate-35e',
    name: 'Assassinate',
    description: 'The assassin can make a special melee attack to instantly kill a target.',
    source: 'DMG',
  },
  {
    id: 'death-attack-35e',
    name: 'Death Attack',
    description: 'The assassin can deliver a death attack against a helpless or unaware target.',
    source: 'DMG',
  },
  {
    id: 'poison-use-35e',
    name: 'Poison Use',
    description: 'The assassin can use poisons without risk of poisoning themselves.',
    source: 'DMG',
  },
  {
    id: 'uncanny-dodge-35e',
    name: 'Uncanny Dodge',
    description: 'The assassin can react to danger before their senses would normally allow.',
    source: 'DMG',
  },
  {
    id: 'improved-uncanny-dodge-35e',
    name: 'Improved Uncanny Dodge',
    description: 'The assassin cannot be flanked.',
    source: 'DMG',
  },
  {
    id: 'hide-in-plain-sight-35e',
    name: 'Hide in Plain Sight',
    description: 'The assassin can hide even when being observed.',
    source: 'DMG',
  },
];

export const assassin: CharacterClass = {
  id: 'assassin-35e',
  name: 'Assassin',
  system: 'dnd-3.5e',
  source: 'DMG',
  description:
    'An assassin is a highly trained killer who specializes in eliminating targets with precision and stealth.',
  hitDie: 'd6',
  primaryAbility: ['dex', 'int'],
  savingThrowProficiencies: ['dex'],
  armorProficiencies: ['light armor'],
  weaponProficiencies: ['simple weapons', 'hand crossbow', 'rapier', 'shortsword'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'Balance',
      'Climb',
      'Decipher Script',
      'Disable Device',
      'Disguise',
      'Escape Artist',
      'Forgery',
      'Gather Information',
      'Hide',
      'Jump',
      'Listen',
      'Move Silently',
      'Open Lock',
      'Search',
      'Sense Motive',
      'Sleight of Hand',
      'Spot',
      'Tumble',
      'Use Magic Device',
      'Use Rope',
    ],
    label: 'Choose 4 class skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [assassinFeatures[0], assassinFeatures[1]] },
    { level: 2, features: [assassinFeatures[2]] },
    { level: 3, features: [assassinFeatures[3]] },
    { level: 5, features: [assassinFeatures[4]] },
    { level: 8, features: [assassinFeatures[5]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
