/**
 * The ONE place a character's FULL armor class is composed.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 1/3.
 *
 * `defense.ts` owns the per-system BASE formulas; `characterEffects.ts` owns the
 * shared resolver fold. Composing the two — "compute the base, seed it as a `set`
 * on `'ac'`, fold the equipped magic-item / feat / feature AC effects on top, and
 * read `bonus('ac')`" — was previously copy-pasted at SIX call sites: each of the
 * 3.5e / PF1e / PF2e engines AND, verbatim, each of their declarative
 * `derivedQuantities.ts` twins, plus the 5e engine and (a second, independent
 * re-implementation of the Unarmored Defense max-fold) the 5e contribution
 * ledger. Two copies of one composition are exactly the "two code paths for one
 * truth, free to diverge" the RFC set out to remove.
 *
 * This module holds that composition once per system family. Every function here
 * is a pure rearrangement of the code it replaced — same helpers, same order,
 * same arithmetic — so armor class is byte-identical to before.
 *
 * LAYER BOUNDARY: `rules/` may not value-import from `src/systems/**`, so the
 * inputs are structural and any system-local term (5e's Defense fighting style,
 * PF2e's proficiency total) is computed by the caller and passed in.
 */

import type { Feat, Feature } from '../../types/core/character';
import type { GameSystemId } from '../../types/game-systems';
import { abilityMod } from '../../utils/math';
import {
  dnd5eUnarmoredDefenseBarbarian,
  dnd5eUnarmoredDefenseMonk,
} from '../../utils/derivedCombatMath';
import { compute5eAC, computeD20LegacyAC, computePf2eAC } from './defense';
import { resolveCharacterEffects } from './characterEffects';
import type { MagicBonusItem } from './equipEffects';

/** Structural view of an equipment entry, as every AC formula reads one. */
export type ArmorClassItem = MagicBonusItem & {
  slot?: string;
  equipped?: boolean;
  armorClass?: number;
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number;
  shieldBonus?: number;
  raised?: boolean;
};

/** Structural view of the character state every AC composition reads. */
export interface ArmorClassCharacter {
  baseAttributes: Record<string, number>;
  equipment: readonly ArmorClassItem[];
  feats?: readonly Feat[];
  features?: readonly Feature[];
}

/**
 * Fold a computed base armor class together with the character's bonus-bearing
 * item / feat / feature AC effects. The base seeds a `set` on `'ac'`; the
 * additive effects layer on top; `bonus('ac')` is base + bonuses.
 *
 * `activeEquipment` is passed in rather than filtered here because the families
 * genuinely differ and MUST keep differing: 3.5e/PF1e/PF2e carry an `equipped`
 * flag over a full inventory, while a 5e `system.equipment` list is already the
 * worn set (it is slot-keyed and carries no `equipped` flag). Filtering
 * uniformly would silently zero every 5e magic-item AC bonus.
 */
function foldArmorClass(
  systemId: GameSystemId,
  character: ArmorClassCharacter,
  activeEquipment: readonly ArmorClassItem[],
  baseArmorClass: number
): number {
  return resolveCharacterEffects(systemId, {
    equipment: activeEquipment,
    feats: character.feats,
    features: character.features,
    baseArmorClass,
  }).bonus('ac');
}

// ─── D&D 3.5e / Pathfinder 1e ───────────────────────────────────────────────

/**
 * FULL d20-legacy armor class: `{ total, touch, flatFooted }`.
 *
 * The `{total, touch, flatFooted}` tuple is not a single scalar, and today only
 * `total` receives additive AC bonuses (touch/flat-footed take none), so only
 * `total` flows through the resolver. Per-bonus-type routing to touch and
 * flat-footed is a Phase 2 refinement, deliberately NOT introduced here — this
 * function is a relocation, not a rules change.
 */
export function resolveD20LegacyArmorClass(
  systemId: 'dnd-3.5e' | 'pf1e',
  character: ArmorClassCharacter & { sizeCategory: string }
): { total: number; touch: number; flatFooted: number } {
  const ac = computeD20LegacyAC(
    character.baseAttributes.dex ?? 10,
    character.sizeCategory,
    character.equipment
  );
  return {
    total: foldArmorClass(
      systemId,
      character,
      character.equipment.filter((item) => item.equipped),
      ac.total
    ),
    touch: ac.touch,
    flatFooted: ac.flatFooted,
  };
}

// ─── Pathfinder 2e ──────────────────────────────────────────────────────────

/**
 * FULL PF2e armor class.
 *
 * `armorProficiencyBonus` is supplied by the caller because the tier → total
 * mapping (`profTotal`) is PF2e-local. `statusPenalty` is the single worst
 * Dex-scoped status penalty (CRB Conditions Appendix: frightened/sickened
 * penalize every check and DC — AC included — and clumsy penalizes Dex-based
 * ones); it applies AFTER the armor's Dex cap, so it is subtracted from the
 * folded total, exactly as both former call sites did.
 */
export function resolvePf2eArmorClass(
  character: ArmorClassCharacter,
  armorProficiencyBonus: number,
  statusPenalty: number
): number {
  const base = computePf2eAC(
    character.baseAttributes.dex ?? 10,
    armorProficiencyBonus,
    character.equipment
  );
  return (
    foldArmorClass(
      'pf2e',
      character,
      character.equipment.filter((item) => item.equipped),
      base
    ) - statusPenalty
  );
}

// ─── D&D 5e (2014 & 2024) ───────────────────────────────────────────────────

/** Which Unarmored Defense formula (if any) beats plain armor/shield AC. */
export interface Dnd5eUnarmoredDefense {
  featureId: 'unarmored-defense-barbarian' | 'unarmored-defense-monk';
  label: string;
  /** The feature's total AC, INCLUDING any shield it still allows. */
  total: number;
}

/**
 * The 5e base armor-class fold: armor/shield AC, replaced by the best applicable
 * Unarmored Defense formula (SRD 5.1/5.2, identical in both editions) when the
 * character has the class feature and wears no armor:
 *   - Barbarian: 10 + Dex mod + Con mod (a shield still applies)
 *   - Monk:      10 + Dex mod + Wis mod (no armor AND no shield)
 *
 * Returns the components as well as the winner so the contribution ledger can
 * EXPLAIN the same fold it resolves, instead of re-deriving it independently.
 */
export function computeDnd5eBaseArmorClass(
  character: ArmorClassCharacter,
  dexMod: number
): {
  base: number;
  plainUnarmored: number;
  unarmoredDefense: Dnd5eUnarmoredDefense | null;
} {
  const armorShieldAC = compute5eAC(character.baseAttributes.dex ?? 10, character.equipment);
  const armor = character.equipment.find((e) => e.slot === 'chest' && e.armorClass != null);
  const shield = character.equipment.find((e) => e.slot === 'offHand' && e.shieldBonus != null);
  const plainUnarmored = 10 + dexMod + (shield?.shieldBonus ?? 0);

  if (armor) {
    return { base: armorShieldAC, plainUnarmored, unarmoredDefense: null };
  }

  const features = character.features ?? [];
  const hasFeature = (featureId: string) => features.some((feature) => feature.id === featureId);
  let unarmoredDefense: Dnd5eUnarmoredDefense | null = null;

  if (hasFeature('unarmored-defense-barbarian')) {
    const conMod = abilityMod(character.baseAttributes.con ?? 10);
    unarmoredDefense = {
      featureId: 'unarmored-defense-barbarian',
      label: 'Unarmored Defense (Barbarian)',
      total: dnd5eUnarmoredDefenseBarbarian(dexMod, conMod) + (shield?.shieldBonus ?? 0),
    };
  }
  if (!shield && hasFeature('unarmored-defense-monk')) {
    const wisMod = abilityMod(character.baseAttributes.wis ?? 10);
    const monkTotal = dnd5eUnarmoredDefenseMonk(dexMod, wisMod);
    if (monkTotal > (unarmoredDefense?.total ?? 0)) {
      unarmoredDefense = {
        featureId: 'unarmored-defense-monk',
        label: 'Unarmored Defense (Monk)',
        total: monkTotal,
      };
    }
  }

  return {
    base: Math.max(armorShieldAC, unarmoredDefense?.total ?? armorShieldAC),
    plainUnarmored,
    unarmoredDefense,
  };
}

/**
 * FULL 5e armor class. `extraBaseBonus` carries the system-local Defense
 * fighting-style bonus, which the engine reads from its own activity state.
 */
export function resolveDnd5eArmorClass(
  systemId: GameSystemId,
  character: ArmorClassCharacter,
  dexMod: number,
  extraBaseBonus: number
): number {
  const base = computeDnd5eBaseArmorClass(character, dexMod).base + extraBaseBonus;
  // 5e's `system.equipment` IS the worn set (slot-keyed, no `equipped` flag), so
  // it is passed through unfiltered — exactly as the engine did before.
  return foldArmorClass(systemId, character, character.equipment, base);
}
