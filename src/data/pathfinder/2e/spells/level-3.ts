import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level3Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'bind-undead-pf2e',
    name: 'Bind Undead',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      'You attempt to take control of an undead creature. The target must attempt a Will save. On a failure, it becomes controlled by you for 1 minute.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'blindness-pf2e',
    name: 'Blindness',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
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
      type: 'varies',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You blind the target. The target must attempt a Fortitude save. On a critical success, the target is unaffected. On a success, the target is blinded until the end of its next turn. On a failure, the target is blinded for 1 minute. On a critical failure, the target is blinded permanently.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'earthbind-pf2e',
    name: 'Earthbind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      "You pull the target toward the ground. The target must attempt a Fortitude save. On a failure, flying creatures fall and all creatures can't Fly, levitate, or otherwise leave the ground.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'fireball-pf2e',
    name: 'Fireball',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
        count: 6,
        die: 'd6',
        notation: '6d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A roaring blast of fire appears at a spot you designate, dealing 6d6 fire damage. Each creature in the area must attempt a basic Reflex save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'ghostly-weapon-pf2e',
    name: 'Ghostly Weapon',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
    concentration: false,
    ritual: false,
    description:
      'The target weapon becomes translucent and ghostly. It can affect incorporeal creatures as if it had the ghost touch property rune.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'haste-pf2e',
    name: 'Haste',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'Magic empowers the target to act faster. It gains the quickened condition and can use the extra action only to Stride or Strike.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): You can target up to 6 creatures.',
      ranks: { 7: 'You can target up to 6 creatures.' },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'heroism-pf2e',
    name: 'Heroism',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You tap into the target's inner heroism, granting it a +1 status bonus to attack rolls, Perception checks, saving throws, and skill checks.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (6th): The status bonus increases to +2. Heightened (9th): The status bonus increases to +3.',
      ranks: {
        6: 'The status bonus increases to +2.',
        9: 'The status bonus increases to +3.',
      },
    },
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'hypnotic-pattern-pf2e',
    name: 'Hypnotic Pattern',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
      verbal: false,
      somatic: true,
      material: true,
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
    concentration: true,
    ritual: false,
    description:
      'You create a pattern of shifting colors in the air. Creatures in the area must attempt a Will save. On a failure, they become fascinated and can take no actions.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'lightning-bolt-pf2e',
    name: 'Lightning Bolt',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
    areaOfEffect: {
      type: 'line',
      length: 120,
      width: 5,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 4,
        die: 'd12',
        notation: '4d12',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'A bolt of lightning strikes outward from your hand, dealing 4d12 electricity damage. Each creature in the area must attempt a basic Reflex save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d12.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'paralyze-pf2e',
    name: 'Paralyze',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
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
      "You block the target's motor impulses. The target must attempt a Will save. On a failure, the target is paralyzed for the duration.",
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): You can target up to 10 creatures.',
      ranks: {
        7: 'You can target up to 10 creatures.',
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'slow-pf2e',
    name: 'Slow',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      'You dilate the flow of time around the target, making it slowed 1. The target must attempt a Will save. On a critical failure, the target is slowed 2.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (6th): You can target up to 10 creatures.',
      ranks: { 6: 'You can target up to 10 creatures.' },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'stinking-cloud-pf2e',
    name: 'Stinking Cloud',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
      type: 'minutes',
      minutes: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You create a cloud of putrid mist. Each creature in the cloud when you cast the spell, or that enters the cloud, must attempt a Fortitude save. On a failure, the creature becomes sickened 1 (sickened 2 on a critical failure).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'vampiric-touch-pf2e',
    name: 'Vampiric Touch',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
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
      type: 'instant',
    },
    damage: {
      base: {
        count: 6,
        die: 'd6',
        notation: '6d6',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'Your touch leeches the lifeblood out of a target to empower yourself. You deal 6d6 negative damage to the touched creature and you gain temporary Hit Points equal to half the damage the target takes (after applying resistances, weaknesses, and the like).',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-wind-pf2e',
    name: 'Wall of Wind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      "You create a wall of gusting wind. The wall is 60 feet long, 20 feet high, and 5 feet thick. Ranged attacks can't pass through the wall, and creatures trying to move through must attempt a Fortitude save or be pushed back.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'mind-reading-pf2e',
    name: 'Mind Reading',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'divination',
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
      'You read the surface thoughts of a creature, learning its general state of mind and possibly a deeper read on a failed save.',
    classes: ['bard'],
  },
  {
    id: 'crisis-of-faith-pf2e',
    name: 'Crisis of Faith',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
    traditions: ['divine'],
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
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: false,
    ritual: false,
    description:
      'You assault a creature with doubt, dealing 6d6 mental damage (or 6d8 to a divine caster), with a chance to stupefy it.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6 (or 2d8 vs divine casters).',
    },
    classes: ['cleric'],
  },
  {
    id: 'wall-of-thorns-pf2e',
    name: 'Wall of Thorns',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You grow a thicket of thorny brush that is difficult terrain and deals piercing damage to creatures passing through it.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The Hit Points and damage of the wall increase.',
    },
    classes: ['druid'],
  },
]);
