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
import { compileEquipmentEffects, type MagicBonusItem } from './equipEffects';
import { compileModifierEffects, type ModifierSource } from './modifierEffects';
import { resolveEffects, type ResolveContext, type ResolveResult } from '../resolver/resolve';

/** The subset of a system data model the resolver reads. All fields optional. */
export interface CharacterEffectInputs {
  equipment?: readonly MagicBonusItem[];
  feats?: readonly Feat[];
  features?: readonly Feature[];
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

  const effects = [
    ...compileEquipmentEffects(systemId, inputs.equipment ?? []),
    ...compileModifierEffects(systemId, sources),
  ];

  const result = resolveEffects(effects, ctx);
  return {
    result,
    bonus: (target: string) => result.byTarget[target]?.total ?? 0,
  };
}
