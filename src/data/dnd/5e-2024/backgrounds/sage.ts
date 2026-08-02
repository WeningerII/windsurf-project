import { Background } from '../../../../types/character-options/backgrounds';

// Transcribed from SRD 5.2.1 "Character Origins" > Sage. The 5e-bits JSON
// records the feat as bare "Magic Initiate" with no spell-list note (unlike
// Acolyte's "Cleric"); the SRD 5.2.1 text reads "Magic Initiate (Wizard)", and
// that is what is encoded here.
export const sage: Background = {
  id: 'sage-2024',
  name: 'Sage',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScores: ['con', 'int', 'wis'],

  originFeat: { id: 'magic-initiate-wizard', name: 'Magic Initiate (Wizard)' },

  skillProficiencies: ['arcana', 'history'],

  toolProficiencies: ['calligraphers-supplies'],

  equipmentOptions: [
    {
      label: 'A',
      items: [
        { itemId: 'quarterstaff', quantity: 1 },
        { itemId: 'calligraphers-supplies', quantity: 1 },
        { itemId: 'book-2024', quantity: 1 },
        { itemId: 'parchment', quantity: 8 },
        { itemId: 'robe', quantity: 1 },
      ],
      gold: 8,
    },
    { label: 'B', items: [], gold: 50 },
  ],

  equipment: ['quarterstaff', 'calligraphers-supplies', 'book-2024', 'parchment', 'robe'],

  gold: 8,
};
