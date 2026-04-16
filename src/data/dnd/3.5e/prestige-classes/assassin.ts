// D&D 3.5e Prestige Class: Assassin

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const assassinFeatures: Feature[] = [
  {
    id: 'death-attack-35e',
    name: 'Death Attack',
    description:
      'If an assassin studies a victim for 3 rounds and then successfully makes a sneak attack, the attack can kill or paralyze the target.',
    source: 'Assassin 1',
  },
  {
    id: 'assassin-sneak-attack-1-35e',
    name: 'Sneak Attack +1d6',
    description:
      'The assassin deals 1d6 extra damage whenever a target is denied its Dexterity bonus to AC or is flanked.',
    source: 'Assassin 1',
  },
  {
    id: 'poison-use-35e',
    name: 'Poison Use',
    description:
      'Assassins are trained in the use of poison and never risk accidentally poisoning themselves.',
    source: 'Assassin 1',
  },
  {
    id: 'assassin-spellcasting-35e',
    name: 'Spellcasting',
    description:
      'Beginning at 1st level, an assassin gains a limited arcane spellcasting progression.',
    source: 'Assassin 1',
  },
  {
    id: 'save-against-poison-1-35e',
    name: 'Save Against Poison +1',
    description: 'The assassin gains a +1 natural bonus on saving throws against poison.',
    source: 'Assassin 2',
  },
  {
    id: 'uncanny-dodge-35e',
    name: 'Uncanny Dodge',
    description: 'The assassin retains their Dexterity bonus to AC even when caught flat-footed.',
    source: 'Assassin 2',
  },
  {
    id: 'assassin-sneak-attack-2-35e',
    name: 'Sneak Attack +2d6',
    description: 'The assassin’s sneak attack damage improves to +2d6.',
    source: 'Assassin 3',
  },
  {
    id: 'save-against-poison-2-35e',
    name: 'Save Against Poison +2',
    description: 'The assassin’s natural bonus on saving throws against poison improves to +2.',
    source: 'Assassin 4',
  },
  {
    id: 'assassin-sneak-attack-3-35e',
    name: 'Sneak Attack +3d6',
    description: 'The assassin’s sneak attack damage improves to +3d6.',
    source: 'Assassin 5',
  },
  {
    id: 'improved-uncanny-dodge-35e',
    name: 'Improved Uncanny Dodge',
    description:
      'The assassin can no longer be flanked except by a rogue at least four levels higher.',
    source: 'Assassin 5',
  },
  {
    id: 'save-against-poison-3-35e',
    name: 'Save Against Poison +3',
    description: 'The assassin’s natural bonus on saving throws against poison improves to +3.',
    source: 'Assassin 6',
  },
  {
    id: 'assassin-sneak-attack-4-35e',
    name: 'Sneak Attack +4d6',
    description: 'The assassin’s sneak attack damage improves to +4d6.',
    source: 'Assassin 7',
  },
  {
    id: 'save-against-poison-4-35e',
    name: 'Save Against Poison +4',
    description: 'The assassin’s natural bonus on saving throws against poison improves to +4.',
    source: 'Assassin 8',
  },
  {
    id: 'hide-in-plain-sight-35e',
    name: 'Hide in Plain Sight',
    description:
      'The assassin can use the Hide skill even while observed, so long as they are within 10 feet of some sort of shadow.',
    source: 'Assassin 8',
  },
  {
    id: 'assassin-sneak-attack-5-35e',
    name: 'Sneak Attack +5d6',
    description: 'The assassin’s sneak attack damage improves to +5d6.',
    source: 'Assassin 9',
  },
  {
    id: 'save-against-poison-5-35e',
    name: 'Save Against Poison +5',
    description: 'The assassin’s natural bonus on saving throws against poison improves to +5.',
    source: 'Assassin 10',
  },
];

const zeroSlots = () => Array<number>(20).fill(0);

const assassinSpellSlots = {
  1: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  2: [0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  3: [0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  4: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  5: zeroSlots(),
  6: zeroSlots(),
  7: zeroSlots(),
  8: zeroSlots(),
  9: zeroSlots(),
};

export const assassin: CharacterClass = {
  id: 'assassin-35e',
  name: 'Assassin',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-08',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/assassin.htm',
  },
  description:
    'A stealthy killer who mixes subterfuge, poison, sneak attacks, and limited arcane magic.',
  hitDie: 'd6',
  primaryAbility: ['dex', 'int'],
  savingThrowProficiencies: ['dex', 'int'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'hand-crossbow', 'rapier', 'short-sword'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'balance',
      'bluff',
      'climb',
      'craft',
      'decipher-script',
      'diplomacy',
      'disable-device',
      'disguise',
      'escape-artist',
      'forgery',
      'gather-info',
      'hide',
      'intimidate',
      'jump',
      'listen',
      'move-silently',
      'open-lock',
      'search',
      'sense-motive',
      'sleight-of-hand',
      'spot',
      'swim',
      'tumble',
      'use-magic',
      'use-rope',
    ],
    label: 'Choose four skills',
  },
  equipmentChoices: [],
  features: [
    {
      level: 1,
      features: [
        assassinFeatures[0],
        assassinFeatures[1],
        assassinFeatures[2],
        assassinFeatures[3],
      ],
    },
    { level: 2, features: [assassinFeatures[4], assassinFeatures[5]] },
    { level: 3, features: [assassinFeatures[6]] },
    { level: 4, features: [assassinFeatures[7]] },
    { level: 5, features: [assassinFeatures[8], assassinFeatures[9]] },
    { level: 6, features: [assassinFeatures[10]] },
    { level: 7, features: [assassinFeatures[11]] },
    { level: 8, features: [assassinFeatures[12], assassinFeatures[13]] },
    { level: 9, features: [assassinFeatures[14]] },
    { level: 10, features: [assassinFeatures[15]] },
  ],
  subclassLevel: 20,
  subclasses: [],
  spellcasting: {
    ability: 'int',
    spellListId: 'dnd35e-assassin',
    spellSlots: assassinSpellSlots,
    ritualCasting: false,
    multiclassCasterLevel: 'none',
  },
};
