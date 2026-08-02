import { Background } from '../../../../types/character-options/backgrounds';

// Transcribed from SRD 5.2.1 "Character Origins" > Criminal, corroborated field
// for field by 5e-bits/5e-database `src/2024/en/5e-SRD-Backgrounds.json`.
export const criminal: Background = {
  id: 'criminal-2024',
  name: 'Criminal',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScores: ['dex', 'con', 'int'],

  originFeat: { id: 'alert', name: 'Alert' },

  skillProficiencies: ['sleight-of-hand', 'stealth'],

  toolProficiencies: ['thieves-tools'],

  equipmentOptions: [
    {
      label: 'A',
      items: [
        { itemId: 'dagger', quantity: 2 },
        { itemId: 'thieves-tools', quantity: 1 },
        { itemId: 'crowbar-2024', quantity: 1 },
        { itemId: 'pouch-2024', quantity: 2 },
        { itemId: 'clothes-travelers', quantity: 1 },
      ],
      gold: 16,
    },
    { label: 'B', items: [], gold: 50 },
  ],

  equipment: ['dagger', 'thieves-tools', 'crowbar-2024', 'pouch-2024', 'clothes-travelers'],

  gold: 16,
};
