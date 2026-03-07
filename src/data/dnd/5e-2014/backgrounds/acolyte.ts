import { Background } from '../../../../types/character-options/backgrounds';

export const acolyte: Background = {
  id: 'acolyte',
  name: 'Acolyte',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  skillProficiencies: ['insight', 'religion'],

  languageProficiencies: {
    count: 2,
    options: ['any'],
    label: 'Two languages of your choice',
  },

  equipment: [
    'holy-symbol',
    'prayer-book',
    'incense-sticks-5',
    'vestments',
    'common-clothes',
    'pouch',
  ],

  gold: 15,

  suggestedCharacteristics: {
    traits: [
      'I idolize a particular hero of my faith',
      'I can find common ground between enemies',
      'I see omens in every event',
      'Nothing can shake my optimism',
    ],
    ideals: ['Tradition', 'Charity', 'Change', 'Power'],
    bonds: [
      'I would die to recover an ancient relic of my faith',
      'I owe my life to the priest who took me in',
    ],
    flaws: [
      'I judge others harshly',
      'I put too much trust in those who wield power within my temple',
    ],
  },

  feature: {
    id: 'shelter-of-the-faithful',
    name: 'Shelter of the Faithful',
    source: 'Acolyte Background',
    description:
      'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith. Those who share your religion will support you at a modest lifestyle.',
  },

  description:
    'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine.',
};
