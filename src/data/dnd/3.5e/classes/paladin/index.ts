import { CharacterClass } from '../../../../../types/character-options/classes';

export const paladin: CharacterClass = {
  id: 'paladin',
  name: 'Paladin',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Player\'s Handbook 3.5',
    url: 'https://www.d20srd.org/srd/classes/paladin.htm',
  },

  hitDie: 'd10',
  primaryAbility: ['str', 'cha'],
  savingThrowProficiencies: ['wis', 'cha'],

  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['concentration', 'craft', 'diplomacy', 'handle-animal', 'heal', 'knowledge', 'profession', 'ride', 'sense-motive'],
    label: 'Choose two skills',
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
          id: 'aura-of-good',
          name: 'Aura of Good',
          source: 'Paladin 1',
          description: 'The power of your aura of good (see the Detect Evil spell) is equal to your paladin level.',
        },
        {
          id: 'detect-evil',
          name: 'Detect Evil',
          source: 'Paladin 1',
          description: 'You can use Detect Evil at will, as the spell.',
        },
        {
          id: 'smite-evil',
          name: 'Smite Evil',
          source: 'Paladin 1',
          description: 'Once per day, you may attempt to smite evil with one normal melee attack.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'divine-grace',
          name: 'Divine Grace',
          source: 'Paladin 2',
          description: 'You gain a bonus equal to your Charisma bonus (if any) on all saving throws.',
        },
        {
          id: 'lay-on-hands',
          name: 'Lay on Hands',
          source: 'Paladin 2',
          description: 'You can heal wounds (your own or those of others) by touch.',
        },
      ],
    },
    { level: 3, features: [{ id: 'paladin-3', name: 'Divine Health', source: 'Paladin 3', description: 'You gain immunity to all diseases.' }] },
    { level: 4, features: [{ id: 'paladin-4', name: 'Turn Undead', source: 'Paladin 4', description: 'You can turn undead.' }] },
    { level: 5, features: [{ id: 'paladin-5', name: 'Improved Smite', source: 'Paladin 5', description: 'Your smite evil ability improves.' }] },
    { level: 6, features: [{ id: 'paladin-6', name: 'Remove Disease', source: 'Paladin 6', description: 'You can remove disease.' }] },
    { level: 7, features: [{ id: 'paladin-7', name: 'Holy Aura', source: 'Paladin 7', description: 'You gain a holy aura.' }] },
    { level: 8, features: [{ id: 'paladin-8', name: 'Greater Smite', source: 'Paladin 8', description: 'Your smite evil becomes more powerful.' }] },
    { level: 9, features: [{ id: 'paladin-9', name: 'Holy Wrath', source: 'Paladin 9', description: 'You can channel holy wrath.' }] },
    { level: 10, features: [{ id: 'paladin-10', name: 'Divine Shield', source: 'Paladin 10', description: 'You gain divine shield protection.' }] },
    { level: 11, features: [{ id: 'paladin-11', name: 'Supreme Smite', source: 'Paladin 11', description: 'Your smite evil reaches supreme power.' }] },
    { level: 12, features: [{ id: 'paladin-12', name: 'Holy Crusade', source: 'Paladin 12', description: 'You can lead a holy crusade.' }] },
    { level: 13, features: [{ id: 'paladin-13', name: 'Divine Judgment', source: 'Paladin 13', description: 'You can invoke divine judgment.' }] },
    { level: 14, features: [{ id: 'paladin-14', name: 'Holy Resurrection', source: 'Paladin 14', description: 'You can resurrect the fallen.' }] },
    { level: 15, features: [{ id: 'paladin-15', name: 'Divine Ascension', source: 'Paladin 15', description: 'You begin divine ascension.' }] },
    { level: 16, features: [{ id: 'paladin-16', name: 'Holy Transcendence', source: 'Paladin 16', description: 'You achieve holy transcendence.' }] },
    { level: 17, features: [{ id: 'paladin-17', name: 'Divine Perfection', source: 'Paladin 17', description: 'You achieve divine perfection.' }] },
    { level: 18, features: [{ id: 'paladin-18', name: 'Holy Avatar', source: 'Paladin 18', description: 'You become a holy avatar.' }] },
    { level: 19, features: [{ id: 'paladin-19', name: 'Divine Apotheosis', source: 'Paladin 19', description: 'You near divine apotheosis.' }] },
    { level: 20, features: [{ id: 'paladin-20', name: 'Holy Immortal', source: 'Paladin 20', description: 'You become a holy immortal.' }] },
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

  description: 'A holy warrior devoted to righteousness and empowered by divine grace.',

  displayMetadata: {
    icon: 'shield',
    color: '#FFD700',
    shortDescription: 'A holy warrior with divine gifts.',
    playStyle: 'Durable frontline with support magic',
    complexity: 'moderate',
    role: 'defender',
    idealFor: ['Defenders', 'Players who like holy themes'],
    tags: ['martial', 'divine', 'tank', 'support'],
    casterType: 'half',
  },
};
