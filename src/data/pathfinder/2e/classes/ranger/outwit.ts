import { Subclass } from '../../../../../types/character-options/classes';

export const outwitSubclass: Subclass = {
  id: 'pf2e-ranger-outwit',
  name: 'Outwit',
  parentClassId: 'ranger',
  description: 'A ranger who uses knowledge and tactics to gain advantages over their prey, exploiting weaknesses and predicting movements.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'outwit-edge',
          name: 'Outwit Edge',
          source: 'Ranger 1',
          description: 'When you successfully Recall Knowledge about your hunted prey, you gain a +2 circumstance bonus to your next attack roll against them. Your hunted prey is flat-footed to you.',
        },
        {
          id: 'tactical-advantage',
          name: 'Tactical Advantage',
          source: 'Ranger 1',
          description: 'You excel at using your knowledge to gain advantages. You can use Recall Knowledge as a free action once per round.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'outwit-4',
          name: 'Predictive Strike',
          source: 'Ranger 4',
          description: 'You anticipate your prey\'s movements. When your hunted prey uses a move action, you can use a reaction to Step.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'outwit-8',
          name: 'Exploit Weakness',
          source: 'Ranger 8',
          description: 'You know how to exploit your prey\'s vulnerabilities. Your attacks against your hunted prey ignore 5 points of resistance.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'outwit-12',
          name: 'Master Tactician',
          source: 'Ranger 12',
          description: 'Your tactical knowledge is unmatched. You can use Recall Knowledge about your hunted prey as a free action at the start of each of your turns.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'outwit-16',
          name: 'Legendary Outwit',
          source: 'Ranger 16',
          description: 'You can predict your prey\'s every move. Your hunted prey is always flat-footed to you, and you gain a +3 circumstance bonus to attack rolls against them.',
        },
      ],
    },
  ],
};
