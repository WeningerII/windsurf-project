import { CharacterClass } from '../../../../../types/character-options/classes';

export const monk: CharacterClass = {
  id: 'monk',
  name: 'Monk',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Player\'s Handbook 3.5',
    url: 'https://www.d20srd.org/srd/classes/monk.htm',
  },

  hitDie: 'd8',
  primaryAbility: ['dex', 'wis'],
  savingThrowProficiencies: ['dex', 'wis'],

  armorProficiencies: [],
  weaponProficiencies: ['club', 'crossbow', 'dagger', 'handaxe', 'javelin', 'kama', 'nunchaku', 'quarterstaff', 'sai', 'shuriken', 'siangham', 'sling'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 4,
    options: ['balance', 'climb', 'concentration', 'craft', 'diplomacy', 'escape-artist', 'hide', 'jump', 'knowledge', 'listen', 'move-silently', 'perform', 'profession', 'sense-motive', 'spot', 'swim', 'tumble'],
    label: 'Choose four skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '5d4',
    multiplier: 1,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'flurry-of-blows',
          name: 'Flurry of Blows',
          source: 'Monk 1',
          description: 'When unarmored, you may make an extra attack when you take the Attack action, but you take penalties to your attacks.',
        },
        {
          id: 'unarmed-strike',
          name: 'Unarmed Strike',
          source: 'Monk 1',
          description: 'You deal more damage with unarmed strikes and are treated as armed.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'evasion-monk',
          name: 'Evasion',
          source: 'Monk 2',
          description: 'If you succeed on a Reflex save that would normally deal half damage, you take no damage instead.',
        },
      ],
    },
    { level: 3, features: [{ id: 'monk-3', name: 'Still Mind', source: 'Monk 3', description: 'You gain a +2 bonus on saves against enchantment spells.' }] },
    { level: 4, features: [{ id: 'monk-4', name: 'Ki Strike', source: 'Monk 4', description: 'Your unarmed strikes count as magical weapons.' }] },
    { level: 5, features: [{ id: 'monk-5', name: 'Purity of Body', source: 'Monk 5', description: 'You gain immunity to all diseases.' }] },
    { level: 6, features: [{ id: 'monk-6', name: 'Improved Evasion', source: 'Monk 6', description: 'Your evasion ability improves.' }] },
    { level: 7, features: [{ id: 'monk-7', name: 'Wholeness of Body', source: 'Monk 7', description: 'You can heal yourself.' }] },
    { level: 8, features: [{ id: 'monk-8', name: 'Improved Ki Strike', source: 'Monk 8', description: 'Your ki strikes become more powerful.' }] },
    { level: 9, features: [{ id: 'monk-9', name: 'Diamond Body', source: 'Monk 9', description: 'You gain immunity to poisons.' }] },
    { level: 10, features: [{ id: 'monk-10', name: 'Improved Flurry', source: 'Monk 10', description: 'Your flurry of blows improves.' }] },
    { level: 11, features: [{ id: 'monk-11', name: 'Greater Ki Strike', source: 'Monk 11', description: 'Your ki strikes become even more powerful.' }] },
    { level: 12, features: [{ id: 'monk-12', name: 'Abundant Step', source: 'Monk 12', description: 'You can teleport short distances.' }] },
    { level: 13, features: [{ id: 'monk-13', name: 'Diamond Soul', source: 'Monk 13', description: 'You gain spell resistance.' }] },
    { level: 14, features: [{ id: 'monk-14', name: 'Superior Ki Strike', source: 'Monk 14', description: 'Your ki strikes reach ultimate power.' }] },
    { level: 15, features: [{ id: 'monk-15', name: 'Quivering Palm', source: 'Monk 15', description: 'You can strike with deadly precision.' }] },
    { level: 16, features: [{ id: 'monk-16', name: 'Improved Abundant Step', source: 'Monk 16', description: 'Your teleportation improves.' }] },
    { level: 17, features: [{ id: 'monk-17', name: 'Timeless Body', source: 'Monk 17', description: 'You no longer age.' }] },
    { level: 18, features: [{ id: 'monk-18', name: 'Perfect Self', source: 'Monk 18', description: 'You achieve perfect self.' }] },
    { level: 19, features: [{ id: 'monk-19', name: 'Empty Mind', source: 'Monk 19', description: 'Your mind becomes empty and perfect.' }] },
    { level: 20, features: [{ id: 'monk-20', name: 'Perfect Enlightenment', source: 'Monk 20', description: 'You achieve perfect enlightenment.' }] },
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

  description: 'A martial artist who channels inner discipline into extraordinary feats.',

  displayMetadata: {
    icon: 'fist',
    color: '#DAA520',
    shortDescription: 'A disciplined martial artist.',
    playStyle: 'Mobile melee combatant',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Players who like mobility'],
    tags: ['martial', 'melee', 'versatile'],
  },
};
