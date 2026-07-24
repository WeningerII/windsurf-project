import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Species } from '../../types/character-options/species';
import type { CreationOption, CreationPlan } from '../../creation/types';
import { loadClassesForSystem, loadSpeciesForSystem } from '../../utils/dataLoader';

/**
 * Guided-creation plan builder shared by the two d20-legacy systems (D&D 3.5e +
 * PF1e). Both drive the SAME `applyD20LegacyClassTemplate` /
 * `applyD20LegacyRaceTemplate` applicators the sheet uses — but those are typed
 * with concrete per-model overloads, so each system binds its own applicator at
 * the call site (where the data model is concrete) and passes them in here. The
 * loader-driven class/race choices themselves are identical, so they live once.
 *
 * `apply` is replay-safe: it re-loads the catalog and resolves the selected id
 * on every call, so a resumed draft rebuilds identically.
 */
export function createD20LegacyCreationPlan<T extends SystemDataModel>(
  systemId: GameSystemId,
  applyClass: (document: CharacterDocument<T>, classData: CharacterClass) => CharacterDocument<T>,
  applyRace: (document: CharacterDocument<T>, speciesData: Species) => CharacterDocument<T>
): CreationPlan<T> {
  return {
    systemId,
    steps: [
      {
        kind: 'choice',
        id: 'class',
        title: 'Class',
        description: 'Choose your starting class (added at level 1). Optional — you can skip it.',
        optional: true,
        loadOptions: async (): Promise<CreationOption[]> => {
          const classes = await loadClassesForSystem(systemId);
          return classes.map((cls) => ({ id: cls.id, label: cls.name }));
        },
        apply: async (document: CharacterDocument<T>, selectedIds) => {
          const classId = selectedIds[0];
          if (!classId) return document;
          const classes = await loadClassesForSystem(systemId);
          const classData = classes.find((cls) => cls.id === classId);
          if (!classData) return document;
          return applyClass(document, classData);
        },
      },
      {
        kind: 'choice',
        id: 'race',
        title: 'Race',
        description: 'Choose your race. Optional — you can skip it.',
        optional: true,
        loadOptions: async (): Promise<CreationOption[]> => {
          const species = await loadSpeciesForSystem(systemId);
          return species.map((sp) => ({ id: sp.id, label: sp.name }));
        },
        apply: async (document: CharacterDocument<T>, selectedIds) => {
          const speciesId = selectedIds[0];
          if (!speciesId) return document;
          const species = await loadSpeciesForSystem(systemId);
          const speciesData = species.find((sp) => sp.id === speciesId);
          if (!speciesData) return document;
          return applyRace(document, speciesData);
        },
      },
    ],
  };
}
