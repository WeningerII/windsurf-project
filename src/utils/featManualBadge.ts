import type { FeatDefinition, ProficienciesGranted } from '../types/character-options/feats';
import type { Feat, FeatAutomationState } from '../types/core/character';

function hasGrantedProficiencies(proficiencies?: ProficienciesGranted): boolean {
  return Object.values(proficiencies ?? {}).some((values) => (values?.length ?? 0) > 0);
}

function hasSelectedAutomation(automation?: FeatAutomationState): boolean {
  if (!automation) {
    return false;
  }

  return (
    Object.values(automation.abilityScores ?? {}).some((bonus) => bonus !== 0) ||
    (automation.armor?.length ?? 0) > 0 ||
    (automation.weapons?.length ?? 0) > 0 ||
    (automation.tools?.length ?? 0) > 0 ||
    (automation.languages?.length ?? 0) > 0 ||
    (automation.savingThrows?.length ?? 0) > 0 ||
    Object.keys(automation.skills ?? {}).length > 0
  );
}

export function shouldShowDnd5eManualFeatBadge(
  featDefinition: FeatDefinition,
  selectedFeat?: Feat
): boolean {
  return (
    !featDefinition.abilityScoreIncrease &&
    !hasGrantedProficiencies(featDefinition.proficienciesGranted) &&
    (featDefinition.modifiers?.length ?? 0) === 0 &&
    !hasSelectedAutomation(selectedFeat?.automation)
  );
}
