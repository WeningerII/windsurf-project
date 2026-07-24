import type { CreationPlan } from '../../creation/types';
import type { DaggerheartDataModel } from './data-model';

/**
 * Daggerheart guided-creation plan. Daggerheart's build (classes, ancestries,
 * communities, domains) is not exposed through the shared class/species loaders
 * the d20 systems use, so the plan declares no loader-driven choice steps yet —
 * the wizard still frames it as name → review, producing a valid default-seeded
 * document through the existing create path. Domain/ancestry choice steps can be
 * added here once Daggerheart's loaders expose them, with no shell change.
 */
export function createDaggerheartCreationPlan(): CreationPlan<DaggerheartDataModel> {
  return { systemId: 'daggerheart', steps: [] };
}
