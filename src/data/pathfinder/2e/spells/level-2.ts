import { Spell } from '../../../../types/magic/spells';

export const level2Spells: Spell[] = [
  {
    id: 'aid-pf2e',
    name: 'Aid',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'enchantment',
    traditions: ['divine', 'occult'],
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You magically boost an ally's attack. The ally gains a +1 circumstance bonus to the triggering attack roll, or a +2 bonus if you're a master, or +3 if you're legendary.",
    classes: ['bard', 'cleric'],
  },
  {
    id: 'animal-form-pf2e',
    name: 'Animal Form',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'transmutation',
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
      'You transform into a Medium animal battle form. When you cast this spell, choose ape, bear, bull, canine, cat, deer, frog, shark, or snake. You gain the specific abilities of that animal form.',
    classes: ['druid'],
  },
  {
    id: 'blur-pf2e',
    name: 'Blur',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'illusion',
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
    description:
      "The target's form appears blurry. Creatures targeting the target must attempt a DC 5 flat check; on a failure, they target the wrong creature or no creature at all. This isn't a sufficient degree of concealment to hide, and it doesn't help against area effects.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'calm-emotions-pf2e',
    name: 'Calm Emotions',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'enchantment',
    traditions: ['divine', 'occult'],
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: true,
    ritual: false,
    description:
      "You forcibly calm creatures in the area, suppressing strong emotions. Targets must attempt a Will save. On a failure, the target suppresses hostile actions and can't take actions that are exclusively aggressive.",
    classes: ['bard', 'cleric'],
  },
  {
    id: 'continual-flame-pf2e',
    name: 'Continual Flame',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'evocation',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'unlimited',
    },
    concentration: false,
    ritual: false,
    description:
      "A magical flame springs up from the object, as bright as a torch. It doesn't need oxygen, react to water, or generate heat. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen.",
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'darkness-pf2e',
    name: 'Darkness',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'evocation',
    traditions: ['arcane', 'divine'],
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
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a shroud of darkness that prevents light from penetrating or emanating within the area. Light does not enter the area and any non-magical light sources, such as a torch or lantern, do not emanate any light while inside the area, even if their light radius would extend beyond the area.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'darkvision-pf2e',
    name: 'Darkvision',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'divination',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You grant the target the ability to see in the dark. The target gains darkvision.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'deafness-pf2e',
    name: 'Deafness',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      'You deafen the target. The target must attempt a Fortitude save. On a failure, the target is deafened for the duration.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'dispel-magic-pf2e',
    name: 'Dispel Magic',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'abjuration',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      'You unravel the magic behind a spell or effect. Attempt a counteract check against the target. If you succeed, the spell or effect is suppressed.',
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'enlarge-pf2e',
    name: 'Enlarge',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'The target grows to size Large. Its equipment grows with it. The target gains 5 temporary Hit Points and deals 2 additional damage with its melee Strikes.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'enlarge-reduce-pf2e',
    name: 'Enlarge/Reduce',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'Bolstered by magical power, the target grows to size Large. Its equipment grows with it but returns to natural size if removed. The creature is clumsy 1. Its reach increases by 5 feet, and it gains a +2 status bonus to melee damage.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'faerie-fire-pf2e',
    name: 'Faerie Fire',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'evocation',
    traditions: ['primal'],
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
      type: 'minutes',
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      "All creatures in the area when you cast the spell are outlined in colorful light. Outlined creatures don't benefit from being concealed, and they can't benefit from being invisible.",
    classes: ['druid'],
  },
  {
    id: 'flaming-sphere-pf2e',
    name: 'Flaming Sphere',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 3,
        die: 'd6',
        notation: '3d6',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a sphere of flame in a square within range. The sphere must be supported by a solid surface, such as a stone floor. The sphere deals 3d6 fire damage to each creature in the square where it first appears; each creature must attempt a basic Reflex save.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'glitterdust-pf2e',
    name: 'Glitterdust',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      type: 'rounds',
      rounds: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex save',
    concentration: false,
    ritual: false,
    description:
      "Creatures in the area are outlined by glittering dust. Each creature must attempt a Reflex save. On a failure, creatures are dazzled for the duration and can't be concealed. On a critical failure, creatures are also blinded.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'hideous-laughter-pf2e',
    name: 'Hideous Laughter',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      "The target is overwhelmed with laughter. The target must attempt a Will save. On a failure, the target falls prone and can't use actions that require concentration. It can attempt to end the effect on its turn.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'invisibility-pf2e',
    name: 'Invisibility',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'illusion',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'Cloaked in illusion, the target becomes invisible. This makes it undetected to all creatures, though the creatures can attempt to find the target, making it hidden to them instead. If the target uses a hostile action, the spell ends.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'mirror-image-pf2e',
    name: 'Mirror Image',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'Three illusory images of you swirl about your space, making it difficult for enemies to know which one to attack. Any attack that would hit you has a 1 in 4 chance of hitting an image instead of you. If an attack hits an image, it is destroyed.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'resist-energy-pf2e',
    name: 'Resist Energy',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'abjuration',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You shield the target against dangerous temperatures and environmental heat and cold. Choose acid, cold, electricity, fire, or sonic. The target gains resistance 5 to damage of the chosen type.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'restoration-pf2e',
    name: 'Restoration',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'necromancy',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'minutes',
      minutes: 1,
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
      'Restorative magic counters the effects of toxins or conditions that prevent a creature from functioning at its best. When you cast restoration, choose to either reduce a condition or lessen the effect of a toxin.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'see-invisibility-pf2e',
    name: 'See Invisibility',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'divination',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You can see invisible creatures and objects. They appear to you as translucent shapes, and they are concealed to you.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'shrink-pf2e',
    name: 'Shrink',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'The target shrinks to size Tiny. Its equipment shrinks with it. The target takes a -2 status penalty to damage rolls with its melee Strikes.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'sound-burst-pf2e',
    name: 'Sound Burst',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'evocation',
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
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    damage: {
      base: {
        count: 2,
        die: 'd10',
        notation: '2d10',
      },
      type: 'sonic',
    },
    concentration: false,
    ritual: false,
    description:
      'A cacophonous burst of sound deals 2d10 sonic damage to each creature in a 10-foot burst. Each creature must attempt a Fortitude save. On a critical failure, the creature is also stunned 1.',
    classes: ['bard', 'cleric'],
  },
  {
    id: 'web-pf2e',
    name: 'Web',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You create a sticky web in the area that impedes creatures' movement. Squares filled with the web are difficult terrain. Each square can be cleared of the web with a total of 3 Interact actions or by destroying it.",
    classes: ['sorcerer', 'wizard'],
  },
];
