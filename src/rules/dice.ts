/**
 * Shared in-sheet roll primitives (d20 checks, Daggerheart duality), built on the
 * one dice-randomness primitive (`src/scene/seededRng.ts`).
 *
 * Every system's `rollCheck` rolls through here instead of inlining
 * `Math.floor(Math.random() * N) + 1`, so all rolls share one tested code path
 * and are seedable (pass a `createSeededRng` for deterministic tests / replay).
 * This is the same `Rng`/`rollDie` substrate the resolver's attack/damage path
 * (`src/rules/resolver/*`) already uses, so checks and L3 damage rolls compose.
 */

import { createLiveRng, type Rng } from '../scene/seededRng';
import type { RollMode } from './resolver/resolve';

export type { RollMode };

export interface D20Roll {
  /** The d20 value that counts after advantage/disadvantage. */
  chosen: number;
  /** Dice-notation for the roll, e.g. `1d20`, `2d20kh1`, `2d20kl1`. */
  formula: string;
  /** Every d20 rolled (one for normal, two for advantage/disadvantage). */
  terms: number[];
}

/** Roll a d20 under the given advantage mode. Defaults to a fresh live roll. */
export function rollD20(mode: RollMode, rng: Rng = createLiveRng()): D20Roll {
  const first = rng.rollDie(20);
  if (mode === 'normal') {
    return { chosen: first, formula: '1d20', terms: [first] };
  }
  const second = rng.rollDie(20);
  if (mode === 'advantage') {
    return { chosen: Math.max(first, second), formula: '2d20kh1', terms: [first, second] };
  }
  return { chosen: Math.min(first, second), formula: '2d20kl1', terms: [first, second] };
}

export interface DualityRoll {
  hope: number;
  fear: number;
}

/** Roll Daggerheart's Duality Dice (Hope d12 + Fear d12). Defaults to live. */
export function rollDuality(rng: Rng = createLiveRng()): DualityRoll {
  return { hope: rng.rollDie(12), fear: rng.rollDie(12) };
}
