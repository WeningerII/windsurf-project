// D&D 3.5e Prestige Class: Archmage

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const archmageFeatures: Feature[] = [
  {
    id: 'high-arcana-1-35e',
    name: 'High Arcana',
    description:
      'The archmage selects a High Arcana option, sacrificing a spell slot to unlock a signature magical trick.',
    source: 'Archmage 1',
  },
  {
    id: 'high-arcana-2-35e',
    name: 'High Arcana',
    description: 'The archmage gains a second High Arcana option.',
    source: 'Archmage 2',
  },
  {
    id: 'high-arcana-3-35e',
    name: 'High Arcana',
    description: 'The archmage gains a third High Arcana option.',
    source: 'Archmage 3',
  },
  {
    id: 'high-arcana-4-35e',
    name: 'High Arcana',
    description: 'The archmage gains a fourth High Arcana option.',
    source: 'Archmage 4',
  },
  {
    id: 'high-arcana-5-35e',
    name: 'High Arcana',
    description: 'The archmage gains a fifth High Arcana option.',
    source: 'Archmage 5',
  },
];

export const archmage: CharacterClass = {
  id: 'archmage-35e',
  name: 'Archmage',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/archmage.htm',
  },
  description:
    'A supreme arcane specialist who trades spell slots for High Arcana and keeps full access to their existing spell progression.',
  hitDie: 'd4',
  d20Profile: {
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
  },
  primaryAbility: ['int'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['concentration', 'craft', 'knowledge', 'profession', 'spellcraft'],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [archmageFeatures[0]] },
    { level: 2, features: [archmageFeatures[1]] },
    { level: 3, features: [archmageFeatures[2]] },
    { level: 4, features: [archmageFeatures[3]] },
    { level: 5, features: [archmageFeatures[4]] },
  ],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'arcane-class',
        label: 'Arcane Spellcasting Class',
        kind: 'arcane',
        advancementLevels: [1, 2, 3, 4, 5],
      },
    ],
  },
  subclassLevel: 20,
  subclasses: [],
};
