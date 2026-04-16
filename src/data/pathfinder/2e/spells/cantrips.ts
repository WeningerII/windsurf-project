import { Spell } from '../../../../types/magic/spells';

export const cantrips: Spell[] = [
  {
    id: 'acid-splash-pf2e',
    name: 'Acid Splash',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6',
      },
      type: 'acid',
    },
    concentration: false,
    ritual: false,
    description:
      'You splash a glob of acid that splatters your target and nearby creatures. Make a spell attack. If you hit, you deal 1d6 acid damage plus 1 splash damage. On a critical success, the target also takes 1 persistent acid damage.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'chill-touch-pf2e',
    name: 'Chill Touch',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'Siphoning negative energy into yourself, your hand radiates a pale darkness. Your touch weakens the living and disorients undead. Make a melee spell attack roll. On a hit, the target takes 1d4 negative damage and becomes enfeebled 1 until the start of your next turn.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'daze-pf2e',
    name: 'Daze',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'enchantment',
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
      "You cloud the target's mind and daze it with a mental jolt. The target must attempt a Will save. On a failure, the target is stunned 1 (stunned 2 on a critical failure).",
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'divine-light-pf2e',
    name: 'Divine Light',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4',
      },
      type: 'radiant',
    },
    concentration: false,
    ritual: false,
    description:
      'You unleash a beam of divine energy. Make a ranged spell attack roll against the target. On a hit, the target takes 1d4 good damage and on a critical success, the target is also dazzled for 1 round.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['cleric'],
  },
  {
    id: 'electric-arc-pf2e',
    name: 'Electric Arc',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'An arc of lightning leaps from one target to another. You deal electricity damage equal to 1d4 plus your spellcasting ability modifier to each target, with a basic Reflex save.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'forbidding-ward-pf2e',
    name: 'Forbidding Ward',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'abjuration',
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
      'You ward yourself or an ally. The target gains a +1 status bonus to AC for 1 minute.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['cleric'],
  },
  {
    id: 'guidance-pf2e',
    name: 'Guidance',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'divination',
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You ask for divine guidance. The target gains a +1 status bonus to one attack roll, Perception check, saving throw, or skill check before the start of your next turn.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'light-pf2e',
    name: 'Light',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'evocation',
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'The object glows, casting bright light in a 20-foot radius (and dim light for the next 20 feet) like a torch. If you cast this spell again on a second object, the light spell on the first object ends.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'mage-hand-pf2e',
    name: 'Mage Hand',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'evocation',
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
      'You create a floating hand that can manipulate objects. The hand can move up to 30 feet each round and can perform simple tasks like opening doors or picking up items weighing 1 Bulk or less.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'message-pf2e',
    name: 'Message',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
    concentration: false,
    ritual: false,
    description:
      'You mouth words quietly to the target, who hears them as if you were standing next to them. The target can respond in kind.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'produce-flame-pf2e',
    name: 'Produce Flame',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'evocation',
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
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A small ball of flame appears in the palm of your hand, and you lash out with it either in melee or at range. Make a spell attack roll against your target. If you hit, you deal 1d4 fire damage plus your spellcasting ability modifier.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'ray-of-frost-pf2e',
    name: 'Ray of Frost',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'You blast an icy ray. Make a spell attack roll. The ray deals cold damage equal to 1d4 plus your spellcasting ability modifier.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'shield-pf2e',
    name: 'Shield',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You raise a magical shield of force. This counts as using the Raise a Shield action, giving you a +1 circumstance bonus to AC. While the spell is in effect, you can also use the Shield Block reaction with your magic shield.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'tanglefoot-pf2e',
    name: 'Tanglefoot',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'conjuration',
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'A vine lashes out from your hand to entangle a target. Make a spell attack roll. On a hit, the target takes a –10-foot status penalty to its Speed for 1 round. On a critical hit, the target is also immobilized for 1 round.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['druid'],
  },
  {
    id: 'telekinetic-projectile-pf2e',
    name: 'Telekinetic Projectile',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
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
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6',
      },
      type: 'bludgeoning',
    },
    concentration: false,
    ritual: false,
    description:
      'You hurl a loose object at the target. Make a spell attack. On a hit, you deal 1d6 bludgeoning, piercing, or slashing damage (depending on the object).',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard'],
  },
];
