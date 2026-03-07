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

export const psychicArchetype: CharacterClass = {
  id: 'mam3e-psychic',
  name: 'Psychic',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/psychic/',
  },
  hitDie: 'd6',
  primaryAbility: ['wis', 'int'],
  savingThrowProficiencies: ['wis', 'dex'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['insight', 'perception'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'telepathy',
          name: 'Telepathy',
          source: 'Psychic',
          description: 'Communicate mind-to-mind with others',
        },
        {
          id: 'psychic-blast',
          name: 'Psychic Blast',
          source: 'Psychic',
          description: 'Attack minds directly with psychic force',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A powerful psychic with telepathy and mental attack powers.',
};
