import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level8Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'earthquake-pf2e',
    name: 'Earthquake',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You shake the ground, topple creatures into fissures, and collapse structures. The GM might add additional effects in certain areas. Cliffs might collapse, causing creatures to fall, or a lake might drain as fissures open up below its surface.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (10th): You create a massive earthquake that can devastate a settlement. The range increases to half a mile and the area to a quarter-mile burst.',
      ranks: {
        10: 'You create a massive earthquake that can devastate a settlement. The range increases to half a mile and the area to a quarter-mile burst.',
      },
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'horrid-wilting-pf2e',
    name: 'Horrid Wilting',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'necromancy',
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
    damage: {
      base: {
        count: 10,
        die: 'd10',
        notation: '10d10',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      "You pull the moisture from the targets' bodies, dealing 10d10 negative damage. Creatures made of water or with the water trait, such as water elementals, take double damage from horrid wilting.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d10.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'maze-pf2e',
    name: 'Maze',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'conjuration',
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
    concentration: false,
    ritual: false,
    description:
      'You transport the target into an extradimensional maze of eldritch origin and trap it there. Once per turn, the target can attempt an Intelligence check or Perception check against your spell DC to escape the maze.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'misdirection-mass-8-pf2e',
    name: 'Misdirection, Mass',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like misdirection, except that it can affect one creature per caster level.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'polar-ray-pf2e',
    name: 'Polar Ray',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    damage: {
      base: {
        count: 10,
        die: 'd8',
        notation: '10d8',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'You fire a blue-white ray of freezing air and sleet that deals 10d8 cold damage. The target must attempt a Fortitude save. On a critical failure, the target is also drained 2.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d8.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'power-word-stun-8-pf2e',
    name: 'Power Word Stun',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'instant',
    },
    target: '1 creature you can see within range',
    concentration: false,
    ritual: false,
    description:
      'You utter a word of power that stuns one creature you can see. If the creature has fewer than 150 HP, it is stunned.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The levels at which each outcome applies increase by 2.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'prismatic-wall-8-pf2e',
    name: 'Prismatic Wall',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'abjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'hours',
      hours: 10,
    },
    effect: 'A shimmering, multicolored wall of light',
    concentration: false,
    ritual: false,
    description:
      'A shimmering, multicolored plane of light springs into being. The wall is opaque to normal sight. Each color has a special effect.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'sunburst-8-pf2e',
    name: 'Sunburst',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'evocation',
    traditions: ['arcane', 'divine', 'primal'],
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
    area: '60-foot burst',
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex save',
    damage: {
      base: {
        count: 8,
        die: 'd10',
        notation: '8d10',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'You cause brilliant sunlight to explode in a 60-foot burst. Creatures in the area take 8d10 damage and are blinded. Undead and creatures with light blindness take double damage. Targets attempt a Reflex save.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
]);
