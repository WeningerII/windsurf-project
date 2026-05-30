import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 7 Spells - SRD 5.2
export const level7Spells: Spell[] = [
  {
    id: 'conjure-celestial',
    name: 'Conjure Celestial',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'You conjure a spirit from the Upper Planes. The spirit manifests in an angelic form in an unoccupied space you can see within range.',
    classes: ['cleric'],
  },
  {
    id: 'delayed-blast-fireball',
    name: 'Delayed Blast Fireball',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'evocation',
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
      materialDescription: 'a ball of bat guano and sulfur',
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
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 12,
        die: 'd6',
        notation: '12d6',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      'A glowing bead of light appears at a point of your choice within range and remains until the spell ends. When the spell ends, either because your concentration is broken or because you decide to end it, the bead explodes with a low roar.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 8 or higher, the damage increases by 1d6 for each slot level above 7.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'divine-word',
    name: 'Divine Word',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'evocation',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'You utter a divine word, imbued with the power that shaped the world at the dawn of creation. Each creature of your choice that can hear you within range must make a Charisma saving throw. On a failed save, a creature suffers an effect based on its current HP.',
    classes: ['cleric'],
  },
  {
    id: 'etherealness',
    name: 'Etherealness',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 8 or higher, you can target up to three willing creatures for each slot level above 7.',
    classes: ['bard', 'cleric', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'finger-of-death',
    name: 'Finger of Death',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 7,
        die: 'd8',
        modifier: 30,
        notation: '7d8+30',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'You send negative energy coursing through a creature you can see within range. The target must make a Constitution saving throw, taking 7d8 + 30 Necrotic damage on a failed save, or half as much on a successful one.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'fire-storm',
    name: 'Fire Storm',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'evocation',
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 7,
        die: 'd10',
        notation: '7d10',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A storm made up of sheets of roaring flame appears in a location you choose within range. The area of the storm consists of up to ten 10-foot cubes, which you can arrange as you wish.',
    classes: ['cleric', 'druid', 'sorcerer'],
  },
  {
    id: 'forcecage',
    name: 'Forcecage',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'evocation',
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
      materialDescription: 'ruby dust worth 1,500 gp',
      materialCost: 1500,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'An immobile, invisible, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box as you choose.',
    classes: ['bard', 'warlock', 'wizard'],
  },
  {
    id: 'mirage-arcane',
    name: 'Mirage Arcane',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'illusion',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'sight',
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'special',
      description: '10 days',
    },
    concentration: false,
    ritual: false,
    description:
      "You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. The terrain's general shape remains the same.",
    classes: ['bard', 'druid', 'wizard'],
  },
  {
    id: 'mordenkainens-magnificent-mansion',
    name: "Mordenkainen's Magnificent Mansion",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'conjuration',
    castingTime: {
      type: 'minute',
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
      materialDescription: 'a miniature portal carved from ivory worth 5 gp',
      materialCost: 5,
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      'You conjure an extradimensional dwelling in range that lasts for the duration. You choose where its one entrance is located. The dwelling has 50 rooms. The atmosphere is clean, fresh, and warm.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'plane-shift',
    name: 'Plane Shift',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
      materialDescription: 'a forked metal rod worth 250 gp attuned to a plane',
      materialCost: 250,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms.',
    classes: ['cleric', 'druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'prismatic-spray',
    name: 'Prismatic Spray',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
      feet: 60,
    },
    concentration: false,
    ritual: false,
    description:
      'Eight multicolored rays of light flash from your hand. Each ray is a different color and has a different power and purpose. Each creature in a 60-foot Cone must make a Dexterity saving throw.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'project-image',
    name: 'Project Image',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'illusion',
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
      somatic: true,
      material: true,
      materialDescription: 'a replica of yourself worth 5 gp',
      materialCost: 5,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 day',
    },
    concentration: true,
    ritual: false,
    description:
      'You create an illusory copy of yourself that lasts for the duration. The copy can appear at any location within range that you have seen before.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'regenerate',
    name: 'Regenerate',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'transmutation',
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
      materialDescription: 'a prayer wheel',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    target: '1 creature you touch',
    concentration: false,
    ritual: false,
    description:
      'You touch a creature and stimulate its natural healing ability. The target regains 4d8 + 15 Hit Points. For the duration of the spell, the target regains 1 Hit Point at the start of each of its turns.',
    classes: ['bard', 'cleric', 'druid'],
  },
  {
    id: 'resurrection',
    name: 'Resurrection',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
      materialDescription: 'a diamond worth 1,000 gp',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    target: '1 dead creature you touch',
    concentration: false,
    ritual: false,
    description:
      "You touch a dead creature that has been dead for no more than a century, that didn't die of old age, and that isn't Undead. If its soul is free and willing, the target returns to life with all its Hit Points.",
    classes: ['bard', 'cleric'],
  },
  {
    id: 'reverse-gravity',
    name: 'Reverse Gravity',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'transmutation',
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
      materialDescription: 'a lodestone and iron filings',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 50,
      height: 100,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText:
      'A creature in the area can succeed on a Dexterity saving throw to grab a fixed object and avoid the fall.',
    concentration: true,
    ritual: false,
    description:
      'This spell reverses gravity in a 50-foot-radius, 100-foot-high Cylinder centered on a point within range. All creatures and objects not anchored to the ground fall upward and reach the top of the area.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'sequester',
    name: 'Sequester',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
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
      materialDescription: 'diamond and emerald dust worth 5,000 gp',
      materialCost: 5000,
      materialConsumed: true,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      "By means of this spell, a willing creature or an object can be hidden away, safe from detection for the duration. The target becomes Invisible and can't be targeted by Divination spells.",
    classes: ['wizard'],
  },
  {
    id: 'simulacrum',
    name: 'Simulacrum',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'illusion',
    castingTime: {
      type: 'hour',
      amount: 12,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'powdered ruby worth 1,500 gp',
      materialCost: 1500,
      materialConsumed: true,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'You shape an illusory duplicate of one Beast or Humanoid that is within range for the entire casting time of the spell. The duplicate is a creature with half the HP maximum of the original.',
    classes: ['wizard'],
  },
  {
    id: 'symbol',
    name: 'Symbol',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'abjuration',
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
      materialDescription: 'mercury and diamond/opal dust worth 1,000 gp',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: {
      type: 'permanent',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'When you cast this spell, you inscribe a harmful glyph either on a surface or within an object that can be closed. If you choose a surface, the glyph can cover an area no larger than 10 feet in diameter.',
    classes: ['bard', 'cleric', 'druid', 'wizard'],
  },
  {
    id: 'teleport',
    name: 'Teleport',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 7,
    school: 'conjuration',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object, to a destination you select. The accuracy of teleportation depends on your familiarity.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
];
