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
  {
    id: 'acid-storm-pf2e',
    name: 'Acid Storm',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 5,
    school: 'arcane',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "You evoke a storm of acid rain that pelts the area for the spell's duration. A creature that begins its turn in the area takes 3d8 acid damage (basic Reflex save).\nHeightened (+2) The damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The damage increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'ancestral-winds-pf2e',
    name: 'Ancestral Winds',
    system: 'pf2e',
    source: "Pathfinder #209: Destroyer's Doom",
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "You call on the same energies that manifest ancestor storms, summoning wailing spirits to terrorize your foes. Living creatures in the area take 5d6 void damage and 1d6 mental damage and must attempt a Will save. Nonliving creatures are immune to this spell's effects.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage and is Frightened 1.\nFailure The creature takes full damage and is Frightened 2.\nCritical Failure As failure, but the creature takes double damage and is Stunned 1.\nThe first time each round you Sustain the spell, you can move the area up to 30 feet within the range of the spell. Living creatures in the new area must attempt saves with the same effects as above.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'blister-pf2e',
    name: 'Blister',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You point at a target in range, and its skin grows searing blisters filled with caustic fluid. The target must attempt a Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target grows one blister. You can spend a single action, which has the concentrate trait, to pop a blister. The target and each creature in a originating from the target takes 7d6 acid damage (basic Fortitude save). You choose the direction of the cone, which can't include the target. When no blisters are left, the spell ends.\nFailure As success, but the target grows two blisters.\nCritical Failure As success, but the target grows four blisters.\nHeightened (+1) The damage of a popped blister increases by 1d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage of a popped blister increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'boomerang-shot-pf2e',
    name: 'Boomerang Shot',
    system: 'pf2e',
    source: 'Pathfinder #203: Shepherd of Decay',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'special',
      description: '100',
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You launch a curved length of wood at a foe that arcs around objects and obstacles to strike from an unexpected direction. Make a spell attack roll against the target's AC. This attack ignores the target's condition and ignores all cover except greater cover. If you hit, the projectile deals 7d10 bludgeoning damage.\nHeightened (7th) The damage increases to 9d10.\nHeightened (9th) The damage increases to 12d10, and the attack ignores cover completely.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '7': 'Heightened (7th) The damage increases to 9d10. Heightened (9th) The damage increases to 12d10, and the attack ignores cover completely.',
        '9': 'Heightened (7th) The damage increases to 9d10. Heightened (9th) The damage increases to 12d10, and the attack ignores cover completely.',
      },
      summary:
        'Heightened (7th) The damage increases to 9d10. Heightened (9th) The damage increases to 12d10, and the attack ignores cover completely.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'breath-of-life-pf2e',
    name: 'Breath of Life',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
    traditions: ['divine'],
    castingTime: {
      type: 'reaction',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 60,
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
      "Trigger A living creature within range would die.\nYour blessing revives a creature at the moment of its death. You prevent the target from dying and restore 5d8 Hit Points to the target. You can't use breath of life if the triggering effect was a death effect or an effect that leaves no remains, such as \nHeightened (+2) The healing increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+2) The healing increases by 1d8.',
    },
    classes: ['cleric'],
  },
  {
    id: 'chameleon-coat-pf2e',
    name: 'Chameleon Coat',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'ranged',
      feet: 15,
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
      "You shift the colors of the targets' outermost layer of clothing and gear to be closer to their environment when they remain still. Creatures affected by the spell gain a +3 status bonus to Stealth checks to Hide. The changed color granted by the spell always shifts to match the environment, even if there are drastic changes. If any piece of gear or clothing affected by the spell is removed from a creature, the spell ends for that creature.\nHeightened (6th) If a creature affected by this spell rolls a critical failure on its Stealth check to within 30 feet of a creature that would spot it, it instead only fails its check, as the spell mildly hypnotizes the spotter.\nHeightened (8th) As 6th rank, and the status bonus is +4.",
    classes: ['druid'],
  },
  {
    id: 'cloak-of-colors-pf2e',
    name: 'Cloak of Colors',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'arcane',
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
      'A cloak of swirling colors shrouds the target. Creatures are while adjacent to it, and attacking the target causes a brilliant flash of light. A creature that hits the target with a melee attack must attempt a Will save. The creature is then temporarily immune until the end of its turn; this effect has the incapacitation trait.\nSuccess The attacker is unaffected.\nFailure The attacker is for 1 round.\nCritical Failure The attacker is for 1 round',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'confusing-cry-pf2e',
    name: 'Confusing Cry',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 5,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You give an unsettling, warbling cry that causes nearby creatures to lash out without control. Each creature in the area that can hear must attempt a Will save.\nCritical Success The target is unaffected and immune to this spell for 1 minute.\nSuccess The target is Stunned 1.\nFailure The target is for 1 minute. It can attempt a new save at the end of each of its turns to end the confusion.\nCritical Failure As failure, and the creature immediately attacks itself. This Strike doesn't give the creature a flat check to recover from the confusion.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'control-water-pf2e',
    name: 'Control Water',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      type: 'hours',
      hours: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'By imposing your will upon the water, you can raise or lower the level of water in the chosen area by 10 feet. Creatures that have the water trait and that are in the area when you Cast the Spell must attempt a Fortitude save, with the effects of the spell.\nArea 50 feet long by 50 feet wide',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'corrosive-muck-pf2e',
    name: 'Corrosive Muck',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'arcane',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "Area all squares in two 10-foot bursts.\nYou create two puddles of acidic slime that hinders the movement of anyone who walks through them. The area of each pool becomes greater difficult terrain. Each round that a creature starts its turn in one of the pools or enters a pool during a move action it's using, it takes 8d6 acid damage with a basic Reflex save. A creature that critically fails its saving throw also takes 1d6 acid]. As normal, if a Large or larger creature starts its turn in both pools, it takes the damage only once.\nHeightened (+2) Create an additional 10-foot burst.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'diadem-of-divine-radiance-pf2e',
    name: 'Diadem of Divine Radiance',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      "You don a diadem of radiant light, which sheds bright light to a range of 60 feet and dim light to a further 60 feet. When you Cast the Spell and when you Sustain it during the duration, you can draw a disc of spiraling light from the diadem and throw it at a creature within 120 feet. Make a ranged spell attack at mythic proficiency against the target's AC. This action has the attack and spirit traits. On a hit, you deal 4d8 spirit damage, 1d4 persistent spirit damage, and the target is for 1 round (3 rounds on a critical hit). The persistent damage isn't doubled on a critical hit.\nIf the disc passes through an area of magical darkness or targets a creature affected by magical darkness, the disc's glow attempts to counteract the darkness using your Religion or Occultism skill modifier as the counteract check modifier and half your level as the counteract rank.\nHeightened (+2) The disc's spirit damage increases by 2d8, and the persistent damage increases by 1d4.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        "Heightened (+2) The disc's spirit damage increases by 2d8, and the persistent damage increases by 1d4.",
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'divine-immolation-pf2e',
    name: 'Divine Immolation',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
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
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'Divine flames scour creatures within the area. Creatures take 6d6 fire damage and (@item.level -3)d6 persistent] damage. The divine power within the flames scorches the spirit as well; a creature takes spirit damage instead of fire damage from divine immolation if that would be more detrimental to the creature (as determined by the GM).\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage and no persistent damage.\nFailure The creature takes full damage and persistent damage.\nCritical Failure The creature takes double damage and double persistent damage.\nHeightened (+1) The damage increases by 1d6 and persistent damage increases by 1d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage increases by 1d6 and persistent damage increases by 1d6.',
    },
    classes: ['cleric'],
  },
  {
    id: 'domoras-defense-pf2e',
    name: "Domora's Defense",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "Domora Hume is considered by most to be the first god caller, conjuring a god from the Plane of Water named Dyzad to protect his town from Mammoth Lord raiders. A lost story of this defense claims that Dyzad appeared to be in three places at once, blocking the raiders' spears, swords, and torches. The intended lesson is that Dyzad will overcome any barrier to protect the people of Sarkoris. This spell gives that intention physical form, allowing the caster to protect their people.\nWhen you Cast this Spell, a watery replica of the eidolon Dyzad appears in front of each of the targets, granting them a +1 circumstance bonus to AC and fire resistance 5.\nWhile the replica persists, a target can use the Shield Block reaction with the replica. The replica has Hardness 15 (or Hardness 20 against fire damage). They can use this reaction to reduce damage from any spell or magical effect, even if it doesn't deal physical damage. After a target uses Shield Block, the replica dissipates. The spell ends when you no longer Sustain it or if all three replicas have dissipated, whichever happens first.",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'dreaming-potential-pf2e',
    name: 'Dreaming Potential',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'occult',
    traditions: ['occult'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You draw the target into a lucid dream where it can explore the endless possibilities of its own potential within the everchanging backdrop of its dreamscape. If it sleeps the full 8 hours uninterrupted, when it wakes, it counts as having spent a day of downtime retraining, though it can't use dreaming potential for any retraining that would require either an instructor or specialized knowledge it can't access within the dream.",
    classes: ['bard'],
  },
  {
    id: 'drop-dead-pf2e',
    name: 'Drop Dead',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'reaction',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 120,
    },
    components: {
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "The target appears to fall down dead, though it actually turns . Its illusory corpse remains where it fell, complete with a believable fatal wound. This illusion looks and feels like a dead body. If the target's death seems absurd—for instance, a barbarian at full health appears to be slain by 2 damage—the GM can grant the attacker an immediate Perception check to disbelieve the illusion. If the target uses hostile actions, the spell ends. This ends the entire spell, so the illusory corpse disappears too.\nHeightened (7th) The spell doesn't end if the target uses a hostile action.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'elemental-form-pf2e',
    name: 'Elemental Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      "You call upon the power of the planes to transform into a Medium elemental battle form. When you Cast this Spell, choose a listed element. While in this form, you gain the corresponding trait and the elemental trait. You have hands in this battle form and can take manipulate actions. You can Dismiss the spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 19 + your level. Ignore your armor's check penalty and Speed reduction.\n• 10 temporary Hit Points.\n• Darkvision.\n• One or more unarmed melee attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +18, and your damage bonus is +9. These are Dexterity based (air, fire, or metal) or Strength based (earth, water, or wood). If your corresponding unarmed attack modifier is higher, you can use it instead.\n• Acrobatics (air, fire, or metal) or Athletics (earth, water, or wood) modifier of +20; ignore this change if your own modifier is higher.\nYou also gain specific abilities based on the type of elemental you choose:\n• Air\n• fly 80 feet, movement doesn't trigger reactions;\n• Melee 1 gust, Damage 1d4 bludgeoning.\n• Earth\n• Speed 20 feet, burrow 20 feet;\n• Melee 1 boulder, Damage 2d10 bludgeoning.\n• Fire\n• Speed 50 feet; fire resistance 10, weakness 5 to cold and 5 to water;\n• Melee 1 tendril, Damage 1d8 fire plus 1d4 persistent fire.\n• Metal\n• Speed 40 feet, fly 20 feet;\n• Melee 1 blade (versatile piercing), Damage 1d8 slashing plus 1d4 electricity.\n• Water\n• Speed 20 feet, swim 60 feet; fire resistance 5;\n• Melee 1 wave, Damage 1d12 bludgeoning, and you can spend an action immediately after a hit to push the target 5 feet with the effects of a successful .\n• Wood\n• Speed 20 feet, climb 30 feet;\n• Melee 1 branch, Damage 2d10 bludgeoning.\nHeightened (6th) Your battle form is Large and your attacks have 10-foot reach. You must have space to expand or the spell is lost. You instead gain AC = 22 + your level, 15 temporary HP, an attack modifier of +23, a damage bonus of +13, and Acrobatics or Athletics +23.\nHeightened (7th) Your battle form is Huge and your attacks have 15-foot reach. You must have space to expand or the spell is lost. You instead gain AC = 22 + your level, 20 temporary HP, an attack modifier of +25, a damage bonus of +11, double the number of damage dice (including persistent damage), and Acrobatics or Athletics +25.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'false-vision-pf2e',
    name: 'False Vision',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You create a false image that fools any attempts to scry on an area. Any scrying spell sees, hears, smells, and otherwise detects whatever you wish within the area, rather than what is actually in the area. You can Sustain the spell each round to change the illusion as you desire, including playing out a complex scene. If the scrying spell is of a higher rank than false vision, the scryer can attempt a Perception check to disbelieve the illusion, though even if they're successful, they can't learn what's truly going on in the area.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'grisly-growths-pf2e',
    name: 'Grisly Growths',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "This gruesome spell causes the target to grow excess limbs and organs, whether it be fingers multiplying until hands resemble bushes, eyes popping open in bizarre places, legs sprouting from the side of the body, or some other result. The target takes 10d6 piercing damage (basic Fortitude save) as the new features erupt. This spell has no effect on a target with a mutable anatomy or no limbs, such as an ooze or a protean. The growths rot rapidly and fall away after 1 round.\nIn addition, unless the initial target critically succeeds, creatures within 30 feet of the target, including the target, must attempt Will saves, after which they're temporarily immune to this secondary effect of grisly growths for 1 hour. This additional effect is a mental and visual effect.\nSuccess The creature is unaffected.\nFailure The creature is Sickened 1.\nCritical Failure The creature is Sickened 2.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'hallucination-pf2e',
    name: 'Hallucination',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "The target consistently detects one thing as another, can't detect something that's there, or detects something that's not there, though it doesn't alter their beliefs. You choose which of these effects applies, and you determine the specifics of the hallucination. For example, you could make the target see all elves as humans, be unable to detect the presence of their brother, see their beloved good luck charm on their person even when it isn't, or see a tower in the center of town.\nThe target can attempt an initial Will save, with effects below. They also receive a Will save to disbelieve the hallucination every time they or directly interact with the hallucination. For example, the target could attempt to disbelieve the hallucination each time they interacted with an elf, bumped into their brother accidentally, tried to check their charm, or studied the tower. The target can attempt to disbelieve with a large circumstance bonus in situations determined by the GM, such as if the target attempted to climb the nonexistent tower.\nCritical Success The creature is unaffected.\nSuccess The creature perceives what you chose until it disbelieves, but it knows what the hallucination is.\nFailure The creature perceives what you chose until it disbelieves.\nCritical Failure The creature perceives what you chose until it disbelieves, and it trusts its false senses, taking a -4 circumstance penalty to saves to disbelieve.\nHeightened (6th) Choose to either target up to 10 creatures or change the spell's duration to until your next daily preparations.\nHeightened (8th) Choose to either target any number of creatures or change the spell's duration to unlimited.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': "Heightened (6th) Choose to either target up to 10 creatures or change the spell's duration to until your next daily preparations. Heightened (8th) Choose to either target any number of creatures or change the spell's duration to unlimited.",
        '7': "Heightened (6th) Choose to either target up to 10 creatures or change the spell's duration to until your next daily preparations. Heightened (8th) Choose to either target any number of creatures or change the spell's duration to unlimited.",
      },
      summary:
        "Heightened (6th) Choose to either target up to 10 creatures or change the spell's duration to until your next daily preparations. Heightened (8th) Choose to either target any number of creatures or change the spell's duration to unlimited.",
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'howling-blizzard-pf2e',
    name: 'Howling Blizzard',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'Freezing winds extend from your hands, pushing away from you with great force. If you Cast this Spell with 2 actions, it has an area of a 60-foot cone; if you Cast this Spell with 3 actions, it has a range of 500 feet and an area of a 30-foot burst. Each creature in the area takes 10d6 cold damage with a basic Reflex save. Snowdrifts and icy gales fill the area until the start of your next turn, making the area difficult terrain.\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'illusory-scene-pf2e',
    name: 'Illusory Scene',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
    concentration: false,
    ritual: false,
    description:
      "You craft an imaginary scene that includes up to 10 discrete creatures or objects of various sizes, all of which must be within the spell's area. These elements generate appropriate sounds and smells, and they feel right to the touch. Elements of an illusory scene are incapable of speech. Unlike with the spell, creatures in your scene lack combat abilities and statistics. Your scene doesn't include changes to the environment around it, though you can place your scene within the illusory environment of a spell.\nWhen you create the scene, you can choose to have it be static or follow a program. Though a static scene is stationary, it includes basic natural movement. For example, wind blowing on an illusory piece of paper would rustle it. A program can be up to 1 minute long and repeats when finished. For instance, you could create a scene of two orcs fighting each other, and the fight would go the same way for each repetition. If you create a loop, the two fighters end up in the same place at the start of the scene and at the end of it, but you can smooth the program so it's hard to tell when the loop ends and begins. Anyone observing the scene for more than a few minutes almost always notices it looping. You're unable to alter the program after you create the illusion.\nAny creature that touches any part of the image or uses the action to examine it can attempt to disbelieve your illusion. If they interact with a portion of the illusion, they disbelieve only that portion. They disbelieve the entire scene only on a critical success.\nHeightened (6th) Creatures or objects in your scene can speak. You must speak the specific lines for each actor when creating your program. The spell disguises your voice for each actor.\nHeightened (8th) As the 6th-rank version, and the duration is unlimited.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'imaginary-lockbox-pf2e',
    name: 'Imaginary Lockbox',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 1,
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You turn a container and its contents into an imaginary form stored in your mind that only you can see and interact with. The container's physical properties—the material from which it's made, any locks, or other features—are irrelevant to the casting of this spell, but the container can't contain any creatures. The container has no Bulk, and you can visualize everything inside it.\nYou can retrieve an item from the lockbox as an activity that takes 3 actions and has the concentrate and manipulate traits. Putting items back isn't possible. You can Dismiss the spell. When the spell ends, the container returns to its normal state, either appearing in your hands if it can fit there or on the ground adjacent to you if not.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'impaling-spike-pf2e',
    name: 'Impaling Spike',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "You conjure a spike that thrusts up from the earth beneath a target creature, potentially impaling it. The spike is made of cold iron and deals 8d6 piercing damage. The target must attempt a Reflex save.\nCritical Success The target dodges the spike and is unaffected.\nSuccess The target is struck by the spike and takes half damage.\nFailure The target is impaled through a leg or another nonvital body part. The creature takes full damage and, if it's standing on solid ground, becomes . It can attempt to (the DC is your spell DC). While it remains impaled, it takes damage from any weakness to cold iron it has at the end of each of its turns.\nCritical Failure As failure, but the creature is impaled through a vital organ or its center of mass, taking double damage, and it is as long as it's impaled.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'invoke-spirits-pf2e',
    name: 'Invoke Spirits',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: true,
    ritual: false,
    description:
      "Ragged apparitions of the dead rise to stalk the living. They deal 2d4 mental damage and 2d4 void damage to each living creature in the area, with a basic Will save. Additionally, creatures that critically fail the save are Frightened 2 and are for 1 round.\nOn subsequent rounds, the first time you Sustain the Spell each round, you can move the area up to 30 feet within the range of the spell. Living creatures in the new area must attempt saves with the same effects as above, except that critically failing doesn't make them flee.\nHeightened (+2) The mental damage and void damage each increase by 1d4.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The mental damage and void damage each increase by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'lightning-storm-pf2e',
    name: 'Lightning Storm',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'primal',
    traditions: ['primal'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: true,
    ritual: false,
    description:
      "You create a black, rumbling storm cloud and call down one lightning bolt within the spell's area. The bolt is a vertical line from the top of the storm cloud to the ground below, dealing 4d12 electricity damage to creatures in the line (basic Reflex save). On subsequent rounds, the first time you Sustain the Spell each round, you can call another lightning bolt within the area. If you Cast this Spell outdoors, you can create two non-overlapping clouds instead of one, though you can still call down only one bolt per turn.\nHeightened (+2) The damage of each bolt increases by 1d12.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The damage of each bolt increases by 1d12.',
    },
    classes: ['druid'],
  },
  {
    id: 'magic-passage-pf2e',
    name: 'Magic Passage',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      "You create a visible tunnel through the wall in the chosen area, replacing the area with empty space. If the wall is thicker than 10 feet, the tunnel ends 10 feet in. Even a small layer of metal in the wall prevents this spell from functioning. This spell doesn't reduce the integrity of the structure. When the spell ends, anyone inside the tunnel is shunted to the nearest exit.\nHeightened (7th) The tunnel can be up to 20 feet deep. The areas of the wall that contain your tunnel's entrance appear completely normal (unless viewed with truesight or a similar effect), despite the tunnel's existence. The tunnel's entrance functions as a solid wall, but you can specify a password or a trigger, allowing creatures to enter freely.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'mariners-curse-pf2e',
    name: "Mariner's Curse",
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      "You afflict the target with the curse of the roiling, unforgiving sea. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target becomes Sickened 1. Reducing its sickened condition to 0 ends the curse.\nFailure The target becomes sickened 1 and can't reduce its sickened condition below 1 while the curse remains. The curse can be lifted by 4th-rank or similar magic. Whenever the target is sickened and on the water at least a mile from shore, it is also Slowed 1.\nCritical Failure As failure, but the target becomes Sickened 2.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'mind-probe-pf2e',
    name: 'Mind Probe',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 1,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "You cast your thoughts through a creature's mind, sifting for information. You access the target's memories and knowledge unless it fends you off with a Will save.\nSuccess The target is unaffected.\nFailure Each round of the spell's duration, you can Sustain the spell to ask a different question and attempt to uncover the answer. For each question, the target can attempt a Deception check against your spell DC; if the target succeeds, you don't learn the answer, and on a critical success, the target gives you a false answer that you believe is truthful Once you've asked the target a given question, asking it again, even with a separate casting of mind probe, produces the same result.\nCritical Failure As failure, and the target takes a –4 circumstance penalty to Deception checks against your questions.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'moon-frenzy-pf2e',
    name: 'Moon Frenzy',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'primal',
    traditions: ['primal'],
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
      "A feral aspect overcomes the targets, filling them with strength and ferocity. Targets gain 5 temporary Hit Points, a +10-foot status bonus to their Speeds, and weakness 5 to silver. They also grow vicious fangs and claws, which are unarmed attacks. The fangs deal 2d8 piercing damage; the claws deal 2d6 slashing damage and have the agile and finesse traits. The targets use their highest weapon or unarmed attack proficiency with these attacks, and if they have weapon specialization or greater weapon specialization, they add this damage as well. On a critical hit with one of these unarmed attacks, the creature struck takes 1d4 persistent bleed damage.\nThe targets can't use concentrate actions unless those actions also have the rage trait, with the exception of . A creature can attempt to end the spell's effect on itself by using a single action, which has the rage trait, to attempt a Will save against your spell DC; on a success, it ends the spell's effect on itself.\nIf a target is in the light of a full moon, it also grows by one size if it were Medium or smaller. This increases the reach of a Medium or Tiny creature by 5 feet.\nHeightened (6th) The temporary Hit Points increase to 10, the silver weakness to 10, and the damage dealt by the attacks to three dice.\nHeightened (10th) The temporary Hit Points increase to 20, the silver weakness to 20, and the damage dealt by the attacks to four dice.",
    classes: ['druid'],
  },
  {
    id: 'natures-pathway-pf2e',
    name: "Nature's Pathway",
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'minutes',
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
    concentration: false,
    ritual: false,
    description:
      "You step into a living tree with a trunk big enough for you to fit inside it and instantly teleport to any tree within 5 miles that also has a sufficiently large trunk. Once you enter the first tree, you instantly know the rough locations of other sufficiently large trees within range and can exit from the original tree, if you prefer. You can't carry extradimensional spaces with you; if you attempt to do so, the spell fails.\nHeightened (6th) The tree you exit can be up to 50 miles away.\nHeightened (8th) The tree you exit can be up to 500 miles away.\nHeightened (9th) The tree you exit can be anywhere on the same planet.",
    classes: ['druid'],
  },
  {
    id: 'plant-form-pf2e',
    name: 'Plant Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'primal',
    traditions: ['primal'],
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
      "Taking inspiration from verdant creatures, you transform into a Large plant battle form. When you Cast this Spell, choose a listed battle form. You can substitute a similar specific plant to turn into (such as a pitcher plant instead of a flytrap), but this has no effect on the form's Size or statistics. While in this form, you gain the plant trait. You can Dismiss the spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 19 + your level. Ignore your armor's check penalty and Speed reduction.\n• 12 temporary Hit Points.\n• Resistance 10 to poison.\n• Low-light vision.\n• One or more unarmed melee attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +17, and your damage bonus is +11. These attacks are Strength based (for the purpose of the condition, for example). If your unarmed attack modifier is higher, you can use it instead.\n• Athletics modifier of +19, unless your own modifier is higher.\nYou also gain specific abilities based on the type of plant you choose:\n• Arboreal\n• Speed 30 feet\n• Melee 1 branch (reach 15 feet), Damage 2d10 bludgeoning;\n• Melee 1 foot, Damage 2d8 bludgeoning;\n• you can speak in this form\n• Flytrap\n• Speed 15 feet; resistance 10 to acid;\n• Melee 1 leaf (reach 10 feet), Damage 2d8 piercing, and you can spend an action after a hit to Grab the target.\nHeightened (6th) Your battle form is Huge, and the reach of your attacks increases by 5 feet. You instead gain AC = 22 + your level, 24 temporary HP, attack modifier +21, damage bonus +16, and Athletics +22.",
    classes: ['druid'],
  },
  {
    id: 'sawtooth-terrain-pf2e',
    name: 'Sawtooth Terrain',
    system: 'pf2e',
    source: 'Pathfinder Adventure: Prey for Death',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'You cause long, serrated mantis limbs to appear, swiping at and obstructing creatures in the area. The area is difficult terrain. Each creature in the area when the spell is cast and who end their turn within the area take 3d6 slashing damage and (floor((@item.level -1)/2)d6) bleed] damage, as determined by its Reflex save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage and no persistent damage.\nFailure The creature takes full damage and a –10-foot circumstance penalty to their Speed until they receive magical healing or benefit from a successful Medicine check against your spell DC to .\nCritical Failure The creature takes double damage and a –15-foot circumstance penalty to their Speed until they receive magical healing or benefit from a successful Medicine check against your spell DC to administer First Aid.\nHeightened (+2) The damage increases by 3d6, and the persistent bleed damage increases by 1d6.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The damage increases by 3d6, and the persistent bleed damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'scouting-eye-pf2e',
    name: 'Scouting Eye',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 1,
    },
    range: {
      type: 'special',
      description: 'see text',
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      'You create an , floating eye, 1 inch in diameter, at a location you can see within 500 feet. It sees in all directions with your normal visual senses and continuously transmits what it sees to you.\nThe first time you Sustain the spell each round, you can either move the eye up to 30 feet, seeing only things in front of the eye, or move it up to 10 feet, seeing everything in all directions around it. There is no limit to how far from you the eye can move, but the spell ends immediately if you and the eye ever cease to be on the same plane of existence. You can attempt Seek actions through the eye if you want to attempt Perception checks with it. Any damage dealt to the eye destroys it and ends the spell.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'shadow-blast-pf2e',
    name: 'Shadow Blast',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
    traditions: ['divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'special',
      description: 'varies',
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
      'You shape the shadow substance of the Netherworld into a blast. Choose acid, bludgeoning, cold, electricity, fire, force, piercing, slashing, sonic, or spirit damage, and choose a , a within 120 feet, or a . The blast deals 6d8 damage of the type you chose to each creature in the area ((@item.rank+1)d8 acid], (@item.rank+1)d8 bludgeoning], (@item.rank+1)d8 cold], (@item.rank+1)d8 electricity], (@item.rank+1)d8 fire], (@item.rank+1)d8 force], (@item.rank+1)d8 piercing], (@item.rank+1)d8 slashing], (@item.rank+1)d8 sonic], or (@item.rank+1)d8 spirit]).\nHeightened (+1) The damage increases by 1d8.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'slither-pf2e',
    name: 'Slither',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "A mass of snakes made of shadow rise up to capture creatures in the area. Each creature in the area when you Cast the Spell takes 3d6 piercing] damage and 1d6 persistent] damage from a biting snake, and it's or depending on its Reflex save. A creature that ends its turn in the area must also attempt this save, even if it's already grabbed or restrained by the snakes. You can Dismiss the spell.\nSuccess The creature is unaffected.\nFailure The creature takes full damage and is grabbed by a snake. The snakes' DC is equal to your spell DC. A creature can attack a snake to release the creature. A snake's AC is equal to your spell DC, and it's destroyed if it takes 12 or more damage at once. New snakes continually regrow as long as the spell lasts, so destroying snakes doesn't prevent slither from capturing more creatures.\nCritical Failure As failure, but the creature takes double damage and is restrained by a snake.\nHeightened (+2) The persistent poison damage increases by 1d6 and snake HP increases by 6.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The persistent poison damage increases by 1d6 and snake HP increases by 6.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'speak-with-stones-pf2e',
    name: 'Speak with Stones',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You can ask questions of and receive answers from natural or worked stone. While stone is not intelligent, you speak with the natural spirits of the stone, which have a personality colored by the type of stone, as well as by the type of structure the stone is part of, for worked stone. A stone's perspective, perception, and knowledge give it a worldview different enough from a human's that it doesn't consider the same details important. Stones can mostly answer questions about creatures that touched them in the past and what is concealed beneath or behind them.\nHeightened (6th) The duration is 8 hours.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'spiritual-guardian-pf2e',
    name: 'Spiritual Guardian',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "A Medium guardian made of magical force appears in an unoccupied space in range. The spiritual guardian is translucent and wields a ghostly echo of one weapon you're wielding or wearing. If you have a deity, the guardian takes the form of one of your deity's attendants or servitors. If you sanctify the spell, the guardian's attacks are sanctified as well.\nCreatures can move through the guardian's space but can't end their movement in it. You and your allies can flank with the guardian. The guardian doesn't have any other attributes a creature would normally have, aside from 50 Hit Points that it can't recover by any means and that it can lose only when protecting a creature (see below).\nWhen you Cast the Spell and each time you Sustain it, you can have the guardian move to any unoccupied space within 120 feet of you and either attack or protect.\n• Attack The guardian makes a melee spell attack against an adjacent creature, dealing 3d8 damage on a hit (or double damage on a critical hit). The damage type is the same as the chosen weapon (or any of its types for a versatile weapon). The attack deals spirit damage instead if that would be more detrimental to the creature (as determined by the GM). This attack uses and contributes to your multiple attack penalty.\n• Protect The guardian protects a creature of your choice. Each time the chosen creature would take damage and the guardian is adjacent to it, the guardian takes the first 10 damage instead of the ally. This protection lasts until you command the guardian to attack or to protect a different creature, or the guardian is destroyed.\nHeightened (+2) The guardian's damage increases by 1d8, and its Hit Points increase by 20.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        "Heightened (+2) The guardian's damage increases by 1d8, and its Hit Points increase by 20.",
    },
    classes: ['cleric'],
  },
  {
    id: 'strange-geometry-pf2e',
    name: 'Strange Geometry',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'occult',
    traditions: ['occult'],
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "Area 4 cubes, each 10 feet on a side\nYou cause the areas to appear to swell, bend, and break, twisting together in a bizarre spatial geometry. The cubes of the spell's area can't be adjacent to one another. A creature must attempt a Will save if it's in one of the cubes when you Cast the Spell, or if it later enters one of the areas, with the following effects. A creature interacting with the illusion can also attempt a Will save to disbelieve the illusion, as normal.\nSuccess The creature disbelieves the illusion.\nFailure All terrain in the cubes is difficult terrain for the creature, including the air if the creature is flying, walls if it's climbing, and so on. When the creature would exit one of the cubes, it exits from one randomly determined by the GM. This is a teleportation effect. It can exit from any edge of that cube it chooses. When selecting a random cube, the GM excludes any that don't match the creature's terrain; for instance, if the creature were exiting along the ground, the GM would exclude any cube that didn't have an exit on the ground.",
    classes: ['bard'],
  },
  {
    id: 'subconscious-suggestion-pf2e',
    name: 'Subconscious Suggestion',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'special',
      description: 'varies',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You implant a subconscious suggestion deep within the target's mind for them to follow when a trigger you specify occurs. You suggest a course of action to the target. Your directive must be phrased in such a way as to seem like a logical course of action to the target, and it can't be self-destructive or obviously against the target's self-interest. The target must attempt a Will save.\nCritical Success The target is unaffected and knows you tried to control it.\nSuccess The target is unaffected and thinks you were talking to them normally, not casting a spell on them.\nFailure The suggestion remains in the target's subconscious until the next time you prepare. If the trigger occurs before then, the target immediately follows your suggestion. The effect has a duration of 1 minute, or until the target has completed a finite suggestion or the suggestion becomes self-destructive or has other obvious negative effects.\nCritical Failure As failure, but the duration is 1 hour.\nHeightened (9th) You can target up to 10 creatures.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '9': 'Heightened (9th) You can target up to 10 creatures.',
      },
      summary: 'Heightened (9th) You can target up to 10 creatures.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'summon-celestial-pf2e',
    name: 'Summon Celestial',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
    traditions: ['divine'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "You summon a creature that has the celestial trait and whose level is 5 or lower to fight for you. The GM might determine your deity restricts the specific types of celestials you can summon in certain cases. For instance, Calistria doesn't typically allow her followers to summon aeons.\nHeightened As listed in the summon trait.",
    classes: ['cleric'],
  },
  {
    id: 'summon-dragon-pf2e',
    name: 'Summon Dragon',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "You summon a creature that has the dragon trait and whose level is 5 or lower to fight for you. If the dragon has a magical tradition trait (arcane, divine, occult, or primal), you can summon it only if you're using that tradition to cast summon dragon.\nHeightened As listed in the summon trait.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'summon-entity-pf2e',
    name: 'Summon Entity',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'occult',
    traditions: ['occult'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You summon a creature that has the aberration trait and whose level is 5 or lower to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['bard'],
  },
  {
    id: 'summon-fiend-pf2e',
    name: 'Summon Fiend',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
    traditions: ['divine'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You summon a creature that has the fiend trait and whose level is 5 or lower to fight for you. The GM might determine your deity restricts the specific types of fiends you can summon in certain cases. For instance, archdevils typically allow their followers to summon devils, but not other fiends.\nHeightened As listed in the summon trait.',
    classes: ['cleric'],
  },
  {
    id: 'summon-giant-pf2e',
    name: 'Summon Giant',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'primal',
    traditions: ['primal'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You summon a creature that has the giant trait and whose level is 5 or lower to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['druid'],
  },
  {
    id: 'summon-monitor-pf2e',
    name: 'Summon Monitor',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'divine',
    traditions: ['divine'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "You summon a creature that has the monitor trait and whose level is 5 or lower to fight for you. The GM might determine your deity restricts the specific types of monitors you can summon in certain cases. For instance, Urgathoa typically doesn't allow her followers to summon psychopomps.\nHeightened As listed in the summon trait.",
    classes: ['cleric'],
  },
  {
    id: 'synesthesia-pf2e',
    name: 'Synesthesia',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'occult',
    traditions: ['occult'],
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
      type: 'special',
      description: 'varies',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "The target's senses are suddenly rewired in unexpected ways, causing them to process noises as bursts of color, smells as sounds, and so on. This has three effects, and the target must attempt a Will save.\n• Due to the distraction, the target must succeed at a Flat each time it uses a concentrate action, or the action fails and is wasted.\n• The target's difficulty processing visual input makes all creatures and objects from it.\n• The creature has trouble moving, making it Clumsy 3 and giving it a –10-foot status penalty to its Speeds.\nCritical Success The target is unaffected.\nSuccess The target is affected for 1 round.\nFailure The target is affected for 1 minute.\nCritical Failure As failure, and the target is Stunned 2 as it attempts to process the sensory shifts.\nHeightened (9th) You can target up to five creatures.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '9': 'Heightened (9th) You can target up to five creatures.',
      },
      summary: 'Heightened (9th) You can target up to five creatures.',
    },
    classes: ['bard'],
  },
  {
    id: 'telekinetic-haul-pf2e',
    name: 'Telekinetic Haul',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You move the target up to 20 feet, potentially suspending it in midair. When you Sustain the Spell, you can do so again, or you can shift your telekinetic focus to a different eligible target within range, moving it instead.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'toxic-cloud-pf2e',
    name: 'Toxic Cloud',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You conjure a poisonous fog. This functions as , except the area moves 10 feet away from you each round. You deal 6d8 poison damage to each breathing creature that starts its turn in the spell's area. You can Dismiss the spell.\nHeightened (+1) The damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'truespeech-pf2e',
    name: 'Truespeech',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      "The target can understand all words regardless of language and also speak the languages of other creatures. When in a mixed group of creatures, each time the target speaks, it can choose a creature and speak in a language that creature understands, even if the target doesn't know what language that is.\nHeightened (7th) The duration is 8 hours.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'wall-of-flesh-pf2e',
    name: 'Wall of Flesh',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 5,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You craft a 20-foot-tall wall of living flesh in a straight line up to 30 feet long. The wall is 3 feet thick, and each 5-foot-long section has AC 10 and 75 Hit Points. If you wish, the wall can be of a smaller length or height. You must create the wall in an unbroken open space so its edges don't pass through any creatures or objects, or the spell is lost. The wall can't be Repaired but can be healed by vitality, and healing spells and abilities. When you Cast the Spell, choose one of the following features for your wall.\n• Mouths The wall has countless toothy mouths along its surface. The mouths Strike any creature that ends its turn within 5 feet of the wall, using your spell attack modifier for these Strikes and dealing (1+(ceil((@item.level - 4) / 2)))d6 piercing] damage. The mouths are capable of consuming potions; since the wall is alive, it can recover Hit Points from a Healing Potion, but it can't benefit from any effect that would give it the ability to move. Otherwise, the GM determines which potions can affect the wall.\n• Eyes The wall sprouts hundreds of unblinking eyes. You can see through these eyes, gaining a +2 circumstance bonus to visual Perception checks within the wall's line of sight. You can also use the eyes for determining line of sight for ranged attacks and spells, but you don't have line of effect through the wall.\n• Arms The wall is a mass of grasping arms. Any creature that ends its turn within 5 feet of the wall must attempt a Reflex save.\n• Success The creature is unaffected.\n• Failure The creature is by the wall for 1 round or until it Escapes against your spell DC, whichever comes first.\n• Critical Failure The creature is by the wall for 1 round or until it Escapes against your spell DC, whichever comes first.\nHeightened (+2) The Hit Points of each section of the wall increase by 10, and the piercing damage dealt by the wall's mouths increases by 1d6.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'wave-of-despair-pf2e',
    name: 'Wave of Despair',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 5,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      type: 'special',
      description: '1 or more rounds',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You inflict despair on creatures in the area. The effects for each creature are determined by its Will save.\nCritical Success The creature is unaffected.\nSuccess For 1 round, the creature can't use reactions and must attempt another save at the start of its turn; on a failure, it is Slowed 1 for that turn as it sobs uncontrollably.\nFailure As success, but the duration is 1 minute.\nCritical Failure As failure, and the creature is automatically slowed 1 for 1 minute.\nHeightened (7th) The area increases to a 60-foot cone.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '7': 'Heightened (7th) The area increases to a 60-foot cone.',
      },
      summary: 'Heightened (7th) The area increases to a 60-foot cone.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
]);
