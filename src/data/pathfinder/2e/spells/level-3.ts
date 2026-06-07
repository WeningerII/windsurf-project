import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level3Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'bind-undead-pf2e',
    name: 'Bind Undead',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
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
      material: true,
    },
    duration: {
      type: 'instant',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      'You attempt to take control of an undead creature. The target must attempt a Will save. On a failure, it becomes controlled by you for 1 minute.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'blindness-pf2e',
    name: 'Blindness',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
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
      type: 'varies',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You blind the target. The target must attempt a Fortitude save. On a critical success, the target is unaffected. On a success, the target is blinded until the end of its next turn. On a failure, the target is blinded for 1 minute. On a critical failure, the target is blinded permanently.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'earthbind-pf2e',
    name: 'Earthbind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      "You pull the target toward the ground. The target must attempt a Fortitude save. On a failure, flying creatures fall and all creatures can't Fly, levitate, or otherwise leave the ground.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'fireball-pf2e',
    name: 'Fireball',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
        count: 6,
        die: 'd6',
        notation: '6d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'A roaring blast of fire appears at a spot you designate, dealing 6d6 fire damage. Each creature in the area must attempt a basic Reflex save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'ghostly-weapon-pf2e',
    name: 'Ghostly Weapon',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
    concentration: false,
    ritual: false,
    description:
      'The target weapon becomes translucent and ghostly. It can affect incorporeal creatures as if it had the ghost touch property rune.',
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'haste-pf2e',
    name: 'Haste',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'Magic empowers the target to act faster. It gains the quickened condition and can use the extra action only to Stride or Strike.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): You can target up to 6 creatures.',
      ranks: { 7: 'You can target up to 6 creatures.' },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'heroism-pf2e',
    name: 'Heroism',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
    traditions: ['arcane', 'divine', 'occult'],
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You tap into the target's inner heroism, granting it a +1 status bonus to attack rolls, Perception checks, saving throws, and skill checks.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (6th): The status bonus increases to +2. Heightened (9th): The status bonus increases to +3.',
      ranks: {
        6: 'The status bonus increases to +2.',
        9: 'The status bonus increases to +3.',
      },
    },
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'hypnotic-pattern-pf2e',
    name: 'Hypnotic Pattern',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
      verbal: false,
      somatic: true,
      material: true,
    },
    duration: {
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: true,
    ritual: false,
    description:
      'You create a pattern of shifting colors in the air. Creatures in the area must attempt a Will save. On a failure, they become fascinated and can take no actions.',
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'lightning-bolt-pf2e',
    name: 'Lightning Bolt',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
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
    areaOfEffect: {
      type: 'line',
      length: 120,
      width: 5,
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex save',
    damage: {
      base: {
        count: 4,
        die: 'd12',
        notation: '4d12',
      },
      type: 'lightning',
    },
    concentration: false,
    ritual: false,
    description:
      'A bolt of lightning strikes outward from your hand, dealing 4d12 electricity damage. Each creature in the area must attempt a basic Reflex save.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 1d12.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'paralyze-pf2e',
    name: 'Paralyze',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      "You block the target's motor impulses. The target must attempt a Will save. On a failure, the target is paralyzed for the duration.",
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): You can target up to 10 creatures.',
      ranks: {
        7: 'You can target up to 10 creatures.',
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'slow-pf2e',
    name: 'Slow',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'transmutation',
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
      type: 'minutes',
      minutes: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      'You dilate the flow of time around the target, making it slowed 1. The target must attempt a Will save. On a critical failure, the target is slowed 2.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (6th): You can target up to 10 creatures.',
      ranks: { 6: 'You can target up to 10 creatures.' },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'stinking-cloud-pf2e',
    name: 'Stinking Cloud',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 1,
    },
    areaOfEffect: {
      type: 'sphere',
      radius: 20,
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      'You create a cloud of putrid mist. Each creature in the cloud when you cast the spell, or that enters the cloud, must attempt a Fortitude save. On a failure, the creature becomes sickened 1 (sickened 2 on a critical failure).',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'vampiric-touch-pf2e',
    name: 'Vampiric Touch',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'necromancy',
    traditions: ['arcane'],
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
    damage: {
      base: {
        count: 6,
        die: 'd6',
        notation: '6d6',
      },
      type: 'necrotic',
    },
    concentration: false,
    ritual: false,
    description:
      'Your touch leeches the lifeblood out of a target to empower yourself. You deal 6d6 negative damage to the touched creature and you gain temporary Hit Points equal to half the damage the target takes (after applying resistances, weaknesses, and the like).',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-wind-pf2e',
    name: 'Wall of Wind',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'evocation',
    traditions: ['arcane', 'primal'],
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
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude save',
    concentration: false,
    ritual: false,
    description:
      "You create a wall of gusting wind. The wall is 60 feet long, 20 feet high, and 5 feet thick. Ranged attacks can't pass through the wall, and creatures trying to move through must attempt a Fortitude save or be pushed back.",
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'mind-reading-pf2e',
    name: 'Mind Reading',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'divination',
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
      'You read the surface thoughts of a creature, learning its general state of mind and possibly a deeper read on a failed save.',
    classes: ['bard'],
  },
  {
    id: 'crisis-of-faith-pf2e',
    name: 'Crisis of Faith',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'enchantment',
    traditions: ['divine'],
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
      attribute: 'wis',
      success: 'half',
    },
    savingThrowText: 'basic Will',
    concentration: false,
    ritual: false,
    description:
      'You assault a creature with doubt, dealing 6d6 mental damage (or 6d8 to a divine caster), with a chance to stupefy it.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The damage increases by 2d6 (or 2d8 vs divine casters).',
    },
    classes: ['cleric'],
  },
  {
    id: 'wall-of-thorns-pf2e',
    name: 'Wall of Thorns',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 3,
    school: 'conjuration',
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You grow a thicket of thorny brush that is difficult terrain and deals piercing damage to creatures passing through it.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The Hit Points and damage of the wall increase.',
    },
    classes: ['druid'],
  },
  {
    id: 'animal-vision-pf2e',
    name: 'Animal Vision',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'minutes',
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
      type: 'hours',
      hours: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You tap into the target's senses, allowing you to sense whatever it senses for the spell's duration. If the target wishes to prevent you from doing so, it can attempt a Will save, negating the spell on a success, but most animals don't bother to do so. While tapping into the target's senses, you can't use your own body's senses, but you can change back and forth from your body's senses to the target's senses using a Sustain action.",
    classes: ['druid'],
  },
  {
    id: 'annunciation-of-the-outer-gate-pf2e',
    name: 'Annunciation of the Outer Gate',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 3,
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
      somatic: false,
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You announce yourself in the name of certain grim pacts that predate mortal life. This is not a compulsion, but rather an invitation of sorts. The invitation is understood by creatures in the area with telepathy and any who understand Aklo, Chthonian, Empyrean, Fey, or Utopian.\nThose who accept the invitation cannot take hostile action against others who agreed until 10 minutes pass and can communicate telepathically with them during that time. This effect ends immediately if any hostile action is taken against a creature that agreed.\nThose creatures who decline the choice or do not understand it must attempt a Will save.\nCritical Success Nothing happens.\nSuccess The creature is Frightened 1. If it understood the invitation, its frightened status doesn't decrease at the end of any turn in which it damaged a creature that agreed to the invitation.\nFailure As success, but the creature is Frightened 2.\nCritical Failure As success, but the creature is Frightened 3.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'anointed-ground-pf2e',
    name: 'Anointed Ground',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'divine',
    traditions: ['divine'],
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
      material: true,
    },
    duration: {
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      'You sanctify the area, sprinkling it with certain oils and warding it against your foes. Choose aberrations, celestials, dragons, fiends, monitors, or undead. All creatures in the area gain a +1 status bonus to AC, attack rolls, damage rolls, and saving throws against the chosen creatures.',
    classes: ['cleric'],
  },
  {
    id: 'antlion-trap-pf2e',
    name: 'Antlion Trap',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 3,
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
      "You transmute the ground into a conical pit trap of loose sand that becomes difficult terrain for the duration. A creature or unsecured object that enters the sand or starts its turn in the sand is moved toward the center, depending on the result of its Reflex save. This is forced movement. If there isn't enough space near the center of the pit, affected creatures and objects move as far as they can without being blocked, up to the amount set by their saving throw outcomes.\nCritical Success The creature is unaffected.\nSuccess The creature moves 5 feet toward the center.\nFailure The creature moves 10 feet toward the center.\nCritical Failure As failure, and the creature becomes in the pit. It can attempt to against your spell DC.\nHeightened (+2) Increase the area of the spell and the amount a creature moves on a failure by 5 feet.",
    classes: ['druid'],
  },
  {
    id: 'aqueous-orb-pf2e',
    name: 'Aqueous Orb',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      "A sphere of water 10 feet in diameter forms in an unoccupied space in range, either on the ground or on the surface of a liquid.\nWhen you Cast this Spell and each time you Sustain it, you can roll the orb, moving it up to 10 feet along the ground or the surface of a liquid.\nThe orb can move through the spaces of any creatures or obstacles that wouldn't stop the flow of water. It extinguishes non-magical fires it moves through of its size or smaller, and it attempts to counteract any magical fires it moves through. If it fails to counteract a given fire, it can't counteract that fire for the duration of the spell.\nThe orb can engulf Large or smaller creatures it moves through, and it can contain as many creatures as fit in its space. The orb can try to engulf the same creature only once per turn, even if you roll it onto a creature's space more than once. Any Large or smaller creature whose space the orb tries to move through can attempt a Reflex save.\nSuccess The creature can either let the orb pass (remaining in its space or moving out of the orb's path into a space of the creature's choice) or allow itself to be pushed in front of the orb to the end of the orb's movement.\nFailure The creature is engulfed in the orb. It moves along with the orb and must hold its breath or begin suffocating (unless it can breathe in water). An engulfed Medium or smaller creature and anyone trying to affect that creature follow the normal rules for aquatic battles. An engulfed Large creature is usually big enough that parts of it stick out from the water, and it can reach out of the water. The creature can get free either by Swimming with a successful Athletics check or by Escaping against your spell DC. A freed creature exits the orb's space and can immediately breathe.\nCritical Failure As failure, but the creature can't Swim to get free.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'bone-flense-pf2e',
    name: 'Bone Flense',
    system: 'pf2e',
    source: 'Pathfinder Adventure: Prey for Death',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
    concentration: false,
    ritual: false,
    description:
      "The target weapon becomes imbued with Achaekek's power and glows softly with crimson light akin to that shed by a candle. When a creature with a skeleton or exoskeleton takes damage from a Strike delivered by this weapon, the creature's bones nearest to the wound instantly sprout jagged, razor-sharp spurs that flense the muscle and flesh from inside out. The creature takes an additional 1d6 persistent bleed damage from the Strike. You can use the reaction.\nHeightened (+2) The persistent bleed damage increases by 1d6. The damage from Erupting Spurs increases by 4d6.",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'burglars-blind-pf2e',
    name: "Burglar's Blind",
    system: 'pf2e',
    source: 'Pathfinder NPC Core',
    level: 3,
    school: 'occult',
    traditions: ['occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'concentration',
      maxDuration: 'sustained, 10 minutes',
    },
    concentration: true,
    ritual: false,
    description:
      "The only thing thieves love more than being silent and stealthy is the piles of gold they win with that silence and stealth. You mask the target with multiple illusions combined in a perfect mix, affecting them with both the and spells. If the target takes a hostile action, burglar's blind and both the spells it grants end after the hostile action is completed.\nHeightened (5th) You can target up to 5 willing creatures. The spells end for all targets if any one of them takes a hostile action.",
    classes: ['bard'],
  },
  {
    id: 'chilling-darkness-pf2e',
    name: 'Chilling Darkness',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'divine',
    traditions: ['divine'],
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You shoot an utterly cold ray of darkness tinged with unholy energy. Make a ranged spell attack. The ray deals 5d6 cold damage. If the target has the holy trait, you deal an extra 5d6 spirit damage.\nCritical Success The target takes double damage.\nSuccess The target takes full damage.\nIf the ray passes through an area of magical light or targets a creature affected by magical light, chilling darkness attempts to counteract the light. If you need to determine whether the ray passes through an area of light, draw a line between yourself and the spell's target.\nHeightened (+1) The cold damage increases by 2d6, and the spirit damage against holy creatures increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The cold damage increases by 2d6, and the spirit damage against holy creatures increases by 2d6.',
    },
    classes: ['cleric'],
  },
  {
    id: 'clairaudience-pf2e',
    name: 'Clairaudience',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You create an floating ear at a location within range (even if it's outside your line of sight or line of effect). It can't move, but you can hear through the ear as if using your normal auditory senses.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'conjured-conveyance-pf2e',
    name: 'Conjured Conveyance',
    system: 'pf2e',
    source: 'Pathfinder #203: Shepherd of Decay',
    level: 3,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure an intricate vehicle, carved entirely from wood, to serve as a method of conveyance. The vehicle appears in an unoccupied area of your choice within range. The vehicle can be piloted using Arcana, Driving Lore, or Nature skill checks. The DC to pilot the vehicle and the DC of the vehicle's collision are equal to your spell DC. The vehicle's remaining statistics are presented below.\nWhen you Cast this Spell, choose whether to create a Large skiff, a Large wagon, or a Medium cycle. With the GM's permission, you might instead summon a different vehicle of your choice with a maximum level of 1; this vehicle must be made primarily of plant matter, have common rarity, and be Large or smaller.\n• Large Skiff—Space 15 feet long, 5 feet wide, 3 feet high; Crew 1 pilot; Passengers 3; Speed swim 30 feet (magical)\n• Large Wagon—Space 10 feet long, 10 feet wide, 7 feet high; Crew 1 pilot; Passengers 3; Speed 35 feet (magical)\n• Medium Cycle—Space 5 feet long, 3 feet wide, 3 feet high; Crew 1 pilot; Passengers 0; Speed 40 feet (magical)\nAC 13; Fortitude +8\nHardness 5, HP 40 (BT 20); Immunities critical hits, object immunities, precision damage; Weaknesses fire 5, slashing 5\nCollision 2d6\nHeightened (+1) The vehicle's AC increases by 2, Fortitude bonus increases by 2, Hardness increases by 1, HP increases by 20, and the collision damage increases by [[/r 1d6]]. In addition, the maximum level of vehicle you can summon with GM permission increases by 2. The duration increases by 1 hour.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'cordyceps-command-pf2e',
    name: 'Cordyceps Command',
    system: 'pf2e',
    source: 'Pathfinder #203: Shepherd of Decay',
    level: 3,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'special',
      description: '30',
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
      "You conjure a mote of cordyceps spores uniquely tailored to the target before whisking it at them. When you Cast this Spell, choose one of the following behaviors that the fungus compels: ascend, consume, descend, or lure. While the target is controlled by the cordyceps toxin's stage 3 effects, it performs that behavior. This control might include risky behavior (such as climbing down a precarious cliff or weaving between armed foes), but it doesn't compel outright lethal actions (such as leaping off the top of that same cliff). If the behavior directly leads to harm (such as falling off the cliff) or hostile actions (such as being attacked by creatures that can now reach the descending creature), the target gains a +4 bonus to their next saving throw against the poison.\nAscend: The creature tries to reach higher altitudes by any reasonable means, such as Climbing, seeking stairs, or even stacking debris to jump atop of in an attempt to be as high up as possible.\nConsume: The creature greedily eats or drinks whatever is nearby, using actions to draw and consume elixirs, food, or other consumable items. If the creature has a jaws Strike, fangs Strike, or similar unarmed Strike, the creature can instead chase after and use that Strike against edible targets. If no other food or drink is accessible, the creature attempts to steal or seek nearby nutrition.\nDescend: The creature tries to reach lower altitudes by any reasonable means, such as Climbing, descending while flying, or even falling and attempting to burrow into the ground.\nLure: The creature moves toward an exposed location and attempts to get bystanders' attention, such as by gesticulating, Performing, or igniting light sources. The target is while controlled in this way.\nSuccess The target is unaffected.\nFailure The target is afflicted with cordyceps toxin at stage 1.\nCritical Failure The target is afflicted with cordyceps toxin at stage 2.\nCordyceps Toxin (poison)\nSaving Throw Fortitude;\nMaximum Duration 6 rounds\nStage 1 Stupefied 1 (1 round)\nStage 2 (1 round)\nStage 3 (1 round)",
    classes: ['druid'],
  },
  {
    id: 'cozy-cabin-pf2e',
    name: 'Cozy Cabin',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      type: 'hours',
      hours: 12,
    },
    concentration: false,
    ritual: false,
    description:
      "You shape a cabin 20 feet on each side and 10 feet high. This cabin has the structure trait and the same restrictions as magic items that create structures. The walls of the hut are simple and wooden, with small, square glass windows, and it has one wooden door. It doesn't include its own lock, but it has a fastener to which a lock can be applied.\nThe interior contains three cots, one chamber pot, and a small fireplace holding a magical fire. The interior is lit with a small magical light that you can light or extinguish at will using a Sustain action. The climate inside the hut is comfortable and allows creatures inside it to withstand most hostile weather conditions, but incredible heat or cold, powerful storms, and winds of hurricane force or greater destroy the hut. Other creatures can freely enter and exit the hut without damaging it, but if you exit the hut, the spell ends. You can Dismiss the spell.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'crashing-wave-pf2e',
    name: 'Crashing Wave',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
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
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      'You summon a crashing wave that sweeps away from you. You deal 6d6 bludgeoning damage to creatures in the area. The water also extinguishes non-magical fires in the area.\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'croak-voice-pf2e',
    name: 'Croak Voice',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You cause the target creature's vocal chords to swell like those of a frog. The target must attempt a Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target's voice becomes hoarse, and speaking becomes painful. Whenever it uses an action that has the auditory trait or attempts to Cast a Spell that doesn't have the subtle trait, it must succeed at a Flat or the action is lost. Once per round, the target can spend an Interact action to massage its throat, attempting a Fortitude save against your spell DC. On a success, the spell ends.\nFailure As success, but using an action with the auditory trait also deals 2d10 mental damage to the target as the sound of its distorted voice grates on its ears.\nCritical Failure As failure, but the damage for using an action with the auditory trait is doubled, and the target can't use an Interact action to attempt a Fortitude save to end the effect early.\nHeightened (+1) The damage for using an action with the auditory trait increases by 1d10.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The damage for using an action with the auditory trait increases by 1d10.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'cup-of-dust-pf2e',
    name: 'Cup of Dust',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      type: 'special',
      description: '1 day',
    },
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You curse the target with a thirst no drink can quench. You can Dismiss the spell. The target must attempt a Fortitude save.\nCritical Success The creature is unaffected and is temporarily immune for 1 hour.\nSuccess The creature is for 1 round.\nFailure The creature is immediately afflicted by thirst as if it hadn't had a drink in days. It becomes Fatigued and takes 1d4 damage each hour that can't be healed until it quenches its thirst. No amount of drinking can quench the creature's thirst during the spell's duration.\nCritical Failure As failure but the creature takes 2d4 damage each hour.\nHeightened (+3) The thirst becomes more unbearable, increasing the damage each hour by 1d4, or by 2d4 on a critical failure.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'curse-of-lost-time-pf2e',
    name: 'Curse of Lost Time',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You curse the target with rapid aging or erosion. The effect depends on whether the target is an object, a construct, or a living creature. Artifacts, along with objects and constructs made of precious materials (as determined by the GM), are immune.\n• Object If the object is attended, its bearer can attempt a Fortitude save. If the bearer fails or the object is unattended, the object immediately takes 4d6 damage (applying Hardness normally) and the item is cursed with an unlimited duration. Until the curse ends, the item becomes shoddy and can't be Repaired, and the curse attempts to counteract any spell that would restore the object's Hit Points. can target an item affected by this spell.\n• Construct The construct takes 4d6 damage (basic Fortitude save). On a failure, for 1 hour the construct is Clumsy 1, is Enfeebled 1, and can't be Repaired, and the curse attempts to counteract any spell that would restore the construct's Hit Points. On a critical failure, these effects have an unlimited duration.\n• Living Creature The living creature must attempt a Fortitude save. Ageless creatures are immune.\n• Critical Success The living creature is unaffected.\n• Success The living creature briefly ages, becoming clumsy 1 and enfeebled 1 for 1 round.\n• Failure As success, with a duration of 1 hour.\n• Critical Failure As success, with an unlimited duration.\nHeightened (+1) The damage increases by 1d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'disruptive-transfer-pf2e',
    name: 'Disruptive Transfer',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'special',
      description: 'your Speed',
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
      "Using Venorium Blorm's formulas, you calculate a path through space. Teleport to an empty square you can see within range. Creatures adjacent to your initial location witness an array of overlapping destinations. Each of them must succeed at a Will save or become for 1 minute.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'dream-message-pf2e',
    name: 'Dream Message',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You send a message to your target's dream. The message is one-way, up to 1 minute of speech (roughly 150 words). If the target is asleep, they receive the message instantly. If not, they receive it the next time they sleep. As soon as they receive it, the spell ends, and you know the message was sent.\nHeightened (4th) You can target up to 10 creatures you know by name and have met in person. You must send the same message to all of them; the spell ends for each creature individually",
    heightening: {
      mode: 'fixed',
      ranks: {
        '4': 'Heightened (4th) You can target up to 10 creatures you know by name and have met in person. You must send the same message to all of them; the spell ends for each creature individually',
      },
      summary:
        'Heightened (4th) You can target up to 10 creatures you know by name and have met in person. You must send the same message to all of them; the spell ends for each creature individually',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'enthrall-pf2e',
    name: 'Enthrall',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      "Your words fascinate your targets. You speak or sing without interruption throughout the casting and duration. Targets who notice your speech or song might give their undivided attention; each target must attempt a Will save. The GM might grant a circumstance bonus (to a maximum of +4) if the target is of an opposing religion, ancestry, or political leaning, or is otherwise unlikely to agree with what you're saying.\nEach creature that comes within range has to attempt a save when you Sustain the spell. If you're speaking, enthrall gains the linguistic trait.\nCritical Success The target is unaffected and notices that you tried to use magic.\nSuccess The target needn't pay attention but doesn't notice you tried to use magic (it might notice others are enthralled).\nFailure The target is with you. It can attempt another Will save if it witnesses actions or speech with which it disagrees. If it succeeds, it's no longer fascinated and is temporarily immune for 1 hour. If the target is subject to a hostile act, or if another creature succeeds at a Diplomacy or Intimidation check against it, the fascination ends immediately.\nCritical Failure As failure, but the target can't attempt a save to end the fascination if it disagrees with you.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'familiars-face-pf2e',
    name: "Familiar's Face",
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 5280,
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
      "The target becomes a scrying sensor, allowing you to see through its eyes, smell what it smells, and similarly use its other senses. If you Cast a Spell with the revelation trait that affects your senses, such as , while this spell is active, you gain the benefit of the spell through the target's senses instead of your own. You can also speak through the target with a voice much like yours, though it takes on some of the timbre and character of the target's growls or squawks. You can use Command an Animal on the target as part of Sustaining this spell. You don't need line of sight or line of effect to your target when you Cast this Spell.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'feet-to-fins-pf2e',
    name: 'Feet to Fins',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'arcane',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "The target's feet transform into fins, improving mobility in the water but reducing it on land. The target gains a swim Speed equal to its normal land Speed, but its land Speed becomes 5 feet.\nHeightened (6th) The spell lasts until your next daily preparations.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'gravity-well-pf2e',
    name: 'Gravity Well',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
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
      attribute: 'dex',
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "You create a sphere of altered gravity. All creatures and unsecured objects in the area move towards the center, depending on their Reflex saving throws. This follows the rules for forced movement. If there's not enough space near the center of the sphere, creatures and objects nearer to the center move first, and others move as far as they can without being blocked, up to the amount set by their saving throw outcomes.\nCritical Success The creature is unaffected.\nSuccess The creature moves 5 feet toward the center.\nFailure The creature moves 15 feet toward the center.\nCritical Failure The creature moves 30 feet toward the center.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'holy-light-pf2e',
    name: 'Holy Light',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You shine a blazing ray of light tinged with holy energy. Make a ranged spell attack. The ray deals 5d6 fire damage. If the target has the unholy trait, you deal an extra 5d6 spirit damage.\nCritical Success The target takes double damage.\nSuccess The target takes full damage.\nIf the light passes through an area of magical darkness or targets a creature affected by magical darkness, holy light attempts to counteract the darkness. If you need to determine whether the light passes through an area of darkness, draw a line between yourself and the spell's target.\nHeightened (+1) The fire damage increases by 2d6, and the spirit damage against unholy creatures increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The fire damage increases by 2d6, and the spirit damage against unholy creatures increases by 2d6.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'hypercognition-pf2e',
    name: 'Hypercognition',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'occult',
    traditions: ['occult'],
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
      "You rapidly catalog and collate information relevant to your current situation. You can instantly use up to 6 Recall Knowledge actions as part of Casting this Spell. For these actions, you can't use any special abilities, reactions, or free actions that trigger when you Recall Knowledge.",
    classes: ['bard'],
  },
  {
    id: 'hypnotize-pf2e',
    name: 'Hypnotize',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      "You create a cloud of mesmerizing patterns and colors that hovers in the air. Creatures are while inside the cloud. In addition, a creature must attempt a Will saving throw if it is inside the cloud when you cast it, when it enters the cloud, when it ends its turn within the cloud, or if it uses a or Interact action on the cloud. A creature currently by hypnotize doesn't attempt new saves.\nSuccess The target is unaffected.\nFailure The target is fascinated by the cloud.\nCritical Failure The target is fascinated by the cloud. While it remains fascinated, it can't use reactions.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'ibexs-harvest-pf2e',
    name: "Ibex's Harvest",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'special',
      description: 'varies',
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
      "In the tale \"Ibex's Harvest,\" Ibex turns from the path of a warrior to the path of a farmer, building up their community by working hard and sharing a bountiful harvest not just with their humanoid neighbors but also with their animal neighbors. Ibex initially focuses on distributing equally among the animals but learns that true equality requires knowing what each being needs. The number of actions you spend when Casting this Spell and telling the story determine its targets and effects.\n1 You give a brief description of Ibex's first bounty. One willing target you can touch gains 10 temporary Hit Points that last 1 minute.\n2 You tell the tale of how Ibex shared their harvest equally between Hippo and Ant. Two willing targets within 20 feet each gain 10 temporary Hit Points that last 1 minute.\n3 You impart Ibex's lesson about how to prevent others from taking advantage of generosity. All creatures within a 10-foot emanation are affected by the tale. Choose one creature in the emanation to take 2d8 mental (basic Will save), while each other creature in the emanation gains 5 temporary Hit Points that last 1 minute.\nHeightened (+1) The temporary Hit Points increase by 3 and the mental damage for the 3-action version increases by 1d8.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The temporary Hit Points increase by 3 and the mental damage for the 3-action version increases by 1d8.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'insect-form-pf2e',
    name: 'Insect Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
    concentration: false,
    ritual: false,
    description:
      "You envision a simple bug and transform into a Medium animal battle form. When you Cast this Spell, choose a listed battle form. You can decide the specific type of animal (such as a ladybug or scarab for beetle), but this has no effect on the form's Size or statistics. While in this form, you gain the animal trait. You can Dismiss this spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 18 + your level. Ignore your armor's check penalty and Speed reduction.\n• 10 temporary Hit Points.\n• Low-light vision.\n• One or more attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +13, and your damage bonus is +2. These attacks are Strength based (for the purpose of the condition). If your unarmed attack modifier is higher, you can use it instead.\n• Athletics modifier of +13, unless your own is higher.\nYou also gain specific abilities based on the form you choose:\n• Ant\n• Speed 30 feet, climb Speed 30 feet;\n• Melee 1 mandibles, Damage 2d6 bludgeoning.\n• Beetle\n• Speed 25 feet;\n• Melee 1 mandibles, Damage 2d10 bludgeoning.\n• Centipede\n• Speed 25 feet, climb Speed 25 feet; darkvision;\n• Melee 1 mandibles, Damage 1d8 piercing plus 1d4 persistent poison.\n• Mantis\n• Speed 40 feet; imprecise scent 30 feet;\n• Melee 1 foreleg, Damage 2d8 bludgeoning.\n• Scorpion\n• Speed 40 feet; darkvision, imprecise tremorsense 60 feet;\n• Melee 1 stinger, Damage 1d8 piercing plus 1d4 persistent poison;\n• Melee 1 pincer (agile), Damage 1d6 bludgeoning.\n• Spider\n• Speed 25 feet, climb Speed 25 feet; darkvision;\n• Melee 1 fangs, Damage 1d6 piercing plus 1d4 persistent poison;\n• Ranged 1 web (range increment 20 feet), Damage immobilizes the target for 1 round or until it Escapes..\nHeightened (4th) Your battle form is Large, and your attacks have 10-foot reach. You instead gain 15 temporary HP, attack modifier +16, damage bonus +6, and Athletics +16.\nHeightened (5th) Your battle form is Huge, and your attacks have 15-foot reach. You instead gain 20 temporary HP, attack modifier +18, damage bonus +2 and double damage dice (including persistent damage), and Athletics +20.",
    classes: ['druid'],
  },
  {
    id: 'levitate-pf2e',
    name: 'Levitate',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      type: 'minutes',
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'You defy gravity and levitate the target 5 feet off the ground. You can Sustain the spell to move the target up or down 10 feet. A creature floating in the air from levitate takes a –2 circumstance penalty to attack rolls. A floating creature can spend an Interact action to stabilize itself and negate this penalty for the remainder of its turn. If the target is adjacent to a fixed object or terrain of suitable stability, it can move across the surface by climbing (if the surface is vertical, like a wall) or crawling (if the surface is horizontal, such as a ceiling). The GM determines which surfaces can be climbed or crawled across.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'locate-pf2e',
    name: 'Locate',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      type: 'concentration',
      maxDuration: 'sustained',
    },
    concentration: true,
    ritual: false,
    description:
      'You learn the direction to the target (if you picked a specific object, such as "my mother\'s sword") or the nearest target (if you picked a type of object, such as "swords"). If the target is a specific object, you must have observed it directly with your own senses. If it\'s a type of object, you still need to have an accurate mental image of the type of object. If there\'s lead or running water between you and the target, this spell can\'t locate the object. This means you might find a type of object farther away if the nearest one is behind lead or running water.\nHeightened (5th) You can target a specific creature or ancestry instead of an object, but you must have met or seen up close the creature or ancestry you want to target.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '5': 'Heightened (5th) You can target a specific creature or ancestry instead of an object, but you must have met or seen up close the creature or ancestry you want to target.',
      },
      summary:
        'Heightened (5th) You can target a specific creature or ancestry instead of an object, but you must have met or seen up close the creature or ancestry you want to target.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'mad-monkeys-pf2e',
    name: 'Mad Monkeys',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      "Magical monkey spirits fill the area as they pile and climb on top of one another. Because the monkeys are magical spirits, they can't be attacked or hurt. Casting or a similar effect over the monkeys makes them docile, causing them to cease making mischief for the duration of mad monkeys.\nChoose the kind of mischief your monkeys make when you Cast the Spell. They produce the effect listed for that mischief when you Cast the Spell and the first time each round when you Sustain the Spell. The first time each round when you Sustain the Spell, you can move the area of the monkeys by 5 feet.\nFlagrant Burglary The monkeys try to any one item from one creature in the area. Use your spell DC - 10 as the monkeys' Thievery modifier. Their attempt relies more on distraction than subtlety, so the victim knows what item the monkeys were trying to take and whether it was taken. Getting a stolen item from the monkeys-even for the caster-requires Stealing it from them or Disarming them, using your spell DC. When the spell ends, any stolen items fall to the ground in any square of the spell's area you choose.\nRaucous Din The monkeys screech loudly, potentially deafening creatures in the spell's area. Each creature in the spell's area must attempt a Fortitude save.\nCritical Success The creature is unaffected and is temporarily immune for 10 minutes.\nSuccess The creature is unaffected.\nFailure The creature is for 1 round.\nCritical Failure The creature is Deafened for 1 minute.\nTumultuous Gymnastics The monkeys jump and climb all over creatures in the spell's area, interfering with complex movements. Each creature in the spell's area must attempt a Reflex save.\nCritical Success The creature is unaffected and is temporarily immune for 10 minutes.\nSuccess The creature is unaffected.\nFailure For 1 round, the creature must succeed at a Flat whenever it attempts a manipulate action. If it fails this check, the creature loses that action.\nCritical Failure As failure, but the monkeys cling to the creature tenaciously, and the effect lasts until the spell ends, even if the creature leaves the spell's area.",
    classes: ['druid'],
  },
  {
    id: 'moonlight-ray-pf2e',
    name: 'Moonlight Ray',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 3,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
    attackRoll: true,
    concentration: false,
    ritual: false,
    description:
      "You unleash a holy beam of freezing moonlight. Make a ranged spell attack. The ray deals 5d6 cold damage; if the target has the unholy trait, you deal an extra 5d6 spirit damage.\nMoonlight ray's cold damage is silver damage for the purposes of weaknesses, resistances, and the like.\nCritical Success The target takes double cold damage, as well as double spirit damage if a fiend or undead.\nSuccess The target takes full damage.\nIf the light passes through an area of magical darkness or targets a creature affected by magical darkness, moonlight ray attempts to counteract the darkness. If you need to determine whether the light passes through an area of darkness, draw a line between yourself and the spell's target.\nHeightened (+1) The cold damage increases by 2d6, and the spirit damage against fiends and undead increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The cold damage increases by 2d6, and the spirit damage against fiends and undead increases by 2d6.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'one-with-stone-pf2e',
    name: 'One with Stone',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You can either transform into a stone or merge with stone. While transformed, you can't move or affect anything outside the stone, but you can cast spells as long as they don't require line of effect beyond the stone. You can Dismiss this spell.\n• Merge with Stone The spell's duration is 10 minutes. While casting the spell, you must touch a stone with enough volume to fit you and your possessions or the spell is disrupted. While merged, you can hear, but not see, what's going on outside the stone. If the stone takes damage while you're inside it, you're expelled from the stone and take 10d6 damage. Magic passage expels you without dealing damage. The spell ends if you're ever outside the stone.\n• Turn into a Stone The spell's duration is 8 hours. You become a Large stone. Perception checks don't reveal your true nature, but a successful Nature or Survival check against your spell DC reveals that you appear to be a stone that is strangely new to the area. While in this form, you can observe everything around you, using your normal senses. As a stone, your AC is 23, and only status bonuses, status penalties, circumstance bonuses, and circumstance penalties affect you. Any successes and critical successes you roll on Reflex saves are failures",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'overwhelming-memory-pf2e',
    name: 'Overwhelming Memory',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 3,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: true,
    ritual: false,
    description:
      "You cause the target to recall a specific type of memory you choose from the list below, bringing it to the forefront of their mind with perfect clarity.\n• Gleeful The memory makes the target laugh uncontrollably. They can't use reactions.\n• Romantic The creature is consumed with their love for another. They are by the memory.\n• Terrifying The creature is filled with terror and is Frightened 1.\n• Tragic The creature is overwhelmed with sorrow. They are from the tears in their eyes.\nThe target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess The target is affected by the memory until the beginning of your next turn.\nFailure The target is affected by the memory until the beginning of your next turn and Stupefied 2 for the spell's duration.\nCritical Failure As failure, but the target is Stupefied 3 for the spell's duration.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'perceive-the-threads-of-fate-pf2e',
    name: 'Perceive the Threads of Fate',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      'You open your mind to the grand design of existence, enabling you to view the threads of fate in all their complex, tangled glory. You attempt Perception checks and Reflex saving throws at mythic proficiency for the duration.\nYou can Sustain the spell once per round to untangle these threads. When you do, if your next action requires you to attempt an attack roll or skill check, you roll this check twice and use the higher result. You can untangle the threads of fate up to three times. After the third time, the spell ends.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'primal-chorus-pf2e',
    name: 'Primal Chorus',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 3,
    school: 'primal',
    traditions: ['primal'],
    castingTime: {
      type: 'action',
      amount: 3,
    },
    range: {
      type: 'ranged',
      feet: 5280,
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
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You let loose a primal howl that incites animals and beasts to join in the chorus. Doing so gives you a general idea of how many creatures with the animal or beast trait are within the range of the spell, but significant creatures can attempt a Will save against your spell DC to resist responding to your call. You gain a +1 status bonus to your next Initiative roll in an encounter with an enemy creature that replies to your call. For purposes of using during exploration mode, you can communicate with a creature that responds to your call for the duration of the spell. You can only make simple commands, such as approach or hide, and only understand simple ideas, such as compliance with the order or the presence of natural hazards.\nHeightened (+2) The status bonus increases by 1.',
    classes: ['druid'],
  },
  {
    id: 'ring-of-truth-pf2e',
    name: 'Ring of Truth',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You designate an area in which lies are revealed. Creatures in the area also take a –2 status penalty to Deception checks. Each time a creature in the area speaks a true statement, the soft ring of a bell sounds in the area. Creatures are aware of the magic; therefore, they can avoid answering questions to which they would normally respond with a lie, or they can be evasive as long as they remain within the boundaries of the truth. If a creature is in the area when the spell is cast or later enters the area, that creature attempts a Will save. It uses the results of this initial save if it leaves and reenters the area.\nCritical Success The target is so convincing that the bell rings even if they lie.\nSuccess If the target lies and succeeds at their Deception check against all targets, the bell still rings.\nFailure The bell accurately sees through their deception and will never ring if they lie.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'rouse-skeletons-pf2e',
    name: 'Rouse Skeletons',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: true,
    ritual: false,
    description:
      'Misshapen skeletal forms erupt from a solid surface, such as a stone floor, and fill the burst. The area they fill is difficult terrain. Their grasping claws deal 2d6 slashing damage to creatures on the ground in the area when the skeletons first appear with a basic Reflex save.\nOn subsequent rounds, the first time you Sustain the Spell each round, you can move the area of skeletons up to 20 feet within the range of the spell and deal 2d6 slashing damage with a basic Reflex save to each creature in the new area.\nDamaging or destroying the skeletons is irrelevant, as new bones pull forth from the ground to repair and replace any that are obliterated.\nHeightened (+2) The damage increases by 1d6.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2) The damage increases by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'safe-passage-pf2e',
    name: 'Safe Passage',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'primal'],
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
      type: 'concentration',
      maxDuration: 'sustained, 1 minute',
    },
    concentration: true,
    ritual: false,
    description:
      "Area 10-foot-wide, 10-foot-tall, 60-foot-long section of terrain\nYou make passage through the area safe for a brief amount of time. Anyone passing through the area gains the following benefits against harmful effects of the terrain and environment, including environmental damage, hazardous terrain, and hazards in the area. The spell grants a +2 status bonus to AC and saves against such effects, and resistance 5 to all damage from such effects. Furthermore, the spell prevents anything in the area that's prone to collapse, such as a rickety bridge or an unstable ceiling, from collapsing, except under extreme strain that would collapse a normal structure of its type.\nSafe passage protects only against harm, not inconvenience, and it doesn't reduce difficult terrain, remove the condition caused by precipitation, or the like, nor does it protect against creatures within the spell's area.\nHeightened (5th) The granted resistance increases to 10, and the area can be 120 feet long.\nHeightened (8th) The granted resistance increases to 15, and the area can be 500 feet long.",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'shared-invisibility-pf2e',
    name: 'Shared Invisibility',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
    castingTime: {
      type: 'action',
      amount: 2,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You and all targets are except to each other as long as the targets remain within the emanation. If a creature made invisible by this spell leaves the spell's area, it becomes visible and remains so even if it returns to the spell's area. If any creature made invisible by this spell uses a hostile action, the spell ends after the hostile action is completed.\nHeightened (5th) The targets increase to you and up to 10 willing creatures. The duration increases to 1 hour.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'shifting-sand-pf2e',
    name: 'Shifting Sand',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 3,
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
      "Area (continued) a horizontal earthen or sandy surface within a 20-foot burst\nYou cause the surface to heave. The area becomes difficult terrain, and any tracks in the area are destroyed by the churning ground. Creatures standing in the area take a –1 status penalty to Acrobatics checks to and and Athletics checks to and . The first time each round you Sustain the Spell, you can move the churning area up to 20 feet in any direction. Creatures by the spell are carried along with the shifting sand in the same direction, if possible. Creatures that enter or begin their turn standing in the shifting sand must attempt a Reflex save.\nCritical Success The creature is unaffected and ignores the area's difficult terrain and penalty to skill checks until the end of its turn.\nSuccess The creature ignores the area's penalty to skill checks until the end of its turn.\nFailure The creature is affected normally by the spell this turn.\nCritical Failure The creature becomes immobilized within the spell's area until it Escapes. If the creature was already immobilized by shifting sand, it also falls .\nHeightened (5th) The status penalty increases to –2, and the spell's range increases to 60 feet.\nHeightened (7th) The status penalty increases to –3, the spell's range increases to 60 feet, and the spell's area increases to a 30-foot burst.\nHeightened (9th) The status penalty increases to –4, the spell's range increases to 60 feet, and the spell's area increases to a 40-foot burst.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '5': "Heightened (5th) The status penalty increases to –2, and the spell's range increases to 60 feet. Heightened (7th) The status penalty increases to –3, the spell's range increases to 60 feet, and the spell's area increases to a 30-foot burst. Heightened (9th) The status penalty increases to –4, the spell's range increases to 60 feet, and the spell's area increases to a 40-foot burst.",
        '7': "Heightened (5th) The status penalty increases to –2, and the spell's range increases to 60 feet. Heightened (7th) The status penalty increases to –3, the spell's range increases to 60 feet, and the spell's area increases to a 30-foot burst. Heightened (9th) The status penalty increases to –4, the spell's range increases to 60 feet, and the spell's area increases to a 40-foot burst.",
        '9': "Heightened (5th) The status penalty increases to –2, and the spell's range increases to 60 feet. Heightened (7th) The status penalty increases to –3, the spell's range increases to 60 feet, and the spell's area increases to a 30-foot burst. Heightened (9th) The status penalty increases to –4, the spell's range increases to 60 feet, and the spell's area increases to a 40-foot burst.",
      },
      summary:
        "Heightened (5th) The status penalty increases to –2, and the spell's range increases to 60 feet. Heightened (7th) The status penalty increases to –3, the spell's range increases to 60 feet, and the spell's area increases to a 30-foot burst. Heightened (9th) The status penalty increases to –4, the spell's range increases to 60 feet, and the spell's area increases to a 40-foot burst.",
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'show-the-way-pf2e',
    name: 'Show the Way',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 3,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      type: 'hours',
      hours: 8,
    },
    concentration: false,
    ritual: false,
    description:
      "You and allies in the area gain preternatural knowledge of the path ahead, allowing you to intuit the best way forward and avoid potential obstacles, such as difficult or confusing terrain. For the purpose of long-distance overland travel during exploration mode, traveling through difficult terrain reduces you to only three-quarters your travel Speed instead of half, and traveling through greater difficult terrain reduces your travel Speed to only half your travel Speed instead of one-third. Show the way doesn't prevent you from falling into traps or encountering other artificial obstacles and hazards.\nHeightened (6th) For the purpose of long-distance overland travel during exploration mode, traveling through difficult terrain doesn't reduce your travel Speed at all, and traveling through greater difficult terrain reduces your travel Speed to only three-quarters of its normal value instead of one-third.",
    classes: ['cleric', 'druid'],
  },
  {
    id: 'shrink-item-pf2e',
    name: 'Shrink Item',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'arcane',
    traditions: ['arcane'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You shrink the target to roughly the size of a coin with negligible Bulk. You can Dismiss the spell, and the spell ends if you toss the object onto a solid surface. The object can't be used to attack or cause damage during the process of it returning to normal size. If there isn't room for the object to return to normal size when the spell ends, the spell's duration continues until the object is in a location large enough to accommodate its normal size.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'speak-with-plants-pf2e',
    name: 'Speak with Plants',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You can ask questions of and receive answers from plants and fungi, but the spell doesn't make them more friendly or intelligent than normal. Most normal plants and fungi have a distinctive view of the world around them, so they don't recognize details about creatures or know anything about the world beyond their immediate vicinity. Cunning plant or fungus monsters are likely to be terse and evasive, while less intelligent ones often make inane comments.\nHeightened (4th) The duration is 8 hours.",
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'strength-of-mind-pf2e',
    name: 'Strength of Mind',
    system: 'pf2e',
    source: "Pathfinder #209: Destroyer's Doom",
    level: 3,
    school: 'divine',
    traditions: ['divine', 'occult', 'primal'],
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
      material: false,
    },
    duration: {
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You bolster your ally with reminders of their physical prowess, granting them additional defenses against harmful mental effects. The target gains a +1 status bonus to saving throws against mental effects and against effects that hinder movement (including those that reduce Speed or apply the , , or conditions). This bonus increases to +2 if the source of the effect has the fear trait.',
    classes: ['cleric', 'bard', 'druid'],
  },
  {
    id: 'the-four-hunters-pf2e',
    name: 'The Four Hunters',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 3,
    school: 'occult',
    traditions: ['occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 1,
    },
    range: {
      type: 'special',
      description: 'varies',
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
      'This is a story of four evenly matched hunters who sought to capture a falling star. Each hunter was known by the region they came from, and this spell focuses on one of their attributes. When you cast this spell, you must choose East, North, South, or West.\n• East was steady and optimistic. The target gains 5 temporary Hit Points and a +1 status bonus to Athletics for 1 round.\n• North was careful and cautious. The target can Step as a free action and gains a +1 status bonus to Survival for 1 round.\n• South was clever and cunning. The target becomes and gains a +1 status bonus to Stealth for 1 round.\n• West was bold and competitive. The target gains a +10-foot status bonus to their land Speed and a +1 status bonus to Acrobatics for 1 round.\n1 You quickly remind yourself of the story, granting only yourself the benefit.\n2 You tell a trusted ally within 30 feet this story, granting them the benefit.\n3 You impart this tale on all of your allies within 30 feet, granting them the benefit.',
    classes: ['bard', 'druid'],
  },
  {
    id: 'thief-of-fortune-pf2e',
    name: 'Thief of Fortune',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 3,
    school: 'arcane',
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
    concentration: false,
    ritual: false,
    description:
      "Seeing another creature improve themself with magic, you reach out and seize its benefits for yourself. Attempt a counteract check against the target spell effect. If you successfully counteract the effect, the effect does not end. Instead, you gain the effect of the target spell as well. If you would not be a valid target for the spell, you do not gain any of its benefits.\nThe spell's duration is halved as you siphon off its magical energy for yourself. Each round that both you and the original creature are affected by the spell counts for two rounds when determining the spell's duration. You can Dismiss the spell.",
    classes: ['sorcerer', 'wizard', 'cleric'],
  },
  {
    id: 'threefold-aspect-pf2e',
    name: 'Threefold Aspect',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'occult',
    traditions: ['occult', 'primal'],
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
      type: 'special',
      description: 'until the next time you make your daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "This spell allows you to change between three versions of yourself of different ages: a maiden (young adult), a mother (adult), or a matriarch (elderly). Choose one when you Cast the Spell. While the spell lasts, you can change the age to any of the three or to your natural age by Sustaining the spell. Your form always looks like you regardless of the age, and creatures who know you still recognize you and can tell your age is different.\nThreefold aspect alters your physical appearance and personality to present an authentic version of yourself at various ages. This grants you a +4 status bonus to Deception checks to pass as the chosen age, and you can add your level as a proficiency bonus to these checks even if you're untrained. Furthermore, unless a creature specifically uses a action or otherwise carefully examines you, it doesn't get a chance to notice that you aren't at your true age. You can Dismiss this spell.",
    classes: ['bard', 'druid'],
  },
  {
    id: 'travel-by-turtle-pf2e',
    name: 'Travel by Turtle',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
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
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure an intelligent sea turtle, who agrees to carry you upon its shell on a water journey. This turtle must be conjured into a large body of water within range, such as a lake or broad river. The turtle conjured is Large, is capable of carrying one Medium creature or up to four Small creatures, and has a swim Speed of 30 feet. The turtle doesn't engage in combat and doesn't put itself intentionally into harm's way, but it does convey you to a destination of your choice and follows your suggestions. The turtle otherwise functions as a boat, save that it controls itself and doesn't need to be piloted.\nHeightened (5th) The turtle's size increases to Huge, making it capable of carrying one Large creature, up to four Medium creatures, or up to 16 Small creatures. Its swim Speed increases to 40 feet, and the duration increases to 1 day.\nHeightened (7th) The turtle's size increases to Gargantuan, making it capable of carrying one Huge creature, up to four Large creatures, up to 16 Medium creatures, or up to 32 Small creatures. Its swim Speed increases to 50 feet, and the duration increases to 1 week.\nHeightened (9th) The turtle's size increases to Gargantuan, making it capable of carrying two Huge creatures, up to eight Large creatures, up to 32 Medium creatures, or up to 64 Small creatures. Its swim Speed increases to 60 feet, and the duration increases to 1 month.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'vampiric-feast-pf2e',
    name: 'Vampiric Feast',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
    savingThrow: {
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: false,
    ritual: false,
    description:
      'Your touch leeches the lifeblood out of a target to empower yourself. You deal 6d6 void damage to the target. You gain temporary Hit Points equal to half the void damage the target takes (after applying resistances and the like). You lose any remaining temporary Hit Points after 1 minute.\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'veil-of-privacy-pf2e',
    name: 'Veil of Privacy',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 3,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
    castingTime: {
      type: 'minutes',
      amount: 10,
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
    ritual: false,
    description:
      "You erect protective wards that make the target difficult to detect via magic. Veil of privacy attempts to counteract all detection, revelation, and scrying effects used against the target or the target's gear throughout the duration, counting cantrips as 1st-rank spells for this purpose. Successfully counteracting a spell that targets an area or multiple targets negates the effects for only veil of privacy's target.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'wall-of-shadow-pf2e',
    name: 'Wall of Shadow',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 3,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You form a wall of pure darkness in a straight line up to 60 feet long and 10 feet high. You must create the wall in an unbroken open space so its edges don't pass through any creatures or objects, or the spell is lost. The wall stands vertically and, if you wish, can be of a shorter length or height. The wall prevents light from passing through and appears as a sheet of pure darkness to creatures observing it.\nCreatures without darkvision or those unable to see through darkness can't see creatures on the other side of the wall. The wall is too thin for creatures to in the darkness itself, but creatures can Hide from creatures on the other side of the wall as normal.\nHeightened (5th) Creatures with darkvision (but not greater darkvision) can barely see through the wall. They treat targets seen through the wall as .\nHeightened (7th) Creatures with greater darkvision can barely see through the darkness. They treat targets seen through the wall as concealed. All other creatures are unable to see through the darkness at all.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'wanderers-guide-pf2e',
    name: "Wanderer's Guide",
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 3,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You call upon the beyond to guide your route. When you Cast this Spell, choose a destination; you receive an inspired route to that destination, allowing you and allies who travel overland with you to reduce the movement penalty from difficult terrain by half for the duration, as long as you don't deviate from the inspired route. This doesn't have any effect on movement during encounters. If you use this ability again before the duration is over, this effect ends and is replaced by that of the new route.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'whirling-scarves-pf2e',
    name: 'Whirling Scarves',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 3,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You surround yourself in a vortex of whirling colorful scarves of force that obfuscate you and disorient your foes. You gain the benefits of the condition, but only against ranged and melee attacks. When a melee attack fails to hit you because of the flat check for the concealed condition, the scarves snag the weapon or unarmed attack, and the creature takes a –1 circumstance penalty to further attacks with that weapon or unarmed attack until the end of its turn (or the end of its next turn, if it wasn't the creature's turn). The timing of the scarves' movement is harder to predict for ranged attackers, so the flat check for the concealed condition against ranged attacks increases from DC 5 to DC 6. You can Dismiss this spell.\nHeightened (+2) The circumstance penalty to further attacks with a melee weapon or unarmed attack the scarves snag increases by 1. The DC of the flat check for the concealed condition against ranged attacks increases by 1.",
    classes: ['cleric', 'bard'],
  },
]);
