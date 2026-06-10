import { CharacterClass } from '../../../../types/character-options/classes';

export const alchemist: CharacterClass = {
  id: 'alchemist',
  name: 'Alchemist',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 66,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=1',
  },
  hitDie: 'd8',
  primaryAbility: ['int'],
  savingThrowProficiencies: ['int', 'con'],
  armorProficiencies: ['light', 'medium'],
  weaponProficiencies: ['simple', 'alchemical-bombs'],
  toolProficiencies: [],
  // CRB: trained in the class's fixed skill(s) plus `count` free choices
  // (+ Int). `options` is the truthful eligible list — every skill except
  // the fixed grants — so a Choice-honoring consumer can't mis-render
  // 'choose 3 from a 1-item list'. Fixed training (crafting) is granted by the class template.
  skillProficiencies: {
    count: 3,
    options: [
      'acrobatics',
      'arcana',
      'athletics',
      'deception',
      'diplomacy',
      'intimidation',
      'medicine',
      'nature',
      'occultism',
      'performance',
      'religion',
      'society',
      'stealth',
      'survival',
      'thievery',
    ],
    label: 'Trained in Crafting and 3 + Int skills',
  },
  equipmentChoices: [],
  // CRB p.271: every PF2e class starts with 15 gp (150 sp) flat — not a dice roll.
  startingGold: { flat: 15 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'alchemy',
          name: 'Alchemy',
          source: 'Alchemist 1',
          description:
            'You understand the complex interactions of natural and unnatural substances and can concoct alchemical items.',
        },
        {
          id: 'research-field',
          name: 'Research Field',
          source: 'Alchemist 1',
          description:
            'Your research field adds a number of formulas to your formula book; choose Bomber, Chirurgeon, Mutagenist, or Toxicologist.',
        },
        {
          id: 'formula-book',
          name: 'Formula Book',
          source: 'Alchemist 1',
          description:
            'You start with a formula book containing formulas for two common 1st-level alchemical items.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'field-discovery',
          name: 'Field Discovery',
          source: 'Alchemist 5',
          description: 'You learn a special discovery depending on your research field.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'alchemical-weapon-expertise',
          name: 'Alchemical Weapon Expertise',
          source: 'Alchemist 7',
          description:
            'Your proficiency ranks for simple weapons and alchemical bombs increase to expert.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'alertness',
          name: 'Alertness',
          source: 'Alchemist 9',
          description: 'Your proficiency rank for Perception increases to expert.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'double-brew',
          name: 'Double Brew',
          source: 'Alchemist 11',
          description:
            'You can create two alchemical items during your daily preparations instead of one.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'greater-field-discovery',
          name: 'Greater Field Discovery',
          source: 'Alchemist 13',
          description: 'You learn an even more special discovery depending on your research field.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'alchemical-alacrity',
          name: 'Alchemical Alacrity',
          source: 'Alchemist 15',
          description: 'You can use Quick Alchemy to create three items instead of one.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'perpetual-perfection',
          name: 'Perpetual Perfection',
          source: 'Alchemist 17',
          description: 'You can use Quick Alchemy to create perfect versions of low-level items.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'bomber',
      name: 'Bomber',
      parentClassId: 'alchemist',
      description: 'You specialize in explosives and other damaging alchemical items.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'bomber-field',
              name: 'Bomber Field',
              source: 'Bomber 1',
              description:
                'You can use Quick Alchemy to create alchemical bombs. When you throw an alchemical bomb with the splash trait, add your Intelligence modifier to the damage roll.',
            },
          ],
        },
        {
          level: 5,
          features: [
            {
              id: 'calculated-splash',
              name: 'Calculated Splash',
              source: 'Bomber 5',
              description: 'Your bombs deal splash damage equal to your Intelligence modifier.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'expanded-splash',
              name: 'Expanded Splash',
              source: 'Bomber 9',
              description: "Your bombs' splash radius increases by 5 feet.",
            },
          ],
        },
      ],
    },
    {
      id: 'chirurgeon',
      name: 'Chirurgeon',
      parentClassId: 'alchemist',
      description: 'You focus on healing and protecting others with alchemical concoctions.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'chirurgeon-field',
              name: 'Chirurgeon Field',
              source: 'Chirurgeon 1',
              description:
                'You can use Quick Alchemy to create elixirs of life. When you use Quick Alchemy to create an elixir of life, the creature drinking it regains additional Hit Points equal to your Intelligence modifier.',
            },
          ],
        },
        {
          level: 5,
          features: [
            {
              id: 'powerful-alchemy',
              name: 'Powerful Alchemy',
              source: 'Chirurgeon 5',
              description: 'Your healing elixirs restore more Hit Points.',
            },
          ],
        },
      ],
    },
    {
      id: 'mutagenist',
      name: 'Mutagenist',
      parentClassId: 'alchemist',
      description: 'You specialize in strange formulae that transform the drinker.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'mutagenist-field',
              name: 'Mutagenist Field',
              source: 'Mutagenist 1',
              description:
                'You can use Quick Alchemy to create mutagens. When you drink a mutagen you create, you gain a +1 item bonus to the associated statistic for its duration.',
            },
          ],
        },
        {
          level: 5,
          features: [
            {
              id: 'potent-mutagen',
              name: 'Potent Mutagen',
              source: 'Mutagenist 5',
              description: 'Your mutagens last longer and provide greater benefits.',
            },
          ],
        },
      ],
    },
    {
      id: 'toxicologist',
      name: 'Toxicologist',
      parentClassId: 'alchemist',
      description: 'You specialize in toxins and venomous alchemical items.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'toxicologist-field',
              name: 'Toxicologist Field',
              source: 'Toxicologist 1',
              description:
                "You can use Quick Alchemy to create poisons. When you create a poison using Quick Alchemy, you can add your Intelligence modifier to the poison's DC.",
            },
          ],
        },
        {
          level: 5,
          features: [
            {
              id: 'sticky-poison',
              name: 'Sticky Poison',
              source: 'Toxicologist 5',
              description: 'Your poisons are harder to remove and more potent.',
            },
          ],
        },
      ],
    },
  ],
  classResources: [
    {
      id: 'reagents',
      name: 'Infused Reagents',
      maxFormula: 'level + int_mod',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Intelligence 14' }],
  multiclassProficiencies: { armor: ['light'], weapons: ['simple'], tools: [] },
  description:
    "There's no sight more beautiful to you than a strange brew bubbling in a beaker, and you consume your own concoctions with reckless abandon.",
  displayMetadata: {
    icon: 'flask',
    color: '#32CD32',
    shortDescription: 'A master of alchemy who creates powerful concoctions.',
    playStyle: 'Support/utility with crafted alchemical items',
    complexity: 'complex',
    role: 'support',
    idealFor: ['Crafters', 'Tactical players'],
    tags: ['support', 'skill-monkey'],
  },
};
