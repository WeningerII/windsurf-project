import { Species } from '../../../../types/character-options/species';

export const orc: Species = {
  id: 'orc',
  name: 'Orc',
  system: 'pf2e',
  source: 'Advanced Player\'s Guide',
  
  abilityScoreIncrease: [
    { type: 'fixed', attributes: { str: 2 } },
    { type: 'choice', choice: { count: 2, options: ['dex', 'con', 'int', 'wis', 'cha'], label: 'Two free ability boosts' }, values: [2, 2] },
  ],
  
  size: 'medium',
  speed: 25,
  
  languages: {
    automatic: ['Common', 'Orcish'],
    choice: { count: 1, options: ['Draconic', 'Dwarven', 'Giant', 'Gnoll', 'Goblin', 'Jotun', 'Undercommon'], label: 'Additional languages equal to Intelligence modifier' },
  },
  
  traits: [
  // Do not implement proprietary content without proper licensing
    { id: 'darkvision', name: 'Darkvision', source: 'Orc', description: 'You can see in darkness and dim light as though it were bright light.' },
  // Do not implement proprietary content without proper licensing
    { id: 'orc-ferocity', name: 'Orc Ferocity', source: 'Orc', description: 'Once per day, when reduced to 0 HP, you remain conscious and can continue fighting.' },
  // Do not implement proprietary content without proper licensing
  ],
  // NOTE: Heritages for this ancestry are from non-SRD Paizo sources (NOT OGL)
  // Do not implement proprietary content without proper licensing
  
  description: 'Orcs are forged in the fires of violence and conflict, often from the moment they are born. They are fierce warriors with a strong sense of honor.',
  ageInfo: 'Orcs reach adulthood at 12 and can live to about 60 years.',
  alignmentTendency: 'Orcs have no particular tendency toward any alignment.',
  sizeDescription: 'Orcs are Medium creatures, typically 6-7 feet tall.',
};
