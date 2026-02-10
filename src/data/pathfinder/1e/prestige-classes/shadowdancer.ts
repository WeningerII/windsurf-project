import { CharacterClass } from '../../../../types/character-options/classes';

export const shadowdancer: CharacterClass = {
  id: 'shadowdancer',
  name: 'Shadowdancer',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: { name: 'Pathfinder Core Rulebook', page: 416, url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/shadowdancer/' },
  hitDie: 'd8',
  primaryAbility: ['dex'],
  savingThrowProficiencies: ['dex', 'wis'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 6,
    options: ['acrobatics', 'bluff', 'escape-artist', 'perception', 'perform', 'sleight-of-hand', 'stealth'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    { level: 1, features: [
      { id: 'hide-in-plain-sight', name: 'Hide in Plain Sight', source: 'Shadowdancer 1', description: 'Hide even when being observed, as long as you are in dim light.' },
      { id: 'shadow-jump', name: 'Shadow Jump', source: 'Shadowdancer 1', description: 'Teleport between shadows up to 20 feet away.' },
    ]},
    { level: 2, features: [
      { id: 'evasion', name: 'Evasion', source: 'Shadowdancer 2', description: 'Avoid damage from area effects by moving quickly.' },
    ]},
    { level: 3, features: [
      { id: 'shadow-illusion', name: 'Shadow Illusion', source: 'Shadowdancer 3', description: 'Create illusions using shadows to confuse enemies.' },
    ]},
    { level: 4, features: [
      { id: 'shadow-jump-2', name: 'Shadow Jump', source: 'Shadowdancer 4', description: 'Increase Shadow Jump range to 40 feet.' },
    ]},
    { level: 5, features: [
      { id: 'shadow-clone', name: 'Shadow Clone', source: 'Shadowdancer 5', description: 'Create a shadow duplicate of yourself to confuse enemies.' },
    ]},
    { level: 7, features: [
      { id: 'shadow-jump-3', name: 'Shadow Jump', source: 'Shadowdancer 7', description: 'Increase Shadow Jump range to 60 feet and can jump between any shadows.' },
    ]},
    { level: 10, features: [
      { id: 'shadow-master', name: 'Shadow Master', source: 'Shadowdancer 10', description: 'Become one with shadows, gaining invisibility in dim light and immunity to light-based effects.' },
    ]},
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A master of shadows who can hide in plain sight and move through darkness with supernatural grace.',
};
