import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level10Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'cataclysm-10-pf2e',
    name: 'Cataclysm',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 10,
    school: 'evocation',
    traditions: ['divine', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 1000,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    area: '60-foot burst',
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    damage: {
      base: {
        count: 5,
        die: 'd10',
        notation: '5d10',
      },
      type: 'bludgeoning',
    },
    concentration: false,
    ritual: false,
    description:
      'You call an instant, devastating earthquake, volcanic eruption, and storm. Creatures in a 60-foot burst take 5d10 bludgeoning, 5d10 fire, and 5d10 electricity damage. Targets attempt a Fortitude save.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'fabricated-truth-pf2e',
    name: 'Fabricated Truth',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 10,
    school: 'enchantment',
    traditions: ['arcane', 'occult'],
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
      material: true,
    },
    duration: {
      type: 'unlimited',
    },
    target: '1 creature within range',
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      'You create a fabricated reality and force it upon the target. The target must attempt a Will save. On a failure, the target believes the fabricated truth you present, and its memories are altered to accommodate this new truth.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'revival-pf2e',
    name: 'Revival',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 10,
    school: 'necromancy',
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    target: '1 dying creature within range',
    concentration: false,
    ritual: false,
    description:
      'You infuse the target with positive energy to bring it back from the brink of death. The target loses the dying condition entirely and stabilizes with 0 Hit Points. The target then gains 1 Hit Point and awakens.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'time-stop-pf2e',
    name: 'Time Stop',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 10,
    school: 'transmutation',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      type: 'varies',
    },
    concentration: false,
    ritual: false,
    description:
      'You temporarily stop time for everything but yourself, allowing you to use several actions in what appears to others to be no time at all. You gain 3 extra actions you can use on your turn.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'wish-9-pf2e',
    name: 'Wish',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 10,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Wish is the mightiest spell a mortal creature can cast. By speaking aloud, you can alter the very foundations of reality.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'avatar-pf2e',
    name: 'Avatar',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 10,
    school: 'divine',
    traditions: ['divine'],
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
      "You transform into an avatar of your deity, assuming a Huge battle form. You have hands in this battle form and can take manipulate actions. You can Dismiss this spell. You gain the following statistics and abilities regardless of which deity's battle form you assume:\n• AC = 25 + your level. Ignore your armor's check penalty and Speed reduction.\n• 30 temporary Hit Points.\n• Darkvision.\n• One or more attacks specific to your deity's battle form, which are the only attacks you can with. You're trained with them. Your attack modifier is +33, and you use the listed damage. Melee attacks are Strength based (for the purposes of the condition, for example) unless they have the finesse trait, and all ranged attacks are Dexterity based.\n• Athletics modifier of +35, unless your own is higher.\nYou also gain the specific abilities listed for your deity below:\n• Abadar\n• Speed 50 feet, burrow Speed 30 feet, immune to ;\n• Ranged a crossbow (range increment 120 feet, reload 1), Damage 6d10+3 piercing.\n• Achaekek\n• Speed 70 feet, climb Speed 50 feet, ignore difficult terrain and greater difficult terrain;\n• Melee a mantis claw (agile, backswing, finesse, reach 15 feet, versatile P), Damage 6d8+6 slashing;\n• Ranged a spine volley (range 60 feet), Damage 6d6+3 piercing\n• Asmodeus\n• Speed 70 feet, fly;\n• Melee a mace (reach 15 feet), Damage 6d10+6 bludgeoning;\n• Ranged a hell fire (range 120 feet), Damage 6d6+3 fire.\n• Calistria\n• Speed 30 feet, fly Speed 70 feet;\n• Melee a whip (disarm, finesse, nonlethal, reach 20 feet), Damage 6d4+6 slashing;\n• Ranged a savored sting (range 60 feet), Damage 6d6+3 poison.\n• Cayden Cailean\n• Speed 70 feet, fly, ignore difficult terrain and greater difficult terrain;\n• Melee a rapier (deadly 3d8, reach 15 feet), Damage 6d6+6 piercing;\n• Ranged a ale splash (range 120 feet), Damage 6d6+3 poison.\n• Desna\n• Speed 30 feet, fly Speed 70 feet;\n• Melee a starknife (agile, deadly 3d4, finesse, reach 15 feet, silver, thrown 60 feet), Damage 6d4+6 piercing;\n• Ranged a moonbeam (range 120 feet, silver), Damage 6d6+3 fire.\n• Erastil\n• Speed 70 feet, fly, ignore difficult terrain and greater difficult terrain;\n• Ranged a longbow (deadly 3d8, range increment 150 feet), Damage 6d8+3 piercing.\n• Gorum\n• Speed 70 feet, immune to ;\n• Melee a greatsword (versatile P, reach 15 feet), Damage 6d12+6 slashing.\n• Gozreh\n• no land Speed, fly Speed 70 feet, swim Speed 70 feet, ignore difficult terrain and greater difficult terrain;\n• Melee a waves (reach 15 feet, shove, thrown 20 feet), Damage 6d8+6 bludgeoning;\n• Ranged a wind (versatile electricity, range 120 feet), Damage 6d6+3 bludgeoning.\n• Iomedae\n• Speed 70 feet, fly; shield (15 Hardness, can't be damaged);\n• Melee a longsword (versatile P, reach 15 feet), Damage 6d8+6 slashing.\n• Irori\n• Speed 80 feet, fly;\n• Melee a unfettered strike (agile, versatile P or S, finesse, reach 15 feet), Damage 6d8+6 bludgeoning;\n• Ranged a wind strike (range 60 feet), Damage 6d4+6 bludgeoning.\n• Lamashtu\n• Speed 30 feet, fly Speed 70 feet;\n• Melee a falchion (forceful, reach 15 feet), Damage 6d10+6 slashing;\n• Ranged a waters of Lamashtu (range 120 feet), Damage 6d6+3 poison.\n• Nethys\n• Speed 70 feet, fly;\n• Ranged a raw magic (range 120 feet; versatile cold, electricity, or fire), Damage 6d6 force.\n• Norgorber\n• Speed 70 feet, fly, ignore difficult terrain and greater difficult terrain;\n• Melee a shortsword (agile, finesse, versatile S, reach 15 feet), Damage 6d6+6 piercing;\n• Ranged a blackfinger toss (range 120 feet), Damage 6d6+3 poison.\n• Pharasma\n• Speed 70 feet, fly;\n• Melee a dagger (agile, finesse, reach 15 feet, thrown 40 feet), Damage 6d6+6 slashing;\n• Ranged a spiral blast (range 120 feet, damages only undead), Damage 6d8+3 vitality.\n• Rovagug\n• Speed 50 feet, burrow Speed 30 feet, immune to ;\n• Melee a jaws (reach 15 feet), Damage 6d12+6 piercing;\n• Melee a leg (agile, versatile P, reach 15 feet), Damage 6d8+6 bludgeoning.\n• Sarenrae\n• Speed 30 feet, fly Speed 70 feet;\n• Melee a scimitar (forceful, nonlethal, reach 15 feet), Damage 6d6+6 slashing;\n• Ranged a everflame (nonlethal, range 120 feet), Damage 6d6+3 fire.\n• Shelyn\n• Speed 70 feet, fly, ignore difficult terrain and greater difficult terrain;\n• Melee a glaive (deadly 3d8, nonlethal, reach 20 feet), Damage 6d8+6 slashing;\n• Ranged a melody of inner beauty, (nonlethal, range 120 feet), Damage 6d6+3 sonic.\n• Torag\n• Speed 50 feet, burrow Speed 30 feet, immune to ; shield (15 Hardness, can't be damaged);\n• Melee a warhammer (reach 15 feet, shove), Damage 6d8+6 bludgeoning.\n• Urgathoa\n• Speed 70 feet, fly;\n• Melee a scythe (deadly 3d10, trip, reach 15 feet), Damage 6d10+6 slashing;\n• Ranged a pallid plague (range 120 feet), Damage 6d6+3 void.\n• Zon-Kuthon\n• Speed 70 feet, fly, ignore difficult terrain and greater difficult terrain;\n• Melee a spiked chain (disarm, trip, reach 15 feet), Damage 6d8+6 slashing;\n• Ranged a midnight pain (mental, nonlethal, range 120 feet), Damage 6d6+3 mental.",
    classes: ['cleric'],
  },
  {
    id: 'freeze-time-pf2e',
    name: 'Freeze Time',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 10,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      "You temporarily stop time for everything but yourself, allowing you to use several actions in what appears to others to be no time at all. Immediately after casting freeze time, you can use up to 9 actions in 3 sets of up to 3 actions each.\nAfter each set of actions, 1 round passes, but for only you, effects specifically targeting or affecting you, and effects that you create during the stoppage. All other creatures and objects are invulnerable to your attacks, and you can't target or affect them with anything.\nOnce you have finished your actions, time begins to flow again for the rest of the world. If you created an effect with a duration that extends beyond freeze time's duration, such as , it immediately affects others again, but it doesn't have any of the effects that happen only when you first Cast the Spell.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'garden-of-the-green-mans-growth-pf2e',
    name: "Garden of the Green Man's Growth",
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 10,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'You cast your magic into the earth, calling out to a powerful green man, a verdant lesser deity of nature, to come to your aid. They occupy the space of a Medium creature, have a Speed of 40 feet, and a climb Speed of 40 feet.\nArrive (plant) Verdant Bloom The green man erupts from the ground in a burst of lush growth, dealing 10d8 bludgeoning] damage to creatures in a with a basic Reflex save. Creatures that fail this save are pushed 30 feet away from the green man and are knocked . The area becomes greater difficult terrain for 24 hours.\nDepart (plant) Forest of Grasping Vines The green man casts out their arms, causing vines to rise from the ground, lash at up to six different creatures, and coil them up. Each of these vines targets a different enemy within 100 feet of the green man and deals 12d6 slashing] damage with a basic Reflex save. A creature that fails is until it Escapes (on a critical failure it is until it Escapes). The DC is your spell DC. Each creature that begins its turn grabbed or by these vines takes an additional 4d6 bludgeoning] damage, as the vines continue to squeeze the life from it.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'indestructibility-pf2e',
    name: 'Indestructibility',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 10,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      description: 'until the start of your next turn',
    },
    concentration: false,
    ritual: false,
    description:
      "You sever yourself from cause and effect. For the duration of the spell, you are immune to any effect or damage that would harm you, excluding effects caused by artifacts, deific power, and similarly powerful sources. You can selectively allow yourself to be affected by anything you're willing to have affect you.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'manifestation-pf2e',
    name: 'Manifestation',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 10,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      'You spin secrets from the fundaments of magic, shaping them into a power with nearly unlimited potential. You duplicate a spell of 9th rank or lower of the tradition from which you cast manifestation, or a spell of 7th rank or lower from any tradition. Though you can normally choose only spells that are common or to which you have access, the GM might allow broader options.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'nature-incarnate-pf2e',
    name: 'Nature Incarnate',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 10,
    school: 'primal',
    traditions: ['primal'],
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
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "The primal power of the world flows through you. You transform into an incarnation of nature, either a green man or a kaiju. Your battle form is Medium for a green man or Gargantuan (30-foot-by-30-foot space) for a kaiju. While in this form, you gain the plant trait (for a green man) or the beast trait (for a kaiju). You can Dismiss the spell. You gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 25 + your level. Ignore your armor's check penalty and Speed reduction.\n• 30 temporary Hit Points.\n• Darkvision.\n• One or more attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +34, and you use the listed damage. These attacks are Strength based (for the purpose of the condition, for example). If your unarmed attack modifier is higher, you can use it instead.\n• Athletics modifier of +36, unless your own is higher.\nYou gain specific abilities based on the incarnation you choose:\n• Green Man\n• Speed 40 feet, climb 40 feet;\n• Melee 1 vines (reach 30 feet, versatile P), Damage 6d8+12 bludgeoning;\n• Ranged 1 thorns (range 100 feet), Damage 6d6+6 piercing;\n• Green Caress (aura, primal) 60 feet. Enemies other than plants must succeed at a Fortitude against your spell DC or become Clumsy 1 for 1 round (Clumsy 2 on a critical failure).\n• Kaiju\n• Speed 50 feet; resistance 5 to physical damage;\n• Melee 1 jaws (reach 30 feet), Damage 6d10+10 piercing;\n• Melee 1 claws (agile, reach 30 feet), Damage 6d8+8 slashing;\n• Melee 1 foot (agile, reach 15 feet), Damage 6d6+10 bludgeoning;\n• Unstoppable You are immune to being and ignore difficult terrain and greater difficult terrain;\n• Trample 3 You move up to double your Speed and move through the spaces of Huge or smaller creatures, trampling each creature whose space you enter. A trampled creature takes foot damage with a Reflex save against your spell DC.",
    classes: ['druid'],
  },
  {
    id: 'primal-herd-pf2e',
    name: 'Primal Herd',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 10,
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "Summoning the power of the natural world, you transform the targets into a herd of mammoths, and they each assume a Huge battle form. Each target must have enough space to expand into or the spell fails for that target. Each target gains the animal trait. Each target can Dismiss the spell's effects on themself. Each target gains the following while transformed:\n• AC = 22 + the target's level. Ignore any armor check penalty and Speed reduction.\n• 20 temporary Hit Points.\n• Speed 40 feet.\n• Low-light vision.\n• The following unarmed melee attacks, which are the only attacks the target can use to Strike. When Striking with these attacks, the target uses their attack modifier with the proficiency and item bonuses of their most favorable weapon or unarmed Strike, and the damage is listed for each attack. These attacks are Strength based (for the purpose of the condition, for example). Melee A tusk (reach 15 feet), Damage 4d8+19 piercing; Melee A trunk (agile, reach 15 feet), Damage 4d6+16 bludgeoning; Melee A foot (agile, reach 15 feet), Damage 4d6+13 bludgeoning.\n• Athletics modifier of +30, unless the target's own modifier is higher. 3 You move up to twice your Speed and move through the space of Large or smaller creatures, trampling each creature whose space you enter. A trampled creature takes damage from its foot Strike based on a basic Reflex save (DC = 19 + the target's level).",
    classes: ['druid'],
  },
  {
    id: 'remake-pf2e',
    name: 'Remake',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 10,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'hour',
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
      'You fully re-create an object from nothing, even if the object was destroyed. To do so, you must be able to picture the object in your mind. Additionally, the material component must be a remnant of the item, no matter how small or insignificant (even a speck of dust that remains from is enough). The spell fails if your imagination relied on too much guesswork; if the object would be too large to fit in a 5-foot cube; if the object still exists and you were simply not aware of it; or if the object is an artifact, has a level over 20, or has similar vast magical power.\nThe item reassembles in perfect condition. Even if your mental image was of a damaged or weathered object, the new one is in this perfected form. If the object was magical, this spell typically restores its constant magical properties, but not any temporary ones, such as charges or one-time uses. An item with charges or uses per day has all of its uses expended when remade, but it replenishes them normally thereafter.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'summon-oliphaunt-of-jandelay-pf2e',
    name: 'Summon Oliphaunt of Jandelay',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 10,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      type: 'special',
      description: 'until the end of your next turn',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "You briefly summon the mythical Oliphaunt of Jandelay, unleashing a manifestation of pure destruction that obliterates everything unfortunate enough to stand in its path. The summoned Oliphaunt occupies the space of a Gargantuan creature. It has a Speed of 200 feet.\nArrive (force) Devastating Displacement Using hidden magics and long-lost techniques, you conjure an immense gate to Jandelay, compelling the Oliphaunt to step through. The Oliphaunt arrives in a . Each creature in the area takes 8d10 force] damage (basic Reflex save). On a failure, the creature is also pushed 60 feet away from the Oliphaunt.\nDepart Annihilating Trample The Oliphaunt becomes aware that it has been summoned to a world that isn't on the verge of annihilation. It summons another enormous gate to Jandelay 200 feet in front of it. The Oliphaunt then rages forward through the gate, crushing everything in its path, before closing the gate behind it and disappearing. The Oliphaunt creates an {80-foot-wide path of devastation that extends 200 feet. Each creature and vehicle in the area takes 8d8 bludgeoning] damage (basic Fortitude save). A creature or vehicle reduced to 0 Hit Points is smashed into fine powder; its gear, passengers, and cargo remain. An unattended object in the area is destroyed unless it succeeds at a Fortitude save, regardless of Hardness, or unless it's an artifact or similarly hard to destroy. This trample automatically destroys any force effect, such as a wall of force.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
]);
