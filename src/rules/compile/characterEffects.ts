/**
 * Character-level effect resolution.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 1.
 *
 * One entry point a system engine calls to turn a character's equipped items and
 * feat/feature modifiers into resolved per-target bonuses, through the shared
 * resolver. Identical across systems; the only per-system variation lives inside
 * the equipment/modifier compilers (stacking discipline).
 *
 * This is additive by design: a character with no magic-bearing gear and no
 * feat/feature modifiers resolves to zero on every target, so wiring it into an
 * engine cannot change existing derived values.
 */

import type { GameSystemId } from '../../types/game-systems';
import type { Feat, Feature } from '../../types/core/character';
import type { ContributionLedgerResult } from '../../types/core/contributionLedger';
import type { EffectInstance } from '../ir/types';
import { compileEquipmentEffects, type MagicBonusItem } from './equipEffects';
import { compileModifierEffects, type ModifierSource } from './modifierEffects';
import { compileBaseArmorClassEffects } from './defense';
import { resolveEffects, type ResolveContext, type ResolveResult } from '../resolver/resolve';
import { toContributionLedger } from '../ir/ledgerView';

/** The subset of a system data model the resolver reads. All fields optional. */
export interface CharacterEffectInputs {
  equipment?: readonly MagicBonusItem[];
  feats?: readonly Feat[];
  features?: readonly Feature[];
  /**
   * Precomputed base armor class. When provided it is seeded as a `set` on the
   * `'ac'` target, so `bonus('ac')` returns the FULL AC (base + magic/feat/equip
   * bonuses) instead of just the additive delta. Omit it and AC resolution stays
   * purely additive (the historical behavior for callers that add base later).
   */
  baseArmorClass?: number;
  /**
   * Pre-compiled active-condition effects, produced by ANY system's
   * `collectXConditionEffects` helper (5e, d20-legacy, PF2e, M&M, Daggerheart).
   * Folding them here is the W5 seam: conditions stop being read only by bespoke
   * engine branches and instead enter the SAME resolver as equipment/feat/feature
   * effects, so they appear in ledgers and obey per-target stacking. The contract
   * is system-agnostic — it consumes `EffectInstance[]`, never a per-system
   * condition shape — so every system's condition vocabulary expresses in it:
   * 5e `disadvantage`, d20-legacy flat `subtract` check-penalties, PF2e
   * `pf2e-status`/`pf2e-circumstance` penalties, M&M Toughness `subtract`, and
   * Daggerheart `note`s (which fold to zero, staying additive).
   *
   * Additive by design: `[]` (the default) changes nothing, so a system with no
   * active conditions resolves byte-identically to before. Because a condition
   * helper only emits effects for ACTIVE ids (and each carries a `has-condition`
   * guard), the referenced condition ids are unioned into the resolve context so
   * those guards pass without the caller having to restate them.
   */
  conditions?: readonly EffectInstance[];
}

export interface ResolvedCharacterEffects {
  /** Full resolver output, including the applied-effect ledger. */
  result: ResolveResult;
  /** Convenience: resolved total for a target, or 0 when nothing targeted it. */
  bonus: (target: string) => number;
}

/**
 * Resolve all equipment + feat/feature effects for a character into per-target
 * bonuses. Feats and features are mapped to modifier sources; equipped items are
 * mapped to magic-bonus items (they are structurally compatible).
 */
export function resolveCharacterEffects(
  systemId: GameSystemId,
  inputs: CharacterEffectInputs,
  ctx: ResolveContext = {}
): ResolvedCharacterEffects {
  const sources: ModifierSource[] = [
    ...(inputs.feats ?? []).map(
      (feat): ModifierSource => ({
        id: feat.id,
        name: feat.name,
        kind: 'feat',
        modifiers: feat.modifiers,
      })
    ),
    ...(inputs.features ?? []).map(
      (feature): ModifierSource => ({
        id: feature.id,
        name: feature.name,
        kind: 'feature',
        modifiers: feature.modifiers,
      })
    ),
  ];

  const conditionEffects = inputs.conditions ?? [];
  const effects = [
    ...(inputs.baseArmorClass !== undefined
      ? compileBaseArmorClassEffects(systemId, inputs.baseArmorClass)
      : []),
    ...compileEquipmentEffects(systemId, inputs.equipment ?? []),
    ...compileModifierEffects(systemId, sources),
    ...conditionEffects,
  ];

  const result = resolveEffects(effects, contextWithConditionIds(ctx, conditionEffects));
  return {
    result,
    bonus: (target: string) => result.byTarget[target]?.total ?? 0,
  };
}

/**
 * Union the condition ids referenced by folded condition effects into the resolve
 * context, so their `has-condition` guards pass. Only `has-condition` (subject)
 * guards are harvested — attacker/target-gated effects deliberately stay on the
 * OTHER side of a roll. Returns `ctx` unchanged when there are no condition
 * effects, preserving byte-identical resolution for callers that pass none.
 */
function contextWithConditionIds(
  ctx: ResolveContext,
  conditionEffects: readonly EffectInstance[]
): ResolveContext {
  if (conditionEffects.length === 0) {
    return ctx;
  }
  const conditions = new Set(ctx.conditions ?? []);
  for (const effect of conditionEffects) {
    const condition = effect.condition;
    if (condition?.kind === 'has-condition' && typeof condition.conditionId === 'string') {
      conditions.add(condition.conditionId);
    }
  }
  return { ...ctx, conditions };
}

/**
 * Ledger resolver-backing seam (W4): resolve a character's equipment, feat and
 * feature modifiers AND folded conditions, then project the applied-effect ledger
 * straight into contribution entries. One call re-backs a hand-built (or absent)
 * per-system ledger onto the shared resolver, so provenance and resolution are
 * never two parallel computations. Additive: no bonus-bearing inputs ⇒ no rows.
 */
export function resolveCharacterLedger(
  systemId: GameSystemId,
  inputs: CharacterEffectInputs,
  ctx: ResolveContext = {}
): ContributionLedgerResult {
  return toContributionLedger(resolveCharacterEffects(systemId, inputs, ctx).result.ledger);
}
