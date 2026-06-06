import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level9Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'disjunction-pf2e',
    name: 'Disjunction',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'abjuration',
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
    effect: "Rip apart a target's magic and suppress its magical properties",
    concentration: false,
    ritual: false,
    description:
      "You destroy the target's magic, ripping it apart. The target loses all magical properties for 1 minute. If the target is an artifact, it instead loses its magical properties for 1 hour.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'foresight-9-pf2e',
    name: 'Foresight',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'divination',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You gain a supernatural sense of impending danger. You gain a +2 status bonus to initiative and aren't flat-footed against hidden or undetected creatures. You can't be surprised.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'gate-9-pf2e',
    name: 'Gate',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'conjuration',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 60,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    effect: 'A portal linking an unoccupied space you can see to a location on another plane',
    concentration: false,
    ritual: false,
    description:
      'You conjure a portal linking an unoccupied space you can see to a precise location on a different plane of existence.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'implosion-pf2e',
    name: 'Implosion',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'evocation',
    traditions: ['arcane'],
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
      type: 'varies',
    },
    target: '1 creature within range',
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You crush the target with telekinetic force. The target takes 75 damage with a basic Fortitude save. If the target critically fails the save, it is crushed into a tiny ball and dies.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 10.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'meteor-swarm-pf2e',
    name: 'Meteor Swarm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
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
      type: 'instant',
    },
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
      'You call down four meteors that explode in a fiery blast. Each meteor deals 6d10 bludgeoning damage to any creatures in the 10-foot burst and 14d6 fire damage to creatures in the 40-foot burst.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The bludgeoning damage increases by 1d10, and the fire damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'power-word-kill-9-pf2e',
    name: 'Power Word Kill',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'enchantment',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 1,
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
      type: 'instant',
    },
    target: '1 creature with 50 or fewer Hit Points, or stun a hardier target',
    concentration: false,
    ritual: false,
    description:
      "You utter a single word of power that instantly kills one creature with 50 or fewer Hit Points. If the target has more than 50 HP, it's stunned 1 instead.",
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (10th): The levels at which each outcome applies increase by 2.',
      ranks: {
        10: 'The levels at which each outcome applies increase by 2.',
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'prismatic-sphere-9-pf2e',
    name: 'Prismatic Sphere',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'abjuration',
    traditions: ['arcane'],
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 10,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'An immobile, invisible sphere of magical force surrounds you. Nothing can pass through the barrier from either side.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'shapechange-9-pf2e',
    name: 'Shapechange',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'transmutation',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    effect: "Transform into a battle form you've seen of level 15 or lower",
    concentration: false,
    ritual: false,
    description:
      "You transform into a battle form. Choose a form you've seen that's level 15 or lower. You can change between forms by Dismissing and Casting the spell again.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'time-stop-9-pf2e',
    name: 'Time Stop',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'transmutation',
    traditions: ['arcane'],
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    effect: 'You take 1d4+1 rounds of actions while time is stopped for everyone else',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (10th): You gain 3 extra actions you can use on your turn.',
      ranks: {
        10: 'You temporarily stop time for everything but yourself, allowing you to use several actions in what appears to others to be no time at all. You gain 3 extra actions you can use on your turn.',
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You briefly stop the flow of time for everyone but yourself. You can take 1d4+1 rounds of actions.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'wish-pf2e',
    name: 'Wish',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'divination',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'unlimited',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'varies',
    },
    effect:
      'Duplicate a spell of 9th level or lower or produce a comparable reality-warping effect',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (10th): Wish becomes the mightiest spell a mortal creature can cast, directly altering the foundations of reality.',
      ranks: {
        10: 'Wish is the mightiest spell a mortal creature can cast. By speaking aloud, you can alter the very foundations of reality.',
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You state a wish, making your greatest desire come true. A wish spell can produce any one of the following effects: duplicate any spell of 9th level or lower, produce any effect whose power level is in line with the above effects, grant a creature a +1 circumstance bonus to one ability score for 1 hour.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'weird-pf2e',
    name: 'Weird',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'illusion',
    traditions: ['arcane', 'occult'],
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'As phantasmal killer, but affecting all creatures in the area; each sees its own deadly phantasm and may die on a critical failure.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'wail-of-the-banshee-pf2e',
    name: 'Wail of the Banshee',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'necromancy',
    traditions: ['occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'fort',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You loose a keening wail in a 40-foot emanation, dealing 8d10 negative damage and enfeebling creatures that fail their Fortitude saves.',
    classes: ['bard'],
  },
]);
