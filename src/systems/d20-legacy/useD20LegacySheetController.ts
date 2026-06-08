import { useEffect, useMemo } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId, Skill } from '../../types/game-systems';
import { systemRegistry } from '../../registry';
import type { Dnd35eDataModel } from '../dnd35e/data-model';
import type { Pf1eTrait } from '../pf1e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';
import { getD20LegacySpellSlotTable } from '../../utils/d20LegacySpellcasting';
import { getIterativeAttackBonuses, type D20LegacyData } from './d20LegacySheetShared';
import { useD20LegacyMutationHandlers } from './useD20LegacyMutationHandlers';
import { useD20LegacySheetResources } from './useD20LegacySheetResources';
import { useD20LegacyTemplateHandlers } from './useD20LegacyTemplateHandlers';

interface UseD20LegacySheetControllerProps {
  document: CharacterDocument<SystemDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

function normalizeD20LegacySpellListId(classId: string): string {
  return classId.replace(/-(?:35e|pf1e)$/, '');
}

export function useD20LegacySheetController({
  document,
  onUpdate,
}: UseD20LegacySheetControllerProps) {
  const typedDocument = document as CharacterDocument<D20LegacyData>;
  const sys = typedDocument.system;
  const systemId = typedDocument.systemId as GameSystemId;
  const isPf1e = systemId === 'pf1e';
  const pf1Data = isPf1e ? (sys as Pf1eDataModel) : null;
  const canUpdate = Boolean(onUpdate);

  const {
    baseAttributes,
    hitPoints,
    baseAttackBonus,
    armorClass,
    initiative,
    speed,
    saves,
    skillRanks,
    features,
    feats,
    inventory,
  } = sys;

  const grapple = isPf1e ? undefined : (sys as Dnd35eDataModel).grapple;
  const cmb = isPf1e ? (sys as Pf1eDataModel).cmb : undefined;
  const cmd = isPf1e ? (sys as Pf1eDataModel).cmd : undefined;
  const iterativeAttackBonuses = useMemo(
    () => getIterativeAttackBonuses(baseAttackBonus),
    [baseAttackBonus]
  );
  const spellSlots = useMemo(() => sys.spellsPerDay ?? {}, [sys.spellsPerDay]);
  const spellSlotLevels = useMemo(
    () =>
      Object.keys(spellSlots)
        .map((level) => Number(level))
        .filter((level) => Number.isFinite(level))
        .sort((left, right) => left - right),
    [spellSlots]
  );
  const skills = useMemo(() => (systemRegistry.get(systemId)?.skills ?? []) as Skill[], [systemId]);

  const {
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
  } = useD20LegacySheetResources({ systemId, isPf1e });
  const spellListIds = useMemo(() => {
    const classCatalog = new Map(classes.map((entry) => [entry.id, entry]));

    return [
      ...new Set(
        sys.classLevels.flatMap((classLevel) => {
          const classData = classCatalog.get(classLevel.classId);
          if (!getD20LegacySpellSlotTable(systemId, classData)) {
            return [];
          }

          return [normalizeD20LegacySpellListId(classLevel.classId)];
        })
      ),
    ];
  }, [classes, sys.classLevels, systemId]);
  const mutationHandlers = useD20LegacyMutationHandlers({
    typedDocument,
    onUpdate,
    pf1Data,
    traitOptions,
  });

  useEffect(() => {
    if (!isPf1e) {
      mutationHandlers.setSelectedTraitId('');
      return;
    }

    void loadTraitOptions();
  }, [isPf1e, loadTraitOptions, mutationHandlers]);

  const selectedSpecies = useMemo(
    () => species.find((entry) => entry.id === sys.speciesId),
    [species, sys.speciesId]
  );

  const templateHandlers = useD20LegacyTemplateHandlers({
    typedDocument,
    systemId,
    sys,
    isPf1e,
    classes,
    replaceDocument: mutationHandlers.replaceDocument,
    update: mutationHandlers.update,
  });

  return {
    headerProps: {
      documentName: typedDocument.name,
      isPf1e,
      level: (sys.level as number) ?? 1,
      favoredClassSkillBonus: pf1Data?.favoredClassSkillBonus ?? 0,
      speciesId: sys.speciesId,
      speciesOptions: species,
      sizeCategory: sys.sizeCategory,
      experiencePoints: sys.experiencePoints,
      canUpdate,
      onNameChange: mutationHandlers.onNameChange,
      onSpeciesChange: (speciesData: (typeof species)[number]) =>
        templateHandlers.applyRaceTemplate(speciesData, selectedSpecies),
      onLoadOptions: loadOptions,
      onSizeCategoryChange: (value: string) =>
        mutationHandlers.update({ sizeCategory: value } as Partial<D20LegacyData>),
      onExperiencePointsChange: (value: number) =>
        mutationHandlers.update({ experiencePoints: value } as Partial<D20LegacyData>),
    },
    classesProps: {
      systemId,
      totalLevel: (sys.level as number) ?? 1,
      classLevels: sys.classLevels,
      classes,
      pendingClassId: templateHandlers.pendingClassId,
      pendingClassLevel: templateHandlers.pendingClassLevel,
      classTemplateError: templateHandlers.classTemplateError,
      canUpdate,
      onPendingClassIdChange: templateHandlers.setPendingClassId,
      onPendingClassLevelChange: templateHandlers.setPendingClassLevel,
      onLoadOptions: loadOptions,
      onClassRowChange: templateHandlers.handleClassRowChange,
      onClassLevelChange: templateHandlers.handleClassLevelChange,
      onSpellcastingSelectionChange: templateHandlers.handleSpellcastingSelectionChange,
      onAddClass: templateHandlers.handleAddClass,
      onRemoveClass: templateHandlers.handleRemoveClass,
    },
    combatProps: {
      document: typedDocument,
      isPf1e,
      armorClass,
      hitPoints,
      baseAttackBonus,
      iterativeAttackBonuses,
      initiative,
      speed,
      grapple,
      cmb,
      cmd,
      canUpdate,
      onHitPointsChange: (current: number) =>
        mutationHandlers.update({ hitPoints: { ...hitPoints, current } } as Partial<D20LegacyData>),
      onApplyDamageOrHealing: (amount: number, type: 'damage' | 'heal') => {
        const newCurrent =
          type === 'damage'
            ? Math.max(0, hitPoints.current - amount)
            : Math.min(hitPoints.max, hitPoints.current + amount);

        mutationHandlers.update({
          hitPoints: { ...hitPoints, current: newCurrent },
        } as Partial<D20LegacyData>);
      },
    },
    restProps: {
      showExhaustion: false,
      onShortRest: mutationHandlers.onShortRest,
      onLongRest: mutationHandlers.onLongRest,
    },
    tabsProps: {
      document: typedDocument,
      systemId,
      isPf1e,
      canUpdate,
      baseAttributes,
      saves,
      skills,
      skillRanks,
      classSkills: sys.classSkills,
      features,
      feats,
      traits: (pf1Data?.traits ?? []) as Pf1eTrait[],
      traitOptions,
      traitsLoaded,
      selectedTraitId: mutationHandlers.selectedTraitId,
      featDefs,
      featsLoaded,
      onLoadFeatDefs: loadFeatDefs,
      spellsLoaded,
      spells,
      spellListIds,
      trackedSpellIds: sys.spellsKnown ?? [],
      preparedSpellsByLevel: sys.preparedSpellsByLevel ?? {},
      alwaysPreparedSpellIds: sys.alwaysPreparedSpellIds ?? [],
      spellSlots,
      spellSlotLevels,
      manualSpellcastingExtras: sys.manualSpellcastingExtras,
      onLoadSpells: loadSpells,
      equipmentLoaded,
      equipmentItems,
      onLoadEquipment: loadEquipment,
      monstersLoaded,
      monsters,
      onLoadMonsters: loadMonsters,
      currency: sys.currency,
      inventory,
      personality: sys.personality,
      notes: sys.notes,
      onBaseAttributesChange: (nextBaseAttributes: Record<string, number>) =>
        mutationHandlers.update({ baseAttributes: nextBaseAttributes } as Partial<D20LegacyData>),
      onSavesChange: (nextSaves: typeof saves) =>
        mutationHandlers.update({ saves: nextSaves } as Partial<D20LegacyData>),
      onSkillRanksChange: (nextSkillRanks: Record<string, number>) =>
        mutationHandlers.update({ skillRanks: nextSkillRanks } as Partial<D20LegacyData>),
      onRemoveFeat: (featId: string) =>
        mutationHandlers.update({
          feats: feats.filter((feat) => feat.id !== featId),
        } as Partial<D20LegacyData>),
      onAddFeat: mutationHandlers.addFeat,
      onSelectedTraitIdChange: mutationHandlers.setSelectedTraitId,
      onLoadTraitOptions: loadTraitOptions,
      onAddTrait: mutationHandlers.addTrait,
      onRemoveTrait: mutationHandlers.removeTrait,
      onAddSpellLevel: mutationHandlers.addSpellLevel,
      onAddKnownSpell: mutationHandlers.addKnownSpell,
      onRemoveKnownSpell: mutationHandlers.removeKnownSpell,
      onSetPreparedSpell: mutationHandlers.setPreparedSpell,
      onUseSpellSlot: mutationHandlers.useSpellSlot,
      onRecoverSpellSlot: mutationHandlers.recoverSpellSlot,
      onSetSpellSlotTotal: mutationHandlers.setSpellSlotTotal,
      onSetManualExtraConsumed: mutationHandlers.setManualExtraConsumed,
      onSetSpontaneousConversionReference: mutationHandlers.setSpontaneousConversionReference,
      onSetDragonDiscipleBonusSlots: mutationHandlers.setDragonDiscipleBonusSlots,
      onCurrencyChange: (currency: typeof sys.currency) =>
        mutationHandlers.update({ currency } as Partial<D20LegacyData>),
      onAddItem: mutationHandlers.addItem,
      onRemoveItem: (itemId: string) =>
        mutationHandlers.update({
          inventory: inventory.filter((item) => item.itemId !== itemId),
        } as Partial<D20LegacyData>),
      onDescriptionChange: (value: string) =>
        mutationHandlers.update({
          personality: { ...sys.personality, description: value },
        } as Partial<D20LegacyData>),
      onBackstoryChange: (value: string) =>
        mutationHandlers.update({
          personality: { ...sys.personality, backstory: value },
        } as Partial<D20LegacyData>),
      onNotesChange: (value: string) =>
        mutationHandlers.update({ notes: value } as Partial<D20LegacyData>),
    },
  };
}
