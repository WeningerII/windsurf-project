import type { SystemValidator, ValidationContext, ValidationIssue } from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type {
  DaggerheartAncestry,
  DaggerheartArmor,
  DaggerheartClass,
  DaggerheartCommunity,
  DaggerheartDomainCard,
  DaggerheartInventoryDefinition,
  DaggerheartWeapon,
} from '../../types/daggerheart';
import {
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartArmorForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
  loadDaggerheartConsumablesForSystem,
  loadDaggerheartDomainCardsForSystem,
  loadDaggerheartLootForSystem,
  loadDaggerheartWeaponsForSystem,
} from '../../utils/dataLoader';
import { stripDiacritics } from '../../utils/unicode';
import { getDaggerheartStartingTraitArray } from '../../rules/daggerheartDerived';
import { MAX_DAGGERHEART_CONSUMABLE_QUANTITY } from '../../rules/daggerheartInventory';
import type { DaggerheartDataModel } from './data-model';
import { INVENTORY_WEAPON_LIMIT, LOADOUT_LIMIT } from './daggerheartSheetConstants';

/**
 * Daggerheart SystemValidator.
 *
 * Checks are derived from Daggerheart's own rules model — never d20 shapes:
 * - character level bounds (SRD 1.0: Leveling Up, levels 1-10)
 * - class / subclass / ancestry ("heritage") / community references resolve in
 *   the loader-backed, open-content-filtered SRD catalogs. The loaders run
 *   every catalog through `filterOpenContentBySource` (strictOpenContentPolicy
 *   for `daggerheart`), so an id that resolves here is open-content compliant
 *   by construction and non-open sources can never validate as legal.
 * - domain-card legality: resolved cards must belong to one of the class's two
 *   domains (`DaggerheartClass.domains`) and have a card level at or below the
 *   character's level (SRD 1.0: Domain Cards / Leveling Up).
 * - loadout size: at most LOADOUT_LIMIT (5) non-vault cards — the same
 *   constant the sheet mutation layer and normalization enforce.
 * - weapon burden: equipped primary + secondary burden must fit two hands
 *   (total burden <= 2, mirroring `getDaggerheartSheetState`), slots must hold
 *   the matching weapon category, and at most INVENTORY_WEAPON_LIMIT stowed
 *   inventory weapons.
 * - trait array: at level 1, assigned trait modifiers should match the
 *   character-creation baseline +2/+1/+1/+0/+0/-1
 *   (`getDaggerheartStartingTraitArray`, SRD 1.0: Character Creation).
 * - equipment/inventory ids resolve; consumables respect their max quantity.
 *
 * Deliberately never flagged: triggered / timing / choice-based / narrative
 * card behavior (`automationMode` of 'triggered-manual' or 'reference-only')
 * is GM-adjudicated by design — an enumerated accepted manual boundary (see
 * docs/srd-manifest/_exclusions.ts). Unresolved or manual card references are
 * reported as WARNINGS at most so they survive import unchanged.
 *
 * Everything content-related is warn/annotate only ('warning' or 'info'); the
 * only 'error' is a cross-system routing mismatch, mirroring the registry's
 * own unknown-system contract. Validators never mutate the document.
 */

const MIN_CHARACTER_LEVEL = 1;
const MAX_CHARACTER_LEVEL = 10;

const TRAIT_IDS = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'] as const;

/** Deliberate non-catalog inventory entries (sheet custom items, class /
 * community template items) — annotated never, resolved never. */
const CUSTOM_INVENTORY_PREFIXES = ['custom-item:', 'template:'];

type NamedEntry = { id: string; name: string };

type DaggerheartValidationData = {
  classLookup: Map<string, DaggerheartClass>;
  ancestryLookup: Map<string, DaggerheartAncestry>;
  communityLookup: Map<string, DaggerheartCommunity>;
  cardLookup: Map<string, DaggerheartDomainCard>;
  cardByDomainAndName: Map<string, DaggerheartDomainCard>;
  cardByName: Map<string, DaggerheartDomainCard>;
  weaponLookup: Map<string, DaggerheartWeapon>;
  armorLookup: Map<string, DaggerheartArmor>;
  inventoryLookup: Map<string, DaggerheartInventoryDefinition>;
};

/** Same key normalization the sheet's normalization layer uses, so documents
 * storing display names (e.g. `class: 'Warrior'`) resolve identically. */
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

async function loadValidationData(): Promise<DaggerheartValidationData> {
  const [classes, ancestries, communities, cards, weapons, armor, loot, consumables] =
    await Promise.all([
      loadDaggerheartClassesForSystem('daggerheart'),
      loadDaggerheartAncestriesForSystem('daggerheart'),
      loadDaggerheartCommunitiesForSystem('daggerheart'),
      loadDaggerheartDomainCardsForSystem('daggerheart'),
      loadDaggerheartWeaponsForSystem('daggerheart'),
      loadDaggerheartArmorForSystem('daggerheart'),
      loadDaggerheartLootForSystem('daggerheart'),
      loadDaggerheartConsumablesForSystem('daggerheart'),
    ]);

  const cardByDomainAndName = new Map<string, DaggerheartDomainCard>();
  const cardByName = new Map<string, DaggerheartDomainCard>();
  cards.forEach((card) => {
    const nameKey = normalizeLookupKey(card.name);
    cardByDomainAndName.set(`${normalizeLookupKey(card.domain)}::${nameKey}`, card);
    if (!cardByName.has(nameKey)) {
      cardByName.set(nameKey, card);
    }
  });

  return {
    classLookup: buildLookup(classes),
    ancestryLookup: buildLookup(ancestries),
    communityLookup: buildLookup(communities),
    cardLookup: buildLookup(cards),
    cardByDomainAndName,
    cardByName,
    weaponLookup: buildLookup(weapons),
    armorLookup: buildLookup(armor),
    inventoryLookup: buildLookup([...loot, ...consumables]),
  };
}

export function createDaggerheartValidator(): SystemValidator<DaggerheartDataModel> {
  return {
    validateDocument: (document, context) => validateDaggerheartDocument(document, context),
  };
}

async function validateDaggerheartDocument(
  document: CharacterDocument<DaggerheartDataModel>,
  context: ValidationContext
) {
  const issues: ValidationIssue[] = [];
  const data = await loadValidationData();
  const system = document.system;

  if (document.systemId !== 'daggerheart') {
    addIssue(issues, context, {
      code: 'daggerheart-system-mismatch',
      severity: 'error',
      path: 'systemId',
      message: `Expected daggerheart but document is '${document.systemId}'.`,
      recoverable: false,
    });
  }

  validateLevel(issues, context, system.level);
  const selectedClass = validateIdentity(issues, context, system, data);
  validateTraits(issues, context, system);
  validateDomainCards(issues, context, system, selectedClass, data);
  validateWeapons(issues, context, system, data);
  validateArmor(issues, context, system, data);
  validateInventory(issues, context, system, data);

  return { issues };
}

function validateLevel(issues: ValidationIssue[], context: ValidationContext, level: number) {
  if (!isIntegerInRange(level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL)) {
    addIssue(issues, context, {
      code: 'daggerheart-invalid-level',
      severity: 'warning',
      path: 'system.level',
      message: 'Character level should be an integer from 1 through 10 (SRD 1.0: Leveling Up).',
      recoverable: true,
      details: { value: level },
    });
  }
}

function validateIdentity(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  data: DaggerheartValidationData
): DaggerheartClass | undefined {
  const selectedClass = resolveNamedEntry(system.class, data.classLookup);

  if (system.class && !selectedClass) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-class',
      severity: 'warning',
      path: 'system.class',
      message: `Class '${system.class}' is not in the open-content Daggerheart SRD catalog.`,
      recoverable: true,
      details: { class: system.class },
    });
  }

  if (system.subclass && selectedClass) {
    const subclassKey = normalizeLookupKey(system.subclass);
    const subclass = selectedClass.subclasses.find(
      (candidate) =>
        normalizeLookupKey(candidate.id) === subclassKey ||
        normalizeLookupKey(candidate.name) === subclassKey
    );

    if (!subclass) {
      addIssue(issues, context, {
        code: 'daggerheart-unknown-subclass',
        severity: 'warning',
        path: 'system.subclass',
        message: `Subclass '${system.subclass}' is not one of ${selectedClass.name}'s subclasses.`,
        recoverable: true,
        details: {
          subclass: system.subclass,
          classId: selectedClass.id,
          availableSubclassIds: selectedClass.subclasses.map((candidate) => candidate.id),
        },
      });
    }
  }

  if (system.heritage && !resolveNamedEntry(system.heritage, data.ancestryLookup)) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-heritage',
      severity: 'warning',
      path: 'system.heritage',
      message: `Ancestry '${system.heritage}' is not in the open-content Daggerheart SRD catalog.`,
      recoverable: true,
      details: { heritage: system.heritage },
    });
  }

  if (system.community && !resolveNamedEntry(system.community, data.communityLookup)) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-community',
      severity: 'warning',
      path: 'system.community',
      message: `Community '${system.community}' is not in the open-content Daggerheart SRD catalog.`,
      recoverable: true,
      details: { community: system.community },
    });
  }

  return selectedClass;
}

function validateTraits(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel
) {
  const values = TRAIT_IDS.map((traitId) => system.attributes[traitId]);

  TRAIT_IDS.forEach((traitId) => {
    const value = system.attributes[traitId];
    if (!Number.isInteger(value)) {
      addIssue(issues, context, {
        code: 'daggerheart-invalid-trait',
        severity: 'warning',
        path: `system.attributes.${traitId}`,
        message: `Trait '${traitId}' should be an integer modifier.`,
        recoverable: true,
        details: { traitId, value },
      });
    }
  });

  // All-zero traits are an unassigned default sheet, not an illegal spread.
  if (values.every((value) => value === 0)) {
    return;
  }

  // The +2/+1/+1/+0/+0/-1 spread is a character-creation baseline; from level
  // 2 on, advancements legally raise traits, so the check only applies at 1.
  if (system.level !== 1 || !values.every((value) => Number.isInteger(value))) {
    return;
  }

  const baseline = getDaggerheartStartingTraitArray().sort((a, b) => b - a);
  const sorted = [...values].sort((a, b) => b - a);
  const matchesBaseline =
    sorted.length === baseline.length && sorted.every((value, index) => value === baseline[index]);

  if (!matchesBaseline) {
    addIssue(issues, context, {
      code: 'daggerheart-trait-array-mismatch',
      severity: 'warning',
      path: 'system.attributes',
      message:
        'Level-1 trait modifiers do not match the character-creation array +2, +1, +1, +0, +0, -1 (SRD 1.0: Character Creation).',
      recoverable: true,
      details: { values: sorted, baseline },
    });
  }
}

function resolveDomainCard(
  entry: DaggerheartDataModel['domainCards'][number],
  data: DaggerheartValidationData
): DaggerheartDomainCard | undefined {
  const direct =
    resolveNamedEntry(entry.cardId, data.cardLookup) ??
    resolveNamedEntry(entry.id, data.cardLookup);
  if (direct) {
    return direct;
  }

  const nameKey = normalizeLookupKey(entry.name ?? '');
  if (!nameKey) {
    return undefined;
  }

  const domainKey = normalizeLookupKey(String(entry.domain ?? ''));
  return (
    (domainKey ? data.cardByDomainAndName.get(`${domainKey}::${nameKey}`) : undefined) ??
    data.cardByName.get(nameKey)
  );
}

function validateDomainCards(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  selectedClass: DaggerheartClass | undefined,
  data: DaggerheartValidationData
) {
  const domainCards = Array.isArray(system.domainCards) ? system.domainCards : [];
  let loadoutCount = 0;

  domainCards.forEach((entry, index) => {
    const path = `system.domainCards.${index}`;

    if (entry.location !== 'vault') {
      loadoutCount += 1;
    }

    const card = resolveDomainCard(entry, data);

    if (!card) {
      // Manual / homebrew / GM-adjudicated card references survive import by
      // design — a warning at most, never an error.
      addIssue(issues, context, {
        code: 'daggerheart-unresolved-domain-card',
        severity: 'warning',
        path,
        message: `Domain card '${entry.name || entry.cardId || entry.id}' is not in the open-content Daggerheart SRD catalog; kept as a manually adjudicated card.`,
        recoverable: true,
        details: { cardId: entry.cardId, name: entry.name },
      });
      return;
    }

    // Triggered / timing / choice-based / narrative card resolution
    // (automationMode 'triggered-manual' / 'reference-only') is GM-adjudicated
    // by design and deliberately never inspected here.

    if (selectedClass && !selectedClass.domains.includes(card.domain)) {
      addIssue(issues, context, {
        code: 'daggerheart-card-out-of-domain',
        severity: 'warning',
        path: `${path}.domain`,
        message: `'${card.name}' belongs to the ${card.domain} domain, which is outside ${selectedClass.name}'s domains (${selectedClass.domains.join(', ')}).`,
        recoverable: true,
        details: {
          cardId: card.id,
          cardDomain: card.domain,
          classId: selectedClass.id,
          classDomains: selectedClass.domains,
        },
      });
    }

    if (
      isIntegerInRange(system.level, MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL) &&
      card.level > system.level
    ) {
      addIssue(issues, context, {
        code: 'daggerheart-card-above-level',
        severity: 'warning',
        path: `${path}.level`,
        message: `'${card.name}' is a level-${card.level} card, above character level ${system.level} (SRD 1.0: domain cards are chosen at or below your level).`,
        recoverable: true,
        details: { cardId: card.id, cardLevel: card.level, characterLevel: system.level },
      });
    }
  });

  if (loadoutCount > LOADOUT_LIMIT) {
    addIssue(issues, context, {
      code: 'daggerheart-loadout-over-limit',
      severity: 'warning',
      path: 'system.domainCards',
      message: `Loadout holds ${loadoutCount} cards, above the ${LOADOUT_LIMIT}-card limit; extras belong in the vault (SRD 1.0: Loadout & Vault).`,
      recoverable: true,
      details: { loadoutCount, limit: LOADOUT_LIMIT },
    });
  }
}

function validateWeapons(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  data: DaggerheartValidationData
) {
  const weapons = system.weapons ?? { primaryId: '', secondaryId: '', inventoryIds: [] };
  const primary = resolveWeaponSlot(issues, context, weapons.primaryId, 'primary', data);
  const secondary = resolveWeaponSlot(issues, context, weapons.secondaryId, 'secondary', data);

  // Two hands total: a burden-2 primary (two-handed) leaves no room for a
  // secondary. Same math as getDaggerheartSheetState's activeBurden/2 cap.
  const activeBurden = (primary?.burden || 0) + (secondary?.burden || 0);
  if (activeBurden > 2) {
    addIssue(issues, context, {
      code: 'daggerheart-over-burden',
      severity: 'warning',
      path: 'system.weapons',
      message: `Equipped weapons total burden ${activeBurden}, above the 2 hands available (SRD 1.0: Burden).`,
      recoverable: true,
      details: {
        activeBurden,
        primaryId: primary?.id,
        primaryBurden: primary?.burden,
        secondaryId: secondary?.id,
        secondaryBurden: secondary?.burden,
      },
    });
  }

  const inventoryIds = Array.isArray(weapons.inventoryIds) ? weapons.inventoryIds : [];
  inventoryIds.forEach((weaponId, index) => {
    if (weaponId && !resolveNamedEntry(weaponId, data.weaponLookup)) {
      addIssue(issues, context, {
        code: 'daggerheart-unknown-weapon',
        severity: 'warning',
        path: `system.weapons.inventoryIds.${index}`,
        message: `Weapon '${weaponId}' is not in the open-content Daggerheart SRD catalog.`,
        recoverable: true,
        details: { weaponId },
      });
    }
  });

  if (inventoryIds.length > INVENTORY_WEAPON_LIMIT) {
    addIssue(issues, context, {
      code: 'daggerheart-too-many-stowed-weapons',
      severity: 'warning',
      path: 'system.weapons.inventoryIds',
      message: `Carrying ${inventoryIds.length} stowed weapons, above the sheet's ${INVENTORY_WEAPON_LIMIT}-weapon inventory limit.`,
      recoverable: true,
      details: { count: inventoryIds.length, limit: INVENTORY_WEAPON_LIMIT },
    });
  }
}

function resolveWeaponSlot(
  issues: ValidationIssue[],
  context: ValidationContext,
  weaponId: string,
  slot: 'primary' | 'secondary',
  data: DaggerheartValidationData
): DaggerheartWeapon | undefined {
  if (!weaponId) {
    return undefined;
  }

  const weapon = resolveNamedEntry(weaponId, data.weaponLookup);
  const path = `system.weapons.${slot}Id`;

  if (!weapon) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-weapon',
      severity: 'warning',
      path,
      message: `Weapon '${weaponId}' is not in the open-content Daggerheart SRD catalog.`,
      recoverable: true,
      details: { weaponId, slot },
    });
    return undefined;
  }

  if (weapon.category !== slot) {
    addIssue(issues, context, {
      code: 'daggerheart-weapon-slot-category-mismatch',
      severity: 'warning',
      path,
      message: `'${weapon.name}' is a ${weapon.category} weapon equipped in the ${slot} slot.`,
      recoverable: true,
      details: { weaponId: weapon.id, category: weapon.category, slot },
    });
  }

  return weapon;
}

function validateArmor(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  data: DaggerheartValidationData
) {
  if (system.armorId && !resolveNamedEntry(system.armorId, data.armorLookup)) {
    addIssue(issues, context, {
      code: 'daggerheart-unknown-armor',
      severity: 'warning',
      path: 'system.armorId',
      message: `Armor '${system.armorId}' is not in the open-content Daggerheart SRD catalog.`,
      recoverable: true,
      details: { armorId: system.armorId },
    });
  }
}

function validateInventory(
  issues: ValidationIssue[],
  context: ValidationContext,
  system: DaggerheartDataModel,
  data: DaggerheartValidationData
) {
  const inventory = Array.isArray(system.inventory) ? system.inventory : [];

  inventory.forEach((entry, index) => {
    const path = `system.inventory.${index}`;

    if (CUSTOM_INVENTORY_PREFIXES.some((prefix) => entry.itemId?.startsWith(prefix))) {
      return;
    }

    const definition =
      resolveNamedEntry(entry.itemId, data.inventoryLookup) ??
      resolveNamedEntry(entry.name, data.inventoryLookup);

    if (!definition) {
      // Free-form gear is first-class on the sheet — annotate only.
      addIssue(issues, context, {
        code: 'daggerheart-unknown-inventory-item',
        severity: 'info',
        path: `${path}.itemId`,
        message: `Item '${entry.name || entry.itemId}' is not in the open-content Daggerheart SRD catalog; kept as custom gear.`,
        recoverable: true,
        details: { itemId: entry.itemId, name: entry.name },
      });
      return;
    }

    if (
      definition.category === 'consumable' &&
      entry.quantity > MAX_DAGGERHEART_CONSUMABLE_QUANTITY
    ) {
      addIssue(issues, context, {
        code: 'daggerheart-consumable-over-max',
        severity: 'warning',
        path: `${path}.quantity`,
        message: `'${definition.name}' quantity ${entry.quantity} is above the consumable maximum of ${MAX_DAGGERHEART_CONSUMABLE_QUANTITY} (SRD 1.0: Consumables).`,
        recoverable: true,
        details: {
          itemId: definition.id,
          quantity: entry.quantity,
          max: MAX_DAGGERHEART_CONSUMABLE_QUANTITY,
        },
      });
    }
  });
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function addIssue(
  issues: ValidationIssue[],
  context: ValidationContext,
  issue: ValidationIssue
): void {
  const source = issue.source ?? context.source ?? context.reason;
  issues.push(source ? { ...issue, source } : issue);
}
