import { CharacterClass } from '../../../../types/character-options/classes';

export const barbarian: CharacterClass = {
  id: 'barbarian',
  name: 'Barbarian',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 82,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=2',
  },
  hitDie: 'd12',
  primaryAbility: ['str'],
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: ['light', 'medium'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 3,
    options: ['athletics', 'intimidation'],
    label: 'Trained in 3 + Int skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'rage',
          name: 'Rage',
          source: 'Barbarian 1',
          description:
            "You gain the Rage action. You can use Rage as a free action at the start of your turn. While raging, you deal +2 damage with melee Strikes and thrown weapon attacks, but take a -1 penalty to AC and can't use concentrate actions unless they also have the rage trait.",
        },
        {
          id: 'instinct',
          name: 'Instinct',
          source: 'Barbarian 1',
          description:
            'Your rage is fueled by a powerful instinct. Choose an instinct: Animal, Dragon, Fury, Giant, Spirit, or Superstition.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'deny-advantage',
          name: 'Deny Advantage',
          source: 'Barbarian 3',
          description: "You aren't flat-footed to flanking creatures of your level or lower.",
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'brutality',
          name: 'Brutality',
          source: 'Barbarian 5',
          description: 'Your proficiency rank for simple and martial weapons increases to expert.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'juggernaut',
          name: 'Juggernaut',
          source: 'Barbarian 7',
          description:
            'Your proficiency rank for Fortitude saves increases to master. When you roll a success on a Fortitude save, you get a critical success instead.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'lightning-reflexes',
          name: 'Lightning Reflexes',
          source: 'Barbarian 9',
          description: 'Your proficiency rank for Reflex saves increases to expert.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'mighty-rage',
          name: 'Mighty Rage',
          source: 'Barbarian 11',
          description: 'Your Rage gains the flourish trait, and the damage bonus increases to +6.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'greater-juggernaut',
          name: 'Greater Juggernaut',
          source: 'Barbarian 13',
          description: 'Your proficiency rank for Fortitude saves increases to legendary.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'weapon-fury',
          name: 'Weapon Fury',
          source: 'Barbarian 15',
          description: 'Your proficiency rank for simple and martial weapons increases to master.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'armor-of-fury',
          name: 'Armor of Fury',
          source: 'Barbarian 17',
          description: 'Your proficiency rank for light and medium armor increases to master.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'devastator',
          name: 'Devastator',
          source: 'Barbarian 19',
          description: 'Your Strikes ignore 10 points of resistance.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'animal',
      name: 'Animal Instinct',
      parentClassId: 'barbarian',
      description:
        'You are filled with the fury of an animal, channeling the primal power of a beast.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'animal-rage',
              name: 'Animal Rage',
              source: 'Animal Instinct 1',
              description:
                'When you Rage, you transform partially into your animal. Choose an animal from ape, bear, bull, cat, deer, frog, shark, or snake. Your unarmed attacks gain traits and damage based on your animal.',
            },
            {
              id: 'bestial-rage',
              name: 'Bestial Rage',
              source: 'Animal Instinct 1',
              description:
                'Your melee Strikes deal +2 additional damage. This increases to +6 at 7th level and +10 at 15th level.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'animal-skin',
              name: 'Animal Skin',
              source: 'Animal Instinct 3',
              description:
                'Your proficiency in unarmored defense increases to expert, and you gain a +1 circumstance bonus to AC.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'animal-acrobatics',
              name: 'Animal Acrobatics',
              source: 'Animal Instinct 7',
              description:
                'When you Rage, you gain a climb or swim Speed equal to your land Speed.',
            },
          ],
        },
      ],
    },
    {
      id: 'dragon',
      name: 'Dragon Instinct',
      parentClassId: 'barbarian',
      description: 'You summon the fury and power of dragons into your body and soul.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'draconic-rage',
              name: 'Draconic Rage',
              source: 'Dragon Instinct 1',
              description:
                'Choose a dragon type. When you Rage, you deal +4 damage instead of +2, and you gain resistance 3 to the damage type associated with your dragon.',
            },
            {
              id: 'breath-weapon',
              name: 'Breath Weapon',
              source: 'Dragon Instinct 1',
              description:
                'You can use a breath weapon as a 2-action activity. Choose between a cone or line based on your dragon type.',
            },
          ],
        },
        {
          level: 6,
          features: [
            {
              id: 'dragon-transformation',
              name: 'Dragon Transformation',
              source: 'Dragon Instinct 6',
              description:
                'When raging, you sprout dragon wings and gain a fly Speed equal to your land Speed.',
            },
          ],
        },
      ],
    },
    {
      id: 'fury',
      name: 'Fury Instinct',
      parentClassId: 'barbarian',
      description:
        'Your rage is a pure, primal expression of fury unencumbered by any specific philosophy.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'fury-rage',
              name: 'Fury Rage',
              source: 'Fury Instinct 1',
              description:
                "You can use any weapon while raging without restriction. You don't gain specialization effects while raging.",
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'fury-specialization',
              name: 'Fury Specialization',
              source: 'Fury Instinct 7',
              description:
                'Your rage damage increases by an additional +2 with all weapons and unarmed attacks.',
            },
          ],
        },
      ],
    },
    {
      id: 'giant',
      name: 'Giant Instinct',
      parentClassId: 'barbarian',
      description: 'Your rage gives you incredible strength and size, like that of a giant.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'titan-mauler',
              name: 'Titan Mauler',
              source: 'Giant Instinct 1',
              description:
                'You can use weapons that are one size larger than you without penalty. When you Rage, you deal +6 damage instead of +2, but take a -1 penalty to AC.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'giant-stature',
              name: 'Giant Stature',
              source: 'Giant Instinct 3',
              description:
                'You can use Giant Stature to grow to Large size, increasing your reach by 5 feet.',
            },
          ],
        },
        {
          level: 6,
          features: [
            {
              id: 'giants-lunge',
              name: "Giant's Lunge",
              source: 'Giant Instinct 6',
              description:
                'Your attacks have incredible reach. While raging, you can increase your reach by 10 feet until the end of your turn.',
            },
          ],
        },
      ],
    },
    {
      id: 'spirit',
      name: 'Spirit Instinct',
      parentClassId: 'barbarian',
      description:
        'Whether through reverence for spirits or a deep connection to the supernatural, your rage connects you to the spirit world.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'spirit-rage',
              name: 'Spirit Rage',
              source: 'Spirit Instinct 1',
              description:
                'Your Strikes deal +2 damage (increasing to +6 at 7th level and +10 at 15th level). Your weapon and unarmed attacks gain the effects of the ghost touch property rune.',
            },
            {
              id: 'spirit-sense',
              name: 'Spirit Sense',
              source: 'Spirit Instinct 1',
              description:
                'You gain the ability to sense spiritual disturbances and undead creatures within 60 feet.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'spiritual-resistance',
              name: 'Spiritual Resistance',
              source: 'Spirit Instinct 3',
              description:
                'You gain resistance equal to 2 + your level to negative damage and damage from undead creatures.',
            },
          ],
        },
      ],
    },
    {
      id: 'superstition',
      name: 'Superstition Instinct',
      parentClassId: 'barbarian',
      description:
        'A deep distrust of magic drives you to avoid its corrupting touch and strike down spellcasters.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'superstitious-rage',
              name: 'Superstitious Rage',
              source: 'Superstition Instinct 1',
              description:
                "While raging, you gain a +2 status bonus to all saves against magic. You can't voluntarily accept the effects of magic spells, even allies' beneficial spells.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'raging-resistance',
              name: 'Raging Resistance',
              source: 'Superstition Instinct 3',
              description:
                'You gain resistance equal to 3 + your Constitution modifier to damage from spells.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'vengeful-strike',
              name: 'Vengeful Strike',
              source: 'Superstition Instinct 7',
              description:
                "When a creature casts a spell that affects you while you're raging, you can use your reaction to make a melee Strike against that creature.",
            },
          ],
        },
      ],
    },
    {
      id: 'reckless',
      name: 'Reckless Instinct',
      parentClassId: 'barbarian',
      description:
        'You throw caution to the wind, attacking with wild abandon and accepting the consequences.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'reckless-rage',
              name: 'Reckless Rage',
              source: 'Reckless Instinct 1',
              description:
                'While raging, you gain a +1 status bonus to melee attack rolls, but enemies gain a +1 status bonus to attack rolls against you.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'reckless-abandon',
              name: 'Reckless Abandon',
              source: 'Reckless Instinct 3',
              description:
                'When you critically fail a save while raging, you get a failure instead.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'reckless-momentum',
              name: 'Reckless Momentum',
              source: 'Reckless Instinct 7',
              description:
                'When you hit with a melee Strike while raging, you gain a +1 status bonus to your next melee Strike before the end of your turn.',
            },
          ],
        },
      ],
    },
    {
      id: 'witch',
      name: 'Witch Instinct',
      parentClassId: 'barbarian',
      description:
        'You have a connection to witchcraft, granting you hexes and supernatural power.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'witch-hex',
              name: 'Witch Hex',
              source: 'Witch Instinct 1',
              description:
                'You gain the witch hex focus spell. You can curse your foes with supernatural effects.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'hexing-strikes',
              name: 'Hexing Strikes',
              source: 'Witch Instinct 3',
              description:
                'When you hit with a melee Strike while raging, you can apply a hex effect to the target.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'greater-hex',
              name: 'Greater Hex',
              source: 'Witch Instinct 7',
              description: 'Your hexes become more powerful and harder to resist.',
            },
          ],
        },
      ],
    },
  ],
  classResources: [],
  multiclassRequirements: [
    { type: 'attribute', value: 14, description: 'Strength 14 and Constitution 14' },
  ],
  multiclassProficiencies: {
    armor: ['light', 'medium'],
    weapons: ['simple', 'martial'],
    tools: [],
  },
  description:
    'Rage consumes you in battle. You delight in carving through your enemies using powerful weapons and punishing blows.',
  displayMetadata: {
    icon: 'axe',
    color: '#8B0000',
    shortDescription: 'A fierce warrior fueled by primal rage.',
    playStyle: 'Aggressive melee combatant with instinct-based abilities',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Aggressive players', 'Simple but powerful builds'],
    tags: ['martial', 'melee'],
  },
};
