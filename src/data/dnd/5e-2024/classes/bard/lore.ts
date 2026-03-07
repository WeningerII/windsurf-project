import { Subclass } from '../../../../../types/character-options/classes';

export const loreSubclass: Subclass = {
  id: 'lore',
  name: 'College of Lore',
  parentClassId: 'bard',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'bonus-proficiencies-lore',
          name: 'Bonus Proficiencies',
          source: 'College of Lore 3',
          description: 'You gain proficiency with three skills of your choice.',
        },
        {
          id: 'cutting-words',
          name: 'Cutting Words',
          source: 'College of Lore 3',
          description:
            "When a creature that you can see within 60 feet of you makes an attack roll or an ability check, you can use your Reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll. You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails. The creature is immune if it can't hear you or if it's immune to the Charmed condition.",
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'magical-discoveries',
          name: 'Magical Discoveries',
          source: 'College of Lore 6',
          description:
            "You learn two spells of your choice from the Wizard, Druid, or Cleric spell lists. The chosen spells count as Bard spells for you but don't count against the number of Bard spells you know.",
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'peerless-skill',
          name: 'Peerless Skill',
          source: 'College of Lore 14',
          description:
            'When you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the d20, but before the DM tells you whether you succeed or fail. If you fail the check, the Bardic Inspiration use is not expended.',
        },
      ],
    },
  ],

  description:
    'Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales.',
};
