import { useEffect, useMemo } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId, Skill } from '../../types/game-systems';
import { systemRegistry } from '../../registry';
import { presentDerivedQuantities, type PresentedDerivedQuantity } from '../../rules/derivation';
import type { Dnd35eDataModel } from '../dnd35e/data-model';
import { DND35E_DERIVED_QUANTITIES } from '../dnd35e/derivedQuantities';
import type { Pf1eTrait } from '../pf1e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';
import { PF1E_DERIVED_QUANTITIES } from '../pf1e/derivedQuantities';
import { getD20LegacySpellSlotTable } from '../shared/d20LegacySpellcasting';
import { getIterativeAttackBonuses, type D20LegacyData } from './d20LegacySheetShared';
import { useD20LegacyMutationHandlers } from './useD20LegacyMutationHandlers';
import { availableD20LegacyToggles } from '../../rules/conditions/d20LegacyRiders';
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

  // Generic strip of declarative derived quantities. Each system declares its
  // own specs (src/systems/<id>/derivedQuantities.ts); the engine stores their
  // values on `sys.derived`, and presentDerivedQuantities selects/formats the
  // surfaced ones. New specs auto-surface with no further sheet edit.
  const derivedCards = useMemo<PresentedDerivedQuantity[]>(
    () =>
      isPf1e
        ? presentDerivedQuantities(
            PF1E_DERIVED_QUANTITIES,
            sys as Pf1eDataModel,
            (sys as Pf1eDataModel).derived
          )
        : presentDerivedQuantities(
            DND35E_DERIVED_QUANTITIES,
            sys as Dnd35eDataModel,
            (sys as Dnd35eDataModel).derived
          ),
    [isPf1e, sys]
  );

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

  // Depend on the stable setState setter, not the handlers object —
  // useD20LegacyMutationHandlers returns a fresh literal every render, which
  // would re-fire this effect each time.
  const { setSelectedTraitId } = mutationHandlers;
  useEffect(() => {
    if (!isPf1e) {
      setSelectedTraitId('');
      return;
    }

    void loadTraitOptions();
  }, [isPf1e, loadTraitOptions, setSelectedTraitId]);

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
    derivedCards,
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
      // 3.5e/PF1e have no 'short rest' rule; the handlers implement a brief
      // breather heal and the overnight recovery that resets daily spell slots.
      shortRestLabel: 'Rest',
      longRestLabel: 'Overnight Rest',
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
      conditions: sys.conditions ?? [],
      onConditionChange: (nextConditions: Array<{ id: string; name: string }>) =>
        mutationHandlers.update({ conditions: nextConditions } as Partial<D20LegacyData>),
      availableToggles: availableD20LegacyToggles({
        systemId: isPf1e ? 'pf1e' : 'dnd-3.5e',
        featIds: new Set((sys.feats ?? []).map((feat: { id: string }) => feat.id)),
      }),
      activeToggles: sys.activeToggles ?? [],
      onActiveTogglesChange: (activeToggles: string[]) =>
        mutationHandlers.update({ activeToggles } as Partial<D20LegacyData>),
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
      arcaneSpecialtySchool: sys.arcaneSpecialtySchool,
      onLoadSpells: loadSpells,
      equipmentLoaded,
      equipmentItems,
      onLoadEquipment: loadEquipment,
      onEquipArmor: mutationHandlers.equipArmor,
      onEquipShield: mutationHandlers.equipShield,
      onUnequipArmor: mutationHandlers.unequipArmor,
      onUnequipShield: mutationHandlers.unequipShield,
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
      onSetSpontaneousConversionReference: mutationHandlers.setSpontaneousConversionReference,
      onSetArcaneSpecialtySchool: mutationHandlers.setArcaneSpecialtySchool,
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
