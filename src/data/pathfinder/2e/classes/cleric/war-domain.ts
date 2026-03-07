import { Subclass } from '../../../../../types/character-options/classes';

export const warDomainSubclass: Subclass = {
  id: 'pf2e-cleric-war',
  name: 'War Domain',
  parentClassId: 'cleric',
  description:
    'A cleric devoted to a deity of war, gaining martial prowess and the ability to inspire allies in battle.',

  features: [
    {
      level: 1,
      features: [
        {
          id: 'war-domain-1',
          name: 'War Domain',
          source: 'Cleric 1',
          description:
            'You gain proficiency with martial weapons and heavy armor. You can use your Wisdom modifier instead of Strength for attack and damage rolls with melee weapons.',
        },
        {
          id: 'battle-blessing',
          name: 'Battle Blessing',
          source: 'Cleric 1',
          description:
            'You can grant yourself or an ally within 30 feet a +2 status bonus to attack rolls for 1 round. You can use this a number of times per day equal to your Wisdom modifier.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'war-domain-4',
          name: 'Divine Strike',
          source: 'Cleric 4',
          description:
            'Once per turn when you hit with a weapon attack, you can deal an extra 1d8 damage. This increases to 2d8 at 11th level and 3d8 at 17th level.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'war-domain-8',
          name: 'War Priest',
          source: 'Cleric 8',
          description:
            'You can make weapon attacks as part of casting a spell. When you cast a spell with a casting time of 2 actions, you can make one weapon Strike as part of the casting.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'war-domain-14',
          name: 'Avatar of Battle',
          source: 'Cleric 14',
          description:
            'You gain resistance 10 to physical damage while you have a divine spell active. You also gain a +2 status bonus to saving throws against fear effects.',
        },
      ],
    },
  ],
};
