// D&D 5e SRD Divine Smites for Paladins
//
// SRD 5.1 Divine Smite: "the extra damage is 2d8 for a 1st-level spell slot,
// plus 1d8 for each spell level higher than 1st, to a maximum of 5d8" — so the
// dice are min(slot level + 1, 5)d8 (a 4th-level slot already reaches the cap).

export interface DivineSmite {
  id: string;
  name: string;
  system: string;
  source: string;
  spellSlotLevel: number;
  baseDamage: string;
  description: string;
  effects: string[];
}

export const divineSmites: DivineSmite[] = [
  {
    id: 'divine-smite-1st',
    name: 'Divine Smite (1st Level)',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 1,
    baseDamage: '2d8',
    description:
      'When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target.',
    effects: ['Deal 2d8 radiant damage for a 1st-level slot (+1d8 per higher slot level, max 5d8)'],
  },
  {
    id: 'divine-smite-2nd',
    name: 'Divine Smite (2nd Level)',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 2,
    baseDamage: '3d8',
    description:
      'When you hit a creature with a melee weapon attack, you can expend a 2nd-level spell slot to deal radiant damage.',
    effects: ['Deal 3d8 radiant damage'],
  },
  {
    id: 'divine-smite-3rd',
    name: 'Divine Smite (3rd Level)',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 3,
    baseDamage: '4d8',
    description:
      'When you hit a creature with a melee weapon attack, you can expend a 3rd-level spell slot to deal radiant damage.',
    effects: ['Deal 4d8 radiant damage'],
  },
  {
    id: 'divine-smite-4th',
    name: 'Divine Smite (4th Level)',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 4,
    baseDamage: '5d8',
    description:
      'When you hit a creature with a melee weapon attack, you can expend a 4th-level spell slot to deal radiant damage (5d8 is the maximum).',
    effects: ['Deal 5d8 radiant damage (maximum)'],
  },
  {
    id: 'divine-smite-5th',
    name: 'Divine Smite (5th Level)',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 5,
    baseDamage: '5d8',
    description:
      'When you hit a creature with a melee weapon attack, you can expend a 5th-level spell slot to deal radiant damage (capped at 5d8).',
    effects: ['Deal 5d8 radiant damage (capped)'],
  },
  {
    id: 'divine-smite-undead',
    name: 'Divine Smite vs Undead',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 1,
    baseDamage: '1d8',
    description:
      'Divine Smite deals an extra 1d8 radiant damage when used against an undead or fiend.',
    effects: ['Extra 1d8 damage vs undead/fiends'],
  },
  {
    id: 'divine-smite-fiend',
    name: 'Divine Smite vs Fiends',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    spellSlotLevel: 1,
    baseDamage: '1d8',
    description: 'Divine Smite deals an extra 1d8 radiant damage when used against a fiend.',
    effects: ['Extra 1d8 damage vs fiends'],
  },
];
