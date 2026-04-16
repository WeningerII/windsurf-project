// D&D 3.5e Prestige Class: Arcane Trickster

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const arcaneTricksterFeatures: Feature[] = [
  {
    id: 'ranged-legerdemain-1-35e',
    name: 'Ranged Legerdemain 1/day',
    description:
      'The arcane trickster can pick locks, palm objects, or disable devices at range once per day.',
    source: 'Arcane Trickster 1',
  },
  {
    id: 'arcane-trickster-sneak-attack-1-35e',
    name: 'Sneak Attack +1d6',
    description: 'The arcane trickster’s sneak attack damage improves by 1d6.',
    source: 'Arcane Trickster 2',
  },
  {
    id: 'impromptu-sneak-attack-1-35e',
    name: 'Impromptu Sneak Attack 1/day',
    description:
      'The arcane trickster can declare one attack as a sneak attack even when the target would normally defend against it.',
    source: 'Arcane Trickster 3',
  },
  {
    id: 'arcane-trickster-sneak-attack-2-35e',
    name: 'Sneak Attack +2d6',
    description: 'The arcane trickster’s sneak attack damage improves to +2d6.',
    source: 'Arcane Trickster 4',
  },
  {
    id: 'ranged-legerdemain-2-35e',
    name: 'Ranged Legerdemain 2/day',
    description: 'The arcane trickster can use ranged legerdemain twice per day.',
    source: 'Arcane Trickster 5',
  },
  {
    id: 'arcane-trickster-sneak-attack-3-35e',
    name: 'Sneak Attack +3d6',
    description: 'The arcane trickster’s sneak attack damage improves to +3d6.',
    source: 'Arcane Trickster 6',
  },
  {
    id: 'impromptu-sneak-attack-2-35e',
    name: 'Impromptu Sneak Attack 2/day',
    description: 'The arcane trickster can use impromptu sneak attack twice per day.',
    source: 'Arcane Trickster 7',
  },
  {
    id: 'arcane-trickster-sneak-attack-4-35e',
    name: 'Sneak Attack +4d6',
    description: 'The arcane trickster’s sneak attack damage improves to +4d6.',
    source: 'Arcane Trickster 8',
  },
  {
    id: 'ranged-legerdemain-3-35e',
    name: 'Ranged Legerdemain 3/day',
    description: 'The arcane trickster can use ranged legerdemain three times per day.',
    source: 'Arcane Trickster 9',
  },
  {
    id: 'arcane-trickster-sneak-attack-5-35e',
    name: 'Sneak Attack +5d6',
    description: 'The arcane trickster’s sneak attack damage improves to +5d6.',
    source: 'Arcane Trickster 10',
  },
];

export const arcaneTrickster: CharacterClass = {
  id: 'arcane-trickster-35e',
  name: 'Arcane Trickster',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-10',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/arcaneTrickster.htm',
  },
  description:
    'A stealthy spellcaster who advances arcane magic while layering rogue tricks and sneak attacks on top.',
  hitDie: 'd4',
  primaryAbility: ['dex', 'int'],
  savingThrowProficiencies: ['dex', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'appraise',
      'balance',
      'bluff',
      'climb',
      'concentration',
      'craft',
      'decipher-script',
      'diplomacy',
      'disable-device',
      'disguise',
      'escape-artist',
      'gather-info',
      'hide',
      'knowledge',
      'listen',
      'move-silently',
      'open-lock',
      'search',
      'sense-motive',
      'sleight-of-hand',
      'speak-language',
      'spellcraft',
      'spot',
      'tumble',
      'use-rope',
    ],
    label: 'Choose four skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [arcaneTricksterFeatures[0]] },
    { level: 2, features: [arcaneTricksterFeatures[1]] },
    { level: 3, features: [arcaneTricksterFeatures[2]] },
    { level: 4, features: [arcaneTricksterFeatures[3]] },
    { level: 5, features: [arcaneTricksterFeatures[4]] },
    { level: 6, features: [arcaneTricksterFeatures[5]] },
    { level: 7, features: [arcaneTricksterFeatures[6]] },
    { level: 8, features: [arcaneTricksterFeatures[7]] },
    { level: 9, features: [arcaneTricksterFeatures[8]] },
    { level: 10, features: [arcaneTricksterFeatures[9]] },
  ],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'arcane-class',
        label: 'Arcane Spellcasting Class',
        kind: 'arcane',
        advancementLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
  subclassLevel: 20,
  subclasses: [],
};
