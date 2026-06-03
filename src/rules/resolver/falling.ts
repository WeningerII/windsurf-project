/**
 * Falling damage — the consequence of leaving the air without the means to stay.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). When a creature is
 * airborne and can no longer sustain flight (it never could, or it was knocked
 * out), it drops to the ground and, if it was conscious as it fell, takes
 * falling damage. The rule is per-system, RAW:
 *   - the d20 line (5e 2014/2024, 3.5e, PF1e): 1d6 bludgeoning per 10 ft, capped
 *     at 20d6 (200 ft);
 *   - PF2e: bludgeoning equal to half the distance fallen (deterministic);
 *   - M&M (a Toughness save vs a fall DC) and Daggerheart (GM-adjudicated) have no
 *     clean HP-subtraction rule, so the auto-round descends them without damage.
 *
 * Pure and deterministic — the only randomness is the injected seeded RNG.
 */

import type { SeededRng } from '../../scene/seededRng';
import { FEET_PER_CELL } from './areaTargeting';

export interface FallOutcome {
  /** Distance fallen, in feet. */
  distanceFeet: number;
  /** Number of d6 rolled (0 for deterministic or no-rule systems). */
  dice: number;
  /** Falling damage to apply (0 when the system has no HP-based fall rule). */
  damage: number;
}

/** Systems that roll 1d6 per 10 ft for falls. */
const D20_DICE_SYSTEMS = new Set(['dnd-5e-2014', 'dnd-5e-2024', 'dnd-3.5e', 'pf1e']);

/** RAW cap on falling dice in the d20 line: 20d6 at 200 ft. */
const MAX_FALL_DICE = 20;

/**
 * Resolve a fall from `heightCells` above the ground. Returns the distance, the
 * dice rolled, and the damage to apply. A zero (or negative) height — already on
 * the ground — deals nothing.
 */
export function resolveFall(params: {
  systemId?: string;
  /** Height above the ground, in grid cells. */
  heightCells: number;
  rng: SeededRng;
}): FallOutcome {
  const distanceFeet = Math.max(0, Math.floor(params.heightCells)) * FEET_PER_CELL;
  if (distanceFeet <= 0) return { distanceFeet: 0, dice: 0, damage: 0 };

  // d20 line: 1d6 per full 10 ft, capped at 20d6. An undefined system defaults to
  // this (the most common rule). Falls under 10 ft deal no damage.
  if (params.systemId === undefined || D20_DICE_SYSTEMS.has(params.systemId)) {
    const dice = Math.min(MAX_FALL_DICE, Math.floor(distanceFeet / 10));
    let damage = 0;
    for (let i = 0; i < dice; i += 1) damage += params.rng.rollDie(6);
    return { distanceFeet, dice, damage };
  }

  // PF2e: bludgeoning equal to half the distance fallen.
  if (params.systemId === 'pf2e') {
    return { distanceFeet, dice: 0, damage: Math.floor(distanceFeet / 2) };
  }

  // M&M / Daggerheart: no HP-based fall rule — descend without rolling damage.
  return { distanceFeet, dice: 0, damage: 0 };
}
