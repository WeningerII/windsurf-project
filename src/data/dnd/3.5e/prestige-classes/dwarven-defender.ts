// D&D 3.5e Prestige Class: Dwarven Defender

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const dwarvenDefenderFeatures: Feature[] = [
  {
    id: 'ac-bonus-1-35e',
    name: 'AC Bonus +1',
    description: 'The dwarven defender gains a +1 dodge bonus to Armor Class.',
    source: 'Dwarven Defender 1',
  },
  {
    id: 'defensive-stance-1-35e',
    name: 'Defensive Stance 1/day',
    description:
      'Once per day, the dwarven defender can adopt a stance that grants Strength, Constitution, and save bonuses while rooted in place.',
    source: 'Dwarven Defender 1',
  },
  {
    id: 'uncanny-dodge-dwarven-defender-35e',
    name: 'Uncanny Dodge',
    description:
      'The dwarven defender retains Dexterity bonus to AC even when caught flat-footed or struck by an unseen attacker.',
    source: 'Dwarven Defender 2',
  },
  {
    id: 'defensive-stance-2-35e',
    name: 'Defensive Stance 2/day',
    description: 'The dwarven defender can use defensive stance twice per day.',
    source: 'Dwarven Defender 3',
  },
  {
    id: 'trap-sense-1-35e',
    name: 'Trap Sense +1',
    description: 'The dwarven defender gains a +1 bonus on Reflex saves and AC against traps.',
    source: 'Dwarven Defender 4',
  },
  {
    id: 'ac-bonus-2-35e',
    name: 'AC Bonus +2',
    description: 'The dwarven defender’s dodge bonus to Armor Class improves to +2.',
    source: 'Dwarven Defender 4',
  },
  {
    id: 'defensive-stance-3-35e',
    name: 'Defensive Stance 3/day',
    description: 'The dwarven defender can use defensive stance three times per day.',
    source: 'Dwarven Defender 5',
  },
  {
    id: 'damage-reduction-3-35e',
    name: 'Damage Reduction 3/-',
    description:
      'The dwarven defender ignores the first 3 points of weapon damage from most attacks.',
    source: 'Dwarven Defender 6',
  },
  {
    id: 'improved-uncanny-dodge-dwarven-defender-35e',
    name: 'Improved Uncanny Dodge',
    description:
      'The dwarven defender can no longer be flanked except by a rogue at least four levels higher.',
    source: 'Dwarven Defender 6',
  },
  {
    id: 'defensive-stance-4-35e',
    name: 'Defensive Stance 4/day',
    description: 'The dwarven defender can use defensive stance four times per day.',
    source: 'Dwarven Defender 7',
  },
  {
    id: 'ac-bonus-3-35e',
    name: 'AC Bonus +3',
    description: 'The dwarven defender’s dodge bonus to Armor Class improves to +3.',
    source: 'Dwarven Defender 7',
  },
  {
    id: 'mobile-defense-35e',
    name: 'Mobile Defense',
    description:
      'The dwarven defender can take a single 5-foot step each round while in a defensive stance.',
    source: 'Dwarven Defender 8',
  },
  {
    id: 'trap-sense-2-35e',
    name: 'Trap Sense +2',
    description: 'The dwarven defender’s trap sense bonus improves to +2.',
    source: 'Dwarven Defender 8',
  },
  {
    id: 'defensive-stance-5-35e',
    name: 'Defensive Stance 5/day',
    description: 'The dwarven defender can use defensive stance five times per day.',
    source: 'Dwarven Defender 9',
  },
  {
    id: 'damage-reduction-6-35e',
    name: 'Damage Reduction 6/-',
    description: 'The dwarven defender’s damage reduction improves to 6/-.',
    source: 'Dwarven Defender 10',
  },
  {
    id: 'ac-bonus-4-35e',
    name: 'AC Bonus +4',
    description: 'The dwarven defender’s dodge bonus to Armor Class improves to +4.',
    source: 'Dwarven Defender 10',
  },
];

export const dwarvenDefender: CharacterClass = {
  id: 'dwarven-defender-35e',
  name: 'Dwarven Defender',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-08',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/dwarvenDefender.htm',
  },
  description:
    'A stubborn bulwark who anchors the battlefield with defensive stances and dwarven resilience.',
  hitDie: 'd12',
  primaryAbility: ['str', 'con'],
  savingThrowProficiencies: ['str', 'wis'],
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['craft', 'listen', 'sense-motive', 'spot'],
    label: 'Choose two skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [dwarvenDefenderFeatures[0], dwarvenDefenderFeatures[1]] },
    { level: 2, features: [dwarvenDefenderFeatures[2]] },
    { level: 3, features: [dwarvenDefenderFeatures[3]] },
    { level: 4, features: [dwarvenDefenderFeatures[4], dwarvenDefenderFeatures[5]] },
    { level: 5, features: [dwarvenDefenderFeatures[6]] },
    { level: 6, features: [dwarvenDefenderFeatures[7], dwarvenDefenderFeatures[8]] },
    { level: 7, features: [dwarvenDefenderFeatures[9], dwarvenDefenderFeatures[10]] },
    { level: 8, features: [dwarvenDefenderFeatures[11], dwarvenDefenderFeatures[12]] },
    { level: 9, features: [dwarvenDefenderFeatures[13]] },
    { level: 10, features: [dwarvenDefenderFeatures[14], dwarvenDefenderFeatures[15]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
