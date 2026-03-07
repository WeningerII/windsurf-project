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

export const blindFighting: FeatDefinition = {
  id: 'fighting-style-blind-fighting',
  name: 'Fighting Style: Blind Fighting',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description: 'You have Blindsight with a range of 10 feet.',
  benefits: ['Blindsight with a range of 10 feet.'],
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

export const dueling: FeatDefinition = {
  id: 'fighting-style-dueling',
  name: 'Fighting Style: Dueling',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'When you are wielding a Melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
  benefits: [
    '+2 bonus to damage rolls when wielding a Melee weapon in one hand with no other weapons.',
  ],
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

export const interception: FeatDefinition = {
  id: 'fighting-style-interception',
  name: 'Fighting Style: Interception',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'When a creature you can see hits another creature within 5 feet of you with an attack, you can take a Reaction to reduce the damage by 1d10 + your Proficiency Bonus.',
  benefits: [
    'Reaction to reduce damage to an ally within 5 feet by 1d10 + Proficiency Bonus. Requires Shield or Simple/Martial weapon.',
  ],
};

export const protection: FeatDefinition = {
  id: 'fighting-style-protection',
  name: 'Fighting Style: Protection',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'When a creature you can see attacks a target other than you that is within 5 feet of you, you can take a Reaction to interpose your Shield and impose Disadvantage on the attack roll.',
  benefits: [
    'Reaction to impose Disadvantage on an attack against an ally within 5 feet. Requires Shield.',
  ],
};

export const thrownWeaponFighting: FeatDefinition = {
  id: 'fighting-style-thrown-weapon-fighting',
  name: 'Fighting Style: Thrown Weapon Fighting',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'You can draw a weapon that has the Thrown property as part of the attack you make with the weapon. In addition, when you hit with a ranged attack using a Thrown weapon, you gain a +2 bonus to the damage roll.',
  benefits: [
    'Draw Thrown weapons as part of the attack. +2 bonus to damage rolls with Thrown weapons.',
  ],
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

export const unarmedFighting: FeatDefinition = {
  id: 'fighting-style-unarmed-fighting',
  name: 'Fighting Style: Unarmed Fighting',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d6 + your Strength modifier instead of the normal damage. If you have two free hands, the d6 becomes a d8.',
  benefits: [
    'Unarmed Strike deals 1d6 + Strength modifier (or 1d8 with two free hands). Grappled creatures take 1d4 Bludgeoning at start of your turn.',
  ],
};

export const closeQuartersShooter: FeatDefinition = {
  id: 'fighting-style-close-quarters-shooter',
  name: 'Fighting Style: Close Quarters Shooter',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description: 'You are trained in making ranged attacks at close quarters.',
  benefits: [
    "+1 bonus to attack rolls with Ranged weapons. Being within 5 feet of a hostile creature doesn't impose Disadvantage on Ranged attack rolls. Your Ranged attacks ignore Half Cover against targets within 30 feet.",
  ],
};

export const mariner: FeatDefinition = {
  id: 'fighting-style-mariner',
  name: 'Fighting Style: Mariner',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'As long as you are not wearing Heavy armor or using a Shield, you have a Swim Speed and a Climb Speed equal to your normal Speed, and you gain a +1 bonus to AC.',
  benefits: [
    'Swim and Climb Speed equal to normal Speed. +1 bonus to AC when not wearing Heavy armor or using a Shield.',
  ],
};

export const superiorTechnique: FeatDefinition = {
  id: 'fighting-style-superior-technique',
  name: 'Fighting Style: Superior Technique',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description:
    'You learn one Maneuver of your choice from among those available to the Battle Master archetype. If a Maneuver requires a saving throw, the DC equals 8 + your Proficiency Bonus + your Strength or Dexterity modifier.',
  benefits: [
    'Learn one Battle Master Maneuver. You gain one Superiority Die (d6), which you regain when you finish a Short or Long Rest.',
  ],
};

export const tunnelFighter: FeatDefinition = {
  id: 'fighting-style-tunnel-fighter',
  name: 'Fighting Style: Tunnel Fighter',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description: 'You excel at defending narrow passages and doorways.',
  benefits: [
    'As a Bonus Action, you can enter a defensive stance. While in this stance, you can make Opportunity Attacks without using your Reaction, and you can use your Reaction to make a melee attack against any creature that moves more than 5 feet within your reach. The stance lasts until the start of your next turn.',
  ],
};

export const superiorDefense: FeatDefinition = {
  id: 'fighting-style-superior-defense',
  name: 'Fighting Style: Superior Defense',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  prerequisites: [{ type: 'other', description: 'Warrior class or Fighting Style feature' }],
  description: 'You have exceptional defensive capabilities.',
  benefits: [
    'While you are wearing armor, you gain a +1 bonus to AC. Additionally, when you use your reaction to impose disadvantage on an attack roll, you can add your proficiency bonus to your AC against that attack.',
  ],
};

export const fightingStyleFeats: FeatDefinition[] = [
  archery,
  blindFighting,
  defense,
  dueling,
  greatWeaponFighting,
  interception,
  protection,
  thrownWeaponFighting,
  twoWeaponFighting,
  unarmedFighting,
  closeQuartersShooter,
  mariner,
  superiorTechnique,
  tunnelFighter,
  superiorDefense,
];
