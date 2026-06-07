import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Cantrips Spells - SRD 5.2
export const cantrips: Spell[] = [
  {
    id: 'acid-splash',
    name: 'Acid Splash',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6',
      },
      type: 'acid',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd6',
          notation: '1d6',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You create an acidic bubble at a point within range, where it explodes in a 5-foot-radius Sphere. Each creature in that Sphere must succeed on a Dexterity saving throw or take 1d6 Acid damage.',
    atHigherLevels:
      'The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'chill-touch',
    name: 'Chill Touch',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd10',
        notation: '1d10',
      },
      type: 'necrotic',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd10',
          notation: '1d10',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      "You channel the chill of the grave through your touch. Make a melee spell attack. On a hit, the target takes 1d10 Necrotic damage, and it can't regain Hit Points until the start of your next turn.",
    atHigherLevels:
      'The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).',
    classes: ['sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'dancing-lights',
    name: 'Dancing Lights',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      materialDescription: 'a bit of phosphorus',
    },
    duration: {
      type: 'concentration',
      maxDuration: '1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      'You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover for the duration. Each light sheds Dim Light in a 10-foot radius.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'eldritch-blast',
    name: 'Eldritch Blast',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd10',
        notation: '1d10',
      },
      type: 'force',
    },
    concentration: false,
    ritual: false,
    description:
      'You hurl a beam of crackling energy. Make a ranged spell attack against one creature or object in range. On a hit, the target takes 1d10 Force damage.',
    atHigherLevels:
      'The spell creates multiple beams at higher levels: two beams at 5th level, three at 11th level, and four at 17th level. Make separate attacks for each beam.',
    classes: ['warlock'],
  },
  {
    id: 'fire-bolt',
    name: 'Fire Bolt',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd10',
        notation: '1d10',
      },
      type: 'fire',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd10',
          notation: '1d10',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack. On a hit, the target takes 1d10 Fire damage. A flammable object hit by this spell starts burning if it isn't being worn or carried.",
    atHigherLevels:
      'The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'guidance',
    name: 'Guidance',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'reaction',
      amount: 1,
      condition: 'when you or an ally within 10 feet fails an ability check',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You channel magical insight to the creature who failed the ability check. That creature can roll a d4 and add the number rolled to the check, potentially turning it into a success.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'light',
    name: 'Light',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'evocation',
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
      materialDescription: 'a firefly or phosphorescent moss',
    },
    duration: {
      type: 'hours',
      hours: 1,
    },
    target: '1 object no larger than 10 feet in any dimension',
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText:
      'A hostile creature holding or wearing the target object can avoid the spell with a successful Dexterity saving throw.',
    concentration: false,
    ritual: false,
    description:
      'You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'mage-hand',
    name: 'Mage Hand',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'mending',
    name: 'Mending',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'transmutation',
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
      materialDescription: 'two lodestones',
    },
    duration: {
      type: 'instant',
    },
    target: '1 object you touch',
    concentration: false,
    ritual: false,
    description:
      'This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.',
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'message',
    name: 'Message',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      materialDescription: 'a copper wire',
    },
    duration: {
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You point toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'minor-illusion',
    name: 'Minor Illusion',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'illusion',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 30,
    },
    components: {
      verbal: false,
      somatic: true,
      material: true,
      materialDescription: 'a bit of fleece',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You create a sound or an image of an object within range that lasts for the duration. If you create a sound, it can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose.",
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'poison-spray',
    name: 'Poison Spray',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd12',
        notation: '1d12',
      },
      type: 'poison',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd12',
          notation: '1d12',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You spray toxic mist at a creature within range. Make a ranged spell attack. On a hit, the target takes 1d12 Poison damage.',
    atHigherLevels:
      'The damage increases by 1d12 when you reach levels 5 (2d12), 11 (3d12), and 17 (4d12).',
    classes: ['druid', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'prestidigitation',
    name: 'Prestidigitation',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'transmutation',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell is a minor magical trick that novice spellcasters use for practice. You create one of several minor effects within range.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'produce-flame',
    name: 'Produce Flame',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 10,
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd8',
        notation: '1d8',
      },
      type: 'fire',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd8',
          notation: '1d8',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      'A flickering flame appears in your hand and sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The spell ends if you dismiss it or cast it again. You can attack with the flame, dealing fire damage.',
    atHigherLevels:
      'The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).',
    classes: ['druid'],
  },
  {
    id: 'ray-of-frost',
    name: 'Ray of Frost',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd8',
        notation: '1d8',
      },
      type: 'cold',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd8',
          notation: '1d8',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      'A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack. On a hit, the target takes 1d8 Cold damage, and its Speed is reduced by 10 feet until the start of your next turn.',
    atHigherLevels:
      'The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'resistance',
    name: 'Resistance',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      maxDuration: '1 minute',
    },
    target: '1 willing creature you touch',
    concentration: true,
    ritual: false,
    description:
      'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'sacred-flame',
    name: 'Sacred Flame',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    damage: {
      base: {
        count: 1,
        die: 'd8',
        notation: '1d8',
      },
      type: 'radiant',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd8',
          notation: '1d8',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      'Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 Radiant damage. The target gains no benefit from Half Cover or Three-Quarters Cover for this saving throw.',
    atHigherLevels:
      'The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).',
    classes: ['cleric'],
  },
  {
    id: 'shillelagh',
    name: 'Shillelagh',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'transmutation',
    castingTime: {
      type: 'bonus-action',
      amount: 1,
    },
    range: {
      type: 'touch',
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'mistletoe, a shamrock leaf, and a club or quarterstaff',
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    target: '1 club or quarterstaff you are holding',
    concentration: false,
    ritual: false,
    description:
      "The wood of a club or quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. The weapon also becomes magical, if it isn't already. The spell ends if you cast it again or if you let go of the weapon.",
    classes: ['druid'],
  },
  {
    id: 'shocking-grasp',
    name: 'Shocking Grasp',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'evocation',
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
    target: '1 creature you touch',
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd8',
        notation: '1d8',
      },
      type: 'lightning',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd8',
          notation: '1d8',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      "Lightning springs from your hand to deliver a shock. Make a melee spell attack, with Advantage if the target is wearing metal armor. On a hit, the target takes 1d8 Lightning damage and can't take Reactions until the start of its next turn.",
    atHigherLevels:
      'The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'spare-the-dying',
    name: 'Spare the Dying',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'necromancy',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 15,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    target: "1 creature with 0 Hit Points within range that isn't dead",
    concentration: false,
    ritual: false,
    description:
      "Choose a creature within range that has 0 Hit Points and isn't dead. The creature becomes Stable.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'thaumaturgy',
    name: 'Thaumaturgy',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You manifest a minor wonder, a sign of supernatural power. You create one of several effects within range.',
    classes: ['cleric'],
  },
  {
    id: 'true-strike',
    name: 'True Strike',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
    school: 'divination',
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'self',
    },
    components: {
      verbal: false,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6',
      },
      type: 'radiant',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd6',
          notation: '1d6',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      "Guided by a flash of magical insight, you make one attack with the weapon used in the spell's casting. The attack uses your spellcasting ability for the attack and damage rolls instead of Strength or Dexterity. If the attack hits, the weapon deals an extra 1d6 Radiant damage.",
    atHigherLevels:
      'The extra damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
  },
  {
    id: 'vicious-mockery',
    name: 'Vicious Mockery',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      material: false,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6',
      },
      type: 'psychic',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd6',
          notation: '1d6',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      'You unleash a string of insults laced with subtle enchantments at one creature you can see within range. The target must succeed on a Wisdom saving throw or take 1d6 Psychic damage and have Disadvantage on the next attack roll it makes before the end of its next turn.',
    atHigherLevels:
      'The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).',
    classes: ['bard'],
  },
  {
    id: 'druidcraft',
    name: 'Druidcraft',
    level: 0,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'Whispering to the spirits of nature, you create a tiny harmless sensory effect that predicts the weather, make a flower bloom, create a faint sensory effect, or light/snuff a small flame.',
    classes: ['druid'],
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
  },
  {
    id: 'elementalism',
    name: 'Elementalism',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "You exert control over the elements, creating one of the following effects within range.\n\n***Beckon Air.*** You create a breeze strong enough to ripple cloth, stir dust, rustle leaves, and close open doors and shutters, all in a 5-foot Cube. Doors and shutters being held open by someone or something aren't affected.\n\n***Beckon Earth.*** You create a thin shroud of dust or sand that covers surfaces in a 5-foot-square area, or you cause a single word to appear in your handwriting in a patch of dirt or sand.\n\n***Beckon Fire.*** You create a thin cloud of harmless embers and colored, scented smoke in a 5-foot Cube. You choose the color and scent, and the embers can light candles, torches, or lamps in that area. The smoke's scent lingers for 1 minute.\n\n***Beckon Water.*** You create a spray of cool mist that lightly dampens creatures and objects in a 5-foot Cube. Alternatively, you create 1 cup of clean water either in an open container or on a surface, and the water evaporates in 1 minute.\n\n***Sculpt Element.*** You cause dirt, sand, fire, smoke, mist, or water that can fit in a 1-foot Cube to assume a crude shape (such as that of a creature) for 1 hour.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'sorcerous-burst',
    name: 'Sorcerous Burst',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You cast sorcerous energy at one creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d8 damage of a type you choose: Acid, Cold, Fire, Lightning, Poison, Psychic, or Thunder. If you roll an 8 on a d8 for this spell, you can roll another d8, and add it to the damage. When you cast this spell, the maximum number of these d8s you can add to the spell's damage equals your spellcasting ability modifier.",
    atHigherLevels:
      'The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).',
    classes: ['sorcerer'],
  },
  {
    id: 'starry-wisp',
    name: 'Starry Wisp',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    level: 0,
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
      type: 'instant',
    },
    attackRoll: true,
    damage: {
      base: {
        count: 1,
        die: 'd8',
        notation: '1d8',
      },
      type: 'radiant',
      scaling: {
        type: 'character-level',
        increment: {
          count: 1,
          die: 'd8',
          notation: '1d8',
        },
      },
    },
    concentration: false,
    ritual: false,
    description:
      "You launch a mote of light at one creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d8 Radiant damage, and until the end of your next turn, it emits Dim Light in a 10-foot radius and can't benefit from the Invisible condition.",
    atHigherLevels:
      'The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).',
    classes: ['bard', 'druid'],
  },
];
