import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Level 5 Spells (SRD)
export const level5Spells: Spell[] = [
  {
    id: 'animal-growth-druid-35e',
    name: 'Animal Growth',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'One animal/two levels doubles in size.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'atonement-cleric-35e',
    name: 'Atonement',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'abjuration',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Removes burden of misdeeds from subject.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'atonement-druid-35e',
    name: 'Atonement',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'abjuration',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Removes burden of misdeeds from subject.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'awaken-druid-35e',
    name: 'Awaken',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'transmutation',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Animal or tree gains human intellect.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'baleful-polymorph-druid-35e',
    name: 'Baleful Polymorph',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Transforms subject into harmless animal.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'break-enchantment-cleric-35e',
    name: 'Break Enchantment',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'abjuration',
    castingTime: {
      type: 'minutes',
      minutes: 1,
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
    description: 'Frees subjects from enchantments, alterations, curses, and petrification.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'call-lightning-storm-druid-35e',
    name: 'Call Lightning Storm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description: 'As call lightning, but 5d6 damage per bolt.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'command-greater-cleric-35e',
    name: 'Command, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'As command, but affects one subject/level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'commune-cleric-35e',
    name: 'Commune',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Deity answers one yes-or-no question/level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'commune-nature-druid-35e',
    name: 'Commune with Nature',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Learn about terrain for 1 mile/level.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'contact-other-plane-35e',
    name: 'Contact Other Plane',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: true,
    ritual: false,
    description:
      'You mentally contact a demigod, the spirit of a long-dead sage, or some other mysterious entity from another plane. Serving as your intermediary, the entity answers five yes-or-no questions that you pose to it.',
    classes: ['wizard'],
    levelsByClass: {
      wizard: 5,
    },
  },
  {
    id: 'control-winds-druid-35e',
    name: 'Control Winds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'transmutation',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Change wind direction and speed.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'cure-critical-wounds-druid-35e',
    name: 'Cure Critical Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'cure-light-mass-cleric-35e',
    name: 'Cure Light Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description: 'Cures 1d8 damage +1/level for many creatures.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'death-ward-druid-35e',
    name: 'Death Ward',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Grants immunity to all death spells and negative energy effects.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'dismissal-35e',
    name: 'Dismissal',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description:
      'As you cast this spell, you make a melee spell attack against a creature you can reach. On a hit, you attempt to send the creature to another plane of existence. The creature must make a Charisma saving throw.',
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'dispel-chaos-cleric-35e',
    name: 'Dispel Chaos',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 bonus against attacks.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'dispel-evil-cleric-35e',
    name: 'Dispel Evil',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 bonus against attacks.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'dispel-good-cleric-35e',
    name: 'Dispel Good',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 bonus against attacks.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'dispel-law-cleric-35e',
    name: 'Dispel Law',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: '+4 bonus against attacks.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'disrupting-weapon-cleric-35e',
    name: 'Disrupting Weapon',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description: 'Melee weapon destroys undead.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'flame-strike-cleric-35e',
    name: 'Flame Strike',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'hallow-cleric-35e',
    name: 'Hallow',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Designates location as holy.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'hallow-druid-35e',
    name: 'Hallow',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Designates location as holy.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'inflict-light-mass-cleric-35e',
    name: 'Inflict Light Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description: 'Deals 1d8 damage +1/level to many creatures.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'insect-plague-cleric-35e',
    name: 'Insect Plague',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Locust swarms attack creatures.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'insect-plague-druid-35e',
    name: 'Insect Plague',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Locust swarms attack creatures.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'mark-justice-cleric-35e',
    name: 'Mark of Justice',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'necromancy',
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
    description: 'Designates action that will trigger curse on subject.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'plane-shift-cleric-35e',
    name: 'Plane Shift',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'As many as eight subjects travel to another plane.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'raise-dead-cleric-35e',
    name: 'Raise Dead',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 1,
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
    description: 'Restores life to subject who died as long as one day/level ago.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'righteous-might-cleric-35e',
    name: 'Righteous Might',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Your size increases, and you gain combat bonuses.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'scrying-cleric-35e',
    name: 'Scrying',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'slay-living-cleric-35e',
    name: 'Slay Living',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Touch attack kills subject.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'spell-resistance-cleric-35e',
    name: 'Spell Resistance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Subject gains SR 12 + level.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'spell-resistance-35e',
    name: 'Spell Resistance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'The creature you touch gains a benefit depending on its Wisdom modifier. The creature gains spell resistance equal to 12 + its Wisdom modifier.',
    classes: ['cleric', 'druid', 'ranger', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 5,
      druid: 5,
      ranger: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'stoneskin-druid-35e',
    name: 'Stoneskin',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Ignore 10 points of damage per attack.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'summon-monster-v-cleric-35e',
    name: 'Summon Monster V',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      cleric: 5,
    },
  },
  {
    id: 'summon-monster-5-35e',
    name: 'Summon Monster V',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'summon-natures-ally-v-druid-35e',
    name: "Summon Nature's Ally V",
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      druid: 5,
    },
  },
  {
    id: 'symbol-pain-cleric-35e',
    name: 'Symbol of Pain',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description: 'Triggered rune wracks nearby creatures with pain.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'symbol-sleep-cleric-35e',
    name: 'Symbol of Sleep',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
    description: 'Triggered rune puts nearby creatures into catatonic slumber.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'telekinesis-35e',
    name: 'Telekinesis',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: true,
    ritual: false,
    description:
      'You gain the ability to move or manipulate creatures or objects by thought. When you cast the spell, and as your action each turn until the spell ends, you can exert your will on one creature or object you can see within range.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'teleportation-circle-35e',
    name: 'Teleportation Circle',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 10,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: false,
      material: true,
      materialDescription: 'Chalk and incense worth 50 gp',
    },
    duration: {
      type: 'rounds',
      rounds: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a magical circle on the ground. Any creature that steps into the circle is instantly transported to another teleportation circle you designate.',
    classes: ['bard', 'sorcerer', 'wizard'],
    levelsByClass: {
      bard: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'transmute-mud-rock-druid-35e',
    name: 'Transmute Mud to Rock',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Transforms two 10-ft. cubes per level.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'transmute-rock-mud-druid-35e',
    name: 'Transmute Rock to Mud',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description: 'Transforms two 10-ft. cubes per level.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'tree-stride-druid-35e',
    name: 'Tree Stride',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Step from one tree to another far away.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'true-seeing-cleric-35e',
    name: 'True Seeing',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description: 'Lets you see all things as they really are.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'true-seeing-35e',
    name: 'True Seeing',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      material: true,
      materialDescription:
        'An ointment for the eyes that costs 25 gp; is made from mushroom powder, saffron, and fat; and is consumed by the spell',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "For the spell's duration, the creature you touch sees things as they actually are. It sees through illusions, sees creatures and objects that are invisible, and sees the true form of shapeshifters.",
    classes: ['cleric', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'true-seeing-6-35e',
    name: 'True Seeing',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      material: true,
      materialDescription: 'Ointment for eyes worth 250 gp',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You confer on the subject the ability to see all things as they actually are. The subject sees through normal and magical darkness, notices secret doors hidden by magic, sees the exact locations of creatures or objects under blur or displacement effects, sees invisible creatures or objects normally, sees through illusions, and sees the true form of polymorphed, changed, or transmuted things.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
    levelsByClass: {
      cleric: 5,
      druid: 5,
      sorcerer: 5,
      wizard: 5,
    },
  },
  {
    id: 'unhallow-cleric-35e',
    name: 'Unhallow',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Designates location as unholy.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'unhallow-druid-35e',
    name: 'Unhallow',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
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
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Designates location as unholy.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'wall-fire-druid-35e',
    name: 'Wall of Fire',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      rounds: 10,
    },
    concentration: true,
    ritual: false,
    description:
      'Deals 2d4 fire damage out to 10 ft. and 1d4 out to 20 ft. Passing through wall deals 2d6 damage +1/level.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'wall-stone-cleric-35e',
    name: 'Wall of Stone',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description: 'Creates a stone wall that can be shaped.',
    classes: ['cleric'],
    levelsByClass: {
      cleric: 5,
    },
  },
  {
    id: 'wall-thorns-druid-35e',
    name: 'Wall of Thorns',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description: 'Thorns damage anyone who tries to pass.',
    classes: ['druid'],
    levelsByClass: {
      druid: 5,
    },
  },
  {
    id: 'waves-of-fatigue-35e',
    name: 'Waves of Fatigue',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 5,
    school: 'necromancy',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'A wave of negative energy springs from your hand. Each creature in a 30-foot cone originating from you must make a Constitution saving throw. A creature takes 4d12 necrotic damage on a failed save, or half as much on a successful one.',
    damage: {
      base: {
        count: 4,
        die: 'd12',
        notation: '4d12',
      },
      type: 'necrotic',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 5,
      wizard: 5,
    },
  },
];
