import { Spell } from '../../../../types/magic/spells';

// D&D 3.5e Level 7 Spells (SRD)
export const level7Spells: Spell[] = [
  {
    id: 'animate-plants-druid-35e',
    name: 'Animate Plants',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'transmutation',
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
      somatic: false,
      material: false
    },
    duration: {
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'One or more plants animate and fight for you.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'blasphemy-cleric-35e',
    name: 'Blasphemy',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 40
    },
    components: {
      verbal: true,
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Kills, paralyzes, weakens, or dazes nonevil subjects.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'changestaff-druid-35e',
    name: 'Changestaff',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      type: 'hours',
      hours: 1
    },
    concentration: false,
    ritual: false,
    description: 'Your staff becomes a treant on command.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'control-weather-cleric-35e',
    name: 'Control Weather',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'transmutation',
    castingTime: {
      type: 'minutes',
      minutes: 10
    },
    range: {
      type: 'ranged',
      feet: 2
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'hours',
      hours: 4
    },
    concentration: false,
    ritual: false,
    description: 'Changes weather in local area.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'control-weather-druid-35e',
    name: 'Control Weather',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'transmutation',
    castingTime: {
      type: 'minutes',
      minutes: 10
    },
    range: {
      type: 'ranged',
      feet: 2
    },
    components: {
      verbal: true,
      somatic: true,
      material: false
    },
    duration: {
      type: 'hours',
      hours: 4
    },
    concentration: false,
    ritual: false,
    description: 'Changes weather in local area.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'creeping-doom-druid-35e',
    name: 'Creeping Doom',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: 'Swarms of centipedes attack at your command.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'cure-moderate-mass-druid-35e',
    name: 'Cure Moderate Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
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
    description: 'Cures 2d8 damage +1/level for many creatures.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'cure-serious-mass-cleric-35e',
    name: 'Cure Serious Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
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
    description: 'Cures 3d8 damage +1/level for many creatures.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'destruction-cleric-35e',
    name: 'Destruction',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      material: true
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Kills subject and destroys remains.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'dictum-cleric-35e',
    name: 'Dictum',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 40
    },
    components: {
      verbal: true,
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Kills, paralyzes, slows, or deafens nonlawful subjects.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'ethereal-jaunt-cleric-35e',
    name: 'Ethereal Jaunt',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'transmutation',
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
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'You become ethereal for 1 round/level.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'fire-storm-druid-35e',
    name: 'Fire Storm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
    description: 'Deals 1d6/level fire damage.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'forceful-hand-35e',
    name: 'Forceful Hand',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      material: false
    },
    duration: {
      type: 'rounds',
      rounds: 1
    },
    concentration: true,
    ritual: false,
    description: 'You create a Large hand of shimmering, translucent force in an unoccupied space that you can see within range. The hand lasts for the spell\'s duration, and it moves at your command, mimicking the movements of your own hand.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'shadow-evocation-greater-35e',
    name: 'Greater Shadow Evocation',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'illusion',
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
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You create a shadowy evocation of a spell of 6th level or lower. The shadowy evocation appears real, including interactions with the environment, but a creature that interacts with it can determine that it is an illusion with a successful Intelligence (Investigation) check.',
    classes: [
      'wizard'
    ],
    levelsByClass: {
      wizard: 7
    }
  },
  {
    id: 'heal-druid-35e',
    name: 'Heal',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
    description: 'Cures 10 points/level of damage, all diseases and mental conditions.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'holy-word-cleric-35e',
    name: 'Holy Word',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 40
    },
    components: {
      verbal: true,
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Kills, paralyzes, blinds, or deafens nongood subjects.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'inflict-serious-mass-cleric-35e',
    name: 'Inflict Serious Wounds, Mass',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
    description: 'Deals 3d8 damage +1/level to many creatures.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'limited-wish-35e',
    name: 'Limited Wish',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'self'
    },
    components: {
      verbal: true,
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'A limited wish spell allows you to alter reality in a minor way. It can produce any one of the following effects: Duplicate any sorcerer/wizard spell of 6th level or lower, provided the spell is not of a school prohibited to you.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'mass-misdirection-35e',
    name: 'Mass Misdirection',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'illusion',
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
      material: true,
      materialDescription: 'A small object from the creature that the illusion is to be based on'
    },
    duration: {
      type: 'hours',
      hours: 8
    },
    concentration: false,
    ritual: false,
    description: 'This spell functions like misdirection, except that it affects up to one creature per caster level, and you can redirect each creature\'s sensory input separately.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'power-word-blind-35e',
    name: 'Power Word Blind',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'enchantment',
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
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You utter a word of power that can blind one creature that you can see within range. If the creature you choose has 100 hit points or fewer, it is blinded. Otherwise, the spell has no effect.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'refuge-cleric-35e',
    name: 'Refuge',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      material: true
    },
    duration: {
      type: 'permanent'
    },
    concentration: false,
    ritual: false,
    description: 'Alters item to transport its possessor to you.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'regenerate-cleric-35e',
    name: 'Regenerate',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 3
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
    description: 'Subject\'s severed limbs grow back, cures 4d8 damage +1/level (max +35).',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'repulsion-cleric-35e',
    name: 'Repulsion',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'abjuration',
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
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'Creatures can\'t approach you.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'restoration-greater-cleric-35e',
    name: 'Restoration, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 3
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: true
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'As restoration, plus restores all levels and ability scores.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'resurrection-cleric-35e',
    name: 'Resurrection',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
    castingTime: {
      type: 'minutes',
      minutes: 10
    },
    range: {
      type: 'touch'
    },
    components: {
      verbal: true,
      somatic: true,
      material: true
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Fully restore dead subject.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'reversal-of-fortune-35e',
    name: 'Reversal of Fortune',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'evocation',
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
    description: 'You can reverse the results of a single d20 roll made by a creature you can see within range. You can choose to use this ability after the roll is made but before the outcome is determined.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'scrying-greater-cleric-35e',
    name: 'Scrying, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'sight'
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
    description: 'As scrying, but faster and longer.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'scrying-greater-druid-35e',
    name: 'Scrying, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'sight'
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
    description: 'As scrying, but faster and longer.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'sequester-35e',
    name: 'Sequester',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      material: true,
      materialDescription: 'A basilisk eyelash, gum arabic, and a dram of liquified diamond (worth 1,500 gp)'
    },
    duration: {
      type: 'permanent'
    },
    concentration: false,
    ritual: false,
    description: 'This spell protects a creature or object against scrying and magical location. The target is hidden from all divination magic. If the target is a creature, it can\'t be located by any means short of a wish spell or direct intervention by a deity.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'shadow-evocation-35e',
    name: 'Shadow Evocation',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'illusion',
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
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'You tap into the Shadowfell to cast a spell that mimics an evocation spell of 4th level or lower. The spell must be one that creates a physical effect, and the spell\'s effects appear shadowy and unreal.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'summon-monster-vii-cleric-35e',
    name: 'Summon Monster VII',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
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
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'Calls extraplanar creature to fight for you.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'summon-monster-7-35e',
    name: 'Summon Monster VII',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
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
      type: 'rounds',
      rounds: 1
    },
    concentration: true,
    ritual: false,
    description: 'You can summon one creature from the 7th-level list, or multiple creatures from lower-level lists.',
    classes: [
      'bard',
      'cleric',
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      bard: 7,
      cleric: 7,
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'summon-natures-ally-vii-druid-35e',
    name: 'Summon Nature\'s Ally VII',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
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
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'Calls creature to fight.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'sunbeam-druid-35e',
    name: 'Sunbeam',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'Beam blinds and deals 4d6 damage.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'sunbeam-35e',
    name: 'Sunbeam',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    areaOfEffect: {
      type: 'line',
      length: 60,
      width: 5
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'Sunstone and fire source'
    },
    duration: {
      type: 'rounds',
      rounds: 1
    },
    concentration: false,
    ritual: false,
    description: 'For the duration of this spell, you can use a standard action to evoke a dazzling beam of intense light each round. You can call forth one beam per three caster levels (maximum six beams at 18th level). The spell ends when its duration runs out or your allotment of beams is exhausted. Each creature in the beam is blinded and takes 4d6 points of damage. Any creatures to which sunlight is harmful or unnatural take double damage.',
    damage: {
      base: {
        count: 4,
        die: 'd6',
        notation: '4d6'
      },
      type: 'radiant'
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half'
    },
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'symbol-stunning-cleric-35e',
    name: 'Symbol of Stunning',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'enchantment',
    castingTime: {
      type: 'minutes',
      minutes: 10
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: true
    },
    duration: {
      type: 'permanent'
    },
    concentration: false,
    ritual: false,
    description: 'Triggered rune stuns nearby creatures.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'symbol-weakness-cleric-35e',
    name: 'Symbol of Weakness',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'necromancy',
    castingTime: {
      type: 'minutes',
      minutes: 10
    },
    range: {
      type: 'ranged',
      feet: 60
    },
    components: {
      verbal: true,
      somatic: true,
      material: true
    },
    duration: {
      type: 'permanent'
    },
    concentration: false,
    ritual: false,
    description: 'Triggered rune weakens nearby creatures.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  },
  {
    id: 'teleport-greater-35e',
    name: 'Teleport, Greater',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'conjuration',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'unlimited'
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
    description: 'This spell functions like teleport, except that there is no range limit and, there is no chance you arrive off target. In addition, you do not leave a body behind on the Material Plane if this spell is dispelled.',
    classes: [
      'sorcerer',
      'wizard'
    ],
    levelsByClass: {
      sorcerer: 7,
      wizard: 7
    }
  },
  {
    id: 'transmute-metal-wood-druid-35e',
    name: 'Transmute Metal to Wood',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'transmutation',
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
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Metal within 40 ft. becomes wood.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'true-seeing-druid-35e',
    name: 'True Seeing',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      material: true
    },
    duration: {
      type: 'minutes',
      minutes: 1
    },
    concentration: false,
    ritual: false,
    description: 'Lets you see all things as they really are.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'wind-walk-druid-35e',
    name: 'Wind Walk',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
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
      type: 'hours',
      hours: 1
    },
    concentration: false,
    ritual: false,
    description: 'You and your allies turn vaporous and travel fast.',
    classes: [
      'druid'
    ],
    levelsByClass: {
      druid: 7
    }
  },
  {
    id: 'word-chaos-cleric-35e',
    name: 'Word of Chaos',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    level: 7,
    school: 'evocation',
    castingTime: {
      type: 'action',
      amount: 1
    },
    range: {
      type: 'ranged',
      feet: 40
    },
    components: {
      verbal: true,
      somatic: false,
      material: false
    },
    duration: {
      type: 'instant'
    },
    concentration: false,
    ritual: false,
    description: 'Kills, confuses, stuns, or deafens nonchaotic subjects.',
    classes: [
      'cleric'
    ],
    levelsByClass: {
      cleric: 7
    }
  }
];
