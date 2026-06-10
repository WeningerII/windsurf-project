import { useEffect } from 'react';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Item } from '../../types/equipment/items';
import type { GameSystemId } from '../../types/game-systems';
import type { Spell } from '../../types/magic/spells';
import type { Pf1eTrait } from '../pf1e/data-model';
import { useLazyResource, useSystemOptions } from '../../hooks/useLazyResource';
import {
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadSpellsForSystem,
  loadTraitsForSystem,
} from '../../utils/dataLoader';

interface UseD20LegacySheetResourcesProps {
  systemId: GameSystemId;
  isPf1e: boolean;
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
  // Traits are PF1e-only; for 3.5e the hook is disabled and loads nothing.
  const {
    data: traitOptions,
    loaded: traitsLoaded,
    load: loadTraitOptions,
  } = useLazyResource<Pf1eTrait>(systemId, loadTraitsForSystem, { enabled: isPf1e });
  const { classes, species, loadOptions } = useSystemOptions(systemId);

  // Eagerly load class/species options on mount (mirroring usePf2eSheetResources):
  // handlers like handleClassLevelChange resolve the class from `classes` and
  // silently no-op while the list is empty, so a freshly opened sheet's Level
  // input would otherwise be dead until a class dropdown happened to be focused.
  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

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
    species,
    loadOptions,
    traitOptions,
    traitsLoaded,
    loadTraitOptions,
  };
}
