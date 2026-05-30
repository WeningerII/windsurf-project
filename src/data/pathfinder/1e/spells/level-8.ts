import { Spell } from '../../../../types/magic/spells';

export const level8Spells: Spell[] = [
  {
    id: 'pf1e-horrid-wilting',
    name: 'Horrid Wilting',
    system: 'pf1e',
    source: 'Core Rulebook',
    sourceUrl: 'https://www.aonprd.com/SpellDisplay.aspx?ItemName=Horrid%20Wilting',
    level: 8,
    school: 'necromancy',
    castingTime: {
      type: 'standard',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a bit of sponge',
      divineFocus: true,
    },
    duration: {
      type: 'instant',
    },
    target: 'living creatures, no two of which can be more than 60 ft. apart',
    savingThrow: {
      attribute: 'con',
      success: 'half',
      description: 'Fortitude half',
    },
    damage: {
      base: {
        count: 1,
        die: 'd6',
        notation: '1d6 per level (max 20d6)',
      },
      type: 'necrotic',
    },
    savingThrowText: 'Fortitude half',
    concentration: false,
    ritual: false,
    description:
      'This spell evaporates moisture from the body of each subject living creature, causing flesh to wither and crack and crumble to dust. This deals 1d6 points of damage per caster level (maximum 20d6).',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'pf1e-meteor-swarm',
    name: 'Meteor Swarm',
    system: 'pf1e',
    source: 'Core Rulebook',
    sourceUrl: 'https://www.aonprd.com/SpellDisplay.aspx?ItemName=Meteor%20Swarm',
    level: 8,
    school: 'evocation',
    castingTime: {
      type: 'standard',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 400,
    },
    components: {
      verbal: true,
      somatic: true,
      material: false,
    },
    duration: {
      type: 'instant',
    },
    area: 'four 40-ft.-radius spreads, see text',
    savingThrow: {
      attribute: 'dex',
      success: 'half',
      description: 'none or Reflex half, see text',
    },
    damage: {
      base: {
        count: 6,
        die: 'd6',
        notation: '2d6 bludgeoning + 6d6 fire',
      },
      type: 'fire',
    },
    savingThrowText: 'none or Reflex half, see text',
    concentration: false,
    ritual: false,
    description:
      'Meteor swarm is a very powerful and spectacular spell that is similar to fireball in many aspects. When you cast it, four 2-foot-diameter spheres spring from your outstretched hand and streak in straight lines to the spots you select. The meteor spheres leave a fiery trail of sparks. Each sphere deals 2d6 points of bludgeoning damage and 6d6 points of fire damage.',
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
  {
    id: 'pf1e-power-word-stun',
    name: 'Power Word Stun',
    system: 'pf1e',
    source: 'Core Rulebook',
    sourceUrl: 'https://www.aonprd.com/SpellDisplay.aspx?ItemName=Power%20Word%20Stun',
    level: 8,
    school: 'enchantment',
    castingTime: {
      type: 'standard',
      amount: 1,
    },
    range: {
      type: 'ranged',
      feet: 25,
    },
    components: {
      verbal: true,
      somatic: false,
      material: false,
    },
    duration: {
      type: 'special',
      description: 'See text',
    },
    target: 'one creature with 150 hp or less',
    savingThrowText: 'none',
    concentration: false,
    ritual: false,
    description:
      "You utter a single word of power that instantly causes one creature of your choice to become stunned, whether the creature can hear the word or not. The duration of the spell depends on the target's current hit point total.",
    classes: ['sorcerer', 'wizard'],
    levelsByClass: {
      sorcerer: 8,
      wizard: 8,
    },
  },
];
