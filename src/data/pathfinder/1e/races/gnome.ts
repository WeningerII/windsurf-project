import { Species } from '../../../../types/character-options/species';

export const gnome: Species = {
  id: 'gnome',
  name: 'Gnome',
  system: 'pf1e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [{ type: 'fixed', attributes: { con: 2, cha: 2, str: -2 } }],

  size: 'small',
  speed: 20,

  languages: {
    automatic: ['Common', 'Gnome', 'Sylvan'],
    choice: {
      count: 0,
      options: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'small',
      name: 'Small',
      source: 'Gnome',
      description:
        'Gnomes are Small creatures and gain a +1 size bonus to their AC, a +1 size bonus on attack rolls, a –1 penalty to their CMB and CMD, and a +4 size bonus on Stealth checks.',
    },
    {
      id: 'low-light-vision',
      name: 'Low-Light Vision',
      source: 'Gnome',
      description: 'Gnomes can see twice as far as humans in conditions of dim light.',
    },
    {
      id: 'defensive-training',
      name: 'Defensive Training',
      source: 'Gnome',
      description: 'Gnomes gain a +4 dodge bonus to AC against monsters of the giant subtype.',
    },
    {
      id: 'gnome-magic',
      name: 'Gnome Magic',
      source: 'Gnome',
      description:
        'Gnomes add +1 to the DC of any saving throws against illusion spells that they cast. Gnomes with Charisma scores of 11 or higher also gain spell-like abilities.',
    },
    {
      id: 'hatred',
      name: 'Hatred',
      source: 'Gnome',
      description:
        'Gnomes receive a +1 bonus on attack rolls against humanoid creatures of the reptilian and goblinoid subtypes.',
    },
    {
      id: 'illusion-resistance',
      name: 'Illusion Resistance',
      source: 'Gnome',
      description:
        'Gnomes gain a +2 racial saving throw bonus against illusion spells and effects.',
    },
    {
      id: 'keen-senses',
      name: 'Keen Senses',
      source: 'Gnome',
      description: 'Gnomes receive a +2 racial bonus on Perception checks.',
    },
    {
      id: 'obsessive',
      name: 'Obsessive',
      source: 'Gnome',
      description:
        'Gnomes receive a +2 racial bonus on a Craft or Profession skill of their choice.',
    },
    {
      id: 'weapon-familiarity',
      name: 'Weapon Familiarity',
      source: 'Gnome',
      description: 'Gnomes treat any weapon with the word "gnome" in its name as a martial weapon.',
    },
  ],

  description:
    'Gnomes trace their lineage back to the mysterious realm of the fey, a place where colors are brighter, the wildlands wilder, and emotions more primal.',
  ageInfo: 'Gnomes reach adulthood at 40 and can live over 500 years.',
  alignmentTendency: 'Gnomes are usually neutral good.',
  sizeDescription: 'Gnomes are Small creatures.',
};
