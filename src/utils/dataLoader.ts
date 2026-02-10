/**
 * Centralized Data Loader for All Game Systems
 * 
 * Provides async loading functions for game data (spells, classes, equipment, etc.)
 * across multiple RPG systems. Uses dynamic imports for code splitting and lazy loading.
 * 
 * @module dataLoader
 * @example
 * ```typescript
 * const spells = await loadSpells('dnd-5e-2024');
 * const classes = await loadClasses('pf2e');
 * ```
 */

import { GameSystemId } from '../types/game-systems';
import { Spell } from '../types/magic/spells';
import { CharacterClass } from '../types/character-options/classes';
import { Species } from '../types/character-options/species';
import { Monster } from '../types/creatures/monsters';
import { FeatDefinition } from '../types/character-options/feats';
import { Item } from '../types/equipment/items';
import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';
import { OpenContentCategory, filterOpenContentBySource } from './openContentPolicy';

type LoadedEntity = {
  id: string;
};

function dedupeById<T extends LoadedEntity>(items: T[]): T[] {
  const uniqueItems: T[] = [];
  const seen = new Set<string>();

  items.forEach(item => {
    if (seen.has(item.id)) {
      return;
    }
    seen.add(item.id);
    uniqueItems.push(item);
  });

  return uniqueItems;
}

function finalizeLoadedItems<T extends LoadedEntity>(
  systemId: GameSystemId,
  category: OpenContentCategory,
  items: T[]
): T[] {
  const validItems = items.filter(item => typeof item.id === 'string' && item.id.trim().length > 0);
  const uniqueItems = dedupeById(validItems);
  return filterOpenContentBySource(systemId, category, uniqueItems);
}

/**
 * Load all D&D 5e-2024 spells from spell level modules
 * 
 * Dynamically imports cantrips and spell levels 1-9, then aggregates them.
 * Handles both array exports and individual spell exports.
 * 
 * @returns Promise resolving to array of all D&D 5e-2024 spells
 * @private
 */
async function loadDnd5e2024Spells(): Promise<Spell[]> {
  const modules = await Promise.all([
    import('../data/dnd/5e-2024/spells/cantrips'),
    import('../data/dnd/5e-2024/spells/level-1'),
    import('../data/dnd/5e-2024/spells/level-2'),
    import('../data/dnd/5e-2024/spells/level-3'),
    import('../data/dnd/5e-2024/spells/level-4'),
    import('../data/dnd/5e-2024/spells/level-5'),
    import('../data/dnd/5e-2024/spells/level-6'),
    import('../data/dnd/5e-2024/spells/level-7'),
    import('../data/dnd/5e-2024/spells/level-8'),
    import('../data/dnd/5e-2024/spells/level-9'),
  ]);
  
  const spells: Spell[] = [];
  modules.forEach(module => {
    Object.values(module).forEach(value => {
      if (Array.isArray(value)) {
        spells.push(...value);
      } else if (value && typeof value === 'object' && 'id' in value && 'name' in value) {
        spells.push(value as Spell);
      }
    });
  });
  
  return spells;
}

/**
 * Load all D&D 5e-2024 character classes
 * 
 * @returns Promise resolving to array of character classes
 * @private
 */
async function loadDnd5e2024Classes(): Promise<CharacterClass[]> {
  const classModule = await import('../data/dnd/5e-2024/classes');
  const classes = classModule.dnd5e2024Classes || [];
  return classes.filter(c => c && c.id && c.name && c.system);
}

/**
 * Load all D&D 5e-2024 species/races
 * 
 * Deduplicates species by ID to handle both array and individual exports.
 * 
 * @returns Promise resolving to array of species
 * @private
 */
async function loadDnd5e2024Species(): Promise<Species[]> {
  const speciesModule = await import('../data/dnd/5e-2024/species');
  const species = new Map<string, Species>();

  Object.values(speciesModule).forEach(value => {
    if (Array.isArray(value)) {
      value.forEach(entry => {
        if (entry && typeof entry === 'object' && 'id' in entry && 'name' in entry && 'system' in entry) {
          const s = entry as Species;
          species.set(s.id, s);
        }
      });
    } else if (value && typeof value === 'object' && 'id' in value && 'name' in value && 'system' in value) {
      const s = value as Species;
      species.set(s.id, s);
    }
  });
  
  return Array.from(species.values());
}

async function loadDnd5e2024Monsters(): Promise<Monster[]> {
  const monsterModule = await import('../data/dnd/5e-2024/monsters');
  return monsterModule.dnd5e2024Monsters || [];
}

async function loadDnd5e2024Equipment(): Promise<Item[]> {
  const equipModule = await import('../data/dnd/5e-2024/equipment');
  const items = new Map<string, Item>();

  Object.values(equipModule).forEach(value => {
    if (Array.isArray(value)) {
      value.forEach(entry => {
        if (entry && typeof entry === 'object' && 'id' in entry) {
          const item = entry as Item;
          items.set(item.id, item);
        }
      });
    } else if (value && typeof value === 'object' && 'id' in value) {
      const item = value as Item;
      items.set(item.id, item);
    }
  });
  
  return Array.from(items.values());
}

async function loadDnd5e2024Feats(): Promise<FeatDefinition[]> {
  const featModule = await import('../data/dnd/5e-2024/feats');
  const feats = new Map<string, FeatDefinition>();

  Object.values(featModule).forEach(value => {
    if (Array.isArray(value)) {
      value.forEach(entry => {
        if (entry && typeof entry === 'object' && 'id' in entry) {
          const feat = entry as FeatDefinition;
          feats.set(feat.id, feat);
        }
      });
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(inner => {
        if (Array.isArray(inner)) {
          inner.forEach(entry => {
            if (entry && typeof entry === 'object' && 'id' in entry) {
              const feat = entry as FeatDefinition;
              feats.set(feat.id, feat);
            }
          });
        }
      });
    }
  });
  
  return Array.from(feats.values());
}

// D&D 5e-2014 Loaders
async function loadDnd5e2014Spells(): Promise<Spell[]> {
  try {
    const modules = await Promise.all([
      import('../data/dnd/5e-2014/spells/cantrips'),
      import('../data/dnd/5e-2014/spells/level-1'),
      import('../data/dnd/5e-2014/spells/level-2'),
      import('../data/dnd/5e-2014/spells/level-3'),
      import('../data/dnd/5e-2014/spells/level-4'),
      import('../data/dnd/5e-2014/spells/level-5'),
      import('../data/dnd/5e-2014/spells/level-6'),
      import('../data/dnd/5e-2014/spells/level-7'),
      import('../data/dnd/5e-2014/spells/level-8'),
      import('../data/dnd/5e-2014/spells/level-9'),
    ]);
    
    const spells: Spell[] = [];
    modules.forEach(module => {
      Object.values(module).forEach(value => {
        if (Array.isArray(value)) {
          spells.push(...value);
        } else if (value && typeof value === 'object' && 'id' in value && 'name' in value) {
          spells.push(value as Spell);
        }
      });
    });
    
    return spells;
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Failed to load dnd-5e-2014 spells',
      error as Error
    );
    return [];
  }
}

async function loadDnd5e2014Classes(): Promise<CharacterClass[]> {
  const classModule = await import('../data/dnd/5e-2014/classes');
  return classModule.dnd5eClasses || [];
}

async function loadDnd5e2014Species(): Promise<Species[]> {
  const speciesModule = await import('../data/dnd/5e-2014/species');
  return speciesModule.dnd5eSpecies || [];
}

async function loadDnd5e2014Monsters(): Promise<Monster[]> {
  try {
    const monsterModule = await import('../data/dnd/5e-2014/monsters');
    const monsters = monsterModule.dnd5eMonsters || [];
    
    return monsters.filter(m => m && m.id && m.name && m.system === 'dnd-5e-2014');
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.HIGH,
      'Failed to load dnd-5e-2014 monsters',
      error as Error
    );
    return [];
  }
}

async function loadDnd5e2014Equipment(): Promise<Item[]> {
  const equipModule = await import('../data/dnd/5e-2014/equipment');
  return equipModule.dnd5eEquipment || [];
}

async function loadDnd5e2014Feats(): Promise<FeatDefinition[]> {
  return [];
}

// Pathfinder 2e Loaders
async function loadPf2eSpells(): Promise<Spell[]> {
  try {
    const spellModule = await import('../data/pathfinder/2e/spells');
    return spellModule.pf2eSpells || [];
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.MEDIUM,
      'Failed to load pf2e spells',
      error as Error
    );
    return [];
  }
}

async function loadPf2eClasses(): Promise<CharacterClass[]> {
  const classModule = await import('../data/pathfinder/2e/classes');
  return Object.values(classModule.pf2eClasses);
}

async function loadPf2eSpecies(): Promise<Species[]> {
  const ancestryModule = await import('../data/pathfinder/2e/ancestries');
  return Object.values(ancestryModule.pf2eAncestries);
}

async function loadPf2eFeats(): Promise<FeatDefinition[]> {
  const featModule = await import('../data/pathfinder/2e/feats');
  const feats: FeatDefinition[] = [];
  Object.values(featModule).forEach(value => {
    if (Array.isArray(value)) {
      feats.push(...(value as FeatDefinition[]).filter(f => f && f.id && f.name));
    }
  });
  return feats;
}

// D&D 3.5e Loaders
async function loadDnd35eSpells(): Promise<Spell[]> {
  const spellModule = await import('../data/dnd/3.5e/spells');
  return spellModule.dnd35eSpells || [];
}

async function loadDnd35eClasses(): Promise<CharacterClass[]> {
  const classModule = await import('../data/dnd/3.5e/classes');
  return classModule.dnd35eClasses || [];
}

async function loadDnd35eSpecies(): Promise<Species[]> {
  const raceModule = await import('../data/dnd/3.5e/races');
  return raceModule.dnd35eRaces || [];
}

async function loadDnd35eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/dnd/3.5e/equipment');
  const eq = equipModule.dnd35eEquipment;
  const allItems: unknown[] = [
    ...eq.weapons,
    ...eq.armor,
    ...eq.shields,
    ...eq.adventuringGear,
  ];
  return allItems.filter((item: unknown) => {
    const i = item as Record<string, unknown>;
    return i && i.id && i.name;
  }) as Item[];
}

async function loadDnd35eFeats(): Promise<FeatDefinition[]> {
  const featModule = await import('../data/dnd/3.5e/feats');
  const feats = featModule.dnd35eFeats;
  const allFeats: FeatDefinition[] = [
    ...feats.general,
    ...feats.metamagic,
    ...feats.itemCreation,
    ...feats.combat,
    ...feats.skill,
    ...feats.ability,
    ...feats.magic,
  ];
  return allFeats;
}

// Pathfinder 1e Loaders
async function loadPf1eSpells(): Promise<Spell[]> {
  try {
    const spellModule = await import('../data/pathfinder/1e/spells');
    return spellModule.pf1eSpells || [];
  } catch (error) {
    errorLogger.log(
      ErrorCategory.DATA_LOAD,
      ErrorSeverity.MEDIUM,
      'Failed to load pf1e spells',
      error as Error
    );
    return [];
  }
}

async function loadPf1eClasses(): Promise<CharacterClass[]> {
  const classModule = await import('../data/pathfinder/1e/classes');
  return Object.values(classModule.pf1eClasses);
}

async function loadPf1eSpecies(): Promise<Species[]> {
  const raceModule = await import('../data/pathfinder/1e/races');
  return Object.values(raceModule.pf1eRaces);
}

async function loadPf1eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/pathfinder/1e/equipment');
  const allItems: unknown[] = [
    ...Object.values(equipModule.pf1eWeapons || {}),
    ...Object.values(equipModule.pf1eArmor || {}),
    ...Object.values(equipModule.pf1eGear || {}),
    ...(equipModule.pf1eMagicItems || []),
  ];
  return allItems.filter((item: unknown) => {
    const i = item as Record<string, unknown>;
    return i && i.id && i.name;
  }) as Item[];
}

async function loadPf2eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/pathfinder/2e/equipment');
  const allItems: unknown[] = [
    ...Object.values(equipModule.pf2eWeapons || {}),
    ...Object.values(equipModule.pf2eArmor || {}),
    ...Object.values(equipModule.pf2eGear || {}),
    ...(equipModule.pf2eMagicWeapons || []),
    ...(equipModule.pf2eMagicArmor || []),
  ];
  return allItems.filter((item: unknown) => {
    const i = item as Record<string, unknown>;
    return i && i.id && i.name;
  }) as Item[];
}

async function loadPf1eFeats(): Promise<FeatDefinition[]> {
  const featModule = await import('../data/pathfinder/1e/feats');
  const feats = featModule.pf1eFeats;
  const allFeats: FeatDefinition[] = [
    ...feats.combat,
    ...feats.metamagic,
    ...feats.general,
    ...feats.racial,
    ...feats.class,
    ...feats.magic,
    ...feats.ability,
    ...feats.divine,
    ...feats.teamwork,
  ];
  return allFeats;
}

// M&M 3e Loaders
async function loadMam3ePowers(): Promise<Spell[]> {
  const powerModule = await import('../data/mutants-and-masterminds/3e/powers');
  const powers: Spell[] = [];
  
  Object.values(powerModule).forEach(value => {
    if (Array.isArray(value)) {
      const validPowers = (value as unknown as Spell[]).filter(p => p && p.id && p.name);
      powers.push(...validPowers);
    } else if (value && typeof value === 'object' && 'id' in value && 'name' in value) {
      powers.push(value as unknown as Spell);
    }
  });
  
  return powers;
}

async function loadMam3eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/mutants-and-masterminds/3e/equipment');
  const allItems: unknown[] = [];
  Object.values(equipModule).forEach(value => {
    if (Array.isArray(value)) {
      allItems.push(...value);
    }
  });
  return allItems.filter((item: unknown) => {
    const i = item as Record<string, unknown>;
    return i && i.id && i.name;
  }) as Item[];
}

// Main Loader Functions

/**
 * Load all spells for a given game system
 * 
 * Dynamically imports and aggregates spell data for the specified system.
 * Returns empty array for systems without spell data.
 * 
 * @param systemId - The game system identifier (e.g., 'dnd-5e-2024', 'pf2e')
 * @returns Promise resolving to array of spells for the system
 * 
 * @example
 * ```typescript
 * const spells = await loadSpellsForSystem('dnd-5e-2024');
 * console.log(`Loaded ${spells.length} spells`);
 * ```
 */
export async function loadSpellsForSystem(systemId: GameSystemId): Promise<Spell[]> {
  let spells: Spell[];

  switch (systemId) {
    case 'dnd-5e-2024':
      spells = await loadDnd5e2024Spells();
      break;
    case 'dnd-5e-2014':
      spells = await loadDnd5e2014Spells();
      break;
    case 'pf2e':
      spells = await loadPf2eSpells();
      break;
    case 'dnd-3.5e':
      spells = await loadDnd35eSpells();
      break;
    case 'pf1e':
      spells = await loadPf1eSpells();
      break;
    case 'mam3e':
      spells = await loadMam3ePowers();
      break;
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'spells', spells);
}

/**
 * Load all character classes for a given game system
 * 
 * @param systemId - The game system identifier
 * @returns Promise resolving to array of character classes
 * 
 * @example
 * ```typescript
 * const classes = await loadClassesForSystem('pf2e');
 * ```
 */
export async function loadClassesForSystem(systemId: GameSystemId): Promise<CharacterClass[]> {
  let classes: CharacterClass[];

  switch (systemId) {
    case 'dnd-5e-2024':
      classes = await loadDnd5e2024Classes();
      break;
    case 'dnd-5e-2014':
      classes = await loadDnd5e2014Classes();
      break;
    case 'pf2e':
      classes = await loadPf2eClasses();
      break;
    case 'dnd-3.5e':
      classes = await loadDnd35eClasses();
      break;
    case 'pf1e':
      classes = await loadPf1eClasses();
      break;
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'classes', classes);
}

/**
 * Load all species/races for a given game system
 * 
 * Only available for D&D systems. Returns empty array for other systems.
 * 
 * @param systemId - The game system identifier
 * @returns Promise resolving to array of species
 */
export async function loadSpeciesForSystem(systemId: GameSystemId): Promise<Species[]> {
  let species: Species[];

  switch (systemId) {
    case 'dnd-5e-2024':
      species = await loadDnd5e2024Species();
      break;
    case 'dnd-5e-2014':
      species = await loadDnd5e2014Species();
      break;
    case 'dnd-3.5e':
      species = await loadDnd35eSpecies();
      break;
    case 'pf1e':
      species = await loadPf1eSpecies();
      break;
    case 'pf2e':
      species = await loadPf2eSpecies();
      break;
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'species', species);
}

/**
 * Load all monsters for a given game system
 * 
 * Currently only available for D&D 5e systems.
 * 
 * @param systemId - The game system identifier
 * @returns Promise resolving to array of monsters
 */
export async function loadMonstersForSystem(systemId: GameSystemId): Promise<Monster[]> {
  let monsters: Monster[];

  switch (systemId) {
    case 'dnd-5e-2024':
      monsters = await loadDnd5e2024Monsters();
      break;
    case 'dnd-5e-2014':
      monsters = await loadDnd5e2014Monsters();
      break;
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'monsters', monsters);
}

/**
 * Load all equipment items for a given game system
 * 
 * Includes weapons, armor, gear, and magic items.
 * 
 * @param systemId - The game system identifier
 * @returns Promise resolving to array of equipment items
 */
export async function loadEquipmentForSystem(systemId: GameSystemId): Promise<Item[]> {
  let equipment: Item[];

  switch (systemId) {
    case 'dnd-5e-2024':
      equipment = await loadDnd5e2024Equipment();
      break;
    case 'dnd-5e-2014':
      equipment = await loadDnd5e2014Equipment();
      break;
    case 'dnd-3.5e':
      equipment = await loadDnd35eEquipment();
      break;
    case 'pf1e':
      equipment = await loadPf1eEquipment();
      break;
    case 'pf2e':
      equipment = await loadPf2eEquipment();
      break;
    case 'mam3e':
      equipment = await loadMam3eEquipment();
      break;
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'equipment', equipment);
}

/**
 * Load all feats for a given game system
 * 
 * Currently only available for D&D 5e systems.
 * 
 * @param systemId - The game system identifier
 * @returns Promise resolving to array of feat definitions
 */
export async function loadFeatsForSystem(systemId: GameSystemId): Promise<FeatDefinition[]> {
  let feats: FeatDefinition[];

  switch (systemId) {
    case 'dnd-5e-2024':
      feats = await loadDnd5e2024Feats();
      break;
    case 'dnd-5e-2014':
      feats = await loadDnd5e2014Feats();
      break;
    case 'dnd-3.5e':
      feats = await loadDnd35eFeats();
      break;
    case 'pf1e':
      feats = await loadPf1eFeats();
      break;
    case 'pf2e':
      feats = await loadPf2eFeats();
      break;
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'feats', feats);
}
