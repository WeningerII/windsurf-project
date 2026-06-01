/**
 * System-agnostic equipment → effect IR compiler.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 1.
 *
 * Given a set of *active* (equipped) items that carry magic/effect bonuses, this
 * produces `EffectInstance[]` for attack, damage, and AC. The SAME function
 * serves all seven systems; the only per-system variation is the `StackPolicy`
 * chosen for an item's bonuses, which this module derives from `systemId` using
 * rules-as-written defaults:
 *
 *   - D&D 5e (2014/2024), Daggerheart, M&M 3e: bonuses `sum` (no named-bonus
 *     stacking system).
 *   - D&D 3.5e, Pathfinder 1e: bonuses are typed (default `enhancement`); only
 *     the largest of a given type applies, and different types stack.
 *   - Pathfinder 2e: bonuses fall into item/status/circumstance buckets (default
 *     `item`); the highest within a bucket applies, and buckets sum.
 *
 * The input shape is structural, not tied to any one system's equipment type, so
 * a system whose equipment is system-local can adapt into it without coupling.
 */

import type { GameSystemId } from '../../types/game-systems';
import type { BonusType } from '../../types/core/common';
import { makeEffectId, type EffectInstance, type StackPolicy } from '../ir/types';

/** Structural, system-agnostic view of a bonus-bearing item. */
export interface MagicBonusItem {
  itemId: string;
  customName?: string;
  /** +N to attack rolls (e.g. a magic weapon). */
  attackBonus?: number;
  /** +N to damage rolls (e.g. a magic weapon). */
  damageBonus?: number;
  /** +N to armor class (magic armor/shield, ring of protection). */
  acBonus?: number;
  /** d20/PF named bonus type for stacking. Defaults per system when omitted. */
  bonusType?: BonusType;
  /** PF2e stacking bucket. Defaults to 'item' when omitted. */
  pf2eBucket?: 'item' | 'status' | 'circumstance';
  /** Optional damage type to namespace the damage target (e.g. 'slashing'). */
  damageType?: string;
}

/** d20/PF systems where item bonuses are typed (largest-of-type stacking). */
const TYPED_STACK_SYSTEMS: ReadonlySet<GameSystemId> = new Set<GameSystemId>(['dnd-3.5e', 'pf1e']);

/**
 * Choose the stacking discipline for an item's bonuses in a given system.
 * Encodes the rules-as-written defaults described in the module header.
 */
export function equipStackPolicy(systemId: GameSystemId, item: MagicBonusItem): StackPolicy {
  if (systemId === 'pf2e') {
    switch (item.pf2eBucket) {
      case 'status':
        return 'pf2e-status';
      case 'circumstance':
        return 'pf2e-circumstance';
      default:
        return 'pf2e-item';
    }
  }
  if (TYPED_STACK_SYSTEMS.has(systemId)) {
    return { bonusType: item.bonusType ?? 'enhancement' };
  }
  // 5e (2014/2024), Daggerheart, M&M 3e: everything sums.
  return 'sum';
}

/**
 * Compile a list of ALREADY-ACTIVE bonus items into effect instances.
 *
 * Callers select which items are active using their own system convention
 * (5e: presence in `equipment` with a worn slot; d20-legacy/PF2e: `equipped`
 * flag) before passing them here, keeping selection where the system knowledge
 * lives and stacking where the shared rules live.
 */
export function compileEquipmentEffects(
  systemId: GameSystemId,
  activeItems: readonly MagicBonusItem[]
): EffectInstance[] {
  const effects: EffectInstance[] = [];

  for (const item of activeItems) {
    const stackPolicy = equipStackPolicy(systemId, item);
    const sourceLabel = item.customName ?? item.itemId;
    const source = { kind: 'item' as const, id: item.itemId, label: sourceLabel };

    if (isMeaningful(item.attackBonus)) {
      effects.push({
        id: makeEffectId(systemId, 'attack', item.itemId, 'atk', item.attackBonus),
        systemId,
        target: 'attack',
        operation: 'add',
        value: item.attackBonus as number,
        stackPolicy,
        source,
        label: `${sourceLabel} attack bonus`,
        category: 'other',
      });
    }

    if (isMeaningful(item.damageBonus)) {
      const target = item.damageType ? `damage.${item.damageType}` : 'damage';
      effects.push({
        id: makeEffectId(systemId, target, item.itemId, 'dmg', item.damageBonus),
        systemId,
        target,
        operation: 'add',
        value: item.damageBonus as number,
        stackPolicy,
        source,
        label: `${sourceLabel} damage bonus`,
        category: 'other',
      });
    }

    if (isMeaningful(item.acBonus)) {
      effects.push({
        id: makeEffectId(systemId, 'ac', item.itemId, 'ac', item.acBonus),
        systemId,
        target: 'ac',
        operation: 'add',
        value: item.acBonus as number,
        stackPolicy,
        source,
        label: `${sourceLabel} AC bonus`,
        category: 'defense',
      });
    }
  }

  return effects;
}

function isMeaningful(value: number | undefined): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value !== 0;
}
