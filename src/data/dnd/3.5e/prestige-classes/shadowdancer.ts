// D&D 3.5e Prestige Class: Shadowdancer

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const shadowdancerFeatures: Feature[] = [
  {
    id: 'hide-in-plain-sight-shadowdancer-35e',
    name: 'Hide in Plain Sight',
    description:
      'A shadowdancer can use Hide while observed as long as they are within 10 feet of some sort of shadow.',
    source: 'Shadowdancer 1',
  },
  {
    id: 'evasion-shadowdancer-35e',
    name: 'Evasion',
    description:
      'If exposed to an effect that allows a Reflex save for half damage, the shadowdancer takes no damage on a successful save.',
    source: 'Shadowdancer 2',
  },
  {
    id: 'darkvision-shadowdancer-35e',
    name: 'Darkvision',
    description: 'The shadowdancer gains darkvision with a 60-foot range.',
    source: 'Shadowdancer 2',
  },
  {
    id: 'uncanny-dodge-shadowdancer-35e',
    name: 'Uncanny Dodge',
    description: 'The shadowdancer retains Dexterity bonus to AC even when caught flat-footed.',
    source: 'Shadowdancer 2',
  },
  {
    id: 'shadow-illusion-35e',
    name: 'Shadow Illusion',
    description:
      'Once per day, a shadowdancer can create a silent image effect whose visuals are composed of living shadow.',
    source: 'Shadowdancer 3',
  },
  {
    id: 'summon-shadow-1-35e',
    name: 'Summon Shadow',
    description: 'The shadowdancer gains a loyal shadow companion.',
    source: 'Shadowdancer 3',
  },
  {
    id: 'shadow-jump-20-35e',
    name: 'Shadow Jump 20 ft.',
    description:
      'The shadowdancer can travel between shadows in 20-foot increments each day as if using dimension door.',
    source: 'Shadowdancer 4',
  },
  {
    id: 'defensive-roll-35e',
    name: 'Defensive Roll',
    description:
      'Once per day, the shadowdancer can attempt to halve damage from a potentially lethal blow.',
    source: 'Shadowdancer 5',
  },
  {
    id: 'improved-uncanny-dodge-shadowdancer-35e',
    name: 'Improved Uncanny Dodge',
    description:
      'The shadowdancer can no longer be flanked except by a rogue at least four levels higher.',
    source: 'Shadowdancer 5',
  },
  {
    id: 'shadow-jump-40-35e',
    name: 'Shadow Jump 40 ft.',
    description: 'The shadowdancer’s daily shadow jump distance improves to 40 feet.',
    source: 'Shadowdancer 6',
  },
  {
    id: 'summon-shadow-2-35e',
    name: 'Summon Shadow',
    description: 'The shadowdancer can replace a lost shadow companion after one day.',
    source: 'Shadowdancer 6',
  },
  {
    id: 'slippery-mind-35e',
    name: 'Slippery Mind',
    description:
      'If the shadowdancer fails a save against an enchantment effect, they can attempt it again one round later.',
    source: 'Shadowdancer 7',
  },
  {
    id: 'shadow-jump-80-35e',
    name: 'Shadow Jump 80 ft.',
    description: 'The shadowdancer’s daily shadow jump distance improves to 80 feet.',
    source: 'Shadowdancer 8',
  },
  {
    id: 'summon-shadow-3-35e',
    name: 'Summon Shadow',
    description: 'The shadowdancer can maintain or replace their shadow companion at this level.',
    source: 'Shadowdancer 9',
  },
  {
    id: 'shadow-jump-160-35e',
    name: 'Shadow Jump 160 ft.',
    description: 'The shadowdancer’s daily shadow jump distance improves to 160 feet.',
    source: 'Shadowdancer 10',
  },
  {
    id: 'improved-evasion-shadowdancer-35e',
    name: 'Improved Evasion',
    description:
      'The shadowdancer takes no damage on a successful Reflex save and only half damage on a failed one.',
    source: 'Shadowdancer 10',
  },
];

export const shadowdancer: CharacterClass = {
  id: 'shadowdancer-35e',
  name: 'Shadowdancer',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-08',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/shadowdancer.htm',
  },
  description:
    'A supernatural infiltrator who bends darkness into concealment, movement, and living shadow.',
  hitDie: 'd8',
  d20Profile: {
    bab: 'three-quarter',
    fortSave: 'poor',
    refSave: 'good',
    willSave: 'poor',
  },
  primaryAbility: ['dex', 'cha'],
  armorProficiencies: ['light'],
  weaponProficiencies: [
    'club',
    'hand-crossbow',
    'light-crossbow',
    'heavy-crossbow',
    'dagger',
    'dart',
    'mace',
    'morningstar',
    'quarterstaff',
    'rapier',
    'sap',
    'shortbow',
    'short-sword',
  ],
  toolProficiencies: [],
  skillProficiencies: {
    count: 6,
    options: [
      'balance',
      'bluff',
      'decipher-script',
      'diplomacy',
      'disguise',
      'escape-artist',
      'hide',
      'jump',
      'listen',
      'move-silently',
      'perform',
      'profession',
      'search',
      'sleight-of-hand',
      'spot',
      'tumble',
      'use-rope',
    ],
    label: 'Choose six skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [shadowdancerFeatures[0]] },
    {
      level: 2,
      features: [shadowdancerFeatures[1], shadowdancerFeatures[2], shadowdancerFeatures[3]],
    },
    { level: 3, features: [shadowdancerFeatures[4], shadowdancerFeatures[5]] },
    { level: 4, features: [shadowdancerFeatures[6]] },
    { level: 5, features: [shadowdancerFeatures[7], shadowdancerFeatures[8]] },
    { level: 6, features: [shadowdancerFeatures[9], shadowdancerFeatures[10]] },
    { level: 7, features: [shadowdancerFeatures[11]] },
    { level: 8, features: [shadowdancerFeatures[12]] },
    { level: 9, features: [shadowdancerFeatures[13]] },
    { level: 10, features: [shadowdancerFeatures[14], shadowdancerFeatures[15]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
