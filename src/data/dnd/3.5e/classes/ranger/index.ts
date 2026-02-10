import { CharacterClass } from '../../../../../types/character-options/classes';

export const ranger: CharacterClass = {
  id: 'ranger',
  name: 'Ranger',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Player\'s Handbook 3.5',
    url: 'https://www.d20srd.org/srd/classes/ranger.htm',
  },

  hitDie: 'd8',
  primaryAbility: ['dex', 'wis'],
  savingThrowProficiencies: ['str', 'dex'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 4,
    options: ['climb', 'concentration', 'craft', 'handle-animal', 'heal', 'hide', 'jump', 'knowledge', 'listen', 'move-silently', 'profession', 'ride', 'search', 'spot', 'survival', 'swim', 'use-rope'],
    label: 'Choose four skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '5d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'favored-enemy',
          name: 'Favored Enemy',
          source: 'Ranger 1',
          description: 'You select a creature type from the Favored Enemies table. You gain a bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks when using these skills against creatures of this type.',
        },
        {
          id: 'track',
          name: 'Track',
          source: 'Ranger 1',
          description: 'You gain Track as a bonus feat.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'combat-style',
          name: 'Combat Style',
          source: 'Ranger 2',
          description: 'You select a combat style (Archery or Two-Weapon Combat) and gain style feats as you gain levels.',
        },
      ],
    },
    { level: 3, features: [{ id: 'ranger-3', name: 'Endurance', source: 'Ranger 3', description: 'You gain the Endurance feat.' }] },
    { level: 4, features: [{ id: 'ranger-4', name: 'Animal Companion', source: 'Ranger 4', description: 'You gain an animal companion.' }] },
    { level: 5, features: [{ id: 'ranger-5', name: 'Improved Combat Style', source: 'Ranger 5', description: 'Your combat style improves.' }] },
    { level: 6, features: [{ id: 'ranger-6', name: 'Spellcasting', source: 'Ranger 6', description: 'You gain the ability to cast ranger spells.' }] },
    { level: 7, features: [{ id: 'ranger-7', name: 'Woodland Stride', source: 'Ranger 7', description: 'You can move through natural terrain without difficulty.' }] },
    { level: 8, features: [{ id: 'ranger-8', name: 'Swift Tracker', source: 'Ranger 8', description: 'You can track while moving at normal speed.' }] },
    { level: 9, features: [{ id: 'ranger-9', name: 'Evasion', source: 'Ranger 9', description: 'You gain evasion.' }] },
    { level: 10, features: [{ id: 'ranger-10', name: 'Greater Combat Style', source: 'Ranger 10', description: 'Your combat style becomes even more powerful.' }] },
    { level: 11, features: [{ id: 'ranger-11', name: 'Quarry', source: 'Ranger 11', description: 'You can designate a quarry.' }] },
    { level: 12, features: [{ id: 'ranger-12', name: 'Camouflage', source: 'Ranger 12', description: 'You can hide in natural terrain.' }] },
    { level: 13, features: [{ id: 'ranger-13', name: 'Improved Evasion', source: 'Ranger 13', description: 'Your evasion improves.' }] },
    { level: 14, features: [{ id: 'ranger-14', name: 'Master Combat Style', source: 'Ranger 14', description: 'Your combat style reaches mastery.' }] },
    { level: 15, features: [{ id: 'ranger-15', name: 'Improved Quarry', source: 'Ranger 15', description: 'Your quarry ability improves.' }] },
    { level: 16, features: [{ id: 'ranger-16', name: 'Hide in Plain Sight', source: 'Ranger 16', description: 'You can hide even while being observed.' }] },
    { level: 17, features: [{ id: 'ranger-17', name: 'Supreme Evasion', source: 'Ranger 17', description: 'Your evasion reaches supreme power.' }] },
    { level: 18, features: [{ id: 'ranger-18', name: 'Perfect Combat Style', source: 'Ranger 18', description: 'Your combat style becomes perfect.' }] },
    { level: 19, features: [{ id: 'ranger-19', name: 'Master Tracker', source: 'Ranger 19', description: 'You become a master tracker.' }] },
    { level: 20, features: [{ id: 'ranger-20', name: 'Perfect Ranger', source: 'Ranger 20', description: 'You achieve perfect ranger mastery.' }] },
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

  description: 'A warrior who draws on nature and martial training to hunt foes and survive the wilds.',

  displayMetadata: {
    icon: 'bow',
    color: '#556B2F',
    shortDescription: 'A hunter and tracker of the wilds.',
    playStyle: 'Martial striker with wilderness utility',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Wilderness-focused campaigns'],
    tags: ['martial', 'ranged', 'versatile'],
    casterType: 'half',
  },
};
