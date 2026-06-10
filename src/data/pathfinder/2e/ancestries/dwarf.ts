import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { con: 2, wis: 2, cha: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['str', 'dex', 'int'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'medium',
  speed: 20,

  languages: {
    automatic: ['Common', 'Dwarven'],
    choice: {
      count: 0,
      options: ['Gnomish', 'Goblin', 'Jotun', 'Orcish', 'Terran', 'Undercommon'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'darkvision',
      name: 'Darkvision',
      source: 'Dwarf',
      description:
        'You can see in darkness and dim light just as well as you can see in bright light.',
    },
    {
      id: 'clan-dagger',
      name: 'Clan Dagger',
      source: 'Dwarf',
      description: 'You get one clan dagger for free, as it was given to you at birth.',
    },
  ],

  // CRB heritages. PF2e heritages never grant ability boosts (those come from
  // the ancestry itself) — each grants the feature in its description, so
  // abilityScoreIncrease is truthfully empty on every entry.
  subraces: [
    {
      id: 'ancient-blooded',
      name: 'Ancient-Blooded Dwarf',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain the Call on Ancient Blood reaction: when you attempt a saving throw against a magical effect, you gain a +1 circumstance bonus to the save until the end of the encounter.',
    },
    {
      id: 'death-warden',
      name: 'Death Warden Dwarf',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'When you roll a success on a saving throw against a necromancy effect, you get a critical success instead.',
    },
    {
      id: 'forge',
      name: 'Forge Dwarf',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain fire resistance equal to half your level (minimum 1), and you treat environmental heat effects as if they were one step less extreme.',
    },
    {
      id: 'rock',
      name: 'Rock Dwarf',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain a +2 circumstance bonus to your Fortitude or Reflex DC against attempts to Shove or Trip you, and against effects that would force you to move or knock you prone.',
    },
    {
      id: 'strong-blooded',
      name: 'Strong-Blooded Dwarf',
      parentSpeciesId: 'dwarf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain poison resistance equal to half your level (minimum 1), and each successful saving throw you make against an ongoing poison reduces its stage by 2 (or 1 for a virulent poison).',
    },
  ],

  description:
    'Dwarves have a well-earned reputation as a stoic and stern people, ensconced within citadels and cities carved from solid rock.',
  ageInfo: 'Dwarves are considered young until age 25 and can live to around 350 years old.',
  alignmentTendency: 'Dwarves tend toward lawful alignments.',
  sizeDescription: 'Dwarves are about a foot shorter than most humans.',
};
