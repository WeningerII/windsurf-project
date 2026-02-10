import { Background } from '../../../../types/character-options/backgrounds';

export const criminal: Background = {
  id: 'criminal-2024',
  name: 'Criminal',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  skillProficiencies: ['deception', 'stealth'],
  
  toolProficiencies: ['thieves-tools', 'one-gaming-set'],
  
  equipment: [
    'crowbar',
    'dark-common-clothes-with-hood',
    'pouch',
  ],
  
  gold: 15,
  
  suggestedCharacteristics: {
    traits: ['I always have a plan for what to do when things go wrong', 'I am always calm', 'The first thing I do in a new place is note the locations of everything valuable'],
    ideals: ['Honor', 'Freedom', 'Charity', 'Greed'],
    bonds: ['I\'m trying to pay off an old debt', 'My ill-gotten gains go to support my family'],
    flaws: ['When I see something valuable, I can\'t think about anything but how to steal it', 'I turn tail and run when things look bad'],
  },
  
  feature: {
    id: 'criminal-contact',
    name: 'Criminal Contact',
    source: 'Criminal Background',
    description: 'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.',
  },
  
  description: 'You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld.',
};
