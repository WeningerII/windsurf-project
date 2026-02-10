import { CharacterClass } from '../../../../../types/character-options/classes';
import { berserkerSubclass } from './berserker';

export const barbarian: CharacterClass = {
  id: 'barbarian',
  name: 'Barbarian',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  // Versioning and provenance
  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd12',
  primaryAbility: ['str'],
  savingThrowProficiencies: ['str', 'con'],
  
  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['animal-handling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['greataxe'],
        ['martial-melee-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['handaxe', 'handaxe'],
        ['simple-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['explorers-pack', 'javelin', 'javelin', 'javelin', 'javelin'],
      ],
    },
  ],
  
  startingGold: {
    dice: '2d4',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'rage',
          name: 'Rage',
          source: 'Barbarian 1',
          description: 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.\n\nWhile raging, you gain the following benefits if you aren\'t wearing heavy armor:\n\n• You have advantage on Strength checks and Strength saving throws.\n• When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table.\n• You have resistance to bludgeoning, piercing, and slashing damage.\n\nIf you are able to cast spells, you can\'t cast them or concentrate on them while raging.\n\nYour rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven\'t attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.\n\nOnce you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again.',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'unarmored-defense-barbarian',
          name: 'Unarmored Defense',
          source: 'Barbarian 1',
          description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'reckless-attack',
          name: 'Reckless Attack',
          source: 'Barbarian 2',
          description: 'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
        },
        {
          id: 'danger-sense',
          name: 'Danger Sense',
          source: 'Barbarian 2',
          description: 'At 2nd level, you gain an uncanny sense of when things nearby aren\'t as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can\'t be blinded, deafened, or incapacitated.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'primal-path',
          name: 'Primal Path',
          source: 'Barbarian 3',
          description: 'At 3rd level, you choose a path that shapes the nature of your rage.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Barbarian 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack-barbarian',
          name: 'Extra Attack',
          source: 'Barbarian 5',
          description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
        {
          id: 'fast-movement',
          name: 'Fast Movement',
          source: 'Barbarian 5',
          description: 'Starting at 5th level, your speed increases by 10 feet while you aren\'t wearing heavy armor.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'path-feature-6',
          name: 'Path Feature',
          source: 'Barbarian 6',
          description: 'At 6th level, you gain a feature from your Primal Path.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'feral-instinct',
          name: 'Feral Instinct',
          source: 'Barbarian 7',
          description: 'By 7th level, your instincts are so honed that you have advantage on initiative rolls.\n\nAdditionally, if you are surprised at the beginning of combat and aren\'t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Barbarian 8',
          description: 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'brutal-critical-1',
          name: 'Brutal Critical',
          source: 'Barbarian 9',
          description: 'Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.\n\nThis increases to two additional dice at 13th level and three additional dice at 17th level.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'path-feature-10',
          name: 'Path Feature',
          source: 'Barbarian 10',
          description: 'At 10th level, you gain a feature from your Primal Path.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'relentless-rage',
          name: 'Relentless Rage',
          source: 'Barbarian 11',
          description: 'Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you\'re raging and don\'t die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.\n\nEach time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Barbarian 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'brutal-critical-2',
          name: 'Brutal Critical (2 dice)',
          source: 'Barbarian 13',
          description: 'At 13th level, you can roll two additional weapon damage dice when determining the extra damage for a critical hit with a melee attack.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'path-feature-14',
          name: 'Path Feature',
          source: 'Barbarian 14',
          description: 'At 14th level, you gain a feature from your Primal Path.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'persistent-rage',
          name: 'Persistent Rage',
          source: 'Barbarian 15',
          description: 'Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Barbarian 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'brutal-critical-3',
          name: 'Brutal Critical (3 dice)',
          source: 'Barbarian 17',
          description: 'At 17th level, you can roll three additional weapon damage dice when determining the extra damage for a critical hit with a melee attack.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'indomitable-might',
          name: 'Indomitable Might',
          source: 'Barbarian 18',
          description: 'Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Barbarian 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'primal-champion',
          name: 'Primal Champion',
          source: 'Barbarian 20',
          description: 'At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.',
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [berserkerSubclass], // SRD: Path of the Berserker only
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a path that shapes the nature of your rage.'
  },
  
  classResources: [
    {
      id: 'rage',
      name: 'Rage',
      maxFormula: 'level >= 20 ? "unlimited" : level >= 17 ? "6" : level >= 12 ? "5" : level >= 6 ? "4" : level >= 3 ? "3" : "2"',
      recoveryType: 'long-rest',
      displayOrder: 1,
      defaultValue: 2,
    },
    {
      id: 'rage-damage',
      name: 'Rage Damage Bonus',
      maxFormula: 'level >= 16 ? "4" : level >= 9 ? "3" : "2"',
      recoveryType: 'long-rest',
      displayOrder: 2,
    },
  ],
  
  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Strength 13',
    },
  ],
  
  multiclassProficiencies: {
    armor: ['shields'],
    weapons: ['simple', 'martial'],
    tools: [],
  },
  
  description: 'A fierce warrior of primitive background who can enter a battle rage.',
  
  displayMetadata: {
    icon: 'axe',
    color: '#8B0000',
    shortDescription: 'A fierce warrior who channels primal fury in combat.',
    playStyle: 'Melee striker with high durability',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Beginners', 'Players who like straightforward combat'],
    tags: ['martial', 'melee', 'tank'],
    casterType: 'none',
  },
};
