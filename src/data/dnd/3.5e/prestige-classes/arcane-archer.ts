// D&D 3.5e Prestige Class: Arcane Archer

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const arcaneArcherFeatures: Feature[] = [
  {
    id: 'enhance-arrow-1-35e',
    name: 'Enhance Arrow +1',
    description:
      'Every nonmagical arrow an arcane archer nocks and lets fly becomes magical, gaining an enhancement bonus of +1.',
    source: 'Arcane Archer 1',
  },
  {
    id: 'imbue-arrow-35e',
    name: 'Imbue Arrow',
    description:
      'An arcane archer can cast an area spell and deliver it to the target point with an arrow.',
    source: 'Arcane Archer 2',
  },
  {
    id: 'enhance-arrow-2-35e',
    name: 'Enhance Arrow +2',
    description: 'The enhancement bonus on the arcane archer’s arrows improves to +2.',
    source: 'Arcane Archer 3',
  },
  {
    id: 'seeker-arrow-35e',
    name: 'Seeker Arrow',
    description:
      'Once per day, an arcane archer can launch an arrow that unerringly seeks its target.',
    source: 'Arcane Archer 4',
  },
  {
    id: 'enhance-arrow-3-35e',
    name: 'Enhance Arrow +3',
    description: 'The enhancement bonus on the arcane archer’s arrows improves to +3.',
    source: 'Arcane Archer 5',
  },
  {
    id: 'phase-arrow-35e',
    name: 'Phase Arrow',
    description:
      'Once per day, an arcane archer can launch an arrow that passes through nonmagical barriers.',
    source: 'Arcane Archer 6',
  },
  {
    id: 'enhance-arrow-4-35e',
    name: 'Enhance Arrow +4',
    description: 'The enhancement bonus on the arcane archer’s arrows improves to +4.',
    source: 'Arcane Archer 7',
  },
  {
    id: 'hail-of-arrows-35e',
    name: 'Hail of Arrows',
    description:
      'Once per day, an arcane archer can fire an arrow at each and every target within range.',
    source: 'Arcane Archer 8',
  },
  {
    id: 'enhance-arrow-5-35e',
    name: 'Enhance Arrow +5',
    description: 'The enhancement bonus on the arcane archer’s arrows improves to +5.',
    source: 'Arcane Archer 9',
  },
  {
    id: 'arrow-of-death-35e',
    name: 'Arrow of Death',
    description:
      'The arcane archer can craft a slaying arrow that can kill a creature it strikes outright.',
    source: 'Arcane Archer 10',
  },
];

export const arcaneArcher: CharacterClass = {
  id: 'arcane-archer-35e',
  name: 'Arcane Archer',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-08',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/arcaneArcher.htm',
  },
  description: 'A warrior-mage who channels arcane power through arrows and bolts.',
  hitDie: 'd8',
  primaryAbility: ['dex', 'int'],
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: ['craft', 'hide', 'listen', 'move-silently', 'ride', 'spot', 'survival', 'use-rope'],
    label: 'Choose four skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [arcaneArcherFeatures[0]] },
    { level: 2, features: [arcaneArcherFeatures[1]] },
    { level: 3, features: [arcaneArcherFeatures[2]] },
    { level: 4, features: [arcaneArcherFeatures[3]] },
    { level: 5, features: [arcaneArcherFeatures[4]] },
    { level: 6, features: [arcaneArcherFeatures[5]] },
    { level: 7, features: [arcaneArcherFeatures[6]] },
    { level: 8, features: [arcaneArcherFeatures[7]] },
    { level: 9, features: [arcaneArcherFeatures[8]] },
    { level: 10, features: [arcaneArcherFeatures[9]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
