import { Subclass } from '../../../../../types/character-options/classes';

export const aberrantBloodlineSubclass: Subclass = {
  id: 'pf2e-sorcerer-aberrant',
  name: 'Aberrant Bloodline',
  parentClassId: 'sorcerer',
  description: 'A sorcerer whose magic stems from aberrant creatures, granting strange and unsettling powers.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'aberrant-bloodline-1',
          name: 'Aberrant Bloodline',
          source: 'Sorcerer 1',
          description: 'Your bloodline grants you resistance 5 to mental damage. You gain the Tentacular Limbs ability, allowing you to extend writhing appendages to manipulate objects at range.',
        },
        {
          id: 'tentacular-limbs',
          name: 'Tentacular Limbs',
          source: 'Sorcerer 1',
          description: 'You can extend writhing appendages to manipulate objects within 10 feet as if you were adjacent to them.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'aberrant-bloodline-3',
          name: 'Aberrant Whispers',
          source: 'Sorcerer 3',
          description: 'You can project disturbing whispers into the minds of nearby creatures. Enemies within 30 feet take a -1 penalty to Will saves.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'aberrant-bloodline-7',
          name: 'Alien Anatomy',
          source: 'Sorcerer 7',
          description: 'Your body becomes increasingly alien. You gain darkvision 60 feet and your resistance to mental damage increases to 10.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'aberrant-bloodline-13',
          name: 'Warped Form',
          source: 'Sorcerer 13',
          description: 'You can twist your form in unnatural ways. You gain a climb speed equal to your land speed and can squeeze through spaces as if you were two sizes smaller.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'aberrant-bloodline-17',
          name: 'Aberrant Form',
          source: 'Sorcerer 17',
          description: 'Once per day, you can transform into an aberrant form for 1 minute. You gain tentacle attacks, telepathy 100 feet, and immunity to mental damage.',
        },
      ],
    },
  ],
};
