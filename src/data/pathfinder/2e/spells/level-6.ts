import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level6Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'baleful-polymorph-pf2e',
    name: 'Baleful Polymorph',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'transmutation',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'permanent',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You transform the target into a harmless animal form. The target must attempt a Fortitude save. On a failure, it becomes a tiny animal.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'chain-lightning-pf2e',
    name: 'Chain Lightning',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 8,
        die: 'd12',
        notation: '8d12',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'You discharge a powerful bolt of lightning at the target, dealing 8d12 electricity damage. The target must attempt a basic Reflex save. The electricity arcs to another creature within 30 feet of the first target, and so on.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d12.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'disintegrate-6-pf2e',
    name: 'Disintegrate',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'transmutation',
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 12,
        die: 'd10',
        notation: '12d10',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'A thin, green ray springs from your pointing finger. The target takes 12d10 force damage. A creature reduced to 0 HP is entirely disintegrated.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d10.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'geyser-pf2e',
    name: 'Geyser',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'evocation',
    traditions: ['arcane', 'primal'],
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
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 10,
      height: 60,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 7,
        die: 'd12',
        notation: '7d12',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A geyser of boiling water erupts from the ground. Each creature in the area takes 7d12 fire damage with a basic Reflex save.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'mislead-6-pf2e',
    name: 'Mislead',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'illusion',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 30,
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
    concentration: true,
    ritual: false,
    description:
      'You become invisible and create an illusory double. You can move the double while you move separately.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'teleport-pf2e',
    name: 'Teleport',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'conjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 10,
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
    target: 'You and the other targets',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (7th): You and up to 8 willing creatures are instantly transported to any location on the same plane that you can identify precisely.',
      ranks: {
        7: 'You and up to 8 willing creatures are instantly transported to any location on the same plane that you can identify precisely.',
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You and the other targets are instantly transported to any location within range, as long as you can identify the location precisely both by its position relative to your starting position and by its appearance (or other identifying features).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'true-seeing-pf2e',
    name: 'True Seeing',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'divination',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You see things within 60 feet as they actually are. The target can see through visual illusions and transmutations, and it can see invisible creatures and objects.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-force-pf2e',
    name: 'Wall of Force',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'ranged',
      feet: 30,
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
      'You form an invisible wall of pure magical force up to 50 feet long and up to 20 feet high. The wall has no discernible thickness. It must be a straight line, though you can shape it into a curve.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): The Hit Points of the wall increases by 20.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-ice-pf2e',
    name: 'Wall of Ice',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
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
    concentration: false,
    ritual: false,
    description:
      'You create a wall of solid ice. The wall is 1 foot thick and composed of up to 10 contiguous 10-foot sections. Each section has AC 10, Hardness 10, and 40 Hit Points. It melts slowly in warm environments.',
    classes: ['sorcerer', 'wizard'],
  },
]);
