import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Level 9 Spells (SRD)
export const level9Spells: Spell[] = [
  {
    id: 'antipathy-druid-35e',
    name: 'Antipathy',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'enchantment',
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
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description: 'Object or location affected by spell repels certain creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'astral-projection-cleric-35e',
    name: 'Astral Projection',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'necromancy',
    castingTime: {
      type: 'minutes',
      minutes: 30,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Projects you and companions onto Astral Plane.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'cure-critical-mass-druid-35e',
    name: 'Cure Critical Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
    description: 'Cures 4d8 damage +1/level for many creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'elemental-swarm-druid-35e',
    name: 'Elemental Swarm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Summons multiple elementals.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'energy-drain-cleric-35e',
    name: 'Energy Drain',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
    concentration: false,
    ritual: false,
    description: 'Subject gains 2d4 negative levels.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'etherealness-cleric-35e',
    name: 'Etherealness',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Travel to Ethereal Plane with companions.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'foresight-druid-35e',
    name: 'Foresight',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
    ritual: false,
    description: "'Sixth sense' warns of impending danger.",
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'foresight-35e',
    name: 'Foresight',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      "You touch a willing creature and bestow a limited ability to see the future. For the duration, the target can't be surprised, and attack rolls against it have disadvantage.",
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 9,
      druid: 9,
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'gate-cleric-35e',
    name: 'Gate',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Connects two planes for travel or summoning.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'gate-35e',
    name: 'Gate',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      materialDescription: 'Diamond worth at least 5,000 gp',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence.',
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 9,
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'heal-mass-cleric-35e',
    name: 'Heal, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
    description: 'As heal, but with several subjects.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'implosion-cleric-35e',
    name: 'Implosion',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'rounds',
      rounds: 4,
    },
    concentration: true,
    ritual: false,
    description: 'Kills one creature/round.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'meteor-swarm-35e',
    name: 'Meteor Swarm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 1000,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 40,
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
      'Blazing orbs of fire plummet to the ground at four different points of your choice within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw.',
    damage: {
      base: {
        count: 40,
        die: 'd6',
        notation: '40d6',
      },
      type: 'fire',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'miracle-cleric-35e',
    name: 'Miracle',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'sight',
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
    description: "Requests a deity's intercession.",
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'power-word-kill-35e',
    name: 'Power Word Kill',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You utter a word of power that can compel one creature you can see within range to die. If the creature you target has 100 hit points or fewer, it dies.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'prismatic-sphere-35e',
    name: 'Prismatic Sphere',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'An immobile, invisible sphere of magical force surrounds you. Nothing can pass through the barrier from either side, but you can see out of it normally.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'prismatic-wall-35e',
    name: 'Prismatic Wall',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 10,
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
      type: 'hours',
      hours: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'A shimmering, multicolored plane of light springs into being. The wall is opaque to normal sight and to darkvision. Each color of the wall has a special effect.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'regenerate-druid-35e',
    name: 'Regenerate',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 3,
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
    description: "Subject's severed limbs grow back, cures 4d8 damage +1/level (max +35).",
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'shades-35e',
    name: 'Shades',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'This spell functions like shadow conjuration, except that it can mimic any sorcerer or wizard spell of 8th level or lower.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'shambler-druid-35e',
    name: 'Shambler',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'hours',
      hours: 7,
    },
    concentration: false,
    ritual: false,
    description: 'Summons 1d4+2 shambling mounds to fight for you.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'shapechange-druid-35e',
    name: 'Shapechange',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Transforms you into any creature, and change forms once per round.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'shapechange-35e',
    name: 'Shapechange',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      material: true,
      materialDescription: 'Jade circlet worth at least 1,500 gp',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You assume the form of a different creature for the duration. You can have multiple forms prepared and switch between them as a bonus action.',
    classes: ['wizard'],
    levelsByClass: {
      wizard: 9,
    },
  },
  {
    id: 'soul-bind-cleric-35e',
    name: 'Soul Bind',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      material: true,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Traps newly dead soul to prevent resurrection.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'storm-vengeance-cleric-35e',
    name: 'Storm of Vengeance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'conjuration',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 10,
    },
    concentration: true,
    ritual: false,
    description: 'Storm rains acid, lightning, and hail.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'storm-vengeance-druid-35e',
    name: 'Storm of Vengeance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'conjuration',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 10,
    },
    concentration: true,
    ritual: false,
    description: 'Storm rains acid, lightning, and hail.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'summon-monster-ix-cleric-35e',
    name: 'Summon Monster IX',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Calls extraplanar creature to fight for you.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'summon-monster-9-35e',
    name: 'Summon Monster IX',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You can summon one creature from the 9th-level list, or multiple creatures from lower-level lists.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 9,
      cleric: 9,
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'summon-natures-ally-ix-druid-35e',
    name: "Summon Nature's Ally IX",
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Calls creature to fight.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'sympathy-druid-35e',
    name: 'Sympathy',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'enchantment',
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
      material: true,
    },
    duration: {
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description: 'Object or location attracts certain creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 9,
    },
  },
  {
    id: 'time-stop-35e',
    name: 'Time Stop',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You briefly stop the flow of time for everyone but yourself. In the absence of a time stop spell cast by another creature, you can take 1d4+1 rounds of actions.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'true-resurrection-cleric-35e',
    name: 'True Resurrection',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: "As resurrection, plus remains aren't needed.",
    classes: ['cleric'],
    levelsByClass: {
      cleric: 9,
    },
  },
  {
    id: 'wail-of-the-banshee-35e',
    name: 'Wail of the Banshee',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
    school: 'necromancy',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 30,
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
      'You emit a terrible wail. Every creature in the area must make a Constitution saving throw. On a failed save, a creature takes 12d6 psychic damage.',
    damage: {
      base: {
        count: 12,
        die: 'd6',
        notation: '12d6',
      },
      type: 'psychic',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
  {
    id: 'wish-35e',
    name: 'Wish',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 9,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 9,
      wizard: 9,
    },
  },
];
