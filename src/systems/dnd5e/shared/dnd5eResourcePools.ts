import type {
  ResourcePoolChange,
  ResourcePoolDescriptor,
  ResourcePoolList,
  ResourcePoolsContext,
  SystemResourcePoolsProvider,
} from '../../../registry/types';
import type { Feature, HitDice, SpellcastingInfo } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import { poolFromRemaining, remainingOf, type ResourcePool } from '../../../utils/resourcePool';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';

/**
 * 5e resource-pool provider (RFC 005 seam), shared by SRD 5.1 and 5.2 — the two
 * editions differ in rest rules, not in which counters exist, and this seam
 * enumerates counters.
 *
 * Four pools, all already modeled here as one of the two shapes RFC 005 maps:
 *
 * - Spell slots (`{ max, used }` → `{ max, spent }` directly) and Pact Magic,
 *   kept a separate kind because it refills on a different rest.
 * - Hit dice (`{ total, remaining }` → the REMAINING shape). One pool per class
 *   row, keyed by position: `classId` is optional on persisted documents, so
 *   keying by it would give two legacy rows the same id.
 * - Limited-use features (`{ current, max }` → the REMAINING shape).
 *
 * Deliberately NOT enumerated: hit points, death saves and exhaustion. HP has
 * its own stateful verb (`SystemEngine.applyDamage`) and a second write path
 * would let a caller heal without the engine's temp-HP and death-save rules;
 * death saves and exhaustion are bounded STATUS TRACKS, not resources you spend
 * and restore, which RFC 005 excludes under *Boundaries*.
 */

const SPELL_SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const slotPool = (slot: { max: number; used: number }): ResourcePool => ({
  max: slot.max,
  spent: slot.used,
});

function spellSlotId(level: number): string {
  return `dnd5e:spell-slot:${level}`;
}

function hitDiceId(index: number): string {
  return `dnd5e:hit-die:${index}`;
}

function featureId(id: string): string {
  return `dnd5e:feature-use:${id}`;
}

const PACT_MAGIC_ID = 'dnd5e:pact-slot';

function collectSpellcastingPools(
  pools: ResourcePoolDescriptor[],
  spellcasting: SpellcastingInfo | undefined
): void {
  if (!spellcasting) {
    return;
  }

  for (const level of SPELL_SLOT_LEVELS) {
    const slot = spellcasting.spellSlots[level];
    // A slot level the character has not unlocked is not a pool they have.
    if (!slot || slot.max <= 0) {
      continue;
    }
    pools.push({
      id: spellSlotId(level),
      kind: 'spell-slot',
      label: `Level ${level} Spell Slots`,
      pool: slotPool(slot),
    });
  }

  if (spellcasting.pactMagic && spellcasting.pactMagic.max > 0) {
    pools.push({
      id: PACT_MAGIC_ID,
      kind: 'pact-slot',
      label: `Pact Magic Slots (Level ${spellcasting.pactMagic.level})`,
      pool: slotPool(spellcasting.pactMagic),
    });
  }
}

function collectHitDicePools(pools: ResourcePoolDescriptor[], hitDice: HitDice[]): void {
  hitDice.forEach((entry, index) => {
    if (entry.total <= 0) {
      return;
    }
    pools.push({
      id: hitDiceId(index),
      kind: 'hit-dice',
      label: entry.classId ? `Hit Dice (${entry.classId} ${entry.die})` : `Hit Dice (${entry.die})`,
      pool: poolFromRemaining(entry.remaining, entry.total),
    });
  });
}

function collectFeaturePools(pools: ResourcePoolDescriptor[], features: Feature[]): void {
  for (const feature of features) {
    if (!feature.uses || feature.uses.max <= 0) {
      continue;
    }
    pools.push({
      id: featureId(feature.id),
      kind: 'feature-use',
      label: feature.name,
      pool: poolFromRemaining(feature.uses.current, feature.uses.max),
    });
  }
}

function enumerateDnd5ePools<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  context: ResourcePoolsContext
): ResourcePoolList {
  const pools: ResourcePoolDescriptor[] = [];
  collectSpellcastingPools(pools, document.system.spellcasting);
  collectHitDicePools(pools, document.system.hitDice);
  collectFeaturePools(pools, document.system.features);
  return { systemId: context.systemId, pools };
}

function withSystem<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  system: T
): CharacterDocument<T> {
  return { ...document, system };
}

function applyDnd5ePool<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  change: ResourcePoolChange
): CharacterDocument<T> | undefined {
  const system = document.system;

  if (change.poolId === PACT_MAGIC_ID) {
    const pactMagic = system.spellcasting?.pactMagic;
    if (!system.spellcasting || !pactMagic) {
      return undefined;
    }
    return withSystem(document, {
      ...system,
      spellcasting: {
        ...system.spellcasting,
        pactMagic: { ...pactMagic, used: change.pool.spent },
      },
    });
  }

  const slotLevel = idSuffix(change.poolId, 'dnd5e:spell-slot:');
  if (slotLevel !== undefined) {
    const level = Number(slotLevel);
    const spellcasting = system.spellcasting;
    if (!spellcasting || !isSpellSlotLevel(level)) {
      return undefined;
    }
    return withSystem(document, {
      ...system,
      spellcasting: {
        ...spellcasting,
        spellSlots: {
          ...spellcasting.spellSlots,
          [level]: { ...spellcasting.spellSlots[level], used: change.pool.spent },
        },
      },
    });
  }

  const hitDiceIndex = idSuffix(change.poolId, 'dnd5e:hit-die:');
  if (hitDiceIndex !== undefined) {
    const index = Number(hitDiceIndex);
    const entry = system.hitDice[index];
    if (!entry) {
      return undefined;
    }
    const hitDice = [...system.hitDice];
    hitDice[index] = { ...entry, remaining: remainingOf(change.pool) };
    return withSystem(document, { ...system, hitDice });
  }

  const featureKey = idSuffix(change.poolId, 'dnd5e:feature-use:');
  if (featureKey !== undefined) {
    const index = system.features.findIndex((feature) => feature.id === featureKey);
    const feature = system.features[index];
    if (!feature?.uses) {
      return undefined;
    }
    const features = [...system.features];
    features[index] = {
      ...feature,
      uses: { ...feature.uses, current: remainingOf(change.pool) },
    };
    return withSystem(document, { ...system, features });
  }

  return undefined;
}

function idSuffix(poolId: string, prefix: string): string | undefined {
  return poolId.startsWith(prefix) ? poolId.slice(prefix.length) : undefined;
}

function isSpellSlotLevel(level: number): level is (typeof SPELL_SLOT_LEVELS)[number] {
  return (SPELL_SLOT_LEVELS as readonly number[]).includes(level);
}

export function createDnd5eResourcePools<
  T extends Dnd5eLikeDataModel,
>(): SystemResourcePoolsProvider<T> {
  return {
    resourcePools: (document, context) => enumerateDnd5ePools(document, context),
    applyResourcePool: (document, change) => applyDnd5ePool(document, change),
  };
}
