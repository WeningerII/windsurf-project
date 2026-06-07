import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level7Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'delayed-blast-fireball-7-pf2e',
    name: 'Delayed Blast Fireball',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'rounds',
      rounds: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 10,
        die: 'd6',
        notation: '10d6',
      },
      type: 'fire',
    },
    concentration: true,
    ritual: false,
    description:
      'A fireball explodes at a point you designate. You can delay the explosion for up to 5 rounds. Each creature takes 10d6 fire damage with a basic Reflex save.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'energy-aegis-pf2e',
    name: 'Energy Aegis',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'abjuration',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    target: '1 creature touched',
    concentration: false,
    ritual: false,
    description:
      'You protect the target with a powerful, multi-layered defense. The target gains resistance 5 to acid, cold, electricity, fire, force, negative, positive, and sonic damage.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (9th): The resistances increase to 10.',
      ranks: {
        9: 'The resistances increase to 10.',
      },
    },
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'ethereal-jaunt-pf2e',
    name: 'Ethereal Jaunt',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'transmutation',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    description:
      'You step into the Ethereal Plane. You can see into the Material Plane from the Ethereal Plane, but not vice versa.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (9th): You can target up to five additional willing creatures at a range of 30 feet. The duration is up to 10 minutes.',
      ranks: {
        9: 'You can target up to five additional willing creatures at a range of 30 feet. The duration is up to 10 minutes.',
      },
    },
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'firestorm-7-pf2e',
    name: 'Firestorm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex save',
    damage: {
      base: {
        count: 14,
        die: 'd6',
        notation: '14d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'You call down a massive firestorm. Creatures in five 10-foot cubes within range must attempt a Reflex save, taking 14d6 fire damage on a failure or half on a success.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'forcecage-7-pf2e',
    name: 'Forcecage',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'hours',
      hours: 1,
    },
    effect: 'An invisible, immobile, cube-shaped prison of magical force',
    concentration: false,
    ritual: false,
    description:
      'An invisible, immobile, cube-shaped prison of magical force springs into being. Nothing can pass through the barrier from either side.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'plane-shift-pf2e',
    name: 'Plane Shift',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'conjuration',
    traditions: ['arcane', 'divine'],
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
    target: 'You and up to 8 willing creatures touched',
    concentration: false,
    ritual: false,
    description:
      'You and up to 8 willing creatures physically enter the Astral Plane or the Ethereal Plane. Alternatively, you can transport yourself and up to 8 willing creatures to another plane of existence.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'power-word-blind-7-pf2e',
    name: 'Power Word Blind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'enchantment',
    traditions: ['arcane'],
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
      type: 'permanent',
    },
    target: '1 creature you can see within range',
    concentration: false,
    ritual: false,
    description:
      'You utter a word of power that blinds one creature you can see. If the creature has fewer than 200 HP, it is blinded.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The levels at which each outcome applies increase by 2.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'prismatic-spray-pf2e',
    name: 'Prismatic Spray',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
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
      'A spray of rainbow light beams cascades from your open hand. Each creature in the area must roll 1d8 on the table below to see which beam affects it, then attempt a saving throw of the indicated type.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'regenerate-7-pf2e',
    name: 'Regenerate',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'necromancy',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    target: '1 creature touched',
    concentration: false,
    ritual: false,
    description:
      'The target regains 15 Hit Points per round for 1 minute. The target also regrows severed body parts and removes the drained condition.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (9th): The regeneration increases to 20.',
      ranks: {
        9: 'The regeneration increases to 20.',
      },
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'reverse-gravity-pf2e',
    name: 'Reverse Gravity',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'evocation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'ranged',
      feet: 120,
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
    areaOfEffect: {
      type: 'cylinder',
      radius: 20,
      height: 40,
    },
    concentration: false,
    ritual: false,
    description:
      "You reverse gravity in a 20-foot radius, 40-foot-tall cylinder. Creatures and objects in the area that aren't secured to the ground immediately fall upward to the top of the area.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'teleport-7-pf2e',
    name: 'Teleport',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 7,
    school: 'conjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    description:
      'You and up to 8 willing creatures are instantly transported to any location on the same plane that you can identify precisely.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'chrysopoetic-curse-pf2e',
    name: 'Chrysopoetic Curse',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You grant the target the gift of riches, giving them the power to turn anything they touch to gold. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target's skin turns their armor and clothing partially to gold. If the target is wearing any armor or clothing, they become .\nFailure As success, but the curse extends to the target's held weapons and other gear. If the target is holding any weapons or other objects, they become Clumsy 3, and the objects' Hardness is reduced by 5.\nCritical Failure The curse becomes even stronger, extending to the surrounding terrain. As failure, and if the creature is standing on a solid surface, the ground in their space transmutes itself into a quagmire of liquid gold. The gold is greater difficult terrain. If the creature leaves its square (or when the curse ends), any affected terrain returns to its original shape and substance and the terrain in the new square transmutes to gold.\nAny objects that were turned to gold return to their previous form and original shape when they leave the target's possession or the spell ends. As long as the target did not critically succeed on their saving throw, 2d6 gp worth of gold flakes and dust are left behind as the curse recedes.",
    classes: ['sorcerer', 'wizard', 'cleric'],
  },
  {
    id: 'contingency-pf2e',
    name: 'Contingency',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      'You prepare a spell that will trigger later. While casting contingency, you also cast another spell of 4th rank or lower with a casting time of no more than 3 actions. This companion spell must be one that can affect you. You must make any decisions for the spell when you cast contingency, such as choosing a damage type for resist energy. During the casting, choose a trigger under which the spell will be cast, using the same restrictions as for the trigger of a Ready action. Once contingency is cast, you can cause the companion spell to come into effect as a reaction with that trigger. It affects only you, even if it would affect more creatures. If you define complicated conditions, as determined by the GM, the trigger might fail. If you cast contingency again, the newer casting supersedes the older.\nHeightened (8th) You can choose a spell of 5th rank or lower.\nHeightened (9th) You can choose a spell of 6th rank or lower.\nHeightened (10th) You can choose a spell of 7th rank or lower.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'devouring-void-pf2e',
    name: 'Devouring Void',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'divine'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: true,
    ritual: false,
    description:
      "Countless tears in space appear in the area, like hungry mouths. When the spell is cast and the first time each round it's sustained, living creatures in its area take 7d8 void damage (basic Fortitude save). A living creature using a move action to leave the area must succeed at a Reflex save or their action is disrupted at the edge of the area.\nHeightened (+1) The void damage increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The void damage increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'cleric'],
  },
  {
    id: 'divine-decree-pf2e',
    name: 'Divine Decree',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'divine',
    traditions: ['divine'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'special',
      description: 'varies',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You utter a potent litany from your faith, a mandate that harms those who oppose your ideals. You deal 7d10 spirit damage to your enemies in the area; each enemy must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is Enfeebled 2 for 1 minute.\nCritical Failure The creature takes double damage and is enfeebled 2 for 1 minute. If you're on your home plane and the creature is not, the creature is sent back to its home plane. A creature of 10th level or lower must also succeed at a Will save or be for 1 minute; if it critically fails, it dies (this is a death effect).\nHeightened (+1) The damage increases by 1d10, and the level of creatures that must attempt a second save on a critical failure increases by 2.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage increases by 1d10, and the level of creatures that must attempt a second save on a critical failure increases by 2.',
    },
    classes: ['cleric'],
  },
  {
    id: 'duplicate-foe-pf2e',
    name: 'Duplicate Foe',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: true,
    ritual: false,
    description:
      "You create a temporary duplicate of an enemy to fight on your behalf. The target can attempt a Fortitude save to disrupt the spell. The duplicate appears in an unoccupied space adjacent to the target and has the target's attack modifier, AC, saving throw modifiers, Perception, and skill modifiers, but it has only 70 Hit Points and lacks the target's special abilities, including immunities, resistances, and weaknesses. It has no magic items except weapon potency runes.\nThe duplicate gains the minion trait, and it can only Stride and Strike. Its Strikes deal the target's normal damage but don't apply added effects, since it doesn't have special abilities. The spell automatically ends if the duplicate's Hit Points drop to 0.\nThe duplicate attacks your enemies to the best of its abilities. You can also try to give it additional instructions; when you Sustain the spell, you can also Command a Minion as part of your action, but the GM determines whether the duplicate follows your command.\nThe duplicate is unstable, so each turn after it takes its actions, it loses 4d6 Hit Points. It's not a living creature, and it can never regain its lost Hit Points in any way.\nCritical Success You fail to create a duplicate.\nSuccess The duplicate deals half damage with its Strikes and the duration is reduced to a maximum of 2 rounds.\nFailure The duplicate works as described.\nHeightened (+1) The level of creature you can target increases by 2. The duplicate has 10 more HP.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'eclipse-burst-pf2e',
    name: 'Eclipse Burst',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'A globe of freezing darkness explodes in the area, dealing 8d10 cold damage to creatures in the area, plus an additional 8d4 void damage to living creatures. Each creature in the area must attempt a Reflex save.\nIf the globe overlaps with an area of magical light or affects a creature affected by magical light, eclipse burst attempts to counteract the light effect.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage.\nCritical Failure The creature takes double damage and becomes by the darkness for an unlimited duration.\nHeightened (+1) The cold damage increases by 1d10 and the void damage against the living increases by 1d4.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The cold damage increases by 1d10 and the void damage against the living increases by 1d4.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'execute-pf2e',
    name: 'Execute',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'divine',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You point at a creature and invoke the demise of all things. The target takes 70 void damage with a basic Fortitude save. If the target is undead or otherwise has void healing, the spell loses the death and void traits and gains the vitality trait, and the target takes 70 vitality damage with a basic Fortitude save.\nHeightened (+1) The damage increases by 10.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 10.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'fiery-body-pf2e',
    name: 'Fiery Body',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    description:
      "You become living flame, giving you fire immunity, resistance 10 to precision damage, and weakness 5 to cold and to water. Any creature that touches you or damages you with an unarmed attack or non-reach melee weapon takes 3d6 fire] damage.\nYour unarmed attacks deal an additional 1d4 fire damage, and your fire spells deal one additional die of fire damage (of the same damage die the spell uses). You can cast as an innate spell; the casting is reduced from 2 actions to 1.\nIn fire form, you have a fly Speed of 40 feet and don't need to breathe.\nHeightened (9th) Creatures touching you take 4d6 fire] damage instead of 3d6, your unarmed attacks deal 2d4 additional fire damage, and you have a fly Speed of 60 feet.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'final-fate-of-the-locust-host-pf2e',
    name: 'Final Fate of the Locust Host',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'special',
      description: 'until the end of your next turn',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You conjure the rotting corpse of Deskari, previously Lord of the Locust Hosts, to the battlefield. Deskari's corpse occupies the space of a Gargantuan creature. The corpse is riddled with vermin, including countless locusts, whose collective movement grants the corpse a Speed of 60 feet and a fly Speed of 60 feet.\nArrive Behold the Rotten Lord Deskari's corpse is unspeakably foul, emitting a putrid stench, and constantly twitches thanks to the movement of the millions of insects and vermin that consume it. A loud, persistent buzzing is created by the clouds of locusts surrounding it like a haze. Each living enemy creature within a must attempt a Fortitude save with the following effects.\nCritical Success The creature is unaffected.\nSuccess The creature is Sickened 2.\nFailure The creature is Sickened 3 and for the duration.\nCritical Failure The creature is Sickened 4, Stunned 1, and deafened for the duration.\nDepart (poison) Feast of the Locust Host The millions of insects and vermin feasting on Deskari pour out of its corpse and surge across the battlefield, consuming your enemies. This swarm deals 5d8 piercing damage and 5d8 poison damage to enemy creatures in a with a basic Reflex save. A creature that critically fails is additionally Drained 2.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'indolent-haze-pf2e',
    name: 'Indolent Haze',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "The faint scent of poppies and a soothing calm fill the area, urging creatures to lay down and take a rest, to do nothing at all, ever again. Creatures in the area when you Cast the Spell must attempt a Will save. Creatures who end their turn in the area must also attempt the save. You can Dismiss the spell.\nCritical Success The creature is unaffected.\nSuccess The creature lies down to rest, becoming . If they were already prone, they instead drift off to sleep, becoming .\nFailure As success, except that the creature is so happy lying down that they cannot attempt to Stand or otherwise maneuver themself off of the ground on their next turn, though they can (potentially to escape the spell's area).\nCritical Failure The creature immediately lies down and drifts off to sleep, becoming prone and unconscious. Any creature in the area who is already unconscious when you Cast the Spell (or whose turn ends in the spell's area while they are unconscious) takes 6d4 spirit damage as their life force is drained away through their dreams. This damage does not automatically wake them.\nHeightened (+1) The spirit damage increases by 2d4.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The spirit damage increases by 2d4.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'interplanar-teleport-pf2e',
    name: 'Interplanar Teleport',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "Requirements You have a planar key for the destination plane, used as a locus\nYou and your allies traverse the barriers between planes of existence. The targets move to another plane, such as the Plane of Fire, the Netherworld, or the Outer Rifts. You must know the destination plane exists and use a magic planar key created from material from that plane as a locus for the spell. While the planar keys for most prominent planes are uncommon, just like the spell interplanar teleport, more obscure planes and demiplanes often have rare or possibly even unique planar keys.\nThe spell is highly imprecise, and you appear 1d20×25 miles from the last place one of the targets (of your choice) was located the last time that target traveled to the plane. If it's the first time traveling to a particular plane for all targets, you appear at a random location on the plane. Interplanar teleport doesn't provide a means of return travel, though casting interplanar teleport again allows you to return to your previous plane unless there are extenuating circumstances.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'lifewood-cage-pf2e',
    name: 'Lifewood Cage',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: true,
    ritual: false,
    description:
      "You create an immobile, prison of hardened wood suffused with vital energy from the Forge of Creation. The cage is a 20-foot cube made of wooden branches, each a half inch thick and a half inch apart. Each creature in the area where you create the cage must attempt a Reflex save. If such a creature fails, it becomes trapped inside the cage. If it succeeds, it's pushed outside the cage into a space of its choice. If a creature in the area is too big to fit inside the prison, the spell automatically fails.\nThe cage has AC 10, Hardness 20, and 40 Hit Points, and it's immune to critical hits and precision damage, though it has weakness 5 to void damage. A creature capable of passing through the space between the bars (typically a Tiny creature) can leave; all others are confined within. The vitality energy suffusing the wood prevents incorporeal undead creatures from passing through the beams. Attacks with a weapon too large to fit between the bars can't pass through the cage, and the bars provide standard cover even against attacks that can pass through the gaps. Spells and most area effects (such as dragon breath) can pass through the cage uninhibited.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'loves-sacrifice-pf2e',
    name: "Love's Sacrifice",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine'],
    castingTime: {
      type: 'reaction',
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You cry out for aid, and a creature near you feels compelled to throw itself in front of the threat as the ultimate expression of their love. A target that genuinely loves the caster without magical compulsion, at their player's or the GM's discretion, fails the save.\nCritical Success The target is unaffected.\nSuccess The creature moves adjacent to you, moving further than its Speed if necessary as the magic compels it to exceed its limits. It takes half the damage you would have taken, while you take the rest. If you would be reduced to 0 Hit Points, you're reduced to 1 instead.\nFailure As success, except they take the full damage. If the damage reduces them to 0 Hit Points, they immediately die; this is a death effect.\nPFS Note: This spell can only be cast on a friendly NPC with GM approval, and on a PC with their player's approval.",
    classes: ['sorcerer', 'wizard', 'cleric'],
  },
  {
    id: 'mask-of-terror-pf2e',
    name: 'Mask of Terror',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'The target appears to be a gruesome and terrifying creature. The effect is unique to each observer, so a human viewing the target might see a demon with bloody fangs, but a demon observing the target might see a glowing angelic visage.\nWhen any creature attempts a hostile action against the target, the creature must attempt a Will save. It is then temporarily immune until the end of its next turn.\nSuccess The creature is unaffected.\nFailure The creature becomes Frightened 2 before using its action.\nCritical Failure The creature becomes Frightened 2, and its action fails and is wasted.\nHeightened (8th) You can target up to 5 creatures. If a creature uses a hostile action or reaction that affects multiple targets simultaneously, it needs to attempt only one save against mask of terror.',
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'moonburst-pf2e',
    name: 'Moonburst',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 7,
    school: 'divine',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "A powerful globe of chilling moonlight explodes in the area, dealing 8d10 cold damage to all creatures in the area, plus an additional (@item.rank+1)d10 vitality] damage to undead creatures.\nMoonburst's cold damage is silver damage for the purposes of weaknesses, resistances, and the like. Each creature and object in the area must attempt a Reflex save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage.\nCritical Failure The creature takes full damage and becomes permanently. If the globe overlaps with an area of magical darkness, moonburst attempts to counteract the darkness effect.\nHeightened (+1) The cold damage increases by 1d10, and the vitality damage against undead increases by 1d10.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The cold damage increases by 1d10, and the vitality damage against undead increases by 1d10.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'planar-palace-pf2e',
    name: 'Planar Palace',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You grow an extradimensional demiplane consisting of a spacious dwelling with a single entrance. The entrance connects to the plane where you Cast the Spell, appearing anywhere within the spell's range as a faint, shimmering, vertical rectangle 5 feet wide and 10 feet high. You designate who can enter when you Cast the Spell. Once inside, you can shut the entrance, making it . You and the creatures you designated can reopen the door at will.\nInside, the demiplane appears to be a mansion featuring a magnificent foyer and numerous opulent chambers. The mansion can have any floor plan you imagine as you Cast the Spell, provided it fits within a space 40 feet wide, 40 feet deep, and 30 feet tall. While the entrance to the mansion is closed, effects from outside the mansion fail to penetrate it, and vice versa, except for , which can be used to enter the mansion. You can use scrying magic and similar effects to observe the outside only if they're capable of crossing planes.\nA staff of up to 24 servants attends to anyone within the mansion. These are like the servant created by the spell, though they're visible, with an appearance you determine during casting. The mansion is stocked with enough food to serve a nine-course banquet to 150 people.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'planar-seal-pf2e',
    name: 'Planar Seal',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You create a visible magical barrier that attempts to counteract teleportation effects and planar travel into or out of the area, including items that allow access to extradimensional spaces. Planar seal tries to counteract any attempt to summon a creature into the area but doesn't stop the creature from departing when the summoning ends.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'possession-pf2e',
    name: 'Possession',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'occult',
    traditions: ['occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You send your mind and soul into the target's body, attempting to take control. The target must attempt a Will save. If you want to exert less control over the target, you can choose to use the effects of any degree of success more favorable to the target.\nWhile you're possessing a target, your own body is and can't wake up normally. You can sense everything the possessed target does. You can Dismiss this spell. If the possessed body dies, the spell ends and you must succeed at a Fortitude save against your spell DC or be for 1 hour, or 24 hours on a critical failure. If the spell ends during an encounter, you act just before the possessed creature's initiative.\nCritical Success The target is unaffected.\nSuccess You possess the target but can't control it. You ride along in the body while the spell lasts.\nFailure You possess the target and take partial control of it. You no longer have a separate turn; instead, you might control the target. At the start of each of the target's turns, it attempts another Will save. If it fails, it's by you on that turn; if it succeeds, it chooses its own actions; and if it critically succeeds, it forces you out and the spell ends.\nCritical Failure You possess the target fully, and it can only watch as you manipulate it like a puppet. The target is controlled by you.\nHeightened (9th) The duration is 10 minutes, and you can physically enter the creature's body, protecting your physical body while the spell lasts.",
    classes: ['bard'],
  },
  {
    id: 'project-image-pf2e',
    name: 'Project Image',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "You project an illusory image of yourself. You must stay within range of the image, and if at any point you can't see the image, the spell ends. Whenever you Cast a Spell other than one whose area is an emanation, you can cause the spell effect to originate from either yourself or the image. Because the image is an illusion, it can't benefit from spells, though visual manifestations of the spell appear. The image has the same AC and saves as you. If it is hit by an attack or fails a save, the spell ends.\nHeightened (+2) The maximum duration you can Sustain the spell increases to 10 minutes.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'ray-of-corruption-pf2e',
    name: 'Ray of Corruption',
    system: 'pf2e',
    source: 'Pathfinder #211: The Secret of Deathstalk Tower',
    level: 7,
    school: 'divine',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrowText: 'basic Fortitude',
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You unleash a sickly gray beam of toxic spores at your target. Make a spell attack against the target. If you hit a non-magical object that's made of organic material (such as a tree, wooden house, or massive skull), it melts away into a foul-smelling sludge. A single casting can destroy no more than a 10-foot cube of matter.\nIf you hit a creature, it takes 6d12 poison damage and 6d12 spirit damage with a basic Fortitude save. If you critically hit, the target gets a result one degree of success worse than the outcome of its Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target takes half damage.\nFailure The target takes full damage. Fungal tendrils swiftly digest the body and reduce it to sludge—the target takes 2d12 persistent] damage.\nCritical Failure As failure, but the target takes double damage, plus 4d12 persistent] damage.\nHeightened (+1) The poison damage and spirit damage each increase by 1d12.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The poison damage and spirit damage each increase by 1d12.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'recall-legacy-pf2e',
    name: 'Recall Legacy',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      description: "Until the target's next daily preparations",
    },
    concentration: false,
    ritual: false,
    description:
      "You establish a mental link with the target, focusing on a piece of knowledge important to their culture, family (by birth or choice), or home settlement. Both you and the target must be aware this knowledge exists, even if you don't know the exact details.\nAs your magic connects them to this legacy, the target gains a non-lineage ancestry feat from their ancestry. The feat must be of a level no higher than twice recall legacy's rank and the target must meet any prerequisites for the feat.\nThe target is then immune to any further castings of recall legacy until their next daily preparations.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'restore-ground-pf2e',
    name: 'Restore Ground',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'special',
      description: 'varies',
    },
    concentration: false,
    ritual: false,
    description:
      "You sense that this place yearns to throw off the shackles of civilization. You attempt to restore the area within the burst to a natural state, removing all artificial objects and buildings and encouraging the growth of plants on the ground that remains. Creatures are unaffected unless caught in a structural collapse.\n• Ground All ground within the area becomes greater difficult terrain for 1 round.\n• Objects Any unattended object of Bulk 4 or less is destroyed, regardless of Hardness, unless it's an artifact or similarly hard to destroy.\n• Plants Plants in the area become healthier and more fruitful for 1 year.\n• Structures Structures within range are shaken and may collapse, as if affected by .",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'retrocognition-pf2e',
    name: 'Retrocognition',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'occult',
    traditions: ['occult'],
    castingTime: {
      type: 'minutes',
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
      type: 'concentration',
      maxDuration: 'sustained',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "Opening your mind to mental echoes, you gain impressions from past events that occurred in your current location. Retrocognition reveals psychic impressions from events that occurred over the course of the last day throughout the first minute of the duration, followed by impressions from the next day back the next minute, and so on. These echoes don't play out like a vision but instead reveal impressions of emotions and metaphors that provide cryptic clues and details of the past. If you witness a traumatic or turbulent event through an impression, the spell ends unless you succeed at a Will save with a DC of at least 30 and possibly as much as 50, depending on the severity of the event. The GM determines whether an event is traumatic and chooses the DC.\nHeightened (8th) You gain impressions of events that occurred over the previous year for each minute you concentrate, instead of the previous day, though the details diminish, making it harder to distinguish impressions from all but the most major events.\nHeightened (9th) You gain impressions of events that occurred over the previous century for each minute you concentrate, instead of the previous day, though the details diminish, making it almost impossible to distinguish impressions from all but the most major events.",
    classes: ['bard'],
  },
  {
    id: 'spell-riposte-pf2e',
    name: 'Spell Riposte',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'reaction',
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
      "Trigger You're the target of a spell you're aware of.\nYou attempt to counteract the triggering spell. If the spell would be counteracted, it instead continues with the caster as a target instead of you. Spell riposte can't affect spells that aren't targeted (such as area spells).",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'summon-stampede-pf2e',
    name: 'Summon Stampede',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 7,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'special',
      description: 'until the end of your next turn',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You summon an unstoppable stampede of panicking beasts. Whether you conjure wild beasts or tamed cattle, the stampede is a force of nature that leaves behind nothing in its wake. The stampede occupies the space of a Gargantuan creature and has a Speed of 60 feet.\nArrive(emotion, fear, mental) Foreboding Tremors The sheer energy of a stampede can cause even apex predators to panic. Each creature within a must attempt a Will save with the following effects.\nCritical Success The creature is unaffected.\nSuccess The creature is Frightened 1.\nFailure The creature is Frightened 2.\nCritical Failure The creature is Frightened 3 and for 1 round.\nDepartFlatten the Earth The stampede Strides up to double its Speed, trampling each Large or smaller creature, hazard, and structure whose space it enters, dealing (8d8) bludgeoning] damage (basic Reflex save). The stampede ignores and attempts to counteract all difficult terrain it enters caused by debris, overgrowth, rubble, or thick ground cover.',
    classes: ['druid'],
  },
  {
    id: 'time-beacon-pf2e',
    name: 'Time Beacon',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      type: 'special',
      description: 'until the end of your turn',
    },
    concentration: false,
    ritual: false,
    description:
      "You create a beacon in time to return to it if things go wrong. You can cast time beacon only on your turn. Keep careful track of everything that happens this turn after you cast time beacon. At the end of your turn, you can choose to rewind time back to just after you cast time beacon, removing all effects of your turn since then.\nCurses, traps, and other harmful effects that happen during your turn might prevent you from returning to the beacon if they're powerful enough. If you were affected by any harmful effects during your turn after casting time beacon, in order to return to your beacon, time beacon attempts a counteract check against each such effect. If it fails at any of these checks, you can't return. After returning to the time beacon, the spell ends.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'true-target-pf2e',
    name: 'True Target',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'special',
      description: 'until the start of your next turn',
    },
    concentration: false,
    ritual: false,
    description:
      "You delve into the possible futures of the next few seconds to understand all the ways your foe might avoid harm, then cast out a vision of that future to those around you. Designate a creature. The first time each target makes an attack roll against that creature during true target's duration, the attacker rolls twice and uses the better result. The attacker also ignores circumstance penalties to the attack roll and any flat check required due to the designated creature being or .",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'unfettered-pack-pf2e',
    name: 'Unfettered Pack',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      "You free those who travel alongside you from environmental hindrances. Targets don't take circumstance penalties to Speed from vegetation, rubble, winds, or other properties of the environment, and they ignore difficult terrain from such environmental properties.\nHeightened (9th) The targets also ignore greater difficult terrain from environmental properties.",
    classes: ['druid'],
  },
  {
    id: 'vibrant-vibrato-pf2e',
    name: 'Vibrant Vibrato',
    system: 'pf2e',
    source: 'Pathfinder #205: Singer, Stalker, Skinsaw Man',
    level: 7,
    school: 'divine',
    traditions: ['divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "Your voice trills in perfect vibrato. When casting the spell, you can make the area any radius you choose, up to 40 feet. The reverberations of your voice continue to shimmer and hang in the air as long as you Sustain the spell but can't be heard at all outside of the area. A creature must attempt a Will save if it's within the area when you Cast the Spell or as soon as it enters the area while the spell is in effect. Once a creature has attempted the save, it uses the same result for that casting of vibrant vibrato.\nCritical Success The creature is unaffected.\nSuccess The creature takes 5d10 persistent] damage at the end of their turn as long as they remain within the aura's area of effect.\nFailure As success, but if the creature leaves the area, or if you move far enough from the creature that they're no longer in the area, the creature hears a shattering sound and takes 5d10 sonic damage and is Stunned 1. The creature is then for the rest of the spell's duration.\nCritical Failure As failure, but the creature takes double the sonic damage and is Stunned 3.\nHeightened (+1) The damage on a failed save increases by 1d10.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage on a failed save increases by 1d10.',
    },
    classes: ['cleric', 'bard'],
  },
  {
    id: 'visions-of-danger-pf2e',
    name: 'Visions of Danger',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 7,
    school: 'occult',
    traditions: ['occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: false,
    ritual: false,
    description:
      "An illusion of horrific creatures fills the spell's area. The creatures look like Tiny swarming monsters with a specific appearance of your choice, such as fiendish flies or animated saw blades. The burst deals 8d8 mental damage with a basic Will save to each creature that's inside the burst when it's created, enters the burst, or starts its turn inside the burst. A creature that critically succeeds at its Will save can immediately attempt to disbelieve the illusion. A creature that tries to Interact with the monsters or observes one with a action can attempt to disbelieve the illusion. Creatures that disbelieve the illusion take no damage from the illusion thereafter.\nHeightened (+1) The mental damage increases by 1d8",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The mental damage increases by 1d8',
    },
    classes: ['bard'],
  },
  {
    id: 'volcanic-eruption-pf2e',
    name: 'Volcanic Eruption',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "Area 5-foot radius, 80-foot-tall cylinder\nThe ground opens up, spraying a column of lava high into the air in a vertical cylinder, dealing 14d6 fire damage to creatures in the area. The lava rapidly cools and encases creatures in the area. A creature encased in rock is Clumsy 1 and takes a -10-foot status penalty to its Speeds. All normal terrain is difficult terrain to a flying creature, and such creatures immediately descend 20 feet the moment they're encased, but they don't take damage from this fall. A creature encased in rock can attempt to against your spell DC to end the effect. Otherwise, the creature remains encased until it takes a total of 50 damage, freeing it from the rock. Additionally, creatures in the area and those within 5 feet of the lava column automatically take (@item.rank -4)d6 fire] damage from the intense heat, regardless of the results of their saving throws.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is encased.\nCritical Failure The creature takes double damage and is encased.\nHeightened (+1) The damage in the area increases by 2d6, and the damage from the intense heat increases by 1d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage in the area increases by 2d6, and the damage from the intense heat increases by 1d6.',
    },
    classes: ['druid'],
  },
  {
    id: 'warp-mind-pf2e',
    name: 'Warp Mind',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 7,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You scramble a creature's mental faculties and sensory input. The target must attempt a Will saving throw. Regardless of the result of that save, the target is then temporarily immune for 10 minutes. Warp mind's effects happen instantly, so and other effects that counteract spells can't counteract them. However, rituals and abilities that can remove non-magical effects can still counteract the effects.\nCritical Success The target is unaffected.\nSuccess The target spends the first action on its next turn with the condition.\nFailure The target is Confused for 1 minute.\nCritical Failure The target is Confused permanently.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
]);
