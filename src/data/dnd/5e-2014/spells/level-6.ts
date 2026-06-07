import { Spell } from '../../../../types/magic/spells';

export const level6Spells: Spell[] = [
  {
    id: 'true-seeing',
    name: 'True Seeing',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'divination',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'an ointment for the eyes that costs 25 gp; is made from mushroom powder, saffron, and fat; and is consumed by the spell',
      materialCost: 25,
      materialConsumed: true,
    },
    duration: { type: 'hours', hours: 1 },
    target: '1 willing creature you touch',
    concentration: false,
    ritual: false,
    description:
      'This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.',
    classes: ['bard', 'cleric', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'heal',
    name: 'Heal',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'evocation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 60 },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'instant' },
    healing: { count: 70, die: 'd4', notation: '70' },
    concentration: false,
    ritual: false,
    description:
      'Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 hit points. This spell also ends blindness, deafness, and any diseases affecting the target. This spell has no effect on constructs or undead.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 7th level or higher, the amount of healing increases by 10 for each slot level above 6th.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'heroes-feast',
    name: "Heroes' Feast",
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
    castingTime: { type: 'minute', amount: 10 },
    range: { type: 'ranged', feet: 30 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a gem-encrusted bowl worth at least 1,000 gp, which the spell consumes',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: { type: 'instant' },
    concentration: false,
    ritual: false,
    description:
      "You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don't set in until this hour is over. Up to twelve creatures can partake of the feast. A creature that partakes of the feast gains several benefits. The creature is cured of all diseases and poison, becomes immune to poison and being frightened, and makes all Wisdom saving throws with advantage. Its hit point maximum also increases by 2d10, and it gains the same number of hit points. These benefits last for 24 hours.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'find-the-path',
    name: 'Find the Path',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'divination',
    castingTime: { type: 'minute', amount: 1 },
    range: { type: 'self' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'a set of divinatory tools—such as bones, ivory sticks, cards, teeth, or carved runes—worth 100 gp and an object from the location you wish to find',
    },
    duration: { type: 'concentration', maxDuration: '1 day' },
    concentration: true,
    ritual: false,
    description:
      'This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence. If you name a destination on another plane of existence, a destination that moves (such as a mobile fortress), or a destination that isn\'t specific (such as "a green dragon\'s lair"), the spell fails. For the duration, as long as you are on the same plane of existence as the destination, you know how far it is and in what direction it lies. While you are traveling there, whenever you are presented with a choice of paths along the way, you automatically determine which path is the shortest and most direct route (but not necessarily the safest route) to the destination.',
    classes: ['bard', 'cleric', 'druid'],
  },
  {
    id: 'contingency',
    name: 'Contingency',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'evocation',
    castingTime: { type: 'minute', amount: 10 },
    range: { type: 'self' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'a statuette of yourself carved from ivory and decorated with gems worth at least 1,500 gp',
    },
    duration: { type: 'hours', hours: 10 },
    concentration: false,
    ritual: false,
    description:
      "Choose a spell of 5th level or lower that you can cast, that you know or that appears in a cleric, druid, paladin, ranger, sorcerer, or wizard spell list. You cast that spell—called the contingent spell—as part of casting contingency, expending spell slots for both, but the contingent spell doesn't come into effect. Instead, it takes effect when a certain circumstance occurs. You describe that circumstance when you cast the two spells. For example, a contingency cast with water breathing might stipulate that water breathing comes into effect when you are engulfed in water or a similar liquid.",
    classes: ['wizard'],
  },
  {
    id: 'eyebite',
    name: 'Eyebite',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'necromancy',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'self' },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'concentration', maxDuration: '1 minute' },
    concentration: true,
    ritual: false,
    description:
      "For the spell's duration, your eyes become an inky void imbued with dread power. You can use your action to cast the spell's eye rays. You decide how many rays you create, choosing from the options below, and you can create a number of rays equal to the number of actions you have left. Before you finish casting this spell, you can decide that one of the rays is a searing ray, one is a paralyzing ray, one is a fear ray, and one is a slowing ray. If you create a ray that isn't one of these four options, it must be a death ray.",
    classes: ['wizard'],
  },
  {
    id: 'forbiddance',
    name: 'Forbiddance',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'abjuration',
    castingTime: { type: 'minute', amount: 10 },
    range: { type: 'ranged', feet: 60 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'the ashes of a phoenix, rare incense, and at least 1,000 gp worth of powdered silver and mercury',
    },
    duration: { type: 'permanent' },
    concentration: false,
    ritual: true,
    description:
      'You protect a point you can see within range against magical travel and planar travel. Until the spell ends, no creature can teleport into the area or use portals, such as those created by the gate spell, to enter the area. The spell proofs the area against the astral projection and ethereal travel. This spell does not prevent creatures from leaving the protected area.',
    classes: ['cleric'],
  },
  {
    id: 'globe-of-invulnerability',
    name: 'Globe of Invulnerability',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'abjuration',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'self' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a glass or crystal bead that shatters when the spell ends',
    },
    duration: { type: 'concentration', maxDuration: '1 minute' },
    concentration: true,
    ritual: false,
    description:
      "An immobile, invisible, magical barrier springs into existence in a 10-foot radius around you. This barrier moves with you and remains for the duration. Any spell of 5th level or lower cast from outside the barrier can't affect creatures or objects within it, even if the spell is cast using a higher level spell slot. Such a spell can target creatures and objects within the barrier, but the spell has no effect on them. Similarly, the area within the barrier is excluded from areas affected by such spells.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'guards-and-wards',
    name: 'Guards and Wards',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'abjuration',
    castingTime: { type: 'minute', amount: 10 },
    range: { type: 'touch' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'burning incense, a small measure of powdered silver, and a piece of iron or steel',
    },
    duration: { type: 'hours', hours: 24 },
    concentration: false,
    ritual: false,
    description:
      "You create a magical ward that protects an area you touch. The area can be as small as a single room or as large as a castle, but the total area can't exceed 5,000 square feet (roughly a 70-foot-by-70-foot area). When you cast the spell, you can specify individuals who are unaffected by any of the effects that you choose. You can designate a password that, when spoken aloud, makes the speaker immune to these effects.",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'mass-heal',
    name: 'Mass Heal',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'evocation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 60 },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'instant' },
    healing: { count: 70, die: 'd1', notation: '70 hp' },
    concentration: false,
    ritual: false,
    description:
      'A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each creature in that sphere regains hit points equal to 70.',
    classes: ['cleric'],
  },
  {
    id: 'move-earth',
    name: 'Move Earth',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'transmutation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 120 },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'concentration', maxDuration: '2 hours' },
    concentration: true,
    ritual: false,
    description:
      "Choose an area of terrain no larger than 40 feet on each side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration. You can raise or lower the elevation of the terrain, create or fill in a trench, erect or flatten a wall, or form a pillar. The extent of any such changes can't exceed twice the spell's range.",
    classes: ['druid', 'wizard'],
  },
  {
    id: 'planar-ally',
    name: 'Planar Ally',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
    castingTime: { type: 'hour', amount: 1 },
    range: { type: 'ranged', feet: 60 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a vial of holy water and 25 gp worth of incense',
    },
    duration: { type: 'instant' },
    concentration: false,
    ritual: true,
    description:
      "By casting this spell, you attempt to bind a celestial, fey, fiend, or undead creature to your will. The creature must be able to hear you and must be of a challenge rating equal to or lower than your character level. Appearing in an unoccupied space that you can see within range, the creature makes a Charisma saving throw. On a failed save, it is bound to serve you for the spell's duration.",
    classes: ['cleric'],
  },
  {
    id: 'programmed-illusion',
    name: 'Programmed Illusion',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'illusion',
    castingTime: { type: 'minute', amount: 1 },
    range: { type: 'ranged', feet: 120 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a small piece of fleece and jade dust worth at least 25 gp',
    },
    duration: { type: 'special', description: 'until dispelled' },
    concentration: false,
    ritual: false,
    description:
      'You create an illusion of an object, a creature, or some other visible phenomenon within range that activates under the condition you specify. The illusion is imperceptible until then. It must be no larger than a 30-foot cube, and use only the senses of sight and sound. The spell lasts until it is dispelled.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'transport-via-plants',
    name: 'Transport via Plants',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 5 },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'instant' },
    concentration: false,
    ritual: false,
    description:
      'This spell creates a magical link between a Large or larger inanimate plant within range and another plant, at any distance, on the same plane of existence. You must have seen or touched the destination plant at least once before. For the duration, you can use your action to transport yourself and up to eight willing creatures from the origin plant to the destination plant, provided the path between them is clear.',
    classes: ['druid'],
  },
  {
    id: 'true-polymorph',
    name: 'True Polymorph',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'transmutation',
    castingTime: { type: 'action', amount: 1 },
    range: { type: 'ranged', feet: 30 },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a jade circlet worth at least 1,500 gp',
    },
    duration: { type: 'concentration', maxDuration: '1 hour' },
    concentration: true,
    ritual: false,
    description:
      "Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into a nonmagical object, or the object into a creature. A creature can't be transformed into an object if it has at least 1 hit point. An object can't be transformed into a creature.",
    classes: ['bard', 'warlock', 'wizard'],
  },
  {
    id: 'blade-barrier',
    name: 'Blade Barrier',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'evocation',
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 6,
        die: 'd10',
        notation: '6d10',
      },
      type: 'slashing',
    },
    concentration: true,
    ritual: false,
    description:
      "You create a vertical wall of whirling, razor-sharp blades made of magical energy. Any creature that enters the wall's area for the first time or starts its turn there must make a Dexterity saving throw, taking 6d10 Slashing damage on a failed save.",
    classes: ['cleric'],
  },
  {
    id: 'chain-lightning',
    name: 'Chain Lightning',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      materialDescription: 'a piece of glass or a crystal rod',
    },
    duration: {
      type: 'instant',
    },
    target: '1 creature you can see within range, plus up to 3 secondary creatures within 30 feet',
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText:
      'The primary target and each secondary target make a Dexterity saving throw against the lightning arc.',
    damage: {
      base: {
        count: 10,
        die: 'd8',
        notation: '10d8',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'You hurl a bolt of lightning at a creature of your choice that you can see within range. The target must make a Dexterity saving throw. On a failed save, the creature takes 10d8 lightning damage. On a successful save, it takes half as much damage. The lightning arcs from that creature to up to three other creatures within 30 feet of it that you can see. Each of those creatures must make a Dexterity saving throw.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 7th level or higher, the number of secondary targets increases by one for each slot level above 6th.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'circle-of-death',
    name: 'Circle of Death',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'necromancy',
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
      materialDescription: 'a crushed black pearl worth 500 gp',
      materialCost: 500,
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 60,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 8,
        die: 'd6',
        notation: '8d6',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'A sphere of negative energy ripples out in a 60-foot-radius Sphere from a point within range. Each creature in that area must make a Constitution saving throw, taking 8d6 Necrotic damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 7 or higher, the damage increases by 2d6 for each slot level above 6.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'create-undead',
    name: 'Create Undead',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'necromancy',
    castingTime: {
      type: 'minute',
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
      materialDescription:
        'a clay pot with grave dirt and a black onyx stone worth 150 gp per corpse',
      materialCost: 150,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You can cast this spell only at night. Choose up to three corpses of Medium or Small Humanoids within range. Each corpse becomes a Ghoul under your control.',
    atHigherLevels:
      'When you cast this spell using a level 7 slot, you can create Ghasts. Level 8: Wights. Level 9: Mummies.',
    classes: ['cleric', 'warlock', 'wizard'],
  },
  {
    id: 'disintegrate',
    name: 'Disintegrate',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      material: true,
      materialDescription: 'a lodestone and pinch of dust',
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    damage: {
      base: {
        count: 10,
        die: 'd6',
        modifier: 40,
        notation: '10d6+40',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'A thin green ray springs from your pointing finger to a target within range. The target can be a creature, an object, or a creation of magical force. A creature takes 10d6 + 40 Force damage. If this damage reduces the creature to 0 HP, it is disintegrated.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 7 or higher, the damage increases by 3d6 for each slot level above 6.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'flesh-to-stone',
    name: 'Flesh to Stone',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      material: true,
      materialDescription: 'a pinch of powite and water',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You attempt to turn one creature that you can see within range into stone. The target must make a Constitution saving throw. On a failed save, it has the Restrained condition as its flesh begins to harden.',
    classes: ['druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'harm',
    name: 'Harm',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
        count: 14,
        die: 'd6',
        notation: '14d6',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'You unleash a virulent disease on a creature that you can see within range. The target must make a Constitution saving throw. On a failed save, it takes 14d6 Necrotic damage, and its HP maximum is reduced by an amount equal to the damage taken.',
    classes: ['cleric'],
  },
  {
    id: 'magic-jar',
    name: 'Magic Jar',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'necromancy',
    castingTime: {
      type: 'minute',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a gem or crystal worth 500 gp',
      materialCost: 500,
    },
    duration: {
      type: 'permanent',
    },
    savingThrow: {
      attribute: 'cha',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      "Your body falls into a catatonic state as your soul leaves it and enters the container you used for the spell's material component. While your soul inhabits the container, you are aware of your surroundings as if you were in the container's space.",
    classes: ['wizard'],
  },
  {
    id: 'mass-suggestion',
    name: 'Mass Suggestion',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      somatic: false,
      material: true,
      materialDescription: 'a snake tongue',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: false,
    ritual: false,
    description:
      'You suggest a course of activity to up to twelve creatures of your choice that you can see within range and that can hear and understand you. The suggestion must be worded reasonably.',
    atHigherLevels:
      'When you cast this spell using a level 7 slot, the duration is 10 days. Level 8: 30 days. Level 9: a year and a day.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'sunbeam',
    name: 'Sunbeam',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      materialDescription: 'a magnifying glass',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'line',
      length: 60,
      width: 5,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    damage: {
      base: {
        count: 6,
        die: 'd8',
        notation: '6d8',
      },
      type: 'radiant',
    },
    concentration: true,
    ritual: false,
    description:
      'A beam of brilliant light flashes out from your hand in a 5-foot-wide, 60-foot-long Line. Each creature in the Line must make a Constitution saving throw, taking 6d8 Radiant damage on a failed save and has the Blinded condition until your next turn.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-ice',
    name: 'Wall of Ice',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      materialDescription: 'a small piece of quartz',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 10,
        die: 'd6',
        notation: '10d6',
      },
      type: 'cold',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a wall of ice on a solid surface within range. You can form it into a hemispherical dome or a sphere with a radius up to 10 feet, or shape it as a flat surface made up of ten 10-foot-square panels.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 7 or higher, the damage increases by 2d6 for each slot level above 6.',
    classes: ['wizard'],
  },
  {
    id: 'word-of-recall',
    name: 'Word of Recall',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary. You and any creatures that teleport with you appear in the nearest unoccupied space to the spot you designated when you prepared your sanctuary.',
    classes: ['cleric'],
  },
  {
    id: 'conjure-fey',
    name: 'Conjure Fey',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
    castingTime: {
      type: 'minute',
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
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      "You summon a fey creature of challenge rating 6 or lower, or a fey spirit that takes the form of a beast of challenge rating 6 or lower. It appears in an unoccupied space that you can see within range. The fey creature disappears when it drops to 0 hit points or when the spell ends.\nThe fey creature is friendly to you and your companions for the duration. Roll initiative for the creature, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you), as long as they don't violate its alignment. If you don't issue any commands to the fey creature, it defends itself from hostile creatures but otherwise takes no actions.\nIf your concentration is broken, the fey creature doesn't disappear. Instead, you lose control of the fey creature, it becomes hostile toward you and your companions, and it might attack. An uncontrolled fey creature can't be dismissed by you, and it disappears 1 hour after you summoned it.\nThe GM has the fey creature's statistics.",
    atHigherLevels:
      'When you cast this spell using a spell slot of 7th level or higher, the challenge rating increases by 1 for each slot level above 6th.',
    classes: ['druid', 'warlock'],
  },
  {
    id: 'freezing-sphere',
    name: 'Freezing Sphere',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'evocation',
    castingTime: {
      type: 'action',
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
      materialDescription: 'A small crystal sphere.',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 60,
    },
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'CON save',
    damage: {
      base: {
        count: 10,
        die: 'd6',
        notation: '10d6',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      "A frigid globe of cold energy streaks from your fingertips to a point of your choice within range, where it explodes in a 60-foot-radius sphere. Each creature within the area must make a constitution saving throw. On a failed save, a creature takes 10d6 cold damage. On a successful save, it takes half as much damage.\nIf the globe strikes a body of water or a liquid that is principally water (not including water-based creatures), it freezes the liquid to a depth of 6 inches over an area 30 feet square. This ice lasts for 1 minute. Creatures that were swimming on the surface of frozen water are trapped in the ice. A trapped creature can use an action to make a Strength check against your spell save DC to break free.\nYou can refrain from firing the globe after completing the spell, if you wish. A small globe about the size of a sling stone, cool to the touch, appears in your hand. At any time, you or a creature you give the globe to can throw the globe (to a range of 40 feet) or hurl it with a sling (to the sling's normal range). It shatters on impact, with the same effect as the normal casting of the spell. You can also set the globe down without shattering it. After 1 minute, if the globe hasn't already shattered, it explodes.",
    atHigherLevels:
      'When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d6 for each slot level above 6th.',
    classes: ['wizard'],
  },
  {
    id: 'instant-summons',
    name: 'Instant Summons',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
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
      materialDescription: 'A sapphire worth 1,000 gp.',
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: true,
    description:
      "You touch an object weighing 10 pounds or less whose longest dimension is 6 feet or less. The spell leaves an invisible mark on its surface and invisibly inscribes the name of the item on the sapphire you use as the material component. Each time you cast this spell, you must use a different sapphire.\nAt any time thereafter, you can use your action to speak the item's name and crush the sapphire. The item instantly appears in your hand regardless of physical or planar distances, and the spell ends.\nIf another creature is holding or carrying the item, crushing the sapphire doesn't transport the item to you, but instead you learn who the creature possessing the object is and roughly where that creature is located at that moment.\nDispel magic or a similar effect successfully applied to the sapphire ends this spell's effect.",
    classes: ['wizard'],
  },
  {
    id: 'irresistible-dance',
    name: 'Irresistible Dance',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "Choose one creature that you can see within range. The target begins a comic dance in place: shuffling, tapping its feet, and capering for the duration. Creatures that can't be charmed are immune to this spell.\nA dancing creature must use all its movement to dance without leaving its space and has disadvantage on dexterity saving throws and attack rolls. While the target is affected by this spell, other creatures have advantage on attack rolls against it. As an action, a dancing creature makes a wisdom saving throw to regain control of itself. On a successful save, the spell ends.",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'wall-of-thorns',
    name: 'Wall of Thorns',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'conjuration',
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
      materialDescription: 'A handful of thorns.',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'line',
      length: 60,
      width: 5,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'DEX save',
    damage: {
      base: {
        count: 7,
        die: 'd8',
        notation: '7d8',
      },
      type: 'piercing',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a wall of tough, pliable, tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You choose to make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick. The wall blocks line of sight.\nWhen the wall appears, each creature within its area must make a dexterity saving throw. On a failed save, a creature takes 7d8 piercing damage, or half as much damage on a successful save.\nA creature can move through the wall, albeit slowly and painfully. For every 1 foot a creature moves through the wall, it must spend 4 feet of movement. Furthermore, the first time a creature enters the wall on a turn or ends its turn there, the creature must make a dexterity saving throw. It takes 7d8 slashing damage on a failed save, or half as much damage on a successful one.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 7th level or higher, both types of damage increase by 1d8 for each slot level above 6th.',
    classes: ['druid'],
  },
  {
    id: 'wind-walk',
    name: 'Wind Walk',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    level: 6,
    school: 'transmutation',
    castingTime: {
      type: 'minute',
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
      materialDescription: 'Fire and holy water.',
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You and up to ten willing creatures you can see within range assume a gaseous form for the duration, appearing as wisps of cloud. While in this cloud form, a creature has a flying speed of 300 feet and has resistance to damage from nonmagical weapons. The only actions a creature can take in this form are the Dash action or to revert to its normal form. Reverting takes 1 minute, during which time a creature is incapacitated and can't move. Until the spell ends, a creature can revert to cloud form, which also requires the 1-minute transformation.\nIf a creature is in cloud form and flying when the effect ends, the creature descends 60 feet per round for 1 minute until it lands, which it does safely. If it can't land after 1 minute, the creature falls the remaining distance.",
    classes: ['druid'],
  },
];

// Helper function for lookups
export const getLevel6SpellById = (id: string) => level6Spells.find((spell) => spell.id === id);
