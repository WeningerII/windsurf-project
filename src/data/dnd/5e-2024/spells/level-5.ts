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
    id: 'circle-of-teleportation',
    name: 'Circle of Teleportation',
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
      somatic: true,
      material: true,
      materialDescription:
        'rare chalks and inks infused with precious gems worth 50 gp, which the spell consumes',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'As you cast this spell, you draw a 10-foot-diameter circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know and that is on the same plane of existence as you. A shimmering portal opens within the circle you drew and remains open until the end of your next turn. Any creature that enters the portal instantly appears within 5 feet of the destination circle or in the nearest unoccupied space if that space is occupied.',
    classes: ['bard', 'sorcerer', 'wizard'],
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
    id: 'conjure-volley',
    name: 'Conjure Volley',
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
      feet: 150,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a Melee or Ranged weapon worth at least 1 CP',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 10,
      height: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 8,
        die: 'd8',
        notation: '8d8',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'You throw a weapon or fire a piece of ammunition into the air and choose a point you can see within range. Countless spectral weapons rain down in a 20-foot-high, 10-foot-radius cylinder centered on that point and disappear. Each creature of your choice that you can see in the area must make a Dexterity saving throw, taking 8d8 Force damage on a failed save or half as much damage on a successful one. The spell then teleports the material component back to your hand.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the damage increases by 1d8 for each slot level above 5.',
    classes: ['ranger'],
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
    id: 'transmute-rock',
    name: 'Transmute Rock',
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
      material: true,
      materialDescription: 'clay and stone worth at least 1 gp',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You choose an area of stone or mud that you can see that fits within a 40-foot cube and is within range, and choose one of the following effects. Transmute Rock to Mud, Transmute Mud to Rock.',
    classes: ['druid', 'wizard'],
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
];
