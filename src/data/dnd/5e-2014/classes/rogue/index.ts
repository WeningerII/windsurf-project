import { CharacterClass } from '../../../../../types/character-options/classes';
import { thiefSubclass } from './thief';

export const rogue: CharacterClass = {
  id: 'rogue',
  name: 'Rogue',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd8',
  primaryAbility: ['dex'],
  savingThrowProficiencies: ['dex', 'int'],
  
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'hand-crossbows', 'longswords', 'rapiers', 'shortswords'],
  toolProficiencies: [{
    count: 1,
    options: ['thieves-tools'],
    label: 'Thieves\' tools',
  }],
  
  skillProficiencies: {
    count: 4,
    options: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight-of-hand', 'stealth'],
    label: 'Choose four skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['rapier'],
        ['shortsword'],
      ],
    },
    {
      choose: 1,
      options: [
        ['shortbow', 'arrows-20'],
        ['shortsword'],
      ],
    },
    {
      choose: 1,
      options: [
        ['burglars-pack'],
        ['dungeoneers-pack'],
        ['explorers-pack'],
      ],
    },
    {
      choose: 1,
      options: [
        ['leather-armor', 'dagger', 'dagger', 'thieves-tools'],
      ],
    },
  ],
  
  startingGold: {
    dice: '4d4',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'expertise',
          name: 'Expertise',
          source: 'Rogue 1',
          description: 'At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.\n\nAt 6th level, you can choose two more of your proficiencies (in skills or with thieves\' tools) to gain this benefit.',
        },
        {
          id: 'sneak-attack',
          name: 'Sneak Attack',
          source: 'Rogue 1',
          description: 'Beginning at 1st level, you know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.\n\nYou don\'t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn\'t incapacitated, and you don\'t have disadvantage on the attack roll.\n\nThe amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.',
        },
        {
          id: 'thieves-cant',
          name: 'Thieves\' Cant',
          source: 'Rogue 1',
          description: 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves\' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.\n\nIn addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves\' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'cunning-action',
          name: 'Cunning Action',
          source: 'Rogue 2',
          description: 'Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'roguish-archetype',
          name: 'Roguish Archetype',
          source: 'Rogue 3',
          description: 'At 3rd level, you choose an archetype that you emulate in the exercise of your rogue abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Rogue 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can\'t increase an ability score above 20 using this feature.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'uncanny-dodge',
          name: 'Uncanny Dodge',
          source: 'Rogue 5',
          description: 'Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'expertise-2',
          name: 'Expertise',
          source: 'Rogue 6',
          description: 'At 6th level, you can choose two more of your proficiencies (in skills or with thieves\' tools) to gain the expertise benefit.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Rogue 7',
          description: 'Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon\'s fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Rogue 8',
          description: 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'roguish-archetype-9',
          name: 'Roguish Archetype Feature',
          source: 'Rogue 9',
          description: 'At 9th level, you gain a feature from your Roguish Archetype.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'ability-score-improvement-10',
          name: 'Ability Score Improvement',
          source: 'Rogue 10',
          description: 'When you reach 10th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'reliable-talent',
          name: 'Reliable Talent',
          source: 'Rogue 11',
          description: 'By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Rogue 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'roguish-archetype-13',
          name: 'Roguish Archetype Feature',
          source: 'Rogue 13',
          description: 'At 13th level, you gain a feature from your Roguish Archetype.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'blindsense',
          name: 'Blindsense',
          source: 'Rogue 14',
          description: 'Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'slippery-mind',
          name: 'Slippery Mind',
          source: 'Rogue 15',
          description: 'By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Rogue 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'roguish-archetype-17',
          name: 'Roguish Archetype Feature',
          source: 'Rogue 17',
          description: 'At 17th level, you gain a feature from your Roguish Archetype.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'elusive',
          name: 'Elusive',
          source: 'Rogue 18',
          description: 'Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren\'t incapacitated.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Rogue 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'stroke-of-luck',
          name: 'Stroke of Luck',
          source: 'Rogue 20',
          description: 'At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.\n\nOnce you use this feature, you can\'t use it again until you finish a short or long rest.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'short-rest',
          },
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [thiefSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose an archetype that represents your focus.'
  },
  
  classResources: [
    {
      id: 'sneak-attack-dice',
      name: 'Sneak Attack',
      maxFormula: 'Math.ceil(level / 2).toString() + "d6"',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ], // SRD: Thief archetype only
  
  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Dexterity 13',
    },
  ],
  
  multiclassProficiencies: {
    armor: ['light'],
    weapons: [],
    tools: ['thieves-tools'],
  },
  
  description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
  
  displayMetadata: {
    icon: 'dagger',
    color: '#696969',
    shortDescription: 'A scoundrel who uses stealth and trickery to overcome obstacles.',
    playStyle: 'Stealthy striker with high skills',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Stealth players', 'Skill-focused players'],
    tags: ['martial', 'melee', 'ranged', 'stealth', 'skill-monkey'],
    casterType: 'third',
  },
};
