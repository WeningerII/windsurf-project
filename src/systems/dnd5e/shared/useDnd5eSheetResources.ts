import { useCallback, useEffect, useRef, useState } from 'react';
import type { Background } from '../../../types/character-options/backgrounds';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { Species } from '../../../types/character-options/species';
import type { GameSystemId } from '../../../types/game-systems';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadFeatureOptionsForSystem,
  loadMonstersForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../../utils/dataLoader';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../../../utils/errorLogger';
import { Dnd5eEquipmentTab } from './components/Dnd5eEquipmentTab';
import { Dnd5eFeatBrowserTab } from './components/Dnd5eFeatBrowserTab';
import { Dnd5eFeaturesTab } from './components/Dnd5eFeaturesTab';
import { Dnd5eMonsterBrowserTab } from './components/Dnd5eMonsterBrowserTab';
import { Dnd5eSpellsTab } from './components/Dnd5eSpellsTab';
import { useDnd5eDeferredResource } from './useDnd5eDeferredResource';

interface UseDnd5eSheetResourcesOptions {
  systemId: GameSystemId;
  featCount: number;
  showFeatBrowser: boolean;
  showFeatureOptionBrowser: boolean;
}

export function useDnd5eSheetResources({
  systemId,
  featCount,
  showFeatBrowser,
  showFeatureOptionBrowser,
}: UseDnd5eSheetResourcesOptions) {
  const activeSystemIdRef = useRef(systemId);
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  // Real loader failures must surface (same pattern as classTemplateError);
  // only teardown/system-switch cancellation is silently ignored.
  const [resourceLoadError, setResourceLoadError] = useState<string | null>(null);

  const reportResourceLoadError = useCallback(
    (resource: string, requestSystemId: GameSystemId, error: unknown) => {
      if (activeSystemIdRef.current !== requestSystemId) {
        // The sheet switched systems mid-flight; this request's result is
        // irrelevant, so its failure is too.
        return;
      }

      const message = `Failed to load ${resource} for ${requestSystemId}.`;
      errorLogger.log(
        ErrorCategory.DATA_LOAD,
        ErrorSeverity.HIGH,
        message,
        error instanceof Error ? error : undefined,
        { systemId: requestSystemId, resource }
      );
      setResourceLoadError(message);
    },
    []
  );
  const {
    data: spells,
    loaded: spellsLoaded,
    load: loadSpells,
    reset: resetSpells,
  } = useDnd5eDeferredResource({
    systemId,
    activeSystemIdRef,
    loader: loadSpellsForSystem,
  });
  const {
    data: equipmentItems,
    loaded: equipmentLoaded,
    load: loadEquipment,
    reset: resetEquipment,
  } = useDnd5eDeferredResource({
    systemId,
    activeSystemIdRef,
    loader: loadEquipmentForSystem,
  });
  const {
    data: featDefs,
    loaded: featsLoaded,
    load: loadFeatDefs,
    reset: resetFeatDefs,
  } = useDnd5eDeferredResource({
    systemId,
    activeSystemIdRef,
    loader: loadFeatsForSystem,
  });
  const {
    data: featureOptions,
    loaded: featureOptionsLoaded,
    load: loadFeatureOptions,
    reset: resetFeatureOptions,
  } = useDnd5eDeferredResource({
    systemId,
    activeSystemIdRef,
    loader: loadFeatureOptionsForSystem,
  });
  const {
    data: monsters,
    loaded: monstersLoaded,
    load: loadMonsters,
    reset: resetMonsters,
  } = useDnd5eDeferredResource({
    systemId,
    activeSystemIdRef,
    loader: loadMonstersForSystem,
  });

  useEffect(() => {
    let cancelled = false;
    const requestSystemId = systemId;
    activeSystemIdRef.current = requestSystemId;

    setClasses([]);
    setSpecies([]);
    setBackgrounds([]);
    setResourceLoadError(null);
    resetSpells();
    resetEquipment();
    resetFeatDefs();
    resetFeatureOptions();
    resetMonsters();

    void Promise.all([
      loadClassesForSystem(systemId),
      loadSpeciesForSystem(systemId),
      loadBackgroundsForSystem(systemId),
    ])
      .then(([loadedClasses, loadedSpecies, loadedBackgrounds]) => {
        if (cancelled || activeSystemIdRef.current !== requestSystemId) {
          return;
        }

        setClasses(loadedClasses);
        setSpecies(loadedSpecies);
        setBackgrounds(loadedBackgrounds);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          // Teardown-time loader cancellation (e.g. in tests): not a failure.
          return;
        }

        reportResourceLoadError('classes/species/backgrounds', requestSystemId, error);
      });

    return () => {
      cancelled = true;
    };
  }, [
    reportResourceLoadError,
    resetEquipment,
    resetFeatDefs,
    resetFeatureOptions,
    resetMonsters,
    resetSpells,
    systemId,
  ]);

  useEffect(() => {
    if (!showFeatBrowser || featsLoaded || featCount === 0) {
      return;
    }

    const requestSystemId = systemId;
    void loadFeatDefs().catch((error: unknown) => {
      reportResourceLoadError('feats', requestSystemId, error);
    });
  }, [featCount, featsLoaded, loadFeatDefs, reportResourceLoadError, showFeatBrowser, systemId]);

  useEffect(() => {
    if (!showFeatureOptionBrowser || featureOptionsLoaded) {
      return;
    }

    const requestSystemId = systemId;
    void loadFeatureOptions().catch((error: unknown) => {
      reportResourceLoadError('feature options', requestSystemId, error);
    });
  }, [
    featureOptionsLoaded,
    loadFeatureOptions,
    reportResourceLoadError,
    showFeatureOptionBrowser,
    systemId,
  ]);

  const warmFeaturesTab = useCallback(() => {
    void loadFeatureOptions().catch((error: unknown) => {
      reportResourceLoadError('feature options', systemId, error);
    });
    if (showFeatureOptionBrowser) {
      void Dnd5eFeaturesTab.preload();
    }
  }, [loadFeatureOptions, reportResourceLoadError, showFeatureOptionBrowser, systemId]);

  const warmSpellsTab = useCallback(() => {
    void loadSpells().catch((error: unknown) => {
      reportResourceLoadError('spells', systemId, error);
    });
    void Dnd5eSpellsTab.preload();
  }, [loadSpells, reportResourceLoadError, systemId]);

  const warmFeatBrowser = useCallback(() => {
    if (showFeatBrowser) {
      void loadFeatDefs().catch((error: unknown) => {
        reportResourceLoadError('feats', systemId, error);
      });
      void Dnd5eFeatBrowserTab.preload();
    }
  }, [loadFeatDefs, reportResourceLoadError, showFeatBrowser, systemId]);

  const warmEquipmentTab = useCallback(() => {
    void loadEquipment().catch((error: unknown) => {
      reportResourceLoadError('equipment', systemId, error);
    });
    void Dnd5eEquipmentTab.preload();
  }, [loadEquipment, reportResourceLoadError, systemId]);

  const warmMonsterBrowser = useCallback(() => {
    void loadMonsters().catch((error: unknown) => {
      reportResourceLoadError('monsters', systemId, error);
    });
    void Dnd5eMonsterBrowserTab.preload();
  }, [loadMonsters, reportResourceLoadError, systemId]);

  return {
    backgrounds,
    classes,
    equipmentItems,
    equipmentLoaded,
    featDefs,
    featsLoaded,
    featureOptions,
    featureOptionsLoaded,
    monsters,
    monstersLoaded,
    resourceLoadError,
    species,
    spells,
    spellsLoaded,
    warmEquipmentTab,
    warmFeatBrowser,
    warmFeaturesTab,
    warmMonsterBrowser,
    warmSpellsTab,
  };
}
