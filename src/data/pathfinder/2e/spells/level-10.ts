import { Spell } from '../../../../types/magic/spells';

export const level10Spells: Spell[] = [
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
];
