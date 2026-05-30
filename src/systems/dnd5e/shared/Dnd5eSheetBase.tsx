/**
 * Shared D&D 5e sheet host (2014 + 2024 editions).
 *
 * Role: Tabs container + top-level section orchestration only. Sheet-local
 * state lives in `useDnd5eSheetController`; tab bodies live in `./components/`.
 *
 * Budget: enforced at <=400 LOC by `src/__tests__/hostSizeBudget.test.ts`.
 * Do not add: inline state management, feature-specific logic, or per-tab data
 * loaders here. New tabs go in `./components/Dnd5e*.tsx` and register below.
 */
import { Tabs, TabsContent } from '../../../components/ui/Tabs';
import { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import { Dnd5eAbilitiesTab } from './components/Dnd5eAbilitiesTab';
import { Dnd5eEquipmentTab } from './components/Dnd5eEquipmentTab';
import { Dnd5eFeaturesTab } from './components/Dnd5eFeaturesTab';
import { Dnd5eFeatBrowserTab } from './components/Dnd5eFeatBrowserTab';
import { Dnd5eHeaderSection } from './components/Dnd5eHeaderSection';
import { Dnd5eMonsterBrowserTab } from './components/Dnd5eMonsterBrowserTab';
import { Dnd5eClassesSection } from './components/Dnd5eClassesSection';
import { Dnd5eNotesTab } from './components/Dnd5eNotesTab';
import { Dnd5eOverviewSection } from './components/Dnd5eOverviewSection';
import { Dnd5eSavesTab } from './components/Dnd5eSavesTab';
import { Dnd5eSkillsTab } from './components/Dnd5eSkillsTab';
import { Dnd5eSpellsTab } from './components/Dnd5eSpellsTab';
import { Dnd5eTabsNavigation } from './components/Dnd5eTabsNavigation';
import { Dnd5eWeaponMasteriesTab } from './components/Dnd5eWeaponMasteriesTab';
import {
  DND5E_ABILITY_NAMES,
  DND5E_SKILLS,
  DND5E_SKILL_NAMES,
  DND5E_WEAPON_MASTERY_OPTIONS,
} from './dnd5eSheetConstants';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';
import { useDnd5eSheetController } from './useDnd5eSheetController';

interface Props<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  enableWeaponMasteries?: boolean;
}

export function Dnd5eSheetBase<T extends Dnd5eLikeDataModel>({
  document,
  onUpdate,
  enableWeaponMasteries = false,
}: Props<T>) {
  const controller = useDnd5eSheetController({
    document,
    onUpdate,
    enableWeaponMasteries,
  });
  const d = controller.d;
  const updatePatch = (patch: Partial<Dnd5eLikeDataModel>) =>
    controller.update(patch as unknown as Partial<T>);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <Dnd5eHeaderSection
        name={document.name}
        profBonus={controller.profBonus}
        level={d.level}
        speciesId={d.speciesId}
        species={controller.species}
        backgroundId={d.backgroundId}
        backgrounds={controller.backgrounds}
        experiencePoints={d.experiencePoints}
        canUpdate={Boolean(onUpdate)}
        onNameChange={controller.onNameChange}
        onSpeciesChange={controller.handleSpeciesChange}
        onBackgroundChange={controller.handleBackgroundChange}
        onExperiencePointsChange={(experiencePoints) => updatePatch({ experiencePoints })}
      />

      <Dnd5eClassesSection
        classLevels={d.classLevels}
        classes={controller.classes}
        totalLevel={d.level}
        skillProficiencies={d.skillProficiencies}
        toolProficiencies={d.toolProficiencies}
        pendingClassId={controller.pendingClassId}
        pendingClassLevel={controller.pendingClassLevel}
        classTemplateError={controller.classTemplateError}
        skillNames={DND5E_SKILL_NAMES}
        canUpdate={controller.canUpdate}
        onPendingClassIdChange={controller.setPendingClassId}
        onPendingClassLevelChange={controller.setPendingClassLevel}
        onClassRowChange={controller.handleClassRowChange}
        onClassLevelChange={controller.handleClassLevelChange}
        onSubclassChange={controller.handleSubclassChange}
        onClassSkillSelectionChange={controller.handleClassSkillSelectionChange}
        onClassToolSelectionChange={controller.handleClassToolSelectionChange}
        onAddClass={controller.handleAddClass}
        onRemoveClass={controller.handleRemoveClass}
      />

      <Dnd5eOverviewSection
        armorClass={d.armorClass}
        hitPoints={d.hitPoints}
        initiative={d.initiative}
        speed={d.speed}
        spellcasting={d.spellcasting}
        exhaustionLevel={d.exhaustionLevel}
        deathSaves={d.deathSaves}
        hitDice={d.hitDice}
        canUpdate={Boolean(onUpdate)}
        onHitPointsChange={onUpdate ? controller.handleHitPointsChange : undefined}
        onDamageHeal={controller.handleDamageHeal}
        onExhaustionChange={onUpdate ? controller.handleExhaustionChange : undefined}
        onShortRest={() => controller.replaceSystem(controller.applyDnd5eShortRest(d) as T)}
        onLongRest={() => controller.replaceSystem(controller.applyDnd5eLongRest(d) as T)}
        onDeathSavesChange={onUpdate ? controller.handleDeathSavesChange : undefined}
        onSpendHitDie={(index) => controller.handleHitDiceChange(index, -1)}
        onRecoverHitDie={(index) => controller.handleHitDiceChange(index, 1)}
        onUseSpellSlot={(level) => controller.handleSpellSlotChange(level, 1)}
        onRecoverSpellSlot={(level) => controller.handleSpellSlotChange(level, -1)}
        onRecoverAllSpellSlots={controller.recoverAllSpellSlots}
      />

      <Tabs defaultValue="abilities">
        <Dnd5eTabsNavigation
          showFeatBrowser={controller.showFeatBrowser}
          showWeaponMasteries={enableWeaponMasteries}
          onWarmFeatures={controller.warmFeaturesTab}
          onWarmSpells={controller.warmSpellsTab}
          onWarmFeats={controller.warmFeatBrowser}
          onWarmEquipment={controller.warmEquipmentTab}
          onWarmMonsters={controller.warmMonsterBrowser}
        />

        <Dnd5eAbilitiesTab
          attributes={d.baseAttributes}
          abilityNames={DND5E_ABILITY_NAMES}
          canUpdate={Boolean(onUpdate)}
          onUpdate={(attributes) => updatePatch({ baseAttributes: attributes })}
        />

        <Dnd5eSavesTab
          abilityNames={DND5E_ABILITY_NAMES}
          attributes={d.baseAttributes}
          savingThrowProficiencies={d.savingThrowProficiencies}
          profBonus={controller.profBonus}
          canUpdate={Boolean(onUpdate)}
          onToggleProficiency={onUpdate ? controller.toggleSaveProficiency : undefined}
          onRollSave={
            controller.systemDef
              ? (abilityId) => controller.systemDef!.engine.rollCheck(document, `save-${abilityId}`)
              : undefined
          }
        />

        <Dnd5eSkillsTab
          skills={DND5E_SKILLS}
          attributes={d.baseAttributes}
          skillProficiencies={d.skillProficiencies}
          profBonus={controller.profBonus}
          canUpdate={Boolean(onUpdate)}
          onToggleProficiency={onUpdate ? controller.toggleSkillProficiency : undefined}
          onRollSkill={
            controller.systemDef
              ? (skillId) => controller.systemDef!.engine.rollCheck(document, skillId)
              : undefined
          }
        />

        <Dnd5eFeaturesTab
          features={d.features}
          feats={d.feats}
          armorProficiencies={d.armorProficiencies}
          weaponProficiencies={d.weaponProficiencies}
          toolProficiencies={d.toolProficiencies}
          languageProficiencies={d.languageProficiencies}
          conditions={d.conditions}
          selectedSpecies={controller.selectedSpecies}
          selectedBackground={controller.selectedBackground}
          speciesAbilitySlots={controller.speciesAbilitySlots}
          speciesLanguageSlots={controller.speciesLanguageSlots}
          speciesSkillSlots={controller.speciesSkillSlots}
          speciesToolSlots={controller.speciesToolSlots}
          backgroundFixedTools={controller.backgroundFixedTools}
          backgroundToolSlots={controller.backgroundToolSlots}
          backgroundLanguageSlots={controller.backgroundLanguageSlots}
          featTemplateError={controller.featTemplateError}
          featureOptionError={controller.featureOptionError}
          featDefinitionsById={controller.featDefinitionsById}
          selectedFeatureOptions={controller.selectedFeatureOptions}
          eligibleFeatureOptions={controller.eligibleFeatureOptions}
          featureOptionSelections={controller.featureOptionSelections}
          featureOptionsLoaded={controller.featureOptionsLoaded}
          showFeatureOptionBrowser={controller.showFeatureOptionBrowser}
          abilityNames={DND5E_ABILITY_NAMES}
          skillNames={DND5E_SKILL_NAMES}
          canUpdate={controller.canUpdate}
          resolveFeatSelections={controller.resolveFeatSelections}
          optionDisabledForRequirement={controller.optionDisabledForRequirement}
          baseAttributes={d.baseAttributes}
          onFeatureUse={
            onUpdate ? (featureId) => controller.handleFeatureUse(featureId, -1) : undefined
          }
          onRecoverFeature={
            onUpdate ? (featureId) => controller.handleFeatureUse(featureId, 1) : undefined
          }
          onSpeciesAbilityChange={onUpdate ? controller.handleSpeciesAbilityChange : undefined}
          onSpeciesLanguageChange={onUpdate ? controller.handleSpeciesLanguageChange : undefined}
          onSpeciesSkillChange={onUpdate ? controller.handleSpeciesSkillChange : undefined}
          onSpeciesToolChange={onUpdate ? controller.handleSpeciesToolChange : undefined}
          onBackgroundToolChange={onUpdate ? controller.handleBackgroundToolChange : undefined}
          onBackgroundLanguageChange={
            onUpdate ? controller.handleBackgroundLanguageChange : undefined
          }
          onFeatRemove={onUpdate ? controller.handleFeatRemove : undefined}
          onFeatSelectionChange={onUpdate ? controller.handleFeatSelectionChange : undefined}
          onFeatureOptionRemove={onUpdate ? controller.handleFeatureOptionRemove : undefined}
          onFeatureOptionSelect={onUpdate ? controller.handleFeatureOptionSelect : undefined}
          onConditionChange={onUpdate ? (conditions) => updatePatch({ conditions }) : undefined}
        />

        <Dnd5eSpellsTab
          spellcasting={d.spellcasting}
          spellsLoaded={controller.spellsLoaded}
          spells={controller.spells}
          spellNames={controller.spellNames}
          alwaysPreparedSpellIds={controller.alwaysPreparedSpellIds}
          alwaysPreparedSpellSources={controller.alwaysPreparedSpellSources}
          preparedSpellIds={controller.preparedSpellIds}
          preparedCasterSummaries={controller.preparedCasterSummaries}
          onTogglePreparedSpell={onUpdate ? controller.handleTogglePreparedSpell : undefined}
          onSelectSpell={onUpdate ? controller.handleSpellSelect : undefined}
        />

        {controller.showFeatBrowser && (
          <Dnd5eFeatBrowserTab
            systemId={document.systemId}
            featsLoaded={controller.featsLoaded}
            featTemplateError={controller.featTemplateError}
            featDefs={controller.featDefs}
            onSelectFeat={onUpdate ? controller.handleFeatSelect : undefined}
          />
        )}

        <TabsContent value="equipment" className="space-y-4">
          <Dnd5eEquipmentTab
            currency={d.currency as unknown as Record<string, number>}
            equipment={d.equipment}
            inventory={d.inventory}
            equipmentItems={controller.equipmentItems}
            equippedNames={controller.equippedNames}
            equipmentLoaded={controller.equipmentLoaded}
            onCurrencyChange={onUpdate ? controller.handleCurrencyChange : undefined}
            onUnequip={onUpdate ? controller.handleUnequip : undefined}
            onToggleAttune={onUpdate ? controller.handleToggleAttune : undefined}
            onAddInventoryItem={onUpdate ? controller.handleAddInventoryItem : undefined}
            onRemoveInventoryItem={onUpdate ? controller.handleRemoveInventoryItem : undefined}
            onSelectEquipment={onUpdate ? controller.handleEquipmentSelect : undefined}
          />
        </TabsContent>

        <Dnd5eMonsterBrowserTab
          monstersLoaded={controller.monstersLoaded}
          monsters={controller.monsters}
        />

        <Dnd5eNotesTab
          personality={d.personality}
          notes={d.notes}
          canUpdate={Boolean(onUpdate)}
          onAppearanceChange={onUpdate ? controller.handleAppearanceChange : undefined}
          onBackstoryChange={onUpdate ? controller.handleBackstoryChange : undefined}
          onPersonalityFieldChange={onUpdate ? controller.handlePersonalityFieldChange : undefined}
          onNotesChange={onUpdate ? controller.handleNotesChange : undefined}
        />

        {enableWeaponMasteries && (
          <Dnd5eWeaponMasteriesTab
            weaponMasteries={controller.weaponMasteries}
            options={DND5E_WEAPON_MASTERY_OPTIONS}
            canUpdate={Boolean(onUpdate)}
            onToggleMastery={onUpdate ? controller.toggleWeaponMastery : undefined}
          />
        )}
      </Tabs>
    </div>
  );
}
