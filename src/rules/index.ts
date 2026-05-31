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

export { effectToLedgerEntry, toContributionLedger } from './ir/ledgerView';

export type { MagicBonusItem } from './compile/equipEffects';
export { compileEquipmentEffects, equipStackPolicy } from './compile/equipEffects';

export type { ModifierSource } from './compile/modifierEffects';
export { compileModifierEffects, compileModifierSource } from './compile/modifierEffects';

export type { CharacterEffectInputs, ResolvedCharacterEffects } from './compile/characterEffects';
export { resolveCharacterEffects } from './compile/characterEffects';
