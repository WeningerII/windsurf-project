// D&D 3.5e Prestige Class: Dragon Disciple

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const dragonDiscipleFeatures: Feature[] = [
  {
    id: 'dragon-disciple-natural-armor-1-35e',
    name: 'Natural Armor +1',
    description: 'The dragon disciple gains a +1 natural armor bonus.',
    source: 'Dragon Disciple 1',
  },
  {
    id: 'dragon-disciple-bonus-spell-1-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains a bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 1',
  },
  {
    id: 'dragon-disciple-strength-1-35e',
    name: 'Strength +2',
    description: 'The dragon disciple gains a +2 inherent bonus to Strength.',
    source: 'Dragon Disciple 2',
  },
  {
    id: 'dragon-disciple-claws-and-bite-35e',
    name: 'Claws and Bite',
    description:
      'The dragon disciple grows claw attacks and a bite attack usable as natural weapons.',
    source: 'Dragon Disciple 2',
  },
  {
    id: 'dragon-disciple-bonus-spell-2-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains another bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 2',
  },
  {
    id: 'dragon-disciple-breath-weapon-2d8-35e',
    name: 'Breath Weapon 2d8',
    description:
      'The dragon disciple can exhale a dragon breath weapon dealing 2d8 damage of the heritage dragon type.',
    source: 'Dragon Disciple 3',
  },
  {
    id: 'dragon-disciple-strength-2-35e',
    name: 'Strength +2',
    description: 'The dragon disciple’s inherent Strength bonus increases by another +2.',
    source: 'Dragon Disciple 4',
  },
  {
    id: 'dragon-disciple-natural-armor-2-35e',
    name: 'Natural Armor +2',
    description: 'The dragon disciple’s natural armor bonus improves to +2.',
    source: 'Dragon Disciple 4',
  },
  {
    id: 'dragon-disciple-bonus-spell-3-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains another bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 4',
  },
  {
    id: 'dragon-disciple-blindsense-30-35e',
    name: 'Blindsense 30 ft.',
    description: 'The dragon disciple gains blindsense out to 30 feet.',
    source: 'Dragon Disciple 5',
  },
  {
    id: 'dragon-disciple-bonus-spell-4-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains another bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 5',
  },
  {
    id: 'dragon-disciple-constitution-35e',
    name: 'Constitution +2',
    description: 'The dragon disciple gains a +2 inherent bonus to Constitution.',
    source: 'Dragon Disciple 6',
  },
  {
    id: 'dragon-disciple-bonus-spell-5-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains another bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 6',
  },
  {
    id: 'dragon-disciple-breath-weapon-4d8-35e',
    name: 'Breath Weapon 4d8',
    description: 'The dragon disciple’s breath weapon damage improves to 4d8.',
    source: 'Dragon Disciple 7',
  },
  {
    id: 'dragon-disciple-natural-armor-3-35e',
    name: 'Natural Armor +3',
    description: 'The dragon disciple’s natural armor bonus improves to +3.',
    source: 'Dragon Disciple 7',
  },
  {
    id: 'dragon-disciple-intelligence-35e',
    name: 'Intelligence +2',
    description: 'The dragon disciple gains a +2 inherent bonus to Intelligence.',
    source: 'Dragon Disciple 8',
  },
  {
    id: 'dragon-disciple-bonus-spell-6-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains another bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 8',
  },
  {
    id: 'dragon-disciple-wings-35e',
    name: 'Wings',
    description:
      'The dragon disciple grows wings and gains a fly speed when space and armor allow it.',
    source: 'Dragon Disciple 9',
  },
  {
    id: 'dragon-disciple-bonus-spell-7-35e',
    name: 'Bonus Spell',
    description:
      'The dragon disciple gains another bonus arcane spell slot. Track the extra slot manually until bonus-spell automation exists.',
    source: 'Dragon Disciple 9',
  },
  {
    id: 'dragon-disciple-blindsense-60-35e',
    name: 'Blindsense 60 ft.',
    description: 'The dragon disciple’s blindsense range improves to 60 feet.',
    source: 'Dragon Disciple 10',
  },
  {
    id: 'dragon-disciple-dragon-apotheosis-35e',
    name: 'Dragon Apotheosis',
    description:
      'The dragon disciple completes their transformation into a half-dragon and gains the dragon type.',
    source: 'Dragon Disciple 10',
  },
];

export const dragonDisciple: CharacterClass = {
  id: 'dragon-disciple-35e',
  name: 'Dragon Disciple',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/dragonDisciple.htm',
  },
  description:
    'A draconic initiate who trades mortal limits for claws, breath, wings, and a gradual transformation into a dragon-blooded terror.',
  hitDie: 'd12',
  d20Profile: {
    bab: 'three-quarter',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'good',
  },
  primaryAbility: ['str', 'cha'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['concentration', 'craft', 'diplomacy', 'escape-artist', 'knowledge', 'listen'],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [dragonDiscipleFeatures[0], dragonDiscipleFeatures[1]] },
    {
      level: 2,
      features: [dragonDiscipleFeatures[2], dragonDiscipleFeatures[3], dragonDiscipleFeatures[4]],
    },
    { level: 3, features: [dragonDiscipleFeatures[5]] },
    {
      level: 4,
      features: [dragonDiscipleFeatures[6], dragonDiscipleFeatures[7], dragonDiscipleFeatures[8]],
    },
    { level: 5, features: [dragonDiscipleFeatures[9], dragonDiscipleFeatures[10]] },
    { level: 6, features: [dragonDiscipleFeatures[11], dragonDiscipleFeatures[12]] },
    { level: 7, features: [dragonDiscipleFeatures[13], dragonDiscipleFeatures[14]] },
    { level: 8, features: [dragonDiscipleFeatures[15], dragonDiscipleFeatures[16]] },
    { level: 9, features: [dragonDiscipleFeatures[17], dragonDiscipleFeatures[18]] },
    { level: 10, features: [dragonDiscipleFeatures[19], dragonDiscipleFeatures[20]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
