import { useCallback } from 'react';
import type { Pf2eBackgroundDefinition } from '../../data/pathfinder/2e/backgrounds';
import type { Archetype } from '../../types/character-options/archetypes';
import type { CharacterClass } from '../../types/character-options/classes';
import type { CharacterDocument } from '../../types/core/document';
import type { Species } from '../../types/character-options/species';
import {
  applyPf2eAncestryTemplate,
  applyPf2eArchetypeTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
  removePf2eArchetypeTemplate,
} from './pf2eTemplate';
import { parseNum } from '../../utils/math';
import { setPf2eFocusMax } from './pf2eSheetShared';
import type { Pf2eDataModel } from './data-model';

type Heritage = NonNullable<Species['subraces']>[number];

type BackgroundTemplateSelections = Partial<{
  abilityBoostSelections: string[];
  skillTrainingSelection: string;
  loreTrainingSelection: string;
}>;

interface UsePf2eTemplateHandlersProps {
  document: CharacterDocument<Pf2eDataModel>;
  data: Pf2eDataModel;
  classes: CharacterClass[];
  ancestries: Species[];
  backgrounds: Pf2eBackgroundDefinition[];
  selectedClass?: CharacterClass;
  selectedAncestry?: Species;
  selectedHeritage?: Heritage;
  selectedBackground?: Pf2eBackgroundDefinition;
  selectedArchetypeIds: string[];
  replaceDocument: (nextDocument: CharacterDocument<Pf2eDataModel>) => void;
  update: (patch: Partial<Pf2eDataModel>) => void;
}

export function usePf2eTemplateHandlers({
  document,
  data,
  classes,
  ancestries,
  backgrounds,
  selectedClass,
  selectedAncestry,
  selectedHeritage,
  selectedBackground,
  selectedArchetypeIds,
  replaceDocument,
  update,
}: UsePf2eTemplateHandlersProps) {
  const applySelectedBackgroundTemplate = useCallback(
    (nextSelections: BackgroundTemplateSelections = {}) => {
      if (!selectedBackground) {
        return;
      }

      replaceDocument(
        applyPf2eBackgroundTemplate(document, selectedBackground, selectedBackground, {
          abilityBoostSelections:
            nextSelections.abilityBoostSelections ?? data.backgroundAbilityBoostSelections,
          skillTrainingSelection:
            nextSelections.skillTrainingSelection ?? data.backgroundSkillTrainingSelection,
          loreTrainingSelection:
            nextSelections.loreTrainingSelection ?? data.backgroundLoreTrainingSelection,
        })
      );
    },
    [
      data.backgroundAbilityBoostSelections,
      data.backgroundLoreTrainingSelection,
      data.backgroundSkillTrainingSelection,
      document,
      replaceDocument,
      selectedBackground,
    ]
  );

  const handleClassChange = useCallback(
    (classId: string) => {
      const previousClass = selectedClass;

      if (!classId) {
        replaceDocument(applyPf2eClassTemplate(document, undefined, data.level, previousClass));
        return;
      }

      const classData = classes.find((entry) => entry.id === classId);
      if (!classData) {
        update({ classId });
        return;
      }

      replaceDocument(applyPf2eClassTemplate(document, classData, data.level, previousClass));
    },
    [classes, data.level, document, replaceDocument, selectedClass, update]
  );

  const handleLevelChange = useCallback(
    (value: string) => {
      const nextLevel = parseNum(value, 1);

      if (!selectedClass) {
        // No class template to re-run, but still re-validate the focus pool
        // against its cap through the shared setMax leveling primitive so a
        // level edit keeps expended focus consistent with capacity. The cap is
        // unchanged here (PF2e focus max is focus-spell driven, not level
        // driven), so this is behavior-preserving — it is the canonical hook a
        // level-derived cap would flow through.
        const nextSpellcasting = setPf2eFocusMax(
          data.spellcasting,
          data.spellcasting?.focusPoints.max ?? 0
        );
        update(
          nextSpellcasting
            ? { level: nextLevel, spellcasting: nextSpellcasting }
            : { level: nextLevel }
        );
        return;
      }

      replaceDocument(applyPf2eClassTemplate(document, selectedClass, nextLevel, selectedClass));
    },
    [data.spellcasting, document, replaceDocument, selectedClass, update]
  );

  const handleAncestryChange = useCallback(
    (ancestryId: string) => {
      const previousSelection = { ancestry: selectedAncestry, heritage: selectedHeritage };

      if (!ancestryId) {
        replaceDocument(
          applyPf2eAncestryTemplate(document, undefined, undefined, previousSelection)
        );
        return;
      }

      const ancestry = ancestries.find((entry) => entry.id === ancestryId);
      if (!ancestry) {
        update({ ancestryId, heritageId: undefined });
        return;
      }

      replaceDocument(applyPf2eAncestryTemplate(document, ancestry, undefined, previousSelection));
    },
    [ancestries, document, replaceDocument, selectedAncestry, selectedHeritage, update]
  );

  const handleHeritageChange = useCallback(
    (heritageId: string) => {
      if (!selectedAncestry) {
        update({ heritageId: heritageId || undefined });
        return;
      }

      const heritage = selectedAncestry.subraces?.find((entry) => entry.id === heritageId);

      replaceDocument(
        applyPf2eAncestryTemplate(
          document,
          selectedAncestry,
          heritage,
          {
            ancestry: selectedAncestry,
            heritage: selectedHeritage,
          },
          data.ancestryAbilityBoostSelections
        )
      );
    },
    [
      data.ancestryAbilityBoostSelections,
      document,
      replaceDocument,
      selectedAncestry,
      selectedHeritage,
      update,
    ]
  );

  const handleBackgroundChange = useCallback(
    (backgroundId: string) => {
      const background = backgrounds.find((entry) => entry.id === backgroundId);
      replaceDocument(applyPf2eBackgroundTemplate(document, background, selectedBackground));
    },
    [backgrounds, document, replaceDocument, selectedBackground]
  );

  const handleAncestryBoostChange = useCallback(
    (slotIndex: number, ability: string) => {
      if (!selectedAncestry) {
        return;
      }

      const nextSelections = [...(data.ancestryAbilityBoostSelections ?? [])];
      nextSelections[slotIndex] = ability;

      replaceDocument(
        applyPf2eAncestryTemplate(
          document,
          selectedAncestry,
          selectedHeritage,
          { ancestry: selectedAncestry, heritage: selectedHeritage },
          nextSelections
        )
      );
    },
    [
      data.ancestryAbilityBoostSelections,
      document,
      replaceDocument,
      selectedAncestry,
      selectedHeritage,
    ]
  );

  const handleBackgroundAbilityBoostChange = useCallback(
    (slotIndex: number, ability: string) => {
      const nextSelections = [...(data.backgroundAbilityBoostSelections ?? [])];
      nextSelections[slotIndex] = ability;
      applySelectedBackgroundTemplate({ abilityBoostSelections: nextSelections });
    },
    [applySelectedBackgroundTemplate, data.backgroundAbilityBoostSelections]
  );

  const handleArchetypeToggle = useCallback(
    (archetype: Archetype) => {
      replaceDocument(
        selectedArchetypeIds.includes(archetype.id)
          ? removePf2eArchetypeTemplate(document, archetype)
          : applyPf2eArchetypeTemplate(document, archetype)
      );
    },
    [document, replaceDocument, selectedArchetypeIds]
  );

  return {
    applySelectedBackgroundTemplate,
    handleAncestryBoostChange,
    handleAncestryChange,
    handleArchetypeToggle,
    handleBackgroundAbilityBoostChange,
    handleBackgroundChange,
    handleClassChange,
    handleHeritageChange,
    handleLevelChange,
  };
}
