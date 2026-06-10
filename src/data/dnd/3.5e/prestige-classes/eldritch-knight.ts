// D&D 3.5e Prestige Class: Eldritch Knight

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const eldritchKnightFeatures: Feature[] = [
  {
    id: 'eldritch-knight-bonus-feat-35e',
    name: 'Bonus Feat',
    description:
      'At 1st level, the eldritch knight gains a fighter bonus feat while continuing arcane spellcasting from 2nd level onward.',
    source: 'Eldritch Knight 1',
  },
];

export const eldritchKnight: CharacterClass = {
  id: 'eldritch-knight-35e',
  name: 'Eldritch Knight',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/eldritchKnight.htm',
  },
  description:
    'A battle mage who keeps nearly full arcane progression while pushing BAB to fighter territory.',
  hitDie: 'd6',
  d20Profile: {
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
  },
  primaryAbility: ['str', 'int'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'concentration',
      'craft',
      'decipher-script',
      'jump',
      'knowledge',
      'ride',
      'sense-motive',
      'spellcraft',
      'swim',
    ],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [{ level: 1, features: [eldritchKnightFeatures[0]] }],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'arcane-class',
        label: 'Arcane Spellcasting Class',
        kind: 'arcane',
        advancementLevels: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
  subclassLevel: 20,
  subclasses: [],
};
