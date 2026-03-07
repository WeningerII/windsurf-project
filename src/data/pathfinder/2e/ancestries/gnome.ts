import { Species } from '../../../../types/character-options/species';

export const gnome: Species = {
  id: 'gnome',
  name: 'Gnome',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { con: 2, cha: 2, str: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['dex', 'int', 'wis'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'small',
  speed: 25,

  languages: {
    automatic: ['Common', 'Gnomish', 'Sylvan'],
    choice: {
      count: 0,
      options: ['Draconic', 'Dwarven', 'Elven', 'Goblin', 'Jotun', 'Orcish'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'low-light-vision',
      name: 'Low-Light Vision',
      source: 'Gnome',
      description: 'You can see in dim light as though it were bright light.',
    },
  ],

  subraces: [
    {
      id: 'forest-gnome',
      name: 'Forest Gnome Heritage',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { dex: 2 } }],
      traits: [],
      description:
        'You gain a +1 status bonus to Survival checks in forests and can speak with animals.',
    },
    {
      id: 'rock-gnome',
      name: 'Rock Gnome Heritage',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { con: 2 } }],
      traits: [],
      description:
        'You gain a +1 status bonus to Crafting checks and can use Crafting to create mechanical devices.',
    },
    {
      id: 'tinker-gnome',
      name: 'Tinker Gnome Heritage',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { int: 2 } }],
      traits: [],
      description: 'You gain a +1 status bonus to Arcana checks and can identify magical items.',
    },
    {
      id: 'fey-touched',
      name: 'Fey-Touched Heritage',
      parentSpeciesId: 'gnome',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { cha: 2 } }],
      traits: [],
      description: 'You gain a +1 status bonus to Occultism checks and can cast one fey spell.',
    },
  ],

  description:
    'Long ago, gnomes were fey spirits who emigrated from the First World. While they are no longer truly fey, gnomes retain their fey magic.',
  ageInfo: 'Gnomes reach adulthood at 18 and can live to 400 years or more.',
  alignmentTendency: 'Gnomes are typically good and tend toward chaos.',
  sizeDescription: 'Gnomes are about 3 feet tall and weigh about 40 pounds.',
};
