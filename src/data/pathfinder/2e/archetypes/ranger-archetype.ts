import { Archetype } from '../../../../types/character-options/archetypes';

export const rangerArchetype: Archetype = {
  id: 'pf2e-ranger-archetype',
  name: 'Ranger Archetype',
  system: 'pf2e',
  source: 'Core Rulebook',
  parentClassId: 'ranger',
  description: 'A ranger archetype grants additional tracking and hunting abilities.',
  features: [
    {
      level: 1,
      name: 'Archetype Dedication',
      description: 'You gain the benefits of your chosen archetype.',
    },
    {
      level: 2,
      name: 'Archetype Ability',
      description: 'You gain an additional ability from your archetype.',
    },
  ],
};
