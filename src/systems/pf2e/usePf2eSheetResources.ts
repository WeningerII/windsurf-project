import { useCallback, useEffect, useRef, useState } from 'react';
import type { Pf2eBackgroundDefinition } from '../../data/pathfinder/2e/backgrounds';
import type { Archetype } from '../../types/character-options/archetypes';
import type { CharacterClass } from '../../types/character-options/classes';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Species } from '../../types/character-options/species';
import type { Item } from '../../types/equipment/items';
import type { Spell } from '../../types/magic/spells';
import type { Monster } from '../../types/creatures/monsters';
import type { GameSystemId } from '../../types/game-systems';
import {
  loadArchetypesForSystem,
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadMonstersForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { Pf2eEquipmentBrowserTab } from './components/Pf2eEquipmentBrowserTab';
import { Pf2eFeatBrowserTab } from './components/Pf2eFeatBrowserTab';
import { Pf2eMonsterBrowserTab } from './components/Pf2eMonsterBrowserTab';
import { Pf2eSpellsTab } from './components/Pf2eSpellsTab';

interface UsePf2eSheetResourcesProps {
  systemId: GameSystemId;
}

function useLazyResource<T>(
  systemId: GameSystemId,
  loadResource: (systemId: GameSystemId) => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);
  const loadRef = useRef<Promise<void> | null>(null);
  const activeSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeSystemIdRef.current = systemId;
    setData([]);
    setLoaded(false);
    loadRef.current = null;
  }, [systemId]);

  const load = useCallback(async () => {
    if (loaded) {
      return;
    }
    if (loadRef.current) {
      return loadRef.current;
    }

    const requestSystemId = systemId;
    const request = loadResource(systemId)
      .then((loadedData) => {
        if (activeSystemIdRef.current !== requestSystemId) {
          return;
        }

        setData(loadedData);
        setLoaded(true);
      })
      .finally(() => {
        if (activeSystemIdRef.current === requestSystemId) {
          loadRef.current = null;
        }
      });

    loadRef.current = request;
    return request;
  }, [loaded, loadResource, systemId]);

  return { data, loaded, load };
}

export function usePf2eSheetResources({ systemId }: UsePf2eSheetResourcesProps) {
  const {
    data: featDefs,
    loaded: featsLoaded,
    load: loadFeatDefs,
  } = useLazyResource<FeatDefinition>(systemId, loadFeatsForSystem);
  const {
    data: spells,
    loaded: spellsLoaded,
    load: loadSpells,
  } = useLazyResource<Spell>(systemId, loadSpellsForSystem);
  const {
    data: equipmentItems,
    loaded: equipmentLoaded,
    load: loadEquipment,
  } = useLazyResource<Item>(systemId, loadEquipmentForSystem);
  const {
    data: backgrounds,
    loaded: backgroundsLoaded,
    load: loadBackgrounds,
  } = useLazyResource<Pf2eBackgroundDefinition>(systemId, loadPf2eBackgroundsForSystem);
  const {
    data: archetypes,
    loaded: archetypesLoaded,
    load: loadArchetypes,
  } = useLazyResource<Archetype>(systemId, loadArchetypesForSystem);
  const {
    data: monsters,
    loaded: monstersLoaded,
    load: loadMonsters,
  } = useLazyResource<Monster>(systemId, loadMonstersForSystem);

  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [ancestries, setAncestries] = useState<Species[]>([]);
  const optionsLoadRef = useRef<Promise<void> | null>(null);
  const activeSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeSystemIdRef.current = systemId;
    setClasses([]);
    setAncestries([]);
    optionsLoadRef.current = null;
  }, [systemId]);

  const loadOptions = useCallback(async () => {
    if (classes.length > 0 && ancestries.length > 0) {
      return;
    }
    if (optionsLoadRef.current) {
      return optionsLoadRef.current;
    }

    const requestSystemId = systemId;
    const request = Promise.all([loadClassesForSystem(systemId), loadSpeciesForSystem(systemId)])
      .then(([loadedClasses, loadedAncestries]) => {
        if (activeSystemIdRef.current !== requestSystemId) {
          return;
        }

        setClasses(loadedClasses);
        setAncestries(loadedAncestries);
      })
      .finally(() => {
        if (activeSystemIdRef.current === requestSystemId) {
          optionsLoadRef.current = null;
        }
      });

    optionsLoadRef.current = request;
    return request;
  }, [ancestries.length, classes.length, systemId]);

  useEffect(() => {
    void loadBackgrounds();
  }, [loadBackgrounds]);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  const warmFeatBrowser = useCallback(() => {
    void loadFeatDefs();
    void Pf2eFeatBrowserTab.preload();
  }, [loadFeatDefs]);

  const warmArchetypes = useCallback(() => {
    void loadArchetypes();
  }, [loadArchetypes]);

  const warmSpellsTab = useCallback(() => {
    void loadSpells();
    void Pf2eSpellsTab.preload();
  }, [loadSpells]);

  const warmEquipmentBrowser = useCallback(() => {
    void loadEquipment();
    void Pf2eEquipmentBrowserTab.preload();
  }, [loadEquipment]);

  const warmMonsterBrowser = useCallback(() => {
    void loadMonsters();
    void Pf2eMonsterBrowserTab.preload();
  }, [loadMonsters]);

  return {
    featDefs,
    featsLoaded,
    loadFeatDefs,
    spells,
    spellsLoaded,
    loadSpells,
    equipmentItems,
    equipmentLoaded,
    loadEquipment,
    classes,
    ancestries,
    loadOptions,
    backgrounds,
    backgroundsLoaded,
    loadBackgrounds,
    archetypes,
    archetypesLoaded,
    loadArchetypes,
    monsters,
    monstersLoaded,
    loadMonsters,
    warmFeatBrowser,
    warmArchetypes,
    warmSpellsTab,
    warmEquipmentBrowser,
    warmMonsterBrowser,
  };
}
