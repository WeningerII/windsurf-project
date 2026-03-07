/**
 * Mutants & Masterminds 3e - Archetypes
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: Hero's Handbook (d20herosrd.com)
 * License: OGL v1.0a
 */

import { CharacterClass } from '../../../../types/character-options/classes';

export const warriorArchetype: CharacterClass = {
  id: 'mam3e-warrior',
  name: 'Warrior',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/warrior/',
  },
  hitDie: 'd10',
  primaryAbility: ['str', 'dex'],
  savingThrowProficiencies: ['str', 'dex'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 3,
    options: ['athletics', 'intimidation', 'perception'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'combat-mastery',
          name: 'Combat Mastery',
          source: 'Warrior',
          description: 'Superior combat skills and tactics',
        },
        {
          id: 'weapon-expertise',
          name: 'Weapon Expertise',
          source: 'Warrior',
          description: 'Expert proficiency with all weapons',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A skilled combatant trained in weapons, tactics, and warfare.',
};
