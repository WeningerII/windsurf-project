import type { CharacterDocument } from '../../types/core/document';
import type { CreationOption, CreationPlan } from '../../creation/types';
import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadPf2eBackgroundsForSystem,
} from '../../utils/dataLoader';
import type { Pf2eDataModel } from './data-model';
import {
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
} from './pf2eTemplate';

const SYSTEM_ID = 'pf2e';

/**
 * Pathfinder 2e guided-creation plan: name → class → ancestry → background →
 * review, driving PF2e's OWN template applicators (the same ones the sheet uses).
 * Each `apply` re-loads its catalog and resolves the selected id, so a resumed
 * draft rebuilds identically.
 */
export function createPf2eCreationPlan(): CreationPlan<Pf2eDataModel> {
  return {
    systemId: SYSTEM_ID,
    steps: [
      {
        kind: 'choice',
        id: 'class',
        title: 'Class',
        description: 'Choose your class. Optional — you can skip it.',
        optional: true,
        loadOptions: async (): Promise<CreationOption[]> => {
          const classes = await loadClassesForSystem(SYSTEM_ID);
          return classes.map((cls) => ({ id: cls.id, label: cls.name }));
        },
        apply: async (document: CharacterDocument<Pf2eDataModel>, selectedIds) => {
          const classId = selectedIds[0];
          if (!classId) return document;
          const classes = await loadClassesForSystem(SYSTEM_ID);
          const classData = classes.find((cls) => cls.id === classId);
          if (!classData) return document;
          return applyPf2eClassTemplate(document, classData, document.system.level);
        },
      },
      {
        kind: 'choice',
        id: 'ancestry',
        title: 'Ancestry',
        description: 'Choose your ancestry. Optional — you can skip it.',
        optional: true,
        loadOptions: async (): Promise<CreationOption[]> => {
          const ancestries = await loadSpeciesForSystem(SYSTEM_ID);
          return ancestries.map((anc) => ({ id: anc.id, label: anc.name }));
        },
        apply: async (document: CharacterDocument<Pf2eDataModel>, selectedIds) => {
          const ancestryId = selectedIds[0];
          if (!ancestryId) return document;
          const ancestries = await loadSpeciesForSystem(SYSTEM_ID);
          const ancestryData = ancestries.find((anc) => anc.id === ancestryId);
          if (!ancestryData) return document;
          return applyPf2eAncestryTemplate(document, ancestryData);
        },
      },
      {
        kind: 'choice',
        id: 'background',
        title: 'Background',
        description: 'Choose your background. Optional — you can skip it.',
        optional: true,
        loadOptions: async (): Promise<CreationOption[]> => {
          const backgrounds = await loadPf2eBackgroundsForSystem(SYSTEM_ID);
          return backgrounds.map((bg) => ({ id: bg.id, label: bg.name }));
        },
        apply: async (document: CharacterDocument<Pf2eDataModel>, selectedIds) => {
          const backgroundId = selectedIds[0];
          if (!backgroundId) return document;
          const backgrounds = await loadPf2eBackgroundsForSystem(SYSTEM_ID);
          const backgroundData = backgrounds.find((bg) => bg.id === backgroundId);
          if (!backgroundData) return document;
          return applyPf2eBackgroundTemplate(document, backgroundData);
        },
      },
    ],
  };
}
