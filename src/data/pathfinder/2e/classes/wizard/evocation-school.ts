import { Subclass } from '../../../../../types/character-options/classes';

export const evocationSchoolSubclass: Subclass = {
  id: 'pf2e-wizard-evocation',
  name: 'School of Evocation',
  parentClassId: 'wizard',
  description:
    'A wizard who specializes in evocation magic, focusing on spells that create powerful elemental effects and deal damage.',

  features: [
    {
      level: 1,
      features: [
        {
          id: 'evocation-specialization',
          name: 'Evocation Specialization',
          source: 'Wizard 1',
          description:
            'You can prepare one extra evocation spell of each spell level. You gain a +1 circumstance bonus to spell attack rolls and spell DCs for evocation spells.',
        },
        {
          id: 'force-bolt',
          name: 'Force Bolt',
          source: 'Wizard 1',
          description:
            'You can cast a special cantrip that deals 1d4+1 force damage. This increases by 1d4 at 5th, 11th, and 17th levels.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'energy-absorption',
          name: 'Energy Absorption',
          source: 'Wizard 4',
          description:
            'When you successfully save against an evocation spell, you absorb some of its energy. You gain temporary HP equal to the spell level.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'overwhelming-energy',
          name: 'Overwhelming Energy',
          source: 'Wizard 8',
          description:
            'Your evocation spells ignore 5 points of energy resistance. This increases to 10 at 14th level and 15 at 20th level.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'empowered-evocation',
          name: 'Empowered Evocation',
          source: 'Wizard 12',
          description:
            'When you cast an evocation spell that deals damage, you can add your Intelligence modifier to one damage roll of the spell.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'spell-reflection',
          name: 'Spell Reflection',
          source: 'Wizard 16',
          description:
            'Once per day, when you successfully save against a spell, you can reflect it back at the caster as a reaction.',
        },
      ],
    },
  ],
};
