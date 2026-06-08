// D&D 5e (2024) Fighting Style Feats - SRD 5.2

import { FeatDefinition } from '../../../../types/character-options/feats';

export const archery: FeatDefinition = {
  id: 'fighting-style-archery',
  name: 'Fighting Style: Archery',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description: 'You gain a +2 bonus to attack rolls you make with Ranged weapons.',
  benefits: ['+2 bonus to attack rolls with Ranged weapons.'],
};

export const defense: FeatDefinition = {
  id: 'fighting-style-defense',
  name: 'Fighting Style: Defense',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description: 'While you are wearing armor, you gain a +1 bonus to AC.',
  benefits: ['+1 bonus to AC while wearing armor.'],
};

export const greatWeaponFighting: FeatDefinition = {
  id: 'fighting-style-great-weapon-fighting',
  name: 'Fighting Style: Great Weapon Fighting',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'When you roll damage for an attack you make with a Melee weapon that you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3.',
  benefits: ['Treat any 1 or 2 on damage dice as a 3 when wielding a Melee weapon with two hands.'],
};

export const twoWeaponFighting: FeatDefinition = {
  id: 'fighting-style-two-weapon-fighting',
  name: 'Fighting Style: Two-Weapon Fighting',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'When you make an extra attack as a result of using a weapon that has the Light property, you can add your ability modifier to the damage of that attack.',
  benefits: ['Add ability modifier to damage of the extra attack from Light weapon fighting.'],
};

export const fightingStyleFeats: FeatDefinition[] = [
  archery,
  defense,
  greatWeaponFighting,
  twoWeaponFighting,
];
