import type { GameSystemId } from '../types/game-systems';
import type { SystemCatalogSummary, SystemContentSummary } from '../types/system-catalog';
import {
  appendCategories,
  buildSummary,
  KNOWN_SYSTEM_IDS,
  productCategory,
} from './systemCatalogShared';

export { KNOWN_SYSTEM_IDS } from './systemCatalogShared';

const metadataSummaryCache = new Map<GameSystemId, Promise<SystemCatalogSummary>>();

export function clearSystemCatalogMetadataSummaryCache(): void {
  metadataSummaryCache.clear();
}

async function loadSystemCatalogSummaryFromMetadataInternal(
  systemId: GameSystemId
): Promise<SystemCatalogSummary> {
  const categories: SystemContentSummary[] = [];

  switch (systemId) {
    case 'dnd-5e-2024': {
      const { dnd5e2024Metadata } = await import('../data/dnd/5e-2024/metadata');

      appendCategories(
        categories,
        productCategory('spells', 'Spells', dnd5e2024Metadata.stats.spells.count),
        productCategory('classes', 'Classes', dnd5e2024Metadata.stats.classes.count),
        productCategory('species', 'Species', dnd5e2024Metadata.stats.species.count),
        productCategory('backgrounds', 'Backgrounds', dnd5e2024Metadata.stats.backgrounds.count),
        productCategory('monsters', 'Monsters', dnd5e2024Metadata.stats.monsters.count),
        productCategory(
          'equipment',
          'Equipment',
          dnd5e2024Metadata.stats.equipment.weapons +
            dnd5e2024Metadata.stats.equipment.armor +
            dnd5e2024Metadata.stats.equipment.gear +
            dnd5e2024Metadata.stats.equipment.magicItems
        ),
        productCategory('feats', 'Feats', dnd5e2024Metadata.stats.feats.count)
      );
      break;
    }
    case 'dnd-5e-2014': {
      const { dnd5eMetadata } = await import('../data/dnd/5e-2014/metadata');
      const featureOptionsCount = Object.values(dnd5eMetadata.stats.specialAbilities).reduce(
        (sum, count) => sum + count,
        0
      );

      appendCategories(
        categories,
        productCategory('spells', 'Spells', dnd5eMetadata.stats.spells.count),
        productCategory('classes', 'Classes', dnd5eMetadata.stats.classes.count),
        productCategory('species', 'Species', dnd5eMetadata.stats.species.count),
        productCategory('featureOptions', 'Feature Options', featureOptionsCount),
        productCategory('backgrounds', 'Backgrounds', dnd5eMetadata.stats.backgrounds.count),
        productCategory('monsters', 'Monsters', dnd5eMetadata.stats.monsters.count),
        productCategory(
          'equipment',
          'Equipment',
          dnd5eMetadata.stats.equipment.weapons +
            dnd5eMetadata.stats.equipment.armor +
            dnd5eMetadata.stats.equipment.adventuringGear +
            dnd5eMetadata.stats.equipment.magicItems
        ),
        productCategory('feats', 'Feats', dnd5eMetadata.stats.feats.count)
      );
      break;
    }
    case 'pf2e': {
      const [{ pf2eMetadata }, { pf2eBackgrounds }] = await Promise.all([
        import('../data/pathfinder/2e/metadata'),
        import('../data/pathfinder/2e/backgrounds'),
      ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', pf2eMetadata.stats.spells.count),
        productCategory('classes', 'Classes', pf2eMetadata.stats.classes.count),
        productCategory('species', 'Species', pf2eMetadata.stats.ancestries.count),
        productCategory('backgrounds', 'Backgrounds', pf2eBackgrounds.length),
        productCategory('archetypes', 'Archetypes', pf2eMetadata.stats.archetypes.count),
        productCategory(
          'equipment',
          'Equipment',
          pf2eMetadata.stats.equipment.weapons +
            pf2eMetadata.stats.equipment.armor +
            pf2eMetadata.stats.equipment.magicItems +
            pf2eMetadata.stats.equipment.gear
        ),
        productCategory('feats', 'Feats', pf2eMetadata.stats.feats.count)
      );
      break;
    }
    case 'dnd-3.5e': {
      const { dnd35eMetadata } = await import('../data/dnd/3.5e/metadata');

      appendCategories(
        categories,
        productCategory('spells', 'Spells', dnd35eMetadata.stats.spells.count),
        productCategory(
          'classes',
          'Classes',
          dnd35eMetadata.stats.classes.count + dnd35eMetadata.stats.prestigeClasses.count
        ),
        productCategory('species', 'Species', dnd35eMetadata.stats.races.count),
        productCategory(
          'equipment',
          'Equipment',
          dnd35eMetadata.stats.equipment.weapons +
            dnd35eMetadata.stats.equipment.armor +
            dnd35eMetadata.stats.equipment.shields +
            dnd35eMetadata.stats.equipment.adventuringGear +
            dnd35eMetadata.stats.equipment.magicItems
        ),
        productCategory('feats', 'Feats', dnd35eMetadata.stats.feats.count)
      );
      break;
    }
    case 'pf1e': {
      const { pf1eMetadata } = await import('../data/pathfinder/1e/metadata');

      appendCategories(
        categories,
        productCategory('spells', 'Spells', pf1eMetadata.stats.spells.count),
        productCategory(
          'classes',
          'Classes',
          pf1eMetadata.stats.classes.baseClasses + pf1eMetadata.stats.classes.prestigeClasses
        ),
        productCategory('species', 'Species', pf1eMetadata.stats.races.count),
        productCategory(
          'equipment',
          'Equipment',
          pf1eMetadata.stats.equipment.weapons +
            pf1eMetadata.stats.equipment.armor +
            pf1eMetadata.stats.equipment.magicItems +
            pf1eMetadata.stats.equipment.gear
        ),
        productCategory('feats', 'Feats', pf1eMetadata.stats.feats.count),
        productCategory('traits', 'Traits', pf1eMetadata.stats.traits.count)
      );
      break;
    }
    case 'mam3e': {
      const { mm3eMetadata } = await import('../data/mutants-and-masterminds/3e/metadata');

      appendCategories(
        categories,
        productCategory('spells', 'Powers', mm3eMetadata.stats.powers.count),
        productCategory('archetypes', 'Archetypes', mm3eMetadata.stats.archetypes.count),
        productCategory('complications', 'Complications', mm3eMetadata.stats.complications.count),
        productCategory('advantages', 'Advantages', mm3eMetadata.stats.advantages.count),
        productCategory(
          'equipment',
          'Equipment',
          mm3eMetadata.stats.equipment.vehicles +
            mm3eMetadata.stats.equipment.devices +
            mm3eMetadata.stats.equipment.headquarters +
            mm3eMetadata.stats.equipment.weapons +
            mm3eMetadata.stats.equipment.armor +
            mm3eMetadata.stats.equipment.gear
        ),
        productCategory(
          'powerModifiers',
          'Power Modifiers',
          mm3eMetadata.stats.powerModifiers.extras + mm3eMetadata.stats.powerModifiers.flaws
        )
      );
      break;
    }
    case 'daggerheart': {
      const { daggerheartMetadata } = await import('../data/daggerheart/1.0/metadata');

      appendCategories(
        categories,
        productCategory('classes', 'Classes', daggerheartMetadata.stats.classes.count),
        productCategory('domains', 'Domains', daggerheartMetadata.stats.domains.count),
        productCategory('domainCards', 'Domain Cards', daggerheartMetadata.stats.domainCards.count),
        productCategory('equipment', 'Equipment', daggerheartMetadata.stats.equipment.count),
        productCategory('species', 'Ancestries', daggerheartMetadata.stats.ancestries.count),
        productCategory('backgrounds', 'Communities', daggerheartMetadata.stats.communities.count)
      );
      break;
    }
    default:
      break;
  }

  return buildSummary(systemId, categories);
}

export async function loadSystemCatalogSummaryFromMetadata(
  systemId: GameSystemId
): Promise<SystemCatalogSummary> {
  const cached = metadataSummaryCache.get(systemId);
  if (cached) {
    return cached;
  }

  const summaryPromise = loadSystemCatalogSummaryFromMetadataInternal(systemId).catch((error) => {
    metadataSummaryCache.delete(systemId);
    throw error;
  });

  metadataSummaryCache.set(systemId, summaryPromise);
  return summaryPromise;
}

export async function loadAllSystemCatalogSummariesFromMetadata(
  systemIds: GameSystemId[] = KNOWN_SYSTEM_IDS
): Promise<Record<GameSystemId, SystemCatalogSummary>> {
  const summaries = await Promise.all(
    systemIds.map(
      async (systemId) => [systemId, await loadSystemCatalogSummaryFromMetadata(systemId)] as const
    )
  );

  return Object.fromEntries(summaries) as Record<GameSystemId, SystemCatalogSummary>;
}
