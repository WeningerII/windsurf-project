import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 3 Spells - SRD 5.2
export const level3Spells: Spell[] = [
  {
    id: 'animate-dead',
    name: 'Animate Dead',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      materialDescription: 'a drop of blood and a piece of bone',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell creates an Undead servant. Choose a pile of bones or a corpse of a Medium or Small Humanoid within range. Your spell imbues the target with a foul mimicry of life, raising it as an Undead creature.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, you animate or reassert control over two additional Undead creatures for each slot level above 3.',
    classes: ['cleric', 'wizard'],
  },
  {
    id: 'beacon-of-hope',
    name: 'Beacon of Hope',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'This spell bestows hope and vitality. Choose any number of creatures within range. For the duration, each target has advantage on Wisdom saving throws and death saving throws, and regains the maximum number of hit points possible from any healing.',
    classes: ['cleric'],
  },
  {
    id: 'beast-sense',
    name: 'Beast Sense',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      somatic: true,
      material: false,
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: true,
    description:
      "You touch a willing beast. For the duration, you can use your action to perceive through the beast's senses as if you were in its space. You gain the benefits of any special senses possessed by that creature.",
    classes: ['druid', 'ranger'],
  },
  {
    id: 'bestow-curse',
    name: 'Bestow Curse',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      'You touch a creature, and that creature must succeed on a Wisdom saving throw or become cursed for the duration. Choose the nature of the curse from several options.',
    atHigherLevels:
      'With level 4 slot: 10 minutes. Level 5: 8 hours. Level 7: 24 hours. Level 9: permanent.',
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'blinding-smite',
    name: 'Blinding Smite',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'evocation',
    castingTime: {
      type: 'bonus-action',
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
    effect: 'Your next weapon hit deals extra radiant damage and can blind the target',
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText:
      'The target of the triggering weapon hit makes a Constitution saving throw to avoid the extra radiant burst and the Blinded condition.',
    concentration: true,
    ritual: false,
    description:
      'The next time you hit a creature with a weapon attack before this spell ends, your weapon flares with bright light, and the attack deals an extra 3d6 radiant damage to the target. Additionally, the target must succeed on a Constitution saving throw, or it takes 3d6 radiant damage and has the Blinded condition until the end of your next turn.',
    classes: ['paladin'],
  },
  {
    id: 'call-lightning',
    name: 'Call Lightning',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
        count: 3,
        die: 'd10',
        notation: '3d10',
      },
      type: 'lightning',
    },
    concentration: true,
    ritual: false,
    description:
      'A storm cloud appears above you. Each time you use an action to call down lightning, each creature under the cloud must make a Dexterity saving throw, taking 3d10 Lightning damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d10 for each slot level above 3.',
    classes: ['druid'],
  },
  {
    id: 'clairvoyance',
    name: 'Clairvoyance',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'divination',
    castingTime: {
      type: 'minute',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 5280,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a focus worth 100 gp',
      materialCost: 100,
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'You create an invisible sensor within range in a location familiar to you or in an obvious location. You can see or hear (your choice) through the sensor as if you were there.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'conjure-animals',
    name: 'Conjure Animals',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'conjuration',
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
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'You summon fey creatures that appear in unoccupied spaces you can see within range. Choose from the following options for what appears: One creature of challenge rating 2 or lower, or two creatures of challenge rating 1 or lower, or four creatures of challenge rating 1/4 or lower, or eight creatures of challenge rating 1/8 or lower.',
    classes: ['druid', 'ranger'],
  },
  {
    id: 'conjure-barrage',
    name: 'Conjure Barrage',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      material: true,
      materialDescription: 'a Melee or Ranged weapon worth at least 1 CP',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'cone',
      feet: 60,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 5,
        die: 'd8',
        notation: '5d8',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'You throw a weapon or fire a piece of ammunition into the air. Countless spectral weapons then fall in a 60-foot cone originating from you and disappear. Each creature of your choice that you can see in the area must make a Dexterity saving throw, taking 5d8 Force damage on a failed save or half as much damage on a successful one. The spell then teleports the material component back to your hand.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d8 for each slot level above 3.',
    classes: ['ranger'],
  },
  {
    id: 'counterspell',
    name: 'Counterspell',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'abjuration',
    castingTime: {
      type: 'reaction',
      amount: 1,
      condition: 'when you see a creature within 60 feet casting a spell',
    },
    range: {
      type: 'ranged',
      feet: 60,
    },
    components: {
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You attempt to interrupt a creature in the process of casting a spell. If the spell is being cast at level 3 or lower, it fails. If the spell is level 4 or higher, make an ability check using your spellcasting ability (DC 10 + spell level). On a success, the spell fails.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the interrupted spell has no effect if its level is less than or equal to the slot you used.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'create-food-and-water',
    name: 'Create Food and Water',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You create 45 pounds of food and 30 gallons of water on the ground or in containers within range, enough to sustain up to fifteen humanoids or five steeds for 24 hours. The food is bland but nourishing, and spoils if uneaten after 24 hours. The water is clean and doesn't go bad.",
    classes: ['cleric', 'paladin'],
  },
  {
    id: 'daylight',
    name: 'Daylight',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'evocation',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "A 60-foot-radius Sphere of light spreads out from a point of your choice within range. The Sphere is bright light and sheds Dim Light for an additional 60 feet. If you chose a point on an object you're holding or one that isn't being worn or carried, the light emanates from the object and moves with it.",
    classes: ['cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'dispel-magic',
    name: 'Dispel Magic',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      'Choose one creature, object, or magical effect within range. Any spell of level 3 or lower on the target ends. For spells of level 4 or higher, make an ability check using your spellcasting ability (DC 10 + spell level). On a success, the spell ends.',
    atHigherLevels:
      "When you cast this spell using a spell slot of level 4 or higher, you automatically end the effects of a spell on the target if the spell's level is equal to or less than the slot used.",
    classes: ['bard', 'cleric', 'druid', 'paladin', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'eruption',
    name: 'Eruption',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 6,
        die: 'd6',
        notation: '6d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A geyser of boiling water erupts from a point on the ground that you can see within range. Each creature in that area must make a Dexterity saving throw. A creature takes 6d6 fire damage on a failed save, or half as much damage on a successful one.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.',
    classes: ['druid', 'sorcerer'],
  },
  {
    id: 'fear',
    name: 'Fear',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'illusion',
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
      materialDescription: 'a white feather',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cone',
      feet: 30,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot Cone must succeed on a Wisdom saving throw or drop whatever it is holding and have the Frightened condition for the duration.",
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'feign-death',
    name: 'Feign Death',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: true,
    description:
      "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead. The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as raise dead.",
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'fireball',
    name: 'Fireball',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a ball of bat guano and sulfur',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 8,
        die: 'd6',
        notation: '8d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A bright streak flashes from you to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius Sphere centered on that point must make a Dexterity saving throw, taking 8d6 Fire damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d6 for each slot level above 3.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'fly',
    name: 'Fly',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      material: true,
      materialDescription: 'a feather',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      'You touch a willing creature. The target gains a Fly Speed of 60 feet for the duration. When the spell ends, the target falls if it is still aloft.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, you can target one additional creature for each slot level above 3.',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'gaseous-form',
    name: 'Gaseous Form',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      material: true,
      materialDescription: 'gauze',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      "You transform a willing creature you touch, along with everything it's wearing and carrying, into a misty cloud for the duration. The target's only method of movement is a Fly Speed of 10 feet.",
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'glyph-of-warding',
    name: 'Glyph of Warding',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      materialDescription: 'incense and powdered diamond worth at least 200 gp',
    },
    duration: {
      type: 'permanent',
    },
    concentration: false,
    ritual: false,
    description:
      'When you cast this spell, you inscribe a glyph that harms other creatures, either upon a surface (such as a table or a section of floor or wall) or within an object that can be closed (such as a book, scroll, or treasure chest) to conceal the glyph until you or a creature you designate touches the object or surface.',
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'haste',
    name: 'Haste',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      materialDescription: 'a shaving of licorice root',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText:
      'A creature that starts its turn in the cloud must succeed on a Constitution saving throw or spend its action retching and reeling.',
    concentration: true,
    ritual: false,
    description:
      "Choose a willing creature that you can see within range. Until the spell ends, the target's Speed is doubled, it gains a +2 bonus to AC, it has Advantage on Dexterity saving throws, and it gains an additional action on each of its turns.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'hunger-of-hadar',
    name: 'Hunger of Hadar',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'conjuration',
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
      materialDescription: 'a pickled octopus tentacle',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    concentration: true,
    ritual: false,
    description:
      'You open a gateway to the dark between the stars, a region infested with unknown horrors. A 20-foot-radius sphere of blackness and bitter cold appears, centered on a point with range and lasting for the duration. This void is filled with a cacophony of soft whispers and slurping noises that can be heard up to 30 feet away. No light, magical or otherwise, can illuminate the area, and creatures fully within the area are blinded.',
    classes: ['warlock'],
  },
  {
    id: 'hypnotic-pattern',
    name: 'Hypnotic Pattern',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      verbal: false,
      somatic: true,
      material: true,
      materialDescription: 'a glowing stick of incense',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 30,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      'You create a twisting pattern of colors that weaves through the air inside a 30-foot Cube within range. Each creature in the area must make a Wisdom saving throw. On a failed save, the creature has the Charmed condition for the duration and also has the Incapacitated condition and a Speed of 0.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'leomunds-tiny-hut',
    name: "Leomund's Tiny Hut",
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'evocation',
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: true,
    description:
      'A 10-foot-radius immobile dome of magical force springs into existence around and above you. The spell ends if you leave its area. Nine creatures of Medium size or smaller can fit inside the dome with you. If the space the dome occupies is larger than that, or if roughly spherical unobstructed space around you is larger, the spell fails, and the casting is wasted.',
    classes: ['bard', 'wizard'],
  },
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      material: true,
      materialDescription: 'a bit of fur and a glass rod',
    },
    duration: {
      type: 'instant',
    },
    areaOfEffect: {
      type: 'line',
      length: 100,
      width: 5,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 8,
        die: 'd6',
        notation: '8d6',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'A stroke of lightning forming a 100-foot-long, 5-foot-wide Line blasts out from you in a direction you choose. Each creature in the Line must make a Dexterity saving throw, taking 8d6 Lightning damage on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d6 for each slot level above 3.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'magic-circle',
    name: 'Magic Circle',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'abjuration',
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
      materialDescription: 'holy water or silver/iron powder worth 100 gp',
      materialCost: 100,
      materialConsumed: true,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 10,
      height: 20,
    },
    concentration: false,
    ritual: false,
    description:
      'You create a 10-foot-radius, 20-foot-tall Cylinder of magical energy centered on a point on the ground that you can see within range. Choose one or more of the following creature types: Celestials, Elementals, Fey, Fiends, or Undead.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the duration increases by 1 hour for each slot level above 3.',
    classes: ['cleric', 'paladin', 'warlock', 'wizard'],
  },
  {
    id: 'major-image',
    name: 'Major Image',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      material: true,
      materialDescription: 'a bit of fleece',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 20,
    },
    concentration: true,
    ritual: false,
    description:
      'You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot Cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 6 or higher, the spell lasts until dispelled, without requiring Concentration.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'mass-healing-word',
    name: 'Mass Healing Word',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'abjuration',
    castingTime: {
      type: 'bonus-action',
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
      type: 'instant',
    },
    healing: {
      count: 2,
      die: 'd4',
      modifier: 0,
      notation: '2d4',
    },
    concentration: false,
    ritual: false,
    description:
      'As you call out words of restoration, up to six creatures of your choice that you can see within range regain Hit Points equal to 2d4 plus your spellcasting ability modifier.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the healing increases by 1d4 for each slot level above 3.',
    classes: ['bard', 'cleric'],
  },
  {
    id: 'meld-into-stone',
    name: 'Meld into Stone',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      hours: 8,
    },
    concentration: false,
    ritual: true,
    description:
      'You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.',
    classes: ['cleric', 'druid', 'wizard'],
  },
  {
    id: 'nondetection',
    name: 'Nondetection',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      material: true,
      materialDescription: 'diamond dust worth 25 gp',
      materialCost: 25,
      materialConsumed: true,
    },
    duration: {
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      'For the duration, you hide a target that you touch from divination magic. The target can be a willing creature or a place or an object no larger than 10 feet in any dimension.',
    classes: ['bard', 'ranger', 'wizard'],
  },
  {
    id: 'phantom-steed',
    name: 'Phantom Steed',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'illusion',
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
      material: false,
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: true,
    description:
      "A Large quasi-real, horse-like creature appears on the ground in an unoccupied space of your choice within range. You decide the creature's appearance, but it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed. For the duration, you or a creature you choose can ride the steed. The creature uses the statistics for a riding horse, except it has a speed of 100 feet and can travel 10 miles in an hour, or 13 miles at a fast pace.",
    classes: ['wizard'],
  },
  {
    id: 'plant-growth',
    name: 'Plant Growth',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'transmutation',
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'This spell channels vitality into plants within a specific area. There are two possible uses: if you cast this spell using 1 action, all normal plants in a 100-foot radius centered on a point within range become thick and overgrown. A creature moving through the area must spend 4 feet of movement for every 1 foot it moves.',
    classes: ['bard', 'druid', 'ranger'],
  },
  {
    id: 'protection-from-energy',
    name: 'Protection from Energy',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      'For the duration, the willing creature you touch has Resistance to one damage type of your choice: Acid, Cold, Fire, Lightning, or Thunder.',
    classes: ['cleric', 'druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'remove-curse',
    name: 'Remove Curse',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      "At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's attunement to the object.",
    classes: ['cleric', 'paladin', 'warlock', 'wizard'],
  },
  {
    id: 'revivify',
    name: 'Revivify',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      materialDescription: 'diamonds worth 300 gp',
      materialCost: 300,
      materialConsumed: true,
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You touch a creature that has died within the last minute. That creature returns to life with 1 Hit Point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts.",
    classes: ['cleric', 'druid', 'paladin', 'ranger'],
  },
  {
    id: 'sending',
    name: 'Sending',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      materialDescription: 'copper wire',
    },
    duration: {
      type: 'instant',
    },
    concentration: false,
    ritual: true,
    description:
      'You send a short message of 25 words or fewer to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender, and can answer in a like manner immediately.',
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'sleet-storm',
    name: 'Sleet Storm',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'conjuration',
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
      materialDescription: 'a pinch of dust and a few drops of water',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cylinder',
      radius: 40,
      height: 20,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused. The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'slow',
    name: 'Slow',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a drop of molasses',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'cube',
      feet: 40,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    concentration: true,
    ritual: false,
    description:
      "You alter time around up to six creatures of your choice in a 40-foot Cube within range. Each target must succeed on a Wisdom saving throw or be affected by the spell for the duration. An affected target's Speed is halved.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'speak-with-dead',
    name: 'Speak with Dead',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'necromancy',
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
      materialDescription: 'burning incense',
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must have a mouth, and it can't be Undead.",
    classes: ['bard', 'cleric', 'wizard'],
  },
  {
    id: 'speak-with-plants',
    name: 'Speak with Plants',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    description:
      "You imbue plants within 30 feet of you with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell's area within the past day, gaining information about creatures that have passed, weather, and other circumstances. You can also turn difficult terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration.",
    classes: ['bard', 'druid', 'ranger'],
  },
  {
    id: 'spirit-guardians',
    name: 'Spirit Guardians',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
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
      material: true,
      materialDescription: 'a holy symbol',
    },
    duration: {
      type: 'concentration',
      maxDuration: '10 minutes',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 15,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'half',
    },
    damage: {
      base: {
        count: 3,
        die: 'd8',
        notation: '3d8',
      },
      type: 'radiant',
    },
    concentration: true,
    ritual: false,
    description:
      'You call forth spirits to protect you. They flit around you in a 15-foot-radius Sphere. When a creature enters the area for the first time or starts its turn there, it must make a Wisdom saving throw, taking 3d8 Radiant or Necrotic damage (your choice) on a failed save.',
    atHigherLevels:
      'When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d8 for each slot level above 3.',
    classes: ['cleric'],
  },
  {
    id: 'stinking-cloud',
    name: 'Stinking Cloud',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a rotten egg or several skunk cabbage leaves',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText:
      'A creature that starts its turn in the cloud must succeed on a Constitution saving throw or spend its action retching and reeling.',
    concentration: true,
    ritual: false,
    description:
      "A 20-foot-radius sphere of yellowish, nauseating gas spreads from a point of your choice within range. The cloud spreads around corners. Each creature that starts its turn in the cloud must succeed on a Constitution saving throw or spend its action that turn retching and reeling. Creatures that don't need to breathe or are immune to poison automatically succeed on the save.",
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'summon-lesser-demons',
    name: 'Summon Lesser Demons',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 3,
    school: 'conjuration',
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
      materialDescription: 'a vial of blood from a humanoid killed within the past 24 hours',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 hour',
    },
    concentration: true,
    ritual: false,
    description:
      "You utter foul words of power summoning demons from the lower planes. Up to eight demonlings or one demon of challenge rating 3 or lower appears in unoccupied spaces you can see within range. A summoned demon disappears when it drops to 0 hit points or when the spell ends. A demon summoned by this spell is friendly to you and your companions for the duration. Roll initiative for the summoned demon as a group, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you), as long as they don't violate its alignment.",
    classes: ['wizard'],
  },
  {
    id: 'tongues',
    name: 'Tongues',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      materialDescription: 'a clay ziggurat',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell grants the creature you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.',
    classes: ['bard', 'cleric', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'vampiric-touch',
    name: 'Vampiric Touch',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      type: 'concentration',
      maxDuration: '1 minute',
    },
    attackRoll: true,
    concentration: true,
    ritual: false,
    description:
      'The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against a creature within your reach. On a hit, the target takes 3d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns without using an action.',
    atHigherLevels:
      'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.',
    classes: ['wizard'],
  },
  {
    id: 'water-breathing',
    name: 'Water Breathing',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      materialDescription: 'a reed',
    },
    duration: {
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: true,
    description:
      'This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
  },
  {
    id: 'water-walk',
    name: 'Water Walk',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
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
      materialDescription: 'a piece of cork',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: true,
    description:
      'This spell grants the ability to move across any liquid surface—such as water, acid, mud, snow, quicksand, or lava—as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat).',
    classes: ['cleric', 'druid', 'ranger', 'sorcerer'],
  },
];
