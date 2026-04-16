// D&D 3.5e Prestige Class: Horizon Walker

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const horizonWalkerFeatures: Feature[] = [
  {
    id: 'terrain-mastery-1-35e',
    name: 'Terrain Mastery',
    description:
      'The horizon walker selects one terrain environment and gains the corresponding mastery benefit for that terrain.',
    source: 'Horizon Walker 1',
  },
  {
    id: 'terrain-mastery-2-35e',
    name: 'Terrain Mastery',
    description: 'The horizon walker gains a second terrain mastery benefit.',
    source: 'Horizon Walker 2',
  },
  {
    id: 'terrain-mastery-3-35e',
    name: 'Terrain Mastery',
    description: 'The horizon walker gains a third terrain mastery benefit.',
    source: 'Horizon Walker 3',
  },
  {
    id: 'terrain-mastery-4-35e',
    name: 'Terrain Mastery',
    description: 'The horizon walker gains a fourth terrain mastery benefit.',
    source: 'Horizon Walker 4',
  },
  {
    id: 'terrain-mastery-5-35e',
    name: 'Terrain Mastery',
    description: 'The horizon walker gains a fifth terrain mastery benefit.',
    source: 'Horizon Walker 5',
  },
  {
    id: 'planar-terrain-mastery-1-35e',
    name: 'Planar Terrain Mastery',
    description:
      'The horizon walker gains a planar terrain mastery, such as aligned terrain, caverns, or shifting planes.',
    source: 'Horizon Walker 6',
  },
  {
    id: 'planar-terrain-mastery-2-35e',
    name: 'Planar Terrain Mastery',
    description: 'The horizon walker gains a second planar terrain mastery.',
    source: 'Horizon Walker 7',
  },
  {
    id: 'planar-terrain-mastery-3-35e',
    name: 'Planar Terrain Mastery',
    description: 'The horizon walker gains a third planar terrain mastery.',
    source: 'Horizon Walker 8',
  },
  {
    id: 'planar-terrain-mastery-4-35e',
    name: 'Planar Terrain Mastery',
    description: 'The horizon walker gains a fourth planar terrain mastery.',
    source: 'Horizon Walker 9',
  },
  {
    id: 'planar-terrain-mastery-5-35e',
    name: 'Planar Terrain Mastery',
    description: 'The horizon walker gains a fifth planar terrain mastery.',
    source: 'Horizon Walker 10',
  },
];

export const horizonWalker: CharacterClass = {
  id: 'horizon-walker-35e',
  name: 'Horizon Walker',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-08',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/horizonWalker.htm',
  },
  description:
    'A seasoned traveler who adapts to hostile terrain and eventually masters planar environments.',
  hitDie: 'd8',
  primaryAbility: ['wis', 'dex'],
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'balance',
      'climb',
      'diplomacy',
      'handle-animal',
      'hide',
      'knowledge',
      'listen',
      'move-silently',
      'profession',
      'ride',
      'speak-language',
      'spot',
      'survival',
    ],
    label: 'Choose four skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [horizonWalkerFeatures[0]] },
    { level: 2, features: [horizonWalkerFeatures[1]] },
    { level: 3, features: [horizonWalkerFeatures[2]] },
    { level: 4, features: [horizonWalkerFeatures[3]] },
    { level: 5, features: [horizonWalkerFeatures[4]] },
    { level: 6, features: [horizonWalkerFeatures[5]] },
    { level: 7, features: [horizonWalkerFeatures[6]] },
    { level: 8, features: [horizonWalkerFeatures[7]] },
    { level: 9, features: [horizonWalkerFeatures[8]] },
    { level: 10, features: [horizonWalkerFeatures[9]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
