import { useCallback, useState } from 'react';
import type { Background } from '../../../types/character-options/backgrounds';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { Species } from '../../../types/character-options/species';
import type { CharacterDocument } from '../../../types/core/document';
import { applyDnd5eBackgroundTemplate } from '../../../utils/backgroundTemplate';
import {
  applyDnd5eClassTemplate,
  applyDnd5eSubclassTemplate,
  removeDnd5eClassTemplate,
} from '../../../utils/classTemplate';
import { parseNum } from '../../../utils/math';
import { applyDnd5eSpeciesTemplate } from '../../../utils/speciesTemplate';
import type { Dnd5eSheetMutators, Dnd5eLikeDataModel } from './dnd5eSheetShared';

interface UseDnd5eTemplateHandlersProps<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  system: T;
  classes: CharacterClass[];
  species: Species[];
  backgrounds: Background[];
  selectedSpecies?: Species;
  selectedBackground?: Background;
  replaceDocument: Dnd5eSheetMutators<T>['replaceDocument'];
  update: Dnd5eSheetMutators<T>['update'];
}

export function useDnd5eTemplateHandlers<T extends Dnd5eLikeDataModel>({
  document,
  system,
  classes,
  species,
  backgrounds,
  selectedSpecies,
  selectedBackground,
  replaceDocument,
  update,
}: UseDnd5eTemplateHandlersProps<T>) {
  const [pendingClassId, setPendingClassId] = useState('');
  const [pendingClassLevel, setPendingClassLevel] = useState('1');
  const [classTemplateError, setClassTemplateError] = useState<string | null>(null);

  const runClassTemplateUpdate = useCallback(
    (updater: () => CharacterDocument<T>) => {
      try {
        setClassTemplateError(null);
        replaceDocument(updater());
        setPendingClassId('');
        setPendingClassLevel('1');
      } catch (error) {
        setClassTemplateError(
          error instanceof Error ? error.message : 'Unable to update class composition.'
        );
      }
    },
    [replaceDocument]
  );

  const handleClassRowChange = useCallback(
    (targetClassId: string, nextClassId: string, level: number) => {
      if (!nextClassId) {
        return;
      }

      const classData = classes.find((entry) => entry.id === nextClassId);
      if (!classData) {
        return;
      }

      runClassTemplateUpdate(() =>
        applyDnd5eClassTemplate(document, classData, level, {
          mode: 'replace',
          targetClassId,
        })
      );
    },
    [classes, document, runClassTemplateUpdate]
  );

  const handleClassLevelChange = useCallback(
    (classId: string, value: string) => {
      const classData = classes.find((entry) => entry.id === classId);
      if (!classData) {
        return;
      }

      runClassTemplateUpdate(() =>
        applyDnd5eClassTemplate(document, classData, parseNum(value, 1), {
          mode: 'replace',
          targetClassId: classId,
        })
      );
    },
    [classes, document, runClassTemplateUpdate]
  );

  const handleSubclassChange = useCallback(
    (classId: string, value: string) => {
      runClassTemplateUpdate(() =>
        applyDnd5eSubclassTemplate(document, classId, value || undefined)
      );
    },
    [document, runClassTemplateUpdate]
  );

  const handleClassSkillSelectionChange = useCallback(
    (
      classData: CharacterClass,
      classLevel: T['classLevels'][number],
      slotIndex: number,
      skillId: string
    ) => {
      const nextSelections = [...(classLevel.skillSelections || [])];
      nextSelections[slotIndex] = skillId;
      runClassTemplateUpdate(() =>
        applyDnd5eClassTemplate(document, classData, classLevel.level, {
          mode: 'replace',
          targetClassId: classLevel.classId,
          skillSelections: nextSelections,
          toolSelections: classLevel.toolSelections,
        })
      );
    },
    [document, runClassTemplateUpdate]
  );

  const handleClassToolSelectionChange = useCallback(
    (
      classData: CharacterClass,
      classLevel: T['classLevels'][number],
      slotIndex: number,
      toolId: string
    ) => {
      const nextSelections = [...(classLevel.toolSelections || [])];
      nextSelections[slotIndex] = toolId;
      runClassTemplateUpdate(() =>
        applyDnd5eClassTemplate(document, classData, classLevel.level, {
          mode: 'replace',
          targetClassId: classLevel.classId,
          skillSelections: classLevel.skillSelections,
          toolSelections: nextSelections,
        })
      );
    },
    [document, runClassTemplateUpdate]
  );

  const handleAddClass = useCallback(() => {
    if (!pendingClassId) {
      return;
    }

    const classData = classes.find((entry) => entry.id === pendingClassId);
    if (!classData) {
      return;
    }

    runClassTemplateUpdate(() =>
      applyDnd5eClassTemplate(document, classData, parseNum(pendingClassLevel, 1), {
        mode: 'add',
      })
    );
  }, [classes, document, pendingClassId, pendingClassLevel, runClassTemplateUpdate]);

  const handleRemoveClass = useCallback(
    (classId: string) => {
      runClassTemplateUpdate(() => removeDnd5eClassTemplate(document, classId));
    },
    [document, runClassTemplateUpdate]
  );

  const handleSpeciesChange = useCallback(
    (speciesId: string) => {
      if (!speciesId) {
        replaceDocument(applyDnd5eSpeciesTemplate(document, undefined, selectedSpecies));
        return;
      }

      const speciesData = species.find((entry) => entry.id === speciesId);
      if (!speciesData) {
        update({ speciesId } as Partial<T>);
        return;
      }

      replaceDocument(applyDnd5eSpeciesTemplate(document, speciesData, selectedSpecies));
    },
    [document, replaceDocument, selectedSpecies, species, update]
  );

  const applySelectedSpeciesTemplate = useCallback(
    (nextSelections: {
      abilitySelections?: string[];
      languageSelections?: string[];
      skillSelections?: string[];
      toolSelections?: string[];
    }) => {
      if (!selectedSpecies) {
        return;
      }

      replaceDocument(
        applyDnd5eSpeciesTemplate(document, selectedSpecies, selectedSpecies, {
          abilitySelections: nextSelections.abilitySelections ?? system.speciesAbilitySelections,
          languageSelections: nextSelections.languageSelections ?? system.speciesLanguageSelections,
          skillSelections: nextSelections.skillSelections ?? system.speciesSkillSelections,
          toolSelections: nextSelections.toolSelections ?? system.speciesToolSelections,
        })
      );
    },
    [
      document,
      replaceDocument,
      selectedSpecies,
      system.speciesAbilitySelections,
      system.speciesLanguageSelections,
      system.speciesSkillSelections,
      system.speciesToolSelections,
    ]
  );

  const handleSpeciesAbilityChange = useCallback(
    (slotIndex: number, abilityId: string) => {
      const nextSelections = [...(system.speciesAbilitySelections || [])];
      nextSelections[slotIndex] = abilityId;
      applySelectedSpeciesTemplate({ abilitySelections: nextSelections });
    },
    [applySelectedSpeciesTemplate, system.speciesAbilitySelections]
  );

  const handleSpeciesLanguageChange = useCallback(
    (slotIndex: number, language: string) => {
      const nextSelections = [...(system.speciesLanguageSelections || [])];
      nextSelections[slotIndex] = language;
      applySelectedSpeciesTemplate({ languageSelections: nextSelections });
    },
    [applySelectedSpeciesTemplate, system.speciesLanguageSelections]
  );

  const handleSpeciesSkillChange = useCallback(
    (slotIndex: number, skillId: string) => {
      const nextSelections = [...(system.speciesSkillSelections || [])];
      nextSelections[slotIndex] = skillId;
      applySelectedSpeciesTemplate({ skillSelections: nextSelections });
    },
    [applySelectedSpeciesTemplate, system.speciesSkillSelections]
  );

  const handleSpeciesToolChange = useCallback(
    (slotIndex: number, toolId: string) => {
      const nextSelections = [...(system.speciesToolSelections || [])];
      nextSelections[slotIndex] = toolId;
      applySelectedSpeciesTemplate({ toolSelections: nextSelections });
    },
    [applySelectedSpeciesTemplate, system.speciesToolSelections]
  );

  const handleBackgroundChange = useCallback(
    (backgroundId: string) => {
      if (!backgroundId) {
        replaceDocument(applyDnd5eBackgroundTemplate(document, undefined, selectedBackground));
        return;
      }

      const background = backgrounds.find((entry) => entry.id === backgroundId);
      if (!background) {
        update({ backgroundId } as Partial<T>);
        return;
      }

      replaceDocument(applyDnd5eBackgroundTemplate(document, background, selectedBackground));
    },
    [backgrounds, document, replaceDocument, selectedBackground, update]
  );

  const applySelectedBackgroundTemplate = useCallback(
    (nextSelections: { languageSelections?: string[]; toolSelections?: string[] }) => {
      if (!selectedBackground) {
        return;
      }

      replaceDocument(
        applyDnd5eBackgroundTemplate(document, selectedBackground, selectedBackground, {
          toolSelections: nextSelections.toolSelections ?? system.backgroundToolSelections,
          languageSelections:
            nextSelections.languageSelections ?? system.backgroundLanguageSelections,
        })
      );
    },
    [
      document,
      replaceDocument,
      selectedBackground,
      system.backgroundLanguageSelections,
      system.backgroundToolSelections,
    ]
  );

  const handleBackgroundLanguageChange = useCallback(
    (slotIndex: number, language: string) => {
      const nextSelections = [...(system.backgroundLanguageSelections || [])];
      nextSelections[slotIndex] = language;
      applySelectedBackgroundTemplate({ languageSelections: nextSelections });
    },
    [applySelectedBackgroundTemplate, system.backgroundLanguageSelections]
  );

  const handleBackgroundToolChange = useCallback(
    (slotIndex: number, toolId: string) => {
      const nextSelections = [...(system.backgroundToolSelections || [])];
      nextSelections[slotIndex] = toolId;
      applySelectedBackgroundTemplate({ toolSelections: nextSelections });
    },
    [applySelectedBackgroundTemplate, system.backgroundToolSelections]
  );

  return {
    pendingClassId,
    setPendingClassId,
    pendingClassLevel,
    setPendingClassLevel,
    classTemplateError,
    handleClassRowChange,
    handleClassLevelChange,
    handleSubclassChange,
    handleClassSkillSelectionChange,
    handleClassToolSelectionChange,
    handleAddClass,
    handleRemoveClass,
    handleSpeciesChange,
    handleSpeciesAbilityChange,
    handleSpeciesLanguageChange,
    handleSpeciesSkillChange,
    handleSpeciesToolChange,
    handleBackgroundChange,
    handleBackgroundLanguageChange,
    handleBackgroundToolChange,
  };
}
