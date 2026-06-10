import { useCallback, useEffect } from 'react';
import type { Pf2eBackgroundDefinition } from '../../data/pathfinder/2e/backgrounds';
import type { Archetype } from '../../types/character-options/archetypes';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Item } from '../../types/equipment/items';
import type { Spell } from '../../types/magic/spells';
import type { GameSystemId } from '../../types/game-systems';
import { useLazyResource, useSystemOptions } from '../../hooks/useLazyResource';
import {
  loadArchetypesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { Pf2eEquipmentBrowserTab } from './components/Pf2eEquipmentBrowserTab';
import { Pf2eFeatBrowserTab } from './components/Pf2eFeatBrowserTab';
import { Pf2eSpellsTab } from './components/Pf2eSpellsTab';

interface UsePf2eSheetResourcesProps {
  systemId: GameSystemId;
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
  const { classes, species: ancestries, loadOptions } = useSystemOptions(systemId);

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
    warmFeatBrowser,
    warmArchetypes,
    warmSpellsTab,
    warmEquipmentBrowser,
  };
}
