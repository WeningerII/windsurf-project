import { Subclass } from '../../../../../types/character-options/classes';

export const knowledgeDomainSubclass: Subclass = {
  id: 'pf2e-cleric-knowledge',
  name: 'Knowledge Domain',
  parentClassId: 'cleric',
  description: 'A cleric devoted to a deity of knowledge, gaining enhanced mental abilities and access to hidden lore.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'knowledge-domain-1',
          name: 'Knowledge Domain',
          source: 'Cleric 1',
          description: 'You gain proficiency in two additional skills of your choice. You can use your Wisdom modifier for Intelligence-based skill checks.',
        },
        {
          id: 'knowledge-blessing',
          name: 'Knowledge Blessing',
          source: 'Cleric 1',
          description: 'You can grant yourself or an ally within 30 feet a +2 status bonus to a skill check or saving throw. You can use this a number of times per day equal to your Wisdom modifier.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'knowledge-domain-4',
          name: 'Read Thoughts',
          source: 'Cleric 4',
          description: 'You can read the surface thoughts of a creature within 60 feet. The target must succeed at a Will save or you learn its immediate intentions and surface thoughts.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'knowledge-domain-8',
          name: 'Visions of the Past',
          source: 'Cleric 8',
          description: 'You can see visions of events that occurred in your current location within the past day. You can use this ability once per day.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'knowledge-domain-14',
          name: 'Master of Knowledge',
          source: 'Cleric 14',
          description: 'You automatically succeed at Recall Knowledge checks for information you could reasonably know. You also gain telepathy 60 feet.',
        },
      ],
    },
  ],
};
