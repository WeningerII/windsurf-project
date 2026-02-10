import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Cantrips Spells (SRD)
export const cantrips: Spell[] = [
  {
    id: 'acid-splash-35e',
    name: 'Acid Splash',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You hurl a glob of acid. You must make a ranged touch attack to hit your target. You deal 1d4 points of acid damage.',
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4'
      },
      type: 'acid'
    },
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'arcane-marks-35e',
    name: 'Arcane Mark',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'permanent'
    },
    concentration: false,
    ritual: false,
    description: 'This spell allows you to inscribe your personal rune or mark, which takes up one square foot of space. The mark can be placed on a permanent surface such as a wall. An arcane mark spell enables you to etch the rune upon any substance without harm to the material upon which it is placed.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'bleed-35e',
    name: 'Bleed',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'necromancy',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 30
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You cause a living creature that has 0 hit points but is still alive to resume dying. The creature drops to -1 hit points and is dying.',
    classes: [
      'cleric',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      cleric: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'chill-35e',
    name: 'Chill Touch',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'necromancy',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 30
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'A touch from you, whether from a distance or close up, saps vital energy from a living creature or makes an undead creature stagger. You must make a melee touch attack. The target takes 1d6 points of damage, and you gain temporary hit points equal to the damage dealt.',
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6'
      },
      type: 'cold'
    },
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'create-water-35e',
    name: 'Create Water',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 25
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'This spell generates wholesome, drinkable water, just like clean rain water. Water created this way can be used for cooking, drinking, and washing. The water must be consumed within one day or it becomes stale.',
    classes: [
      'cleric',
      'druid',
      'paladin',
      'ranger'
    ],
    levelsByClass: {
      cleric: 0,
      druid: 0,
      paladin: 0,
      ranger: 0
    }
  },
  {
    id: 'create-water-cleric-35e',
    name: 'Create Water',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 25
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Creates 2 gallons/level of pure water.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'create-water-druid-35e',
    name: 'Create Water',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 25
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Creates 2 gallons/level of pure water.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'cure-minor-wounds-cleric-35e',
    name: 'Cure Minor Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Cures 1 point of damage.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'cure-minor-wounds-druid-35e',
    name: 'Cure Minor Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Cures 1 point of damage.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'dancing-lights-35e',
    name: 'Dancing Lights',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 120
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A bit of phosphorus or wychwood, or a glowing insect'
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: true,
    ritual: false,
    description: 'You create up to four lights, each resembling a torch, floating in the air. You can move them up to 60 feet per round. A light dims if moved beyond the spell\'s range.',
    classes: [
      'bard',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'daze-35e',
    name: 'Daze',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'enchantment',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'This spell clouds the mind of a humanoid creature with 4 or fewer Hit Dice so that it takes no actions. Undead are not affected, nor are creatures with more than 4 Hit Dice.',
    savingThrow: {
      attribute: 'will',
      success: 'none'
    },
    classes: [
      'bard',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'detect-magic-35e',
    name: 'Detect Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'rounds',
      rounds: 10
    },
    concentration: true,
    ritual: false,
    description: 'You detect magical auras. The amount of information revealed depends on how long you study a particular area or subject. 1st Round: Presence or absence of magical auras. 2nd Round: Number of magical auras and the power of the most potent aura. 3rd Round: The strength and location of each aura.',
    classes: [
      'bard',
      'cleric',
      'druid',
      'paladin',
      'ranger',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      cleric: 0,
      druid: 0,
      paladin: 0,
      ranger: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'detect-magic-cleric-35e',
    name: 'Detect Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'rounds',
      rounds: 10
    },
    concentration: true,
    ritual: false,
    description: 'Detects spells and magic items within 60 ft.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'detect-magic-druid-35e',
    name: 'Detect Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'rounds',
      rounds: 10
    },
    concentration: true,
    ritual: false,
    description: 'Detects spells and magic items within 60 ft.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'detect-poison-35e',
    name: 'Detect Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You determine whether a creature, object, or area has been poisoned or is poisonous. You can determine the exact type of poison with a successful Craft (alchemy) check.',
    classes: [
      'cleric',
      'druid',
      'paladin',
      'ranger'
    ],
    levelsByClass: {
      cleric: 0,
      druid: 0,
      paladin: 0,
      ranger: 0
    }
  },
  {
    id: 'detect-poison-cleric-35e',
    name: 'Detect Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 25
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Detects poison in one creature or object.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'detect-poison-druid-35e',
    name: 'Detect Poison',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 25
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Detects poison in one creature or object.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'disrupt-undead-35e',
    name: 'Disrupt Undead',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 30
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You direct a ray of positive energy. You must make a ranged touch attack to hit. An undead creature hit by this spell takes 1d6 points of damage.',
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6'
      },
      type: 'necrotic'
    },
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'flare-druid-35e',
    name: 'Flare',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 25
    },
    components: {
      verbal: false,
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Dazzles one creature (-1 penalty on attack rolls).',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'flare-35e',
    name: 'Flare',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 100
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'A burst of bright light springs from your hand. If this spell is cast against a light-sensitive creature, that creature is blinded for 1 round.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'ghost-sound-35e',
    name: 'Ghost Sound',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'A bit of wool or a small lump of fat'
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: true,
    ritual: false,
    description: 'You create a minor illusory sound that originates from a point of your choice within range. Only you and creatures within 5 feet of the point can hear the sound.',
    classes: [
      'bard',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'guidance-cleric-35e',
    name: 'Guidance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: '+1 on one attack roll, saving throw, or skill check.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'guidance-druid-35e',
    name: 'Guidance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: '+1 on one attack roll, saving throw, or skill check.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'inflict-minor-wounds-cleric-35e',
    name: 'Inflict Minor Wounds',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'necromancy',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Touch attack, 1 point of damage.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'know-direction-druid-35e',
    name: 'Know Direction',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'self'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You discern north.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'know-direction-35e',
    name: 'Know Direction',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'self'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You instantly know the direction of north from your current location. Nothing can reorient you to confuse this sense.',
    classes: [
      'bard',
      'druid',
      'ranger'
    ],
    levelsByClass: {
      bard: 0,
      druid: 0,
      ranger: 0
    }
  },
  {
    id: 'light-cleric-35e',
    name: 'Light',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 10
    },
    concentration: false,
    ritual: false,
    description: 'Object shines like a torch.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'light-druid-35e',
    name: 'Light',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'hours',
      hours: 1
    },
    concentration: false,
    ritual: false,
    description: 'Object shines like a torch.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'light-35e',
    name: 'Light',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'hours',
      hours: 1
    },
    concentration: false,
    ritual: false,
    description: 'This spell causes an object to glow like a torch, shedding bright light in a 20-foot radius and shadowy light for an additional 20 feet. The spell can be cast on a handheld object. Shedding light does not use up the spell.',
    classes: [
      'bard',
      'cleric',
      'druid',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      cleric: 0,
      druid: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'mending-cleric-35e',
    name: 'Mending',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 10
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Makes minor repairs on an object.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'mending-druid-35e',
    name: 'Mending',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 10
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Makes minor repairs on an object.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'mending-35e',
    name: 'Mending',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'This spell repairs small breaks or tears in objects (but not warps, such as might be caused by a heat effect). It will weld broken metallic objects such as a ring, a chain link, or a medallion, provided that the break or tear is very small. It will also repair ceramic or wooden objects, unless they have been warped or evaporated.',
    classes: [
      'bard',
      'cleric',
      'druid',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      cleric: 0,
      druid: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'prestidigitation-35e',
    name: 'Prestidigitation',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 10
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'hours',
      hours: 1
    },
    concentration: false,
    ritual: false,
    description: 'Prestidigitations are minor tricks that novice spellcasters use for practice. Once cast, a prestidigitation spell enables you to perform simple magical effects for 1 hour. The effects are minor and have severe limitations.',
    classes: [
      'bard',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'purify-food-drink-cleric-35e',
    name: 'Purify Food and Drink',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 10
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Purifies 1 cu. ft./level of food or water.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'purify-food-drink-druid-35e',
    name: 'Purify Food and Drink',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 10
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Purifies 1 cu. ft./level of food or water.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'ray-of-frost-35e',
    name: 'Ray of Frost',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'A ray of freezing air springs from your hand. You must make a ranged touch attack to hit. The creature takes 1d4 points of cold damage, and its speed is reduced by 10 feet until the end of your next turn.',
    damage: {
      base: {
        count: 1,
        die: 'd4',
        notation: '1d4'
      },
      type: 'cold'
    },
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'read-magic-cleric-35e',
    name: 'Read Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'self'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 10
    },
    concentration: false,
    ritual: false,
    description: 'Read scrolls and spellbooks.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'read-magic-druid-35e',
    name: 'Read Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'self'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 10
    },
    concentration: false,
    ritual: false,
    description: 'Read scrolls and spellbooks.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'read-magic-35e',
    name: 'Read Magic',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'self'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 10
    },
    concentration: true,
    ritual: false,
    description: 'By means of this spell, you can read magical inscriptions on objects—books, scrolls, weapons, and the like—that would otherwise be unintelligible. This spell does not decipher secret messages written in ordinary ink or treasure maps.',
    classes: [
      'bard',
      'cleric',
      'druid',
      'paladin',
      'ranger',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 0,
      cleric: 0,
      druid: 0,
      paladin: 0,
      ranger: 0,
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'resistance-cleric-35e',
    name: 'Resistance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: 'Subject gains +1 on saving throws.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'resistance-druid-35e',
    name: 'Resistance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'abjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: 'Subject gains +1 bonus on saving throws.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  },
  {
    id: 'shocking-grasp-35e',
    name: 'Shocking Grasp',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Your touch delivers a shock. You must make a melee touch attack. The target takes 1d6 points of lightning damage. If the target is wearing metal armor, you gain a +2 bonus to your touch attack roll.',
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6'
      },
      type: 'lightning'
    },
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 0,
      wizard: 0
    }
  },
  {
    id: 'virtue-cleric-35e',
    name: 'Virtue',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: 'Subject gains 1 temporary hp.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 0
    }
  },
  {
    id: 'virtue-druid-35e',
    name: 'Virtue',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: 'Subject gains 1 temporary hp.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 0
    }
  }
];
