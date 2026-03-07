import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Level 4 Spells (SRD)
export const level4Spells: Spell[] = [
  {
    id: 'air-walk-cleric-35e',
    name: 'Air Walk',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Subject treads on air as if solid (climb at 45-degree angle).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'air-walk-druid-35e',
    name: 'Air Walk',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Subject treads on air as if solid (climb at 45-degree angle).',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'animate-dead-35e',
    name: 'Animate Dead',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      materialDescription: 'Onyx gem worth 25 gp per Hit Die of undead',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell turns the bones or bodies of dead creatures into undead skeletons or zombies that follow your spoken commands. The undead can follow you, or they can remain in an area and attack any creature (or just a specific kind of creature) entering the place. They remain animated until they are destroyed.',
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'antiplant-shell-druid-35e',
    name: 'Antiplant Shell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Keeps animated plants at bay.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'arcane-eye-35e',
    name: 'Arcane Eye',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      materialDescription: 'Bit of bat fur',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You create an invisible magical sensor that sends you visual information. The arcane eye travels at 30 feet per round (300 feet per minute) if viewing an area ahead as a human would (primarily looking at the floor) or 10 feet per round (100 feet per minute) if examining the ceiling and walls as well as the floor ahead.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'bestow-curse-35e',
    name: 'Bestow Curse',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      'You place a curse on the subject. Choose one of the following three effects: -6 decrease to an ability score (minimum 1), -4 penalty on attack rolls, saves, ability checks, and skill checks, or each turn the target has a 50% chance to act normally; otherwise, it does nothing.',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'black-tentacles-35e',
    name: 'Black Tentacles',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 120,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Piece of tentacle from giant octopus or squid',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'This spell conjures a field of rubbery black tentacles, each 10 feet long. These waving members seem to spring forth from the earth, floor, or whatever surface is underfoot. The tentacles grapple and constrict opponents who enter the area, dealing 1d6+4 points of damage per round.',
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6+4',
      },
      type: 'bludgeoning',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'blight-druid-35e',
    name: 'Blight',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Withers one plant or deals 1d6/level damage to plant creature.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'charm-monster-35e',
    name: 'Charm Monster',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      "This charm makes a creature regard you as its trusted friend and ally (treat the target's attitude as friendly). If the creature is currently being threatened or attacked by you or your allies, however, it receives a +5 bonus on its saving throw. The spell does not enable you to control the charmed creature as if it were an automaton.",
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'command-plants-druid-35e',
    name: 'Command Plants',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description: 'Sway the actions of one or more plant creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'confusion-35e',
    name: 'Confusion',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 120,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 15,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Set of three nut shells',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "This spell causes confusion in the targets, making them unable to independently determine what they will do. Roll on the following table each round to see what the subject does. A confused character who can't carry out the indicated action does nothing but babble incoherently.",
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'contagion-35e',
    name: 'Contagion',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description:
      "The subject contracts a disease selected from the table below, which strikes immediately (no incubation period). The DC noted is for the subsequent saves (use contagion's normal save DC for the initial saving throw).",
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 4,
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'control-water-cleric-35e',
    name: 'Control Water',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'transmutation',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Raises or lowers bodies of water.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'control-water-druid-35e',
    name: 'Control Water',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'transmutation',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Raises or lowers bodies of water.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'crushing-despair-35e',
    name: 'Crushing Despair',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    areaOfEffect: {
      type: 'cone',
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
    description:
      'An invisible cone of despair causes great sadness in the subjects. Each affected creature takes a -2 penalty on attack rolls, saving throws, ability checks, skill checks, and weapon damage rolls. Crushing despair counters and dispels good hope.',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'cure-critical-wounds-cleric-35e',
    name: 'Cure Critical Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures 4d8 damage +1/level (max +20).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'cure-serious-wounds-druid-35e',
    name: 'Cure Serious Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Cures 3d8 damage +1/level (max +15).',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'death-ward-35e',
    name: 'Death Ward',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 hit points as a result of taking damage, the target instead drops to 1 hit point.',
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'death-ward-cleric-35e',
    name: 'Death Ward',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Grants immunity to death spells and negative energy effects.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'detect-scrying-35e',
    name: 'Detect Scrying',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'divination',
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
      material: true,
      materialDescription: 'Bronze piece worth 1 gp',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      "You immediately become aware of any attempt to observe you by means of a divination (scrying) spell or effect. The spell's area radiates from you and moves as you move. You know the location of every magical sensor within the spell's area.",
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'dimension-door-35e',
    name: 'Dimension Door',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You instantly transfer yourself from your current location to any other spot within range. You always arrive at exactly the spot desired. You can bring along objects as long as their weight doesn't exceed your maximum load. You may also bring one additional willing Medium or smaller creature (carrying gear or objects up to its maximum load) or its equivalent per three caster levels.",
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'dimensional-anchor-35e',
    name: 'Dimensional Anchor',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'A green ray springs from your outstretched hand. You must make a ranged touch attack to hit the target. Any creature or object struck by the ray is covered with a shimmering emerald field that completely blocks extradimensional travel. Forms of movement barred by a dimensional anchor include astral projection, blink, dimension door, ethereal jaunt, etherealness, gate, maze, plane shift, shadow walk, teleport, and similar spell-like or psionic abilities.',
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'dimensional-anchor-cleric-35e',
    name: 'Dimensional Anchor',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Bars extradimensional movement.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'discern-lies-cleric-35e',
    name: 'Discern Lies',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 10,
    },
    concentration: true,
    ritual: false,
    description: 'Reveals deliberate falsehoods.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'dismissal-cleric-35e',
    name: 'Dismissal',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Forces a creature to return to native plane.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'dispel-magic-druid-35e',
    name: 'Dispel Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'divination-35e',
    name: 'Divination',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Incense and sacrificial offering worth 25 gp',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Similar to augury but more powerful, a divination spell can provide you with a useful piece of advice in reply to a question concerning a specific goal, event, or activity that is to occur within one week. The advice can be as simple as a short phrase, or it might take the form of a cryptic rhyme or omen.',
    classes: ['cleric', 'wizard'],
    levelsByClass: {
      cleric: 4,
      wizard: 4,
    },
  },
  {
    id: 'divination-cleric-35e',
    name: 'Divination',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'divination',
    castingTime: {
      type: 'minutes',
      minutes: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Provides useful advice for specific proposed actions.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'divine-power-cleric-35e',
    name: 'Divine Power',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'You gain attack bonus, +6 to Str, and 1 hp/level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'dominate-person-35e',
    name: 'Dominate Person',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'You attempt to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration.',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 5,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'enervation-35e',
    name: 'Enervation',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    concentration: false,
    ritual: false,
    description:
      'You point your finger and utter the incantation, releasing a black ray of crackling negative energy that suppresses the life force of any living creature it strikes. You must make a ranged touch attack to hit. If the attack succeeds, the subject gains 1d4 temporary negative levels.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'enlarge-person-mass-35e',
    name: 'Enlarge Person, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: true,
      materialDescription: 'Powdered iron',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "This spell functions like enlarge person, except that it affects multiple creatures. This spell causes instant growth of a humanoid creature, doubling its height and multiplying its weight by 8. This increase changes the creature's size category to the next larger one.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'fear-spell-35e',
    name: 'Fear',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    areaOfEffect: {
      type: 'cone',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Feather or heart of hen',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'An invisible cone of terror causes each living creature in the area to become panicked unless it succeeds on a Will save. If cornered, a panicked creature begins cowering. If the Will save succeeds, the creature is shaken for 1 round.',
    savingThrow: {
      attribute: 'wis',
      success: 'half',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'fire-shield-35e',
    name: 'Fire Shield',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Phosphorus for warm shield; bit of ice for chill shield',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell wreathes you in flame and causes damage to each creature that attacks you in melee. The flames also protect you from either cold-based or fire-based attacks (your choice). Any creature striking you with its body or a handheld weapon deals normal damage, but at the same time the attacker takes 1d6+1 per caster level (maximum +15) fire or cold damage.',
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6+1',
      },
      type: 'fire',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'fire-trap-35e',
    name: 'Fire Trap',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Gold dust worth 25 gp',
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'Fire trap creates a fiery explosion when an intruder opens the item that the trap protects. A fire trap can ward any object that can be opened and closed. When the trap is triggered, a fiery explosion erupts dealing 1d4+1 per caster level (max +20) fire damage.',
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4+1',
      },
      type: 'fire',
    },
    classes: ['druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'flame-strike-druid-35e',
    name: 'Flame Strike',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Smite foes with divine fire (1d6/level damage).',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'freedom-movement-cleric-35e',
    name: 'Freedom of Movement',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Subject moves normally despite impediments.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'freedom-movement-druid-35e',
    name: 'Freedom of Movement',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Subject moves normally despite impediments.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'freedom-of-movement-35e',
    name: 'Freedom of Movement',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Leather strap bound to the target',
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell enables you or a creature you touch to move and attack normally for the duration of the spell, even under the influence of magic that usually impedes movement, such as paralysis, solid fog, slow, and web. The subject automatically succeeds on any grapple check made to resist a grapple attempt, as well as on grapple checks or Escape Artist checks made to escape a grapple or a pin.',
    classes: ['bard', 'cleric', 'druid', 'ranger'],
    levelsByClass: {
      bard: 4,
      cleric: 4,
      druid: 4,
      ranger: 4,
    },
  },
  {
    id: 'geas-lesser-35e',
    name: 'Geas, Lesser',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      'A lesser geas places a magical command on a creature to carry out some service or to refrain from some action or course of activity, as desired by you. The creature must have 7 or fewer Hit Dice and be able to understand you. While a geas cannot compel a creature to kill itself or perform acts that would result in certain death, it can cause almost any other course of activity.',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'giant-vermin-cleric-35e',
    name: 'Giant Vermin',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Turns centipedes, scorpions, or spiders into giant vermin.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'giant-vermin-druid-35e',
    name: 'Giant Vermin',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Turns centipedes, scorpions, or spiders into giant vermin.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'globe-of-invulnerability-lesser-35e',
    name: 'Globe of Invulnerability, Lesser',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      material: true,
      materialDescription: 'Glass or crystal bead',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'An immobile, faintly shimmering magical sphere surrounds you and excludes all spell effects of 3rd level or lower. The area or effect of any such spells does not include the area of the lesser globe of invulnerability.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'hallucinatory-terrain-35e',
    name: 'Hallucinatory Terrain',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    areaOfEffect: {
      type: 'cube',
      feet: 30,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Stone, twig, and bit of green plant',
    },
    duration: {
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description:
      'You make natural terrain look, sound, and smell like some other sort of natural terrain. Structures, equipment, and creatures within the area are not hidden or changed in appearance.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'ice-storm-druid-35e',
    name: 'Ice Storm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Hail deals 5d6 damage in cylinder 40 ft. across.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'ice-storm-35e',
    name: 'Ice Storm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 20,
      height: 40,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Dust and water',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "Great magical hailstones pound down for 1 full round, dealing 3d6 points of bludgeoning damage and 2d6 points of cold damage to every creature in the area. A -4 penalty applies to each Listen check made within the ice storm's effect, and all land movement within its area is at half speed.",
    damage: {
      base: {
        count: 3,
        die: 'd6',
        notation: '3d6',
      },
      type: 'bludgeoning',
    },
    classes: ['druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'imbue-spell-ability-cleric-35e',
    name: 'Imbue with Spell Ability',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'evocation',
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
      material: false,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Transfer spells to subject.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'inflict-critical-wounds-cleric-35e',
    name: 'Inflict Critical Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Touch attack, 4d8 damage +1/level (max +20).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'invisibility-greater-35e',
    name: 'Invisibility, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "This spell functions like invisibility, except that it doesn't end if the subject attacks. The spell ends if the subject makes an attack that directly affects the enemy (not just an area effect).",
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'locate-creature-35e',
    name: 'Locate Creature',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      material: true,
      materialDescription: 'Bit of fur from bloodhound',
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "This spell functions like locate object, except this spell locates a known or familiar creature. You slowly turn and sense when you are facing the direction of the creature, as long as the creature is within range. You can sense the general direction of the creature's location, as long as it is within range.",
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'magic-weapon-greater-cleric-35e',
    name: 'Magic Weapon, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description: '+1 bonus/four levels (max +5).',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'minor-creation-35e',
    name: 'Minor Creation',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 0,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Small piece of matter of same type as item being created',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a nonmagical, unattended object of nonliving, vegetable matter. The volume of the item created cannot exceed 1 cubic foot per caster level. You must succeed on an appropriate skill check to make a complex item. Attempting to use any created object as a material component causes the spell to fail.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'neutralize-poison-cleric-35e',
    name: 'Neutralize Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Immunizes subject against poison, detoxifies venom in or on subject.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'phantasmal-killer-35e',
    name: 'Phantasmal Killer',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You create a phantasmal image of the most fearsome creature imaginable to the subject simply by forming the fears of the subject's subconscious mind into something that its conscious mind can visualize. Only the spell's subject can see the phantasmal killer. If the subject of a phantasmal killer attack succeeds in disbelieving and possesses more than twice your caster level in Hit Dice, the phantasmal killer can turn on you and attack you.",
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'planar-ally-lesser-cleric-35e',
    name: 'Planar Ally, Lesser',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Exchange services with a 6 HD extraplanar creature.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'poison-spell-cleric-35e',
    name: 'Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'polymorph-self-35e',
    name: 'Polymorph',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: true,
      materialDescription: 'Caterpillar cocoon',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell transforms a willing creature into an animal, humanoid, or elemental of your choosing; the spell has no effect on unwilling creatures, nor can the creature being targeted by this spell influence the new form assumed. The new form may be of the same type as the subject or any of the following types: aberration, animal, dragon, fey, giant, humanoid, magical beast, monstrous humanoid, ooze, plant, or vermin.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'rainbow-pattern-35e',
    name: 'Rainbow Pattern',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    areaOfEffect: {
      type: 'cube',
      feet: 20,
    },
    components: {
      verbal: false,
      somatic: false,
      material: true,
      materialDescription: 'Piece of phosphor',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: true,
    ritual: false,
    description:
      "A glowing, rainbow-hued pattern of interweaving colors fascinates those within it. Rainbow pattern fascinates a maximum of 24 Hit Dice of creatures. Creatures with the fewest HD are affected first. Among creatures with equal HD, those who are closest to the spell's point of origin are affected first.",
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'reincarnate-druid-35e',
    name: 'Reincarnate',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'transmutation',
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Brings dead subject back in a random body.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'repel-vermin-cleric-35e',
    name: 'Repel Vermin',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Insects, spiders, and other vermin stay 10 ft. away.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'repel-vermin-druid-35e',
    name: 'Repel Vermin',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Insects, spiders, and other vermin stay 10 ft. away.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'resilient-sphere-35e',
    name: 'Resilient Sphere',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'evocation',
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
      materialDescription:
        'Hemispherical piece of clear crystal, a matching hemispherical piece of gum arabic',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "A globe of shimmering force encloses a creature, provided the creature is small enough to fit within the diameter of the sphere. The sphere contains its subject for the spell's duration. The sphere is not subject to damage of any sort except from a rod of cancellation, a rod of negation, a disintegrate spell, or a targeted dispel magic spell.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'restoration-cleric-35e',
    name: 'Restoration',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Restores level and ability score drains.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'rusting-grasp-druid-35e',
    name: 'Rusting Grasp',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Your touch corrodes iron and alloys.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'scrying-druid-35e',
    name: 'Scrying',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'divination',
    castingTime: {
      type: 'hour',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Spies on subject from a distance.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'scrying-35e',
    name: 'Scrying',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'unlimited',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'Focus worth 1,000 gp such as crystal ball, silver mirror, or font of holy water',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You can see and hear some creature, which may be at any distance. If the subject succeeds on a Will save, the scrying attempt simply fails. The difficulty of the save depends on how well you know the subject and what sort of physical connection (if any) you have to that creature.',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      cleric: 4,
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'secure-shelter-35e',
    name: 'Secure Shelter',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 20,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Square chip of stone, clay, loam, or sand',
    },
    duration: {
      type: 'hours',
      hours: 2,
    },
    concentration: false,
    ritual: false,
    description:
      'You conjure a sturdy cottage or lodge made of material that is common in the area where the spell is cast. The floor is level, clean, and dry. The lodging has a sturdy door, two or more shuttered windows, and a small fireplace.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'sending-cleric-35e',
    name: 'Sending',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'evocation',
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Delivers short message anywhere, instantly.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'shadow-conjuration-35e',
    name: 'Shadow Conjuration',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 1,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You use material from the Plane of Shadow to shape quasi-real illusions of one or more creatures, objects, or forces. Shadow conjuration can mimic any sorcerer or wizard conjuration (summoning) or conjuration (creation) spell of 3rd level or lower. Shadow conjurations are only one-fifth (20%) as strong as the real things.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'shout-35e',
    name: 'Shout',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    areaOfEffect: {
      type: 'cone',
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
    concentration: false,
    ritual: false,
    description:
      'You emit an ear-splitting yell that deafens and damages creatures in its path. Any creature within the area is deafened for 2d6 rounds and takes 5d6 points of sonic damage. A successful save negates the deafness and reduces the damage by half.',
    damage: {
      base: {
        count: 5,
        die: 'd6',
        notation: '5d6',
      },
      type: 'thunder',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'spell-immunity-cleric-35e',
    name: 'Spell Immunity',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Subject is immune to one spell per four levels.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'spell-immunity-35e',
    name: 'Spell Immunity',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Diamond worth 500 gp',
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'The warded creature is immune to the effects of one specified spell for every four levels you have. The spells must be of 4th level or lower. The warded creature effectively has unbeatable spell resistance regarding the specified spell(s).',
    classes: ['cleric', 'paladin'],
    levelsByClass: {
      cleric: 4,
      paladin: 4,
    },
  },
  {
    id: 'spike-stones-druid-35e',
    name: 'Spike Stones',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
    description: 'Creatures in area take 1d8 damage, may be slowed.',
    classes: ['druid'],
    levelsByClass: {
      druid: 4,
    },
  },
  {
    id: 'stone-shape-35e',
    name: 'Stone Shape',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Soft clay',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You can form an existing piece of stone into any shape that suits your purpose. While it's possible to make crude coffers, doors, and so forth, fine detail isn't possible. There is a 30% chance that any shape including moving parts simply doesn't work.",
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 4,
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'stoneskin-35e',
    name: 'Stoneskin',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Diamond dust worth 250 gp',
    },
    duration: {
      type: 'hours',
      hours: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'The warded creature gains damage reduction 10/adamantine. The subject gains resistance to blows, cuts, stabs, and slashes. The spell reduces physical damage by 10 points. Once the spell has prevented a total of 10 points of damage per caster level (maximum 150 points), it is discharged.',
    classes: ['druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'summon-monster-iv-cleric-35e',
    name: 'Summon Monster IV',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      cleric: 4,
    },
  },
  {
    id: 'summon-monster-4-35e',
    name: 'Summon Monster IV',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell summons an extraplanar creature (typically an outsider, elemental, or magical beast native to another plane). It appears where you designate and acts immediately, on your turn. It attacks your opponents to the best of its ability. The spell conjures one of the creatures from the 4th-level list, 1d3 creatures of the same kind from the 3rd-level list, or 1d4+1 creatures of the same kind from a lower-level list.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 4,
      cleric: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'summon-natures-ally-iv-druid-35e',
    name: "Summon Nature's Ally IV",
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      druid: 4,
    },
  },
  {
    id: 'tongues-cleric-35e',
    name: 'Tongues',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 4,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Speak any language.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 4,
    },
  },
  {
    id: 'wall-of-fire-35e',
    name: 'Wall of Fire',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Small piece of phosphorus',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'An immobile, blazing curtain of shimmering violet fire springs into existence. One side of the wall, selected by you, sends forth waves of heat, dealing 2d4 points of fire damage to creatures within 10 feet and 1d4 points of fire damage to those past 10 feet but within 20 feet. The wall deals this damage when it appears and on your turn each round to all creatures in the area.',
    damage: {
      base: {
        count: 2,
        die: 'd4',
        notation: '2d4',
      },
      type: 'fire',
    },
    classes: ['druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      druid: 4,
      sorcerer: 4,
      wizard: 4,
    },
  },
  {
    id: 'wall-of-ice-35e',
    name: 'Wall of Ice',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      materialDescription: 'Small piece of quartz or similar rock crystal',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell creates an anchored plane of ice or a hemisphere of ice, depending on the version selected. A wall of ice cannot form in an area occupied by physical objects or creatures. Its surface must be smooth and unbroken when created. Fire can melt a wall of ice, and it deals full damage to the wall. Suddenly melting a wall of ice creates a great cloud of steamy fog.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 4,
      wizard: 4,
    },
  },
];
