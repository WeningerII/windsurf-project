import { Spell } from '../../../../types/magic/spells';

export const level6Spells: Spell[] = [
  {
    id: 'pf1e-chain-lightning',
    name: 'Chain Lightning',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 6,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6 per level (max 20d6)',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell creates an electrical discharge that begins as a single stroke commencing from your fingertips. Unlike lightning bolt, chain lightning strikes one object or creature initially, then arcs to other targets. The bolt deals 1d6 points of electricity damage per caster level (maximum 20d6) to the primary target.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 6,
      wizard: 6,
    },
  },
  {
    id: 'pf1e-disintegrate',
    name: 'Disintegrate',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 6,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 100,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 2,
        die: 'd6',
        notation: '2d6 per level (max 40d6)',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'A thin, green ray springs from your pointing finger. You must make a successful ranged touch attack to hit. Any creature struck by the ray takes 2d6 points of damage per caster level (to a maximum of 40d6). Any creature reduced to 0 or fewer hit points by this spell is entirely disintegrated.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 6,
      wizard: 6,
    },
  },
  {
    id: 'pf1e-greater-dispel-magic',
    name: 'Greater Dispel Magic',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 6,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 100,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like dispel magic, except that it can end more than one spell on a target and it can be used to target multiple creatures.',
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 6,
      cleric: 6,
      druid: 6,
      sorcerer: 6,
      wizard: 6,
    },
  },
  {
    id: 'pf1e-true-seeing',
    name: 'True Seeing',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 6,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You confer on the subject the ability to see all things as they actually are. The subject sees through normal and magical darkness, notices secret doors hidden by magic, sees the exact locations of creatures or objects under blur or displacement effects, sees invisible creatures or objects normally, sees through illusions, and sees the true form of polymorphed, changed, or transmuted things.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 6,
      druid: 6,
      sorcerer: 6,
      wizard: 6,
    },
  },
];
