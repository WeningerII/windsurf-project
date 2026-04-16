import { Spell } from '../../../../types/magic/spells';

export const level7Spells: Spell[] = [
  {
    id: 'delayed-blast-fireball-7-pf2e',
    name: 'Delayed Blast Fireball',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 500,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 10,
        die: 'd6',
        notation: '10d6',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      'A fireball explodes at a point you designate. You can delay the explosion for up to 5 rounds. Each creature takes 10d6 fire damage with a basic Reflex save.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'energy-aegis-pf2e',
    name: 'Energy Aegis',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'abjuration',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'touch',
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
    target: '1 creature touched',
    concentration: false,
    ritual: false,
    description:
      'You protect the target with a powerful, multi-layered defense. The target gains resistance 5 to acid, cold, electricity, fire, force, negative, positive, and sonic damage.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'ethereal-jaunt-pf2e',
    name: 'Ethereal Jaunt',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'transmutation',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'self',
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
    concentration: false,
    ritual: false,
    description:
      'You step into the Ethereal Plane. You can see into the Material Plane from the Ethereal Plane, but not vice versa.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'firestorm-7-pf2e',
    name: 'Firestorm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 500,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex save',
    damage: {
      base: {
        count: 14,
        die: 'd6',
        notation: '14d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'You call down a massive firestorm. Creatures in five 10-foot cubes within range must attempt a Reflex save, taking 14d6 fire damage on a failure or half on a success.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'forcecage-7-pf2e',
    name: 'Forcecage',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 120,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    effect: 'An invisible, immobile, cube-shaped prison of magical force',
    concentration: false,
    ritual: false,
    description:
      'An invisible, immobile, cube-shaped prison of magical force springs into being. Nothing can pass through the barrier from either side.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'plane-shift-pf2e',
    name: 'Plane Shift',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'conjuration',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      type: 'instant',
    },
    target: 'You and up to 8 willing creatures touched',
    concentration: false,
    ritual: false,
    description:
      'You and up to 8 willing creatures physically enter the Astral Plane or the Ethereal Plane. Alternatively, you can transport yourself and up to 8 willing creatures to another plane of existence.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'power-word-blind-7-pf2e',
    name: 'Power Word Blind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'enchantment',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 120,
    },
    components: {
      verbal: true,
      somatic: false,
      material: false,
    },
    duration: {
      type: 'permanent',
    },
    target: '1 creature you can see within range',
    concentration: false,
    ritual: false,
    description:
      'You utter a word of power that blinds one creature you can see. If the creature has fewer than 200 HP, it is blinded.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'prismatic-spray-pf2e',
    name: 'Prismatic Spray',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'cone',
      feet: 30,
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
      'A spray of rainbow light beams cascades from your open hand. Each creature in the area must roll 1d8 on the table below to see which beam affects it, then attempt a saving throw of the indicated type.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'regenerate-7-pf2e',
    name: 'Regenerate',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'necromancy',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'touch',
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
    target: '1 creature touched',
    concentration: false,
    ritual: false,
    description:
      'The target regains 15 Hit Points per round for 1 minute. The target also regrows severed body parts and removes the drained condition.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'reverse-gravity-pf2e',
    name: 'Reverse Gravity',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'ranged',
      feet: 120,
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
    areaOfEffect: {
      type: 'cylinder',
      radius: 20,
      height: 40,
    },
    concentration: false,
    ritual: false,
    description:
      "You reverse gravity in a 20-foot radius, 40-foot-tall cylinder. Creatures and objects in the area that aren't secured to the ground immediately fall upward to the top of the area.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'teleport-7-pf2e',
    name: 'Teleport',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'conjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'unlimited',
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
      'You and up to 8 willing creatures are instantly transported to any location on the same plane that you can identify precisely.',
    classes: ['sorcerer', 'wizard'],
  },
];
