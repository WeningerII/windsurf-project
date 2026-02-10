import { Species } from '../../../../types/character-options/species';

export const elf: Species = {
  id: 'elf',
  name: 'Elf',
  system: 'pf1e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, int: 2, con: -2 } },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Elven'],
    choice: { count: 0, options: ['Celestial', 'Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'], label: 'Bonus languages' },
  },
  
  traits: [
    { id: 'low-light-vision', name: 'Low-Light Vision', source: 'Elf', description: 'Elves can see twice as far as humans in conditions of dim light.' },
    { id: 'elven-immunities', name: 'Elven Immunities', source: 'Elf', description: 'Elves are immune to magic sleep effects and gain a +2 racial saving throw bonus against enchantment spells and effects.' },
    { id: 'elven-magic', name: 'Elven Magic', source: 'Elf', description: 'Elves receive a +2 racial bonus on caster level checks made to overcome spell resistance. In addition, elves receive a +2 racial bonus on Spellcraft skill checks made to identify the properties of magic items.' },
    { id: 'keen-senses', name: 'Keen Senses', source: 'Elf', description: 'Elves receive a +2 racial bonus on Perception checks.' },
    { id: 'weapon-familiarity', name: 'Weapon Familiarity', source: 'Elf', description: 'Elves are proficient with longbows, longswords, rapiers, and shortbows, and treat any weapon with the word "elven" in its name as a martial weapon.' },
  ],
  
  description: 'The long-lived elves are children of the natural world, similar in many superficial ways to fey creatures, though with key differences.',
  ageInfo: 'Elves reach physical adulthood at 110 years and can live over 700 years.',
  alignmentTendency: 'Elves are often chaotic good.',
  sizeDescription: 'Elves are Medium creatures and have no bonuses or penalties due to their size.',
};
