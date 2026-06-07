import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level8Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'earthquake-pf2e',
    name: 'Earthquake',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'rounds',
      rounds: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You shake the ground, topple creatures into fissures, and collapse structures. The GM might add additional effects in certain areas. Cliffs might collapse, causing creatures to fall, or a lake might drain as fissures open up below its surface.',
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (10th): You create a massive earthquake that can devastate a settlement. The range increases to half a mile and the area to a quarter-mile burst.',
      ranks: {
        10: 'You create a massive earthquake that can devastate a settlement. The range increases to half a mile and the area to a quarter-mile burst.',
      },
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'horrid-wilting-pf2e',
    name: 'Horrid Wilting',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'necromancy',
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    damage: {
      base: {
        count: 10,
        die: 'd10',
        notation: '10d10',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      "You pull the moisture from the targets' bodies, dealing 10d10 negative damage. Creatures made of water or with the water trait, such as water elementals, take double damage from horrid wilting.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d10.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'maze-pf2e',
    name: 'Maze',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'conjuration',
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
    concentration: false,
    ritual: false,
    description:
      'You transport the target into an extradimensional maze of eldritch origin and trap it there. Once per turn, the target can attempt an Intelligence check or Perception check against your spell DC to escape the maze.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'misdirection-mass-8-pf2e',
    name: 'Misdirection, Mass',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'illusion',
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'This spell functions like misdirection, except that it can affect one creature per caster level.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'polar-ray-pf2e',
    name: 'Polar Ray',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'instant',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    damage: {
      base: {
        count: 10,
        die: 'd8',
        notation: '10d8',
      },
      type: 'cold',
    },
    concentration: false,
    ritual: false,
    description:
      'You fire a blue-white ray of freezing air and sleet that deals 10d8 cold damage. The target must attempt a Fortitude save. On a critical failure, the target is also drained 2.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d8.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'power-word-stun-8-pf2e',
    name: 'Power Word Stun',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
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
      type: 'instant',
    },
    target: '1 creature you can see within range',
    concentration: false,
    ritual: false,
    description:
      'You utter a word of power that stuns one creature you can see. If the creature has fewer than 150 HP, it is stunned.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The levels at which each outcome applies increase by 2.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'prismatic-wall-8-pf2e',
    name: 'Prismatic Wall',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'abjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 3,
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
      hours: 10,
    },
    effect: 'A shimmering, multicolored wall of light',
    concentration: false,
    ritual: false,
    description:
      'A shimmering, multicolored plane of light springs into being. The wall is opaque to normal sight. Each color has a special effect.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'sunburst-8-pf2e',
    name: 'Sunburst',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'evocation',
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
    area: '60-foot burst',
    savingThrow: {
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex save',
    damage: {
      base: {
        count: 8,
        die: 'd10',
        notation: '8d10',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'You cause brilliant sunlight to explode in a 60-foot burst. Creatures in the area take 8d10 damage and are blinded. Undead and creatures with light blindness take double damage. Targets attempt a Reflex save.',
    classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'disappearance-pf2e',
    name: 'Disappearance',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 8,
    school: 'illusion',
    traditions: ['arcane', 'occult'],
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
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You make a creature undetectable to all senses, not merely sight, for the duration.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'arctic-rift-pf2e',
    name: 'Arctic Rift',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
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
      "A jagged crack opens in the air, dealing 12d8 cold damage as it draws away warmth. Each creature along the rift must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is Slowed 1 until the start of your next turn.\nCritical Failure The creature takes double damage, is by a layer of ice, and is slowed 1 as long as it's immobilized. The ice is an object with 60 Hit Points, Hardness 5, immunity to cold damage, and vulnerability 10 to fire. It has object immunities and is destroyed if the target Escapes.\nHeightened (+1) The damage increases by 1d8 and the ice's Hit Points increase by 5.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        "Heightened (+1) The damage increases by 1d8 and the ice's Hit Points increase by 5.",
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'canticle-of-everlasting-grief-pf2e',
    name: 'Canticle of Everlasting Grief',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
    savingThrow: {
      attribute: 'wis',
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: false,
    ritual: false,
    description:
      "You create a melody distilled from pure grief, conveying the inevitable loss of everything your target cherishes, audible to only them. The target takes 10d6 mental damage depending on its Will save. A creature cursed by this spell can't benefit from circumstance or status bonuses, for the duration noted in the degree of success.\nCritical Success The target is unaffected.\nSuccess The target takes half damage, is Frightened 1, and is cursed for 1 round.\nFailure The target takes full damage, is Frightened 3, and is cursed for 1 week.\nCritical Failure The target takes double damage, is Frightened 4, and is cursed for an unlimited duration. While the curse remains, the target's allies are also affected by the curse while within 15 feet of the creature.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'confusing-colors-pf2e',
    name: 'Confusing Colors',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 8,
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
      verbal: false,
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
      "A cloud of cascading, ever-changing colors manifests in the air. Creatures are while inside the cloud, as are those within 20 feet of the cloud's area. A creature must attempt a Will save if it is inside the cloud when you cast it, enters the cloud, ends its turn within the cloud, or uses a or Interact action on the cloud. A creature currently affected by the cloud doesn't need to attempt new saves.\nSuccess The creature is unaffected.\nFailure The creature is for [[/r 1d4 #rounds]]{1d4 rounds}.\nCritical Failure The creature is for [[/r 1d4 #rounds]]{1d4 rounds}. After the stunned condition ends, the creature is confused for the remaining duration of the spell.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'desiccate-pf2e',
    name: 'Desiccate',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You pull the moisture from the targets' bodies, dealing 10d10 void damage. Creatures made of water (such as water elementals) and plant creatures use the outcome for one degree of success worse than the result of their saving throw. Creatures whose bodies contain no significant moisture (such as earth elementals) are immune to desiccate.\nHeightened (+1) The damage increases by 1d10.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d10.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'divine-inspiration-pf2e',
    name: 'Divine Inspiration',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'divine',
    traditions: ['divine'],
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You infuse a target with spiritual energy, refreshing its magic. If it prepares spells, it recovers one 6th-rank or lower spell it previously cast today and can cast that spell again. If it spontaneously casts spells, it recovers one of its 6th-rank or lower spell slots. If it has a focus pool, it regains its Focus Points, as if it had Refocused.',
    classes: ['cleric'],
  },
  {
    id: 'dream-council-pf2e',
    name: 'Dream Council',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "When you Cast this Spell, any targets-including you-can choose to immediately fall asleep. The spell ends for any creatures that don't choose to fall asleep. Sleepers join a shared dream, where they can communicate with one another as though they were in the same room. Individual targets leave this shared dream upon awakening, and if all the targets awaken, the spell ends.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'hidden-mind-pf2e',
    name: 'Hidden Mind',
    system: 'pf2e',
    source: 'Pathfinder GM Core',
    level: 8,
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      'Powerful wards hide a creature from magic that would spy on it or affect its mind. The target gains a +4 status bonus to saves against mental effects. Hidden mind attempts to counteract any detection, revelation, and scrying effects as if its spell rank were 1 higher than its actual rank. On a success, the effect functions normally except that it detects nothing about the target and its possessions. For instance, detect magic would still detect other magic in the area, but not any magic on the target.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'migration-pf2e',
    name: 'Migration',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'minutes',
      amount: 10,
    },
    range: {
      type: 'ranged',
      feet: 20,
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
    ritual: false,
    description:
      "The targets naturally take on animal forms most fitting their movement and environment. Each target gains a land, burrow, climb, fly, and swim Speed of 40 feet, and can transform into a Tiny or Small animal most appropriate for a given movement and environment. It also gains immunity to mild, severe, and extreme cold and heat, along with any other immunities common to the local wildlife, at the GM's discretion. In exploration mode, a target can move much faster, at a travel Speed of 20 miles per hour.\nA target can't Strike, cast spells, or use most manipulate actions in animal form, but it can resume its normal shape by Sustaining the spell. It can Sustain the spell again to resume animal form.",
    classes: ['druid'],
  },
  {
    id: 'mimic-spell-pf2e',
    name: 'Mimic Spell',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'reaction',
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
      "Trigger A creature you're aware of within range Casts a Spell of the same tradition as mimic spell and of the same or lower rank.\nYou learn the secrets of a spell just by watching someone else cast it. Attempt to counteract the spell cast by the triggering creature. If the spell would be counteracted, you instead gain the ability to Cast that Spell without expending a slot.\nOn your next turn, you spend the same number of actions to Cast the Spell as the triggering creature, but you choose the targets (if any) and use your spell attack modifier or spell DC as appropriate. The spell is heightened to the same rank as mimic spell. The mimicked spell is of the same tradition as the spells you normally cast.\nIf you don't Cast the mimicked Spell by the end of your next turn, it is lost, unless you Sustain the knowledge of it. You can Sustain this knowledge for up to 1 minute, after which it is lost.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'moment-of-renewal-pf2e',
    name: 'Moment of Renewal',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'divine',
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "The targets experience a day's worth of recovery in an instant. Any detrimental effects that would be gone after 24 hours end, though this doesn't shorten the duration of any active spells affecting the targets. The targets regain Hit Points and recover from conditions as if they had taken 24 hours of rest, but they do not make their daily preparations again or gain any benefits of rest other than healing. The targets are then temporarily immune for 1 day.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'monstrosity-form-pf2e',
    name: 'Monstrosity Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
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
      "You transform into the shape of a legendary monster, assuming a Huge battle form. You must have enough space to expand into or the spell is lost. When you cast this spell, choose phoenix, cave worm, or sea serpent. While in this form, you gain the beast trait (for phoenix) or the animal trait (for cave worm or sea serpent). You can Dismiss the spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 20 + your level. Ignore your armor's check penalty and Speed reduction.\n• 20 temporary Hit Points.\n• Darkvision.\n• One or more unarmed melee attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +28, and you use the listed damage. These attacks are Strength based (for the purpose of the condition, for example). If your unarmed attack modifier is higher, you can use it instead.\n• Athletics modifier of +30, unless your own modifier is higher.\nYou also gain specific abilities based on the type of monster you choose:\n• Cave Worm\n• Speed 40 feet, burrow 30 feet, swim 20 feet;\n• Melee 1 jaws (reach 10 feet), Damage 2d12+20 piercing;\n• Melee 1 stinger (agile, reach 10 feet), Damage 2d8+15 piercing plus 2d6 persistent poison;\n• Melee 1 body (reach 10 feet) Damage 2d8+20 bludgeoning;\n• Inexorable You automatically recover from the , , and conditions at the end of each of your turns. You're also immune to being and ignore difficult terrain and greater difficult terrain.\n• Phoenix\n• Speed 30 feet, fly 90 feet;\n• Melee 1 beak (reach 15 feet), Damage 2d6+12 piercing plus 2d4 fire and 2d4 persistent fire;\n• Melee 1 talon (agile, reach 15 feet), Damage 2d8+12 slashing;\n• Shroud of Flame (aura, fire, primal) 20 feet. You gain an aura of fire that extends out from you. A creature that enters or ends its turn within the aura takes 2d6 fire damage. A creature can take this damage only once per turn. You can activate or deactivate this aura with a Sustain action.\n• Sea Serpent\n• Speed 20 feet, swim 90 feet;\n• Melee 1 jaws (reach 15 feet), Damage 2d12+20 piercing;\n• Melee 1 tail (reach 25 feet), Damage 2d8+20 bludgeoning;\n• Spine Rake 2 (move) You extend your spines and Swim or Stride. Each creature you're adjacent to at any point during your movement takes 4d8+10 slashing damage (basic Reflex against your spell DC).\nHeightened (9th) You instead gain AC = 22 + your level, 25 temporary HP, attack modifier +31, increase damage by one damage die, and Athletics +33.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'musical-shift-pf2e',
    name: 'Musical Shift',
    system: 'pf2e',
    source: 'Pathfinder #205: Singer, Stalker, Skinsaw Man',
    level: 8,
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
    concentration: true,
    ritual: false,
    description:
      "With a quick series of wrist flicks, music fills the air. While the music can be heard as if it were performed normally at a distance, creatures in the spell's area become affected in more significant ways. When you cast musical shift, select a key signature (to affect enemies) and a time signature (to affect allies) from the options below; all creatures within the area are affected as indicated. You can change the key signature or time signature as part of the action you take when you Sustain the spell.\nFlat (key signature) Whenever an enemy critically fails at a Strike, saving throw, or skill check, they fall in addition to other effects from the critical failure.\nNatural (key signature) Enemies take a –2 status penalty to attack rolls.\nSharp (key signature) Whenever an enemy takes piercing or slashing damage, they also take 2d6 persistent bleed damage.\nDouble (time signature) You and your allies become and can use the extra action each round only for , Stand, Step, or Stride actions.\nQuadruple (time signature) You and your allies gain a +2 status bonus to attack rolls.\nTriple (time signature) You and your allies gain a +2 status bonus to Armor Class and Reflex saving throws.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'part-the-mists-to-paradise-pf2e',
    name: 'Part the Mists to Paradise',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure a pathway to paradise, visible only to you and your allies through a dense cloud of magical mist. You and the other targets within range are transported through this mist to an extradimensional paradise of idyllic geographical features. Creatures within this paradise don't need to eat or drink. For each minute you spend within this paradise, all creatures within experience the benefits of 24 hours passing, gaining the healing benefits of a full night's rest, as well as the elapse of any afflictions or spells with day-long intervals. However, for any afflictions or spells with intervals measured in shorter periods of time, only one of those intervals passes for every minute spent within the paradise. This means that at the end of a minute, a creature can attempt a saving throw against a disease whose interval is 1 day, a poison whose interval is 1 minute, and a harmful spell that allows a saving throw each round. Each saving throw attempted while within the paradise gains a +4 status bonus.\nYou and your allies can act normally while within the paradise and can use the time to cast spells, Refocus, or perform other exploration activities that take less than 10 minutes. When the spell ends, you and all other targets depart the paradise, returning through the mists to your previous locations or in the nearest unoccupied spaces. You can Dismiss this spell.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'pinpoint-pf2e',
    name: 'Pinpoint',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      "You learn the name of the target's exact location (including the building, community, and country) and plane of existence. You can target a creature only if you've seen it in person, have one of its significant belongings, or have a piece of its body, such as a lock of hair. To target an object, you must have touched it or have a fragment of it. Pinpoint automatically overcomes protections against detection of lower rank than this spell, even if they would normally have a chance to block it.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'punishing-winds-pf2e',
    name: 'Punishing Winds',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'primal',
    traditions: ['primal'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "Area (continued) 30-foot-radius, 100-foot-tall cylinder\nViolent winds and a powerful downdraft fill the area, forming a cyclone. All flying creatures in the area descend 40 feet. The entire area is greater difficult terrain for Flying creatures, and difficult terrain for creatures on the ground or Climbing. Any creature that ends its turn Flying within the area descends 20 feet. Any creature pushed into a surface by this spell's winds takes bludgeoning damage as though it had fallen.\nThe squares at the outside vertical edges of the cylinder prevent creatures from leaving. These squares are greater difficult terrain, and a creature attempting to push through must succeed at an Athletics check or Acrobatics check to Maneuver in Flight against your spell DC to get through. A creature that fails ends its current action but can try again.",
    classes: ['druid'],
  },
  {
    id: 'quandary-pf2e',
    name: 'Quandary',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
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
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      "You transport the target into an extraplanar puzzle room of mysterious origin, locking them there. Once each turn as a single action, the target can attempt an Occultism check, Perception check, or Thievery check against your spell DC to solve the puzzle. Teleportation effects can't carry the target outside the puzzle room unless they can also traverse the planes, such as . When the spell ends, the target returns to the space it occupied when it was banished, or to the nearest space if the original is now filled.\nCritical Success The target solves the puzzle and escapes.\nSuccess The target is on the right path to the solution. If it was already on the right path, it solves the puzzle and escapes.\nFailure The target makes no progress toward a solution.\nCritical Failure The target makes no progress and, if it was on the right path, it no longer is.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'spirit-song-pf2e',
    name: 'Spirit Song',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 8,
    school: 'occult',
    traditions: ['occult', 'divine'],
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
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      "Your eldritch song sends pulsing waves of ethereal energy to attack creatures' spirits in the area, dealing 14d6 spirit damage that causes their bodies to momentarily freeze up from the hypnotic nature of the tune, depending on the result of their Fortitude save. The vibrating waves of spirit song penetrate into, but not through, solid barriers, damaging incorporeal creatures hiding in solid objects in the area but not passing onward to damage creatures in other rooms.\nCritical Success The creature takes no damage.\nSuccess The creature takes half damage and can't use reactions until the beginning of its turn.\nFailure The creature takes full damage, can't use reactions until the beginning of its turn, and is Stunned 1.\nCritical Failure The creature takes double damage, can't use reactions until the beginning of its turn, and is Stunned 2.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['bard', 'cleric'],
  },
  {
    id: 'spiritual-epidemic-pf2e',
    name: 'Spiritual Epidemic',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 8,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You curse the target, sapping its spirit and leaving a contagious trap in its essence. The target must attempt a Will save. Any creature that casts a divine or occult spell on the target while it's affected is targeted by spiritual epidemic and must also attempt a Will save. The curse continues to spread in this way.\nCritical Success The target is unaffected.\nSuccess The target is Enfeebled 2 and Stupefied 2 for 1 round.\nFailure The target is enfeebled 2 and stupefied 2 for 1 minute and Enfeebled 1 and Stupefied 1 permanently.\nCritical Failure The target is Enfeebled 3 and Stupefied 3 for 1 minute and enfeebled 2 and stupefied 2 permanently.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'summon-warden-of-the-wild-pf2e',
    name: 'Summon Warden of the Wild',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 8,
    school: 'primal',
    traditions: ['primal'],
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
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "You briefly call forth the spirit of one of the Wardens of the Wild, the legendary guardians of nature. The warden occupies the space of a Gargantuan creature. When you Cast this Spell, you summon a warden depending on the biome in which the spell is cast (for instance, summoning the Warden of Caverns and Burrows if summoned in a cave, canyon, or other underground environment). In an unnatural environment, the warden summoned depends on the region's most recent or similar natural biome, as decided by the GM.\n• : Speed 60 feet, burrow 100 feet; Arrive (earth) Obsidian Cage Obsidian stalagmites burst from the earth as the warden surfaces, impaling enemies and trapping them in stalagmites. Enemies on the ground within 40 feet take 6d6 piercing] damage (Reflex save). Creatures that fail their save become until they (the DC is your spell DC); Depart (earth) Blessing of the Depths The squares occupied by the warden remain disheveled and broken, becoming difficult terrain. The warden affects you and all your allies within 60 feet with a and . The duration for both spells is reduced to 3 rounds, but the duration of mountain resilience isn't reduced when an affected target is hit by a bludgeoning, piercing, or slashing attack.\n• : Speed 120 feet; Arrive (illusion, mental) Idyllic Panorama The warden's presence unpredictably warps the appearances and perceived distances of creatures and obstacles around it. Each time an enemy within 40 feet of the warden attempts a Strike or Stride action, it takes 4d6 mental] damage (Will save). On a critical failure, the creature Strikes a random target within reach or Strides in a random direction. On a critical success, the creature becomes temporarily immune for 1 round; Depart Fox's Insightful Trickery The warden affects you and all your allies within 60 feet with and . The duration for both spells is reduced to 3 rounds.\n• : Speed 60 feet, swim 120 feet; Arrive I Am the Tide If the warden is summoned in a body of water, it creates a churning whirlpool that deals 10d6 bludgeoning] damage to all creatures within 30 feet (basic Reflex save). A creature that fails this save is pulled 15 feet closer to the warden (30 feet on a critical failure). If the warden is summoned outside of a body of water, it creates a wave of water that deals 8d6 bludgeoning] damage to all creatures within 30 feet (basic Reflex save). A creature that fails this save is pushed 10 feet away from the warden; Depart Acclimation to the Deep The warden affects you and your allies within 60 feet with and . The duration for both spells is reduced to 3 rounds, but a creature affected by feet to fins retains its normal land Speed.\n• : Speed 60 feet, fly 240 feet; Arrive Precipice Plummet The warden appears, flying downward from the sky and sends a shockwave where she lands. Creatures within 20 feet take 10d6 sonic] damage (Fortitude save). Creatures that critically fail their saves are Sickened 1; Depart (auditory) Song of the Skies The warden affects you and all your allies within 60 feet with and . The duration for both spells is reduced to 3 rounds.",
    classes: ['druid'],
  },
  {
    id: 'take-your-places-pf2e',
    name: 'Take Your Places',
    system: 'pf2e',
    source: 'Pathfinder #205: Singer, Stalker, Skinsaw Man',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
    concentration: false,
    ritual: false,
    description:
      "The scene would play out exactly as you envisioned it, if only the actors would respect their blocking. You instantly transport the targeted creatures and any items they're wearing and holding from their current space to an unoccupied space within range. You don't need to be able to see the destinations as long as you've been there in the past and know its relative location and distance from each target. Creatures affected by take your places are then temporarily immune to this spell for 1 minute.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'uncontrollable-dance-pf2e',
    name: 'Uncontrollable Dance',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      "The target is overcome with an all-consuming urge to dance. For the duration of the spell, the target is and can't use reactions. While affected, the creature can't use move actions except to dance, using the Stride action to move up to half its Speed.\nCritical Success The target is unaffected.\nSuccess The spell's duration is 3 rounds, and the target must spend at least 1 action each turn dancing.\nFailure The spell's duration is 1 minute, and the target must spend at least 2 actions each turn dancing.\nCritical Failure The spell's duration is 1 minute, and the target must spend all its actions each turn dancing.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'unrelenting-observation-pf2e',
    name: 'Unrelenting Observation',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 8,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      "This spell grants perfect sight based on scrying, allowing several willing targets to track the exact movements or position of one creature or object. Choose one target creature or object in the area to be tracked. It becomes the sensor for the spell. Up to five willing creatures of your choice in the area can see a ghostly image of this creature or object when it's out of their sight. They can perceive the creature or object perfectly, allowing them to ignore the or condition, though physical barriers still provide cover.\nThe tracking creatures can see the tracked creature or object through all barriers other than lead or running water, which block their vision. Distance doesn't matter, though the creature or object might move so far away it becomes too small to perceive. The tracking creatures don't see any of the environment around the target, though they do see any gear a creature is wearing or holding, and they can tell if it removes objects from its person.\nIf the target to be tracked is willing, the duration is 1 hour. If you try to track an unwilling creature, the target must attempt a Will save.\nCritical Success The creature or object is unaffected.\nSuccess As described, and the duration is 1 minute.\nFailure As described, and the duration is 1 hour.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
]);
