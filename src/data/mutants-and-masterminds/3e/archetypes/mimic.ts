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

export const mimicArchetype: CharacterClass = {
  id: 'mam3e-mimic',
  name: 'Mimic',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: { name: "Mutants & Masterminds Hero's Handbook", page: 1, url: 'https://www.d20herosrd.com/character-creation/archetypes/mimic/' },
  hitDie: 'd8',
  primaryAbility: ['int', 'cha'],
  savingThrowProficiencies: ['wis', 'dex'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: { count: 3, options: ['deception', 'performance', 'insight'], label: 'Choose class skills' },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        { id: 'power-mimicry', name: 'Power Mimicry', source: 'Mimic', description: 'Copy the powers of others temporarily' },
        { id: 'perfect-impersonation', name: 'Perfect Impersonation', source: 'Mimic', description: 'Duplicate appearance and mannerisms' },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A shapeshifter who can mimic the powers and appearance of others.',
};
