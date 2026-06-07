import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level9Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'disjunction-pf2e',
    name: 'Disjunction',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'abjuration',
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
      type: 'instant',
    },
    effect: "Rip apart a target's magic and suppress its magical properties",
    concentration: false,
    ritual: false,
    description:
      "You destroy the target's magic, ripping it apart. The target loses all magical properties for 1 minute. If the target is an artifact, it instead loses its magical properties for 1 hour.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'foresight-9-pf2e',
    name: 'Foresight',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'divination',
    traditions: ['arcane', 'primal'],
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You gain a supernatural sense of impending danger. You gain a +2 status bonus to initiative and aren't flat-footed against hidden or undetected creatures. You can't be surprised.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'gate-9-pf2e',
    name: 'Gate',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'conjuration',
    traditions: ['arcane', 'divine'],
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
    effect: 'A portal linking an unoccupied space you can see to a location on another plane',
    concentration: false,
    ritual: false,
    description:
      'You conjure a portal linking an unoccupied space you can see to a precise location on a different plane of existence.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'implosion-pf2e',
    name: 'Implosion',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'evocation',
    traditions: ['arcane'],
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
      type: 'varies',
    },
    target: '1 creature within range',
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You crush the target with telekinetic force. The target takes 75 damage with a basic Fortitude save. If the target critically fails the save, it is crushed into a tiny ball and dies.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 10.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'meteor-swarm-pf2e',
    name: 'Meteor Swarm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
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
      type: 'instant',
    },
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
      'You call down four meteors that explode in a fiery blast. Each meteor deals 6d10 bludgeoning damage to any creatures in the 10-foot burst and 14d6 fire damage to creatures in the 40-foot burst.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1): The bludgeoning damage increases by 1d10, and the fire damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'power-word-kill-9-pf2e',
    name: 'Power Word Kill',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'enchantment',
    traditions: ['arcane', 'occult'],
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
      type: 'instant',
    },
    target: '1 creature with 50 or fewer Hit Points, or stun a hardier target',
    concentration: false,
    ritual: false,
    description:
      "You utter a single word of power that instantly kills one creature with 50 or fewer Hit Points. If the target has more than 50 HP, it's stunned 1 instead.",
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (10th): The levels at which each outcome applies increase by 2.',
      ranks: {
        10: 'The levels at which each outcome applies increase by 2.',
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'prismatic-sphere-9-pf2e',
    name: 'Prismatic Sphere',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'abjuration',
    traditions: ['arcane'],
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
      hours: 10,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'An immobile, invisible sphere of magical force surrounds you. Nothing can pass through the barrier from either side.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'shapechange-9-pf2e',
    name: 'Shapechange',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'transmutation',
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    effect: "Transform into a battle form you've seen of level 15 or lower",
    concentration: false,
    ritual: false,
    description:
      "You transform into a battle form. Choose a form you've seen that's level 15 or lower. You can change between forms by Dismissing and Casting the spell again.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'time-stop-9-pf2e',
    name: 'Time Stop',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'transmutation',
    traditions: ['arcane'],
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
    effect: 'You take 1d4+1 rounds of actions while time is stopped for everyone else',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (10th): You gain 3 extra actions you can use on your turn.',
      ranks: {
        10: 'You temporarily stop time for everything but yourself, allowing you to use several actions in what appears to others to be no time at all. You gain 3 extra actions you can use on your turn.',
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You briefly stop the flow of time for everyone but yourself. You can take 1d4+1 rounds of actions.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'wish-pf2e',
    name: 'Wish',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'divination',
    traditions: ['arcane'],
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
    },
    duration: {
      type: 'varies',
    },
    effect:
      'Duplicate a spell of 9th level or lower or produce a comparable reality-warping effect',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (10th): Wish becomes the mightiest spell a mortal creature can cast, directly altering the foundations of reality.',
      ranks: {
        10: 'Wish is the mightiest spell a mortal creature can cast. By speaking aloud, you can alter the very foundations of reality.',
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You state a wish, making your greatest desire come true. A wish spell can produce any one of the following effects: duplicate any spell of 9th level or lower, produce any effect whose power level is in line with the above effects, grant a creature a +1 circumstance bonus to one ability score for 1 hour.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'weird-pf2e',
    name: 'Weird',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'illusion',
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
      'As phantasmal killer, but affecting all creatures in the area; each sees its own deadly phantasm and may die on a critical failure.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'wail-of-the-banshee-pf2e',
    name: 'Wail of the Banshee',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 9,
    school: 'necromancy',
    traditions: ['occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    savingThrow: {
      attribute: 'fort',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You loose a keening wail in a 40-foot emanation, dealing 8d10 negative damage and enfeebling creatures that fail their Fortitude saves.',
    classes: ['bard'],
  },
  {
    id: 'beseech-arcanotheign-pf2e',
    name: 'Beseech Arcanotheign',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 9,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'special',
      description: 'until the end of your next turn',
    },
    concentration: false,
    ritual: false,
    description:
      "With a whispered prayer or arcane sending, you conjure Arcanotheign, herald of Nethys. She's a storm of magic, half white and half black, roiling in a vaguely humanoid shape. She occupies the space of a Medium creature and has a Speed of 40 feet and a fly Speed of 60 feet.\nArrive (sonic) Storm's Unbridled Destruction Arcanotheign arrives with a flash of light and a cacophonous crash of colliding magic. All enemies in a take 8d12 sonic] damage with a basic Reflex save. A creature that critically fails is additionally for 10 minutes.\nDepart (electricity, healing) Flash of Brilliance Arcanotheign fires a powerful arcane blast at one target within 100 feet, dealing 5d12 electricity] damage with a basic Reflex save, and a powerful divine blast at one ally, healing 5d12 Hit Points. Then, Arcanotheign asks for payment in the form of a fond memory. If you pay this cost, you lose this memory, Arcanotheign gains this memory, and Arcanotheign whispers a secret into your mind; you can immediately on any subject at mythic proficiency.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'detonate-magic-pf2e',
    name: 'Detonate Magic',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
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
      "You cause the magic within the target to dissipate in a destructive explosion. You attempt to counteract the target. If the attempt succeeds, an explosion of magical force deals 8d6 force damage with a basic Reflex save. If you successfully counteract the magic of an item, it's deactivated for 1 week (or destroyed on a critical success) and the explosion is a 5-foot emanation from the item. If you successfully counteract a spell, the effect ends and the explosion affects either all creatures in the spell's area or the target of the spell and all creatures in a 5-foot emanation around it.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'dimensional-excision-pf2e',
    name: 'Dimensional Excision',
    system: 'pf2e',
    source: 'Pathfinder #212: A Voice in the Blight',
    level: 9,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: false,
    ritual: false,
    description:
      "You manipulate the boundaries between planes like a scalpel, using it to cut away portions of a creature's essence and banishing those portions to other realities and dimensions, afflicting the target deep lacerations or even severed appendages. The creature takes 14d10 damage (no damage type) and 2d10 persistent bleed damage and must attempt a Will save. If the target is not on its home plane, it takes a –4 status penalty to this save. A creature reduced to 0 HP has their entire body sectioned out and banished across multiple planes and dimensions, leaving nothing behind but their gear.\nHeightened (10th) The base damage increases by 2d10, and the persistent bleed damage by 1d10.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '10': 'Heightened (10th) The base damage increases by 2d10, and the persistent bleed damage by 1d10.',
      },
      summary:
        'Heightened (10th) The base damage increases by 2d10, and the persistent bleed damage by 1d10.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'falling-stars-pf2e',
    name: 'Falling Stars',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      "Area 4 40-foot bursts\nYou reach into the skies and call down an array of falling stars that explode upon colliding with the ground. Choose for the falling stars to be airbursts (sonic), asteroids (fire), comets (cold), or plasma (electricity). The spell gains the trait of the falling star type you chose. The four stars' central 10-foot bursts can't overlap. Each falling star deals 6d10 bludgeoning damage to each creature in the at the center of its area of effect before exploding, dealing 14d6 energy damage of the type you chose to each creature in its . A creature in any of the areas attempts one basic Reflex save against the spell no matter how many overlapping explosions it's caught in and can take each type of damage only once.\nHeightened (+1) The bludgeoning damage increases by 1d10, and the energy damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The bludgeoning damage increases by 1d10, and the energy damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'massacre-pf2e',
    name: 'Massacre',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You unleash a wave of death to snuff out the life force of those in its path. Each living creature of 17th level or lower in the line must attempt a Fortitude save. If the damage from massacre reduces a creature to 0 Hit Points, that creature dies instantly. If massacre doesn't kill even a single creature, the void energy hungrily turns backward toward you, dealing an additional 30 void damage to every living creature in the line (even those above 17th level) and 30 void damage to you.\nCritical Success The creature is unaffected.\nSuccess The creature takes 9d6 void damage.\nFailure The creature takes 100 void damage.\nCritical Failure The creature dies.\nHeightened (10th) The spell can affect living creatures up to 19th level. Increase the damage to 10d6 on a success, and to 115 on a failure.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '10': 'Heightened (10th) The spell can affect living creatures up to 19th level. Increase the damage to 10d6 on a success, and to 115 on a failure.',
      },
      summary:
        'Heightened (10th) The spell can affect living creatures up to 19th level. Increase the damage to 10d6 on a success, and to 115 on a failure.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'metamorphosis-pf2e',
    name: 'Metamorphosis',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
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
      "Harnessing your mastery of transformative magic, you hide forms within forms. You transform yourself into any form you could choose with a polymorph spell in your spell repertoire or that you could prepare of 8th-rank or lower (including any 8th-rank or lower heightened versions of spells you know). You gain 40 temporary Hit Points rather than the amount normally granted by the form.\nYou can Sustain the spell to enter a new form you haven't used during this metamorphosis. This replenishes your temporary Hit Points from this spell.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'natures-enmity-pf2e',
    name: "Nature's Enmity",
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 9,
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
      type: 'minutes',
      minutes: 10,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "Animals, plants, and fungi in the area turn against the targets. Each target suffers from the following effects as long as it remains in the area.\n• Vegetation springs up from every surface, giving each target a –10-foot circumstance penalty to its Speed any time it's adjacent to the plants and fungi.\n• Aggressive animals attack unpredictably. At the start of its turn, each target rolls a Flat. On a failure, it's attacked by creatures that deal 2d10 slashing] damage. The target attempts a basic Reflex save and is for 1 round on any outcome other than a critical success.\n• The target loses any connection to nature or natural creatures. The target must succeed at a Flat when casting any primal spell or the spell fails. Furthermore, animal, fungus, and plant creatures become hostile to it, even one with a strong bond to the target, such as an animal companion.\nThe GM might decide that you can't subject some creatures, such as an emissary of a nature deity, to the ire of nature.",
    classes: ['druid'],
  },
  {
    id: 'overwhelming-presence-pf2e',
    name: 'Overwhelming Presence',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
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
      type: 'special',
      description: 'until full tribute is paid',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You surround yourself with supernatural splendor, appearing to be a god or similarly majestic being, with an appearance, regalia, and iconography of your choice. Targets must attempt a Will save. Regardless of the outcome, the target is then temporarily immune for 1 minute.\nCritical Success The target is unaffected.\nSuccess The target must pay tribute to you two times. Paying tribute requires that the target spend a single action, which has either the move trait (as they bow) or manipulate trait (as they offer up a token in their hands). They must pay tribute at least once on each of their turns, if possible. While affected, the target is by you and can't use hostile actions against you.\nFailure As success, but the target must pay tribute a total of six times.\nCritical Failure As failure, but the target must spend all its actions paying tribute, and they cannot take other actions until the tribute is fully paid.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'phantasmagoria-pf2e',
    name: 'Phantasmagoria',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
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
      "You fill the targets' minds with endless images, like countless dreams and lives colliding with each other. The onrushing information deals 16d6 mental] damage to each target, depending on its Will save.\nCritical Success The target is unaffected.\nSuccess The target takes half damage and can't use reactions until the start of your next turn.\nFailure The target takes full damage and is until the start of your next turn.\nCritical Failure The target takes double damage and is confused for 1 minute.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'resplendent-mansion-pf2e',
    name: 'Resplendent Mansion',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 9,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure a towering mansion up to four stories tall and up to 300 feet on a side. While Casting the Spell, you hold an image of the mansion and its desired appearance in your mind. The mansion can contain as many or as few rooms as you desire, and it's decorated as you imagine it. You can imagine a purpose for each room of the mansion, and the proper accouterments appear within. Any furniture or other mundane fixtures function normally for anyone inside the mansion, but they cease to exist if taken beyond its walls. No fixture created with this spell can create magical effects, but magical devices brought into the mansion function normally.\nYour mansion contains the same types and quantities of foodstuffs and servants as created by the spell.\nEach of the mansion's exterior doorways and windows are protected by spells. You choose whether each alarm is audible or mental as you Cast the Spell, and each has a different sound (for an audible alarm) or sensation (for a mental one), allowing you to instantly determine which portal has been used.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'seize-soul-pf2e',
    name: 'Seize Soul',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      material: true,
    },
    duration: {
      type: 'unlimited',
    },
    concentration: false,
    ritual: false,
    description:
      "You trap the target's soul in the item before the soul can pass on to the afterlife. The item used to contain the soul can be anything as long as it's of the appropriate value. The item has AC 16 and its normal Hardness and HP. Destroying (not just breaking) an item or counteracting seize soul releases the soul to the afterlife.\nWhile the soul is in the item, the target can't be returned to life through any means, even powerful magic such as a ritual. If the item is destroyed or seize soul is counteracted on the item, the soul is freed. An item can't hold more than one soul, and any attempt wastes the spell.\nYou can also target an item that has had a soul trapped in it with a second casting of seize soul, which destroys the item and either releases the soul or relocates it to a different item, whichever you choose. This fails if the target is an artifact or the trapped soul is a creature of 19th level or higher.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'telepathic-demand-pf2e',
    name: 'Telepathic Demand',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 9,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      material: false,
    },
    duration: {
      type: 'special',
      description: 'varies',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You send the target a message of 25 words or fewer, and it can respond immediately with its own message of 25 words or fewer. Your message is insidious and has the effect of a spell, with the message substituting for the spoken suggestion. On a successful save, the target is temporarily immune for 1 day, and on a critical success, the target is temporarily immune for 1 month. You can target a creature only if you've previously been in telepathic contact with it before, such as via the telepathy spell.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'trim-the-blight-pf2e',
    name: 'Trim the Blight',
    system: 'pf2e',
    source: 'Pathfinder #212: A Voice in the Blight',
    level: 9,
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
      "You create a cone of shimmering energy that attempts to banish the influence of invasive, supernatural blight, such as that found in Tanglebriar. Blighted difficult terrain in the area becomes regular terrain, while blighted greater difficult terrain becomes difficult terrain; hazardous terrain in the area becomes nonhazardous. These effects persist for 1 hour.\nCreatures in the area that carry features of this blight (as determined by the GM, but automatically including all creatures with the fiend trait in this adventure) are trimmed as well, their supernatural infusion of blight being drained. These creatures take 12d10 spirit damage and must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature's reach with attacks is reduced by 5 feet (to a minimum of 5 feet) for 1 hour, they are Sickened 1 and Slowed 1 for 1 round.\nCritical Failure The creature's reach is reduced to 5 feet for 1 hour, they are Sickened 2 and slowed 1 for 1 minute.\nHeightened (10th) The spirit damage increases by 2d10, and 1 hour durations increase to 24 hours.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '10': 'Heightened (10th) The spirit damage increases by 2d10, and 1 hour durations increase to 24 hours.',
      },
      summary:
        'Heightened (10th) The spirit damage increases by 2d10, and 1 hour durations increase to 24 hours.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'unfathomable-song-pf2e',
    name: 'Unfathomable Song',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
    school: 'occult',
    traditions: ['occult'],
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
      "Fleeting notes of a strange and unnatural song fill the air, overtaking the mind. Each target must attempt a Will save when you cast the spell, and again the first time you Sustain this Spell each round. A creature needs to attempt only one save against the song each round, and you have to keep the same targets when you Sustain the Spell.\nCritical Success The target is unaffected, can't be affected on subsequent rounds, and is temporarily immune for 1 minute.\nSuccess The target is unaffected this round, but it can be affected on subsequent rounds.\nFailure Roll [[/r 1d4]] on the table below.\nCritical Failure Roll [[/r 1d4+1]] on the table below.\nResultEffect1The target is Frightened 22The target is for 1 round3The target is Stupefied 4 for 1 round4The target is for 1 round5The target is for 1 round and Stupefied 1 for an unlimited duration",
    classes: ['bard'],
  },
  {
    id: 'wails-of-the-damned-pf2e',
    name: 'Wails of the Damned',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You howl a lament of damned souls. Each living enemy in the area takes 8d10 void damage and must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes full damage.\nFailure The creature takes full damage and is [[/r 1d4]].\nCritical Failure The creature takes double damage and is Drained 4.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'weapon-of-judgment-pf2e',
    name: 'Weapon of Judgment',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 9,
    school: 'divine',
    traditions: ['divine'],
    castingTime: {
      type: 'action',
      amount: 2,
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
    description:
      "An immense weapon of spiritual energy appears, hovering in the air above the target. The weapon has the ghostly visual appearance of your deity's favored weapon. Name war or peace when you cast this spell.\nIf you name \"war,\" mentally choose one creature. This must be a creature both you and the target can see. The target instinctively knows which creature this is. At the end of each of the target's turns, if the target didn't use a hostile action against the creature you chose during that turn, the weapon Strikes the target.\nIf you name \"peace,\" mentally choose up to five allies. The target instinctively knows who those allies are. The weapon Strikes the target each time the target uses a hostile action against you or one of the chosen allies. The weapon Strikes only once per action, even if the action targets multiple allies (such as for a or a ).\nStrikes with the weapon are melee weapon attacks, but they use your spell attack modifier. Regardless of its appearance, the weapon deals 4d10 damage. The damage type is the same as the chosen weapon (or any of its types for a versatile weapon). The attack deals spirit damage instead if that would be more detrimental to the creature (as determined by the GM). No other statistics or attributes of the weapon apply, and even a ranged weapon attacks adjacent creatures only. The weapon takes a multiple attack penalty, which increases throughout the target's turn, but its penalty is separate from yours.\nA weapon of judgment is a weapon for the purposes of triggers, resistances, and so forth. The weapon doesn't take up space, grant flanking, or have any other attributes a creature would. The weapon can't make any attack other than its Strike, and feats or spells that affect weapons don't apply to this weapon.\nHeightened (10th) The damage increases by 1d10.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '10': 'Heightened (10th) The damage increases by 1d10.',
      },
      summary: 'Heightened (10th) The damage increases by 1d10.',
    },
    classes: ['cleric'],
  },
  {
    id: 'wrathful-storm-pf2e',
    name: 'Wrathful Storm',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 9,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'ranged',
      feet: 800,
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
      "A massive storm cloud forms in the air above the area, spreading rain and gales. The wind imposes a –4 circumstance penalty to physical ranged attacks. The air in the area is greater difficult terrain for flying creatures. When you Cast this Spell and the first time each round you Sustain it on subsequent rounds, you can choose one of the following storm effects. You can't choose the same effect twice in a row.\n• Blizzard The driving snow deals 4d8 cold] damage to each creature in or below the storm with no save. Everything in or beneath the cloud is by driving snow and any ground is difficult terrain.\n• Hail Each creature in or below the storm takes 4d10 bludgeoning] damage with a basic Fortitude save.\n• Lightning Choose up to 10 creatures in or below the storm to be struck by lightning. Each of them takes 7d6 electricity] damage with a basic Reflex save.\n• Tornado A roughly cylindrical whirlwind appears in or below the cloud in a 30-foot radius. Each creature in the whirlwind is thrown 40 feet upward.\nHeightened (10th) The range increases to 2,000 feet and the cloud is a 1,000-foot burst.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '10': 'Heightened (10th) The range increases to 2,000 feet and the cloud is a 1,000-foot burst.',
      },
      summary:
        'Heightened (10th) The range increases to 2,000 feet and the cloud is a 1,000-foot burst.',
    },
    classes: ['druid'],
  },
]);
