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

export const gadgeteerArchetype: CharacterClass = {
  id: 'mam3e-gadgeteer',
  name: 'Gadgeteer',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: { name: "Mutants & Masterminds Hero's Handbook", page: 1, url: 'https://www.d20herosrd.com/character-creation/archetypes/gadgeteer/' },
  hitDie: 'd8',
  primaryAbility: ['int', 'dex'],
  savingThrowProficiencies: ['int', 'dex'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: { count: 3, options: ['crafting', 'investigation', 'technology'], label: 'Choose class skills' },
  equipmentChoices: [],
  startingGold: { dice: '2d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        { id: 'device-creation', name: 'Device Creation', source: 'Gadgeteer', description: 'Create technological devices' },
        { id: 'technopathy', name: 'Technopathy', source: 'Gadgeteer', description: 'Control technology mentally' },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A brilliant inventor. Gadgeteers create powerful devices to fight crime.',
};
