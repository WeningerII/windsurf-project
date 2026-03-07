import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 4 Spells - SRD 5.2
export const level4Spells: Spell[] = [
  {
    id: 'arcane-eye',
    name: 'Arcane Eye',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'divination',
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
      materialDescription: 'a bit of bat fur',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and Darkvision with a range of 30 feet.',
    classes: ['wizard'],
  },
  {
    id: 'banishment',
    name: 'Banishment',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'abjuration',
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
      materialDescription: 'an item distasteful to the target',
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
      'You attempt to send one creature that you can see within range to another plane of existence. The target must succeed on a Charisma saving throw or be banished.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, you can target one additional creature for each slot level above 4.',
    classes: ['cleric', 'paladin', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'blight',
    name: 'Blight',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'necromancy',
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
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 8,
        die: 'd8',
        notation: '8d8',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'Necromantic energy washes over a creature of your choice that you can see within range, draining moisture and vitality from it. The target must make a Constitution saving throw, taking 8d8 Necrotic damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, the damage increases by 1d8 for each slot level above 4.',
    classes: ['druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'confusion',
    name: 'Confusion',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'enchantment',
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
      materialDescription: 'three nut shells',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "This spell assaults and twists creatures' minds, spawning delusions and provoking uncontrolled action. Each creature in a 10-foot-radius Sphere centered on a point you choose must succeed on a Wisdom saving throw or be affected.",
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, the radius increases by 5 feet for each slot level above 4.',
    classes: ['bard', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'conjure-minor-elementals',
    name: 'Conjure Minor Elementals',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'conjuration',
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
    ritual: false,
    description:
      'You conjure spirits that flit around you in a 15-foot Emanation. Until the spell ends, any attack you make deals an extra 2d8 damage. You can choose Acid, Cold, Fire, or Lightning for the damage type.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, the damage increases by 2d8 for each slot level above 4.',
    classes: ['druid', 'wizard'],
  },
  {
    id: 'conjure-woodland-beings',
    name: 'Conjure Woodland Beings',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'You summon fey creatures that appear in unoccupied spaces you can see within range. Choose from the following options for what appears: One creature of challenge rating 2 or lower, or two creatures of challenge rating 1 or lower, or four creatures of challenge rating 1/4 or lower, or eight creatures of challenge rating 1/8 or lower.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'control-water',
    name: 'Control Water',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 300,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a drop of water and a pinch of dust',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 100,
    },
    concentration: true,
    ritual: false,
    description:
      'Until the spell ends, you control any freestanding water inside an area you choose that is a 100-foot Cube. Choose one of several effects when you cast the spell.',
    classes: ['cleric', 'druid', 'wizard'],
  },
  {
    id: 'death-ward',
    name: 'Death Ward',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 Hit Points as a result of taking damage, the target instead drops to 1 Hit Point, and the spell ends.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'dimension-door',
    name: 'Dimension Door',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 500,
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
      'You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. You can bring along objects and one willing creature of your size or smaller.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'divination',
    name: 'Divination',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'incense and offering worth 25 gp',
      materialCost: 25,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: true,
    description:
      "Your magic and an offering put you in contact with a god or a god's servants. You ask a single question concerning a specific goal, event, or activity to occur within 7 days.",
    classes: ['cleric', 'druid', 'wizard'],
  },
  {
    id: 'dominate-beast',
    name: 'Dominate Beast',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You attempt to beguile a Beast that you can see within range. It must succeed on a Wisdom saving throw or have the Charmed condition for the duration.',
    atHigherLevels:
      'When you cast this spell with a level 5 slot, the duration is up to 10 minutes. With a level 6 slot, up to 1 hour. With a level 7+ slot, up to 8 hours.',
    classes: ['druid', 'ranger', 'sorcerer'],
  },
  {
    id: 'fabricate',
    name: 'Fabricate',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'transmutation',
    castingTime: {
      type: 'minute',
      amount: 10,
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
      'You convert raw materials into products of the same material. For example, you can fabricate a wooden bridge from a clump of trees, a rope from a patch of hemp, and clothes from flax or wool.',
    classes: ['wizard'],
  },
  {
    id: 'fire-shield',
    name: 'Fire Shield',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'a piece of phosphorus',
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'Thin and wispy flames wreathe your body for the duration. You choose whether the flames shed Bright Light in a 10-foot radius. The flames provide a warm shield or a chill shield. Whenever a creature hits you with a melee attack while within 5 feet, that creature takes 2d8 Fire or Cold damage.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'freedom-of-movement',
    name: 'Freedom of Movement',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'a leather strap',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a willing creature. For the duration, the target's movement is unaffected by Difficult Terrain, and spells and other magical effects can neither reduce the target's Speed nor cause the target to have the Paralyzed or Restrained condition.",
    classes: ['bard', 'cleric', 'druid', 'ranger'],
  },
  {
    id: 'giant-insect',
    name: 'Giant Insect',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      "You transform up to ten Tiny beasts with an Intelligence of 3 or less that you can see within range into giant versions of their natural forms for the duration. A beast can't be affected if it has any immunities to magic. An affected creature gains the following benefits: Atk and Damage rolls for its natural weapons are based on Strength instead of Dexterity.",
    classes: ['druid'],
  },
  {
    id: 'greater-invisibility',
    name: 'Greater Invisibility',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description: 'You or a creature you touch has the Invisible condition until the spell ends.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'guardian-of-faith',
    name: 'Guardian of Faith',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '8 hours',
    },
    concentration: true,
    ritual: false,
    description:
      'A Large spectral guardian appears and hovers for the duration in an unoccupied space of your choice that you can see within range. The guardian occupies that space and is indistinct except for a gleaming sword and shield emblazoned with the symbol of your deity.',
    classes: ['cleric'],
  },
  {
    id: 'hallucinatory-terrain',
    name: 'Hallucinatory Terrain',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'illusion',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 300,
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
    ritual: true,
    description:
      "You make natural terrain in a 150-foot cube in range look, sound, and smell like some other sort of natural terrain. The terrain's general shape remains the same, however. Open fields or a road could be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain.",
    classes: ['bard', 'druid', 'wizard'],
  },
  {
    id: 'ice-storm',
    name: 'Ice Storm',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 300,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a pinch of dust and a few drops of water',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 20,
      height: 40,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 2,
        die: 'd8',
        notation: '2d8',
      },
      type: 'bludgeoning',
    },
    concentration: false,
    ritual: false,
    description:
      'A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high Cylinder centered on a point within range. Each creature in the Cylinder must make a Dexterity saving throw, taking 2d8 Bludgeoning damage and 4d6 Cold damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, the Bludgeoning damage increases by 1d8 for each slot level above 4.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'leomunds-secret-chest',
    name: "Leomund's Secret Chest",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription:
        'an exquisite chest and a key made from rare materials worth at least 5,000 gp',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You hide a chest, and all its contents, on the Ethereal Plane. You must touch the chest and the miniature replica that serves as a key for the spell. The chest can contain up to 12 cubic feet of nonliving material (3 feet by 2 feet by 2 feet). While closed, the miniature replica is all that can be seen of the chest.',
    classes: ['wizard'],
  },
  {
    id: 'locate-creature',
    name: 'Locate Creature',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you.",
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'wizard'],
  },
  {
    id: 'mordenkainen-faithful-hound',
    name: "Mordenkainen's Faithful Hound",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'a tiny silver whistle, a piece of bone, and a thread',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure a phantom watchdog in an unoccupied space that you can see within range, where it remains for the duration. The hound is invisible to all creatures except you and can't be harmed. When a Small or larger creature comes within 30 feet of it without first speaking the password that you specify when you cast this spell, the hound starts barking loudly. The hound sees invisible creatures and can see into the Ethereal Plane. It ignores illusions.",
    classes: ['wizard'],
  },
  {
    id: 'otilukes-resilience-4',
    name: "Otilukes's Resilience",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription:
        'a gem, crystal, reliquary, or some other ornamental container worth at least 500 gp',
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'You touch a willing creature and grant it a magical reserve of resilience. For the duration, the target has resistance to nonmagical damage. When the target takes damage, it can use its reaction to roll a d6. The target reduces the damage taken by the number rolled plus your spellcasting ability modifier.',
    classes: ['wizard'],
  },
  {
    id: 'phantasmal-killer',
    name: 'Phantasmal Killer',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    damage: {
      base: {
        count: 4,
        die: 'd10',
        notation: '4d10',
      },
      type: 'psychic',
    },
    concentration: true,
    ritual: false,
    description:
      'You tap into the nightmares of a creature you can see within range and create an illusory manifestation of its deepest fears, visible only to that creature. The target must make a Wisdom saving throw. On a failed save, the target has the Frightened condition for the duration.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, the damage increases by 1d10 for each slot level above 4.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'polymorph',
    name: 'Polymorph',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'a caterpillar cocoon',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a Shapechanger or a creature with 0 Hit Points.',
    classes: ['bard', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'private-sanctum',
    name: 'Private Sanctum',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'abjuration',
    castingTime: {
      type: 'minute',
      amount: 10,
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      "You make an area within range magically secure. The area is a cube that can be as small as 5 feet on each side or as large as 100 feet on each side. The spell lasts for the duration, and the magical effects can't be dispelled by dispel magic.",
    classes: ['wizard'],
  },
  {
    id: 'resilient-sphere',
    name: 'Resilient Sphere',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
    school: 'evocation',
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "A sphere of shimmering force springs into existence centered on a point of your choice within range. The sphere can have a radius of up to 15 feet. If the sphere overlaps with a creature, the creature is pushed away from the sphere's center until it is outside the sphere.",
    classes: ['wizard'],
  },
  {
    id: 'sickening-radiance',
    name: 'Sickening Radiance',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'Dim, sickly green light spreads within a 30-foot-radius sphere centered on a point of your choice within range. The light spreads around corners. If a creature starts its turn in the area, it must succeed on a Constitution saving throw or take 2d8 poison damage.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.',
    classes: ['wizard'],
  },
  {
    id: 'stone-shape',
    name: 'Stone Shape',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription:
        'soft clay, which must be worked into roughly the desired shape of the stone object',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape that suits your purpose. So, for example, you could shape a large stone into a groove, or reshape a stone wall so that it's easy to clamber over instead of a sheer cliff.",
    classes: ['cleric', 'druid', 'wizard'],
  },
  {
    id: 'stoneskin',
    name: 'Stoneskin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'diamond dust worth 100 gp',
      materialCost: 100,
      materialConsumed: true,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has Resistance to nonmagical Bludgeoning, Piercing, and Slashing damage.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-fire',
    name: 'Wall of Fire',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 4,
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
      materialDescription: 'a piece of phosphorus',
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
        count: 5,
        die: 'd8',
        notation: '5d8',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a wall of fire on a solid surface within range. The wall can be up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 5 or higher, the damage increases by 1d8 for each slot level above 4.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
];
