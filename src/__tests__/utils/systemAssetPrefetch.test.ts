import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { GameSystemId } from '../../types/game-systems';
import * as systemCatalogMetadata from '../../utils/systemCatalogMetadata';

import {
  getSystemAssetPrefetchStateForTests,
  prefetchSystemAssetsForIds,
  resetSystemAssetPrefetchStateForTests,
} from '../../utils/systemAssetPrefetch';

const SYSTEM_IDS: GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

describe('systemAssetPrefetch', () => {
  beforeEach(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
    resetSystemAssetPrefetchStateForTests();
  });

  afterEach(() => {
    resetSystemAssetPrefetchStateForTests();
    vi.restoreAllMocks();
  });

  it('exposes preloadable sheet components for every registered system', () => {
    SYSTEM_IDS.forEach((systemId) => {
      const systemDef = systemRegistry.get(systemId);
      expect(systemDef).toBeDefined();
      expect(
        typeof (systemDef?.SheetComponent as { preload?: () => Promise<unknown> }).preload
      ).toBe('function');
    });
  });

  it('prefetches each registered sheet once per session', async () => {
    const preloadSpies = new Map<GameSystemId, ReturnType<typeof vi.fn>>();
    const originalPreloads = new Map<GameSystemId, (() => Promise<unknown>) | undefined>();
    const loadSummarySpy = vi
      .spyOn(systemCatalogMetadata, 'loadSystemCatalogSummaryFromMetadata')
      .mockResolvedValue({} as never);

    SYSTEM_IDS.forEach((systemId) => {
      const sheetComponent = systemRegistry.get(systemId)?.SheetComponent as
        | { preload?: () => Promise<unknown> }
        | undefined;
      expect(sheetComponent).toBeDefined();

      originalPreloads.set(systemId, sheetComponent?.preload);
      const preloadSpy = vi.fn().mockResolvedValue({});
      preloadSpies.set(systemId, preloadSpy);
      if (sheetComponent) {
        sheetComponent.preload = preloadSpy;
      }
    });

    prefetchSystemAssetsForIds(SYSTEM_IDS);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    const firstPassState = getSystemAssetPrefetchStateForTests();
    SYSTEM_IDS.forEach((systemId) => {
      expect(preloadSpies.get(systemId)).toHaveBeenCalledTimes(1);
      expect(firstPassState.assets).toContain(systemId);
      expect(firstPassState.sheets).toContain(systemId);
      expect(firstPassState.runtimeData).toContain(systemId);
    });

    prefetchSystemAssetsForIds(SYSTEM_IDS);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    const secondPassState = getSystemAssetPrefetchStateForTests();
    SYSTEM_IDS.forEach((systemId) => {
      expect(preloadSpies.get(systemId)).toHaveBeenCalledTimes(1);
      const sheetComponent = systemRegistry.get(systemId)?.SheetComponent as
        | { preload?: () => Promise<unknown> }
        | undefined;
      if (sheetComponent) {
        sheetComponent.preload = originalPreloads.get(systemId);
      }
    });
    expect(secondPassState.assets).toEqual(firstPassState.assets);
    expect(secondPassState.sheets).toEqual(firstPassState.sheets);
    expect(secondPassState.runtimeData).toEqual(firstPassState.runtimeData);
    expect(loadSummarySpy).toHaveBeenCalledTimes(SYSTEM_IDS.length);
    expect(loadSummarySpy).toHaveBeenCalledWith('dnd-5e-2014');
    expect(loadSummarySpy).toHaveBeenCalledWith('daggerheart');
  });
});
