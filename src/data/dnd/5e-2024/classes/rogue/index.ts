import { CharacterClass } from '../../../../../types/character-options/classes';
import { thiefSubclass } from './thief';

export const rogue: CharacterClass = {
  id: 'rogue',
  name: 'Rogue',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
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
          description: 'Choose two of your skill proficiencies or one skill and your proficiency with Thieves\' Tools. Your Proficiency Bonus is doubled for any ability check you make using the chosen proficiencies. At 6th level, you can choose two more proficiencies to gain this benefit.',
        },
        {
          id: 'sneak-attack',
          name: 'Sneak Attack',
          source: 'Rogue 1',
          description: 'Once per turn, you can deal extra damage to one creature you hit with an attack roll if you\'re attacking with a Finesse or Ranged weapon and have Advantage on the attack roll. The extra damage is 1d6 and increases as you gain Rogue levels.',
        },
        {
          id: 'thieves-cant',
          name: 'Thieves\' Cant',
          source: 'Rogue 1',
          description: 'You know Thieves\' Cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.',
        },
        {
          id: 'weapon-mastery-rogue',
          name: 'Weapon Mastery',
          source: 'Rogue 1',
          description: 'Your training with weapons allows you to use the mastery property of two kinds of Simple or Martial weapons of your choice.',
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
          description: 'Your quick thinking and agility allow you to move and act quickly. You can take a Bonus Action on each of your turns to take the Dash, Disengage, or Hide action.',
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
          description: 'You choose an archetype that reflects your training and priorities.',
        },
        {
          id: 'steady-aim',
          name: 'Steady Aim',
          source: 'Rogue 3',
          description: 'As a Bonus Action, you give yourself Advantage on your next attack roll on the current turn. You can use this feature only if you haven\'t moved during this turn and you aren\'t using your Speed.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1. You can\'t increase an ability score above 20 using this feature.',
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
          description: 'When an attacker that you can see hits you with an attack roll, you can use your Reaction to halve the attack\'s damage against you.',
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
          description: 'Choose two more proficiencies to gain the Expertise benefit.',
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
          description: 'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail.',
        },
        {
          id: 'reliable-talent',
          name: 'Reliable Talent',
          source: 'Rogue 7',
          description: 'Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [],
    },
    {
      level: 10,
      features: [
        {
          id: 'ability-score-improvement-10',
          name: 'Ability Score Improvement',
          source: 'Rogue 10',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 11,
      features: [],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Rogue 12',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [],
    },
    {
      level: 14,
      features: [
        {
          id: 'blindsense',
          name: 'Blindsense',
          source: 'Rogue 14',
          description: 'If you can hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.',
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
          description: 'You gain proficiency in Wisdom saving throws.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [],
    },
    {
      level: 18,
      features: [
        {
          id: 'elusive',
          name: 'Elusive',
          source: 'Rogue 18',
          description: 'No attack roll has Advantage against you while you don\'t have the Incapacitated condition.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Rogue 19',
          description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
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
          description: 'If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20. Once you use this feature, you can\'t use it again until you finish a Short or Long Rest.',
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
    flavorText: 'At 3rd level, you choose an archetype that reflects your training and priorities.'
  },
  
  classResources: [],
  
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
    playStyle: 'Stealthy skill expert with devastating sneak attacks',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Stealth enthusiasts', 'Skill-focused players'],
    tags: ['martial', 'stealth', 'skill-monkey'],
  },
};
