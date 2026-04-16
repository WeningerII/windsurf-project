// D&D 3.5e Prestige Class: Blackguard

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const blackguardFeatures: Feature[] = [
  {
    id: 'aura-of-evil-35e',
    name: 'Aura of Evil',
    description:
      'A blackguard radiates a powerful evil aura that is as strong as the aura of a cleric of equal level devoted to an evil deity.',
    source: 'Blackguard 1',
  },
  {
    id: 'detect-good-35e',
    name: 'Detect Good',
    description: 'At will, a blackguard can use detect good as the spell.',
    source: 'Blackguard 1',
  },
  {
    id: 'blackguard-poison-use-35e',
    name: 'Poison Use',
    description:
      'A blackguard is skilled in the use of poison and never risks accidentally poisoning themselves.',
    source: 'Blackguard 1',
  },
  {
    id: 'dark-blessing-35e',
    name: 'Dark Blessing',
    description:
      'The blackguard adds their Charisma bonus, if any, as a bonus on all saving throws.',
    source: 'Blackguard 2',
  },
  {
    id: 'blackguard-smite-good-1-35e',
    name: 'Smite Good 1/Day',
    description:
      'Once per day, a blackguard can attempt to smite a good-aligned foe, adding Charisma to the attack roll and class level to the damage roll.',
    source: 'Blackguard 2',
  },
  {
    id: 'blackguard-spellcasting-35e',
    name: 'Spellcasting',
    description:
      'Beginning at 2nd level, a blackguard gains a limited divine spellcasting progression.',
    source: 'Blackguard 2',
  },
  {
    id: 'command-undead-35e',
    name: 'Command Undead',
    description:
      'A blackguard can rebuke and command undead as an evil cleric of one-half their class level.',
    source: 'Blackguard 3',
  },
  {
    id: 'aura-of-despair-35e',
    name: 'Aura of Despair',
    description: 'Enemies within 10 feet of the blackguard take a -2 penalty on all saving throws.',
    source: 'Blackguard 3',
  },
  {
    id: 'blackguard-sneak-attack-1-35e',
    name: 'Sneak Attack +1d6',
    description:
      'The blackguard deals 1d6 extra damage whenever a target is denied its Dexterity bonus to AC or is flanked.',
    source: 'Blackguard 4',
  },
  {
    id: 'fiendish-servant-35e',
    name: 'Fiendish Servant',
    description:
      'At 5th level, the blackguard gains the service of a fiendish servant that functions similarly to a paladin mount.',
    source: 'Blackguard 5',
  },
  {
    id: 'blackguard-smite-good-2-35e',
    name: 'Smite Good 2/Day',
    description: 'The blackguard can smite good twice per day.',
    source: 'Blackguard 5',
  },
  {
    id: 'blackguard-sneak-attack-2-35e',
    name: 'Sneak Attack +2d6',
    description: 'The blackguard’s sneak attack damage improves to +2d6.',
    source: 'Blackguard 7',
  },
  {
    id: 'blackguard-sneak-attack-3-35e',
    name: 'Sneak Attack +3d6',
    description: 'The blackguard’s sneak attack damage improves to +3d6.',
    source: 'Blackguard 10',
  },
  {
    id: 'blackguard-smite-good-3-35e',
    name: 'Smite Good 3/Day',
    description: 'The blackguard can smite good three times per day.',
    source: 'Blackguard 10',
  },
];

const zeroSlots = () => Array<number>(20).fill(0);

const blackguardSpellSlots = {
  1: [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  2: [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  3: [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  4: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  5: zeroSlots(),
  6: zeroSlots(),
  7: zeroSlots(),
  8: zeroSlots(),
  9: zeroSlots(),
};

export const blackguard: CharacterClass = {
  id: 'blackguard-35e',
  name: 'Blackguard',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/blackguard.htm',
  },
  description:
    'A fallen champion who mixes martial prowess, dark blessings, sneak attacks, and limited divine spellcasting.',
  hitDie: 'd10',
  primaryAbility: ['str', 'cha', 'wis'],
  savingThrowProficiencies: ['str', 'cha'],
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'concentration',
      'craft',
      'diplomacy',
      'handle-animal',
      'heal',
      'hide',
      'intimidate',
      'knowledge',
      'profession',
      'ride',
    ],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [
    {
      level: 1,
      features: [blackguardFeatures[0], blackguardFeatures[1], blackguardFeatures[2]],
    },
    {
      level: 2,
      features: [blackguardFeatures[3], blackguardFeatures[4], blackguardFeatures[5]],
    },
    { level: 3, features: [blackguardFeatures[6], blackguardFeatures[7]] },
    { level: 4, features: [blackguardFeatures[8]] },
    { level: 5, features: [blackguardFeatures[9], blackguardFeatures[10]] },
    { level: 7, features: [blackguardFeatures[11]] },
    { level: 10, features: [blackguardFeatures[12], blackguardFeatures[13]] },
  ],
  subclassLevel: 20,
  subclasses: [],
  spellcasting: {
    ability: 'wis',
    spellListId: 'dnd35e-blackguard',
    spellSlots: blackguardSpellSlots,
    ritualCasting: false,
    multiclassCasterLevel: 'none',
  },
};
