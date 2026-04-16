import { systemRegistry } from '../registry';
import type { GameSystemId } from '../types/game-systems';
import { loadSystemCatalogSummaryFromMetadata } from './systemCatalogMetadata';

const systemAssetPrefetchers: Partial<Record<GameSystemId, () => Promise<unknown>>> = {
  'dnd-5e-2024': () => import('../data/dnd/5e-2024/metadata'),
  'dnd-5e-2014': () => import('../data/dnd/5e-2014/metadata'),
  'dnd-3.5e': () => import('../data/dnd/3.5e/metadata'),
  pf1e: () => import('../data/pathfinder/1e/metadata'),
  pf2e: () => import('../data/pathfinder/2e/metadata'),
  mam3e: () => import('../data/mutants-and-masterminds/3e/metadata'),
  daggerheart: () => import('../data/daggerheart/1.0/metadata'),
};

const prefetchedSystemAssets = new Set<GameSystemId>();
const prefetchedSystemSheets = new Set<GameSystemId>();
const prefetchedSystemRuntimeData = new Set<GameSystemId>();

export function resetSystemAssetPrefetchStateForTests(): void {
  prefetchedSystemAssets.clear();
  prefetchedSystemSheets.clear();
  prefetchedSystemRuntimeData.clear();
}

export function getSystemAssetPrefetchStateForTests(): {
  assets: GameSystemId[];
  sheets: GameSystemId[];
  runtimeData: GameSystemId[];
} {
  return {
    assets: [...prefetchedSystemAssets],
    sheets: [...prefetchedSystemSheets],
    runtimeData: [...prefetchedSystemRuntimeData],
  };
}

export function prefetchSystemAssetsForIds(systemIds: Iterable<GameSystemId>): void {
  for (const systemId of systemIds) {
    const prefetch = systemAssetPrefetchers[systemId];
    if (prefetch && !prefetchedSystemAssets.has(systemId)) {
      prefetchedSystemAssets.add(systemId);
      void prefetch().catch(() => {
        prefetchedSystemAssets.delete(systemId);
      });
    }

    const sheetComponent = systemRegistry.get(systemId)?.SheetComponent as
      | { preload?: () => Promise<unknown> }
      | undefined;
    if (typeof sheetComponent?.preload !== 'function' || prefetchedSystemSheets.has(systemId)) {
      continue;
    }

    prefetchedSystemSheets.add(systemId);
    void sheetComponent.preload().catch(() => {
      prefetchedSystemSheets.delete(systemId);
    });

    if (prefetchedSystemRuntimeData.has(systemId)) {
      continue;
    }

    prefetchedSystemRuntimeData.add(systemId);
    void loadSystemCatalogSummaryFromMetadata(systemId).catch(() => {
      prefetchedSystemRuntimeData.delete(systemId);
    });
  }
}
