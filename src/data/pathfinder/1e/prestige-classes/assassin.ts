import { CharacterClass } from '../../../../types/character-options/classes';

export const assassin: CharacterClass = {
  id: 'assassin',
  name: 'Assassin',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 384,
    url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/assassin/'
  },
  hitDie: 'd8',
  primaryAbility: ['dex', 'int'],
  savingThrowProficiencies: ['dex', 'int'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: ['acrobatics', 'climb', 'disable-device', 'disguise', 'escape-artist', 'perception', 'sleight-of-hand', 'stealth'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    { level: 1, features: [
      { id: 'assassinate', name: 'Assassinate', source: 'Assassin 1', description: 'Instantly kill a target with a successful sneak attack.' },
      { id: 'death-attack', name: 'Death Attack', source: 'Assassin 1', description: 'Study a target to deliver a deadly strike.' },
    ]},
    { level: 2, features: [
      { id: 'poison-use', name: 'Poison Use', source: 'Assassin 2', description: 'Gain proficiency with poisons and toxins.' },
    ]},
    { level: 3, features: [
      { id: 'uncanny-dodge', name: 'Uncanny Dodge', source: 'Assassin 3', description: 'React instinctively to danger, gaining +2 to AC against attacks you can see.' },
    ]},
    { level: 4, features: [
      { id: 'death-attack-2', name: 'Death Attack', source: 'Assassin 4', description: 'Improve Death Attack, increasing damage by 1d6.' },
    ]},
    { level: 5, features: [
      { id: 'improved-assassination', name: 'Improved Assassination', source: 'Assassin 5', description: 'Assassination attacks deal additional damage and have increased critical threat range.' },
    ]},
    { level: 7, features: [
      { id: 'master-assassin', name: 'Master Assassin', source: 'Assassin 7', description: 'Gain +2 to attack rolls and damage with assassination attacks.' },
    ]},
    { level: 10, features: [
      { id: 'death-incarnate', name: 'Death Incarnate', source: 'Assassin 10', description: 'Become death itself, gaining immunity to poison and the ability to instantly kill with a touch.' },
    ]},
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A master of death and assassination who can instantly kill targets with precise strikes and deadly poisons.',
};
