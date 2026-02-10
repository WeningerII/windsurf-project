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

export const weaponMasterArchetype: CharacterClass = {
  id: 'mam3e-weapon-master',
  name: 'Weapon Master',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: { name: "Mutants & Masterminds Hero's Handbook", page: 1, url: 'https://www.d20herosrd.com/character-creation/archetypes/weapon-master/' },
  hitDie: 'd8',
  primaryAbility: ['dex', 'str'],
  savingThrowProficiencies: ['dex', 'str'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: { count: 3, options: ['athletics', 'acrobatics', 'intimidation'], label: 'Choose class skills' },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        { id: 'signature-weapon', name: 'Signature Weapon', source: 'Weapon Master', description: 'Mastery of a signature weapon or fighting style' },
        { id: 'precision-strikes', name: 'Precision Strikes', source: 'Weapon Master', description: 'Deadly accuracy with chosen weapons' },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A master of weapons and combat techniques with unparalleled skill.',
};
