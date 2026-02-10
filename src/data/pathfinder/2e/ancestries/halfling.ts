import { Species } from '../../../../types/character-options/species';

export const halfling: Species = {
  id: 'halfling',
  name: 'Halfling',
  system: 'pf2e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, wis: 2, str: -2 } },
    { type: 'choice', choice: { count: 1, options: ['con', 'int', 'cha'], label: 'Free ability boost' }, values: [2] },
  ],
  
  size: 'small',
  speed: 25,
  
  languages: {
    automatic: ['Common', 'Halfling'],
    choice: { count: 0, options: ['Dwarven', 'Elven', 'Gnomish', 'Goblin'], label: 'Additional languages equal to Intelligence modifier' },
  },
  
  traits: [
    { id: 'keen-eyes', name: 'Keen Eyes', source: 'Halfling', description: 'Your eyes are sharp, letting you make out small details. You gain a +2 circumstance bonus to Perception to Seek.' },
  ],
  
  subraces: [
    { id: 'fortunate', name: 'Fortunate Heritage', parentSpeciesId: 'halfling', abilityScoreIncrease: [{ type: 'fixed', attributes: { cha: 2 } }], traits: [], description: 'You gain an extra reroll per day and can use it on any d20 roll.' },
    { id: 'nomadic', name: 'Nomadic Heritage', parentSpeciesId: 'halfling', abilityScoreIncrease: [{ type: 'fixed', attributes: { dex: 2 } }], traits: [], description: 'You gain a +1 status bonus to Survival checks and can navigate any terrain.' },
    { id: 'stout', name: 'Stout Heritage', parentSpeciesId: 'halfling', abilityScoreIncrease: [{ type: 'fixed', attributes: { con: 2 } }], traits: [], description: 'You gain a +1 status bonus to Fortitude saves and resistance to poison.' },
    { id: 'twilight', name: 'Twilight Heritage', parentSpeciesId: 'halfling', abilityScoreIncrease: [{ type: 'fixed', attributes: { wis: 2 } }], traits: [], description: 'You gain low-light vision and a +1 status bonus to Perception in dim light.' },
  ],
  
  description: 'Halflings are a short, adaptable people who exhibit remarkable curiosity and luck. Many are nomadic, wandering in small groups.',
  ageInfo: 'Halflings reach adulthood at 20 and can live to 150 years.',
  alignmentTendency: 'Halflings are loyal to friends but not much concerned with broader ethics.',
  sizeDescription: 'Halflings are about 3 feet tall and weigh about 50 pounds.',
};
