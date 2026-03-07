import { CharacterClass } from '../../../../types/character-options/classes';

export const ranger: CharacterClass = {
  id: 'ranger',
  name: 'Ranger',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 64,
    url: 'https://www.d20pfsrd.com/classes/core-classes/ranger/',
  },
  hitDie: 'd10',
  primaryAbility: ['dex', 'str', 'wis'],
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 6,
    options: [
      'climb',
      'handle-animal',
      'heal',
      'intimidate',
      'knowledge-dungeoneering',
      'knowledge-geography',
      'knowledge-nature',
      'perception',
      'ride',
      'spellcraft',
      'stealth',
      'survival',
      'swim',
    ],
    label: 'Choose class skills (6 + Int modifier ranks per level)',
  },
  equipmentChoices: [],
  startingGold: { dice: '5d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'favored-enemy-1',
          name: 'Favored Enemy',
          source: 'Ranger 1',
          description:
            'Select a creature type. Gain +2 bonus on Bluff, Knowledge, Perception, Sense Motive, and Survival checks and +2 on attack and damage rolls against them.',
        },
        {
          id: 'track',
          name: 'Track',
          source: 'Ranger 1',
          description:
            'Add half ranger level (minimum 1) to Survival checks made to follow tracks.',
        },
        {
          id: 'wild-empathy',
          name: 'Wild Empathy',
          source: 'Ranger 1',
          description:
            'Improve the attitude of an animal like a Diplomacy check. Roll 1d20 + ranger level + Cha modifier.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'combat-style',
          name: 'Combat Style Feat',
          source: 'Ranger 2',
          description:
            'Select archery or two-weapon combat style and gain a bonus feat from that style.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'endurance',
          name: 'Endurance',
          source: 'Ranger 3',
          description: 'Gain Endurance as a bonus feat.',
        },
        {
          id: 'favored-terrain-1',
          name: 'Favored Terrain',
          source: 'Ranger 3',
          description:
            'Select a terrain type. Gain +2 bonus on initiative, Knowledge (geography), Perception, Stealth, and Survival checks in that terrain.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'hunters-bond',
          name: "Hunter's Bond",
          source: 'Ranger 4',
          description: 'Form a bond with companions or an animal companion.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'favored-enemy-2',
          name: 'Favored Enemy (+2)',
          source: 'Ranger 5',
          description:
            'Select a new favored enemy. Increase one existing favored enemy bonus by +2.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'combat-style-6',
          name: 'Combat Style Feat',
          source: 'Ranger 6',
          description: 'Gain another combat style feat.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'woodland-stride',
          name: 'Woodland Stride',
          source: 'Ranger 7',
          description: 'Move through undergrowth at normal speed without damage.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'swift-tracker',
          name: 'Swift Tracker',
          source: 'Ranger 8',
          description: 'Move at normal speed while following tracks without penalty.',
        },
        {
          id: 'favored-terrain-2',
          name: 'Favored Terrain (+2)',
          source: 'Ranger 8',
          description: 'Select a new terrain. Increase one existing terrain bonus by +2.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Ranger 9',
          description: 'On successful Reflex save for half, take no damage instead.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'favored-enemy-3',
          name: 'Favored Enemy (+2)',
          source: 'Ranger 10',
          description: 'Select a new favored enemy. Increase one existing bonus by +2.',
        },
        {
          id: 'combat-style-10',
          name: 'Combat Style Feat',
          source: 'Ranger 10',
          description: 'Gain another combat style feat.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'quarry',
          name: 'Quarry',
          source: 'Ranger 11',
          description: 'Denote one target as quarry. +2 on attack rolls, auto-confirm crits.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'camouflage',
          name: 'Camouflage',
          source: 'Ranger 12',
          description: 'Use Stealth to hide in favored terrain even without cover.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'favored-terrain-3',
          name: 'Favored Terrain (+2)',
          source: 'Ranger 13',
          description: 'Select a new terrain. Increase one existing bonus by +2.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'combat-style-14',
          name: 'Combat Style Feat',
          source: 'Ranger 14',
          description: 'Gain another combat style feat.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'favored-enemy-4',
          name: 'Favored Enemy (+2)',
          source: 'Ranger 15',
          description: 'Select a new favored enemy. Increase one existing bonus by +2.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'improved-evasion',
          name: 'Improved Evasion',
          source: 'Ranger 16',
          description: 'Half damage on failed Reflex save, none on success.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'hide-in-plain-sight',
          name: 'Hide in Plain Sight',
          source: 'Ranger 17',
          description: 'Use Stealth in favored terrain while being observed.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'favored-terrain-4',
          name: 'Favored Terrain (+2)',
          source: 'Ranger 18',
          description: 'Select a new terrain. Increase one existing bonus by +2.',
        },
        {
          id: 'combat-style-18',
          name: 'Combat Style Feat',
          source: 'Ranger 18',
          description: 'Gain another combat style feat.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'improved-quarry',
          name: 'Improved Quarry',
          source: 'Ranger 19',
          description: 'Quarry can be selected as a free action. +4 attack bonus instead of +2.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'favored-enemy-5',
          name: 'Favored Enemy (+2)',
          source: 'Ranger 20',
          description: 'Select a new favored enemy. Increase one existing bonus by +2.',
        },
        {
          id: 'master-hunter',
          name: 'Master Hunter',
          source: 'Ranger 20',
          description:
            'As a standard action, make a single attack against a favored enemy at full BAB. If successful, target must make Fort save or die.',
        },
      ],
    },
  ],
  subclassLevel: 0,
  subclasses: [],
  spellcasting: {
    ability: 'wis',
    spellListId: 'ranger-pf1e',
    preparedCasterFormula: 'wis_mod + Math.floor(class_level / 2)',
    spellSlots: {
      1: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
      2: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'half',
  },
  classResources: [],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'For those who relish the thrill of the hunt, there are only predators and prey. Rangers are skilled stalkers and hunters.',
  displayMetadata: {
    icon: 'bow',
    color: '#228B22',
    shortDescription: 'A skilled hunter and tracker with favored enemies and terrain.',
    playStyle: 'Versatile combatant with nature magic and tracking',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Nature lovers', 'Archers', 'Dual-wielders'],
    tags: ['martial', 'primal', 'ranged', 'melee'],
    casterType: 'half',
  },
};
