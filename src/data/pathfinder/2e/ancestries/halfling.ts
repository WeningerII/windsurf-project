import { Species } from '../../../../types/character-options/species';

export const halfling: Species = {
  id: 'halfling',
  name: 'Halfling',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, wis: 2, str: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['con', 'int', 'cha'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'small',
  speed: 25,

  languages: {
    automatic: ['Common', 'Halfling'],
    choice: {
      count: 0,
      options: ['Dwarven', 'Elven', 'Gnomish', 'Goblin'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'keen-eyes',
      name: 'Keen Eyes',
      source: 'Halfling',
      description:
        'Your eyes are sharp, letting you make out small details. You gain a +2 circumstance bonus to Perception to Seek.',
    },
  ],

  // CRB heritages. PF2e heritages never grant ability boosts (those come from
  // the ancestry itself) — each grants the feature in its description, so
  // abilityScoreIncrease is truthfully empty on every entry.
  subraces: [
    {
      id: 'gutsy',
      name: 'Gutsy Halfling',
      parentSpeciesId: 'halfling',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'When you roll a success on a saving throw against an emotion effect, you get a critical success instead.',
    },
    {
      id: 'hillock',
      name: 'Hillock Halfling',
      parentSpeciesId: 'halfling',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'When you regain Hit Points overnight or from Treat Wounds, you regain additional Hit Points equal to your level.',
    },
    {
      id: 'nomadic',
      name: 'Nomadic Halfling',
      parentSpeciesId: 'halfling',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You know two additional languages, and you learn another language each time you become expert, master, or legendary in Society.',
    },
    {
      id: 'twilight',
      name: 'Twilight Halfling',
      parentSpeciesId: 'halfling',
      abilityScoreIncrease: [],
      traits: [],
      description: 'You gain low-light vision.',
    },
    {
      id: 'wildwood',
      name: 'Wildwood Halfling',
      parentSpeciesId: 'halfling',
      abilityScoreIncrease: [],
      traits: [],
      description: 'You ignore difficult terrain from trees, foliage, and undergrowth.',
    },
  ],

  description:
    'Halflings are a short, adaptable people who exhibit remarkable curiosity and luck. Many are nomadic, wandering in small groups.',
  ageInfo: 'Halflings reach adulthood at 20 and can live to 150 years.',
  alignmentTendency: 'Halflings are loyal to friends but not much concerned with broader ethics.',
  sizeDescription: 'Halflings are about 3 feet tall and weigh about 50 pounds.',
};
