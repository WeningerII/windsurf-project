import { Spell } from '../../../../types/magic/spells';

export const level3Spells: Spell[] = [
  {
    id: 'pf1e-blink',
    name: 'Blink',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      'You "blink" quickly back and forth between the Material Plane and the Ethereal Plane. You look as though you\'re winking in and out of reality at random. Blink has several effects, including a 50% chance to avoid all damage from an attack.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-clairaudience-clairvoyance',
    name: 'Clairaudience/Clairvoyance',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'divination',
    castingTime: {
      type: 'minutes',
      minutes: 10,
    },
    range: {
      type: 'ranged',
      feet: 400,
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
      "You create an invisible magical sensor at a specific location that enables you to hear or see (your choice) almost as if you were there. You don't need line of sight or line of effect, but the locale must be known—a place familiar to you, or an obvious one.",
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-daylight',
    name: 'Daylight',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'touch',
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
      'You touch an object when you cast this spell, causing the object to shed bright light in a 60-foot radius. This is just like normal light under the sun. Creatures that take penalties in bright light take them while within this radius.',
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      druid: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-deep-slumber',
    name: 'Deep Slumber',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
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
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description: 'This spell functions like sleep, except that it affects 10 HD of targets.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-dispel-magic',
    name: 'Dispel Magic',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You can use dispel magic to end one ongoing spell that has been cast on a creature or object, to temporarily suppress the magical abilities of a magic item, or to counter another spellcaster's spell. A dispelled spell ends as if its duration had expired.",
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      druid: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-displacement',
    name: 'Displacement',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'illusion',
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
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'The subject of this spell appears to be about 2 feet away from its true location. The creature benefits from a 50% miss chance as if it had total concealment. Unlike actual total concealment, displacement does not prevent enemies from targeting the creature normally.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-fireball',
    name: 'Fireball',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
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
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6 per level (max 10d6)',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A fireball spell generates a searing explosion of flame that detonates with a low roar and deals 1d6 points of fire damage per caster level (maximum 10d6) to every creature within the area. Unattended objects also take this damage.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-flame-arrow',
    name: 'Flame Arrow',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
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
    concentration: false,
    ritual: false,
    description:
      'You turn ammunition (such as arrows, bolts, shuriken, and stones) into fiery projectiles. Each piece of ammunition deals an extra 1d6 points of fire damage to any target it hits. A flaming projectile can easily ignite a flammable object or structure.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-fly',
    name: 'Fly',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The subject can fly at a speed of 60 feet (or 40 feet if it wears medium or heavy armor, or if it carries a medium or heavy load). It can ascend at half speed and descend at double speed, and its maneuverability is good.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-gaseous-form',
    name: 'Gaseous Form',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 2,
    },
    concentration: false,
    ritual: false,
    description:
      'The subject and all its gear become insubstantial, misty, and translucent. Its material armor becomes worthless, though its size, Dexterity, deflection bonuses, and armor bonuses from force effects still apply. The subject gains damage reduction 10/magic and becomes immune to poison, sneak attacks, and critical hits.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-haste',
    name: 'Haste',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The transmuted creatures move and act more quickly than normal. When making a full attack action, a hasted creature may make one extra attack with one natural or manufactured weapon. A hasted creature gains a +1 bonus on attack rolls and a +1 dodge bonus to AC and Reflex saves.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-heroism',
    name: 'Heroism',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell imbues a single creature with great bravery and morale in battle. The target gains a +2 morale bonus on attack rolls, saves, and skill checks.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-hold-person',
    name: 'Hold Person',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 100,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'The subject becomes paralyzed and freezes in place. It is aware and breathes normally but cannot take any actions, even speech. Each round on its turn, the subject may attempt a new saving throw to end the effect.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-invisibility-sphere',
    name: 'Invisibility Sphere',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'illusion',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like invisibility, except that this spell confers invisibility upon all creatures within 10 feet of the recipient at the time the spell is cast. The center of the effect is mobile with the recipient.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-lightning-bolt',
    name: 'Lightning Bolt',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'evocation',
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
      material: true,
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
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6 per level (max 10d6)',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'You release a powerful stroke of electrical energy that deals 1d6 points of electricity damage per caster level (maximum 10d6) to each creature within its area. The bolt begins at your fingertips.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-magic-circle-against-evil',
    name: 'Magic Circle against Evil',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'abjuration',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'All creatures within the area gain the effects of a protection from evil spell, and evil summoned creatures cannot enter the area either. Creatures in the area, or who later enter the area, receive only one attempt to suppress effects that are controlling them.',
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-major-image',
    name: 'Major Image',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 round per level',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'This spell functions like silent image, except that sound, smell, and thermal illusions are included in the spell effect. While concentrating, you can move the image within the range.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-nondetection',
    name: 'Nondetection',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'abjuration',
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
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The warded creature or object becomes difficult to detect by divination spells such as clairaudience/clairvoyance, locate object, and detect spells. Nondetection also prevents location by such magic items as crystal balls.',
    classes: ['ranger', 'sorcerer', 'wizard'],
    levelsByClass: {
      ranger: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-slow',
    name: 'Slow',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'An affected creature moves and attacks at a drastically slowed rate. Creatures affected by this spell are staggered and can take only a single move action or standard action each turn, but not both. Additionally, it takes a –1 penalty on attack rolls, AC, and Reflex saves.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-stinking-cloud',
    name: 'Stinking Cloud',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 100,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'Stinking cloud creates a bank of fog like that created by fog cloud, except that the vapors are nauseating. Living creatures in the cloud become nauseated. The effect persists as long as the creature is in the cloud and for 1d4+1 rounds after it leaves.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-suggestion',
    name: 'Suggestion',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
    },
    components: {
      verbal: true,
      somatic: false,
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'You influence the actions of the target creature by suggesting a course of activity (limited to a sentence or two). The suggestion must be worded in such a manner as to make the activity sound reasonable. Asking the creature to do some obviously harmful act automatically negates the effect of the spell.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-tongues',
    name: 'Tongues',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: false,
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell grants the creature touched the ability to speak and understand the language of any intelligent creature, whether it is a racial tongue or a regional dialect. The subject can speak only one language at a time, although it may be able to understand several languages.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-vampiric-touch',
    name: 'Vampiric Touch',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6 per 2 levels (max 10d6)',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      "You must succeed on a melee touch attack. Your touch deals 1d6 points of damage per two caster levels (maximum 10d6). You gain temporary hit points equal to the damage you deal. You can't gain more than the subject's current hit points + the subject's Constitution score.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'pf1e-water-breathing',
    name: 'Water Breathing',
    system: 'pf1e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description:
      'The transmuted creatures can breathe water freely. Divide the duration evenly among all the creatures you touch. The spell does not make creatures unable to breathe air.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 3,
      druid: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
];
