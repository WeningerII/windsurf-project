import { Archetype } from '../../../../types/character-options/archetypes';

export const clericArchetype: Archetype = {
  id: 'pf2e-cleric-archetype',
  name: 'Cleric Archetype',
  system: 'pf2e',
  source: 'Core Rulebook',
  parentClassId: 'cleric',
  description: 'A cleric archetype grants additional divine powers and healing abilities.',
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
