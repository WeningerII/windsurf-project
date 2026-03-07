// D&D 5e SRD Fighting Styles for Fighters and Paladins

export interface FightingStyle {
  id: string;
  name: string;
  system: string;
  source: string;
  class: string[];
  description: string;
  benefits: string[];
}

export const fightingStyles: FightingStyle[] = [
  {
    id: 'archery',
    name: 'Archery',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['fighter', 'paladin'],
    description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
    benefits: ['+2 bonus to ranged weapon attack rolls'],
  },
  {
    id: 'defense',
    name: 'Defense',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['fighter', 'paladin'],
    description: 'While you are wearing armor, you gain a +1 bonus to AC.',
    benefits: ['+1 bonus to AC while wearing armor'],
  },
  {
    id: 'dueling',
    name: 'Dueling',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['fighter', 'paladin'],
    description:
      'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
    benefits: ['+2 bonus to damage rolls with single melee weapon'],
  },
  {
    id: 'great-weapon-fighting',
    name: 'Great Weapon Fighting',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['fighter', 'paladin'],
    description:
      'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll.',
    benefits: ['Reroll 1 or 2 on damage dice for two-handed melee weapons'],
  },
  {
    id: 'protection',
    name: 'Protection',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['fighter', 'paladin'],
    description:
      'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll.',
    benefits: ['Impose disadvantage on attacks against nearby allies'],
  },
  {
    id: 'two-weapon-fighting',
    name: 'Two-Weapon Fighting',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['fighter', 'paladin'],
    description:
      'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
    benefits: ['Add ability modifier to off-hand weapon damage'],
  },
  {
    id: 'blessed-warrior',
    name: 'Blessed Warrior',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    class: ['paladin'],
    description: 'You can use your action to cast a cantrip or use your Channel Divinity.',
    benefits: ['Cast cantrip or use Channel Divinity as action'],
  },
];
