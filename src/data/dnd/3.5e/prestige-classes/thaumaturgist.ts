// D&D 3.5e Prestige Class: Thaumaturgist

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const thaumaturgistFeatures: Feature[] = [
  {
    id: 'improved-ally-35e',
    name: 'Improved Ally',
    description:
      'The thaumaturgist bargains more effectively with called outsiders and reduces the price of planar ally services.',
    source: 'Thaumaturgist 1',
  },
  {
    id: 'augment-summoning-35e',
    name: 'Augment Summoning',
    description:
      'The thaumaturgist gains Augment Summoning as a bonus feat or improves existing summoned allies.',
    source: 'Thaumaturgist 2',
  },
  {
    id: 'extended-summoning-35e',
    name: 'Extended Summoning',
    description: 'The thaumaturgist’s summoned creatures remain for longer durations.',
    source: 'Thaumaturgist 3',
  },
  {
    id: 'contingent-conjuration-35e',
    name: 'Contingent Conjuration',
    description:
      'The thaumaturgist can bind a prepared conjuration effect to trigger under a chosen condition.',
    source: 'Thaumaturgist 4',
  },
  {
    id: 'planar-cohort-35e',
    name: 'Planar Cohort',
    description: 'The thaumaturgist gains a long-term extraplanar companion.',
    source: 'Thaumaturgist 5',
  },
];

export const thaumaturgist: CharacterClass = {
  id: 'thaumaturgist-35e',
  name: 'Thaumaturgist',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/thaumaturgist.htm',
  },
  description:
    'A summoning-focused divine caster who keeps full spell progression while improving called and summoned allies.',
  hitDie: 'd4',
  d20Profile: {
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
  },
  primaryAbility: ['wis', 'cha'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'concentration',
      'craft',
      'diplomacy',
      'knowledge',
      'profession',
      'sense-motive',
      'speak-language',
      'spellcraft',
    ],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [thaumaturgistFeatures[0]] },
    { level: 2, features: [thaumaturgistFeatures[1]] },
    { level: 3, features: [thaumaturgistFeatures[2]] },
    { level: 4, features: [thaumaturgistFeatures[3]] },
    { level: 5, features: [thaumaturgistFeatures[4]] },
  ],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'divine-class',
        label: 'Divine Spellcasting Class',
        kind: 'divine',
        advancementLevels: [1, 2, 3, 4, 5],
      },
    ],
  },
  subclassLevel: 20,
  subclasses: [],
};
