/**
 * 5e concentration checks.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). A creature
 * concentrating on a spell that takes damage must make a Constitution saving
 * throw or lose concentration: DC = max(10, half the damage taken) (PHB p.203).
 * Deterministic — the only randomness is the injected seeded RNG.
 */

import type { SeededRng } from '../../scene/seededRng';
import type { SceneActionIntent } from '../../types/core/scene';

export interface ConcentrationCheck {
  /** The save DC: max(10, floor(damage / 2)). */
  dc: number;
  roll: number;
  /** roll + Constitution save bonus. */
  total: number;
  /** True when concentration holds (total >= dc). */
  maintained: boolean;
}

/**
 * Resolve a concentration save against a chunk of damage. Zero/negative damage
 * never threatens concentration (it always holds).
 */
export function resolveConcentrationCheck(params: {
  damage: number;
  conSaveBonus: number;
  rng: SeededRng;
}): ConcentrationCheck {
  if (params.damage <= 0) {
    return { dc: 10, roll: 20, total: 20 + params.conSaveBonus, maintained: true };
  }
  const dc = Math.max(10, Math.floor(params.damage / 2));
  const roll = params.rng.rollDie(20);
  const total = roll + params.conSaveBonus;
  return { dc, roll, total, maintained: total >= dc };
}

/**
 * When a concentrating token takes damage, roll the save and — if it fails —
 * produce a `set-concentration` intent that clears it. Returns the intent plus
 * the check for logging, or undefined when there's nothing to break or it held.
 */
export function concentrationBreak(params: {
  tokenId: string;
  concentration: string | undefined;
  conSaveBonus: number;
  damage: number;
  rng: SeededRng;
}): { intent: SceneActionIntent; check: ConcentrationCheck } | undefined {
  if (!params.concentration || params.damage <= 0) return undefined;
  const check = resolveConcentrationCheck({
    damage: params.damage,
    conSaveBonus: params.conSaveBonus,
    rng: params.rng,
  });
  if (check.maintained) return undefined;
  return {
    intent: { type: 'set-concentration', tokenId: params.tokenId, spell: undefined },
    check,
  };
}
