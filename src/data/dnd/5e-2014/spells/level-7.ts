import { Spell } from '../../../../types/magic/spells';

export const level7Spells: Spell[] = [
  {
    id: 'plane-shift',
    name: 'Plane Shift',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'conjuration',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'a forked, metal rod worth at least 250 gp, attuned to a particular plane of existence',
      materialCost: 250,
    },
    duration: { type: 'instant' },
    savingThrow: { attribute: 'cha', success: 'none' },
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      'You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire or the palace of Dispater on the second level of the Nine Hells, and you appear in or near that destination. Alternatively, if you know the sigil sequence of a teleportation circle on another plane of existence, this spell can take you to that circle. You can use this spell to banish an unwilling creature to another plane. Choose a creature within your reach and make a melee spell attack against it. On a hit, the creature must make a Charisma saving throw. If the creature fails this save, it is transported to a random location on the plane of existence you specify.',
    classes: ['cleric', 'druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'teleport',
    name: 'Teleport',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'conjuration',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 10 },
    components: { verbal: true, somatic: false, material: false },
    duration: { type: 'instant' },
    concentration: false,
    ritual: false,
    description:
      "This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object that you can see within range, to a destination you select. If you target an object, it must be able to fit entirely inside a 10-foot cube, and it can't be held or carried by an unwilling creature. The destination you choose must be known to you, and it must be on the same plane of existence as you. Your familiarity with the destination determines whether you arrive there successfully.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'resurrection',
    name: 'Resurrection',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'necromancy',
    castingTime: { type: 'hour', amount: 1 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a diamond worth at least 1,000 gp, which the spell consumes',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: { type: 'instant' },
    target: '1 dead creature you touch',
    concentration: false,
    ritual: false,
    description:
      "You touch a dead creature that has been dead for no more than a century, that didn't die of old age, and that isn't undead. If its soul is free and willing, the target returns to life with all its hit points. This spell neutralizes any poisons and cures normal diseases afflicting the creature when it died. This spell closes all mortal wounds and restores any missing body parts. Coming back from the dead is an ordeal. The target takes a −4 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears.",
    classes: ['bard', 'cleric'],
  },
  {
    id: 'etherealness',
    name: 'Etherealness',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'transmutation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'self' },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'hours', hours: 8 },
    concentration: false,
    ritual: false,
    description:
      "You step into the border regions of the Ethereal Plane, in the area where it overlaps with your current plane. You remain in the Border Ethereal for the duration or until you use your action to dismiss the spell. During this time, you can move in any direction. While on the Ethereal Plane, you can only affect and be affected by other creatures on that plane. Creatures that aren't on the Ethereal Plane can't perceive you and can't interact with you, unless a special ability or magic has given them the ability to do so. You ignore all objects and effects that aren't on the Ethereal Plane, allowing you to move through objects you perceive on the plane you originated from.",
    atHigherLevels:
      'When you cast this spell using a spell slot of 8th level or higher, you can target up to three willing creatures (including you) for each slot level above 7th.',
    classes: ['bard', 'cleric', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'forcecage',
    name: 'Forcecage',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'evocation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 100 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'ruby dust worth 1,500 gp',
    },
    duration: { type: 'concentration', maxDuration: '1 hour' },
    concentration: true,
    ritual: false,
    description:
      'An invisible, immobile, cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box, as you choose. A prison built as a cage can be up to 20 feet on a side and is made from 1/2-inch diameter bars spaced 1/2 inch apart. A prison constructed as a solid box can be up to 15 feet on a side, creating a solid barrier that prevents any matter from passing through and blocking any spells cast into or out from the area.',
    classes: ['bard', 'warlock', 'wizard'],
  },
  {
    id: 'reverse-gravity',
    name: 'Reverse Gravity',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'transmutation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 100 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a lodestone and iron filings',
    },
    duration: { type: 'concentration', maxDuration: '1 minute' },
    areaOfEffect: { type: 'cylinder', radius: 50, height: 100 },
    savingThrow: { attribute: 'dex', success: 'none' },
    savingThrowText:
      'A creature in the area can succeed on a Dexterity saving throw to grab a fixed object and avoid the fall.',
    concentration: true,
    ritual: false,
    description:
      "This spell reverses gravity in a 50-foot-radius, 100-foot tall cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward when the spell is cast. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'sequester',
    name: 'Sequester',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'transmutation',
    castingTime: { type: 'minute', amount: 1 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'a powder composed of diamond, emerald, sapphire, and ruby dust worth at least 5,000 gp',
    },
    duration: { type: 'special', description: 'until dispelled' },
    concentration: false,
    ritual: false,
    description:
      "By means of this spell, a willing creature or an object can be hidden away, safe from detection for the duration. When you cast the spell and touch the target, it becomes invisible and can't be targeted by divination magic or perceived through magical scrying sensors, as if it were in the Ethereal Plane. If the target is a creature, it can eat and drink only if the food and drink is also hidden away—for every day that passes, the creature must expend one day of food and water normally.",
    classes: ['wizard'],
  },
  {
    id: 'simulacrum',
    name: 'Simulacrum',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'illusion',
    castingTime: { type: 'hour', amount: 12 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        "snow or ice in quantities sufficient to make a life-size copy of the duplicated creature; some hair, fingernail clippings, or other piece of that creature's body placed inside the snow or ice; and powdered ruby worth 1,500 gp, sprinkled over the duplicate and consumed by the spell",
    },
    duration: { type: 'instant' },
    concentration: false,
    ritual: false,
    description:
      'You shape an illusory duplicate of one beast or humanoid that is within range for the entire casting time of the spell. The duplicate is created grounded in ice or snow and appears to be made of these materials. While the spell lasts, you can use your action to cast any spell of 6th level or lower without providing material components, as if you were casting the spell. The duplicate acts on initiative count 20, losing ties. It obeys verbal commands that you issue (no action required by you), and it gains all the knowledge and proficiencies of the creature it mimics.',
    classes: ['wizard'],
  },
  {
    id: 'symbol',
    name: 'Symbol',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
    school: 'abjuration',
    castingTime: { type: 'minute', amount: 1 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'mercury, phosphorus, and powdered diamond and opal with a total value of at least 1,000 gp',
    },
    duration: { type: 'special', description: 'until dispelled' },
    concentration: false,
    ritual: false,
    description:
      'When you cast this spell, you inscribe a harmful glyph either on a surface (such as a section of floor, wall, or ceiling) or within an object that can be closed to conceal the glyph (such as a book, scroll, or treasure chest). If you choose a surface, the glyph can cover an area of the surface no larger than 10 feet in diameter. If you choose an object, that object must remain in its place; if the object is moved more than 10 feet from where you cast this spell, the glyph is broken, and the spell ends without being triggered.',
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'conjure-celestial',
    name: 'Conjure Celestial',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    id: 'finger-of-death',
    name: 'Finger of Death',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    id: 'mirage-arcane',
    name: 'Mirage Arcane',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    id: 'prismatic-spray',
    name: 'Prismatic Spray',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
    id: 'arcane-sword',
    name: 'Arcane Sword',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 7,
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
      materialDescription:
        'A miniature platinum sword with a grip and pommel of copper and zinc, worth 250 gp.',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 3,
        die: 'd10',
        notation: '3d10',
      },
      type: 'force',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a sword-shaped plane of force that hovers within range. It lasts for the duration.\nWhen the sword appears, you make a melee spell attack against a target of your choice within 5 feet of the sword. On a hit, the target takes 3d10 force damage. Until the spell ends, you can use a bonus action on each of your turns to move the sword up to 20 feet to a spot you can see and repeat this attack against the same target or a different one.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'magnificent-mansion',
    name: 'Magnificent Mansion',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
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
      materialDescription:
        'A miniature portal carved from ivory, a small piece of polished marble, and a tiny silver spoon, each item worth at least 5 gp.',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    areaOfEffect: {
      type: 'cube',
      feet: 5,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure an extradimensional dwelling in range that lasts for the duration. You choose where its one entrance is located. The entrance shimmers faintly and is 5 feet wide and 10 feet tall. You and any creature you designate when you cast the spell can enter the extradimensional dwelling as long as the portal remains open. You can open or close the portal if you are within 30 feet of it. While closed, the portal is invisible.\nBeyond the portal is a magnificent foyer with numerous chambers beyond. The atmosphere is clean, fresh, and warm.\nYou can create any floor plan you like, but the space can't exceed 50 cubes, each cube being 10 feet on each side. The place is furnished and decorated as you choose. It contains sufficient food to serve a nine course banquet for up to 100 people. A staff of 100 near-transparent servants attends all who enter. You decide the visual appearance of these servants and their attire. They are completely obedient to your orders. Each servant can perform any task a normal human servant could perform, but they can't attack or take any action that would directly harm another creature. Thus the servants can fetch things, clean, mend, fold clothes, light fires, serve food, pour wine, and so on. The servants can go anywhere in the mansion but can't leave it. Furnishings and other objects created by this spell dissipate into smoke if removed from the mansion. When the spell ends, any creatures inside the extradimensional space are expelled into the open spaces nearest to the entrance.",
    classes: ['bard', 'wizard'],
  },
];

// Helper function for lookups
export const getLevel7SpellById = (id: string) => level7Spells.find((spell) => spell.id === id);
