import { Spell } from '../../../../types/magic/spells';

export const level5Spells: Spell[] = [
  {
    id: 'pf1e-cloudkill',
    name: 'Cloudkill',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'special',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell generates a bank of fog, similar to a fog cloud, except that its vapors are yellowish green and poisonous. Living creatures with 3 or fewer HD die, and living creatures with 4 to 6 HD are slain unless they succeed on a Fortitude save.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-cone-of-cold',
    name: 'Cone of Cold',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cone',
      feet: 60,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6 per level (max 15d6)',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'Cone of cold creates an area of extreme cold, originating at your hand and extending outward in a cone. It drains heat, dealing 1d6 points of cold damage per caster level (maximum 15d6).',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-contact-other-plane',
    name: 'Contact Other Plane',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'divination',
    castingTime: {
      type: 'minutes',
      minutes: 10,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: false,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute per level',
    },
    concentration: true,
    ritual: false,
    description:
      'You send your mind to another plane of existence in order to receive advice and information from powers there. The powers reply in a language you understand, but they resent such contact and give only brief answers to your questions.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-dominate-person',
    name: 'Dominate Person',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      "You can control the actions of any humanoid creature through a telepathic link that you establish with the subject's mind. Once you have given a dominated creature a command, it continues to attempt to carry out that command to the exclusion of all other activities.",
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-feeblemind',
    name: 'Feeblemind',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'enchantment',
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
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      "Target creature's Intelligence and Charisma scores each drop to 1. The affected creature is unable to use Intelligence- or Charisma-based skills, cast spells, understand language, or communicate coherently.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-hold-monster',
    name: 'Hold Monster',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'enchantment',
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like hold person, except that it affects any living creature that fails its Will save.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-passwall',
    name: 'Passwall',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'transmutation',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a passage through wooden, plaster, or stone walls, but not through metal or other harder materials. The passage is 10 feet deep plus an additional 5 feet deep per three caster levels above 9th (15 feet at 12th, 20 feet at 15th, and a maximum of 25 feet deep at 18th level).',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-telekinesis',
    name: 'Telekinesis',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'transmutation',
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 round per level',
    },
    concentration: true,
    ritual: false,
    description:
      'You move objects or creatures by concentrating on them. Depending on the version selected, the spell can provide a gentle, sustained force, perform a variety of combat maneuvers, or exert a single short, violent thrust.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-teleport',
    name: 'Teleport',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "This spell instantly transports you to a designated destination, which may be as distant as 100 miles per caster level. You can bring along objects as long as their weight doesn't exceed your maximum load. You may also bring one additional willing Medium or smaller creature per three caster levels.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-wall-of-force',
    name: 'Wall of Force',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "A wall of force creates an invisible wall of pure force. The wall cannot move and is not easily destroyed. A wall of force is immune to dispel magic, although a mage's disjunction can still dispel it.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'pf1e-wall-of-stone',
    name: 'Wall of Stone',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 5,
    school: 'conjuration',
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
    concentration: false,
    ritual: false,
    description:
      "This spell creates a wall of rock that merges into adjoining rock surfaces. A wall of stone is 1 inch thick per four caster levels and composed of up to one 5-foot square per level. You can double the wall's area by halving its thickness.",
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 5,
      druid: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
];
