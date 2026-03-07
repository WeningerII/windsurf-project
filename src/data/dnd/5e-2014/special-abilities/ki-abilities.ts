// D&D 5e SRD Monk Ki Abilities

export interface KiAbility {
  id: string;
  name: string;
  system: string;
  source: string;
  kiCost: number;
  minLevel: number;
  description: string;
  effects: string[];
}

export const kiAbilities: KiAbility[] = [
  {
    id: 'flurry-of-blows',
    name: 'Flurry of Blows',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    kiCost: 1,
    minLevel: 1,
    description:
      'Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.',
    effects: ['Make two unarmed strikes as bonus action'],
  },
  {
    id: 'patient-defense',
    name: 'Patient Defense',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    kiCost: 1,
    minLevel: 1,
    description:
      'You can spend 1 ki point to take the Dodge action as a bonus action on your turn.',
    effects: ['Take Dodge action as bonus action'],
  },
  {
    id: 'step-of-the-wind',
    name: 'Step of the Wind',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    kiCost: 1,
    minLevel: 1,
    description:
      'You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is tripled until the end of the turn.',
    effects: ['Take Disengage/Dash as bonus action, triple jump distance'],
  },
  {
    id: 'slow-fall',
    name: 'Slow Fall',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    kiCost: 1,
    minLevel: 4,
    description:
      'You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.',
    effects: ['Reduce fall damage by 5x monk level'],
  },
  {
    id: 'stunning-strike',
    name: 'Stunning Strike',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    kiCost: 1,
    minLevel: 5,
    description:
      'You can spend 1 ki point to try to stun a creature you hit with a melee weapon attack.',
    effects: ['Attempt to stun creature on melee hit'],
  },
  {
    id: 'ki-empowered-strikes',
    name: 'Ki-Empowered Strikes',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    kiCost: 0,
    minLevel: 6,
    description:
      'Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
    effects: ['Unarmed strikes count as magical'],
  },
];
