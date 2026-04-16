// D&D 3.5e Prestige Class: Hierophant

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const hierophantFeatures: Feature[] = [
  {
    id: 'hierophant-special-ability-1-35e',
    name: 'Special Ability',
    description:
      'The hierophant selects a divine special ability. Hierophant levels stack for caster level but do not grant additional spell slots.',
    source: 'Hierophant 1',
  },
  {
    id: 'hierophant-special-ability-2-35e',
    name: 'Special Ability',
    description: 'The hierophant selects another divine special ability.',
    source: 'Hierophant 2',
  },
  {
    id: 'hierophant-special-ability-3-35e',
    name: 'Special Ability',
    description: 'The hierophant selects another divine special ability.',
    source: 'Hierophant 3',
  },
  {
    id: 'hierophant-special-ability-4-35e',
    name: 'Special Ability',
    description: 'The hierophant selects another divine special ability.',
    source: 'Hierophant 4',
  },
  {
    id: 'hierophant-special-ability-5-35e',
    name: 'Special Ability',
    description: 'The hierophant selects another divine special ability.',
    source: 'Hierophant 5',
  },
];

export const hierophant: CharacterClass = {
  id: 'hierophant-35e',
  name: 'Hierophant',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/hierophant.htm',
  },
  description:
    'An exalted divine caster who trades spell progression for raw caster level scaling and special hierophant abilities.',
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['con', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'concentration',
      'craft',
      'diplomacy',
      'heal',
      'knowledge',
      'profession',
      'spellcraft',
    ],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [hierophantFeatures[0]] },
    { level: 2, features: [hierophantFeatures[1]] },
    { level: 3, features: [hierophantFeatures[2]] },
    { level: 4, features: [hierophantFeatures[3]] },
    { level: 5, features: [hierophantFeatures[4]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
