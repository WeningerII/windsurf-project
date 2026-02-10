import { Background } from '../../../../types/character-options/backgrounds';

export const folkHero: Background = {
  id: 'folk-hero',
  name: 'Folk Hero',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  skillProficiencies: ['animal-handling', 'survival'],
  
  toolProficiencies: ['one-artisan-tools', 'vehicles-land'],
  
  equipment: [
    'artisan-tools',
    'shovel',
    'iron-pot',
    'common-clothes',
    'pouch',
  ],
  
  gold: 10,
  
  suggestedCharacteristics: {
    traits: ['I judge people by their actions, not their words', 'If someone is in trouble, I\'m always ready to lend help', 'I have a strong sense of fair play'],
    ideals: ['Respect', 'Fairness', 'Freedom', 'Sincerity'],
    bonds: ['I have a family, but I have no idea where they are', 'I worked the land, I love the land'],
    flaws: ['The tyrant who rules my land will stop at nothing to see me killed', 'I have trouble trusting in my allies'],
  },
  
  feature: {
    id: 'rustic-hospitality',
    name: 'Rustic Hospitality',
    source: 'Folk Hero Background',
    description: 'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.',
  },
  
  description: 'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.',
};
