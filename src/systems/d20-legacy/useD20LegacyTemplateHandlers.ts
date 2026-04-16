import { useCallback, useState } from 'react';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Species } from '../../types/character-options/species';
import type { CharacterDocument } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { parseNum } from '../../utils/math';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
  removeD20LegacyClassTemplate,
} from '../../utils/d20LegacyTemplate';
import { syncD20LegacySpellcastingSelections } from '../../utils/d20LegacySpellcasting';
import type { Dnd35eDataModel } from '../dnd35e/data-model';
import type { Pf1eDataModel } from '../pf1e/data-model';
import type { D20LegacyData } from './d20LegacySheetShared';

interface UseD20LegacyTemplateHandlersProps {
  typedDocument: CharacterDocument<D20LegacyData>;
  systemId: GameSystemId;
  sys: D20LegacyData;
  isPf1e: boolean;
  classes: CharacterClass[];
  replaceDocument: (nextDocument: CharacterDocument<D20LegacyData>) => void;
  update: (patch: Partial<D20LegacyData>) => void;
}

export function useD20LegacyTemplateHandlers({
  typedDocument,
  systemId,
  sys,
  isPf1e,
  classes,
  replaceDocument,
  update,
}: UseD20LegacyTemplateHandlersProps) {
  const [pendingClassId, setPendingClassId] = useState('');
  const [pendingClassLevel, setPendingClassLevel] = useState('1');
  const [classTemplateError, setClassTemplateError] = useState<string | null>(null);

  const runClassTemplateUpdate = useCallback(
    (updater: () => CharacterDocument<D20LegacyData>) => {
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

      runClassTemplateUpdate(() => {
        if (isPf1e) {
          return applyD20LegacyClassTemplate(
            typedDocument as CharacterDocument<Pf1eDataModel>,
            classData,
            level,
            {
              mode: 'replace',
              targetClassId,
            }
          ) as CharacterDocument<D20LegacyData>;
        }

        return applyD20LegacyClassTemplate(
          typedDocument as CharacterDocument<Dnd35eDataModel>,
          classData,
          level,
          {
            mode: 'replace',
            targetClassId,
          }
        ) as CharacterDocument<D20LegacyData>;
      });
    },
    [classes, isPf1e, runClassTemplateUpdate, typedDocument]
  );

  const handleClassLevelChange = useCallback(
    (classId: string, value: string) => {
      const classData = classes.find((entry) => entry.id === classId);
      if (!classData) {
        return;
      }

      runClassTemplateUpdate(() => {
        if (isPf1e) {
          return applyD20LegacyClassTemplate(
            typedDocument as CharacterDocument<Pf1eDataModel>,
            classData,
            parseNum(value, 1),
            {
              mode: 'replace',
              targetClassId: classId,
            }
          ) as CharacterDocument<D20LegacyData>;
        }

        return applyD20LegacyClassTemplate(
          typedDocument as CharacterDocument<Dnd35eDataModel>,
          classData,
          parseNum(value, 1),
          {
            mode: 'replace',
            targetClassId: classId,
          }
        ) as CharacterDocument<D20LegacyData>;
      });
    },
    [classes, isPf1e, runClassTemplateUpdate, typedDocument]
  );

  const handleAddClass = useCallback(() => {
    if (!pendingClassId) {
      return;
    }

    const classData = classes.find((entry) => entry.id === pendingClassId);
    if (!classData) {
      return;
    }

    runClassTemplateUpdate(() => {
      if (isPf1e) {
        return applyD20LegacyClassTemplate(
          typedDocument as CharacterDocument<Pf1eDataModel>,
          classData,
          parseNum(pendingClassLevel, 1),
          { mode: 'add' }
        ) as CharacterDocument<D20LegacyData>;
      }

      return applyD20LegacyClassTemplate(
        typedDocument as CharacterDocument<Dnd35eDataModel>,
        classData,
        parseNum(pendingClassLevel, 1),
        { mode: 'add' }
      ) as CharacterDocument<D20LegacyData>;
    });
  }, [classes, isPf1e, pendingClassId, pendingClassLevel, runClassTemplateUpdate, typedDocument]);

  const handleRemoveClass = useCallback(
    (classId: string) => {
      runClassTemplateUpdate(() => {
        if (isPf1e) {
          return removeD20LegacyClassTemplate(
            typedDocument as CharacterDocument<Pf1eDataModel>,
            classId
          ) as CharacterDocument<D20LegacyData>;
        }

        return removeD20LegacyClassTemplate(
          typedDocument as CharacterDocument<Dnd35eDataModel>,
          classId
        ) as CharacterDocument<D20LegacyData>;
      });
    },
    [isPf1e, runClassTemplateUpdate, typedDocument]
  );

  const handleSpellcastingSelectionChange = useCallback(
    (targetClassId: string, trackIndex: number, selectedClassId: string) => {
      const nextClassLevels = sys.classLevels.map((classLevel) => {
        if (classLevel.classId !== targetClassId) {
          return classLevel;
        }

        const nextSelections = [...(classLevel.spellcastingSelections ?? [])];
        nextSelections[trackIndex] = selectedClassId;
        return { ...classLevel, spellcastingSelections: nextSelections };
      });

      update({
        classLevels: syncD20LegacySpellcastingSelections(
          systemId,
          nextClassLevels,
          new Map(classes.map((entry) => [entry.id, entry]))
        ) as D20LegacyData['classLevels'],
      });
    },
    [classes, sys.classLevels, systemId, update]
  );

  const applyRaceTemplate = useCallback(
    (speciesData: Species, previousSpecies?: Species) => {
      if (isPf1e) {
        replaceDocument(
          applyD20LegacyRaceTemplate(
            typedDocument as CharacterDocument<Pf1eDataModel>,
            speciesData,
            previousSpecies
          ) as CharacterDocument<D20LegacyData>
        );
        return;
      }

      replaceDocument(
        applyD20LegacyRaceTemplate(
          typedDocument as CharacterDocument<Dnd35eDataModel>,
          speciesData,
          previousSpecies
        ) as CharacterDocument<D20LegacyData>
      );
    },
    [isPf1e, replaceDocument, typedDocument]
  );

  return {
    pendingClassId,
    pendingClassLevel,
    classTemplateError,
    setPendingClassId,
    setPendingClassLevel,
    handleClassRowChange,
    handleClassLevelChange,
    handleAddClass,
    handleRemoveClass,
    handleSpellcastingSelectionChange,
    applyRaceTemplate,
  };
}
