import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 1 Spells - SRD 5.2
export const level1Spells: Spell[] = [
  {
    id: 'alarm',
    name: 'Alarm',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'abjuration',
    castingTime: {
      type: 'minute',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a bell and silver wire',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: true,
    description:
      'You set an alarm against intrusion. Choose a door, window, or an area within range no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area.',
    classes: ['ranger', 'wizard'],
  },
  {
    id: 'animal-friendship',
    name: 'Animal Friendship',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      material: true,
      materialDescription: 'a morsel of food',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spell ends.",
    atHigherLevels:
      'When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.',
    classes: ['bard', 'druid', 'ranger'],
  },
  {
    id: 'armor-of-agathys',
    name: 'Armor of Agathys',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'abjuration',
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
      material: true,
      materialDescription: 'a cup of water',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st.',
    classes: ['warlock'],
  },
  {
    id: 'bane',
    name: 'Bane',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      material: true,
      materialDescription: 'a drop of blood',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.',
    classes: ['bard', 'cleric'],
  },
  {
    id: 'bless',
    name: 'Bless',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      material: true,
      materialDescription: 'a sprinkling of holy water',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you can target one additional creature for each slot level above 1.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'burning-hands',
    name: 'Burning Hands',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
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
    areaOfEffect: {
      type: 'cone',
      feet: 15,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 3,
        die: 'd6',
        notation: '3d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth. Each creature in a 15-foot Cone makes a Dexterity saving throw, taking 3d6 Fire damage on a failed save, or half as much on a successful one.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the damage increases by 1d6 for each slot level above 1.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'cause-fear',
    name: 'Cause Fear',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'necromancy',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "You awaken the sense of mortality in one creature you can see within range that is not undead. A finite creature has 1 minute to make a Wisdom saving throw or become frightened of you until the spell ends. The frightened creature's speed is halved, and it can't move closer to you. On each of the creature's turns before the spell ends, it can make another Wisdom saving throw, ending the spell on itself on a success.",
    classes: ['warlock'],
  },
  {
    id: 'charm-person',
    name: 'Charm Person',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      'You attempt to charm a Humanoid you can see within range. It must make a Wisdom saving throw, and does so with Advantage if you or your companions are fighting it. If it fails, it has the Charmed condition until the spell ends or until you or your companions do anything harmful to it.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you can target one additional creature for each slot level above 1.',
    classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'chromatic-orb',
    name: 'Chromatic Orb',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 90,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a diamond worth at least 50 gp',
    },
    duration: {
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 3,
        die: 'd8',
        notation: '3d8',
      },
      type: 'acid',
    },
    concentration: false,
    ritual: false,
    description:
      'You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose what type of energy the sphere is; it is either acid, cold, fire, lightning, poison, or thunder. Make a ranged spell attack against the target. On a hit, the creature takes 3d8 damage of the type you chose.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'color-spray',
    name: 'Color Spray',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'illusion',
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
      material: true,
      materialDescription: 'a pinch of colorful sand',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cone',
      feet: 15,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'A dazzling array of flashing, colored light springs from your hand. Each creature in a 15-foot Cone must succeed on a Constitution saving throw or have the Blinded condition until the end of your next turn.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'command',
    name: 'Command',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      somatic: false,
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
    concentration: false,
    ritual: false,
    description:
      "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it. Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.",
    atHigherLevels:
      'When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'comprehend-languages',
    name: 'Comprehend Languages',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'divination',
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
      material: true,
      materialDescription: 'soot and salt',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: true,
    description:
      'For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'create-or-destroy-water',
    name: 'Create or Destroy Water',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'transmutation',
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
      material: true,
      materialDescription:
        'a drop of water if creating water or a few grains of sand if destroying it',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You either create or destroy water. Create Water: You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range. Destroy Water: You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'cure-wounds',
    name: 'Cure Wounds',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    healing: {
      count: 1,
      die: 'd8',
      notation: '1d8',
    },
    concentration: false,
    ritual: false,
    description:
      'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the healing increases by 1d8 for each slot level above 1.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'detect-magic',
    name: 'Detect Magic',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'divination',
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
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: true,
    description:
      'For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'detect-poison-and-disease',
    name: 'Detect Poison and Disease',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'divination',
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
      material: true,
      materialDescription: 'a yew leaf',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: true,
    description:
      'For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You identify the type of poison, poisonous creature, or disease in each case.',
    classes: ['cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'disguise-self',
    name: 'Disguise Self',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'illusion',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends or until you use your action to dismiss it. You can seem up to 1 foot shorter or taller and can appear thin, fat, or in between.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'divine-favor',
    name: 'Divine Favor',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'transmutation',
    castingTime: {
      type: 'bonus-action',
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
    description: 'Until the spell ends, your attacks deal an extra 1d4 Radiant damage on a hit.',
    classes: ['paladin'],
  },
  {
    id: 'entangle',
    name: 'Entangle',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 90,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 20,
    },
    savingThrow: {
      attribute: 'str',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends.',
    classes: ['druid'],
  },
  {
    id: 'expeditious-retreat',
    name: 'Expeditious Retreat',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'transmutation',
    castingTime: {
      type: 'bonus-action',
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
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'This spell allows you to move at an incredible pace. When you cast this spell and as a Bonus Action on each of your subsequent turns until the spell ends, you can take the Dash action.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'faerie-fire',
    name: 'Faerie Fire',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'Objects in a 20-foot Cube within range are outlined in blue, green, or violet light. Each creature in the Cube is also outlined if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed Dim Light in a 10-foot radius. Attack rolls against affected creatures have Advantage.',
    classes: ['bard', 'druid'],
  },
  {
    id: 'false-life',
    name: 'False Life',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'necromancy',
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
      material: true,
      materialDescription: 'a drop of alcohol',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Bolstering yourself with a necromantic facsimile of life, you gain 2d4 + 4 Temporary Hit Points.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you gain 5 additional Temporary Hit Points for each slot level above 1.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'feather-fall',
    name: 'Feather Fall',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'transmutation',
    castingTime: {
      type: 'reaction',
      amount: 1,
      condition: 'when you or a creature within 60 feet of you falls',
    },
    range: {
      type: 'ranged',
      feet: 60,
    },
    components: {
      verbal: true,
      somatic: false,
      material: true,
      materialDescription: 'a feather',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage, and the spell ends for that creature.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'fog-cloud',
    name: 'Fog Cloud',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'conjuration',
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
      type: 'concentration',
      maxDuration: '1 hour',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    concentration: true,
    ritual: false,
    description:
      'You create a 20-foot-radius Sphere of fog centered on a point within range. The Sphere is Heavily Obscured. It lasts for the duration or until a strong wind disperses it.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the radius increases by 20 feet for each slot level above 1.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'goodberry',
    name: 'Goodberry',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'conjuration',
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
      materialDescription: 'a sprig of mistletoe',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Up to ten berries appear in your hand. A creature can use a Bonus Action to eat one berry. Eating a berry restores 1 Hit Point, and the berry provides enough nourishment to sustain a creature for one day. The berries lose their potency after 24 hours.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'grease',
    name: 'Grease',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'conjuration',
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
      material: true,
      materialDescription: 'a bit of pork rind or butter',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into Difficult Terrain. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or have the Prone condition.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'guiding-bolt',
    name: 'Guiding Bolt',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    attackRoll: true,
    damage: {
      base: {
        count: 4,
        die: 'd6',
        notation: '4d6',
      },
      type: 'radiant',
    },
    concentration: false,
    ritual: false,
    description:
      'A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack. On a hit, the target takes 4d6 Radiant damage, and the next attack roll made against it before the end of your next turn has Advantage.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the damage increases by 1d6 for each slot level above 1.',
    classes: ['cleric'],
  },
  {
    id: 'healing-word',
    name: 'Healing Word',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'abjuration',
    castingTime: {
      type: 'bonus-action',
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
    healing: {
      count: 2,
      die: 'd4',
      modifier: 0,
      notation: '2d4',
    },
    concentration: false,
    ritual: false,
    description:
      'A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the healing increases by 2d4 for each slot level above 1.',
    classes: ['bard', 'cleric', 'druid'],
  },
  {
    id: 'heroism',
    name: 'Heroism',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to the Frightened condition and gains Temporary Hit Points equal to your spellcasting ability modifier at the start of each of its turns.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you can target one additional creature for each slot level above 1.',
    classes: ['bard', 'paladin'],
  },
  {
    id: 'hex',
    name: 'Hex',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
    castingTime: {
      type: 'bonus-action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 90,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'the petrified eye of a newt',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 Necrotic damage to the target whenever you hit it with an attack. Also, choose one ability. The target has Disadvantage on ability checks made with that ability.',
    atHigherLevels:
      'When you cast this spell using a level 3-4 spell slot, you can maintain Concentration for up to 8 hours. With a level 5+ slot, you can maintain Concentration for up to 24 hours.',
    classes: ['warlock'],
  },
  {
    id: 'hunters-mark',
    name: "Hunter's Mark",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'divination',
    castingTime: {
      type: 'bonus-action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 90,
    },
    components: {
      verbal: true,
      somatic: false,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'You choose a creature you can see within range and mystically mark it as your quarry. Until the spell ends, you deal an extra 1d6 damage to the target whenever you hit it with a weapon attack, and you have advantage on any Wisdom (Perception) or Wisdom (Survival) check you make to find it. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.',
    classes: ['ranger'],
  },
  {
    id: 'identify',
    name: 'Identify',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'divination',
    castingTime: {
      type: 'minute',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a pearl worth at least 100 gp',
      materialCost: 100,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: true,
    description:
      'You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires Attunement to use, and how many charges it has.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'inflict-wounds',
    name: 'Inflict Wounds',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
        count: 2,
        die: 'd10',
        notation: '2d10',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'A creature you touch makes a Constitution saving throw, taking 2d10 Necrotic damage on a failed save or half as much damage on a successful one.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the damage increases by 1d10 for each slot level above 1.',
    classes: ['cleric'],
  },
  {
    id: 'jump',
    name: 'Jump',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'transmutation',
    castingTime: {
      type: 'bonus-action',
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
      'You touch a willing creature. Once on each of its turns until the spell ends, that creature can jump up to 30 feet by spending 10 feet of movement.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'longstrider',
    name: 'Longstrider',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      materialDescription: 'a pinch of dirt',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a creature. The target's Speed increases by 10 feet until the spell ends.",
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you can target one additional creature for each slot level above 1.',
    classes: ['bard', 'druid', 'ranger', 'wizard'],
  },
  {
    id: 'mage-armor',
    name: 'Mage Armor',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      materialDescription: 'a piece of cured leather',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a willing creature who isn't wearing armor. Until the spell ends, the target's base AC becomes 13 + its Dexterity modifier. The spell ends early if the target dons armor or if you dismiss the spell.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'magic-missile',
    name: 'Magic Missile',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    damage: {
      base: {
        count: 1,
        die: 'd4',
        modifier: 1,
        notation: '1d4+1',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 Force damage to its target. The darts all strike simultaneously.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the spell creates one more dart for each slot level above 1.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'protection-from-evil-and-good',
    name: 'Protection from Evil and Good',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
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
      materialDescription: 'holy water or silver/iron powder',
      materialConsumed: true,
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'Until the spell ends, one willing creature you touch is protected against certain creatures: Aberrations, Celestials, Elementals, Fey, Fiends, and Undead. The protection grants several benefits against those creature types.',
    classes: ['cleric', 'druid', 'paladin', 'warlock', 'wizard'],
  },
  {
    id: 'purify-food-and-drink',
    name: 'Purify Food and Drink',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
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
    ritual: true,
    description:
      'All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.',
    classes: ['cleric', 'druid', 'paladin'],
  },
  {
    id: 'ray-of-sickness',
    name: 'Ray of Sickness',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'necromancy',
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
    target: '1 creature within range',
    attackRoll: true,
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText:
      'On a hit, the target makes a Constitution saving throw to avoid the Poisoned condition.',
    damage: {
      base: {
        count: 2,
        die: 'd8',
        notation: '2d8',
      },
      type: 'poison',
    },
    concentration: false,
    ritual: false,
    description:
      'A ray of sickening greenish energy springs from your fingertip toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 poison damage and must make a Constitution saving throw. On a failed save, it is poisoned until the end of your next turn.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'abjuration',
    castingTime: {
      type: 'bonus-action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a small silver mirror',
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
    description:
      'You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell.',
    classes: ['cleric'],
  },
  {
    id: 'shield',
    name: 'Shield',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'abjuration',
    castingTime: {
      type: 'reaction',
      amount: 1,
      condition: 'when you are hit by an attack roll or targeted by Magic Missile',
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
      'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'shield-of-faith',
    name: 'Shield of Faith',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'abjuration',
    castingTime: {
      type: 'bonus-action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 60,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a parchment with holy text',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'silent-image',
    name: 'Silent Image',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'illusion',
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
      material: true,
      materialDescription: 'a bit of fleece',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 15,
    },
    concentration: true,
    ritual: false,
    description:
      'You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot Cube. The image appears at a spot within range and lasts for the duration. The image is purely visual.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'sleep',
    name: 'Sleep',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      material: true,
      materialDescription: 'a pinch of fine sand, rose petals, or a cricket',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'Each creature of your choice within 5 feet of a point you choose must succeed on a Wisdom saving throw or have the Incapacitated condition until the spell ends, the sleeper takes damage, or someone uses an action to wake it.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, you can target one additional creature for each slot level above 1.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'speak-with-animals',
    name: 'Speak with Animals',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'divination',
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
      minutes: 10,
    },
    concentration: false,
    ritual: true,
    description:
      'You gain the ability to comprehend and verbally communicate with Beasts for the duration. The knowledge and awareness of many Beasts is limited by their intelligence, but at minimum, they can give you information about nearby locations and monsters.',
    classes: ['bard', 'druid', 'ranger'],
  },
  {
    id: 'tashas-hideous-laughter',
    name: "Tasha's Hideous Laughter",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'enchantment',
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
      material: true,
      materialDescription: 'tiny tarts and a feather that is waved in the air',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn't affected. At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it's triggered by damage. On a success, the spell ends.",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'tensers-floating-disk',
    name: "Tenser's Floating Disk",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'conjuration',
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
      material: true,
      materialDescription: 'a drop of mercury',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: true,
    description:
      'You create a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration. It can hold up to 500 pounds. If you move more than 100 feet away from the disk, the spell ends.',
    classes: ['wizard'],
  },
  {
    id: 'thunderwave',
    name: 'Thunderwave',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
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
    areaOfEffect: {
      type: 'cube',
      feet: 15,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 2,
        die: 'd8',
        notation: '2d8',
      },
      type: 'thunder',
    },
    concentration: false,
    ritual: false,
    description:
      'A wave of thunderous force sweeps out from you. Each creature in a 15-foot Cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 Thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the damage increases by 1d8 for each slot level above 1.',
    classes: ['bard', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'unseen-servant',
    name: 'Unseen Servant',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'conjuration',
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
      material: true,
      materialDescription: 'a piece of string and a bit of wood',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: true,
    description:
      "This spell creates an invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can't attack. If it drops to 0 hit points, the spell ends. Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine.",
    classes: ['bard', 'warlock', 'wizard'],
  },
  {
    id: 'witch-bolt',
    name: 'Witch Bolt',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
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
      material: true,
      materialDescription: 'a twig struck by lightning',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 2,
        die: 'd12',
        notation: '2d12',
      },
      type: 'lightning',
    },
    concentration: true,
    ritual: false,
    description:
      'A beam of crackling energy lances toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack. On a hit, the target takes 2d12 Lightning damage. On each of your subsequent turns, you can use your action to deal 1d12 Lightning damage automatically.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the initial damage increases by 1d12 for each slot level above 1.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'wrathful-smite',
    name: 'Wrathful Smite',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
    castingTime: {
      type: 'bonus-action',
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "The next time you hit with a melee weapon attack during this spell's duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you until the spell ends. As an action, the creature can make a Wisdom check against your spell save DC to steel its resolve and end this spell.",
    classes: ['paladin'],
  },
  {
    id: 'divine-smite',
    name: 'Divine Smite',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 1,
    school: 'evocation',
    castingTime: {
      type: 'bonus-action',
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'The next time you hit a target with a melee weapon or an unarmed strike before the spell ends, your attack deals an extra 2d8 Radiant damage. If the target is a Fiend or Undead, the attack deals an extra 1d8 Radiant damage to it.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 2 or higher, the damage increases by 1d8 for each slot level above 1.',
    classes: ['paladin'],
  },
];
