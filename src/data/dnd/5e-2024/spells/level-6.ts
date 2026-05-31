import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 6 Spells - SRD 5.2
export const level6Spells: Spell[] = [
  {
    id: 'blade-barrier',
    name: 'Blade Barrier',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    id: 'contingency',
    name: 'Contingency',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'abjuration',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a statuette of yourself carved from ivory worth 1,500 gp',
      materialCost: 1500,
    },
    duration: {
      type: 'special',
      description: '10 days',
    },
    concentration: false,
    ritual: false,
    description:
      'Choose a spell of level 5 or lower that you can cast, that has a casting time of 1 action, and that can target you. You cast that spell—called the contingent spell—as part of casting contingency, expending spell slots for both.',
    classes: ['wizard'],
  },
  {
    id: 'create-undead',
    name: 'Create Undead',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    id: 'eyebite',
    name: 'Eyebite',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "For the spell's duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet must succeed on a Wisdom saving throw or be affected by one of these effects: Asleep, Panicked, or Sickened.",
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'find-the-path',
    name: 'Find the Path',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'divination',
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
      materialDescription: 'a set of divinatory tools worth 100 gp',
      materialCost: 100,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 day',
    },
    concentration: true,
    ritual: false,
    description:
      'This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence.',
    classes: ['bard', 'cleric', 'druid'],
  },
  {
    id: 'flesh-to-stone',
    name: 'Flesh to Stone',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    id: 'forbiddance',
    name: 'Forbiddance',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'abjuration',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'a sprinkling of holy water, rare incense, and powdered ruby worth at least 1,000 gp',
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'You protect a location with an interdiction spell. The spell can cover an area up to 40,000 square feet. If you cast the spell on a natural terrain, it affects a quarter-mile radius. If you cast it on a structure or ship, it affects only the interior.',
    classes: ['cleric'],
  },
  {
    id: 'globe-of-invulnerability',
    name: 'Globe of Invulnerability',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
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
      material: true,
      materialDescription: 'a glass bead',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    concentration: true,
    ritual: false,
    description:
      "An immobile, faintly shimmering barrier springs into existence in a 10-foot-radius Sphere around you. Any spell of level 5 or lower cast from outside the barrier can't affect creatures or objects within it.",
    atHigherLevels:
      'When you cast this spell using a spell slot of level 7 or higher, the barrier blocks spells of one level higher for each slot level above 6.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'guards-and-wards',
    name: 'Guards and Wards',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'abjuration',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription:
        'burning incense, a small measure of powdered silver, and a piece of iron or steel',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      "You create a magical ward that protects an area you touch. The area can be as small as a single room or as large as a castle, but the total area can't exceed 5,000 square feet (roughly a 70-foot-by-70-foot area). When you cast the spell, you can specify individuals who are unaffected by any of the effects that you choose. You can designate a password that, when spoken aloud, makes the speaker immune to these effects.",
    classes: ['bard', 'wizard'],
  },
  {
    id: 'harm',
    name: 'Harm',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    id: 'heal',
    name: 'Heal',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Choose a creature that you can see within range. A surge of positive energy washes through the creature, causing it to regain 70 Hit Points. This spell also ends the Blinded, Deafened, and Poisoned conditions on the target.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 7 or higher, the healing increases by 10 for each slot level above 6.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'heroes-feast',
    name: "Heroes' Feast",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'conjuration',
    castingTime: {
      type: 'minute',
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
      materialDescription: 'a gem-encrusted bowl worth at least 1,000 gp, which the spell consumes',
      materialCost: 1000,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You bring forth a great feast, including magnificent food and drink. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don't set in until this hour is over. Up to twelve creatures can partake of the feast. A creature that partakes of the feast gains several benefits. The creature is cured of all diseases and poison, becomes immune to poison and being frightened, and makes all Wisdom saving throws with advantage. Its hit point maximum also increases by 2d10, and it gains the same number of hit points. These benefits last for 24 hours.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'magic-jar',
    name: 'Magic Jar',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    id: 'move-earth',
    name: 'Move Earth',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'transmutation',
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
      materialDescription: 'an iron blade and clay',
    },
    duration: {
      type: 'concentration',
      maxDuration: '2 hours',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 40,
    },
    concentration: true,
    ritual: false,
    description:
      'Choose an area of terrain no larger than 40 feet on a side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration.',
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'freezing-sphere',
    name: 'Freezing Sphere',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      materialDescription: 'a crystal sphere',
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
        count: 10,
        die: 'd6',
        notation: '10d6',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'A frigid globe of cold energy streaks from your fingertips to a point within range, where it explodes in a 60-foot-radius Sphere. Each creature in the Sphere makes a Constitution saving throw, taking 10d6 Cold damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 7 or higher, the damage increases by 1d6 for each slot level above 6.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'planar-ally',
    name: 'Planar Ally',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'conjuration',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 60,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a vial of holy water and rare incense worth at least 1,000 gp',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "By casting this spell, you request assistance from a powerful creature you know: a deity, demigod, primordial, or other being of godlike power. The being must be on a plane of existence you're aware of. Celestials, elementals, fey, and fiends are willing to entertain requests in exchange for a payment of 1,000 gp per creature summoned.",
    classes: ['cleric'],
  },
  {
    id: 'programmed-illusion',
    name: 'Programmed Illusion',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
    school: 'illusion',
    castingTime: {
      type: 'minute',
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
      materialDescription: 'a small piece of fleece and jade dust worth at least 25 gp',
    },
    duration: {
      type: 'special',
      description: 'until dispelled',
    },
    concentration: false,
    ritual: false,
    description:
      'You create an illusion of an object, a creature, or some other visible phenomenon within range that activates under the condition you specify. The illusion is imperceptible until then. It must be no larger than a 30-foot cube, and use only the senses of sight and sound. The spell lasts until it is dispelled.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'sunbeam',
    name: 'Sunbeam',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    id: 'transport-via-plants',
    name: 'Transport via Plants',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell creates a magical link between a Large or larger inanimate plant within range and another plant, at any distance, on the same plane of existence. You must have seen or touched the destination plant at least once before. For the duration, you can use your action to transport yourself and up to eight willing creatures from the origin plant to the destination plant, provided the path between them is clear.',
    classes: ['druid'],
  },
  {
    id: 'true-seeing',
    name: 'True Seeing',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 6,
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
      materialDescription: 'mushroom powder worth 25 gp',
      materialCost: 25,
      materialConsumed: true,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    target: '1 willing creature you touch',
    concentration: false,
    ritual: false,
    description:
      'This spell gives the willing creature you touch Truesight with a range of 120 feet for the duration.',
    classes: ['bard', 'cleric', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'wall-of-ice',
    name: 'Wall of Ice',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
];
