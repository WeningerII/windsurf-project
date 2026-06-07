import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level2Spells: Spell[] = withPf2eSpellTraits([
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
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (3rd): You instead gain 10 temporary HP, AC = 17 + your level, attack modifier +14, damage bonus +5, and Athletics +14. Heightened (4th): Your battle form is Large and your attacks have 10-foot reach. You must have enough space to expand into or the spell is lost. You instead gain 15 temporary HP, AC = 18 + your level, attack modifier +16, damage bonus +9, and Athletics +16. Heightened (5th): Your battle form is Huge and your attacks have 15-foot reach. You must have enough space to expand into or the spell is lost. You instead gain 20 temporary HP, AC = 18 + your level, attack modifier +18, damage bonus +7 and double the number of damage dice, and Athletics +20.',
      ranks: {
        3: 'You instead gain 10 temporary HP, AC = 17 + your level, attack modifier +14, damage bonus +5, and Athletics +14.',
        4: 'Your battle form is Large and your attacks have 10-foot reach. You must have enough space to expand into or the spell is lost. You instead gain 15 temporary HP, AC = 18 + your level, attack modifier +16, damage bonus +9, and Athletics +16.',
        5: 'Your battle form is Huge and your attacks have 15-foot reach. You must have enough space to expand into or the spell is lost. You instead gain 20 temporary HP, AC = 18 + your level, attack modifier +18, damage bonus +7 and double the number of damage dice, and Athletics +20.',
      },
    },
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
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The cost increases as follows: 16 gp for 3rd level; 30 gp for 4th, 60 gp for 5th, 120 gp for 6th; 270 gp for 7th, 540 gp for 8th, 1,350 gp for 9th, and 3,350 gp for 10th.',
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (4th): Even creatures with darkvision (but not greater darkvision) can barely see through the darkness. They treat targets seen through the darkness as concealed.',
      ranks: {
        4: 'Even creatures with darkvision (but not greater darkvision) can barely see through the darkness. They treat targets seen through the darkness as concealed.',
      },
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (3rd): The spell's range is touch and it targets 1 willing creature. Heightened (5th): The spell's range is touch and it targets 1 willing creature. The duration is until the next time you make your daily preparations.",
      ranks: {
        3: "The spell's range is touch and it targets 1 willing creature.",
        5: "The spell's range is touch and it targets 1 willing creature. The duration is until the next time you make your daily preparations.",
      },
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (4th): The creature instead grows to size Huge. The status bonus to melee damage is +4 and the creature's reach increases by 10 feet (or 15 feet if the creature started out Tiny). The spell has no effect on a Huge or larger creature. Heightened (6th): Choose either the 2nd-level or 4th-level version of this spell and apply its effects to 10 willing creatures.",
      ranks: {
        4: "The creature instead grows to size Huge. The status bonus to melee damage is +4 and the creature's reach increases by 10 feet (or 15 feet if the creature started out Tiny). The spell has no effect on a Huge or larger creature.",
        6: 'Choose either the 2nd-level or 4th-level version of this spell and apply its effects to 10 willing creatures.',
      },
    },
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
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d6.',
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (4th): The spell lasts 1 minute, but it doesn't end if the target uses a hostile action.",
      ranks: {
        4: "The spell lasts 1 minute, but it doesn't end if the target uses a hostile action.",
      },
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (4th): The resistance increases to 10, and you can target up to two creatures. Heightened (7th): The resistance increases to 15, and you can target up to five creatures.',
      ranks: {
        4: 'The resistance increases to 10, and you can target up to two creatures.',
        7: 'The resistance increases to 15, and you can target up to five creatures.',
      },
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (4th): Add drained to the list of conditions you can reduce. When you lessen a toxin, reduce the stage by two. You also gain a third option that allows you to reduce the target's doomed value by 1. You can't use this to reduce a permanent doomed condition. Heightened (6th): As the 4th-level restoration, but you can reduce a permanent doomed condition if you add a spellcasting action and a material component while Casting the Spell, during which you provide 100 gp worth of diamond dust as a cost.",
      ranks: {
        4: "Add drained to the list of conditions you can reduce. When you lessen a toxin, reduce the stage by two. You also gain a third option that allows you to reduce the target's doomed value by 1. You can't use this to reduce a permanent doomed condition.",
        6: 'As the 4th-level restoration, but you can reduce a permanent doomed condition if you add a spellcasting action and a material component while Casting the Spell, during which you provide 100 gp worth of diamond dust as a cost.',
      },
    },
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
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (5th): The spell has a duration of 8 hours.',
      ranks: {
        5: 'The spell has a duration of 8 hours.',
      },
    },
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
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (6th): The spell can target up to 10 creatures.',
      ranks: {
        6: 'The spell can target up to 10 creatures.',
      },
    },
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
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d10.',
    },
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
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (4th): The spell's area increases to a 20-foot burst, and its range increases to 60 feet.",
      ranks: {
        4: "The spell's area increases to a 20-foot burst, and its range increases to 60 feet.",
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'obscuring-mist-pf2e',
    name: 'Obscuring Mist',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'conjuration',
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
    concentration: false,
    ritual: false,
    description:
      'A cloud of mist fills a 20-foot burst, concealing creatures within it and blocking sight beyond it.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'shatter-pf2e',
    name: 'Shatter',
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'fort',
      success: 'none',
    },
    savingThrowText: 'none (object)',
    concentration: false,
    ritual: false,
    description:
      'You emit a high-frequency sonic attack that deals 2d10 sonic damage to an unattended object, ignoring its Hardness up to 4.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d10 and the Hardness ignored by 2.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'spider-climb-pf2e',
    name: 'Spider Climb',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      'The target gains a climb Speed equal to its Speed, letting it walk on walls and ceilings.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '5': 'The duration increases to 1 hour.',
      },
      summary: 'Heightened (5th): duration 1 hour.',
    },
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'touch-of-idiocy-pf2e',
    name: 'Touch of Idiocy',
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
      'You dull the target’s mind; it becomes stupefied 2 (stupefied 1 on a successful Will save, longer on a failure).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'humanoid-form-pf2e',
    name: 'Humanoid Form',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'transmutation',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You transform into a Small or Medium humanoid, gaining a disguise and possibly low-light vision or darkvision.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'death-knell-pf2e',
    name: 'Death Knell',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
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
      'You snuff out the life of a dying creature you touch, killing it if it has dying 1 or more; you gain temporary Hit Points and a status bonus to attacks.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'comprehend-language-pf2e',
    name: 'Comprehend Language',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'divination',
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
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The target understands one spoken or written language it hears or reads for the duration.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '3': 'The target can also speak the language.',
        '4': 'Affects up to 10 creatures.',
      },
      summary: 'Heightened: also speak the language; more targets.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'augury-pf2e',
    name: 'Augury',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'divination',
    traditions: ['divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You learn whether a course of action over the next 30 minutes is likely to bring weal, woe, both, or nothing.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'status-pf2e',
    name: 'Status',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'divination',
    traditions: ['divine', 'occult', 'primal'],
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
      'You maintain a magical connection to a willing creature, sensing its direction, distance, and general condition.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'You can target up to 10 creatures.',
      },
      summary: 'Heightened (4th): up to 10 targets.',
    },
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'remove-fear-pf2e',
    name: 'Remove Fear',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'enchantment',
    traditions: ['divine', 'occult', 'primal'],
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
      'You comfort a creature, ending one fear effect and granting a bonus to recover from new ones.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': 'Affects up to 10 creatures within 30 feet.',
      },
      summary: 'Heightened (6th): up to 10 targets.',
    },
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'knock-pf2e',
    name: 'Knock',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 2,
    school: 'transmutation',
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
    concentration: false,
    ritual: false,
    description:
      'You attempt to open a stuck, barred, locked, or magically sealed door or container, granting a large bonus to the attempt and suppressing locking effects briefly.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'acid-grip-pf2e',
    name: 'Acid Grip',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      'An ephemeral, taloned hand grips the target, burning it with magical acid. The target takes 2d8 acid damage plus floor(@item.level/2)d6 persistent] damage depending on its Reflex save. A creature taking persistent damage from this spell takes a –10-foot status penalty to its Speeds. \nCritical Success The creature is unaffected.\nSuccess The creature takes half damage and no persistent damage, and the claw moves it up to 5 feet in a direction of your choice.\nFailure The creature takes full damage and persistent damage, and the claw moves it up to 10 feet in a direction of your choice.\nCritical Failure The creature takes double damage and full persistent damage, and the claw moves it up to 20 feet in a direction of your choice.\nHeightened (+2) The initial damage increases by 2d8, and the persistent acid damage increases by 1d6.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The initial damage increases by 2d8, and the persistent acid damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'albatross-curse-pf2e',
    name: 'Albatross Curse',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 2,
    school: 'occult',
    traditions: ['occult', 'primal'],
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
      "You create a spectral albatross, a guiding bird for sailors, to hover around the target. You and allies within 30 feet of the target gain a +1 circumstance bonus to attacks against the target. The target creature can spend an action to Strike the albatross, which automatically succeeds and kills it. The target must then attempt a Will save against your spell DC.\nCritical Success The target is unaffected.\nSuccess The guilt of slaughtering a bird of good fortune weighs on the target's mind. The target is Stupefied 1 for 1 round.\nFailure The albatross hangs around a cord from the target's neck (or closest equivalent) for 1 minute, cursing them for their transgression. During this time, the target must roll twice and take the worse result on their next Will save, after which the albatross disappears.\nCritical Failure As failure, but the duration is 1 hour.",
    classes: ['bard', 'druid'],
  },
  {
    id: 'animal-messenger-pf2e',
    name: 'Animal Messenger',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'minutes',
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
      type: 'special',
      description: 'see text',
    },
    concentration: false,
    ritual: false,
    description:
      'You offer food, and an ordinary Tiny animal within range approaches to eat it. You imprint the image, direction, and distance of an obvious place or landmark well known to you within the animal. You can also attach a small object or note up to light Bulk to it. The animal does its best to reach the destination; if it makes it there, it waits nearby and allows nonhostile creatures to approach and remove the attached object. The spell ends after the message is delivered or after 24 hours, whichever comes first.\nIf there are no Tiny wild animals in range, the spell is lost.',
    classes: ['druid'],
  },
  {
    id: 'animated-assault-pf2e',
    name: 'Animated Assault',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: true,
    ritual: false,
    description:
      'You use your mind to manipulate unattended objects in the area, temporarily animating them to attack. The objects hover in the air, then hurl themselves at nearby creatures in a chaotic flurry of debris. This assault deals 2d10 bludgeoning damage (basic Reflex save) to each creature in the area. On subsequent rounds, the first time each round you Sustain this Spell, it deals (floor(@item.level/2))d10 bludgeoning] damage (basic Reflex save) to each creature in the area.\nHeightened (+2) The initial damage increases by 2d10 and the subsequent damage increases by 1d10.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The initial damage increases by 2d10 and the subsequent damage increases by 1d10.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'animus-mine-pf2e',
    name: 'Animus Mine',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
    school: 'occult',
    traditions: ['occult'],
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You implant a mental mine within your psyche that detonates against anyone attempting to magically manipulate your thoughts. You can Sustain the spell to suppress the effects of the mine for 1 round to allow someone to safely use a mental effect on you. You can Dismiss the spell. The first creature that uses a magical mental effect against you triggers the animus mine, causing the spell to end. The animus mine deals 4d8 mental damage to the triggering creature, which must attempt a Will save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is Stunned 1.\nCritical Failure The creature takes double damage and is stunned 1. You're unaffected by the triggering mental effect.\nHeightened (+1) The damage increases by 2d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d8.',
    },
    classes: ['bard'],
  },
  {
    id: 'banishing-touch-pf2e',
    name: 'Banishing Touch',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 2,
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
      type: 'instant',
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "Your touch projects a surge of magic that launches your target safely away. Make a melee spell attack at mythic proficiency against your target's AC. If you hit, you deal 1d6 bludgeoning damage, and you launch the target into the air and away from you; the target takes falling damage as normal. The number of actions you spend while Casting the Spell determines the damage dealt by your touch and how far the target is launched.\n1 The target is launched 10 feet into the air and knocked back 10 feet.\n2 Your touch deals 2d6 bludgeoning damage instead. The target is launched 20 feet into the air and pushed back 10 feet.\n3 Your touch deals 2d6 bludgeoning damage instead. The target is launched 30 feet into the air and pushed back 20 feet.\nHeightened (4th) The initial damage increases by 1d6, and all distances increase by 10 feet for the 1-action version or 20 feet for the 2- and 3-action versions.\nHeightened (6th) The initial damage increases by 2d6, and all distances increase by 20 feet for the 1-action version or 60 feet for the 2- and 3-action versions.\nHeightened (8th) The initial damage increases by 3d6, and all distances increase by 30 feet for the 1-action version or 100 feet for the 2- and 3-action versions.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'Heightened (4th) The initial damage increases by 1d6, and all distances increase by 10 feet for the 1-action version or 20 feet for the 2- and 3-action versions. Heightened (6th) The initial damage increases by 2d6, and all distances increase by 20 feet for the 1-action version or 60 feet for the 2- and 3-action versions. Heightened (8th) The initial damage increases by 3d6, and all distances increase by 30 feet for the 1-action version or 100 feet for the 2- and 3-action versions.',
        '6': 'Heightened (4th) The initial damage increases by 1d6, and all distances increase by 10 feet for the 1-action version or 20 feet for the 2- and 3-action versions. Heightened (6th) The initial damage increases by 2d6, and all distances increase by 20 feet for the 1-action version or 60 feet for the 2- and 3-action versions. Heightened (8th) The initial damage increases by 3d6, and all distances increase by 30 feet for the 1-action version or 100 feet for the 2- and 3-action versions.',
        '8': 'Heightened (4th) The initial damage increases by 1d6, and all distances increase by 10 feet for the 1-action version or 20 feet for the 2- and 3-action versions. Heightened (6th) The initial damage increases by 2d6, and all distances increase by 20 feet for the 1-action version or 60 feet for the 2- and 3-action versions. Heightened (8th) The initial damage increases by 3d6, and all distances increase by 30 feet for the 1-action version or 100 feet for the 2- and 3-action versions.',
      },
      summary:
        'Heightened (4th) The initial damage increases by 1d6, and all distances increase by 10 feet for the 1-action version or 20 feet for the 2- and 3-action versions. Heightened (6th) The initial damage increases by 2d6, and all distances increase by 20 feet for the 1-action version or 60 feet for the 2- and 3-action versions. Heightened (8th) The initial damage increases by 3d6, and all distances increase by 30 feet for the 1-action version or 100 feet for the 2- and 3-action versions.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'bee-mans-summons-pf2e',
    name: "Bee-Man's Summons",
    system: 'pf2e',
    source: 'Pathfinder #201: Pactbreaker',
    level: 2,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'special',
      description: 'until the next time you make your daily preparations or until discharged',
    },
    concentration: false,
    ritual: false,
    description:
      "You recreate the Bee-Man's infamous ability to sense when someone utters their name. During the spell's duration, you mentally sense whenever someone (referred to as a speaker) speaks your full name while within the spell's area. You gain a vague sense of the speaker's identity, such as \"a local farmer\" or \"a halfling in distress,\" unless the speaker is someone you have met and interacted with before, in which case you recognize the speaker specifically. As a reaction within 1 minute of the speaker's utterance, you can send the speaker a telepathic prompt, asking if they intend to summon you. If they respond affirmatively, the spell's remaining duration decreases to sustained (up to 10 minutes), during which time you know the direction to where the speaker named you and how far away they are.\nHeightened (4th) The emanation's radius increases to 1,000 feet.\nHeightened (7th) The emanation's radius increases to 1 mile, and instead of locating the speaker, you can instead converse with the speaker for 5 minutes. This otherwise works as sending.\nHeightened (9th) As 7th, except the emanation's radius increases to 5 miles, and the duration of the conversation is 10 minutes.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'blazing-bolt-pf2e',
    name: 'Blazing Bolt',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You fire a ray of heat and flame. Make a spell attack roll against a single creature. On a hit, the target takes 2d6 fire damage, and on a critical hit, the target takes double damage.\nFor each additional action you use when Casting the Spell, you can fire an additional ray at a different target, to a maximum of three rays targeting three different targets for 3 actions. These attacks each increase your multiple attack penalty, but you don't increase your multiple attack penalty until after you make all the spell attack rolls for blazing bolt. If you spend 2 or more actions Casting the Spell, the damage increases to 4d6 fire damage on a hit, and it still deals double damage on a critical hit.\nHeightened (+1) The damage to each target increases by 1d6 for the 1-action version, or by 2d6 for the 2-action and 3-action versions.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'blistering-invective-pf2e',
    name: 'Blistering Invective',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
      "A heap of insults and invectives spew from your mouth-words so devastating your foes burn from the intensity of your diatribe. Your words deal 2d6 persistent fire damage, and the target must attempt a Will save. If the target doesn't understand the language or you're not speaking a language, it gains a +4 circumstance bonus to its save.\nCritical Success The target is unaffected.\nSuccess The target takes half the persistent fire damage.\nFailure The target becomes Frightened 1 and takes the full persistent fire damage.\nCritical Failure The target becomes Frightened 2 and takes double the persistent fire damage.\nHeightened (+2) You can target two additional creatures, and the persistent damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) You can target two additional creatures, and the persistent damage increases by 2d6.',
    },
    classes: ['bard'],
  },
  {
    id: 'blood-vendetta-pf2e',
    name: 'Blood Vendetta',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      'Requirements You can bleed.\nTrigger A creature deals piercing, slashing, or persistent bleed damage to you.\nYou curse the target, punishing it for having the audacity to spill your blood. The target takes 2d6 persistent bleed damage and must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target takes half the persistent bleed damage.\nFailure The target takes the full persistent bleed damage. Until the bleeding stops, the target has weakness 1 to piercing and slashing damage. \nCritical Failure As failure, but the target takes double the persistent bleed damage.\nHeightened (+2) The persistent bleed damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The persistent bleed damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'buzzing-servants-pf2e',
    name: 'Buzzing Servants',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      "You summon a swarm of bees from the city of Axis that rapidly constructs geometric shapes from wax. The bees appear in an unoccupied square, building a structure of hexagons, squares, and decagons that fill the space. The wax shape has a Hardness of 10 and 40 Hit Points but also decays over 24 hours.\nWhen you Sustain the spell, you can choose another unoccupied square in range that the bees move to and fill with wax shapes. Any amount of area or splash damage to the square they're present in kills the bees, ending further construction.",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'calm-pf2e',
    name: 'Calm',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
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
      "You forcibly calm creatures in the area, soothing them into a nonviolent state; each creature must attempt a Will save.\nCritical Success The creature is unaffected.\nSuccess Calming urges impose a -1 status penalty to the creature's attack rolls.\nFailure Any emotion effects that would affect the creature are suppressed and the creature can't use hostile actions. If the target is subject to hostility from any other creature, it ceases to be affected by calm.\nCritical Failure As failure, but hostility doesn't end the effect.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'charitable-urge-pf2e',
    name: 'Charitable Urge',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You speak on the virtue of charity, compelling the target to give away its possessions. The target must attempt a Will save. If the target has no items on its person, the spell fails.\nCritical Success The target is unaffected.\nSuccess The target is Stunned 1 as it wrestles with the urge.\nFailure On its next turn, before it does anything else, the target must present the nearest creature with an item in its possession; the target chooses which item to give, and if the only item it has is one that it's currently using to defend itself, such as a weapon during a combat encounter, it can choose to be stunned for 1 round instead of giving up the item. This might require the target to Interact to retrieve an item or move to reach the nearest creature, and passing the item off requires an Interact action as normal.\nCritical Failure As failure, except the duration is 4 rounds, and the target must repeat the effects of a failure on each of its turns. At the end of each of its turns, the target can attempt a new Will save to reduce the remaining duration by 1 round, ending the effects entirely on a critical success.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'claws-of-the-otter-pf2e',
    name: 'Claws of the Otter',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 2,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Webbing grows between your fingers and your nails extend into vicious claws. For the spell's duration, you gain a +1 status bonus to Athletics checks to Swim and you gain a claws unarmed attack. They're an agile, finesse, unarmed attack that deals 1d4 slashing damage and an additional 1d6 cold damage.\nHeightened (+3) The additional cold damage increases by 1d6.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'cleanse-affliction-pf2e',
    name: 'Cleanse Affliction',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      "Gentle restorative magic pushes back the effects of toxins and more complex maladies. Choose an affliction on the target, such as a curse, disease, or poison. If it has advanced past stage one, reduce the stage by one. This reduction can be applied only once to a given case of an affliction, with the case ending when it's completely cured. Although the reduction can't occur again, heightened versions of this spell attempt to counteract with each casting.\nHeightened (3rd) Attempt to counteract the affliction if it is a disease or poison.\nHeightened (4th) Attempt to counteract the affliction if it is a curse, disease, or poison.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'clear-mind-pf2e',
    name: 'Clear Mind',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      "You drive mental contamination from the target's mind. Attempt to counteract an effect of your choice imposing one of these conditions on the target: , , and . If you failed to counteract the effect but you would have if its counteract rank were 2 lower, instead suppress the effect until the beginning of your next turn. The effect's duration doesn't elapse while it's suppressed. This spell can't counteract or suppress conditions that are part of curses, diseases, or a natural state of the target.\nHeightened (4th) Add , , and to the list of conditions.\nHeightened (6th) Add to the list of conditions.\nHeightened (8th) Add to the list of conditions.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'coiling-dance-pf2e',
    name: 'Coiling Dance',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 2,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "You perform a dance that seeks to pass on the knowledge and wisdom of a naga. Your allies in the area are filled with sacred energy, making their spells and attacks holy. Creatures or effects that would be unholy don't gain this benefit\nWhen you cast or Sustain this spell, you can choose an ally in the area that's , , or . They can immediately use a reaction to ; they can use your Occultism or Religion modifier for the check instead of their unarmed attack, Acrobatics, or Athletics modifier if that would be better.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'create-food-pf2e',
    name: 'Create Food',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
    castingTime: {
      type: 'hour',
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
      'You create enough food to feed six Medium creatures for a day. This food is bland and unappealing, but it is nourishing. After 1 day, if no one has eaten the food, it decays and becomes inedible. Most Small creatures eat one-quarter as much as a Medium creature (one-sixteenth as much for most Tiny creatures), and most Large creatures eat 10 times as much (100 times as much for Huge creatures and so on).\nHeightened (4th) You can feed 12 Medium creatures.\nHeightened (6th) You can feed 50 Medium creatures.\nHeightened (8th) You can feed 200 Medium creatures.',
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'dismantle-pf2e',
    name: 'Dismantle',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
    concentration: false,
    ritual: false,
    description:
      'You touch an object, and it immediately disassembles itself into its component pieces. The spell fails if the target lacks component pieces (such as a statue carved from one block of stone), and using it on a dangerous object like a snare or trap typically triggers it. The object gains the condition, and the component pieces become small enough to be under normal clothing and armor. You can the spell.\nWhen the spell ends, the object reassembles itself into its original form, appearing in your hand or hands if you have them free, or on the ground in front of you otherwise. Once reassembled, the object loses the Broken condition and its Hit Points return to the value the object had when you Cast the Spell.\nHeightened (4th) The spell lasts for 10 minutes.\nHeightened (6th) The spell lasts until your next daily preparations.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'embed-message-pf2e',
    name: 'Embed Message',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      type: 'unlimited',
    },
    concentration: false,
    ritual: false,
    description:
      'You specify a trigger and a message up to 25 words long. When the specified trigger occurs within 30 feet of the target, illusory text of your message circles the target accompanied by a disembodied voice. You can choose a language you know for the text and speech, and can choose what the voice sounds like. Once the message is completed, the spell ends.\nHeightened (4th) You can add a simple sensory component to emphasize the message, such as an odor, visual effect, or physical sensation. This addition is obviously illusory and part of the message, lasting only while the message is being read.\nHeightened (6th) As 4th rank, but you can choose how many times the spell repeats the message before it ends; there is no limit to the number of repetitions.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'entangling-flora-pf2e',
    name: 'Entangling Flora',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "Plants and fungi burst out or quickly grow, entangling creatures. All surfaces in the area are difficult terrain. Each round that a creature starts its turn in the area, it must attempt a Reflex save. On a failure, it takes a –10-foot circumstance penalty to its Speeds until it leaves the area, and on a critical failure, it's also for 1 round. Creatures can attempt to to remove these effects.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'environmental-endurance-pf2e',
    name: 'Environmental Endurance',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      'You shield the target against dangerous temperatures. Choose severe cold or heat. The target is protected from the temperature you chose (but not extreme cold or heat).\nHeightened (3rd) The target is protected from severe cold and severe heat.\nHeightened (5th) The target is protected from severe cold, severe heat, extreme cold, and extreme heat.',
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'everlight-pf2e',
    name: 'Everlight',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      material: false,
    },
    duration: {
      type: 'unlimited',
    },
    concentration: false,
    ritual: false,
    description:
      'The gemstone you touch glows, spreading bright light with a color of your choice in a 20-foot radius (and dim light for the next 20 feet). The spell ends immediately if the gemstone is broken.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'expeditious-excavation-pf2e',
    name: 'Expeditious Excavation',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
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
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'Area (continued) cube of dirt 5 feet across or smaller\nYou remove loose dirt, dust, gravel, sand, and the like (though not solid stone) up to the size of a 5-foot cube. Any Medium or smaller creature standing atop the earth when the spell is cast must attempt a Reflex save or Acrobatics check.\nSuccess The creature is unaffected and can choose to either descend the pit without damage or move to the nearest available space of its choice.\nFailure The creature falls in the nearest available space of its choice or falls into the pit if it prefers.\nCritical Failure The creature falls into the pit excavated by the spell and lands prone, taking falling damage as normal.\nHeightened (+2) The spell can excavate an additional 5-foot cube of earth. If you excavate all four 5-foot cubes beneath a Large creature, it must attempt a Reflex save or Acrobatics check, as above.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'false-vitality-pf2e',
    name: 'False Vitality',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      'You augment your flesh with the energies typically used to manipulate the undead. You gain 10 temporary Hit Points.\nHeightened (+1) The temporary Hit Points increase by 3.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'far-flung-fetch-pf2e',
    name: 'Far-Flung Fetch',
    system: 'pf2e',
    source: 'Pathfinder NPC Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 60,
    },
    components: {
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You can pilfer an object even if it's outside the reach of your fingers. You teleport the target into one of your open hands. If you don't have a hand free, it falls to the ground at your feet.\nHeightened (3rd) The range increases to 120 feet.\nHeightened (5th) The range increases to 120 feet, and you can target an unattended object with a Bulk of 1 or less.\nHeightened (7th) As 5th rank, and when you Cast the Spell you can spend 3 actions instead of 1 to increase the range to planetary. If you do, you don't need line of sight to the target, but you must be extremely familiar with the target.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'fear-the-sun-pf2e',
    name: 'Fear the Sun',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
    school: 'arcane',
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
      "You cause the creature's vision to become particularly sensitive. The creature must attempt a Fortitude save. The creature is then temporarily immune for 1 minute.\nCritical Success The creature is unaffected.\nSuccess The creature is for 1 round.\nFailure The creature is dazzled for 1 minute.\nCritical Failure The creature gains for 1 minute. If the creature is already exposed to bright light, it immediately becomes until the end of its next turn, as it isn't acclimated to its newly acquired light blindness.\nHeightened (6th) You can target up to 10 creatures.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': 'Heightened (6th) You can target up to 10 creatures.',
      },
      summary: 'Heightened (6th) You can target up to 10 creatures.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'feast-of-ashes-pf2e',
    name: 'Feast of Ashes',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      type: 'special',
      description: '1 week',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You curse the target with a hunger no food can sate. You can Dismiss the spell. The target must attempt a Fortitude save.\nCritical Success The creature is unaffected and is temporarily immune for 1 hour.\nSuccess The creature is for 1 round.\nFailure The creature is immediately afflicted by hunger as if it hadn't eaten food in days. It becomes fatigued and takes 1d4 damage each day that can't be healed until it sates its hunger. No amount of eating can sate the creature's hunger during the spell's duration.\nCritical Failure As failure, but the creature takes 2d4 damage each day from unbearable hunger.\nHeightened (+1) The hunger becomes more intolerable, increasing the damage each day by 1d4, or by 2d4 on a critical failure.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The hunger becomes more intolerable, increasing the damage each day by 1d4, or by 2d4 on a critical failure.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'final-sacrifice-pf2e',
    name: 'Final Sacrifice',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
    school: 'arcane',
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'You channel disruptive energies through the bond between you and your minion, causing it to violently explode. The target is immediately slain, and the explosion deals 6d6 fire damage to creatures within 20 feet of it with a basic Reflex save. If the target has the cold or water trait, the spell deals cold damage and has the cold trait instead of the fire trait. Attempting to cast this spell targeting a creature that you temporarily seized control of, such as an undead commanded by bind undead, automatically fails and breaks the controlling effect.\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'floating-flame-pf2e',
    name: 'Floating Flame',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: true,
    ritual: false,
    description:
      'You create a fire that burns without fuel and moves to your commands. The flame deals 3d6 fire damage to each creature in the square in which it appears, with a basic Reflex save. When you Sustain this spell, you can levitate the flame up to 10 feet. It then deals damage to each creature whose space it shared at any point during its flight. This uses the same damage and save, and you roll the damage once each time you Sustain. A given creature can take damage from floating flame only once per round.\nHeightened (+1) The damage increases by 1d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'frog-tongue-pf2e',
    name: 'Frog Tongue',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 2,
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "Your tongue extends unnaturally, flicking out toward a creature within range and dealing 2d8 bludgeoning damage (basic Reflex save). On a failure, the creature is also stuck to the end of the tongue. It is and can't move beyond the reach of your tongue. A creature can sever the tongue with a Strike that deals at least 10 slashing damage or attempt to against your spell DC. The AC of the tongue is equal to your spell DC. Severing the tongue in this way deals no damage to you but ends the spell. While a creature is stuck to the end of your tongue, actions you take with the auditory trait take a –2 circumstance penalty. If you move so that the affected creature is outside of the tongue's reach, the spell ends.\nHeightened (+1) The damage increases by 2d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d8.',
    },
    classes: ['druid'],
  },
  {
    id: 'fungal-hyphae-pf2e',
    name: 'Fungal Hyphae',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "Thin hyphae grow from your feet and plunge into the earth, creating a symbiotic fungal network that attaches to plants within 30 feet and connects you to their root systems. You gain an imprecise tremorsense, allowing you to sense anything directly touching plants within that distance. If you move, the hyphae snap, and the spell ends.\nHeightened (4th) You can control plants in the area to a small degree, allowing you to make Strikes with tree branches, exposed roots, or similarly solid plants. To do so, you use a Strike action, but you can Strike any creature you can detect with your tremorsense. These are spell attacks that deal 3d8 bludgeoning] damage. Unusual plants, such as thorny vines, might deal a different type of damage at the GM's discretion. You can't make any other attacks through these plants, or take any other actions through them, other than these Strikes.\nHeightened (6th) As 4th rank, but you can use other simple manipulate actions through the plants, including having a branch pick an object up or open a door, though more complex actions, such as picking a lock or disabling a trap, remain impossible.",
    classes: ['druid'],
  },
  {
    id: 'fungal-infestation-pf2e',
    name: 'Fungal Infestation',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
    school: 'primal',
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
      "Toxic spores swarm over creatures in the area, causing them to erupt in grotesque fungal growths. These noxious growths deal 2d6 persistent poison damage, and each creature must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The target takes half the persistent poison damage.\nFailure The target takes the full persistent poison damage. While it's taking this persistent poison damage, it has weakness 1 to fire and weakness 1 to slashing.\nCritical Failure As failure, but double the persistent poison damage. While it's taking this persistent poison damage, it has weakness 2 to fire and weakness 2 to slashing.\nHeightened (+2) The persistent damage increases by 2d6, and the weakness increases by 1, or by 2 on a critical failure.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The persistent damage increases by 2d6, and the weakness increases by 1, or by 2 on a critical failure.',
    },
    classes: ['druid'],
  },
  {
    id: 'gecko-grip-pf2e',
    name: 'Gecko Grip',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "Tiny clinging hairs sprout across the creature's hands and feet, offering purchase on nearly any surface. The target gains a climb Speed equal to its Speed.\nHeightened (5th) The duration increases to 1 hour.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'ghostly-carrier-pf2e',
    name: 'Ghostly Carrier',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      type: 'minutes',
      minutes: 1,
    },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'You create a Tiny, semi-corporeal figure with a form you choose. It hovers near you for the duration. When you Cast a Spell that has a range of touch, you can have the carrier move within range, deliver the spell to a creature there, and return to you. If the carrier must attempt a spell attack roll, it uses your normal bonuses. The carrier has your AC and saves, but it is destroyed by any damage.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'ghoulish-cravings-pf2e',
    name: 'Ghoulish Cravings',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
    school: 'divine',
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
      "You touch the target to afflict it with the overwhelming desire to eat raw meat. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target is Sickened 1 by its unbidden hunger.\nFailure The target is Sickened 2 and can't reduce this condition below sickened 1 until it first consumes some raw meat; if the creature doesn't have access to raw meat, it can take a bite out of a corpse within reach as an Interact action.\nCritical Failure As failure, but the target can't reduce the condition below sickened 2 until it consumes raw meat.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'hidebound-pf2e',
    name: 'Hidebound',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 2,
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
      "Trigger A creature within range is hit with a Strike that deals physical damage.\nThe target's skin erupts in thick hide or dense scales. It gains resistance 5 to physical damage, except adamantine, until the beginning of its next turn.\nHeightened (+2) The resistance increases by 3.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'illusory-creature-pf2e',
    name: 'Illusory Creature',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      type: 'concentration',
      maxDuration: 'sustained',
    },
    attackRoll: true,
    concentration: true,
    ritual: false,
    description:
      "You create an illusory image of a Large or smaller creature. It generates the appropriate sounds, smells, and feels believable to the touch. If you and the image are ever farther than 500 feet apart, the spell ends.\nThe image can't speak, but you can use your actions to speak through the creature, with the spell disguising your voice as appropriate. You might need to attempt a Deception or Performance check to mimic the creature, as determined by the GM. This is especially likely if you're trying to imitate a specific person and engage with someone that person knows.\nIn combat, the illusion can use 2 actions per turn, which it uses when you Sustain the spell. It uses your spell attack modifier for attack rolls and your spell DC for its AC. Its saving throw modifiers are equal to your spell DC – 10. It is substantial enough that it can flank other creatures. If the image is hit by an attack or fails a save, the spell ends.\nThe illusion can cause damage by making the target believe the illusion's attacks are real, but it cannot otherwise directly affect the physical world. If the illusory creature hits with a Strike, the target takes 3d4 mental] damage. The illusion's Strikes are nonlethal. If the damage doesn't correspond to the image of the monster—for example, if an illusory Large dragon deals only 5 damage—the GM might allow the target to attempt an immediate Perception check to disbelieve the spell. Any relevant resistances and weaknesses apply if the target thinks they do, as judged by the GM. For example, if the illusion wields a warhammer and attacks a creature resistant to bludgeoning damage, the creature would take less mental damage. However, illusory damage does not deactivate regeneration or trigger other effects that require a certain damage type. The GM should track illusory damage dealt by the illusion.\nAny creature that touches the image or uses the action to examine it can attempt to disbelieve your illusion. When a creature disbelieves the illusion, it recovers from half the damage it had taken from it (if any) and doesn't take any further damage from it.\nHeightened (+1) The damage of the image's Strikes increases by 1d4, and the maximum size of creature you can create increases by one (to a maximum of Gargantuan).",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'kgalaserkes-axes-pf2e',
    name: "Kgalaserke's Axes",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      "The folklore and tales surrounding the legendary hero Kgalaserke are so widespread and well known that a hundred lifetimes would not be enough to have accomplished everything she is reputed to have done. Nevertheless, the stories all contain a unifying theme of her martial prowess despite the odds being stacked against her.\n1 You briefly describe Kgalaserke's signature axes and how she came to receive them. The target gains a +1 status bonus to attack rolls for the spell's duration.\n2 You revel in a tale of Kgalaserke striking down a foe after a struggle. For the spell's duration, when the target is damaged by a creature's attack, the target gains a +2 circumstance bonus to damage against that creature for 1 round.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'laughing-fit-pf2e',
    name: 'Laughing Fit',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "The target is overtaken with uncontrollable laughter. It must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target is plagued with uncontrollable laughter. It can't use reactions.\nFailure The target is Slowed 1 and can't use reactions.\nCritical Failure The target falls and can't use actions or reactions for 1 round. It then takes the effects of a failure.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'mark-of-blood-pf2e',
    name: 'Mark of Blood',
    system: 'pf2e',
    source: 'Pathfinder Adventure: Prey for Death',
    level: 2,
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
      "You place a drop of your blood on a weapon and charge it with magic so that you transfer a small amount of your life essence with your attack. The next creature you successfully Strike with the weapon during the spell's duration takes damage as normal from the attack and must then attempt a Will save; regardless of the outcome of this saving throw, the duration of mark of blood ends. You can have up to one creature cursed by mark of blood at any one time. If you use this spell to mark a different creature, the curse afflicting the previous creature ends.\nCritical Success The creature is unaffected.\nSuccess The creature gains a softly glowing mark that resembles Achaekek's symbol somewhere on their body (such as the forehead or back of the hand). This mark can be by clothing, but is otherwise permanent until the curse is removed.\nFailure As success, but you can to attempt to know the direction and general distance (within a mile) to the marked creature if the creature is alive and both you and the creature are on the same plane of existence. When you Seek in this way, you attempt a Perception check against the marked creature's Will DC. On a success, you gain the information, which is accurate at the moment that you Seek. On a critical failure, the curse ends, and the creature's mark vanishes.\nCritical Failure As failure, but your Perception checks to Seek the marked creature are automatically successful.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'marvelous-mount-pf2e',
    name: 'Marvelous Mount',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure a Large fantastical creature to serve as a mount for the target. The mount is the target's minion, has a Speed of 40 feet, and can bear the target with any carried possessions. It can't carry any other creature. The mount uses the target's AC and saves, but it's destroyed if it takes more than 10 damage at one time, ending the spell.\nHeightened (3rd) The mount can walk on water, but it must end its turn on solid ground or sink.\nHeightened (4th) The mount has a Speed of 60 feet and can walk on water.\nHeightened (5th) The mount has a Speed of 60 feet and can walk on water. It also has a fly Speed of 60 feet, but it must end its turn on a surface or fall.\nHeightened (6th) The mount has a Speed and fly Speed of 80 feet.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'mental-map-pf2e',
    name: 'Mental Map',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 2,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You glean detailed information about a specific place visited by a creature directly from its mind, unless it fends you off with a Will save. The target can choose to fail the save.\nSuccess The target is unaffected.\nFailure You gain critical information about the place in question, granting you a +2 circumstance bonus to Survival checks while in the location and any skill checks to Recall Knowledge about the location for the next 24 hours.\nCritical Failure As failure, but you can erase all knowledge of the location from the target for 24 hours if desired.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'mist-pf2e',
    name: 'Mist',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
    concentration: false,
    ritual: false,
    description:
      'You call forth a cloud of mist. All creatures within the mist become , and all creatures outside the mist become concealed to creatures within it. You can Dismiss the cloud.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'noise-blast-pf2e',
    name: 'Noise Blast',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'A cacophonous noise blasts out, dealing 2d10 sonic damage. Each creature must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is for 1 round.\nCritical Failure The creature takes double damage, is deafened for 1 minute, and is Stunned 1.\nHeightened (+1) The damage increases by 1d10.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d10.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'oaken-resilience-pf2e',
    name: 'Oaken Resilience',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "The target's skin becomes tough, with a consistency like bark or wood. The target gains resistance 2 to bludgeoning and piercing damage and weakness 3 to fire. After the target takes fire damage, it can Dismiss the spell as a free action triggered by taking the damage; doing so doesn't reduce the fire damage the target was dealt.\nHeightened (+2) The resistances increase by 2, and the weakness increases by 3.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'one-with-plants-pf2e',
    name: 'One with Plants',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You can either transform into a plant or merge with plant matter. While transformed, you can't move or affect anything outside the plant, but you can cast spells as long as they don't require line of effect beyond the plant. You can Dismiss this spell.\n• Merge with Plants The spell's duration is 10 minutes. While casting the spell, you must touch a plant with enough volume to fit you and your possessions or the spell is disrupted. While merged, you can hear, but not see, what's going on outside the plant. If the plant takes damage while you're inside it, you're expelled from the plant and take 10d6 damage. Magic passage expels you without dealing damage. The spell ends if you're ever outside the plant.\n• Turn into a Plant The spell's duration is 8 hours. You become a Large plant—typically a tree. Perception checks don't reveal your true nature, but a successful Nature or Survival check against your spell DC reveals that you appear to be a plant that is strangely new to the area. While in this form, you can observe everything around you, using your normal senses. As a plant, your AC is 20, and only status bonuses, status penalties, circumstance bonuses, and circumstance penalties affect you. Any successes and critical successes you roll on Reflex saves are failures",
    classes: ['druid'],
  },
  {
    id: 'paranoia-pf2e',
    name: 'Paranoia',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      "You cause the target to see all other creatures as dire threats. The target is stricken by intense paranoia toward all creatures around it and must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target believes everyone it sees is a potential threat. It becomes to all creatures to which it wasn't already hostile, even those that were previously allies. It treats no one as an ally. The spell ends after 1 round.\nFailure As success, but the effect lasts 1 minute.\nCritical Failure As failure, except the target believes that everyone it sees is a mortal enemy. It uses its reactions and free actions against everyone, regardless of whether they were previously its allies, as determined by the GM. It otherwise acts as rationally as it normally does and likely prefers to attack creatures that are actively attacking or hindering it over those leaving it alone.\nHeightened (6th) You can target up to 5 creatures.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': 'Heightened (6th) You can target up to 5 creatures.',
      },
      summary: 'Heightened (6th) You can target up to 5 creatures.',
    },
    classes: ['bard'],
  },
  {
    id: 'peaceful-rest-pf2e',
    name: 'Peaceful Rest',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "The targeted corpse doesn't decay, nor can it be transformed into an undead. If the corpse is subject to a spell that requires the corpse to have died within a certain amount of time (for example, ), do not count the duration of peaceful rest against that time. This spell also prevents ordinary bugs and pests (such as maggots) from consuming the body.\nHeightened (5th) The spell's duration is unlimited, but the spell takes one more action to cast and requires a cost (embalming fluid worth 6 gp).",
    heightening: {
      mode: 'fixed',
      ranks: {
        '5': "Heightened (5th) The spell's duration is unlimited, but the spell takes one more action to cast and requires a cost (embalming fluid worth 6 gp).",
      },
      summary:
        "Heightened (5th) The spell's duration is unlimited, but the spell takes one more action to cast and requires a cost (embalming fluid worth 6 gp).",
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'penumbral-disguise-pf2e',
    name: 'Penumbral Disguise',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You wrap the target in shadows, granting it a +1 status bonus to Stealth checks to Hide while in dim light or darkness. In addition, the shadows mask the target's features. While the target is in dim light or darkness, other creatures must succeed at a action against the spell's DC to discern details about its appearance. For example, without using Seek, other creatures can determine the target's general shape (such as humanoid), but they must Seek to determine the target's precise appearance. Creatures with darkvision can still see the target and its features normally. The target's normal appearance is revealed in bright light.\nHeightened (4th) The status bonus is +2. Creatures with darkvision can no longer discern details about the target while the target is in dim light or darkness without Seeking, though creatures with greater darkvision can still determine these details.\nHeightened (6th) As 4th rank, except the status bonus is +3, and creatures without darkvision can't determine even general details about the target while the target is in dim light or darkness unless they successfully Seek the target; these creatures see a vague shadow instead. Even on a successful Seek, they only determine general features, though they can see details on a critical success.\nHeightened (8th) As 6th rank, except the status bonus is +4, and even creatures with greater darkvision must Seek to discern details about the target while the target is in dim light or darkness.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'phantasmal-treasure-pf2e',
    name: 'Phantasmal Treasure',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
    school: 'arcane',
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
      "A phantasmal image of the most precious thing imaginable to the target appears in a location of your choice within the spell's range. Only the spell's target can see the treasure, though you can see the vague shape of the treasure-be it a pile of items, a deific avatar, or a cherished loved one or hero. The target's response to the treasure is based on the outcome of the target's Will save.\nCritical Success The target is unaffected.\nSuccess The target becomes with the treasure, and the duration is until the end of its turn. The target can also try to disbelieve the illusion if it touches the treasure, Seeks to examine it, or speaks to it if the illusion appears to be a person or the like. If the target disbelieves the illusion, the spell ends.\nFailure As success, but the duration is 1 minute.\nCritical Failure As success, but the duration is 1 minute. The target finds the treasure so appealing that until the spell ends, it must spend each action focused on it. This can include moving toward the treasure if the target isn't next to it, and Interacting with the treasure if the target is next to it. (If the illusion appears to be a person or the like, the target can also Interact to converse with it.)",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'radiant-field-pf2e',
    name: 'Radiant Field',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You create an area of bright light. Creatures with that are by radiant field and remain in the area must attempt a Fortitude save at the start of their turns. On a failure, a creature remains blinded for 1 round; this is an incapacitation effect.\nThis spell also suppresses magical darkness of your radiant field spell's rank or lower.\nHeightened (4th) Creatures seen through the area are to creatures outside the area. Creatures with light blindness can continue to be blinded by the field as long as the field is visible, even when outside of the field.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'reapers-lantern-pf2e',
    name: "Reaper's Lantern",
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
      "You call forth a ghostly lantern that guides the living toward death and the undead toward true death. It sheds bright light in the spell's area and dim light to twice that area. The lantern is insubstantial and floats near you, suspended from an ephemeral, skeletal hand. Living creatures and undead in the area when you Cast the Spell, or that enter the area later, must attempt Fortitude saves. Living creatures that fail their Fortitude saves gain only half the normal benefit from healing effects while within the area. Undead targets that fail their Fortitude saves become Enfeebled 1 while within the area. Once a creature attempts a save against reaper's lantern, it uses the same outcome if it leaves the area and enters it again.\nOnce per turn, starting on the round after you cast reaper's lantern, you can Sustain the spell to increase the emanation's radius by 5 feet. When you do so, you force creatures in the area that haven't yet attempted a save against reaper's lantern to attempt one.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'revealing-light-pf2e',
    name: 'Revealing Light',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
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
      type: 'special',
      description: 'varies',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      'A wave of magical light washes over the area. You choose the appearance of the light, such as colorful, heatless flames or sparkling motes. A creature affected by revealing light is . If the creature was , it becomes instead. If the creature was already concealed for any other reason, it is no longer concealed.\nCritical Success The target is unaffected.\nSuccess The light affects the creature for 2 rounds.\nFailure The light affects the creature for 1 minute.\nCritical Failure The light affects the creature for 10 minutes.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'see-the-unseen-pf2e',
    name: 'See the Unseen',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      "Your gaze pierces through illusions and finds creatures and spirits. You can see invisible creatures as though they weren't invisible, although their features are blurred, making them and difficult to identify. You can also see incorporeal creatures, like ghosts, phased through an object from within 10 feet of an object's surface as blurry shapes seen through those objects. Subtler clues also grant you a +2 status bonus to checks you make to disbelieve illusions.\nHeightened (5th) This spell has a duration of 8 hours.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'shape-wood-pf2e',
    name: 'Shape Wood',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
    concentration: false,
    ritual: false,
    description:
      'You shape the wood into a rough shape of your choice. The shaping power is too crude to produce with intricate parts, fine details, moving pieces, or the like. You cannot use this spell to enhance the value of the wooden object you are shaping.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'share-life-pf2e',
    name: 'Share Life',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You forge a temporary link between the target's life essence and your own. The target takes half damage from all effects that deal Hit Point damage, and you take the remainder of the damage. When you take damage through this link, you don't apply any resistances, weaknesses, or other abilities you have to that damage; you simply take that amount of damage. The spell ends if the target is ever more than 30 feet away from you. If either you or the target is reduced to 0 Hit Points, any damage from this spell is resolved and then the spell ends.",
    classes: ['cleric'],
  },
  {
    id: 'silence-pf2e',
    name: 'Silence',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      "The target makes no sound, preventing creatures from noticing it using hearing alone. The target can't use sonic attacks, nor can it use actions with the auditory trait. This prevents it from casting spells due to the magical words involved in casting, with the exception of subtle spells.\nHeightened (4th) The spell creates an aura in a 10-foot emanation around the touched creature, silencing all sound in or passing through it. While within the aura, creatures are subject to the same effects as the target. Depending upon the position of the effect, a creature might notice the lack of sound reaching it (blocking off the noise coming from a party, for example).",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'slough-skin-pf2e',
    name: 'Slough Skin',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 2,
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
      "You continually and harmlessly slough off the top layer of your skin while new skin regenerates immediately, quickly moving damaging substances away from your body. The flat check to remove persistent damage from effects that coat your skin (such as most persistent acid damage) is reduced to 5, and you gain a +2 status bonus to your initial save against contact poison (but not to further saves since, by that point, the toxin has already entered your system).\nIf you're affected by an effect other than persistent damage that depends on continuous contact with your skin, and if that effect allows a saving throw, you receive a new saving throw against that effect at the end of each turn when you attempt your flat checks against persistent damage, and you also receive a +2 status bonus to those saving throws.\nWhile affected by this spell, your continually shedding skin makes you much easier to . Anyone Tracking you gains a +2 circumstance bonus to do so, and you can't Hide Your Tracks.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'sound-body-pf2e',
    name: 'Sound Body',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      "You send a surge of healing energy to restore the target's body. Attempt to counteract an effect of your choice imposing one of these conditions on the target: , , , , or . If you didn't counteract the effect, but you would have if its counteract rank were 2 lower, instead suppress the effect until the beginning of your next turn. The effect's duration doesn't elapse while it's suppressed.\nThis spell can't counteract or suppress curses, diseases, or conditions that are part of the target's normal state.\nHeightened (4th) Add and to the list of conditions.\nHeightened (8th) Add to the list of conditions.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'speak-with-animals-pf2e',
    name: 'Speak with Animals',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      "You can ask questions of, receive answers from, and use the Diplomacy skill with animals. The spell doesn't make them more friendly than normal. Cunning animals are likely to be terse and evasive, while less intelligent ones often make inane comments.",
    classes: ['druid'],
  },
  {
    id: 'spirit-sense-pf2e',
    name: 'Spirit Sense',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You open your mind to the metaphysical, enabling you to sense nearby spirits. Even if you aren't Searching, you get a check to find haunts and spirits in the area. You gain a +1 status bonus to the following checks regarding haunts or spirits: Perception checks to , attempts to Recall Knowledge, skill checks to determine the reason for their existence, and skill checks to disable a haunt. You also gain a +1 status bonus to AC and saving throws against haunts and spirits.\nHeightened (6th) The spell's duration lasts until the next time you make your daily preparations.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'spiritual-armament-pf2e',
    name: 'Spiritual Armament',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    attackRoll: true,
    concentration: true,
    ritual: false,
    description:
      "You create a ghostly, magical echo of one weapon you're wielding or wearing and fling it. Attempt a spell attack roll against the target's AC, dealing 2d8 damage on a hit (or double damage on a critical hit). The damage type is the same as the chosen weapon (or any of its types for a versatile weapon). The attack deals spirit damage instead if that would be more detrimental to the creature (as determined by the GM). This attack uses and contributes to your multiple attack penalty. After the attack, the weapon returns to your side. If you sanctify the spell, the attacks are sanctified as well. Each time you Sustain the spell, you can repeat the attack against any creature within 120 feet.\nHeightened (+2) The damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The damage increases by 1d8.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'stupefy-pf2e',
    name: 'Stupefy',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      "You dull the target's mind, depending on its Will save.\nCritical Success The target is unaffected.\nSuccess The target is Stupefied 1 until the start of your next turn.\nFailure The target is Stupefied 2 for 1 minute.\nCritical Failure The target is Stupefied 3 for 1 minute.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'sudden-blight-pf2e',
    name: 'Sudden Blight',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You accelerate the processes of decay in the area. Each living creature in the area takes 2d10 void damage with a basic Fortitude save. A creature afflicted by a disease takes a –2 circumstance penalty to this save. You can also direct the blight to rot all Small and Tiny non-creature plants in the area, eliminating non-magical undergrowth and any resulting difficult terrain, cover, and concealment. Sudden blight attempts to counteract any magical effect on the plants before withering them.\nHeightened (+1) The damage increases by 1d10.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d10.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'summon-elemental-pf2e',
    name: 'Summon Elemental',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      'You summon a creature that has the elemental trait and whose level is 1 or lower to fight for you.\nHeightened As listed in the summon trait.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'sure-footing-pf2e',
    name: 'Sure Footing',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      "You free the target's limbs from ailments that impede mobility. Attempt to counteract an effect of your choice imposing one of these conditions on the target: , , or . If you didn't counteract the effect, but you would have if its counteract rank were 2 lower, instead suppress the effect until the beginning of your next turn. The effect's duration doesn't elapse while it's suppressed.\nThis spell can't counteract or suppress curses, diseases, or conditions that are part of the target's normal state.\nHeightened (4th) Add , , and to the list of conditions.\nHeightened (6th) Add to the list of conditions.\nHeightened (8th) Add to the list of conditions.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'telekinetic-maneuver-pf2e',
    name: 'Telekinetic Maneuver',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'With a rush of telekinetic power, you move a foe or something they carry. You can attempt to , , , or the target using a spell attack roll instead of an Athletics check.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'the-parrots-whisper-pf2e',
    name: "The Parrot's Whisper",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 2,
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You call forth an echo of the gossiping parrot from the tale of the Witch and the Weaver to whisper the secrets of a creature you can see within range. The garrulous parrot is known to chatter on for some time while deciphering the information you seek. The target must attempt a Will saving throw.\nCritical Success The parrot chatters about various random topics for 1 round and reveals no relevant information.\nSuccess The parrot tells you the target's highest weakness at the start of your next turn. In the meantime, the parrot chatters about various random topics.\nFailure The parrot tells you the target's highest weakness immediately, but sticks around for 1 round to chatter.\nCritical Failure The parrot tells you the target's highest weakness immediately, and you can ask the parrot one question about the target creature. You might need to collaborate with the GM to narrow down the question. At the start of your next turn, the parrot answers the question truthfully.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'the-queens-rainbow-pf2e',
    name: "The Queen's Rainbow",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      "You tell the story of the Queen of Bees and her retinue trying to pass through a rainbow on their way to visit the King of Spiders. You conjure forth a large, transparent rainbow. Creatures who enter or begin their turn in the rainbow's space must succeed at a Fortitude saving throw or become for 1 round (or for 1 round on a critical failure).",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'translate-pf2e',
    name: 'Translate',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "The target can understand the meaning of a single language it is hearing or reading when you cast the spell. This doesn't let it understand codes, language couched in metaphor, and the like (subject to GM discretion). If the target can hear multiple languages and knows that, it can choose which language to understand; otherwise, choose one of the languages randomly.\nHeightened (3rd) The target can also speak the language.\nHeightened (4th) You can target up to 10 creatures, and targets can also speak the language.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'Heightened (3rd) The target can also speak the language. Heightened (4th) You can target up to 10 creatures, and targets can also speak the language.',
      },
      summary:
        'Heightened (3rd) The target can also speak the language. Heightened (4th) You can target up to 10 creatures, and targets can also speak the language.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'vomit-swarm-pf2e',
    name: 'Vomit Swarm',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 2,
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
      "You belch forth a swarm of magical vermin. You evoke and shape the creatures from your own imagination, allowing you to change the appearance of the creatures (typically a mix of centipedes, roaches, wasps, and worms), but this doesn't change the effect of the spell. The vermin swarm over anyone in the area, their bites and stings dealing 2d8 piercing damage (basic Reflex save). A creature that fails its saving throw also becomes Sickened 1. Once the spell ends, the swarm disappears.\nHeightened (+1) The damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'water-breathing-pf2e',
    name: 'Water Breathing',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The targets can breathe underwater.\nHeightened (3rd) The duration increases to 8 hours.\nHeightened (4th) The duration increases to until your next daily preparations.',
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'water-walk-pf2e',
    name: 'Water Walk',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 2,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "The target can walk on the surface of water and other liquids without falling through. It can go underwater if it wishes, but in that case it must Swim normally. This spell doesn't grant the ability to breathe underwater.\nHeightened (4th) The spell's range increases to 30 feet, the duration increases to 1 hour, and you can target up to 10 creatures.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': "Heightened (4th) The spell's range increases to 30 feet, the duration increases to 1 hour, and you can target up to 10 creatures.",
      },
      summary:
        "Heightened (4th) The spell's range increases to 30 feet, the duration increases to 1 hour, and you can target up to 10 creatures.",
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
]);
