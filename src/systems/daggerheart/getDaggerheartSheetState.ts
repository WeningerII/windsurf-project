import type {
  DaggerheartAncestry,
  DaggerheartArmor,
  DaggerheartClass,
  DaggerheartCommunity,
  DaggerheartConsumable,
  DaggerheartDomain,
  DaggerheartDomainCard,
  DaggerheartLoot,
  DaggerheartWeapon,
} from '../../types/daggerheart';
import {
  getDaggerheartDerivedStats,
  getDaggerheartEffectiveAttribute,
  getDaggerheartTier,
} from '../../utils/daggerheartDerived';
import {
  getDaggerheartInventoryDefinition,
  normalizeDaggerheartCurrency,
} from '../../utils/daggerheartInventory';
import { ATTRIBUTES, EMPTY_WEAPON_LOADOUT } from './daggerheartSheetConstants';
import type { DaggerheartDataModel } from './data-model';

interface GetDaggerheartSheetStateProps {
  data: DaggerheartDataModel;
  optionsState: 'loading' | 'ready' | 'error';
  classOptions: DaggerheartClass[];
  ancestryOptions: DaggerheartAncestry[];
  communityOptions: DaggerheartCommunity[];
  domainOptions: DaggerheartDomain[];
  domainCardOptions: DaggerheartDomainCard[];
  weaponOptions: DaggerheartWeapon[];
  armorOptions: DaggerheartArmor[];
  lootOptions: DaggerheartLoot[];
  consumableOptions: DaggerheartConsumable[];
  domainCardSearch: string;
  weaponSearch: string;
  armorSearch: string;
  lootSearch: string;
  consumableSearch: string;
}

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export function getDaggerheartSheetState({
  data,
  optionsState,
  classOptions,
  ancestryOptions,
  communityOptions,
  domainOptions,
  domainCardOptions,
  weaponOptions,
  armorOptions,
  lootOptions,
  consumableOptions,
  domainCardSearch,
  weaponSearch,
  armorSearch,
  lootSearch,
  consumableSearch,
}: GetDaggerheartSheetStateProps) {
  const selectedClass = classOptions.find((entry) => entry.name === data.class);
  const selectedAncestry = ancestryOptions.find((entry) => entry.name === data.heritage);
  const selectedCommunity = communityOptions.find((entry) => entry.name === data.community);
  const currency = normalizeDaggerheartCurrency(
    data.currency ?? { handfuls: 0, bags: 0, chests: 0 }
  );
  const subclassOptions = selectedClass?.subclasses ?? [];
  const selectedSubclass = subclassOptions.find((entry) => entry.name === data.subclass);
  const classValueMissing = Boolean(data.class) && !selectedClass;
  const ancestryValueMissing = Boolean(data.heritage) && !selectedAncestry;
  const communityValueMissing = Boolean(data.community) && !selectedCommunity;
  const subclassValueMissing = Boolean(data.subclass) && !selectedSubclass;
  const weaponLoadout = data.weapons ?? EMPTY_WEAPON_LOADOUT;
  const currentTier = getDaggerheartTier(data.level);
  const activePrimaryWeapon = weaponLoadout.primaryId
    ? weaponOptions.find((entry) => entry.id === weaponLoadout.primaryId)
    : undefined;
  const activeSecondaryWeapon = weaponLoadout.secondaryId
    ? weaponOptions.find((entry) => entry.id === weaponLoadout.secondaryId)
    : undefined;
  const stowedWeapons = weaponLoadout.inventoryIds
    .map((weaponId) => weaponOptions.find((entry) => entry.id === weaponId))
    .filter((entry): entry is DaggerheartWeapon => Boolean(entry));
  const activeArmor = data.armorId
    ? armorOptions.find((entry) => entry.id === data.armorId)
    : undefined;
  const inventoryEntries = data.inventory.map((entry) => ({
    entry,
    definition: getDaggerheartInventoryDefinition(entry.itemId),
  }));
  const relicEntries = inventoryEntries.filter((item) => item.definition?.tags?.includes('relic'));
  const inventoryCounts = inventoryEntries.reduce(
    (counts, item) => {
      if (item.definition?.category === 'consumable') {
        counts.consumables += item.entry.quantity;
      } else {
        counts.loot += item.entry.quantity;
      }

      return counts;
    },
    { loot: 0, consumables: 0 }
  );
  const activeBurden = (activePrimaryWeapon?.burden || 0) + (activeSecondaryWeapon?.burden || 0);
  const availableSecondaryBurden = 2 - (activePrimaryWeapon?.burden || 0);
  const derivedStats = getDaggerheartDerivedStats({
    ...data,
    weapons: weaponLoadout,
  });
  const passiveSpellcastBonus = derivedStats.passiveBonuses.spellcast || 0;
  const effectiveAttributes = ATTRIBUTES.reduce(
    (result, attr) => {
      result[attr.id] = getDaggerheartEffectiveAttribute(
        {
          ...data,
          weapons: weaponLoadout,
        },
        attr.id
      );
      return result;
    },
    {} as Record<keyof DaggerheartDataModel['attributes'], number>
  );

  const weaponQuery = weaponSearch.trim().toLowerCase();
  const filteredPrimaryWeapons = weaponOptions.filter((entry) => {
    return (
      entry.category === 'primary' &&
      entry.tier <= currentTier &&
      (weaponQuery.length === 0 ||
        matchesQuery(entry.name, weaponQuery) ||
        matchesQuery(entry.damage, weaponQuery) ||
        matchesQuery(entry.feature || '', weaponQuery))
    );
  });
  const filteredSecondaryWeapons = weaponOptions.filter((entry) => {
    return (
      entry.category === 'secondary' &&
      entry.tier <= currentTier &&
      (weaponQuery.length === 0 ||
        matchesQuery(entry.name, weaponQuery) ||
        matchesQuery(entry.damage, weaponQuery) ||
        matchesQuery(entry.feature || '', weaponQuery))
    );
  });

  const armorQuery = armorSearch.trim().toLowerCase();
  const filteredArmor = armorOptions.filter((entry) => {
    return (
      entry.tier <= currentTier &&
      (armorQuery.length === 0 ||
        matchesQuery(entry.name, armorQuery) ||
        matchesQuery(entry.feature || '', armorQuery))
    );
  });

  const lootQuery = lootSearch.trim().toLowerCase();
  const filteredLoot = lootOptions.filter((entry) => {
    return (
      lootQuery.length === 0 ||
      matchesQuery(entry.name, lootQuery) ||
      matchesQuery(entry.description, lootQuery) ||
      (entry.tags || []).some((tag) => matchesQuery(tag, lootQuery))
    );
  });

  const consumableQuery = consumableSearch.trim().toLowerCase();
  const filteredConsumables = consumableOptions.filter((entry) => {
    return (
      consumableQuery.length === 0 ||
      matchesQuery(entry.name, consumableQuery) ||
      matchesQuery(entry.description, consumableQuery) ||
      (entry.tags || []).some((tag) => matchesQuery(tag, consumableQuery))
    );
  });

  const selectedDomainIds = selectedClass?.domains ?? [];
  const selectedDomains = selectedDomainIds
    .map((domainId) => domainOptions.find((entry) => entry.id === domainId))
    .filter((entry): entry is DaggerheartDomain => Boolean(entry));
  const availableDomainIds = selectedDomainIds.length
    ? selectedDomainIds
    : domainOptions.map((entry) => entry.id);
  const domainCardsById = Object.fromEntries(
    domainCardOptions.map((card) => [card.id, card])
  ) as Record<string, DaggerheartDomainCard>;
  const ownedDomainCardIds = new Set(data.domainCards.map((entry) => entry.cardId ?? entry.id));
  const ownedDomainCards = data.domainCards.map((entry) => {
    const definition = domainCardsById[entry.cardId ?? entry.id];
    return {
      entry: {
        ...entry,
        location: entry.location ?? 'loadout',
      },
      definition,
    };
  });
  const loadoutCards = ownedDomainCards.filter((entry) => entry.entry.location !== 'vault');
  const vaultCards = ownedDomainCards.filter((entry) => entry.entry.location === 'vault');
  const loadoutCount = loadoutCards.length;
  const domainQuery = domainCardSearch.trim().toLowerCase();
  const filteredDomainCards = domainCardOptions.filter((card) => {
    return (
      card.level <= data.level &&
      (availableDomainIds.length === 0 || availableDomainIds.includes(card.domain)) &&
      (domainQuery.length === 0 ||
        matchesQuery(card.name, domainQuery) ||
        matchesQuery(card.description, domainQuery) ||
        matchesQuery(card.domain, domainQuery))
    );
  });

  return {
    optionsState,
    loadingOptions: optionsState === 'loading',
    selectedClass,
    selectedAncestry,
    selectedCommunity,
    currency,
    subclassOptions,
    selectedSubclass,
    classValueMissing,
    ancestryValueMissing,
    communityValueMissing,
    subclassValueMissing,
    weaponLoadout,
    currentTier,
    activePrimaryWeapon,
    activeSecondaryWeapon,
    stowedWeapons,
    activeArmor,
    inventoryEntries,
    relicEntries,
    inventoryCounts,
    activeBurden,
    availableSecondaryBurden,
    derivedStats,
    passiveSpellcastBonus,
    effectiveAttributes,
    selectedDomains,
    ownedDomainCardIds,
    ownedDomainCards,
    loadoutCards,
    vaultCards,
    loadoutCount,
    filteredPrimaryWeapons,
    filteredSecondaryWeapons,
    filteredArmor,
    filteredLoot,
    filteredConsumables,
    filteredDomainCards,
  };
}
