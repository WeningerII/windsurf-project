import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { GameSystemId } from '../types/game-systems';
import { loadClassesForSystem, loadSpeciesForSystem } from '../utils/dataLoader';

/**
 * Lazily loads a per-system resource list exactly once, with in-flight
 * deduplication and a reset whenever `systemId` changes (a stale response for
 * the previous system is dropped rather than applied).
 *
 * `enabled: false` turns the hook into a no-op — `load` resolves immediately
 * and `loaded` stays false — for resources that only exist in some systems
 * (e.g. PF1e traits inside the shared d20-legacy sheet).
 */
export function useLazyResource<T>(
  systemId: GameSystemId,
  loadResource: (systemId: GameSystemId) => Promise<T[]>,
  { enabled = true }: { enabled?: boolean } = {}
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
    if (!enabled || loaded) {
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
  }, [enabled, loaded, loadResource, systemId]);

  return { data, loaded, load };
}

/**
 * The class + species/ancestry option pair every system sheet needs. Loaded
 * together (one `loadOptions` call) because template handlers resolve both,
 * and eagerly loading them on mount keeps inputs that resolve against the
 * lists (e.g. the class Level field) live from first render.
 */
export function useSystemOptions(systemId: GameSystemId) {
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const optionsLoadRef = useRef<Promise<void> | null>(null);
  const activeSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeSystemIdRef.current = systemId;
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
        if (activeSystemIdRef.current !== requestSystemId) {
          return;
        }

        setClasses(loadedClasses);
        setSpecies(loadedSpecies);
      })
      .finally(() => {
        if (activeSystemIdRef.current === requestSystemId) {
          optionsLoadRef.current = null;
        }
      });

    optionsLoadRef.current = request;
    return request;
  }, [classes.length, species.length, systemId]);

  return { classes, species, loadOptions };
}
