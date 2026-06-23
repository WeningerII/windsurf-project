import { describe, expect, it } from 'vitest';
import type {
  DaggerheartArmor,
  DaggerheartConsumable,
  DaggerheartDomainCard,
  DaggerheartDomain,
  DaggerheartLoot,
  DaggerheartWeapon,
  DaggerheartAncestry,
  DaggerheartClass,
  DaggerheartCommunity,
} from '../../../types/daggerheart';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../../systems/daggerheart/data-model';
import { getDaggerheartSheetState } from '../../../systems/daggerheart/getDaggerheartSheetState';

/**
 * Direct branch coverage for the pure sheet-state derivation. Each case asserts a
 * REAL observable in the returned view (resolved selections, missing-value flags,
 * tier-gated filtering, tag-only search matches, and stowed-weapon resolution),
 * not merely that the function executed.
 */

function makeWeapon(
  id: string,
  category: 'primary' | 'secondary',
  over: Partial<DaggerheartWeapon> = {}
): DaggerheartWeapon {
  return {
    id,
    name: id,
    category,
    tier: 1,
    damage: '1d6',
    feature: '',
    burden: 1,
    ...over,
  } as DaggerheartWeapon;
}

function makeLoot(id: string, over: Partial<DaggerheartLoot> = {}): DaggerheartLoot {
  return {
    id,
    name: id,
    category: 'loot',
    description: '',
    tags: [],
    ...over,
  } as DaggerheartLoot;
}

function makeConsumable(
  id: string,
  over: Partial<DaggerheartConsumable> = {}
): DaggerheartConsumable {
  return {
    id,
    name: id,
    category: 'consumable',
    description: '',
    tags: [],
    maxQuantity: 5,
    ...over,
  } as DaggerheartConsumable;
}

const BASE_PROPS = {
  optionsState: 'ready' as 'loading' | 'ready' | 'error',
  classOptions: [] as DaggerheartClass[],
  ancestryOptions: [] as DaggerheartAncestry[],
  communityOptions: [] as DaggerheartCommunity[],
  domainOptions: [] as DaggerheartDomain[],
  domainCardOptions: [] as DaggerheartDomainCard[],
  weaponOptions: [] as DaggerheartWeapon[],
  armorOptions: [] as DaggerheartArmor[],
  lootOptions: [] as DaggerheartLoot[],
  consumableOptions: [] as DaggerheartConsumable[],
  domainCardSearch: '',
  weaponSearch: '',
  armorSearch: '',
  lootSearch: '',
  consumableSearch: '',
};

function run(
  data: DaggerheartDataModel,
  overrides: Partial<typeof BASE_PROPS> = {}
): ReturnType<typeof getDaggerheartSheetState> {
  return getDaggerheartSheetState({ data, ...BASE_PROPS, ...overrides });
}

describe('getDaggerheartSheetState', () => {
  it('flags class/ancestry/community/subclass as missing when set but unresolved', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      class: 'Ghost Class',
      heritage: 'Ghost Ancestry',
      community: 'Ghost Community',
      subclass: 'Ghost Subclass',
    };

    const state = run(data);

    expect(state.selectedClass).toBeUndefined();
    expect(state.classValueMissing).toBe(true);
    expect(state.ancestryValueMissing).toBe(true);
    expect(state.communityValueMissing).toBe(true);
    expect(state.subclassValueMissing).toBe(true);
  });

  it('resolves a stowed weapon, dropping inventory ids that have no matching option', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      weapons: { primaryId: '', secondaryId: '', inventoryIds: ['axe', 'phantom'] },
    };

    const state = run(data, { weaponOptions: [makeWeapon('axe', 'primary')] });

    // 'axe' resolves; 'phantom' has no option and is filtered out (lines 85-87).
    expect(state.stowedWeapons.map((weapon) => weapon.id)).toEqual(['axe']);
  });

  it('filters primary/secondary weapons by tier and matches a query against the feature text', () => {
    const data: DaggerheartDataModel = { ...createDefaultDaggerheartData(), level: 1 };
    const weaponOptions = [
      makeWeapon('low-primary', 'primary', { tier: 1, feature: 'Reliable' }),
      makeWeapon('high-primary', 'primary', { tier: 3, feature: 'Reliable' }),
      makeWeapon('low-secondary', 'secondary', { tier: 1, feature: 'Reliable' }),
    ];

    // currentTier === 1 hides the tier-3 weapon entirely.
    const tiered = run(data, { weaponOptions });
    expect(tiered.currentTier).toBe(1);
    expect(tiered.filteredPrimaryWeapons.map((weapon) => weapon.id)).toEqual(['low-primary']);
    expect(tiered.filteredSecondaryWeapons.map((weapon) => weapon.id)).toEqual(['low-secondary']);

    // A feature-only match keeps the tier-eligible primary (matchesQuery, line 43-44).
    const searched = run(data, { weaponOptions, weaponSearch: 'reliable' });
    expect(searched.filteredPrimaryWeapons.map((weapon) => weapon.id)).toEqual(['low-primary']);

    // A query matching nothing yields an empty list.
    const empty = run(data, { weaponOptions, weaponSearch: 'zzz-nomatch' });
    expect(empty.filteredPrimaryWeapons).toEqual([]);
  });

  it('matches loot purely by a tag when name and description do not match', () => {
    const lootOptions = [
      makeLoot('relic-shard', { name: 'Shard', description: 'A fragment.', tags: ['relic'] }),
      makeLoot('plain-rope', { name: 'Rope', description: 'Sturdy cord.', tags: ['mundane'] }),
    ];

    const state = run(createDefaultDaggerheartData(), { lootOptions, lootSearch: 'relic' });

    // 'relic' only appears in the tags of the first item (line 167).
    expect(state.filteredLoot.map((loot) => loot.id)).toEqual(['relic-shard']);
  });

  it('matches consumables purely by a tag when name and description do not match', () => {
    const consumableOptions = [
      makeConsumable('healing-tonic', {
        name: 'Tonic',
        description: 'Restores vigor.',
        tags: ['potion'],
      }),
      makeConsumable('smoke-pellet', {
        name: 'Pellet',
        description: 'Obscures sight.',
        tags: ['utility'],
      }),
    ];

    const state = run(createDefaultDaggerheartData(), {
      consumableOptions,
      consumableSearch: 'potion',
    });

    // 'potion' only appears in the tags of the first consumable (line 177).
    expect(state.filteredConsumables.map((item) => item.id)).toEqual(['healing-tonic']);
  });

  it('reports loading state from optionsState', () => {
    const state = run(createDefaultDaggerheartData(), { optionsState: 'loading' });
    expect(state.loadingOptions).toBe(true);
  });
});
