// D&D 3.5e Prestige Class: Arcane Archer

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const arcaneArcherFeatures: Feature[] = [
  {
    id: 'enhance-arrow-magic-35e',
    name: 'Enhance Arrow (Magic)',
    description: 'The arcane archer can enhance arrows with magical properties.',
    source: 'DMG',
  },
  {
    id: 'imbue-arrow-35e',
    name: 'Imbue Arrow',
    description: 'The arcane archer can imbue arrows with spell effects.',
    source: 'DMG',
  },
  {
    id: 'enhance-arrow-flaming-35e',
    name: 'Enhance Arrow (Flaming)',
    description: 'Arrows deal additional fire damage.',
    source: 'DMG',
  },
  {
    id: 'enhance-arrow-frost-35e',
    name: 'Enhance Arrow (Frost)',
    description: 'Arrows deal additional cold damage.',
    source: 'DMG',
  },
  {
    id: 'enhance-arrow-shock-35e',
    name: 'Enhance Arrow (Shock)',
    description: 'Arrows deal additional electricity damage.',
    source: 'DMG',
  },
  {
    id: 'enhance-arrow-seeking-35e',
    name: 'Enhance Arrow (Seeking)',
    description: 'Arrows can seek out targets.',
    source: 'DMG',
  },
];

export const arcaneArcher: CharacterClass = {
  id: 'arcane-archer-35e',
  name: 'Arcane Archer',
  system: 'dnd-3.5e',
  source: 'DMG',
  description:
    'An arcane archer is a fighter who has learned to infuse arrows and bolts with magical energy.',
  hitDie: 'd8',
  primaryAbility: ['dex', 'int'],
  savingThrowProficiencies: ['dex'],
  armorProficiencies: ['light armor', 'medium armor'],
  weaponProficiencies: ['simple weapons', 'martial weapons'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: ['Craft', 'Handle Animal', 'Listen', 'Perception', 'Ride', 'Spot'],
    label: 'Choose 4 class skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [arcaneArcherFeatures[0]] },
    { level: 2, features: [arcaneArcherFeatures[1]] },
    { level: 4, features: [arcaneArcherFeatures[2]] },
    { level: 6, features: [arcaneArcherFeatures[3]] },
    { level: 8, features: [arcaneArcherFeatures[4]] },
    { level: 10, features: [arcaneArcherFeatures[5]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
