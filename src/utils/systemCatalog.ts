import type { GameSystemId } from '../types/game-systems';
import type { SystemCatalogSummary, SystemContentSummary } from '../types/system-catalog';
import {
  appendCategories,
  buildSummary,
  KNOWN_SYSTEM_IDS,
  productCategory,
} from './systemCatalogShared';

export { KNOWN_SYSTEM_IDS } from './systemCatalogShared';

const systemCatalogSummaryCache = new Map<GameSystemId, Promise<SystemCatalogSummary>>();

export function clearSystemCatalogSummaryCache(): void {
  systemCatalogSummaryCache.clear();
}

async function loadSystemCatalogDataLoaders() {
  return import('./dataLoader');
}

export async function loadSystemCatalogSummary(
  systemId: GameSystemId
): Promise<SystemCatalogSummary> {
  const cached = systemCatalogSummaryCache.get(systemId);
  if (cached) {
    return cached;
  }

  const summaryPromise = (async () => {
    const categories: SystemContentSummary[] = [];
    const loaders = await loadSystemCatalogDataLoaders();

    switch (systemId) {
      case 'dnd-5e-2024': {
        const [spells, classes, species, backgrounds, monsters, equipment, feats] =
          await Promise.all([
            loaders.loadSpellsForSystem(systemId),
            loaders.loadClassesForSystem(systemId),
            loaders.loadSpeciesForSystem(systemId),
            loaders.loadBackgroundsForSystem(systemId),
            loaders.loadMonstersForSystem(systemId),
            loaders.loadEquipmentForSystem(systemId),
            loaders.loadFeatsForSystem(systemId),
          ]);

        appendCategories(
          categories,
          productCategory('spells', 'Spells', spells.length),
          productCategory('classes', 'Classes', classes.length),
          productCategory('species', 'Species', species.length),
          productCategory('backgrounds', 'Backgrounds', backgrounds.length),
          productCategory('monsters', 'Monsters', monsters.length),
          productCategory('equipment', 'Equipment', equipment.length),
          productCategory('feats', 'Feats', feats.length)
        );
        break;
      }
      case 'dnd-5e-2014': {
        const [spells, classes, species, backgrounds, featureOptions, monsters, equipment, feats] =
          await Promise.all([
            loaders.loadSpellsForSystem(systemId),
            loaders.loadClassesForSystem(systemId),
            loaders.loadSpeciesForSystem(systemId),
            loaders.loadBackgroundsForSystem(systemId),
            loaders.loadFeatureOptionsForSystem(systemId),
            loaders.loadMonstersForSystem(systemId),
            loaders.loadEquipmentForSystem(systemId),
            loaders.loadFeatsForSystem(systemId),
          ]);

        appendCategories(
          categories,
          productCategory('spells', 'Spells', spells.length),
          productCategory('classes', 'Classes', classes.length),
          productCategory('species', 'Species', species.length),
          productCategory('featureOptions', 'Feature Options', featureOptions.length),
          productCategory('backgrounds', 'Backgrounds', backgrounds.length),
          productCategory('monsters', 'Monsters', monsters.length),
          productCategory('equipment', 'Equipment', equipment.length),
          productCategory('feats', 'Feats', feats.length)
        );
        break;
      }
      case 'pf2e': {
        const [spells, classes, species, backgrounds, equipment, feats, archetypes] =
          await Promise.all([
            loaders.loadSpellsForSystem(systemId),
            loaders.loadClassesForSystem(systemId),
            loaders.loadSpeciesForSystem(systemId),
            loaders.loadPf2eBackgroundsForSystem(systemId),
            loaders.loadEquipmentForSystem(systemId),
            loaders.loadFeatsForSystem(systemId),
            loaders.loadArchetypesForSystem(systemId),
          ]);

        appendCategories(
          categories,
          productCategory('spells', 'Spells', spells.length),
          productCategory('classes', 'Classes', classes.length),
          productCategory('species', 'Species', species.length),
          productCategory('backgrounds', 'Backgrounds', backgrounds.length),
          productCategory('archetypes', 'Archetypes', archetypes.length),
          productCategory('equipment', 'Equipment', equipment.length),
          productCategory('feats', 'Feats', feats.length)
        );
        break;
      }
      case 'dnd-3.5e':
      case 'pf1e': {
        const [spells, classes, species, equipment, feats, traits] = await Promise.all([
          loaders.loadSpellsForSystem(systemId),
          loaders.loadClassesForSystem(systemId),
          loaders.loadSpeciesForSystem(systemId),
          loaders.loadEquipmentForSystem(systemId),
          loaders.loadFeatsForSystem(systemId),
          loaders.loadTraitsForSystem(systemId),
        ]);

        appendCategories(
          categories,
          productCategory('spells', 'Spells', spells.length),
          productCategory('classes', 'Classes', classes.length),
          productCategory('species', 'Species', species.length),
          productCategory('equipment', 'Equipment', equipment.length),
          productCategory('feats', 'Feats', feats.length),
          productCategory('traits', 'Traits', traits.length)
        );
        break;
      }
      case 'mam3e': {
        const [powers, advantages, equipment, archetypes, complications, powerModifiers] =
          await Promise.all([
            loaders.loadSpellsForSystem(systemId),
            loaders.loadAdvantagesForSystem(systemId),
            loaders.loadEquipmentForSystem(systemId),
            loaders.loadMam3eArchetypesForSystem(systemId),
            loaders.loadComplicationsForSystem(systemId),
            loaders.loadPowerModifiersForSystem(systemId),
          ]);

        appendCategories(
          categories,
          productCategory('spells', 'Powers', powers.length),
          productCategory('archetypes', 'Archetypes', archetypes.length),
          productCategory('complications', 'Complications', complications.length),
          productCategory('advantages', 'Advantages', advantages.length),
          productCategory('equipment', 'Equipment', equipment.length),
          productCategory('powerModifiers', 'Power Modifiers', powerModifiers.length)
        );
        break;
      }
      case 'daggerheart': {
        const [
          classes,
          ancestries,
          communities,
          domains,
          domainCards,
          weapons,
          armor,
          loot,
          consumables,
        ] = await Promise.all([
          loaders.loadDaggerheartClassesForSystem(systemId),
          loaders.loadDaggerheartAncestriesForSystem(systemId),
          loaders.loadDaggerheartCommunitiesForSystem(systemId),
          loaders.loadDaggerheartDomainsForSystem(systemId),
          loaders.loadDaggerheartDomainCardsForSystem(systemId),
          loaders.loadDaggerheartWeaponsForSystem(systemId),
          loaders.loadDaggerheartArmorForSystem(systemId),
          loaders.loadDaggerheartLootForSystem(systemId),
          loaders.loadDaggerheartConsumablesForSystem(systemId),
        ]);

        appendCategories(
          categories,
          productCategory('classes', 'Classes', classes.length),
          productCategory('domains', 'Domains', domains.length),
          productCategory('domainCards', 'Domain Cards', domainCards.length),
          productCategory(
            'equipment',
            'Equipment',
            weapons.length + armor.length + loot.length + consumables.length
          ),
          productCategory('species', 'Ancestries', ancestries.length),
          productCategory('backgrounds', 'Communities', communities.length)
        );
        break;
      }
      default:
        break;
    }

    return buildSummary(systemId, categories);
  })().catch((error) => {
    systemCatalogSummaryCache.delete(systemId);
    throw error;
  });

  systemCatalogSummaryCache.set(systemId, summaryPromise);
  return summaryPromise;
}

export async function loadAllSystemCatalogSummaries(
  systemIds: GameSystemId[] = KNOWN_SYSTEM_IDS
): Promise<Record<GameSystemId, SystemCatalogSummary>> {
  const summaries = await Promise.all(
    systemIds.map(async (systemId) => [systemId, await loadSystemCatalogSummary(systemId)] as const)
  );

  return Object.fromEntries(summaries) as Record<GameSystemId, SystemCatalogSummary>;
}
