import type { CharacterDocument } from '../../types/core/document';
import { daggerheartAncestries } from '../../data/daggerheart/1.0/ancestries';
import { daggerheartClasses } from '../../data/daggerheart/1.0/classes';
import { daggerheartCommunities } from '../../data/daggerheart/1.0/communities';
import { daggerheartDomainCards } from '../../data/daggerheart/1.0/domain-cards';
import { daggerheartDomains } from '../../data/daggerheart/1.0/domains';
import { daggerheartArmor } from '../../data/daggerheart/1.0/equipment/armor';
import { daggerheartWeapons } from '../../data/daggerheart/1.0/equipment/weapons';
import type { DaggerheartClass, DaggerheartDomainCard } from '../../types/daggerheart';
import { createDefaultDaggerheartData, type DaggerheartDataModel } from './data-model';
import { getDaggerheartAncestryAdjustments } from '../../rules/daggerheartDerived';
import {
  applyDaggerheartClassTemplate,
  applyDaggerheartCommunityTemplate,
} from './daggerheartTemplate';
import {
  clampDaggerheartInventoryQuantity,
  findDaggerheartInventoryDefinitionByName,
  getDaggerheartInventoryDefinition,
} from './daggerheartInventory';
import { LOADOUT_LIMIT } from './daggerheartSheetConstants';
import { stripDiacritics } from '../../utils/unicode';

const DEFAULTS = createDefaultDaggerheartData();

type NamedEntry = {
  id: string;
  name: string;
};

type SubclassEntry = {
  classData: DaggerheartClass;
  subclass: DaggerheartClass['subclasses'][number];
};

function normalizeLookupKey(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildLookup<T extends NamedEntry>(entries: T[]): Map<string, T> {
  const lookup = new Map<string, T>();

  entries.forEach((entry) => {
    lookup.set(normalizeLookupKey(entry.id), entry);
    lookup.set(normalizeLookupKey(entry.name), entry);
  });

  return lookup;
}

function resolveNamedEntry<T extends NamedEntry>(
  value: string | undefined,
  lookup: Map<string, T>
): T | undefined {
  if (!value) {
    return undefined;
  }

  return lookup.get(normalizeLookupKey(value));
}

function resolveNamedEntryId<T extends NamedEntry>(
  value: string | undefined,
  lookup: Map<string, T>
): string {
  return resolveNamedEntry(value, lookup)?.id ?? value ?? '';
}

const classLookup = buildLookup(daggerheartClasses);
const ancestryLookup = buildLookup(daggerheartAncestries);
const communityLookup = buildLookup(daggerheartCommunities);
const domainLookup = buildLookup(daggerheartDomains);
const weaponLookup = buildLookup(daggerheartWeapons);
const armorLookup = buildLookup(daggerheartArmor);
const domainCardLookup = buildLookup(daggerheartDomainCards);

const subclassEntries: SubclassEntry[] = daggerheartClasses.flatMap((classData) =>
  classData.subclasses.map((subclass) => ({ classData, subclass }))
);
const subclassLookup = new Map<string, SubclassEntry>();
const domainCardByNameAndDomain = new Map<string, DaggerheartDomainCard>();
const domainCardByName = new Map<string, DaggerheartDomainCard>();

subclassEntries.forEach((entry) => {
  subclassLookup.set(normalizeLookupKey(entry.subclass.id), entry);
  subclassLookup.set(normalizeLookupKey(entry.subclass.name), entry);
});

daggerheartDomainCards.forEach((card) => {
  const nameKey = normalizeLookupKey(card.name);
  const domainKey = normalizeLookupKey(card.domain);

  if (!domainCardByName.has(nameKey)) {
    domainCardByName.set(nameKey, card);
  }
  domainCardByNameAndDomain.set(`${domainKey}::${nameKey}`, card);
});

function resolveSubclassForClass(
  classData: DaggerheartClass | undefined,
  value: string | undefined
): DaggerheartClass['subclasses'][number] | undefined {
  if (!classData || !value) {
    return undefined;
  }

  const normalized = normalizeLookupKey(value);
  return classData.subclasses.find(
    (subclass) =>
      normalizeLookupKey(subclass.id) === normalized ||
      normalizeLookupKey(subclass.name) === normalized
  );
}

function resolveGlobalSubclass(value: string | undefined): SubclassEntry | undefined {
  if (!value) {
    return undefined;
  }

  return subclassLookup.get(normalizeLookupKey(value));
}

function resolveDomainCard(entry: DaggerheartDataModel['domainCards'][number]) {
  const direct =
    resolveNamedEntry(entry.cardId, domainCardLookup) ??
    resolveNamedEntry(entry.id, domainCardLookup);
  if (direct) {
    return direct;
  }

  const nameKey = normalizeLookupKey(entry.name);
  if (!nameKey) {
    return undefined;
  }

  const domainKey = normalizeLookupKey(String(entry.domain ?? ''));
  return (
    (domainKey ? domainCardByNameAndDomain.get(`${domainKey}::${nameKey}`) : undefined) ??
    domainCardByName.get(nameKey)
  );
}

function normalizeInventoryEntries(
  inventory: DaggerheartDataModel['inventory']
): DaggerheartDataModel['inventory'] {
  return inventory.map((entry, index) => {
    const definition =
      getDaggerheartInventoryDefinition(entry.itemId) ??
      findDaggerheartInventoryDefinitionByName(entry.name);
    const itemId = definition?.id || entry.itemId || `custom-item:legacy-${index}`;

    return {
      ...entry,
      itemId,
      name: definition?.name ?? entry.name,
      quantity: clampDaggerheartInventoryQuantity(itemId, entry.quantity),
      description: entry.description ?? '',
    };
  });
}

function normalizeDomainCardEntries(
  domainCards: DaggerheartDataModel['domainCards']
): DaggerheartDataModel['domainCards'] {
  // Legacy/imported documents may carry more than LOADOUT_LIMIT non-vault
  // cards (the mutation layer enforces the cap, but nothing repairs
  // pre-existing violations). Spill the excess into the vault in stable
  // document order so passive bonuses cannot exceed the 5-card loadout.
  let loadoutCount = 0;

  return domainCards.map((entry, index) => {
    const definition = resolveDomainCard(entry);
    const normalizedDomain = resolveNamedEntry(String(entry.domain ?? ''), domainLookup);
    let location: 'loadout' | 'vault' = entry.location === 'vault' ? 'vault' : 'loadout';
    if (location === 'loadout') {
      loadoutCount += 1;
      if (loadoutCount > LOADOUT_LIMIT) {
        location = 'vault';
      }
    }

    return {
      ...entry,
      id: entry.id || entry.cardId || definition?.id || `legacy-card:${index}`,
      cardId: definition?.id ?? entry.cardId,
      name: definition?.name ?? entry.name,
      domain: definition?.domain ?? normalizedDomain?.id ?? entry.domain,
      level:
        definition?.level ??
        Math.max(1, Number.isFinite(entry.level) ? Math.trunc(entry.level) : 1),
      type: definition?.type ?? entry.type,
      recallCost: definition?.recallCost ?? entry.recallCost,
      location,
      description: definition?.description ?? entry.description ?? '',
    };
  });
}

function looksLikeLegacyStarterState(system: DaggerheartDataModel): boolean {
  return (
    system.inventory.length === 0 &&
    system.domainCards.length === 0 &&
    system.weapons.primaryId === DEFAULTS.weapons.primaryId &&
    system.weapons.secondaryId === DEFAULTS.weapons.secondaryId &&
    system.weapons.inventoryIds.length === 0 &&
    system.armorId === DEFAULTS.armorId &&
    system.evasion === DEFAULTS.evasion &&
    system.hitPoints.current === DEFAULTS.hitPoints.current &&
    system.hitPoints.max === DEFAULTS.hitPoints.max
  );
}

export function normalizeDaggerheartDocument(
  document: CharacterDocument<DaggerheartDataModel>
): CharacterDocument<DaggerheartDataModel> {
  let nextDocument = structuredClone(document);
  let system = nextDocument.system;

  let selectedClass = resolveNamedEntry(system.class, classLookup);
  if (selectedClass) {
    system.class = selectedClass.name;
  }

  const selectedAncestry = resolveNamedEntry(system.heritage, ancestryLookup);
  if (selectedAncestry) {
    system.heritage = selectedAncestry.name;
  }

  const selectedCommunity = resolveNamedEntry(system.community, communityLookup);
  if (selectedCommunity) {
    system.community = selectedCommunity.name;
  }

  let selectedSubclass = resolveSubclassForClass(selectedClass, system.subclass);
  if (!selectedClass) {
    const globalSubclass = resolveGlobalSubclass(system.subclass);
    if (globalSubclass) {
      selectedClass = globalSubclass.classData;
      selectedSubclass = globalSubclass.subclass;
      system.class = globalSubclass.classData.name;
    }
  }
  if (selectedSubclass) {
    system.subclass = selectedSubclass.name;
  }

  const isLegacyStarterState = looksLikeLegacyStarterState(system);
  if (isLegacyStarterState) {
    if (selectedClass) {
      nextDocument = applyDaggerheartClassTemplate(nextDocument, selectedClass, {
        ancestry: selectedAncestry,
        subclassName: nextDocument.system.subclass || undefined,
      });
    }
    if (selectedCommunity) {
      nextDocument = applyDaggerheartCommunityTemplate(nextDocument, selectedCommunity);
    }
    system = nextDocument.system;
  }

  const normalizedPrimaryId = resolveNamedEntryId(system.weapons.primaryId, weaponLookup);
  const normalizedSecondaryId = resolveNamedEntryId(system.weapons.secondaryId, weaponLookup);
  const normalizedInventoryWeaponIds = Array.from(
    new Set(
      (system.weapons.inventoryIds || [])
        .map((weaponId) => resolveNamedEntryId(weaponId, weaponLookup))
        .filter(
          (weaponId) =>
            weaponId && weaponId !== normalizedPrimaryId && weaponId !== normalizedSecondaryId
        )
    )
  );

  system.weapons = {
    ...system.weapons,
    primaryId: normalizedPrimaryId,
    secondaryId: normalizedSecondaryId,
    inventoryIds: normalizedInventoryWeaponIds,
  };
  system.armorId = resolveNamedEntryId(system.armorId, armorLookup);
  system.inventory = normalizeInventoryEntries(system.inventory || []);
  system.domainCards = normalizeDomainCardEntries(system.domainCards || []);

  // Hydrating HP/evasion from the class base is only safe for blank legacy
  // starter sheets. Without the gate, any legitimate document whose HP happens
  // to equal the default {6, 6} (e.g. a Bard whose max was raised to 6 by an
  // import or future advancement) would silently snap back to the class base
  // on every prepareData.
  const ancestryAdjustments = getDaggerheartAncestryAdjustments(selectedAncestry);
  if (isLegacyStarterState && selectedClass && system.evasion === DEFAULTS.evasion) {
    system.evasion = selectedClass.startingEvasion + ancestryAdjustments.evasion;
  }

  if (
    isLegacyStarterState &&
    selectedClass &&
    system.hitPoints.current === DEFAULTS.hitPoints.current &&
    system.hitPoints.max === DEFAULTS.hitPoints.max
  ) {
    const startingHp = selectedClass.startingHitPoints + ancestryAdjustments.hitPoints;
    system.hitPoints = {
      current: startingHp,
      max: startingHp,
    };
  }

  if (system.stress.max === DEFAULTS.stress.max && ancestryAdjustments.stress !== 0) {
    const nextStressMax = DEFAULTS.stress.max + ancestryAdjustments.stress;
    system.stress = {
      current: Math.min(system.stress.current, nextStressMax),
      max: nextStressMax,
    };
  }

  return nextDocument;
}
