import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterClass } from '../../types/character-options/classes';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Species } from '../../types/character-options/species';
import type { Item } from '../../types/equipment/items';
import type { Monster } from '../../types/creatures/monsters';
import type { GameSystemId } from '../../types/game-systems';
import type { Spell } from '../../types/magic/spells';
import type { Pf1eTrait } from '../pf1e/data-model';
import {
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadMonstersForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
  loadTraitsForSystem,
} from '../../utils/dataLoader';

interface UseD20LegacySheetResourcesProps {
  systemId: GameSystemId;
  isPf1e: boolean;
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

export function useD20LegacySheetResources({ systemId, isPf1e }: UseD20LegacySheetResourcesProps) {
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
    data: monsters,
    loaded: monstersLoaded,
    load: loadMonsters,
  } = useLazyResource<Monster>(systemId, loadMonstersForSystem);

  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const optionsLoadRef = useRef<Promise<void> | null>(null);
  const activeOptionsSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeOptionsSystemIdRef.current = systemId;
    setClasses([]);
    setSpecies([]);
    optionsLoadRef.current = null;
  }, [systemId]);

  const loadOptions = useCallback(async () => {
    if (classes.length > 0 && species.length > 0) {
      return;
    }
    if (optionsLoadRef.current) {
      return optionsLoadRef.current;
    }

    const requestSystemId = systemId;
    const request = Promise.all([loadClassesForSystem(systemId), loadSpeciesForSystem(systemId)])
      .then(([loadedClasses, loadedSpecies]) => {
        if (activeOptionsSystemIdRef.current !== requestSystemId) {
          return;
        }

        setClasses(loadedClasses);
        setSpecies(loadedSpecies);
      })
      .finally(() => {
        if (activeOptionsSystemIdRef.current === requestSystemId) {
          optionsLoadRef.current = null;
        }
      });

    optionsLoadRef.current = request;
    return request;
  }, [classes.length, species.length, systemId]);

  const [traitOptions, setTraitOptions] = useState<Pf1eTrait[]>([]);
  const [traitsLoaded, setTraitsLoaded] = useState(false);
  const traitOptionsLoadRef = useRef<Promise<void> | null>(null);
  const activeTraitSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeTraitSystemIdRef.current = systemId;
    setTraitOptions([]);
    setTraitsLoaded(false);
    traitOptionsLoadRef.current = null;
  }, [systemId]);

  const loadTraitOptions = useCallback(async () => {
    if (!isPf1e || traitsLoaded) {
      return;
    }
    if (traitOptionsLoadRef.current) {
      return traitOptionsLoadRef.current;
    }

    const requestSystemId = systemId;
    const request = loadTraitsForSystem(systemId)
      .then((loadedTraits) => {
        if (activeTraitSystemIdRef.current !== requestSystemId) {
          return;
        }

        setTraitOptions(loadedTraits);
        setTraitsLoaded(true);
      })
      .finally(() => {
        if (activeTraitSystemIdRef.current === requestSystemId) {
          traitOptionsLoadRef.current = null;
        }
      });

    traitOptionsLoadRef.current = request;
    return request;
  }, [isPf1e, systemId, traitsLoaded]);

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
    monsters,
    monstersLoaded,
    loadMonsters,
    classes,
    species,
    loadOptions,
    traitOptions,
    traitsLoaded,
    loadTraitOptions,
  };
}
