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
      .catch(() => {
        // Ignore teardown-time loader cancellation in tests.
      });

    return () => {
      cancelled = true;
    };
  }, [resetEquipment, resetFeatDefs, resetFeatureOptions, resetMonsters, resetSpells, systemId]);

  useEffect(() => {
    if (!showFeatBrowser || featsLoaded || featCount === 0) {
      return;
    }

    void loadFeatDefs().catch(() => {
      // Ignore teardown-time loader cancellation in tests.
    });
  }, [featCount, featsLoaded, loadFeatDefs, showFeatBrowser]);

  useEffect(() => {
    if (!showFeatureOptionBrowser || featureOptionsLoaded) {
      return;
    }

    void loadFeatureOptions().catch(() => {
      // Ignore teardown-time loader cancellation in tests.
    });
  }, [featureOptionsLoaded, loadFeatureOptions, showFeatureOptionBrowser]);

  const warmFeaturesTab = useCallback(() => {
    void loadFeatureOptions();
    if (showFeatureOptionBrowser) {
      void Dnd5eFeaturesTab.preload();
    }
  }, [loadFeatureOptions, showFeatureOptionBrowser]);

  const warmSpellsTab = useCallback(() => {
    void loadSpells();
    void Dnd5eSpellsTab.preload();
  }, [loadSpells]);

  const warmFeatBrowser = useCallback(() => {
    if (showFeatBrowser) {
      void loadFeatDefs();
      void Dnd5eFeatBrowserTab.preload();
    }
  }, [loadFeatDefs, showFeatBrowser]);

  const warmEquipmentTab = useCallback(() => {
    void loadEquipment();
    void Dnd5eEquipmentTab.preload();
  }, [loadEquipment]);

  const warmMonsterBrowser = useCallback(() => {
    void loadMonsters();
    void Dnd5eMonsterBrowserTab.preload();
  }, [loadMonsters]);

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
