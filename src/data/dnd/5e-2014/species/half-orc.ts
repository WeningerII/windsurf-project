import { Species } from '../../../../types/character-options/species';

export const halfOrc: Species = {
  id: 'half-orc',
  name: 'Half-Orc',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: {
        str: 2,
        con: 1,
      },
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
      description: 'Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.',
    },
    {
      id: 'menacing',
      name: 'Menacing',
      source: 'Half-Orc',
      description: 'You gain proficiency in the Intimidation skill.',
    },
    {
      id: 'relentless-endurance',
      name: 'Relentless Endurance',
      source: 'Half-Orc',
      description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.',
      uses: {
        current: 1,
        max: 1,
        recoveryType: 'long-rest',
      },
    },
    {
      id: 'savage-attacks',
      name: 'Savage Attacks',
      source: 'Half-Orc',
      description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.',
    },
  ],
  
  description: 'Some half-orcs rise to become proud leaders of orc communities. Some venture into the world to prove their worth. Many of these become adventurers, achieving greatness for their mighty deeds.',
  
  ageInfo: 'Half-orcs mature a little faster than humans, reaching adulthood around age 14. They age noticeably faster and rarely live longer than 75 years.',
  
  alignmentTendency: 'Half-orcs inherit a tendency toward chaos from their orc parents and are not strongly inclined toward good.',
  
  sizeDescription: 'Half-orcs are somewhat larger and bulkier than humans, and they range from 5 to well over 6 feet tall. Your size is Medium.',
};
