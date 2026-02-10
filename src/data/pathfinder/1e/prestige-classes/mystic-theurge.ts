import { CharacterClass } from '../../../../types/character-options/classes';

export const mysticTheurge: CharacterClass = {
  id: 'mystic-theurge',
  name: 'Mystic Theurge',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: { name: 'Pathfinder Core Rulebook', page: 412, url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/mystic-theurge/' },
  hitDie: 'd6',
  primaryAbility: ['int', 'wis'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['club', 'dagger', 'quarterstaff'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['knowledge-arcana', 'knowledge-religion', 'spellcraft'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    { level: 1, features: [
      { id: 'combined-spellcasting', name: 'Combined Spellcasting', source: 'Mystic Theurge 1', description: 'Advance both arcane and divine spellcasting progressions simultaneously.' },
      { id: 'spell-synthesis', name: 'Spell Synthesis', source: 'Mystic Theurge 1', description: 'Combine arcane and divine spells for enhanced effects.' },
    ]},
    { level: 2, features: [
      { id: 'arcane-divine-bond', name: 'Arcane Divine Bond', source: 'Mystic Theurge 2', description: 'Gain +1 to spell DCs for both arcane and divine spells.' },
    ]},
    { level: 3, features: [
      { id: 'dual-casting', name: 'Dual Casting', source: 'Mystic Theurge 3', description: 'Cast both an arcane and divine spell in the same round.' },
    ]},
    { level: 4, features: [
      { id: 'spell-synthesis-2', name: 'Spell Synthesis', source: 'Mystic Theurge 4', description: 'Combine more complex arcane and divine spells.' },
    ]},
    { level: 5, features: [
      { id: 'unified-magic', name: 'Unified Magic', source: 'Mystic Theurge 5', description: 'Gain +1d6 damage when casting combined spells.' },
    ]},
    { level: 7, features: [
      { id: 'spell-synthesis-3', name: 'Spell Synthesis', source: 'Mystic Theurge 7', description: 'Combine the most powerful arcane and divine spells.' },
    ]},
    { level: 10, features: [
      { id: 'ultimate-theurge', name: 'Ultimate Theurge', source: 'Mystic Theurge 10', description: 'Become the ultimate master of both magics, casting combined spells with devastating power.' },
    ]},
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A master of both arcane and divine magic who advances both spellcasting progressions and combines them for devastating effects.',
};
