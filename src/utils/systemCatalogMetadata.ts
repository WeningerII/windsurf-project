import type { GameSystemId } from '../types/game-systems';
import type { SystemCatalogSummary, SystemContentSummary } from '../types/system-catalog';
import {
  appendCategories,
  buildSummary,
  KNOWN_SYSTEM_IDS,
  productCategory,
} from './systemCatalogShared';
import { filterOpenContentBySource, type OpenContentCategory } from './openContentPolicy';

export { KNOWN_SYSTEM_IDS } from './systemCatalogShared';

const metadataSummaryCache = new Map<GameSystemId, Promise<SystemCatalogSummary>>();

function countProductItems<T extends { id?: unknown }>(
  systemId: GameSystemId,
  category: OpenContentCategory,
  items: T[]
): number {
  const seen = new Set<string>();
  const uniqueItems = items.filter((item): item is T & { id: string } => {
    if (typeof item.id !== 'string' || item.id.trim().length === 0 || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });

  return filterOpenContentBySource(systemId, category, uniqueItems).length;
}

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
      const [{ pf2eMetadata }, { pf2eBackgrounds }, { pf2eAncestries }, pf2eEquipment] =
        await Promise.all([
          import('../data/pathfinder/2e/metadata'),
          import('../data/pathfinder/2e/backgrounds'),
          import('../data/pathfinder/2e/ancestries'),
          import('../data/pathfinder/2e/equipment'),
        ]);
      const productAncestryCount = countProductItems(
        'pf2e',
        'species',
        Object.values(pf2eAncestries)
      );
      const productEquipmentCount = countProductItems('pf2e', 'equipment', [
        ...Object.values(pf2eEquipment.pf2eWeapons || {}),
        ...Object.values(pf2eEquipment.pf2eArmor || {}),
        ...Object.values(pf2eEquipment.pf2eGear || {}),
        ...(pf2eEquipment.pf2eMagicWeapons || []),
        ...(pf2eEquipment.pf2eMagicArmor || []),
      ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', pf2eMetadata.stats.spells.count),
        productCategory('classes', 'Classes', pf2eMetadata.stats.classes.count),
        productCategory('species', 'Species', productAncestryCount),
        productCategory('backgrounds', 'Backgrounds', pf2eBackgrounds.length),
        productCategory('archetypes', 'Archetypes', pf2eMetadata.stats.archetypes.count),
        productCategory('equipment', 'Equipment', productEquipmentCount),
        productCategory('feats', 'Feats', pf2eMetadata.stats.feats.count)
      );
      break;
    }
    case 'dnd-3.5e': {
      const [{ dnd35eMetadata }, { dnd35eFeats }, { dnd35eEquipment }] = await Promise.all([
        import('../data/dnd/3.5e/metadata'),
        import('../data/dnd/3.5e/feats'),
        import('../data/dnd/3.5e/equipment'),
      ]);
      const productFeatCount = countProductItems('dnd-3.5e', 'feats', [
        ...dnd35eFeats.general,
        ...dnd35eFeats.metamagic,
        ...dnd35eFeats.itemCreation,
        ...dnd35eFeats.combat,
        ...dnd35eFeats.skill,
        ...dnd35eFeats.ability,
        ...dnd35eFeats.magic,
      ]);
      const productEquipmentCount = countProductItems('dnd-3.5e', 'equipment', [
        ...dnd35eEquipment.weapons,
        ...dnd35eEquipment.armor,
        ...dnd35eEquipment.shields,
        ...dnd35eEquipment.adventuringGear,
      ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', dnd35eMetadata.stats.spells.count),
        productCategory(
          'classes',
          'Classes',
          dnd35eMetadata.stats.classes.count + dnd35eMetadata.stats.prestigeClasses.count
        ),
        productCategory('species', 'Species', dnd35eMetadata.stats.races.count),
        productCategory('equipment', 'Equipment', productEquipmentCount),
        productCategory('feats', 'Feats', productFeatCount)
      );
      break;
    }
    case 'pf1e': {
      const [
        { pf1eMetadata },
        { pf1eClasses },
        { pf1ePrestigeClasses },
        { pf1eRaces },
        { pf1eFeats },
        { pf1eTraits },
        pf1eEquipment,
      ] = await Promise.all([
        import('../data/pathfinder/1e/metadata'),
        import('../data/pathfinder/1e/classes'),
        import('../data/pathfinder/1e/prestige-classes'),
        import('../data/pathfinder/1e/races'),
        import('../data/pathfinder/1e/feats'),
        import('../data/pathfinder/1e/traits'),
        import('../data/pathfinder/1e/equipment'),
      ]);
      const productClassCount = countProductItems('pf1e', 'classes', [
        ...Object.values(pf1eClasses),
        ...pf1ePrestigeClasses,
      ]);
      const productRaceCount = countProductItems('pf1e', 'species', Object.values(pf1eRaces));
      const productFeatCount = countProductItems('pf1e', 'feats', [
        ...pf1eFeats.combat,
        ...pf1eFeats.metamagic,
        ...pf1eFeats.general,
      ]);
      const productTraitCount = countProductItems('pf1e', 'traits', pf1eTraits);
      const productEquipmentCount = countProductItems('pf1e', 'equipment', [
        ...Object.values(pf1eEquipment.pf1eWeapons || {}),
        ...Object.values(pf1eEquipment.pf1eArmor || {}),
        ...Object.values(pf1eEquipment.pf1eGear || {}),
        ...(pf1eEquipment.pf1eMagicItems || []),
      ]);

      appendCategories(
        categories,
        productCategory('spells', 'Spells', pf1eMetadata.stats.spells.count),
        productCategory('classes', 'Classes', productClassCount),
        productCategory('species', 'Species', productRaceCount),
        productCategory('equipment', 'Equipment', productEquipmentCount),
        productCategory('feats', 'Feats', productFeatCount),
        productCategory('traits', 'Traits', productTraitCount)
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
