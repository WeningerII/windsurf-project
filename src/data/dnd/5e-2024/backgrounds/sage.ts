import { Background } from '../../../../types/character-options/backgrounds';

export const sage: Background = {
  id: 'sage-2024',
  name: 'Sage',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  skillProficiencies: ['arcana', 'history'],
  
  languageProficiencies: {
    count: 2,
    options: ['any'],
    label: 'Two languages of your choice',
  },
  
  equipment: [
    'bottle-of-black-ink',
    'quill',
    'small-knife',
    'letter-from-dead-colleague',
    'common-clothes',
    'pouch',
  ],
  
  gold: 10,
  
  suggestedCharacteristics: {
    traits: ['I use polysyllabic words that convey the impression of great erudition', 'I\'ve read every book in the world\'s greatest libraries', 'I\'m willing to listen to every side of an argument'],
    ideals: ['Knowledge', 'Beauty', 'Logic', 'Self-Improvement'],
    bonds: ['It is my duty to protect my students', 'I have an ancient text that holds terrible secrets'],
    flaws: ['I am easily distracted by the promise of information', 'I speak without really thinking through my words'],
  },
  
  feature: {
    id: 'researcher',
    name: 'Researcher',
    source: 'Sage Background',
    description: 'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign.',
  },
  
  description: 'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study.',
};
