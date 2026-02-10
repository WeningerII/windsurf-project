import { Species } from '../../../../types/character-options/species';

export const halfElf: Species = {
  id: 'half-elf',
  name: 'Half-Elf',
  system: 'pf1e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'choice', choice: { count: 1, options: ['str', 'dex', 'con', 'int', 'wis', 'cha'], label: 'Choose one ability score' }, values: [2] },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Elven'],
    choice: { count: 0, options: ['Any'], label: 'Bonus languages (any)' },
  },
  
  traits: [
    { id: 'low-light-vision', name: 'Low-Light Vision', source: 'Half-Elf', description: 'Half-elves can see twice as far as humans in conditions of dim light.' },
    { id: 'adaptability', name: 'Adaptability', source: 'Half-Elf', description: 'Half-elves receive Skill Focus as a bonus feat at 1st level.' },
    { id: 'elf-blood', name: 'Elf Blood', source: 'Half-Elf', description: 'Half-elves count as both elves and humans for any effect related to race.' },
    { id: 'elven-immunities', name: 'Elven Immunities', source: 'Half-Elf', description: 'Half-elves are immune to magic sleep effects and gain a +2 racial saving throw bonus against enchantment spells and effects.' },
    { id: 'keen-senses', name: 'Keen Senses', source: 'Half-Elf', description: 'Half-elves receive a +2 racial bonus on Perception checks.' },
    { id: 'multitalented', name: 'Multitalented', source: 'Half-Elf', description: 'Half-elves choose two favored classes at first level and gain +1 hit point or +1 skill point whenever they take a level in either one of those classes.' },
  ],
  
  description: 'Elves have long drawn the covetous gazes of other races. Their generous lifespans, magical affinity, and inherent grace each contribute to the admiration or bitter envy of their neighbors.',
  ageInfo: 'Half-elves reach adulthood at 20 and can live over 180 years.',
  alignmentTendency: 'Half-elves share the chaotic bent of their elven heritage.',
  sizeDescription: 'Half-elves are Medium creatures and have no bonuses or penalties due to their size.',
};
