import type { CreationPlan } from '../../creation/types';
import { createD20LegacyCreationPlan } from '../d20-legacy/creationPlan';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
} from '../d20-legacy/d20LegacyTemplate';
import type { Dnd35eDataModel } from './data-model';

/**
 * D&D 3.5e guided-creation plan: name → class → race → review, driving the
 * shared d20-legacy applicators. The concrete `Dnd35eDataModel` is bound here so
 * the applicators' per-model overloads resolve.
 */
export function createDnd35eCreationPlan(): CreationPlan<Dnd35eDataModel> {
  return createD20LegacyCreationPlan<Dnd35eDataModel>(
    'dnd-3.5e',
    (document, classData) => applyD20LegacyClassTemplate(document, classData, 1),
    (document, speciesData) => applyD20LegacyRaceTemplate(document, speciesData)
  );
}
