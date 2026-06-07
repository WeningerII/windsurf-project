import { Spell } from '../../../../types/magic/spells';
import { withPf2eSpellTraits } from './traits';

export const level4Spells: Spell[] = withPf2eSpellTraits([
  {
    id: 'air-walk-pf2e',
    name: 'Air Walk',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'transmutation',
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
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'The target can walk on air as if it were solid ground. The target gains a fly Speed equal to its land Speed.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'blink-pf2e',
    name: 'Blink',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'conjuration',
    traditions: ['arcane'],
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
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "You phase in and out of existence. You gain resistance 5 to all damage. At the start of each of your turns, roll 1d4. On a result of 1, you're incorporeal until the start of your next turn.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): The resistance increases by 3.',
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'confusion-pf2e',
    name: 'Confusion',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'enchantment',
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
      type: 'rounds',
      rounds: 1,
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will save',
    concentration: true,
    ritual: false,
    description:
      'You befuddle your target with strange impulses. The target must attempt a Will save. On a failure, the target is confused for 1 round. On a critical failure, the target is confused for 1 minute.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (8th): You can target up to 10 creatures.',
      ranks: {
        8: 'You can target up to 10 creatures.',
      },
    },
    classes: ['bard', 'sorcerer', 'wizard'],
  },
  {
    id: 'dimension-door-pf2e',
    name: 'Dimension Door',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      "Opening a door that bypasses normal space, you instantly transport yourself and any items you're wearing and holding from your current space to a clear space within range you can see. If this would bring another creature with you, the spell is lost.",
    heightening: {
      mode: 'fixed',
      summary:
        "Heightened (5th): The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are temporarily immune for 1 hour.",
      ranks: {
        5: "The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are temporarily immune for 1 hour.",
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'dimension-anchor-pf2e',
    name: 'Dimension Anchor',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
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
    savingThrowText: 'Will save',
    concentration: false,
    ritual: false,
    description:
      "You prevent the target from teleporting or traveling through other dimensions. The target must attempt a Will save. On a failure, it can't teleport or use dimensional travel for the duration.",
    classes: ['cleric', 'sorcerer', 'wizard'],
  },
  {
    id: 'fly-pf2e',
    name: 'Fly',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'transmutation',
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
      type: 'minutes',
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      'The target can soar through the air, gaining a fly Speed equal to its Speed or 20 feet, whichever is greater.',
    heightening: {
      mode: 'fixed',
      summary: 'Heightened (7th): The duration increases to 1 hour.',
      ranks: {
        7: 'The duration increases to 1 hour.',
      },
    },
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'freedom-pf2e',
    name: 'Freedom of Movement',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You repel effects that would hinder a creature's movement. The target ignores difficult terrain and greater difficult terrain, and effects that would impose a circumstance penalty on their Speed.",
    classes: ['cleric', 'druid', 'ranger'],
  },
  {
    id: 'globe-of-invulnerability-pf2e',
    name: 'Globe of Invulnerability',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
    traditions: ['arcane'],
    castingTime: {
      type: 'action',
      amount: 2,
    },
    range: {
      type: 'ranged',
      feet: 10,
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
      "You create a 10-foot-radius sphere of shimmering energy. Spells of 3rd level or lower can't pass through the globe and have no effect on targets within it.",
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'solid-fog-pf2e',
    name: 'Solid Fog',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'conjuration',
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
    concentration: false,
    ritual: false,
    description:
      'You create a bank of fog so thick it impedes movement as well as sight. This functions as obscuring mist, but the area is also difficult terrain.',
    classes: ['sorcerer', 'wizard'],
  },
  {
    id: 'spell-immunity-pf2e',
    name: 'Spell Immunity',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      'You ward the target against a specific spell. Choose one spell of 4th level or lower. The target is immune to that spell for the duration.',
    classes: ['cleric'],
  },
  {
    id: 'stoneskin-pf2e',
    name: 'Stoneskin',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'abjuration',
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
      minutes: 20,
    },
    concentration: false,
    ritual: false,
    description:
      "The target's skin hardens like stone. The target gains resistance 5 to physical damage, except adamantine. Each time the target is hit by a bludgeoning, piercing, or slashing attack, stoneskin's duration decreases by 1 minute.",
    heightening: {
      mode: 'fixed',
      summary:
        'Heightened (6th): The resistance increases to 10. Heightened (8th): The resistance increases to 15. Heightened (10th): The resistance increases to 20.',
      ranks: {
        6: 'The resistance increases to 10.',
        8: 'The resistance increases to 15.',
        10: 'The resistance increases to 20.',
      },
    },
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'wall-of-fire-pf2e',
    name: 'Wall of Fire',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
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
      attribute: 'dex',
      success: 'half',
    },
    damage: {
      base: {
        count: 4,
        die: 'd6',
        notation: '4d6',
      },
      type: 'fire',
    },
    concentration: false,
    ritual: false,
    description:
      'You raise a blazing wall that burns creatures passing through it. You create either a 5-foot-thick wall of flame in a straight line up to 60 feet long and 10 feet high, or a 5-foot-thick, 10-foot-radius ring of flame with the same height.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The fire damage increases by 1d6.',
    },
    classes: ['druid', 'sorcerer', 'wizard'],
  },
  {
    id: 'phantasmal-killer-pf2e',
    name: 'Phantasmal Killer',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
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
      'You conjure an illusory monster only the target perceives, dealing 8d6 mental damage and frightening it (with death possible on a critical failure).',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1): The mental damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'fire-shield-pf2e',
    name: 'Fire Shield',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'evocation',
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
      'A shield of flame wreathes you, granting cold resistance and dealing 2d6 fire damage to creatures that hit you with melee attacks.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary: 'Heightened (+2): The cold resistance increases by 5 and the fire damage by 1d6.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'suggestion-pf2e',
    name: 'Suggestion',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'enchantment',
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
      'You suggest a single reasonable course of action; the target pursues it unless it succeeds at a Will save.',
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': 'The maximum duration increases to 1 hour.',
      },
      summary: 'Heightened (6th): duration up to 1 hour.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'read-omens-pf2e',
    name: 'Read Omens',
    system: 'pf2e',
    source: 'Core Rulebook',
    level: 4,
    school: 'divination',
    traditions: ['divine', 'occult'],
    castingTime: {
      type: 'action',
      amount: 10,
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
      type: 'instant',
    },
    concentration: false,
    ritual: false,
    description:
      'You receive a cryptic clue or piece of advice about a specific course of action set to occur within a week.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'aerial-form-pf2e',
    name: 'Aerial Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      "You harness your mastery of primal forces to reshape your body into a Medium flying animal battle form. When you Cast this Spell, choose a listed battle form. You can decide the specific type of animal (such as an owl or eagle for bird), but this has no effect on the form's Size or statistics. While in this form, you gain the animal trait. You can Dismiss the spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 18 + your level. Ignore your armor's check penalty and Speed reduction.\n• 5 temporary Hit Points.\n• Low-light vision.\n• One or more unarmed melee attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +16, and your damage bonus is +5. These attacks are Dexterity based (for the purpose of the condition, for example). If your attack modifier for Dexterity-based unarmed attacks is higher, you can use it instead.\n• Acrobatics modifier of +16, unless your own modifier is higher.\nYou also gain specific abilities based on the form you choose:\n• Bat\n• Speed 20 feet, fly Speed 30 feet; precise echolocation 40 feet;\n• Melee a fangs, Damage 2d8 piercing;\n• Melee a wing (agile), Damage 2d6 bludgeoning.\n• Bird\n• Speed 10 feet, fly Speed 50 feet;\n• Melee a beak, Damage 2d8 piercing;\n• Melee a talon (agile), Damage 1d10 slashing.\n• Pterosaur\n• Speed 10 feet, fly Speed 40 feet; imprecise scent 30 feet;\n• Melee a beak, Damage 3d6 piercing.\n• Wasp\n• Speed 20 feet, fly Speed 40 feet;\n• Melee a stinger, Damage 1d8 piercing plus 1d6 persistent poison.\nHeightened (5th) Your battle form is Large and your fly Speed gains a +10-foot status bonus. You must have enough space to expand into or the spell is lost. You instead gain 10 temporary HP, attack modifier +18, damage bonus +8, and Acrobatics +20.\nHeightened (6th) Your battle form is Huge, your fly Speed gains a +15-foot status bonus, and your attacks have 10-foot reach. You must have enough space to expand into or the spell is lost. You instead gain AC = 21 + your level, 15 temporary HP, attack modifier +21, damage bonus +4 and double damage dice (including persistent damage), and Acrobatics +23.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'bestial-curse-pf2e',
    name: 'Bestial Curse',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
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
      "You tap into the target's inner being and curse it to become a bestial version of itself. The effect is based on its Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target's body gains minor bestial features. Its insides churn as they partially transform, causing it to be Clumsy 1 for 1 round. When it recovers from the clumsy condition, its features revert to normal, and the spell ends.\nFailure The target transforms into a bestial form for 1 hour. The target becomes clumsy 1 and gains weakness 1 to silver. It gains a claw, hoof, horn, or jaws Strike (your choice) that uses the target's unarmed Strike statistics except that the damage type changes to bludgeoning, piercing, or slashing, as appropriate. Whenever the target attempts to use any manipulate action, it must succeed at a Flat or the action is lost.\nCritical Failure As failure, but the duration is unlimited.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'bridge-of-vines-pf2e',
    name: 'Bridge of Vines',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 4,
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
      "Vines sprout beneath your feet and extend away from you in a straight line up to 60 feet, forming a 10-foot-wide bridge that can cross over difficult terrain and low obstacles, as well as reach higher ground. The bridge has an AC equal to your spell DC, Hardness 10, and 20 Hit Points. It is immune to critical hits and precision damage. The bridge lasts either for the duration of the spell, until it is destroyed, or until you Dismiss the spell.\nWhile the spell is active, you and your allies can use the bridge normally. If any other creatures attempt to use the bridge, the vines attempt to trip and entangle them. They must attempt a Reflex save against your spell DC.\nCritical Success The target is unaffected.\nSuccess The target treats the length of the bridge as difficult terrain.\nFailure As success, and the target is knocked .\nCritical Failure As success, and the target is knocked prone and until it Escapes (with a DC equal to your spell DC) or the spell ends.\nHeightened (+1) The bridge's Hit Points increase by 10.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'chroma-leach-pf2e',
    name: 'Chroma Leach',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
    school: 'occult',
    traditions: ['occult'],
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
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'Your hand glows with impossible colors from beyond the stars, and your touch saps both color and vitality from the living. The target must attempt a Fortitude save; creatures with the gnome trait take a –2 circumstance penalty to this save.\nCritical Success The target is unaffected.\nSuccess The target is Enfeebled 2 for 1 round.\nFailure The target is enfeebled 2 for 1 minute and Drained 1. The target is also filled with listlessness and ennui. For 1 round, if the target tries to use a move action, it must succeed at a Will save against your spell DC or the action is lost; this effect has the mental and emotion traits.\nCritical Failure As failure, but the creature is permanently enfeebled 2 and Drained 2 (although magic such as can remove these conditions).',
    classes: ['bard'],
  },
  {
    id: 'clairvoyance-pf2e',
    name: 'Clairvoyance',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      "You create an floating eye at a location within range (even if it's outside your line of sight or line of effect). The eye can't move, but you can see in all directions from that point as if using your normal visual senses.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'cloak-of-light-pf2e',
    name: 'Cloak of Light',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 4,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      attribute: 'con',
      success: 'half',
    },
    savingThrowText: 'basic Fortitude',
    concentration: true,
    ritual: false,
    description:
      'You surround yourself in holy light that restores the living and rebuffs undead. You glow with bright light in a 30-foot radius and dim light to the next 30 feet. Living creatures that begin their turn adjacent to you recover 4d6 Hit Points. Undead creatures that begin their turn adjacent to you take 4d6 vitality damage (basic Fortitude save).\nHeightened (+2) The healing increases by 2d6, and the damage to undead increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The healing increases by 2d6, and the damage to undead increases by 2d6.',
    },
    classes: ['cleric', 'druid'],
  },
  {
    id: 'containment-pf2e',
    name: 'Containment',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
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
      "You wrap a creature in an immobile force field, whether to protect it or those around it. The field blocks attacks, effects, and creatures that would pass through it, including the target. The field has Hardness 10, 40 Hit Points, and immunity to critical hits and precision damage. If the target of containment is unwilling, the effects depend on the target's Reflex save.\nCritical Success The target escapes from the field as it's forming, causing it to collapse.\nSuccess The field partially forms with 10 Hit Points instead of 40.\nFailure The field has its normal effect.\nHeightened (+1) The field's Hit Points are 5 higher on a success or 15 higher on a failure.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'countless-eyes-pf2e',
    name: 'Countless Eyes',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
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
      type: 'minutes',
      minutes: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "Eyes form across the touched creature's body, allowing it to see in all directions at once. The subject can't be flanked for the spell's duration. In addition, when the subject succeeds when Seeking, it critically succeeds instead.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'creation-pf2e',
    name: 'Creation',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'primal'],
    castingTime: {
      type: 'minutes',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 0,
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
      "You conjure a temporary object from magical energy. It must consist of earthen or plant-derived matter (such as wood, paper, brick, or stone) and be 5 cubic feet or smaller. It can't rely on intricate artistry or complex moving parts, never fulfills a cost or the like, and can't be made of precious materials or materials with a rarity of uncommon or higher. It is obviously temporarily conjured, and thus can't be sold or passed off as a genuine item. The spell gains the appropriate trait for the item created, typically earth, plant, or wood.\nHeightened (5th) The item is metal and can include common minerals, like feldspar or quartz. The spell gains the metal trait if used to create a metal object",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'detect-scrying-pf2e',
    name: 'Detect Scrying',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      'By reading trace auras, you detect the presence of scrying effects in the area. If detect scrying is higher rank than a scrying effect, you gain a glimpse of the scrying creature and learn its approximate distance and direction.\nHeightened (6th) The duration is until the next time you make your daily preparations.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'dinosaur-form-pf2e',
    name: 'Dinosaur Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      "You channel the primal forces of nature to transform into a Large animal battle form, specifically that of a powerful and terrifying dinosaur. When you Cast this Spell, choose a listed battle form. You can decide the specific type of animal, but this has no effect on the form's Size or statistics. While in this form, you gain the animal and dinosaur traits. You can Dismiss the spell.\nYou gain the following statistics and abilities regardless of which battle form you choose:\n• AC = 18 + your level. Ignore your armor's check penalty and Speed reduction.\n• 15 temporary Hit Points.\n• Low-light vision and imprecise scent 30 feet.\n• One or more unarmed melee attacks specific to the battle form you choose, which are the only attacks you can Strike with. You're trained with them. Your attack modifier is +16, and your damage bonus is +9. These attacks are Strength based (for the purpose of the condition, for example). If your unarmed attack modifier is higher, you can use it instead.\n• Athletics modifier of +18, unless your own is higher.\nYou also gain specific abilities based on the form you choose:\n• Ankylosaurus\n• Speed 25 feet;\n• Melee 1 tail (backswing, reach 10 feet), Damage 2d6 bludgeoning;\n• Melee 1 foot, Damage 2d6 bludgeoning.\n• Brontosaurus\n• Speed 25 feet;\n• Melee 1 tail (reach 15 feet), Damage 2d6 bludgeoning;\n• Melee 1 foot, Damage 2d8 bludgeoning.\n• Deinonychus\n• Speed 40 feet;\n• Melee 1 talon (agile), Damage 2d4 piercing plus 1 persistent bleed;\n• Melee 1 jaws, Damage 1d10 piercing.\n• Stegosaurus\n• Speed 30 feet;\n• Melee 1 tail (reach 10 feet), Damage 2d8 piercing.\n• Triceratops\n• Speed 30 feet;\n• Melee 1 horn, Damage 2d8 piercing, plus 1d6 persistent bleed on a critical hit;\n• Melee 1 foot, Damage 2d6 bludgeoning.\n• Tyrannosaurus\n• Speed 30 feet;\n• Melee 1 jaws (deadly d12, reach 10 feet), Damage 1d12 piercing;\n• Melee 1 tail (reach 10 feet), Damage 1d10 bludgeoning.\nHeightened (5th) Your battle form is Huge and your attacks have 15-foot reach, or 20-foot reach if they started with 15-foot reach. You instead gain 20 temporary HP, an attack modifier of +18, a damage bonus of +6, double the damage dice, and Athletics +21.\nHeightened (7th) Your battle form is Gargantuan and your attacks have 20-foot reach, or 25-foot reach if they started with 15-foot reach. You instead gain AC = 21 + your level, 25 temporary HP, an attack modifier of +25, a damage bonus of +15, double the damage dice, and Athletics +25.",
    classes: ['druid'],
  },
  {
    id: 'dispelling-globe-pf2e',
    name: 'Dispelling Globe',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'arcane',
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You create an immobile globe around yourself that attempts to counteract any spell from outside the globe whose area or targets enter into the globe, as if the globe were a spell 1 rank lower than its actual spell rank.\nIf the counteract attempt succeeds, it prevents only the portion of the spell that would have entered the globe (so if the spell also has targets outside the globe, or part of its area is beyond the globe, those targets or that area is affected normally).\nYou must form the sphere in an unbroken open space, so its edges don't pass through any creatures or objects, or the spell is lost (though creatures can enter the globe after the spell is cast).",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'divine-wrath-pf2e',
    name: 'Divine Wrath',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
    savingThrow: {
      attribute: 'con',
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      "You channel the fury of divinity against your foes. You deal 4d10 spirit damage to enemies in the area, depending on their Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes half damage.\nFailure The creature takes full damage and is Sickened 1.\nCritical Failure The creature takes full damage and is Sickened 2; while it's sickened, it's also Slowed 1.\nHeightened (+1) The damage increases by 1d10.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 1d10.',
    },
    classes: ['cleric'],
  },
  {
    id: 'dull-ambition-pf2e',
    name: 'Dull Ambition',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
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
      "You curse the target to fail in all avenues of its life that require drive and ambition, as it inadvertently undermines its own goals at every turn. The effect is based on the target's Will save.\nCritical Success The target is unaffected.\nSuccess For 1 hour, the target rolls twice and uses the lower result on initiative rolls.\nFailure For 1 day, the target rolls twice and uses the lower result on initiative rolls and any check to determine the success of a downtime activity.\nCritical Failure As failure, but the duration is unlimited.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'flicker-pf2e',
    name: 'Flicker',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      'You flicker quickly between your current plane and another. You gain resistance 5 to all damage, except force. At the end of each of your turns, you automatically teleport 10 feet in a random direction, as determined by the GM. You can Sustain the spell to teleport in this way.\nHeightened (+2) The resistance increases by 3.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'ghostly-tragedy-pf2e',
    name: 'Ghostly Tragedy',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
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
      type: 'minutes',
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "This spell compels local spirits to reenact a violent event of the recent past that you're aware of and name as you Cast the Spell. You take the role of the primary victim. The reenactment plays out the final 9 minutes leading up to the death or injury of the victim and the minute after. The spirits don't change form, so this doesn't help determine perpetrators by their looks. Spiritual forms of missing creatures necessary for the event manifest as needed, and missing items appear as shadowy outlines.\nOnce the scene ends, you take 2d6 void] damage for each ghostly apparition that participated in the scene (typically equal to the number of creatures involved other than the victim). Any creature that observed the ghostly recreation, including you, can attempt checks to investigate the event to discover new clues and information.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'holy-cascade-pf2e',
    name: 'Holy Cascade',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
    school: 'divine',
    traditions: ['divine'],
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
      'You call upon sacred energy to amplify a vial of , tossing it an incredible distance. It explodes in an enormous burst that deals 3d6 bludgeoning damage to creatures in the area from the cascade of water. The water deals an additional ((@item.level*2)-2)d6 spirit] damage to creatures with the unholy trait in the area.\nHeightened (+1) The bludgeoning damage increases by 1d6, and the additional spirit damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) The bludgeoning damage increases by 1d6, and the additional spirit damage increases by 2d6.',
    },
    classes: ['cleric'],
  },
  {
    id: 'honeyed-words-pf2e',
    name: 'Honeyed Words',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'occult',
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
      'Falsehoods pass your lips as smoothly as silk. You gain a +4 status bonus to Deception checks to and against Perception checks to discern if you are telling the truth, and you add your level even if untrained. If the implausibility of your lies prompts a circumstance penalty or a DC increase, reduce that penalty by half or increase it by half.',
    classes: ['bard'],
  },
  {
    id: 'hydraulic-torrent-pf2e',
    name: 'Hydraulic Torrent',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      'A swirling torrent of water manifests along a straight line, battering creatures and unattended objects in its path and possibly pushing them away from you. The torrent deals 8d6 bludgeoning damage. Each creature in the area must attempt a basic Fortitude save; unattended objects automatically fail. Creatures and objects that fail are also knocked back 5 feet (10 feet on a critical failure).\nHeightened (+1) The damage increases by 2d6.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['druid'],
  },
  {
    id: 'ice-storm-pf2e',
    name: 'Ice Storm',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
    school: 'arcane',
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
      "You create a gray storm cloud that pelts creatures with an icy deluge. When you Cast the Spell, a burst of magical hail deals 2d8 bludgeoning damage and 2d8 cold damage to each creature in the area below the cloud (basic Reflex save). Snow and sleet continue to rain down in the area for the remainder of the spell's duration, making the area difficult terrain. Any creature that ends its turn in the storm takes (floor(@item.level/2)) cold] damage. If you Cast this Spell outdoors, you can create two nonoverlapping clouds instead of one. As normal, if a Large or larger creature is in both clouds, it still only takes the initial damage once and the continuing damage once per turn.\nHeightened (+2) The initial bludgeoning damage and cold damage increase by 1d8 each, and the cold damage creatures take at the end of their turns increases by 1.",
    heightening: {
      mode: 'interval',
      interval: 2,
      summary:
        'Heightened (+2) The initial bludgeoning damage and cold damage increase by 1d8 each, and the cold damage creatures take at the end of their turns increases by 1.',
    },
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'infiltrators-tunnel-pf2e',
    name: "Infiltrator's Tunnel",
    system: 'pf2e',
    source: 'Pathfinder NPC Core',
    level: 4,
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
      "It's best to know the ingress and egress points for any location you plan to rob. But it's even better to make your own! You create two portals. One appears on a flat surface you can touch, and the other appears on a different flat surface in range that you can see.\nYou can move through the portals as though they were adjacent to each other. Any other creature attempting to move through the portals must succeed at a Will saving throw or be teleported up to 30 feet away from their starting point to a random safe space determined by the GM.\nHeightened (6th) When you Cast the Spell, you can designate up to 5 other creatures to freely move between the portals.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'it-is-written-pf2e',
    name: 'It is Written',
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 4,
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
      type: 'special',
      description: 'until the end of your next turn',
    },
    concentration: false,
    ritual: false,
    description:
      "You envision a future for yourself, confident in the certainty that this vision is your destiny. Before the duration ends, if you would attempt an attack roll, Perception check, saving throw, or skill check that would aid in the fulfillment of this destiny, you can attempt this roll at mythic proficiency. You choose which roll to use this benefit on before rolling. If you use this benefit, the spell ends. Either way, you're then temporarily immune to it is written for 1 hour.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'liminal-doorway-pf2e',
    name: 'Liminal Doorway',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      'You draw a chalk doorway on an unbroken surface, which opens into an extradimensional space. Any creature treating the drawing as an actual door can Interact to touch the doorknob and pass through. The warped, chalk-drawn room beyond the door is 20 feet in width, depth, and height. The space is unadorned and empty, with chalk lines indicating the corners of the walls.\nIf the drawing is scrubbed away, the underlying surface is broken, or a creature attempts to enter the space that would put it over capacity, the space begins to collapse. The space ejects one creature at random each round, depositing it on the nearest open ground, until all creatures are returned outside.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'luring-wail-pf2e',
    name: 'Luring Wail',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 4,
    school: 'occult',
    traditions: ['occult', 'primal'],
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
      "You emit a plaintive cry to lure your enemies closer. Each creature in the emanation that can hear you must attempt a Will save. If you speak a creature's name as part of the casting of the spell, that creature takes a –2 circumstance penalty to its saving throw. Each creature that enters the area on its turn must attempt a save. If you attack or take a hostile action, the condition ends only for the creature that's attacked.\nCritical Success The creature is unaffected.\nSuccess The creature is Slowed 1 for 1 round.\nFailure The creature becomes fascinated and compelled to move toward the sound of your cry on its turn. As long as it is in the emanation and can hear, it must spend at least one of its actions on each of its turns to move closer to you.\nCritical Failure As failure, but the creature must spend all its actions moving toward the sound. Additionally, the creature is .",
    classes: ['bard', 'druid'],
  },
  {
    id: 'mantiss-grasp-pf2e',
    name: "Mantis's Grasp",
    system: 'pf2e',
    source: 'Pathfinder Adventure: Prey for Death',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'divine'],
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
      "You cause red, ghostly mantis arms to sprout from a nearby surface and crush a creature, dealing 8d6 force damage and attempting to pin the target in place. The effects are determined by the creature's Reflex save.\nCritical Success The target is unaffected.\nSuccess The target takes half damage.\nFailure The target takes full damage and is for 1 round.\nCritical Failure The target takes double damage and is immobilized for 1 minute. At the end of each of its turns, the target can attempt to . The Escape DC is equal to your spell DC.\nHeightened (7th) You can target up to 5 creatures.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '7': 'Heightened (7th) You can target up to 5 creatures.',
      },
      summary: 'Heightened (7th) You can target up to 5 creatures.',
    },
    classes: ['sorcerer', 'wizard', 'cleric'],
  },
  {
    id: 'mirage-pf2e',
    name: 'Mirage',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
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
      type: 'special',
      description: 'until your next daily preparations',
    },
    concentration: false,
    ritual: false,
    description:
      "You create an illusion that causes natural terrain to look, sound, feel, and smell like a different kind of terrain. This doesn't disguise any structures or creatures in the area.\nAny creature that touches the illusion or uses the action to examine it can attempt to disbelieve your illusion.\nHeightened (5th) Your image can also disguise structures or create illusory structures (but still doesn't disguise creatures).",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'mountain-resilience-pf2e',
    name: 'Mountain Resilience',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      minutes: 20,
    },
    concentration: false,
    ritual: false,
    description:
      "The target's skin hardens like the stone of a mountain face. It gains resistance 5 to physical damage, except adamantine. Each time the target is hit by a bludgeoning, piercing, or slashing attack, mountain resilience's duration decreases by 1 minute.\nHeightened (6th) The resistance increases to 10.\nHeightened (8th) The resistance increases to 15.\nHeightened (10th) The resistance increases to 20.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'mutilate-pf2e',
    name: 'Mutilate',
    system: 'pf2e',
    source: "Pathfinder #209: Destroyer's Doom",
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'occult', 'primal'],
    castingTime: {
      type: 'action',
      amount: 1,
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
      "You cut your own body in a ritualistic manner, causing similar damage to a creature in your line of sight. These cuts are superficial and cause 1d4 slashing damage to you; however, the wounds that open up on our target's body are far deeper. The targeted creature takes 5d8 slashing damage; a creature that critically fails this saving throw also takes (1d8 + @item.level -4) bleed] damage. If you cast this as a three-action spell, the spell instead affects a 5-foot burst.\nHeightened (+1) Increase the damage dealt to the target by 1d8, and increase the persistent bleed damage by 1.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary:
        'Heightened (+1) Increase the damage dealt to the target by 1d8, and increase the persistent bleed damage by 1.',
    },
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'nightmare-pf2e',
    name: 'Nightmare',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      type: 'special',
      description: '1 day',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You send disturbing nightmares to your target. The next time the target falls asleep, it must attempt a Will save. If you know the target only by name and have never met them, the target gets a +4 circumstance bonus to the Will save.\nCritical Success The target suffers no adverse effects and is temporarily immune for 1 week.\nSuccess The target experiences the nightmares but suffers no adverse effects other than unpleasant memories.\nFailure The target experiences the nightmares and awakens .\nCritical Failure The target experiences the nightmares, awakens Fatigued, and is Drained 2 until it is no longer Fatigued.',
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'outcasts-curse-pf2e',
    name: "Outcast's Curse",
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      'You afflict the target with a curse that makes its presence abrasive and off-putting. The target must attempt a Will save.\nCritical Success The target is unaffected.\nSuccess For 10 minutes, the target must roll twice and use the worse result whenever attempting a Deception, Diplomacy, Intimidation, or Performance check, and creatures they encounter have an initial attitude toward them of one step worse (for instance, instead of ).\nFailure As success, but the effect is permanent.\nCritical Failure As failure, and creatures that the target encounters have an initial attitude toward them of two steps worse.',
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'peaceful-bubble-pf2e',
    name: 'Peaceful Bubble',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'occult'],
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
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      "An opaque shell of drifting, iridescent runes covers the area, creating a bubble. You can choose to make the burst smaller, in 10-foot increments. The runes don't block travel, but those inside the bubble can't perceive those outside it and vice versa. Detection and scrying effects are likewise blocked.\nCreatures sleeping within the bubble are immune to dreams sent by spells. Those sleeping 8 hours reduce their condition by 2 instead of 1.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'planar-tether-pf2e',
    name: 'Planar Tether',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      "You stitch the target to its current plane. While the target is affected by planar tether, the spell attempts to counteract any teleportation effect that would move the target, or any effect that would transport it to a different plane. Planar tether's duration is determined by the target's Will save.\nCritical Success The target is unaffected.\nSuccess The effect's duration is 1 minute.\nFailure The effect's duration is 10 minutes.\nCritical Failure The effect's duration is 1 hour.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'ranages-circle-pf2e',
    name: "Ranage's Circle",
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Rival Academies',
    level: 4,
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
      "Many stories tell of a clearing deep in the Mwangi jungle, surrounded by ancient cypress trees. At the center stands an ancient baobab tree growing around a large sphere of black basalt. Legends say that two spirit brothers, Ranage and Golokango, dwelled there long ago until Golokango's evil ways forced the virtuous Ranage to encase his brother in stone. Ranage then transformed himself into a tree to surround and protect the rock for all time. By telling this tale, you condemn an enemy to a stony fate similar to Golokango's and summon plants to surround them.\nWhen you Cast this Spell, every square adjacent to the target becomes difficult terrain from the sudden eruption of plant life for 1 minute. The target also attempts a Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target is Clumsy 1 as their feet are bound within stone. This condition lasts until they move from their current position.\nFailure The target is Clumsy 2 and as their legs are encased in rock. The clumsy condition lasts until they move from their current position, and they can from being immobilized with a check against your spell DC.\nCritical Failure The target is clumsy 2 and as nearly their entire body is covered in basalt. The clumsy condition lasts until they move from their current position, and they can Escape from being restrained with a successful check against your spell DC.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'reflected-beauty-pf2e',
    name: 'Reflected Beauty',
    system: 'pf2e',
    source: 'Pathfinder #205: Singer, Stalker, Skinsaw Man',
    level: 4,
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
      type: 'hours',
      hours: 1,
    },
    concentration: false,
    ritual: false,
    description:
      "When you cast reflected beauty, choose a willing creature that's the same size as you and that you can see within 30 feet. The spell then disguises you with a realistic illusion, as if via heightened to 3rd rank, but includes tactile and olfactory sensation in addition to visual and voice. The appearance of the illusion that disguises you includes any changes to sex characteristics or other aspects needed to match the target creature's heart's desire, allowing you to interact with them as the person they could be. If you're ever more than 30 feet from the subject you're reflecting, reflected beauty immediately ends. You can Dismiss this spell.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'reflective-scales-pf2e',
    name: 'Reflective Scales',
    system: 'pf2e',
    source: 'Pathfinder Lost Omens Divine Mysteries',
    level: 4,
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
    savingThrow: {
      attribute: 'dex',
      success: 'half',
    },
    savingThrowText: 'basic Reflex',
    concentration: false,
    ritual: false,
    description:
      "You grow a set of colored, glowing scales or scaled armor that stores energy before releasing it in a final burst. When you cast this spell, choose acid, cold, fire, electricity, or poison damage. You gain resistance 5 against that type of damage. The scales' color depends on the damage type you chose, such as red or orange for fire damage.\nThe scales store up energy as they protect you. Keep track of how much damage the scales have prevented. As a 2-action activity that has the concentrate and manipulate traits, you can explode your scales outward in a , dealing 1d6 damage of the chosen type to all creatures in the area for every 10 damage the scales have prevented, to a maximum of 10d6 damage (after preventing 100 damage). Each creature in the area must attempt a basic Reflex save. Once you do so, the spell ends.\nHeightened (+2) The resistance increases by 5, and the maximum damage from the scale explosion increases by 5d6.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'rewrite-memory-pf2e',
    name: 'Rewrite Memory',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      type: 'unlimited',
    },
    savingThrow: {
      attribute: 'wis',
      success: 'none',
    },
    savingThrowText: 'Will',
    concentration: false,
    ritual: false,
    description:
      "You alter the target's memories by erasing a memory, enhancing a memory's clarity, altering a memory, or adding a false memory. The target can attempt a Will save to resist the spell.\nCritical Success The target is unaffected and realizes you tried to alter its memory.\nSuccess The target is unaffected but thinks your spell was something harmless instead of rewrite memory, unless it identifies the spell.\nFailure During the first 5 minutes of the spell's duration, you can Sustain the spell to modify a memory once each round. When you do, you imagine up to 6 seconds of memory to modify, to a maximum of 5 continuous minutes of memory.\nAny memories you've altered remain changed as long as the spell is active. If the target moves out of range before the 5 minutes is up, you can't alter any further memories.\nHeightened (6th) You can Cast the Spell on a willing target to suppress all memory of a particular topic, detailed in 50 words or fewer. The effect is permanent, and it patches these omissions with an indistinct haze.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '6': 'Heightened (6th) You can Cast the Spell on a willing target to suppress all memory of a particular topic, detailed in 50 words or fewer. The effect is permanent, and it patches these omissions with an indistinct haze.',
      },
      summary:
        'Heightened (6th) You can Cast the Spell on a willing target to suppress all memory of a particular topic, detailed in 50 words or fewer. The effect is permanent, and it patches these omissions with an indistinct haze.',
    },
    classes: ['bard'],
  },
  {
    id: 'seal-fate-pf2e',
    name: 'Seal Fate',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
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
      "You utter a curse that a creature will meet a certain end—a death by freezing, stabbing, or another means you devise. Choose one type of damage from the following list: acid, bludgeoning, cold, electricity, fire, piercing, slashing, sonic, or void. The effect is based on the target's Fortitude save.\nCritical Success The target is unaffected.\nSuccess The target gains weakness 2 to the chosen damage type until the end of your next turn.\nFailure As success, but the duration is 1 minute. If the creature is reduced to 0 Hit Points by the chosen damage and its level is 7 or less, it dies.\nCritical Failure As failure, but the duration is unlimited.\nHeightened (+2) The weakness increases by 1, and the maximum level of creature that can be automatically killed increases by 4.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'shape-stone-pf2e',
    name: 'Shape Stone',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      'You shape the stone into a rough shape of your choice. The shaping process is too crude to produce intricate parts, fine details, moving pieces, or the like. Any creatures standing atop the stone when you reshape it must each attempt a Reflex save or Acrobatics check.\nSuccess The creature is unaffected.\nFailure The creature falls atop the stone.\nCritical Failure The creature falls off the stone (if applicable) and lands Prone.',
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'snake-fangs-pf2e',
    name: 'Snake Fangs',
    system: 'pf2e',
    source: 'Pathfinder Howl of the Wild',
    level: 4,
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
      "Your jaw unhinges as your teeth extend into wicked fangs. For the spell's duration, you gain a fangs unarmed attack. They're a finesse, grapple, unarmed attack that deals 1d8 piercing damage and an extra 2d10 poison damage. If you have a creature at least one size smaller than you with your fangs, you can use the ability that deals 4d6 bludgeoning] damage and has a Rupture value of 17. A swallowed creature is transported to an extraplanar space that resembles the inside of a snake's stomach, so when it gets free, it appears in a space adjacent to you. If you're killed or the spell ends, the swallowed creature is immediately freed.\nHeightened (+3) The extra poison damage of your fangs unarmed attack increases by 1d10, the damage dealt by the Swallow Whole ability increases by 6d6, and the Rupture value increases by 9.",
    classes: ['druid'],
  },
  {
    id: 'talking-corpse-pf2e',
    name: 'Talking Corpse',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      "You grant the target corpse a semblance of life, which it uses to speak the answers to three questions posed to it. This spell calls on the physical body's latent memories rather than summoning back the deceased's spirit, so the corpse must be mostly intact for the spell to function. The more damage the corpse has taken, the more inaccurate or patchwork its answers are, and it must have a throat and mouth to speak at all. If anyone has previously cast this spell on the corpse in the last week, the spell automatically fails. The corpse can attempt a Will save to resist answering the questions using the statistics of the original creature at its time of death, with the following effects.\nCritical Success The target can lie or refuse to answer your questions, and the target's spirit haunts you for 24 hours, bothering you and causing you to be unable to gain any rest for that time.\nSuccess The target can provide false information or refuse to answer your questions.\nFailure The target must answer truthfully, but its answers can be brief, cryptic, and repetitive. It can still mislead you or attempt to stall so that the spell's duration runs out before you can ask all your questions.\nCritical Failure As failure, but the target's answers are more direct and less repetitive, though still cryptic. It takes a -2 status penalty to Deception checks to deceive or mislead you.",
    classes: ['cleric', 'bard'],
  },
  {
    id: 'telepathy-pf2e',
    name: 'Telepathy',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      "You can communicate telepathically with creatures within 30 feet. Once you establish a connection by communicating with a creature, the communication is two-way. You can communicate only with creatures that share a language with you.\nHeightened (6th) You can communicate telepathically with creatures using shared mental imagery even if you don't share a language; telepathy loses the linguistic trait.",
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'translocate-pf2e',
    name: 'Translocate',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
    concentration: false,
    ritual: false,
    description:
      "You instantly transport yourself and any items you're wearing and holding from your current space to an unoccupied space within range you can see. If this would bring another creature with you—even if you're carrying it in an extradimensional container—the spell is lost.\nHeightened (5th) The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are then temporarily immune for 1 hour.",
    heightening: {
      mode: 'fixed',
      ranks: {
        '5': "Heightened (5th) The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are then temporarily immune for 1 hour.",
      },
      summary:
        "Heightened (5th) The range increases to 1 mile. You don't need to be able to see your destination, as long as you have been there in the past and know its relative location and distance from you. You are then temporarily immune for 1 hour.",
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'tricksters-feathers-pf2e',
    name: "Trickster's Feathers",
    system: 'pf2e',
    source: 'Pathfinder War of Immortals',
    level: 4,
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
      type: 'hours',
      hours: 24,
    },
    concentration: false,
    ritual: false,
    description:
      "You conjure four magic feathers, each with the potential to hold a single illusory guise. These feathers have negligible Bulk and remain potent for the duration. As an Interact action, you can place one of these feathers into your hair or cap, or remove an already donned feather. When worn in this way, the feather causes you to appear as another creature of the same body shape, and with roughly similar height (within 6 inches) and weight (within 50 pounds), as yourself. The disguise is typically good enough to hide your identity but not to impersonate a specific individual. This disguise also changes your voice and scent, but it doesn't disguise your mannerisms or behavior. You can change the appearance of your clothing and worn items, such as making your armor look like a dress. Held items are unaffected, and any worn item you remove returns to its true appearance.\nWhen you don a feather for the first time, you determine the illusory appearance that feather grants you, selecting the ancestry, age, gender, attire, and other visual features. For the duration, this feather is linked to that disguise. Wearing it in your hair or hat always imparts the linked appearance. Selecting a feather's appearance for the first time counts as setting up a disguise for the use of Deception; attempt this Deception check at mythic proficiency.\nYou can only wear one feather at a time. When you remove a feather, you revert to your true appearance. If you give a feather to another creature, it can no longer impart a disguise.",
    classes: ['sorcerer', 'wizard', 'cleric', 'bard', 'druid'],
  },
  {
    id: 'unfettered-movement-pf2e',
    name: 'Unfettered Movement',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      minutes: 10,
    },
    concentration: false,
    ritual: false,
    description:
      "You repel effects that would hinder a creature or slow its movement. While under this spell's effect, the target ignores effects that would give them a circumstance penalty to Speed. When they attempt to an effect that has them , , or , they automatically succeed unless the effect is magical and of a higher rank than the unfettered movement spell.",
    classes: ['sorcerer', 'wizard', 'cleric', 'druid'],
  },
  {
    id: 'vampiric-maiden-pf2e',
    name: 'Vampiric Maiden',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
    school: 'arcane',
    traditions: ['arcane', 'divine', 'occult'],
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
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'A ghostly iron maiden snaps shut on the target and drains its vitality for your gain. This deals 4d4 piercing damage and 4d4 void damage, and the target must attempt a Fortitude save. You gain temporary Hit Points equal to the void damage the target takes (after applying resistances, weaknesses, and the like). You lose any remaining temporary Hit Points after 1 minute.\nCritical Success The target is unaffected.\nSuccess The target takes half damage.\nFailure The target is briefly trapped within the vampiric maiden. The target takes full damage and is by the iron maiden for 1 round or until it uses an Interact action to extricate itself, whichever comes first.\nCritical Failure The target takes double damage and is immobilized by the vampiric maiden for 1 round or until it Escapes (the DC is your spell DC), whichever comes first.\nHeightened (+1) The piercing and void damage increase by 1d4 each.',
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The piercing and void damage increase by 1d4 each.',
    },
    classes: ['sorcerer', 'wizard', 'cleric', 'bard'],
  },
  {
    id: 'vapor-form-pf2e',
    name: 'Vapor Form',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      type: 'minutes',
      minutes: 5,
    },
    concentration: false,
    ritual: false,
    description:
      "The target transforms into a vaporous state. In this state, the target is amorphous. It loses any item bonus to AC and all other effects and bonuses from armor, and it uses its proficiency modifier for unarmored defense. It gains resistance 8 to physical damage and is immune to precision damage. It can't cast spells, activate items, or use actions that have the attack or manipulate trait. It gains a fly Speed of 10 feet and can slip through tiny cracks. The target can Dismiss the spell.",
    classes: ['sorcerer', 'wizard', 'bard', 'druid'],
  },
  {
    id: 'vision-of-death-pf2e',
    name: 'Vision of Death',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      "You force the target to see a vision of its own death. It takes 8d6 mental damage with a Will save. If the target is reduced to 0 HP by this spell, its vision becomes reality and kills it instantly.\nCritical Success The target is unaffected.\nSuccess The target takes half damage and is Frightened 1.\nFailure The target takes full damage and is Frightened 2.\nCritical Failure The target takes double damage, is Frightened 4 and is for as long as it's frightened.\nHeightened (+1) The damage increases by 2d6.",
    heightening: {
      mode: 'interval',
      interval: 1,
      summary: 'Heightened (+1) The damage increases by 2d6.',
    },
    classes: ['sorcerer', 'wizard', 'bard'],
  },
  {
    id: 'vital-beacon-pf2e',
    name: 'Vital Beacon',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
    school: 'divine',
    traditions: ['divine', 'primal'],
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
      'Vitality radiates outward from you, allowing others to supplicate and receive healing. Once per round, either you or an ally can use an Interact action to supplicate and lay hands upon you to regain Hit Points. Each time the beacon heals someone, it decreases in strength. It restores (@item.rank)d10 healing|shortLabel] Hit Points to the first creature, (@item.rank)d8 healing|shortLabel] Hit Points to the second, (@item.rank)d6 healing|shortLabel] Hit Points to the third, and (@item.rank)d4 healing|shortLabel] Hit Points to the fourth, after which the spell ends. You can have only one vital beacon active at a time.\nHeightened (+1) The beacon restores one additional die of Hit Points each time it heals, using the same die size as the others for that step.',
    classes: ['cleric', 'druid'],
  },
  {
    id: 'weapon-storm-pf2e',
    name: 'Weapon Storm',
    system: 'pf2e',
    source: 'Pathfinder Player Core',
    level: 4,
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
      success: 'none',
    },
    savingThrowText: 'Reflex',
    concentration: false,
    ritual: false,
    description:
      "Area 30-foot cone or 10-foot emanation\nYou swing a weapon you're holding, and the weapon magically multiplies into duplicates that swipe at all creatures in either a cone or an emanation. This flurry deals four dice of damage to creatures in the area. This damage has the same type as the weapon and uses the same die size. Determine the die size as if you were attacking with the weapon; for instance, if you were wielding a two-hand weapon in both hands, you'd use its two-hand damage die.\nCritical Success The creature is unaffected.\nSuccess The target takes half damage.\nFailure The target takes full damage.\nCritical Failure The target takes double damage and is subject to the weapon's critical specialization effect.\nHeightened (+1) Add another damage die.",
    classes: ['sorcerer', 'wizard', 'druid'],
  },
  {
    id: 'whispers-of-the-void-pf2e',
    name: 'Whispers of the Void',
    system: 'pf2e',
    source: 'Pathfinder Player Core 2',
    level: 4,
    school: 'divine',
    traditions: ['divine', 'occult'],
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
      success: 'none',
    },
    savingThrowText: 'Fortitude',
    concentration: false,
    ritual: false,
    description:
      'You whisper baleful secrets that transcend language and carry magically to the ears of your foes. The words take physical form, weakening the life force of the targets, each of which must attempt a Fortitude save.\nCritical Success The creature is unaffected.\nSuccess The creature takes (floor(@item.rank/2))d8 persistent] damage.\nFailure The creature takes (floor(@item.rank/2)*2)d8 persistent] damage and becomes Drained 1.\nCritical Failure The creature takes (floor(@item.rank/2)*2)d8 persistent] damage and becomes Drained 2 and Doomed 1.\nHeightened (+2) The persistent void damage increases by 1d8 on a success, or by 2d8 on a failure or critical failure.',
    classes: ['cleric', 'bard'],
  },
]);
