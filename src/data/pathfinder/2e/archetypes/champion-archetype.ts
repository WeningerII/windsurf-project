import { Archetype } from '../../../../types/character-options/archetypes';

export const championArchetype: Archetype = {
  id: 'pf2e-champion-archetype',
  name: 'Champion Archetype',
  system: 'pf2e',
  source: 'Core Rulebook',
  parentClassId: 'champion',
  description: 'A champion archetype grants additional powers and abilities.',
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
