import { CharacterClass } from '../../../../../types/character-options/classes';
import { championSubclass } from './champion';

export const fighter: CharacterClass = {
  id: 'fighter',
  name: 'Fighter',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd10',
  primaryAbility: ['str', 'dex'],
  savingThrowProficiencies: ['str', 'con'],
  
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['acrobatics', 'animal-handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['chain-mail'],
        ['leather-armor', 'longbow', 'arrows-20'],
      ],
    },
    {
      choose: 1,
      options: [
        ['martial-weapon', 'shield'],
        ['martial-weapon', 'martial-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['light-crossbow', 'bolts-20'],
        ['handaxe', 'handaxe'],
      ],
    },
    {
      choose: 1,
      options: [
        ['dungeoneers-pack'],
        ['explorers-pack'],
      ],
    },
  ],
  
  startingGold: {
    dice: '5d4',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'fighting-style',
          name: 'Fighting Style',
          source: 'Fighter 1',
          description: 'You adopt a particular style of fighting as your specialty. Choose one of the following options. You can\'t take a Fighting Style option more than once, even if you later get to choose again.',
        },
        {
          id: 'second-wind',
          name: 'Second Wind',
          source: 'Fighter 1',
          description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'weapon-mastery',
          name: 'Weapon Mastery',
          source: 'Fighter 1',
          description: 'Your training with weapons allows you to use the mastery property of three kinds of Simple or Martial Melee weapons of your choice. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices. When you reach certain levels in this class, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Fighter table.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'action-surge',
          name: 'Action Surge',
          source: 'Fighter 2',
          description: 'Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'tactical-mind',
          name: 'Tactical Mind',
          source: 'Fighter 2',
          description: 'You have a mind for tactics. When you fail an ability check, you can expend a use of your Action Surge to succeed instead.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'martial-archetype',
          name: 'Martial Archetype',
          source: 'Fighter 3',
          description: 'At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Fighter 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack',
          name: 'Extra Attack',
          source: 'Fighter 5',
          description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.',
        },
        {
          id: 'tactical-shift',
          name: 'Tactical Shift',
          source: 'Fighter 5',
          description: 'Whenever you activate your Action Surge, you can move up to half your Speed (no action required) before or after the extra action.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'ability-score-improvement-6',
          name: 'Ability Score Improvement',
          source: 'Fighter 6',
          description: 'When you reach 6th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 7,
      features: [],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Fighter 8',
          description: 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'indomitable',
          name: 'Indomitable',
          source: 'Fighter 9',
          description: 'Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can\'t use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'master-of-armaments',
          name: 'Master of Armaments',
          source: 'Fighter 9',
          description: 'You are adept at using any weapon in any circumstance. You ignore the Loading property of weapons you are proficient with, and you don\'t need a free hand to reload.',
        },
      ],
    },
    {
      level: 10,
      features: [],
    },
    {
      level: 11,
      features: [
        {
          id: 'extra-attack-2',
          name: 'Extra Attack (2)',
          source: 'Fighter 11',
          description: 'At 11th level, you can attack three times whenever you take the Attack action on your turn.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Fighter 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'indomitable-2',
          name: 'Indomitable (2 uses)',
          source: 'Fighter 13',
          description: 'At 13th level, you can use Indomitable twice between long rests.',
        },
        {
          id: 'studied-attacks',
          name: 'Studied Attacks',
          source: 'Fighter 13',
          description: 'You study your opponents and learn from each attack you make. If you miss with an attack roll, you gain a +1 bonus to your next attack roll against that creature before the end of your next turn.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'ability-score-improvement-14',
          name: 'Ability Score Improvement',
          source: 'Fighter 14',
          description: 'When you reach 14th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 15,
      features: [],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Fighter 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'action-surge-2',
          name: 'Action Surge (2 uses)',
          source: 'Fighter 17',
          description: 'At 17th level, you can use Action Surge twice before a rest.',
        },
        {
          id: 'indomitable-3',
          name: 'Indomitable (3 uses)',
          source: 'Fighter 17',
          description: 'At 17th level, you can use Indomitable three times between long rests.',
        },
      ],
    },
    {
      level: 18,
      features: [],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Fighter 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Fighter 19',
          description: 'At 19th level, you gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'extra-attack-3',
          name: 'Extra Attack (3)',
          source: 'Fighter 20',
          description: 'At 20th level, you can attack four times whenever you take the Attack action on your turn.',
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [championSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose an archetype that reflects your specialty.'
  },
  
  classResources: [
    {
      id: 'second-wind',
      name: 'Second Wind',
      maxFormula: '1',
      recoveryType: 'short-rest',
      displayOrder: 1,
      defaultValue: 1,
    },
    {
      id: 'action-surge',
      name: 'Action Surge',
      maxFormula: 'level >= 17 ? "2" : "1"',
      recoveryType: 'short-rest',
      displayOrder: 2,
      defaultValue: 1,
    },
    {
      id: 'indomitable',
      name: 'Indomitable',
      maxFormula: 'level >= 17 ? "3" : level >= 13 ? "2" : level >= 9 ? "1" : "0"',
      recoveryType: 'long-rest',
      displayOrder: 3,
    },
  ],
  
  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Strength 13 or Dexterity 13',
    },
  ],
  
  multiclassProficiencies: {
    armor: ['light', 'medium', 'shields'],
    weapons: ['simple', 'martial'],
    tools: [],
  },
  
  description: 'A master of martial combat, skilled with a variety of weapons and armor.',
  
  displayMetadata: {
    icon: 'sword',
    color: '#8B4513',
    shortDescription: 'A master of martial combat skilled with a variety of weapons and armor.',
    playStyle: 'Versatile martial combatant',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Beginners', 'Combat-focused players'],
    tags: ['martial', 'melee', 'ranged', 'versatile'],
    casterType: 'third',
  },
};
