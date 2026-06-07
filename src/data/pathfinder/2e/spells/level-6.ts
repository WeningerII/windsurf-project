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
  {
    id: 'dominate-pf2e',
    name: 'Dominate',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'enchantment',
    traditions: ['arcane', 'divine', 'occult'],
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
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You take command of a creature, controlling its actions; the effect’s duration depends on its Will save outcome.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'flesh-to-stone-pf2e',
    name: 'Flesh to Stone',
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
      'You begin turning a creature to stone; it becomes slowed and increasingly petrified unless it recovers, turning permanently to stone on repeated failures.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'vampiric-exsanguination-pf2e',
    name: 'Vampiric Exsanguination',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 6,
    school: 'necromancy',
    traditions: ['arcane', 'divine'],
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
      attribute: 'fort',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You drain vitality from creatures in a 30-foot cone, dealing 12d6 negative damage and healing yourself for a portion of the total dealt.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The damage increases by 2d6 and the healing increases accordingly.',
    },
    classes: ['sorcerer', 'wizard', 'cleric'],
  },
  {
    id: 'blanket-of-stars-pf2e',
    name: 'Blanket of Stars',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 6,
    school: 'occult',
    traditions: ['occult', 'primal'],
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
      "A flowing cloak of utter darkness drapes over you, filled with pinpricks of light like distant stars. It imparts the stillness of the cosmos to you, granting you a +2 status bonus to Stealth checks to and .\nWhile outside under a starry night sky, you're also as long as you remain still. When moving under a starry night sky, you're instead.\nGazing too closely into the stars is disorienting. Any creature that ends its turn adjacent to you must attempt a Will save; this is a mental, visual effect.\nSuccess The creature is unaffected.\nFailure The creature is until the end of its next turn.\nCritical Failure The creature is and dazzled until the end of its next turn.",
    classes: ['bard', 'druid'],
  },
  {
    id: 'blessed-boundary-pf2e',
    name: 'Blessed Boundary',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'divine',
    traditions: ['divine'],
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
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "Manifestations of divine force appear in the hundreds, swirling in a massive, protective sphere. These typically look like spiky fragments, but often take on an appearance themed to the deity of the caster. The sphere is hollow, with the manifestations forming a shell 2 inches deep on the outer edge. You can choose to make the burst smaller, in 5-foot increments, when you cast it. The shell provides cover and can intersect solid terrain without affecting it. The shell deals 7d8 force damage to each creature who intersects with the shell when the sphere's created, or who attempts to move through the shell. The creature also takes the damage at the end of its turn, but only if it didn't already take damage from the shell that turn. The effects are determined by a creature's Reflex save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage, is pushed up to 10 feet in the direction of your choice, and ends its movement.\nCritical Failure The creature takes double damage, is pushed up to 20 feet in the direction of your choice, and ends its movement.\nHeightened (+1) The damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d8.',
    },
    classes: ['cleric'],
  },
  {
    id: 'blinding-fury-pf2e',
    name: 'Blinding Fury',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 6,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      "Trigger A creature damages you.\nYou curse the target with your outrage at being attacked. The effect is determined by the target's Will save.\nCritical Success The target is unaffected.\nSuccess The target can't Observe you until the end of its turn, and if you're currently observed by it, you become to it.\nFailure As success, and for 1 minute, every time the target damages you, it can't observe you until the end of its turn.\nCritical Failure As success, and for an unlimited duration, the first time each round the target damages a creature, it can't observe that creature until the end of its turn. If it damages several creatures at once, the creature it can't perceive is chosen randomly among those creatures.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'bounty-of-the-sky-pf2e',
    name: 'Bounty of the Sky',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 6,
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
    concentration: false,
    ritual: false,
    description:
      "You call forth a flock of geese that drop restorative fruits and breads from the sky as they fly overhead. You or an ally in the area can Interact to collect one of these gifts, and can then either consume it as part of the same action or do so with a separate Interact action later in the spell's duration. Enemies who attempt to pick up one of these gifts find that it turns to ash in their hands. Each time a character consumes one of these gifts, they can select one of the following benefits.\n• The character regains 4d6 Hit Points.\n• The character reduces the stage of one poison or disease they suffer from by one stage. This can't reduce the stage below 1 or cure the affliction.\n• The character reduces the value of their , , , or condition by 2, or reduces two of the listed conditions by 1 each.\nHeightened (+2) The amount of Hit Points a character regains from consuming a gift increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The amount of Hit Points a character regains from consuming a gift increases by 2d6.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'collective-transposition-pf2e',
    name: 'Collective Transposition',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 6,
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
      'You teleport the targets to new positions within the area. The creatures must each be able to fit in their new space, and their positions must be unoccupied, entirely within the area, and in your line of sight. Unwilling creatures can attempt a Will save.\nCritical Success The target can teleport if it wants, but it chooses the destination within range.\nSuccess The target is unaffected.\nFailure You teleport the target and choose its destination.\nHeightened (+1) The number of targets increases by 1.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'crimson-breath-pf2e',
    name: 'Crimson Breath',
    system: 'pf2e',
    source: 'Pathfinder Adventure: Prey for Death',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You turn a creature toward you and exhale a blast of crimson mist from your mouth, exposing the target to a toxic miasma. The effects are determined by the creature's Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target takes 8d6 poison damage.\nFailure The target is afflicted with breath of the mantis god poison at stage 1.\nCritical Failure The target is afflicted with breath of the mantis god poison at stage 2.\nBreath of the Mantis God\nSaving Throw Fortitude\nMaximum Duration 6 minutes\nStage 1 3d6 persistent bleed and Drained 1 (1 minute)\nStage 2 3d8 persistent bleed and drained 1 (1 minute)\nStage 3 3d10 persistent bleed and Drained 2 (1 minute)",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'cursed-metamorphosis-pf2e',
    name: 'Cursed Metamorphosis',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You transform the target creature into a harmless animal appropriate to the area, with effects based on its Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target's body gains minor features of the harmless animal. Its insides churn as they partially transform, causing it to be Sickened 1. When it recovers from the sickened condition, its features revert to normal.\nFailure The target transforms for 1 minute but keeps its mind. If it spends all its actions on its turn concentrating on its original form, it can attempt a Will save to end the effect immediately.\nCritical Failure The target is transformed into the chosen harmless animal, body and mind, for an unlimited duration.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'dragon-form-pf2e',
    name: 'Dragon Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
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
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "Calling upon powerful magic, you gain a Large dragon battle form. When you Cast this Spell, choose one type of common dragon or another type to which your GM allows access. While in this form, you gain the dragon trait. You have hands in this battle form and can take manipulate actions. You can Dismiss the spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 18 + your level. Ignore your armor's check penalty and Speed reduction.\n• 10 temporary Hit Points.\n• Speed 40 feet, fly Speed 100 feet.\n• Resistance 10 against the damage type of your Dragon Breath (see below).\n• Darkvision and imprecise scent 60 feet.\n• One or more unarmed melee attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +22, and your damage bonus is +6. These attacks are Strength based (for the purpose of the condition, for example). If your unarmed attack modifier is higher, you can use it instead. See below for more on these attacks.\n• Athletics modifier of +23, unless your own modifier is higher.\n• Breath Weapon 2 (varies) The shape, damage, and damage type of your breath weapon depend on your specific dragon form (see below). A creature in the area attempts a basic save against your spell DC. This is a Reflex save unless stated otherwise in the special ability description for your specific dragon form. Once activated, your breath weapon can't be used again for [[/r 1d4 #rounds]]{1d4 rounds}. Your breath weapon has the trait corresponding to the type of damage it deals.\nYou also gain specific abilities based on the type of dragon:\n• Adamantine\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 bludgeoning;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Conspirator\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 poison;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Diabolic\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 fire;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Empyreal\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 spirit;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Fortune\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 force;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Horned\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 poison;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Mirage\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 mental;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Omen\n• Melee 1 jaws, Damage 2d12 piercing plus 2d6 mental;\n• Melee 1 claw (agile), Damage 3d10 slashing;\n• Melee 1 tail (reach 10 feet), Damage 3d10 bludgeoning;\n• breath weapon 30-foot cone, (ternary(gte(@item.rank|options:area-damage]\n• Tradition Resistance If the dragon's magical tradition matches that of your dragon form spell, you gain the listed ability. Arcane resistance 5 against damage from spells; divine resistance 10 to spirit, vitality, and void; occult resistance 10 to mental; primal resistance 5 to physical damage.\nHeightened (8th) Your battle form is Huge, you gain a +20-foot status bonus to your fly Speed, and your attacks have 10-foot reach (or 15-foot reach if they previously had 10-foot reach). You instead gain AC = 21 + your level, 15 temporary HP, an attack modifier of +28, a damage bonus of +12, and Athletics +28. Your Dragon Breath deals an additional 4d6 damage.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'field-of-life-pf2e',
    name: 'Field of Life',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'A field of life energy fills the area, exuding warmth and rejuvenating those within. Each living creature that starts its turn in the area regains 1d8 Hit Points, and any undead creature that starts its turn in the area takes 1d8 vitality damage.\nHeightened (8th) The healing and damage increase to 1d10.\nHeightened (9th) The healing and damage increase to 1d12.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '8': 'Heightened (8th) The healing and damage increase to 1d10. Heightened (9th) The healing and damage increase to 1d12.',
        '9': 'Heightened (8th) The healing and damage increase to 1d10. Heightened (9th) The healing and damage increase to 1d12.',
      },
      summary:
        'Heightened (8th) The healing and damage increase to 1d10. Heightened (9th) The healing and damage increase to 1d12.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'missed-cue-pf2e',
    name: 'Missed Cue',
    system: 'pf2e',
    source: 'Pathfinder #205: Singer, Stalker, Skinsaw Man',
    level: 6,
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
      "You make the spell's target believe they had something incredibly important to say but forgot to say it, and now they've missed their opportunity. Sensations of overwhelming panic akin to stage fright flood the target's mind, causing them to suffer excruciating mental anguish and take 12d6 mental damage. The target might even become filled with the conviction that they've doomed themselves by missing their cue. The target must attempt a Will save.\nCritical Success The conviction of a missed cue is only a fleeting notion that passes quickly without any effect on the target.\nSuccess The target takes half damage and is Frightened 1.\nFailure The target takes full damage and becomes Frightened 2. In addition, the target is Slowed 1 for as long as they remain frightened.\nCritical Failure The target takes double damage and becomes Frightened 3. In addition, the target is slowed 1 for as long as they remain frightened.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'never-mind-pf2e',
    name: 'Never Mind',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
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
      "You drastically reduce the target's mental faculties. The target must attempt a Will save. The effects of this curse can be removed only through effects that target curses.\nCritical Success The target is unaffected.\nSuccess The target is Stupefied 2 for 1 round.\nFailure The target is Stupefied 4 with an unlimited duration.\nCritical Failure The target's intellect is permanently reduced below that of an animal, and it treats its Charisma, Intelligence, and Wisdom modifiers as –5. It loses all class abilities that require mental faculties, including all spellcasting. If the target is a PC, they become an NPC under the GM's control.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'petrify-pf2e',
    name: 'Petrify',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
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
      type: 'special',
      description: 'varies',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "The target's body slowly turns into a stone statue. The target must attempt a Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target is Slowed 1 for 1 round as stone begins to form on their body.\nFailure The target is slowed 1 and must attempt a Fortitude save at the end of each of its turns; this ongoing save has the incapacitation trait. On a failed save, the slowed condition increases by 1 (or 2 on a critical failure) as stone growths creep across their body. A successful save reduces the slowed condition by 1. When a creature becomes fully unable to act due to the slowed condition from petrify, the spell then ends in a flash of gray light, leaving the target permanently as they become a statue. The spell also ends if the slowed condition is removed, which causes the stone to break off harmlessly.\nCritical Failure As failure, but the target is initially Slowed 2.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'phantasmal-calamity-pf2e',
    name: 'Phantasmal Calamity',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      attribute: 'wis',
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: false,
    ritual: false,
    description:
      "A vision of apocalyptic destruction fills the mind of each creature in the area. The vision deals 11d6 mental damage (basic Will save). On a critical failure, the creature must also succeed at a Reflex save or believe it's trapped (stuck in a fissure, adrift at sea, or some other fate in keeping with its vision). If it fails the second save, it's also for 1 minute. It can attempt a new Will save at the end of each of its turns, and on a success, it disbelieves the illusion and recovers from the Stunned condition.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'raise-dead-pf2e',
    name: 'Raise Dead',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'divine',
    traditions: ['divine'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You attempt to call forth the dead creature's soul, requiring the creature's body to be present and relatively intact. The creature must have died within the past 3 days. If Pharasma has decided that the creature's time has come (at the GM's discretion), or if the creature doesn't wish to return to life, this spell automatically fails, but the cost isn't consumed in the casting.\nIf the spell is successful, the creature returns to life with 1 Hit Point, no spells prepared or spell slots available, no points in any pools or any other daily resources, and still with any long-term debilitations of the old body. The time spent in the Boneyard leaves the target temporarily debilitated, making it Clumsy 2, Drained 2, and Enfeebled 2 for 1 week; these conditions can't be removed or reduced by any means until the week has passed. The creature is also permanently changed by its time in the afterlife, such as a slight personality shift, a streak of white in the hair, or a strange new birthmark.\nHeightened (7th) The maximum level of the target increases to 15. The cost increases to the target's level (minimum 1) × 400 gp.\nHeightened (8th) The maximum level of the target increases to 17. The cost increases to the target's level (minimum 1) × 800 gp.\nHeightened (9th) The maximum level of the target increases to 19. The cost increases to the target's level (minimum 1) × 1,600 gp.\nHeightened (10th) The maximum level of the target increases to 21. The cost increases to the target's level (minimum 1) × 3,200 gp.",
    classes: ['cleric'],
  },
  {
    id: 'repulsion-pf2e',
    name: 'Repulsion',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'special',
      description: 'emanation up to 40-feet',
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
      "You manifest an aura that prevents creatures from approaching you. When casting the spell, you can make the area any radius you choose, up to 40 feet. A creature must attempt a Will save if it's within the area when you Cast the Spell or as soon as it enters the area while the spell is in effect. Once a creature has attempted the save, it uses the same result for that casting of repulsion. Any restrictions on a creature's movement apply only if it voluntarily moves toward you. For example, if you move closer to a creature, it doesn't then need to move away.\nCritical Success The creature's movement is not restricted.\nSuccess The creature treats each square in the area as difficult terrain when moving closer to you.\nFailure The creature can't move closer to you within the area.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'sacred-form-pf2e',
    name: 'Sacred Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 6,
    school: 'divine',
    traditions: ['divine'],
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
      "You focus all your divine energy and transform yourself into a battle form, similar to your normal form and of the same size as you, but wielding powerful divine armaments. While in this form, you gain the statistics and abilities listed below. You have hands in this battle form and can use manipulate actions. You can Dismiss the spell. You gain the following statistics and abilities.\n• AC = 20 + your level. Ignore your armor's check penalty and Speed reduction.\n• 10 temporary Hit Points.\n• Speed 40 feet.\n• Resistance 3 against physical damage.\n• Darkvision.\n• A special attack with a sacred armament, which is the only attack you can use. Your attack modifier with the sacred armament is +21, and your damage bonus is +8 (or +6 for a ranged attack). The damage dice for Strikes with the weapon are 3d6 bludgeoning damage plus 1d6 spirit damage. If you have a deity, you can have the weapon take the form of your deity's favored weapon and use its damage die size, damage type, and traits. If the favored weapon is a simple weapon with 1d4 or 1d6 damage die, the weapon damage dice are one size larger than normal, though the spirit damage is unchanged. You can also use your attack modifier with this favored weapon if it's higher than that given by the spell.\n• Athletics modifier of +23, unless your own is higher.\nHeightened (8th) You instead gain AC = 21 + your level, 15 temporary Hit Points, resistance 4 against physical damage, attack modifier +28, damage bonus +15 (+12 for a ranged attack), and Athletics +29. If you're Medium or smaller, your battle form is Large, and your attacks also have 10-foot reach, or 15-foot reach if you're using a favored weapon with reach.",
    classes: ['cleric'],
  },
  {
    id: 'scintillating-safeguard-pf2e',
    name: 'Scintillating Safeguard',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 6,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
    castingTime: {
      type: 'reaction',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Trigger An effect would deal physical or energy damage to you or a creature in range.\nA sparkling magical barrier envelops each target, shielding them against the triggering effect. Choose one type of physical or energy damage the triggering effect deals. Each target gains resistance 10 against that damage type for the triggering effect. The resistance applies only against the initial damage, not against any persistent damage or other lingering effects.\nHeightened (+1) The resistance increases by 1.',
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'scrying-pf2e',
    name: 'Scrying',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
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
      type: 'concentration',
      maxDuration: 'sustained, 10 minutes',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "You magically spy on a creature of your choice. Scrying works like , except that the image you receive is less precise, insufficient for teleport and similar spells. Instead of creating an eye in a set location within 500 feet, you instead create an eye that manifests just above the target. You can choose a target either by name or by touching one of its possessions or a piece of its body. If you haven't met the target in person, scrying's DC is 2 lower, and if you are unaware of the target's identity (perhaps because you found an unknown creature's fang at a crime scene), the DC is instead 10 lower.\nThe effect of scrying depends on the target's Will save.\nCritical Success The spell fails and the target is temporarily immune for 1 week. The target also gains a glimpse of you and learns its rough distance and direction from you.\nSuccess The spell fails and the target is temporarily immune for 1 day.\nFailure The spell succeeds.\nCritical Failure The spell succeeds, and the eye follows the target if it moves, traveling up to 60 feet per round.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'seize-identity-pf2e',
    name: 'Seize Identity',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 6,
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
      "With a gleeful cackle, you seize an individual's voice and swallow it. For the duration, you look and sound like the target, and the target can't speak. The effects depend on the result of the target's Will saving throw.\nCritical Success The creature is unaffected.\nSuccess You take on the target's appearance, with the same effects of a 3rd-rank spell, and the target can't speak, with the same effects of a 2nd-rank spell.\nFailure As success, but the target also takes 4d6 mental damage from the transformation.\nCritical Failure As success, but the target also takes 8d6 mental damage from the transformation.\nThe first time each round you Sustain this spell after you cast this spell, the target ages rapidly, taking (ternary(gte(@item.rank] damage (Will save). On a failure, the target also becomes Enfeebled 1 or increases the value of its enfeebled condition by 1.\nHeightened (9th) The mental damage increases by 4d6, and the void damage increases by 1d8.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '9': 'Heightened (9th) The mental damage increases by 4d6, and the void damage increases by 1d8.',
      },
      summary:
        'Heightened (9th) The mental damage increases by 4d6, and the void damage increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'spellwrack-pf2e',
    name: 'Spellwrack',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      'You cause any spells cast on the target to spill out their energy in harmful surges. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess Whenever the target becomes affected by a spell with a duration, the target takes 2d12 persistent] damage. Each time it takes persistent force damage from spellwrack, it reduces the remaining duration of spells affecting it by 1 round. Only a successful Arcana check against your spell DC can help the target recover from the persistent damage; the curse and the persistent damage end after 1 minute.\nFailure As success, but the curse and persistent damage do not end on their own.\nCritical Failure As failure, but the persistent force damage is 4d12 persistent].',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'spirit-blast-pf2e',
    name: 'Spirit Blast',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You concentrate ethereal energy and attack a creature's spirit, dealing 16d6 spirit damage with a basic Fortitude save.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'tanglecurse-pf2e',
    name: 'Tanglecurse',
    system: 'pf2e',
    source: 'Pathfinder #211: The Secret of Deathstalk Tower',
    level: 6,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      'Tanglebriar has been called a "curse on the land," which has inspired Treerazer\'s cult to develop this notorious spell. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess A fungal bloom springs up from the ground in a around the target. This area is difficult terrain for creatures that enter the area. The target treats all terrain as difficult terrain since this swath of fungus moves with them as they do, transforming into a tangle of spores and floating tendrils if the target flies or a thick swath of stringy floating algae if the target swims. This effect ends after 1 minute or as soon as the curse is lifted, whichever comes first.\nFailure As success, but the fungal bloom increases to 10 feet. It persists until the curse is lifted. In addition, the target is also affected by the spores exuded by the fungal bloom—roll [[/r 1d4]] and consult the results below to see how the spores affect them. This affect reactivates automatically every 24 hours, replacing the previous result.\n1: The spores cause atrophy; the target is Enfeebled 1.\n2: The spores cause fibrous fungal growths to sprout from the target; the target is Clumsy 1.\n3: The spores settle in the target\'s blood and flesh and cause great pain; the target is Drained 1.\n4: The spores intrude upon the mind and cause hallucinations; the target is Stupefied 1.\nCritical Failure As failure, but the emanation increases to 15 feet, and the condition value caused by the spores increases to 2.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'tangling-creepers-pf2e',
    name: 'Tangling Creepers',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'minutes',
      minutes: 10,
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'Dense, twitching creepers sprout from every surface and fill any bodies of water in the area. Any creature moving on the land, or Climbing or Swimming within the creepers, takes a -10-foot circumstance penalty to its Speeds while in the area. Once per round, you can Sustain the spell to make a vine lash out from any square within the expanse of creepers. This vine has a 15-foot reach. Make a melee spell attack roll against the target; on a success, the vine pulls the target into the creepers and makes it for 1 round or until the creature Escapes (against your spell DC), whichever comes first.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'tree-of-seasons-pf2e',
    name: 'Tree of Seasons',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'primal',
    traditions: ['primal'],
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
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "You cause a Small tree to instantly sprout in an unoccupied space on the ground. Four seedpods grow from the tree, each filled with the magic of a different one of the four seasons. A creature can Interact to pluck one of the pods, and can then either throw it up to 30 feet as part of the same action or do so with a separate Interact action later. When thrown, a pod explodes in a , dealing 6d6 damage with a basic Reflex save against your spell DC. The damage type depends on the season of the pod: electricity for spring, fire for summer, poison for autumn, or cold for winter. When the spell ends, the tree withers away and any remaining pods rot, leaving behind non-magical seeds.\n(@item.level)d6 cold]\n(@item.level)d6 electricity]\n(@item.level)d6 fire]\n(@item.level)d6 poison]\nHeightened (+1) The burst's damage increases by 1d6.",
    classes: ['druid'],
  },
  {
    id: 'truesight-pf2e',
    name: 'Truesight',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You see things within 60 feet as they actually are. The GM rolls a secret counteract check against any illusion, morph or polymorph effect in the area, but only for the purpose of determining whether you see through it (for instance, if the check succeeds against a polymorph spell, you can see the creature's true form, but you don't end the polymorph spell).",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'utter-destruction-pf2e',
    name: 'Utter Destruction',
    system: 'pf2e',
    source: "Pathfinder #209: Destroyer's Doom",
    level: 6,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You screech with an unearthly voice made of destructive energy, smashing everything that lies before you. Creatures in the area take 4d8 sonic damage and 4d8 void damage. Each creature must attempt a Fortitude save. Unattended objects of Hardness 5 or less in the area of effect are destroyed.\nCritical Success The creature takes half damage.\nSuccess The creature takes half damage and is for 1 round.\nFailure The creature takes full damage and is deafened for 1 minute.\nCritical Failure The creature takes double damage and is permanently deafened.\nHeightened (+1) The sonic and void damage each increase by 1d8. The Hardness threshold of items destroyed by the spell increases by 1.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The sonic and void damage each increase by 1d8. The Hardness threshold of items destroyed by the spell increases by 1.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'vibrant-pattern-pf2e',
    name: 'Vibrant Pattern',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
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
      verbal: false,
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
      "You create a pattern of lights that pulses with intensity. Creatures are while inside the pattern. In addition, a creature must attempt a Will saving throw if it's inside the pattern when you cast it, enters the pattern, ends its turn within the pattern, or uses a Seek or Interact action on the pattern. A creature currently by the pattern doesn't need to attempt new saving throws.\nSuccess The creature is unaffected.\nFailure The creature is Blinded by the pattern. If it exits the pattern, it can attempt a new save to recover from the Blinded condition at the end of each of its turns, to a maximum duration of 1 minute.\nCritical Failure The creature is Blinded for 1 minute.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'zealous-conviction-pf2e',
    name: 'Zealous Conviction',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 6,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      "You bypass your targets' rational minds, instilling them with unshakable conviction and zeal. The targets each gain 12 temporary Hit Points and a +2 status bonus to Will saves against mental effects, as their faith overrides the signals from their own bodies and minds. If you tell a target to do something, it must comply with your request, though if it would normally find the task repugnant, it can attempt a Will save at the end of its turn each round due to the cognitive dissonance. On a success, it ends the spell's effects on itself entirely.\nHeightened (9th) The temporary Hit Points increase to 18, and the status bonus to Will saves increases to +3.",
    classes: ['cleric', 'bard'],
  },
]);
