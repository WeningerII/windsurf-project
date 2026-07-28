import { useCallback, useEffect } from 'react';
import type { Pf2eBackgroundDefinition } from '../../data/pathfinder/2e/backgrounds';
import type { Archetype } from '../../types/character-options/archetypes';
import type { Item } from '../../types/equipment/items';
import type { Spell } from '../../types/magic/spells';
import type { GameSystemId } from '../../types/game-systems';
import { useLazyResource, useSystemOptions } from '../../hooks/useLazyResource';
import {
  loadArchetypesForSystem,
  loadEquipmentForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import { Pf2eSpellsTab } from './components/Pf2eSpellsTab';

interface UsePf2eSheetResourcesProps {
  systemId: GameSystemId;
}

export function usePf2eSheetResources({ systemId }: UsePf2eSheetResourcesProps) {
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

  const warmArchetypes = useCallback(() => {
    void loadArchetypes();
  }, [loadArchetypes]);

  const warmSpellsTab = useCallback(() => {
    void loadSpells();
    void Pf2eSpellsTab.preload();
  }, [loadSpells]);

  // The equipment CATALOG is still loaded by the sheet even though its browser
  // tab was evicted (Phase 5): the Inventory tab's EquippedArmorSection resolves
  // armour/shield/weapon stats out of it. Browsing the catalog is the Dock's job.
  const warmEquipment = useCallback(() => {
    void loadEquipment();
  }, [loadEquipment]);

  return {
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
    warmArchetypes,
    warmSpellsTab,
    warmEquipment,
  };
}
