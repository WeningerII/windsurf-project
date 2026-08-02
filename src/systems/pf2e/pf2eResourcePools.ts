import type {
  ResourcePoolChange,
  ResourcePoolDescriptor,
  ResourcePoolList,
  ResourcePoolsContext,
  SystemResourcePoolsProvider,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import { poolFromRemaining, remainingOf, type ResourcePool } from '../../utils/resourcePool';
import type { Pf2eDataModel, Pf2eSpellcasting } from './data-model';
import { PF2E_HERO_POINTS_MAX } from './derivedMath';

/**
 * PF2e resource-pool provider (RFC 005 seam).
 *
 * Three pools with three different refresh rules, which is why the seam
 * enumerates counters and leaves rest to each system: spell slots refill on
 * Daily Preparations, Refocus returns exactly ONE focus point, and Hero Points
 * are granted by the GM and reset at session start. Nothing here encodes any of
 * that — `pf2eSheetShared.ts` still owns the rest verbs.
 *
 * Hero Points are a genuine spend-pool despite being stored as a bare `number`:
 * the cap is the CRB's 3 (`PF2E_HERO_POINTS_MAX`), so the held count is the
 * REMAINING view of a 3-capacity pool and spending one is `spend`.
 */

const HERO_POINTS_ID = 'pf2e:hero-point';
const FOCUS_ID = 'pf2e:focus';
const SPELL_SLOT_PREFIX = 'pf2e:spell-slot:';

const slotPool = (slot: { max: number; used: number }): ResourcePool => ({
  max: slot.max,
  spent: slot.used,
});

function collectSpellcastingPools(
  pools: ResourcePoolDescriptor[],
  spellcasting: Pf2eSpellcasting | undefined
): void {
  if (!spellcasting) {
    return;
  }

  for (const [rank, slot] of Object.entries(spellcasting.spellSlots)) {
    if (slot.max <= 0) {
      continue;
    }
    pools.push({
      id: `${SPELL_SLOT_PREFIX}${rank}`,
      kind: 'spell-slot',
      label: `Rank ${rank} Spell Slots`,
      pool: slotPool(slot),
    });
  }

  if (spellcasting.focusPoints.max > 0) {
    pools.push({
      id: FOCUS_ID,
      kind: 'focus',
      label: 'Focus Points',
      pool: poolFromRemaining(spellcasting.focusPoints.current, spellcasting.focusPoints.max),
    });
  }
}

function enumeratePf2ePools(
  document: CharacterDocument<Pf2eDataModel>,
  context: ResourcePoolsContext
): ResourcePoolList {
  const system = document.system;
  const pools: ResourcePoolDescriptor[] = [
    {
      id: HERO_POINTS_ID,
      kind: 'hero-point',
      label: 'Hero Points',
      pool: poolFromRemaining(system.heroPoints, PF2E_HERO_POINTS_MAX),
    },
  ];
  collectSpellcastingPools(pools, system.spellcasting);
  return { systemId: context.systemId, pools };
}

function applyPf2ePool(
  document: CharacterDocument<Pf2eDataModel>,
  change: ResourcePoolChange
): CharacterDocument<Pf2eDataModel> | undefined {
  const system = document.system;

  if (change.poolId === HERO_POINTS_ID) {
    return { ...document, system: { ...system, heroPoints: remainingOf(change.pool) } };
  }

  if (change.poolId === FOCUS_ID) {
    if (!system.spellcasting) {
      return undefined;
    }
    return {
      ...document,
      system: {
        ...system,
        spellcasting: {
          ...system.spellcasting,
          focusPoints: {
            ...system.spellcasting.focusPoints,
            current: remainingOf(change.pool),
          },
        },
      },
    };
  }

  if (change.poolId.startsWith(SPELL_SLOT_PREFIX)) {
    const rank = Number(change.poolId.slice(SPELL_SLOT_PREFIX.length));
    const slot = system.spellcasting?.spellSlots[rank];
    if (!system.spellcasting || !slot) {
      return undefined;
    }
    return {
      ...document,
      system: {
        ...system,
        spellcasting: {
          ...system.spellcasting,
          spellSlots: {
            ...system.spellcasting.spellSlots,
            [rank]: { ...slot, used: change.pool.spent },
          },
        },
      },
    };
  }

  return undefined;
}

export function createPf2eResourcePools(): SystemResourcePoolsProvider<Pf2eDataModel> {
  return {
    resourcePools: (document, context) => enumeratePf2ePools(document, context),
    applyResourcePool: (document, change) => applyPf2ePool(document, change),
  };
}
