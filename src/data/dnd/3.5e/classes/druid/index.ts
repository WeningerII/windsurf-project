import { CharacterClass } from '../../../../../types/character-options/classes';

export const druid: CharacterClass = {
  id: 'druid',
  name: 'Druid',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Player\'s Handbook 3.5',
    url: 'https://www.d20srd.org/srd/classes/druid.htm',
  },

  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['int', 'wis'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['club', 'dagger', 'dart', 'quarterstaff', 'scimitar', 'sickle', 'shortspear', 'sling', 'spear'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 4,
    options: ['concentration', 'craft', 'diplomacy', 'handle-animal', 'heal', 'knowledge', 'listen', 'profession', 'ride', 'spellcraft', 'spot', 'survival', 'swim'],
    label: 'Choose four skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '2d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'nature-sense',
          name: 'Nature Sense',
          source: 'Druid 1',
          description: 'You gain a +2 bonus on Knowledge (nature) and Survival checks.',
        },
        {
          id: 'wild-empathy',
          name: 'Wild Empathy',
          source: 'Druid 1',
          description: 'You can improve the attitude of an animal. This ability functions like a Diplomacy check made to improve the attitude of a person.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'woodland-stride',
          name: 'Woodland Stride',
          source: 'Druid 2',
          description: 'You may move through natural thorns, briars, overgrown areas, and similar terrain at your normal speed and without taking damage.',
        },
      ],
    },
    { level: 3, features: [{ id: 'druid-3', name: 'Trackless Step', source: 'Druid 3', description: 'You leave no trail in natural surroundings.' }] },
    { level: 4, features: [{ id: 'druid-4', name: 'Resist Nature\'s Lure', source: 'Druid 4', description: 'You gain a +4 bonus on saves against spells and effects from fey.' }] },
    {
      level: 5,
      features: [
        {
          id: 'wild-shape',
          name: 'Wild Shape',
          source: 'Druid 5',
          description: 'You can turn yourself into an animal and back again once per day.',
        },
      ],
    },
    { level: 6, features: [{ id: 'druid-6', name: 'Wild Shape Improvement', source: 'Druid 6', description: 'Wild shape can be used twice per day.' }] },
    { level: 7, features: [{ id: 'druid-7', name: 'Timeless Body', source: 'Druid 7', description: 'You no longer take ability score penalties for aging.' }] },
    { level: 8, features: [{ id: 'druid-8', name: 'Wild Shape Improvement', source: 'Druid 8', description: 'Wild shape can be used three times per day.' }] },
    { level: 9, features: [{ id: 'druid-9', name: 'Venom Immunity', source: 'Druid 9', description: 'You gain immunity to all poisons.' }] },
    { level: 10, features: [{ id: 'druid-10', name: 'Wild Shape Improvement', source: 'Druid 10', description: 'Wild shape can be used four times per day.' }] },
    { level: 11, features: [{ id: 'druid-11', name: 'A Thousand Faces', source: 'Druid 11', description: 'You can change your appearance at will.' }] },
    { level: 12, features: [{ id: 'druid-12', name: 'Wild Shape Improvement', source: 'Druid 12', description: 'Wild shape can be used five times per day.' }] },
    { level: 13, features: [{ id: 'druid-13', name: 'Nature\'s Ally', source: 'Druid 13', description: 'You can summon nature\'s allies.' }] },
    { level: 14, features: [{ id: 'druid-14', name: 'Wild Shape Improvement', source: 'Druid 14', description: 'Wild shape can be used six times per day.' }] },
    { level: 15, features: [{ id: 'druid-15', name: 'Nature\'s Wrath', source: 'Druid 15', description: 'Nature itself answers your call.' }] },
    { level: 16, features: [{ id: 'druid-16', name: 'Wild Shape Improvement', source: 'Druid 16', description: 'Wild shape can be used seven times per day.' }] },
    { level: 17, features: [{ id: 'druid-17', name: 'Primal Form', source: 'Druid 17', description: 'You achieve a primal form.' }] },
    { level: 18, features: [{ id: 'druid-18', name: 'Wild Shape Improvement', source: 'Druid 18', description: 'Wild shape can be used eight times per day.' }] },
    { level: 19, features: [{ id: 'druid-19', name: 'Nature\'s Perfection', source: 'Druid 19', description: 'You achieve perfect harmony with nature.' }] },
    { level: 20, features: [{ id: 'druid-20', name: 'One with Nature', source: 'Druid 20', description: 'You become one with nature itself.' }] },
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

  description: 'A divine caster who draws power from nature and can take the shapes of animals.',

  displayMetadata: {
    icon: 'leaf',
    color: '#228B22',
    shortDescription: 'A nature priest and shapeshifter.',
    playStyle: 'Versatile caster with summons and shapeshifting',
    complexity: 'complex',
    role: 'hybrid',
    idealFor: ['Players who like versatility'],
    tags: ['spellcaster', 'primal', 'summoner', 'shapeshifter', 'versatile'],
    casterType: 'full',
  },
};
