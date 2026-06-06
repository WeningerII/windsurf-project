import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level1Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'bless-pf2e',
    name: 'Bless',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'Blessings from beyond help your companions strike true. You and your allies in the area gain a +1 status bonus to attack rolls.',
    classes: ['cleric'],
  },
  {
    id: 'burning-hands-pf2e',
    name: 'Burning Hands',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      feet: 15,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 2,
        die: 'd6',
        notation: '2d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'Gouts of flame rush from your hands. You deal 2d6 fire damage to creatures in the area. Each creature must attempt a basic Reflex save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'color-spray-pf2e',
    name: 'Color Spray',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'illusion',
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
      feet: 15,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      'Brilliant colors flash from your hand in a vibrant spray. Creatures in the cone must attempt a Will save. On a failure, creatures are dazzled for 1 round. On a critical failure, creatures are stunned 1, blinded, and dazzled.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'command-pf2e',
    name: 'Command',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'enchantment',
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      "You shout a command that's hard to ignore. You can command the target to approach you, flee from you, release what it's holding, drop prone, or stand in place. The target must attempt a Will save.",
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (5th): You can target up to 10 creatures.',
      ranks: { 5: 'You can target up to 10 creatures.' },
    },
    classes: ['bard', 'cleric'],
  },
  {
    id: 'entreat-pf2e',
    name: 'Entreat',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'enchantment',
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      'You make a request of a creature. The target must attempt a Will save. On a failure, it is compelled to comply with a reasonable request.',
    classes: ['bard', 'cleric'],
  },
  {
    id: 'fear-pf2e',
    name: 'Fear',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      'You plant fear in the target; it must attempt a Will save. On a failure, the target becomes frightened 1 (or frightened 2 on a critical failure). On a critical success, the target is unaffected.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (3rd): You can target up to five creatures.',
      ranks: { 3: 'You can target up to five creatures.' },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'feather-step-pf2e',
    name: 'Feather Step',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'transmutation',
    traditions: ['primal'],
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
    description: 'The target can move through difficult terrain without penalty for 1 minute.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'floating-shroud-pf2e',
    name: 'Floating Shroud',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'abjuration',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'A shroud of mist surrounds the target, granting concealment against ranged attacks.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'grease-pf2e',
    name: 'Grease',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      type: 'minutes',
      minutes: 1,
    },
    areaOfEffect: {
      type: 'cube',
      feet: 10,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'You conjure grease, with effects based on choosing area or target. Area: All solid ground in the area is covered with grease. Each creature standing on the greasy surface must succeed at a Reflex save or fall prone.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'grim-tendrils-pf2e',
    name: 'Grim Tendrils',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'necromancy',
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
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'Tendrils of shadow strike the target. Make a spell attack. On a hit, you deal 1d6 negative damage and the target is frightened 1.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The negative damage increases by 2d4, and the persistent bleed damage increases by 1.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'gust-pf2e',
    name: 'Gust of Wind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'evocation',
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You create a powerful blast of air in a line 60 feet long and 10 feet wide. Each creature in the line must attempt a Fortitude save. On a failure, creatures are pushed 10 feet away from you.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'harmless-healing-pf2e',
    name: 'Harmless Healing',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'conjuration',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'A creature you touch regains 1d8 hit points.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'heal-pf2e',
    name: 'Heal',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'necromancy',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: false,
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
    savingThrowText: 'basic Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You channel positive energy to heal the living or damage the undead. If the target is a willing living creature, you restore 1d8 Hit Points. If the target is undead, you deal that amount of positive damage to it, and it gets a basic Fortitude save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The amount of healing or damage increases by 1d8, and the extra healing for the 2-action version increases by 8.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'illusory-disguise-pf2e',
    name: 'Illusory Disguise',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'illusion',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You make yourself look like a different humanoid. Creatures can attempt a Perception check to see through the disguise.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (2nd): The spell also disguises your voice and scent, and it gains the auditory and olfactory traits. Heightened (3rd): You can appear as any creature of the same size, even a specific individual. You must have seen an individual to take on their appearance. The spell also disguises your voice and scent, and it gains the auditory trait.',
      ranks: {
        2: 'The spell also disguises your voice and scent, and it gains the auditory and olfactory traits.',
        3: 'You can appear as any creature of the same size, even a specific individual. You must have seen an individual to take on their appearance. The spell also disguises your voice and scent, and it gains the auditory trait.',
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'jump-pf2e',
    name: 'Jump',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'transmutation',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'touch',
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
      "You enhance the target's ability to leap. The target can jump 5 feet vertically and 10 feet horizontally, or 10 feet vertically and 20 feet horizontally if it Strides at least 10 feet first.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (3rd): The range becomes touch, the target changes to one touched creature, and the duration becomes 1 minute, allowing the target to Long Jump and High Jump as part of moving normally during this period.',
      ranks: {
        3: 'The range becomes touch, the target changes to one touched creature, and the duration becomes 1 minute, allowing the target to Long Jump and High Jump as part of moving normally during this period.',
      },
    },
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'jumping-jack-pf2e',
    name: 'Jumping Jack',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'The target can jump twice as far as normal.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'lock-pf2e',
    name: 'Lock',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'abjuration',
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
      material: true,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      "The target lock becomes harder to pick. The DC to Pick the Lock increases by 5. If you have the lock's key, you can unlock it normally.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (2nd): The duration increases to unlimited, but you must expend 6 gp worth of gold dust as an additional cost.',
      ranks: {
        2: 'The duration increases to unlimited, but you must expend 6 gp worth of gold dust as an additional cost.',
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'magic-missile-pf2e',
    name: 'Magic Missile',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'evocation',
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
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4+1',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'You send a dart of force streaking toward a creature that you can see. It automatically hits and deals 1d4+1 force damage. For each additional action you use when Casting the Spell, increase the number of missiles you shoot by one, to a maximum of three missiles for 3 actions.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): You shoot one additional missile with each action you spend.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'magic-weapon-pf2e',
    name: 'Magic Weapon',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      'The weapon glimmers with magical power. The target becomes a +1 striking weapon, gaining a +1 item bonus to attack rolls and increasing the number of weapon damage dice to two.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'mindlink-pf2e',
    name: 'Mindlink',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'divination',
    traditions: ['arcane', 'occult'],
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
      "You link your mind to the target's mind. You can communicate telepathically with the target as long as you both remain within 500 feet of each other.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'negate-aroma-pf2e',
    name: 'Negate Aroma',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'abjuration',
    traditions: ['primal'],
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
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You eliminate all scent from the target creature or object. This prevents creatures from tracking the target by scent and negates any special senses that rely on smell.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (5th): The range increases to 30 feet, and you can target up to 10 creatures.',
      ranks: {
        5: 'The range increases to 30 feet, and you can target up to 10 creatures.',
      },
    },
    classes: ['druid', 'ranger'],
  },
  {
    id: 'pest-form-pf2e',
    name: 'Pest Form',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You transform into a Tiny animal pest form. You can choose the specific pest form each time you cast the spell. You gain low-light vision and a +4 status bonus to Stealth checks.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (4th): You can turn into a flying creature, such as a bird, which grants you a fly Speed of 20 feet.',
      ranks: {
        4: 'You can turn into a flying creature, such as a bird, which grants you a fly Speed of 20 feet.',
      },
    },
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'ray-of-enfeeblement-pf2e',
    name: 'Ray of Enfeeblement',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'necromancy',
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "A ray with the power to sap a foe's strength flashes from your hand. Attempt a ranged spell attack against the target. On a hit, the target becomes enfeebled 2 for 1 minute. On a critical hit, the target is enfeebled 3 for 1 minute.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'sanctuary-pf2e',
    name: 'Sanctuary',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      'You ward a creature with protective energy that deters enemy attacks. Creatures attempting to attack the target must attempt a Will save each time. On a failure, they must choose a different target or the attack fails.',
    classes: ['cleric'],
  },
  {
    id: 'shocking-grasp-pf2e',
    name: 'Shocking Grasp',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 2,
        die: 'd12',
        notation: '2d12',
      },
      type: 'electricity',
    },
    concentration: false,
    ritual: false,
    description:
      'You shroud your hands in a crackling field of lightning. Make a melee spell attack roll. On a hit, you deal 2d12 electricity damage. If the target is wearing metal armor or is made of metal, you gain a +1 circumstance bonus to your attack roll.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The damage increases by 1d12, and the persistent electricity damage increases by 1.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'soothe-pf2e',
    name: 'Soothe',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'enchantment',
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
    concentration: false,
    ritual: false,
    description:
      'You grace the target with soothing energy. The target regains 1d10+4 Hit Points. You also attempt to counteract the frightened condition.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The amount of healing increases by 1d10+4.',
    },
    classes: ['bard', 'cleric'],
  },
  {
    id: 'summon-animal-pf2e',
    name: 'Summon Animal',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'conjuration',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You conjure an animal to fight for you. You summon a common creature that has the animal trait and whose level is -1. It acts on your turn.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (2nd): Level 1. Heightened (3rd): Level 2. Heightened (4th): Level 3. Heightened (5th): Level 5. Heightened (6th): Level 7. Heightened (7th): Level 9. Heightened (8th): Level 11. Heightened (9th): Level 13. Heightened (10th): Level 15.',
      ranks: {
        2: 'Level 1.',
        3: 'Level 2.',
        4: 'Level 3.',
        5: 'Level 5.',
        6: 'Level 7.',
        7: 'Level 9.',
        8: 'Level 11.',
        9: 'Level 13.',
        10: 'Level 15.',
      },
    },
    classes: ['druid', 'ranger'],
  },
  {
    id: 'true-strike-pf2e',
    name: 'True Strike',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'divination',
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
    concentration: false,
    ritual: false,
    description:
      'A glimpse into the future ensures your next blow strikes true. The next time you make an attack roll before the end of your turn, roll the attack twice and use the better result. The attack ignores circumstance penalties to the attack roll and any flat check required due to the target being concealed or hidden.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'ventriloquism-pf2e',
    name: 'Ventriloquism',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'illusion',
    traditions: ['arcane', 'occult'],
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'Whenever you speak or make a sound, you can make it appear to originate from somewhere else within range. This can allow you to make it seem like someone else is speaking.',
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (2nd): The spell's duration increases to 1 hour, and you can also change the tone, quality, and other aspects of your voice. Before a creature can attempt to disbelieve your illusion, it must actively attempt a Perception check or otherwise use actions to interact with the sound.",
      ranks: {
        2: "The spell's duration increases to 1 hour, and you can also change the tone, quality, and other aspects of your voice. Before a creature can attempt to disbelieve your illusion, it must actively attempt a Perception check or otherwise use actions to interact with the sound.",
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'harm-pf2e',
    name: 'Harm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'necromancy',
    traditions: ['divine'],
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You channel negative energy to damage the living or heal the undead. A living target takes 1d8 negative damage (basic Fortitude save); an undead target regains 1d8 Hit Points. Using more actions increases the range and adds an area.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The amount of healing or damage increases by 1d8, and the extra healing for the 2-action version increases by 8.',
    },
    classes: ['cleric'],
  },
  {
    id: 'bane-pf2e',
    name: 'Bane',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'enchantment',
    traditions: ['divine'],
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will negates',
    concentration: true,
    ritual: false,
    description:
      'Malign energy fills a 5-foot emanation around you. Enemies in the area take a -1 status penalty to attack rolls unless they succeed at a Will save. Each round you can Sustain the spell to increase the emanation by 5 feet.',
    classes: ['cleric'],
  },
  {
    id: 'sleep-pf2e',
    name: 'Sleep',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      'Each creature in a 5-foot burst becomes drowsy and falls unconscious if it takes no damage, with effects ranging from a -1 penalty to falling asleep based on its Will save.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'The creatures fall unconscious for 1 minute on a failure (longer on a critical failure), and the burst no longer wakes them when they take damage.',
      },
      summary:
        'Heightened (4th): Targets fall unconscious for 1 minute and damage no longer wakes them.',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'charm-pf2e',
    name: 'Charm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
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
      type: 'hours',
      hours: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will negates',
    concentration: false,
    ritual: false,
    description:
      'You make one creature regard you as a trusted friend. It takes a penalty to its Will save if you are currently friendly, and the spell ends if you or your allies act hostile toward it.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'You can target up to 10 creatures.',
        '6': 'The duration increases to 1 day.',
      },
      summary: 'Heightened (4th): up to 10 targets. (6th): duration 1 day.',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
]);
