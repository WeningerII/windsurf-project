/**
 * System-agnostic rules engine: intermediate representation (IR) + deterministic
 * resolver. See `docs/rfc/003-rules-ir-and-effects.md`.
 *
 * Every game system compiles its rules-as-written into this shared IR; the
 * resolver folds it into derived values identically across all systems.
 */

export type {
  ActionDescriptor,
  ConditionDescriptor,
  EffectCondition,
  EffectInstance,
  EffectOperation,
  EffectSource,
  EffectValue,
  StackPolicy,
  TerrainDescriptor,
} from './ir/types';
export { makeEffectId } from './ir/types';

export type { ResolveContext, ResolveResult, ResolvedTarget, RollMode } from './resolver/resolve';
export { effectApplies, resolveEffects } from './resolver/resolve';

export type { AttackResolution, AttackResolutionInput } from './resolver/attackResolution';
export { resolveAttack } from './resolver/attackResolution';

export type {
  AttackTarget,
  AreaEffectInput,
  AreaEffectOutcome,
  AreaEffectResult,
  MultiTargetAttackInput,
  MultiTargetAttackResult,
  SaveParticipant,
} from './resolver/participantResolution';
export {
  participantRng,
  resolveAreaEffect,
  resolveMultiTargetAttack,
} from './resolver/participantResolution';

export type { AreaShape } from './resolver/areaTargeting';
export { cellInArea, gridDistance, tokensInArea } from './resolver/areaTargeting';

export {
  areaEffectToDamageIntent,
  attackToDamageIntent,
  multiTargetAttackToDamageIntent,
} from './resolver/sceneCombat';

export type { ScoredTarget, TacticalActor, TacticalTarget } from './tactical/targetScoring';
export { isHostile, maxPossibleDamage, scoreTarget, scoreTargets } from './tactical/targetScoring';

export type {
  TacticalDecisionKind,
  TacticalTurnInput,
  TacticalTurnResult,
} from './tactical/tacticalExecutor';
export { executeTacticalTurn } from './tactical/tacticalExecutor';

export { collectTerrainEffectsAt, markerCoversCell, markerToEffects } from './terrain/sceneTerrain';

export { effectToLedgerEntry, toContributionLedger } from './ir/ledgerView';

export type { MagicBonusItem } from './compile/equipEffects';
export { compileEquipmentEffects, equipStackPolicy } from './compile/equipEffects';

export type { ModifierSource } from './compile/modifierEffects';
export { compileModifierEffects, compileModifierSource } from './compile/modifierEffects';

export type { CharacterEffectInputs, ResolvedCharacterEffects } from './compile/characterEffects';
export { resolveCharacterEffects } from './compile/characterEffects';

export {
  collectDnd5eConditionEffects,
  conditionImposesDisadvantage,
  hasDnd5eConditionEffects,
} from './conditions/dnd5eConditions';

export type { Pf2eConditionLike } from './conditions/pf2eConditions';
export {
  collectPf2eConditionEffects,
  getPf2eConditionStatusPenalty,
} from './conditions/pf2eConditions';
