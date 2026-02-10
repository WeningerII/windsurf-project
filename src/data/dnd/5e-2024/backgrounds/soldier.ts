import { Background } from '../../../../types/character-options/backgrounds';

export const soldier: Background = {
  id: 'soldier-2024',
  name: 'Soldier',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  skillProficiencies: ['athletics', 'intimidation'],
  
  toolProficiencies: ['one-gaming-set', 'vehicles-land'],
  
  equipment: [
    'insignia-of-rank',
    'trophy-from-fallen-enemy',
    'gaming-set',
    'common-clothes',
    'pouch',
  ],
  
  gold: 10,
  
  suggestedCharacteristics: {
    traits: ['I\'m always polite and respectful', 'I\'m haunted by memories of war', 'I can stare down a hell hound without flinching', 'I enjoy being strong and like breaking things'],
    ideals: ['Greater Good', 'Responsibility', 'Independence', 'Might'],
    bonds: ['I would still lay down my life for the people I served with', 'Someone saved my life on the battlefield'],
    flaws: ['The monstrous enemy we faced in battle still leaves me quivering with fear', 'I obey the law, even if the law causes misery'],
  },
  
  feature: {
    id: 'military-rank',
    name: 'Military Rank',
    source: 'Soldier Background',
    description: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized.',
  },
  
  description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield.',
};
