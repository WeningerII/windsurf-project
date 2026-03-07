import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Level 8 Spells (SRD)
export const level8Spells: Spell[] = [
  {
    id: 'animal-shapes-druid-35e',
    name: 'Animal Shapes',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description: 'One ally/level polymorphs into chosen animal.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'antimagic-field-cleric-35e',
    name: 'Antimagic Field',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'abjuration',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Negates magic within 10 ft.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'cloak-chaos-cleric-35e',
    name: 'Cloak of Chaos',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 to AC, +4 resistance, and SR 25 against lawful spells.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'clone-35e',
    name: 'Clone',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      materialDescription: 'A diamond worth at least 1,000 gp per HD of the creature',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell makes an inert duplicate of a living creature. If the original dies, its soul transfers to the clone if the clone is within 1 mile of the death.',
    classes: ['wizard'],
    levelsByClass: {
      wizard: 8,
    },
  },
  {
    id: 'control-plants-druid-35e',
    name: 'Control Plants',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Control actions of one or more plant creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'create-greater-undead-cleric-35e',
    name: 'Create Greater Undead',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'necromancy',
    castingTime: {
      type: 'hour',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Create shadows, wraiths, spectres, or devourers.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'cure-critical-mass-cleric-35e',
    name: 'Cure Critical Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'cure-serious-mass-druid-35e',
    name: 'Cure Serious Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
    description: 'Cures 3d8 damage +1/level for many creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'dimensional-lock-cleric-35e',
    name: 'Dimensional Lock',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'abjuration',
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description: 'Teleportation and interplanar travel blocked for one day/level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'discern-location-35e',
    name: 'Discern Location',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'unlimited',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A holy reliquary worth at least 1,000 gp',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You learn the exact location of a creature or object you are familiar with. The spell can penetrate barriers, but 2 feet of stone, 2 inches of common metal, or a thin sheet of lead blocks it.',
    classes: ['cleric', 'wizard'],
    levelsByClass: {
      cleric: 8,
      wizard: 8,
    },
  },
  {
    id: 'discern-location-cleric-35e',
    name: 'Discern Location',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'divination',
    castingTime: {
      type: 'minutes',
      minutes: 10,
    },
    range: {
      type: 'unlimited',
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
    description: 'Reveals exact location of creature or object.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'earthquake-cleric-35e',
    name: 'Earthquake',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'evocation',
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
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Intense tremor shakes 80-ft.-radius.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'earthquake-druid-35e',
    name: 'Earthquake',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'evocation',
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
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Intense tremor shakes 80-ft.-radius.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'finger-death-druid-35e',
    name: 'Finger of Death',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
    description: 'Kills one subject.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'fire-storm-cleric-35e',
    name: 'Fire Storm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Deals 1d6/level fire damage.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'holy-aura-cleric-35e',
    name: 'Holy Aura',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 to AC, +4 resistance, and SR 25 against evil spells.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'horrid-wilting-35e',
    name: 'Horrid Wilting',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 250,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 30,
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
      'A shimmering heat wave springs from a point of your choice within range. Each creature in that area must make a Constitution saving throw.',
    damage: {
      base: {
        count: 12,
        die: 'd8',
        notation: '12d8',
      },
      type: 'necrotic',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'inflict-critical-mass-cleric-35e',
    name: 'Inflict Critical Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
    description: 'Deals 4d8 damage +1/level to many creatures.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'moment-of-prescience-35e',
    name: 'Moment of Prescience',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You glimpse the immediate future. Once before the spell ends, you can use your reaction to gain advantage on one attack roll, ability check, or saving throw.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'planar-ally-greater-cleric-35e',
    name: 'Planar Ally, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'As lesser planar ally, but up to 18 HD.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'planar-binding-greater-35e',
    name: 'Planar Binding, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Offerings worth 2,000 gp plus payment',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like lesser planar binding, except that you may call a single creature of 16 HD or less, or up to four creatures of the same kind whose Hit Dice total no more than 16.',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'polymorph-any-object-35e',
    name: 'Polymorph Any Object',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      materialDescription: 'Jade dust worth at least 1,500 gp',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like polymorph, except that it allows the target to change into any single nonmagical creature.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'power-word-stun-35e',
    name: 'Power Word Stun',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      'You utter a word of power that stuns one creature you can see within range. If the creature has 150 hit points or fewer, it is stunned.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'protection-from-spells-35e',
    name: 'Protection from Spells',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      materialDescription: 'Diamond dust worth 500 gp',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The subject gains a +8 resistance bonus on saving throws against spells and spell-like abilities.',
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 8,
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'repel-metal-stone-druid-35e',
    name: 'Repel Metal or Stone',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Pushes away metal and stone.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'reverse-gravity-druid-35e',
    name: 'Reverse Gravity',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Objects and creatures fall upward.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'screen-35e',
    name: 'Screen',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A piece of lead-lined silk',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      'You create an invisible magical barrier around an area you choose. Scrying spells cannot perceive anything within the screened area.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'shield-law-cleric-35e',
    name: 'Shield of Law',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 to AC, +4 resistance, and SR 25 against chaotic spells.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'spell-immunity-greater-cleric-35e',
    name: 'Spell Immunity, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'As spell immunity, but up to 8th-level spells.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'summon-monster-viii-cleric-35e',
    name: 'Summon Monster VIII',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      cleric: 8,
    },
  },
  {
    id: 'summon-monster-8-35e',
    name: 'Summon Monster VIII',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      'You can summon one creature from the 8th-level list, or multiple creatures from lower-level lists.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 8,
      cleric: 8,
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'summon-natures-ally-viii-druid-35e',
    name: "Summon Nature's Ally VIII",
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      druid: 8,
    },
  },
  {
    id: 'sunburst-druid-35e',
    name: 'Sunburst',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Blinds all within 10 ft., deals 6d6 damage.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'symbol-death-cleric-35e',
    name: 'Symbol of Death',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'necromancy',
    castingTime: {
      type: 'minutes',
      minutes: 10,
    },
    range: {
      type: 'ranged',
      feet: 60,
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
    description: 'Triggered rune slays nearby creatures.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'symbol-insanity-cleric-35e',
    name: 'Symbol of Insanity',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'enchantment',
    castingTime: {
      type: 'minutes',
      minutes: 10,
    },
    range: {
      type: 'ranged',
      feet: 60,
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
    description: 'Triggered rune renders nearby creatures insane.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'trap-the-soul-35e',
    name: 'Trap the Soul',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
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
      materialDescription: 'A gem worth at least 1,000 gp',
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'You attempt to trap the soul of a creature you can see within range. The target must make a Charisma saving throw.',
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    classes: ['wizard'],
    levelsByClass: {
      wizard: 8,
    },
  },
  {
    id: 'unholy-aura-cleric-35e',
    name: 'Unholy Aura',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 to AC, +4 resistance, and SR 25 against good spells.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 8,
    },
  },
  {
    id: 'whirlwind-druid-35e',
    name: 'Whirlwind',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'evocation',
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
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Cyclone deals damage and can pick up creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
  {
    id: 'word-recall-druid-35e',
    name: 'Word of Recall',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 8,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'unlimited',
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
    description: 'Teleports you back to designated place.',
    classes: ['druid'],
    levelsByClass: {
      druid: 8,
    },
  },
];
