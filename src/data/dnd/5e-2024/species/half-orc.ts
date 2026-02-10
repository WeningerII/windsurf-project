import { Species } from '../../../../types/character-options/species';

export const halfOrc: Species = {
  id: 'half-orc',
  name: 'Half-Orc',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { str: 2, con: 1 },
    },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Orc'],
  },
  
  traits: [
    {
      id: 'darkvision-half-orc',
      name: 'Darkvision',
      source: 'Half-Orc',
      description: 'You have Darkvision with a range of 60 feet.',
    },
    {
      id: 'adrenaline-rush',
      name: 'Adrenaline Rush',
      source: 'Half-Orc',
      description: 'You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
    },
    {
      id: 'relentless-endurance',
      name: 'Relentless Endurance',
      source: 'Half-Orc',
      description: 'When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can\'t do so again until you finish a Long Rest.',
    },
  ],
  
  description: 'Half-orcs\' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.',
  
  ageInfo: 'Half-orcs mature a little faster than humans, reaching adulthood around age 14. They age noticeably faster and rarely live longer than 75 years.',
  
  alignmentTendency: 'Half-orcs inherit a tendency toward chaos from their orc parents and are not strongly inclined toward good.',
  
  sizeDescription: 'Half-orcs are somewhat larger and bulkier than humans, and they range from 5 to well over 6 feet tall. Your size is Medium.',
};
