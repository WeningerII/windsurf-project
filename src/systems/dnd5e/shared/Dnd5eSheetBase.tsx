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
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';
import { useDnd5eSheetController } from './useDnd5eSheetController';

interface Props<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  enableWeaponMasteries?: boolean;
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const SKILLS: Array<{ id: string; name: string; ability: string }> = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'animal-handling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
];
const SKILL_NAMES = new Map(SKILLS.map((skill) => [skill.id, skill.name]));

const WEAPON_MASTERY_OPTIONS = [
  'Cleave',
  'Graze',
  'Nick',
  'Push',
  'Sap',
  'Slow',
  'Topple',
  'Vex',
] as const;

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
        skillNames={SKILL_NAMES}
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
        onHitPointsChange={(patch) =>
          updatePatch({
            hitPoints: {
              ...d.hitPoints,
              ...(patch.current != null ? { current: patch.current } : {}),
              ...(patch.max != null ? { max: patch.max } : {}),
            },
          })
        }
        onDamageHeal={controller.handleDamageHeal}
        onExhaustionChange={(exhaustionLevel) => updatePatch({ exhaustionLevel })}
        onShortRest={() => controller.replaceSystem(controller.applyDnd5eShortRest(d) as T)}
        onLongRest={() => controller.replaceSystem(controller.applyDnd5eLongRest(d) as T)}
        onDeathSavesChange={(deathSaves) => updatePatch({ deathSaves })}
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
          abilityNames={ABILITY_NAMES}
          canUpdate={Boolean(onUpdate)}
          onUpdate={(attributes) => updatePatch({ baseAttributes: attributes })}
        />

        <Dnd5eSavesTab
          abilityNames={ABILITY_NAMES}
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
          skills={SKILLS}
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
          abilityNames={ABILITY_NAMES}
          skillNames={SKILL_NAMES}
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
            onCurrencyChange={
              onUpdate
                ? (currency) => updatePatch({ currency: currency as unknown as typeof d.currency })
                : undefined
            }
            onUnequip={
              onUpdate
                ? (itemId) =>
                    updatePatch({
                      equipment: d.equipment.filter((entry) => entry.itemId !== itemId),
                    })
                : undefined
            }
            onToggleAttune={
              onUpdate
                ? (itemId) =>
                    updatePatch({
                      equipment: d.equipment.map((entry) =>
                        entry.itemId === itemId ? { ...entry, attuned: !entry.attuned } : entry
                      ),
                    })
                : undefined
            }
            onAddInventoryItem={
              onUpdate
                ? (item) =>
                    updatePatch({
                      inventory: [
                        ...d.inventory,
                        {
                          itemId: item.id,
                          quantity: item.quantity,
                          customName: item.name,
                          notes: item.description,
                        },
                      ],
                    })
                : undefined
            }
            onRemoveInventoryItem={
              onUpdate
                ? (itemId) =>
                    updatePatch({
                      inventory: d.inventory.filter((entry) => entry.itemId !== itemId),
                    })
                : undefined
            }
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
          onAppearanceChange={
            onUpdate
              ? (appearance) =>
                  updatePatch({
                    personality: {
                      ...d.personality,
                      appearance,
                    },
                  })
              : undefined
          }
          onBackstoryChange={
            onUpdate
              ? (backstory) =>
                  updatePatch({
                    personality: {
                      ...d.personality,
                      backstory,
                    },
                  })
              : undefined
          }
          onPersonalityFieldChange={
            onUpdate
              ? (field, value) =>
                  updatePatch({
                    personality: {
                      ...d.personality,
                      [field]: value,
                    },
                  })
              : undefined
          }
          onNotesChange={onUpdate ? (notes) => updatePatch({ notes }) : undefined}
        />

        {enableWeaponMasteries && (
          <Dnd5eWeaponMasteriesTab
            weaponMasteries={controller.weaponMasteries}
            options={WEAPON_MASTERY_OPTIONS}
            canUpdate={Boolean(onUpdate)}
            onToggleMastery={onUpdate ? controller.toggleWeaponMastery : undefined}
          />
        )}
      </Tabs>
    </div>
  );
}
