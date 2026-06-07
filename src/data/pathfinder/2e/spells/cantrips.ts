import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const cantrips: Spell[] = withPf2eSpellTraits([
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
  {
    id: 'stabilize-pf2e',
    name: 'Stabilize',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'necromancy',
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
      'Positive energy halts a dying creature’s decline. The target loses the dying condition, though it remains unconscious at 0 Hit Points.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'divine-lance-pf2e',
    name: 'Divine Lance',
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
      'You hurl a ray of divine energy. Make a spell attack roll; on a hit it deals 1d4 + spellcasting ability modifier spirit damage (good or evil, chosen when cast), or double on a critical hit.',
    heightening: {
      mode: 'cantrip',
      summary: 'The damage increases by 1d4 for every 2 spell ranks.',
    },
    classes: ['cleric'],
  },
  {
    id: 'detect-magic-pf2e',
    name: 'Detect Magic',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'divination',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      'You send out a pulse that registers the presence of magic. You learn whether magic is present within 30 feet, though not its location or kind.',
    heightening: {
      mode: 'cantrip',
      summary:
        'Heightened (3rd): You learn the school of the most powerful magical effect. (4th): You also pinpoint a magical illusion if its level is no higher than the spell rank.',
    },
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'read-aura-pf2e',
    name: 'Read Aura',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'divination',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You focus on one item and detect whether it is magical, learning the school of magic if so.',
    heightening: {
      mode: 'cantrip',
      summary:
        'Heightened (3rd): You can read the auras of up to 10 items at once. (6th): up to 100 items.',
    },
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'dancing-lights-pf2e',
    name: 'Dancing Lights',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'evocation',
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
      somatic: true,
      material: false,
    },
    duration: {
      type: 'special',
      description: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      'You create four floating lights that you can move up to 60 feet as you Sustain the spell. Each sheds dim light in a 10-foot radius.',
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['bard', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'sigil-pf2e',
    name: 'Sigil',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 0,
    school: 'transmutation',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You etch a small magical mark or symbol of your choice onto a creature or object, lasting one week (or permanently on an object).',
    heightening: {
      mode: 'cantrip',
      summary:
        'Heightened (3rd): the sigil lasts one month. (5th): one year. (7th): permanently on a creature.',
    },
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'bramble-bush-pf2e',
    name: 'Bramble Bush',
    system: 'pf2e',
    source: 'Pathfinder #203: Shepherd of Decay',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary:
        'Heightened (5th) Your voice can be heard clearly up to 1,200 feet away. Heightened (7th) Your voice can be heard clearly up to 1 mile away.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'caustic-blast-pf2e',
    name: 'Caustic Blast',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'frostbite-pf2e',
    name: 'Frostbite',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
      mode: 'cantrip',
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'glamorize-pf2e',
    name: 'Glamorize',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'gouging-claw-pf2e',
    name: 'Gouging Claw',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
      mode: 'cantrip',
      summary: 'Heightened (+2) The damage increases by 1d8.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'ignition-pf2e',
    name: 'Ignition',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary:
        'Heightened (3rd) You can choose a location you were at within the last week. Heightened (7th) You can choose a location you were at regardless of how long ago you were there.',
    },
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'live-wire-pf2e',
    name: 'Live Wire',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary:
        'This cantrip is automatically heightened to a spell rank equal to half your level rounded up.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'puff-of-poison-pf2e',
    name: 'Puff of Poison',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
      mode: 'cantrip',
      summary: 'Heightened (+1) The damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'spout-pf2e',
    name: 'Spout',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 0,
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
      mode: 'cantrip',
      summary: 'Heightened (+1) The damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'summon-instrument-pf2e',
    name: 'Summon Instrument',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary: 'Heightened (5th) The instrument is instead a .',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'tangle-vine-pf2e',
    name: 'Tangle Vine',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
    heightening: {
      mode: 'cantrip',
      summary:
        'Heightened (2nd) The effects last for 2 rounds. Heightened (4th) The effects last for 1 minute.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'telekinetic-hand-pf2e',
    name: 'Telekinetic Hand',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
      mode: 'cantrip',
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
    level: 0,
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
      mode: 'cantrip',
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'void-warp-pf2e',
    name: 'Void Warp',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 0,
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
      mode: 'cantrip',
      summary: 'Heightened (+1) The damage increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
]);
