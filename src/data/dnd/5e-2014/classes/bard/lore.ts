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
          description: 'When you join the College of Lore at 3rd level, you gain proficiency with three skills of your choice.',
        },
        {
          id: 'cutting-words',
          name: 'Cutting Words',
          source: 'College of Lore 3',
          description: 'Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature\'s roll. You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can\'t hear you or if it\'s immune to being charmed.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'additional-magical-secrets',
          name: 'Additional Magical Secrets',
          source: 'College of Lore 6',
          description: 'At 6th level, you learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don\'t count against the number of bard spells you know.',
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
          description: 'Starting at 14th level, when you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the DM tells you whether you succeed or fail.',
        },
      ],
    },
  ],
  
  description: 'Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales. Whether singing folk ballads in taverns or elaborate compositions in royal courts, these bards use their gifts to hold audiences spellbound.',
};
