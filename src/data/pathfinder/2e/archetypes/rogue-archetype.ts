import { Archetype } from '../../../../types/character-options/archetypes';

export const rogueArchetype: Archetype = {
  id: 'pf2e-rogue-archetype',
  name: 'Rogue Archetype',
  system: 'pf2e',
  source: 'Core Rulebook',
  parentClassId: 'rogue',
  description: 'A rogue archetype grants additional stealth and deception abilities.',
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
