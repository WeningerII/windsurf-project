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
export { critModelForSystem, resolveAttack } from './resolver/attackResolution';
export type { DamageDefenses } from './resolver/damageDefenses';
export { adjustTypedDamage, hasDamageDefenses } from './resolver/damageDefenses';

export type {
  ChallengeAttempt,
  ChallengeParticipant,
  CheckInput,
  CheckOutcome,
  CheckResult,
  CheckRollMode,
  SkillChallengeInput,
  SkillChallengeResult,
} from './resolver/checkResolution';
export { resolveCheck, resolveSkillChallenge } from './resolver/checkResolution';

export type {
  Attitude,
  SocialApproach,
  SocialActionInput,
  SocialActionResult,
  SocialNpc,
  SocialNpcOutcome,
} from './resolver/socialResolution';
export {
  ATTITUDES,
  attitudeSwayDC,
  resolveSocialAction,
  shiftAttitude,
} from './resolver/socialResolution';

export type { SceneSocialOutcome } from './social/sceneSocial';
export { resolveSceneSocialAction, socialSkillId, tokenAttitude } from './social/sceneSocial';

export type { SceneChallengeOutcome, TrapDamage } from './exploration/sceneChallenge';
export { resolveSceneChallenge } from './exploration/sceneChallenge';

export type {
  DaggerheartAttackInput,
  DaggerheartAttackResult,
  DaggerheartThresholds,
} from './resolver/daggerheartResolution';
export { daggerheartHpMarked, resolveDaggerheartAttack } from './resolver/daggerheartResolution';

export type {
  Mam3eAttackInput,
  Mam3eAttackResult,
  Mam3eConditionDelta,
  Mam3eDefenseKind,
} from './resolver/mam3eResolution';
export { applyToughnessDegrees, resolveMam3eAttack } from './resolver/mam3eResolution';

export type {
  AttackTarget,
  AreaEffectInput,
  AreaEffectOutcome,
  AreaEffectResult,
  MultiTargetAttackInput,
  MultiTargetAttackResult,
  SaveDegree,
  SaveModel,
  SaveParticipant,
} from './resolver/participantResolution';
export {
  participantRng,
  pf2eSaveDegree,
  resolveAreaEffect,
  resolveMultiTargetAttack,
} from './resolver/participantResolution';
export type { DegreeOfSuccess } from './resolver/degreeOfSuccess';
export { pf2eDegreeOfSuccess } from './resolver/degreeOfSuccess';
export { cannotAct, collapseRollMode, statusAdvantage } from './resolver/conditions';
export type { ConcentrationCheck } from './resolver/concentration';
export { concentrationBreak, resolveConcentrationCheck } from './resolver/concentration';
export type { DeathSaveResult, DeathSaveStatus } from './resolver/deathSaves';
export { rollDeathSave } from './resolver/deathSaves';
export type { InitiativeRollInput, InitiativeRollResult } from './resolver/initiative';
export { rollInitiative } from './resolver/initiative';

export type { AreaShape, DiagonalRule } from './resolver/areaTargeting';
export {
  areaOfEffectToShape,
  cellInArea,
  DEFAULT_CONE_HALF_ANGLE_DEG,
  diagonalRuleForSystem,
  gridDistance,
  tokensInArea,
} from './resolver/areaTargeting';

export type { BlockPredicate, CoverLevel } from './resolver/lineOfEffect';
export {
  coverAcBonus,
  coverBetween,
  coverSaveBonus,
  hasLineOfEffect,
  segmentCells,
  spreadCells,
} from './resolver/lineOfEffect';

export type {
  AreaCandidate,
  AreaParticipantSelection,
  AuraAction,
  AuraTrigger,
} from './resolver/areaParticipants';
export {
  AUTO_HIT_SAVE_DC,
  computeAreaParticipants,
  shapeForArea,
} from './resolver/areaParticipants';

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
export { executeTacticalTurn, pf2eMapPenalty, resolveStrike } from './tactical/tacticalExecutor';

export type {
  RoundCombatant,
  RoundResult,
  RoundTurnRecord,
  RunRoundInput,
} from './tactical/roundDriver';
export { isRoundConclusive, runCombatRound } from './tactical/roundDriver';
export type { AttackTone } from './narration/combatNarrator';
export { narrateAttack } from './narration/combatNarrator';
export type { AiProvider, Narrator, Strategist } from './ai/provider';
export { deterministicAiProvider, resolveAiProvider } from './ai/provider';
export { flankToHitBonus, isFlanking } from './tactical/flanking';

export type { MoveResult } from './tactical/pathfinding';
export { moveToward } from './tactical/pathfinding';

export type { MonsterCombatant, MonsterSaveAction } from './combatants/monsterCombatant';
export {
  buildMonsterCombatant,
  monsterAttackEffects,
  monsterAttacksPerTurn,
  monsterAuras,
  monsterAverageHitPoints,
  monsterDamageEffects,
  monsterSaveActions,
  monsterSaveBonus,
  normalizeAttack,
  normalizeSaveAction,
  parseAreaFromDescription,
  parseAttackFromDescription,
  parseAuraFromDescription,
  parseSaveActionFromDescription,
  primaryAttackAction,
  saveActionDamageEffects,
} from './combatants/monsterCombatant';

export type {
  BuildCharacterCombatantResult,
  CharacterCombatant,
} from './combatants/characterCombatant';
export { buildCharacterCombatant, characterSaveBonus } from './combatants/characterCombatant';

export type { DaggerheartCombatant } from './combatants/daggerheartCombatant';
export { buildDaggerheartCombatant } from './combatants/daggerheartCombatant';

export type { Mam3eCombatant } from './combatants/mam3eCombatant';
export { buildMam3eCombatant } from './combatants/mam3eCombatant';

export {
  casterSpellAreaActions,
  spellAreaAction,
  spellDamageEffects,
  spellSaveDC,
} from './combatants/spellCaster';

export type {
  ResolveAreaActions,
  ResolveAuras,
  ResolveCombatStats,
  SceneAreaAction,
  SceneAreaEffectOutcome,
  SceneAttackOutcome,
  SceneCombatStats,
  SceneRoundOutcome,
} from './combat/sceneCombat';
export {
  areaShapeForAction,
  buildSceneCombatants,
  factionForToken,
  resolveSceneAreaEffect,
  resolveSceneAttack,
  runSceneRound,
} from './combat/sceneCombat';

export {
  collectTerrainEffectsAt,
  markerCoversCell,
  markerMoveCostMultiplier,
  markerToEffects,
  sceneMoveCost,
} from './terrain/sceneTerrain';

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
