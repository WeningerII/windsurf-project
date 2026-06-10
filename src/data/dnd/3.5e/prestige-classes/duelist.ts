// D&D 3.5e Prestige Class: Duelist

import { CharacterClass } from '../../../../types/character-options/classes';
import { Feature } from '../../../../types/core/character';

const duelistFeatures: Feature[] = [
  {
    id: 'canny-defense-35e',
    name: 'Canny Defense',
    description:
      'When unarmored and wielding a melee weapon, a duelist adds Intelligence bonus to AC up to their duelist level.',
    source: 'Duelist 1',
  },
  {
    id: 'improved-reaction-2-35e',
    name: 'Improved Reaction +2',
    description: 'The duelist gains a +2 competence bonus on initiative checks.',
    source: 'Duelist 2',
  },
  {
    id: 'enhanced-mobility-35e',
    name: 'Enhanced Mobility',
    description:
      'The duelist gains an extra +4 dodge bonus to AC against attacks of opportunity caused by movement.',
    source: 'Duelist 3',
  },
  {
    id: 'grace-35e',
    name: 'Grace',
    description: 'The duelist gains a +2 competence bonus on Reflex saves.',
    source: 'Duelist 4',
  },
  {
    id: 'precise-strike-1-35e',
    name: 'Precise Strike +1d6',
    description:
      'While wielding a piercing weapon in one hand and no weapon in the other, the duelist deals +1d6 extra damage.',
    source: 'Duelist 5',
  },
  {
    id: 'acrobatic-charge-35e',
    name: 'Acrobatic Charge',
    description:
      'The duelist can charge across difficult terrain and through allied squares if movement still ends adjacent to the target.',
    source: 'Duelist 6',
  },
  {
    id: 'elaborate-parry-35e',
    name: 'Elaborate Parry',
    description:
      'When fighting defensively or using total defense, the duelist adds Intelligence bonus to AC as a dodge bonus.',
    source: 'Duelist 7',
  },
  {
    id: 'improved-reaction-4-35e',
    name: 'Improved Reaction +4',
    description: 'The duelist’s competence bonus on initiative checks improves to +4.',
    source: 'Duelist 8',
  },
  {
    id: 'deflect-arrows-35e',
    name: 'Deflect Arrows',
    description:
      'The duelist gains Deflect Arrows as a bonus feat while wielding at least one melee weapon and keeping one hand free.',
    source: 'Duelist 9',
  },
  {
    id: 'precise-strike-2-35e',
    name: 'Precise Strike +2d6',
    description: 'The duelist’s precise strike damage improves to +2d6.',
    source: 'Duelist 10',
  },
];

export const duelist: CharacterClass = {
  id: 'duelist-35e',
  name: 'Duelist',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  version: '3.5',
  lastUpdated: '2026-03-08',
  sourceBook: {
    name: 'SRD 3.5',
    url: 'https://www.d20srd.org/srd/prestigeClasses/duelist.htm',
  },
  description:
    'A lightly armored swashbuckler who turns agility, wit, and precision into a deadly dueling style.',
  hitDie: 'd10',
  d20Profile: {
    bab: 'full',
    fortSave: 'poor',
    refSave: 'good',
    willSave: 'poor',
  },
  primaryAbility: ['dex', 'int'],
  armorProficiencies: [],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'balance',
      'bluff',
      'escape-artist',
      'jump',
      'listen',
      'perform',
      'sense-motive',
      'spot',
      'tumble',
    ],
    label: 'Choose four skills',
  },
  equipmentChoices: [],
  features: [
    { level: 1, features: [duelistFeatures[0]] },
    { level: 2, features: [duelistFeatures[1]] },
    { level: 3, features: [duelistFeatures[2]] },
    { level: 4, features: [duelistFeatures[3]] },
    { level: 5, features: [duelistFeatures[4]] },
    { level: 6, features: [duelistFeatures[5]] },
    { level: 7, features: [duelistFeatures[6]] },
    { level: 8, features: [duelistFeatures[7]] },
    { level: 9, features: [duelistFeatures[8]] },
    { level: 10, features: [duelistFeatures[9]] },
  ],
  subclassLevel: 20,
  subclasses: [],
};
