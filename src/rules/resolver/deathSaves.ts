/**
 * 5e death saving throws.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). A creature at 0 hit
 * points that isn't killed outright makes a death save at the start of each of
 * its turns: 10+ is a success, under 10 a failure; a natural 1 counts as two
 * failures, a natural 20 means it regains 1 hit point and is back up. Three
 * successes stabilize it; three failures kill it (PHB p.197). Deterministic —
 * the only randomness is the injected seeded RNG.
 */

import type { SeededRng } from '../../scene/seededRng';

export type DeathSaveStatus = 'dying' | 'stable' | 'dead' | 'revived';

export interface DeathSaveResult {
  roll: number;
  successes: number;
  failures: number;
  status: DeathSaveStatus;
}

/**
 * Roll one death save from the running success/failure tally and return the
 * updated counts and status. A revive resets the tally (the creature is up); a
 * stable result keeps it at 0 hp but no longer dying.
 */
export function rollDeathSave(params: {
  rng: SeededRng;
  successes: number;
  failures: number;
}): DeathSaveResult {
  const roll = params.rng.rollDie(20);

  if (roll === 20) {
    // Back on its feet with 1 hit point; the tally clears.
    return { roll, successes: 0, failures: 0, status: 'revived' };
  }

  let successes = params.successes;
  let failures = params.failures;
  if (roll === 1)
    failures += 2; // a natural 1 is two failures
  else if (roll >= 10) successes += 1;
  else failures += 1;

  successes = Math.min(3, successes);
  failures = Math.min(3, failures);

  const status: DeathSaveStatus = failures >= 3 ? 'dead' : successes >= 3 ? 'stable' : 'dying';
  return { roll, successes, failures, status };
}
