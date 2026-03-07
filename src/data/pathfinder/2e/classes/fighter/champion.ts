import { Subclass } from '../../../../../types/character-options/classes';

export const championSubclass: Subclass = {
  id: 'pf2e-fighter-champion',
  name: 'Champion',
  parentClassId: 'fighter',

  features: [
    {
      level: 1,
      features: [
        {
          id: 'champion-dedication',
          name: 'Champion Dedication',
          source: 'Fighter 1',
          description:
            "You dedicate yourself to a cause, becoming a champion of your deity or ideal. You gain a champion's reaction and access to champion feats.",
        },
        {
          id: 'champion-reaction',
          name: "Champion's Reaction",
          source: 'Fighter 1',
          description:
            "You gain the Deific Weapon reaction, allowing you to protect an ally with your deity's power.",
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'champion-feat-2',
          name: 'Champion Feat',
          source: 'Fighter 2',
          description:
            'You gain a champion feat. You can select from feats that grant you champion abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'champion-feat-4',
          name: 'Champion Feat',
          source: 'Fighter 4',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'champion-feat-6',
          name: 'Champion Feat',
          source: 'Fighter 6',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'champion-feat-8',
          name: 'Champion Feat',
          source: 'Fighter 8',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'champion-feat-10',
          name: 'Champion Feat',
          source: 'Fighter 10',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'champion-feat-12',
          name: 'Champion Feat',
          source: 'Fighter 12',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'champion-feat-14',
          name: 'Champion Feat',
          source: 'Fighter 14',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'champion-feat-16',
          name: 'Champion Feat',
          source: 'Fighter 16',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'champion-feat-18',
          name: 'Champion Feat',
          source: 'Fighter 18',
          description: 'You gain another champion feat.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'champion-feat-20',
          name: 'Champion Feat',
          source: 'Fighter 20',
          description: 'You gain another champion feat.',
        },
      ],
    },
  ],

  description: 'A champion dedicated to a cause, deity, or ideal, wielding divine power in combat.',
};
