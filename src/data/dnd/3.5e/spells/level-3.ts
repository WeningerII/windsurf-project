import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Level 3 Spells (SRD)
export const level3Spells: Spell[] = [
  {
    id: 'animate-dead-cleric-35e',
    name: 'Animate Dead',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Creates undead skeletons and zombies.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'bestow-curse-cleric-35e',
    name: 'Bestow Curse',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      '-6 to an ability score; -4 on attack rolls, saves, and checks; or 50% chance of losing each action.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'blindness-deafness-cleric-35e',
    name: 'Blindness/Deafness',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'necromancy',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Makes subject blinded or deafened.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'call-lightning-druid-35e',
    name: 'Call Lightning',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Calls down lightning bolts (3d6 per bolt) from sky.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'clairvoyance-35e',
    name: 'Clairvoyance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'unlimited',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'A focus worth at least 100 gp, such as a crystal ball, a silver mirror, or a font filled with saltwater',
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: true,
    ritual: false,
    description:
      'You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door you heard sounds from).',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'contagion-cleric-35e',
    name: 'Contagion',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    concentration: false,
    ritual: false,
    description: 'Infects subject with chosen disease.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'contagion-druid-35e',
    name: 'Contagion',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    concentration: false,
    ritual: false,
    description: 'Infects subject with chosen disease.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'continual-flame-cleric-35e',
    name: 'Continual Flame',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Makes a permanent, heatless torch.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'create-food-water-cleric-35e',
    name: 'Create Food and Water',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description: 'Feeds three humans (or one horse)/level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'cure-moderate-wounds-druid-35e',
    name: 'Cure Moderate Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures 2d8 damage +1/level (max +10).',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'cure-serious-wounds-cleric-35e',
    name: 'Cure Serious Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures 3d8 damage +1/level (max +15).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'daylight-cleric-35e',
    name: 'Daylight',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: '60-ft. radius of bright light.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'daylight-druid-35e',
    name: 'Daylight',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: '60-ft. radius of bright light.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'deeper-darkness-cleric-35e',
    name: 'Deeper Darkness',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Object sheds supernatural shadow in 60-ft. radius.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'diminish-plants-druid-35e',
    name: 'Diminish Plants',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Reduces size or blights growth of normal plants.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'dispel-magic-35e',
    name: 'Dispel Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'abjuration',
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
      'Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends. For each spell of 4th level or higher on the target, make an ability check using your spellcasting ability.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      druid: 3,
      paladin: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'dispel-magic-cleric-35e',
    name: 'Dispel Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cancels spells and magical effects.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'dominate-animal-druid-35e',
    name: 'Dominate Animal',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Subject animal obeys silent mental commands.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'fireball-3-35e',
    name: 'Fireball',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 150,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A tiny ball of bat guano and sulfur',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'A bright streak flashes from your pointing finger to a point of your choice within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw.',
    damage: {
      base: {
        count: 8,
        die: 'd6',
        notation: '8d6',
      },
      type: 'fire',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'glyph-of-warding-cleric-35e',
    name: 'Glyph of Warding',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'abjuration',
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Inscription harms those who pass it.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'haste-35e',
    name: 'Haste',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      materialDescription: 'A shaving of licorice root',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: true,
    ritual: false,
    description:
      "Choose a willing creature that you can see within range. Until the spell ends, the creature's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'helping-hand-cleric-35e',
    name: 'Helping Hand',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 5,
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
    description: 'Ghostly hand leads subject to you.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'inflict-serious-wounds-cleric-35e',
    name: 'Inflict Serious Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    concentration: false,
    ritual: false,
    description: 'Touch attack, 3d8 damage +1/level (max +15).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'invisibility-purge-cleric-35e',
    name: 'Invisibility Purge',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Dispels invisibility within 5 ft./level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'lightning-bolt-3-35e',
    name: 'Lightning Bolt',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    areaOfEffect: {
      type: 'line',
      length: 100,
      width: 5,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A bit of fur and a rod of amber, crystal, or glass',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw.',
    damage: {
      base: {
        count: 8,
        die: 'd6',
        notation: '8d6',
      },
      type: 'lightning',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'locate-object-cleric-35e',
    name: 'Locate Object',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'divination',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Senses direction toward object (specific or type).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'magic-circle-chaos-cleric-35e',
    name: 'Magic Circle against Chaos',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'As protection spells, but 10-ft. radius and 10 min./level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'magic-circle-evil-cleric-35e',
    name: 'Magic Circle against Evil',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'As protection spells, but 10-ft. radius and 10 min./level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'magic-circle-good-cleric-35e',
    name: 'Magic Circle against Good',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'As protection spells, but 10-ft. radius and 10 min./level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'magic-circle-law-cleric-35e',
    name: 'Magic Circle against Law',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'As protection spells, but 10-ft. radius and 10 min./level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'magic-fang-greater-druid-35e',
    name: 'Magic Fang, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description:
      'One natural weapon of subject creature gets +1/four levels on attack and damage rolls (max +5).',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'magic-vestment-cleric-35e',
    name: 'Magic Vestment',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Armor or shield gains +1 enhancement per four levels.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'meld-stone-cleric-35e',
    name: 'Meld into Stone',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'You and your gear merge with stone.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'meld-stone-druid-35e',
    name: 'Meld into Stone',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'You and your gear merge with stone.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'neutralize-poison-druid-35e',
    name: 'Neutralize Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Immunizes subject against poison, detoxifies venom in or on subject.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'obscure-object-cleric-35e',
    name: 'Obscure Object',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'Masks object against scrying.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'plant-growth-druid-35e',
    name: 'Plant Growth',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Grows vegetation, improves crops.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'poison-druid-35e',
    name: 'Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    concentration: false,
    ritual: false,
    description: 'Touch deals 1d10 Con damage, repeats in 1 min.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'prayer-cleric-35e',
    name: 'Prayer',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 40,
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
    description: 'Allies +1 bonus on most rolls, enemies -1 penalty.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'protection-energy-cleric-35e',
    name: 'Protection from Energy',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'Absorb 12 points/level of damage from one kind of energy.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'protection-energy-druid-35e',
    name: 'Protection from Energy',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'Absorb 12 points/level of damage from one kind of energy.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'protection-from-energy-35e',
    name: 'Protection from Energy',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    concentration: false,
    ritual: false,
    description:
      "For the spell's duration, the willing creature you touch has resistance to one damage type of your choice: acid, cold, fire, lightning, or thunder.",
    classes: ['cleric', 'druid', 'ranger', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 3,
      druid: 3,
      ranger: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'quench-druid-35e',
    name: 'Quench',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Extinguishes nonmagical fires or one magic item.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'remove-blind-deaf-cleric-35e',
    name: 'Remove Blindness/Deafness',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures normal or magical conditions.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'remove-curse-cleric-35e',
    name: 'Remove Curse',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Frees object or person from curse.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'remove-disease-cleric-35e',
    name: 'Remove Disease',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures all diseases affecting subject.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'remove-disease-druid-35e',
    name: 'Remove Disease',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures all diseases affecting subject.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'remove-disease-35e',
    name: 'Remove Disease',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Remove disease cures all diseases that the subject is suffering from. The spell also kills parasites, including green slime and others. Certain special diseases may not be countered by this spell or may be countered only by a caster of a certain level or higher.',
    classes: ['cleric', 'druid'],
    levelsByClass: {
      cleric: 3,
      druid: 3,
    },
  },
  {
    id: 'searing-light-cleric-35e',
    name: 'Searing Light',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    description: 'Ray deals 1d8/two levels damage, more against undead.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'sleet-storm-druid-35e',
    name: 'Sleet Storm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Hampers vision and movement.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'slow-35e',
    name: 'Slow',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 120,
    },
    areaOfEffect: {
      type: 'cube',
      feet: 40,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A drop of molasses',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: true,
    ritual: false,
    description:
      "You alter time around up to six creatures of your choice in a 40-foot cube within range. Each creature must make a Wisdom saving throw. On a failed save, a creature's speed is halved for the duration.",
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'snare-druid-35e',
    name: 'Snare',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'transmutation',
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Creates a magic booby trap.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'speak-dead-cleric-35e',
    name: 'Speak with Dead',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'necromancy',
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Corpse answers one question/two levels.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'speak-plants-druid-35e',
    name: 'Speak with Plants',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'You can talk to normal plants and plant creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'spike-growth-druid-35e',
    name: 'Spike Growth',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Creatures in area take 1d4 damage, may be slowed.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'stinking-cloud-35e',
    name: 'Stinking Cloud',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 90,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A rotten egg or several skunk cabbage leaves',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'A foul-smelling cloud springs from a point of your choice within range. Each creature that starts its turn in the cloud must succeed on a Constitution saving throw or be poisoned until the end of its next turn.',
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'stone-shape-cleric-35e',
    name: 'Stone Shape',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Sculpts stone into any shape.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'stone-shape-druid-35e',
    name: 'Stone Shape',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Sculpts stone into any shape.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'summon-monster-iii-cleric-35e',
    name: 'Summon Monster III',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      cleric: 3,
    },
  },
  {
    id: 'summon-monster-3-35e',
    name: 'Summon Monster III',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
    concentration: true,
    ritual: false,
    description:
      'You summon a creature from the Outer Planes to fight on your behalf. The creature appears where you designate and acts immediately on your turn.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'summon-natures-ally-iii-druid-35e',
    name: "Summon Nature's Ally III",
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      druid: 3,
    },
  },
  {
    id: 'tongues-35e',
    name: 'Tongues',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      somatic: false,
      material: true,
      materialDescription: 'A small clay model of a ziggurat',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 3,
      cleric: 3,
      sorcerer: 3,
      wizard: 3,
    },
  },
  {
    id: 'vampiric-touch-35e',
    name: 'Vampiric Touch',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt.',
    damage: {
      base: {
        count: 3,
        die: 'd6',
        notation: '3d6',
      },
      type: 'necrotic',
    },
    classes: ['wizard'],
    levelsByClass: {
      wizard: 3,
    },
  },
  {
    id: 'water-breathing-cleric-35e',
    name: 'Water Breathing',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description: 'Subjects can breathe underwater.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'water-breathing-druid-35e',
    name: 'Water Breathing',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description: 'Subjects can breathe underwater.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
  {
    id: 'water-walk-cleric-35e',
    name: 'Water Walk',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Subject treads on water as if solid.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'wind-wall-cleric-35e',
    name: 'Wind Wall',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Deflects arrows, smaller creatures, and gases.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 3,
    },
  },
  {
    id: 'wind-wall-druid-35e',
    name: 'Wind Wall',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 3,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Deflects arrows, smaller creatures, and gases.',
    classes: ['druid'],
    levelsByClass: {
      druid: 3,
    },
  },
];
