import type { CharacterDocument } from '../../../types/core/document';
import type { GameSystemId } from '../../../types/game-systems';
import type { CreationOption, CreationPlan } from '../../../creation/types';
import { loadClassesForSystem, loadSpeciesForSystem } from '../../../utils/dataLoader';
import { applyDnd5eClassTemplate } from './classTemplate';
import { applyDnd5eSpeciesTemplate, type Dnd5eLikeDataModel } from './speciesTemplate';

/**
 * Guided-creation plan shared by the two 5e systems (2014 + 2024). Both expose
 * the same class/species loaders and drive the SAME shared template applicators
 * (`applyDnd5eClassTemplate` / `applyDnd5eSpeciesTemplate`) the sheet uses, so a
 * single generic factory serves both. The wizard shell frames these steps with
 * a name step and a review step; here we author only the loader-driven choices.
 *
 * `apply` is replay-safe: it re-loads the class/species catalog and resolves the
 * selected id every time, so a resumed draft rebuilds identically without
 * relying on `loadOptions` having run.
 */
export function createDnd5eCreationPlan<T extends Dnd5eLikeDataModel>(
  systemId: GameSystemId
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
          return applyDnd5eClassTemplate(document, classData, 1);
        },
      },
      {
        kind: 'choice',
        id: 'species',
        title: 'Species',
        description: 'Choose your species/lineage. Optional — you can skip it.',
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
          return applyDnd5eSpeciesTemplate(document, speciesData);
        },
      },
    ],
  };
}
