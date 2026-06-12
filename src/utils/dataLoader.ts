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
import type { Advantage } from '../types/mam/advantages';
import type { Mam3eArchetype } from '../types/mam/archetypes';
import { Spell } from '../types/magic/spells';
import { CharacterClass } from '../types/character-options/classes';
import { Species } from '../types/character-options/species';
import { Background } from '../types/character-options/backgrounds';
import type { Archetype } from '../types/character-options/archetypes';
import type { Dnd5eFeatureOptionDefinition } from '../types/character-options/feature-options';
import { Monster } from '../types/creatures/monsters';
import { FeatDefinition } from '../types/character-options/feats';
import { Item } from '../types/equipment/items';
import type { Pf2eBackgroundDefinition } from '../data/pathfinder/2e/backgrounds';
import type { Complication } from '../data/mutants-and-masterminds/3e/complications';
import type { PowerModifier } from '../data/mutants-and-masterminds/3e/modifiers/extras';
import type { Pf1eTrait } from '../systems/pf1e/data-model';
import type {
  DaggerheartAncestry,
  DaggerheartArmor,
  DaggerheartClass,
  DaggerheartConsumable,
  DaggerheartCommunity,
  DaggerheartDomain,
  DaggerheartDomainCard,
  DaggerheartLoot,
  DaggerheartWeapon,
} from '../types/daggerheart';
import { errorLogger, ErrorCategory, ErrorSeverity } from './errorLogger';
import { loadDnd5e2014FeatureOptions } from './dnd5eFeatureOptions';
import { dedupeById } from './indexById';
import { OpenContentCategory, filterOpenContentBySource } from './openContentPolicy';

type LoadedEntity = {
  id: string;
};

function finalizeLoadedItems<T extends LoadedEntity>(
  systemId: GameSystemId,
  category: OpenContentCategory,
  items: T[]
): T[] {
  const validItems = items.filter(
    (item) => typeof item.id === 'string' && item.id.trim().length > 0
  );
  // First entry wins; duplicates dev-warn via the shared helper.
  const uniqueItems = dedupeById(validItems, `dataLoader:${systemId}:${category}`);
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
  const spellModule = await import('../data/dnd/5e-2024/spells');
  return spellModule.allSpells || spellModule.dnd5e2024AllSpells || [];
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
  return classes.filter((c) => c && c.id && c.name && c.system);
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

  Object.values(speciesModule).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (
          entry &&
          typeof entry === 'object' &&
          'id' in entry &&
          'name' in entry &&
          'system' in entry
        ) {
          const s = entry as Species;
          species.set(s.id, s);
        }
      });
    } else if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      'name' in value &&
      'system' in value
    ) {
      const s = value as Species;
      species.set(s.id, s);
    }
  });

  return Array.from(species.values());
}

async function loadDnd5e2024Backgrounds(): Promise<Background[]> {
  const backgroundModule = await import('../data/dnd/5e-2024/backgrounds');
  return backgroundModule.dnd5e2024Backgrounds || [];
}

async function loadDnd5e2024Monsters(): Promise<Monster[]> {
  const monsterModule = await import('../data/dnd/5e-2024/monsters');
  return monsterModule.dnd5e2024Monsters || [];
}

async function loadDnd5e2024Equipment(): Promise<Item[]> {
  const equipModule = await import('../data/dnd/5e-2024/equipment');
  const items = new Map<string, Item>();

  Object.values(equipModule).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
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

  Object.values(featModule).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry && typeof entry === 'object' && 'id' in entry) {
          const feat = entry as FeatDefinition;
          feats.set(feat.id, feat);
        }
      });
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach((inner) => {
        if (Array.isArray(inner)) {
          inner.forEach((entry) => {
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
    const spellModule = await import('../data/dnd/5e-2014/spells');
    return spellModule.allSpells || spellModule.dnd5eSpells || [];
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

async function loadDnd5e2014Backgrounds(): Promise<Background[]> {
  const backgroundModule = await import('../data/dnd/5e-2014/backgrounds');
  return backgroundModule.dnd5eBackgrounds || [];
}

async function loadDnd5e2014Monsters(): Promise<Monster[]> {
  try {
    const monsterModule = await import('../data/dnd/5e-2014/monsters');
    const monsters = monsterModule.dnd5eMonsters || [];

    return monsters.filter((m) => m && m.id && m.name && m.system === 'dnd-5e-2014');
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
  const featModule = await import('../data/dnd/5e-2014/feats');
  return featModule.dnd5e2014Feats || [];
}

// Pathfinder 2e Loaders
async function loadPf2eSpells(): Promise<Spell[]> {
  try {
    const spellModule = await import('../data/pathfinder/2e/spells');
    return spellModule.allSpells || spellModule.pf2eSpells || [];
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
  Object.values(featModule).forEach((value) => {
    if (Array.isArray(value)) {
      feats.push(...(value as FeatDefinition[]).filter((f) => f && f.id && f.name));
    }
  });
  return feats;
}

async function loadPf2eBackgrounds(): Promise<Pf2eBackgroundDefinition[]> {
  const backgroundModule = await import('../data/pathfinder/2e/backgrounds');
  return backgroundModule.pf2eBackgrounds || [];
}

async function loadPf2eArchetypes(): Promise<Archetype[]> {
  const archetypeModule = await import('../data/pathfinder/2e/archetypes');
  return archetypeModule.allPf2eArchetypes || [];
}

// D&D 3.5e Loaders
async function loadDnd35eSpells(): Promise<Spell[]> {
  const spellModule = await import('../data/dnd/3.5e/spells');
  return spellModule.allSpells || spellModule.dnd35eSpells || [];
}

async function loadDnd35eClasses(): Promise<CharacterClass[]> {
  const [classModule, prestigeModule] = await Promise.all([
    import('../data/dnd/3.5e/classes'),
    import('../data/dnd/3.5e/prestige-classes'),
  ]);
  return [
    ...(classModule.dnd35eClasses || []),
    ...(prestigeModule.dnd35eProductPrestigeClasses || []),
  ];
}

async function loadDnd35eSpecies(): Promise<Species[]> {
  const raceModule = await import('../data/dnd/3.5e/races');
  return raceModule.dnd35eRaces || [];
}

/**
 * Normalize 3.5e/PF1e legacy equipment entries into the canonical `Item`
 * shape (review M-3: these loaders previously asserted `as Item[]` over
 * string costs like '15 gp' and non-ItemType `type` values like 'melee',
 * so `item.cost.amount` rendered undefined at runtime despite green types).
 * System-specific extras (damage, properties, armorClass, …) are preserved
 * by spreading the raw entry first; only the canonical fields are coerced.
 */
function normalizeLegacyEquipment(rawItems: unknown[], fallbackType: Item['type']): Item[] {
  const CURRENCIES = new Set(['cp', 'sp', 'gp', 'pp']);
  const ITEM_TYPES = new Set([
    'weapon',
    'armor',
    'shield',
    'consumable',
    'tool',
    'gear',
    'magic-item',
    'treasure',
  ]);

  return rawItems
    .filter((item): item is Record<string, unknown> => {
      const candidate = item as Record<string, unknown> | null;
      return Boolean(candidate && candidate.id && candidate.name);
    })
    .map((raw) => {
      let cost: Item['cost'] = { amount: 0, currency: 'gp' };
      if (typeof raw.cost === 'string') {
        const match = raw.cost.trim().match(/^([\d,.]+)\s*(cp|sp|gp|pp)$/i);
        if (match) {
          const amount = Number(match[1].replace(/,/g, ''));
          if (Number.isFinite(amount)) {
            cost = { amount, currency: match[2].toLowerCase() as Item['cost']['currency'] };
          }
        }
      } else if (
        raw.cost &&
        typeof raw.cost === 'object' &&
        typeof (raw.cost as { amount?: unknown }).amount === 'number' &&
        CURRENCIES.has(String((raw.cost as { currency?: unknown }).currency))
      ) {
        cost = raw.cost as Item['cost'];
      }

      const type = ITEM_TYPES.has(String(raw.type)) ? (raw.type as Item['type']) : fallbackType;

      return {
        ...raw,
        type,
        cost,
        rarity: (raw.rarity as Item['rarity']) ?? 'common',
        weight: typeof raw.weight === 'number' && Number.isFinite(raw.weight) ? raw.weight : 0,
        description: typeof raw.description === 'string' ? raw.description : '',
        requiresAttunement: Boolean(raw.requiresAttunement),
      } as Item;
    });
}

async function loadDnd35eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/dnd/3.5e/equipment');
  const eq = equipModule.dnd35eEquipment;
  return [
    ...normalizeLegacyEquipment(eq.weapons as unknown[], 'weapon'),
    ...normalizeLegacyEquipment(eq.armor as unknown[], 'armor'),
    ...normalizeLegacyEquipment(eq.shields as unknown[], 'shield'),
    ...normalizeLegacyEquipment(eq.adventuringGear as unknown[], 'gear'),
  ];
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
    return spellModule.allSpells || spellModule.pf1eSpells || [];
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
  const [classModule, prestigeModule] = await Promise.all([
    import('../data/pathfinder/1e/classes'),
    import('../data/pathfinder/1e/prestige-classes'),
  ]);
  return [...Object.values(classModule.pf1eClasses), ...prestigeModule.pf1ePrestigeClasses];
}

async function loadPf1eSpecies(): Promise<Species[]> {
  const raceModule = await import('../data/pathfinder/1e/races');
  return Object.values(raceModule.pf1eRaces);
}

async function loadPf1eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/pathfinder/1e/equipment');
  return [
    ...normalizeLegacyEquipment(Object.values(equipModule.pf1eWeapons || {}), 'weapon'),
    ...normalizeLegacyEquipment(Object.values(equipModule.pf1eArmor || {}), 'armor'),
    ...normalizeLegacyEquipment(Object.values(equipModule.pf1eGear || {}), 'gear'),
    ...normalizeLegacyEquipment((equipModule.pf1eMagicItems || []) as unknown[], 'magic-item'),
  ];
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
  const allFeats: FeatDefinition[] = [...feats.combat, ...feats.metamagic, ...feats.general];
  return allFeats;
}

async function loadPf1eTraits(): Promise<Pf1eTrait[]> {
  const traitModule = await import('../data/pathfinder/1e/traits');
  return traitModule.pf1eTraits || [];
}

// M&M 3e Loaders
async function loadMam3ePowers(): Promise<Spell[]> {
  const powerModule = await import('../data/mutants-and-masterminds/3e/powers');
  const powers: Spell[] = [];

  Object.values(powerModule).forEach((value) => {
    if (Array.isArray(value)) {
      const validPowers = (value as unknown as Spell[]).filter((p) => p && p.id && p.name);
      powers.push(...validPowers);
    } else if (value && typeof value === 'object' && 'id' in value && 'name' in value) {
      powers.push(value as unknown as Spell);
    }
  });

  return powers;
}

async function loadMam3eAdvantages(): Promise<Advantage[]> {
  const { mam3eAdvantages } = await import('../data/mutants-and-masterminds/3e/advantages');
  return mam3eAdvantages;
}

async function loadMam3eEquipment(): Promise<Item[]> {
  const equipModule = await import('../data/mutants-and-masterminds/3e/equipment');
  const allItems: unknown[] = [];
  Object.values(equipModule).forEach((value) => {
    if (Array.isArray(value)) {
      allItems.push(...value);
    }
  });
  return allItems.filter((item: unknown) => {
    const i = item as Record<string, unknown>;
    return i && i.id && i.name;
  }) as Item[];
}

async function loadMam3eArchetypes(): Promise<Mam3eArchetype[]> {
  const archetypeModule = await import('../data/mutants-and-masterminds/3e/archetypes');
  return Object.values(archetypeModule.mm3eArchetypes || {});
}

async function loadMam3eComplications(): Promise<Complication[]> {
  const complicationModule = await import('../data/mutants-and-masterminds/3e/complications');
  return complicationModule.complications || [];
}

async function loadMam3ePowerModifiers(): Promise<PowerModifier[]> {
  const modifierModule = await import('../data/mutants-and-masterminds/3e/modifiers');
  const { extras = [], flaws = [] } = modifierModule.powerModifiers || {};
  return [...extras, ...flaws];
}

// Daggerheart Loaders
async function loadDaggerheartClasses(): Promise<DaggerheartClass[]> {
  const classModule = await import('../data/daggerheart/1.0/classes');
  return classModule.daggerheartClasses || [];
}

async function loadDaggerheartAncestries(): Promise<DaggerheartAncestry[]> {
  const ancestryModule = await import('../data/daggerheart/1.0/ancestries');
  return ancestryModule.daggerheartAncestries || [];
}

async function loadDaggerheartCommunities(): Promise<DaggerheartCommunity[]> {
  const communityModule = await import('../data/daggerheart/1.0/communities');
  return communityModule.daggerheartCommunities || [];
}

async function loadDaggerheartDomains(): Promise<DaggerheartDomain[]> {
  const domainModule = await import('../data/daggerheart/1.0/domains');
  return domainModule.daggerheartDomains || [];
}

async function loadDaggerheartDomainCards(): Promise<DaggerheartDomainCard[]> {
  const cardModule = await import('../data/daggerheart/1.0/domain-cards');
  return cardModule.daggerheartDomainCards || [];
}

async function loadDaggerheartWeapons(): Promise<DaggerheartWeapon[]> {
  const equipmentModule = await import('../data/daggerheart/1.0/equipment');
  return equipmentModule.daggerheartWeapons || [];
}

async function loadDaggerheartArmor(): Promise<DaggerheartArmor[]> {
  const equipmentModule = await import('../data/daggerheart/1.0/equipment');
  return equipmentModule.daggerheartArmor || [];
}

async function loadDaggerheartLoot(): Promise<DaggerheartLoot[]> {
  const equipmentModule = await import('../data/daggerheart/1.0/equipment');
  return equipmentModule.daggerheartLoot || [];
}

async function loadDaggerheartConsumables(): Promise<DaggerheartConsumable[]> {
  const equipmentModule = await import('../data/daggerheart/1.0/equipment');
  return equipmentModule.daggerheartConsumables || [];
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

export async function loadBackgroundsForSystem(systemId: GameSystemId): Promise<Background[]> {
  let backgrounds: Background[];

  switch (systemId) {
    case 'dnd-5e-2024':
      backgrounds = await loadDnd5e2024Backgrounds();
      break;
    case 'dnd-5e-2014':
      backgrounds = await loadDnd5e2014Backgrounds();
      break;
    case 'dnd-3.5e':
    case 'pf1e':
      return [];
    default:
      return [];
  }

  return finalizeLoadedItems(systemId, 'backgrounds', backgrounds);
}

export async function loadPf2eBackgroundsForSystem(
  systemId: GameSystemId
): Promise<Pf2eBackgroundDefinition[]> {
  if (systemId !== 'pf2e') {
    return [];
  }

  const backgrounds = await loadPf2eBackgrounds();
  return finalizeLoadedItems(systemId, 'backgrounds', backgrounds);
}

export async function loadArchetypesForSystem(systemId: GameSystemId): Promise<Archetype[]> {
  if (systemId !== 'pf2e') {
    return [];
  }

  const archetypes = await loadPf2eArchetypes();
  return finalizeLoadedItems(systemId, 'archetypes', archetypes);
}

export async function loadMam3eArchetypesForSystem(
  systemId: GameSystemId
): Promise<Mam3eArchetype[]> {
  if (systemId !== 'mam3e') {
    return [];
  }

  const archetypes = await loadMam3eArchetypes();
  return finalizeLoadedItems(systemId, 'archetypes', archetypes);
}

export async function loadDaggerheartClassesForSystem(
  systemId: GameSystemId
): Promise<DaggerheartClass[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const classes = await loadDaggerheartClasses();
  return finalizeLoadedItems(systemId, 'classes', classes);
}

export async function loadDaggerheartAncestriesForSystem(
  systemId: GameSystemId
): Promise<DaggerheartAncestry[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const ancestries = await loadDaggerheartAncestries();
  return finalizeLoadedItems(systemId, 'species', ancestries);
}

export async function loadDaggerheartCommunitiesForSystem(
  systemId: GameSystemId
): Promise<DaggerheartCommunity[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const communities = await loadDaggerheartCommunities();
  return finalizeLoadedItems(systemId, 'backgrounds', communities);
}

export async function loadDaggerheartDomainsForSystem(
  systemId: GameSystemId
): Promise<DaggerheartDomain[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const domains = await loadDaggerheartDomains();
  return finalizeLoadedItems(systemId, 'domains', domains);
}

export async function loadDaggerheartDomainCardsForSystem(
  systemId: GameSystemId
): Promise<DaggerheartDomainCard[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const cards = await loadDaggerheartDomainCards();
  return finalizeLoadedItems(systemId, 'domainCards', cards);
}

export async function loadDaggerheartWeaponsForSystem(
  systemId: GameSystemId
): Promise<DaggerheartWeapon[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const weapons = await loadDaggerheartWeapons();
  return finalizeLoadedItems(systemId, 'equipment', weapons);
}

export async function loadDaggerheartArmorForSystem(
  systemId: GameSystemId
): Promise<DaggerheartArmor[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const armor = await loadDaggerheartArmor();
  return finalizeLoadedItems(systemId, 'equipment', armor);
}

export async function loadDaggerheartLootForSystem(
  systemId: GameSystemId
): Promise<DaggerheartLoot[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const loot = await loadDaggerheartLoot();
  return finalizeLoadedItems(systemId, 'equipment', loot);
}

export async function loadDaggerheartConsumablesForSystem(
  systemId: GameSystemId
): Promise<DaggerheartConsumable[]> {
  if (systemId !== 'daggerheart') {
    return [];
  }

  const consumables = await loadDaggerheartConsumables();
  return finalizeLoadedItems(systemId, 'equipment', consumables);
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
    case 'dnd-3.5e': {
      const monsterModule = await import('../data/dnd/3.5e/monsters');
      monsters = monsterModule.dnd35eMonsters || [];
      break;
    }
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

export async function loadTraitsForSystem(systemId: GameSystemId): Promise<Pf1eTrait[]> {
  if (systemId !== 'pf1e') {
    return [];
  }

  const traits = await loadPf1eTraits();
  return finalizeLoadedItems(systemId, 'traits', traits);
}

export async function loadFeatureOptionsForSystem(
  systemId: GameSystemId
): Promise<Dnd5eFeatureOptionDefinition[]> {
  if (systemId !== 'dnd-5e-2014') {
    return [];
  }

  const options = await loadDnd5e2014FeatureOptions();
  return finalizeLoadedItems(systemId, 'featureOptions', options);
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

/**
 * Load advantages for M&M 3e
 */
export async function loadAdvantagesForSystem(systemId: GameSystemId): Promise<Advantage[]> {
  if (systemId !== 'mam3e') return [];

  const advantages = await loadMam3eAdvantages();
  return finalizeLoadedItems(systemId, 'advantages', advantages);
}

export async function loadComplicationsForSystem(systemId: GameSystemId): Promise<Complication[]> {
  if (systemId !== 'mam3e') {
    return [];
  }

  const complications = await loadMam3eComplications();
  return finalizeLoadedItems(systemId, 'complications', complications);
}

export async function loadPowerModifiersForSystem(
  systemId: GameSystemId
): Promise<PowerModifier[]> {
  if (systemId !== 'mam3e') {
    return [];
  }

  const modifiers = await loadMam3ePowerModifiers();
  return finalizeLoadedItems(systemId, 'powerModifiers', modifiers);
}
