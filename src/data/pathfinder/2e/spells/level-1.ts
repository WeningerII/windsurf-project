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
  {
    id: 'mage-armor-pf2e',
    name: 'Mage Armor',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'abjuration',
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
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'You ward yourself with shimmering magical energy, gaining a +1 item bonus to AC and a maximum Dexterity modifier of +5.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': '+1 AC and +1 to saving throws.',
        '6': '+2 AC and +1 to saves.',
        '8': '+2 AC and +2 to saves.',
        '10': '+3 AC and +3 to saves.',
      },
      summary: 'Heightened: increases the AC bonus and adds a bonus to saving throws.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'create-water-pf2e',
    name: 'Create Water',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'conjuration',
    traditions: ['arcane', 'divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 0,
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
      'You conjure 2 gallons of fresh water in your cupped hands or an adjacent container.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'protection-pf2e',
    name: 'Protection',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'abjuration',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You ward a creature against a chosen alignment, granting a +1 status bonus to AC and saves against creatures and effects of that alignment.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'fleet-step-pf2e',
    name: 'Fleet Step',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'transmutation',
    traditions: ['primal'],
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
    concentration: false,
    ritual: false,
    description:
      'You move with extraordinary speed, gaining a +30-foot status bonus to your Speed.',
    classes: ['druid', 'sorcerer'],
  },
  {
    id: 'item-facade-pf2e',
    name: 'Item Facade',
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
      feet: 30,
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
      'You make an object look decrepit or pristine, masking its true appearance with a visual illusion.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '2': 'The duration is unlimited.',
        '3': 'You can disguise a 10-foot-cube object.',
      },
      summary: 'Heightened: longer duration and larger objects.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'illusory-object-pf2e',
    name: 'Illusory Object',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'illusion',
    traditions: ['arcane', 'occult'],
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You create an immobile visual illusion of an object no larger than a 20-foot cube within range.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '2': 'The illusion includes sound, scent, and texture, and lasts 1 hour.',
        '5': 'The illusion is permanent.',
      },
      summary: 'Heightened: adds sensory detail and longer duration.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'floating-disk-pf2e',
    name: 'Floating Disk',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 1,
    school: 'evocation',
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
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'A disk of magical force follows you at a fixed distance, carrying up to 5 Bulk of your goods.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: '500-toads-pf2e',
    name: '500 Toads',
    system: 'pf2e',
    source: 'Pathfinder NPC Core',
    level: 1,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You conjure hundreds of magical toads to fill the area and hop around. The vast quantity of hopping toads provides enough weight and height for the creatures to trigger any potential trap in the area that could be triggered by the weight, movement, or position of a Medium creature. The area is difficult terrain, and the magic reconstructs any toads destroyed by traps to keep the area full of toads for the duration of the spell.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'acidic-burst-pf2e',
    name: 'Acidic Burst',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      'You create a shell of acid around yourself that immediately bursts outward, dealing 2d6 acid damage to each creature in the area with a basic Reflex save.\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'agitate-pf2e',
    name: 'Agitate',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      "You send the target's mind and body into overdrive, forcing it to become restless and hyperactive. During the duration, the target must Stride, Fly, or Swim at least once each turn or take 2d8 mental damage at the end of its turn. The GM might decide to add additional move actions to the list for creatures that possess only a more unusual form of movement. The duration of this effect depends on the target's Will save.\nCritical Success The spell has no effect.\nSuccess The duration is 1 round.\nFailure The duration is 2 rounds.\nCritical Failure The duration is 4 rounds.\nHeightened (+1) The damage increases by 2d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d8.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'air-bubble-pf2e',
    name: 'Air Bubble',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Trigger A creature within range enters an environment where it can't breathe.\nA bubble of pure air appears around the target's head, allowing it to breathe normally. The effect ends as soon as the target returns to an environment where it can breathe normally.",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'alarm-pf2e',
    name: 'Alarm',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      "You ward an area to alert you when creatures enter without your permission. When you cast alarm, select a password. Whenever a Small or larger corporeal creature enters the spell's area without speaking the password, alarm sends your choice of a mental alert (in which case the spell gains the mental trait) or an audible alarm with the sound and volume of a hand bell (in which case the spell gains the auditory trait). Either option automatically awakens you, and the bell allows each creature in the area to attempt a Perception check to wake up. A creature aware of the alarm must succeed at a Stealth check against the spell's DC or trigger the spell when moving into the area.\nHeightened (3rd) You can specify a trigger for which types of creatures sound the alarm spell.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'ant-haul-pf2e',
    name: 'Ant Haul',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You reinforce the target's musculoskeletal system to bear more weight. The target can carry 3 more Bulk than normal before becoming and up to a maximum of 6 more Bulk.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'anticipate-peril-pf2e',
    name: 'Anticipate Peril',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You grant the target brief foresight. The target gains a +1 status bonus to its next initiative roll, after which the spell ends.\nHeightened (+2) The status bonus increases by 1, to a maximum of +4 at 7th rank.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'befuddle-pf2e',
    name: 'Befuddle',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You sow seeds of confusion in your target's mind, causing its actions and thoughts to become clumsy.\nCritical Success The target is unaffected.\nSuccess The target is Clumsy 1 and Stupefied 1.\nFailure The target is Clumsy 2 and Stupefied 2.\nCritical Failure The target is Clumsy 3, Stupefied 3, and .",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'benediction-pf2e',
    name: 'Benediction',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      "Divine protection helps protect your companions. You and your allies gain a +1 status bonus to AC while within the emanation. Once per round on subsequent turns, you can Sustain the spell to increase the emanation's radius by 10 feet.\nBenediction can counteract malediction.",
    classes: ['cleric'],
  },
  {
    id: 'beseech-the-sphinx-pf2e',
    name: 'Beseech the Sphinx',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 1,
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
    concentration: false,
    ritual: false,
    description:
      'You look to the great Sphinx constellation, wisest of all cosmic guides and favored of Phimater, asking them to lend their insight to the target. Choose one skill and one type of saving throw (Fortitude, Reflex, or Will). The target gains a +1 status bonus to those skill checks and saving throws for the duration.\nHeightened (4th) The status bonus increases to +2.\nHeightened (7th) The status bonus increases to +3.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'breathe-fire-pf2e',
    name: 'Breathe Fire',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      'A gout of flame sprays from your mouth. You deal 2d6 fire damage to creatures in the area with a basic Reflex save.\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'camel-spit-pf2e',
    name: 'Camel Spit',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 1,
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'You alter your stomach, esophagus, and tongue to be able to spit partially digested food with force. You can spit at a foe once you finish Casting the Spell and can repeat the attack once on each of your subsequent turns by taking a single action, which has the acid, attack, and concentrate traits. After your third spit attack, the spell ends. When you attack with camel spit, make a ranged spell attack roll against a creature within 15 feet, dealing 1d6 acid damage and causing the target to be for 1 round if you hit. On a critical hit, you deal double damage and the target takes @item.level persistent] damage.\nHeightened (+1) The damage increases by 1d6, and the persistent damage on a critical hit is increased by 1.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage increases by 1d6, and the persistent damage on a critical hit is increased by 1.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'carryall-pf2e',
    name: 'Carryall',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'A small platform of magical force materializes adjacent to you to carry cargo. It is or has a ghostly appearance, is 2 feet in diameter, and follows 5 feet behind you, floating just above the ground. It holds up to 5 Bulk of objects (if they can fit on it). Any objects atop the platform fall to the ground when the spell ends. You can Sustain the spell to move the platform up to 30 feet along the ground, to make it stay in place, or to have it return to you and resume following you. The spell ends if a creature tries to ride atop the platform, if the platform is overloaded, if anyone tries to lift or force the platform higher above the ground, or if you move more than 60 feet away from the platform.\nHeightened (4th) The platform can carry 10 Bulk, creatures can ride atop it, and it can hover in the air, not just on the ground',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'chilling-spray-pf2e',
    name: 'Chilling Spray',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'A cone of icy shards bursts from your spread hands and coats the targets in a layer of frost. You deal 2d4 cold damage to creatures in the area; they must each attempt a Reflex save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and takes a –5-foot status penalty to its Speeds for 2 rounds.\nCritical Failure The creature takes double damage and takes a –10-foot status penalty to its Speeds for 2 rounds.\nHeightened (+1) The damage increases by 2d4.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'cleanse-cuisine-pf2e',
    name: 'Cleanse Cuisine',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You transform all food and beverages in the area into delicious fare, changing water into wine or another fine beverage, or enhancing the food's taste and ingredients to make it a gourmet treat. You can also choose to remove all toxins and contaminations from the food. This spell doesn't prevent future contamination, natural decay, or spoilage, nor does it make the food any more nutritious.\nHeightened (+2) Add another cubic foot to the area, which must be contiguous with the rest.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'concordant-choir-pf2e',
    name: 'Concordant Choir',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You unleash a dangerous consonance of reverberating sound, focusing on a single target or spreading out to damage many foes. The number of actions you spend Casting this Spell determines its targets, range, area, and other parameters.\n1 The spell deals 1d4 sonic damage to a single enemy, with a basic Fortitude save.\n2 (manipulate) The spell deals 2d4 sonic damage to all creatures in a , with a basic Fortitude save.\n3 (manipulate) The spell deals 2d4 sonic damage to all creatures in a , with a basic Fortitude save.\nHeightened (+1) The damage increases by 1d4 for the 1-action version, or 2d4 for the other versions.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage increases by 1d4 for the 1-action version, or 2d4 for the other versions.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'detect-poison-pf2e',
    name: 'Detect Poison',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
    concentration: false,
    ritual: false,
    description:
      'You detect whether a creature is venomous or poisonous, or if an object is poison or has been poisoned. You do not ascertain whether the target is poisonous in multiple ways, nor do you learn the type or types of poison. Certain substances, like lead and alcohol, are poisons and so mask other poisons.\nHeightened (2nd) You learn the number and types of poison.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'disguise-magic-pf2e',
    name: 'Disguise Magic',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You alter how an item's or spell's magical aura appears to effects like detect magic. You can hide the auras entirely, have an item register as a common item of lower level, or make a spell register as a common spell of the same or lower rank. You can Dismiss the spell. A caster using or of a higher rank than disguise magic can attempt to disbelieve the illusion using the skill matching the tradition of the spell (Arcana for arcane, Religion for divine, Occultism for occult, or Nature for primal). Further attempts by the same caster get the same result as the initial check to disbelieve.\nHeightened (2nd) You can Cast this Spell on a creature, disguising all items and spell effects on it.",
    heightening: {
      mode: 'fixed',
      ranks: {},
      summary:
        'Heightened (2nd) You can Cast this Spell on a creature, disguising all items and spell effects on it.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'dizzying-colors-pf2e',
    name: 'Dizzying Colors',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      description: '1 or more rounds (see below)',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You unleash a swirling multitude of colors that overwhelms creatures based on their Will saves.\nCritical Success The creature is unaffected.\nSuccess The creature is for 1 round.\nFailure The creature is Stunned 1, for 1 round, and dazzled for 1 minute.\nCritical Failure The creature is stunned for 1 round and blinded for 1 minute.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'd-j-vu-pf2e',
    name: 'Déjà Vu',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 100,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 2,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You loop a thought process in the target's mind, forcing it to repeat a moment's worth of actions. The target must attempt a Will save. If the target fails, whatever actions the target uses on its next turn, it must repeat on its following turn. The actions must be repeated in the same order and as close to the same specifics as possible. For example, if the target makes an attack, it must repeat the attack against the same creature, if possible, and if the target moves, it must move the same distance and direction, if possible, on its next turn.\nIf the target can't repeat an action, such as Casting a Spell that has been exhausted or needing to target a creature that has died, it can act as it chooses for that action but becomes Stupefied 1 until the end of its turn.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'endure-pf2e',
    name: 'Endure',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You invigorate the touched creature's mind and urge it to press on. You grant the touched creature 5 temporary Hit Points that last for 1 minute.\nHeightened (+1) The temporary Hit Points increase by 5.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The temporary Hit Points increase by 5.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'enfeeble-pf2e',
    name: 'Enfeeble',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      "You sap the target's strength, depending on its Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target is Enfeebled 1 until the start of your next turn.\nFailure The target is Enfeebled 2 for 1 minute.\nCritical Failure The target is Enfeebled 3 for 1 minute.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'foraging-friends-pf2e',
    name: 'Foraging Friends',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 1,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      "Giving a cheerful whistle, you call forth a handful of small animals, such as birds or mice, to collect food for you and your allies. The animals return 1 hour later with enough foraged goods to feed four Medium creatures for 1 day, then return to their normal behavior. If you're in a particularly strange environment, as determined by your GM, you might need a minimum proficiency with primal spell DCs, equivalent to the minimum proficiency required to Subsist in strange environments.\nHeightened (3rd) The animals bring back enough food for eight Medium creatures for 1 day.\nHeightened (5th) The animals bring back enough food for 30 Medium creatures for 1 day.",
    classes: ['druid'],
  },
  {
    id: 'force-barrage-pf2e',
    name: 'Force Barrage',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
    concentration: false,
    ritual: false,
    description:
      'You fire a shard of solidified magic toward a creature that you can see. It automatically hits and deals 1d4+1 force damage. For each additional action you use when Casting the Spell, increase the number of shards you shoot by one, to a maximum of three shards for 3 actions. You choose the target for each shard individually. If you shoot more than one shard at the same target, combine the damage before applying bonuses or penalties to damage, resistances, weaknesses, and so forth.\nHeightened (+2) You fire one additional shard with each action you spend.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'gentle-landing-pf2e',
    name: 'Gentle Landing',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Trigger a creature within range is falling\nYou raise a magical updraft to arrest a fall. The target's fall slows to 60 feet per round, and the portion of the fall during the spell's duration doesn't count when calculating falling damage. If the target reaches the ground while the spell is in effect, it takes no damage from the fall. The spell ends as soon as the target lands.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'goblin-pox-pf2e',
    name: 'Goblin Pox',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      "Your touch afflicts the target with goblin pox, an irritating allergenic rash. The target must attempt a Fortitude save.\nGoblin Pox (disease) Level 1; Creatures that have the goblin trait and goblin dogs are immune\nStage 1 Sickened 1 (1 round)\nStage 2 Sickened 1 and Slowed 1 (1 round)\nStage 3 Sickened 1 and the creature can't reduce its Sickened value below 1 (1 day)\nCritical Success The target is unaffected.\nSuccess The target is Sickened 1.\nFailure The target is afflicted with goblin pox at stage 1.\nCritical Failure The target is afflicted with goblin pox at stage 2.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'hippocampus-retreat-pf2e',
    name: 'Hippocampus Retreat',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "Requirements You're mostly or totally submerged in water.\nYou temporarily shape your lower limbs into the tail of a hippocampus in order to swim away from a nearby foe after dealing a parting blow. Attempt a melee spell attack roll against the target's AC, dealing 2d6 bludgeoning damage on a hit (or double damage on a critical hit). Then, Swim up to 30 feet; if you already have a swim Speed, you can Swim up to your Speed with a +10-foot circumstance bonus. You gain a +2 circumstance bonus to your AC against reactions triggered by this movement. At the end of the movement, your lower limbs return to normal.\nHeightened (+1) The damage increases by 1d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'hydraulic-push-pf2e',
    name: 'Hydraulic Push',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'You call forth a powerful blast of pressurized water that bludgeons the target and knocks it back. Make a ranged spell attack roll.\nCritical Success The target takes 6d6 bludgeoning damage and is knocked back 10 feet.\nSuccess The target takes 3d6 bludgeoning damage and is knocked back 5 feet.\nHeightened (+1) The bludgeoning damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The bludgeoning damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'ill-omen-pf2e',
    name: 'Ill Omen',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'The target is struck with misfortune, which throws it off balance. The target must attempt a Will save.\nSuccess The target is unaffected.\nFailure The first time during the duration that the target attempts an attack roll or skill check, it must roll twice and use the worse result.\nCritical Failure Every time during the duration that the target attempts an attack roll or skill check, it must roll twice and use the worse result.',
    classes: ['bard'],
  },
  {
    id: 'imprint-message-pf2e',
    name: 'Imprint Message',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'occult',
    traditions: ['occult'],
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
    description:
      "You project psychic vibrations onto the target object, imprinting it with a short message or emotional theme of your design. This imprinted sensation is revealed to a creature who casts on the target object, replacing any emotional events the item was present for. If the object is in the area of a spell, the imprinted messages appear as major events in the timeline, but they don't interfere with any other visions.\nIf the object is targeted with of a higher spell rank than imprint message, the caster learns that the object has been magically modified. When you Cast this Spell, any prior vibrations placed on an object by previous castings of imprint message fade.",
    classes: ['bard'],
  },
  {
    id: 'infuse-vitality-pf2e',
    name: 'Infuse Vitality',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'divine',
    traditions: ['divine'],
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
      "You empower attacks with vital energy. The number of targets is equal to the number of actions you spent casting this spell. Each target's unarmed and weapon Strikes deal an extra 1d4 vitality damage. (This damage typically damages only undead). If you have the holy trait, you can add that trait to this spell and to the Strikes affected by the spell.\nHeightened (3rd) The damage increases to 2d4 damage.\nHeightened (5th) The damage increases to 3d4 damage.",
    heightening: {
      mode: 'fixed',
      ranks: {},
      summary:
        'Heightened (3rd) The damage increases to 2d4 damage. Heightened (5th) The damage increases to 3d4 damage.',
    },
    classes: ['cleric'],
  },
  {
    id: 'invisible-item-pf2e',
    name: 'Invisible Item',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You make the object . This makes it to all creatures, though the creatures can attempt to find the target, making it to them instead if they succeed. If the item is used as part of a hostile action, the spell ends after that hostile action is completed. Making a weapon invisible typically doesn't give any advantage to the attack, except that an invisible thrown weapon or piece of ammunition can be used for an attack without necessarily giving information about the attacker's hiding place unless the weapon returns to the attacker.\nHeightened (3rd) The duration is until the next time you make your daily preparations.\nHeightened (7th) The duration is unlimited.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'leaden-steps-pf2e',
    name: 'Leaden Steps',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: true,
    ritual: false,
    description:
      "You partially transform a foe's feet into unwieldy slabs of metal, slowing their steps. The target attempts a Fortitude saving throw.\nCritical Success The target is unaffected.\nSuccess The target is and has weakness 2 to electricity until the end of your next turn. The spell can't be sustained.\nFailure The target is encumbered and has weakness 2 to electricity.\nCritical Failure The target is encumbered and has weakness 3 to electricity.\nHeightened (+1) The weakness increases by 1.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'liberating-command-pf2e',
    name: 'Liberating Command',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
    school: 'occult',
    traditions: ['occult'],
    castingTime: {
      type: 'action',
      amount: 1,
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
    concentration: false,
    ritual: false,
    description:
      'You call out a liberating cry, urging an ally to break free of an effect that holds them in place. If the target is , , or , it can immediately use a reaction to attempt to .',
    classes: ['bard'],
  },
  {
    id: 'malediction-pf2e',
    name: 'Malediction',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You incite distress in the minds of your enemies, making it more difficult for them to defend themselves. Enemies in the area must succeed at a Will save or take a –1 status penalty to AC as long as they're in the area.\nOnce per round on subsequent turns, you can Sustain the spell to increase the emanation's radius by 10 feet and force enemies in the area that weren't yet affected to attempt a saving throw.\nMalediction can counteract benediction.",
    classes: ['cleric'],
  },
  {
    id: 'mending-pf2e',
    name: 'Mending',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You repair the target item. You restore 5 Hit Points per spell rank to the target, potentially removing the condition if this repairs it past the item's Broken Threshold. You can't replace lost pieces or repair an object that's been completely destroyed.\nHeightened (2nd) You can target a non-magical object of 1 Bulk or less.\nHeightened (3rd) You can target a non-magical object of 2 Bulk or less, or a magical object of 1 Bulk or less.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '2': 'Heightened (2nd) You can target a non-magical object of 1 Bulk or less. Heightened (3rd) You can target a non-magical object of 2 Bulk or less, or a magical object of 1 Bulk or less.',
        '3': 'Heightened (2nd) You can target a non-magical object of 1 Bulk or less. Heightened (3rd) You can target a non-magical object of 2 Bulk or less, or a magical object of 1 Bulk or less.',
      },
      summary:
        'Heightened (2nd) You can target a non-magical object of 1 Bulk or less. Heightened (3rd) You can target a non-magical object of 2 Bulk or less, or a magical object of 1 Bulk or less.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'message-rune-pf2e',
    name: 'Message Rune',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 5,
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
      description: '1 day',
    },
    concentration: false,
    ritual: false,
    description:
      "You record a message up to 5 minutes long and inscribe a special rune on any flat unattended surface or small object within reach. The nature of the rune's appearance is up to you, but it's visible to everyone, and it must be no smaller than 2 inches in diameter. You also specify a trigger that creatures must meet to activate the rune.\nFor the duration of the spell, creatures that meet the criteria of the trigger can touch the rune to hear the recorded message in their head as though you were speaking to them telepathically. You know when someone is listening to the message, but you don't know who's listening to it. You can Dismiss the spell.\nHeightened (+2) The duration increases for every 2 ranks, becoming 1 week, 1 month, 1 year, or unlimited respectively.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'mud-pit-pf2e',
    name: 'Mud Pit',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
    concentration: false,
    ritual: false,
    description:
      'Thick, clinging mud covers the ground, 1 foot deep. The mud is difficult terrain.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'mystic-armor-pf2e',
    name: 'Mystic Armor',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      'You ward yourself with shimmering magical energy, gaining a +1 item bonus to AC and a maximum Dexterity modifier of +5. While wearing mystic armor, you use your unarmored proficiency to calculate your AC.\nHeightened (4th) You gain a +1 item bonus to saving throws.\nHeightened (6th) The item bonus to AC increases to +2, and you gain a +1 item bonus to saving throws.\nHeightened (8th) The item bonus to AC increases to +2, and you gain a +2 item bonus to saving throws.\nHeightened (10th) The item bonus to AC increases to +3, and you gain a +3 item bonus to saving throws.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'noxious-vapors-pf2e',
    name: 'Noxious Vapors',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You emit a cloud of toxic smoke that temporarily obscures you from sight. Each creature except you in the area when you Cast the Spell takes 1d6 poison damage (basic Fortitude save). A creature that critically fails the saving throw also becomes Sickened 1. All creatures in the area become , and all creatures outside the smoke become concealed to creatures within it. This smoke can be dispersed by a strong wind.\nHeightened (+1) The damage increases by 1d6',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d6',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'object-reading-pf2e',
    name: 'Object Reading',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'occult',
    traditions: ['occult'],
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
    description:
      "You place a hand on an object to learn a piece of information about an emotional event that occurred involving the object within the past week, determined by the GM. If you cast object reading on the same item multiple times, you can either concentrate on a single event to gain additional pieces of information about that event, or you can gain a piece of information about another emotional event in the applicable time frame.\nHeightened (2nd) You can learn about an event that occurred within the last month.\nHeightened (4th) You can learn about an event that occurred within the last year.\nHeightened (6th) You can learn about an event that occurred within the last decade.\nHeightened (8th) You can learn about an event that occurred within the last century.\nHeightened (9th) You can learn about an event that occurred within the entirety of the object's history.",
    classes: ['bard'],
  },
  {
    id: 'penumbral-shroud-pf2e',
    name: 'Penumbral Shroud',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      minutes: 10,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'You envelop the target in a shroud of shadow. The target perceives light as one step lower than it actually is (bright light becomes dim light, for example), affecting their ability to sense creatures and objects accordingly.\nThe shroud also provides the target a +1 status bonus to saving throws against light effects. This effect is helpful to creatures sensitive to light, and a creature can willingly choose to be subject to the failure effect of the spell.\nCritical Success The target is unaffected.\nSuccess The effect lasts for 1 round.\nFailure The effect lasts its normal duration.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'pet-cache-pf2e',
    name: 'Pet Cache',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'You open your cloak or create a gap with your hands, drawing the target into a pocket dimension just large enough for its basic comfort. No other creature can enter this extradimensional space, and the target can bring along objects only if they were designed to be worn by a creature of its kind. The space has enough air, food, and water to sustain the target for the duration.\nYou can the spell. The spell also ends if you die or enter an extradimensional space. When the spell ends, the target reappears in the nearest unoccupied space (outside of any extradimensional space you may have entered).',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'phantasmal-minion-pf2e',
    name: 'Phantasmal Minion',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      type: 'concentration',
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      "You summon a . The minion is roughly the shape of a humanoid. You can choose to have it be or have an ephemeral appearance, but it's obviously a magical effect, not a real creature.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'phantom-pain-pf2e',
    name: 'Phantom Pain',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      'Illusory pain wracks the target, dealing 2d4 mental damage and (@item.level)d4 persistent] damage. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target takes full initial damage but no persistent damage, and the spell ends immediately.\nFailure The target takes full initial and persistent damage, and the target is Sickened 1. If the target recovers from being Sickened, the persistent damage ends and the spell ends.\nCritical Failure As failure, but the target is Sickened 2.\nHeightened (+1) The damage increases by 2d4 and the persistent damage by 1d4.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d4 and the persistent damage by 1d4.',
    },
    classes: ['bard'],
  },
  {
    id: 'pocket-library-pf2e',
    name: 'Pocket Library',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      'Like Vil Seral, you collect information from all around you and store it in book form in an extradimensional library. When you Cast this Spell, choose any skill in which you are at least trained that has the Recall Knowledge action.\nDuring the duration of this spell, you can call forth a tome from the extradimensional library when attempting a Recall Knowledge check using your chosen skill. This is part of the action to Recall Knowledge. You must have a hand free to do so. The tome appears in your hand, open to an appropriate page. This grants you a +1 status bonus to the Recall Knowledge check. If you roll a critical failure on this check, you get a failure instead. If the roll is successful and the subject is a creature, you gain additional information or context about the creature. Once you reference a book from your pocket library, the spell ends.\nHeightened (3rd) The status bonus increases to +2 and you can reference your pocket library twice before the spell ends.\nHeightened (6th) The status bonus increases to +3 and you can reference your pocket library three times before the spell ends.\nHeightened (9th) The status bonus increases to +4 and you can reference your pocket library four times before the spell ends.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'protector-tree-pf2e',
    name: 'Protector Tree',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      "A Medium tree suddenly grows in an unoccupied square within range. The tree has AC 10 and 10 Hit Points. Whenever an ally adjacent to the tree is hit by a Strike, the tree interposes its branches and takes the damage first. Any additional damage beyond what it takes to reduce the tree to 0 Hit Points is dealt to the original target. The tree isn't large enough to impede movement through its square. If the tree is in soil and survives to the end of the spell's duration, it remains as an ordinary, non-magical tree and continues to grow and thrive. The GM might determine that the tree disappears immediately in certain inhospitable situations.\nHeightened (+1) The tree has an additional 10 Hit Points.",
    classes: ['druid'],
  },
  {
    id: 'pummeling-rubble-pf2e',
    name: 'Pummeling Rubble',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'A spray of heavy rocks flies through the air in front of you. The rubble deals 2d4 bludgeoning damage to each creature in the area. Each creature must attempt a Reflex save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is pushed 5 feet away from you.\nCritical Failure The creature takes double damage and is pushed 10 feet away from you.\nHeightened (+1) Increase the damage by 2d4.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) Increase the damage by 2d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'rainbows-end-pf2e',
    name: "Rainbow's End",
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal', 'occult'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: true,
    ritual: false,
    description:
      "You reach upward to wrest down a rainbow and harness its power to connect this world to the heavens. Each creature in the area takes 1d4 spirit damage with a basic Fortitude save. Any creature that fails this save is additionally for 1 round. For the spell's duration, an ally who's adjacent to you can Interact and be instantly teleported to an unoccupied space in the spell's area, as long as they don't travel more than 60 feet. This effect has the teleportation trait.\nHeightened (+2) The damage increases by 2d4, the duration of the dazzled condition on a failed save increases by 1 round, and the maximum distance an ally can use the rainbow to teleport increases by 10 feet.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The damage increases by 2d4, the duration of the dazzled condition on a failed save increases by 1 round, and the maximum distance an ally can use the rainbow to teleport increases by 10 feet.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'druid', 'bard'],
  },
  {
    id: 'reed-whistle-pf2e',
    name: 'Reed Whistle',
    system: 'pf2e',
    source: 'Pathfinder #203: Shepherd of Decay',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      "You enchant a blade of grass that you can easily hold in your mouth without inhibiting your speech or other actions. As a reaction, you can reduce the spell's remaining duration by 1 hour to Point Out a creature you detect as you sharply whistle through the reed. You and your allies also gain a +2 circumstance bonus to Perception checks to the creature for [[/r 1d4 #rounds]]{1d4 rounds}.\nHeightened (3rd) The spell's duration becomes 4 hours.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'runic-body-pf2e',
    name: 'Runic Body',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      "Glowing runes appear on the target's body. All its unarmed attacks become +1 striking unarmed attacks, gaining a +1 item bonus to attack rolls and increasing the number of damage dice to two.\nHeightened (6th) The unarmed attacks are +2 greater striking.\nHeightened (9th) The unarmed attacks are +3 major striking.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'runic-weapon-pf2e',
    name: 'Runic Weapon',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      'The weapon glimmers with magic as temporary runes carve down its length. The target becomes a +1 striking weapon, gaining a +1 item bonus to attack rolls and increasing the number of weapon damage dice to two.\nHeightened (6th) The weapon is +2 greater striking.\nHeightened (9th) The weapon is +3 major striking.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'sacred-beasts-pf2e',
    name: 'Sacred Beasts',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 1,
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
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "Requirements You worship a deity.\nYou call out to the creatures of the wild favored by your deity. You quickly summon your deity's sacred animal (or a small swarm of them if the animal is usually Tiny). For example, you would call forth a lion if you worship Iomedae or a swarm of spiders if you worship Norgorber. If your deity doesn't have a known sacred animal, work with the GM to find a thematic one. The animal or swarm assaults all creatures in the area, dealing 2d6 damage. The damage is either bludgeoning, piercing, or slashing based on the animal that was conjured, as determined by the GM. After their attacks, the animals return to your deity's plane.\nHeightened (+1) The damage increases by 2d6.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'schadenfreude-pf2e',
    name: 'Schadenfreude',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      somatic: false,
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
      "Trigger You critically fail a saving throw against a foe's effect.\nYou distract your enemy with their feeling of smug pleasure when you fail catastrophically. They must attempt a Will save.\nCritical Success The creature is unaffected.\nSuccess The creature is distracted by its amusement and takes a -1 status penalty on Perception checks and Will saves for 1 round. \nFailure The creature is overcome by its amusement and is Stupefied 1 for 1 round.\nCritical Failure The creature is lost in its amusement and is Stupefied 2 for 1 round and Stunned 1.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'share-lore-pf2e',
    name: 'Share Lore',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You share your knowledge with the touched creatures. Choose one Lore skill in which you're trained. The targets become trained in that Lore skill for the duration of the spell.\nHeightened (3rd) The duration of the spell is 1 hour, and you can target up to five creatures.\nHeightened (5th) The duration of the spell is 8 hours, you can target up to five creatures, and you can share up to two Lore skills in which you're trained.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '3': "Heightened (3rd) The duration of the spell is 1 hour, and you can target up to five creatures. Heightened (5th) The duration of the spell is 8 hours, you can target up to five creatures, and you can share up to two Lore skills in which you're trained.",
      },
      summary:
        "Heightened (3rd) The duration of the spell is 1 hour, and you can target up to five creatures. Heightened (5th) The duration of the spell is 8 hours, you can target up to five creatures, and you can share up to two Lore skills in which you're trained.",
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'shattering-gem-pf2e',
    name: 'Shattering Gem',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      'A large gem floats around the target in an erratic pattern. The gem has 5 Hit Points. Each time a creature Strikes the target, the target attempts a Flat. On a success, the gem blocks the attack, so the attack first damages the gem and then applies any remaining damage to the target. If the gem is reduced to 0 Hit Points, it shatters, immediately dealing 1d8 slashing damage (basic Reflex save) to the creature that destroyed it, as long as that creature is within 10 feet of the target.\nHeightened (+1) The gem has 5 additional Hit Points, and the damage dealt by its detonation increases by 1d8.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The gem has 5 additional Hit Points, and the damage dealt by its detonation increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'shockwave-pf2e',
    name: 'Shockwave',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'You create a wave of energy that ripples through the earth. Terrestrial creatures in the affected area must attempt a Reflex save to avoid stumbling as the shockwave shakes the ground.\nCritical Success The creature is unaffected.\nSuccess The creature is until the start of its next turn.\nFailure The creature falls .\nCritical Failure As failure, plus the creature takes 1d6 bludgeoning damage.\nHeightened (+1) The area increases by 5 feet (to a 20-foot cone at 2nd rank, and so on).',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The area increases by 5 feet (to a 20-foot cone at 2nd rank, and so on).',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'spider-sting-pf2e',
    name: 'Spider Sting',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      "You magically duplicate a spider's venomous sting. You deal 1d4 piercing damage to the touched creature and afflict it with spider venom. The target must attempt a Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target takes 1d4 poison] damage.\nFailure The target is afflicted with spider venom at stage 1.\nCritical Failure The target is afflicted with spider venom at stage 2.\nSpider Venom (poison)\nLevel 1\nMaximum Duration 4 rounds\nStage 1 1d4 poison damage and Enfeebled 1 (1 round)\nStage 2 1d4 poison damage and Enfeebled 2 (1 round)",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'spirit-link-pf2e',
    name: 'Spirit Link',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
    concentration: false,
    ritual: false,
    description:
      "You form a spiritual link with another creature, taking in its pain. When you Cast this Spell and at the start of each of your turns, if the target is below maximum Hit Points, it regains 2 Hit Points (or the difference between its current and maximum Hit Points, if that's lower). You lose as many Hit Points as the target regained.\nThis is a spiritual transfer, so no effects apply that would increase the Hit Points the target regains or decrease the Hit Points you lose. This transfer also ignores any temporary Hit Points you or the target have. Since this effect doesn't involve vitality or void energy, spirit link works even if you or the target is undead. While the duration persists, you gain no benefit from regeneration or fast healing. You can Dismiss this spell, and if you're ever at 0 Hit Points, spirit link ends automatically.\nHeightened (+1) The number of Hit Points transferred each time increases by 2.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The number of Hit Points transferred each time increases by 2.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'summon-construct-pf2e',
    name: 'Summon Construct',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You summon a creature that has the construct trait and whose level is –1 to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'summon-fey-pf2e',
    name: 'Summon Fey',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'occult',
    traditions: ['occult', 'primal'],
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
      'You summon a creature that has the fey trait and whose level is –1 to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['bard', 'druid'],
  },
  {
    id: 'summon-lesser-servitor-pf2e',
    name: 'Summon Lesser Servitor',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      "While deities jealously guard their most powerful servants from the summoning spells of those who aren't steeped in the faith, this spell allows you to conjure an inhabitant of the Outer Sphere with or without the deity's permission. You summon a common celestial, fiend, or monitor of level –1. You can choose to instead summon a common animal of level –1 that hails from the Outer Sphere; you can choose for this animal to gain the celestial and holy traits, the fiend and unholy traits, or the monitor trait. It's anathema to summon a servitor if it has a holy or unholy trait that isn't allowed for your deity's sanctification. For example, Sarenrae's sanctification is \"can choose holy,\" so you couldn't summon an unholy creature, and Pharasma's is \"none,\" so you couldn't summon a holy or unholy creature. The GM might determine that your deity restricts specific types of creatures further, making it anathema to summon them as well.\nHeightened (2nd) The creature can be level 1 or lower.\nHeightened (3rd) The creature can be level 2 or lower.\nHeightened (4th) The creature can be level 3 or lower.",
    classes: ['cleric'],
  },
  {
    id: 'summon-plant-or-fungus-pf2e',
    name: 'Summon Plant or Fungus',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      'You summon a creature that has the plant or fungus trait and whose level is -1 to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['druid'],
  },
  {
    id: 'summon-undead-pf2e',
    name: 'Summon Undead',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      'You summon a creature that has the undead trait and whose level is -1 to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'sure-strike-pf2e',
    name: 'Sure Strike',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 1,
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
      type: 'special',
      description: 'until the end of your turn',
    },
    concentration: false,
    ritual: false,
    description:
      'The next time you make an attack roll before the end of your turn, roll it twice and use the better result. The attack ignores circumstance penalties to the attack roll and any flat check required due to the target being or . You are then temporarily immune to sure strike for 10 minutes.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'tailwind-pf2e',
    name: 'Tailwind',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The wind at your back pushes you to find new horizons. You gain a +10-foot status bonus to your Speed.\nHeightened (2nd) The duration increases to 8 hours.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'temporary-tool-pf2e',
    name: 'Temporary Tool',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
    school: 'arcane',
    traditions: ['arcane'],
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure a temporary simple tool, such as a shovel or rope into your hands. It lasts until it's used for a single activity or for 1 minute, whichever comes first, after which it disappears. The tool is obviously temporarily conjured and thus can't be sold or passed off as a genuine item.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'tether-pf2e',
    name: 'Tether',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      "You use magical chains, vines, or other tethers to bind your target to you. The creature can still try to , and it or others can break the tethers by attacking them (the tethers have AC 15 and 10 Hit Points). You must stay within 30 feet of the target while it's tethered; moving more than 30 feet away from your target ends the spell. The target must attempt a Reflex save. You can Dismiss the spell.\nCritical Success The target is unaffected.\nSuccess The target takes a –5-foot circumstance penalty to its Speed as long as it's within 30 feet of you.\nFailure The target takes a –10-foot circumstance penalty to its Speed and can't move more than 30 feet away from you until it Escapes or the spell ends.\nCritical Failure The target is until it Escapes or the spell ends.\nHeightened (+1) The tethers' AC increases by 3, and their Hit Points increase by 10.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'thoughtful-gift-pf2e',
    name: 'Thoughtful Gift',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
    concentration: false,
    ritual: false,
    description:
      "You teleport one object of light or negligible Bulk held in your hand to the target. The object appears instantly in the target's hand if they have a free hand, or at their feet if they don't. The target knows what object you're attempting to send them. If the target is or refuses to accept your gift, or if the spell would teleport a creature (even if the creature is inside an extradimensional container), the spell fails.\nHeightened (3rd) The spell's range increases to 500 feet.\nHeightened (5th) As 3rd level, and the object's maximum Bulk increases to 1. You can Cast the Spell with 3 actions instead of 1; doing so increases the range to 1 mile, and you don't need line of sight to the target, but you must be extremely familiar with the target.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '3': "Heightened (3rd) The spell's range increases to 500 feet. Heightened (5th) As 3rd level, and the object's maximum Bulk increases to 1. You can Cast the Spell with 3 actions instead of 1; doing so increases the range to 1 mile, and you don't need line of sight to the target, but you must be extremely familiar with the target.",
      },
      summary:
        "Heightened (3rd) The spell's range increases to 500 feet. Heightened (5th) As 3rd level, and the object's maximum Bulk increases to 1. You can Cast the Spell with 3 actions instead of 1; doing so increases the range to 1 mile, and you don't need line of sight to the target, but you must be extremely familiar with the target.",
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'threefold-limb-pf2e',
    name: 'Threefold Limb',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 1,
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'You temporarily transform one of your limbs into water, taking the form of ice, liquid water, or steam as you desire. Make a melee spell attack roll. On a hit, the target takes 2d6 damage; the type of damage dealt and any additional effect depends on the form you choose. On a critical hit, double the damage.\n• Ice The limb deals cold damage, and the target takes a –10-foot status penalty to its Speeds until the start of your next turn. This spell gains the cold trait.\n• Liquid Water The limb deals bludgeoning damage and you can the target up to 10 feet.\n• Steam The limb deals fire damage and steam clings to the target, making all creatures to them until the start of your next turn or they perform an Interact action to wave the steam away. This spell gains the fire trait.\nHeightened (+1) The damage increases by 2d6.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'thunderstrike-pf2e',
    name: 'Thunderstrike',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      'You call down a tendril of lightning that cracks with thunder, dealing 1d12 electricity damage and 1d4 sonic damage to the target with a basic Reflex save. A target wearing metal armor or made of metal takes a –1 circumstance bonus to its save, and if damaged by the spell is Clumsy 1 for 1 round.\nHeightened (+1) The damage increases by 1d12 electricity and 1d4 sonic.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d12 electricity and 1d4 sonic.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'unbroken-panoply-pf2e',
    name: 'Unbroken Panoply',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 1,
    school: 'arcane',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "As tools of violence undone by violence, broken weapons contain potent symbolic magic that faydhaans often call upon when forming alliances. Images of similar legendary weapons overlay the target, and the weapon's broken condition is suppressed for the duration. The weapon gains the nonlethal trait during this time. The weapon's wielder can apply the weapon's item bonus to attack rolls, if any, to their Diplomacy checks. If the weapon would be damaged or broken again, this spell ends.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'vanishing-tracks-pf2e',
    name: 'Vanishing Tracks',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You obscure the tracks you leave behind. The DC of checks to Track you gains a +4 status bonus or is equal to your spell DC, whichever results in a higher DC.\nHeightened (2nd) The duration increases to 8 hours.\nHeightened (4th) The duration increases to 8 hours. The spell has a range of 20 feet and an area of a 20-foot-emanation, affecting up to 10 creatures of your choice within that area.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'Heightened (2nd) The duration increases to 8 hours. Heightened (4th) The duration increases to 8 hours. The spell has a range of 20 feet and an area of a 20-foot-emanation, affecting up to 10 creatures of your choice within that area.',
      },
      summary:
        'Heightened (2nd) The duration increases to 8 hours. Heightened (4th) The duration increases to 8 hours. The spell has a range of 20 feet and an area of a 20-foot-emanation, affecting up to 10 creatures of your choice within that area.',
    },
    classes: ['druid'],
  },
  {
    id: 'bramble-bush-pf2e',
    name: 'Bramble Bush',
    system: 'pf2e',
    source: 'Pathfinder #203: Shepherd of Decay',
    level: 1,
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
      'In a sudden burst of growth, you cause a thorned bush to sprout from the ground, lash around, and wither. Any creature in the area takes 1d4 piercing damage with a basic Reflex saving throw.\nUntil the start of your next turn, the area is difficult terrain and hazardous terrain. Any creature entering the square takes (1d4 + ceil(@item.level / 2) - 1) piercing] damage with a basic Reflex saving throw.\nHeightened (+2) The initial damage increases by 1d4, and the damage dealt by hazardous terrain increases by 1.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The initial damage increases by 1d4, and the damage dealt by hazardous terrain increases by 1.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'bullhorn-pf2e',
    name: 'Bullhorn',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You amplify your voice, loud enough for you to be heard easily at a great distance. For the duration, your voice can be heard loudly and clearly by all listeners within 500 feet, even if other ambient noise would otherwise block the sound. Despite the volume, this doesn't make your voice jarring or distracting. This doesn't increase the range or area of other auditory or linguistic effects, and physical barriers such as walls and doors still block or muffle your voice as normal.\nYour loud voice makes it easier to others, and the acoustics assist in Performing at a large venue. You gain a +1 status bonus to checks to Coerce and auditory Performance checks to at a large venue. You can Dismiss the spell.\nHeightened (5th) Your voice can be heard clearly up to 1,200 feet away.\nHeightened (7th) Your voice can be heard clearly up to 1 mile away.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'caustic-blast-pf2e',
    name: 'Caustic Blast',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      'You fling a large glob of acid that immediately detonates, spraying nearby creatures. Creatures in the area take 1d8 acid damage with a basic Reflex save; on a critical failure, the creature also takes (1+floor((@item.rank -1)/2)) persistent] damage.\nHeightened (+2) The initial damage increases by 1d8, and the persistent damage on a critical failure increases by 1.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The initial damage increases by 1d8, and the persistent damage on a critical failure increases by 1.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'figment-pf2e',
    name: 'Figment',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'concentration',
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      "You create a simple illusory sound or vision. A sound adds the auditory trait to the spell and the sound can't include intelligible words or elaborate music. A vision adds the visual trait, can be no larger than a 5-foot cube, and is clearly crude and undetailed if viewed from within 15 feet. When you Cast or Sustain the Spell, you can attempt to with the illusion, gaining a +2 circumstance bonus to your Deception check. If the attempt fails against a creature, that creature disbelieves the figment.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'frostbite-pf2e',
    name: 'Frostbite',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      'An orb of biting cold coalesces around your target, freezing its body. The target takes 2d4 cold damage with a basic Fortitude save. On a critical failure, the target also gains weakness 1 to bludgeoning until the start of your next turn.\nHeightened (+1) The damage increases by 1d4 and the weakness on a critical failure increases by 1.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage increases by 1d4 and the weakness on a critical failure increases by 1.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'gale-blast-pf2e',
    name: 'Gale Blast',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'Wind flows from your outstretched hands and whirls around you in a 5-foot emanation. Each creature in the area takes 1d6 bludgeoning damage, with a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is pushed 5 feet away from you.\nCritical Failure The creature takes double damage and is pushed 10 feet away from you.\nHeightened (+1) The damage increases by 1d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'glamorize-pf2e',
    name: 'Glamorize',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 1,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Using simple magical gestures, you alter a minor detail of your appearance (add or remove highlights to your hair color, apply or remove cosmetics, add polish or accessories to your nails, etc.) or create a small environmental effect that's confined to your person (adjust surrounding lighting to favor your good side, cause a brief wind to make your hair blow dramatically, make a small chime occur as you smile, etc.). While the spell is active, you can Sustain it to make further adjustments. The changes persist until the spell's duration ends.\nAt the GM's discretion, such alterations might grant a +1 status bonus to certain tasks, such as Impersonate or .",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'gouging-claw-pf2e',
    name: 'Gouging Claw',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You temporarily morph your limb into a clawed appendage. Make a melee spell attack roll against your target's AC. If you hit, you deal your choice of 2d6 slashing damage or 2d6 piercing damage, plus 2 persistent bleed damage. On a critical success, you deal double damage and double bleed damage.\nHeightened (+1) The damage increases by 1d6 and the persistent bleed damage increases by 1.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage increases by 1d6 and the persistent bleed damage increases by 1.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'haunting-hymn-pf2e',
    name: 'Haunting Hymn',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You echo a jarring hymn that only creatures in the area can hear. The hymn deals 1d8 sonic damage, with a basic Fortitude save. If a target critically fails the save, it's also for 1 minute.\nHeightened (+2) The damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The damage increases by 1d8.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'ignition-pf2e',
    name: 'Ignition',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You snap your fingers and point at a target, which begins to smolder. Make a spell attack roll against the target's AC, dealing 2d4 fire damage on a hit. If the target is within your melee reach, you can choose to make a melee spell attack with the flame instead of a ranged spell attack, which increases all the spell's damage dice to d6s.\nCritical Success The target takes double damage and 1d4 persistent fire damage.\nSuccess The target takes full damage.\nHeightened (+1) The initial damage increases by 1d4 and the persistent fire damage on a critical hit increases by 1d4.\n(@item.rank)d4 persistent]{Scaling Persistent Fire Damage}\n(@item.rank)d6 persistent]{Scaling Persistent Fire Damage (Melee)}",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The initial damage increases by 1d4 and the persistent fire damage on a critical hit increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'know-the-way-pf2e',
    name: 'Know the Way',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "In your mind's eye, you magically reorient yourself. You immediately know which direction is north (if it exists at your current location), and you can choose a location you were at within the last 24 hours and learn what direction it lies.\nHeightened (3rd) You can choose a location you were at within the last week.\nHeightened (7th) You can choose a location you were at regardless of how long ago you were there.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'live-wire-pf2e',
    name: 'Live Wire',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You conjure up a length of sharp copper filament humming with electrical current that strikes out at your foe. The wire deals 1d4 slashing damage and 1d4 electricity damage, depending on your spell attack roll against the target's AC.\nCritical Success The target takes double damage and (ceil(@item.rank / 2))d4 persistent] damage.\nSuccess The target takes full damage.\nFailure The target takes the electricity damage, but not the slashing damage.\nCritical Failure The target is unaffected.\nHeightened (+2) The slashing damage, initial electricity damage, and persistent electricity damage on a critical hit each increase by 1d4.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The slashing damage, initial electricity damage, and persistent electricity damage on a critical hit each increase by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'prestidigitation-pf2e',
    name: 'Prestidigitation',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      "The simplest magic does your bidding. You can perform simple magical effects for as long as you Sustain the spell. Each time you Sustain the spell, you can choose one of four options.\n• Cook Cool, warm, or flavor 1 pound of nonliving material.\n• Lift Slowly lift an unattended object of light Bulk or less 1 foot off the ground.\n• Make Create a temporary object of negligible Bulk, made of congealed magical substance. The object looks crude and artificial and is extremely fragile-it can't be used as a tool, weapon, or locus or cost for a spell.\n• Tidy Color, clean, or soil an object of light Bulk or less. You can affect an object of 1 Bulk with 10 rounds of concentration, and a larger object at 1 minute per Bulk.\nPrestidigitation can't deal damage or cause adverse conditions. Any actual change to an object (beyond what is noted above) persists only as long as you Sustain the spell.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'puff-of-poison-pf2e',
    name: 'Puff of Poison',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      "You exhale a shimmering cloud of toxic breath at an enemy's face. The target takes 1d4 poison damage and (ceil(@item.level/2))d4 persistent], depending on its Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The target takes half initial damage and no persistent damage.\nFailure The target takes full initial and persistent damage.\nCritical Failure The target takes double initial and persistent damage.\nHeightened (+2) The initial poison damage increases by 1d4, and the persistent poison damage increases by 1d4.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The initial poison damage increases by 1d4, and the persistent poison damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'scatter-scree-pf2e',
    name: 'Scatter Scree',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "A jumble of rocks cascades into the area. The scattering rocks deal 2d4 bludgeoning damage (basic Reflex save). The ground in the area becomes difficult terrain for the duration of the spell. A creature can Interact to clear a square of this scree.\nIf you cast this spell again, any previous scatter scree you've cast ends.\nHeightened (+1) The damage increases by 1d4.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'spout-pf2e',
    name: 'Spout',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 1,
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
      "Water blasts upward, coming out of the ground, rising from a pool, or even manifesting from thin air. Any creatures in the area take 2d4 bludgeoning damage, with a basic Reflex saving throw. A creature that critically fails its save is disoriented by the explosion of water, becoming until the end of your next turn.\nYou can change this spell's area to a , provided you center the burst in a body of water. This body of water can be as small as a pond or creek, but not as small as a puddle or bathtub.\nHeightened (+1) The damage increases by 1d4.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'summon-instrument-pf2e',
    name: 'Summon Instrument',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      'You materialize a in your grasp. The instrument is typical for its type, but it plays only for you. It vanishes when the spell ends. If you cast summon instrument again, any instrument you previously summoned disappears.\nHeightened (5th) The instrument is instead a .',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'tangle-vine-pf2e',
    name: 'Tangle Vine',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'A vine appears from thin air, flicking from your hand and lashing itself to the target. Attempt a spell attack roll against the target.\nCritical Success The target gains the condition and takes a –10-foot circumstance penalty to its Speeds for 1 round. It can attempt to against your spell DC to remove the penalty and the immobilized condition.\nSuccess The target takes a –10-foot circumstance penalty to its Speeds for 1 round. It can attempt to Escape against your spell DC to remove the penalty.\nFailure The target is unaffected.\nHeightened (2nd) The effects last for 2 rounds.\nHeightened (4th) The effects last for 1 minute.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'telekinetic-hand-pf2e',
    name: 'Telekinetic Hand',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a floating, magical hand, either invisible or ghostlike, that grasps the target object and levitates it slowly up to 20 feet in any direction. When you Sustain the spell, you can move the object an additional 20 feet. If the object is in the air when the spell ends, the object falls.\nHeightened (3rd) You can target an unattended object with a Bulk of 1 or less.\nHeightened (5th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 1 or less.\nHeightened (7th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 2 or less.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '3': 'Heightened (3rd) You can target an unattended object with a Bulk of 1 or less. Heightened (5th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 1 or less. Heightened (7th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 2 or less.',
        '5': 'Heightened (3rd) You can target an unattended object with a Bulk of 1 or less. Heightened (5th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 1 or less. Heightened (7th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 2 or less.',
        '7': 'Heightened (3rd) You can target an unattended object with a Bulk of 1 or less. Heightened (5th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 1 or less. Heightened (7th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 2 or less.',
      },
      summary:
        'Heightened (3rd) You can target an unattended object with a Bulk of 1 or less. Heightened (5th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 1 or less. Heightened (7th) The range increases to 60 feet, and you can target an unattended object with a Bulk of 2 or less.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'vitality-lash-pf2e',
    name: 'Vitality Lash',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You demolish the target's corrupted essence with energy from Creation's Forge. You deal 2d6 vitality damage with a basic Fortitude save. If the creature critically fails the save, it is also Enfeebled 1 until the start of your next turn.\nHeightened (+1) The damage increases by 1d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'void-warp-pf2e',
    name: 'Void Warp',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 1,
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You call upon the Void to harm life force. The target takes 2d4 void damage with a basic Fortitude save. On a critical failure, the target is also Enfeebled 1 until the start of your next turn.\nHeightened (+1) The damage increases by 1d4.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
]);
