import { Feature } from '../../../../types/core/character';

// D&D 5e-2014 Monk Ki Abilities
// Monastic Traditions grant special abilities powered by Ki points

export const monkKiAbilities: Feature[] = [
  {
    id: 'ki-flurry-of-blows',
    name: 'Flurry of Blows',
    source: 'Monk',
    description: 'Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.',
  },
  {
    id: 'ki-patient-defense',
    name: 'Patient Defense',
    source: 'Monk',
    description: 'You can spend 1 ki point to take the Dodge action as a bonus action on your turn.',
  },
  {
    id: 'ki-step-of-the-wind',
    name: 'Step of the Wind',
    source: 'Monk',
    description: 'You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is doubled for the turn.',
  },
  {
    id: 'ki-stunning-strike',
    name: 'Stunning Strike',
    source: 'Monk',
    description: 'You can spend 1 ki point to attempt to stun a creature you hit with a melee weapon attack. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.',
  },
  {
    id: 'ki-wholeness-of-body',
    name: 'Wholeness of Body',
    source: 'Monk',
    description: 'You can regain hit points equal to three times your monk level by spending 1 ki point as an action.',
  },
  {
    id: 'ki-tranquility',
    name: 'Tranquility',
    source: 'Monk',
    description: 'You can spend 1 ki point to cast sanctuary on yourself, using Wisdom as your spellcasting ability for the spell.',
  },
  {
    id: 'ki-empty-body',
    name: 'Empty Body',
    source: 'Monk',
    description: 'You can spend 4 ki points to cast invisibility on yourself. You can spend an additional 2 ki points to cast it on one willing creature you can see within 60 feet of you.',
  },
  {
    id: 'ki-quivering-palm',
    name: 'Quivering Palm',
    source: 'Monk',
    description: 'You can spend 3 ki points to make a special melee attack. If you hit, the target takes the damage normally and must make a Constitution saving throw. If it fails, it is dying.',
  },
  {
    id: 'ki-diamond-soul',
    name: 'Diamond Soul',
    source: 'Monk',
    description: 'Your mastery of ki grants you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.',
  },
  {
    id: 'ki-timeless-body',
    name: 'Timeless Body',
    source: 'Monk',
    description: 'Your ki sustains you so that you suffer none of the frailty of old age, and you can\'t be aged magically. You can still die of old age, however. In addition, you no longer need food or water.',
  },
  {
    id: 'ki-unarmored-movement',
    name: 'Unarmored Movement',
    source: 'Monk',
    description: 'Your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels.',
  },
  {
    id: 'ki-deflect-missiles',
    name: 'Deflect Missiles',
    source: 'Monk',
    description: 'You can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.',
  },
  {
    id: 'ki-slow-fall',
    name: 'Slow Fall',
    source: 'Monk',
    description: 'You can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.',
  },
  {
    id: 'ki-perfect-self',
    name: 'Perfect Self',
    source: 'Monk',
    description: 'You can spend 4 ki points to cast a spell from the monk spell list without expending a spell slot. The spell must be of a level for which you have spell slots.',
  },
  {
    id: 'ki-purity-of-body',
    name: 'Purity of Body',
    source: 'Monk',
    description: 'Your mastery of the ki flowing through you makes you immune to disease and poison.',
  },
];

export const monkKiAbilitiesArray = monkKiAbilities;
