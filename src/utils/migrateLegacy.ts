import { Character } from '../types/game-systems';
import { CharacterDocument, SystemDataModel } from '../types/core/document';

/**
 * Migrate a legacy Character object to a V2 CharacterDocument.
 *
 * For d20-family systems (5e-2014, 5e-2024, 3.5e, pf1e, pf2e), the legacy
 * Character type already contains the system data as top-level fields.
 * We split it into the document envelope + system payload.
 *
 * For M&M 3e, the legacy Character was always a bad fit (Powers coerced
 * into Spells). We create a minimal M&M document with what we can salvage.
 */
export function migrateLegacyCharacter(char: Character): CharacterDocument<SystemDataModel> {
  // Pull out document-level fields
  const { id, name, system: systemId, createdAt, updatedAt, ...rest } = char;

  if (systemId === 'mam3e') {
    // M&M characters in the legacy format were heavily coerced.
    // We can only salvage the basic identity + attributes.
    return {
      id,
      name,
      systemId,
      createdAt,
      updatedAt,
      system: {
        powerLevel: 10,
        powerPoints: {
          total: 150,
          spent: { abilities: 0, powers: 0, advantages: 0, skills: 0, defenses: 0 },
        },
        abilities: {
          str: rest.baseAttributes?.str ?? 0,
          sta: rest.baseAttributes?.con ?? 0, // CON -> STA is the closest mapping
          agi: rest.baseAttributes?.dex ?? 0, // DEX -> AGI
          dex: 0,
          fgt: 0,
          int: rest.baseAttributes?.int ?? 0,
          awe: rest.baseAttributes?.wis ?? 0, // WIS -> AWE
          pre: rest.baseAttributes?.cha ?? 0, // CHA -> PRE
        },
        defenses: {
          dodge: { rank: 0, total: 0 },
          parry: { rank: 0, total: 0 },
          fortitude: { rank: 0, total: 0 },
          toughness: { rank: 0, total: 0 },
          will: { rank: 0, total: 0 },
        },
        powers: [],
        advantages: [],
        skills: {},
        complications: [],
      },
    };
  }

  // For all d20-family systems, the legacy fields map directly into the system payload.
  // The `rest` object contains level, classLevels, baseAttributes, hitPoints, etc.
  return {
    id,
    name,
    systemId,
    createdAt,
    updatedAt,
    system: rest as unknown as SystemDataModel,
  };
}

/**
 * Migrate an array of legacy characters to V2 documents.
 */
export function migrateLegacyCharacters(chars: Character[]): CharacterDocument<SystemDataModel>[] {
  return chars.map(migrateLegacyCharacter);
}
