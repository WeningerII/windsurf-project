import { Archetype } from '../../../../types/character-options/archetypes';

export const wizardArchetype: Archetype = {
  id: 'pf2e-wizard-archetype',
  name: 'Wizard Archetype',
  system: 'pf2e',
  source: 'Core Rulebook',
  parentClassId: 'wizard',
  description: 'A wizard archetype grants additional magical abilities and spellcasting options.',
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
