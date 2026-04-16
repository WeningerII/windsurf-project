// D&D 3.5e Prestige Class: Mystic Theurge

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const mysticTheurgeFeatures: Feature[] = [
  {
    id: 'combined-spellcasting-35e',
    name: 'Combined Spellcasting',
    description:
      'The mystic theurge advances one existing arcane spellcasting class and one existing divine spellcasting class at every level.',
    source: 'Mystic Theurge 1',
  },
];

export const mysticTheurge: CharacterClass = {
  id: 'mystic-theurge-35e',
  name: 'Mystic Theurge',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/mysticTheurge.htm',
  },
  description:
    'A dual-progression caster that advances one arcane class and one divine class every level.',
  hitDie: 'd4',
  primaryAbility: ['int', 'wis'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['concentration', 'craft', 'knowledge', 'profession', 'spellcraft'],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [{ level: 1, features: [mysticTheurgeFeatures[0]] }],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'arcane-class',
        label: 'Arcane Spellcasting Class',
        kind: 'arcane',
        advancementLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        id: 'divine-class',
        label: 'Divine Spellcasting Class',
        kind: 'divine',
        advancementLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
  subclassLevel: 20,
  subclasses: [],
};
