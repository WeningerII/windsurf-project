import { Background } from '../../../../types/character-options/backgrounds';

// Transcribed from SRD 5.2.1 "Character Origins" > Soldier, corroborated field
// for field by 5e-bits/5e-database `src/2024/en/5e-SRD-Backgrounds.json`.
export const soldier: Background = {
  id: 'soldier-2024',
  name: 'Soldier',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScores: ['str', 'dex', 'con'],

  originFeat: { id: 'savage-attacker', name: 'Savage Attacker' },

  skillProficiencies: ['athletics', 'intimidation'],

  // SRD 5.2 grants one Gaming Set only. Land Vehicles is the SRD 5.1 Soldier's
  // second tool and does not appear in the 2024 background; see the
  // "backgrounds/soldier|toolProficiencies" upstreamDefects note in
  // scripts/data/srd-fidelity-baseline.json for why the pinned source reads ''.
  toolProficiencies: ['one-gaming-set'],

  equipmentOptions: [
    {
      label: 'A',
      items: [
        { itemId: 'spear', quantity: 1 },
        { itemId: 'shortbow', quantity: 1 },
        { itemId: 'arrows', quantity: 20 },
        // "Gaming Set (same as above)" — the same set taken as the tool
        // proficiency, so it carries the choice token rather than an item id.
        { itemId: 'one-gaming-set', quantity: 1 },
        { itemId: 'healers-kit-2024', quantity: 1 },
        { itemId: 'quiver', quantity: 1 },
        { itemId: 'clothes-travelers', quantity: 1 },
      ],
      gold: 14,
    },
    { label: 'B', items: [], gold: 50 },
  ],

  equipment: [
    'spear',
    'shortbow',
    'arrows',
    'one-gaming-set',
    'healers-kit-2024',
    'quiver',
    'clothes-travelers',
  ],

  gold: 14,
};
