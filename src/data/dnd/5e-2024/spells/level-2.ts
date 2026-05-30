import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 2 Spells - SRD 5.2
export const level2Spells: Spell[] = [
  {
    id: 'acid-arrow',
    name: 'Acid Arrow',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 4,
        die: 'd4',
        notation: '4d4',
      },
      type: 'acid',
    },
    concentration: false,
    ritual: false,
    description:
      'A shimmering green arrow streaks toward a target within range. Make a ranged spell attack against the target. On a hit, the target takes 4d4 Acid damage immediately and 2d4 Acid damage at the end of its next turn.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, the damage increases by 1d4 for each slot level above 2.',
    classes: ['wizard'],
  },
  {
    id: 'aid',
    name: 'Aid',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'abjuration',
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
      materialDescription: 'a strip of white cloth',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "Choose up to three creatures within range. Each target's Hit Point maximum and current Hit Points increase by 5 for the duration.",
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, the bonus increases by 5 for each slot level above 2.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'alter-self',
    name: 'Alter Self',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'You assume a different form. When you cast the spell, choose Aquatic Adaptation, Change Appearance, or Natural Weapons.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'animal-messenger',
    name: 'Animal Messenger',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
    concentration: false,
    ritual: true,
    description:
      'By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description. You also speak a message of up to twenty-five words.',
    classes: ['bard', 'druid', 'ranger'],
  },
  {
    id: 'arcane-lock',
    name: 'Arcane Lock',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'gold dust worth at least 25 gp, which the spell consumes',
      materialCost: 25,
      materialConsumed: true,
    },
    duration: {
      type: 'permanent',
    },
    target: '1 closed door, window, gate, chest, or other entryway you touch',
    concentration: false,
    ritual: false,
    description:
      'You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. You and the creatures you designate when you cast this spell can open the object normally. You can also set a password that, when spoken within 5 feet of the object, suppresses this spell for 1 minute. Otherwise, it is impassable until it is broken or the spell is dispelled or suppressed. Casting knock on the object suppresses arcane lock for 10 minutes.',
    classes: ['wizard'],
  },
  {
    id: 'augury',
    name: 'Augury',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'divination',
    castingTime: {
      type: 'minute',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'specially marked sticks, bones, or similar tokens worth at least 25 gp',
      materialCost: 25,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: true,
    description:
      "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens: Weal, for good results; Woe, for bad results; Weal and woe, for both good and bad results; Nothing, for results that aren't especially good or bad.",
    classes: ['cleric'],
  },
  {
    id: 'barkskin',
    name: 'Barkskin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: true,
      materialDescription: 'a handful of bark',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    target: '1 willing creature you touch',
    concentration: false,
    ritual: false,
    description:
      "You touch a willing creature. Until the spell ends, the target's skin takes on a rough, bark-like appearance, and the target's AC can't be less than 17, regardless of armor worn.",
    classes: ['druid', 'ranger'],
  },
  {
    id: 'blindness-deafness',
    name: 'Blindness/Deafness',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'transmutation',
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
      somatic: false,
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
    concentration: false,
    ritual: false,
    description:
      'One creature that you can see within range must make a Constitution saving throw. On a failed save, the target has the Blinded or Deafened condition (your choice) for the duration. At the end of each of its turns, the target repeats the save, ending the spell on itself on a success.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, you can target one additional creature for each slot level above 2.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'blur',
    name: 'Blur',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      'Your body becomes blurred. For the duration, any creature has Disadvantage on attack rolls against you. An attacker is immune to this effect if it perceives you with Blindsight or Truesight.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'calm-emotions',
    name: 'Calm Emotions',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You attempt to suppress strong emotions. Each Humanoid in a 20-foot-radius Sphere centered on a point you choose must make a Charisma saving throw. You can suppress Charmed/Frightened conditions or make targets Indifferent.',
    classes: ['bard', 'cleric'],
  },
  {
    id: 'continual-flame',
    name: 'Continual Flame',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: true,
      materialDescription: 'ruby dust worth 50 gp',
      materialCost: 50,
      materialConsumed: true,
    },
    duration: {
      type: 'permanent',
    },
    target: '1 object you touch',
    concentration: false,
    ritual: false,
    description:
      "A flame springs forth from an object that you touch. The effect looks like a regular flame, but it creates no heat and doesn't use oxygen. A continual flame can be covered or hidden but not smothered or quenched.",
    classes: ['cleric', 'druid', 'wizard'],
  },
  {
    id: 'crown-of-madness',
    name: 'Crown of Madness',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'enchantment',
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
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'One humanoid of your choice that you can see within range must succeed on a Wisdom saving throw or become charmed by you for the duration. While the target is charmed in this way, a twisted crown of jagged iron appears on its head, and a madness glows in its eyes. The charmed target must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'darkness',
    name: 'Darkness',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'bat fur and a piece of coal',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 15,
    },
    concentration: true,
    ritual: false,
    description:
      "Magical Darkness spreads from a point you choose within range to fill a 15-foot-radius Sphere for the duration. Darkvision can't see through it, and nonmagical light can't illuminate it.",
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'darkvision',
    name: 'Darkvision',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a dried carrot',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    target: '1 willing creature you touch',
    concentration: false,
    ritual: false,
    description:
      'You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has Darkvision with a range of 150 feet.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'detect-thoughts',
    name: 'Detect Thoughts',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a copper piece',
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
      'For the duration, you can sense the presence and location of any creature within 30 feet of you that has Intelligence 4 or higher. You can focus your mind on one creature to learn its surface thoughts.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'enhance-ability',
    name: 'Enhance Ability',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'fur or feather',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    target: '1 creature you touch',
    concentration: true,
    ritual: false,
    description:
      'You touch a creature and choose Strength, Dexterity, Constitution, Intelligence, Wisdom, or Charisma. For the duration, the target has Advantage on ability checks using that ability.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, you can target one additional creature for each slot level above 2.',
    classes: ['bard', 'cleric', 'druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'enlarge-reduce',
    name: 'Enlarge/Reduce',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a pinch of powdered iron',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose Enlarge or Reduce.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'find-traps',
    name: 'Find Traps',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'divination',
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
      'You sense the presence of any trap within range that is within line of sight. A trap, for the purpose of this spell, includes anything that would inflict a sudden or unexpected effect you consider harmful or undesirable, which was specifically intended as such by its creator. Thus, the spell would sense an area affected by the alarm spell, a glyph of warding, or a mechanical pit trap, but it would not reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole.',
    classes: ['cleric', 'druid', 'ranger'],
  },
  {
    id: 'flame-blade',
    name: 'Flame Blade',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      somatic: true,
      material: true,
      materialDescription: 'sumac leaf',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    attackRoll: true,
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
      'You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. You can use your action to make a melee spell attack, dealing 3d6 Fire damage on a hit.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d6 for every 2 slot levels above 2.',
    classes: ['druid', 'sorcerer'],
  },
  {
    id: 'flaming-sphere',
    name: 'Flaming Sphere',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a ball of wax',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 2,
        die: 'd6',
        notation: '2d6',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      'A 5-foot-diameter sphere of fire appears in an unoccupied space. Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw, taking 2d6 Fire damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, the damage increases by 1d6 for each slot level above 2.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'gentle-repose',
    name: 'Gentle Repose',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: true,
      materialDescription: 'a pinch of salt',
    },
    duration: {
      type: 'special',
      description: '10 days',
    },
    target: '1 corpse or other remains you touch',
    concentration: false,
    ritual: true,
    description:
      "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become Undead. The spell also extends the time limit on raising the target from the dead.",
    classes: ['cleric', 'paladin', 'wizard'],
  },
  {
    id: 'gust-of-wind',
    name: 'Gust of Wind',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: true,
      materialDescription: 'a legume seed',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'line',
      length: 60,
      width: 10,
    },
    savingThrow: {
      attribute: 'str',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'heat-metal',
    name: 'Heat Metal',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'transmutation',
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
      materialDescription: 'a piece of iron and a flame',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    damage: {
      base: {
        count: 2,
        die: 'd8',
        notation: '2d8',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      "Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again. If a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn't drop the object, it has disadvantage on attack rolls and ability checks until the start of your next turn.",
    atHigherLevels:
      'When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.',
    classes: ['bard', 'druid'],
  },
  {
    id: 'hold-person',
    name: 'Hold Person',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a straight piece of iron',
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
      'Choose a Humanoid that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration. At the end of each of its turns, the target repeats the save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, you can target one additional Humanoid for each slot level above 2.',
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'invisibility',
    name: 'Invisibility',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'an eyelash in gum arabic',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    target: '1 creature you touch',
    concentration: true,
    ritual: false,
    description:
      "A creature you touch has the Invisible condition until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, you can target one additional creature for each slot level above 2.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'knock',
    name: 'Knock',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'transmutation',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked. If you choose a target that is held shut with arcane lock, that spell is suppressed for 10 minutes, during which time the target can be opened and shut normally.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'lesser-restoration',
    name: 'Lesser Restoration',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'abjuration',
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
      type: 'instant',
    },
    target: '1 creature you touch',
    concentration: false,
    ritual: false,
    description:
      'You touch a creature and end one condition on it: Blinded, Deafened, Paralyzed, or Poisoned.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'levitate',
    name: 'Levitate',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'transmutation',
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
      materialDescription: 'a leather loop',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'One creature or object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. An unwilling creature that succeeds on a Constitution saving throw is unaffected.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'locate-animals-or-plants',
    name: 'Locate Animals or Plants',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a bit of fur from a bloodhound',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: true,
    description:
      'Describe or name a specific kind of beast or plant. Concentrating on the voice of nature in your surroundings, you learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.',
    classes: ['bard', 'druid', 'ranger'],
  },
  {
    id: 'locate-object',
    name: 'Locate Object',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a forked twig',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      "Describe or name an object that is familiar to you. You sense the direction to the object's location as long as that object is within 1,000 feet of you.",
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'wizard'],
  },
  {
    id: 'magic-mouth',
    name: 'Magic Mouth',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'illusion',
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
      materialDescription:
        'a small bit of honeycomb and jade dust worth at least 10 gp, which the spell consumes',
      materialCost: 10,
      materialConsumed: true,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: true,
    description:
      "You implant a message within an object in range, a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn't being worn or carried by another creature. Then speak the message, which must be 25 words or less, though it can be delivered over as long as 10 minutes. Finally, determine the circumstance that will trigger the spell to deliver your message.",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'magic-weapon',
    name: 'Magic Weapon',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      type: 'hours',
      hours: 1,
    },
    target: '1 nonmagical weapon you touch',
    concentration: false,
    ritual: false,
    description:
      'You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the bonus increases to +2. With a level 6 or higher slot, the bonus increases to +3.',
    classes: ['paladin', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'mirror-image',
    name: 'Mirror Image',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real.",
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'misty-step',
    name: 'Misty Step',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'conjuration',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'pass-without-trace',
    name: 'Pass without Trace',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'ashes from burned mistletoe',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'A veil of shadow and silence radiates from you, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you has a +10 bonus to Dexterity (Stealth) checks.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'prayer-of-healing',
    name: 'Prayer of Healing',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'abjuration',
    castingTime: {
      type: 'minute',
      amount: 10,
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
    healing: {
      count: 2,
      die: 'd8',
      modifier: 0,
      notation: '2d8',
    },
    concentration: false,
    ritual: false,
    description:
      'Up to five creatures of your choice that are within range at the end of the casting each regain Hit Points equal to 2d8 plus your spellcasting ability modifier.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, the healing increases by 1d8 for each slot level above 2.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'protection-from-poison',
    name: 'Protection from Poison',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    target: '1 creature you touch',
    concentration: false,
    ritual: false,
    description:
      'You touch a creature and end the Poisoned condition on it. For the duration, the target has Advantage on saving throws against being poisoned and has Resistance to Poison damage.',
    classes: ['cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'rope-trick',
    name: 'Rope Trick',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'powdered corn extract and a twisted loop of parchment',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a length of rope that is up to 60 feet long. One end of the rope then rises into the air until the whole rope hangs perpendicular to the ground. At the upper end of the rope, an invisible entrance opens to an extradimensional space that lasts until the spell ends. The extradimensional space can be reached by climbing to the top of the rope. The space can hold as many as eight Medium or smaller creatures. The rope can be pulled into the space, making the rope disappear from view outside the space. Attacks and spells can't cross through the entrance into or out of the extradimensional space, but those inside can see out of it as if through a 3-foot-by-5-foot window centered on the rope. Anything inside the extradimensional space drops out when the spell ends.",
    classes: ['wizard'],
  },
  {
    id: 'scorching-ray',
    name: 'Scorching Ray',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
    attackRoll: true,
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
      'You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 Fire damage.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, you create one additional ray for each slot level above 2.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'see-invisibility',
    name: 'See Invisibility',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a pinch of talc',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'For the duration, you see creatures and objects that have the Invisible condition as if they were visible, and you can see into the Ethereal Plane.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'shatter',
    name: 'Shatter',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a chip of mica',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 3,
        die: 'd8',
        notation: '3d8',
      },
      type: 'thunder',
    },
    concentration: false,
    ritual: false,
    description:
      'A sudden loud ringing noise, painfully intense, erupts from a point of your choice within range. Each creature in a 10-foot-radius Sphere centered on that point must make a Constitution saving throw, taking 3d8 Thunder damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 3 or higher, the damage increases by 1d8 for each slot level above 2.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'silence',
    name: 'Silence',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'illusion',
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
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    concentration: true,
    ritual: true,
    description:
      'For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.',
    classes: ['bard', 'cleric', 'ranger'],
  },
  {
    id: 'spider-climb',
    name: 'Spider Climb',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a drop of bitumen',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    target: '1 willing creature you touch',
    concentration: true,
    ritual: false,
    description:
      'Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a Climbing Speed equal to its walking Speed.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'spiritual-weapon',
    name: 'Spiritual Weapon',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
    school: 'evocation',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd8',
        notation: '1d8',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier. As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd.',
    classes: ['cleric'],
  },
  {
    id: 'suggestion',
    name: 'Suggestion',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      somatic: false,
      material: true,
      materialDescription: 'a drop of honey',
    },
    duration: {
      type: 'concentration',
      maxDuration: '8 hours',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You suggest a course of activity (limited to a sentence or two) and magically influence a creature you can see within range that can hear and understand you. The suggestion must be worded in such a manner as to make the course of action sound reasonable.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'web',
    name: 'Web',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      materialDescription: 'a bit of spiderweb',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
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
      "You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area. If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet. Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'find-steed',
    name: 'Find Steed',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You summon an otherworldly steed that appears in an unoccupied space of your choice within range. The steed uses a spirit form tied to the spell and remains with you until it drops to 0 hit points or you dismiss it.',
    classes: ['paladin'],
  },
  {
    id: 'zone-of-truth',
    name: 'Zone of Truth',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 2,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 15,
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      "You create a magical zone that guards against deception in a 15-foot-radius sphere centered on a point within range. A creature that enters the area for the first time on a turn or starts its turn there must make a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius, and you know whether each creature succeeds or fails.",
    classes: ['bard', 'cleric', 'paladin'],
  },
];
