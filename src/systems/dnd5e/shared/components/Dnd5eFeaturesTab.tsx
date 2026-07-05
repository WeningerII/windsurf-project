// purpose: Features tab body — renders class/subclass/feat features and the condition picker.
import { ConditionPicker } from '../../../../components/ConditionPicker';
import { FeaturesSection } from '../../../../components/FeaturesSection';
import { ProficiencyListSection } from '../../../../components/ProficiencyListSection';
import { TabsContent } from '../../../../components/ui/Tabs';
import { Background } from '../../../../types/character-options/backgrounds';
import { FeatDefinition } from '../../../../types/character-options/feats';
import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionSelection,
} from '../../../../types/character-options/feature-options';
import { Species } from '../../../../types/character-options/species';
import { Feat, Feature } from '../../../../types/core/character';
import type { Dnd5eFeatChoiceRequirement, Dnd5eFeatSelections } from '../featTemplate';
import { DND5E_CONDITION_NAMES, Dnd5eCondition } from '../../../dnd5e/conditions';
import { Dnd5eFeatureOptionsSection } from './Dnd5eFeatureOptionsSection';
import { Dnd5eRiderTogglesSection } from './Dnd5eRiderTogglesSection';
import { Dnd5eBackgroundSection } from './Dnd5eBackgroundSection';
import { Dnd5eSelectedFeatsSection } from './Dnd5eSelectedFeatsSection';
import { Dnd5eSpeciesSection } from './Dnd5eSpeciesSection';

type ChoiceSlot = {
  slotIndex: number;
  label: string;
  value: string;
  options: string[];
};

interface Props {
  features: Feature[];
  feats: Feat[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languageProficiencies: string[];
  conditions: Dnd5eCondition[];
  selectedSpecies?: Species;
  selectedBackground?: Background;
  speciesAbilitySlots: ChoiceSlot[];
  speciesLanguageSlots: ChoiceSlot[];
  speciesSkillSlots: ChoiceSlot[];
  speciesToolSlots: ChoiceSlot[];
  backgroundFixedTools: string[];
  backgroundToolSlots: ChoiceSlot[];
  backgroundLanguageSlots: ChoiceSlot[];
  featTemplateError: string | null;
  featureOptionError: string | null;
  featDefinitionsById: Map<string, FeatDefinition>;
  selectedFeatureOptions: Dnd5eFeatureOptionDefinition[];
  eligibleFeatureOptions: Dnd5eFeatureOptionDefinition[];
  featureOptionSelections: Dnd5eFeatureOptionSelection[];
  featureOptionsLoaded: boolean;
  showFeatureOptionBrowser: boolean;
  abilityNames: Record<string, string>;
  skillNames: Map<string, string>;
  canUpdate: boolean;
  resolveFeatSelections: (
    featDefinition: FeatDefinition,
    feat: Feat,
    baseAttributes: Record<string, number>
  ) => Dnd5eFeatSelections;
  optionDisabledForRequirement: (
    requirement: Dnd5eFeatChoiceRequirement,
    selections: string[],
    selectionIndex: number,
    optionId: string
  ) => boolean;
  baseAttributes: Record<string, number>;
  onFeatureUse?: (featureId: string) => void;
  onRecoverFeature?: (featureId: string) => void;
  onSpeciesAbilityChange?: (slotIndex: number, abilityId: string) => void;
  onSpeciesLanguageChange?: (slotIndex: number, language: string) => void;
  onSpeciesSkillChange?: (slotIndex: number, skillId: string) => void;
  onSpeciesToolChange?: (slotIndex: number, toolId: string) => void;
  onBackgroundToolChange?: (slotIndex: number, toolId: string) => void;
  onBackgroundLanguageChange?: (slotIndex: number, language: string) => void;
  onFeatRemove?: (featId: string) => void;
  onFeatSelectionChange?: (
    featDefinition: FeatDefinition,
    featId: string,
    requirementId: string,
    selectionIndex: number,
    optionId: string
  ) => void;
  onFeatureOptionRemove?: (selection: {
    id: string;
    group: Dnd5eFeatureOptionSelection['group'];
  }) => void;
  onFeatureOptionSelect?: (option: Dnd5eFeatureOptionDefinition) => void;
  onConditionChange?: (conditions: Dnd5eCondition[]) => void;
  /** Rider toggle ids this character is eligible for (feature/feat-gated). */
  availableToggles: string[];
  activeToggles: string[];
  onActiveTogglesChange?: (activeToggles: string[]) => void;
}

type Dnd5eFeaturesTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Dnd5eFeaturesTab = (({
  features,
  feats,
  armorProficiencies,
  weaponProficiencies,
  toolProficiencies,
  languageProficiencies,
  conditions,
  selectedSpecies,
  selectedBackground,
  speciesAbilitySlots,
  speciesLanguageSlots,
  speciesSkillSlots,
  speciesToolSlots,
  backgroundFixedTools,
  backgroundToolSlots,
  backgroundLanguageSlots,
  featTemplateError,
  featureOptionError,
  featDefinitionsById,
  selectedFeatureOptions,
  eligibleFeatureOptions,
  featureOptionSelections,
  featureOptionsLoaded,
  showFeatureOptionBrowser,
  abilityNames,
  skillNames,
  canUpdate,
  resolveFeatSelections,
  optionDisabledForRequirement,
  baseAttributes,
  onFeatureUse,
  onRecoverFeature,
  onSpeciesAbilityChange,
  onSpeciesLanguageChange,
  onSpeciesSkillChange,
  onSpeciesToolChange,
  onBackgroundToolChange,
  onBackgroundLanguageChange,
  onFeatRemove,
  onFeatSelectionChange,
  onFeatureOptionRemove,
  onFeatureOptionSelect,
  onConditionChange,
  availableToggles,
  activeToggles,
  onActiveTogglesChange,
}: Props) => {
  return (
    <TabsContent value="features" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FeaturesSection
          features={features}
          onUseFeature={onFeatureUse}
          onRecoverFeature={onRecoverFeature}
        />
        <ProficiencyListSection
          armor={armorProficiencies}
          weapons={weaponProficiencies}
          tools={toolProficiencies}
          languages={languageProficiencies}
        />
      </div>

      {selectedSpecies && (
        <Dnd5eSpeciesSection
          selectedSpecies={selectedSpecies}
          speciesAbilitySlots={speciesAbilitySlots}
          speciesLanguageSlots={speciesLanguageSlots}
          speciesSkillSlots={speciesSkillSlots}
          speciesToolSlots={speciesToolSlots}
          abilityNames={abilityNames}
          skillNames={skillNames}
          canUpdate={canUpdate}
          onSpeciesAbilityChange={onSpeciesAbilityChange}
          onSpeciesLanguageChange={onSpeciesLanguageChange}
          onSpeciesSkillChange={onSpeciesSkillChange}
          onSpeciesToolChange={onSpeciesToolChange}
        />
      )}

      {selectedBackground && (
        <Dnd5eBackgroundSection
          selectedBackground={selectedBackground}
          backgroundFixedTools={backgroundFixedTools}
          backgroundToolSlots={backgroundToolSlots}
          backgroundLanguageSlots={backgroundLanguageSlots}
          canUpdate={canUpdate}
          onBackgroundToolChange={onBackgroundToolChange}
          onBackgroundLanguageChange={onBackgroundLanguageChange}
        />
      )}

      <Dnd5eSelectedFeatsSection
        feats={feats}
        featTemplateError={featTemplateError}
        featDefinitionsById={featDefinitionsById}
        canUpdate={canUpdate}
        resolveFeatSelections={resolveFeatSelections}
        optionDisabledForRequirement={optionDisabledForRequirement}
        baseAttributes={baseAttributes}
        onFeatRemove={onFeatRemove}
        onFeatSelectionChange={onFeatSelectionChange}
      />

      {showFeatureOptionBrowser && (
        <Dnd5eFeatureOptionsSection
          featureOptionError={featureOptionError}
          selectedFeatureOptions={selectedFeatureOptions}
          eligibleFeatureOptions={eligibleFeatureOptions}
          featureOptionSelections={featureOptionSelections}
          featureOptionsLoaded={featureOptionsLoaded}
          canUpdate={canUpdate}
          onFeatureOptionRemove={onFeatureOptionRemove}
          onFeatureOptionSelect={onFeatureOptionSelect}
        />
      )}

      <Dnd5eRiderTogglesSection
        availableToggles={availableToggles}
        activeToggles={activeToggles}
        onChange={onActiveTogglesChange}
      />

      <ConditionPicker
        conditions={conditions}
        availableConditions={DND5E_CONDITION_NAMES}
        onChange={onConditionChange}
      />
    </TabsContent>
  );
}) as Dnd5eFeaturesTabComponent;

Dnd5eFeaturesTab.preload = () => Dnd5eFeatureOptionsSection.preload();
