/**
 * D&D 5e (2014) - Monk Ki Abilities
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface MonkKiAbility {
  id: string;
  name: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  kiCost: number;
  minLevel: number;
  description: string;
  actionType: 'action' | 'bonus' | 'reaction' | 'passive';
  effects: string[];
  version: string;
}

export const monkKiAbilities: MonkKiAbility[] = [
  {
    id: 'flurry-of-blows',
    name: 'Flurry of Blows',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 1,
    minLevel: 2,
    description:
      'Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.',
    actionType: 'bonus',
    effects: ['Make two unarmed strikes as bonus action'],
    version: '1.0.0',
  },
  {
    id: 'patient-defense',
    name: 'Patient Defense',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 1,
    minLevel: 2,
    description:
      'You can spend 1 ki point to take the Dodge action as a bonus action on your turn.',
    actionType: 'bonus',
    effects: ['Take Dodge action as bonus action'],
    version: '1.0.0',
  },
  {
    id: 'step-of-the-wind',
    name: 'Step of the Wind',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 1,
    minLevel: 2,
    description:
      'You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is doubled for the turn.',
    actionType: 'bonus',
    effects: ['Take Disengage or Dash as bonus action', 'Double jump distance'],
    version: '1.0.0',
  },
  {
    id: 'slow-fall',
    name: 'Slow Fall',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 0,
    minLevel: 4,
    description:
      'You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.',
    actionType: 'reaction',
    effects: ['Reduce fall damage by 5× monk level'],
    version: '1.0.0',
  },
  {
    id: 'stunning-strike',
    name: 'Stunning Strike',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 1,
    minLevel: 5,
    description:
      'When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.',
    actionType: 'action',
    effects: ['Attempt to stun creature on hit', 'Target makes Constitution save'],
    version: '1.0.0',
  },
  {
    id: 'ki-empowered-strikes',
    name: 'Ki-Empowered Strikes',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 0,
    minLevel: 6,
    description:
      'Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
    actionType: 'passive',
    effects: ['Unarmed strikes count as magical'],
    version: '1.0.0',
  },
  {
    id: 'stillness-of-mind',
    name: 'Stillness of Mind',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 0,
    minLevel: 7,
    description:
      'You can use your action to end one effect on yourself that is causing you to be charmed or frightened.',
    actionType: 'action',
    effects: ['End charmed or frightened condition on self'],
    version: '1.0.0',
  },
  {
    id: 'purity-of-body',
    name: 'Purity of Body',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 0,
    minLevel: 10,
    description:
      'Your mastery of the ki flowing through you makes you immune to disease and poison.',
    actionType: 'passive',
    effects: ['Immune to disease', 'Immune to poison'],
    version: '1.0.0',
  },
  {
    id: 'diamond-soul',
    name: 'Diamond Soul',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 29 },
    kiCost: 1,
    minLevel: 14,
    description:
      'You gain proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.',
    actionType: 'passive',
    effects: ['Proficiency in all saves', 'Spend 1 ki to reroll failed save'],
    version: '1.0.0',
  },
];
