import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level4Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'air-walk-pf2e',
    name: 'Air Walk',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'transmutation',
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
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'The target can walk on air as if it were solid ground. The target gains a fly Speed equal to its land Speed.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'blink-pf2e',
    name: 'Blink',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'conjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: false,
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
      "You phase in and out of existence. You gain resistance 5 to all damage. At the start of each of your turns, roll 1d4. On a result of 1, you're incorporeal until the start of your next turn.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): The resistance increases by 3.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'confusion-pf2e',
    name: 'Confusion',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'enchantment',
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: true,
    ritual: false,
    description:
      'You befuddle your target with strange impulses. The target must attempt a Will save. On a failure, the target is confused for 1 round. On a critical failure, the target is confused for 1 minute.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (8th): You can target up to 10 creatures.',
      ranks: {
        8: 'You can target up to 10 creatures.',
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'dimension-door-pf2e',
    name: 'Dimension Door',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'conjuration',
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
    concentration: false,
    ritual: false,
    description:
      "Opening a door that bypasses normal space, you instantly transport yourself and any items you're wearing and holding from your current space to a clear space within range you can see. If this would bring another creature with you, the spell is lost.",
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (5th): The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are temporarily immune for 1 hour.",
      ranks: {
        5: "The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are temporarily immune for 1 hour.",
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'dimension-anchor-pf2e',
    name: 'Dimension Anchor',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
    traditions: ['arcane', 'divine'],
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      "You prevent the target from teleporting or traveling through other dimensions. The target must attempt a Will save. On a failure, it can't teleport or use dimensional travel for the duration.",
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'fly-pf2e',
    name: 'Fly',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'transmutation',
    traditions: ['arcane'],
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
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'The target can soar through the air, gaining a fly Speed equal to its Speed or 20 feet, whichever is greater.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): The duration increases to 1 hour.',
      ranks: {
        7: 'The duration increases to 1 hour.',
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'freedom-pf2e',
    name: 'Freedom of Movement',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You repel effects that would hinder a creature's movement. The target ignores difficult terrain and greater difficult terrain, and effects that would impose a circumstance penalty on their Speed.",
    classes: ['cleric', 'druid', 'ranger'],
  },
  {
    id: 'globe-of-invulnerability-pf2e',
    name: 'Globe of Invulnerability',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 10,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You create a 10-foot-radius sphere of shimmering energy. Spells of 3rd level or lower can't pass through the globe and have no effect on targets within it.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'solid-fog-pf2e',
    name: 'Solid Fog',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'conjuration',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a bank of fog so thick it impedes movement as well as sight. This functions as obscuring mist, but the area is also difficult terrain.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'spell-immunity-pf2e',
    name: 'Spell Immunity',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
    traditions: ['divine'],
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
      'You ward the target against a specific spell. Choose one spell of 4th level or lower. The target is immune to that spell for the duration.',
    classes: ['cleric'],
  },
  {
    id: 'stoneskin-pf2e',
    name: 'Stoneskin',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
    traditions: ['arcane', 'primal'],
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
      minutes: 20,
    },
    concentration: false,
    ritual: false,
    description:
      "The target's skin hardens like stone. The target gains resistance 5 to physical damage, except adamantine. Each time the target is hit by a bludgeoning, piercing, or slashing attack, stoneskin's duration decreases by 1 minute.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (6th): The resistance increases to 10. Heightened (8th): The resistance increases to 15. Heightened (10th): The resistance increases to 20.',
      ranks: {
        6: 'The resistance increases to 10.',
        8: 'The resistance increases to 15.',
        10: 'The resistance increases to 20.',
      },
    },
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-fire-pf2e',
    name: 'Wall of Fire',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'evocation',
    traditions: ['arcane', 'primal'],
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 4,
        die: 'd6',
        notation: '4d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'You raise a blazing wall that burns creatures passing through it. You create either a 5-foot-thick wall of flame in a straight line up to 60 feet long and 10 feet high, or a 5-foot-thick, 10-foot-radius ring of flame with the same height.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The fire damage increases by 1d6.',
    },
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'phantasmal-killer-pf2e',
    name: 'Phantasmal Killer',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You conjure an illusory monster only the target perceives, dealing 8d6 mental damage and frightening it (with death possible on a critical failure).',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The mental damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'fire-shield-pf2e',
    name: 'Fire Shield',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'evocation',
    traditions: ['arcane', 'primal'],
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
      'A shield of flame wreathes you, granting cold resistance and dealing 2d6 fire damage to creatures that hit you with melee attacks.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): The cold resistance increases by 5 and the fire damage by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'suggestion-pf2e',
    name: 'Suggestion',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'enchantment',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You suggest a single reasonable course of action; the target pursues it unless it succeeds at a Will save.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': 'The maximum duration increases to 1 hour.',
      },
      summary: 'Heightened (6th): duration up to 1 hour.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
]);
