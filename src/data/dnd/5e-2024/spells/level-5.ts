import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 5 Spells - SRD 5.2
export const level5Spells: Spell[] = [
  {
    id: 'animate-objects',
    name: 'Animate Objects',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      "Objects come alive at your command. Choose up to ten nonmagical objects within range that are not being worn or carried. Medium targets count as two objects, Large targets count as four objects, Huge targets count as eight objects. You can't animate any object larger than Huge. Each object animates and becomes a creature under your control until the spell ends or until an animated object is reduced to 0 hit points.",
    atHigherLevels:
      'If you cast this spell using a spell slot of 6th level or higher, you can animate two additional objects for each slot level above 5th.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'awaken',
    name: 'Awaken',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'transmutation',
    castingTime: {
      type: 'hour',
      amount: 8,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'an agate worth 1,000 gp',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    target: '1 Huge or smaller Beast or plant with Intelligence 3 or less',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText:
      'The beast or plant resists the awakening on a successful Wisdom saving throw.',
    concentration: false,
    ritual: false,
    description:
      'After spending the casting time tracing magical pathways within a precious gemstone, you touch a Huge or smaller Beast or plant. The target must have an Intelligence of 3 or less. The target gains an Intelligence of 10 and the ability to speak one language you know.',
    classes: ['bard', 'druid'],
  },
  {
    id: 'cloudkill',
    name: 'Cloudkill',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 5,
        die: 'd8',
        notation: '5d8',
      },
      type: 'poison',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a 20-foot-radius Sphere of poisonous, yellow-green fog centered on a point you choose within range. A creature that enters the Sphere for the first time or starts its turn there makes a Constitution saving throw, taking 5d8 Poison damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the damage increases by 1d8 for each slot level above 5.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'cone-of-cold',
    name: 'Cone of Cold',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'a small crystal or glass cone',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cone',
      feet: 60,
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
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'A blast of cold air springs from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'conjure-elemental',
    name: 'Conjure Elemental',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'You conjure a Large Elemental spirit that manifests in an unoccupied space you can see within range. Choose an element: Air, Earth, Fire, or Water. The creature assumes a form appropriate to the element.',
    atHigherLevels:
      "When you cast this spell using a spell slot of level 6 or higher, the creature's stats increase according to its stat block.",
    classes: ['druid', 'wizard'],
  },
  {
    id: 'contact-other-plane',
    name: 'Contact Other Plane',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: true,
    description:
      'You mentally contact a demigod, the spirit of a long-dead sage, or some other mysterious entity from another plane. You can ask the entity up to five questions. You must ask your questions before the spell ends.',
    classes: ['warlock', 'wizard'],
  },
  {
    id: 'contagion',
    name: 'Contagion',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      type: 'special',
      description: '7 days',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'Your touch inflicts a disease. The target must make a Constitution saving throw. On a failed save, the target has the Poisoned condition. While Poisoned, the target makes another Constitution saving throw at the end of each of its turns.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'creation',
    name: 'Creation',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'a piece of the material to be created',
    },
    duration: {
      type: 'special',
      description: 'varies',
    },
    concentration: false,
    ritual: false,
    description:
      'You pull wisps of shadow material from the Shadowfell to create a nonliving object of vegetable matter within range: soft goods, rope, wood, or something similar.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the size of the object increases by one category for each slot level above 5.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'dispel-evil-and-good',
    name: 'Dispel Evil and Good',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'powdered silver and iron',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    attackRoll: true,
    concentration: true,
    ritual: false,
    description:
      'Shimmering energy surrounds and protects you from Aberrations, Celestials, Elementals, Fey, Fiends, and Undead. You can end the spell early using an action to make a melee spell attack to end possession or send a creature back to its plane.',
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'dominate-person',
    name: 'Dominate Person',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      'You attempt to beguile a Humanoid that you can see within range. It must succeed on a Wisdom saving throw or have the Charmed condition for the duration. While the target is Charmed, you have a telepathic link with it.',
    atHigherLevels:
      'When you cast this spell with a level 6 slot, the duration is up to 10 minutes. Level 7: 1 hour. Level 8+: 8 hours.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'dream',
    name: 'Dream',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'illusion',
    castingTime: {
      type: 'minute',
      amount: 1,
    },
    range: {
      type: 'unlimited',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'sand, ink, and a writing quill',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      "This spell shapes a creature's dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you.",
    classes: ['bard', 'warlock', 'wizard'],
  },
  {
    id: 'flame-strike',
    name: 'Flame Strike',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'a pinch of sulfur',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 10,
      height: 40,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 5,
        die: 'd6',
        notation: '5d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot-radius, 40-foot-high Cylinder centered on a point within range must make a Dexterity saving throw, taking 5d6 Fire damage and 5d6 Radiant damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the Fire damage or the Radiant damage (your choice) increases by 1d6 for each slot level above 5.',
    classes: ['cleric'],
  },
  {
    id: 'geas',
    name: 'Geas',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'enchantment',
    castingTime: {
      type: 'minute',
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
      type: 'special',
      description: '30 days',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide.',
    atHigherLevels:
      'When you cast this spell with a level 7 or 8 slot, the duration is 1 year. With a level 9 slot, the spell lasts until ended by a Remove Curse, Dispel Magic, or Wish spell.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'wizard'],
  },
  {
    id: 'greater-restoration',
    name: 'Greater Restoration',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'diamond dust worth 100 gp',
      materialCost: 100,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    target: '1 creature you touch',
    concentration: false,
    ritual: false,
    description:
      "You imbue a creature you touch with positive energy to undo a debilitating effect. You can reduce the target's Exhaustion level by 1, or end one of the following effects: Charmed, Petrified, a curse, ability score reduction, or HP maximum reduction.",
    classes: ['bard', 'cleric', 'druid'],
  },
  {
    id: 'hold-monster',
    name: 'Hold Monster',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      'Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, you can target one additional creature for each slot level above 5.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'insect-plague',
    name: 'Insect Plague',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'conjuration',
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
      materialDescription: 'a sugar cube',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 4,
        die: 'd10',
        notation: '4d10',
      },
      type: 'piercing',
    },
    concentration: true,
    ritual: false,
    description:
      'Swarming, biting locusts fill a 20-foot-radius Sphere centered on a point you choose within range. A creature that enters or starts its turn in the Sphere must make a Constitution saving throw, taking 4d10 Piercing damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the damage increases by 1d10 for each slot level above 5.',
    classes: ['cleric', 'druid', 'sorcerer'],
  },
  {
    id: 'legend-lore',
    name: 'Legend Lore',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'divination',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'incense worth 250 gp and four ivory strips worth 50 gp each',
      materialCost: 450,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Name or describe a person, place, or object. The spell brings to your mind a brief summary of the significant lore about the thing you named.',
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'mass-cure-wounds',
    name: 'Mass Cure Wounds',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 30,
    },
    healing: {
      count: 5,
      die: 'd8',
      modifier: 0,
      notation: '5d8',
    },
    concentration: false,
    ritual: false,
    description:
      'A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius Sphere centered on that point. Each target regains Hit Points equal to 5d8 plus your spellcasting ability modifier.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the healing increases by 1d8 for each slot level above 5.',
    classes: ['bard', 'cleric', 'druid'],
  },
  {
    id: 'mislead',
    name: 'Mislead',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: false,
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
      'You become Invisible at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends if you attack or cast a spell.',
    classes: ['bard', 'warlock', 'wizard'],
  },
  {
    id: 'passwall',
    name: 'Passwall',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'a pinch of sesame seeds',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'A passage appears at a point of your choice that you can see on a wooden, plaster, or stone surface within range, and lasts for the duration. The passage is up to 5 feet wide, 8 feet tall, and 20 feet deep.',
    classes: ['wizard'],
  },
  {
    id: 'planar-binding',
    name: 'Planar Binding',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'abjuration',
    castingTime: {
      type: 'hour',
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
      materialDescription: 'a jewel worth 1,000 gp',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'With this spell, you attempt to bind a Celestial, an Elemental, a Fey, or a Fiend to your service. The creature must be within range for the entire casting of the spell.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6, the duration increases to 10 days. Level 7: 30 days. Level 8: 180 days. Level 9: a year and a day.',
    classes: ['bard', 'cleric', 'druid', 'warlock', 'wizard'],
  },
  {
    id: 'raise-dead',
    name: 'Raise Dead',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'necromancy',
    castingTime: {
      type: 'hour',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a diamond worth 500 gp',
      materialCost: 500,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    target: '1 dead creature you touch',
    concentration: false,
    ritual: false,
    description:
      "You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 Hit Point.",
    classes: ['bard', 'cleric', 'paladin'],
  },
  {
    id: 'scrying',
    name: 'Scrying',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'divination',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a focus worth 1,000 gp',
      materialCost: 1000,
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target.',
    classes: ['bard', 'cleric', 'druid', 'warlock', 'wizard'],
  },
  {
    id: 'seeming',
    name: 'Seeming',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'illusion',
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
      hours: 8,
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell allows you to change the appearance of any number of creatures that you can see within range. You give each target a new, illusory appearance. An unwilling target can make a Charisma saving throw, and if it succeeds, it is unaffected.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'telekinesis',
    name: 'Telekinesis',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    savingThrow: {
      attribute: 'str',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You gain the ability to move or manipulate creatures or objects by thought. When you cast the spell, and as your action each round for the duration, you can exert your will on one creature or object you can see within range.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'teleportation-circle',
    name: 'Teleportation Circle',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'conjuration',
    castingTime: {
      type: 'minute',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 10,
    },
    components: {
      verbal: true,
      somatic: false,
      material: true,
      materialDescription: 'rare inks worth 50 gp',
      materialCost: 50,
      materialConsumed: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'As you cast the spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'wall-of-force',
    name: 'Wall of Force',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'a pinch of diamond dust',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'An invisible wall of force springs into existence at a point you choose within range. The wall appears in any orientation you choose, as a horizontal or vertical barrier or at an angle.',
    classes: ['wizard'],
  },
  {
    id: 'wall-of-stone',
    name: 'Wall of Stone',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'a small block of granite',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    effect: 'A nonmagical stone wall made of ten 10-foot-by-10-foot panels',
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText:
      'A creature that would be fully enclosed by the wall can succeed on a Dexterity saving throw to use its reaction to move clear of the enclosure.',
    concentration: true,
    ritual: false,
    description:
      'A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'commune',
    name: 'Commune',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'incense and a vial of holy or unholy water',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: true,
    description:
      'You contact your deity or a divine proxy and ask up to three yes-or-no questions before the spell ends. You receive a correct answer for each question, though information beyond the deity’s knowledge can return an unclear answer instead.',
    classes: ['cleric'],
  },
  {
    id: 'hallow',
    name: 'Hallow',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'evocation',
    castingTime: {
      type: 'hour',
      amount: 24,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'herbs, oils, and incense worth at least 1,000 gp, which the spell consumes',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: {
      type: 'unlimited',
    },
    concentration: false,
    ritual: false,
    description:
      'You touch a point and infuse an area around it with holy or unholy power. The area can’t overlap with another active Hallow spell, and you can bind an additional sacred or profane rider to the warded space, such as fear warding, silence, or planar exclusion.',
    classes: ['cleric'],
  },
  {
    id: 'antilife-shell',
    name: 'Antilife Shell',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'see text',
    },
    concentration: true,
    ritual: false,
    description:
      'An aura extends from you in a 10-foot Emanation for the duration. The aura prevents creatures other than Constructs and Undead from passing or reaching through it. An affected creature can cast spells or make attacks with Ranged or Reach weapons through the barrier. If you move so that an affected creature is forced to pass through the barrier, the spell ends.',
    classes: ['druid'],
  },
  {
    id: 'arcane-hand',
    name: 'Arcane Hand',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'an eggshell and a glove',
    },
    duration: {
      type: 'concentration',
      maxDuration: 'see text',
    },
    concentration: true,
    ritual: false,
    attackRoll: true,
    description:
      "You create a Large hand of shimmering magical energy in an unoccupied space that you can see within range. The hand lasts for the duration, and it moves at your command, mimicking the movements of your own hand. The hand is an object that has AC 20 and Hit Points equal to your Hit Point maximum. If it drops to 0 Hit Points, the spell ends. The hand doesn't occupy its space. When you cast the spell and as a Bonus Action on your later turns, you can move the hand up to 60 feet and then cause one of the following effects:\n\n**Clenched Fist.** The hand strikes a target within 5 feet of it. Make a melee spell attack. On a hit, the target takes 5d8 Force damage.\n\n**Forceful Hand.** The hand attempts to push a Huge or smaller creature within 5 feet of it. The target must succeed on a Strength saving throw, or the hand pushes the target up to 5 feet plus a number of feet equal to five times your spellcasting ability modifier. The hand moves with the target, remaining within 5 feet of it.\n\n**Grasping Hand.** The hand attempts to grapple a Huge or smaller creature within 5 feet of it. The target must succeed on a Dexterity saving throw, or the target has the Grappled condition, with an escape DC equal to your spell save DC. While the hand grapples the target, you can take a Bonus Action to cause the hand to crush it, dealing Bludgeoning damage to the target equal to 4d6 plus your spellcasting ability modifier.\n\n**Interposing Hand.** The hand grants you Half Cover against attacks and other effects that originate from its space or that pass through it. In addition, its space counts as Difficult Terrain for your enemies.",
    atHigherLevels:
      'The damage of the Clenched Fist increases by 2d8 and the damage of the Grasping Hand increases by 2d6 for each spell slot level above 5.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'commune-with-nature',
    name: 'Commune with Nature',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: true,
    description:
      "You commune with nature spirits and gain knowledge of the surrounding area. In the outdoors, the spell gives you knowledge of the area within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in castles and settlements. Choose three of the following facts; you learn those facts as they pertain to the spell's area: - Locations of settlements - Locations of portals to other planes of existence - Location of one Challenge Rating 10+ creature (GM's choice) that is a Celestial, an Elemental, a Fey, a Fiend, or an Undead - The most prevalent kind of plant, mineral, or Beast (you choose which to learn) - Locations of bodies of water For example, you could determine the location of a powerful monster in the area, the locations of bodies of water, and the locations of any towns.",
    classes: ['druid', 'ranger'],
  },
  {
    id: 'modify-memory',
    name: 'Modify Memory',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      type: 'concentration',
      maxDuration: 'see text',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Wisdom saving throw',
    concentration: true,
    ritual: false,
    description:
      "You attempt to reshape another creature's memories. One creature that you can see within range makes a Wisdom saving throw. If you are fighting the creature, it has Advantage on the save. On a failed save, the target has the Charmed condition for the duration. While Charmed in this way, the target also has the Incapacitated condition and is unaware of its surroundings, though it can hear you. If it takes any damage or is targeted by another spell, this spell ends, and no memories are modified. While this charm lasts, you can affect the target's memory of an event that it experienced within the last 24 hours and that lasted no more than 10 minutes. You can permanently eliminate all memory of the event, allow the target to recall the event with perfect clarity, change its memory of the event's details, or create a memory of some other event. You must speak to the target to describe how its memories are affected, and it must be able to understand your language for the modified memories to take root. Its mind fills in any gaps in the details of your description. If the spell ends before you finish describing the modified memories, the creature's memory isn't altered. Otherwise, the modified memories take hold when the spell ends. A modified memory doesn't necessarily affect how a creature behaves, particularly if the memory contradicts the creature's natural inclinations, alignment, or beliefs. An illogical modified memory, such as a false memory of how much the creature enjoyed swimming in acid, is dismissed as a bad dream. The GM might deem a modified memory too nonsensical to affect a creature. A Remove Curse or Greater Restoration spell cast on the target restores the creature's true memory.",
    atHigherLevels:
      "You can alter the target's memories of an event that took place up to 7 days ago (level 6 spell slot), 30 days ago (level 7 spell slot), 365 days ago (level 8 spell slot), or any time in the creature's past (level 9 spell slot).",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'reincarnate',
    name: 'Reincarnate',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
    school: 'necromancy',
    castingTime: {
      type: 'hour',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'rare oils worth 1,000+ GP, which the spell consumes',
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a dead Humanoid or a piece of one. If the creature has been dead no longer than 10 days, the spell forms a new body for it and calls the soul to enter that body. Roll 1d10 and consult the table below to determine the body's species, or the GM chooses another playable species.\n\n| 1d10 | Species |\n|---|---|\n| 1 | Roll again. |\n| 2 | Dragonborn |\n| 3 | Dwarf |\n| 4 | Elf |\n| 5 | Gnome |\n| 6 | Goliath |\n| 7 | Halfling |\n| 8 | Human |\n| 9 | Orc |\n| 10 | Tiefling |\n\nThe reincarnated creature makes any choices that a species' description offers, and the creature recalls its former life. It retains the capabilities it had in its original form, except it loses the traits of its previous species and gains the traits of its new one.",
    classes: ['druid'],
  },
  {
    id: 'summon-dragon',
    name: 'Summon Dragon',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'an object with the image of a dragon engraved on it worth 500+ GP',
      materialConsumed: true,
    },
    duration: {
      type: 'concentration',
      maxDuration: 'see text',
    },
    concentration: true,
    ritual: false,
    description:
      "You call forth a Dragon spirit. It manifests in an unoccupied space that you can see within range and uses the Draconic Spirit stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends. The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.",
    atHigherLevels: "Use the spell slot's level for the spell's level in the stat block.",
    classes: ['wizard'],
  },
  {
    id: 'telepathic-bond',
    name: 'Telepathic Bond',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      materialDescription: 'two eggs',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: true,
    description:
      "You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures that can't communicate in any languages aren't affected by this spell. Until the spell ends, the targets can communicate telepathically through the bond whether or not they share a language. The communication is possible over any distance, though it can't extend to other planes of existence.",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'tree-stride',
    name: 'Tree Stride',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 5,
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
      maxDuration: 'see text',
    },
    concentration: true,
    ritual: false,
    description:
      "You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet. Both trees must be living and at least the same size as you. You must use 5 feet of movement to enter a tree. You instantly know the location of all other trees of the same kind within 500 feet and, as part of the move used to enter the tree, can either pass into one of those trees or step out of the tree you're in. You appear in a spot of your choice within 5 feet of the destination tree, using another 5 feet of movement. If you have no movement left, you appear within 5 feet of the tree you entered. You can use this transportation ability only once on each of your turns. You must end each turn outside a tree.",
    classes: ['druid', 'ranger'],
  },
];
