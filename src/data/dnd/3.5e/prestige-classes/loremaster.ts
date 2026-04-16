// D&D 3.5e Prestige Class: Loremaster

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const loremasterFeatures: Feature[] = [
  {
    id: 'loremaster-secret-1-35e',
    name: 'Secret',
    description: 'The loremaster learns one secret from the loremaster secret list.',
    source: 'Loremaster 1',
  },
  {
    id: 'lore-35e',
    name: 'Lore',
    description: 'The loremaster gains bard-like lore regarding legends, events, and places.',
    source: 'Loremaster 2',
  },
  {
    id: 'loremaster-secret-2-35e',
    name: 'Secret',
    description: 'The loremaster learns a second secret.',
    source: 'Loremaster 3',
  },
  {
    id: 'loremaster-bonus-language-1-35e',
    name: 'Bonus Language',
    description: 'The loremaster gains an additional bonus language.',
    source: 'Loremaster 4',
  },
  {
    id: 'loremaster-secret-3-35e',
    name: 'Secret',
    description: 'The loremaster learns a third secret.',
    source: 'Loremaster 5',
  },
  {
    id: 'greater-lore-35e',
    name: 'Greater Lore',
    description: 'The loremaster can identify magic items and legends with exceptional accuracy.',
    source: 'Loremaster 6',
  },
  {
    id: 'loremaster-secret-4-35e',
    name: 'Secret',
    description: 'The loremaster learns a fourth secret.',
    source: 'Loremaster 7',
  },
  {
    id: 'loremaster-bonus-language-2-35e',
    name: 'Bonus Language',
    description: 'The loremaster gains another bonus language.',
    source: 'Loremaster 8',
  },
  {
    id: 'loremaster-secret-5-35e',
    name: 'Secret',
    description: 'The loremaster learns a fifth secret.',
    source: 'Loremaster 9',
  },
  {
    id: 'true-lore-35e',
    name: 'True Lore',
    description: 'The loremaster can uncover deep truth as though casting legend lore instantly.',
    source: 'Loremaster 10',
  },
];

export const loremaster: CharacterClass = {
  id: 'loremaster-35e',
  name: 'Loremaster',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/loremaster.htm',
  },
  description:
    'A keeper of hidden knowledge who preserves full existing spellcasting while trading class features for secrets and lore.',
  hitDie: 'd4',
  primaryAbility: ['int', 'wis'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'appraise',
      'craft',
      'decipher-script',
      'knowledge',
      'perform',
      'profession',
      'speak-language',
      'spellcraft',
    ],
    label: 'Choose four skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [loremasterFeatures[0]] },
    { level: 2, features: [loremasterFeatures[1]] },
    { level: 3, features: [loremasterFeatures[2]] },
    { level: 4, features: [loremasterFeatures[3]] },
    { level: 5, features: [loremasterFeatures[4]] },
    { level: 6, features: [loremasterFeatures[5]] },
    { level: 7, features: [loremasterFeatures[6]] },
    { level: 8, features: [loremasterFeatures[7]] },
    { level: 9, features: [loremasterFeatures[8]] },
    { level: 10, features: [loremasterFeatures[9]] },
  ],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'existing-class',
        label: 'Spellcasting Class',
        kind: 'any',
        advancementLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
  subclassLevel: 20,
  subclasses: [],
};
