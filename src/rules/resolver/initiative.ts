/**
 * Initiative rolling — order the combatants for a round.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). Each combatant rolls a
 * d20 plus its initiative modifier (Dexterity for the d20 family, Agility for
 * M&M, the relevant trait for Daggerheart — supplied by the caller, kept
 * system-agnostic here). The order is the totals descending, with a stable
 * id tie-break so a given (combatants, seed) always yields the same order.
 * Deterministic: the only randomness is the injected seeded RNG.
 */

import type { SeededRng } from '../../scene/seededRng';

export interface InitiativeRollInput {
  tokenId: string;
  /** Initiative modifier (e.g. the Dexterity modifier), 0 when unknown. */
  modifier: number;
}

export interface InitiativeRollResult {
  tokenId: string;
  roll: number;
  /** roll + modifier — the initiative count, highest acts first. */
  total: number;
}

/**
 * Roll initiative for every combatant and return them ordered highest-first.
 * Each combatant draws one d20 from the seeded stream (in input order, so the
 * roll is stable); ties break deterministically by token id.
 */
export function rollInitiative(
  combatants: readonly InitiativeRollInput[],
  rng: SeededRng
): InitiativeRollResult[] {
  return combatants
    .map((combatant) => {
      const roll = rng.rollDie(20);
      return { tokenId: combatant.tokenId, roll, total: roll + combatant.modifier };
    })
    .sort((a, b) => b.total - a.total || a.tokenId.localeCompare(b.tokenId));
}
