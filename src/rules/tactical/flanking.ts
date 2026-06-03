/**
 * Flanking — a grid + N-participant tactical mechanic.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). When an attacker and an
 * ally stand on opposite sides of a foe, the d20-legacy systems and Pathfinder
 * reward it: 3.5e/PF1e grant +2 to the attack roll, PF2e makes the target
 * off-guard (−2 AC). Both net to "+2 to hit", which this layer applies as a
 * reduction of the target's effective defense. 5e has no flanking in core, so it
 * grants nothing. Pure and deterministic — no RNG, just positions.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance, type DiagonalRule } from '../resolver/areaTargeting';

/** The to-hit value flanking is worth in a system (0 where it isn't a rule). */
export function flankToHitBonus(systemId: string | undefined): number {
  switch (systemId) {
    case 'dnd-3.5e':
    case 'pf1e':
    case 'pf2e':
      return 2;
    default:
      return 0; // 5e (2014/2024) has no core flanking
  }
}

/**
 * Whether the attacker flanks the target: it is within melee reach and an ally
 * occupies the cell directly opposite it across the target (the standard grid
 * rule). The opposite cell mirrors the attacker through the target's space, so
 * an adjacent attacker's mirror is itself adjacent — a clean both-sides test.
 */
export function isFlanking(params: {
  attacker: SceneCoordinate;
  target: SceneCoordinate;
  reach: number;
  allies: readonly SceneCoordinate[];
  rule?: DiagonalRule;
}): boolean {
  const { attacker, target, reach, allies, rule } = params;
  if (gridDistance(attacker, target, rule) > reach) return false;
  // Flanking is a horizontal pincer: the attacker and the opposite ally must
  // share the target's elevation. A flyer hovering above (or below) the target
  // is not "on the opposite side" and grants no flank. With no elevation set
  // everywhere, every z is 0 and this reduces to the flat-grid rule.
  const plane = target.z ?? 0;
  if ((attacker.z ?? 0) !== plane) return false;
  const opposite = { x: 2 * target.x - attacker.x, y: 2 * target.y - attacker.y };
  return allies.some(
    (ally) => ally.x === opposite.x && ally.y === opposite.y && (ally.z ?? 0) === plane
  );
}
