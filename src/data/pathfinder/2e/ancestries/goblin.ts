import { Species } from '../../../../types/character-options/species';

export const goblin: Species = {
  id: 'goblin',
  name: 'Goblin',
  system: 'pf2e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, cha: 2, wis: -2 } },
    { type: 'choice', choice: { count: 1, options: ['str', 'con', 'int'], label: 'Free ability boost' }, values: [2] },
  ],
  
  size: 'small',
  speed: 25,
  
  languages: {
    automatic: ['Common', 'Goblin'],
    choice: { count: 0, options: ['Draconic', 'Dwarven', 'Gnoll', 'Gnomish', 'Halfling', 'Orcish'], label: 'Additional languages equal to Intelligence modifier' },
  },
  
  traits: [
    { id: 'darkvision', name: 'Darkvision', source: 'Goblin', description: 'You can see in darkness and dim light just as well as you can see in bright light.' },
  ],
  
  subraces: [
    { id: 'razortooth', name: 'Razortooth Heritage', parentSpeciesId: 'goblin', abilityScoreIncrease: [{ type: 'fixed', attributes: { str: 2 } }], traits: [], description: 'Your teeth are sharp and dangerous. You gain a bite attack that deals 1d6 damage.' },
    { id: 'unbreakable', name: 'Unbreakable Heritage', parentSpeciesId: 'goblin', abilityScoreIncrease: [{ type: 'fixed', attributes: { con: 2 } }], traits: [], description: 'You gain a +1 status bonus to Fortitude saves and can ignore difficult terrain.' },
    { id: 'sneaky', name: 'Sneaky Heritage', parentSpeciesId: 'goblin', abilityScoreIncrease: [{ type: 'fixed', attributes: { dex: 2 } }], traits: [], description: 'You gain a +1 status bonus to Stealth checks and can Hide even when only lightly obscured.' },
    { id: 'pyrophobic', name: 'Pyrophobic Heritage', parentSpeciesId: 'goblin', abilityScoreIncrease: [{ type: 'fixed', attributes: { wis: 2 } }], traits: [], description: 'You gain a +1 status bonus to saves against fire damage and can sense fire nearby.' },
  ],
  
  description: 'Goblins are a short, scrappy, energetic people. They have been a thorn in the side of other ancestries but now many seek to join their communities.',
  ageInfo: 'Goblins reach adulthood by 8 and live to around 60.',
  alignmentTendency: 'Goblins tend toward chaotic alignments.',
  sizeDescription: 'Goblins are 3 feet tall and weigh about 35 pounds.',
};
