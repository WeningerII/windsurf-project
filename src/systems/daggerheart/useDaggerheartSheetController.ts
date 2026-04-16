import { useCallback, useMemo, useState } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import type { DaggerheartDataModel } from './data-model';
import { getDaggerheartSheetState } from './getDaggerheartSheetState';
import { useDaggerheartMutationHandlers } from './useDaggerheartMutationHandlers';
import { useDaggerheartSheetResources } from './useDaggerheartSheetResources';
import { useDaggerheartTemplateHandlers } from './useDaggerheartTemplateHandlers';

interface UseDaggerheartSheetControllerProps {
  document: CharacterDocument<DaggerheartDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export function useDaggerheartSheetController({
  document,
  onUpdate,
}: UseDaggerheartSheetControllerProps) {
  const data = document.system;
  const canUpdate = Boolean(onUpdate);
  const [domainCardSearch, setDomainCardSearch] = useState('');
  const [weaponSearch, setWeaponSearch] = useState('');
  const [armorSearch, setArmorSearch] = useState('');
  const [lootSearch, setLootSearch] = useState('');
  const [consumableSearch, setConsumableSearch] = useState('');

  const commitDocument = useCallback(
    (nextDocument: CharacterDocument<DaggerheartDataModel>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...nextDocument,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [onUpdate]
  );

  const update = useCallback(
    (patch: Partial<DaggerheartDataModel>) => {
      commitDocument({
        ...document,
        system: { ...data, ...patch },
      } as CharacterDocument<DaggerheartDataModel>);
    },
    [commitDocument, data, document]
  );

  const onNameChange = useCallback(
    (name: string) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...document,
        name,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [document, onUpdate]
  );

  const updateAttr = useCallback(
    (key: keyof DaggerheartDataModel['attributes'], value: number) => {
      update({ attributes: { ...data.attributes, [key]: value } });
    },
    [data.attributes, update]
  );

  const resources = useDaggerheartSheetResources({
    systemId: document.systemId as GameSystemId,
  });
  const {
    optionsState,
    classOptions,
    ancestryOptions,
    communityOptions,
    domainOptions,
    domainCardOptions,
    weaponOptions,
    armorOptions,
    lootOptions,
    consumableOptions,
  } = resources;

  const derivedState = useMemo(
    () =>
      getDaggerheartSheetState({
        data,
        optionsState,
        classOptions,
        ancestryOptions,
        communityOptions,
        domainOptions,
        domainCardOptions,
        weaponOptions,
        armorOptions,
        lootOptions,
        consumableOptions,
        domainCardSearch,
        weaponSearch,
        armorSearch,
        lootSearch,
        consumableSearch,
      }),
    [
      armorSearch,
      ancestryOptions,
      armorOptions,
      classOptions,
      communityOptions,
      consumableSearch,
      data,
      domainCardOptions,
      domainCardSearch,
      domainOptions,
      lootSearch,
      lootOptions,
      consumableOptions,
      optionsState,
      weaponOptions,
      weaponSearch,
    ]
  );

  const { handleClassChange, handleAncestryChange, handleCommunityChange } =
    useDaggerheartTemplateHandlers({
      document,
      data,
      classOptions,
      ancestryOptions,
      communityOptions,
      selectedClass: derivedState.selectedClass,
      selectedAncestry: derivedState.selectedAncestry,
      commitDocument,
      update,
    });

  const mutationHandlers = useDaggerheartMutationHandlers({
    data,
    update,
    weaponLoadout: derivedState.weaponLoadout,
    weaponOptions,
    activePrimaryWeapon: derivedState.activePrimaryWeapon,
    activeSecondaryWeapon: derivedState.activeSecondaryWeapon,
    ownedDomainCardIds: derivedState.ownedDomainCardIds,
  });

  return {
    document,
    data,
    canUpdate,
    ...resources,
    ...derivedState,
    domainCardSearch,
    setDomainCardSearch,
    weaponSearch,
    setWeaponSearch,
    armorSearch,
    setArmorSearch,
    lootSearch,
    setLootSearch,
    consumableSearch,
    setConsumableSearch,
    update,
    updateAttr,
    onNameChange,
    handleClassChange,
    handleAncestryChange,
    handleCommunityChange,
    ...mutationHandlers,
  };
}

export type DaggerheartSheetController = ReturnType<typeof useDaggerheartSheetController>;
