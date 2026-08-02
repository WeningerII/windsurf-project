import type {
  ResourcePoolChange,
  ResourcePoolList,
  ResourcePoolsContext,
  SystemResourcePoolsProvider,
} from '../../registry/types';
import { DAGGERHEART_MAX_HOPE } from '../../rules/daggerheartDerived';
import type { CharacterDocument } from '../../types/core/document';
import { createPool, poolFromRemaining, remainingOf } from '../../utils/resourcePool';
import type { DaggerheartDataModel } from './data-model';

/**
 * Daggerheart resource-pool provider (RFC 005 seam).
 *
 * This system is the reason the seam is worth having, because its counters run
 * the OTHER WAY and the canonical `{ max, spent }` pool absorbs it with no
 * special case:
 *
 * - Stress and Armor Slots are MARKED tracks — `current` counts what has been
 *   used up, so it maps straight onto `spent` (`createPool(max, current)`).
 *   Marking Stress is `spend`; clearing it on a downtime move is `restore`.
 * - Hope is HELD — `hope` counts what you still have, so it is the REMAINING
 *   view of a pool capped at `DAGGERHEART_MAX_HOPE`. Spending Hope on a move is
 *   the same `spend` verb that marks Stress.
 *
 * Hit Points are deliberately NOT enumerated: they are the engine's
 * `applyDamage` surface, and Daggerheart HP is marked against damage thresholds
 * rather than spent, so exposing a second write path would let a caller bypass
 * the threshold rules. `daggerheartRest.ts` keeps the downtime moves — rest here
 * is player-CHOSEN moves, not an automatic refill, so no rest verb belongs on a
 * cross-system seam.
 */

const STRESS_ID = 'daggerheart:stress';
const ARMOR_ID = 'daggerheart:armor-slot';
const HOPE_ID = 'daggerheart:hope';

function enumerateDaggerheartPools(
  document: CharacterDocument<DaggerheartDataModel>,
  context: ResourcePoolsContext
): ResourcePoolList {
  const system = document.system;
  return {
    systemId: context.systemId,
    pools: [
      {
        id: STRESS_ID,
        kind: 'stress',
        label: 'Stress',
        pool: createPool(system.stress.max, system.stress.current),
      },
      {
        id: ARMOR_ID,
        kind: 'armor-slot',
        label: 'Armor Slots',
        pool: createPool(system.armor.max, system.armor.current),
      },
      {
        id: HOPE_ID,
        kind: 'hope',
        label: 'Hope',
        pool: poolFromRemaining(system.hope, DAGGERHEART_MAX_HOPE),
      },
    ],
  };
}

function applyDaggerheartPool(
  document: CharacterDocument<DaggerheartDataModel>,
  change: ResourcePoolChange
): CharacterDocument<DaggerheartDataModel> | undefined {
  const system = document.system;

  switch (change.poolId) {
    case STRESS_ID:
      return {
        ...document,
        system: { ...system, stress: { ...system.stress, current: change.pool.spent } },
      };
    case ARMOR_ID:
      return {
        ...document,
        system: { ...system, armor: { ...system.armor, current: change.pool.spent } },
      };
    case HOPE_ID:
      return { ...document, system: { ...system, hope: remainingOf(change.pool) } };
    default:
      return undefined;
  }
}

export function createDaggerheartResourcePools(): SystemResourcePoolsProvider<DaggerheartDataModel> {
  return {
    resourcePools: (document, context) => enumerateDaggerheartPools(document, context),
    applyResourcePool: (document, change) => applyDaggerheartPool(document, change),
  };
}
