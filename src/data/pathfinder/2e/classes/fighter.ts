import { CharacterClass } from '../../../../types/character-options/classes';

export const fighter: CharacterClass = {
  id: 'fighter',
  name: 'Fighter',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 140,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=7',
  },
  hitDie: 'd10',
  primaryAbility: ['str', 'dex'],
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial', 'advanced'],
  toolProficiencies: [],
  // CRB: trained in the class's fixed skill(s) plus `count` free choices
  // (+ Int). `options` is the truthful eligible list — every skill except
  // the fixed grants — so a Choice-honoring consumer can't mis-render
  // 'choose 3 from a 1-item list'.
  skillProficiencies: {
    count: 3,
    options: [
      'acrobatics',
      'arcana',
      'athletics',
      'crafting',
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
    label: 'Trained in 3 + Int skills',
  },
  equipmentChoices: [],
  // CRB p.271: every PF2e class starts with 15 gp (150 sp) flat — not a dice roll.
  startingGold: { flat: 15 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'attack-of-opportunity',
          name: 'Attack of Opportunity',
          source: 'Fighter 1',
          description:
            "You can make an Attack of Opportunity as a reaction when a creature within your reach uses a manipulate action or move action, makes a ranged attack, or leaves a square during a move action it's using.",
        },
        {
          id: 'shield-block',
          name: 'Shield Block',
          source: 'Fighter 1',
          description:
            'You gain the Shield Block general feat, allowing you to reduce damage with your shield.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'fighter-feat-2',
          name: 'Fighter Feat',
          source: 'Fighter 2',
          description: 'Select a fighter feat.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'bravery',
          name: 'Bravery',
          source: 'Fighter 3',
          description:
            'You become expert in Will saves against fear effects. When you roll a success against a fear effect, you get a critical success instead.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'fighter-weapon-mastery',
          name: 'Fighter Weapon Mastery',
          source: 'Fighter 5',
          description:
            'Choose one weapon group. Your proficiency rank increases to master with all simple and martial weapons in that group.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'battlefield-surveyor',
          name: 'Battlefield Surveyor',
          source: 'Fighter 7',
          description:
            'You become master in Perception. In encounter mode, you can Seek as a free action at the start of each of your turns.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'combat-flexibility',
          name: 'Combat Flexibility',
          source: 'Fighter 9',
          description:
            "During daily preparations, you can gain a fighter feat of 8th level or lower you don't already have.",
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'armor-expertise',
          name: 'Armor Expertise',
          source: 'Fighter 11',
          description:
            'You become expert in light armor, medium armor, heavy armor, and unarmored defense.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'weapon-legend',
          name: 'Weapon Legend',
          source: 'Fighter 13',
          description:
            'Your proficiency with weapons selected in Fighter Weapon Mastery increases to legendary.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Fighter 15',
          description:
            'You become master in Reflex saves. When you roll a success on a Reflex save, you get a critical success instead.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'armor-mastery',
          name: 'Armor Mastery',
          source: 'Fighter 17',
          description:
            'Your proficiency rank for light, medium, and heavy armor increases to master.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'versatile-legend',
          name: 'Versatile Legend',
          source: 'Fighter 19',
          description:
            'Your proficiency ranks for all simple and martial weapons increase to legendary.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'champion',
      name: 'Champion',
      parentClassId: 'fighter',
      description:
        'You are a paragon of combat, combining martial prowess with tactical brilliance.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'champion-dedication',
              name: 'Champion Dedication',
              source: 'Champion 1',
              description:
                "You gain a champion's reaction and can use it to defend allies or strike enemies.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'champion-expertise',
              name: 'Champion Expertise',
              source: 'Champion 3',
              description: 'Your proficiency with weapons increases to expert.',
            },
          ],
        },
      ],
    },
    {
      id: 'weapon-master',
      name: 'Weapon Master',
      parentClassId: 'fighter',
      description: 'You have dedicated your life to mastering a single weapon or fighting style.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'weapon-specialization',
              name: 'Weapon Specialization',
              source: 'Weapon Master 1',
              description:
                'Choose one weapon. You gain a +2 circumstance bonus to damage rolls with that weapon.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'weapon-mastery-feat',
              name: 'Weapon Mastery',
              source: 'Weapon Master 3',
              description: 'Your proficiency with your chosen weapon increases to master.',
            },
          ],
        },
      ],
    },
    {
      id: 'duelist',
      name: 'Duelist',
      parentClassId: 'fighter',
      description:
        'You are a master of finesse and precision, favoring lighter weapons and defensive techniques.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'duelist-stance',
              name: 'Duelist Stance',
              source: 'Duelist 1',
              description:
                'You gain a +1 circumstance bonus to AC when wielding a finesse weapon in one hand and nothing in the other.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'duelist-riposte',
              name: 'Duelist Riposte',
              source: 'Duelist 3',
              description:
                'When an opponent misses you with a melee attack, you can use your reaction to make a Strike.',
            },
          ],
        },
      ],
    },
  ],
  classResources: [],
  multiclassRequirements: [
    { type: 'attribute', value: 14, description: 'Strength 14 or Dexterity 14' },
  ],
  multiclassProficiencies: {
    armor: ['light', 'medium'],
    weapons: ['simple', 'martial'],
    tools: [],
  },
  description:
    'Fighting for honor, greed, loyalty, or simply the thrill of battle, you are an undisputed master of weaponry and combat techniques.',
  displayMetadata: {
    icon: 'sword',
    color: '#8B4513',
    shortDescription: 'A master of weapons and combat techniques.',
    playStyle: 'Versatile martial combatant with superior weapon proficiency',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Combat-focused players', 'Beginners'],
    tags: ['martial', 'melee', 'ranged', 'versatile'],
  },
};
