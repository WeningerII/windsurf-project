import { CharacterClass } from '../../../../../types/character-options/classes';

export const fighter: CharacterClass = {
  id: 'fighter',
  name: 'Fighter',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: "Player's Handbook 3.5",
    url: 'https://www.d20srd.org/srd/classes/fighter.htm',
  },

  hitDie: 'd10',
  primaryAbility: ['str'],
  savingThrowProficiencies: ['str', 'con'],

  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['climb', 'handle-animal', 'intimidate', 'jump', 'ride', 'swim'],
    label: 'Choose two skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '6d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'bonus-feat-1',
          name: 'Bonus Feat',
          source: 'Fighter 1',
          description:
            'At 1st level, a fighter gets a bonus combat-oriented feat in addition to the feat that any 1st-level character gets and the bonus feat granted to a human character. The fighter gains an additional bonus feat at 2nd level and every two fighter levels thereafter (4th, 6th, 8th, 10th, 12th, 14th, 16th, 18th, and 20th).',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'bonus-feat-2',
          name: 'Bonus Feat',
          source: 'Fighter 2',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'fighter-3',
          name: 'Combat Mastery',
          source: 'Fighter 3',
          description: 'The fighter gains increased combat prowess.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'bonus-feat-4',
          name: 'Bonus Feat',
          source: 'Fighter 4',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'fighter-5',
          name: 'Weapon Specialization',
          source: 'Fighter 5',
          description: 'The fighter gains weapon specialization.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'bonus-feat-6',
          name: 'Bonus Feat',
          source: 'Fighter 6',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'fighter-7',
          name: 'Combat Reflexes',
          source: 'Fighter 7',
          description: 'The fighter gains improved combat reflexes.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'bonus-feat-8',
          name: 'Bonus Feat',
          source: 'Fighter 8',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'fighter-9',
          name: 'Improved Defense',
          source: 'Fighter 9',
          description: 'The fighter gains improved defense.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'bonus-feat-10',
          name: 'Bonus Feat',
          source: 'Fighter 10',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'fighter-11',
          name: 'Greater Weapon Specialization',
          source: 'Fighter 11',
          description: 'The fighter gains greater weapon specialization.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'bonus-feat-12',
          name: 'Bonus Feat',
          source: 'Fighter 12',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'fighter-13',
          name: 'Improved Combat',
          source: 'Fighter 13',
          description: 'The fighter gains improved combat abilities.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'bonus-feat-14',
          name: 'Bonus Feat',
          source: 'Fighter 14',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'fighter-15',
          name: 'Supreme Tactics',
          source: 'Fighter 15',
          description: 'The fighter gains supreme tactical knowledge.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'bonus-feat-16',
          name: 'Bonus Feat',
          source: 'Fighter 16',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'fighter-17',
          name: 'Master Combatant',
          source: 'Fighter 17',
          description: 'The fighter becomes a master combatant.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'bonus-feat-18',
          name: 'Bonus Feat',
          source: 'Fighter 18',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'fighter-19',
          name: 'Perfect Technique',
          source: 'Fighter 19',
          description: 'The fighter achieves perfect technique.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'bonus-feat-20',
          name: 'Bonus Feat',
          source: 'Fighter 20',
          description: 'The fighter gains a bonus combat-oriented feat.',
        },
      ],
    },
  ],

  subclassLevel: 0,
  subclasses: [],

  classResources: [],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description: 'A master of combat who relies on heavy armor and melee weapons.',

  displayMetadata: {
    icon: 'sword',
    color: '#8B4513',
    shortDescription: 'A master of arms and armor.',
    playStyle: 'Combat specialist with bonus feats',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Combat-focused players', 'Feat enthusiasts'],
    tags: ['martial', 'melee'],
  },
};
