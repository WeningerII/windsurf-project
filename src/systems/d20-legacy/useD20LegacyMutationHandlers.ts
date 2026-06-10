import { useCallback, useState } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import type { Pf1eTrait } from '../pf1e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';
import {
  recoverD20LegacySpellSlot,
  resetD20LegacyManualSpellcastingExtras,
  resetD20LegacySpellSlots,
  setD20LegacyPreparedSpell,
  setD20LegacySpellSlotTotal,
  spendD20LegacySpellSlot,
  type D20LegacyData,
} from './d20LegacySheetShared';

interface UseD20LegacyMutationHandlersProps {
  typedDocument: CharacterDocument<D20LegacyData>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  pf1Data: Pf1eDataModel | null;
  traitOptions: Pf1eTrait[];
}

export function useD20LegacyMutationHandlers({
  typedDocument,
  onUpdate,
  pf1Data,
  traitOptions,
}: UseD20LegacyMutationHandlersProps) {
  const sys = typedDocument.system;
  const canUpdate = Boolean(onUpdate);
  const [selectedTraitId, setSelectedTraitId] = useState('');

  const update = useCallback(
    (patch: Partial<D20LegacyData>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...typedDocument,
        system: { ...sys, ...patch } as SystemDataModel,
        updatedAt: new Date(),
      });
    },
    [onUpdate, sys, typedDocument]
  );

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<D20LegacyData>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...nextDocument, updatedAt: new Date() } as CharacterDocument<SystemDataModel>);
    },
    [onUpdate]
  );

  const onNameChange = useCallback(
    (name: string) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({ ...typedDocument, name, updatedAt: new Date() });
    },
    [onUpdate, typedDocument]
  );

  const onShortRest = canUpdate
    ? () => {
        const level = (sys.level as number) ?? 1;
        const recovered = Math.max(1, Math.floor(level / 2));
        update({
          hitPoints: {
            ...sys.hitPoints,
            current: Math.min(sys.hitPoints.max, sys.hitPoints.current + recovered),
          },
        } as Partial<D20LegacyData>);
      }
    : undefined;

  const onLongRest = canUpdate
    ? () => {
        update({
          hitPoints: { ...sys.hitPoints, current: sys.hitPoints.max, temp: 0 },
          spellsPerDay: resetD20LegacySpellSlots(sys.spellsPerDay),
          manualSpellcastingExtras: resetD20LegacyManualSpellcastingExtras(
            sys.manualSpellcastingExtras
          ),
        } as Partial<D20LegacyData>);
      }
    : undefined;

  const prunePreparedSpellLevels = useCallback(
    (
      preparedSpellsByLevel: D20LegacyData['preparedSpellsByLevel'],
      retainedSpellIds: Set<string>
    ): D20LegacyData['preparedSpellsByLevel'] => {
      if (!preparedSpellsByLevel) {
        return preparedSpellsByLevel;
      }

      const nextPreparedSpellsByLevel: Record<number, string[]> = {};
      for (const [level, spellIds] of Object.entries(preparedSpellsByLevel)) {
        const filtered = spellIds.filter((spellId) => retainedSpellIds.has(spellId));
        if (filtered.length > 0) {
          nextPreparedSpellsByLevel[Number(level)] = filtered;
        }
      }

      return nextPreparedSpellsByLevel;
    },
    []
  );

  const addTrait = useCallback(() => {
    const trait = traitOptions.find((entry) => entry.id === selectedTraitId);
    if (!trait || !pf1Data) {
      return;
    }

    update({
      traits: [...pf1Data.traits, trait],
    } as Partial<D20LegacyData>);
    setSelectedTraitId('');
  }, [pf1Data, selectedTraitId, traitOptions, update]);

  const removeTrait = useCallback(
    (traitId: string) => {
      if (!pf1Data) {
        return;
      }

      update({
        traits: pf1Data.traits.filter((trait) => trait.id !== traitId),
      } as Partial<D20LegacyData>);
    },
    [pf1Data, update]
  );

  const addSpellLevel = useCallback(() => {
    const spellSlots = sys.spellsPerDay ?? {};
    const spellSlotLevels = Object.keys(spellSlots)
      .map((level) => Number(level))
      .filter((level) => Number.isFinite(level));
    const nextLevel = spellSlotLevels.length > 0 ? Math.max(...spellSlotLevels) + 1 : 0;

    update({
      spellsPerDay: {
        ...spellSlots,
        // Class tables contribute 0 at a level they don't list, so record the
        // whole starting total as a manual bonus — otherwise the engine's next
        // prepare would snap the new row back to 0/0.
        [nextLevel]: { total: 1, used: 0, manualBonus: 1 },
      },
    } as Partial<D20LegacyData>);
  }, [sys.spellsPerDay, update]);

  const addKnownSpell = useCallback(
    (spell: Spell) => {
      const existingSpellIds = sys.spellsKnown ?? [];
      if (existingSpellIds.includes(spell.id)) {
        return;
      }

      update({
        spellsKnown: [...existingSpellIds, spell.id],
      } as Partial<D20LegacyData>);
    },
    [sys.spellsKnown, update]
  );

  const removeKnownSpell = useCallback(
    (spellId: string) => {
      const nextSpellIds = (sys.spellsKnown ?? []).filter((entry) => entry !== spellId);
      const retainedSpellIds = new Set(nextSpellIds);

      update({
        spellsKnown: nextSpellIds,
        preparedSpellsByLevel: prunePreparedSpellLevels(
          sys.preparedSpellsByLevel,
          retainedSpellIds
        ),
      } as Partial<D20LegacyData>);
    },
    [prunePreparedSpellLevels, sys.preparedSpellsByLevel, sys.spellsKnown, update]
  );

  const setPreparedSpell = useCallback(
    (level: number, slotIndex: number, spellId: string) => {
      update({
        preparedSpellsByLevel: setD20LegacyPreparedSpell(
          sys.preparedSpellsByLevel,
          level,
          slotIndex,
          spellId
        ),
      } as Partial<D20LegacyData>);
    },
    [sys.preparedSpellsByLevel, update]
  );

  const useSpellSlot = useCallback(
    (level: number) => {
      const nextSpellsPerDay = spendD20LegacySpellSlot(sys.spellsPerDay, level);
      if (nextSpellsPerDay === sys.spellsPerDay) {
        return;
      }

      update({
        spellsPerDay: nextSpellsPerDay,
      } as Partial<D20LegacyData>);
    },
    [sys.spellsPerDay, update]
  );

  const recoverSpellSlot = useCallback(
    (level: number) => {
      const nextSpellsPerDay = recoverD20LegacySpellSlot(sys.spellsPerDay, level);
      if (nextSpellsPerDay === sys.spellsPerDay) {
        return;
      }

      update({
        spellsPerDay: nextSpellsPerDay,
      } as Partial<D20LegacyData>);
    },
    [sys.spellsPerDay, update]
  );

  const setSpellSlotTotal = useCallback(
    (level: number, total: number) => {
      const nextSpellsPerDay = setD20LegacySpellSlotTotal(sys.spellsPerDay, level, total);
      if (nextSpellsPerDay === sys.spellsPerDay) {
        return;
      }

      update({
        spellsPerDay: nextSpellsPerDay,
      } as Partial<D20LegacyData>);
    },
    [sys.spellsPerDay, update]
  );

  const setManualExtraConsumed = useCallback(
    (kind: 'domain' | 'specialist', level: number, consumed: boolean) => {
      const current = sys.manualSpellcastingExtras ?? {};
      update({
        manualSpellcastingExtras: {
          ...current,
          ...(kind === 'domain'
            ? {
                domainSlotConsumedByLevel: {
                  ...(current.domainSlotConsumedByLevel ?? {}),
                  [level]: consumed,
                },
              }
            : {
                specialistSlotConsumedByLevel: {
                  ...(current.specialistSlotConsumedByLevel ?? {}),
                  [level]: consumed,
                },
              }),
        },
      } as Partial<D20LegacyData>);
    },
    [sys.manualSpellcastingExtras, update]
  );

  const setSpontaneousConversionReference = useCallback(
    (reference: 'cure' | 'inflict' | 'both') => {
      update({
        manualSpellcastingExtras: {
          ...(sys.manualSpellcastingExtras ?? {}),
          spontaneousConversionReference: reference,
        },
      } as Partial<D20LegacyData>);
    },
    [sys.manualSpellcastingExtras, update]
  );

  const setDragonDiscipleBonusSlots = useCallback(
    (patch: Partial<{ total: number; used: number }>) => {
      const current = sys.manualSpellcastingExtras?.dragonDiscipleBonusSlots ?? {
        total: 0,
        used: 0,
      };
      const total = Math.max(0, patch.total ?? current.total);
      const used = Math.min(total, Math.max(0, patch.used ?? current.used));

      update({
        manualSpellcastingExtras: {
          ...(sys.manualSpellcastingExtras ?? {}),
          dragonDiscipleBonusSlots: { total, used },
        },
      } as Partial<D20LegacyData>);
    },
    [sys.manualSpellcastingExtras, update]
  );

  const addFeat = useCallback(() => {
    update({
      feats: [
        ...sys.feats,
        {
          id: `feat-${Date.now()}`,
          name: 'New Feat',
          description: '',
          source: 'Custom',
        },
      ],
    } as Partial<D20LegacyData>);
  }, [sys.feats, update]);

  const addItem = useCallback(
    (item: { id: string; name: string; quantity: number; weight: number }) => {
      update({
        inventory: [
          ...sys.inventory,
          {
            itemId: item.id,
            name: item.name,
            quantity: item.quantity,
            weight: item.weight,
          },
        ],
      } as Partial<D20LegacyData>);
    },
    [sys.inventory, update]
  );

  return {
    canUpdate,
    selectedTraitId,
    setSelectedTraitId,
    update,
    replaceDocument,
    onNameChange,
    onShortRest,
    onLongRest,
    addTrait,
    removeTrait,
    addSpellLevel,
    addKnownSpell,
    removeKnownSpell,
    setPreparedSpell,
    useSpellSlot,
    recoverSpellSlot,
    setSpellSlotTotal,
    setManualExtraConsumed,
    setSpontaneousConversionReference,
    setDragonDiscipleBonusSlots,
    addFeat,
    addItem,
  };
}
