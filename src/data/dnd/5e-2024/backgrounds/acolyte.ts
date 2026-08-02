import { Background } from '../../../../types/character-options/backgrounds';

// Transcribed from SRD 5.2.1 "Character Origins" > Acolyte, corroborated field
// for field by 5e-bits/5e-database `src/2024/en/5e-SRD-Backgrounds.json`.
export const acolyte: Background = {
  id: 'acolyte-2024',
  name: 'Acolyte',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScores: ['int', 'wis', 'cha'],

  originFeat: { id: 'magic-initiate-cleric', name: 'Magic Initiate (Cleric)' },

  skillProficiencies: ['insight', 'religion'],

  toolProficiencies: ['calligraphers-supplies'],

  equipmentOptions: [
    {
      label: 'A',
      items: [
        { itemId: 'calligraphers-supplies', quantity: 1 },
        { itemId: 'book-2024', quantity: 1 },
        { itemId: 'holy-symbol-2024', quantity: 1 },
        { itemId: 'parchment', quantity: 10 },
        { itemId: 'robe', quantity: 1 },
      ],
      gold: 8,
    },
    { label: 'B', items: [], gold: 50 },
  ],

  equipment: ['calligraphers-supplies', 'book-2024', 'holy-symbol-2024', 'parchment', 'robe'],

  gold: 8,
};
