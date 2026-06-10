import { CharacterClass } from '../../../../../types/character-options/classes';

export const wizard: CharacterClass = {
  id: 'wizard',
  name: 'Wizard',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: "Player's Handbook 3.5",
    url: 'https://www.d20srd.org/srd/classes/wizard.htm',
  },

  hitDie: 'd4',
  d20Profile: {
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
  },
  primaryAbility: ['int'],

  armorProficiencies: [],
  weaponProficiencies: ['club', 'dagger', 'heavy-crossbow', 'light-crossbow', 'quarterstaff'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['concentration', 'spellcraft', 'knowledge', 'appraise'],
    label: 'Choose two skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '3d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'spellcasting',
          name: 'Spellcasting',
          source: 'Wizard 1',
          description:
            'A wizard casts arcane spells which are drawn from the sorcerer/wizard spell list. A wizard must choose and prepare her spells ahead of time. To learn, prepare, or cast a spell, the wizard must have an Intelligence score equal to at least 10 + the spell level.',
        },
        {
          id: 'scribe-scroll',
          name: 'Scribe Scroll',
          source: 'Wizard 1',
          description: 'At 1st level, a wizard gains Scribe Scroll as a bonus feat.',
        },
        {
          id: 'arcane-spellcasting',
          name: 'Arcane Spellcasting',
          source: 'Wizard 1',
          description:
            'Wizards cast arcane spells from the sorcerer/wizard spell list. They must study their spellbooks each day to prepare their spells.',
        },
        {
          id: 'bonus-languages',
          name: 'Bonus Languages',
          source: 'Wizard 1',
          description:
            'A wizard may substitute Draconic for one of the bonus languages available to the character because of his race.',
        },
        {
          id: 'familiar',
          name: 'Familiar',
          source: 'Wizard 1',
          description:
            'A wizard can obtain a familiar. A familiar grants special abilities to its master.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'wizard-2',
          name: 'Improved Spellcasting',
          source: 'Wizard 2',
          description: 'Your spellcasting improves.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'wizard-3',
          name: 'Spell Mastery',
          source: 'Wizard 3',
          description: 'You master spell preparation.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'wizard-4',
          name: 'Ability Increase',
          source: 'Wizard 4',
          description: 'You gain an ability score increase.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'bonus-feat-5',
          name: 'Bonus Feat',
          source: 'Wizard 5',
          description:
            'At 5th, 10th, 15th, and 20th level, a wizard gains a bonus feat. At each such opportunity, she can choose a metamagic feat, an item creation feat, or Spell Mastery.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'wizard-6',
          name: 'Enhanced Spellcasting',
          source: 'Wizard 6',
          description: 'Your spellcasting becomes more powerful.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'wizard-7',
          name: 'Arcane Mastery',
          source: 'Wizard 7',
          description: 'You achieve arcane mastery.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'wizard-8',
          name: 'Ability Increase',
          source: 'Wizard 8',
          description: 'You gain another ability score increase.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'wizard-9',
          name: 'Greater Spellcasting',
          source: 'Wizard 9',
          description: 'Your spellcasting reaches greater heights.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'bonus-feat-10',
          name: 'Bonus Feat',
          source: 'Wizard 10',
          description: 'The wizard gains a bonus feat.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'wizard-11',
          name: 'Supreme Spellcasting',
          source: 'Wizard 11',
          description: 'Your spellcasting reaches supreme power.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'wizard-12',
          name: 'Ability Increase',
          source: 'Wizard 12',
          description: 'You gain another ability score increase.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'wizard-13',
          name: 'Perfect Spellcasting',
          source: 'Wizard 13',
          description: 'Your spellcasting becomes perfect.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'wizard-14',
          name: 'Arcane Perfection',
          source: 'Wizard 14',
          description: 'You achieve arcane perfection.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'bonus-feat-15',
          name: 'Bonus Feat',
          source: 'Wizard 15',
          description: 'The wizard gains a bonus feat.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'wizard-16',
          name: 'Ability Increase',
          source: 'Wizard 16',
          description: 'You gain another ability score increase.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'wizard-17',
          name: 'Magical Ascension',
          source: 'Wizard 17',
          description: 'You achieve magical ascension.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'wizard-18',
          name: 'Ultimate Spellcasting',
          source: 'Wizard 18',
          description: 'Your spellcasting reaches ultimate power.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'wizard-19',
          name: 'Arcane Apotheosis',
          source: 'Wizard 19',
          description: 'You near arcane apotheosis.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'bonus-feat-20',
          name: 'Bonus Feat',
          source: 'Wizard 20',
          description: 'The wizard gains a bonus feat.',
        },
      ],
    },
  ],

  subclassLevel: 1,
  subclasses: [],

  classResources: [],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description: 'A powerful spellcaster who studies arcane lore and magic.',

  displayMetadata: {
    icon: 'wand',
    color: '#4169E1',
    shortDescription: 'A scholarly magic-user capable of manipulating arcane forces.',
    playStyle: 'Versatile spellcaster',
    complexity: 'complex',
    role: 'controller',
    idealFor: ['Strategy enthusiasts', 'Magic-focused players'],
    tags: ['arcane', 'spellcaster', 'versatile'],
    casterType: 'full',
  },
};
