import type {
  ResourcePoolChange,
  ResourcePoolDescriptor,
  ResourcePoolList,
  ResourcePoolsContext,
  SystemResourcePoolsProvider,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { ResourcePool } from '../../utils/resourcePool';
import type { D20LegacyData, D20LegacySpellSlots } from './d20LegacySheetShared';

/**
 * Legacy d20 resource-pool provider (RFC 005 seam), shared by 3.5e and PF1e —
 * the same shape the two editions already share for spend/recover/reset in
 * `d20LegacySheetShared.ts`.
 *
 * Vancian slots are a THIRD data shape for the same pool: the cap is `total`
 * (not `max`, not a remaining count), so the id/label vocabulary is per-system
 * but the canonical projection is the same one 5e and PF2e use. The per-level
 * `manualBonus` persistence rides along on the slot and is never touched here —
 * it is a capacity input, not a spend.
 *
 * These systems have no other depletable pool in the data model: prepared-spell
 * selections are assignments rather than counters, and turn/rebuke attempts are
 * not modeled.
 */

const SLOT_PREFIX = 'd20:spell-slot:';

const slotPool = (slot: { total: number; used: number }): ResourcePool => ({
  max: slot.total,
  spent: slot.used,
});

function enumerateD20LegacyPools<T extends D20LegacyData>(
  document: CharacterDocument<T>,
  context: ResourcePoolsContext
): ResourcePoolList {
  const pools: ResourcePoolDescriptor[] = [];
  const spellsPerDay: D20LegacySpellSlots | undefined = document.system.spellsPerDay;

  for (const [level, slot] of Object.entries(spellsPerDay ?? {})) {
    if (slot.total <= 0) {
      continue;
    }
    pools.push({
      id: `${SLOT_PREFIX}${level}`,
      kind: 'spell-slot',
      label: `Level ${level} Spells Per Day`,
      pool: slotPool(slot),
    });
  }

  return { systemId: context.systemId, pools };
}

function applyD20LegacyPool<T extends D20LegacyData>(
  document: CharacterDocument<T>,
  change: ResourcePoolChange
): CharacterDocument<T> | undefined {
  if (!change.poolId.startsWith(SLOT_PREFIX)) {
    return undefined;
  }

  const level = Number(change.poolId.slice(SLOT_PREFIX.length));
  const spellsPerDay = document.system.spellsPerDay;
  const slot = spellsPerDay?.[level];
  if (!spellsPerDay || !slot) {
    return undefined;
  }

  return {
    ...document,
    system: {
      ...document.system,
      spellsPerDay: { ...spellsPerDay, [level]: { ...slot, used: change.pool.spent } },
    },
  };
}

export function createD20LegacyResourcePools<
  T extends D20LegacyData,
>(): SystemResourcePoolsProvider<T> {
  return {
    resourcePools: (document, context) => enumerateD20LegacyPools(document, context),
    applyResourcePool: (document, change) => applyD20LegacyPool(document, change),
  };
}
