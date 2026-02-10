import { CharacterClass } from '../../../../../types/character-options/classes';
import { openHandSubclass } from './open-hand';

export const monk: CharacterClass = {
  id: 'monk',
  name: 'Monk',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd8',
  primaryAbility: ['dex', 'wis'],
  savingThrowProficiencies: ['str', 'dex'],
  
  armorProficiencies: [],
  weaponProficiencies: ['simple', 'shortswords'],
  toolProficiencies: [{
    count: 1,
    options: ['artisans-tools', 'musical-instrument'],
    label: 'Choose one type of artisan\'s tools or one musical instrument',
  }],
  
  skillProficiencies: {
    count: 2,
    options: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['shortsword'],
        ['simple-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['dungeoneers-pack'],
        ['explorers-pack'],
      ],
    },
    {
      choose: 1,
      options: [
        ['dart', 'dart', 'dart', 'dart', 'dart', 'dart', 'dart', 'dart', 'dart', 'dart'],
      ],
    },
  ],
  
  startingGold: {
    dice: '5d4',
    multiplier: 1,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'unarmored-defense-monk',
          name: 'Unarmored Defense',
          source: 'Monk 1',
          description: 'Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
        },
        {
          id: 'martial-arts',
          name: 'Martial Arts',
          source: 'Monk 1',
          description: 'At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don\'t have the two-handed or heavy property.\n\nYou gain the following benefits while you are unarmed or wielding only monk weapons and you aren\'t wearing armor or wielding a shield:\n\n• You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.\n• You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels.\n• When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'ki',
          name: 'Ki',
          source: 'Monk 2',
          description: 'Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have.\n\nYou can spend these points to fuel various ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind. You learn more ki features as you gain levels in this class.\n\nWhen you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points.',
        },
        {
          id: 'unarmored-movement',
          name: 'Unarmored Movement',
          source: 'Monk 2',
          description: 'Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'monastic-tradition',
          name: 'Monastic Tradition',
          source: 'Monk 3',
          description: 'When you reach 3rd level, you commit yourself to a monastic tradition.',
        },
        {
          id: 'deflect-missiles',
          name: 'Deflect Missiles',
          source: 'Monk 3',
          description: 'Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.\n\nIf you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Monk 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
        {
          id: 'slow-fall',
          name: 'Slow Fall',
          source: 'Monk 4',
          description: 'Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack-monk',
          name: 'Extra Attack',
          source: 'Monk 5',
          description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
        {
          id: 'stunning-strike',
          name: 'Stunning Strike',
          source: 'Monk 5',
          description: 'Starting at 5th level, you can interfere with the flow of ki in an opponent\'s body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'ki-empowered-strikes',
          name: 'Ki-Empowered Strikes',
          source: 'Monk 6',
          description: 'Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'evasion-monk',
          name: 'Evasion',
          source: 'Monk 7',
          description: 'At 7th level, your instinctive agility lets you dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
        },
        {
          id: 'stillness-of-mind',
          name: 'Stillness of Mind',
          source: 'Monk 7',
          description: 'Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Monk 8',
          description: 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'unarmored-movement-improvement-9',
          name: 'Unarmored Movement Improvement',
          source: 'Monk 9',
          description: 'At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'purity-of-body',
          name: 'Purity of Body',
          source: 'Monk 10',
          description: 'At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'monastic-tradition-11',
          name: 'Monastic Tradition Feature',
          source: 'Monk 11',
          description: 'At 11th level, you gain a feature from your Monastic Tradition.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Monk 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'tongue-of-sun-and-moon',
          name: 'Tongue of the Sun and Moon',
          source: 'Monk 13',
          description: 'Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'diamond-soul',
          name: 'Diamond Soul',
          source: 'Monk 14',
          description: 'Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.\n\nAdditionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'timeless-body',
          name: 'Timeless Body',
          source: 'Monk 15',
          description: 'At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can\'t be aged magically. You can still die of old age, however. In addition, you no longer need food or water.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Monk 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'monastic-tradition-17',
          name: 'Monastic Tradition Feature',
          source: 'Monk 17',
          description: 'At 17th level, you gain a feature from your Monastic Tradition.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'empty-body',
          name: 'Empty Body',
          source: 'Monk 18',
          description: 'Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.\n\nAdditionally, you can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can\'t take any other creatures with you.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Monk 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'perfect-self',
          name: 'Perfect Self',
          source: 'Monk 20',
          description: 'At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.',
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [openHandSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you commit yourself to a monastic tradition.'
  }, // SRD: Way of the Open Hand only
  
  classResources: [
    {
      id: 'ki',
      name: 'Ki Points',
      maxFormula: 'level',
      recoveryType: 'short-rest',
      displayOrder: 1,
    },
  ],
  
  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Dexterity 13 and Wisdom 13',
    },
  ],
  
  multiclassProficiencies: {
    armor: [],
    weapons: ['simple', 'shortswords'],
    tools: [],
  },
  
  description: 'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
  
  displayMetadata: {
    icon: 'fist',
    color: '#4169E1',
    shortDescription: 'A martial artist who harnesses ki energy for supernatural abilities.',
    playStyle: 'Mobile melee striker with ki powers',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Tactical players', 'Players who like mobility'],
    tags: ['martial', 'melee', 'versatile'],
    casterType: 'none',
  },
};
