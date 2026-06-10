import { useCallback, useEffect, useRef, useState } from 'react';
import type { Mam3eArchetype } from '../../types/mam/archetypes';
import type { Item } from '../../types/equipment/items';
import type { GameSystemId } from '../../types/game-systems';
import type { Spell } from '../../types/magic/spells';
import type { Advantage } from '../../types/mam/advantages';
import type { Complication } from '../../data/mutants-and-masterminds/3e/complications';
import type { PowerModifier } from '../../data/mutants-and-masterminds/3e/modifiers/extras';
import {
  loadAdvantagesForSystem,
  loadComplicationsForSystem,
  loadEquipmentForSystem,
  loadMam3eArchetypesForSystem,
  loadPowerModifiersForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { MamArchetypesTab } from './components/MamArchetypesTab';
import { MamComplicationsTab } from './components/MamComplicationsTab';
import { MamEquipmentBrowserTab } from './components/MamEquipmentBrowserTab';
import { MamPowerBrowserTab } from './components/MamPowerBrowserTab';
import { MAM3E_EXTRA_MODIFIERS, MAM3E_FLAW_MODIFIERS } from './powerMath';

interface UseMam3eSheetResourcesProps {
  systemId: GameSystemId;
}

function useLazyResource<T>(
  systemId: GameSystemId,
  loadResource: (systemId: GameSystemId) => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const loadRef = useRef<Promise<void> | null>(null);
  const activeSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeSystemIdRef.current = systemId;
    setData([]);
    setLoaded(false);
    setError(false);
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
        setError(false);
      })
      .catch(() => {
        // Track the failure so the tab can render an error + retry message
        // instead of hanging on its loading placeholder forever (mirrors the
        // Daggerheart sheet's optionsState === 'error' handling).
        if (activeSystemIdRef.current === requestSystemId) {
          setError(true);
        }
      })
      .finally(() => {
        if (activeSystemIdRef.current === requestSystemId) {
          loadRef.current = null;
        }
      });

    loadRef.current = request;
    return request;
  }, [loaded, loadResource, systemId]);

  return { data, loaded, error, load };
}

export function useMam3eSheetResources({ systemId }: UseMam3eSheetResourcesProps) {
  const {
    data: equipmentItems,
    loaded: equipmentLoaded,
    error: equipmentError,
    load: loadEquipment,
  } = useLazyResource<Item>(systemId, loadEquipmentForSystem);
  const {
    data: powers,
    loaded: powersLoaded,
    error: powersError,
    load: loadPowers,
  } = useLazyResource<Spell>(systemId, loadSpellsForSystem);
  const {
    data: advantages,
    loaded: advantagesLoaded,
    error: advantagesError,
    load: loadAdvantages,
  } = useLazyResource<Advantage>(systemId, loadAdvantagesForSystem);
  const {
    data: archetypes,
    loaded: archetypesLoaded,
    error: archetypesError,
    load: loadArchetypes,
  } = useLazyResource<Mam3eArchetype>(systemId, loadMam3eArchetypesForSystem);
  const {
    data: complicationCatalog,
    loaded: complicationsLoaded,
    error: complicationsError,
    load: loadComplications,
  } = useLazyResource<Complication>(systemId, loadComplicationsForSystem);

  const [modifierCatalog, setModifierCatalog] = useState<PowerModifier[]>(() => [
    ...MAM3E_EXTRA_MODIFIERS,
    ...MAM3E_FLAW_MODIFIERS,
  ]);
  const [powerModifiersLoaded, setPowerModifiersLoaded] = useState(false);
  const [powerModifiersError, setPowerModifiersError] = useState(false);
  const powerModifiersLoadRef = useRef<Promise<void> | null>(null);
  const activeSystemIdRef = useRef(systemId);

  useEffect(() => {
    activeSystemIdRef.current = systemId;
    setModifierCatalog([...MAM3E_EXTRA_MODIFIERS, ...MAM3E_FLAW_MODIFIERS]);
    setPowerModifiersLoaded(false);
    setPowerModifiersError(false);
    powerModifiersLoadRef.current = null;
  }, [systemId]);

  const loadPowerModifiers = useCallback(async () => {
    if (powerModifiersLoaded) {
      return;
    }
    if (powerModifiersLoadRef.current) {
      return powerModifiersLoadRef.current;
    }

    const requestSystemId = systemId;
    const request = loadPowerModifiersForSystem(systemId)
      .then((loaded) => {
        if (activeSystemIdRef.current !== requestSystemId) {
          return;
        }

        if (loaded.length > 0) {
          setModifierCatalog(loaded);
        }
        setPowerModifiersLoaded(true);
        setPowerModifiersError(false);
      })
      .catch(() => {
        if (activeSystemIdRef.current === requestSystemId) {
          setPowerModifiersError(true);
        }
      })
      .finally(() => {
        if (activeSystemIdRef.current === requestSystemId) {
          powerModifiersLoadRef.current = null;
        }
      });

    powerModifiersLoadRef.current = request;
    return request;
  }, [powerModifiersLoaded, systemId]);

  const warmArchetypes = useCallback(() => {
    void loadArchetypes();
    void MamArchetypesTab.preload();
  }, [loadArchetypes]);

  const warmPowers = useCallback(() => {
    void loadPowerModifiers();
  }, [loadPowerModifiers]);

  const warmPowerBrowser = useCallback(() => {
    void loadPowers();
    void loadPowerModifiers();
    void MamPowerBrowserTab.preload();
  }, [loadPowerModifiers, loadPowers]);

  const warmAdvantages = useCallback(() => {
    void loadAdvantages();
  }, [loadAdvantages]);

  const warmEquipmentBrowser = useCallback(() => {
    void loadEquipment();
    void MamEquipmentBrowserTab.preload();
  }, [loadEquipment]);

  const warmComplications = useCallback(() => {
    void loadComplications();
    void MamComplicationsTab.preload();
  }, [loadComplications]);

  return {
    equipmentItems,
    equipmentLoaded,
    equipmentError,
    loadEquipment,
    powers,
    powersLoaded,
    powersError,
    loadPowers,
    advantages,
    advantagesLoaded,
    advantagesError,
    loadAdvantages,
    archetypes,
    archetypesLoaded,
    archetypesError,
    loadArchetypes,
    complicationCatalog,
    complicationsLoaded,
    complicationsError,
    loadComplications,
    modifierCatalog,
    powerModifiersLoaded,
    powerModifiersError,
    loadPowerModifiers,
    warmArchetypes,
    warmPowers,
    warmPowerBrowser,
    warmAdvantages,
    warmEquipmentBrowser,
    warmComplications,
  };
}
