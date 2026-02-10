import { Feature } from '../../../../types/core/character';

// D&D 5e-2014 Additional Features - SRD Compliant
// Channel Divinity, Wild Shape, and other class features

// CHANNEL DIVINITY OPTIONS
export const turnUndead: Feature = {
  id: 'turn-undead',
  name: 'Turn Undead',
  source: 'SRD 5.1',
  description: 'As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its save, it must spend its next turn trying to move as far away from you as it can.',
};

export const destroyUndead: Feature = {
  id: 'destroy-undead',
  name: 'Destroy Undead',
  source: 'SRD 5.1',
  description: 'When an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold.',
};

export const divineSmite: Feature = {
  id: 'divine-smite',
  name: 'Divine Smite',
  source: 'SRD 5.1',
  description: 'Starting at 2nd level, when you hit a creature with a weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon\'s damage.',
};

export const layOnHands: Feature = {
  id: 'lay-on-hands',
  name: 'Lay on Hands',
  source: 'SRD 5.1',
  description: 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.',
};

export const harnessDivinepower: Feature = {
  id: 'harness-divine-power',
  name: 'Harness Divine Power',
  source: 'SRD 5.1',
  description: 'You can expend a use of your Channel Divinity to focus your will on one creature you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw or take psychic damage.',
};

export const preserveLife: Feature = {
  id: 'preserve-life',
  name: 'Preserve Life',
  source: 'SRD 5.1',
  description: 'You can use your Channel Divinity to heal the badly wounded. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level.',
};

// WILD SHAPE FORMS
export const wildShapeBadger: Feature = {
  id: 'wild-shape-badger',
  name: 'Wild Shape: Badger',
  source: 'SRD 5.1',
  description: 'You can assume the form of a badger. AC 10, HP 3, Speed 30 ft., burrow 5 ft. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) slashing damage.',
};

export const wildShapeBear: Feature = {
  id: 'wild-shape-bear',
  name: 'Wild Shape: Bear',
  source: 'SRD 5.1',
  description: 'You can assume the form of a bear. AC 11, HP 34, Speed 40 ft. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage.',
};

export const wildShapeBoar: Feature = {
  id: 'wild-shape-boar',
  name: 'Wild Shape: Boar',
  source: 'SRD 5.1',
  description: 'You can assume the form of a boar. AC 11, HP 11, Speed 40 ft. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage.',
};

export const wildShapeCrocodile: Feature = {
  id: 'wild-shape-crocodile',
  name: 'Wild Shape: Crocodile',
  source: 'SRD 5.1',
  description: 'You can assume the form of a crocodile. AC 12, HP 19, Speed 20 ft., swim 30 ft. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage.',
};

export const wildShapeDeer: Feature = {
  id: 'wild-shape-deer',
  name: 'Wild Shape: Deer',
  source: 'SRD 5.1',
  description: 'You can assume the form of a deer. AC 13, HP 4, Speed 50 ft. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.',
};

export const wildShapeEagle: Feature = {
  id: 'wild-shape-eagle',
  name: 'Wild Shape: Eagle',
  source: 'SRD 5.1',
  description: 'You can assume the form of an eagle. AC 13, HP 13, Speed 10 ft., fly 60 ft. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage.',
};

export const wildShapeLion: Feature = {
  id: 'wild-shape-lion',
  name: 'Wild Shape: Lion',
  source: 'SRD 5.1',
  description: 'You can assume the form of a lion. AC 12, HP 26, Speed 50 ft. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage.',
};

export const wildShapeWolf: Feature = {
  id: 'wild-shape-wolf',
  name: 'Wild Shape: Wolf',
  source: 'SRD 5.1',
  description: 'You can assume the form of a wolf. AC 13, HP 11, Speed 40 ft. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage.',
};

// ADDITIONAL FEATURES
export const actionSurge: Feature = {
  id: 'action-surge',
  name: 'Action Surge',
  source: 'SRD 5.1',
  description: 'Starting at 1st level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action.',
};

export const secondWind: Feature = {
  id: 'second-wind',
  name: 'Second Wind',
  source: 'SRD 5.1',
  description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
};

export const uncannyDodge: Feature = {
  id: 'uncanny-dodge',
  name: 'Uncanny Dodge',
  source: 'SRD 5.1',
  description: 'Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
};

export const evasion: Feature = {
  id: 'evasion',
  name: 'Evasion',
  source: 'SRD 5.1',
  description: 'Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon\'s fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw.',
};

export const additionalFeatures: Feature[] = [
  turnUndead,
  destroyUndead,
  divineSmite,
  layOnHands,
  harnessDivinepower,
  preserveLife,
  wildShapeBadger,
  wildShapeBear,
  wildShapeBoar,
  wildShapeCrocodile,
  wildShapeDeer,
  wildShapeEagle,
  wildShapeLion,
  wildShapeWolf,
  actionSurge,
  secondWind,
  uncannyDodge,
  evasion,
];
