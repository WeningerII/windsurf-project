import type { CreationPlan } from '../../creation/types';
import { createD20LegacyCreationPlan } from '../d20-legacy/creationPlan';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
} from '../d20-legacy/d20LegacyTemplate';
import type { Pf1eDataModel } from './data-model';

/**
 * Pathfinder 1e guided-creation plan: name → class → race → review, driving the
 * shared d20-legacy applicators. The concrete `Pf1eDataModel` is bound here so
 * the applicators' per-model overloads resolve.
 */
export function createPf1eCreationPlan(): CreationPlan<Pf1eDataModel> {
  return createD20LegacyCreationPlan<Pf1eDataModel>(
    'pf1e',
    (document, classData) => applyD20LegacyClassTemplate(document, classData, 1),
    (document, speciesData) => applyD20LegacyRaceTemplate(document, speciesData)
  );
}
