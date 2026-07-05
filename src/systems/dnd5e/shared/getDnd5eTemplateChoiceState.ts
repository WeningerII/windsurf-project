import type { Background } from '../../../types/character-options/backgrounds';
import type { Species } from '../../../types/character-options/species';
import {
  getBackgroundFixedToolProficiencies,
  getBackgroundLanguageOptions,
  getBackgroundToolChoiceSlots,
} from './backgroundTemplate';
import {
  getDnd5eSpeciesAbilityChoiceSlots,
  getDnd5eSpeciesLanguageChoiceSlots,
  getDnd5eSpeciesSkillChoiceSlots,
  getDnd5eSpeciesToolChoiceSlots,
} from './speciesTemplate';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';

interface GetDnd5eTemplateChoiceStateProps<T extends Dnd5eLikeDataModel> {
  system: T;
  selectedSpecies?: Species;
  selectedBackground?: Background;
}

export function getDnd5eTemplateChoiceState<T extends Dnd5eLikeDataModel>({
  system,
  selectedSpecies,
  selectedBackground,
}: GetDnd5eTemplateChoiceStateProps<T>) {
  const speciesAbilitySlots = selectedSpecies
    ? getDnd5eSpeciesAbilityChoiceSlots(selectedSpecies).map((slot, index) => {
        const selectedValues = system.speciesAbilitySelections || [];
        const currentValue = selectedValues[index] || '';
        const blockedValues = new Set(
          selectedValues.filter((value, selectionIndex) => value && selectionIndex !== index)
        );

        return {
          ...slot,
          slotIndex: index,
          value: currentValue,
          options: slot.options.filter(
            (option) => option === currentValue || !blockedValues.has(option)
          ),
        };
      })
    : [];

  const retainedSpeciesLanguages = selectedSpecies
    ? (system.languageProficiencies || []).filter((language) => {
        if (selectedSpecies.languages.automatic?.includes(language)) {
          return false;
        }

        return !(system.speciesLanguageSelections || []).includes(language);
      })
    : system.languageProficiencies || [];

  const speciesLanguageSlots = selectedSpecies
    ? getDnd5eSpeciesLanguageChoiceSlots(selectedSpecies).map((slot, index) => {
        const selectedValues = system.speciesLanguageSelections || [];
        const currentValue = selectedValues[index] || '';
        const blockedValues = new Set(
          selectedValues.filter((value, selectionIndex) => value && selectionIndex !== index)
        );

        return {
          ...slot,
          slotIndex: index,
          value: currentValue,
          options: slot.options.filter(
            (option) =>
              option === currentValue ||
              (!retainedSpeciesLanguages.includes(option) && !blockedValues.has(option))
          ),
        };
      })
    : [];

  const retainedSpeciesSkills = selectedSpecies
    ? Object.entries(system.skillProficiencies || {})
        .filter(([, proficiency]) => {
          const sources = proficiency.source || [];
          return sources.length === 0 || sources.some((source) => source !== selectedSpecies.name);
        })
        .map(([skillId]) => skillId)
    : Object.keys(system.skillProficiencies || {});

  const speciesSkillSlots = selectedSpecies
    ? getDnd5eSpeciesSkillChoiceSlots(selectedSpecies).map((slot, index) => {
        const selectedValues = system.speciesSkillSelections || [];
        const currentValue = selectedValues[index] || '';
        const blockedValues = new Set(
          selectedValues.filter((value, selectionIndex) => value && selectionIndex !== index)
        );

        return {
          ...slot,
          slotIndex: index,
          value: currentValue,
          options: slot.options.filter(
            (option) =>
              option === currentValue ||
              (!retainedSpeciesSkills.includes(option) && !blockedValues.has(option))
          ),
        };
      })
    : [];

  const retainedSpeciesTools = selectedSpecies
    ? (system.toolProficiencies || []).filter(
        (toolId) => !(system.speciesToolSelections || []).includes(toolId)
      )
    : system.toolProficiencies || [];

  const speciesToolSlots = selectedSpecies
    ? getDnd5eSpeciesToolChoiceSlots(selectedSpecies).map((slot, index) => {
        const selectedValues = system.speciesToolSelections || [];
        const currentValue = selectedValues[index] || '';
        const blockedValues = new Set(
          selectedValues.filter((value, selectionIndex) => value && selectionIndex !== index)
        );

        return {
          ...slot,
          slotIndex: index,
          value: currentValue,
          options: slot.options.filter(
            (option) =>
              option === currentValue ||
              (!retainedSpeciesTools.includes(option) && !blockedValues.has(option))
          ),
        };
      })
    : [];

  const backgroundFixedTools = selectedBackground
    ? getBackgroundFixedToolProficiencies(selectedBackground.toolProficiencies)
    : [];
  const backgroundToolChoices = selectedBackground
    ? getBackgroundToolChoiceSlots(selectedBackground.toolProficiencies)
    : [];
  const backgroundLanguageChoice =
    selectedBackground?.languageProficiencies &&
    !Array.isArray(selectedBackground.languageProficiencies)
      ? selectedBackground.languageProficiencies
      : undefined;
  const derivedBackgroundTools = system.templateState?.backgroundDerived.tools || [];
  const derivedBackgroundLanguages = system.templateState?.backgroundDerived.languages || [];
  const retainedTools = (system.toolProficiencies || []).filter(
    (tool) => !derivedBackgroundTools.includes(tool)
  );
  const retainedLanguages = (system.languageProficiencies || []).filter(
    (language) => !derivedBackgroundLanguages.includes(language)
  );

  const backgroundToolSlots =
    selectedBackground && backgroundToolChoices.length > 0
      ? backgroundToolChoices.map((slot, index) => {
          const selectedValues = system.backgroundToolSelections || [];
          const currentValue = selectedValues[index] || '';
          const blockedValues = new Set(
            selectedValues.filter((value, selectionIndex) => value && selectionIndex !== index)
          );
          const knownTools = new Set([...retainedTools, ...backgroundFixedTools]);

          return {
            slotIndex: index,
            label: slot.label,
            value: currentValue,
            options: slot.options.filter(
              (option) =>
                option === currentValue || (!knownTools.has(option) && !blockedValues.has(option))
            ),
          };
        })
      : [];

  const backgroundLanguageSlots =
    selectedBackground && backgroundLanguageChoice
      ? (() => {
          const selectedValues = system.backgroundLanguageSelections || [];
          const knownLanguages = new Set(retainedLanguages);
          const options = getBackgroundLanguageOptions(backgroundLanguageChoice);

          return Array.from({ length: backgroundLanguageChoice.count }, (_, index) => {
            const currentValue = selectedValues[index] || '';
            const blockedValues = new Set(
              selectedValues.filter((value, selectionIndex) => value && selectionIndex !== index)
            );

            return {
              slotIndex: index,
              label:
                backgroundLanguageChoice.count > 1
                  ? `${backgroundLanguageChoice.label} ${index + 1}`
                  : backgroundLanguageChoice.label,
              value: currentValue,
              options: options.filter(
                (option) =>
                  option === currentValue ||
                  (!knownLanguages.has(option) && !blockedValues.has(option))
              ),
            };
          });
        })()
      : [];

  return {
    speciesAbilitySlots,
    speciesLanguageSlots,
    speciesSkillSlots,
    speciesToolSlots,
    backgroundFixedTools,
    backgroundToolSlots,
    backgroundLanguageSlots,
  };
}
