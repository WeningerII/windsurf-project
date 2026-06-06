import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level5Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'banishment-pf2e',
    name: 'Banishment',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
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
      "You banish the target to another plane of existence. The target must attempt a Will save. On a failure, if the target is native to this plane, it's sent to a random location on a different plane. If it's not native, it returns to its home plane.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (9th): You can target up to 10 creatures. The extra material component affects targets to which it is anathema.',
      ranks: {
        9: 'You can target up to 10 creatures. The extra material component affects targets to which it is anathema.',
      },
    },
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'cloudkill-pf2e',
    name: 'Cloudkill',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'necromancy',
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
      type: 'rounds',
      rounds: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude save',
    damage: {
      base: {
        count: 6,
        die: 'd8',
        notation: '6d8',
      },
      type: 'poison',
    },
    concentration: true,
    ritual: false,
    description:
      'You conjure a poisonous fog. This functions as obscuring mist, except the area moves 10 feet away from you each round. Each creature that starts its turn in the cloud takes 6d8 poison damage with a basic Fortitude save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'cone-of-cold-pf2e',
    name: 'Cone of Cold',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'evocation',
    traditions: ['arcane'],
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
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 12,
        die: 'd6',
        notation: '12d6',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'Icy cold rushes forth from your hands. You deal 12d6 cold damage to creatures in the area; they must each attempt a basic Reflex save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'crushing-despair-pf2e',
    name: 'Crushing Despair',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You inflict despair on creatures in the area. Affected creatures take a -2 status penalty to attack rolls, saving throws, ability checks, and skill checks.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): The area increases to a 60-foot cone.',
      ranks: {
        7: 'The area increases to a 60-foot cone.',
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'feeblemind-pf2e',
    name: 'Feeblemind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'enchantment',
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
      type: 'permanent',
    },
    savingThrow: {
      attribute: 'int',
      success: 'none',
    },
    savingThrowText: 'Intelligence save',
    concentration: false,
    ritual: false,
    description:
      "You reduce the target's mental faculties. The target must attempt an Intelligence save. On a failure, the target becomes feebleminded.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'passwall-pf2e',
    name: 'Passwall',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'conjuration',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a visible tunnel through the wall in the chosen area, replacing the area with empty space. If the wall is thicker than 10 feet, the tunnel ends 10 feet in.',
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (7th): The tunnel can be up to 20 feet deep. The areas of the wall that contain your tunnel's entrance appear completely normal (unless viewed with true seeing or a similar effect), despite the tunnel's existence. The tunnel's entrance functions as a solid wall, but you can specify a password or a trigger, allowing creatures to enter the tunnel freely.",
      ranks: {
        7: "The tunnel can be up to 20 feet deep. The areas of the wall that contain your tunnel's entrance appear completely normal (unless viewed with true seeing or a similar effect), despite the tunnel's existence. The tunnel's entrance functions as a solid wall, but you can specify a password or a trigger, allowing creatures to enter the tunnel freely.",
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'prying-eye-pf2e',
    name: 'Prying Eye',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'divination',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 1,
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
      type: 'hours',
      hours: 1,
    },
    concentration: true,
    ritual: false,
    description:
      "You create an invisible, floating eye, 1 inch in diameter, at a location you can see within range. It hovers there and remains for the duration, allowing you to see from its position as if you were there. The eye can't move, but you can dismiss the spell and create a new eye as an action.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'sending-pf2e',
    name: 'Sending',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'divination',
    traditions: ['arcane', 'divine', 'occult'],
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You send the target a mental message of 25 words or fewer, and it can respond immediately with its own message of 25 words or fewer.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'synaptic-pulse-pf2e',
    name: 'Synaptic Pulse',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
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
    damage: {
      base: {
        count: 6,
        die: 'd6',
        notation: '6d6',
      },
      type: 'psychic',
    },
    concentration: false,
    ritual: false,
    description:
      'You emit a pulsating mental blast. Creatures in a 30-foot emanation must attempt a Will save, taking 6d6 mental damage and becoming stunned 1 on a failure.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-stone-pf2e',
    name: 'Wall of Stone',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'conjuration',
    traditions: ['arcane', 'divine', 'primal'],
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You shape a wall of solid stone. You create a 1-inch-thick wall of stone up to 120 feet long, and 20 feet high. The wall doesn't need to stand vertically, so you can use it to form a bridge or set of stairs, for example.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): The Hit Points of each section of the wall increase by 15.',
    },
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'flame-strike-pf2e',
    name: 'Flame Strike',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'evocation',
    traditions: ['divine'],
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
      attribute: 'ref',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'A column of righteous fire deals 8d6 fire damage in a 10-foot radius (half of it unaffected by fire resistance).',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['cleric'],
  },
  {
    id: 'death-ward-pf2e',
    name: 'Death Ward',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'necromancy',
    traditions: ['divine', 'occult'],
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
      'You ward a creature against the forces of death, granting a bonus against death and negative effects and reducing its doomed condition.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'chromatic-wall-pf2e',
    name: 'Chromatic Wall',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 5,
    school: 'abjuration',
    traditions: ['arcane', 'occult'],
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
      minutes: 10,
    },
    savingThrow: {
      attribute: 'ref',
      success: 'none',
    },
    savingThrowText: 'see text',
    concentration: false,
    ritual: false,
    description:
      'You create a shimmering wall of four colored layers, each imposing a different effect on creatures that pass through or attack through it.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '7': 'The wall becomes a prismatic wall with seven layers.',
      },
      summary: 'Heightened (7th): becomes a seven-layer prismatic wall.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
]);
