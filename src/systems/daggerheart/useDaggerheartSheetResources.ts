import { useEffect, useState } from 'react';
import type {
  DaggerheartAncestry,
  DaggerheartArmor,
  DaggerheartClass,
  DaggerheartCommunity,
  DaggerheartConsumable,
  DaggerheartDomain,
  DaggerheartDomainCard,
  DaggerheartLoot,
  DaggerheartWeapon,
} from '../../types/daggerheart';
import type { GameSystemId } from '../../types/game-systems';
import {
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartArmorForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
  loadDaggerheartConsumablesForSystem,
  loadDaggerheartDomainCardsForSystem,
  loadDaggerheartDomainsForSystem,
  loadDaggerheartLootForSystem,
  loadDaggerheartWeaponsForSystem,
} from '../../utils/dataLoader';

interface UseDaggerheartSheetResourcesProps {
  systemId: GameSystemId;
}

export function useDaggerheartSheetResources({ systemId }: UseDaggerheartSheetResourcesProps) {
  const [classOptions, setClassOptions] = useState<DaggerheartClass[]>([]);
  const [ancestryOptions, setAncestryOptions] = useState<DaggerheartAncestry[]>([]);
  const [communityOptions, setCommunityOptions] = useState<DaggerheartCommunity[]>([]);
  const [domainOptions, setDomainOptions] = useState<DaggerheartDomain[]>([]);
  const [domainCardOptions, setDomainCardOptions] = useState<DaggerheartDomainCard[]>([]);
  const [weaponOptions, setWeaponOptions] = useState<DaggerheartWeapon[]>([]);
  const [armorOptions, setArmorOptions] = useState<DaggerheartArmor[]>([]);
  const [lootOptions, setLootOptions] = useState<DaggerheartLoot[]>([]);
  const [consumableOptions, setConsumableOptions] = useState<DaggerheartConsumable[]>([]);
  const [optionsState, setOptionsState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let canceled = false;

    setOptionsState('loading');

    void Promise.all([
      loadDaggerheartClassesForSystem(systemId),
      loadDaggerheartAncestriesForSystem(systemId),
      loadDaggerheartCommunitiesForSystem(systemId),
      loadDaggerheartDomainsForSystem(systemId),
      loadDaggerheartDomainCardsForSystem(systemId),
      loadDaggerheartWeaponsForSystem(systemId),
      loadDaggerheartArmorForSystem(systemId),
      loadDaggerheartLootForSystem(systemId),
      loadDaggerheartConsumablesForSystem(systemId),
    ])
      .then(
        ([
          classes,
          ancestries,
          communities,
          domains,
          domainCards,
          weapons,
          armor,
          loot,
          consumables,
        ]) => {
          if (canceled) {
            return;
          }

          setClassOptions(classes);
          setAncestryOptions(ancestries);
          setCommunityOptions(communities);
          setDomainOptions(domains);
          setDomainCardOptions(domainCards);
          setWeaponOptions(weapons);
          setArmorOptions(armor);
          setLootOptions(loot);
          setConsumableOptions(consumables);
          setOptionsState('ready');
        }
      )
      .catch(() => {
        if (!canceled) {
          setOptionsState('error');
        }
      });

    return () => {
      canceled = true;
    };
  }, [systemId]);

  return {
    classOptions,
    ancestryOptions,
    communityOptions,
    domainOptions,
    domainCardOptions,
    weaponOptions,
    armorOptions,
    lootOptions,
    consumableOptions,
    optionsState,
    loadingOptions: optionsState === 'loading',
  };
}
